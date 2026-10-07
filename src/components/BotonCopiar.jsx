import React, { useState } from 'react';
import { t } from '../lib/i18n.js';

// Copiar un texto aleman para oirlo en otro sitio con mejor voz. La del
// navegador es la que hay, y en algunos equipos es mala de verdad.
//
// Lleva el apano del textarea porque navigator.clipboard no existe fuera de
// https, y el HTML portable se abre desde file://.
async function copiarAlPortapapeles(texto) {
  const txt = String(texto || '').trim();
  if (!txt) return false;
  try {
    await navigator.clipboard.writeText(txt);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = txt;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    let ok = false;
    try {
      ok = document.execCommand('copy');
    } catch {
      /* si tampoco va, no hay nada mas que intentar */
    }
    ta.remove();
    return ok;
  }
}

// El boton, con su "copiado" durante dos segundos. `texto` puede ser una
// funcion para no armar la cadena en cada render.
export default function BotonCopiar({ texto, etiqueta, className = 'btn-ghost btn-sm', disabled = false, title }) {
  const [copiado, setCopiado] = useState(false);

  async function alPulsar() {
    const txt = typeof texto === 'function' ? texto() : texto;
    if (!(await copiarAlPortapapeles(txt))) return;
    setCopiado(true);
    setTimeout(() => setCopiado(false), 2000);
  }

  return (
    <button className={className} onClick={alPulsar} disabled={disabled} title={title}>
      {copiado ? t('ex.copied') : etiqueta || t('ex.copyScript')}
    </button>
  );
}
