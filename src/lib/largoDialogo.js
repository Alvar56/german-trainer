import { getSettings } from './settings.js';

// Cuántas intervenciones pedirle a la IA. Antes estaban fijas en 14: una
// conversación de la panadería salía igual de larga que una discusión con el
// vecino, y para repasar cuatro frases sueltas se hacía pesada.
//
// Va aquí y no en components/LargoDialogo.jsx: un fichero de componente que
// exporta también otras cosas deja sin recarga en caliente a todo lo que lo usa.
const TURNOS = { corta: 8, media: 14, larga: 22 };

export function turnosDe(largo) {
  return TURNOS[largo] || TURNOS.media;
}

export function largoGuardado() {
  return getSettings().dialogLargo || 'media';
}
