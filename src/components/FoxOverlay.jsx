import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import FoxFace, { EMPIEZA } from './FoxFace.jsx';
import { getFuchs } from '../lib/fuchs.js';
import { useExerciseActive } from '../lib/teclas.js';
import SaltosFelix, { useSaltos } from './SaltosFelix.jsx';

// La mascota que acompaña en los ejercicios, abajo a la derecha.
//
// Vivía dentro de Session.jsx, así que solo salía en los ejercicios de
// gramática: los minijuegos de vocabulario, el examen, traducir frases y el
// repaso del cuaderno se quedaban sin ella sin ninguna razón de fondo.
//
// La colocación vive en el CSS (.fox-overlay) y no aquí: un estilo en línea
// gana SIEMPRE a la hoja de estilos, así que con el display puesto aquí no
// había forma de esconderla en el móvil. Lo único que se queda en línea es el
// salto, que depende del estado.

// Lo que dice mientras contestas. Es lo que MÁS se ve con diferencia: en los
// ejercicios con corrección el bocadillo se esconde al corregir para no tapar
// el cuadro de abajo, así que los mensajes de acierto y de fallo pasan de
// largo y esta es la lista que el zorro repite todo el rato. Con una sola
// frase —«Weiter so!»— parecía un cartel, no una mascota.
const ANIMA = [
  'Weiter so!',
  'Du schaffst das!',
  'Nur Mut!',
  'Konzentration!',
  'Bleib dran!',
  'Nicht aufgeben!',
  'Ich glaube an dich!',
  'Ganz ruhig.',
  'Denk nach!',
  'Noch eins!',
  'Fast geschafft!',
  'Streng dich an!',
  'Weiter geht’s!',
  'Zeig, was du kannst!',
  'Immer weiter!',
  'Das wird schon!'
];

const GANA = [
  'Super!',
  'Toll!',
  'Richtig!',
  'Wunderbar!',
  'Klasse!',
  'Genau!',
  'Perfekt!',
  'Bravo!',
  'Stark!',
  'Sehr gut!',
  'Prima!',
  'Genau so!'
];

const FALLA = [
  'Schade!',
  'Kopf hoch!',
  'Knapp daneben!',
  'Versuch’s nochmal!',
  'Fast!',
  'Das war knapp.',
  'Beim nächsten Mal!',
  'Ach nein…',
  'Nicht schlimm!',
  'Weiter, weiter!'
];

const AL_EMPEZAR = 'Los geht’s!';

// Lo que dice cuando lo tocas a mitad de un ejercicio (y da sus saltitos).
const TOQUE = [
  'Hihi, das kitzelt!',
  'Hey, ich arbeite hier!',
  'Konzentrier dich lieber!',
  'Huch!',
  'Hoppla!',
  'Ja, ich bin noch da!',
  'Nicht kitzeln!',
  'Zurück zur Aufgabe!',
  'Juhu!',
  'Spring mit mir!'
];

// Una al azar, pero nunca la misma dos veces seguidas: repetir es justo lo que
// hace que se note que son cuatro frases contadas.
function otra(lista, actual) {
  if (lista.length < 2) return lista[0];
  let n = lista[Math.floor(Math.random() * lista.length)];
  let guard = 0;
  while (n === actual && guard++ < 8) n = lista[Math.floor(Math.random() * lista.length)];
  return n;
}

// El estado de la mascota. Cada ejercicio llama a `acierto(ok)` cuando juzga
// una respuesta y a `sigue()` al pasar a la siguiente.
export function useFox() {
  const [msg, setMsg] = useState(AL_EMPEZAR);
  const [gesto, setGesto] = useState('normal');
  const [salta, setSalta] = useState(false);
  const timer = useRef(null);
  // La ultima frase de CADA lista, para no repetirla.
  //
  // Una sola memoria no vale: entre dos frases de animo se cuela la del
  // acierto o el fallo -que casi siempre esta oculta-, asi que al elegir la
  // siguiente se comparaba con una frase que no se llego a ver y las dos
  // visibles podian salir iguales.
  //
  // Y va en una ref y no leyendo el `prev` del setState porque en StrictMode
  // React llama dos veces al actualizador, y la segunda compara contra el
  // resultado de la primera.
  const ultimas = useRef({ anima: AL_EMPEZAR, gana: null, falla: null });
  // Seguidas, para que la cara responda a cómo va la cosa y no solo a la
  // última respuesta: tres aciertos de fila no son lo mismo que uno suelto.
  const seguidas = useRef(0);

  useEffect(() => () => clearTimeout(timer.current), []);

  function acierto(ok) {
    seguidas.current = ok
      ? Math.max(1, seguidas.current + 1)
      : Math.min(-1, seguidas.current - 1);
    const n = seguidas.current;

    const clave = ok ? 'gana' : 'falla';
    ultimas.current[clave] = otra(ok ? GANA : FALLA, ultimas.current[clave]);
    setMsg(ultimas.current[clave]);

    if (ok) {
      // A partir de tres seguidas se le va la cabeza; el guiño sale de vez en
      // cuando para que no sea siempre la misma cara.
      if (n >= 3) setGesto('muyfeliz');
      else if (n === 2) setGesto(Math.random() < 0.5 ? 'guino' : 'feliz');
      else setGesto('feliz');
    } else {
      if (n <= -3) setGesto('llorando');
      else if (n === -2) setGesto('enfadado');
      else setGesto('triste');
    }

    setSalta(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setSalta(false), 300);
  }

  function sigue() {
    ultimas.current.anima = otra(ANIMA, ultimas.current.anima);
    setMsg(ultimas.current.anima);
    // Casi siempre la cara de siempre, pero de cuando en cuando piensa o mira
    // sorprendido: quieto y con la misma cara parece un dibujo pegado.
    const r = Math.random();
    setGesto(r < 0.12 ? 'pensando' : r < 0.18 ? 'sorpresa' : 'normal');
  }

  return { msg, gesto, salta, acierto, sigue };
}

// `mudo` marca los momentos en que el bocadillo ESTORBA: mientras se ve una
// corrección, que ocupa la parte de abajo de la pantalla.
//
// Pero estorbar solo estorba si hay poco sitio. El cuadro de la corrección
// mide 600 px como mucho y el zorro vive pegado a la esquina de abajo a la
// derecha, así que en una ventana de ordenador el bocadillo cae en el margen
// y no tapa nada: callarlo allí era quitar la mitad de la gracia de tener
// mascota. Por eso ya no se deja de pintar, se le pone una clase y es el CSS
// quien decide, que es el único que sabe cuánto sitio hay.
// `racha` son los aciertos seguidos que llevas ahora mismo. Las chispas del
// zorro salen a partir de dos, a la vez que el rayito de la cabecera: asi
// premian algo en vez de estar puestas siempre.
export default function FoxOverlay({ fox, mudo = false, racha = 0, className = '', fondoFeedback = false }) {
  const activa = useExerciseActive();
  // Tocarlo: da sus saltitos (SaltosFelix) y dice otra cosa. Lo que dice al
  // tocarlo dura hasta que el ejercicio le hace hablar de nuevo.
  const saltos = useSaltos(false);
  const [dicho, setDicho] = useState(null);
  const ultimoToque = useRef(null);
  useEffect(() => setDicho(null), [fox.msg]);
  if (!activa) return null;

  const f = getFuchs();
  const fondo = f.fondo || 'nadaFondo';

  function tocar() {
    saltos.saltar();
    ultimoToque.current = otra(TOQUE, ultimoToque.current);
    setDicho(ultimoToque.current);
  }
  const mensaje = dicho || fox.msg;

  const overlay = (
    <>
      {/* Difuminado suave inferior con la tonalidad del fondo elegido */}
      <div className={'fox-difuminado-suelo fox-difuminado-' + fondo + (fondoFeedback ? ' fox-difuminado-feedback' : '')} aria-hidden="true" />

      <div
        className={'fox-overlay' + (fondoFeedback ? ' fox-overlay-feedback' : '') + (className ? ' ' + className : '')}
        style={{ transform: fox.salta ? 'translateY(-15px)' : 'none' }}
      >
        {mensaje && <div className={'fox-burbuja-dice' + (mudo && !dicho ? ' estorba' : '')}>{mensaje}</div>}
        <div className="fox-overlay-cara" style={{ pointerEvents: 'auto' }} onClick={tocar}>
          <SaltosFelix saltos={saltos} espacio={fondo === 'weltraum'} agua={fondo === 'unterwasser'}>
          <FoxFace
            fuchs={f}
            gesto={fox.gesto}
            size={110}
            conCuerpo
            chispeando={racha >= EMPIEZA}
            racha={racha}
            className="flota"
          />
          </SaltosFelix>
        </div>
      </div>
    </>
  );

  return createPortal(overlay, document.body);
}
