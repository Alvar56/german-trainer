import React, { useEffect, useState } from 'react';
import { Altavoz } from './IconoMenu.jsx';
import { t } from '../lib/i18n.js';
import { hablar, hayVozAlemana, alCargarVoces } from '../lib/audio.js';

// Altavocito para oír cómo se pronuncia una palabra.
//
// Se suscribe a la carga de voces porque el navegador devuelve la lista vacía
// la primera vez: sin esto, al entrar en una lista de vocabulario el botón no
// aparecía hasta que recargabas.
//
// Lo que se lee es solo la palabra alemana, sin el artículo entre paréntesis ni
// la marca de plural del diccionario: "die Birne, -n" se dice "die Birne".
//
// Con `frase` se lee tal cual. Esa limpieza es de entrada de diccionario: en
// una frase de conversación cortaría por la primera coma y se comería media
// intervención.
export default function Escuchar({ texto, className = '', frase = false, rate }) {
  const [hay, setHay] = useState(hayVozAlemana);

  useEffect(() => alCargarVoces(() => setHay(hayVozAlemana())), []);

  if (!hay || !texto) return null;

  const limpio = frase
    ? String(texto).trim()
    : String(texto)
        .split('/')[0]           // "der Ort / die Stadt" -> solo el primero
        .split(',')[0]           // "die Birne, -n"       -> fuera el plural
        .replace(/\([^)]*\)/g, '') // "(sich) freuen"      -> fuera los parentesis
        .trim();

  return (
    <button
      className={'say-btn ' + className}
      title={t('voc.listen')}
      aria-label={t('voc.listen')}
      onClick={(e) => {
        // La fila entera suele ser pulsable; esto no debe arrastrarla.
        e.stopPropagation();
        e.preventDefault();
        hablar(limpio, rate ? { rate } : undefined);
      }}
    >
      <Altavoz />
    </button>
  );
}
