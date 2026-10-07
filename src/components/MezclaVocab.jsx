import React, { useState } from 'react';
import { t } from '../lib/i18n.js';
import { BAENDE } from '../lib/kursbuch/index.js';
import { mazosParaMezclar } from '../lib/vocab.js';
import MezclaFiltros, { alternarFiltroSeleccionado } from './MezclaFiltros.jsx';

// Practicar vocabulario sin elegir mazo. Mismo trato que la mezcla de
// gramática, y por lo mismo: cuando quieres repasar no sabes QUÉ repasar, y
// tener que decidirlo primero es lo que hace que no repases.
//
// Cada pregunta de la tanda elige su propio formato; no se sortea un juego
// único para las diez palabras.
export default function MezclaVocab({ onStart }) {
  const [bandasSeleccionadas, setBandasSeleccionadas] = useState([]);
  const [dificultadesSeleccionadas, setDificultadesSeleccionadas] = useState([]);
  // Uno por lección (todas sus palabras juntas), los temas sueltos y los
  // tuyos. Se piden a la librería y no se filtran de `allDecks()`: los de
  // lección son virtuales y allí no están, así que filtrando salían cero y la
  // mezcla se dejaba fuera TODO el vocabulario del libro.
  const elegibles = mazosParaMezclar();
  if (!elegibles.length) return null;

  const idsDe = (lista) => lista.map((d) => d.id).join('|');
  // Niveles que de verdad tienen mazos, para no pintar un botón vacío.
  const bandas = BAENDE.map((b) => ({
    id: b.id,
    name: b.name,
    mazos: elegibles.filter((d) => d.bandId === b.id)
  })).filter((b) => b.mazos.length);
  const iniciarMezcla = () => {
    const bandIds = bandas.filter((b) => bandasSeleccionadas.includes(b.id)).map((b) => b.id);
    const mazos = bandIds.length
      ? elegibles.filter((d) => bandIds.includes(d.bandId))
      : elegibles;
    onStart('combi:' + idsDe(mazos), 'mixed', false, null, null, null, null, {
      bandIds,
      difficultyIds: dificultadesSeleccionadas
    });
  };

  return (
    <div className="panel mezcla-vocab">
      <h2 style={{ marginBottom: 4 }}>{t('gr.mixTitle')}</h2>
      <p className="muted" style={{ fontSize: '0.84rem', marginBottom: 12 }}>
        {t('voc.combiSubDado')}
      </p>

      <button
        className="btn-primary home-todo"
        onClick={iniciarMezcla}
      >
        <span className="gt-ico">🎲</span>
        <span className="gt-txt">{t('voc.combiAll')}</span>
      </button>

      <MezclaFiltros
        bandas={bandas}
        bandasSeleccionadas={bandasSeleccionadas}
        onCambiarBandas={(id) => setBandasSeleccionadas((actuales) => alternarFiltroSeleccionado(actuales, id))}
        dificultadesSeleccionadas={dificultadesSeleccionadas}
        onCambiarDificultades={(id) => setDificultadesSeleccionadas((actuales) => alternarFiltroSeleccionado(actuales, id))}
      />
    </div>
  );
}
