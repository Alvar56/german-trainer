import React, { useEffect, useRef, useState } from 'react';
import { t, pick, codigoIdioma } from '../lib/i18n.js';
import { tc } from '../lib/contenido/index.js';
import TextoAleman from './TextoAleman.jsx';
import Premios from './Premios.jsx';
import { useTeclas } from '../lib/teclas.js';
import { topicMastery } from '../lib/progress.js';
import Confeti from './Confeti.jsx';
import { cobrarCoronaMaestria } from '../lib/topicRewards.js';

// A partir de aqui la tanda se da por buena: el mismo 80% con el que se
// aprueba un apartado de Kommunikation, para no tener dos listones.
const APROBADO = 80;

export default function Summary({ data, onRepeat, onRepetirFallos, onHome, onTema, volverAInicio = false }) {
  const { topic, correctCount, total, accuracy, seconds, xp, streak, rank, mistakes, rachaRecord, monedas, bonoDia } = data;
  const fallos = data.fallos || [];
  const pct = Math.round(accuracy * 100);
  const mm = Math.floor(seconds / 60);
  const ss = seconds % 60;
  const perfect = correctCount === total;
  const conceptos = (topic?.concepts || []).map((concepto) => concepto.id).filter(Boolean);
  const mezcla = data.game === 'todo' || data.game === 'grammar-mixed' || topic?.id === 'mix';
  const grammarCompleta = !mezcla && conceptos.length > 0 && topicMastery(conceptos).complete;
  const [bonoCorona, setBonoCorona] = useState(0);
  const coronaGanadaEnEstaSesion = Boolean(data.coronaRecienCompletada || bonoCorona > 0);
  const coronaFinishTopic = data.mode === 'faltan' && coronaGanadaEnEstaSesion;
  const celebracion = coronaGanadaEnEstaSesion ? 'dominio' : perfect ? 'suave' : null;
  const premioProcesado = useRef(null);
  const puedeRepetirFallos = !coronaFinishTopic && !!(onRepetirFallos && fallos.length > 0);
  useTeclas({
    Enter: () => coronaFinishTopic ? undefined : puedeRepetirFallos ? onRepetirFallos() : onRepeat(),
    Escape: () => onTema ? onTema() : onHome?.()
  }, true);

  // Subir de nivel es lo mas gordo que puede pasar al terminar una tanda y
  // era lo unico que no se decia: te enterabas al volver a la portada.
  const subida = streak?.events?.find((e) => e.type === 'level');

  useEffect(() => {
    if (!grammarCompleta || !topic?.id || premioProcesado.current === topic.id) return;
    premioProcesado.current = topic.id;
    setBonoCorona(cobrarCoronaMaestria('grammar', topic.id, data.coronaRecienCompletada));
  }, [grammarCompleta, topic?.id]);

  return (
    <div className="stack reading">
      {celebracion && <Confeti intensidad={celebracion} />}
      <div className="card center stack">
        <div className="confetti-badge">{perfect ? '🏆' : pct >= APROBADO ? '🎉' : '💪'}</div>
        <h2>{perfect ? t('sum.perfect') : pct >= APROBADO ? t('sum.good') : t('sum.keep')}</h2>
        {/* De que iba la tanda, con la misma pastilla que se lleva arriba
            mientras la haces. */}
        {topic?.nameEs && (
          <div className="vsummary-pills">
            <span className="pill ctx-tema">📖 {data.game === 'grammar-mixed'
              ? pick('Gramática mixta', 'Mixed grammar')
              : data.game === 'todo'
              ? pick('De todo un poco', 'A bit of everything')
              : topic.id === 'vocab-mix' || data.game === 'vocab-mixed'
              ? pick('Vocabulario mixto', 'Mixed vocabulary')
              : topic.id === 'mix'
              ? pick('Práctica mixta', 'Mixed practice')
              : pick(topic.nameEs, topic.name || topic.nameEs)}</span>
            {coronaGanadaEnEstaSesion && <span className="pill monedas vocab-corona-ganada">👑 {t('voc.crownEarned')}</span>}
          </div>
        )}
        <div className="stat-grid">
          <div className="card">
            <div className="big-stat">{pct}%</div>
            <div className="muted">{t('sum.accuracy')}</div>
          </div>
          <div className="card">
            <div className="big-stat">
              {correctCount}/{total}
            </div>
            <div className="muted">{t('sum.hits')}</div>
          </div>
          <div className="card">
            <div className="big-stat">
              {mm}:{String(ss).padStart(2, '0')}
            </div>
            <div className="muted">{t('sum.time')}</div>
          </div>
        </div>
        <Premios
          subida={subida}
          xp={xp}
          monedas={Math.max(0, (Number(monedas) || 0) - (Number(data.bonoRachaFinal) || 0))}
          bonoRachaFinal={data.bonoRachaFinal || 0}
          bonoCorona={bonoCorona}
          bonoDia={bonoDia}
          rachaRecord={rachaRecord}
          rank={rank}
        />
      </div>

      <div className="btn-row resumen-acciones">
        {puedeRepetirFallos && (
          <button className="btn-primary resumen-retry" onClick={onRepetirFallos}>
            <span className="op-tecla atajo-final">Enter</span>
            {t('sum.retryFails', { n: fallos.length })}
          </button>
        )}
        {!coronaFinishTopic && (
          <button className={'resumen-otra ' + (puedeRepetirFallos ? 'btn-ghost' : 'btn-primary')} onClick={onRepeat}>
            {!puedeRepetirFallos && <span className="op-tecla atajo-final">Enter</span>}
            {t('sum.again')}
          </button>
        )}
        {(onTema || onHome) && (
          <button className="btn-ghost resumen-volver" onClick={onTema || onHome}>
            <span className="op-tecla atajo-final">Esc</span>
            {t(volverAInicio ? 'sum.backStartseite' : 'vsum.backExercises')}
          </button>
        )}
      </div>

      <div className="card stack">
        <h3>{t('sum.mistakes', { n: mistakes.reduce((a, m) => a + m.items.length, 0) })}</h3>
        {mistakes.length === 0 && <p className="muted">{t('sum.noMistakes')}</p>}
        {mistakes.map((m) => (
          <div key={m.conceptId}>
            <div className="pill" style={{ marginBottom: 6 }}>
              {m.label}
            </div>
            {m.items.map((it, i) => (
              <div className="mistake" key={i}>
                <div className="de">
                  {it.type === 'order' ? (it.solution || []).join(' ') 
                   : it.type === 'cloze' ? (it.clozeText ? (() => {
                       let respuesta = 0;
                       return String(it.clozeText).replace(/___/g, () => String(it.clozeAnswers?.[respuesta++] || '___'));
                     })() : '')
                   : it.type === 'open' ? (it.sentence || '')
                   : (() => {
                       const parts = String(it.answer || '___').split(/\s*\.\.\.\s*/);
                       let i = 0;
                       return String(it.sentence || '').replace(/___/g, () => parts[i++] || '___');
                     })()}
                </div>
                <div className="muted" style={{ fontSize: '0.88rem', marginTop: 4 }}>
                  <span className="lang-tag">{codigoIdioma()}</span>{tc(it.translation)}
                </div>
                <div className="muted" style={{ fontSize: '0.86rem', marginTop: 4 }}>
                  <span className="lang-tag">{t('fb.why')}</span>
                  <TextoAleman texto={tc(it.explanation)} />
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>

    </div>
  );
}
