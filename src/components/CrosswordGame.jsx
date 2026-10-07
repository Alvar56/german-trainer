import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { storage } from '../lib/storage.js';
import GameModePill from './GameModePill.jsx';
import { recordCard } from '../lib/vocab.js';
import { cobrarCrucigramaVocab, crucigramasResueltos, MAX_CRUCIGRAMAS_VOCAB } from '../lib/vocabRewards.js';
import { recordActivity } from '../lib/streak.js';
import { bumpSessions } from '../lib/progress.js';
import { saveRun } from '../lib/leaderboard.js';
import { t } from '../lib/i18n.js';
import Reloj from './Reloj.jsx';
import Umlaut from './Umlaut.jsx';
import { useTeclas } from '../lib/teclas.js';

const MAX_PALABRAS = 10;
const MIN_PALABRAS = 5;
const MAX_CASILLAS = 13;
const ZOOM_MIN = 0.75;
const ZOOM_MAX = 3;
const CROSSWORD_SESSIONS_KEY = 'vocab:crossword-sessions';

// Definiciones breves en alemán para términos del libro que no llevan una
// explicación propia. Así estas pistas preguntan por el significado, no por
// traducir una frase ambigua.
const DEFINITIONEN_DE = {
  DUENSTEN: 'Lebensmittel mit wenig Flüssigkeit und geschlossenem Topf garen.',
  GURKEN: 'Plural: grünes Gemüse, das roh oft im Salat oder mit Joghurt gegessen wird.',
  GURKE: 'Grünes Gemüse, das roh oft im Salat oder mit Joghurt gegessen wird.',
  GASTGARTEN: 'Ein bewirteter Außenbereich eines Lokals; besonders in Österreich sagt man so.',
  HANDVOLL: 'Eine Menge, die ungefähr in eine geöffnete Hand passt.',
  TRAUBEN: 'Plural: kleine, runde Früchte, die in Rispen wachsen und aus denen man Wein macht.',
  MISCHEN: 'Mehrere Zutaten miteinander verbinden, damit sie sich gleichmäßig verteilen.',
  SERVIEREN: 'Speisen oder Getränke zu den Gästen an den Tisch bringen.',
  LOKAL: 'Eine Gaststätte, in der man etwas essen oder trinken kann.',
  KNETEN: 'Teig mit den Händen drücken und falten, bis er glatt und elastisch ist.',
  WUERZEN: 'Einer Speise mit Salz, Kräutern oder Gewürzen mehr Geschmack geben.'
};

function nuevoEstado(puzzle) {
  return {
    selectedId: primeraSinResolver(puzzle, [])?.id || puzzle?.entries[0]?.id || null,
    input: '',
    solved: [],
    feedback: '',
    completed: false,
    reward: 0
  };
}

function ordenEntradas(puzzle) {
  const entries = puzzle?.entries || [];
  const porNumero = (a, b) => a.number - b.number || a.y - b.y || a.x - b.x;
  return [
    ...entries.filter((entry) => entry.direction === 'across').sort(porNumero),
    ...entries.filter((entry) => entry.direction === 'down').sort(porNumero)
  ];
}

function primeraSinResolver(puzzle, solved) {
  const resueltas = new Set(solved || []);
  return ordenEntradas(puzzle).find((entry) => !resueltas.has(entry.id)) || null;
}

function siguienteSinResolver(puzzle, solved, currentId) {
  const entries = ordenEntradas(puzzle);
  if (!entries.length) return null;
  const resueltas = new Set(solved || []);
  const currentIndex = entries.findIndex((entry) => entry.id === currentId);
  for (let offset = 1; offset <= entries.length; offset++) {
    const entry = entries[(currentIndex + offset + entries.length) % entries.length];
    if (!resueltas.has(entry.id)) return entry;
  }
  return null;
}

function baraja(items) {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function sinAcentos(texto) {
  return String(texto || '')
    .replace(/[äÄ]/g, 'AE').replace(/[öÖ]/g, 'OE').replace(/[üÜ]/g, 'UE').replace(/ß/g, 'SS')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

function escaparRegExp(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function palabraCrucigrama(de) {
  const limpia = String(de || '').trim().replace(/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+/i, '');
  return sinAcentos(limpia).toUpperCase().replace(/[^A-Z]/g, '');
}

function pistaAlemana(card, answer) {
  const definida = card.definitionDe || card.defDe || card.hinweisDe || card.beschreibungDe || card.meaningDe;
  if (definida) return definida;
  if (DEFINITIONEN_DE[answer]) return DEFINITIONEN_DE[answer];

  const ejemplo = String(card.ex || '').trim();
  if (ejemplo) {
    const tokens = String(card.de || '')
      .replace(/^(der|die|das|den|dem|des|ein|eine|einen|einem|einer)\s+/i, '')
      .split(/[^A-Za-zÄÖÜäöüß]+/)
      .filter((x) => x.length >= 3 && !/^(sich|sein|haben|werden)$/i.test(x))
      .sort((a, b) => b.length - a.length);
    for (const token of tokens) {
      const variantes = [token];
      // Busca también raíces de verbos con prefijo separable o participio
      // (dünsten → gedünstet), y formas flexionadas en el ejemplo.
      if (token.length >= 5) {
        variantes.push(token.replace(/(?:en|n)$/i, ''), token.replace(/(?:en|n|e)$/i, ''));
      }
      for (const variante of variantes) {
        if (variante.length < 3) continue;
        const stem = escaparRegExp(variante);
        const re = new RegExp(`(^|[^A-Za-zÄÖÜäöüß])(?:ge)?${stem}[A-Za-zÄÖÜäöüß]*(?=$|[^A-Za-zÄÖÜäöüß])`, 'i');
        if (re.test(ejemplo)) {
          const masked = ejemplo.replace(re, '$1________');
          const prompts = [
            `Welche Vokabel passt in diesen Satz? „${masked}“`,
            `Im deutschen Beispielsatz fehlt ein Wort: „${masked}“`,
            `Welcher Begriff macht den Satz vollständig? „${masked}“`,
            `Lies den Kontext und finde das gesuchte Wort: „${masked}“`,
            `Setze das passende Wort in die Lücke: „${masked}“`
          ];
          const seed = [...String(answer)].reduce((sum, char) => sum + char.charCodeAt(0), 0);
          return prompts[seed % prompts.length];
        }
      }
    }
  }

  const prompts = [
    `Wie heißt das deutsche Wort für „${card.es || ''}“?`,
    `Gesucht ist die deutsche Vokabel für „${card.es || ''}“.`,
    `Welche Vokabel bedeutet „${card.es || ''}“?`
  ];
  const seed = [...String(answer)].reduce((sum, char) => sum + char.charCodeAt(0), 0);
  return prompts[seed % prompts.length];
}

function preparaEntradas(cards) {
  const vistos = new Set();
  return cards.map((card, i) => {
    const answer = palabraCrucigrama(card.de);
    if (answer.length < 3 || answer.length > MAX_CASILLAS || vistos.has(answer)) return null;
    vistos.add(answer);
    return { id: `${i}-${answer}`, card, answer, letters: [...answer], clue: pistaAlemana(card, answer) };
  }).filter(Boolean);
}

function key(x, y) { return `${x},${y}`; }

function puedeColocar(entry, x, y, direction, cells) {
  const dx = direction === 'across' ? 1 : 0;
  const dy = direction === 'down' ? 1 : 0;
  if (cells.has(key(x - dx, y - dy)) || cells.has(key(x + dx * entry.letters.length, y + dy * entry.letters.length))) return false;
  let cruces = 0;
  for (let i = 0; i < entry.letters.length; i++) {
    const cx = x + dx * i;
    const cy = y + dy * i;
    const cell = cells.get(key(cx, cy));
    if (cell) {
      if (cell.letter !== entry.letters[i] || cell.directions.has(direction)) return false;
      cruces++;
      continue;
    }
    const sides = direction === 'across'
      ? [key(cx, cy - 1), key(cx, cy + 1)]
      : [key(cx - 1, cy), key(cx + 1, cy)];
    if (sides.some((side) => cells.has(side))) return false;
  }
  return cruces > 0;
}

function coloca(entry, x, y, direction, cells) {
  const dx = direction === 'across' ? 1 : 0;
  const dy = direction === 'down' ? 1 : 0;
  const next = new Map(cells);
  for (let i = 0; i < entry.letters.length; i++) {
    const k = key(x + dx * i, y + dy * i);
    const current = next.get(k);
    if (current) {
      const directions = new Set(current.directions);
      directions.add(direction);
      next.set(k, { ...current, directions });
    } else {
      next.set(k, { letter: entry.letters[i], directions: new Set([direction]) });
    }
  }
  return next;
}

function intentaCrucigrama(pool) {
  const ordered = [...pool].sort((a, b) => b.letters.length - a.letters.length);
  if (!ordered.length) return null;
  const first = ordered[0];
  let cells = new Map();
  cells = coloca(first, 0, 0, 'across', cells);
  let placed = [{ ...first, x: 0, y: 0, direction: 'across' }];
  const rest = ordered.slice(1);

  while (rest.length && placed.length < MAX_PALABRAS) {
    let best = null;
    for (let ri = 0; ri < rest.length; ri++) {
      const entry = rest[ri];
      for (const existing of placed) {
        const crossDirection = existing.direction === 'across' ? 'down' : 'across';
        for (let a = 0; a < existing.letters.length; a++) {
          for (let b = 0; b < entry.letters.length; b++) {
            if (existing.letters[a] !== entry.letters[b]) continue;
            const crossX = existing.x + (existing.direction === 'across' ? a : 0);
            const crossY = existing.y + (existing.direction === 'down' ? a : 0);
            const startX = crossX - (crossDirection === 'across' ? b : 0);
            const startY = crossY - (crossDirection === 'down' ? b : 0);
            if (!puedeColocar(entry, startX, startY, crossDirection, cells)) continue;
            const nextCells = coloca(entry, startX, startY, crossDirection, cells);
            const xs = [...nextCells.keys()].map((p) => Number(p.split(',')[0]));
            const ys = [...nextCells.keys()].map((p) => Number(p.split(',')[1]));
            const area = (Math.max(...xs) - Math.min(...xs) + 1) * (Math.max(...ys) - Math.min(...ys) + 1);
            const score = -area - Math.abs((Math.max(...xs) - Math.min(...xs)) - (Math.max(...ys) - Math.min(...ys))) * 0.1;
            if (!best || score > best.score) best = { score, restIndex: ri, entry, x: startX, y: startY, direction: crossDirection, cells: nextCells };
          }
        }
      }
    }
    if (!best) break;
    cells = best.cells;
    placed.push({ ...best.entry, x: best.x, y: best.y, direction: best.direction });
    rest.splice(best.restIndex, 1);
  }
  return { placed, cells };
}

function crearCrucigrama(cards) {
  const candidates = preparaEntradas(cards);
  let best = null;
  for (let i = 0; i < 45; i++) {
    const layout = intentaCrucigrama(baraja(candidates).slice(0, Math.min(MAX_PALABRAS, candidates.length)));
    if (layout && (!best || layout.placed.length > best.placed.length)) best = layout;
    if (best?.placed.length >= MAX_PALABRAS) break;
  }
  if (!best || best.placed.length < MIN_PALABRAS) return null;

  const xs = [...best.cells.keys()].map((p) => Number(p.split(',')[0]));
  const ys = [...best.cells.keys()].map((p) => Number(p.split(',')[1]));
  const minX = Math.min(...xs);
  const minY = Math.min(...ys);
  const shifted = best.placed.map((entry) => ({ ...entry, x: entry.x - minX, y: entry.y - minY }));
  const width = Math.max(...xs) - minX + 1;
  const height = Math.max(...ys) - minY + 1;
  const cellMap = new Map();
  shifted.forEach((entry) => entry.letters.forEach((letter, i) => {
    const k = key(entry.x + (entry.direction === 'across' ? i : 0), entry.y + (entry.direction === 'down' ? i : 0));
    const current = cellMap.get(k) || { letter, entries: [] };
    current.entries.push(entry.id);
    cellMap.set(k, current);
  }));
  const starts = [...shifted].sort((a, b) => a.y - b.y || a.x - b.x);
  const numbers = new Map(starts.map((entry, i) => [entry.id, i + 1]));
  shifted.forEach((entry) => { entry.number = numbers.get(entry.id); });
  const numberedCells = new Map();
  shifted.forEach((entry) => {
    const k = key(entry.x, entry.y);
    numberedCells.set(k, [...(numberedCells.get(k) || []), entry.number]);
  });
  return { entries: shifted, width, height, cellMap, numberedCells };
}

function crearCrucigramas(cards, count) {
  if (!cards?.length || count <= 0) return [];
  const puzzles = [];
  const used = new Set();
  let remaining = [...cards];
  while (puzzles.length < count) {
    let puzzle = crearCrucigrama(remaining);
    if (!puzzle) puzzle = crearCrucigrama(cards);
    // Mazos pequeños pueden tener solo cinco palabras válidas. Reutilizamos
    // entonces el tablero disponible para no ofrecer una navegación rota.
    if (!puzzle && puzzles.length) puzzle = puzzles[0];
    if (!puzzle) break;
    puzzles.push(puzzle);
    puzzle.entries.forEach((entry) => used.add(entry.answer));
    remaining = cards.filter((card) => !used.has(palabraCrucigrama(card.de)));
  }
  return puzzles;
}

function crosswordSignature(cards) {
  return preparaEntradas(cards).map((entry) => entry.answer).sort().join('|');
}

function serializarPuzzle(puzzle) {
  return {
    width: puzzle.width,
    height: puzzle.height,
    entries: puzzle.entries.map(({ answer, x, y, direction, number }) => ({ answer, x, y, direction, number }))
  };
}

function reconstruirPuzzle(saved, entriesByAnswer) {
  if (!saved || !Number.isInteger(saved.width) || !Number.isInteger(saved.height) || !Array.isArray(saved.entries)) return null;
  const entries = saved.entries.map((entry) => {
    const live = entriesByAnswer.get(entry.answer);
    if (!live || !Number.isInteger(entry.x) || !Number.isInteger(entry.y) || !['across', 'down'].includes(entry.direction)) return null;
    return { ...live, x: entry.x, y: entry.y, direction: entry.direction, number: Number(entry.number) || 0 };
  });
  if (entries.length < MIN_PALABRAS || entries.some((entry) => !entry)) return null;

  const cellMap = new Map();
  const numberedCells = new Map();
  let valid = true;
  for (const entry of entries) {
    const dx = entry.direction === 'across' ? 1 : 0;
    const dy = entry.direction === 'down' ? 1 : 0;
    if (entry.x < 0 || entry.y < 0 || entry.x + dx * (entry.letters.length - 1) >= saved.width || entry.y + dy * (entry.letters.length - 1) >= saved.height) return null;
    entry.letters.forEach((letter, i) => {
      const cellKey = key(entry.x + dx * i, entry.y + dy * i);
      const cell = cellMap.get(cellKey);
      if (cell && cell.letter !== letter) {
        valid = false;
        return;
      }
      if (cell) cell.entries.push(entry.id);
      else cellMap.set(cellKey, { letter, entries: [entry.id] });
    });
    if (!valid) return null;
    const startKey = key(entry.x, entry.y);
    numberedCells.set(startKey, [...(numberedCells.get(startKey) || []), entry.number]);
  }
  return { entries, width: saved.width, height: saved.height, cellMap, numberedCells };
}

function restaurarSesionCrucigrama(deck) {
  if (!deck?.id || !Array.isArray(deck.cards)) return null;
  const saved = storage.get(CROSSWORD_SESSIONS_KEY, {})[deck.id];
  if (!saved || saved.deleted || saved.version !== 1 || saved.signature !== crosswordSignature(deck.cards)) return null;
  if (!Array.isArray(saved.puzzles) || !Array.isArray(saved.rounds) || saved.puzzles.length < 1 || saved.puzzles.length !== saved.rounds.length) return null;

  const entriesByAnswer = new Map(preparaEntradas(deck.cards).map((entry) => [entry.answer, entry]));
  const puzzles = saved.puzzles.map((puzzle) => reconstruirPuzzle(puzzle, entriesByAnswer));
  if (puzzles.some((puzzle) => !puzzle)) return null;
  const rounds = saved.rounds.map((state, i) => {
    const puzzle = puzzles[i];
    const byAnswer = new Map(puzzle.entries.map((entry) => [entry.answer, entry.id]));
    const solved = (Array.isArray(state.solvedAnswers) ? state.solvedAnswers : []).map((answer) => byAnswer.get(answer)).filter(Boolean);
    const guardadoId = byAnswer.get(state.selectedAnswer) || puzzle.entries[0]?.id || null;
    const selectedId = primeraSinResolver(puzzle, solved)?.id || guardadoId;
    const mismaPista = selectedId === guardadoId;
    return {
      ...nuevoEstado(puzzle),
      selectedId,
      input: mismaPista ? String(state.input || '') : '',
      solved,
      feedback: mismaPista ? String(state.feedback || '') : '',
      completed: Boolean(state.completed),
      reward: Math.max(0, Number(state.reward) || 0)
    };
  });
  const baseCompleted = Math.min(MAX_CRUCIGRAMAS_VOCAB, Math.max(0, Number(saved.baseCompleted) || 0));
  return {
    baseCompleted,
    puzzles,
    rounds,
    roundIndex: Math.min(rounds.length - 1, Math.max(0, Number(saved.roundIndex) || 0)),
    boardZoom: Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, Number(saved.boardZoom) || 1))
  };
}

function guardarSesionCrucigrama(deck, baseCompleted, puzzles, rounds, roundIndex, boardZoom) {
  if (!deck?.id || !puzzles.length || !rounds.length) return;
  storage.update(CROSSWORD_SESSIONS_KEY, {}, (sessions) => ({
    ...sessions,
    [deck.id]: {
      version: 1,
      signature: crosswordSignature(deck.cards || []),
      baseCompleted,
      puzzles: puzzles.map(serializarPuzzle),
      rounds: rounds.map((state, i) => {
        const puzzle = puzzles[i];
        return {
          selectedAnswer: puzzle.entries.find((entry) => entry.id === state.selectedId)?.answer || puzzle.entries[0]?.answer || '',
          input: state.input,
          solvedAnswers: state.solved.map((id) => puzzle.entries.find((entry) => entry.id === id)?.answer).filter(Boolean),
          feedback: state.feedback,
          completed: state.completed,
          reward: state.reward
        };
      }),
      roundIndex,
      boardZoom,
      updatedAt: Date.now()
    }
  }));
}

function cerrarSesionCrucigrama(deckId) {
  if (!deckId) return;
  storage.update(CROSSWORD_SESSIONS_KEY, {}, (sessions) => ({
    ...sessions,
    [deckId]: { version: 1, deleted: true, updatedAt: Date.now() }
  }));
}

function normalizaRespuesta(value) {
  return sinAcentos(value).toUpperCase().replace(/[^A-Z]/g, '');
}

export default function CrosswordGame({ deck, onExit, onFinish }) {
  const restored = useMemo(() => restaurarSesionCrucigrama(deck), [deck?.id, deck?.cards]);
  const firstUnsolved = restored?.baseCompleted ?? crucigramasResueltos(deck?.id);
  const roundsAvailable = restored ? restored.puzzles.length : Math.max(0, MAX_CRUCIGRAMAS_VOCAB - firstUnsolved);
  const puzzles = useMemo(() => restored?.puzzles || crearCrucigramas(deck?.cards || [], roundsAvailable), [deck?.id, deck?.cards, roundsAvailable, restored]);
  const [roundIndex, setRoundIndex] = useState(() => restored?.roundIndex || 0);
  const [rounds, setRounds] = useState(() => restored?.rounds || puzzles.map(nuevoEstado));
  const roundsRef = useRef(rounds);
  roundsRef.current = rounds;
  const roundIndexRef = useRef(roundIndex);
  roundIndexRef.current = roundIndex;
  const answerInput = useRef(null);
  const started = useRef(Date.now());
  const earnedRounds = useRef(new Set((restored?.rounds || []).flatMap((round, i) => round.completed ? [i] : [])));
  const finished = useRef(false);
  const boardViewport = useRef(null);
  const boardElement = useRef(null);
  const [boardZoom, setBoardZoom] = useState(() => restored?.boardZoom || 1);
  const zoomRef = useRef(restored?.boardZoom || 1);
  const zoomAnchor = useRef(null);
  const pinchStart = useRef(null);
  zoomRef.current = boardZoom;

  const applyLocalZoom = (nextZoom, clientX, clientY) => {
    const viewport = boardViewport.current;
    if (!viewport) return;
    const previous = zoomRef.current;
    const next = Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, nextZoom));
    if (next === previous) return;
    const rect = viewport.getBoundingClientRect();
    const style = window.getComputedStyle(viewport);
    const localX = Math.max(0, clientX - rect.left - viewport.clientLeft - (parseFloat(style.paddingLeft) || 0));
    const localY = Math.max(0, clientY - rect.top - viewport.clientTop - (parseFloat(style.paddingTop) || 0));
    const boardRect = boardElement.current?.getBoundingClientRect();
    const originX = boardRect ? boardRect.left - rect.left - viewport.clientLeft - (parseFloat(style.paddingLeft) || 0) : 0;
    const originY = boardRect ? boardRect.top - rect.top - viewport.clientTop - (parseFloat(style.paddingTop) || 0) : 0;
    zoomAnchor.current = {
      x: (viewport.scrollLeft + localX - originX) / previous,
      y: (viewport.scrollTop + localY - originY) / previous,
      localX,
      localY
    };
    zoomRef.current = next;
    setBoardZoom(next);
  };

  useLayoutEffect(() => {
    const viewport = boardViewport.current;
    const board = boardElement.current;
    const anchor = zoomAnchor.current;
    if (!viewport || !board || !anchor) return;
    zoomAnchor.current = null;
    const viewportRect = viewport.getBoundingClientRect();
    const style = window.getComputedStyle(viewport);
    const originX = board.getBoundingClientRect().left - viewportRect.left - viewport.clientLeft - (parseFloat(style.paddingLeft) || 0);
    const originY = board.getBoundingClientRect().top - viewportRect.top - viewport.clientTop - (parseFloat(style.paddingTop) || 0);
    viewport.scrollLeft = Math.max(0, originX + anchor.x * boardZoom - anchor.localX);
    viewport.scrollTop = Math.max(0, originY + anchor.y * boardZoom - anchor.localY);
  }, [boardZoom]);

  useEffect(() => {
    const viewport = boardViewport.current;
    if (!viewport) return undefined;
    const distance = (a, b) => Math.hypot(a.clientX - b.clientX, a.clientY - b.clientY);
    const center = (a, b) => ({ clientX: (a.clientX + b.clientX) / 2, clientY: (a.clientY + b.clientY) / 2 });
    const onTouchStart = (event) => {
      if (event.touches.length !== 2) return;
      const [a, b] = event.touches;
      pinchStart.current = { distance: distance(a, b), zoom: zoomRef.current };
    };
    const onTouchMove = (event) => {
      if (event.touches.length !== 2 || !pinchStart.current) return;
      event.preventDefault();
      const [a, b] = event.touches;
      const midpoint = center(a, b);
      const currentDistance = distance(a, b);
      const ratio = currentDistance / Math.max(1, pinchStart.current.distance);
      applyLocalZoom(pinchStart.current.zoom * ratio, midpoint.clientX, midpoint.clientY);
      pinchStart.current = { distance: currentDistance, zoom: zoomRef.current };
    };
    const onTouchEnd = (event) => {
      if (event.touches.length < 2) pinchStart.current = null;
    };
    const onWheel = (event) => {
      // Los gestos de zoom del trackpad llegan como wheel con Ctrl/Cmd. Este
      // listener nativo no pasivo permite cancelar el zoom del navegador y
      // aplicar cada delta pequeño del gesto al tablero, también al acercar.
      if (!event.ctrlKey && !event.metaKey) return;
      event.preventDefault();
      const deltaY = event.deltaMode === WheelEvent.DOM_DELTA_LINE ? event.deltaY * 16 : event.deltaY;
      applyLocalZoom(zoomRef.current * Math.exp(-deltaY * 0.002), event.clientX, event.clientY);
    };
    viewport.addEventListener('touchstart', onTouchStart, { passive: true });
    viewport.addEventListener('touchmove', onTouchMove, { passive: false });
    viewport.addEventListener('touchend', onTouchEnd, { passive: true });
    viewport.addEventListener('touchcancel', onTouchEnd, { passive: true });
    viewport.addEventListener('wheel', onWheel, { passive: false });
    return () => {
      viewport.removeEventListener('touchstart', onTouchStart);
      viewport.removeEventListener('touchmove', onTouchMove);
      viewport.removeEventListener('touchend', onTouchEnd);
      viewport.removeEventListener('touchcancel', onTouchEnd);
      viewport.removeEventListener('wheel', onWheel);
    };
  }, []);

  function zoomFromControls(amount) {
    const rect = boardViewport.current?.getBoundingClientRect();
    if (!rect) return;
    applyLocalZoom(zoomRef.current + amount, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }

  function resetBoardZoom() {
    const rect = boardViewport.current?.getBoundingClientRect();
    if (!rect) return;
    applyLocalZoom(1, rect.left + rect.width / 2, rect.top + rect.height / 2);
  }
  const puzzle = puzzles[roundIndex];
  const round = rounds[roundIndex] || nuevoEstado(puzzle);
  const { selectedId, input, solved, feedback } = round;
  const selected = puzzle?.entries.find((entry) => entry.id === selectedId) || null;
  const solvedSet = useMemo(() => new Set(solved), [solved]);
  const completedCount = firstUnsolved + rounds.filter((item) => item.completed).length;

  useEffect(() => {
    guardarSesionCrucigrama(deck, firstUnsolved, puzzles, rounds, roundIndex, boardZoom);
  }, [deck?.id, firstUnsolved, puzzles, rounds, roundIndex, boardZoom]);

  function salir() {
    guardarSesionCrucigrama(deck, firstUnsolved, puzzles, roundsRef.current, roundIndexRef.current, zoomRef.current);
    onExit?.();
  }

  function updateRound(index, patch) {
    setRounds((current) => current.map((item, i) => i === index ? { ...item, ...patch } : item));
  }

  function terminar(nextRounds) {
    if (finished.current) return;
    finished.current = true;
    cerrarSesionCrucigrama(deck?.id);
    const seconds = Math.max(1, Math.round((Date.now() - started.current) / 1000));
    const total = puzzles.reduce((sum, item) => sum + item.entries.length, 0);
    const correct = nextRounds.reduce((sum, item) => sum + item.solved.length, 0);
    const xp = total * 10;
    const bonoCrucigrama = nextRounds.reduce((sum, item) => sum + item.reward, 0);
    bumpSessions();
    const streak = recordActivity(xp, Date.now() - started.current);
    saveRun({
      topicId: 'vocab:' + deck.id,
      topicName: 'Vocab · ' + deck.name,
      mode: 'crossword', game: 'crossword',
      correct, total,
      accuracy: 1, seconds, xp
    });
    onFinish({
      deck,
      mode: 'crossword',
      correct,
      total,
      seconds,
      xp,
      streak,
      monedas: 0,
      bonoCrucigrama,
      ganado: true,
      missed: []
    });
  }

  function comprobar(e) {
    e?.preventDefault?.();
    if (!selected || solvedSet.has(selected.id) || round.completed) return;
    if (normalizaRespuesta(input) !== selected.answer) {
      updateRound(roundIndex, { feedback: t('voc.crosswordTryAgain') });
      return;
    }
    const next = [...solved, selected.id];
    recordCard(selected.card.de, true, { mode: 'crossword', peso: 1 });
    const nextEntry = siguienteSinResolver(puzzle, next, selected.id);
    const completed = next.length === puzzle.entries.length;
    const reward = completed && !earnedRounds.current.has(roundIndex)
      ? cobrarCrucigramaVocab(deck.id)
      : round.reward;
    if (completed) earnedRounds.current.add(roundIndex);
    const nextRound = {
      ...round,
      selectedId: nextEntry?.id || selected.id,
      input: '',
      solved: next,
      feedback: t('voc.crosswordCorrect'),
      completed,
      reward
    };
    const nextRounds = rounds.map((item, i) => i === roundIndex ? nextRound : item);
    setRounds(nextRounds);
  }

  useTeclas({ Escape: salir }, !!selected && !finished.current);

  if (!puzzle || !rounds.length) {
    return (
      <div className="card center stack">
        <p>{t('voc.crosswordNeedWords')}</p>
        <button className="btn-ghost" onClick={salir}>{t('back')}</button>
      </div>
    );
  }

  const cells = [];
  for (let y = 0; y < puzzle.height; y++) {
    for (let x = 0; x < puzzle.width; x++) {
      const cell = puzzle.cellMap.get(key(x, y));
      if (!cell) {
        cells.push(<span className="crossword-blank" key={`${x}-${y}`} aria-hidden="true" />);
        continue;
      }
      const active = selected && selected.letters.some((_, i) => key(
        selected.x + (selected.direction === 'across' ? i : 0),
        selected.y + (selected.direction === 'down' ? i : 0)
      ) === key(x, y));
      const letter = cell.entries.find((id) => solvedSet.has(id));
      const visible = letter ? cell.letter : '';
      cells.push(
        <button
          type="button"
          key={`${x}-${y}`}
          className={'crossword-cell' + (active ? ' active' : '') + (visible ? ' filled' : '')}
          onClick={() => {
            const choices = cell.entries.map((id) => puzzle.entries.find((entry) => entry.id === id)).filter(Boolean);
            const next = choices.find((entry) => !solvedSet.has(entry.id)) || choices[0];
            if (next) updateRound(roundIndex, { selectedId: next.id, input: '', feedback: '' });
          }}
          aria-label={visible || t('voc.crosswordEmptyCell')}
        >
          {puzzle.numberedCells.get(key(x, y))?.[0] && <span className="crossword-number">{puzzle.numberedCells.get(key(x, y))[0]}</span>}
          {visible}
        </button>
      );
    }
  }

  return (
    <div className="vocab-session crossword-session">
      <div className="crossword-toolbar">
        <button className="btn-ghost ses-icon-btn" onClick={salir} title={t('ses.exit')}>✕</button>
        <span className="pill ctx-tema">🔠 {deck?.name}</span>
        <GameModePill mode="crossword" />
        <Reloj desde={started.current} />

        <div className="crossword-rounds" role="navigation" aria-label={t('voc.crosswordNavigation')}>
          <button
            type="button"
            className="btn-ghost crossword-round-arrow"
            onClick={() => setRoundIndex((index) => Math.max(0, index - 1))}
            disabled={roundIndex === 0}
            aria-label={t('voc.crosswordPrevious')}
          >‹</button>
          {puzzles.map((_, index) => (
            <button
              key={index}
              type="button"
              className={'btn-ghost crossword-round-tab' + (roundIndex === index ? ' selected' : '') + (rounds[index]?.completed ? ' completed' : '')}
              onClick={() => setRoundIndex(index)}
              aria-label={t('voc.crosswordRound', { n: firstUnsolved + index + 1, total: MAX_CRUCIGRAMAS_VOCAB })}
              aria-current={roundIndex === index ? 'step' : undefined}
            >
              {firstUnsolved + index + 1}
              {rounds[index]?.completed && <span aria-hidden="true"> ✓</span>}
            </button>
          ))}
          <button
            type="button"
            className="btn-ghost crossword-round-arrow"
            onClick={() => setRoundIndex((index) => Math.min(puzzles.length - 1, index + 1))}
            disabled={roundIndex === puzzles.length - 1}
            aria-label={t('voc.crosswordNext')}
          >›</button>
          <span className="crossword-rounds-done">{t('voc.crosswordRoundsDone', { n: completedCount, total: MAX_CRUCIGRAMAS_VOCAB })}</span>
        </div>
      </div>

      <div className="card stack crossword-card">
        <div className="crossword-board-heading">
          <div>
            <h2>{t('voc.crosswordTitle')}</h2>
            <p className="muted">{t('voc.crosswordInstructions')}</p>
          </div>
          <div className="crossword-zoom-controls" role="group" aria-label={t('voc.crosswordZoom')}>
            <button type="button" className="btn-ghost" onClick={() => zoomFromControls(-0.2)} aria-label={t('voc.crosswordZoomOut')} disabled={boardZoom <= ZOOM_MIN}>−</button>
            <button type="button" className="btn-ghost crossword-zoom-value" onClick={resetBoardZoom} aria-label={t('voc.crosswordZoomReset')}>{Math.round(boardZoom * 100)}%</button>
            <button type="button" className="btn-ghost" onClick={() => zoomFromControls(0.2)} aria-label={t('voc.crosswordZoomIn')} disabled={boardZoom >= ZOOM_MAX}>+</button>
          </div>
        </div>

        <div ref={boardViewport} className="crossword-board-wrap" aria-label={t('voc.crosswordTitle')}>
          <div ref={boardElement} className="crossword-board" style={{ gridTemplateColumns: `repeat(${puzzle.width}, var(--crossword-cell-size))`, transform: `scale(${boardZoom})`, transformOrigin: 'top left' }}>
            {cells}
          </div>
        </div>

        <div className="crossword-current">
          <div className="crossword-clue-label">{selected?.number} · {selected?.direction === 'across' ? t('voc.crosswordAcross') : t('voc.crosswordDown')}</div>
          <p className="crossword-definition">{selected?.clue}</p>
          {selected && solvedSet.has(selected.id) ? (
            <p className="crossword-solved">✓ {selected.answer}</p>
          ) : !round.completed ? (
            <form className="write-fila crossword-answer-form" onSubmit={comprobar}>
              <input
                ref={answerInput}
                className="ask-input write-input crossword-answer"
                type="text"
                lang="de"
                spellCheck={false}
                value={input}
                onChange={(e) => updateRound(roundIndex, { input: e.target.value, feedback: '' })}
                placeholder={t('voc.crosswordAnswer')}
                autoCapitalize="off"
                autoComplete="off"
              />
              <Umlaut campo={answerInput} onTexto={(value) => updateRound(roundIndex, { input: value, feedback: '' })} />
              <button className="btn-primary btn-corregir crossword-check" type="submit" disabled={!input.trim()}>{t('voc.crosswordCheck')}</button>
            </form>
          ) : <p className="crossword-solved">✓ {t('voc.crosswordSolved')}</p>}
          {feedback && <p className={'crossword-feedback' + (feedback === t('voc.crosswordCorrect') ? ' correct' : '')} role="status">{feedback}</p>}
          {round.completed && (
            <p className="crossword-round-reward" role="status">
              {t('voc.crosswordRoundDone', { n: firstUnsolved + roundIndex + 1, coins: round.reward })}
            </p>
          )}
        </div>

        <div className="crossword-clue-list">
          {['across', 'down'].map((direction) => {
            const entries = puzzle.entries.filter((entry) => entry.direction === direction).sort((a, b) => a.number - b.number);
            if (!entries.length) return null;
            return (
              <section key={direction}>
                <h3>{direction === 'across' ? t('voc.crosswordAcross') : t('voc.crosswordDown')}</h3>
                <div className="crossword-clues">
                  {entries.map((entry) => (
                    <button
                      key={entry.id}
                      type="button"
                      className={'crossword-clue' + (selectedId === entry.id ? ' selected' : '') + (solvedSet.has(entry.id) ? ' solved' : '')}
                      onClick={() => updateRound(roundIndex, { selectedId: entry.id, input: '', feedback: '' })}
                    >
                      <strong>{entry.number}.</strong> {entry.clue}
                      {solvedSet.has(entry.id) && <span aria-label={t('voc.crosswordSolved')}> ✓</span>}
                    </button>
                  ))}
                </div>
              </section>
          );
        })}
        </div>
        {rounds.length > 0 && rounds.every((item) => item.completed) && (
          <button type="button" className="btn-primary crossword-finish" onClick={() => terminar(rounds)}>
            {t('voc.crosswordFinishSet')}
          </button>
        )}
      </div>
    </div>
  );
}
