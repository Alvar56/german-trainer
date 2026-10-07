import React, { useEffect, useRef, useState } from 'react';
import { cobrarUnaVezAlDia, MONEDAS_NOTIZBUCH } from '../lib/monedas.js';
import { t, pick, getLang, esOtroIdioma } from '../lib/i18n.js';
import { SIN_IA } from '../lib/modo.js';
import { getNote, updateNote, deleteNote, fotosDeNota as listaFotos } from '../lib/notebook.js';
import { BAENDE, bandLabel, getLektion, lektionLabel } from '../lib/kursbuch/index.js';
import { cleanNotes, generateNotebookItems } from '../lib/ai.js';
import { aiAvailable } from '../lib/settings.js';
import NotePhoto from './NotePhoto.jsx';
import { ensureJob, clearJob } from '../lib/aiJobs.js';
import { useAiJob } from '../lib/useAiJob.js';
import Umlaut from './Umlaut.jsx';

function parseCleanNotes(value) {
  const sections = [];
  const labels = [
    { id: 'summary', match: /^(summary|resumen|zusammenfassung|überblick|overview)$/i },
    { id: 'grammar', match: /^(grammar|gramática|gramatica|grammatik)$/i },
    { id: 'vocabulary', match: /^(vocabulary|vocabulario|wortschatz|vokabeln)$/i },
    { id: 'communication', match: /^(communication|comunicación|comunicacion|kommunikation|kommunikative ausdrücke)$/i },
    { id: 'useful', match: /^(questions?|useful notes?|useful info(?:rmation)?|key points|información útil|informacion util|puntos clave|claves útiles|claves utiles|merkhilfen)$/i },
    { id: 'doubts', match: /^(doubts?|dudas|fragen|zweifel|uncertainties)$/i }
  ];
  let current = null;

  for (const sourceLine of String(value || '').split(/\r?\n/)) {
    const line = sourceLine.trim();
    if (!line) continue;
    const cells = line.includes('|')
      ? line.replace(/^\|/, '').replace(/\|$/, '').split('|').map((cell) => cell.trim())
      : /\t/.test(line) ? line.split(/\t+/).map((cell) => cell.trim()) : null;
    const heading = (cells?.length === 1 ? cells[0] : line).replace(/^#{1,6}\s*/, '').replace(/:$/, '').trim();
    const sectionType = labels.find(({ match }) => match.test(heading));
    if (sectionType) {
      current = { id: sectionType.id, items: [] };
      sections.push(current);
      continue;
    }

    if (cells?.length > 1) {
      const values = cells.filter(Boolean);
      if (!values.length || values.every((cell) => /^:?-{2,}:?$/.test(cell))) continue;
      const header = values.join(' ').toLowerCase();
      if (/^(german|deutsch|word|term)\s+(translation|meaning|übersetzung|significado)$/.test(header)) continue;
      if (/^(question|questions|original|wrong term)\s+(answer|correction|correct form|meaning)$/.test(header)) continue;
      if (!current) {
        current = { id: 'notes', items: [] };
        sections.push(current);
      }
      const item = current.id === 'vocabulary'
        ? `${values[0]} = ${values.slice(1).join(' — ')}`
        : current.id === 'useful' && values.length > 1
          ? `${values.slice(0, -1).join(' — ')} → ${values.at(-1)}`
          : values.join(' — ');
      if (item) current.items.push(item);
      continue;
    }
    if (!current) {
      current = { id: 'notes', items: [] };
      sections.push(current);
    }
    const item = line.replace(/^(?:[-*•]|\d+[.)])\s+/, '').trim();
    if (item) current.items.push(item);
  }

  return sections.filter((section) => section.items.length > 0);
}

function renderCleanExamples(value, fromStart = false) {
  const text = String(value || '');
  // En las reglas, los ejemplos alemanes van después de dos puntos o una
  // barra y su traducción aparece justo después, entre paréntesis. En
  // Información útil, el texto a la derecha de la flecha ya empieza por el
  // ejemplo, por eso también se permite reconocerlo desde el principio.
  const pattern = fromStart
    ? /(^|[:/]\s*)([^:()/]*?[.!?])(\s*)(\([^()]*\))/g
    : /([:/]\s*)([^:()/]*?[.!?])(\s*)(\([^()]*\))/g;
  const parts = [];
  let cursor = 0;
  let key = 0;
  for (const match of text.matchAll(pattern)) {
    const [whole, boundary, example, gap, translation] = match;
    const start = match.index;
    if (start > cursor) parts.push(text.slice(cursor, start));
    parts.push(
      boundary,
      <em key={'example-' + key++}>{example}</em>,
      gap,
      translation
    );
    cursor = start + whole.length;
  }
  if (!parts.length) return text;
  if (cursor < text.length) parts.push(text.slice(cursor));
  return parts;
}

function CleanNotesView({ value }) {
  const sections = parseCleanNotes(value);
  const labels = {
    summary: pick('Resumen', 'Summary'),
    grammar: pick('Gramática', 'Grammar'),
    vocabulary: pick('Vocabulario', 'Vocabulary'),
    communication: pick('Comunicación', 'Communication'),
    useful: pick('Información útil', 'Useful info'),
    doubts: pick('Dudas', 'Doubts'),
    notes: pick('Apuntes', 'Notes')
  };

  return (
    <div className="nb-clean-sections">
      {sections.map((section, sectionIndex) => {
        const label = labels[section.id] || labels.notes;
        return (
          <section className={'nb-clean-section nb-clean-section-' + section.id} key={section.id + sectionIndex}>
            <h4 className="nb-clean-heading">
              <span className={'nb-clean-label nb-clean-label-' + section.id}>{label}</span>
            </h4>
            {section.id === 'vocabulary' ? (
              <table className="nb-clean-table">
                <thead>
                  <tr>
                    <th scope="col">{pick('Alemán', 'German')}</th>
                    <th scope="col">{pick('Traducción', 'Translation')}</th>
                  </tr>
                </thead>
                <tbody>
                  {section.items.map((item, itemIndex) => {
                    const splitAt = item.search(/\s(?:=|→)\s/);
                    const word = splitAt < 0 ? item : item.slice(0, splitAt).trim();
                    const meaning = splitAt < 0 ? '' : item.slice(splitAt).replace(/^\s*(?:=|→)\s*/, '').trim();
                    return <tr key={itemIndex}><td>{word}</td><td>{meaning}</td></tr>;
                  })}
                </tbody>
              </table>
            ) : (
              <div className="nb-clean-items">
                {section.items.map((item, itemIndex) => {
                  const arrowAt = section.id === 'useful' ? item.indexOf('→') : -1;
                  if (arrowAt >= 0) {
                    return (
                      <p className="nb-clean-item nb-clean-useful-item" key={itemIndex}>
                        <span>{item.slice(0, arrowAt).trim()}</span>
                        <span className="nb-clean-useful-arrow">→</span>
                        <span>{renderCleanExamples(item.slice(arrowAt + 1).replace(/^\s*/, ''), true)}</span>
                      </p>
                    );
                  }
                  return <p className="nb-clean-item" key={itemIndex}>{renderCleanExamples(item)}</p>;
                })}
              </div>
            )}
          </section>
        );
      })}
    </div>
  );
}

export default function NotebookEntry({ noteId, onBack, onDeleted, onReview }) {
  const [note, setNote] = useState(() => getNote(noteId));
  const [raw, setRaw] = useState(note?.raw || '');
  const [title, setTitle] = useState(note?.title || '');
  const [showBookInfo, setShowBookInfo] = useState(false);
  // Pasar a limpio y generar ejercicios tardan un par de minutos, y antes
  // vivian en el estado de esta pantalla: irte a otra seccion la desmontaba y
  // te quedabas sin saber si seguia o no. Ahora van por el gestor de trabajos,
  // que vive fuera de React: puedes irte, volver, y sigue.
  const JOB_CLEAN = `nb:clean:${noteId}`;
  const JOB_ITEMS = `nb:items:${noteId}`;
  const jobClean = useAiJob(JOB_CLEAN);
  const jobItems = useAiJob(JOB_ITEMS);
  const limpiando = jobClean.status === 'running';
  const generando = jobItems.status === 'running';
  const busy = limpiando ? 'clean' : generando ? 'items' : '';
  const [err, setErr] = useState('');
  const saveT = useRef(null);
  const area = useRef(null);
  const aiOn = aiAvailable();

  useEffect(() => () => clearTimeout(saveT.current), []);

  // Al terminar se guarda en la nota, aunque hayas estado fuera: el efecto
  // corre en cuanto vuelves. Y se cierra el trabajo, para que no se reaplique.
  useEffect(() => {
    if (jobClean.status !== 'done' || !jobClean.result) return;
    setNote(updateNote(noteId, { clean: jobClean.result, cleanAt: Date.now(), cleanLang: getLang() }));
    // La moneda, solo la primera limpieza de esta nota y una vez al dia.
    if (jobClean.meta?.primera) cobrarUnaVezAlDia('notizbuch', MONEDAS_NOTIZBUCH);
    clearJob(JOB_CLEAN);
  }, [jobClean.status, JOB_CLEAN]);

  useEffect(() => {
    if (jobItems.status !== 'done' || !jobItems.result) return;
    setNote(updateNote(noteId, { items: jobItems.result, itemsAt: Date.now(), itemsLang: getLang() }));
    clearJob(JOB_ITEMS);
  }, [jobItems.status, JOB_ITEMS]);

  if (!note) {
    return (
      <div className="card center stack">
        <p>{t('nb.notFound')}</p>
        <button className="btn-ghost" onClick={onBack}>
          {t('back')}
        </button>
      </div>
    );
  }

  const lektion = getLektion(note.lektionId);
  // El fallo puede venir de esta pantalla o del trabajo que corrio por fuera.
  const fallo = err || (jobClean.status === 'error' ? jobClean.error : '') ||
    (jobItems.status === 'error' ? jobItems.error : '');

  function persist(patch) {
    const next = updateNote(note.id, patch);
    setNote(next);
    return next;
  }

  function onRawChange(v) {
    setRaw(v);
    clearTimeout(saveT.current);
    saveT.current = setTimeout(() => persist({ raw: v }), 500);
  }

  function doClean() {
    setErr('');
    if (busy) return;
    persist({ raw });
    // ensureJob y no runJob: si ya se esta limpiando, se engancha al que corre
    // en vez de arrancar un segundo `claude` para lo mismo.
    // La primera limpieza de la nota paga moneda; viaja con el trabajo porque
    // quien la cobra es el efecto, que puede correr minutos despues.
    ensureJob(JOB_CLEAN, () => cleanNotes({ raw, lektion }), { primera: !note?.clean });
  }

  function doItems() {
    setErr('');
    if (busy) return;
    persist({ raw });
    // Los ejercicios fotografiados de ESTA nota, no los de otros días: se
    // repasa el día concreto, no el cuaderno entero.
    const ejercicios = listaFotos(note, 'aufgabe').flatMap((a) =>
      (a.bloecke?.length ? a.bloecke : [{ anweisung: '', aufgaben: a.aufgaben || [] }]).flatMap((b) =>
        (b.aufgaben || [])
          .filter((it) => it.frage && it.antwort)
          .map((it) => ({ anweisung: b.anweisung || '', frage: it.frage, antwort: it.antwort }))
      )
    );
    ensureJob(JOB_ITEMS, () =>
      generateNotebookItems({ raw, clean: note.clean, lektion, count: 20, ejercicios })
    );
  }

  function remove() {
    if (!window.confirm(t('nb.confirmDel'))) return;
    deleteNote(note.id);
    onDeleted();
  }

  return (
    <div className="reading stack">
      <button className="link-btn volver-arriba" onClick={onBack}>
        <span className="fl-atras">◂</span> Notizbuch
      </button>

      <input
        className="nb-title-input"
        placeholder={t('nb.titlePh')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => title !== note.title && persist({ title })}
      />

      <div className="nb-meta">
        <label className="nb-field">
          {t('nb.date')}
          <input type="date" value={note.date} onChange={(e) => persist({ date: e.target.value })} />
        </label>
        <label className="nb-field">
          {t('nb.lesson')}
          <select value={note.lektionId || ''} onChange={(e) => persist({ lektionId: e.target.value })}>
            <option value="">{t('nb.noLesson')}</option>
            {BAENDE.map((b) => (
              <optgroup key={b.id} label={bandLabel(b)}>
                {b.lektionen.map((l) => (
                  <option key={l.id} value={l.id}>
                    {lektionLabel(l)}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </label>
        {/* Borrar, en la fila de la fecha y a la derecha. Estaba al final de
            la página, donde en la versión sin IA se quedaba solo en una fila
            entera para él y había que bajar hasta abajo para verlo. */}
        <button className="btn-ghost btn-sm danger nb-borrar" onClick={remove}>{t('delete')}</button>
      </div>

      {lektion && (lektion.grammatik.length > 0 || lektion.woerter.length > 0) && (
        <div
          className="card"
          style={{
            padding: showBookInfo ? '14px 16px' : '10px 16px',
            margin: '12px 0',
            transition: 'all 0.2s ease',
            cursor: showBookInfo ? 'default' : 'pointer'
          }}
          onClick={!showBookInfo ? () => setShowBookInfo(true) : undefined}
        >
          <div
            style={{
              fontSize: '0.84rem',
              fontWeight: 500,
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: 16,
              userSelect: 'none'
            }}
          >
            <span style={{ display: 'flex', alignItems: 'center', gap: 12, color: 'var(--text-2)', flexWrap: 'wrap' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <span>📖</span>
                <span>{t('nb.fromBook', { band: lektion.bandName })}</span>
              </span>
              {!showBookInfo && (
                <span className="ask-chip" style={{ fontSize: '0.74rem', padding: '3px 10px', margin: '0 8px', opacity: 0.85 }}>
                  {lektion.woerter.length + lektion.grammatik.length + (lektion.kommunikation?.length || 0)} {pick('contenidos', 'items')}
                </span>
              )}
            </span>
            <button
              className="btn-ghost btn-sm"
              style={{ padding: '3px 12px', fontSize: '0.78rem', height: 'auto', minHeight: 'auto', margin: 0, marginLeft: 'auto', flexShrink: 0 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowBookInfo(!showBookInfo);
              }}
            >
              {showBookInfo ? t('voc.hide') : t('voc.show')}
            </button>
          </div>
          {showBookInfo && (
            <div className="nb-chips" style={{ marginTop: 12 }}>
              {lektion.woerter.map((w, i) => (
                <span className="nb-chip voc" key={'w' + i}>📚 {w.thema}</span>
              ))}
              {lektion.grammatik.map((g, i) => (
                <span className="nb-chip gram" key={'g' + i}>📖 {g.regel}</span>
              ))}
              {lektion.kommunikation.map((k, i) => (
                <span className="nb-chip komm" key={'k' + i}>💬 {k.funktion}</span>
              ))}
            </div>
          )}
        </div>
      )}

      <div>
        <div className="prompt-label">{t('nb.yourNotes')}</div>
        <textarea
          ref={area}
          className="nb-raw"
          lang="de"
          spellCheck={false}
          rows={10}
          placeholder={t('nb.notesPh')}
          value={raw}
          onChange={(e) => onRawChange(e.target.value)}
          onBlur={() => persist({ raw })}
        />
        {/* Los apuntes de clase van en alemán y el teclado español no tiene
            estas letras. */}
        <Umlaut campo={area} onTexto={onRawChange} />
      </div>


      {/* Pasar a limpio y generar ejercicios los hace la IA; escribir y
          guardar los apuntes, no. Sin IA no queda ningún botón, así que la
          fila entera se va: si no, dejaba un hueco vacío al final. */}
      {!SIN_IA && (
        <div className="row" style={{ gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
          <button className="btn-primary" onClick={doClean} disabled={!aiOn || !raw.trim() || busy !== ''}>
            {busy === 'clean' ? t('nb.cleaning') : t('nb.doClean')}
          </button>
          <button className="btn-ghost" onClick={doItems} disabled={!aiOn || !raw.trim() || busy !== ''}>
            {busy === 'items' ? t('generating') : t('nb.doItems')}
          </button>
        </div>
      )}
      {!SIN_IA && !aiOn && (
        <p className="muted" style={{ fontSize: '0.83rem', marginTop: -4 }}>
          {t('nb.offBoth')}
        </p>
      )}
      {fallo && (
        <p style={{ color: 'var(--bad)', fontSize: '0.85rem', marginTop: -4 }}>{fallo}</p>
      )}

      {note.clean && (
        <div className="card nb-clean">
          <div className="row spread" style={{ marginBottom: 6 }}>
            <h3 style={{ margin: 0 }}>{t('nb.cleanTitle')}</h3>
            <button
              className="link-btn"
              style={{ padding: 0, fontSize: '0.8rem' }}
              onClick={doClean}
              disabled={busy !== ''}
            >
              {t('nb.regen')}
            </button>
          </div>
          <CleanNotesView value={note.clean} />
          {esOtroIdioma(note.cleanLang) && (
            <p className="aviso-idioma nb-clean-language-warning">⚠ {t('otroIdioma')}</p>
          )}
        </div>
      )}

      {note.items?.length > 0 && (
        <div className="card stack">
          <div className="row spread">
            <h3 style={{ margin: 0 }}>{t('nb.review', { n: note.items.length })}</h3>
            <button
              className="link-btn"
              style={{ padding: 0, fontSize: '0.8rem' }}
              onClick={doItems}
              disabled={busy !== ''}
            >
              {t('nb.regen')}
            </button>
          </div>
          <button className="btn-primary" onClick={() => onReview(note.id)}>
            {t('nb.startReview')}
          </button>
        </div>
      )}
      {/* Guardar fotos es una función local; la IA solo hace falta si se quieren
          resolver los ejercicios o describir las imágenes. */}
      <NotePhoto
        noteId={note.id}
        modo="aufgabe"
        lektion={lektion}
        analisis={listaFotos(note, 'aufgabe')}
        onCambio={(lista) => persist({ fotoAufgaben: lista, fotoAufgabe: null, fotoAnalyse: null })}
      />

      <NotePhoto
        noteId={note.id}
        modo="bild"
        lektion={lektion}
        analisis={listaFotos(note, 'bild')}
        onCambio={(lista) => persist({ fotoBilder: lista, fotoBild: null, fotoAnalyse: null })}
      />

    </div>
  );
}
