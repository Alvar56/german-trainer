// Traduccion del CONTENIDO: el texto del libro, la teoria de gramatica, el
// vocabulario y los enunciados de los ejercicios.
//
// Es una capa aparte de src/lib/i18n.js a proposito. Aquella traduce la
// INTERFAZ (botones, titulos, avisos) con claves escritas a mano. Esta traduce
// el material de estudio, que son miles de cadenas y se completa poco a poco.
//
// La clave es el propio castellano. No hay que inventar ids ni tocar los
// campos del contenido, y si un dia cambias el castellano la traduccion vieja
// deja de aplicarse sola: ese texto hay que volver a traducirlo.
//
// Para anadir un idioma: crea `<codigo>.js` con el mismo formato que en.js,
// importalo aqui y metelo en IDIOMAS. Nada mas.
import { getLang, onLangChange } from '../i18n.js';

const IDIOMAS = {};
const oyentesListo = new Set();
let cargaEN = null;
let origenesEN = null;
let traduccionesEN = null;

function cargarIdiomaActivo() {
  if (getLang() !== 'en' || IDIOMAS.en || cargaEN) return;
  cargaEN = import('./en.js').then(({ EN }) => {
    IDIOMAS.en = EN;
    const origenes = new Map();
    const ambiguas = new Set();
    const traducciones = new Set();
    for (const [original, traducido] of Object.entries(EN)) {
      if (typeof traducido !== 'string' || !traducido || traducido === original) continue;
      traducciones.add(traducido);
      if (origenes.has(traducido) && origenes.get(traducido) !== original) {
        ambiguas.add(traducido);
      } else {
        origenes.set(traducido, original);
      }
    }
    ambiguas.forEach((texto) => origenes.delete(texto));
    origenesEN = origenes;
    traduccionesEN = traducciones;
    oyentesListo.forEach((fn) => fn());
  }).catch(() => {
    // El original en castellano sigue disponible si falla la descarga.
    cargaEN = null;
  });
}

onLangChange(cargarIdiomaActivo);
cargarIdiomaActivo();

export function onContenidoIdiomaListo(fn) {
  oyentesListo.add(fn);
  return () => oyentesListo.delete(fn);
}

// Traduce un texto del contenido. Si no hay traduccion, devuelve el original:
// mas vale leerlo en castellano que ver un hueco o una clave suelta.
export function tc(texto) {
  if (texto == null) return texto;
  cargarIdiomaActivo();
  const dic = IDIOMAS[getLang()];
  if (!dic) return texto;
  const out = getLang() === 'en'
    ? (traduccionesEN?.has(texto) ? texto : dic[texto] ?? texto)
    : (Object.prototype.hasOwnProperty.call(dic, texto) ? texto : origenesEN?.get(texto) ?? texto);
  if (observador) observador(texto, out);
  return out;
}

// Enganche para las herramientas (scripts/extraer-textos.mjs): avisa de cada
// texto que se pide traducir y de lo que se devuelve. Sirve para saber que le
// falta al diccionario SIN tener que adivinarlo leyendo los ficheros, y va
// aqui porque es el unico sitio por el que pasa todo el contenido.
//
// En la app nadie lo llama, asi que el coste es una comparacion con null.
let observador = null;

export function observarTc(fn) {
  observador = fn;
  return () => { observador = null; };
}

// Traduce los campos indicados de un objeto y devuelve una copia. Para no
// repetir el mismo `{ ...x, es: tc(x.es) }` en cada sitio.
export function tcCampos(obj, campos) {
  if (!obj) return obj;
  const out = { ...obj };
  for (const c of campos) if (typeof out[c] === 'string') out[c] = tc(out[c]);
  return out;
}

// ---- piezas de teoria ----
// Las usan igual el libro (lib/kursbuch) y los temas de gramatica (src/topics),
// asi que viven aqui y no duplicadas en los dos sitios.

export function tcLista(xs) {
  return (xs || []).map((x) => (typeof x === 'string' ? tc(x) : x));
}

// Las celdas de una tabla son casi todas aleman (ich / war / hatte) y alguna
// cabecera en castellano ("Persona"). Pasan todas por tc(): las alemanas
// vuelven tal cual porque no estan en el diccionario.
export function tcTabla(tabla) {
  if (!tabla) return tabla;
  return {
    ...tabla,
    title: tc(tabla.title),
    headers: tcLista(tabla.headers),
    rows: (tabla.rows || []).map(tcLista)
  };
}

// En los ejemplos el aleman se queda; lo que se traduce es la glosa.
export function tcEjemplos(xs) {
  return (xs || []).map((e) => ({ ...e, es: tc(e.es) }));
}

export function tcMas(mas) {
  if (!mas) return mas;
  return { ...mas, title: tc(mas.title), examples: tcEjemplos(mas.examples), tips: tcLista(mas.tips) };
}

// Cuanto llevamos traducido, para el aviso de la pantalla de ajustes.
export function avanceIdioma(lang = getLang()) {
  const dic = IDIOMAS[lang];
  if (!dic) return null;
  return Object.keys(dic).length;
}

export function idiomaTieneContenido(lang = getLang()) {
  return !!IDIOMAS[lang];
}
