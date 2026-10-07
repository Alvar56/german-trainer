// Idioma de la interfaz: español o inglés. El alemán nunca se traduce.
// Los textos que genera la IA también salen en este idioma (se le pasa en el prompt).

import { storage } from './storage.js';

const KEY = 'ui:lang';
const listeners = new Set();

let current = storage.get(KEY, null) || detect();

function detect() {
  const n = (navigator.language || 'es').toLowerCase();
  return n.startsWith('en') ? 'en' : 'es';
}

export function getLang() {
  return current;
}

export function setLang(l) {
  if (l !== 'es' && l !== 'en') return current;
  current = l;
  storage.set(KEY, l);
  listeners.forEach((fn) => fn(l));
  return current;
}

// Lo guardado por la IA lleva apuntado en que idioma se escribio. Si abres
// una correccion o unos apuntes limpiados en el otro idioma, se avisa: la app
// no los vuelve a traducir.
export function esOtroIdioma(lang) {
  return !!lang && lang !== current;
}

export function onLangChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

// Nombre del idioma para meterlo en los prompts de la IA. Va en castellano
// porque los prompts estan escritos en castellano: "la explicacion en ingles"
// se lee mejor que "la explicacion en English" y la IA se lia menos.
export function langName(l = current) {
  return l === 'en' ? 'inglés' : 'español';
}

// Locale para formatear fechas. Sin esto el calendario de la racha y las
// entradas del diario salian siempre en castellano ("Septiembre de 2026")
// aunque la app estuviera en ingles.
export function localeFecha(l = current) {
  return l === 'en' ? 'en-GB' : 'es-ES';
}

// Codigo corto del idioma del alumno para los rotulos de direccion:
// "DE → ES" en castellano, "DE → EN" en ingles.
export function codigoIdioma(l = current) {
  return l.toUpperCase();
}

export const LANGS = [
  { id: 'es', label: 'Español', flag: '🇪🇸' },
  { id: 'en', label: 'English', flag: '🇬🇧' }
];

// Idiomas que todavia no estan puestos. Se pintan en Ajustes apagados: un
// hueco marcado dice mas que no decir nada.
export const LANGS_PENDIENTES = [{ id: 'uk', label: 'Українська', flag: '🇺🇦' }];

// ---------- diccionario ----------
// Clave -> [español, inglés]. El alemán se queda como está.
const DICT = {
  // genéricos
  'back': ['Volver', 'Back'],
  'delete': ['Borrar', 'Delete'],
  'retry': ['Reintentar', 'Try again'],
  'loading': ['Cargando…', 'Loading…'],
  // Los pasos de cada espera larga. No son decorativos: describen lo que
  // realmente hace el proceso, en orden.
  'wait.wetterTitle': ['Actualizando el tiempo', 'Updating the weather'],
  'wait.newsTitle': ['Buscando noticias', 'Looking for news'],
  'wait.news1': ['Entrando en los medios austriacos…', 'Opening the Austrian media…'],
  'wait.news2': ['Leyendo los titulares de hoy…', 'Reading today’s headlines…'],
  'wait.news3': ['Descartando las que ya has visto…', 'Skipping the ones you have seen…'],
  'wait.news4': ['Buscando el vídeo de cada una…', 'Looking for a video for each…'],
  'wait.news5': ['Traduciendo y sacando vocabulario…', 'Translating and pulling vocabulary…'],

  'wait.songTitle': ['Buscando una canción', 'Looking for a song'],
  'wait.song1': ['Pensando qué te puede encajar…', 'Thinking what might suit you…'],
  'wait.song2': ['Comprobando que el vídeo existe…', 'Checking the video exists…'],
  'wait.song3': ['Mirando el nivel de la letra…', 'Checking the level of the lyrics…'],
  'wait.song4': ['Preparando vocabulario y gramática…', 'Preparing vocabulary and grammar…'],

  'wait.exTitle': ['Preparando la tarea de examen', 'Preparing the exam task'],
  'wait.ex1': ['Eligiendo la situación…', 'Choosing the situation…'],
  'wait.ex2': ['Escribiendo el texto…', 'Writing the text…'],
  'wait.ex3': ['Montando las preguntas y los distractores…', 'Building the questions and distractors…'],
  'wait.ex4': ['Repasando que no haya dos respuestas válidas…', 'Checking no question has two valid answers…'],

  'wait.itemsTitle': ['Preparando ejercicios', 'Preparing exercises'],
  'wait.items1': ['Leyendo lo que hay que practicar…', 'Reading what needs practising…'],
  'wait.items2': ['Escribiendo las frases…', 'Writing the sentences…'],
  'wait.items3': ['Repartiendo entre test, ordenar y escribir…', 'Mixing quiz, order and type-it…'],
  'wait.items4': ['Comprobando las soluciones…', 'Checking the answers…'],

  'wait.askTitle': ['Preparando la explicación', 'Preparing the explanation'],
  'wait.ask1': ['Buscando la regla…', 'Looking up the rule…'],
  'wait.ask2': ['Buscando ejemplos que se entiendan…', 'Finding examples that make sense…'],
  'wait.ask3': ['Montando la tabla y los fallos típicos…', 'Building the table and common mistakes…'],

  'generating': ['Generando…', 'Generating…'],
  'notFound': ['No se encontró.', 'Not found.'],
  'words': ['palabras', 'words'],
  'word': ['palabra', 'word'],
  'entries': ['entradas', 'entries'],
  'entry': ['entrada', 'entry'],
  'rules': ['reglas', 'rules'],
  'frames.pickOne': ['Elige la opción correcta', 'Choose the correct option'],
  'frames.orderIt': ['Ordena la frase', 'Put the sentence in order'],
  // Los mismos enunciados, pero sueltos: las plantillas de src/topics no
  // llevan el "Erganzen Sie:" delante.
  'frames.pickOneFull': ['Elige la opción correcta', 'Choose the correct option'],
  'frames.orderFull': ['Ordena las palabras para formar la frase', 'Put the words in order to make the sentence'],
  'frames.clozeFull': ['Completa el texto con las palabras del banco', 'Complete the text with the words from the bank'],
  'frames.clozeIt': ['Completa el texto', 'Complete the text'],
  // Enunciados de reserva para los ejercicios que genera la IA, por si no
  // devuelve el suyo.
  'ai.doExercise': ['Completa el ejercicio', 'Complete the exercise'],
  'ai.orderSentence': ['Ordena la frase', 'Put the sentence in order'],

  // Los minijuegos de vocabulario. "Wortsalat" y "Blitz" se quedan en aleman:
  // son el nombre del juego, no una descripcion.
  'vm.flashcards': ['Tarjetas', 'Flashcards'],
  'vm.flashcardsHint': ['Gírala y autoevalúate', 'Flip it and rate yourself'],
  'vm.quiz': ['Test', 'Quiz'],
  'vm.quizHint': ['Elige la traducción', 'Pick the translation'],
  'vm.write': ['Escribir', 'Type it'],
  'vm.writeHint': ['Teclea la palabra', 'Type the word'],
  'vm.match': ['Emparejar', 'Match'],
  'vm.matchHint': ['Une DE y ES contrarreloj', 'Match DE and EN against the clock'],
  'vm.wortsalatHint': ['Ordena las letras', 'Unscramble the letters'],
  'vm.blitzHint': ['30 segundos a contrarreloj', '30 seconds against the clock'],
  'vm.hangman': ['Ahorcado', 'Hangman'],
  'vm.hangmanHint': ['Adivina la palabra, con pistas', 'Guess the word, with hints'],
  'vsec.basico': ['Básico (A1)', 'Basics (A1)'],
  'vsec.temas': ['Temas', 'Topics'],
  'vsec.situaciones': ['Situaciones del día a día', 'Everyday situations'],
  'vsec.tipo': ['Por tipo de palabra', 'By word type'],

  // Los ejercicios de src/topics arman la frase con trozos (sujeto + verbo +
  // complemento). El molde va aqui, con {huecos}; los trozos se traducen por
  // separado con tc(). Antes eran plantillas de JS en castellano a pelo, asi
  // que en ingles salia la mitad de la frase sin traducir.
  'tp.sepEnd': ['"{inf}" es separable: en la frase principal el prefijo "{pref}" se va AL FINAL → "{fin} … {pref}".',
    '"{inf}" is separable: in a main clause the prefix "{pref}" goes TO THE END → "{fin} … {pref}".'],
  'tp.sepGe': ['Separable: el -ge- va EN MEDIO → "{pref}ge…": "{part}".',
    'Separable: the -ge- goes IN THE MIDDLE → "{pref}ge…": "{part}".'],
  'tp.insepGe': ['Inseparable (prefijo átono): NO se añade ge- → "{part}".',
    'Inseparable (unstressed prefix): NO ge- is added → "{part}".'],
  'tp.sepZu': ['Separable: el "zu" va EN MEDIO, pegado → "{zu}" (no "zu {inf}").',
    'Separable: the "zu" goes IN THE MIDDLE, joined on → "{zu}" (not "zu {inf}").'],
  'tp.insepZu': ['Inseparable: el "zu" va DELANTE y separado → "{zu}".',
    'Inseparable: the "zu" goes BEFORE it, as a separate word → "{zu}".'],
  'tp.sepNeben': ['En la subordinada el verbo separable se vuelve a UNIR y va al final: "…, weil {s} … {joined}".',
    'In a subordinate clause the separable verb JOINS BACK UP and goes last: "…, weil {s} … {joined}".'],
  'tp.sepOrder': ['Verbo conjugado en 2ª posición y el prefijo "{pref}" al final: "{fin} … {pref}".',
    'Conjugated verb in 2nd position and the prefix "{pref}" at the end: "{fin} … {pref}".'],
  // Glosas: el castellano ya usa el infinitivo ("mi compañero: recoger a los
  // niños"), asi que el ingles puede seguir el mismo molde.
  'tp.glossSubj': ['{s}: {v} {m}.', '{s}: {v} {m}.'],
  'tp.glossPerf': ['{s}: {aux} {v} {m}.', '{s}: {aux} {v} {m}.'],
  'tp.glossPlain': ['{s} {v} {m}.', '{s} {v} {m}.'],
  'tp.auxHe': ['he', 'have'],
  'tp.auxHa': ['ha', 'has'],
  'tp.wouldBeGood': ['Estaría bien {v} {m}.', 'It would be good to {v} {m}.'],
  'tp.becauseGloss': ['…porque {s}{v} {m}.', '…because {s}{v} {m}.'],
  // Enunciados de los ejercicios de src/topics.
  'tp.pickCloser': ['Elige lo que cierra la frase (verbo separable)', 'Choose what closes the sentence (separable verb)'],
  'tp.pickPart2': ['Elige el Partizip II correcto', 'Choose the correct Partizip II'],
  'tp.fillZu': ['Completa con el infinitivo con "zu"', 'Complete it with the "zu" infinitive'],
  'tp.orderWeil': ['Contexto: «Ich bin müde, …» — Ordena la subordinada con «weil»', 'Context: «Ich bin müde, …» — Put the «weil» clause in order'],
  'tp.orderPrefix': ['Ordena la frase (el prefijo separable va al final)', 'Put the sentence in order (the separable prefix goes last)'],
  'tp.mainGloss': ['{s} {v} {p}{adv}.', '{s} {v} {p}{adv}.'],
  'tp.fillModalPres': ['Completa con el verbo modal en presente', 'Complete it with the modal verb in the present'],
  'tp.modalExpl': ['Con "{de}" → "{correct}". El modal va en 2ª posición y el infinitivo ("{inf}") al final. "{m}" expresa {es}.',
    'With "{de}" → "{correct}". The modal goes in 2nd position and the infinitive ("{inf}") at the end. "{m}" expresses {es}.'],
  'tp.pickCloserForm': ['Elige la forma verbal que cierra la frase', 'Choose the verb form that closes the sentence'],
  'tp.modalSatzklammer': ['Tras el modal, el segundo verbo va al final en INFINITIVO sin "zu": "{inf}". Ni "{zu}" ni el participio "{part}".',
    'After a modal, the second verb goes last as a bare INFINITIVE, no "zu": "{inf}". Not "{zu}" and not the participle "{part}".'],
  'tp.orderFinite2': ['Ordena la frase (el verbo conjugado va en 2ª posición)', 'Put the sentence in order (the conjugated verb goes in 2nd position)'],
  'tp.modalFronted': ['Si empiezas por un complemento ("{adv}"), el modal conjugado ("{fin}") sigue en 2ª posición y el sujeto pasa detrás. El infinitivo, al final.',
    'If you start with an adverbial ("{adv}"), the conjugated modal ("{fin}") still comes 2nd and the subject moves behind it. The infinitive goes last.'],
  'tp.modalPlain': ['Sujeto + modal (2ª posición) + complementos + infinitivo al final.', 'Subject + modal (2nd position) + the rest + infinitive at the end.'],
  'tp.orderWeilStress': ['Contexto: «Ich habe Stress.» — Ordena la subordinada que empieza por «weil»', 'Context: «Ich habe Stress.» — Put the «weil» clause in order'],
  'tp.modalNeben': ['En la subordinada con "weil" el verbo conjugado ("{fin}") va AL FINAL, detrás del infinitivo: "…, weil {s} … {inf} {fin}."',
    'In a "weil" clause the conjugated verb ("{fin}") goes LAST, after the infinitive: "…, weil {s} … {inf} {fin}."'],
  'tp.fillPraetPast': ['Completa en Präteritum (pasado)', 'Complete it in the Präteritum (past)'],
  'tp.beforeGloss': ['Antes {s}{v} {p}.', 'Before, {s}{v} {p}.'],
  'tp.modalPraet': ['Präteritum de "{m}": pierde el Umlaut y añade -te → "{correct}". La 1ª y la 3ª persona del singular son iguales.',
    'Präteritum of "{m}": it drops the Umlaut and adds -te → "{correct}". The 1st and 3rd person singular are identical.'],
  'tp.fillKonj2': ['Completa con el modal en Konjunktiv II (cortesía / consejo)', 'Complete it with the modal in Konjunktiv II (politeness / advice)'],
  // Perfekt (partizip2 / seinHaben). La glosa castellana es "sujeto + he/ha +
  // participio + complemento", que en ingles funciona igual.
  'tp.perfGloss': ['{s} {aux} {pp} {m}.', '{s} {aux} {pp} {m}.'],
  'tp.thatGloss': ['…que {s}{aux} {pp} {m}.', '…that {s}{aux} {pp} {m}.'],
  'tp.becausePerf': ['…porque {s}{aux} {pp} {m}.', '…because {s}{aux} {pp} {m}.'],
  'tp.part2Expl': ['"{inf}" → Partizip II "{part}". {g}', '"{inf}" → Partizip II "{part}". {g}'],
  'tp.pickAux': ['Elige el auxiliar del Perfekt', 'Choose the Perfekt auxiliary'],
  'tp.auxExpl': ['"{inf}" usa "{aux}". {why}', '"{inf}" takes "{aux}". {why}'],
  'tp.auxSein': ['Verbo de movimiento con cambio de lugar o de estado (fahren, fliegen, umziehen, aufstehen…) → "sein".',
    'A verb of movement with a change of place or state (fahren, fliegen, umziehen, aufstehen…) → "sein".'],
  'tp.auxHaben': ['Verbo con objeto en acusativo o sin cambio de lugar → "haben".',
    'A verb with an accusative object, or with no change of place → "haben".'],
  'tp.orderPerfTime': ['Ordena la frase en Perfekt (empieza por la expresión de tiempo)', 'Put the Perfekt sentence in order (start with the time expression)'],
  'tp.perfFronted': ['Con un complemento en 1ª posición: [tiempo] + auxiliar ("{aux}") en 2ª posición + sujeto + … + participio ("{part}") al final.',
    'With an adverbial in 1st position: [time] + auxiliary ("{aux}") in 2nd position + subject + … + participle ("{part}") at the end.'],
  'tp.orderDass': ['Contexto: «Ich glaube, …» — Ordena la subordinada con «dass»', 'Context: «Ich glaube, …» — Put the «dass» clause in order'],
  'tp.perfDass': ['En la subordinada con "dass", el auxiliar ("{aux}") va AL FINAL, detrás del participio: "…, dass {s} … {part} {aux}."',
    'In a "dass" clause the auxiliary ("{aux}") goes LAST, after the participle: "…, dass {s} … {part} {aux}."'],
  'tp.pickSeinHaben': ['¿sein o haben? Elige el auxiliar correcto', 'sein or haben? Choose the right auxiliary'],
  'tp.shExpl': ['"{inf}" forma el Perfekt con "{aux}". {cat}', '"{inf}" forms the Perfekt with "{aux}". {cat}'],
  'tp.orderWeilPlain': ['Contexto: «… , …» — Ordena la subordinada que empieza por «weil»', 'Context: «… , …» — Put the «weil» clause in order'],
  'tp.perfWeil': ['En la subordinada con "weil" el auxiliar ("{aux}") va AL FINAL, detrás del participio: "…, weil {s} … {part} {aux}."',
    'In a "weil" clause the auxiliary ("{aux}") goes LAST, after the participle: "…, weil {s} … {part} {aux}."'],
  'tp.fillWarHatte': ['Completa en Präteritum (formas de war / hatte)', 'Complete it in the Präteritum (forms of war / hatte)'],
  'tp.warHatteExpl': ['{ex} Con "{de}" → "{correct}".', '{ex} With "{de}" → "{correct}".'],
  'tp.orderTimeFirst': ['Ordena la frase (empieza por el complemento de tiempo)', 'Put the sentence in order (start with the time expression)'],
  // Conjugar el auxiliar es gramatica del idioma del alumno, no contenido del
  // libro: por eso va por persona y no por diccionario. En castellano son
  // cinco formas distintas y en ingles solo dos.
  'tp.perfAux.ich': ['he', 'have'],
  'tp.perfAux.du': ['has', 'have'],
  'tp.perfAux.er': ['ha', 'has'],
  'tp.perfAux.wir': ['hemos', 'have'],
  'tp.perfAux.sie': ['han', 'have'],
  'tp.wasSing': ['estaba', 'was'],
  'tp.wasPlur': ['estaban', 'were'],
  'tp.hadSing': ['tenía', 'had'],
  'tp.hadPlur': ['tenían', 'had'],
  'tp.praetHome': ['Ayer {s} {v} en casa.', 'Yesterday {s} {v} at home.'],
  'tp.praetWien': ['El año pasado {s} {v} en Viena.', 'Last year {s} {v} in Vienna.'],
  'tp.praetPets': ['Antes {s} {v} muchas mascotas.', '{s} used to have a lot of pets.'],
  'tp.praetHeadache': ['El lunes {s} {v} dolor de cabeza.', 'On Monday {s} {v} a headache.'],
  'tp.fillPresIrr': ['Completa el presente (verbo irregular)', 'Complete the present tense (irregular verb)'],
  'tp.irrPres': ['{g}"{inf}" → {p} "{correct}". La forma regular "{regular}" aquí es incorrecta.',
    '{g}"{inf}" → {p} "{correct}". The regular form "{regular}" is wrong here.'],
  'tp.fillPraetTale': ['Completa en Präteritum (pasado del relato)', 'Complete it in the Präteritum (narrative past)'],
  'tp.yesterdayGloss': ['Ayer {v} {m}.', 'Yesterday I {v} {m}.'],
  'tp.strongPraet': ['"{inf}" es fuerte: Präteritum "ich/er {form}" (1ª y 3ª persona iguales). El participio "{part}" solo vale en Perfekt, con haben/sein.',
    '"{inf}" is a strong verb: Präteritum "ich/er {form}" (1st and 3rd person are identical). The participle "{part}" only works in the Perfekt, with haben/sein.'],
  'tp.orderAdvFirst': ['Ordena la frase (empieza por el adverbio; el verbo va en 2ª posición)', 'Put the sentence in order (start with the adverb; the verb goes 2nd)'],
  'tp.advGloss': ['{adv}, {s} {v} {m}.', '{adv}, {s} {v} {m}.'],
  'tp.advExpl': ['Si empiezas por un adverbio ("{adv}"), el verbo conjugado ("{er}") va en 2ª posición y el sujeto detrás. "{inf}" cambia la raíz en la 3ª persona.',
    'If you start with an adverb ("{adv}"), the conjugated verb ("{er}") comes 2nd and the subject follows. "{inf}" changes its stem in the 3rd person.'],
  'tp.fillImpDu': ['Completa el imperativo de "du"', 'Complete the "du" imperative'],
  'tp.impExpl': ['{tip} → "{a}".', '{tip} → "{a}".'],
  'tp.fillPresent': ['Completa el verbo en presente', 'Complete the verb in the present'],
  'tp.pickArticle': ['Elige el artículo correcto', 'Choose the right article'],
  'tp.pickVerb2': ['Elige la opción correcta (el verbo va en 2ª posición)', 'Choose the right option (the verb goes in 2nd position)'],
  'tp.fillQuestion': ['Completa la pregunta', 'Complete the question'],
  'tp.pickNegation': ['Elige la negación correcta (nicht / kein)', 'Choose the right negation (nicht / kein)'],
  'tp.pickPlural': ['Elige el plural correcto', 'Choose the right plural'],
  'tp.pickArticleCase': ['Elige el artículo según el caso', 'Choose the article that matches the case'],
  'tp.pickPronounCase': ['Elige el pronombre en el caso correcto', 'Choose the pronoun in the right case'],
  'tp.pickPhrase': ['Elige el sintagma bien declinado', 'Choose the correctly declined phrase'],
  'tp.pickWFrage': ['Elige la palabra interrogativa (wer / wen / wem)', 'Choose the question word (wer / wen / wem)'],
  'tp.orderDatAkk': ['Ordena la frase (dativo antes que acusativo)', 'Put the sentence in order (dative before accusative)'],
  'tp.pickConnector': ['Elige el conector correcto (fíjate en la posición del verbo)', 'Choose the right connector (watch where the verb goes)'],
  'tp.pickClause': ['Elige la subordinada bien ordenada', 'Choose the correctly ordered clause'],
  'tp.orderSubclause': ['Contexto: «Ich kann nicht kommen, …» — Ordena la subordinada', 'Context: «Ich kann nicht kommen, …» — Put the clause in order'],
  'tp.pickPrep': ['Elige la preposición correcta', 'Choose the right preposition'],
  'tp.woWohin': ['wo? = dativo · wohin? = acusativo', 'wo? = dative · wohin? = accusative'],
  'tp.pickForm': ['Elige la forma correcta', 'Choose the right form'],
  'tp.perfTimeFirst': ['Con un complemento en 1ª posición: [tiempo] + "{sein}" (2ª posición) + sujeto + … + participio ("{part}") al final. "{inf}" usa "sein".',
    'With an adverbial in 1st position: [time] + "{sein}" (2nd position) + subject + … + participle ("{part}") at the end. "{inf}" takes "sein".'],
  'rule': ['regla', 'rule'],
  'functions': ['funciones', 'functions'],
  'function': ['función', 'function'],
  'topics': ['temas', 'topics'],
  'topic': ['tema', 'topic'],
  'level': ['Nivel', 'Level'],
  'showEs': ['👁 Mostrar traducción', '👁 Show translation'],
  'hideEs': ['🙈 Ocultar traducción', '🙈 Hide translation'],
  'aiOffLong': [
    'Activa la IA en el menú lateral para usar esto.',
    'Turn on AI in the sidebar to use this.'
  ],

  // menú / ajustes

  // Lieder
  'lieder.title': ['Lieder', 'Lieder'],
  'lieder.sub': [
    'Aprende con música alemana: el vídeo, de qué habla la canción, su vocabulario y el artista.',
    'Learn with German music: the video, what the song is about, its vocabulary and the artist.'
  ],
  'lieder.new': ['🎵 Proponme una canción', '🎵 Suggest me a song'],
  'lieder.another': ['🔄 Otra canción', '🔄 Another song'],
  'lieder.searching': ['Buscando una canción…', 'Looking for a song…'],
  'lieder.empty': [
    'Pulsa el botón y te propongo una canción en alemán para tu nivel.',
    'Hit the button and I will suggest a German song for your level.'
  ],
  'lieder.about': ['De qué habla', 'What it is about'],
  'lieder.kontext': ['La canción por dentro', 'The story behind it'],
  'lieder.aussprache': ['Cómo se pronuncia', 'How it is pronounced'],
  'lieder.imitar': ['Para repetir en voz alta', 'To say out loud'],
  'lieder.artist': ['El artista', 'The artist'],
  'lieder.why': ['Por qué esta canción', 'Why this song'],
  'lieder.vocab': ['Vocabulario de la canción', 'Vocabulary from the song'],
  'lieder.grammar': ['Gramática que practica', 'Grammar it practises'],
  'lieder.listen': ['▶ Ver en YouTube', '▶ Watch on YouTube'],
  'lieder.lyrics': ['📄 Letra oficial', '📄 Official lyrics'],
  'lieder.search': ['Buscar', 'Search'],
  'lieder.searchPh': [
    'Un artista o una canción: «Nena», «99 Luftballons», «Wanda - Bologna»…',
    'An artist or a song: "Nena", "99 Luftballons", "Wanda - Bologna"…'
  ],
  'lieder.follow': ['Seguir la letra mientras suena', 'Follow the lyrics while it plays'],
  'lieder.follow1': [
    'Dale al play y pulsa el botón de subtítulos (CC) en el vídeo: la letra va apareciendo sincronizada con la música.',
    'Hit play and turn on captions (CC) in the video: the lyrics appear in sync with the music.'
  ],
  'lieder.follow2': [
    'Para verla traducida, entra en el engranaje ⚙ → Subtítulos → Traducir automáticamente y elige tu idioma.',
    'To see it translated, open the gear ⚙ → Subtitles → Auto-translate and pick your language.'
  ],
  'lieder.follow3': [
    'Si prefieres la letra completa delante, ábrela en el enlace de abajo y déjala al lado del vídeo.',
    'If you would rather have the full lyrics in front of you, open the link below and keep it next to the video.'
  ],
  'lieder.filterLevel': ['Nivel', 'Level'],
  'lieder.filterGenre': ['Género', 'Genre'],
  'lieder.notes': ['Mis notas', 'My notes'],
  'lieder.notesPh': [
    'Lo que te llame la atención: una frase que te guste, una palabra nueva, por dónde te pierdes al escucharla…',
    'Whatever stands out: a line you like, a new word, where you lose the thread…'
  ],
  'lieder.notesSaved': ['Guardado', 'Saved'],
  'lieder.saved': ['Mis canciones', 'My songs'],
  'lieder.close': ['Cerrar y ver solo mis canciones', 'Close and just show my songs'],
  'lieder.save': ['Guardar', 'Save'],
  'lieder.unsave': ['Guardada', 'Saved'],


  // Übersetzen: traducir frases
  'ueb.title': ['Traducir frases', 'Translate sentences'],
  'ueb.sub': [
    'Del alemán al español y al revés · {known}/{total} dominadas ({pct}%) · {empezadas} practicadas',
    'German to English and back · {known}/{total} mastered ({pct}%) · {empezadas} practised'
  ],
  'ueb.deEs': ['Traduce al espa\u00f1ol', 'Translate into English'],
  'ueb.esDe': ['Traduce al alem\u00e1n', 'Translate into German'],
  'ueb.phEs': ['Escribe la frase en espa\u00f1ol\u2026', 'Write the sentence in English\u2026'],
  'ueb.phDe': ['Escribe la frase en alem\u00e1n\u2026', 'Write the sentence in German\u2026'],
  'ueb.pedirPista': ['Pista ({n} restantes)', 'Hint ({n} left)'],
  'ueb.pistaTraduccion': ['Ver traducción', 'Show translation'],
  'ueb.pista': ['💡 Pista', '💡 Hint'],
  'ueb.pista1': ['Estructura', 'Structure'],
  'ueb.pista2': ['Palabra clave', 'Keyword'],
  'ueb.pista3': ['Más palabras', 'More words'],
  'ueb.bien': ['\u00a1Exacto!', 'Spot on!'],
  'ueb.casi': ['Casi: una palabra distinta', 'Almost: one word off'],
  'ueb.orden': ['Las palabras son, pero el orden no', 'Right words, wrong order'],
  'ueb.mal': ['No es eso', 'Not quite'],
  'ueb.correcta': ['Era', 'It was'],
  'ueb.porQue': ['\u00bfPor qu\u00e9 he fallado?', 'Why was I wrong?'],
  'ueb.pensando': ['Mir\u00e1ndolo\u2026', 'Looking at it\u2026'],
  'ueb.siguiente': ['Siguiente', 'Next'],
  'ueb.terminar': ['Terminar', 'Finish'],
  'ueb.vacio': [
    'No hay frases para traducir todav\u00eda.',
    'There are no sentences to translate yet.'
  ],

  // Fuchs, el zorrito
  'fox.sub': ['Tu compañero de alemán · charla, corrige y traduce', 'Your German buddy · chats, corrects and translates'],
  'fox.chatWith': ['Hablar con {nombre}', 'Chat with {nombre}'],
  'fox.answerPh': ['Contéstale a {nombre} en alemán…', 'Answer {nombre} in German…'],
  'fox.ph': ['Escríbele a {nombre} en alemán (o pídele que te traduzca algo)…', 'Write to {nombre} in German (or ask for a translation)…'],
  'fox.send': ['Enviar', 'Send'],
  'fox.thinking': ['pensando…', 'thinking…'],
  'fox.empty': [
    'Dile algo a {nombre}. Te contesta en alemán, te corrige lo que escribas y te pone ejercicios si se los pides.',
    'Say something to {nombre}. He answers in German, corrects what you write and sets you exercises if you ask.'
  ],
  'fox.listen': ['Escuchar', 'Listen'],
  'fox.noVoice': [
    'No hay ninguna voz alemana instalada en este equipo, así que no puedo leerte las frases en voz alta.',
    'No German voice is installed on this machine, so I cannot read the sentences out loud.'
  ],
  'fox.exercise': ['Para ti', 'For you'],
  'fox.solution': ['Ver la solución', 'Show the answer'],
  'fox.clear': ['Borrar la conversación', 'Clear the conversation'],
  'fox.clearAsk': ['¿Borrar toda la conversación?', 'Clear the whole conversation?'],
  // el panel entero esta en aleman, asi que el boton que lo abre tambien
  // Ya no se usa: la etiqueta la construye tuAnimal() en fuchs.js, porque
  // esto decía "Dein Fuchs" aunque te compraras un gato.
  // Con el nombre dentro: si lo rebautizas, el botón lo dice.
  'fox.customiseName': ['Personalizar a {nombre}', 'Customise {nombre}'],
  'fox.coins': ['Monedas', 'Coins'],

  // Startseite
  'home.sub': ['Resumen de tu alemán · Nivel A1–A2', 'Your German at a glance · Level A1–A2'],
  'home.streak': ['Racha (días)', 'Streak (days)'],
  'home.record': ['Récord', 'Best'],
  'home.levelN': ['Nivel {n}', 'Level {n}'],
  'home.xpTotal': ['{n} XP en total', '{n} XP in total'],
  'home.bestRun': ['Mejor racha', 'Best streak'],
  'home.bestRunSub': ['Aciertos seguidos', 'Correct answ. in a row'],
  'home.acc10': ['Precisión reciente', 'Recent accuracy'],
  'home.sessions': ['Últimas {n} sesiones', 'Last {n} sessions'],
  'home.sessionsTotal': ['Sesiones totales', 'Total sessions'],
  'home.aiOn': ['IA activa ✨', 'AI on ✨'],
  'home.aiOff': ['modo plantillas', 'template mode'],
  'home.days': ['días', 'days'],
  'home.calMonth': ['{a} de {b} días practicados este mes', '{a} of {b} days practised this month'],
  'home.atRisk': ['⚠️ Practica hoy', '⚠️ Practise today'],
  'home.todayBtn': ['Hoy', 'Today'],
  'home.practice': ['Práctica', 'Practice'],
  'home.random': ['De todo un poco', 'A bit of everything'],
  'home.gTest': ['Test', 'Quiz'],
  'home.gTestSub': ['4 opciones', '4 options'],
  'home.gOrder': ['Ordenar frases', 'Sentence order'],
  'home.gOrderSub': ['Coloca las palabras', 'Put the words in order'],
  'home.gJudge': ['¿Correcto o no?', 'Right or wrong?'],
  'home.gJudgeSub': ['Caza el error', 'Spot the mistake'],
  // Lleva al índice de Wortschatz, donde eliges lección o mazo; no a un juego.
  'home.moreGames': ['O una lección de vocabulario', 'Or a vocabulary lesson'],
  'home.moreGamesShort': ['O vocabulario', 'Or vocabulary'],
  'home.practiceNote': [
    'Estos dan 1 moneda por acierto. Las lecciones completas, el diario o el examen otorgan más monedas y XP extra.',
    'These give 1 coin per correct answer. Complete lessons, the diary, or exams grant more coins and bonus XP.'
  ],
  'home.aiReview': ['Repaso con IA', 'AI review'],
  'home.newDiaryEntry': ['Nueva entrada del diario', 'New diary entry'],
  'foto.paste': [
    'o pega una captura con Ctrl+V · o arrastra el archivo aquí',
    'or paste a screenshot with Ctrl+V · or drop the file here'
  ],
  'foto.pasteB': [
    'o arrastra el archivo aquí (Ctrl+V si pinchas antes en este cuadro)',
    'or drop the file here (Ctrl+V if you click this box first)'
  ],
  'home.pickTopic': ['O una lección de gramática', 'Or a grammar lesson'],
  'home.pickTopicShort': ['O gramática', 'Or grammar'],
  'home.kommTopic': ['O una lección de comunicación', 'Or a communication lesson'],
  'home.kommTopicShort': ['O comunicación', 'Or communication'],

  // Wortschatz
  'voc.sub': [

    'El vocabulario de {libro}, lección por lección, con sus juegos y sus tarjetas.',

    'The vocabulary of {libro}, lesson by lesson, with its games and flashcards.'

  ],
  'voc.cards': ['Tarjetas', 'Flashcards'],
  'voc.known': ['conocidas', 'known'],
  'voc.fresh': ['sin practicar', 'not practised'],
  'voc.imported': ['importado', 'imported'],
  'voc.difficulty': ['Dificultad', 'Difficulty'],
  'voc.genderTitle': ['Juego der / die / das', 'der / die / das game'],
  'voc.genderSub': [

    'Adivina el artículo de los sustantivos · {known}/{total} dominados ({pct}%) · {empezadas} practicadas',

    'Guess the article of the nouns · {known}/{total} mastered ({pct}%) · {empezadas} practised'

  ],
  'voc.importTitle': ['Importar un archivo', 'Import a file'],
  'voc.importHint': [
    'Una columna en alemán y otra en español. Se aprovechan también columnas de frase de ejemplo.',
    'One column in German and one in your language. Example-sentence columns are used too.'
  ],
  'voc.reading': ['Leyendo…', 'Reading…'],
  'voc.andMore': ['…y {n} más', '…and {n} more'],
  'voc.deckName': ['Nombre del mazo', 'Deck name'],
  'voc.saveDeck': ['Guardar mazo ({n} tarjetas)', 'Save deck ({n} cards)'],
  'voc.genTitle': ['Generar vocabulario con IA', 'Generate vocabulary with AI'],
  'voc.themePh': ['p. ej. en el aeropuerto, hacer deporte…', 'e.g. at the airport, doing sport…'],
  'voc.nCards': ['Nº de tarjetas', 'Number of cards'],
  'voc.createDeck': ['Crear mazo', 'Create deck'],
  'voc.myDecks': ['Mis mazos', 'My decks'],
  'voc.myDecksSub': ['importados o creados con IA', 'imported or AI-generated'],
  'voc.showExtra': ['▾ Ver mazos extra', '▾ Show extra decks'],
  'voc.hideExtra': ['▴ Ocultar mazos extra', '▴ Hide extra decks'],
  'gr.showTemas': ['▾ Ver explicaciones extra', '▾ Show extra explanations'],
  'gr.hideTemas': ['▴ Ocultar las explicaciones extra', '▴ Hide the extra explanations'],
  'voc.showMine': ['▾ Ver mis mazos ({n})', '▾ Show my decks ({n})'],
  'voc.hideMine': ['▴ Ocultar mis mazos', '▴ Hide my decks'],
  'voc.deckStats': [
    '{total} tarjetas · {known} conocidas ({pct}%) · {mastered} dominadas',
    '{total} cards · {known} known ({pct}%) · {mastered} mastered'
  ],
  'voc.aiCreated': [' · creado con IA', ' · AI-generated'],
  'voc.importedLabel': [' · importado', ' · imported'],
  'voc.allCards': ['Todas las tarjetas ({n})', 'All cards ({n})'],
  'voc.listen': ['Escuchar la pronunciación', 'Listen to the pronunciation'],
  'voc.conjugate': ['Conjugar', 'Conjugate'],
  'voc.close': ['Cerrar', 'Close'],
  'voc.deToEs': ['Alemán → Español', 'German → English'],
  'voc.esToDe': ['Español → Alemán', 'English → German'],
  'voc.expandTitle': ['Ampliar «{tema}»', 'Expand “{tema}”'],
  'voc.expandReady': ['Te sabes todas. La IA te busca 12 palabras más de este campo.', 'You know them all. The AI will find 12 more words from this field.'],
  'voc.expandLocked': ['Se abre al poner las {total} en verde. Te faltan {n}.', 'Unlocks when all {total} are green. {n} to go.'],
  'voc.expandLocked1': ['Se abre al poner las {total} en verde. Te falta 1.', 'Unlocks when all {total} are green. 1 to go.'],
  'voc.expandGo': ['✨ Buscar más palabras', '✨ Find more words'],
  'voc.expandThinking': ['Buscando…', 'Searching…'],
  'voc.expandNeedsAi': ['Activa la IA en el menú lateral para usarlo.', 'Turn on AI in the side menu to use this.'],
  'voc.expandFound': ['{n} palabras nuevas', '{n} new words'],
  'voc.expandSave': ['Guardar como mazo nuevo', 'Save as a new deck'],
  'voc.expandMore': ['Otras 12', 'Another 12'],
  'voc.expandDiscard': ['Descartar', 'Discard'],
  'voc.expandLegend': ['Verde: te sale en alemán. Amarillo: la reconoces. Rojo: la fallaste.', 'Green: you can produce it. Yellow: you recognise it. Red: you got it wrong.'],
  'voc.clearColours': ['Quitar los colores', 'Clear the colours'],
  'voc.confirmClearColours': [
    '¿Quitar las marcas de color de las palabras de este tema? Tu progreso no cambia.',
    'Clear the colour marks on this topic’s words? Your progress stays as it is.'
  ],
  'voc.missedWords': ['{n} palabra fallada', '{n} missed word'],
  'voc.missedWordsPl': ['{n} palabras falladas', '{n} missed words'],
  'voc.topicText': ['Texto del tema', 'Topic text'],
  'voc.hide': ['Ocultar', 'Hide'],
  'voc.show': ['Mostrar', 'Show'],
  'voc.deleteDeck': ['Borrar este mazo', 'Delete this deck'],
  'voc.confirmDeleteDeck': ['¿Borrar el mazo "{name}"?', 'Delete the deck "{name}"?'],
  'voc.allLesson': ['Toda la lección', 'Whole lesson'],
  'voc.markColour': ['Marcar con color', 'Mark with a colour'],
  'voc.examples': ['Ejemplos de uso', 'Examples'],
  'voc.mistakesStat': ['fallos', 'mistakes'],
  'voc.accuracyStat': ['precisión', 'accuracy'],
  'voc.pairsStat': ['parejas', 'pairs'],
  'voc.cardsStat': ['tarjetas', 'cards'],
  'voc.timeStat': ['tiempo', 'time'],
  'voc.newDayBonus': [' por el día nuevo', ' for a new day'],


  // sesión de ejercicios
  'ses.preparing': ['Preparando ejercicios…', 'Getting your exercises ready…'],
  'ses.none': ['No se pudieron generar ejercicios. Inténtalo de nuevo.', 'Could not generate exercises. Please try again.'],
  'ses.aiOn': ['✨ IA activa', '✨ AI on'],
  'ses.exit': ['Salir', 'Exit'],

  'ses.streakN': ['{n} seguidas', '{n} in a row'],
  'ses.correctIs': ['Correcto', 'Correct'],
  'ses.alsoRight': ['Tu orden vale. También es correcto:', 'Your order works. This is also correct:'],
  'ses.dragHint': [
    'Arrastra las palabras a su sitio, o toca una y luego dónde va. Después, comprueba.',
    'Drag the words into place, or tap one and then where it goes. Then check.'
  ],
  'ses.dragHint2': [
    'Ahora toca la palabra delante de la cual quieres ponerla.',
    'Now tap the word you want to place it in front of.'
  ],
  'ses.judgeQ': ['¿Es correcta esta frase?', 'Is this sentence correct?'],
  'ses.judgeYes': ['✓ Correcta', '✓ Correct'],
  'ses.judgeNo': ['✗ Tiene un error', '✗ It has a mistake'],

  // feedback
  'fb.right': ['✅ ¡Correcto!', '✅ Correct!'],
  'fb.wrong': ['❌ No exactamente', '❌ Not quite'],
  'fb.why': ['Por qué', 'Why'],
  'fb.aiItem': ['✨ ejercicio generado por IA', '✨ AI-generated exercise'],
  'fb.aiFail': ['No se pudo consultar la IA: ', 'Could not reach the AI: '],
  'fb.results': ['Ver resultados', 'See results'],
  'fb.next': ['Continuar', 'Continue'],
  'fb.asking': ['Consultando…', 'Asking…'],
  'fb.askAi': ['✨ Que lo explique la IA', '✨ Let the AI explain it'],

  // resumen
  'sum.perfect': ['¡Sesión perfecta!', 'Perfect session!'],
  'sum.good': ['¡Bien hecho!', 'Well done!'],
  'sum.keep': ['Sigue practicando', 'Keep practising'],
  'sum.accuracy': ['precisión', 'accuracy'],
  'sum.hits': ['aciertos', 'correct'],
  'sum.time': ['tiempo', 'time'],
  'sum.streak': ['Racha', 'Streak'],
  // Subir de nivel: se avisa al terminar la tanda, que es cuando pasa.
  'sum.levelUp': ['¡Nivel {n}!', 'Level {n}!'],
  // El boton de volver a intentar SOLO lo que acabas de fallar.
  'sum.retryFails': ['🩹 Repetir mis fallos ({n})', '🩹 Retry my mistakes ({n})'],
  'sum.mistakes': ['Repaso de fallos ({n})', 'Mistake review ({n})'],
  'sum.noMistakes': ['Ningún fallo. ¡Impecable! 🎯', 'Not a single mistake. Flawless! 🎯'],
  'sum.again': ['Otra ronda', 'Another round'],
  'sum.backStartseite': ['Volver a Inicio', 'Back to Startseite'],
  'vsum.toReview': ['Para repasar', 'To review'],
  // El boton del resumen dice a donde lleva: a los juegos de la leccion, o
  // -si venias de las tarjetas- a la teoria, que es de donde se lanzan.
  'vsum.backExercises': ['Volver a los ejercicios', 'Back to exercises'],

  // Grammatik / teoría
  'gr.sub': [
    'La gramática de {libro}, lección por lección. Cada regla con su explicación, ejemplos y ejercicios.',
    'The grammar of {libro}, lesson by lesson. Every rule with its explanation, examples and exercises.'
  ],
  'gr.recentAcc': ['Aciertos en las últimas {n} sesiones', 'Accuracy over the last {n} sessions'],
  'gr.gWrite': ['Escribir', 'Type it'],
  'gr.gWriteSub': ['Sin opciones, a mano', 'No options, type it'],
  'ses.prev': ['El ejercicio anterior', 'The previous exercise'],
  'ses.next': ['El ejercicio siguiente', 'The next exercise'],
  'ses.reviewing': ['Ya contestado', 'Already answered'],
  'ses.youAnswered': ['Contestaste:', 'You answered:'],
  'ses.writeGap': ['Escribe lo que falta', 'Type the missing word'],
  'ses.writePh': ['tu respuesta…', 'your answer…'],
  'ses.check': ['Comprobar', 'Check'],
  'gr.theory': ['📖 Teoría', '📖 Theory'],
  'gr.exercises': ['✏️ Ejercicios', '✏️ Exercises'],
  'gr.more': ['Más +', 'More +'],
  'gr.less': ['Menos −', 'Less −'],
  'gr.seeMore': ['Ver explicación y más ejemplos →', 'See explanation and more examples →'],
  'gr.pitfalls': ['⚠️ Errores típicos', '⚠️ Common mistakes'],
  'gr.toExercises': ['Ir a los ejercicios →', 'Go to the exercises →'],
  'gr.practise': ['Practicar', 'Practise'],
  'gr.crownTitle': ['Tema dominado', 'Topic mastered'],
  'gr.crownSub': [
    'Tu acierto en cada minijuego, con las 5 últimas sesiones de este tema.',
    'Your accuracy in each minigame, over the last 5 sessions of this topic.'
  ],
  'gr.crownRuns': ['{n} ses.', '{n} runs'],
  'gr.crownSpeed': ['{s} s por pregunta', '{s} s per question'],
  'gr.crownRecord': ['récord {s} s ({n} preg.)', 'record {s} s ({n} q.)'],
  'gr.crownNoRecord': ['sin récord: aún no has hecho una sesión sin fallos', 'no record yet: no flawless session so far'],
  // La versión corta va en la fila y la larga en el tooltip: la frase
  // entera ocupaba más que todo lo demás de la fila junto.
  'gr.crownNoRecordShort': ['sin récord', 'no record'],
  'gr.crownNone': [
    'Todavía no has jugado ninguna sesión de este tema con un formato concreto.',
    'You have not played any session of this topic in a specific format yet.'
  ],
  'gr.crownLocked': [
    'Te falta un {n}% para dominar el tema y ver tu porcentaje de error.',
    '{n}% to master the topic and see your error rate.'
  ],
  'gr.pickGame': ['Elige el tipo de juego', 'Pick a game type'],
  'gr.reviewWeak': ['🩹 Repasar mis fallos', '🩹 Review my mistakes'],
  'gr.reviewWeakN': ['🩹 Repasar mis fallos ({n})', '🩹 Review my mistakes ({n})'],
  // Se ve siempre, apagado mientras no haya nada que repasar: un boton que
  // aparece de la nada el dia que fallas algo no se entiende, y hasta entonces
  // no sabias que existia.
  'gr.reviewWeakHint': [
    'Una tanda con los apartados en los que has cometido errores.',
    'A round with the sections where you made mistakes.'
  ],
  // Bandera de meta, no diana: el boton de al lado (repasar fallos) ya usa la
  // diana, y desbloqueados quedaban dos iguales seguidos para cosas distintas.
  'voc.finish': ['🏁 Terminar el tema ({n})', '🏁 Finish the topic ({n})'],
  'voc.finishPill': ['🏁 Terminar el tema', '🏁 Finish the topic'],
  'voc.finishLocked': ['🏁 Terminar el tema (disponible al {p}%)', '🏁 Finish the topic (available at {p}%)'],
  'voc.finishLockedHint': [
    'Se abre al {p}% del tema: sirve para el ultimo tramo, cuando solo faltan unas pocas.',
    'Unlocks at {p}%: it is for the last stretch, when only a few are left.'
  ],
  'voc.finishHint': [
    'Solo lo que todavía no cuenta para el 100%, empezando por lo que no te ha salido nunca.',
    'Only what does not count towards 100% yet, starting with what you have never seen.'
  ],
  'voc.crosswordLocked': ['🔠 Crucigrama del tema (se desbloquea al {p}%)', '🔠 Topic crossword (unlocks at {p}%)'],
  'voc.crosswordProgress': ['🔠 Crucigrama del tema ({n}/{total} completados)', '🔠 Topic crossword ({n}/{total} completed)'],
  'voc.crosswordFinishedHint': ['Ya has completado los 3 crucigramas de este tema.', 'You have completed all 3 crosswords for this topic.'],
  'voc.crosswordLockedHint': ['Se desbloquea al llegar al {p}% de este tema.', 'Unlocks when this topic reaches {p}%.'],
  'voc.crosswordHint': ['Crucigrama con palabras y pistas en alemán de este tema.', 'A crossword with German words and clues from this topic.'],
  'voc.crosswordTitle': ['Crucigrama del tema', 'Topic crossword'],
  'voc.crosswordInstructions': ['Completa el crucigrama con las pistas en alemán.', 'Use the German clues to complete the crossword.'],
  'voc.crosswordZoom': ['Zoom del crucigrama', 'Crossword zoom'],
  'voc.crosswordZoomIn': ['Ampliar crucigrama', 'Zoom in on crossword'],
  'voc.crosswordZoomOut': ['Reducir crucigrama', 'Zoom out on crossword'],
  'voc.crosswordZoomReset': ['Restablecer el zoom del crucigrama', 'Reset crossword zoom'],
  'voc.crosswordNavigation': ['Elegir crucigrama', 'Choose a crossword'],
  'voc.crosswordRound': ['Crucigrama {n} de {total}', 'Crossword {n} of {total}'],
  'voc.crosswordPrevious': ['Crucigrama anterior', 'Previous crossword'],
  'voc.crosswordNext': ['Crucigrama siguiente', 'Next crossword'],
  'voc.crosswordRoundsDone': ['{n}/{total} completados', '{n}/{total} completed'],
  'voc.crosswordRoundDone': ['Crucigrama {n} resuelto · +{coins} monedas', 'Crossword {n} solved · +{coins} coins'],
  'voc.crosswordFinishSet': ['Ver resultados', 'See results'],
  'voc.crosswordNeedWords': ['Este tema no tiene suficientes palabras cortas para formar un crucigrama.', 'This topic does not have enough short words for a crossword.'],
  'voc.crosswordDeckMissing': ['No se ha podido cargar el vocabulario de este tema. Vuelve atrás e inténtalo de nuevo.', 'This topic’s vocabulary could not be loaded. Go back and try again.'],
  'voc.crosswordAcross': ['Horizontales', 'Across'],
  'voc.crosswordDown': ['Verticales', 'Down'],
  'voc.crosswordAnswer': ['Tu respuesta', 'Your answer'],
  'voc.crosswordCheck': ['Comprobar', 'Check'],
  'voc.crosswordTryAgain': ['No encaja todavía. Prueba otra vez.', 'Not quite. Try again.'],
  'voc.crosswordCorrect': ['¡Correcto!', 'Correct!'],
  'voc.crosswordSolved': ['Resuelta', 'Solved'],
  'voc.crosswordEmptyCell': ['Casilla vacía', 'Empty cell'],
  'voc.crosswordCoins': ['+{n} monedas por resolver el crucigrama', '+{n} coins for solving the crossword'],
  'voc.crownCoins': ['+{n} monedas por dominar el tema', '+{n} coins for mastering the topic'],
  'voc.crownEarned': ['Corona del tema', 'Topic crown'],
  'gr.aiChallenge': ['✨ Reto con IA', '✨ AI challenge'],
  'gr.aiChallengeHint': [
    'Tanda centrada en tus fallos y con la mayoría de los ejercicios escritos por la IA en ese momento.',
    'A round focused on your mistakes, with most exercises written by the AI right then.'
  ],
  // De dónde sale el material de cada juego. Sin esto no había forma de saber
  // si lo que estabas haciendo se lo acababa de inventar la IA o venía del
  // libro, y es lo primero que uno se pregunta.
  'gr.mixSource': [
    'Estos ejercicios usan el contenido de aquí. Si subes la proporción de IA en Ajustes, cada partida añade además ejercicios nuevos del mismo tema (viene a cero). «Reto con IA» genera ejercicios aparte.',
    'These exercises use the content from here. If you raise the AI share in Settings, each round also adds fresh exercises on the same topic (starts at zero). "AI challenge" makes up separate exercises.'
  ],
  'gr.mixSourceOff': [
    'Todos los ejercicios salen del contenido oficial de esta lección del libro. No necesitan IA.',
    'All exercises come from the official book content of this lesson. They need no AI.'
  ],
  // En vocabulario la respuesta es más simple que en gramática: aquí la IA no
  // se mete en ningún juego, solo en el reto.
  'news.noNew': [
    'No hay nada nuevo en esta sección: la fuente no ha publicado más. Prueba mañana, o pulsa «Olvidar vistas» para volver a verlas.',
    'Nothing new in this section: the source has not published more. Try tomorrow, or hit "Forget seen" to see them again.'
  ],
  'otroIdioma': [
    'Esto se generó en inglés. Vuelve a buscar para tenerlo en español.',
    'This was generated in Spanish. Search again to get it in English.'
  ],
  'voc.source': [
    'Estos ejercicios usan el contenido de aquí. Si subes la proporción de IA en Ajustes, cada partida añade además ejercicios nuevos del mismo tema (viene a cero). «Reto con IA» genera ejercicios aparte.',
    'These exercises use the content from here. If you raise the AI share in Settings, each round also adds fresh exercises on the same topic (starts at zero). "AI challenge" makes up separate exercises.'
  ],
  'voc.sourceOff': [
    'Todos los ejercicios salen del contenido oficial de esta lección del libro. No necesitan IA.',
    'All exercises come from the official book content of this lesson. They need no AI.'
  ],
  'komm.source': [
    'Estos ejercicios usan el contenido de aquí. Si subes la proporción de IA en Ajustes, cada partida añade además ejercicios nuevos del mismo tema (viene a cero). «Reto con IA» genera ejercicios aparte.',
    'These exercises use the content from here. If you raise the AI share in Settings, each round also adds fresh exercises on the same topic (starts at zero). "AI challenge" makes up separate exercises.'
  ],
  'komm.sourceOff': [
    'Todos los ejercicios salen del contenido oficial de esta lección del libro. No necesitan IA.',
    'All exercises come from the official book content of this lesson. They need no AI.'
  ],
  'komm.retoCargando': [
    'Preparando el reto con las conversaciones de {n}… (tarda un minuto)',
    'Preparing the challenge with the conversations from {n}… (takes a minute)'
  ],
  'gr.aiHint': [
    'Activa la IA en el menú lateral para recibir ejercicios nuevos generados al momento.',
    'Turn on AI in the sidebar to get fresh exercises generated on the spot.'
  ],
  'gr.lessonEx': ['Ejercicios de esta lección', 'Exercises for this lesson'],
  'gr.genAi': ['✨ Generar ejercicios con IA', '✨ Generate exercises with AI'],
  'gr.aiOnly': [
    'Esta lección todavía no tiene ejercicios escritos a mano: la IA los crea al momento a partir de sus reglas.',
    'This lesson has no hand-written exercises yet: the AI creates them on the spot from its rules.'
  ],
  'gr.aiOnlyOff': [
    'Esta lección solo tiene ejercicios con IA. Actívala en el menú lateral.',
    'This lesson only has AI exercises. Turn the AI on in the sidebar.'
  ],
  'gr.noTopic': ['No se encontró este tema.', 'Topic not found.'],
  'star.add': ['Guardar en favoritos', 'Save to favorites'],
  'star.remove': ['Quitar de favoritos', 'Remove from favorites'],
  'star.review': ['⭐ Repasar marcados ({n})', '⭐ Review starred ({n})'],
  'star.reviewPill': ['⭐ Repasar marcados', '⭐ Review starred'],
  'gr.reviewWeakPill': ['🩹 Repasar mis fallos', '🩹 Review my mistakes'],
  'oq.prompt': ['Responde a la pregunta', 'Answer the question'],

  // buscador de dudas
  'ask.title': ['Pregunta tu duda', 'Ask your question'],
  'ask.sub': ['explicación con tablas y ejemplos', 'explanation with tables and examples'],
  'ask.thinking': ['Pensando…', 'Thinking…'],
  'ask.createTopic': ['Crear tema', 'Create topic'],
  'ask.explain': ['Explicar', 'Explain'],
  'ask.off': [
    'Activa la IA en el menú lateral para usar el buscador de dudas.',
    'Turn on AI in the sidebar to use the question search.'
  ],
  'ask.remember': ['Para acordarte', 'To remember it'],
  'ask.practise': ['✏️ Practicar esto', '✏️ Practise this'],
  'ask.another': ['Otra pregunta', 'Another question'],


  // Kommunikation
  // OJO con el largo de este texto y el de gr.sub, voc.sub y news.sub: los
  // cuatro son el subtitulo de una seccion y se pintan en el mismo sitio. El de
  // aqui llegaba a 133 caracteres frente a 87-106 de los otros, asi que a
  // partir de ~1150 px de ancho se partia en dos lineas EL SOLO y bajaba toda
  // la pagina 23,5 px: al cambiar de seccion se veia el salto. Que se queden
  // todos en la misma horquilla y se partiran a la vez, que es lo que hace que
  // las cuatro pantallas esten alineadas.
  'komm.sub': [
    'Las funciones comunicativas de {libro}, con sus frases, sus diálogos y su práctica.',
    'The communicative functions of {libro}, with phrases, dialogues and practice.'
  ],
  'komm.conversation': ['Conversación', 'Conversation'],
  'komm.listenConv': ['🔊 Escuchar conversación', '🔊 Listen to conversation'],
  'komm.exPick': ['¿Cómo se dice en alemán?', 'How do you say it in German?'],
  'komm.exSentido': ['¿Qué quiere decir?', 'What does it mean?'],
  // La mezcla de Kommunikation: frases de todas las lecciones a la vez.
  'komm.mixTitle': ['Practicar sin elegir lección', 'Practise without picking a lesson'],
  'komm.mixSub': ['Frases al azar de toda la comunicación, o de un nivel entero. Diez preguntas de tipos distintos.', 'Random phrases from all the communication sections, or from one whole level. Ten questions of different kinds.'],
  'komm.mixAll': ['Toda la comunicación mezclada', 'All communication mixed'],
  'komm.mixName': ['Comunicación mixta', 'Mixed communication'],
  // La leccion, con pestañas: el rotulo de la rejilla de apartados y la
  // cuenta de los que llevas hechos, al lado del titulo.
  'komm.hechas': ['hechos', 'done'],
  'komm.exPassed': ['✓ Apartado completado.', '✓ Section completed.'],
  'komm.exFailed': ['Con un {p}% cuenta como hecho. Otra vuelta.', 'It counts as done from {p}%. Go again.'],
  'komm.convThis': ['💬 Conversación sobre esto', '💬 Conversation about this'],
  'komm.convLesson': ['Conversación nativa de la lección', 'Native conversation for this lesson'],
  'komm.convLessonSub': [
    'La IA escribe un diálogo real entre dos hablantes usando estas situaciones, con traducción, expresiones útiles y preguntas de comprensión.',
    'The AI writes a real dialogue between two speakers using these situations, with translation, useful phrases and comprehension questions.'
  ],
  'komm.genConv': ['💬 Generar conversación', '💬 Generate conversation'],
  'komm.writing': ['Escribiendo…', 'Writing…'],
  'komm.offConv': [
    'Activa la IA en el menú lateral para generar conversaciones.',
    'Turn on AI in the sidebar to generate conversations.'
  ],
  'komm.askTitle': ['Conversación sobre lo que quieras', 'A conversation about anything you like'],
  'komm.askSub': ['di una situación y la IA escribe el diálogo', 'name a situation and the AI writes the dialogue'],
  'komm.askPh': [
    'p. ej. reclamar en una tienda, pedir cita en el médico…',
    'e.g. complaining in a shop, booking a doctor appointment…'
  ],
  'komm.askGo': ['Generar', 'Generate'],
  'komm.askWriting': ['Escribiendo la conversación… (tarda un minuto)', 'Writing the conversation… (takes a minute)'],
  'dlg.phrases': ['💡 Expresiones útiles del diálogo', '💡 Useful phrases from the dialogue'],
  'dlg.questions': ['❓ ¿Lo has entendido?', '❓ Did you get it?'],
  'dlg.other': ['🔄 Otra conversación', '🔄 Another conversation'],
  'dlg.listen': ['🔊 Escuchar la conversación', '🔊 Listen to the conversation'],
  'dlg.stop': ['⏹ Parar', '⏹ Stop'],

  // Notizbuch
  'nb.sub': [
    'Tus apuntes de clase. Escríbelos tal cual, pásalos a limpio con IA y repásalos con ejercicios.',
    'Your class notes. Write them as they come, tidy them up with AI and review them with exercises.'
  ],
  'nb.offHint': [
    'Puedes escribir y guardar apuntes sin IA. Para pasarlos a limpio y generar ejercicios, actívala en el menú lateral.',
    'You can write and save notes without AI. To tidy them up and generate exercises, turn it on in the sidebar.'
  ],
  'nb.new': ['+ Neuer Eintrag', '+ Neuer Eintrag'],
  'nb.withEx': ['{n} con ejercicios', '{n} with exercises'],
  'nb.empty': [
    'Aún no hay apuntes. Crea la primera entrada después de tu próxima clase.',
    'No notes yet. Create your first entry after your next class.'
  ],
  'nb.noContent': ['Sin contenido todavía', 'No content yet'],
  'nb.clean': ['A limpio', 'Tidied up'],
  'nb.exercises': ['📝 {n} ejercicios', '📝 {n} exercises'],
  'foto.confirmDel': ['¿Borrar esta foto del cuaderno?', 'Delete this photo from the notebook?'],
  'foto.deleteOne': ['Borrar', 'Delete'],
  'foto.savePhoto': ['Guardar foto', 'Save photo'],
  'foto.saving': ['Guardando…', 'Saving…'],
  'foto.savedOnly': ['Foto guardada', 'Saved photo'],
  'foto.savedCount': ['Fotos guardadas ({n})', 'Saved photos ({n})'],
  'foto.openSaved': ['Ampliar foto', 'Enlarge photo'],
  'foto.close': ['Cerrar foto', 'Close photo'],
  'foto.doneA': ['✅ Ejercicios resueltos ({n})', '✅ Solved exercises ({n})'],
  'foto.doneB': ['✅ Imágenes descritas ({n})', '✅ Described pictures ({n})'],
  'foto.keepHint': [
    'Se quedan aquí todos: añadir una foto nueva no borra las anteriores. Para quitar una, su ✕.',
    'They all stay here: adding a new photo does not delete the earlier ones. To remove one, use its ✕.'
  ],
  'foto.ejercicioN': ['Ejercicio {n}', 'Exercise {n}'],
  'nb.analysing': ['analizando la foto', 'reading the photo'],
  'nb.draft': ['✏️ Borrador', '✏️ Draft'],
  'nb.notFound': ['No se encontró la entrada.', 'Entry not found.'],
  'nb.confirmDel': ['¿Borrar esta entrada del cuaderno?', 'Delete this notebook entry?'],
  'nb.titlePh': ['Título (p. ej. Clase del martes — weil)', 'Title (e.g. Tuesday class — weil)'],
  'nb.date': ['Fecha', 'Date'],
  'nb.lesson': ['Lección', 'Lesson'],
  'nb.noLesson': ['-- Ninguna --', '-- None --'],
  'nb.fromBook': ['De esta lección en el libro ({band}):', 'From this lesson in the book ({band}):'],
  'nb.yourNotes': ['Tus apuntes de clase', 'Your class notes'],
  'nb.notesPh': ['Escribe aquí lo que has apuntado en clase, tal cual…', 'Write here what you noted in class, just as it is…'],
  'nb.doClean': ['Pasar a limpio', 'Tidy it up'],
  'nb.cleaning': ['Pasando a limpio…', 'Tidying up…'],
  'nb.doItems': ['📝 Generar ejercicios', '📝 Generate exercises'],
  'nb.offBoth': ['Activa la IA en el menú lateral para estas dos opciones.', 'Turn on AI in the sidebar for these two options.'],
  'nb.cleanTitle': ['A limpio', 'Tidied up'],
  'nb.regen': ['Regenerar', 'Regenerate'],
  'nb.review': ['📝 Repaso · {n} ejercicios', '📝 Review · {n} exercises'],
  'nb.startReview': ['▶ Empezar repaso', '▶ Start review'],

  // Foto de un ejercicio / imagen
  'foto.titleA': ['📷 Foto para guardar o resolver un ejercicio', '📷 Photo to save or solve an exercise'],
  'foto.subA': [
    'Guarda la foto para consultarla después, o pulsa «Resolver el ejercicio» para recibir correcciones y una explicación.',
    'Save the photo to review later, or choose “Solve the exercise” to get corrections and an explanation.'
  ],
  'foto.titleB': ['🖼️ Describir una imagen', '🖼️ Describe a picture'],
  'foto.subB': [
    'Guarda cualquier imagen para verla más tarde, o pide que la describa en alemán con vocabulario, frases y preguntas.',
    'Save any picture to view it later, or ask for a German description with vocabulary, phrases and questions.'
  ],
  'foto.pickA': ['Elegir o hacer una foto del ejercicio', 'Choose or take a photo of the exercise'],
  'foto.pick': ['Elegir o hacer una foto', 'Choose or take a photo'],
  'foto.formats': ['JPG, PNG, WEBP · máx. 12 MB', 'JPG, PNG, WEBP · max 12 MB'],
  'foto.solve': ['✅ Resolver el ejercicio', '✅ Solve the exercise'],
  'foto.solving': ['Resolviendo…', 'Solving…'],
  'foto.describe': ['🗣️ Describir la imagen', '🗣️ Describe the picture'],
  'foto.describing': ['Describiendo…', 'Describing…'],
  'foto.remove': ['Quitar foto', 'Remove photo'],
  'foto.wait': ['Leyendo la foto… tarda un minuto.', 'Reading the photo… this takes a minute.'],
  'foto.needsLocal': [
    'Para resolver o describir fotos hace falta «IA · Claude (local, sin key)». Guardarlas no necesita IA.',
    'Solving or describing photos needs "AI · Claude (local, no key)". Saving them does not need AI.'
  ],
  'foto.description': ['Descripción', 'Description'],
  'foto.phrases': ['💬 Frases para hablar de esto', '💬 Phrases to talk about this'],
  'foto.vocab': ['Vocabulario de la imagen', 'Vocabulary from the picture'],
  'foto.questions': ['Preguntas sobre la imagen', 'Questions about the picture'],

  // Tagebuch
  'tb.sub': [
    'Escribe en alemán sobre tu día, lo que sea. La IA te lo corrige, te explica cada fallo y te da una lección con lo que más te conviene repasar.',
    'Write in German about your day, whatever it is. The AI corrects it, explains every mistake and gives you a lesson on what you most need to review.'
  ],
  'tb.entries': ['Entradas', 'Entries'],
  'tb.new': ['+ Neuer Eintrag', '+ Neuer Eintrag'],
  'tb.wordsWritten': ['Palabras escritas', 'Words written'],
  'tb.topMistakes': ['Lo que más se te repite', 'What you repeat most'],
  'tb.topMistakesSub': [
    'Sacado de todas tus correcciones. Si algo sale mucho, ahí tienes tu próximo tema.',
    'Taken from all your corrections. If something comes up a lot, that is your next topic.'
  ],
  'tb.offHint': [
    'Puedes escribir y guardar sin IA. Para corregir, actívala en el menú lateral.',
    'You can write and save without AI. To get corrections, turn it on in the sidebar.'
  ],
  'tb.empty': [
    'Todavía no has escrito nada. Empieza con tres o cuatro frases sobre hoy: no hace falta que estén bien, para eso está la corrección.',
    'You have not written anything yet. Start with three or four sentences about today: they do not need to be right, that is what the correction is for.'
  ],
  'tb.noText': ['Sin texto todavía', 'No text yet'],
  'tb.isCorrected': ['✅ Corregida', '✅ Corrected'],
  'tb.noMistakes': ['sin fallos 🎉', 'no mistakes 🎉'],
  'tb.nCorrections': ['{n} correcciones', '{n} corrections'],
  'tb.oneCorrection': ['1 corrección', '1 correction'],
  'tb.notCorrected': ['Sin corregir', 'Not corrected'],
  'tb.notFound': ['No se encontró la entrada.', 'Entry not found.'],
  'tb.confirmDel': ['¿Borrar esta entrada del diario?', 'Delete this diary entry?'],
  'tb.tabMineSub': ['lo que escribiste', 'what you wrote'],
  'tb.writePrompt': ['Schreib auf Deutsch — sobre lo que quieras', 'Schreib auf Deutsch — about anything you like'],
  'tb.ideas': ['¿No sabes por dónde empezar?', 'Not sure where to start?'],
  'tb.topicBtn': ['🎲 Generar tema', '🎲 Generate a topic'],
  'tb.topicAgain': ['🎲 Otro tema', '🎲 Another topic'],
  'tb.topicThinking': ['Pensando un tema…', 'Thinking of a topic…'],
  'tb.starters': ['Para arrancar (pulsa una)', 'Starters (tap one)'],
  'tb.topicWords': ['Vocabulario para este tema', 'Words for this topic'],
  'tb.dropTopic': ['Quitar', 'Remove'],
  'tb.correctBtn': ['✅ Corregir mi texto', '✅ Correct my text'],
  'tb.correctAgain': ['🔄 Corregir otra vez', '🔄 Correct again'],
  'tb.correcting': ['Corrigiendo…', 'Correcting…'],
  'tb.offCorrect': ['Activa la IA en el menú lateral para corregir.', 'Turn on AI in the sidebar to get corrections.'],
  'tb.praise': ['Lo que has hecho bien', 'What you did well'],
  'tb.corrected2': ['Tu texto corregido', 'Your corrected text'],
  'tb.perfect': ['Sin errores. 🎉 Prueba a escribir frases más largas la próxima vez.', 'No mistakes. 🎉 Try writing longer sentences next time.'],
  'tb.oneByOne': ['Correcciones una por una', 'Corrections one by one'],
  'tb.lesson': ['📖 Tu lección de hoy: {t}', '📖 Your lesson today: {t}'],
  'tb.native': ['💬 Cómo lo diría un nativo', '💬 How a native would say it'],
  'tb.nextStep': ['Para la próxima entrada', 'For your next entry'],

  // Prüfung
  'pf.sub': [
    'Simulacro del examen A2 (Goethe / ÖSD) con los cuatro Teile. Cada tarea se genera nueva, con las mismas trampas que el examen real: negaciones, distractores y sinónimos.',
    'A2 exam mock (Goethe / ÖSD) with all four Teile. Every task is generated fresh, with the same traps as the real exam: negations, distractors and synonyms.'
  ],
  'pf.notDone': ['Sin hacer', 'Not attempted'],
  'pf.attempts': ['{n} intentos · último {p}%', '{n} attempts · last {p}%'],
  'pf.oneAttempt': ['1 intento · {p}%', '1 attempt · {p}%'],
  'pf.realAudio': ['Exámenes oficiales con audio', 'Official exams with audio'],
  'pf.realAudioSub': [
    'Modelos completos de A2 con sus MP3, transcripciones y soluciones, gratis desde los propios organismos. Debajo, audio graduado para entrenar el oído a diario.',
    'Full A2 model exams with their MP3s, transcripts and answer keys, free from the exam boards. Below, graded audio for daily practice.'
  ],
  'pf.realSpeech': ['Alemán hablado de verdad', 'Real spoken German'],
  'pf.realSpeechSub': [
    'Para soltarte hace falta oír a gente hablando y repetir en voz alta. De más fácil a más difícil:',
    'To loosen up you need to hear people talking and repeat out loud. Easiest first:'
  ],
  'pf.offHint': [
    'Activa la IA en el menú lateral: cada tarea del examen se genera al momento.',
    'Turn on AI in the sidebar: every exam task is generated on the spot.'
  ],
  'pf.trapsTitle': ['Las trampas del examen', 'The traps in the exam'],
  'pf.trapsSub': [
    'En A2 casi nadie suspende por vocabulario difícil. Se suspende por esto.',
    'At A2 almost nobody fails because of hard vocabulary. This is what makes people fail.'
  ],
  'pf.showTraps': ['Ver las 5 trampas', 'See the 5 traps'],
  'pf.hideTraps': ['Ocultar', 'Hide'],
  'pf.lastRuns': ['Últimos simulacros', 'Recent mocks'],

  // Bestenliste
  'lb.sub': ['Tus mejores sesiones. Puntúa la precisión y penaliza el tiempo.', 'Your best sessions. Accuracy scores, time penalises.'],
  'lb.allTopics': ['Todos los temas', 'All topics'],
  'lb.empty': ['Aún no hay sesiones registradas.', 'No sessions recorded yet.'],
  'lb.topic': ['Tema', 'Topic'],
  'lb.hits': ['Aciertos', 'Correct'],
  'lb.acc': ['Prec.', 'Acc.'],
  'lb.time': ['Tiempo', 'Time'],
  'lb.points': ['Puntos', 'Points'],
  'lb.date': ['Fecha', 'Date'],


  // Einstellungen
  'set.account': ['Tu cuenta', 'Your account'],
  'set.level': ['Nivel', 'Level'],
  'set.crowns': ['Coronas', 'Crowns'],
  'set.streakDays': ['Días seguidos', 'Day streak'],
  'set.bestRun': ['Récord de seguidas', 'Best run'],
  'set.foxHint': [
    'A {nombre} lo personalizas desde la portada, con el botón «Personalizar a {nombre}».',
    'You customise {nombre} from the home page, with the "Customise {nombre}" button.'
  ],
  'set.session': ['Sesión', 'Session'],
  'set.perSession': ['Ejercicios por sesión', 'Exercises per session'],
  'set.xpHint': [

    'Cuántos ejercicios trae una tanda. Manda en todos los juegos menos en Emparejar (6 parejas) y Blitz (30 segundos), que no van por número. Si el mazo tiene menos palabras, salen las que haya.',

    'How many exercises a round brings. It rules every game except Match (6 pairs) and Blitz (30 seconds), which do not go by count. If the deck has fewer words, you get what there is.'

  ],
  'set.aiTitle': ['Generación con IA', 'AI generation'],
  'set.aiIntro': [
    'Con una API key, los modos con IA crean ejercicios nuevos al momento centrados en tus fallos, y aparece el botón para que la IA explique cada corrección. Sin key, la app funciona igual con sus plantillas. La key se guarda solo en este navegador.',
    'With an API key, the AI modes create fresh exercises on the spot focused on your mistakes, and a button appears for the AI to explain each correction. Without a key the app still works with its templates. The key is stored only in this browser.'
  ],
  'set.aiLive': ['IA activa · genera y explica', 'AI on · it writes and explains'],
  'set.aiNoKey': ['Falta la API key: la IA no se puede usar todavía.', 'No API key yet: the AI cannot run.'],
  'set.aiTemplates': ['Plantillas locales: los ejercicios salen del libro.', 'Local templates: exercises come from the book.'],
  'set.aiOn': ['Activar IA', 'Turn on AI'],
  'set.provider': ['Proveedor', 'Provider'],
  'set.localHint': [
    'Usa el CLI claude a través del servidor de npm run dev (tu sesión de Claude Code, sin clave). Solo funciona en local con el proyecto arrancado.',
    'Uses the claude CLI through the npm run dev server (your Claude Code session, no key). Only works locally with the project running.'
  ],
  'set.localConClave': [
    'Tienes guardada una clave y el modelo «{modelo}». Cuando el puente local no esté, se usará esa clave, así que la IA sigue funcionando fuera de npm run dev. Para usarla siempre, elige Gemini u OpenAI arriba.',
    'You have a key saved and the model "{modelo}". When the local bridge is not there, that key is used instead, so AI keeps working outside npm run dev. To use it always, pick Gemini or OpenAI above.'
  ],
  'set.model': ['Modelo', 'Model'],
  'set.keyPh': ['pega aquí tu clave', 'paste your key here'],
  'set.geminiHint': ['Se consigue gratis en aistudio.google.com/apikey', 'Get one free at aistudio.google.com/apikey'],
  'set.openaiHint': ['Endpoint compatible con /chat/completions', 'Endpoint compatible with /chat/completions'],
  'set.aiShare': ['Parte de la sesión generada por IA', 'Share of the session generated by AI'],
  // Sin esto el mando no dice a que afecta, y el 0 parece que apaga la IA
  // entera cuando en realidad solo toca la practica de gramatica.
  'set.aiShareHint': [

    'Afecta a los cuatro juegos de gramática (test, escribir, ordenar y cazar el error) y a los seis de vocabulario, donde añade palabras nuevas del mismo tema. Las palabras nuevas se piden una vez por mazo y se guardan, para no gastar cuota en cada partida. «Repaso con IA» de la portada no hace caso de este mando: ese botón pide ejercicios nuevos siempre.',

    'Affects the four grammar games (quiz, type it, sentence order and spot the mistake) and the six vocabulary ones, where it adds fresh words on the same topic. Those words are requested once per deck and kept, so each round costs no quota. The "AI review" button on the home page ignores this slider: it always asks for fresh exercises.'

  ],
  'set.aiShareOff': ['Todo de plantillas: instantáneo y sin gastar cuota.', 'All from templates: instant, and it uses no quota.'],
  'set.testConn': ['Probar conexión', 'Test connection'],
  'set.testing': ['Probando conexión…', 'Testing connection…'],
  'set.testOk': ['✅ Conecta bien ({n} ejercicios de prueba)', '✅ Connects fine ({n} test exercises)'],
  'set.testWeird': ['⚠️ Responde pero sin ejercicios válidos: revisa el modelo.', '⚠️ It answers but with no valid exercises: check the model.'],
  'set.data': ['Datos', 'Data'],
  // Lo que mas se pregunta de esto: "si me pasas una version nueva, pierdo lo
  // mio?". No: el progreso lo guarda el navegador y no va dentro del fichero.
  'set.dataIntro': [
    'Tu progreso lo guarda el navegador, no el archivo: si cambias el HTML por una versión nueva y la abres en el mismo navegador, sigue todo ahí. Exporta antes de cambiar de navegador o de equipo, o de borrar los datos de navegación. La copia se lleva también las fotos de los apuntes, así que puede tardar y pesar unos megas.',
    'Your progress is kept by the browser, not inside the file: if you swap the HTML for a newer version and open it in the same browser, everything is still there. Export before switching browser or computer, or before clearing browsing data. The backup includes the notebook photos too, so it can take a moment and weigh a few megabytes.'
  ],
  'set.export': ['Exportar progreso', 'Export progress'],
  'set.exporting': ['Preparando la copia…', 'Preparing the backup…'],
  'set.import': ['Importar', 'Import'],
  'set.build': ['Versión del {fecha}', 'Version of {fecha}'],
  'set.reset': ['Reiniciar progreso', 'Reset progress'],
  'set.imported': ['Datos importados. Recarga la página.', 'Data imported. Reload the page.'],
  'set.badFile': ['Archivo no válido.', 'Invalid file.'],
  'set.confirmReset': [
    '¿Borrar TODO tu progreso? Gramática, vocabulario, rachas, monedas, tu zorro, el diario, el cuaderno y las canciones guardadas. Tus ajustes (idioma, IA) se quedan. No se puede deshacer: exporta antes si quieres guardarlo.',
    'Delete ALL your progress? Grammar, vocabulary, streaks, coins, your fox, the diary, the notebook and saved songs. Your settings (language, AI) are kept. This cannot be undone: export first if you want a copy.'
  ],
  'set.resetDone': ['Progreso borrado ({n} cosas).', 'Progress deleted ({n} items).'],

  // Prüfung: pantallas de tarea
  'ex.backBtn': ['Volver al examen', 'Back to exam'],
  'ex.cantLoad': ['No se pudo cargar la tarea.', 'Could not load the task.'],
  'ex.listen': ['▶ Escuchar', '▶ Listen'],
  'ex.listenAgain': ['🔁 Escuchar de nuevo', '🔁 Listen again'],
  'ex.stop': ['⏹ Detener', '⏹ Stop'],
  'ex.listenNote': ['En el examen se oye 1 o 2 veces', 'In the exam you hear it once or twice'],
  'ex.listenedN': ['escuchado {n} veces', 'listened {n} times'],
  'ex.listenedOnce': ['escuchado 1 vez', 'listened once'],
  'ex.speed': ['Velocidad', 'Speed'],
  'ex.noVoice': ['No hay ninguna voz alemana instalada en este equipo.', 'No German voice is installed on this computer.'],
  'ex.noVoiceHow': [
    'En Windows: Configuración → Hora e idioma → Voz → Administrar voces → Agregar voces → Alemán. Después reinicia el navegador. Mientras tanto puedes hacer la tarea leyendo la transcripción.',
    'On Windows: Settings → Time & language → Speech → Manage voices → Add voices → German. Then restart the browser. Meanwhile you can do the task by reading the transcript.'
  ],
  'ex.copyScript': ['📋 Copiar el texto', '📋 Copy the text'],
  'ex.copied': ['✓ Copiado', '✓ Copied'],
  'komm.copyConv': ['📋 Copiar la conversación', '📋 Copy the conversation'],
  'ex.showScript': ['Mostrar la transcripción', 'Show the transcript'],
  'ex.script': ['Transcripción', 'Transcript'],
  'ex.itsHere': ['Está aquí: ', 'It is here: '],
  'ex.finish': ['Terminar — corregir', 'Finish — check'],
  'ex.answered': ['{a}/{b} contestadas', '{a}/{b} answered'],
  'ex.sameAgain': ['🔄 Otra tarea del mismo tipo', '🔄 Another task of the same type'],
  'ex.otherTask': ['🔄 Otra tarea', '🔄 Another task'],
  'ex.passWith': ['{c} de {t} correctas · se aprueba con {p}%', '{c} of {t} correct · pass mark is {p}%'],
  'ex.pointsCovered': ['{a} de {b} puntos cubiertos · se aprueba con {p}%', '{a} of {b} points covered · pass mark is {p}%'],
  'ex.writeTo': ['Escribes a: {q}', 'You are writing to: {q}'],
  'ex.aboutWords': ['Unas {n} palabras. No olvides saludo y despedida.', 'About {n} words. Do not forget a greeting and a sign-off.'],
  'ex.mailGot': ['El correo que recibes', 'The email you receive'],
  'ex.wordsTarget': ['{n} palabras · objetivo ~{o}', '{n} words · target ~{o}'],
  'ex.howScored': ['Cómo se ha puntuado', 'How it was scored'],
  'ex.critTask': ['Cumplimiento de la tarea', 'Task fulfilment'],
  'ex.critCoh': ['Coherencia', 'Coherence'],
  'ex.critVoc': ['Vocabulario', 'Vocabulary'],
  'ex.critGram': ['Gramática', 'Grammar'],
  'ex.yourCorrected': ['Tu texto corregido', 'Your corrected text'],
  'ex.corrections': ['Correcciones', 'Corrections'],
  'ex.nextTime': ['Para la próxima', 'For next time'],
  'ex.model': ['Respuesta modelo', 'Model answer'],
  'ex.see': ['ver ▾', 'see ▾'],
  'ex.prepTime': ['Tiempo de preparación', 'Preparation time'],
  'ex.prepNote': [
    'En el examen tienes unos minutos para pensar antes de hablar. Habla en voz alta de verdad: es la única forma de que esto sirva.',
    'In the exam you get a few minutes to think before speaking. Actually speak out loud: that is the only way this helps.'
  ],
  'ex.restart': ['🔄 Reiniciar', '🔄 Restart'],
  'ex.agreeOn': ['Hay que poneros de acuerdo en:', 'You have to agree on:'],
  'ex.yourCards': ['Tus tarjetas', 'Your cards'],
  'ex.phrasesNeeded': ['💬 Expresiones que te van a hacer falta', '💬 Phrases you will need'],
  'ex.examinerLooks': ['Qué mira el examinador', 'What the examiner looks for'],
  'ex.howSolved': ['Cómo se resuelve (modelo)', 'How it is done (model)'],
  'ex.tryFirst': ['inténtalo tú primero ▾', 'try it yourself first ▾'],
  'ex.hide': ['ocultar ▴', 'hide ▴'],
  'ex.sprechenNote': [
    'Esta parte no se puede puntuar sola: el examen es en pareja y con dos examinadores. Aquí tienes la tarea, el tiempo de preparación, las expresiones y el modelo — el resto es hablar.',
    'This part cannot be scored on its own: the exam is in pairs with two examiners. Here you get the task, the preparation time, the phrases and the model — the rest is speaking.'
  ],

  // juegos de vocabulario
  'vs.tapToSee': ['toca para ver la traducción', 'tap to see the translation'],
  'vs.seeTranslation': ['👁 Ver traducción', '👁 See translation'],
  'vs.didNotKnow': ['😕 No la sabía', '😕 Didn\'t know'],
  'vs.knewIt': ['😃 La sabía', '😃 Knew it'],
  'vs.tapToFlip': ['toca para girar', 'tap to flip'],
  'vs.toEs': ['al español', 'into English'],
  'vs.toDe': ['al alemán', 'to German'],
  'vs.genderQ': ['¿Qué artículo lleva?', 'Which article does it take?'],
  'vs.noExercises': ['Esta entrada no tiene ejercicios todavía.', 'This entry has no exercises yet.'],
  'vs.whatMeans': ['¿Qué significa?', 'What does it mean?'],
  'vs.writeTranslation': ['Escribe la traducción', 'Write the translation'],
  'vs.yourAnswer': ['tu respuesta…', 'your answer…'],
  'vs.youWrote': ['Tu respuesta:', 'You wrote:'],
  'vs.answerIs': ['Respuesta:', 'Answer:'],
  'vs.noCards': ['Este mazo no tiene tarjetas.', 'This deck has no cards.'],
  'vs.egTag': ['Ej.', 'e.g.'],

  // Nachrichten
  'news.title': ['Nachrichten', 'Nachrichten'],
  'news.sub': [

    'Viena y Austria: noticias, ciencia, eventos, deporte y el tiempo, en alemán de tu nivel.',

    'Vienna and Austria: news, science, events, sport and the weather, in German at your level.'

  ],
  'news.search': ['📰 Buscar noticias', '📰 Find news'],
  'news.searchEvents': ['🎪 Buscar eventos', '🎪 Find events'],
  'news.searchSport': ['⚽ Buscar deportes', '⚽ Find sport'],
  'news.searchWeather': ['🌤️ Ver el tiempo', '🌤️ Get the weather'],
  'news.city': ['Ciudad', 'City'],
  'news.cityPh': ['Wien, Graz, Salzburg, Madrid…', 'Wien, Graz, Salzburg, Madrid…'],
  'news.refresh': ['🔄 Actualizar', '🔄 Refresh'],
  'news.emptyTab': [
    'Esto todavía no está buscado. Dale al botón: tarda un par de minutos porque rastrea YouTube y los medios austriacos de verdad.',
    'This tab has not been searched yet. Hit the button: it takes a couple of minutes because it really crawls YouTube and the Austrian media.'
  ],
  'news.videoFirst': ['Con vídeo', 'Has video'],
  'news.forget': ['🧹 Olvidar {n} vistas', '🧹 Forget {n} seen'],
  'news.forgetHint': [
    'Al actualizar te doy noticias distintas a las que ya te he enseñado. Pulsa aquí para volver a permitirlas.',
    'On refresh I bring stories different from the ones you have already seen. Hit this to allow them again.'
  ],
  'news.alsoRunning': [
    'otras {n} pestañas siguen buscando',
    '{n} other tabs are still searching'
  ],
  'news.vocab': ['Vocabulario de la noticia', 'Vocabulary from this story'],
  'news.read': ['🔗 Leer en', '🔗 Read on'],
  'news.watch': ['▶ Ver en YouTube', '▶ Watch on YouTube'],
  'news.ytSearch': ['▶ Buscarlo en YouTube', '▶ Look for it on YouTube'],
  'news.updated': ['actualizado', 'updated'],
  'news.justNow': ['ahora mismo', 'just now'],
  'news.hoursAgo': ['hace {n} h', '{n} h ago'],
  'news.tabNews': ['Noticias', 'News'],
  'news.tabEvents': ['Eventos en Viena', 'Events in Vienna'],
  'news.when': ['Cuándo', 'When'],
  'news.where': ['Dónde', 'Where'],
  'news.price': ['Precio', 'Price'],
  'news.tabSport': ['Deportes', 'Sport'],
  'news.tabWissen': ['Ciencia y curiosidades', 'Science and curiosities'],
  'news.searchWissen': ['🔬 Buscar curiosidades', '🔬 Find curiosities'],
  'news.tabWeather': ['El tiempo', 'Weather'],
  'news.result': ['Resultado', 'Result'],
  'news.next': ['Próximo', 'Next up'],
  'news.warning': ['Aviso', 'Warning'],
  'news.weatherVocab': ['Vocabulario del tiempo', 'Weather vocabulary'],

  // ---------- rescatadas del bundle ----------
  // Un comando interrumpido a media escritura dejo este fichero en ceros y
  // el ultimo commit iba 142 claves por detras. Los textos se sacaron del
  // bundle ya construido, que los lleva enteros; lo que no se pudo recuperar
  // son los comentarios que habia entre ellos.

  // dlg
  'dlg.vacia': [
    'Esta conversación se guardó sin intervenciones. Pídela otra vez.',
    'This conversation was saved with no lines. Ask for it again.'
  ],

  // err
  'err.aiExercises': [
    'Activa la IA en el menú lateral para generar ejercicios.',
    'Turn on AI in the sidebar to generate exercises.'
  ],
  'err.aiPractise': [
    'Activa la IA en el menú lateral para practicar esto.',
    'Turn on AI in the sidebar to practise this.'
  ],
  'err.aiVocab': [
    'Activa la IA en el menú lateral para generar vocabulario.',
    'Turn on AI in the sidebar to generate vocabulary.'
  ],
  'err.aiSettings': ['Activa la IA en Ajustes para usar esto.', 'Turn on AI in Settings to use this.'],
  'err.aiPhoto': [
    'Activa la IA en el menú lateral para usar la foto.',
    'Turn on AI in the sidebar to use the photo.'
  ],
  'err.aiNotes': [
    'Activa la IA en el menú lateral para pasar los apuntes a limpio.',
    'Turn on AI in the sidebar to tidy up your notes.'
  ],
  'err.aiDialog': [
    'Activa la IA en el menú lateral para generar la conversación.',
    'Turn on AI in the sidebar to generate the conversation.'
  ],
  'err.aiAsk': [
    'Activa la IA en el menú lateral para preguntar dudas.',
    'Turn on AI in the sidebar to ask questions.'
  ],
  'err.aiNews': [
    'Activa la IA en el menú lateral para ver las noticias.',
    'Turn on AI in the sidebar to see the news.'
  ],
  'err.aiFox': [
    'Activa la IA en el menú lateral para hablar con el zorro.',
    'Turn on AI in the sidebar to chat with your buddy.'
  ],
  'err.aiExplain': [
    'Activa la IA en el menú lateral para pedir la explicación.',
    'Turn on AI in the sidebar to ask for the explanation.'
  ],
  'err.aiTopic': [
    'Activa la IA en el menu lateral para que te proponga un tema.',
    'Turn on AI in the sidebar to get a writing topic.'
  ],
  'err.aiDiary': [
    'Activa la IA en el menú lateral para corregir el diario.',
    'Turn on AI in the sidebar to correct your diary.'
  ],
  'err.aiConjugate': ['Activa la IA para conjugar verbos.', 'Turn on AI to conjugate verbs.'],
  'err.aiOpen': ['Activa la IA para evaluar respuestas abiertas.', 'Turn on AI to mark open answers.'],
  'err.aiExpand': [
    'Activa la IA en el menú lateral para ampliar el tema.',
    'Turn on AI in the sidebar to expand the topic.'
  ],
  'err.aiExam': [
    'Activa la IA en el menú lateral para generar el examen.',
    'Turn on AI in the sidebar to generate the exam.'
  ],
  'err.aiTask': [
    'Activa la IA en el menú lateral para generar la tarea.',
    'Turn on AI in the sidebar to generate the task.'
  ],
  'err.aiCorrect': [
    'Activa la IA en el menú lateral para corregir.',
    'Turn on AI in the sidebar to get it corrected.'
  ],
  'err.aiSong': [
    'Activa la IA en el menú lateral para pedir una canción.',
    'Turn on AI in the sidebar to ask for a song.'
  ],
  'err.noValidItems': [
    'La IA no devolvió ejercicios válidos. Inténtalo otra vez.',
    'The AI didn\'t return valid exercises. Try again.'
  ],
  'err.noUsableItems': [
    'La IA no devolvió ejercicios utilizables. Inténtalo otra vez.',
    'The AI didn\'t return usable exercises. Try again.'
  ],
  'err.noDeck': [
    'La IA no devolvió un mazo válido. Inténtalo otra vez.',
    'The AI didn\'t return a valid deck. Try again.'
  ],
  'err.noCards': [
    'La IA no devolvió tarjetas. Inténtalo otra vez.',
    'The AI didn\'t return any cards. Try again.'
  ],
  'err.noDialog': [
    'La IA no devolvió una conversación válida. Inténtalo otra vez.',
    'The AI didn\'t return a valid conversation. Try again.'
  ],
  'err.noAnswer': [
    'La IA no devolvió una respuesta válida. Prueba a reformular la duda.',
    'The AI didn\'t return a valid answer. Try rewording your question.'
  ],
  'err.noSources': [
    'Lo recibido no traía fuentes válidas. Prueba otra vez.',
    'What came back had no valid sources. Try again.'
  ],
  'err.taskFailed': [
    'No se pudo generar la tarea. Inténtalo otra vez.',
    'The task couldn\'t be generated. Try again.'
  ],
  'err.noBridge': [
    'No se pudo contactar con el puente local. ¿Está corriendo "npm run dev"?',
    'Couldn\'t reach the local bridge. Is "npm run dev" running?'
  ],
  'err.noNotes': ['No hay apuntes en esta lección todavía.', 'There are no notes for this lesson yet.'],
  'err.pickPhoto': ['Elige una foto primero.', 'Choose a photo first.'],
  'err.writeQuestion': ['Escribe tu duda primero.', 'Write your question first.'],
  'err.writeSomething': ['Escribe algo primero.', 'Write something first.'],
  'err.writeAnswer': ['Escribe tu respuesta primero.', 'Write your answer first.'],
  'err.foxConfused': [
    'El zorro se ha liado y no ha contestado bien. Prueba otra vez.',
    'Your buddy got muddled and didn\'t answer properly. Try again.'
  ],
  'err.readExplain': [
    'No se pudo leer la explicación. Prueba otra vez.',
    'The explanation couldn\'t be read. Try again.'
  ],
  'err.conjFailed': ['No se pudo generar la conjugación.', 'The conjugation couldn\'t be generated.'],
  'err.parseFailed': [
    'No se pudo interpretar la respuesta de la IA.',
    'The AI\'s answer couldn\'t be understood.'
  ],
  'err.readWords': [
    'No se pudo leer la lista de palabras nuevas.',
    'The list of new words couldn\'t be read.'
  ],
  'err.taskNotYet': [
    'Ese tipo de tarea todavía no está disponible.',
    'That kind of task isn\'t available yet.'
  ],
  'err.taskUnknown': ['Ese tipo de tarea no existe.', 'That kind of task doesn\'t exist.'],
  'err.taskIncomplete': [
    'La tarea llegó incompleta. Inténtalo otra vez.',
    'The task came back incomplete. Try again.'
  ],
  'err.readCorrection': [
    'No se pudo leer la corrección. Inténtalo otra vez.',
    'The correction couldn\'t be read. Try again.'
  ],
  'err.readPhoto': ['No se pudo leer el análisis de la foto.', 'The photo analysis could not be read.'],
  'err.readTopic': ['No se pudo leer el tema.', 'The topic could not be read.'],
  'err.readFix': ['No se pudo leer la corrección.', 'The correction could not be read.'],
  'err.readProposal': ['No se pudo leer la propuesta.', 'The suggestion could not be read.'],
  'err.gotBack': [' Llegó: "{pista}…"', ' Got back: "{pista}…"'],
  'err.unknownSection': ['Sección desconocida: {que}', 'Unknown section: {que}'],

  // fox
  'fox.otraFrase': ['Toca para otra', 'Tap for another'],
  'fox.compras': ['cosas nuevas que comprar', 'new things to buy'],
  'fox.compraUna': ['cosa nueva que comprar', 'new thing to buy'],

  // gg
  'gg.pista': ['💡 Pista', '💡 Hint'],
  'gg.descarte': ['No es {art}. Quedan dos.', 'It is not {art}. Two left.'],

  // gr
  'gr.mixTitle': ['Practicar sin elegir lección', 'Practise without picking a lesson'],
  'gr.mixSub': [
    'Ejercicios al azar de toda la gramática, o de un nivel entero. Para repasar cuando no sabes qué repasar.',
    'Random exercises from all the grammar, or from one whole level. For when you want to review and do not know what.'
  ],
  'gr.mixAll': ['Toda la gramática mezclada', 'All the grammar mixed'],
  'gr.soloPlantillas': [
    'Todos los ejercicios salen de las plantillas del libro.',
    'All exercises come from the book templates.'
  ],
  'gr.sinEjercicios': [
    'Esta lección no trae ejercicios en esta versión: solo la teoría.',
    'This lesson has no exercises in this version: theory only.'
  ],

  // hg
  'hg.hintEs': ['Qué significa', 'What it means'],
  'hg.instruction': ['Adivina la palabra con las letras disponibles. Puedes pedir pistas.', 'Guess the word using the available letters. You can ask for hints.'],
  'hg.hintArt': ['Artículo / primera letra', 'Article / first letter'],
  'hg.hintLetter': ['Descubrir una letra', 'Reveal a letter'],
  'hg.revealedLetter': ['Letra revelada: {l}', 'Letter revealed: {l}'],
  'hg.noWords': [
    'Este mazo no tiene palabras sueltas para jugar al ahorcado.',
    'This deck has no single words to play hangman with.'
  ],
  'hg.won': ['¡Bien!', 'Nice!'],
  'hg.wasWord': ['Era', 'It was'],
  'hg.article': ['Artículo: {a}', 'Article: {a}'],
  'hg.startsWith': ['Empieza por {l}', 'Starts with {l}'],
  'hg.noCoins': [
    'Sin monedas: la has sacado con las tres pistas',
    'No coins: you got it with all three hints'
  ],
  'hg.hintsUsed': ['{n} pistas', '{n} hints'],
  'hg.oneHint': ['1 pista', '1 hint'],
  'hg.results': ['Ver resultados', 'See results'],

  // home
  'home.sesionesSub': ['Desde que empezaste', 'Since you started'],
  'home.atRiskWhy': ['Practica hoy para no perder la racha', 'Practise today to keep your streak'],
  'home.practiceNoteSinIA': [
    'Estos dan 1 moneda por acierto. Las lecciones completas, retos o exámenes otorgan más monedas y XP extra.',
    'These give 1 coin per correct answer. Complete lessons, challenges, or exams grant more coins and bonus XP.'
  ],

  // kasus
  'kasus.title': ['Kasus Trainer', 'Kasus Trainer'],
  'kasus.sub': [
    'El artículo correcto dentro de la frase · {d}/{n} dominadas ({p}%) · {e} practicadas',
    'The right article inside the sentence · {d}/{n} mastered ({p}%) · {e} practised'
  ],
  'kasus.pistaGenero': ['Género', 'Gender'],
  'kasus.pistaGeneroVal': ['{art} {nomen}', '{art} {nomen}'],
  'kasus.pistaKasus': ['Caso', 'Case'],
  'kasus.vacio': ['No hay frases para esta selección.', 'No sentences for this selection.'],

  // komm
  'komm.subSinIA': [
    'Las funciones comunicativas de Miteinander, con sus frases y su práctica.',
    'The communicative functions of Miteinander, with phrases and practice.'
  ],
  'komm.exAntwort': ['¿Qué le contestas?', 'What do you reply?'],
  'komm.exHueco': ['¿Qué palabra falta?', 'Which word is missing?'],
  'komm.exFrage': ['Te contestan a lo que ves arriba. ¿Qué habías dicho?', 'They reply to what you see above. What had you said?'],
  'komm.largo': ['Extensión', 'Length'],
  'komm.largoCorta': ['Corta', 'Short'],
  'komm.largoMedia': ['Media', 'Medium'],
  'komm.largoLarga': ['Larga', 'Long'],

  // mg
  'mg.colEs': ['Español', 'English'],
  'mg.done': ['¡Completado! 🎉', 'All matched! 🎉'],
  'mg.como': ['Toca una palabra alemana y luego su traducción para conectarlas',
              'Tap a German word and then its translation to connect them'],
  'mg.fallos': ['fallos', 'mistakes'],

  // nb
  'nb.subSinIA': [
    'Tus apuntes de clase: escríbelos, guárdalos y vuelve a ellos cuando quieras.',
    'Your class notes: write them, keep them and come back to them whenever you like.'
  ],

  // oq
  'oq.placeholder': ['Escribe tu respuesta aquí…', 'Write your answer here…'],
  'oq.marking': ['Evaluando con IA…', 'Marking with AI…'],
  'oq.good': ['¡Bien hecho!', 'Well done!'],
  'oq.improve': ['Necesita mejorar', 'Needs work'],

  // save
  'save.close': ['Cerrar', 'Close'],
  'save.rehacer': ['Volver a pedirla en este idioma', 'Ask for it again in this language'],
  'save.save': ['Guardar', 'Save'],
  'save.saved': ['Guardada', 'Saved'],
  'save.add': ['Guardar para volver a ella', 'Save it for later'],
  'save.remove': ['Quitar de guardadas', 'Remove from saved'],
  'save.showMine': ['▾ Ver mis explicaciones ({n})', '▾ Show my explanations ({n})'],
  'save.hideMine': ['▴ Ocultar mis explicaciones', '▴ Hide my explanations'],
  'save.showConv': ['▾ Ver mis conversaciones ({n})', '▾ Show my conversations ({n})'],
  'save.hideConv': ['▴ Ocultar mis conversaciones', '▴ Hide my conversations'],
  'save.mineConv': ['Tus conversaciones guardadas ({n})', 'Your saved conversations ({n})'],

  // set
  'set.confirmResetSinIA': [
    '¿Borrar TODO tu progreso? Gramática, vocabulario, rachas, monedas, tu zorro, el diario y el cuaderno. El idioma se queda. No se puede deshacer: exporta antes si quieres guardarlo.',
    'Delete ALL your progress? Grammar, vocabulary, streaks, coins, your fox, the diary and the notebook. The language is kept. This cannot be undone: export first if you want a copy.'
  ],

  // sug
  'sug.show': ['▾ Ver ideas', '▾ Show ideas'],
  'sug.hide': ['▴ Ocultar ideas', '▴ Hide ideas'],
  'sug.more': ['Otras', 'Others'],

  // sum

  // tb
  'tb.subSinIA': [
    'Escribe en alemán sobre tu día, lo que sea. Cuanto más escribas, más te sale solo.',
    'Write in German about your day, whatever it is. The more you write, the more it comes by itself.'
  ],
  'tb.emptySinIA': [
    'Todavía no has escrito nada. Empieza con tres o cuatro frases sobre hoy: no hace falta que estén bien.',
    'You have not written anything yet. Start with three or four sentences about today: they do not have to be right.'
  ],
  'tb.ideasMore': ['Otras ideas', 'Other ideas'],

  // voc
  'voc.cardsN': ['tarjetas', 'cards'],
  'voc.importNone': [
    'No se encontraron tarjetas. Necesitas al menos dos columnas: alemán y español.',
    'No cards found. You need at least two columns: German and your language.'
  ],
  'voc.importFail': ['No se pudo leer el archivo: ', 'Could not read the file: '],
  'voc.importDone': [
    'Mazo creado con {n} palabras. Lo tienes en Wortschatz.',
    'Deck created with {n} words. You will find it in Wortschatz.'
  ],
  'voc.genSub': ['Un mazo nuevo sobre el tema que le pidas', 'A new deck on any topic you ask for'],
  'voc.myDecksSubSinIA': ['Importados de un archivo', 'Imported from a file'],
  'voc.colNinguno': ['Sin color', 'No colour'],
  'voc.colRojo': ['Rojo', 'Red'],
  'voc.colAzul': ['Azul', 'Blue'],
  'voc.colVerde': ['Verde', 'Green'],
  'voc.colNaranja': ['Naranja', 'Orange'],
  'voc.colMorado': ['Morado', 'Purple'],
  'voc.combiSubDado': [
    'Practica vocabulario con distintos tipos de ejercicios, usando todos los temas o un nivel concreto.',
    'Practise vocabulary with different exercise types from every topic or one level.'
  ],
  'voc.combiNombre': ['Vocabulario mezclado ({n} mazos)', 'Mixed vocabulary ({n} decks)'],
  'voc.combiAll': ['Todo el vocabulario mezclado', 'All the vocabulary mixed'],
  'voc.sourceSinIA': [
    'Todos estos juegos usan las palabras de esta lección.',
    'All these games use the words from this lesson.'
  ],

  // wait
  'wait.vocabTitle': ['Buscando palabras nuevas', 'Looking for new words'],
  'wait.vocab1': ['Mirando lo que ya te sabes de este tema…', 'Checking what you already know here…'],
  'wait.vocab2': ['Buscando un escalón por encima…', 'Looking for a step up from that…'],
  'wait.vocab3': ['Escribiendo los ejemplos…', 'Writing the examples…'],
  'wait.dlgTitle': ['Escribiendo la conversación', 'Writing the conversation'],
  'wait.dlg1': ['Montando la situación…', 'Setting up the situation…'],
  'wait.dlg2': ['Repartiendo quién dice qué…', 'Deciding who says what…'],
  'wait.dlg3': ['Escribiendo las réplicas…', 'Writing the lines…'],
  'wait.dlg4': ['Traduciendo y sacando las preguntas…', 'Translating and pulling the questions…'],
  'wait.deckTitle': ['Creando el mazo', 'Building the deck'],
  'wait.deck1': ['Buscando las palabras del tema…', 'Looking for words on the topic…'],
  'wait.deck2': ['Poniendo el artículo a cada sustantivo…', 'Adding the article to every noun…'],
  'wait.deck3': ['Escribiendo un ejemplo por palabra…', 'Writing one example per word…'],
  'wait.deck4': ['Comprobando que no se repiten…', 'Checking there are no duplicates…'],

};

export function t(key, vars) {
  const e = DICT[key];
  let s = e ? (current === 'en' ? e[1] : e[0]) : key;
  if (vars) for (const [k, v] of Object.entries(vars)) s = s.split('{' + k + '}').join(v);
  return s;
}

// Elige entre dos textos ya escritos, sin pasar por el diccionario.
export function pick(es, en) {
  return current === 'en' ? (en ?? es) : (es ?? en);
}

