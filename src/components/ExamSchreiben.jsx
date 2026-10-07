import React, { useEffect, useRef, useState } from 'react';
import FoxOverlay, { useFox } from './FoxOverlay.jsx';
import { t } from '../lib/i18n.js';
import Cargando from './Cargando.jsx';
import { generateSchreibenAufgabe, correctSchreiben } from '../lib/pruefungAi.js';
import { saveResult, veredicto, getTyp, BESTANDEN } from '../lib/pruefung.js';
import { recordActivity } from '../lib/streak.js';
import { runJob } from '../lib/aiJobs.js';
import { useAiJob } from '../lib/useAiJob.js';
import { ganar, MONEDAS_EXAMEN } from '../lib/monedas.js';
import { countWords } from '../lib/diary.js';
import Umlaut from './Umlaut.jsx';
import Desplegable from './Desplegable.jsx';
import { useTeclas } from '../lib/teclas.js';

// El tipo llega de la IA en el idioma de la interfaz, así que se reconoce en
// ambos para que el color del chip no se pierda al cambiar de idioma.
const TIPO_CLASS = {
  'Gramática': 'gram', 'Grammar': 'gram',
  'Vocabulario': 'voc', 'Vocabulary': 'voc',
  'Ortografía': 'orto', 'Spelling': 'orto',
  'Orden de la frase': 'orden', 'Word order': 'orden', 'Sentence order': 'orden',
  'Estilo': 'stil', 'Style': 'stil'
};

export default function ExamSchreiben({ typ, onBack }) {
  useTeclas({ Escape: onBack });
  const fox = useFox();
  // Igual que en Lesen/Hören: la tarea vive en el gestor de trabajos para que
  // irse a otra sección no la tire.
  const JOB = `examen:schreiben:${typ}`;
  const job = useAiJob(JOB);
  const aufgabe = job.status === 'done' ? job.result : null;
  const busy = job.status === 'running';
  const [corrigiendo, setCorrigiendo] = useState(false);
  const [err, setErr] = useState('');
  const [text, setText] = useState('');
  const [res, setRes] = useState(null);
  const [verModelo, setVerModelo] = useState(false);
  const area = useRef(null);
  const inicio = useRef(Date.now());

  // Si ya estaba generándose (o lista) al volver, se aprovecha.
  useEffect(() => { if (job.status === 'idle') cargar(); }, []);

  async function cargar() {
    setErr(''); setRes(null); setText(''); setVerModelo(false);
    const a = await runJob(JOB, () => generateSchreibenAufgabe({ typ }));
    if (a) inicio.current = Date.now();
  }

  async function corregir() {
    setErr(''); setCorrigiendo(true);
    try {
      const r = await correctSchreiben({ aufgabe, text });
      setRes(r);
      saveResult({
        teil: 'schreiben',
        typ,
        correct: r.punkte.filter((p) => p.erfuellt).length,
        total: r.punkte.length || aufgabe.punkte.length,
        seconds: Math.round((Date.now() - inicio.current) / 1000)
      });
      recordActivity(Math.round(r.punktzahl / 5), Date.now() - inicio.current);
      // punktzahl viene en % , así que el premio sale solo
      ganar(Math.round((MONEDAS_EXAMEN * r.punktzahl) / 100));
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (e) {
      setErr(e.message);
    } finally {
      setCorrigiendo(false);
    }
  }

  const tipoInfo = getTyp('schreiben', typ);
  const n = countWords(text);

  if (busy) {
    return (
      <div className="reading stack">
        <button className="link-btn" style={{ padding: 0, alignSelf: 'flex-start' }} onClick={onBack}><span className="fl-atras">←</span> Prüfung</button>
        <Cargando
          icono="📝"
          titulo={t('wait.exTitle')}
          pasos={[t('wait.ex1'), t('wait.ex2'), t('wait.ex3'), t('wait.ex4')]}
        />
      </div>
    );
  }

  // El fallo puede venir del trabajo de generación o de la corrección
  const fallo = err || (job.status === 'error' ? job.error : '');

  if (fallo && !aufgabe) {
    return (
      <div className="reading stack">
        <button className="link-btn" style={{ padding: 0, alignSelf: 'flex-start' }} onClick={onBack}><span className="fl-atras">←</span> Prüfung</button>
        <div className="card" style={{ borderColor: 'var(--bad)', background: 'var(--bad-bg)' }}>{fallo}</div>
        <button className="btn-primary" style={{ alignSelf: 'flex-start' }} onClick={cargar}>{t('retry')}</button>
      </div>
    );
  }

  // Primer render: el trabajo todavía está en 'idle' porque quien lo lanza es
  // un efecto, y los efectos van DESPUÉS de pintar. O sea que aquí no hay
  // tarea ni la hay corriendo, y se seguía de largo a pintar aufgabe.algo:
  // la primera vez que entrabas en Schreiben, la pantalla reventaba.
  if (!aufgabe) {
    return (
      <div className="reading stack">
        <button className="link-btn" style={{ padding: 0, alignSelf: 'flex-start' }} onClick={onBack}><span className="fl-atras">←</span> Prüfung</button>
        <Cargando
          icono="📝"
          titulo={t('wait.exTitle')}
          pasos={[t('wait.ex1'), t('wait.ex2'), t('wait.ex3'), t('wait.ex4')]}
        />
      </div>
    );
  }

  const v = res ? veredicto(res.punktzahl) : null;

  return (
    <div className="reading stack">
      <button className="link-btn" style={{ padding: 0, alignSelf: 'flex-start' }} onClick={onBack}>
        <span className="fl-atras">←</span> Prüfung
      </button>

      <div className="page-head" style={{ marginBottom: 0 }}>
        <h1>Schreiben — {tipoInfo?.name.replace(/^Teil \d · /, '')}</h1>
        <p>{aufgabe.situationEs}</p>
      </div>

      {res && (
        <div className={'card pruef-score ' + v.tono}>
          <div className="ps-num">{res.punktzahl}%</div>
          <div>
            <strong>{v.txt}</strong>
            <p className="muted" style={{ marginTop: 2 }}>
              {t('ex.pointsCovered', { a: res.punkte.filter((p) => p.erfuellt).length, b: res.punkte.length, p: BESTANDEN })}
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="lk-block-title">{aufgabe.anweisung}</div>
        {aufgabe.empfaenger && (
          <p className="muted" style={{ fontSize: '0.84rem' }}>{t('ex.writeTo', { q: aufgabe.empfaenger })}</p>
        )}
        <div className="punkte-liste">
          {aufgabe.punkte.map((p, i) => {
            const r = res?.punkte?.[i];
            return (
              <div className={'punkt' + (r ? (r.erfuellt ? ' ok' : ' ko') : '')} key={i}>
                <span className="punkt-n">{r ? (r.erfuellt ? '✓' : '✕') : i + 1}</span>
                <div>
                  <div>{p}</div>
                  {r?.kommentar && <p className="punkt-kom">{r.kommentar}</p>}
                </div>
              </div>
            );
          })}
        </div>
        <p className="muted" style={{ fontSize: '0.8rem', marginTop: 10 }}>
          {t('ex.aboutWords', { n: aufgabe.woerter })}
        </p>
      </div>

      {aufgabe.stimulus && (
        <div className="card lese-text">
          <div className="muted" style={{ fontSize: '0.76rem', marginBottom: 6 }}>{t('ex.mailGot')}</div>
          <pre>{aufgabe.stimulus}</pre>
        </div>
      )}

      <div>
        <div className="prompt-label">Deine Antwort</div>
        <textarea
          ref={area}
          className="nb-raw"
          lang="de"
          rows={9}
          placeholder="Liebe/r …"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!!res}
        />
        <div className="diary-pie">
          {/* En el examen de verdad escribes a mano; aquí el teclado español
              no tiene estas letras, y en Schreiben se corrigen como falta. */}
          {!res && <Umlaut campo={area} onTexto={setText} />}
          <span className="diary-count muted">
            {t('ex.wordsTarget', { n, o: aufgabe.woerter })}
          </span>
        </div>
      </div>

      {!res ? (
        <>
          <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-primary btn-corregir" onClick={corregir} disabled={!text.trim() || corrigiendo}>
              {corrigiendo ? t('tb.correcting') : t('ex.finish')}
            </button>
            <button className="btn-ghost" onClick={cargar} disabled={corrigiendo}>{t('ex.otherTask')}</button>
          </div>
          {err && <p style={{ color: 'var(--bad)', fontSize: '0.85rem' }}>{err}</p>}
        </>
      ) : (
        <div className="stack">
          <div className="card">
            <div className="lk-block-title">{t('ex.howScored')}</div>
            <div className="bewertung">
              <div><strong>{t('ex.critTask')}</strong><p>{res.bewertung.aufgabe}</p></div>
              <div><strong>{t('ex.critCoh')}</strong><p>{res.bewertung.kohaerenz}</p></div>
              <div><strong>{t('ex.critVoc')}</strong><p>{res.bewertung.wortschatz}</p></div>
              <div><strong>{t('ex.critGram')}</strong><p>{res.bewertung.grammatik}</p></div>
            </div>
          </div>

          {res.korrigiert && (
            <div className="card">
              <div className="lk-block-title">{t('ex.yourCorrected')}</div>
              <p className="diary-korrigiert">{res.korrigiert}</p>
            </div>
          )}

          {res.korrekturen.length > 0 && (
            <div className="card">
              <div className="lk-block-title">{t('ex.corrections')}</div>
              <div className="stack" style={{ gap: 10, marginTop: 10 }}>
                {res.korrekturen.map((k, i) => (
                  <div className="diary-korr" key={i}>
                    <div className="diary-korr-head">
                      <span className={'nb-chip ' + (TIPO_CLASS[k.typ] || 'gram')}>{k.typ}</span>
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

          {res.tipp && (
            <div className="card diary-next">
              <span className="diary-lob-ico">🎯</span>
              <div><strong>{t('ex.nextTime')}</strong><p style={{ marginTop: 4 }}>{res.tipp}</p></div>
            </div>
          )}

          {res.musterloesung && (
            <div className="card">
              <button className="komm-head" onClick={() => setVerModelo(!verModelo)}>
                <span className="lk-block-title" style={{ margin: 0 }}>{t('ex.model')}</span>
                <span className="muted" style={{ fontSize: '0.78rem' }}>{verModelo ? '▴' : t('ex.see')}</span>
              </button>
              <Desplegable abierto={verModelo}>
                <p className="diary-korrigiert" style={{ marginTop: 10 }}>{res.musterloesung}</p>
              </Desplegable>
            </div>
          )}

          <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
            <button className="btn-primary" onClick={cargar}>{t('ex.otherTask')}</button>
            <button className="btn-ghost" onClick={onBack}>{t('ex.backBtn')}</button>
          </div>
        </div>
      )}
      <FoxOverlay fox={fox} />
    </div>
  );
}
