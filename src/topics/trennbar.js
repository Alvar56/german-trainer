import { mc, order } from '../engine/helpers.js';
import { pick, shuffle } from '../lib/rng.js';
import { t } from '../lib/i18n.js';
import { tc } from '../lib/contenido/index.js';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// Verbos SEPARABLES: prefijo tónico que se va al final en la frase principal.
const SEP = [
  { inf: 'aufstehen', pref: 'auf', ich: 'stehe', er: 'steht', mid: ['jeden', 'Werktag', 'um', 'halb', 'sieben'], midEs: 'cada día laborable a las seis y media', es: 'levantarse', part: 'aufgestanden', zu: 'aufzustehen', wrong: ['aufstehen', 'aufgestehen'] },
  { inf: 'anrufen', pref: 'an', ich: 'rufe', er: 'ruft', mid: ['dich', 'heute', 'Abend', 'nach', 'dem', 'Essen'], midEs: 'esta noche después de cenar', es: 'llamar', part: 'angerufen', zu: 'anzurufen', wrong: ['anrufen', 'angeruft'] },
  { inf: 'einkaufen', pref: 'ein', ich: 'kaufe', er: 'kauft', mid: ['am', 'Samstag', 'für', 'die', 'ganze', 'Woche'], midEs: 'el sábado para toda la semana', es: 'hacer la compra', part: 'eingekauft', zu: 'einzukaufen', wrong: ['einkaufen', 'gekauft'] },
  { inf: 'vorbereiten', pref: 'vor', ich: 'bereite', er: 'bereitet', mid: ['die', 'Präsentation', 'für', 'die', 'Sitzung'], midEs: 'la presentación para la reunión', es: 'preparar', part: 'vorbereitet', zu: 'vorzubereiten', wrong: ['vorbereiten', 'vorgebereitet'] },
  { inf: 'abholen', pref: 'ab', ich: 'hole', er: 'holt', mid: ['die', 'Kinder', 'um', 'vier', 'vom', 'Kindergarten'], midEs: 'a los niños a las cuatro de la guardería', es: 'recoger', part: 'abgeholt', zu: 'abzuholen', wrong: ['abholen', 'abgeholen'] },
  { inf: 'anfangen', pref: 'an', ich: 'fange', er: 'fängt', mid: ['nächste', 'Woche', 'mit', 'dem', 'neuen', 'Kurs'], midEs: 'la semana que viene con el curso nuevo', es: 'empezar', part: 'angefangen', zu: 'anzufangen', wrong: ['anfangen', 'angefangt'] },
  { inf: 'aufhören', pref: 'auf', ich: 'höre', er: 'hört', mid: ['endlich', 'mit', 'dem', 'Rauchen'], midEs: 'por fin de fumar', es: 'dejar de', part: 'aufgehört', zu: 'aufzuhören', wrong: ['aufhören', 'aufgehören'] },
  { inf: 'mitkommen', pref: 'mit', ich: 'komme', er: 'kommt', mid: ['heute', 'Abend', 'ins', 'Konzert'], midEs: 'esta noche al concierto', es: 'venir (con)', part: 'mitgekommen', zu: 'mitzukommen', wrong: ['mitkommen', 'mitgekommt'] },
  { inf: 'aufräumen', pref: 'auf', ich: 'räume', er: 'räumt', mid: ['am', 'Wochenende', 'die', 'ganze', 'Wohnung'], midEs: 'toda la casa el finde', es: 'ordenar', part: 'aufgeräumt', zu: 'aufzuräumen', wrong: ['aufräumen', 'aufgeräumen'] },
  { inf: 'umsteigen', pref: 'um', ich: 'steige', er: 'steigt', mid: ['in', 'Frankfurt', 'in', 'den', 'Schnellzug'], midEs: 'en Fráncfort al tren rápido', es: 'hacer transbordo', part: 'umgestiegen', zu: 'umzusteigen', wrong: ['umsteigen', 'umgestiegt'] },
  { inf: 'einladen', pref: 'ein', ich: 'lade', er: 'lädt', mid: ['am', 'Freitag', 'ein', 'paar', 'Freunde', 'zum', 'Essen'], midEs: 'a unos amigos a cenar el viernes', es: 'invitar', part: 'eingeladen', zu: 'einzuladen', wrong: ['einladen', 'eingeladet'] },
  { inf: 'losfahren', pref: 'los', ich: 'fahre', er: 'fährt', mid: ['morgen', 'schon', 'vor', 'dem', 'Frühstück'], midEs: 'mañana ya antes del desayuno', es: 'salir (en coche)', part: 'losgefahren', zu: 'loszufahren', wrong: ['losfahren', 'losgefahrt'] },
  { inf: 'fernsehen', pref: 'fern', ich: 'sehe', er: 'sieht', mid: ['am', 'Abend', 'noch', 'eine', 'Stunde'], midEs: 'una hora por la noche', es: 'ver la tele', part: 'ferngesehen', zu: 'fernzusehen', wrong: ['fernsehen', 'gefernsehen'] },
  { inf: 'mitbringen', pref: 'mit', ich: 'bringe', er: 'bringt', mid: ['einen', 'selbstgebackenen', 'Kuchen', 'zur', 'Party'], midEs: 'una tarta casera a la fiesta', es: 'traer', part: 'mitgebracht', zu: 'mitzubringen', wrong: ['mitbringen', 'mitgebrachten'] },
  { inf: 'aussteigen', pref: 'aus', ich: 'steige', er: 'steigt', mid: ['am', 'Hauptbahnhof', 'aus', 'dem', 'Zug'], midEs: 'del tren en la estación central', es: 'bajarse', part: 'ausgestiegen', zu: 'auszusteigen', wrong: ['aussteigen', 'ausgesteigt'] },
  { inf: 'einsteigen', pref: 'ein', ich: 'steige', er: 'steigt', mid: ['an', 'der', 'nächsten', 'Haltestelle', 'in', 'den', 'Bus'], midEs: 'al autobús en la próxima parada', es: 'subirse', part: 'eingestiegen', zu: 'einzusteigen', wrong: ['einsteigen', 'eingesteigt'] },
  { inf: 'anziehen', pref: 'an', ich: 'ziehe', er: 'zieht', mid: ['eine', 'warme', 'Winterjacke'], midEs: 'una chaqueta de invierno abrigada', es: 'ponerse ropa', part: 'angezogen', zu: 'anzuziehen', wrong: ['anziehen', 'angezieht'] },
  { inf: 'ausfüllen', pref: 'aus', ich: 'fülle', er: 'füllt', mid: ['das', 'offizielle', 'Formular', 'sorgfältig'], midEs: 'el formulario oficial con cuidado', es: 'rellenar', part: 'ausgefüllt', zu: 'auszufüllen', wrong: ['ausfüllen', 'ausgefüllen'] },
  { inf: 'kennenlernen', pref: 'kennen', ich: 'lerne', er: 'lernt', mid: ['auf', 'der', 'Reise', 'viele', 'nette', 'Leute'], midEs: 'a mucha gente simpática en el viaje', es: 'conocer', part: 'kennengelernt', zu: 'kennenzulernen', wrong: ['kennenlernen', 'kennenlernt'] },
  { inf: 'zumachen', pref: 'zu', ich: 'mache', er: 'macht', mid: ['wegen', 'der', 'Kälte', 'das', 'Fenster'], midEs: 'la ventana por el frío', es: 'cerrar', part: 'zugemacht', zu: 'zuzumachen', wrong: ['zumachen', 'zuegemacht'] },
  { inf: 'aufmachen', pref: 'auf', ich: 'mache', er: 'macht', mid: ['am', 'Morgen', 'erst', 'mal', 'die', 'Fenster'], midEs: 'las ventanas por la mañana', es: 'abrir', part: 'aufgemacht', zu: 'aufzumachen', wrong: ['aufmachen', 'aufgemachen'] },
  { inf: 'zurückkommen', pref: 'zurück', ich: 'komme', er: 'kommt', mid: ['spät', 'in', 'der', 'Nacht', 'nach', 'Hause'], midEs: 'tarde por la noche a casa', es: 'volver', part: 'zurückgekommen', zu: 'zurückzukommen', wrong: ['zurückkommen', 'zurückgekommt'] }
];

// Verbos INSEPARABLES: prefijo átono (be-, ge-, er-, ver-, ent-, emp-, zer-, miss-).
const INSEP = [
  { inf: 'verstehen', ich: 'verstehe', er: 'versteht', mid: ['die', 'Erklärung', 'nur', 'zur', 'Hälfte'], midEs: 'la explicación solo a medias', es: 'entender', part: 'verstanden', zu: 'zu verstehen', wrong: ['verstehen', 'geverstanden'] },
  { inf: 'bekommen', ich: 'bekomme', er: 'bekommt', mid: ['jeden', 'Monat', 'eine', 'Rechnung', 'von', 'der', 'Versicherung'], midEs: 'una factura del seguro cada mes', es: 'recibir', part: 'bekommen', zu: 'zu bekommen', wrong: ['bekommt', 'gebekommen'] },
  { inf: 'besuchen', ich: 'besuche', er: 'besucht', mid: ['am', 'Sonntag', 'meine', 'Großeltern', 'auf', 'dem', 'Land'], midEs: 'a mis abuelos en el campo el domingo', es: 'visitar', part: 'besucht', zu: 'zu besuchen', wrong: ['besuchen', 'gebesucht'] },
  { inf: 'erzählen', ich: 'erzähle', er: 'erzählt', mid: ['den', 'Kindern', 'abends', 'immer', 'eine', 'Geschichte'], midEs: 'un cuento a los niños por la noche', es: 'contar', part: 'erzählt', zu: 'zu erzählen', wrong: ['erzählen', 'geerzählt'] },
  { inf: 'bezahlen', ich: 'bezahle', er: 'bezahlt', mid: ['die', 'Miete', 'immer', 'am', 'Ersten'], midEs: 'el alquiler siempre el día uno', es: 'pagar', part: 'bezahlt', zu: 'zu bezahlen', wrong: ['bezahlen', 'gebezahlt'] },
  { inf: 'verkaufen', ich: 'verkaufe', er: 'verkauft', mid: ['sein', 'altes', 'Fahrrad', 'über', 'eine', 'App'], midEs: 'su bici vieja por una app', es: 'vender', part: 'verkauft', zu: 'zu verkaufen', wrong: ['verkaufen', 'geverkauft'] },
  { inf: 'erklären', ich: 'erkläre', er: 'erklärt', mid: ['dir', 'die', 'Regel', 'gern', 'noch', 'einmal'], midEs: 'la regla otra vez con gusto', es: 'explicar', part: 'erklärt', zu: 'zu erklären', wrong: ['erklären', 'geerklärt'] },
  { inf: 'entscheiden', ich: 'entscheide', er: 'entscheidet', mid: ['das', 'meistens', 'ganz', 'spontan'], midEs: 'eso casi siempre de forma espontánea', es: 'decidir', part: 'entschieden', zu: 'zu entscheiden', wrong: ['entscheiden', 'geentschieden'] },
  { inf: 'vergessen', ich: 'vergesse', er: 'vergisst', mid: ['leider', 'oft', 'die', 'Geburtstage'], midEs: 'a menudo los cumpleaños', es: 'olvidar', part: 'vergessen', zu: 'zu vergessen', wrong: ['vergisst', 'gevergesst'] },
  { inf: 'empfehlen', ich: 'empfehle', er: 'empfiehlt', mid: ['dir', 'dieses', 'traditionelle', 'Restaurant'], midEs: 'este restaurante tradicional', es: 'recomendar', part: 'empfohlen', zu: 'zu empfehlen', wrong: ['empfehlt', 'geempfohlen'] },
  { inf: 'beginnen', ich: 'beginne', er: 'beginnt', mid: ['morgen', 'einen', 'neuen', 'Lebensabschnitt'], midEs: 'una nueva etapa mañana', es: 'comenzar', part: 'begonnen', zu: 'zu beginnen', wrong: ['beginnt', 'gebeginnt'] },
  { inf: 'verlieren', ich: 'verliere', er: 'verliert', mid: ['beim', 'Sport', 'oft', 'die', 'Geduld'], midEs: 'a menudo la paciencia al hacer deporte', es: 'perder', part: 'verloren', zu: 'zu verlieren', wrong: ['verliert', 'geverloren'] },
  { inf: 'gefallen', ich: 'gefalle', er: 'gefällt', mid: ['den', 'vielen', 'Besuchern', 'sehr'], midEs: 'mucho a los numerosos visitantes', es: 'gustar', part: 'gefallen', zu: 'zu gefallen', wrong: ['gefällt', 'gegefallen'] },
  { inf: 'bestellen', ich: 'bestelle', er: 'bestellt', mid: ['das', 'Buch', 'einfach', 'im', 'Internet'], midEs: 'el libro fácilmente por internet', es: 'pedir', part: 'bestellt', zu: 'zu bestellen', wrong: ['bestellen', 'gebestellt'] },
  { inf: 'erwarten', ich: 'erwarte', er: 'erwartet', mid: ['heute', 'einen', 'wichtigen', 'Anruf'], midEs: 'una llamada importante hoy', es: 'esperar', part: 'erwartet', zu: 'zu erwarten', wrong: ['erwarten', 'geerwartet'] },
  { inf: 'erleben', ich: 'erlebe', er: 'erlebt', mid: ['auf', 'dieser', 'Reise', 'viele', 'Abenteuer'], midEs: 'muchas aventuras en este viaje', es: 'vivir experiencias', part: 'erlebt', zu: 'zu erleben', wrong: ['erleben', 'geerlebt'] }
];

const SUBJ = [
  { de: 'ich', f: 'ich', es: 'yo' },
  { de: 'mein Kollege', f: 'er', es: 'mi compañero' },
  { de: 'die neue Praktikantin', f: 'er', es: 'la becaria nueva' },
  { de: 'er', f: 'er', es: 'él' },
  { de: 'meine Nachbarin', f: 'er', es: 'mi vecina' }
];

const frames = [
  // A · Hauptsatz: ¿qué cierra la frase? (solo separables)
  {
    make(rng) {
      const subj = pick(rng, SUBJ);
      const v = pick(rng, SEP);
      const finite = v[subj.f];
      return mc(rng, {
        conceptId: 'trenn:hauptsatz',
        prompt: t('tp.pickCloser'),
        sentence: `${cap(subj.de)} ${finite} ${v.mid.join(' ')} ___.`,
        correct: v.pref,
        distractors: [v.inf, v.zu],
        translation: t('tp.glossSubj', { s: cap(tc(subj.es)), v: tc(v.es), m: tc(v.midEs) }),
        explanation: t('tp.sepEnd', { inf: v.inf, pref: v.pref, fin: finite })
      });
    }
  },
  // B · Perfekt: separable (ge en medio) vs inseparable (sin ge)
  {
    make(rng) {
      const sep = rng() < 0.5;
      const v = pick(rng, sep ? SEP : INSEP);
      const subj = pick(rng, SUBJ);
      const isSein = sep && /(?:fahren|stehen|kommen|steigen)$/.test(v.inf);
      const aux = isSein ? (subj.f === 'ich' ? 'bin' : 'ist') : subj.f === 'ich' ? 'habe' : 'hat';
      return mc(rng, {
        conceptId: 'trenn:perfekt',
        prompt: t('tp.pickPart2'),
        sentence: `${cap(subj.de)} ${aux} gestern ${v.mid.join(' ')} ___.`,
        correct: v.part,
        distractors: shuffle(rng, [...new Set(v.wrong)]).slice(0, 2),
        translation: t('tp.glossPerf', {
          s: cap(tc(subj.es)),
          aux: subj.f === 'ich' ? t('tp.auxHe') : t('tp.auxHa'),
          v: tc(v.es),
          m: tc(v.midEs)
        }),
        explanation: sep
          ? t('tp.sepGe', { pref: v.pref, part: v.part })
          : t('tp.insepGe', { part: v.part })
      });
    }
  },
  // C · zu-Infinitiv: auf-zu-stehen vs zu verstehen
  {
    make(rng) {
      const sep = rng() < 0.5;
      const v = pick(rng, sep ? SEP : INSEP);
      return mc(rng, {
        conceptId: 'trenn:zu-infinitiv',
        prompt: t('tp.fillZu'),
        sentence: `Es wäre gut, ${v.mid.slice(0, 3).join(' ')} ___.`,
        correct: v.zu,
        distractors: sep
          ? [`zu ${v.inf}`, v.inf, v.part]
          : [v.zu.replace(' ', ''), v.inf, `zu ${v.part}`],
        translation: t('tp.wouldBeGood', { v: tc(v.es), m: tc(v.midEs) }),
        explanation: sep
          ? t('tp.sepZu', { zu: v.zu, inf: v.inf })
          : t('tp.insepZu', { zu: v.zu })
      });
    }
  },
  // D · Nebensatz: el separable se vuelve a unir al final
  {
    make(rng) {
      const subj = pick(rng, SUBJ.filter((s) => ['ich', 'er'].includes(s.f)));
      const v = pick(rng, SEP);
      const joined = v.pref + v[subj.f]; // p.ej. "auf" + "stehe" = "aufstehe"
      return order(rng, {
        conceptId: 'trenn:nebensatz',
        prompt: t('tp.orderWeil'),
        solution: ['weil', subj.de, ...v.mid, joined],
        translation: t('tp.becauseGloss', {
          s: subj.es === 'yo' ? '' : tc(subj.es) + ' ',
          v: tc(v.es),
          m: tc(v.midEs)
        }),
        explanation: t('tp.sepNeben', { s: subj.de, joined })
      });
    }
  },
  // E · Hauptsatz: ordenar (prefijo al final)
  {
    make(rng) {
      const subj = pick(rng, SUBJ);
      const v = pick(rng, SEP);
      return order(rng, {
        conceptId: 'trenn:hauptsatz',
        prompt: t('tp.orderPrefix'),
        solution: [cap(subj.de), v[subj.f], ...v.mid, v.pref],
        translation: t('tp.glossPlain', { s: cap(tc(subj.es)), v: tc(v.es), m: tc(v.midEs) }),
        explanation: t('tp.sepOrder', { pref: v.pref, fin: v[subj.f] })
      });
    }
  }
];

export const theory = {
  intro:
    'Muchos verbos alemanes llevan un prefijo. Si el prefijo es TÓNICO (auf-, an-, ein-, mit-, vor-, ab-, zu-, weg-, los-…), el verbo es SEPARABLE: el prefijo se despega y se va al final. Si el prefijo es ÁTONO (be-, ge-, er-, ver-, ent-, emp-, zer-, miss-), el verbo es INSEPARABLE: nunca se separa. Pulsa cada bloque para ver la explicación completa y más ejemplos.',
  sections: [
    {
      title: 'Separables: el prefijo se va al final',
      body: 'En la frase principal, el verbo se conjuga en 2ª posición y el prefijo se coloca al final.',
      examples: [
        { de: 'Ich stehe jeden Tag um sechs auf.', es: 'Me levanto todos los días a las seis.' },
        { de: 'Ruf mich später an!', es: '¡Llámame luego!' }
      ],
      detail:
        'Prefijos separables (tónicos): ab-, an-, auf-, aus-, bei-, ein-, mit-, nach-, vor-, zu-, zurück-, weg-, los-, hin-, her-, fern-, teil-, zusammen-, statt-, um- (a veces).\n\nEl prefijo abre y cierra la "Satzklammer": todo lo demás (objetos, tiempo, lugar) va entre el verbo conjugado y el prefijo. En el imperativo también se separa: "Mach die Tür zu!", "Steh auf!". En preguntas: "Kommst du mit?", "Wann fängt der Film an?".',
      table: {
        title: 'aufstehen en cada situación',
        headers: ['contexto', 'forma'],
        rows: [
          ['Frase principal', 'Ich stehe um 6 Uhr auf.'],
          ['Pregunta', 'Stehst du früh auf?'],
          ['Imperativo', 'Steh bitte auf!'],
          ['Con modal', 'Ich muss früh aufstehen.'],
          ['Subordinada (weil)', '…, weil ich früh aufstehe.'],
          ['Perfekt', 'Ich bin früh aufgestanden.'],
          ['con zu', '…, ohne früh aufzustehen.']
        ]
      },
      more: {
        examples: [
          { de: 'Wir kaufen samstags für die ganze Woche ein.', es: 'Los sábados hacemos la compra para toda la semana.' },
          { de: 'Der Unterricht fängt um Viertel nach acht an.', es: 'La clase empieza a las ocho y cuarto.' },
          { de: 'Holst du die Kinder heute von der Schule ab?', es: '¿Recoges hoy a los niños del colegio?' },
          { de: 'Mach bitte das Fenster zu, es zieht.', es: 'Cierra la ventana, por favor, hay corriente.' }
        ]
      }
    },
    {
      title: 'Inseparables: be-, ge-, er-, ver-, ent-, emp-, zer-, miss-',
      body: 'El prefijo es átono y forma parte del verbo: no se separa nunca.',
      examples: [
        { de: 'Ich verstehe die Aufgabe nicht.', es: 'No entiendo el ejercicio.' },
        { de: 'Sie bekommt morgen die Ergebnisse.', es: 'Mañana recibe los resultados.' }
      ],
      detail:
        'Ocho prefijos átonos: be-, ge-, er-, ver-, ent-, emp-, zer-, miss-. El verbo se comporta como uno normal: el prefijo va siempre pegado, en todas las formas.\n\nConsecuencias: (1) en Perfekt NO llevan ge-: verstehen → verstanden, besuchen → besucht, erklären → erklärt. (2) Con "zu" el "zu" va delante y separado: "ohne zu verstehen", "Es ist wichtig, alles zu bezahlen". (3) En subordinada, como cualquier verbo, va al final entero: "…, weil ich das nicht verstehe".',
      more: {
        examples: [
          { de: 'Er hat mir alles ganz genau erklärt.', es: 'Me lo explicó todo con mucho detalle.' },
          { de: 'Wir haben letztes Jahr das Haus verkauft.', es: 'El año pasado vendimos la casa.' },
          { de: 'Ich habe leider deinen Namen vergessen.', es: 'Se me ha olvidado tu nombre, lo siento.' },
          { de: 'Sie besucht ihre Familie nur an Weihnachten.', es: 'Visita a su familia solo en Navidad.' }
        ]
      }
    },
    {
      title: 'En Perfekt: -ge- en medio vs sin -ge-',
      body: 'Separable: prefijo + ge + participio. Inseparable: participio sin ge-.',
      examples: [
        { de: 'aufstehen → aufgestanden · anrufen → angerufen', es: 'separable: -ge- en medio' },
        { de: 'verstehen → verstanden · besuchen → besucht', es: 'inseparable: sin ge-' }
      ],
      detail:
        'El -ge- del participio solo aparece si la sílaba tónica es la primera. En los separables el prefijo es tónico, así que el -ge- se cuela justo detrás: ein-ge-kauft, mit-ge-bracht, an-ge-fangen. En los inseparables el prefijo es átono → no hay ge-: be-sucht, ver-standen, er-zählt.\n\nAtención a los verbos con dos prefijos, uno de cada tipo: "vorbereiten" → "vorbereitet" (vor- separable + be- inseparable → no hay ge-). El auxiliar (haben/sein) depende del verbo, no del prefijo: aufstehen → ist aufgestanden, einkaufen → hat eingekauft.',
      more: {
        examples: [
          { de: 'Hast du schon die Rechnung bezahlt?', es: '¿Ya has pagado la factura?' },
          { de: 'Wir sind in Köln in den ICE umgestiegen.', es: 'Hicimos transbordo al ICE en Colonia.' },
          { de: 'Ich habe die Sitzung gut vorbereitet.', es: 'He preparado bien la reunión.' },
          { de: 'Er hat mir eine lange Geschichte erzählt.', es: 'Me contó una historia larga.' }
        ]
      }
    },
    {
      title: 'Con "zu": aufzustehen vs zu verstehen',
      body: 'Separable: el "zu" va DENTRO, pegado. Inseparable: el "zu" va delante y suelto.',
      examples: [
        { de: 'Ich habe vergessen, dich anzurufen.', es: 'Se me olvidó llamarte.' },
        { de: 'Es ist wichtig, alles zu verstehen.', es: 'Es importante entenderlo todo.' }
      ],
      detail:
        'Con construcciones de infinitivo (um … zu, ohne … zu, "vergessen zu", "versuchen zu", "Es ist gut, … zu"): el separable mete el "zu" entre el prefijo y la raíz y se escribe todo junto → anzurufen, aufzustehen, einzukaufen, mitzukommen. El inseparable (y los verbos sin prefijo) ponen "zu" delante, como palabra aparte → zu verstehen, zu bezahlen, zu lernen.',
      more: {
        examples: [
          { de: 'Er ging, ohne sich zu verabschieden.', es: 'Se fue sin despedirse.' },
          { de: 'Ich versuche, jeden Tag früh aufzustehen.', es: 'Intento levantarme temprano cada día.' },
          { de: 'Vergiss nicht, das Licht auszumachen.', es: 'No olvides apagar la luz.' },
          { de: 'Es macht Spaß, neue Leute kennenzulernen.', es: 'Es divertido conocer a gente nueva.' }
        ]
      }
    },
    {
      title: 'Prefijos con doble uso: um-, durch-, über-, unter-, wieder-',
      body: 'Separables (tónicos) cuando el sentido es literal; inseparables (átonos) cuando es figurado.',
      examples: [
        { de: 'Ich steige in München um. (separable)', es: 'Hago transbordo en Múnich.' },
        { de: 'Ich umarme dich. (inseparable)', es: 'Te abrazo.' }
      ],
      detail:
        'Mismo prefijo, dos verbos distintos según dónde caiga el acento:\n\n• úmsteigen (transbordar, sep.) / umármen (abrazar, insep.)\n• dúrchfallen (suspender, sep.) / durchsúchen (registrar, insep.)\n• überziehen (ponerse una prenda, sep.) / übersétzen (traducir, insep.) — pero übersetzen "cruzar en barca" es separable\n• únterbringen (alojar, sep.) / unterbréchen (interrumpir, insep.)\n\nNo hace falta memorizar la lista entera: basta saber que si el diccionario marca el acento en el prefijo, es separable.',
      more: {
        examples: [
          { de: 'Der Lehrer hat mich mitten im Satz unterbrochen.', es: 'El profesor me interrumpió a media frase.' },
          { de: 'Kannst du mir das ins Spanische übersetzen?', es: '¿Me lo puedes traducir al español?' },
          { de: 'Zieh dir eine Jacke über, es ist kalt.', es: 'Ponte una chaqueta, hace frío.' }
        ]
      }
    }
  ],
  table: {
    title: 'Prefijos: separables vs inseparables',
    headers: ['Separables (tónicos)', 'Inseparables (átonos)', 'Variables'],
    rows: [
      ['ab-, an-, auf-, aus-, ein-', 'be-, ge-, er-', 'um-'],
      ['mit-, nach-, vor-, zu-', 'ver-, ent-, emp-', 'durch-'],
      ['zurück-, weg-, los-, hin-, her-', 'zer-, miss-', 'über-, unter-, wieder-']
    ]
  },
  pitfalls: [
    'Separable en frase principal: el prefijo AL FINAL: ✗ Ich aufstehe um 6 → ✓ Ich stehe um 6 auf.',
    'Perfekt separable con -ge- en medio: ✗ geaufstanden → ✓ aufgestanden.',
    'Inseparables NO llevan ge-: ✗ gebesucht / geverstanden → ✓ besucht / verstanden.',
    'Con zu: separable junto (anzurufen), inseparable suelto (zu verstehen).'
  ]
};

export default {
  id: 'trennbar',
  name: 'Trennbare Verben',
  nameEs: 'Verbos separables e inseparables',
  emoji: '✂',
  blurb: 'Prefijo al final (aufstehen), sin ge- en inseparables (verstanden), zu en medio, y en subordinada',
  theory,
  concepts: [
    { id: 'trenn:hauptsatz', label: 'Separable: prefijo al final (frase principal)' },
    { id: 'trenn:perfekt', label: 'Perfekt: -ge- en medio vs sin ge-' },
    { id: 'trenn:zu-infinitiv', label: 'Con zu: aufzustehen vs zu verstehen' },
    { id: 'trenn:nebensatz', label: 'Separable en subordinada (se vuelve a unir)' }
  ],
  frames
};
