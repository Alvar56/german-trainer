import { createContext, useContext, useEffect, useRef } from 'react';

// Permite mantener un ejercicio montado en segundo plano al cambiar de menú
// sin que sus atajos sigan respondiendo por encima de la pantalla visible.
export const ExerciseActiveContext = createContext(true);

export function useExerciseActive() {
  return useContext(ExerciseActiveContext);
}

// Atajos de teclado para los ejercicios.
//
// Ordenar frases, el cloze y traducir ya se manejaban con el teclado; el test,
// der/die/das, el Kasus Trainer y las tarjetas no, y son justo los cuatro que
// más se repiten. En el ordenador obligaban a ir al ratón para cada respuesta.
//
// Reglas que cumple cualquiera que lo use:
//
//   · No se mete cuando estás escribiendo. Si el foco está en un campo de
//     texto, la tecla es del campo y aquí no se toca: si no, escribir "1" en
//     el diario contestaría un ejercicio que hay detrás.
//   · No se mete si hay modificadores (Ctrl/Alt/Cmd): esos son atajos del
//     navegador y del sistema, y robarlos es peor que no tener atajos.
//   · El manejador se guarda en una ref, así que el efecto se suscribe UNA vez
//     y no se desengancha y reengancha en cada repintado. Sin eso, una tecla
//     pulsada justo mientras React repinta se perdía.

function escribiendo(el) {
  if (!el) return false;
  if (el.isContentEditable) return true;
  const t = (el.tagName || '').toLowerCase();
  return t === 'input' || t === 'textarea' || t === 'select';
}

// `mapa` es { tecla: función }. Las teclas van tal cual las da el navegador:
// '1', 'Enter', ' ' para el espacio. Devuelve nada; se engancha solo.
export function useTeclas(mapa, activo = true) {
  const contextoActivo = useExerciseActive();
  const activoAhora = activo && contextoActivo;
  const ref = useRef(mapa);
  ref.current = mapa;

  useEffect(() => {
    if (!activoAhora) return undefined;
    function alPulsar(e) {
      if ((e.ctrlKey || e.metaKey || e.altKey) && e.key !== 'Control' && e.key !== 'Alt') return;
      if (escribiendo(e.target) && e.key !== 'Escape') return;
      const fn = ref.current[e.key];
      if (!fn) return;
      e.preventDefault();
      fn(e);
    }
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [activoAhora]);
}

// Atajo para lo más común: las opciones se eligen con 1, 2, 3… en el orden en
// que se ven. Más de nueve no se numera, que ya no se encuentra la tecla.
export function teclasDeOpciones(opciones, elegir) {
  const mapa = {};
  opciones.slice(0, 9).forEach((opt, i) => {
    mapa[String(i + 1)] = () => elegir(opt, i);
  });
  return mapa;
}

// Detecta si se está ejecutando en un ordenador (ratón / teclado / puntero fino)
// frente a una pantalla táctil pura de móvil.
export function esOrdenador() {
  if (typeof window === 'undefined') return true;
  if (window.matchMedia) {
    const hoverFine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
    if (hoverFine) return true;
    const coarseOnly = window.matchMedia('(pointer: coarse)').matches;
    if (coarseOnly && !hoverFine) return false;
  }
  return !('ontouchstart' in window) || (window.innerWidth >= 768);
}

