import React from 'react';
import { pick } from '../../lib/i18n.js';
import { Marca, Tarjeta, Apartado, Pistas } from './comun.jsx';

// La declinacion del adjetivo en tarjetas, como la tabla de der / die / das:
// una por genero con un ejemplo propio (der neue Tisch, das kleine Bett, die
// alte Lampe, die bequemen Stühle). La marca del caso va con el color de la
// tarjeta ([r]) y la terminacion debil -e / -en en gris ({en}): alguien tiene
// que llevar la marca, el articulo o, si no puede, el adjetivo.
const GENEROS = [
  {
    color: 'tc-m', genero: 'Maskulin', art: 'der', ejemplo: 'der Tisch',
    casos: [
      ['Nominativ', 'de[r] neu{e} Tisch', 'ein neu[er] Tisch'],
      ['Akkusativ', 'de[n] neu{en} Tisch', 'ein[en] neu{en} Tisch'],
      ['Dativ', 'de[m] neu{en} Tisch', 'ein[em] neu{en} Tisch'],
      ['Genitiv', 'de[s] neu{en} Tisch[es]', 'ein[es] neu{en} Tisch[es]']
    ]
  },
  {
    color: 'tc-n', genero: 'Neutral', art: 'das', ejemplo: 'das Bett',
    casos: [
      ['Nominativ', 'da[s] klein{e} Bett', 'ein klein[es] Bett'],
      ['Akkusativ', 'da[s] klein{e} Bett', 'ein klein[es] Bett'],
      ['Dativ', 'de[m] klein{en} Bett', 'ein[em] klein{en} Bett'],
      ['Genitiv', 'de[s] klein{en} Bett[es]', 'ein[es] klein{en} Bett[es]']
    ]
  },
  {
    color: 'tc-f', genero: 'Feminin', art: 'die', ejemplo: 'die Lampe',
    casos: [
      ['Nominativ', 'di[e] alt{e} Lampe', 'ein[e] alt{e} Lampe'],
      ['Akkusativ', 'di[e] alt{e} Lampe', 'ein[e] alt{e} Lampe'],
      ['Dativ', 'de[r] alt{en} Lampe', 'ein[er] alt{en} Lampe'],
      ['Genitiv', 'de[r] alt{en} Lampe', 'ein[er] alt{en} Lampe']
    ]
  },
  {
    color: 'tc-pl', genero: 'Plural', art: 'die', ejemplo: 'die Stühle',
    casos: [
      ['Nominativ', 'di[e] bequem{en} Stühle', 'bequem[e] Stühle'],
      ['Akkusativ', 'di[e] bequem{en} Stühle', 'bequem[e] Stühle'],
      ['Dativ', 'de[n] bequem{en} Stühle[n]', 'bequem[en] Stühle[n]'],
      ['Genitiv', 'de[r] bequem{en} Stühle', 'bequem[er] Stühle']
    ]
  }
];

export default function AdjektivTabla() {
  return (
    <>
      <div className="tc-leyenda">
        <span><span className="tc-hi tc-m">-er</span> {pick('marca del caso', 'case marker')}</span>
        <span><span className="tc-hi2">-en</span> {pick('terminación débil (-e / -en)', 'weak ending (-e / -en)')}</span>
      </div>
      <div className="tc-columnas tc-4">
        {GENEROS.map((g) => (
          <Tarjeta key={g.genero} color={g.color} titulo={g.art} sub={`${g.genero} · ${g.ejemplo}`}>
            {g.casos.map(([caso, bestimmt, unbestimmt]) => (
              <div key={caso} className="tc-caso">
                <Apartado>{caso}</Apartado>
                <div className="tc-lineas">
                  <span className="tc-linea"><Marca texto={bestimmt} /></span>
                  <span className="tc-linea tc-linea2"><Marca texto={unbestimmt} /></span>
                </div>
              </div>
            ))}
          </Tarjeta>
        ))}
      </div>

      <Pistas items={[
        [pick('La regla de oro', 'The golden rule'), pick('Alguien tiene que mostrar el caso. Si ya lo muestra el artículo (der, dem, des…), el adjetivo solo acaba en -e o -en. Si no puede (ein sin terminación o sin artículo), lo lleva el adjetivo: ein neuer Tisch, ein kleines Bett, bequeme Stühle.', 'Someone has to show the case. If the article already does (der, dem, des…), the adjective just ends in -e or -en. If it cannot (ein with no ending, or no article), the adjective takes it: ein neuer Tisch, ein kleines Bett, bequeme Stühle.')],
        ['-e / -en', pick('-e en el Nominativ singular y en el Akkusativ femenino y neutro; -en en todo lo demás.', '-e in the nominative singular and the feminine and neuter accusative; -en everywhere else.')],
        [pick('Plural sin artículo', 'Plural without article'), pick('El adjetivo lleva la terminación del artículo que falta: (die) → bequeme Stühle.', 'The adjective takes the ending of the missing article: (die) → bequeme Stühle.')]
      ]} />
    </>
  );
}
