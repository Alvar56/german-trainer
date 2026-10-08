import React, { useEffect, useRef, useState } from 'react';
import { Altavoz } from './IconoMenu.jsx';
import FoxOverlay, { useFox } from './FoxOverlay.jsx';
import { t } from '../lib/i18n.js';
import Cargando from './Cargando.jsx';
import { runJob } from '../lib/aiJobs.js';
import { useAiJob } from '../lib/useAiJob.js';
import { generateSprechenAufgabe } from '../lib/pruefungAi.js';
import { getTyp } from '../lib/pruefung.js';
import Desplegable from './Desplegable.jsx';
import { useTeclas } from '../lib/teclas.js';

export default function ExamSprechen({ typ, onBack }) {
  useTeclas({ Escape: onBack });
  const fox = useFox();
  // La tarea, en el gestor de trabajos: tarda y no debe perderse al salir.
  const JOB = `examen:sprechen:${typ}`;
  const job = useAiJob(JOB);
  const aufgabe = job.status === 'done' ? job.result : null;
  const busy = job.status === 'running';
  const err = job.status === 'error' ? job.error : '';
  const [verModelo, setVerModelo] = useState(false);
  const [seg, setSeg] = useState(null); // temporizador de preparación
  const timer = useRef(null);

  useEffect(() => {
    if (job.status === 'idle') cargar();
    return () => clearInterval(timer.current);
  }, []);

  useEffect(() => {
    if (seg === null) return;
    if (seg <= 0) { clearInterval(timer.current); return; }
  }, [seg]);

  async function cargar() {
    setVerModelo(false); setSeg(null);
    clearInterval(timer.current);
    await runJob(JOB, () => generateSprechenAufgabe({ typ }));
  }

  function empezarPrep(sec) {
    clearInterval(timer.current);
    setSeg(sec);
    timer.current = setInterval(() => {
      setSeg((s) => {
        if (s <= 1) { clearInterval(timer.current); return 0; }
        return s - 1;
      });
    }, 1000);
  }

  function leer(texto) {
    const sy = window.speechSynthesis;
    if (!sy) return;
    const vs = sy.getVoices();
    const voz = vs.find((v) => /^de/i.test(v.lang));
    if (!voz) return;
    sy.cancel();
    const u = new SpeechSynthesisUtterance(texto);
    u.voice = voz;
    u.lang = voz.lang;
    u.rate = 0.95;
    sy.speak(u);
  }

  const tipoInfo = getTyp('sprechen', typ);
  const hayVoz = (window.speechSynthesis?.getVoices?.() || []).some((v) => /^de/i.test(v.lang));

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

  if (err) {
    return (
      <div className="reading stack">
        <button className="link-btn" style={{ padding: 0, alignSelf: 'flex-start' }} onClick={onBack}><span className="fl-atras">←</span> Prüfung</button>
        <div className="card" style={{ borderColor: 'var(--bad)', background: 'var(--bad-bg)' }}>{err}</div>
        <button className="btn-primary" style={{ alignSelf: 'flex-start' }} onClick={cargar}>{t('retry')}</button>
      </div>
    );
  }

  // Sin tarea y sin error es el primer render, antes de que el efecto lance la
  // generación: está empezando, no ha fallado.
  if (!aufgabe) {
    return (
      <div className="reading stack">
        <button className="link-btn" style={{ padding: 0, alignSelf: 'flex-start' }} onClick={onBack}><span className="fl-atras">←</span> Prüfung</button>
        <Cargando
          icono="🗣"
          titulo={t('wait.exTitle')}
          pasos={[t('wait.ex1'), t('wait.ex2'), t('wait.ex3'), t('wait.ex4')]}
        />
      </div>
    );
  }

  const mm = seg === null ? null : String(Math.floor(seg / 60)).padStart(2, '0') + ':' + String(seg % 60).padStart(2, '0');

  return (
    <div className="reading stack">
      <button className="link-btn" style={{ padding: 0, alignSelf: 'flex-start' }} onClick={onBack}>
        <span className="fl-atras">←</span> Prüfung
      </button>

      <div className="page-head" style={{ marginBottom: 0 }}>
        <h1>{aufgabe.titel || tipoInfo?.name}</h1>
        <p>{tipoInfo?.name} · tema: {aufgabe.thema}</p>
      </div>

      <div className="card">
        <div className="lk-block-title">{aufgabe.anweisung}</div>
        {aufgabe.anweisungEs && <p className="muted" style={{ fontSize: '0.86rem' }}>{aufgabe.anweisungEs}</p>}
      </div>

      <div className="card sprech-prep">
        <div>
          <strong>{t('ex.prepTime')}</strong>
          <p className="muted" style={{ fontSize: '0.84rem', marginTop: 3 }}>
            {t('ex.prepNote')}
          </p>
        </div>
        <div className="row" style={{ gap: 10 }}>
          {mm !== null && <span className={'sprech-timer' + (seg === 0 ? ' fin' : '')}>{mm}</span>}
          <button className="btn-primary" onClick={() => empezarPrep(180)}>
            {seg === null ? '⏱ 3 min' : t('ex.restart')}
          </button>
        </div>
      </div>

      {aufgabe.karten.length > 0 && (
        <div>
          <div className="prompt-label">
            {typ === 'planen' ? t('ex.agreeOn') : t('ex.yourCards')}
          </div>
          <div className="karten">
            {aufgabe.karten.map((k, i) => (
              <div className="karte" key={i}>
                <span className="karte-n">{i + 1}</span>
                <span className="karte-w">{k}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {aufgabe.redemittel.length > 0 && (
        <div className="card">
          <div className="lk-block-title">{t('ex.phrasesNeeded')}</div>
          <ul className="lk-examples" style={{ marginTop: 10 }}>
            {aufgabe.redemittel.map((r, i) => (
              <li key={i}>
                <span className="de">
                  {r.de}
                  {hayVoz && (
                    <button className="say-btn" title="Escuchar" onClick={() => leer(r.de)}><Altavoz /></button>
                  )}
                </span>
                <span className="es">{r.es}</span>
                {r.wofuer && <span className="dlg-wann">{r.wofuer}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {aufgabe.bewertung.length > 0 && (
        <div className="card falle">
          <span className="falle-ico">👀</span>
          <div>
            <strong>{t('ex.examinerLooks')}</strong>
            <ul className="pitfalls" style={{ marginTop: 6 }}>
              {aufgabe.bewertung.map((b, i) => <li key={i}>{b}</li>)}
            </ul>
          </div>
        </div>
      )}

      {aufgabe.musterdialog.length > 0 && (
        <div className="card">
          <button className="komm-head" onClick={() => setVerModelo(!verModelo)}>
            <span className="lk-block-title" style={{ margin: 0 }}>{t('ex.howSolved')}</span>
            <span className="muted" style={{ fontSize: '0.78rem' }}>
              {verModelo ? t('ex.hide') : t('ex.tryFirst')}
            </span>
          </button>
          <Desplegable abierto={verModelo}>
            <div className="dialog" style={{ marginTop: 12 }}>
              {aufgabe.musterdialog.map((turn, i) => (
                <div className={'dlg-turn ' + (i % 2 === 0 ? 'a' : 'b')} key={i}>
                  <div className="dlg-wer">{turn.wer}</div>
                  <div className="dlg-bubble">
                    <div className="dlg-de">
                      {turn.de}
                      {hayVoz && <button className="say-btn" title="Escuchar" onClick={() => leer(turn.de)}><Altavoz /></button>}
                    </div>
                    {turn.es && <div className="dlg-es">{turn.es}</div>}
                  </div>
                </div>
              ))}
            </div>
          </Desplegable>
        </div>
      )}

      <div className="row" style={{ gap: 12, flexWrap: 'wrap' }}>
        <button className="btn-primary" onClick={cargar}>{t('ex.otherTask')}</button>
        <button className="btn-ghost" onClick={onBack}>{t('ex.backBtn')}</button>
      </div>

      <FoxOverlay fox={fox} />
      <p className="muted" style={{ fontSize: '0.8rem' }}>
        {t('ex.sprechenNote')}
      </p>
    </div>
  );
}
