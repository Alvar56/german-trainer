import React from 'react';
import { pick } from '../../lib/i18n.js';
import { Tarjeta, Apartado, Pistas } from './comun.jsx';

// Las preposiciones por el caso que piden, en tarjetas como la tabla de der /
// die / das: Dativ violeta, Akkusativ naranja y las Wechselpräpositionen,
// que llevan los dos, turquesa. Debajo, Wo? / Wohin? con el libro sobre la
// mesa, la comoda, el sofa y las sillas, y las contracciones (im, ins, zum…).
const DATIV = ['aus', 'bei', 'mit', 'nach', 'seit', 'von', 'zu', 'ab', 'außer', 'gegenüber'];
const WECHSEL = ['an', 'auf', 'hinter', 'in', 'neben', 'über', 'unter', 'vor', 'zwischen'];
const AKKUSATIV = ['bis', 'durch', 'für', 'gegen', 'ohne', 'um'];

const EJEMPLOS = [
  { nombre: 'der Tisch', wo: ['dem', 'Tisch'], wohin: ['den', 'Tisch'] },
  { nombre: 'die Kommode', wo: ['der', 'Kommode'], wohin: ['die', 'Kommode'] },
  { nombre: 'das Sofa', wo: ['dem', 'Sofa'], wohin: ['das', 'Sofa'] },
  { nombre: 'die Stühle', wo: ['den', 'Stühlen'], wohin: ['die', 'Stühle'] }
];

// [corta, larga, ejemplo]
const KURZ_DATIV = [
  ['im', 'in dem', 'Ich bin im Kino.'],
  ['am', 'an dem', 'am Montag, am Meer'],
  ['beim', 'bei dem', 'Ich bin beim Arzt.'],
  ['vom', 'von dem', 'Ich komme vom Sport.'],
  ['zum', 'zu dem', 'Ich gehe zum Bahnhof.'],
  ['zur', 'zu der', 'Ich fahre zur Arbeit.']
];
const KURZ_AKK = [
  ['ins', 'in das', 'Ich gehe ins Kino.'],
  ['ans', 'an das', 'Wir fahren ans Meer.'],
  ['aufs', 'auf das', 'Er springt aufs Bett.']
];

function Palabras({ lista }) {
  return <div className="tc-chips">{lista.map((p) => <span key={p} className="tc-chip"><b>{p}</b></span>)}</div>;
}

function Kurz({ lista }) {
  return (
    <div className="tc-kurz">
      {lista.map(([corta, larga, ej]) => (
        <div key={corta} className="tc-kurz-fila">
          <span className="tc-chip"><b>{corta}</b></span>
          <span className="tc-kurz-larga">= {larga}</span>
          <em>{ej}</em>
        </div>
      ))}
    </div>
  );
}

export default function PraepositionenTabla() {
  return (
    <>
      <div className="tc-columnas tc-3">
        <Tarjeta color="tc-dat" titulo="Dativ" sub={pick('siempre · Wem?', 'always · Wem?')}>
          <Palabras lista={DATIV} />
          <div className="tc-nota"><em>mit de<b>m</b> Bus · zu<b>r</b> Schule</em></div>
        </Tarjeta>
        <Tarjeta color="tc-wechsel" titulo="Dativ / Akkusativ" sub="Wo? · Wohin?">
          <Palabras lista={WECHSEL} />
          <div className="tc-nota"><em>Wo? i<b>m</b> Park · Wohin? in de<b>n</b> Park</em></div>
        </Tarjeta>
        <Tarjeta color="tc-akk" titulo="Akkusativ" sub={pick('siempre · Wen? / Was?', 'always · Wen? / Was?')}>
          <Palabras lista={AKKUSATIV} />
          <div className="tc-nota"><em>für de<b>n</b> Freund · ohne mein<b>en</b> Hund</em></div>
        </Tarjeta>
      </div>

      <div className="tc-columnas tc-2">
        <Tarjeta color="tc-dat" titulo="Wo?" sub={pick('lugar → Dativ', 'place → dative')}>
          <Apartado>Das Buch liegt …</Apartado>
          <div className="tc-filas">
            {EJEMPLOS.map((e) => (
              <div key={e.nombre} className="tc-fila"><span>{e.nombre}</span><span>auf <b className="tc-hi">{e.wo[0]}</b> {e.wo[1]}</span></div>
            ))}
          </div>
        </Tarjeta>
        <Tarjeta color="tc-akk" titulo="Wohin?" sub={pick('movimiento → Akkusativ', 'movement → accusative')}>
          <Apartado>Ich lege das Buch …</Apartado>
          <div className="tc-filas">
            {EJEMPLOS.map((e) => (
              <div key={e.nombre} className="tc-fila"><span>{e.nombre}</span><span>auf <b className="tc-hi">{e.wohin[0]}</b> {e.wohin[1]}</span></div>
            ))}
          </div>
        </Tarjeta>
      </div>

      <div className="tc-columnas tc-2">
        <Tarjeta color="tc-dat" titulo="Kurzformen" sub={pick('+ dem / der → Dativ', '+ dem / der → dative')}>
          <Kurz lista={KURZ_DATIV} />
        </Tarjeta>
        <Tarjeta color="tc-akk" titulo="Kurzformen" sub={pick('+ das → Akkusativ', '+ das → accusative')}>
          <Kurz lista={KURZ_AKK} />
          <div className="tc-nota">{pick('Con «die» o «den» no hay forma corta: in die Stadt, an den See.', 'There is no short form with «die» or «den»: in die Stadt, an den See.')}</div>
        </Tarjeta>
      </div>

      <Pistas items={[
        [pick('¿Lugar o movimiento?', 'Place or movement?'), pick('Con las Wechselpräpositionen, si algo se queda en un sitio (Wo?), Dativ: Die Katze schläft unter dem Bett. Si va a un sitio nuevo (Wohin?), Akkusativ: Die Katze läuft unter das Bett.', 'With the two-way prepositions, if something stays in a place (Wo?), dative: Die Katze schläft unter dem Bett. If it goes to a new place (Wohin?), accusative: Die Katze läuft unter das Bett.')],
        [pick('Fechas y días', 'Dates and days'), pick('Siempre «am»: am Montag, am Wochenende, am 3. Mai. Para los meses y las estaciones, «im»: im Mai, im Sommer.', 'Always «am»: am Montag, am Wochenende, am 3. Mai. Months and seasons take «im»: im Mai, im Sommer.')]
      ]} />
    </>
  );
}
