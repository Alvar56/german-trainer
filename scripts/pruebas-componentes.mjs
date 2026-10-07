// Los ejercicios, pintados de verdad.
//
// Hasta ahora ninguna comprobacion llegaba a renderizar un componente:
// smoke-sesiones mira que la tanda TRAIGA material, pruebas.mjs mira que las
// cuentas salgan, y el build solo mira que el JavaScript compile. Entre las
// tres se cuela justo lo que mas se nota: un componente que compila, recibe su
// item y revienta al pintarlo. Eso solo se veia abriendo la app.
//
// Aqui cada ejercicio se pinta con un item de mentira y se mira el HTML que
// sale. Es un render de servidor (react-dom/server), asi que:
//
//   · NO hay eventos ni efectos: nada de comprobar que al pulsar pasa algo.
//     Para eso haria falta un DOM y una dependencia mas, y no la vale.
//   · Es UN solo render. El orden de los hooks entre un render y el siguiente
//     -lo que rompio TopicDetail, WordOrder y TranslateGame- lo vigila
//     hooks-tras-return.mjs, que lee el codigo. Lo que se comprueba aqui es la
//     otra mitad: que la pantalla de aviso de esos dos casos (item invalido,
//     tanda vacia) salga, en vez de tirar el render.
//
// El .jsx se traduce al vuelo con esbuild, que ya viene con vite. No se
// instala nada.
//
//   node scripts/pruebas-componentes.mjs

import { registerHooks } from 'node:module';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

registerHooks({
  load(url, ctx, next) {
    // El render de servidor de React no admite createPortal. Para revisar el
    // contenido de los ejercicios, la mascota decorativa se sustituye aquí
    // por un stub sin portal.
    if (url.endsWith('/FoxOverlay.jsx')) {
      return {
        format: 'module',
        shortCircuit: true,
        source: `export function useFox() { return { msg: '', gesto: 'normal', salta: false, acierto() {}, sigue() {} }; }\nexport default function FoxOverlay() { return null; }`
      };
    }
    // La celebración también se monta en un portal. No forma parte del HTML
    // del resumen que se comprueba aquí, así que se sustituye igual que Felix.
    if (url.endsWith('/Confeti.jsx')) {
      return { format: 'module', shortCircuit: true, source: 'export default function Confeti() { return null; }' };
    }
    if (!url.startsWith('file:') || !url.endsWith('.jsx')) return next(url, ctx);
    const codigoJsx = fs.readFileSync(fileURLToPath(url), 'utf8');
    const { code } = transformSync(codigoJsx, {
      loader: 'jsx',
      format: 'esm',
      jsx: 'automatic',
      sourcefile: url
    });
    return { format: 'module', shortCircuit: true, source: code };
  }
});

// Lo mismo que monta pruebas.mjs: los modulos de la app leen ajustes y
// progreso nada mas cargarse.
const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k)
};
globalThis.window = {
  addEventListener() {},
  removeEventListener() {},
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} })
};
globalThis.document = { addEventListener() {}, removeEventListener() {} };
globalThis.fetch = async () => ({ ok: false, status: 0, json: async () => ({}) });

// Umlaut mide el campo con useLayoutEffect y React avisa de que en servidor no
// corre. Es verdad y da igual: no se esta hidratando nada. El aviso se calla
// para que un fallo de verdad no quede sepultado entre diez repeticiones.
const errorReal = console.error;
console.error = (...args) => {
  if (String(args[0]).includes('useLayoutEffect does nothing on the server')) return;
  errorReal(...args);
};

const { setLang } = await import('../src/lib/i18n.js');
setLang('es');

const { renderToString } = await import('react-dom/server');
const React = (await import('react')).default;

let hechas = 0;
let fallos = 0;

function grupo(nombre) {
  console.log('\n' + nombre);
}

function comprobar(que, cierto, detalle = '') {
  hechas += 1;
  if (cierto) {
    console.log('   ok   ' + que);
  } else {
    fallos += 1;
    console.log('   MAL  ' + que + (detalle ? '  ->  ' + detalle : ''));
  }
}

// Pinta el componente y devuelve su HTML. Si revienta, lo cuenta como fallo y
// devuelve '' para que las comprobaciones de contenido fallen tambien y no
// parezca que ese ejercicio esta bien.
async function pinta(nombre, fichero, props) {
  try {
    const Comp = (await import(`../src/components/${fichero}.jsx`)).default;
    // El `<!-- -->` que React mete entre dos textos seguidos ({pct}%) es cosa
    // del render de servidor, para saber luego donde parte cada texto. En
    // pantalla no existe, asi que fuera: si no, buscar "80%" en el HTML no
    // encuentra nada y parece que el resumen no pinta el porcentaje.
    const html = renderToString(React.createElement(Comp, props)).replaceAll('<!-- -->', '');
    comprobar(`${nombre} se pinta`, html.length > 0, 'sale vacio');
    return html;
  } catch (e) {
    comprobar(`${nombre} se pinta`, false, e.message.split('\n')[0]);
    return '';
  }
}

const cuantos = (html, trozo) => html.split(trozo).length - 1;
const cuantosEnClase = (html, clase) =>
  [...html.matchAll(/class="([^"]*)"/g)]
    .filter(([, clases]) => clases.split(/\s+/).includes(clase)).length;

// ---------------------------------------------------------------------------
grupo('Test de opciones');
{
  const item = {
    id: 'mc1',
    prompt: 'Completa',
    sentence: 'ich ___ Brot.',
    answer: 'esse',
    options: ['esse', 'isst', 'essen']
  };
  const html = await pinta('MultipleChoice', 'MultipleChoice', { item, onAnswer() {} });
  comprobar('sale el enunciado', html.includes('Completa'));
  comprobar('capitaliza el inicio y parte la frase por el hueco', html.includes('Ich ') && html.includes(' Brot.'));
  comprobar('sale un boton por opcion', cuantos(html, 'class="option"') === 3, html);
  for (const o of item.options) comprobar(`sale la opcion "${o}"`, html.includes('>' + o + '</button>'));
  // El hueco no puede venir ya relleno: se resolveria mirando.
  comprobar('el hueco empieza vacio', !html.includes('blank filled'));

  // Dos cosas que hace el componente y que solo se ven pintadas: quita las
  // opciones repetidas y mete la respuesta si el frame se olvido de ponerla.
  const chapucero = {
    id: 'mc2',
    prompt: 'Completa',
    sentence: 'Du ___ Brot.',
    answer: 'isst',
    options: ['esse', 'esse', 'essen']
  };
  const html2 = await pinta('MultipleChoice con opciones sucias', 'MultipleChoice', { item: chapucero, onAnswer() {} });
  comprobar('quita la opcion repetida y mete la respuesta que faltaba',
    cuantos(html2, 'class="option"') === 3, html2);
  comprobar('la respuesta esta entre las opciones', html2.includes('>isst</button>'));
}

// ---------------------------------------------------------------------------
grupo('Ordenar la frase');
{
  const item = {
    tokens: ['Ich', 'esse', 'gern', 'Brot'],
    solution: ['Ich', 'esse', 'gern', 'Brot']
  };
  const html = await pinta('WordOrder', 'WordOrder', { item, onAnswer() {} });
  comprobar('sale una ficha por palabra', cuantosEnClase(html, 'wo-word') === 4, html);
  for (const p of item.tokens) comprobar(`sale la palabra "${p}"`, html.includes('>' + p + '</button>'));
  // Si empezara resuelta no habria nada que ordenar. El componente lo evita
  // cambiando las dos primeras.
  const orden = [...html.matchAll(/class="wo-word"[^>]*>([^<]+)</g)].map((m) => m[1]);
  comprobar('no empieza ya resuelta', orden.join(' ') !== item.solution.join(' '), orden.join(' '));

  // El caso del arreglo de hooks: un item sin tokens tiene que dar el aviso,
  // no tirar el render.
  const roto = await pinta('WordOrder con item invalido', 'WordOrder', { item: null, onAnswer() {} });
  comprobar('un item invalido da el aviso', roto.includes('Invalid item'), roto);
}

// ---------------------------------------------------------------------------
grupo('Huecos (cloze)');
{
  const item = {
    id: 'cz1',
    clozeText: 'Ich ___ Brot und ___ Wasser.',
    clozeAnswers: ['esse', 'trinke'],
    clozeChoices: ['esse', 'trinke', 'isst']
  };
  const html = await pinta('ClozeTest', 'ClozeTest', { item, onAnswer() {} });
  comprobar('hay un campo por hueco', cuantos(html, '<input') === 2, html);
  comprobar('sale el texto entre huecos', html.includes('Brot und'));
  for (const c of item.clozeChoices) comprobar(`sale la ficha "${c}"`, html.includes('>' + c + '<'));
  // Las respuestas no pueden ir en el HTML antes de contestar.
  comprobar('las respuestas no se chivan en el value',
    !/value="(esse|trinke)"/.test(html), html);
}

// ---------------------------------------------------------------------------
grupo('Escribir');
{
  const item = { id: 'w1', anweisung: 'Escribe el articulo', sentence: '___ Brot ist gut.', answer: 'Das' };
  const html = await pinta('WriteCard', 'WriteCard', { item, onAnswer() {} });
  comprobar('sale el enunciado del libro', html.includes('Escribe el articulo'));
  comprobar('sale la frase', html.includes(' Brot ist gut.'));
  comprobar('hay donde escribir', html.includes('<input'));
  comprobar('no se ve la respuesta antes de contestar', !html.includes('>Das<'), html);
}

// ---------------------------------------------------------------------------
grupo('¿Correcta o no?');
{
  const item = { id: 'j1', display: 'Ich habe gegessen Brot.', isCorrect: false };
  const html = await pinta('JudgeCard', 'JudgeCard', { item, onAnswer() {} });
  comprobar('sale la frase a juzgar', html.includes('Ich habe gegessen Brot.'));
  comprobar('hay dos botones con borde verde y rojo suave',
    html.includes('class="judge-btn yes"') && html.includes('class="judge-btn no"'), html);
  // Antes de contestar ninguno puede ir pintado de verde ni de rojo.
  comprobar('ningun boton se chiva', !/judge-btn (good|bad|dim)/.test(html), html);
}

// ---------------------------------------------------------------------------
grupo('Pregunta abierta');
{
  const item = { id: 'o1', prompt: 'Contesta en aleman', sentence: 'Was isst du gern?' };
  const html = await pinta('OpenQuestion', 'OpenQuestion', { item, onAnswer() {}, lektionId: null });
  comprobar('sale la pregunta', html.includes('Was isst du gern?'));
  comprobar('hay donde contestar', html.includes('<textarea') || html.includes('<input'));
}

// ---------------------------------------------------------------------------
grupo('Piezas sueltas');
{
  const pl = await pinta('PistaLetras', 'PistaLetras', { respuesta: 'Brot', pistas: 1, onPedir() {}, oculto: false });
  comprobar('el esqueleto tapa lo que aun no se ha pedido',
    pl.includes('B') && !pl.includes('>Brot<'), pl);

  const um = await pinta('Umlaut', 'Umlaut', { campo: { current: null }, onTexto() {} });
  for (const letra of ['ä', 'ö', 'ü', 'ß']) comprobar(`el teclado trae la ${letra}`, um.includes('>' + letra + '</button>'));
}

// ---------------------------------------------------------------------------
grupo('Ahorcado');
{
  const deck = {
    id: 'test-hangman',
    name: 'Test',
    emoji: '📚',
    cards: [{ id: 'haus', de: 'das Haus', es: 'la casa' }]
  };
  const html = await pinta('HangmanGame', 'HangmanGame', { deck, onExit() {}, onFinish() {} });
  const hints = html.indexOf('class="hang-pistas"');
  const giveUp = html.indexOf('class="btn-ghost hang-give-up"');
  const puzzle = html.indexOf('class="hang-reto"');
  comprobar('Give up queda debajo de las pistas y antes del teclado', hints >= 0 && giveUp > hints && puzzle > giveUp, html);
  comprobar('Give up muestra el atajo de teclado', html.includes('Intro / Espacio'));
}

// ---------------------------------------------------------------------------
grupo('Resumen de la tanda');
{
  const data = {
    topic: { nameEs: 'Comida' },
    correctCount: 8,
    total: 10,
    accuracy: 0.8,
    seconds: 125,
    xp: 40,
    streak: { events: [] },
    rank: null,
    mistakes: [],
    fallos: []
  };
  const html = await pinta('Summary', 'Summary', { data, onRepeat() {}, onHome() {} });
  comprobar('sale el porcentaje', html.includes('80%'), html.slice(0, 300));
  comprobar('salen los aciertos', html.includes('8') && html.includes('10'));
  comprobar('sale el tema de la tanda', html.includes('Comida'));

  // 10 de 10 tiene que decir otra cosa, que era el sentido de la pantalla.
  const pleno = await pinta('Summary con pleno', 'Summary', {
    data: { ...data, correctCount: 10, accuracy: 1 },
    onRepeat() {}, onHome() {}
  });
  comprobar('un pleno se celebra distinto', pleno.includes('🏆') && !html.includes('🏆'), pleno.slice(0, 200));
}

// ---------------------------------------------------------------------------
grupo('Traducir');
{
  const frases = [{ id: 'tr1', de: 'Ich esse gern Brot.', es: 'Me gusta comer pan.', dir: 'de-es' }];
  const html = await pinta('TranslateGame', 'TranslateGame', {
    onExit() {}, onFinish() {}, cartasFijas: frases
  });
  comprobar('sale la frase de origen', html.includes('Ich esse gern Brot.'));
  comprobar('no se ve la traduccion buena', !html.includes('Me gusta comer pan.'), 'la solucion va en el HTML');

  // El otro caso del arreglo de hooks: sin frases, aviso en vez de pantallazo.
  const vacia = await pinta('TranslateGame sin frases', 'TranslateGame', {
    onExit() {}, onFinish() {}, cartasFijas: []
  });
  comprobar('una tanda vacia avisa', vacia.includes('No hay frases'), vacia);
}

// ---------------------------------------------------------------------------
grupo('Blitz');
{
  const cartas = Array.from({ length: 12 }, (_, n) => ({ de: 'Wort' + n, es: 'palabra' + n }));
  const html = await pinta('BlitzGame', 'BlitzGame', {
    deck: { id: 'd', name: 'Prueba', emoji: '🧪', cards: cartas }, onExit() {}, onFinish() {}
  });
  comprobar('sale el boton de salir', html.includes('title="Salir (Esc)"') && html.includes('<svg'));
  // El boton de reiniciar comparte fila con la cruz. Ademas su estado (ronda)
  // se declara ANTES del barajado que lo lee: al reves, el array de
  // dependencias lo tocaba antes de existir y la pantalla se caia con
  // "Cannot access 'ronda' before initialization".
  comprobar('sale el boton de reiniciar', html.includes('blitz-reset'), html.slice(0, 300));
  comprobar('el reloj empieza entero', />\s*40s/.test(html) || />\s*\d+s/.test(html));
}

// ---------------------------------------------------------------------------
grupo('Diario (Tagebuch)');
{
  // Esta pantalla reventaba al abrir una entrada: usaba pick() sin haberlo
  // importado, y saltaba "pick is not defined". Es el tipo de fallo que no ve
  // ni el build ni un grep, porque solo pasa al ejecutar esa linea. Se cuela
  // aqui para que no vuelva.
  const diary = await import('../src/lib/diary.js');
  // createEntry nace siempre en blanco: se pasa el texto por updateEntry, que
  // es lo que hace la pantalla de verdad.
  const entrada = diary.createEntry({ title: 'Mein Tag' });
  diary.updateEntry(entrada.id, { text: 'Heute habe ich Deutsch gelernt.' });
  const html = await pinta('DiaryEntry', 'DiaryEntry', {
    entryId: entrada.id, onBack() {}, onDeleted() {}
  });
  comprobar('sale lo que escribiste', html.includes('Heute habe ich Deutsch gelernt.'), html.slice(0, 200));
  comprobar('sale el titulo guardado', html.includes('Mein Tag'));
  // Esta es la que caza el fallo: el hueco del titulo lo pinta pick().
  comprobar('sale el campo del titulo', html.includes('Título (opcional)'), html.slice(0, 200));

  // Una entrada que no existe tiene que dar el aviso, no reventar.
  const perdida = await pinta('DiaryEntry sin entrada', 'DiaryEntry', {
    entryId: 'no-existe', onBack() {}, onDeleted() {}
  });
  comprobar('una entrada que no existe avisa', perdida.includes('No se encontró'), perdida);
}

// ---------------------------------------------------------------------------
console.log('\n' + '-'.repeat(60));
console.log(`${hechas} comprobaciones · ${fallos} mal`);
if (fallos) process.exitCode = 1;
