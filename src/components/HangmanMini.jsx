import React, { useEffect, useMemo, useRef, useState } from 'react';
import { pick, t } from '../lib/i18n.js';
import { useTeclas } from '../lib/teclas.js';
import PistaRevelable from './PistaRevelable.jsx';

const ALFABETO = 'ABCDEFGHIJKLMNOPQRSTUVWXYZÄÖÜß';
const LETRA_BASE = { Ä: 'A', Ö: 'O', Ü: 'U' };
const letraBase = (letra) => LETRA_BASE[letra] || letra;

export default function HangmanMini({ item, onAnswer }) {
  const [usadas, setUsadas] = useState([]);
  const [rendido, setRendido] = useState(false);
  const [pistas, setPistas] = useState([]);
  const enviado = useRef(false);
  const palabra = String(item.answer || '').toUpperCase();
  const articulo = /^(der|die|das)\b/i.exec(String(item.explanation || ''))?.[1];
  const usadasSet = useMemo(() => new Set(usadas), [usadas]);
  const letraUsada = (letra) => usadas.some((usada) => letraBase(usada) === letraBase(letra));
  const fallos = usadas.filter((letra) => !Array.from(palabra).some((ch) =>
    ALFABETO.includes(ch) && letraBase(ch) === letraBase(letra)
  )).length;
  const ganado = Array.from(palabra).every((letra) =>
    !ALFABETO.includes(letra) || letraUsada(letra)
  );
  const perdido = fallos >= 6 || rendido;

  useEffect(() => {
    if (enviado.current || (!ganado && !perdido)) return;
    enviado.current = true;
    onAnswer(ganado, usadas.join(''));
  }, [ganado, perdido, usadas, onAnswer]);

  function elegir(letra) {
    if (enviado.current || letraUsada(letra)) return;
    setUsadas((actuales) => [...actuales, letra]);
  }

  function rendirse() {
    if (enviado.current) return;
    enviado.current = true;
    setRendido(true);
    onAnswer(false, usadas.join(''));
  }

  function pedirPista(tipo) {
    if (pistas.includes(tipo) || enviado.current) return;
    setPistas((actuales) => [...actuales, tipo]);
    if (tipo === 'letra') {
      const letra = Array.from(palabra).find((ch) => ALFABETO.includes(ch) && !letraUsada(ch));
      if (letra) setUsadas((actuales) => [...actuales, letra]);
    }
  }

  const mapaTeclas = useMemo(() => Object.fromEntries(
    Array.from(ALFABETO).flatMap((letra) => [
      [letra.toLowerCase(), () => elegir(letra)],
      ...(letra.toUpperCase().length === 1 ? [[letra.toUpperCase(), () => elegir(letra)]] : [])
    ])
  ), [usadasSet, enviado]);
  useTeclas({ ...mapaTeclas, Enter: rendirse }, !ganado && !perdido);

  return (
    <div className="hang-mini">
      <div className="prompt-label">{pick('Ahorcado · adivina la palabra', 'Hangman · guess the word')}</div>
      <div className="hang-mini-layout">
        <aside className="hang-mini-visual">
        <svg className="hang-svg" viewBox="0 0 90 110" aria-label={`${fallos} ${pick('fallos', 'mistakes')}`}>
          <g stroke="var(--text-2)" strokeWidth="4" strokeLinecap="round" fill="none">
            <line x1="8" y1="104" x2="58" y2="104" />
            <line x1="24" y1="104" x2="24" y2="8" />
            <line x1="24" y1="8" x2="64" y2="8" />
            <line x1="64" y1="8" x2="64" y2="20" />
          </g>
          <g stroke={perdido ? 'var(--bad)' : 'var(--accent)'} strokeWidth="4" strokeLinecap="round" fill="none">
            {fallos >= 1 && <circle cx="64" cy="31" r="11" />}
            {fallos >= 2 && <line x1="64" y1="42" x2="64" y2="72" />}
            {fallos >= 3 && <line x1="64" y1="50" x2="50" y2="62" />}
            {fallos >= 4 && <line x1="64" y1="50" x2="78" y2="62" />}
            {fallos >= 5 && <line x1="64" y1="72" x2="52" y2="92" />}
            {fallos >= 6 && <line x1="64" y1="72" x2="76" y2="92" />}
          </g>
        </svg>
          <div className="hang-vidas" aria-label={`${6 - fallos} ${pick('intentos restantes', 'tries left')}`}>
            {Array.from({ length: 6 }, (_, i) => <span key={i} className={'hang-vida' + (i < fallos ? ' ida' : '')} />)}
          </div>
        </aside>
        <div className="hang-mini-juego">
      {!ganado && !perdido && (
        <>
          <div className="hang-pistas">
            {['art', 'letra', 'es'].map((tipo, i) => {
              const clave = tipo === 'art' ? 'hg.hintArt' : tipo === 'letra' ? 'hg.hintLetter' : 'hg.hintEs';
              const desactivada = pistas.includes(tipo) || (tipo === 'letra' && Array.from(palabra).every((ch) => !ALFABETO.includes(ch) || letraUsada(ch)));
              const textoPista = tipo === 'art'
                ? (articulo ? t('hg.article', { a: articulo }) : t('hg.startsWith', { l: palabra[0] }))
                : tipo === 'es' && item.translation ? `«${item.translation}»` : null;
              return (
                <PistaRevelable
                  key={`${item.id || item.answer}-${tipo}`}
                  revealed={pistas.includes(tipo)}
                  onReveal={() => pedirPista(tipo)}
                  disabled={desactivada && !pistas.includes(tipo)}
                  title={`Atajo: ${i + 1}`}
                  clueTitle={textoPista || undefined}
                  className="hang-pista-item pista-revelable--hang"
                  label={<>💡 {t(clave)} <span className="op-tecla" style={{ marginLeft: 4 }}>{i + 1}</span></>}
                >
                  {textoPista && <span className="hang-pista-txt">{textoPista}</span>}
                </PistaRevelable>
              );
            })}
          </div>
        </>
      )}
      <div className="hang-palabra">
        {Array.from(palabra).map((letra, i) => {
          const fija = !ALFABETO.includes(letra);
              return <span key={i} className={'hang-hueco' + (fija ? ' fijo' : letraUsada(letra) || perdido ? ' visto' : '')}>
                {fija || letraUsada(letra) || perdido ? letra : ' '}
          </span>;
        })}
      </div>
      {!ganado && !perdido && (
        <>
          <div className="hang-teclado">
            {Array.from(ALFABETO).map((letra) => {
                  const usada = letraUsada(letra);
              const acierto = palabra.includes(letra);
              return <button key={letra} className={'hang-tecla' + (usada ? (acierto ? ' bien' : ' mal') : '')}
                disabled={usada} onClick={() => elegir(letra)}>{letra}</button>;
            })}
          </div>
          <button className="btn btn-corregir" onClick={rendirse}>
            {pick('No me sale', 'I give up')}
          </button>
        </>
      )}
        </div>
      </div>
    </div>
  );
}
