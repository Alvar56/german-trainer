import { pick } from '../lib/i18n.js';

const LABELS = {
  mixed: ['🎲 Mezclado', '🎲 Mixed'],
  todo: ['🎲 De todo un poco', '🎲 A bit of everything'],
  'grammar-mixed': ['📘 Gramática mixta', '📘 Mixed grammar'],
  'vocab-mixed': ['📚 Vocabulario mixto', '📚 Mixed vocabulary'],
  mc: ['✅ Test', '✅ Quiz'],
  quiz: ['✅ Test', '✅ Quiz'],
  judge: ['⚖️ Correcto o no', '⚖️ Right or wrong'],
  order: ['🔀 Ordenar frases', '🔀 Sentence order'],
  write: ['⌨️ Escribir', '⌨️ Type it'],
  'write-vocab': ['⌨️ Escribir', '⌨️ Type it'],
  flashcards: ['🃏 Tarjetas', '🃏 Flashcards'],
  match: ['🧩 Emparejar', '🧩 Match'],
  wortsalat: ['🔤 Wortsalat', '🔤 Letter salad'],
  blitz: ['⚡ Blitz', '⚡ Blitz'],
  hangman: ['🪢 Ahorcado', '🪢 Hangman'],
  gender: ['🎯 der / die / das', '🎯 der / die / das'],
  kasus: ['🧭 Kasus Trainer', '🧭 Kasus Trainer'],
  uebersetzen: ['🔁 Traducir frases', '🔁 Translate phrases'],
  'komm:decir': ['✅ Elegir la frase', '✅ Pick the phrase'],
  'komm:responder': ['🗣️ Contestar', '🗣️ Reply'],
  'komm:ordenar': ['🔀 Ordenar la frase', '🔀 Put it in order'],
  'komm:hueco': ['📝 La palabra que falta', '📝 The missing word'],
  crossword: ['🔠 Crucigrama', '🔠 Crossword'],
  komm: ['💬 Comunicación', '💬 Communication']
};

export default function GameModePill({ mode }) {
  const labels = LABELS[mode];
  if (!labels) return null;
  return <span className="pill ctx-tema ctx-modo">{pick(...labels)}</span>;
}
