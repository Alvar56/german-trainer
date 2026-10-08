import React, { useEffect, useRef, useState } from 'react';
import {
  getFotosVocab,
  agregarFotoVocab,
  eliminarFotoVocab,
  resolverFotoUrl,
  comprimirImagen
} from '../lib/fotosVocab.js';
import { pick } from '../lib/i18n.js';

export default function FotosVocab({ ownerId, nombre = '' }) {
  const [fotos, setFotos] = useState(() => getFotosVocab(ownerId));
  // Inicializar con dataUrls ya presentes
  const [urls, setUrls] = useState(() => {
    const init = {};
    const fList = getFotosVocab(ownerId);
    fList.forEach((f) => {
      if (f.dataUrl) init[f.id] = f.dataUrl;
    });
    return init;
  });
  const [cargando, setCargando] = useState(false);
  const [zoomUrl, setZoomUrl] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  // Recargar fotos si cambia el ownerId
  useEffect(() => {
    const list = getFotosVocab(ownerId);
    setFotos(list);
    const mapa = {};
    list.forEach((f) => {
      if (f.dataUrl) mapa[f.id] = f.dataUrl;
    });
    setUrls((prev) => ({ ...prev, ...mapa }));
  }, [ownerId]);

  // Resolver dataUrls pendientes de IndexedDB
  useEffect(() => {
    let activo = true;
    async function cargar() {
      const mapa = {};
      for (const f of fotos) {
        if (f.dataUrl) {
          mapa[f.id] = f.dataUrl;
        } else {
          try {
            const timeoutPromise = new Promise((res) => setTimeout(() => res(null), 2500));
            const url = await Promise.race([resolverFotoUrl(f), timeoutPromise]);
            if (url) mapa[f.id] = url;
            else mapa[f.id] = 'ERROR';
          } catch {
            mapa[f.id] = 'ERROR';
          }
        }
      }
      if (activo) setUrls((prev) => ({ ...prev, ...mapa }));
    }
    cargar();
    return () => {
      activo = false;
    };
  }, [fotos]);

  // Listener global de Ctrl+V / paste mientras esta pantalla está activa
  useEffect(() => {
    async function handlePaste(e) {
      // Si el foco está en un input o textarea escribiendo texto, no interceptar como imagen a menos que haya archivos
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          e.preventDefault();
          const file = items[i].getAsFile();
          if (file) {
            await procesarArchivo(file);
          }
          break;
        }
      }
    }

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [ownerId]);

  async function procesarArchivo(fileOrBlob) {
    if (!fileOrBlob) return;
    setCargando(true);
    try {
      const compressed = await comprimirImagen(fileOrBlob, 1600);
      const nueva = await agregarFotoVocab(ownerId, compressed);
      if (nueva) {
        setFotos(getFotosVocab(ownerId));
      }
    } catch (err) {
      alert(err.message || 'Error al procesar la imagen');
    } finally {
      setCargando(false);
    }
  }

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) {
      procesarArchivo(file);
    }
    e.target.value = '';
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      procesarArchivo(file);
    }
  }

  async function handleBorrar(id) {
    if (confirm(pick('¿Eliminar esta foto?', 'Delete this photo?'))) {
      await eliminarFotoVocab(ownerId, id);
      setFotos(getFotosVocab(ownerId));
    }
  }

  return (
    <div className="stack" style={{ gap: 18 }}>
      {/* Zona para pegar o subir imágenes */}
      <div
        className={'foto-pegador-box' + (dragOver ? ' drag-over' : '')}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        role="button"
        tabIndex={0}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="image/*"
          style={{ display: 'none' }}
        />
        <div className="foto-pegador-icono">📋 🖼</div>
        <div className="foto-pegador-txt">
          <strong>{pick('Pega una imagen con Ctrl + V', 'Paste an image with Ctrl + V')}</strong>
          <span>{pick('o haz clic aquí para elegir una foto de tu ordenador', 'or click here to select a photo from your computer')}</span>
        </div>
        {cargando && (
          <div className="foto-pegador-cargando">
            <span>{pick('Procesando imagen...', 'Processing image...')}</span>
          </div>
        )}
      </div>

      {/* Lista de fotos en grande */}
      {fotos.length === 0 ? (
        <div className="card center stack" style={{ padding: '36px 20px', color: 'var(--muted)' }}>
          <span style={{ fontSize: '2.4rem' }}>📷</span>
          <p style={{ margin: '6px 0 0', fontSize: '0.95rem' }}>
            {pick(
              'Aún no has añadido fotos a esta sección.',
              'No photos added to this section yet.'
            )}
          </p>
          <small>
            {pick(
              'Copia cualquier captura o imagen y pulsa Ctrl+V aquí para guardarla.',
              'Copy any screenshot or image and press Ctrl+V here to save it.'
            )}
          </small>
        </div>
      ) : (
        <div className="stack" style={{ gap: 24 }}>
          {fotos.map((f, idx) => {
            const rawUrl = urls[f.id] || f.dataUrl;
            const isError = rawUrl === 'ERROR';
            const url = isError ? null : rawUrl;
            return (
              <div key={f.id} className="card foto-grande-card">
                {/* Cabecera y acciones */}
                <div className="row spread" style={{ marginBottom: 12, alignItems: 'center' }}>
                  <div className="row" style={{ gap: 8, alignItems: 'center' }}>
                    <span className="pill" style={{ fontWeight: 700 }}>#{idx + 1}</span>
                    <span className="muted" style={{ fontSize: '0.78rem' }}>
                      {new Date(f.createdAt || Date.now()).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="row" style={{ gap: 8 }}>
                    {url && (
                      <button
                        className="btn-ghost btn-sm"
                        onClick={() => setZoomUrl(url)}
                        title="Ver en pantalla completa"
                      >
                        🔍 {pick('Ampliar', 'Zoom')}
                      </button>
                    )}
                    <button
                      className="btn-ghost btn-sm"
                      style={{ color: 'var(--bad)', borderColor: 'var(--bad-border)' }}
                      onClick={() => handleBorrar(f.id)}
                      title="Eliminar foto"
                    >
                      🗑 {pick('Eliminar', 'Delete')}
                    </button>
                  </div>
                </div>

                {/* Imagen en grande */}
                <div className="foto-grande-wrap" onClick={() => url && setZoomUrl(url)}>
                  {url ? (
                    <img src={url} alt={f.titulo || 'Foto de vocabulario'} className="foto-grande-img" />
                  ) : isError ? (
                    <div className="foto-cargando-placeholder" style={{ color: 'var(--bad)' }}>
                      ⚠ {pick('No se pudo recuperar la imagen guardada. Puedes eliminarla y volver a pegarla.', 'Could not load the saved image. You can delete and re-paste it.')}
                    </div>
                  ) : (
                    <div className="foto-cargando-placeholder">
                      {pick('Cargando imagen...', 'Loading image...')}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Zoom en pantalla completa */}
      {zoomUrl && (
        <div className="kt-backdrop" onClick={() => setZoomUrl(null)}>
          <div
            className="foto-modal-zoom"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="kt-close-btn foto-zoom-close"
              onClick={() => setZoomUrl(null)}
              title="Cerrar (Esc)"
            >
              ✕
            </button>
            <img src={zoomUrl} alt="Zoom" className="foto-modal-img" />
          </div>
        </div>
      )}
    </div>
  );
}
