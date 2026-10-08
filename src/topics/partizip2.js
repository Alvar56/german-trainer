import { mc, order } from '../engine/helpers.js';
import { pick, shuffle } from '../lib/rng.js';
import { t } from '../lib/i18n.js';
import { tc } from '../lib/contenido/index.js';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// grupo: weak | strong | ieren | insep | sep
const V = [
  { inf: 'kaufen', part: 'gekauft', aux: 'haben', g: 'weak', mid: ['ein', 'neues', 'Fahrrad', 'für', 'den', 'Sommer'], midEs: 'una bici nueva para el verano', pp: 'comprado', wrong: ['kaufen', 'kaufte'] },
  { inf: 'lernen', part: 'gelernt', aux: 'haben', g: 'weak', mid: ['drei', 'Stunden', 'für', 'die', 'Prüfung'], midEs: 'tres horas para el examen', pp: 'estudiado', wrong: ['lernen', 'lernte'] },
  { inf: 'arbeiten', part: 'gearbeitet', aux: 'haben', g: 'weak', mid: ['bis', 'spät', 'im', 'Büro'], midEs: 'hasta tarde en la oficina', pp: 'trabajado', wrong: ['arbeitet', 'arbeitete'] },
  { inf: 'buchen', part: 'gebucht', aux: 'haben', g: 'weak', mid: ['einen', 'Flug', 'nach', 'Rom'], midEs: 'un vuelo a Roma', pp: 'reservado', wrong: ['buchen', 'buchte'] },
  { inf: 'kündigen', part: 'gekündigt', aux: 'haben', g: 'weak', mid: ['seinen', 'Job'], midEs: 'su trabajo', pp: 'dejado (dimitido)', wrong: ['kündigen', 'kündigte'] },
  { inf: 'schreiben', part: 'geschrieben', aux: 'haben', g: 'strong', mid: ['eine', 'lange', 'E-Mail', 'an', 'den', 'Chef'], midEs: 'un correo largo al jefe', pp: 'escrito', wrong: ['schreiben', 'geschreibt'] },
  { inf: 'lesen', part: 'gelesen', aux: 'haben', g: 'strong', mid: ['den', 'ganzen', 'Roman'], midEs: 'la novela entera', pp: 'leído', wrong: ['lesen', 'gelest'] },
  { inf: 'verlieren', part: 'verloren', aux: 'haben', g: 'strong', mid: ['seinen', 'Regenschirm', 'im', 'Zug'], midEs: 'el paraguas en el tren', pp: 'perdido', wrong: ['verlieren', 'verliert'] },
  { inf: 'gewinnen', part: 'gewonnen', aux: 'haben', g: 'strong', mid: ['das', 'Spiel', 'gegen', 'Bayern'], midEs: 'el partido contra el Bayern', pp: 'ganado', wrong: ['gewinnen', 'gewinnt'] },
  { inf: 'vergessen', part: 'vergessen', aux: 'haben', g: 'strong', mid: ['den', 'Termin', 'beim', 'Amt'], midEs: 'la cita en la administración', pp: 'olvidado', wrong: ['vergisst', 'vergaß'] },
  { inf: 'fahren', part: 'gefahren', aux: 'sein', g: 'strong', mid: ['mit', 'dem', 'Zug', 'nach', 'Hamburg'], midEs: 'en tren a Hamburgo', pp: 'ido', wrong: ['fahren', 'gefahrt'] },
  { inf: 'umziehen', part: 'umgezogen', aux: 'sein', g: 'sep', mid: ['in', 'eine', 'größere', 'Wohnung'], midEs: 'a un piso más grande', pp: 'mudado', wrong: ['umziehen', 'umgezogt'] },
  { inf: 'bleiben', part: 'geblieben', aux: 'sein', g: 'strong', mid: ['das', 'ganze', 'Wochenende', 'zu', 'Hause'], midEs: 'todo el finde en casa', pp: 'quedado', wrong: ['bleiben', 'gebleibt'] },
  { inf: 'fliegen', part: 'geflogen', aux: 'sein', g: 'strong', mid: ['zum', 'ersten', 'Mal', 'allein'], midEs: 'solo por primera vez', pp: 'volado', wrong: ['fliegen', 'gefliegt'] },
  { inf: 'studieren', part: 'studiert', aux: 'haben', g: 'ieren', mid: ['zwei', 'Semester', 'in', 'Wien'], midEs: 'dos semestres en Viena', pp: 'estudiado', wrong: ['studieren', 'gestudiert'] },
  { inf: 'reparieren', part: 'repariert', aux: 'haben', g: 'ieren', mid: ['die', 'Waschmaschine', 'selbst'], midEs: 'la lavadora él mismo', pp: 'reparado', wrong: ['reparieren', 'gerepariert'] },
  { inf: 'organisieren', part: 'organisiert', aux: 'haben', g: 'ieren', mid: ['die', 'ganze', 'Feier'], midEs: 'toda la fiesta', pp: 'organizado', wrong: ['organisieren', 'organisierte'] },
  { inf: 'besuchen', part: 'besucht', aux: 'haben', g: 'insep', mid: ['einen', 'Deutschkurs', 'an', 'der', 'VHS'], midEs: 'un curso de alemán en la escuela de adultos', pp: 'ido a', wrong: ['besuchen', 'gebesucht'] },
  { inf: 'verstehen', part: 'verstanden', aux: 'haben', g: 'insep', mid: ['die', 'Erklärung', 'nicht', 'ganz'], midEs: 'la explicación del todo', pp: 'entendido', wrong: ['verstehen', 'geverstanden'] },
  { inf: 'bekommen', part: 'bekommen', aux: 'haben', g: 'insep', mid: ['endlich', 'eine', 'Antwort'], midEs: 'por fin una respuesta', pp: 'recibido', wrong: ['gebekommen', 'bekommt'] },
  { inf: 'einladen', part: 'eingeladen', aux: 'haben', g: 'sep', mid: ['die', 'Kollegen', 'zum', 'Essen'], midEs: 'a los compañeros a comer', pp: 'invitado', wrong: ['einladen', 'eingeladet'] },
  { inf: 'teilnehmen', part: 'teilgenommen', aux: 'haben', g: 'sep', mid: ['an', 'einem', 'Workshop'], midEs: 'en un taller', pp: 'participado', wrong: ['teilnehmen', 'teilgenommt'] },
  { inf: 'anrufen', part: 'angerufen', aux: 'haben', g: 'sep', mid: ['dreimal', 'bei', 'der', 'Versicherung'], midEs: 'tres veces al seguro', pp: 'llamado', wrong: ['anrufen', 'angeruft'] },
  { inf: 'aufstehen', part: 'aufgestanden', aux: 'sein', g: 'sep', mid: ['wegen', 'des', 'Termins', 'viel', 'zu', 'spät'], midEs: 'demasiado tarde por la cita', pp: 'levantado', wrong: ['aufstehen', 'aufgestehen'] },
  { inf: 'ankommen', part: 'angekommen', aux: 'sein', g: 'sep', mid: ['pünktlich', 'am', 'Flughafen'], midEs: 'puntual al aeropuerto', pp: 'llegado', wrong: ['ankommen', 'angekommt'] }
];

const SUBJ = [
  { de: 'ich', k: 'ich', i: 0, es: 'yo', haben: 'habe', sein: 'bin', prätH: 'hatte', prätS: 'war', esAux: 'he' },
  { de: 'du', k: 'du', i: 1, es: 'tú', haben: 'hast', sein: 'bist', prätH: 'hattest', prätS: 'warst', esAux: 'has' },
  { de: 'meine Nachbarin', k: 'er', i: 2, es: 'mi vecina', haben: 'hat', sein: 'ist', prätH: 'hatte', prätS: 'war', esAux: 'ha' },
  { de: 'mein Chef', k: 'er', i: 2, es: 'mi jefe', haben: 'hat', sein: 'ist', prätH: 'hatte', prätS: 'war', esAux: 'ha' },
  { de: 'wir', k: 'wir', i: 3, es: 'nosotros', haben: 'haben', sein: 'sind', prätH: 'hatten', prätS: 'waren', esAux: 'hemos' },
  { de: 'die Kollegen', k: 'sie', i: 5, es: 'los compañeros', haben: 'haben', sein: 'sind', prätH: 'hatten', prätS: 'waren', esAux: 'han' }
];

const TIME = ['letztes Wochenende', 'vor zwei Tagen', 'gestern Abend', 'letzten Sommer', 'vorgestern', 'letzte Woche'];

const GROUP_EX = {
  weak: 'Verbo regular (débil): ge- + raíz + -t.',
  strong: 'Verbo irregular (fuerte): Partizip II en ge-...-en, a menudo con cambio de vocal. Hay que memorizarlo.',
  ieren: 'Los verbos en -ieren NO llevan ge-: solo raíz + -t (organisieren → organisiert).',
  insep: 'Con prefijo inseparable (be-, ver-, er-, ent-, emp-…) NO se añade ge- (verstehen → verstanden).',
  sep: 'Con prefijo separable, el -ge- va en medio: ein + ge + laden → eingeladen.'
};

// La glosa se arma con trozos traducidos por separado: el molde vive en
// i18n.js y cada pieza pasa por tc().
const perfGloss = (subj, v) =>
  t('tp.perfGloss', {
    s: cap(tc(subj.es)),
    aux: t('tp.perfAux.' + subj.k),
    pp: tc(v.pp),
    m: tc(v.midEs)
  });

const frames = [
  // Elegir el Partizip II (frase con tiempo + complemento largo)
  {
    make(rng) {
      const subj = pick(rng, SUBJ);
      const v = pick(rng, V);
      const cuando = pick(rng, TIME);
      return mc(rng, {
        conceptId: `partizip:${v.g}`,
        prompt: t('tp.pickPart2'),
        sentence: `${cap(subj.de)} ${subj[v.aux]} ${cuando} ${v.mid.join(' ')} ___.`,
        correct: v.part,
        distractors: shuffle(rng, [...new Set(v.wrong)]).slice(0, 2),
        translation: perfGloss(subj, v),
        explanation: t('tp.part2Expl', { inf: v.inf, part: v.part, g: tc(GROUP_EX[v.g]) })
      });
    }
  },
  // Elegir el auxiliar haben / sein
  {
    make(rng) {
      const subj = pick(rng, SUBJ);
      const v = pick(rng, V);
      const cuando = pick(rng, TIME);
      const correct = subj[v.aux];
      const wrongAux = subj[v.aux === 'haben' ? 'sein' : 'haben'];
      const prät = subj[v.aux === 'haben' ? 'prätH' : 'prätS'];
      const why = v.aux === 'sein' ? t('tp.auxSein') : t('tp.auxHaben');
      return mc(rng, {
        conceptId: `perfekt:aux:${v.aux}`,
        prompt: t('tp.pickAux'),
        sentence: `${cap(subj.de)} ___ ${cuando} ${v.mid.join(' ')} ${v.part}.`,
        correct,
        distractors: [wrongAux, prät],
        translation: perfGloss(subj, v),
        explanation: t('tp.auxExpl', { inf: v.inf, aux: v.aux, why })
      });
    }
  },
  // Ordenar la frase en Perfekt (con complemento en Vorfeld)
  {
    make(rng) {
      const subj = pick(rng, SUBJ);
      const v = pick(rng, V);
      const cuando = pick(rng, TIME);
      const solution = [cap(cuando.split(' ')[0]), ...cuando.split(' ').slice(1), subj[v.aux], subj.de, ...v.mid, v.part];
      return order(rng, {
        conceptId: 'perfekt:satzstellung',
        prompt: t('tp.orderPerfTime'),
        solution,
        translation: perfGloss(subj, v),
        explanation: t('tp.perfFronted', { aux: subj[v.aux], part: v.part })
      });
    }
  },
  // Nebensatz con "dass": el auxiliar va al FINAL
  {
    make(rng) {
      const subj = pick(rng, SUBJ.filter((s) => ['ich', 'er', 'wir', 'sie'].includes(s.k)));
      const v = pick(rng, V);
      return order(rng, {
        conceptId: 'perfekt:nebensatz',
        prompt: t('tp.orderDass'),
        solution: ['dass', subj.de, ...v.mid, v.part, subj[v.aux]],
        translation: t('tp.thatGloss', {
          s: subj.es === 'yo' ? '' : tc(subj.es) + ' ',
          aux: t('tp.perfAux.' + subj.k),
          pp: tc(v.pp),
          m: tc(v.midEs)
        }),
        explanation: t('tp.perfDass', { aux: subj[v.aux], s: subj.de, part: v.part })
      });
    }
  }
];

export const theory = {
  intro:
    'El Perfekt es el pasado que se usa al hablar. Se forma con "haben" o "sein" conjugado en 2ª posición + el Partizip II (participio) al final. Pulsa cada bloque para ver la explicación completa y más ejemplos.',
  sections: [
    {
      title: 'Verbos regulares (débiles): ge- + raíz + -t',
      body: 'Si la raíz termina en -t o -d, se añade -et.',
      examples: [
        { de: 'buchen → gebucht', es: 'Wir haben einen Flug nach Rom gebucht.' },
        { de: 'arbeiten → gearbeitet', es: 'Sie hat bis spät im Büro gearbeitet.' }
      ],
      detail:
        'Son la gran mayoría. Fórmula: ge + raíz del infinitivo + t. machen → ge-mach-t. Si la raíz acaba en -t, -d o en grupo difícil (-fn, -gn, -chn): se intercala una -e- → arbeiten → gearbeitet, öffnen → geöffnet, regnen → geregnet.\n\nCasi todos van con haben. El participio no cambia nunca por género ni número: "Ich habe gekauft / wir haben gekauft". En la frase, el participio se coloca al final del todo; el auxiliar ocupa la 2ª posición.',
      more: {
        examples: [
          { de: 'Ich habe die Wohnung schon aufgeräumt.', es: 'Ya he ordenado la casa.' },
          { de: 'Hast du ihm schon geantwortet?', es: '¿Ya le has contestado?' },
          { de: 'Wir haben lange auf den Bus gewartet.', es: 'Hemos esperado mucho el autobús.' },
          { de: 'Sie hat den Vertrag endlich unterschrieben.', es: 'Por fin firmó el contrato.' }
        ]
      }
    },
    {
      title: 'Verbos irregulares (fuertes): ge- + raíz + -en',
      body: 'A menudo cambian la vocal. Hay que memorizarlos.',
      examples: [
        { de: 'schreiben → geschrieben · verlieren → verloren', es: 'Ich habe meinen Schirm im Zug verloren.' },
        { de: 'fahren → gefahren · bleiben → geblieben', es: 'Wir sind mit dem Zug nach Hamburg gefahren.' }
      ],
      detail:
        'Son unos 200, pero los frecuentes se aprenden con el uso. Terminan en -en y muchos cambian la vocal de la raíz: finden → gefunden, sprechen → gesprochen, nehmen → genommen, gehen → gegangen, essen → gegessen.\n\nConviene memorizarlos en grupo de tres formas: Infinitiv – Präteritum – Partizip II (sprechen – sprach – gesprochen). Algunos parecen débiles pero son fuertes: kennen → gekannt, denken → gedacht, bringen → gebracht (verbos "mixtos": cambian la vocal pero acaban en -t).',
      table: {
        title: 'Partizip II de verbos fuertes frecuentes',
        headers: ['Infinitiv', 'Partizip II', 'auxiliar'],
        rows: [
          ['schreiben', 'geschrieben', 'haben'],
          ['lesen', 'gelesen', 'haben'],
          ['sprechen', 'gesprochen', 'haben'],
          ['essen', 'gegessen', 'haben'],
          ['trinken', 'getrunken', 'haben'],
          ['nehmen', 'genommen', 'haben'],
          ['finden', 'gefunden', 'haben'],
          ['verlieren', 'verloren', 'haben'],
          ['gehen', 'gegangen', 'sein'],
          ['kommen', 'gekommen', 'sein'],
          ['fahren', 'gefahren', 'sein'],
          ['bleiben', 'geblieben', 'sein']
        ]
      },
      more: {
        title: 'Fuertes muy usados',
        examples: [
          { de: 'Ich habe deinen Schlüssel gefunden.', es: 'He encontrado tu llave.' },
          { de: 'Was hast du gestern gemacht? — Ich habe geschlafen.', es: '¿Qué hiciste ayer? — Dormí.' },
          { de: 'Er hat die ganze Pizza gegessen.', es: 'Se ha comido la pizza entera.' },
          { de: 'Sie hat mir von ihrem Urlaub erzählt.', es: 'Me contó lo de sus vacaciones.' },
          { de: 'Ich habe nicht daran gedacht.', es: 'No lo pensé / no caí.' }
        ]
      }
    },
    {
      title: 'Sin "ge-": -ieren y prefijos inseparables',
      body: 'Verbos en -ieren y verbos que empiezan por be-, ge-, er-, ver-, ent-, emp-, zer- no llevan ge-.',
      examples: [
        { de: 'organisieren → organisiert', es: 'Er hat die ganze Feier organisiert.' },
        { de: 'verstehen → verstanden · bekommen → bekommen', es: 'Ich habe die Erklärung nicht ganz verstanden.' }
      ],
      detail:
        'Regla del acento: solo lleva ge- lo que se acentúa en la primera sílaba. Los verbos en -ieren se acentúan en -ie- (stu-DIE-ren), así que nada de ge-: studiert, telefoniert, funktioniert, reserviert.\n\nLos prefijos inseparables (be-, ge-, er-, ver-, ent-, emp-, zer-, miss-) son átonos y forman parte del verbo: no se separan y no admiten ge-. besuchen → besucht, verlieren → verloren, erklären → erklärt, entscheiden → entschieden. Su auxiliar depende del significado (casi siempre haben), no del prefijo.',
      more: {
        examples: [
          { de: 'Ich habe zwei Nächte im Hotel reserviert.', es: 'He reservado dos noches en el hotel.' },
          { de: 'Sie hat sich für den blauen Mantel entschieden.', es: 'Se decidió por el abrigo azul.' },
          { de: 'Der Lehrer hat die Regel noch einmal erklärt.', es: 'El profesor explicó la regla otra vez.' },
          { de: 'Wir haben den Bus leider verpasst.', es: 'Por desgracia hemos perdido el autobús.' }
        ]
      }
    },
    {
      title: 'Prefijo separable: -ge- en medio',
      body: 'Con prefijo separable, el -ge- se coloca entre el prefijo y la raíz.',
      examples: [
        { de: 'einladen → eingeladen', es: 'Sie hat die Kollegen zum Essen eingeladen.' },
        { de: 'umziehen → umgezogen', es: 'Wir sind in eine größere Wohnung umgezogen.' }
      ],
      detail:
        'Los prefijos separables (an-, auf-, aus-, ab-, ein-, mit-, nach-, vor-, zu-, weg-, zurück-, fern-…) son tónicos. En Perfekt se quedan pegados y el -ge- va en medio: prefijo + ge + participio de la raíz → auf-ge-standen, ein-ge-kauft, an-ge-rufen, mit-ge-bracht.\n\nEl auxiliar depende del verbo base: aufstehen → sein (aufgestanden), einkaufen → haben (eingekauft), ankommen → sein, anrufen → haben. La zu-Form también intercala el zu: "Ich habe vergessen, dich anzurufen".',
      more: {
        examples: [
          { de: 'Um wie viel Uhr bist du heute aufgestanden?', es: '¿A qué hora te has levantado hoy?' },
          { de: 'Ich habe im Supermarkt eingekauft.', es: 'He hecho la compra en el súper.' },
          { de: 'Er hat mir Blumen mitgebracht.', es: 'Me ha traído flores.' },
          { de: 'Der Zug ist mit Verspätung angekommen.', es: 'El tren ha llegado con retraso.' }
        ]
      }
    },
    {
      title: '¿haben o sein? · Orden en la subordinada',
      body: '"sein" con verbos de movimiento con cambio de lugar y de estado, más sein/bleiben/werden/passieren. En subordinadas (dass, weil, als…) el auxiliar se va al final.',
      examples: [
        { de: 'Ich glaube, dass er zu spät angekommen ist.', es: 'Creo que llegó demasiado tarde.' }
      ],
      detail:
        'Van con sein: (1) desplazamiento de A a B → gehen, kommen, fahren, fliegen, reisen, laufen; (2) cambio de estado → aufstehen, einschlafen, aufwachen, wachsen, sterben; (3) los especiales sein (gewesen), bleiben (geblieben), werden (geworden), passieren, gelingen. Todo lo demás, con haben; siempre los que llevan objeto en acusativo y los reflexivos.\n\nOrden: en la frase normal el auxiliar es 2º y el participio va al final. Si empiezas por un complemento, el auxiliar sigue 2º y el sujeto va detrás ("Gestern bin ich spät gekommen"). En subordinada (weil, dass, als, wenn, obwohl…) el auxiliar se va al final del todo, detrás del participio: "…, weil ich lange gearbeitet habe".',
      more: {
        examples: [
          { de: 'Letztes Jahr sind wir nach Portugal gereist.', es: 'El año pasado viajamos a Portugal.' },
          { de: 'Ich bin sofort eingeschlafen.', es: 'Me dormí enseguida.' },
          { de: 'Sie hat sich sehr über das Geschenk gefreut.', es: 'Se alegró mucho con el regalo.' },
          { de: 'Als ich nach Hause gekommen bin, war niemand da.', es: 'Cuando llegué a casa no había nadie.' },
          { de: 'Er sagt, dass er den Schlüssel verloren hat.', es: 'Dice que ha perdido la llave.' }
        ]
      }
    }
  ],
  pitfalls: [
    'No "regularices" los verbos fuertes: ✗ geschreibt → ✓ geschrieben.',
    'El participio va al final: ✗ Ich habe gekauft ein Fahrrad → ✓ Ich habe ein Fahrrad gekauft.',
    'Movimiento/cambio de estado = sein: ✗ Ich habe umgezogen → ✓ Ich bin umgezogen.',
    'En subordinada el auxiliar va al final: ✗ …, dass ich habe gearbeitet → ✓ …, dass ich gearbeitet habe.'
  ]
};

export default {
  id: 'partizip2',
  name: 'Partizip II / Perfekt',
  nameEs: 'Participio 2 y Perfekt',
  emoji: '🕰',
  blurb: 'Partizip II (débil/fuerte/-ieren/prefijos), haben vs sein y el orden en la subordinada',
  theory,
  concepts: [
    { id: 'partizip:weak', label: 'Partizip II regular (ge-...-t)' },
    { id: 'partizip:strong', label: 'Partizip II irregular (ge-...-en)' },
    { id: 'partizip:ieren', label: 'Verbos en -ieren (sin ge-)' },
    { id: 'partizip:insep', label: 'Prefijo inseparable (sin ge-)' },
    { id: 'partizip:sep', label: 'Prefijo separable (-ge- en medio)' },
    { id: 'perfekt:aux:haben', label: 'Perfekt con haben' },
    { id: 'perfekt:aux:sein', label: 'Perfekt con sein' },
    { id: 'perfekt:satzstellung', label: 'Orden de la frase (Vorfeld + auxiliar en 2ª)' },
    { id: 'perfekt:nebensatz', label: 'Perfekt en subordinada (auxiliar al final)' }
  ],
  frames
};
