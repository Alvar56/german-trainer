// Racha: dias consecutivos con al menos una sesion completada, con
// "congeladores" que perdonan un dia perdido. La XP acumulada sirve
// solo para subir de nivel (ver levelFromXp).

import { storage, KEYS } from './storage.js';
import { ganar } from './monedas.js';
import { localeFecha } from './i18n.js';
import { MAX_FREEZES, DIAS_POR_FREEZE, FREEZES_INICIALES, dayDiff, avanzarDia, recuperarCongelador, recalcular } from './rachaCuenta.js';

// Lo que paga sumar un dia mas de racha.
export const MONEDAS_POR_DIA = 10;
// Subir de nivel paga, lo mismo que sumar un dia de racha. Con 5 se quedaba
// corto: cuesta cada vez mas XP (100, 300, 600, 1000...), asi que el nivel 12
// son varios dias de trabajo y pagaba la mitad que aparecer un martes.
export const MONEDAS_POR_NIVEL = 20;
// Un día solo cuenta como practicado cuando una sesión supera este tiempo.
export const MIN_ACTIVITY_MS = 10_000;
export { MAX_FREEZES, DIAS_POR_FREEZE };

function todayKey(d = new Date()) {
  // Fecha local en formato YYYY-MM-DD
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate()
  ).padStart(2, '0')}`;
}

const DEFAULT = {
  current: 0,
  longest: 0,
  lastDay: null,
  freezes: FREEZES_INICIALES,
  history: {}, // { 'YYYY-MM-DD': xpDelDia }
  totalXp: 0
};

// La versión de la cuenta. Sube cuando cambia una regla y obliga a rehacerla.
const VERSION = 3;

export function getStreak() {
  const s = { ...DEFAULT, ...storage.get(KEYS.streak, DEFAULT) };
  if (s.v === VERSION) return s;
  const puesta = { ...recalcular(s), v: VERSION };
  storage.set(KEYS.streak, puesta);
  return puesta;
}

// Llamar al terminar una sesión. Solo registra el día si duró más de 10 s.
// Devuelve el estado + eventos para poder animar la racha.
export function recordActivity(xpGained, durationMs = 0) {
  const s = getStreak();
  const today = todayKey();
  const nivelAntes = levelFromXp(s.totalXp).level;
  const events = [];
  if (!(durationMs > MIN_ACTIVITY_MS)) {
    // La tanda sigue dando su XP normal, pero no inaugura un día practicado.
    s.totalXp += xpGained;
    if (s.lastDay === today) s.history[today] = (s.history[today] || 0) + xpGained;
    subidaDeNivel(nivelAntes, s.totalXp, events);
    storage.set(KEYS.streak, s);
    return { state: s, events, alreadyToday: s.lastDay === today, ignoredShort: true };
  }

  if (s.lastDay === today) {
    s.history[today] = (s.history[today] || 0) + xpGained;
    s.totalXp += xpGained;
    subidaDeNivel(nivelAntes, s.totalXp, events);
    storage.set(KEYS.streak, s);
    return { state: s, events, alreadyToday: true };
  }

  if (s.lastDay == null) {
    s.current = 1;
    events.push({ type: 'start' });
  } else {
    avanzarDia(s, dayDiff(s.lastDay, today), events);
  }

  s.longest = Math.max(s.longest, s.current);
  s.lastDay = today;
  s.history[today] = (s.history[today] || 0) + xpGained;
  s.totalXp += xpGained;

  recuperarCongelador(s, events);

  // Un dia mas de racha, 10 monedas. Solo la primera sesion del dia paga:
  // volver por la tarde no es un dia nuevo.
  ganar(MONEDAS_POR_DIA);
  events.push({ type: 'coins', value: MONEDAS_POR_DIA });

  subidaDeNivel(nivelAntes, s.totalXp, events);

  storage.set(KEYS.streak, s);
  return { state: s, events, alreadyToday: false };
}

// Si la XP de esta tanda ha cruzado un nivel, se apunta como evento y se paga.
// Puede cruzar mas de uno de golpe (una tanda larga al principio), y entonces
// se cobra por cada uno: lo raro seria que subir dos niveles pagase lo mismo
// que subir uno.
function subidaDeNivel(nivelAntes, totalXp, events) {
  const ahora = levelFromXp(totalXp).level;
  if (ahora <= nivelAntes) return;
  const monedas = MONEDAS_POR_NIVEL * (ahora - nivelAntes);
  ganar(monedas);
  events.push({ type: 'level', value: ahora, desde: nivelAntes, monedas });
}

// Estado "en vivo" para la pantalla de inicio: si te saltaste ayer y no
// hay congelador, la racha visible ya es 0 aunque no lo hayamos escrito.
export function liveStreak() {
  const s = getStreak();
  if (s.lastDay == null) return { ...s, current: 0, atRisk: false };
  const gap = dayDiff(s.lastDay, todayKey());
  if (gap === 0) return { ...s, atRisk: false, doneToday: true };
  // Mientras los congeladores cubran los días perdidos, la racha sigue viva:
  // la misma cuenta que hará recordActivity cuando de verdad practiques.
  if (gap - 1 <= s.freezes) return { ...s, atRisk: true, doneToday: false };
  return { ...s, current: 0, atRisk: false, doneToday: false };
}

// ---------- Nivel por XP acumulada ----------
// Curva suave: cada nivel pide 25 XP más que el anterior (base 100 XP para nivel 2).
// Nv 2 = 100 XP (+100) · Nv 3 = 225 XP (+125) · Nv 4 = 375 XP (+150) · Nv 5 = 550 XP (+175)
// Nv 10 = 1.800 XP · Nv 50 = 34.300 XP · Nv 100 = 131.175 XP
export const MAX_LEVEL = 100;

function totalXpParaNivel(L) {
  if (L <= 1) return 0;
  return (L - 1) * 100 + (L - 2) * (L - 1) * 12.5;
}

export function levelFromXp(totalXp = 0) {
  let level = 1;
  while (level < MAX_LEVEL && totalXpParaNivel(level + 1) <= totalXp) level++;
  const base = totalXpParaNivel(level);
  const next = totalXpParaNivel(Math.min(MAX_LEVEL, level + 1));
  const isMax = level >= MAX_LEVEL;
  return {
    level,
    totalXp,
    xpInto: isMax ? (totalXp - base) : (totalXp - base),
    xpNeeded: isMax ? (next - totalXpParaNivel(MAX_LEVEL - 1)) : (next - base),
    pct: isMax ? 100 : Math.min(100, Math.round(((totalXp - base) / (next - base)) * 100)),
    isMax
  };
}

export function getLevel() {
  return levelFromXp(getStreak().totalXp);
}

// ---------- Calendario del mes ----------
// Semana de lunes a domingo. `cells` incluye null para los huecos del inicio.
export function monthCalendar(ref = new Date()) {
  const s = getStreak();
  const year = ref.getFullYear();
  const month = ref.getMonth();
  const first = new Date(year, month, 1);
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startOffset = (first.getDay() + 6) % 7; // lunes = 0
  const tKey = todayKey();

  const cells = [];
  for (let i = 0; i < startOffset; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const k = todayKey(new Date(year, month, d));
    cells.push({ day: d, key: k, active: (s.history[k] || 0) > 0, isToday: k === tKey });
  }

  const activeThisMonth = cells.filter((c) => c && c.active).length;
  const label = first.toLocaleDateString(localeFecha(), { month: 'long', year: 'numeric' });
  return { label: label.charAt(0).toUpperCase() + label.slice(1), cells, activeThisMonth, daysInMonth };
}
