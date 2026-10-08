import React, { useEffect, useMemo, useRef, useState } from 'react';
import FoxOverlay, { useFox } from './FoxOverlay.jsx';
import GameModePill from './GameModePill.jsx';
import { t, pick } from '../lib/i18n.js';
import { pickGenderNouns, recordGender, recordCard, getDeck } from '../lib/vocab.js';
import { tc } from '../lib/contenido/index.js';
import { pistaGenero } from '../lib/genero.js';
import { useExerciseActive, useTeclas, esOrdenador } from '../lib/teclas.js';
import { recordActivity } from '../lib/streak.js';
import { cobrarEjercicio, RECONOCER } from '../lib/monedas.js';
import { bumpSessions } from '../lib/progress.js';
import { saveRun, guardarParcial } from '../lib/leaderboard.js';
import { getSettings } from '../lib/settings.js';
import { apuntarRespuesta, currentStreak } from '../lib/rachas.js';
import Reloj from './Reloj.jsx';
import RachaPill from './RachaPill.jsx';
import Escuchar from './Escuchar.jsx';
import PistaRevelable from './PistaRevelable.jsx';
import TablaVentana from './tablas/TablaVentana.jsx';
import { TABLA_GENUS } from './tablas/index.js';

const ARTS = [
  { a: 'der', color: 'der' },
  { a: 'die', color: 'die' },
  { a: 'das', color: 'das' }
];

export default function GenderGame({ onExit, onFinish, nivel = 'all' }) {
  const activa = useExerciseActive();
  const fox = useFox();
  // Sin suelo: lo que digas en Ajustes es lo que sale.
  const size = getSettings().sessionSize || 10;
  const nouns = useMemo(() => pickGenderNouns(size, nivel), [nivel, size]);
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  // La pista de la palabra que hay puesta, una vez pedida. Se guarda entera y
  // no un booleano porque la de descarte lleva dentro el artículo sorteado: si
  // se recalculara al pintar, cambiaría en cada render.
  const [pista, setPista] = useState(null);
  const results = useRef([]);
  // La racha de aciertos seguidos: hasta ahora solo la llevaba gramática.
  // Lo que llevas seguidas AHORA, para el rayito de la cabecera. Se
  // contaba desde el principio, pero solo se veia al terminar.
  const [seguidas, setSeguidas] = useState(() => currentStreak());
  // La tabla de las reglas del genero, como la de casos del Kasus Trainer.
  const [tabla, setTabla] = useState(false);
  const [cerrandoTabla, setCerrandoTabla] = useState(false);
  const tablaTimer = useRef(null);
  useEffect(() => () => clearTimeout(tablaTimer.current), []);
  function cerrarTabla() {
    if (!tabla || cerrandoTabla) return;
    setCerrandoTabla(true);
    clearTimeout(tablaTimer.current);
    tablaTimer.current = setTimeout(() => { setTabla(false); setCerrandoTabla(false); }, 320);
  }
  function alternarTabla() {
    if (tabla) cerrarTabla();
    else { clearTimeout(tablaTimer.current); setCerrandoTabla(false); setTabla(true); }
  }
  const mejorSeguidas = useRef(0);
  const ultimaSeguidas = useRef(null);
  const monedas = useRef(0); // lo ganado en esta tanda, para el resumen
  const started = useRef(Date.now());
  const advancing = useRef(false);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);
  const cur = nouns[idx];

  useEffect(() => {
    if (!activa || esOrdenador() || !picked || !advancing.current) return;
    timer.current = setTimeout(skipWait, picked === cur?.article ? 700 : 3000);
    return () => clearTimeout(timer.current);
  }, [activa, picked, idx, cur?.article]);

  // 1, 2 y 3 son der, die y das, en el orden en que salen en pantalla.
  // Con la respuesta dada, Enter o espacio avanzan a la siguiente pregunta.
  // En ordenador no pasa automáticamente: el alumno decide cuándo avanzar.
  // La P pide la pista.
  const pedirPista = () => setPista(pistaGenero(cur.noun, cur.article));
  useTeclas({
    1: picked ? undefined : () => choose('der'),
    2: picked ? undefined : () => choose('die'),
    3: picked ? undefined : () => choose('das'),
    Enter: picked ? skipWait : undefined,
    ' ': picked ? skipWait : undefined,
    p: !picked && !pista ? pedirPista : undefined,
    P: !picked && !pista ? pedirPista : undefined,
    h: !picked && !pista ? pedirPista : undefined,
    H: !picked && !pista ? pedirPista : undefined,
    t: alternarTabla,
    T: alternarTabla,
    Escape: () => (tabla ? cerrarTabla() : onExit())
  }, nouns.length > 0);

  if (!nouns.length) {
    return (
      <div className="card center stack">
        <p>{pick('No hay sustantivos disponibles.', 'No nouns available.')}</p>
        <button className="btn-ghost" onClick={onExit}>{pick('Volver', 'Back')}</button>
      </div>
    );
  }

  function choose(art) {
    if (advancing.current || picked) return;
    const ok = art === cur.article;
    setPicked(art);
    recordGender(cur.noun, ok);
    if (cur.deckId && cur.cardDe) recordCard(cur.cardDe, ok);
    monedas.current += cobrarEjercicio(ok, { nivel: 2, pistas: pista ? 1 : 0 });
    results.current.push({ noun: cur, ok, picked: art, pista });
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
    setPista(prev.pista || null);
    fox.sigue();
  }

  // Avanza a la siguiente pregunta
  function skipWait() {
    if (!picked) return;
    fox.sigue();
    if (timer.current) clearTimeout(timer.current);
    advancing.current = false;
    if (idx + 1 < nouns.length) {
      setIdx(idx + 1);
      setPicked(null);
      setPista(null);
    } else {
      finish();
    }
  }

  // Una tanda de der/die/das mezcla palabras de muchos mazos. Para que la
  // SEGUNDA barra de cada tema (el acierto reciente) se entere, se guarda un
  // apunte por mazo con lo que has hecho de ESE mazo, y otro para la lección
  // entera, que es la que mira la pantalla de la Lektion.
  function repartirPorMazo(res) {
    const porMazo = new Map();
    for (const r of res) {
      const id = r.noun?.deckId;
      if (!id) continue;
      // El Set es imprescindible: en los mazos que no son del libro (tiere,
      // wetter…) la sustitución no cambia nada y el destino salía repetido, o
      // sea que esa palabra contaba dos veces.
      const destinos = new Set([id, id.replace(/^(kb-.+)-w\d+$/, '$1-all')]);
      for (const destino of destinos) {
        if (!porMazo.has(destino)) porMazo.set(destino, { correct: 0, total: 0 });
        const c = porMazo.get(destino);
        c.total += 1;
        if (r.ok) c.correct += 1;
      }
    }
    for (const [id, c] of porMazo) {
      // Con el nombre del MAZO, no "der/die/das". Estas entradas dicen como
      // llevas los sustantivos de ese mazo; llamarlas todas igual llenaba la
      // lista de "Por tema" de filas identicas e indistinguibles.
      const mazo = getDeck(id);
      guardarParcial({
        topicId: 'vocab:' + id,
        topicName: mazo ? 'Vocab · ' + mazo.name : 'der/die/das',
        mode: 'gender',
        game: 'gender',
        correct: c.correct,
        total: c.total,
        accuracy: c.total ? Math.round((c.correct / c.total) * 100) / 100 : 0,
        xp: 0
      });
    }
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
    saveRun({ topicId: 'vocab:gender', topicName: 'der/die/das', mode: 'gender', game: 'gender', correct, total, accuracy: Math.round(acc * 100) / 100, seconds, xp });
    repartirPorMazo(results.current);
    onFinish({
      rachaMax: mejorSeguidas.current,
      rachaRecord: ultimaSeguidas.current,
      deck: { id: 'gender', name: 'der / die / das', emoji: '🎯' },
      mode: 'gender',
      correct,
      total,
      seconds,
      xp,
      streak,
      monedas: monedas.current,
      missed: results.current.filter((r) => !r.ok).map((r) => ({ de: r.noun.article + ' ' + r.noun.noun, es: r.noun.es }))
    });
  }

  return (
    <div className="vocab-session">
      <div className="progress-top">
        <button className="btn-ghost" onClick={onExit} title="Salir">✕</button>
        <div className="bar"><span style={{ width: (idx / nouns.length) * 100 + '%' }} /></div>
        {idx > 0 && results.current[idx - 1] && (
          <button className="btn-ghost ses-atras ses-icon-btn" onClick={atras} title={t('ses.prev')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <span className="timer">{idx + 1}/{nouns.length}</span>
      </div>

      <div className="ctx-fila">
        <GameModePill mode="gender" />
        <span className="row" style={{ gap: 8, alignItems: 'center' }}>
          <button
            type="button"
            className={'btn-tabla-toggle' + (tabla ? ' active' : '')}
            onClick={alternarTabla}
            title={pick('Mostrar u ocultar las reglas del género (Atajo: T)', 'Show or hide the gender rules (Shortcut: T)')}
          >
            📋 {tabla ? pick('Ocultar tabla', 'Hide table') : pick('Reglas del género', 'Gender rules')} <span className="op-tecla" style={{ marginLeft: 4 }}>T</span>
          </button>
          <RachaPill n={seguidas} />
          <Reloj desde={started.current} />
        </span>
      </div>

      <div className="prompt-label" style={{ marginBottom: 6 }}>{t('vs.genderQ')}</div>
      <div className="fc-wrap">
        <div className="gender-word">
          <span className="gw-noun">{cur.noun}</span>
          <span className="gw-es">{tc(cur.es)}</span>
        </div>

        {/* La pista. Nunca dice el artículo: dice la regla, que es lo que
            vale para las otras doscientas palabras con esa terminación. Las
            que no tienen regla (cuatro de cada cinco) reciben la otra ayuda,
            descartar uno, que deja la duda en dos y no en tres. */}
        <div className="gender-niveles gg-pista" style={{ justifyContent: 'center' }}>
          <PistaRevelable
            key={`${idx}-${cur.noun}`}
            revealed={Boolean(pista)}
            onReveal={() => setPista(pistaGenero(cur.noun, cur.article))}
            disabled={!!picked}
            title="Atajo: P"
            className="gg-pista-slot"
            buttonClassName="ask-chip"
            label={<>{t('gg.pista')} <span className="op-tecla" style={{ marginLeft: 4 }}>P</span></>}
          >
            <span className="gg-pista-txt">
              💡 {pista?.tipo === 'regla' ? pick(pista.es, pista.en) : t('gg.descarte', { art: pista?.fuera })}
            </span>
          </PistaRevelable>
        </div>

        <div className="gender-row">
          {ARTS.map(({ a, color }, k) => {
            let cls = 'gender-btn ' + color;
            if (picked) {
              if (a === cur.article) cls += ' correct';
              else if (a === picked) cls += ' wrong';
              else cls += ' dim';
            }
            return (
              <button key={a} className={cls} disabled={!!picked} onClick={() => choose(a)}>
                <span className="op-tecla">{k + 1}</span>
                {a}
              </button>
            );
          })}
        </div>

        {picked && (
          <div className={'gender-fix' + (picked === cur.article ? ' bien' : '')}>
            <div className="gf-line" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
              <span>{picked === cur.article ? '✓' : '✗'}</span>
              <span>
                {pick('Es', 'It’s')} <strong className={'gf-art ' + cur.article}>{cur.article}</strong>{' '}
                <strong>{cur.noun}</strong>
              </span>
              <Escuchar texto={`${cur.article} ${cur.noun}`} className="dlg-say" frase />
            </div>
            <div className="gf-es">{tc(cur.es)}</div>
            <button className="btn-primary btn-sm" onClick={skipWait} style={{ marginTop: 4 }}>
              {t('ueb.siguiente')} {esOrdenador() ? <span className="op-tecla" style={{ marginLeft: 6 }}>↵</span> : null}
            </button>
          </div>
        )}
      {tabla && <TablaVentana tablas={[TABLA_GENUS]} onClose={cerrarTabla} cerrando={cerrandoTabla} />}
      {!tabla && <FoxOverlay fox={fox} mudo={!!picked} racha={seguidas} />}
      </div>
    </div>
  );
}
