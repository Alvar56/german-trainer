import React, { useState } from 'react';
import IconoJuego from './IconoJuego.jsx';
import { t, pick } from '../lib/i18n.js';
import { kasusStats, KASUS_FILTROS_CASO, KASUS_FILTROS_ART } from '../lib/kasus.js';
import EtiquetaChip from './EtiquetaChip.jsx';

// La tarjeta del Kasus Trainer, arriba de Grammatik.
export default function TarjetaKasus({ onJugar }) {
  const [filtro, setFiltro] = useState('all');
  const st = kasusStats(filtro);

  return (
    <div className="juego-seccion">
      <button className={'gender-cta' + (st.pct >= 100 ? ' dominado' : '')} onClick={() => onJugar(filtro)}>
        <IconoJuego e="🧭" />
        <span style={{ flex: 1 }}>
          <div className="gc-title">{t('kasus.title')}</div>
          <div className="gc-sub">
            {t('kasus.sub', { d: st.dominadas, n: st.total, p: st.pct, e: st.empezadas })}
          </div>
        </span>
        <span className="chev">›</span>
      </button>

      <div className="gender-niveles">
        <span className="muted">{pick('Caso', 'Case')}</span>
        {KASUS_FILTROS_CASO.map((f) => (
          <button
            key={f.id}
            className={'ask-chip' + (f.id === filtro ? ' on' : '')}
            onClick={() => setFiltro(f.id)}
          >
            <EtiquetaChip largo={pick(f.es, f.en)} corto={pick(f.corto, f.cortoEn)} />
          </button>
        ))}
      </div>

      <div className="gender-niveles">
        <span className="muted">{pick('Artículo', 'Article')}</span>
        {KASUS_FILTROS_ART.map((f) => (
          <button
            key={f.id}
            className={'ask-chip' + (f.id === filtro ? ' on' : '')}
            onClick={() => setFiltro(f.id)}
          >
            <EtiquetaChip largo={pick(f.es, f.en)} corto={pick(f.corto, f.cortoEn)} />
          </button>
        ))}
      </div>
    </div>
  );
}
