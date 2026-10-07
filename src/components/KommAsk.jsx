import React, { useEffect, useRef, useState } from 'react';
import { SIN_IA } from '../lib/modo.js';
import { guardados, borrarGuardado, otroIdioma } from '../lib/guardados.js';
import Dialog from './Dialog.jsx';
import Cargando from './Cargando.jsx';
import Sugerencias from './Sugerencias.jsx';
import LargoDialogo from './LargoDialogo.jsx';
import { turnosDe, largoGuardado } from '../lib/largoDialogo.js';
import { generateDialog } from '../lib/ai.js';
import { aiAvailable } from '../lib/settings.js';
import { t, pick } from '../lib/i18n.js';
import { runJob, clearJob } from '../lib/aiJobs.js';
import { useAiJob } from '../lib/useAiJob.js';
import Desplegable from './Desplegable.jsx';

const JOB = 'komm:ask';

// Larga a proposito: se enseña un puñado distinto cada vez.
const SUG_ES = [
  'En el médico',
  'Alquilar un piso en Viena',
  'Una entrevista de trabajo',
  'Devolver algo en una tienda',
  'Quedar con un amigo el finde',
  'Discutir con el vecino por el ruido',
  'Abrir una cuenta en el banco',
  'Small talk en la pausa del café',
  'Pedir la cuenta y que esté mal',
  'En la peluquería',
  'Preguntar cómo llegar a un sitio',
  'Comprar un abono de transporte',
  'Llamar para anular una cita',
  'Reclamar un paquete que no llegó',
  'Presentarte el primer día de trabajo',
  'Quejarte de que hace frío en la oficina',
  'Elegir regalo con un compañero',
  'En la farmacia, sin receta',
  'Apuntarte a un gimnasio',
  'Explicarle a un vecino cómo separar la basura'
];
const SUG_EN = [
  'At the doctor',
  'Renting a flat in Vienna',
  'A job interview',
  'Returning something in a shop',
  'Making plans with a friend',
  'Arguing with a neighbour about noise',
  'Opening a bank account',
  'Small talk on the coffee break',
  'Asking for the bill and it is wrong',
  'At the hairdresser',
  'Asking how to get somewhere',
  'Buying a transport pass',
  'Calling to cancel an appointment',
  'Chasing a parcel that never arrived',
  'Introducing yourself on your first day at work',
  'Complaining that the office is freezing',
  'Choosing a present with a colleague',
  'At the pharmacy, with no prescription',
  'Joining a gym',
  'Explaining to a neighbour how to sort the rubbish'
];

export default function KommAsk({ niveau = 'A2' }) {
  // Compilada sin IA: esto no se pinta. Es un generador entero, no una
  // funcion que se pueda quedar a medias, y en gris solo ensenaba un boton
  // muerto y un aviso mandandote a activar la IA donde ya no hay nada.
  if (SIN_IA) return null;
  // La conversacion vive en aiJobs: cambiar de seccion ya no la borra ni corta
  // la generacion a medias.
  const job = useAiJob(JOB);
  const busy = job.status === 'running';
  const dialog = job.status === 'done' ? job.result : null;
  const err = job.status === 'error' ? job.error : '';
  const lastThema = job.meta?.thema || '';
  const [q, setQ] = useState(() => job.meta?.thema || '');
  const aiOn = aiAvailable();
  const SUGERENCIAS = pick(SUG_ES, SUG_EN);
  const box = useRef(null);
  // Todas las guardadas, con leccion o sin ella. Las libres -las que se piden
  // aqui- no tienen leccion, asi que la lista de dentro de una Lektion no las
  // enseñaba nunca: las guardabas y no volvias a verlas.
  const [misKonv, setMisKonv] = useState(() => guardados('konversation'));
  const [verKonv, setVerKonv] = useState(false);
  // La guardada que estas mirando, si has abierto una de la lista.
  const [abierta, setAbierta] = useState(null);
  // Se pone a true al pulsar tu, y es lo unico que autoriza el scroll.
  const pidiendo = useRef(false);

  // El scroll SOLO cuando acabas de pedir tú un diálogo: si no, se queda
  // debajo de la rejilla de lecciones y parece que no pasa nada.
  //
  // Antes se intentaba con un ref que se saltaba la PRIMERA pasada del efecto,
  // y eso no aguanta: estamos dentro de <React.StrictMode> (main.jsx) y en
  // desarrollo React monta, ejecuta el efecto, lo limpia y lo vuelve a
  // ejecutar. La primera pasada gastaba la guarda y la segunda ya entraba, así
  // que abrir Kommunikation te bajaba solo a una conversación de otro día.
  //
  // Este ref no tiene ese problema porque no lo pone el montaje: solo lo pone
  // ask(), o sea tú al pedir. Es la misma solución que GrammarAsk.
  useEffect(() => {
    if (!pidiendo.current) return;
    if (dialog || busy) box.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (dialog) pidiendo.current = false;
  }, [dialog, busy]);

  function ask(text) {
    const thema = (text ?? q).trim();
    if (!thema) return;
    setQ(thema);
    pidiendo.current = true;
    runJob(JOB, () => generateDialog({ thema, niveau, turns: turnosDe(largoGuardado()) }), { thema });
  }

  if (abierta) {
    return (
      <div style={{ marginTop: 34, scrollMarginTop: 16 }} ref={box}>
        <Dialog
          dialog={abierta.dialog}
          lektion={null}
          busy={false}
          otroIdioma={otroIdioma(abierta)}
          onBack={() => setAbierta(null)}
          onRegenerate={() => { setAbierta(null); ask(abierta.titel); }}
          onGuardado={() => setMisKonv(guardados('konversation'))}
        />
      </div>
    );
  }

  if (dialog) {
    return (
      <div style={{ marginTop: 34, scrollMarginTop: 16 }} ref={box}>
        <Dialog
          dialog={dialog}
          lektion={null}
          busy={busy}
          onBack={() => clearJob(JOB)}
          onRegenerate={() => ask(lastThema)}
          onGuardado={() => setMisKonv(guardados('konversation'))}
        />
      </div>
    );
  }

  // La espera, con el mismo indicador que la explicacion de gramatica: pasos,
  // reloj y aviso de que puedes irte a otra seccion. Un minuto mirando un
  // boton que pone "Escribiendo…" no dice si sigue viva.
  if (busy) {
    return (
      <div className="ask" ref={box} style={{ scrollMarginTop: 16 }}>
        <div className="sec-title">
          <h2>{t('komm.askTitle')}</h2>
          <span className="muted">{t('komm.askSub')}</span>
        </div>
        <Cargando
          icono="💬"
          titulo={t('wait.dlgTitle')}
          pasos={[t('wait.dlg1'), t('wait.dlg2'), t('wait.dlg3'), t('wait.dlg4')]}
        />
      </div>
    );
  }

  return (
    <div className="ask" ref={box} style={{ scrollMarginTop: 16 }}>
      <div className="sec-title">
        <h2>{t('komm.askTitle')}</h2>
        <span className="muted">{t('komm.askSub')}</span>
      </div>

      <div className="card ask-box">
        <div className="ask-row">
          <input
            className="ask-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !busy && ask()}
            placeholder={t('komm.askPh')}
            disabled={!aiOn}
          />
          <button className="btn-primary" onClick={() => ask()} disabled={!aiOn || busy || !q.trim()}>
            {busy ? t('komm.writing') : t('komm.askGo')}
          </button>
        </div>

        <div className="ask-pies">
          <LargoDialogo disabled={busy} />

          {!busy && (
            <Sugerencias opciones={SUGERENCIAS} onElegir={ask} disabled={!aiOn} />
          )}

          {misKonv.length > 0 && (
            <button className="link-btn pie-abrir" onClick={() => setVerKonv(!verKonv)} aria-expanded={verKonv}>
              {verKonv ? t('save.hideConv') : t('save.showConv', { n: misKonv.length })}
            </button>
          )}

          <Desplegable abierto={verKonv && misKonv.length > 0} className="desplegable-guardados">
            <div className="guardados-lista">
              {misKonv.map((k) => (
                <span className="guardado-chip" key={k.id}>
                  <button className="gc-abrir" onClick={() => setAbierta(k)} title={k.titel}>
                    {k.lektionNr ? 'L' + k.lektionNr + ' · ' : ''}{k.titel}
                  </button>
                  <button
                    className="gc-quitar"
                    title={t('save.remove')}
                    onClick={() => {
                      borrarGuardado('konversation', k.id);
                      setMisKonv(guardados('konversation'));
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}
            </div>
          </Desplegable>
        </div>

        {!aiOn && (
          <p className="muted" style={{ fontSize: '0.83rem', marginTop: 10 }}>
            {t('komm.offConv')}
          </p>
        )}
        {err && <p style={{ color: 'var(--bad)', fontSize: '0.85rem', marginTop: 10 }}>{err}</p>}
      </div>

      {busy && (
        <div className="card center" style={{ marginTop: 14 }}>
          <p className="muted">{t('komm.askWriting')}</p>
        </div>
      )}
    </div>
  );
}
