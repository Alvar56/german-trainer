import React, { useEffect, useMemo, useRef, useState } from 'react';
import FoxOverlay, { useFox } from './FoxOverlay.jsx';
import GameModePill from './GameModePill.jsx';
import { t, codigoIdioma } from '../lib/i18n.js';
import { pickKasus, recordKasus, OPCIONES, porEn } from '../lib/kasus.js';
import { useExerciseActive, useTeclas, teclasDeOpciones, esOrdenador } from '../lib/teclas.js';
import { recordActivity } from '../lib/streak.js';
import { cobrarEjercicio, RECONOCER } from '../lib/monedas.js';
import { bumpSessions } from '../lib/progress.js';
import { saveRun } from '../lib/leaderboard.js';
import { getSettings } from '../lib/settings.js';
import Escuchar from './Escuchar.jsx';
import TextoAleman from './TextoAleman.jsx';
import { apuntarRespuesta, currentStreak } from '../lib/rachas.js';
import Reloj from './Reloj.jsx';
import RachaPill from './RachaPill.jsx';
import KasusTabelle from './KasusTabelle.jsx';
import PistaRevelable from './PistaRevelable.jsx';

// Kasus Trainer: elegir el artículo / determinante correcto dentro de una frase.
//
// Dos pistas, y las dos hacen falta para poder razonarlo:
//   · el GÉNERO, porque sin saber que "Frau" es die no hay por dónde empezar
//   · el CASO, que es lo que de verdad se practica aquí
//
// Ahora incluye además una tabla desplegable de consulta rápida accesible
// durante el ejercicio en la esquina superior derecha.
export default function KasusGame({ onExit, onFinish, filtro = 'all' }) {
  const activa = useExerciseActive();
  const fox = useFox();
  const size = getSettings().sessionSize || 10;
  const frases = useMemo(() => pickKasus(size, filtro), [filtro, size]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [pistas, setPistas] = useState({ genero: false, kasus: false });
  const [showTable, setShowTable] = useState(false);
  const [cerrandoTabla, setCerrandoTabla] = useState(false);
  const results = useRef([]);
  const [seguidas, setSeguidas] = useState(() => currentStreak());
  const mejorSeguidas = useRef(0);
  const ultimaSeguidas = useRef(null);
  const monedas = useRef(0);
  const started = useRef(Date.now());
  const advancing = useRef(false);
  const timer = useRef(null);
  const tablaCierreTimer = useRef(null);
  useEffect(() => () => {
    clearTimeout(timer.current);
    clearTimeout(tablaCierreTimer.current);
  }, []);

  function cerrarTabla() {
    if (!showTable || cerrandoTabla) return;
    setCerrandoTabla(true);
    clearTimeout(tablaCierreTimer.current);
    tablaCierreTimer.current = setTimeout(() => {
      setShowTable(false);
      setCerrandoTabla(false);
    }, 320);
  }

  function alternarTabla() {
    if (showTable) cerrarTabla();
    else {
      clearTimeout(tablaCierreTimer.current);
      setCerrandoTabla(false);
      setShowTable(true);
    }
  }

  const cur = frases[idx];
  const currentOptions = cur?.options || OPCIONES;

  useEffect(() => {
    if (!activa || esOrdenador() || !picked || !advancing.current) return;
    timer.current = setTimeout(siguiente, picked === cur?.art ? 800 : 3800);
    return () => clearTimeout(timer.current);
  }, [activa, picked, idx, cur?.art]);

  const pedirSiguientePista = () => {
    if (!pistas.genero) setPistas((p) => ({ ...p, genero: true }));
    else if (!pistas.kasus && filtro === 'all') setPistas((p) => ({ ...p, kasus: true }));
  };

  useTeclas(
    picked
      ? {
          Enter: saltarEspera,
          ' ': saltarEspera,
          Escape: () => (showTable ? cerrarTabla() : onExit())
        }
      : {
          ...teclasDeOpciones(currentOptions, (a) => choose(a)),
          p: pedirSiguientePista,
          P: pedirSiguientePista,
          h: pedirSiguientePista,
          H: pedirSiguientePista,
          g: () => setPistas((p) => ({ ...p, genero: true })),
          G: () => setPistas((p) => ({ ...p, genero: true })),
          k: () => (filtro === 'all' ? setPistas((p) => ({ ...p, kasus: true })) : undefined),
          K: () => (filtro === 'all' ? setPistas((p) => ({ ...p, kasus: true })) : undefined),
          t: alternarTabla,
          T: alternarTabla,
          Escape: () => (showTable ? cerrarTabla() : onExit())
        },
    frases.length > 0
  );

  if (!frases.length) {
    return (
      <div className="card center stack">
        <p>{t('kasus.vacio')}</p>
        <button className="btn-ghost" onClick={onExit}>{t('back')}</button>
      </div>
    );
  }

  const displayArt = !cur.vor ? cur.art.charAt(0).toUpperCase() + cur.art.slice(1) : cur.art;
  const frasePlena = cur.vor ? `${cur.vor} ${cur.art} ${cur.nach}`.trim() : `${displayArt} ${cur.nach}`.trim();

  function siguiente() {
    advancing.current = false;
    if (idx + 1 < frases.length) {
      setIdx(idx + 1);
      setPicked(null);
      setPistas({ genero: false, kasus: false });
    } else {
      finish();
    }
  }

  function choose(art) {
    if (advancing.current || picked) return;
    const ok = art === cur.art;
    setPicked(art);
    recordKasus(cur.id, ok);
    monedas.current += cobrarEjercicio(ok, {
      nivel: 2,
      pistas: (pistas.genero ? 1 : 0) + (pistas.kasus ? 1 : 0)
    });
    results.current.push({ frase: cur, ok, picked: art, pistas: { ...pistas } });
    const rSeg = apuntarRespuesta(ok);
    if (rSeg.seguidas > mejorSeguidas.current) mejorSeguidas.current = rSeg.seguidas;
    setSeguidas(rSeg.seguidas);
    ultimaSeguidas.current = rSeg;
    fox.acierto(ok);
    advancing.current = true;
  }

  function atras() {
    if (idx === 0) return;
    const prev = results.current[idx - 1];
    if (!prev) return;
    if (timer.current) clearTimeout(timer.current);
    advancing.current = false;
    results.current.pop();
    setIdx(idx - 1);
    setPicked(prev.picked);
    setPistas(prev.pistas || { genero: false, kasus: false });
    fox.sigue();
  }

  function saltarEspera() {
    if (!picked) return;
    fox.sigue();
    if (timer.current) clearTimeout(timer.current);
    siguiente();
  }

  function finish() {
    const seconds = Math.max(1, Math.round((Date.now() - started.current) / 1000));
    const correct = results.current.filter((r) => r.ok).length;
    const total = results.current.length;
    const acc = total ? correct / total : 0;
    let xp = results.current.reduce((s, r) => s + (r.ok ? 10 : 2), 0);
    if (acc >= 0.9) xp += 5;
    bumpSessions();
    const streak = recordActivity(xp, Date.now() - started.current);
    saveRun({
      topicId: 'kasus', topicName: 'Kasus Trainer', mode: 'kasus', game: 'kasus',
      correct, total, accuracy: Math.round(acc * 100) / 100, seconds, xp
    });
    onFinish({
      rachaMax: mejorSeguidas.current,
      rachaRecord: ultimaSeguidas.current,
      deck: { id: 'kasus', name: 'Kasus Trainer', emoji: '🧭' },
      mode: 'kasus',
      correct,
      total,
      seconds,
      xp,
      streak,
      monedas: monedas.current,
      missed: results.current
        .filter((r) => !r.ok)
        .map((r) => {
          const dArt = !r.frase.vor ? r.frase.art.charAt(0).toUpperCase() + r.frase.art.slice(1) : r.frase.art;
          const full = r.frase.vor ? `${r.frase.vor} ${r.frase.art} ${r.frase.nach}`.trim() : `${dArt} ${r.frase.nach}`.trim();
          return {
            de: full,
            es: r.frase.es
          };
        })
    });
  }

  return (
    <div className="vocab-session kasus-session-container">
      <div className="progress-top">
        <button className="btn-ghost" onClick={onExit} title={t('back')}>✕</button>
        <div className="bar"><span style={{ width: (idx / frases.length) * 100 + '%' }} /></div>
        {idx > 0 && results.current[idx - 1] && (
          <button className="btn-ghost ses-atras ses-icon-btn" onClick={atras} title={t('ses.prev')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <span className="timer">{idx + 1}/{frases.length}</span>
      </div>

      <div className="ctx-fila">
        <GameModePill mode="kasus" />
        <span className="row" style={{ gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            className={'btn-tabla-toggle' + (showTable ? ' active' : '')}
            onClick={alternarTabla}
            title="Mostrar u ocultar la tabla de casos y artículos (Atajo: T)"
          >
            📋 {showTable ? 'Ocultar tabla' : 'Tabla de casos'} <span className="op-tecla" style={{ marginLeft: 4 }}>T</span>
          </button>
          <RachaPill n={seguidas} />
          <Reloj desde={started.current} />
        </span>
      </div>

      {/* Tabla de casos flotante en la esquina derecha / lateral */}
      {showTable && <KasusTabelle onClose={cerrarTabla} cerrando={cerrandoTabla} />}

      <div className="fc-wrap">
        <div className="kasus-frase">
          {cur.vor && <span>{cur.vor} </span>}
          <span className={'kasus-hueco' + (picked ? (picked === cur.art ? ' bien' : ' mal') : '')}>
            {picked ? (!cur.vor ? picked.charAt(0).toUpperCase() + picked.slice(1) : picked) : '\u00A0'}
          </span>
          <span> {cur.nach}</span>
        </div>
        <div className="kasus-es">{cur.es}</div>

        {/* Las pistas, a un toque */}
        {!picked && (
          <div className="kasus-pistas">
            <PistaRevelable
              key={`${idx}-genero`}
              revealed={pistas.genero}
              onReveal={() => setPistas((p) => ({ ...p, genero: true }))}
              title="Atajo: G o P"
              className="kasus-pista-slot"
              buttonClassName="ask-chip"
              label={<>💡 {t('kasus.pistaGenero')} <span className="op-tecla" style={{ marginLeft: 4 }}>G</span></>}
            >
              <span className="ask-chip on kasus-pista-revelada">
                {t('kasus.pistaGeneroVal', { art: cur.pistaGenero, nomen: cur.nomen })}
              </span>
            </PistaRevelable>
            {filtro === 'all' && (
              <PistaRevelable
                key={`${idx}-kasus`}
                revealed={pistas.kasus}
                onReveal={() => setPistas((p) => ({ ...p, kasus: true }))}
                title="Atajo: K o P"
                className="kasus-pista-slot"
                buttonClassName="ask-chip"
                label={<>💡 {t('kasus.pistaKasus')} <span className="op-tecla" style={{ marginLeft: 4 }}>K</span></>}
              >
                <span className="ask-chip on kasus-pista-revelada">{cur.kasus}</span>
              </PistaRevelable>
            )}
          </div>
        )}

        {/* Opciones dinámicas para el tipo de artículo que se practica */}
        <div className="kasus-opciones">
          {currentOptions.map((a, n) => {
            let cls = 'gender-btn kasus-btn';
            if (picked) {
              if (a === cur.art) cls += ' correct';
              else if (a === picked) cls += ' wrong';
              else cls += ' dim';
            }
            return (
              <button key={a} className={cls} disabled={!!picked} onClick={() => choose(a)}>
                <span className="op-tecla">{n + 1}</span>
                {a}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className={'kasus-fix' + (picked === cur.art ? ' bien' : '')}>
            <div className="kf-frase">
              {frasePlena}
              <Escuchar texto={frasePlena} className="dlg-say" frase />
            </div>
            <div className="kf-por">
              <strong>{cur.kasus}</strong> · <TextoAleman texto={codigoIdioma() === 'en' ? porEn(cur.por) : cur.por} />
            </div>
            <button className="btn-primary btn-sm" onClick={saltarEspera}>
              {t('ueb.siguiente')} {esOrdenador() ? <span className="op-tecla" style={{ marginLeft: 6 }}>↵</span> : null}
            </button>
          </div>
        )}

        {!showTable && <FoxOverlay fox={fox} mudo={!!picked} racha={seguidas} />}
      </div>
    </div>
  );
}
