import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { t, pick } from '../lib/i18n.js';
import { tc } from '../lib/contenido/index.js';
import { esqueleto, pistasDisponibles } from '../lib/pista.js';
import Umlaut from './Umlaut.jsx';
import PistaLetras from './PistaLetras.jsx';
import PistaRevelable from './PistaRevelable.jsx';
import { capitalizarInicioFrase } from '../lib/frases.js';

// Lückentext: el mismo ejercicio de test pero SIN las tres opciones — hay que
// escribir la palabra. Es bastante más difícil (no puedes descartar) y es lo
// que de verdad se parece a hablar, así que va aparte y no mezclado.
//
// Al comparar se ignoran mayúsculas y espacios de sobra, pero NO las Umlaut ni
// la ß: escribir "grosse" por "große" es justo el fallo que hay que corregir.
function normaliza(s) {
  return String(s || '').trim().replace(/\s+/g, ' ').toLowerCase();
}

function checkMatches(inputVal, answer) {
  const userNorm = normaliza(inputVal);
  const alts = String(answer || '').split(/\s*[\/|]\s*|\s+oder\s+/i);
  return alts.some((alt) => userNorm === normaliza(alt.replace(/\s*\.\.\.\s*/g, ' ')));
}

export default function WriteCard({ item, onAnswer }) {
  const [texto, setTexto] = useState('');
  const [hecho, setHecho] = useState(false);
  // Letras destapadas a mano. La inicial la enseña siempre el esqueleto.
  const [pistas, setPistas] = useState(0);
  const [pistaTraduccion, setPistaTraduccion] = useState(false);
  const input = useRef(null);
  const ejercicio = useRef(null);
  const posicionesAntesDePista = useRef(null);

  function recordarPosiciones() {
    const root = ejercicio.current;
    if (!root || window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return;
    const nodos = root.querySelectorAll(
      '.sentence, .pista-letras > *, .write-pistas-flujo > *, .write-translation-hint, .write-fila > *'
    );
    posicionesAntesDePista.current = Array.from(nodos, (element) => {
      const rect = element.getBoundingClientRect();
      // Si se pide otra pista mientras se mueve el contenido, partir de la
      // posición visible en vez de reiniciar el desplazamiento.
      element.getAnimations?.().forEach((animation) => animation.cancel());
      return { element, left: rect.left, top: rect.top };
    });
  }

  useLayoutEffect(() => {
    const anteriores = posicionesAntesDePista.current;
    posicionesAntesDePista.current = null;
    if (!anteriores) return;
    anteriores.forEach(({ element, left, top }) => {
      if (!element.isConnected || typeof element.animate !== 'function') return;
      const rect = element.getBoundingClientRect();
      const x = left - rect.left;
      const y = top - rect.top;
      if (Math.abs(x) < 1 && Math.abs(y) < 1) return;
      element.animate(
        [
          { transform: `translate3d(${x}px, ${y}px, 0)` },
          { transform: 'translate3d(0, 0, 0)' }
        ],
        { duration: 380, easing: 'cubic-bezier(.2,.7,.25,1)' }
      );
    });
  }, [pistas, pistaTraduccion]);

  function pedirLetra() {
    recordarPosiciones();
    setPistas((n) => n + 1);
  }

  function pedirPistaTraduccion() {
    recordarPosiciones();
    setPistaTraduccion(true);
  }

  useEffect(() => {
    setTexto('');
    setHecho(false);
    setPistas(0);
    setPistaTraduccion(false);
    input.current?.focus();
  }, [item.id]);

  function comprobar() {
    if (hecho || !texto.trim()) return;
    setHecho(true);
    const isCorrect = checkMatches(texto, item.answer);
    // Las pistas van tambien: destapar letras abarata el ejercicio, igual
    // que en el juego de traducir.
    onAnswer(isCorrect, texto.trim(), pistas + (pistaTraduccion ? 1 : 0));
  }

  function rendirse() {
    if (hecho) return;
    setTexto('');
    setHecho(true);
    onAnswer(false, '', pistas + (pistaTraduccion ? 1 : 0));
  }

  const parts = capitalizarInicioFrase(tc(item.sentence)).split('___');
  const answerParts = String(tc(item.answer || '')).split(/\s*\.\.\.\s*/);
  const respuesta = String(item.answer || '').replace(/\s*\.\.\.\s*/g, ' ');
  const quedan = pistasDisponibles(respuesta) - pistas;
  const bien = hecho && checkMatches(texto, item.answer);

  return (
    <div className="write-exercise" ref={ejercicio}>
      <div className="prompt-label">{tc(item.anweisung) || t('ses.writeGap')}</div>
      <div className="sentence">
        {parts.map((p, i) => (
          <React.Fragment key={i}>
            {p}
            {i < parts.length - 1 && (
              <span className={'blank' + (hecho ? ' filled' : '')}>
                {hecho ? (answerParts[i] || ' ') : ' '}
              </span>
            )}
          </React.Fragment>
        ))}
      </div>

      {item.hintTranslation ? (
        <>
          {/* En el hueco de Comunicación, el esqueleto y «No me sale»
              comparten fila para dejar más arriba el campo. */}
          {!hecho && (
            <div className="write-pistas-flujo">
              <code key={pistas} className="pl-esqueleto pl-esqueleto-revelado">{esqueleto(respuesta, pistas)}</code>
              <button type="button" className="btn-ghost btn-sm pl-btn" onClick={rendirse}>
                {pick('No me sale', 'I give up')}
              </button>
            </div>
          )}
          {pistaTraduccion && (
            <div key={item.id} className="write-translation-hint pista-texto-entrada">{tc(item.hintTranslation)}</div>
          )}
        </>
      ) : (
        <PistaLetras
          key={item.id}
          respuesta={respuesta}
          pistas={pistas}
          onPedir={pedirLetra}
          resetKey={item.id}
          oculto={hecho}
          textoBoton={pick('Colocar una letra', 'Place a letter')}
          mostrarAtajo={false}
          onRendir={rendirse}
          textoRendir={pick('No me sale', 'I give up')}
          className="write-pistas"
        />
      )}

      <div className={'write-fila' + (item.hintTranslation ? ' write-fila-flujo' : '')}>
        <input
          ref={input}
          className={'ask-input write-input' + (hecho ? (bien ? ' bien' : ' mal') : '')}
          type="text"
          lang="de"
          spellCheck={false}
          value={texto}
          disabled={hecho}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              e.stopPropagation();
              if (texto.trim()) comprobar();
              else rendirse();
            } else if (
              ((e.ctrlKey || e.altKey) && (e.key === 'p' || e.key === 'P' || e.key === 'h' || e.key === 'H')) ||
              e.key === 'F2'
            ) {
              e.preventDefault();
              if (pistas < pistasDisponibles(respuesta)) pedirLetra();
            }
          }}
          placeholder={t('ses.writePh')}
          autoComplete="off"
          autoCapitalize="off"
        />
        {!hecho && <Umlaut campo={input} onTexto={setTexto} />}
        {!hecho && item.hintTranslation && (
          <div className="write-pistas-acciones">
            {pistasDisponibles(respuesta) > 0 && (
              <PistaRevelable
                key={`${item.id}-letras`}
                revealed={quedan <= 0}
                onReveal={pedirLetra}
                className="pl-pista-slot"
                buttonClassName="btn-ghost btn-sm pl-btn"
                label={<>💡 {pick('Colocar una letra', 'Place a letter')}</>}
              />
            )}
            {item.hintTranslation && (
              <PistaRevelable
                key={`${item.id}-traduccion`}
                revealed={pistaTraduccion}
                onReveal={pedirPistaTraduccion}
                className="pl-pista-slot"
                buttonClassName="btn-ghost btn-sm pl-btn"
                label={<>💡 {t('ueb.pistaTraduccion')}</>}
              />
            )}
          </div>
        )}
        {!hecho && (
          <button className="btn-primary btn-corregir" onClick={comprobar} disabled={!texto.trim()}>
            {t('ses.check')}
          </button>
        )}
      </div>

      {/* Las Umlaut a mano son un incordio en un teclado español. Las mismas
          teclas que en el diario y en los apuntes, y de paso aquí también
          entran donde tengas el cursor y no al final. */}
    </div>
  );
}
