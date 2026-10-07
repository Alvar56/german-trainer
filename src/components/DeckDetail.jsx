import React, { useState } from 'react';
import IconoJuego, { conSimbolo } from './IconoJuego.jsx';
import { conjugar } from '../lib/conjugador.js';
import { SIN_IA, PORTABLE } from '../lib/modo.js';
import { deckStats, deleteUserDeck, vocabModes, cartasFalladas, cartasQueFaltan, getCardColor, setCardColor, colorVisible, esVerbo } from '../lib/vocab.js';
import { t, pick } from '../lib/i18n.js';
import { getStarredItems, groupStarredVocab, useStars } from '../lib/stars.js';
import { aiAvailable } from '../lib/settings.js';
import { generateConjugation } from '../lib/ai.js';
import CoronaPanel, { BarrasTema } from './ProgresoTema.jsx';
import AmpliarTema from './AmpliarTema.jsx';
import { UMBRAL_TERMINAR } from '../lib/progress.js';
import { crucigramasResueltos, MAX_CRUCIGRAMAS_VOCAB, UMBRAL_CRUCIGRAMA_VOCAB } from '../lib/vocabRewards.js';
import Escuchar from './Escuchar.jsx';
import PuntoColor from './PuntoColor.jsx';
import ModalConjugacion from './ModalConjugacion.jsx';
import FotosVocab from './FotosVocab.jsx';
import Tabs from './Tabs.jsx';

// Mismas dos pestañas que en Grammatik: primero te lees las palabras, luego
// juegas. Antes salía todo de corrido y los juegos tapaban la lista, que es
// justo lo que quieres mirar antes de ponerte a practicar.
export default function DeckDetail({ deck, tab = 'teoria', onTab, onStart, onReto, onBack, onDeleted }) {
  const setTab = (t) => onTab?.(t);
  const [showText, setShowText] = useState(true);
  const [loadingVerb, setLoadingVerb] = useState(null);
  const [conjugation, setConjugation] = useState(null);
  useStars();
  const st = deckStats(deck);
  const tarjetasPendientes = cartasQueFaltan(deck);
  // El porcentaje visible se redondea. Si muestra 100 %, el crucigrama debe
  // desbloquearse con ese mismo porcentaje, aunque quede una fracción interna.
  const crucigramaBloqueado = !deck.cards?.length || st.pct < UMBRAL_CRUCIGRAMA_VOCAB;
  const fallos = cartasFalladas(deck);
  const crucigramasHechos = crucigramasResueltos(deck.id);
  const aiOn = aiAvailable();
  const allStarredVocab = getStarredItems('vocab');
  const starred = allStarredVocab.filter(i =>
    deck.cards?.some(c =>
      (c.id || c.de).toLowerCase() ===
      (i.de || i.id || String(i.id).replace('vocab:', '')).toLowerCase()
    )
  );
  const starredGroups = groupStarredVocab(starred);

  const handleConjugate = async (verb, traduccion) => {
    // Primero el conjugador local: es instantaneo, va sin red y acierta con
    // todo lo que hay en el libro. La IA queda de respaldo para lo que no
    // cubra, y en la version sin IA simplemente no se ofrece el boton.
    const local = conjugar(verb, traduccion);
    if (local) {
      setConjugation({ ...local, translation: traduccion || local.infinitivo });
      return;
    }
    if (SIN_IA) return;
    setLoadingVerb(verb);
    try {
      const data = await generateConjugation({ verb });
      setConjugation(data);
    } catch (e) {
      alert(e.message);
    }
    setLoadingVerb(null);
  };

  return (
    <div>
      <div className="topbar">
        <div className="min0">
          <h1><button type="button" className="titulo-volver" onClick={onBack}>{deck.emoji} {deck.name}</button></h1>
          <p className="muted" style={{ marginTop: 4, fontSize: '0.9rem' }}>
            {t('voc.deckStats', { total: st.total, known: st.known, pct: st.pct, mastered: st.mastered })}
            {deck.builtin ? '' : deck.source === 'ai' ? t('voc.aiCreated') : t('voc.importedLabel')}
          </p>
        </div>
        <button className="link-btn" onClick={onBack} style={{ flexShrink: 0 }}>
          <span className="fl-atras">◂</span> {deck.lektionName ? deck.lektionName : 'Wortschatz'}
        </button>
      </div>

      <BarrasTema topicId={'vocab:' + deck.id} pct={st.pct} />

      <Tabs>
        <button className={'tab' + (tab === 'teoria' ? ' active' : '')} onClick={() => setTab('teoria')}>
          {conSimbolo(t('gr.theory'))}
        </button>
        <button
          className={'tab' + (tab === 'ejercicios' ? ' active' : '')}
          onClick={() => setTab('ejercicios')}
        >
          {conSimbolo(t('gr.exercises'))}
        </button>
        {!PORTABLE && (
          <button className={'tab' + (tab === 'fotos' ? ' active' : '')} onClick={() => setTab('fotos')}>
            {conSimbolo('📸 ' + pick('Fotos', 'Photos'))}
          </button>
        )}
      </Tabs>

      {tab === 'teoria' && (
        <div className="stack">
          {deck.text && (
            <div className="panel">
              <div className="row spread">
                <h2 style={{ margin: 0 }}>📖 {t('voc.topicText')}</h2>
                <button className="link-btn" onClick={() => setShowText((s) => !s)}>
                  {showText ? t('voc.hide') : t('voc.show')}
                </button>
              </div>
              {showText && (
                <div style={{ marginTop: 12 }}>
                  <p style={{ lineHeight: 1.7 }}>{deck.text}</p>
                  {deck.textEs && (
                    <p className="muted" style={{ marginTop: 10, fontSize: '0.9rem' }}>{deck.textEs}</p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="panel">
            <h2>{t('voc.allCards', { n: deck.cards.length })}</h2>
            <div className="card-list-grid">
              {deck.cards.map((c, i) => (
                <VocabCard
                  key={i}
                  card={c}
                  deckId={deck.id}
                  onConjugate={handleConjugate}
                  loadingVerb={loadingVerb}
                />
              ))}
            </div>
          </div>

          <div className="panel" style={{ marginTop: 8, marginBottom: 16 }}>
            <h2 style={{ margin: '0 0 14px' }}>{t('voc.cards')}</h2>
            <div className="row" style={{ gap: 8 }}>
              <button className="gametype" style={{ flex: 1 }} onClick={() => onStart(deck.id, 'flashcards', false, 'de-es')}>
                <IconoJuego e="🃏" />
                <span className="gt-txt"><span>{t('voc.deToEs')}</span></span>
              </button>
              <button className="gametype" style={{ flex: 1 }} onClick={() => onStart(deck.id, 'flashcards', false, 'es-de')}>
                <IconoJuego e="🃏" />
                <span className="gt-txt"><span>{t('voc.esToDe')}</span></span>
              </button>
            </div>
          </div>

          {/* Con todo el mazo en verde se abre pedirle más palabras del mismo
              campo a la IA. Al final, después de la lista y de las tarjetas. */}
          <AmpliarTema deck={deck} onCreado={onBack} />

          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <button
              className="btn-primary"
              onClick={() => setTab('ejercicios')}
            >
              {t('gr.toExercises')}
            </button>

            {!deck.builtin && (
              <button
                className="btn-ghost btn-sm"
                style={{ color: 'var(--bad)', borderColor: 'var(--bad-border)' }}
                onClick={() => {
                  if (confirm(t('voc.confirmDeleteDeck', { name: deck.name }))) {
                    deleteUserDeck(deck.id);
                    onDeleted();
                  }
                }}
              >
                {t('voc.deleteDeck')}
              </button>
            )}
          </div>
        </div>
      )}

      {tab === 'ejercicios' && (
        <div className="stack">
          <div className="panel">
            <h2 style={{ margin: '0 0 14px' }}>{t('gr.practise')}</h2>
            <div className="gametype-label">{t('gr.pickGame')}</div>
            <div className="gametype-grid">
              {vocabModes().filter(m => m.id !== 'flashcards').map((m) => (
                <button className="gametype" key={m.id} onClick={() => onStart(deck.id, m.id)}>
                  <IconoJuego e={m.emoji} />
                  <span className="gt-txt">
                    <span>{m.label}</span>
                    <small>{m.hint}</small>
                  </span>
                </button>
              ))}
            </div>

            <p className="muted" style={{ fontSize: '0.78rem', marginTop: 12 }}>
              {aiOn ? t('voc.source') : t(SIN_IA ? 'voc.sourceSinIA' : 'voc.sourceOff')}
            </p>

            <div className="btn-row" style={{ marginTop: 12 }}>
              {starredGroups.map((group) => {
                return (
                  <button
                    className="btn-ghost btn-sm"
                    key="starred-vocab"
                    onClick={() => onStart(deck.id, group.mode, false, group.dir, group.items, null, 'marked')}
                  >
                    {conSimbolo(t('star.review', { n: group.items.length }))}
                  </button>
                );
              })}
              {fallos.length > 0 && (
                <button
                  className="btn-ghost btn-sm"
                  onClick={() => onStart(deck.id, 'quiz', true)}
                  title={t('gr.reviewWeakHint')}
                >
                  {conSimbolo(t('gr.reviewWeakN', { n: fallos.length }))}
                </button>
              )}
              {tarjetasPendientes.length > 0 && (
                <button
                  className="btn-ghost btn-sm"
                  onClick={() => onStart(deck.id, 'quiz', 'faltan')}
                  disabled={st.pct < UMBRAL_TERMINAR}
                  title={st.pct < UMBRAL_TERMINAR ? t('voc.finishLockedHint', { p: UMBRAL_TERMINAR }) : t('voc.finishHint')}
                >
                  {st.pct < UMBRAL_TERMINAR
                    ? conSimbolo(t('voc.finishLocked', { p: UMBRAL_TERMINAR }))
                    : conSimbolo(t('voc.finish', { n: tarjetasPendientes.length }))}
                </button>
              )}
              {/* El crucigrama se abre al dominar todas las palabras del tema. */}
              <button
                className="btn-ghost btn-sm"
                onClick={() => onStart(deck.id, 'crossword')}
                disabled={crucigramaBloqueado || crucigramasHechos >= MAX_CRUCIGRAMAS_VOCAB}
                title={crucigramaBloqueado
                  ? t('voc.crosswordLockedHint', { p: UMBRAL_CRUCIGRAMA_VOCAB })
                  : crucigramasHechos >= MAX_CRUCIGRAMAS_VOCAB
                    ? t('voc.crosswordFinishedHint')
                    : t('voc.crosswordHint')}
              >
                {crucigramaBloqueado
                  ? conSimbolo(t('voc.crosswordLocked', { p: UMBRAL_CRUCIGRAMA_VOCAB }))
                  : conSimbolo(t('voc.crosswordProgress', { n: crucigramasHechos, total: MAX_CRUCIGRAMAS_VOCAB }))}
              </button>
              {aiOn && (
                <button className="btn-ghost btn-sm" onClick={() => onReto(deck.id)}>
                  {conSimbolo(t('gr.aiChallenge'))}
                </button>
              )}
            </div>
            {fallos.length > 0 && (
              <p className="muted" style={{ fontSize: '0.78rem', marginTop: 10 }}>
                {t(fallos.length === 1 ? 'voc.missedWords' : 'voc.missedWordsPl', { n: fallos.length })}
              </p>
            )}
            {st.pct < 100 && <CoronaPanel topicId={'vocab:' + deck.id} pct={st.pct} />}
          </div>
          {st.pct >= 100 && <CoronaPanel topicId={'vocab:' + deck.id} pct={st.pct} />}
        </div>
      )}

      {!PORTABLE && tab === 'fotos' && (
        <FotosVocab ownerId={`deck:${deck.id}`} nombre={deck.name} />
      )}

      <ModalConjugacion conjugation={conjugation} onClose={() => setConjugation(null)} />
    </div>
  );
}

function VocabCard({ card, deckId, onConjugate, loadingVerb }) {
  const [color, setColor] = useState(() => getCardColor(card.de) || 'transparent');

  const word = card.de.split(' ')[0].replace(/[^a-zA-ZäöüÄÖÜß]/g, '');
  const isVerb = esVerbo(card.de);

  const handleColor = (c) => {
    setColor(c);
    setCardColor(card.de, c === 'transparent' ? null : c);
  };

  // Igual que en la lista: el color no pinta la tarjeta, vive en el punto de
  // la derecha, y ahi se ve tanto el que marcas a mano como el que sale de
  // practicar (colorVisible).
  const computedColor = color !== 'transparent' ? color : (colorVisible(card.de) || 'transparent');

  return (
    <div className="card-mini" style={{ position: 'relative' }}>
      <div className="row spread" style={{ alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: 600 }}>{card.de}</div>
          <div className="muted" style={{ fontSize: '0.82rem' }}>{card.es}</div>
        </div>
        <div className="row" style={{ gap: 8, alignItems: 'center' }}>
          {isVerb && (
            <button 
              className="btn-ghost btn-conjugar" 
              onClick={() => onConjugate(word, card.es)}
              disabled={loadingVerb === word}
            >
              {loadingVerb === word ? t('loading') : t('voc.conjugate')}
            </button>
          )}
          {/* Sin estrella en la lista de palabras: aqui se lee el tema, no se
              practica. Marcar se hace donde te sale la palabra en un ejercicio,
              que es cuando sabes si se te resiste. */}
          {/* El altavoz, pegado al punto de color: los dos son cosas que le
              haces a esa palabra concreta. */}
          <Escuchar texto={card.de} />
          <PuntoColor color={computedColor} onElegir={handleColor} />
        </div>
      </div>
    </div>
  );
}
