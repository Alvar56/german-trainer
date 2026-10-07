import React from 'react';
import { pick } from '../lib/i18n.js';

export function alternarFiltroSeleccionado(actuales, id) {
  return actuales.length === 1 && actuales[0] === id ? [] : [id];
}

function GrupoFiltro({ etiqueta, ariaLabel, opciones, seleccionadas, onSeleccionar }) {
  return (
    <div className="mezcla-filtro">
      <span className="muted mezcla-filtro-label">{etiqueta}</span>
      <div className="mezcla-niveles" role="group" aria-label={ariaLabel}>
        {opciones.map(({ id, label }) => {
          const activo = seleccionadas.includes(id);
          return (
            <button
              key={id}
              type="button"
              className={'btn-ghost btn-sm' + (activo ? ' on' : '')}
              aria-pressed={activo}
              onClick={() => onSeleccionar(id)}
            >
              {label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function MezclaFiltros({
  bandas = [],
  bandasSeleccionadas = [],
  onCambiarBandas,
  dificultadesSeleccionadas = [],
  onCambiarDificultades
}) {
  const niveles = bandas.map((b) => ({
    id: b.id,
    label: pick('Solo ' + b.name, b.name + ' only')
  }));
  const dificultades = [
    { id: 'easy', label: pick('Fácil', 'Easy') },
    { id: 'hard', label: pick('Difícil', 'Difficult') }
  ];

  return (
    <div className="mezcla-filtros">
      {niveles.length > 0 && (
        <GrupoFiltro
          etiqueta={pick('Nivel', 'Level')}
          ariaLabel={pick('Niveles', 'Levels')}
          opciones={niveles}
          seleccionadas={bandasSeleccionadas}
          onSeleccionar={onCambiarBandas}
        />
      )}
      <GrupoFiltro
        etiqueta={pick('Dificultad', 'Difficulty')}
        ariaLabel={pick('Dificultad', 'Difficulty')}
        opciones={dificultades}
        seleccionadas={dificultadesSeleccionadas}
        onSeleccionar={onCambiarDificultades}
      />
    </div>
  );
}
