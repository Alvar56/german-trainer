import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import IconoJuego, { conSimbolo } from './IconoJuego.jsx';
import { tc } from '../lib/contenido/index.js';
import { hablarSeguido, pararVoz, hayVozAlemana, alCargarVoces } from '../lib/audio.js';
import { respuestaEnCadena, conversacionDe, seguimientoDe } from '../lib/kursbuch/respuestas.js';
import { t, pick, codigoIdioma } from '../lib/i18n.js';
import BookNav from './BookNav.jsx';
import Dialog from './Dialog.jsx';
import KommAsk from './KommAsk.jsx';
import Cargando from './Cargando.jsx';
import LargoDialogo from './LargoDialogo.jsx';
import { turnosDe, largoGuardado } from '../lib/largoDialogo.js';
import KommPractice, { TIPOS } from './KommPractice.jsx';
import MezclaKomm, { frasesDe } from './MezclaKomm.jsx';
import Desplegable from './Desplegable.jsx';
import { estadisticas as ueStats } from '../lib/uebersetzen.js';
import { getBand, getLektion, KURSBUCH, lektionLabel, lektionKommunikation } from '../lib/kursbuch/index.js';
import { generateDialog } from '../lib/ai.js';
import { guardados, borrarGuardado, otroIdioma } from '../lib/guardados.js';
import { SIN_IA, PORTABLE } from '../lib/modo.js';
import { aiAvailable } from '../lib/settings.js';
import { kommMastery, kommListeningProgress, recordKommEscuchada, recordKommPracticed, kommApartadosFallados, kommFailedQuestions, kommApartadosQueFaltan, UMBRAL_TERMINAR } from '../lib/progress.js';
import CoronaPanel, { BarrasTema } from './ProgresoTema.jsx';
import { GENDER_NIVELES } from '../lib/vocab.js';
import EtiquetaChip from './EtiquetaChip.jsx';
import BotonCopiar from './BotonCopiar.jsx';
import { getStarredItems, useStars } from '../lib/stars.js';
import Tabs from './Tabs.jsx';
import FotosVocab from './FotosVocab.jsx';
import MatchGame from './MatchGame.jsx';
import VocabSummary from './VocabSummary.jsx';
import BlitzGame from './BlitzGame.jsx';
import { paresDeKommunikation } from '../lib/paresJuego.js';
import { aplicarBonoRachaFinal } from '../lib/monedas.js';
import { useExerciseActive } from '../lib/teclas.js';

function EscucharConversacion({ texto, resetKey, onComplete }) {
  const [hay, setHay] = useState(hayVozAlemana);
  const [sonando, setSonando] = useState(false);
  useEffect(() => alCargarVoces(() => setHay(hayVozAlemana())), []);
  useEffect(() => {
    setSonando(false);
    pararVoz();
    return () => pararVoz();
  }, [resetKey]);
  if (!hay || !texto) return null;
  return (
    <button
      className="btn-primary btn-sm komm-listen-conv"
      onClick={() => {
        if (sonando) {
          pararVoz();
          setSonando(false);
          return;
        }
        setSonando(hablarSeguido(texto.split(/\n+/), {
          onFin: () => {
            setSonando(false);
            onComplete?.();
          }
        }));
      }}
    >
      <span className="komm-label-desktop">{sonando ? t('dlg.stop') : t('komm.listenConv')}</span>
      <span className="komm-label-mobile">{sonando ? t('dlg.stop') : pick('🔊 Escuchar', '🔊 Listen')}</span>
    </button>
  );
}

// Los tipos de pregunta que se pueden practicar sueltos.
const TIPOS_EJERCICIO = [
  // De mas facil a mas dificil, igual que en Gramatica y Vocabulario:
  // reconocer primero, reconstruir despues y escribir al final.
  //
  // Las dos direcciones en un solo boton. Eran dos ("Elegir la frase" y "¿Que
  // significa?") y cada uno sacaba 10 preguntas de las mismas 80 frases, asi
  // que por separado se repetian el doble de rapido. Juntos, una tanda mezcla
  // ir y volver sin que haya que escribir una frase mas.
  { id: 'decir', emoji: '✅', tipos: ['decir', 'significado'],
    es: 'Elegir la frase', en: 'Pick the phrase',
    subEs: 'Del castellano al alemán y al revés', subEn: 'From your language into German and back' },
  { id: 'responder', emoji: '🗣️', tipos: ['contestar', 'entender'],
    es: 'Contestar', en: 'Reply',
    subEs: 'Qué dices y qué te dicen', subEn: 'What you say and what they say' },
  // Estos dos no son tipos de pregunta: son juegos enteros, los mismos que
  // Vocabulario, con las frases de la leccion en vez de con palabras. Por eso
  // llevan `juego` en vez de `tipos`.
  { id: 'match', emoji: '🧩', juego: 'match',
    es: 'Emparejar', en: 'Match',
    subEs: 'Seis frases con lo que significan', subEn: 'Six phrases with their meaning' },
  { id: 'blitz', emoji: '⚡', juego: 'blitz',
    es: 'Blitz', en: 'Blitz',
    subEs: 'Diez aciertos en 40 segundos', subEn: 'Ten right in 40 seconds' },
  { id: 'ordenar', emoji: '🔀', tipos: ['ordenar'],
    es: 'Ordenar la frase', en: 'Put it in order',
    subEs: 'Coloca las palabras', subEn: 'Put the words in order' },
  { id: 'hueco', emoji: '📝', tipos: ['hueco'],
    es: 'La palabra que falta', en: 'The missing word',
    subEs: 'Completa el hueco, a mano', subEn: 'Fill in the blank, by hand' }
];

function difuminarVistaEjercicio() {
  const main = document.querySelector('.main');
  if (!main) return;
  main.classList.remove('main-motion-fade', 'main-motion-forward', 'main-motion-backward');
  void main.offsetWidth;
  main.classList.add('main-motion-fade');
}

function claveResumenKomm(lektionId) {
  return `komm:final:${lektionId}`;
}

function leerResumenKomm(lektionId) {
  try {
    return lektionId && typeof sessionStorage !== 'undefined'
      ? JSON.parse(sessionStorage.getItem(claveResumenKomm(lektionId)) || 'null')
      : null;
  } catch {
    return null;
  }
}

function guardarResumenKomm(lektionId, resumen) {
  try {
    if (!lektionId || typeof sessionStorage === 'undefined') return;
    const key = claveResumenKomm(lektionId);
    if (resumen) sessionStorage.setItem(key, JSON.stringify(resumen));
    else sessionStorage.removeItem(key);
  } catch {
    // El resumen sigue funcionando aunque el navegador bloquee sessionStorage.
  }
}

function idMezclaKomm(bandIds) {
  return bandIds.length ? 'mix:' + bandIds.join('|') : 'mix';
}

function leerMezclaFinal() {
  try {
    if (typeof sessionStorage === 'undefined') return null;
    const guardado = sessionStorage.getItem('komm:mix:final');
    if (!guardado) return null;
    let config;
    try {
      config = JSON.parse(guardado);
    } catch {
      // Compatibilidad con la versión anterior, que guardaba solo el tomo.
      config = { bandIds: guardado.split('|'), difficultyIds: [] };
    }
    const bandIds = Array.isArray(config?.bandIds) ? config.bandIds : [];
    const difficultyIds = Array.isArray(config?.difficultyIds) ? config.difficultyIds : [];
    return leerResumenKomm(idMezclaKomm(bandIds))?.tipo === 'practice'
      ? { bandIds, difficultyIds }
      : null;
  } catch {
    return null;
  }
}

function guardarMezclaFinal(config) {
  try {
    if (typeof sessionStorage === 'undefined') return;
    if (config) sessionStorage.setItem('komm:mix:final', JSON.stringify(config));
    else sessionStorage.removeItem('komm:mix:final');
  } catch {
    // La mezcla se puede seguir usando aunque el navegador bloquee el guardado.
  }
}

export default function Kommunikation({ lektionId, tab, onTab, onOpen, onBack, onTraducir, onReto, dialog, busy, setDialog, setBusy }) {
  const activa = useExerciseActive();
  // El tomo que se está practicando mezclado, o 'todo'. null = no hay mezcla en
  // marcha y se ve la lista de lecciones.
  const [mezcla, setMezcla] = useState(() => (lektionId ? null : leerMezclaFinal()));
  const mezclaBandIds = mezcla?.bandIds || [];
  const mezclaLektionId = mezcla ? idMezclaKomm(mezclaBandIds) : null;
  const mezclaFinalGuardada = Boolean(
    mezcla && leerResumenKomm(mezclaLektionId)?.resumen?.fin
  );

  useLayoutEffect(() => {
    if (!activa) {
      document.body.classList.remove('en-ejercicio');
      return;
    }
    if (mezcla === null) return;
    if (mezclaFinalGuardada) {
      document.body.classList.remove('en-ejercicio');
      return;
    }
    window.scrollTo(0, 0);
    document.querySelector('.main')?.scrollTo(0, 0);
    document.querySelector('.sidebar')?.scrollTo(0, 0);
    document.body.classList.add('en-ejercicio');
    return () => document.body.classList.remove('en-ejercicio');
  }, [activa, mezclaBandIds.join('|'), mezcla?.difficultyIds?.join('|'), mezclaFinalGuardada]);

  if (mezcla !== null) {
    return <KommMezclada bandIds={mezclaBandIds} difficultyIds={mezcla.difficultyIds || []} onSalir={() => {
      guardarResumenKomm(mezclaLektionId, null);
      guardarMezclaFinal(null);
      difuminarVistaEjercicio();
      setMezcla(null);
    }} />;
  }

  if (!lektionId) {
    return (
      <BookNav
        title="Kommunikation"
        subtitle={t(SIN_IA ? 'komm.subSinIA' : 'komm.sub', { libro: KURSBUCH.title })}
        count={(l) => l.kommunikation.length}
        unit={[t('function'), t('functions')]}
        onOpen={(l) => onOpen(l.id)}
        progressKey="kommunikation"
        extra={
          <>
            {onTraducir && <TarjetaTraducir onTraducir={onTraducir} />}
            <KommAsk niveau="A2" />
            {/* Al final del todo, como la mezcla de vocabulario: primero las
                lecciones, y cuando ya las conoces, mezclarlas. */}
            <MezclaKomm onMezcla={(config) => { difuminarVistaEjercicio(); setMezcla(config); }} />
          </>
        }
      />
    );
  }
  return (
    <KommDetail
      key={lektionId}
      lektionId={lektionId}
      tab={tab}
      onTab={onTab}
      onReto={onReto}
      onBack={onBack}
      dialog={dialog}
      busy={busy}
      setDialog={setDialog}
      setBusy={setBusy}
      activa={activa}
    />
  );
}

// La tanda mezclada: diez preguntas con frases de todo el libro (o de un tomo).
//
// Se monta una "función" de mentira con diez frases al azar y se le pasa a la
// misma pantalla de práctica que usan las lecciones: los ejercicios, el
// recuento y las monedas ya están ahí, y así no hay dos sitios donde arreglar
// lo mismo. Lo único que no hace es marcar apartados como hechos —no es de
// ninguna función en concreto—, pero cuenta como sesión igual que el resto.
function KommMezclada({ bandIds, difficultyIds, onSalir }) {
  const todas = useMemo(() => frasesDe(bandIds), [bandIds.join('|')]);
  const lektionId = idMezclaKomm(bandIds);
  const guardado = leerResumenKomm(lektionId);
  const tiposMezcla = difficultyIds.includes('easy') && !difficultyIds.includes('hard')
    ? TIPOS.filter((tipo) => tipo !== 'hueco')
    : TIPOS;
  const funktion = useMemo(() => {
    const barajadas = [...todas].sort(() => Math.random() - 0.5);
    return { funktion: t('komm.mixName'), wendungen: barajadas.slice(0, 10) };
  }, [todas]);

  if (todas.length < 4) return null;

  return (
    <KommPractice
      mezcla
      lektionId={lektionId}
      mixBandNames={bandIds.map((id) => getBand(id)?.name).filter(Boolean)}
      mixDifficultyIds={difficultyIds}
      tipos={tiposMezcla}
      funktion={funktion}
      todasLasFrases={todas.map((w) => w.de)}
      todasLasGlosas={todas.map((w) => w.es)}
      todasLasRespuestas={todas.map((w) => respuestaEnCadena(w.de)?.de).filter(Boolean)}
      resumenGuardado={guardado?.tipo === 'practice' ? guardado.resumen : null}
      onGuardarResumen={(resumen) => {
        guardarResumenKomm(lektionId, { tipo: 'practice', resumen });
        guardarMezclaFinal({ bandIds, difficultyIds });
      }}
      onLimpiarResumen={() => {
        guardarResumenKomm(lektionId, null);
        guardarMezclaFinal(null);
      }}
      onSalir={onSalir}
    />
  );
}

function TarjetaTraducir({ onTraducir }) {
  const [dir, setDir] = useState('mix');
  const [nivel, setNivel] = useState('all');
  const st = ueStats({ nivel });
  
  return (
    <div className="juego-seccion">
      <button
        className={'gender-cta' + (st.pct >= 100 ? ' dominado' : '')}
        onClick={() => onTraducir(null, dir, nivel)}
      >
        <span className="gc-emoji">🔁</span>
        <span style={{ flex: 1 }}>
          <div className="gc-title">{t('ueb.title')}</div>
          <div className="gc-sub">
            {t('ueb.sub', { known: st.sabidas, total: st.total, pct: st.pct, empezadas: st.empezadas })}
          </div>
        </span>
        <span className="chev">›</span>
      </button>

      <div className="gender-niveles">
        <span className="muted" style={{ fontSize: '0.78rem' }}>{t('voc.difficulty')}</span>
        {GENDER_NIVELES.map((n) => (
          <button
            key={n.id}
            className={'ask-chip' + (n.id === nivel ? ' on' : '')}
            onClick={() => setNivel(n.id)}
          >
            <EtiquetaChip largo={pick(n.es, n.en)} corto={pick(n.corto, n.cortoEn)} />
          </button>
        ))}
      </div>

      {/* El 14 de margen que habia aqui escrito a mano sobraba: el aire entre
          las dos filas lo pone el gap de .juego-seccion, igual que en las
          tarjetas de Wortschatz y Grammatik. */}
      <div className="gender-niveles">
        <span className="muted" style={{ fontSize: '0.78rem' }}>{pick('Dirección', 'Direction')}</span>
        <button className={'ask-chip' + (dir === 'mix' ? ' on' : '')} onClick={() => setDir('mix')}>
          {pick('Mixto', 'Mixed')}
        </button>
        <button className={'ask-chip' + (dir === 'es-de' ? ' on' : '')} onClick={() => setDir('es-de')}>
          <EtiquetaChip
            largo={pick('Nativo → Alemán', 'Native → German')}
            corto={codigoIdioma() + ' → DE'}
          />
        </button>
        <button className={'ask-chip' + (dir === 'de-es' ? ' on' : '')} onClick={() => setDir('de-es')}>
          <EtiquetaChip
            largo={pick('Alemán → Nativo', 'German → Native')}
            corto={'DE → ' + codigoIdioma()}
          />
        </button>
      </div>
    </div>
  );
}

function KommDetail({
  lektionId,
  tab: propTab,
  onTab,
  onReto,
  onBack,
  dialog: propDialog,
  busy: propBusy,
  setDialog: propSetDialog,
  setBusy: propSetBusy,
  activa
}) {
  const lektion = getLektion(lektionId);
  const [localBusy, setLocalBusy] = useState(null); // null | 'alles' | índice de la función
  const [err, setErr] = useState('');
  const [open, setOpen] = useState(null);
  const [localTab, setLocalTab] = useState('teoria');
  const tab = propTab || localTab;
  const setTab = (t) => {
    setLocalTab(t);
    onTab?.(t);
  };
  const [localDialog, setLocalDialog] = useState(null);
  // Una conversacion guardada se abre desde una lista por la que estabas
  // navegando: ni sube arriba al abrirla ni te deja en el principio al volver.
  const [desdeGuardada, setDesdeGuardada] = useState(false);
  const scrollLeccion = React.useRef(null);
  const [lastFocus, setLastFocus] = useState(null);
  const [resumenGuardado, setResumenGuardado] = useState(() => leerResumenKomm(lektionId));
  const [practica, setPractica] = useState(() =>
    resumenGuardado?.tipo === 'practice' ? resumenGuardado.config : null
  );   // la función que estás practicando
  const [juego, setJuego] = useState(null);         // 'match' | 'blitz', que son juegos enteros
  const [cartasFijasJuego, setCartasFijasJuego] = useState(null);
  // El resultado de esa partida, para enseñar el resumen al acabar en vez de
  // devolverte a los ejercicios sin decirte nada.
  const [resumenJuego, setResumenJuego] = useState(() =>
    resumenGuardado?.tipo === 'game' ? resumenGuardado.data : null
  );
  const [volverAListaDeEjercicios, setVolverAListaDeEjercicios] = useState(false);
  const limpiarResumen = () => {
    guardarResumenKomm(lektionId, null);
    setResumenGuardado(null);
  };
  const guardarFinal = (resumen) => {
    guardarResumenKomm(lektionId, resumen);
    setResumenGuardado(resumen);
  };
  const abrirPractica = (config) => {
    limpiarResumen();
    difuminarVistaEjercicio();
    setResumenJuego(null);
    setPractica(config);
  };
  const salirPractica = () => {
    limpiarResumen();
    difuminarVistaEjercicio();
    setVolverAListaDeEjercicios(true);
    setPractica(null);
  };
  const abrirJuego = (cual) => {
    limpiarResumen();
    difuminarVistaEjercicio();
    setResumenJuego(null);
    setCartasFijasJuego(null);
    setJuego(cual);
  };
  useLayoutEffect(() => {
    if (!activa) {
      document.body.classList.remove('en-ejercicio');
      return;
    }
    const practicaTerminada = resumenGuardado?.tipo === 'practice' && resumenGuardado.resumen?.fin;
    if ((!practica && !juego) || practicaTerminada) {
      document.body.classList.remove('en-ejercicio');
      return;
    }
    window.scrollTo(0, 0);
    document.querySelector('.main')?.scrollTo(0, 0);
    document.querySelector('.sidebar')?.scrollTo(0, 0);
    document.body.classList.add('en-ejercicio');
    return () => document.body.classList.remove('en-ejercicio');
  }, [activa, Boolean(practica), Boolean(juego), resumenGuardado?.tipo, Boolean(resumenGuardado?.resumen?.fin)]);
  useLayoutEffect(() => {
    if (!volverAListaDeEjercicios || practica || juego || resumenJuego) return;
    window.scrollTo(0, 0);
    document.querySelector('.main')?.scrollTo(0, 0);
    setVolverAListaDeEjercicios(false);
  }, [volverAListaDeEjercicios, Boolean(practica), Boolean(juego), Boolean(resumenJuego)]);
  // Sube al terminar una práctica, para repintar las marcas sin recargar.
  const [vuelta, setVuelta] = useState(0);
  const [misKonv, setMisKonv] = useState(() => guardados('konversation'));
  
  const dialog = propDialog !== undefined ? propDialog : localDialog;
  const setDialog = propSetDialog || setLocalDialog;

  // La vuelta al sitio se hace aquí y no en el onBack: al pulsar "volver" la
  // lección todavía no está montada, mide menos que la pantalla y el navegador
  // recorta el scroll a 0.
  //
  // useLayoutEffect y no useEffect con requestAnimationFrame: rAF no se ejecuta
  // en una pestaña que no está a la vista, así que la vuelta se quedaba sin
  // hacer si te ibas a otra pestaña. Es la misma razón por la que App.jsx usa
  // useLayoutEffect para su memoria de scroll.
  React.useLayoutEffect(() => {
    if (dialog || !desdeGuardada) return;
    const y = scrollLeccion.current;
    setDesdeGuardada(false);
    if (y != null) window.scrollTo(0, y);
  }, [dialog, desdeGuardada]);
  // En que idioma se genero la conversacion que estas mirando, si la has
  // abierto de las guardadas. null = la acabas de pedir, o sea tu idioma.
  const [abiertaLang, setAbiertaLang] = useState(null);
  const [reveladas, setReveladas] = useState(() => new Set());
  function toggleRevelada(id) {
    setReveladas((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }
  const busy = propBusy !== undefined ? propBusy : localBusy;
  const setBusy = propSetBusy || setLocalBusy;
  
  const aiOn = aiAvailable();
  useStars();
  const allStarredKomm = getStarredItems('komm');
  const starredKomm = allStarredKomm.filter((i) => {
    if (!lektion) return false;
    if (i.lektionId === lektion.id) return true;
    if (i.lektionId && (i.lektionId === `kb-${lektion.id}` || lektion.id === `kb-${i.lektionId}`)) return true;
    if (String(i.id).includes(`:${lektion.id}:`) || String(i.id).startsWith(`komm:${lektion.id}:`)) return true;
    return false;
  });
  // Las frases del libro, con la glosa ya en el idioma de la interfaz.
  const funktionen = useMemo(() => lektionKommunikation(lektion), [lektion]);
  const todasLasFrases = useMemo(() =>
    funktionen.flatMap((x) =>
      (x.wendungen || []).flatMap((w) => [w.de, ...seguimientoDe(w.de).map((y) => y.de)])
    ),
    [funktionen]
  );
  const todasLasRespuestas = useMemo(() =>
    funktionen.flatMap((x) =>
      // Los turnos de dentro tambien cuentan: son los despistes de Contestar, y
      // con solo las respuestas de las aperturas no llegaban a dos.
      (x.wendungen || []).flatMap((w) => [w.de, ...seguimientoDe(w.de).map((y) => y.de)])
        .map((de) => respuestaEnCadena(de)?.de)
        .filter(Boolean)
    ),
    [funktionen]
  );
  const todasLasGlosas = useMemo(() =>
    funktionen.flatMap((x) =>
      (x.wendungen || []).flatMap((w) => [w.es, ...seguimientoDe(w.de).map((y) => y.es)])
    ),
    [funktionen]
  );
  const km = lektion ? kommMastery(lektion.id, lektion.kommunikation) : null;
  const escuchadas = lektion ? kommListeningProgress(lektion.id, lektion.kommunikation) : null;
  if (km && km.pct >= 100) {
  }
  // Lo que se te ha resistido y lo que te falta para el 100%, por apartado.
  const kFallados = lektion ? kommApartadosFallados(lektion.id, lektion.kommunikation) : [];
  const kPreguntasFalladas = lektion ? kommFailedQuestions(lektion.id) : [];
  const kFalladosSinPreguntaGuardada = kFallados.filter((apartado) =>
    !kPreguntasFalladas.some((pregunta) => pregunta.seccion === apartado.funktion)
  );
  const cantidadFallosRepasables = kPreguntasFalladas.length + kFalladosSinPreguntaGuardada.length;
  const kFaltan = lektion ? kommApartadosQueFaltan(lektion.id, lektion.kommunikation) : [];
  // Una "función" de mentira con TODAS las frases de la lección: es lo que
  // practican los tipos de ejercicio de la pestaña de al lado.
  const todaLaLeccion = useMemo(() => ({
    funktion: lektion ? lektionLabel(lektion) : '',
    // Cada frase se lleva puesto de qué apartado salió: así una tanda de la
    // pestaña de ejercicios puede marcar como hechos los apartados que hayas
    // sacado limpios, en vez de no contar para nada.
    wendungen: funktionen.flatMap((x) =>
      (x.wendungen || []).map((w) => ({ ...w, seccion: x.funktion }))
    )
  }), [lektion, funktionen]);
  const hecho = escuchadas?.hechas || {};

  // Una tanda con las frases de UNOS apartados concretos: los fallados o los
  // que faltan. Misma forma que `todaLaLeccion`, para que KommPractice pueda
  // seguir apuntando cada acierto a su apartado.
  function tandaDe(apartados, nombre, finishTopic = false) {
    return {
      funktion: nombre,
      ...(finishTopic ? { finishTopic: true, apartados } : {}),
      wendungen: apartados.flatMap((x) =>
        (x.wendungen || []).map((w) => ({ ...w, seccion: x.funktion }))
      )
    };
  }

  // El apartado entero en alemán y de corrido: cada frase del libro con lo que
  // te contestan y la vuelta que sigue. Es exactamente lo que se ve en las
  // burbujas, sin las traducciones, para pegarlo en un lector de voz.
  // Las frases de un apartado, agrupadas en conversaciones.
  //
  // Por defecto cada frase abre la suya: frase, respuesta, y a otra cosa. Eso
  // se lee como una lista de pares sueltos, que no es como habla nadie. Una
  // frase marcada con `sigue` no abre conversacion nueva: se engancha a la
  // anterior, y las dos (o las cuatro) se pintan como un dialogo seguido.
  //
  // No se anade ni se quita nada: son las mismas frases, cada una con su
  // respuesta, y cada una sigue siendo su propio ejercicio. Lo unico que
  // cambia es donde se corta.
  function conversacionesDe(k) {
    const grupos = [];
    (k.wendungen || []).forEach((w, wi) => {
      if (w.sigue && grupos.length) grupos[grupos.length - 1].push({ w, wi });
      else grupos.push([{ w, wi }]);
    });
    return grupos;
  }

  function textoApartado(k) {
    const lineas = [];
    for (const w of k.wendungen || []) {
      lineas.push(w.de);
      for (const turno of conversacionDe(w.de)) lineas.push(turno.de);
      lineas.push('');
    }
    return lineas.join('\n').trim();
  }

  // Las que escribe la IA llevan su propio botón dentro de Dialog.jsx.

  if (!lektion) {
    return (
      <div className="card center stack">
        <p>{t('notFound')}</p>
        <button className="btn-ghost" onClick={onBack}>{t('back')}</button>
      </div>
    );
  }

  // `largo` fijo para la conversación de UNA función: son tres frases y no hay
  // nada que preguntar, sale corta y ya está. La de la lección entera sí usa
  // el largo que hayas elegido.
  async function makeDialog(funktion, key, largo) {
    setErr('');
    setBusy(key);
    setLastFocus(funktion);
    try {
      const d = await generateDialog({ lektion, funktion, turns: turnosDe(largo || largoGuardado()) });
      setAbiertaLang(null);
      setDialog(d);
    } catch (e) {
      setErr(e.message);
    } finally {
      setBusy(null);
    }
  }

  // Emparejar y Blitz son juegos completos, no una tanda de preguntas, asi
  // que salen por su lado. El progreso va al mismo sitio que el resto de
  // Kommunikation: al apartado del que sea la frase.
  if (juego) {
    const pares = paresDeKommunikation(lektion);
    const ctx = {
      id: 'komm:' + lektion.id,
      nombre: lektionLabel(lektion),
      emoji: '💬',
      pct: () => km?.pct ?? null
    };
    const apuntar = (de, ok) => {
      const par = pares.find((x) => x.de === de);
      // Guardar también los fallos de Match y Blitz. El resumen podía enseñar
      // las frases falladas, pero al volver a la lección el botón de repaso
      // solo miraba kommPracticed y por eso aparecía desactivado.
      if (par?.funktion) recordKommPracticed(lektion.id, par.funktion, ok ? 1 : 0, 1);
    };
    const salir = () => { difuminarVistaEjercicio(); setJuego(null); setVuelta((v) => v + 1); };
    const acabar = (data) => {
      difuminarVistaEjercicio();
      setVuelta((v) => v + 1);
      // `cual` se guarda con el resultado porque al salir del juego se pierde
      // `juego`, y "Otra ronda" necesita saber cual volver a abrir.
      const resumen = aplicarBonoRachaFinal({ ...data, cual: juego, volverA: 'tema', deck: { id: ctx.id, emoji: ctx.emoji, name: ctx.nombre } });
      setResumenJuego(resumen);
      guardarFinal({ tipo: 'game', data: resumen });
      setJuego(null);
    };
    return juego === 'match' ? (
      <MatchGame pares={pares} cartasFijas={cartasFijasJuego} apuntar={apuntar} contexto={ctx} onExit={salir} onFinish={acabar} />
    ) : (
      // 40 segundos: aqui la pregunta es una frase, con +2s por acierto y -2s por fallo.
      <BlitzGame cartas={pares} cartasFijas={cartasFijasJuego} apuntar={apuntar} contexto={ctx} segundos={40} bono={2} onExit={salir} onFinish={acabar} />
    );
  }

  if (resumenJuego) {
    const volver = () => {
      limpiarResumen();
      difuminarVistaEjercicio();
      setVolverAListaDeEjercicios(true);
      setResumenJuego(null);
    };
    const otraRonda = () => {
      const cual = resumenJuego.cual;
      limpiarResumen();
      difuminarVistaEjercicio();
      setResumenJuego(null);
      setCartasFijasJuego(null);
      setJuego(cual);
    };
    const repetirFallos = () => {
      const fallidas = resumenJuego.missed || [];
      if (!fallidas.length) return;
      const cual = resumenJuego.cual;
      limpiarResumen();
      difuminarVistaEjercicio();
      setResumenJuego(null);
      setCartasFijasJuego(fallidas);
      setJuego(cual);
    };
    return (
      <VocabSummary
        data={resumenJuego}
        onRepeat={otraRonda}
        onRepetirFallos={resumenJuego.missed?.length ? repetirFallos : null}
        onDeck={volver}
      />
    );
  }

  if (practica) {
    return (
      // Los despistes salen de toda la leccion, turnos de seguimiento
      // incluidos: son frases que tambien has leido.
      <KommPractice
        key={`${practica.reviewMistakes ? 'fallos' : practica.reviewMarked ? 'marcados' : 'practica'}:${practica.funktion?.funktion || practica.funktion || ''}`}
        lektionId={lektion.id}
        nombreTema={lektionLabel(lektion)}
        funktion={practica.funktion}
        tipos={practica.tipos}
        gameId={practica.gameId || 'komm'}
        itemsFijos={practica.itemsFijos}
        reviewMistakes={practica.reviewMistakes}
        reviewSections={practica.reviewSections}
        reviewMarked={practica.reviewMarked}
        mezcla={practica.mezcla}
        todasLasFrases={todasLasFrases}
        todasLasRespuestas={todasLasRespuestas}
        todasLasGlosas={todasLasGlosas}
        resumenGuardado={!practica.reviewMistakes && !practica.reviewMarked && resumenGuardado?.tipo === 'practice' ? resumenGuardado.resumen : null}
        onGuardarResumen={(resumen) => guardarFinal({ tipo: 'practice', config: practica, resumen })}
        onLimpiarResumen={limpiarResumen}
        onHecho={() => setVuelta((v) => v + 1)}
        onSalir={salirPractica}
      />
    );
  }



  if (dialog) {
    return (
      <Dialog
        dialog={dialog}
        lektion={lektion}
        busy={busy !== null}
        onContestadas={() => {
          if (lastFocus?.funktion) {
            recordKommPracticed(lektion.id, lastFocus.funktion);
            setVuelta((v) => v + 1);
          }
        }}
        otroIdioma={otroIdioma({ lang: abiertaLang })}
        desdeGuardada={desdeGuardada}
        onBack={() => {
          setAbiertaLang(null);
          setDialog(null);
        }}
        onRegenerate={() => makeDialog(lastFocus, 'regen')}
        onGuardado={() => setMisKonv(guardados('konversation'))}
      />
    );
  }

  return (
    <div>
      {/* Misma cabecera y mismas pestañas que una lección de Wortschatz o de
          Grammatik: el título con el botón de volver a la derecha, la barra de
          lo que llevas hecho, y Teoría / Ejercicios. */}
      <div className="topbar">
        <div className="min0">
          <h1><button type="button" className="titulo-volver" onClick={onBack}>{lektionLabel(lektion)}</button></h1>
          <p className="muted" style={{ marginTop: 4, fontSize: '0.9rem' }}>
            {lektion.bandName} · {lektion.kommunikation.length} {t('functions')}
            {escuchadas && escuchadas.total > 0 && ` · ${escuchadas.completadas}/${escuchadas.total} ${t('komm.hechas')} (${escuchadas.pct}%)`}
          </p>
        </div>
        <button className="link-btn" onClick={onBack} style={{ flexShrink: 0 }}>
          <span className="fl-atras">◂</span> Kommunikation
        </button>
      </div>

      <BarrasTema topicId={'komm:' + lektion.id} pct={km?.pct || 0} />

      <Tabs>
        <button className={'tab' + (tab === 'teoria' ? ' active' : '')} onClick={() => setTab('teoria')}>
          {conSimbolo(t('gr.theory'))}
        </button>
        <button className={'tab' + (tab === 'ejercicios' ? ' active' : '')} onClick={() => setTab('ejercicios')}>
          {conSimbolo(t('gr.exercises'))}
        </button>
        {!PORTABLE && (
          <button className={'tab' + (tab === 'fotos' ? ' active' : '')} onClick={() => setTab('fotos')}>
            {conSimbolo('📸 ' + pick('Fotos', 'Photos'))}
          </button>
        )}
      </Tabs>

      {tab === 'teoria' && (
      <div className="stack">

      {/* Aquí había dos ajustes: un botón para tapar las glosas y el largo de
          la conversación. Los dos se han ido.

          El de las glosas, porque no hacía falta: la traducción ya está tapada
          siempre y aparece al pasar el ratón por la burbuja. Con un botón que
          las enseña todas y el ratón que enseña la que miras, el botón sobra.

          El del largo, porque se ha bajado al pie, junto al único sitio donde
          se pide una conversación. Arriba pedía una decisión antes de que
          hiciera falta, y encima para funciones de tres frases. */}

      {/* Las conversaciones que has guardado de esta leccion. Se vuelven a
          abrir sin gastar IA: la conversacion entera esta guardada. */}
      {misKonv.filter((k) => k.lektionId === lektion.id).length > 0 && (
        <div className="guardados">
          <div className="guardados-tit">
            {t('save.mineConv', { n: misKonv.filter((k) => k.lektionId === lektion.id).length })}
          </div>
          <div className="guardados-lista">
            {misKonv
              .filter((k) => k.lektionId === lektion.id)
              .map((k) => (
                <span className="guardado-chip" key={k.id}>
                  <button
                    className="gc-abrir"
                    onClick={() => {
                      // Dónde estabas leyendo, para devolverte ahí al cerrar.
                      scrollLeccion.current = window.scrollY;
                      setDesdeGuardada(true);
                      setAbiertaLang(k.lang || null);
                      setDialog(k.dialog);
                    }}
                    title={k.titel}
                  >
                    {k.titel}
                  </button>
                  <button
                    className="gc-quitar"
                    title={t('save.remove')}
                    onClick={() => {
                      borrarGuardado('konversation', k.id);
                      setMisKonv(guardados('konversation'));
                    }}
                  >
                    ✕
                  </button>
                </span>
              ))}
          </div>
        </div>
      )}

      {funktionen.map((k, i) => (
        <div className={'card' + (open === i ? ' abierta' : '')} key={i} style={{ padding: 0, overflow: 'hidden' }}>
          <button className="komm-head" onClick={() => setOpen(open === i ? null : i)} style={{ padding: 12 }}>
            <span className="lk-block-title" style={{ margin: 0 }}>
              {k.funktion}
              {k.es && <div className="muted" style={{ fontSize: '0.8rem', fontWeight: 'normal', marginTop: 2 }}>{tc(k.es)}</div>}
            </span>
            {/* En una columna estrecha esto partia por el ultimo espacio y la
                flecha se caia sola a la linea de abajo. La clase la mantiene
                entera; quien encoge es el titulo. */}
            <span className="komm-cuenta">
              {hecho[k.funktion] && <span className="pill completo komm-tick-entrada">✓</span>}
              <span>{t('komm.conversation')} {open === i ? '▴' : '▾'}</span>
            </span>
          </button>
          <Desplegable abierto={open === i}>
            <div style={{ padding: '0 12px 12px' }}>
              {/* Las frases, con la misma pinta que las conversaciones que
                  escribe la IA: la del libro a la izquierda y lo que te pueden
                  contestar a la derecha. Se ve de un vistazo quién dice qué, y
                  la sección entera va a juego. */}
              <div className="komm-chat">
                {conversacionesDe(k).map((grupo, gi) => (
                  <div className="kc-par" key={gi}>
                    {grupo.map(({ w, wi }) => {
                  // La conversacion entera: lo que te contestan y, si la hay,
                  // la vuelta que sigue. Una frase suelta no se usa sola: se
                  // usa porque alguien contesta y tu sigues.
                  const turnos = conversacionDe(w.de);
                  const bubbleKeyA = `${i}-${wi}-a`;
                  const revA = reveladas.has(bubbleKeyA);
                  return (
                    <React.Fragment key={wi}>
                      <div className="dlg-turn a">
                        <div
                          className={'dlg-bubble' + (revA ? ' revelada' : '')}
                          onClick={() => toggleRevelada(bubbleKeyA)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault();
                              toggleRevelada(bubbleKeyA);
                            }
                          }}
                        >
                          <p className="dlg-de">
                            {w.de}
                          </p>
                          <p className="dlg-es"><span>{tc(w.es)}</span></p>
                        </div>
                      </div>
                      {turnos.map((turno, ti) => {
                        const bubbleKeyB = `${i}-${wi}-t-${ti}`;
                        const revB = reveladas.has(bubbleKeyB);
                        return (
                          <div className={'dlg-turn ' + (turno.quien === 'tu' ? 'a' : 'b')} key={ti}>
                            <div
                              className={'dlg-bubble' + (revB ? ' revelada' : '')}
                              onClick={() => toggleRevelada(bubbleKeyB)}
                              role="button"
                              tabIndex={0}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  toggleRevelada(bubbleKeyB);
                                }
                              }}
                            >
                              <p className="dlg-de">
                                {turno.de}
                              </p>
                              <p className="dlg-es"><span>{tc(turno.es)}</span></p>
                            </div>
                          </div>
                        );
                      })}
                    </React.Fragment>
                  );
                    })}
                  </div>
                ))}
              </div>
              <div className="row komm-chat-acciones" style={{ gap: 10, flexWrap: 'wrap' }}>
                <EscucharConversacion
                  texto={textoApartado(k)}
                  resetKey={`${tab}-${open}`}
                  onComplete={() => {
                    recordKommEscuchada(lektion.id, k.funktion);
                    setVuelta((v) => v + 1);
                  }}
                />
                {!SIN_IA && (
                  <button
                    className="btn-ghost btn-sm komm-gen-conv"
                    onClick={() => makeDialog(k, i, 'corta')}
                    disabled={!aiOn || busy !== null}
                  >
                    {busy === i ? t('generating') : t('komm.convThis')}
                  </button>
                )}
                {/* La conversación entera, por si se quiere guardar o escuchar
                    fuera de la aplicación. */}
                <BotonCopiar
                  className="btn-ghost btn-sm komm-copy-conv"
                  texto={() => textoApartado(k)}
                  etiqueta={(
                    <>
                      <span className="komm-label-desktop">{t('komm.copyConv')}</span>
                      <span className="komm-label-mobile">📋 {pick('Copiar', 'Copy')}</span>
                    </>
                  )}
                />
              </div>
              {busy === i && (
                <div style={{ marginTop: 14 }}>
                  <Cargando
                    icono="💬"
                    titulo={t('wait.dlgTitle')}
                    pasos={[t('wait.dlg1'), t('wait.dlg2'), t('wait.dlg3'), t('wait.dlg4')]}
                  />
                </div>
              )}
            </div>
          </Desplegable>
        </div>
      ))}

        <button
          className="btn-primary"
          style={{ alignSelf: 'flex-start' }}
          onClick={() => setTab('ejercicios')}
        >
          {t('gr.toExercises')}
        </button>
      </div>
      )}

      {tab === 'ejercicios' && (
      <div className="stack">
        {/* Los TIPOS de pregunta, sobre las frases de toda la lección: igual
            que en Wortschatz se elige el juego y en Grammatik el tipo de
            ejercicio. Practicar un apartado suelto está en Teoría, que es
            donde lo acabas de leer. */}
        <div className="panel">
          <h2 style={{ margin: '0 0 14px' }}>{t('gr.practise')}</h2>
          <div className="gametype-label">{t('gr.pickGame')}</div>
          <div className="gametype-grid">
            {TIPOS_EJERCICIO.map((j) => (
              <button
                className="gametype"
                key={j.id}
                onClick={() => j.juego
                  ? abrirJuego(j.juego)
                  : abrirPractica({ funktion: todaLaLeccion, tipos: j.tipos, gameId: `komm:${j.id}`, mezcla: true, volverA: 'ejercicios' })}
              >
                <IconoJuego e={j.emoji} />
                <span className="gt-txt">
                  <span>{pick(j.es, j.en)}</span>
                  <small>{pick(j.subEs, j.subEn)}</small>
                </span>
              </button>
            ))}
          </div>
          <p className="muted" style={{ fontSize: '0.78rem', marginTop: 12 }}>
            {aiOn ? t('komm.source') : t('komm.sourceOff')}
          </p>

          {/* Los dos de siempre, que aquí faltaban: repasar lo fallado y
              rematar lo que queda. Como el progreso de Kommunikation va por
              apartado y no frase a frase, lo que vuelve es el apartado. */}
          <div className="btn-row" style={{ marginTop: 12 }}>
            {starredKomm.length > 0 && (
              <button
                className="btn-ghost btn-sm"
                onClick={() =>
                  abrirPractica({
                    funktion: todaLaLeccion,
                    itemsFijos: starredKomm,
                    reviewMarked: true,
                    gameId: 'komm:marked',
                    mezcla: true,
                    volverA: 'ejercicios'
                  })
                }
              >
                {conSimbolo(t('star.review', { n: starredKomm.length }))}
              </button>
            )}
            {cantidadFallosRepasables > 0 && (
              <button
                className="btn-ghost btn-sm"
                onClick={() =>
                  abrirPractica({
                    funktion: tandaDe(kFalladosSinPreguntaGuardada, t('gr.reviewWeak')),
                    reviewMistakes: true,
                    gameId: 'komm:review',
                    reviewSections: kFalladosSinPreguntaGuardada,
                    mezcla: true,
                    volverA: 'ejercicios'
                  })
                }
                title={t('gr.reviewWeakHint')}
              >
                {conSimbolo(t('gr.reviewWeakN', { n: cantidadFallosRepasables }))}
              </button>
            )}
            {kFaltan.length > 0 && (
              <button
                className="btn-ghost btn-sm"
                onClick={() =>
                  abrirPractica({
                    funktion: tandaDe(kFaltan, t('voc.finish', { n: kFaltan.length }), true),
                    gameId: 'komm:finish',
                    mezcla: true,
                    volverA: 'ejercicios'
                  })
                }
                disabled={(km?.pct || 0) < UMBRAL_TERMINAR}
                title={(km?.pct || 0) < UMBRAL_TERMINAR
                  ? t('voc.finishLockedHint', { p: UMBRAL_TERMINAR })
                  : t('voc.finishHint')}
              >
                {(km?.pct || 0) < UMBRAL_TERMINAR
                  ? conSimbolo(t('voc.finishLocked', { p: UMBRAL_TERMINAR }))
                  : conSimbolo(t('voc.finish', { n: kFaltan.length }))}
              </button>
            )}

            {/* El Reto con IA, que ya tenian Vocabulario y Gramatica. El texto
                de arriba lo nombraba desde hace tiempo ("«Reto con IA» genera
                ejercicios aparte") pero el boton no estaba en ningun sitio. */}
            {aiOn && onReto && (
              <button className="btn-ghost btn-sm" onClick={() => onReto(lektionId)}>
                {conSimbolo(t('gr.aiChallenge'))}
              </button>
            )}
          </div>
        </div>

      {!SIN_IA && (
        <div className="card komm-conv">
          {/* Arriba, el texto y el botón, uno en cada punta como en las demás
              tarjetas de "hazlo todo". El largo va debajo, en fila de opciones
              como la dificultad de los juegos o la dirección de las
              flashcards: es un ajuste, no la acción. */}
          <div className="komm-conv-fila">
            <div>
              <strong>{t('komm.convLesson')}</strong>
              <p className="muted" style={{ fontSize: '0.84rem', marginTop: 3 }}>
                {t('komm.convLessonSub')}
              </p>
            </div>
            <button className="btn-primary" onClick={() => makeDialog(null, 'alles')} disabled={!aiOn || busy !== null}>
              {busy === 'alles' ? t('komm.writing') : t('komm.genConv')}
            </button>
          </div>
          <LargoDialogo disabled={busy !== null} chips />
        </div>
      )}

      {busy === 'alles' && (
        <div style={{ marginTop: 14 }}>
          <Cargando
            icono="💬"
            titulo={t('wait.dlgTitle')}
            pasos={[t('wait.dlg1'), t('wait.dlg2'), t('wait.dlg3'), t('wait.dlg4')]}
          />
        </div>
      )}

      {!SIN_IA && !aiOn && (
        <p className="muted" style={{ fontSize: '0.83rem' }}>
          {t('komm.offConv')}
        </p>
      )}
      {err && <p style={{ color: 'var(--bad)', fontSize: '0.85rem' }}>{err}</p>}
      {km?.pct >= 100 && (
        <div style={{ marginTop: 20 }}>
          <CoronaPanel topicId={'komm:' + lektion.id} pct={km.pct} />
        </div>
      )}
      </div>
      )}

      {!PORTABLE && tab === 'fotos' && (
        <FotosVocab ownerId={`komm:${lektion.id}`} nombre={lektionLabel(lektion)} />
      )}
    </div>
  );
}
