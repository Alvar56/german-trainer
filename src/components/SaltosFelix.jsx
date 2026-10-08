import React, { useRef, useState } from 'react';

// Los saltitos de Felix: tres botes con sombra en el suelo y polvo al
// aterrizar (estilos en index.css, .fox-saludo-zona). Se usan en la portada y
// en la tienda de Felix: al aparecer y cada vez que lo tocas.
//
//   const saltos = useSaltos(true);       // true = salta al aparecer
//   <div onClick={saltos.saltar}>
//     <SaltosFelix saltos={saltos}><FoxFace … /></SaltosFelix>
//   </div>
export function useSaltos(alAparecer = false) {
  const [saltando, setSaltando] = useState(alAparecer);
  // Cada toque cambia la clave: la zona se remonta y la animacion empieza de
  // cero. Pero solo si la anterior ya acabo: tocarlo a mitad de un salto o de
  // una voltereta no la corta, la deja terminar.
  const [vez, setVez] = useState(0);
  const enMarcha = useRef(alAparecer);
  return {
    saltando,
    vez,
    saltar() {
      if (enMarcha.current) return;
      enMarcha.current = true;
      setVez((n) => n + 1);
      setSaltando(true);
    },
    terminar() {
      enMarcha.current = false;
      setSaltando(false);
    }
  };
}

// En el espacio (fondo "weltraum") Felix ya flota: en vez de botes con sombra
// y polvo, da una voltereta ingravida con dos estrellitas.
// Bajo el mar (fondo "unterwasser") tampoco hay botes: Felix sube nadando,
// se mece como si lo llevara la corriente y le salen burbujitas hacia arriba.
export default function SaltosFelix({ saltos, espacio = false, agua = false, children }) {
  return (
    <span
      key={saltos.vez}
      className={'fox-saludo-zona' + (espacio ? ' en-espacio' : '') + (agua ? ' bajo-agua' : '') + (saltos.saltando ? ' saltando' : '') + (saltos.vez > 0 ? ' al-tocar' : '')}
      onAnimationEnd={(e) => { if (e.animationName === 'fox-saltitos' || e.animationName === 'fox-voltereta' || e.animationName === 'fox-nada') saltos.terminar(); }}
    >
      {agua && (
        <>
          <span className="fox-burbuja fb-1" aria-hidden="true" />
          <span className="fox-burbuja fb-2" aria-hidden="true" />
          <span className="fox-burbuja fb-3" aria-hidden="true" />
          <span className="fox-burbuja fb-4" aria-hidden="true" />
          <span className="fox-burbuja fb-5" aria-hidden="true" />
        </>
      )}
      <span className="fox-sombra" aria-hidden="true" />
      <span className="fox-polvo fox-polvo-izq" aria-hidden="true" />
      <span className="fox-polvo fox-polvo-der" aria-hidden="true" />
      <span className="fox-saludo">{children}</span>
    </span>
  );
}
