import React from 'react';
import { getLang, setLang, LANGS, pick } from '../lib/i18n.js';
import { SIN_IA, PORTABLE } from '../lib/modo.js';
import Pomodoro from './Pomodoro.jsx';

// El menú va en alemán. La traducción se queda en el tooltip, no en pantalla.
// Examen, noticias y canciones se generan enteras con IA: sin ella no son
// una version reducida, es que no hay nada que enseñar. En la version sin
// IA no salen en el menu.
const SOLO_IA = ['pruefung', 'news', 'lieder'];

const NAV_TODO = [
  { id: 'home', ico: '🏠', label: 'Startseite', es: 'Inicio', en: 'Home' },
  { id: 'grammar', ico: '📖', label: 'Grammatik', es: 'Gramática', en: 'Grammar' },
  { id: 'vocab', ico: '📚', label: 'Wortschatz', es: 'Vocabulario', en: 'Vocabulary' },
  { id: 'komm', ico: '💬', label: 'Kommunikation', es: 'Comunicación', en: 'Communication' },
  { id: 'notebook', ico: '📓', label: 'Notizbuch', es: 'Cuaderno', en: 'Notebook' },
  { id: 'diary', ico: '✍️', label: 'Tagebuch', es: 'Diario', en: 'Diary' },
  { id: 'pruefung', ico: '🎓', label: 'Prüfung', es: 'Examen A2', en: 'A2 exam' },
  { id: 'news', ico: '📰', label: 'Nachrichten', es: 'Noticias', en: 'News' },
  { id: 'lieder', ico: '🎵', label: 'Lieder', es: 'Canciones', en: 'Songs' },
  { id: 'leaderboard', ico: '🏅', label: 'Bestenliste', es: 'Clasificación', en: 'Leaderboard' },
  { id: 'settings', ico: '⚙️', label: 'Einstellungen', es: 'Ajustes', en: 'Settings' }
];

const NAV = NAV_TODO
  .filter((n) => !SIN_IA || !SOLO_IA.includes(n.id))
  .filter((n) => !PORTABLE || n.id !== 'notebook');

export default function Sidebar({ current, onNavigate }) {

  return (
    <aside className="sidebar">
      <div className="brand">Deutsch Trainer</div>

      {/* En el movil esta lista es la unica parte que se desplaza a lo ancho;
          el titulo, el idioma y el motor se quedan quietos en la fila de
          arriba. En el escritorio el <nav> no pinta nada (display: contents)
          y los botones siguen siendo hijos directos de la barra. */}
      <nav className="nav-scroll">
        {NAV.map((n) => (
          <button
            key={n.id}
            className={'nav-item' + (current === n.id ? ' active' : '')}
            onClick={() => onNavigate(n.id)}
            title={pick(n.es, n.en)}
          >
            <span className="ico">{n.ico}</span>
            <span className="nav-de">{n.label}</span>
          </button>
        ))}
      </nav>

      <div className="sep" />

      <Pomodoro />

      <div className="lang-box" data-lang={getLang()}>
        {LANGS.map((l) => (
          <button
            key={l.id}
            className={'lang-btn' + (getLang() === l.id ? ' on' : '')}
            onClick={() => {
              window.dispatchEvent(new Event('app:layout-transition'));
              setLang(l.id);
            }}
            title={l.label}
          >
            {l.id.toUpperCase()}
          </button>
        ))}
      </div>

    </aside>
  );
}
