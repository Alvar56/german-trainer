import React, { useMemo, useState } from 'react';
import { t, pick, localeFecha } from '../lib/i18n.js';
import { totales, porDia, evolucionPrecision, porHora, porDiaSemana } from '../lib/estadisticas.js';
import { getLevel, liveStreak } from '../lib/streak.js';
import { BarrasDia, Linea } from './Graficas.jsx';

function Bloque({ titulo, pista, className = '', children, accion }) {
  return (
    <div className={'panel est-bloque ' + className}>
      <div className="est-bloque-cabecera">
        <div className="est-bloque-titulos">
          <h2>{titulo}</h2>
          {pista && <p className="muted est-pista">{pista}</p>}
        </div>
        {accion && <div className="est-bloque-accion">{accion}</div>}
      </div>
      <div className="est-bloque-cuerpo">
        {children}
      </div>
    </div>
  );
}

export default function Estadisticas() {
  // 7 / 30 / 90 días. Un mes por defecto.
  const [ventana, setVentana] = useState(30);

  const tot = useMemo(() => totales(), []);
  const dias = useMemo(() => porDia({ dias: ventana }), [ventana]);
  const precision = useMemo(() => evolucionPrecision(), []);
  const horas = useMemo(() => porHora(), []);
  const semana = useMemo(() => porDiaSemana(), []);
  const nivel = getLevel();
  const racha = liveStreak();

  if (!tot.sesiones) {
    return (
      <div className="card center stack">
        <p className="muted">
          {pick('Aquí saldrán tus gráficas en cuanto termines alguna tanda.',
                'Your charts will show up here as soon as you finish a round.')}
        </p>
      </div>
    );
  }

  const corto = (d) => new Date(d).toLocaleDateString(localeFecha(), { day: 'numeric', month: 'short' });
  const diasConEtiqueta = dias.map((d) => ({ ...d, etiqueta: corto(d.fecha), etiquetaCorta: corto(d.fecha) }));
  const NOMBRES_SEMANA = pick(
    ['lun', 'mar', 'mié', 'jue', 'vie', 'sáb', 'dom'],
    ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  );

  return (
    <div className="stack est">
      <div className="statcards tira-resumen statcards-4">
        <div className="card statcard">
          <div className="n">{tot.sesiones}</div>
          <div className="l">{pick('Tandas', 'Rounds')}</div>
        </div>
        <div className="card statcard">
          <div className="n">{tot.preguntas}</div>
          <div className="l">{pick('Preguntas', 'Questions')}</div>
        </div>
        <div className="card statcard">
          <div className="n">{tot.pct ?? '—'}{tot.pct == null ? '' : '%'}</div>
          <div className="l">{pick('Precisión', 'Accuracy')}</div>
        </div>
        <div className="card statcard">
          <div className="n">{tot.minutos}<span style={{ fontSize: '0.85em', fontWeight: 600 }}> min</span></div>
          <div className="l">{pick('Practicados', 'Practised')}</div>
        </div>
      </div>

      <div className="est-tiras">
        <span className={'pill' + (nivel.level >= 100 ? ' pill-dorada' : '')}>
          🎚 <span className={nivel.level >= 100 ? 'num-dorado' : ''}>{pick('Nivel', 'Level')} {nivel.level}</span>
        </span>
        <span className="pill">➕ {tot.xp} XP</span>
        <span className="pill">⭐ {t('sum.streak')} {racha.current}</span>
        <span className="pill">📅 {tot.dias} {pick('días con práctica', 'days practised')}</span>
        <span className="pill">⏱ {tot.minutosPorDia} min/{pick('día', 'day')}</span>
      </div>

      {/* En rejilla: cuatro bloques equilibrados en 2x2 */}
      <div className="est-rejilla">
        <Bloque
          titulo={pick('Cuánto practicas', 'How much you practise')}
          pista={pick('Minutos por día. Los huecos son los días que no tocaste nada.',
                      'Minutes per day. The gaps are the days you did nothing.')}
          accion={
            <div className="est-botones" data-days={ventana}>
              {[7, 30, 90].map((n) => (
                <button
                  key={n}
                  className={'est-btn-dias' + (ventana === n ? ' on' : '')}
                  onClick={() => setVentana(n)}
                >
                  {n} {pick('días', 'days')}
                </button>
              ))}
            </div>
          }
        >
          <BarrasDia
            datos={diasConEtiqueta}
            valor={(d) => d.minutos}
            unidad=" min"
            etiqueta={pick('Minutos por día', 'Minutes per day')}
          />
        </Bloque>

        <Bloque
          titulo={pick('Si vas a mejor', 'Whether you are improving')}
          pista={pick('Precisión de las últimas tandas. La línea es la media de cinco: una tanda suelta salta demasiado para ver nada.',
                      'Accuracy over your last rounds. The line averages five of them: a single round jumps around too much to read.')}
        >
          {precision.length >= 2 ? (
            <Linea datos={precision} etiqueta={pick('Precisión', 'Accuracy')} />
          ) : (
            <div className="est-vacio muted center" style={{ minHeight: 140, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.88rem' }}>
              {pick('Completa al menos 2 tandas para ver tu evolución.', 'Complete at least 2 rounds to see your progress.')}
            </div>
          )}
        </Bloque>

        <Bloque
          titulo={pick('Por día de la semana', 'By day of the week')}
          pista={pick('Distribución del tiempo practicado en cada día.',
                      'Time practiced across days of the week.')}
        >
          <div className="est-semana-contenedor">
            <div className="est-semana">
              {semana.map((d, i) => {
                const max = Math.max(...semana.map((x) => x.minutos), 1);
                return (
                  <div className="est-dia" key={i}>
                    <span className="est-dia-barra">
                      <span style={{ height: Math.max(d.minutos ? 6 : 0, (d.minutos / max) * 100) + '%' }} />
                    </span>
                    <span className="est-dia-nombre">{NOMBRES_SEMANA[i]}</span>
                    <span className="est-dia-min">{d.minutos > 0 ? `${d.minutos}m` : '0m'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </Bloque>

        <Bloque
          titulo={pick('Por hora del día', 'By time of day')}
          pista={pick('Minutos según la hora a la que sueles estudiar.',
                      'Minutes by the time of day you study.')}
        >
          <BarrasDia
            datos={horas.map((h) => ({
              clave: String(h.hora),
              etiqueta: h.hora + ':00',
              etiquetaCorta: h.hora === 0 ? '0:00' : h.hora === 23 ? '23:00' : '',
              minutos: h.minutos
            }))}
            valor={(d) => d.minutos}
            unidad=" min"
            etiqueta={pick('Por hora', 'By hour')}
            alto={120}
          />
        </Bloque>
      </div>
    </div>
  );
}
