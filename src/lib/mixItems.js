// Rondas de vocabulario para intercalarlas en la práctica mixta.

import { allDecks, allNouns } from './vocab.js';
import { pick } from './i18n.js';
import { tc } from './contenido/index.js';

function mezclar(a) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

function distintos(pool, correcta, campo, n) {
  const out = [];
  const normal = (s) => String(s || '').toLocaleLowerCase().replace(/[.,!?¿¡"„“]/g, '').replace(/\s+/g, ' ').trim();
  const vistos = new Set([normal(correcta)]);
  for (const c of mezclar(pool)) {
    const v = String(c[campo] || '').trim();
    const clave = normal(v);
    if (!v || vistos.has(clave)) continue;
    vistos.add(clave);
    out.push(v);
    if (out.length >= n) break;
  }
  return out;
}

import { getLektion, lektionWordList } from './kursbuch/index.js';

// Todas las palabras (del cuaderno de usuario + de la lección actual)
function tarjetas(lektionId, cardsOverride = null) {
  const userCards = (cardsOverride || allDecks().flatMap((d) => d.cards))
    .map((c) => ({ de: String(c.de || '').trim(), es: tc(String(c.es || '').trim()) }));
    
  let lektionCards = [];
  if (lektionId && !cardsOverride) {
    const l = getLektion(lektionId);
    if (l) {
      lektionCards = lektionWordList(l).map(c => ({ de: String(c.de || '').trim(), es: tc(String(c.es || '').trim()) }));
    }
  }

  // Combinar por palabra alemana. Si una forma aparece con varias glosas en
  // lecciones distintas, conservarlas juntas evita elegir una traducción al
  // azar y marcar como mala otra acepción válida.
  const combined = [...userCards, ...lektionCards].filter((c) => c.de && c.es);
  const unique = [];
  const seen = new Map();
  for (const c of combined) {
    const key = c.de.toLocaleLowerCase();
    const existing = seen.get(key);
    if (!existing) {
      const item = { ...c, _mixGlosses: [c.es] };
      seen.set(key, item);
      unique.push(item);
      continue;
    }
    const norm = (s) => String(s).toLocaleLowerCase().replace(/[.,!?¿¡"„“]/g, '').replace(/\s+/g, ' ').trim();
    if (!existing._mixGlosses.some((es) => norm(es) === norm(c.es))) existing._mixGlosses.push(c.es);
  }
  return unique.map(({ _mixGlosses, ...c }) => ({ ...c, es: _mixGlosses.join(' / ') }));
}

function itemGenero(n, i) {
  const opciones = mezclar(['der', 'die', 'das']);
  return {
    id: `mix-gen-${i}-${n.noun}`,
    type: 'mc',
    conceptId: 'vocab:artikel',
    prompt: pick('¿Qué artículo lleva?', 'Which article does it take?'),
    sentence: `___ ${n.noun}`,
    options: opciones,
    answer: n.article,
    translation: n.es,
    vocabCardDe: n.cardDe,
    explanation: pick(
      `Es «${n.article} ${n.noun}» — ${n.es}.`,
      `It is "${n.article} ${n.noun}" — ${n.es}.`
    )
  };
}

function itemSentido(c, pool, i) {
  const de = terminoVocabulario(c?.de);
  if (!de || /[,;]/.test(String(c.es || ''))) return null;
  const claras = pool.filter((x) => terminoVocabulario(x.de) && !/[,;]/.test(String(x.es || '')));
  const malas = distintos(claras, c.es, 'es', 2);
  if (malas.length < 2) return null;
  return {
    id: `mix-sen-${i}`,
    type: 'mc',
    conceptId: 'vocab:bedeutung',
    prompt: pick('¿Qué significa?', 'What does it mean?'),
    sentence: de,
    options: mezclar([c.es, ...malas]),
    answer: c.es,
    translation: c.es,
    vocabCardDe: c.de,
    explanation: `${de} — ${c.es}`
  };
}

function terminoVocabulario(de) {
  let forma = String(de || '').trim();
  // Las fichas usan a veces la notación de plural "der Apfel, ¨-".
  const plural = forma.match(/,\s*(?:¨-|-)(?:n|en|e|er|s|se)?$/i);
  if (plural) forma = forma.slice(0, plural.index).trim();
  else if (forma.endsWith(',')) forma = forma.slice(0, -1).trim();
  else if (forma.includes(',')) return null;
  return forma || null;
}

// Las fichas usan a veces la notación de diccionario "der Apfel, ¨-" para
// enseñar el plural. En un ejercicio de escribir solo se pide la forma base;
// las listas separadas por comas y las notas entre paréntesis no son una
// respuesta única y no deben convertirse en una pregunta imposible.
function respuestaEscribible(de) {
  const forma = terminoVocabulario(de);
  if (!forma || /[()=]/.test(forma)) return null;
  return forma;
}

function itemComoSeDice(c, pool, i) {
  const answer = respuestaEscribible(c?.de);
  if (!answer) return null;
  return {
    id: `mix-dic-${i}`,
    type: 'write',
    conceptId: 'vocab:ausdruck',
    anweisung: pick('Traduce al alemán', 'Translate into German'),
    sentence: c.es,
    answer,
    translation: answer,
    vocabCardDe: c.de,
    explanation: `${c.es} — ${answer}`
  };
}

// Wortsalat se limita a una sola palabra y admite la misma longitud que el
// juego dedicado.
function itemWortsalat(c, i) {
  // No tomar solo la primera palabra de una expresión: con "sich ausruhen"
  // eso convertía la traducción "to rest" en un anagrama de "sich". Los
  // nombres con artículo sí se reducen a su palabra léxica ("der Zug" → Zug).
  const limpia = c.de.replace(/^(der|die|das)\s+/i, '').trim();
  if (limpia.length < 4 || limpia.length > 14 || !/^[A-Za-zÄÖÜäöüß-]+$/.test(limpia)) return null;
  const letras = limpia.split('');
  let revueltas = mezclar(letras);
  let intentos = 0;
  while (revueltas.join('') === limpia && intentos < 12) {
    revueltas = mezclar(letras);
    intentos++;
  }
  if (revueltas.length > 1 && revueltas.join('') === limpia) {
    [revueltas[0], revueltas[1]] = [revueltas[1], revueltas[0]];
  }
  return {
    id: `mix-wortsalat-${i}`,
    type: 'wortsalat',
    conceptId: 'vocab:wortsalat',
    prompt: pick(`Ordena las letras: «${c.es}»`, `Put the letters in order: "${c.es}"`),
    tokens: revueltas,
    solution: letras,
    sentence: limpia,
    vocabCardDe: c.de,
    translation: c.es,
    explanation: `${c.de} — ${c.es}`
  };
}

function itemEmparejar(pool) {
  const unicas = [];
  const vistosDe = new Set();
  const vistosEs = new Set();
  const normal = (s) => String(s || '').toLocaleLowerCase().replace(/[.,!?¿¡"„“]/g, '').replace(/\s+/g, ' ').trim();
  for (const c of mezclar(pool)) {
    const de = normal(c.de);
    const es = normal(c.es);
    if (!de || !es || vistosDe.has(de) || vistosEs.has(es)) continue;
    vistosDe.add(de);
    vistosEs.add(es);
    unicas.push(c);
    if (unicas.length === 6) break;
  }
  if (unicas.length < 6) return null;
  return {
    id: 'mix-match-vocab',
    type: 'match',
    conceptId: 'vocab:match',
    pairs: unicas,
    vocabCardDes: unicas.map((c) => c.de),
    sentence: pick('Empareja las seis palabras', 'Match the six words'),
    answer: pick('6 parejas', '6 pairs'),
    translation: pick('Vocabulario alemán y español', 'German and Spanish vocabulary')
  };
}

function itemAhorcado(pool) {
  const candidatas = pool.filter((c) => {
    const palabra = String(c.de).replace(/^(der|die|das)\s+/i, '').trim();
    return /^[A-Za-zÄÖÜäöüß-]{4,14}$/.test(palabra);
  });
  if (!candidatas.length) return null;
  const c = candidatas[Math.floor(Math.random() * candidatas.length)];
  const respuesta = c.de.replace(/^(der|die|das)\s+/i, '').trim();
  return {
    id: 'mix-hangman-' + respuesta,
    type: 'hangman',
    conceptId: 'vocab:hangman',
    sentence: respuesta,
    answer: respuesta,
    vocabCardDe: c.de,
    translation: c.es,
    explanation: c.de
  };
}

// n rondas de vocabulario variadas. Si no hay material suficiente, devuelve
// las que haya podido montar (o ninguna) en vez de fallar.
export function vocabMixItems(n = 4, lektionId = null, cardsOverride = null, difficultyIds = []) {
  const pool = tarjetas(lektionId, cardsOverride);
  if (pool.length < 4) return [];
  const nouns = allNouns(cardsOverride);
  const elegidas = mezclar(pool).slice(0, n * 3);
  const out = [];
  const palabraWortsalat = n >= 5
    ? mezclar(pool).map((c) => itemWortsalat(c, 'todo')).find(Boolean)
    : null;
  const especiales = n >= 4
    ? [itemEmparejar(pool), itemAhorcado(pool), palabraWortsalat || mezclar(pool).map((c) => itemWortsalat(c, 'todo')).find(Boolean)].filter(Boolean)
    : [];
  let i = 0;

  const nNormales = n - especiales.length;
  // Reservar el artículo explícitamente: así Der/die/das no depende de que
  // la tanda tenga espacio después de Match, Ahorcado y Wortsalat.
  const articulo = nNormales > 0 && nouns.length
    ? itemGenero(mezclar(nouns)[0], i++)
    : null;
  if (articulo) out.push(articulo);

  const constructores = difficultyIds.includes('easy') && !difficultyIds.includes('hard')
    ? [
        () => itemSentido(elegidas[i % elegidas.length], pool, i),
        () => itemWortsalat(elegidas[(i + 2) % elegidas.length], i)
      ]
    : [
        () => itemComoSeDice(elegidas[(i + 1) % elegidas.length], pool, i),
        () => itemSentido(elegidas[i % elegidas.length], pool, i),
        () => itemWortsalat(elegidas[(i + 2) % elegidas.length], i)
      ];

  // Tras reservar Der/die/das, alternar traducción, significado y Wortsalat.
  for (let intento = 0; out.length < nNormales && intento < n * 8; intento++) {
    const it = constructores[intento % constructores.length]();
    i++;
    if (it && !out.some((x) => x.id === it.id)) out.push(it);
  }
  return mezclar([...out, ...especiales]);
}

// Intercala las rondas de vocabulario entre las de gramática, repartidas, no
// todas seguidas al final.
export function intercalar(gramatica, vocab) {
  if (!vocab.length) return gramatica;
  const total = gramatica.length + vocab.length;
  const paso = total / vocab.length;
  const out = [];
  let g = 0;
  let v = 0;
  for (let k = 0; k < total; k++) {
    // la ronda v de vocabulario cae en el centro de su reparto
    const tocaVocab = v < vocab.length && k >= Math.floor(v * paso + paso / 2);
    if (tocaVocab) out.push(vocab[v++]);
    else if (g < gramatica.length) out.push(gramatica[g++]);
    else out.push(vocab[v++]);
  }
  return out;
}
