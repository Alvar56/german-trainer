import React, { useEffect, useRef, useState } from 'react';
import FoxOverlay, { useFox } from './FoxOverlay.jsx';
import { t } from '../lib/i18n.js';
import Cargando from './Cargando.jsx';
import { generateExamAufgabe } from '../lib/pruefungAi.js';
import { runJob } from '../lib/aiJobs.js';
import { useAiJob } from '../lib/useAiJob.js';
import { saveResult, veredicto, getTyp, BESTANDEN } from '../lib/pruefung.js';
import { recordActivity } from '../lib/streak.js';
import { ganar, MONEDAS_EXAMEN } from '../lib/monedas.js';
import BotonCopiar from './BotonCopiar.jsx';
import { useTeclas } from '../lib/teclas.js';

// Busca una voz alemana entre las instaladas en el sistema.
function germanVoice() {
  const vs = window.speechSynthesis?.getVoices?.() || [];
  return (
    vs.find((v) => /^de-AT/i.test(v.lang)) ||
    vs.find((v) => /^de/i.test(v.lang)) ||
    null
  );
}

export default function ExamLesenHoeren({ teil, typ, onBack }) {
  useTeclas({ Escape: onBack });
  const fox = useFox();
  const esHoeren = teil === 'hoeren';
  // La tarea se genera en el gestor de trabajos, no en el estado de aquí:
  // tarda un par de minutos y es normal irse a otra sección mientras. Antes,
  // al volver, no había nada y tocaba empezar de cero.
  const JOB = `examen:${teil}:${typ}`;
  const job = useAiJob(JOB);
  const aufgabe = job.status === 'done' ? job.result : null;
  const busy = job.status === 'running';
  const err = job.status === 'error' ? job.error : '';
  const [respuestas, setRespuestas] = useState({});
  const [enviado, setEnviado] = useState(false);
  const [verSkript, setVerSkript] = useState(false);
  const [reproducciones, setReproducciones] = useState(0);
  const [hablando, setHablando] = useState(false);
  const [voz, setVoz] = useState(() => germanVoice());
  const [rate, setRate] = useState(0.9);
  const inicio = useRef(Date.now());

  useEffect(() => {
    // Si ya la estabas generando (o ya está lista) al volver a entrar, se
    // aprovecha en vez de tirarla y empezar otra.
    if (job.status === 'idle') cargar();
    const sy = window.speechSynthesis;
    if (sy) {
      const onv = () => setVoz(germanVoice());
      sy.addEventListener?.('voiceschanged', onv);
      return () => {
        sy.cancel();
        sy.removeEventListener?.('voiceschanged', onv);
      };
    }
  }, []);

  async function cargar() {
    setRespuestas({});
    setEnviado(false);
    setVerSkript(false);
    setReproducciones(0);
    const a = await runJob(JOB, () => generateExamAufgabe({ teil, typ }));
    if (a) inicio.current = Date.now();
  }

  // Lo que se lee en voz alta: el guion sin las marcas de separación ni los
  // nombres de quien habla.
  function textoParaLeer() {
    return String(aufgabe?.skript || '')
      .replace(/^---$/gm, '. ')
      .replace(/^([A-ZÄÖÜ][^:\n]{0,20}):\s*/gm, '')
      .trim();
  }

  // Copiar ese mismo texto para oírlo en otro sitio con mejor voz vive en
  // BotonCopiar: lo mismo hace falta en Kommunikation, y no lo enseña por
  // pantalla, que sería ver la solución.

  function reproducir() {
    const sy = window.speechSynthesis;
    if (!sy || !aufgabe?.skript) return;
    sy.cancel();
    const texto = textoParaLeer();
    const u = new SpeechSynthesisUtterance(texto);
    if (voz) u.voice = voz;
    u.lang = voz?.lang || 'de-DE';
    u.rate = rate;
    u.onend = () => setHablando(false);
    u.onerror = () => setHablando(false);
    setHablando(true);
    setReproducciones((n) => n + 1);
    sy.speak(u);
  }

  function parar() {
    window.speechSynthesis?.cancel();
    setHablando(false);
  }

  function corregir() {
    const total = aufgabe.aufgaben.length;
    const correct = aufgabe.aufgaben.filter((a, i) => respuestas[i] === a.loesung).length;
    const seconds = Math.round((Date.now() - inicio.current) / 1000);
    saveResult({ teil, typ, correct, total, seconds });
    recordActivity(correct * 10, Date.now() - inicio.current);
    // en proporción a los aciertos: contestar a boleo no paga
    ganar(Math.round((MONEDAS_EXAMEN * correct) / Math.max(1, total)));
    // Aprobado del examen real: 60 %.
    fox.acierto(correct >= total * 0.6);
    setEnviado(true);
    parar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const tipoInfo = getTyp(teil, typ);

  if (busy) {
    return (
      <div className="reading stack">
        <button className="link-btn" style={{ padding: 0, alignSelf: 'flex-start' }} onClick={onBack}><span className="fl-atras">←</span> Prüfung</button>
        <Cargando
          icono={esHoeren ? '🎧' : '📖'}
          titulo={t('wait.exTitle')}
          pasos={[t('wait.ex1'), t('wait.ex2'), t('wait.ex3'), t('wait.ex4')]}
        />
      </div>
    );
  }

  if (err) {
    return (
      <div className="reading stack">
        <button className="link-btn" style={{ padding: 0, alignSelf: 'flex-start' }} onClick={onBack}><span className="fl-atras">←</span> Prüfung</button>
        <div className="card" style={{ borderColor: 'var(--bad)', background: 'var(--bad-bg)' }}>
          {err || t('ex.cantLoad')}
        </div>
        <button className="btn-primary" style={{ alignSelf: 'flex-start' }} onClick={cargar}>{t('retry')}</button>
      </div>
    );
  }

  // Sin tarea y sin error es el primer render, antes de que el efecto lance la
  // generación. Eso es que está empezando, no que haya fallado: antes enseñaba
  // un instante "no se pudo cargar" y luego se corregía solo.
  if (!aufgabe) {
    return (
      <div className="reading stack">
        <button className="link-btn" style={{ padding: 0, alignSelf: 'flex-start' }} onClick={onBack}><span className="fl-atras">←</span> Prüfung</button>
        <Cargando
          icono={esHoeren ? '🎧' : '📖'}
          titulo={t('wait.exTitle')}
          pasos={[t('wait.ex1'), t('wait.ex2'), t('wait.ex3'), t('wait.ex4')]}
        />
      </div>
    );
  }

  const total = aufgabe.aufgaben.length;
  const contestadas = Object.keys(respuestas).length;
  const correct = aufgabe.aufgaben.filter((a, i) => respuestas[i] === a.loesung).length;
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const v = veredicto(pct);

  return (
    <div className="reading stack">
      <button className="link-btn" style={{ padding: 0, alignSelf: 'flex-start' }} onClick={onBack}>
        <span className="fl-atras">←</span> Prüfung
      </button>

      <div className="page-head" style={{ marginBottom: 0 }}>
        <h1>{aufgabe.titel || tipoInfo?.name}</h1>
        <p>{tipoInfo?.name} · {aufgabe.situation}</p>
      </div>

      {enviado && (
        <div className={'card pruef-score ' + v.tono}>
          <div className="ps-num">{pct}%</div>
          <div>
            <strong>{v.txt}</strong>
            <p className="muted" style={{ marginTop: 2 }}>
              {t('ex.passWith', { c: correct, t: total, p: BESTANDEN })}
            </p>
          </div>
        </div>
      )}

      <div className="card">
        <div className="lk-block-title">{aufgabe.anweisung}</div>
        {aufgabe.anweisungEs && <p className="muted" style={{ fontSize: '0.86rem' }}>{aufgabe.anweisungEs}</p>}
      </div>

      {/* ---- audio (Hören) ---- */}
      {esHoeren && aufgabe.skript && (
        <div className="card hoer-box">
          <div className="row spread" style={{ flexWrap: 'wrap', gap: 10 }}>
            <div className="row" style={{ gap: 10 }}>
              <button className="btn-primary" onClick={hablando ? parar : reproducir} disabled={!voz}>
                {hablando ? t('ex.stop') : reproducciones === 0 ? t('ex.listen') : t('ex.listenAgain')}
              </button>
              {/* Copiar el texto para oírlo fuera con una voz mejor. Antes de
                  corregir: es ahí donde sirve de algo. */}
              <BotonCopiar texto={textoParaLeer} disabled={enviado} />
              <span className="muted" style={{ fontSize: '0.8rem' }}>
                {reproducciones === 0
                  ? t('ex.listenNote')
                  : reproducciones === 1
                  ? t('ex.listenedOnce')
                  : t('ex.listenedN', { n: reproducciones })}
              </span>
            </div>
            <label className="row" style={{ gap: 8, fontSize: '0.8rem' }}>
              {t('ex.speed')}
              <input
                type="range" min="0.6" max="1.1" step="0.05"
                value={rate} onChange={(e) => setRate(Number(e.target.value))}
              />
            </label>
          </div>

          {!voz && (
            <div className="hoer-warn">
              <strong>{t('ex.noVoice')}</strong>
              <p style={{ marginTop: 4 }}>
                {t('ex.noVoiceHow')}
              </p>
              <button className="btn-ghost btn-sm" style={{ marginTop: 8 }} onClick={() => setVerSkript(true)}>
                {t('ex.showScript')}
              </button>
            </div>
          )}

          {(verSkript || enviado) && (
            <div className="hoer-skript">
              <div className="muted" style={{ fontSize: '0.76rem', marginBottom: 6 }}>{t('ex.script')}</div>
              <pre>{aufgabe.skript}</pre>
            </div>
          )}
        </div>
      )}

      {/* ---- texto (Lesen) ---- */}
      {aufgabe.text && (
        <div className="card lese-text">
          <pre>{aufgabe.text}</pre>
        </div>
      )}

      {/* ---- material: anuncios / carteles ---- */}
      {aufgabe.material.length > 0 && (
        <div className="material-grid">
          {aufgabe.material.map((m) => (
            <div className="card material" key={m.id}>
              <div className="mat-id">{m.id}</div>
              {m.titel && <div className="mat-titel">{m.titel}</div>}
              <div className="mat-text">{m.text}</div>
            </div>
          ))}
        </div>
      )}

      {/* ---- preguntas ---- */}
      <div className="stack" style={{ gap: 12 }}>
        {aufgabe.aufgaben.map((a, i) => {
          const elegida = respuestas[i];
          const acierto = elegida === a.loesung;
          return (
            <div className={'card frage' + (enviado ? (acierto ? ' ok' : ' ko') : '')} key={i}>
              <div className="frage-head">
                <span className="frage-n">{i + 1}</span>
                <span className="frage-txt">{a.frage}</span>
              </div>

              <div className={'opt-row' + (a.optionen.length > 3 ? ' many' : '')}>
                {a.optionen.map((o, j) => {
                  let cls = 'opt';
                  if (enviado) {
                    if (j === a.loesung) cls += ' correcta';
                    else if (j === elegida) cls += ' fallada';
                    else cls += ' dim';
                  } else if (j === elegida) cls += ' elegida';
                  return (
                    <button
                      key={j}
                      className={cls}
                      disabled={enviado}
                      onClick={() => setRespuestas((r) => ({ ...r, [i]: j }))}
                    >
                      {o}
                    </button>
                  );
                })}
              </div>

              {enviado && (
                <div className="frage-fb">
                  {a.stelle && (
                    <p className="fb-stelle">
                      <span className="muted">{t('ex.itsHere')}</span>«{a.stelle}»
                    </p>
                  )}
                  {a.warum && <p className="fb-warum">{a.warum}</p>}
                  {a.falle && <p className="fb-falle">⚠️ {a.falle}</p>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {!enviado ? (
        <div className="row" style={{ gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn-primary btn-corregir" onClick={corregir} disabled={contestadas < total}>
            {t('ex.finish')}
          </button>
          <span className="muted" style={{ fontSize: '0.84rem' }}>
            {t('ex.answered', { a: contestadas, b: total })}
          </span>
        </div>
      ) : (
        <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
          <button className="btn-primary" onClick={cargar}>{t('ex.sameAgain')}</button>
          <button className="btn-ghost" onClick={onBack}>{t('ex.backBtn')}</button>
        </div>
      )}
      <FoxOverlay fox={fox} mudo={enviado} />
    </div>
  );
}
