import React, { useEffect, useMemo, useRef, useState } from 'react';
import { colorDe } from '../lib/fuchs.js';

// Zorro en pixel art, 28x30, sentado y con cola. Se dibuja por formas en vez
// de con cadenas de texto: contar píxeles a mano es donde salen los errores.
// El contorno negro se calcula solo al final, rodeando la silueta.
//
//   f pelo   d pelo en sombra   h pelo iluminado   l crema (hocico, pecho, cola)
//   m sombra del crema   w blanco del ojo   p pupila   s brillo   n nariz
//   r rubor   t boca abierta   o contorno

const W = 28;
const H = 30;
const ALTO_CABEZA = 19; // sin cuerpo, el dibujo se recorta aquí
const OBJETOS_EASTER_EGG = new Set(['guitarra', 'trebol', 'camara', 'peluche', 'cocheRC', 'robot']);
const TOQUES_EASTER_EGG = { guitarra: 4, trebol: 3, camara: 2, peluche: 2, cocheRC: 3, robot: 2 };
// (Aqui vivia MARGEN, el aire que se le anadia al viewBox para las chispas.
//  Se lo llevaba del tamano del zorro; ahora las chispas se salen del cuadro.)
// Cuanto se agranda el objeto de la mano respecto a la rejilla del zorro.
const ESCALA_OBJETO = 1.3;

// Acorde breve de guitarra acústica sintetizado con una cuerda pulsada.
let contextoGuitarra;
function tocarAcordeGuitarra() {
  if (typeof window === 'undefined') return;
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return;
  try {
    contextoGuitarra ||= new AudioCtx();
    const ctx = contextoGuitarra;
    if (ctx.state === 'suspended') ctx.resume();
    [196, 246.94, 293.66].forEach((frecuencia, nota) => {
      const duracion = 0.78;
      const largo = Math.floor(ctx.sampleRate * duracion);
      const periodo = Math.max(2, Math.round(ctx.sampleRate / frecuencia));
      const buffer = ctx.createBuffer(1, largo, ctx.sampleRate);
      const datos = buffer.getChannelData(0);
      const cuerda = Float32Array.from({ length: periodo }, () => Math.random() * 2 - 1);
      let indice = 0;
      for (let i = 0; i < largo; i++) {
        datos[i] = cuerda[indice];
        cuerda[indice] = (cuerda[indice] + cuerda[(indice + 1) % periodo]) * 0.497;
        indice = (indice + 1) % periodo;
      }
      const fuente = ctx.createBufferSource();
      const filtro = ctx.createBiquadFilter();
      const volumen = ctx.createGain();
      const inicio = ctx.currentTime + nota * 0.045;
      fuente.buffer = buffer;
      filtro.type = 'lowpass';
      filtro.frequency.value = 2600;
      volumen.gain.setValueAtTime(0.0001, inicio);
      volumen.gain.exponentialRampToValueAtTime(0.11, inicio + 0.012);
      volumen.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);
      fuente.connect(filtro).connect(volumen).connect(ctx.destination);
      fuente.start(inicio);
      fuente.stop(inicio + duracion);
    });
  } catch {
    // Si no hay Web Audio, la guitarra sigue funcionando visualmente.
  }
}

function lienzo() {
  return Array.from({ length: H }, () => Array(W).fill('.'));
}
function px(g, x, y, k) {
  if (y >= 0 && y < H && x >= 0 && x < W) g[y][x] = k;
}
function fila(g, y, x0, x1, k) {
  for (let x = x0; x <= x1; x++) px(g, x, y, k);
}
function bloque(g, y0, y1, x0, x1, k) {
  for (let y = y0; y <= y1; y++) fila(g, y, x0, x1, k);
}
// Pinta a la izquierda y su reflejo a la derecha de una vez: así la cara sale
// simétrica sin escribir dos veces las mismas coordenadas.
function espejo(g, y, x0, x1, k) {
  fila(g, y, x0, x1, k);
  fila(g, y, W - 1 - x1, W - 1 - x0, k);
}
function espejoPx(g, x, y, k) {
  px(g, x, y, k);
  px(g, W - 1 - x, y, k);
}

// ---------- la cola ----------
// Va en su propia rejilla para poder moverla aparte del cuerpo. Cada bicho
// lleva la suya, y a los que no tienen (búho, rana, pato) se les deja la
// rejilla vacía: el meneo simplemente no se ve.
function colaZorro(g) {
  // curva: ancha abajo, subiendo por la izquierda
  bloque(g, 24, 27, 2, 9, 'f');
  bloque(g, 21, 23, 1, 8, 'f');
  bloque(g, 18, 20, 1, 7, 'f');
  bloque(g, 15, 17, 2, 7, 'f');
  bloque(g, 13, 14, 3, 7, 'f');
  fila(g, 12, 4, 7, 'f');

  // sombra por dentro de la curva
  bloque(g, 22, 27, 7, 9, 'd');
  bloque(g, 19, 21, 6, 7, 'd');

  // la punta clara, grande y arriba
  bloque(g, 12, 14, 4, 7, 'l');
  bloque(g, 15, 16, 2, 6, 'l');
  fila(g, 17, 2, 4, 'l');
  // el borde irregular entre la punta y el naranja
  px(g, 5, 17, 'm');
  px(g, 3, 18, 'm');
  px(g, 7, 15, 'm');
}

function colaGato(g) {
  // fina y curvada, sin la punta esponjosa
  bloque(g, 24, 27, 3, 6, 'f');
  bloque(g, 20, 23, 2, 5, 'f');
  bloque(g, 16, 19, 2, 4, 'f');
  bloque(g, 13, 15, 3, 5, 'f');
  fila(g, 12, 4, 6, 'f');
  bloque(g, 22, 27, 5, 6, 'd');
  bloque(g, 12, 14, 4, 5, 'l');
}

// Perro: como la del zorro pero más corta y con la punta clara pequeña, que
// si no los dos se confunden de lejos.
function colaPerro(g) {
  bloque(g, 24, 27, 3, 9, 'f');
  bloque(g, 21, 23, 2, 8, 'f');
  bloque(g, 18, 20, 2, 7, 'f');
  bloque(g, 16, 17, 3, 7, 'f');
  bloque(g, 22, 27, 7, 9, 'd');
  bloque(g, 16, 18, 3, 6, 'l');
  px(g, 4, 19, 'm');
}

// Oso: un muñón, casi nada.
function colaOso(g) {
  bloque(g, 24, 27, 5, 8, 'f');
  bloque(g, 25, 27, 5, 6, 'd');
}

// Conejo: pompón de algodón blanco redondo, esponjoso y adorable.
function colaConejo(g) {
  fila(g, 21, 5, 8, 'l');
  bloque(g, 22, 26, 3, 9, 'l');
  fila(g, 27, 4, 8, 'l');
  // Sombras y textura redondeada del pompón
  bloque(g, 25, 27, 3, 5, 'm');
  fila(g, 27, 6, 7, 'm');
  px(g, 8, 26, 'm');
}

// Pato: cuatro plumas que apuntan hacia arriba.
function colaPato(g) {
  bloque(g, 23, 26, 4, 9, 'l');
  bloque(g, 21, 22, 5, 9, 'l');
  fila(g, 20, 7, 9, 'l');
  bloque(g, 24, 26, 4, 6, 'm');
}

// Erizo: pompón de púas redondeado y tupido en la espalda.
function colaErizo(g) {
  bloque(g, 21, 26, 2, 7, 'd');
  fila(g, 27, 3, 6, 'd');
  px(g, 3, 22, 'h');
  px(g, 5, 21, 'h');
  px(g, 2, 24, 'p');
  px(g, 4, 25, 'p');
}

// Mapache: gorda como la del zorro y a rayas, que es su sena de identidad.
function colaMapache(g) {
  bloque(g, 22, 27, 3, 8, 'f');
  bloque(g, 16, 21, 2, 7, 'f');
  bloque(g, 12, 15, 3, 8, 'f');
  bloque(g, 25, 27, 3, 8, 'p');
  bloque(g, 19, 21, 2, 7, 'p');
  bloque(g, 13, 15, 3, 8, 'p');
}

const COLAS = {
  zorro: colaZorro,
  gato: colaGato,
  perro: colaPerro,
  oso: colaOso,
  conejo: colaConejo,
  buho: null,
  rana: null,
  pato: colaPato,
  erizo: colaErizo,
  mapache: colaMapache
};

function dibujarCola(especie = 'zorro') {
  const g = lienzo();
  const f = COLAS[especie];
  if (f) f(g);
  return g;
}

// ---------- cabeza ----------
// Todos los bichos son el mismo cráneo con el mismo hocico y otras orejas: es
// lo que hace que la cara siga funcionando (ojos, gestos, complementos) sin
// tener que redibujarla ocho veces.
//
//   detras  → lo que sale por arriba, antes del cráneo (orejas de punta)
//   delante → lo que va encima: orejas caídas, manchas, bigotes

function craneo(g) {
  fila(g, 7, 8, 19, 'f');
  fila(g, 8, 6, 21, 'f');
  bloque(g, 9, 16, 5, 22, 'f');
  fila(g, 17, 6, 21, 'f');
  fila(g, 18, 8, 19, 'f');

  // luz arriba y sombra abajo, a lo ancho las dos
  fila(g, 8, 8, 19, 'h');
  fila(g, 9, 7, 20, 'h');
  fila(g, 17, 7, 20, 'd');
  fila(g, 18, 9, 18, 'd');
}

// Hocico crema: banda ancha por la parte baja de la cara. Sube hasta la
// fila 12 para que la nariz y la boca respiren.
function hocico(g) {
  fila(g, 12, 11, 16, 'l');
  fila(g, 13, 9, 18, 'l');
  bloque(g, 14, 16, 8, 19, 'l');
  fila(g, 17, 9, 18, 'l');
  espejoPx(g, 8, 13, 'm');
  espejoPx(g, 8, 17, 'm');
  fila(g, 18, 11, 16, 'm');
}

function orejasZorro(g) {
  // Orejas grandes y puntiagudas: casi un tercio del bicho.
  espejo(g, 0, 8, 9, 'f');
  espejo(g, 1, 7, 10, 'f');
  espejo(g, 2, 7, 10, 'f');
  espejo(g, 3, 6, 11, 'f');
  espejo(g, 4, 6, 11, 'f');
  espejo(g, 5, 6, 12, 'f');
  espejo(g, 6, 5, 12, 'f');
  espejo(g, 7, 5, 13, 'f');

  // borde oscuro por fuera, como el zorro de verdad
  espejo(g, 0, 8, 9, 'd');
  espejo(g, 1, 7, 8, 'd');
  espejo(g, 2, 7, 7, 'd');
  espejo(g, 3, 6, 7, 'd');
  espejo(g, 4, 6, 6, 'd');
  espejo(g, 5, 6, 6, 'd');

  // hueco claro de la oreja, con la veta naranja de en medio
  espejo(g, 2, 8, 9, 'l');
  espejo(g, 3, 8, 10, 'l');
  espejo(g, 4, 7, 10, 'l');
  espejo(g, 5, 7, 11, 'l');
  espejo(g, 6, 8, 11, 'l');
  espejo(g, 7, 9, 12, 'm');
  espejo(g, 4, 9, 9, 'f');
  espejo(g, 5, 9, 10, 'f');
}

// El gato: orejas más bajas y anchas, sin la punta oscura del zorro.
function orejasGato(g) {
  espejo(g, 2, 7, 9, 'f');
  espejo(g, 3, 6, 10, 'f');
  espejo(g, 4, 6, 11, 'f');
  espejo(g, 5, 5, 12, 'f');
  espejo(g, 6, 5, 12, 'f');
  espejo(g, 7, 5, 13, 'f');
  espejo(g, 3, 8, 9, 'l');
  espejo(g, 4, 7, 10, 'l');
  espejo(g, 5, 7, 11, 'l');
  espejo(g, 6, 8, 11, 'm');
}
function marcasGato(g) {
  // rayas en la frente y bigotes
  espejoPx(g, 10, 7, 'd');
  espejoPx(g, 12, 7, 'd');
  espejoPx(g, 11, 8, 'd');
  espejo(g, 14, 4, 6, 'g');
  espejo(g, 16, 4, 6, 'g');
}

// Perro: orejas caídas por los lados, por delante del cráneo, y la mancha
// clara del morro subiendo por la frente.
function orejasPerro(g) {
  espejo(g, 5, 4, 7, 'f');
  espejo(g, 6, 3, 7, 'f');
  espejo(g, 7, 2, 6, 'f');
  espejo(g, 8, 2, 5, 'f');
  espejo(g, 9, 2, 5, 'f');
  espejo(g, 10, 2, 5, 'f');
  espejo(g, 11, 2, 5, 'f');
  espejo(g, 12, 2, 5, 'f');
  espejo(g, 13, 3, 5, 'f');
  espejo(g, 14, 3, 5, 'f');
  // la oreja es más oscura que la cabeza, o no se despega de ella
  espejo(g, 7, 2, 3, 'd');
  espejo(g, 8, 2, 3, 'd');
  espejo(g, 9, 2, 3, 'd');
  espejo(g, 10, 2, 3, 'd');
  espejo(g, 11, 2, 4, 'd');
  espejo(g, 12, 2, 5, 'd');
  espejo(g, 13, 3, 5, 'd');
  espejo(g, 14, 3, 5, 'd');
}
function marcasPerro(g) {
  fila(g, 8, 12, 15, 'l');
  fila(g, 9, 12, 15, 'l');
  fila(g, 10, 13, 14, 'l');
  fila(g, 11, 13, 14, 'l');
}

// Oso: orejotas redondas en las esquinas de arriba. Anchas y con el hueco en
// tono apagado; con el crema del zorro parecían orejas de zorro pequeñas.
function orejasOso(g) {
  espejo(g, 0, 6, 9, 'f');
  espejo(g, 1, 5, 10, 'f');
  espejo(g, 2, 4, 10, 'f');
  espejo(g, 3, 4, 10, 'f');
  espejo(g, 4, 5, 10, 'f');
  espejo(g, 5, 6, 11, 'f');
  espejo(g, 6, 7, 12, 'f');
  espejo(g, 2, 6, 8, 'm');
  espejo(g, 3, 6, 8, 'm');
}

// Conejo: orejas largas y suaves, con interior esponjoso y mejillas regordetas.
function orejasConejo(g) {
  // Puntas redondeadas y suaves
  espejo(g, 0, 9, 10, 'f');
  espejo(g, 1, 8, 11, 'f');
  espejo(g, 2, 7, 11, 'f');
  espejo(g, 3, 7, 11, 'f');
  espejo(g, 4, 7, 11, 'f');
  espejo(g, 5, 8, 11, 'f');
  espejo(g, 6, 8, 11, 'f');
  espejo(g, 7, 8, 12, 'f');

  // Interior suave claro / rosado
  espejo(g, 1, 9, 10, 'l');
  espejo(g, 2, 8, 10, 'l');
  espejo(g, 3, 8, 10, 'l');
  espejo(g, 4, 8, 10, 'l');
  espejo(g, 5, 9, 10, 'l');
  espejo(g, 6, 9, 10, 'm');
  // Sombra de volumen
  espejoPx(g, 7, 4, 'd');
  espejoPx(g, 11, 6, 'd');
}
function marcasConejo(g) {
  // Colorete tierno en las mejillas
  espejo(g, 13, 6, 7, 'r');
  espejo(g, 14, 6, 7, 'r');
  // Bigotitos finos de conejito
  espejoPx(g, 4, 13, 'd');
  espejoPx(g, 5, 14, 'd');
  espejoPx(g, 4, 15, 'd');
}

// Búho: penachos en las puntas y el disco pálido de la cara.
function orejasBuho(g) {
  espejo(g, 2, 5, 6, 'f');
  espejo(g, 3, 5, 7, 'f');
  espejo(g, 4, 5, 8, 'f');
  espejo(g, 5, 5, 9, 'f');
  espejo(g, 6, 5, 10, 'f');
  espejo(g, 2, 5, 5, 'd');
  espejo(g, 3, 5, 5, 'd');
}
function marcasBuho(g) {
  bloque(g, 9, 13, 6, 21, 'l');
  bloque(g, 9, 13, 13, 14, 'm');
  espejo(g, 8, 7, 12, 'm');
}

// Rana: cúpulas redondeadas y suaves encima de los ojos, rubor tierno
// y sonrisa expresiva y adorable (estilo kawaii).
function orejasRana(g) {
  // Bultos de los ojos redondeados y suaves en la parte superior
  espejo(g, 2, 8, 11, 'f');
  espejo(g, 3, 7, 12, 'f');
  espejo(g, 4, 6, 12, 'f');
  espejo(g, 5, 6, 13, 'f');
  espejo(g, 6, 5, 13, 'f');
  espejo(g, 7, 5, 13, 'f');

  // Brillos suaves en la coronilla de los ojos
  espejo(g, 3, 8, 10, 'h');
  espejo(g, 4, 7, 10, 'h');
  espejo(g, 5, 7, 9, 'h');
}
// Mofletes: la cara de la rana se ensancha por abajo, mas ancha que el
// craneo de los demas bichos. Sin esto parecia el zorro pintado de verde.
function mofletesRana(g) {
  espejo(g, 11, 4, 4, 'f');
  espejo(g, 12, 3, 4, 'f');
  bloque(g, 13, 15, 2, 4, 'f');
  bloque(g, 13, 15, 23, 25, 'f');
  espejo(g, 16, 3, 5, 'f');
  espejo(g, 17, 4, 6, 'f');
  // sombra por debajo del moflete, para que se vea redondo
  espejo(g, 16, 3, 4, 'd');
  espejo(g, 17, 4, 6, 'd');
  espejo(g, 15, 2, 2, 'd');
}
function marcasRana(g) {
  // Rubor en lo alto del moflete
  espejo(g, 13, 4, 6, 'r');
  espejo(g, 14, 4, 6, 'r');
  // Brillo sutil en la frente
  fila(g, 8, 12, 15, 'h');
}

// Pato: el mechón de arriba, con su antenita.
function orejasPato(g) {
  fila(g, 5, 11, 16, 'f');
  fila(g, 4, 12, 15, 'f');
  fila(g, 3, 13, 14, 'f');
  px(g, 15, 2, 'f');
  px(g, 16, 1, 'f');
  px(g, 16, 0, 'f');
}

// Erizo: corona de púas esponjosa y redondeada con orejitas adorables.
function puasErizo(g) {
  fila(g, 0, 11, 16, 'd');
  px(g, 12, 0, 'h');
  px(g, 15, 0, 'h');

  espejo(g, 1, 9, 13, 'd');
  espejoPx(g, 10, 1, 'h');
  espejoPx(g, 13, 1, 'p');

  espejo(g, 2, 7, 13, 'd');
  espejoPx(g, 8, 2, 'h');
  espejoPx(g, 11, 2, 'p');

  espejo(g, 3, 5, 13, 'd');
  espejoPx(g, 6, 3, 'h');
  espejoPx(g, 9, 3, 'p');

  espejo(g, 4, 4, 12, 'd');
  espejoPx(g, 5, 4, 'h');
  espejoPx(g, 8, 4, 'p');

  espejo(g, 5, 3, 12, 'd');
  espejoPx(g, 4, 5, 'h');
  espejoPx(g, 7, 5, 'p');

  espejo(g, 6, 3, 11, 'd');
  espejoPx(g, 4, 6, 'h');

  espejo(g, 7, 3, 11, 'd');

  // Púas en los laterales de la cabeza
  espejo(g, 8, 2, 5, 'd');
  espejoPx(g, 2, 8, 'h');
  espejo(g, 9, 2, 4, 'd');
  espejo(g, 10, 2, 4, 'd');
  espejoPx(g, 2, 10, 'p');
  espejo(g, 11, 3, 4, 'd');
}
function orejasDelanteErizo(g) {
  // Orejitas redondas tiernas que asoman entre las púas
  espejo(g, 5, 5, 7, 'f');
  espejo(g, 6, 5, 8, 'f');
  espejo(g, 7, 6, 8, 'f');
  espejo(g, 6, 6, 7, 'l');
  espejoPx(g, 7, 7, 'm');
}
function marcasErizo(g) {
  // Rubor tierno en las mejillas redonditas
  espejo(g, 13, 6, 7, 'r');
  espejo(g, 14, 6, 7, 'r');
  // Detalle de luz en la frente
  fila(g, 8, 12, 15, 'h');
}

// Mapache: orejas redondas y pequenas, a los lados.
function orejasMapache(g) {
  espejo(g, 2, 6, 9, 'f');
  espejo(g, 3, 5, 10, 'f');
  espejo(g, 4, 5, 11, 'f');
  espejo(g, 5, 5, 12, 'f');
  espejo(g, 3, 7, 9, 'l');
  espejo(g, 4, 7, 10, 'l');
}
// Y el antifaz, que es lo que lo hace mapache: banda oscura sobre los ojos,
// ceja clara por encima y el morro tambien claro.
function marcasMapache(g) {
  bloque(g, 5, 6, 6, 21, 'l');
  bloque(g, 7, 11, 4, 11, 'p');
  bloque(g, 7, 11, 16, 23, 'p');
  fila(g, 6, 4, 8, 'p');
  fila(g, 6, 19, 23, 'p');
  bloque(g, 7, 10, 12, 15, 'l');
}

const BICHOS = {
  zorro: { detras: orejasZorro },
  gato: { detras: orejasGato, delante: marcasGato },
  perro: { delante: orejasPerro, marcas: marcasPerro },
  oso: { detras: orejasOso },
  conejo: { detras: orejasConejo, delante: marcasConejo },
  buho: { detras: orejasBuho, delante: marcasBuho },
  rana: { detras: orejasRana, delante: mofletesRana, marcas: marcasRana },
  pato: { detras: orejasPato },
  erizo: { detras: puasErizo, delante: orejasDelanteErizo, marcas: marcasErizo },
  mapache: { detras: orejasMapache, marcas: marcasMapache }
};

const ESPECIES = Object.keys(BICHOS);

function cabeza(g, especie = 'zorro') {
  const b = BICHOS[especie] || BICHOS.zorro;
  if (b.detras) b.detras(g);
  craneo(g);
  if (b.delante) b.delante(g);
  hocico(g);
  if (b.marcas) b.marcas(g);
}

// La boca de la rana, mas ancha que la de los demas: la boca que haya puesto
// el gesto (sonrisa, abierta, triste...) se estira dos pixeles por cada lado.
// La mitad izquierda se corre a la izquierda, la derecha a la derecha, y el
// hueco del medio se rellena.
function bocaDeRana(g) {
  for (let y = 15; y <= 18; y++) {
    const fila0 = g[y].slice();
    const esBoca = (x) => fila0[x] === 'o' || fila0[x] === 't';
    if (![...Array(12).keys()].some((i) => esBoca(8 + i))) continue;
    const fondo = y === 18 ? 'm' : 'l';
    for (let x = 8; x <= 19; x++) if (esBoca(x)) g[y][x] = fondo;
    for (let x = 8; x <= 19; x++) {
      if (!esBoca(x)) continue;
      px(g, x <= 13 ? x - 2 : x + 2, y, fila0[x]);
    }
    if (esBoca(13) && esBoca(14)) fila(g, y, 12, 15, fila0[13]);
  }
}

// Lo que va POR ENCIMA del gesto, porque sustituye a la nariz o a la boca:
// el pico del pato y del búho, y el bocón de la rana.
function rasgos(g, especie) {
  if (especie === 'pato') {
    bloque(g, 13, 15, 10, 17, 'k');
    fila(g, 16, 11, 16, 'j');
    fila(g, 13, 10, 17, 'j');
  } else if (especie === 'buho') {
    fila(g, 12, 13, 14, 'k');
    fila(g, 13, 13, 14, 'k');
    fila(g, 14, 13, 14, 'j');
    fila(g, 15, 13, 14, 'j');
  } else if (especie === 'rana') {
    // Naricita sutil de dos motitas tiernas de ranita
    fila(g, 12, 13, 14, 'd');
    bocaDeRana(g);
  } else if (especie === 'conejo') {
    // Naricita pequeña y suave rosada
    fila(g, 13, 13, 14, 'r');
    // Pequeños dientecitos blancos de conejito bajo la boca
    fila(g, 17, 13, 14, 'w');
  } else if (especie === 'erizo') {
    // Naricita redonda y brillante de erizo
    fila(g, 13, 13, 14, 'o');
    px(g, 13, 13, 'w');
  }
}

// ---------- cuerpo sentado ----------
// Rechoncho a propósito: un zorro sentado se ensancha hacia abajo, y así
// además hay sitio de sobra para vestirlo.
function cuerpo(g, especie = 'zorro') {
  fila(g, 18, 9, 18, 'f');
  fila(g, 19, 8, 19, 'f');
  bloque(g, 20, 27, 7, 20, 'f');
  fila(g, 28, 7, 20, 'f');

  // sombra del costado
  bloque(g, 20, 28, 19, 20, 'd');
  px(g, 19, 19, 'd');

  // pechera crema en pico, como un babero
  fila(g, 19, 11, 16, 'l');
  bloque(g, 20, 23, 9, 18, 'l');
  bloque(g, 24, 25, 10, 17, 'l');
  fila(g, 26, 12, 15, 'l');
  fila(g, 27, 13, 14, 'm');
  espejoPx(g, 9, 19, 'm');

  // patas delanteras, separadas por un hueco
  bloque(g, 25, 28, 7, 11, 'f');
  bloque(g, 25, 28, 16, 20, 'f');
  espejoPx(g, 13, 27, 'd');
  espejoPx(g, 13, 28, 'd');
  // deditos claros
  bloque(g, 28, 29, 7, 11, 'l');
  bloque(g, 28, 29, 16, 20, 'l');
  px(g, 8, 29, 'm');
  px(g, 19, 29, 'm');

  // La rana apoya unos pies anchos y abiertos, con tres dedos: asoman un
  // par de pixeles por fuera de las patas (y de los zapatos, si los lleva).
  if (especie === 'rana') {
    fila(g, 28, 5, 11, 'f');
    fila(g, 28, 16, 22, 'f');
    fila(g, 29, 4, 11, 'l');
    fila(g, 29, 16, 23, 'l');
    espejoPx(g, 6, 29, 'm');
    espejoPx(g, 9, 29, 'm');
  }
}

// ---------- ojos y boca ----------
// Ojos diminutos, dos cuadraditos blancos y nada más: es lo que le da la cara
// del zorro de la foto. Con ojos grandes parecía otro bicho.
const OJO_X = 9;
// Tres de ancho por dos de alto. Más altos que anchos parecían ranuras
// blancas pegadas encima del pelo, no ojos. Y apoyados en el naranja liso,
// no a caballo de la banda clara de la frente.
function ojosNormales(g) {
  espejo(g, 10, OJO_X, OJO_X + 2, 'w');
  espejo(g, 11, OJO_X, OJO_X + 2, 'w');
  // La pupila: dos píxeles en la esquina de dentro, la que da a la nariz. Es
  // lo que hace que mire a algún sitio en vez de tener dos manchas blancas.
  espejo(g, 10, OJO_X + 2, OJO_X + 2, 'p');
  espejo(g, 11, OJO_X + 2, OJO_X + 2, 'p');
}
function ojosCerrados(g) {
  // Solo la raya. Antes llevaba una punta suelta a cada lado para insinuar el
  // arco, pero a este tamaño no se lee como una curva: son cuatro motas
  // negras flotando junto a los ojos.
  espejo(g, 11, OJO_X, OJO_X + 2, 'o');
}
function ojosGrandes(g) {
  espejo(g, 9, OJO_X, OJO_X + 2, 'w');
  espejo(g, 10, OJO_X, OJO_X + 2, 'w');
  espejo(g, 11, OJO_X, OJO_X + 2, 'w');
  // de par en par: la pupila se encoge y sube, como cuando te sorprendes
  espejo(g, 10, OJO_X + 2, OJO_X + 2, 'p');
}
function ojosCaidos(g) {
  espejo(g, 10, OJO_X, OJO_X + 2, 'o');
  espejo(g, 11, OJO_X, OJO_X + 2, 'w');
  espejo(g, 11, OJO_X + 2, OJO_X + 2, 'p');
}
function ojoEntornado(g, izquierda) {
  const x0 = izquierda ? OJO_X : W - 1 - (OJO_X + 2);
  // Entornado = medio ojo, todo blanco. El párpado negro por encima se leía
  // como un ojo tachado, no como un ojo a medio cerrar.
  bloque(g, 10, 11, x0, x0 + 2, 'f');
  fila(g, 11, x0, x0 + 2, 'w');
  px(g, izquierda ? x0 + 2 : x0, 11, 'p'); // la pupila sigue mirando adentro
}
function ojoGuinando(g, izquierda) {
  const x0 = izquierda ? OJO_X : W - 1 - (OJO_X + 2);
  bloque(g, 10, 11, x0, x0 + 2, 'f');
  fila(g, 11, x0, x0 + 2, 'o');
}

// Naricita de dos píxeles. Con cuatro de ancho parecía una barra negra
// cruzándole la cara.
function nariz(g) {
  fila(g, 13, 13, 14, 'n');
}
// Sonrisa de arco con las puntas hacia arriba, un poco por debajo de la nariz.
// Es lo que hace que el zorro se vea simpático estando quieto.
// Todas bajan una fila respecto a la nariz: pegadas se leían como una sola
// mancha con el hocico y no se distinguía dónde acababa una y empezaba otra.
function bocaSonrisa(g) {
  fila(g, 16, 12, 15, 'o');
  espejoPx(g, 11, 15, 'o');
}
function bocaAncha(g) {
  fila(g, 16, 11, 16, 'o');
  espejoPx(g, 10, 15, 'o');
}
function bocaAbierta(g) {
  fila(g, 16, 12, 15, 'o');
  bloque(g, 17, 18, 12, 15, 't');
  espejoPx(g, 11, 15, 'o');
}
function bocaTriste(g) {
  fila(g, 17, 12, 15, 'o');
  espejoPx(g, 11, 16, 'o');
}
function bocaLado(g) {
  fila(g, 16, 13, 16, 'o');
  px(g, 12, 15, 'o');
}
// Cejas caidas hacia la nariz. Es lo unico que distingue el enfado: con la
// misma boca y sin cejas, la cara de enfadado y la de triste son la misma.
function cejasEnfado(g) {
  espejoPx(g, OJO_X, 8, 'o');
  espejoPx(g, OJO_X + 1, 8, 'o');
  espejoPx(g, OJO_X + 2, 9, 'o');
}
// Dos lagrimones cayendo por debajo de cada ojo.
function lagrimas(g) {
  espejoPx(g, OJO_X + 1, 12, 'a');
  espejoPx(g, OJO_X + 1, 13, 'a');
  espejoPx(g, OJO_X + 1, 14, 'a');
}
function rubor(g) {
  espejo(g, 12, 6, 7, 'r');
  espejo(g, 13, 6, 7, 'r');
}

const GESTOS = {
  normal: (g) => { ojosNormales(g); nariz(g); bocaSonrisa(g); },
  feliz: (g) => { ojosCerrados(g); nariz(g); bocaAncha(g); },
  muyfeliz: (g) => { ojosCerrados(g); nariz(g); bocaAbierta(g); rubor(g); },
  pensando: (g) => { ojosNormales(g); ojoEntornado(g, false); nariz(g); bocaLado(g); },
  guino: (g) => { ojosNormales(g); ojoGuinando(g, true); nariz(g); bocaAncha(g); },
  sorpresa: (g) => { ojosGrandes(g); nariz(g); bocaAbierta(g); },
  triste: (g) => { ojosCaidos(g); nariz(g); bocaTriste(g); },
  enfadado: (g) => { ojosNormales(g); cejasEnfado(g); nariz(g); bocaTriste(g); },
  llorando: (g) => { ojosCerrados(g); lagrimas(g); nariz(g); bocaAbierta(g); },
  parpadeo: (g) => { ojosCerrados(g); nariz(g); bocaSonrisa(g); }
};

// Rodea la silueta de negro. Cualquier hueco pegado a un píxel pintado pasa a
// ser borde: así no hay que dibujar el contorno a mano.
function contornear(g, hasta) {
  const fuera = new Set(['.', 'o']);
  const copia = g.map((f) => [...f]);
  for (let y = 0; y < hasta; y++) {
    for (let x = 0; x < W; x++) {
      if (g[y][x] !== '.') continue;
      const vecino =
        (y > 0 && !fuera.has(g[y - 1][x])) ||
        (y < hasta - 1 && !fuera.has(g[y + 1][x])) ||
        (x > 0 && !fuera.has(g[y][x - 1])) ||
        (x < W - 1 && !fuera.has(g[y][x + 1]));
      if (vecino) copia[y][x] = 'o';
    }
  }
  return copia;
}

function rect(x0, y0, x1, y1, k) {
  const out = [];
  for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) out.push([x, y, k]);
  return out;
}
function mapaSprite(filas, x0, y0) {
  const px = [];
  filas.forEach((fila, dy) => [...fila].forEach((k, dx) => {
    if (k !== '.') px.push([x0 + dx, y0 + dy, k.toLowerCase()]);
  }));
  return px;
}
// Convierte cada celda del sprite de referencia en cuatro subpíxeles. El
// tamaño exterior se conserva, pero el contorno y los matices ganan resolución.
function mapaSpriteFino(filas, x0, y0, tonos = {}, conservarMayusculas = false) {
  const px = [];
  filas.forEach((fila, dy) => [...fila].forEach((k, dx) => {
    if (k === '.') return;
    const base = conservarMayusculas ? k : k.toLowerCase();
    const colores = tonos[base] || [base, base, base, base];
    [[0, 0], [.5, 0], [0, .5], [.5, .5]].forEach(([ox, oy], i) => {
      px.push([x0 + dx * .5 + ox, y0 + dy * .5 + oy, colores[i]]);
    });
  }));
  return px;
}
function doblarResolucion(filas) {
  return filas.flatMap((fila) => {
    const doble = [...fila].map((k) => k + k).join('');
    return [doble, doble];
  });
}
function marco(x0, y0, x1, y1) {
  const out = [];
  for (let x = x0; x <= x1; x++) { out.push([x, y0, 'a']); out.push([x, y1, 'a']); }
  for (let y = y0; y <= y1; y++) { out.push([x0, y, 'a']); out.push([x1, y, 'a']); }
  return out;
}

// Complementos, en coordenadas [x, y, 'a'|'b'|'c'].
const EXTRAS = {
  // --- cabeza ---
  gorra: {
    a: '#2d5f8a', b: '#1c3f5c', c: '#f0f4f8',
    px: [
      [13, 1, 'c'], [14, 1, 'c'],
      ...rect(7, 2, 20, 2, 'b'),
      ...rect(5, 3, 22, 4, 'a'), ...rect(4, 5, 23, 7, 'a'),
      ...rect(18, 4, 23, 7, 'b'),
      ...rect(13, 4, 14, 5, 'c'),
      ...rect(3, 8, 24, 8, 'b'),
      // Visera dinámica curvada
      ...rect(18, 9, 26, 9, 'b'), ...rect(20, 10, 27, 10, 'b'), ...rect(22, 11, 27, 11, 'b')
    ]
  },
  chistera: {
    a: '#2b2b33', b: '#8a1f2f', c: '#4a4a55',
    px: [
      ...rect(6, 0, 21, 0, 'a'), [7, 0, 'c'], [8, 0, 'c'],
      ...rect(6, 1, 21, 5, 'a'), ...rect(8, 1, 9, 5, 'c'), ...rect(19, 1, 21, 5, '#1e1e24'),
      // Cinta de seda roja
      ...rect(5, 6, 22, 7, 'b'),
      // Ala ancha victoriana
      [2, 7, 'a'], [25, 7, '#1e1e24'],
      ...rect(2, 8, 25, 8, 'a'), ...rect(3, 9, 24, 9, '#1e1e24')
    ]
  },
  corona: {
    a: '#f6cf4a', b: '#b8860b', c: '#e8558f',
    px: [
      // Corona más grande, con tres puntas marcadas y simétricas.
      [2, 1, 'a'], [24, 1, 'a'],
      ...rect(2, 2, 4, 6, 'a'), ...rect(22, 2, 24, 6, 'a'),
      ...rect(12, 0, 14, 5, 'a'),
      ...rect(7, 2, 9, 6, 'a'), ...rect(17, 2, 19, 6, 'a'),
      ...rect(4, 5, 22, 7, 'a'),
      // Interior de terciopelo y reflejos dorados.
      ...rect(6, 6, 20, 7, '#8a1f2f'),
      [3, 2, 'c'], [13, 1, '#ffffff'], [23, 2, '#3b82f6'],
      [8, 3, '#22c55e'], [18, 3, '#e8558f'],
      // Base ancha, con una línea de luz y sombra inferior.
      ...rect(3, 8, 23, 8, 'a'),
      ...rect(4, 9, 22, 9, 'b'),
      ...rect(7, 9, 10, 9, 'a'), ...rect(16, 9, 19, 9, 'a')
    ]
  },
  flor: {
    a: '#e8558f', b: '#f7d94c', c: '#4d8a52',
    px: [
      ...rect(19, 1, 24, 5, 'a'),
      [21, 2, 'b'], [22, 2, 'b'], [21, 3, 'b'], [22, 3, 'b'],
      [18, 5, 'c'], [24, 5, 'c'], [25, 6, 'c'], [25, 7, 'c']
    ]
  },
  orejeras: {
    a: '#c0559b', b: '#8d3b72', c: '#f7d3ea',
    px: [
      // Diadema superior
      ...rect(6, 4, 21, 4, 'b'), ...rect(4, 5, 6, 8, 'b'), ...rect(21, 5, 23, 8, 'b'),
      // Almohadillas esponjosas gigantes
      ...rect(1, 9, 5, 15, 'a'), ...rect(22, 9, 26, 15, 'a'),
      ...rect(2, 10, 4, 14, 'c'), ...rect(23, 10, 25, 14, 'c')
    ]
  },
  auriculares: {
    a: '#33384a', b: '#5b6478', c: '#7bd88f',
    px: [
      // Diadema acolchada
      ...rect(6, 3, 21, 3, 'b'), ...rect(7, 2, 20, 2, 'a'),
      ...rect(4, 4, 5, 8, 'b'), ...rect(22, 4, 23, 8, 'b'),
      // Auriculares circumaurales pro
      ...rect(1, 9, 5, 16, 'a'), ...rect(22, 9, 26, 16, 'a'),
      ...rect(2, 10, 4, 15, 'b'), ...rect(23, 10, 25, 15, 'b'),
      [3, 12, 'c'], [3, 13, 'c'], [24, 12, 'c'], [24, 13, 'c']
    ]
  },
  // Sombrero tirolés: fieltro verde amplio, cinta oscura y el Gamsbart (penacho alpino)
  tirolerhut: {
    a: '#3d6b4a', b: '#243f2c', c: '#8a6b3a',
    px: [
      // Copa del sombrero con hendidura alpina
      ...rect(8, 1, 19, 1, 'a'), [13, 1, 'b'], [14, 1, 'b'],
      ...rect(7, 2, 20, 2, 'a'), [13, 2, 'b'], [14, 2, 'b'],
      ...rect(6, 3, 21, 6, 'a'), ...rect(18, 3, 21, 6, 'b'),
      // Cinta oscura y broche
      ...rect(5, 7, 22, 7, 'b'), ...rect(13, 7, 14, 7, '#fef08a'),
      // Ala ancha curvada que viste toda la cabeza
      ...rect(3, 8, 24, 8, 'a'),
      ...rect(2, 9, 25, 9, 'b'),
      // Gamsbart (penacho de pelo de gamuza con pluma dorada en el lateral)
      [20, 6, 'c'], [21, 5, 'c'], [21, 4, 'c'], [22, 3, 'c'], [22, 2, 'c'], [23, 1, 'c'], [23, 0, '#fef08a'], [24, 1, 'c']
    ]
  },
  sombreroElegante: {
    a: '#858b95', b: '#555b66', c: '#9e2a2b',
    px: [
      // Copa con pliegue central
      ...rect(8, 1, 19, 1, 'a'), [13, 1, 'b'], [14, 1, 'b'],
      ...rect(7, 2, 20, 2, 'a'), [12, 2, 15, 2, 'b'],
      ...rect(6, 3, 21, 6, 'a'), ...rect(18, 3, 21, 6, 'b'),
      // Cinta de seda roja y pluma
      ...rect(5, 7, 22, 7, 'c'),
      [5, 5, 'c'], [4, 4, '#d4af37'], [4, 3, '#fef08a'],
      // Ala ancha con curva elegante
      [1, 7, 'a'], [26, 7, 'b'],
      ...rect(2, 8, 25, 8, 'a'),
      ...rect(2, 9, 25, 9, 'b')
    ]
  },
  // --- ojos ---
  gafas: {
    a: '#2d2d38', b: 'rgba(185, 225, 255, 0.32)',
    px: [
      ...marco(6, 9, 12, 13), ...marco(15, 9, 21, 13),
      ...rect(13, 11, 14, 11, 'a'),
      ...rect(7, 10, 11, 12, 'b'), ...rect(16, 10, 20, 12, 'b')
    ]
  },
  gafasol: {
    a: '#1b1b22', b: 'rgba(35, 35, 48, 0.72)', c: 'rgba(255, 255, 255, 0.45)',
    px: [
      ...marco(6, 9, 12, 13), ...marco(15, 9, 21, 13),
      ...rect(13, 11, 14, 11, 'a'),
      ...rect(7, 10, 11, 12, 'b'), ...rect(16, 10, 20, 12, 'b'),
      [7, 10, 'c'], [8, 10, 'c'], [16, 10, 'c'], [17, 10, 'c']
    ]
  },
  monoculo: {
    a: '#d9a520', b: 'rgba(215, 238, 255, 0.42)', c: 'rgba(255, 255, 255, 0.8)',
    px: [
      ...marco(15, 9, 21, 13), ...rect(16, 10, 20, 12, 'b'),
      [16, 10, 'c'],
      [21, 14, 'a'], [21, 15, 'a'], [20, 16, 'a']
    ]
  },
  // --- cuello ---
  bufanda: {
    a: '#c0392b', b: '#8e2a20',
    px: [
      ...rect(10, 18, 17, 18, 'a'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 20, 'b'), ...rect(8, 21, 19, 21, 'a'),
      ...rect(10, 19, 11, 21, 'b'), ...rect(16, 19, 17, 21, 'b'),
      ...rect(19, 22, 20, 26, 'a'), ...rect(19, 27, 20, 27, 'b')
    ]
  },
  pajarita: {
    a: '#8a1f2f', b: '#5c1420',
    px: [
      ...rect(9, 19, 11, 21, 'a'), ...rect(16, 19, 18, 21, 'a'),
      ...rect(12, 19, 15, 21, 'b'), [13, 20, 'a'], [14, 20, 'a']
    ]
  },
  // --- pies ---
  zapatucos: {
    a: '#7a4a2b', b: '#553220', c: '#e8c98f',
    px: [
      ...rect(7, 27, 11, 28, 'a'), ...rect(16, 27, 20, 28, 'a'),
      ...rect(7, 29, 12, 29, 'b'), ...rect(15, 29, 20, 29, 'b'),
      ...rect(8, 27, 10, 27, 'c'), ...rect(17, 27, 19, 27, 'c')
    ]
  },
  // --- objetos: se sostienen con la pata derecha ---
  trofeo: {
    a: '#f2c230', b: '#a87c12', c: '#fff0bc',
    px: [
      ...rect(21, 21, 24, 24, 'a'), ...rect(20, 22, 20, 23, 'b'), ...rect(25, 22, 25, 23, 'b'),
      ...rect(22, 21, 23, 22, 'c'),
      ...rect(22, 25, 23, 26, 'b'), ...rect(20, 27, 25, 28, 'a'), ...rect(20, 28, 25, 28, 'b')
    ]
  },
  baston: {
    a: '#6d4c2b', b: '#422a14', c: '#d4af37',
    px: [
      ...rect(21, 18, 23, 18, 'c'),
      [20, 19, 'c'], [24, 19, 'c'], [22, 19, '#fff1a8'],
      [20, 20, 'c'], [24, 20, 'c'],
      [20, 21, 'c'], ...rect(23, 21, 24, 21, 'c'),
      ...rect(23, 22, 23, 27, 'a'), ...rect(24, 22, 24, 27, 'b'),
      [23, 28, 'c'], [24, 28, 'c']
    ]
  },
  bastonrey: {
    a: '#f2c230', b: '#e8558f', c: '#a87c12',
    px: [
      ...rect(22, 20, 23, 21, 'a'), [21, 21, 'a'], [24, 21, 'a'], [22, 19, 'a'], [23, 19, 'a'],
      [22, 20, 'b'], [23, 20, 'b'],
      ...rect(22, 22, 23, 28, 'c')
    ]
  },
  // --- de rey (se gana con coronas) ---
  capa: {
    a: '#8e1f38', b: '#631426', c: '#f2c230',
    px: [
      ...rect(9, 18, 18, 18, 'a'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(6, 20, 8, 28, 'a'), ...rect(19, 20, 21, 28, 'a'),
      ...rect(12, 19, 15, 19, 'c'), [13, 20, 'c'], [14, 20, 'c']
    ]
  },
  zapatosrey: {
    a: '#8e1f38', b: '#5c1424', c: '#f2c230',
    px: [
      ...rect(7, 27, 11, 28, 'a'), ...rect(16, 27, 20, 28, 'a'),
      ...rect(7, 29, 11, 29, 'b'), ...rect(16, 29, 20, 29, 'b'),
      [9, 27, 'c'], [18, 27, 'c']
    ]
  },
  trajerey: {
    a: '#6b2d8e', b: '#4a1d63', c: '#f5f0e6',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 27, 'a'), ...rect(19, 20, 20, 27, 'b'),
      // el armiño: el ribete blanco con sus motitas
      ...rect(7, 21, 20, 22, 'c'), [9, 22, 'b'], [13, 22, 'b'], [17, 22, 'b'],
      ...rect(7, 28, 20, 28, 'c'),
      ...rect(12, 23, 15, 27, 'c'), [13, 25, 'a'], [14, 25, 'a']
    ]
  },
  // --- de deportista (se gana con la racha) ---
  cinta: {
    a: '#2f7de0', b: '#1c56a0', c: '#ffffff',
    px: [
      ...rect(4, 7, 23, 7, 'a'), ...rect(4, 8, 23, 8, 'b'),
      ...rect(10, 7, 13, 7, 'c'), ...rect(15, 7, 17, 7, 'c')
    ]
  },
  zapatillas: {
    a: '#f5f5f5', b: '#2f7de0', c: '#33333f',
    px: [
      ...rect(7, 27, 11, 28, 'a'), ...rect(16, 27, 20, 28, 'a'),
      ...rect(7, 29, 11, 29, 'c'), ...rect(16, 29, 20, 29, 'c'),
      ...rect(8, 27, 10, 27, 'b'), ...rect(17, 27, 19, 27, 'b')
    ]
  },
  chandal: {
    a: '#2f7de0', b: '#1c56a0', c: '#ffffff',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 27, 'a'), ...rect(19, 20, 20, 27, 'b'),
      // las tres rayas por las mangas
      ...rect(7, 20, 7, 27, 'c'), ...rect(20, 20, 20, 27, 'c'),
      ...rect(9, 20, 9, 27, 'c'), ...rect(18, 20, 18, 27, 'c'),
      ...rect(7, 28, 20, 28, 'b')
    ]
  },
  // --- ropa (solo con cuerpo) ---
  // Todas cubren el torso de la fila 18 a la 27 y las columnas 7 a 20, que es
  // lo que mide el cuerpo. Las mangas caen por fuera, sobre los brazos.
  camiseta: {
    a: '#3f7ec4', b: '#2f61a0', c: '#ffffff',
    px: [
      ...rect(9, 18, 18, 18, 'a'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 26, 'a'),
      ...rect(19, 20, 20, 26, 'b'), ...rect(7, 26, 20, 26, 'b'),
      ...rect(7, 20, 8, 23, 'a'), ...rect(19, 20, 20, 23, 'a'),
      ...rect(12, 22, 15, 25, 'c')
    ]
  },
  jersey: {
    a: '#b5533f', b: '#8d3c2c', c: '#e8c98f',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 27, 'a'),
      ...rect(7, 22, 20, 22, 'c'), ...rect(7, 25, 20, 25, 'c'),
      ...rect(19, 20, 20, 27, 'b'), ...rect(7, 27, 20, 27, 'b')
    ]
  },
  tracht: {
    a: '#2f6b45', b: '#1f4a2f', c: '#e8dcc0',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 22, 'a'),
      ...rect(11, 19, 16, 22, 'c'), ...rect(7, 23, 20, 27, 'c'),
      ...rect(7, 23, 20, 23, 'b'), ...rect(13, 20, 14, 22, 'b'),
      ...rect(19, 20, 20, 22, 'b')
    ]
  },
  abrigo: {
    a: '#4a4f63', b: '#333747', c: '#c8a06a',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 28, 'a'),
      ...rect(13, 19, 14, 28, 'b'),
      ...rect(10, 19, 11, 21, 'c'), ...rect(16, 19, 17, 21, 'c'),
      ...rect(19, 20, 20, 28, 'b'), [12, 23, 'c'], [12, 26, 'c']
    ]
  },
  traje: {
    a: '#23252e', b: '#13141a', c: '#f8fafc',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 27, 'a'), ...rect(19, 20, 20, 27, 'b'),
      // Camisa blanca impoluta
      ...rect(12, 18, 15, 19, 'c'),
      ...rect(11, 20, 16, 20, 'c'),
      ...rect(12, 21, 15, 22, 'c'),
      ...rect(13, 23, 14, 23, 'c'),
      // Corbata oscura
      ...rect(13, 19, 14, 22, 'b'),
      // Solapas satinadas
      ...rect(10, 19, 11, 23, 'b'), ...rect(16, 19, 17, 23, 'b'),
      // Pañuelo de bolsillo
      [9, 22, '#c0392b'], [10, 22, '#ffffff'],
      // Botón dorado y cierre de la chaqueta
      [13, 25, '#d4af37'], ...rect(13, 24, 14, 28, 'b'),
      ...rect(7, 28, 20, 28, 'b')
    ]
  },
  // Trachtenanzug: chaqueta de loden con solapas oscuras, camisa clara y
  // botones de asta. El premio gordo.
  trachtenanzug: {
    a: '#3d6b4a', b: '#243f2c', c: '#ece3cb',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 28, 'a'),
      ...rect(19, 20, 20, 28, 'b'),
      ...rect(12, 20, 15, 27, 'c'),
      ...rect(10, 19, 11, 24, 'b'), ...rect(16, 19, 17, 24, 'b'),
      [11, 25, 'c'], [11, 27, 'c'], [16, 25, 'c'], [16, 27, 'c'],
      ...rect(7, 28, 20, 28, 'b')
    ]
  },
  // --- el equipo de reina (con coronas) ---
  // La diadema: brillante tiara de platino con piedras preciosas
  diadema: {
    a: '#e8e8f0', b: '#a9a9bb', c: '#e8558f',
    px: [
      // Base de platino arqueada y ancha
      ...rect(5, 6, 22, 7, 'a'), ...rect(5, 8, 22, 8, 'b'),
      // Picos de diamantes y rubíes
      ...rect(7, 4, 8, 5, 'a'), [7, 3, 'c'], [8, 3, 'c'],
      ...rect(10, 3, 11, 5, 'a'), [10, 2, 'c'], [11, 2, 'c'],
      ...rect(13, 1, 14, 5, 'a'), [13, 0, 'c'], [14, 0, 'c'], [13, 1, 'c'], [14, 1, 'c'],
      ...rect(16, 3, 17, 5, 'a'), [16, 2, 'c'], [17, 2, 'c'],
      ...rect(19, 4, 20, 5, 'a'), [19, 3, 'c'], [20, 3, 'c'],
      // Destellos en la base
      [9, 7, 'c'], [13, 7, 'c'], [14, 7, 'c'], [18, 7, 'c']
    ]
  },
  // El collar: dos vueltas de perlas y la piedra gorda en medio.
  collarReina: {
    a: '#e8e8f0', b: '#a9a9bb', c: '#e8558f',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      [8, 19, 'b'], [10, 19, 'b'], [12, 19, 'b'], [15, 19, 'b'], [17, 19, 'b'], [19, 19, 'b'],
      ...rect(12, 20, 15, 22, 'c'), ...rect(13, 21, 14, 21, 'a')
    ]
  },
  // El vestido: falda larga, cuerpo claro y el ribete de plata.
  vestidoReina: {
    a: '#b5397a', b: '#8a2259', c: '#f0e6f5',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(8, 20, 19, 23, 'a'), ...rect(6, 24, 21, 28, 'a'),
      ...rect(18, 20, 19, 23, 'b'), ...rect(19, 24, 21, 28, 'b'),
      ...rect(11, 19, 16, 22, 'c'), ...rect(6, 28, 21, 28, 'c'),
      [12, 24, 'c'], [15, 26, 'c'], [9, 26, 'c'], [18, 25, 'c']
    ]
  },
  // Zapatos de cristal: casi transparentes, con el brillo arriba.
  cristal: {
    a: '#cfeffd', b: '#8ec9e6', c: '#ffffff',
    px: [
      ...rect(7, 27, 11, 28, 'a'), ...rect(16, 27, 20, 28, 'a'),
      ...rect(7, 29, 11, 29, 'b'), ...rect(16, 29, 20, 29, 'b'),
      [8, 27, 'c'], [17, 27, 'c'], [10, 28, 'c'], [19, 28, 'c']
    ]
  },
  // El orbe: la bola con la cruz, en la manita.
  orbe: {
    a: '#e8e8f0', b: '#a9a9bb', c: '#e8558f',
    px: [
      ...rect(21, 23, 25, 27, 'a'),
      ...rect(21, 26, 25, 27, 'b'), [22, 24, 'c'], [24, 25, 'c'],
      ...rect(22, 25, 24, 25, 'b'),
      ...rect(23, 20, 23, 22, 'a'), ...rect(22, 21, 24, 21, 'a'), [23, 19, 'c']
    ]
  },
  // --- cabeza (añadidos) ---
  paja: {
    a: '#e3c37a', b: '#c49a4a', c: '#8a5a3b',
    px: [
      // Copa del sombrero de paja amplia
      ...rect(7, 2, 20, 2, 'a'),
      ...rect(6, 3, 21, 6, 'a'), ...rect(18, 3, 21, 6, 'b'),
      // Cinta marrón rústica
      ...rect(5, 7, 22, 7, 'c'),
      // Ala ancha veraniega
      [0, 7, 'a'], [27, 7, 'b'],
      ...rect(1, 8, 26, 8, 'a'),
      ...rect(1, 9, 26, 9, 'b')
    ]
  },
  cocinero: {
    a: '#ffffff', b: '#dfe4ea', c: '#c8cdd4',
    px: [
      // Domo abullonado y alto de chef
      ...rect(5, 0, 22, 1, 'a'),
      [8, 0, 'b'], [13, 0, 'b'], [18, 0, 'b'],
      ...rect(4, 2, 23, 5, 'a'),
      ...rect(4, 2, 5, 5, 'b'), ...rect(22, 2, 23, 5, 'b'),
      // Pliegues inferiores y banda de ajuste
      ...rect(5, 6, 22, 7, 'a'),
      ...rect(4, 8, 23, 9, 'c')
    ]
  },
  navidad: {
    a: '#c0392b', b: '#8e2a1e', c: '#ffffff',
    px: [
      // Pompón blanco de pelo cayendo a la derecha
      ...rect(22, 1, 25, 4, 'c'),
      // Cuerpo de terciopelo rojo
      ...rect(17, 2, 22, 4, 'a'), ...rect(12, 3, 20, 5, 'a'),
      ...rect(5, 4, 18, 7, 'a'), ...rect(15, 5, 20, 7, 'b'),
      // Banda ancha de felpa blanca
      ...rect(3, 8, 24, 9, 'c'),
      [4, 9, '#e2e8f0'], [10, 9, '#e2e8f0'], [17, 9, '#e2e8f0'], [23, 9, '#e2e8f0']
    ]
  },

  // --- ojos (añadidos) ---
  gafasNerd: {
    a: '#202028', b: 'rgba(215, 235, 255, 0.38)', c: 'rgba(255, 255, 255, 0.75)',
    px: [
      ...marco(5, 8, 12, 14), ...marco(15, 8, 22, 14),
      ...rect(13, 10, 14, 11, 'a'),
      ...rect(6, 9, 11, 13, 'b'), ...rect(16, 9, 21, 13, 'b'),
      [6, 9, 'c'], [7, 9, 'c'], [16, 9, 'c'], [17, 9, 'c']
    ]
  },
  gafasEsqui: {
    a: '#2c3e50', b: 'rgba(100, 210, 255, 0.52)', c: 'rgba(255, 255, 255, 0.85)',
    px: [
      ...rect(4, 8, 23, 8, 'a'), ...rect(5, 9, 22, 13, 'a'),
      ...rect(7, 10, 20, 12, 'b'), ...rect(7, 10, 9, 10, 'c'),
      ...rect(3, 9, 4, 11, 'a'), ...rect(23, 9, 24, 11, 'a')
    ]
  },
  gafas3d: {
    a: '#f4f6f7', b: 'rgba(231, 76, 60, 0.48)', c: 'rgba(58, 198, 224, 0.48)', d: 'rgba(255, 255, 255, 0.75)',
    px: [
      ...rect(6, 9, 12, 9, 'a'), ...rect(6, 13, 12, 13, 'a'),
      ...rect(6, 10, 6, 12, 'a'), ...rect(12, 10, 12, 12, 'a'),
      ...rect(7, 10, 11, 12, 'b'),
      ...rect(15, 9, 21, 9, 'a'), ...rect(15, 13, 21, 13, 'a'),
      ...rect(15, 10, 15, 12, 'a'), ...rect(21, 10, 21, 12, 'a'),
      ...rect(16, 10, 20, 12, 'c'), ...rect(13, 11, 14, 11, 'a'),
      [7, 10, 'd'], [16, 10, 'd']
    ]
  },
  antifaz: {
    a: '#8e44ad', b: '#f1c40f', c: '#5b2c6f',
    px: [
      ...rect(4, 8, 23, 8, 'c'), ...rect(5, 9, 22, 13, 'a'),
      ...rect(7, 10, 11, 12, 'c'), ...rect(16, 10, 20, 12, 'c'),
      [5, 9, 'b'], [22, 9, 'b'], ...rect(13, 9, 14, 9, 'b')
    ]
  },

  // --- cuello (añadidos) ---
  cordon: {
    a: '#6e4b2a', b: '#4a3119', c: '#c9a227',
    px: [
      ...rect(9, 18, 18, 18, 'a'), ...rect(8, 19, 19, 19, 'b'),
      ...rect(13, 20, 14, 21, 'c'), [13, 22, 'b']
    ]
  },
  panuelo: {
    a: '#c0392b', b: '#8e2a1e', c: '#f4f6f7',
    px: [
      ...rect(9, 18, 18, 18, 'a'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(10, 20, 17, 21, 'a'), ...rect(12, 22, 15, 23, 'b'),
      [11, 20, 'c'], [16, 21, 'c'], [13, 19, 'c']
    ]
  },
  perlas: {
    a: '#f4f6f7', b: '#cfd6dd', c: '#d9a520',
    px: [
      ...rect(9, 18, 18, 18, 'b'),
      [9, 18, 'a'], [11, 18, 'a'], [13, 19, 'a'], [14, 19, 'a'], [16, 18, 'a'], [18, 18, 'a'],
      ...rect(12, 19, 15, 19, 'b'), ...rect(13, 20, 14, 21, 'c')
    ]
  },

  // --- ropa (añadidos) ---
  camisa: {
    a: '#eaf2fb', b: '#c7d6e6', c: '#2f61a0',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 27, 'a'), ...rect(19, 20, 20, 27, 'b'),
      ...rect(10, 19, 11, 22, 'c'), ...rect(16, 19, 17, 22, 'c'),
      [13, 22, 'b'], [13, 25, 'b'], ...rect(7, 27, 20, 27, 'b')
    ]
  },
  rebeca: {
    a: '#8d6e63', b: '#5d4037', c: '#d7ccc8',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 28, 'a'), ...rect(12, 19, 15, 28, 'c'),
      ...rect(19, 20, 20, 28, 'b'),
      [13, 21, 'b'], [13, 24, 'b'], [13, 27, 'b']
    ]
  },
  chubasquero: {
    a: '#f1c40f', b: '#c49a0a', c: '#2c3e50',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 28, 'a'), ...rect(19, 20, 20, 28, 'b'),
      ...rect(13, 19, 14, 28, 'c'), ...rect(7, 24, 20, 24, 'b')
    ]
  },
  peto: {
    a: '#3f6fa8', b: '#2b4f79', c: '#e8c98f',
    px: [
      ...rect(10, 18, 11, 21, 'a'), ...rect(16, 18, 17, 21, 'a'),
      ...rect(9, 21, 18, 28, 'a'), ...rect(17, 21, 18, 28, 'b'),
      ...rect(9, 28, 18, 28, 'b'), [11, 22, 'c'], [16, 22, 'c']
    ]
  },

  // --- pies (añadidos) ---
  pantuflas: {
    a: '#b5838d', b: '#6d4c5b', c: '#ffe8ee',
    px: [
      ...rect(7, 27, 11, 29, 'a'), ...rect(16, 27, 20, 29, 'a'),
      ...rect(7, 29, 12, 29, 'b'), ...rect(15, 29, 20, 29, 'b'),
      ...rect(8, 27, 10, 27, 'c'), ...rect(17, 27, 19, 27, 'c'),
      [7, 26, 'c'], [20, 26, 'c']
    ]
  },
  sandalias: {
    a: '#c9a227', b: '#8a6d14', c: '#e8c98f',
    px: [
      ...rect(7, 28, 11, 29, 'a'), ...rect(16, 28, 20, 29, 'a'),
      ...rect(7, 29, 12, 29, 'b'), ...rect(15, 29, 20, 29, 'b'),
      [8, 27, 'c'], [10, 27, 'c'], [17, 27, 'c'], [19, 27, 'c']
    ]
  },
  katiuskas: {
    a: '#2e86c1', b: '#1b4f72', c: '#f4f6f7',
    px: [
      ...rect(7, 24, 11, 29, 'a'), ...rect(16, 24, 20, 29, 'a'),
      ...rect(7, 29, 12, 29, 'b'), ...rect(15, 29, 20, 29, 'b'),
      ...rect(7, 25, 11, 25, 'c'), ...rect(16, 25, 20, 25, 'c')
    ]
  },
  patines: {
    a: '#ecf0f1', b: '#aeb6bf', c: '#e74c3c',
    px: [
      ...rect(7, 25, 11, 28, 'a'), ...rect(16, 25, 20, 28, 'a'),
      ...rect(7, 28, 12, 28, 'b'), ...rect(15, 28, 20, 28, 'b'),
      [7, 29, 'c'], [9, 29, 'c'], [11, 29, 'c'],
      [16, 29, 'c'], [18, 29, 'c'], [20, 29, 'c']
    ]
  },

  // --- objetos (añadidos) ---
  camara: {
    a: '#33333f', b: '#1b1b22', c: '#7bd8ff',
    px: [
      ...rect(20, 22, 25, 27, 'a'), ...rect(22, 23, 24, 26, 'c'),
      [23, 24, 'b'], [23, 25, 'b'], ...rect(21, 21, 23, 21, 'b')
    ]
  },
  guitarra: {
    a: '#d58a4e', b: '#a85c32', c: '#f1cc7b', d: '#422b24', e: '#fff1c6', escala: 1.34,
    px: [
      // Mástil corto y caja redondeada, con cintura suave y boca central.
      [22, 12, 'd'], [23, 12, 'd'], [24, 12, 'd'], [21, 13, 'd'], ...rect(22, 13, 24, 14, 'a'), [25, 13, 'd'],
      [21, 14, 'd'], ...rect(22, 14, 24, 21, 'a'), [25, 14, 'd'],
      [22, 15, 'c'], [23, 15, 'c'], [24, 15, 'c'], [22, 16, 'c'], [23, 16, 'c'], [24, 16, 'c'],
      [21, 21, 'd'], ...rect(22, 21, 24, 22, 'a'), [25, 21, 'd'],
      [21, 22, 'd'], ...rect(22, 22, 24, 22, 'a'), [25, 22, 'd'],
      [20, 23, 'd'], ...rect(21, 23, 25, 23, 'a'), [26, 23, 'd'],
      [20, 24, 'd'], ...rect(21, 24, 25, 24, 'a'), [26, 24, 'd'],
      [19, 25, 'd'], ...rect(20, 25, 26, 27, 'a'), [27, 25, 'd'],
      [19, 26, 'd'], [27, 26, 'd'], [19, 27, 'd'], [27, 27, 'd'],
      [20, 28, 'd'], ...rect(21, 28, 25, 28, 'a'), [26, 28, 'd'],
      [21, 29, 'd'], [22, 29, 'a'], [23, 29, 'a'], [24, 29, 'a'], [25, 29, 'd'],
      [20, 25, 'c'], [21, 24, 'c'], [22, 24, 'c'], [24, 24, 'c'], [25, 25, 'c'],
      [22, 26, 'd'], [23, 26, 'e'], [24, 26, 'd'],
      [23, 23, 'e'], [23, 24, 'e'], [23, 25, 'e'], [23, 27, 'e'], [23, 28, 'e']
    ]
  },
  trebol: {
    a: '#2c974f', b: '#94df72', c: '#17452e', d: '#d9efaa', escala: 1.34,
    px: [
      // Cuatro hojas redondas, juntas en un centro claro y tallo separado.
      [21, 17, 'c'], [22, 17, 'c'], [20, 18, 'c'], [21, 18, 'c'], [22, 18, 'c'], [23, 18, 'c'], [21, 19, 'c'], [22, 19, 'c'],
      [24, 17, 'c'], [25, 17, 'c'], [23, 18, 'c'], [24, 18, 'c'], [25, 18, 'c'], [26, 18, 'c'], [24, 19, 'c'], [25, 19, 'c'],
      [20, 21, 'c'], [21, 20, 'c'], [22, 20, 'c'], [23, 20, 'c'], [21, 21, 'c'], [22, 21, 'c'], [21, 22, 'c'], [22, 22, 'c'],
      [24, 20, 'c'], [25, 20, 'c'], [26, 21, 'c'], [27, 21, 'c'], [24, 21, 'c'], [25, 21, 'c'], [25, 22, 'c'], [26, 22, 'c'],
      [21, 18, 'a'], [22, 18, 'b'], [24, 18, 'a'], [25, 18, 'b'],
      [21, 21, 'a'], [22, 21, 'b'], [25, 21, 'a'], [26, 21, 'b'],
      [22, 19, 'a'], [23, 19, 'd'], [24, 19, 'a'], [23, 20, 'd'], [23, 21, 'a'],
      [23, 22, 'd'], [23, 23, 'd'], [24, 24, 'd'], [25, 25, 'd'], [26, 26, 'c']
    ]
  },
  peluche: {
    a: '#9a613d', b: '#68442f', c: '#d9955b', d: '#f4d5ad', e: '#292b32', escala: 1.12,
    px: [
      // Osito de peluche: orejas redondas, cabeza, hocico y cuerpo mullido.
      [21, 17, 'b'], [22, 17, 'b'], [25, 17, 'b'], [26, 17, 'b'],
      [20, 18, 'b'], [21, 18, 'a'], [22, 18, 'a'], [23, 18, 'b'], [24, 18, 'b'], [25, 18, 'a'], [26, 18, 'a'], [27, 18, 'b'],
      [20, 19, 'b'], ...rect(21, 19, 26, 19, 'a'), [27, 19, 'b'],
      [19, 20, 'b'], ...rect(20, 20, 27, 22, 'a'), [28, 20, 'b'],
      [19, 21, 'b'], [28, 21, 'b'], [20, 22, 'b'], [27, 22, 'b'],
      [21, 23, 'b'], [22, 23, 'a'], [23, 23, 'a'], [24, 23, 'a'], [25, 23, 'a'], [26, 23, 'b'],
      [20, 24, 'b'], ...rect(21, 24, 26, 27, 'a'), [27, 24, 'b'],
      [19, 25, 'b'], [20, 25, 'a'], [27, 25, 'a'], [28, 25, 'b'],
      [19, 26, 'b'], [20, 26, 'a'], [27, 26, 'a'], [28, 26, 'b'],
      [20, 27, 'b'], [21, 27, 'a'], [22, 27, 'a'], [25, 27, 'a'], [26, 27, 'a'], [27, 27, 'b'],
      [21, 28, 'b'], [22, 28, 'b'], [25, 28, 'b'], [26, 28, 'b'],
      [22, 20, 'c'], [23, 20, 'd'], [24, 20, 'd'], [25, 20, 'c'], [22, 21, 'd'], [23, 21, 'd'], [24, 21, 'd'], [25, 21, 'd'],
      [22, 20, 'e'], [25, 20, 'e'], [23, 22, 'b'], [24, 22, 'b']
    ]
  },
  cocheRC: {
    k: '#080b0e', r: '#c81818', y: '#ffd52e', d: '#292b2d', escala: 1.3,
    px: mapaSprite([
      '..kkk.....k................',
      '..drd....rd................',
      '..drdkkrrry.k.kkkkk........',
      '..kkddkkrrrrrrrrkddkk......',
      '...kdkdkrrrrrrrkdkkdrkk....',
      '...kdkdkrrrrrrkkdkkdrrrk...',
      '....kkkkkdkkkk..kkkkkkkk...'
    ], 4, 23)
  },
  robot: {
    k: '#172839', b: '#244b70', s: '#4f9fc0', c: '#a9e5e8', w: '#e2f5e7', e: '#18272b',
    o: '#ec9b24', y: '#ffd33e', escala: .6, pixelStep: .5,
    px: mapaSpriteFino(doblarResolucion([
      '......kkk......',
      '......koyk.....',
      '...kkkkkkkkk...',
      '..kbbbbbbbbb k..',
      '.kbbsssssssbbk.',
      '.kbscccccccsbk.',
      '.kbscccccccsbk.',
      '.kbsceeeec csbk.',
      '.kbsceweec csbk.',
      '.kbscccccccsbk.',
      '.kbbsssssssbbk.',
      '..kkkkkkkkkkk..',
      '....kkkkkkk....',
      '..kkkoookkkk...',
      '.kkkkyyyyykkk..',
      'kkkkkkkkkkkkkkk',
      'kkkoookkkkkookk',
      'kkkkkkkkkkkkkkk',
      '...kkkkkkkkk...',
      '....kyy...kyy...',
      '....kyy...kyy...',
      '....kkk...kkk...'
    ].map((row) => row.replaceAll(' ', '.'))), 20, 8, {
      b: ['b', 'b', 's', 'b'], s: ['s', 's', 's', 'b'],
      c: ['w', 'c', 'c', 'c'], o: ['y', 'o', 'o', 'o'], y: ['y', 'y', 'o', 'y']
    })
  },
  // --- cabeza (con monedas) ---
  gorroLana: {
    a: '#c0392b', b: '#8e2a1e', c: '#f5e6d3',
    px: [
      // Pompón de lana grande y esponjoso
      ...rect(10, 0, 17, 2, 'c'),
      // Cuerpo tejido del gorro
      ...rect(5, 2, 22, 3, 'a'),
      ...rect(4, 4, 23, 6, 'a'), ...rect(19, 4, 23, 6, 'b'),
      // Dobladillo acanalado ancho
      ...rect(3, 7, 24, 9, 'c'),
      [5, 9, 'b'], [9, 9, 'b'], [13, 9, 'b'], [14, 9, 'b'], [18, 9, 'b'], [22, 9, 'b']
    ]
  },
  boina: {
    a: '#2c3e50', b: '#1a252f', c: '#c0392b',
    px: [
      // Rabillo superior de la boina
      [13, 0, 'b'], [14, 0, 'b'], [13, 1, 'b'], [14, 1, 'b'],
      // Vuelo abombado ladeado
      ...rect(7, 2, 23, 3, 'a'),
      ...rect(4, 4, 25, 7, 'a'), ...rect(20, 4, 25, 7, 'b'),
      // Escapulario / escarapela francesa
      [7, 4, 'c'], [8, 4, 'c'], [7, 5, 'c'], [8, 5, 'c'],
      // Borde ajustado a la frente
      ...rect(4, 8, 23, 9, 'b')
    ]
  },
  casco: {
    a: '#ecf0f1', b: '#aeb6bf', c: '#e74c3c',
    px: [
      // Carcasa aerodinámica
      ...rect(7, 1, 20, 1, 'a'),
      ...rect(4, 2, 23, 7, 'a'),
      // Franja de velocidad roja central
      ...rect(13, 1, 14, 7, 'c'),
      // Canales de ventilación
      [7, 3, 'b'], [8, 3, 'b'], [19, 3, 'b'], [20, 3, 'b'],
      [7, 5, 'b'], [8, 5, 'b'], [19, 5, 'b'], [20, 5, 'b'],
      // Visera integrada delantera
      ...rect(3, 8, 24, 8, 'b'),
      // Correas de sujeción
      ...rect(3, 9, 3, 13, 'b'), ...rect(24, 9, 24, 13, 'b')
    ]
  },

  // --- ojos ---
  gafasCiclismo: {
    a: '#1b2a3a', b: 'rgba(243, 156, 18, 0.58)', c: 'rgba(255, 245, 210, 0.85)',
    px: [
      ...rect(6, 8, 21, 8, 'a'),
      ...rect(6, 9, 21, 11, 'b'),
      ...rect(6, 12, 21, 12, 'a'),
      ...rect(13, 9, 14, 11, 'a'),
      [8, 9, 'c'], [9, 9, 'c'], [17, 9, 'c'],
      ...rect(4, 9, 5, 10, 'a'), ...rect(22, 9, 23, 10, 'a')
    ]
  },
  parche: {
    a: '#22252b', b: '#3b4048', c: '#5a6068',
    px: [
      ...rect(15, 9, 20, 13, 'a'), ...rect(16, 10, 19, 12, 'b'),
      ...rect(4, 8, 14, 8, 'c'), ...rect(21, 9, 23, 9, 'c')
    ]
  },

  // --- cuello ---
  collar: {
    a: '#c0392b', b: '#8e2a1e', c: '#f1c40f',
    px: [
      ...rect(9, 18, 18, 18, 'a'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(16, 19, 19, 19, 'b'),
      ...rect(12, 20, 15, 22, 'c'), ...rect(13, 22, 14, 22, 'b'), [15, 21, 'b']
    ]
  },
  corbata: {
    a: '#8e1f38', b: '#5e1425', c: '#f4f6f7',
    px: [
      ...rect(10, 18, 17, 18, 'c'), ...rect(9, 19, 18, 19, 'c'),
      ...rect(12, 19, 15, 20, 'a'),
      ...rect(12, 21, 15, 25, 'a'), ...rect(13, 26, 14, 27, 'a'),
      ...rect(15, 21, 15, 25, 'b'), [14, 26, 'b']
    ]
  },
  medalla: {
    a: '#2e86c1', b: '#1b4f72', c: '#f1c40f',
    px: [
      ...rect(10, 18, 11, 21, 'a'), ...rect(16, 18, 17, 21, 'a'),
      [11, 21, 'b'], [17, 21, 'b'],
      ...rect(12, 22, 15, 25, 'c'), ...rect(12, 25, 15, 25, 'b'),
      [13, 23, 'b'], [14, 24, 'b']
    ]
  },

  // --- ropa ---
  rayas: {
    a: '#f4f6f7', b: '#1f3a93', c: '#d8dde3',
    px: [
      ...rect(9, 18, 18, 18, 'a'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 27, 'a'), ...rect(19, 20, 20, 27, 'c'),
      ...rect(7, 21, 20, 21, 'b'), ...rect(7, 23, 20, 23, 'b'),
      ...rect(7, 25, 20, 25, 'b'), ...rect(7, 27, 20, 27, 'b')
    ]
  },
  sudadera: {
    a: '#5d6d7e', b: '#42525f', c: '#d5dbdb',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 28, 'a'), ...rect(19, 20, 20, 28, 'b'),
      ...rect(12, 19, 12, 22, 'c'), ...rect(15, 19, 15, 22, 'c'),
      ...rect(9, 24, 18, 26, 'b'), ...rect(10, 25, 17, 25, 'a'),
      ...rect(7, 28, 20, 28, 'b')
    ]
  },
  chaleco: {
    // Iba un pixel mas estrecho por cada lado que la camiseta y la sudadera, y
    // al ponerselo el zorro se le veia el cuerpo por los costados.
    a: '#e67e22', b: '#b35c10', c: '#f8c471',
    px: [
      ...rect(9, 18, 18, 18, 'b'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 28, 'a'), ...rect(19, 20, 20, 28, 'b'),
      ...rect(7, 22, 20, 22, 'b'), ...rect(7, 25, 20, 25, 'b'),
      ...rect(13, 19, 14, 28, 'c')
    ]
  },

  // --- pies ---
  calcetines: {
    a: '#f4f6f7', b: '#e74c3c', c: '#c9ced1',
    px: [
      ...rect(7, 26, 11, 29, 'a'), ...rect(16, 26, 20, 29, 'a'),
      ...rect(7, 26, 11, 26, 'b'), ...rect(16, 26, 20, 26, 'b'),
      ...rect(7, 28, 11, 28, 'b'), ...rect(16, 28, 20, 28, 'b'),
      [11, 27, 'c'], [20, 27, 'c']
    ]
  },
  botas: {
    a: '#6e4b2a', b: '#4a3119', c: '#c9a227',
    px: [
      ...rect(7, 25, 11, 29, 'a'), ...rect(16, 25, 20, 29, 'a'),
      ...rect(7, 29, 12, 29, 'b'), ...rect(15, 29, 20, 29, 'b'),
      ...rect(7, 26, 11, 26, 'c'), ...rect(16, 26, 20, 26, 'c'),
      [11, 27, 'b'], [11, 28, 'b'], [20, 27, 'b'], [20, 28, 'b']
    ]
  },

  // --- objetos que se compran, en la manita derecha ---
  libro: {
    a: '#8e44ad', b: '#5b2c6f', c: '#f4f6f7',
    px: [
      ...rect(21, 22, 25, 28, 'a'),
      ...rect(21, 23, 22, 27, 'c'),
      ...rect(24, 22, 25, 28, 'b'), [23, 24, 'b'], [23, 25, 'b']
    ]
  },
  taza: {
    a: '#f4f6f7', b: '#aeb6bf', c: '#6b3e26',
    px: [
      ...rect(21, 23, 24, 28, 'a'),
      ...rect(21, 23, 24, 23, 'c'),
      ...rect(24, 24, 24, 28, 'b'),
      [25, 24, 'b'], [26, 25, 'b'], [26, 26, 'b'], [25, 27, 'b']
    ]
  },
  brezel: {
    a: '#a9662d', b: '#7a4519', c: '#f4f4f4',
    px: [
      ...rect(21, 22, 24, 22, 'a'),
      [20, 23, 'a'], [25, 23, 'a'], [22, 23, 'a'], [23, 23, 'a'],
      [20, 24, 'a'], [25, 24, 'a'], [21, 24, 'a'], [24, 24, 'a'],
      ...rect(21, 25, 24, 25, 'a'),
      [22, 26, 'a'], [23, 26, 'a'],
      ...rect(21, 27, 24, 27, 'a'),
      [20, 25, 'b'], [25, 25, 'b'],
      [22, 22, 'c'], [24, 25, 'c'], [22, 27, 'c']
    ]
  },
  globo: {
    a: '#e74c3c', b: '#b03a2e', c: '#ffffff',
    px: [
      ...rect(22, 16, 24, 16, 'a'), ...rect(21, 17, 25, 21, 'a'),
      ...rect(24, 18, 25, 21, 'b'),
      [22, 18, 'c'],
      [23, 22, 'b'], ...rect(23, 23, 23, 28, 'b')
    ]
  },
  cascoAstronauta: {
    a: '#f1f5f9', b: '#cbd5e1', c: '#475569', d: 'rgba(56, 189, 248, 0.75)',
    px: [
      // cúpula superior del casco de astronauta
      ...rect(9, 0, 18, 1, 'a'), ...rect(7, 2, 20, 3, 'a'), ...rect(6, 4, 21, 5, 'a'),
      ...rect(18, 0, 18, 1, 'b'), ...rect(19, 2, 20, 3, 'b'), ...rect(20, 4, 21, 5, 'b'),
      // laterales de la burbuja y sellos de orejas
      ...rect(4, 6, 6, 14, 'a'), ...rect(21, 6, 23, 14, 'a'),
      ...rect(22, 6, 23, 14, 'b'),
      // antena con luz de baliza
      [4, 2, '#ef4444'], ...rect(4, 3, 4, 5, 'c'),
      // luces de estado y módulos de comunicación en los laterales
      [3, 8, '#ef4444'], [3, 9, '#38bdf8'], [24, 8, '#22c55e'], [24, 9, '#eab308'],
      // arco del visor con reflejo de cristal espacial
      ...rect(7, 6, 20, 6, 'c'),
      [7, 7, 'd'], [8, 7, '#ffffff'], [9, 7, '#ffffff'], [10, 7, 'd'], [7, 8, 'd'],
      // anillo de sellado del cuello / escafandra
      ...rect(6, 16, 21, 16, 'b'), ...rect(5, 17, 22, 17, 'c'), ...rect(8, 18, 19, 18, 'c')
    ]
  },
  trajeAstronauta: {
    a: '#f1f5f9', b: '#cbd5e1', c: '#1e293b', d: '#94a3b8',
    px: [
      // cuello y hombros acolchados
      ...rect(9, 18, 18, 18, 'c'), ...rect(8, 19, 19, 19, 'a'),
      ...rect(7, 20, 20, 27, 'a'), ...rect(19, 20, 20, 27, 'b'),
      // articulaciones flexibles en los brazos
      ...rect(7, 21, 8, 21, 'd'), ...rect(7, 23, 8, 23, 'd'), ...rect(7, 25, 8, 25, 'd'),
      ...rect(19, 21, 20, 21, 'd'), ...rect(19, 23, 20, 23, 'd'), ...rect(19, 25, 20, 25, 'd'),
      // insignias de misión en los hombros
      [8, 20, '#ef4444'], [19, 20, '#2563eb'],
      // consola pectoral de soporte vital (PLSS control unit)
      ...rect(11, 21, 16, 25, 'c'), ...rect(12, 22, 15, 24, '#334155'),
      [12, 22, '#ef4444'], [13, 22, '#22c55e'], [15, 22, '#38bdf8'],
      ...rect(12, 23, 15, 23, '#f8fafc'), [14, 24, '#fbbf24'],
      // cinturón utilitario y hebilla reforzada
      ...rect(7, 26, 20, 26, '#475569'), ...rect(12, 26, 15, 26, 'd'),
      ...rect(7, 27, 20, 27, 'b')
    ]
  },
  botasAstronauta: {
    a: '#f1f5f9', b: '#334155', c: '#38bdf8', d: '#cbd5e1',
    px: [
      // bota izquierda
      ...rect(7, 26, 11, 26, 'c'),
      ...rect(6, 27, 12, 28, 'a'), [12, 27, 'd'], [12, 28, 'd'],
      [7, 28, '#64748b'], [10, 28, '#64748b'],
      ...rect(6, 29, 12, 29, 'b'),
      // bota derecha
      ...rect(16, 26, 20, 26, 'c'),
      ...rect(15, 27, 21, 28, 'a'), [21, 27, 'd'], [21, 28, 'd'],
      [16, 28, '#64748b'], [19, 28, '#64748b'],
      ...rect(15, 29, 21, 29, 'b')
    ]
  },
  cohete: {
    a: '#f8fafc', b: '#e11d48', c: '#0284c7', d: '#f97316',
    anima: (x, y) => y >= 24,
    px: [
      // ojiva / punta del cohete
      [23, 16, 'b'], ...rect(22, 17, 24, 17, 'b'),
      // fuselaje blanco aerodinámico
      ...rect(21, 18, 25, 22, 'a'), ...rect(24, 18, 25, 22, '#cbd5e1'),
      // ventanilla circular de cabina con brillo
      ...rect(22, 19, 24, 20, 'c'), [23, 19, '#ffffff'],
      // alerones / alas laterales rojas
      [20, 21, 'b'], [20, 22, 'b'], [26, 21, 'b'], [26, 22, 'b'],
      [21, 23, '#be123c'], [25, 23, '#be123c'],
      // tobera de propulsión
      ...rect(22, 23, 24, 23, '#475569'),
      // llamarada de propulsión animada
      ...rect(22, 24, 24, 25, 'd'), [23, 24, '#fde047'], [23, 26, '#fbbf24'], [23, 27, '#ef4444']
    ]
  }
};

// Las particulas, de cerca.
//
// Antes cada una era UN cuadradito de color plano que aparecia y se apagaba,
// y las de los siete niveles eran la misma mota. Luego cada TIPO tuvo su
// dibujo, que ya era algo, pero seguia habiendo siete niveles y cuatro
// dibujos: "Aura" y "Aura ++" eran la misma cruz con dos chispas mas y un
// naranja un punto mas rojo. Eso, a este tamano, no se distingue.
//
// Ahora cada nivel es una ESCENA -una o varias capas- y sube como sube un
// aura de dibujos animados: chispas sueltas, chispas con estela, llamas
// pegadas al cuerpo, llamas mas altas, piedras que se levantan del suelo,
// rayos crepitando y por fin las tres cosas a la vez.

// Cada forma, en pixeles del dibujo relativos a su centro. 'a' es el color
// de siempre, 'b' el nucleo claro y 'c' la sombra.
const FORMAS = {
  chispa: [[0, 0, 'a'], [0, -1, 'b'], [1, 0, 'b']],
  rombo: [[0, -2, 'b'], [-1, -1, 'a'], [0, -1, 'b'], [1, -1, 'a'], [-1, 0, 'a'], [0, 0, 'b'], [1, 0, 'a'], [0, 1, 'c']],
  estrella: [[0, -2, 'b'], [0, -1, 'a'], [-2, 0, 'a'], [-1, 0, 'a'], [0, 0, 'b'], [1, 0, 'a'], [2, 0, 'a'], [0, 1, 'a'], [0, 2, 'b']],
  estela: [[0, -2, 'b'], [0, -1, 'a'], [0, 0, 'a'], [0, 1, 'c'], [1, 2, 'c']],
  luna: [[-1, -2, 'b'], [0, -2, 'b'], [-2, -1, 'a'], [0, -1, 'a'], [-2, 0, 'a'], [-1, 0, 'a'], [0, 0, 'a'], [-1, 1, 'b']],
  burbuja: [[0, -1, 'b'], [-1, 0, 'a'], [1, 0, 'a'], [-1, 1, 'a'], [1, 1, 'a'], [0, 2, 'c'], [0, 0, 'b']],
  flor: [[0, -2, 'b'], [-1, -1, 'a'], [0, -1, 'b'], [1, -1, 'a'], [-2, 0, 'a'], [-1, 0, 'b'], [0, 0, 'a'], [1, 0, 'b'], [2, 0, 'a'], [-1, 1, 'a'], [0, 1, 'b'], [1, 1, 'a'], [0, 2, 'c']]
};

// Donde se colocan:
//   anillo  alrededor del bicho, repartidas por todo el borde
//   aura    pegadas a la silueta, alternando lado y de abajo arriba
//   suelo   en la base, para lo que se levanta del suelo
//   lados   a media altura, a izquierda y derecha: los rayos
//
// Como se mueven (son clases de CSS):
//   flota     sube poquito girando y se apaga
//   sube      sale disparada hacia arriba, estirandose
//   crepita   no se mueve: parpadea como un chispazo
const PARTICULAS = {
  p1: [
    { n: 4, forma: 'chispa', donde: 'anillo', mov: 'flota', a: '#f6c95d', b: '#fff4c2', seg: 3.4 }
  ],
  p2: [
    { n: 6, forma: 'estela', donde: 'anillo', mov: 'flota', a: '#7bc9dc', b: '#e5fbff', c: '#4a9fb9', seg: 2.8 },
    { n: 3, forma: 'chispa', donde: 'anillo', mov: 'flota', a: '#f5d58a', b: '#fff8df', seg: 2.2 }
  ],
  p3: [
    { n: 6, forma: 'rombo', donde: 'aura', mov: 'sube', a: '#b69be8', b: '#f2eaff', c: '#8066bd', seg: 2.3 },
    { n: 3, forma: 'chispa', donde: 'anillo', mov: 'flota', a: '#f6d985', b: '#fff9df', seg: 2.8 }
  ],
  p4: [
    { n: 6, forma: 'luna', donde: 'anillo', mov: 'flota', a: '#8ba9e8', b: '#eff5ff', c: '#647bb8', seg: 3.2 },
    { n: 4, forma: 'estrella', donde: 'anillo', mov: 'flota', a: '#eacb73', b: '#fff8d8', seg: 2.4 }
  ],
  p5: [
    { n: 7, forma: 'rombo', donde: 'suelo', mov: 'sube', a: '#78c9d9', b: '#e4fbff', c: '#418ca9', seg: 2.6 },
    { n: 5, forma: 'burbuja', donde: 'anillo', mov: 'flota', a: '#a9dce8', b: '#f3fdff', c: '#6eb1c5', seg: 3.1 }
  ],
  p6: [
    { n: 8, forma: 'flor', donde: 'aura', mov: 'flota', a: '#82cbb8', b: '#e6fff3', c: '#559d9a', seg: 3.1 },
    { n: 5, forma: 'estrella', donde: 'anillo', mov: 'crepita', a: '#b8a2e8', b: '#fffaff', c: '#8372c1', seg: 2.7 },
    { n: 3, forma: 'chispa', donde: 'anillo', mov: 'flota', a: '#f6dc91', b: '#fff9df', seg: 2.2 }
  ],
  p7: [
    { n: 8, forma: 'rombo', donde: 'aura', mov: 'flota', a: '#a88ce3', b: '#fffaff', c: '#7661bb', seg: 2.8 },
    { n: 6, forma: 'estrella', donde: 'anillo', mov: 'crepita', a: '#edcb6c', b: '#fffbe5', c: '#c89e43', seg: 2.6 },
    { n: 5, forma: 'burbuja', donde: 'suelo', mov: 'sube', a: '#80cbd8', b: '#f0fdff', c: '#4a9eae', seg: 3.0 },
    { n: 4, forma: 'flor', donde: 'anillo', mov: 'flota', a: '#e9a9c4', b: '#fff2f8', c: '#bb769e', seg: 3.2 }
  ]
};

// Desde cuantos aciertos seguidos se enciende el efecto y con cuantos llega a
// su tope. El dos es el mismo numero con el que sale el rayito de la
// cabecera: las dos cosas aparecen a la vez.
export const EMPIEZA = 2;
const TOPE = 20;

// Reparto FIJO: si fuera aleatorio se recolocarian en cada repintado y el
// aura parpadearia entera cada vez que cambias de ejercicio.
//
// Y por fuera del cuadro de verdad: antes, para hacerles sitio, se ensanchaba
// el viewBox cinco unidades sobre veintiocho. Como el ancho en pantalla no
// cambiaba, el zorro se dibujaba un 18% mas pequeno por llevar chispas
// puestas. Ahora el viewBox no se toca y se salen (overflow: visible en
// .fox-face), asi que el zorro mide lo mismo lleve lo que lleve.
function motas(capa, alto) {
  const out = [];
  const cx = W / 2;
  const cy = alto / 2;
  for (let i = 0; i < capa.n; i++) {
    const t = capa.n > 1 ? i / (capa.n - 1) : 0.5;
    const retraso = ((i * 0.37) % 1) * capa.seg;
    let x;
    let y;
    if (capa.donde === 'aura') {
      // Dos columnas, una a cada lado del bicho, de abajo arriba, y abiertas
      // hacia fuera segun suben.
      //
      // Iban mas cerca del centro y quedaban ENCIMA del zorro -las particulas
      // se pintan despues del cuerpo-, asi que en vez de un aura parecian
      // manchas en la tripa. Desde 0.46 de ancho ya caen fuera de la silueta,
      // que ocupa de 4 a 24 sobre 28.
      const lado = i % 2 ? 1 : -1;
      x = Math.round(cx + lado * (W * 0.46 + t * W * 0.07));
      y = Math.round(alto * (0.95 - t * 0.78));
    } else if (capa.donde === 'suelo') {
      x = Math.round(cx + (((i * 0.618034) % 1) - 0.5) * W * 1.05);
      y = Math.round(alto * (0.9 + (i % 3) * 0.04));
    } else if (capa.donde === 'lados') {
      const lado = i % 2 ? 1 : -1;
      x = Math.round(cx + lado * W * 0.5);
      y = Math.round(alto * (0.28 + ((i >> 1) % 2) * 0.34));
    } else {
      const ang = i * 2.399963; // angulo aureo: se reparten sin agruparse
      const r = 0.54 + ((i * 0.618034) % 1) * 0.1;
      x = Math.round(cx + Math.cos(ang) * W * r);
      y = Math.round(cy + Math.sin(ang) * alto * r * 0.95);
    }
    out.push({ x, y, retraso });
  }
  return out;
}

function paleta(c) {
  const id = c?.id || '';
  if (id.startsWith('galaxy')) {
    const suf = id.replace('galaxy-', '');
    return {
      o: suf === 'red' ? '#3d1205' : suf === 'blue' ? '#141738' : '#052e16',
      g: '#858b95',
      f: `url(#galaxy-${suf}-fur)`,
      d: `url(#galaxy-${suf}-fur)`,
      h: `url(#galaxy-${suf}-fur)`,
      l: suf === 'red' ? '#fff7ed' : suf === 'blue' ? '#f0f4ff' : '#f0fdf4',
      m: suf === 'red' ? '#fed7aa' : suf === 'blue' ? '#c7d2fe' : '#bbf7d0',
      w: '#ffffff',
      p: suf === 'red' ? '#240a02' : suf === 'blue' ? '#0c0e24' : '#022c22',
      s: '#ffffff',
      n: suf === 'red' ? '#240a02' : suf === 'blue' ? '#0c0e24' : '#022c22',
      k: suf === 'red' ? '#f97316' : suf === 'blue' ? '#38bdf8' : '#22c55e',
      j: suf === 'red' ? '#ea580c' : suf === 'blue' ? '#4f46e5' : '#15803d',
      r: suf === 'red' ? '#fb923c' : suf === 'blue' ? '#c084fc' : '#4ade80',
      t: suf === 'red' ? '#c2410c' : suf === 'blue' ? '#7c3aed' : '#166534',
      a: suf === 'red' ? '#f97316' : suf === 'blue' ? '#c084fc' : '#22c55e'
    };
  }
  return {
    o: '#211a16',
    g: '#858b95',
    f: c.fur,
    d: c.sombra,
    h: c.luzPelo,
    l: c.luz,
    m: c.luzSombra || c.luz,
    w: '#ffffff',
    p: '#211a16',
    s: '#ffffff',
    n: '#211a16',
    k: '#f5a623',
    j: '#c97e12',
    r: '#ff9ab5',
    t: '#c9526b',
    a: '#7bd8ff'
  };
}

export default function FoxFace({
  fuchs,
  gesto = 'normal',
  size = 96,
  parpadea = true,
  conCuerpo = false,
  separarObjetos = false,
  // Las chispas SOLO salen cuando estas en racha de aciertos. Sueltas, en la
  // portada, eran un zorro rodeado de purpurina todo el rato: si estan
  // siempre no premian nada. La tienda las ensena igual, que si no compras a
  // ciegas.
  chispeando = false,
  desvaneciendoEfecto = false,
  // Aciertos seguidos que llevas: el efecto aprieta segun sube. Lo que llevas
  // puesto elige QUE se ve; la racha, cuanto arde.
  racha = 0,
  className = ''
}) {
  const [cerrando, setCerrando] = useState(false);
  const [foxEgg, setFoxEgg] = useState(null);
  const accessoryTaps = useRef({ id: null, count: 0 });
  const accessoryTapTimer = useRef(null);
  const foxEggTimer = useRef(null);

  useEffect(() => () => {
    clearTimeout(accessoryTapTimer.current);
    clearTimeout(foxEggTimer.current);
  }, []);

  const tocarObjeto = (id) => {
    if (id === 'guitarra') tocarAcordeGuitarra();
    const objetivo = TOQUES_EASTER_EGG[id];
    if (!objetivo) return;
    const taps = accessoryTaps.current;
    if (taps.id === id) taps.count += 1;
    else { taps.id = id; taps.count = 1; }
    clearTimeout(accessoryTapTimer.current);
    if (taps.count >= objetivo) {
      taps.count = 0;
      setFoxEgg(id);
      clearTimeout(foxEggTimer.current);
      foxEggTimer.current = setTimeout(() => setFoxEgg(null), id === 'camara' ? 800 : 1900);
    } else {
      accessoryTapTimer.current = setTimeout(() => { taps.id = null; taps.count = 0; }, 2600);
    }
  };

  // Parpadeo suelto cada pocos segundos: es lo que hace que parezca vivo.
  useEffect(() => {
    if (!parpadea) return;
    let t;
    const ciclo = () => {
      t = setTimeout(() => {
        setCerrando(true);
        setTimeout(() => setCerrando(false), 130);
        ciclo();
      }, 2400 + Math.random() * 3400);
    };
    ciclo();
    return () => clearTimeout(t);
  }, [parpadea]);

  const c = colorDe(fuchs);
  const col = paleta(c);
  const yaCerrados = ['feliz', 'muyfeliz', 'guino', 'parpadeo'];
  const gestoFinal = cerrando && !yaCerrados.includes(gesto) ? 'parpadeo' : gesto;
  const alto = conCuerpo ? H : ALTO_CABEZA;
  const colorId = c?.id || '';
  let pId = fuchs?.particulas;
  if (colorId.startsWith('galaxy')) pId = null;
  const base = chispeando ? PARTICULAS[pId] || null : null;
  // La subida va de la racha inicial al tope completo en 20 aciertos.
  const empuje = Math.max(0, Math.min(1, (racha - EMPIEZA) / (TOPE - EMPIEZA)));
  const chispas =
    base &&
    base.map((capa) => ({
      ...capa,
      n: Math.round(capa.n * (1 + 0.9 * empuje)),
      seg: +(capa.seg * (1 - 0.45 * empuje)).toFixed(2)
    }));
  const especie = ESPECIES.includes(fuchs?.especie) ? fuchs.especie : 'zorro';

  const celdas = useMemo(() => {
    const g = lienzo();
    if (conCuerpo) cuerpo(g, especie);
    cabeza(g, especie);
    (GESTOS[gestoFinal] || GESTOS.normal)(g);
    rasgos(g, especie);
    return contornear(g, conCuerpo ? H : ALTO_CABEZA);
  }, [gestoFinal, conCuerpo, especie]);

  // La cola va en su propia rejilla y en su propio grupo del SVG: así se le
  // puede dar el meneo sin arrastrar al resto del zorro.
  const celdasCola = useMemo(
    () => (conCuerpo ? contornear(dibujarCola(especie), H) : null),
    [conCuerpo, especie]
  );

  // El orden importa: lo de fuera se pinta encima. La ropa va antes que el
  // cuello, o la bufanda y el collar quedarian tapados por la camiseta.
  const extras = [
    fuchs?.cabeza,
    conCuerpo ? fuchs?.ropa : null,
    fuchs?.cuello,
    fuchs?.ojos,
    conCuerpo ? fuchs?.pies : null,
    conCuerpo ? fuchs?.objeto : null
  ]
    .map((id, i) => {
      const ex = EXTRAS[id];
      // El objeto de la mano se dibuja algo mas grande que el resto: a tamaño
      // de rejilla se quedaba en un manchurron de cinco pixeles y no se
      // distinguia un libro de una taza. Crece desde su base, que es donde lo
      // agarra, asi que sigue apoyado en la patita.
      return ex ? {
        id,
        ex,
        escala: i === 5 ? ex.escala ?? ESCALA_OBJETO : 1,
        esObjeto: i === 5
      } : null;
    })
    .filter(Boolean);

  return (
    <svg
      className={`fox-face fox-${gestoFinal} fox-color-${colorId} ${className}`}
      width={size}
      height={(size / W) * alto}
      viewBox={`0 0 ${W} ${alto}`}
      shapeRendering="crispEdges"
      role="img"
      aria-label={fuchs?.nombre || 'Fuchs'}
    >
      <defs>
        {/* Galaxia Verde / Esmeralda / Aurora Cósmica (Verde auténtico con flujo descendente) */}
        <radialGradient id="galaxy-green-fur" gradientUnits="userSpaceOnUse" cx="14" cy="13" r="16" fx="14" fy="13">
          <animate attributeName="cx" values="15;14.87;14.5;14;13.5;13.13;13;13.13;13.5;14;14.5;14.87;15" dur="6s" repeatCount="indefinite" />
          <animate attributeName="cy" values="13;12.5;12.13;12;12.13;12.5;13;13.5;13.87;14;13.87;13.5;13" dur="6s" repeatCount="indefinite" />
          <animate attributeName="fx" values="16;15.73;15;14;13;12.27;12;12.27;13;14;15;15.73;16" dur="6s" repeatCount="indefinite" />
          <animate attributeName="fy" values="13;12;11.27;11;11.27;12;13;14;14.73;15;14.73;14;13" dur="6s" repeatCount="indefinite" />
          <stop offset="0%" stopColor="#bbf7d0">
            <animate attributeName="stopColor" values="#bbf7d0;#86efac;#4ade80;#bbf7d0" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="25%" stopColor="#22c55e">
            <animate attributeName="stopColor" values="#22c55e;#10b981;#34d399;#22c55e" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="55%" stopColor="#15803d">
            <animate attributeName="stopColor" values="#15803d;#059669;#16a34a;#15803d" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="80%" stopColor="#14532d">
            <animate attributeName="stopColor" values="#14532d;#064e3b;#166534;#14532d" dur="5s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#052e16" />
        </radialGradient>
        <radialGradient id="galaxy-green-shadow" gradientUnits="userSpaceOnUse" cx="14" cy="14" r="16">
          <animate attributeName="cx" values="14.8;14;13.2;14;14.8" dur="6s" repeatCount="indefinite" />
          <animate attributeName="cy" values="14;14.8;14;13.2;14" dur="6s" repeatCount="indefinite" />
          <stop offset="0%" stopColor="#15803d">
            <animate attributeName="stopColor" values="#15803d;#047857;#15803d" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="60%" stopColor="#14532d">
            <animate attributeName="stopColor" values="#14532d;#064e3b;#14532d" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#022c22" />
        </radialGradient>
        <linearGradient id="galaxy-green-light" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="24" y2="24">
          <animate attributeName="x1" values="0;6;0" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="y1" values="0;14;0" dur="5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="24;34;24" dur="5s" repeatCount="indefinite" />
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#dcfce7">
            <animate attributeName="stopColor" values="#dcfce7;#ecfdf5;#dcfce7" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#4ade80" />
        </linearGradient>
        <radialGradient id="galaxy-green-wave" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#4ade80" stopOpacity="0.85">
            <animate attributeName="stopColor" values="#4ade80;#34d399;#86efac;#4ade80" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#16a34a" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#14532d" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="galaxy-green-wave2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#bbf7d0" stopOpacity="0.7">
            <animate attributeName="stopColor" values="#bbf7d0;#6ee7b7;#bbf7d0" dur="3.5s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#15803d" stopOpacity="0" />
        </radialGradient>

        {/* Galaxia Azul / Violeta / Astral (Nebulosa cósmica con flujo descendente) */}
        <radialGradient id="galaxy-blue-fur" gradientUnits="userSpaceOnUse" cx="14" cy="13" r="16" fx="14" fy="13">
          <animate attributeName="cx" values="15;14.87;14.5;14;13.5;13.13;13;13.13;13.5;14;14.5;14.87;15" dur="6s" repeatCount="indefinite" />
          <animate attributeName="cy" values="13;12.5;12.13;12;12.13;12.5;13;13.5;13.87;14;13.87;13.5;13" dur="6s" repeatCount="indefinite" />
          <animate attributeName="fx" values="16;15.73;15;14;13;12.27;12;12.27;13;14;15;15.73;16" dur="6s" repeatCount="indefinite" />
          <animate attributeName="fy" values="13;12;11.27;11;11.27;12;13;14;14.73;15;14.73;14;13" dur="6s" repeatCount="indefinite" />
          <stop offset="0%" stopColor="#c4b5fd">
            <animate attributeName="stopColor" values="#c4b5fd;#7dd3fc;#a5b4fc;#c4b5fd" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="25%" stopColor="#38bdf8">
            <animate attributeName="stopColor" values="#38bdf8;#818cf8;#c084fc;#38bdf8" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="55%" stopColor="#6366f1">
            <animate attributeName="stopColor" values="#6366f1;#3b82f6;#7c3aed;#6366f1" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="80%" stopColor="#4338ca">
            <animate attributeName="stopColor" values="#4338ca;#3730a3;#4c1d95;#4338ca" dur="5s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#1e1b4b" />
        </radialGradient>
        <radialGradient id="galaxy-blue-shadow" gradientUnits="userSpaceOnUse" cx="14" cy="14" r="16">
          <animate attributeName="cx" values="14.8;14;13.2;14;14.8" dur="6s" repeatCount="indefinite" />
          <animate attributeName="cy" values="14;14.8;14;13.2;14" dur="6s" repeatCount="indefinite" />
          <stop offset="0%" stopColor="#4f46e5">
            <animate attributeName="stopColor" values="#4f46e5;#2563eb;#4f46e5" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="60%" stopColor="#312e81">
            <animate attributeName="stopColor" values="#312e81;#1e3a8a;#312e81" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#17153b" />
        </radialGradient>
        <linearGradient id="galaxy-blue-light" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="24" y2="24">
          <animate attributeName="x1" values="0;6;0" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="y1" values="0;14;0" dur="5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="24;34;24" dur="5s" repeatCount="indefinite" />
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#e0e7ff">
            <animate attributeName="stopColor" values="#e0e7ff;#c7d2fe;#e0e7ff" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#a78bfa" />
        </linearGradient>
        <radialGradient id="galaxy-blue-wave" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#818cf8" stopOpacity="0.85">
            <animate attributeName="stopColor" values="#818cf8;#38bdf8;#c084fc;#818cf8" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#4f46e5" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#312e81" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="galaxy-blue-wave2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.7">
            <animate attributeName="stopColor" values="#38bdf8;#c084fc;#38bdf8" dur="3.5s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#4338ca" stopOpacity="0" />
        </radialGradient>

        {/* Galaxia Roja / Magma / Fuego Solar (Anaranjada y cálida con flujo descendente) */}
        <radialGradient id="galaxy-red-fur" gradientUnits="userSpaceOnUse" cx="14" cy="13" r="16" fx="14" fy="13">
          <animate attributeName="cx" values="15;14.87;14.5;14;13.5;13.13;13;13.13;13.5;14;14.5;14.87;15" dur="6s" repeatCount="indefinite" />
          <animate attributeName="cy" values="13;12.5;12.13;12;12.13;12.5;13;13.5;13.87;14;13.87;13.5;13" dur="6s" repeatCount="indefinite" />
          <animate attributeName="fx" values="16;15.73;15;14;13;12.27;12;12.27;13;14;15;15.73;16" dur="6s" repeatCount="indefinite" />
          <animate attributeName="fy" values="13;12;11.27;11;11.27;12;13;14;14.73;15;14.73;14;13" dur="6s" repeatCount="indefinite" />
          <stop offset="0%" stopColor="#fef08a">
            <animate attributeName="stopColor" values="#fef08a;#fed7aa;#fde047;#fef08a" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="25%" stopColor="#fb923c">
            <animate attributeName="stopColor" values="#fb923c;#f97316;#ea580c;#fb923c" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="55%" stopColor="#ea580c">
            <animate attributeName="stopColor" values="#ea580c;#dc2626;#c2410c;#ea580c" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="80%" stopColor="#9a3412">
            <animate attributeName="stopColor" values="#9a3412;#991b1b;#7c2d12;#9a3412" dur="5s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#451a03" />
        </radialGradient>
        <radialGradient id="galaxy-red-shadow" gradientUnits="userSpaceOnUse" cx="14" cy="14" r="16">
          <animate attributeName="cx" values="14.8;14;13.2;14;14.8" dur="6s" repeatCount="indefinite" />
          <animate attributeName="cy" values="14;14.8;14;13.2;14" dur="6s" repeatCount="indefinite" />
          <stop offset="0%" stopColor="#c2410c">
            <animate attributeName="stopColor" values="#c2410c;#b91c1c;#c2410c" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="60%" stopColor="#7c2d12">
            <animate attributeName="stopColor" values="#7c2d12;#6c1d0c;#7c2d12" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#3d1205" />
        </radialGradient>
        <linearGradient id="galaxy-red-light" gradientUnits="userSpaceOnUse" x1="2" y1="2" x2="24" y2="24">
          <animate attributeName="x1" values="0;6;0" dur="4.5s" repeatCount="indefinite" />
          <animate attributeName="y1" values="0;14;0" dur="5s" repeatCount="indefinite" />
          <animate attributeName="y2" values="24;34;24" dur="5s" repeatCount="indefinite" />
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="50%" stopColor="#ffedd5">
            <animate attributeName="stopColor" values="#ffedd5;#fef3c7;#ffedd5" dur="3s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#fb923c" />
        </linearGradient>
        <radialGradient id="galaxy-red-wave" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fb923c" stopOpacity="0.85">
            <animate attributeName="stopColor" values="#fb923c;#f97316;#f59e0b;#fb923c" dur="4s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stopColor="#ea580c" stopOpacity="0.45" />
          <stop offset="100%" stopColor="#7c2d12" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="galaxy-red-wave2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.7">
            <animate attributeName="stopColor" values="#fed7aa;#fde047;#fed7aa" dur="3.5s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stopColor="#c2410c" stopOpacity="0" />
        </radialGradient>
      </defs>
      {celdasCola && (
        <g className="fox-cola">
          {celdasCola.map((f, y) =>
            f.map((k, x) =>
              k === '.' ? null : (
                <rect key={`c${y}-${x}`} x={x} y={y} width="1" height="1" fill={col[k]} />
              )
            )
          )}
        </g>
      )}
      <g className="fox-cuerpo">
        {celdas.slice(0, alto).map((f, y) =>
          f.map((k, x) =>
            k === '.' ? null : (
              <rect key={`${y}-${x}`} x={x} y={y} width="1" height="1" fill={col[k]} />
            )
          )
        )}
        {extras.map(({ id, ex, escala, esObjeto }, i) => {
          const vis = ex.px.filter(([, y]) => y < alto);
          const pixelStep = ex.pixelStep ?? 1;
          const pixelesRender = [
            ...vis.flatMap(([x, y, color]) => {
              if (pixelStep === 1) return [[x, y, color]];
              const celdas = [];
              for (let py = 0; py < 1; py += pixelStep) {
                for (let px = 0; px < 1; px += pixelStep) celdas.push([x + px, y + py, color]);
              }
              return celdas;
            }),
            ...(ex.microPx || []).filter(([, y]) => y < alto)
          ];
          // El ancla es la base del propio dibujo. Y cada pixel se coloca ya
          // escalado en vez de meterlo todo en un <g transform>: asi los
          // cuadrados siguen encajando justos entre si y no salen las rayas
          // finas de fondo que deja el redondeo.
          const x0 = escala === 1 ? 0 : Math.min(...vis.map((q) => q[0]));
          const x1 = escala === 1 ? 0 : Math.max(...vis.map((q) => q[0]));
          const cx = escala === 1 ? 0 : (x0 + x1 + 1) / 2;
          const cy = escala === 1 ? 0 : Math.max(...vis.map((q) => q[1])) + 1;
          const der = cx + (x1 - cx) * escala + escala;
          const izq = cx + (x0 - cx) * escala;
          // Los objetos sostenidos en la mano derecha (libro, taza, brezel, bastón, trofeo, etc.)
          // se separan ampliamente hacia la derecha en el menú de personalización (tienda)
          // para apreciarlos con claridad sin solaparse con el cuerpo ni tapar el brazo del zorro.
          // En la portada (Startseite), se mantienen en su posición estándar original.
          const esObjetoSuelto = esObjeto;
          const separacionX = (esObjetoSuelto && separarObjetos) ? 3.6 : 0;
          const ajuste = (esObjetoSuelto && separarObjetos) ? 0 : (der > W ? W - der : izq < 0 ? -izq : 0);
          // Y lo mismo por arriba: nada puede quedar por encima del lienzo.
          const arriba = cy + (Math.min(...vis.map((q) => q[1])) - cy) * escala;
          const ajusteY = arriba < 0 ? -arriba : 0;
          // Cada complemento en su grupo, con su id de clase: asi el CSS le
          // puede dar vida a uno solo (por ejemplo, el globo flotante).
          return (
            <g
              key={`e${i}`}
              className={`fox-extra fox-x-${id}`}
              onClick={OBJETOS_EASTER_EGG.has(id) ? (ev) => {
                ev.stopPropagation();
                tocarObjeto(id);
              } : undefined}
              onKeyDown={OBJETOS_EASTER_EGG.has(id) ? (ev) => {
                if (ev.key === 'Enter' || ev.key === ' ') {
                  ev.preventDefault();
                  tocarObjeto(id);
                }
              } : undefined}
              role={OBJETOS_EASTER_EGG.has(id) ? 'button' : undefined}
              tabIndex={OBJETOS_EASTER_EGG.has(id) ? 0 : undefined}
              aria-label={id === 'guitarra' ? 'Tocar la guitarra' : id === 'camara' ? 'Hacer una foto' : id === 'peluche' ? 'Abrazar el peluche' : id === 'cocheRC' ? 'Conducir el coche' : id === 'robot' ? 'Activar el robot' : `Interactuar con ${id}`}
              style={OBJETOS_EASTER_EGG.has(id) ? { cursor: 'pointer' } : undefined}
            >
              {id === 'guitarra' && <title>Toca para escuchar un acorde</title>}
              {id === 'trebol' && <title>Toca tres veces para probar suerte</title>}
              {id === 'camara' && <title>Toca dos veces para hacer una foto</title>}
              {id === 'peluche' && <title>Toca dos veces para darle un abrazo</title>}
              {id === 'cocheRC' && <title>Toca tres veces para hacerlo correr</title>}
              {id === 'robot' && <title>Toca dos veces para activarlo</title>}
              {pixelesRender.map(([x, y, k], j) => (
                <rect
                  key={j}
                  className={ex.anima && ex.anima(x, y) ? 'fox-px-mueve' : undefined}
                  x={(escala === 1 ? x : cx + (x - cx) * escala) + ajuste + separacionX}
                  y={escala === 1 ? y : cy + (y - cy) * escala + ajusteY}
                  width={pixelStep * escala}
                  height={pixelStep * escala}
                  fill={k === 'a' ? ex.a : k === 'b' ? ex.b : k === 'c' ? ex.c : k === 'd' ? ex.d : (typeof k === 'string' && (k.startsWith('#') || k.startsWith('rgba') || k.startsWith('rgb'))) ? k : (ex[k] || ex.c)}
                />
              ))}
            </g>
          );
        })}
      </g>
      {foxEgg === 'guitarra' && fuchs?.objeto === 'guitarra' && (
        <g className="fox-guitar-egg" aria-hidden="true" pointerEvents="none">
          <text x="26" y="18" textAnchor="middle" fontSize="5" fontWeight="700" fill="#8b6ad8">♪</text>
          <text x="26" y="14" textAnchor="middle" fontSize="4" fontWeight="700" fill="#d99ac6">♫</text>
        </g>
      )}
      {foxEgg === 'trebol' && fuchs?.objeto === 'trebol' && (
        <g aria-hidden="true" pointerEvents="none" fill="#f4ce62">
          <path d="M21 17v-2m-1 1h2M26 22v-2m-1 1h2M20 25v-2m-1 1h2" stroke="#f4ce62" strokeWidth=".7" />
          <circle cx="22" cy="17" r=".6" /><circle cx="26" cy="20" r=".6" />
        </g>
      )}
      {foxEgg === 'camara' && fuchs?.objeto === 'camara' && (
        <g aria-hidden="true" pointerEvents="none">
          <rect x="18" y="19" width="10" height="11" fill="#fff" opacity=".72">
            <animate attributeName="opacity" values=".72;0;0" dur=".72s" fill="freeze" />
          </rect>
        </g>
      )}
      {foxEgg === 'peluche' && fuchs?.objeto === 'peluche' && (
        <g aria-hidden="true" pointerEvents="none">
          <text x="25" y="17" textAnchor="middle" fontSize="5" fill="#e76b91">♥<animate attributeName="y" values="17;12;17" dur="1s" /></text>
        </g>
      )}
      {foxEgg === 'cocheRC' && fuchs?.objeto === 'cocheRC' && (
        <g aria-hidden="true" pointerEvents="none" fill="none" stroke="#5ca9dc" strokeWidth="1">
          <path d="M17 27h-3m4 2h-5"><animate attributeName="opacity" values="1;.15;1" dur=".45s" repeatCount="4" /></path>
          <path d="M18 24l-2-2m12 7l2-2"><animate attributeName="opacity" values=".2;1;.2" dur=".4s" repeatCount="4" /></path>
        </g>
      )}
      {foxEgg === 'robot' && fuchs?.objeto === 'robot' && (
        <g aria-hidden="true" pointerEvents="none" fill="#f6d45b">
          <path d="M24 12v-3m-1.5 1.5h3" stroke="#f6d45b" strokeWidth=".8"><animate attributeName="opacity" values="1;.2;1" dur=".35s" repeatCount="4" /></path>
          <circle cx="24" cy="9" r="1"><animate attributeName="r" values=".5;1.5;.5" dur=".7s" repeatCount="2" /></circle>
        </g>
      )}
      {colorId.startsWith('galaxy') && (
        <g className="fox-galaxy-effects" aria-hidden="true" style={{ pointerEvents: 'none' }}>
          {/* Olas cósmicas luminosas centradas en el cuerpo y cara */}
          <g style={{ mixBlendMode: 'screen' }}>
            <ellipse cx="14" cy="13" rx="6" ry="6" fill={`url(#galaxy-${colorId.replace('galaxy-', '')}-wave)`} opacity="0.8">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="1.2,0; 1.04,-0.6; 0.6,-1.04; 0,-1.2; -0.6,-1.04; -1.04,-0.6; -1.2,0; -1.04,0.6; -0.6,1.04; 0,1.2; 0.6,1.04; 1.04,0.6; 1.2,0"
                dur="6s"
                repeatCount="indefinite"
              />
            </ellipse>
            <ellipse cx="14" cy="13" rx="4.5" ry="4.5" fill={`url(#galaxy-${colorId.replace('galaxy-', '')}-wave2)`} opacity="0.65">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="-0.9,0; -0.78,0.45; -0.45,0.78; 0,0.9; 0.45,0.78; 0.78,0.45; 0.9,0; 0.78,-0.45; 0.45,-0.78; 0,-0.9; -0.45,-0.78; -0.78,-0.45; -0.9,0"
                dur="6s"
                repeatCount="indefinite"
              />
            </ellipse>
          </g>

          {/* Estrellas titilantes que se mueven y brillan con la nebulosa */}
          {[
            { x: 7.5, y: 8.5, r: 0.45, d: '1.6s', v: '0.2;1;0.2', dx: 0.3, dy: -0.2 },
            { x: 19.5, y: 8.5, r: 0.45, d: '2.2s', v: '1;0.2;1', dx: -0.3, dy: 0.2 },
            { x: 10.5, y: 11.5, r: 0.35, d: '1.4s', v: '0.3;1;0.3', dx: 0.2, dy: 0.3 },
            { x: 16.5, y: 11.5, r: 0.5, d: '1.9s', v: '0.9;0.1;0.9', dx: -0.2, dy: -0.3 },
            { x: 13.5, y: 9.5, r: 0.4, d: '1.7s', v: '0.4;1;0.4', dx: 0.3, dy: -0.2 },
            { x: 9.0, y: 14.5, r: 0.35, d: '2.5s', v: '0.1;0.9;0.1', dx: 0.2, dy: 0.2 },
            { x: 18.0, y: 14.5, r: 0.4, d: '1.8s', v: '0.8;0.2;0.8', dx: -0.3, dy: 0.2 },
            { x: 11.5, y: 18.5, r: 0.45, d: '1.5s', v: '0.2;1;0.2', dx: 0.2, dy: -0.2 },
            { x: 15.5, y: 19.5, r: 0.4, d: '2.1s', v: '1;0.2;1', dx: -0.2, dy: 0.2 }
          ].map((st, i) => (
            <circle key={i} cx={st.x} cy={st.y} r={st.r} fill="#ffffff">
              <animate attributeName="opacity" values={st.v} dur={st.d} repeatCount="indefinite" />
              <animate attributeName="cx" values={`${st.x};${st.x + st.dx};${st.x - st.dx};${st.x}`} dur={`${parseFloat(st.d) * 2.2}s`} repeatCount="indefinite" />
              <animate attributeName="cy" values={`${st.y};${st.y + st.dy};${st.y - st.dy};${st.y}`} dur={`${parseFloat(st.d) * 2.8}s`} repeatCount="indefinite" />
            </circle>
          ))}
        </g>
      )}
      {['bronce', 'plata', 'dorado'].includes(colorId) && (
        <g className="fox-metallic-sparkles" aria-hidden="true" style={{ pointerEvents: 'none' }}>
          {[
            // Cabeza y orejas (siempre visibles)
            { x: 8.5, y: 3.5, d: '2.1s', delay: '0s' },
            { x: 19.5, y: 3.5, d: '2.5s', delay: '0.8s' },
            { x: 13.5, y: 8.0, d: '1.9s', delay: '1.3s' },
            { x: 7.0, y: 10.5, d: '2.3s', delay: '0.4s' },
            { x: 21.0, y: 10.5, d: '2.0s', delay: '1.7s' },
            { x: 10.0, y: 13.0, d: '2.6s', delay: '0.9s' },
            { x: 17.5, y: 13.0, d: '2.2s', delay: '1.5s' },
            { x: 6.5, y: 15.5, d: '2.8s', delay: '0.2s' },
            { x: 21.5, y: 15.5, d: '2.4s', delay: '1.1s' },
            // Cuerpo y patas (visibles con conCuerpo)
            { x: 11.5, y: 19.5, d: '2.2s', delay: '0.6s' },
            { x: 16.5, y: 19.5, d: '2.7s', delay: '1.4s' },
            { x: 13.5, y: 22.5, d: '2.0s', delay: '0.3s' },
            { x: 8.5, y: 24.5, d: '2.4s', delay: '1.8s' },
            { x: 19.5, y: 24.5, d: '2.1s', delay: '0.7s' },
            { x: 9.5, y: 27.5, d: '2.5s', delay: '1.2s' },
            { x: 18.5, y: 27.5, d: '2.3s', delay: '0.5s' }
          ]
            .filter((st) => st.y < alto)
            .map((st, i) => {
              const haloColor =
                colorId === 'dorado' ? '#fef08a' : colorId === 'plata' ? '#e2e8f0' : '#fed7aa';
              return (
                <g key={i} transform={`translate(${st.x}, ${st.y})`}>
                  {/* Destello en cruz de metal */}
                  <path
                    d="M 0,-1.1 L 0.35,-0.35 L 1.1,0 L 0.35,0.35 L 0,1.1 L -0.35,0.35 L -1.1,0 L -0.35,-0.35 Z"
                    fill={haloColor}
                    opacity="0.9"
                  >
                    <animate
                      attributeName="opacity"
                      values="0; 0; 0.95; 1; 0.15; 0; 0"
                      dur={st.d}
                      begin={st.delay}
                      repeatCount="indefinite"
                    />
                    <animateTransform
                      attributeName="transform"
                      type="scale"
                      values="0.3; 0.3; 1.25; 1.4; 0.4; 0.3; 0.3"
                      dur={st.d}
                      begin={st.delay}
                      repeatCount="indefinite"
                    />
                  </path>
                  {/* Núcleo blanco brillante en el centro del destello */}
                  <rect x="-0.4" y="-0.4" width="0.8" height="0.8" fill="#ffffff">
                    <animate
                      attributeName="opacity"
                      values="0; 0; 1; 1; 0.2; 0; 0"
                      dur={st.d}
                      begin={st.delay}
                      repeatCount="indefinite"
                    />
                  </rect>
                </g>
              );
            })}
        </g>
      )}
      {chispas && !colorId.startsWith('galaxy') && (
        <g className={'fox-particulas' + (desvaneciendoEfecto ? ' fox-particulas-desvanecer' : '')} aria-hidden="true">
          {chispas.map((capa, c) =>
            motas(capa, alto).map((m, i) => (
              <g
                key={`p${c}-${i}`}
                className={'fox-mota ' + capa.mov}
                style={{ animationDelay: `${m.retraso}s`, animationDuration: `${capa.seg}s` }}
              >
                {FORMAS[capa.forma].map(([dx, dy, k], j) => (
                  <rect
                    key={j}
                    x={m.x + dx}
                    y={m.y + dy}
                    width={1}
                    height={1}
                    fill={k === 'a' ? capa.a : k === 'b' ? capa.b : capa.c || capa.a}
                  />
                ))}
              </g>
            ))
          )}
        </g>
      )}
    </svg>
  );
}
