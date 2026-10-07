import React, { useLayoutEffect, useState } from 'react';
import IconoJuego, { conSimbolo } from './IconoJuego.jsx';
import { t, pick } from '../lib/i18n.js';
import { getStarredItems, useStars } from '../lib/stars.js';
import { SIN_IA, PORTABLE } from '../lib/modo.js';
import { topicMastery, failedItemsForConcepts, conceptosQueFaltan, aciertosQueFaltan, UMBRAL_TERMINAR } from '../lib/progress.js';
import MatchGame from './MatchGame.jsx';
import VocabSummary from './VocabSummary.jsx';
import BlitzGame from './BlitzGame.jsx';
import { paresDeGramatica } from '../lib/paresJuego.js';
import { aplicarBonoRachaFinal } from '../lib/monedas.js';
import { recordAnswer } from '../lib/progress.js';
import { aiAvailable } from '../lib/settings.js';
import { deleteUserGrammarTopic } from '../lib/userGrammar.js';
import { tc } from '../lib/contenido/index.js';
import CoronaPanel, { BarrasTema } from './ProgresoTema.jsx';
import Desplegable from './Desplegable.jsx';
import TextoAleman from './TextoAleman.jsx';
import Escuchar from './Escuchar.jsx';
import FotosVocab from './FotosVocab.jsx';
import Tabs from './Tabs.jsx';

function Examples({ list }) {
  if (!list || !list.length) return null;
  return (
    <div className="examples">
      {list.map((ex, j) => (
        <div className="ex" key={j}>
          <span className="ex-de">{ex.de}</span>
          <span className="ex-es">{tc(ex.es)}</span>
        </div>
      ))}
    </div>
  );
}

function MiniTable({ table }) {
  if (!table) return null;
  return (
    <div className="scroll-x" style={{ marginTop: 12 }}>
      {table.title && <h3 style={{ marginBottom: 8 }}>{tc(table.title)}</h3>}
      <table>
        <thead>
          <tr>{table.headers.map((h, i) => <th key={i}>{tc(h)}</th>)}</tr>
        </thead>
        <tbody>
          {table.rows.map((r, i) => (
            <tr key={i}>{r.map((c, j) => <td key={j}>{tc(c)}</td>)}</tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function TheorySection({ s }) {
  const [open, setOpen] = useState(false);
  const extraExamples = (s.examples || []).length > 2;
  const canExpand = !!(s.detail || s.more || s.table || extraExamples);
  // Los dos primeros ejemplos siempre; el resto, dentro del desplegable, para
  // que crezcan con él. Si se quedaran fuera, la lista pegaría el salto que
  // justamente se ha quitado del detalle.
  const primeros = (s.examples || []).slice(0, 2);
  const restantes = (s.examples || []).slice(2);

  return (
    <div className={'panel theory-sec' + (open ? ' open' : '')}>
      <button
        className="theory-sec-head"
        onClick={() => canExpand && setOpen((o) => !o)}
        aria-expanded={open}
        disabled={!canExpand}
      >
        <h2>{tc(s.title)}</h2>
        {canExpand && <span className="sec-toggle">{open ? t('gr.less') : t('gr.more')}</span>}
      </button>

      {s.body && <p className="muted sec-body"><TextoAleman texto={tc(s.body)} /></p>}

      <Examples list={primeros} />

      <Desplegable abierto={open}>
        {restantes.length > 0 && <Examples list={restantes} />}
        {/* La caja del detalle lleva una raya arriba: si no hay detalle, ni
            tabla, ni bloque extra, lo unico que se veria es la raya y un
            hueco debajo del ultimo ejemplo. */}
        {(s.detail || s.more || s.table) && (
          <div className="theory-detail">
            {s.detail &&
              String(s.detail)
                .split('\n\n')
                .map((parrafo, i) => (
                  <p key={i}>
                    <TextoAleman texto={tc(parrafo)} />
                  </p>
                ))}
            {s.more && (
              <>
                {s.more.title && <h3>{tc(s.more.title)}</h3>}
                <Examples list={s.more.examples} />
              </>
            )}
            <MiniTable table={s.table} />
          </div>
        )}
      </Desplegable>

      {canExpand && !open && (
        <button className="link-btn sec-more-link" onClick={() => setOpen(true)}>
          {t('gr.seeMore')}
        </button>
      )}
    </div>
  );
}

export default function TopicDetail({ topic, tab = 'teoria', onTab, onStart, onBack }) {
  const setTab = (t) => onTab?.(t);
  // 'match' | 'blitz'. Son juegos enteros y no tandas del generador, asi que
  // no pasan por onStart: se pintan aqui mismo en lugar del tema.
  const [juego, setJuego] = useState(null);
  const [resumenJuego, setResumenJuego] = useState(null);
  const [volverAListaDeEjercicios, setVolverAListaDeEjercicios] = useState(false);
  useLayoutEffect(() => {
    if (!volverAListaDeEjercicios || resumenJuego) return;
    window.scrollTo(0, 0);
    document.querySelector('.main')?.scrollTo(0, 0);
    setVolverAListaDeEjercicios(false);
  }, [volverAListaDeEjercicios, resumenJuego]);
  // Arriba del todo, antes de cualquier return.
  //
  // Estaba abajo, junto al resto del cuerpo, y por eso abrir Emparejar o Blitz
  // desde Gramática reventaba la pantalla: esas dos ramas salen por un return
  // temprano, el componente pasaba a renderizar dos hooks en vez de tres y
  // React aborta con "Rendered fewer hooks than expected".
  useStars();
  if (topic && juego) {
    const pares = paresDeGramatica(topic);
    const porFrase = new Map(pares.map((x) => [x.de, x]));
    const ctx = {
      id: 'gram:' + topic.id,
      nombre: pick(topic.nameEs, topic.nameEn || topic.name),
      emoji: topic.emoji || '📖'
      // Sin `pct`: el bono del 100% no se da en estos dos.
    };
    // Cada acierto suma a SU regla, igual que en una tanda normal. El peso es
    // el del test (1): aqui se reconoce, no se produce.
    const apuntar = (de, ok) => {
      const cid = porFrase.get(de)?.conceptId;
      if (cid) recordAnswer(cid, ok, { type: 'mc' });
    };
    const salir = () => setJuego(null);
    const acabar = (data) => {
      // `cual` va con el resultado: al salir del juego se pierde `juego` y
      // "Otra ronda" necesita saber cual volver a abrir.
      setResumenJuego(aplicarBonoRachaFinal({ ...data, cual: juego, volverA: 'ejercicios', deck: { emoji: ctx.emoji, name: ctx.nombre } }));
      setJuego(null);
    };
    return juego === 'match' ? (
      <MatchGame pares={pares} apuntar={apuntar} contexto={ctx} onExit={salir} onFinish={acabar} />
    ) : (
      // 40 segundos: aqui la pregunta es una frase con hueco, con +2s por acierto y -2s por fallo.
      <BlitzGame cartas={pares} apuntar={apuntar} contexto={ctx} segundos={40} bono={2} onExit={salir} onFinish={acabar} />
    );
  }

  if (topic && resumenJuego) {
    const volver = () => {
      setVolverAListaDeEjercicios(true);
      setResumenJuego(null);
    };
    const otraRonda = () => { const cual = resumenJuego.cual; setResumenJuego(null); setJuego(cual); };
    return (
      <VocabSummary data={resumenJuego} onRepeat={otraRonda} onDeck={volver} />
    );
  }

  if (!topic) {
    return (
      <div className="card center stack">
        <p>{t('gr.noTopic')}</p>
        <button className="btn-ghost" onClick={onBack}>{t('back')}</button>
      </div>
    );
  }
  const ids = topic.concepts.map((c) => c.id);
  const m = topicMastery(ids);
  const conceptosPendientes = conceptosQueFaltan(ids);
  const aciertosPendientes = aciertosQueFaltan(ids);
  // Aquí había un `if (m.pct >= 100) {}` vacío: es lo que quedó al quitar el
  // premio por dejar un tema al 100%.
  const weakItems = failedItemsForConcepts(ids).map((item, index) => ({ ...item, _reviewPosition: index + 1 }));
  const aiOn = aiAvailable();
  const topicLektionId = topic.lektionId || (topic.id?.startsWith('kb-') ? topic.id.replace('kb-', '') : null);
  const topicIdClean = topic.id?.replace(/^kb-/, '');

  const starred = getStarredItems('grammar').filter((i) => {
    // 1. Direct topicId match (with or without 'kb-' prefix)
    if (i.topicId) {
      if (i.topicId === topic.id) return true;
      if (topicIdClean && (i.topicId === topicIdClean || i.topicId === `kb-${topicIdClean}`)) return true;
    }

    // 2. Lektion ID match
    if (topicLektionId) {
      if (i.lektionId === topicLektionId) return true;
      if (i.topicId === topicLektionId || i.topicId === `kb-${topicLektionId}`) return true;
      if (i.conceptId) {
        const cStr = String(i.conceptId);
        if (cStr.startsWith(`${topicLektionId}:`) || cStr.startsWith(`kb-${topicLektionId}:`)) return true;
      }
      if (i.id) {
        const idStr = String(i.id);
        if (idStr.includes(`-${topicLektionId}-`) || idStr.includes(`:${topicLektionId}:`)) return true;
      }
    }

    // 3. Topic name match
    if (i.topicName && (i.topicName === topic.nameEs || i.topicName === topic.name)) return true;

    // 4. Concept ID match against topic concepts
    if (i.conceptId && topic.concepts?.length) {
      const cStr = String(i.conceptId);
      const match = topic.concepts.some((c) => {
        if (!c.id) return false;
        if (c.id === i.conceptId) return true;
        if (c.id.endsWith(`:${i.conceptId}`) || cStr.endsWith(`:${c.id}`)) return true;
        if (c.name && cStr.includes(c.name)) return true;
        return false;
      });
      if (match) return true;
    }

    return false;
  });
  const th = topic.theory || {};

  return (
    <div>
      <div className="topbar">
        <div className="min0">
          <h1><button type="button" className="titulo-volver" onClick={onBack}>{topic.emoji && <span style={{ marginRight: 8 }}>{topic.emoji}</span>}{pick(topic.nameEs, topic.nameEn || topic.name)}</button></h1>
          <p className="muted" style={{ marginTop: 4, fontSize: '0.9rem' }}>
            {topic.lektionId
              ? <>{pick(topic.blurb, topic.blurbEn || tc(topic.blurb))} · {m.practiced}/{m.total} {pick('practicadas', 'practised')} ({m.pct}%)</>
              : <>{topic.name} · {pick(topic.blurb, topic.blurbEn || tc(topic.blurb))}</>}
            {topic.custom && <span className="pill" style={{ marginLeft: 8, fontSize: '0.75rem' }}>✨ {pick('Creado con IA', 'Created with AI')}</span>}
          </p>
        </div>
        <div className="row" style={{ gap: 8, flexShrink: 0, alignItems: 'center' }}>
          {topic.custom && (
            <button
              className="btn-ghost btn-sm"
              style={{ color: 'var(--bad)', borderColor: 'var(--bad-border)' }}
              onClick={() => {
                if (confirm(pick(`¿Eliminar el tema "${topic.nameEs || topic.name}"?`, `Delete topic "${topic.nameEs || topic.name}"?`))) {
                  deleteUserGrammarTopic(topic.id);
                  onBack();
                }
              }}
              title={pick('Eliminar este tema creado con IA', 'Delete this AI-generated topic')}
            >
              🗑️ {pick('Eliminar tema', 'Delete topic')}
            </button>
          )}
          <button className="link-btn" onClick={onBack}>
            <span className="fl-atras">◂</span> Grammatik
          </button>
        </div>
      </div>

      {/* Lo dominado del tema, en una línea y arriba del todo: la misma que en
          Wortschatz. Antes vivía dentro del panel de Practicar, con barra,
          píldora y un "4/5 conceptos practicados · 4 para repasar" que había
          que descifrar; y encima solo se veía si estabas en esa pestaña. */}
      <BarrasTema topicId={topic.id} pct={m.pct} />

      <Tabs>
        <button className={'tab' + (tab === 'teoria' ? ' active' : '')} onClick={() => setTab('teoria')}>
          {conSimbolo(t('gr.theory'))}
        </button>
        <button className={'tab' + (tab === 'ejercicios' ? ' active' : '')} onClick={() => setTab('ejercicios')}>
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
          {th.intro && (
            <div className="panel intro-panel">
              <p>{tc(th.intro)}</p>
            </div>
          )}

          {/* Tarjetas de teoría y estructuras clave (estilo vocabulario) */}
          {topic.cards?.length > 0 && (
            <div className="panel">
              <h2 style={{ margin: '0 0 12px' }}>🃏 {pick(`Tarjetas de teoría (${topic.cards.length})`, `Theory flashcards (${topic.cards.length})`)}</h2>
              <div className="card-list-grid">
                {topic.cards.map((c, i) => (
                  <div className="card-mini" key={i} style={{ position: 'relative' }}>
                    <div className="row spread" style={{ alignItems: 'flex-start' }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600, fontSize: '0.98rem' }}>{c.de}</div>
                        <div className="muted" style={{ fontSize: '0.84rem', marginTop: 2 }}>{tc(c.es)}</div>
                        {c.ex && (
                          <div style={{ marginTop: 6, fontSize: '0.82rem', borderLeft: '2px solid var(--accent)', paddingLeft: 8 }}>
                            <div style={{ fontWeight: 500 }}>{c.ex}</div>
                            {c.exEs && <div className="muted" style={{ fontSize: '0.78rem' }}>{tc(c.exEs)}</div>}
                          </div>
                        )}
                      </div>
                      <Escuchar texto={c.ex || c.de} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="theory-grid">
            {(th.sections || []).map((s, i) => (
              <TheorySection s={s} key={i} />
            ))}
          </div>

          {th.table && (
            <div className="panel scroll-x">
              <h2>{tc(th.table.title) || pick('Resumen', 'Summary')}</h2>
              <table>
                <thead>
                  <tr>{th.table.headers.map((h, i) => <th key={i}>{tc(h)}</th>)}</tr>
                </thead>
                <tbody>
                  {th.table.rows.map((r, i) => (
                    <tr key={i}>{r.map((c, j) => <td key={j}>{tc(c)}</td>)}</tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {th.pitfalls?.length > 0 && (
            <div className="panel">
              <h2>{t('gr.pitfalls')}</h2>
              <ul className="pitfalls">
                {th.pitfalls.map((p, i) => (
                  <li key={i}>{tc(p)}</li>
                ))}
              </ul>
            </div>
          )}

          {th.merksatz && (
            <div className="panel ask-merk" style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span className="ask-merk-ico" style={{ fontSize: '1.4rem' }}>🧠</span>
              <div>
                <strong>{t('ask.remember')}</strong>
                <p style={{ marginTop: 2 }}>{tc(th.merksatz)}</p>
              </div>
            </div>
          )}

          <button className="btn-primary" style={{ alignSelf: 'flex-start' }} onClick={() => setTab('ejercicios')}>
            {t('gr.toExercises')}
          </button>
        </div>
      )}

      {tab === 'ejercicios' && (
        <div className="stack">
          <div className="panel">
              <h2 style={{ margin: '0 0 14px' }}>{t('gr.practise')}</h2>
              {topic.userItems?.length > 0 && (
                <p className="muted" style={{ fontSize: '0.84rem', margin: '-6px 0 14px' }}>
                  ✨ {pick(`${topic.userItems.length} ejercicios interactivos preparados con IA para este tema.`, `${topic.userItems.length} interactive exercises ready for this topic.`)}
                </p>
              )}

              {topic.aiOnly ? (
                <>
                  {/* Estas lecciones no traen ejercicios escritos: los generaba
                      la IA. Sin ella no hay boton que ofrecer, solo decirlo. */}
                  {SIN_IA ? (
                    <p className="muted" style={{ fontSize: '0.78rem', margin: 0 }}>
                      {t('gr.sinEjercicios')}
                    </p>
                  ) : (
                    <>
                      <div className="gametype-label">{t('gr.lessonEx')}</div>
                      <button
                        className="btn-primary"
                        style={{ width: '100%' }}
                        onClick={() => onStart(topic.id, 'ai', 'mixed')}
                        disabled={!aiOn}
                      >
                        {t('gr.genAi')}
                      </button>
                      <p className="muted" style={{ fontSize: '0.78rem', marginTop: 10 }}>
                        {aiOn ? t('gr.aiOnly') : t('gr.aiOnlyOff')}
                      </p>
                    </>
                  )}
                </>
              ) : (
              <>
              <div className="gametype-label">{t('gr.pickGame')}</div>
              {/* De mas facil a mas dificil, con el mismo criterio que las
                  monedas: reconocer, reconstruir y producir. Escribir va
                  siempre el ultimo y el test el primero. */}
              <div className="gametype-grid">
                <button className="gametype" onClick={() => onStart(topic.id, 'mixed', 'mc')}>
                  <IconoJuego e="✅" />
                  <span className="gt-txt">
                    <span>{t('home.gTest')}</span>
                    <small>{t('home.gTestSub')}</small>
                  </span>
                </button>
                <button className="gametype" onClick={() => onStart(topic.id, 'mixed', 'judge')}>
                  <IconoJuego e="⚖️" />
                  <span className="gt-txt">
                    <span>{t('home.gJudge')}</span>
                    <small>{t('home.gJudgeSub')}</small>
                  </span>
                </button>
                {/* Emparejar y Blitz no pasan por el generador de tandas: son
                    juegos enteros, los mismos que Vocabulario, con las frases
                    de hueco de esta leccion. Por eso no llaman a onStart. */}
                <button className="gametype" onClick={() => setJuego('match')}>
                  <IconoJuego e="🧩" />
                  <span className="gt-txt">
                    <span>{pick('Emparejar', 'Match')}</span>
                    <small>{pick('Seis huecos con su solución', 'Six gaps with their answer')}</small>
                  </span>
                </button>
                <button className="gametype" onClick={() => setJuego('blitz')}>
                  <IconoJuego e="⚡" />
                  <span className="gt-txt">
                    <span>Blitz</span>
                    <small>{pick('Diez aciertos en 40 segundos', 'Ten right in 40 seconds')}</small>
                  </span>
                </button>
                <button className="gametype" onClick={() => onStart(topic.id, 'mixed', 'order')}>
                  <IconoJuego e="🔀" />
                  <span className="gt-txt">
                    <span>{t('home.gOrder')}</span>
                    <small>{t('home.gOrderSub')}</small>
                  </span>
                </button>
                <button className="gametype" onClick={() => onStart(topic.id, 'mixed', 'write')}>
                  <IconoJuego e="⌨️" />
                  <span className="gt-txt">
                    <span>{t('gr.gWrite')}</span>
                    <small>{t('gr.gWriteSub')}</small>
                  </span>
                </button>
              </div>

              {/* De dónde sale el material: la duda razonable de cualquiera que
                  vea un botón que pone "IA" al lado de otros que no. */}
              <p className="muted" style={{ fontSize: '0.78rem', marginTop: 12 }}>
                {SIN_IA ? t('gr.soloPlantillas') : aiOn ? t('gr.mixSource') : t('gr.mixSourceOff')}
              </p>

              <div className="btn-row" style={{ marginTop: 12 }}>
                {starred.length > 0 && (
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => onStart(topic.id, 'mixed', 'mixed', starred, null, 'marked')}
                  >
                    {conSimbolo(t('star.review', { n: starred.length }))}
                  </button>
                )}
                {weakItems.length > 0 && (
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => onStart(topic.id, 'weak', 'mixed', weakItems)}
                    title={t('gr.reviewWeakHint')}
                  >
                    {conSimbolo(t('gr.reviewWeakN', { n: weakItems.length }))}
                  </button>
                )}
                {/* Solo del 70% para arriba. Debajo de eso falta casi todo y
                    seria la sesion normal con otro nombre. */}
                {conceptosPendientes.length > 0 && (
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => onStart(topic.id, 'faltan', 'mixed')}
                    disabled={m.pct < UMBRAL_TERMINAR}
                    title={m.pct < UMBRAL_TERMINAR ? t('voc.finishLockedHint', { p: UMBRAL_TERMINAR }) : t('voc.finishHint')}
                  >
                    {m.pct < UMBRAL_TERMINAR
                      ? conSimbolo(t('voc.finishLocked', { p: UMBRAL_TERMINAR }))
                      : conSimbolo(t('voc.finish', { n: aciertosPendientes }))}
                  </button>
                )}
                {aiOn && (
                  <button
                    className="btn-ghost btn-sm"
                    onClick={() => onStart(topic.id, 'ai', 'mixed')}
                    title={t('gr.aiChallengeHint')}
                  >
                    {conSimbolo(t('gr.aiChallenge'))}
                  </button>
                )}
              </div>
              </>
              )}
              {!SIN_IA && !aiOn && !topic.aiOnly && (
                <p className="muted" style={{ fontSize: '0.78rem', marginTop: 10 }}>
                  {t('gr.aiHint')}
                </p>
              )}

              {m.pct < 100 && <CoronaPanel topicId={topic.id} pct={m.pct} />}
          </div>
          {m.pct >= 100 && <CoronaPanel topicId={topic.id} pct={m.pct} />}
        </div>
      )}

      {!PORTABLE && tab === 'fotos' && (
        <FotosVocab ownerId={`grammatik:${topic.id}`} nombre={topic.nameEs || topic.name} />
      )}
    </div>
  );
}
