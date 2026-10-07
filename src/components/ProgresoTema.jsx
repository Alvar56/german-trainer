import React from 'react';
import { t, pick } from '../lib/i18n.js';
import { gameStats, precisionReciente } from '../lib/leaderboard.js';

// Cómo llevas un tema, sea de Grammatik o de Wortschatz. Está aquí y no
// copiado en cada pantalla porque la recompensa por dominar algo debería ser
// la misma se llame lección o mazo.
//
// Son dos barras distintas y conviene no confundirlas:
//   · dominado  → cuánto del tema has aprendido. Al 100% se pone verde.
//   · aciertos  → cómo lo estás haciendo últimamente. Aparece al llegar al
//                 100%, porque hasta entonces la primera ya lo dice todo, y
//                 porque tener un tema dominado no impide fallarlo al volver.

export function BarrasTema({ topicId, pct, etiqueta }) {
  const completo = pct >= 100;
  const rec = completo ? precisionReciente(topicId) : { pct: null };
  const recienteCompleto = rec.pct >= 100;
  const estadoReciente = rec.pct >= 80 ? 'bien' : rec.pct >= 50 ? 'medio' : 'mal';

  return (
    <div className="tema-barras">
      <div className="row" style={{ gap: 12 }}>
        <div className={'mini-bar' + (completo ? ' completo' : '')} style={{ flex: 1 }}>
          <span style={{ width: pct + '%' }} />
        </div>
        <span className={'pill' + (completo ? ' completo' : '')}>
          {completo ? '👑 100%' : pct + '%'}
        </span>
      </div>
      {etiqueta && !completo && <div className="tema-barras-et muted">{etiqueta}</div>}

      {completo && rec.pct != null && (
        <div className="row" style={{ gap: 12, marginTop: 8 }}>
          <div className={'mini-bar' + (recienteCompleto ? ' completo' : '')} style={{ flex: 1 }}>
            <span
              className={recienteCompleto ? 'bien' : rec.pct >= 80 ? 'bien' : rec.pct >= 50 ? 'medio' : 'mal'}
              style={{ width: rec.pct + '%' }}
            />
          </div>
          <span className={'pill' + (recienteCompleto ? ' completo' : ' reciente-' + estadoReciente)}>
            {recienteCompleto ? '🤩 100%' : (
              <>
                {estadoReciente === 'medio' ? '😐 ' : estadoReciente === 'mal' ? '😔 ' : '😃 '}
                {rec.pct}%
              </>
            )}
          </span>
        </div>
      )}
      {completo && rec.pct != null && (
        <div className="tema-barras-et muted">
          {t('gr.recentAcc', { n: rec.sesiones })}
        </div>
      )}
    </div>
  );
}

// Cómo se llama cada minijuego en el desglose. Se exporta porque la
// Bestenliste desglosa lo mismo y no vamos a tener dos listas de nombres
// que se van separando.
const NOMBRE_JUEGO = {
  mixed: ['🎲 Mezclado', '🎲 Mixed'],
  todo: ['🎲 De todo un poco', '🎲 A bit of everything'],
  mc: ['✅ Test de gramática', '✅ Grammar quiz'],
  order: ['🔀 Ordenar frases', '🔀 Sentence order'],
  judge: ['⚖️ ¿Correcto o no?', '⚖️ Right or wrong?'],
  write: ['⌨️ Escribir (gramática)', '⌨️ Type it (grammar)'],
  // Gramatica y vocabulario comparten el id `write`. En las estadisticas se
  // separan mirando el tema de la tanda (los de vocabulario empiezan por
  // "vocab:"), y a ese le toca esta etiqueta.
  'write:voc': ['⌨️ Escribir (vocabulario)', '⌨️ Type it (vocabulary)'],
  weak: ['🩹 Solo mis fallos', '🩹 Just my mistakes'],
  flashcards: ['🃏 Tarjetas', '🃏 Flashcards'],
  quiz: ['✅ Test de vocabulario', '✅ Vocabulary quiz'],
  match: ['🧩 Emparejar', '🧩 Match'],
  wortsalat: ['🔤 Wortsalat', '🔤 Letter salad'],
  blitz: ['⚡ Blitz', '⚡ Blitz'],
  hangman: ['🪢 Ahorcado', '🪢 Hangman'],
  gender: ['🎯 der/die/das', '🎯 der/die/das'],
  cuaderno: ['📓 Cuaderno', '📓 Notebook'],
  notebook: ['📓 Cuaderno', '📓 Notebook'],
  kasus: ['🧭 Kasus', '🧭 Kasus'],
  komm: ['💬 Kommunikation', '💬 Kommunikation'],
  'komm:decir': ['✅ Elegir la frase', '✅ Pick the phrase'],
  'komm:responder': ['🗣️ Contestar', '🗣️ Reply'],
  'komm:ordenar': ['🔀 Ordenar la frase', '🔀 Put it in order'],
  'komm:hueco': ['📝 La palabra que falta', '📝 The missing word'],
  'komm:review': ['🩹 Repasar fallos', '🩹 Review mistakes'],
  'komm:marked': ['⭐ Repasar marcados', '⭐ Review starred'],
  'komm:finish': ['🏁 Terminar el tema', '🏁 Finish the topic'],
  uebersetzen: ['🔁 Traducir frases', '🔁 Translate phrases']
};

// 6.8 -> "6,8" en español, "6.8" en inglés.
function seg(n) {
  const txt = String(n);
  return pick(txt.replace('.', ','), txt);
}

export default function CoronaPanel({ topicId, pct }) {
  if (pct < 100) {
    return <p className="muted corona-locked">🔒 {t('gr.crownLocked', { n: 100 - pct })}</p>;
  }

  const porJuego = gameStats(topicId);

  return (
    <div className="panel corona-panel">
      <div className="corona-head">
        <span className="corona">👑</span>
        <div>
          <strong>{t('gr.crownTitle')}</strong>
          <p className="muted" style={{ fontSize: '0.78rem', marginTop: 2 }}>{t('gr.crownSub')}</p>
        </div>
      </div>
      {porJuego.length === 0 ? (
        <p className="muted" style={{ fontSize: '0.82rem' }}>{t('gr.crownNone')}</p>
      ) : (
        porJuego.map((j) => (
          /* Todo en UNA fila: nombre, las cifras, la barra y el porcentaje.
             Antes iba en dos —los datos debajo del nombre— y con cinco
             minijuegos eran diez renglones para comparar tres números. En
             rejilla y no en flex para que las barras de todos los juegos
             queden a la misma altura y se puedan comparar de un vistazo. */
          <div className="juego-fila" key={j.game}>
            <span className="jf-nombre">{pick(...(NOMBRE_JUEGO[j.game] || [j.game, j.game]))}</span>
            <span className="jf-tiempos muted">
              <span>{t('gr.crownRuns', { n: j.sesiones })}</span>
              {j.segPorPregunta != null && (
                <span>⏱ {t('gr.crownSpeed', { s: seg(j.segPorPregunta) })}</span>
              )}
              {j.record ? (
                <span className="jf-record">
                  🏆 {t('gr.crownRecord', { s: seg(j.record.segPorPregunta), n: j.record.preguntas })}
                </span>
              ) : (
                /* Corto, y la explicación en el tooltip: la frase entera
                   ("aún no has hecho una sesión sin fallos") ocupaba más que
                   el resto de la fila junta para decir que no hay nada. */
                <span title={t('gr.crownNoRecord')}>{t('gr.crownNoRecordShort')}</span>
              )}
            </span>
            <span className="mini-bar jf-barra">
              <span
                className={j.pct >= 80 ? 'bien' : j.pct >= 50 ? 'medio' : 'mal'}
                style={{ width: j.pct + '%' }}
              />
            </span>
            <span className="jf-pct">{j.pct}%</span>
          </div>
        ))
      )}
    </div>
  );
}
