import React from 'react';
import { pick } from '../../lib/i18n.js';
import { Marca, Tarjeta, Apartado, Pistas } from './comun.jsx';

// Los verbos en presente, en tarjetas como la tabla de der / die / das: las
// terminaciones regulares, sein y haben, los que cambian la vocal y los
// modales. Debajo, el orden de la frase, los separables y el Perfekt.
const PERSONAS = ['ich', 'du', 'er / sie / es', 'wir', 'ihr', 'sie / Sie'];
const REGULAR = ['lern[e]', 'lern[st]', 'lern[t]', 'lern[en]', 'lern[t]', 'lern[en]'];
const SEIN = ['bin', 'bist', 'ist', 'sind', 'seid', 'sind'];
const HABEN = ['habe', 'hast', 'hat', 'haben', 'habt', 'haben'];

// [infinitivo, du, er]
const E_I = [['sprechen', 'spr[i]chst', 'spr[i]cht'], ['essen', '[i]sst', '[i]sst'], ['nehmen', 'n[i]mmst', 'n[i]mmt'], ['lesen', 'l[ie]st', 'l[ie]st'], ['sehen', 's[ie]hst', 's[ie]ht']];
const A_AE = [['fahren', 'f[ä]hrst', 'f[ä]hrt'], ['schlafen', 'schl[ä]fst', 'schl[ä]ft'], ['laufen', 'l[äu]fst', 'l[äu]ft']];
// [infinitivo, ich / er, du]
const MODALES = [['können', 'kann', 'kannst'], ['müssen', 'muss', 'musst'], ['wollen', 'will', 'willst'], ['dürfen', 'darf', 'darfst'], ['sollen', 'soll', 'sollst'], ['möchten', 'möchte', 'möchtest']];

function Conjugacion({ formas }) {
  return (
    <div className="tc-filas">
      {PERSONAS.map((p, i) => (
        <div key={p} className="tc-fila"><span>{p}</span><b><Marca texto={formas[i]} /></b></div>
      ))}
    </div>
  );
}

export default function VerbenTabla() {
  return (
    <>
      <div className="tc-columnas tc-4">
        <Tarjeta color="tc-m" titulo={pick('Regulares', 'Regular')} sub="lernen">
          <Conjugacion formas={REGULAR} />
          <div className="tc-nota">{pick('Raíz en -t / -d: du arbeit', 'Stem in -t / -d: du arbeit')}<b>e</b>st, er arbeit<b>e</b>t</div>
        </Tarjeta>
        <Tarjeta color="tc-n" titulo="sein" sub={pick('ser / estar', 'to be')}>
          <Conjugacion formas={SEIN} />
        </Tarjeta>
        <Tarjeta color="tc-f" titulo="haben" sub={pick('tener', 'to have')}>
          <Conjugacion formas={HABEN} />
        </Tarjeta>
        <Tarjeta color="tc-pl" titulo={pick('Modales', 'Modal verbs')} sub="ich / er · du">
          <div className="tc-filas">
            {MODALES.map(([inf, ich, du]) => (
              <div key={inf} className="tc-fila"><span>{inf}</span><b>{ich} · {du}</b></div>
            ))}
          </div>
          <div className="tc-nota"><em>Ich kann gut <b>schwimmen</b>.</em> {pick('El otro verbo, al final.', 'The other verb goes last.')}</div>
        </Tarjeta>
      </div>

      <div className="tc-columnas tc-2">
        <Tarjeta color="tc-wechsel" titulo={pick('Cambio de vocal', 'Vowel change')} sub={pick('solo con du y er / sie / es', 'only with du and er / sie / es')}>
          <Apartado>e → i / ie</Apartado>
          <div className="tc-filas">
            {E_I.map(([inf, du, er]) => (
              <div key={inf} className="tc-fila"><span>{inf}</span><b>du <Marca texto={du} /> · er <Marca texto={er} /></b></div>
            ))}
          </div>
          <Apartado>a → ä · au → äu</Apartado>
          <div className="tc-filas">
            {A_AE.map(([inf, du, er]) => (
              <div key={inf} className="tc-fila"><span>{inf}</span><b>du <Marca texto={du} /> · er <Marca texto={er} /></b></div>
            ))}
          </div>
        </Tarjeta>
        <Tarjeta color="tc-dat" titulo={pick('La frase', 'The sentence')} sub={pick('dónde va el verbo', 'where the verb goes')}>
          <Apartado>{pick('El verbo, en la posición 2', 'The verb in position 2')}</Apartado>
          <div className="tc-ejemplos">
            <span>Ich <b className="tc-hi">lerne</b> heute Deutsch.</span>
            <span>Heute <b className="tc-hi">lerne</b> ich Deutsch.</span>
          </div>
          <Apartado>{pick('Separables: el prefijo, al final', 'Separable: the prefix goes last')}</Apartado>
          <div className="tc-ejemplos">
            <span>aufstehen → Ich <b className="tc-hi">stehe</b> um 7 Uhr <b className="tc-hi">auf</b>.</span>
            <span>einkaufen → Wir <b className="tc-hi">kaufen</b> heute <b className="tc-hi">ein</b>.</span>
          </div>
          <Apartado>Perfekt: haben / sein + Partizip</Apartado>
          <div className="tc-ejemplos">
            <span>Ich <b className="tc-hi">habe</b> Deutsch <b className="tc-hi">gelernt</b>.</span>
            <span>Wir <b className="tc-hi">sind</b> nach Berlin <b className="tc-hi">gefahren</b>.</span>
          </div>
        </Tarjeta>
      </div>

      <Pistas items={[
        [pick('Preguntas', 'Questions'), pick('Sí / no: el verbo primero (Lernst du Deutsch?). Con W-: la palabra W y luego el verbo (Was lernst du?).', 'Yes / no: the verb first (Lernst du Deutsch?). W-questions: the W-word, then the verb (Was lernst du?).')],
        ['Perfekt', pick('«sein» con movimiento y cambio de estado (gehen, fahren, kommen, aufstehen) y con sein y bleiben; «haben» con casi todo lo demás.', '«sein» with movement and change of state (gehen, fahren, kommen, aufstehen) and with sein and bleiben; «haben» with almost everything else.')]
      ]} />
    </>
  );
}
