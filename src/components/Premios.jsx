import React from 'react';
import { t, pick } from '../lib/i18n.js';
import { currentStreak } from '../lib/rachas.js';

// La tira de recompensas del final de una tanda.
//
// Estaba copiada tres veces —gramática, vocabulario y Kommunikation— y por eso
// se iba desordenando: la misma pastilla salía en un sitio y en otro no, y el
// orden lo marcaba el orden en que se fueron añadiendo, no lo que significan.
//
// Ahora van en tres grupos, y se nota al mirarlas porque cada grupo tiene su
// color:
//
//   1. LO QUE HA PASADO en esta tanda: subir de nivel y la racha actual.
//   2. LO QUE HAS GANADO: XP, monedas y el bono del día. Las amarillas.
//   3. DÓNDE ESTÁS: el puesto en la tabla. Las grises.
export default function Premios({
  subida = null,
  xp = 0,
  ocultarXp = false,
  monedas = 0,
  bonoCorona = 0,
  bonoCrucigrama = 0,
  bonoCompletar = 0,
  bonoRachaFinal = 0,
  bonoDia = 0,
  rachaRecord = null,
}) {
  const rachaActual = currentStreak();
  return (
    <div className="sum-premios">
      {/* 1. las noticias */}
      {subida && (
        <span className={'pill nivel-nuevo' + (subida.value >= 100 ? ' pill-dorada' : '')}>
          🆙 {t('sum.levelUp', { n: subida.value })} 🪙 +{subida.monedas}
        </span>
      )}
      {rachaActual > 0 && (
        <span className={'pill racha' + (rachaRecord?.nuevo ? ' fuego' : '')}>
          {rachaActual > 5 ? '🔥' : '⚡'} {t('ses.streakN', { n: rachaActual })}
        </span>
      )}

      {/* 2. lo ganado */}
      {!ocultarXp && <span className="pill">➕ {xp} XP</span>}
      {monedas > 0 && (
        <span className="pill monedas">
          🪙 +{monedas} {pick('por los ejercicios', 'from exercises')}
        </span>
      )}
      {bonoCorona > 0 && (
        <span className="pill monedas">🪙 {t('voc.crownCoins', { n: bonoCorona })}</span>
      )}
      {bonoCrucigrama > 0 && (
        <span className="pill monedas">🪙 {t('voc.crosswordCoins', { n: bonoCrucigrama })}</span>
      )}
      {bonoCompletar > 0 && (
        <span className="pill monedas">
          🪙 +{bonoCompletar} {pick('por completar Blitz', 'for completing Blitz')}
        </span>
      )}
      {bonoRachaFinal > 0 && (
        <span className="pill monedas">🪙 +{bonoRachaFinal} {pick('por racha de 10+', 'for a 10+ streak')}</span>
      )}
      {bonoDia > 0 && (
        <span className="pill monedas">🪙 +{bonoDia}{t('voc.newDayBonus')}</span>
      )}

    </div>
  );
}
