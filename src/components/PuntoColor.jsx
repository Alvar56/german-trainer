import React, { useState } from 'react';
import { t } from '../lib/i18n.js';

// El punto de color de una palabra, con su paleta.
//
// Estaba escrito dos veces, palabra por palabra, en Vocab.jsx (la tabla) y en
// DeckDetail.jsx (las fichas). Hoy hubo que arreglarlo y hubo que arreglarlo
// DOS veces; la proxima se olvida una. Aqui solo hay una copia.
//
// Va controlado: el color tambien lo usa quien lo pinta (para la raya de la
// ficha y para el color del texto), asi que el estado vive fuera y aqui solo
// esta si la paleta esta abierta.
const COLORES = [
  { val: 'transparent', clave: 'voc.colNinguno' },
  { val: '#ef4444', clave: 'voc.colRojo' },
  { val: '#3b82f6', clave: 'voc.colAzul' },
  { val: '#10b981', clave: 'voc.colVerde' },
  { val: '#f59e0b', clave: 'voc.colNaranja' },
  { val: '#8b5cf6', clave: 'voc.colMorado' }
];

const VACIO = 'repeating-linear-gradient(45deg, #eee, #eee 4px, #fff 4px, #fff 8px)';

export default function PuntoColor({ color, onElegir }) {
  const [abierta, setAbierta] = useState(false);

  function elegir(col) {
    onElegir(col);
    setAbierta(false);
  }

  return (
    <div className="color-wrap">
      <button
        className="color-dot"
        style={{ background: color === 'transparent' ? '#e2e8f0' : color }}
        onClick={() => setAbierta(!abierta)}
        title={t('voc.markColour')}
      />
      {abierta && (
        <div className="color-pop">
          {COLORES.map(({ val, clave }) => (
            <button
              key={val}
              className={'color-opt' + (val === 'transparent' ? ' vacio' : '')}
              style={{ background: val === 'transparent' ? VACIO : val }}
              onClick={() => elegir(val)}
              title={t(clave)}
              aria-label={t(clave)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
