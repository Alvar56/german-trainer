// Monedas: lo que ganas ejercicio a ejercicio y con lo que compras las cosas
// del zorro.
//
// Se cobra por ejercicio, no por sesión: así se nota al momento y no hay que
// terminar una tanda entera para ver algo.

import { storage } from './storage.js';
import { playAudio } from './audio.js';
import { currentStreak } from './rachas.js';

const KEY = 'monedas';

// Quien quiera enterarse de que ha cambiado el saldo se apunta aqui. Lo usa
// el monedero de arriba a la derecha para animarse solo cuando toca.
const oyentes = new Set();

export function suscribir(fn) {
  oyentes.add(fn);
  return () => oyentes.delete(fn);
}

function avisar(cuanto, total) {
  for (const fn of oyentes) {
    try {
      fn({ cuanto, saldo: total });
    } catch {
      /* que un oyente roto no corte a los demas */
    }
  }
}

export function saldo() {
  const v = storage.get(KEY, 0);
  return Number.isFinite(Number(v)) ? Math.max(0, Math.round(Number(v))) : 0;
}

export function ganar(n) {
  const cuanto = Math.max(0, Math.round(Number(n) || 0));
  if (!cuanto) return saldo();
  const next = saldo() + cuanto;
  storage.set(KEY, next);
  avisar(cuanto, next);
  return next;
}

// Bono único al terminar una tanda mientras la racha actual sigue en 10 o
// más. Se aplica al cerrar la sesión (no al pulsar Check) y se devuelve por
// separado para que el resumen pueda mostrarlo sin mezclarlo con lo cobrado
// respuesta a respuesta.
export function aplicarBonoRachaFinal(data, { elegible = true } = {}) {
  if (!data || data.bonoRachaFinal != null) return data;
  const { soloFlashcards, ...resumen } = data;
  const total = Number(data.total) || 0;
  const bonoRachaFinal = elegible && !soloFlashcards && total > 0 && currentStreak() >= 10 ? 5 : 0;
  if (bonoRachaFinal) ganar(bonoRachaFinal);
  return {
    ...resumen,
    monedas: Math.max(0, Number(data.monedas) || 0) + bonoRachaFinal,
    bonoRachaFinal
  };
}

// Devuelve true si había suficiente. Nunca deja el saldo en negativo.
export function gastar(n) {
  const precio = Math.max(0, Math.round(Number(n) || 0));
  const s = saldo();
  if (s < precio) return false;
  storage.set(KEY, s - precio);
  avisar(-precio, s - precio);
  return true;
}

// UN ejercicio acertado = UNA moneda. En todos los minijuegos, de gramática y
// de vocabulario, y sin bonos por dificultad ni por racha.
//
// Antes iba de 5 a 10 según el tipo y la racha, y salía disparado: una tanda
// de quince clavadas daban más de cien monedas, o sea que una tarde de test te
// compraba media tienda y lo demás sobraba. Los minijuegos se repiten sin
// límite, así que tienen que pagar poco; lo que paga de verdad es lo que
// cuesta hacer: escribir, el examen, el diario.
export const MONEDAS_EJERCICIO = 1;

// Lo que paga cada cosa que NO es un minijuego. Estos si pagan bien, porque
// se hacen una vez y cuestan: escribir en el diario, limpiar una hoja del
// cuaderno, un examen entero, o clavarle una respuesta a Felix.
//
// (Los valores son los que tenian antes de que se quitara el bono del 100%,
// recuperados del bundle: se borraron de mas al quitar aquel bloque.)
export const MONEDAS_FELIX = 5;
export const MONEDAS_EXAMEN = 30;
export const MONEDAS_TAGEBUCH = 25;
export const MONEDAS_NOTIZBUCH = 15;

// Cuanto paga un ejercicio: lo que TE EXIGE, menos lo que te han ayudado.
//
// Antes todo pagaba 1, sin mirar que fuera. Acertar un test de tres opciones
// valia lo mismo que escribir una frase entera de memoria, y eso no solo es
// injusto: empuja a pasar la tarde en el juego mas facil, que es justo lo
// contrario de lo que le conviene a nadie.
//
// Tres niveles, y el nombre dice el criterio:
//
//   RECONOCER    eliges entre opciones que ya tienes delante.  1
//   RECONSTRUIR  te dan las piezas y tu las colocas.           2
//   PRODUCIR     lo escribes de cero, sin nada delante.        4
//
// Las tarjetas se quedan en RECONOCER aunque parezcan duras: alli la nota te
// la pones tu, y lo que no se puede comprobar no se puede pagar caro.
//
// Cada pista gastada resta una moneda, pero acertar siempre garantiza al menos
// 1 moneda de suelo si la respuesta es correcta.
export const RECONOCER = 1;
export const RECONSTRUIR = 2;
export const PRODUCIR = 4;
export const FRASES = 4;

export function monedasDe({ nivel = RECONOCER, pistas = 0, minimo = 1 } = {}) {
  const p = Math.max(0, pistas);
  if (p === 0) return nivel;
  return Math.max(minimo, nivel - p);
}

// El cobro de un ejercicio, con su nivel y las pistas que hayas gastado en EL.
export function cobrarEjercicio(correcto, { nivel = RECONOCER, pistas = 0, minimo = 1 } = {}) {
  playAudio(correcto);
  const premio = correcto ? monedasDe({ nivel, pistas, minimo }) : 0;
  if (premio > 0) ganar(premio);
  return premio;
}

// Compatibilidad: los dos que ya llamaban asi (el ahorcado y traducir) son de
// RECONSTRUIR y PRODUCIR respectivamente, y se lo pasan ellos.
export function monedasConPistas(pistas = 0) {
  return monedasDe({ nivel: FRASES, pistas, minimo: 1 });
}

export function cobrarConPistas(correcto, pistas = 0) {
  return cobrarEjercicio(correcto, { nivel: FRASES, pistas, minimo: 1 });
}

// De donde sale el premio de un ejercicio. Se sigue devolviendo separado en
// dos porque el resumen lo ensena asi, pero el bono de racha ya no existe:
// con un ejercicio pagando 1, cualquier bono se comia el sueldo.
//
//   fallar     0   <- se cobra acertar, no participar
//   acertar    1
export function desglose({ correcto }) {
  return correcto ? { base: MONEDAS_EJERCICIO, racha: 0 } : { base: 0, racha: 0 };
}

export function monedasPorEjercicio(opciones) {
  const d = desglose(opciones);
  return d.base + d.racha;
}

// Para los juegos que no van ejercicio a ejercicio: se paga al terminar, con
// la misma cuenta, para que salga lo mismo que si se hubiera ido cobrando.
export function monedasPorTanda({ aciertos }) {
  return Math.max(0, aciertos) * MONEDAS_EJERCICIO;
}

// Cosas que solo pagan una vez al día. El Tagebuch y el Notizbuch entran aquí:
// escribir diez entradas de carrerilla no vale más que escribir una en
// condiciones, y si no, lo que sale a cuenta es picar texto.
const DIA = 'monedas:dia';

function hoy(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

// Devuelve lo que ha pagado: 0 si hoy ya tocaba.
export function cobrarUnaVezAlDia(clave, cuanto) {
  const dias = storage.get(DIA, {});
  if (dias[clave] === hoy()) return 0;
  storage.set(DIA, { ...dias, [clave]: hoy() });
  ganar(cuanto);
  return cuanto;
}

// Cobra un ejercicio suelto. La racha la saca de los resultados que ya llevas,
// así cada juego solo tiene que decir si se ha acertado y de qué tipo era.
// Hay que llamarla ANTES de meter el resultado nuevo en la lista.
// Los dos primeros argumentos sobran desde que todo paga igual, pero se
// mantienen: los llaman ocho juegos y cambiar la firma en todos para no pasar
// nada solo añade ruido.
export function cobrar(resultados, correcto) {
  playAudio(correcto);
  const premio = monedasPorEjercicio({ correcto });
  if (premio > 0) ganar(premio);
  return premio; // lo que ha pagado ESTE ejercicio, para sumarlo en el resumen
}

