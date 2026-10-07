import React, { useEffect, useRef, useState } from 'react';
import { t } from '../lib/i18n.js';
import { useTeclas } from '../lib/teclas.js';

// La conjugacion de un verbo, en una ventana.
//
// Estaba dos veces: en Vocab.jsx y en DeckDetail.jsx. El cuerpo era identico
// (35 lineas clavadas) y las cabeceras no, asi que la MISMA ventana se cerraba
// con una ✕ en un sitio y con un enlace "Cerrar" en el otro, segun por donde
// hubieras entrado. Ahora hay una sola y se cierra igual siempre.
export default function ModalConjugacion({ conjugation, onClose }) {
  const [cerrando, setCerrando] = useState(false);
  const cierreIniciado = useRef(false);
  const cierreTimer = useRef(null);
  useEffect(() => {
    cierreIniciado.current = false;
    setCerrando(false);
    return () => window.clearTimeout(cierreTimer.current);
  }, [conjugation]);

  function cerrar() {
    if (!conjugation || cierreIniciado.current) return;
    cierreIniciado.current = true;
    setCerrando(true);
    cierreTimer.current = window.setTimeout(() => {
      cierreIniciado.current = false;
      onClose();
    }, 320);
  }

  // Escape cierra, igual que la ✕ y que pinchar en el gris de fuera. Va antes
  // del return de abajo a propósito: un hook no puede quedarse sin llamar
  // según el caso.
  useTeclas({ Escape: cerrar }, !!conjugation);

  if (!conjugation) return null;
  const tiempos = Array.isArray(conjugation.tenses) ? conjugation.tenses : [];
  const ejemplos = Array.isArray(conjugation.examples) ? conjugation.examples : [];

  return (
    <div
      className={'modal-overlay modal-conj-overlay' + (cerrando ? ' modal-saliendo' : '')}
      onClick={(e) => { if (!cerrando && e.target === e.currentTarget) cerrar(); }}
    >
      <div className="modal card modal-conj">
        <div className="row spread conj-head">
          <div>
            <h2 className="conj-verbo">{conjugation.verb}</h2>
            <div className="muted conj-trad">{conjugation.translation}</div>
          </div>
          <button className="btn-ghost" onClick={cerrar} title={t('voc.close')}>✕</button>
        </div>

        <div className="conj-grid">
          {tiempos.map((tense, idx) => (
            <div key={idx} className="conj-card">
              <h3 className="conj-title">{tense.name}</h3>
              <table className="conj-table">
                <tbody>
                  {(tense.conjugations || []).map((c, i) => (
                    <tr key={i}>
                      <td className="conj-pronoun">{c.pronoun}</td>
                      <td className="conj-form">{c.form}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>

        {ejemplos.length > 0 && (
          <div className="conj-examples">
            <h3 className="conj-title conj-title-limpio">{t('voc.examples')}</h3>
            <div className="col-12">
              {ejemplos.map((ex, idx) => (
                <div key={idx} className="conj-example">
                  <div className="ce-tense">{ex.tense}</div>
                  <div className="ce-de">{ex.de}</div>
                  <div className="ce-es">{ex.es}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
