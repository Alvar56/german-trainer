import React, { useEffect, useMemo, useRef, useState } from 'react';
import { fetchNews } from '../lib/ai.js';
import { aiAvailable } from '../lib/settings.js';
import { storage } from '../lib/storage.js';
import Buscando, { BuscandoLinea } from './Buscando.jsx';
import { t, pick, getLang, localeFecha } from '../lib/i18n.js';
import { runJob, getJob, subscribe } from '../lib/aiJobs.js';

const KEY = 'news:sec';
const JOB = 'news:';
const NEWS_TABS = ['news', 'wissen', 'events', 'sport', 'wetter'];
// Noticias van mas porque se reparten en politica, vida diaria y Europa.
const CUANTAS = { news: 6, wissen: 4, events: 4, sport: 4, wetter: 1 }; // noticias: 2 política + 2 día a día + 2 Europa
// Atajos: donde vive y las otras capitales de Land que suenan en el parte.
const CIUDADES = ['Wien', 'Graz', 'Linz', 'Salzburg', 'Innsbruck', 'Klagenfurt'];
const VIEJA = 'news:last';
const VISTAS = 'news:vistas';
// Cuantos titulares recordamos por pestaña para no repetirlos. Suficiente para
// varias actualizaciones seguidas sin hinchar el prompt.
const MAX_VISTAS = 40;

// Solo para la animacion de espera: da idea de por donde anda mirando. Ninguno
// se marca como "hecho" porque no sabemos por donde va la busqueda de verdad.
const FUENTES = {
  news: ['ORF', 'Der Standard', 'Kurier', 'Die Presse', 'Krone', 'PULS 24'],
  wissen: ['ORF Science', 'Der Standard', 'Scinexx', 'Spektrum'],
  events: ['wien.info', 'Falter', 'events.at', 'Stadt Wien'],
  sport: ['ORF Sport', 'LAOLA1', 'Krone Sport', 'Sky Sport'],
  wetter: ['ZAMG / GeoSphere', 'ORF Wetter', 'wetter.at']
};

// Las pestañas de arriba. El orden es el de siempre.
const PESTANAS = [
  { id: 'news', ico: '📰', clave: 'news.tabNews' },
  { id: 'wissen', ico: '🔬', clave: 'news.tabWissen' },
  { id: 'events', ico: '🎪', clave: 'news.tabEvents' },
  { id: 'sport', ico: '⚽', clave: 'news.tabSport' },
  { id: 'wetter', ico: '🌤', clave: 'news.tabWeather' }
];

function vistasDe(seccion) {
  const todo = storage.get(VISTAS, {});
  return Array.isArray(todo?.[seccion]) ? todo[seccion] : [];
}

// Para comparar titulares: la IA a veces devuelve el mismo con otra puntuación
// o distinto uso de mayúsculas, y así se cuela como "nuevo".
function clave(t) {
  return String(t || '').toLowerCase().replace(/[^a-zäöüß0-9]+/g, ' ').trim();
}

function apuntarVistas(seccion, items) {
  const nuevas = items.map((x) => x.titel).filter(Boolean);
  if (!nuevas.length) return;
  const todo = storage.get(VISTAS, {});
  const previas = Array.isArray(todo?.[seccion]) ? todo[seccion] : [];
  // sin duplicados y las más recientes delante
  const juntas = [...nuevas, ...previas].filter((x, i, a) => a.indexOf(x) === i);
  storage.set(VISTAS, { ...todo, [seccion]: juntas.slice(0, MAX_VISTAS) });
}

// Cada pestaña se guarda por separado porque cada una se busca por separado.
// Lo que hubiera con el formato antiguo (las cuatro secciones en un solo
// objeto) se aprovecha en vez de tirarlo.
function cargar() {
  const guardado = storage.get(KEY, null);
  if (guardado) return guardado;
  const viejo = storage.get(VIEJA, null);
  if (!viejo) return {};
  const holtAm = viejo.holtAm || Date.now();
  const stand = viejo.stand || '';
  const out = {};
  for (const s of ['news', 'events', 'sport']) {
    if (viejo[s]?.length) out[s] = { seccion: s, stand, holtAm, items: viejo[s] };
  }
  if (viejo.wetter) out.wetter = { seccion: 'wetter', stand, holtAm, wetter: viejo.wetter };
  storage.set(KEY, out);
  return out;
}

// El medio no siempre viene en el JSON; el dominio de la URL siempre está.
function fuente(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, '');
  } catch {
    return '';
  }
}

// Cuando la IA no ha visto un vídeo real no se lo inventa, así que al menos
// dejamos la búsqueda hecha en YouTube con el titular alemán.
function ytSuche(titel, extra = '') {
  const q = [titel, extra].filter(Boolean).join(' ').trim();
  return 'https://www.youtube.com/results?search_query=' + encodeURIComponent(q);
}

function fmt(d, lang) {
  if (!d) return '';
  try {
    return new Date(d + 'T00:00:00').toLocaleDateString(localeFecha(lang), {
      day: 'numeric',
      month: 'long'
    });
  } catch {
    return d;
  }
}

// El parte de hoy llega con tag "heute", asi que el nombre aleman del dia se
// saca de la fecha. De paso se aprende como se llaman los dias.
const DE_TAGE = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];
function wochentag(datum) {
  const d = new Date(datum + 'T00:00:00');
  return Number.isNaN(d.getTime()) ? '' : DE_TAGE[d.getDay()];
}

// La fecha del parte va en aleman pase lo que pase con el idioma de la app:
// es contenido para aprender, no texto de la interfaz. Sale "6. September".
function fmtDe(datum) {
  const d = new Date(datum + 'T00:00:00');
  if (Number.isNaN(d.getTime())) return datum;
  return d.toLocaleDateString('de-DE', { day: 'numeric', month: 'long' });
}

function ytId(url) {
  const m = String(url || '').match(/(?:youtu\.be\/|v=|shorts\/|embed\/)([A-Za-z0-9_-]{11})/);
  return m ? m[1] : null;
}

function Video({ url, title }) {
  const id = ytId(url);
  if (!id) return null;
  return (
    <div className="news-video">
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}`}
        title={title}
        loading="lazy"
        allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}

function Woerter({ list }) {
  if (!list?.length) return null;
  return (
    <div className="news-woerter">
      <div className="muted" style={{ fontSize: '0.76rem', marginBottom: 6 }}>{t('news.vocab')}</div>
      <div className="nb-chips">
        {list.map((w, i) => (
          <span className="nb-chip voc" key={i}><strong>{w.de}</strong> — {w.es}</span>
        ))}
      </div>
    </div>
  );
}

// El vídeo es lo que se quiere ver, así que va primero y en primario; el
// artículo escrito queda detrás.
function Enlaces({ youtube, url, titel, extra, leerLabel }) {
  return (
    <div className="news-links">
      <a
        className={'news-link' + (youtube ? ' primary' : '')}
        href={youtube || ytSuche(titel, extra)}
        target="_blank"
        rel="noopener noreferrer"
      >
        {youtube ? t('news.watch') : t('news.ytSearch')} →
      </a>
      {url && (
        <a className="news-link" href={url} target="_blank" rel="noopener noreferrer">
          {leerLabel} →
        </a>
      )}
    </div>
  );
}

export default function News() {
  const [secs, setSecs] = useState(cargar);
  const [showEs, setShowEs] = useState(true);
  const [tab, setTab] = useState('news');
  const [ciudad, setCiudad] = useState(() => cargar().wetter?.wetter?.ort || 'Wien');
  const [vistas, setVistas] = useState(0); // solo para repintar al olvidar
  // El estado de cada busqueda vive en aiJobs, asi que irse a otra seccion no
  // corta los tres minutos de rastreo: al volver sigue en marcha o ya esta.
  const [jobs, setJobs] = useState(() =>
    Object.fromEntries(NEWS_TABS.map((s) => [s, getJob(JOB + s)]))
  );
  const aiOn = aiAvailable();
  const lang = getLang();
  const [sinNuevas, setSinNuevas] = useState('');
  const autoUpdated = useRef(false);

  useEffect(() => {
    const offs = NEWS_TABS.map((s) =>
      subscribe(JOB + s, (st) => setJobs((prev) => ({ ...prev, [s]: st })))
    );
    return () => offs.forEach((off) => off());
  }, []);

  // Auto-actualización a las 9am
  // IMPORTANTE: solo si no hay datos en caché — si ya hay noticias guardadas,
  // se muestran las viejas y el usuario decide cuándo refrescar. Si se lanza
  // un job en segundo plano sin que el usuario lo pida, la pantalla se pone
  // gris mientras carga y parece rota.
  useEffect(() => {
    if (!aiOn || autoUpdated.current) return;
    autoUpdated.current = true;

    function disparar() {
      const now = new Date();
      const cutoff = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0).getTime();
      const cache = storage.get(KEY, {});
      ['wetter'].forEach((s) => {
        const secData = cache[s];
        // Solo auto-actualizar el tiempo automáticamente. Las noticias son muy
        // pesadas de generar y cuelgan la IA si se lanzan todas de golpe.
        if (!secData || secData.holtAm < cutoff) {
          load(s);
        }
      });
    }

    const now = new Date();
    if (now.getHours() >= 9) {
      disparar();
    } else {
      const msHasta9 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0).getTime() - now.getTime();
      const timer = setTimeout(disparar, msHasta9);
      return () => clearTimeout(timer);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aiOn]);

  // Lo que ya está en pantalla cuenta como visto, aunque se guardara antes de
  // que existiera esta memoria. Si no, la IA no sabía que esas cuatro ya te las
  // había enseñado y te las devolvía tal cual al refrescar: era justo el caso
  // de "le doy a refrescar y me repite las mismas".
  useEffect(() => {
    NEWS_TABS.forEach((s) => {
      const guardadas = secs[s]?.items;
      if (s !== 'wetter' && guardadas?.length) apuntarVistas(s, guardadas);
    });
    setVistas((n) => n + 1);
    // solo al entrar en la sección
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function load(seccion, ortPedida) {
    const ort = seccion === 'wetter' ? (ortPedida ?? ciudad).trim() || 'Wien' : undefined;
    if (seccion === 'wetter') setCiudad(ort);
    // Lo ya enseñado se le pasa a la IA para que no vuelva con lo mismo.
    const evitar = seccion === 'wetter' ? [] : vistasDe(seccion);
    const d = await runJob(JOB + seccion, () =>
      fetchNews({ seccion, count: CUANTAS[seccion] || 4, ort, evitar })
    );
    if (!d) return;

    // Se pide a la IA que no repita, pero a veces repite igual: hay secciones
    // (ciencia, sobre todo) donde la fuente publica cuatro cosas a la semana.
    // Se filtran aquí, y si no queda nada nuevo NO se machaca lo que había: se
    // dice. Antes el refresco parecía roto porque devolvía lo mismo sin más.
    if (seccion !== 'wetter' && d.items?.length) {
      const ya = new Set(vistasDe(seccion).map(clave));
      const frescas = d.items.filter((i) => !ya.has(clave(i.titel)));
      if (!frescas.length) {
        setSinNuevas(seccion);
        return;
      }
      d.items = frescas;
    }
    setSinNuevas('');

    // OJO con el orden: guardar en disco va FUERA del setSecs. Estaba dentro,
    // y React no ejecuta la función de actualizar si el componente ya no está
    // montado — que es lo normal aquí, porque la búsqueda tarda tres minutos y
    // te vas a otra sección mientras. Resultado: la búsqueda terminaba, los
    // titulares se apuntaban como vistos... y las noticias no se guardaban en
    // ninguna parte. Volvías y no había nada nuevo, y encima esos titulares ya
    // no volverían a salir por estar marcados como vistos.
    const next = { ...storage.get(KEY, {}), [seccion]: d };
    storage.set(KEY, next);
    if (d.items?.length) apuntarVistas(seccion, d.items);
    setSecs(next);
  }

  // Por si un tema se agota o quieres volver a ver algo: borra la memoria de
  // titulares de esta pestaña.
  function olvidarVistas() {
    const todo = storage.get(VISTAS, {});
    storage.set(VISTAS, { ...todo, [tab]: [] });
    setVistas((n) => n + 1);
  }

  const cur = secs[tab] || null;
  const items = cur?.items || [];
  const wetter = secs.wetter?.wetter || null;

  const conVideo = (arr) => arr.filter((x) => x.youtube).length;
  // Una pestaña puede estar buscando mientras miras otra: que se vea.
  // Mientras busca, en el hueco del número va el puntito que late. Antes ahí
  // salía un ⏳ quieto, que decía lo mismo pero sin moverse — y desde que hay
  // animación de búsqueda, dos avisos de lo mismo en la misma pestaña sobran.
  const cuenta = (s) => {
    if (jobs[s]?.status === 'running') return <i className="tab-buscando" />;
    // Devuelve null y no un guion cuando no hay nada: ahora el dato va dentro
    // de una pastilla, y una pastilla con un guion parece una etiqueta vacía.
    // Un cero sí que se pinta: significa que se buscó y no había.
    if (s === 'wetter') return wetter ? wetter.tage.length + ' ' + t('home.days') : null;
    return secs[s]?.items?.length ?? null;
  };

  const botones = {
    news: t('news.search'),
    wissen: t('news.searchWissen'),
    events: t('news.searchEvents'),
    sport: t('news.searchSport'),
    wetter: t('news.searchWeather')
  };

  const edad = cur?.holtAm ? Math.round((Date.now() - cur.holtAm) / 3600000) : null;
  const tieneAlgo = tab === 'wetter' ? !!wetter : items.length > 0;
  const cargando = jobs[tab]?.status === 'running';
  const enMarcha = NEWS_TABS.filter((s) => jobs[s]?.status === 'running');
  const errTab = jobs[tab]?.status === 'error' ? jobs[tab].error : '';
  const sinCuota = /cuota|límite de uso|limit/i.test(errTab);
  // `vistas` solo entra en las dependencias para que el contador se repinte
  // cuando se borra la memoria; el dato sale del almacenamiento.
  const nVistas = useMemo(
    () => (tab === 'wetter' ? 0 : vistasDe(tab).length),
    [tab, vistas]
  );

  return (
    <div className="wide">
      <div className="page-head">
        <h1>{t('news.title')}</h1>
        <p>{t('news.sub')}</p>
      </div>

      {!aiOn && <div className="card" style={{ marginBottom: 16 }}>{t('aiOffLong')}</div>}

      {/* "lk-tabs-fila": aquí el dato de al lado es un número corto (4, 5 días) y
          se lee mejor a la derecha del nombre que colgando debajo. En el diario
          la misma clase lleva subtítulos largos, y ahí sí van en dos líneas.

          Las cinco iban escritas una a una y con el emoji pegado al nombre
          dentro del mismo <span>, así que no se le podía dar forma propia. */}
      <div className="lk-tabs-fila news-tabs-grid tira-resumen">
        {PESTANAS.map((p) => {
          const n = cuenta(p.id);
          return (
            <button
              key={p.id}
              className={'lk-tab' + (tab === p.id ? ' on' : '')}
              onClick={() => setTab(p.id)}
            >
              <span className="nt-ico">{p.ico}</span>
              <span className="nt-nombre">{t(p.clave)}</span>
              {n != null && <small>{n}</small>}
            </button>
          );
        })}
      </div>

      <div className="row" style={{ gap: 10, marginBottom: 18, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn-primary" onClick={() => load(tab)} disabled={!aiOn || cargando || sinCuota}>
          {cargando ? t('generating') : tieneAlgo ? t('news.refresh') : botones[tab]}
        </button>
        {tieneAlgo && (
          <button className="btn-ghost btn-sm" onClick={() => setShowEs(!showEs)}>
            {showEs ? t('hideEs') : t('showEs')}
          </button>
        )}
        {/* Lo guardado trae las traducciones ya escritas: si cambias de idioma,
            no cambian solas. Mejor decirlo que dejarte pensando que falla. */}
        {sinNuevas === tab && (
          <span className="muted" style={{ fontSize: '0.82rem' }}>{t('news.noNew')}</span>
        )}
        {tieneAlgo && cur?.lang && cur.lang !== lang && (
          <span className="muted" style={{ fontSize: '0.82rem' }}>⚠ {t('otroIdioma')}</span>
        )}
        {tieneAlgo && edad != null && (
          <span className="muted" style={{ fontSize: '0.82rem' }}>
            {t('news.updated')} {edad === 0 ? t('news.justNow') : t('news.hoursAgo', { n: edad })}
          </span>
        )}
        {tab !== 'wetter' && items.length > 0 && conVideo(items) > 0 && (
          <span className="lk-pill g">▶ {conVideo(items)} {t('news.videoFirst')}</span>
        )}
        {tab !== 'wetter' && nVistas > 0 && (
          <button className="btn-ghost btn-sm" onClick={olvidarVistas} title={t('news.forgetHint')}>
            {t('news.forget', { n: nVistas })}
          </button>
        )}
        {enMarcha.filter((s) => s !== tab).length > 0 && (
          <span className="muted" style={{ fontSize: '0.82rem', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            {/* El mismo puntito que llevan las pestañas: es lo mismo que está
                pasando, así que se dice igual. */}
            <i className="tab-buscando" />
            {t('news.alsoRunning', { n: enMarcha.filter((s) => s !== tab).length })}
          </span>
        )}
      </div>

      {tab === 'wetter' && (
        <div className="card wetter-ciudad">
          {/* El `flex: 1 1 220px` que llevaba aquí escrito a mano era lo que
              estiraba la caja hasta comerse la tarjeta. El reparto lo hace
              ahora .wetter-ciudad, en el css, junto al resto de la fila. */}
          <label className="lied-field">
            {t('news.city')}
            <input
              className="ask-input"
              type="text"
              value={ciudad}
              onChange={(e) => setCiudad(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !cargando && aiOn && !sinCuota && load('wetter')}
              placeholder={t('news.cityPh')}
              disabled={!aiOn || cargando || sinCuota}
            />
          </label>
          <div className="lied-sug" style={{ margin: 0 }}>
            {CIUDADES.map((c) => (
              <button
                key={c}
                className={'ask-chip' + (c === ciudad ? ' on' : '')}
                onClick={() => load('wetter', c)}
                disabled={!aiOn || cargando || sinCuota}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quedarse sin cuota no es un error de la app: no hay nada que arreglar
          ni que reintentar, solo esperar. Se avisa en tono neutro y sin el rojo
          de alarma, y lo de arriba (las noticias guardadas) se sigue viendo. */}
      {errTab && (
        <div
          className="card"
          style={{
            marginBottom: 16,
            borderColor: sinCuota ? 'var(--border)' : 'var(--bad)',
            background: sinCuota ? 'transparent' : 'var(--bad-bg)'
          }}
        >
          {sinCuota ? '⏳ ' : ''}
          {errTab}
          {sinCuota && (
            <p className="muted" style={{ fontSize: '0.82rem', margin: '6px 0 0' }}>
              {pick(
                'Mientras tanto sigues teniendo abajo lo último que se descargó, y toda la gramática y el vocabulario funcionan sin IA.',
                'You still have the last download below, and all the grammar and vocabulary work without AI.'
              )}
            </p>
          )}
        </div>
      )}

      {/* Si hay un job activo pero YA TENEMOS datos en caché, los mostramos:
          así la pantalla nunca queda gris mientras se actualiza en segundo plano. */}
      {cargando && !tieneAlgo && (
        <Buscando
          icono={tab === 'wetter' ? '🌤' : '📰'}
          titulo={tab === 'wetter' ? t('wait.wetterTitle') : t('wait.newsTitle')}
          pasos={[t('wait.news1'), t('wait.news2'), t('wait.news3'), t('wait.news4'), t('wait.news5')]}
          fuentes={FUENTES[tab] || FUENTES.news}
        />
      )}
      {cargando && tieneAlgo && (
        // En el tiempo no se buscan noticias: decirlo ahi confundia.
        <BuscandoLinea texto={tab === 'wetter' ? t('wait.wetterTitle') : t('wait.newsTitle')} />
      )}

      {!cargando && !tieneAlgo && !errTab && (
        <div className="card center"><p className="muted">{t('news.emptyTab')}</p></div>
      )}

      {tieneAlgo && (tab === 'news' || tab === 'wissen') && (
        <div className="stack" style={{ gap: 18 }}>
          {items.map((n, i) => (
            <article className="card news-card" key={i}>
              <div className="news-meta">
                {n.ort && <span className="lk-pill k">{n.ort}</span>}
                {n.datum && <span className="muted">{fmt(n.datum, lang)}</span>}
                {n.quelle && <span className="muted">· {n.quelle}</span>}
                {n.youtube && <span className="lk-pill g">▶ Video</span>}
              </div>
              <h2 className="news-titel">{n.titel}</h2>
              {showEs && n.titelEs && <p className="news-titel-es">{n.titelEs}</p>}
              <Video url={n.youtube} title={n.titel} />
              <p className="news-de">{n.de}</p>
              {showEs && n.es && <p className="news-es">{n.es}</p>}
              <Woerter list={n.woerter} />
              <Enlaces
                youtube={n.youtube}
                url={n.url}
                titel={n.titel}
                extra={n.ort}
                leerLabel={`${t('news.read')} ${n.quelle || fuente(n.url)}`}
              />
            </article>
          ))}
        </div>
      )}

      {tieneAlgo && tab === 'events' && (
        <div className="stack" style={{ gap: 18 }}>
          {items.map((e, i) => (
            <article className="card news-card" key={i}>
              <div className="news-meta">
                <span className="lk-pill k">Wien</span>
                {e.youtube && <span className="lk-pill g">▶ Video</span>}
              </div>
              <h2 className="news-titel">{e.titel}</h2>
              {showEs && e.titelEs && <p className="news-titel-es">{e.titelEs}</p>}

              <div className="event-facts">
                {e.wann && <div><span className="ef-l">{t('news.when')}</span><span>{e.wann}</span></div>}
                {e.wo && <div><span className="ef-l">{t('news.where')}</span><span>{e.wo}</span></div>}
                {e.preis && <div><span className="ef-l">{t('news.price')}</span><span>{e.preis}</span></div>}
              </div>

              <Video url={e.youtube} title={e.titel} />
              {e.was && <p className="news-de">{e.was}</p>}
              {showEs && e.wasEs && <p className="news-es">{e.wasEs}</p>}
              <Woerter list={e.woerter} />
              <Enlaces
                youtube={e.youtube}
                url={e.url}
                titel={e.titel}
                extra="Wien"
                leerLabel={`🔗 ${lang === 'en' ? 'Event page' : 'Página del evento'}`}
              />
            </article>
          ))}
        </div>
      )}

      {tieneAlgo && tab === 'sport' && (
        <div className="stack" style={{ gap: 18 }}>
          {items.map((s, i) => (
            <article className="card news-card" key={i}>
              <div className="news-meta">
                {s.sportart && <span className="lk-pill k">{s.sportart}</span>}
                {s.wann && <span className="muted">{s.wann}</span>}
                {s.youtube && <span className="lk-pill g">▶ Video</span>}
              </div>
              <h2 className="news-titel">{s.titel}</h2>
              {showEs && s.titelEs && <p className="news-titel-es">{s.titelEs}</p>}

              {s.ergebnis && (
                <div className="sport-score">
                  <span className="ss-l">{t('news.result')}</span>
                  <span className="ss-v">{s.ergebnis}</span>
                </div>
              )}

              <Video url={s.youtube} title={s.titel} />
              {s.was && <p className="news-de">{s.was}</p>}
              {showEs && s.wasEs && <p className="news-es">{s.wasEs}</p>}

              {s.naechstes && (
                <p className="sport-next">
                  <span className="ef-l">{t('news.next')}</span> {s.naechstes}
                </p>
              )}

              <Woerter list={s.woerter} />
              <Enlaces
                youtube={s.youtube}
                url={s.url}
                titel={s.titel}
                extra={s.sportart}
                leerLabel={`${t('news.read')} ${fuente(s.url)}`}
              />
            </article>
          ))}
        </div>
      )}

      {tieneAlgo && tab === 'wetter' && wetter && (
        <div className="stack" style={{ gap: 18 }}>
          {wetter.hinweis && (
            <div className="card wetter-warn">
              <span className="falle-ico">⚠</span>
              <div>
                <strong>{t('news.warning')}</strong>
                <p className="news-de" style={{ marginTop: 4 }}>{wetter.hinweis}</p>
                {showEs && wetter.hinweisEs && <p className="news-es">{wetter.hinweisEs}</p>}
              </div>
            </div>
          )}

          {/* En alemán, como el resto de la tarjeta del tiempo */}
          <div className="sec-title wetter-titel">
            <h2>Wetter in {wetter.ort}</h2>
          </div>

          <div className="wetter-grid">
            {wetter.tage.map((d, i) => (
              <div className={'card wetter-tag' + (i === 0 ? ' heute' : '')} key={i}>
                {/* "heute" también en alemán: la tarjeta entera es contenido */}
                <div className="wt-tag">{i === 0 ? 'heute' : d.tag || wochentag(d.datum)}</div>
                {d.datum && (
                  <div className="wt-datum">
                    {i === 0 && wochentag(d.datum) ? wochentag(d.datum) + ', ' : ''}
                    {fmtDe(d.datum)}
                  </div>
                )}
                <div className="wt-symbol">{d.symbol}</div>
                <div className="wt-temp">
                  <span className="max">{d.max != null ? d.max + '°' : '—'}</span>
                  <span className="min">{d.min != null ? d.min + '°' : ''}</span>
                </div>
                {d.text && <p className="wt-text">{d.text}</p>}
                {showEs && d.textEs && <p className="wt-text es">{d.textEs}</p>}
              </div>
            ))}
          </div>

          {wetter.woerter.length > 0 && (
            <div className="card">
              <div className="lk-block-title">{t('news.weatherVocab')}</div>
              <div className="nb-chips" style={{ marginTop: 8 }}>
                {wetter.woerter.map((w, i) => (
                  <span className="nb-chip voc" key={i}><strong>{w.de}</strong> — {w.es}</span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
