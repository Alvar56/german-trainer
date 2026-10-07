import React, { useMemo, useState } from 'react';
import { t } from '../lib/i18n.js';
import Desplegable from './Desplegable.jsx';

// Las ideas de ejemplo de los buscadores: dudas de gramática, situaciones para
// una conversación, temas para un mazo, artistas para una canción.
//
// Dos cosas que arregla:
//
// 1. Iban siempre a la vista, en una tira de ocho pastillas debajo de la caja.
//    El buscador de dudas las escondía en cuanto había respuesta y era el que
//    mejor quedaba; ahora todos van igual, con la tira detrás de un enlace.
//
// 2. Eran las mismas seis o siete SIEMPRE, escritas a mano en cada pantalla.
//    A la tercera vez ya no sugieren nada. Ahora cada pantalla tiene una lista
//    larga y se enseña un puñado distinto cada vez que entras, con un botón
//    para volver a barajar.
//
// El enlace y el panel animado son elementos hermanos dentro de .ask-pies:
// los enlaces caben en la misma línea y el panel cae debajo de ambos.

function barajar(xs) {
  const a = [...xs];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Sugerencias({ opciones, onElegir, disabled = false, cuantas = 6 }) {
  const [abierto, setAbierto] = useState(false);
  // Sube al pulsar "otras": es lo único que vuelve a barajar, para que la
  // lista no cambie sola mientras la estás leyendo.
  const [vuelta, setVuelta] = useState(0);
  const visibles = useMemo(
    () => barajar(opciones || []).slice(0, cuantas),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [opciones, cuantas, vuelta]
  );

  if (!opciones?.length) return null;

  return (
    <>
      <button className="link-btn pie-abrir" onClick={() => setAbierto(!abierto)} aria-expanded={abierto}>
        {abierto ? t('sug.hide') : t('sug.show')}
      </button>

      <Desplegable abierto={abierto} className="desplegable-sugerencias">
        <div className="ask-sug">
          {visibles.map((s) => (
            <button
              key={s}
              className="ask-chip"
              disabled={disabled}
              onClick={() => onElegir(s)}
            >
              {s}
            </button>
          ))}
          {opciones.length > cuantas && (
            <button
              className="ask-chip sug-otras"
              onClick={() => setVuelta((v) => v + 1)}
              title={t('sug.more')}
            >
              🔄
            </button>
          )}
        </div>
      </Desplegable>
    </>
  );
}
