import React, { useEffect, useRef, useState } from 'react';
import { t } from '../lib/i18n.js';
import { teiles, fallen, examStats, allResults, veredicto, BESTANDEN } from '../lib/pruefung.js';
import { aiAvailable } from '../lib/settings.js';
import { runningJobs } from '../lib/aiJobs.js';
import Desplegable from './Desplegable.jsx';

// Sitios externos, por parte del examen. Enlaces comprobados uno a uno; los
// que daban 404 se descartaron en vez de dejarlos "por si acaso".
//
// Van a la página de material de cada organismo, no al PDF suelto: los enlaces
// directos a un Modellsatz concreto caducan cada pocos meses, la página que los
// lista no.
const ENLACES = {
  // Para el oído: exámenes oficiales completos, con sus MP3 y las soluciones.
  hoeren: [
    {
      url: 'https://www.goethe.de/de/spr/prf/ueb.html',
      nombre: 'Goethe · Prüfungstrainings',
      que: 'Modelos completos del Goethe-Zertifikat A2: cuadernillo, audios del Hören, transcripciones y soluciones.',
      nivel: 'examen'
    },
    {
      url: 'https://www.osd.at/en/exams/practice-material/',
      nombre: 'ÖSD · Übungsmaterialien',
      que: 'Modellsätze en PDF con los MP3 del módulo auditivo. Es el examen que se hace en Austria.',
      nivel: 'examen'
    },
    {
      url: 'https://www.telc.net/es/',
      nombre: 'telc · Übungstests',
      que: 'Pruebas de práctica gratuitas de telc Deutsch A2 en PDF, con audios y claves de corrección.',
      nivel: 'examen'
    },
    {
      url: 'https://sprachportal.at/',
      nombre: 'ÖIF · Sprachportal',
      que: 'Modelos del ÖIF-Test A2 y de la Integrationsprüfung, con cuadernillo, audios y soluciones.',
      nivel: 'examen'
    },
    {
      url: 'https://learngerman.dw.com/de/nachrichten/s-63687',
      nombre: 'DW · Nachrichten langsam gesprochen',
      que: 'Noticias del día leídas despacio, con la transcripción debajo. Para entrenar el oído a diario.',
      nivel: 'A2–B1'
    },
    {
      url: 'https://www.nachrichtenleicht.de/',
      nombre: 'Nachrichtenleicht',
      que: 'Noticias en alemán fácil, con audio y el texto al lado.',
      nivel: 'A2'
    }
  ],
  // Para hablar: alemán real, de gente hablando, para imitar y coger soltura.
  sprechen: [
    {
      url: 'https://www.easygerman.org/',
      nombre: 'Easy German',
      que: 'Entrevistas por la calle con subtítulos en alemán: así se habla de verdad, con muletillas y todo.',
      nivel: 'B1'
    },
    {
      url: 'https://slowgerman.com/',
      nombre: 'Slow German',
      que: 'Pódcast hablado despacio y muy claro, con transcripción para leer en paralelo.',
      nivel: 'A2–B1'
    },
    {
      url: 'https://oe1.orf.at/',
      nombre: 'ORF Ö1',
      que: 'Radio austriaca a velocidad real. Difícil, pero es el acento que oyes en Viena.',
      nivel: 'B1+'
    },
    {
      url: 'https://learngerman.dw.com/de/overview',
      nombre: 'DW · Deutsch lernen',
      que: 'Cursos por nivel con diálogos grabados que puedes repetir en voz alta.',
      nivel: 'A1–B1'
    }
  ]
};

// Tareas que ya te hemos devuelto solas: si vuelves a entrar aquí después de
// salir tú de una, no se te vuelve a meter dentro. Si no, con el botón de
// volver quedarías atrapado en bucle.
const yaLlevado = new Set();

export default function Pruefung({ onStart }) {
  const st = examStats();
  const ultimos = allResults().slice(0, 6);
  const aiOn = aiAvailable();
  const [abierto, setAbierto] = useState(null);
  const [tips, setTips] = useState(false);
  const mirado = useRef(false);

  // Si dejaste una tarea generándose y te fuiste, al volver a Prüfung se entra
  // sola: tarda un par de minutos y no tiene sentido hacerte recordar en qué
  // parte y en qué Teil estabas.
  useEffect(() => {
    if (mirado.current) return;
    mirado.current = true;
    const enMarcha = runningJobs().find((k) => k.startsWith('examen:') && !yaLlevado.has(k));
    if (!enMarcha) return;
    const [, teil, typ] = enMarcha.split(':');
    if (!teil || !typ) return;
    yaLlevado.add(enMarcha);
    onStart(teil, typ);
  }, []);

  return (
    <div className="wide">
      <div className="page-head">
        <h1>Prüfung</h1>
        <p>
          {t('pf.sub')}
        </p>
      </div>

      <div className="statcards statcards-teile tira-resumen">
        {teiles().map((teil) => {
          const s = st.porTeil[teil.id];
          return (
            <div className="card statcard" key={teil.id}>
              {/* Sin el icono de la parte: al lado del porcentaje competia
                  con el, que es el dato que vienes a mirar. El icono sigue
                  abajo, en la ficha de cada parte.

                  Aprobado o no va en el COLOR del numero. Antes lo decia una
                  barrita debajo, pero al pasar las cuatro fichas a una sola
                  fila se quedaba sin sitio y se encogia hasta 0 px: estaba,
                  y no se veia. */}
              <div className={'n' + (s.pct == null ? '' : s.pct >= BESTANDEN ? ' aprobado' : ' suspenso')}>
                {s.pct == null ? '—' : s.pct + '%'}
              </div>
              <div className="l">{teil.name}</div>
              <div className="sub">
                {s.n === 0
                  ? t('pf.notDone')
                  : s.n === 1
                  ? t('pf.oneAttempt', { p: s.ultimo })
                  : t('pf.attempts', { n: s.n, p: s.ultimo })}
              </div>
            </div>
          );
        })}
      </div>

      {!aiOn && (
        <div className="card" style={{ marginBottom: 16 }}>
          {t('pf.offHint')}
        </div>
      )}

      <div className="stack" style={{ gap: 12 }}>
        {teiles().map((teil) => (
          <div className={'card' + (abierto === teil.id ? ' abierta' : '')} key={teil.id}>
            <button
              className="komm-head"
              onClick={() => setAbierto(abierto === teil.id ? null : teil.id)}
            >
              <span>
                <span className="lk-block-title" style={{ margin: 0 }}>
                  {teil.ico} {teil.name} — {teil.es}
                </span>
                <span className="muted pruef-blurb">{teil.blurb}</span>
              </span>
              <span className="komm-cuenta">
                ~{teil.min} min {abierto === teil.id ? '▴' : '▾'}
              </span>
            </button>

            {/* En el Hören, además de los simulacros: dónde escuchar alemán de
                verdad. La IA genera el examen, pero practicar oído necesita
                audio real y a diario. */}
            <Desplegable abierto={abierto === teil.id}>
              {ENLACES[teil.id] && (
                <div className="audios">
                  <div className="lk-block-title" style={{ marginTop: 14 }}>
                    {teil.id === 'hoeren' ? '🎧 ' : '🗣 '}
                    {t(teil.id === 'hoeren' ? 'pf.realAudio' : 'pf.realSpeech')}
                  </div>
                  <p className="muted" style={{ fontSize: '0.82rem', margin: '0 0 10px' }}>
                    {t(teil.id === 'hoeren' ? 'pf.realAudioSub' : 'pf.realSpeechSub')}
                  </p>
                  {ENLACES[teil.id].map((a2) => (
                    <a
                      className="audio-fila"
                      key={a2.url}
                      href={a2.url}
                      target="_blank"
                      rel="noopener noreferrer"
                  >
                      <div>
                        <div className="af-nombre">{a2.nombre}</div>
                        <div className="af-que muted">{a2.que}</div>
                      </div>
                      <span className="pill">{a2.nivel}</span>
                    </a>
                  ))}
                </div>
              )}

              <div className="pruef-typen">
                {teil.typen.map((ty) => (
                  <button
                    key={ty.id}
                    className="pruef-typ"
                    onClick={() => onStart(teil.id, ty.id)}
                    disabled={!aiOn}
                  >
                    <span className="pt-name">{ty.name}</span>
                    <span className="pt-es">{ty.es}</span>
                  </button>
                ))}
              </div>
            </Desplegable>
          </div>
        ))}
      </div>

      <div className="card lk-all" style={{ marginTop: 26 }}>
        <div>
          <strong>{t('pf.trapsTitle')}</strong>
          <p className="muted" style={{ fontSize: '0.84rem', marginTop: 3 }}>
            {t('pf.trapsSub')}
          </p>
        </div>
        <button className="btn-primary" onClick={() => setTips(!tips)}>
          {tips ? t('pf.hideTraps') : t('pf.showTraps')}
        </button>
      </div>

      {tips && (
        <div className="stack" style={{ marginTop: 14 }}>
          {fallen().map((f, i) => (
            <div className="card falle" key={i}>
              <span className="falle-ico">{f.ico}</span>
              <div>
                <strong>{f.titel}</strong>
                <p style={{ marginTop: 3 }}>{f.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {ultimos.length > 0 && (
        <>
          <div className="sec-title" style={{ marginTop: 30 }}>
            <h2>{t('pf.lastRuns')}</h2>
          </div>
          <div className="stack" style={{ gap: 8 }}>
            {ultimos.map((r) => {
              const v = veredicto(r.pct);
              const teil = teiles().find((x) => x.id === r.teil);
              return (
                <div className="card pruef-result" key={r.id}>
                  <span>{teil?.ico} <strong>{teil?.name}</strong> · {r.typ}</span>
                  <span className="muted">{r.correct}/{r.total}</span>
                  <span className={'pruef-note ' + v.tono}>{r.pct}% · {v.txt}</span>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
