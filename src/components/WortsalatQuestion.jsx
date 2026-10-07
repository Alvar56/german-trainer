import React, { useEffect, useMemo, useRef, useState } from 'react';
import { pick } from '../lib/i18n.js';

function mezclar(letras) {
  const x = [...letras];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

function iniciales(tokensKey, respuesta) {
  const tokens = tokensKey ? tokensKey.split('\u0000') : [];
  const disponibles = tokens.length === Array.from(respuesta).length
    ? tokens.map((ch, id) => ({ id, ch }))
    : mezclar(Array.from(respuesta).map((ch, id) => ({ id, ch })));
  let out = disponibles;
  let intentos = 0;
  while (out.map((x) => x.ch).join('') === respuesta && intentos < 12) {
    out = mezclar(disponibles);
    intentos++;
  }
  if (out.length > 1 && out.map((x) => x.ch).join('') === respuesta) {
    const letraDistinta = out.findIndex((letra, i) => i > 0 && letra.ch !== out[0].ch);
    if (letraDistinta > 0) {
      out = [...out];
      [out[0], out[letraDistinta]] = [out[letraDistinta], out[0]];
    }
  }
  return out;
}

export default function WortsalatQuestion({ item, disabled = false, correct = false, chosen = null, onAnswer }) {
  const respuesta = String(item?.sentence || item?.answer || '').trim();
  const palabraCompleta = String(item?.vocabCardDe || respuesta).trim();
  const articulo = palabraCompleta.match(/^(der|die|das)\s+/i)?.[1] || '';
  const tokensKey = Array.isArray(item?.tokens) ? item.tokens.join('\u0000') : '';
  const inicialesLetras = useMemo(() => iniciales(tokensKey, respuesta), [respuesta, tokensKey]);
  const [letras, setLetras] = useState(inicialesLetras);
  const [seleccionada, setSeleccionada] = useState(null);
  const [dragging, setDragging] = useState(null);
  const [destino, setDestino] = useState(null);
  const boxRef = useRef(null);
  const dragRef = useRef(null);
  const destinoRef = useRef(null);
  const ignoreNextClick = useRef(false);
  const respondida = useRef(false);

  useEffect(() => {
    setLetras(inicialesLetras);
    setSeleccionada(null);
    dragRef.current = null;
    destinoRef.current = null;
    setDragging(null);
    setDestino(null);
    respondida.current = false;
  }, [inicialesLetras]);

  const intento = letras.map((letra) => letra.ch).join('');
  const normalizar = (texto) => String(texto || '').normalize('NFC').toLocaleLowerCase('de');

  useEffect(() => {
    if (!intento || disabled || respondida.current || normalizar(intento) !== normalizar(respuesta)) return;
    respondida.current = true;
    onAnswer?.(true, intento);
  }, [disabled, intento, onAnswer, respuesta]);

  useEffect(() => {
    function mover(e) {
      const d = dragRef.current;
      if (!d || d.pointerId !== e.pointerId) return;
      if (!d.movido && Math.hypot(e.clientX - d.x, e.clientY - d.y) >= 6) {
        d.movido = true;
        setDragging({ id: d.id, ch: d.ch, x: e.clientX, y: e.clientY, dx: d.dx, dy: d.dy, w: d.w, h: d.h });
        return;
      }
      if (!d.movido) return;
      setDragging((prev) => prev ? { ...prev, x: e.clientX, y: e.clientY } : prev);
      const nodos = [...(boxRef.current?.querySelectorAll('.ws-letter') || [])];
      let mejor = 0;
      let distanciaMenor = Infinity;
      nodos.forEach((nodo, i) => {
        if (i === d.from) return;
        const r = nodo.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const distancia = Math.hypot(e.clientX - cx, e.clientY - cy);
        if (distancia < distanciaMenor) {
          distanciaMenor = distancia;
          mejor = e.clientX > cx ? i + 1 : i;
        }
      });
      destinoRef.current = mejor;
      setDestino(mejor);
    }

    function soltar(e) {
      const d = dragRef.current;
      if (!d || d.pointerId !== e.pointerId) return;
      dragRef.current = null;
      setDragging(null);
      setDestino(null);
      if (!d.movido) return;
      ignoreNextClick.current = true;
      setTimeout(() => { ignoreNextClick.current = false; }, 0);
      const where = destinoRef.current;
      destinoRef.current = null;
      setSeleccionada(null);
      setLetras((actuales) => {
        const desde = actuales.findIndex((letra) => letra.id === d.id);
        if (desde < 0) return actuales;
        const movida = actuales[desde];
        const resto = actuales.filter((letra) => letra.id !== d.id);
        let posicion = where == null ? resto.length : where > desde ? where - 1 : where;
        posicion = Math.max(0, Math.min(posicion, resto.length));
        return [...resto.slice(0, posicion), movida, ...resto.slice(posicion)];
      });
    }

    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', soltar);
    return () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', soltar);
    };
  }, [disabled]);

  function comenzarArrastre(e, letra, i) {
    if (disabled || e.button > 0) return;
    const rect = e.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id: letra.id,
      ch: letra.ch,
      from: i,
      pointerId: e.pointerId,
      x: e.clientX,
      y: e.clientY,
      dx: e.clientX - rect.left,
      dy: e.clientY - rect.top,
      w: rect.width,
      h: rect.height,
      movido: false
    };
  }

  const letrasRespuesta = Array.from(respuesta);
  let colocadas = 0;
  while (colocadas < letras.length && normalizar(letras[colocadas]?.ch) === normalizar(letrasRespuesta[colocadas])) {
    colocadas++;
  }
  const visibles = disabled && chosen
    ? Array.from(String(chosen)).map((ch, id) => ({ id: `respuesta-${id}`, ch }))
    : letras;

  function seleccionar(i) {
    if (disabled || ignoreNextClick.current) return;
    if (seleccionada === null) {
      setSeleccionada(i);
      return;
    }
    if (seleccionada === i) {
      setSeleccionada(null);
      return;
    }
    setLetras((actuales) => {
      const siguiente = [...actuales];
      [siguiente[seleccionada], siguiente[i]] = [siguiente[i], siguiente[seleccionada]];
      return siguiente;
    });
    setSeleccionada(null);
  }

  function rendirse() {
    if (disabled || respondida.current) return;
    respondida.current = true;
    onAnswer?.(false, intento);
  }

  return (
    <div
      className="fc-wrap ws-exercise-layout"
      onKeyDownCapture={(event) => {
        // En este ejercicio Enter equivale al botón «No me sale»; no hay un
        // campo de texto donde Enter pueda tener otro significado.
        if (event.key === 'Enter' && !disabled) {
          event.preventDefault();
          event.stopPropagation();
          rendirse();
        }
      }}
    >
      <div className="prompt-label">{pick('Ordena las letras', 'Put the letters in order')}</div>
      <div className="ws-clue">
        {item?.translation && <span className="ws-es">{item.translation}</span>}
        {articulo && <span className="ws-art">{articulo} …</span>}
        <span className="ws-len">{letrasRespuesta.length} {pick('letras', 'letters')}</span>
      </div>
      <div ref={boxRef} className={'ws-box' + (disabled ? (correct ? ' done' : ' fail') : '') + (dragging ? ' arrastrando' : '')}>
        {visibles.map((letra, i) => {
          const arrastrada = dragging?.id === letra.id;
          return (
            <React.Fragment key={`${letra.id}-${i}`}>
              {destino === i && dragging && <span className="ws-hueco" style={{ width: dragging.w, height: dragging.h }} aria-hidden="true" />}
              <button
                type="button"
                className={'ws-letter' + (disabled
                  ? (correct ? ' ok' : ' fail')
                  : i < colocadas ? ' ok' : '') + (seleccionada === i && !disabled ? ' sel' : '') + (arrastrada ? ' fantasma' : '')}
                onClick={() => seleccionar(i)}
                onPointerDown={(e) => comenzarArrastre(e, letra, i)}
                disabled={disabled}
                style={{ position: 'relative' }}
              >
                {letra.ch}
              </button>
            </React.Fragment>
          );
        })}
        {destino != null && destino >= visibles.length && dragging && (
          <span className="ws-hueco" style={{ width: dragging.w, height: dragging.h }} aria-hidden="true" />
        )}
      </div>
      {dragging && (
        <div className="ws-flotante" style={{ left: dragging.x - dragging.dx, top: dragging.y - dragging.dy, width: dragging.w, height: dragging.h }}>
          {dragging.ch}
        </div>
      )}
      {disabled ? null : (
        <>
          <p className="wo-hint muted">
            {seleccionada === null
              ? pick('Arrastra las letras para ordenarlas o toca dos para intercambiarlas. Las verdes ya están en su sitio.', 'Drag the letters into order, or tap two to swap them. Green ones are already in place.')
              : pick('Ahora toca la letra con la que quieres intercambiarla.', 'Now tap the letter you want to swap it with.')}
          </p>
          <button
            type="button"
            className="btn btn-corregir"
            onClick={rendirse}
          >
            {pick('No me sale', 'Give up')}
          </button>
        </>
      )}
    </div>
  );
}
