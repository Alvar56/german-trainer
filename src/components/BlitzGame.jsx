import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { SimboloSeccion, SimboloDeContexto } from './IconoMenu.jsx';
import FoxOverlay, { useFox } from './FoxOverlay.jsx';
import GameModePill from './GameModePill.jsx';
import { recordCard, deckStats } from '../lib/vocab.js';
import { tc } from '../lib/contenido/index.js';
import { recordActivity } from '../lib/streak.js';
import { cobrarEjercicio, RECONOCER, ganar } from '../lib/monedas.js';
import { bumpSessions } from '../lib/progress.js';
import { saveRun } from '../lib/leaderboard.js';
import { pick } from '../lib/i18n.js';
import { apuntarRespuesta } from '../lib/rachas.js';
import { useExerciseActive, useTeclas, teclasDeOpciones } from '../lib/teclas.js';

// Medio minuto en Vocabulario, donde la pregunta es una palabra y se lee de
// un vistazo. Gramatica y Kommunikation piden mas: ahi hay que leer una frase
// entera antes de poder elegir, asi que pasan un minuto.
const SEGUNDOS = 30;
const OBJETIVO = 10;
// Segundos que regala un acierto (+2s).
const BONO = 2;

function revuelve(a) {
  const x = [...a];
  for (let k = x.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [x[k], x[j]] = [x[j], x[k]];
  }
  return x;
}

// Contrarreloj: treinta segundos para acertar diez.
//
// Nacio para el vocabulario y estaba atado a el. Gramatica y Kommunikation lo
// quieren tambien, y duplicar el componente seria tener el mismo reloj escrito
// tres veces. Asi que lo que cambia entra por props y, si no vienen, se
// comporta exactamente como antes:
//
//   cartas     las parejas [{ de, es }] que se preguntan; por defecto, el mazo
//   apuntar    (de, acerto) => void; por defecto, recordCard del vocabulario
//   contexto   { id, nombre, emoji, pct } para el marcador y el ranking
//   bono       segundos que suma cada acierto
export default function BlitzGame({ deck, cartas, apuntar, contexto, cartasFijas, segundos = SEGUNDOS, bono = BONO, onExit, onFinish }) {
  const activa = useExerciseActive();
  const fox = useFox();
  const ctx = contexto || {
    id: 'vocab:' + deck?.id,
    nombre: deck?.name,
    emoji: deck?.emoji,
    pct: () => (deck ? deckStats(deck).pct : null)
  };
  // Sube a cada reinicio. Entra en las dependencias del barajado para que al
  // volver a empezar no salgan las mismas preguntas en el mismo orden.
  const [ronda, setRonda] = useState(0);
  // `pool` es de donde salen los DESPISTES y sigue siendo la lista entera:
  const base = cartas || deck?.cards || [];
  const pool = useMemo(() => (base.length >= 4 ? revuelve(base) : []), [base, ronda]);
  // Y esto es lo que se PREGUNTA: el mazo barajado, o solo lo que fallaste.
  const preguntas = useMemo(
    () => ((cartasFijas && cartasFijas.length) ? cartasFijas : pool),
    [pool, cartasFijas]
  );
  const [i, setI] = useState(0);
  const [seg, setSeg] = useState(segundos);
  const [aciertos, setAciertos] = useState(0);
  const [racha, setRacha] = useState(0);
  const [mejorRacha, setMejorRacha] = useState(0);
  const [marcado, setMarcado] = useState(null); // { elegido, correcto }
  const [avisoBono, setAvisoBono] = useState(0); // el "+3s" que sale y se va
  const results = useRef([]);
  const timerEspera = useRef(null);
  const timerBono = useRef(null);
  const pausaEn = useRef(null);
  const mejorSeguidas = useRef(0);
  const ultimaSeguidas = useRef(null);
  const monedas = useRef(0);
  const started = useRef(Date.now());
  const ganado = aciertos >= OBJETIVO;
  const acabado = seg <= 0 || ganado;

  useLayoutEffect(() => {
    if (!activa) {
      if (pausaEn.current === null) pausaEn.current = Date.now();
      return;
    }
    if (pausaEn.current !== null) {
      started.current += Date.now() - pausaEn.current;
      pausaEn.current = null;
    }
  }, [activa]);

  // reloj
  useEffect(() => {
    if (!activa || acabado) return;
    const t = setInterval(() => setSeg((s) => Math.max(0, s - 1)), 1000);
    return () => clearInterval(t);
  }, [activa, acabado]);

  useEffect(() => {
    if (!activa || !acabado) return;
    const t = setTimeout(terminar, 500);
    return () => clearTimeout(t);
  }, [activa, acabado]);

  useEffect(() => {
    if (!activa || !marcado || acabado) return;
    timerEspera.current = setTimeout(avanzar, marcado.correcto ? 280 : 750);
    return () => clearTimeout(timerEspera.current);
  }, [activa, marcado, acabado]);

  const card = preguntas.length > 0 ? preguntas[i % preguntas.length] : null;
  // 3 opciones: la buena y dos distractores del mismo mazo
  const opciones = useMemo(() => {
    if (!card) return [];
    const otras = revuelve(pool.filter((c) => c.es !== card.es)).slice(0, 2);
    return revuelve([card, ...otras]);
  }, [card, pool]);

  function avanzar() {
    clearTimeout(timerEspera.current);
    if (typeof document !== 'undefined' && document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    setMarcado(null);
    setI((n) => n + 1);
  }

  function reiniciar() {
    clearTimeout(timerEspera.current);
    clearTimeout(timerBono.current);
    if (typeof document !== 'undefined' && document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    setMarcado(null);
    setAvisoBono(0);
    setI(0);
    setSeg(segundos);
    setAciertos(0);
    setRacha(0);
    setMejorRacha(0);
    results.current = [];
    mejorSeguidas.current = 0;
    ultimaSeguidas.current = null;
    monedas.current = 0;
    started.current = Date.now();
    setRonda((n) => n + 1);
  }

  useTeclas({ Escape: onExit, r: reiniciar, R: reiniciar }, activa);

  // Atajos de teclado: 1, 2, 3 para responder; Enter o Espacio para saltar la espera
  useTeclas({
    ...teclasDeOpciones(opciones, (op) => responder(op))
  }, activa && !marcado && !acabado);

  useTeclas({
    Enter: avanzar,
    ' ': avanzar
  }, activa && !!marcado && !acabado);

  function responder(op) {
    if (marcado || acabado) return;
    if (typeof document !== 'undefined' && document.activeElement && document.activeElement.blur) {
      document.activeElement.blur();
    }
    const ok = op.es === card.es;
    setMarcado({ elegido: op.es, correcto: ok });
    const rSeg = apuntarRespuesta(ok);
    if (rSeg.seguidas > mejorSeguidas.current) mejorSeguidas.current = rSeg.seguidas;
    ultimaSeguidas.current = rSeg;
    fox.acierto(ok);
    if (apuntar) apuntar(card.de, ok);
    else recordCard(card.de, ok);
    monedas.current += cobrarEjercicio(ok, { nivel: RECONOCER });
    results.current.push({ card, ok });

    if (ok) {
      setAciertos((n) => n + 1);
      // Acertar alarga el reloj. Va en forma de funcion porque el tic del
      // intervalo puede caer en el mismo lote que esto y los dos tienen que
      // contar: si se pusiera `seg + bono` se perderia el segundo del tic.
      if (bono > 0) {
        setSeg((s) => s + bono);
        setAvisoBono(bono);
        clearTimeout(timerBono.current);
        timerBono.current = setTimeout(() => setAvisoBono(0), 900);
      }
      setRacha((r) => {
        const nueva = r + 1;
        setMejorRacha((m) => Math.max(m, nueva));
        return nueva;
      });
    } else {
      // Los fallos restan 1 al total score de aciertos y 2 segundos al reloj
      setAciertos((n) => Math.max(0, n - 1));
      setRacha(0);
      setSeg((s) => Math.max(0, s - 2));
      setAvisoBono(-2);
      clearTimeout(timerBono.current);
      timerBono.current = setTimeout(() => setAvisoBono(0), 900);
    }

  }

  // Al salir a media partida los dos temporizadores seguian vivos y llamaban a
  // setState sobre un componente ya desmontado.
  useEffect(() => () => {
    clearTimeout(timerEspera.current);
    clearTimeout(timerBono.current);
  }, []);

  function terminar() {
    clearTimeout(timerEspera.current);
    clearTimeout(timerBono.current);
    const seconds = Math.max(1, Math.round((Date.now() - started.current) / 1000));
    const total = results.current.length;
    const correct = aciertos;
    const esGanado = aciertos >= OBJETIVO;
    if (esGanado) {
      ganar(5);
      monedas.current += 5;
    }
    const xp = Math.max(2, correct * 5 + (esGanado ? 20 : 0) + mejorRacha * 2);
    bumpSessions();
    const streak = recordActivity(xp, Date.now() - started.current);
    saveRun({
      topicId: ctx.id,
      topicName: ctx.nombre,
      mode: 'blitz',
      game: 'blitz',
      correct,
      total: Math.max(total, OBJETIVO),
      accuracy: total ? Math.round((results.current.filter((r) => r.ok).length / total) * 100) / 100 : 0,
      seconds,
      xp
    });
    onFinish({
      rachaMax: mejorSeguidas.current,
      rachaRecord: ultimaSeguidas.current,
      deck,
      mode: 'blitz',
      correct,
      total: OBJETIVO,
      ganado: esGanado,
      seconds,
      xp,
      streak,
      monedas: monedas.current,
      mejorRacha,
      missed: results.current.filter((r) => !r.ok).map((r) => ({ de: r.card.de, es: r.card.es }))
    });
  }

  if (!preguntas.length) {
    return (
      <div className="card center stack">
        <p>{pick('Este mazo necesita al menos 4 tarjetas para el contrarreloj.',
                 'This deck needs at least 4 cards for the time trial.')}</p>
        <button className="btn-ghost" onClick={onExit}>{pick('Volver', 'Back')}</button>
      </div>
    );
  }

  if (acabado) {
    return (
      <div className="vocab-session">
        <div className="card center stack">
          <p style={{ fontSize: '1.2rem', fontWeight: 600, color: ganado ? 'var(--good)' : 'var(--text)' }}>
            {ganado ? pick('¡Objetivo conseguido! 🎯 (10/10)', 'Goal achieved! 🎯 (10/10)') : pick('¡Tiempo agotado!', 'Time out!')}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="vocab-session">
      <div className="progress-top">
        <button className="btn-ghost ses-icon-btn" onClick={onExit} title="Salir (Esc)">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
        <button className="btn-ghost ses-icon-btn blitz-reset" onClick={reiniciar} title={pick('Empezar de nuevo (R)', 'Start over (R)')}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M4 16a9 9 0 1 0 1.64-11.36L3 8" />
            <path d="M3 3v5h5" />
          </svg>
        </button>
        {/* Tope al 100%: ahora acertar suma segundos y el reloj puede pasar
            del tiempo de salida, con lo que la barra se saldria del carril. */}
        <div className="bar"><span style={{ width: Math.min(100, (seg / segundos) * 100) + '%' }} /></div>
        <span className={'timer blitz-timer' + (seg <= 5 ? ' urgente' : '')}>
          {seg}s
          {avisoBono !== 0 && (
            <span key={seg + '-' + avisoBono} className={'blitz-bono' + (avisoBono < 0 ? ' penal' : '')}>
              {avisoBono > 0 ? `+${avisoBono}s` : `${avisoBono}s`}
            </span>
          )}
        </span>
      </div>

      <div className="ctx-fila">
        <span className="row ctx-pills-left" style={{ gap: 8, minWidth: 0, flexWrap: 'wrap' }}>
          <span className="pill ctx-tema"><SimboloDeContexto emoji={ctx.emoji} />{ctx.nombre}</span>
          <GameModePill mode="blitz" />
        </span>
        <span className="row" style={{ gap: 8 }}>
          <span className="pill" style={{ fontWeight: 600 }}>✓ {aciertos} / {OBJETIVO}</span>
          {racha >= 3 && <span className="pill blitz-racha">🔥 {racha}</span>}
        </span>
      </div>

      <div className="fc-wrap">
        <div className="blitz-word">{card.de}</div>

        <div className="blitz-opts">
          {opciones.map((op, k) => {
            let cls = 'blitz-opt';
            if (marcado) {
              if (op.es === card.es) cls += ' ok';
              else if (op.es === marcado.elegido) cls += ' ko';
              else cls += ' dim';
            }
            return (
              <button
                key={`${card.de}-${op.es}-${k}`}
                className={cls}
                onClick={() => responder(op)}
                disabled={!!marcado}
              >
                <span className="op-tecla">{k + 1}</span>
                {op._traducible ? tc(op._esBase) : op.es}
              </button>
            );
          })}
        </div>

        <p className="wo-hint muted">
          {pick(`Objetivo: ${OBJETIVO} aciertos en ${segundos}s · Acertar suma ${bono}s · Fallar resta 1 punto y 2s · Atajos: 1, 2, 3, Esc`,
                `Goal: ${OBJETIVO} correct in ${segundos}s · Each correct adds ${bono}s · Mistakes subtract 1 point and 2s · Keys: 1, 2, 3, Esc`)}
        </p>
      <FoxOverlay fox={fox} racha={racha} />
      </div>
    </div>
  );
}
