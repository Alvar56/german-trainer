import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SimboloSeccion, SimboloDeContexto } from './IconoMenu.jsx';
import FoxOverlay, { useFox } from './FoxOverlay.jsx';
import GameModePill from './GameModePill.jsx';
import { pick, t } from '../lib/i18n.js';
import { pickCards, recordCard, deckStats } from '../lib/vocab.js';
import { tc } from '../lib/contenido/index.js';
import { recordActivity } from '../lib/streak.js';
import { ganar, monedasDe, RECONSTRUIR } from '../lib/monedas.js';
import { getSettings } from '../lib/settings.js';
import { playAudio } from '../lib/audio.js';
import { bumpSessions } from '../lib/progress.js';
import { saveRun } from '../lib/leaderboard.js';
import { apuntarRespuesta, currentStreak } from '../lib/rachas.js';
import Reloj from './Reloj.jsx';
import RachaPill from './RachaPill.jsx';
import StarButton from './StarButton.jsx';
import PistaRevelable from './PistaRevelable.jsx';
import { useExerciseActive } from '../lib/teclas.js';

// Cuantas palabras, de Ajustes. Antes eran ocho fijas.
const RONDAS_POR_DEFECTO = 8;
const FALLOS_MAX = 6; // los seis trozos del muñeco
const LETRAS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜß';
const HANG_FLIP_SELECTOR = [
  '.hang-layout', '.hang-tablero', '.hang-visual', '.hang-derecha', '.hang-pistas',
  '.hang-pista-item', '.hang-give-up', '.hang-reto', '.hang-palabra', '.hang-teclado'
].join(', ');

// Las tres pistas, de menos a más chivata. Cada una que gastas baja lo que
// paga la palabra, así que pedirlas cuesta algo pero nunca te mata: quedarse
// atascado sin salida no enseña nada.
// El texto se pide al pintar, no aquí: si se guardara ya traducido, cambiar
// de idioma sin recargar dejaría las pistas en el idioma anterior.
const PISTAS = [
  { id: 'art', clave: 'hg.hintArt' },
  { id: 'letra', clave: 'hg.hintLetter' },
  { id: 'es', clave: 'hg.hintEs' }
];

function sinArticulo(de) {
  return String(de).replace(/^(der|die|das)\s+/i, '').trim();
}

function articuloDe(de) {
  return String(de).match(/^(der|die|das)\s+/i)?.[1] || '';
}

// Todo lo que no sea letra (guiones, espacios) va destapado de entrada: no
// tiene ninguna gracia adivinar un guion.
function esLetra(ch) {
  return LETRAS.includes(ch);
}

// En el teclado del ahorcado, A/Ä, O/Ö y U/Ü representan la misma vocal.
function letraBase(ch) {
  return String(ch).toUpperCase().replace(/[ÄÖÜ]/g, (v) => ({ Ä: 'A', Ö: 'O', Ü: 'U' })[v]);
}

function letraUsada(ch, usadas) {
  const base = letraBase(ch);
  return usadas.some((l) => letraBase(l) === base);
}

export default function HangmanGame({ deck, cartasFijas, onExit, onFinish }) {
  const activa = useExerciseActive();
  const fox = useFox();
  const rondas = getSettings().sessionSize || RONDAS_POR_DEFECTO;
  const cards = useMemo(
    () =>
      // Repitiendo los fallos: esas y ya. Pasaron el filtro de forma cuando
      // salieron la primera vez. Se valida otra vez para excluir frases que
      // pudieran venir de una tanda antigua.
      (cartasFijas && cartasFijas.length)
        ? cartasFijas.filter((c) => /^[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß-]{3,15}$/.test(sinArticulo(c.de)))
        :
      pickCards(deck, rondas * 3)
        .filter((c) => {
          const limpio = sinArticulo(c.de);
          return /^[A-Za-zÄÖÜäöüß][A-Za-zÄÖÜäöüß-]{3,15}$/.test(limpio);
        })
        .slice(0, rondas),
    [deck, rondas, cartasFijas]
  );

  const [idx, setIdx] = useState(0);
  const [usadas, setUsadas] = useState([]);
  const [pistas, setPistas] = useState([]);
  const [letraRevelada, setLetraRevelada] = useState('');
  const [estado, setEstado] = useState('jugando');
  const [ganadas, setGanadas] = useState(0);
  const hangmanRef = useRef(null);
  const posicionesAntesDePista = useRef(null);
  const results = useRef([]);
  // La racha de aciertos seguidos: hasta ahora solo la llevaba gramática.
  // Lo que llevas seguidas AHORA, para el rayito de la cabecera. Se
  // contaba desde el principio, pero solo se veia al terminar.
  const [seguidas, setSeguidas] = useState(() => currentStreak());
  const mejorSeguidas = useRef(0);
  const ultimaSeguidas = useRef(null);
  const monedas = useRef(0); // lo ganado en esta tanda, para el resumen
  const started = useRef(Date.now());

  const card = cards[idx];
  const palabra = card ? sinArticulo(card.de).toUpperCase() : '';
  const articulo = card ? articuloDe(card.de) : '';

  const fallos = usadas.filter((l) => !Array.from(palabra).some((ch) => esLetra(ch) && letraBase(ch) === letraBase(l))).length;
  const ganado =
    !!palabra && palabra.split('').every((ch) => !esLetra(ch) || letraUsada(ch, usadas));
  const perdido = fallos >= FALLOS_MAX;

  function recordarPosiciones() {
    const root = hangmanRef.current;
    if (!root || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    posicionesAntesDePista.current = Array.from(root.querySelectorAll(HANG_FLIP_SELECTOR), (element) => {
      const rect = element.getBoundingClientRect();
      // Si se pide otra pista durante el movimiento, guardamos la posición que
      // se ve ahora y dejamos que el siguiente movimiento continúe desde ahí.
      element.getAnimations?.().forEach((animation) => animation.cancel());
      return {
        element,
        parent: element.parentElement?.closest(HANG_FLIP_SELECTOR) || null,
        left: rect.left,
        top: rect.top
      };
    });
  }

  useLayoutEffect(() => {
    const anteriores = posicionesAntesDePista.current;
    posicionesAntesDePista.current = null;
    if (!anteriores) return;

    const desplazamientoPadres = new Map();
    anteriores.forEach(({ element, parent, left, top }) => {
      if (!element.isConnected) return;
      const rect = element.getBoundingClientRect();
      const deltaPadre = desplazamientoPadres.get(parent) || { x: 0, y: 0 };
      const deltaX = left - rect.left;
      const deltaY = top - rect.top;
      // Al animar también los contenedores, restamos el movimiento heredado
      // para que cada nivel recorra solo su propio cambio, sin duplicarlo.
      const x = deltaX - deltaPadre.x;
      const y = deltaY - deltaPadre.y;
      const seMueve = Math.abs(x) >= 1 || Math.abs(y) >= 1;
      const seAnima = seMueve && typeof element.animate === 'function';
      if (seAnima) {
        element.animate(
          [
            { transform: `translate3d(${x}px, ${y}px, 0)` },
            { transform: 'translate3d(0, 0, 0)' }
          ],
          { duration: 560, easing: 'cubic-bezier(.16,1,.3,1)' }
        );
      }
      desplazamientoPadres.set(element, {
        x: deltaPadre.x + (seAnima ? x : 0),
        y: deltaPadre.y + (seAnima ? y : 0)
      });
    });
  }, [pistas]);

  useEffect(() => {
    setUsadas([]);
    setPistas([]);
    setLetraRevelada('');
    setEstado('jugando');
    setGanadas(0);
  }, [idx]);

  // Se cierra la ronda una sola vez, gane o pierda.
  useEffect(() => {
    if (!card || estado !== 'jugando') return;
    if (!ganado && !perdido) return;

    setEstado(ganado ? 'ganado' : 'perdido');
    recordCard(card.de, ganado, { mode: 'hangman', peso: 2 });
    // Adivinas letras sobre una palabra que ya esta ahi: 3 monedas base,
    // menos una por cada pista gastada (suelo de 1 moneda al acertar).
    const premio = ganado ? monedasDe({ nivel: 3, pistas: pistas.length }) : 0;
    playAudio(ganado);
    if (premio > 0) ganar(premio);
    monedas.current += premio;
    setGanadas(premio);
    results.current.push({ card, ok: ganado, pistas: pistas.length });
    const rSeg = apuntarRespuesta(ganado);
    if (rSeg.seguidas > mejorSeguidas.current) mejorSeguidas.current = rSeg.seguidas;
    setSeguidas(rSeg.seguidas);
    ultimaSeguidas.current = rSeg;
    fox.acierto(ganado);
  }, [ganado, perdido, estado, card]);

  // Teclado físico: escribir letras, atajos 1-3 para pistas, Escape para salir.
  useEffect(() => {
    function alPulsar(e) {
      if (!activa) return;
      if (e.key === 'Escape') {
        e.preventDefault();
        onExit();
        return;
      }
      if (estado !== 'jugando') {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          siguiente();
        }
        return;
      }
      if (e.key === 'Enter' || e.key === ' ') {
        // Enter/Espacio rinden la palabra; un botón enfocado conserva su
        // acción accesible de teclado.
        if (e.target instanceof HTMLElement && e.target.closest('button')) return;
        e.preventDefault();
        rendirse();
        return;
      }
      // Pistas con números 1, 2, 3 o atajos Alt+P / ?
      if (e.key === '1' && !pistas.includes(PISTAS[0].id)) {
        e.preventDefault();
        pedirPista(PISTAS[0].id);
        return;
      }
      if (e.key === '2' && !pistas.includes(PISTAS[1].id)) {
        e.preventDefault();
        pedirPista(PISTAS[1].id);
        return;
      }
      if (e.key === '3' && !pistas.includes(PISTAS[2].id)) {
        e.preventDefault();
        pedirPista(PISTAS[2].id);
        return;
      }
      if (
        ((e.ctrlKey || e.altKey) && (e.key === 'p' || e.key === 'P' || e.key === 'h' || e.key === 'H')) ||
        e.key === '?'
      ) {
        e.preventDefault();
        const sig = PISTAS.find((p) => !pistas.includes(p.id));
        if (sig) pedirPista(sig.id);
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const ch = e.key.toUpperCase();
      if (LETRAS.includes(ch) && !letraUsada(ch, usadas)) {
        e.preventDefault();
        setUsadas((u) => [...u, ch]);
      }
    }
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [activa, estado, usadas, idx, pistas]);

  function probar(l) {
    if (estado !== 'jugando' || letraUsada(l, usadas)) return;
    setUsadas((u) => [...u, l]);
  }

  function pedirPista(id) {
    if (estado !== 'jugando' || pistas.includes(id)) return;
    recordarPosiciones();
    if (id === 'letra') {
      // Se descubre una letra que falta en posición aleatoria
      const faltantes = palabra.split('').filter((ch) => esLetra(ch) && !letraUsada(ch, usadas));
      if (faltantes.length) {
        const falta = faltantes[Math.floor(Math.random() * faltantes.length)];
        setLetraRevelada(falta);
        setUsadas((u) => [...u, falta]);
      }
    }
    setPistas((p) => [...p, id]);
  }

  function rendirse() {
    if (estado !== 'jugando') return;
    setUsadas(Array.from(LETRAS));
  }

  function siguiente() {
    fox.sigue();
    if (idx + 1 < cards.length) setIdx(idx + 1);
    else terminar();
  }

  function terminar() {
    const seconds = Math.max(1, Math.round((Date.now() - started.current) / 1000));
    const correct = results.current.filter((r) => r.ok).length;
    const total = results.current.length || cards.length;
    const xp = results.current.reduce((s, r) => s + (r.ok ? Math.max(4, 10 - r.pistas * 2) : 0), 0);
    bumpSessions();
    const streak = recordActivity(xp, Date.now() - started.current);
    saveRun({
      topicId: 'vocab:' + deck.id,
      topicName: deck.name,
      mode: 'hangman',
      game: 'hangman',
      correct,
      total,
      accuracy: total ? Math.round((correct / total) * 100) / 100 : 0,
      seconds,
      xp
    });
    onFinish({
      rachaMax: mejorSeguidas.current,
      rachaRecord: ultimaSeguidas.current,
      deck,
      mode: 'hangman',
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
      <div className="stack center">
        <p className="muted">{t('hg.noWords')}</p>
        <button className="btn-primary" onClick={onExit}><span className="fl-atras">←</span> {deck.name}</button>
      </div>
    );
  }

  const acabado = estado !== 'jugando';

  return (
    <div className="stack game hangman-game" ref={hangmanRef}>
      {/* La misma cabecera que los demas ejercicios: salir, la barra de lo que
          llevas y el contador. Aqui faltaba la barra y el contador iba suelto. */}
      <div className="progress-top">
        <button className="btn-ghost" onClick={onExit} title="Salir">✕</button>
        <div className="bar">
          <span style={{ width: (idx / cards.length) * 100 + '%' }} />
        </div>
        <span className="timer">{idx + 1}/{cards.length}</span>
      </div>

      <div className="ctx-fila">
        <span className="row ctx-pills-left" style={{ gap: 8, minWidth: 0, flexWrap: 'wrap' }}>
          <span className="pill ctx-tema"><SimboloSeccion id="vocab" />{deck.name}</span>
          <GameModePill mode="hangman" />
        </span>
        <span className="row" style={{ gap: 8 }}>
          {card && <StarButton item={{ ...card, id: 'vocab:' + (card.id || card.de), deckId: deck?.id, lektionId: deck?.lektionId, starMode: 'hangman' }} />}
          <RachaPill n={seguidas} />
          <Reloj desde={started.current} />
        </span>
      </div>

      <div className="prompt-label hang-enunciado">{t('hg.instruction')}</div>

      <div className="hang-layout">
      <div className="hang-tablero">
        <div className="hang-visual">
          <Horca fallos={fallos} perdido={perdido} />
          <div className="hang-vidas">
            {Array.from({ length: FALLOS_MAX }, (_, i) => (
              <span key={i} className={'hang-vida' + (i < FALLOS_MAX - fallos ? '' : ' ida')} />
            ))}
          </div>
        </div>

        <div className="hang-derecha">
          <div className="hang-pistas">
            {PISTAS.map((p, idxP) => {
              const usada = pistas.includes(p.id);
              const pistaTexto = p.id === 'es'
                ? `«${card._traducible ? tc(card._esBase) : card.es}»`
                : p.id === 'art'
                ? articulo
                  ? t('hg.article', { a: articulo.toLowerCase() })
                  : t('hg.startsWith', { l: palabra[0] })
                : t('hg.revealedLetter', { l: letraRevelada });
              return (
                <PistaRevelable
                  key={`${idx}-${p.id}`}
                  revealed={usada}
                  onReveal={() => pedirPista(p.id)}
                  disabled={acabado}
                  title={`Atajo: ${idxP + 1}`}
                  clueTitle={pistaTexto}
                  className="hang-pista-item pista-revelable--hang"
                  label={<>💡 {t(p.clave)} <span className="op-tecla" style={{ marginLeft: 4 }}>{idxP + 1}</span></>}
                >
                  <span className="hang-pista-txt">{pistaTexto}</span>
                </PistaRevelable>
              );
            })}
          </div>
          {!acabado && (
            <button className="btn-ghost hang-give-up" onClick={rendirse} aria-keyshortcuts="Enter Space">
              {pick('Me rindo', 'Give up')}
              <span className="op-tecla hang-shortcut">{pick('Intro / Espacio', 'Enter / Space')}</span>
            </button>
          )}
        </div>
      </div>

      <div className="hang-reto">
      <div className="hang-palabra">
        {palabra.split('').map((ch, i) =>
          !esLetra(ch) ? (
            <span key={i} className="hang-hueco fijo">{ch === ' ' ? ' ' : ch}</span>
          ) : (
            <span key={i} className={'hang-hueco' + (letraUsada(ch, usadas) ? ' visto' : '')}>
              {letraUsada(ch, usadas) ? ch : ''}
            </span>
          )
        )}
      </div>

      {acabado ? (
        <div className="hang-final">
          <p className={estado === 'ganado' ? 'hang-ok' : 'hang-ko'}>
            {estado === 'ganado' ? '✅ ' + t('hg.won') : '❌ ' + t('hg.wasWord') + ' ' + (articulo ? articulo + ' ' : '')}
            {estado === 'perdido' && <strong>{sinArticulo(card.de)}</strong>}
          </p>
          <p className="muted">{card.de} — {card._traducible ? tc(card._esBase) : card.es}</p>
          {estado === 'ganado' && (
            <p className="muted" style={{ fontSize: '0.86rem' }}>
              {ganadas > 0
                ? '🪙 +' + ganadas
                : t('hg.noCoins')}
              {ganadas > 0 && pistas.length > 0
                ? ' · ' + (pistas.length > 1 ? t('hg.hintsUsed', { n: pistas.length }) : t('hg.oneHint'))
                : ''}
            </p>
          )}
          <button className="btn-primary" onClick={siguiente}>
            {idx + 1 < cards.length ? t('ueb.siguiente') : t('hg.results')}
          </button>
        </div>
      ) : (
        <>
        <div className="hang-teclado">
          {LETRAS.split('').map((l) => {
            const usada = letraUsada(l, usadas);
            const acierto = usada && Array.from(palabra).some((ch) => esLetra(ch) && letraBase(ch) === letraBase(l));
            return (
              <button
                key={l}
                className={'hang-tecla' + (usada ? (acierto ? ' bien' : ' mal') : '')}
                onClick={() => probar(l)}
                disabled={usada}
              >
                {l}
              </button>
            );
          })}
        </div>
        </>
      )}
      </div>
      </div>
      <FoxOverlay fox={fox} mudo={acabado} racha={seguidas} />
    </div>
  );
}

// La horca. El palo está siempre; el muñeco va saliendo a trozos con cada
// fallo, que es lo que te dice de un vistazo cuánto te queda.
function Horca({ fallos, perdido }) {
  const trozo = (n) => (fallos >= n ? 1 : 0);
  return (
    <svg className="hang-svg" viewBox="0 0 90 110" aria-label={`${fallos} de ${FALLOS_MAX} fallos`}>
      <g stroke="var(--text-2)" strokeWidth="4" strokeLinecap="round" fill="none">
        <line x1="8" y1="104" x2="58" y2="104" />
        <line x1="24" y1="104" x2="24" y2="8" />
        <line x1="24" y1="8" x2="64" y2="8" />
        <line x1="64" y1="8" x2="64" y2="20" />
      </g>
      <g
        stroke={perdido ? 'var(--bad)' : 'var(--accent)'}
        strokeWidth="4"
        strokeLinecap="round"
        fill="none"
      >
        {!!trozo(1) && <circle cx="64" cy="31" r="11" />}
        {!!trozo(2) && <line x1="64" y1="42" x2="64" y2="72" />}
        {!!trozo(3) && <line x1="64" y1="50" x2="50" y2="62" />}
        {!!trozo(4) && <line x1="64" y1="50" x2="78" y2="62" />}
        {!!trozo(5) && <line x1="64" y1="72" x2="52" y2="92" />}
        {!!trozo(6) && <line x1="64" y1="72" x2="76" y2="92" />}
      </g>
    </svg>
  );
}
