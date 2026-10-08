// La cuenta de la racha a partir del historial de dias practicados. Va aparte
// (sin storage) para que la use tambien fusion.js al juntar dos aparatos: el
// historial es lo que de verdad paso, y la racha y los congeladores se sacan
// de el.

const DAY = 86400000;
// Cuántos congeladores caben en el bolsillo y cada cuántos días seguidos cae
// uno nuevo. Estaban a pelo en medio del código (el `% 5` y el `< 3`), así
// que la pantalla de "cómo funciona" decía una cosa y el código otra.
export const MAX_FREEZES = 3;
export const DIAS_POR_FREEZE = 5;
// Con los que empiezas.
export const FREEZES_INICIALES = 2;

export function dayDiff(aKey, bKey) {
  const a = new Date(aKey + 'T00:00:00');
  const b = new Date(bKey + 'T00:00:00');
  return Math.round((b - a) / DAY);
}

// Un congelador por día perdido. Antes solo se perdonaba UN día (gap === 2)
// aunque tuvieras los tres congeladores guardados: faltar dos días seguidos
// rompía una racha de quince con el bolsillo lleno, y entonces el congelador
// no servía para lo único para lo que lo quieres, que es irte un fin de
// semana. Devuelve el evento que toque.
export function avanzarDia(s, gap, events) {
  // Con el reloj del aparato hacia atrás (un viaje, cambiar la fecha a mano)
  // el hueco sale negativo. Ni suma ni rompe: ese día no ha pasado.
  if (gap < 1) return;
  const perdidos = gap - 1;
  if (perdidos === 0) {
    s.current += 1;
    events.push({ type: 'up', value: s.current });
    return;
  }
  if (perdidos <= s.freezes) {
    s.freezes -= perdidos;
    s.current += 1;
    events.push({ type: 'freeze-used', usados: perdidos, remaining: s.freezes });
    return;
  }
  if (s.current > 0) events.push({ type: 'lost', was: s.current });
  s.current = 1;
}

// Cada 5 días seguidos, un congelador nuevo, hasta tres.
export function recuperarCongelador(s, events) {
  if (s.current <= 0) return;
  if (s.current % DIAS_POR_FREEZE !== 0) return;
  if (s.freezes >= MAX_FREEZES) return;
  s.freezes += 1;
  events.push({ type: 'freeze-earned', remaining: s.freezes });
}

// Rehacer la cuenta desde el historial, día por día.
//
// current, longest y freezes son solo la cuenta de lo que pasó. Al cambiar la
// regla, o al juntar dos aparatos, la cuenta guardada puede no cuadrar con el
// historial, y no hay forma de arreglarla mirando solo los números.
//
// El récord nunca baja: lo que ya conseguiste, conseguido está.
export function recalcular(s) {
  const dias = Object.keys(s.history || {})
    .filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d) && s.history[d] > 0)
    .sort();
  if (dias.length === 0) return s;

  const cuenta = { current: 0, freezes: FREEZES_INICIALES };
  let longest = 0;
  let anterior = null;
  for (const dia of dias) {
    if (anterior == null) cuenta.current = 1;
    else avanzarDia(cuenta, dayDiff(anterior, dia), []);
    recuperarCongelador(cuenta, []);
    longest = Math.max(longest, cuenta.current);
    anterior = dia;
  }

  return {
    ...s,
    current: cuenta.current,
    freezes: cuenta.freezes,
    longest: Math.max(longest, s.longest || 0),
    lastDay: anterior
  };
}
