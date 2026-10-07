// Qué tipos de pregunta admite una frase de Kommunikation.
//
// Esto vivía dentro de KommPractice.jsx, y los scripts que cuentan ejercicios
// no podían importarlo -es un componente, con JSX-, así que cada uno repetía
// las condiciones a su manera. Acabaron desincronizados: smoke-komm miraba
// cuatro tipos con otros nombres y cuantos-ejercicios daba por hecho que todas
// las frases valían para todo, cuando "Ordenar" pide entre tres y doce
// palabras y "La palabra que falta" pide una palabra tapable.
//
// Aquí está una sola vez, en un módulo sin JSX que puede cargar tanto el
// componente como node.

const SIGNOS = /[.,!?¿¡"„“]/g;
const PALABRAS_FUNCION = new Set(['der', 'die', 'das', 'den', 'dem', 'ein', 'eine', 'und', 'ist', 'ich', 'du', 'sie']);
const NUMEROS = new Set([
  'null', 'eins', 'zwei', 'drei', 'vier', 'fünf', 'sechs', 'sieben', 'acht', 'neun', 'zehn',
  'elf', 'zwölf', 'dreizehn', 'vierzehn', 'fünfzehn', 'sechzehn', 'siebzehn', 'achtzehn', 'neunzehn',
  'zwanzig', 'dreißig', 'vierzig', 'fünfzig', 'sechzig', 'siebzig', 'achtzig', 'neunzig', 'hundert', 'tausend'
]);

// Los seis tipos, en el orden en que salen los botones.
export const TIPOS = ['decir', 'contestar', 'entender', 'hueco', 'significado', 'ordenar'];

// El rótulo de cada uno, para las tablas y las pantallas de resumen.
export const NOMBRE_TIPO = {
  decir: ['Elegir la frase', 'Pick the phrase'],
  contestar: ['Contestar', 'Reply'],
  entender: ['Entender la respuesta', 'Understand the reply'],
  hueco: ['La palabra que falta', 'The missing word'],
  significado: ['¿Qué significa?', 'What does it mean?'],
  ordenar: ['Ordenar', 'Word order']
};

export function palabraHuecoValida(palabra) {
  const limpia = String(palabra || '').replace(SIGNOS, '').trim();
  const minuscula = limpia.toLowerCase();
  return limpia.length >= 4 &&
    !/\p{Lu}/u.test(limpia) &&
    !/\d/.test(limpia) &&
    /^\p{L}+$/u.test(limpia) &&
    !PALABRAS_FUNCION.has(minuscula) &&
    !NUMEROS.has(minuscula);
}

// La palabra que se tapa debe poder deducirse de la frase. Los sustantivos
// alemanes y los nombres propios empiezan en mayúscula; en concreto, no
// escondemos personas, lugares, fechas ni cifras, que dependen de memorizar un
// dato y no de entender el idioma. Si no queda una palabra adecuada, se usa
// otro tipo de ejercicio.
//
// `salto` es para cuando la misma frase vuelve a caer en la tanda: en vez de
// taparle otra vez la misma palabra, se tapa la siguiente en tamaño.
export function palabraTapable(palabras, salto = 0) {
  const limpias = palabras.map((x) => x.replace(SIGNOS, '').toLowerCase());
  const candidatas = [];
  for (let k = 1; k < palabras.length; k++) {
    const limpia = palabras[k].replace(SIGNOS, '');
    const minuscula = limpia.toLowerCase();
    if (!palabraHuecoValida(limpia)) continue;
    // Tampoco vale una palabra que se repite en la propia frase: en
    // "Passt dir 18 Uhr? – Ja, das ___." la tienes escrita dos líneas más
    // arriba y el hueco se rellena solo.
    if (limpias.filter((x) => x === minuscula).length > 1) continue;
    candidatas.push({ k, largo: limpia.length });
  }
  if (!candidatas.length) return null;
  candidatas.sort((a, b) => b.largo - a.largo);
  return candidatas[salto % candidatas.length].k;
}

// Qué tipos se pueden montar con `w` dentro de una lección cuyas frases son
// `todas`. Las mismas condiciones que usa montadores() al fabricar la
// pregunta: los tres de elegir necesitan al menos dos despistes, o el test se
// resuelve por descarte.
//
// `resp` es la función respuestaDe; se pasa para no atar este módulo a
// respuestas.js y poder probarlo con datos de mentira.
export function tiposPosibles(w, todas, resp) {
  const palabras = String(w.de).trim().split(/\s+/);
  const ajenas = todas.filter((x) => x.de !== w.de);
  const glosas = todas.map((x) => x.es);
  const r = resp(w.de);
  const otrasRespuestas = ajenas.map((x) => resp(x.de)?.de).filter(Boolean);

  return {
    decir: ajenas.length >= 2,
    ordenar: palabras.length >= 3 && palabras.length <= 12,
    contestar: !!r && otrasRespuestas.filter((x) => x !== r.de).length >= 2,
    entender: !!r && ajenas.length >= 2,
    hueco: palabraTapable(palabras) !== null,
    significado: glosas.filter((x) => x && x !== w.es).length >= 2
  };
}
