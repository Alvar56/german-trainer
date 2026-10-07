import React, { useState } from 'react';
import { liveStreak, getLevel, monthCalendar } from '../lib/streak.js';
import { aiAvailable } from '../lib/settings.js';
import { allRuns } from '../lib/leaderboard.js';
import { bestStreak } from '../lib/rachas.js';
import { t, pick } from '../lib/i18n.js';
import { PORTABLE, SIN_IA } from '../lib/modo.js';
import { getFuchs } from '../lib/fuchs.js';
import FoxCard from './FoxCard.jsx';

const WD_ES = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];
const WD_EN = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

function recentRunsStats(limit) {
  const all = allRuns();
  const runs = all.slice(0, limit);
  if (!runs.length) return { acc: null, count: 0 };
  const acc = runs.reduce((s, r) => s + r.accuracy, 0) / runs.length;
  return { acc: Math.round(acc * 100), count: runs.length };
}

export default function Dashboard({ onStart, onNavigate, onFox, onFlashcards, onDiaryNew }) {
  const [monthOffset, setMonthOffset] = useState(0);
  const [slideDir, setSlideDir] = useState('none');

  const s = liveStreak();
  const lvl = getLevel();
  
  const calDate = new Date();
  calDate.setMonth(calDate.getMonth() + monthOffset);
  const cal = monthCalendar(calDate);
  
  const last10 = recentRunsStats(10);
  const aiOn = aiAvailable();
  const WD = pick(WD_ES, WD_EN);
  // En estado y no leido al pintar: si cambias el fondo de Felix en la tienda,
  // el brillo de abajo tiene que cambiar ya, no al volver a la portada.
  const [fondoFelix, setFondoFelix] = useState(() => getFuchs().fondo || 'nadaFondo');

  const recordSeguidas = bestStreak();

  return (
    <div className="wide dashboard-startseite" data-fondo={fondoFelix}>
      <div className="page-head">
        <h1>Startseite</h1>
        <p>{t('home.sub')}</p>
      </div>

      {onFox && <FoxCard onAbrir={onFox} onCambio={(f) => setFondoFelix(f.fondo || 'nadaFondo')} />}

      <div className="statcards statcards-inicio">
        {/* La de nivel es la que ocupa la fila entera en el movil: va marcada
            aqui y no con :first-child, que se colaba en las otras rejillas de
            statcards (el examen, el diario) y les descuadraba el reparto. */}
        <div className="card statcard statcard-ancha">
          <div className={'n' + (lvl.level >= 100 ? ' num-dorado' : '')}>
            {t('home.levelN', { n: lvl.level })}
          </div>
          <div className="flex-min">
            <div className="l" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 4 }}>
              <span>{t('home.xpTotal', { n: lvl.totalXp })}</span>
              <span className="sub" style={{ margin: 0 }}>
                {lvl.isMax ? (
                  <span className="num-dorado" style={{ fontWeight: 800, fontSize: '0.82rem' }}>MAX</span>
                ) : (
                  `${lvl.xpInto}/${lvl.xpNeeded}`
                )}
              </span>
            </div>
            <div className={'mini-bar mini-bar-ancha' + (lvl.isMax ? ' mini-bar-dorada' : '')}>
              <span style={{ width: (lvl.isMax ? 100 : lvl.pct) + '%' }} />
            </div>
          </div>
        </div>
        <div className="card statcard">
          <div className="n">
            {s.current} {s.current > 0 ? '⭐' : ''}
          </div>
          <div>
            <div className="l">{t('home.streak')}</div>
            <div className="sub">{t('home.record')}: {s.longest} · ❄️ {s.freezes}</div>
          </div>
        </div>
        <div className="card statcard">
          <div className="n">
            {recordSeguidas || '—'} {recordSeguidas >= 5 ? '🔥' : recordSeguidas >= 2 ? '⚡' : ''}
          </div>
          <div>
            <div className="l">{t('home.bestRun')}</div>
            <div className="sub best-run-sub">{t('home.bestRunSub')}</div>
          </div>
        </div>
        <div className="card statcard">
          <div className="n">{last10.acc == null ? '—' : last10.acc + '%'}</div>
          <div>
            <div className="l">{t('home.acc10')}</div>
            <div className="sub">{t('home.sessions', { n: last10.count })}</div>
          </div>
        </div>
        <div className="card statcard">
          <div className="n">{allRuns().length}</div>
          <div>
            <div className="l">{t('home.sessionsTotal')}</div>
            {/* "modo plantillas" solo se entendia por contraste con "IA on".
                Sin el otro modo no dice nada, asi que va el dato util. */}
            <div className="sub">{SIN_IA ? t('home.sesionesSub') : aiOn ? t('home.aiOn') : t('home.aiOff')}</div>
          </div>
        </div>
      </div>

      <div className="dash-cols">
        <div className="panel">
          <h2>{t('home.practice')}</h2>

          <p className="muted" style={{ fontSize: '0.83rem', marginBottom: 12 }}>
            {pick(
              <>Practica un poco de todo con ejercicios variados.</>,
              <>Practise a bit of everything with a variety of exercises.</>
            )}
          </p>
          <button className="btn-primary home-todo" onClick={() => onStart('mix', 'mixed', 'todo')}>
            {/* El emoji, aparte del texto, para que en el movil entre en la
                misma pastilla que el resto de opciones. En el escritorio se
                pinta igual que cuando iba dentro de la cadena traducida. */}
            <span className="gt-ico">🎲</span>
            <span className="gt-txt">{t('home.random')}</span>
          </button>
          {/* La portada se queda con tres cosas y ninguna mas: la tanda mixta,
              las tarjetas y el repaso con IA. El juego de der/die/das y el de
              traducir tienen su sitio en Wortschatz y en Kommunikation, y
              repetirlos aqui solo llenaba la pagina de botones.

              Las tarjetas van con el sentido elegido a mano, que no es un
              detalle: el color que gana la palabra sale de ahi. Por que, esta
              explicado en Ajustes -> Como funciona, no debajo de cada boton:
              aqui se viene a pulsar, no a leer. */}
          <div className="gametype-grid" style={{ marginBottom: 12 }}>
            <button className="gametype gt-centro" onClick={() => onFlashcards('de-es')}>
              <span className="gt-ico">🃏</span>
              <span className="gt-txt">
                <span>{t('voc.deToEs')}</span>
              </span>
            </button>
            <button className="gametype gt-centro" onClick={() => onFlashcards('es-de')}>
              <span className="gt-ico">🃏</span>
              <span className="gt-txt">
                <span>{t('voc.esToDe')}</span>
              </span>
            </button>
          </div>
          {/* La clase es solo para el movil: alli se le da el aspecto de las
              tarjetas de arriba, porque centrado y de una linea parecia un
              cacho roto pegado al final de la lista. En el escritorio se queda
              como esta. */}
          {PORTABLE ? (
            <button className="btn-ghost btn-sm home-ai-repaso home-diary-new" onClick={() => onDiaryNew?.()}>
              <span className="gt-ico">✍️</span>
              <span className="gt-txt">{t('home.newDiaryEntry')}</span>
            </button>
          ) : aiOn && (
            <button className="btn-ghost btn-sm home-ai-repaso" onClick={() => onStart('mix', 'ai', 'mixed')}>
              {/* El emoji, separado del texto: asi en el movil entra en la
                  misma pastilla que los iconos de las tarjetas de arriba. En
                  el escritorio se pinta igual que cuando iba dentro de la
                  cadena traducida. */}
              <span className="gt-ico">✨</span>
              <span className="gt-txt">{t('home.aiReview')}</span>
            </button>
          )}
          <div className="home-practica-pies">
            <button className="link-btn" onClick={() => onNavigate('grammar')}>
              <span className="desk-txt">{t('home.pickTopic')}</span>
              <span className="mob-txt">{t('home.pickTopicShort')}</span>
              <span className="fl-arr">▸</span>
            </button>
            <button className="link-btn" onClick={() => onNavigate('vocab')}>
              <span className="desk-txt">{t('home.moreGames')}</span>
              <span className="mob-txt">{t('home.moreGamesShort')}</span>
              <span className="fl-arr">▸</span>
            </button>
            <button className="link-btn" onClick={() => onNavigate('komm')}>
              <span className="desk-txt">{t('home.kommTopic')}</span>
              <span className="mob-txt">{t('home.kommTopicShort')}</span>
              <span className="fl-arr">▸</span>
            </button>
          </div>
          <p className="muted home-practica-nota">
            {t(SIN_IA ? 'home.practiceNoteSinIA' : 'home.practiceNote')}
          </p>
        </div>

        <div className="panel dash-cal">
          {/* Sin titulo ni pastilla de dias seguidos: la tarjeta de datos de
              justo arriba ya lleva ese nombre y ese numero. Aqui manda el mes,
              que es lo unico que esta tarjeta anade. */}
          <div className="row spread" style={{ marginBottom: 8, overflow: 'hidden' }}>
            <div
              key={'label-' + cal.label}
              className={'cal-label ' + (slideDir === 'next' ? 'cal-slide-next' : slideDir === 'prev' ? 'cal-slide-prev' : slideDir === 'fade' ? 'cal-fade' : '')}
              style={{ marginBottom: 0 }}
            >
              {cal.label}
            </div>
            <div className="row" style={{ gap: 8 }}>
              <button
                className="btn btn-sm"
                style={{ padding: '2px 8px' }}
                onClick={() => {
                  setSlideDir('prev');
                  setMonthOffset(m => m - 1);
                }}
              >
                <span className="cal-month-arrow" aria-hidden="true">&lt;</span>
              </button>
              {monthOffset !== 0 && (
                <button
                  className="btn btn-sm"
                  style={{ padding: '2px 10px' }}
                  onClick={() => {
                    setSlideDir('fade');
                    setMonthOffset(0);
                  }}
                >
                  {t('home.todayBtn')}
                </button>
              )}
              <button
                className="btn btn-sm"
                style={{ padding: '2px 8px' }}
                onClick={() => {
                  setSlideDir('next');
                  setMonthOffset(m => m + 1);
                }}
              >
                <span className="cal-month-arrow" aria-hidden="true">&gt;</span>
              </button>
            </div>
          </div>
          <div
            key={'grid-' + monthOffset}
            className={'month-cal ' + (slideDir === 'next' ? 'cal-slide-next' : slideDir === 'prev' ? 'cal-slide-prev' : slideDir === 'fade' ? 'cal-fade' : '')}
          >
            {WD.map((d, i) => (
              <div className="mc-head" key={i}>
                {d}
              </div>
            ))}
            {cal.cells.map((c, i) => {
              if (!c) return <div key={i} className="mc-cell empty" />;
              const prevActive = i % 7 > 0 && cal.cells[i - 1]?.active;
              const nextActive = i % 7 < 6 && cal.cells[i + 1]?.active;
              const prevIsToday = i % 7 > 0 && cal.cells[i - 1]?.isToday;
              const nextIsToday = i % 7 < 6 && cal.cells[i + 1]?.isToday;
              const classes = [
                'mc-cell',
                c.active && 'active',
                c.active && prevActive && !c.isToday && !prevIsToday && 'joined-left',
                c.active && nextActive && !c.isToday && !nextIsToday && 'joined-right',
                c.isToday && 'today'
              ].filter(Boolean).join(' ');
              return (
                <div key={i} className={classes} title={c.key}>
                  {c.day}
                </div>
              );
            })}
          </div>
          <div className="muted cal-pie">
            {t('home.calMonth', { a: cal.activeThisMonth, b: cal.daysInMonth })}
            {s.atRisk && (
              <>
                {' · '}
                <span className="cal-aviso" title={t('home.atRiskWhy')}>{t('home.atRisk')}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
