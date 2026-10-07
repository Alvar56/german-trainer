import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import FoxOverlay, { useFox } from './FoxOverlay.jsx';
import GameModePill from './GameModePill.jsx';
import { t } from '../lib/i18n.js';
import { tc } from '../lib/contenido/index.js';
import { pickCards, recordCard, deckStats } from '../lib/vocab.js';
import { recordActivity } from '../lib/streak.js';
import { ganar, monedasPorTanda } from '../lib/monedas.js';
import { playAudio } from '../lib/audio.js';
import { bumpSessions } from '../lib/progress.js';
import { saveRun } from '../lib/leaderboard.js';
import { useExerciseActive, useTeclas } from '../lib/teclas.js';
import Reloj from './Reloj.jsx';

const PAIRS = 6;
const DE_KEYS = ['1', '2', '3', '4', '5', '6'];
const ES_KEYS = ['q', 'w', 'e', 'r', 't', 'y'];

function shuffle(a) {
  const x = [...a];
  for (let k = x.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [x[k], x[j]] = [x[j], x[k]];
  }
  return x;
}

function elegirParesSinTraduccionesRepetidas(candidatas, maximo, extras = []) {
  const elegidas = [];
  const traducciones = new Set();
  for (const carta of [...shuffle(candidatas || []), ...shuffle(extras || [])]) {
    const traduccion = String(carta?.es || '').normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
    if (!traduccion || traducciones.has(traduccion)) continue;
    traducciones.add(traduccion);
    elegidas.push(carta);
    if (elegidas.length === maximo) break;
  }
  return elegidas;
}

// Emparejar seis parejas aleman <-> castellano.
//
// Nacio para el vocabulario y estaba atado a el: sacaba las cartas con
// pickCards() y apuntaba con recordCard(). Gramatica y Kommunikation tambien
// quieren emparejar -una frase con su hueco y su solucion, una expresion con
// lo que significa-, y duplicar el componente para eso habria sido tener el
// mismo juego escrito tres veces.
//
// Asi que lo que cambia entra por props, y si no vienen se comporta
// exactamente como antes:
//
//   pares      las seis parejas [{ de, es }]; por defecto, del mazo
//   apuntar    (de, acerto) => void; por defecto, recordCard del vocabulario
//   contexto   { id, nombre, emoji, pct } para el marcador y el ranking
export default function MatchGame({ deck, pares, cartasFijas, apuntar, contexto, onExit, onFinish, inline = false, onAnswer }) {
  const activa = useExerciseActive();
  const activaRef = useRef(activa);
  activaRef.current = activa;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;
  const pendingFinish = useRef(null);
  const inlineAnswerReported = useRef(false);
  const fox = useFox();
  const ctx = contexto || {
    id: 'vocab:' + deck?.id,
    nombre: deck?.name,
    emoji: deck?.emoji,
    // En el ranking el mazo va con prefijo para no confundirlo con un tema de
    // gramatica que se llame igual; en la pastilla de la cabecera, no.
    nombreRanking: 'Vocab · ' + deck?.name,
    pct: () => (deck ? deckStats(deck).pct : null)
  };
  const maxPares = cartasFijas?.length ? Math.min(PAIRS, cartasFijas.length) : PAIRS;
  const round = useMemo(() => {
    const source = cartasFijas?.length
      ? cartasFijas
      : pares?.length
      ? pares
      : pickCards(deck, maxPares);
    const extras = cartasFijas?.length ? [] : (deck?.cards || []);
    const cards = elegirParesSinTraduccionesRepetidas(source, maxPares, extras);
    return {
      cards,
      de: shuffle(cards.map((c, i) => ({ pair: i, text: c.de }))),
      es: shuffle(cards.map((c, i) => ({ pair: i, text: c.es })))
    };
  }, [deck, pares, cartasFijas, maxPares]);
  const paresObjetivo = round.cards.length;

  const [selDe, setSelDe] = useState(null);
  const [selEs, setSelEs] = useState(null);
  const [matched, setMatched] = useState(new Set()); // pair indices
  const [wrong, setWrong] = useState(null); // pair-de, pair-es pair being flashed
  const [mistakes, setMistakes] = useState(0);
  const [failedPairs, setFailedPairs] = useState(new Set());
  const [now, setNow] = useState(Date.now());
  const [lines, setLines] = useState([]);
  const [dragLine, setDragLine] = useState(null);
  const [dragSelection, setDragSelection] = useState(null);
  const dragRef = useRef(null);
  const ignoreNextClick = useRef(false);
  const started = useRef(Date.now());
  const pausaEn = useRef(null);
  const wrapRef = useRef(null);
  const deRefs = useRef({});
  const esRefs = useRef({});
  const done = matched.size === paresObjetivo;

  useLayoutEffect(() => {
    if (!activa) {
      if (pausaEn.current === null) pausaEn.current = Date.now();
      return;
    }
    if (pausaEn.current !== null) {
      started.current += Date.now() - pausaEn.current;
      pausaEn.current = null;
      setNow(Date.now());
    }
  }, [activa]);

  function puntoEnWrap(x, y) {
    const r = wrapRef.current?.getBoundingClientRect();
    return r ? { x: x - r.left, y: y - r.top } : { x: 0, y: 0 };
  }

  // Mantener pulsada una ficha permite dibujar una flecha hasta su pareja.
  // Un toque breve conserva el comportamiento actual de seleccionar fichas.
  useEffect(() => {
    function mover(e) {
      const d = dragRef.current;
      if (!d || d.pointerId !== e.pointerId) return;
      if (!d.movido && Math.hypot(e.clientX - d.x, e.clientY - d.y) >= 7) {
        d.movido = true;
        setDragSelection({ side: d.side, pair: d.pair, targetSide: null, targetPair: null });
      }
      if (!d.movido) return;
      const p = puntoEnWrap(e.clientX, e.clientY);
      setDragLine({ ...d.origin, x2: p.x, y2: p.y });
      const tile = document.elementFromPoint(e.clientX, e.clientY)?.closest('.match-tile');
      const targetSide = tile?.dataset.side;
      const targetPair = tile && targetSide && targetSide !== d.side && !tile.disabled
        ? Number(tile.dataset.pair)
        : null;
      setDragSelection((current) => {
        if (!current || current.targetSide !== (targetPair == null ? null : targetSide) || current.targetPair !== targetPair) {
          return { side: d.side, pair: d.pair, targetSide: targetPair == null ? null : targetSide, targetPair };
        }
        return current;
      });
    }
    function soltar(e) {
      const d = dragRef.current;
      if (!d || d.pointerId !== e.pointerId) return;
      dragRef.current = null;
      setDragLine(null);
      setDragSelection(null);
      if (!d.movido) return;
      ignoreNextClick.current = true;
      setTimeout(() => { ignoreNextClick.current = false; }, 0);
      const tile = document.elementFromPoint(e.clientX, e.clientY)?.closest('.match-tile');
      if (!tile || tile.dataset.side === d.side || tile.disabled === true) return;
      const pair = Number(tile.dataset.pair);
      if (matched.has(d.pair) || matched.has(pair)) return;
      if (d.side === 'de') {
        setSelDe(d.pair);
        setSelEs(pair);
      } else {
        setSelEs(d.pair);
        setSelDe(pair);
      }
    }
    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', soltar);
    return () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', soltar);
    };
  }, [matched]);

  function comenzarArrastre(e, side, pair) {
    if (e.button > 0 || matched.has(pair) || done) return;
    const r = e.currentTarget.getBoundingClientRect();
    const p = puntoEnWrap(side === 'de' ? r.right : r.left, r.top + r.height / 2);
    dragRef.current = {
      side, pair, pointerId: e.pointerId, x: e.clientX, y: e.clientY, movido: false,
      origin: { x1: p.x, y1: p.y, x2: p.x, y2: p.y }
    };
  }

  function clickTile(side, pair) {
    if (ignoreNextClick.current) { ignoreNextClick.current = false; return; }
    if (side === 'de') setSelDe((p) => (p === pair ? null : pair));
    else setSelEs((p) => (p === pair ? null : pair));
  }

  useEffect(() => {
    if (!activa || done) return;
    const t = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(t);
  }, [activa, done]);

  // recolocar las líneas de conexión al cambiar el tamaño de la ventana
  useEffect(() => {
    if (!activa) return undefined;
    const on = () => setNow(Date.now());
    window.addEventListener('resize', on);
    return () => window.removeEventListener('resize', on);
  }, [activa]);

  // comprobar cuando hay uno de cada lado
  useEffect(() => {
    if (selDe == null || selEs == null) return;
    if (selDe === selEs) {
      playAudio(true);
      fox.acierto(true);
      setMatched((m) => new Set([...m, selDe]));
      setSelDe(null);
      setSelEs(null);
    } else {
      playAudio(false);
      fox.acierto(false);
      setMistakes((n) => n + 1);
      setFailedPairs((failed) => new Set([...failed, selDe]));
      setWrong({ de: selDe, es: selEs });
      const t = setTimeout(() => {
        setWrong(null);
        setSelDe(null);
        setSelEs(null);
      }, 480);
      return () => clearTimeout(t);
    }
  }, [selDe, selEs]);

  const mapaTeclas = useMemo(() => {
    if (done) return { Escape: onExit };
    const m = {
      Escape: onExit
    };
    if (inline) {
      m.Enter = () => {
        if (inlineAnswerReported.current || done) return;
        inlineAnswerReported.current = true;
        onAnswer?.(false, pick('No me sale', 'I give up'));
      };
    }
    round.de.forEach((t, i) => {
      if (i < DE_KEYS.length) {
        m[DE_KEYS[i]] = () => {
          // Una cifra primero selecciona la ficha alemana de esa posición.
          // Si ya hay una alemana seleccionada, la misma cifra (o cualquier
          // otra) selecciona la ficha inglesa de esa posición: 1, 1 conecta
          // la primera tarjeta de cada columna.
          if (selDe != null && selEs == null) {
            const destino = round.es[i];
            if (destino && !matched.has(destino.pair)) setSelEs(destino.pair);
          } else if (!matched.has(t.pair)) {
            setSelDe((p) => (p === t.pair ? null : t.pair));
          }
        };
      }
    });
    round.es.forEach((t, i) => {
      if (i < ES_KEYS.length) {
        const k = ES_KEYS[i];
        const fn = () => {
          if (!matched.has(t.pair)) setSelEs((p) => (p === t.pair ? null : t.pair));
        };
        m[k] = fn;
        m[k.toUpperCase()] = fn;
      }
    });
    return m;
  }, [done, inline, matched, onAnswer, round, selDe, selEs]);

  useTeclas(mapaTeclas, true);

  // dibujar las líneas de conexión de las parejas resueltas
  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;
    const wr = wrap.getBoundingClientRect();
    const next = [];
    matched.forEach((p) => {
      const d = deRefs.current[p];
      const e = esRefs.current[p];
      if (!d || !e) return;
      const dr = d.getBoundingClientRect();
      const er = e.getBoundingClientRect();
      next.push({
        x1: dr.right - wr.left,
        y1: dr.top + dr.height / 2 - wr.top,
        x2: er.left - wr.left,
        y2: er.top + er.height / 2 - wr.top
      });
    });
    setLines(next);
  }, [matched, now]);

  useEffect(() => {
    if (!activa || !pendingFinish.current) return;
    const timer = setTimeout(() => {
      const result = pendingFinish.current;
      pendingFinish.current = null;
      if (result) onFinishRef.current(result);
    }, 800);
    return () => clearTimeout(timer);
  }, [activa]);

  useEffect(() => {
    if (!inline || !done || !activa || inlineAnswerReported.current) return;
    inlineAnswerReported.current = true;
    round.cards.forEach((c, i) => apuntar?.(c.de, !failedPairs.has(i)));
    onAnswer?.(mistakes === 0, `${paresObjetivo}/${paresObjetivo} · ${mistakes} ${t('mg.fallos')}`);
  }, [inline, done, activa, round.cards, failedPairs, apuntar, onAnswer, mistakes, paresObjetivo]);

  useEffect(() => {
    if (!done || inline) return;
    const seconds = Math.max(1, Math.round((Date.now() - started.current) / 1000));
    round.cards.forEach((c, i) => {
      if (apuntar) apuntar(c.de, !failedPairs.has(i));
      else recordCard(c.de, !failedPairs.has(i), { mode: 'match', peso: 2 });
    });
    const xp = Math.max(10, 40 - mistakes * 4 - Math.floor(seconds / 6));
    bumpSessions();
    // aqui no hay respuesta a respuesta que cobrar: se paga la partida entera
    // Una pareja que se intentó mal no vuelve a dar premio al corregirla.
    const monedas = monedasPorTanda({ aciertos: paresObjetivo - failedPairs.size });
    if (monedas > 0) ganar(monedas);
    const streak = recordActivity(xp, Date.now() - started.current);
    // total = parejas + fallos, no parejas a secas. Aciertas las seis SIEMPRE
    // -la tanda no acaba hasta que estan todas-, asi que lo que mide cuanto
    // sabes es cuantos intentos te ha costado. Con total = 6 el juego salia al
    // 100% en las estadisticas por muchos fallos que hicieras.
    saveRun({
      topicId: ctx.id,
      topicName: ctx.nombreRanking || ctx.nombre,
      mode: 'match',
      game: 'match',
      correct: paresObjetivo,
      total: paresObjetivo + mistakes,
      accuracy: paresObjetivo / (paresObjetivo + mistakes),
      seconds,
      xp
    });
    const missed = [...failedPairs].map((pair) => round.cards[pair]).filter(Boolean);
    const result = { deck, mode: 'match', seconds, mistakes, xp, streak, monedas, correct: paresObjetivo, total: paresObjetivo, missed };
    const timer = setTimeout(() => {
      if (activaRef.current) onFinishRef.current(result);
      else pendingFinish.current = result;
    }, 800);
    return () => clearTimeout(timer);
  }, [done]);

  function clsFor(pair, side) {
    let c = 'match-tile ' + side;
    const selectedByDrag = dragSelection && (
      (dragSelection.side === side && dragSelection.pair === pair) ||
      (dragSelection.targetSide === side && dragSelection.targetPair === pair)
    );
    if (matched.has(pair)) c += ' matched';
    else if (selectedByDrag || (side === 'de' ? selDe : selEs) === pair) c += ' sel';
    else if (wrong && wrong[side] === pair) c += ' wrong';
    return c;
  }

  return (
    <div className={'vocab-session match-game' + (inline ? ' match-inline' : '')}>
      <div className="progress-top">
        <button className="btn-ghost" onClick={onExit} title="Salir">✕</button>
        <div className="bar"><span style={{ width: (matched.size / paresObjetivo) * 100 + '%' }} /></div>
        <span className="timer">{matched.size}/{paresObjetivo}</span>
      </div>

      {/* La misma fila que el resto de ejercicios: de que mazo va la tanda a la
          izquierda y, a la derecha, lo que aqui hace de marcador -el reloj, que
          es contrarreloj, y los fallos-. */}
      <div className="ctx-fila">
        <span className="row ctx-pills-left" style={{ gap: 8, minWidth: 0, flexWrap: 'wrap' }}>
          <span className="pill ctx-tema">{ctx.emoji} {ctx.nombre}</span>
          <GameModePill mode="match" />
        </span>
        <span className="row" style={{ gap: 8 }}>
          <Reloj desde={started.current} parado={done} />
        </span>
      </div>

      <div className="prompt-label" style={{ marginBottom: 14 }}>
        {t('mg.como')}
      </div>
      <div className={'match-cols' + (selDe != null && selEs == null ? ' buscando-traduccion' : '')} ref={wrapRef}>
        <svg className="match-lines">
          {lines.map((l, i) => (
            <line key={i} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} />
          ))}
          {dragLine && <line className="match-drag-line" x1={dragLine.x1} y1={dragLine.y1} x2={dragLine.x2} y2={dragLine.y2} />}
        </svg>

        <div className="match-col">
          <div className="match-col-head">Deutsch</div>
          {round.de.map((t, idxDe) => (
            <button
              key={t.pair}
              ref={(el) => (deRefs.current[t.pair] = el)}
              className={clsFor(t.pair, 'de')}
              data-side="de"
              data-pair={t.pair}
              onPointerDown={(e) => comenzarArrastre(e, 'de', t.pair)}
              style={{ touchAction: 'none' }}
              disabled={matched.has(t.pair) || done}
              onClick={() => clickTile('de', t.pair)}
              title={`Atajo: ${DE_KEYS[idxDe]}`}
            >
              {!matched.has(t.pair) && idxDe < DE_KEYS.length && (
                <span className="op-tecla" style={{ marginRight: 6 }}>{DE_KEYS[idxDe]}</span>
              )}
              {t.text}
            </button>
          ))}
        </div>

        <div className="match-col">
          <div className="match-col-head">{t('mg.colEs')}</div>
          {round.es.map((t, idxEs) => (
            <button
              key={t.pair}
              ref={(el) => (esRefs.current[t.pair] = el)}
              className={clsFor(t.pair, 'es')}
              data-side="es"
              data-pair={t.pair}
              onPointerDown={(e) => comenzarArrastre(e, 'es', t.pair)}
              style={{ touchAction: 'none' }}
              disabled={matched.has(t.pair) || done}
              onClick={() => clickTile('es', t.pair)}
              title={`Atajo: ${ES_KEYS[idxEs]?.toUpperCase()}`}
            >
              {!matched.has(t.pair) && idxEs < ES_KEYS.length && (
                <span className="op-tecla" style={{ marginRight: 6 }}>{ES_KEYS[idxEs].toUpperCase()}</span>
              )}
              {round.cards[t.pair]?._traducible ? tc(round.cards[t.pair]._esBase) : t.text}
            </button>
          ))}
        </div>
      </div>
      <div className="match-error-count">✗ {mistakes} {t('mg.fallos')}</div>

      {!inline && <FoxOverlay fox={fox} className="fox-overlay-match" />}
      {done && <p className="center" style={{ marginTop: 18, fontWeight: 700 }}>{t('mg.done')}</p>}
    </div>
  );
}
