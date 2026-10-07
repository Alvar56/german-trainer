import React, { useLayoutEffect, useRef, useState } from 'react';

// Cambia el botón por su pista en el mismo hueco. El espacio del slot se
// conserva durante la transición para que las pistas vecinas no salten.
export default function PistaRevelable({
  revealed,
  onReveal,
  label,
  children,
  title,
  clueTitle,
  className = '',
  buttonClassName = 'btn-ghost btn-sm',
  disabled = false
}) {
  const [buttonHidden, setButtonHidden] = useState(false);
  const posicionesAntesDeRetirar = useRef(null);
  const hasClue = children !== null && children !== undefined && children !== false;

  useLayoutEffect(() => {
    const anteriores = posicionesAntesDeRetirar.current;
    posicionesAntesDeRetirar.current = null;
    if (!anteriores) return;
    anteriores.forEach(({ element, left, top }) => {
      if (!element.isConnected || typeof element.animate !== 'function') return;
      const despues = element.getBoundingClientRect();
      const x = left - despues.left;
      const y = top - despues.top;
      if (Math.abs(x) < 1 && Math.abs(y) < 1) return;
      element.animate(
        [{ transform: `translate3d(${x}px, ${y}px, 0)` }, { transform: 'translate3d(0, 0, 0)' }],
        { duration: 420, easing: 'cubic-bezier(.2,.75,.25,1)' }
      );
    });
  }, [buttonHidden]);

  if (revealed && buttonHidden && !hasClue) return null;

  return (
    <div className={'pista-revelable' + (className ? ' ' + className : '')}>
      {revealed && hasClue && (
        <div className="pista-revelable-texto" title={clueTitle} aria-live="polite">
          {children}
        </div>
      )}
      {(!revealed || !buttonHidden) && (
        <button
          type="button"
          className={buttonClassName + (revealed ? ' pista-revelable-saliendo' : '')}
          onClick={onReveal}
          onAnimationEnd={(event) => {
            if (!revealed || event.target !== event.currentTarget) return;
            // En la fila de pistas, ocultar el botón encoge su hueco y hace que
            // las opciones vecinas cambien de sitio. Guardamos su posición
            // visual para animar ese desplazamiento después del render.
            const fila = event.currentTarget.closest('.hang-pistas');
            if (fila && !window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
              posicionesAntesDeRetirar.current = Array.from(fila.children, (element) => {
                const rect = element.getBoundingClientRect();
                element.getAnimations?.().forEach((animation) => animation.cancel());
                return { element, left: rect.left, top: rect.top };
              });
            }
            setButtonHidden(true);
          }}
          disabled={disabled || revealed}
          title={title}
        >
          {label}
        </button>
      )}
    </div>
  );
}
