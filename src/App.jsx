import React, { lazy, Suspense, useEffect, useRef, useState, useLayoutEffect } from 'react';
import { AppErrorBoundary } from './components/AppErrorBoundary.jsx';
import Sidebar from './components/Sidebar.jsx';
import Monedero from './components/Monedero.jsx';
const MazoConIA = lazy(() => import('./components/MazoConIA.jsx'));
import Dashboard from './components/Dashboard.jsx';
const Grammar = lazy(() => import('./components/Grammar.jsx'));
const TopicDetail = lazy(() => import('./components/TopicDetail.jsx'));
const Session = lazy(() => import('./components/Session.jsx'));
const Summary = lazy(() => import('./components/Summary.jsx'));
const Leaderboard = lazy(() => import('./components/Leaderboard.jsx'));
const Settings = lazy(() => import('./components/Settings.jsx'));
const Vocab = lazy(() => import('./components/Vocab.jsx'));
const DeckDetail = lazy(() => import('./components/DeckDetail.jsx'));
const VocabSession = lazy(() => import('./components/VocabSession.jsx'));
const CrosswordGame = lazy(() => import('./components/CrosswordGame.jsx'));
const MatchGame = lazy(() => import('./components/MatchGame.jsx'));
const WortsalatGame = lazy(() => import('./components/WortsalatGame.jsx'));
const BlitzGame = lazy(() => import('./components/BlitzGame.jsx'));
const HangmanGame = lazy(() => import('./components/HangmanGame.jsx'));
const VocabReto = lazy(() => import('./components/VocabReto.jsx'));
const KommReto = lazy(() => import('./components/KommReto.jsx'));
const AskPractice = lazy(() => import('./components/AskPractice.jsx'));
const GenderGame = lazy(() => import('./components/GenderGame.jsx'));
const FoxChat = lazy(() => import('./components/FoxChat.jsx'));
const TranslateGame = lazy(() => import('./components/TranslateGame.jsx'));
const VocabSummary = lazy(() => import('./components/VocabSummary.jsx'));
const Notebook = lazy(() => import('./components/Notebook.jsx'));
const NotebookEntry = lazy(() => import('./components/NotebookEntry.jsx'));
const NotebookSession = lazy(() => import('./components/NotebookSession.jsx'));
const Kommunikation = lazy(() => import('./components/Kommunikation.jsx'));
const News = lazy(() => import('./components/News.jsx'));
const Lieder = lazy(() => import('./components/Lieder.jsx'));
const Diary = lazy(() => import('./components/Diary.jsx'));
const DiaryEntry = lazy(() => import('./components/DiaryEntry.jsx'));
const Pruefung = lazy(() => import('./components/Pruefung.jsx'));
const ExamLesenHoeren = lazy(() => import('./components/ExamLesenHoeren.jsx'));
const ExamSchreiben = lazy(() => import('./components/ExamSchreiben.jsx'));
const ExamSprechen = lazy(() => import('./components/ExamSprechen.jsx'));
const KasusGame = lazy(() => import('./components/KasusGame.jsx'));
import { SIN_IA, PORTABLE } from './lib/modo.js';
import { onLangChange, t, pick } from './lib/i18n.js';
import { onContenidoIdiomaListo } from './lib/contenido/index.js';
import { storage, fusionarDelServidor, alFusionar, HAY_SERVIDOR } from './lib/storage.js';
import { hayEjercicio } from './lib/enEjercicio.js';
import { crucigramasResueltos, MAX_CRUCIGRAMAS_VOCAB } from './lib/vocabRewards.js';
import { aplicarBonoRachaFinal } from './lib/monedas.js';
import { ExerciseActiveContext } from './lib/teclas.js';
import { createEntry } from './lib/diary.js';

// Vistas que no merece la pena recordar: una partida o un resumen a medias.
const EFIMERAS = ['session', 'summary', 'vsession', 'vsummary', 'vcrossword', 'nsession', 'nsummary', 'exam', 'vreto', 'gender', 'kasus', 'traducir', 'fox', 'askpractice', 'kommreto'];

// Pantallas donde estas HACIENDO un ejercicio. El monedero va fijo arriba a la
// derecha y ahi tapaba el contador (1/20), asi que en estas se aparta. Lo
// marcamos con una clase en el <body> en vez de deducirlo desde el CSS: se ve
// en el inspector y no depende de que el navegador resuelva un :has().
// Los juegos de vocabulario cuya tanda es una lista de tarjetas y por tanto se
// puede repetir con solo las falladas. Fuera: emparejar (es una parrilla),
// der/die/das (no va por mazo) y Blitz, que es contrarreloj: repetir solo los
// fallos ahi es una carrera de tres preguntas que se acaba antes de empezar,
// y ademas rompe lo unico que mide -cuantas te salen seguidas en 30 segundos.
const REPETIBLES = ['quiz', 'write', 'flashcards', 'wortsalat', 'hangman'];
const EJERCICIO = ['session', 'vsession', 'vcrossword', 'nsession', 'exam', 'vreto', 'gender', 'kasus', 'traducir', 'kommreto'];
const EJERCICIOS_QUE_SE_PAUSAN_AL_NAVEGAR = ['session', 'askpractice', 'kasus', 'vsession', 'vcrossword', 'gender', 'vreto'];
const VISTAS_CON_FUNDIDO_CORTO = ['topic', 'deck', 'lektionvocab', 'kommlektion', 'dentry', 'note'];

// Mantener el mismo orden visual que NAV en el menu lateral: la direccion de
// la transicion depende de la posicion relativa de las dos secciones.
const TOP_LEVEL = ['home', 'grammar', 'vocab', 'komm', ...(PORTABLE ? [] : ['notebook']), 'diary', 'pruefung', 'news', 'lieder', 'leaderboard', 'settings'];

export default function App() {
  const [view, setView] = useState({ name: 'home' });
  const [vistaKommGuardada, setVistaKommGuardada] = useState(null);
  const [ejerciciosGuardados, setEjerciciosGuardados] = useState({});
  const [temaGuardado, setTemaGuardado] = useState(null);
  const [datos, setDatos] = useState({});
  const [errorDatos, setErrorDatos] = useState(false);
  // Al cambiar el idioma hay que repintar toda la app.
  const [, setLangTick] = useState(0);
  useEffect(() => {
    const actualizar = () => setLangTick((n) => n + 1);
    const quitarIdioma = onLangChange(actualizar);
    const quitarContenido = onContenidoIdiomaListo(actualizar);
    return () => {
      quitarIdioma();
      quitarContenido();
    };
  }, []);

  // En móvil algunos navegadores dejan el foco visual del toque sobre el
  // botón, aunque ya haya terminado el gesto. Se quita ese foco táctil al
  // soltar; la navegación con teclado conserva su indicador :focus-visible.
  useEffect(() => {
    const iniciarToque = (event) => {
      if (event.pointerType === 'touch' || event.pointerType === 'pen') {
        document.documentElement.classList.add('touch-pointer-active');
      }
    };
    const quitarFocoDeToque = (event) => {
      const esToque = event.pointerType === 'touch' || event.pointerType === 'pen';
      const elemento = event.target instanceof Element
        && esToque
        ? event.target.closest('button, a, [role="button"]')
        : null;
      requestAnimationFrame(() => {
        if (elemento && document.activeElement === elemento) elemento.blur();
        document.documentElement.classList.remove('touch-pointer-active');
      });
    };
    document.addEventListener('pointerdown', iniciarToque, true);
    document.addEventListener('pointerup', quitarFocoDeToque, true);
    document.addEventListener('pointercancel', quitarFocoDeToque, true);
    return () => {
      document.removeEventListener('pointerdown', iniciarToque, true);
      document.removeEventListener('pointerup', quitarFocoDeToque, true);
      document.removeEventListener('pointercancel', quitarFocoDeToque, true);
      document.documentElement.classList.remove('touch-pointer-active');
    };
  }, []);

  // Los bancos de contenido pesan mucho más que la interfaz. Se incorporan
  // cuando se entra en su sección o se inicia una actividad que los necesita.
  useEffect(() => {
    let vivo = true;
    const cargas = [];
    if (((['topic', 'session'].includes(view.name) && !view.topic) || temaGuardado) && !datos.topics) {
      cargas.push(import('./topics/index.js').then((mod) => ['topics', mod]));
    }
    if (['deck', 'vreto', 'vsession', 'vcrossword'].includes(view.name)) {
      cargas.push(import('./lib/vocab.js').then((mod) => ['vocab', mod]));
    }
    if (view.name === 'nsession') {
      cargas.push(
        import('./lib/notebook.js').then((mod) => ['notebook', mod]),
        import('./lib/kursbuch/index.js').then((mod) => ['kursbuch', mod])
      );
    }
    if (cargas.length) {
      setErrorDatos(false);
      Promise.all(cargas).then((modulos) => {
        if (vivo) setDatos((actuales) => ({ ...actuales, ...Object.fromEntries(modulos) }));
      }).catch(() => {
        if (vivo) setErrorDatos(true);
      });
    }
    return () => { vivo = false; };
  }, [view.name, temaGuardado?.topicId, Boolean(datos.topics)]);

  const temas = datos.topics;
  const vocabulario = datos.vocab;
  const cuaderno = datos.notebook;
  const libro = datos.kursbuch;
  const requiereDatos =
    (['topic', 'session'].includes(view.name) && !temas && !view.topic) ||
    (Boolean(temaGuardado) && !temas) ||
    (['deck', 'vreto', 'vsession', 'vcrossword'].includes(view.name) && !vocabulario) ||
    (view.name === 'nsession' && (!cuaderno || !libro));
  const getTopic = temas?.getTopic;
  const getDeck = vocabulario?.getDeck;
  const deckDelCrucigrama = view.name === 'vcrossword' ? getDeck?.(view.deckId) : null;
  const getNote = cuaderno?.getNote;
  const getLektion = libro?.getLektion;

  useLayoutEffect(() => {
    const enEjercicio = EJERCICIO.includes(view.name);
    document.body.classList.toggle('en-ejercicio', enEjercicio);
    document.body.classList.toggle('crucigrama-activo', view.name === 'vcrossword');
    document.body.classList.toggle('inicio-fijo-escritorio', view.name === 'home');
    if (enEjercicio) {
      window.scrollTo(0, 0);
      mainRef.current?.scrollTo(0, 0);
      document.querySelector('.sidebar')?.scrollTo(0, 0);
    }
  }, [view.name]);

  // Traerse lo de los otros aparatos.
  //
  // Dos cosas que hacia mal:
  //
  // 1. Metia los datos del servidor ENCIMA de los de aqui, clave por clave.
  //    Si habias escrito algo en este aparato y no habia llegado a subir
  //    (porque el servidor iba por delante y el POST se habia comido un 409),
  //    desaparecia. Ahora fusionarDelServidor respeta lo que has tocado tu y
  //    aun esta sin subir.
  //
  // 2. Recargaba la pagina. Y esto esta enganchado a volver a la pestaña, o
  //    sea que mirar el movil en mitad de una tanda y volver al ordenador te
  //    borraba la tanda: las vistas de ejercicio estan en EFIMERAS y no se
  //    recuerdan. Ahora, si estas en un ejercicio, se apunta y se hace al
  //    salir de el.
  const vistaAhora = useRef(view);
  vistaAhora.current = view;
  const syncAplazada = useRef(false);
  const recargaAplazada = useRef(false);
  const sincronizar = useRef(null);

  useEffect(() => {
    sincronizar.current = async () => {
      if (!HAY_SERVIDOR) return;
      try {
        const res = await fetch('/api/sync');
        if (!res.ok) return;
        const { timestamp, data } = await res.json();
        const localTs = Number(localStorage.getItem('dtrainer_sync_ts') || 0);
        if (timestamp <= localTs) return;
        if (EJERCICIO.includes(vistaAhora.current.name) || hayEjercicio()) {
          syncAplazada.current = true;
          return;
        }
        const traidas = fusionarDelServidor(data, timestamp);
        // Recargar y no repintar a secas: media app lee el almacen UNA vez, al
        // montarse (useState(() => ...)), asi que un repintado no se entera de
        // lo que acaba de llegar. La recarga es bruta pero honesta; lo que no
        // vale es hacerla encima de un ejercicio, y de eso se encarga la
        // comprobacion de arriba.
        if (traidas > 0) location.reload();
      } catch {
        /* sin servidor: se reintenta al volver a la pestaña */
      }
    };
    sincronizar.current();
    const alVolver = () => { if (!document.hidden) sincronizar.current(); };
    window.addEventListener('visibilitychange', alVolver);
    // Si los datos cambian por debajo (una fusion tras un 409), repintar.
    // Tras una fusion por conflicto: si estas en un ejercicio se espera a que
    // salgas, igual que arriba.
    const quitar = alFusionar(() => {
      if (EJERCICIO.includes(vistaAhora.current.name) || hayEjercicio()) {
        // Bandera propia: aqui la mezcla YA esta hecha y la marca ya esta al
        // dia, asi que al salir no hay que volver a mirar el servidor -diria
        // "nada nuevo"-, hay que pintar lo que ya tenemos.
        recargaAplazada.current = true;
        return;
      }
      location.reload();
    });
    return () => {
      window.removeEventListener('visibilitychange', alVolver);
      quitar();
    };
  }, []);

  // Las fotos antiguas del cuaderno se migran al abrirlo, no al arrancar la
  // app: el cuaderno y el libro no deben descargarse para quien no los usa.
  useEffect(() => {
    if (PORTABLE || !['notebook', 'note', 'nsession', 'nsummary'].includes(view.name)) return;
    import('./lib/notebook.js').then(({ migrarFotos }) => migrarFotos()).catch(() => {
      /* si no se puede, las fotos se quedan donde estaban */
    });
  }, [view.name]);

  useEffect(() => {
    if (PORTABLE && ['notebook', 'note', 'nsession', 'nsummary'].includes(view.name)) {
      setView({ name: 'home' });
    }
  }, [view.name]);

  // Al salir de un ejercicio, lo que se quedo esperando.
  useEffect(() => {
    if (EJERCICIO.includes(view.name)) return;
    if (recargaAplazada.current) {
      recargaAplazada.current = false;
      location.reload();
      return;
    }
    if (!syncAplazada.current) return;
    syncAplazada.current = false;
    sincronizar.current?.();
  }, [view.name]);

  const current = TOP_LEVEL.includes(view.name)
    ? view.name
    : (view.name === 'session' && view.game === 'vocab-mixed') || (view.name === 'summary' && view.data?.game === 'vocab-mixed')
    ? 'vocab'
    : (view.name === 'session' && view.game === 'grammar-mixed') || (view.name === 'summary' && view.data?.game === 'grammar-mixed')
    ? 'grammar'
    : ['grammar', 'topic', 'askpractice', 'kasus'].includes(view.name)
    ? 'grammar'
    : (view.name === 'session' && view.topicId !== 'mix') || (view.name === 'summary' && view.data?.topic?.id !== 'mix')
    ? 'grammar'
    : (view.name === 'session' && view.topicId === 'mix') || (view.name === 'summary' && view.data?.topic?.id === 'mix')
    ? 'home'
    : (view.name === 'vsummary' && ['uebersetzen', 'komm-reto'].includes(view.data?.mode)) || view.name === 'kommreto'
    ? 'komm'
    : ['deck', 'vsession', 'vsummary', 'vcrossword', 'gender', 'lektionvocab', 'vreto'].includes(view.name)
    ? 'vocab'
    : ['kommlektion', 'traducir'].includes(view.name)
    ? 'komm'
    : ['exam', 'dentry', 'note', 'nsession', 'nsummary'].includes(view.name)
    ? view.name === 'exam' ? 'pruefung' : view.name.startsWith('d') ? 'diary' : 'notebook'
    : 'home';

  const obtenerVistaDeEjercicio = (name) => {
    if (view.name === name) return { ...view, ejercicioVisible: true };
    const guardada = ejerciciosGuardados[name];
    return guardada ? { ...guardada.view, ejercicioVisible: false } : null;
  };
  const vistaSession = obtenerVistaDeEjercicio('session');
  const vistaAskPractice = obtenerVistaDeEjercicio('askpractice');
  const vistaKasus = obtenerVistaDeEjercicio('kasus');
  const vistaVSession = obtenerVistaDeEjercicio('vsession');
  const vistaVCrossword = obtenerVistaDeEjercicio('vcrossword');
  const vistaGender = obtenerVistaDeEjercicio('gender');
  const vistaVReto = obtenerVistaDeEjercicio('vreto');
  const vistaTopic = view.name === 'topic'
    ? { ...view, ejercicioVisible: true }
    : (current !== 'grammar' && temaGuardado
      ? { ...temaGuardado, ejercicioVisible: false }
      : null);

  const esVistaKommRetenible = (candidate) =>
    ['komm', 'kommlektion', 'kommreto', 'traducir'].includes(candidate?.name);
  const vistaKommActiva = current === 'komm' && esVistaKommRetenible(view) ? view : null;
  const vistaKomm = vistaKommActiva || (current !== 'komm' && esVistaKommRetenible(vistaKommGuardada)
    ? vistaKommGuardada
    : null);
  const kommVisible = Boolean(vistaKommActiva);

  // Comunicación conserva la instancia del ejercicio mientras se visita otra
  // sección. Si se abandona desde dentro (volver/resumen), se descarta la ruta
  // antigua para que no reaparezca una tanda ya cerrada.
  useEffect(() => {
    if (current !== 'komm') return;
    setVistaKommGuardada(esVistaKommRetenible(view) ? view : null);
  }, [current, view]);

  const mainRef = useRef(null);
  const motionId = view.topicId ?? view.deckId ?? view.lektionId ?? view.entryId ?? view.noteId ?? '';
  const previousMotion = useRef({ current, name: view.name, id: motionId });
  useLayoutEffect(() => {
    const previous = previousMotion.current;
    let motion = '';
    const cambioVista = previous.name !== view.name || previous.id !== motionId;
    const vistaDeDetalle = VISTAS_CON_FUNDIDO_CORTO.includes(view.name);
    const veniaDeDetalle = VISTAS_CON_FUNDIDO_CORTO.includes(previous.name);
    const wasActivity = EJERCICIO.includes(previous.name) || previous.name === 'askpractice';
    const isActivity = EJERCICIO.includes(view.name) || view.name === 'askpractice';

    // Al cambiar de sección principal, el desplazamiento direccional tiene
    // prioridad aunque la vista anterior o la nueva sea una lección, detalle
    // o ejercicio.
    if (previous.current !== current) {
      const from = TOP_LEVEL.indexOf(previous.current);
      const to = TOP_LEVEL.indexOf(current);
      if (from >= 0 && to >= 0 && from !== to) {
        motion = to > from ? 'main-motion-forward' : 'main-motion-backward';
      }
    }

    // Las actividades conservan el fundido al entrar o salir sin cambiar de sección.
    if (!motion && cambioVista && (wasActivity || isActivity)) {
      motion = 'main-motion-fade';
    }

    // Lecciones y entradas del diario/cuaderno usan un fundido más breve al
    // cambiar dentro de la misma sección. El identificador también cuenta para
    // animar al cambiar de entrada o lección aunque la ruta tenga el mismo nombre.
    if (!motion && cambioVista && (vistaDeDetalle || veniaDeDetalle)) {
      motion = 'main-motion-fade-short';
    }

    previousMotion.current = { current, name: view.name, id: motionId };
    const main = mainRef.current;
    if (!main) return;
    main.classList.remove('main-motion-fade', 'main-motion-fade-short', 'main-motion-forward', 'main-motion-backward');
    const limpiarMovimiento = (event) => {
      const movimientoDeMain = event.target === main && event.animationName.startsWith('main-menu-');
      const fundidoDeVista = event.target.parentElement === main && event.animationName === 'main-fade';
      if (!movimientoDeMain && !fundidoDeVista) return;
      main.classList.remove('main-motion-fade', 'main-motion-fade-short', 'main-motion-forward', 'main-motion-backward');
    };
    main.addEventListener('animationend', limpiarMovimiento);
    if (!motion) return () => main.removeEventListener('animationend', limpiarMovimiento);
    void main.offsetWidth;
    main.classList.add(motion);
    return () => main.removeEventListener('animationend', limpiarMovimiento);
  }, [current, view.name, motionId]);

  // Dónde estabas la última vez en cada sección.
  const memoria = useRef({});
  const scrollMap = useRef({});

  // Adónde hay que dejar el scroll en cuanto se pinte la vista nueva. Lo aplica
  // el useLayoutEffect de abajo, en UN solo sitio.
  //
  // Antes esto eran dos setTimeout compitiendo: uno a 10 ms restauraba la
  // posición guardada y otro a 20 ms forzaba el principio. En un ordenador
  // descansado ganaba siempre el segundo y todo iba bien, pero basta con que el
  // de 10 ms se retrase (pestaña ocupada, una generación en marcha) para que
  // lleguen al revés: primero el "vete arriba" y encima de él la posición
  // vieja. Resultado: entrabas en una sección y aparecías unos píxeles más
  // abajo, de forma intermitente y solo a veces.
  const scrollPedido = useRef(null);

  const setViewProxy = (newViewOrFn) => {
    setView((prevView) => {
      const nextView = typeof newViewOrFn === 'function' ? newViewOrFn(prevView) : newViewOrFn;
      scrollMap.current[JSON.stringify(prevView)] = window.scrollY;
      // Por defecto, volver a donde estabas en esa vista; si no la conocíamos,
      // al principio.
      if (scrollPedido.current === null) {
        scrollPedido.current = scrollMap.current[JSON.stringify(nextView)] ?? 0;
      }
      return nextView;
    });
  };
  const volverAlInicioDeLaPagina = (accion) => {
    // El regreso desde el resumen debe ignorar la posición que quedó guardada
    // antes de entrar en la tanda.
    scrollPedido.current = 0;
    return accion?.();
  };

  useEffect(() => {
    memoria.current[current] = view;
  }, [view, current]);

  // El único sitio que toca el scroll al cambiar de pantalla. useLayoutEffect y
  // no useEffect: se ejecuta con el DOM nuevo ya montado pero ANTES de que el
  // navegador pinte, así que no se llega a ver el salto.
  useLayoutEffect(() => {
    if (scrollPedido.current === null) return;
    const y = scrollPedido.current;
    scrollPedido.current = null;
    window.scrollTo(0, y);
  }, [view]);

  // Un ejercicio retenido puede haber dejado activa esta clase al ocultarse.
  // Los menús principales vuelven a mostrar la navegación normal.
  useLayoutEffect(() => {
    if (TOP_LEVEL.includes(view.name)) document.body.classList.remove('en-ejercicio');
  }, [view.name]);

  const irASeccion = (name) => {
    if (current !== name) window.dispatchEvent(new Event('app:layout-transition'));
    const memView = (current === name) ? { name } : (memoria.current[name] || { name });
    // Blitz y Match de gramática viven dentro del detalle de la lección, no
    // cambian la ruta. Conservamos ese componente oculto para volver al mismo
    // juego cuando se regrese desde otro menú.
    if (current !== name && current === 'grammar' && view.name === 'topic') {
      setTemaGuardado(view);
    }
    setEjerciciosGuardados((guardadas) => {
      const siguientes = { ...guardadas };
      // Al regresar se activa la instancia guardada; al irse, se deja esa
      // instancia montada para que el progreso sobreviva al cambio de sección.
      Object.entries(siguientes).forEach(([tipo, registro]) => {
        if (registro.owner === name) delete siguientes[tipo];
      });
      if (current !== name && EJERCICIOS_QUE_SE_PAUSAN_AL_NAVEGAR.includes(view.name)) {
        siguientes[view.name] = { view, owner: current };
      }
      return siguientes;
    });
    // Pulsar el menú te lleva al principio de la sección, salvo que estés
    // volviendo a un ejercicio a medias: ahí se respeta dónde ibas.
    const esEjercicioKomm = name === 'komm'
      && ['kommlektion', 'kommreto', 'traducir'].includes(memView.name);
    scrollPedido.current = EFIMERAS.includes(memView.name) || esEjercicioKomm
      ? (scrollMap.current[JSON.stringify(memView)] ?? 0)
      : 0;
    setViewProxy(memView);
  };

  const go = (name) => {
    // Al salir explícitamente de un ejercicio/resumen, no conservarlo como
    // última pantalla de su sección: al volver a Wortschatz desde el menú se
    // reabría la tanda que ya se había cerrado.
    if (EFIMERAS.includes(view.name) && current !== name) {
      memoria.current[current] = { name: current };
    }
    if (view.name === 'topic' && name === 'grammar') setTemaGuardado(null);
    setViewProxy({ name });
  };
  const openTopic = (topicId, tab = 'teoria') => setViewProxy({ name: 'topic', topicId, tab });
  // La pestaña viaja en la vista para que la memoria de sección la recuerde.
  const setTab = (tab) => setViewProxy((v) => ({ ...v, tab }));
  // Entrar a traducir frases. Desde la portada se entra directo, con todas
  // las dificultades y en mixto; desde Kommunikation se elige antes.
  const traducir = (lektionId = null, dir = 'mix', nivel = 'all', cartasFijas = null) =>
    setViewProxy({ name: 'traducir', lektionId, dir, nivel, cartasFijas, k: Date.now() });

  const start = (topicId, mode, game = 'mixed', itemsFijos = null, origen = null, reviewMode = null, mixOptions = null) =>
    setViewProxy({ name: 'session', topicId, mode, game, itemsFijos, origen, reviewMode, mixOptions, k: Date.now() });

  // La teoria del tema que acabas de practicar. Devuelve null cuando no hay
  // ninguna (la tanda mixta), y asi el resumen no pinta el boton.
  const volverAlTema = (topicId, tab = 'ejercicios') => {
    if (!topicId || topicId === 'mix' || String(topicId).startsWith('mix:')) return null;
    return () => setViewProxy({ name: 'topic', topicId, tab });
  };

  const openDeck = (deckId) => setViewProxy({ name: 'deck', deckId });
  // Al salir de un juego se vuelve a la pestaña de ejercicios, que es de donde
  // se ha salido... salvo con las tarjetas, que se lanzan desde la teoría: allí
  // devolver a ejercicios dejaba al alumno en otra pantalla de la que estaba.
  const returnToDeck = (deckId, tab = 'ejercicios', origen = null) => {
    if (origen === 'home') {
      go('home');
      return;
    }
    // La mezcla de TODO el vocabulario devuelve a Wortschatz (vocabulario)
    if (String(deckId).startsWith('combi:')) {
      go('vocab');
      return;
    }
    const d = vocabulario?.getDeck(deckId);
    if (d?.lektionId || (String(deckId).startsWith('kb-') && !String(deckId).startsWith('kb-topic-'))) {
      const lid = d?.lektionId || String(deckId).replace(/^kb-/, '').replace(/-w\d+$/, '').replace(/-all$/, '');
      setViewProxy({ name: 'lektionvocab', lektionId: lid, tab });
    } else {
      openDeck(deckId);
    }
  };
  const volverDeJuego = (deckId, vmode, origen = null) =>
    returnToDeck(deckId, vmode === 'flashcards' ? 'teoria' : 'ejercicios', origen);
  // fallos: la misma partida pero con un subconjunto del mazo.
  //   true / 'fallos' -> solo lo que has fallado
  //   'faltan'        -> solo lo que aun no cuenta para el porcentaje
  const startVocab = async (deckId, vmode, fallos = false, dir = null, cartasFijas = null, origen = null, reviewMode = null, mixOptions = null) => {
    if (vmode === 'crossword') {
      if (crucigramasResueltos(deckId) >= MAX_CRUCIGRAMAS_VOCAB) return;
      setViewProxy({ name: 'vcrossword', deckId, origen, k: Date.now() });
      return;
    }
    if (vmode === 'mixed') {
      const [modVocab, modMix, modSettings] = await Promise.all([
        vocabulario ? Promise.resolve(vocabulario) : import('./lib/vocab.js'),
        import('./lib/mixItems.js'),
        import('./lib/settings.js')
      ]);
      if (!vocabulario) setDatos((actuales) => ({ ...actuales, vocab: modVocab }));
      const deck = modVocab.getDeck(deckId);
      const items = cartasFijas?.length
        ? cartasFijas
        : modMix.vocabMixItems(modSettings.getSettings().sessionSize || 10, null, deck?.cards || [], mixOptions?.difficultyIds || []);
      const topic = {
        id: 'vocab-mix',
        name: pick('Mezcla de vocabulario', 'Mixed vocabulary'),
        nameEs: pick('Mezcla de vocabulario', 'Mixed vocabulary'),
        deckId,
        mixOptions: mixOptions || { bandIds: [], difficultyIds: [] },
        concepts: [],
        frames: []
      };
      setViewProxy({
        name: 'session', topicId: topic.id, topic, mode: 'random',
        game: 'vocab-mixed', itemsFijos: items, origen: 'vocab', k: Date.now()
      });
      return;
    }
    setViewProxy({ name: 'vsession', deckId, vmode, fallos, dir, cartasFijas, origen, reviewMode, k: Date.now() });
  };
  const startReto = (deckId) => setViewProxy({ name: 'vreto', deckId, k: Date.now() });
  // El mismo reto, pero con las conversaciones de una Lektion de Kommunikation.
  const startKommReto = (lektionId) => setViewProxy({ name: 'kommreto', lektionId, k: Date.now() });

  // Tarjetas de TODO el vocabulario, sin pasar por Wortschatz. Los mazos del
  // libro se cogen enteros por lección (`kb-…-all`) y no en grupitos de diez,
  // que es como vienen partidos; si no, cada palabra entraria dos veces.
  // `dir` es el sentido de la tarjeta ('de-es' o 'es-de'). Importa mas de lo
  // que parece: el color que gana la palabra depende de el, y sin elegirlo
  // salia al azar, asi que no se podia practicar el lado dificil a proposito.
  const flashcardsDeTodo = async (dir = null) => {
    try {
      const mod = vocabulario || await import('./lib/vocab.js');
      if (!vocabulario) setDatos((actuales) => ({ ...actuales, vocab: mod }));
      const ids = mod.mazosParaMezclar().map((d) => d.id);
      if (ids.length) startVocab('combi:' + ids.join('|'), 'flashcards', false, dir, null, 'home');
    } catch {
      setErrorDatos(true);
    }
  };
  // El mazo de "solo mis fallos" lleva el mismo id, así que el progreso de cada
  // palabra se sigue apuntando donde toca.
  const mazoDeLaVista = (vista = view) => {
    const d = vista.deckId === 'starred'
      ? { id: 'starred', name: 'Marcados', emoji: '⭐', builtin: true, cards: vista.cartasFijas || [] }
      : vocabulario?.getDeck(vista.deckId);
    if (!d) return null;
    if (vista.cartasFijas?.length) {
      return { ...d, cards: vista.cartasFijas };
    }
    if (vista.fallos === 'faltan') return vocabulario.soloQueFaltan(d);
    return vista.fallos ? vocabulario.soloFallos(d) : d;
  };

  return (
    <AppErrorBoundary>
      <div className="layout">
      <Monedero />
      <Sidebar current={current} onNavigate={irASeccion} />
      <main ref={mainRef} className="main">
        <Suspense fallback={<LoadingIndicator />}>
        {requiereDatos ? (
          errorDatos
            ? <div className="card" role="alert" aria-live="polite">Der Inhalt konnte nicht geladen werden. Bitte lade die App neu.</div>
            : <LoadingIndicator />
        ) : <>
        {view.name === 'home' && (
          <Dashboard
            onStart={(topicId, mode, game) => start(topicId, mode, game, null, 'home')}
            onNavigate={go}
            onFox={(abrirCon) => setView({ name: 'fox', abrirCon })}
            onFlashcards={flashcardsDeTodo}
            onDiaryNew={() => {
              const entry = createEntry();
              setViewProxy({ name: 'dentry', entryId: entry.id });
            }}
          />
        )}
        {view.name === 'grammar' && (
          <Grammar
            onOpen={openTopic}
            onStart={start}
            onKasus={(filtro) => setViewProxy({ name: 'kasus', filtro, k: Date.now() })}
            onPractise={(d) => setView({ name: 'askpractice', ...d, k: Date.now() })}
          />
        )}

        {!SIN_IA && vistaAskPractice && (
          <ExerciseActiveContext.Provider value={vistaAskPractice.ejercicioVisible}>
            <div style={vistaAskPractice.ejercicioVisible ? undefined : { display: 'none' }} aria-hidden={!vistaAskPractice.ejercicioVisible}>
              <AskPractice
                key={vistaAskPractice.k}
                pregunta={vistaAskPractice.pregunta}
                res={vistaAskPractice.res}
                onExit={() => go('grammar')}
                onFinish={(data) =>
                  setView({
                    name: 'vsummary',
                    data: {
                      ...aplicarBonoRachaFinal(data),
                      deck: { id: 'ask', name: vistaAskPractice.res?.titel || vistaAskPractice.pregunta, emoji: '💬' },
                      mode: 'ask'
                    }
                  })
                }
              />
            </div>
          </ExerciseActiveContext.Provider>
        )}

        {vistaTopic && (
          <ExerciseActiveContext.Provider value={vistaTopic.ejercicioVisible}>
            <div style={vistaTopic.ejercicioVisible ? undefined : { display: 'none' }} aria-hidden={!vistaTopic.ejercicioVisible}>
              <TopicDetail
                key={vistaTopic.topicId}
                topic={getTopic(vistaTopic.topicId)}
                tab={vistaTopic.tab}
                onTab={setTab}
                onStart={start}
                onBack={() => go('grammar')}
              />
            </div>
          </ExerciseActiveContext.Provider>
        )}

        {vistaSession && (
          <ExerciseActiveContext.Provider value={vistaSession.ejercicioVisible}>
            <div style={vistaSession.ejercicioVisible ? undefined : { display: 'none' }} aria-hidden={!vistaSession.ejercicioVisible}>
              <Session
                key={vistaSession.k}
                topic={vistaSession.topic || getTopic(vistaSession.topicId)}
                mode={vistaSession.mode}
                game={vistaSession.game}
                mixOptions={vistaSession.mixOptions}
                itemsFijos={vistaSession.itemsFijos}
                reviewMode={vistaSession.reviewMode}
                onExit={() => {
                  if (vistaSession.game === 'vocab-mixed') {
                    go('vocab');
                  } else if (vistaSession.origen === 'home' || vistaSession.game === 'todo') {
                    go('home');
                  } else if (!vistaSession.topicId || vistaSession.topicId === 'mix' || String(vistaSession.topicId).startsWith('mix:')) {
                    go('grammar');
                  } else {
                    openTopic(vistaSession.topicId, 'ejercicios');
                  }
                }}
                onDone={(data) => setView({ name: 'summary', data: aplicarBonoRachaFinal(data) })}
              />
            </div>
          </ExerciseActiveContext.Provider>
        )}

        {view.name === 'summary' && (
          <Summary
            data={view.data}
            volverAInicio={view.data?.game === 'todo'}
            onRepeat={() => view.data.game === 'vocab-mixed'
              ? startVocab(view.data.topic.deckId, 'mixed', false, null, null, null, null, view.data.topic.mixOptions)
              : start(view.data.topic.id, view.data.mode || 'mixed', view.data.game || 'mixed', null, null, null, view.data.mixOptions)}
            /* Otra tanda con lo que acaba de fallar, sin generar nada nuevo. */
            onRepetirFallos={() => view.data.game === 'vocab-mixed'
              ? startVocab(view.data.topic.deckId, 'mixed', false, null, view.data.fallos, null, null, view.data.topic.mixOptions)
              :
              setViewProxy({
                name: 'session',
                topicId: view.data.topic.id,
                topic: view.data.topic,
                mode: view.data.mode || 'mixed',
                game: view.data.game || 'mixed',
                mixOptions: view.data.mixOptions,
                itemsFijos: view.data.fallos,
                k: Date.now()
              })
            }
            /* La tanda mixta no sale de un tema, asi que ahi no hay adonde
               volver: se vuelve a la lista general de ejercicios de gramática. */
            onTema={() => volverAlInicioDeLaPagina(
              view.data?.game === 'todo'
                ? () => go('home')
                : view.data?.game === 'vocab-mixed'
                ? () => go('vocab')
                : volverAlTema(view.data?.topic?.id, 'ejercicios') || (() => go('grammar'))
            )}
          />
        )}

        {!SIN_IA && view.name === 'fox' && (
          <div className="reading">
            <FoxChat abrirCon={view.abrirCon} onClose={() => go('home')} />
          </div>
        )}

        {view.name === 'vocab' && (
          <Vocab
            onOpen={openDeck}
            onOpenLektion={(lektionId) => setViewProxy({ name: 'lektionvocab', lektionId })}
            onGenderGame={(nivel) => setViewProxy({ name: 'gender', k: Date.now(), nivel })}
            onChanged={() => setViewProxy({ name: 'vocab', k: Date.now() })}
            onStart={startVocab}
          />
        )}

        {view.name === 'lektionvocab' && (
          <Vocab
            lektionId={view.lektionId}
            tab={view.tab}
            onTab={setTab}
            onStart={startVocab}
            onStartGrammar={start}
            onReto={startReto}
            onBack={() => go('vocab')}
          />
        )}

        {vistaGender && (
          <ExerciseActiveContext.Provider value={vistaGender.ejercicioVisible}>
            <div style={vistaGender.ejercicioVisible ? undefined : { display: 'none' }} aria-hidden={!vistaGender.ejercicioVisible}>
              <GenderGame
                key={vistaGender.k}
                nivel={vistaGender.nivel || 'all'}
                onExit={() => go('vocab')}
                onFinish={(data) => setView({ name: 'vsummary', data: aplicarBonoRachaFinal(data) })}
              />
            </div>
          </ExerciseActiveContext.Provider>
        )}

        {view.name === 'deck' && getDeck(view.deckId) && (
          <DeckDetail
            deck={getDeck(view.deckId)}
            tab={view.tab}
            onTab={setTab}
            onStart={startVocab}
            onReto={startReto}
            onBack={() => {
              const d = getDeck(view.deckId);
              if (d?.lektionId) setViewProxy({ name: 'lektionvocab', lektionId: d.lektionId });
              else go('vocab');
            }}
            onDeleted={() => go('vocab')}
          />
        )}
        {view.name === 'deck' && !getDeck(view.deckId) && <Vocab onOpen={openDeck} onChanged={() => go('vocab')} />}

        {vistaVReto && (
          <ExerciseActiveContext.Provider value={vistaVReto.ejercicioVisible}>
            <div style={vistaVReto.ejercicioVisible ? undefined : { display: 'none' }} aria-hidden={!vistaVReto.ejercicioVisible}>
              <VocabReto
                key={vistaVReto.k}
                deck={getDeck(vistaVReto.deckId)}
                onExit={() => returnToDeck(vistaVReto.deckId)}
                onFinish={(data) => setView({ name: 'vsummary', data: { ...aplicarBonoRachaFinal(data), deck: getDeck(vistaVReto.deckId), mode: 'reto' } })}
              />
            </div>
          </ExerciseActiveContext.Provider>
        )}

        {/* MazoConIA anade al mazo palabras nuevas segun el mando de Ajustes.
            Con el mando a cero -como viene- devuelve el mazo tal cual y no
            pide nada. Envuelve a los seis porque todos reciben el mazo por
            la misma puerta. */}
        {vistaVSession && (
          <ExerciseActiveContext.Provider value={vistaVSession.ejercicioVisible}>
            <div style={vistaVSession.ejercicioVisible ? undefined : { display: 'none' }} aria-hidden={!vistaVSession.ejercicioVisible}>
              <MazoConIA key={vistaVSession.k} deck={mazoDeLaVista(vistaVSession)} enabled={!vistaVSession.fallos}>
                {(mazo) =>
                  vistaVSession.vmode === 'match' ? (
                    <MatchGame
                      key={vistaVSession.k}
                      deck={mazo}
                      onExit={() => returnToDeck(vistaVSession.deckId, 'ejercicios', vistaVSession.origen)}
                      onFinish={(data) => setView({ name: 'vsummary', data: { ...aplicarBonoRachaFinal(data), origen: vistaVSession.origen } })}
                    />
                  ) : vistaVSession.vmode === 'wortsalat' ? (
                    <WortsalatGame
                      key={vistaVSession.k}
                      deck={mazo}
                      cartasFijas={vistaVSession.cartasFijas}
                      onExit={() => returnToDeck(vistaVSession.deckId, 'ejercicios', vistaVSession.origen)}
                      onFinish={(data) => setView({ name: 'vsummary', data: { ...aplicarBonoRachaFinal(data), origen: vistaVSession.origen } })}
                    />
                  ) : vistaVSession.vmode === 'hangman' ? (
                    <HangmanGame
                      key={vistaVSession.k}
                      deck={mazo}
                      cartasFijas={vistaVSession.cartasFijas}
                      onExit={() => returnToDeck(vistaVSession.deckId, 'ejercicios', vistaVSession.origen)}
                      onFinish={(data) => setView({ name: 'vsummary', data: { ...aplicarBonoRachaFinal(data), origen: vistaVSession.origen } })}
                    />
                  ) : vistaVSession.vmode === 'blitz' ? (
                    <BlitzGame
                      key={vistaVSession.k}
                      deck={mazo}
                      cartasFijas={vistaVSession.cartasFijas}
                      onExit={() => returnToDeck(vistaVSession.deckId, 'ejercicios', vistaVSession.origen)}
                      onFinish={(data) => setView({ name: 'vsummary', data: { ...aplicarBonoRachaFinal(data), origen: vistaVSession.origen } })}
                    />
                  ) : (
                    <VocabSession
                      key={vistaVSession.k}
                      deck={mazo}
                      mode={vistaVSession.vmode}
                      finishTopic={vistaVSession.fallos === 'faltan'}
                      fallos={Boolean(vistaVSession.fallos && vistaVSession.fallos !== 'faltan')}
                      dir={vistaVSession.dir}
                      cartasFijas={vistaVSession.cartasFijas}
                      reviewMode={vistaVSession.reviewMode}
                      onExit={() => vistaVSession.reviewMode === 'marked'
                        ? volverAlInicioDeLaPagina(() => returnToDeck(vistaVSession.deckId, 'ejercicios', vistaVSession.origen))
                        : volverDeJuego(vistaVSession.deckId, vistaVSession.vmode, vistaVSession.origen)}
                      onFinish={(data) => setView({ name: 'vsummary', data: { ...aplicarBonoRachaFinal(data), origen: vistaVSession.origen } })}
                    />
                  )
                }
              </MazoConIA>
            </div>
          </ExerciseActiveContext.Provider>
        )}

        {vistaVCrossword && (
          <ExerciseActiveContext.Provider value={vistaVCrossword.ejercicioVisible}>
            <div style={vistaVCrossword.ejercicioVisible ? undefined : { display: 'none' }} aria-hidden={!vistaVCrossword.ejercicioVisible}>
              {vocabulario?.getDeck(vistaVCrossword.deckId) ? (
                <CrosswordGame
                  key={vistaVCrossword.k}
                  deck={vocabulario.getDeck(vistaVCrossword.deckId)}
                  onExit={() => returnToDeck(vistaVCrossword.deckId, 'ejercicios', vistaVCrossword.origen)}
                  onFinish={(data) => setView({ name: 'vsummary', data: { ...aplicarBonoRachaFinal(data), origen: vistaVCrossword.origen } })}
                />
              ) : (
                <div className="card center stack" role="alert">
                  <p>{t('voc.crosswordDeckMissing')}</p>
                  <button className="btn-ghost" onClick={() => returnToDeck(vistaVCrossword.deckId, 'ejercicios', vistaVCrossword.origen)}>
                    {t('back')}
                  </button>
                </div>
              )}
            </div>
          </ExerciseActiveContext.Provider>
        )}

        {view.name === 'vsummary' && (
          <VocabSummary
            data={view.data}
            /* Las que se te han escapado, otra vez. Emparejar no lo ofrece:
               alli la tanda es una parrilla de parejas, no una lista de
               tarjetas que se pueda repetir tal cual. */
            onRepetirFallos={REPETIBLES.includes(view.data.mode) && view.data.missed?.length
              ? () =>
                  setViewProxy({
                    name: 'vsession',
                    deckId: view.data.deck.id,
                    vmode: view.data.mode,
                    dir: view.data.dir || null,
                    cartasFijas: view.data.missed,
                    origen: view.data.origen,
                    k: Date.now()
                  })
              : view.data.mode === 'uebersetzen' && view.data.missed?.length
              ? () => traducir(view.data.lektionId, view.data.dir || 'mix', view.data.nivel || 'all', view.data.missed)
              : view.data.mode === 'komm-reto' && view.data.missed?.length
              ? () => setViewProxy({
                  name: 'kommreto',
                  lektionId: view.data.lektionId,
                  itemsFijos: view.data.missed,
                  k: Date.now()
                })
              : null}
            onRepeat={() =>
              view.data.mode === 'uebersetzen'
                ? traducir(view.data.lektionId, view.data.dir || 'mix', view.data.nivel || 'all')
                : view.data.mode === 'komm-reto'
                ? setViewProxy({ name: 'kommreto', lektionId: view.data.lektionId, k: Date.now() })
                : view.data.mode === 'gender'
                ? setView({ name: 'gender', k: Date.now() })
                : startVocab(view.data.deck.id, view.data.mode, false, view.data.dir, null, view.data.origen)
            }
            onDeck={() => volverAlInicioDeLaPagina(() =>
              view.data.mode === 'uebersetzen'
                ? (view.data.lektionId
                    ? setViewProxy({ name: 'kommlektion', lektionId: view.data.lektionId, tab: 'ejercicios' })
                    : go('komm'))
                : view.data.mode === 'komm-reto'
                ? setViewProxy({ name: 'kommlektion', lektionId: view.data.lektionId, tab: 'ejercicios' })
                : view.data.mode === 'gender'
                ? go('vocab')
                : returnToDeck(view.data.deck.id, 'ejercicios')
            )}
          />
        )}

        {vistaKomm && (
          <ExerciseActiveContext.Provider value={kommVisible}>
            <div style={kommVisible ? undefined : { display: 'none' }} aria-hidden={!kommVisible}>
              {['komm', 'kommlektion'].includes(vistaKomm.name) && (
                <Kommunikation
                  lektionId={vistaKomm.name === 'kommlektion' ? vistaKomm.lektionId : undefined}
                  // La pestaña y la conversación se conservan en la instancia
                  // oculta mientras se consulta otra sección.
                  tab={vistaKomm.tab}
                  onTab={setTab}
                  onOpen={(lektionId) => setViewProxy({ name: 'kommlektion', lektionId })}
                  onTraducir={traducir}
                  onReto={startKommReto}
                  dialog={vistaKomm.dialog}
                  busy={vistaKomm.busy}
                  setDialog={(dialog) => {
                    if (kommVisible) setViewProxy((v) => ({ ...v, dialog }));
                    else {
                      if (memoria.current.komm) memoria.current.komm = { ...memoria.current.komm, dialog };
                      setVistaKommGuardada((v) => v ? { ...v, dialog } : v);
                    }
                  }}
                  setBusy={(busy) => {
                    if (kommVisible) setViewProxy((v) => ({ ...v, busy }));
                    else {
                      if (memoria.current.komm) memoria.current.komm = { ...memoria.current.komm, busy };
                      setVistaKommGuardada((v) => v ? { ...v, busy } : v);
                    }
                  }}
                  onBack={() => go('komm')}
                />
              )}

              {vistaKomm.name === 'traducir' && (
                <TranslateGame
                  key={vistaKomm.k}
                  lektionId={vistaKomm.lektionId}
                  dir={vistaKomm.dir}
                  nivel={vistaKomm.nivel}
                  cartasFijas={vistaKomm.cartasFijas}
                  onExit={() => go('komm')}
                  onFinish={(data) => setView({
                    name: 'vsummary',
                    data: {
                      ...aplicarBonoRachaFinal(data),
                      dir: vistaKomm.dir,
                      nivel: vistaKomm.nivel,
                      lektionId: vistaKomm.lektionId,
                      volverA: 'tema'
                    }
                  })}
                />
              )}

              {vistaKomm.name === 'kommreto' && (
                <KommReto
                  key={vistaKomm.k}
                  lektionId={vistaKomm.lektionId}
                  itemsFijos={vistaKomm.itemsFijos}
                  onExit={() => setViewProxy({ name: 'kommlektion', lektionId: vistaKomm.lektionId, tab: 'ejercicios' })}
                  onFinish={(data) => setView({
                    name: 'vsummary',
                    data: {
                      ...aplicarBonoRachaFinal(data),
                      mode: 'komm-reto',
                      deck: { ...data.deck, id: 'komm:' + vistaKomm.lektionId, emoji: '💬' },
                      lektionId: vistaKomm.lektionId,
                      volverA: 'tema'
                    }
                  })}
                />
              )}
            </div>
          </ExerciseActiveContext.Provider>
        )}

        {vistaKasus && (
          <ExerciseActiveContext.Provider value={vistaKasus.ejercicioVisible}>
            <div style={vistaKasus.ejercicioVisible ? undefined : { display: 'none' }} aria-hidden={!vistaKasus.ejercicioVisible}>
              <KasusGame
                key={vistaKasus.k}
                filtro={vistaKasus.filtro}
                onExit={() => go('grammar')}
                onFinish={(data) => setView({ name: 'vsummary', data: aplicarBonoRachaFinal(data) })}
              />
            </div>
          </ExerciseActiveContext.Provider>
        )}

        {!SIN_IA && view.name === 'news' && <News />}
        {!SIN_IA && view.name === 'lieder' && <Lieder />}

        {view.name === 'diary' && (
          <Diary onOpen={(entryId) => setViewProxy({ name: 'dentry', entryId })} />
        )}

        {/* `onDeleted` faltaba en las dos pantallas de entrada, aquí y en la
            del Notizbuch. Borrar sí borraba, pero justo después onDeleted()
            petaba por no ser una función y la pantalla se quedaba quieta
            enseñando una entrada que ya no existía. */}
        {view.name === 'dentry' && (
          <DiaryEntry
            entryId={view.entryId}
            onBack={() => go('diary')}
            onDeleted={() => go('diary')}
            onRefresh={() => setViewProxy({ name: 'dentry', entryId: view.entryId, k: Date.now() })}
          />
        )}

        {!SIN_IA && view.name === 'pruefung' && (
          <Pruefung
            onStart={(teil, typ) => setViewProxy({ name: 'exam', teil, typ, k: Date.now() })}
          />
        )}

        {!SIN_IA && view.name === 'exam' && view.teil === 'schreiben' && (
          <ExamSchreiben key={view.k} typ={view.typ} onBack={() => go('pruefung')} />
        )}
        {!SIN_IA && view.name === 'exam' && view.teil === 'sprechen' && (
          <ExamSprechen key={view.k} typ={view.typ} onBack={() => go('pruefung')} />
        )}
        {!SIN_IA && view.name === 'exam' && (view.teil === 'lesen' || view.teil === 'hoeren') && (
          <ExamLesenHoeren key={view.k} teil={view.teil} typ={view.typ} onBack={() => go('pruefung')} />
        )}

        {!PORTABLE && view.name === 'notebook' && (
          <Notebook
            onOpen={(noteId) => setViewProxy({ name: 'note', noteId })}
            onSession={() => setViewProxy({ name: 'nsession', k: Date.now() })}
          />
        )}

        {!PORTABLE && view.name === 'note' && (
          <NotebookEntry
            noteId={view.noteId}
            onBack={() => go('notebook')}
            onDeleted={() => go('notebook')}
            onRefresh={() => setViewProxy({ name: 'note', noteId: view.noteId, k: Date.now() })}
            onReview={(noteId) => setView({ name: 'nsession', noteId, k: Date.now() })}
          />
        )}

        {!PORTABLE && view.name === 'nsession' && (
          <NotebookSession
            key={view.k}
            note={getNote(view.noteId)}
            lektion={getLektion(getNote(view.noteId)?.lektionId)}
            itemsFijos={view.itemsFijos}
            onExit={() => setView({ name: 'note', noteId: view.noteId })}
            onFinish={(data) => setView({ name: 'nsummary', data: aplicarBonoRachaFinal(data), noteId: view.noteId })}
          />
        )}

        {!PORTABLE && view.name === 'nsummary' && (
          <VocabSummary
            data={view.data}
            onRepeat={() => setView({ name: 'nsession', noteId: view.noteId, k: Date.now() })}
            onRepetirFallos={() => setView({ name: 'nsession', noteId: view.noteId, itemsFijos: view.data.fallos, k: Date.now() })}
            onDeck={() => setView({ name: 'note', noteId: view.noteId })}
          />
        )}

        {view.name === 'leaderboard' && <Leaderboard onBack={() => go('home')} />}
        {view.name === 'settings' && <Settings onBack={() => go('home')} />}
        </>}
        </Suspense>
      </main>
      </div>
    </AppErrorBoundary>
  );
}

function LoadingIndicator() {
  return (
    <div className="loading-screen loading-screen-app" role="status" aria-live="polite">
      <span className="loading-mark" aria-hidden="true" />
      <strong>{t('loading')}</strong>
      <span className="loading-subline" aria-hidden="true"><i /><i /><i /></span>
    </div>
  );
}
