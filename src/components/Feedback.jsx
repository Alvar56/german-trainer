import React, { useEffect, useRef, useState } from 'react';
import { t, codigoIdioma, pick } from '../lib/i18n.js';
import { aiAvailable } from '../lib/settings.js';
import { explainItem } from '../lib/ai.js';
import TextoAleman from './TextoAleman.jsx';
import { tc } from '../lib/contenido/index.js';
import { useTeclas } from '../lib/teclas.js';
import { capitalizarInicioFrase } from '../lib/frases.js';

export default function Feedback({ item, correct, chosen, onNext, onRetry, last }) {
  const [aiText, setAiText] = useState('');
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');
  const avanceEnCurso = useRef(false);
  const panelRef = useRef(null);
  const aiOn = aiAvailable();

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel || !panel.closest('.session') || window.innerWidth > 720) return;

    // En móvil lleva la vista hasta el final de la corrección. scrollIntoView
    // encuentra el contenedor desplazable real aunque cambie el layout.
    const timer = window.setTimeout(() => {
      if (!panel.isConnected) return;
      const reducir = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
      panel.scrollIntoView({ block: 'end', inline: 'nearest', behavior: reducir ? 'auto' : 'smooth' });
    }, 260);
    return () => window.clearTimeout(timer);
  }, []);

  function avanzar(e) {
    // Ignora la repetición de Enter/espacio y el doble clic mientras React
    // cambia a la siguiente pregunta. Así una pulsación no consume dos.
    if (e?.repeat || avanceEnCurso.current) return;
    avanceEnCurso.current = true;
    onNext();
    setTimeout(() => { avanceEnCurso.current = false; }, 300);
  }

  async function askAi() {
    setLoading(true);
    setErr('');
    try {
      const txt = await explainItem({ item, chosen });
      setAiText(txt);
    } catch (e) {
      setErr(e.message);
    } finally {
      setLoading(false);
    }
  }

  const isOpen = item.type === 'open';
  const siguienteFrase = item.type === 'write' && !last;
  const nextText = siguienteFrase
    ? pick('Continuar', 'Continue')
    : (last ? t('fb.results') : t('fb.next'));

  // Enter (o espacio) para pasar a la siguiente. La corrección es la pantalla
  // que más veces se ve en toda la app y era la única en la que había que ir
  // al ratón: se contestaba con el teclado y se seguía con el dedo.
  useTeclas({ Enter: avanzar, ' ': avanzar });

  return (
    <div ref={panelRef} className={'feedback ' + (correct ? 'ok' : 'no')}>
      <div className="verdict">{correct ? t('fb.right') : t('fb.wrong')}</div>
      {!isOpen && item.type === 'judge' && item.isCorrect === false && (
        <div className="judge-error-original">
          <span className="judge-error-label">{pick('Frase con el error:', 'Sentence with the mistake:')}</span>
          {judgeErrorLine(item)}
        </div>
      )}
      {!isOpen && <div className="de">{deLine(item)}</div>}
      {/* La etiqueta dice en que idioma esta la linea: ponia "ES" siempre, y
          con la app en ingles quedaba un ES encima de una frase en ingles. */}
      {!isOpen && (
        <div className="es">
          <span className="lang-tag">{codigoIdioma()}</span>
          {capitalizarInicioFrase(tc(item.translation || item.sentence || item.clozeText || ''))}
        </div>
      )}
      {/* El aleman que lleva dentro la explicacion, en cursiva: asi se ve de
          un vistazo que es la lengua que estas aprendiendo. */}
      {!isOpen && item.explanation && (
        <div className="why">
          <span className="lang-tag">{t('fb.why')}</span>
          <TextoAleman texto={tc(item.explanation)} />
        </div>
      )}
      {item.source === 'ia' && <div className="pill ai" style={{ marginTop: 10 }}>{t('fb.aiItem')}</div>}

      {aiText && <div className="ai-explain">✨ {aiText}</div>}
      {err && <p className="muted" style={{ marginTop: 8, fontSize: '0.83rem' }}>{t('fb.aiFail')}{err}</p>}

      <div className="btn-row" style={{ marginTop: 14 }}>
        <button className="btn-primary" onClick={avanzar}>
          {nextText}
        </button>
        {!correct && onRetry && (
          <button className="btn-ghost" onClick={onRetry}>
            {t('retry')}
          </button>
        )}
        {aiOn && !aiText && !isOpen && (
          <button className="btn-ghost" onClick={askAi} disabled={loading}>
            {loading ? t('fb.asking') : t('fb.askAi')}
          </button>
        )}
      </div>
    </div>
  );
}

function deLine(item) {
  if (!item) return '';
  if (item.type === 'order' && item.solution) return item.solution.join(' ');
  if (item.type === 'judge') return capitalizarInicioFrase(item.correctForm || item.display || item.sentence || '');
  if (item.type === 'cloze' || item.clozeText) {
    const texto = item.clozeText || item.sentence || '';
    const huecos = (String(texto).match(/___/g) || []).length;
    const parts = respuestasEnOrden(item.clozeAnswers || item.answer, huecos);
    let i = 0;
    return capitalizarInicioFrase(String(texto).replace(/___/g, () => parts[i++] || '___'));
  }
  if (item.type === 'open') return item.question || item.sentence || '';
  
  if (item.sentence && item.sentence.includes('___')) {
    const huecos = (String(item.sentence).match(/___/g) || []).length;
    const parts = respuestasEnOrden(item.answer, huecos);
    let i = 0;
    return capitalizarInicioFrase(String(item.sentence).replace(/___/g, () => parts[i++] || '___'));
  }
  return capitalizarInicioFrase(item.answer ? `${item.sentence ? item.sentence + ' → ' : ''}${item.answer}` : (item.sentence || ''));
}

function judgeErrorLine(item) {
  const text = capitalizarInicioFrase(item?.display || '');
  const correct = capitalizarInicioFrase(item?.correctForm || '');
  const shownWords = [...text.matchAll(/\S+/g)];
  const correctWords = [...correct.matchAll(/\S+/g)].map((match) => match[0]);
  let prefix = 0;
  while (prefix < shownWords.length && prefix < correctWords.length && shownWords[prefix][0] === correctWords[prefix]) {
    prefix++;
  }
  let suffix = 0;
  while (
    suffix < shownWords.length - prefix &&
    suffix < correctWords.length - prefix &&
    shownWords[shownWords.length - 1 - suffix][0] === correctWords[correctWords.length - 1 - suffix]
  ) {
    suffix++;
  }

  const firstWrong = shownWords[prefix];
  const lastWrong = shownWords[shownWords.length - suffix - 1];
  if (!firstWrong || !lastWrong) return text;
  const start = firstWrong.index;
  const end = lastWrong.index + lastWrong[0].length;
  return <>{text.slice(0, start)}<u className="judge-error-word">{text.slice(start, end)}</u>{text.slice(end)}</>;
}

function respuestasEnOrden(valor, huecos) {
  if (Array.isArray(valor)) return valor.map(String);
  const texto = String(valor || '');
  // Algunos ejercicios guardados juntan las soluciones de varios huecos con
  // barras. Separamos cada respuesta para no repetir la lista completa.
  return ((huecos > 1 && texto.includes('/')) || texto.includes('...'))
    ? texto.split(/\s*(?:\.\.\.|\/)\s*/)
    : [texto];
}
