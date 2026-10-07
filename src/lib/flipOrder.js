// Anima brevemente el desplazamiento de fichas cuando React las reordena.
// Se miden antes del cambio y se invierte el movimiento en un layout effect,
// de modo que la primera pintura ya empieza en la posición anterior.
export function medirFichas(container, selector) {
  if (!container) return null;
  return new Map(
    [...container.querySelectorAll(selector)].map((node) => [
      node.dataset.flipId,
      node.getBoundingClientRect()
    ])
  );
}

export function animarFichas(container, selector, anteriores) {
  if (!container || !anteriores || typeof window === 'undefined') return;
  if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;

  for (const node of container.querySelectorAll(selector)) {
    if (typeof node.animate !== 'function') continue;
    const antes = anteriores.get(node.dataset.flipId);
    if (!antes) continue;
    const despues = node.getBoundingClientRect();
    const x = antes.left - despues.left;
    const y = antes.top - despues.top;
    if (Math.abs(x) < 1 && Math.abs(y) < 1) continue;

    node.animate(
      [{ transform: `translate(${x}px, ${y}px)` }, { transform: 'translate(0, 0)' }],
      { duration: 190, easing: 'cubic-bezier(0.2, 0.75, 0.25, 1)' }
    );
  }
}
