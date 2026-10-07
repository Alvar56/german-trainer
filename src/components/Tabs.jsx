import React, { useRef, useLayoutEffect, useEffect } from 'react';

/**
 * Contenedor de pestañas con indicador animado deslizante.
 * Mide automáticamente la pestaña activa (.tab.active) y desliza
 * la línea inferior de manera suave y fluida directamente en el DOM
 * sin provocar re-renders de React.
 */
export default function Tabs({ children, className = '' }) {
  const containerRef = useRef(null);
  const sliderRef = useRef(null);

  const animarContenido = (event) => {
    const boton = event.target.closest?.('.tab');
    const tabs = containerRef.current;
    if (!boton || !tabs) return;
    const botones = Array.from(tabs.children).filter((el) => el.classList.contains('tab'));
    const desde = botones.findIndex((el) => el.classList.contains('active'));
    const hasta = botones.indexOf(boton);
    if (desde < 0 || hasta < 0 || desde === hasta) return;

    // El panel siguiente se actualiza al terminar el click de React. En el
    // próximo frame ya está su nuevo contenido y se le puede dar dirección.
    window.requestAnimationFrame(() => {
      const panel = tabs.nextElementSibling;
      if (!panel) return;
      panel.classList.remove('tab-panel-forward', 'tab-panel-backward');
      void panel.offsetWidth;
      panel.classList.add(hasta > desde ? 'tab-panel-forward' : 'tab-panel-backward');
    });
  };

  const updateSlider = () => {
    if (!containerRef.current || !sliderRef.current) return;
    const activeBtn = containerRef.current.querySelector('.tab.active');
    const slider = sliderRef.current;
    if (activeBtn) {
      slider.style.left = `${activeBtn.offsetLeft}px`;
      slider.style.width = `${activeBtn.offsetWidth}px`;
      slider.style.opacity = '1';
    } else {
      slider.style.opacity = '0';
    }
  };

  useLayoutEffect(() => {
    updateSlider();
  });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(updateSlider) : null;
    ro?.observe(el);
    window.addEventListener('resize', updateSlider);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', updateSlider);
    };
  }, []);

  return (
    <div ref={containerRef} className={'tabs' + (className ? ' ' + className : '')} onClickCapture={animarContenido}>
      {children}
      <span ref={sliderRef} className="tab-slider" aria-hidden="true" />
    </div>
  );
}
