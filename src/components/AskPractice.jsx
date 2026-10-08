import React, { useEffect, useRef, useState } from 'react';
import NotebookSession from './NotebookSession.jsx';
import { generateAskItems } from '../lib/ai.js';
import { t } from '../lib/i18n.js';
import Cargando from './Cargando.jsx';
import { useTeclas } from '../lib/teclas.js';

// Ejercicios sobre la explicación que acabas de pedir. Leer una explicación y
// creerse que se ha entendido es facilísimo; hacer cuatro ejercicios sobre ella
// es lo que dice si de verdad la has entendido.
//
// No hay motor propio: se generan los ítems y se juegan con la sesión del
// Notizbuch, que ya sabe pintar mc, order y write y llevar la cuenta.
export default function AskPractice({ pregunta, res, onExit, onFinish }) {
  useTeclas({ Escape: onExit });
  const [items, setItems] = useState(null);
  const [err, setErr] = useState('');
  const pedido = useRef(false);

  useEffect(() => {
    if (pedido.current || !res) return;
    pedido.current = true;
    generateAskItems({ pregunta, res, count: 8 }).then(setItems, (e) => setErr(e.message));
  }, [res, pregunta]);

  const volver = (
    <button className="btn-ghost" onClick={onExit}>
      <span className="fl-atras">◂</span> {t('back')}
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
      <div className="stack">
        <Cargando
          icono="✏"
          titulo={t('wait.itemsTitle')}
          pasos={[t('wait.items1'), t('wait.items2'), t('wait.items3'), t('wait.items4')]}
        />
        {volver}
      </div>
    );
  }

  return (
    <NotebookSession
      note={{ id: 'ask-practice', title: res.titel || pregunta, items }}
      lektion={null}
      onExit={onExit}
      onFinish={onFinish}
    />
  );
}
