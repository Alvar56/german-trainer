// Miteinander A1.1 (Tomo 1)
// Cada Lektion: woerter (temas con palabras), grammatik (reglas con ejemplos),
// kommunikation (funciones con frases hechas).

export const A11 = {
  id: 'a11',
  name: 'A1.1',
  label: 'Tomo 1 · A1.1',
  lektionen: [
    {
      id: 'a11-start',
      nr: 'Start',
      name: "Wie geht's?",
      woerter: [
        {
          thema: 'Anweisungen im Unterricht',
          items: [
            { de: 'Hören Sie', es: 'escuche', ex: 'Hören Sie den Dialog und kreuzen Sie an.', exEs: 'Escuche el diálogo y marque con una cruz.' },
            { de: 'Lesen Sie', es: 'lea', ex: 'Lesen Sie den Text noch einmal.', exEs: 'Lea el texto otra vez.' },
            { de: 'Schreiben Sie', es: 'escriba', ex: 'Schreiben Sie fünf Sätze über sich.', exEs: 'Escriba cinco frases sobre usted.' },
            { de: 'Sprechen Sie', es: 'hable', ex: 'Sprechen Sie bitte etwas lauter.', exEs: 'Hable un poco más alto, por favor.' },
            { de: 'Ergänzen Sie', es: 'complete', ex: 'Ergänzen Sie die Endungen.', exEs: 'Complete las terminaciones.' },
            { de: 'Kreuzen Sie an', es: 'marque con una cruz', ex: 'Kreuzen Sie an: richtig oder falsch?', exEs: 'Marque con una cruz: ¿correcto o incorrecto?' },
            { de: 'Ordnen Sie zu', es: 'relacione', ex: 'Ordnen Sie die Bilder den Texten zu.', exEs: 'Relacione las imágenes con los textos.' },
            { de: 'Wiederholen Sie', es: 'repita', ex: 'Wiederholen Sie bitte den letzten Satz.', exEs: 'Repita la última frase, por favor.' },
            { de: 'Arbeiten Sie zu zweit', es: 'trabajen en parejas', ex: 'Arbeiten Sie zu zweit und vergleichen Sie.', exEs: 'Trabajen en parejas y comparen.' },
            { de: 'Öffnen Sie das Buch', es: 'abran el libro', ex: 'Öffnen Sie das Buch auf Seite zwölf.', exEs: 'Abran el libro por la página doce.' },
            { de: 'die Lösung', es: 'la solución', ex: 'Die Lösungen stehen hinten im Buch.', exEs: 'Las soluciones están al final del libro.' },
            { de: 'das Beispiel', es: 'el ejemplo', ex: 'Das erste Beispiel machen wir zusammen.', exEs: 'El primer ejemplo lo hacemos juntos.' },
            { de: 'richtig / falsch', es: 'correcto / incorrecto', ex: 'Ist dieser Satz richtig oder falsch?', exEs: '¿Esta frase es correcta o incorrecta?' },
            { de: 'noch einmal', es: 'otra vez', ex: 'Können Sie das noch einmal sagen?', exEs: '¿Puede decirlo otra vez?' },
            { de: 'zusammen', es: 'juntos', ex: 'Machen wir die Übung zusammen.', exEs: 'Hagamos el ejercicio juntos.' }
          ]
        },
        {
          thema: 'Fragewörter',
          items: [
            { de: 'wer?', es: '¿quién?', ex: 'Wer ist das auf dem Foto?', exEs: '¿Quién es ese de la foto?' },
            { de: 'was?', es: '¿qué?', ex: 'Was machst du am Wochenende?', exEs: '¿Qué haces el fin de semana?' },
            { de: 'wo?', es: '¿dónde?', ex: 'Wo wohnst du genau?', exEs: '¿Dónde vives exactamente?' },
            { de: 'woher?', es: '¿de dónde?', ex: 'Woher kommen Sie?', exEs: '¿De dónde es usted?' },
            { de: 'wohin?', es: '¿adónde?', ex: 'Wohin fahrt ihr im Sommer?', exEs: '¿Adónde vais en verano?' },
            { de: 'wann?', es: '¿cuándo?', ex: 'Wann fängt der Kurs an?', exEs: '¿Cuándo empieza el curso?' },
            { de: 'wie?', es: '¿cómo?', ex: 'Wie heißt du?', exEs: '¿Cómo te llamas?' },
            { de: 'warum?', es: '¿por qué?', ex: 'Warum lernst du Deutsch?', exEs: '¿Por qué aprendes alemán?' },
            { de: 'wie viel? / wie viele?', es: '¿cuánto? / ¿cuántos?', ex: 'Wie viele Sprachen sprichst du?', exEs: '¿Cuántos idiomas hablas?' },
            { de: 'welcher? welche? welches?', es: '¿cuál?', ex: 'Welche Farbe gefällt dir besser?', exEs: '¿Qué color te gusta más?' }
          ]
        },
        {
          thema: 'Erste Wörter',
          items: [
            { de: 'hier', es: 'aquí', ex: 'Hier ist noch ein Platz frei.', exEs: 'Aquí queda un sitio libre.' },
            { de: 'dort / da', es: 'allí / ahí', ex: 'Der Bahnhof ist dort hinten.', exEs: 'La estación está allí al fondo.' },
            { de: 'jetzt', es: 'ahora', ex: 'Jetzt habe ich keine Zeit.', exEs: 'Ahora no tengo tiempo.' },
            { de: 'noch', es: 'todavía', ex: 'Ich brauche noch fünf Minuten.', exEs: 'Necesito cinco minutos más.' },
            { de: 'auch', es: 'también', ex: 'Ich komme auch mit.', exEs: 'Yo también voy.' },
            { de: 'nicht', es: 'no (con un verbo)', ex: 'Heute arbeite ich nicht.', exEs: 'Hoy no trabajo.' },
            { de: 'sehr', es: 'muy', ex: 'Das Essen war sehr gut.', exEs: 'La comida estaba muy buena.' },
            { de: 'ein bisschen', es: 'un poco', ex: 'Ich spreche ein bisschen Deutsch.', exEs: 'Hablo un poco de alemán.' },
            { de: 'und / oder / aber', es: 'y / o / pero', ex: 'Ich komme gern, aber erst um acht.', exEs: 'Voy encantado, pero no antes de las ocho.' },
            { de: 'gut / schlecht', es: 'bien / mal', ex: 'Heute geht es mir nicht schlecht.', exEs: 'Hoy no estoy mal.' },
            { de: 'das ist …', es: 'esto es…', ex: 'Das ist meine Kollegin Anna.', exEs: 'Esta es Anna, mi compañera.' },
            { de: 'ich verstehe', es: 'entiendo', ex: 'Langsam bitte, ich verstehe nur die Hälfte.', exEs: 'Despacio, por favor, solo entiendo la mitad.' },
            { de: 'ich weiß nicht', es: 'no lo sé', ex: 'Ich weiß nicht, wie das Wort heißt.', exEs: 'No sé cómo se dice esa palabra.' }
          ]
        },
        {
          thema: 'Erste Verben',
          items: [
            { de: 'heißen', es: 'llamarse', ex: 'Wie heißen Sie mit Nachnamen?', exEs: '¿Cuál es su apellido?' },
            { de: 'wohnen', es: 'vivir, residir', ex: 'Ich wohne seit zwei Jahren in Wien.', exEs: 'Vivo en Viena desde hace dos años.' },
            { de: 'machen', es: 'hacer', ex: 'Was machst du beruflich?', exEs: '¿A qué te dedicas?' },
            { de: 'lernen', es: 'aprender', ex: 'Ich lerne Deutsch in der Volkshochschule.', exEs: 'Aprendo alemán en la escuela de adultos.' },
            { de: 'sprechen', es: 'hablar', ex: 'Sprechen Sie bitte langsamer.', exEs: 'Hable más despacio, por favor.' },
            { de: 'sagen', es: 'decir', ex: 'Wie sagt man das auf Deutsch?', exEs: '¿Cómo se dice esto en alemán?' },
            { de: 'fragen', es: 'preguntar', ex: 'Darf ich etwas fragen?', exEs: '¿Puedo preguntar una cosa?' },
            { de: 'antworten', es: 'contestar', ex: 'Er antwortet nie auf meine Mails.', exEs: 'Nunca contesta a mis correos.' },
            { de: 'brauchen', es: 'necesitar', ex: 'Ich brauche noch eine Unterschrift.', exEs: 'Me falta una firma.' },
            { de: 'möchten', es: 'querer, desear', ex: 'Ich möchte einen Kaffee, bitte.', exEs: 'Quería un café, por favor.' },
            { de: 'essen', es: 'comer', ex: 'Zu Mittag esse ich meistens in der Kantine.', exEs: 'Al mediodía suelo comer en el comedor.' },
            { de: 'trinken', es: 'beber', ex: 'Trinkst du Wein oder lieber Bier?', exEs: '¿Bebes vino o mejor cerveza?' },
            { de: 'sehen', es: 'ver', ex: 'Von hier sieht man den ganzen Park.', exEs: 'Desde aquí se ve todo el parque.' },
            { de: 'hören', es: 'oír, escuchar', ex: 'Im Auto höre ich immer Radio.', exEs: 'En el coche siempre escucho la radio.' },
            { de: 'schreiben', es: 'escribir', ex: 'Ich schreibe ihr gleich eine Nachricht.', exEs: 'Ahora mismo le escribo un mensaje.' },
            { de: 'arbeiten', es: 'trabajar', ex: 'Ich arbeite von acht bis vier.', exEs: 'Trabajo de ocho a cuatro.' },
            { de: 'kaufen', es: 'comprar', ex: 'Das Obst kaufen wir auf dem Markt.', exEs: 'La fruta la compramos en el mercado.' },
            { de: 'geben', es: 'dar', ex: 'Gib mir bitte das Salz.', exEs: 'Pásame la sal, por favor.' },
            { de: 'nehmen', es: 'coger, tomar', ex: 'Ich nehme die U-Bahn bis zum Ring.', exEs: 'Cojo el metro hasta el Ring.' },
            { de: 'spielen', es: 'jugar, tocar', ex: 'Am Abend spielen wir oft Karten.', exEs: 'Por la noche jugamos muchas veces a las cartas.' },
            { de: 'warten', es: 'esperar', ex: 'Ich warte schon zwanzig Minuten.', exEs: 'Llevo veinte minutos esperando.' },
            { de: 'helfen', es: 'ayudar', ex: 'Kannst du mir kurz helfen?', exEs: '¿Me echas una mano un momento?' },
            { de: 'kennen', es: 'conocer', ex: 'Kennst du ein gutes Lokal hier?', exEs: '¿Conoces algún sitio bueno por aquí?' },
            { de: 'buchstabieren', es: 'deletrear', ex: 'Können Sie Ihren Namen buchstabieren?', exEs: '¿Puede deletrear su nombre?' },
            { de: 'sein', es: 'ser, estar', ex: 'Ich bin aus Spanien.', exEs: 'Soy de España.' },
            { de: 'haben', es: 'tener', ex: 'Ich habe eine Frage.', exEs: 'Tengo una pregunta.' },
            { de: 'kommen', es: 'venir, ser de', ex: 'Ich komme aus Valencia.', exEs: 'Soy de Valencia.' },
            { de: 'gehen', es: 'ir', ex: 'Wir gehen jetzt nach Hause.', exEs: 'Ahora nos vamos a casa.' }
          ]
        },
        {
          thema: 'Erste Adjektive',
          items: [
            { de: 'neu', es: 'nuevo', ex: 'Mein Laptop ist ganz neu.', exEs: 'Mi portátil es nuevo del todo.' },
            { de: 'jung', es: 'joven', ex: 'Die Kollegen sind alle sehr jung.', exEs: 'Los compañeros son todos muy jóvenes.' },
            { de: 'schön', es: 'bonito', ex: 'Heute ist ein schöner Tag.', exEs: 'Hoy hace un día bonito.' },
            { de: 'hässlich', es: 'feo', ex: 'Das Haus ist praktisch, aber hässlich.', exEs: 'La casa es práctica, pero fea.' },
            { de: 'wichtig', es: 'importante', ex: 'Das ist mir sehr wichtig.', exEs: 'Eso para mí es muy importante.' },
            { de: 'interessant', es: 'interesante', ex: 'Der Film war wirklich interessant.', exEs: 'La película fue realmente interesante.' },
            { de: 'einfach / leicht', es: 'fácil, sencillo', ex: 'Die Übung ist ganz einfach.', exEs: 'El ejercicio es facilísimo.' },
            { de: 'schwer / schwierig', es: 'difícil, pesado', ex: 'Am schwierigsten ist die Aussprache.', exEs: 'Lo más difícil es la pronunciación.' },
            { de: 'viel / wenig', es: 'mucho / poco', ex: 'Diese Woche habe ich wenig Zeit.', exEs: 'Esta semana tengo poco tiempo.' },
            { de: 'voll', es: 'lleno', ex: 'Am Morgen ist die U-Bahn immer voll.', exEs: 'Por la mañana el metro va siempre lleno.' },
            { de: 'leer', es: 'vacío', ex: 'Der Kühlschrank ist schon wieder leer.', exEs: 'La nevera está otra vez vacía.' },
            { de: 'offen', es: 'abierto', ex: 'Die Apotheke ist bis sechs offen.', exEs: 'La farmacia está abierta hasta las seis.' },
            { de: 'geschlossen / zu', es: 'cerrado', ex: 'Am Sonntag sind die Geschäfte zu.', exEs: 'Los domingos las tiendas están cerradas.' },
            { de: 'frei', es: 'libre', ex: 'Ist dieser Platz noch frei?', exEs: '¿Está libre este sitio?' },
            { de: 'besetzt', es: 'ocupado', ex: 'Die Leitung ist dauernd besetzt.', exEs: 'La línea está comunicando todo el rato.' },
            { de: 'hungrig', es: 'hambriento', ex: 'Nach dem Sport bin ich immer hungrig.', exEs: 'Después de hacer deporte siempre tengo hambre.' },
            { de: 'durstig', es: 'sediento', ex: 'Bei der Hitze bin ich dauernd durstig.', exEs: 'Con este calor tengo sed a todas horas.' },
            { de: 'nett', es: 'simpático, amable', ex: 'Die Nachbarn sind sehr nett.', exEs: 'Los vecinos son muy simpáticos.' },
            { de: 'fertig', es: 'listo, terminado', ex: 'In fünf Minuten bin ich fertig.', exEs: 'En cinco minutos estoy listo.' },
            { de: 'sauber', es: 'limpio', ex: 'Die Wohnung ist klein, aber sauber.', exEs: 'El piso es pequeño, pero está limpio.' },
            { de: 'schmutzig', es: 'sucio', ex: 'Meine Schuhe sind ganz schmutzig.', exEs: 'Tengo los zapatos llenos de barro.' },
            { de: 'leise', es: 'silencioso, bajo', ex: 'Sprich bitte leiser, das Kind schläft.', exEs: 'Habla más bajo, que el niño duerme.' },
            { de: 'weit / nah', es: 'lejos / cerca', ex: 'Zur Arbeit ist es nicht weit.', exEs: 'Al trabajo no queda lejos.' },
            { de: 'alt', es: 'viejo, mayor; de edad', ex: 'Mein Bruder ist zwanzig Jahre alt.', exEs: 'Mi hermano tiene veinte años.' },
            { de: 'groß', es: 'grande, alto', ex: 'Die Wohnung ist nicht sehr groß.', exEs: 'El piso no es muy grande.' },
            { de: 'klein', es: 'pequeño, bajo', ex: 'Mein Zimmer ist ziemlich klein.', exEs: 'Mi habitación es bastante pequeña.' },
            { de: 'schnell / langsam', es: 'rápido / lento', ex: 'Sprechen Sie bitte langsam.', exEs: 'Hable despacio, por favor.' }
          ]
        },
        {
          thema: 'Das Alphabet',
          items: [
            { de: 'das Alphabet', es: 'el alfabeto', ex: 'Am Anfang lernt man das Alphabet.', exEs: 'Al principio se aprende el alfabeto.' },
            { de: 'a, be, ce, de, e, ef, ge', es: 'a, b, c, d, e, f, g', ex: 'Beim Buchstabieren sagt man a, be, ce, de.', exEs: 'Al deletrear se dice a, be, ce, de.' },
            { de: 'ha, i, jot, ka, el, em, en', es: 'h, i, j, k, l, m, n', ex: 'Jot wie Julia, ka wie Kaufmann.', exEs: 'Jota como Julia, ka como Kaufmann.' },
            { de: 'o, pe, ku, er, es, te, u', es: 'o, p, q, r, s, t, u', ex: 'Ku wie Quelle – dieser Buchstabe ist selten.', exEs: 'Ku como Quelle: esa letra es rara.' },
            { de: 'vau, we, iks, ypsilon, zett', es: 'v, w, x, y, z', ex: 'Zett wie Zebra, ganz am Ende.', exEs: 'Zeta como cebra, al final del todo.' },
            { de: 'ä, ö, ü (Umlaut)', es: 'a, o, u con diéresis', ex: 'Über dem a stehen zwei Punkte: das ist ein Umlaut.', exEs: 'Encima de la a hay dos puntos: eso es una diéresis.' },
            { de: 'ß (Eszett, scharfes S)', es: 'la ese doble alemana', ex: 'Straße schreibt man mit ß, in der Schweiz mit ss.', exEs: 'Straße se escribe con ß; en Suiza, con ss.' },
            { de: 'der Buchstabe', es: 'la letra', ex: 'Der letzte Buchstabe ist ein e.', exEs: 'La última letra es una e.' },
            { de: 'das Wort', es: 'la palabra', ex: 'Dieses Wort kenne ich noch nicht.', exEs: 'Esta palabra todavía no la conozco.' }
          ]
        },
        {
          thema: 'Im Kurs',
          items: [
            { de: 'der Deutschkurs', es: 'el curso de alemán', ex: 'Mein Deutschkurs ist dienstags und donnerstags.', exEs: 'Mi curso de alemán es los martes y los jueves.' },
            { de: 'der Kugelschreiber (der Kuli)', es: 'el bolígrafo', ex: 'Hast du einen Kugelschreiber für mich?', exEs: '¿Tienes un boli que me dejes?' },
            { de: 'die Tafel', es: 'la pizarra', ex: 'Die Lehrerin schreibt das Wort an die Tafel.', exEs: 'La profesora escribe la palabra en la pizarra.' },
            { de: 'die Tür', es: 'la puerta', ex: 'Mach bitte die Tür zu.', exEs: 'Cierra la puerta, por favor.' },
            { de: 'das Fenster', es: 'la ventana', ex: 'Darf ich das Fenster aufmachen?', exEs: '¿Puedo abrir la ventana?' },
            { de: 'die Übung', es: 'el ejercicio', ex: 'Die Übung auf Seite acht ist Hausaufgabe.', exEs: 'El ejercicio de la página ocho es para casa.' },
            { de: 'die Frage', es: 'la pregunta', ex: 'Ich habe noch eine Frage.', exEs: 'Tengo una pregunta más.' },
            { de: 'die Antwort', es: 'la respuesta', ex: 'Deine Antwort war richtig.', exEs: 'Tu respuesta era correcta.' }
          ]
        },
        {
          thema: 'Höflichkeit',
          items: [
            { de: 'danke / danke schön', es: 'gracias / muchas gracias', ex: 'Danke schön für die Hilfe!', exEs: '¡Muchas gracias por la ayuda!' },
            { de: 'bitte schön', es: 'de nada', ex: 'Danke! – Bitte schön!', exEs: '¡Gracias! – ¡De nada!' },
            { de: 'Entschuldigung!', es: '¡perdón!, ¡disculpe!', ex: 'Entschuldigung, ist der Platz frei?', exEs: 'Perdone, ¿está libre este sitio?' },
            { de: 'Es tut mir leid.', es: 'lo siento.', ex: 'Es tut mir leid, ich habe es vergessen.', exEs: 'Lo siento, se me ha olvidado.' },
            { de: 'ja / nein', es: 'sí / no', ex: 'Kommst du mit? – Ja, gern.', exEs: '¿Te vienes? – Sí, encantado.' },
            { de: 'vielleicht', es: 'quizá', ex: 'Vielleicht komme ich später noch.', exEs: 'A lo mejor me paso luego.' },
            { de: 'gern', es: 'con gusto', ex: 'Sehr gern, das mache ich.', exEs: 'Con mucho gusto, lo hago yo.' },
            { de: 'Vielen Dank!', es: '¡muchas gracias!', ex: 'Vielen Dank für Ihre Mail!', exEs: '¡Muchas gracias por su correo!' },
            { de: 'Gern geschehen.', es: 'de nada, un placer', ex: 'Kein Problem, gern geschehen.', exEs: 'No hay problema, un placer.' },
            { de: 'Keine Ursache.', es: 'de nada', ex: 'Keine Ursache, das war nichts.', exEs: 'De nada, no ha sido nada.' },
            { de: 'Nichts zu danken.', es: 'no hay de qué', ex: 'Nichts zu danken, das mache ich gern.', exEs: 'No hay de qué, lo hago encantado.' },
            { de: 'Verzeihung!', es: '¡perdón! (más formal)', ex: 'Verzeihung, darf ich kurz vorbei?', exEs: 'Perdón, ¿me deja pasar un momento?' },
            { de: 'Entschuldigen Sie bitte!', es: '¡disculpe, por favor!', ex: 'Entschuldigen Sie bitte, wo ist der Ausgang?', exEs: 'Disculpe, por favor, ¿dónde está la salida?' },
            { de: 'Macht nichts.', es: 'no importa', ex: 'Macht nichts, das kann passieren.', exEs: 'No importa, son cosas que pasan.' },
            { de: 'Schon gut.', es: 'no pasa nada', ex: 'Schon gut, ich bin nicht böse.', exEs: 'No pasa nada, no me he enfadado.' },
            { de: 'natürlich', es: 'claro, naturalmente', ex: 'Natürlich helfe ich dir.', exEs: 'Claro que te ayudo.' },
            { de: 'selbstverständlich', es: 'por supuesto', ex: 'Selbstverständlich, kein Problem.', exEs: 'Por supuesto, ningún problema.' },
            { de: 'einverstanden', es: 'de acuerdo', ex: 'Einverstanden, machen wir es so.', exEs: 'De acuerdo, lo hacemos así.' },
            { de: 'in Ordnung', es: 'vale, correcto', ex: 'Freitag um sechs? In Ordnung.', exEs: '¿El viernes a las seis? Vale.' },
            { de: 'leider', es: 'por desgracia', ex: 'Leider kann ich am Samstag nicht.', exEs: 'Por desgracia el sábado no puedo.' },
            { de: 'Schade!', es: '¡qué pena!', ex: 'Schade, dann ein andermal!', exEs: '¡Qué pena, pues otro día!' },
            { de: 'Darf ich?', es: '¿puedo?, ¿me permite?', ex: 'Darf ich? Ich möchte nur kurz durch.', exEs: '¿Me permite? Solo quiero pasar.' },
            { de: 'Nach Ihnen.', es: 'usted primero', ex: 'Bitte, nach Ihnen.', exEs: 'Por favor, usted primero.' },
            { de: 'Herzlichen Glückwunsch!', es: '¡felicidades!', ex: 'Herzlichen Glückwunsch zum Geburtstag!', exEs: '¡Feliz cumpleaños!' },
            { de: 'Viel Glück!', es: '¡suerte!', ex: 'Viel Glück bei der Prüfung!', exEs: '¡Suerte en el examen!' },
            { de: 'Schönen Tag noch!', es: '¡que tengas buen día!', ex: 'Danke, und schönen Tag noch!', exEs: 'Gracias, ¡y que tenga buen día!' },
            { de: 'Bis später!', es: '¡hasta luego!', ex: 'Bis später, wir sehen uns um acht!', exEs: '¡Hasta luego, nos vemos a las ocho!' }
          ]
        },
        {
          thema: 'Zahlen',
          items: [
            { de: 'null', es: 'cero', ex: 'Das Spiel endet null zu null.', exEs: 'El partido acaba cero a cero.' },
            { de: 'eins', es: 'uno', ex: 'Es ist jetzt eins.', exEs: 'Ahora es la una.' },
            { de: 'zwei', es: 'dos', ex: 'Ich habe zwei Schwestern.', exEs: 'Tengo dos hermanas.' },
            { de: 'drei', es: 'tres', ex: 'Der Kurs dauert drei Monate.', exEs: 'El curso dura tres meses.' },
            { de: 'vier', es: 'cuatro', ex: 'Wir sind vier Personen.', exEs: 'Somos cuatro personas.' },
            { de: 'fünf', es: 'cinco', ex: 'Der Bus kommt in fünf Minuten.', exEs: 'El autobús llega en cinco minutos.' },
            { de: 'sechs', es: 'seis', ex: 'Ich stehe um sechs Uhr auf.', exEs: 'Me levanto a las seis.' },
            { de: 'sieben', es: 'siete', ex: 'Die Woche hat sieben Tage.', exEs: 'La semana tiene siete días.' },
            { de: 'acht', es: 'ocho', ex: 'Der Kurs beginnt um acht.', exEs: 'El curso empieza a las ocho.' },
            { de: 'neun', es: 'nueve', ex: 'Ich arbeite bis neun Uhr.', exEs: 'Trabajo hasta las nueve.' },
            { de: 'zehn', es: 'diez', ex: 'Gib mir bitte zehn Minuten.', exEs: 'Dame diez minutos, por favor.' },
            { de: 'elf', es: 'once', ex: 'Das Kind ist elf Jahre alt.', exEs: 'El niño tiene once años.' },
            { de: 'zwölf', es: 'doce', ex: 'Das Jahr hat zwölf Monate.', exEs: 'El año tiene doce meses.' }
          ]
        }
      ],
      grammatik: [
        {
          key: 'grossschreibung',
          regel: 'Großschreibung der Nomen',
          erklaerung: 'En alemán TODOS los sustantivos van en mayúscula, estén donde estén en la frase: der Tisch, das Buch, die Zeit. Los verbos y los adjetivos, en minúscula.',
          beispiele: [
            { de: 'Der Hund schläft im Garten.', es: 'El perro duerme en el jardín.' },
            { de: 'Ich lerne Deutsch in Wien.', es: 'Estudio alemán en Viena.' },
            { de: 'Das Buch ist sehr interessant.', es: 'El libro es muy interesante.' }
          ]
        },
        {
          key: 'du-oder-sie',
          regel: 'du oder Sie',
          erklaerung: '"du" con amigos, familia, niños y entre compañeros que se tutean. "Sie" con desconocidos, en oficinas y en el trabajo mientras no te ofrezcan lo contrario. "Sie" se escribe SIEMPRE con mayúscula; así se distingue de "sie" = ella / ellos.',
          beispiele: [
            { de: 'Wie heißen Sie, bitte?', es: '¿Cómo se llama usted, por favor?' },
            { de: 'Woher kommst du?', es: '¿De dónde eres?' },
            { de: 'Wo wohnt ihr?', es: '¿Dónde vivís? (a varios conocidos)' }
          ]
        },
        {
          key: 'zahlen-rueckwaerts',
          regel: 'Zahlen: einundzwanzig',
          erklaerung: 'A partir del 21 los números se dicen al revés: primero la unidad, luego "und" y luego la decena. 21 = einundzwanzig, uno-y-veinte. Todo junto, en una sola palabra.',
          beispiele: [
            { de: 'Ich bin einunddreißig Jahre alt.', es: 'Tengo treinta y un años.' },
            { de: 'Das kostet zweiundzwanzig Euro.', es: 'Eso cuesta veintidós euros.' },
            { de: 'Meine Nummer ist vierundsechzig.', es: 'Mi número es el sesenta y cuatro.' }
          ]
        },
        {
          key: 'ei-oder-ie',
          regel: 'ei und ie',
          erklaerung: '"ei" se lee AI (Wein = «vain») y "ie" se lee I larga (Bier = «bir»). Es al revés de lo que parece, y es el fallo de ortografía más común al empezar: Wien es la ciudad, Wein es el vino.',
          beispiele: [
            { de: 'Mein Freund wohnt in Wien.', es: 'Mi amigo vive en Viena.' },
            { de: 'Ich trinke gern Bier.', es: 'Me gusta la cerveza.' },
            { de: 'Wie heißen Sie?', es: '¿Cómo se llama usted?' }
          ]
        },
        {
          key: 'artikel-drei',
          regel: 'der, die, das – und die im Plural',
          erklaerung: 'Tres géneros, y no coinciden con el español: der Tisch (la mesa), das Auto (el coche), die Milch (la leche). El género no se deduce casi nunca, así que la palabra se aprende con su artículo pegado. La buena noticia: en plural siempre es "die", venga del género que venga.',
          beispiele: [
            { de: 'der Tisch, die Tür, das Buch', es: 'la mesa, la puerta, el libro' },
            { de: 'das Kind → die Kinder', es: 'el niño → los niños' },
            { de: 'Die Häuser sind alt.', es: 'Las casas son viejas.' }
          ]
        },
        {
          key: 'verb-endungen',
          regel: 'Verben: Infinitiv und Endungen',
          erklaerung: 'El infinitivo acaba en -en (wohnen) y es lo que ves en el diccionario. Le quitas el -en y te queda la raíz (wohn-), y a la raíz le pegas la terminación: ich -e, du -st, er/sie/es -t, wir -en, ihr -t, sie/Sie -en. Y algo que en español no pasa: el pronombre no se puede quitar. "Vivo en Viena" es "ICH wohne in Wien".',
          beispiele: [
            { de: 'ich wohne – du wohnst – er wohnt', es: 'vivo – vives – vive' },
            { de: 'wir lernen – ihr lernt – sie lernen', es: 'aprendemos – aprendéis – aprenden' },
            { de: 'Ich komme aus Spanien.', es: 'Soy de España.' }
          ]
        },
        {
          key: 'adjektiv-nach-sein',
          regel: 'Adjektive nach sein: ohne Endung',
          erklaerung: 'Detrás de sein, werden y bleiben el adjetivo no cambia NUNCA: ni por el género ni por el número. Das Auto ist neu, die Wohnung ist neu, die Häuser sind neu. En español dirías nuevo / nueva / nuevos; aquí siempre la misma forma, la del diccionario. Solo cuando el adjetivo va delante del sustantivo aparecen terminaciones, y eso llega mucho más adelante.',
          beispiele: [
            { de: 'Das Auto ist neu.', es: 'El coche es nuevo.' },
            { de: 'Die Wohnung ist klein, aber schön.', es: 'El piso es pequeño, pero bonito.' },
            { de: 'Die Kinder sind müde.', es: 'Los niños están cansados.' }
          ]
        },
        {
          key: 'satzarten',
          regel: 'Wortstellung: Aussage, W-Frage, Ja-/Nein-Frage',
          erklaerung: 'Tres moldes y ya tienes casi todas las frases del principio. Afirmación: el verbo va en SEGUNDA posición (Ich wohne in Wien / Heute wohne ich hier). Pregunta con W: la palabra interrogativa ocupa el primer sitio y el verbo sigue siendo el segundo (Wo wohnst du?). Pregunta de sí o no: el verbo abre la frase (Wohnst du hier?). El sujeto va siempre pegado al verbo.',
          beispiele: [
            { de: 'Ich wohne in Wien.', es: 'Vivo en Viena.' },
            { de: 'Woher kommst du?', es: '¿De dónde eres?' },
            { de: 'Sprechen Sie Deutsch?', es: '¿Habla usted alemán?' }
          ]
        },
        {
          key: 'wortakzent',
          regel: 'Aussprache: der Wortakzent',
          erklaerung: 'El acento cae casi siempre en la PRIMERA sílaba: ARbeiten, LEHrerin, FRAge. En español solemos tirar a la penúltima, y ese es el acento que delata a un hispanohablante. Tres excepciones: las palabras de fuera (StuDENT, ComPUter, RestauRANT), los prefijos átonos be-, ver-, er-, ent-, ge- (verSTEhen, beZAHlen) y los verbos separables, que acentúan el prefijo (AUFstehen).',
          beispiele: [
            { de: 'ARbeiten, LEHrerin, DEUTSCHkurs', es: 'trabajar, profesora, curso de alemán' },
            { de: 'Ich verSTEhe das nicht.', es: 'No lo entiendo. (prefijo átono)' },
            { de: 'Ich STEhe um sieben AUF.', es: 'Me levanto a las siete. (separable: manda el prefijo)' }
          ]
        },
        {
          key: 'vokal-laenge',
          regel: 'Lange und kurze Vokale',
          erklaerung: 'Al leer se ve: vocal doble (Boot, Tee) o vocal + h (Uhr, gehen) = larga. Vocal + una sola consonante (Name, gut) = larga también. Vocal + dos o más consonantes (kommen, Mutter, Stadt) = corta y seca. Y no es un detalle: Stadt (ciudad) y Staat (Estado) solo se distinguen por eso, igual que Ofen (horno) y offen (abierto).',
          beispiele: [
            { de: 'Boot, Tee, Uhr, Name', es: 'barco, té, reloj, nombre (largas)' },
            { de: 'Mutter, kommen, Stadt', es: 'madre, venir, ciudad (cortas)' },
            { de: 'der Ofen / das Fenster ist offen', es: 'el horno / la ventana está abierta' }
          ]
        },
        {
          key: 'auslaut-b-d-g',
          regel: 'Aussprache: b, d, g am Wortende',
          erklaerung: 'Al final de palabra o de sílaba, b, d y g se endurecen: b suena p, d suena t, g suena k. Hund se dice «hunt», Tag «tak», halb «halp». En cuanto la letra deja de estar al final vuelve a sonar como toca: die Hunde, die Tage, gelbe Blumen. Ese es el truco para saber cómo se escribe algo que has oído: ponlo en plural.',
          beispiele: [
            { de: 'der Hund → die Hunde', es: 'el perro → los perros («hunt», «hunde»)' },
            { de: 'der Tag → die Tage', es: 'el día → los días («tak», «tague»)' },
            { de: 'Das Kind ist hier.', es: 'El niño está aquí. («kint»)' }
          ]
        },
        {
          key: 'satzmelodie',
          regel: 'Satzmelodie: rauf oder runter?',
          erklaerung: 'La afirmación baja al final (Ich wohne in Wien ↘). La pregunta de sí o no sube (Wohnst du in Wien? ↗) — y como al hablar no hay signo de interrogación, esa subida es lo único que la marca. Lo que sorprende viniendo del español: la pregunta con W BAJA (Woher kommst du? ↘). Por eso el alemán suena más tajante de lo que es.',
          beispiele: [
            { de: 'Ich wohne in Wien. ↘', es: 'Vivo en Viena. (baja)' },
            { de: 'Haben Sie Zeit? ↗', es: '¿Tiene tiempo? (sube)' },
            { de: 'Woher kommst du? ↘', es: '¿De dónde eres? (baja)' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'begrüßen',
          es: 'Saludar',
          wendungen: [
            { de: 'Guten Morgen! / Guten Tag! / Guten Abend!', es: '¡Buenos días! / ¡Buenas tardes! / ¡Buenas noches!' }
          ]
        },
        {
          funktion: 'sich verabschieden',
          es: 'Despedirse',
          wendungen: [
            { de: 'Auf Wiedersehen! · Tschüss! · Bis bald!', es: '¡Adiós! · ¡Chao! · ¡Hasta pronto!' }
          ]
        },
        {
          funktion: 'nach dem Namen fragen',
          es: 'Preguntar el nombre',
          wendungen: [
            { de: 'Wie heißen Sie? – Mein Name ist Gruber.', es: '¿Cómo se llama usted? – Me llamo Gruber.' }
          ]
        },
        {
          funktion: 'sich vorstellen',
          es: 'Presentarse',
          wendungen: [
            { de: 'Ich bin neu im Kurs, ich heiße Nuria.', es: 'Soy nueva en el curso, me llamo Nuria.' }
          ]
        },
        {
          funktion: 'nach dem Befinden fragen',
          es: 'Preguntar qué tal está alguien',
          wendungen: [
            { de: 'Wie geht\'s? – Danke, gut. Und dir?', es: '¿Qué tal? – Bien, gracias. ¿Y tú?' }
          ]
        },
        {
          funktion: 'über die Herkunft sprechen',
          es: 'Hablar de dónde eres',
          wendungen: [
            { de: 'Woher kommst du? – Ich komme aus Spanien.', es: '¿De dónde eres? – Soy de España.' }
          ]
        },
        {
          funktion: 'Telefonnummer und Adresse angeben',
          es: 'Dar el teléfono y la dirección',
          wendungen: [
            { de: 'Wie ist deine Telefonnummer? – 0664 123 45 67.', es: '¿Cuál es tu teléfono? – 0664 123 45 67.' }
          ]
        },
        {
          funktion: 'buchstabieren',
          es: 'Deletrear',
          wendungen: [
            { de: 'Wie schreibt man das?', es: '¿Cómo se escribe eso?' }
          ]
        },
        {
          funktion: 'sich im Kurs verständigen',
          es: 'Entenderse en clase',
          wendungen: [
            { de: 'Wie bitte? Können Sie das wiederholen?', es: '¿Cómo dice? ¿Puede repetirlo?' }
          ]
        },
        {
          funktion: 'Fragen an die Lehrerin',
          es: 'Preguntar a la profesora',
          wendungen: [
            { de: 'Entschuldigung, ich habe eine Frage.', es: 'Perdone, tengo una pregunta.' }
          ]
        },
        {
          funktion: 'im Kursraum um Erlaubnis bitten',
          es: 'Pedir permiso en el aula',
          wendungen: [
            { de: 'Darf ich auf die Toilette gehen?', es: '¿Puedo ir al baño?' }
          ]
        },
        {
          funktion: 'sich bedanken und entschuldigen',
          es: 'Agradecer y disculparse',
          wendungen: [
            { de: 'Danke schön! – Bitte schön!', es: '¡Muchas gracias! – ¡De nada!' }
          ]
        }
      ]
    },

    {
      id: 'a11-l1',
      nr: 1,
      name: 'Woher kommen Sie?',
      woerter: [
        {
          thema: 'Kontinente',
          items: [
            { de: 'Europa', es: 'Europa', ex: 'Spanien und Österreich liegen beide in Europa.', exEs: 'España y Austria están las dos en Europa.' },
            { de: 'Afrika', es: 'África', ex: 'Marokko liegt im Norden von Afrika.', exEs: 'Marruecos está en el norte de África.' },
            { de: 'Asien', es: 'Asia', ex: 'Die Türkei liegt zum Teil in Asien.', exEs: 'Turquía está en parte en Asia.' },
            { de: 'Nordamerika', es: 'América del Norte', ex: 'Kanada gehört zu Nordamerika.', exEs: 'Canadá está en América del Norte.' },
            { de: 'Südamerika', es: 'América del Sur', ex: 'Brasilien ist das größte Land in Südamerika.', exEs: 'Brasil es el país más grande de Sudamérica.' },
            { de: 'Australien', es: 'Australia', ex: 'Nach Australien fliegt man über zwanzig Stunden.', exEs: 'A Australia se vuela más de veinte horas.' },
            { de: 'die Antarktis', es: 'la Antártida', ex: 'In der Antarktis wohnen nur Forscher.', exEs: 'En la Antártida solo viven investigadores.' }
          ]
        },
        {
          thema: 'Länder',
          items: [
            { de: 'Österreich', es: 'Austria', ex: 'Ich lebe seit drei Jahren in Österreich.', exEs: 'Vivo en Austria desde hace tres años.' },
            { de: 'Deutschland', es: 'Alemania', ex: 'In Deutschland habe ich viele Freunde.', exEs: 'En Alemania tengo muchos amigos.' },
            { de: 'die Schweiz', es: 'Suiza', ex: 'In der Schweiz spricht man vier Sprachen.', exEs: 'En Suiza se hablan cuatro idiomas.' },
            { de: 'Spanien', es: 'España', ex: 'Meine Familie kommt aus Spanien.', exEs: 'Mi familia es de España.' },
            { de: 'Italien', es: 'Italia', ex: 'Im Sommer fahren wir nach Italien.', exEs: 'En verano vamos a Italia.' },
            { de: 'Frankreich', es: 'Francia', ex: 'Frankreich ist das Nachbarland von Spanien.', exEs: 'Francia es el país vecino de España.' },
            { de: 'Polen', es: 'Polonia', ex: 'Meine Kollegin kommt aus Polen.', exEs: 'Mi compañera es de Polonia.' },
            { de: 'Ungarn', es: 'Hungría', ex: 'Ungarn ist nur eine Stunde von Wien entfernt.', exEs: 'Hungría está a solo una hora de Viena.' },
            { de: 'die Türkei', es: 'Turquía', ex: 'In der Türkei war ich noch nie.', exEs: 'En Turquía no he estado nunca.' },
            { de: 'Syrien', es: 'Siria', ex: 'Er ist vor zehn Jahren aus Syrien gekommen.', exEs: 'Vino de Siria hace diez años.' },
            { de: 'Kroatien', es: 'Croacia', ex: 'Viele Wiener machen in Kroatien Urlaub.', exEs: 'Muchos vieneses veranean en Croacia.' },
            { de: 'Vietnam', es: 'Vietnam', ex: 'Meine Nachbarn kommen aus Vietnam.', exEs: 'Mis vecinos son de Vietnam.' },
            { de: 'Griechenland', es: 'Grecia', ex: 'In Griechenland ist das Meer warm.', exEs: 'En Grecia el mar está caliente.' },
            { de: 'Portugal', es: 'Portugal', ex: 'Portugal liegt westlich von Spanien.', exEs: 'Portugal está al oeste de España.' },
            { de: 'Rumänien', es: 'Rumanía', ex: 'Ein Kollege von mir kommt aus Rumänien.', exEs: 'Un compañero mío es de Rumanía.' },
            { de: 'Serbien', es: 'Serbia', ex: 'In Wien leben viele Menschen aus Serbien.', exEs: 'En Viena vive mucha gente de Serbia.' },
            { de: 'die Slowakei', es: 'Eslovaquia', ex: 'Bratislava in der Slowakei ist ganz nah.', exEs: 'Bratislava, en Eslovaquia, está muy cerca.' },
            { de: 'Tschechien', es: 'Chequia', ex: 'Nach Tschechien fährt man mit dem Zug vier Stunden.', exEs: 'A Chequia se tarda cuatro horas en tren.' },
            { de: 'Slowenien', es: 'Eslovenia', ex: 'Slowenien ist klein, aber sehr grün.', exEs: 'Eslovenia es pequeña, pero muy verde.' },
            { de: 'Bosnien', es: 'Bosnia', ex: 'Meine Friseurin kommt aus Bosnien.', exEs: 'Mi peluquera es de Bosnia.' },
            { de: 'Russland', es: 'Rusia', ex: 'Russland ist das größte Land der Welt.', exEs: 'Rusia es el país más grande del mundo.' },
            { de: 'die Ukraine', es: 'Ucrania', ex: 'Aus der Ukraine sind viele Familien hier.', exEs: 'Aquí hay muchas familias de Ucrania.' },
            { de: 'Marokko', es: 'Marruecos', ex: 'In Marokko trinkt man viel Tee.', exEs: 'En Marruecos se bebe mucho té.' },
            { de: 'Ägypten', es: 'Egipto', ex: 'In Ägypten habe ich die Pyramiden gesehen.', exEs: 'En Egipto vi las pirámides.' },
            { de: 'Nigeria', es: 'Nigeria', ex: 'Nigeria hat die meisten Einwohner in Afrika.', exEs: 'Nigeria es el país con más habitantes de África.' },
            { de: 'China', es: 'China', ex: 'China ist sehr weit weg.', exEs: 'China está muy lejos.' },
            { de: 'Indien', es: 'India', ex: 'Das Essen aus Indien ist mir zu scharf.', exEs: 'La comida de la India es demasiado picante para mí.' },
            { de: 'Japan', es: 'Japón', ex: 'Nach Japan möchte ich einmal reisen.', exEs: 'A Japón me gustaría ir algún día.' },
            { de: 'Brasilien', es: 'Brasil', ex: 'In Brasilien spricht man Portugiesisch.', exEs: 'En Brasil se habla portugués.' },
            { de: 'Mexiko', es: 'México', ex: 'Mexiko kenne ich nur aus Filmen.', exEs: 'México solo lo conozco por las películas.' },
            { de: 'Argentinien', es: 'Argentina', ex: 'Meine Cousine lebt in Argentinien.', exEs: 'Mi prima vive en Argentina.' },
            { de: 'die USA (Plural)', es: 'Estados Unidos', ex: 'Die USA sind sehr groß.', exEs: 'Estados Unidos es muy grande.' }
          ]
        },
        {
          thema: 'Herkunft und Sprachen',
          items: [
            { de: 'die Heimat', es: 'la tierra de uno', ex: 'Spanien ist meine Heimat.', exEs: 'España es mi tierra.' },
            { de: 'die Muttersprache', es: 'la lengua materna', ex: 'Meine Muttersprache ist Spanisch.', exEs: 'Mi lengua materna es el español.' },
            { de: 'der Ausländer / die Ausländerin', es: 'el extranjero / la extranjera', ex: 'Als Ausländer braucht man viel Geduld.', exEs: 'De extranjero hace falta mucha paciencia.' },
            { de: 'die Hauptstadt', es: 'la capital', ex: 'Wien ist die Hauptstadt von Österreich.', exEs: 'Viena es la capital de Austria.' },
            { de: 'das Nachbarland', es: 'el país vecino', ex: 'Ungarn ist ein Nachbarland von Österreich.', exEs: 'Hungría es un país vecino de Austria.' },
            { de: 'im Ausland leben', es: 'vivir en el extranjero', ex: 'Seit drei Jahren lebe ich im Ausland.', exEs: 'Llevo tres años viviendo en el extranjero.' }
          ]
        },
        {
          thema: 'Sich vorstellen',
          items: [
            { de: 'sich vorstellen', es: 'presentarse', ex: 'Darf ich mich kurz vorstellen?', exEs: '¿Me presento un momento?' },
            { de: 'der Vorname / der Nachname', es: 'el nombre / el apellido', ex: 'Mein Vorname ist Álvaro, mein Nachname García.', exEs: 'Mi nombre es Álvaro y mi apellido García.' },
            { de: 'kennenlernen', es: 'conocer a alguien', ex: 'Ich möchte gern neue Leute kennenlernen.', exEs: 'Me gustaría conocer gente nueva.' },
            { de: 'Freut mich!', es: '¡Encantado!', ex: 'Freut mich, ich heiße Anna.', exEs: 'Encantada, me llamo Anna.' },
            { de: 'wohnen seit', es: 'vivir desde hace', ex: 'Ich wohne seit zwei Jahren in Wien.', exEs: 'Vivo en Viena desde hace dos años.' },
            { de: 'Deutsch lernen', es: 'aprender alemán', ex: 'Ich lerne Deutsch, weil ich hier arbeite.', exEs: 'Aprendo alemán porque trabajo aquí.' },
            { de: 'leben', es: 'vivir', ex: 'Ich lebe seit einem Jahr in Wien.', exEs: 'Vivo en Viena desde hace un año.' },
            { de: 'geboren sein', es: 'haber nacido', ex: 'Ich bin in Valencia geboren.', exEs: 'Nací en Valencia.' },
            { de: 'bleiben', es: 'quedarse', ex: 'Ich möchte noch ein Jahr hier bleiben.', exEs: 'Quiero quedarme aquí un año más.' },
            { de: 'besuchen', es: 'visitar', ex: 'Im Sommer besuche ich meine Familie.', exEs: 'En verano visito a mi familia.' }
          ]
        },
        {
          thema: 'Sprache & Herkunft',
          items: [
            { de: 'die Sprache', es: 'el idioma', ex: 'Welche Sprache sprichst du zu Hause?', exEs: '¿Qué idioma hablas en casa?' },
            { de: 'die Fremdsprache', es: 'la lengua extranjera', ex: 'Deutsch ist meine zweite Fremdsprache.', exEs: 'El alemán es mi segunda lengua extranjera.' },
            { de: 'der Dialekt', es: 'el dialecto', ex: 'In Wien spricht man einen Dialekt.', exEs: 'En Viena se habla un dialecto.' },
            { de: 'der Kontinent', es: 'el continente', ex: 'Asien ist der größte Kontinent.', exEs: 'Asia es el continente más grande.' },
            { de: 'die Grenze', es: 'la frontera', ex: 'Die Grenze zu Ungarn ist nicht weit.', exEs: 'La frontera con Hungría no está lejos.' },
            { de: 'das Bundesland', es: 'el estado federado', ex: 'Österreich hat neun Bundesländer.', exEs: 'Austria tiene nueve estados federados.' },
            { de: 'der Nachbar / die Nachbarin', es: 'el vecino / la vecina', ex: 'Mein Nachbar kommt aus Serbien, meine Nachbarin aus Polen.', exEs: 'Mi vecino es de Serbia y mi vecina de Polonia.' },
            { de: 'der Norden / der Süden', es: 'el norte / el sur', ex: 'Hamburg liegt im Norden, München im Süden.', exEs: 'Hamburgo está en el norte y Múnich en el sur.' },
            { de: 'der Osten / der Westen', es: 'el este / el oeste', ex: 'Wien liegt im Osten, Vorarlberg im Westen.', exEs: 'Viena está en el este y Vorarlberg en el oeste.' },
            { de: 'die Region', es: 'la región', ex: 'Andalusien ist eine Region in Spanien.', exEs: 'Andalucía es una región de España.' },
            { de: 'fremd', es: 'ajeno, desconocido', ex: 'Am Anfang war mir alles fremd.', exEs: 'Al principio todo me resultaba ajeno.' },
            { de: 'typisch', es: 'típico', ex: 'Was ist typisch für dein Land?', exEs: '¿Qué es típico de tu país?' },
            { de: 'ähnlich', es: 'parecido', ex: 'Spanisch und Italienisch sind ziemlich ähnlich.', exEs: 'El español y el italiano se parecen bastante.' }
          ]
        },
        {
          thema: 'Herkunft & Ankommen',
          items: [
            { de: 'die Staatsbürgerschaft', es: 'la ciudadanía', ex: 'Die Staatsbürgerschaft habe ich seit zwei Jahren.', exEs: 'Tengo la ciudadanía desde hace dos años.' },
            { de: 'der Akzent', es: 'el acento', ex: 'Man hört meinen Akzent sofort.', exEs: 'Se nota mi acento enseguida.' },
            { de: 'das Ausland', es: 'el extranjero', ex: 'Mein Bruder studiert im Ausland.', exEs: 'Mi hermano estudia en el extranjero.' },
            { de: 'der Einwanderer', es: 'el inmigrante', ex: 'Wien hat viele Einwanderer aus dem Osten.', exEs: 'Viena tiene muchos inmigrantes del este.' },
            { de: 'die Kultur', es: 'la cultura', ex: 'Die Kultur hier ist mir inzwischen vertraut.', exEs: 'La cultura de aquí ya me resulta familiar.' },
            { de: 'die Sitte', es: 'la costumbre', ex: 'Diese Sitte kenne ich aus Spanien nicht.', exEs: 'Esta costumbre no la conozco de España.' },
            { de: 'das Dorf', es: 'el pueblo', ex: 'Ich komme aus einem kleinen Dorf.', exEs: 'Vengo de un pueblo pequeño.' },
            { de: 'die Großstadt', es: 'la gran ciudad', ex: 'In der Großstadt ist alles anonymer.', exEs: 'En la gran ciudad todo es más anónimo.' },
            { de: 'die Gegend', es: 'la zona', ex: 'Die Gegend hier gefällt mir sehr.', exEs: 'Esta zona me gusta mucho.' },
            { de: 'die Landessprache', es: 'la lengua del país', ex: 'Die Landessprache ist hier Deutsch.', exEs: 'Aquí la lengua del país es el alemán.' },
            { de: 'zweisprachig', es: 'bilingüe', ex: 'Meine Kinder wachsen zweisprachig auf.', exEs: 'Mis hijos crecen bilingües.' },
            { de: 'der Flüchtling', es: 'el refugiado', ex: 'Er kam als Flüchtling nach Wien.', exEs: 'Vino a Viena como refugiado.' },
            { de: 'die Aufenthaltsgenehmigung', es: 'el permiso de residencia', ex: 'Ohne Aufenthaltsgenehmigung geht gar nichts.', exEs: 'Sin permiso de residencia no se puede hacer nada.' },
            { de: 'die Integration', es: 'la integración', ex: 'Die Integration braucht vor allem Zeit.', exEs: 'La integración necesita sobre todo tiempo.' },
            { de: 'sich einleben', es: 'adaptarse', ex: 'Ich habe mich hier schnell eingelebt.', exEs: 'Me he adaptado rápido aquí.' },
            { de: 'auswandern', es: 'emigrar', ex: 'Meine Tante ist nach Kanada ausgewandert.', exEs: 'Mi tía emigró a Canadá.' },
            { de: 'einwandern', es: 'inmigrar', ex: 'Meine Großeltern sind nach Deutschland eingewandert.', exEs: 'Mis abuelos inmigraron a Alemania.' },
            { de: 'die Wurzeln', es: 'las raíces', ex: 'Meine Wurzeln sind in Andalusien.', exEs: 'Mis raíces están en Andalucía.' },
            { de: 'stammen aus', es: 'proceder de', ex: 'Meine Familie stammt aus Kroatien.', exEs: 'Mi familia procede de Croacia.' },
            { de: 'das Heimatland', es: 'el país de origen', ex: 'In meinem Heimatland ist es viel wärmer.', exEs: 'En mi país de origen hace mucho más calor.' }
          ]
        },
        {
          thema: 'Land & Sprache',
          items: [
            { de: 'die Botschaft', es: 'la embajada', ex: 'Die spanische Botschaft ist im dritten Bezirk.', exEs: 'La embajada española está en el distrito tres.' },
            { de: 'das Konsulat', es: 'el consulado', ex: 'Das Konsulat hat nur vormittags offen.', exEs: 'El consulado solo abre por la mañana.' },
            { de: 'die Währung', es: 'la moneda', ex: 'Die Währung ist hier der Euro.', exEs: 'Aquí la moneda es el euro.' },
            { de: 'die Fahne', es: 'la bandera', ex: 'Vor dem Rathaus weht eine Fahne.', exEs: 'Delante del ayuntamiento ondea una bandera.' },
            { de: 'die Nationalhymne', es: 'el himno nacional', ex: 'Die Nationalhymne kenne ich nicht auswendig.', exEs: 'El himno nacional no me lo sé de memoria.' },
            { de: 'der Einwohner', es: 'el habitante', ex: 'Wien hat fast zwei Millionen Einwohner.', exEs: 'Viena tiene casi dos millones de habitantes.' },
            { de: 'die Bevölkerung', es: 'la población', ex: 'Die Bevölkerung wächst jedes Jahr.', exEs: 'La población crece cada año.' },
            { de: 'das Gebirge', es: 'la cordillera', ex: 'Im Westen liegt ein hohes Gebirge.', exEs: 'En el oeste hay una cordillera alta.' },
            { de: 'die Küste', es: 'la costa', ex: 'An der Küste ist das Klima milder.', exEs: 'En la costa el clima es más suave.' },
            { de: 'das Festland', es: 'el continente, la tierra firme', ex: 'Von der Insel zum Festland fährt eine Fähre.', exEs: 'De la isla a tierra firme va un ferry.' },
            { de: 'der Stadtteil', es: 'el barrio', ex: 'Dieser Stadtteil ist sehr grün.', exEs: 'Este barrio es muy verde.' },
            { de: 'ländlich', es: 'rural', ex: 'Die Gegend hier ist sehr ländlich.', exEs: 'Esta zona es muy rural.' },
            { de: 'städtisch', es: 'urbano', ex: 'Das Leben hier ist sehr städtisch.', exEs: 'La vida aquí es muy urbana.' },
            { de: 'die Amtssprache', es: 'la lengua oficial', ex: 'Die Amtssprache ist hier Deutsch.', exEs: 'Aquí la lengua oficial es el alemán.' },
            { de: 'der Auswanderer', es: 'el emigrante', ex: 'Mein Großvater war Auswanderer.', exEs: 'Mi abuelo era emigrante.' },
            { de: 'die Herkunft', es: 'el origen', ex: 'Über seine Herkunft spricht er wenig.', exEs: 'De su origen habla poco.' },
            { de: 'der Muttersprachler', es: 'el hablante nativo', ex: 'Ein Muttersprachler hört den Akzent sofort.', exEs: 'Un nativo nota el acento enseguida.' },
            { de: 'der Übersetzer', es: 'el traductor', ex: 'Der Übersetzer arbeitet für das Amt.', exEs: 'El traductor trabaja para la administración.' },
            { de: 'das Wörterbuch', es: 'el diccionario', ex: 'Ohne Wörterbuch komme ich nicht weiter.', exEs: 'Sin diccionario no avanzo.' },
            { de: 'die Redewendung', es: 'la expresión, el modismo', ex: 'Diese Redewendung gibt es nur in Wien.', exEs: 'Esta expresión solo existe en Viena.' }
          ]
        },
        {
          thema: 'Nationalitäten',
          items: [
            { de: 'der Österreicher / die Österreicherin', es: 'el austriaco / la austriaca', ex: 'Mein Chef ist Österreicher.', exEs: 'Mi jefe es austriaco.' },
            { de: 'der Deutsche / die Deutsche', es: 'el alemán / la alemana', ex: 'Zwei Deutsche wohnen in meinem Haus.', exEs: 'En mi edificio viven dos alemanes.' },
            { de: 'der Spanier / die Spanierin', es: 'el español / la española', ex: 'Ich bin Spanier und lerne Deutsch.', exEs: 'Soy español y estudio alemán.' },
            { de: 'der Italiener / die Italienerin', es: 'el italiano / la italiana', ex: 'Die Italienerin von nebenan kocht super.', exEs: 'La italiana de al lado cocina genial.' },
            { de: 'der Franzose / die Französin', es: 'el francés / la francesa', ex: 'Im Kurs sind zwei Franzosen.', exEs: 'En el curso hay dos franceses.' },
            { de: 'der Türke / die Türkin', es: 'el turco / la turca', ex: 'Viele Türken leben in Wien.', exEs: 'En Viena viven muchos turcos.' },
            { de: 'der Pole / die Polin', es: 'el polaco / la polaca', ex: 'Mein Kollege ist Pole.', exEs: 'Mi compañero es polaco.' },
            { de: 'der Grieche / die Griechin', es: 'el griego / la griega', ex: 'Der Grieche an der Ecke hat gutes Essen.', exEs: 'El griego de la esquina tiene buena comida.' },
            { de: 'der Kroate / die Kroatin', es: 'el croata / la croata', ex: 'Meine Nachbarin ist Kroatin.', exEs: 'Mi vecina es croata.' },
            { de: 'der Ungar / die Ungarin', es: 'el húngaro / la húngara', ex: 'Der Ungar im Kurs spricht schon gut Deutsch.', exEs: 'El húngaro del curso ya habla bien alemán.' },
            { de: 'der Schweizer / die Schweizerin', es: 'el suizo / la suiza', ex: 'Die Schweizerin arbeitet bei einer Bank.', exEs: 'La suiza trabaja en un banco.' },
            { de: 'der Amerikaner / die Amerikanerin', es: 'el estadounidense / la estadounidense', ex: 'Zwei Amerikaner machen den Kurs mit.', exEs: 'Dos estadounidenses hacen el curso.' }
          ]
        }
      ],
      grammatik: [
        {
          regel: 'lokale Präpositionen aus / in',
          erklaerung: '"aus" = procedencia (de dónde vienes), "in" = dónde vives. Países con artículo: aus der Schweiz, in der Türkei.',
          beispiele: [
            { de: 'Ich komme aus Spanien.', es: 'Vengo de España.' },
            { de: 'Ich wohne in Wien.', es: 'Vivo en Viena.' },
            { de: 'Sie kommt aus der Schweiz.', es: 'Ella viene de Suiza.' }
          ]
        },
        {
          regel: 'Personalpronomen',
          erklaerung: 'ich, du, er/sie/es, wir, ihr, sie/Sie. "Sie" (con mayúscula) = usted/ustedes, formal.',
          beispiele: [
            { de: 'Ich bin Maria, und er ist Ahmet.', es: 'Yo soy Maria y él es Ahmet.' },
            { de: 'Wie heißen Sie?', es: '¿Cómo se llama usted?' }
          ]
        },
        {
          regel: 'Präsens: wohnen, heißen, kommen, sein',
          erklaerung: 'Regulares: -e, -st, -t, -en, -t, -en. "sein" es irregular: bin, bist, ist, sind, seid, sind.',
          beispiele: [
            { de: 'Du wohnst in Graz und ich wohne in Linz.', es: 'Tú vives en Graz y yo vivo en Linz.' },
            { de: 'Er heißt Samir. Wir sind aus Syrien.', es: 'Él se llama Samir. Nosotros somos de Siria.' }
          ]
        },
        {
          regel: 'W-Fragen',
          erklaerung: 'wer, was, wie, wo, woher, wann. El verbo va en 2ª posición.',
          beispiele: [
            { de: 'Wo wohnst du?', es: '¿Dónde vives?' },
            { de: 'Woher kommt Zofia?', es: '¿De dónde viene Zofia?' }
          ]
        },
        {
          key: 'aussprache-ch',
          regel: 'Aussprache: ch',
          erklaerung: 'La "ch" tiene dos sonidos. Detrás de i, e, ä, ö, ü o consonante es suave, casi una "h" muy marcada: ich, mich, rechts. Detrás de a, o, u o au es fuerte, la "j" española: Buch, acht, auch. Y "chs" suena "ks": sechs = «seks».',
          beispiele: [
            { de: 'Ich spreche nicht viel Deutsch.', es: 'No hablo mucho alemán. (ch suave)' },
            { de: 'Das Buch liegt auf dem Tisch.', es: 'El libro está sobre la mesa. (ch fuerte)' },
            { de: 'Um acht Uhr, nicht um sechs.', es: 'A las ocho, no a las seis.' }
          ]
        },
        {
          key: 'laender-mit-artikel',
          regel: 'Länder mit Artikel',
          erklaerung: 'La mayoría de países van sin artículo (Spanien, Italien). Unos pocos lo llevan: die Schweiz, die Türkei, die Ukraine, die Slowakei, der Iran, die USA (plural). Con esos hay que declinar: aus DER Schweiz, in DIE Türkei.',
          beispiele: [
            { de: 'Ich komme aus Spanien.', es: 'Soy de España.' },
            { de: 'Meine Mutter kommt aus der Türkei.', es: 'Mi madre es de Turquía.' },
            { de: 'Im Sommer fahren wir in die Schweiz.', es: 'En verano vamos a Suiza.' }
          ]
        },
        {
          key: 'herkunft-aus-wohnen-in',
          regel: 'aus oder in: Herkunft und Wohnort',
          erklaerung: 'aus = de dónde vienes (el origen, no cambia nunca). in = dónde vives ahora. Se pueden dar los dos en la misma frase, y son cosas distintas: puedes ser de un sitio y vivir en otro.',
          beispiele: [
            { de: 'Ich komme aus Valencia und wohne in Wien.', es: 'Soy de Valencia y vivo en Viena.' },
            { de: 'Woher kommen Sie und wo wohnen Sie?', es: '¿De dónde es y dónde vive?' }
          ]
        },
        {
          key: 'land-sprache-person',
          regel: 'Land, Sprache, Person',
          erklaerung: 'De cada país salen tres palabras: el país (Spanien), el idioma (Spanisch) y la persona (der Spanier / die Spanierin). El idioma y el adjetivo se escriben igual, pero el idioma va con mayúscula: Ich spreche Spanisch / das spanische Essen.',
          beispiele: [
            { de: 'Ich komme aus Polen und spreche Polnisch.', es: 'Soy de Polonia y hablo polaco.' },
            { de: 'Sie ist Österreicherin und spricht Deutsch.', es: 'Ella es austriaca y habla alemán.' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'sich vorstellen',
          es: 'Presentarse',
          wendungen: [
            { de: 'Guten Tag, ich bin Álvaro Pascual.', es: 'Buenos días, soy Álvaro Pascual.' }
          ]
        },
        {
          funktion: 'nach dem Namen fragen',
          es: 'Preguntar el nombre',
          wendungen: [
            { de: 'Darf ich fragen, wie Sie heißen?', es: '¿Puedo preguntarle cómo se llama?' }
          ]
        },
        {
          funktion: 'über Befinden sprechen',
          es: 'Hablar de cómo estás',
          wendungen: [
            { de: 'Wie geht\'s? – Danke, gut.', es: '¿Qué tal? – Bien, gracias.' }
          ]
        },
        {
          funktion: 'über Herkunft und Wohnort sprechen',
          es: 'Hablar de dónde eres y dónde vives',
          wendungen: [
            { de: 'Woher kommst du? Wo wohnst du?', es: '¿De dónde eres? ¿Dónde vives?' }
          ]
        },
        {
          funktion: 'etwas vermuten',
          es: 'Suponer algo',
          wendungen: [
            { de: 'Du bist sicher Maria, oder?', es: 'Tú eres Maria, ¿no?' }
          ]
        },
        {
          funktion: 'zustimmen',
          es: 'Dar la razón',
          wendungen: [
            { de: 'Ja, genau. · Richtig. · Stimmt.', es: 'Sí, exacto. · Correcto. · Cierto.' }
          ]
        },
        {
          funktion: 'über Sprachen sprechen',
          es: 'Hablar de idiomas',
          wendungen: [
            { de: 'Welche Sprachen sprichst du?', es: '¿Qué idiomas hablas?' }
          ]
        },
        {
          funktion: 'sich verabschieden',
          es: 'Despedirse',
          wendungen: [
            { de: 'Auf Wiedersehen und einen schönen Tag noch!', es: '¡Hasta la vista y que tenga un buen día!' }
          ]
        }
      ]
    },

    {
      id: 'a11-l2',
      nr: 2,
      name: 'Wohnen Sie auch da?',
      woerter: [
        {
          thema: 'persönliche Angaben und Familienstand (I)',
          items: [
            { de: 'der Vorname', es: 'el nombre', ex: 'Mein Vorname ist Álvaro.', exEs: 'Mi nombre es Álvaro.' },
            { de: 'der Familienname / der Nachname', es: 'el apellido', ex: 'Wie ist Ihr Familienname?', exEs: '¿Cuál es su apellido?' },
            { de: 'das Alter', es: 'la edad', ex: 'Das Alter muss man hier nicht angeben.', exEs: 'Aquí no hay que poner la edad.' },
            { de: 'der Beruf', es: 'la profesión', ex: 'Von Beruf bin ich Techniker.', exEs: 'De profesión soy técnico.' },
            { de: 'ledig', es: 'soltero/a', ex: 'Ich bin ledig und wohne allein.', exEs: 'Estoy soltero y vivo solo.' },
            { de: 'verheiratet', es: 'casado/a', ex: 'Sie ist seit fünf Jahren verheiratet.', exEs: 'Está casada desde hace cinco años.' },
            { de: 'geschieden', es: 'divorciado/a', ex: 'Meine Eltern sind seit Jahren geschieden.', exEs: 'Mis padres están divorciados desde hace años.' },
            { de: 'verwitwet', es: 'viudo/a', ex: 'Die Nachbarin ist verwitwet.', exEs: 'La vecina es viuda.' },
            { de: 'der Geburtsort', es: 'el lugar de nacimiento', ex: 'Mein Geburtsort ist Madrid.', exEs: 'Mi lugar de nacimiento es Madrid.' },
            { de: 'das Geburtsdatum', es: 'la fecha de nacimiento', ex: 'Schreiben Sie hier Ihr Geburtsdatum.', exEs: 'Escriba aquí su fecha de nacimiento.' },
            { de: 'die Staatsangehörigkeit', es: 'la nacionalidad', ex: 'Staatsangehörigkeit: spanisch.', exEs: 'Nacionalidad: española.' },
            { de: 'der Ausweis', es: 'el documento de identidad', ex: 'Haben Sie Ihren Ausweis dabei?', exEs: '¿Trae su documento de identidad?' },
            { de: 'der Reisepass', es: 'el pasaporte', ex: 'Mein Reisepass läuft im Mai ab.', exEs: 'Mi pasaporte caduca en mayo.' },
            { de: 'unterschreiben', es: 'firmar', ex: 'Bitte hier unten unterschreiben.', exEs: 'Firme aquí abajo, por favor.' },
            { de: 'heiraten', es: 'casarse', ex: 'Meine Schwester heiratet im Mai.', exEs: 'Mi hermana se casa en mayo.' },
            { de: 'der Führerschein', es: 'el carné de conducir', ex: 'Für den Job brauche ich einen Führerschein.', exEs: 'Para el trabajo necesito carné de conducir.' },
            { de: 'die Sozialversicherungsnummer', es: 'el número de la seguridad social', ex: 'Die Sozialversicherungsnummer steht auf der Karte.', exEs: 'El número de la seguridad social está en la tarjeta.' },
            { de: 'der Notfallkontakt', es: 'el contacto de emergencia', ex: 'Bitte geben Sie einen Notfallkontakt an.', exEs: 'Indique un contacto de emergencia, por favor.' }
          ]
        },
        {
          thema: 'Adresse',
          items: [
            { de: 'die Straße', es: 'la calle', ex: 'In welcher Straße wohnst du?', exEs: '¿En qué calle vives?' },
            { de: 'die Hausnummer', es: 'el número', ex: 'Die Hausnummer ist zwölf, Stiege zwei.', exEs: 'El número es el doce, escalera dos.' },
            { de: 'die Postleitzahl (PLZ)', es: 'el código postal', ex: 'Die Postleitzahl von Wien beginnt mit zehn.', exEs: 'El código postal de Viena empieza por diez.' },
            { de: 'der Ort / die Stadt', es: 'la localidad / la ciudad', ex: 'Ort: Wien, Land: Österreich.', exEs: 'Localidad: Viena. País: Austria.' },
            { de: 'das Land', es: 'el país', ex: 'In welchem Land bist du geboren?', exEs: '¿En qué país naciste?' },
            { de: 'die Telefonnummer', es: 'el número de teléfono', ex: 'Gibst du mir deine Telefonnummer?', exEs: '¿Me das tu número de teléfono?' },
            { de: 'die E-Mail-Adresse', es: 'el correo electrónico', ex: 'Meine E-Mail-Adresse schreibe ich dir auf.', exEs: 'Te apunto mi correo electrónico.' }
          ]
        },
        {
          thema: 'Zahlen 20–1000',
          items: [
            { de: 'zwanzig, einundzwanzig, zweiundzwanzig', es: '20, 21, 22', ex: 'Ich wohne in Nummer einundzwanzig.', exEs: 'Vivo en el número veintiuno.' },
            { de: 'dreißig, vierzig, fünfzig', es: '30, 40, 50', ex: 'Meine Mutter wird nächste Woche fünfzig.', exEs: 'Mi madre cumple cincuenta la semana que viene.' },
            { de: 'sechzig, siebzig, achtzig, neunzig', es: '60, 70, 80, 90', ex: 'Mein Opa ist schon neunzig.', exEs: 'Mi abuelo ya tiene noventa.' },
            { de: '(ein)hundert, zweihundert', es: '100, 200', ex: 'Bis hundert zählen kann ich schon.', exEs: 'Contar hasta cien ya sé.' },
            { de: '(ein)tausend', es: '1000', ex: 'Das Bild ist von tausendneunhundert.', exEs: 'El cuadro es de mil novecientos.' },
            { de: 'die Zahl', es: 'el número, la cifra', ex: 'Können Sie die Zahl bitte wiederholen?', exEs: '¿Puede repetir el número, por favor?' },
            { de: 'die Nummer', es: 'el número (de algo)', ex: 'Meine Nummer hat elf Ziffern.', exEs: 'Mi número tiene once cifras.' },
            { de: 'zählen', es: 'contar', ex: 'Zählen Sie bitte von eins bis zehn.', exEs: 'Cuente del uno al diez, por favor.' }
          ]
        },
        {
          thema: 'Sprachen',
          items: [
            { de: 'Deutsch', es: 'alemán', ex: 'Deutsch haben wir viermal die Woche.', exEs: 'Alemán tenemos cuatro veces por semana.' },
            { de: 'Englisch', es: 'inglés', ex: 'Englisch lernt man hier ab der Volksschule.', exEs: 'Aquí se aprende inglés desde primaria.' },
            { de: 'Spanisch', es: 'español', ex: 'Spanisch ist meine Muttersprache.', exEs: 'El español es mi lengua materna.' },
            { de: 'Französisch', es: 'francés', ex: 'Französisch habe ich in der Schule gelernt.', exEs: 'Francés lo aprendí en el colegio.' },
            { de: 'Italienisch', es: 'italiano', ex: 'Italienisch verstehe ich ein bisschen.', exEs: 'El italiano lo entiendo un poco.' },
            { de: 'Türkisch', es: 'turco', ex: 'Mein Nachbar spricht Türkisch und Deutsch.', exEs: 'Mi vecino habla turco y alemán.' },
            { de: 'Arabisch', es: 'árabe', ex: 'Arabisch schreibt man von rechts nach links.', exEs: 'El árabe se escribe de derecha a izquierda.' },
            { de: 'Polnisch', es: 'polaco', ex: 'Polnisch ist für mich sehr schwer.', exEs: 'El polaco me resulta muy difícil.' },
            { de: 'Ungarisch', es: 'húngaro', ex: 'Meine Nachbarin spricht Ungarisch mit den Kindern.', exEs: 'Mi vecina habla húngaro con los niños.' },
            { de: 'Kroatisch', es: 'croata', ex: 'Er lernt Kroatisch für die Arbeit.', exEs: 'Aprende croata por el trabajo.' },
            { de: 'Rumänisch', es: 'rumano', ex: 'Rumänisch klingt fast wie Italienisch.', exEs: 'El rumano suena casi como el italiano.' },
            { de: 'Russisch', es: 'ruso', ex: 'Im Kurs spricht niemand Russisch.', exEs: 'En el curso no habla ruso nadie.' }
          ]
        },
        {
          thema: 'Adresse und Kontakt',
          items: [
            { de: 'die Wohnung', es: 'el piso', ex: 'Meine Wohnung ist im vierten Stock.', exEs: 'Mi piso está en el cuarto.' },
            { de: 'der Stock', es: 'la planta', ex: 'Wir wohnen im zweiten Stock.', exEs: 'Vivimos en la segunda planta.' },
            { de: 'die Tür / die Türnummer', es: 'la puerta / el número de puerta', ex: 'Stiege 2, Tür 14.', exEs: 'Escalera 2, puerta 14.' },
            { de: 'das Handy / die Handynummer', es: 'el móvil / el número de móvil', ex: 'Schreib mir deine Handynummer auf.', exEs: 'Apúntame tu número de móvil.' },
            { de: 'erreichen', es: 'localizar (a alguien)', ex: 'Unter dieser Nummer erreichen Sie mich immer.', exEs: 'En este número me localiza siempre.' },
            { de: 'buchstabieren', es: 'deletrear', ex: 'Können Sie das bitte buchstabieren?', exEs: '¿Puede deletrearlo, por favor?' },
            { de: 'die Anmeldung', es: 'el empadronamiento', ex: 'Die Anmeldung macht man im Amt.', exEs: 'El empadronamiento se hace en la oficina.' },
            { de: 'umziehen', es: 'mudarse', ex: 'Nächsten Monat ziehen wir um.', exEs: 'El mes que viene nos mudamos.' }
          ]
        },
        {
          thema: 'Formulare & Ämter',
          items: [
            { de: 'der Familienstand', es: 'el estado civil', ex: 'Familienstand: ledig oder verheiratet?', exEs: 'Estado civil: ¿soltero o casado?' },
            { de: 'das Formular', es: 'el formulario', ex: 'Bitte füllen Sie das Formular hier aus.', exEs: 'Rellene aquí el formulario, por favor.' },
            { de: 'ausfüllen', es: 'rellenar', ex: 'Ich fülle den Antrag lieber zu Hause aus.', exEs: 'Prefiero rellenar la solicitud en casa.' },
            { de: 'die Unterschrift', es: 'la firma', ex: 'Hier unten fehlt noch Ihre Unterschrift.', exEs: 'Aquí abajo falta todavía su firma.' },
            { de: 'gültig', es: 'válido', ex: 'Mein Ausweis ist noch zwei Jahre gültig.', exEs: 'Mi documento todavía es válido dos años.' },
            { de: 'der Wohnort', es: 'el lugar de residencia', ex: 'Mein Wohnort ist seit Mai Wien.', exEs: 'Mi lugar de residencia es Viena desde mayo.' },
            { de: 'der Meldezettel', es: 'el certificado de empadronamiento', ex: 'Für die Anmeldung brauchst du einen Meldezettel.', exEs: 'Para el registro necesitas un certificado de empadronamiento.' },
            { de: 'die Nationalität', es: 'la nacionalidad', ex: 'Meine Nationalität steht im Pass.', exEs: 'Mi nacionalidad está en el pasaporte.' },
            { de: 'das Amt', es: 'la oficina pública', ex: 'Morgen muss ich aufs Amt.', exEs: 'Mañana tengo que ir a la oficina pública.' },
            { de: 'der Antrag', es: 'la solicitud', ex: 'Der Antrag ist schon unterschrieben.', exEs: 'La solicitud ya está firmada.' },
            { de: 'der Geburtstag', es: 'el cumpleaños', ex: 'Mein Geburtstag ist am dritten Mai.', exEs: 'Mi cumpleaños es el tres de mayo.' },
            { de: 'das Geburtsjahr', es: 'el año de nacimiento', ex: 'Mein Geburtsjahr ist neunzehnhundertneunzig.', exEs: 'Mi año de nacimiento es mil novecientos noventa.' },
            { de: 'ändern', es: 'cambiar', ex: 'Ich möchte meine Adresse ändern.', exEs: 'Quiero cambiar mi dirección.' },
            { de: 'das Erdgeschoss', es: 'la planta baja', ex: 'Wir wohnen im Erdgeschoss links.', exEs: 'Vivimos en la planta baja, a la izquierda.' },
            { de: 'die Kopie', es: 'la copia', ex: 'Bringen Sie bitte eine Kopie vom Ausweis mit.', exEs: 'Traiga una copia del documento, por favor.' },
            { de: 'wiederholen', es: 'repetir', ex: 'Können Sie das bitte wiederholen?', exEs: '¿Puede repetirlo, por favor?' },
            { de: 'langsam', es: 'despacio', ex: 'Bitte sprechen Sie langsam und deutlich.', exEs: 'Hable despacio y con claridad, por favor.' },
            { de: 'der Buchstabe', es: 'la letra', ex: 'Der erste Buchstabe ist ein M.', exEs: 'La primera letra es una M.' },
            { de: 'die Angabe', es: 'el dato', ex: 'Diese Angabe fehlt noch im Formular.', exEs: 'Este dato falta todavía en el formulario.' },
            { de: 'die Person', es: 'la persona', ex: 'Eine Person fehlt noch auf der Liste.', exEs: 'Falta todavía una persona en la lista.' }
          ]
        },
        {
          thema: 'Beim Amt & im Formular',
          items: [
            { de: 'das Geschlecht', es: 'el sexo, el género', ex: 'Geschlecht: männlich oder weiblich?', exEs: 'Sexo: ¿masculino o femenino?' },
            { de: 'männlich', es: 'masculino', ex: 'Im Formular kreuze ich männlich an.', exEs: 'En el formulario marco masculino.' },
            { de: 'weiblich', es: 'femenino', ex: 'Bei Geschlecht steht weiblich.', exEs: 'En sexo pone femenino.' },
            { de: 'der Wohnsitz', es: 'el domicilio', ex: 'Mein Hauptwohnsitz ist in Wien.', exEs: 'Mi domicilio principal está en Viena.' },
            { de: 'die Behörde', es: 'la administración', ex: 'Die Behörde antwortet meistens schriftlich.', exEs: 'La administración contesta casi siempre por escrito.' },
            { de: 'der Sachbearbeiter', es: 'el gestor del expediente', ex: 'Der Sachbearbeiter ruft Sie morgen an.', exEs: 'El gestor le llama mañana.' },
            { de: 'das Dokument', es: 'el documento', ex: 'Bringen Sie bitte alle Dokumente mit.', exEs: 'Traiga todos los documentos, por favor.' },
            { de: 'beglaubigen', es: 'compulsar', ex: 'Die Kopie muss man beglaubigen lassen.', exEs: 'La copia hay que compulsarla.' },
            { de: 'das Original', es: 'el original', ex: 'Das Original bleibt bei Ihnen.', exEs: 'El original se queda con usted.' },
            { de: 'die Vorwahl', es: 'el prefijo', ex: 'Die Vorwahl von Österreich ist plus dreiundvierzig.', exEs: 'El prefijo de Austria es más cuarenta y tres.' },
            { de: 'die Ziffer', es: 'la cifra', ex: 'Welche Ziffer steht am Anfang?', exEs: '¿Qué cifra va al principio?' },
            { de: 'der Monat', es: 'el mes', ex: 'Welchen Monat haben wir heute?', exEs: '¿En qué mes estamos hoy?' },
            { de: 'die Liste', es: 'la lista', ex: 'Dein Name steht auf der Liste.', exEs: 'Tu nombre está en la lista.' },
            { de: 'die Warteschlange', es: 'la cola', ex: 'Die Warteschlange war heute sehr lang.', exEs: 'Hoy la cola era muy larga.' },
            { de: 'anmelden', es: 'registrar, empadronar', ex: 'Ich muss mich in Wien anmelden.', exEs: 'Tengo que empadronarme en Viena.' },
            { de: 'abmelden', es: 'dar de baja', ex: 'Beim Umzug muss man sich abmelden.', exEs: 'Al mudarse hay que darse de baja.' },
            { de: 'ausdrucken', es: 'imprimir', ex: 'Das Formular kann man auch ausdrucken.', exEs: 'El formulario también se puede imprimir.' },
            { de: 'die E-Mail', es: 'el correo electrónico', ex: 'Ich schicke Ihnen gleich eine E-Mail.', exEs: 'Le mando ahora un correo electrónico.' },
            { de: 'die Seite', es: 'la página', ex: 'Unterschreiben Sie bitte auf Seite zwei.', exEs: 'Firme en la página dos, por favor.' },
            { de: 'das Feld', es: 'la casilla', ex: 'Dieses Feld darf nicht leer bleiben.', exEs: 'Esta casilla no puede quedar vacía.' },
            { de: 'ankreuzen', es: 'marcar con una cruz', ex: 'Bitte die richtige Antwort ankreuzen.', exEs: 'Marque la respuesta correcta, por favor.' }
          ]
        },
        {
          thema: 'Post & Papiere',
          items: [
            { de: 'der Mädchenname', es: 'el apellido de soltera', ex: 'Ihr Mädchenname war Novak.', exEs: 'Su apellido de soltera era Novak.' },
            { de: 'die Anrede', es: 'el tratamiento', ex: 'Welche Anrede benutzt man hier?', exEs: '¿Qué tratamiento se usa aquí?' },
            { de: 'der Titel', es: 'el título', ex: 'Auf dem Formular steht auch der Titel.', exEs: 'En el formulario también está el título.' },
            { de: 'volljährig', es: 'mayor de edad', ex: 'Mit achtzehn ist man hier volljährig.', exEs: 'Aquí a los dieciocho se es mayor de edad.' },
            { de: 'minderjährig', es: 'menor de edad', ex: 'Mein Sohn ist noch minderjährig.', exEs: 'Mi hijo todavía es menor de edad.' },
            { de: 'der Personalausweis', es: 'el documento de identidad', ex: 'Der Personalausweis ist zehn Jahre gültig.', exEs: 'El documento de identidad vale diez años.' },
            { de: 'die Ausweisnummer', es: 'el número de documento', ex: 'Die Ausweisnummer steht unten rechts.', exEs: 'El número de documento está abajo a la derecha.' },
            { de: 'die Anschrift', es: 'el domicilio', ex: 'Bitte tragen Sie hier die Anschrift ein.', exEs: 'Escriba aquí el domicilio, por favor.' },
            { de: 'das Postfach', es: 'el apartado de correos', ex: 'Schreiben Sie bitte an das Postfach.', exEs: 'Escriba al apartado de correos, por favor.' },
            { de: 'der Absender', es: 'el remitente', ex: 'Der Absender steht auf der Rückseite.', exEs: 'El remitente está en el reverso.' },
            { de: 'der Empfänger', es: 'el destinatario', ex: 'Der Empfänger war nicht zu Hause.', exEs: 'El destinatario no estaba en casa.' },
            { de: 'die Briefmarke', es: 'el sello', ex: 'Für den Brief brauche ich eine Briefmarke.', exEs: 'Para la carta necesito un sello.' },
            { de: 'der Umschlag', es: 'el sobre', ex: 'Der Umschlag ist leider zu klein.', exEs: 'El sobre es demasiado pequeño.' },
            { de: 'das Einschreiben', es: 'el correo certificado', ex: 'Schicken Sie es besser per Einschreiben.', exEs: 'Mándelo mejor por correo certificado.' },
            { de: 'das Merkblatt', es: 'la hoja informativa', ex: 'Das Merkblatt erklärt alles Schritt für Schritt.', exEs: 'La hoja informativa lo explica paso a paso.' },
            { de: 'die Bescheinigung', es: 'el certificado', ex: 'Für die Schule brauche ich eine Bescheinigung.', exEs: 'Para el colegio necesito un certificado.' },
            { de: 'die Bankkarte', es: 'la tarjeta bancaria', ex: 'Die Bankkarte ist zwei Jahre gültig.', exEs: 'La tarjeta bancaria vale dos años.' },
            { de: 'die Steuernummer', es: 'el número fiscal', ex: 'Die Steuernummer bekommt man automatisch.', exEs: 'El número fiscal se recibe automáticamente.' }
          ]
        },
        {
          thema: 'Wohnort & Nachbarschaft',
          items: [
            { de: 'die Adresse', es: 'la dirección', ex: 'Schreib mir bitte deine Adresse auf.', exEs: 'Apúntame tu dirección, por favor.' },
            { de: 'der Bezirk', es: 'el distrito', ex: 'Ich wohne im fünfzehnten Bezirk.', exEs: 'Vivo en el distrito quince.' },
            { de: 'das Viertel', es: 'el barrio', ex: 'Das Viertel ist ruhig und grün.', exEs: 'El barrio es tranquilo y verde.' },
            { de: 'der Aufzug / der Lift', es: 'el ascensor', ex: 'Der Aufzug ist leider wieder kaputt.', exEs: 'El ascensor está otra vez estropeado.' },
            { de: 'die Klingel', es: 'el timbre', ex: 'Die Klingel funktioniert nicht, bitte anrufen.', exEs: 'El timbre no funciona, llame por teléfono.' },
            { de: 'der Briefkasten', es: 'el buzón', ex: 'Die Post liegt noch im Briefkasten.', exEs: 'El correo sigue en el buzón.' },
            { de: 'der Hausmeister', es: 'el conserje', ex: 'Der Hausmeister hat einen Zweitschlüssel.', exEs: 'El conserje tiene una copia de la llave.' },
            { de: 'das Stockwerk', es: 'la planta, el piso', ex: 'Wir wohnen im dritten Stockwerk.', exEs: 'Vivimos en la tercera planta.' }
          ]
        }
      ],
      grammatik: [
        {
          regel: 'Personalpronomen wir / ihr',
          erklaerung: 'wir = nosotros (-en), ihr = vosotros (-t).',
          beispiele: [
            { de: 'Wir wohnen in Salzburg.', es: 'Vivimos en Salzburgo.' },
            { de: 'Woher kommt ihr?', es: '¿De dónde venís?' }
          ]
        },
        {
          regel: 'Ja-/Nein-Frage',
          erklaerung: 'El verbo va en la 1ª posición. Se responde con ja o nein.',
          beispiele: [
            { de: 'Wohnen Sie auch da? – Ja, ich wohne auch da.', es: '¿Usted también vive ahí? – Sí.' },
            { de: 'Sprichst du Deutsch? – Nein, nur ein bisschen.', es: '¿Hablas alemán? – No, solo un poco.' }
          ]
        },
        {
          regel: 'Verben leben, sprechen, haben, sein',
          erklaerung: '"sprechen" cambia la vocal: du sprichst, er spricht. "haben": ich habe, du hast, er hat.',
          beispiele: [
            { de: 'Er spricht Türkisch und Deutsch.', es: 'Él habla turco y alemán.' },
            { de: 'Ich habe eine Tochter.', es: 'Tengo una hija.' }
          ]
        },
        {
          key: 'aussprache-sch-sp-st',
          regel: 'Aussprache: sch, sp, st',
          erklaerung: '"sch" es un solo sonido, el de «show». Y al principio de palabra, "sp" y "st" se pronuncian «schp» y «scht»: sprechen = «schprechen», Stadt = «Schtadt». A mitad de palabra no: Fenster suena con "st" normal.',
          beispiele: [
            { de: 'Ich spreche Spanisch.', es: 'Hablo español. («schpreche», «Schpanisch»)' },
            { de: 'Die Straße ist in der Stadt.', es: 'La calle está en la ciudad. («Schtraße», «Schtadt»)' },
            { de: 'Das Fenster ist offen.', es: 'La ventana está abierta. (aquí "st" normal)' }
          ]
        },
        {
          key: 'wohnen-in-der-strasse',
          regel: 'in + Dativ bei der Adresse',
          erklaerung: 'La dirección va con in + dativo: in DER Mariahilfer Straße, im (= in dem) dritten Stock. Con el número de casa se dice sin preposición: Mariahilfer Straße 48.',
          beispiele: [
            { de: 'Ich wohne in der Ungargasse.', es: 'Vivo en la Ungargasse.' },
            { de: 'Wir wohnen im vierten Stock.', es: 'Vivimos en el cuarto piso.' }
          ]
        },
        {
          key: 'ordinalzahlen-wohnort',
          regel: 'Ordinalzahlen: Stock und Bezirk',
          erklaerung: 'Del 1 al 19 se añade -te (der zweite, der vierte); a partir de 20, -ste (der zwanzigste). Ojo con los irregulares: erste, dritte, siebte, achte. Con Stock y Bezirk van casi siempre en dativo: im dritten Stock, im fünfzehnten Bezirk.',
          beispiele: [
            { de: 'Sie wohnt im ersten Stock.', es: 'Vive en el primer piso.' },
            { de: 'Wir sind gerade in den zwanzigsten Bezirk gezogen.', es: 'Nos acabamos de mudar al distrito veinte.' }
          ]
        },
        {
          key: 'hoeflich-fragen-koennen',
          regel: 'Höflich fragen mit können',
          erklaerung: 'Para pedir algo con educación se usa können + bitte, y el infinitivo se va al final: Können Sie das bitte wiederholen? Es mucho más suave que el imperativo a secas.',
          beispiele: [
            { de: 'Können Sie das bitte buchstabieren?', es: '¿Me lo puede deletrear, por favor?' },
            { de: 'Kannst du bitte langsamer sprechen?', es: '¿Puedes hablar más despacio, por favor?' }
          ]
        },
        {
          key: 'aussprache-e-am-wortende',
          regel: 'Aussprache: das -e am Wortende',
          erklaerung: 'La -e final no suena como la e española: es un sonido flojo, casi una a apagada. Name suena «náme», bitte «bíte», Straße «shtráse». Y en -en final la e casi desaparece: haben suena «hábn».',
          beispiele: [
            { de: 'Wie ist Ihr Name, bitte?', es: '¿Cuál es su nombre, por favor?' },
            { de: 'Wir haben eine Frage zur Adresse.', es: 'Tenemos una pregunta sobre la dirección.' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'nach dem Alter fragen',
          es: 'Preguntar la edad',
          wendungen: [
            { de: 'Darf ich fragen, wie alt Sie sind?', es: '¿Puedo preguntarle cuántos años tiene?' }
          ]
        },
        {
          funktion: 'über Familie und Familienstand sprechen',
          es: 'Hablar de la familia y el estado civil',
          wendungen: [
            { de: 'Sind Sie ledig oder verheiratet?', es: '¿Está usted soltero o casado?' }
          ]
        },
        {
          funktion: 'nach Wohnort und Wohnsituation fragen',
          es: 'Preguntar por el lugar de residencia',
          wendungen: [
            { de: 'Woher kommen Sie?', es: '¿De dónde es usted?' }
          ]
        },
        {
          funktion: 'Adresse und Kontaktdaten angeben',
          es: 'Dar la dirección y los datos de contacto',
          wendungen: [
            { de: 'Wie ist Ihre Adresse?', es: '¿Cuál es su dirección?' }
          ]
        },
        {
          funktion: 'über Sprachkenntnisse sprechen',
          es: 'Hablar de conocimientos de idiomas',
          wendungen: [
            { de: 'Ich spreche ein bisschen Deutsch.', es: 'Hablo un poco de alemán.' }
          ]
        },
        {
          funktion: 'um Wiederholung bitten',
          es: 'Pedir que te lo repitan',
          wendungen: [
            { de: 'Wie bitte?', es: '¿Cómo dice?' }
          ]
        },
        {
          funktion: 'ein Formular ausfüllen',
          es: 'Rellenar un formulario',
          wendungen: [
            { de: 'Bitte füllen Sie dieses Formular aus.', es: 'Rellene este formulario, por favor.' }
          ]
        },
        {
          funktion: 'persönliche Daten und Dokumente klären',
          es: 'Aclarar datos personales y documentos',
          wendungen: [
            { de: 'Haben Sie einen Ausweis dabei?', es: '¿Trae algún documento?' }
          ]
        }
      ]
    },

    {
      id: 'a11-l3',
      nr: 3,
      name: 'Was sind Sie von Beruf?',
      woerter: [
        {
          thema: 'Alltagsgegenstände',
          items: [
            { de: 'der Tisch', es: 'la mesa', ex: 'Der Tisch ist zu klein für sechs Leute.', exEs: 'La mesa es pequeña para seis personas.' },
            { de: 'der Stuhl', es: 'la silla', ex: 'Nimm dir einen Stuhl und setz dich.', exEs: 'Coge una silla y siéntate.' },
            { de: 'das Buch', es: 'el libro', ex: 'Das Buch habe ich in zwei Tagen gelesen.', exEs: 'El libro me lo leí en dos días.' },
            { de: 'das Heft', es: 'el cuaderno', ex: 'Schreib die Wörter in dein Heft.', exEs: 'Escribe las palabras en el cuaderno.' },
            { de: 'der Kugelschreiber / der Kuli', es: 'el bolígrafo', ex: 'Mein Kuli schreibt nicht mehr.', exEs: 'Mi boli ya no escribe.' },
            { de: 'der Bleistift', es: 'el lápiz', ex: 'Mit Bleistift kann man es ausradieren.', exEs: 'A lápiz se puede borrar.' },
            { de: 'die Tasche', es: 'el bolso / la bolsa', ex: 'Meine Tasche steht unter dem Tisch.', exEs: 'Mi bolsa está debajo de la mesa.' },
            { de: 'das Handy', es: 'el móvil', ex: 'Mein Handy ist schon wieder leer.', exEs: 'Se me ha vuelto a quedar sin batería el móvil.' },
            { de: 'der Laptop', es: 'el portátil', ex: 'Den Laptop nehme ich immer mit.', exEs: 'El portátil me lo llevo siempre.' },
            { de: 'die Brille', es: 'las gafas', ex: 'Ohne Brille sehe ich fast nichts.', exEs: 'Sin gafas no veo casi nada.' },
            { de: 'der Schlüssel', es: 'la llave', ex: 'Ich habe den Schlüssel in der Wohnung vergessen.', exEs: 'Me he dejado las llaves dentro de casa.' },
            { de: 'die Uhr', es: 'el reloj', ex: 'Meine Uhr geht zwei Minuten vor.', exEs: 'Mi reloj va dos minutos adelantado.' },
            { de: 'das Papier', es: 'el papel', ex: 'Hast du ein Blatt Papier für mich?', exEs: '¿Tienes una hoja de papel?' },
            { de: 'der Radiergummi', es: 'la goma de borrar', ex: 'Der Radiergummi ist im Mäppchen.', exEs: 'La goma está en el estuche.' },
            { de: 'die Schere', es: 'las tijeras', ex: 'Gib mir bitte die Schere.', exEs: 'Pásame las tijeras.' },
            { de: 'der Ordner', es: 'la carpeta de anillas', ex: 'Alle Rechnungen sind in diesem Ordner.', exEs: 'Todas las facturas están en esta carpeta.' },
            { de: 'das Ladekabel', es: 'el cable de carga', ex: 'Mein Ladekabel ist zu Hause geblieben.', exEs: 'El cargador se me ha quedado en casa.' },
            { de: 'die Geldbörse', es: 'el monedero', ex: 'Meine Geldbörse ist in der Tasche.', exEs: 'El monedero está en el bolso.' },
            { de: 'der Rucksack', es: 'la mochila', ex: 'Im Rucksack ist alles für den Kurs.', exEs: 'En la mochila llevo todo para el curso.' },
            { de: 'die Flasche', es: 'la botella', ex: 'Ich nehme immer eine Flasche Wasser mit.', exEs: 'Siempre me llevo una botella de agua.' }
          ]
        },
        {
          thema: 'Berufe',
          items: [
            { de: 'der Arzt / die Ärztin', es: 'el médico / la médica', ex: 'Mein Arzt hat erst nächste Woche einen Termin.', exEs: 'Mi médico no tiene cita hasta la semana que viene.' },
            { de: 'der Lehrer / die Lehrerin', es: 'el profesor / la profesora', ex: 'Unsere Lehrerin spricht sehr langsam und deutlich.', exEs: 'Nuestra profesora habla muy despacio y claro.' },
            { de: 'der Kellner / die Kellnerin', es: 'el camarero / la camarera', ex: 'Der Kellner bringt gleich die Karte.', exEs: 'El camarero trae la carta enseguida.' },
            { de: 'der Verkäufer / die Verkäuferin', es: 'el vendedor / la vendedora', ex: 'Die Verkäuferin war sehr freundlich.', exEs: 'La dependienta fue muy amable.' },
            { de: 'der Koch / die Köchin', es: 'el cocinero / la cocinera', ex: 'Mein Bruder ist Koch in einem Hotel.', exEs: 'Mi hermano es cocinero en un hotel.' },
            { de: 'der Krankenpfleger / die Krankenpflegerin', es: 'el enfermero / la enfermera', ex: 'Als Krankenpflegerin arbeitet sie auch nachts.', exEs: 'Como enfermera trabaja también de noche.' },
            { de: 'der Techniker / die Technikerin', es: 'el técnico / la técnica', ex: 'Der Techniker kommt am Montag.', exEs: 'El técnico viene el lunes.' },
            { de: 'der Student / die Studentin', es: 'el estudiante / la estudiante', ex: 'Als Student zahlt man weniger.', exEs: 'Siendo estudiante se paga menos.' },
            { de: 'der Friseur / die Friseurin', es: 'el peluquero / la peluquera', ex: 'Beim Friseur muss man vorher anrufen.', exEs: 'En la peluquería hay que llamar antes.' }
          ]
        },
        {
          thema: 'Am Arbeitsplatz',
          items: [
            { de: 'der Arbeitsplatz', es: 'el puesto de trabajo', ex: 'Mein Arbeitsplatz ist im zweiten Stock.', exEs: 'Mi puesto está en la segunda planta.' },
            { de: 'das Büro', es: 'la oficina', ex: 'Das Büro ist von acht bis fünf offen.', exEs: 'La oficina abre de ocho a cinco.' },
            { de: 'die Kollegin / der Kollege', es: 'la compañera / el compañero', ex: 'Meine Kollegin hilft mir mit dem Deutsch.', exEs: 'Mi compañera me ayuda con el alemán.' },
            { de: 'die Chefin / der Chef', es: 'la jefa / el jefe', ex: 'Die Chefin kommt gleich.', exEs: 'La jefa viene ahora.' },
            { de: 'arbeitslos', es: 'en paro', ex: 'Er ist seit einem Monat arbeitslos.', exEs: 'Lleva un mes en paro.' },
            { de: 'die Ausbildung', es: 'la formación profesional', ex: 'Sie macht eine Ausbildung als Köchin.', exEs: 'Está haciendo formación de cocinera.' },
            { de: 'Vollzeit / Teilzeit', es: 'jornada completa / media jornada', ex: 'Ich arbeite nur Teilzeit.', exEs: 'Trabajo solo media jornada.' },
            { de: 'der Ingenieur / die Ingenieurin', es: 'el ingeniero / la ingeniera', ex: 'Mein Bruder ist Ingenieur bei einer Firma.', exEs: 'Mi hermano es ingeniero en una empresa.' },
            { de: 'der Fahrer / die Fahrerin', es: 'el conductor / la conductora', ex: 'Der Fahrer wartet schon unten.', exEs: 'El conductor ya espera abajo.' },
            { de: 'der Maler / die Malerin', es: 'el pintor / la pintora', ex: 'Am Montag kommt der Maler.', exEs: 'El lunes viene el pintor.' },
            { de: 'der Elektriker / die Elektrikerin', es: 'el electricista', ex: 'Wir brauchen einen Elektriker.', exEs: 'Necesitamos un electricista.' }
          ]
        },
        {
          thema: 'Arbeit & Büro',
          items: [
            { de: 'der Beruf', es: 'la profesión', ex: 'Welchen Beruf hast du gelernt?', exEs: '¿Qué profesión estudiaste?' },
            { de: 'die Firma', es: 'la empresa', ex: 'Ich arbeite in einer kleinen Firma.', exEs: 'Trabajo en una empresa pequeña.' },
            { de: 'die Stelle', es: 'el puesto de trabajo', ex: 'Ich habe eine neue Stelle gefunden.', exEs: 'He encontrado un puesto nuevo.' },
            { de: 'das Praktikum', es: 'las prácticas', ex: 'Ich mache ein Praktikum im Krankenhaus.', exEs: 'Estoy haciendo prácticas en el hospital.' },
            { de: 'das Gehalt', es: 'el sueldo', ex: 'Das Gehalt kommt immer am Ersten.', exEs: 'El sueldo llega siempre el día uno.' },
            { de: 'die Schicht', es: 'el turno', ex: 'Diese Woche habe ich die späte Schicht.', exEs: 'Esta semana tengo el turno de tarde.' },
            { de: 'der Bäcker / die Bäckerin', es: 'el panadero / la panadera', ex: 'Der Bäcker steht schon um vier Uhr auf.', exEs: 'El panadero se levanta ya a las cuatro.' },
            { de: 'der Mechaniker / die Mechanikerin', es: 'el mecánico / la mecánica', ex: 'Der Mechaniker repariert mein Auto.', exEs: 'El mecánico arregla mi coche.' },
            { de: 'der Gärtner / die Gärtnerin', es: 'el jardinero / la jardinera', ex: 'Die Gärtnerin arbeitet im Park.', exEs: 'La jardinera trabaja en el parque.' },
            { de: 'der Programmierer / die Programmiererin', es: 'el programador / la programadora', ex: 'Mein Bruder ist Programmierer bei einer Bank.', exEs: 'Mi hermano es programador en un banco.' },
            { de: 'der Rechtsanwalt / die Rechtsanwältin', es: 'el abogado / la abogada', ex: 'Die Rechtsanwältin hat heute viel zu tun.', exEs: 'La abogada tiene hoy mucho trabajo.' },
            { de: 'der Apotheker / die Apothekerin', es: 'el farmacéutico / la farmacéutica', ex: 'Der Apotheker erklärt mir die Tabletten.', exEs: 'El farmacéutico me explica las pastillas.' },
            { de: 'der Busfahrer / die Busfahrerin', es: 'el conductor / la conductora de autobús', ex: 'Der Busfahrer ist immer sehr freundlich.', exEs: 'El conductor del autobús es siempre muy amable.' },
            { de: 'der Schauspieler / die Schauspielerin', es: 'el actor / la actriz', ex: 'Meine Cousine ist Schauspielerin am Theater.', exEs: 'Mi prima es actriz en el teatro.' },
            { de: 'der Bauarbeiter / die Bauarbeiterin', es: 'el obrero / la obrera de la construcción', ex: 'Die Bauarbeiter fangen schon um sechs an.', exEs: 'Los obreros empiezan ya a las seis.' },
            { de: 'die Kasse', es: 'la caja', ex: 'Bitte zahlen Sie an der Kasse zwei.', exEs: 'Pague en la caja dos, por favor.' },
            { de: 'der Computer', es: 'el ordenador', ex: 'Mein Computer ist heute sehr langsam.', exEs: 'Mi ordenador va hoy muy lento.' },
            { de: 'der Drucker', es: 'la impresora', ex: 'Der Drucker im Büro funktioniert nicht.', exEs: 'La impresora de la oficina no funciona.' },
            { de: 'die Maus', es: 'el ratón', ex: 'Die Maus vom Laptop ist kaputt.', exEs: 'El ratón del portátil está roto.' },
            { de: 'die Tastatur', es: 'el teclado', ex: 'Auf der Tastatur fehlt ein Buchstabe.', exEs: 'En el teclado falta una letra.' },
            { de: 'der Kalender', es: 'el calendario', ex: 'Der Termin steht schon im Kalender.', exEs: 'La cita ya está en el calendario.' },
            { de: 'der Zettel', es: 'la nota, el papel', ex: 'Ich schreibe dir einen Zettel.', exEs: 'Te escribo una nota.' }
          ]
        },
        {
          thema: 'Betrieb & Werkstatt',
          items: [
            { de: 'der Lohn', es: 'el salario', ex: 'Der Lohn kommt immer am Fünfzehnten.', exEs: 'El salario llega siempre el día quince.' },
            { de: 'die Werkstatt', es: 'el taller', ex: 'In der Werkstatt ist es sehr laut.', exEs: 'En el taller hay mucho ruido.' },
            { de: 'das Lager', es: 'el almacén', ex: 'Im Lager stapeln sich die Pakete.', exEs: 'En el almacén se amontonan los paquetes.' },
            { de: 'die Baustelle', es: 'la obra', ex: 'Die Baustelle beginnt schon um sechs Uhr.', exEs: 'La obra empieza ya a las seis.' },
            { de: 'die Maschine', es: 'la máquina', ex: 'Die Maschine läuft schon seit Stunden.', exEs: 'La máquina lleva horas funcionando.' },
            { de: 'der Schreibtisch', es: 'el escritorio', ex: 'Auf meinem Schreibtisch liegt zu viel Papier.', exEs: 'En mi escritorio hay demasiado papel.' },
            { de: 'die Schublade', es: 'el cajón', ex: 'Die Schublade lässt sich nicht öffnen.', exEs: 'El cajón no se abre.' },
            { de: 'das Telefon', es: 'el teléfono', ex: 'Das Telefon klingelt seit fünf Minuten.', exEs: 'El teléfono lleva cinco minutos sonando.' },
            { de: 'die Notiz', es: 'la nota', ex: 'Ich mache mir schnell eine Notiz.', exEs: 'Me apunto rápido una nota.' },
            { de: 'der Eingang', es: 'la entrada', ex: 'Der Eingang ist auf der anderen Seite.', exEs: 'La entrada está al otro lado.' },
            { de: 'der Lehrling', es: 'el aprendiz', ex: 'Der Lehrling ist erst seit einem Monat da.', exEs: 'El aprendiz solo lleva un mes aquí.' },
            { de: 'die Bezahlung', es: 'la remuneración', ex: 'Die Bezahlung ist besser als im alten Job.', exEs: 'La remuneración es mejor que en el trabajo anterior.' },
            { de: 'der Dienstplan', es: 'el cuadrante', ex: 'Der Dienstplan hängt in der Küche.', exEs: 'El cuadrante está colgado en la cocina.' },
            { de: 'der Stress', es: 'el estrés', ex: 'Im Dezember haben wir viel Stress.', exEs: 'En diciembre tenemos mucho estrés.' },
            { de: 'selbstständig', es: 'autónomo', ex: 'Seit zwei Jahren bin ich selbstständig.', exEs: 'Desde hace dos años soy autónomo.' },
            { de: 'angestellt', es: 'asalariado', ex: 'Ich bin bei einer kleinen Firma angestellt.', exEs: 'Estoy empleado en una empresa pequeña.' },
            { de: 'verdienen', es: 'ganar (dinero)', ex: 'Sie verdient gut in dieser Branche.', exEs: 'Ella gana bien en ese sector.' },
            { de: 'der Betrieb', es: 'la empresa, el negocio', ex: 'Der Betrieb hat dreißig Mitarbeiter.', exEs: 'La empresa tiene treinta empleados.' },
            { de: 'der Mitarbeiter', es: 'el empleado', ex: 'Jeder Mitarbeiter bekommt einen Schlüssel.', exEs: 'Cada empleado recibe una llave.' },
            { de: 'die Uniform', es: 'el uniforme', ex: 'Im Krankenhaus trägt man eine Uniform.', exEs: 'En el hospital se lleva uniforme.' }
          ]
        },
        {
          thema: 'Aufträge & Büromaterial',
          items: [
            { de: 'die Bestellung', es: 'el pedido', ex: 'Die Bestellung geht heute noch raus.', exEs: 'El pedido sale hoy mismo.' },
            { de: 'der Auftrag', es: 'el encargo', ex: 'Wir haben einen großen Auftrag bekommen.', exEs: 'Hemos recibido un encargo grande.' },
            { de: 'die Zentrale', es: 'la central', ex: 'Die Zentrale ist in Salzburg.', exEs: 'La central está en Salzburgo.' },
            { de: 'die Filiale', es: 'la sucursal', ex: 'Unsere Filiale in Linz schließt im Juni.', exEs: 'Nuestra sucursal de Linz cierra en junio.' },
            { de: 'der Konferenzraum', es: 'la sala de conferencias', ex: 'Der Konferenzraum ist im ersten Stock.', exEs: 'La sala de conferencias está en el primer piso.' },
            { de: 'die Tagesordnung', es: 'el orden del día', ex: 'Die Tagesordnung steht in der Mail.', exEs: 'El orden del día está en el correo.' },
            { de: 'der Locher', es: 'la perforadora', ex: 'Der Locher liegt im Schrank.', exEs: 'La perforadora está en el armario.' },
            { de: 'der Hefter', es: 'la grapadora', ex: 'Der Hefter ist schon wieder kaputt.', exEs: 'La grapadora está rota otra vez.' },
            { de: 'die Büroklammer', es: 'el clip', ex: 'Nimm eine Büroklammer für die Blätter.', exEs: 'Coge un clip para las hojas.' },
            { de: 'der Papierkorb', es: 'la papelera', ex: 'Der Papierkorb ist schon wieder voll.', exEs: 'La papelera está llena otra vez.' },
            { de: 'der Kopierer', es: 'la fotocopiadora', ex: 'Der Kopierer steht draußen im Gang.', exEs: 'La fotocopiadora está fuera en el pasillo.' },
            { de: 'die Software', es: 'el software', ex: 'Die Software ist neu und ziemlich langsam.', exEs: 'El software es nuevo y bastante lento.' },
            { de: 'der Zugang', es: 'el acceso', ex: 'Ohne Zugang kommst du nicht ins System.', exEs: 'Sin acceso no entras en el sistema.' },
            { de: 'die Datenbank', es: 'la base de datos', ex: 'Alle Adressen stehen in der Datenbank.', exEs: 'Todas las direcciones están en la base de datos.' },
            { de: 'die Statistik', es: 'la estadística', ex: 'Die Statistik zeigt einen klaren Trend.', exEs: 'La estadística muestra una tendencia clara.' },
            { de: 'das Ergebnis', es: 'el resultado', ex: 'Das Ergebnis war besser als erwartet.', exEs: 'El resultado fue mejor de lo esperado.' },
            { de: 'der Lieferant', es: 'el proveedor', ex: 'Der Lieferant kommt jeden Dienstag.', exEs: 'El proveedor viene todos los martes.' },
            { de: 'der Anruf', es: 'la llamada', ex: 'Der Anruf kam um acht Uhr früh.', exEs: 'La llamada llegó a las ocho de la mañana.' },
            { de: 'die Vorbereitung', es: 'la preparación', ex: 'Die Vorbereitung hat drei Tage gedauert.', exEs: 'La preparación duró tres días.' }
          ]
        },
        {
          thema: 'Bei der Arbeit: Verben',
          items: [
            { de: 'anfangen', es: 'empezar', ex: 'Ich fange um halb acht an.', exEs: 'Empiezo a las siete y media.' },
            { de: 'aufhören', es: 'terminar, dejar de', ex: 'Wann hörst du heute auf?', exEs: '¿A qué hora terminas hoy?' },
            { de: 'sich bewerben', es: 'presentar una solicitud', ex: 'Ich bewerbe mich bei einer Firma im Zentrum.', exEs: 'Me presento a una empresa del centro.' },
            { de: 'kündigen', es: 'dimitir, despedir', ex: 'Sie hat nach zwei Jahren gekündigt.', exEs: 'Dimitió después de dos años.' },
            { de: 'organisieren', es: 'organizar', ex: 'Wer organisiert die Besprechung?', exEs: '¿Quién organiza la reunión?' },
            { de: 'telefonieren', es: 'hablar por teléfono', ex: 'Ich telefoniere gerade mit einem Kunden.', exEs: 'Estoy hablando por teléfono con un cliente.' },
            { de: 'drucken', es: 'imprimir', ex: 'Können Sie das bitte zweimal drucken?', exEs: '¿Puede imprimir esto dos veces, por favor?' },
            { de: 'kopieren', es: 'fotocopiar', ex: 'Ich kopiere schnell den Vertrag.', exEs: 'Fotocopio rápido el contrato.' },
            { de: 'reparieren', es: 'reparar', ex: 'Der Techniker repariert den Drucker.', exEs: 'El técnico repara la impresora.' },
            { de: 'bedienen', es: 'atender, manejar', ex: 'Sie bedient die Kunden an der Kasse.', exEs: 'Atiende a los clientes en la caja.' }
          ]
        },
        {
          thema: 'Arbeit: Adjektive',
          items: [
            { de: 'anstrengend', es: 'cansado, duro', ex: 'Die Schicht war heute sehr anstrengend.', exEs: 'Hoy el turno ha sido muy duro.' },
            { de: 'langweilig', es: 'aburrido', ex: 'Die Besprechung war ziemlich langweilig.', exEs: 'La reunión fue bastante aburrida.' },
            { de: 'spannend', es: 'interesante, emocionante', ex: 'Das neue Projekt ist wirklich spannend.', exEs: 'El proyecto nuevo es muy interesante.' },
            { de: 'pünktlich', es: 'puntual', ex: 'Sie ist immer pünktlich im Büro.', exEs: 'Siempre llega puntual a la oficina.' },
            { de: 'zuverlässig', es: 'de fiar', ex: 'Er ist ein zuverlässiger Kollege.', exEs: 'Es un compañero de fiar.' },
            { de: 'erfahren', es: 'con experiencia', ex: 'Wir suchen eine erfahrene Technikerin.', exEs: 'Buscamos una técnica con experiencia.' },
            { de: 'müde', es: 'cansado', ex: 'Nach der Arbeit bin ich immer müde.', exEs: 'Después del trabajo siempre estoy cansado.' },
            { de: 'zufrieden', es: 'satisfecho, contento', ex: 'Der Chef war mit dem Ergebnis zufrieden.', exEs: 'El jefe quedó satisfecho con el resultado.' },
            { de: 'gestresst', es: 'estresado', ex: 'Am Monatsende sind alle gestresst.', exEs: 'A final de mes todos están estresados.' }
          ]
        }
      ],
      grammatik: [
        {
          regel: 'definiter Artikel Singular',
          erklaerung: 'der (masculino), die (femenino), das (neutro). Hay que aprender el artículo con la palabra.',
          beispiele: [
            { de: 'der Tisch, die Tasche, das Buch', es: 'la mesa, el bolso, el libro' }
          ]
        },
        {
          regel: 'Personalpronomen Singular (er/sie/es für Nomen)',
          erklaerung: 'El pronombre sigue el género del sustantivo: der → er, die → sie, das → es.',
          beispiele: [
            { de: 'Wo ist der Schlüssel? – Er ist hier.', es: '¿Dónde está la llave? – Está aquí.' },
            { de: 'Wo ist die Brille? – Sie ist da.', es: '¿Dónde están las gafas? – Están ahí.' }
          ]
        },
        {
          regel: 'arbeiten',
          erklaerung: 'Raíz en -t/-d: se añade una -e- antes de la terminación (du arbeitest, er arbeitet).',
          beispiele: [
            { de: 'Du arbeitest in einem Büro.', es: 'Trabajas en una oficina.' }
          ]
        },
        {
          regel: 'Wortbildung -in',
          erklaerung: 'El femenino de profesiones se forma con -in (a veces con Umlaut): Koch → Köchin.',
          beispiele: [
            { de: 'der Lehrer → die Lehrerin', es: 'el profesor → la profesora' }
          ]
        },
        {
          regel: 'als + Beziehungswort',
          erklaerung: 'Con "als" (= como) la profesión va SIN artículo.',
          beispiele: [
            { de: 'Ich arbeite als Kellner.', es: 'Trabajo de camarero.' }
          ]
        },
        {
          regel: 'Präposition bei',
          erklaerung: '"bei" + empresa/persona: dónde trabajas.',
          beispiele: [
            { de: 'Sie arbeitet bei Siemens.', es: 'Ella trabaja en Siemens.' }
          ]
        },
        {
          regel: 'Negation nicht',
          erklaerung: '"nicht" niega el verbo o toda la frase y va al final (o antes del complemento negado).',
          beispiele: [
            { de: 'Ich arbeite nicht.', es: 'No trabajo.' },
            { de: 'Das ist nicht mein Kuli.', es: 'Ese no es mi boli.' }
          ]
        },
        {
          key: 'aussprache-z-s-ss',
          regel: 'Aussprache: z, s, ß',
          erklaerung: 'La "z" es siempre «ts»: Zeit = «tsait». La "s" antes de vocal es sonora, zumbada: Sonne. Al final de palabra se ensordece: das. La "ß" es siempre sorda y alarga la vocal de delante (Straße); la "ss" la acorta (Fluss).',
          beispiele: [
            { de: 'Die Zeit vergeht schnell.', es: 'El tiempo pasa rápido. («tsait»)' },
            { de: 'Die Sonne scheint.', es: 'Hace sol. ("s" sonora)' },
            { de: 'Die Straße ist groß.', es: 'La calle es ancha. ("ß" sorda, vocal larga)' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'fragen, wo Gegenstände sind',
          es: 'Preguntar dónde están los objetos',
          wendungen: [
            { de: 'Wo ist der Kuli? – Hier. / Da drüben.', es: '¿Dónde está el boli? – Aquí. / Ahí enfrente.' }
          ]
        },
        {
          funktion: 'Räume und Geräte im Gebäude suchen',
          es: 'Buscar salas y aparatos en el edificio',
          wendungen: [
            { de: 'Entschuldigung, wo finde ich Zimmer zwölf?', es: 'Perdone, ¿dónde está la sala doce?' }
          ]
        },
        {
          funktion: 'nach dem Beruf fragen',
          es: 'Preguntar por la profesión',
          wendungen: [
            { de: 'Was sind Sie von Beruf? – Ich bin Ärztin.', es: '¿A qué se dedica? – Soy médica.' }
          ]
        },
        {
          funktion: 'über die berufliche Situation sprechen',
          es: 'Hablar de la situación laboral',
          wendungen: [
            { de: 'Ich suche gerade Arbeit.', es: 'Ahora mismo estoy buscando trabajo.' }
          ]
        },
        {
          funktion: 'über Arbeitsbedingungen sprechen',
          es: 'Hablar de las condiciones laborales',
          wendungen: [
            { de: 'Wie viele Stunden arbeitest du pro Woche?', es: '¿Cuántas horas trabajas a la semana?' }
          ]
        },
        {
          funktion: 'über Arbeitszeiten sprechen',
          es: 'Hablar de los horarios de trabajo',
          wendungen: [
            { de: 'Wann fängst du morgens an?', es: '¿A qué hora empiezas por la mañana?' }
          ]
        },
        {
          funktion: 'am Arbeitsplatz zusammenarbeiten',
          es: 'Colaborar en el trabajo',
          wendungen: [
            { de: 'Kannst du mir kurz helfen?', es: '¿Me puedes ayudar un momento?' }
          ]
        },
        {
          funktion: 'zustimmen und widersprechen',
          es: 'Dar la razón y llevar la contraria',
          wendungen: [
            { de: 'Ja, stimmt. · Genau.', es: 'Sí, es cierto. · Exacto.' }
          ]
        }
      ]
    },

    {
      id: 'a11-l4',
      nr: 4,
      name: 'Das ist meine Familie.',
      woerter: [
        {
          thema: 'Familie',
          items: [
            { de: 'die Mutter', es: 'la madre', ex: 'Meine Mutter kocht sehr gut.', exEs: 'Mi madre cocina muy bien.' },
            { de: 'der Vater', es: 'el padre', ex: 'Mein Vater ist schon in Pension.', exEs: 'Mi padre ya está jubilado.' },
            { de: 'die Eltern', es: 'los padres', ex: 'Meine Eltern wohnen in Bonn.', exEs: 'Mis padres viven en Bonn.' },
            { de: 'die Tochter', es: 'la hija', ex: 'Ihre Tochter geht schon in die Schule.', exEs: 'Su hija ya va al colegio.' },
            { de: 'der Sohn', es: 'el hijo', ex: 'Der Sohn wohnt noch zu Hause.', exEs: 'El hijo todavía vive en casa.' },
            { de: 'die Kinder', es: 'los hijos / los niños', ex: 'Die Kinder spielen im Hof.', exEs: 'Los niños juegan en el patio.' },
            { de: 'die Schwester', es: 'la hermana', ex: 'Meine Schwester ist zwei Jahre älter.', exEs: 'Mi hermana es dos años mayor.' },
            { de: 'der Bruder', es: 'el hermano', ex: 'Mein Bruder wohnt in Madrid.', exEs: 'Mi hermano vive en Madrid.' },
            { de: 'die Geschwister', es: 'los hermanos', ex: 'Hast du Geschwister?', exEs: '¿Tienes hermanos?' },
            { de: 'die Oma / die Großmutter', es: 'la abuela', ex: 'Meine Oma wird im Mai neunzig.', exEs: 'Mi abuela cumple noventa en mayo.' },
            { de: 'der Opa / der Großvater', es: 'el abuelo', ex: 'Der Opa erzählt gern alte Geschichten.', exEs: 'Al abuelo le gusta contar batallitas.' },
            { de: 'die Tante', es: 'la tía', ex: 'Meine Tante besucht uns oft.', exEs: 'Mi tía nos visita a menudo.' },
            { de: 'der Onkel', es: 'el tío', ex: 'Mein Onkel hat einen kleinen Bauernhof.', exEs: 'Mi tío tiene una granja pequeña.' },
            { de: 'die Cousine / der Cousin', es: 'la prima / el primo', ex: 'Meine Cousine heiratet im Sommer.', exEs: 'Mi prima se casa en verano.' },
            { de: 'der Neffe / die Nichte', es: 'el sobrino / la sobrina', ex: 'Meine Nichte ist gerade zwei geworden.', exEs: 'Mi sobrina acaba de cumplir dos años.' },
            { de: 'der Enkel / die Enkelin', es: 'el nieto / la nieta', ex: 'Sie hat schon drei Enkel.', exEs: 'Ya tiene tres nietos.' },
            { de: 'die Großeltern', es: 'los abuelos', ex: 'Meine Großeltern wohnen auf dem Land.', exEs: 'Mis abuelos viven en el campo.' },
            { de: 'die Schwiegermutter', es: 'la suegra', ex: 'Meine Schwiegermutter kocht fantastisch.', exEs: 'Mi suegra cocina de maravilla.' },
            { de: 'der Schwiegervater', es: 'el suegro', ex: 'Mein Schwiegervater ist Tischler.', exEs: 'Mi suegro es carpintero.' },
            { de: 'die Verwandten', es: 'los parientes', ex: 'Zu Weihnachten kommen alle Verwandten.', exEs: 'En Navidad vienen todos los parientes.' },
            { de: 'das Baby', es: 'el bebé', ex: 'Das Baby schläft schon durch.', exEs: 'El bebé ya duerme del tirón.' },
            { de: 'der Zwilling', es: 'el gemelo', ex: 'Meine Brüder sind Zwillinge.', exEs: 'Mis hermanos son gemelos.' },
            { de: 'der / die Älteste', es: 'el mayor / la mayor', ex: 'Ich bin die Älteste von vier Geschwistern.', exEs: 'Soy la mayor de cuatro hermanos.' },
            { de: 'der / die Jüngste', es: 'el menor / la menor', ex: 'Der Jüngste geht noch in den Kindergarten.', exEs: 'El pequeño todavía va a la guardería.' },
            { de: 'heiraten', es: 'casarse', ex: 'Meine Cousine heiratet im Juni.', exEs: 'Mi prima se casa en junio.' },
            { de: 'die Hochzeit', es: 'la boda', ex: 'Zur Hochzeit kommen sechzig Leute.', exEs: 'A la boda vienen sesenta personas.' }
          ]
        },
        {
          thema: 'Familienstand (II)',
          items: [
            { de: 'die Frau (Ehefrau)', es: 'la mujer / la esposa', ex: 'Seine Frau arbeitet bei der Bank.', exEs: 'Su mujer trabaja en el banco.' },
            { de: 'der Mann (Ehemann)', es: 'el marido', ex: 'Ihr Mann holt die Kinder ab.', exEs: 'Su marido recoge a los niños.' },
            { de: 'die Partnerin / der Partner', es: 'la pareja', ex: 'Mein Partner kocht besser als ich.', exEs: 'Mi pareja cocina mejor que yo.' },
            { de: 'getrennt', es: 'separado/a', ex: 'Sie leben seit einem Jahr getrennt.', exEs: 'Llevan un año separados.' },
            { de: 'alleinerziehend', es: 'que cría en solitario', ex: 'Sie ist alleinerziehend mit zwei Kindern.', exEs: 'Cría sola a dos hijos.' }
          ]
        },
        {
          thema: 'Über Menschen sprechen',
          items: [
            { de: 'der Name', es: 'el nombre', ex: 'Wie ist Ihr Name, bitte?', exEs: '¿Cuál es su nombre, por favor?' },
            { de: 'das Alter', es: 'la edad', ex: 'Das Alter steht nicht im Ausweis.', exEs: 'La edad no viene en el carné.' },
            { de: 'jung / alt', es: 'joven / mayor', ex: 'Mein Bruder ist drei Jahre jünger.', exEs: 'Mi hermano es tres años menor.' },
            { de: 'groß / klein', es: 'alto / bajo', ex: 'Meine Schwester ist größer als ich.', exEs: 'Mi hermana es más alta que yo.' },
            { de: 'nett / freundlich', es: 'simpático / amable', ex: 'Seine Eltern sind sehr freundlich.', exEs: 'Sus padres son muy amables.' },
            { de: 'lustig', es: 'divertido', ex: 'Mein Onkel ist wirklich lustig.', exEs: 'Mi tío es la mar de divertido.' },
            { de: 'ruhig', es: 'tranquilo', ex: 'Mein Vater ist ein ruhiger Mensch.', exEs: 'Mi padre es una persona tranquila.' },
            { de: 'zusammen wohnen', es: 'vivir juntos', ex: 'Wir wohnen seit zwei Jahren zusammen.', exEs: 'Vivimos juntos desde hace dos años.' },
            { de: 'der Freund / die Freundin', es: 'el novio / la novia', ex: 'Ihre Freundin kommt aus Polen.', exEs: 'Su novia es de Polonia.' },
            { de: 'die Familie besuchen', es: 'visitar a la familia', ex: 'Im Sommer besuche ich meine Familie.', exEs: 'En verano visito a mi familia.' },
            { de: 'das Foto zeigen', es: 'enseñar la foto', ex: 'Zeig mir mal ein Foto von deiner Familie!', exEs: '¡Enséñame una foto de tu familia!' }
          ]
        },
        {
          thema: 'Familie & Zusammenleben',
          items: [
            { de: 'der Schwiegersohn', es: 'el yerno', ex: 'Mein Schwiegersohn kocht sehr gut.', exEs: 'Mi yerno cocina muy bien.' },
            { de: 'die Schwiegertochter', es: 'la nuera', ex: 'Die Schwiegertochter kommt aus Ungarn.', exEs: 'La nuera es de Hungría.' },
            { de: 'der Stiefvater', es: 'el padrastro', ex: 'Mein Stiefvater wohnt in Linz.', exEs: 'Mi padrastro vive en Linz.' },
            { de: 'die Stiefmutter', es: 'la madrastra', ex: 'Meine Stiefmutter ist sehr nett.', exEs: 'Mi madrastra es muy simpática.' },
            { de: 'das Einzelkind', es: 'el hijo único', ex: 'Ich bin Einzelkind und habe keine Geschwister.', exEs: 'Soy hijo único y no tengo hermanos.' },
            { de: 'die Familienfeier', es: 'la fiesta familiar', ex: 'Am Samstag ist eine große Familienfeier.', exEs: 'El sábado hay una gran fiesta familiar.' },
            { de: 'das Ehepaar', es: 'el matrimonio', ex: 'Das Ehepaar wohnt seit dreißig Jahren hier.', exEs: 'El matrimonio vive aquí desde hace treinta años.' },
            { de: 'die Scheidung', es: 'el divorcio', ex: 'Nach der Scheidung ist sie umgezogen.', exEs: 'Después del divorcio se mudó.' },
            { de: 'schwanger', es: 'embarazada', ex: 'Meine Schwester ist im dritten Monat schwanger.', exEs: 'Mi hermana está embarazada de tres meses.' },
            { de: 'adoptiert', es: 'adoptado', ex: 'Der kleine Junge ist adoptiert.', exEs: 'El niño pequeño es adoptado.' },
            { de: 'verlobt', es: 'prometido', ex: 'Wir sind seit Mai verlobt.', exEs: 'Estamos prometidos desde mayo.' },
            { de: 'die Geburt', es: 'el nacimiento', ex: 'Nach der Geburt war sie sehr müde.', exEs: 'Después del parto estaba muy cansada.' },
            { de: 'das Enkelkind', es: 'el nieto / la nieta', ex: 'Wir haben schon vier Enkelkinder.', exEs: 'Ya tenemos cuatro nietos.' },
            { de: 'der Haushalt', es: 'la casa, las tareas del hogar', ex: 'Im Haushalt helfen bei uns alle mit.', exEs: 'En casa todos ayudamos con las tareas.' },
            { de: 'sich kümmern um', es: 'ocuparse de', ex: 'Ich kümmere mich um meine Oma.', exEs: 'Me ocupo de mi abuela.' },
            { de: 'streiten', es: 'discutir', ex: 'Meine Brüder streiten fast jeden Tag.', exEs: 'Mis hermanos discuten casi todos los días.' },
            { de: 'sich vertragen', es: 'llevarse bien, hacer las paces', ex: 'Die Kinder vertragen sich schon wieder.', exEs: 'Los niños ya se llevan bien otra vez.' },
            { de: 'ähnlich', es: 'parecido', ex: 'Du siehst deiner Mutter sehr ähnlich.', exEs: 'Te pareces mucho a tu madre.' },
            { de: 'verwandt', es: 'emparentado', ex: 'Wir sind nicht verwandt, nur gute Freunde.', exEs: 'No somos parientes, solo buenos amigos.' },
            { de: 'die Beziehung', es: 'la relación', ex: 'Die Beziehung zu meinem Vater ist gut.', exEs: 'La relación con mi padre es buena.' }
          ]
        },
        {
          thema: 'Familie über Generationen',
          items: [
            { de: 'die Urgroßmutter', es: 'la bisabuela', ex: 'Meine Urgroßmutter wurde neunundneunzig Jahre alt.', exEs: 'Mi bisabuela llegó a los noventa y nueve años.' },
            { de: 'der Urgroßvater', es: 'el bisabuelo', ex: 'Mein Urgroßvater kam aus Italien.', exEs: 'Mi bisabuelo vino de Italia.' },
            { de: 'der Pate', es: 'el padrino', ex: 'Mein Onkel ist auch mein Pate.', exEs: 'Mi tío es también mi padrino.' },
            { de: 'die Patin', es: 'la madrina', ex: 'Die Patin schenkt ihr jedes Jahr ein Buch.', exEs: 'La madrina le regala un libro cada año.' },
            { de: 'das Familienfoto', es: 'la foto de familia', ex: 'Auf dem Familienfoto fehlt nur mein Bruder.', exEs: 'En la foto de familia solo falta mi hermano.' },
            { de: 'der Stammbaum', es: 'el árbol genealógico', ex: 'Der Stammbaum hängt bei meiner Oma.', exEs: 'El árbol genealógico está colgado en casa de mi abuela.' },
            { de: 'die Generation', es: 'la generación', ex: 'Drei Generationen leben in einem Haus.', exEs: 'Tres generaciones viven en una casa.' },
            { de: 'erziehen', es: 'educar', ex: 'Meine Eltern haben uns sehr streng erzogen.', exEs: 'Mis padres nos educaron muy estrictamente.' },
            { de: 'aufwachsen', es: 'criarse', ex: 'Ich bin auf dem Land aufgewachsen.', exEs: 'Me crie en el campo.' },
            { de: 'der Charakter', es: 'el carácter', ex: 'Sein Charakter ist wie der des Vaters.', exEs: 'Su carácter es como el del padre.' },
            { de: 'das Vertrauen', es: 'la confianza', ex: 'Zwischen uns gibt es viel Vertrauen.', exEs: 'Entre nosotros hay mucha confianza.' },
            { de: 'der Streit', es: 'la discusión', ex: 'Nach dem Streit haben wir lange geschwiegen.', exEs: 'Después de la discusión estuvimos mucho tiempo callados.' },
            { de: 'zusammenhalten', es: 'mantenerse unidos', ex: 'In der Krise halten wir zusammen.', exEs: 'En la crisis nos mantenemos unidos.' },
            { de: 'unterstützen', es: 'apoyar', ex: 'Meine Familie unterstützt mich immer.', exEs: 'Mi familia siempre me apoya.' },
            { de: 'das Familientreffen', es: 'la reunión familiar', ex: 'Das Familientreffen ist immer im August.', exEs: 'La reunión familiar es siempre en agosto.' },
            { de: 'der Spitzname', es: 'el apodo', ex: 'Mein Spitzname ist seit der Schule Lupo.', exEs: 'Mi apodo desde el colegio es Lupo.' },
            { de: 'der Jahrestag', es: 'el aniversario', ex: 'Morgen ist unser zehnter Jahrestag.', exEs: 'Mañana es nuestro décimo aniversario.' },
            { de: 'das Erbe', es: 'la herencia', ex: 'Über das Erbe hat die Familie gestritten.', exEs: 'Por la herencia la familia discutió.' },
            { de: 'der Witwer', es: 'el viudo', ex: 'Der Witwer lebt jetzt allein.', exEs: 'El viudo vive ahora solo.' },
            { de: 'die Witwe', es: 'la viuda', ex: 'Die Witwe wohnt im Haus nebenan.', exEs: 'La viuda vive en la casa de al lado.' }
          ]
        },
        {
          thema: 'Lebensalter & Beziehungen',
          items: [
            { de: 'der Säugling', es: 'el bebé lactante', ex: 'Der Säugling schläft fast den ganzen Tag.', exEs: 'El bebé duerme casi todo el día.' },
            { de: 'das Kleinkind', es: 'el niño pequeño', ex: 'Mit einem Kleinkind wird alles langsamer.', exEs: 'Con un niño pequeño todo va más lento.' },
            { de: 'der Jugendliche', es: 'el adolescente', ex: 'Der Jugendliche ist selten zu Hause.', exEs: 'El adolescente está poco en casa.' },
            { de: 'der Erwachsene', es: 'el adulto', ex: 'Jeder Erwachsene zahlt zehn Euro.', exEs: 'Cada adulto paga diez euros.' },
            { de: 'der Senior', es: 'el mayor', ex: 'Mein Vater ist jetzt Senior.', exEs: 'Mi padre ya es mayor.' },
            { de: 'die Kindheit', es: 'la infancia', ex: 'Meine Kindheit war sehr glücklich.', exEs: 'Mi infancia fue muy feliz.' },
            { de: 'die Jugend', es: 'la juventud', ex: 'In meiner Jugend war alles anders.', exEs: 'En mi juventud todo era distinto.' },
            { de: 'der Ruhestand', es: 'la jubilación', ex: 'Mein Vater ist seit Mai im Ruhestand.', exEs: 'Mi padre está jubilado desde mayo.' },
            { de: 'die Pflege', es: 'el cuidado', ex: 'Die Pflege der Oma teilen wir uns.', exEs: 'El cuidado de la abuela nos lo repartimos.' },
            { de: 'die Nähe', es: 'la cercanía', ex: 'Die Nähe zur Familie ist mir wichtig.', exEs: 'La cercanía con la familia me importa.' },
            { de: 'der Kontakt', es: 'el contacto', ex: 'Der Kontakt zu meiner Tante ist eng.', exEs: 'El contacto con mi tía es estrecho.' },
            { de: 'die Rolle', es: 'el papel', ex: 'In der Familie hat jeder seine Rolle.', exEs: 'En la familia cada uno tiene su papel.' },
            { de: 'die Pflicht', es: 'la obligación', ex: 'Das ist keine Pflicht, sondern ein Wunsch.', exEs: 'Eso no es una obligación, sino un deseo.' },
            { de: 'der Rat', es: 'el consejo', ex: 'Der Rat meiner Mutter war sehr gut.', exEs: 'El consejo de mi madre fue muy bueno.' },
            { de: 'die Sorge', es: 'la preocupación', ex: 'Die Sorge um die Kinder hört nie auf.', exEs: 'La preocupación por los hijos no acaba nunca.' },
            { de: 'das Missverständnis', es: 'el malentendido', ex: 'Das war nur ein Missverständnis.', exEs: 'Solo fue un malentendido.' },
            { de: 'die Versöhnung', es: 'la reconciliación', ex: 'Nach der Versöhnung war alles leichter.', exEs: 'Después de la reconciliación todo fue más fácil.' },
            { de: 'die Gewohnheit', es: 'la costumbre', ex: 'Das gemeinsame Essen ist eine alte Gewohnheit.', exEs: 'Comer juntos es una vieja costumbre.' },
            { de: 'die Ähnlichkeit', es: 'el parecido', ex: 'Die Ähnlichkeit ist wirklich erstaunlich.', exEs: 'El parecido es realmente asombroso.' }
          ]
        },
        {
          thema: 'Menschen beschreiben',
          items: [
            { de: 'blond', es: 'rubio', ex: 'Meine Schwester ist blond, ich nicht.', exEs: 'Mi hermana es rubia, yo no.' },
            { de: 'schlank', es: 'delgado', ex: 'Mein Bruder ist groß und schlank.', exEs: 'Mi hermano es alto y delgado.' },
            { de: 'sportlich', es: 'deportista', ex: 'Mein Vater ist mit sechzig noch sehr sportlich.', exEs: 'Mi padre, con sesenta años, sigue siendo muy deportista.' },
            { de: 'hübsch', es: 'guapo, mono', ex: 'Auf dem Foto sieht sie sehr hübsch aus.', exEs: 'En la foto sale muy guapa.' },
            { de: 'ernst', es: 'serio', ex: 'Mein Opa wirkt ernst, ist aber sehr lustig.', exEs: 'Mi abuelo parece serio, pero es muy divertido.' },
            { de: 'schüchtern', es: 'tímido', ex: 'Als Kind war ich ziemlich schüchtern.', exEs: 'De niño era bastante tímido.' },
            { de: 'geduldig', es: 'paciente', ex: 'Meine Mutter ist unglaublich geduldig.', exEs: 'Mi madre es increíblemente paciente.' },
            { de: 'ordentlich', es: 'ordenado', ex: 'Meine Schwester ist viel ordentlicher als ich.', exEs: 'Mi hermana es mucho más ordenada que yo.' },
            { de: 'neugierig', es: 'curioso', ex: 'Die Kleine ist sehr neugierig und fragt alles.', exEs: 'La peque es muy curiosa y lo pregunta todo.' },
            { de: 'ehrlich', es: 'sincero, honesto', ex: 'Sag mir ehrlich, was du denkst.', exEs: 'Dime sinceramente lo que piensas.' }
          ]
        },
        {
          thema: 'Familie: Verben',
          items: [
            { de: 'sich verstehen', es: 'llevarse bien', ex: 'Wir verstehen uns sehr gut.', exEs: 'Nos llevamos muy bien.' },
            { de: 'anrufen', es: 'llamar por teléfono', ex: 'Sonntags rufe ich meine Eltern an.', exEs: 'Los domingos llamo a mis padres.' },
            { de: 'vermissen', es: 'echar de menos', ex: 'Ich vermisse meine Familie besonders im Winter.', exEs: 'Echo de menos a mi familia sobre todo en invierno.' },
            { de: 'sich freuen', es: 'alegrarse', ex: 'Ich freue mich auf den Besuch meiner Schwester.', exEs: 'Me hace ilusión la visita de mi hermana.' },
            { de: 'aufpassen auf', es: 'cuidar de', ex: 'Am Samstag passe ich auf meinen Neffen auf.', exEs: 'El sábado cuido de mi sobrino.' },
            { de: 'schenken', es: 'regalar', ex: 'Zum Geburtstag schenke ich ihr ein Buch.', exEs: 'Por su cumpleaños le regalo un libro.' },
            { de: 'feiern', es: 'celebrar', ex: 'Wir feiern Weihnachten immer zu Hause.', exEs: 'La Navidad la celebramos siempre en casa.' },
            { de: 'umarmen', es: 'abrazar', ex: 'Am Bahnhof umarmt sie ihre Mutter.', exEs: 'En la estación abraza a su madre.' },
            { de: 'zusammenleben', es: 'convivir', ex: 'Meine Großeltern leben seit fünfzig Jahren zusammen.', exEs: 'Mis abuelos llevan cincuenta años conviviendo.' }
          ]
        }
      ],
      grammatik: [
        {
          regel: 'Genitiv bei Namen',
          erklaerung: 'Con nombres propios se añade -s (sin apóstrofo): Marias Bruder.',
          beispiele: [
            { de: 'Das ist Ahmets Familie.', es: 'Esta es la familia de Ahmet.' }
          ]
        },
        {
          regel: 'Possessivartikel Singular',
          erklaerung: 'mein/meine, dein/deine, sein/seine, ihr/ihre. Terminación -e ante femenino y plural.',
          beispiele: [
            { de: 'Das ist mein Bruder und meine Schwester.', es: 'Este es mi hermano y esta mi hermana.' },
            { de: 'Ist das dein Vater?', es: '¿Es ese tu padre?' }
          ]
        },
        {
          regel: 'indefiniter Artikel ein(e)',
          erklaerung: 'ein (der/das), eine (die). Se usa al mencionar algo por primera vez.',
          beispiele: [
            { de: 'Das ist ein Foto.', es: 'Esto es una foto.' },
            { de: 'Ich habe eine Schwester.', es: 'Tengo una hermana.' }
          ]
        },
        {
          regel: 'Negativartikel kein(e)',
          erklaerung: 'Niega sustantivos: kein Bruder, keine Kinder. (Con verbos se usa "nicht".)',
          beispiele: [
            { de: 'Ich habe keine Geschwister.', es: 'No tengo hermanos.' },
            { de: 'Das ist kein Problem.', es: 'Eso no es un problema.' }
          ]
        },
        {
          regel: 'Konjunktionen und / oder',
          erklaerung: 'Unen palabras o frases sin cambiar el orden del verbo.',
          beispiele: [
            { de: 'Ich habe einen Sohn und eine Tochter.', es: 'Tengo un hijo y una hija.' },
            { de: 'Kommst du heute oder morgen?', es: '¿Vienes hoy o mañana?' }
          ]
        },
        {
          key: 'aussprache-umlaute',
          regel: 'Aussprache: ä, ö, ü',
          erklaerung: '"ä" suena como una "e". Para "ö" pon los labios de "o" y di "e". Para "ü", labios de "u" y di "i". No existen en español, así que hay que fabricarlas — y cambian el significado: schon (ya) no es schön (bonito).',
          beispiele: [
            { de: 'Das Mädchen ist spät.', es: 'La chica llega tarde. ("ä" = "e")' },
            { de: 'Die Wohnung ist schön.', es: 'El piso es bonito. ("ö")' },
            { de: 'Ich bin müde.', es: 'Estoy cansado. ("ü")' }
          ]
        },
        {
          key: 'von-statt-genitiv',
          regel: 'von + Dativ statt Genitiv',
          erklaerung: 'Para decir de quién es algo, en el día a día se usa von + dativo en vez del genitivo: der Bruder VON MEINER Mutter. Con nombres propios basta con -s: Annas Bruder.',
          beispiele: [
            { de: 'Das ist der Mann von meiner Schwester.', es: 'Este es el marido de mi hermana.' },
            { de: 'Die Tochter von Thomas ist schon zwölf.', es: 'La hija de Thomas ya tiene doce años.' }
          ]
        },
        {
          key: 'wie-alt-sein',
          regel: 'Das Alter: sein + Zahl',
          erklaerung: 'La edad va con SEIN, no con haben como en español: Ich BIN 32. Se puede añadir Jahre alt, pero no hace falta. La pregunta es Wie alt bist du? / Wie alt sind Sie?',
          beispiele: [
            { de: 'Wie alt ist deine Schwester?', es: '¿Cuántos años tiene tu hermana?' },
            { de: 'Mein Opa ist achtzig Jahre alt.', es: 'Mi abuelo tiene ochenta años.' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'nach der Familie fragen',
          es: 'Preguntar por la familia',
          wendungen: [
            { de: 'Hast du Geschwister? – Ja, zwei Brüder.', es: '¿Tienes hermanos? – Sí, dos hermanos.' }
          ]
        },
        {
          funktion: 'über Familienmitglieder berichten',
          es: 'Contar cosas sobre la familia',
          wendungen: [
            { de: 'Meine Eltern wohnen in Polen.', es: 'Mis padres viven en Polonia.' }
          ]
        },
        {
          funktion: 'Familienangehörige vorstellen',
          es: 'Presentar a familiares',
          wendungen: [
            { de: 'Darf ich vorstellen? Mein Mann.', es: '¿Me permite? Mi marido.' }
          ]
        },
        {
          funktion: 'etwas vermuten',
          es: 'Hacer suposiciones',
          wendungen: [
            { de: 'Ist das deine Schwester?', es: '¿Es esa tu hermana?' }
          ]
        },
        {
          funktion: 'nach Gegenständen und Besitz fragen',
          es: 'Preguntar por objetos y pertenencias',
          wendungen: [
            { de: 'Was ist das? – Das ist ein Foto.', es: '¿Qué es esto? – Es una foto.' }
          ]
        },
        {
          funktion: 'über Fotos sprechen',
          es: 'Hablar de fotografías',
          wendungen: [
            { de: 'Möchtest du ein paar Fotos sehen?', es: '¿Quieres ver algunas fotos?' }
          ]
        },
        {
          funktion: 'über das Zusammenleben sprechen',
          es: 'Hablar de la convivencia en casa',
          wendungen: [
            { de: 'Wer macht bei euch den Haushalt?', es: '¿Quién se ocupa de la casa en vuestro caso?' }
          ]
        },
        {
          funktion: 'Aufgaben im Haushalt aufteilen',
          es: 'Repartir tareas del hogar',
          wendungen: [
            { de: 'Wer putzt bei euch die Küche?', es: '¿Quién limpia la cocina en vuestra casa?' }
          ]
        }
      ]
    },

    {
      id: 'a11-l5',
      nr: 5,
      name: 'Wann hast du Zeit?',
      woerter: [
        {
          thema: 'Wochentage',
          items: [
            { de: 'der Montag', es: 'el lunes', ex: 'Am Montag habe ich frei.', exEs: 'El lunes tengo fiesta.' },
            { de: 'der Dienstag', es: 'el martes', ex: 'Am Dienstag habe ich einen Termin.', exEs: 'El martes tengo cita.' },
            { de: 'der Mittwoch', es: 'el miércoles', ex: 'Mittwochs gehe ich schwimmen.', exEs: 'Los miércoles voy a nadar.' },
            { de: 'der Donnerstag', es: 'el jueves', ex: 'Der Kurs ist Donnerstag um sechs.', exEs: 'El curso es el jueves a las seis.' },
            { de: 'der Freitag', es: 'el viernes', ex: 'Freitagabend gehen wir aus.', exEs: 'El viernes por la noche salimos.' },
            { de: 'der Samstag', es: 'el sábado', ex: 'Am Samstag gehen wir auf den Markt.', exEs: 'El sábado vamos al mercado.' },
            { de: 'der Sonntag', es: 'el domingo', ex: 'Sonntags sind die Geschäfte zu.', exEs: 'Los domingos las tiendas están cerradas.' },
            { de: 'das Wochenende', es: 'el fin de semana', ex: 'Am Wochenende schlafe ich länger.', exEs: 'El fin de semana duermo más.' }
          ]
        },
        {
          thema: 'Tageszeiten',
          items: [
            { de: 'der Morgen', es: 'la mañana (temprano)', ex: 'Am Morgen trinke ich immer einen Kaffee.', exEs: 'Por la mañana siempre tomo un café.' },
            { de: 'der Vormittag', es: 'la mañana', ex: 'Am Vormittag bin ich im Büro.', exEs: 'Por la mañana estoy en la oficina.' },
            { de: 'der Mittag', es: 'el mediodía', ex: 'Zu Mittag mache ich eine halbe Stunde Pause.', exEs: 'Al mediodía hago media hora de pausa.' },
            { de: 'der Nachmittag', es: 'la tarde', ex: 'Am Nachmittag hole ich die Kinder ab.', exEs: 'Por la tarde recojo a los niños.' },
            { de: 'der Abend', es: 'la tarde-noche', ex: 'Am Abend lese ich noch ein bisschen.', exEs: 'Por la noche leo un rato.' },
            { de: 'die Nacht', es: 'la noche', ex: 'In der Nacht ist es hier ganz ruhig.', exEs: 'Por la noche esto está muy tranquilo.' }
          ]
        },
        {
          thema: 'Uhrzeit',
          items: [
            { de: 'Wie spät ist es? / Wie viel Uhr ist es?', es: '¿Qué hora es?', ex: 'Entschuldigung, wie spät ist es?', exEs: 'Perdone, ¿qué hora es?' },
            { de: 'Es ist acht Uhr.', es: 'Son las ocho.', ex: 'Es ist acht Uhr, wir müssen los.', exEs: 'Son las ocho, tenemos que irnos.' },
            { de: 'Viertel nach acht (8:15)', es: 'las ocho y cuarto', ex: 'Der Zug fährt um Viertel nach acht.', exEs: 'El tren sale a las ocho y cuarto.' },
            { de: 'halb neun (8:30)', es: 'las ocho y media', ex: 'Wir treffen uns um halb neun.', exEs: 'Quedamos a las ocho y media.' },
            { de: 'Viertel vor neun (8:45)', es: 'las nueve menos cuarto', ex: 'Um Viertel vor neun fängt der Kurs an.', exEs: 'El curso empieza a las nueve menos cuarto.' },
            { de: 'zehn nach / zehn vor', es: 'y diez / menos diez', ex: 'Es ist zehn vor sieben.', exEs: 'Son las siete menos diez.' },
            { de: 'Viertel nach / vor', es: 'y cuarto / menos cuarto', ex: 'Es ist Viertel vor neun.', exEs: 'Son las nueve menos cuarto.' },
            { de: 'pünktlich sein', es: 'ser puntual', ex: 'Bitte sei pünktlich!', exEs: '¡Sé puntual, por favor!' },
            { de: 'die Uhrzeit', es: 'la hora', ex: 'Weißt du die genaue Uhrzeit?', exEs: '¿Sabes la hora exacta?' },
            { de: 'die halbe Stunde', es: 'la media hora', ex: 'Der Bus kommt jede halbe Stunde.', exEs: 'El autobús pasa cada media hora.' },
            { de: 'die Minute', es: 'el minuto', ex: 'Warte noch fünf Minuten.', exEs: 'Espera cinco minutos más.' },
            { de: 'gegen (acht)', es: 'sobre (las ocho)', ex: 'Ich komme gegen acht.', exEs: 'Llego sobre las ocho.' }
          ]
        },
        {
          thema: 'Alltagsaktivitäten',
          items: [
            { de: 'aufstehen', es: 'levantarse', ex: 'Ich stehe unter der Woche um sieben auf.', exEs: 'Entre semana me levanto a las siete.' },
            { de: 'frühstücken', es: 'desayunar', ex: 'Wir frühstücken meistens zusammen.', exEs: 'Solemos desayunar juntos.' },
            { de: 'einkaufen', es: 'hacer la compra', ex: 'Am Samstag kaufe ich für die ganze Woche ein.', exEs: 'El sábado hago la compra de toda la semana.' },
            { de: 'kochen', es: 'cocinar', ex: 'Heute Abend koche ich Pasta.', exEs: 'Esta noche hago pasta.' },
            { de: 'fernsehen', es: 'ver la tele', ex: 'Unter der Woche sehe ich kaum fern.', exEs: 'Entre semana casi no veo la tele.' },
            { de: 'aufräumen', es: 'ordenar', ex: 'Räum bitte dein Zimmer auf!', exEs: '¡Ordena tu cuarto, por favor!' },
            { de: 'anrufen', es: 'llamar por teléfono', ex: 'Ich rufe dich heute Abend an.', exEs: 'Te llamo esta noche.' },
            { de: 'schlafen gehen', es: 'irse a dormir', ex: 'Unter der Woche gehe ich um elf schlafen.', exEs: 'Entre semana me acuesto a las once.' }
          ]
        },
        {
          thema: 'Termine und Verabredungen',
          items: [
            { de: 'der Termin', es: 'la cita', ex: 'Ich habe morgen einen Termin beim Arzt.', exEs: 'Mañana tengo cita con el médico.' },
            { de: 'sich treffen', es: 'quedar', ex: 'Wir treffen uns um sieben am Bahnhof.', exEs: 'Quedamos a las siete en la estación.' },
            { de: 'absagen', es: 'cancelar', ex: 'Ich muss den Termin leider absagen.', exEs: 'Por desgracia tengo que cancelar la cita.' },
            { de: 'verschieben', es: 'aplazar', ex: 'Können wir das auf Freitag verschieben?', exEs: '¿Podemos pasarlo al viernes?' },
            { de: 'frei haben', es: 'tener libre', ex: 'Am Mittwoch habe ich frei.', exEs: 'El miércoles tengo libre.' },
            { de: 'die Öffnungszeiten', es: 'el horario de apertura', ex: 'Die Öffnungszeiten stehen an der Tür.', exEs: 'El horario está en la puerta.' },
            { de: 'geöffnet / geschlossen', es: 'abierto / cerrado', ex: 'Sonntags ist geschlossen.', exEs: 'Los domingos está cerrado.' },
            { de: 'dauern', es: 'durar', ex: 'Der Kurs dauert zwei Stunden.', exEs: 'El curso dura dos horas.' },
            { de: 'anfangen', es: 'empezar', ex: 'Wann fängt der Film an?', exEs: '¿Cuándo empieza la película?' },
            { de: 'zu spät kommen', es: 'llegar tarde', ex: 'Ich komme heute zehn Minuten zu spät.', exEs: 'Hoy llego diez minutos tarde.' },
            { de: 'die Woche', es: 'la semana', ex: 'Diese Woche habe ich viel zu tun.', exEs: 'Esta semana tengo mucho que hacer.' },
            { de: 'täglich', es: 'a diario', ex: 'Ich lerne täglich eine halbe Stunde.', exEs: 'Estudio media hora al día.' }
          ]
        },
        {
          thema: 'Zeit & Termine',
          items: [
            { de: 'die Verabredung', es: 'la cita (con alguien)', ex: 'Ich habe heute Abend eine Verabredung.', exEs: 'Esta tarde tengo una cita.' },
            { de: 'der Feierabend', es: 'el fin de la jornada', ex: 'Nach dem Feierabend gehe ich schwimmen.', exEs: 'Al salir del trabajo voy a nadar.' },
            { de: 'der Alltag', es: 'la vida diaria', ex: 'Mein Alltag ist ziemlich ruhig.', exEs: 'Mi vida diaria es bastante tranquila.' },
            { de: 'der Zeitplan', es: 'el horario, el plan', ex: 'Der Zeitplan für morgen steht schon.', exEs: 'El plan para mañana ya está hecho.' },
            { de: 'gleichzeitig', es: 'al mismo tiempo', ex: 'Ich kann nicht alles gleichzeitig machen.', exEs: 'No puedo hacerlo todo al mismo tiempo.' },
            { de: 'sofort', es: 'inmediatamente', ex: 'Ich komme sofort, warte bitte kurz.', exEs: 'Voy inmediatamente, espera un momento.' },
            { de: 'später', es: 'más tarde', ex: 'Können wir später telefonieren?', exEs: '¿Podemos hablar por teléfono más tarde?' },
            { de: 'vorher', es: 'antes', ex: 'Ruf mich bitte vorher an.', exEs: 'Llámame antes, por favor.' },
            { de: 'nachher', es: 'después', ex: 'Nachher gehen wir noch einkaufen.', exEs: 'Después vamos a hacer la compra.' },
            { de: 'dauernd', es: 'constantemente', ex: 'Er schaut dauernd auf die Uhr.', exEs: 'Mira constantemente el reloj.' },
            { de: 'selten', es: 'pocas veces', ex: 'Ich gehe selten ins Kino.', exEs: 'Voy pocas veces al cine.' },
            { de: 'manchmal', es: 'a veces', ex: 'Manchmal stehe ich schon um fünf auf.', exEs: 'A veces me levanto ya a las cinco.' },
            { de: 'immer', es: 'siempre', ex: 'Ich komme immer pünktlich.', exEs: 'Siempre llego puntual.' },
            { de: 'nie', es: 'nunca', ex: 'Ich bin nie vor acht zu Hause.', exEs: 'Nunca estoy en casa antes de las ocho.' },
            { de: 'der Wecker', es: 'el despertador', ex: 'Der Wecker klingelt um halb sieben.', exEs: 'El despertador suena a las seis y media.' },
            { de: 'die Verspätung', es: 'el retraso', ex: 'Der Zug hat zehn Minuten Verspätung.', exEs: 'El tren lleva diez minutos de retraso.' },
            { de: 'rechtzeitig', es: 'a tiempo', ex: 'Wir sind rechtzeitig angekommen.', exEs: 'Llegamos a tiempo.' }
          ]
        },
        {
          thema: 'Zeit & Rhythmus',
          items: [
            { de: 'der Zeitpunkt', es: 'el momento', ex: 'Der Zeitpunkt ist gerade schlecht.', exEs: 'El momento es malo ahora mismo.' },
            { de: 'die Dauer', es: 'la duración', ex: 'Die Dauer des Kurses ist ein Semester.', exEs: 'La duración del curso es un semestre.' },
            { de: 'die Mittagspause', es: 'la pausa para comer', ex: 'Die Mittagspause beginnt um halb eins.', exEs: 'La pausa para comer empieza a las doce y media.' },
            { de: 'der Werktag', es: 'el día laborable', ex: 'An einem Werktag ist hier mehr los.', exEs: 'En un día laborable hay más movimiento aquí.' },
            { de: 'wöchentlich', es: 'semanalmente', ex: 'Wir treffen uns wöchentlich am Dienstag.', exEs: 'Nos vemos semanalmente los martes.' },
            { de: 'monatlich', es: 'mensualmente', ex: 'Die Miete zahle ich monatlich im Voraus.', exEs: 'El alquiler lo pago mensualmente por adelantado.' },
            { de: 'jährlich', es: 'anualmente', ex: 'Der Vertrag verlängert sich jährlich.', exEs: 'El contrato se prorroga anualmente.' },
            { de: 'stündlich', es: 'cada hora', ex: 'Der Bus fährt hier nur stündlich.', exEs: 'Aquí el autobús solo pasa cada hora.' },
            { de: 'übermorgen', es: 'pasado mañana', ex: 'Übermorgen habe ich endlich frei.', exEs: 'Pasado mañana por fin libro.' },
            { de: 'bald', es: 'pronto', ex: 'Bald sind wieder Ferien.', exEs: 'Pronto habrá vacaciones otra vez.' },
            { de: 'gleich', es: 'enseguida', ex: 'Ich bin gleich fertig.', exEs: 'Enseguida termino.' },
            { de: 'eben', es: 'justo ahora', ex: 'Er ist eben erst gegangen.', exEs: 'Se acaba de ir justo ahora.' },
            { de: 'inzwischen', es: 'mientras tanto, ya', ex: 'Inzwischen ist es schon spät geworden.', exEs: 'Mientras tanto se ha hecho tarde.' },
            { de: 'zwischendurch', es: 'entre medias', ex: 'Zwischendurch trinke ich einen Kaffee.', exEs: 'Entre medias me tomo un café.' },
            { de: 'endlich', es: 'por fin', ex: 'Endlich ist der Tag zu Ende.', exEs: 'Por fin se ha acabado el día.' },
            { de: 'warten auf', es: 'esperar a', ex: 'Ich warte seit zwanzig Minuten auf dich.', exEs: 'Llevo veinte minutos esperándote.' },
            { de: 'sich Zeit nehmen', es: 'tomarse tiempo', ex: 'Nimm dir Zeit, es eilt überhaupt nicht.', exEs: 'Tómate tu tiempo, no corre nada de prisa.' },
            { de: 'die Stunde', es: 'la hora', ex: 'Eine Stunde reicht für alles.', exEs: 'Con una hora basta para todo.' },
            { de: 'der Augenblick', es: 'el instante', ex: 'Einen Augenblick bitte, ich komme sofort.', exEs: 'Un instante, por favor, voy enseguida.' },
            { de: 'dringend', es: 'urgente', ex: 'Das ist dringend, es kann nicht warten.', exEs: 'Eso es urgente, no puede esperar.' }
          ]
        },
        {
          thema: 'Uhr & Planung',
          items: [
            { de: 'der Zeiger', es: 'la aguja del reloj', ex: 'Der große Zeiger steht auf der Zwölf.', exEs: 'La aguja grande está en las doce.' },
            { de: 'die Armbanduhr', es: 'el reloj de pulsera', ex: 'Meine Armbanduhr geht zwei Minuten vor.', exEs: 'Mi reloj de pulsera adelanta dos minutos.' },
            { de: 'der Wochentag', es: 'el día de la semana', ex: 'Welchen Wochentag haben wir heute?', exEs: '¿Qué día de la semana es hoy?' },
            { de: 'die Sekunde', es: 'el segundo', ex: 'Eine Sekunde, ich bin gleich da.', exEs: 'Un segundo, ahora voy.' },
            { de: 'die Viertelstunde', es: 'el cuarto de hora', ex: 'In einer Viertelstunde bin ich fertig.', exEs: 'En un cuarto de hora termino.' },
            { de: 'die Mittagszeit', es: 'la hora de comer', ex: 'Um die Mittagszeit ist hier nichts los.', exEs: 'A la hora de comer aquí no hay nadie.' },
            { de: 'der Zeitunterschied', es: 'la diferencia horaria', ex: 'Der Zeitunterschied beträgt zwei Stunden.', exEs: 'La diferencia horaria es de dos horas.' },
            { de: 'die Sommerzeit', es: 'el horario de verano', ex: 'Die Sommerzeit beginnt Ende März.', exEs: 'El horario de verano empieza a finales de marzo.' },
            { de: 'die Winterzeit', es: 'el horario de invierno', ex: 'Bei der Winterzeit wird es früher dunkel.', exEs: 'Con el horario de invierno oscurece antes.' },
            { de: 'der Terminkalender', es: 'la agenda', ex: 'Mein Terminkalender ist völlig voll.', exEs: 'Mi agenda está llenísima.' },
            { de: 'die Absage', es: 'la cancelación', ex: 'Die Absage kam erst am Vortag.', exEs: 'La cancelación llegó el día antes.' },
            { de: 'die Zusage', es: 'la confirmación', ex: 'Über deine Zusage freue ich mich sehr.', exEs: 'Tu confirmación me alegra mucho.' },
            { de: 'die Eile', es: 'la prisa', ex: 'In der Eile habe ich den Schlüssel vergessen.', exEs: 'Con las prisas me olvidé la llave.' },
            { de: 'das Warten', es: 'la espera', ex: 'Das Warten war das Schlimmste daran.', exEs: 'La espera fue lo peor de todo.' },
            { de: 'die Verzögerung', es: 'la demora', ex: 'Es gab leider eine kleine Verzögerung.', exEs: 'Hubo una pequeña demora.' },
            { de: 'vorbei', es: 'pasado, terminado', ex: 'Die Mittagspause ist schon vorbei.', exEs: 'La pausa de la comida ya ha terminado.' },
            { de: 'kurzfristig', es: 'a corto plazo', ex: 'Der Termin wurde kurzfristig abgesagt.', exEs: 'La cita se canceló con poco margen.' },
            { de: 'langfristig', es: 'a largo plazo', ex: 'Langfristig will ich in Wien bleiben.', exEs: 'A largo plazo quiero quedarme en Viena.' }
          ]
        },
        {
          thema: 'Monate',
          items: [
            { de: 'der Jänner (AT) / der Januar', es: 'enero', ex: 'Im Jänner ist es hier eiskalt.', exEs: 'En enero aquí hace un frío helador.' },
            { de: 'der Februar', es: 'febrero', ex: 'Der Kurs geht bis Februar.', exEs: 'El curso va hasta febrero.' },
            { de: 'der März', es: 'marzo', ex: 'Ende März wird es langsam wärmer.', exEs: 'A finales de marzo empieza a hacer más calor.' },
            { de: 'der April', es: 'abril', ex: 'Im April regnet es fast jeden Tag.', exEs: 'En abril llueve casi todos los días.' },
            { de: 'der Mai', es: 'mayo', ex: 'Im Mai habe ich meine Prüfung.', exEs: 'En mayo tengo el examen.' },
            { de: 'der Juni', es: 'junio', ex: 'Ab Juni sind die Bäder wieder offen.', exEs: 'A partir de junio las piscinas vuelven a estar abiertas.' },
            { de: 'der Juli', es: 'julio', ex: 'Im Juli fahren wir ans Meer.', exEs: 'En julio vamos al mar.' },
            { de: 'der August', es: 'agosto', ex: 'Im August ist die Stadt fast leer.', exEs: 'En agosto la ciudad está casi vacía.' },
            { de: 'der September', es: 'septiembre', ex: 'Der neue Kurs beginnt im September.', exEs: 'El curso nuevo empieza en septiembre.' },
            { de: 'der Oktober', es: 'octubre', ex: 'Im Oktober werden die Blätter bunt.', exEs: 'En octubre las hojas se llenan de color.' },
            { de: 'der November', es: 'noviembre', ex: 'Der November ist mir immer zu grau.', exEs: 'Noviembre siempre me resulta demasiado gris.' },
            { de: 'der Dezember', es: 'diciembre', ex: 'Im Dezember gibt es überall Punsch.', exEs: 'En diciembre hay ponche por todas partes.' }
          ]
        },
        {
          thema: 'Datum & Jahreszeiten',
          items: [
            { de: 'das Datum', es: 'la fecha', ex: 'Welches Datum haben wir heute?', exEs: '¿A qué fecha estamos hoy?' },
            { de: 'der Frühling', es: 'la primavera', ex: 'Im Frühling blüht der ganze Park.', exEs: 'En primavera florece todo el parque.' },
            { de: 'der Sommer', es: 'el verano', ex: 'Der Sommer ist hier kurz, aber heiß.', exEs: 'Aquí el verano es corto pero caluroso.' },
            { de: 'der Herbst', es: 'el otoño', ex: 'Der Herbst ist meine liebste Jahreszeit.', exEs: 'El otoño es mi estación preferida.' },
            { de: 'der Winter', es: 'el invierno', ex: 'Der Winter dauert hier viel zu lange.', exEs: 'Aquí el invierno dura demasiado.' },
            { de: 'gestern / heute / morgen', es: 'ayer / hoy / mañana', ex: 'Gestern hatte ich frei, heute arbeite ich.', exEs: 'Ayer libraba, hoy trabajo.' },
            { de: 'die Jahreszeit', es: 'la estación del año', ex: 'Welche Jahreszeit magst du am liebsten?', exEs: '¿Qué estación te gusta más?' }
          ]
        }
      ],
      grammatik: [
        {
          regel: 'temporale Präpositionen am / um / von … bis',
          erklaerung: 'am + día (am Montag), um + hora (um 8 Uhr), von … bis (von 9 bis 17 Uhr).',
          beispiele: [
            { de: 'Am Freitag um 18 Uhr habe ich Zeit.', es: 'El viernes a las 18 tengo tiempo.' },
            { de: 'Ich arbeite von Montag bis Freitag.', es: 'Trabajo de lunes a viernes.' }
          ]
        },
        {
          regel: 'Verbposition im Satz',
          erklaerung: 'El verbo conjugado siempre en 2ª posición. Si empiezas con la hora, el sujeto va detrás.',
          beispiele: [
            { de: 'Ich stehe um 7 Uhr auf.', es: 'Me levanto a las 7.' },
            { de: 'Um 7 Uhr stehe ich auf.', es: 'A las 7 me levanto.' }
          ]
        },
        {
          regel: 'trennbare Verben und Vokalwechsel',
          erklaerung: 'El prefijo se separa y va al final: aufstehen → ich stehe … auf. Algunos cambian vocal: schlafen → du schläfst.',
          beispiele: [
            { de: 'Wann stehst du auf?', es: '¿Cuándo te levantas?' },
            { de: 'Er sieht am Abend fern.', es: 'Él ve la tele por la tarde.' }
          ]
        },
        {
          regel: 'Zeitadverbien zuerst, dann, nachher',
          erklaerung: 'Ordenan acciones. Si van al principio, el verbo va justo después.',
          beispiele: [
            { de: 'Zuerst frühstücke ich, dann fahre ich zur Arbeit.', es: 'Primero desayuno, luego voy al trabajo.' }
          ]
        },
        {
          key: 'aussprache-v-w',
          regel: 'Aussprache: v und w',
          erklaerung: 'Están cambiadas respecto a lo que esperas. La "w" suena como una "v" (labio contra dientes): Wien, Wasser. Y la "v" suena como "f": Vater = «fater», vier = «fir». En extranjerismos como Video sí es sonora.',
          beispiele: [
            { de: 'Mein Vater trinkt Wasser.', es: 'Mi padre bebe agua. («fater», «vasser»)' },
            { de: 'Wir wohnen in Wien.', es: 'Vivimos en Viena. ("w" = "v")' },
            { de: 'Ich habe vier Kinder.', es: 'Tengo cuatro hijos. («fir»)' }
          ]
        },
        {
          key: 'uhrzeit-offiziell-inoffiziell',
          regel: 'Uhrzeit: offiziell und inoffiziell',
          erklaerung: 'Hay dos formas. La oficial (horarios, radio) usa 24 horas: 14:30 = vierzehn Uhr dreißig. La de todos los días usa 12 y va por medias y cuartos: halb drei (14:30), Viertel nach zwei, Viertel vor drei. Ojo con halb: halb drei son las DOS y media, no las tres y media.',
          beispiele: [
            { de: 'Der Zug fährt um vierzehn Uhr dreißig.', es: 'El tren sale a las catorce treinta.' },
            { de: 'Wir treffen uns um halb drei.', es: 'Quedamos a las dos y media.' },
            { de: 'Es ist Viertel vor neun.', es: 'Son las nueve menos cuarto.' }
          ]
        },
        {
          key: 'wortstellung-zeit-vor-ort',
          regel: 'Wortstellung: zuerst die Zeit, dann der Ort',
          erklaerung: 'Cuando en la misma frase hay CUÁNDO y DÓNDE, el alemán pone primero el tiempo y después el lugar, justo al revés que el español: Ich fahre MORGEN NACH GRAZ.',
          beispiele: [
            { de: 'Ich fahre morgen nach Graz.', es: 'Mañana voy a Graz.' },
            { de: 'Wir treffen uns um acht im Café.', es: 'Quedamos a las ocho en la cafetería.' }
          ]
        },
        {
          key: 'praesens-fuer-die-zukunft',
          regel: 'Präsens für die Zukunft',
          erklaerung: 'Para hablar del futuro casi siempre basta con el presente más una palabra de tiempo: morgen, nächste Woche, im Sommer. No hace falta el futuro con werden.',
          beispiele: [
            { de: 'Nächste Woche habe ich frei.', es: 'La semana que viene libro.' },
            { de: 'Im Sommer fahren wir ans Meer.', es: 'En verano vamos al mar.' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'nach der Uhrzeit und dem Zeitplan fragen',
          es: 'Preguntar la hora y los horarios',
          wendungen: [
            { de: 'Wie spät ist es eigentlich?', es: '¿Qué hora es en realidad?' }
          ]
        },
        {
          funktion: 'über Zeitnot und Termine sprechen',
          es: 'Hablar de falta de tiempo y fechas',
          wendungen: [
            { de: 'Ich schaffe das nicht bis Freitag.', es: 'No lo consigo terminar para el viernes.' }
          ]
        },
        {
          funktion: 'höflich um Hilfe bitten',
          es: 'Pedir ayuda con educación',
          wendungen: [
            { de: 'Kannst du mir bitte helfen?', es: '¿Me puedes ayudar, por favor?' }
          ]
        },
        {
          funktion: 'um Gefallen und Unterstützung bitten',
          es: 'Pedir favores y asistencia',
          wendungen: [
            { de: 'Darf ich dich um deinen Rat bitten?', es: '¿Te puedo pedir consejo?' }
          ]
        },
        {
          funktion: 'über Öffnungszeiten sprechen',
          es: 'Hablar de horarios de apertura',
          wendungen: [
            { de: 'Wann hat die Bank offen? – Von 9 bis 15 Uhr.', es: '¿Cuándo abre el banco? – De 9 a 15.' }
          ]
        },
        {
          funktion: 'Auskunft über Dienstleistungen erfragen',
          es: 'Pedir información sobre servicios',
          wendungen: [
            { de: 'Wie sind die Öffnungszeiten am Werktag?', es: '¿Cuál es el horario en día laborable?' }
          ]
        },
        {
          funktion: 'sich verabreden',
          es: 'Quedar con alguien',
          wendungen: [
            { de: 'Hast du am Freitag Zeit?', es: '¿Tienes tiempo el viernes?' }
          ]
        },
        {
          funktion: 'Verabredungen anpassen und vorschlagen',
          es: 'Ajustar citas y hacer planes',
          wendungen: [
            { de: 'Ich muss leider absagen.', es: 'Por desgracia tengo que cancelar.' }
          ]
        }
      ]
    },

    {
      id: 'a11-l6',
      nr: 6,
      name: 'Haben Sie keine Kipferl?',
      woerter: [
        {
          thema: 'Lebensmittel',
          items: [
            { de: 'das Brot', es: 'el pan', ex: 'Ich kaufe frisches Brot.', exEs: 'Compro pan fresco.' },
            { de: 'die Semmel (AT)', es: 'el panecillo', ex: 'Zum Frühstück hole ich zwei Semmeln.', exEs: 'Para desayunar cojo dos panecillos.' },
            { de: 'das Kipferl (AT)', es: 'el cruasán pequeño', ex: 'Zum Kaffee nehme ich ein Kipferl.', exEs: 'Con el café me tomo un cruasán.' },
            { de: 'die Milch', es: 'la leche', ex: 'Die Milch ist leider sauer.', exEs: 'La leche se ha cortado.' },
            { de: 'der Käse', es: 'el queso', ex: 'Der Käse hier ist aus Vorarlberg.', exEs: 'Este queso es de Vorarlberg.' },
            { de: 'die Butter', es: 'la mantequilla', ex: 'Butter ist wieder teurer geworden.', exEs: 'La mantequilla ha vuelto a subir.' },
            { de: 'das Ei', es: 'el huevo', ex: 'Zum Frühstück esse ich ein Ei.', exEs: 'Para desayunar como un huevo.' },
            { de: 'der Apfel', es: 'la manzana', ex: 'Ein Apfel am Tag reicht mir.', exEs: 'Con una manzana al día me basta.' },
            { de: 'die Tomate', es: 'el tomate', ex: 'Die Tomaten aus Spanien schmecken besser.', exEs: 'Los tomates de España saben mejor.' },
            { de: 'die Erdäpfel (AT) / die Kartoffeln', es: 'las patatas', ex: 'Die Erdäpfel brauchen noch zehn Minuten.', exEs: 'A las patatas les faltan diez minutos.' },
            { de: 'das Fleisch', es: 'la carne', ex: 'Fleisch esse ich nur am Wochenende.', exEs: 'Carne solo como los fines de semana.' },
            { de: 'der Fisch', es: 'el pescado', ex: 'Freitags essen wir Fisch.', exEs: 'Los viernes comemos pescado.' },
            { de: 'der Reis', es: 'el arroz', ex: 'Reis mache ich immer zu viel.', exEs: 'Siempre hago arroz de más.' },
            { de: 'die Nudeln', es: 'la pasta', ex: 'Heute gibt es Nudeln.', exEs: 'Hoy hay pasta.' }
          ]
        },
        {
          thema: 'Preise',
          items: [
            { de: 'der Preis', es: 'el precio', ex: 'Der Preis steht auf dem Schild.', exEs: 'El precio está en la etiqueta.' },
            { de: 'der Euro / der Cent', es: 'el euro / el céntimo', ex: 'Das macht drei Euro fünfzig.', exEs: 'Son tres euros cincuenta.' },
            { de: 'kosten', es: 'costar', ex: 'Was kostet das?', exEs: '¿Cuánto cuesta esto?' },
            { de: 'billig / günstig', es: 'barato', ex: 'Im Supermarkt ist es günstiger.', exEs: 'En el supermercado sale más barato.' },
            { de: 'teuer', es: 'caro', ex: 'Wien ist nicht billig, aber auch nicht sehr teuer.', exEs: 'Viena no es barata, pero tampoco carísima.' }
          ]
        },
        {
          thema: 'Mengenangaben',
          items: [
            { de: 'ein Kilo / ein halbes Kilo', es: 'un kilo / medio kilo', ex: 'Ein halbes Kilo Tomaten, bitte.', exEs: 'Medio kilo de tomates, por favor.' },
            { de: 'zehn Deka (AT) = 100 g', es: '100 gramos', ex: 'Zehn Deka Schinken, bitte.', exEs: 'Cien gramos de jamón, por favor.' },
            { de: 'ein Liter', es: 'un litro', ex: 'Wir brauchen noch einen Liter Milch.', exEs: 'Nos falta un litro de leche.' },
            { de: 'eine Packung', es: 'un paquete', ex: 'Eine Packung Nudeln reicht für vier.', exEs: 'Un paquete de pasta da para cuatro.' },
            { de: 'eine Flasche', es: 'una botella', ex: 'Nimm bitte noch eine Flasche Wasser mit.', exEs: 'Coge otra botella de agua, por favor.' },
            { de: 'ein Stück', es: 'una unidad / un trozo', ex: 'Ein Stück Kuchen, bitte.', exEs: 'Un trozo de tarta, por favor.' }
          ]
        },
        {
          thema: 'Mahlzeiten und Speisen',
          items: [
            { de: 'das Frühstück', es: 'el desayuno', ex: 'Was isst du zum Frühstück?', exEs: '¿Qué desayunas?' },
            { de: 'das Mittagessen', es: 'la comida', ex: 'Das Mittagessen gibt es um halb eins.', exEs: 'La comida es a las doce y media.' },
            { de: 'das Abendessen', es: 'la cena', ex: 'Zum Abendessen essen wir nur eine Kleinigkeit.', exEs: 'Para cenar tomamos algo ligero.' },
            { de: 'die Suppe', es: 'la sopa', ex: 'Die Suppe ist noch zu heiß.', exEs: 'La sopa está todavía muy caliente.' },
            { de: 'der Salat', es: 'la ensalada', ex: 'Machst du den Salat, während ich koche?', exEs: '¿Haces tú la ensalada mientras yo cocino?' },
            { de: 'das Schnitzel', es: 'el escalope', ex: 'In Wien muss man einmal ein Schnitzel essen.', exEs: 'En Viena hay que comerse un escalope alguna vez.' },
            { de: 'die Nachspeise', es: 'el postre', ex: 'Möchten Sie noch eine Nachspeise?', exEs: '¿Desea algún postre?' }
          ]
        },
        {
          thema: 'Im Supermarkt',
          items: [
            { de: 'der Einkaufswagen', es: 'el carro de la compra', ex: 'Der Einkaufswagen ist schon voll.', exEs: 'El carro ya está lleno.' },
            { de: 'die Einkaufsliste', es: 'la lista de la compra', ex: 'Ich habe die Einkaufsliste zu Hause vergessen.', exEs: 'Me he dejado la lista de la compra en casa.' },
            { de: 'frisch', es: 'fresco', ex: 'Das Brot ist ganz frisch.', exEs: 'El pan está recién hecho.' },
            { de: 'das Regal', es: 'la estantería', ex: 'Der Reis steht im dritten Regal.', exEs: 'El arroz está en la tercera estantería.' },
            { de: 'die Tüte / das Sackerl (AT)', es: 'la bolsa', ex: 'Brauchen Sie ein Sackerl?', exEs: '¿Necesita una bolsa?' },
            { de: 'das Kleingeld', es: 'el suelto', ex: 'Hast du Kleingeld für den Einkaufswagen?', exEs: '¿Tienes suelto para el carro?' },
            { de: 'die Sonderaktion', es: 'la promoción', ex: 'Heute gibt es eine Sonderaktion bei Obst.', exEs: 'Hoy hay promoción en la fruta.' },
            { de: 'haltbar bis', es: 'consumir antes de', ex: 'Die Milch ist haltbar bis Freitag.', exEs: 'La leche caduca el viernes.' }
          ]
        },
        {
          thema: 'Essen und Trinken',
          items: [
            { de: 'das Gemüse', es: 'la verdura', ex: 'Gemüse esse ich am liebsten gedünstet.', exEs: 'La verdura me gusta más al vapor.' },
            { de: 'das Obst', es: 'la fruta', ex: 'Obst kaufe ich immer auf dem Markt.', exEs: 'La fruta la compro siempre en el mercado.' },
            { de: 'der Zucker', es: 'el azúcar', ex: 'Nimmst du Zucker in den Kaffee?', exEs: '¿Le pones azúcar al café?' },
            { de: 'das Mehl', es: 'la harina', ex: 'Für den Kuchen brauche ich noch Mehl.', exEs: 'Para el bizcocho me falta harina.' },
            { de: 'scharf', es: 'picante', ex: 'Das Essen ist mir zu scharf.', exEs: 'La comida me resulta muy picante.' },
            { de: 'süß / salzig', es: 'dulce / salado', ex: 'Die Suppe ist ein bisschen zu salzig.', exEs: 'La sopa está un poco salada.' },
            { de: 'das Frühstück machen', es: 'preparar el desayuno', ex: 'Am Sonntag mache ich das Frühstück.', exEs: 'Los domingos preparo yo el desayuno.' },
            { de: 'Hunger / Durst haben', es: 'tener hambre / sed', ex: 'Ich habe großen Hunger.', exEs: 'Tengo mucha hambre.' }
          ]
        },
        {
          thema: 'Im Lokal & beim Einkaufen',
          items: [
            { de: 'die Speisekarte', es: 'la carta', ex: 'Können wir bitte die Speisekarte haben?', exEs: '¿Nos puede traer la carta, por favor?' },
            { de: 'die Vorspeise', es: 'el entrante', ex: 'Als Vorspeise nehme ich eine Suppe.', exEs: 'De entrante tomo una sopa.' },
            { de: 'die Hauptspeise', es: 'el plato principal', ex: 'Als Hauptspeise gibt es heute Fisch.', exEs: 'De plato principal hoy hay pescado.' },
            { de: 'das Trinkgeld', es: 'la propina', ex: 'Das Trinkgeld lasse ich auf dem Tisch.', exEs: 'La propina la dejo en la mesa.' },
            { de: 'die Bedienung', es: 'el servicio, el camarero', ex: 'Die Bedienung war heute sehr schnell.', exEs: 'El servicio ha sido hoy muy rápido.' },
            { de: 'bestellen', es: 'pedir', ex: 'Wir möchten gern bestellen.', exEs: 'Nos gustaría pedir.' },
            { de: 'bezahlen', es: 'pagar', ex: 'Ich möchte bitte bezahlen.', exEs: 'Quiero pagar, por favor.' },
            { de: 'getrennt', es: 'por separado', ex: 'Zahlen wir zusammen oder getrennt?', exEs: '¿Pagamos juntos o por separado?' },
            { de: 'der Nachtisch', es: 'el postre', ex: 'Als Nachtisch nehmen wir einen Strudel.', exEs: 'De postre tomamos un strudel.' },
            { de: 'vegetarisch', es: 'vegetariano', ex: 'Ich esse vegetarisch, ohne Fleisch und Fisch.', exEs: 'Como vegetariano, sin carne ni pescado.' },
            { de: 'das Gericht', es: 'el plato', ex: 'Dieses Gericht ist eine Spezialität.', exEs: 'Este plato es una especialidad.' },
            { de: 'die Portion', es: 'la ración', ex: 'Die Portion ist wirklich sehr groß.', exEs: 'La ración es realmente muy grande.' },
            { de: 'satt', es: 'lleno, saciado', ex: 'Ich bin satt, danke.', exEs: 'Estoy lleno, gracias.' },
            { de: 'probieren', es: 'probar', ex: 'Darf ich das kurz probieren?', exEs: '¿Puedo probarlo un momento?' },
            { de: 'das Getränk', es: 'la bebida', ex: 'Möchten Sie noch ein Getränk?', exEs: '¿Quiere otra bebida?' },
            { de: 'der Markt', es: 'el mercado', ex: 'Am Samstag gehe ich auf den Markt.', exEs: 'Los sábados voy al mercado.' }
          ]
        },
        {
          thema: 'Kochen & Geschäfte',
          items: [
            { de: 'der Becher', es: 'el vaso, la tarrina', ex: 'Ein Becher Joghurt kostet achtzig Cent.', exEs: 'Una tarrina de yogur cuesta ochenta céntimos.' },
            { de: 'die Dose', es: 'la lata', ex: 'In der Dose sind Tomaten.', exEs: 'En la lata hay tomates.' },
            { de: 'das Gramm', es: 'el gramo', ex: 'Zweihundert Gramm Käse, bitte.', exEs: 'Doscientos gramos de queso, por favor.' },
            { de: 'die Scheibe', es: 'la loncha, la rebanada', ex: 'Eine Scheibe Brot reicht mir.', exEs: 'Con una rebanada de pan me basta.' },
            { de: 'backen', es: 'hornear', ex: 'Am Sonntag backe ich einen Kuchen.', exEs: 'El domingo horneo un pastel.' },
            { de: 'braten', es: 'freír, asar', ex: 'Ich brate den Fisch in der Pfanne.', exEs: 'Frío el pescado en la sartén.' },
            { de: 'schneiden', es: 'cortar', ex: 'Schneide bitte die Zwiebel klein.', exEs: 'Corta la cebolla pequeña, por favor.' },
            { de: 'die Pfanne', es: 'la sartén', ex: 'Die Pfanne ist noch heiß.', exEs: 'La sartén todavía está caliente.' },
            { de: 'der Topf', es: 'la olla', ex: 'Im Topf kocht schon das Wasser.', exEs: 'En la olla ya hierve el agua.' },
            { de: 'der Ofen', es: 'el horno', ex: 'Der Kuchen ist noch im Ofen.', exEs: 'El pastel sigue en el horno.' },
            { de: 'tiefgekühlt', es: 'congelado', ex: 'Das Gemüse ist tiefgekühlt.', exEs: 'La verdura está congelada.' },
            { de: 'die Bäckerei', es: 'la panadería', ex: 'Die Bäckerei öffnet schon um sechs.', exEs: 'La panadería abre ya a las seis.' },
            { de: 'die Fleischerei', es: 'la carnicería', ex: 'In der Fleischerei kaufe ich das Fleisch.', exEs: 'La carne la compro en la carnicería.' },
            { de: 'der Wochenmarkt', es: 'el mercado semanal', ex: 'Der Wochenmarkt ist jeden Samstag.', exEs: 'El mercado semanal es todos los sábados.' },
            { de: 'der Bioladen', es: 'la tienda ecológica', ex: 'Im Bioladen ist alles etwas teurer.', exEs: 'En la tienda ecológica todo es algo más caro.' },
            { de: 'die Ware', es: 'la mercancía', ex: 'Die Ware kommt jeden Morgen frisch.', exEs: 'La mercancía llega fresca cada mañana.' },
            { de: 'abgelaufen', es: 'caducado', ex: 'Der Joghurt ist seit gestern abgelaufen.', exEs: 'El yogur está caducado desde ayer.' },
            { de: 'lecker', es: 'rico, sabroso', ex: 'Das Essen war wirklich lecker.', exEs: 'La comida estaba realmente rica.' },
            { de: 'der Appetit', es: 'el apetito', ex: 'Guten Appetit euch allen!', exEs: '¡Buen provecho a todos!' }
          ]
        },
        {
          thema: 'Tisch & Zubereitung',
          items: [
            { de: 'das Besteck', es: 'los cubiertos', ex: 'Das Besteck liegt schon auf dem Tisch.', exEs: 'Los cubiertos ya están en la mesa.' },
            { de: 'die Tasse', es: 'la taza', ex: 'Noch eine Tasse Kaffee, bitte.', exEs: 'Otra taza de café, por favor.' },
            { de: 'die Schüssel', es: 'el bol', ex: 'Den Salat gebe ich in eine große Schüssel.', exEs: 'La ensalada la pongo en un bol grande.' },
            { de: 'das Tablett', es: 'la bandeja', ex: 'Stell die Gläser bitte auf das Tablett.', exEs: 'Pon los vasos en la bandeja, por favor.' },
            { de: 'der Strohhalm', es: 'la pajita', ex: 'Möchtest du einen Strohhalm dazu?', exEs: '¿Quieres una pajita?' },
            { de: 'der Imbiss', es: 'el puesto de comida rápida', ex: 'Am Bahnhof gibt es einen guten Imbiss.', exEs: 'En la estación hay un buen puesto de comida.' },
            { de: 'der Lieferservice', es: 'el servicio a domicilio', ex: 'Am Sonntag bestellen wir beim Lieferservice.', exEs: 'El domingo pedimos a domicilio.' },
            { de: 'die Diät', es: 'la dieta', ex: 'Ich mache seit Januar eine Diät.', exEs: 'Estoy a dieta desde enero.' },
            { de: 'der Geschmack', es: 'el sabor', ex: 'Der Geschmack ist mir viel zu stark.', exEs: 'El sabor me parece demasiado fuerte.' },
            { de: 'der Geruch', es: 'el olor', ex: 'Der Geruch kommt aus der Küche.', exEs: 'El olor viene de la cocina.' },
            { de: 'roh', es: 'crudo', ex: 'Das Fleisch ist innen noch roh.', exEs: 'La carne está cruda por dentro.' },
            { de: 'gekocht', es: 'cocido', ex: 'Ich esse das Ei lieber gekocht.', exEs: 'Prefiero el huevo cocido.' },
            { de: 'gebraten', es: 'frito, asado', ex: 'Die Erdäpfel sind gebraten, nicht gekocht.', exEs: 'Las patatas son fritas, no cocidas.' },
            { de: 'fettarm', es: 'bajo en grasa', ex: 'Diese Milch ist fettarm.', exEs: 'Esta leche es baja en grasa.' },
            { de: 'der Vorrat', es: 'la reserva', ex: 'Im Keller haben wir einen kleinen Vorrat.', exEs: 'En el sótano tenemos una pequeña reserva.' },
            { de: 'einfrieren', es: 'congelar', ex: 'Den Rest friere ich einfach ein.', exEs: 'El resto lo congelo.' },
            { de: 'aufwärmen', es: 'calentar', ex: 'Ich wärme dir das Essen auf.', exEs: 'Te caliento la comida.' },
            { de: 'abräumen', es: 'recoger la mesa', ex: 'Nach dem Essen räumen wir zusammen ab.', exEs: 'Después de comer recogemos juntos.' }
          ]
        },
        {
          thema: 'Getränke',
          items: [
            { de: 'das Wasser', es: 'el agua', ex: 'Ein Glas Wasser, bitte.', exEs: 'Un vaso de agua, por favor.' },
            { de: 'das Mineralwasser', es: 'el agua mineral', ex: 'Ich nehme ein Mineralwasser ohne Eis.', exEs: 'Tomo un agua mineral sin hielo.' },
            { de: 'das Leitungswasser', es: 'el agua del grifo', ex: 'In Wien kann man Leitungswasser bedenkenlos trinken.', exEs: 'En Viena se puede beber agua del grifo sin problema.' },
            { de: 'der Kaffee', es: 'el café', ex: 'Einen Kaffee mit Milch, bitte.', exEs: 'Un café con leche, por favor.' },
            { de: 'der Tee', es: 'el té', ex: 'Bei Halsweh trinke ich Tee mit Honig.', exEs: 'Cuando me duele la garganta tomo té con miel.' },
            { de: 'der Saft', es: 'el zumo', ex: 'Der Saft hier ist frisch gepresst.', exEs: 'Aquí el zumo es recién exprimido.' },
            { de: 'das Bier', es: 'la cerveza', ex: 'Nach der Arbeit trinken wir ein Bier.', exEs: 'Después del trabajo nos tomamos una cerveza.' },
            { de: 'der Wein', es: 'el vino', ex: 'Zum Essen nehmen wir einen Wein aus Niederösterreich.', exEs: 'Para comer tomamos un vino de Baja Austria.' },
            { de: 'die Limonade', es: 'la gaseosa, el refresco', ex: 'Für die Kinder eine Limonade, bitte.', exEs: 'Para los niños una gaseosa, por favor.' },
            { de: 'der Kakao', es: 'el cacao, el chocolate caliente', ex: 'Im Winter trinke ich abends gern einen Kakao.', exEs: 'En invierno me gusta tomar un chocolate por la noche.' }
          ]
        },
        {
          thema: 'Mehr Lebensmittel',
          items: [
            { de: 'die Wurst', es: 'el embutido, la salchicha', ex: 'Zum Frühstück esse ich meistens Wurst und Käse.', exEs: 'Para desayunar suelo comer embutido y queso.' },
            { de: 'der Schinken', es: 'el jamón', ex: 'Ein Brot mit Schinken, bitte.', exEs: 'Un bocadillo de jamón, por favor.' },
            { de: 'der Joghurt', es: 'el yogur', ex: 'Ich nehme jeden Morgen einen Joghurt mit Obst.', exEs: 'Cada mañana tomo un yogur con fruta.' },
            { de: 'die Marmelade', es: 'la mermelada', ex: 'Auf das Brot kommt Butter und Marmelade.', exEs: 'Al pan le pongo mantequilla y mermelada.' },
            { de: 'der Honig', es: 'la miel', ex: 'Honig ist mir lieber als Zucker.', exEs: 'Prefiero la miel al azúcar.' },
            { de: 'die Zwiebel', es: 'la cebolla', ex: 'Den Salat bitte ohne Zwiebel.', exEs: 'La ensalada sin cebolla, por favor.' },
            { de: 'die Karotte', es: 'la zanahoria', ex: 'Für die Suppe brauche ich zwei Karotten.', exEs: 'Para la sopa necesito dos zanahorias.' },
            { de: 'die Gurke', es: 'el pepino', ex: 'Die Gurke ist leider nicht mehr frisch.', exEs: 'El pepino ya no está fresco.' },
            { de: 'die Banane', es: 'el plátano', ex: 'Ich nehme immer eine Banane in die Arbeit mit.', exEs: 'Siempre me llevo un plátano al trabajo.' }
          ]
        }
      ],
      grammatik: [
        {
          regel: 'essen, nehmen, mögen, "möchte"',
          erklaerung: 'essen: du isst, er isst. nehmen: du nimmst, er nimmt. möchte: ich möchte, du möchtest.',
          beispiele: [
            { de: 'Was nimmst du? – Ich nehme die Suppe.', es: '¿Qué vas a tomar? – Tomo la sopa.' },
            { de: 'Ich möchte einen Kaffee, bitte.', es: 'Quisiera un café, por favor.' }
          ]
        },
        {
          regel: 'Artikel im Akkusativ Singular',
          erklaerung: 'Solo cambia el masculino: der → den, ein → einen. die/das no cambian.',
          beispiele: [
            { de: 'Ich nehme den Salat und das Brot.', es: 'Tomo la ensalada y el pan.' },
            { de: 'Ich möchte einen Apfel.', es: 'Quiero una manzana.' }
          ]
        },
        {
          regel: 'Negativartikel im Akkusativ',
          erklaerung: 'keinen (masc.), keine (fem./pl.), kein (neutro).',
          beispiele: [
            { de: 'Haben Sie keine Kipferl?', es: '¿No tienen Kipferl?' },
            { de: 'Ich esse keinen Fisch.', es: 'No como pescado.' }
          ]
        },
        {
          regel: 'Komposita',
          erklaerung: 'Palabra compuesta: el artículo es el de la ÚLTIMA palabra.',
          beispiele: [
            { de: 'der Apfel + der Saft = der Apfelsaft', es: 'el zumo de manzana' },
            { de: 'das Obst + der Salat = der Obstsalat', es: 'la macedonia' }
          ]
        },
        {
          regel: 'Präpositionen mit / ohne',
          erklaerung: '"mit" + Dativ, "ohne" + Akkusativ. A este nivel se usan como fórmulas fijas.',
          beispiele: [
            { de: 'Einen Kaffee mit Milch, bitte.', es: 'Un café con leche, por favor.' },
            { de: 'Ein Wasser ohne Kohlensäure.', es: 'Un agua sin gas.' }
          ]
        },
        {
          key: 'aussprache-eu-au',
          regel: 'Aussprache: eu, äu, au',
          erklaerung: '"eu" y "äu" suenan los dos «oi»: neu = «noi», Häuser = «Hoiser», Deutsch = «Doitsch». "au" sí suena «au», como en español. Y ojo: "ie" no es diptongo, es una "i" larga.',
          beispiele: [
            { de: 'Ich lerne Deutsch.', es: 'Estudio alemán. («Doitsch»)' },
            { de: 'Neun Leute sind heute hier.', es: 'Hoy hay nueve personas aquí. (todo «oi»)' },
            { de: 'Das Haus ist auch alt.', es: 'La casa también es vieja. («au»)' }
          ]
        },
        {
          key: 'mengenangaben-ohne-plural',
          regel: 'Mengenangaben: ein Kilo Erdäpfel',
          erklaerung: 'Detrás de una medida, el alemán deja la medida en singular aunque sean varias: zwei Kilo, drei Stück, vier Glas. Y entre la medida y el alimento no va nada: zwei Kilo Erdäpfel, no «zwei Kilo von Erdäpfel».',
          beispiele: [
            { de: 'Ich hätte gern zwei Kilo Erdäpfel.', es: 'Querría dos kilos de patatas.' },
            { de: 'Bitte drei Stück Kuchen.', es: 'Tres trozos de tarta, por favor.' }
          ]
        },
        {
          key: 'stoffnamen-ohne-artikel',
          regel: 'Lebensmittel ohne Artikel',
          erklaerung: 'Cuando se habla de un alimento en general, va SIN artículo: Ich kaufe Brot. Ich trinke Kaffee. Solo aparece el artículo si se concreta la cantidad o la pieza: ein Glas Wasser, das Brot von gestern.',
          beispiele: [
            { de: 'Ich trinke morgens Kaffee.', es: 'Por la mañana tomo café.' },
            { de: 'Bringst du bitte ein Glas Wasser?', es: '¿Traes un vaso de agua, por favor?' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'im Restaurant bestellen',
          es: 'Pedir en el restaurante',
          wendungen: [
            { de: 'Wir möchten gern bestellen.', es: 'Nos gustaría pedir.' }
          ]
        },
        {
          funktion: 'nach Angeboten und Empfehlungen fragen',
          es: 'Preguntar por ofertas y recomendaciones',
          wendungen: [
            { de: 'Könnte ich bitte die Karte haben?', es: '¿Me trae la carta, por favor?' }
          ]
        },
        {
          funktion: 'nach dem Preis fragen',
          es: 'Preguntar el precio',
          wendungen: [
            { de: 'Was kostet das?', es: '¿Cuánto cuesta?' }
          ]
        },
        {
          funktion: 'bezahlen und abrechnen',
          es: 'Pagar y pedir la cuenta',
          wendungen: [
            { de: 'Die Rechnung, bitte.', es: 'La cuenta, por favor.' }
          ]
        },
        {
          funktion: 'über Vorlieben beim Essen sprechen',
          es: 'Hablar de preferencias de comida',
          wendungen: [
            { de: 'Isst du gern Fisch?', es: '¿Te gusta el pescado?' }
          ]
        },
        {
          funktion: 'über Geschmack und Verträglichkeit sprechen',
          es: 'Hablar del sabor y tolerancias',
          wendungen: [
            { de: 'Schmeckt es dir?', es: '¿Te gusta?' }
          ]
        },
        {
          funktion: 'sagen, was es zu essen gibt',
          es: 'Decir qué hay de comer',
          wendungen: [
            { de: 'Heute gibt es Suppe und Salat.', es: 'Hoy hay sopa y ensalada.' }
          ]
        },
        {
          funktion: 'im Supermarkt einkaufen',
          es: 'Comprar en el supermercado',
          wendungen: [
            { de: 'Wo finde ich hier den Reis?', es: '¿Dónde encuentro aquí el arroz?' }
          ]
        }
      ]
    },

    {
      id: 'a11-l7',
      nr: 7,
      name: 'Heute regnet es.',
      woerter: [
        {
          thema: 'Jahreszeiten',
          items: [
            { de: 'der Frühling', es: 'la primavera', ex: 'Im Frühling wird es wärmer.', exEs: 'En primavera empieza a hacer más calor.' },
            { de: 'der Sommer', es: 'el verano', ex: 'Der Sommer war dieses Jahr sehr heiß.', exEs: 'Este año el verano fue muy caluroso.' },
            { de: 'der Herbst', es: 'el otoño', ex: 'Im Herbst regnet es hier viel.', exEs: 'En otoño aquí llueve mucho.' },
            { de: 'der Winter', es: 'el invierno', ex: 'Der Winter in Wien ist lang.', exEs: 'El invierno en Viena es largo.' }
          ]
        },
        {
          thema: 'Monate',
          items: [
            { de: 'Jänner (AT) / Januar, Februar, März', es: 'enero, febrero, marzo', ex: 'Im Jänner ist es am kältesten.', exEs: 'En enero es cuando más frío hace.' },
            { de: 'April, Mai, Juni', es: 'abril, mayo, junio', ex: 'Im Mai haben wir viele Feiertage.', exEs: 'En mayo tenemos muchos festivos.' },
            { de: 'Juli, August, September', es: 'julio, agosto, septiembre', ex: 'Im August ist die Stadt leer.', exEs: 'En agosto la ciudad se queda vacía.' },
            { de: 'Oktober, November, Dezember', es: 'octubre, noviembre, diciembre', ex: 'Im Dezember wird es früh dunkel.', exEs: 'En diciembre oscurece pronto.' }
          ]
        },
        {
          thema: 'Wetter',
          items: [
            { de: 'die Sonne / sonnig', es: 'el sol / soleado', ex: 'Heute ist es sonnig und warm.', exEs: 'Hoy hace sol y calor.' },
            { de: 'der Regen / regnen', es: 'la lluvia / llover', ex: 'Es regnet seit heute Früh.', exEs: 'Llueve desde esta mañana.' },
            { de: 'der Schnee / schneien', es: 'la nieve / nevar', ex: 'Gestern hat es den ganzen Tag geschneit.', exEs: 'Ayer nevó todo el día.' },
            { de: 'der Wind / windig', es: 'el viento / con viento', ex: 'Heute ist es sehr windig.', exEs: 'Hoy hace mucho viento.' },
            { de: 'bewölkt', es: 'nublado', ex: 'Der Himmel ist stark bewölkt.', exEs: 'El cielo está muy nublado.' },
            { de: 'das Gewitter', es: 'la tormenta', ex: 'Am Nachmittag zieht ein Gewitter auf.', exEs: 'Por la tarde se acerca una tormenta.' },
            { de: 'warm / heiß', es: 'templado / caluroso', ex: 'Im Juli ist es hier richtig heiß.', exEs: 'En julio aquí hace un calor de verdad.' },
            { de: 'kalt / kühl', es: 'frío / fresco', ex: 'Am Abend wird es schon kühl.', exEs: 'Por la noche ya refresca.' },
            { de: 'die Temperatur / der Grad', es: 'la temperatura / el grado', ex: 'Morgen sind es nur zehn Grad.', exEs: 'Mañana solo hará diez grados.' },
            { de: 'der Himmel', es: 'el cielo', ex: 'Der Himmel ist heute ganz blau.', exEs: 'Hoy el cielo está completamente azul.' },
            { de: 'der Nebel / neblig', es: 'la niebla / con niebla', ex: 'Am Morgen war dichter Nebel.', exEs: 'Por la mañana había mucha niebla.' },
            { de: 'der Sturm', es: 'la tormenta de viento', ex: 'In der Nacht kam ein Sturm.', exEs: 'Por la noche vino un temporal.' },
            { de: 'die Sonne scheint', es: 'hace sol', ex: 'Heute scheint endlich die Sonne.', exEs: 'Hoy por fin hace sol.' },
            { de: 'es ist bewölkt', es: 'está nublado', ex: 'Im November ist es fast immer bewölkt.', exEs: 'En noviembre está nublado casi siempre.' },
            { de: 'die Wettervorhersage', es: 'el pronóstico del tiempo', ex: 'Die Wettervorhersage verspricht Regen.', exEs: 'El pronóstico anuncia lluvia.' },
            { de: 'nass / trocken', es: 'mojado / seco', ex: 'Meine Schuhe sind ganz nass.', exEs: 'Tengo los zapatos empapados.' },
            { de: 'der Regenschirm', es: 'el paraguas', ex: 'Nimm den Regenschirm mit!', exEs: '¡Llévate el paraguas!' },
            { de: 'frieren', es: 'tener frío', ex: 'Ich friere, mach bitte die Tür zu.', exEs: 'Tengo frío, cierra la puerta.' },
            { de: 'schwitzen', es: 'sudar', ex: 'Bei dieser Hitze schwitze ich sofort.', exEs: 'Con este calor sudo enseguida.' }
          ]
        },
        {
          thema: 'Jahreszeiten und Monate',
          items: [
            { de: 'das Jahr', es: 'el año', ex: 'Das Jahr hat zwölf Monate.', exEs: 'El año tiene doce meses.' },
            { de: 'die Jahreszeit', es: 'la estación del año', ex: 'Der Herbst ist meine liebste Jahreszeit.', exEs: 'El otoño es mi estación favorita.' },
            { de: 'der Feiertag', es: 'el día festivo', ex: 'Am Montag ist Feiertag, die Geschäfte sind zu.', exEs: 'El lunes es festivo, las tiendas cierran.' },
            { de: 'die Ferien', es: 'las vacaciones (escolares)', ex: 'In den Ferien fahren wir immer weg.', exEs: 'En vacaciones siempre nos vamos.' },
            { de: 'draußen / drinnen', es: 'fuera / dentro', ex: 'Bei dem Wetter bleiben wir lieber drinnen.', exEs: 'Con este tiempo mejor nos quedamos dentro.' },
            { de: 'der Grad', es: 'el grado', ex: 'Heute sind es nur fünf Grad.', exEs: 'Hoy solo hace cinco grados.' },
            { de: 'die Hitze', es: 'el calor', ex: 'Die Hitze im August ist kaum auszuhalten.', exEs: 'El calor de agosto es casi insoportable.' },
            { de: 'angenehm', es: 'agradable', ex: 'Heute ist es angenehm warm.', exEs: 'Hoy hace un calor agradable.' },
            { de: 'scheußlich', es: 'horrible', ex: 'Gestern war das Wetter scheußlich.', exEs: 'Ayer hizo un tiempo horrible.' },
            { de: 'der Wetterbericht', es: 'el parte meteorológico', ex: 'Im Radio kommt gleich der Wetterbericht.', exEs: 'Ahora dan el parte del tiempo en la radio.' },
            { de: 'stürmisch', es: 'con viento fuerte', ex: 'An der Küste ist es oft stürmisch.', exEs: 'En la costa hay muchas veces temporal.' },
            { de: 'mild', es: 'suave (templado)', ex: 'Der Winter war dieses Jahr sehr mild.', exEs: 'Este invierno ha sido muy suave.' },
            { de: 'die Jacke anziehen', es: 'ponerse la chaqueta', ex: 'Zieh eine Jacke an, es ist kühl.', exEs: 'Ponte una chaqueta, que refresca.' }
          ]
        },
        {
          thema: 'Wetter & Kleidung',
          items: [
            { de: 'das Unwetter', es: 'el temporal', ex: 'Am Abend kommt ein starkes Unwetter.', exEs: 'Por la tarde llega un temporal fuerte.' },
            { de: 'der Blitz', es: 'el rayo', ex: 'Der Blitz war direkt über dem Haus.', exEs: 'El rayo cayó justo encima de la casa.' },
            { de: 'der Donner', es: 'el trueno', ex: 'Nach dem Blitz kam der Donner.', exEs: 'Después del rayo vino el trueno.' },
            { de: 'der Hagel', es: 'el granizo', ex: 'Der Hagel hat die Autos beschädigt.', exEs: 'El granizo ha dañado los coches.' },
            { de: 'das Eis', es: 'el hielo', ex: 'Auf der Straße liegt Eis.', exEs: 'En la calle hay hielo.' },
            { de: 'glatt', es: 'resbaladizo', ex: 'Die Straßen sind heute sehr glatt.', exEs: 'Hoy las calles están muy resbaladizas.' },
            { de: 'die Wolke', es: 'la nube', ex: 'Am Himmel ist keine einzige Wolke.', exEs: 'En el cielo no hay ni una nube.' },
            { de: 'der Schatten', es: 'la sombra', ex: 'Im Schatten ist es angenehm kühl.', exEs: 'A la sombra hace un fresco agradable.' },
            { de: 'der Sonnenschirm', es: 'la sombrilla', ex: 'Wir stellen den Sonnenschirm auf.', exEs: 'Montamos la sombrilla.' },
            { de: 'die Sonnencreme', es: 'la crema solar', ex: 'Vergiss die Sonnencreme nicht!', exEs: '¡No te olvides de la crema solar!' },
            { de: 'der Mantel', es: 'el abrigo', ex: 'Heute brauchst du einen warmen Mantel.', exEs: 'Hoy necesitas un abrigo de abrigo.' },
            { de: 'die Mütze', es: 'el gorro', ex: 'Setz die Mütze auf, es ist eisig.', exEs: 'Ponte el gorro, hace un frío helador.' },
            { de: 'der Schal', es: 'la bufanda', ex: 'Mein Schal liegt noch im Auto.', exEs: 'Mi bufanda sigue en el coche.' },
            { de: 'die Handschuhe', es: 'los guantes', ex: 'Ohne Handschuhe frieren mir die Finger.', exEs: 'Sin guantes se me quedan helados los dedos.' },
            { de: 'die Heizung', es: 'la calefacción', ex: 'Die Heizung läuft seit Oktober.', exEs: 'La calefacción funciona desde octubre.' },
            { de: 'die Klimaanlage', es: 'el aire acondicionado', ex: 'Im Büro läuft die Klimaanlage zu stark.', exEs: 'En la oficina el aire acondicionado va demasiado fuerte.' },
            { de: 'das Hochwasser', es: 'la inundación', ex: 'Nach dem Regen gab es Hochwasser.', exEs: 'Después de la lluvia hubo inundaciones.' },
            { de: 'die Luft', es: 'el aire', ex: 'Nach dem Regen ist die Luft frisch.', exEs: 'Después de la lluvia el aire está fresco.' },
            { de: 'feucht', es: 'húmedo', ex: 'Im Herbst ist es oft feucht und neblig.', exEs: 'En otoño suele estar húmedo y con niebla.' },
            { de: 'der Sonnenaufgang', es: 'el amanecer', ex: 'Im Sommer ist der Sonnenaufgang um fünf.', exEs: 'En verano el amanecer es a las cinco.' },
            { de: 'der Sonnenuntergang', es: 'el atardecer', ex: 'Der Sonnenuntergang am Meer ist wunderschön.', exEs: 'El atardecer en el mar es precioso.' },
            { de: 'das Thermometer', es: 'el termómetro', ex: 'Das Thermometer zeigt dreißig Grad.', exEs: 'El termómetro marca treinta grados.' },
            { de: 'der Pullover', es: 'el jersey', ex: 'Zieh lieber einen Pullover an, es ist kühl.', exEs: 'Ponte mejor un jersey, hace fresco.' },
            { de: 'die Hose', es: 'el pantalón', ex: 'Bei dem Regen nehme ich eine lange Hose.', exEs: 'Con esta lluvia me pongo un pantalón largo.' },
            { de: 'die Schuhe', es: 'los zapatos', ex: 'Meine Schuhe sind vom Regen ganz nass.', exEs: 'Tengo los zapatos empapados de la lluvia.' },
            { de: 'die Jacke', es: 'la chaqueta', ex: 'Ohne Jacke gehe ich im Herbst nicht raus.', exEs: 'En otoño no salgo sin chaqueta.' },
            { de: 'das T-Shirt', es: 'la camiseta', ex: 'Heute reicht ein T-Shirt, es ist warm.', exEs: 'Hoy basta con una camiseta, hace calor.' },
            { de: 'die Socken', es: 'los calcetines', ex: 'Im Winter trage ich immer dicke Socken.', exEs: 'En invierno llevo siempre calcetines gruesos.' },
            { de: 'die Stiefel', es: 'las botas', ex: 'Bei Schnee brauchst du warme Stiefel.', exEs: 'Con nieve necesitas botas de abrigo.' },
            { de: 'der Hut', es: 'el sombrero', ex: 'Gegen die Sonne setze ich einen Hut auf.', exEs: 'Para el sol me pongo un sombrero.' },
            { de: 'die Sandalen', es: 'las sandalias', ex: 'Im August laufe ich nur in Sandalen herum.', exEs: 'En agosto voy solo en sandalias.' }
          ]
        },
        {
          thema: 'Wetter & Klima',
          items: [
            { de: 'der Regenmantel', es: 'el impermeable', ex: 'Ohne Regenmantel wird man sofort nass.', exEs: 'Sin impermeable te mojas enseguida.' },
            { de: 'die Gummistiefel', es: 'las botas de agua', ex: 'Die Kinder lieben ihre Gummistiefel.', exEs: 'A los niños les encantan sus botas de agua.' },
            { de: 'der Sonnenbrand', es: 'la quemadura del sol', ex: 'Ich habe einen Sonnenbrand am Rücken.', exEs: 'Tengo una quemadura del sol en la espalda.' },
            { de: 'die Sonnenbrille', es: 'las gafas de sol', ex: 'Ohne Sonnenbrille sehe ich gar nichts.', exEs: 'Sin gafas de sol no veo nada.' },
            { de: 'der Frost', es: 'la helada', ex: 'In der Nacht gab es leichten Frost.', exEs: 'Por la noche hubo una helada ligera.' },
            { de: 'tauen', es: 'deshelar', ex: 'Der Schnee taut schon wieder.', exEs: 'La nieve ya se está derritiendo.' },
            { de: 'die Lawine', es: 'el alud', ex: 'In den Bergen droht eine Lawine.', exEs: 'En la montaña hay riesgo de alud.' },
            { de: 'der Regenschauer', es: 'el chubasco', ex: 'Am Nachmittag kommt ein kurzer Regenschauer.', exEs: 'Por la tarde cae un chubasco corto.' },
            { de: 'der Durchschnitt', es: 'la media', ex: 'Im Durchschnitt sind es zwanzig Grad.', exEs: 'De media son veinte grados.' },
            { de: 'sinken', es: 'bajar', ex: 'Die Temperaturen sinken auf null Grad.', exEs: 'Las temperaturas bajan a cero grados.' },
            { de: 'steigen', es: 'subir', ex: 'Am Mittag steigen die Temperaturen stark.', exEs: 'Al mediodía las temperaturas suben mucho.' },
            { de: 'das Klima', es: 'el clima', ex: 'Das Klima ändert sich schnell.', exEs: 'El clima está cambiando rápido.' },
            { de: 'die Dürre', es: 'la sequía', ex: 'Im Süden herrscht seit Monaten Dürre.', exEs: 'En el sur hay sequía desde hace meses.' },
            { de: 'die Wetterwarnung', es: 'el aviso meteorológico', ex: 'Für heute gibt es eine Wetterwarnung.', exEs: 'Para hoy hay un aviso meteorológico.' },
            { de: 'windstill', es: 'sin viento', ex: 'Heute ist es völlig windstill.', exEs: 'Hoy no corre nada de aire.' },
            { de: 'bedeckt', es: 'cubierto', ex: 'Der Himmel ist den ganzen Tag bedeckt.', exEs: 'El cielo está cubierto todo el día.' },
            { de: 'schwül', es: 'bochornoso', ex: 'Vor dem Gewitter ist es immer schwül.', exEs: 'Antes de la tormenta siempre hace bochorno.' },
            { de: 'die Prognose', es: 'el pronóstico', ex: 'Die Prognose für morgen ist gut.', exEs: 'El pronóstico para mañana es bueno.' },
            { de: 'sich abkühlen', es: 'refrescar', ex: 'Am Abend kühlt es sich schnell ab.', exEs: 'Por la tarde refresca rápido.' },
            { de: 'eisig', es: 'glacial', ex: 'Der Wind ist heute eisig.', exEs: 'Hoy el viento es glacial.' }
          ]
        },
        {
          thema: 'Wetterlage',
          items: [
            { de: 'der Meteorologe', es: 'el meteorólogo', ex: 'Der Meteorologe hat sich diesmal geirrt.', exEs: 'Esta vez el meteorólogo se equivocó.' },
            { de: 'die Windstärke', es: 'la fuerza del viento', ex: 'Die Windstärke nimmt am Abend zu.', exEs: 'La fuerza del viento aumenta por la tarde.' },
            { de: 'der Niederschlag', es: 'la precipitación', ex: 'Für morgen ist wenig Niederschlag gemeldet.', exEs: 'Para mañana anuncian pocas precipitaciones.' },
            { de: 'die Luftfeuchtigkeit', es: 'la humedad del aire', ex: 'Die Luftfeuchtigkeit ist heute sehr hoch.', exEs: 'Hoy la humedad es muy alta.' },
            { de: 'der Luftdruck', es: 'la presión atmosférica', ex: 'Bei niedrigem Luftdruck bekomme ich Kopfweh.', exEs: 'Con la presión baja me duele la cabeza.' },
            { de: 'die Kaltfront', es: 'el frente frío', ex: 'Am Abend kommt eine Kaltfront.', exEs: 'Por la tarde llega un frente frío.' },
            { de: 'der Regenbogen', es: 'el arcoíris', ex: 'Nach dem Regen kam ein Regenbogen.', exEs: 'Después de la lluvia salió un arcoíris.' },
            { de: 'der Wetterumschwung', es: 'el cambio de tiempo', ex: 'Der Wetterumschwung kam ganz plötzlich.', exEs: 'El cambio de tiempo llegó de repente.' },
            { de: 'frostig', es: 'gélido', ex: 'Die Nächte sind schon frostig.', exEs: 'Las noches ya son gélidas.' },
            { de: 'regnerisch', es: 'lluvioso', ex: 'Der April war dieses Jahr sehr regnerisch.', exEs: 'Este año abril fue muy lluvioso.' },
            { de: 'wolkig', es: 'nublado', ex: 'Morgen wird es wolkig, aber trocken.', exEs: 'Mañana estará nublado, pero seco.' },
            { de: 'drückend', es: 'sofocante', ex: 'Die Hitze ist heute richtig drückend.', exEs: 'Hoy el calor es realmente sofocante.' },
            { de: 'die Schneeflocke', es: 'el copo de nieve', ex: 'Die erste Schneeflocke ist schon gefallen.', exEs: 'Ya ha caído el primer copo de nieve.' },
            { de: 'das Glatteis', es: 'el hielo en la calzada', ex: 'Bei Glatteis fahre ich gar nicht.', exEs: 'Con hielo en la calzada no conduzco.' },
            { de: 'das Tauwetter', es: 'el deshielo', ex: 'Beim Tauwetter wird überall alles nass.', exEs: 'Con el deshielo se moja todo.' },
            { de: 'die Zeitumstellung', es: 'el cambio de hora', ex: 'Die Zeitumstellung mag ich gar nicht.', exEs: 'El cambio de hora no me gusta nada.' },
            { de: 'der Sonnenschutz', es: 'la protección solar', ex: 'Ohne Sonnenschutz gehe ich nicht raus.', exEs: 'Sin protección solar no salgo.' },
            { de: 'aufklaren', es: 'despejar', ex: 'Am Nachmittag soll es aufklaren.', exEs: 'Por la tarde dicen que despeja.' },
            { de: 'zugig', es: 'con corriente de aire', ex: 'Am Fenster ist es sehr zugig.', exEs: 'Junto a la ventana hay mucha corriente.' }
          ]
        },
        {
          thema: 'Über das Wetter reden',
          items: [
            { de: 'das Wetter', es: 'el tiempo (meteorológico)', ex: 'Wie wird das Wetter am Wochenende?', exEs: '¿Qué tiempo va a hacer el fin de semana?' },
            { de: 'gießen', es: 'llover a cántaros', ex: 'Draußen gießt es seit einer Stunde.', exEs: 'Fuera lleva una hora lloviendo a cántaros.' },
            { de: 'nieseln', es: 'chispear, lloviznar', ex: 'Es nieselt nur, der Schirm bleibt zu Hause.', exEs: 'Solo chispea, el paraguas se queda en casa.' },
            { de: 'zittern', es: 'tiritar, temblar', ex: 'Ich zittere, mir ist furchtbar kalt.', exEs: 'Estoy tiritando, tengo muchísimo frío.' },
            { de: 'die Wärme', es: 'el calor (agradable)', ex: 'Nach dem Winter tut die Wärme richtig gut.', exEs: 'Después del invierno el calor sienta de maravilla.' },
            { de: 'die Kälte', es: 'el frío', ex: 'Die Kälte im Jänner war kaum auszuhalten.', exEs: 'El frío de enero fue casi insoportable.' },
            { de: 'der Wetterwechsel', es: 'el cambio de tiempo', ex: 'Bei jedem Wetterwechsel tut mir der Kopf weh.', exEs: 'Con cada cambio de tiempo me duele la cabeza.' },
            { de: 'sich sonnen', es: 'tomar el sol', ex: 'Im Park sonnen sich heute alle.', exEs: 'Hoy en el parque está todo el mundo tomando el sol.' },
            { de: 'die Dämmerung', es: 'el anochecer, el crepúsculo', ex: 'In der Dämmerung wird es schnell kühl.', exEs: 'Al anochecer refresca enseguida.' },
            { de: 'dunkel werden', es: 'oscurecer', ex: 'Im Dezember wird es schon um vier dunkel.', exEs: 'En diciembre oscurece ya a las cuatro.' }
          ]
        }
      ],
      grammatik: [
        {
          regel: 'Plural',
          erklaerung: 'Terminaciones: -e (Tage), -en (Frauen), -er (Kinder), -s (Handys), o solo Umlaut (Väter). Se aprende con la palabra.',
          beispiele: [
            { de: 'der Tag → die Tage', es: 'el día → los días' },
            { de: 'das Kind → die Kinder', es: 'el niño → los niños' }
          ]
        },
        {
          regel: 'temporale Präposition im',
          erklaerung: '"im" + mes y + estación del año.',
          beispiele: [
            { de: 'Im Sommer ist es heiß.', es: 'En verano hace calor.' },
            { de: 'Im Jänner schneit es oft.', es: 'En enero nieva a menudo.' }
          ]
        },
        {
          regel: 'Pronomen man',
          erklaerung: 'Sujeto impersonal (= "se"). Siempre con verbo en 3ª persona singular.',
          beispiele: [
            { de: 'Im Winter trägt man einen Mantel.', es: 'En invierno se lleva abrigo.' },
            { de: 'Hier spricht man Deutsch.', es: 'Aquí se habla alemán.' }
          ]
        },
        {
          key: 'aussprache-h',
          regel: 'Aussprache: das h',
          erklaerung: 'Al principio de palabra la "h" se sopla, no es muda como en español: Haus, Hund. Detrás de una vocal no se oye y solo la alarga: gehen = «geen», Uhr = «ur». En una palabra compuesta vuelve a oírse: Hochhaus.',
          beispiele: [
            { de: 'Der Hund ist im Haus.', es: 'El perro está en casa. ("h" que se oye)' },
            { de: 'Wir gehen um zehn Uhr.', es: 'Vamos a las diez. ("h" muda)' },
            { de: 'Das ist sehr schön.', es: 'Eso es muy bonito. («ser»)' }
          ]
        },
        {
          key: 'es-als-subjekt-wetter',
          regel: 'Das unpersönliche es',
          erklaerung: 'Con el tiempo meteorológico el sujeto es siempre ES, aunque en español no haya ninguno: es regnet, es schneit, es ist kalt. No se puede quitar: «regnet» a secas no existe.',
          beispiele: [
            { de: 'Heute regnet es den ganzen Tag.', es: 'Hoy llueve todo el día.' },
            { de: 'Im Jänner ist es hier eiskalt.', es: 'En enero aquí hace un frío helador.' }
          ]
        },
        {
          key: 'wenn-satz-bedingung',
          regel: 'wenn: Bedingung',
          erklaerung: 'wenn = si (condición). Manda el verbo al FINAL de su parte. Si la frase empieza por wenn, la otra parte arranca directamente con el verbo: Wenn es regnet, BLEIBEN wir zu Hause.',
          beispiele: [
            { de: 'Wenn es regnet, bleiben wir zu Hause.', es: 'Si llueve, nos quedamos en casa.' },
            { de: 'Wir gehen schwimmen, wenn das Wetter schön ist.', es: 'Vamos a nadar si hace buen tiempo.' }
          ]
        },
        {
          key: 'adjektiv-steigerung-wetter',
          regel: 'wärmer als, am wärmsten',
          erklaerung: 'Para comparar se añade -er y se usa als: wärmer ALS gestern. Para el máximo, am …-sten: am wärmsten. Los adjetivos cortos con a, o, u suelen coger Umlaut: warm → wärmer, kalt → kälter.',
          beispiele: [
            { de: 'Heute ist es wärmer als gestern.', es: 'Hoy hace más calor que ayer.' },
            { de: 'Im Juli ist es am wärmsten.', es: 'En julio es cuando más calor hace.' }
          ]
        },
        {
          key: 'aussprache-ng-nk',
          regel: 'Aussprache: ng und nk',
          erklaerung: 'El grupo ng es UN solo sonido nasal, sin la g del final: Wohnung suena «vónung», no «vónun-g». En nk sí se oye la k: danke, trinken.',
          beispiele: [
            { de: 'Die Wohnung ist im Frühling sehr hell.', es: 'El piso en primavera es muy luminoso.' },
            { de: 'Bei Kälte trinke ich gern etwas Warmes.', es: 'Con frío me gusta beber algo caliente.' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'nach dem Wetter und der Vorhersage fragen',
          es: 'Preguntar por el tiempo y el pronóstico',
          wendungen: [
            { de: 'Wie ist das Wetter? – Es regnet.', es: '¿Qué tiempo hace? – Está lloviendo.' }
          ]
        },
        {
          funktion: 'das Wetter und den Himmel beschreiben',
          es: 'Describir el tiempo y el cielo',
          wendungen: [
            { de: 'Heute ist es schön / schlecht.', es: 'Hoy hace bueno / malo.' }
          ]
        },
        {
          funktion: 'über Hitze, Kälte und Unwetter sprechen',
          es: 'Hablar de frío, calor y tormentas',
          wendungen: [
            { de: 'Hier ist es im Winter sehr kalt.', es: 'Aquí en invierno hace mucho frío.' }
          ]
        },
        {
          funktion: 'Kleidung an das Wetter anpassen',
          es: 'Adaptar la ropa al tiempo',
          wendungen: [
            { de: 'Nimm einen Regenschirm mit!', es: '¡Llévate un paraguas!' }
          ]
        },
        {
          funktion: 'sich auf Hitze und Kälte einstellen',
          es: 'Prepararse para el frío o el calor',
          wendungen: [
            { de: 'Mir ist kalt.', es: 'Tengo frío.' }
          ]
        },
        {
          funktion: 'über Jahreszeiten sprechen',
          es: 'Hablar de las estaciones del año',
          wendungen: [
            { de: 'Welche Jahreszeit magst du am liebsten?', es: '¿Qué estación te gusta más?' }
          ]
        },
        {
          funktion: 'Klima und Wetter im Jahresverlauf vergleichen',
          es: 'Comparar el clima a lo largo del año',
          wendungen: [
            { de: 'Ist der Winter hier sehr hart?', es: '¿El invierno aquí es muy duro?' }
          ]
        },
        {
          funktion: 'Pläne vom Wetter abhängig machen',
          es: 'Hacer planes según el tiempo',
          wendungen: [
            { de: 'Was machen wir, wenn es regnet?', es: '¿Qué hacemos si llueve?' }
          ]
        }
      ]
    },

    {
      id: 'a11-l8',
      nr: 8,
      name: 'Du spielst super Fußball!',
      woerter: [
        {
          thema: 'Zukunftspläne',
          items: [
            { de: 'der Plan / planen', es: 'el plan / planear', ex: 'Wir planen eine Reise nach Italien.', exEs: 'Estamos planeando un viaje a Italia.' },
            { de: 'das Ziel', es: 'la meta', ex: 'Mein Ziel ist die B1-Prüfung.', exEs: 'Mi meta es el examen B1.' },
            { de: 'später', es: 'más tarde', ex: 'Das mache ich später, versprochen.', exEs: 'Eso lo hago luego, prometido.' },
            { de: 'nächstes Jahr', es: 'el año que viene', ex: 'Nächstes Jahr ziehe ich um.', exEs: 'El año que viene me mudo.' },
            { de: 'in Zukunft', es: 'en el futuro', ex: 'In Zukunft will ich mehr Sport machen.', exEs: 'En el futuro quiero hacer más deporte.' }
          ]
        },
        {
          thema: 'Freizeitaktivitäten',
          items: [
            { de: 'schwimmen', es: 'nadar', ex: 'Im Sommer gehe ich fast täglich schwimmen.', exEs: 'En verano voy a nadar casi a diario.' },
            { de: 'wandern', es: 'hacer senderismo', ex: 'Am Sonntag sind wir vier Stunden gewandert.', exEs: 'El domingo caminamos cuatro horas.' },
            { de: 'tanzen', es: 'bailar', ex: 'Auf der Hochzeit haben wir bis zwei getanzt.', exEs: 'En la boda bailamos hasta las dos.' },
            { de: 'singen', es: 'cantar', ex: 'Sie singt in einem Chor.', exEs: 'Ella canta en un coro.' },
            { de: 'malen', es: 'pintar', ex: 'Die Kinder malen ein Bild für die Oma.', exEs: 'Los niños pintan un dibujo para la abuela.' },
            { de: 'lesen', es: 'leer', ex: 'Vor dem Schlafen lese ich zwanzig Minuten.', exEs: 'Antes de dormir leo veinte minutos.' },
            { de: 'Musik hören', es: 'escuchar música', ex: 'Beim Kochen höre ich Musik.', exEs: 'Cuando cocino escucho música.' },
            { de: 'Rad fahren', es: 'ir en bici', ex: 'In Wien fahre ich überall mit dem Rad.', exEs: 'En Viena voy a todas partes en bici.' },
            { de: 'Fußball spielen', es: 'jugar al fútbol', ex: 'Am Mittwoch spielen wir Fußball.', exEs: 'Los miércoles jugamos al fútbol.' },
            { de: 'ins Kino gehen', es: 'ir al cine', ex: 'Heute Abend gehen wir ins Kino.', exEs: 'Esta noche vamos al cine.' },
            { de: 'joggen', es: 'salir a correr', ex: 'Ich jogge dreimal pro Woche im Park.', exEs: 'Salgo a correr tres veces por semana en el parque.' },
            { de: 'klettern', es: 'escalar', ex: 'Am Wochenende gehen wir klettern.', exEs: 'El fin de semana vamos a escalar.' },
            { de: 'reisen', es: 'viajar', ex: 'Sie reist am liebsten allein.', exEs: 'Le gusta más viajar sola.' },
            { de: 'kochen lernen', es: 'aprender a cocinar', ex: 'Dieses Jahr will ich kochen lernen.', exEs: 'Este año quiero aprender a cocinar.' },
            { de: 'ins Theater gehen', es: 'ir al teatro', ex: 'Einmal im Monat gehen wir ins Theater.', exEs: 'Una vez al mes vamos al teatro.' },
            { de: 'Freunde treffen', es: 'quedar con amigos', ex: 'Freitags treffe ich immer Freunde.', exEs: 'Los viernes siempre quedo con amigos.' },
            { de: 'fotografieren', es: 'hacer fotos', ex: 'Im Urlaub fotografiere ich viel.', exEs: 'En vacaciones hago muchas fotos.' },
            { de: 'Gitarre spielen', es: 'tocar la guitarra', ex: 'Mein Sohn lernt Gitarre spielen.', exEs: 'Mi hijo está aprendiendo a tocar la guitarra.' },
            { de: 'spazieren gehen', es: 'pasear', ex: 'Nach dem Essen gehen wir spazieren.', exEs: 'Después de comer salimos a pasear.' },
            { de: 'Zeit haben', es: 'tener tiempo', ex: 'Am Samstag habe ich den ganzen Tag Zeit.', exEs: 'El sábado tengo todo el día libre.' }
          ]
        },
        {
          thema: 'Hobbys',
          items: [
            { de: 'das Hobby', es: 'el hobby', ex: 'Fotografieren ist mein liebstes Hobby.', exEs: 'La fotografía es mi hobby favorito.' },
            { de: 'der Sport', es: 'el deporte', ex: 'Sport mache ich dreimal die Woche.', exEs: 'Hago deporte tres veces por semana.' },
            { de: 'die Musik', es: 'la música', ex: 'Ohne Musik geht bei mir gar nichts.', exEs: 'Sin música yo no funciono.' },
            { de: 'das Kochen', es: 'la cocina', ex: 'Kochen entspannt mich nach der Arbeit.', exEs: 'Cocinar me relaja después del trabajo.' },
            { de: 'die Fotografie', es: 'la fotografía', ex: 'Die Fotografie ist ein teures Hobby.', exEs: 'La fotografía es un hobby caro.' },
            { de: 'der Verein', es: 'el club / la asociación', ex: 'Er spielt in einem Fußballverein.', exEs: 'Juega en un club de fútbol.' }
          ]
        },
        {
          thema: 'Können und Vorlieben',
          items: [
            { de: 'gern / lieber / am liebsten', es: 'me gusta / prefiero / lo que más', ex: 'Am liebsten koche ich mit Freunden.', exEs: 'Lo que más me gusta es cocinar con amigos.' },
            { de: 'gut / schlecht in etwas sein', es: 'dársele bien / mal algo', ex: 'Ich bin ziemlich schlecht in Mathe.', exEs: 'Se me da bastante mal la mates.' },
            { de: 'Lust haben', es: 'tener ganas', ex: 'Hast du Lust auf einen Kaffee?', exEs: '¿Te apetece un café?' },
            { de: 'das Interesse', es: 'el interés', ex: 'Für Politik habe ich wenig Interesse.', exEs: 'Por la política tengo poco interés.' },
            { de: 'die Mannschaft', es: 'el equipo', ex: 'Unsere Mannschaft hat wieder gewonnen.', exEs: 'Nuestro equipo ha vuelto a ganar.' },
            { de: 'das Training', es: 'el entrenamiento', ex: 'Das Training ist dienstags um sieben.', exEs: 'El entrenamiento es los martes a las siete.' },
            { de: 'anfangen / aufhören', es: 'empezar / dejar de', ex: 'Ich habe mit dem Rauchen aufgehört.', exEs: 'He dejado de fumar.' },
            { de: 'üben', es: 'practicar', ex: 'Man muss jeden Tag ein bisschen üben.', exEs: 'Hay que practicar un poco cada día.' },
            { de: 'das Talent', es: 'el talento', ex: 'Sie hat wirklich Talent zum Singen.', exEs: 'Tiene mucho talento para cantar.' }
          ]
        },
        {
          thema: 'Freizeit & Sport',
          items: [
            { de: 'die Freizeit', es: 'el tiempo libre', ex: 'In meiner Freizeit lese ich viel.', exEs: 'En mi tiempo libre leo mucho.' },
            { de: 'der Ausflug', es: 'la excursión', ex: 'Am Sonntag machen wir einen Ausflug.', exEs: 'El domingo hacemos una excursión.' },
            { de: 'das Mitglied', es: 'el socio, el miembro', ex: 'Ich bin Mitglied in einem Sportverein.', exEs: 'Soy socio de un club deportivo.' },
            { de: 'der Wettkampf', es: 'la competición', ex: 'Am Samstag ist ein großer Wettkampf.', exEs: 'El sábado hay una competición grande.' },
            { de: 'gewinnen', es: 'ganar', ex: 'Unsere Mannschaft hat gewonnen.', exEs: 'Nuestro equipo ha ganado.' },
            { de: 'verlieren', es: 'perder', ex: 'Wir haben zwei zu eins verloren.', exEs: 'Hemos perdido dos a uno.' },
            { de: 'das Spiel', es: 'el partido, el juego', ex: 'Das Spiel beginnt um vier.', exEs: 'El partido empieza a las cuatro.' },
            { de: 'der Ball', es: 'el balón', ex: 'Der Ball ist über den Zaun geflogen.', exEs: 'El balón ha volado por encima de la valla.' },
            { de: 'die Halle', es: 'el pabellón', ex: 'Im Winter trainieren wir in der Halle.', exEs: 'En invierno entrenamos en el pabellón.' },
            { de: 'der Trainer / die Trainerin', es: 'el entrenador / la entrenadora', ex: 'Der Trainer kommt aus Kroatien.', exEs: 'El entrenador es de Croacia.' },
            { de: 'die Ausrüstung', es: 'el equipamiento', ex: 'Die Ausrüstung ist ziemlich teuer.', exEs: 'El equipamiento es bastante caro.' },
            { de: 'sich anmelden', es: 'apuntarse', ex: 'Ich melde mich für den Kurs an.', exEs: 'Me apunto al curso.' },
            { de: 'teilnehmen', es: 'participar', ex: 'Ich nehme am Turnier teil.', exEs: 'Participo en el torneo.' },
            { de: 'das Konzert', es: 'el concierto', ex: 'Das Konzert war komplett ausverkauft.', exEs: 'El concierto estaba completamente agotado.' },
            { de: 'das Instrument', es: 'el instrumento', ex: 'Welches Instrument spielst du?', exEs: '¿Qué instrumento tocas?' },
            { de: 'die Ausstellung', es: 'la exposición', ex: 'Die Ausstellung läuft noch bis Mai.', exEs: 'La exposición dura hasta mayo.' },
            { de: 'der Roman', es: 'la novela', ex: 'Ich lese gerade einen spannenden Roman.', exEs: 'Estoy leyendo una novela apasionante.' },
            { de: 'die Serie', es: 'la serie', ex: 'Diese Serie schaue ich fast jeden Abend.', exEs: 'Esta serie la veo casi todas las noches.' },
            { de: 'basteln', es: 'hacer manualidades', ex: 'Meine Tochter bastelt sehr gern.', exEs: 'A mi hija le gusta mucho hacer manualidades.' },
            { de: 'sammeln', es: 'coleccionar', ex: 'Mein Sohn sammelt alte Münzen.', exEs: 'Mi hijo colecciona monedas antiguas.' },
            { de: 'sich entspannen', es: 'relajarse', ex: 'Am Wochenende entspanne ich mich.', exEs: 'El fin de semana me relajo.' },
            { de: 'das Turnier', es: 'el torneo', ex: 'Das Turnier dauert das ganze Wochenende.', exEs: 'El torneo dura todo el fin de semana.' }
          ]
        },
        {
          thema: 'Kultur & Freizeit',
          items: [
            { de: 'die Eintrittskarte', es: 'la entrada', ex: 'Die Eintrittskarte habe ich schon online gekauft.', exEs: 'La entrada ya la he comprado por internet.' },
            { de: 'die Bühne', es: 'el escenario', ex: 'Auf der Bühne steht schon die Band.', exEs: 'En el escenario ya está el grupo.' },
            { de: 'das Publikum', es: 'el público', ex: 'Das Publikum hat lange geklatscht.', exEs: 'El público aplaudió mucho rato.' },
            { de: 'der Chor', es: 'el coro', ex: 'Ich singe seit drei Jahren im Chor.', exEs: 'Canto en el coro desde hace tres años.' },
            { de: 'die Band', es: 'el grupo de música', ex: 'Die Band spielt heute zum letzten Mal.', exEs: 'El grupo toca hoy por última vez.' },
            { de: 'das Kartenspiel', es: 'el juego de cartas', ex: 'Am Abend machen wir ein Kartenspiel.', exEs: 'Por la noche jugamos a las cartas.' },
            { de: 'das Brettspiel', es: 'el juego de mesa', ex: 'Sonntags spielen wir immer ein Brettspiel.', exEs: 'Los domingos jugamos siempre a un juego de mesa.' },
            { de: 'das Rätsel', es: 'el pasatiempo, el acertijo', ex: 'Mein Vater löst jeden Tag ein Rätsel.', exEs: 'Mi padre resuelve un pasatiempo cada día.' },
            { de: 'die Gartenarbeit', es: 'el trabajo de jardín', ex: 'Die Gartenarbeit entspannt mich sehr.', exEs: 'El trabajo de jardín me relaja mucho.' },
            { de: 'der Ausgleich', es: 'la desconexión, el contrapeso', ex: 'Sport ist mein Ausgleich zur Arbeit.', exEs: 'El deporte es mi desconexión del trabajo.' },
            { de: 'die Leidenschaft', es: 'la pasión', ex: 'Fotografieren ist meine große Leidenschaft.', exEs: 'La fotografía es mi gran pasión.' },
            { de: 'der Anfänger', es: 'el principiante', ex: 'Als Anfänger macht man viele Fehler.', exEs: 'De principiante se cometen muchos errores.' },
            { de: 'fortgeschritten', es: 'avanzado', ex: 'Ich bin beim Klettern schon fortgeschritten.', exEs: 'En escalada ya estoy en nivel avanzado.' },
            { de: 'die Mitgliedschaft', es: 'la membresía', ex: 'Die Mitgliedschaft kostet zwanzig Euro im Monat.', exEs: 'La membresía cuesta veinte euros al mes.' },
            { de: 'die Abwechslung', es: 'la variedad, el cambio', ex: 'Ein Hobby bringt Abwechslung in den Alltag.', exEs: 'Una afición trae variedad a la rutina.' },
            { de: 'genießen', es: 'disfrutar', ex: 'Ich genieße die Ruhe am Morgen.', exEs: 'Disfruto de la tranquilidad de la mañana.' },
            { de: 'begeistert', es: 'entusiasmado', ex: 'Die Kinder waren total begeistert.', exEs: 'Los niños estaban entusiasmadísimos.' },
            { de: 'der Ehrgeiz', es: 'la ambición', ex: 'Ohne Ehrgeiz kommt man nicht weit.', exEs: 'Sin ambición no se llega lejos.' },
            { de: 'das Tanzen', es: 'el baile', ex: 'Das Tanzen habe ich erst spät entdeckt.', exEs: 'El baile lo descubrí tarde.' },
            { de: 'die Vorstellung', es: 'la sesión, la función', ex: 'Die Vorstellung beginnt um zwanzig Uhr.', exEs: 'La función empieza a las ocho.' }
          ]
        },
        {
          thema: 'Kurse & Sammeln',
          items: [
            { de: 'das Vergnügen', es: 'el placer', ex: 'Das war mir ein großes Vergnügen.', exEs: 'Ha sido un gran placer.' },
            { de: 'die Begeisterung', es: 'el entusiasmo', ex: 'Die Begeisterung hielt genau zwei Wochen.', exEs: 'El entusiasmo duró exactamente dos semanas.' },
            { de: 'die Neugier', es: 'la curiosidad', ex: 'Die Neugier hat mich hergebracht.', exEs: 'La curiosidad me trajo aquí.' },
            { de: 'die Fähigkeit', es: 'la capacidad', ex: 'Diese Fähigkeit lernt man mit der Zeit.', exEs: 'Esa capacidad se aprende con el tiempo.' },
            { de: 'der Wettbewerb', es: 'la competición', ex: 'Der Wettbewerb findet im Mai statt.', exEs: 'La competición es en mayo.' },
            { de: 'die Auszeichnung', es: 'la distinción', ex: 'Für das Projekt gab es eine Auszeichnung.', exEs: 'Por el proyecto hubo una distinción.' },
            { de: 'der Workshop', es: 'el taller', ex: 'Am Samstag gibt es einen Workshop.', exEs: 'El sábado hay un taller.' },
            { de: 'die Gruppe', es: 'el grupo', ex: 'Unsere Gruppe ist sehr gemischt.', exEs: 'Nuestro grupo es muy variado.' },
            { de: 'der Teilnehmer', es: 'el participante', ex: 'Jeder Teilnehmer bekommt ein Zertifikat.', exEs: 'Cada participante recibe un certificado.' },
            { de: 'das Material', es: 'el material', ex: 'Das Material ist im Preis inbegriffen.', exEs: 'El material está incluido en el precio.' },
            { de: 'der Raum', es: 'la sala', ex: 'Der Raum ist für zwanzig Leute gedacht.', exEs: 'La sala es para veinte personas.' },
            { de: 'der Spaß', es: 'la diversión', ex: 'Der Spaß steht bei uns im Vordergrund.', exEs: 'Para nosotros lo primero es divertirse.' },
            { de: 'die Langeweile', es: 'el aburrimiento', ex: 'Gegen Langeweile hilft ein Hobby.', exEs: 'Contra el aburrimiento ayuda una afición.' },
            { de: 'die Routine', es: 'la rutina', ex: 'Ohne Routine schaffe ich es nicht.', exEs: 'Sin rutina no lo consigo.' },
            { de: 'die Entspannung', es: 'la relajación', ex: 'Musik ist für mich reine Entspannung.', exEs: 'La música para mí es pura relajación.' },
            { de: 'der Zeitvertreib', es: 'el pasatiempo', ex: 'Kartenspielen ist ein guter Zeitvertreib.', exEs: 'Jugar a las cartas es un buen pasatiempo.' },
            { de: 'die Sammlung', es: 'la colección', ex: 'Meine Sammlung wächst jedes Jahr.', exEs: 'Mi colección crece cada año.' },
            { de: 'die Bücherei', es: 'la biblioteca pública', ex: 'Die Bücherei hat auch Hörbücher.', exEs: 'La biblioteca también tiene audiolibros.' },
            { de: 'das Hörbuch', es: 'el audiolibro', ex: 'Im Auto höre ich immer ein Hörbuch.', exEs: 'En el coche escucho siempre un audiolibro.' }
          ]
        },
        {
          thema: 'Sportarten',
          items: [
            { de: 'das Skifahren', es: 'el esquí', ex: 'Zum Skifahren fahren wir nach Tirol.', exEs: 'Para esquiar vamos al Tirol.' },
            { de: 'das Tennis', es: 'el tenis', ex: 'Am Dienstag spiele ich Tennis mit einem Kollegen.', exEs: 'Los martes juego al tenis con un compañero.' },
            { de: 'der Basketball', es: 'el baloncesto', ex: 'Basketball ist mir zu schnell.', exEs: 'El baloncesto me resulta demasiado rápido.' },
            { de: 'der Volleyball', es: 'el voleibol', ex: 'Im Sommer spielen wir Volleyball im Park.', exEs: 'En verano jugamos al voleibol en el parque.' },
            { de: 'das Yoga', es: 'el yoga', ex: 'Yoga hilft mir gegen den Stress.', exEs: 'El yoga me ayuda contra el estrés.' },
            { de: 'das Fitnessstudio', es: 'el gimnasio', ex: 'Ich habe eine Karte fürs Fitnessstudio.', exEs: 'Tengo abono para el gimnasio.' },
            { de: 'das Eislaufen', es: 'el patinaje sobre hielo', ex: 'Im Winter gehen wir vor dem Rathaus eislaufen.', exEs: 'En invierno vamos a patinar delante del ayuntamiento.' },
            { de: 'der Handball', es: 'el balonmano', ex: 'In der Schule habe ich Handball gespielt.', exEs: 'En el colegio jugaba al balonmano.' },
            { de: 'der Marathon', es: 'el maratón', ex: 'Im April läuft halb Wien den Marathon.', exEs: 'En abril media Viena corre el maratón.' },
            { de: 'das Turnen', es: 'la gimnasia', ex: 'Meine Tochter geht zum Turnen.', exEs: 'Mi hija va a gimnasia.' }
          ]
        },
        {
          thema: 'Musik & Kreatives',
          items: [
            { de: 'das Klavier', es: 'el piano', ex: 'Sie spielt seit ihrer Kindheit Klavier.', exEs: 'Toca el piano desde pequeña.' },
            { de: 'die Geige', es: 'el violín', ex: 'Die Geige ist schwerer, als sie aussieht.', exEs: 'El violín es más difícil de lo que parece.' },
            { de: 'das Schlagzeug', es: 'la batería', ex: 'Für ein Schlagzeug ist meine Wohnung zu klein.', exEs: 'Mi piso es demasiado pequeño para una batería.' },
            { de: 'zeichnen', es: 'dibujar', ex: 'Im Urlaub zeichne ich gern.', exEs: 'En vacaciones me gusta dibujar.' },
            { de: 'nähen', es: 'coser', ex: 'Meine Oma hat mir das Nähen beigebracht.', exEs: 'Mi abuela me enseñó a coser.' },
            { de: 'stricken', es: 'tejer, hacer punto', ex: 'Im Winter stricke ich abends vor dem Fernseher.', exEs: 'En invierno hago punto por la noche delante de la tele.' },
            { de: 'das Lied', es: 'la canción', ex: 'Dieses Lied kenne ich aus dem Radio.', exEs: 'Esta canción me suena de la radio.' },
            { de: 'der Liedtext', es: 'la letra de la canción', ex: 'Den Liedtext verstehe ich nur zur Hälfte.', exEs: 'La letra solo la entiendo a medias.' },
            { de: 'der Rhythmus', es: 'el ritmo', ex: 'Beim Tanzen komme ich aus dem Rhythmus.', exEs: 'Bailando pierdo el ritmo.' }
          ]
        }
      ],
      grammatik: [
        {
          regel: 'Modalverben können / wollen',
          erklaerung: 'ich kann, du kannst, er kann · ich will, du willst, er will. 1ª y 3ª persona sin terminación.',
          beispiele: [
            { de: 'Ich kann gut schwimmen.', es: 'Sé nadar bien.' },
            { de: 'Willst du mitkommen?', es: '¿Quieres venir?' }
          ]
        },
        {
          regel: 'Satzklammer',
          erklaerung: 'El modal va en 2ª posición y el infinitivo al FINAL de la frase.',
          beispiele: [
            { de: 'Ich kann am Wochenende Fußball spielen.', es: 'Puedo jugar al fútbol el fin de semana.' },
            { de: 'Wir wollen nächstes Jahr nach Wien ziehen.', es: 'Queremos mudarnos a Viena el año que viene.' }
          ]
        },
        {
          key: 'haufigkeitsangaben-mit-jed',
          regel: 'jeder, jede, jedes (y por qué jeden)',
          erklaerung: 'Significa «cada» y «todos los», y copia las terminaciones de der/die/das: der Tag → jeder Tag, die Woche → jede Woche, das Jahr → jedes Jahr. Si te sabes el artículo, te sabes la forma.',
          detail:
            'Lo que despista es "jeden". No es otra palabra: es el masculino en acusativo, igual que der se convierte en den. Femenino y neutro no cambian en acusativo, y por eso solo el masculino parece tener una forma de más.\n\nY aquí está el truco de las expresiones de tiempo: «todos los días», «cada lunes» van SIEMPRE en acusativo y sin preposición. Como Tag, Montag, Abend y Morgen son masculinos, casi todas salen con jeden — de ahí que uno se acostumbre a "jeden Tag" y luego le extrañe "jede Woche".\n\nEn plural no existe: se dice alle. alle Tage, alle Wochen, alle Jahre.',
          beispiele: [
            { de: 'Ich gehe jeden Tag laufen.', es: 'Salgo a correr todos los días. (der Tag, en acusativo)' },
            { de: 'Jede Woche habe ich zwei Kurse.', es: 'Cada semana tengo dos cursos. (die Woche)' },
            { de: 'Jedes Wochenende spielen wir Fußball.', es: 'Cada fin de semana jugamos al fútbol. (das Wochenende)' },
            { de: 'Jeder Tag ist anders.', es: 'Cada día es distinto. (aquí es el sujeto: jeder)' }
          ],
          tabelle: {
            title: 'jed- según el género y el caso',
            headers: ['', 'der Tag', 'die Woche', 'das Jahr'],
            rows: [
              ['Nominativ (sujeto)', 'jeder Tag', 'jede Woche', 'jedes Jahr'],
              ['Akkusativ (complemento y tiempo)', 'jeden Tag', 'jede Woche', 'jedes Jahr'],
              ['Dativ', 'jedem Tag', 'jeder Woche', 'jedem Jahr']
            ]
          }
        },
        {
          key: 'aussprache-er-ig',
          regel: 'Aussprache: -er und -ig am Wortende',
          erklaerung: 'Al final de palabra, "-er" suena como una "a" floja: Vater = «fata», Mutter = «muta». Y "-ig" suena como «ich»: wichtig = «wichtich» (en Austria y el sur, a menudo «ik»). Antes de vocal la "r" sí se oye: rot, Frau.',
          beispiele: [
            { de: 'Meine Mutter und mein Vater.', es: 'Mi madre y mi padre. («muta», «fata»)' },
            { de: 'Das ist sehr wichtig.', es: 'Eso es muy importante. («wichtich»)' },
            { de: 'Die Frau trägt ein rotes Kleid.', es: 'La mujer lleva un vestido rojo. ("r" que se oye)' }
          ]
        },
        {
          key: 'gern-lieber-am-liebsten',
          regel: 'gern, lieber, am liebsten',
          erklaerung: 'Para decir lo que te gusta hacer se pone gern detrás del verbo: Ich spiele GERN Fußball. La comparación es irregular: gern → lieber → am liebsten.',
          beispiele: [
            { de: 'Ich spiele gern Fußball.', es: 'Me gusta jugar al fútbol.' },
            { de: 'Im Winter gehe ich lieber schwimmen.', es: 'En invierno prefiero ir a nadar.' },
            { de: 'Am liebsten wandere ich in den Bergen.', es: 'Lo que más me gusta es hacer senderismo en la montaña.' }
          ]
        },
        {
          key: 'sport-spielen-machen-fahren',
          regel: 'spielen, machen oder fahren?',
          erklaerung: 'Cada deporte lleva su verbo y no se pueden cambiar. Con pelota: SPIELEN (Fußball spielen). Con vehículo o tabla: FAHREN (Rad fahren, Ski fahren). Los demás suelen ir con MACHEN (Yoga machen) o son verbos propios (schwimmen, laufen).',
          beispiele: [
            { de: 'Am Sonntag spielen wir Volleyball.', es: 'El domingo jugamos al voleibol.' },
            { de: 'Im Winter fahre ich gern Ski.', es: 'En invierno me gusta esquiar.' },
            { de: 'Zweimal pro Woche mache ich Yoga.', es: 'Dos veces por semana hago yoga.' }
          ]
        },
        {
          key: 'koennen-faehigkeit-moeglichkeit',
          regel: 'können: Fähigkeit oder Möglichkeit',
          erklaerung: 'können sirve para dos cosas distintas: saber hacer algo (Ich kann schwimmen) y tener la posibilidad de hacerlo (Heute kann ich nicht, ich arbeite). El contexto dice cuál de las dos es.',
          beispiele: [
            { de: 'Ich kann gut schwimmen.', es: 'Sé nadar bien.' },
            { de: 'Heute kann ich leider nicht mitkommen.', es: 'Hoy no puedo acompañaros.' }
          ]
        },
        {
          key: 'haeufigkeit-adverbien',
          regel: 'immer, oft, manchmal, nie',
          erklaerung: 'Estos adverbios dicen cada cuánto y van normalmente justo detrás del verbo conjugado: Ich gehe IMMER am Montag ins Training. De más a menos: immer, meistens, oft, manchmal, selten, nie.',
          beispiele: [
            { de: 'Ich gehe immer am Montag ins Training.', es: 'Siempre voy a entrenar los lunes.' },
            { de: 'Sie spielt selten Tennis.', es: 'Juega al tenis pocas veces.' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'sagen, wie oft man etwas macht',
          es: 'Decir con qué frecuencia haces algo',
          wendungen: [
            { de: 'Wie oft machst du Sport?', es: '¿Con qué frecuencia haces deporte?' }
          ]
        },
        {
          funktion: 'über Gewohnheiten und Routinen sprechen',
          es: 'Hablar de hábitos y rutinas',
          wendungen: [
            { de: 'Treibst du regelmäßig Sport?', es: '¿Haces deporte con regularidad?' }
          ]
        },
        {
          funktion: 'über Fähigkeiten sprechen',
          es: 'Hablar de habilidades',
          wendungen: [
            { de: 'Du spielst super Fußball!', es: '¡Juegas al fútbol genial!' }
          ]
        },
        {
          funktion: 'über Hobbys und Interessen sprechen',
          es: 'Hablar de aficiones e intereses',
          wendungen: [
            { de: 'Was machst du in deiner Freizeit?', es: '¿Qué haces en tu tiempo libre?' }
          ]
        },
        {
          funktion: 'über Pläne und Kurse sprechen',
          es: 'Hablar de planes y cursos futuros',
          wendungen: [
            { de: 'Ich will einen Deutschkurs machen.', es: 'Quiero hacer un curso de alemán.' }
          ]
        },
        {
          funktion: 'über Sport und Wettkämpfe sprechen',
          es: 'Hablar de deportes y competiciones',
          wendungen: [
            { de: 'Wer hat gestern gewonnen?', es: '¿Quién ganó ayer?' }
          ]
        },
        {
          funktion: 'jemanden einladen und reagieren',
          es: 'Invitar a alguien y reaccionar',
          wendungen: [
            { de: 'Hast du Lust, am Samstag mitzukommen?', es: '¿Te apetece venir el sábado?' }
          ]
        },
        {
          funktion: 'widersprechen und korrigieren',
          es: 'Llevar la contraria y corregir',
          wendungen: [
            { de: 'Das stimmt nicht.', es: 'Eso no es cierto.' }
          ]
        }
      ]
    }
  ]
};
