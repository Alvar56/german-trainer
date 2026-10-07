import React, { useEffect, useRef, useState } from 'react';
import { pick } from '../lib/i18n.js';
import Desplegable from './Desplegable.jsx';

const STORAGE_KEY = 'dtrainer_pomodoro_v1';
const MIN_MINUTES = 5;
const MAX_MINUTES = 90;
const STEP_MINUTES = 5;
const BREAK_MINUTES = 5;

function leerPomodoro() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    const duration = Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, Number(saved.duration) || 25));
    const running = !!saved.running && Number.isFinite(saved.endAt);
    const phase = saved.phase === 'break' ? 'break' : 'study';
    const remaining = running
      ? Math.max(0, Math.ceil((saved.endAt - Date.now()) / 1000))
      : Math.max(0, Number(saved.remaining) || duration * 60);
    return { duration, phase, remaining, running, endAt: running ? saved.endAt : null };
  } catch {
    return { duration: 25, phase: 'study', remaining: 25 * 60, running: false, endAt: null };
  }
}

function formato(segundos) {
  const min = Math.floor(segundos / 60);
  const seg = String(segundos % 60).padStart(2, '0');
  return String(min).padStart(2, '0') + ':' + seg;
}

export default function Pomodoro() {
  const [timer, setTimer] = useState(leerPomodoro);
  const [completado, setCompletado] = useState(false);
  const [autoPausado, setAutoPausado] = useState(false);
  const audioContext = useRef(null);
  const finalSonado = useRef(null);
  const timerActual = useRef(timer);
  timerActual.current = timer;

  function obtenerAudioContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return null;
    if (!audioContext.current || audioContext.current.state === 'closed') {
      audioContext.current = new AudioContextClass();
    }
    return audioContext.current;
  }

  function prepararCampana() {
    try {
      const contexto = obtenerAudioContext();
      if (contexto?.state === 'suspended') contexto.resume().catch(() => {});
    } catch { /* sonido no disponible en este navegador */ }
  }

  function tocarCampana() {
    try {
      const contexto = obtenerAudioContext();
      if (!contexto) return;
      const sonar = () => {
        const ahora = contexto.currentTime;
        [[880, 0.2], [1320, 0.12], [1760, 0.065], [2640, 0.028]].forEach(([hz, volumen]) => {
          const oscilador = contexto.createOscillator();
          const ganancia = contexto.createGain();
          oscilador.type = 'sine';
          oscilador.frequency.setValueAtTime(hz, ahora);
          ganancia.gain.setValueAtTime(0.0001, ahora);
          ganancia.gain.exponentialRampToValueAtTime(volumen, ahora + 0.018);
          ganancia.gain.exponentialRampToValueAtTime(0.0001, ahora + 1.55);
          oscilador.connect(ganancia);
          ganancia.connect(contexto.destination);
          oscilador.onended = () => { oscilador.disconnect(); ganancia.disconnect(); };
          oscilador.start(ahora);
          oscilador.stop(ahora + 1.6);
        });
      };
      if (contexto.state === 'suspended') contexto.resume().then(sonar).catch(() => {});
      else sonar();
    } catch { /* el Pomodoro sigue funcionando aunque el audio falle */ }
  }

  useEffect(() => () => {
    audioContext.current?.close?.().catch(() => {});
  }, []);

  useEffect(() => {
    if (!completado) return undefined;
    const id = window.setTimeout(() => setCompletado(false), 5000);
    return () => window.clearTimeout(id);
  }, [completado]);

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(timer)); } catch { /* almacenamiento no disponible */ }
  }, [timer]);

  useEffect(() => {
    if (!timer.running || !timer.endAt) return undefined;
    const tick = () => {
      const restante = Math.max(0, Math.ceil((timer.endAt - Date.now()) / 1000));
      if (restante === 0) {
        if (finalSonado.current !== timer.endAt) {
          finalSonado.current = timer.endAt;
          setTimer((actual) => {
            const phase = actual.phase === 'break' ? 'study' : 'break';
            const remaining = (phase === 'break' ? BREAK_MINUTES : actual.duration) * 60;
            return { ...actual, phase, remaining, running: true, endAt: Date.now() + remaining * 1000 };
          });
          setCompletado(true);
          setAutoPausado(false);
          tocarCampana();
        }
      } else {
        setTimer((actual) => actual.remaining === restante ? actual : { ...actual, remaining: restante });
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [timer.running, timer.endAt]);

  useEffect(() => {
    function pausarAlCambiarDeVentana() {
      if (document.visibilityState !== 'hidden' && document.hasFocus()) return;
      const actual = timerActual.current;
      if (!actual.running || actual.phase !== 'study' || !actual.endAt) return;

      const ahora = Date.now();
      const remaining = Math.max(0, Math.ceil((actual.endAt - ahora) / 1000));
      // Si el plazo ya venció, deja que el tick cambie al descanso.
      if (remaining === 0) return;

      setTimer((actualizado) => {
        if (!actualizado.running || actualizado.phase !== 'study') return actualizado;
        const restante = Math.max(0, Math.ceil((actualizado.endAt - ahora) / 1000));
        if (restante === 0) return actualizado;
        return { ...actualizado, remaining: restante, running: false, endAt: null };
      });
      setCompletado(false);
      setAutoPausado(true);
    }

    window.addEventListener('blur', pausarAlCambiarDeVentana);
    document.addEventListener('visibilitychange', pausarAlCambiarDeVentana);
    return () => {
      window.removeEventListener('blur', pausarAlCambiarDeVentana);
      document.removeEventListener('visibilitychange', pausarAlCambiarDeVentana);
    };
  }, []);

  function iniciarPausar() {
    prepararCampana();
    if (!timer.running) finalSonado.current = null;
    setCompletado(false);
    setAutoPausado(false);
    setTimer((actual) => {
      if (actual.running) {
        const remaining = Math.max(0, Math.ceil((actual.endAt - Date.now()) / 1000));
        return { ...actual, remaining, running: false, endAt: null };
      }
      const remaining = actual.remaining > 0 ? actual.remaining : (actual.phase === 'break' ? BREAK_MINUTES : actual.duration) * 60;
      return { ...actual, remaining, running: true, endAt: Date.now() + remaining * 1000 };
    });
  }

  function ajustar(cambio) {
    setTimer((actual) => {
      if (actual.running) return actual;
      const duration = Math.max(MIN_MINUTES, Math.min(MAX_MINUTES, actual.duration + cambio));
      const remaining = actual.phase === 'study' ? duration * 60 : actual.remaining;
      return { ...actual, duration, remaining, running: false, endAt: null };
    });
    setCompletado(false);
    setAutoPausado(false);
  }

  function reiniciar() {
    setTimer((actual) => ({ ...actual, phase: 'study', remaining: actual.duration * 60, running: false, endAt: null }));
    setCompletado(false);
    setAutoPausado(false);
  }

  const duracionFase = (timer.phase === 'break' ? BREAK_MINUTES : timer.duration) * 60;
  const progreso = duracionFase
    ? Math.max(0, Math.min(100, timer.remaining / duracionFase * 100))
    : 0;

  return (
    <section className={'pomodoro' + (timer.running ? ' pomodoro-running' : '')} aria-label={pick('Temporizador Pomodoro', 'Pomodoro timer')}>
      <div className="pomodoro-head">
        <span className="pomodoro-title">{timer.phase === 'break' ? pick('Descanso', 'Break') : pick('Estudio', 'Study')}</span>
        <span className="pomodoro-time" aria-live="off">{formato(timer.remaining)}</span>
      </div>
      <div className="pomodoro-track" aria-hidden="true">
        <span style={{ width: progreso + '%' }} />
      </div>
      <div className="pomodoro-controls">
        <div className="pomodoro-duration">
          <button type="button" onClick={() => ajustar(-STEP_MINUTES)} disabled={timer.running || timer.phase === 'break' || timer.duration <= MIN_MINUTES} aria-label={pick('Restar cinco minutos', 'Subtract five minutes')}>−</button>
          <span>{timer.phase === 'break' ? BREAK_MINUTES : timer.duration} {pick('min', 'min')}</span>
          <button type="button" onClick={() => ajustar(STEP_MINUTES)} disabled={timer.running || timer.phase === 'break' || timer.duration >= MAX_MINUTES} aria-label={pick('Añadir cinco minutos', 'Add five minutes')}>+</button>
        </div>
        <div className="pomodoro-actions">
          <button type="button" className="pomodoro-toggle" onClick={iniciarPausar} aria-label={timer.running ? pick('Pausar', 'Pause') : pick('Empezar', 'Start')} title={timer.running ? pick('Pausar', 'Pause') : pick('Empezar', 'Start')}>
            <svg width="15" height="15" viewBox="0 0 24 24" aria-hidden="true">
              {timer.running
                ? <><rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" /><rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" /></>
                : <path d="M8 5.5v13l10-6.5-10-6.5Z" fill="currentColor" />}
            </svg>
          </button>
          <button type="button" className="pomodoro-reset" onClick={reiniciar} aria-label={pick('Reiniciar temporizador', 'Reset timer')} title={pick('Reiniciar', 'Reset')}>
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 16a9 9 0 1 0 1.64-11.36L3 8" />
              <path d="M3 3v5h5" />
            </svg>
          </button>
        </div>
      </div>
      <Desplegable abierto={autoPausado || completado} className="pomodoro-notice">
        {(autoPausado || completado) && (
          <div className={'pomodoro-done' + (!autoPausado && timer.phase !== 'break' ? ' pomodoro-done-break' : '')} role="status">
            {autoPausado
              ? pick('Pausado al cambiar de ventana', 'Paused when you switched windows')
              : timer.phase === 'break'
                ? <>
                    {pick('Estudio terminado', 'Study finished')}
                    <br />
                    {pick('Descanso de 5 min', 'Break for 5 min')}
                  </>
                : <>
                    {pick('Descanso terminado', 'Break finished')}
                    <br />
                    {pick('Nueva sesión iniciada', 'New session started')}
                  </>}
          </div>
        )}
      </Desplegable>
    </section>
  );
}
