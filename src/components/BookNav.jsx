import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { BAENDE, getLektion, lektionLabel } from '../lib/kursbuch/index.js';
import { lektionProgress, bandProgress } from '../lib/lektionProgress.js';
import { pick, t } from '../lib/i18n.js';
import { storage } from '../lib/storage.js';

// Navegador común de las secciones del libro: pestañas de tomo + rejilla de
// lecciones. `count(lektion)` devuelve el número que se muestra en cada tarjeta;
// las lecciones sin contenido de esta sección no se listan.
// `progressKey` dice qué porcentaje mostrar: 'woerter', 'grammatik' o 'total'.
export default function BookNav({ title, subtitle, count, unit, onOpen, extra, antes, progressKey = 'total' }) {
  // El tomo elegido se recuerda, y ademas entre secciones: estas con A1.1 en
  // Wortschatz, pasas a Grammatik y sigues en A1.1. Antes cada pantalla
  // arrancaba en A2.1 -que era el tomo en curso escrito a mano-, asi que
  // cambiar de seccion te devolvia alli una y otra vez.
  //
  // Es uno solo para las tres: si estas repasando A1.1, lo estas repasando
  // entero, no el vocabulario de A1.1 y la gramatica de A2.1.
  const [band, setBandLocal] = useState(() => storage.get('ui:band', 'a21'));
  const [transition, setTransition] = useState(null);
  const [stageHeight, setStageHeight] = useState(null);
  const stageRef = useRef(null);
  const incomingRef = useRef(null);
  const transitionTimer = useRef(null);
  const transitionId = useRef(0);
  const setBand = (id) => {
    if (id === band) return;
    const from = BAENDE.findIndex((b) => b.id === band);
    const to = BAENDE.findIndex((b) => b.id === id);
    if (from < 0 || to < 0) return;
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
    const alturaActual = stageRef.current?.getBoundingClientRect().height;
    setStageHeight(alturaActual || null);
    setTransition({
      id: ++transitionId.current,
      from: band,
      direction: to > from ? 'forward' : 'backward'
    });
    setBandLocal(id);
    storage.set('ui:band', id);
  };

  // Mantiene visibles la lista anterior y la nueva durante el cambio: una
  // sale por un lado mientras la otra entra por el contrario. El marco anima
  // su alto tambien, para que las tarjetas de la lista entrante tengan sitio.
  useLayoutEffect(() => {
    if (!transition) return undefined;
    const frame = requestAnimationFrame(() => {
      const altoNuevo = incomingRef.current?.scrollHeight;
      if (altoNuevo != null) setStageHeight(altoNuevo);
    });
    const reducedMotion = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    transitionTimer.current = setTimeout(() => {
      setTransition(null);
      setStageHeight(null);
      transitionTimer.current = null;
    }, reducedMotion ? 40 : 1500);
    return () => {
      cancelAnimationFrame(frame);
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    };
  }, [band, transition]);

  useEffect(() => () => {
    if (transitionTimer.current) clearTimeout(transitionTimer.current);
  }, []);

  const renderBand = (bandId) => {
    const selectedBand = BAENDE.find((b) => b.id === bandId) || BAENDE[0];
    const lektionen = selectedBand.lektionen
      .map((l) => getLektion(l.id))
      .filter((l) => l && count(l) > 0);
    if (lektionen.length === 0) {
      return (
        <div className="card center">
          <p className="muted">
            {pick(
              'Este tomo todavía no tiene contenido en esta sección.',
              'This volume has no content in this section yet.'
            )}
          </p>
        </div>
      );
    }
    return (
      <div className="topic-grid">
        {lektionen.map((l) => {
          const n = count(l);
          const prog = lektionProgress(l);
          const pct = prog ? prog[progressKey] : null;
          if (pct != null && pct >= 100) {
          }
          if (prog?.total != null && prog.total >= 100) {
          }
          const ancha = l.nr === 'Start';
          const barra = pct == null ? null : (
            <div className="mini-bar lk-bar">
              <span
                style={{
                  width: pct + '%',
                  background: pct >= 100 ? 'var(--good)' : 'var(--accent)'
                }}
              />
            </div>
          );
          return (
            <button
              key={l.id}
              className={'card topic-open lk-card' + (ancha ? ' lk-card-ancha' : '')}
              onClick={() => onOpen(l)}
            >
              <div className="row spread">
                <div className="flex-min">
                  <div className="t-title">{lektionLabel(l)}</div>
                  <div className="t-blurb">{n} {n === 1 ? unit[0] : unit[1]}</div>
                </div>
                {ancha && barra}
                {pct != null && (
                  <span className={'lk-pct' + (pct >= 100 ? ' dominado' : pct > 0 ? ' medio' : '')}>
                    {pct >= 100 && <span className="lk-corona">👑</span>}
                    {pct}%
                  </span>
                )}
                <span className="chev">›</span>
              </div>
              {!ancha && barra}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <div className="wide">
      <div className="page-head">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="band-tabs">
        {BAENDE.map((b) => {
          const p = bandProgress(b);
          return (
            <button
              key={b.id}
              className={'band-tab' + (band === b.id ? ' on' : '')}
              onClick={() => setBand(b.id)}
            >
              <strong>{b.name}</strong>
              <small>{p}%</small>
              <span className="band-bar"><span style={{ width: p + '%' }} /></span>
            </button>
          );
        })}
        <button className="band-tab" disabled style={{ opacity: 0.5, cursor: 'default', background: 'transparent', borderColor: 'var(--border)' }}>
          <strong>A2.2</strong>
          <small>{pick('Próximamente', 'Coming soon')}</small>
        </button>
      </div>

      <div
        ref={stageRef}
        className={'book-band-stage' + (transition ? ' is-sliding' : '')}
        style={transition && stageHeight != null ? { height: `${stageHeight}px` } : undefined}
      >
        {transition && (
          <div
            key={`leaving-${transition.id}`}
            className={`book-band-panel is-exiting exit-${transition.direction}`}
            aria-hidden="true"
            inert=""
          >
            {renderBand(transition.from)}
          </div>
        )}
        <div
          key={`current-${band}`}
          ref={transition ? incomingRef : null}
          className={'book-band-panel' + (transition ? ` is-entering enter-${transition.direction}` : '')}
        >
          {renderBand(band)}
        </div>
      </div>

      {/* El juego de la seccion: debajo de las lecciones, porque no es de
          ninguna en concreto pero tampoco debe tapar la lista. */}
      {antes}

      {extra}
    </div>
  );
}
