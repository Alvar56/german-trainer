// Descarga una tabla de gramatica como imagen PNG, con la marca de la app.
//
// Antes el boton usaba window.print(): abria el dialogo de imprimir y habia
// que elegir "Guardar como PDF" a mano. Ahora se pinta la tabla en una imagen
// y se descarga directamente, con "Deutsch mit Felix" al pie.
import { toPng } from 'html-to-image';
import { pick } from './i18n.js';

// `nodo` es lo que se fotografia. Mientras dura lleva la clase
// tabla-capturando: ahi se ensenan el titulo y la marca, y se quita lo que
// solo sirve en pantalla.
export async function descargarTabla(nodo, nombre) {
  if (!nodo) throw new Error('sin tabla');
  nodo.classList.add('tabla-capturando');
  let png;
  try {
    // Un momento para que el navegador aplique la clase antes de medir. Con
    // setTimeout y no requestAnimationFrame: ese no llega nunca si la ventana
    // esta oculta, y el boton se quedaba en "Preparando…".
    await new Promise((r) => setTimeout(r, 50));
    const fondo = getComputedStyle(nodo).backgroundColor;
    png = await toPng(nodo, {
      pixelRatio: 2,
      backgroundColor: fondo && fondo !== 'rgba(0, 0, 0, 0)' ? fondo : '#ffffff',
      width: nodo.scrollWidth,
      height: nodo.scrollHeight
    });
  } finally {
    nodo.classList.remove('tabla-capturando');
  }
  const a = document.createElement('a');
  a.href = png;
  a.download = `${nombre}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  return pick('Descargada', 'Downloaded');
}
