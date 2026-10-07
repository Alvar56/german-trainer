import React, { useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { pick } from '../../lib/i18n.js';
import { useTeclas } from '../../lib/teclas.js';
import { descargarTabla } from '../../lib/descargarTabla.js';

// La ventana de las tablas de gramatica: la del Kasus Trainer (una sola) y la
// del Tagebuch (varias, con pestañas). Cada tabla es
//   { id, titulo, subtitulo, archivo, Contenido }
// y lo que se descarga es la tabla activa con su titulo y la marca de la app.
export default function TablaVentana({ tablas, inicial, onClose, cerrando = false }) {
  const [activa, setActiva] = useState(inicial || tablas[0].id);
  const [estado, setEstado] = useState('');
  const [ocupado, setOcupado] = useState(false);
  const captura = useRef(null);
  const pestanas = useRef(null);
  const scroll = useRef(null);
  // Hacia donde entra la tabla nueva: desde la derecha si la pestaña esta
  // despues de la anterior, desde la izquierda si esta antes.
  const [sentido, setSentido] = useState('');
  const [raya, setRaya] = useState(null);
  const tabla = tablas.find((x) => x.id === activa) || tablas[0];
  const { Contenido } = tabla;

  useTeclas({ Escape: () => onClose?.() }, true);

  async function descargar() {
    if (ocupado) return;
    setOcupado(true);
    setEstado('');
    try {
      setEstado(await descargarTabla(captura.current, tabla.archivo));
    } catch {
      setEstado(pick('No se pudo descargar la tabla.', 'The table could not be downloaded.'));
    }
    setOcupado(false);
  }

  function cambiar(id) {
    if (id === activa) return;
    const antes = tablas.findIndex((x) => x.id === activa);
    const despues = tablas.findIndex((x) => x.id === id);
    setSentido(despues > antes ? 'adelante' : 'atras');
    setActiva(id);
    setEstado('');
    if (scroll.current) scroll.current.scrollTop = 0;
  }

  // La raya de debajo de la pestaña activa se desliza hasta la nueva en vez
  // de saltar: se mide la pestaña y se mueve una sola raya.
  useLayoutEffect(() => {
    const caja = pestanas.current;
    const boton = caja?.querySelector('.tv-pestana.on');
    if (!boton) return;
    setRaya({ left: boton.offsetLeft, width: boton.offsetWidth });
  }, [activa]);

  // Portal: la pantalla de ejercicios anima su contenido con transform, lo
  // que crea un contexto de apilado y recortaba el fondo bajo el menu.
  return createPortal(
    <div className={'kt-backdrop' + (cerrando ? ' kt-cerrando' : '')} onClick={onClose}>
      <div className="kasus-tabelle-panel" role="dialog" aria-label={tabla.titulo} onClick={(e) => e.stopPropagation()}>
        <div className="kt-header">
          <div className="kt-title-group">
            <div className="kt-title">{tabla.titulo}</div>
            <div className="kt-subtitle">{tabla.subtitulo}</div>
          </div>
          <div className="kt-header-actions">
            <button className="kt-print-btn" type="button" onClick={descargar} disabled={ocupado}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M12 3v12m0 0 5-5m-5 5-5-5M5 21h14" />
              </svg>
              <span>{ocupado ? pick('Preparando…', 'Preparing…') : pick('Descargar', 'Download')}</span>
            </button>
            {onClose && (
              <button className="kt-close-btn" onClick={onClose} title={pick('Cerrar (Esc)', 'Close (Esc)')}>
                ✕
              </button>
            )}
          </div>
        </div>

        {tablas.length > 1 && (
          <div className={'tv-pestanas' + (raya ? ' con-raya' : '')} role="tablist" ref={pestanas}>
            {tablas.map((x) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={x.id === activa}
                className={'tv-pestana' + (x.id === activa ? ' on' : '')}
                onClick={() => cambiar(x.id)}
              >
                {x.pestana}
              </button>
            ))}
            {raya && <span className="tv-raya" style={{ left: raya.left, width: raya.width }} aria-hidden="true" />}
          </div>
        )}
        {estado && <div className="tv-estado" role="status">{estado}</div>}

        <div className="kt-scroll" ref={scroll}>
          <div
            key={activa}
            className={'tabla-captura' + (sentido ? ' tv-entra-' + sentido : '')}
            ref={captura}
          >
            <div className="tabla-captura-titulo">
              <strong>{tabla.titulo}</strong>
              <span>{tabla.subtitulo}</span>
            </div>
            <Contenido />
            <div className="tabla-marca">🦊 Deutsch mit Felix</div>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
