import { mc, order } from '../engine/helpers.js';
import { pick, shuffle } from '../lib/rng.js';
import { t } from '../lib/i18n.js';
import { tc } from '../lib/contenido/index.js';

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);

// cat: bewegung | zustand | spezial | haben
const V = [
  { inf: 'fahren', part: 'gefahren', aux: 'sein', cat: 'bewegung', mid: ['mit', 'dem', 'Nachtzug', 'nach', 'München'], midEs: 'en el tren nocturno a Múnich', pp: 'ido' },
  { inf: 'laufen', part: 'gelaufen', aux: 'sein', cat: 'bewegung', mid: ['bei', 'dem', 'Regen', 'zur', 'Bushaltestelle'], midEs: 'bajo la lluvia hasta la parada', pp: 'ido corriendo' },
  { inf: 'fliegen', part: 'geflogen', aux: 'sein', cat: 'bewegung', mid: ['zum', 'ersten', 'Mal', 'ganz', 'allein', 'nach', 'Spanien'], midEs: 'solo por primera vez a España', pp: 'volado' },
  { inf: 'kommen', part: 'gekommen', aux: 'sein', cat: 'bewegung', mid: ['wegen', 'des', 'Staus', 'zu', 'spät', 'zur', 'Besprechung'], midEs: 'tarde a la reunión por el atasco', pp: 'llegado' },
  { inf: 'reisen', part: 'gereist', aux: 'sein', cat: 'bewegung', mid: ['drei', 'Monate', 'lang', 'durch', 'Südamerika'], midEs: 'tres meses por Sudamérica', pp: 'viajado' },
  { inf: 'umziehen', part: 'umgezogen', aux: 'sein', cat: 'bewegung', mid: ['in', 'eine', 'kleinere', 'Wohnung', 'am', 'Stadtrand'], midEs: 'a un piso más pequeño en las afueras', pp: 'mudado' },
  { inf: 'aufstehen', part: 'aufgestanden', aux: 'sein', cat: 'zustand', mid: ['wegen', 'des', 'Termins', 'beim', 'Amt', 'sehr', 'früh'], midEs: 'muy pronto por la cita en la administración', pp: 'levantado' },
  { inf: 'einschlafen', part: 'eingeschlafen', aux: 'sein', cat: 'zustand', mid: ['vor', 'dem', 'Fernseher', 'auf', 'dem', 'Sofa'], midEs: 'en el sofá delante de la tele', pp: 'dormido' },
  { inf: 'aufwachen', part: 'aufgewacht', aux: 'sein', cat: 'zustand', mid: ['mitten', 'in', 'der', 'Nacht', 'von', 'einem', 'Geräusch'], midEs: 'en mitad de la noche por un ruido', pp: 'despertado' },
  { inf: 'sein', part: 'gewesen', aux: 'sein', cat: 'spezial', mid: ['noch', 'nie', 'in', 'Italien'], midEs: 'nunca en Italia', pp: 'estado' },
  { inf: 'bleiben', part: 'geblieben', aux: 'sein', cat: 'spezial', mid: ['wegen', 'der', 'Erkältung', 'das', 'ganze', 'Wochenende', 'zu', 'Hause'], midEs: 'todo el finde en casa por el resfriado', pp: 'quedado' },
  { inf: 'essen', part: 'gegessen', aux: 'haben', cat: 'haben', mid: ['zur', 'Feier', 'des', 'Tages', 'in', 'einem', 'italienischen', 'Restaurant'], midEs: 'en un restaurante italiano para celebrarlo', pp: 'comido' },
  { inf: 'sehen', part: 'gesehen', aux: 'haben', cat: 'haben', mid: ['im', 'Kino', 'einen', 'ziemlich', 'langweiligen', 'Film'], midEs: 'en el cine una película bastante aburrida', pp: 'visto' },
  { inf: 'kaufen', part: 'gekauft', aux: 'haben', cat: 'haben', mid: ['im', 'Schlussverkauf', 'endlich', 'einen', 'warmen', 'Wintermantel'], midEs: 'por fin un abrigo de invierno en las rebajas', pp: 'comprado' },
  { inf: 'lesen', part: 'gelesen', aux: 'haben', cat: 'haben', mid: ['im', 'Urlaub', 'drei', 'Bücher', 'auf', 'Deutsch'], midEs: 'tres libros en alemán en vacaciones', pp: 'leído' },
  { inf: 'arbeiten', part: 'gearbeitet', aux: 'haben', cat: 'haben', mid: ['die', 'ganze', 'Woche', 'an', 'dem', 'Projekt'], midEs: 'toda la semana en el proyecto', pp: 'trabajado' },
  { inf: 'warten', part: 'gewartet', aux: 'haben', cat: 'haben', mid: ['über', 'eine', 'halbe', 'Stunde', 'auf', 'den', 'Anschlusszug'], midEs: 'más de media hora al tren de enlace', pp: 'esperado' },
  { inf: 'schlafen', part: 'geschlafen', aux: 'haben', cat: 'haben', mid: ['wegen', 'der', 'Nachbarn', 'kaum', 'drei', 'Stunden'], midEs: 'apenas tres horas por los vecinos', pp: 'dormido' }
];

const SUBJ = [
  { de: 'ich', k: 'ich', es: 'yo', haben: 'habe', sein: 'bin', prätH: 'hatte', prätS: 'war', esAux: 'he' },
  { de: 'du', k: 'du', es: 'tú', haben: 'hast', sein: 'bist', prätH: 'hattest', prätS: 'warst', esAux: 'has' },
  { de: 'mein Bruder', k: 'er', es: 'mi hermano', haben: 'hat', sein: 'ist', prätH: 'hatte', prätS: 'war', esAux: 'ha' },
  { de: 'die neue Kollegin', k: 'er', es: 'la compañera nueva', haben: 'hat', sein: 'ist', prätH: 'hatte', prätS: 'war', esAux: 'ha' },
  { de: 'wir', k: 'wir', es: 'nosotros', haben: 'haben', sein: 'sind', prätH: 'hatten', prätS: 'waren', esAux: 'hemos' },
  { de: 'die Gäste', k: 'sie', es: 'los invitados', haben: 'haben', sein: 'sind', prätH: 'hatten', prätS: 'waren', esAux: 'han' }
];

const TIME = ['gestern', 'letztes Wochenende', 'vor ein paar Tagen', 'neulich', 'am Sonntag'];

const CAT_EX = {
  bewegung: 'Verbo de movimiento con cambio de lugar → Perfekt con "sein".',
  zustand: 'Verbo de cambio de estado (aufstehen, einschlafen, wachsen…) → Perfekt con "sein".',
  spezial: '"sein" (→ gewesen), "bleiben" (→ geblieben), "werden" y "passieren" forman el Perfekt con "sein" aunque no haya movimiento.',
  haben: 'Verbo con objeto en acusativo o sin cambio de lugar → Perfekt con "haben".'
};

// Frases para war/hatte (Präteritum). `a` = lema; se conjuga por sujeto.
const PRAET = [
  { de: (s) => `Gestern ___ ${s.de} zu Hause.`, a: 'war', es: (s) => t('tp.praetHome', { s: tc(s.es), v: verbo(s, 'estar') }), ex: 'Ubicación/estado en pasado → "sein" en Präteritum (war-).' },
  { de: (s) => `Letztes Jahr ___ ${s.de} in Wien.`, a: 'war', es: (s) => t('tp.praetWien', { s: tc(s.es), v: verbo(s, 'estar') }), ex: '"war-" es el Präteritum de "sein".' },
  { de: (s) => `Früher ___ ${s.de} viele Haustiere.`, a: 'hatte', es: (s) => t('tp.praetPets', { s: tc(s.es), v: verbo(s, 'tener') }), ex: 'Posesión → "haben"; en Präteritum "hatte-".' },
  { de: (s) => `Am Montag ___ ${s.de} Kopfschmerzen.`, a: 'hatte', es: (s) => t('tp.praetHeadache', { s: tc(s.es), v: verbo(s, 'tener') }), ex: '"Kopfschmerzen haben" (tener dolor) → Präteritum "hatte-".' }
];

// Mini-conjugador para la glosa. Conjugar es gramatica del idioma del alumno,
// asi que las formas salen de i18n.js y no del diccionario de contenido.
function verbo(s, inf) {
  const plural = s.k === 'wir' || s.k === 'sie';
  if (inf === 'estar') return t(plural ? 'tp.wasPlur' : 'tp.wasSing');
  return t(plural ? 'tp.hadPlur' : 'tp.hadSing');
}

const WAR_FORMS = ['war', 'warst', 'waren', 'wart'];
const HATTE_FORMS = ['hatte', 'hattest', 'hatten', 'hattet'];

// La glosa se arma con trozos traducidos por separado: el molde vive en
// i18n.js, el auxiliar se conjuga por persona y el resto pasa por tc().
const perfGloss = (subj, v) =>
  t('tp.perfGloss', {
    s: cap(tc(subj.es)),
    aux: t('tp.perfAux.' + subj.k),
    pp: tc(v.pp),
    m: tc(v.midEs)
  });

const frames = [
  // Elegir sein/haben conjugado (frase larga con complementos)
  {
    make(rng) {
      const subj = pick(rng, SUBJ);
      const v = pick(rng, V);
      const cuando = pick(rng, TIME);
      const correct = subj[v.aux];
      const wrongAux = subj[v.aux === 'haben' ? 'sein' : 'haben'];
      const prät = subj[v.aux === 'haben' ? 'prätH' : 'prätS'];
      return mc(rng, {
        conceptId: `seinhaben:${v.cat}`,
        prompt: t('tp.pickSeinHaben'),
        sentence: `${cap(subj.de)} ___ ${cuando} ${v.mid.join(' ')} ${v.part}.`,
        correct,
        distractors: shuffle(rng, [wrongAux, prät]),
        translation: perfGloss(subj, v),
        explanation: t('tp.shExpl', { inf: v.inf, aux: v.aux, cat: tc(CAT_EX[v.cat]) })
      });
    }
  },
  // Nebensatz con "weil": el auxiliar va al FINAL
  {
    make(rng) {
      const subj = pick(rng, SUBJ.filter((s) => ['ich', 'er', 'wir', 'sie'].includes(s.k)));
      const v = pick(rng, V);
      return order(rng, {
        conceptId: 'seinhaben:nebensatz',
        prompt: t('tp.orderWeilPlain'),
        solution: ['weil', subj.de, ...v.mid, v.part, subj[v.aux]],
        translation: t('tp.becausePerf', {
          s: subj.es === 'yo' ? '' : tc(subj.es) + ' ',
          aux: t('tp.perfAux.' + subj.k),
          pp: tc(v.pp),
          m: tc(v.midEs)
        }),
        explanation: t('tp.perfWeil', { aux: subj[v.aux], s: subj.de, part: v.part })
      });
    }
  },
  // war / hatte (conjugado por sujeto)
  {
    make(rng) {
      const subj = pick(rng, SUBJ);
      const fr = pick(rng, PRAET);
      const isWar = fr.a === 'war';
      const correct = isWar ? subj.prätS : subj.prätH;
      const otherAux = isWar ? subj.prätH : subj.prätS; // p.ej. "warst" -> "hattest"
      const forms = isWar ? WAR_FORMS : HATTE_FORMS;
      const wrongPerson = shuffle(rng, forms.filter((f) => f !== correct && f !== otherAux))[0];
      return mc(rng, {
        conceptId: 'seinhaben:praeteritum',
        prompt: t('tp.fillWarHatte'),
        sentence: fr.de(subj),
        correct,
        distractors: shuffle(rng, [otherAux, wrongPerson]),
        translation: fr.es(subj),
        explanation: t('tp.warHatteExpl', { ex: tc(fr.ex), de: subj.de, correct })
      });
    }
  },
  // Ordenar frase con sein (empieza por el complemento de tiempo → inversión)
  {
    make(rng) {
      const subj = pick(rng, SUBJ);
      const v = pick(rng, V.filter((x) => x.aux === 'sein'));
      const cuando = pick(rng, TIME);
      const solution = [...cuando.split(' ').map((w, i) => (i === 0 ? cap(w) : w)), subj.sein, subj.de, ...v.mid, v.part];
      return order(rng, {
        conceptId: v.cat === 'bewegung' ? 'seinhaben:bewegung' : v.cat === 'zustand' ? 'seinhaben:zustand' : 'seinhaben:spezial',
        prompt: t('tp.orderTimeFirst'),
        solution,
        translation: perfGloss(subj, v),
        explanation: t('tp.perfTimeFirst', { sein: subj.sein, part: v.part, inf: v.inf })
      });
    }
  }
];

export const theory = {
  intro:
    'En el Perfekt hay que elegir el verbo auxiliar: "sein" o "haben". Y en pasado simple, "sein" → war y "haben" → hatte, que se usan muchísimo. Pulsa cada bloque para ver la explicación completa y más ejemplos.',
  sections: [
    {
      title: 'Perfekt con "sein"',
      body: '(1) Movimiento con cambio de lugar. (2) Cambio de estado. (3) Los especiales: sein, bleiben, werden, passieren.',
      examples: [
        { de: 'Wir sind nach München gefahren.', es: 'Fuimos a Múnich.' },
        { de: 'Ich bin um sechs aufgestanden.', es: 'Me levanté a las seis.' }
      ],
      detail:
        '1) Movimiento de A a B (verbos intransitivos): gehen, kommen, fahren, fliegen, laufen, reisen, schwimmen, steigen, umziehen. La clave es el cambio de lugar, no el esfuerzo: "Ich bin geschwommen" (crucé nadando) pero "Ich habe im See geschwommen" es raro; con distancia siempre sein.\n\n2) Cambio de estado del sujeto: aufstehen, einschlafen, aufwachen, aufwachsen, wachsen, sterben, ertrinken. 3) Un grupo cerrado que hay que memorizar: sein → gewesen, bleiben → geblieben, werden → geworden, passieren → passiert, gelingen → gelungen. Ojo: "passieren" no lleva sujeto personal; se dice "Mir ist etwas Komisches passiert".',
      table: {
        title: 'Presente de "sein"',
        headers: ['persona', 'sein'],
        rows: [
          ['ich', 'bin'],
          ['du', 'bist'],
          ['er / sie / es', 'ist'],
          ['wir', 'sind'],
          ['ihr', 'seid'],
          ['sie / Sie', 'sind']
        ]
      },
      more: {
        examples: [
          { de: 'Sie ist letztes Jahr nach Berlin gezogen.', es: 'Se mudó a Berlín el año pasado.' },
          { de: 'Der Kuchen ist leider nicht gelungen.', es: 'El pastel no ha salido bien, por desgracia.' },
          { de: 'Was ist denn hier passiert?', es: '¿Qué ha pasado aquí?' },
          { de: 'Er ist mit 90 Jahren gestorben.', es: 'Murió a los 90 años.' },
          { de: 'Bist du schon mal geflogen?', es: '¿Has volado alguna vez?' }
        ]
      }
    },
    {
      title: 'Perfekt con "haben"',
      body: 'Todos los demás. Siempre los que llevan objeto en acusativo y los reflexivos.',
      examples: [
        { de: 'Ich habe einen Salat gegessen.', es: 'objeto en acusativo → haben' },
        { de: 'Ich habe mich sehr gefreut.', es: 'reflexivo → haben' }
      ],
      detail:
        'Regla práctica: si el verbo puede llevar un objeto en acusativo (¿qué / a quién?), va con haben: essen, trinken, kaufen, sehen, lesen, machen, lieben, besuchen. También todos los reflexivos ("sich freuen, sich waschen, sich anziehen") y los modales.\n\nY los verbos "de estar sin moverse": schlafen, sitzen, liegen, stehen, warten, arbeiten, wohnen → haben (en el sur de Alemania y Austria oirás "ich bin gestanden/gesessen", pero el estándar es haben). Verbos de movimiento SIN cambio de lugar: "Ich habe eine Stunde getanzt / trainiert".',
      table: {
        title: 'Presente de "haben"',
        headers: ['persona', 'haben'],
        rows: [
          ['ich', 'habe'],
          ['du', 'hast'],
          ['er / sie / es', 'hat'],
          ['wir', 'haben'],
          ['ihr', 'habt'],
          ['sie / Sie', 'haben']
        ]
      },
      more: {
        examples: [
          { de: 'Wir haben den ganzen Abend ferngesehen.', es: 'Hemos visto la tele toda la tarde.' },
          { de: 'Hast du gut geschlafen?', es: '¿Has dormido bien?' },
          { de: 'Ich habe zwei Stunden auf dich gewartet.', es: 'Te he esperado dos horas.' },
          { de: 'Sie hat sich schnell angezogen.', es: 'Se vistió rápido.' },
          { de: 'Er hat lange in Spanien gewohnt.', es: 'Vivió mucho tiempo en España.' }
        ]
      }
    },
    {
      title: 'Präteritum: war y hatte',
      body: 'Se usan muchísimo, también al hablar, en vez del Perfekt de sein/haben.',
      examples: [
        { de: 'Gestern war ich sehr müde.', es: 'Ayer estaba muy cansado.' },
        { de: 'Als Kind hatte ich einen Hund.', es: 'De niño tenía un perro.' }
      ],
      detail:
        'En singular, la 1ª y la 3ª persona son iguales (war, hatte). Aunque exista "ich bin … gewesen" y "ich habe … gehabt", en la práctica se dice "Ich war krank" y "Ich hatte keine Zeit". Con "als" (cuando, un hecho puntual del pasado) también se prefiere el Präteritum: "Als ich klein war, …". No confundas "hatte" (pasado: tenía) con "hätte" (Konjunktiv II: tendría).',
      table: {
        title: 'Präteritum de "sein" y "haben"',
        headers: ['persona', 'sein → war', 'haben → hatte'],
        rows: [
          ['ich', 'war', 'hatte'],
          ['du', 'warst', 'hattest'],
          ['er / sie / es', 'war', 'hatte'],
          ['wir', 'waren', 'hatten'],
          ['ihr', 'wart', 'hattet'],
          ['sie / Sie', 'waren', 'hatten']
        ]
      },
      more: {
        title: 'war / hatte en contexto',
        examples: [
          { de: 'Letztes Wochenende war das Wetter super.', es: 'El finde pasado hizo un tiempo genial.' },
          { de: 'Wir hatten gestern Besuch.', es: 'Ayer tuvimos visita.' },
          { de: 'Warst du schon mal in Wien?', es: '¿Has estado alguna vez en Viena?' },
          { de: 'Ich hatte keine Ahnung, dass du kommst.', es: 'No tenía ni idea de que venías.' },
          { de: 'Als ich jung war, hatte ich mehr Energie.', es: 'Cuando era joven tenía más energía.' }
        ]
      }
    }
  ],
  pitfalls: [
    '✗ Ich habe geblieben → ✓ Ich bin geblieben.',
    '✗ Er hat nach Hause gegangen → ✓ Er ist nach Hause gegangen.',
    'Para describir estados en pasado usa war/hatte, no el Perfekt: "Ich war krank" mejor que "Ich bin krank gewesen".',
    '"aufstehen", "einschlafen" y otros de cambio de estado van con sein aunque no haya desplazamiento.'
  ]
};

export default {
  id: 'seinHaben',
  name: 'sein oder haben',
  nameEs: 'Auxiliar del Perfekt: «sein» o «haben»',
  emoji: '⚖',
  blurb: 'Elegir el auxiliar del Perfekt, el orden en la subordinada y el Präteritum war / hatte',
  theory,
  concepts: [
    { id: 'seinhaben:bewegung', label: 'sein: verbos de movimiento' },
    { id: 'seinhaben:zustand', label: 'sein: cambio de estado' },
    { id: 'seinhaben:spezial', label: 'sein: sein/bleiben/werden/passieren' },
    { id: 'seinhaben:haben', label: 'haben: transitivos y sin movimiento' },
    { id: 'seinhaben:nebensatz', label: 'Auxiliar al final en subordinada (weil…)' },
    { id: 'seinhaben:praeteritum', label: 'Präteritum: war / hatte' }
  ],
  frames
};
