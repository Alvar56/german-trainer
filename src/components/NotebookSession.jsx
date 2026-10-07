import React, { useMemo, useRef, useState } from 'react';
import FoxOverlay, { useFox } from './FoxOverlay.jsx';
import { t } from '../lib/i18n.js';
import MultipleChoice from './MultipleChoice.jsx';
import WordOrder from './WordOrder.jsx';
import WriteCard from './WriteCard.jsx';
import ClozeTest from './ClozeTest.jsx';
import OpenQuestion from './OpenQuestion.jsx';
import Feedback from './Feedback.jsx';
import { recordActivity } from '../lib/streak.js';
import { cobrarEjercicio, RECONOCER } from '../lib/monedas.js';
import { bumpSessions } from '../lib/progress.js';
import { saveRun } from '../lib/leaderboard.js';
import { makeRng, randomSeed, shuffle } from '../lib/rng.js';
import { useTeclas } from '../lib/teclas.js';

export default function NotebookSession({ note, lektion, onExit, onFinish, itemsFijos = null }) {
  const fox = useFox();
  const items = useMemo(() => {
    const r = makeRng(randomSeed());
    return shuffle(r, [...(itemsFijos?.length ? itemsFijos : note?.items || [])]);
  }, [note?.id, itemsFijos]);
  const [idx, setIdx] = useState(0);
  const [retries, setRetries] = useState(0);
  const [phase, setPhase] = useState('answer'); // 'answer' | 'feedback'
  const [lastCorrect, setLastCorrect] = useState(false);
  const [lastChosen, setLastChosen] = useState(null);
  const results = useRef([]);
  const monedas = useRef(0); // lo ganado en esta tanda, para el resumen
  const started = useRef(Date.now());
  useTeclas({ Escape: onExit });
  useTeclas({ Enter: () => next(), ' ': () => next(), ArrowLeft: () => atras() }, phase === 'feedback');

  if (!items.length) {
    return (
      <div className="card center stack">
        <p>{t('vs.noExercises')}</p>
        <button className="btn-ghost" onClick={onExit}>
          {t('back')}
        </button>
      </div>
    );
  }

  const item = items[idx];

  function handleAnswer(correct, chosen) {
    monedas.current += cobrarEjercicio(correct, { nivel: RECONOCER });
    results.current[idx] = { correct, chosen };
    setLastCorrect(correct);
    setLastChosen(chosen);
    fox.acierto(correct);
    setPhase('feedback');
  }

  function verEstado(i) {
    fox.sigue();
    setRetries(0);
    setIdx(i);
    const hecho = results.current[i];
    if (hecho) {
      setLastCorrect(hecho.correct);
      setLastChosen(hecho.chosen);
      setPhase('feedback');
    } else {
      setPhase('answer');
    }
  }

  function atras() {
    if (idx === 0) return;
    verEstado(idx - 1);
  }

  function next() {
    if (idx + 1 < items.length) {
      verEstado(idx + 1);
    } else {
      finish();
    }
  }

  function handleRetry() {
    results.current.pop();
    setPhase('answer');
    setRetries(r => r + 1);
  }

  function finish() {
    const seconds = Math.max(1, Math.round((Date.now() - started.current) / 1000));
    const validResults = results.current.filter(Boolean);
    const correct = validResults.filter((r) => r.correct).length;
    const total = validResults.length || items.length;
    const acc = total ? correct / total : 0;
    let xp = validResults.reduce((s, r) => s + (r.correct ? 10 : 2), 0);
    if (acc >= 0.9) xp += 5;
    bumpSessions();
    const streak = recordActivity(xp, Date.now() - started.current);
    saveRun({
      topicId: 'cuaderno',
      topicName: 'Cuaderno · ' + (note.title || lektion?.name || 'repaso'),
      mode: 'notebook',
      game: 'mixed',
      correct,
      total,
      accuracy: Math.round(acc * 100) / 100,
      seconds,
      xp
    });
    const missed = items.flatMap((item, i) => {
      const result = results.current[i];
      if (!result) return [];
      if (result.correct) return [];
      const solution = Array.isArray(item.solution) ? item.solution.join(' ') : item.solution;
      const expected = solution || item.answer || item.sentence || '';
      const chosen = typeof result.chosen === 'string'
        ? result.chosen
        : result.chosen?.text || result.chosen?.sentence || '';
      return [{
        ...item,
        de: expected,
        es: item.translation || item.prompt || '',
        ...(chosen ? { tuya: chosen } : {})
      }];
    });
    onFinish({
      deck: { id: 'cuaderno', name: note.title || lektion?.name || 'Repaso de clase', emoji: '📓' },
      mode: 'notebook',
      correct,
      total,
      seconds,
      xp,
      streak,
      monedas: monedas.current,
      missed,
      fallos: items.filter((_, i) => Boolean(results.current[i] && !results.current[i].correct))
    });
  }

  return (
    <div className="reading session">
      <div className="progress-top">
        <button className="btn-ghost ses-icon-btn" onClick={onExit} title={t('ses.exit')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="bar">
          <span style={{ width: (idx / items.length) * 100 + '%' }} />
        </div>
        {idx > 0 && results.current[idx - 1] && (
          <button className="btn-ghost ses-atras ses-icon-btn" onClick={atras} title={t('ses.prev')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <span className="timer">
          {idx + 1}/{items.length}
        </span>
      </div>

      {item.type === 'order' ? (
        <WordOrder key={item.id + '-' + retries} item={item} onAnswer={(c) => handleAnswer(c, null)} />
      ) : item.type === 'write' ? (
        <WriteCard key={item.id + '-' + retries} item={item} onAnswer={handleAnswer} />
      ) : item.type === 'cloze' ? (
        <ClozeTest key={item.id + '-' + retries} item={item} onAnswer={handleAnswer} />
      ) : item.type === 'open' ? (
        <OpenQuestion key={item.id + '-' + retries} item={item} onAnswer={handleAnswer} lektionId={lektion?.id} />
      ) : (
        <MultipleChoice key={item.id + '-' + retries} item={item} onAnswer={handleAnswer} />
      )}

      {phase === 'feedback' && (
        <Feedback
          item={item}
          correct={lastCorrect}
          chosen={lastChosen}
          last={idx + 1 >= items.length}
          onNext={next}
          onRetry={handleRetry}
        />
      )}

      <FoxOverlay fox={fox} mudo={phase !== 'answer'} />
    </div>
  );
}
