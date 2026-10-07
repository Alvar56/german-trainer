import React, { useEffect, useRef } from 'react';

// Cuadro de notas con negrita y cursiva. Solo se usa en las canciones: ahí la
// nota es para leerla tú y no la lee ninguna IA, así que puede llevar formato
// sin tener que limpiarlo después.
//
// Es un contentEditable, no un textarea: un textarea no puede enseñar formato
// por definición, solo texto plano. Lo que se guarda es HTML mínimo, y por eso
// se pasa SIEMPRE por el filtro de abajo: al pegar desde una web entra media
// hoja de estilos, scripts incluidos.

const PERMITIDAS = new Set(['B', 'I', 'U', 'STRONG', 'EM', 'BR', 'DIV', 'P']);

// Deja solo negrita, cursiva, subrayado y saltos de línea. Lo demás se convierte en
// su texto: nada de atributos, ni enlaces, ni estilos, ni scripts.
function limpiarHtml(sucio) {
  const caja = document.createElement('div');
  caja.innerHTML = String(sucio || '');

  const limpiar = (nodo) => {
    for (const hijo of [...nodo.childNodes]) {
      if (hijo.nodeType === 3) continue; // texto: se queda
      if (hijo.nodeType !== 1) {
        hijo.remove();
        continue;
      }
      limpiar(hijo);
      if (PERMITIDAS.has(hijo.tagName)) {
        for (const attr of [...hijo.attributes]) hijo.removeAttribute(attr.name);
      } else {
        hijo.replaceWith(...hijo.childNodes);
      }
    }
  };
  limpiar(caja);
  return caja.innerHTML;
}

// ¿Queda algo de verdad, o solo etiquetas vacías? Un contentEditable vacío
// suele guardar "<br>" o "<div><br></div>", y eso no es una nota.
function estaVacia(html) {
  const caja = document.createElement('div');
  caja.innerHTML = String(html || '');
  return !caja.textContent.trim();
}

function escapar(txt) {
  return String(txt)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\n/g, '<br>');
}

export default function NotaRica({ value, onChange, placeholder, className = '' }) {
  const caja = useRef(null);

  // El valor solo se vuelca cuando viene de fuera (cambias de canción). Si se
  // volcara en cada tecla, el cursor saltaría al principio a cada letra.
  useEffect(() => {
    const el = caja.current;
    if (!el) return;
    // las notas de antes son texto plano: se escapan para que no se cuelen
    // etiquetas y se respetan sus saltos de línea
    const html = /[<>]/.test(value || '') ? limpiarHtml(value) : escapar(value || '');
    if (el.innerHTML !== html) el.innerHTML = html;
  }, [value]);

  function avisar() {
    onChange(limpiarHtml(caja.current?.innerHTML || ''));
  }

  function formato(cmd) {
    caja.current?.focus();
    document.execCommand(cmd, false);
    avisar();
  }

  function alTeclear(e) {
    const meta = e.ctrlKey || e.metaKey;
    if (!meta) return;
    const cmds = { b: 'bold', i: 'italic', u: 'underline' };
    if (cmds[e.key.toLowerCase()]) {
      e.preventDefault();
      formato(cmds[e.key.toLowerCase()]);
    }
  }

  // Al pegar se mete el texto pelado: si no, entra el formato de media web.
  function alPegar(e) {
    e.preventDefault();
    const txt = e.clipboardData?.getData('text/plain') || '';
    document.execCommand('insertText', false, txt);
  }

  const vacia = estaVacia(value);

  return (
    <div className={'nota-rica ' + className}>
      <div
        ref={caja}
        className={'nr-caja' + (vacia ? ' vacia' : '')}
        contentEditable
        spellCheck={false}
        suppressContentEditableWarning
        role="textbox"
        aria-multiline="true"
        data-placeholder={placeholder}
        onInput={avisar}
        onBlur={avisar}
        onKeyDown={alTeclear}
        onPaste={alPegar}
      />
      {/* Columna a la derecha, botones arriba del todo. */}
      <div className="nr-barra">
        <button type="button" onClick={() => formato('bold')} title="Negrita (Ctrl+B)">
          <strong>N</strong>
        </button>
        <button type="button" onClick={() => formato('italic')} title="Cursiva (Ctrl+I)">
          <em>K</em>
        </button>
        <button type="button" onClick={() => formato('underline')} title="Subrayado (Ctrl+U)">
          <u>S</u>
        </button>
      </div>
    </div>
  );
}
