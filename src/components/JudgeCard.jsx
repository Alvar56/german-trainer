import React, { useState } from 'react';
import { t } from '../lib/i18n.js';
import { useTeclas } from '../lib/teclas.js';
import { capitalizarInicioFrase } from '../lib/frases.js';
import { tc } from '../lib/contenido/index.js';

// Juego "¿correcto o no?": se muestra una frase (a veces con un error)
// y el usuario decide si está bien.
export default function JudgeCard({ item, onAnswer }) {
  const [picked, setPicked] = useState(null);
  const done = picked !== null;

  function choose(saysCorrect) {
    if (done) return;
    setPicked(saysCorrect);
    onAnswer(saysCorrect === item.isCorrect, saysCorrect ? 'richtig' : 'falsch');
  }

  useTeclas({
    '1': () => choose(true),
    '2': () => choose(false),
    'r': () => choose(true),
    'f': () => choose(false),
    'j': () => choose(true),
    'n': () => choose(false),
    'y': () => choose(true)
  }, !done);

  return (
    <div className="judge-card">
      <div className="prompt-label">{t('ses.judgeQ')}</div>
      <div className="sentence">{capitalizarInicioFrase(item.display)}</div>
      {/* Lo que la frase QUIERE decir. Sin esto, «Woher kommt sie?» es
          correcta en sí misma aunque el ejercicio pidiera «ihr». */}
      {item.translation && <div className="judge-translation muted">«{tc(item.translation)}»</div>}
      {/* Al corregir, el boton de la respuesta buena se pinta con su propio
          color: «Correcta» en verde y «Tiene un error» en rojo (en verde
          parecia que la frase estaba bien). El otro se apaga; si has
          acertado o no lo dice el recuadro de debajo. */}
      <div className="judge-row">
        <button
          className={
            'judge-btn' +
            ' yes' +
            (done ? (item.isCorrect ? ' good' : ' dim') : '')
          }
          disabled={done}
          onClick={() => choose(true)}
        >
          {t('ses.judgeYes')}
        </button>
        <button
          className={
            'judge-btn' +
            ' no' +
            (done ? (!item.isCorrect ? ' bad' : ' dim') : '')
          }
          disabled={done}
          onClick={() => choose(false)}
        >
          {t('ses.judgeNo')}
        </button>
      </div>
    </div>
  );
}
