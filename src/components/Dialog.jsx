import React, { useState, useEffect, useRef } from 'react';
import { Altavoz, Parar } from './IconoMenu.jsx';
import { t } from '../lib/i18n.js';
import Escuchar from './Escuchar.jsx';
import BotonCopiar from './BotonCopiar.jsx';
import { hablarSeguido, pararVoz, hayVozAlemana, alCargarVoces } from '../lib/audio.js';
import { estaGuardado, alternarGuardado, idDe } from '../lib/guardados.js';
import Desplegable from './Desplegable.jsx';

// Muestra una conversación nativa generada por la IA.
export default function Dialog({ dialog, lektion, onBack, onRegenerate, busy, onContestadas, onGuardado, otroIdioma = false, desdeGuardada = false }) {
  const [showEs, setShowEs] = useState(true);
  // El id sale del titulo mas la leccion: pedir dos veces la misma situacion
  // no crea dos entradas y la estrella sale ya marcada.
  const idDlg = idDe((lektion ? 'l' + lektion.nr + '-' : '') + (dialog?.titel || ''));
  const [guardada, setGuardada] = useState(() => estaGuardado('konversation', idDlg));

  function guardar() {
    setGuardada(
      alternarGuardado('konversation', {
        id: idDlg,
        titel: dialog.titel,
        lektionId: lektion?.id || null,
        lektionNr: lektion?.nr || null,
        dialog
      })
    );
    onGuardado?.();
  }
  const [openFrage, setOpenFrage] = useState(null);
  // Las que ya has abierto. Cuando las has mirado TODAS, la función cuenta
  // como practicada: antes contaba solo con que la IA devolviera el diálogo,
  // aunque lo cerraras sin leerlo.
  const [vistas, setVistas] = useState(() => new Set());
  const avisado = useRef(false);
  // Por qué intervención va la lectura seguida (-1 = parada).
  const [sonando, setSonando] = useState(-1);
  const [hayVoz, setHayVoz] = useState(hayVozAlemana);

  // Subir arriba tiene sentido con una conversación recién generada: es nueva y
  // se empieza por el principio. Con una guardada no: acabas de pulsar su
  // nombre en una lista por la que estabas navegando, y el salto te saca de
  // donde estabas. Al volver se recupera el sitio.
  useEffect(() => {
    if (desdeGuardada) return;
    window.scrollTo(0, 0);
  }, []);

  // La lista de voces llega vacía la primera vez y se rellena después.
  useEffect(() => alCargarVoces(() => setHayVoz(hayVozAlemana())), []);

  // Al salir de la pantalla (o al pedir otra conversación) se corta: si no, la
  // voz sigue leyendo un diálogo que ya no está delante.
  useEffect(() => pararVoz, []);
  useEffect(() => { pararVoz(); setSonando(-1); }, [dialog]);

  // Las intervenciones, siempre como lista.
  //
  // Antes esto era `dialog.turns` a pelo en tres sitios y daba igual, porque
  // un dialogo malo moria al recargar la pagina. Ahora las conversaciones se
  // guardan y duran para siempre: una guardada con el campo a medias dejaba la
  // pantalla en blanco, que es justo lo que pasaba con las explicaciones de
  // gramatica antes de blindarlas.
  const turns = Array.isArray(dialog?.turns) ? dialog.turns : [];

  function leerTodo() {
    if (sonando >= 0) { pararVoz(); setSonando(-1); return; }
    hablarSeguido(turns.map((x) => x.de), {
      onCambio: setSonando,
      onFin: () => setSonando(-1)
    });
  }

  const personen = dialog?.personen?.length
    ? dialog.personen
    : [...new Set(turns.map((x) => x.wer))];

  return (
    <div className="reading stack">
      <button className="link-btn" style={{ padding: 0, alignSelf: 'flex-start' }} onClick={onBack}>
        <span className="fl-atras">◂</span> {lektion ? `Lektion ${lektion.nr}` : t('back')}
      </button>

      <div className="page-head" style={{ marginBottom: 0 }}>
        <h1>{dialog.titel}</h1>
        {dialog.situation && <p>{dialog.situation}</p>}
      </div>

      <div className="row" style={{ gap: 10, flexWrap: 'wrap', alignItems: 'center' }}>
        <button className="btn-ghost btn-sm" onClick={() => setShowEs(!showEs)}>
          {showEs ? t('hideEs') : t('showEs')}
        </button>
        <button className="btn-ghost btn-sm" onClick={onRegenerate} disabled={busy}>
          {busy ? t('generating') : t('dlg.other')}
        </button>
        {hayVoz && turns.length > 0 && (
          <button className="btn-ghost btn-sm" onClick={leerTodo}>
            {sonando >= 0 ? <><Parar texto />{t('dlg.stop')}</> : <><Altavoz texto />{t('dlg.listen')}</>}
          </button>
        )}
        {/* La conversación entera en alemán, para pegarla donde la voz sea
            mejor que la del navegador. Sin las traducciones: lo que quieres
            escuchar es el alemán. */}
        {turns.length > 0 && (
          <BotonCopiar texto={() => turns.map((x) => x.de).join('\n')} etiqueta={t('komm.copyConv')} />
        )}
        {/* Guardarla: una conversacion buena costaba un minuto de IA y se
            perdia al pedir la siguiente. */}
        <button className={'lied-save' + (guardada ? ' on' : '')} onClick={guardar}>
          {guardada ? '★' : '☆'}
          <span>{guardada ? t('save.saved') : t('save.save')}</span>
        </button>
      </div>

      {otroIdioma && (
        <p className="aviso-idioma">
          ⚠ {t('otroIdioma')}
        </p>
      )}

      {turns.length === 0 && <p className="muted">{t('dlg.vacia')}</p>}

      <div className="dialog">
        {turns.map((turn, i) => {
          const side = personen.indexOf(turn.wer) === 0 ? 'a' : 'b';
          return (
            <div className={'dlg-turn ' + side + (sonando === i ? ' sonando' : '')} key={i}>
              <div className="dlg-wer">{turn.wer}</div>
              <div className="dlg-bubble">
                <div className="dlg-de">
                  {turn.de}
                  {/* `frase`: se lee entera, sin la limpieza de diccionario. */}
                  <Escuchar texto={turn.de} className="dlg-say" frase rate={0.95} />
                </div>
                {showEs && turn.es && <div className="dlg-es">{turn.es}</div>}
              </div>
            </div>
          );
        })}
      </div>

      {dialog.wendungen?.length > 0 && (
        <div className="card">
          <div className="lk-block-title">{t('dlg.phrases')}</div>
          <ul className="lk-examples" style={{ marginTop: 10 }}>
            {dialog.wendungen.map((w, i) => (
              <li key={i}>
                <span className="de">
                  {w.de}
                  <Escuchar texto={w.de} className="dlg-say" frase />
                </span>
                <span className="es">{w.es}</span>
                {w.wann && <span className="dlg-wann">{w.wann}</span>}
              </li>
            ))}
          </ul>
        </div>
      )}

      {dialog.fragen?.length > 0 && (
        <div className="card">
          <div className="row spread">
            <div className="lk-block-title" style={{ margin: 0 }}>{t('dlg.questions')}</div>
            <span className="muted" style={{ fontSize: '0.78rem' }}>
              {vistas.size}/{dialog.fragen.length}
            </span>
          </div>
          <div className="stack" style={{ gap: 8, marginTop: 10 }}>
            {dialog.fragen.map((f, i) => (
              <div className="dlg-frage" key={i}>
                <button
                  className="komm-head"
                  onClick={() => {
                    setOpenFrage(openFrage === i ? null : i);
                    if (openFrage !== i) {
                      const s2 = new Set(vistas).add(i);
                      setVistas(s2);
                      if (s2.size === dialog.fragen.length && !avisado.current) {
                        avisado.current = true;
                        onContestadas?.();
                      }
                    }
                  }}
                >
                  <span>{f.frage}</span>
                  <span className="muted" style={{ fontSize: '0.78rem' }}>
                    {openFrage === i ? '▴' : '▾'}
                  </span>
                </button>
                <Desplegable abierto={openFrage === i}>
                  <p className="dlg-antwort">{f.antwort}</p>
                </Desplegable>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
