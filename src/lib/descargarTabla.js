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
    const color = fondo && fondo !== 'rgba(0, 0, 0, 0)' ? fondo : '#ffffff';
    const foto = await toPng(nodo, {
      pixelRatio: 3,
      backgroundColor: color,
      width: nodo.scrollWidth,
      height: nodo.scrollHeight
    });
    png = await enFolioApaisado(foto, color);
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

// Un A4 apaisado a 300 ppp (297 x 210 mm), con un centimetro de margen. La
// tabla se encaja entera, sin deformarla, y se centra: asi se imprime en un
// folio tal cual, sin que la impresora la recorte ni la deje diminuta.
const FOLIO_ANCHO = 3508;
const FOLIO_ALTO = 2480;
const MARGEN = 118;

function cargarImagen(src) {
  return new Promise((ok, mal) => {
    const img = new Image();
    img.onload = () => ok(img);
    img.onerror = mal;
    img.src = src;
  });
}

async function enFolioApaisado(png, fondo) {
  const img = await cargarImagen(png);
  const lienzo = document.createElement('canvas');
  lienzo.width = FOLIO_ANCHO;
  lienzo.height = FOLIO_ALTO;
  const ctx = lienzo.getContext('2d');
  ctx.fillStyle = fondo;
  ctx.fillRect(0, 0, FOLIO_ANCHO, FOLIO_ALTO);
  const escala = Math.min((FOLIO_ANCHO - 2 * MARGEN) / img.width, (FOLIO_ALTO - 2 * MARGEN) / img.height);
  const w = img.width * escala;
  const h = img.height * escala;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, (FOLIO_ANCHO - w) / 2, (FOLIO_ALTO - h) / 2, w, h);
  return lienzo.toDataURL('image/png');
}
