import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { t, pick } from '../lib/i18n.js';
import { tc } from '../lib/contenido/index.js';
import { useTeclas } from '../lib/teclas.js';
import { animarFichas, medirFichas } from '../lib/flipOrder.js';

// Ordenar la frase en la misma caja, de dos maneras que valen a la vez:
//
//   · arrastrando: coges la palabra, te sale un hueco donde va a caer y la
//     sueltas ahí;
//   · tocando: un toque la levanta y otro toque en otra palabra la coloca
//     justo delante. Sin arrastrar, que en móvil y en trackpad es un lío.
//
// Las palabras que ya están en su posición se marcan en verde mientras ordenas.
export default function WordOrder({ item, onAnswer }) {
  // El aviso de item invalido se pinta al final, por debajo de los hooks. Si
  // cortase aqui arriba, un item que pasa de invalido a valido sin que el
  // componente se desmonte dejaria a React con menos hooks de los que vio en el
  // render anterior, y eso no lo avisa: tira la pantalla entera.
  const valido = !!(item && item.tokens && item.solution);
  const solution = valido ? item.solution : [];
  const validas = valido && item.alternativas && item.alternativas.length
    ? item.alternativas
    : [solution.join(' ')];

  // Empieza desordenado, pero nunca con la frase ya resuelta.
  const initial = useMemo(() => {
    if (!valido) return [];
    const toks = item.tokens.map((tok, i) => ({ id: i, text: tok }));
    if (toks.length > 1 && toks.map((x) => x.text).join(' ') === solution.join(' ')) {
      return [toks[1], toks[0], ...toks.slice(2)];
    }
    return toks;
  }, [item]);

  const [words, setWords] = useState(initial);
  const [cogida, setCogida] = useState(null); // id levantado con un toque
  const [drag, setDrag] = useState(null); // {id, text, x, y, dx, dy, w, h}
  const [destino, setDestino] = useState(null); // hueco donde caería
  const [checked, setChecked] = useState(false);
  const [correct, setCorrect] = useState(false);
  // Acertó con una colocación distinta de la de referencia: se le dice que la
  // suya vale y cuál es la otra, que también hay que saberla.
  const [otraForma, setOtraForma] = useState(null);

  const boxRef = useRef(null);
  const posicionesAntes = useRef(null);
  const inicio = useRef(null); // gesto en curso
  // Los handlers de puntero se disparan muchas veces seguidas; leer el estado
  // de React llegaría tarde, así que lo importante va también en refs.
  const destinoRef = useRef(null);
  const cogidaRef = useRef(null);

  function prepararAnimacion() {
    posicionesAntes.current = medirFichas(boxRef.current, '.wo-word');
  }

  useLayoutEffect(() => {
    const anteriores = posicionesAntes.current;
    posicionesAntes.current = null;
    animarFichas(boxRef.current, '.wo-word', anteriores);
  }, [words]);

  useEffect(() => {
    setWords(initial);
    setCogida(null);
    cogidaRef.current = null;
    setDrag(null);
    setDestino(null);
    destinoRef.current = null;
    inicio.current = null;
    setChecked(false);
    setCorrect(false);
  }, [initial]);

  // Red de seguridad: si sueltas fuera de la ventana, cambias de aplicación o
  // el navegador cancela el gesto, el pointerup no llega al botón y la palabra
  // se quedaría flotando. Escuchando también en la ventana, siempre aterriza.
  useEffect(() => {
    if (!drag) return;
    const soltar = () => onPointerUp();
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', soltar);
    window.addEventListener('blur', soltar);
    return () => {
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', soltar);
      window.removeEventListener('blur', soltar);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [drag]);

  // Qué palabras ya están en su posición correcta. Se muestra durante el
  // ejercicio para dar el mismo feedback progresivo que Wortsalat.
  const enSuSitio = useMemo(
    () => words.map((w, i) => w.text === solution[i]),
    [words, solution]
  );

  // En cuanto toda la frase aceptada queda ordenada, se registra el acierto.
  // Las palabras correctas en posiciones sueltas siguen verdes como pista,
  // pero solo la frase completa dispara la respuesta.
  useEffect(() => {
    if (checked || !valido) return;
    const mia = words.map((w) => w.text).join(' ');
    if (!validas.includes(mia)) return;
    setOtraForma(mia !== solution.join(' ') ? mia : null);
    setCorrect(true);
    setChecked(true);
    onAnswer(true);
  }, [words, checked, valido, validas, solution, onAnswer]);

  // La palabra arrastrada se queda en el DOM aunque se vea fantasma: si se
  // desmonta, el navegador suelta la captura del puntero y el pointerup ya no
  // llega a ningún sitio (la palabra se quedaba colgada en el aire).

  function fijarDestino(v) {
    destinoRef.current = v;
    setDestino(v);
  }
  function fijarCogida(v) {
    cogidaRef.current = v;
    setCogida(v);
  }

  // En qué posición caería la palabra: la más cercana al puntero, y delante o
  // detrás según de qué lado de su centro estés. La caja tiene varias líneas,
  // así que la distancia se mide en dos dimensiones.
  function calcularDestino(x, y, saltar) {
    const nodos = [...(boxRef.current?.querySelectorAll('.wo-word') || [])];
    if (!nodos.length) return 0;
    let mejor = 0;
    let mejorD = Infinity;
    nodos.forEach((n, i) => {
      if (i === saltar) return; // su propio hueco no cuenta
      const r = n.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const d = Math.hypot(x - cx, y - cy);
      if (d < mejorD) {
        mejorD = d;
        mejor = x > cx ? i + 1 : i;
      }
    });
    return mejor;
  }

  function quitar(lista, id) {
    return lista.filter((w) => w.id !== id);
  }

  function onPointerDown(e, w) {
    if (checked) return;
    const r = e.currentTarget.getBoundingClientRect();
    inicio.current = {
      id: w.id,
      text: w.text,
      x: e.clientX,
      y: e.clientY,
      dx: e.clientX - r.left,
      dy: e.clientY - r.top,
      w: r.width,
      h: r.height,
      movido: false
    };
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e) {
    const s = inicio.current;
    if (!s) return;
    // Un pelín de margen para no confundir un toque con un arrastre.
    if (!s.movido) {
      if (Math.hypot(e.clientX - s.x, e.clientY - s.y) < 6) return;
      s.movido = true;
      fijarCogida(null);
      setDrag({ id: s.id, text: s.text, x: e.clientX, y: e.clientY, dx: s.dx, dy: s.dy, w: s.w, h: s.h });
      return; // en el siguiente movimiento la fila ya está sin la palabra
    }
    setDrag((d) => (d ? { ...d, x: e.clientX, y: e.clientY } : d));
    const suIndice = words.findIndex((w) => w.id === s.id);
    fijarDestino(calcularDestino(e.clientX, e.clientY, suIndice));
  }

  function onPointerUp() {
    const s = inicio.current;
    inicio.current = null;
    if (!s) return;

    if (s.movido) {
      const donde = destinoRef.current;
      prepararAnimacion();
      setWords((ws) => {
        const desde = ws.findIndex((w) => w.id === s.id);
        const movida = ws[desde];
        const resto = quitar(ws, s.id);
        // `donde` se midió con la palabra todavía en la fila; al sacarla, todo
        // lo que había detrás se corre un sitio.
        let pos = donde == null ? resto.length : donde > desde ? donde - 1 : donde;
        pos = Math.max(0, Math.min(pos, resto.length));
        return [...resto.slice(0, pos), movida, ...resto.slice(pos)];
      });
      setDrag(null);
      fijarDestino(null);
      return;
    }

    // Fue un toque: levantar, soltar, o colocar delante de esta.
    const levantada = cogidaRef.current;
    if (levantada === null) {
      fijarCogida(s.id);
    } else if (levantada === s.id) {
      fijarCogida(null);
    } else {
      prepararAnimacion();
      setWords((ws) => {
        const desde = ws.findIndex((w) => w.id === levantada);
        const hasta = ws.findIndex((w) => w.id === s.id);
        const resto = quitar(ws, levantada);
        // Hacia delante se coloca DETRAS de la que tocas; hacia atras,
        // delante. Colocando siempre delante no habia forma de mandar una
        // palabra al final de la frase sin arrastrarla.
        const pos = resto.findIndex((w) => w.id === s.id) + (desde < hasta ? 1 : 0);
        const movida = ws.find((w) => w.id === levantada);
        return [...resto.slice(0, pos), movida, ...resto.slice(pos)];
      });
      fijarCogida(null);
    }
  }

  // Sin ratón: con la palabra enfocada, las flechas la mueven de sitio.
  function onKeyDown(e, id) {
    if (checked) return;
    const dir = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
    if (!dir) return;
    const i = words.findIndex((w) => w.id === id);
    const destinoIdx = i + dir;
    if (destinoIdx < 0 || destinoIdx >= words.length) return;
    e.preventDefault();
    prepararAnimacion();
    setWords((ws) => {
      const next = [...ws];
      const [x] = next.splice(i, 1);
      next.splice(destinoIdx, 0, x);
      return next;
    });
    requestAnimationFrame(() => {
      boxRef.current?.querySelectorAll('.wo-word')[destinoIdx]?.focus();
    });
  }

  // Enter permite rendirse. Control (o Tab) enfoca/recorre las palabras, y
  // las flechas izquierda/derecha mueven la palabra enfocada.
  useTeclas({
    Enter: () => rendirse(),
    Control: () => {
      const wordsEls = boxRef.current?.querySelectorAll('.wo-word');
      if (!wordsEls || wordsEls.length === 0) return;
      const active = document.activeElement;
      let nextIdx = 0;
      wordsEls.forEach((el, idx) => {
        if (el === active) nextIdx = (idx + 1) % wordsEls.length;
      });
      wordsEls[nextIdx]?.focus();
    }
  }, !checked && valido);

  function rendirse() {
    if (checked) return;
    setOtraForma(null);
    setCorrect(false);
    setChecked(true);
    onAnswer(false);
  }

  if (!valido) return <div className="error">Invalid item</div>;

  const hueco = drag ? (
    <span className="wo-hueco" style={{ width: drag.w, height: drag.h }} aria-hidden="true" />
  ) : null;

  return (
    <div>
      <div className="prompt-label">{tc(item.prompt || item.anweisung || '')}</div>

      <div
        ref={boxRef}
        className={'wo-box' + (checked ? (correct ? ' done-ok' : ' done-ko') : drag ? ' arrastrando' : '')}
      >
        {words.map((w, i) => {
          let cls = 'wo-word';
          if (checked) cls += correct || enSuSitio[i] ? ' ok' : ' ko';
          else if (drag?.id === w.id) cls += ' fantasma';
          else if (enSuSitio[i]) cls += ' ok';
          else if (cogida === w.id) cls += ' cogida';
          return (
            <React.Fragment key={w.id}>
              {destino === i && hueco}
              <button
                className={cls}
                data-flip-id={w.id}
                disabled={checked}
                onPointerDown={(e) => onPointerDown(e, w)}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                onKeyDown={(e) => onKeyDown(e, w.id)}
              >
                {w.text}
              </button>
            </React.Fragment>
          );
        })}
        {destino != null && destino >= words.length && hueco}
      </div>

      {/* La palabra que llevas en la mano, pegada al puntero */}
      {drag && (
        <div
          className="wo-flotante"
          style={{ left: drag.x - drag.dx, top: drag.y - drag.dy, width: drag.w, height: drag.h }}
        >
          {drag.text}
        </div>
      )}

      {!checked && (
        <>
          <p className="wo-hint muted">
            {cogida !== null ? t('ses.dragHint2') : t('ses.dragHint')}
          </p>
          <button className="btn btn-corregir" onClick={rendirse}>
            {pick('No me sale', 'I give up')}
          </button>
        </>
      )}

      {checked && !correct && (
        <p className="muted" style={{ marginTop: 12 }}>
          {t('ses.correctIs')}: <strong style={{ color: 'var(--text)' }}>{solution.join(' ')}</strong>
        </p>
      )}

      {checked && correct && otraForma && (
        <p className="muted" style={{ marginTop: 12 }}>
          {t('ses.alsoRight')}{' '}
          <strong style={{ color: 'var(--text)' }}>{solution.join(' ')}</strong>
        </p>
      )}
    </div>
  );
}
