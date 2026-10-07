import React, { useEffect, useRef, useState } from 'react';
import NotebookSession from './NotebookSession.jsx';
import { generateNotebookItems } from '../lib/ai.js';
import { getLektion, lektionKommunikation, lektionLabel } from '../lib/kursbuch/index.js';
import { respuestaDe } from '../lib/kursbuch/respuestas.js';
import { t } from '../lib/i18n.js';
import { useTeclas } from '../lib/teclas.js';

// Reto con IA sobre las frases de una Lektion de Kommunikation, igual que el
// que ya tenían Vocabulario y Gramática y que aquí faltaba.
//
// Sin motor propio: se le pasan las conversaciones al mismo generador que usa
// el Notizbuch y se juegan con su sesión, que ya sabe pintar mc y order.
//
// Se le manda la frase Y su respuesta, no sólo la frase. Lo que se practica
// aquí es hablar con alguien, así que un ejercicio que ignore lo que te
// contestan se queda a medias; y con el par delante la IA puede preguntar por
// cualquiera de los dos lados.
export default function KommReto({ lektionId, itemsFijos = null, onExit, onFinish }) {
  useTeclas({ Escape: onExit });
  const [items, setItems] = useState(null);
  const [err, setErr] = useState('');
  const pedido = useRef(false);
  const lektion = getLektion(lektionId);
  const nombre = lektion ? lektionLabel(lektion) : '';

  useEffect(() => {
    if (itemsFijos?.length) {
      setItems(itemsFijos);
      return;
    }
    if (pedido.current || !lektion) return;
    pedido.current = true;
    const lineas = [];
    for (const k of lektionKommunikation(lektion)) {
      for (const w of k.wendungen || []) {
        const r = respuestaDe(w.de);
        lineas.push(r ? `${w.de} = ${w.es} / ${r.de} = ${r.es}` : `${w.de} = ${w.es}`);
      }
    }
    generateNotebookItems({
      raw: lineas.join('\n'),
      clean: '',
      lektion: { bandName: lektion.bandId || 'A2' },
      count: 8
    }).then(setItems, (e) => setErr(e.message));
  }, [lektionId, itemsFijos]);

  const volver = (
    <button className="btn-ghost" onClick={onExit}>
      <span className="fl-atras">←</span> {nombre}
    </button>
  );

  if (err) {
    return (
      <div className="card center stack">
        <p style={{ color: 'var(--bad)' }}>{err}</p>
        {volver}
      </div>
    );
  }

  if (!items) {
    return (
      <div className="card center stack">
        <p className="muted">{t('komm.retoCargando', { n: nombre })}</p>
        {volver}
      </div>
    );
  }

  return (
    <NotebookSession
      note={{ id: `kommreto-${lektionId}`, title: nombre, items }}
      lektion={null}
      onExit={onExit}
      onFinish={onFinish}
    />
  );
}
