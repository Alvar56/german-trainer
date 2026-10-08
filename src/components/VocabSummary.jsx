import React, { useEffect, useRef, useState } from 'react';
import { conSimbolo } from './IconoJuego.jsx';
import { t, pick } from '../lib/i18n.js';
import { deckStats, getDeck } from '../lib/vocab.js';
import { getLektion } from '../lib/kursbuch/index.js';
import { kommMastery } from '../lib/progress.js';
import { cobrarCoronaVocab } from '../lib/vocabRewards.js';
import { cobrarCoronaMaestria } from '../lib/topicRewards.js';
import Confeti from './Confeti.jsx';

// El mismo listón que en gramática y en Kommunikation.
const APROBADO = 80;

import Premios from './Premios.jsx';
import { useTeclas } from '../lib/teclas.js';

export default function VocabSummary({ data, onRepeat, onRepetirFallos, onDeck, accionesDentro = false }) {
  const {
    deck, mode, correct, total, seconds, xp, mistakes, missed = [], streak,
    monedas = 0, rachaRecord = null, rank = null,
  } = data;
  // Blitz ya incluye el bonus de victoria en el total cobrado; separamos esa
  // parte en el resumen para que se vea claramente por completar la partida.
  const bonoCompletarBlitz = mode === 'blitz' && data.ganado ? 5 : 0;
  const bonoRachaFinal = Number(data.bonoRachaFinal) || 0;
  const monedasEjercicios = Math.max(0, monedas - bonoCompletarBlitz - bonoRachaFinal);
  const isMatch = mode === 'match';
  const isCrossword = mode === 'crossword';
  const isNotebook = mode === 'notebook';
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const pleno = isMatch ? mistakes === 0 : total > 0 && correct === total;
  const mm = Math.floor(seconds / 60);
  const ss = String(seconds % 60).padStart(2, '0');
  const subida = streak?.events?.find((e) => e.type === 'level');
  // El regalo de estrenar el dia. Solo cae en la primera leccion del dia, sea
  // del juego que sea, asi que solo ahi se puede llegar a 20 en un ejercicio.
  const bonoDia = streak?.events?.find((e) => e.type === 'coins')?.value || 0;
  const vieneDeTerminarTema = Boolean(data.finishTopic);
  const [bonoCorona, setBonoCorona] = useState(Number(data.bonoCorona) || 0);
  const premioProcesado = useRef({ deckId: null, cantidad: 0 });
  const deckId = String(deck?.id || '');
  const esMazoIndividual = deckId && deckId !== 'starred' && !deckId.startsWith('combi:') && !deckId.startsWith('komm:');
  const mazoCompleto = esMazoIndividual ? getDeck(deckId) : null;
  const coronaCompleta = !!mazoCompleto && deckStats(mazoCompleto).pct >= 100;
  const lektionKommId = deckId.startsWith('komm:') ? deckId.slice('komm:'.length) : '';
  const lektionKomm = lektionKommId ? getLektion(lektionKommId) : null;
  const maestriaKomm = lektionKomm?.kommunikation?.length
    ? kommMastery(lektionKomm.id, lektionKomm.kommunikation)
    : null;
  const kommunikationCompleta = !!maestriaKomm
    && maestriaKomm.total > 0
    && maestriaKomm.practiced === maestriaKomm.total;
  const coronaNueva = (coronaCompleta || kommunikationCompleta)
    && (Boolean(data.coronaRecienCompletada) || bonoCorona > 0 || Number(data.bonoCorona) > 0);
  const cierreConCorona = vieneDeTerminarTema && coronaNueva;
  const puedeRepetirFallos = !cierreConCorona && !!(onRepetirFallos && missed.length > 0);
  const celebracion = coronaNueva ? 'corona' : pleno ? 'suave' : null;

  useEffect(() => {
    if (premioProcesado.current.deckId === deckId) {
      setBonoCorona(premioProcesado.current.cantidad);
      return;
    }
    let premio = Number(data.bonoCorona) || 0;
    if (!premio && coronaCompleta) {
      premio = cobrarCoronaVocab(deckId, Boolean(data.coronaRecienCompletada));
    }
    if (!premio && kommunikationCompleta) {
      premio = cobrarCoronaMaestria('kommunikation', lektionKommId, Boolean(data.coronaRecienCompletada));
    }
    premioProcesado.current = { deckId, cantidad: premio };
    setBonoCorona(premio);
  }, [data, deck, deckId, coronaCompleta, kommunikationCompleta, lektionKommId]);

  useTeclas({
    Enter: () => {
      if (cierreConCorona) return;
      return puedeRepetirFallos ? onRepetirFallos() : isNotebook || isCrossword ? onDeck?.() : onRepeat();
    },
    Escape: () => onDeck ? onDeck() : onHome?.()
  }, true);

  const acciones = (
    <div className="btn-row resumen-acciones">
      {isNotebook && puedeRepetirFallos && (
        <button className="btn-primary resumen-retry" onClick={onRepetirFallos}>
          <span className="op-tecla atajo-final">Enter</span>
          {conSimbolo(t(data.soloFlashcards ? 'sum.retryUnknown' : 'sum.retryFails', { n: missed.length }))}
        </button>
      )}
      {!isNotebook && !cierreConCorona && puedeRepetirFallos && (
        <button className="btn-primary resumen-retry" onClick={onRepetirFallos}>
          <span className="op-tecla atajo-final">Enter</span>
          {conSimbolo(t(data.soloFlashcards ? 'sum.retryUnknown' : 'sum.retryFails', { n: missed.length }))}
        </button>
      )}
      {!isNotebook && !cierreConCorona && !isCrossword && (
        <button className={'resumen-otra ' + (puedeRepetirFallos ? 'btn-ghost' : 'btn-primary')} onClick={onRepeat}>
          {!puedeRepetirFallos && <span className="op-tecla atajo-final">Enter</span>}
          {t('sum.again')}
        </button>
      )}
      <button className={(isCrossword && !puedeRepetirFallos ? 'btn-primary ' : 'btn-ghost ') + 'resumen-volver'} onClick={onDeck}>
        <span className="op-tecla atajo-final">Esc</span>
        {t('vsum.backExercises')}
      </button>
    </div>
  );

  return (
    <div className="stack reading">
      {celebracion && <Confeti intensidad={celebracion} />}
      <div className="card center stack">
        <div className="confetti-badge">{pleno ? '🏆' : pct >= APROBADO ? '🎉' : '💪'}</div>
        <h2>{pleno ? t('sum.perfect') : pct >= APROBADO ? t('sum.good') : t('sum.keep')}</h2>
        {/* El mazo baja a la pastilla de siempre: arriba va el veredicto,
            como en gramática y en Kommunikation. */}
        <div className="vsummary-pills">
          <span className="pill ctx-tema">{deck?.emoji} {String(deck?.id || '').startsWith('combi:') ? pick('Vocabulario mixto', 'Mixed vocabulary') : deck?.id === 'mix' ? pick('Práctica mixta', 'Mixed practice') : (deck?.name || '')}</span>
          {coronaNueva && <span className="pill monedas vocab-corona-ganada">👑 {t('voc.crownEarned')}</span>}
        </div>
        <div className="stat-grid">
          <div className="card">
            <div className="big-stat">{isMatch ? mistakes : pct + '%'}</div>
            <div className="muted">{isMatch ? t('voc.mistakesStat') : t('voc.accuracyStat')}</div>
          </div>
          <div className="card">
            <div className="big-stat">{`${correct}/${total}`}</div>
            <div className="muted">{isMatch ? t('voc.pairsStat') : t('voc.cardsStat')}</div>
          </div>
          <div className="card">
            <div className="big-stat">{mm}:{ss}</div>
            <div className="muted">{t('voc.timeStat')}</div>
          </div>
        </div>
        <Premios
          subida={subida}
          xp={xp}
          ocultarXp={mode === 'flashcards' && xp === 0}
          monedas={monedasEjercicios}
          bonoCorona={bonoCorona}
          bonoCrucigrama={data.bonoCrucigrama || 0}
          bonoCompletar={bonoCompletarBlitz}
          bonoRachaFinal={bonoRachaFinal}
          bonoDia={bonoDia}
          rachaRecord={rachaRecord}
          rank={rank}
        />
        {accionesDentro && acciones}
      </div>

      {!accionesDentro && acciones}

      {missed.length > 0 && (
        <div className="card stack">
          <h3>{t('vsum.toReview')} ({missed.length})</h3>
          {missed.map((c, i) => (
            <div className="mistake" key={i}>
              <div className="de">{c.de} — {c.es}</div>
              {c.ex && <div className="muted" style={{ fontSize: '0.86rem' }}>{c.ex}</div>}
              {c.tuya && <div className="muted" style={{ fontSize: '0.86rem', marginTop: 4 }}>{pick('Tu respuesta: ', 'Your answer: ')}{c.tuya}</div>}
            </div>
          ))}
        </div>
      )}

    </div>
  );
}
