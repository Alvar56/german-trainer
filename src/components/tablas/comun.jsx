import React from 'react';

// Las piezas de las tablas de teoria, con el mismo estilo que la de der / die
// / das: tarjetas de color con su titulo grande, apartados en versalitas,
// pastillas y, abajo, las pistas en franjas grises.
//
// Los colores: der azul (tc-m), das verde (tc-n), die rosa (tc-f) y el
// plural ambar (tc-pl), como en el juego. Los casos: Nominativ celeste
// (tc-nom), Akkusativ naranja (tc-akk) y Dativ violeta (tc-dat); las
// Wechselpräpositionen, que llevan los dos, turquesa (tc-wechsel).

// 'de[r]' → de + r resaltada con el color de la tarjeta; '{en}' → en gris
// (la terminacion debil del adjetivo).
export function Marca({ texto }) {
  const partes = texto.split(/(\[[^\]]+\]|\{[^}]+\})/).filter(Boolean);
  return partes.map((p, i) => {
    if (p.startsWith('[')) return <span key={i} className="tc-hi">{p.slice(1, -1)}</span>;
    if (p.startsWith('{')) return <span key={i} className="tc-hi2">{p.slice(1, -1)}</span>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

export function Tarjeta({ color, titulo, sub, children, className = '' }) {
  return (
    <div className={'tc-col ' + color + (className ? ' ' + className : '')}>
      <div className="tc-titulo">
        {titulo}
        {sub && <span className="tc-sub">{sub}</span>}
      </div>
      {children}
    </div>
  );
}

export function Apartado({ children }) {
  return <div className="tc-apartado">{children}</div>;
}

export function Pistas({ items }) {
  return (
    <div className="tc-pistas">
      {items.map(([titulo, texto]) => (
        <div key={titulo} className="tc-pista">
          <b>{titulo}</b>
          <span>{texto}</span>
        </div>
      ))}
    </div>
  );
}
