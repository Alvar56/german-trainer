// Monta una sesion combinando: (1) items nuevos al azar de las plantillas,
// (2) repaso de los conceptos donde fallas, (3) opcionalmente items nuevos
// generados por IA centrados en tus puntos debiles.

import { makeRng, randomSeed, pick, shuffle } from '../lib/rng.js';
import { weakConcepts, freshConcepts, itemSeenRecently, conceptosQueFaltan } from '../lib/progress.js';
import { getSettings, aiAvailable } from '../lib/settings.js';
import { generateItems, generateLektionItems } from '../lib/ai.js';
import { getLektion } from '../lib/kursbuch/index.js';
import { pickKasus, porEn } from '../lib/kasus.js';
// Alias: en este archivo `pick` ya es el de rng.js (elige al azar), así que el
// del idioma entra con otro nombre para no confundirlos.
import { pick as enIdioma, codigoIdioma } from '../lib/i18n.js';

export function itemKey(topicId, it) {
  return `${topicId}:${it.sentence || it.display || ''}|${it.solution ? it.solution.join(' ') : ''}`;
}

function candidatePool(topic, rng, n) {
  const frames = topic.frames || [];
  const out = [];
  if (!frames.length) return out;

  const hacer = (fr) => {
    try {
      out.push(fr.make(rng));
    } catch (e) {
      console.warn('frame fallo', topic.id, e);
    }
  };

  // Primero UNA pasada por todos los frames. En las lecciones del libro cada
  // frame es una frase concreta, asi que esto pone sobre la mesa todo el
  // material escrito a mano; sin ello, "Ordena la frase" sorteaba al azar y se
  // dejaba fuera la mitad de las frases, con tandas de 5 ejercicios en vez de
  // 10 aunque hubiera de sobra.
  for (const fr of shuffle(rng, frames)) hacer(fr);

  // Y luego extras al azar: en los temas escritos a mano (src/topics/*.js) un
  // frame no es una frase sino una bolsa de frases, y ahi la variedad sale
  // justamente de volver a tirar.
  for (let i = out.length; i < n; i++) hacer(pick(rng, frames));

  return out;
}

// Frases que hablan SOBRE el alemán en vez de ser alemán: pronunciación,
// ortografía, terminaciones, reglas... («In „Zimmer“ ist das „i“ ___»,
// «Der Akzent liegt auf der ___ Silbe», «64 = ___»). Rellenadas no son una
// frase que se pueda juzgar como correcta o con error.
const TERMINOS_META = [
  'Silbe\\p{L}*', 'Wort(anfang|ende|mitte)', 'Vokale?', 'Konsonanten?', 'Buchstaben?', 'chs?', 'Endung(en)?', 'Akzent', 'betont',
  'spricht man', 'schreibt man', 'Position', 'W-Frage', 'Ja-/Nein-Frage', 'Wort', '\\p{L}*wörter',
  'Nomen', 'Genus', 'Artikel', 'Verb', 'Infinitiv', 'Subjekt', 'Pronomen', 'Adjektiv', 'Präposition',
  'Singular', 'Plural', 'Konjunktiv', 'Nominativ', 'Akkusativ', 'Dativ', 'Genitiv'
];
const FRASE_META = new RegExp(
  [
    '[„“”"«»→=()]', // citas, flechas, ecuaciones y aclaraciones
    '\\d\\s+\\d', // cifras sueltas («1 0 ___ 0»)
    '^\\s*Ordne\\b',
    '\\bklingt\\b[^.!?]*___', // «Eine höfliche Bitte klingt ___»
    `\\b(${TERMINOS_META.join('|')})\\b`
  ].join('|'),
  'iu'
);
// Una pista final entre paréntesis («(wohin?)», «(a nosotros)») no hace meta
// la frase: sigue siendo alemán normal.
const PISTA_FINAL = /\s*\([^()]*\)\s*$/;

// Lo que no es una palabra que pueda ir en el hueco: terminaciones sueltas
// («-st», «arbeite-»), huecos dobles («aus … in») o frases enteras.
function rellenoValido(o) {
  const s = String(o ?? '').trim();
  return !!s && !/^-|-$|…|\.\.\.|[.?!]$/.test(s);
}

function distractores(it) {
  return it.options.filter((o) => o !== it.answer && rellenoValido(o));
}

// ¿Se puede convertir en "¿correcto o no?"? Solo frases alemanas de verdad:
// un "order" de al menos tres piezas, o un test con UN hueco cuya frase
// rellena sea alemán normal. Las preguntas de comprensión sin hueco
// («Welches Wort klingt wie „ai“?») salían tal cual, sin opciones, y no
// había nada que juzgar.
function sePuedeJuzgar(it) {
  if (it?.type === 'order') return Array.isArray(it.solution) && it.solution.length >= 3;
  if (it?.type !== 'mc' || !Array.isArray(it.options)) return false;
  const frase = String(it.sentence || '');
  return (
    (frase.match(/___/g) || []).length === 1 &&
    !FRASE_META.test(frase.replace(PISTA_FINAL, '')) &&
    rellenoValido(it.answer) &&
    distractores(it).length > 0
  );
}

// Convierte un item (mc u order) en uno de "¿correcto o no?", o null si no
// hay frase que juzgar. Sin `wantCorrect`, a cara o cruz; luego
// equilibrarJuicios reparte la tanda a medias.
function toJudge(rng, it, wantCorrect = rng() < 0.5) {
  if (!sePuedeJuzgar(it)) return null;
  let display, correctForm;
  if (it.type === 'order') {
    correctForm = it.solution.join(' ');
    const tokens = [...it.solution];
    if (!wantCorrect) {
      // Se cambian dos piezas contiguas; la primera nunca se mueve.
      const i = 1 + Math.floor(rng() * (tokens.length - 2));
      [tokens[i], tokens[i + 1]] = [tokens[i + 1], tokens[i]];
    }
    display = tokens.join(' ');
  } else {
    const filler = wantCorrect ? it.answer : pick(rng, distractores(it));
    display = String(it.sentence).replace('___', filler);
    correctForm = String(it.sentence).replace('___', it.answer);
  }
  return {
    id: it.id,
    type: 'judge',
    conceptId: it.conceptId,
    display,
    // Por texto y no por el sorteo: si el cambio deja la frase igual (dos
    // piezas iguales), es correcta.
    isCorrect: display === correctForm,
    correctForm,
    translation: it.translation,
    explanation: it.explanation,
    source: it.source,
    // El ejercicio de partida, para poder rehacerlo del otro lado al
    // equilibrar la tanda. No sale de buildSessionSmart.
    _origen: it
  };
}

// A cara o cruz por frase, una tanda de 10 podía traer 8 correctas y 2 con
// error. Esto deja la mitad de cada (la que sobra en tandas impares, al azar).
// Los juicios sin _origen (ya repartidos) cuentan pero no se tocan.
function equilibrarJuicios(rng, items) {
  const juicios = items.filter((it) => it.type === 'judge');
  const libres = shuffle(rng, juicios.filter((it) => it._origen));
  const fijosBien = juicios.filter((it) => !it._origen && it.isCorrect).length;
  const objetivo = Math.floor(juicios.length / 2) + (juicios.length % 2 && rng() < 0.5 ? 1 : 0);
  const faltanBien = Math.max(0, Math.min(libres.length, objetivo - fijosBien));
  const rehechos = new Map(
    libres.map((it, i) => [it, toJudge(rng, it._origen, i < faltanBien) || it])
  );
  return items.map((it) => rehechos.get(it) || it);
}

function quitarOrigen(items) {
  return items.map((it) => {
    if (!('_origen' in it)) return it;
    const { _origen, ...limpio } = it;
    return limpio;
  });
}

// Convierte un item de opción múltiple en uno de ordenar: se rellena el hueco
// y la frase entera pasa a ser la solución. Hace falta porque la IA solo
// devuelve opción múltiple, y "Ordenar" filtraba por type === 'order': con
// material de IA la tanda se quedaba vacía.
function toOrder(rng, it) {
  if (it.type === 'order') return it;
  if (it.type !== 'mc' || !it.sentence || !it.answer) return null;
  const frase = String(it.sentence).replace('___', it.answer).replace(/\s+/g, ' ').trim();
  const solution = frase.split(' ').filter(Boolean);
  // Menos de tres piezas no es un puzle, y más de doce es un castigo.
  if (solution.length < 3 || solution.length > 12) return null;
  let tokens = shuffle(rng, solution);
  let guard = 0;
  while (tokens.join('') === solution.join('') && guard++ < 10) {
    tokens = shuffle(rng, solution);
  }
  return {
    id: it.id,
    type: 'order',
    conceptId: it.conceptId,
    prompt: it.prompt,
    tokens,
    solution,
    sentence: frase,
    translation: it.translation,
    explanation: it.explanation,
    source: it.source
  };
}

// «Type it» necesita un hueco único y una respuesta única. Las preguntas de
// comprensión sin hueco (p. ej. «¿Qué caso rige mit?») y los ejercicios con
// varios huecos no se pueden pasar a un único campo de texto sin volverlos
// ambiguos o imposibles de corregir.
function sePuedeEscribir(it) {
  if (!['mc', 'write'].includes(it?.type) || !String(it.sentence || '').trim() || !String(it.answer || '').trim()) return false;
  const huecos = String(it.sentence).match(/___/g) || [];
  return huecos.length === 1 && !/\.\.\./.test(String(it.answer));
}

// Filtra/transforma el pool según el tipo de juego elegido.
function applyGameType(rng, items, gameType, size = 10) {
  if (!gameType || gameType === 'mixed') return items;
  if (gameType === 'mc') return items.filter((it) => it.type === 'mc');
  if (gameType === 'order') {
    const nativos = items.filter((it) => it.type === 'order');
    const convertidos = items.filter((it) => it.type === 'mc').map((it) => toOrder(rng, it)).filter(Boolean);
    if (nativos.length >= size * 2) return nativos;
    return [...nativos, ...convertidos];
  }
  // Solo lo que es una frase alemana con UNA cosa que pueda estar bien o mal
  // (ver sePuedeJuzgar): fuera textos con varios huecos, preguntas de
  // comprensión y reglas sobre el idioma.
  if (gameType === 'judge') return items.filter(sePuedeJuzgar).map((it) => toJudge(rng, it));
  // Escribir y contrarreloj no necesitan material nuevo: son los mismos huecos
  // de test, uno sin las opciones y el otro con un reloj encima.
  if (gameType === 'write') {
    return items.filter(sePuedeEscribir).map((it) => ({ ...it, type: 'write' }));
  }
  if (gameType === 'blitz') return items.filter((it) => it.type === 'mc');
  return items;
}

export function buildSession(topic, { size = 10, mode = 'mixed', gameType = 'mixed', difficultyIds = [] } = {}) {
  const rng = makeRng(randomSeed());
  const esTemaMezcla = topic.id === 'mix' || String(topic.id || '').startsWith('mix:');
  const esMezclaGramatica = gameType === 'grammar-mixed' && esTemaMezcla;
  const esTandaMixta = gameType === 'mixed' || esMezclaGramatica;
  const ids = topic.concepts.map((c) => c.id);
  const weak = new Set(mode === 'learn' ? [] : weakConcepts(ids));
  const fresh = new Set(freshConcepts(ids));
  // Solo las reglas a las que aun les faltan aciertos para contar al 100%.
  const faltan = new Set(mode === 'faltan' ? conceptosQueFaltan(ids) : []);

  let pool = candidatePool(topic, rng, size * 10);
  // «Mezcla de gramática» comparte el tema virtual con «De todo un poco»,
  // pero los marcos de diálogo pertenecen a Comunicación. Se filtran antes
  // del sorteo para que tampoco reaparezcan al rellenar preguntas recientes.
  if (esMezclaGramatica) {
    pool = pool.filter((it) => !String(it.conceptId || '').startsWith('komm:'));
  }
  const soloFacil = difficultyIds.includes('easy') && !difficultyIds.includes('hard');
  const soloDificil = difficultyIds.includes('hard') && !difficultyIds.includes('easy');
  // En Fácil quitamos los formatos de respuesta libre. Las preguntas de
  // opción múltiple siguen en la selección y conservan sus distractores.
  if (soloFacil) {
    pool = pool.filter((it) => !['write', 'open', 'cloze'].includes(it.type));
  }
  // Ordenar palabras es un formato fácil; no debe entrar en una tanda difícil.
  if (soloDificil) {
    pool = pool.filter((it) => it.type !== 'order');
  }
  // Una pregunta de Kasus Trainer entra tanto en «De todo un poco» como en
  // Gramática mixta. Se usa el mismo banco y las mismas opciones que el juego.
  if ((topic.id === 'mix' && gameType === 'mixed') || esMezclaGramatica) {
    pool.push(...pickKasus(Math.max(4, size)).map((f) => ({
      id: `mix-kasus-${f.id}`,
      type: 'mc',
      conceptId: 'kasus:trainer',
      prompt: enIdioma('Kasus Trainer · elige el artículo correcto', 'Kasus Trainer · choose the correct article'),
      sentence: `${f.vor ? f.vor + ' ' : ''}___ ${f.nach}`,
      options: f.options,
      answer: f.art,
      translation: f.es,
      explanation: codigoIdioma() === 'en' ? porEn(f.por) : f.por
    })));
  }
  pool = applyGameType(rng, pool, gameType, size);

  const seen = new Set();
  const uniq = [];
  for (const it of pool) {
    // «Finish the topic» tiene que poder encontrar todas las preguntas de las
    // reglas pendientes. Si primero se llena `uniq` con reglas ya completas,
    // el límite de size*3 puede cortar el pool antes de llegar a ellas.
    if (mode === 'faltan' && !faltan.has(it.conceptId)) continue;
    const k = itemKey(topic.id, it);
    if (seen.has(k)) continue;
    seen.add(k);
    if (itemSeenRecently(k)) continue; // no repitas lo mismo en pocas horas
    it._key = k;
    uniq.push(it);
  }
  if (topic.id === 'mix' && gameType === 'mixed') {
    const asegurarContenido = (match) => {
      if (uniq.some(match)) return;
      const it = pool.find(match);
      if (!it) return;
      it._key = itemKey(topic.id, it);
      uniq.push(it);
    };
    asegurarContenido((it) => it.conceptId === 'kasus:trainer');
    asegurarContenido((it) => String(it.conceptId || '').startsWith('komm:'));
    // El diálogo que pregunta qué habías dicho se renderiza como bocadillos.
    // Garantízalo también aunque el filtro de repetición haya agotado esas
    // preguntas; incluir cualquier otro ejercicio de Kommunikation no basta.
    asegurarContenido((it) => String(it.id || '').startsWith('komm-understand-'));
    asegurarContenido((it) => String(it.id || '').startsWith('komm-reply-'));
  }
  if (esMezclaGramatica && !uniq.some((it) => it.conceptId === 'kasus:trainer')) {
    const kasus = pool.find((it) => it.conceptId === 'kasus:trainer');
    if (kasus) {
      kasus._key = itemKey(topic.id, kasus);
      uniq.push(kasus);
    }
  }
  // Si el filtro "visto hace poco" deja pocos, rellena con el pool completo.
  if (uniq.length < size) {
    for (const it of pool) {
      if (mode === 'faltan' && !faltan.has(it.conceptId)) continue;
      const k = itemKey(topic.id, it);
      if (uniq.some((x) => x._key === k)) continue;
      it._key = k;
      uniq.push(it);
      if (uniq.length >= size * 3) break;
    }
  }

  const wItems = [];
  const fItems = [];
  const rItems = [];
  uniq.forEach((it) => {
    if (weak.has(it.conceptId)) wItems.push(it);
    else if (fresh.has(it.conceptId)) fItems.push(it);
    else rItems.push(it);
  });

  const chosen = [];
  const used = new Set();
  // Un texto con varios huecos es UN frame entre cientos, así que al azar no
  // salía casi nunca aunque esté escrito. Como es el ejercicio que más se
  // parece al examen, en las tandas mixtas se reserva un sitio: uno por tanda
  // si el tema tiene alguno. Con juegos concretos (Test, Ordenar…) no aplica,
  // porque ahí el cloze ni siquiera está en el pool.
  const RESERVA_CLOZE = 1;
  // Coge hasta `n` items distintos de `arr` repartiendo equitativamente entre conceptos.
  const take = (arr, n) => {
    const porConcepto = new Map();
    for (const it of shuffle(rng, arr)) {
      if (used.has(it._key)) continue;
      const cid = it.conceptId || 'def';
      if (!porConcepto.has(cid)) porConcepto.set(cid, []);
      porConcepto.get(cid).push(it);
    }
    let added = 0;
    while (added < n && chosen.length < size && porConcepto.size > 0) {
      for (const [cid, items] of Array.from(porConcepto.entries())) {
        if (added >= n || chosen.length >= size) break;
        if (items.length === 0) {
          porConcepto.delete(cid);
          continue;
        }
        const it = items.pop();
        if (!used.has(it._key)) {
          used.add(it._key);
          chosen.push(it);
          added++;
        }
      }
    }
  };

  if (mode === 'weak') {
    // El repaso de fallos lleva una pregunta por cada regla que aparece en el
    // botón. No lo rellenes con reglas sanas ni con preguntas extra.
    for (const conceptId of weak) {
      let candidates = uniq.filter((it) => it.conceptId === conceptId);
      if (!candidates.length) {
        candidates = pool
          .filter((it) => it.conceptId === conceptId)
          .map((it) => ({ ...it, _key: it._key || itemKey(topic.id, it) }));
      }
      if (candidates.length) take([pick(rng, candidates)], 1);
    }
    return chosen;
  }

  // Reserva categorías antes del reparto aleatorio: si se hace después, el
  // cupo ya está lleno y Comunicación desaparece entre tantos frames de gramática.
  if (esMezclaGramatica) {
    take(uniq.filter((it) => it.conceptId === 'kasus:trainer'), 1);
  }
  if (gameType === 'mixed' && topic.id === 'mix') {
    // El tamaño de la tanda se configura entre 4 y 30. Comunicación ocupa
    // aproximadamente la mitad del cupo no vocabulario, con un mínimo de las
    // dos direcciones de diálogo en tandas pequeñas y sin un tope fijo en las
    // grandes.
    const plazasKomm = Math.min(size - 1, Math.max(2, Math.floor(size / 2)));
    if (plazasKomm >= 2) {
      take(uniq.filter((it) => String(it.id || '').startsWith('komm-understand-')), 1);
      take(uniq.filter((it) => String(it.id || '').startsWith('komm-reply-')), 1);
    } else {
      const dialogos = [
        uniq.filter((it) => String(it.id || '').startsWith('komm-understand-')),
        uniq.filter((it) => String(it.id || '').startsWith('komm-reply-'))
      ].filter((grupo) => grupo.length);
      if (dialogos.length) take(pick(rng, dialogos), 1);
    }
    if (plazasKomm >= 3) {
      const prefixes = ['komm-write-', 'komm-order-', 'komm-q-', 'komm-r-'];
      const gruppen = prefixes
        .map((prefix) => uniq.filter((it) => String(it.id || '').startsWith(prefix)))
        .filter((gruppe) => gruppe.length);
      if (gruppen.length) take(pick(rng, gruppen), 1);
    }
    // El resto mantiene variedad gramatical y visual: huecos y Kasus cuando
    // el tamaño deja sitio, y después el reparto cubre los otros formatos.
    if (size >= 4) take(uniq.filter((it) => it.type === 'cloze'), RESERVA_CLOZE);
    if (size >= 5) take(uniq.filter((it) => it.conceptId === 'kasus:trainer'), 1);
  } else if (esTandaMixta && size >= 4) {
    take(uniq.filter((it) => it.type === 'cloze'), RESERVA_CLOZE);
  }

  if (mode === 'faltan') {
    // Solo lo que impide llegar al 100%, y lo que menos aciertos lleva primero.
    const loQueFalta = uniq.filter((it) => faltan.has(it.conceptId));
    take(loQueFalta, size);
  } else if (mode === 'learn') {
    take([...fItems, ...rItems], size);
  } else if (mode === 'random') {
    take(
      [...wItems, ...fItems, ...rItems].filter((it) =>
        topic.id !== 'mix' || it.conceptId !== 'kasus:trainer'
      ),
      size
    );
  } else {
    // Evita saturar con un único concepto débil limitando a máx 2 por concepto
    take(wItems, weak.size ? Math.min(Math.round(size * 0.4), weak.size * 2) : 0);
    take(fItems, fresh.size ? Math.min(Math.round(size * 0.25), fresh.size * 2) : 0);
  }
  // Rellena hasta `size` con lo que quede, sin repetir.
  take(rItems, size - chosen.length);
  take([...wItems, ...fItems], size - chosen.length);

  // En tandas mixtas, garantiza los formatos que admite una pregunta normal:
  // escribir, ordenar y juzgar, además de los huecos y test seleccionados arriba.
  if (esTandaMixta && chosen.length >= 3) {
    const mcIndices = [];
    chosen.forEach((it, idx) => {
      if (sePuedeEscribir(it) && !it.sentence.startsWith('—') && it.conceptId !== 'kasus:trainer' && !String(it.conceptId || '').startsWith('komm:')) {
        mcIndices.push(idx);
      }
    });
    const shuffled = shuffle(rng, mcIndices);
    const usadosParaFormato = new Set();
    const asegurar = (tipo, convertir) => {
      if (chosen.some((it) => it.type === tipo)) return;
      for (const idx of shuffled) {
        if (usadosParaFormato.has(idx)) continue;
        const convertido = convertir(chosen[idx]);
        if (!convertido) continue;
        chosen[idx] = convertido;
        usadosParaFormato.add(idx);
        return;
      }
    };
    if (!soloFacil) asegurar('write', (it) => ({ ...it, type: 'write' }));
    if (!soloDificil) asegurar('order', (it) => toOrder(rng, it));
    asegurar('judge', (it) => toJudge(rng, it));
  }

  // Espaciado inteligente para evitar que dos ejercicios del mismo tipo o concepto salgan seguidos
  const espaciados = [];
  const pendientes = shuffle(rng, chosen).slice(0, size);
  while (pendientes.length > 0) {
    const prev = espaciados[espaciados.length - 1];
    let bestIdx = pendientes.findIndex((it) =>
      (!prev || (it.conceptId !== prev.conceptId && it.type !== prev.type))
    );
    if (bestIdx === -1) {
      bestIdx = pendientes.findIndex((it) => !prev || it.conceptId !== prev.conceptId);
    }
    if (bestIdx === -1) bestIdx = 0;
    espaciados.push(pendientes.splice(bestIdx, 1)[0]);
  }

  return equilibrarJuicios(rng, espaciados.map(stripInternal));
}

function stripInternal(it) {
  const { _key, ...clean } = it;
  return clean;
}

// Version que ademas intenta meter items de IA (si esta activada).
// mode 'ai' = sesion muy centrada en IA + tus fallos.
// Cuánto se espera a la IA antes de tirar de plantillas.
//
// Medido con el puente local: escribir los ejercicios de una Lektion tarda
// ~50 s. Con el límite anterior (30 s para todo) la IA NUNCA llegaba a tiempo:
// se esperaba medio minuto y se acababa jugando con plantillas igualmente.
//
//   ESPERA_RETO   → has pulsado "Reto con IA": lo has pedido tú, así que se le
//                   da tiempo de verdad. Y desde que la tanda vive en aiJobs,
//                   irte a otra sección ya no tira el trabajo.
//   ESPERA_MEZCLA → Test normal, donde la IA solo aporta unos pocos ejercicios
//                   de propina: aquí manda empezar rápido.
// Medido: un reto de 6 ejercicios "difíciles" ronda los 100 s, así que 120 no
// daba margen y se perdía por los pelos.
const ESPERA_RETO = 180000;
const ESPERA_MEZCLA = 30000;

// La tanda final puede mezclar plantillas e IA: se reparte a medias aquí, con
// todo ya junto, y no antes.
export async function buildSessionSmart(topic, opts = {}) {
  const sesion = await armarSesion(topic, opts);
  const rng = makeRng(randomSeed());
  return { ...sesion, items: quitarOrigen(equilibrarJuicios(rng, sesion.items || [])) };
}

async function armarSesion(topic, opts) {
  const gt = opts.gameType || 'mixed';
  const size = opts.size || 10;
  const weakReviewIds = opts.mode === 'weak'
    ? weakConcepts((topic?.concepts || []).map((concept) => concept.id), size)
    : [];

  // Tema de usuario generado con IA: usa directamente sus ejercicios guardados
  if (topic.custom && topic.userItems?.length) {
    const rng = makeRng(randomSeed());
    const listos = applyGameType(rng, topic.userItems, gt);
    const finalItems = listos.length ? listos : topic.userItems;
    return {
      items: shuffleArray(finalItems).slice(0, size),
      aiUsed: true,
      aiCount: finalItems.length
    };
  }

  const aiMode = opts.mode === 'ai';
  const base = buildSession(topic, { ...opts, mode: aiMode ? 'weak' : opts.mode });
  const s = getSettings();

  // Lección del libro sin plantillas propias: todo el material viene de la IA,
  // generado a partir de las reglas de esa Lektion.
  if (topic.aiOnly) {
    if (!aiAvailable()) return { items: [], aiUsed: false, aiError: 'IA no disponible' };
    try {
      const items = await generateLektionItems({
        lektion: getLektion(topic.lektionId),
        focus: 'grammatik',
        count: size,
        notes: opts.mode === 'weak'
          ? `Für die Fehlerwiederholung: Erstelle genau eine Frage zu jeder aufgeführten Regel und in derselben Reihenfolge. Regel-IDs und Regeln: ${weakReviewIds.map((id) => `${id}: ${topic.concepts.find((concept) => concept.id === id)?.name || id}`).join(' | ')}`
          : ''
      });
      // La IA devuelve opción múltiple; si has pedido escribir o cazar el
      // error, se convierten igual que los de plantilla. Sin esto, en las
      // lecciones sin plantillas propias el botón de Escribir daba un test.
      const rng = makeRng(randomSeed());
      const prepared = applyGameType(rng, items, gt).slice(0, size);
      return {
        items: opts.mode === 'weak'
          ? prepared.map((item, index) => ({ ...item, conceptId: weakReviewIds[index] || item.conceptId }))
          : shuffleArray(prepared),
        aiUsed: true,
        aiCount: items.length
      };
    } catch (e) {
      return { items: [], aiUsed: false, aiError: e.message };
    }
  }

  // El repaso de fallos es una cola cerrada: no la rellenes con ejercicios de
  // IA ni con reglas que no estaban en la cifra del botón.
  if (opts.mode === 'weak') return { items: base, aiUsed: false };

  // La IA genera opción múltiple; solo la mezclamos en juegos que la admiten.
  //
  // En la portada hay dos botones que caen los dos en el topic 'mix', y hacen
  // cosas distintas a propósito:
  //   "De todo un poco"  (mode 'mixed'/'todo') → offline, solo plantillas.
  //   "Repaso con IA"    (mode 'ai')           → ejercicios nuevos de la IA.
  // Por eso el corte es `topic.id === 'mix' && !aiMode`: antes era solo
  // `topic.id === 'mix'` y se llevaba por delante también al botón de IA, que
  // nunca llegaba a pedir nada.
  // El mando de ajustes puede estar a cero: entonces la tanda sale entera de
  // plantillas y aparece al instante, sin esperar a la IA.
  //
  // 'Repaso con IA' se salta el mando a proposito (sube a 0.6 como minimo):
  // ese boton pide ejercicios nuevos, y respetar el cero ahi lo dejaria sin
  // hacer nada.
  const share = aiMode ? Math.max(0.6, s.aiShare ?? 0.3) : s.aiShare ?? 0.3;

  // El mando vale para los CUATRO juegos de gramática, no solo para el test.
  // La IA devuelve opción múltiple y de ahí salen los demás: escribir es el
  // mismo hueco sin opciones, cazar el error enseña la frase con una pieza
  // cambiada y ordenar reparte la frase entera en piezas.
  const temaMezcla = topic.id === 'mix' || String(topic.id || '').startsWith('mix:');
  if (!aiAvailable() || share <= 0 || (temaMezcla && !aiMode && (topic.id === 'mix' || gt === 'grammar-mixed'))) {
    return { items: aiMode ? buildSession(topic, { ...opts, mode: 'weak' }) : base, aiUsed: false };
  }

  // Sin el suelo de 1: con el mando a cero pedia un ejercicio igualmente, y la
  // espera era la misma que con el mando al 10%.
  const want = Math.max(1, Math.round(size * share));
  const ids = topic.concepts.map((c) => c.id);
  const hints = weakConcepts(ids, 5)
    .map((id) => topic.concepts.find((c) => c.id === id))
    .map((c) => c?.label || c?.name)
    .filter(Boolean);
  const avoid = base.map((it) => it.sentence).filter(Boolean).slice(0, 8);

  try {
    const aiItems = await Promise.race([
      topic.lektionId
        ? generateLektionItems({ lektion: getLektion(topic.lektionId), focus: 'grammatik', count: want })
        : generateItems({
            topicId: topic.id,
            topicName: topic.name,
            conceptHints: hints,
            count: want,
            avoid,
            // Si has pulsado "Repaso con IA" es que quieres algo que las
            // plantillas no te dan: frases más largas y con dos reglas a la
            // vez, no otro hueco suelto.
            reto: aiMode
          }),
      new Promise((res) => setTimeout(() => res([]), aiMode ? ESPERA_RETO : ESPERA_MEZCLA))
    ]);
    if (!aiItems.length) return { items: base, aiUsed: false };
    // Al juego pedido antes de mezclar: si no, en "Escribir" salían con
    // opciones y en "Ordenar" no salían en absoluto.
    const rng = makeRng(randomSeed());
    const aiListos = applyGameType(rng, aiItems, gt);
    if (!aiListos.length) return { items: base, aiUsed: false };
    // Sustituye los ultimos `n` items base por los de IA.
    const n = Math.max(0, Math.min(aiListos.length, want, base.length - 1));
    if (n === 0) return { items: base, aiUsed: false };
    const merged = [...base.slice(0, base.length - n), ...aiListos.slice(0, n)];
    return { items: shuffleArray(merged), aiUsed: true, aiCount: n };
  } catch (e) {
    console.warn('IA no disponible:', e.message);
    return { items: base, aiUsed: false, aiError: e.message };
  }
}

function shuffleArray(a) {
  const r = makeRng(randomSeed());
  return shuffle(r, a);
}

// Las rondas de vocabulario que se mezclan en la sesión no salen del temario,
// así que no están en topic.concepts: sin esto el resumen de fallos enseñaba
// "vocab:bedeutung" tal cual.
const ETIQUETAS_VOCAB = {
  'vocab:artikel': ['El artículo (der/die/das)', 'The article (der/die/das)'],
  'vocab:bedeutung': ['Qué significa la palabra', 'What the word means'],
  'vocab:ausdruck': ['Cómo se dice en alemán', 'How to say it in German'],
  'vocab:schreibung': ['Cómo se escribe', 'How it is spelled'],
  'vocab:match': ['Emparejar palabras', 'Match the words'],
  'vocab:hangman': ['Ahorcado', 'Hangman']
};

export function conceptLabel(topic, id) {
  // Los temas escritos a mano traen "label"; las lecciones del libro, "name".
  // Sin el segundo, el resumen enseñaba el id pelado (a21-l1:perfekt-...).
  const c = topic.concepts.find((x) => x.id === id);
  if (c?.label || c?.name) return c.label || c.name;
  const voc = ETIQUETAS_VOCAB[id];
  if (voc) return enIdioma(voc[0], voc[1]);
  return id;
}
