import React, { useEffect, useRef, useState } from 'react';
import Sugerencias from './Sugerencias.jsx';
import { suggestSong, savedSongs, toggleSave, isSaved, ytId, GENRES, getNota, setNota, tieneNota } from '../lib/lieder.js';
import { aiAvailable } from '../lib/settings.js';
import { t, getLang } from '../lib/i18n.js';
import { runJob, setJobResult, clearJob } from '../lib/aiJobs.js';
import NotaRica from './NotaRica.jsx';
import Escuchar from './Escuchar.jsx';
import { useAiJob } from '../lib/useAiJob.js';
import Buscando from './Buscando.jsx';

const JOB = 'lieder';

// Atajos para no tener que escribir: artistas que se cantan claro y se estudian bien.
// Mas nombres de los que caben a la vez: se enseña un puñado distinto cada
// vez que entras, para no acabar pidiendo siempre los mismos diez.
const ARTISTAS = [
  'Nena', 'Andreas Bourani', 'AnnenMayKantereit', 'Wir sind Helden',
  'Herbert Grönemeyer', 'Wanda', 'Bilderbuch', 'Silbermond', 'Mark Forster', 'Falco',
  'Die Ärzte', 'Die Toten Hosen', 'Cro', 'Clueso', 'Sportfreunde Stiller',
  'Juli', 'Revolverheld', 'Max Giesinger', 'LEA', 'Bausa',
  'Seiler und Speer', 'Christina Stürmer', 'Rammstein', 'Peter Fox',
  'Element of Crime', 'Sarah Connor', 'Udo Jürgens', 'Voxxclub'
];

export default function Lieder() {
  // La cancion vive en aiJobs: al irte a Vocabulario y volver sigue puesta, y
  // si la estaba buscando cuando te fuiste, la busqueda no se corta.
  const job = useAiJob(JOB);
  const busy = job.status === 'running';
  const song = job.status === 'done' ? job.result : null;
  const err = job.status === 'error' ? job.error : '';
  const [q, setQ] = useState(() => job.meta?.q || '');
  const [genre, setGenre] = useState('any');
  const [niveau, setNiveau] = useState('A2');
  const [saved, setSaved] = useState(() => savedSongs());
  const [tick, setTick] = useState(0);
  const [nota, setNotaTexto] = useState('');
  const [notaOk, setNotaOk] = useState(false);
  const avisoNota = useRef(null);
  const aiOn = aiAvailable();
  const lang = getLang();

  // Al abrir otra canción se trae su nota; cada una tiene la suya.
  useEffect(() => {
    setNotaTexto(getNota(song?.id));
    setNotaOk(false);
  }, [song?.id]);

  useEffect(() => () => clearTimeout(avisoNota.current), []);

  function escribirNota(texto) {
    setNotaTexto(texto);
    setNota(song?.id, texto);
    setNotaOk(true);
    clearTimeout(avisoNota.current);
    avisoNota.current = setTimeout(() => setNotaOk(false), 1600);
  }

  async function pedir(query = '') {
    const r = await runJob(JOB, () => suggestSong({ niveau, genre, query }), { q: query });
    if (r) window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function abrirGuardada(s) {
    setJobResult(JOB, s, { q: s.titel });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function guardar() {
    toggleSave(song);
    setSaved(savedSongs());
    setTick(tick + 1);
  }

  // Cerrar la explicacion para quedarse solo con la lista de guardadas.
  function cerrar() {
    clearJob(JOB);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function quitarGuardada(e, id) {
    e.stopPropagation();
    toggleSave({ id });
    setSaved(savedSongs());
    setTick(tick + 1);
  }

  const yt = song ? ytId(song.youtube) : null;

  return (
    <div className="wide">
      <div className="page-head">
        <h1>{t('lieder.title')}</h1>
        <p>{t('lieder.sub')}</p>
      </div>

      <div className="card lied-controls">
        <div className="ask-row" style={{ width: '100%' }}>
          <input
            className="ask-input"
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !busy && q.trim() && pedir(q.trim())}
            placeholder={t('lieder.searchPh')}
            disabled={!aiOn || busy}
          />
          <button className="btn-primary" onClick={() => pedir(q.trim())} disabled={!aiOn || busy || !q.trim()}>
            {busy ? t('generating') : t('lieder.search')}
          </button>
        </div>

        {/* Ideas, filtros y "otra canción" van en la MISMA fila. Antes eran
            dos bloques y cada etiqueta se ponia encima de su desplegable, o
            sea cuatro renglones para cuatro controles. El panel de las ideas,
            cuando se abre, sigue cayendo debajo de todo: se lo da .ask-pies
            con flex-basis 100% y order 1. */}
        <div className="ask-pies lied-pies">
          <Sugerencias
            opciones={ARTISTAS}
            disabled={!aiOn || busy}
            onElegir={(a) => { setQ(a); pedir(a); }}
          />
          <label className="lied-field">
            {t('lieder.filterGenre')}
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              {GENRES.map((g) => (
                <option key={g.id} value={g.id}>{lang === 'en' ? g.en : g.es}</option>
              ))}
            </select>
          </label>
          <label className="lied-field">
            {t('lieder.filterLevel')}
            <select value={niveau} onChange={(e) => setNiveau(e.target.value)}>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
            </select>
          </label>
          <button className="btn-ghost" onClick={() => { setQ(''); pedir(''); }} disabled={!aiOn || busy}>
            {busy ? t('lieder.searching') : song ? t('lieder.another') : t('lieder.new')}
          </button>
        </div>
      </div>

      {!aiOn && <div className="card" style={{ marginTop: 14 }}>{t('aiOffLong')}</div>}
      {err && (
        <div className="card" style={{ marginTop: 14, borderColor: 'var(--bad)', background: 'var(--bad-bg)' }}>
          {err}
        </div>
      )}

      {busy && (
        <Buscando
          icono="🎵"
          titulo={t('wait.songTitle')}
          pasos={[t('wait.song1'), t('wait.song2'), t('wait.song3'), t('wait.song4')]}
          fuentes={['YouTube', 'Genius', 'Songtexte.com', 'Discogs']}
        />
      )}

      {song && !busy && (
        <div className="stack" style={{ marginTop: 18 }}>
          <div className="card lied-head">
            <div className="lied-head-txt">
              <h2 className="lied-titel">{song.titel}</h2>
              <div className="lied-artist">{song.artist}</div>
              <div className="lied-meta">
                {/* Primero las cortas, juntas: si no, la del genero las separa
                    y al estrechar la ventana el año se queda solo en una fila. */}
                {song.jahr && <span className="pill">{song.jahr}</span>}
                {song.land && <span className="pill">{song.land}</span>}
                {song.genre && <span className="lk-pill k">{song.genre}</span>}
                {song.niveau && <span className="lk-pill g">{song.niveau}</span>}
              </div>
            </div>
            <div className="lied-acciones">
              <button
                className={'lied-save' + (isSaved(song.id) ? ' on' : '')}
                onClick={guardar}
                title={isSaved(song.id) ? t('lieder.unsave') : t('lieder.save')}
              >
                {isSaved(song.id) ? '★' : '☆'}
                <span>{isSaved(song.id) ? t('lieder.unsave') : t('lieder.save')}</span>
              </button>
              <button className="lied-cerrar" onClick={cerrar} title={t('lieder.close')}>
                ✕
              </button>
            </div>
          </div>

          {song.lang && song.lang !== lang && (
            <p className="muted" style={{ fontSize: '0.82rem', marginTop: -4 }}>⚠ {t('otroIdioma')}</p>
          )}

          {yt && (
            <div className="news-video">
              {/* cc_load_policy=1: los subtítulos salen puestos de entrada */}
              <iframe
                src={`https://www.youtube-nocookie.com/embed/${yt}?cc_load_policy=1&cc_lang_pref=de&hl=de`}
                title={song.titel}
                loading="lazy"
                allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}

          <div className="card lied-notas">
            <div className="row spread" style={{ alignItems: 'baseline' }}>
              <div className="lk-block-title" style={{ margin: 0 }}>📝 {t('lieder.notes')}</div>
              {notaOk && <small className="lied-nota-ok">{t('lieder.notesSaved')}</small>}
            </div>
            <NotaRica
              className="lied-nota-caja"
              value={nota}
              placeholder={t('lieder.notesPh')}
              onChange={escribirNota}
            />
          </div>

          <div className="card lied-mitlesen">
            <span className="diary-lob-ico">📝</span>
            <div>
              <strong>{t('lieder.follow')}</strong>
              <ol className="lied-steps">
                <li>{t('lieder.follow1')}</li>
                <li>{t('lieder.follow2')}</li>
                <li>{t('lieder.follow3')}</li>
              </ol>
              <div className="news-links" style={{ marginTop: 12 }}>
                {song.lyricsUrl && (
                  <a className="news-link" href={song.lyricsUrl} target="_blank" rel="noopener noreferrer">
                    {t('lieder.lyrics')} →
                  </a>
                )}
                {song.youtube && (
                  <a className="news-link" href={song.youtube} target="_blank" rel="noopener noreferrer">
                    {t('lieder.listen')} →
                  </a>
                )}
              </div>
            </div>
          </div>

          {song.worumGehtEs && (
            <div className="card">
              <div className="lk-block-title">🎧 {t('lieder.about')}</div>
              <p className="lk-expl" style={{ marginBottom: 0 }}>{song.worumGehtEs}</p>
            </div>
          )}

          {song.kontext && (
            <div className="card">
              <div className="lk-block-title">🕰 {t('lieder.kontext')}</div>
              <p className="lk-expl" style={{ marginBottom: 0 }}>{song.kontext}</p>
            </div>
          )}

          {/* La pronunciación, arriba del todo y antes que el vocabulario: es
              lo único que una canción da y el resto de la app no. Vocabulario
              y gramática ya los tienes en Wortschatz y Grammatik; alemán
              cantado por un nativo, en ningún otro sitio. */}
          {song.aussprache && (
            <div className="card">
              <div className="lk-block-title">🗣 {t('lieder.aussprache')}</div>
              {song.aussprache.acento && (
                <p className="lk-expl">{song.aussprache.acento}</p>
              )}
              {song.aussprache.puntos.length > 0 && (
                <div className="stack lied-pron" style={{ gap: 10, marginTop: 4 }}>
                  {song.aussprache.puntos.map((p, i) => (
                    <div key={i} className="lied-pron-fila">
                      <div className="lpf-par">
                        <span className="lpf-de">{p.de}</span>
                        <span className="lpf-flecha">→</span>
                        <span className="lpf-suena">{p.suena}</span>
                        <Escuchar texto={p.de} className="lpf-say" frase />
                      </div>
                      {p.porque && <p className="lpf-porque">{p.porque}</p>}
                    </div>
                  ))}
                </div>
              )}
              {song.aussprache.imitar.length > 0 && (
                <>
                  <div className="lk-block-title" style={{ marginTop: 14, fontSize: '0.86rem' }}>
                    🔁 {t('lieder.imitar')}
                  </div>
                  <ul className="pitfalls" style={{ marginTop: 6 }}>
                    {song.aussprache.imitar.map((x, i) => <li key={i}>{x}</li>)}
                  </ul>
                </>
              )}
            </div>
          )}

          {song.wortschatz.length > 0 && (
            <div className="card">
              <div className="lk-block-title">📚 {t('lieder.vocab')}</div>
              <table className="lk-words" style={{ marginTop: 8 }}>
                <tbody>
                  {song.wortschatz.map((w, i) => (
                    <tr key={i}>
                      <td className="de">{w.de}</td>
                      <td className="es">
                        {w.es}
                        {w.nota && <span className="lied-nota"> · {w.nota}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {song.grammatik.length > 0 && (
            <div className="card">
              <div className="lk-block-title">📖 {t('lieder.grammar')}</div>
              <div className="stack" style={{ gap: 9, marginTop: 8 }}>
                {song.grammatik.map((g, i) => (
                  <div key={i}>
                    <strong style={{ fontSize: '0.9rem' }}>{g.punkt}</strong>
                    <p className="muted" style={{ fontSize: '0.85rem', lineHeight: 1.5 }}>{g.erklaerung}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {song.hoertipps.length > 0 && (
            <div className="card diary-next">
              <span className="diary-lob-ico">💡</span>
              <div>
                <strong>{lang === 'en' ? 'How to listen to it' : 'Cómo escucharla'}</strong>
                <ul className="pitfalls" style={{ marginTop: 6 }}>
                  {song.hoertipps.map((h, i) => <li key={i}>{h}</li>)}
                </ul>
              </div>
            </div>
          )}

          {song.artistInfo && (
            <div className="card">
              <div className="lk-block-title">🎤 {t('lieder.artist')}</div>
              <p className="lk-expl" style={{ marginBottom: 0 }}>{song.artistInfo}</p>
            </div>
          )}

          {song.warum && (
            <div className="card lk-all lied-warum">
              <div>
                <strong>{t('lieder.why')}</strong>
                <p className="muted" style={{ fontSize: '0.86rem', marginTop: 3 }}>{song.warum}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Sin cancion abierta, si ya tienes guardadas lo util es la lista, no el
          cartel de "pulsa el boton". */}
      {!song && !busy && !err && saved.length === 0 && (
        <div className="card center" style={{ marginTop: 16 }}>
          <p className="muted">{t('lieder.empty')}</p>
        </div>
      )}

      {saved.length > 0 && (
        <>
          <div className="sec-title" style={{ marginTop: song ? 32 : 20 }}>
            <h2>{t('lieder.saved')}</h2>
            <span className="muted">{saved.length}</span>
          </div>
          <div className="topic-grid">
            {saved.map((s) => (
              <div className="card topic-open lied-guardada" key={s.id} onClick={() => abrirGuardada(s)} role="button" tabIndex={0}
                onKeyDown={(ev) => ev.key === 'Enter' && abrirGuardada(s)}>
                <div className="flex-min">
                  <div className="t-title">{s.titel}</div>
                  <div className="t-blurb">
                    {tieneNota(s.id) && <span title={t('lieder.notes')}>📝 </span>}
                    {s.artist}{s.jahr ? ' · ' + s.jahr : ''}{s.genre ? ' · ' + s.genre : ''}
                  </div>
                </div>
                <button
                  className="lied-quitar"
                  title={t('lieder.unsave')}
                  onClick={(ev) => quitarGuardada(ev, s.id)}
                >
                  ★
                </button>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
