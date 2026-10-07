import React, { useState } from 'react';
import { SIN_IA } from '../lib/modo.js';
import { t, pick, localeFecha } from '../lib/i18n.js';
import { listEntries, createEntry, diaryStats, countWords, topMistakes } from '../lib/diary.js';
import { aiAvailable } from '../lib/settings.js';
import TablaVentana from './tablas/TablaVentana.jsx';
import { TABLAS } from './tablas/index.js';

function fmt(d) {
  if (!d) return '';
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString(localeFecha(), {
      weekday: 'long', day: 'numeric', month: 'long'
    });
  } catch {
    return d;
  }
}

export default function Diary({ onOpen }) {
  const entries = listEntries();
  const st = diaryStats();
  const fallos = topMistakes(5);
  const aiOn = aiAvailable();
  // Las tablas de gramatica, a mano mientras escribes: articulos, adjetivos
  // y preposiciones.
  const [tablas, setTablas] = useState(false);
  const [cerrandoTablas, setCerrandoTablas] = useState(false);
  function cerrarTablas() {
    if (cerrandoTablas) return;
    setCerrandoTablas(true);
    setTimeout(() => { setTablas(false); setCerrandoTablas(false); }, 320);
  }

  return (
    <div className="wide">
      {tablas && <TablaVentana tablas={TABLAS} onClose={cerrarTablas} cerrando={cerrandoTablas} />}
      <div className="page-head">
        <h1>Tagebuch</h1>
        <p>
          {t(SIN_IA ? 'tb.subSinIA' : 'tb.sub')}
        </p>
      </div>

      <div className="statcards statcards-diario tira-resumen">
        <div className="card statcard">
          <div className="n">{st.count}</div>
          <div className="l">{t('tb.entries')}</div>
        </div>
        <div className="card statcard">
          <div className="n">{st.palabras}</div>
          <div className="l">{t('tb.wordsWritten')}</div>
        </div>
      </div>

      {fallos.length > 0 && (
        <div className="panel" style={{ marginBottom: 20 }}>
          <h2>{t('tb.topMistakes')}</h2>
          <p className="muted" style={{ fontSize: '0.84rem', marginBottom: 10 }}>
            {t('tb.topMistakesSub')}
          </p>
          <div className="nb-chips">
            {fallos.map((f) => (
              <span className="nb-chip gram" key={f.regel}>
                {f.regel} <strong>×{f.n}</strong>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* El recuadro de "sin IA puedes escribir, pero para corregir actívala"
          no se pinta cuando no hay IA que activar. */}
      {!SIN_IA && !aiOn && (
        <div className="card" style={{ marginBottom: 16 }}>
          {t('tb.offHint')}
        </div>
      )}

      <div className="row" style={{ gap: 10, marginBottom: 18, flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={() => onOpen(createEntry().id)}>
          {t('tb.new')}
        </button>
        <button className="tb-tablas" onClick={() => setTablas(true)}>
          📋 {pick('Tablas de gramática', 'Grammar tables')}
        </button>
      </div>

      {entries.length === 0 ? (
        <div className="card center">
          <p className="muted">
            {t(SIN_IA ? 'tb.emptySinIA' : 'tb.empty')}
          </p>
        </div>
      ) : (
        <div className="stack">
          {entries.map((e) => {
            const n = countWords(e.text);
            const fallosN = e.correction?.korrekturen?.length ?? null;
            return (
              <button className="card topic-open" key={e.id} onClick={() => onOpen(e.id)}>
                <div className="row spread" style={{ alignItems: 'flex-start' }}>
                  <div className="flex-min">
                    <div className="t-title">{e.title || fmt(e.date)}</div>
                    <div className="muted" style={{ fontSize: '0.8rem', margin: '2px 0 6px' }}>
                      {fmt(e.date)} · {n} {n === 1 ? t('word') : t('words')}
                    </div>
                    <div className="t-blurb">
                      {(e.text || '').replace(/\s+/g, ' ').trim().slice(0, 150) || t('tb.noText')}
                    </div>
                  </div>
                  <span className="chev">›</span>
                </div>
                <div className="row" style={{ gap: 8, marginTop: 10, fontSize: '0.76rem', flexWrap: 'wrap' }}>
                  {e.correction ? (
                    <>
                      <span className="pill">{t('tb.isCorrected')}</span>
                      <span className="pill">
                        {fallosN === 0 ? t('tb.noMistakes') : fallosN === 1 ? t('tb.oneCorrection') : t('tb.nCorrections', { n: fallosN })}
                      </span>
                      {e.correction.niveau && <span className="pill">{t('level')} {e.correction.niveau}</span>}
                    </>
                  ) : (
                    <span className="muted">{t('tb.notCorrected')}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
