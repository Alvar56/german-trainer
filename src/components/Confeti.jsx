import React, { useEffect, useMemo, useRef } from 'react';
import { createPortal } from 'react-dom';

const COLORES = ['#f59e0b', '#ef476f', '#10b981', '#3b82f6', '#a855f7'];

function reproducirSonido(intensidad) {
  if (typeof window === 'undefined') return;
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  if (!AudioContext) return;

  let audio;
  try {
    audio = new AudioContext();
  } catch {
    return;
  }

  const suave = intensidad === 'suave';
  const notas = suave ? [659.25, 783.99, 987.77] : [523.25, 659.25, 783.99, 1046.5, 1318.5];
  const tocar = () => {
    const inicio = audio.currentTime + 0.015;
    const volumen = suave ? 0.035 : 0.055;
    notas.forEach((frecuencia, indice) => {
      const momento = inicio + indice * (suave ? 0.105 : 0.095);
      const tono = audio.createOscillator();
      const volumenTono = audio.createGain();
      tono.type = 'sine';
      tono.frequency.setValueAtTime(frecuencia, momento);
      volumenTono.gain.setValueAtTime(0.0001, momento);
      volumenTono.gain.exponentialRampToValueAtTime(volumen, momento + 0.025);
      volumenTono.gain.exponentialRampToValueAtTime(0.0001, momento + 0.29);
      tono.connect(volumenTono);
      volumenTono.connect(audio.destination);
      tono.start(momento);
      tono.stop(momento + 0.3);
    });
    window.setTimeout(() => audio.close().catch(() => {}), 950);
  };

  audio.resume().then(tocar).catch(() => audio.close().catch(() => {}));
}

function particulasLluvia() {
  return Array.from({ length: 76 }, (_, i) => ({
    color: COLORES[i % COLORES.length],
    izquierda: i % 2 === 0 ? '0vw' : '100vw',
    x: `${(i % 2 === 0 ? 1 : -1) * (12 + Math.random() * 45)}vw`,
    y: '112vh',
    rotacion: `${((i * 137) % 900) - 450}deg`,
    retraso: `${(i * 47) % 1150}ms`,
    duracion: `${3600 + (i % 5) * 260}ms`
  }));
}

function particulasLluviaGeneral() {
  return Array.from({ length: 56 }, (_, i) => ({
    color: COLORES[(i * 3 + 1) % COLORES.length],
    izquierda: `${(i * 47 + 9) % 100}vw`,
    x: `${((i * 19) % 13) - 6}vw`,
    y: '112vh',
    rotacion: `${((i * 113) % 720) - 360}deg`,
    retraso: `${(i * 59) % 1350}ms`,
    duracion: `${3500 + (i % 6) * 240}ms`
  }));
}

function particulasNormales(suave) {
  const cantidad = suave ? 8 : 24;
  return Array.from({ length: cantidad }, (_, i) => ({
    color: COLORES[i % COLORES.length],
    izquierda: '50%',
    x: `${((i * (suave ? 17 : 37)) % (suave ? 37 : 81)) - (suave ? 18 : 40)}vw`,
    y: `${(suave ? 12 : 35) + ((i * 13) % (suave ? 16 : 35))}vh`,
    rotacion: `${((i * 137) % 720) - 360}deg`,
    retraso: `${(i * (suave ? 30 : 17)) % (suave ? 150 : 220)}ms`,
    duracion: `${suave ? 1150 + (i % 3) * 100 : 1500 + (i % 4) * 130}ms`
  }));
}

function explosionesCorona() {
  const cantidadExplosiones = 3 + Math.floor(Math.random() * 2);
  return Array.from({ length: cantidadExplosiones }, (_, explosión) => {
    const fase = Math.random() * Math.PI * 2;
    const centroX = 18 + Math.random() * 64;
    const centroY = 17 + Math.random() * 66;
    const piezas = Array.from({ length: 24 }, (_, i) => {
      const angulo = fase + (i / 24) * Math.PI * 2;
      const distanciaX = 6 + Math.random() * 12;
      const distanciaY = 7 + Math.random() * 10;
      return {
        color: COLORES[(i + explosión * 2) % COLORES.length],
        x: `${Math.cos(angulo) * distanciaX}vw`,
        y: `${Math.sin(angulo) * distanciaY}vh`,
        rotacion: `${((i * 137) % 720) - 360}deg`,
        retraso: `${explosión * 480 + Math.floor(Math.random() * 90)}ms`,
        duracion: `${1550 + Math.floor(Math.random() * 360)}ms`
      };
    });
    return { centroX, centroY, piezas };
  });
}

function explosionesSuaves() {
  const cantidadExplosiones = 5 + Math.floor(Math.random() * 2);
  return Array.from({ length: cantidadExplosiones }, (_, explosion) => {
    const fase = Math.random() * Math.PI * 2;
    const centroX = 7 + Math.random() * 86;
    const centroY = 10 + Math.random() * 78;
    const totalPiezas = 14;
    const piezas = Array.from({ length: totalPiezas }, (_, i) => {
      const angulo = fase + (i / totalPiezas) * Math.PI * 2;
      const distanciaX = 4 + Math.random() * 5;
      const distanciaY = 4 + Math.random() * 6;
      return {
        color: COLORES[(i + explosion * 2) % COLORES.length],
        x: `${Math.cos(angulo) * distanciaX}vw`,
        y: `${Math.sin(angulo) * distanciaY}vh`,
        rotacion: `${((i * 137) % 540) - 270}deg`,
        retraso: `${explosion * 300 + Math.floor(Math.random() * 70)}ms`,
        duracion: `${1250 + Math.floor(Math.random() * 300)}ms`
      };
    });
    return { centroX, centroY, piezas };
  });
}

function pieza(pieza, i) {
  return (
    <i
      key={i}
      style={{
        '--confetti-color': pieza.color,
        '--confetti-left': pieza.izquierda,
        '--confetti-x': pieza.x,
        '--confetti-y': pieza.y,
        '--confetti-rotation': pieza.rotacion,
        '--confetti-delay': pieza.retraso,
        '--confetti-duration': pieza.duracion
      }}
    />
  );
}

export default function Confeti({ intensidad = 'fuerte' }) {
  const sonidoReproducido = useRef(null);
  const esCorona = intensidad === 'corona' || intensidad === 'dominio';
  const lluvia = useMemo(() => particulasLluvia(), []);
  const lluviaGeneral = useMemo(() => particulasLluviaGeneral(), []);
  const explosiones = useMemo(() => explosionesCorona(), []);
  const explosionesSuavesMemo = useMemo(() => explosionesSuaves(), []);
  const piezas = useMemo(() => particulasNormales(intensidad === 'suave'), [intensidad]);

  useEffect(() => {
    if (!intensidad || sonidoReproducido.current === intensidad) return;
    sonidoReproducido.current = intensidad;
    reproducirSonido(intensidad);
  }, [intensidad]);

  if (esCorona) {
    const celebracion = (
      <div className="celebracion-confeti corona" aria-hidden="true">
        <div className="corona-lluvia">
          {lluvia.map((confeti, i) => pieza(confeti, i))}
        </div>
        <div className="corona-lluvia-general">
          {lluviaGeneral.map((confeti, i) => pieza(confeti, i))}
        </div>
        {explosiones.map((explosion, indice) => (
          <div
            className="corona-explosion"
            key={indice}
            style={{ '--burst-left': `${explosion.centroX}vw`, '--burst-top': `${explosion.centroY}vh` }}
          >
            {explosion.piezas.map((confeti, i) => pieza(confeti, i))}
          </div>
        ))}
      </div>
    );
    return typeof document === 'undefined' ? celebracion : createPortal(celebracion, document.body);
  }

  const celebracion = (
    <div className={'celebracion-confeti ' + intensidad} aria-hidden="true">
      {piezas.map((confeti, i) => pieza(confeti, i))}
      {intensidad === 'suave' && explosionesSuavesMemo.map((explosion, indice) => (
        <div
          className="suave-explosion"
          key={indice}
          style={{ '--burst-left': `${explosion.centroX}vw`, '--burst-top': `${explosion.centroY}vh` }}
        >
          {explosion.piezas.map((confeti, i) => pieza(confeti, i))}
        </div>
      ))}
    </div>
  );
  return typeof document === 'undefined' ? celebracion : createPortal(celebracion, document.body);
}
