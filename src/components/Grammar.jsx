import React, { useState } from 'react';
import BookNav from './BookNav.jsx';
import GrammarAsk from './GrammarAsk.jsx';
import MezclaGramatica from './MezclaGramatica.jsx';
import TemasGramatica from './TemasGramatica.jsx';
import TarjetaKasus from './TarjetaKasus.jsx';
import { KURSBUCH } from '../lib/kursbuch/index.js';
import { SIN_IA, PORTABLE } from '../lib/modo.js';
import { t } from '../lib/i18n.js';
import Desplegable from './Desplegable.jsx';

export default function Grammar({ onOpen, onPractise, onStart, onKasus }) {
  const [showTemas, setShowTemas] = useState(false);
  return (
    <BookNav
      title="Grammatik"
      subtitle={t('gr.sub', { libro: KURSBUCH.title })}
      count={(l) => l.grammatik.length}
      unit={[t('rule'), t('rules')]}
      onOpen={(l) => onOpen('kb-' + l.id)}
      progressKey="grammatik"
      extra={
        <>
          {!SIN_IA && <GrammarAsk niveau="A2" onPractise={onPractise} onOpen={onOpen} />}
          {SIN_IA && !PORTABLE && (
            <div style={{ marginTop: 14 }}>
              <button className="link-btn pie-abrir" onClick={() => setShowTemas(!showTemas)} aria-expanded={showTemas}>
                {showTemas ? t('gr.hideTemas') : t('gr.showTemas')}
              </button>
              <Desplegable abierto={showTemas} className="grammar-extra-lista">
                <TemasGramatica onOpen={onOpen} />
              </Desplegable>
            </div>
          )}
          <MezclaGramatica onStart={onStart} />
        </>
      }
      // Arriba del todo, como el juego de der/die/das en Wortschatz: es el
      // juego de la sección, no un añadido al final.
      antes={<TarjetaKasus onJugar={onKasus} />}
    />
  );
}
