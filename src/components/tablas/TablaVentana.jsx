import React, { useRef, useState } from 'react';
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
    setActiva(id);
    setEstado('');
  }

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
          <div className="tv-pestanas" role="tablist">
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
          </div>
        )}
        {estado && <div className="tv-estado" role="status">{estado}</div>}

        <div className="kt-scroll">
          <div className="tabla-captura" ref={captura}>
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
