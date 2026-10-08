import React, { useEffect, useMemo, useState } from 'react';
import { t, pick, getLang, setLang, LANGS, LANGS_PENDIENTES } from '../lib/i18n.js';
import ImportarVocab from './ImportarVocab.jsx';
import ComoFunciona from './ComoFunciona.jsx';
import { SIN_IA, PORTABLE, BUILD } from '../lib/modo.js';
import { getSettings, setSettings, aiAvailable } from '../lib/settings.js';
import { storage } from '../lib/storage.js';
import { exportarFotos, importarFotos } from '../lib/fotos.js';
import { getTema, setTema, TEMAS } from '../lib/tema.js';
import { getLevel, liveStreak } from '../lib/streak.js';
import { saldo } from '../lib/monedas.js';
import { coronas, getFuchs, onCoronasListo } from '../lib/fuchs.js';
import { bestStreak } from '../lib/rachas.js';
import { generateItems, listarModelos } from '../lib/ai.js';
import { esOrdenador } from '../lib/teclas.js';
import { hablar, vozAlemana } from '../lib/audio.js';
import { progresoHuerfano } from '../lib/progress.js';
import { KURSBUCH, ruleConceptId } from '../lib/kursbuch/index.js';

const ICONO_TEMA = { auto: '🌗', claro: '☀️', oscuro: '🌙' };
const NOMBRE_TEMA = {
  auto: ['Automático', 'Automatic'],
  claro: ['Claro', 'Light'],
  oscuro: ['Oscuro', 'Dark']
};

export default function Settings({ onBack }) {
  const [tema, setTemaLocal] = useState(getTema());
  const [s, setS] = useState(getSettings());
  const [numCoronas, setNumCoronas] = useState(coronas);
  const [test, setTest] = useState(null);
  // Sacar las fotos de IndexedDB tarda un momento; el boton lo dice mientras.
  const [exportando, setExportando] = useState(false);
  const lvl = getLevel();
  const racha = liveStreak();

  useEffect(() => onCoronasListo(setNumCoronas), []);

  const up = (patch) => setS(setSettings(patch));

  // Sugerencias del campo Modelo: lo que tu clave puede usar de verdad. Se
  // pide un momento despues de dejar de teclear la clave, no a cada letra.
  const [modelos, setModelos] = useState({ lista: [], error: '' });
  useEffect(() => {
    if (SIN_IA || !s.aiEnabled || s.aiProvider === 'claude-local' || !s.aiKey) {
      setModelos({ lista: [], error: '' });
      return;
    }
    let vivo = true;
    const id = setTimeout(() => {
      listarModelos({ provider: s.aiProvider, key: s.aiKey, baseUrl: s.aiBaseUrl })
        .then((lista) => vivo && setModelos({ lista, error: '' }))
        .catch((e) => vivo && setModelos({ lista: [], error: e.message }));
    }, 600);
    return () => { vivo = false; clearTimeout(id); };
  }, [s.aiEnabled, s.aiProvider, s.aiKey, s.aiBaseUrl]);

  async function tryAi() {
    setTest(t('set.testing'));
    try {
      const items = await generateItems({ topicId: 'modalverben', topicName: 'Modalverben', count: 2 });
      setTest(items.length ? t('set.testOk', { n: items.length }) : t('set.testWeird'));
    } catch (e) {
      setTest('❌ ' + e.message);
    }
  }

  // La copia se lleva TAMBIEN las fotos de los apuntes. Viven en IndexedDB y
  // no en localStorage, asi que antes se quedaban fuera sin avisar: exportabas,
  // cambiabas de equipo, importabas, y los apuntes volvian sin una sola imagen.
  //
  // Van en su propio apartado del fichero, no mezcladas con las claves, para
  // que una copia vieja -que no las trae- se siga pudiendo importar igual.
  async function exportData() {
    setExportando(true);
    try {
      const datos = { __version: 1, claves: storage.exportAll(), fotos: await exportarFotos() };
      const blob = new Blob([JSON.stringify(datos)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'deutsch-trainer-backup.json';
      a.click();
      URL.revokeObjectURL(url);
    } finally {
      setExportando(false);
    }
  }

  function importData(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const datos = JSON.parse(reader.result);
        // Copias de antes: el fichero ERA el mapa de claves, sin envoltorio.
        const claves = datos && datos.claves ? datos.claves : datos;
        storage.importAll(claves);
        importarFotos(datos && datos.fotos).then(() => {
          alert(t('set.imported'));
          location.reload();
        });
      } catch {
        alert(t('set.badFile'));
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="stack reading">
      <div className="topbar">
        <h1>Einstellungen</h1>
        <button className="link-btn" onClick={onBack}><span className="fl-atras">◂</span> {t('back')}</button>
      </div>

      {/* Lo que llevas conseguido, junto. Estaba repartido entre la portada, el
          monedero y el panel del zorro, y aquí es donde uno lo viene a mirar. */}
      <div className="panel">
        <h2>{t('set.account')}</h2>
        <div className="set-resumen">
          <div className="card statcard">
            <div className={'n' + (lvl.level >= 100 ? ' num-dorado' : '')}>{lvl.level}</div>
            <div className="l">{t('set.level')}</div>
          </div>
          <div className="card statcard">
            <div className="n">{lvl.totalXp}</div>
            <div className="l">XP</div>
          </div>
          <div className="card statcard">
            <div className="n">{saldo()}</div>
            <div className="l">{t('fox.coins')}</div>
          </div>
          <div className="card statcard">
            <div className="n">{numCoronas}</div>
            <div className="l">{t('set.crowns')}</div>
          </div>
          <div className="card statcard">
            <div className="n">{racha.current}</div>
            <div className="l">{t('set.streakDays')}</div>
          </div>
          <div className="card statcard">
            <div className="n">{bestStreak()}</div>
            <div className="l">{t('set.bestRun')}</div>
          </div>
        </div>
        <p className="field-hint set-resumen-nota">{t('set.foxHint', { nombre: getFuchs().nombre })}</p>
      </div>

      {/* El idioma se cambia desde la barra lateral, pero ahi son dos
          pastillas de dos letras y no se ve que haya mas. Aqui esta la lista
          entera, con los que todavia no estan puestos a la vista y apagados:
          un hueco marcado dice mas que no decir nada. */}
      <div className="panel">
        <h2>{pick('Idioma', 'Language')}</h2>
        <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 12 }}>
          {pick(
            'El alemán no se traduce nunca: es lo que vienes a aprender. Esto cambia lo demás.',
            'German is never translated: that is what you came for. This changes everything else.'
          )}
        </p>
        <div className="idiomas" role="radiogroup" aria-label={pick('Idioma', 'Language')}>
          {LANGS.map((l) => (
            <button
              key={l.id}
              type="button"
              role="radio"
              aria-checked={getLang() === l.id}
              className={'idioma' + (getLang() === l.id ? ' on' : '')}
              onClick={() => setLang(l.id)}
            >
              <span className="idioma-bandera">{l.flag}</span>
              <span>{l.label}</span>
            </button>
          ))}
          {LANGS_PENDIENTES.map((l) => (
            <button key={l.id} type="button" role="radio" aria-checked={false} className="idioma pendiente" disabled>
              <span className="idioma-bandera">{l.flag}</span>
              <span>{l.label}</span>
              <small>{pick('Próximamente', 'Coming soon')}</small>
            </button>
          ))}
        </div>
      </div>

      {/* El modo oscuro salia solo de prefers-color-scheme, y el HTML de un
          fichero se abre en un navegador que muchas veces no se lo pasa a la
          pagina: se veia siempre claro y no habia donde cambiarlo. */}
      <div className="panel">
        <h2>{pick('Aspecto', 'Appearance')}</h2>
        <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 12 }}>
          {pick(
            'En automático sigue al sistema. Si tu navegador no le pasa el modo oscuro a la pagina, elígelo aquí a mano.',
            'On automatic it follows your system. If your browser does not pass dark mode on to the page, pick it here by hand.'
          )}
        </p>
        <div className="idiomas" role="radiogroup" aria-label={pick('Aspecto', 'Appearance')}>
          {TEMAS.map((id) => (
            <button
              key={id}
              type="button"
              role="radio"
              aria-checked={tema === id}
              className={'idioma' + (tema === id ? ' on' : '')}
              onClick={() => { setTema(id); setTemaLocal(id); }}
            >
              <span className="idioma-bandera" aria-hidden="true">{ICONO_TEMA[id]}</span>
              <span>{NOMBRE_TEMA[id][getLang() === 'en' ? 1 : 0]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel">
        <h2>{t('set.session')}</h2>
        <label className="field">
          {t('set.perSession')}
          <input type="number" min="4" max="30" value={s.sessionSize}
            onChange={(e) => up({ sessionSize: Number(e.target.value) })} />
          <span className="field-hint">{t('set.xpHint')}</span>
        </label>
      </div>

      <div className="panel">
        <h2>⌨️ {pick('Atajos de teclado', 'Keyboard shortcuts')}</h2>
        <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 12 }}>
          {pick(
            'Muestra u oculta las etiquetas visuales con los números y letras en las opciones de los ejercicios. Aunque estén ocultas, podrás seguir usando las teclas físicas para responder.',
            'Show or hide the visual badges with numbers and letters on exercise options. Even when hidden, you can still use keyboard keys to answer.'
          )}
        </p>
        <label className="switch">
          <input
            type="checkbox"
            checked={s.showShortcuts !== false}
            onChange={(e) => up({ showShortcuts: e.target.checked })}
          />
          <span>{pick('Mostrar visualmente los atajos de teclado', 'Show keyboard shortcut badges')}</span>
        </label>
      </div>

      <div className="panel">
        <h2>{pick('Audio y pronunciación', 'Audio & Pronunciation')}</h2>
        {esOrdenador() ? (
          <p className="muted" style={{ fontSize: '0.9rem', lineHeight: 1.5, marginBottom: 12 }}>
            {pick(
              'En esta versión de ordenador se pueden escuchar con total claridad y fluidez todos los textos y ejercicios que requieren audio (comprensión auditiva en exámenes, lecturas de lecciones, pronunciación de vocabulario y frases en Kommunikation), gracias a las voces alemanas del sintetizador de voz integrado en el navegador.',
              'In this desktop version, you can clearly and smoothly listen to all texts and exercises that require audio (exam listening comprehension, lesson readings, vocabulary and Kommunikation sentence pronunciation), thanks to high-quality German speech synthesis built into your browser.'
            )}
          </p>
        ) : (
          <p className="muted" style={{ fontSize: '0.9rem', lineHeight: 1.5, marginBottom: 12 }}>
            {pick(
              'Para escuchar con la máxima claridad los ejercicios de comprensión auditiva y lecturas en voz alta, se recomienda usar la versión de ordenador, que aprovecha las voces completas del sistema.',
              'For the clearest audio on listening comprehension exercises and read-aloud features, the desktop version is recommended, utilizing complete system voices.'
            )}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
          <button
            type="button"
            className="btn-ghost btn-sm"
            onClick={() => hablar('Hallo! Hier kannst du deutsche Texte und Übungen deutlich hören.')}
          >
            {pick('Probar voz alemana', 'Test German voice')}
          </button>
          {vozAlemana() && (
            <span className="field-hint" style={{ margin: 0 }}>
              {pick('Voz detectada:', 'Detected voice:')} {vozAlemana().name}
            </span>
          )}
        </div>
      </div>

      {/* Todo el panel de IA fuera cuando se compila sin ella: proveedor,
          clave, modelo, cuanta parte de la tanda genera y el boton de
          probar la conexion. Sin IA no hay nada que configurar. */}
      {!SIN_IA && (
        <div className="panel">
          <h2>{t('set.aiTitle')}</h2>
          <p className="muted" style={{ fontSize: '0.9rem' }}>
            {t('set.aiIntro')}
          </p>
          <label className="switch" style={{ marginTop: 14 }}>
            <input type="checkbox" checked={s.aiEnabled} onChange={(e) => up({ aiEnabled: e.target.checked })} />
            <span>{t('set.aiOn')}</span>
          </label>

          {/* El semáforo que vivía en el menú lateral: si la IA está de
              verdad encendida, si faltan datos o si van las plantillas. Allí
              había además un segundo selector de motor, y con este panel al
              lado eran dos mandos para lo mismo. */}
          <div className="engine-status">
            {aiAvailable(s) ? (
              <>
                <span className="dot-live" /> {t('set.aiLive')}
              </>
            ) : s.aiEnabled ? (
              <>
                <span className="dot-off" /> {t('set.aiNoKey')}
              </>
            ) : (
              <>
                <span className="dot-off" /> {t('set.aiTemplates')}
              </>
            )}
          </div>

          {s.aiEnabled && (
            <>
              <label className="field">
                {t('set.provider')}
                <select value={s.aiProvider} onChange={(e) => up({ aiProvider: e.target.value })}>
                  <option value="claude-local">{pick('Claude (local, sin API key)', 'Claude (local, no API key)')}</option>
                  <option value="gemini">{pick('Google Gemini (capa gratuita)', 'Google Gemini (free tier)')}</option>
                  <option value="openai-compat">OpenAI / compatible</option>
                </select>
              </label>

              {/* Explicación de capacidades: Claude vs Gemini / OpenAI */}
              <div style={{
                marginTop: 10,
                marginBottom: 14,
                padding: '12px 14px',
                borderRadius: 10,
                background: 'var(--surface-2, rgba(255, 255, 255, 0.04))',
                border: '1px solid var(--border)',
                fontSize: '0.86rem',
                lineHeight: 1.5
              }}>
                <div style={{ fontWeight: 600, marginBottom: 6, color: 'var(--text)' }}>
                  {pick('💡 ¿Qué puede hacer cada proveedor?', '💡 What can each provider do?')}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 7, color: 'var(--text-2)' }}>
                  <div>
                    <strong style={{ color: 'var(--text)' }}>Claude (local):</strong>{' '}
                    {pick(
                      'Capaz de búsqueda web en tiempo real. Puede generar ejercicios, explicaciones, evaluar respuestas y además buscar noticias reales de prensa austríaca/alemana y canciones en YouTube. Requiere ejecutar el proyecto en local con el servidor de desarrollo.',
                      'Capable of real-time web search. Can generate exercises, explanations, evaluate answers, and fetch real Austrian/German news and search songs on YouTube. Requires running the project locally with the dev server.'
                    )}
                  </div>
                  <div>
                    <strong style={{ color: 'var(--text)' }}>Google Gemini:</strong>{' '}
                    {pick(
                      'Compatible al 100% con todas las funciones (ejercicios adaptativos, simulacros de examen A2, explicaciones, chat con Felix, y búsqueda web con Google Search Grounding para noticias y canciones de YouTube). Funciona directamente en el navegador y en el archivo HTML portable con tu clave gratuita de Google AI Studio.',
                      '100% compatible with all features (adaptive exercises, A2 exam simulations, explanations, Felix chat, and web search with Google Search Grounding for real news and YouTube songs). Works directly in the browser and portable HTML with your free Google AI Studio key.'
                    )}
                  </div>
                </div>
              </div>
              {s.aiProvider === 'claude-local' ? (
                <>
                  <p className="field-hint" style={{ marginTop: 10 }}>
                    {t('set.localHint')}
                  </p>
                  {/* Con este proveedor los campos de clave y modelo estaban
                      escondidos. El resultado: quien había configurado Gemini y
                      volvía aquí dejaba de ver su propia configuración, no
                      entendía por qué no funcionaba nada fuera de npm run dev,
                      y no tenía ni una pista de dónde mirar. Ahora se dice que
                      la clave sigue guardada y para qué sirve. */}
                  {s.aiKey && (
                    <p className="field-hint" style={{ marginTop: 6 }}>
                      {t('set.localConClave', { modelo: s.aiModel || '—' })}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <label className="field">
                    {t('set.model')}
                    <input type="text" value={s.aiModel} onChange={(e) => up({ aiModel: e.target.value })}
                      list="modelos-ia"
                      placeholder={s.aiProvider === 'gemini' ? 'gemini-2.5-flash' : 'gpt-4o-mini'} />
                    <datalist id="modelos-ia">
                      {modelos.lista.map((m) => <option key={m} value={m} />)}
                    </datalist>
                    <span className="field-hint">
                      {modelos.error
                        ? t('set.modelsError', { error: modelos.error })
                        : modelos.lista.length
                          ? t('set.modelsLive', { n: modelos.lista.length })
                          : t('set.modelsNeedKey')}
                    </span>
                  </label>
                  <label className="field">
                    API key
                    <input type="password" value={s.aiKey} onChange={(e) => up({ aiKey: e.target.value })}
                      placeholder={t('set.keyPh')} />
                    <span className="field-hint">
                      {s.aiProvider === 'gemini'
                        ? t('set.geminiHint')
                        : t('set.openaiHint')}
                    </span>
                  </label>
                  {s.aiProvider === 'openai-compat' && (
                    <label className="field">
                      Base URL
                      <input type="text" value={s.aiBaseUrl || ''}
                        onChange={(e) => up({ aiBaseUrl: e.target.value })}
                        placeholder="https://api.openai.com/v1" />
                      <span className="field-hint">Para Ollama, Groq, OpenRouter u otro endpoint compatible.</span>
                    </label>
                  )}
                </>
              )}
              <label className="field">
                {t('set.aiShare')}: <strong>{Math.round(s.aiShare * 100)}%</strong>
                {/* Llega hasta el 100%: quien quiera la tanda entera de la IA
                    puede pedirla. Y el 0 vale: se practica solo con plantillas. */}
                <input type="range" min="0" max="1" step="0.1" value={s.aiShare}
                  onChange={(e) => up({ aiShare: Number(e.target.value) })} style={{ width: '100%' }} />
              </label>
              <p className="field-hint" style={{ marginTop: 6 }}>
                {s.aiShare === 0 ? t('set.aiShareOff') : t('set.aiShareHint')}
              </p>
              <div style={{ marginTop: 14 }}>
                <button className="btn-ghost btn-sm" onClick={tryAi}>{t('set.testConn')}</button>
                {test && <p className="field-hint" style={{ marginTop: 8 }}>{test}</p>}
              </div>
            </>
          )}
        </div>
      )}

      {/* Importar un Excel como mazo. Estaba en Wortschatz, donde estorbaba
          todos los dias por algo que se hace una vez.

          En el HTML de un solo fichero no va. No es por quitar funciones: el
          lector de hojas de calculo pesa 417 KB de los 2.088 que ocupaba el
          fichero -el 20%-, y quien lo recibe por Drive no va a importar un
          Excel. Al no pintarse aqui, ImportarVocab sale del bundle y con el
          se va su import('xlsx'). */}
      <ComoFunciona />

      {!PORTABLE && <ImportarVocab />}

      <AvisoProgresoHuerfano />

      <div className="panel">
        <h2>{t('set.data')}</h2>
        <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 14 }}>
          {t('set.dataIntro')}
        </p>
        <div className="btn-row">
          <button className="btn-ghost btn-sm" onClick={exportData} disabled={exportando}>
            {exportando ? t('set.exporting') : t('set.export')}
          </button>
          <label className="btn-ghost btn-sm" style={{ display: 'inline-flex', alignItems: 'center' }}>
            {t('set.import')}
            <input type="file" accept="application/json" onChange={importData} style={{ display: 'none' }} />
          </label>
          <button className="btn-ghost btn-sm danger"
            onClick={() => {
              if (!confirm(t(SIN_IA ? 'set.confirmResetSinIA' : 'set.confirmReset'))) return;
              const n = storage.resetAll();
              alert(t('set.resetDone', { n }));
              location.reload();
            }}>
            {t('set.reset')}
          </button>
        </div>
      </div>

      {/* Footer con versión, autor y créditos de libros */}
      <footer className="set-watermark">
        <span className="sw-item sw-creditos">
          📖 {pick('Basado en «Miteinander in Österreich» (Hueber Verlag)', 'Based on «Miteinander in Österreich» (Hueber Verlag)')}
        </span>
        <span className="sw-sep" aria-hidden="true">·</span>
        {BUILD && (
          <>
            <span className="sw-item sw-build">{t('set.build', { fecha: BUILD })}</span>
            <span className="sw-sep" aria-hidden="true">·</span>
          </>
        )}
        <span className="sw-item sw-autor">
          {pick('Creado por Alvar Pascual García', 'Created by Alvar Pascual García')}
        </span>
        <span className="sw-sep" aria-hidden="true">·</span>
        <span className="sw-item sw-feedback">
          {pick('Feedback:', 'Feedback:')}{' '}
          <a href="mailto:pascualgarciaallvar@gmail.com" className="sw-email">
            pascualgarciaallvar@gmail.com
          </a>
        </span>
      </footer>
    </div>
  );
}


// Progreso que ya no corresponde a ningun contenido.
//
// El progreso de un apartado de Kommunikation se guarda con su nombre aleman
// como clave, y el de una regla con el texto de la regla cuando no trae `key`
// propia. Asi que renombrar cualquiera de los dos deja lo que llevabas hecho
// colgando de una clave muerta: la barra baja sola y no hay nada que lo diga.
// Ya paso una vez al reorganizar las lecciones.
//
// No ofrece borrarlo: borrarlo seria rematar la perdida. Lo que hay que hacer
// con lo que salga aqui es mirarlo y anadirlo a RENOMBRADAS en progress.js,
// que es lo que devuelve el trabajo a su sitio.
function AvisoProgresoHuerfano() {
  const huerfano = useMemo(() => {
    const apartadosVivos = new Set();
    const conceptosVivos = new Set();
    for (const banda of KURSBUCH.baende) {
      for (const l of banda.lektionen) {
        for (const f of l.kommunikation || []) apartadosVivos.add(`${l.id}:${f.funktion}`);
        for (const g of l.grammatik || []) conceptosVivos.add(ruleConceptId(l, g));
      }
    }
    return progresoHuerfano({ apartadosVivos, conceptosVivos });
  }, []);

  const total = huerfano.apartados.length + huerfano.conceptos.length;
  if (!total) return null;

  return (
    <div className="panel">
      <h2>{pick('Progreso sin contenido', 'Progress with no content')}</h2>
      <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 10 }}>
        {pick(
          `Hay ${total} apuntes de progreso que ya no corresponden a ningun apartado ni regla del libro, seguramente porque cambiaron de nombre. No se pierde nada del almacen, pero ese trabajo no esta contando en ninguna barra.`,
          `There are ${total} progress records that no longer match any section or rule in the book, most likely because they were renamed. Nothing is lost from storage, but that work is not counting towards any bar.`
        )}
      </p>
      <ul className="muted" style={{ fontSize: '0.82rem', margin: 0, paddingLeft: 18 }}>
        {[...huerfano.apartados, ...huerfano.conceptos].slice(0, 12).map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      {total > 12 && (
        <p className="muted" style={{ fontSize: '0.82rem', marginTop: 8 }}>
          {pick(`y ${total - 12} mas`, `and ${total - 12} more`)}
        </p>
      )}
    </div>
  );
}
