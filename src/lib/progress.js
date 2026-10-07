// Seguimiento de dominio por "concepto" (una regla concreta dentro de un
// tema, p.ej. "modal:muessen" o "prep:akkusativ:durch"). Con esto la app
// sabe donde fallas y te lo vuelve a preguntar (repeticion espaciada simple).

import { storage, KEYS, sumarContadorLocal } from './storage.js';

const DEFAULT = { concepts: {}, seenItems: {}, failedItems: {}, kommPracticed: {}, kommEscuchadas: {}, kommFailedItems: {}, sessions: 0 };

// Apartados de Kommunikation que cambiaron de nombre al reorganizar las
// lecciones (8 funciones de 10 conversaciones cada una).
//
// El progreso se guarda con el nombre alemán del apartado como clave, así que
// renombrar uno deja lo que llevabas hecho colgando de una clave que ya no
// existe: la barra baja sola y no hay forma de saber por qué. Esto lo traduce
// una vez, igual que aciertosDe() traduce los formatos viejos del valor.
//
// Cuando un apartado se partió en dos, los aciertos se reparten a medias entre
// los dos herederos: el material practicado es el mismo, solo está en dos
// sitios, y así ni se pierde crédito ni se regala el doble.
const RENOMBRADAS = {
  'a11-start:begrüßen und verabschieden': ['a11-start:begrüßen', 'a11-start:sich verabschieden'],
  'a21-l1:Wünsche ausdrücken': ['a21-l1:Wünsche und Sehnsüchte ausdrücken'],
  'a21-l1:über Vergangenes sprechen': ['a21-l1:über die Vergangenheit und den Anfang berichten'],
  'a21-l1:nachfragen, Interesse und Mitgefühl zeigen': [
    'a21-l1:nachfragen und Interesse zeigen',
    'a21-l1:Mitgefühl und Verständnis ausdrücken'
  ],
  'a21-l3:Vorlieben ausdrücken': ['a21-l3:Vorlieben beim Sport ausdrücken']
};

const MARCA_RENOMBRADAS = 'kommRenombradasV1';

function migrarRenombradas(p) {
  if (p[MARCA_RENOMBRADAS]) return p;
  const kp = p.kommPracticed || {};
  for (const [vieja, nuevas] of Object.entries(RENOMBRADAS)) {
    const v = kp[vieja];
    if (!v) continue;
    const trozo = Math.round(aciertosDe(v) / nuevas.length);
    for (const nueva of nuevas) {
      // Si ya has practicado la nueva, se suma: lo de antes no se tira.
      const actual = kp[nueva];
      kp[nueva] = {
        at: Math.max((typeof v === 'object' && v.at) || 0, (typeof actual === 'object' && actual?.at) || 0),
        aciertos: aciertosDe(actual) + trozo,
        preguntas: ((typeof actual === 'object' && actual?.preguntas) || 0)
          + Math.round(((typeof v === 'object' && v.preguntas) || 0) / nuevas.length),
        veces: ((typeof actual === 'object' && actual?.veces) || 0)
          + ((typeof v === 'object' && v.veces) || 1)
      };
    }
    delete kp[vieja];
  }
  p.kommPracticed = kp;
  p[MARCA_RENOMBRADAS] = true;
  return p;
}

let migrado = false;

function load() {
  const p = { ...DEFAULT, ...storage.get(KEYS.progress, DEFAULT) };
  // Una vez por sesión: la migración escribe, y escribir en cada lectura sería
  // tocar el almacén cientos de veces por pantalla.
  if (!migrado && !p[MARCA_RENOMBRADAS]) {
    migrado = true;
    return storage.update(KEYS.progress, DEFAULT, migrarRenombradas);
  }
  return p;
}

// Modelo por concepto: aciertos, fallos, "fuerza" (0..5 estilo Leitner),
// ultima vez visto y proxima revision recomendada (timestamp).
function blank() {
  return { correct: 0, wrong: 0, strength: 0, lastSeen: 0, due: 0, streak: 0 };
}

const INTERVALS = [0, 20e3, 2 * 60e3, 10 * 60e3, 60 * 60e3, 24 * 60e3 * 60, 3 * 24 * 60e3 * 60];

export function recordAnswer(conceptId, correct, extra = {}) {
  return storage.update(KEYS.progress, DEFAULT, (p) => {
    // Los dos cajones, por si lo guardado viene de una version que no los
    // tenia: sin esto, contestar un ejercicio revienta con un TypeError y no
    // se apunta NADA, ni ahi ni en el resto de la tanda. Es la misma guarda
    // que ya lleva recordKommPracticed.
    p.concepts = p.concepts || {};
    p.seenItems = p.seenItems || {};
    p.failedItems = p.failedItems || {};
    const c = { ...blank(), ...(p.concepts[conceptId] || {}) };
    const now = Date.now();
    // Lo que no sea tipo test (mc) cuenta por dos para el progreso / porcentaje
    const peso = extra.peso != null ? extra.peso : (extra.type && extra.type !== 'mc' ? 2 : 1);
    if (correct) {
      sumarContadorLocal(c, 'correct', peso);
      c.streak += 1;
      c.strength = Math.min(6, c.strength + peso);
    } else {
      sumarContadorLocal(c, 'wrong', 1);
      c.streak = 0;
      c.strength = Math.max(0, c.strength - 2);
    }
    if (extra.reviewMistake && correct) c.reviewCleared = true;
    else if (!correct) delete c.reviewCleared;
    c.lastSeen = now;
    c.due = now + INTERVALS[Math.min(c.strength, INTERVALS.length - 1)];
    p.concepts[conceptId] = c;
    if (extra.itemKey) p.seenItems[extra.itemKey] = now;
    if (extra.itemKey && extra.item) {
      const failureKey = `${extra.itemKey}|${extra.item.type || 'unknown'}`;
      p.failedItems[failureKey] = correct
        ? { conceptId, item: null, at: now, resolved: true }
        : { conceptId, item: extra.item, at: now, resolved: false };
    }
    return p;
  });
}

export function bumpSessions() {
  storage.update(KEYS.progress, DEFAULT, (p) => ({ ...p, sessions: (p.sessions || 0) + 1 }));
}

export function getConcept(conceptId) {
  return load().concepts[conceptId] || blank();
}

// Prioridad de repaso: cuanto mas alto, mas urgente volver a preguntarlo.
function priority(c, now) {
  if (!c || (c.correct === 0 && c.wrong === 0)) return 0; // no visto -> lo maneja "nuevos"
  const overdue = Math.max(0, now - c.due) / 60000; // minutos de retraso
  const errRate = c.wrong / Math.max(1, c.correct + c.wrong);
  const weakBonus = (6 - c.strength) * 1.5;
  return errRate * 6 + Math.min(overdue, 30) * 0.4 + weakBonus;
}

// Devuelve ids de conceptos ordenados por urgencia de repaso.
export function weakConcepts(allConceptIds, limit = 12) {
  const p = load();
  const now = Date.now();
  return allConceptIds
    .map((id) => ({ id, score: priority(p.concepts[id], now) }))
    .filter((x) => x.score > 0.5 && !p.concepts[x.id]?.reviewCleared)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((x) => x.id);
}

// Los ejercicios fallados se guardan enteros para que «Repasar mis fallos»
// vuelva a preguntar lo mismo, con el mismo tipo, y no regenere una pregunta
// aleatoria del concepto. Las entradas resueltas son tombstones para que una
// sincronización antigua no vuelva a traer un fallo ya corregido.
export function failedItemsForConcepts(allConceptIds) {
  const allowed = new Set(allConceptIds || []);
  return Object.values(load().failedItems || {})
    .filter((entry) => entry && !entry.resolved && entry.item && allowed.has(entry.conceptId))
    .sort((a, b) => (a.at || 0) - (b.at || 0))
    .map((entry) => entry.item);
}

// Conceptos que aun no has practicado (para introducir cosas nuevas).
export function freshConcepts(allConceptIds) {
  const p = load();
  return allConceptIds.filter((id) => {
    const c = p.concepts[id];
    return !c || (c.correct === 0 && c.wrong === 0);
  });
}

export function itemSeenRecently(itemKey, withinMs = 6 * 60 * 60 * 1000) {
  const t = load().seenItems[itemKey];
  return t ? Date.now() - t < withinMs : false;
}

// Aciertos que necesita una regla para contar entera en el porcentaje, y tope
// por encima del cual dejan de sumar. Es el mismo numero que usa topicMastery
// y el que decide que reglas faltan.
//
// Con 8 reglas por leccion x 30 aciertos = 240 aciertos para el 100%,
// quedando exactamente equilibrada con el vocabulario (120 palabras x 2 = 240)
// y con la comunicacion (8 funciones x 30 = 240).
export const ACIERTOS_POR_CONCEPTO = 30;

// A partir de que porcentaje aparece el boton de "terminar el tema". Por
// debajo falta tanto que seria la sesion normal con otro nombre.
export const UMBRAL_TERMINAR = 70;

export function conceptosQueFaltan(conceptIds) {
  const p = load();
  return conceptIds
    .filter((id) => (p.concepts[id]?.correct || 0) < ACIERTOS_POR_CONCEPTO)
    .sort((a, b) => (p.concepts[a]?.correct || 0) - (p.concepts[b]?.correct || 0));
}

// Aciertos que faltan, sumados, para completar los conceptos seleccionados.
export function aciertosQueFaltan(conceptIds) {
  const p = load();
  return (conceptIds || []).reduce((total, id) => {
    const correct = Math.min(ACIERTOS_POR_CONCEPTO, p.concepts[id]?.correct || 0);
    return total + Math.max(0, ACIERTOS_POR_CONCEPTO - correct);
  }, 0);
}

export function topicMastery(conceptIds) {
  const p = load();
  if (!conceptIds.length) return { pct: 0, practiced: 0, total: 0, complete: false };
  let sum = 0;
  let practiced = 0;
  conceptIds.forEach((id) => {
    const c = p.concepts[id];
    if (c && (c.correct || c.wrong)) {
      practiced += 1;
      if (c.correct > 0) sum += Math.min(ACIERTOS_POR_CONCEPTO, c.correct);
    }
  });
  const complete = conceptIds.every((id) => (p.concepts[id]?.correct || 0) >= ACIERTOS_POR_CONCEPTO);
  return {
    // El redondeo podía convertir 239/240 en 100% y conceder la corona con
    // una regla todavía incompleta. Solo el dominio exacto llega al 100.
    pct: complete
      ? 100
      : Math.min(99, Math.round((sum / (Math.max(1, conceptIds.length) * ACIERTOS_POR_CONCEPTO)) * 100)),
    practiced,
    total: conceptIds.length,
    complete
  };
}

// ---------- Kommunikation ----------
//
// Se apunta RESPUESTA A RESPUESTA, igual que una regla de gramática o una
// palabra de vocabulario. Ha pasado por dos arreglos:
//
//   · antes bastaba con que la IA devolviera el diálogo —sin leerlo siquiera—
//     para que contara, así que el porcentaje medía clics, no práctica;
//   · y luego se apuntaba la tanda entera al terminarla, así que la barra
//     pegaba saltos de hasta veinte puntos y salirse a la mitad no contaba
//     nada de lo que llevabas bien.

// Con lo que se aprueba una tanda. Solo es el mensaje del final ("bien" o
// "otra vuelta"): el porcentaje no lo mira, cuenta aciertos.
export const KOMM_APROBADO = 80;

// Aciertos que pide un apartado para llenarse, igual que una regla pide 30 y
// una palabra 2. Con 8 funciones x 30 aciertos = 240 aciertos por leccion,
// equilibrado al 100% con vocabulario (120 x 2 = 240) y gramatica (8 x 30 = 240).
export const ACIERTOS_POR_APARTADO = 30;

// Los aciertos que llevas en un apartado.
//
// Antes esto se guardaba de otras maneras -primero solo la fecha, luego la
// mejor nota y las tandas aprobadas-, asi que las entradas viejas se traducen
// a aciertos en vez de tirarse: lo que ya tenias hecho sigue contando.
function aciertosDe(v) {
  if (!v) return 0;
  if (typeof v !== 'object') return ACIERTOS_POR_APARTADO; // solo se escribia al aprobar
  if (typeof v.aciertos === "number") return v.aciertos;
  const mejor = v.mejor ?? v.pct ?? KOMM_APROBADO;
  const porNota = Math.round(Math.min(1, mejor / KOMM_APROBADO) * ACIERTOS_POR_APARTADO);
  return Math.max(porNota, (v.buenas || 0) * ACIERTOS_POR_APARTADO);
}

// Lo que suma un apartado, de 0 a 1.
export function pesoDeApartado(v) {
  return Math.min(1, aciertosDe(v) / ACIERTOS_POR_APARTADO);
}

// Se apunta lo que has acertado de ese apartado en la tanda. No hay nota que
// pasar: fallar no resta, solo no suma, igual que en los otros dos.
export function recordKommPracticed(lektionId, funktion, aciertos = 0, preguntas = 0, extra = {}) {
  storage.update(KEYS.progress, DEFAULT, (p) => {
    p.kommPracticed = p.kommPracticed || {};
    const clave = `${lektionId}:${funktion}`;
    const antes = p.kommPracticed[clave];
    const veces = (typeof antes === 'object' && antes?.veces) || (antes ? 1 : 0);
    const fallosPrevios = typeof antes === 'object' && antes
      ? (typeof antes.fallos === 'number' ? antes.fallos : Math.max(0, (antes.preguntas || 0) - (antes.aciertos || 0)))
      : 0;
    const actualizado = {
      ...(typeof antes === 'object' && antes ? antes : {}),
      at: Date.now(),
      aciertos: aciertosDe(antes),
      preguntas: (typeof antes === 'object' && antes?.preguntas) || 0,
      fallos: fallosPrevios,
      veces
    };
    sumarContadorLocal(actualizado, 'aciertos', Math.max(0, aciertos));
    sumarContadorLocal(actualizado, 'preguntas', Math.max(0, preguntas));
    sumarContadorLocal(actualizado, 'fallos', preguntas > 0 && aciertos <= 0 ? preguntas : 0);
    sumarContadorLocal(actualizado, 'veces', 1);
    if (extra.reviewMistake && aciertos > 0) actualizado.reviewCleared = true;
    else if (preguntas > aciertos) delete actualizado.reviewCleared;
    p.kommPracticed[clave] = actualizado;
    return p;
  });
}

function clavePreguntaKomm(lektionId, pregunta) {
  const item = pregunta?.item || {};
  const solucion = Array.isArray(item.solution) ? item.solution.join(' ') : (item.answer || '');
  return JSON.stringify([
    lektionId,
    pregunta?.seccion || '',
    pregunta?.tipo || '',
    pregunta?.explica?.de || '',
    pregunta?.explica?.es || '',
    item.prompt || '',
    item.sentence || '',
    item.anweisung || '',
    solucion,
    Boolean(item.sentenceAfterOptions)
  ]);
}

// Guarda el ejercicio exacto de Kommunikation, con su formato y opciones,
// para que el repaso vuelva a mostrar lo que se falló y no genere otra pregunta.
export function recordKommQuestion(lektionId, pregunta, correcta) {
  if (!lektionId || String(lektionId).startsWith('mix') || !pregunta) return;
  const key = clavePreguntaKomm(lektionId, pregunta);
  storage.update(KEYS.progress, DEFAULT, (p) => {
    p.kommFailedItems = p.kommFailedItems || {};
    p.kommFailedItems[key] = correcta
      ? { at: Date.now(), lektionId, question: null, resolved: true }
      : { at: Date.now(), lektionId, question: pregunta, resolved: false };
    return p;
  });
}

export function kommFailedQuestions(lektionId) {
  return Object.values(load().kommFailedItems || {})
    .filter((entry) => entry?.lektionId === lektionId && !entry.resolved && entry.question)
    .sort((a, b) => (a.at || 0) - (b.at || 0))
    .map((entry) => entry.question);
}

// Marca una conversación como escuchada solo cuando termina su reproducción
// completa. Se guarda aparte de los aciertos de ejercicios para que el tick
// de la pestaña Teoría represente haber oído el diálogo entero.
export function recordKommEscuchada(lektionId, funktion) {
  if (!lektionId || !funktion) return;
  const clave = `${lektionId}:${funktion}`;
  storage.update(KEYS.progress, DEFAULT, (p) => {
    p.kommEscuchadas = p.kommEscuchadas || {};
    if (!p.kommEscuchadas[clave]) p.kommEscuchadas[clave] = Date.now();
    return p;
  });
}

export function kommListeningProgress(lektionId, kommunikationArray) {
  const escuchadas = load().kommEscuchadas || {};
  const lista = kommunikationArray || [];
  const hechas = {};
  for (const k of lista) {
    const at = escuchadas[`${lektionId}:${k.funktion}`];
    if (at) hechas[k.funktion] = { at };
  }
  const completadas = Object.keys(hechas).length;
  return {
    hechas,
    completadas,
    total: lista.length,
    pct: lista.length ? Math.round((completadas / lista.length) * 100) : 0
  };
}

export function kommMastery(lektionId, kommunikationArray) {
  const p = load();
  const vacio = { pct: 0, practiced: 0, total: 0, hechas: {} };
  if (!kommunikationArray || !kommunikationArray.length) return vacio;
  let practiced = 0;
  const kp = p.kommPracticed || {};
  // Cuáles están hechas, no solo cuántas: la lista las marca con un ✓ para que
  // se vea de un vistazo cuál te queda por practicar.
  const hechas = {};
  // La barra es la media de lo que lleva cada apartado, y lo que lleva un
  // apartado son sus aciertos: exactamente igual que en gramatica y en
  // vocabulario. Un apartado queda hecho (y con su tic) al llenarse.
  let suma = 0;
  kommunikationArray.forEach((k) => {
    const v = kp[`${lektionId}:${k.funktion}`];
    if (!v) return;
    suma += pesoDeApartado(v);
    if (aciertosDe(v) < ACIERTOS_POR_APARTADO) return;
    practiced += 1;
    hechas[k.funktion] = typeof v === 'object' ? v : { at: v, veces: 1 };
  });
  const porcentaje = Math.round((suma / kommunikationArray.length) * 100);
  const completo = practiced === kommunikationArray.length;
  return {
    // El redondeo podía mostrar 100% con un punto pendiente y conceder la
    // corona antes de terminar el último apartado.
    pct: completo ? 100 : Math.min(99, porcentaje),
    practiced,
    total: kommunikationArray.length,
    hechas
  };
}

// Los apartados en los que has FALLADO y que todavia no estan llenos. Es el
// equivalente de cartasFalladas() en vocabulario: lo que has tocado y se te ha
// resistido, para poder repasarlo aparte.
//
// Kommunikation guarda el progreso por apartado, no frase a frase, asi que lo
// que se repasa es el apartado entero: sus frases, otra vez.
export function kommApartadosFallados(lektionId, kommunikationArray) {
  const p = load();
  const kp = p.kommPracticed || {};
  return (kommunikationArray || []).filter((k) => {
    const v = kp[`${lektionId}:${k.funktion}`];
    if (!v || typeof v !== 'object') return false;
    const fallos = typeof v.fallos === 'number'
      ? v.fallos
      : Math.max(0, (v.preguntas || 0) - (v.aciertos || 0));
    // Un apartado ya dominado también puede contener errores recientes: la
    // maestría no debe esconderlos del botón «Review my mistakes».
    return fallos > 0 && !v.reviewCleared;
  });
}

// Los que aun no estan llenos, empezando por los que menos llevas: el
// equivalente de cartasQueFaltan(). Es lo que queda para el 100%.
export function kommApartadosQueFaltan(lektionId, kommunikationArray) {
  const p = load();
  const kp = p.kommPracticed || {};
  return (kommunikationArray || [])
    .map((k) => ({ k, n: aciertosDe(kp[`${lektionId}:${k.funktion}`]) }))
    .filter(({ n }) => n < ACIERTOS_POR_APARTADO)
    .sort((a, b) => a.n - b.n)
    .map(({ k }) => k);
}

// Aciertos que quedan dentro de los apartados seleccionados de Kommunikation.
export function kommPuntosQueFaltan(lektionId, apartados) {
  const kp = load().kommPracticed || {};
  return (apartados || []).reduce((total, apartado) => {
    const hechos = Math.min(ACIERTOS_POR_APARTADO, aciertosDe(kp[`${lektionId}:${apartado.funktion}`]));
    return total + Math.max(0, ACIERTOS_POR_APARTADO - hechos);
  }, 0);
}

export function resetProgress() {
  storage.set(KEYS.progress, DEFAULT);
}

// Progreso que ya no corresponde a nada del libro.
//
// Como la clave de un apartado es su nombre alemán, renombrarlo deja lo que
// llevabas hecho colgando de una clave muerta: la barra baja sola y no hay
// forma de enterarse. Esto lo enseña. Lo que salga aquí no se borra: se mira,
// se decide a qué apartado nuevo corresponde y se añade a RENOMBRADAS, que es
// lo que de verdad recupera el trabajo.
// Recibe los identificadores que existen AHORA. No se sacan aquí de kursbuch
// para no atar el almacén de progreso al contenido: quien llama ya los tiene.
export function progresoHuerfano({ apartadosVivos, conceptosVivos } = {}) {
  const p = load();
  const apartados = apartadosVivos
    ? Object.keys(p.kommPracticed || {}).filter((c) => !apartadosVivos.has(c))
    : [];
  // Los conceptos de gramática tienen el mismo problema: su clave sale del
  // texto de la regla cuando la regla no trae `key` propia, así que retocar el
  // enunciado la cambia. Pero aquí sólo se avisa de los del libro: los temas
  // por temática generan conceptos que no están en ninguna lista.
  const conceptos = conceptosVivos
    ? Object.keys(p.concepts || {}).filter((c) => /^a\d\d-/.test(c) && !conceptosVivos.has(c))
    : [];
  return { apartados, conceptos };
}
