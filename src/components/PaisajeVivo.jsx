import React from 'react';

// Lo que se mueve en los paisajes nuevos de Felix, en la portada: nubes, pajaros, burbujas, brasas,
// copos, hojas... Antes iba animado DENTRO del SVG del paisaje, y como el
// paisaje es una imagen de fondo, el navegador la volvia a pintar entera en
// cada fotograma (la tienda iba a 17 fps). Ahora el paisaje es una imagen
// quieta y esto son piezas sueltas encima que solo se desplazan o se
// encienden (transform y opacity): eso lo hace la tarjeta grafica sin
// repintar nada.

const svg = (s) => `url("data:image/svg+xml,${encodeURIComponent(s)}")`;

const NUBE = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50"><g fill="#fff"><ellipse cx="60" cy="34" rx="56" ry="14"/><ellipse cx="44" cy="24" rx="26" ry="18"/><ellipse cx="74" cy="20" rx="24" ry="17"/></g><ellipse cx="60" cy="42" rx="48" ry="6" fill="#e3edf8"/></svg>');
const PAJARO = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 12"><path d="M1 8 q7 -8 14 0 q7 -8 14 0" fill="none" stroke="#4b5563" stroke-width="2.2" stroke-linecap="round"/></svg>');
const BURBUJA = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12"><circle cx="6" cy="6" r="5" fill="none" stroke="#e0f7ff" stroke-width="1.4"/><circle cx="4.3" cy="4.2" r="1.3" fill="#ffffff"/></svg>');
const PEZ = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 46 20"><path d="M10 10 C 18 0 36 0 44 10 C 36 20 18 20 10 10 Z" fill="#fb923c"/><path d="M10 10 L 1 3 L 1 17 Z" fill="#f97316"/><circle cx="36" cy="8.5" r="2" fill="#1f2937"/><path d="M24 3 L 27 10 L 24 17" stroke="#fff" stroke-width="2.4" fill="none"/></svg>');
const BRASA = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8"><circle cx="4" cy="4" r="3" fill="#fbbf24"/><circle cx="4" cy="4" r="1.4" fill="#fff4c2"/></svg>');
const COPO = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><circle cx="5" cy="5" r="3.4" fill="#ffffff"/></svg>');
const ESTRELLA = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 10"><path d="M5 0 L6 4 L10 5 L6 6 L5 10 L4 6 L0 5 L4 4 Z" fill="#fff7d6"/></svg>');
const FUGAZ = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 10"><defs><linearGradient id="g" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#fff"/></linearGradient></defs><path d="M0 5 L76 4 L80 5 L76 6 Z" fill="url(#g)"/></svg>');
const HOJA = (c) => svg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 14 10"><path d="M1 5 C 4 -1 12 0 13 5 C 12 10 4 11 1 5 Z" fill="${c}"/><path d="M2 5 L12 5" stroke="#7a3a12" stroke-width=".8"/></svg>`);
const MARIPOSA = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 16"><path d="M10 8 C 6 0 0 1 1 6 C 2 10 7 10 10 8 Z" fill="#d97298"/><path d="M10 8 C 14 0 20 1 19 6 C 18 10 13 10 10 8 Z" fill="#d97298"/><path d="M10 8 C 7 12 3 15 5 15 C 8 15 10 11 10 8 Z M10 8 C 13 12 17 15 15 15 C 12 15 10 11 10 8 Z" fill="#c45d83"/><ellipse cx="10" cy="8" rx=".9" ry="4" fill="#302024"/></svg>');
const RODADOR = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30"><g fill="none" stroke="#a9773f" stroke-width="2"><circle cx="15" cy="15" r="12"/><path d="M5 10 Q 15 20 25 10 M 6 20 Q 15 8 24 20 M 15 3 Q 10 15 15 27 M 15 3 Q 20 15 15 27"/></g></svg>');
const POLVO = svg('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 6 6"><circle cx="3" cy="3" r="2.2" fill="#fff6d8"/></svg>');

// Cada pieza: [clase de movimiento, imagen, left %, top %, ancho px, retraso s, duracion s]
const PIEZAS = {
  // Solo los siete paisajes nuevos: los seis de siempre llevan en la portada
  // sus animaciones originales, dentro del propio dibujo.
  vulkan: [['pv-brasa', BRASA, 44, 70, 6, 0, 5], ['pv-brasa', BRASA, 52, 76, 5, -1.6, 6], ['pv-brasa', BRASA, 30, 82, 5, -3, 5.5], ['pv-brasa', BRASA, 70, 86, 6, -2.2, 6.5], ['pv-brasa', BRASA, 58, 80, 4, -4, 5]],
  himmel: [['pv-nube', NUBE, 6, 10, 70, 0, 60], ['pv-nube', NUBE, 40, 4, 50, -25, 80], ['pv-pajaro', PAJARO, 26, 28, 22, 0, 13], ['pv-pajaro', PAJARO, 64, 36, 16, -6, 15]],
  dschungel: [['pv-mariposa', MARIPOSA, 30, 60, 16, 0, 8], ['pv-mariposa', MARIPOSA, 66, 52, 14, -4, 10], ['pv-hoja', HOJA('#5aa860'), 40, -4, 12, -2, 11]],
  unterwasser: [['pv-burbuja', BURBUJA, 18, 80, 10, 0, 7], ['pv-burbuja', BURBUJA, 22, 84, 7, -2, 8], ['pv-burbuja', BURBUJA, 58, 82, 9, -4, 7.5], ['pv-burbuja', BURBUJA, 82, 80, 8, -1, 9], ['pv-pez', PEZ, 0, 34, 34, 0, 20], ['pv-pez pv-pez-vuelta', PEZ, 0, 52, 26, -8, 26]],
  alpen: [['pv-nube', NUBE, 14, 8, 80, 0, 75], ['pv-nube', NUBE, 56, 16, 54, -40, 95], ['pv-pajaro', PAJARO, 34, 16, 26, -3, 18]],
  herbstwald: [['pv-hoja', HOJA('#e4572e'), 20, -4, 12, 0, 9], ['pv-hoja', HOJA('#f2c14e'), 46, -4, 11, -3, 11], ['pv-hoja', HOJA('#f08a24'), 70, -4, 12, -6, 10], ['pv-hoja', HOJA('#c0392b'), 86, -4, 10, -2, 12]],
  grossstadt: [['pv-brillo', ESTRELLA, 10, 8, 7, 0, 3.5], ['pv-brillo', ESTRELLA, 36, 14, 6, -1, 4], ['pv-brillo', ESTRELLA, 66, 6, 8, -2, 3], ['pv-brillo', ESTRELLA, 88, 12, 6, -1.4, 4.5]]
};

export default function PaisajeVivo({ fondo }) {
  const piezas = PIEZAS[fondo];
  if (!piezas) return null;
  return (
    <div className="paisaje-vivo" aria-hidden="true">
      {piezas.map(([clase, img, left, top, ancho, retraso, dur], i) => (
        <span
          key={i}
          className={'pv ' + clase}
          style={{
            left: left + '%', top: top + '%', width: ancho,
            backgroundImage: img,
            animationDelay: retraso + 's', animationDuration: dur + 's'
          }}
        />
      ))}
    </div>
  );
}
