import React, { useEffect, useRef, useState } from 'react';
import { saldo, suscribir } from '../lib/monedas.js';

// El contador de monedas, fijo arriba a la derecha en todas las pantallas.
//
// Cuando cobras un ejercicio salen monedas del sitio que acabas de tocar (el
// botón de la respuesta) y vuelan hasta el contador; el número sube según van
// llegando, no de golpe. Antes solo subía un "+N" desde la píldora, y como la
// píldora ya está pegada al borde de arriba, el +N se salía de la pantalla.

const VUELO = 620; // lo que tarda una moneda en llegar
const ENTRE = 70; // separación entre una moneda y la siguiente
const MAX = 8; // más de ocho a la vez es confeti, no información

export default function Monedero() {
  const [mostrado, setMostrado] = useState(saldo);
  const [volando, setVolando] = useState([]);
  const [golpe, setGolpe] = useState(0);
  const [subidas, setSubidas] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const pildora = useRef(null);
  const esquina = useRef(null);
  const puntero = useRef(null);
  const id = useRef(0);
  const timers = useRef([]);
  const congelarPosicion = useRef(false);
  const temporizadorPosicion = useRef(null);

  // La pildora sube del todo cuando ya has bajado, para no tapar la cabecera.
  //
  // Y de paso se publica el alto de la cabecera en --cabecera. En el movil la
  // barra de arriba es una tira horizontal cuyo alto depende de si el motor de
  // IA cabe al lado del titulo o baja a su propia fila; con un `top` fijo en
  // el CSS, en las pantallas estrechas la pildora acababa plantada encima de
  // la fila de secciones.
  useEffect(() => {
    const main = document.querySelector('.main');
    const medirCabecera = () => {
      const barra = document.querySelector('.sidebar');
      if (!barra) return;
      document.documentElement.style.setProperty(
        '--cabecera',
        `${Math.round(barra.getBoundingClientRect().height)}px`
      );
    };
    const mirar = () => {
      if (!congelarPosicion.current) setScrolled(Math.max(window.scrollY, main?.scrollTop || 0) > 40);
      // Y lo que mide de ancho la esquina, en --hud. Las cabeceras que llevan
      // algo pegado a la derecha (el "← Volver" de un tema, la del chat) le
      // dejan ese hueco. Estaba escrito a mano en el CSS -92px, lo que medía
      // la pildora sola-, y al poner al lado el boton de claro/oscuro, o
      // cuando el saldo llega a cuatro cifras, se solapaban.
      if (esquina.current) {
        document.documentElement.style.setProperty(
          '--hud',
          `${Math.round(esquina.current.getBoundingClientRect().width)}px`
        );
      }
    };
    const alRedimensionar = () => {
      medirCabecera();
      mirar();
    };
    const mantenerPosicionDuranteCambio = () => {
      congelarPosicion.current = true;
      clearTimeout(temporizadorPosicion.current);
      temporizadorPosicion.current = setTimeout(() => {
        congelarPosicion.current = false;
        setScrolled(Math.max(window.scrollY, main?.scrollTop || 0) > 40);
      }, 1000);
    };
    // La altura del menú solo se vuelve a medir al cambiar el viewport. Si se
    // midiera con cada cambio de sección, el monedero podría saltar mientras
    // el contenido móvil entra con su animación.
    medirCabecera();
    mirar();
    window.addEventListener('scroll', mirar, { passive: true });
    main?.addEventListener('scroll', mirar, { passive: true });
    window.addEventListener('resize', alRedimensionar);
    window.addEventListener('app:layout-transition', mantenerPosicionDuranteCambio);
    const ro = new ResizeObserver(mirar);
    // Solo el monedero: observar todo el body hacía que cada cambio de menú o
    // idioma recalculara el estado de scroll y moviera la píldora sin necesidad.
    if (esquina.current) ro.observe(esquina.current);
    return () => {
      window.removeEventListener('scroll', mirar);
      main?.removeEventListener('scroll', mirar);
      window.removeEventListener('resize', alRedimensionar);
      window.removeEventListener('app:layout-transition', mantenerPosicionDuranteCambio);
      clearTimeout(temporizadorPosicion.current);
      ro.disconnect();
    };
  }, []);

  // De dónde salen: lo último que has tocado. Si no has tocado nada todavía
  // (teclado, o una recompensa automática), del centro de la pantalla.
  useEffect(() => {
    const ver = (e) => {
      puntero.current = { x: e.clientX, y: e.clientY };
    };
    document.addEventListener('pointerdown', ver, true);
    return () => document.removeEventListener('pointerdown', ver, true);
  }, []);

  useEffect(
    () =>
      suscribir(({ cuanto, saldo: nuevo }) => {
        if (cuanto <= 0) {
          setMostrado(nuevo); // comprar algo no merece fuegos artificiales
          return;
        }

        const caja = pildora.current?.getBoundingClientRect();
        const destino = caja
          ? { x: caja.left + caja.width / 2, y: caja.top + caja.height / 2 }
          : { x: window.innerWidth - 60, y: 28 };
        const origen = puntero.current || {
          x: window.innerWidth / 2,
          y: window.innerHeight / 2
        };

        // El premio se reparte entre las monedas que vuelan, para que el
        // contador vaya sumando a medida que caen.
        const n = Math.max(1, Math.min(cuanto, MAX));
        const trozos = Array.from(
          { length: n },
          (_, i) => Math.floor(cuanto / n) + (i < cuanto % n ? 1 : 0)
        );

        const nid = ++id.current;
        setSubidas((s) => [...s, { k: nid, cuanto }]);
        timers.current.push(
          setTimeout(() => setSubidas((s) => s.filter((x) => x.k !== nid)), VUELO + 900)
        );

        trozos.forEach((valor, i) => {
          const k = ++id.current;
          const jx = (Math.random() - 0.5) * 46;
          const jy = (Math.random() - 0.5) * 28;
          const desde = { x: origen.x + jx, y: origen.y + jy };
          const retraso = i * ENTRE;
          const ultima = i === n - 1;

          setVolando((v) => [
            ...v,
            { k, x: desde.x, y: desde.y, dx: destino.x - desde.x, dy: destino.y - desde.y, retraso }
          ]);

          timers.current.push(
            setTimeout(() => {
              setVolando((v) => v.filter((m) => m.k !== k));
              // la última cuadra el contador con el saldo de verdad, por si
              // alguna animación se ha quedado por el camino
              setMostrado((s) => (ultima ? nuevo : s + valor));
              setGolpe((g) => g + 1);
            }, retraso + VUELO)
          );
        });
      }),
    []
  );

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  return (
    <>
      {/* La esquina de arriba a la derecha. Aqui estuvo tambien el interruptor
          de claro/oscuro, pero en el movil le robaba sitio a la cabecera y el
          tema se cambia en Ajustes, que es donde se busca. */}
      <div className={`hud-esquina${scrolled ? ' scrolled' : ''}`} ref={esquina}>
        <div className="monedero" ref={pildora} aria-live="polite">
          {/* la key hace que la animación del saltito se reinicie con cada moneda */}
          <span key={golpe} className={'mnd-icono' + (golpe ? ' salta' : '')}>
            🪙
          </span>
          <strong className="mnd-total">{mostrado}</strong>
          <span className="mnd-subidas" aria-hidden="true">
            {subidas.map((s) => (
              <span key={s.k} className="mnd-sube">
                +{s.cuanto}
              </span>
            ))}
          </span>
        </div>
      </div>
      <div className="mnd-vuelos" aria-hidden="true">
        {volando.map((m) => (
          <span
            key={m.k}
            className="mnd-vuelo"
            style={{
              left: m.x,
              top: m.y,
              '--dx': `${m.dx}px`,
              '--dy': `${m.dy}px`,
              '--dur': `${VUELO}ms`,
              '--retraso': `${m.retraso}ms`
            }}
          >
            🪙
          </span>
        ))}
      </div>
    </>
  );
}
