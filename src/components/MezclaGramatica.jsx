import React, { useState } from 'react';
import IconoJuego from './IconoJuego.jsx';
import { t } from '../lib/i18n.js';
import { bandasConGramatica } from '../topics/index.js';
import MezclaFiltros, { alternarFiltroSeleccionado } from './MezclaFiltros.jsx';

// Practicar gramática sin elegir lección.
//
// La pantalla de Grammatik era una lista de lecciones y nada más: para repasar
// había que decidir primero POR QUÉ lección repasar, que es justo lo que no
// sabes cuando quieres repasar. Aquí se practica todo mezclado, o un nivel
// entero, y ya.
//
// Por nivel y no solo "todo" porque mezclar A1.1 con A2.1 cuando vas por A1.1
// llena media tanda de cosas que aún no has visto.
export default function MezclaGramatica({ onStart }) {
  const bandas = bandasConGramatica();
  const [bandasSeleccionadas, setBandasSeleccionadas] = useState([]);
  const [dificultadesSeleccionadas, setDificultadesSeleccionadas] = useState([]);
  const iniciarMezcla = () => {
    const bandIds = bandas.filter((b) => bandasSeleccionadas.includes(b.id)).map((b) => b.id);
    const topicId = bandIds.length ? 'mix:' + bandIds.join('|') : 'mix';
    onStart(topicId, 'mixed', 'grammar-mixed', null, null, null, {
      bandIds,
      difficultyIds: dificultadesSeleccionadas
    });
  };

  return (
    <div className="panel" style={{ marginTop: 22 }}>
      <h2 style={{ marginBottom: 4 }}>{t('gr.mixTitle')}</h2>
      <p className="muted" style={{ fontSize: '0.84rem', marginBottom: 12 }}>
        {t('gr.mixSub')}
      </p>

      <button
        className="btn-primary home-todo"
        onClick={iniciarMezcla}
      >
        <IconoJuego e="🎲" />
        <span className="gt-txt">{t('gr.mixAll')}</span>
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
