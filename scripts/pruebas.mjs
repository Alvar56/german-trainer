// Las cuentas de la app, comprobadas.
//
// Los otros dos scripts (smoke-sesiones, smoke-komm) miran que SALGAN
// ejercicios. Este mira que los numeros esten bien: la racha, los
// congeladores, los porcentajes, el reinicio y la fusion entre aparatos.
//
// Existe porque todos los fallos que comprueba han pasado de verdad:
// congeladores que no perdonaban dos dias, "Reiniciar progreso" que no
// reiniciaba, el porcentaje de Kommunikation a saltos de veinte, y una
// sincronizacion que se llevaba por delante lo del otro aparato.
//
//   node scripts/pruebas.mjs

const mem = new Map();
globalThis.localStorage = {
  getItem: (k) => (mem.has(k) ? mem.get(k) : null),
  setItem: (k, v) => mem.set(k, String(v)),
  removeItem: (k) => mem.delete(k),
  // Para recorrerlo, como hacen exportAll() y resetAll().
  get length() { return mem.size; },
  key: (i) => [...mem.keys()][i] ?? null
};
globalThis.window = { addEventListener() {} };
globalThis.fetch = async () => ({ ok: false, status: 0, json: async () => ({}) });

const RealDate = Date;
function enElDia(iso) {
  const fijo = new RealDate(iso + 'T12:00:00');
  globalThis.Date = class extends RealDate {
    constructor(...a) { return a.length ? new RealDate(...a) : fijo; }
    static now() { return fijo.getTime(); }
  };
}
function relojNormal() {
  globalThis.Date = RealDate;
}

let hechas = 0;
let fallos = 0;
const grupos = [];

function grupo(nombre) {
  grupos.push(nombre);
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

const iguales = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// ---------------------------------------------------------------------------
const streak = await import('../src/lib/streak.js');
const progress = await import('../src/lib/progress.js');
const vocab = await import('../src/lib/vocab.js');
const { fusionarClave } = await import('../src/lib/fusion.js');
const kommTipos = await import('../src/lib/kursbuch/kommTipos.js');
const kommBook = await import('../src/lib/kursbuch/index.js');
const kommRespuestas = await import('../src/lib/kursbuch/respuestas.js');

// Las pruebas preparan y borran los datos directamente en `mem`, por debajo
// de storage.js: su caché de lecturas tiene que enterarse.
const { olvidarCache } = await import('../src/lib/storage.js');
for (const metodo of ['clear', 'set', 'delete']) {
  const original = mem[metodo].bind(mem);
  mem[metodo] = (...args) => {
    const r = original(...args);
    olvidarCache();
    return r;
  };
}

// ---------------------------------------------------------------------------
grupo('Los huecos no piden nombres ni datos memorizados');
{
  const frase = 'Zu mir, und wenn ich nicht da bin, zu Frau Berger.';
  const palabras = frase.split(/\s+/);
  const indice = kommTipos.palabraTapable(palabras);
  comprobar('no se tapa el apellido de Frau Berger', indice !== null && palabras[indice] !== 'Berger.');
  comprobar('el hueco propuesto en esa frase se puede deducir',
    indice !== null && kommTipos.palabraHuecoValida(palabras[indice]),
    indice === null ? 'no hay palabra apta' : palabras[indice]);
  comprobar('se rechazan nombres, fechas y cifras',
    !kommTipos.palabraHuecoValida('Berger') &&
    !kommTipos.palabraHuecoValida('Montag') &&
    !kommTipos.palabraHuecoValida('18'));

  const frases = kommBook.KURSBUCH.lektionen.flatMap((l) =>
    (l.kommunikation || []).flatMap((k) =>
      (k.wendungen || []).flatMap((w) => [w, ...kommRespuestas.seguimientoDe(w.de)])
    )
  );
  const inseguras = frases.flatMap((w) => {
    const tokens = String(w.de).trim().split(/\s+/);
    const i = kommTipos.palabraTapable(tokens);
    return i !== null && !kommTipos.palabraHuecoValida(tokens[i])
      ? [{ frase: w.de, respuesta: tokens[i] }]
      : [];
  });
  comprobar('todas las lecciones evitan huecos con nombres, fechas o cifras', inseguras.length === 0,
    `${inseguras.length} respuestas no aptas de ${frases.length} frases`);
}

// ---------------------------------------------------------------------------
grupo('Racha de dias y congeladores');
{
  const jugar = (dias) => {
    mem.clear();
    for (const d of dias) { enElDia(d); streak.recordActivity(10, 11_000); }
    relojNormal();
    return streak.getStreak();
  };

  const seguido = jugar(['2026-09-01', '2026-09-02', '2026-09-03']);
  comprobar('tres dias seguidos son racha de 3', seguido.current === 3, 'sale ' + seguido.current);

  const unHueco = jugar(['2026-09-01', '2026-09-02', '2026-09-04']);
  comprobar('faltar un dia gasta un congelador y la racha sigue',
    unHueco.current === 3 && unHueco.freezes === 1,
    'racha ' + unHueco.current + ', congeladores ' + unHueco.freezes);

  const dosHuecos = jugar(['2026-09-01', '2026-09-02', '2026-09-05']);
  comprobar('faltar DOS dias gasta dos congeladores y la racha sigue',
    dosHuecos.current === 3 && dosHuecos.freezes === 0,
    'racha ' + dosHuecos.current + ', congeladores ' + dosHuecos.freezes);

  const demasiado = jugar(['2026-09-01', '2026-09-02', '2026-09-06']);
  comprobar('faltar mas dias que congeladores rompe la racha', demasiado.current === 1,
    'sale ' + demasiado.current);

  const cinco = jugar(['01', '02', '03', '04', '05'].map((d) => '2026-09-' + d));
  comprobar('a los 5 dias seguidos cae un congelador', cinco.freezes === 3,
    'congeladores ' + cinco.freezes);

  const largo = jugar(Array.from({ length: 12 }, (_, i) => `2026-09-${String(i + 1).padStart(2, '0')}`));
  comprobar('el tope de congeladores es 3', largo.freezes === streak.MAX_FREEZES);
  comprobar('el record no baja', largo.longest === 12, 'sale ' + largo.longest);

  const atras = jugar(['2026-09-10', '2026-09-11', '2026-09-05']);
  comprobar('el reloj hacia atras no suma un dia de regalo', atras.current === 2,
    'sale ' + atras.current);
}

// ---------------------------------------------------------------------------
grupo('Los porcentajes suben acierto a acierto');
{
  const reglas = ['r1', 'r2', 'r3', 'r4'];
  const pasos = [];
  for (const n of [0, 1, 2, 15, 30]) {
    mem.clear();
    for (let i = 0; i < n; i++) progress.recordAnswer('r1', true);
    pasos.push(progress.topicMastery(reglas).pct);
  }
  comprobar('gramatica: 4 reglas x 30 aciertos', iguales(pasos, [0, 1, 2, 13, 25]), pasos.join(','));

  const funcs = ['a', 'b', 'c', 'd'].map((f) => ({ funktion: f }));
  const komm = [];
  for (const n of [0, 1, 2, 10, 30]) {
    mem.clear();
    for (let i = 0; i < n; i++) progress.recordKommPracticed('L', 'a', 1, 1);
    komm.push(progress.kommMastery('L', funcs).pct);
  }
  comprobar('kommunikation: 4 apartados x 30 aciertos', iguales(komm, [0, 1, 2, 8, 25]), komm.join(','));

  const mazo = { id: 'm', cards: Array.from({ length: 10 }, (_, i) => ({ de: 'w' + i })) };
  const voc = [];
  for (const n of [0, 1, 2, 5]) {
    mem.clear();
    for (let i = 0; i < n; i++) vocab.recordCard('w0', true);
    voc.push(vocab.deckStats(mazo).pct);
  }
  comprobar('vocabulario: 10 palabras x 2 aciertos', iguales(voc, [0, 5, 10, 10]), voc.join(','));
}

// ---------------------------------------------------------------------------
grupo('Reiniciar el progreso lo deja vacio');
{
  mem.clear();
  for (let i = 0; i < 5; i++) progress.recordAnswer('modal:muessen', true);
  progress.recordKommPracticed('L', 'a', 3, 3);
  progress.resetProgress();
  const guardado = JSON.parse(mem.get('dtrainer:progress'));
  comprobar('no quedan conceptos', Object.keys(guardado.concepts).length === 0);
  comprobar('no quedan apartados', Object.keys(guardado.kommPracticed).length === 0);
  comprobar('el concepto vuelve a cero', progress.getConcept('modal:muessen').correct === 0);
}

// ---------------------------------------------------------------------------
grupo('El vocabulario va por palabra, no por mazo');
{
  mem.clear();
  const enLeccion = { id: 'kb-x-t1', cards: [{ de: 'das Brot' }, { de: 'die Milch' }] };
  const suelto = { id: 'comida', cards: [{ de: 'das Brot' }, { de: 'der Kaese' }] };
  vocab.recordCard('das Brot', true);
  vocab.recordCard('das Brot', true);
  comprobar('el acierto cuenta en el mazo de la leccion', vocab.deckStats(enLeccion).pct === 50);
  comprobar('y tambien en el mazo suelto', vocab.deckStats(suelto).pct === 50);

  mem.clear();
  mem.set('dtrainer:vocab:progress', JSON.stringify({
    'kb-x-t1::das Brot': { correct: 1, wrong: 0, strength: 2, lastSeen: 100, due: 200 },
    'comida::das Brot': { correct: 1, wrong: 1, strength: 1, lastSeen: 300, due: 400, color: 'verde' }
  }));
  const fus = vocab.cardProg('das Brot');
  comprobar('lo guardado de antes se junta sin perder nada',
    fus.correct === 2 && fus.wrong === 1 && fus.strength === 2 && fus.color === 'verde',
    JSON.stringify(fus));
}

// ---------------------------------------------------------------------------
grupo('Sincronizar entre dos aparatos no pierde nada');
{
  const movil = { 'w::A': { correct: 2, wrong: 0, strength: 2, lastSeen: 10, due: 20 },
                  'w::C': { correct: 1, wrong: 0, strength: 1, lastSeen: 30, due: 40 } };
  const orden = { 'w::A': { correct: 1, wrong: 1, strength: 1, lastSeen: 50, due: 60 },
                  'w::B': { correct: 3, wrong: 0, strength: 3, lastSeen: 70, due: 80 } };
  const j = fusionarClave('vocab:progress', orden, movil);
  comprobar('estan las palabras de los dos', iguales(Object.keys(j).sort(), ['w::A', 'w::B', 'w::C']),
    Object.keys(j).join(','));
  comprobar('de la palabra repetida se queda lo mas alto',
    j['w::A'].correct === 2 && j['w::A'].wrong === 1);
  comprobar('juntar dos veces da lo mismo (no se infla)',
    iguales(fusionarClave('vocab:progress', j, movil), j));
  comprobar('da igual el orden',
    iguales(fusionarClave('vocab:progress', movil, orden), j));

  const resetServer = {
    concepts: { rule: { resetAt: 1000, correct: 6, correctBase: 6, correctCarriles: {}, wrong: 2, lastSeen: 500 } },
    kommPracticed: { 'L:funktion': { resetAt: 1000, aciertos: 6, aciertosBase: 6, aciertosCarriles: {}, at: 500 } },
    sessions: 3
  };
  const datosAntiguos = {
    concepts: { rule: { correct: 32, correctBase: 31, correctCarriles: { device: 1 }, wrong: 5, lastSeen: 900 } },
    kommPracticed: { 'L:funktion': { aciertos: 28, at: 900, preguntas: 30 } },
    sessions: 5
  };
  const resetFusionado = fusionarClave('progress', datosAntiguos, resetServer);
  comprobar('el reinicio prevalece sobre conceptos antiguos', resetFusionado.concepts.rule.correct === 6,
    String(resetFusionado.concepts.rule.correct));
  comprobar('el reinicio prevalece sobre funciones antiguas', resetFusionado.kommPracticed['L:funktion'].aciertos === 6,
    String(resetFusionado.kommPracticed['L:funktion'].aciertos));
  comprobar('el contador de sesiones sigue conservando el mayor', resetFusionado.sessions === 5);
  const progresoNuevo = {
    concepts: { rule: { resetAt: 1000, correct: 7, correctBase: 6, correctCarriles: { device: 1 }, wrong: 2, lastSeen: 1100 } },
    kommPracticed: { 'L:funktion': { resetAt: 1000, aciertos: 7, aciertosBase: 6, aciertosCarriles: { device: 1 }, at: 1100 } }
  };
  const respuestaPosterior = fusionarClave('progress', progresoNuevo, resetServer);
  comprobar('el reinicio conserva respuestas posteriores', respuestaPosterior.concepts.rule.correct === 7
    && respuestaPosterior.kommPracticed['L:funktion'].aciertos === 7);

  const notasA = [{ id: 1, updatedAt: 100, title: 'vieja' }, { id: 2, updatedAt: 200, title: 'solo aqui' }];
  const notasB = [{ id: 1, updatedAt: 300, title: 'nueva' }, { id: 3, updatedAt: 400, title: 'solo alli' }];
  const n = fusionarClave('notebook:notes', notasA, notasB);
  comprobar('estan los apuntes de los dos aparatos', n.length === 3, 'salen ' + n.length);
  comprobar('de la nota tocada en los dos se queda la ultima',
    n.find((x) => x.id === 1).title === 'nueva');

  const rachaA = { current: 3, longest: 5, freezes: 1, totalXp: 100, lastDay: '2026-09-10', history: { '2026-09-10': 30 } };
  const rachaB = { current: 2, longest: 8, freezes: 3, totalXp: 80, lastDay: '2026-09-09', history: { '2026-09-09': 20 } };
  const r = fusionarClave('streak', rachaA, rachaB);
  comprobar('el historial de dias se junta', Object.keys(r.history).length === 2);
  comprobar('el record se queda con el mas alto', r.longest === 8);
  // Los congeladores se cuentan con el historial ya junto: antes se quedaban
  // con el mas bajo y el aparato atrasado se comia los ya ganados.
  comprobar('la racha se cuenta con el historial junto', r.current === 2 && r.freezes === 2, `racha ${r.current}, congeladores ${r.freezes}`);
  const diez = {};
  for (let d = 1; d <= 10; d++) diez[`2026-09-${String(d).padStart(2, '0')}`] = 30;
  const seis = Object.fromEntries(Object.entries(diez).slice(0, 6));
  const alDia = { current: 10, longest: 10, freezes: 3, totalXp: 300, lastDay: '2026-09-10', history: diez };
  const atrasado = { current: 6, longest: 6, freezes: 1, totalXp: 180, lastDay: '2026-09-06', history: seis };
  const rr = fusionarClave('streak', alDia, atrasado);
  comprobar('el aparato atrasado no se come los congeladores ganados', rr.freezes === 3 && rr.current === 10, `racha ${rr.current}, congeladores ${rr.freezes}`);

  const crucigramasA = {
    'a11-l1': { updatedAt: 100, signature: 'tema-1', puzzles: [{ entries: ['HAUS'] }] },
    'a11-l2': { updatedAt: 120, signature: 'tema-2', puzzles: [{ entries: ['BROT'] }] }
  };
  const crucigramasB = {
    'a11-l1': { updatedAt: 200, signature: 'tema-1', puzzles: [{ entries: ['LAND'] }] },
    'a21-l1': { updatedAt: 180, signature: 'tema-3', puzzles: [{ entries: ['WASSER'] }] }
  };
  const c = fusionarClave('vocab:crossword-sessions', crucigramasA, crucigramasB);
  comprobar('cada leccion conserva su sesion de crucigrama',
    iguales(Object.keys(c).sort(), ['a11-l1', 'a11-l2', 'a21-l1']));
  comprobar('la sesion mas reciente conserva su tablero y sus respuestas',
    c['a11-l1'].puzzles[0].entries[0] === 'LAND');
  const borrada = fusionarClave('vocab:crossword-sessions', c, {
    'a11-l1': { updatedAt: 300, deleted: true }
  });
  comprobar('al cerrar la ultima sesion prevalece el cierre al sincronizar',
    borrada['a11-l1'].deleted === true);

  comprobar('una clave sin forma de juntarse se deja al que llama',
    fusionarClave('monedas', 10, 20) === undefined);
}

// ---------------------------------------------------------------------------
grupo('Con la app en ingles, las respuestas tambien');
{
  mem.clear();
  // setLang y no escribir la clave a mano: i18n guarda el idioma en una
  // variable del modulo al cargarse, asi que tocar localStorage despues no
  // cambia nada.
  const { setLang } = await import('../src/lib/i18n.js');
  setLang('en');
  const resp = await import('../src/lib/kursbuch/respuestas.js');

  // Las traducciones estaban en en.js desde siempre, pero nadie llamaba a
  // tc(): en un test de "que significa" salian dos opciones en ingles -las del
  // libro- y dos en castellano, las de aqui. Con dos idiomas en la misma lista
  // la respuesta buena canta sola.
  //
  // Se miran TODAS las respuestas y no una frase concreta: la de antes estaba
  // escrita a mano aqui y el dia que esa frase salio del libro la prueba
  // empezo a fallar sin que hubiera nada roto.
  //
  // Solo ¿ ¡ ñ: las vocales con tilde salen tambien en nombres que no se
  // traducen (Alvaro, Sofia, Oztuerk), asi que marcarlas daria falsos fallos.
  const castellano = /[ñ¿¡]/;
  const { KURSBUCH } = await import('../src/lib/kursbuch/index.js');
  const frases = [];
  for (const b of KURSBUCH.baende) {
    for (const l of b.lektionen) {
      for (const k of l.kommunikation || []) for (const w of k.wendungen) frases.push(w.de);
    }
  }

  const malResp = frases.filter((f) => { const r = resp.respuestaDe(f); return r && castellano.test(r.es); });
  comprobar('ninguna respuesta sale en castellano', malResp.length === 0,
    malResp.length + ' de ' + frases.length);

  const conTurnos = frases.filter((f) => resp.conversacionDe(f).length > 0);
  const malTurnos = conTurnos.filter((f) => resp.conversacionDe(f).some((x) => castellano.test(x.es)));
  comprobar('los turnos de la conversacion tampoco',
    conTurnos.length > 0 && malTurnos.length === 0, malTurnos.length + ' de ' + conTurnos.length);

  const conSeg = frases.filter((f) => (resp.seguimientoDe(f) || []).length > 0);
  const malSeg = conSeg.filter((f) => resp.seguimientoDe(f).some((x) => castellano.test(x.es)));
  comprobar('y los turnos de seguimiento',
    conSeg.length > 0 && malSeg.length === 0, malSeg.length + ' de ' + conSeg.length);
}

// ---------------------------------------------------------------------------
grupo('Practicar mueve la barra del mazo');
{
  mem.clear();
  const v = await import('../src/lib/vocab.js');
  // El caso que se reporto: una leccion a medias donde lo ya practicado esta
  // en el tope de aciertos y toca repasarlo. El repaso espaciado elegia justo
  // esas -"toca repasarla" puntua altisimo- y, como pasado el tope acertar no
  // suma, se jugaba una tanda entera de diez y el porcentaje no se movia.
  const cartas = v.allDecks().filter((d) => d.lektionId === 'a21-l1').flatMap((d) => d.cards);
  const deck = { id: 'prueba-barra', name: 'prueba', cards: cartas };
  const ayer = Date.now() - 24 * 3600e3;
  const prog = {};
  for (const c of cartas.slice(0, Math.round(cartas.length * 0.14))) {
    prog[`${deck.id}::${c.de}`] = { correct: 2, wrong: 0, strength: 3, lastSeen: ayer, due: ayer };
  }
  mem.set('dtrainer:vocab:progress', JSON.stringify(prog));

  const antes = v.deckStats(deck);
  for (const c of v.pickCards(deck, 10)) v.recordCard(c.de, true, { mode: 'quiz' });
  const despues = v.deckStats(deck);

  comprobar('una tanda acertada sube el porcentaje', despues.pct > antes.pct,
    `${antes.pct}% → ${despues.pct}%`);
  // Y no por casualidad: la tanda tiene que traer palabras que aun cuenten.
  //
  // Esto pedia ">= 8 de 10" y por eso tapaba el fallo a medias: colarse dos
  // llenas estaba permitido. Y se colaban, porque una nueva puntuaba 5+8=13 y
  // una llena por repasar 10+(6-3)=13, el mismo numero, con +-3 de azar
  // decidiendo. Fallaba dos veces de cada diez ejecuciones. Ahora que el
  // criterio va aparte de la puntuacion, tienen que entrar las diez.
  const quedan = cartas.filter((c) => (prog[`${deck.id}::${c.de}`]?.correct || 0) < 2).length;
  comprobar('mientras queden palabras sin llenar, la tanda las prefiere',
    quedan > 10 && despues.aciertos - antes.aciertos === 10,
    `+${despues.aciertos - antes.aciertos} aciertos de 10 preguntas`);

  // Y la tanda siguiente tambien, que era la otra mitad del problema: al
  // gastar en la primera las que faltaban, la regla de "no repetir lo de la
  // vez pasada" traia llenas y la barra se paraba igual.
  const entre = v.deckStats(deck);
  for (const c of v.pickCards(deck, 10)) v.recordCard(c.de, true, { mode: 'quiz' });
  const alFinal = v.deckStats(deck);
  comprobar('y la tanda siguiente sigue prefiriendolas',
    alFinal.aciertos - entre.aciertos === 10,
    `+${alFinal.aciertos - entre.aciertos} aciertos de 10 preguntas`);
}

// ---------------------------------------------------------------------------
grupo('La cache del almacen no se queda con datos viejos');
{
  mem.clear();
  const { storage } = await import('../src/lib/storage.js');

  storage.set('prueba:cache', { n: 1 });
  const a = storage.get('prueba:cache', {});
  comprobar('dos lecturas seguidas devuelven el mismo objeto (no se relee)',
    a === storage.get('prueba:cache', {}));

  storage.update('prueba:cache', {}, (p) => ({ ...p, n: 2 }));
  const b = storage.get('prueba:cache', {});
  comprobar('tras escribir se lee lo nuevo', b.n === 2, JSON.stringify(b));
  // React compara por referencia: si esto devolviera el mismo objeto, una
  // pantalla que guarda y vuelve a leer no se repintaria.
  comprobar('y en un objeto nuevo, para que React repinte', a !== b);

  const DEFECTO = { lista: [] };
  storage.get('prueba:vacia', DEFECTO).lista.push('x');
  comprobar('lo que falta sale como copia del valor por defecto, que no se ensucia',
    DEFECTO.lista.length === 0 && storage.get('prueba:vacia', DEFECTO).lista.length === 0);

  storage.remove('prueba:cache');
  comprobar('lo borrado deja de leerse', storage.get('prueba:cache', 'nada') === 'nada');

  storage.set('prueba:cache', { n: 3 });
  storage.get('prueba:cache', {});
  storage.resetAll();
  comprobar('reiniciar el progreso vacia tambien la cache',
    storage.get('prueba:cache', 'nada') === 'nada');
}

// ---------------------------------------------------------------------------
console.log('\n' + '-'.repeat(60));
console.log(`${hechas} comprobaciones · ${fallos} mal`);
if (fallos) process.exitCode = 1;
