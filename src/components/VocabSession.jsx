import React, { useEffect, useMemo, useRef, useState } from 'react';
import FoxOverlay, { useFox } from './FoxOverlay.jsx';
import { t, pick, codigoIdioma } from '../lib/i18n.js';
import { tc } from '../lib/contenido/index.js';
import { pickCards, recordCard, setCardColor, getCardColor, colorSiguiente, allDecks, deckStats, cartasQueFaltan } from '../lib/vocab.js';
import { recordActivity } from '../lib/streak.js';
import { cobrarEjercicio, RECONOCER, RECONSTRUIR, PRODUCIR } from '../lib/monedas.js';
import { bumpSessions } from '../lib/progress.js';
import { getSettings } from '../lib/settings.js';
import { useExerciseActive, useTeclas, teclasDeOpciones } from '../lib/teclas.js';
import { saveRun, rankOfRun } from '../lib/leaderboard.js';
import { apuntarRespuesta, currentStreak } from '../lib/rachas.js';
import Reloj from './Reloj.jsx';
import RachaPill from './RachaPill.jsx';
import StarButton from './StarButton.jsx';
import GameModePill from './GameModePill.jsx';
import PistaLetras from './PistaLetras.jsx';
import Umlaut from './Umlaut.jsx';
import WortsalatQuestion from './WortsalatQuestion.jsx';

const COMBINING = new RegExp('[\\u0300-\\u036f]', 'g');
const norm = (s) =>
  String(s || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(COMBINING, '')
    .replace(/ß/g, 'ss')
    .replace(/\b(der|die|das|den|dem|ein|eine|einen|einem|einer|el|la|los|las|un|una|unos|unas|to)\b/g, ' ')
    .replace(/\bsich\b/g, ' ')
    .replace(/[.,!?¿¡"'()\-–—/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

function checkWritten(input, answer) {
  const a = norm(answer);
  const i = norm(input);
  if (!i) return false;
  if (i === a) return true;
  return String(answer)
    .split(/[/,]/)
    .map(norm)
    .some((alt) => alt && alt === i);
}

function shuffle(a) {
  const x = [...a];
  for (let k = x.length - 1; k > 0; k--) {
    const j = Math.floor(Math.random() * (k + 1));
    [x[k], x[j]] = [x[j], x[k]];
  }
  return x;
}

function modoDeFavorito(card) {
  const guardado = card?.starMode || 'flashcards';
  if (guardado === 'wortsalat') return guardado;
  return ['flashcards', 'quiz', 'write'].includes(guardado) ? guardado : 'flashcards';
}

function objetivoWortsalat(de) {
  return String(de || '').replace(/^(der|die|das)\s+/i, '').trim();
}

function cartasParaTerminar(deck) {
  const pendientes = cartasQueFaltan(deck);
  const elegibles = shuffle(pendientes.filter((card) => {
    const palabra = objetivoWortsalat(card.de);
    return /^[A-Za-zÄÖÜäöüß-]{4,14}$/.test(palabra);
  }));
  // Una de cada cinco palabras pendientes, como mínimo una si hay alguna
  // válida. El resto conserva el quiz, así se repasan todas sin forzar
  // Wortsalat sobre nombres compuestos o expresiones.
  const cantidad = Math.min(elegibles.length, Math.max(1, Math.round(pendientes.length * 0.2)));
  const enWortsalat = new Set(elegibles.slice(0, cantidad).map((card) => card.de));
  return pendientes.map((card) => ({
    ...card,
    _finishMode: enWortsalat.has(card.de) ? 'wortsalat' : 'quiz'
  }));
}

// `cartasFijas`: las tarjetas de "repetir los fallos". Con ellas la tanda no
// se sortea, son esas y ya está.
export default function VocabSession({ deck, mode, finishTopic = false, fallos = false, dir: propDir, cartasFijas = null, reviewMode = null, onExit, onFinish }) {
  const activa = useExerciseActive();
  useTeclas({ Escape: onExit });
  const fox = useFox();
  const reviewingMistakes = Boolean(fallos);
  const reviewingMarked = reviewMode === 'marked';
  const freeNavigation = reviewingMistakes || reviewingMarked;
  const size = Math.min(getSettings().sessionSize || 10, deck.cards.length);
  // Las tarjetas de UN tema van enteras: el mazo, de una tirada. No son un
  // ejercicio que se aprueba, son el material para mirarlo, y cortarlo en diez
  // obligaba a entrar y salir cinco veces para ver un tema. Los juegos sí
  // respetan el tamaño de sesión: allí sí hay tanda que terminar.
  //
  // Menos cuando el mazo es la mezcla de TODO el vocabulario, que es lo que
  // sale al practicar desde la portada: ahí entero son mil seiscientas
  // tarjetas de una sentada, y eso no es material, es una condena. En ese mazo
  // manda el número de ejercicios que hayas puesto en Ajustes.
  const mezclaDeTodo = String(deck.id || '').startsWith('combi:');
  const sessionCards = useMemo(
    () =>
      cartasFijas?.length
        ? cartasFijas
        : reviewingMistakes
          ? deck.cards.map((card, i) => ({ ...card, _reviewPosition: i + 1 }))
        : finishTopic
          ? cartasParaTerminar(deck)
        : (mode === 'flashcards' || mode === 'starred-mixed') && !mezclaDeTodo
          ? shuffle(deck.cards)
          : pickCards(deck, size),
    [deck, mode, size, cartasFijas, mezclaDeTodo, reviewingMistakes, finishTopic]
  );
  const [reviewQueue, setReviewQueue] = useState(sessionCards);
  const cards = reviewingMistakes ? reviewQueue : sessionCards;
  const reviewTotal = useRef(sessionCards.length);
  const deckStartedComplete = useRef(deckStats(deck).pct >= 100);
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [seenBack, setSeenBack] = useState(false); // ya ha visto la traducción al menos una vez
  const [flash, setFlash] = useState(null); // 'ok' | 'no' | null  (flashcards)
  const [phase, setPhase] = useState('q'); // quiz/write: 'q' | 'a'
  const [input, setInput] = useState('');
  // Letras destapadas a mano en el modo de escribir.
  const [pistas, setPistas] = useState(0);
  const [lastOk, setLastOk] = useState(false);
  const [picked, setPicked] = useState(null);
  const results = useRef([]);
  const reviewHistory = useRef([]);
  const monedas = useRef(0); // lo ganado en esta tanda, para el resumen
  // La racha de aciertos seguidos. La llevaba solo gramática, así que
  // jugando a vocabulario ni subía ni se rompía.
  // Lo que llevas seguidas AHORA, para el rayito de la cabecera. Se
  // contaba desde el principio, pero solo se veia al terminar.
  const [seguidas, setSeguidas] = useState(() => currentStreak());
  const mejorSeguidas = useRef(0);
  const ultimaSeguidas = useRef(null);
  const started = useRef(Date.now());
  const inputRef = useRef(null);
  const advancing = useRef(false);

  // La direccion de cada carta. En mixto se sortea, PERO al repetir un fallo
  // se respeta la que tenia cuando fallaste: si te equivocaste yendo de
  // aleman a castellano, repetirlo al reves no es repetirlo, es otra pregunta
  // sobre la misma palabra. Por eso parecia que el ejercicio cambiaba solo.
  const dir = useMemo(
    () => cards.map((c) => (
      c?._finishMode === 'wortsalat' ? false
        : typeof c?._deToEs === 'boolean' ? c._deToEs
        : c?.starMode === 'wortsalat' ? false
          : propDir === 'es-de' ? false
          : propDir === 'de-es' ? true
            : Math.random() < 0.65
    )),
    [cards, propDir]
  );

  // Las tarjetas, con el teclado: espacio o Enter para girarla, y una vez
  // vista la traduccion, 1 = no la sabia y 2 = si. Es el gesto de toda la
  // vida en las apps de flashcards y aqui habia que ir al raton en cada una.
  //
  // En el modo de escribir no se engancha nada: alli el teclado es para
  // escribir. (useTeclas ya se aparta cuando el foco esta en un campo, pero
  // mas vale no depender solo de eso.)
  //
  // Va antes del `return` de "mazo vacio": los hooks no pueden ir detras de
  // un return condicional.
  // Las tres de aqui y las opciones del test estaban DESPUES del `return`
  // de "este mazo no tiene tarjetas". Un hook detras de un return
  // condicional es justo lo que React no admite: el dia que el mazo llegue
  // vacio y luego con tarjetas, la lista de hooks cambia de largo entre dos
  // pintados y salta un error que no dice nada de todo esto. Hoy no pasaba
  // porque un mazo vacio se queda vacio toda la vida del componente, pero
  // es de las cosas que se arreglan antes de que muerdan.
  //
  // `card` puede ser undefined cuando no hay tarjetas; por eso el `?.` y el
  // corte de mas abajo, que sigue devolviendo la pantalla de mazo vacio.
  const card = cards[idx];
  const modoGuardado = mode === 'starred-mixed'
    ? (card?.starMode || 'flashcards')
    : finishTopic ? (card?._finishMode || mode) : mode;
  // El repaso mixto tiene pantallas para tarjetas, quiz y escritura. Los
  // favoritos guardados desde juegos como Wortsalat se repasan como tarjeta:
  // antes no coincidían con ninguna rama y dejaban la pregunta en blanco.
  const modoCarta = mode === 'starred-mixed'
    ? modoDeFavorito(card)
    : finishTopic ? (card?._finishMode || mode) : mode;
  useEffect(() => {
    if (modoCarta === 'write' && phase === 'q' && inputRef.current) inputRef.current.focus();
  }, [idx, phase, modoCarta]);
  // Conserva la traducción base para poder repintar la tarjeta que ya está
  // abierta al cambiar de idioma, sin volver a barajar ni reiniciar la ronda.
  const textoTarjetaEs = (c) => c?._traducible ? tc(c._esBase) : c?.es;
  const ejemploTarjetaEs = (c) => c?._traducible ? tc(c._exEsBase) : c?.exEs;
  const deToEs = dir[idx];
  const prompt = deToEs ? card?.de : textoTarjetaEs(card);
  const answer = deToEs ? textoTarjetaEs(card) : card?.de;

  const quizOptions = useMemo(() => {
    if (modoCarta !== 'quiz' || !card) return [];
    // Al repetir un fallo, las MISMAS cuatro opciones que tenias delante.
    // Con distractores nuevos cada vez, la pregunta que fallaste no vuelve a
    // aparecer nunca: vuelve otra distinta con la misma respuesta.
    if (Array.isArray(card._opciones) && card._opciones.length) return card._opciones.map(tc);
    const normText = (s) => String(s || '').trim().toLowerCase();
    const ansKey = normText(answer);
    let pool = deck.cards
      .filter((c) => c.de !== card.de)
      .map((c) => (deToEs ? textoTarjetaEs(c) : c.de))
      .filter((text) => normText(text) !== ansKey);
    // When the deck is very small (e.g. starred items), supplement with cards from all decks
    if (pool.length < 3) {
      const all = allDecks().flatMap((d) => d.cards || []);
      const extra = all
        .filter((c) => c.de !== card.de && !deck.cards.some((dc) => dc.de === c.de))
        .map((c) => (deToEs ? textoTarjetaEs(c) : c.de))
        .filter((text) => normText(text) !== ansKey);
      pool = [...pool, ...shuffle(extra)];
    }
    const uniqPool = [];
    const seen = new Set();
    for (const p of shuffle(pool)) {
      const k = normText(p);
      if (k && !seen.has(k)) {
        seen.add(k);
        uniqPool.push(p);
      }
    }
    return shuffle([answer, ...uniqPool.slice(0, 3)]);
  }, [idx, modoCarta, card, answer, deToEs, deck, codigoIdioma()]);

  useTeclas(
    seenBack
      ? { 1: () => rateFlash(false), 2: () => rateFlash(true), ...(!freeNavigation ? { ArrowLeft: () => atras() } : {}) }
      : { ' ': () => { setRevealed(true); setSeenBack(true); }, Enter: () => { setRevealed(true); setSeenBack(true); }, ...(!freeNavigation ? { ArrowLeft: () => atras() } : {}) },
    modoCarta === 'flashcards' && cards.length > 0 && !flash
  );

  // El test, con los números, igual que el de gramática: el 1 es la primera
  // opción, el 2 la segunda… Aquí no estaban y había que ir al ratón en cada
  // palabra, que es justo lo que este juego hace cuarenta veces seguidas.
  useTeclas(
    teclasDeOpciones(quizOptions, (opt) => { setPicked(opt); gradeQA(opt === answer, opt); }),
    modoCarta === 'quiz' && phase === 'q' && cards.length > 0
  );

  // Y el Enter para pasar a la siguiente, una vez corregida. Valía para las
  // tarjetas y no para el test ni para escribir: había que buscar el botón.
  useTeclas(
    { Enter: () => continuarTrasCorreccion(), ' ': () => continuarTrasCorreccion() },
    (modoCarta === 'quiz' || modoCarta === 'write' || modoCarta === 'wortsalat') && phase === 'a'
  );

  // En el repaso de fallos se puede recorrer la lista sin contestar. Las
  // flechas del teclado hacen lo mismo que los controles de la cabecera.
  useTeclas(
    { ArrowLeft: () => atras(), ArrowRight: () => goNext() },
    freeNavigation && cards.length > 1
  );

  // Escribir: el Enter con el foco DENTRO del campo lo recoge el formulario.
  // Este es para cuando el foco se ha ido a otro sitio -al tocar la pantalla, o
  // después de girar una tarjeta-: sin esto, Enter no hacía nada y había que
  // volver al campo o buscar el botón de comprobar.
  useTeclas(
    { Enter: () => { if (input.trim()) gradeQA(checkWritten(input, answer), input.trim()); } },
    modoCarta === 'write' && phase === 'q'
  );

  useEffect(() => {
    if (!activa || modoCarta !== 'flashcards' || !flash) return;
    const timer = setTimeout(goNext, 620);
    return () => clearTimeout(timer);
  }, [activa, modoCarta, flash, idx]);

  if (!cards.length) {
    return (
      <div className="card center stack">
        <p>{t('vs.noCards')}</p>
        <button className="btn-ghost" onClick={onExit}>{t('back')}</button>
      </div>
    );
  }


  function verEstado(i) {
    fox.sigue();
    advancing.current = false;
    setIdx(i);
    setFlash(null);
    if ((mode === 'starred-mixed' ? modoDeFavorito(cards[i]) : mode) === 'flashcards') {
      setRevealed(false);
      setSeenBack(false);
      setFlash(null);
      return;
    }
    if (reviewingMistakes) {
      setPhase('q');
      setInput('');
      setPistas(0);
      setPicked(null);
      setLastOk(false);
      return;
    }
    const hecho = results.current[i];
    if (hecho) {
      setLastOk(hecho.ok);
      setPicked(hecho.picked || hecho.orden || null);
      setInput(hecho.input || '');
      setPhase('a');
    } else {
      setPhase('q');
      setInput('');
      setPistas(0);
      setPicked(null);
      setLastOk(false);
    }
  }

  function atras() {
    if (freeNavigation) {
      moverRepaso(-1);
      return;
    }
    if (idx === 0) return;
    verEstado(idx - 1);
  }

  function goNext() {
    if (freeNavigation) {
      moverRepaso(1);
      return;
    }
    advancing.current = false;
    if (idx + 1 < cards.length) {
      verEstado(idx + 1);
    } else {
      finish();
    }
  }

  function continuarTrasCorreccion() {
    if (reviewingMarked && idx + 1 >= cards.length) {
      onExit?.();
      return;
    }
    goNext();
  }

  function moverRepaso(direction) {
    advancing.current = false;
    const result = results.current[idx];
    if (reviewingMistakes && result?.ok) {
      // El acierto sale de la lista al abandonar su corrección; el número del
      // repaso baja ya al acertar, y las demás preguntas conservan su posición.
      reviewHistory.current.push(result);
      const nextQueue = [...cards];
      nextQueue.splice(idx, 1);
      const nextResults = [...results.current];
      nextResults.splice(idx, 1);
      results.current = nextResults;
      setReviewQueue(nextQueue);
      if (!nextQueue.length) {
        finish();
        return;
      }
      const nextIndex = direction > 0
        ? Math.min(idx, nextQueue.length - 1)
        : (idx === 0 ? nextQueue.length - 1 : idx - 1);
      verEstado(nextIndex);
      return;
    }

    if (!cards.length) return;
    const nextIndex = (idx + direction + cards.length) % cards.length;
    verEstado(nextIndex);
  }

  function rateFlash(ok) {
    if (advancing.current) return;
    advancing.current = true;
    // Las flashcards solo actualizan el semáforo visual de la palabra (rojo/
    // amarillo/verde). NO tocan la racha de aciertos seguidos ni el porcentaje
    // del mazo: son repaso visual, no práctica punteable.
    setCardColor(card.de, colorSiguiente(getCardColor(card.de), ok, deToEs));
    results.current[idx] = { card, ok, deToEs, mode: modoCarta };
    setFlash(ok ? 'ok' : 'no');
    fox.acierto(ok);
  }

  function gradeQA(ok, userChoiceOrText = null) {
    recordCard(card.de, ok, {
      mode: modoCarta === 'wortsalat' ? 'order' : modoCarta,
      peso: modoCarta === 'write' || modoCarta === 'wortsalat' ? 2 : 1,
      reviewMistake: reviewingMistakes
    });
    // Escribir la palabra de cero es PRODUCIR; el test es elegir entre
    // cuatro que ya tienes delante, o sea RECONOCER.
    // Las letras que hayas destapado abaratan la pregunta, como en traducir.
    monedas.current += cobrarEjercicio(ok, {
      nivel: modoCarta === 'write'
        ? PRODUCIR
        : modoCarta === 'wortsalat'
          ? RECONSTRUIR
          : RECONOCER,
      pistas: modoCarta === 'write' ? pistas : 0
    });
    results.current[idx] = {
      card,
      ok,
      deToEs,
      // Las opciones que tenias delante, para poder repetir ESTE ejercicio y
      // no otro distinto sobre la misma palabra.
      opciones: modoCarta === 'quiz' ? quizOptions : null,
      picked: modoCarta === 'quiz' ? userChoiceOrText : null,
      orden: modoCarta === 'wortsalat' ? userChoiceOrText : null,
      input: modoCarta === 'write' ? userChoiceOrText : '',
      mode: modoCarta
    };
    const rSeg = apuntarRespuesta(ok);
    if (rSeg.seguidas > mejorSeguidas.current) mejorSeguidas.current = rSeg.seguidas;
    setSeguidas(rSeg.seguidas);
    ultimaSeguidas.current = rSeg;
    setLastOk(ok);
    if (modoCarta === 'wortsalat') setPicked(userChoiceOrText);
    fox.acierto(ok);
    setPhase('a');
  }

  function finish() {
    const seconds = Math.max(1, Math.round((Date.now() - started.current) / 1000));
    const coronaRecienCompletada = !deckStartedComplete.current && deckStats(deck).pct >= 100;
    const validResults = reviewingMistakes
      ? [...reviewHistory.current, ...results.current.filter(Boolean)]
      : results.current.filter(Boolean);
    const correct = validResults.filter((r) => r.ok).length;
    const total = validResults.length || cards.length;
    const acc = total ? correct / total : 0;
    // Las flashcards no cuentan como práctica: solo son repaso visual.
    // No acumulan XP, no cuentan sesión, no aparecen en el leaderboard.
    const isFlash = validResults.every((r) => r.mode === 'flashcards');
    let xp = 0;
    let streak = null;
    let run = null;
    let rank = null;
    if (!isFlash) {
      xp = validResults.reduce((s, r) => s + (r.ok ? 10 : 2), 0);
      if (acc >= 0.9) xp += 5;
      bumpSessions();
      streak = recordActivity(xp, Date.now() - started.current);
      run = saveRun({ topicId: 'vocab:' + deck.id, topicName: 'Vocab · ' + deck.name, mode, game: mode, correct, total, accuracy: Math.round(acc * 100) / 100, seconds, xp });
      rank = rankOfRun(run.id, 'vocab:' + deck.id);
    }
    onFinish({
      deck,
      mode,
      finishTopic: Boolean(finishTopic),
      dir: propDir || null,
      correct,
      total,
      seconds,
      xp,
      streak,
      monedas: isFlash ? 0 : monedas.current,
      soloFlashcards: isFlash,
      rachaMax: mejorSeguidas.current,
      rachaRecord: ultimaSeguidas.current,
      rank,
      coronaRecienCompletada,
      // El fallo viaja con su direccion y sus opciones, para que "repetir los
      // fallos" devuelva EL ejercicio y no otro sobre la misma palabra.
      missed: validResults
        .filter((r) => !r.ok)
        .map((r) => ({ ...r.card, _deToEs: r.deToEs, _opciones: r.opciones }))
    });
  }

  const currentResult = reviewingMistakes ? results.current[idx] : null;
  const reviewRemaining = Math.max(0, cards.length - (currentResult?.ok ? 1 : 0));
  const reviewPosition = reviewingMistakes ? (card?._reviewPosition || idx + 1) : idx + 1;
  const reviewProgressTotal = reviewingMistakes ? reviewTotal.current : cards.length;
  const reviewCounterTotal = reviewingMistakes ? reviewRemaining : reviewProgressTotal;
  const reviewCounterPosition = reviewingMistakes ? Math.min(idx + 1, reviewRemaining) : reviewPosition;
  const progressPct = freeNavigation
    ? (reviewingMistakes
      ? ((reviewProgressTotal - reviewRemaining) / Math.max(1, reviewProgressTotal)) * 100
      : ((reviewPosition - 1) / Math.max(1, reviewProgressTotal)) * 100)
    : ((idx + (modoCarta === 'flashcards' ? 1 : 0)) / cards.length) * 100;

  return (
    <div className="vocab-session">
      <div className="progress-top">
        <button className="btn-ghost ses-icon-btn" onClick={onExit} title={t('ses.exit')}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <div className="bar"><span style={{ width: progressPct + '%' }} /></div>
        {freeNavigation ? (
          <>
            <button className="btn-ghost ses-atras ses-icon-btn" onClick={atras} disabled={cards.length < 2} title={t('ses.prev')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="btn-ghost ses-siguiente ses-icon-btn" onClick={goNext} disabled={cards.length < 2 && !(reviewingMistakes && currentResult?.ok)} title={t('ses.next')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </>
        ) : idx > 0 && (modoCarta === 'flashcards' || results.current[idx - 1]) && (
          <button className="btn-ghost ses-atras ses-icon-btn" onClick={atras} title={t('ses.prev')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        {!freeNavigation && modoCarta === 'flashcards' && (
          <button className="btn-ghost ses-siguiente ses-icon-btn" onClick={goNext} title={t('ses.next')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        )}
        <span className="timer">{freeNavigation
          ? `${reviewCounterPosition}/${reviewCounterTotal}`
          : `${idx + 1}/${cards.length}`}</span>
      </div>

      {/* El contexto (de qué mazo es y en qué sentido va) y el ejercicio
          necesitan aire entre medias: pegados se leían como una sola cosa. El
          hueco va en la clase, que en el móvil es otro. */}
      <div className="ctx-fila">
        <span className="row ctx-pills-left" style={{ gap: 8, minWidth: 0, flexWrap: 'wrap' }}>
          <span className="pill ctx-tema">{deck.emoji} {String(deck.id || '').startsWith('combi:')
            ? pick('Vocabulario mixto', 'Mixed vocabulary')
            : reviewingMistakes || reviewingMarked
              ? `${pick('Vocabulario', 'Vocabulary')} · ${deck.name}`
              : deck.name}</span>
          {!((finishTopic || reviewingMistakes) && mode === 'quiz') && (
            <GameModePill mode={mode === 'write' ? 'write-vocab' : mode} />
          )}
          {reviewingMistakes && <span className="pill ctx-tema review-mistakes-count">{t('gr.reviewWeakPill')}</span>}
          {reviewingMarked && <span className="pill ctx-tema">{t('star.reviewPill')}</span>}
          {finishTopic && <span className="pill ctx-tema">{t('voc.finishPill')}</span>}
        </span>
        {/* La flecha, en su propio <span>: el glifo → se dibuja centrado en la
            altura de una minúscula, y al lado de DE / EN, que son todo
            mayúsculas, se veía caída. Se sube lo que mide esa diferencia. */}
        <span className="row" style={{ gap: 8 }}>
          <span className="pill">
            {deToEs ? 'DE' : codigoIdioma()}
            <span className="pill-flecha">→</span>
            {deToEs ? codigoIdioma() : 'DE'}
          </span>
          <StarButton item={{ ...card, id: 'vocab:' + (card.id || card.de), deckId: deck?.id, lektionId: deck?.lektionId, starMode: modoGuardado, _deToEs: deToEs }} />
          <RachaPill n={seguidas} />
          <Reloj desde={started.current} />
        </span>
      </div>

      {/* ---------- TARJETAS ---------- */}
      <div key={idx} className="question-swap">
      {modoCarta === 'flashcards' && (
        <div className="fc-wrap">
          <div
            className={'flashcard' + (revealed ? ' flipped' : '') + (flash ? ' flash-' + flash : '')}
            onClick={() => {
              if (flash) return;
              setRevealed((r) => !r);
              setSeenBack(true);
            }}
          >
            <div className="fc-inner">
              <div className="fc-face fc-front">
                <span className="fc-word">{deToEs ? card.de : textoTarjetaEs(card)}</span>
                <span className="fc-hint">{seenBack ? t('vs.tapToFlip') : t('vs.tapToSee')}</span>
              </div>
              <div className="fc-face fc-back">
                <span className="fc-word">{deToEs ? textoTarjetaEs(card) : card.de}</span>
                {card.ex && <span className="fc-ex">{card.ex}</span>}
                {(ejemploTarjetaEs(card)) && <span className="fc-ex-es">{ejemploTarjetaEs(card)}</span>}
              </div>
            </div>
          </div>

          {!seenBack ? (
            <button className="btn-ghost fc-reveal" onClick={() => { setRevealed(true); setSeenBack(true); }}>
              {t('vs.seeTranslation')}
            </button>
          ) : (
            <div className="judge-row fc-rate">
              <button className="judge-btn no" disabled={!!flash} onClick={() => rateFlash(false)}>
                {t('vs.didNotKnow')}
              </button>
              <button className="judge-btn yes" disabled={!!flash} onClick={() => rateFlash(true)}>
                {t('vs.knewIt')}
              </button>
            </div>
          )}
        </div>
      )}

      {/* ---------- TEST ---------- */}
      {modoCarta === 'quiz' && (
        <div className="qa-wrap">
          <div className="prompt-label">{t('vs.whatMeans')}</div>
          <div className="sentence">{prompt}</div>
          <div className="options">
            {quizOptions.map((opt, i) => {
              const visibleOpt = tc(opt);
              let cls = 'option';
              if (phase === 'a') {
                if (visibleOpt === answer) cls += ' correct';
                else if (visibleOpt === tc(picked)) cls += ' wrong';
                else cls += ' dim';
              }
              return (
                <button key={i} className={cls} disabled={phase === 'a'} onClick={() => { setPicked(visibleOpt); gradeQA(visibleOpt === answer, visibleOpt); }}>
                  {i < 9 && <span className="op-tecla">{i + 1}</span>}
                  {visibleOpt}
                </button>
              );
            })}
          </div>
          {phase === 'a' && <QAFeedback
            card={card}
            ok={lastOk}
            answer={answer}
            onNext={continuarTrasCorreccion}
            last={reviewingMarked ? idx + 1 >= cards.length : reviewingMistakes ? Boolean(lastOk && cards.length === 1) : idx + 1 >= cards.length}
            lastLabel={reviewingMarked ? t('vsum.backExercises') : null}
          />}
        </div>
      )}

      {/* ---------- ESCRIBIR ---------- */}
      {modoCarta === 'write' && (
        <div className="qa-wrap write-exercise vocab-write-exercise">
          <div className="prompt-label">{t('vs.writeTranslation')} {deToEs ? t('vs.toEs') : t('vs.toDe')}</div>
          <div className="sentence">{prompt}</div>
          {phase === 'q' ? (
            <form className="write-fila vocab-write-form" onSubmit={(e) => { e.preventDefault(); if (input.trim()) gradeQA(checkWritten(input, answer), input.trim()); }}>
              {/* La inicial de cada palabra delante. Sin ella hay que dar con
                  la palabra exacta a la primera, que no es lo que se practica
                  aquí. */}
              <PistaLetras
                key={card?.id || idx}
                respuesta={answer}
                pistas={pistas}
                onPedir={() => setPistas((n) => n + 1)}
                resetKey={card?.id || idx}
                onRendir={() => gradeQA(false, '')}
                textoRendir={pick('No me sale', 'I give up')}
                mostrarAtajo={false}
              />
              <input
                ref={inputRef}
                className="vs-respuesta write-input"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    e.stopPropagation();
                    gradeQA(input.trim() ? checkWritten(input, answer) : false, input.trim());
                  } else if (
                    ((e.ctrlKey || e.altKey) && (e.key === 'p' || e.key === 'P' || e.key === 'h' || e.key === 'H')) ||
                    e.key === 'F2'
                  ) {
                    e.preventDefault();
                    setPistas((n) => n + 1);
                  }
                }}
                placeholder={t('vs.yourAnswer')}
                autoComplete="off"
              />
              <Umlaut campo={inputRef} onTexto={setInput} />
              <button className="btn-primary btn-corregir" disabled={!input.trim()}>{t('ses.check')}</button>
            </form>
          ) : (
            <>
              <p className="muted" style={{ marginTop: 6 }}>
                {t('vs.youWrote')} <strong style={{ color: lastOk ? 'var(--good)' : 'var(--bad)' }}>{input || '—'}</strong>
              </p>
              <QAFeedback
                card={card}
                ok={lastOk}
                answer={answer}
                onNext={continuarTrasCorreccion}
                last={reviewingMarked ? idx + 1 >= cards.length : reviewingMistakes ? Boolean(lastOk && cards.length === 1) : idx + 1 >= cards.length}
                lastLabel={reviewingMarked ? t('vsum.backExercises') : null}
              />
            </>
          )}
        </div>
      )}

      {modoCarta === 'wortsalat' && (
        <>
          <WortsalatQuestion
          key={`${card.id || card.de}-${idx}`}
          item={{
            id: card.id || card.de,
            sentence: objetivoWortsalat(card.de),
            vocabCardDe: card.de,
            translation: textoTarjetaEs(card)
          }}
          disabled={phase === 'a'}
          correct={lastOk}
          chosen={picked}
          onAnswer={(ok, order) => gradeQA(ok, order)}
          />
          {phase === 'a' && <QAFeedback
            card={card}
            ok={lastOk}
            answer={card.de}
            onNext={continuarTrasCorreccion}
            last={reviewingMarked ? idx + 1 >= cards.length : idx + 1 >= cards.length}
            lastLabel={reviewingMarked ? t('vsum.backExercises') : null}
          />}
        </>
      )}
      </div>

      <FoxOverlay fox={fox} mudo={phase === 'a'} racha={seguidas} />
    </div>
  );
}

function QAFeedback({ card, ok, answer, onNext, last, lastLabel = null }) {
  return (
    <div className={'feedback ' + (ok ? 'ok' : 'no')}>
      <div className="verdict">{ok ? t('fb.right') : t('fb.wrong')}</div>
      <div className="de">{card.de} — {card._traducible ? tc(card._esBase) : card.es}</div>
      {!ok && <div className="es">{t('vs.answerIs')} <strong>{answer}</strong></div>}
      {card.ex && (
        <div className="why">
          <span className="lang-tag">{t('vs.egTag')}</span>{card.ex}{card.exEs ? ` — ${card._traducible ? tc(card._exEsBase) : card.exEs}` : ''}
        </div>
      )}
      <button className="btn-primary" style={{ marginTop: 14 }} onClick={onNext}>
        {last ? (lastLabel || t('fb.results')) : t('ueb.siguiente')}
      </button>
    </div>
  );
}
