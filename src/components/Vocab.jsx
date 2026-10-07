import React, { useMemo, useRef, useState } from 'react';
import IconoJuego, { conSimbolo } from './IconoJuego.jsx';
import { conjugar } from '../lib/conjugador.js';
import { SIN_IA, PORTABLE } from '../lib/modo.js';
import BookNav from './BookNav.jsx';
import { allDecks, deckStats, saveUserDeck, vocabSections, genderStats, GENDER_NIVELES, vocabModes, cartasFalladas, cartasQueFaltan, limpiarColores, getCardColor, setCardColor, colorVisible, esVerbo, getDeck } from '../lib/vocab.js';
import { KURSBUCH, getLektion, lektionLabel, lektionDecks, lektionDeckTodo } from '../lib/kursbuch/index.js';
import { generateVocab, generateConjugation } from '../lib/ai.js';
import { aiAvailable } from '../lib/settings.js';
import { t, pick } from '../lib/i18n.js';
import { getStarredItems, groupStarredVocab, useStars } from '../lib/stars.js';
import Cargando from './Cargando.jsx';
import Sugerencias from './Sugerencias.jsx';
import CoronaPanel, { BarrasTema } from './ProgresoTema.jsx';
import AmpliarTema from './AmpliarTema.jsx';
import { UMBRAL_TERMINAR } from '../lib/progress.js';
import { crucigramasResueltos, MAX_CRUCIGRAMAS_VOCAB, UMBRAL_CRUCIGRAMA_VOCAB } from '../lib/vocabRewards.js';
import Escuchar from './Escuchar.jsx';
import MezclaVocab from './MezclaVocab.jsx';
import PuntoColor from './PuntoColor.jsx';
import ModalConjugacion from './ModalConjugacion.jsx';
import EtiquetaChip from './EtiquetaChip.jsx';
import FotosVocab from './FotosVocab.jsx';
import Tabs from './Tabs.jsx';
import Desplegable from './Desplegable.jsx';
function CustomDropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const selected = options.find((o) => o.value === value) || options[0];

  return (
    <div className="voc-deck-dropdown-anchor">
      <button
        className="link-btn"
        style={{ fontSize: '0.82rem', padding: 0 }}
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        {selected.label} ▾
      </button>

      <div className="voc-deck-dropdown-popup">
        <Desplegable abierto={open} className="voc-deck-dropdown-menu">
          <div className="card voc-deck-dropdown-card" role="listbox">
          {options.map((o) => (
            <button
              key={o.value}
              className="link-btn"
              role="option"
              aria-selected={o.value === value}
              style={{
                textAlign: 'right',
                padding: '6px 12px',
                color: o.value === value ? 'var(--text)' : 'var(--text-2)',
                fontWeight: o.value === value ? '600' : '400',
                borderRadius: 4
              }}
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--surface-2)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; }}
            >
              {o.label}
            </button>
          ))}
          </div>
        </Desplegable>
      </div>
      {open && (
        <div
          className="voc-deck-dropdown-overlay"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}

function DeckCard({ deck, onOpen }) {
  const s = deckStats(deck);
  return (
    <button className="card topic-open" onClick={() => onOpen(deck.id)}>
      <div className="row spread" style={{ alignItems: 'flex-start' }}>
        <div className="flex-min">
          <div className="t-title">{deck.emoji} {deck.name}</div>
          <div className="t-blurb">
            {s.total} {t('voc.cardsN')}
            {deck.builtin ? '' : deck.source === 'ai' ? ' · IA' : ' · ' + t('voc.imported')}
          </div>
        </div>
        <span className="pill">{s.pct}%</span>
      </div>
      <div className="mini-bar" style={{ margin: '14px 0 8px' }}>
        <span style={{ width: s.pct + '%' }} />
      </div>
      <div className="muted" style={{ fontSize: '0.78rem' }}>
        {s.known} {t('voc.known')} · {s.fresh} {t('voc.fresh')}
      </div>
    </button>
  );
}

// Temas de ejemplo para el generador, como las dudas sugeridas de Gramatica:
// delante de una caja vacia uno no sabe ni por donde empezar.
const TEMAS_ES = [
  'En el aeropuerto',
  'Ir al médico',
  'Buscar piso',
  'En la oficina',
  'Cocinar',
  'El tiempo y el clima',
  'El cuerpo humano',
  'Deportes de invierno',
  'En el supermercado',
  'Muebles y casa',
  'Emociones y carácter',
  'Dinero y banco',
  'Viajar en tren',
  'Reciclaje y medio ambiente',
  'Ordenador e internet',
  'La ciudad y el barrio',
  'Fiestas y tradiciones austriacas',
  'Ropa y complementos',
  'Animales',
  'Estudios y universidad',
  'Herramientas y arreglos',
  'Música e instrumentos'
];
const TEMAS_EN = [
  'At the airport',
  'Going to the doctor',
  'Flat hunting',
  'At the office',
  'Cooking',
  'Weather and climate',
  'The human body',
  'Winter sports',
  'At the supermarket',
  'Furniture and the home',
  'Feelings and character',
  'Money and banking',
  'Travelling by train',
  'Recycling and the environment',
  'Computers and the internet',
  'The city and the neighbourhood',
  'Austrian holidays and traditions',
  'Clothes and accessories',
  'Animals',
  'Studying and university',
  'Tools and repairs',
  'Music and instruments'
];
const TEMAS_SUG = () => pick(TEMAS_ES, TEMAS_EN);

export default function Vocab({ lektionId, tab, onTab, onOpenLektion, onOpen, onGenderGame, onBack, onChanged, onStart, onReto }) {
  if (lektionId) {
    return <LektionVocab lektionId={lektionId} tab={tab} onTab={onTab} onStart={onStart} onReto={onReto} onBack={onBack} />;
  }
  return (
    <VocabHome
      onOpenLektion={onOpenLektion}
      onOpen={onOpen}
      onGenderGame={onGenderGame}
      onChanged={onChanged}
      onStart={onStart}
    />
  );
}

// ---------- vocabulario de una lección ----------
// Igual que una lección de Grammatik: dos pestañas, primero todo el material
// y luego los ejercicios sobre ese material.
// El tomo del Kursbuch como nivel legible: 'a21' -> 'A2.1'. La IA lo usa para
// medir cuanto puede apretar al proponer palabras nuevas.
function nivelDe(lektion) {
  const m = /^a(\d)(\d)$/.exec(String(lektion?.bandId || ''));
  return m ? `A${m[1]}.${m[2]}` : 'A2';
}

function LektionVocab({ lektionId, tab = 'teoria', onTab, onStart, onReto, onBack }) {
  const [, forceUpdate] = React.useReducer(x => x + 1, 0);
  // Todos los hooks por delante del `return` de "lección no encontrada".
  // Estaban por debajo, así que pasar de un lektionId malo a uno bueno sin
  // desmontar cambiaba el número de hooks entre dos pintados y React tiraba
  // la pantalla. Es el mismo fallo que reventaba Emparejar y Blitz en
  // Gramática. Arrancan con constantes, así que subirlos no cambia nada.
  useStars();
  const [loadingVerb, setLoadingVerb] = useState(null);
  const [selectedDeckId, setSelectedDeckId] = useState('');
  const [conjugation, setConjugation] = useState(null);
  const setTab = (t) => onTab?.(t);
  const lektion = getLektion(lektionId);
  if (!lektion) {
    return (
      <div className="card center stack">
        <p>{t('notFound')}</p>
        <button className="btn-ghost" onClick={onBack}>{t('back')}</button>
      </div>
    );
  }
  const decks = lektionDecks(lektion);
  const todo = lektionDeckTodo(lektion);
  const total = decks.reduce((s2, d) => s2 + d.cards.length, 0);
  const st = todo ? deckStats(todo) : { pct: 0, known: 0 };
  const tarjetasPendientes = todo ? cartasQueFaltan(todo) : [];
  // Mantener el desbloqueo alineado con el porcentaje que se muestra arriba,
  // que se redondea y puede llegar a 100 % antes de agotar cada acierto.
  const crucigramaBloqueado = !todo?.cards?.length || st.pct < UMBRAL_CRUCIGRAMA_VOCAB;
  const fallos = todo ? cartasFalladas(todo) : [];
  const crucigramasHechos = todo ? crucigramasResueltos(todo.id) : 0;
  const aiOn = aiAvailable();

  const allStarredVocab = getStarredItems('vocab');
  const starredVocab = allStarredVocab.filter((i) =>
    todo?.cards?.some(
      (c) =>
        (c.id || c.de).toLowerCase() ===
        (i.de || i.id || String(i.id).replace('vocab:', '')).toLowerCase()
    )
  );
  const starredVocabGroups = groupStarredVocab(starredVocab);

  const activeDeckId = selectedDeckId || (todo ? todo.id : null);

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
          <h1><button type="button" className="titulo-volver" onClick={onBack}>{lektionLabel(lektion)}</button></h1>
          <p className="muted" style={{ marginTop: 4, fontSize: '0.9rem' }}>
            {lektion.bandName} · {total} {t('words')} · {st.known}/{total} {t('voc.known')} ({st.pct}%)
          </p>
        </div>
        <button className="link-btn" onClick={onBack} style={{ flexShrink: 0 }}><span className="fl-atras">◂</span> Wortschatz</button>
      </div>

      <BarrasTema topicId={todo ? 'vocab:' + todo.id : ''} pct={st.pct} />

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
          {/* Las palabras a la vista y agrupadas por tema. Antes había que
              entrar en cada tema por separado para verlas. */}
          {decks.map((d) => (
            <div className="panel" key={d.id}>
              <div className="row spread" style={{ marginBottom: 8 }}>
                <h2 style={{ margin: 0 }}>{d.name}</h2>
                <span className="muted" style={{ fontSize: '0.82rem' }}>
                  {d.cards.length} {t('words')}
                </span>
              </div>
              <div className="scroll-x">
                <table className="woerter-tabla">
                  <tbody>
                    {d.cards.map((c, i2) => (
                      <VocabTableRow 
                        key={i2} 
                        c={c} 
                        deckId={d.id} 
                        lektionId={lektion.id}
                        onConjugate={handleConjugate} 
                        loadingVerb={loadingVerb} 
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}

          {todo && (
            <div className="panel" style={{ marginTop: 8, marginBottom: 16 }}>
              <h2 style={{ margin: '0 0 14px' }}>{t('voc.cards')}</h2>
              <div className="row" style={{ gap: 8 }}>
                <button className="gametype" style={{ flex: 1 }} onClick={() => onStart(activeDeckId, 'flashcards', false, 'de-es')}>
                  <IconoJuego e="🃏" />
                  <span className="gt-txt"><span>{t('voc.deToEs')}</span></span>
                </button>
                <button className="gametype" style={{ flex: 1 }} onClick={() => onStart(activeDeckId, 'flashcards', false, 'es-de')}>
                  <IconoJuego e="🃏" />
                  <span className="gt-txt"><span>{t('voc.esToDe')}</span></span>
                </button>
              </div>
              
              <div className="row spread" style={{ marginTop: 14 }}>
                <button 
                  className="link-btn" 
                  style={{ fontSize: '0.82rem', padding: 0 }}
                  onClick={() => {
                    if (window.confirm(t('voc.confirmClearColours'))) {
                      limpiarColores(getDeck(activeDeckId) || todo);
                      forceUpdate();
                    }
                  }}
                >
                  {t('voc.clearColours')}
                </button>

                {decks.length > 1 && (
                  <CustomDropdown
                    options={[
                      { value: todo.id, label: t('voc.allLesson') },
                      ...decks.map((d) => ({ value: d.id, label: d.name }))
                    ]}
                    value={activeDeckId || todo.id}
                    onChange={setSelectedDeckId}
                  />
                )}
              </div>
            </div>
          )}

          {/* Uno solo para toda la lección, al final. Uno por tabla repetía
              el mismo cartel seis veces y partía la lista de palabras. */}
          {todo && (
            <AmpliarTema
              deck={todo}
              niveau={nivelDe(lektion)}
              subtemas={decks.map((d) => d.name)}
            />
          )}

          <button
            className="btn-primary"
            style={{ alignSelf: 'flex-start' }}
            onClick={() => setTab('ejercicios')}
          >
            {t('gr.toExercises')}
          </button>
        </div>
      )}

      <ModalConjugacion conjugation={conjugation} onClose={() => setConjugation(null)} />

      {/* Los juegos van sobre TODA la lección de una, no tema por tema: es una
          sola lección de clase y partirla en tandas de diez era puro trámite. */}
      {tab === 'ejercicios' && todo && (
        <div className="stack">
          <div className="panel">
            <h2 style={{ margin: '0 0 14px' }}>{t('gr.practise')}</h2>
            <div className="gametype-label">{t('gr.pickGame')}</div>
            <div className="gametype-grid">
              {vocabModes().filter(m => m.id !== 'flashcards').map((m) => (
                <button className="gametype" key={m.id} onClick={() => onStart(todo.id, m.id)}>
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
              {starredVocabGroups.map((group) => {
                return (
                  <button
                    className="btn-ghost btn-sm"
                    key="starred-vocab"
                    onClick={() => onStart(todo.id, group.mode, false, group.dir, group.items, null, 'marked')}
                  >
                    {conSimbolo(t('star.review', { n: group.items.length }))}
                  </button>
                );
              })}
              {fallos.length > 0 && (
                <button
                  className="btn-ghost btn-sm"
                  onClick={() => onStart(todo.id, 'quiz', true)}
                  title={t('gr.reviewWeakHint')}
                >
                  {conSimbolo(t('gr.reviewWeakN', { n: fallos.length }))}
                </button>
              )}
              {tarjetasPendientes.length > 0 && (
                <button
                  className="btn-ghost btn-sm"
                  onClick={() => onStart(todo.id, 'quiz', 'faltan')}
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
                onClick={() => onStart(todo.id, 'crossword')}
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
                <button className="btn-ghost btn-sm" onClick={() => onReto(todo.id)}>
                  {conSimbolo(t('gr.aiChallenge'))}
                </button>
              )}
            </div>
            {fallos.length > 0 && (
              <p className="muted" style={{ fontSize: '0.78rem', marginTop: 10 }}>
                {t(fallos.length === 1 ? 'voc.missedWords' : 'voc.missedWordsPl', { n: fallos.length })}
              </p>
            )}
            {st.pct < 100 && <CoronaPanel topicId={'vocab:' + todo.id} pct={st.pct} />}
          </div>
          {st.pct >= 100 && <CoronaPanel topicId={'vocab:' + todo.id} pct={st.pct} />}
        </div>
      )}

      {!PORTABLE && tab === 'fotos' && (
        <FotosVocab ownerId={`vocab:${lektion.id}`} nombre={lektionLabel(lektion)} />
      )}
    </div>
  );
}

// ---------- portada de Vocabulario ----------
function VocabHome({ onOpenLektion, onOpen, onGenderGame, onChanged, onStart }) {
  const decks = allDecks();
  const [nivelGen, setNivelGen] = useState('all');
  const gs = genderStats(nivelGen);
  const aiOn = aiAvailable();
  // El generador con IA está siempre a la vista: es lo que más se usa y el
  // botón para abrirlo ya no pintaba nada. Importar un Excel se fue a Ajustes:
  // es cosa de una vez y aquí ocupaba sitio todos los días.
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [showExtra, setShowExtra] = useState(false);
  const [showMine, setShowMine] = useState(false);

  const [theme, setTheme] = useState('');
  const [count, setCount] = useState(18);

  // Acepta el tema como argumento para que las pastillas de sugerencia puedan
  // lanzarlo sin esperar a que el setState del input haya llegado.
  async function runAi(temaSug) {
    const tema = (temaSug ?? theme).trim();
    if (!tema) return;
    setErr(''); setBusy(true);
    try {
      const deck = await generateVocab({ theme: tema, count: Number(count) || 18 });
      const saved = saveUserDeck({ ...deck, source: 'ai' });
      setTheme(''); onChanged?.(); onOpen(saved.id);
    } catch (e2) {
      setErr(e2.message);
    } finally { setBusy(false); }
  }

  const userDecks = decks.filter((d) => !d.builtin);
  const byId = Object.fromEntries(decks.map((d) => [d.id, d]));

  const extra = (
    <>
    <div className="juego-seccion vocab-home-seccion">
      <button className={'gender-cta' + (gs.pct >= 100 ? ' dominado' : '')} onClick={() => onGenderGame(nivelGen)}>
        <IconoJuego e="🎯" />
        <span style={{ flex: 1 }}>
          <div className="gc-title">{t('voc.genderTitle')}</div>
          <div className="gc-sub">
            {t('voc.genderSub', { known: gs.known, total: gs.total, pct: gs.pct, empezadas: gs.empezadas })}
          </div>
        </span>
        <span className="chev">›</span>
      </button>

      {/* Dificultad por nivel del libro: A1.1 son las palabras de todos los
          días, A2.1 y los mazos extra las menos corrientes. */}
      <div className="gender-niveles">
        <span className="muted" style={{ fontSize: '0.78rem' }}>{t('voc.difficulty')}</span>
        {GENDER_NIVELES.map((n) => (
          <button
            key={n.id}
            className={'ask-chip' + (n.id === nivelGen ? ' on' : '')}
            onClick={() => setNivelGen(n.id)}
          >
            <EtiquetaChip largo={pick(n.es, n.en)} corto={pick(n.corto, n.cortoEn)} />
          </button>
        ))}
      </div>

      {/* Misma forma que el buscador de dudas de Gramatica: titulo con
          subtitulo, la fila de la caja y el boton, y sugerencias debajo. Las
          dos cosas hacen lo mismo -pedirle algo a la IA- y tenerlas con dos
          aspectos distintos no ayudaba a nadie. */}
      {aiOn && (
        <div className="ask">
          <div className="sec-title">
            <h2>{t('voc.genTitle')}</h2>
            <span className="muted">{t('voc.genSub')}</span>
          </div>

          <div className="card ask-box">
            <div className="ask-row">
              <input
                className="ask-input"
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && !busy && theme.trim() && runAi()}
                placeholder={t('voc.themePh')}
                disabled={busy}
              />
              <label className="voc-n" title={t('voc.nCards')}>
                <input
                  className="ask-input"
                  type="number"
                  min="8"
                  max="30"
                  value={count}
                  onChange={(e) => setCount(e.target.value)}
                  disabled={busy}
                />
              </label>
              <button className="btn-primary" onClick={runAi} disabled={busy || !theme.trim()}>
                {busy ? t('generating') : t('voc.createDeck')}
              </button>
            </div>

            <div className="ask-pies">
              {!busy && (
                <Sugerencias
                  opciones={TEMAS_SUG()}
                  disabled={busy}
                  onElegir={(s) => { setTheme(s); runAi(s); }}
                />
              )}
              {/* Tus mazos, al lado de las ideas y DENTRO de la tarjeta,
                  como en gramatica y en conversacion. La rejilla en si es
                  grande y se sigue pintando debajo. */}
              {userDecks.length > 0 && (
                <button className="link-btn pie-abrir" onClick={() => setShowMine(!showMine)} aria-expanded={showMine}>
                  {showMine ? t('voc.hideMine') : t('voc.showMine', { n: userDecks.length })}
                </button>
              )}
              <button className="link-btn pie-abrir" onClick={() => setShowExtra(!showExtra)} aria-expanded={showExtra}>
                {showExtra ? t('voc.hideExtra') : t('voc.showExtra')}
              </button>
            </div>
          </div>

          {busy && (
            <div style={{ marginTop: 14 }}>
              <Cargando
                icono="📚"
                titulo={t('wait.deckTitle')}
                pasos={[t('wait.deck1'), t('wait.deck2'), t('wait.deck3'), t('wait.deck4')]}
              />
            </div>
          )}
        </div>
      )}

      {err && <p style={{ color: 'var(--bad)', fontSize: '0.9rem' }}>{err}</p>}

      <div className={'vocab-extra-desplegables' + ((showMine && userDecks.length > 0 || showExtra) ? ' abierto' : '')}>
      <Desplegable abierto={showMine && userDecks.length > 0} className="vocab-extra-lista">
        <div style={{ marginTop: 22 }}>
          <div className="sec-title">
            <h2>{t('voc.myDecks')}</h2>
            <span className="muted">{t(SIN_IA ? 'voc.myDecksSubSinIA' : 'voc.myDecksSub')}</span>
          </div>
          <div className="topic-grid">
            {userDecks.map((d) => <DeckCard key={d.id} deck={d} onOpen={onOpen} />)}
          </div>
        </div>
      </Desplegable>

      <Desplegable abierto={showExtra} className="vocab-extra-lista">
          <div className="stack" style={{ gap: 22, marginTop: 14 }}>
            {vocabSections().map((sec) => (
              <div key={sec.title}>
                <div className="sec-title"><h2>{sec.title}</h2></div>
                <div className="topic-grid">
                  {sec.ids.map((id) => byId[id] && <DeckCard key={id} deck={byId[id]} onOpen={onOpen} />)}
                </div>
              </div>
            ))}
          </div>
      </Desplegable>
      </div>
    </div>

      {/* Al final del todo: cuando ya tienes los temas sueltos, mezclarlos. */}
      <MezclaVocab onStart={onStart} />
    </>
  );

  return (
    <BookNav
      title="Wortschatz"
      subtitle={t('voc.sub', { libro: KURSBUCH.title })}
      count={(l) => l.woerter.reduce((s, g) => s + g.items.length, 0)}
      unit={[t('word'), t('words')]}
      onOpen={(l) => onOpenLektion(l.id)}
      progressKey="woerter"
      extra={extra}
    />
  );
}

function VocabTableRow({ c, deckId, lektionId, onConjugate, loadingVerb }) {
  const [colorState, setColorState] = useState(() => getCardColor(c.de) || 'transparent');

  const word = c.de.split(' ')[0].replace(/[^a-zA-ZäöüÄÖÜß]/g, '');
  const isVerb = esVerbo(c.de);
  // En la lección del alfabeto las comas separan nombres de letras; no son
  // la marca de plural del diccionario que Escuchar normalmente quita.
  const esDeletreo = /^(?:[a-zäöüß]+,\s*){2,}[a-zäöüß]+(?:\s+\([^)]*\))?$/i.test(c.de);
  const textoAudio = esDeletreo ? c.de.replace(/\s*\([^)]*\)/g, '').trim() : c.de;

  const handleColor = (col) => {
    setColorState(col);
    setCardColor(c.de, col === 'transparent' ? null : col);
  };

  // El mismo color que cuenta para el candado de "Ampliar": la regla vive en
  // vocab.js y aqui solo se pinta. Antes estaba escrita dos veces y no decian
  // lo mismo, asi que veias palabras en verde que no contaban.
  //
  // El color ya no tiñe las palabras: la lista se leia como un semaforo y
  // cansaba. El texto siempre va del mismo color y lo que cambia es el punto
  // de la derecha, que es donde ademas se elige a mano.
  const computedColor = colorState !== 'transparent' ? colorState : (colorVisible(c.de) || 'transparent');

  return (
    <tr
      className={computedColor !== 'transparent' ? 'wt-coloreada' : undefined}
      style={computedColor !== 'transparent' ? { '--wt-color': computedColor } : undefined}
    >
      <td className="wt-de">
        {c.de}
      </td>
      <td className="wt-es">
        {c.es}
      </td>
      {/* El ancho iba en un style en linea (80) y no servia de nada: en una
          tabla eso es un minimo, y el boton de conjugar estiraba la columna a
          150 de los 347 px. Como la columna es la misma para todas las filas,
          una sola palabra con boton dejaba a las otras diecinueve con 94 px
          para el aleman. Ahora la columna se encoge a su contenido y en el
          movil el boton se queda en el icono. */}
      <td className="wt-acciones">
        <div className="row" style={{ gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
          {isVerb && (
            <button 
              className="btn-ghost btn-sm wt-conj" 
              onClick={() => onConjugate(word, c.es)}
              disabled={loadingVerb === word}
              title={t('voc.conjugate')}
            >
              <svg className="wt-conj-ico" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 4h18v16H3zM5 6v3h6V6zm8 0v3h6V6zm-8 5v3h6v-3zm8 0v3h6v-3zm-8 5v2h6v-2zm8 0v2h6v-2z" /></svg>
              <span className="wt-conj-txt">
                {loadingVerb === word ? t('loading') : t('voc.conjugate')}
              </span>
            </button>
          )}
          {/* Sin estrella en la lista de palabras: aqui se lee el tema, no se
              practica. Marcar se hace donde te sale la palabra en un ejercicio,
              que es cuando sabes si se te resiste. */}
          {/* El altavoz, pegado al punto de color: los dos son cosas que le
              haces a esa palabra concreta. */}
          <Escuchar texto={textoAudio} frase={esDeletreo} />
          <PuntoColor color={computedColor} onElegir={handleColor} />
        </div>
      </td>
    </tr>
  );
}
