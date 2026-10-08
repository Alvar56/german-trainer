import React, { useEffect } from 'react';
import { pick } from '../lib/i18n.js';
import { idJuego, SimboloJuego } from './IconoJuego.jsx';

const LABELS = {
  mixed: ['🎲 Mezclado', '🎲 Mixed'],
  todo: ['🎲 De todo un poco', '🎲 A bit of everything'],
  'grammar-mixed': ['📘 Gramática mixta', '📘 Mixed grammar'],
  'vocab-mixed': ['📚 Vocabulario mixto', '📚 Mixed vocabulary'],
  mc: ['✅ Test', '✅ Quiz'],
  quiz: ['✅ Test', '✅ Quiz'],
  judge: ['⚖ Correcto o no', '⚖ Right or wrong'],
  order: ['🔀 Ordenar frases', '🔀 Sentence order'],
  write: ['⌨ Escribir', '⌨ Type it'],
  'write-vocab': ['⌨ Escribir', '⌨ Type it'],
  flashcards: ['🃏 Tarjetas', '🃏 Flashcards'],
  match: ['🧩 Emparejar', '🧩 Match'],
  wortsalat: ['🔤 Wortsalat', '🔤 Letter salad'],
  blitz: ['⚡ Blitz', '⚡ Blitz'],
  hangman: ['🪢 Ahorcado', '🪢 Hangman'],
  gender: ['🎯 der / die / das', '🎯 der / die / das'],
  kasus: ['🧭 Kasus Trainer', '🧭 Kasus Trainer'],
  uebersetzen: ['🔁 Traducir frases', '🔁 Translate phrases'],
  'komm:decir': ['✅ Elegir la frase', '✅ Pick the phrase'],
  'komm:responder': ['🗣 Contestar', '🗣 Reply'],
  'komm:ordenar': ['🔀 Ordenar la frase', '🔀 Put it in order'],
  'komm:hueco': ['📝 La palabra que falta', '📝 The missing word'],
  crossword: ['🔠 Crucigrama', '🔠 Crossword'],
  komm: ['💬 Comunicación', '💬 Communication']
};

export default function GameModePill({ mode }) {
  const labels = LABELS[mode];
  const texto = labels ? pick(...labels) : '';
  const [emoji, ...resto] = texto.split(' ');
  const juego = idJuego(emoji);

  // Mientras dura el ejercicio, el body sabe a que se juega: el degradado de
  // abajo (el «suelo» de Felix) toma el color del juego en vez del del paisaje.
  useEffect(() => {
    if (!juego) return undefined;
    document.body.dataset.juego = juego;
    return () => {
      if (document.body.dataset.juego === juego) delete document.body.dataset.juego;
    };
  }, [juego]);

  if (!labels) return null;
  return (
    <span className="pill ctx-tema ctx-modo">
      {juego ? <><SimboloJuego e={emoji} />{resto.join(' ')}</> : texto}
    </span>
  );
}
