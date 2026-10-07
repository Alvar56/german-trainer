import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { analyzeImage } from '../lib/ai.js';
import { runJob } from '../lib/aiJobs.js';
import { useAiJob } from '../lib/useAiJob.js';
import { updateNote, getNote, fotosDeNota } from '../lib/notebook.js';
import { guardarFoto, leerFoto, borrarFoto } from '../lib/fotos.js';
import { aiAvailable } from '../lib/settings.js';
import { t, localeFecha } from '../lib/i18n.js';

// Reescala la foto antes de mandarla: las cámaras dan 4000px y eso solo hace
// que tarde más. 1600px sobra para leer un ejercicio.
function escalar(file, maxLado) {
  return new Promise((resolve, reject) => {
    const fr = new FileReader();
    fr.onerror = () => reject(new Error('No se pudo leer el archivo.'));
    fr.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Ese archivo no es una imagen válida.'));
      img.onload = () => {
        const escala = Math.min(1, maxLado / Math.max(img.width, img.height));
        const w = Math.round(img.width * escala);
        const h = Math.round(img.height * escala);
        const c = document.createElement('canvas');
        c.width = w;
        c.height = h;
        const ctx = c.getContext('2d');
        ctx.fillStyle = '#fff';
        ctx.fillRect(0, 0, w, h);
        ctx.drawImage(img, 0, 0, w, h);
        resolve(c.toDataURL('image/jpeg', 0.88));
      };
      img.src = fr.result;
    };
    fr.readAsDataURL(file);
  });
}

// Agrupa una lista plana por el número del ejercicio: "4.2b" y "4.2c" van
// juntos, "5a.1" empieza grupo nuevo. Sirve para las fotos analizadas antes de
// que la IA devolviera la estructura ya agrupada: sin esto salían los treinta
// ítems de corrido y no se veía dónde empezaba cada ejercicio.
function agrupar(items) {
  const grupos = [];
  for (const it of items) {
    const clave = String(it.nummer || '').split('.')[0].trim();
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.clave === clave) ultimo.aufgaben.push(it);
    else grupos.push({ clave, anweisung: '', aufgaben: [it] });
  }
  return grupos;
}

// Los ítems de un ejercicio. Va aparte porque una hoja trae varios y cada uno
// se pinta bajo su propio enunciado.
function ListaItems({ items }) {
  return (
    <ol className="foto-lista">
      {items.map((it, i) => (
        <li className={'fi' + (it.deinAntwort && !it.richtig ? ' ko' : '')} key={i}>
          <div>
            {/* El número va DENTRO de la frase, no en una columna aparte: en
                columna se partía en dos líneas y descuadraba la fila. */}
            <p className="fi-q">
              <span className="fi-n">{it.nummer || i + 1}</span>
              {it.frage}
            </p>
            <p className="fi-a">
              {it.deinAntwort && !it.richtig && (
                <>
                  <span className="falsch">{it.deinAntwort}</span>
                  <span className="pfeil">→</span>
                </>
              )}
              <span className="richtig">{it.antwort}</span>
              {it.deinAntwort && it.richtig && <span className="fi-ok">✓</span>}
            </p>
            {it.warum && <p className="fi-warum">{it.warum}</p>}
          </div>
        </li>
      ))}
    </ol>
  );
}

// Una foto puede quedarse en el cuaderno sin pedirle a la IA que la lea.
function FotoGuardada({ a, onBorrar }) {
  const [img, setImg] = useState(a.thumb || null);
  const [ampliada, setAmpliada] = useState(false);
  const cerrarRef = useRef(null);
  useEffect(() => {
    if (a.thumb || !a.thumbRef) return undefined;
    let vivo = true;
    leerFoto(a.thumbRef)
      .then((url) => { if (vivo) setImg(url); })
      .catch(() => {});
    return () => { vivo = false; };
  }, [a.thumb, a.thumbRef]);

  useEffect(() => {
    if (!ampliada) return undefined;
    const overflowOriginal = document.body.style.overflow;
    const principal = document.querySelector('.main');
    const overflowPrincipal = principal?.style.overflowY || '';
    const alPulsar = (event) => {
      if (event.key === 'Escape') setAmpliada(false);
    };
    document.body.style.overflow = 'hidden';
    if (principal) principal.style.overflowY = 'hidden';
    window.addEventListener('keydown', alPulsar);
    cerrarRef.current?.focus();
    return () => {
      document.body.style.overflow = overflowOriginal;
      if (principal) principal.style.overflowY = overflowPrincipal;
      window.removeEventListener('keydown', alPulsar);
    };
  }, [ampliada]);

  return (
    <div className="foto-resuelto stack foto-guardada">
      <div className="row" style={{ alignItems: 'center', gap: 12, flexWrap: 'nowrap' }}>
        <span className="muted" style={{ fontSize: '0.78rem' }}>
          {a.at ? new Date(a.at).toLocaleDateString(localeFecha()) : ''}
        </span>
        <span className="muted" style={{ fontSize: '0.86rem' }}>{t('foto.savedOnly')}</span>
        <button
          className="link-btn"
          style={{ padding: 0, fontSize: '0.8rem', color: 'var(--bad)' }}
          onClick={onBorrar}
          title={t('foto.deleteOne')}
        >
          ✕ {t('foto.deleteOne')}
        </button>
      </div>
      {img && (
        <div className="foto-preview">
          <button
            type="button"
            className="foto-ampliar"
            onClick={() => setAmpliada(true)}
            aria-label={t('foto.openSaved')}
            title={t('foto.openSaved')}
          >
            <img src={img} alt="" />
          </button>
        </div>
      )}
      {ampliada && img && createPortal(
        <div
          className="foto-ampliada-overlay"
          onClick={(event) => {
            if (event.target === event.currentTarget) setAmpliada(false);
          }}
        >
          <div className="foto-ampliada-caja" role="dialog" aria-modal="true" aria-label={t('foto.openSaved')}>
            <button
              ref={cerrarRef}
              type="button"
              className="foto-ampliada-cerrar"
              onClick={() => setAmpliada(false)}
              aria-label={t('foto.close')}
              title={t('foto.close')}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" aria-hidden="true">
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            </button>
            <img src={img} alt="" />
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

// Un análisis ya resuelto. Va aparte porque ahora se apilan varios en la misma
// nota y hay que pintar uno por cada foto que hayas resuelto.
function Resultado({ a, esAufgabe, onBorrar }) {
  // El interruptor de la traduccion es de CADA resultado. Compartido, abrir la
  // traduccion de uno la abria en todos a la vez.
  const [verEs, setVerEs] = useState(true);

  // La miniatura ya no viaja dentro de la nota: se pide a IndexedDB por su
  // referencia. `a.thumb` se sigue mirando primero por las notas que todavia
  // no ha tocado la migracion, y por si IndexedDB no esta disponible.
  const [img, setImg] = useState(a.thumb || null);
  useEffect(() => {
    if (a.thumb || !a.thumbRef) return undefined;
    let vivo = true;
    leerFoto(a.thumbRef)
      .then((url) => {
        if (vivo) setImg(url);
      })
      .catch(() => {
        /* sin IndexedDB (portable en file://) no hay miniatura, y ya esta */
      });
    return () => {
      vivo = false;
    };
  }, [a.thumb, a.thumbRef]);
  return (
    <div className="foto-resuelto stack" style={{ marginTop: 16 }}>
      <div className="row spread" style={{ alignItems: 'center' }}>
        <span className="muted" style={{ fontSize: '0.78rem' }}>
          {a.at ? new Date(a.at).toLocaleDateString(localeFecha()) : ''}
        </span>
        <button
          className="link-btn"
          style={{ padding: 0, fontSize: '0.8rem', color: 'var(--bad)' }}
          onClick={onBorrar}
          title={t('foto.deleteOne')}
        >
          ✕ {t('foto.deleteOne')}
        </button>
      </div>
      {img && (
        <div className="foto-preview">
          <img src={img} alt="" />
        </div>
      )}
          {a.problema && (
            <div className="card" style={{ borderColor: 'var(--bad)', background: 'var(--bad-bg)' }}>
              {a.problema}
            </div>
          )}

          {a.titel && <div className="lk-block-title" style={{ marginTop: 4 }}>{a.titel}</div>}

          {/* El enunciado de la hoja, tal cual: sin él ves las respuestas pero
              no qué te estaban pidiendo. */}


          {/* Una hoja trae varios ejercicios (3, 4, 5a…), cada uno con su
              instrucción. Se pinta el enunciado y debajo SUS ítems, que es el
              orden en el que está en el papel. Las fotos analizadas antes de
              esto no traen bloques: para esas se pinta la lista de siempre. */}
          {esAufgabe &&
            (a.bloecke?.length > 0 ? a.bloecke : agrupar(a.aufgaben || [])).map((b, bi) => (
              <div className="foto-bloque" key={bi}>
                {/* El enunciado impreso si se lee en la foto; si no, al menos
                    el número. Y debajo, en una línea, qué hay que hacer: es lo
                    que de verdad sirve cuando vuelves a mirar la hoja. */}
                {b.anweisung ? (
                  <p className="foto-enunciado">{b.anweisung}</p>
                ) : (
                  b.clave && <p className="foto-enunciado sinTexto">{t('foto.ejercicioN', { n: b.clave })}</p>
                )}
                {b.wieLoesen && <p className="foto-comoresolver">💡 {b.wieLoesen}</p>}
                <ListaItems items={b.aufgaben} />
              </div>
            ))}

          {esAufgabe && a.regel?.titel && (
            <div className="card diary-lektion">
              <div className="lk-block-title">📖 {a.regel.titel}</div>
              {a.regel.erklaerung && <p className="lk-expl" style={{ marginBottom: 0 }}>{a.regel.erklaerung}</p>}
            </div>
          )}

          {!esAufgabe && a.beschreibung && (
            <div className="card">
              <div className="row spread" style={{ marginBottom: 8 }}>
                <div className="lk-block-title" style={{ margin: 0 }}>{t('foto.description')}</div>
                <button className="link-btn" style={{ padding: 0, fontSize: '0.8rem' }} onClick={() => setVerEs(!verEs)}>
                  {verEs ? t('hideEs') : t('showEs')}
                </button>
              </div>
              <p className="news-de">{a.beschreibung}</p>
              {verEs && a.beschreibungEs && <p className="news-es">{a.beschreibungEs}</p>}
            </div>
          )}

          {a.saetze?.length > 0 && (
            <div className="card">
              <div className="lk-block-title">{t('foto.phrases')}</div>
              <ul className="lk-examples" style={{ marginTop: 8 }}>
                {a.saetze.map((x, i) => (
                  <li key={i}>
                    <span className="de">{x.de}</span>
                    <span className="es">{x.es}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {a.woerter?.length > 0 && (
            <div className="card">
              <div className="lk-block-title">📚 {t('foto.vocab')}</div>
              <div className="nb-chips" style={{ marginTop: 8 }}>
                {a.woerter.map((w, i) => (
                  <span className="nb-chip voc" key={i}><strong>{w.de}</strong> — {w.es}</span>
                ))}
              </div>
            </div>
          )}

          {a.fragen?.length > 0 && (
            <div className="card">
              <div className="lk-block-title">❓ {t('foto.questions')}</div>
              <ul className="lk-examples" style={{ marginTop: 8 }}>
                {a.fragen.map((f, i) => (
                  <li key={i}>
                    <span className="de">{f.frage}</span>
                    <span className="es">{f.antwort}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
    </div>
  );
}

// Un bloque por tarea. Resolver un ejercicio y describir una foto no se
// parecen en nada, así que mezclarlos en un solo cajón con dos botones solo
// hacía dudar de cuál pulsar.
export default function NotePhoto({ noteId, modo = 'aufgabe', lektion, analisis = [], onCambio }) {
  // El análisis tarda un par de minutos. Va por el gestor de trabajos, no en el
  // estado del componente: así puedes irte a otra sección mientras y al volver
  // sigue en marcha o ya está hecho. Antes, cambiar de pestaña lo tiraba a la
  // basura y había que empezar de cero.
  const JOB = `foto:${noteId || 'sin-nota'}:${modo}`;
  const job = useAiJob(JOB);
  const busy = job.status === 'running';
  const [foto, setFoto] = useState(null);      // versión grande, solo en memoria
  const [thumb, setThumb] = useState(null);
  const [err, setErr] = useState('');
  const [guardando, setGuardando] = useState(false);
  const fileRef = useRef(null);
  const raiz = useRef(null);
  const [arrastra, setArrastra] = useState(false);
  const aiOn = aiAvailable();

  const esAufgabe = modo === 'aufgabe';

  async function cargar(file) {
    if (!file) return;
    setErr('');
    try {
      const grande = await escalar(file, 1600);
      const peque = await escalar(file, 520);
      setFoto(grande);
      setThumb(peque);
    } catch (e2) {
      setErr(e2.message);
    }
  }

  function elegir(e) {
    cargar(e.target.files?.[0]);
  }

  // Pegar con Ctrl+V. Un ejercicio de clase casi siempre llega como recorte de
  // pantalla, y obligar a guardarlo en disco para luego buscarlo en la carpeta
  // sobra: el portapapeles ya trae la imagen.
  //
  // En la página hay DOS bloques de foto, así que hay que decidir cuál se la
  // queda: el que tenga el foco dentro y, si no hay ninguno, el de resolver
  // ejercicios, que es para lo que se pega una captura.
  useEffect(() => {
    function alPegar(e) {
      const items = Array.from(e.clipboardData?.items || []);
      const img = items.find((i) => i.type.startsWith('image/'));
      if (!img) return;
      const mio = !!raiz.current?.contains(document.activeElement);
      const hayEnfocado = !!document.querySelector('.foto-box:focus-within');
      if (!mio && (hayEnfocado || !esAufgabe)) return;
      e.preventDefault();
      cargar(img.getAsFile());
      raiz.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    document.addEventListener('paste', alPegar);
    return () => document.removeEventListener('paste', alPegar);
  }, [esAufgabe]);

  // Arrastrar el archivo encima también vale, y ese sí sabe a qué bloque va.
  function soltar(e) {
    e.preventDefault();
    setArrastra(false);
    cargar(e.dataTransfer?.files?.[0]);
  }

  async function analizar() {
    if (!foto || busy) return;
    setErr('');
    const mini = thumb;
    const r = await runJob(JOB, () => analyzeImage({ dataUrl: foto, modo, lektion }));
    if (!r) {
      setErr(job.error || 'No se pudo leer la foto.');
      return;
    }
    // Se guarda el análisis y una miniatura; la foto grande no, para no
    // reventar el almacenamiento del navegador.
    //
    // Y se escribe DIRECTAMENTE en la nota además de avisar al padre: si te
    // has ido de la pantalla, el padre ya no existe y el resultado se perdería
    // después de dos minutos de espera.
    // Se APILA, no se sustituye: cada foto que resuelves se queda hasta que la
    // borras tu. Antes la nueva pisaba a la anterior.
    //
    // Y la lista de las que ya habia se lee de la nota AHORA, no de las props
    // de cuando pulsaste el boton: entre medias pasan un par de minutos, y en
    // ese rato puedes haber borrado un resultado o haber resuelto otra foto.
    // Con la foto de entonces, ese cambio se deshacia al terminar.
    const campo = modo === 'aufgabe' ? 'fotoAufgaben' : 'fotoBilder';
    // La miniatura va a IndexedDB y en la nota queda solo la referencia. Antes
    // se guardaba la imagen entera en base64 dentro de la nota, y como cada
    // guardado sincroniza TODO el progreso, seis fotos eran 555 KB subidos
    // cada vez que ganabas una moneda.
    //
    // Si IndexedDB no va, guardarFoto devuelve null y la imagen se queda
    // dentro como siempre: no se pierde nada, solo no se gana.
    const ref = await guardarFoto(mini);
    const nuevo = ref
      ? { ...r, thumbRef: ref, at: Date.now() }
      : { ...r, thumb: mini, at: Date.now() };
    const previas = noteId ? fotosDeNota(getNote(noteId), modo) : analisis;
    const lista = [nuevo, ...previas];
    if (noteId) updateNote(noteId, { [campo]: lista, fotoAnalyse: null });
    onCambio?.(lista);
    quitar();
  }

  async function guardarSinResolver() {
    if (!thumb || busy || guardando) return;
    setErr('');
    setGuardando(true);
    try {
      // La imagen a tamaño de lectura se guarda fuera de localStorage; si
      // IndexedDB no esta disponible, se conserva la miniatura como respaldo.
      const thumbRef = await guardarFoto(foto);
      const nueva = thumbRef
        ? { soloFoto: true, thumbRef, at: Date.now() }
        : { soloFoto: true, thumb, at: Date.now() };
      const campo = modo === 'aufgabe' ? 'fotoAufgaben' : 'fotoBilder';
      const previas = noteId ? fotosDeNota(getNote(noteId), modo) : analisis;
      const lista = [nueva, ...previas];
      if (noteId) updateNote(noteId, { [campo]: lista, fotoAnalyse: null });
      onCambio?.(lista);
      quitar();
    } finally {
      setGuardando(false);
    }
  }

  function quitar() {
    setFoto(null);
    setThumb(null);
    setErr('');
    if (fileRef.current) fileRef.current.value = '';
  }

  // Borrar es SIEMPRE cosa tuya: nada se quita solo. Por eso pregunta antes.
  function borrar(i) {
    if (!confirm(t('foto.confirmDel'))) return;
    const campo = modo === 'aufgabe' ? 'fotoAufgaben' : 'fotoBilder';
    // Tambien de IndexedDB: si no, la imagen se queda ahi para siempre sin que
    // nada la apunte, y el tope de la cuota vuelve a acercarse solo.
    if (analisis[i]?.thumbRef) borrarFoto(analisis[i].thumbRef);
    const lista = analisis.filter((_, k) => k !== i);
    if (noteId) updateNote(noteId, { [campo]: lista });
    onCambio?.(lista);
  }

  return (
    <div
      className={'card foto-box' + (arrastra ? ' arrastrando' : '')}
      ref={raiz}
      tabIndex={-1}
      onDragOver={(e) => {
        e.preventDefault();
        setArrastra(true);
      }}
      onDragLeave={() => setArrastra(false)}
      onDrop={soltar}
    >
      {/* La galería guardada queda antes del selector para volver a ver las
          fotos anteriores antes de añadir una nueva. */}
      {(analisis.length > 0 || busy) && (
        <>
          {analisis.some((a) => a.soloFoto) && (
            <>
              <div className="lk-block-title" style={{ marginTop: 12 }}>
                {t('foto.savedCount', { n: analisis.filter((a) => a.soloFoto).length })}
              </div>
              <p className="muted" style={{ fontSize: '0.8rem', margin: '2px 0 0' }}>{t('foto.keepHint')}</p>
              <div className="foto-guardadas-grid">
                {analisis.map((a, i) => a.soloFoto && (
                  <FotoGuardada key={a.at || i} a={a} onBorrar={() => borrar(i)} />
                ))}
              </div>
            </>
          )}
          {analisis.some((a) => !a.soloFoto) && (
            <>
              <div className="lk-block-title" style={{ marginTop: 20 }}>
                {t(esAufgabe ? 'foto.doneA' : 'foto.doneB', { n: analisis.filter((a) => !a.soloFoto).length })}
              </div>
              <p className="muted" style={{ fontSize: '0.8rem', margin: '2px 0 0' }}>{t('foto.keepHint')}</p>
              {analisis.map((a, i) => !a.soloFoto && (
                <Resultado key={a.at || i} a={a} esAufgabe={esAufgabe} onBorrar={() => borrar(i)} />
              ))}
            </>
          )}
          {busy && !analisis.some((a) => !a.soloFoto) && (
            <div className="lk-block-title" style={{ marginTop: 20 }}>
              {t(esAufgabe ? 'foto.doneA' : 'foto.doneB', { n: 0 })}
            </div>
          )}
          {busy && (
            <div className="card center muted" style={{ marginTop: 14, fontSize: '0.85rem' }}>
              {t(esAufgabe ? 'foto.solving' : 'foto.describing')}
            </div>
          )}
        </>
      )}

      <div className="lk-block-title">{t(esAufgabe ? 'foto.titleA' : 'foto.titleB')}</div>
      <p className="muted" style={{ fontSize: '0.84rem', marginBottom: 12 }}>
        {t(esAufgabe ? 'foto.subA' : 'foto.subB')}
      </p>

      {!foto && (
        <label className="foto-drop">
          <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={elegir} hidden />
          <span className="foto-ico">{esAufgabe ? '📷' : '🖼️'}</span>
          <span className="foto-cta">{t(esAufgabe ? 'foto.pickA' : 'foto.pick')}</span>
          <span className="muted" style={{ fontSize: '0.78rem' }}>{t('foto.formats')}</span>
          <span className="foto-pegar">{t(esAufgabe ? 'foto.paste' : 'foto.pasteB')}</span>
        </label>
      )}

      {thumb && (
        <div className="foto-preview">
          <img src={thumb} alt="" />
        </div>
      )}

      {foto && (
        <div className="row" style={{ gap: 10, flexWrap: 'wrap', marginTop: 12 }}>
          <button className="btn-primary" onClick={analizar} disabled={!aiOn || busy || guardando}>
            {busy
              ? t(esAufgabe ? 'foto.solving' : 'foto.describing')
              : t(esAufgabe ? 'foto.solve' : 'foto.describe')}
          </button>
          <button className="btn-ghost btn-sm" onClick={guardarSinResolver} disabled={busy || guardando}>
            {guardando ? t('foto.saving') : t('foto.savePhoto')}
          </button>
          <button className="btn-ghost btn-sm" onClick={quitar} disabled={busy || guardando} style={{ marginLeft: 'auto' }}>
            {t('foto.remove')}
          </button>
        </div>
      )}

      {!aiOn && <p className="muted" style={{ fontSize: '0.83rem', marginTop: 10 }}>{t('foto.needsLocal')}</p>}
      {(err || job.error) && <p style={{ color: 'var(--bad)', fontSize: '0.85rem', marginTop: 10 }}>{err || job.error}</p>}
      {busy && <p className="muted" style={{ fontSize: '0.83rem', marginTop: 10 }}>{t('foto.wait')}</p>}

    </div>
  );
}
