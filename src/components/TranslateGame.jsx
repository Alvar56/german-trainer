import React, { useEffect, useMemo, useRef, useState } from 'react';
import FoxOverlay, { useFox } from './FoxOverlay.jsx';
import GameModePill from './GameModePill.jsx';
import { t, pick } from '../lib/i18n.js';
import { tc } from '../lib/contenido/index.js';
import { elegirFrases, corregir, pistas as pistasDe, apuntar, xpDe } from '../lib/uebersetzen.js';
import { explainTranslation } from '../lib/ai.js';
import { aiAvailable } from '../lib/settings.js';
import { recordActivity } from '../lib/streak.js';
import { ganar, monedasConPistas } from '../lib/monedas.js';
import { playAudio } from '../lib/audio.js';
import { bumpSessions, recordAnswer } from '../lib/progress.js';
import { saveRun, guardarParcial } from '../lib/leaderboard.js';
import { getSettings } from '../lib/settings.js';
import { apuntarRespuesta, currentStreak } from '../lib/rachas.js';
import { useExerciseActive, useTeclas } from '../lib/teclas.js';
import Reloj from './Reloj.jsx';
import RachaPill from './RachaPill.jsx';
import Umlaut from './Umlaut.jsx';
import PistaRevelable from './PistaRevelable.jsx';

// Traducir frases del libro en las dos direcciones. Puedes pedir pistas de una
// en una antes de contestar, y al corregir la IA te explica en qué has fallado.
export default function TranslateGame({ onExit, onFinish, lektionId = null, dir = 'mix', nivel = 'all', cartasFijas = null }) {
  const activa = useExerciseActive();
  const fox = useFox();
  // Sin suelo: lo que digas en Ajustes es lo que sale.
  const cuantas = getSettings().sessionSize || 10;
  const frases = useMemo(
    () => cartasFijas || elegirFrases(cuantas, { lektionId, direccion: dir, nivel }),
    [lektionId, dir, nivel, cuantas, cartasFijas]
  );
  const [idx, setIdx] = useState(0);
  const [texto, setTexto] = useState('');
  const [nPistas, setNPistas] = useState(0);
  const [ganadas, setGanadas] = useState(0);
  const [fallo, setFallo] = useState(null); // resultado de corregir, o null
  const [explicacion, setExplicacion] = useState(null);
  const [pidiendo, setPidiendo] = useState(false);
  const resultados = useRef([]);
  const monedas = useRef(0); // lo ganado en esta tanda, para el resumen
  // Aciertos seguidos: aqui no se contaban, asi que una frase mal no
  // rompia la racha y una bien no la subia.
  const [seguidas, setSeguidas] = useState(() => currentStreak());
  const mejorSeguidas = useRef(0);
  const empezado = useRef(Date.now());
  const inputRef = useRef(null);
  const aiOn = aiAvailable();

  useEffect(() => {
    if (activa) inputRef.current?.focus();
  }, [activa, idx]);

  // El aviso de tanda vacia se pinta mas abajo, por debajo de useTeclas. Si
  // cortase aqui, una tanda que llega vacia y se rellena sin desmontar el
  // componente dejaria a React con menos hooks de los que vio antes, y eso tira
  // la pantalla en vez de avisar.
  const vacia = frases.length === 0;
  const cur = vacia ? null : frases[idx];
  const buena = !cur ? '' : cur.dir === 'de-es' ? tc(cur.es) : cur.de;
  const origen = !cur ? '' : cur.dir === 'de-es' ? cur.de : tc(cur.es);
  const listaPistas = cur ? pistasDe(cur, buena) : [];
  const corregido = fallo !== null;

  function pedirPistaTranslate() {
    if (!corregido && nPistas < listaPistas.length) {
      setNPistas((n) => n + 1);
    }
  }

  useTeclas(
    corregido
      ? { Enter: siguiente, ' ': siguiente, Escape: onExit }
      : {
          p: pedirPistaTranslate,
          P: pedirPistaTranslate,
          h: pedirPistaTranslate,
          H: pedirPistaTranslate,
          Escape: onExit
        },
    activa && frases.length > 0
  );

  if (vacia) {
    return (
      <div className="card center stack">
        <p>{t('ueb.vacio')}</p>
        <button className="btn-ghost" onClick={onExit}>{t('back')}</button>
      </div>
    );
  }

  function comprobar() {
    if (corregido || !texto.trim()) return;
    const r = corregir(texto, buena);
    setFallo(r);
    fox.acierto(r.estado === 'bien');
    apuntar(cur.de, r.estado === 'bien');
    const rSeg = apuntarRespuesta(r.estado === 'bien');
    setSeguidas(rSeg.seguidas);
    if (rSeg.seguidas > mejorSeguidas.current) mejorSeguidas.current = rSeg.seguidas;
    // Las frases que salen de una regla suman también en Gramática. Las de
    // Kommunikation no traen concepto: allí el porcentaje va por funciones
    // completadas, no por aciertos sueltos, y mezclarlo mentiría.
    if (cur.conceptId) recordAnswer(cur.conceptId, r.estado === 'bien', { type: 'write', peso: 2 });
    // Mismo sistema que el ahorcado: dos monedas la frase, y menos segun las
    // pistas que hayas gastado. 'casi' y 'orden' cuentan como una pista de mas,
    // porque la has entendido pero te ha fallado la forma.
    const castigo = r.estado === 'bien' ? 0 : 1;
    const premio = r.estado === 'mal' || r.estado === 'vacio'
      ? 0
      : monedasConPistas(nPistas + castigo);
    playAudio(premio > 0);
    if (premio > 0) ganar(premio);
    monedas.current += premio;
    setGanadas(premio);
    resultados.current.push({ frase: cur, tuya: texto.trim(), estado: r.estado, pistas: nPistas });
  }

  async function porQue() {
    if (pidiendo || explicacion) return;
    setPidiendo(true);
    try {
      setExplicacion(
        await explainTranslation({
          origen,
          buena,
          tuya: texto.trim(),
          direccion: cur.dir
        })
      );
    } catch (e) {
      setExplicacion({ error: e.message });
    } finally {
      setPidiendo(false);
    }
  }

  function siguiente() {
    fox.sigue();
    if (idx + 1 < frases.length) {
      setIdx(idx + 1);
      setTexto('');
      setNPistas(0);
      setGanadas(0);
      setFallo(null);
      setExplicacion(null);
    } else {
      terminar();
    }
  }

  function atras() {
    if (idx === 0) return;
    const prev = resultados.current[idx - 1];
    if (!prev) return;
    resultados.current.pop();
    setIdx(idx - 1);
    setTexto(prev.tuya);
    setNPistas(prev.pistas || 0);
    setGanadas(0);
    setFallo({ estado: prev.estado });
    setExplicacion(null);
    fox.sigue();
  }

  // Las frases de una tanda salen de lecciones distintas. Para que la SEGUNDA
  // barra de cada tema de Gramática se entere, se guarda un apunte por lección
  // con lo que has hecho de ESA lección. Las frases de Kommunikation no traen
  // concepto y se quedan fuera: allí el porcentaje va por funciones completas.
  function repartirPorLeccion(res) {
    const porTema = new Map();
    for (const r of res) {
      const cid = r.frase?.conceptId;
      if (!cid) continue;
      const topicId = 'kb-' + String(cid).split(':')[0];
      if (!porTema.has(topicId)) porTema.set(topicId, { correct: 0, total: 0 });
      const c = porTema.get(topicId);
      c.total += 1;
      if (r.estado === 'bien') c.correct += 1;
    }
    for (const [topicId, c] of porTema) {
      guardarParcial({
        topicId,
        topicName: 'Übersetzen',
        mode: 'uebersetzen',
        game: 'uebersetzen',
        correct: c.correct,
        total: c.total,
        accuracy: c.total ? Math.round((c.correct / c.total) * 100) / 100 : 0,
        xp: 0
      });
    }
  }

  function terminar() {
    const seconds = Math.max(1, Math.round((Date.now() - empezado.current) / 1000));
    const bien = resultados.current.filter((r) => r.estado === 'bien').length;
    const total = resultados.current.length;
    const acc = total ? bien / total : 0;
    const xp = resultados.current.reduce((s, r) => s + xpDe(r.estado, r.pistas), 0);
    bumpSessions();
    const streak = recordActivity(xp, Date.now() - empezado.current);
    saveRun({
      topicId: 'komm:uebersetzen',
      topicName: 'Übersetzen',
      mode: 'uebersetzen',
      game: 'uebersetzen',
      correct: bien,
      total,
      accuracy: Math.round(acc * 100) / 100,
      seconds,
      xp
    });
    repartirPorLeccion(resultados.current);
    onFinish({
      deck: { id: 'uebersetzen', name: t('ueb.title'), emoji: '🔁' },
      mode: 'uebersetzen',
      correct: bien,
      total,
      seconds,
      xp,
      streak,
      monedas: monedas.current,
      missed: resultados.current
        .filter((r) => r.estado !== 'bien')
        .map((r) => ({
          ...r.frase,
          es: tc(r.frase.es),
          tuya: r.tuya
        }))
    });
  }

  const clasesCaja = {
    bien: ' bien',
    casi: ' casi',
    orden: ' casi',
    mal: ' mal',
    vacio: ' mal'
  };

  return (
    <div className="vocab-session">
      <div className="progress-top">
        <button className="btn-ghost" onClick={onExit} title={t('ses.exit')}>✕</button>
        <div className="bar">
          <span style={{ width: (idx / frases.length) * 100 + '%' }} />
        </div>
        {idx > 0 && resultados.current[idx - 1] && (
          <button className="btn-ghost ses-atras ses-icon-btn" onClick={atras} title={t('ses.prev')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <span className="timer">{idx + 1}/{frases.length}</span>
      </div>

      <div className="ctx-fila">
        <GameModePill mode="uebersetzen" />
        <span className="row" style={{ gap: 8 }}>
          <RachaPill n={seguidas} />
          <Reloj desde={empezado.current} />
        </span>
      </div>

      <div className="fc-wrap">
        {/* La instrucción y de dónde sale la frase, en dos renglones. Juntos en
            uno, el apartado ("nach dem Weg fragen und den Fußweg beschreiben")
            se leía como una segunda frase en alemán justo encima de la que hay
            que traducir. */}
        <div className="ueb-dir">
          {cur.dir === 'de-es' ? t('ueb.deEs') : t('ueb.esDe')}
        </div>
        {cur.de_donde && <div className="ueb-fuente">{tc(cur.de_donde)}</div>}

        <div className="ueb-origen">{origen}</div>

        {/* Las pistas se piden de una en una y no invalidan el acierto: solo
            cuentan menos puntos. */}
        {!corregido && (
          <div className="ueb-pistas">
            {listaPistas.slice(0, nPistas).map((p, i) => (
              <div className="ueb-pista" key={i}>
                <span className="up-et">{t('ueb.pista' + (i + 1))}</span>
                <span className="up-tx">{p.texto}</span>
              </div>
            ))}
            {listaPistas.length > 0 && (
              <PistaRevelable
                key={idx}
                revealed={nPistas >= listaPistas.length}
                onReveal={pedirPistaTranslate}
                title="Atajo: Alt+P o P"
                className="ueb-pista-accion"
                label={<>💡 {t('ueb.pedirPista', { n: listaPistas.length - nPistas })} <span className="op-tecla" style={{ marginLeft: 4 }}>Alt+P</span></>}
              />
            )}
          </div>
        )}

        <textarea
          ref={inputRef}
          className={'ueb-caja' + (corregido ? clasesCaja[fallo.estado] : '')}
          rows={2}
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              corregido ? siguiente() : comprobar();
            } else if (
              ((e.ctrlKey || e.altKey) && (e.key === 'p' || e.key === 'P' || e.key === 'h' || e.key === 'H')) ||
              e.key === 'F2'
            ) {
              e.preventDefault();
              pedirPistaTranslate();
            }
          }}
          placeholder={cur.dir === 'de-es' ? t('ueb.phEs') : t('ueb.phDe')}
          disabled={corregido}
        />
        {!corregido && cur.dir !== 'de-es' && (
          <Umlaut campo={inputRef} onTexto={setTexto} />
        )}

        {corregido && (
          <div className="ueb-resultado">
            <div className={'ueb-veredicto ' + fallo.estado}>
              {fallo.estado === 'bien' && '✅ ' + t('ueb.bien')}
              {fallo.estado === 'casi' && '🟡 ' + t('ueb.casi')}
              {fallo.estado === 'orden' && '🟡 ' + t('ueb.orden')}
              {(fallo.estado === 'mal' || fallo.estado === 'vacio') && '❌ ' + t('ueb.mal')}
            </div>
            {/* Que se vea lo que ha costado pedir pistas, no solo el veredicto. */}
            {ganadas > 0 && (
              <p className="muted" style={{ fontSize: '0.84rem', margin: '4px 0 0' }}>
                {'🪙 +' + ganadas}
                {nPistas > 0 ? ' · ' + nPistas + (nPistas > 1 ? ' pistas' : ' pista') : ''}
              </p>
            )}
            {fallo.estado !== 'bien' && (
              <div className="ueb-buena">
                <span className="ub-et">{t('ueb.correcta')}</span>
                <span className="ub-tx">{buena}</span>
              </div>
            )}

            {fallo.estado !== 'bien' && aiOn && !explicacion && (
              <button className="btn-ghost btn-sm" onClick={porQue} disabled={pidiendo}>
                {pidiendo ? t('ueb.pensando') : '🦊 ' + t('ueb.porQue')}
              </button>
            )}

            {explicacion && (
              <div className="ueb-explica">
                {explicacion.error ? (
                  <p style={{ color: 'var(--bad)', fontSize: '0.85rem' }}>{explicacion.error}</p>
                ) : (
                  <>
                    <p className="ue-resumen">{explicacion.resumen}</p>
                    {explicacion.fallos?.length > 0 && (
                      <ul className="ue-fallos">
                        {explicacion.fallos.map((f, i) => (
                          <li key={i}>
                            <span className="falsch">{f.tuyo}</span>
                            <span className="pfeil">→</span>
                            <span className="richtig">{f.bueno}</span>
                            {f.porque && <span className="ue-por"> {f.porque}</span>}
                          </li>
                        ))}
                      </ul>
                    )}
                    {explicacion.consejo && <p className="ue-consejo">💡 {explicacion.consejo}</p>}
                  </>
                )}
              </div>
            )}
          </div>
        )}

        {!corregido && (
          <p className="muted" style={{ fontSize: '0.76rem', marginTop: 8, textAlign: 'center' }}>
            {pick('No hace falta clavar tildes ni puntuación.', 'Accents and punctuation do not have to be exact.')}
          </p>
        )}

        <button
          className="btn-primary btn-corregir translate-check"
          onClick={corregido ? siguiente : comprobar}
          disabled={!corregido && !texto.trim()}
        >
          {corregido
            ? idx + 1 < frases.length
              ? t('ueb.siguiente')
              : t('ueb.terminar')
            : t('ses.check')}
        </button>
      <FoxOverlay fox={fox} mudo={!!corregido} racha={seguidas} />
      </div>
    </div>
  );
}
