import React from 'react';
import { pick } from '../../lib/i18n.js';
import { Marca, Tarjeta, Apartado, Pistas } from './comun.jsx';

// Los articulos por caso y genero, en tarjetas como la tabla de der / die /
// das: una por genero (der azul, das verde, die rosa, plural ambar) y en cada
// una los tres casos con bestimmt, unbestimmt, negativ y possessiv. Lo que
// cambia con el caso va resaltado. Sale en el Kasus Trainer y en el Tagebuch.
const TIPOS = () => [pick('determinado', 'definite'), pick('indeterm.', 'indefinite'), pick('negativo', 'negative'), pick('posesivo', 'possessive')];

const GENEROS = [
  {
    color: 'tc-m', genero: 'Maskulin', art: 'der', marcas: '-r · -n · -m',
    casos: { Nominativ: ['de[r]', 'ein', 'kein', 'mein'], Akkusativ: ['de[n]', 'ein[en]', 'kein[en]', 'mein[en]'], Dativ: ['de[m]', 'ein[em]', 'kein[em]', 'mein[em]'] },
    cambia: true
  },
  {
    color: 'tc-n', genero: 'Neutral', art: 'das', marcas: '-s · -s · -m',
    casos: { Nominativ: ['da[s]', 'ein', 'kein', 'mein'], Akkusativ: ['da[s]', 'ein', 'kein', 'mein'], Dativ: ['de[m]', 'ein[em]', 'kein[em]', 'mein[em]'] }
  },
  {
    color: 'tc-f', genero: 'Feminin', art: 'die', marcas: '-e · -e · -r',
    casos: { Nominativ: ['di[e]', 'ein[e]', 'kein[e]', 'mein[e]'], Akkusativ: ['di[e]', 'ein[e]', 'kein[e]', 'mein[e]'], Dativ: ['de[r]', 'ein[er]', 'kein[er]', 'mein[er]'] }
  },
  {
    color: 'tc-pl', genero: 'Plural', art: 'die', marcas: '-e · -e · -n',
    casos: { Nominativ: ['di[e]', '—', 'kein[e]', 'mein[e]'], Akkusativ: ['di[e]', '—', 'kein[e]', 'mein[e]'], Dativ: ['de[n]', '—', 'kein[en]', 'mein[en]'] },
    dativN: true
  }
];

const PREGUNTA = { Nominativ: 'Wer? / Was?', Akkusativ: 'Wen? / Was?', Dativ: 'Wem?' };

export default function ArtikelTabla() {
  const tipos = TIPOS();
  return (
    <>
      <div className="tc-columnas tc-4">
        {GENEROS.map((g) => (
          <Tarjeta key={g.genero} color={g.color} titulo={g.art} sub={`${g.genero} · ${g.marcas}`}>
            {Object.entries(g.casos).map(([caso, formas]) => {
              const igual = caso === 'Akkusativ' && !g.cambia;
              return (
                <div key={caso} className={'tc-caso' + (igual ? ' tc-igual' : '')}>
                  <Apartado>
                    {caso} <span className="tc-preg">{PREGUNTA[caso]}</span>
                    {igual && <span className="tc-etiqueta">= Nominativ</span>}
                    {caso === 'Akkusativ' && g.cambia && <span className="tc-etiqueta tc-ojo">{pick('¡solo cambia el masculino!', 'only masculine changes!')}</span>}
                  </Apartado>
                  <div className="tc-formas">
                    {formas.map((f, i) => (
                      <span key={i} className="tc-forma">
                        <b>{f === '—' ? '—' : <Marca texto={f} />}</b>
                        <small>{tipos[i]}</small>
                      </span>
                    ))}
                  </div>
                  {caso === 'Dativ' && g.dativN && <div className="tc-nota">+ Nomen -n: mit den Kinder<b>n</b></div>}
                </div>
              );
            })}
          </Tarjeta>
        ))}
      </div>

      <Pistas items={[
        [pick('Akkusativ', 'Accusative'), pick('Solo cambia el masculino: der → den, ein → einen. Neutro, femenino y plural se quedan como en el Nominativ.', 'Only the masculine changes: der → den, ein → einen. Neuter, feminine and plural stay as in the nominative.')],
        [pick('Dativ plural', 'Dative plural'), pick('El artículo es «den» y el sustantivo suma -n: mit den Freunde', 'The article is «den» and the noun adds -n: mit den Freunde') + 'n, ' + pick('salvo si ya acaba en -n o -s (den Autos).', 'unless it already ends in -n or -s (den Autos).')],
        [pick('Posesivos', 'Possessives'), pick('mein, dein, sein, ihr, unser, euer… llevan las mismas terminaciones que kein.', 'mein, dein, sein, ihr, unser, euer… take the same endings as kein.')]
      ]} />
    </>
  );
}
