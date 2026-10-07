import React, { useEffect, useRef, useState } from 'react';
import { cobrarUnaVezAlDia, MONEDAS_TAGEBUCH } from '../lib/monedas.js';
// `pick` se usaba mas abajo sin estar importado: al abrir una entrada del
// Tagebuch reventaba con "pick is not defined" y saltaba la pantalla de error.
import { t, pick, getLang, esOtroIdioma } from '../lib/i18n.js';
import { SIN_IA } from '../lib/modo.js';
import IdeasDiario from './IdeasDiario.jsx';
import {
  getEntry, updateEntry, deleteEntry, countWords, topMistakes, temasVistos, recordarTema
} from '../lib/diary.js';
import { correctDiary, generateWritingTopic } from '../lib/ai.js';
import { aiAvailable } from '../lib/settings.js';
import { runJob, clearJob } from '../lib/aiJobs.js';
import { useAiJob } from '../lib/useAiJob.js';
import Umlaut, { useInsercion } from './Umlaut.jsx';

// El tipo llega de la IA en el idioma de la interfaz, así que se reconoce en
// ambos para que el color del chip no se pierda al cambiar de idioma.
const TIPO_CLASS = {
  'Gramática': 'gram', 'Grammar': 'gram',
  'Vocabulario': 'voc', 'Vocabulary': 'voc',
  'Ortografía': 'orto', 'Spelling': 'orto',
  'Orden de la frase': 'orden', 'Word order': 'orden', 'Sentence order': 'orden',
  'Estilo': 'stil', 'Style': 'stil'
};

export default function DiaryEntry({ entryId, onBack, onDeleted }) {
  const [entry, setEntry] = useState(() => getEntry(entryId));
  const [text, setText] = useState(entry?.text || '');
  const [title, setTitle] = useState(entry?.title || '');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [tab, setTab] = useState('schreiben'); // 'schreiben' | 'korrektur'
  const [tabDirection, setTabDirection] = useState('forward');
  const saveT = useRef(null);
  const area = useRef(null);
  const insertar = useInsercion(area);
  const aiOn = aiAvailable();

  // El tema va por el gestor de trabajos, no en un useState: pedirlo tarda y
  // no tiene por qué atarte a esta pantalla. Cuando termina se guarda EN LA
  // ENTRADA, así que sigue ahí mañana cuando la vuelvas a abrir.
  const JOB_TEMA = `tb:tema:${entryId}`;
  const jobTema = useAiJob(JOB_TEMA);
  const temaBusy = jobTema.status === 'running';

  useEffect(() => () => clearTimeout(saveT.current), []);

  useEffect(() => {
    if (jobTema.status !== 'done' || !jobTema.result) return;
    recordarTema(jobTema.result.thema);
    setEntry(updateEntry(entryId, { thema: jobTema.result }));
    clearJob(JOB_TEMA);
  }, [jobTema.status, JOB_TEMA]);

  if (!entry) {
    return (
      <div className="card center stack">
        <p>{t('tb.notFound')}</p>
        <button className="btn-ghost" onClick={onBack}>{t('back')}</button>
      </div>
    );
  }

  function persist(patch) {
    const next = updateEntry(entry.id, patch);
    setEntry(next);
    return next;
  }

  function onText(v) {
    setText(v);
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => persist({ text: v }), 500);
  }

  async function corregir() {
    setErr('');
    setBusy(true);
    // Solo la primera correccion de esta entrada, y solo una vez al dia.
    const primera = !entry.correction;
    try {
      persist({ text });
      const correction = await correctDiary({ text, niveau: 'A2', errores: topMistakes(4) });
      // El idioma de la correccion queda sellado: las explicaciones de los
      // fallos salen en el idioma que tuvieras puesto y no cambian solas.
      persist({ correction, correctedAt: Date.now(), correctionLang: getLang() });
      if (primera) cobrarUnaVezAlDia('tagebuch', MONEDAS_TAGEBUCH);
      setTab('korrektur');
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  function pedirTema() {
    if (temaBusy) return;
    runJob(JOB_TEMA, () =>
      generateWritingTopic({ niveau: 'A2', evitar: temasVistos() })
    );
  }

  // Un principio de frase entra donde tengas el cursor, igual que las Umlaut,
  // con un espacio delante si hace falta.
  function ponerAnfang(frase) {
    const el = area.current;
    const ini = el?.selectionStart ?? text.length;
    const antes = text.slice(0, ini);
    const sep = antes && !/\s$/.test(antes) ? ' ' : '';
    insertar(sep + frase + ' ', onText);
  }

  function borrar() {
    if (!window.confirm(t('tb.confirmDel'))) return;
    deleteEntry(entry.id);
    onDeleted();
  }

  function cambiarPestana(siguiente) {
    if (siguiente === tab) return;
    setTabDirection(siguiente === 'korrektur' ? 'forward' : 'backward');
    setTab(siguiente);
  }

  const c = entry.correction;
  const n = countWords(text);

  return (
    <div className="reading stack">
      <button className="link-btn volver-arriba" onClick={onBack}>
        <span className="fl-atras">◂</span> Tagebuch
      </button>

      <input
        className="nb-title-input"
        placeholder={pick('Título (opcional)', 'Title (optional)')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => title !== entry.title && persist({ title })}
      />

      <div className="nb-meta">
        <label className="nb-field">
          {t('nb.date')}
          <input type="date" value={entry.date} onChange={(e) => persist({ date: e.target.value })} />
        </label>
        {/* Borrar, en la fila de la fecha y a la derecha. Estaba al final de
            la página, donde en la versión sin IA se quedaba solo en una fila
            entera para él y había que bajar hasta abajo para verlo. */}
        <button className="btn-ghost btn-sm danger nb-borrar" onClick={borrar}>{t('delete')}</button>
      </div>

      {c && (
        <div className="lk-tabs lk-tabs-2 diary-tabs">
          <button className={'lk-tab' + (tab === 'schreiben' ? ' on' : '')} onClick={() => cambiarPestana('schreiben')}>
            <span>✍️ Mein Text</span><small>{t('tb.tabMineSub')}</small>
          </button>
          <button className={'lk-tab' + (tab === 'korrektur' ? ' on' : '')} onClick={() => cambiarPestana('korrektur')}>
            <span>✅ Korrektur</span>
            <small>{c.korrekturen.length === 0 ? t('tb.noMistakes') : t('tb.nCorrections', { n: c.korrekturen.length })}</small>
          </button>
        </div>
      )}

      {(!c || tab === 'schreiben') && (
        <div key={tab} className={'stack diary-tab-panel diary-tab-panel-' + tabDirection}>
          <div>
            <div className="prompt-label">{t('tb.writePrompt')}</div>
            <textarea
              ref={area}
              className="nb-raw"
              lang="de"
              spellCheck={false}
              rows={12}
              placeholder="Heute bin ich früh aufgestanden…"
              value={text}
              onChange={(e) => onText(e.target.value)}
              onBlur={() => persist({ text })}
            />
            <div className="diary-pie">
              <Umlaut campo={area} onTexto={onText} />
              <span className="diary-count muted">{n} {n === 1 ? t('word') : t('words')}</span>
            </div>
          </div>

          {/* El tema va DEBAJO del cuadro de escribir: así lo primero que ves
              al abrir la entrada es el sitio donde ponerte a escribir, y el
              tema se queda de consulta, con las preguntas y los arranques a
              mano mientras redactas. */}
          {entry.thema && (
            <div className="card tb-tema">
              <div className="row spread" style={{ alignItems: 'flex-start', gap: 12 }}>
                <div>
                  <div className="lk-block-title" style={{ margin: 0 }}>📝 {entry.thema.thema}</div>
                  {entry.thema.themaEs && <p className="tb-tema-es muted">{entry.thema.themaEs}</p>}
                </div>
                {/* Aquí también, y no solo en la caja de ideas: esa se esconde
                    en cuanto escribes una palabra, y es justo entonces cuando
                    puedes querer cambiar de tema. */}
                <div className="row" style={{ gap: 10, flex: '0 0 auto' }}>
                  <button className="btn-ghost btn-sm" onClick={pedirTema} disabled={!aiOn || temaBusy}>
                    {temaBusy ? t('tb.topicThinking') : t('tb.topicAgain')}
                  </button>
                  <button
                    className="link-btn"
                    style={{ padding: 0, fontSize: '0.8rem', color: 'var(--bad)' }}
                    onClick={() => persist({ thema: null })}
                  >
                    ✕ {t('tb.dropTopic')}
                  </button>
                </div>
              </div>

              {entry.thema.fragen?.length > 0 && (
                <ol className="tb-tema-fragen">
                  {entry.thema.fragen.map((f, i) => <li key={i}>{f}</li>)}
                </ol>
              )}

              {entry.thema.anfaenge?.length > 0 && (
                <div className="tb-tema-caja">
                  <div className="tb-tema-et muted">{t('tb.starters')}</div>
                  <div className="nb-chips">
                    {entry.thema.anfaenge.map((a, i) => (
                      <button className="ask-chip" key={i} onClick={() => ponerAnfang(a)}>{a}</button>
                    ))}
                  </div>
                </div>
              )}

              {entry.thema.wortschatz?.length > 0 && (
                <>
                  <div className="tb-tema-et muted" style={{ marginTop: 12 }}>{t('tb.topicWords')}</div>
                  <div className="nb-chips">
                    {entry.thema.wortschatz.map((w, i) => (
                      <span className="nb-chip voc" key={i}><strong>{w.de}</strong> — {w.es}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {!text.trim() && (
            <div className="card">
              {/* Aqui si hay cuadro donde escribir, asi que pulsar una idea
                  la mete en el texto. El titulo lo pone IdeasDiario: antes
                  estaba tambien aqui arriba y salia repetido. Las ideas van
                  escritas en el codigo; pedirle a la IA un tema a medida, no,
                  y por eso ese boton va como `accion`. */}
              <IdeasDiario
                cuantas={5}
                onElegir={ponerAnfang}
                accion={
                  !SIN_IA && (
                    <button className="btn-ghost btn-sm" onClick={pedirTema} disabled={!aiOn || temaBusy}>
                      {temaBusy ? t('tb.topicThinking') : entry.thema ? t('tb.topicAgain') : t('tb.topicBtn')}
                    </button>
                  )
                }
              />
              {jobTema.status === 'error' && (
                <p style={{ color: 'var(--bad)', fontSize: '0.83rem', marginTop: 10 }}>{jobTema.error}</p>
              )}
            </div>
          )}

          {/* Corregir lo hace la IA. Sin ella no queda ningún botón, así que
              la fila entera se va en vez de dejar un hueco vacío al final. */}
          {!SIN_IA && (
            <div className="row" style={{ gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
              <button className="btn-primary btn-corregir" onClick={corregir} disabled={!aiOn || !text.trim() || busy}>
                {busy ? t('tb.correcting') : c ? t('tb.correctAgain') : t('tb.correctBtn')}
              </button>
            </div>
          )}
          {!SIN_IA && !aiOn && (
            <p className="muted" style={{ fontSize: '0.83rem', marginTop: -4 }}>
              {t('tb.offCorrect')}
            </p>
          )}
          {err && <p style={{ color: 'var(--bad)', fontSize: '0.85rem', marginTop: -4 }}>{err}</p>}
        </div>
      )}

      {c && tab === 'korrektur' && (
        <div key={tab} className={'stack diary-tab-panel diary-tab-panel-' + tabDirection}>
          {esOtroIdioma(entry.correctionLang) && (
            <p className="aviso-idioma">⚠ {t('otroIdioma')}</p>
          )}
          {c.lob && (
            <div className="card diary-lob">
              <span className="diary-lob-ico">👏</span>
              <div>
                <strong>{t('tb.praise')}</strong>
                <p style={{ marginTop: 4 }}>{c.lob}</p>
              </div>
            </div>
          )}

          <div className="card">
            <div className="row spread" style={{ marginBottom: 8 }}>
              <div className="lk-block-title" style={{ margin: 0 }}>{t('tb.corrected2')}</div>
              {c.niveau && <span className="pill">{t('level')} {c.niveau}</span>}
            </div>
            <p className="diary-korrigiert">{c.korrigiert}</p>
          </div>

          {c.korrekturen.length === 0 ? (
            <div className="card center">
              <p className="muted">{t('tb.perfect')}</p>
            </div>
          ) : (
            <div className="card">
              <div className="lk-block-title">{t('tb.oneByOne')}</div>
              <div className="stack" style={{ gap: 10, marginTop: 10 }}>
                {c.korrekturen.map((k, i) => (
                  <div className="diary-korr" key={i}>
                    <div className="diary-korr-head">
                      <span className={'nb-chip ' + (TIPO_CLASS[k.typ] || 'gram')}>{k.typ}</span>
                      {k.regel && <span className="muted diary-regel">{k.regel}</span>}
                    </div>
                    <div className="diary-diff">
                      <span className="falsch">{k.original}</span>
                      <span className="pfeil">→</span>
                      <span className="richtig">{k.korrektur}</span>
                    </div>
                    {k.erklaerung && <p className="diary-warum">{k.erklaerung}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {c.lektion && (
            <div className="card diary-lektion">
              <div className="lk-block-title">{t('tb.lesson', { t: c.lektion.titel })}</div>
              {c.lektion.erklaerung && <p className="lk-expl">{c.lektion.erklaerung}</p>}
              {c.lektion.beispiele?.length > 0 && (
                <ul className="lk-examples">
                  {c.lektion.beispiele.map((b, i) => (
                    <li key={i}>
                      <span className="de">{b.de}</span>
                      <span className="es">{b.es}</span>
                    </li>
                  ))}
                </ul>
              )}
              {c.lektion.tabelle && (
                <div className="scroll-x" style={{ marginTop: 12 }}>
                  {c.lektion.tabelle.title && <h3 style={{ marginBottom: 8 }}>{c.lektion.tabelle.title}</h3>}
                  <table>
                    <thead>
                      <tr>{c.lektion.tabelle.headers.map((h, i) => <th key={i}>{h}</th>)}</tr>
                    </thead>
                    <tbody>
                      {c.lektion.tabelle.rows.map((r, i) => (
                        <tr key={i}>{r.map((x, j) => <td key={j}>{x}</td>)}</tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {c.wortschatz.length > 0 && (
            <div className="card diary-native">
              <div className="lk-block-title">{t('tb.native')}</div>
              <div className="stack" style={{ gap: 8, marginTop: 10 }}>
                {c.wortschatz.map((w, i) => (
                  <div className="diary-wort" key={i}>
                    <div className="diary-diff">
                      {w.statt && <span className="falsch">{w.statt}</span>}
                      {w.statt && <span className="pfeil">→</span>}
                      <span className="richtig">{w.besser}</span>
                    </div>
                    {w.es && <span className="muted diary-wort-es">{w.es}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {c.naechsterSchritt && (
            <div className="card diary-next">
              <span className="diary-lob-ico">🎯</span>
              <div>
                <strong>{t('tb.nextStep')}</strong>
                <p style={{ marginTop: 4 }}>{c.naechsterSchritt}</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
