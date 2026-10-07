import React from 'react';
import { t } from '../lib/i18n.js';
import { esqueleto, pistasDisponibles } from '../lib/pista.js';
import PistaRevelable from './PistaRevelable.jsx';

// El esqueleto de la respuesta y el botón de pedir otra letra. Va encima del
// campo en todos los ejercicios de escribir: gramática, vocabulario y el hueco
// de comunicación.
export default function PistaLetras({ respuesta, pistas, onPedir, oculto, textoBoton, onRendir, textoRendir, mostrarAtajo = true, className = '', resetKey }) {
  if (oculto || !respuesta) return null;
  const quedan = pistasDisponibles(respuesta) - pistas;

  return (
    <div className={'pista-letras' + (className ? ' ' + className : '')}>
      <code key={pistas} className="pl-esqueleto pl-esqueleto-revelado" aria-live="polite">{esqueleto(respuesta, pistas)}</code>
      {onPedir && pistasDisponibles(respuesta) > 0 && (
        <PistaRevelable
          key={resetKey ?? respuesta}
          revealed={quedan <= 0}
          onReveal={onPedir}
          title="Atajo: Alt+P"
          className="pl-pista-slot"
          buttonClassName="btn-ghost btn-sm pl-btn"
          label={<>💡 {textoBoton || t('ueb.pedirPista', { n: quedan })} {mostrarAtajo && <span className="op-tecla" style={{ marginLeft: 4 }}>Alt+P</span>}</>}
        />
      )}
      {onRendir && (
        <button type="button" className="btn-ghost btn-sm pl-btn" onClick={onRendir}>
          {textoRendir}
        </button>
      )}
    </div>
  );
}
