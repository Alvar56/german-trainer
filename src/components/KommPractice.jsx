import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { conSimbolo } from './IconoJuego.jsx';
import { t, pick, codigoIdioma } from '../lib/i18n.js';
import { tc } from '../lib/contenido/index.js';
import { recordKommPracticed, recordKommQuestion, kommFailedQuestions, bumpSessions, KOMM_APROBADO, kommMastery, kommPuntosQueFaltan } from '../lib/progress.js';
import { recordActivity } from '../lib/streak.js';
import { saveRun, rankOfRun } from '../lib/leaderboard.js';
import { aplicarBonoRachaFinal, cobrarEjercicio, RECONOCER, RECONSTRUIR, PRODUCIR } from '../lib/monedas.js';
import { getLektion } from '../lib/kursbuch/index.js';
import MultipleChoice from './MultipleChoice.jsx';
import { respuestaEnCadena, seguimientoDe } from '../lib/kursbuch/respuestas.js';
import { TIPOS, palabraTapable, palabraHuecoValida } from '../lib/kursbuch/kommTipos.js';
import { marcarEjercicio } from '../lib/enEjercicio.js';
import WordOrder from './WordOrder.jsx';
import WriteCard from './WriteCard.jsx';
import FoxOverlay, { useFox } from './FoxOverlay.jsx';
import { apuntarRespuesta, currentStreak } from '../lib/rachas.js';
import { useExerciseActive, useTeclas } from '../lib/teclas.js';
import Reloj from './Reloj.jsx';
import RachaPill from './RachaPill.jsx';
import GameModePill from './GameModePill.jsx';
import Premios from './Premios.jsx';
import StarButton from './StarButton.jsx';
import Confeti from './Confeti.jsx';
import { cobrarCoronaMaestria } from '../lib/topicRewards.js';

// Miniejercicio de una función comunicativa, con las frases que YA trae el
// Kursbuch. Sin IA: las Wendungen están impresas en el libro, así que esto
// funciona con la IA apagada, que antes dejaba esta sección clavada en 0.
//
// Y se corrige solo. La primera versión te preguntaba "¿la sabías?" y te fiabas
// de tu palabra; eso no es acertar, es decir que sí. Aquí o eliges bien o
// colocas bien las palabras, y el porcentaje sube con cada acierto.
// Se aprueba con un 80%. Estuvo en 100 mientras la tanda eran tres o cuatro
// preguntas -ahi fallar una era fallar un cuarto del examen-, pero ahora son
// diez: exigir el pleno en diez preguntas no mide que sepas la funcion, mide
// que no te hayas despistado ni una vez.
//
// El numero vive en progress.js, que es quien lo usa para el porcentaje: aqui
// solo se re-exporta para las pantallas que ya lo importaban de aqui.
export const APROBADO = KOMM_APROBADO;

function mezclar(a) {
  const x = [...a];
  for (let i = x.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [x[i], x[j]] = [x[j], x[i]];
  }
  return x;
}

// Una pregunta por frase, de CUATRO tipos, porque miden cosas distintas:
//
//   decir      elegir la frase alemana a partir del castellano: reconocer.
//   ordenar    colocar las palabras, que es donde de verdad se falla en
//              alemán: el verbo tiene su sitio y no es el de aquí.
//   contestar  te dicen la frase, eliges qué respondes.
//   entender   al revés: te contestan algo y hay que saber qué habías dicho.
//              Es lo que pasa de verdad en una conversación — la frase que tú
//              sueltas te la sabes; la que te devuelven, no.
//
// Los dos últimos salen de las respuestas de respuestas.js. Antes solo se
// usaba uno de los dos, y encima con un `i % 3` que si no se cumplía la
// condición se caía al de siempre: había lecciones enteras donde no salía
// ninguna respuesta. Ahora, para cada frase, se mira QUÉ tipos se pueden
// montar y se reparte entre esos, así que la variedad no depende de la suerte
// del orden en que hayan caído las frases.
//
// `ajenas` son las frases del resto de la lección y `otrasRespuestas` las
// respuestas del resto: hacen de distractores. Sin ellas el test se resuelve
// por descarte y no vale nada.
//   hueco      la frase alemana con una palabra tapada. Mide la palabra
//              exacta, que es lo que se te escapa al repetir de oido.
//   significado  al reves que "decir": te dan la frase alemana y eliges lo que
//              quiere decir. Es la que se contesta mas rapido, y por eso paga
//              menos, pero hace falta: reconocer lo que te dicen es la mitad
//              de una conversacion.
// Los tipos y la palabra tapable viven en kommTipos.js, que es un modulo sin
// JSX: asi los scripts que cuentan ejercicios usan las MISMAS condiciones que
// se usan aqui al montar la pregunta, en vez de repetirlas por su cuenta.
export { TIPOS };

// Preguntas por tanda. Una funcion del libro trae tres o cuatro frases, asi
// que una pregunta por frase dejaba tandas de tres: se acababan antes de
// enterarte y no daba tiempo ni a equivocarte. Cada frase da para varias
// preguntas distintas (elegirla, ordenarla, contestarla...), asi que se
// reparten por rondas hasta llegar a diez.
const POR_TANDA = 10;
const ARRAY_VACIO = Object.freeze([]);


// Todas las preguntas que se le pueden montar a UNA frase. Devuelve funciones
// y no objetos: montar una pregunta cuesta barajar tres listas, y de estas seis
// solo se usan una o dos por frase.
function montadores(w, ajenas, otrasRespuestas, glosas, vuelta = 0) {
  const palabras = String(w.de).trim().split(/\s+/);
  const distractores = mezclar(ajenas.filter((x) => x !== w.de)).slice(0, 3);
  // En cadena: tambien los turnos de dentro tienen quien les conteste.
  const resp = respuestaEnCadena(w.de);
  const despistes = resp
    ? mezclar(otrasRespuestas.filter((x) => x !== resp.de)).slice(0, 3)
    : [];

  return {
    decir: () => distractores.length >= 2 && {
      tipo: 'mc',
      item: {
        prompt: t('komm.exPick'),
        sentence: w.es + (w.wann ? `  (${w.wann})` : ''),
        marco: 'dicho',
        marcoOpciones: 'dicho',
        answer: w.de,
        options: mezclar([w.de, ...distractores])
      },
      explica: { de: w.de, es: w.es }
    },
    ordenar: () => palabras.length >= 3 && palabras.length <= 12 && {
      tipo: 'orden',
      item: {
        prompt: w.es + (w.wann ? ` — ${w.wann}` : ''),
        tokens: mezclar(palabras),
        solution: palabras
      },
      explica: { de: w.de, es: w.es }
    },
    contestar: () => resp && despistes.length >= 2 && {
      tipo: 'mc',
      item: {
        prompt: t('komm.exAntwort'),
        sentence: w.de,
        marco: 'dicho',
        marcoOpciones: 'tuyo',
        answer: resp.de,
        options: mezclar([resp.de, ...despistes])
      },
      // Aqui lo que se contesta es la RESPUESTA, asi que se explica esa.
      explica: { de: resp.de, es: resp.es }
    },
    entender: () => resp && distractores.length >= 2 && {
      tipo: 'mc',
      item: {
        prompt: t('komm.exFrage'),
        sentence: resp.de,
        marco: 'dicho',
        marcoOpciones: 'tuyo',
        sentenceAfterOptions: true,
        answer: w.de,
        options: mezclar([w.de, ...distractores])
      },
      explica: { de: w.de, es: w.es }
    },
    hueco: () => {
      const k = palabraTapable(palabras, vuelta);
      if (k === null) return false;
      const buena = palabras[k].replace(/[.,!?¿¡"„“]/g, '');
      // Aqui se ESCRIBE la palabra, no se elige entre tres. Con opciones
      // delante bastaba con reconocer cual pegaba; teclearla es lo que de
      // verdad se parece a decir la frase. La inicial la da WriteCard, asi
      // que tampoco es adivinar a ciegas.
      //
      // Y al no hacer falta despistes, ya no se descartan las frases de las
      // que no salian tres palabras ajenas decentes: hay mas huecos posibles.
      //
      // Solo se tapa la PALABRA: el signo que la sigue se queda. Si no,
      // "...das wiederholen?" perdia la interrogacion y la frase quedaba
      // coja justo donde estas mirando.
      const conHueco = palabras
        .map((x, n) => (n === k ? x.replace(/^[^.,!?¿¡"„“]+/, '___') : x))
        .join(' ');
      return {
        tipo: 'escribir',
        item: {
          anweisung: t('komm.exHueco'),
          sentence: conHueco,
          answer: buena,
          hintTranslation: w.es
        },
        explica: { de: w.de, es: w.es }
      };
    },
    // Al reves que 'decir': la frase alemana delante y eliges lo que significa.
    // Las glosas de las otras frases hacen de distractores.
    significado: () => {
      const otras = mezclar(glosas.filter((x) => x && x !== w.es)).slice(0, 3);
      return otras.length >= 2 && {
        tipo: 'mc',
        item: {
          prompt: t('komm.exSentido'),
          sentence: w.de,
          marco: 'dicho',
          answer: w.es,
          options: mezclar([w.es, ...otras])
        },
        explica: { de: w.de, es: w.es }
      };
    }
  };
}

// Espacia las preguntas para que nunca aparezcan dos de la misma frase
// seguidas ni se concentren los mismos tipos de ejercicio.
function espaciarPreguntas(lista) {
  if (lista.length <= 2) return mezclar(lista);
  const mezcladas = mezclar(lista);
  const res = [];
  const pendientes = [...mezcladas];

  while (pendientes.length > 0) {
    const ultimoDe = res.length > 0 ? res[res.length - 1].de : null;
    const ultimoTipo = res.length > 0 ? res[res.length - 1].tipo : null;

    // 1. Intentar encontrar candidato con distinta frase y distinto tipo
    let idx = pendientes.findIndex((p) => p.de !== ultimoDe && p.tipo !== ultimoTipo);
    // 2. Si no hay, al menos distinta frase
    if (idx === -1) {
      idx = pendientes.findIndex((p) => p.de !== ultimoDe);
    }
    // 3. Si no queda otra, el primero disponible
    if (idx === -1) {
      idx = 0;
    }
    res.push(pendientes.splice(idx, 1)[0]);
  }
  return res;
}

// La tanda: genera hasta `objetivo` preguntas con máxima variedad y sin
// repeticiones innecesarias.
//
// Prioriza las frases del apartado elegido (con tipos distintos para cada
// una), y si el apartado tiene pocas frases, complementa con otras frases de
// la lección en vez de machacar las mismas 3 frases en un bucle repetitivo.
function construir(wendungen, ajenas = [], otrasRespuestas = [], glosas = [], objetivo = POR_TANDA, tipos = TIPOS, lektionId = null, soloPrimarias = false) {
  const frasesPrimarias = mezclar(
    wendungen.flatMap((w) => [
      w,
      ...seguimientoDe(w.de).map((x) => ({ ...x, seccion: w.seccion || w.funktion }))
    ])
  );

  const ajenasTxt = ajenas.filter((txt) => !frasesPrimarias.some((p) => p.de === txt));
  const frasesAjenas = ajenasTxt.map((txt) => {
    const gIdx = ajenas.indexOf(txt);
    const es = glosas[gIdx] || '';
    return { de: txt, es, seccion: null };
  });

  if (!frasesPrimarias.length && !frasesAjenas.length) return [];

  const tiposDisponibles = tipos.length ? tipos : TIPOS;
  const candidatas = [];
  const usadasPorFrase = new Map();

  const intentarGenerar = (w, tipoForzado = null, vuelta = 0) => {
    const tiposProbables = tipoForzado ? [tipoForzado] : mezclar([...tiposDisponibles]);
    const monta = montadores(w, ajenas, otrasRespuestas, glosas, vuelta);
    for (const t of tiposProbables) {
      if (typeof monta[t] === 'function') {
        const p = monta[t]();
        if (p) {
          return {
            ...p,
            id: `komm:${lektionId || ''}:${p.tipo || 'mc'}:${w.de}:${t}:${vuelta}`,
            seccion: w.seccion,
            lektionId,
            de: w.de,
            es: w.es,
            _kommTipo: t
          };
        }
      }
    }
    return null;
  };

  // Ronda 1: Al menos un ejercicio de cada frase primaria
  for (const w of frasesPrimarias) {
    const item = intentarGenerar(w, null, 0);
    if (item) {
      candidatas.push(item);
      if (!usadasPorFrase.has(w.de)) usadasPorFrase.set(w.de, new Set());
      usadasPorFrase.get(w.de).add(item._kommTipo);
    }
  }

  // Ronda 2: Si el apartado es corto, dar un 2º ejercicio con formato/tipo DISTINTO
  if (candidatas.length < objetivo) {
    for (const w of mezclar(frasesPrimarias)) {
      if (candidatas.length >= objetivo) break;
      const yaUsados = usadasPorFrase.get(w.de) || new Set();
      const tiposRestantes = tiposDisponibles.filter((t) => !yaUsados.has(t));
      const tipoElegido = tiposRestantes.length ? mezclar(tiposRestantes)[0] : null;
      const item = intentarGenerar(w, tipoElegido, 1);
      if (item) {
        candidatas.push(item);
        yaUsados.add(item._kommTipo);
      }
    }
  }

  // Ronda 3: Si todavía faltan preguntas (para no saturar con la misma frase),
  // añadimos preguntas de repaso del resto de la lección
  if (!soloPrimarias && candidatas.length < objetivo && frasesAjenas.length > 0) {
    for (const w of mezclar(frasesAjenas)) {
      if (candidatas.length >= objetivo) break;
      const item = intentarGenerar(w, null, 0);
      if (item) {
        candidatas.push(item);
      }
    }
  }

  // Ronda 4: Si no hay frases ajenas disponibles, completar con variación de salto
  let vueltaExtra = 2;
  while (candidatas.length < objetivo && vueltaExtra < 5) {
    let anyAdded = false;
    for (const w of mezclar(frasesPrimarias)) {
      if (candidatas.length >= objetivo) break;
      const item = intentarGenerar(w, null, vueltaExtra);
      if (item) {
        candidatas.push(item);
        anyAdded = true;
      }
    }
    if (!anyAdded) break;
    vueltaExtra++;
  }

  return espaciarPreguntas(candidatas.slice(0, objetivo));
}

// En el repaso de fallos, el contador representa apartados: se monta una
// pregunta de cada apartado para que la cola y la cifra coincidan.
function construirRepasoApartados(apartados, ajenas, otrasRespuestas, glosas, tipos, lektionId, preguntasFalladas) {
  const falladas = (preguntasFalladas || []).map((pregunta) => ({ ...pregunta }));
  const esHueco = (pregunta) => pregunta?._kommTipo === 'hueco' || pregunta?.tipo === 'escribir';
  const exactas = falladas.filter((pregunta) => !esHueco(pregunta) || palabraHuecoValida(pregunta.item?.answer));
  const seccionesConHuecosDescartados = new Set(
    falladas
      .filter((pregunta) => esHueco(pregunta) && !palabraHuecoValida(pregunta.item?.answer))
      .map((pregunta) => pregunta.seccion)
      .filter(Boolean)
  );
  const seccionesConEjerciciosExactos = new Set(exactas.map((pregunta) => pregunta.seccion).filter(Boolean));
  const seccionesDeRespaldo = (apartados || []).filter((apartado) =>
    !seccionesConEjerciciosExactos.has(apartado.funktion) || seccionesConHuecosDescartados.has(apartado.funktion)
  );
  const generadas = seccionesDeRespaldo.flatMap((apartado, i) => {
    const wendungen = (apartado.wendungen || []).map((w) => ({
      ...w,
      seccion: apartado.funktion
    }));
    const [pregunta] = construir(wendungen, ajenas, otrasRespuestas, glosas, 1, tipos, lektionId);
    return pregunta
      ? [{ ...pregunta, _reviewPosition: i + 1, _reviewSection: apartado.funktion }]
      : [];
  });
  return [...exactas, ...generadas].map((pregunta, i) => ({
    ...pregunta,
    _reviewPosition: i + 1,
    _reviewSection: pregunta.seccion || pregunta._reviewSection
  }));
}

export default function KommPractice({
  lektionId,
  nombreTema = '',
  funktion,
  todasLasFrases = ARRAY_VACIO,
  todasLasRespuestas = ARRAY_VACIO,
  todasLasGlosas = ARRAY_VACIO,
  // Que tipos de pregunta entran. Por defecto, los seis.
  tipos = TIPOS,
  gameId = 'komm',
  reviewMistakes = false,
  reviewSections = ARRAY_VACIO,
  reviewMarked = false,
  // La tanda mezclada no es de ninguna función, así que no marca ninguna
  // como hecha. Todo lo demás (monedas, XP, racha, sesión) cuenta igual.
  itemsFijos = null,
  mezcla = false,
  mixBandNames = ARRAY_VACIO,
  mixDifficultyIds = ARRAY_VACIO,
  resumenGuardado = null,
  onGuardarResumen,
  onLimpiarResumen,
  onSalir,
  onHecho
}) {
  const activa = useExerciseActive();
  const fox = useFox();
  const finishTopic = Boolean(funktion && typeof funktion === 'object' && funktion.finishTopic);
  const apartadosPendientes = finishTopic ? (funktion.apartados || []) : [];
  // Fija el tamaño de «Finish the topic» al entrar. El progreso se actualiza
  // tras cada respuesta; si recalculamos los huecos en cada render, la lista
  // se encoge mientras se juega y puede terminar después de la primera.
  const [preguntasPendientes] = useState(() => finishTopic
    ? Math.max(1, kommPuntosQueFaltan(lektionId, apartadosPendientes))
    : POR_TANDA);
  // Mientras esta tanda esté en pantalla, la app no se recarga sola aunque la
  // sincronización traiga datos nuevos: en Gramática y Vocabulario la práctica
  // es una vista propia y la lista de App.jsx la protege, pero aquí pasa
  // dentro de la pantalla de la Lektion y no la veía nadie.
  useEffect(() => marcarEjercicio(), []);
  const [vuelta, setVuelta] = useState(0);
  // Las preguntas de "repetir los fallos": cuando las hay, la tanda son esas.
  const [fijas, setFijas] = useState(null);
  const generadas = useMemo(
    () => reviewMistakes
      ? construirRepasoApartados(reviewSections, todasLasFrases, todasLasRespuestas, todasLasGlosas, tipos, lektionId, kommFailedQuestions(lektionId))
      : construir(funktion?.wendungen || [], todasLasFrases, todasLasRespuestas, todasLasGlosas, preguntasPendientes, tipos, lektionId, finishTopic),
    [funktion?.funktion, (funktion?.wendungen || []).length, reviewMistakes, reviewSections, tipos, vuelta, lektionId, finishTopic, preguntasPendientes]
  );
  const preguntasIniciales = fijas || itemsFijos || generadas;
  const [reviewQueue, setReviewQueue] = useState(preguntasIniciales);
  const preguntas = reviewMistakes ? reviewQueue : preguntasIniciales;
  const reviewTotal = useRef(preguntasIniciales.length);
  const reviewHistory = useRef([]);
  const [i, setI] = useState(0);
  const [juzgada, setJuzgada] = useState(null); // null | true | false
  const aciertos = useRef(0);
  // Para que la tanda cuente como sesión hace falta lo mismo que en los demás
  // juegos: qué has ido acertando (la racha de monedas sale de ahí) y cuánto
  // has tardado.
  const resultados = useRef(resumenGuardado?.resultados || []);
  const monedas = useRef(0);
  // La racha de aciertos seguidos, igual que en los demás juegos.
  // Lo que llevas seguidas ahora, para el rayito de la cabecera.
  const [seguidas, setSeguidas] = useState(() => currentStreak());
  // Cuantas respuestas de esta tanda han ido a parar a un apartado. Solo
  // sirve para saber si hay que refrescar la lista al terminar.
  const apuntados = useRef(0);
  const mejorSeguidas = useRef(0);
  const ultimaSeguidas = useRef(null);
  const desde = useRef(Date.now());
  const finalizado = useRef(false);
  const [fin, setFin] = useState(resumenGuardado?.fin || null);
  const [bonoCorona, setBonoCorona] = useState(() => Number(resumenGuardado?.fin?.bonoCorona) || 0);
  const coronaRecienCompletada = useRef(Boolean(resumenGuardado?.fin?.coronaRecienCompletada));
  const coronaProcesada = useRef(null);

  useEffect(() => {
    if (!fin || bonoCorona > 0 || coronaProcesada.current === lektionId || !lektionId) return;
    const leccion = getLektion(lektionId);
    const maestria = leccion?.kommunikation?.length
      ? kommMastery(lektionId, leccion.kommunikation)
      : null;
    if (maestria && maestria.total > 0 && maestria.practiced === maestria.total) {
      coronaProcesada.current = lektionId;
      const premio = cobrarCoronaMaestria('kommunikation', lektionId, coronaRecienCompletada.current);
      if (premio > 0) {
        const finConCorona = { ...fin, bonoCorona: premio };
        setBonoCorona(premio);
        setFin(finConCorona);
        if (!reviewMistakes) {
          onGuardarResumen?.({
            fin: finConCorona,
            resultados: reviewHistory.current.length ? reviewHistory.current : resultados.current
          });
        }
      }
    }
  }, [fin, bonoCorona, lektionId, reviewMistakes, onGuardarResumen]);

  // La lista superior se esconde durante la tanda en móvil. Al terminar,
  // vuelve a mostrarse y el resumen queda arriba, igual que en las otras dos
  // secciones. Repetir o empezar otra tanda reactiva el modo ejercicio.
  useLayoutEffect(() => {
    if (!activa) return;
    document.body.classList.toggle('en-ejercicio', !fin);
    if (fin) {
      window.scrollTo(0, 0);
      document.querySelector('.main')?.scrollTo(0, 0);
      document.querySelector('.sidebar')?.scrollTo(0, 0);
    }
  }, [activa, fin]);

  const p = preguntas[i] || null;
  const contextTitle = (reviewMistakes || reviewMarked || finishTopic) && nombreTema
    ? pick(`Kommunikation · ${nombreTema}`, `Communication · ${nombreTema}`)
    : (typeof funktion === 'object' ? (funktion?.funktion || '') : (funktion || ''));

  const starItem = useMemo(() => {
    if (!p) return null;
    const pid = p.id || `komm:${lektionId || ''}:${p.tipo || 'mc'}:${p.explica?.de || p.item?.sentence || i}`;
    return {
      ...p,
      id: pid,
      tipo: p.tipo || 'mc',
      item: p.item,
      explica: p.explica,
      seccion: p.seccion,
      lektionId: p.lektionId || lektionId,
      funktion: typeof funktion === 'object' ? (funktion?.funktion || '') : (funktion || ''),
      sentence: p.item?.sentence,
      prompt: p.item?.prompt || p.item?.anweisung,
      de: p.explica?.de || p.de,
      es: p.explica?.es || p.es,
      ...(p.item || {})
    };
  }, [p, lektionId, funktion, i]);

  // Escape para salir de la práctica.
  useTeclas({ Escape: onSalir });
  const navegacionLibre = reviewMistakes || reviewMarked || Boolean(itemsFijos?.length || fijas?.length);
  // Las flechas recorren toda la lista; Enter solo pasa tras corregir.
  useTeclas({
    ...(juzgada !== null ? { Enter: () => siguiente(), ' ': () => siguiente() } : {}),
    ...(navegacionLibre ? { ArrowLeft: () => atras(), ArrowRight: () => siguiente() } : {})
  }, !fin && (juzgada !== null || navegacionLibre));
  // En el resumen, Enter activa el repaso si hay errores; si no, empieza otra
  // ronda, igual que el botón principal visible en cada caso.
  useTeclas({
    Enter: () => {
      if (resultados.current.some((r) => r && !r.ok)) repetirFallos();
      else otraVez();
    }
  }, Boolean(fin));

  if (!preguntas.length) return null;

  function contestar(ok, _texto, pistas = 0) {
    if (juzgada !== null) return;
    if (ok) aciertos.current += 1;
    // Elegir la frase es RECONOCER; ordenarla, RECONSTRUIR.
    // Elegir es RECONOCER, ordenar es RECONSTRUIR y escribir el hueco es
    // PRODUCIR: no cuesta lo mismo marcar una opcion que teclear la palabra.
    monedas.current += cobrarEjercicio(ok, {
      nivel: preguntas[i].tipo === 'orden'
        ? RECONSTRUIR
        : preguntas[i].tipo === 'escribir'
          ? PRODUCIR
          : RECONOCER,
      pistas
    });
    const seccion = preguntas[i].seccion || (mezcla ? null : funktion.funktion);
    const pregunta = { ...preguntas[i], seccion };
    resultados.current[i] = { ok, tuya: _texto, seccion, pregunta };
    recordKommQuestion(lektionId, pregunta, ok);
    // La barra de la leccion sube AQUI, en cada respuesta, igual que en
    // gramatica y en vocabulario. Antes se apuntaba todo junto al terminar la
    // tanda: la barra pegaba un salto de hasta veinte puntos de una vez, y si
    // te salias a la mitad no contaba nada de lo que llevabas bien.
    if (seccion) {
      const peso = (preguntas[i].tipo && preguntas[i].tipo !== 'test' && preguntas[i].tipo !== 'mc') ? 2 : 1;
      const leccionKomm = !mezcla ? getLektion(lektionId) : null;
      const datosKomm = leccionKomm?.kommunikation || [];
      const completaAntes = datosKomm.length > 0
        && kommMastery(lektionId, datosKomm).practiced === datosKomm.length;
      recordKommPracticed(lektionId, seccion, ok ? peso : 0, 1, { reviewMistake: reviewMistakes });
      if (ok && !completaAntes && datosKomm.length > 0
        && kommMastery(lektionId, datosKomm).practiced === datosKomm.length) {
        coronaRecienCompletada.current = true;
      }
      apuntados.current += 1;
    }
    const rSeg = apuntarRespuesta(ok);
    if (rSeg.seguidas > mejorSeguidas.current) mejorSeguidas.current = rSeg.seguidas;
    setSeguidas(rSeg.seguidas);
    ultimaSeguidas.current = rSeg;
    fox.acierto(ok);
    setJuzgada(ok);
  }

  function verEstado(idx) {
    setI(idx);
    if (reviewMistakes) {
      setJuzgada(null);
      fox.sigue();
      return;
    }
    const hecho = resultados.current[idx];
    if (hecho) {
      setJuzgada(hecho.ok);
    } else {
      setJuzgada(null);
    }
    fox.sigue();
  }

  function atras() {
    if (navegacionLibre) {
      moverRepaso(-1);
      return;
    }
    if (i === 0) return;
    verEstado(i - 1);
  }

  function siguiente() {
    if (navegacionLibre) {
      moverRepaso(1);
      return;
    }
    if (i + 1 < preguntas.length) {
      verEstado(i + 1);
      return;
    }
    finalizar();
  }

  function moverRepaso(direction) {
    if (reviewMistakes && resultados.current[i]?.ok) {
      reviewHistory.current.push(resultados.current[i]);
      const nextQueue = [...preguntas];
      nextQueue.splice(i, 1);
      const nextResults = [...resultados.current];
      nextResults.splice(i, 1);
      resultados.current = nextResults;
      setReviewQueue(nextQueue);
      if (!nextQueue.length) {
        finalizar();
        return;
      }
      const nextIndex = direction > 0
        ? Math.min(i, nextQueue.length - 1)
        : (i === 0 ? nextQueue.length - 1 : i - 1);
      verEstado(nextIndex);
      return;
    }
    if (!preguntas.length) return;
    verEstado((i + direction + preguntas.length) % preguntas.length);
  }

  function finalizar() {
    if (finalizado.current) return;
    finalizado.current = true;
    const total = reviewMistakes ? reviewTotal.current : preguntas.length;
    const pct = Math.round((aciertos.current / total) * 100);
    // Lo de cada apartado ya se ha ido apuntando respuesta a respuesta; aqui
    // solo queda avisar a la lista de que se repinte.
    if (apuntados.current > 0) onHecho?.();
    // La SESIÓN, en cambio, cuenta siempre. Has practicado, y eso es lo que
    // miden la racha, el nivel y la precisión de las últimas diez. Estos
    // ejercicios eran los únicos de la app que no contaban para nada: podías
    // pasarte una tarde en Kommunikation y la portada seguía en cero.
    const segundos = Math.max(1, Math.round((Date.now() - desde.current) / 1000));
    const acc = total ? aciertos.current / total : 0;
    let xp = aciertos.current * 10 + (total - aciertos.current) * 2;
    if (acc >= 0.9) xp += 5;
    bumpSessions();
    // Lo que devuelve dice si esta tanda ha subido de nivel.
    const racha = recordActivity(xp, Date.now() - desde.current);
    const run = saveRun({
      topicId: 'komm:' + lektionId,
      topicName: 'Kommunikation · ' + (typeof funktion === 'object' ? (funktion?.funktion || '') : (funktion || '')),
      mode: 'komm',
      game: gameId,
      correct: aciertos.current,
      total,
      accuracy: Math.round(acc * 100) / 100,
      seconds: segundos,
      xp
    });
    const rank = rankOfRun(run.id, 'komm:' + lektionId);
    const resultadoFinal = aplicarBonoRachaFinal({
      pct,
      segundos,
      // Cuantas has fallado, para el boton de repetirlas.
      fallos: reviewMistakes ? 0 : resultados.current.filter((r) => r && !r.ok).length,
      aciertos: aciertos.current,
      total,
      xp,
      monedas: monedas.current,
      bonoDia: racha.events.find((e) => e.type === 'coins')?.value || 0,
      dias: racha.state.current,
      rachaMax: mejorSeguidas.current,
      rachaRecord: ultimaSeguidas.current,
      rank,
      subida: racha.events.find((e) => e.type === 'level') || null,
      coronaRecienCompletada: coronaRecienCompletada.current
    });
    setFin(resultadoFinal);
    if (!reviewMistakes) {
      onGuardarResumen?.({
        fin: resultadoFinal,
        resultados: reviewHistory.current.length ? reviewHistory.current : resultados.current
      });
    }
  }

  function otraVez() {
    onLimpiarResumen?.();
    finalizado.current = false;
    aciertos.current = 0;
    resultados.current = [];
    apuntados.current = 0;
    monedas.current = 0;
    desde.current = Date.now();
    setI(0);
    setJuzgada(null);
    setFin(null);
    setFijas(null);
    setVuelta((v) => v + 1); // frases barajadas de nuevo, no la misma tanda
  }

  // Otra tanda solo con lo que acabas de fallar.
  function repetirFallos() {
    const malas = resultados.current.filter((r) => !r.ok).map((r) => r.pregunta).filter(Boolean);
    if (!malas.length) return;
    onLimpiarResumen?.();
    finalizado.current = false;
    resultados.current = [];
    apuntados.current = 0;
    aciertos.current = 0;
    monedas.current = 0;
    mejorSeguidas.current = 0;
    desde.current = Date.now();
    setFijas(malas);
    setI(0);
    setJuzgada(null);
    setFin(null);
  }

  if (fin) {
    const aprobado = fin.pct >= APROBADO;
    const fallos = resultados.current.filter((r) => r && !r.ok);
    const leccionKomm = lektionId && !mezcla ? getLektion(lektionId) : null;
    const maestriaKomm = leccionKomm?.kommunikation?.length
      ? kommMastery(lektionId, leccionKomm.kommunikation)
      : null;
    const kommunikationCompleta = !!maestriaKomm
      && maestriaKomm.total > 0
      && maestriaKomm.practiced === maestriaKomm.total;
    const coronaGanadaEnEstaSesion = Boolean(fin.coronaRecienCompletada || bonoCorona > 0);
    const celebracion = coronaGanadaEnEstaSesion ? 'dominio' : fin.pct === 100 ? 'suave' : null;
    return (
      <div className="stack reading kp-resumen">
        {celebracion && <Confeti intensidad={celebracion} />}
        <div className="card center stack kp-fin">
          <div className="confetti-badge">{fin.pct === 100 ? '🏆' : aprobado ? '🎉' : '💪'}</div>
          <h2>{fin.pct === 100 ? t('sum.perfect') : aprobado ? t('sum.good') : t('sum.keep')}</h2>
          <div className="vsummary-pills">
            <span className="pill ctx-tema">💬 {contextTitle}</span>
            {coronaGanadaEnEstaSesion && <span className="pill monedas vocab-corona-ganada">👑 {t('voc.crownEarned')}</span>}
          </div>
          <div className="stat-grid">
            <div className="card">
              <div className="big-stat">{fin.pct}%</div>
              <div className="muted">{t('sum.accuracy')}</div>
            </div>
            <div className="card">
              <div className="big-stat">{fin.aciertos}/{fin.total}</div>
              <div className="muted">{t('sum.hits')}</div>
            </div>
            <div className="card">
              <div className="big-stat">
                {Math.floor(fin.segundos / 60)}:{String(fin.segundos % 60).padStart(2, '0')}
              </div>
              <div className="muted">{t('sum.time')}</div>
            </div>
          </div>
          <Premios
            subida={fin.subida}
            xp={fin.xp}
            monedas={Math.max(0, (Number(fin.monedas) || 0) - (Number(fin.bonoRachaFinal) || 0))}
            bonoRachaFinal={fin.bonoRachaFinal || 0}
            bonoCorona={bonoCorona}
            bonoDia={fin.bonoDia}
            rachaMax={fin.rachaMax}
            rachaRecord={fin.rachaRecord}
            dias={fin.dias}
            rank={fin.rank}
          />
          {!mezcla && (
            <p className={aprobado ? '' : 'muted'}>
              {aprobado ? t('komm.exPassed') : t('komm.exFailed', { p: APROBADO })}
            </p>
          )}
        </div>

        <div className="btn-row resumen-acciones">
          {fallos.length > 0 && (
            <button className="btn-primary resumen-retry" onClick={repetirFallos}>
              <span className="op-tecla atajo-final">Enter</span>
              {conSimbolo(t('sum.retryFails', { n: fallos.length }))}
            </button>
          )}
          <button className={'resumen-otra ' + (fallos.length > 0 ? 'btn-ghost' : 'btn-primary')} onClick={otraVez}>
            {t('sum.again')}
          </button>
          <button className="btn-ghost resumen-volver" onClick={onSalir}>
            {t('vsum.backExercises')}
          </button>
        </div>

        {fallos.length > 0 && (
          <div className="card stack">
            <h3>{t('vsum.toReview')} ({fallos.length})</h3>
            {fallos.map((r, idx) => {
              const pregunta = r.pregunta;
              const de = pregunta.explica?.de || pregunta.item?.answer || pregunta.item?.solution?.join(' ') || '';
              const es = pregunta.explica?.es || '';
              return (
                <div className="mistake" key={`${idx}-${de}`}>
                  <div className="de">{de}</div>
                  {es && <div className="muted" style={{ fontSize: '0.86rem' }}><span className="lang-tag">{codigoIdioma()}</span>{tc(es)}</div>}
                  {r.tuya && <div className="muted" style={{ fontSize: '0.86rem', marginTop: 4 }}>{pick('Tu respuesta: ', 'Your answer: ')}{r.tuya}</div>}
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  const buena = p?.item?.answer || (p?.item?.solution || []).join(' ');
  const reviewResult = reviewMistakes ? resultados.current[i] : null;
  const reviewRemaining = reviewMistakes ? Math.max(0, preguntas.length - (juzgada === true ? 1 : 0)) : 0;
  const reviewPosition = reviewMistakes ? (p?._reviewPosition || i + 1) : i + 1;
  const reviewProgressTotal = reviewMistakes ? reviewTotal.current : preguntas.length;
  const reviewCounterTotal = reviewMistakes ? reviewRemaining : reviewProgressTotal;
  const reviewCounterPosition = reviewMistakes ? Math.min(i + 1, reviewRemaining) : reviewPosition;
  const progressPct = navegacionLibre
    ? (reviewMistakes
      ? ((reviewProgressTotal - reviewRemaining) / Math.max(1, reviewProgressTotal)) * 100
      : ((reviewPosition - 1) / Math.max(1, reviewProgressTotal)) * 100)
    : (i / preguntas.length) * 100;
  const contextReviewLabel = reviewMistakes
    ? t('gr.reviewWeakPill')
    : reviewMarked
      ? t('star.reviewPill')
      : null;

  return (
    <div className="stack kp">
      <div className="progress-top">
        <button className="btn-ghost" onClick={onSalir} title={t('back')}>✕</button>
        <div className="bar"><span style={{ width: progressPct + '%' }} /></div>
        {navegacionLibre ? (
          <>
            <button className="btn-ghost ses-atras ses-icon-btn" onClick={atras} disabled={preguntas.length < 2 && juzgada !== true} title={t('ses.prev')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
            </button>
            <button className="btn-ghost ses-siguiente ses-icon-btn" onClick={siguiente} disabled={preguntas.length < 2 && juzgada !== true} title={t('ses.next')}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </button>
          </>
        ) : i > 0 && resultados.current[i - 1] && (
          <button className="btn-ghost ses-atras ses-icon-btn" onClick={atras} title={t('ses.prev')}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
        )}
        <span className="timer">{navegacionLibre
          ? `${reviewCounterPosition}/${reviewCounterTotal}`
          : `${i + 1}/${preguntas.length}`}</span>
      </div>

      {/* El nombre de la funcion es CONTEXTO, no un enunciado. Llevaba la
          misma clase que el enunciado del ejercicio y salian dos lineas
          grises identicas seguidas, sin saber cual era cual. */}
      <div className="ctx-fila">
        <span className="row ctx-pills-left" style={{ gap: 8, minWidth: 0, flexWrap: 'wrap' }}>
          <span className="pill ctx-tema">
            💬 {contextTitle}
          </span>
          {mezcla && mixBandNames.map((name) => <span key={name} className="pill ctx-tema">{name}</span>)}
          {mezcla && mixDifficultyIds.map((id) => (
            <span key={id} className="pill ctx-tema">{id === 'easy' ? pick('Fácil', 'Easy') : pick('Difícil', 'Difficult')}</span>
          ))}
          {!(mezcla && gameId === 'komm') && <GameModePill mode={gameId} />}
          {finishTopic && <span className="pill ctx-tema">{t('voc.finishPill')}</span>}
          {contextReviewLabel && <span className="pill ctx-tema">{contextReviewLabel}</span>}
        </span>
        <span className="row" style={{ gap: 8 }}>
          <StarButton item={starItem} />
          <RachaPill n={seguidas} />
          <Reloj desde={desde.current} />
        </span>
      </div>

      {/* key: sin él, React reaprovecha el componente entre preguntas y se
          queda la respuesta anterior ya marcada. */}
      <div key={i} className="question-swap">
      {p.tipo === 'mc' ? (
        <MultipleChoice key={i} item={p.item} onAnswer={contestar} />
      ) : p.tipo === 'escribir' ? (
        <WriteCard key={i} item={p.item} onAnswer={contestar} />
      ) : (
        <WordOrder key={i} item={p.item} onAnswer={contestar} />
      )}

      {/* La correccion, con el mismo cuadro que gramatica y vocabulario: la
          frase alemana y lo que quiere decir. Antes era una linea suelta -"x
          Era: <la frase>"- que decia cual era la buena pero no que
          significaba, que es justo lo que te falta cuando acabas de fallarla. */}
      {juzgada !== null && (
        <div className={'feedback ' + (juzgada ? 'ok' : 'no')}>
          <div className="verdict">{juzgada ? t('fb.right') : t('fb.wrong')}</div>
          {p.explica && <div className="de">{p.explica.de}</div>}
          {p.explica && (
            <div className="es">
              <span className="lang-tag">{codigoIdioma()}</span>
              {tc(p.explica.es)}
            </div>
          )}
          {/* Cuando fallas, cual era la buena. Solo si aporta algo: en
              "elegir la frase" la buena ES la frase de arriba, y en "que
              significa" es su traduccion, que tambien esta ya. En el hueco es
              una palabra y en ordenar es el orden, y entonces si aporta. */}
          {!juzgada && buena && buena !== p.explica?.de && buena !== p.explica?.es && (
            <div className="es">
              {t('vs.answerIs')}{' '}
              <strong>{tc(buena)}</strong>
            </div>
          )}
          <button className="btn-primary" style={{ marginTop: 14 }} onClick={siguiente}>
            {p.tipo === 'escribir' && i + 1 < preguntas.length
              ? pick('Siguiente', 'Next')
              : (i + 1 < preguntas.length ? t('ueb.siguiente') : t('ueb.terminar'))}
          </button>
        </div>
      )}
      </div>
      {/* El zorro, como en los demás ejercicios: reacciona a cada respuesta y
          se calla mientras está el pie de la corrección, que es donde se le
          montaría el bocadillo. */}
      <FoxOverlay fox={fox} mudo={juzgada !== null} racha={seguidas} />
    </div>
  );
}
