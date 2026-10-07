import React, { useEffect, useState } from 'react';
import Cargando from './Cargando.jsx';
import { t } from '../lib/i18n.js';
import { mazoConIA, cuantasIA } from '../lib/vocabIA.js';
import { getSettings } from '../lib/settings.js';

// Envuelve a los juegos de vocabulario para meterles palabras nuevas de la IA
// según el mando de Ajustes. Con el mando a cero -que es como viene- no pide
// nada y el juego arranca al instante, igual que siempre.
//
// Va aquí y no dentro de cada juego porque los seis reciben el mazo por la
// misma puerta: así Emparejar, Wortsalat, Blitz, Ahorcado, Test y Escribir se
// enteran a la vez sin tocar ninguno.
export default function MazoConIA({ deck, enabled = true, children }) {
  const [mazo, setMazo] = useState(null);

  useEffect(() => {
    const size = getSettings().sessionSize || 10;
    if (!enabled || !deck || cuantasIA(size) === 0) {
      setMazo(deck);
      return;
    }
    let vivo = true;
    setMazo(null);
    mazoConIA(deck, { size }).then(
      (m) => vivo && setMazo(m),
      () => vivo && setMazo(deck)
    );
    return () => {
      vivo = false;
    };
    // El mazo se rearma al cambiar de mazo o al volver a entrar (la k de la
    // vista); dentro de una partida no tiene que moverse.
  }, [deck?.id, enabled]);

  if (!mazo) {
    return (
      <Cargando
        icono="✨"
        titulo={t('wait.vocabTitle')}
        pasos={[t('wait.vocab1'), t('wait.vocab2'), t('wait.vocab3')]}
      />
    );
  }

  return children(mazo);
}
