import React, { useEffect, useRef, useState } from 'react';
import { SIN_IA } from '../lib/modo.js';
import { explainGrammar, generateGrammarTopic } from '../lib/ai.js';
import { aiAvailable } from '../lib/settings.js';
import { t, pick } from '../lib/i18n.js';
import { runJob, clearJob } from '../lib/aiJobs.js';
import { useAiJob } from '../lib/useAiJob.js';
import Cargando from './Cargando.jsx';
import Sugerencias from './Sugerencias.jsx';
import { guardados, estaGuardado, alternarGuardado, borrarGuardado, idDe, otroIdioma } from '../lib/guardados.js';
import { getUserGrammarTopics, saveUserGrammarTopic, deleteUserGrammarTopic, userTopicStats } from '../lib/userGrammar.js';
import TemasGramatica from './TemasGramatica.jsx';
import Desplegable from './Desplegable.jsx';

const JOB = 'grammar:ask';

// Una lista larga a proposito: se enseña un puñado distinto cada vez, y con
// seis fijas a la tercera visita ya no sugieren nada.
const SUG_ES = [
  '¿Cuándo se usa weil y cuándo denn?',
  'Akkusativ o Dativ, ¿cómo lo sé?',
  'Verbos separables',
  '¿Cuándo Perfekt con sein?',
  'Las terminaciones del adjetivo',
  'Diferencia entre wenn y als',
  '¿Cuándo va el verbo al final?',
  'Los verbos modales en pasado',
  'Preposiciones con Akkusativ y con Dativ',
  'Cómo se usa "es gibt"',
  'Diferencia entre kennen y wissen',
  'El Genitiv, ¿hace falta?',
  'Pronombres reflexivos: mich o mir',
  'Cuándo se usa el Konjunktiv II',
  'Orden de la frase con dos complementos',
  'Los verbos con preposición fija',
  'Diferencia entre nach, zu y in',
  'Comparativo y superlativo',
  'La declinación del adjetivo sin artículo',
  'Cuándo se usa würde y cuándo hätte'
];
const SUG_EN = [
  'When do I use weil and when denn?',
  'Akkusativ or Dativ — how do I know?',
  'Separable verbs',
  'When is the Perfekt formed with sein?',
  'Adjective endings',
  'Difference between wenn and als',
  'When does the verb go to the end?',
  'Modal verbs in the past',
  'Prepositions with Akkusativ and with Dativ',
  'How to use "es gibt"',
  'Difference between kennen and wissen',
  'The Genitiv — do I need it?',
  'Reflexive pronouns: mich or mir',
  'When to use Konjunktiv II',
  'Word order with two objects',
  'Verbs with a fixed preposition',
  'Difference between nach, zu and in',
  'Comparative and superlative',
  'Adjective endings with no article',
  'When to use würde and when hätte'
];

export default function GrammarAsk({ niveau = 'A2', onPractise, onOpen }) {
  // Compilada sin IA: esto no se pinta. Es un generador entero, no una
  // funcion que se pueda quedar a medias, y en gris solo ensenaba un boton
  // muerto y un aviso mandandote a activar la IA donde ya no hay nada.
  if (SIN_IA) return null;
  // La respuesta vive en aiJobs, no aquí: así aguanta el cambio de sección y
  // sigue puesta hasta que preguntes otra cosa.
  const job = useAiJob(JOB);
  const busy = job.status === 'running';
  const res = job.status === 'done' ? job.result : null;
  const err = job.status === 'error' ? job.error : '';
  const [q, setQ] = useState(() => job.meta?.q || '');
  const aiOn = aiAvailable();
  const SUGERENCIAS = pick(SUG_ES, SUG_EN);
  const box = useRef(null);
  const pidiendo = useRef(false);
  // Las explicaciones guardadas. En estado y no leidas a pelo: al guardar una
  // hay que repintar la lista sin recargar.
  const [misApuntes, setMisApuntes] = useState(() => guardados('gramatica'));
  const [verApuntes, setVerApuntes] = useState(false);
  const [showExtra, setShowExtra] = useState(false);
  const [misTemas, setMisTemas] = useState(() => getUserGrammarTopics());
  const [showMisTemas, setShowMisTemas] = useState(true);
  const [generandoTema, setGenerandoTema] = useState(false);
  const [errTema, setErrTema] = useState('');
  const idActual = res ? idDe(job.meta?.q || res.titel) : null;

  async function crearTemaGramatica(temaSug) {
    const tema = (temaSug ?? q).trim();
    if (!tema) return;
    setErrTema('');
    setGenerandoTema(true);
    try {
      const topicObj = await generateGrammarTopic({ topicName: tema, niveau });
      const saved = saveUserGrammarTopic(topicObj);
      setMisTemas(getUserGrammarTopics());
      setQ('');
      if (onOpen) onOpen(saved.id);
    } catch (e) {
      setErrTema(e.message || 'Error al generar el tema de gramática');
    } finally {
      setGenerandoTema(false);
    }
  }

  function borrarTema(id) {
    deleteUserGrammarTopic(id);
    setMisTemas(getUserGrammarTopics());
  }

  function guardar() {
    if (!res) return;
    alternarGuardado('gramatica', {
      id: idActual,
      pregunta: job.meta?.q || res.titel,
      titel: res.titel,
      res
    });
    setMisApuntes(guardados('gramatica'));
  }

  // Volver a abrir una guardada: se mete en el mismo sitio donde vive la
  // respuesta de la IA, asi que se pinta por el camino de siempre y no hay
  // que duplicar nada.
  function abrir(g) {
    setQ(g.pregunta);
    pidiendo.current = true;
    // El idioma viaja en la meta: asi la respuesta pintada sabe si se genero
    // en el otro y puede avisar. Una recien pedida no lo lleva, que siempre
    // viene en el idioma de ahora.
    runJob(JOB, async () => g.res, { q: g.pregunta, lang: g.lang || null });
  }

  function quitar(id) {
    borrarGuardado('gramatica', id);
    setMisApuntes(guardados('gramatica'));
  }

  // El scroll SOLO cuando acabas de preguntar tú. Antes iba atado a que
  // cambiara "res", y la respuesta guardada llega un pelo después de montar el
  // componente: entrabas en Grammatik y la página se bajaba sola a una
  // respuesta de ayer.
  useEffect(() => {
    if (!pidiendo.current) return;
    if (res || busy) box.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (res) pidiendo.current = false;
  }, [res, busy]);

  // Si la pregunta guardada no es la que hay en la caja, sincronízala al volver.
  useEffect(() => {
    if (job.meta?.q && job.meta.q !== q) setQ(job.meta.q);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [job.meta?.q]);

  function ask(text) {
    const pregunta = (text ?? q).trim();
    if (!pregunta) return;
    setQ(pregunta);
    pidiendo.current = true;
    runJob(JOB, () => explainGrammar({ query: pregunta, niveau }), { q: pregunta });
  }

  return (
    <div className="ask" id="ask" ref={box} style={{ scrollMarginTop: 16 }}>
      <div className="sec-title">
        <h2>{t('ask.title')}</h2>
        <span className="muted">{t('ask.sub')}</span>
      </div>

      <div className="card ask-box">
        <div className="ask-row">
          <input
            className="ask-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !busy && !generandoTema && (q.trim() && crearTemaGramatica())}
            placeholder={pick("Tema de gramática (ej: Perfekt con sein, Konjunktiv II, Pasivo...)", "Grammar topic (e.g. Perfekt with sein, Konjunktiv II...)")}
            disabled={!aiOn || busy || generandoTema}
          />
          <button
            className="btn-primary"
            onClick={() => crearTemaGramatica()}
            disabled={!aiOn || busy || generandoTema || !q.trim()}
            title={pick('Crea un tema completo con tarjetas de teoría y ejercicios', 'Create a full topic with theory cards and exercises')}
          >
            {generandoTema ? t('generating') : t('ask.createTopic')}
          </button>
          <button
            className="btn-ghost"
            onClick={() => ask()}
            disabled={!aiOn || busy || generandoTema || !q.trim()}
            title={pick('Explicación rápida de una duda puntual', 'Quick explanation of a specific question')}
          >
            {busy ? t('ask.thinking') : t('ask.explain')}
          </button>
        </div>

        <div className="ask-pies">
          {!res && !busy && !generandoTema && (
            <Sugerencias
              opciones={SUGERENCIAS}
              onElegir={(s) => { setQ(s); crearTemaGramatica(s); }}
              disabled={!aiOn || generandoTema}
            />
          )}

          {misTemas.length > 0 && (
            <button className="link-btn pie-abrir" onClick={() => setShowMisTemas(!showMisTemas)} aria-expanded={showMisTemas}>
              {showMisTemas ? 'Ocultar mis temas' : `✨ Mis temas con IA (${misTemas.length})`}
            </button>
          )}

          {misApuntes.length > 0 && (
            <button className="link-btn pie-abrir" onClick={() => setVerApuntes(!verApuntes)} aria-expanded={verApuntes}>
              {verApuntes ? t('save.hideMine') : t('save.showMine', { n: misApuntes.length })}
            </button>
          )}

          <button className="link-btn pie-abrir" onClick={() => setShowExtra(!showExtra)} aria-expanded={showExtra}>
            {showExtra ? t('gr.hideTemas') : t('gr.showTemas')}
          </button>

          <Desplegable abierto={verApuntes && misApuntes.length > 0} className="desplegable-guardados">
            <div className="guardados-lista">
              {misApuntes.map((g) => (
                <span className="guardado-chip" key={g.id}>
                  <button className="gc-abrir" onClick={() => abrir(g)} title={g.pregunta}>
                    {g.titel || g.pregunta}
                  </button>
                  <button className="gc-quitar" onClick={() => quitar(g.id)} title={t('save.remove')}>
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </Desplegable>
        </div>

        {!aiOn && (
          <p className="muted" style={{ fontSize: '0.83rem', marginTop: 10 }}>
            {t('ask.off')}
          </p>
        )}
        {err && <p style={{ color: 'var(--bad)', fontSize: '0.85rem', marginTop: 10 }}>{err}</p>}
        {errTema && <p style={{ color: 'var(--bad)', fontSize: '0.85rem', marginTop: 10 }}>{errTema}</p>}
      </div>

      <Desplegable abierto={showExtra} className="grammar-extra-lista">
        <TemasGramatica onOpen={onOpen} />
      </Desplegable>

      {generandoTema && (
        <div style={{ marginTop: 14 }}>
          <Cargando
            icono="📖"
            titulo="Generando tema de gramática..."
            pasos={[
              "Estructurando reglas y explicaciones clave...",
              "Creando tarjetas de teoría con ejemplos y audio...",
              "Diseñando ejercicios interactivos (test, escribir, ordenar)...",
              "Guardando tu nuevo tema para practicar..."
            ]}
          />
        </div>
      )}

      <Desplegable abierto={showMisTemas && misTemas.length > 0} className="grammar-extra-lista">
        <div style={{ marginTop: 20 }}>
          <div className="sec-title">
            <h2>✨ {pick('Mis temas de gramática creados con IA', 'My AI Grammar Topics')}</h2>
            <span className="muted">{pick('Temas con tarjetas de teoría y ejercicios interactivos', 'Topics with theory cards and interactive exercises')}</span>
          </div>
          <div className="topic-grid">
            {misTemas.map((tm) => {
              const st = userTopicStats(tm);
              return (
                <div
                  key={tm.id}
                  className="card topic-open"
                  role="button"
                  tabIndex={0}
                  onClick={() => onOpen(tm.id)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="row spread" style={{ alignItems: 'flex-start' }}>
                    <div className="flex-min" style={{ maxWidth: '82%' }}>
                      <div className="t-title">{tm.emoji || '📖'} {tm.nameEs || tm.name}</div>
                      <div className="t-blurb">
                        {tm.name && tm.name !== tm.nameEs ? <span>{tm.name} · </span> : null}
                        <span>{st.totalCards} tarjetas · {st.totalExercises} ejercicios · IA</span>
                      </div>
                    </div>
                    <div className="row" style={{ gap: 6, alignItems: 'center' }}>
                      <span className="pill">{st.pct}%</span>
                      <button
                        className="gc-quitar"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (confirm(pick(`¿Eliminar el tema "${tm.nameEs || tm.name}"?`, `Delete topic "${tm.nameEs || tm.name}"?`))) {
                            borrarTema(tm.id);
                          }
                        }}
                        title="Eliminar tema"
                        style={{ padding: '2px 6px', fontSize: '0.85rem' }}
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <div className="mini-bar" style={{ margin: '14px 0 8px' }}>
                    <span style={{ width: st.pct + '%' }} />
                  </div>
                  <div className="muted" style={{ fontSize: '0.78rem' }}>
                    {tm.blurb || 'Tema personalizado con tarjetas de teoría y ejercicios'}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </Desplegable>

      {busy && (
        <div style={{ marginTop: 14 }}>
          <Cargando
            icono="💬"
            titulo={t('wait.askTitle')}
            pasos={[t('wait.ask1'), t('wait.ask2'), t('wait.ask3')]}
          />
        </div>
      )}

      {res && (
        <div className="stack" style={{ marginTop: 14 }}>
          <div className="card ask-answer">
            <div className="ask-answer-head">
              <h2>{res.titel}</h2>
              {/* La misma estrella que las canciones: guardar lo que te ha
                  servido para volver a ello sin gastar otra vez la IA. */}
              <div className="ask-answer-acciones">
                <button
                  className={'lied-save' + (estaGuardado('gramatica', idActual) ? ' on' : '')}
                  onClick={guardar}
                  title={estaGuardado('gramatica', idActual) ? t('save.remove') : t('save.add')}
                >
                  {estaGuardado('gramatica', idActual) ? '★' : '☆'}
                  <span>{estaGuardado('gramatica', idActual) ? t('save.saved') : t('save.save')}</span>
                </button>
                {/* Cerrarla y volver a la caja. Guardada o no: si la has
                    guardado sigue en la lista de abajo, y si no, no se pierde
                    nada que no puedas volver a preguntar. */}
                <button
                  className="lied-cerrar"
                  onClick={() => { clearJob(JOB); setQ(''); }}
                  title={t('save.close')}
                >
                  ✕
                </button>
              </div>
            </div>
            {otroIdioma({ lang: job.meta?.lang }) && (
              <p className="aviso-idioma">
                ⚠ {t('otroIdioma')}{' '}
                <button className="link-btn" onClick={() => ask(job.meta?.q || res.titel)}>
                  {t('save.rehacer')}
                </button>
              </p>
            )}
            {res.kurz && <p className="ask-kurz">{res.kurz}</p>}
          </div>

          {(res.abschnitte || []).map((s, i) => (
            <div className="card" key={i}>
              {s.title && <div className="lk-block-title">{s.title}</div>}
              {s.body && <p className="lk-expl">{s.body}</p>}
              {(s.beispiele || []).length > 0 && (
                <ul className="lk-examples">
                  {s.beispiele.map((b, bi) => (
                    <li key={bi}>
                      <span className="de">{b.de}</span>
                      <span className="es">{b.es}</span>
                    </li>
                  ))}
                </ul>
              )}
              {s.tabelle?.headers?.length > 0 && (
                <div className="scroll-x" style={{ marginTop: 12 }}>
                  {s.tabelle.title && <h3 style={{ marginBottom: 8 }}>{s.tabelle.title}</h3>}
                  <table>
                    <thead>
                      <tr>{s.tabelle.headers.map((h, hi) => <th key={hi}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {(s.tabelle.rows || []).map((r, ri) => (
                        <tr key={ri}>{(r || []).map((c, ci) => <td key={ci}>{c}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}

          {(res.fehler || []).length > 0 && (
            <div className="card">
              <div className="lk-block-title">{t('gr.pitfalls')}</div>
              <ul className="pitfalls">
                {res.fehler.map((f, i) => <li key={i}>{f}</li>)}
              </ul>
            </div>
          )}

          {res.merksatz && (
            <div className="card ask-merk">
              <span className="ask-merk-ico">🧠</span>
              <div>
                <strong>{t('ask.remember')}</strong>
                <p style={{ marginTop: 3 }}>{res.merksatz}</p>
              </div>
            </div>
          )}

          {/* Leer la explicación y creerse que se ha entendido es facilísimo.
              Cuatro ejercicios sobre ella dicen la verdad. */}
          <div className="btn-row">
            <button
              className="btn-primary"
              onClick={() => crearTemaGramatica(job.meta?.q || res.titel)}
              disabled={generandoTema}
            >
              ✨ {generandoTema ? t('generating') : pick('Guardar como tema con tarjetas y ejercicios', 'Save as topic with cards & exercises')}
            </button>
            {onPractise && (
              <button className="btn-ghost" onClick={() => onPractise({ pregunta: q, res })}>
                {t('ask.practise')}
              </button>
            )}
            <button className="btn-ghost btn-sm" onClick={() => { clearJob(JOB); setQ(''); }}>
              {t('ask.another')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
