import React, { useState } from 'react';
import { t } from '../lib/i18n.js';
import { setSettings } from '../lib/settings.js';
import { largoGuardado } from '../lib/largoDialogo.js';

// El selector. Es la misma preferencia en los dos sitios donde se pide una
// conversación (la libre y la de una Lektion), así que se guarda en ajustes y
// no en el estado de cada pantalla: eliges una vez y vale para las dos.
//
// Con `chips` se pinta como las filas de opciones del resto de la app (la
// dificultad de los juegos, la dirección de las flashcards) en vez de como el
// grupo de pastillas: en la tarjeta de la lección va debajo del botón, y ahí
// tiene que parecerse a lo demás que hay debajo de un botón.
export default function LargoDialogo({ disabled = false, onChange, chips = false }) {
  const [largo, setLargo] = useState(largoGuardado);

  function elegir(v) {
    setLargo(v);
    setSettings({ dialogLargo: v });
    onChange?.(v);
  }

  const opciones = [
    ['corta', t('komm.largoCorta')],
    ['media', t('komm.largoMedia')],
    ['larga', t('komm.largoLarga')]
  ];

  if (chips) {
    return (
      <div className="dlg-largo-chips" role="group" aria-label={t('komm.largo')}>
        <span className="muted" style={{ fontSize: '0.78rem' }}>{t('komm.largo')}</span>
        {opciones.map(([id, texto]) => (
          <button
            key={id}
            type="button"
            className={'ask-chip' + (largo === id ? ' on' : '')}
            disabled={disabled}
            onClick={() => elegir(id)}
          >
            {texto}
          </button>
        ))}
      </div>
    );
  }

  return (
    <div className="dlg-largo" role="group" aria-label={t('komm.largo')}>
      <span className="dlg-largo-tit">{t('komm.largo')}</span>
      <div className="dlg-largo-ops" data-largo={largo}>
        {opciones.map(([id, texto]) => (
          <button
            key={id}
            type="button"
            className={'dlg-largo-op' + (largo === id ? ' on' : '')}
            disabled={disabled}
            onClick={() => elegir(id)}
          >
            {texto}
          </button>
        ))}
      </div>
    </div>
  );
}
