import React, { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Desplegable from './Desplegable.jsx';
import FoxFace from './FoxFace.jsx';
import SaltosFelix, { useSaltos } from './SaltosFelix.jsx';
import {
  getFuchs,
  setFuchs,
  coloresDisponibles,
  complementosDe,
  animalesDisponibles,
  comprar,
  logros,
  onCoronasListo,
  textoReq,
  puedeCambiarNombre,
  comprarNombre,
  PRECIO_NOMBRE
} from '../lib/fuchs.js';
import { saldo } from '../lib/monedas.js';
import { storage } from '../lib/storage.js';
import { useTeclas } from '../lib/teclas.js';

// La tienda del zorro va ENTERA en alemán, títulos y nombres de las cosas
// incluidos: es una pantalla que se mira mucho y son palabras fáciles, así que
// sale vocabulario gratis. Y sin emojis delante de cada nombre: con cincuenta
// cosas en la lista, el emoji era ruido, no información.
// De la cabeza a los pies, y lo que no se viste al final.
const RANURAS = [
  { id: 'cabeza', de: 'Auf dem Kopf', ico: '🧢' },
  { id: 'ojos', de: 'Auf den Augen', ico: '👓' },
  { id: 'cuello', de: 'Um den Hals', ico: '🧣' },
  { id: 'ropa', de: 'Kleidung', ico: '👕' },
  { id: 'pies', de: 'An den Füßen', ico: '👟' },
  { id: 'objeto', de: 'Gegenstände', ico: '🎒' },
  { id: 'particulas', de: 'Effekte', ico: '✨' },
  { id: 'fondo', de: 'Hintergrund', ico: '🏞️' }
];

// El Felix grande de la tienda, con su propia cara cambiante. Va aparte para
// que cada cambio de gesto solo vuelva a pintar a Felix y no toda la tienda.
// Antes estaba fijo en «feliz», con los ojos cerrados todo el rato.
const RONDA_GESTOS = ['normal', 'feliz', 'normal', 'guino', 'normal', 'pensando', 'normal', 'sorpresa'];
function FelixConGestos({ reaccionRef, ...props }) {
  const [gesto, setGesto] = useState('normal');
  const hasta = useRef(0);
  const vuelta = useRef(null);
  useEffect(() => {
    let i = 0;
    const id = setInterval(() => {
      if (Date.now() < hasta.current) return;
      i = (i + 1) % RONDA_GESTOS.length;
      setGesto(RONDA_GESTOS[i]);
    }, 2600);
    reaccionRef.current = (g, ms = 1800) => {
      hasta.current = Date.now() + ms;
      setGesto(g);
      clearTimeout(vuelta.current);
      vuelta.current = setTimeout(() => setGesto('normal'), ms);
    };
    return () => {
      clearInterval(id);
      clearTimeout(vuelta.current);
      reaccionRef.current = null;
    };
  }, [reaccionRef]);
  return <FoxFace {...props} gesto={gesto} />;
}

// Un bloque de la tienda: lo que se compra arriba y lo que se gana debajo,
// separado. Mezclados, un trofeo que no esta en venta parecia lo mas caro de
// la lista.
// Una cosa de la tienda. Tres estados: ya es tuya (se pone), se puede comprar,
// o es un trofeo — y esos no se venden, se ganan.
function Ficha({ cosa, puesta, monedas, onPoner, onComprar, dot = null }) {
  const trofeo = !!cosa.req;
  const puedes = monedas >= cosa.precio;

  if (cosa.abierto) {
    return (
      <button className={'fox-item' + (puesta ? ' on' : '')} onClick={onPoner}>
        <span className="fci-fila">
          {dot}
          <span>{cosa.de}</span>
        </span>
      </button>
    );
  }

  return (
    <button
      className={'fox-item bloqueado' + (!trofeo && puedes ? ' comprable' : '')}
      disabled={trofeo || !puedes}
      onClick={trofeo ? undefined : onComprar}
      title={trofeo ? 'Das musst du dir verdienen' : ''}
    >
      <span className="fci-fila">
        {dot}
        <span>{cosa.de}</span>
      </span>
      <small>
        {trofeo ? textoReq(cosa.req) : `${cosa.precio} Münzen${puedes ? ' · kaufen' : ''}`}
      </small>
    </button>
  );
}

// Un bloque de la tienda, plegable: lo que se compra arriba y lo que se gana
// debajo, separado. Solo evalúa sus fichas cuando está abierto para no saturar
// el hilo principal con 100+ botones en cada render.
function Bloque({ titulo, ico, cosas, esPuesta, monedas, onPoner, onComprar, dot, abierto, onAbrir }) {
  const puesta = useMemo(() => cosas.find((c) => esPuesta(c)), [cosas, esPuesta]);
  const aTiro = useMemo(
    () => cosas.filter((c) => !c.abierto && !c.req && monedas >= c.precio).length,
    [cosas, monedas]
  );
  const ganables = useMemo(() => (abierto ? cosas.filter((c) => c.req) : []), [abierto, cosas]);
  const comprables = useMemo(() => (abierto ? cosas.filter((c) => !c.req) : []), [abierto, cosas]);
  const partir = abierto && ganables.length > 0 && comprables.some((c) => c.precio > 0);

  const pinta = (lista) => (
    <div className="fox-items">
      {lista.map((c) => (
        <Ficha
          key={c.id}
          cosa={c}
          puesta={esPuesta(c)}
          monedas={monedas}
          dot={dot ? dot(c) : null}
          onPoner={() => onPoner(c)}
          onComprar={() => onComprar(c)}
        />
      ))}
    </div>
  );

  return (
    <div className={'fox-bloque' + (abierto ? ' abierto' : '')}>
      <button className="fox-tirador" onClick={onAbrir} aria-expanded={abierto}>
        <span className="fox-tirador-izq">
          <span className="fox-ico" aria-hidden="true">{ico}</span>
          <span className="fox-titulo">{titulo}</span>
        </span>
        <span className="fox-tirador-der">
          {puesta && (
            <span className="fox-puesta">
              <span>{puesta.de}</span>
            </span>
          )}
          {aTiro > 0 && <span className="fox-atiro">{aTiro}</span>}
          <span className="chev">{abierto ? '▴' : '▾'}</span>
        </span>
      </button>
      <Desplegable abierto={abierto}>
        {abierto && (
          partir ? (
            <>
              {pinta(comprables)}
              <div className="fox-subtitulo">Zu verdienen</div>
              {pinta(ganables)}
            </>
          ) : (
            pinta(cosas)
          )
        )}
      </Desplegable>
    </div>
  );
}

export default function FoxAjustes({ onClose, onChange }) {
  const [f, setF] = useState(getFuchs);
  // Salta al abrir la tienda (ver SaltosFelix.jsx).
  const saltos = useSaltos(true);
  const [monedas, setMonedas] = useState(saldo);
  const [aviso, setAviso] = useState('');
  const [previsualizarEfecto, setPrevisualizarEfecto] = useState(false);
  const [desvaneciendoEfecto, setDesvaneciendoEfecto] = useState(false);
  const [cerrando, setCerrando] = useState(false);
  const [abierta, setAbierta] = useState(null);
  const [nombreLibre, setNombreLibre] = useState(puedeCambiarNombre);
  const [l, setLogros] = useState(logros);
  // Felix va cambiando de cara mientras miras la tienda (FelixConGestos).
  // Aqui solo se le avisa de lo que pasa: se alegra al ponerle algo y se
  // pone triste si no llegan las monedas.
  const reaccionRef = useRef(null);
  const reaccionar = (g, ms) => reaccionRef.current?.(g, ms);
  const timerRef = useRef(null);
  const efectoPreviewTimer = useRef(null);
  const efectoFadeTimer = useRef(null);
  const cierreTimer = useRef(null);
  const cierreIniciado = useRef(false);
  const onChangeRef = useRef(onChange);
  useEffect(() => onCoronasListo(() => setLogros(logros())), []);
  useEffect(() => {
    if (typeof document !== 'undefined' && document.body) {
      document.body.classList.add('fox-modal-abierto');
    }
    return () => {
      clearTimeout(efectoPreviewTimer.current);
      clearTimeout(efectoFadeTimer.current);
      clearTimeout(cierreTimer.current);
      if (typeof document !== 'undefined' && document.body) {
        document.body.classList.remove('fox-modal-abierto');
      }
    };
  }, []);

  function cerrar() {
    if (cierreIniciado.current) return;
    cierreIniciado.current = true;
    setCerrando(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    onChangeRef.current?.(f);
    cierreTimer.current = setTimeout(onClose, 320);
  }

  // Al abrir la tienda se enseña 3 segundos el efecto que lleva puesto Felix
  // y luego se desvanece, igual que al elegirlo. Si no lleva ninguno, nada.
  useEffect(() => {
    mostrarPrevisualizacionEfecto(f.particulas);
  }, []);

  // Y con Escape también. useTeclas no se mete cuando estás escribiendo, así
  // que ponerle nombre al zorro sigue funcionando.
  useTeclas({ Escape: cerrar });

  function mostrarPrevisualizacionEfecto(id) {
    clearTimeout(efectoPreviewTimer.current);
    clearTimeout(efectoFadeTimer.current);
    setDesvaneciendoEfecto(false);
    if (!id || id === 'p0') {
      setPrevisualizarEfecto(false);
      return;
    }
    setPrevisualizarEfecto(true);
    efectoPreviewTimer.current = setTimeout(() => {
      setDesvaneciendoEfecto(true);
      efectoFadeTimer.current = setTimeout(() => {
        setPrevisualizarEfecto(false);
        setDesvaneciendoEfecto(false);
      }, 650);
    }, 3000);
  }

  function cambiar(patch) {
    const next = setFuchs(patch);
    setF(next);
    reaccionar('muyfeliz');
    if (Object.prototype.hasOwnProperty.call(patch, 'particulas')) {
      mostrarPrevisualizacionEfecto(patch.particulas);
    }
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      onChangeRef.current?.(next);
    }, 350);
  }

  function sinMonedas() {
    reaccionar('triste');
    setAviso('Du hast nicht genug Münzen.');
    setTimeout(() => setAviso(''), 2500);
  }

  // Ponerle otro nombre se paga una vez y ya se queda desbloqueado.
  function pagarNombre() {
    const r = comprarNombre();
    setMonedas(r.saldo);
    if (!r.ok) return sinMonedas();
    setNombreLibre(true);
  }

  function pagar(id, ranura) {
    const r = comprar(id);
    setMonedas(r.saldo);
    if (!r.ok) return sinMonedas();
    // recién comprado, se pone puesto
    cambiar(ranura ? { [ranura]: id } : { especie: id });
  }

  return createPortal(
    <div
      className={'fox-modal' + (cerrando ? ' fox-modal-saliendo' : '')}
      role="dialog"
      aria-modal="true"
      // Pinchar en el gris de alrededor cierra, como en cualquier ventana. Se
      // comprueba que el clic sea EN el fondo y no en algo de dentro: si no,
      // comprar una gorra cerraría la tienda.
      onClick={(e) => { if (!cerrando && e.target === e.currentTarget) cerrar(); }}
    >
      <div className="fox-modal-caja">
        <div className={'fox-hero-escena fox-escena-' + (f.fondo || 'nadaFondo')}>
          <div className="fox-hero-topbar">
            <div className="fox-hero-top-left">
              {/* El nombre del zorro va en una tarjeta como las de la derecha,
                  con las monedas justo debajo: así las dos esquinas de arriba
                  tienen la misma forma. */}
              <h2 className="fox-hero-tarjeta-nombre">{f.nombre || 'Fuchs'}</h2>
              <div className="fox-hero-saldo monedero">
                <span className="mnd-icono">🪙</span>
                <strong className="mnd-total">{monedas}</strong>
              </div>
            </div>
            <button className="fox-hero-cerrar" onClick={cerrar} title="Zurück" aria-label="Schließen">✕</button>
          </div>

          {/* Como en la portada: salta al abrir la tienda y cada vez que lo tocas. */}
          <div className="fox-hero-personaje" onClick={saltos.saltar}>
            <SaltosFelix saltos={saltos} espacio={f.fondo === 'weltraum'}>
            <FelixConGestos
              reaccionRef={reaccionRef}
              fuchs={f}
              size={152}
              conCuerpo
              chispeando={previsualizarEfecto}
              desvaneciendoEfecto={desvaneciendoEfecto}
              racha={20}
            />
            </SaltosFelix>
          </div>

          <div className="fox-hero-stats-wrap">
            <ul className="fox-hero-stats">
              <li><strong>{l.coronas}</strong><small>Kronen</small></li>
              <li><strong className={l.nivel >= 100 ? 'num-dorado' : ''}>{l.nivel}</strong><small>Level</small></li>
              <li><strong>{l.racha}</strong><small>in Folge</small></li>
              <li><strong>{l.dias}</strong><small>Tage</small></li>
            </ul>
          </div>

          {/* Paso del paisaje al cuerpo del modal. Antes aquí había además una
              curva que pintaba blanco opaco sobre los últimos 13px: como el
              degradado a esa altura ya va por el 90%, el borde de la curva se
              veía como una raya clara cruzando el pie de la escena. Con el
              degradado alto basta, así que la curva sobra. */}
          <div className="fox-hero-transicion" aria-hidden="true" />
        </div>

        <div className="fox-modal-cuerpo">
          {aviso && <p className="fox-aviso">{aviso}</p>}

          <label className="field">
          Sein Name
          <div className="fox-nombre">
            <input
              type="text"
              value={f.nombre}
              maxLength={16}
              disabled={!nombreLibre}
              onChange={(e) => cambiar({ nombre: e.target.value })}
            />
            {!nombreLibre && (
              <button
                type="button"
                className={'fox-item' + (monedas >= PRECIO_NOMBRE ? ' comprable' : ' bloqueado')}
                disabled={monedas < PRECIO_NOMBRE}
                onClick={pagarNombre}
              >
                {/* El texto indica para qué sirve el precio: al lado de
                    un campo de nombre bloqueado parecia el precio del zorro. */}
                <small>Namen ändern · {PRECIO_NOMBRE} Münzen{monedas >= PRECIO_NOMBRE ? ' · kaufen' : ''}</small>
              </button>
            )}
          </div>
        </label>

        <div className="fox-secciones">
          {/* Primero QUE eres y de que color: es lo que mas cambia al zorro. */}
          <Bloque
            titulo="Tier"
            ico="🦊"
            abierto={abierta === 'tier'}
            onAbrir={() => setAbierta((x) => (x === 'tier' ? null : 'tier'))}
            cosas={animalesDisponibles(f, l)}
            esPuesta={(a) => f.especie === a.id}
            monedas={monedas}
            onPoner={(a) => cambiar({ especie: a.id })}
            onComprar={(a) => pagar(a.id, null)}
          />

          <Bloque
            titulo="Farbe"
            ico="🎨"
            abierto={abierta === 'farbe'}
            onAbrir={() => setAbierta((x) => (x === 'farbe' ? null : 'farbe'))}
            cosas={coloresDisponibles(f, l)}
            esPuesta={(c) => f.color === c.id}
            monedas={monedas}
            dot={(c) => {
              const esGalaxy = c?.id?.startsWith('galaxy');
              return (
                <span
                  className={`fci-dot ${esGalaxy ? `fci-dot-galaxy fci-dot-${c.id}` : ''}`}
                  style={{ background: c?.fur, borderColor: c?.sombra }}
                />
              );
            }}
            onPoner={(c) => cambiar({ color: c.id })}
            onComprar={(c) => pagar(c.id, 'color')}
          />

          {/* Y luego se viste, de la cabeza a los pies. */}
          {RANURAS.map((r) => (
            <Bloque
              key={r.id}
              titulo={r.de}
              ico={r.ico}
              abierto={abierta === r.id}
              onAbrir={() => {
                const siguiente = abierta === r.id ? null : r.id;
                setAbierta(siguiente);
                if (siguiente === 'particulas') mostrarPrevisualizacionEfecto(f.particulas);
              }}
              cosas={complementosDe(r.id, f, l)
                .sort((a, b) => r.id === 'objeto' ? (a.precio ?? Infinity) - (b.precio ?? Infinity) : 0)}
              esPuesta={(c) => f[r.id] === c.id}
              monedas={monedas}
              onPoner={(c) => cambiar({ [r.id]: c.id })}
              onComprar={(c) => pagar(c.id, r.id)}
            />
          ))}
        </div>

        {/* Próximamente */}
        <div
          style={{
            textAlign: 'center',
            padding: '8px 12px',
            marginTop: 4,
            marginBottom: 2,
            fontSize: '0.8rem',
            color: 'var(--muted)',
            background: 'var(--surface-2)',
            borderRadius: 'var(--radius-sm)',
            border: '1px dashed var(--border)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <span>Mehr Tiere &amp; Accessoires kommen bald…</span>
        </div>

        <button className="btn-primary" style={{ width: '100%', marginTop: 8 }} onClick={cerrar}>
          Fertig
        </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
