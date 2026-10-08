import ArtikelTabla from './ArtikelTabla.jsx';
import AdjektivTabla from './AdjektivTabla.jsx';
import PraepositionenTabla from './PraepositionenTabla.jsx';
import GenusTabla from './GenusTabla.jsx';

// Las tablas de gramatica de consulta. `archivo` es el nombre de la imagen
// al descargarla; `pestana`, lo que se lee en la pestaña del Tagebuch.
export const TABLA_ARTIKEL = {
  id: 'artikel',
  pestana: 'Artikel',
  titulo: '📋 Die Artikelwörter & Fälle',
  subtitulo: 'Genus (Geschlecht) · Kasus (Fall)',
  archivo: 'Artikelwörter und Fälle',
  Contenido: ArtikelTabla
};

export const TABLA_ADJEKTIV = {
  id: 'adjektiv',
  pestana: 'Adjektive',
  titulo: '🎨 Die Adjektivdeklination',
  subtitulo: 'Adjektiv nach bestimmtem und unbestimmtem Artikel',
  archivo: 'Adjektivdeklination',
  Contenido: AdjektivTabla
};

export const TABLA_PRAEPOSITIONEN = {
  id: 'praepositionen',
  pestana: 'Präpositionen',
  titulo: '🧭 Präpositionen: Dativ oder Akkusativ?',
  subtitulo: 'Feste Fälle · Wechselpräpositionen · Kurzformen',
  archivo: 'Präpositionen Dativ Akkusativ',
  Contenido: PraepositionenTabla
};

// Las reglas para saber si un sustantivo es der, die o das. Sale en el juego
// de der / die / das y, con las demas, en el Tagebuch.
export const TABLA_GENUS = {
  id: 'genus',
  pestana: 'Genus',
  titulo: '🔤 Der, die oder das?',
  subtitulo: 'So erkennst du das Genus eines Nomens',
  archivo: 'Genus der Nomen',
  Contenido: GenusTabla
};

export const TABLAS = [TABLA_ARTIKEL, TABLA_ADJEKTIV, TABLA_PRAEPOSITIONEN, TABLA_GENUS];
