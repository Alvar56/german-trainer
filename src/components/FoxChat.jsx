import React, { useEffect, useRef, useState } from 'react';
import FoxFace from './FoxFace.jsx';
import FoxAjustes from './FoxAjustes.jsx';
import { foxChat } from '../lib/ai.js';
import { aiAvailable } from '../lib/settings.js';
import { getFuchs, nombreEspecie, tuAnimal } from '../lib/fuchs.js';
import { storage } from '../lib/storage.js';
import { ganar, MONEDAS_FELIX } from '../lib/monedas.js';
import { t, pick } from '../lib/i18n.js';

const KEY = 'fuchs:chat';
const MAX = 40; // mensajes guardados; más no aporta y ocupa

function cargar() {
  const v = storage.get(KEY, []);
  return Array.isArray(v) ? v : [];
}

// Voz alemana del sistema. Puede no haber ninguna instalada: en ese caso lo
// decimos en vez de reproducir cualquier voz, que suena a broma.
function vozAlemana() {
  const voces = window.speechSynthesis?.getVoices?.() || [];
  return voces.find((v) => /^de/i.test(v.lang)) || null;
}

export default function FoxChat({ abrirCon = null, onClose }) {
  const [fuchs, setFuchsState] = useState(getFuchs);
  const [msgs, setMsgs] = useState(cargar);
  const [texto, setTexto] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  const [fallido, setFallido] = useState('');
  // En reposo, los dos ojos abiertos e iguales. El 'pensando' se queda solo
  // para mientras escribe: parado se veia un ojo entero y el otro a medias.
  const [gesto, setGesto] = useState('normal');
  // Mensajes seguidos escritos BIEN. Es lo que enciende las chispas del zorro,
  // igual que la racha de aciertos las enciende en los ejercicios. Aqui basta
  // con uno: escribir tres palabras en aleman sin un solo fallo cuesta mucho
  // mas que acertar un test, asi que no se hace esperar a dos.
  const [bien, setBien] = useState(0);
  const [ajustes, setAjustes] = useState(false);
  const [hayVoz, setHayVoz] = useState(true);
  const finRef = useRef(null);
  const inputRef = useRef(null);
  const aiOn = aiAvailable();

  // Las voces del navegador llegan tarde; hay que esperar al evento.
  // En Chromium/Edge speechSynthesis no es EventTarget, hay que usar
  // la propiedad onvoiceschanged directamente.
  useEffect(() => {
    const synth = window.speechSynthesis;
    if (!synth) return;
    const mirar = () => setHayVoz(!!vozAlemana());
    mirar();
    synth.onvoiceschanged = mirar;
    return () => { synth.onvoiceschanged = null; };
  }, []);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [msgs, busy]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Lo que se envia en cuanto la pregunta del zorro esta ya en la lista: asi
  // el historial que le mandamos tiene sentido.
  const [pendiente, setPendiente] = useState('');

  // Al abrirse desde Inicio: la pregunta del zorro encabeza la charla y, si ya
  // habias empezado a contestarle alli, esa respuesta sale disparada sola.
  const sembrado = useRef(false);
  useEffect(() => {
    if (!abrirCon?.pregunta || sembrado.current) return;
    sembrado.current = true;
    const q = abrirCon.pregunta;
    // Solo saluda si le toca hablar a el: si su ultimo mensaje sigue sin
    // contestar, no vuelve a preguntar. Antes se apilaban cinco preguntas
    // seguidas sin que hubieras dicho nada.
    const m = msgsRef.current;
    const leToca = !m.length || m[m.length - 1].de === 'yo';
    if (leToca) guardar([...m, { de: 'fox', texto: q.de, es: q.es, stimmung: 'pensando' }]);
    if (abrirCon.respuesta) setPendiente(abrirCon.respuesta);
  }, [abrirCon]);

  // Los mensajes tambien en una ref: el envio diferido se dispara desde un
  // efecto y leeria una lista vieja.
  const msgsRef = useRef(msgs);
  useEffect(() => {
    msgsRef.current = msgs;
  }, [msgs]);

  function guardar(next) {
    setMsgs(next);
    msgsRef.current = next;
    storage.set(KEY, next.slice(-MAX));
  }

  function hablar(txt) {
    const v = vozAlemana();
    if (!v || !txt) return;
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(txt);
    u.voice = v;
    u.lang = v.lang;
    u.rate = 0.92;
    window.speechSynthesis.speak(u);
  }

  function enviar(e) {
    e?.preventDefault?.();
    const mio = texto.trim();
    if (!mio || busy) return;
    setTexto('');
    enviarTexto(mio);
  }

  async function enviarTexto(mio) {
    if (!mio || busy) return;
    setErr('');
    const conMio = [...msgsRef.current, { de: 'yo', texto: mio }];
    guardar(conMio);
    setBusy(true);
    setGesto('pensando');
    try {
      const r = await foxChat({
        historial: conMio,
        mensaje: mio,
        nombre: fuchs.nombre,
        // Si se ha comprado un gato, la IA no puede decir que es un zorro.
        especie: nombreEspecie(fuchs)
      });
      // Se paga escribirle EN ALEMÁN y sin fallos. Hacen falta las dos cosas:
      // "korrektur" también viene vacía cuando escribes en español (entonces
      // Felix traduce en vez de corregir), así que mirar solo eso pagaba por
      // escribir en español. De ahí "aufDeutsch". Y tres palabras mínimo, para
      // que un "ja" suelto no cuente como respuesta.
      const enAleman = r.aufDeutsch === true;
      const bastante = mio.split(/\s+/).filter(Boolean).length >= 3;
      // El mismo "lo has hecho bien" que paga monedas enciende las chispas.
      const clavado = enAleman && !r.korrektur && bastante;
      if (clavado) ganar(MONEDAS_FELIX);
      setBien((n) => (clavado ? n + 1 : 0));
      guardar([
        ...conMio,
        {
          de: 'fox',
          texto: r.antwort,
          es: r.antwortEs,
          stimmung: r.stimmung,
          korrektur: r.korrektur,
          uebung: r.uebung,
          woerter: r.woerter
        }
      ]);
      setGesto(r.stimmung);
    } catch (e2) {
      // Se guarda QUÉ se estaba enviando: si el fallo fue de red (el servidor
      // local se cae al suspenderse el equipo), reintentar no deberia obligar a
      // reescribir el mensaje.
      setErr(e2.message);
      setFallido(mio);
      setGesto('triste');
    } finally {
      setBusy(false);
    }
  }

  function reintentar() {
    const mio = fallido;
    if (!mio) return;
    setFallido('');
    // el mensaje ya está en la conversación: se quita antes de reenviarlo para
    // no acabar con el mismo texto dos veces
    const sinElUltimo = msgsRef.current.filter(
      (m, i) => !(i === msgsRef.current.length - 1 && m.de === 'yo' && m.texto === mio)
    );
    guardar(sinElUltimo);
    enviarTexto(mio);
  }

  useEffect(() => {
    if (!pendiente || busy) return;
    const txt = pendiente;
    setPendiente('');
    enviarTexto(txt);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pendiente]);

  function limpiar() {
    if (!window.confirm(t('fox.clearAsk'))) return;
    storage.set(KEY, []);
    setMsgs([]);
    setGesto('normal');
    setBien(0);
  }

  const sugerencias = pick(
    ['Wie geht es dir?', 'Erzähl mir etwas über Wien', 'Gib mir eine Übung', '¿Cómo se dice "me da igual"?'],
    ['Wie geht es dir?', 'Erzähl mir etwas über Wien', 'Gib mir eine Übung', 'How do you say "I do not care"?']
  );

  return (
    <div className="fox-chat">
      <div className="fox-chat-head">
        <button 
          className={'fox-avatar fox-aura-wrap fox-aura-' + (fuchs.fondo || 'nadaFondo') + (busy ? ' pensando' : '')} 
          onClick={() => setAjustes(true)}
          style={{ cursor: 'pointer', border: 'none', background: 'transparent', padding: 0 }}
          title={t('fox.customiseName', { nombre: fuchs.nombre })}
        >
          {/* Aquí solo la cara: es una conversación, se le mira a los ojos. */}
          <FoxFace
            fuchs={fuchs}
            gesto={busy ? 'pensando' : gesto}
            size={78}
          />
        </button>
        <div className="fox-chat-quien">
          <h2 style={{ margin: 0 }}>{fuchs.nombre}</h2>
          <p className="muted" style={{ fontSize: '0.8rem', margin: '2px 0 0' }}>
            {busy ? t('fox.thinking') : t('fox.sub')}
          </p>
        </div>
        <button className="btn-ghost btn-sm" onClick={() => setAjustes(true)}>
          {/* El animal que tengas puesto, con su artículo: decía "Dein Fuchs"
              fijo y hay diez animales, así que en nueve mentía. */}
          {tuAnimal(fuchs)}
        </button>
        {onClose && (
          <button className="lied-cerrar" onClick={onClose} title={t('back')}>
            ✕
          </button>
        )}
      </div>

      {!aiOn && <div className="card" style={{ marginBottom: 12 }}>{t('aiOffLong')}</div>}
      {!hayVoz && (
        <p className="muted fox-sinvoz">{t('fox.noVoice')}</p>
      )}

      <div className="fox-mensajes">
        {msgs.length === 0 && !busy && (
          <p className="muted fox-vacio">{t('fox.empty', { nombre: fuchs.nombre })}</p>
        )}

        {msgs.map((m, i) =>
          m.de === 'yo' ? (
            <div className="fox-msg mio" key={i}>
              {m.texto}
            </div>
          ) : (
            <div className="fox-msg suyo" key={i}>
              <div className="fm-de">
                <span>{m.texto}</span>
                {hayVoz && (
                  <button className="fm-voz" onClick={() => hablar(m.texto)} title={t('fox.listen')}>
                    🔊
                  </button>
                )}
              </div>
              {m.es && <div className="fm-es">{m.es}</div>}

              {m.korrektur && (
                <div className="fm-correccion">
                  <div className="fmc-linea">
                    <span className="falsch">{m.korrektur.original}</span>
                    <span className="pfeil">→</span>
                    <span className="richtig">{m.korrektur.richtig}</span>
                  </div>
                  {m.korrektur.warum && <p className="fmc-warum">{m.korrektur.warum}</p>}
                </div>
              )}

              {m.uebung && (
                <div className="fm-uebung">
                  <div className="lk-block-title">✏️ {t('fox.exercise')}</div>
                  <p className="news-de" style={{ marginTop: 4 }}>{m.uebung.frage}</p>
                  {m.uebung.tipp && <p className="muted" style={{ fontSize: '0.78rem' }}>💡 {m.uebung.tipp}</p>}
                  <details className="fm-solucion">
                    <summary>{t('fox.solution')}</summary>
                    <span>{m.uebung.loesung}</span>
                  </details>
                </div>
              )}

              {m.woerter?.length > 0 && (
                <div className="nb-chips" style={{ marginTop: 8 }}>
                  {m.woerter.map((w, j) => (
                    <span className="nb-chip voc" key={j}><strong>{w.de}</strong> — {w.es}</span>
                  ))}
                </div>
              )}
            </div>
          )
        )}

        {busy && <div className="fox-msg suyo escribiendo"><span /><span /><span /></div>}
        <div ref={finRef} />
      </div>

      {err && (
        <p style={{ color: 'var(--bad)', fontSize: '0.85rem' }}>
          {err}
          {fallido && (
            <button className="link-btn" style={{ padding: '0 0 0 8px' }} onClick={reintentar}>
              {t('retry')}
            </button>
          )}
        </p>
      )}

      {msgs.length === 0 && (
        <div className="ask-sug" style={{ marginBottom: 10 }}>
          {sugerencias.map((s) => (
            <button key={s} className="ask-chip" disabled={!aiOn} onClick={() => { setTexto(s); inputRef.current?.focus(); }}>
              {s}
            </button>
          ))}
        </div>
      )}

      <form className="fox-barra" onSubmit={enviar}>
        <input
          ref={inputRef}
          className="ask-input"
          lang="de"
          spellCheck={false}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          placeholder={t('fox.ph', { nombre: fuchs.nombre })}
          disabled={!aiOn || busy}
        />
        <button className="btn-primary" type="submit" disabled={!aiOn || busy || !texto.trim()}>
          {t('fox.send')}
        </button>
      </form>
      {msgs.length > 0 && (
        <button className="link-btn fox-limpiar" onClick={limpiar}>{t('fox.clear')}</button>
      )}

      {ajustes && (
        <FoxAjustes
          onClose={() => setAjustes(false)}
          onChange={(f) => setFuchsState(f)}
        />
      )}
    </div>
  );
}
