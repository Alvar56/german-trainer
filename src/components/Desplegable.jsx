import React, { useLayoutEffect, useRef, useState } from 'react';

// Lo que se abre y se cierra, abriéndose y cerrándose.
//
// Por toda la app había desplegables escritos igual: `{abierto && <div>…}`.
// Eso no es una animación, es un corte: el contenido aparece entero de golpe y
// la tarjeta pega un salto. Y no se puede animar `display` ni una altura
// `auto`, así que ningún `transition` lo arreglaba.
//
// El truco es una rejilla de una fila que pasa de 0fr a 1fr: ESO sí se puede
// animar, y el navegador calcula solo lo que mide el contenido. El hijo lleva
// `overflow: hidden` para que lo que aún no cabe no se salga.
//
// El contenido se monta en el MISMO render en el que se abre -si se montara un
// instante después, los primeros fotogramas animarían una caja vacía- y no se
// desmonta hasta que termina de cerrarse, que si no no habría nada que encoger
// y volveríamos al corte de antes.
export default function Desplegable({ abierto, children, className = '' }) {
  const [cerrando, setCerrando] = useState(false);
  const antes = useRef(abierto);
  const ultimoContenidoAbierto = useRef(children);

  // Algunos llamadores solo pasan hijos mientras `abierto` es true. Conserva
  // la última versión para que el contenido siga montado durante el cierre.
  useLayoutEffect(() => {
    if (abierto) ultimoContenidoAbierto.current = children;
  }, [abierto, children]);

  useLayoutEffect(() => {
    const estaba = antes.current;
    antes.current = abierto;
    if (abierto) {
      setCerrando(false);
      return undefined;
    }
    // Solo al pasar de abierto a cerrado: si nunca estuvo abierto no hay nada
    // que cerrar. El layout effect conserva los hijos antes del siguiente paint.
    if (!estaba) return undefined;
    setCerrando(true);
    // Red de seguridad: si la pestaña está en segundo plano o el sistema pide
    // menos movimiento, el transitionend puede no llegar nunca y el contenido
    // se quedaría montado (invisible, pero montado).
    const t = setTimeout(() => setCerrando(false), 500);
    return () => clearTimeout(t);
  }, [abierto]);

  const montado = abierto || cerrando;
  const contenido = abierto ? children : cerrando ? ultimoContenidoAbierto.current : null;

  return (
    <div
      className={'desplegable' + (abierto ? ' abierto' : '') + (className ? ' ' + className : '')}
      // Solo interesa el final de la rejilla: la opacidad llega antes.
      onTransitionEnd={(e) => {
        if (e.propertyName === 'grid-template-rows' && !abierto) setCerrando(false);
      }}
      aria-hidden={!abierto}
      // Mientras se cierra sigue habiendo botones dentro: que no se pueda
      // llegar a ellos con el tabulador.
      inert={!abierto ? '' : undefined}
    >
      <div className="desplegable-caja">{montado ? contenido : null}</div>
    </div>
  );
}
