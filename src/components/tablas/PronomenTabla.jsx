import React from 'react';
import { pick } from '../../lib/i18n.js';
import { Tarjeta, Pistas } from './comun.jsx';

// Los pronombres personales por caso (Nominativ celeste, Akkusativ naranja y
// Dativ violeta, como en la tabla de preposiciones) y, al lado, el posesivo
// de cada persona. Ejemplos propios.
const FILAS = [
  ['ich', 'mich', 'mir', 'mein'],
  ['du', 'dich', 'dir', 'dein'],
  ['er', 'ihn', 'ihm', 'sein'],
  ['sie', 'sie', 'ihr', 'ihr'],
  ['es', 'es', 'ihm', 'sein'],
  ['wir', 'uns', 'uns', 'unser'],
  ['ihr', 'euch', 'euch', 'euer'],
  ['sie', 'sie', 'ihnen', 'ihr'],
  ['Sie', 'Sie', 'Ihnen', 'Ihr']
];

// Lo que significa cada uno, para la tarjeta del Nominativ.
const TRAD = () => pick(
  ['yo', 'tú', 'él', 'ella', 'ello', 'nosotros', 'vosotros', 'ellos / ellas', 'usted(es)'],
  ['I', 'you', 'he', 'she', 'it', 'we', 'you (pl.)', 'they', 'you (formal)']
);

const CASOS = [
  { color: 'tc-nom', titulo: 'Nominativ', sub: 'Wer?', col: 0, ej: 'Ich lerne Deutsch.' },
  { color: 'tc-akk', titulo: 'Akkusativ', sub: 'Wen?', col: 1, ej: 'Siehst du mich?' },
  { color: 'tc-dat', titulo: 'Dativ', sub: 'Wem?', col: 2, ej: 'Kannst du mir helfen?' },
  { color: 'tc-pl', titulo: 'Possessiv', sub: pick('mi, tu, su…', 'my, your, his…'), col: 3, ej: 'Das ist mein Hund.' }
];

export default function PronomenTabla() {
  return (
    <>
      <div className="tc-columnas tc-4">
        {CASOS.map((c) => (
          <Tarjeta key={c.titulo} color={c.color} titulo={c.titulo} sub={c.sub}>
            <div className="tc-pronombres">
              {FILAS.map((f, i) => (
                <div key={i} className="tc-pron">
                  <span className="tc-pron-base">{c.col === 0 ? TRAD()[i] : f[0]}</span>
                  <b className={c.col > 0 && f[c.col] !== f[0] ? 'tc-hi' : ''}>{f[c.col]}</b>
                </div>
              ))}
            </div>
            <div className="tc-nota"><em>{c.ej}</em></div>
          </Tarjeta>
        ))}
      </div>

      <Pistas items={[
        [pick('Verbos con Dativ', 'Verbs with dative'), 'helfen, danken, gefallen, gehören, gratulieren, schmecken, passen: ' + pick('Das Kleid gefällt mir. Das Buch gehört ihm.', 'Das Kleid gefällt mir. Das Buch gehört ihm.')],
        [pick('Dos objetos', 'Two objects'), pick('Primero el Dativ (persona) y luego el Akkusativ (cosa): Ich gebe dir das Buch. Si los dos son pronombres, al revés: Ich gebe es dir.', 'First the dative (person), then the accusative (thing): Ich gebe dir das Buch. If both are pronouns, the other way round: Ich gebe es dir.')],
        [pick('Posesivos', 'Possessives'), pick('Se declinan como kein: mein Bruder, meine Schwester, mit meinem Vater. euer pierde la -e-: eure Eltern.', 'They decline like kein: mein Bruder, meine Schwester, mit meinem Vater. euer drops the -e-: eure Eltern.')]
      ]} />
    </>
  );
}
