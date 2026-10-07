import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import FoxOverlay, { useFox } from './FoxOverlay.jsx';
import GameModePill from './GameModePill.jsx';
import { pickCards, recordCard, deckStats } from '../lib/vocab.js';
import { tc } from '../lib/contenido/index.js';
import { recordActivity } from '../lib/streak.js';
import { cobrarEjercicio, RECONSTRUIR } from '../lib/monedas.js';
import { bumpSessions } from '../lib/progress.js';
import { saveRun } from '../lib/leaderboard.js';
import { pick } from '../lib/i18n.js';
import { getSettings } from '../lib/settings.js';
import { useExerciseActive, useTeclas } from '../lib/teclas.js';
import { animarFichas, medirFichas } from '../lib/flipOrder.js';
import { currentStreak } from '../lib/rachas.js';
import Reloj from './Reloj.jsx';
import RachaPill from './RachaPill.jsx';
import StarButton from './StarButton.jsx';

// Cuantas rondas, de Ajustes. Antes eran ocho fijas.
const RONDAS_POR_DEFECTO = 8;

function revuelve(letras) {
  const x = [...letras];
  for (let k = x.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [x[k], x[j]] = [x[j], x[k]];
  }
  return x;
}

// Reparte las letras de una palabra y se asegura de que NO salga ya resuelta.
function trocear(palabra) {
  const letras = palabra.split('').map((ch, i) => ({ id: i, ch }));
  let out = revuelve(letras);
  let intentos = 0;
  while (out.map((l) => l.ch).join('') === palabra && intentos < 20) {
    out = revuelve(letras);
    intentos++;
  }
  return out;
}

export default function WortsalatGame({ deck, cartasFijas, onExit, onFinish }) {
  const activa = useExerciseActive();
  const fox = useFox();
  // Solo palabras de una pieza: los anagramas de frases enteras no tienen gracia.
  const rondas = getSettings().sessionSize || RONDAS_POR_DEFECTO;
  const cards = useMemo(() => {
    // Repitiendo los fallos: exactamente esas y en ese orden. Ya pasaron el
    // filtro de forma la primera vez, asi que no hay que volver a colarlas.
    if (cartasFijas && cartasFijas.length) return cartasFijas;
    const todas = pickCards(deck, rondas * 3)
      .filter((c) => {
        const limpio = String(c.de).replace(/^(der|die|das)\s+/i, '').trim();
        return /^[A-Za-zÄÖÜäöüß-]{4,14}$/.test(limpio);
      })
      .slice(0, rondas);
    return todas;
  }, [deck, rondas, cartasFijas]);

  const [idx, setIdx] = useState(0);
  const [letras, setLetras] = useState([]);
  const [sel, setSel] = useState(null);
  const dragRef = useRef(null);
  const [dragging, setDragging] = useState(null);
  const [destino, setDestino] = useState(null);
  const ignoreNextClick = useRef(false);
  const boxRef = useRef(null);
  const posicionesAntes = useRef(null);
  const destinoRef = useRef(null);
  const [resuelto, setResuelto] = useState(false);
  const [rendido, setRendido] = useState(false);
  const selRef = useRef(null);
  const results = useRef([]);
  const monedas = useRef(0); // lo ganado en esta tanda, para el resumen
  // Aciertos seguidos, como en el resto de juegos.
  const [seguidas] = useState(() => currentStreak());
  const started = useRef(Date.now());

  const card = cards[idx];
  const objetivo = card ? String(card.de).replace(/^(der|die|das)\s+/i, '').trim() : '';
  const articulo = card ? (String(card.de).match(/^(der|die|das)\s+/i)?.[1] || '') : '';

  const pistasUsadas = 0;
  const showShortcuts = getSettings().showShortcuts !== false;

  function prepararAnimacion() {
    posicionesAntes.current = medirFichas(boxRef.current, '.ws-letter');
  }

  useLayoutEffect(() => {
    const anteriores = posicionesAntes.current;
    posicionesAntes.current = null;
    animarFichas(boxRef.current, '.ws-letter', anteriores);
  }, [letras]);

  useEffect(() => {
    if (!card) return;
    setLetras(trocear(objetivo));
    setSel(null);
    selRef.current = null;
    setResuelto(false);
    setRendido(false);
    dragRef.current = null;
    setDragging(null);
    destinoRef.current = null;
    setDestino(null);
  }, [idx, card]);

  useEffect(() => {
    function mover(e) {
      const d = dragRef.current;
      if (!d || d.pointerId !== e.pointerId) return;
      if (!d.movido && Math.hypot(e.clientX - d.x, e.clientY - d.y) >= 6) {
        d.movido = true;
        setDragging({ id: d.id, ch: d.ch, x: e.clientX, y: e.clientY, dx: d.dx, dy: d.dy, w: d.w, h: d.h });
        return;
      }
      if (!d.movido) return;
      setDragging((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev);
      const nodes = [...(boxRef.current?.querySelectorAll('.ws-letter') || [])];
      let best = 0;
      let bestDistance = Infinity;
      nodes.forEach((node, i) => {
        if (i === d.from) return;
        const r = node.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const distance = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (distance < bestDistance) {
          bestDistance = distance;
          best = e.clientX > cx ? i + 1 : i;
        }
      });
      destinoRef.current = best;
      setDestino(best);
    }
    function soltar(e) {
      const d = dragRef.current;
      if (!d || d.pointerId !== e.pointerId) return;
      dragRef.current = null;
      setDragging(null);
      setDestino(null);
      if (!d.movido) return;
      ignoreNextClick.current = true;
      setTimeout(() => { ignoreNextClick.current = false; }, 0);
      const where = destinoRef.current;
      destinoRef.current = null;
      setSel(null);
      selRef.current = null;
      prepararAnimacion();
      setLetras((ls) => {
        const from = ls.findIndex((l) => l.id === d.id);
        if (from < 0) return ls;
        const moved = ls[from];
        const rest = ls.filter((l) => l.id !== d.id);
        let pos = where == null ? rest.length : where > from ? where - 1 : where;
        pos = Math.max(0, Math.min(pos, rest.length));
        return [...rest.slice(0, pos), moved, ...rest.slice(pos)];
      });
    }
    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', soltar);
    return () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', soltar);
    };
  }, []);

  function comenzarArrastre(e, letra, i) {
    if (resuelto || rendido || e.button > 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id: letra.id, ch: letra.ch, from: i, pointerId: e.pointerId,
      x: e.clientX, y: e.clientY,
      dx: e.clientX - r.left, dy: e.clientY - r.top, w: r.width, h: r.height,
      movido: false
    };
  }

  // Cuántas letras seguidas, desde la primera, están ya en su sitio.
  const bien = useMemo(() => {
    let n = 0;
    while (n < letras.length && letras[n].ch === objetivo[n]) n++;
    return n;
  }, [letras, objetivo]);

  useEffect(() => {
    if (!card || resuelto || rendido) return;
    if (letras.length && bien === objetivo.length) {
      setResuelto(true);
      recordCard(card.de, true, { mode: 'order', peso: 2 });
      // Tienes las letras delante y las colocas: RECONSTRUIR.
      monedas.current += cobrarEjercicio(true, { nivel: RECONSTRUIR, pistas: pistasUsadas });
      results.current.push({ card, ok: true, pistas: pistasUsadas });
      fox.acierto(true);
    }
  }, [bien, letras, resuelto, rendido, pistasUsadas]);

  useEffect(() => {
    if (!resuelto || !activa) return;
    const timer = window.setTimeout(siguiente, 700);
    return () => window.clearTimeout(timer);
  }, [activa, resuelto, idx, cards.length]);

  function tocar(i) {
    if (ignoreNextClick.current) { ignoreNextClick.current = false; return; }
    if (resuelto || rendido) return;
    const prev = selRef.current;
    if (prev === null) { selRef.current = i; setSel(i); return; }
    if (prev === i) { selRef.current = null; setSel(null); return; }
    selRef.current = null;
    setSel(null);
    prepararAnimacion();
    setLetras((ls) => {
      const n = [...ls];
      [n[prev], n[i]] = [n[i], n[prev]];
      return n;
    });
  }

  function rendirse() {
    if (resuelto) return;
    setRendido(true);
    recordCard(card.de, false, { mode: 'order', peso: 2 });
    results.current.push({ card, ok: false });
    fox.acierto(false);
  }

  // Atajos de teclado: 1..9 (y 0) para seleccionar fichas, Enter/Espacio para avanzar, Escape para salir
  const teclasMapa = useMemo(() => {
    if (resuelto || rendido) {
      return { Enter: () => siguiente(), ' ': () => siguiente(), Escape: onExit };
    }
    const m = { Escape: onExit };
    for (let k = 0; k < Math.min(letras.length, 10); k++) {
      const keyStr = k === 9 ? '0' : String(k + 1);
      m[keyStr] = () => tocar(k);
    }
    return m;
  }, [resuelto, rendido, letras.length, onExit]);

  useTeclas(teclasMapa, cards.length > 0);

  function siguiente() {
    if (idx + 1 < cards.length) setIdx(idx + 1);
    else terminar();
  }

  function terminar() {
    const seconds = Math.max(1, Math.round((Date.now() - started.current) / 1000));
    const correct = results.current.filter((r) => r.ok).length;
    const total = results.current.length || cards.length;
    const xp = correct * 8;
    bumpSessions();
    const streak = recordActivity(xp, Date.now() - started.current);
    saveRun({
      topicId: 'vocab:' + deck.id,
      topicName: deck.name,
      mode: 'wortsalat',
      game: 'wortsalat',
      correct,
      total,
      accuracy: total ? Math.round((correct / total) * 100) / 100 : 0,
      seconds,
      xp
    });
    onFinish({
      deck,
      mode: 'wortsalat',
      correct,
      total,
      seconds,
      xp,
      streak,
      monedas: monedas.current,
      missed: results.current.filter((r) => !r.ok).map((r) => ({ de: r.card.de, es: r.card.es }))
    });
  }

  if (!cards.length) {
    return (
      <div className="card center stack">
        <p>{pick('Este mazo no tiene palabras sueltas para jugar al anagrama.',
                 'This deck has no single words to play the anagram game.')}</p>
        <button className="btn-ghost" onClick={onExit}>{pick('Volver', 'Back')}</button>
      </div>
    );
  }

  return (
    <div className="vocab-session">
      <div className="progress-top">
        <button className="btn-ghost" onClick={onExit} title="Salir">✕</button>
        <div className="bar"><span style={{ width: (idx / cards.length) * 100 + '%' }} /></div>
        <span className="timer">{idx + 1}/{cards.length}</span>
      </div>

      <div className="ctx-fila">
        <span className="row ctx-pills-left" style={{ gap: 8, minWidth: 0, flexWrap: 'wrap' }}>
          <span className="pill ctx-tema">{deck.emoji} {deck.name}</span>
          <GameModePill mode="wortsalat" />
        </span>
        <span className="row" style={{ gap: 8 }}>
          {card && <StarButton item={{ ...card, id: 'vocab:' + (card.id || card.de), deckId: deck?.id, lektionId: deck?.lektionId, starMode: 'wortsalat' }} />}
          <RachaPill n={seguidas} />
          <Reloj desde={started.current} />
        </span>
      </div>

      <div className="prompt-label">{pick('Ordena las letras', 'Put the letters in order')}</div>

      <div className="fc-wrap ws-exercise-layout">
        <div className="ws-clue">
          <span className="ws-es">{card._traducible ? tc(card._esBase) : card.es}</span>
          {articulo && <span className="ws-art">{articulo} …</span>}
          <span className="ws-len">{objetivo.length} {pick('letras', 'letters')}</span>
        </div>

        <div ref={boxRef} className={'ws-box' + (resuelto ? ' done' : rendido ? ' fail' : '') + (dragging ? ' arrastrando' : '')}>
          {(rendido ? objetivo.split('').map((ch, i) => ({ id: 'r' + i, ch })) : letras).map((l, i) => {
            let cls = 'ws-letter';
            if (rendido) cls += ' fail';
            else if (i < bien) cls += ' ok';
            if (dragging?.id === l.id) cls += ' fantasma';
            else if (sel === i) cls += ' sel';
            return (
              <React.Fragment key={l.id}>
                {destino === i && dragging && <span className="ws-hueco" style={{ width: dragging.w, height: dragging.h }} aria-hidden="true" />}
                <button
                  className={cls}
                  data-ws-index={i}
                  data-flip-id={l.id}
                  onClick={() => tocar(i)}
                  onPointerDown={(e) => comenzarArrastre(e, l, i)}
                  disabled={resuelto || rendido}
                  style={{ position: 'relative' }}
                  title={showShortcuts ? 'Atajo: ' + (i === 9 ? '0' : i + 1) : undefined}
                >
                  {showShortcuts && !resuelto && !rendido && i < 10 && (
                    <span className="op-tecla" style={{ fontSize: '0.58rem', position: 'absolute', top: 2, right: 3, opacity: 0.75 }}>
                      {i === 9 ? '0' : i + 1}
                    </span>
                  )}
                  {l.ch}
                </button>
              </React.Fragment>
            );
          })}
          {destino != null && destino >= letras.length && dragging && (
            <span className="ws-hueco" style={{ width: dragging.w, height: dragging.h }} aria-hidden="true" />
          )}
        </div>

        {dragging && (
          <div className="ws-flotante" style={{ left: dragging.x - dragging.dx, top: dragging.y - dragging.dy, width: dragging.w, height: dragging.h }}>
            {dragging.ch}
          </div>
        )}

        {!resuelto && !rendido && (
          <>
            <p className="wo-hint muted">
              {sel === null
                ? (showShortcuts
                  ? pick('Toca dos letras (o pulsa sus números) o arrástralas para intercambiarlas. Las verdes ya están en su sitio.',
                         'Tap two letters (or press their numbers), or drag them to swap. Green ones are already in place.')
                  : pick('Toca dos letras para intercambiarlas o arrástralas a su sitio. Las verdes ya están en su sitio.',
                         'Tap two letters to swap them, or drag them into place. Green ones are already in place.'))
                : pick('Ahora toca la letra con la que quieres intercambiarla.',
                       'Now tap the letter you want to swap it with.')}
            </p>
            <button className="btn btn-corregir" onClick={rendirse}>
              {pick('No me sale', 'I give up')}
            </button>
          </>
        )}

        {rendido && (
          <>
            <p className="muted" style={{ marginTop: 4 }}>
              {pick('Era', 'It was')}: <strong style={{ color: 'var(--text)' }}>{card.de}</strong>
            </p>
            <button className="btn-primary" onClick={siguiente}>{pick('Siguiente', 'Next')}</button>
          </>
        )}

      <FoxOverlay fox={fox} racha={seguidas} />
        {resuelto && <>
          <p className="ws-ok">✓ {card.de}</p>
        </>}
      </div>
    </div>
  );
}
