import React, { useState } from 'react';
import { t, pick, localeFecha } from '../lib/i18n.js';
import { ranking } from '../lib/leaderboard.js';
import { topicsTraducidos } from '../topics/index.js';
import Estadisticas from './Estadisticas.jsx';
import Tabs from './Tabs.jsx';

// Dos pestañas, como en Grammatik y Wortschatz: la tabla de récords de siempre
// y las gráficas. Todo lo que dibujan las gráficas ya se venía guardando en
// cada tanda; lo único que faltaba era mirarlo.
export default function Leaderboard({ onBack, highlightId }) {
  const [tab, setTab] = useState('ranking');
  const [topicId, setTopicId] = useState('');
  const rows = ranking({ topicId: topicId || null, limit: 15 });

  return (
    <div className="stack">
      <div className="topbar">
        <h1>🏅 Bestenliste</h1>
        <button className="link-btn" onClick={onBack}>
          <span className="fl-atras">◂</span> {t('back')}
        </button>
      </div>

      <Tabs>
        <button
          className={'tab' + (tab === 'ranking' ? ' active' : '')}
          onClick={() => setTab('ranking')}
        >
          🏆 {pick('Récords', 'Records')}
        </button>
        <button
          className={'tab' + (tab === 'stats' ? ' active' : '')}
          onClick={() => setTab('stats')}
        >
          📊 {pick('Estadísticas', 'Statistics')}
        </button>
      </Tabs>

      <div className="tab-panel-content">
      {tab === 'ranking' ? (
        <>
          <p className="muted">{t('lb.sub')}</p>

          <select className="lb-topic-filter" value={topicId} onChange={(e) => setTopicId(e.target.value)}>
            <option value="">{t('lb.allTopics')}</option>
            {topicsTraducidos().map((tp) => (
              <option key={tp.id} value={tp.id}>
                {tp.nameEs}
              </option>
            ))}
          </select>

          <div className="card" style={{ overflowX: 'auto' }}>
            {rows.length === 0 ? (
              <p className="muted">{t('lb.empty')}</p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th className="hide-mobile">#</th>
                    <th>{t('lb.topic')}</th>
                    <th className="hide-mobile">{t('lb.hits')}</th>
                    <th>{t('lb.acc')}</th>
                    <th className="hide-mobile">{t('lb.time')}</th>
                    <th>{t('lb.points')}</th>
                    <th className="hide-mobile">{t('lb.date')}</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r, i) => (
                    <tr key={r.id} className={r.id === highlightId ? 'me' : ''}>
                      <td className="hide-mobile">{i + 1}</td>
                      <td>{r.topicName}</td>
                      <td className="hide-mobile">
                        {r.correct}/{r.total}
                      </td>
                      <td>{Math.round(r.accuracy * 100)}%</td>
                      <td className="hide-mobile">
                        {Math.floor(r.seconds / 60)}:{String(r.seconds % 60).padStart(2, '0')}
                      </td>
                      <td>{r._score}</td>
                      <td className="hide-mobile">{new Date(r.date).toLocaleDateString(localeFecha())}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </>
      ) : (
        <Estadisticas />
      )}
      </div>
    </div>
  );
}
