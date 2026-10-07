// Juego de traducir frases: alemán → español y al revés.
//
// Las frases salen del propio libro: las expresiones de Kommunikation y los
// ejemplos de las reglas de Gramática. Así traduces lo que estás dando, no
// frases sueltas de ninguna parte.

import { KURSBUCH, getLektion, ruleConceptId, allBookDecks } from './kursbuch/index.js';
import { storage } from './storage.js';
import { GENDER_NIVELES } from './vocab.js';
import { tc } from './contenido/index.js';
import { pick } from './i18n.js';

const KEY = 'uebersetzen:progreso';
const ULTIMAS = 'uebersetzen:ultimas';

// Ni tan cortas que sean una palabra ni tan largas que sean un párrafo.
const MIN_PALABRAS = 3;
const MAX_PALABRAS = 12;
const TOTAL_GLOBAL = 1000;

function util(de, es) {
  const d = String(de || '').trim();
  const e = String(es || '').trim();
  const n = d.split(/\s+/).length;
  // Fuera las que traen alternativas ("Guten Tag! / Guten Abend!") o huecos
  // para rellenar: no son una frase que se pueda traducir y corregir.
  const alternativas = /[/·•]|\.\.\./;
  if (alternativas.test(d) || alternativas.test(e) || d.includes('_') || d.includes('…')) return false;
  // Fuera las formulas de gramatica ("der Apfel + der Saft = der Apfelsaft"):
  // no son una frase que se pueda traducir.
  if (/[+=]|→|->/.test(d) || /[+=]|→|->/.test(e)) return false;
  // Y las que no llevan ni un verbo aparente ni signos de frase: listas sueltas.
  if (!/[.!?]$/.test(d) && d.split(/\s+/).length < 4) return false;
  return !!d && !!e && n >= MIN_PALABRAS && n <= MAX_PALABRAS;
}

// Todas las frases del libro, con de dónde salen.
export function frases({ lektionId = null } = {}) {
  const out = [];
  const vistas = new Set();
  const lecciones = lektionId
    ? [getLektion(lektionId)].filter(Boolean)
    : KURSBUCH.lektionen;

  for (const l of lecciones) {
    // expresiones de Kommunikation
    for (const k of l.kommunikation || []) {
      for (const w of k.wendungen || []) {
        if (!util(w.de, w.es) || vistas.has(w.de)) continue;
        vistas.add(w.de);
        // El rótulo de dónde sale la frase va en el idioma de la interfaz. Con
        // el `funktion` alemán ("nach dem Weg fragen…") parecía una segunda
        // frase en alemán justo encima de la que hay que traducir.
        out.push({
          de: w.de.trim(), es: w.es.trim(),
          de_donde: k.es || k.funktion,
          lektion: l.name, band: l.bandName
        });
      }
    }
    // ejemplos de las reglas
    for (const g of l.grammatik || []) {
      for (const b of g.beispiele || []) {
        if (!util(b.de, b.es) || vistas.has(b.de)) continue;
        vistas.add(b.de);
        // conceptId: el mismo identificador que usa Gramática. Sin él, acertar
        // aquí no movía el porcentaje de ninguna regla — el juego apuntaba solo
        // en su propio almacén y el tema no se enteraba.
        out.push({
          de: b.de.trim(), es: b.es.trim(), de_donde: g.regel,
          lektion: l.name, band: l.bandName,
          conceptId: ruleConceptId(l, g)
        });
      }
    }
  }

  // El ejercicio global llega a 1000 con ejemplos breves y cotidianos de los
  // mazos A1.1 del propio libro. Conservan sus glosas, así que se traducen al
  // inglés con la misma tabla de contenido que el resto del material.
  if (!lektionId && out.length < TOTAL_GLOBAL) {
    for (const deck of allBookDecks()) {
      if (deck.bandName !== 'A1.1') continue;
      for (const card of deck.cards || []) {
        const de = String(card.ex || '').trim();
        const es = String(card.exEs || '').trim();
        if (!util(de, es) || vistas.has(de)) continue;
        vistas.add(de);
        out.push({ de, es, band: deck.bandName });
        if (out.length >= TOTAL_GLOBAL) break;
      }
      if (out.length >= TOTAL_GLOBAL) break;
    }
  }

  // Exactamente 1000 ejercicios en el juego global, podando las frases más
  // repetitivas (mismos prefijos repetidos en exceso o de 3 palabras).
  if (!lektionId && out.length > TOTAL_GLOBAL) {
    const prefCounts = {};
    out.forEach((x) => {
      const p = x.de.split(/\s+/).slice(0, 2).join(' ').toLowerCase();
      prefCounts[p] = (prefCounts[p] || 0) + 1;
    });
    const scored = out.map((x, idx) => {
      const words = x.de.split(/\s+/).length;
      const p = x.de.split(/\s+/).slice(0, 2).join(' ').toLowerCase();
      let penalty = 0;
      if (words <= 3) penalty += 5;
      if (prefCounts[p] > 8) penalty += prefCounts[p] - 8;
      return { x, idx, penalty };
    });
    scored.sort((a, b) => a.penalty - b.penalty || a.idx - b.idx);
    return scored.slice(0, TOTAL_GLOBAL).sort((a, b) => a.idx - b.idx).map((s) => s.x);
  }

  return out;
}

function progreso() {
  return storage.get(KEY, {});
}

// Igual que el vocabulario: lo que fallas vuelve antes.
const INTERVALOS = [0, 6e4, 6e5, 36e5, 864e5, 3 * 864e5, 7 * 864e5];

export function apuntar(id, acierto) {
  storage.update(KEY, {}, (p) => {
    const c = { bien: 0, mal: 0, fuerza: 0, toca: 0, ...(p[id] || {}) };
    if (acierto) {
      c.bien += 1;
      c.fuerza = Math.min(6, c.fuerza + 1);
    } else {
      c.mal += 1;
      c.fuerza = Math.max(0, c.fuerza - 1);
    }
    c.toca = Date.now() + INTERVALOS[Math.min(c.fuerza, INTERVALOS.length - 1)];
    p[id] = c;
    return p;
  });
}

export function estadisticas({ lektionId = null, nivel = 'all' } = {}) {
  let pool = frases({ lektionId });
  if (nivel !== 'all') {
    const def = GENDER_NIVELES.find(n => n.id === nivel);
    if (def && def.bands) {
      pool = pool.filter(f => def.bands.includes(f.band));
    }
  }
  const p = progreso();
  let sabidas = 0;
  let empezadas = 0;
  pool.forEach((f) => {
    // Dominada es fuerza 2; empezada es haberla visto aunque se falle.
    if (p[f.de]) empezadas += 1;
    if (p[f.de]?.fuerza >= 2) sabidas += 1;
  });
  return {
    total: pool.length,
    sabidas,
    empezadas,
    pct: Math.round((sabidas / Math.max(1, pool.length)) * 100)
  };
}

function barajar(a) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

// Elige las frases de una ronda: primero las que tocan repasar, luego las
// nuevas, y evita repetir las de la tanda anterior si hay material de sobra.
export function elegirFrases(cuantas = 10, { lektionId = null, direccion = 'mix', nivel = 'all' } = {}) {
  let pool = frases({ lektionId });
  if (nivel !== 'all') {
    const def = GENDER_NIVELES.find(n => n.id === nivel);
    if (def && def.bands) {
      pool = pool.filter(f => def.bands.includes(f.band));
    }
  }
  if (!pool.length) return [];
  const p = progreso();
  const ahora = Date.now();
  const ultimas = new Set(storage.get(ULTIMAS, []));

  const tocan = [];
  const nuevas = [];
  const resto = [];
  for (const f of pool) {
    const c = p[f.de];
    if (!c || c.bien + c.mal === 0) nuevas.push(f);
    else if (c.toca <= ahora) tocan.push({ f, retraso: ahora - c.toca });
    else resto.push(f);
  }
  tocan.sort((a, b) => b.retraso - a.retraso);

  const evitar = (arr) => {
    const limpio = arr.filter((f) => !ultimas.has(f.de));
    return limpio.length >= cuantas ? limpio : arr;
  };

  const out = [];
  const meter = (arr) => {
    for (const f of arr) {
      if (out.length >= cuantas) break;
      if (!out.some((x) => x.de === f.de)) out.push(f);
    }
  };
  meter(tocan.map((x) => x.f));
  meter(barajar(evitar(nuevas)));
  meter(barajar(evitar(resto)));
  meter(barajar(pool));

  const elegidas = out.slice(0, Math.min(cuantas, pool.length));
  storage.set(ULTIMAS, elegidas.map((f) => f.de));

  // La dirección se decide por frase, para que la ronda vaya alternando.
  return elegidas.map((f, i) => ({
    ...f,
    dir: direccion === 'mix' ? (i % 2 === 0 ? 'de-es' : 'es-de') : direccion
  }));
}

// ---------- corrección ----------
// Comparación indulgente: ni las mayúsculas, ni los acentos, ni la puntuación
// ni los espacios de más cuentan como fallo. Lo que se practica es la frase.
export function normalizar(s) {
  return String(s || '')
    .replace(/[\u200B-\u200D\uFEFF]/g, '') // caracteres de ancho cero que pueden colarse al pegar
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '') // las tildes que NFD deja sueltas
    .replace(/ß/g, 'ss')
    .replace(/[²³]/g, (n) => n === '²' ? '2' : '3') // aceptar m2 como equivalente a m²
    .replace(/\p{P}/gu, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function similitud(s1, s2) {
  if (s1 === s2) return 1;
  if (!s1 || !s2) return 0;
  const l1 = s1.length;
  const l2 = s2.length;
  const maxL = Math.max(l1, l2);
  if (maxL === 0) return 1;

  let prev = new Array(l2 + 1);
  let curr = new Array(l2 + 1);
  for (let j = 0; j <= l2; j++) prev[j] = j;

  for (let i = 1; i <= l1; i++) {
    curr[0] = i;
    for (let j = 1; j <= l2; j++) {
      const cost = s1[i - 1] === s2[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j] + 1,
        curr[j - 1] + 1,
        prev[j - 1] + cost
      );
    }
    const temp = prev;
    prev = curr;
    curr = temp;
  }
  const dist = prev[l2];
  return (maxL - dist) / maxL;
}

// Las diferencias de formato (mayúsculas, tildes y puntuación) ya se quitan en
// normalizar. También aceptamos una errata de una sola letra; las respuestas
// que superen el 50% de similitud se muestran como "casi" (amarillo).
export function corregir(tuya, buena) {
  const a = normalizar(tuya);
  const b = normalizar(buena);
  if (!a) return { estado: 'vacio', distintas: [] };
  if (a === b) return { estado: 'bien', distintas: [] };

  const pa = a.split(' ').filter(Boolean);
  const pb = b.split(' ').filter(Boolean);

  const simCadena = similitud(a, b);
  const longitudMax = Math.max(a.length, b.length);
  const distanciaCaracteres = Math.round((1 - simCadena) * longitudMax);

  let matches = 0;
  const pool = [...pb];
  for (const w of pa) {
    const idx = pool.indexOf(w);
    if (idx !== -1) {
      matches += 1;
      pool.splice(idx, 1);
    }
  }
  const simPalabras = pb.length > 0 ? matches / Math.max(pa.length, pb.length) : 0;

  // Una sola letra mal escrita no convierte una frase que se sabe en un fallo.
  if (distanciaCaracteres <= 1 || simCadena >= 0.90 || (pb.length >= 4 && simPalabras >= 0.90)) {
    return { estado: 'bien', distintas: [] };
  }

  const faltan = pb.filter((w) => !pa.includes(w));
  const sobran = pa.filter((w) => !pb.includes(w));

  if (faltan.length === 0 && sobran.length === 0) {
    // mismas palabras, otro orden
    return { estado: 'orden', distintas: [] };
  }
  if (simCadena > 0.5 || simPalabras > 0.5) {
    return { estado: 'casi', distintas: faltan };
  }
  return { estado: 'mal', distintas: faltan };
}

function shuffleDeterminista(arr, semilla) {
  let h = 0;
  for (let i = 0; i < semilla.length; i++) {
    h = (Math.imul(31, h) + semilla.charCodeAt(i)) | 0;
  }
  const res = [...arr];
  for (let k = res.length - 1; k > 0; k--) {
    h = (Math.imul(h ^ (h >>> 16), 0x45d9f3b) + 1013904223) | 0;
    const j = Math.abs(h) % (k + 1);
    [res[k], res[j]] = [res[j], res[k]];
  }
  return res;
}

// ---------- pistas ----------
// Las pistas se dan en posiciones aleatorias de la frase en lugar de siempre
// en orden secuencial (primera palabra, primera mitad). Revela palabras
// repartidas de forma determinista para la frase.
export function pistas(frase, buenaCustom) {
  const buena = buenaCustom || (frase.dir === 'de-es' ? tc(frase.es) : frase.de);
  const palabras = buena.split(/\s+/).filter(Boolean);
  if (!palabras.length) return [];

  if (palabras.length === 1) {
    const w = palabras[0];
    return [
      { tipo: 'pista1', texto: `${w.length} ${pick('letras', 'letters')}` },
      { tipo: 'pista2', texto: `${w.charAt(0)}···` },
      { tipo: 'pista3', texto: `${w.charAt(0)}${w.slice(1, -1).replace(/./g, '·')}${w.slice(-1)}` }
    ];
  }

  // Barajar índices de palabras determinísticamente para esta frase
  const indices = palabras.map((_, i) => i);
  const shuffled = shuffleDeterminista(indices, buena);

  // Pista 1: 1 palabra en posición aleatoria + longitud
  const rev1 = new Set([shuffled[0]]);
  const texto1 = `${palabras.map((w, i) => (rev1.has(i) ? w : '···')).join(' ')} (${palabras.length} ${pick('palabras', 'words')})`;

  // Pista 2: 2 palabras (o ~40%) en posiciones aleatorias
  const count2 = Math.min(palabras.length - 1, Math.max(2, Math.round(palabras.length * 0.4)));
  const rev2 = new Set(shuffled.slice(0, count2));
  const texto2 = palabras.map((w, i) => (rev2.has(i) ? w : '···')).join(' ');

  // Pista 3: mayoría de palabras (~75%) en posiciones aleatorias
  const count3 = Math.min(palabras.length - 1, Math.max(count2 + 1, Math.round(palabras.length * 0.75)));
  const rev3 = new Set(shuffled.slice(0, count3));
  const texto3 = palabras.map((w, i) => (rev3.has(i) ? w : '···')).join(' ');

  return [
    { tipo: 'pista1', texto: texto1 },
    { tipo: 'pista2', texto: texto2 },
    { tipo: 'pista3', texto: texto3 }
  ];
}

export function xpDe(estado, pistasUsadas) {
  if (estado === 'bien') return Math.max(3, 10 - pistasUsadas * 2);
  if (estado === 'casi' || estado === 'orden') return Math.max(2, 6 - pistasUsadas * 2);
  return 2;
}
