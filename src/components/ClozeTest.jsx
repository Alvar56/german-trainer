import React, { useEffect, useRef, useState } from 'react';
import { t } from '../lib/i18n.js';
import { tc } from '../lib/contenido/index.js';
import { useTeclas } from '../lib/teclas.js';
import { capitalizarInicioFrase } from '../lib/frases.js';

function normaliza(s) {
  return String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function isGapCorrect(userVal, expected) {
  const userNorm = normaliza(userVal);
  const alts = String(expected || '').split(/\s*[\/|]\s*|\s+oder\s+/i);
  return alts.some((alt) => userNorm === normaliza(alt));
}

export default function ClozeTest({ item, onAnswer }) {
  const { clozeText = '', clozeAnswers = [], clozeChoices = [] } = item;
  const numGaps = clozeAnswers.length;
  const tieneOpciones = clozeChoices.length > 0;
  const [answers, setAnswers] = useState(Array(numGaps).fill(''));
  const [hecho, setHecho] = useState(false);
  const inputsRef = useRef([]);
  const dragRef = useRef(null);
  const ignoreOptionClick = useRef(false);
  const dragContext = useRef(null);
  const [arrastrando, setArrastrando] = useState(null);
  const [destinoArrastre, setDestinoArrastre] = useState(null);
  dragContext.current = { clozeChoices, answers, hecho };

  useEffect(() => {
    setAnswers(Array(numGaps).fill(''));
    setHecho(false);
    dragRef.current = null;
    setArrastrando(null);
    setDestinoArrastre(null);
    if (!tieneOpciones && inputsRef.current[0]) inputsRef.current[0].focus();
  }, [item.id, numGaps, tieneOpciones]);

  useEffect(() => {
    function mover(event) {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      if (!drag.iniciado && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 6) return;
      drag.iniciado = true;
      const gap = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-cloze-gap]');
      drag.destino = gap ? Number(gap.dataset.clozeGap) : null;
      setArrastrando({ choiceIndex: drag.choiceIndex, x: event.clientX, y: event.clientY });
      setDestinoArrastre(drag.destino);
    }

    function soltar(event) {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      dragRef.current = null;
      setArrastrando(null);
      setDestinoArrastre(null);
      if (!drag.iniciado) return;

      ignoreOptionClick.current = true;
      window.setTimeout(() => { ignoreOptionClick.current = false; }, 0);
      const gap = document.elementFromPoint(event.clientX, event.clientY)?.closest('[data-cloze-gap]');
      const destino = gap ? Number(gap.dataset.clozeGap) : drag.destino;
      const actual = dragContext.current;
      const choice = actual.clozeChoices[drag.choiceIndex];
      if (actual.hecho || !choice || !Number.isInteger(destino) || destino < 0 || destino >= actual.answers.length) return;

      const aparicionesHastaAqui = actual.clozeChoices
        .slice(0, drag.choiceIndex + 1)
        .filter((opcion) => opcion === choice).length;
      const yaUsadas = actual.answers.filter((respuesta) => respuesta === choice).length;
      if (yaUsadas >= aparicionesHastaAqui) return;

      setAnswers((prev) => {
        if (dragContext.current.hecho) return prev;
        const next = [...prev];
        next[destino] = choice;
        return next;
      });
    }

    function cancelar(event) {
      const drag = dragRef.current;
      if (!drag || drag.pointerId !== event.pointerId) return;
      dragRef.current = null;
      setArrastrando(null);
      setDestinoArrastre(null);
    }

    window.addEventListener('pointermove', mover);
    window.addEventListener('pointerup', soltar);
    window.addEventListener('pointercancel', cancelar);
    return () => {
      window.removeEventListener('pointermove', mover);
      window.removeEventListener('pointerup', soltar);
      window.removeEventListener('pointercancel', cancelar);
    };
  }, []);

  function handleChange(i, val) {
    if (hecho) return;
    const nue = [...answers];
    nue[i] = val;
    setAnswers(nue);
  }

  function retirarOpcion(i) {
    if (hecho || !tieneOpciones || !answers[i]) return;
    const nue = [...answers];
    nue[i] = '';
    setAnswers(nue);
  }

  function elegirOpcion(indice) {
    if (hecho) return;
    const choice = clozeChoices[indice];
    if (choice == null) return;
    // Las opciones repetidas cuentan como fichas distintas: el atajo de la
    // segunda aparición sigue disponible si la primera ya está colocada.
    const aparicionesHastaAqui = clozeChoices.slice(0, indice + 1).filter((c) => c === choice).length;
    const yaUsadas = answers.filter((a) => a === choice).length;
    if (yaUsadas >= aparicionesHastaAqui) return;
    const firstEmpty = answers.findIndex((a) => !a.trim());
    if (firstEmpty !== -1) handleChange(firstEmpty, choice);
  }

  const mapaTeclas = tieneOpciones && !hecho
    ? {
        ...Object.fromEntries(clozeChoices.slice(0, 7).map((_, i) => [String(i + 1), () => elegirOpcion(i)])),
        Enter: comprobar
      }
    : {};
  useTeclas(mapaTeclas, tieneOpciones && !hecho);

  function handleKeyDown(e, i) {
    if (e.key === 'Enter') {
      if (i < numGaps - 1) {
        inputsRef.current[i + 1]?.focus();
      } else {
        comprobar();
      }
    }
  }

  function comprobar() {
    if (hecho || answers.some((a) => !a.trim())) return;
    setHecho(true);

    // Evaluamos si todos los huecos están bien
    const correct = answers.every((a, i) => isGapCorrect(a, clozeAnswers[i]));
    onAnswer(correct, answers.join(', '));
  }

  // Partir el texto por "___"
  const parts = capitalizarInicioFrase(tc(clozeText)).split('___');

  // El hueco al que va a caer la palabra que pulses. Se marca para que se vea
  // dónde aterriza: antes el único hueco distinto era el que tenía el foco, y
  // como el foco se pinta igual que un hueco lleno, parecía ya contestado.
  const destino = answers.findIndex((a) => !a.trim());

  // TODOS los huecos miden lo mismo, y lo que miden sale de la palabra más
  // larga que haya en juego. Antes cada hueco se dimensionaba con SU respuesta
  // (`length * 14px`), así que el ancho te chivaba de cuántas letras era la
  // palabra y además dejaba la frase con cajas de tamaños distintos.
  const largo = Math.max(
    6,
    ...clozeChoices.map((c) => String(tc(c)).length),
    ...clozeAnswers.map((a) => String(tc(a)).length)
  );

  return (
    <div>
      <div className="prompt-label">{tc(item.anweisung) || t('ses.writeGap')}</div>

      <div className="sentence cloze-frase" style={{ '--cloze-ancho': largo + 1.5 + 'ch' }}>
        {parts.map((p, i) => (
          <React.Fragment key={i}>
            <span>{p}</span>
            {i < numGaps && (
              <input
                ref={(el) => (inputsRef.current[i] = el)}
                data-cloze-gap={i}
                type="text"
                className={
                  'cloze-hueco' +
                  (answers[i] ? ' puesto' : '') +
                  (!hecho && i === destino ? ' destino' : '') +
                  (!hecho && destinoArrastre === i ? ' arrastre-destino' : '') +
                  (hecho ? (isGapCorrect(answers[i], clozeAnswers[i]) ? ' bien' : ' mal') : '')
                }
                value={clozeChoices.includes(answers[i]) ? tc(answers[i]) : answers[i]}
                readOnly={tieneOpciones}
                inputMode={tieneOpciones ? 'none' : undefined}
                onFocus={tieneOpciones ? (e) => e.currentTarget.blur() : undefined}
                onChange={(e) => handleChange(i, e.target.value)}
                onPointerDown={tieneOpciones && answers[i] ? (e) => {
                  e.preventDefault();
                  retirarOpcion(i);
                } : undefined}
                onClick={tieneOpciones && answers[i] ? () => retirarOpcion(i) : undefined}
                onKeyDown={(e) => handleKeyDown(e, i)}
                disabled={hecho}
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="off"
                spellCheck="false"
              />
            )}
          </React.Fragment>
        ))}
      </div>

      {arrastrando && (
        <div
          className="cloze-arrastre-ficha"
          style={{ left: arrastrando.x, top: arrastrando.y }}
          aria-hidden="true"
        >
          {tc(clozeChoices[arrastrando.choiceIndex])}
        </div>
      )}

      {clozeChoices && clozeChoices.length > 0 && (
        <div className="cloze-banco">
          {clozeChoices.map((choice, i) => {
            // Cuántas veces aparece esta palabra en las opciones hasta este índice
            const timesInChoices = clozeChoices.slice(0, i + 1).filter((c) => c === choice).length;
            // Cuántas veces está ya puesta en las respuestas
            const timesUsed = answers.filter((a) => a === choice).length;
            const isUsed = timesUsed >= timesInChoices;
            return (
              <button
                key={i}
                className={'cloze-pieza' + (arrastrando?.choiceIndex === i ? ' arrastrando' : '')}
                disabled={hecho || isUsed}
                onPointerDown={(event) => {
                  if (hecho || isUsed) return;
                  dragRef.current = {
                    pointerId: event.pointerId,
                    choiceIndex: i,
                    x: event.clientX,
                    y: event.clientY,
                    iniciado: false,
                    destino: null
                  };
                }}
                onClick={() => {
                  if (ignoreOptionClick.current) {
                    ignoreOptionClick.current = false;
                    return;
                  }
                  if (isUsed) return;
                  elegirOpcion(i);
                }}
              >
                {tc(choice)}
              </button>
            );
          })}
        </div>
      )}

      {!hecho && (
        <div className="cloze-pie">
          <button className="btn-primary btn-corregir" onClick={comprobar} disabled={answers.some((a) => !a.trim())}>
            {t('ses.check')}
          </button>
        </div>
      )}
    </div>
  );
}
