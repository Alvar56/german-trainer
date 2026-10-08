import React from 'react';
import { pick } from '../../lib/i18n.js';

// Las reglas para adivinar el genero de un sustantivo: por la terminacion y
// por el significado, con ejemplos propios, en el estilo de las otras tablas
// (der azul, die rosa, das verde, como en el juego de der / die / das).
// No hay regla sin excepciones: van al pie, las mas tipicas.
// En funciones y no constantes: pick() tiene que leer el idioma al pintar.
const generos = () => [
  {
    art: 'der',
    clase: 'gn-der',
    endungen: [
      ['-er', 'der Lehrer'], ['-ling', 'der Frühling'], ['-ismus', 'der Tourismus'],
      ['-ig', 'der Honig'], ['-ich', 'der Teppich'], ['-or', 'der Motor'],
      ['-ist', 'der Polizist'], ['-ant', 'der Elefant'], ['-eur', 'der Friseur']
    ],
    bedeutung: [
      [pick('Hombres y animales macho', 'Male people and animals'), 'der Mann, der Hahn'],
      [pick('Días, meses y estaciones', 'Days, months and seasons'), 'der Montag, der Mai, der Winter'],
      [pick('Tiempo y puntos cardinales', 'Weather and compass points'), 'der Regen, der Norden'],
      [pick('Bebidas con alcohol', 'Alcoholic drinks'), 'der Wein, der Sekt'],
      [pick('Marcas de coche', 'Car brands'), 'der BMW, der VW'],
      [pick('Sustantivos de un verbo, sin terminación', 'Nouns from a verb, no ending'), 'der Lauf, der Sprung']
    ]
  },
  {
    art: 'die',
    clase: 'gn-die',
    endungen: [
      ['-ung', 'die Zeitung'], ['-heit', 'die Freiheit'], ['-keit', 'die Möglichkeit'],
      ['-schaft', 'die Freundschaft'], ['-ion', 'die Information'], ['-tät', 'die Universität'],
      ['-ik', 'die Musik'], ['-ie', 'die Familie'], ['-ur', 'die Natur'],
      ['-enz', 'die Konferenz'], ['-anz', 'die Distanz'], ['-in', 'die Lehrerin'],
      ['-e', 'die Lampe']
    ],
    bedeutung: [
      [pick('Mujeres y animales hembra', 'Female people and animals'), 'die Frau, die Kuh'],
      [pick('Números', 'Numbers'), 'die Eins, die Zehn'],
      [pick('Muchos árboles y flores', 'Most trees and flowers'), 'die Eiche, die Rose'],
      [pick('Motos y barcos', 'Motorbikes and ships'), 'die Harley, die Titanic'],
      [pick('Todos los plurales', 'Every plural'), 'die Kinder, die Tische']
    ]
  },
  {
    art: 'das',
    clase: 'gn-das',
    endungen: [
      ['-chen', 'das Mädchen'], ['-lein', 'das Fräulein'], ['-ment', 'das Instrument'],
      ['-um', 'das Museum'], ['-ma', 'das Thema'], ['-tum', 'das Eigentum'],
      ['-o', 'das Auto'], ['Ge-', 'das Gemüse']
    ],
    bedeutung: [
      [pick('Verbos usados como nombre', 'Verbs used as nouns'), 'das Essen, das Lernen'],
      [pick('Colores e idiomas como nombre', 'Colours and languages as nouns'), 'das Rot, das Deutsch'],
      [pick('Crías de animales y niños', 'Young animals and children'), 'das Kind, das Kalb'],
      [pick('Metales', 'Metals'), 'das Gold, das Eisen'],
      [pick('Hotel, cine, café…', 'Hotel, cinema, café…'), 'das Hotel, das Kino, das Café'],
      [pick('Letras y fracciones', 'Letters and fractions'), 'das A, das Viertel']
    ]
  }
];

const excepciones = () => [
  ['-e', 'der Junge, der Name, das Auge, das Ende'],
  ['-er', 'die Mutter, die Butter, das Fenster, das Zimmer'],
  ['-o', 'der Euro, die Disco'],
  [pick('Bebidas', 'Drinks'), 'das Bier'],
  ['-tum', 'der Irrtum, der Reichtum']
];

export default function GenusTabla() {
  return (
    <>
      <div className="gn-columnas">
        {generos().map((g) => (
          <div key={g.art} className={'gn-columna ' + g.clase}>
            <div className="gn-art">{g.art}</div>
            <div className="gn-apartado">{pick('Terminaciones', 'Endings')}</div>
            <div className="gn-endungen">
              {g.endungen.map(([e, ej]) => (
                <span key={e} className="gn-endung" title={ej}>
                  <b>{e}</b> <span>{ej.split(' ').slice(1).join(' ')}</span>
                </span>
              ))}
            </div>
            <div className="gn-apartado">{pick('Por el significado', 'By meaning')}</div>
            <ul className="gn-bedeutung">
              {g.bedeutung.map(([que, ej]) => (
                <li key={que}><span>{que}</span><em>{ej}</em></li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="gn-pistas">
        <div className="gn-pista">
          <b>{pick('Palabras compuestas', 'Compound nouns')}</b>
          <span>{pick('Manda la última palabra:', 'The last word decides:')} das Haus + <strong>die</strong> Tür = <strong>die</strong> Haustür</span>
        </div>
        <div className="gn-pista">
          <b>{pick('Excepciones típicas', 'Typical exceptions')}</b>
          <span>{excepciones().map(([r, ej]) => `${r}: ${ej}`).join(' · ')}</span>
        </div>
        <div className="gn-pista">
          <b>{pick('Consejo', 'Tip')}</b>
          <span>{pick('Aprende cada palabra con su artículo: «die Lampe», nunca solo «Lampe».', 'Learn every word with its article: «die Lampe», never just «Lampe».')}</span>
        </div>
      </div>
    </>
  );
}
