// Miteinander A2.1 (Tomo 3) — Lektionen 1–8.
// Cada regla: erklaerung (resumen), detail (explicación larga, párrafos con \n\n),
// tabelle (opcional), beispiele y mehr (más ejemplos al desplegar).

export const A21 = {
  id: 'a21',
  name: 'A2.1',
  label: 'Tomo 3 · A2.1',
  lektionen: [
    // ==================== LEKTION 1 ====================
    {
      id: 'a21-l1',
      legacyId: 'l1',
      nr: 1,
      name: 'Weggehen & Ankommen',
      woerter: [
        {
          thema: 'Gefühle',
          items: [
            { de: 'die Freude', es: 'la alegría', ex: 'Die Freude über das Geschenk war groß.', exEs: 'La alegría por el regalo fue enorme.' },
            { de: 'sich freuen (über + Akk.)', es: 'alegrarse (de algo)', ex: 'Ich freue mich sehr über deinen Brief.', exEs: 'Me alegro mucho de tu carta.' },
            { de: 'die Angst, Angst haben (vor + Dat.)', es: 'el miedo, tener miedo (de)', ex: 'Mein Sohn hat Angst vor dem Hund.', exEs: 'Mi hijo tiene miedo del perro.' },
            { de: 'die Wut, wütend', es: 'la rabia, enfadado', ex: 'Er war so wütend, dass er nichts gesagt hat.', exEs: 'Estaba tan enfadado que no dijo nada.' },
            { de: 'sich ärgern (über + Akk.)', es: 'enfadarse (por algo)', ex: 'Ich ärgere mich über den Lärm im Haus.', exEs: 'Me enfado por el ruido del edificio.' },
            { de: 'die Trauer, traurig', es: 'la tristeza, triste', ex: 'Nach dem Abschied war ich ein paar Tage traurig.', exEs: 'Después de la despedida estuve triste unos días.' },
            { de: 'die Aufregung, aufgeregt', es: 'los nervios, nervioso (por algo)', ex: 'Vor der Prüfung war ich richtig aufgeregt.', exEs: 'Antes del examen estaba muy nervioso.' },
            { de: 'nervös', es: 'nervioso (de carácter)', ex: 'Bei Telefonaten auf Deutsch werde ich nervös.', exEs: 'Con las llamadas en alemán me pongo nervioso.' },
            { de: 'glücklich', es: 'feliz', ex: 'Seit sie in Wien wohnt, ist sie sehr glücklich.', exEs: 'Desde que vive en Viena está muy feliz.' },
            { de: 'zufrieden', es: 'satisfecho, contento', ex: 'Mit meiner neuen Wohnung bin ich sehr zufrieden.', exEs: 'Estoy muy contento con mi piso nuevo.' },
            { de: 'enttäuscht (von + Dat.)', es: 'decepcionado (por)', ex: 'Ich war von dem Film ziemlich enttäuscht.', exEs: 'La película me decepcionó bastante.' },
            { de: 'stolz (auf + Akk.)', es: 'orgulloso (de)', ex: 'Meine Eltern sind stolz auf meinen Abschluss.', exEs: 'Mis padres están orgullosos de mi título.' },
            { de: 'erleichtert', es: 'aliviado', ex: 'Als der Brief endlich kam, war ich erleichtert.', exEs: 'Cuando por fin llegó la carta, me sentí aliviado.' },
            { de: 'überrascht', es: 'sorprendido', ex: 'Ich war überrascht, wie schnell das ging.', exEs: 'Me sorprendió lo rápido que fue.' },
            { de: 'einsam', es: 'solo, solitario', ex: 'Am Anfang habe ich mich in der neuen Stadt einsam gefühlt.', exEs: 'Al principio me sentí solo en la ciudad nueva.' },
            { de: 'unsicher', es: 'inseguro', ex: 'Beim Sprechen bin ich noch unsicher.', exEs: 'Al hablar todavía me siento inseguro.' },
            { de: 'gestresst', es: 'estresado', ex: 'Am Monatsende bin ich immer gestresst.', exEs: 'A final de mes siempre estoy estresado.' },
            { de: 'entspannt', es: 'relajado', ex: 'Am Sonntag bin ich endlich entspannt.', exEs: 'El domingo por fin estoy relajado.' },
            { de: 'sich wohlfühlen', es: 'sentirse a gusto', ex: 'In diesem Café fühle ich mich wohl.', exEs: 'En esta cafetería me siento a gusto.' },
            { de: 'sich Sorgen machen (um + Akk.)', es: 'preocuparse (por)', ex: 'Meine Mutter macht sich Sorgen um mich.', exEs: 'Mi madre se preocupa por mí.' }
          ]
        },
        {
          thema: 'Ankommen und Weggehen',
          items: [
            { de: 'die Heimat', es: 'la tierra natal', ex: 'Meine Heimat ist ein kleines Dorf im Süden.', exEs: 'Mi tierra es un pueblo pequeño del sur.' },
            { de: 'das Heimweh, Heimweh haben', es: 'la morriña, echar de menos su tierra', ex: 'Im Winter habe ich manchmal Heimweh.', exEs: 'En invierno a veces echo de menos mi tierra.' },
            { de: 'auswandern', es: 'emigrar', ex: 'Meine Großeltern sind nach Argentinien ausgewandert.', exEs: 'Mis abuelos emigraron a Argentina.' },
            { de: 'ankommen', es: 'llegar', ex: 'Der Zug kommt um halb acht in Wien an.', exEs: 'El tren llega a Viena a las siete y media.' },
            { de: 'weggehen', es: 'irse, marcharse', ex: 'Wir gehen um zehn weg, sonst wird es zu spät.', exEs: 'Nos vamos a las diez, si no se hace tarde.' },
            { de: 'sich verabschieden (von + Dat.)', es: 'despedirse (de)', ex: 'Ich habe mich von allen Kollegen verabschiedet.', exEs: 'Me despedí de todos los compañeros.' },
            { de: 'der Abschied', es: 'la despedida', ex: 'Der Abschied am Bahnhof war kurz.', exEs: 'La despedida en la estación fue corta.' },
            { de: 'die Ankunft', es: 'la llegada', ex: 'Nach der Ankunft haben wir sofort gegessen.', exEs: 'Después de la llegada comimos enseguida.' },
            { de: 'der Anfang, am Anfang', es: 'el principio, al principio', ex: 'Am Anfang war alles neu für mich.', exEs: 'Al principio todo era nuevo para mí.' },
            { de: 'sich gewöhnen (an + Akk.)', es: 'acostumbrarse (a)', ex: 'An das Wetter habe ich mich schnell gewöhnt.', exEs: 'Al clima me acostumbré rápido.' },
            { de: 'fremd', es: 'extraño, ajeno', ex: 'Die Sprache war mir am Anfang völlig fremd.', exEs: 'La lengua me resultaba del todo ajena al principio.' },
            { de: 'vermissen', es: 'echar de menos', ex: 'Ich vermisse das Essen meiner Mutter.', exEs: 'Echo de menos la comida de mi madre.' },
            { de: 'die Erinnerung', es: 'el recuerdo', ex: 'An den Sommer habe ich eine schöne Erinnerung.', exEs: 'De aquel verano tengo un buen recuerdo.' },
            { de: 'erleben', es: 'vivir (una experiencia)', ex: 'In Wien habe ich viel Neues erlebt.', exEs: 'En Viena he vivido muchas cosas nuevas.' },
            { de: 'sich verändern', es: 'cambiar (uno mismo)', ex: 'In zwei Jahren hat sich mein Leben sehr verändert.', exEs: 'En dos años mi vida ha cambiado mucho.' }
          ]
        },
        {
          thema: 'Adjektive mit un- und -los',
          items: [
            { de: 'unzufrieden', es: 'insatisfecho', ex: 'Mit dem Ergebnis bin ich unzufrieden.', exEs: 'Estoy insatisfecho con el resultado.' },
            { de: 'unfreundlich', es: 'antipático', ex: 'Der Kellner war heute ziemlich unfreundlich.', exEs: 'El camarero estuvo hoy bastante antipático.' },
            { de: 'unglücklich', es: 'infeliz', ex: 'Nach dem Streit war sie den ganzen Tag unglücklich.', exEs: 'Después de la discusión estuvo infeliz todo el día.' },
            { de: 'ungeduldig', es: 'impaciente', ex: 'Beim Warten werde ich schnell ungeduldig.', exEs: 'Esperando me impaciento enseguida.' },
            { de: 'unbekannt', es: 'desconocido', ex: 'Diese Gegend ist mir noch unbekannt.', exEs: 'Esta zona todavía me es desconocida.' },
            { de: 'arbeitslos', es: 'en paro', ex: 'Nach der Krise war mein Bruder ein Jahr arbeitslos.', exEs: 'Tras la crisis mi hermano estuvo un año en paro.' },
            { de: 'sprachlos', es: 'sin palabras', ex: 'Als ich das hörte, war ich sprachlos.', exEs: 'Cuando lo oí, me quedé sin palabras.' },
            { de: 'hoffnungslos', es: 'sin esperanza', ex: 'Am Anfang schien alles hoffnungslos.', exEs: 'Al principio todo parecía sin esperanza.' },
            { de: 'erfolglos', es: 'sin éxito', ex: 'Ich habe es dreimal erfolglos versucht.', exEs: 'Lo intenté tres veces sin éxito.' },
            { de: 'problemlos', es: 'sin problemas', ex: 'Die Anmeldung ging problemlos.', exEs: 'La inscripción fue sin problemas.' }
          ]
        },
        {
          thema: 'Neuanfang & Gefühle',
          items: [
            { de: 'die Sehnsucht', es: 'la añoranza', ex: 'Manchmal habe ich Sehnsucht nach dem Meer.', exEs: 'A veces siento añoranza del mar.' },
            { de: 'die Hoffnung', es: 'la esperanza', ex: 'Die Hoffnung habe ich nie verloren.', exEs: 'Nunca perdí la esperanza.' },
            { de: 'der Mut', es: 'el valor', ex: 'Für den Neuanfang braucht man Mut.', exEs: 'Para empezar de nuevo hace falta valor.' },
            { de: 'die Geduld', es: 'la paciencia', ex: 'Ohne Geduld schafft man das nicht.', exEs: 'Sin paciencia no se consigue.' },
            { de: 'die Enttäuschung', es: 'la decepción', ex: 'Die Enttäuschung war am Anfang groß.', exEs: 'Al principio la decepción fue grande.' },
            { de: 'die Unsicherheit', es: 'la inseguridad', ex: 'Am schlimmsten war die Unsicherheit.', exEs: 'Lo peor fue la inseguridad.' },
            { de: 'der Neuanfang', es: 'el nuevo comienzo', ex: 'Für mich war es ein echter Neuanfang.', exEs: 'Para mí fue un verdadero nuevo comienzo.' },
            { de: 'die Entscheidung', es: 'la decisión', ex: 'Die Entscheidung war nicht leicht.', exEs: 'La decisión no fue fácil.' },
            { de: 'sich entscheiden', es: 'decidirse', ex: 'Ich habe mich für Wien entschieden.', exEs: 'Me decidí por Viena.' },
            { de: 'bereuen', es: 'arrepentirse de', ex: 'Ich bereue diesen Schritt überhaupt nicht.', exEs: 'No me arrepiento nada de ese paso.' },
            { de: 'sich trauen', es: 'atreverse', ex: 'Lange habe ich mich nicht getraut zu sprechen.', exEs: 'Durante mucho tiempo no me atreví a hablar.' },
            { de: 'aushalten', es: 'aguantar', ex: 'Die ersten Monate waren schwer auszuhalten.', exEs: 'Los primeros meses fueron difíciles de aguantar.' },
            { de: 'aufgeben', es: 'rendirse', ex: 'Gib jetzt bitte nicht auf.', exEs: 'No te rindas ahora, por favor.' },
            { de: 'zurechtkommen', es: 'apañárselas', ex: 'Mit dem Dialekt komme ich inzwischen gut zurecht.', exEs: 'Con el dialecto ya me apaño bien.' },
            { de: 'dazugehören', es: 'formar parte, pertenecer', ex: 'Jetzt habe ich das Gefühl dazuzugehören.', exEs: 'Ahora tengo la sensación de pertenecer.' },
            { de: 'das Gefühl', es: 'el sentimiento, la sensación', ex: 'Das Gefühl kenne ich sehr gut.', exEs: 'Esa sensación la conozco muy bien.' },
            { de: 'die Schwierigkeit', es: 'la dificultad', ex: 'Die größte Schwierigkeit war die Sprache.', exEs: 'La mayor dificultad fue el idioma.' }
          ]
        },
        {
          thema: 'Wendepunkte',
          items: [
            { de: 'die Zuversicht', es: 'la confianza en el futuro', ex: 'Die Zuversicht habe ich nie verloren.', exEs: 'Nunca perdí la confianza en el futuro.' },
            { de: 'die Ruhe', es: 'la calma', ex: 'Nach dem Umzug brauche ich vor allem Ruhe.', exEs: 'Después de la mudanza necesito sobre todo calma.' },
            { de: 'die Freiheit', es: 'la libertad', ex: 'Freiheit bedeutet für mich eigene Entscheidungen.', exEs: 'Libertad para mí significa decisiones propias.' },
            { de: 'die Chance', es: 'la oportunidad', ex: 'Das war die Chance meines Lebens.', exEs: 'Fue la oportunidad de mi vida.' },
            { de: 'das Risiko', es: 'el riesgo', ex: 'Das Risiko war groß, aber es hat sich gelohnt.', exEs: 'El riesgo era grande, pero mereció la pena.' },
            { de: 'die Trennung', es: 'la separación', ex: 'Die Trennung von der Familie war sehr schwer.', exEs: 'La separación de la familia fue muy dura.' },
            { de: 'das Vorurteil', es: 'el prejuicio', ex: 'Gegen Vorurteile hilft nur Kennenlernen.', exEs: 'Contra los prejuicios solo ayuda conocerse.' },
            { de: 'die Veränderung', es: 'el cambio', ex: 'Die Veränderung kam schneller als gedacht.', exEs: 'El cambio llegó más rápido de lo previsto.' },
            { de: 'der Wendepunkt', es: 'el punto de inflexión', ex: 'Das Praktikum war für mich der Wendepunkt.', exEs: 'Las prácticas fueron para mí el punto de inflexión.' },
            { de: 'die Krise', es: 'la crisis', ex: 'Nach der Krise ging es wieder aufwärts.', exEs: 'Después de la crisis todo volvió a mejorar.' },
            { de: 'der Zusammenhalt', es: 'la unión', ex: 'Der Zusammenhalt in der Gruppe ist stark.', exEs: 'La unión en el grupo es fuerte.' },
            { de: 'das Verständnis', es: 'la comprensión', ex: 'Für so etwas fehlt mir das Verständnis.', exEs: 'Para algo así me falta comprensión.' },
            { de: 'die Anerkennung', es: 'el reconocimiento', ex: 'Für die Arbeit bekam sie viel Anerkennung.', exEs: 'Por el trabajo recibió mucho reconocimiento.' },
            { de: 'der Respekt', es: 'el respeto', ex: 'Respekt muss man sich verdienen.', exEs: 'El respeto hay que ganárselo.' },
            { de: 'verzeihen', es: 'perdonar', ex: 'Das habe ich ihm längst verziehen.', exEs: 'Eso se lo perdoné hace mucho.' },
            { de: 'vertrauen', es: 'confiar', ex: 'Ich vertraue dir vollkommen.', exEs: 'Confío en ti completamente.' },
            { de: 'hoffen', es: 'esperar', ex: 'Ich hoffe auf eine schnelle Antwort.', exEs: 'Espero una respuesta rápida.' },
            { de: 'zweifeln', es: 'dudar', ex: 'Manchmal zweifle ich an meiner Entscheidung.', exEs: 'A veces dudo de mi decisión.' },
            { de: 'sich durchsetzen', es: 'imponerse', ex: 'Man muss sich hier durchsetzen können.', exEs: 'Aquí hay que saber imponerse.' },
            { de: 'stark', es: 'fuerte', ex: 'Diese Zeit hat mich stark gemacht.', exEs: 'Esa época me hizo fuerte.' }
          ]
        },
        {
          thema: 'Innenleben',
          items: [
            { de: 'das Selbstbewusstsein', es: 'la autoestima', ex: 'Mit der Zeit wuchs mein Selbstbewusstsein.', exEs: 'Con el tiempo creció mi autoestima.' },
            { de: 'die Hilfsbereitschaft', es: 'la disposición a ayudar', ex: 'Die Hilfsbereitschaft hier hat mich überrascht.', exEs: 'La disposición a ayudar aquí me sorprendió.' },
            { de: 'die Offenheit', es: 'la apertura', ex: 'Die Offenheit der Leute war entscheidend.', exEs: 'La apertura de la gente fue decisiva.' },
            { de: 'die Einsamkeit', es: 'la soledad', ex: 'Die Einsamkeit war am Anfang das Schwerste.', exEs: 'La soledad fue al principio lo más duro.' },
            { de: 'die Dankbarkeit', es: 'la gratitud', ex: 'Ich empfinde bis heute große Dankbarkeit.', exEs: 'Hasta hoy siento una gran gratitud.' },
            { de: 'die Erleichterung', es: 'el alivio', ex: 'Die Erleichterung war damals riesig.', exEs: 'El alivio entonces fue enorme.' },
            { de: 'die Spannung', es: 'la tensión', ex: 'Vor dem Termin war die Spannung groß.', exEs: 'Antes de la cita la tensión era grande.' },
            { de: 'die Ungeduld', es: 'la impaciencia', ex: 'Meine Ungeduld hat mir oft geschadet.', exEs: 'Mi impaciencia me ha perjudicado a menudo.' },
            { de: 'die Rücksicht', es: 'la consideración', ex: 'Etwas mehr Rücksicht wäre schön.', exEs: 'Un poco más de consideración estaría bien.' },
            { de: 'die Zugehörigkeit', es: 'la pertenencia', ex: 'Das Gefühl der Zugehörigkeit kam spät.', exEs: 'La sensación de pertenencia llegó tarde.' },
            { de: 'die Perspektive', es: 'la perspectiva', ex: 'Hier hatte ich endlich eine echte Perspektive.', exEs: 'Aquí por fin tuve una perspectiva de verdad.' },
            { de: 'die Erwartung', es: 'la expectativa', ex: 'Meine Erwartung war viel zu hoch.', exEs: 'Mi expectativa era demasiado alta.' },
            { de: 'die Wirklichkeit', es: 'la realidad', ex: 'Die Wirklichkeit sah ganz anders aus.', exEs: 'La realidad era muy distinta.' },
            { de: 'der Traum', es: 'el sueño', ex: 'Der Traum war eine eigene Wohnung.', exEs: 'El sueño era un piso propio.' },
            { de: 'die Wahrheit', es: 'la verdad', ex: 'Die Wahrheit war einfacher als gedacht.', exEs: 'La verdad era más sencilla de lo que pensaba.' },
            { de: 'das Vorbild', es: 'el modelo a seguir', ex: 'Meine Mutter ist bis heute mein Vorbild.', exEs: 'Mi madre sigue siendo mi modelo.' },
            { de: 'der Stolz', es: 'el orgullo', ex: 'Der Stolz kam erst nach der Prüfung.', exEs: 'El orgullo llegó después del examen.' },
            { de: 'die Träne', es: 'la lágrima', ex: 'Eine Träne konnte ich nicht verstecken.', exEs: 'Una lágrima no la pude esconder.' }
          ]
        },
        {
          thema: 'Sich einleben',
          items: [
            { de: 'Freunde finden', es: 'hacer amigos', ex: 'Am Anfang ist es schwer, Freunde zu finden.', exEs: 'Al principio cuesta hacer amigos.' },
            { de: 'sich zurechtfinden', es: 'orientarse, apañarse', ex: 'Nach drei Monaten finde ich mich gut zurecht.', exEs: 'Después de tres meses me apaño bien.' },
            { de: 'Kontakte knüpfen', es: 'hacer contactos', ex: 'Im Sportverein knüpft man leicht Kontakte.', exEs: 'En el club deportivo se hacen contactos fácilmente.' },
            { de: 'sich anpassen', es: 'adaptarse', ex: 'Man muss sich an vieles anpassen.', exEs: 'Hay que adaptarse a muchas cosas.' },
            { de: 'nachfragen', es: 'preguntar, insistir', ex: 'Wenn ich etwas nicht verstehe, frage ich nach.', exEs: 'Si no entiendo algo, pregunto.' },
            { de: 'sich beschweren', es: 'quejarse', ex: 'Ich habe mich beim Vermieter beschwert.', exEs: 'Me he quejado al casero.' },
            { de: 'sich informieren', es: 'informarse', ex: 'Vorher informiere ich mich immer im Internet.', exEs: 'Antes siempre me informo por internet.' },
            { de: 'sich vorbereiten', es: 'prepararse', ex: 'Auf das Gespräch habe ich mich gut vorbereitet.', exEs: 'Me preparé bien para la entrevista.' },
            { de: 'durchhalten', es: 'aguantar, persistir', ex: 'Das erste Jahr muss man einfach durchhalten.', exEs: 'El primer año simplemente hay que aguantar.' },
            { de: 'sich melden', es: 'dar señales, ponerse en contacto', ex: 'Meld dich, wenn du etwas brauchst.', exEs: 'Dime algo si necesitas algo.' }
          ]
        },
        {
          thema: 'Wie es einem geht',
          items: [
            { de: 'heimisch', es: 'como en casa', ex: 'Langsam fühle ich mich hier heimisch.', exEs: 'Poco a poco me siento aquí como en casa.' },
            { de: 'verloren', es: 'perdido', ex: 'In der ersten Woche war ich völlig verloren.', exEs: 'La primera semana estaba completamente perdido.' },
            { de: 'motiviert', es: 'motivado', ex: 'Nach dem Kurs bin ich wieder motiviert.', exEs: 'Después del curso vuelvo a estar motivado.' },
            { de: 'hilflos', es: 'indefenso, desvalido', ex: 'Ohne die Sprache fühlt man sich hilflos.', exEs: 'Sin el idioma uno se siente indefenso.' },
            { de: 'zuversichtlich', es: 'optimista, confiado', ex: 'Ich bin zuversichtlich, dass es klappt.', exEs: 'Estoy convencido de que saldrá bien.' },
            { de: 'gelassen', es: 'tranquilo, sereno', ex: 'Mit der Zeit wird man gelassener.', exEs: 'Con el tiempo uno se vuelve más tranquilo.' },
            { de: 'mutig', es: 'valiente', ex: 'Auswandern ist eine mutige Entscheidung.', exEs: 'Emigrar es una decisión valiente.' },
            { de: 'aufgeschlossen', es: 'abierto (de mente)', ex: 'Die Leute hier sind sehr aufgeschlossen.', exEs: 'La gente de aquí es muy abierta.' },
            { de: 'verunsichert', es: 'inseguro, descolocado', ex: 'Der Brief vom Amt hat mich verunsichert.', exEs: 'La carta de la administración me descolocó.' },
            { de: 'überfordert', es: 'desbordado', ex: 'Am Anfang war ich mit allem überfordert.', exEs: 'Al principio me superaba todo.' }
          ]
        }
      ],
      pitfalls: [
        'Con "sein" y "haben" en pasado se usa el Präteritum (war / hatte), NO el Perfekt. "Ich bin müde gewesen" suena raro: di "Ich war müde".',
        'bleiben, sein y passieren forman el Perfekt con SEIN aunque no indiquen movimiento.',
        'Los prefijos be-, er-, ge-, ver-, ent-, emp-, zer- nunca llevan ge- en el participio: bekommen → bekommen (NO gebekommen).'
      ],
      grammatik: [
        {
          regel: 'Wiederholung: Präteritum von haben und sein',
          key: 'praeteritum-haben-sein',
          erklaerung: 'En pasado, "sein" y "haben" se usan casi siempre en Präteritum (war, hatte), no en Perfekt.',
          detail:
            'El alemán hablado prefiere el Perfekt para contar el pasado, PERO hay un grupo de verbos que se usan en Präteritum incluso al hablar: sein, haben y los modales (konnte, musste, wollte…). Por eso dices "Gestern war ich krank" y no "Gestern bin ich krank gewesen".\n\nFíjate en que la 1ª y la 3ª persona del singular son IGUALES (ich war / er war, ich hatte / er hatte). Eso pasa en todos los verbos en Präteritum, y es distinto del presente.\n\nEn una frase subordinada el verbo va al final: "…, weil ich müde war." / "…, obwohl wir kein Geld hatten."',
          tabelle: {
            title: 'sein y haben en Präteritum',
            headers: ['Persona', 'sein', 'haben'],
            rows: [
              ['ich', 'war', 'hatte'],
              ['du', 'warst', 'hattest'],
              ['er / sie / es', 'war', 'hatte'],
              ['wir', 'waren', 'hatten'],
              ['ihr', 'wart', 'hattet'],
              ['sie / Sie', 'waren', 'hatten']
            ]
          },
          beispiele: [
            { de: 'Am Anfang war ich sehr aufgeregt.', es: 'Al principio estaba muy nervioso.' },
            { de: 'Wir hatten großes Heimweh.', es: 'Echábamos mucho de menos nuestra tierra.' },
            { de: 'Warst du schon einmal in Wien?', es: '¿Has estado alguna vez en Viena?' },
            { de: 'Sie hatte damals noch keine Arbeit.', es: 'Entonces ella todavía no tenía trabajo.' }
          ],
          mehr: {
            title: 'En subordinada',
            examples: [
              { de: 'Ich bin nicht gekommen, weil ich krank war.', es: 'No fui porque estaba enfermo.' },
              { de: 'Obwohl wir wenig Geld hatten, waren wir glücklich.', es: 'Aunque teníamos poco dinero, éramos felices.' }
            ]
          }
        },
        {
          regel: 'Wiederholung: Perfekt',
          key: 'perfekt-wdh',
          erklaerung: 'haben o sein en 2ª posición + Partizip II al final de la frase (Satzklammer).',
          detail:
            'El Perfekt es el pasado normal al hablar. Se forma con el auxiliar (haben o sein) conjugado en 2ª posición y el participio (Partizip II) AL FINAL. A ese "abrazo" se le llama Satzklammer: "Ich habe gestern mit meiner Mutter telefoniert."\n\nCómo se forma el Partizip II: los verbos regulares hacen ge- + raíz + -t (machen → gemacht, lernen → gelernt). Los irregulares hacen ge- + raíz + -en y muchas veces cambian la vocal (sprechen → gesprochen, trinken → getrunken, gehen → gegangen). Los verbos en -ieren no llevan ge- (studieren → studiert). Los separables meten el -ge- en medio (einkaufen → eingekauft).\n\nLa mayoría usa haben. Usan SEIN los verbos de movimiento con cambio de lugar (gehen, fahren, kommen, fliegen, laufen), los de cambio de estado (aufstehen, einschlafen, aufwachen) y sein / bleiben / passieren / werden.',
          tabelle: {
            title: 'Formación del Partizip II',
            headers: ['Tipo', 'Infinitivo', 'Partizip II', 'Regla'],
            rows: [
              ['Regular', 'machen', 'gemacht', 'ge- + raíz + -t'],
              ['Irregular', 'sprechen', 'gesprochen', 'ge- + raíz + -en (+ cambio de vocal)'],
              ['Separable', 'einkaufen', 'eingekauft', '-ge- en medio'],
              ['Inseparable', 'verstehen', 'verstanden', 'sin ge-'],
              ['En -ieren', 'telefonieren', 'telefoniert', 'sin ge-']
            ]
          },
          beispiele: [
            { de: 'Ich habe meine Familie besucht.', es: 'He visitado a mi familia.' },
            { de: 'Wir haben viel Deutsch gelernt.', es: 'Hemos aprendido mucho alemán.' },
            { de: 'Sie ist um sieben aufgestanden.', es: 'Ella se ha levantado a las siete.' },
            { de: 'Habt ihr schon gegessen?', es: '¿Ya habéis comido?' }
          ]
        },
        {
          regel: 'Perfekt von bleiben, sein und passieren',
          key: 'perfekt-bleiben-sein-passieren',
          erklaerung: 'Estos tres van con SEIN aunque no expresen movimiento: ist geblieben, ist gewesen, ist passiert.',
          detail:
            'La regla general dice "sein para movimiento", pero hay tres excepciones muy frecuentes que hay que memorizar: bleiben (quedarse — justo lo contrario de moverse), sein (ser/estar) y passieren (ocurrir). También werden (ist geworden).\n\nOjo con "gewesen": es el participio de sein, así que el Perfekt de sein es "ich bin gewesen" (literalmente "soy sido"). En la práctica casi siempre dirás "ich war", pero necesitas reconocer la forma.',
          tabelle: {
            title: 'Verbos con SEIN',
            headers: ['Grupo', 'Ejemplos', 'Perfekt'],
            rows: [
              ['Movimiento (cambio de lugar)', 'gehen, fahren, kommen, fliegen, laufen', 'ich bin gegangen / gefahren'],
              ['Cambio de estado', 'aufstehen, einschlafen, aufwachen', 'ich bin aufgestanden'],
              ['Excepciones', 'sein, bleiben, passieren, werden', 'ich bin gewesen / geblieben']
            ]
          },
          beispiele: [
            { de: 'Ich bin am Wochenende zu Hause geblieben.', es: 'El fin de semana me quedé en casa.' },
            { de: 'Was ist denn passiert?', es: '¿Pero qué ha pasado?' },
            { de: 'Ich bin noch nie in Wien gewesen.', es: 'Nunca he estado en Viena.' },
            { de: 'Er ist Lehrer geworden.', es: 'Se ha hecho profesor.' }
          ]
        },
        {
          regel: 'Perfekt bei Verben mit nicht-trennbaren Vorsilben be-, er-, ge-, ver-',
          key: 'perfekt-untrennbar',
          erklaerung: 'Los prefijos inseparables (be-, er-, ge-, ver-, ent-, emp-, zer-) NO llevan ge- en el participio.',
          detail:
            'Hay dos familias de prefijos. Los SEPARABLES (an-, auf-, ein-, mit-, vor-, zu-, aus-…) se separan del verbo en presente y meten el -ge- en medio en el participio: "Ich kaufe ein" → "Ich habe eingekauft".\n\nLos INSEPARABLES (be-, er-, ge-, ver-, ent-, emp-, zer-, miss-) nunca se separan y nunca llevan ge-: "Ich verstehe" → "Ich habe verstanden". Un truco fonético: en los inseparables el acento cae en el VERBO (ver-STE-hen), en los separables cae en el PREFIJO (EIN-kaufen).\n\nCaso curioso: gefallen ya empieza por ge-, así que su participio es idéntico al infinitivo: "Der Film hat mir gefallen".',
          tabelle: {
            title: 'Separables vs. inseparables',
            headers: ['Prefijo', 'Tipo', 'Infinitivo', 'Partizip II'],
            rows: [
              ['ein-', 'separable', 'einkaufen', 'eingekauft'],
              ['auf-', 'separable', 'aufstehen', 'aufgestanden'],
              ['be-', 'inseparable', 'bekommen', 'bekommen'],
              ['er-', 'inseparable', 'erleben', 'erlebt'],
              ['ver-', 'inseparable', 'verstehen', 'verstanden'],
              ['ge-', 'inseparable', 'gefallen', 'gefallen']
            ]
          },
          beispiele: [
            { de: 'Ich habe deine Nachricht bekommen.', es: 'He recibido tu mensaje.' },
            { de: 'Hast du die Frage verstanden?', es: '¿Has entendido la pregunta?' },
            { de: 'Sie hat in Österreich viel erlebt.', es: 'Ella ha vivido muchas cosas en Austria.' },
            { de: 'Der Film hat mir sehr gefallen.', es: 'La película me ha gustado mucho.' }
          ],
          mehr: {
            title: 'Compara',
            examples: [
              { de: 'Ich habe im Supermarkt eingekauft. (separable)', es: 'He hecho la compra en el súper.' },
              { de: 'Ich habe ein Geschenk bekommen. (inseparable)', es: 'He recibido un regalo.' }
            ]
          }
        },
        {
          regel: 'Wortbildung: Adjektive mit un- und -los',
          key: 'wortbildung-un-los',
          erklaerung: 'un- delante niega el adjetivo; -los detrás de un sustantivo significa "sin".',
          detail:
            'Son dos recursos muy productivos para ampliar vocabulario sin aprender palabras nuevas de cero.\n\nun- + adjetivo = lo contrario: zufrieden → unzufrieden, freundlich → unfreundlich, geduldig → ungeduldig. El acento va siempre en UN-.\n\nsustantivo + -los = "sin eso": die Arbeit → arbeitslos (sin trabajo), die Sprache → sprachlos (sin palabras), die Hoffnung → hoffnungslos (sin esperanza). A veces se añade una -s- de unión: der Erfolg → erfolglos, das Problem → problemlos.\n\nNo todos los adjetivos admiten un-: no existe "unschön" ni "ungroß"; ahí se usa el antónimo (hässlich, klein).',
          tabelle: {
            title: 'Formar adjetivos',
            headers: ['Base', 'Con un-', 'Base', 'Con -los'],
            rows: [
              ['zufrieden', 'unzufrieden', 'die Arbeit', 'arbeitslos'],
              ['freundlich', 'unfreundlich', 'die Sprache', 'sprachlos'],
              ['geduldig', 'ungeduldig', 'die Hoffnung', 'hoffnungslos'],
              ['sicher', 'unsicher', 'das Problem', 'problemlos']
            ]
          },
          beispiele: [
            { de: 'Er ist seit einem Jahr arbeitslos.', es: 'Lleva un año en paro.' },
            { de: 'Ich bin mit dem Ergebnis unzufrieden.', es: 'No estoy satisfecho con el resultado.' },
            { de: 'Nach der Nachricht war sie sprachlos.', es: 'Tras la noticia se quedó sin palabras.' },
            { de: 'Der Umzug lief problemlos.', es: 'La mudanza fue sin problemas.' }
          ]
        },
        {
          key: 'verben-mit-praeposition-gefuehl',
          regel: 'Verben mit fester Präposition',
          erklaerung: 'Muchos verbos de sentimiento llevan SIEMPRE la misma preposición, y no es la del español: sich freuen ÜBER (+ Akk.), Angst haben VOR (+ Dat.), sich ärgern ÜBER, sich gewöhnen AN, sich Sorgen machen UM. Hay que aprenderse el verbo con su preposición pegada.',
          beispiele: [
            { de: 'Ich freue mich über deinen Besuch.', es: 'Me alegro de tu visita.' },
            { de: 'Am Anfang hatte ich Angst vor dem Telefonieren.', es: 'Al principio me daba miedo hablar por teléfono.' }
          ]
        },
        {
          key: 'wo-fragen-worueber-darueber',
          regel: 'worüber? – darüber',
          erklaerung: 'Cuando el verbo lleva preposición y se pregunta por una COSA, se junta wo(r)- + preposición: worüber? wovor? woran? Y para responder, da(r)- + preposición: darüber, davor, daran. Si se habla de una PERSONA sí se usa la preposición normal: über wen?',
          beispiele: [
            { de: 'Worüber freust du dich?', es: '¿De qué te alegras?' },
            { de: 'Ich denke oft daran.', es: 'Pienso en ello a menudo.' }
          ]
        },
        {
          key: 'als-wann-wenn-vergangenheit',
          regel: 'als oder wenn in der Vergangenheit?',
          erklaerung: 'En pasado no valen igual. als = una vez, un momento concreto: ALS ich nach Wien kam… wenn = cada vez, algo repetido: Immer WENN ich nach Hause kam… En presente y futuro siempre wenn.',
          beispiele: [
            { de: 'Als ich nach Wien kam, war alles fremd.', es: 'Cuando llegué a Viena, todo me resultaba ajeno.' },
            { de: 'Immer wenn ich Heimweh hatte, rief ich zu Hause an.', es: 'Cada vez que echaba de menos mi casa, llamaba.' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'Wünsche und Sehnsüchte ausdrücken',
          es: 'Expresar deseos y anhelos',
          wendungen: [
            { de: 'Mein größter Wunsch ist ein sicherer Job.', es: 'Mi mayor deseo es un trabajo estable.' }
          ]
        },
        {
          funktion: 'über die Vergangenheit und den Anfang berichten',
          es: 'Contar sobre el pasado y el comienzo',
          wendungen: [
            { de: 'Damals bin ich nach Österreich gekommen.', es: 'Entonces vine a Austria.' }
          ]
        },
        {
          funktion: 'über Wendepunkte und Krisen sprechen',
          es: 'Hablar de puntos de inflexión y crisis',
          wendungen: [
            { de: 'Was hast du vorher gemacht?', es: '¿Qué hacías antes?' }
          ]
        },
        {
          funktion: 'nachfragen und Interesse zeigen',
          es: 'Preguntar y mostrar interés',
          wendungen: [
            { de: 'Und wie ging es dann weiter?', es: '¿Y cómo siguió la cosa?' }
          ]
        },
        {
          funktion: 'Mitgefühl und Verständnis ausdrücken',
          es: 'Expresar empatía y comprensión',
          wendungen: [
            { de: 'Mir fehlt manchmal meine Familie.', es: 'A veces echo de menos a mi familia.' }
          ]
        },
        {
          funktion: 'eigene Fehler korrigieren',
          es: 'Corregir los propios errores',
          wendungen: [
            { de: 'Der Termin ist am Montag. Entschuldigung, ich meine …', es: 'La cita es el lunes. Perdón, quiero decir …' }
          ]
        },
        {
          funktion: 'über das Ankommen und Einleben sprechen',
          es: 'Hablar de la llegada y la integración',
          wendungen: [
            { de: 'Wie hast du dich in der ersten Woche gefühlt?', es: '¿Cómo te sentiste la primera semana?' }
          ]
        },
        {
          funktion: 'über Zukunftspläne sprechen',
          es: 'Hablar de planes de futuro',
          wendungen: [
            { de: 'Was sind deine Pläne für die nächsten Jahre?', es: '¿Qué planes tienes para los próximos años?' }
          ]
        }
      ]
    },

    // ==================== LEKTION 2 ====================
    {
      id: 'a21-l2',
      legacyId: 'l2',
      nr: 2,
      name: 'Die Einladung',
      woerter: [
        {
          thema: 'Obst und Gemüse',
          items: [
            { de: 'der Apfel, ¨-', es: 'la manzana', ex: 'Zum Frühstück esse ich meistens einen Apfel.', exEs: 'Para desayunar suelo comer una manzana.' },
            { de: 'die Birne, -n', es: 'la pera', ex: 'Die Birnen sind noch nicht reif.', exEs: 'Las peras todavía no están maduras.' },
            { de: 'die Erdbeere, -n', es: 'la fresa', ex: 'Im Juni kaufe ich jede Woche Erdbeeren.', exEs: 'En junio compro fresas todas las semanas.' },
            { de: 'die Traube, -n', es: 'la uva', ex: 'Zu Silvester isst man in Spanien zwölf Trauben.', exEs: 'En Nochevieja en España se comen doce uvas.' },
            { de: 'die Kirsche, -n', es: 'la cereza', ex: 'Die Kirschen aus dem Garten sind süßer.', exEs: 'Las cerezas del huerto están más dulces.' },
            { de: 'die Marille (AT) / die Aprikose', es: 'el albaricoque', ex: 'In der Wachau gibt es die besten Marillen.', exEs: 'En la Wachau están los mejores albaricoques.' },
            { de: 'die Zitrone, -n', es: 'el limón', ex: 'Drück bitte eine halbe Zitrone in den Salat.', exEs: 'Exprime medio limón en la ensalada, por favor.' },
            { de: 'die Zwiebel, -n', es: 'la cebolla', ex: 'Beim Zwiebelschneiden weine ich immer.', exEs: 'Cortando cebolla siempre lloro.' },
            { de: 'der Knoblauch', es: 'el ajo', ex: 'Ohne Knoblauch schmeckt mir das Essen nicht.', exEs: 'Sin ajo la comida no me sabe a nada.' },
            { de: 'die Karotte (AT) / die Möhre', es: 'la zanahoria', ex: 'Die Karotten koche ich nur kurz.', exEs: 'Las zanahorias las cuezo poco rato.' },
            { de: 'der Paprika', es: 'el pimiento', ex: 'Roter Paprika ist süßer als grüner.', exEs: 'El pimiento rojo es más dulce que el verde.' },
            { de: 'die Gurke, -n', es: 'el pepino', ex: 'Im Sommer esse ich gern Gurke mit Joghurt.', exEs: 'En verano me gusta el pepino con yogur.' },
            { de: 'der Salat', es: 'la lechuga', ex: 'Machst du den Salat, während ich koche?', exEs: '¿Haces tú la ensalada mientras yo cocino?' },
            { de: 'die Erdäpfel (AT) / die Kartoffeln', es: 'las patatas', ex: 'Die Erdäpfel brauchen noch zehn Minuten.', exEs: 'A las patatas les faltan diez minutos.' },
            { de: 'die Paradeiser (AT) / die Tomaten', es: 'los tomates', ex: 'Am Markt kosten die Paradeiser die Hälfte.', exEs: 'En el mercado los tomates cuestan la mitad.' },
            { de: 'der Kürbis', es: 'la calabaza', ex: 'Im Herbst mache ich oft Suppe aus Kürbis.', exEs: 'En otoño hago sopa de calabaza a menudo.' },
            { de: 'die Bohne, -n', es: 'la judía', ex: 'Die Bohnen müssen über Nacht einweichen.', exEs: 'Las judías tienen que estar en remojo toda la noche.' },
            { de: 'der Pilz, -e', es: 'la seta', ex: 'Im Wald haben wir viele Pilze gefunden.', exEs: 'En el bosque encontramos muchas setas.' }
          ]
        },
        {
          thema: 'Essen',
          items: [
            { de: 'die Vorspeise, -n', es: 'el entrante', ex: 'Als Vorspeise nehme ich eine Suppe.', exEs: 'De entrante voy a tomar una sopa.' },
            { de: 'die Hauptspeise, -n', es: 'el plato principal', ex: 'Was gibt es heute als Hauptspeise?', exEs: '¿Qué hay hoy de plato principal?' },
            { de: 'die Beilage, -n', es: 'la guarnición', ex: 'Als Beilage hätte ich gern Reis.', exEs: 'De guarnición querría arroz.' },
            { de: 'die Nachspeise, -n', es: 'el postre', ex: 'Für die Nachspeise habe ich keinen Platz mehr.', exEs: 'Para el postre ya no me queda sitio.' },
            { de: 'der Braten', es: 'el asado', ex: 'Der Braten war innen noch ganz rosa.', exEs: 'El asado estaba todavía muy rosa por dentro.' },
            { de: 'das Schnitzel', es: 'el escalope', ex: 'In Wien muss man einmal ein Schnitzel essen.', exEs: 'En Viena hay que comerse un escalope alguna vez.' },
            { de: 'der Knödel (AT)', es: 'la bola de pan/patata', ex: 'Zum Braten gibt es immer Knödel.', exEs: 'Con el asado siempre hay bolas de pan.' },
            { de: 'die Suppe, -n', es: 'la sopa', ex: 'Wenn ich krank bin, esse ich nur Suppe.', exEs: 'Cuando estoy malo solo como sopa.' },
            { de: 'die Zutat, -en', es: 'el ingrediente', ex: 'Mir fehlt noch eine Zutat für den Kuchen.', exEs: 'Me falta un ingrediente para el bizcocho.' },
            { de: 'das Rezept, -e', es: 'la receta', ex: 'Das Rezept habe ich von meiner Oma.', exEs: 'La receta es de mi abuela.' },
            { de: 'vegetarisch / vegan', es: 'vegetariano / vegano', ex: 'Meine Schwester kocht seit Jahren vegetarisch.', exEs: 'Mi hermana cocina vegetariano desde hace años.' },
            { de: 'scharf', es: 'picante', ex: 'Das Curry war mir viel zu scharf.', exEs: 'El curry me resultó demasiado picante.' },
            { de: 'salzig', es: 'salado', ex: 'Die Suppe ist mir ein bisschen zu salzig.', exEs: 'La sopa me parece un poco salada.' },
            { de: 'süß', es: 'dulce', ex: 'Der Kaffee hier ist mir zu süß.', exEs: 'El café de aquí me resulta muy dulce.' },
            { de: 'sauer', es: 'ácido, agrio', ex: 'Diese Äpfel sind ziemlich sauer.', exEs: 'Estas manzanas están bastante ácidas.' },
            { de: 'fett', es: 'graso', ex: 'Am Abend esse ich nichts Fettes mehr.', exEs: 'Por la noche ya no como nada graso.' },
            { de: 'frisch', es: 'fresco', ex: 'Das Brot ist noch ganz frisch.', exEs: 'El pan está todavía muy fresco.' },
            { de: 'schmecken', es: 'saber (a), gustar (comida)', ex: 'Und? Schmeckt es dir?', exEs: '¿Y qué? ¿Te gusta?' },
            { de: 'probieren', es: 'probar', ex: 'Probier mal, das ist wirklich gut.', exEs: 'Prueba, está buenísimo.' },
            { de: 'satt sein', es: 'estar lleno', ex: 'Danke, ich bin schon satt.', exEs: 'Gracias, ya estoy lleno.' }
          ]
        },
        {
          thema: 'Süßes und Getränke',
          items: [
            { de: 'der Kuchen', es: 'el bizcocho', ex: 'Zum Kaffee gibt es selbst gebackenen Kuchen.', exEs: 'Con el café hay bizcocho casero.' },
            { de: 'die Torte, -n', es: 'la tarta', ex: 'Zum Geburtstag bestellen wir eine Torte.', exEs: 'Para el cumpleaños encargamos una tarta.' },
            { de: 'der Apfelstrudel (AT)', es: 'el strudel de manzana', ex: 'Der Apfelstrudel schmeckt warm am besten.', exEs: 'El strudel de manzana está mejor caliente.' },
            { de: 'die Sachertorte (AT)', es: 'la tarta Sacher', ex: 'Die Sachertorte isst man mit Schlagobers.', exEs: 'La tarta Sacher se come con nata montada.' },
            { de: 'die Schokolade', es: 'el chocolate', ex: 'Abends esse ich ein Stück dunkle Schokolade.', exEs: 'Por la noche como un trozo de chocolate negro.' },
            { de: 'das Eis', es: 'el helado', ex: 'Bei der Hitze will ich nur ein Eis.', exEs: 'Con este calor solo quiero un helado.' },
            { de: 'der Keks, -e', es: 'la galleta', ex: 'Die Kekse sind schon wieder alle.', exEs: 'Las galletas se han acabado otra vez.' },
            { de: 'der Kaffee', es: 'el café', ex: 'Ohne Kaffee komme ich morgens nicht in Gang.', exEs: 'Sin café no arranco por las mañanas.' },
            { de: 'die Melange (AT)', es: 'el café con leche vienés', ex: 'Im Kaffeehaus bestelle ich immer eine Melange.', exEs: 'En el café siempre pido una Melange.' },
            { de: 'der Tee', es: 'el té', ex: 'Wenn ich Halsweh habe, trinke ich Tee mit Honig.', exEs: 'Cuando me duele la garganta tomo té con miel.' },
            { de: 'der Saft, ¨-e', es: 'el zumo', ex: 'Der Saft ist frisch gepresst.', exEs: 'El zumo está recién exprimido.' },
            { de: 'das Mineralwasser', es: 'el agua mineral', ex: 'Ein Mineralwasser ohne Kohlensäure, bitte.', exEs: 'Un agua mineral sin gas, por favor.' },
            { de: 'der Wein', es: 'el vino', ex: 'Zum Essen trinken wir einen Wein aus der Gegend.', exEs: 'Con la comida bebemos un vino de la zona.' },
            { de: 'das Bier', es: 'la cerveza', ex: 'Nach der Arbeit gehen wir auf ein Bier.', exEs: 'Después del trabajo vamos a por una cerveza.' },
            { de: 'der Sekt', es: 'el cava', ex: 'Um Mitternacht stoßen wir mit Sekt an.', exEs: 'A medianoche brindamos con cava.' }
          ]
        },
        {
          thema: 'Im Restaurant und zu Gast',
          items: [
            { de: 'die Speisekarte, -n', es: 'la carta', ex: 'Könnten wir bitte die Speisekarte haben?', exEs: '¿Nos trae la carta, por favor?' },
            { de: 'bestellen', es: 'pedir', ex: 'Hast du schon bestellt?', exEs: '¿Ya has pedido?' },
            { de: 'die Rechnung, -en', es: 'la cuenta', ex: 'Die Rechnung, bitte!', exEs: '¡La cuenta, por favor!' },
            { de: 'getrennt / zusammen zahlen', es: 'pagar por separado / junto', ex: 'Zahlen wir getrennt oder zusammen?', exEs: '¿Pagamos por separado o junto?' },
            { de: 'das Trinkgeld', es: 'la propina', ex: 'In Österreich gibt man etwa zehn Prozent Trinkgeld.', exEs: 'En Austria se deja alrededor de un diez por ciento de propina.' },
            { de: 'reservieren', es: 'reservar', ex: 'Ich habe für acht Uhr einen Tisch reserviert.', exEs: 'He reservado mesa para las ocho.' },
            { de: 'die Einladung, -en', es: 'la invitación', ex: 'Vielen Dank für die Einladung!', exEs: '¡Muchas gracias por la invitación!' },
            { de: 'einladen', es: 'invitar', ex: 'Am Samstag lade ich euch zum Essen ein.', exEs: 'El sábado os invito a comer.' },
            { de: 'der Gast, ¨-e', es: 'el invitado', ex: 'Um sieben kommen die ersten Gäste.', exEs: 'A las siete llegan los primeros invitados.' },
            { de: 'mitbringen', es: 'llevar (algo consigo)', ex: 'Soll ich etwas mitbringen?', exEs: '¿Llevo algo?' }
          ]
        },
        {
          thema: 'Zutaten & Lokale',
          items: [
            { de: 'das Gewürz', es: 'la especia', ex: 'Dieses Gewürz kenne ich gar nicht.', exEs: 'Esta especia no la conozco.' },
            { de: 'das Salz', es: 'la sal', ex: 'Das Salz steht schon auf dem Tisch.', exEs: 'La sal ya está en la mesa.' },
            { de: 'der Pfeffer', es: 'la pimienta', ex: 'Etwas Pfeffer fehlt noch.', exEs: 'Todavía falta un poco de pimienta.' },
            { de: 'das Öl', es: 'el aceite', ex: 'Das Öl kommt aus Andalusien.', exEs: 'El aceite viene de Andalucía.' },
            { de: 'der Essig', es: 'el vinagre', ex: 'Mit Essig schmeckt der Salat besser.', exEs: 'Con vinagre la ensalada está mejor.' },
            { de: 'das Schlagobers', es: 'la nata montada', ex: 'Zum Strudel gibt es Schlagobers.', exEs: 'Con el strudel hay nata montada.' },
            { de: 'der Joghurt', es: 'el yogur', ex: 'Zum Frühstück esse ich Joghurt.', exEs: 'Para desayunar como yogur.' },
            { de: 'das Müsli', es: 'el muesli', ex: 'Mein Müsli mache ich immer selbst.', exEs: 'El muesli me lo hago yo siempre.' },
            { de: 'die Nuss', es: 'el fruto seco', ex: 'Auf diese Nuss reagiere ich allergisch.', exEs: 'A este fruto seco soy alérgico.' },
            { de: 'der Honig', es: 'la miel', ex: 'Der Honig kommt vom Nachbarn.', exEs: 'La miel es del vecino.' },
            { de: 'die Marmelade', es: 'la mermelada', ex: 'Die Marmelade ist selbst gemacht.', exEs: 'La mermelada es casera.' },
            { de: 'das Getreide', es: 'el cereal', ex: 'Getreide wächst hier fast überall.', exEs: 'Aquí el cereal crece casi por todas partes.' },
            { de: 'würzen', es: 'condimentar', ex: 'Ich würze immer viel zu wenig.', exEs: 'Yo siempre condimento demasiado poco.' },
            { de: 'servieren', es: 'servir', ex: 'Wir servieren pünktlich um acht.', exEs: 'Servimos puntualmente a las ocho.' },
            { de: 'das Lokal', es: 'el local, el bar', ex: 'Dieses Lokal ist am Abend immer voll.', exEs: 'Este local está siempre lleno por la noche.' },
            { de: 'der Gastgarten', es: 'la terraza', ex: 'Im Sommer sitzen alle im Gastgarten.', exEs: 'En verano todos se sientan en la terraza.' },
            { de: 'hausgemacht', es: 'casero', ex: 'Der Kuchen hier ist hausgemacht.', exEs: 'El pastel de aquí es casero.' },
            { de: 'bitter', es: 'amargo', ex: 'Der Kaffee ist mir viel zu bitter.', exEs: 'El café me sabe demasiado amargo.' },
            { de: 'würzig', es: 'sabroso, especiado', ex: 'Das Gulasch ist schön würzig.', exEs: 'El gulash está bien sabroso.' }
          ]
        },
        {
          thema: 'Fleisch, Fisch & Teig',
          items: [
            { de: 'das Rindfleisch', es: 'la carne de ternera', ex: 'Rindfleisch braucht länger als Hühnchen.', exEs: 'La ternera necesita más tiempo que el pollo.' },
            { de: 'das Schweinefleisch', es: 'la carne de cerdo', ex: 'Schweinefleisch esse ich grundsätzlich nicht.', exEs: 'Carne de cerdo no como por principio.' },
            { de: 'das Hühnchen', es: 'el pollo', ex: 'Das Hühnchen ist in zwanzig Minuten fertig.', exEs: 'El pollo está listo en veinte minutos.' },
            { de: 'die Wurst', es: 'el embutido', ex: 'Zum Frühstück gibt es Wurst und Käse.', exEs: 'Para desayunar hay embutido y queso.' },
            { de: 'der Schinken', es: 'el jamón', ex: 'Dieser Schinken kommt aus Spanien.', exEs: 'Este jamón viene de España.' },
            { de: 'das Lamm', es: 'el cordero', ex: 'Lamm isst man hier vor allem zu Ostern.', exEs: 'El cordero aquí se come sobre todo en Pascua.' },
            { de: 'die Meeresfrüchte', es: 'el marisco', ex: 'Meeresfrüchte gibt es hier eher selten.', exEs: 'Marisco aquí hay más bien poco.' },
            { de: 'die Muschel', es: 'el mejillón', ex: 'Diese Muschel war leider nicht frisch.', exEs: 'Ese mejillón no estaba fresco.' },
            { de: 'der Lachs', es: 'el salmón', ex: 'Der Lachs ist heute im Angebot.', exEs: 'El salmón está hoy de oferta.' },
            { de: 'das Vollkornbrot', es: 'el pan integral', ex: 'Vollkornbrot ist gesünder als Weißbrot.', exEs: 'El pan integral es más sano que el blanco.' },
            { de: 'der Teig', es: 'la masa', ex: 'Der Teig muss eine Stunde ruhen.', exEs: 'La masa tiene que reposar una hora.' },
            { de: 'die Hefe', es: 'la levadura', ex: 'Ohne Hefe geht der Teig nicht auf.', exEs: 'Sin levadura la masa no sube.' },
            { de: 'der Topfen', es: 'el requesón', ex: 'Für den Strudel brauche ich Topfen.', exEs: 'Para el strudel necesito requesón.' },
            { de: 'das Kompott', es: 'la compota', ex: 'Zum Schmarrn gibt es immer Kompott.', exEs: 'Con el Schmarrn siempre hay compota.' },
            { de: 'der Stammgast', es: 'el cliente habitual', ex: 'Als Stammgast bekommt man den besten Tisch.', exEs: 'De cliente habitual te dan la mejor mesa.' },
            { de: 'die Tageskarte', es: 'el menú del día', ex: 'Die Tageskarte hängt draußen an der Tür.', exEs: 'El menú del día está fuera en la puerta.' },
            { de: 'das Trinkwasser', es: 'el agua potable', ex: 'Trinkwasser bekommt man hier immer gratis.', exEs: 'Aquí el agua potable siempre es gratis.' },
            { de: 'fettig', es: 'grasiento', ex: 'Das Essen war mir deutlich zu fettig.', exEs: 'La comida me pareció demasiado grasienta.' }
          ]
        },
        {
          thema: 'Kochen: Verben',
          items: [
            { de: 'schälen', es: 'pelar', ex: 'Schäl bitte die Erdäpfel für die Suppe.', exEs: 'Pela las patatas para la sopa, por favor.' },
            { de: 'rühren', es: 'remover', ex: 'Rühr die Sauce, damit nichts anbrennt.', exEs: 'Remueve la salsa para que no se pegue.' },
            { de: 'mischen', es: 'mezclar', ex: 'Mischen Sie das Mehl mit dem Zucker.', exEs: 'Mezcle la harina con el azúcar.' },
            { de: 'abschmecken', es: 'rectificar de sal, probar', ex: 'Am Ende mit Salz und Pfeffer abschmecken.', exEs: 'Al final, rectificar con sal y pimienta.' },
            { de: 'kneten', es: 'amasar', ex: 'Den Teig zehn Minuten kneten.', exEs: 'Amasar la masa diez minutos.' },
            { de: 'zubereiten', es: 'preparar (un plato)', ex: 'Das Gericht ist in zwanzig Minuten zubereitet.', exEs: 'El plato se prepara en veinte minutos.' },
            { de: 'anrichten', es: 'emplatar', ex: 'Den Salat richte ich erst kurz vorher an.', exEs: 'La ensalada la emplato justo antes.' },
            { de: 'auftauen', es: 'descongelar', ex: 'Das Fleisch muss über Nacht auftauen.', exEs: 'La carne tiene que descongelarse toda la noche.' },
            { de: 'dünsten', es: 'rehogar, cocer al vapor', ex: 'Das Gemüse wird nur kurz gedünstet.', exEs: 'La verdura se rehoga solo un momento.' },
            { de: 'panieren', es: 'empanar, rebozar', ex: 'Für ein Schnitzel muss man das Fleisch panieren.', exEs: 'Para un escalope hay que empanar la carne.' }
          ]
        },
        {
          thema: 'Mengen beim Kochen',
          items: [
            { de: 'der Esslöffel', es: 'la cucharada', ex: 'Zwei Esslöffel Öl in die Pfanne geben.', exEs: 'Poner dos cucharadas de aceite en la sartén.' },
            { de: 'der Teelöffel', es: 'la cucharadita', ex: 'Ein Teelöffel Zucker reicht mir.', exEs: 'Con una cucharadita de azúcar me basta.' },
            { de: 'die Prise', es: 'la pizca', ex: 'Noch eine Prise Salz, dann passt es.', exEs: 'Una pizca más de sal y listo.' },
            { de: 'die Handvoll', es: 'el puñado', ex: 'Eine Handvoll Nüsse kommt in den Salat.', exEs: 'Un puñado de nueces va en la ensalada.' },
            { de: 'das Päckchen', es: 'el sobre, el paquetito', ex: 'Ein Päckchen Backpulver, bitte.', exEs: 'Un sobre de levadura, por favor.' },
            { de: 'der Schuss', es: 'el chorro', ex: 'Ein Schuss Essig macht den Salat besser.', exEs: 'Un chorro de vinagre mejora la ensalada.' },
            { de: 'die Menge', es: 'la cantidad', ex: 'Die Menge reicht für vier Personen.', exEs: 'La cantidad da para cuatro personas.' },
            { de: 'der Rest', es: 'el resto, las sobras', ex: 'Den Rest essen wir morgen.', exEs: 'El resto nos lo comemos mañana.' },
            { de: 'übrig bleiben', es: 'sobrar', ex: 'Vom Kuchen ist nichts übrig geblieben.', exEs: 'Del bizcocho no ha sobrado nada.' },
            { de: 'halbieren', es: 'partir por la mitad', ex: 'Halbiere die Zwiebel und schneide sie klein.', exEs: 'Parte la cebolla por la mitad y córtala fina.' }
          ]
        }
      ],
      pitfalls: [
        '"weil" manda el verbo al final; "denn" NO cambia el orden. Ich komme nicht, weil ich arbeiten MUSS. / …, denn ich MUSS arbeiten.',
        'Después de "Was für" la terminación de ein- depende del caso y del género, no de "für": "Was für einen Wein?" (Akk.) pero "Was für ein Wein ist das?" (Nom.).',
        'Ojo con los austriacismos de comida: Erdäpfel (Kartoffeln), Paradeiser (Tomaten), Marille (Aprikose), Karfiol (Blumenkohl).'
      ],
      grammatik: [
        {
          regel: 'Konjunktion weil',
          key: 'konjunktion-weil',
          erklaerung: '"weil" = porque. Manda el verbo conjugado AL FINAL de la frase subordinada.',
          detail:
            '"weil" introduce la causa. Es una conjunción SUBORDINANTE, así que reordena la frase: todo lo demás va delante y el verbo conjugado cierra la subordinada. "Ich komme nicht, weil ich arbeiten muss."\n\nSi hay dos verbos (modal + infinitivo, o Perfekt), el orden final es: infinitivo/participio + verbo conjugado. "…, weil ich nicht kommen KANN." / "…, weil ich den Bus verpasst HABE."\n\nLa subordinada también puede ir primera. En ese caso ocupa la posición 1 de la frase entera, así que la principal invierte (verbo antes del sujeto): "Weil es regnet, BLEIBEN WIR zu Hause."\n\nNo confundas "weil" con "denn": significan lo mismo pero "denn" es coordinante y NO cambia el orden. Y "deshalb / deswegen" expresan la consecuencia, no la causa, y provocan inversión.',
          tabelle: {
            title: 'weil / denn / deshalb',
            headers: ['Conector', 'Significado', 'Orden', 'Ejemplo'],
            rows: [
              ['weil', 'porque (causa)', 'verbo AL FINAL', 'Ich bleibe, weil es regnet.'],
              ['denn', 'porque (causa)', 'orden normal', 'Ich bleibe, denn es regnet.'],
              ['deshalb / deswegen', 'por eso (consecuencia)', 'inversión', 'Es regnet, deshalb bleibe ich.']
            ]
          },
          beispiele: [
            { de: 'Ich komme nicht, weil ich arbeiten muss.', es: 'No voy porque tengo que trabajar.' },
            { de: 'Weil es regnet, bleiben wir zu Hause.', es: 'Como llueve, nos quedamos en casa.' },
            { de: 'Sie isst kein Fleisch, weil sie Vegetarierin ist.', es: 'No come carne porque es vegetariana.' },
            { de: 'Wir sind früher gegangen, weil das Essen kalt war.', es: 'Nos fuimos antes porque la comida estaba fría.' }
          ],
          mehr: {
            title: 'Con Perfekt y con modal',
            examples: [
              { de: '…, weil ich den Zug verpasst habe.', es: '…porque he perdido el tren.' },
              { de: '…, weil ich morgen früh arbeiten muss.', es: '…porque mañana tengo que trabajar temprano.' }
            ]
          }
        },
        {
          regel: 'Frage: Was für ein- + Akkusativ',
          key: 'was-fuer-ein',
          erklaerung: 'Pregunta por el TIPO de algo. La terminación de "ein-" sigue el género y el caso del sustantivo.',
          detail:
            '"Was für ein-…?" = ¿qué tipo de…? Pregunta por la clase o la característica, no por cuál de varios (eso sería "welch-").\n\nLa palabra "für" aquí NO rige acusativo: el caso lo decide el verbo de la frase. Con "möchten / nehmen / trinken" (que piden acusativo) dirás "Was für einen Wein möchtest du?"; pero con "sein" (nominativo) dirás "Was für ein Wein ist das?".\n\nEn plural y con sustantivos incontables desaparece el artículo: "Was für Musik hörst du gern?" / "Was für Wein trinkt ihr?"',
          tabelle: {
            title: 'Terminaciones de was für ein-',
            headers: ['Caso', 'masculino', 'femenino', 'neutro', 'plural'],
            rows: [
              ['Nominativ', 'was für ein', 'was für eine', 'was für ein', 'was für'],
              ['Akkusativ', 'was für einen', 'was für eine', 'was für ein', 'was für']
            ]
          },
          beispiele: [
            { de: 'Was für einen Wein möchtest du?', es: '¿Qué tipo de vino quieres?' },
            { de: 'Was für eine Suppe ist das?', es: '¿Qué clase de sopa es esta?' },
            { de: 'Was für ein Brot kaufen wir?', es: '¿Qué tipo de pan compramos?' },
            { de: 'Was für Musik hörst du gern?', es: '¿Qué tipo de música te gusta?' }
          ],
          mehr: {
            title: 'was für ein- vs. welch-',
            examples: [
              { de: 'Was für einen Kuchen magst du? – Schokoladenkuchen.', es: '¿Qué tipo de tarta te gusta? – De chocolate. (clase)' },
              { de: 'Welchen Kuchen nimmst du? – Den hier.', es: '¿Qué tarta te llevas? – Esta. (una concreta)' }
            ]
          }
        },
        {
          key: 'konjunktiv-ii-hoeflich-einladen',
          regel: 'Höfliche Einladung mit Konjunktiv II',
          erklaerung: 'Para invitar o proponer sin presionar se usa hätten, wären, könnten, würden: HÄTTEST du Lust…? WÄRE Samstag okay? Suena mucho mejor que la pregunta directa.',
          beispiele: [
            { de: 'Hättest du Lust, am Samstag zu kommen?', es: '¿Te apetecería venir el sábado?' },
            { de: 'Wäre Freitag auch möglich?', es: '¿Sería posible también el viernes?' }
          ]
        },
        {
          key: 'wenn-satz-einladung',
          regel: 'Nebensatz vor dem Hauptsatz',
          erklaerung: 'Si la subordinada va PRIMERO, ocupa entera la posición 1, así que la principal empieza directamente por el verbo: Wenn du Zeit hast, KOMM vorbei. Es el error más típico: poner el sujeto delante del verbo.',
          beispiele: [
            { de: 'Wenn du Zeit hast, komm doch vorbei.', es: 'Si tienes tiempo, pásate.' },
            { de: 'Weil ich arbeiten muss, komme ich später.', es: 'Como tengo que trabajar, llego más tarde.' }
          ]
        },
        {
          key: 'mitbringen-schenken-dativ',
          regel: 'mitbringen und schenken: wem was?',
          erklaerung: 'Los dos llevan a quién (dativo) y qué (acusativo): Ich bringe DIR (Dat.) EINEN KUCHEN (Akk.) mit. El dativo va primero, salvo que el qué sea un pronombre.',
          beispiele: [
            { de: 'Ich bringe dir einen Kuchen mit.', es: 'Te llevo una tarta.' },
            { de: 'Was sollen wir den Gastgebern schenken?', es: '¿Qué les regalamos a los anfitriones?' }
          ]
        },
        {
          key: 'im-restaurant-konjunktiv-bestellen',
          regel: 'Bestellen: ich hätte gern',
          erklaerung: 'En un restaurante no se pide con ich will. Lo normal es Ich hätte gern… o Ich nehme… o Für mich bitte… Todas suenan educadas; ich will suena a exigencia.',
          beispiele: [
            { de: 'Ich hätte gern die Suppe, bitte.', es: 'Querría la sopa, por favor.' },
            { de: 'Für mich bitte ein Mineralwasser.', es: 'Para mí un agua mineral, por favor.' }
          ]
        },
        {
          key: 'man-unpersoenlich-essen',
          regel: 'man: wie macht man das?',
          erklaerung: 'man sirve para hablar en general, sin decir quién: Wie macht MAN das? Bei uns isst MAN spät. Va siempre con el verbo en 3ª persona del singular, como er/sie/es.',
          beispiele: [
            { de: 'Wie macht man diese Suppe?', es: '¿Cómo se hace esta sopa?' },
            { de: 'In Spanien isst man später als hier.', es: 'En España se come más tarde que aquí.' }
          ]
        },
        {
          key: 'aussprache-r-am-wortende',
          regel: 'Aussprache: das r',
          erklaerung: 'El r alemán no es el español. Al principio de sílaba se hace en la garganta, casi como una g suave: Reis, Brot. Al final de palabra o en -er casi no se oye y suena como una a floja: Bier suena «bía», Vater suena «fáta».',
          beispiele: [
            { de: 'Ein Bier und ein Wasser, bitte.', es: 'Una cerveza y un agua, por favor.' },
            { de: 'Mein Vater kocht heute für uns.', es: 'Hoy cocina mi padre para nosotros.' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'eine Einladung aussprechen',
          es: 'Hacer una invitación',
          wendungen: [
            { de: 'Hast du Lust, morgen vorbeizukommen?', es: '¿Te apetece pasarte mañana?' }
          ]
        },
        {
          funktion: 'auf private Einladungen reagieren',
          es: 'Responder a invitaciones privadas',
          wendungen: [
            { de: 'Ich möchte dich zum Essen einladen.', es: 'Quiero invitarte a comer.' }
          ]
        },
        {
          funktion: 'Besuche und Gastfreundschaft organisieren',
          es: 'Organizar visitas y hospitalidad',
          wendungen: [
            { de: 'Kommt ihr am Sonntag zum Essen?', es: '¿Venís el domingo a comer?' }
          ]
        },
        {
          funktion: 'im Restaurant bestellen und bezahlen',
          es: 'Pedir y pagar en el restaurante',
          wendungen: [
            { de: 'Haben Sie noch einen Tisch für zwei frei?', es: '¿Les queda una mesa libre para dos?' }
          ]
        },
        {
          funktion: 'Wünsche und Vorlieben im Lokal äußern',
          es: 'Expresar preferencias y peticiones en el local',
          wendungen: [
            { de: 'Können wir draußen im Gastgarten sitzen?', es: '¿Podemos sentarnos fuera en la terraza?' }
          ]
        },
        {
          funktion: 'jemanden beruhigen und ermutigen',
          es: 'Tranquilizar y animar a alguien',
          wendungen: [
            { de: 'Ich habe morgen die Prüfung und schlafe schon nicht mehr.', es: 'Mañana tengo el examen y ya no duermo.' }
          ]
        },
        {
          funktion: 'Essgewohnheiten und Regionen vergleichen',
          es: 'Comparar hábitos de comida y regiones',
          wendungen: [
            { de: 'Bei uns isst man das ganz anders.', es: 'En mi país eso se come de otra forma.' }
          ]
        },
        {
          funktion: 'Überraschung und Staunen ausdrücken',
          es: 'Expresar sorpresa y asombro',
          wendungen: [
            { de: 'Das ist alles hausgemacht? Wirklich?', es: '¿Todo esto es casero? ¿En serio?' }
          ]
        }
      ]
    },

    // ==================== LEKTION 3 ====================
    {
      id: 'a21-l3',
      legacyId: 'l3',
      nr: 3,
      name: 'Joggen ist super!',
      woerter: [
        {
          thema: 'Mannschaftssportarten',
          items: [
            { de: 'der Fußball', es: 'el fútbol', ex: 'Am Sonntag schauen wir zusammen Fußball.', exEs: 'El domingo vemos el fútbol juntos.' },
            { de: 'der Handball', es: 'el balonmano', ex: 'Meine Schwester spielt seit Jahren Handball.', exEs: 'Mi hermana juega al balonmano desde hace años.' },
            { de: 'der Volleyball', es: 'el voleibol', ex: 'Im Sommer spielen wir Volleyball am Strand.', exEs: 'En verano jugamos al voleibol en la playa.' },
            { de: 'der Basketball', es: 'el baloncesto', ex: 'Für Basketball bin ich zu klein.', exEs: 'Para el baloncesto soy demasiado bajo.' },
            { de: 'das Eishockey', es: 'el hockey sobre hielo', ex: 'In Österreich ist Eishockey sehr beliebt.', exEs: 'En Austria el hockey sobre hielo gusta mucho.' },
            { de: 'die Mannschaft, -en', es: 'el equipo', ex: 'Unsere Mannschaft hat dieses Jahr viel trainiert.', exEs: 'Nuestro equipo ha entrenado mucho este año.' },
            { de: 'das Team, -s', es: 'el equipo', ex: 'Im Team kommen wir gut miteinander aus.', exEs: 'En el equipo nos llevamos bien.' },
            { de: 'der Verein, -e', es: 'el club', ex: 'Mit acht Jahren bin ich in den Verein eingetreten.', exEs: 'A los ocho años entré en el club.' },
            { de: 'das Tor, -e', es: 'el gol / la portería', ex: 'In der letzten Minute fiel das Tor.', exEs: 'El gol llegó en el último minuto.' },
            { de: 'gewinnen', es: 'ganar', ex: 'Wir haben zwei zu eins gewonnen.', exEs: 'Ganamos dos a uno.' },
            { de: 'verlieren', es: 'perder', ex: 'Verlieren ist auch Teil des Sports.', exEs: 'Perder también forma parte del deporte.' },
            { de: 'der Sieg, -e', es: 'la victoria', ex: 'Nach dem Sieg haben alle gefeiert.', exEs: 'Después de la victoria lo celebraron todos.' },
            { de: 'die Niederlage, -n', es: 'la derrota', ex: 'Die Niederlage war verdient.', exEs: 'La derrota fue merecida.' },
            { de: 'das Spiel, -e', es: 'el partido', ex: 'Das Spiel fängt um halb neun an.', exEs: 'El partido empieza a las ocho y media.' },
            { de: 'der Trainer / die Trainerin', es: 'el entrenador / la entrenadora', ex: 'Der Trainer hat uns nach dem Spiel gelobt.', exEs: 'El entrenador nos felicitó después del partido.' }
          ]
        },
        {
          thema: 'Leichtathletik',
          items: [
            { de: 'laufen', es: 'correr', ex: 'Ich laufe dreimal die Woche im Park.', exEs: 'Corro tres veces por semana en el parque.' },
            { de: 'joggen', es: 'hacer footing', ex: 'Morgens joggen ist mir zu kalt.', exEs: 'Hacer footing por la mañana es demasiado frío para mí.' },
            { de: 'springen', es: 'saltar', ex: 'Er ist über den Zaun gesprungen.', exEs: 'Saltó por encima de la valla.' },
            { de: 'der Weitsprung', es: 'el salto de longitud', ex: 'Im Weitsprung war ich in der Schule ganz gut.', exEs: 'En salto de longitud no se me daba mal en el colegio.' },
            { de: 'der Hochsprung', es: 'el salto de altura', ex: 'Beim Hochsprung habe ich nie die Latte geschafft.', exEs: 'En salto de altura nunca pasé el listón.' },
            { de: 'werfen', es: 'lanzar', ex: 'Wirf mir bitte den Ball zu!', exEs: '¡Lánzame la pelota!' },
            { de: 'die Strecke, -n', es: 'el recorrido', ex: 'Die Strecke ist zehn Kilometer lang.', exEs: 'El recorrido tiene diez kilómetros.' },
            { de: 'der Marathon', es: 'el maratón', ex: 'Nächstes Jahr will ich einen Marathon laufen.', exEs: 'El año que viene quiero correr un maratón.' },
            { de: 'das Stadion', es: 'el estadio', ex: 'Das Stadion war komplett ausverkauft.', exEs: 'El estadio estaba completamente lleno.' },
            { de: 'der Wettkampf, ¨-e', es: 'la competición', ex: 'Vor dem Wettkampf schlafe ich immer schlecht.', exEs: 'Antes de la competición siempre duermo mal.' },
            { de: 'der Rekord, -e', es: 'el récord', ex: 'Sie hat den Rekord um zwei Sekunden verbessert.', exEs: 'Mejoró el récord en dos segundos.' }
          ]
        },
        {
          thema: 'Fitness und Individualsportarten',
          items: [
            { de: 'das Fitnessstudio, -s', es: 'el gimnasio', ex: 'Ich gehe zweimal pro Woche ins Fitnessstudio.', exEs: 'Voy al gimnasio dos veces por semana.' },
            { de: 'Yoga machen', es: 'hacer yoga', ex: 'Abends mache ich zwanzig Minuten Yoga.', exEs: 'Por la noche hago veinte minutos de yoga.' },
            { de: 'Rad fahren', es: 'ir en bici', ex: 'In Wien fahre ich überall mit dem Rad.', exEs: 'En Viena voy a todas partes en bici.' },
            { de: 'schwimmen', es: 'nadar', ex: 'Im Sommer gehe ich fast täglich schwimmen.', exEs: 'En verano voy a nadar casi todos los días.' },
            { de: 'klettern', es: 'escalar', ex: 'Am Wochenende klettern wir in den Bergen.', exEs: 'El fin de semana escalamos en la montaña.' },
            { de: 'Ski fahren', es: 'esquiar', ex: 'In Österreich lernen die Kinder früh Ski fahren.', exEs: 'En Austria los niños aprenden a esquiar pronto.' },
            { de: 'wandern', es: 'hacer senderismo', ex: 'Am Sonntag sind wir vier Stunden gewandert.', exEs: 'El domingo caminamos cuatro horas.' },
            { de: 'tanzen', es: 'bailar', ex: 'Auf der Hochzeit haben wir bis zwei getanzt.', exEs: 'En la boda bailamos hasta las dos.' },
            { de: 'trainieren', es: 'entrenar', ex: 'Für den Lauf trainiere ich seit drei Monaten.', exEs: 'Para la carrera llevo tres meses entrenando.' },
            { de: 'sich aufwärmen', es: 'calentar', ex: 'Vor dem Sport muss man sich gut aufwärmen.', exEs: 'Antes de hacer deporte hay que calentar bien.' },
            { de: 'sich bewegen', es: 'moverse, hacer ejercicio', ex: 'Im Büro bewege ich mich viel zu wenig.', exEs: 'En la oficina me muevo demasiado poco.' },
            { de: 'fit sein', es: 'estar en forma', ex: 'Mit sechzig ist mein Vater noch richtig fit.', exEs: 'Con sesenta años mi padre sigue muy en forma.' },
            { de: 'sportlich', es: 'deportista', ex: 'Sportlich war ich noch nie.', exEs: 'Deportista no he sido nunca.' },
            { de: 'anstrengend', es: 'agotador', ex: 'Das Training gestern war echt anstrengend.', exEs: 'El entrenamiento de ayer fue agotador.' },
            { de: 'die Ausdauer', es: 'la resistencia', ex: 'Beim Laufen fehlt mir die Ausdauer.', exEs: 'Corriendo me falta resistencia.' },
            { de: 'die Verletzung, -en', es: 'la lesión', ex: 'Wegen einer Verletzung konnte er nicht spielen.', exEs: 'Por una lesión no pudo jugar.' }
          ]
        },
        {
          thema: 'Training & Verein',
          items: [
            { de: 'die Bewegung', es: 'el movimiento, la actividad física', ex: 'Bewegung ist wichtig für die Gesundheit.', exEs: 'El movimiento es importante para la salud.' },
            { de: 'die Kondition', es: 'la forma física', ex: 'Meine Kondition ist nicht mehr die beste.', exEs: 'Mi forma física ya no es la mejor.' },
            { de: 'die Muskeln', es: 'los músculos', ex: 'Nach dem Training tun mir alle Muskeln weh.', exEs: 'Después del entrenamiento me duelen todos los músculos.' },
            { de: 'der Muskelkater', es: 'las agujetas', ex: 'Heute habe ich starken Muskelkater.', exEs: 'Hoy tengo muchas agujetas.' },
            { de: 'sich dehnen', es: 'estirar', ex: 'Nach dem Laufen soll man sich dehnen.', exEs: 'Después de correr hay que estirar.' },
            { de: 'die Turnschuhe', es: 'las zapatillas de deporte', ex: 'Ohne gute Turnschuhe tut der Fuß weh.', exEs: 'Sin buenas zapatillas duele el pie.' },
            { de: 'der Schiedsrichter', es: 'el árbitro', ex: 'Der Schiedsrichter hat falsch entschieden.', exEs: 'El árbitro se ha equivocado.' },
            { de: 'das Unentschieden', es: 'el empate', ex: 'Das Spiel endete mit einem Unentschieden.', exEs: 'El partido acabó en empate.' },
            { de: 'die Meisterschaft', es: 'el campeonato', ex: 'Unser Verein hat die Meisterschaft gewonnen.', exEs: 'Nuestro club ha ganado el campeonato.' },
            { de: 'der Zuschauer', es: 'el espectador', ex: 'Im Stadion waren zehntausend Zuschauer.', exEs: 'En el estadio había diez mil espectadores.' },
            { de: 'der Beitrag', es: 'la cuota', ex: 'Der Beitrag im Verein ist nicht hoch.', exEs: 'La cuota del club no es alta.' },
            { de: 'die Umkleide', es: 'el vestuario', ex: 'Die Umkleide ist im Keller.', exEs: 'El vestuario está en el sótano.' },
            { de: 'die Dusche', es: 'la ducha', ex: 'Nach dem Training gehe ich unter die Dusche.', exEs: 'Después de entrenar me doy una ducha.' },
            { de: 'abnehmen', es: 'adelgazar', ex: 'Ich möchte bis zum Sommer drei Kilo abnehmen.', exEs: 'Quiero adelgazar tres kilos para el verano.' },
            { de: 'zunehmen', es: 'engordar', ex: 'Im Winter nehme ich immer zu.', exEs: 'En invierno siempre engordo.' },
            { de: 'die Ernährung', es: 'la alimentación', ex: 'Die Ernährung ist wichtiger als das Training.', exEs: 'La alimentación importa más que el entrenamiento.' },
            { de: 'der Puls', es: 'el pulso', ex: 'Beim Laufen kontrolliere ich meinen Puls.', exEs: 'Al correr controlo el pulso.' },
            { de: 'die Ausrede', es: 'la excusa', ex: 'Keine Ausrede, komm einfach mit!', exEs: '¡Nada de excusas, vente sin más!' },
            { de: 'regelmäßig', es: 'con regularidad', ex: 'Ich trainiere regelmäßig dreimal die Woche.', exEs: 'Entreno con regularidad tres veces por semana.' }
          ]
        },
        {
          thema: 'Wettkampf & Bad',
          items: [
            { de: 'der Punkt', es: 'el punto', ex: 'Wir brauchen nur noch einen Punkt.', exEs: 'Solo nos falta un punto.' },
            { de: 'die Halbzeit', es: 'el descanso', ex: 'In der Halbzeit gibt es heißen Tee.', exEs: 'En el descanso hay té caliente.' },
            { de: 'die Technik', es: 'la técnica', ex: 'An der Technik muss ich noch arbeiten.', exEs: 'Todavía tengo que trabajar la técnica.' },
            { de: 'die Kraft', es: 'la fuerza', ex: 'Für dieses Gerät braucht man Kraft.', exEs: 'Para esta máquina hace falta fuerza.' },
            { de: 'die Beweglichkeit', es: 'la flexibilidad', ex: 'Yoga verbessert die Beweglichkeit deutlich.', exEs: 'El yoga mejora bastante la flexibilidad.' },
            { de: 'der Schweiß', es: 'el sudor', ex: 'Nach einer Stunde läuft der Schweiß.', exEs: 'A la hora el sudor cae solo.' },
            { de: 'der Start', es: 'la salida', ex: 'Der Start ist pünktlich um neun Uhr.', exEs: 'La salida es puntual a las nueve.' },
            { de: 'die Startnummer', es: 'el dorsal', ex: 'Die Startnummer holst du am Vortag ab.', exEs: 'El dorsal lo recoges el día antes.' },
            { de: 'der Pokal', es: 'la copa, el trofeo', ex: 'Der Pokal steht im Vereinsheim.', exEs: 'El trofeo está en la sede del club.' },
            { de: 'die Medaille', es: 'la medalla', ex: 'Für den dritten Platz gibt es eine Medaille.', exEs: 'Por el tercer puesto hay medalla.' },
            { de: 'der Gegner', es: 'el rival', ex: 'Der Gegner war einfach besser als wir.', exEs: 'El rival fue sencillamente mejor que nosotros.' },
            { de: 'fair', es: 'justo, deportivo', ex: 'Das Spiel war fair von beiden Seiten.', exEs: 'El partido fue deportivo por ambas partes.' },
            { de: 'das Freibad', es: 'la piscina al aire libre', ex: 'Im Freibad ist es im Juli sehr voll.', exEs: 'En julio la piscina al aire libre está llenísima.' },
            { de: 'das Hallenbad', es: 'la piscina cubierta', ex: 'Im Winter gehe ich ins Hallenbad.', exEs: 'En invierno voy a la piscina cubierta.' },
            { de: 'die Bahn', es: 'la calle (de piscina)', ex: 'Schwimm bitte auf der rechten Bahn.', exEs: 'Nada por la calle de la derecha, por favor.' },
            { de: 'der Schritt', es: 'el paso', ex: 'Beim Tanzen zähle ich noch die Schritte.', exEs: 'Bailando todavía cuento los pasos.' },
            { de: 'der Sprung', es: 'el salto', ex: 'Der Sprung war leider zu kurz.', exEs: 'El salto fue demasiado corto.' },
            { de: 'der Erfolg', es: 'el éxito', ex: 'Der Erfolg kam erst nach zwei Jahren.', exEs: 'El éxito llegó a los dos años.' },
            { de: 'verletzt', es: 'lesionado', ex: 'Er ist seit einem Monat verletzt.', exEs: 'Lleva un mes lesionado.' },
            { de: 'der Ruhetag', es: 'el día de descanso', ex: 'Jeder Sportler braucht einen Ruhetag.', exEs: 'Todo deportista necesita un día de descanso.' }
          ]
        },
        {
          thema: 'Verein & Platz',
          items: [
            { de: 'die Trainingseinheit', es: 'la sesión de entrenamiento', ex: 'Eine Trainingseinheit dauert neunzig Minuten.', exEs: 'Una sesión de entrenamiento dura noventa minutos.' },
            { de: 'der Spielplan', es: 'el calendario de partidos', ex: 'Der Spielplan für die Saison steht schon.', exEs: 'El calendario de la temporada ya está.' },
            { de: 'die Saison', es: 'la temporada', ex: 'Die Saison beginnt Anfang September.', exEs: 'La temporada empieza a principios de septiembre.' },
            { de: 'die Liga', es: 'la liga', ex: 'Wir spielen seit zwei Jahren in der zweiten Liga.', exEs: 'Llevamos dos años en segunda división.' },
            { de: 'die Tabelle', es: 'la clasificación', ex: 'In der Tabelle stehen wir auf Platz drei.', exEs: 'En la clasificación vamos terceros.' },
            { de: 'das Trikot', es: 'la camiseta de equipo', ex: 'Das neue Trikot ist dunkelblau.', exEs: 'La camiseta nueva es azul oscuro.' },
            { de: 'das Netz', es: 'la red', ex: 'Der Ball ist im Netz hängen geblieben.', exEs: 'El balón se quedó en la red.' },
            { de: 'das Spielfeld', es: 'el campo de juego', ex: 'Das Spielfeld ist nach dem Regen sehr nass.', exEs: 'El campo está muy mojado después de la lluvia.' },
            { de: 'der Schläger', es: 'la raqueta', ex: 'Mein Schläger ist mir eindeutig zu schwer.', exEs: 'Mi raqueta me pesa demasiado.' },
            { de: 'der Kapitän', es: 'el capitán', ex: 'Der Kapitän spricht mit dem Schiedsrichter.', exEs: 'El capitán habla con el árbitro.' },
            { de: 'das Foul', es: 'la falta', ex: 'Das Foul war wirklich eindeutig.', exEs: 'La falta fue clarísima.' },
            { de: 'die Gelbe Karte', es: 'la tarjeta amarilla', ex: 'Er hat schon die Gelbe Karte bekommen.', exEs: 'Ya ha visto la tarjeta amarilla.' },
            { de: 'die Tribüne', es: 'la grada', ex: 'Auf der Tribüne war kein Platz mehr frei.', exEs: 'En la grada ya no quedaba sitio.' },
            { de: 'die Anstrengung', es: 'el esfuerzo', ex: 'Nach der Anstrengung tut mir alles weh.', exEs: 'Después del esfuerzo me duele todo.' },
            { de: 'der Krampf', es: 'el calambre', ex: 'Nach einer Stunde bekam ich einen Krampf.', exEs: 'A la hora me dio un calambre.' },
            { de: 'die Dehnübung', es: 'el estiramiento', ex: 'Diese Dehnübung kenne ich noch nicht.', exEs: 'Este estiramiento no lo conozco.' },
            { de: 'das Gerät', es: 'la máquina', ex: 'An diesem Gerät trainiere ich den Rücken.', exEs: 'En esta máquina entreno la espalda.' },
            { de: 'der Sportplatz', es: 'el campo de deportes', ex: 'Der Sportplatz liegt direkt hinter der Schule.', exEs: 'El campo de deportes está justo detrás del colegio.' },
            { de: 'die Turnhalle', es: 'el gimnasio escolar', ex: 'Die Turnhalle wird gerade renoviert.', exEs: 'El gimnasio se está reformando.' },
            { de: 'barfuß', es: 'descalzo', ex: 'Im Studio darf man nicht barfuß trainieren.', exEs: 'En el gimnasio no se puede entrenar descalzo.' }
          ]
        },
        {
          thema: 'Beim Laufen & im Park',
          items: [
            { de: 'die Runde', es: 'la vuelta', ex: 'Ich laufe jeden Morgen zwei Runden im Park.', exEs: 'Cada mañana doy dos vueltas corriendo al parque.' },
            { de: 'der Spielplatz', es: 'el parque infantil', ex: 'Neben dem Spielplatz gibt es Geräte zum Trainieren.', exEs: 'Al lado del parque infantil hay aparatos para entrenar.' },
            { de: 'die Laufstrecke', es: 'el recorrido, la ruta de carrera', ex: 'Meine Laufstrecke ist genau fünf Kilometer lang.', exEs: 'Mi ruta mide exactamente cinco kilómetros.' },
            { de: 'die Parkbank', es: 'el banco del parque', ex: 'Nach dem Laufen setze ich mich auf eine Parkbank.', exEs: 'Después de correr me siento en un banco del parque.' },
            { de: 'die frische Luft', es: 'el aire fresco', ex: 'Die frische Luft tut mir nach dem Büro gut.', exEs: 'El aire fresco me sienta bien después de la oficina.' },
            { de: 'das Tempo', es: 'el ritmo', ex: 'Halt ein Tempo, bei dem du noch reden kannst.', exEs: 'Mantén un ritmo con el que aún puedas hablar.' },
            { de: 'die Wasserflasche', es: 'la botella de agua', ex: 'Ohne Wasserflasche gehe ich im Sommer nicht los.', exEs: 'En verano no salgo sin botella de agua.' },
            { de: 'die Kopfhörer', es: 'los auriculares', ex: 'Mit Kopfhörern läuft es sich leichter.', exEs: 'Con auriculares se corre más fácil.' },
            { de: 'die Sportuhr', es: 'el reloj deportivo', ex: 'Meine Sportuhr misst den Puls.', exEs: 'Mi reloj deportivo mide el pulso.' },
            { de: 'die Trinkpause', es: 'la parada para beber', ex: 'Bei Hitze mache ich alle zwei Kilometer eine Trinkpause.', exEs: 'Con calor paro a beber cada dos kilómetros.' }
          ]
        },
        {
          thema: 'Wie es läuft',
          items: [
            { de: 'schaffen', es: 'conseguir, lograr', ex: 'Zehn Kilometer schaffe ich inzwischen locker.', exEs: 'Diez kilómetros ya los hago sin problema.' },
            { de: 'sich steigern', es: 'mejorar, ir a más', ex: 'In drei Monaten habe ich mich deutlich gesteigert.', exEs: 'En tres meses he mejorado bastante.' },
            { de: 'nachlassen', es: 'aflojar, bajar el rendimiento', ex: 'Nach dem dritten Kilometer lasse ich immer nach.', exEs: 'A partir del tercer kilómetro siempre aflojo.' },
            { de: 'sich überwinden', es: 'vencer la pereza', ex: 'Im Winter muss ich mich jeden Tag überwinden.', exEs: 'En invierno tengo que vencer la pereza cada día.' },
            { de: 'außer Atem sein', es: 'quedarse sin aliento', ex: 'Nach der Steigung war ich völlig außer Atem.', exEs: 'Después de la cuesta me quedé sin aliento.' },
            { de: 'das Tempo halten', es: 'mantener el ritmo', ex: 'Die letzten zwei Kilometer konnte ich das Tempo halten.', exEs: 'Los últimos dos kilómetros pude mantener el ritmo.' },
            { de: 'langsamer werden', es: 'ir más despacio', ex: 'Am Ende werde ich immer langsamer.', exEs: 'Al final siempre voy más despacio.' },
            { de: 'sich verausgaben', es: 'pasarse de esfuerzo', ex: 'Am ersten Tag sollte man sich nicht verausgaben.', exEs: 'El primer día no conviene pasarse.' },
            { de: 'die Bestzeit', es: 'la mejor marca', ex: 'Beim Lauf im Mai hatte ich meine Bestzeit.', exEs: 'En la carrera de mayo hice mi mejor marca.' }
          ]
        }
      ],
      pitfalls: [
        'Tras un comparativo siempre va "als", nunca "wie": "größer ALS", no "größer wie" (error muy común incluso entre nativos).',
        'El superlativo con verbo lleva "am …-sten": "Er läuft am schnellsten" (no "der schnellste" salvo con sustantivo).',
        '"jemand" y "niemand" se declinan: jemanden (Akk.), jemandem (Dat.).'
      ],
      grammatik: [
        {
          regel: 'Wiederholung Komparativ und Superlativ: gut, viel, gern',
          key: 'komparativ-wdh',
          erklaerung: 'Tres formas irregulares que hay que saber de memoria: gut–besser–am besten, viel–mehr–am meisten, gern–lieber–am liebsten.',
          detail:
            'Son las tres irregularidades más frecuentes del alemán. No siguen la regla de -er / -sten, así que se memorizan como bloque.\n\n"gern / lieber / am liebsten" no describe cosas sino cuánto te gusta HACER algo, y acompaña al verbo: "Ich schwimme gern, aber ich laufe lieber, und am liebsten klettere ich."\n\nOjo: "lieber" (preferir hacer) no es lo mismo que "besser" (mejor de calidad). "Ich spiele lieber Tennis" = prefiero jugar al tenis. "Ich spiele besser Tennis" = juego mejor al tenis.',
          tabelle: {
            title: 'Las tres irregulares',
            headers: ['Positivo', 'Comparativo', 'Superlativo', 'Uso'],
            rows: [
              ['gut', 'besser', 'am besten', 'calidad'],
              ['viel', 'mehr', 'am meisten', 'cantidad'],
              ['gern', 'lieber', 'am liebsten', 'preferencia al hacer algo']
            ]
          },
          beispiele: [
            { de: 'Ich schwimme gern, aber ich laufe lieber.', es: 'Me gusta nadar, pero prefiero correr.' },
            { de: 'Am liebsten gehe ich klettern.', es: 'Lo que más me gusta es escalar.' },
            { de: 'Zofia spielt besser Volleyball als ich.', es: 'Zofia juega mejor al voleibol que yo.' },
            { de: 'Er trainiert am meisten von allen.', es: 'Él es el que más entrena de todos.' }
          ]
        },
        {
          regel: 'Komparativ und Superlativ',
          key: 'komparativ-superlativ',
          erklaerung: 'Comparativo: adjetivo + -er. Superlativo: am + adjetivo + -sten. Los monosílabos suelen añadir Umlaut.',
          detail:
            'Comparativo = adjetivo + -er (schnell → schneller, interessant → interessanter). Muchos adjetivos cortos de una sílaba añaden además Umlaut: alt → älter, jung → jünger, groß → größer, stark → stärker, lang → länger.\n\nSuperlativo con verbo = am + adjetivo + -sten: "Er läuft am schnellsten." Si el adjetivo acaba en -t, -d, -s, -ß, -z se mete una -e- para poder pronunciarlo: am ältesten, am interessantesten.\n\nSi el superlativo va DELANTE de un sustantivo, se usa el artículo + terminación: "der schnellste Läufer", "die beste Mannschaft".\n\nAlgunos adjetivos son irregulares: gut–besser–am besten, hoch–höher–am höchsten, nah–näher–am nächsten.',
          tabelle: {
            title: 'Formación',
            headers: ['Positivo', 'Comparativo', 'Superlativo', 'Nota'],
            rows: [
              ['schnell', 'schneller', 'am schnellsten', 'regular'],
              ['alt', 'älter', 'am ältesten', 'Umlaut + -e-'],
              ['groß', 'größer', 'am größten', 'Umlaut, irregular'],
              ['teuer', 'teurer', 'am teuersten', 'pierde la -e-'],
              ['hoch', 'höher', 'am höchsten', 'irregular'],
              ['gut', 'besser', 'am besten', 'irregular']
            ]
          },
          beispiele: [
            { de: 'Fußball ist populärer als Handball.', es: 'El fútbol es más popular que el balonmano.' },
            { de: 'Von allen läuft Zofia am schnellsten.', es: 'De todos, Zofia es la que corre más rápido.' },
            { de: 'Klettern ist anstrengender als Yoga.', es: 'Escalar es más agotador que el yoga.' },
            { de: 'Das ist die beste Mannschaft der Liga.', es: 'Es el mejor equipo de la liga.' }
          ]
        },
        {
          regel: 'Vergleichspartikel als, wie',
          key: 'als-wie',
          erklaerung: '"als" tras comparativo (desigualdad); "(so) … wie" para igualdad.',
          detail:
            'Regla sencilla y sin excepciones: si delante hay un COMPARATIVO (-er), la partícula es "als". Si comparas dos cosas IGUALES, usas "so … wie".\n\n"Schwimmen ist gesünder ALS Autofahren." (desigual)\n"Sie ist SO sportlich WIE ihr Bruder." (igual)\n\nPara reforzar la igualdad puedes usar "genauso … wie" (exactamente igual de) y para negarla "nicht so … wie": "Handball ist nicht so populär wie Fußball."\n\nEste es uno de los errores más frecuentes de los hispanohablantes porque en español usamos "que" y "como" de otra manera. Truco: -er → als.',
          tabelle: {
            title: 'Comparar',
            headers: ['Tipo', 'Estructura', 'Ejemplo'],
            rows: [
              ['Desigualdad', 'comparativo + als', 'Laufen ist anstrengender als Yoga.'],
              ['Igualdad', 'so + positivo + wie', 'Sie ist so schnell wie ich.'],
              ['Igualdad enfática', 'genauso + positivo + wie', 'Er trainiert genauso viel wie du.'],
              ['Desigualdad negada', 'nicht so + positivo + wie', 'Handball ist nicht so populär wie Fußball.']
            ]
          },
          beispiele: [
            { de: 'Schwimmen ist gesünder als Autofahren.', es: 'Nadar es más sano que ir en coche.' },
            { de: 'Sie ist so sportlich wie ihr Bruder.', es: 'Ella es tan deportista como su hermano.' },
            { de: 'Der Marathon war härter, als ich gedacht habe.', es: 'El maratón fue más duro de lo que pensaba.' },
            { de: 'Yoga ist nicht so anstrengend wie Klettern.', es: 'El yoga no es tan agotador como escalar.' }
          ]
        },
        {
          regel: 'Indefinitpronomen jemand, niemand',
          key: 'jemand-niemand',
          erklaerung: 'jemand = alguien, niemand = nadie. Se declinan: jemanden (Akk.), jemandem (Dat.).',
          detail:
            'Sustituyen a una persona indeterminada y funcionan como un sustantivo masculino singular: el verbo va siempre en 3ª persona del singular. "Niemand WEISS das."\n\nSe declinan igual que el artículo: nominativo jemand / niemand, acusativo jemanden / niemanden, dativo jemandem / niemandem. En el lenguaje hablado la terminación a veces se omite, pero en el examen conviene ponerla.\n\nNo se combinan con "nicht": "niemand" ya es negativo. Di "Ich kenne niemanden", no "Ich kenne nicht jemanden".\n\nPara cosas en vez de personas se usan "etwas" (algo) y "nichts" (nada), que NO se declinan.',
          tabelle: {
            title: 'Declinación',
            headers: ['Caso', 'jemand', 'niemand', 'Ejemplo'],
            rows: [
              ['Nominativ', 'jemand', 'niemand', 'Niemand kommt.'],
              ['Akkusativ', 'jemanden', 'niemanden', 'Ich sehe niemanden.'],
              ['Dativ', 'jemandem', 'niemandem', 'Ich helfe jemandem.']
            ]
          },
          beispiele: [
            { de: 'Kennst du jemanden im Verein?', es: '¿Conoces a alguien en el club?' },
            { de: 'Niemand wollte am Sonntag mitkommen.', es: 'Nadie quiso venir el domingo.' },
            { de: 'Ich habe mit niemandem darüber gesprochen.', es: 'No he hablado con nadie de eso.' },
            { de: 'Hat jemand meine Sporttasche gesehen?', es: '¿Alguien ha visto mi bolsa de deporte?' }
          ]
        },
        {
          key: 'seit-dauer-praesens',
          regel: 'seit + Dativ mit Präsens',
          erklaerung: 'Para algo que empezó antes y SIGUE, el alemán usa seit + dativo con el verbo en PRESENTE, no en pasado: Ich laufe SEIT zwei Jahren. En español diríamos «llevo dos años corriendo».',
          beispiele: [
            { de: 'Ich laufe seit zwei Jahren regelmäßig.', es: 'Llevo dos años corriendo con regularidad.' },
            { de: 'Seit dem Winter trainiert sie im Studio.', es: 'Desde el invierno entrena en el gimnasio.' }
          ]
        },
        {
          key: 'reflexive-verben-sport',
          regel: 'sich aufwärmen, sich bewegen',
          erklaerung: 'El deporte está lleno de reflexivos: sich aufwärmen, sich bewegen, sich dehnen, sich anstrengen, sich verletzen, sich ausruhen. El pronombre va detrás del verbo conjugado y el prefijo separable, al final: Ich wärme MICH zehn Minuten AUF.',
          beispiele: [
            { de: 'Ich wärme mich zehn Minuten auf.', es: 'Caliento diez minutos.' },
            { de: 'Nach dem Training ruhe ich mich aus.', es: 'Después de entrenar descanso.' }
          ]
        },
        {
          key: 'zweiteilige-konnektoren',
          regel: 'sowohl … als auch, entweder … oder',
          erklaerung: 'Conectores de dos piezas. sowohl … als auch = tanto… como. entweder … oder = o… o. weder … noch = ni… ni. nicht nur … sondern auch = no solo… sino también.',
          beispiele: [
            { de: 'Ich spiele sowohl Tennis als auch Fußball.', es: 'Juego tanto al tenis como al fútbol.' },
            { de: 'Entweder wir laufen oder wir gehen schwimmen.', es: 'O corremos o vamos a nadar.' }
          ]
        },
        {
          key: 'adjektiv-ohne-artikel',
          regel: 'Adjektive ohne Artikel',
          erklaerung: 'Sin artículo delante, el adjetivo tiene que hacer el trabajo del artículo y coge sus terminaciones: frischER Saft, kaltE Milch, kaltES Wasser. Pasa mucho en el deporte y la comida, donde se habla en general.',
          beispiele: [
            { de: 'Nach dem Sport trinke ich kaltes Wasser.', es: 'Después del deporte bebo agua fría.' },
            { de: 'Frische Luft tut immer gut.', es: 'El aire fresco siempre sienta bien.' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'einen sportlichen Vorschlag machen',
          es: 'Hacer una propuesta deportiva',
          wendungen: [
            { de: 'Wollen wir am Samstag joggen gehen?', es: '¿Salimos a correr el sábado?' }
          ]
        },
        {
          funktion: 'Vorschläge annehmen',
          es: 'Aceptar una propuesta',
          wendungen: [
            { de: 'Super Idee, das machen wir!', es: '¡Buenísima idea, lo hacemos!' }
          ]
        },
        {
          funktion: 'Vorschläge ablehnen und begründen',
          es: 'Rechazar una propuesta de forma razonada',
          wendungen: [
            { de: 'Kommst du am Sonntag zum Fußball?', es: '¿Vienes el domingo al fútbol?' }
          ]
        },
        {
          funktion: 'Sportarten und Aktivitäten bewerten',
          es: 'Valorar deportes y actividades',
          wendungen: [
            { de: 'Joggen ist super, aber das Fitnessstudio finde ich langweilig.', es: 'Correr es genial, pero el gimnasio me parece aburrido.' }
          ]
        },
        {
          funktion: 'Vorlieben beim Sport ausdrücken',
          es: 'Expresar preferencias deportivas',
          wendungen: [
            { de: 'Ich mag Mannschaftssport lieber als Einzelsport.', es: 'Me gusta más el deporte de equipo que el individual.' }
          ]
        },
        {
          funktion: 'über Trainingsgewohnheiten sprechen',
          es: 'Hablar de hábitos de entrenamiento',
          wendungen: [
            { de: 'Machst du regelmäßig Sport?', es: '¿Practicas deporte con regularidad?' }
          ]
        },
        {
          funktion: 'über Wettkämpfe und Ergebnisse sprechen',
          es: 'Hablar de competiciones y resultados',
          wendungen: [
            { de: 'Wie war das Spiel am Wochenende?', es: '¿Qué tal el partido del fin de semana?' }
          ]
        },
        {
          funktion: 'über Fitness und Motivation sprechen',
          es: 'Hablar de forma física y motivación',
          wendungen: [
            { de: 'Heute fehlt mir einfach die Kraft.', es: 'Hoy simplemente no tengo fuerzas.' }
          ]
        }
      ]
    },

    // ==================== LEKTION 4 ====================
    {
      id: 'a21-l4',
      legacyId: 'l4',
      nr: 4,
      name: 'Der erste Arbeitstag',
      woerter: [
        {
          thema: 'in der Firma',
          items: [
            { de: 'die Firma, Firmen', es: 'la empresa', ex: 'Die Firma hat fast dreihundert Mitarbeiter.', exEs: 'La empresa tiene casi trescientos empleados.' },
            { de: 'das Unternehmen', es: 'la empresa', ex: 'Das Unternehmen sitzt seit 1990 in Graz.', exEs: 'La empresa está en Graz desde 1990.' },
            { de: 'die Abteilung, -en', es: 'el departamento', ex: 'Ich arbeite in der Abteilung für Einkauf.', exEs: 'Trabajo en el departamento de compras.' },
            { de: 'der Chef / die Chefin', es: 'el jefe / la jefa', ex: 'Meine Chefin ist heute nicht im Haus.', exEs: 'Mi jefa hoy no está en la oficina.' },
            { de: 'die Besprechung, -en', es: 'la reunión', ex: 'Die Besprechung dauert höchstens eine Stunde.', exEs: 'La reunión dura como mucho una hora.' },
            { de: 'der Arbeitsplatz, ¨-e', es: 'el puesto de trabajo', ex: 'Mein Arbeitsplatz ist gleich neben dem Fenster.', exEs: 'Mi puesto de trabajo está justo al lado de la ventana.' },
            { de: 'das Büro, -s', es: 'la oficina', ex: 'Ab Montag arbeite ich wieder im Büro.', exEs: 'A partir del lunes vuelvo a trabajar en la oficina.' },
            { de: 'die Kantine, -n', es: 'el comedor', ex: 'Mittags essen wir alle in der Kantine.', exEs: 'Al mediodía comemos todos en el comedor.' },
            { de: 'die Pause, -n', es: 'la pausa', ex: 'Machen wir kurz Pause?', exEs: '¿Hacemos una pausa?' },
            { de: 'der Vertrag, ¨-e', es: 'el contrato', ex: 'Meinen Vertrag habe ich gestern unterschrieben.', exEs: 'Firmé mi contrato ayer.' },
            { de: 'das Gehalt, ¨-er', es: 'el sueldo', ex: 'Das Gehalt kommt am Ende des Monats.', exEs: 'El sueldo llega a final de mes.' },
            { de: 'die Arbeitszeit, -en', es: 'la jornada laboral', ex: 'Die Arbeitszeit ist bei uns ziemlich flexibel.', exEs: 'Aquí la jornada es bastante flexible.' },
            { de: 'die Überstunde, -n', es: 'la hora extra', ex: 'Diese Woche habe ich zehn Überstunden gemacht.', exEs: 'Esta semana he hecho diez horas extra.' },
            { de: 'der Urlaub', es: 'las vacaciones', ex: 'Im August nehme ich drei Wochen Urlaub.', exEs: 'En agosto cojo tres semanas de vacaciones.' },
            { de: 'die Bewerbung, -en', es: 'la candidatura', ex: 'Die Bewerbung muss bis Freitag ankommen.', exEs: 'La candidatura tiene que llegar antes del viernes.' },
            { de: 'das Vorstellungsgespräch', es: 'la entrevista de trabajo', ex: 'Morgen habe ich ein Vorstellungsgespräch.', exEs: 'Mañana tengo una entrevista de trabajo.' }
          ]
        },
        {
          thema: 'Arbeit und Kolleginnen / Kollegen',
          items: [
            { de: 'der Kollege / die Kollegin', es: 'el compañero / la compañera', ex: 'Mein Kollege hilft mir, wenn ich nicht weiterkomme.', exEs: 'Mi compañero me ayuda cuando me atasco.' },
            { de: 'zusammenarbeiten', es: 'trabajar juntos', ex: 'Wir arbeiten seit drei Jahren zusammen.', exEs: 'Llevamos tres años trabajando juntos.' },
            { de: 'sich vorstellen', es: 'presentarse', ex: 'Darf ich mich kurz vorstellen?', exEs: '¿Me presento brevemente?' },
            { de: 'sich kennenlernen', es: 'conocerse', ex: 'Beim Mittagessen haben wir uns besser kennengelernt.', exEs: 'En la comida nos conocimos mejor.' },
            { de: 'freundlich', es: 'amable', ex: 'Die Kolleginnen waren vom ersten Tag an freundlich.', exEs: 'Las compañeras fueron amables desde el primer día.' },
            { de: 'hilfsbereit', es: 'servicial', ex: 'Wenn du etwas brauchst, frag ihn: er ist sehr hilfsbereit.', exEs: 'Si necesitas algo, pregúntale: es muy servicial.' },
            { de: 'zuverlässig', es: 'fiable', ex: 'Auf sie ist Verlass, sie ist sehr zuverlässig.', exEs: 'Se puede contar con ella, es muy fiable.' },
            { de: 'pünktlich', es: 'puntual', ex: 'In Österreich ist man lieber zu pünktlich als zu spät.', exEs: 'En Austria es mejor pasarse de puntual que llegar tarde.' },
            { de: 'geduldig', es: 'paciente', ex: 'Mit Anfängern ist er sehr geduldig.', exEs: 'Con los principiantes es muy paciente.' },
            { de: 'die Einschulung (AT)', es: 'la formación inicial en el puesto', ex: 'Die Einschulung hat zwei Wochen gedauert.', exEs: 'La formación inicial duró dos semanas.' },
            { de: 'erklären', es: 'explicar', ex: 'Kannst du mir das noch einmal erklären?', exEs: '¿Me lo puedes explicar otra vez?' },
            { de: 'nachfragen', es: 'preguntar (para aclarar)', ex: 'Wenn etwas unklar ist, frag einfach nach.', exEs: 'Si algo no queda claro, pregunta sin más.' },
            { de: 'einen Fehler machen', es: 'cometer un error', ex: 'Am Anfang macht jeder Fehler.', exEs: 'Al principio todo el mundo comete errores.' },
            { de: 'Bescheid sagen', es: 'avisar', ex: 'Sag mir Bescheid, wenn du fertig bist.', exEs: 'Avísame cuando termines.' }
          ]
        },
        {
          thema: 'Der Arbeitsalltag',
          items: [
            { de: 'die Einarbeitung', es: 'la formación inicial', ex: 'Die Einarbeitung dauert zwei Wochen.', exEs: 'La formación inicial dura dos semanas.' },
            { de: 'der Arbeitsvertrag', es: 'el contrato de trabajo', ex: 'Den Arbeitsvertrag habe ich gestern unterschrieben.', exEs: 'El contrato lo firmé ayer.' },
            { de: 'die Probezeit', es: 'el periodo de prueba', ex: 'Die Probezeit sind drei Monate.', exEs: 'El periodo de prueba son tres meses.' },
            { de: 'der Lohn / das Gehalt', es: 'el sueldo', ex: 'Das Gehalt kommt am Monatsende.', exEs: 'El sueldo llega a final de mes.' },
            { de: 'die Überstunde', es: 'la hora extra', ex: 'Diese Woche hatte ich fünf Überstunden.', exEs: 'Esta semana he hecho cinco horas extra.' },
            { de: 'der Urlaubstag', es: 'el día de vacaciones', ex: 'Mir bleiben noch acht Urlaubstage.', exEs: 'Me quedan ocho días de vacaciones.' },
            { de: 'die Schicht', es: 'el turno', ex: 'Nächste Woche habe ich Frühschicht.', exEs: 'La semana que viene tengo turno de mañana.' },
            { de: 'der Betriebsrat', es: 'el comité de empresa', ex: 'Bei Problemen hilft der Betriebsrat.', exEs: 'Si hay problemas ayuda el comité de empresa.' },
            { de: 'sich bewerben', es: 'presentar una candidatura', ex: 'Ich habe mich bei drei Firmen beworben.', exEs: 'Me he presentado a tres empresas.' },
            { de: 'die Kündigung', es: 'el despido / la baja voluntaria', ex: 'Die Kündigung muss schriftlich sein.', exEs: 'El aviso tiene que ser por escrito.' }
          ]
        },
        {
          thema: 'Arbeitswelt',
          items: [
            { de: 'der Vorgesetzte', es: 'el superior', ex: 'Mein Vorgesetzter ist sehr fair.', exEs: 'Mi superior es muy justo.' },
            { de: 'die Personalabteilung', es: 'el departamento de personal', ex: 'Die Personalabteilung meldet sich morgen.', exEs: 'El departamento de personal se pone en contacto mañana.' },
            { de: 'die Zusammenarbeit', es: 'la colaboración', ex: 'Die Zusammenarbeit läuft sehr gut.', exEs: 'La colaboración funciona muy bien.' },
            { de: 'der Zeitdruck', es: 'la presión de tiempo', ex: 'Unter Zeitdruck mache ich mehr Fehler.', exEs: 'Bajo presión de tiempo cometo más errores.' },
            { de: 'die Erfahrung', es: 'la experiencia', ex: 'Er hat viel Erfahrung in der Branche.', exEs: 'Tiene mucha experiencia en el sector.' },
            { de: 'die Branche', es: 'el sector', ex: 'In dieser Branche verdient man gut.', exEs: 'En este sector se gana bien.' },
            { de: 'die Fortbildung', es: 'la formación continua', ex: 'Die Firma zahlt die Fortbildung.', exEs: 'La empresa paga la formación continua.' },
            { de: 'der Lebenslauf', es: 'el currículum', ex: 'Der Lebenslauf muss aktuell sein.', exEs: 'El currículum tiene que estar actualizado.' },
            { de: 'das Zeugnis', es: 'el certificado, las notas', ex: 'Mein letztes Zeugnis war sehr gut.', exEs: 'Mi último certificado era muy bueno.' },
            { de: 'das Anschreiben', es: 'la carta de presentación', ex: 'Das Anschreiben ist wichtiger als der Lebenslauf.', exEs: 'La carta de presentación importa más que el currículum.' },
            { de: 'einstellen', es: 'contratar', ex: 'Die Firma stellt zehn Leute ein.', exEs: 'La empresa contrata a diez personas.' },
            { de: 'kündigen', es: 'dimitir, despedir', ex: 'Ich habe zum Monatsende gekündigt.', exEs: 'He dimitido a final de mes.' },
            { de: 'befördern', es: 'ascender', ex: 'Sie wurde zur Abteilungsleiterin befördert.', exEs: 'La ascendieron a jefa de departamento.' },
            { de: 'das Protokoll', es: 'el acta', ex: 'Wer schreibt heute das Protokoll?', exEs: '¿Quién escribe hoy el acta?' },
            { de: 'der Abgabetermin', es: 'la fecha de entrega', ex: 'Der Abgabetermin ist am Freitag.', exEs: 'La fecha de entrega es el viernes.' },
            { de: 'sich einarbeiten', es: 'familiarizarse con el trabajo', ex: 'Ich arbeite mich gerade ein.', exEs: 'Me estoy familiarizando con el trabajo.' },
            { de: 'der Ansprechpartner', es: 'la persona de contacto', ex: 'Wer ist mein Ansprechpartner im Haus?', exEs: '¿Quién es mi persona de contacto en la casa?' },
            { de: 'die Sicherheit', es: 'la seguridad', ex: 'Die Sicherheit geht immer vor.', exEs: 'La seguridad siempre es lo primero.' },
            { de: 'die Vorschrift', es: 'la normativa', ex: 'Die Vorschrift hängt an der Wand.', exEs: 'La normativa está colgada en la pared.' },
            { de: 'das Feedback', es: 'el feedback', ex: 'Ich hätte gern ehrliches Feedback.', exEs: 'Me gustaría un feedback sincero.' },
            { de: 'der Kunde', es: 'el cliente', ex: 'Der Kunde ruft fast jeden Tag an.', exEs: 'El cliente llama casi todos los días.' }
          ]
        },
        {
          thema: 'Arbeitsalltag & Karriere',
          items: [
            { de: 'die Beförderung', es: 'el ascenso', ex: 'Über die Beförderung freue ich mich sehr.', exEs: 'El ascenso me alegra mucho.' },
            { de: 'die Einstellung', es: 'la contratación', ex: 'Die Einstellung erfolgt zum ersten März.', exEs: 'La contratación es a partir del uno de marzo.' },
            { de: 'der Arbeitgeber', es: 'el empleador', ex: 'Mein Arbeitgeber zahlt die Fortbildung.', exEs: 'Mi empleador paga la formación.' },
            { de: 'der Arbeitnehmer', es: 'el trabajador', ex: 'Jeder Arbeitnehmer hat Anspruch auf Urlaub.', exEs: 'Todo trabajador tiene derecho a vacaciones.' },
            { de: 'die Gewerkschaft', es: 'el sindicato', ex: 'Die Gewerkschaft verhandelt jedes Jahr die Löhne.', exEs: 'El sindicato negocia los salarios cada año.' },
            { de: 'die Lohnerhöhung', es: 'la subida de sueldo', ex: 'Die Lohnerhöhung kommt im Jänner.', exEs: 'La subida de sueldo llega en enero.' },
            { de: 'die Gleitzeit', es: 'el horario flexible', ex: 'Mit Gleitzeit kann ich um sieben anfangen.', exEs: 'Con horario flexible puedo empezar a las siete.' },
            { de: 'das Homeoffice', es: 'el teletrabajo', ex: 'Zwei Tage Homeoffice sind bei uns erlaubt.', exEs: 'En mi trabajo se permiten dos días de teletrabajo.' },
            { de: 'die Dienstreise', es: 'el viaje de trabajo', ex: 'Die Dienstreise dauert drei Tage.', exEs: 'El viaje de trabajo dura tres días.' },
            { de: 'die Präsentation', es: 'la presentación', ex: 'Die Präsentation dauert zwanzig Minuten.', exEs: 'La presentación dura veinte minutos.' },
            { de: 'das Projekt', es: 'el proyecto', ex: 'Das Projekt läuft noch bis Dezember.', exEs: 'El proyecto dura hasta diciembre.' },
            { de: 'die Absprache', es: 'el acuerdo verbal', ex: 'Ohne Absprache mache ich das nicht.', exEs: 'Sin haberlo acordado no lo hago.' },
            { de: 'der Konflikt', es: 'el conflicto', ex: 'Der Konflikt wurde zum Glück schnell gelöst.', exEs: 'El conflicto se resolvió rápido, por suerte.' },
            { de: 'das Betriebsklima', es: 'el ambiente laboral', ex: 'Das Betriebsklima ist hier sehr gut.', exEs: 'Aquí el ambiente laboral es muy bueno.' },
            { de: 'die Qualifikation', es: 'la cualificación', ex: 'Für die Stelle fehlt mir eine Qualifikation.', exEs: 'Para el puesto me falta una cualificación.' },
            { de: 'der Praktikant', es: 'el becario', ex: 'Der Praktikant bleibt bis September.', exEs: 'El becario se queda hasta septiembre.' },
            { de: 'flexibel', es: 'flexible', ex: 'Man muss in diesem Job flexibel sein.', exEs: 'En este trabajo hay que ser flexible.' },
            { de: 'motiviert', es: 'motivado', ex: 'Das ganze Team ist sehr motiviert.', exEs: 'Todo el equipo está muy motivado.' },
            { de: 'der Druck', es: 'la presión', ex: 'Der Druck ist am Monatsende sehr hoch.', exEs: 'La presión a final de mes es muy alta.' },
            { de: 'die Zuständigkeit', es: 'la competencia, el ámbito', ex: 'Das fällt nicht in meine Zuständigkeit.', exEs: 'Eso no entra en mi ámbito.' }
          ]
        },
        {
          thema: 'Bewerbung & Vertrag',
          items: [
            { de: 'die Stellenanzeige', es: 'la oferta de empleo', ex: 'Die Stellenanzeige stand in der Zeitung.', exEs: 'La oferta de empleo salió en el periódico.' },
            { de: 'die Referenz', es: 'la referencia', ex: 'Als Referenz nenne ich meinen alten Chef.', exEs: 'Como referencia doy a mi antiguo jefe.' },
            { de: 'der Arbeitsmarkt', es: 'el mercado laboral', ex: 'Der Arbeitsmarkt ist im Moment sehr gut.', exEs: 'El mercado laboral está ahora muy bien.' },
            { de: 'die Karriere', es: 'la carrera profesional', ex: 'Die Karriere war mir nie das Wichtigste.', exEs: 'La carrera nunca fue para mí lo más importante.' },
            { de: 'die Position', es: 'el puesto', ex: 'Diese Position ist neu geschaffen worden.', exEs: 'Este puesto se ha creado nuevo.' },
            { de: 'der Nachfolger', es: 'el sucesor', ex: 'Mein Nachfolger fängt im Mai an.', exEs: 'Mi sucesor empieza en mayo.' },
            { de: 'die Vereinbarung', es: 'el acuerdo', ex: 'Die Vereinbarung steht schriftlich im Vertrag.', exEs: 'El acuerdo está por escrito en el contrato.' },
            { de: 'die Verhandlung', es: 'la negociación', ex: 'Die Verhandlung dauerte fast drei Stunden.', exEs: 'La negociación duró casi tres horas.' },
            { de: 'der Kompromiss', es: 'el compromiso', ex: 'Am Ende fanden wir einen guten Kompromiss.', exEs: 'Al final encontramos un buen compromiso.' },
            { de: 'die Kritik', es: 'la crítica', ex: 'Kritik nehme ich mir immer zu Herzen.', exEs: 'La crítica me la tomo siempre a pecho.' },
            { de: 'der Misserfolg', es: 'el fracaso', ex: 'Aus einem Misserfolg lernt man mehr.', exEs: 'De un fracaso se aprende más.' },
            { de: 'die Belastung', es: 'la carga', ex: 'Die Belastung war zuletzt wirklich hoch.', exEs: 'La carga ha sido últimamente muy alta.' },
            { de: 'die Auszeit', es: 'el paréntesis, el descanso', ex: 'Ich brauche dringend eine kurze Auszeit.', exEs: 'Necesito urgentemente un pequeño paréntesis.' },
            { de: 'der Urlaubsantrag', es: 'la solicitud de vacaciones', ex: 'Den Urlaubsantrag gebe ich heute ab.', exEs: 'La solicitud de vacaciones la entrego hoy.' },
            { de: 'das Arbeitszeugnis', es: 'el certificado laboral', ex: 'Das Arbeitszeugnis war zum Glück sehr gut.', exEs: 'Por suerte el certificado laboral era muy bueno.' },
            { de: 'die Kündigungsfrist', es: 'el plazo de preaviso', ex: 'Meine Kündigungsfrist beträgt zwei Monate.', exEs: 'Mi plazo de preaviso es de dos meses.' },
            { de: 'das Netzwerk', es: 'la red de contactos', ex: 'Ohne Netzwerk findet man schwer eine Stelle.', exEs: 'Sin red de contactos cuesta encontrar puesto.' },
            { de: 'die Fachkraft', es: 'el personal cualificado', ex: 'Als Fachkraft findest du hier schnell Arbeit.', exEs: 'Como personal cualificado encuentras trabajo rápido.' },
            { de: 'die Schichtarbeit', es: 'el trabajo por turnos', ex: 'Schichtarbeit ist wirklich nichts für mich.', exEs: 'El trabajo por turnos no es para mí.' },
            { de: 'befristet', es: 'temporal', ex: 'Der Vertrag ist auf ein Jahr befristet.', exEs: 'El contrato es temporal, de un año.' }
          ]
        },
        {
          thema: 'Im Büroalltag',
          items: [
            { de: 'die Kaffeeküche', es: 'la office, la cocina de la oficina', ex: 'In der Kaffeeküche trifft man immer jemanden.', exEs: 'En la office siempre te encuentras a alguien.' },
            { de: 'der Spind', es: 'la taquilla', ex: 'Die Jacke kannst du in den Spind hängen.', exEs: 'La chaqueta la puedes colgar en la taquilla.' },
            { de: 'die Zeiterfassung', es: 'el control horario', ex: 'Die Zeiterfassung läuft hier über eine App.', exEs: 'El control horario aquí va por una app.' },
            { de: 'die Schlüsselkarte', es: 'la tarjeta de acceso', ex: 'Ohne Schlüsselkarte kommst du nicht ins Gebäude.', exEs: 'Sin tarjeta de acceso no entras al edificio.' },
            { de: 'das Namensschild', es: 'la tarjeta identificativa', ex: 'Am ersten Tag bekommst du ein Namensschild.', exEs: 'El primer día te dan una tarjeta identificativa.' },
            { de: 'der Empfang', es: 'la recepción', ex: 'Melde dich bitte zuerst am Empfang.', exEs: 'Preséntate primero en recepción.' },
            { de: 'die Rundmail', es: 'el correo general', ex: 'Die Rundmail geht an die ganze Abteilung.', exEs: 'El correo general va a todo el departamento.' },
            { de: 'der Kalendereintrag', es: 'la entrada del calendario', ex: 'Ich schicke dir einen Kalendereintrag für Dienstag.', exEs: 'Te mando una entrada de calendario para el martes.' },
            { de: 'die Telefonliste', es: 'la lista de teléfonos', ex: 'Die Nummern stehen alle auf der Telefonliste.', exEs: 'Todos los números están en la lista de teléfonos.' },
            { de: 'der Notizblock', es: 'el bloc de notas', ex: 'Nimm zur Besprechung einen Notizblock mit.', exEs: 'Llévate un bloc de notas a la reunión.' }
          ]
        },
        {
          thema: 'Mit Kollegen reden',
          items: [
            { de: 'sich duzen', es: 'tutearse', ex: 'Bei uns duzen sich alle, auch der Chef.', exEs: 'Aquí nos tuteamos todos, también el jefe.' },
            { de: 'sich siezen', es: 'tratarse de usted', ex: 'In der Kanzlei siezt man sich noch.', exEs: 'En el despacho todavía se tratan de usted.' },
            { de: 'Smalltalk machen', es: 'charlar de cosas sin importancia', ex: 'Vor der Besprechung macht man kurz Smalltalk.', exEs: 'Antes de la reunión se charla un poco.' },
            { de: 'sich austauschen', es: 'intercambiar impresiones', ex: 'Wir tauschen uns einmal pro Woche aus.', exEs: 'Intercambiamos impresiones una vez por semana.' },
            { de: 'jemanden einarbeiten', es: 'formar a alguien', ex: 'Die erste Woche arbeitet dich eine Kollegin ein.', exEs: 'La primera semana te forma una compañera.' },
            { de: 'sich einigen', es: 'ponerse de acuerdo', ex: 'Am Ende haben wir uns schnell geeinigt.', exEs: 'Al final nos pusimos de acuerdo rápido.' },
            { de: 'loben', es: 'elogiar, felicitar', ex: 'Der Chef hat das ganze Team gelobt.', exEs: 'El jefe felicitó a todo el equipo.' },
            { de: 'widersprechen', es: 'llevar la contraria', ex: 'Ich habe ihm höflich widersprochen.', exEs: 'Le llevé la contraria con educación.' },
            { de: 'zugeben', es: 'admitir, reconocer', ex: 'Ich gebe zu, das war mein Fehler.', exEs: 'Lo admito, fue error mío.' }
          ]
        }
      ],
      pitfalls: [
        '"seit" es DESDE HACE (algo que sigue) y va con dativo: "seit einem Monat". No lo traduzcas por "hace" (eso es "vor": "vor einem Monat" = hace un mes, ya terminado).',
        '"für" habla de la duración prevista y va con ACUSATIVO: "für ein Jahr".',
        '"wenn" manda el verbo al final. Si la frase con wenn va primera, la principal invierte: "Wenn ich Zeit habe, HELFE ICH dir."'
      ],
      grammatik: [
        {
          regel: 'temporale Präpositionen für, über + Akkusativ',
          key: 'praep-fuer-ueber',
          erklaerung: '"für" = duración prevista, "über" = a lo largo de. Ambas con acusativo.',
          detail:
            '"für + Akkusativ" indica el tiempo que algo va a durar, visto desde fuera: "Ich bin für ein Jahr in Wien" (mi estancia dura un año). Muy típico con contratos y estancias.\n\n"über + Akkusativ" indica que algo ocurre a lo largo de todo un periodo: "über das ganze Wochenende", "über die Feiertage", "übers Jahr".\n\nNo confundas "für" (duración futura o prevista) con "seit" (duración que ya lleva pasando). "Ich arbeite für ein Jahr hier" = mi contrato es de un año. "Ich arbeite seit einem Jahr hier" = llevo un año trabajando aquí.',
          tabelle: {
            title: 'Acusativo temporal',
            headers: ['Preposición', 'Significado', 'Ejemplo'],
            rows: [
              ['für', 'durante (previsto)', 'Ich bleibe für zwei Wochen.'],
              ['über', 'a lo largo de', 'Über das Wochenende arbeite ich nicht.'],
              ['um', 'a las (hora)', 'Die Besprechung ist um 10 Uhr.']
            ]
          },
          beispiele: [
            { de: 'Ich bin für ein Jahr in dieser Abteilung.', es: 'Estoy un año en este departamento.' },
            { de: 'Über die Feiertage ist das Büro geschlossen.', es: 'Durante las fiestas la oficina está cerrada.' },
            { de: 'Der Vertrag gilt für sechs Monate.', es: 'El contrato es válido por seis meses.' }
          ]
        },
        {
          regel: 'temporale Präpositionen seit, ab, zwischen + Dativ',
          key: 'praep-seit-ab-zwischen',
          erklaerung: 'seit = desde (y sigue), ab = a partir de (futuro), zwischen = entre. Las tres con dativo.',
          detail:
            '"seit + Dativ" marca el comienzo de algo que TODAVÍA dura. En alemán se usa presente, no pasado: "Ich arbeite seit einem Monat hier" = llevo un mes trabajando aquí. Este es un choque directo con el español, que diría "llevo trabajando" o "trabajo desde hace".\n\n"ab + Dativ" mira al futuro: a partir de ese momento. "Ab nächster Woche habe ich einen neuen Vertrag."\n\n"zwischen + Dativ" señala un intervalo entre dos puntos: "zwischen 12 und 13 Uhr".\n\nCuidado con "vor + Dativ", que significa "hace" y se refiere a algo terminado: "vor einem Jahr" = hace un año.',
          tabelle: {
            title: 'Dativo temporal',
            headers: ['Preposición', 'Significado', 'Ejemplo', 'Tiempo verbal'],
            rows: [
              ['seit', 'desde hace (sigue)', 'seit einem Monat', 'presente'],
              ['ab', 'a partir de', 'ab Montag', 'presente/futuro'],
              ['zwischen', 'entre', 'zwischen 12 und 13 Uhr', '—'],
              ['vor', 'hace (terminado)', 'vor einem Jahr', 'pasado'],
              ['nach', 'después de', 'nach der Arbeit', '—']
            ]
          },
          beispiele: [
            { de: 'Ich arbeite seit einem Monat in dieser Firma.', es: 'Trabajo en esta empresa desde hace un mes.' },
            { de: 'Ab nächster Woche habe ich einen neuen Vertrag.', es: 'A partir de la semana que viene tengo un contrato nuevo.' },
            { de: 'Die Pause ist zwischen 12 und 13 Uhr.', es: 'La pausa es entre las 12 y las 13.' },
            { de: 'Vor einem Jahr habe ich noch in Polen gearbeitet.', es: 'Hace un año todavía trabajaba en Polonia.' }
          ]
        },
        {
          regel: 'Wiederholung: vor, nach, von … bis',
          key: 'praep-vor-nach',
          erklaerung: 'vor / nach + Dativ (antes / después de), von … bis (de … a).',
          detail:
            '"vor + Dativ" y "nach + Dativ" ordenan dos hechos en el tiempo: "vor der Besprechung", "nach der Arbeit". Recuerda el artículo en dativo: vor DEM Kurs, nach DER Arbeit.\n\n"von … bis" delimita un tramo: "von Montag bis Freitag", "von 8 bis 16 Uhr". Con días y horas no se pone artículo. Si necesitas artículo, "bis" se combina con "zu": "bis zum 15. Mai".',
          tabelle: {
            title: 'Ordenar el tiempo',
            headers: ['Estructura', 'Ejemplo', 'Español'],
            rows: [
              ['vor + Dativ', 'vor der Besprechung', 'antes de la reunión'],
              ['nach + Dativ', 'nach der Arbeit', 'después del trabajo'],
              ['von … bis', 'von 8 bis 16 Uhr', 'de 8 a 16'],
              ['bis zu + Dativ', 'bis zum Wochenende', 'hasta el fin de semana']
            ]
          },
          beispiele: [
            { de: 'Nach der Besprechung rufe ich dich an.', es: 'Después de la reunión te llamo.' },
            { de: 'Ich arbeite von Montag bis Freitag.', es: 'Trabajo de lunes a viernes.' },
            { de: 'Vor dem Vorstellungsgespräch war ich sehr nervös.', es: 'Antes de la entrevista estaba muy nervioso.' }
          ]
        },
        {
          regel: 'Konjunktion wenn',
          key: 'konjunktion-wenn',
          erklaerung: '"wenn" = cuando (repetido o futuro) / si (condición). Manda el verbo al final.',
          detail:
            '"wenn" es subordinante, así que el verbo conjugado va al final: "Ruf mich an, wenn du Fragen HAST."\n\nTiene dos valores. Temporal repetido o futuro: "Immer wenn es regnet, nehme ich den Bus." Condicional: "Wenn du willst, helfe ich dir."\n\nSi la subordinada va delante, ocupa la posición 1 y la principal invierte: "Wenn ich Zeit habe, HELFE ICH dir." Un fallo típico es escribir "…, ich helfe dir".\n\nNo lo confundas con "als" (cuando, para UN momento del pasado: "Als ich klein war…") ni con "wann" (solo en preguntas: "Wann kommst du?").',
          tabelle: {
            title: 'wenn / als / wann',
            headers: ['Palabra', 'Uso', 'Ejemplo'],
            rows: [
              ['wenn', 'cuando (repetido / futuro), si', 'Wenn ich Zeit habe, komme ich.'],
              ['als', 'cuando (un momento del pasado)', 'Als ich in Wien ankam, regnete es.'],
              ['wann', 'solo en preguntas', 'Wann fängt die Besprechung an?']
            ]
          },
          beispiele: [
            { de: 'Ruf mich an, wenn du Fragen hast.', es: 'Llámame si tienes preguntas.' },
            { de: 'Wenn ich Zeit habe, helfe ich dir gern.', es: 'Cuando tengo tiempo, te ayudo con gusto.' },
            { de: 'Immer wenn es regnet, nehme ich den Bus.', es: 'Siempre que llueve cojo el autobús.' },
            { de: 'Sag mir Bescheid, wenn du fertig bist.', es: 'Avísame cuando hayas terminado.' }
          ]
        },
        {
          key: 'nebensatz-damit',
          regel: 'damit: der Zweck mit zwei Subjekten',
          erklaerung: 'damit dice para qué, igual que um … zu, pero se usa cuando el sujeto CAMBIA: Ich erkläre es dir, DAMIT DU es verstehst. Si el sujeto es el mismo en las dos partes, se prefiere um … zu.',
          beispiele: [
            { de: 'Ich erkläre es noch einmal, damit alle es verstehen.', es: 'Lo explico otra vez para que todos lo entiendan.' },
            { de: 'Sie schreibt ein Protokoll, damit nichts vergessen wird.', es: 'Escribe un acta para que no se olvide nada.' }
          ]
        },
        {
          key: 'hoefliche-frage-am-arbeitsplatz',
          regel: 'Höflich im Büro: Konjunktiv II',
          erklaerung: 'En el trabajo casi todo se pide en Konjunktiv II: Könnten Sie…? Dürfte ich…? Ich hätte eine Frage. Ich würde vorschlagen… Suena a colaboración y no a orden.',
          beispiele: [
            { de: 'Ich hätte eine kurze Frage zum Vertrag.', es: 'Tendría una pregunta rápida sobre el contrato.' },
            { de: 'Dürfte ich kurz stören?', es: '¿Le podría molestar un momento?' }
          ]
        },
        {
          key: 'genitiv-mit-des-der',
          regel: 'Genitiv: des Chefs, der Firma',
          erklaerung: 'El genitivo dice de quién es algo y se usa sobre todo por escrito: der Vertrag DES CHEFS, die Adresse DER FIRMA. Masculino y neutro: des + -s al nombre. Femenino y plural: der.',
          beispiele: [
            { de: 'Das ist das Büro des Chefs.', es: 'Esta es la oficina del jefe.' },
            { de: 'Die Adresse der Firma steht unten.', es: 'La dirección de la empresa está abajo.' }
          ]
        },
        {
          key: 'passiv-praesens',
          regel: 'Passiv: werden + Partizip II',
          erklaerung: 'El pasivo dice lo que SE HACE, sin decir quién: werden conjugado + participio al final. Die Unterlagen WERDEN geprüft. Es muy normal en avisos y normas de trabajo.',
          beispiele: [
            { de: 'Die Unterlagen werden heute geprüft.', es: 'La documentación se revisa hoy.' },
            { de: 'Das Büro wird um achtzehn Uhr geschlossen.', es: 'La oficina se cierra a las seis.' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'sich und neue Kollegen formell vorstellen',
          es: 'Presentarse y presentar a nuevos compañeros formalmente',
          wendungen: [
            { de: 'Darf ich mich vorstellen? Mein Name ist …', es: '¿Me permite presentarme? Mi nombre es …' }
          ]
        },
        {
          funktion: 'Zuständigkeiten und Positionen im Betrieb klären',
          es: 'Aclarar competencias y puestos en la empresa',
          wendungen: [
            { de: 'Heute ist mein erster Arbeitstag hier.', es: 'Hoy es mi primer día de trabajo aquí.' }
          ]
        },
        {
          funktion: 'etwas nicht verstehen und nachfragen',
          es: 'No entender algo y pedir aclaraciones',
          wendungen: [
            { de: 'Entschuldigung, da bin ich nicht mitgekommen.', es: 'Perdone, ahí me he perdido.' }
          ]
        },
        {
          funktion: 'Arbeitsanweisungen und Details absichern',
          es: 'Confirmar instrucciones de trabajo y detalles',
          wendungen: [
            { de: 'Darf ich noch einmal nachfragen?', es: '¿Puedo preguntar otra vez?' }
          ]
        },
        {
          funktion: 'über Aufgaben und Arbeitsabläufe sprechen',
          es: 'Hablar de tareas y procesos de trabajo',
          wendungen: [
            { de: 'Wie läuft das hier normalerweise ab?', es: '¿Cómo funciona esto normalmente aquí?' }
          ]
        },
        {
          funktion: 'im Vorstellungsgespräch Auskunft geben',
          es: 'Dar información en la entrevista de trabajo',
          wendungen: [
            { de: 'Ich möchte mich auf die Stelle bewerben.', es: 'Quiero presentar mi candidatura para el puesto.' }
          ]
        },
        {
          funktion: 'Anforderungen und Arbeitsbedingungen erfragen',
          es: 'Preguntar por requisitos y condiciones',
          wendungen: [
            { de: 'Welche Qualifikationen erwarten Sie?', es: '¿Qué cualificaciones esperan?' }
          ]
        },
        {
          funktion: 'Probleme am Arbeitsplatz ansprechen',
          es: 'Plantear problemas y desacuerdos laborales',
          wendungen: [
            { de: 'Können wir kurz unter vier Augen sprechen?', es: '¿Podemos hablar un momento a solas?' }
          ]
        }
      ]
    },

    // ==================== LEKTION 5 ====================
    {
      id: 'a21-l5',
      legacyId: 'l5',
      nr: 5,
      name: 'In der Schule',
      woerter: [
        {
          thema: 'Schulfächer',
          items: [
            { de: 'Mathematik / Mathe', es: 'matemáticas', ex: 'In Mathe war ich nie besonders gut.', exEs: 'En matemáticas nunca fui muy bueno.' },
            { de: 'Deutsch', es: 'alemán', ex: 'Deutsch haben wir viermal die Woche.', exEs: 'Alemán lo tenemos cuatro veces por semana.' },
            { de: 'Englisch', es: 'inglés', ex: 'Englisch lernt man hier ab der Volksschule.', exEs: 'Aquí se aprende inglés desde primaria.' },
            { de: 'Geschichte', es: 'historia', ex: 'In Geschichte haben wir über Wien 1900 geredet.', exEs: 'En historia hablamos de la Viena de 1900.' },
            { de: 'Geografie', es: 'geografía', ex: 'Geografie mochte ich wegen der Karten.', exEs: 'Geografía me gustaba por los mapas.' },
            { de: 'Biologie', es: 'biología', ex: 'In Biologie haben wir Pflanzen gesammelt.', exEs: 'En biología recogíamos plantas.' },
            { de: 'Chemie', es: 'química', ex: 'Chemie war mein schwierigstes Fach.', exEs: 'Química era mi asignatura más difícil.' },
            { de: 'Physik', es: 'física', ex: 'Physik verstehe ich erst, wenn ich es rechne.', exEs: 'La física no la entiendo hasta que la calculo.' },
            { de: 'Turnen (AT) / Sport', es: 'educación física', ex: 'Turnen hatten wir immer am Freitag.', exEs: 'Educación física la teníamos siempre el viernes.' },
            { de: 'Musik', es: 'música', ex: 'In Musik haben wir Flöte gespielt.', exEs: 'En música tocábamos la flauta.' },
            { de: 'Zeichnen', es: 'dibujo', ex: 'Im Zeichnen war ich besser als in Mathe.', exEs: 'En dibujo era mejor que en matemáticas.' },
            { de: 'Werken', es: 'trabajos manuales', ex: 'Beim Werken haben wir ein Regal gebaut.', exEs: 'En trabajos manuales construimos una estantería.' }
          ]
        },
        {
          thema: 'Schularten',
          items: [
            { de: 'der Kindergarten', es: 'la guardería', ex: 'Mein Neffe geht seit September in den Kindergarten.', exEs: 'Mi sobrino va a la guardería desde septiembre.' },
            { de: 'die Volksschule (AT)', es: 'la escuela primaria', ex: 'Die Volksschule dauert in Österreich vier Jahre.', exEs: 'En Austria la primaria dura cuatro años.' },
            { de: 'die Mittelschule (AT)', es: 'la secundaria', ex: 'Nach der Volksschule kommt die Mittelschule.', exEs: 'Después de la primaria viene la secundaria.' },
            { de: 'das Gymnasium', es: 'el instituto', ex: 'Sie geht aufs Gymnasium und will studieren.', exEs: 'Va al instituto y quiere ir a la universidad.' },
            { de: 'die HTL (AT)', es: 'el instituto técnico', ex: 'Die HTL dauert fünf Jahre und ist sehr technisch.', exEs: 'El instituto técnico dura cinco años y es muy técnico.' },
            { de: 'die Berufsschule', es: 'la escuela de FP', ex: 'Einen Tag pro Woche ist er in der Berufsschule.', exEs: 'Un día por semana va a la escuela de FP.' },
            { de: 'die Lehre (AT)', es: 'la formación dual / el aprendizaje', ex: 'Er macht eine Lehre als Elektriker.', exEs: 'Está haciendo la formación dual de electricista.' },
            { de: 'die Universität / die Uni', es: 'la universidad', ex: 'An der Uni habe ich Geschichte studiert.', exEs: 'En la universidad estudié historia.' },
            { de: 'die Matura (AT)', es: 'la selectividad / bachillerato', ex: 'Nach der Matura ist sie ein Jahr gereist.', exEs: 'Después del bachillerato estuvo un año viajando.' }
          ]
        },
        {
          thema: 'in der Schule',
          items: [
            { de: 'die Klasse, -n', es: 'la clase (grupo)', ex: 'In meiner Klasse waren wir achtundzwanzig.', exEs: 'En mi clase éramos veintiocho.' },
            { de: 'der Unterricht', es: 'las clases', ex: 'Der Unterricht fängt um acht an.', exEs: 'Las clases empiezan a las ocho.' },
            { de: 'die Stunde, -n', es: 'la hora de clase', ex: 'Die erste Stunde am Montag ist Deutsch.', exEs: 'La primera hora del lunes es alemán.' },
            { de: 'die Note, -n', es: 'la nota', ex: 'Für die Prüfung habe ich eine gute Note bekommen.', exEs: 'En el examen saqué buena nota.' },
            { de: 'das Zeugnis, -se', es: 'el boletín de notas', ex: 'Das Zeugnis gibt es am letzten Schultag.', exEs: 'El boletín lo dan el último día de clase.' },
            { de: 'die Prüfung, -en', es: 'el examen', ex: 'Die Prüfung war leichter als gedacht.', exEs: 'El examen fue más fácil de lo que pensaba.' },
            { de: 'der Test, -s', es: 'la prueba', ex: 'Am Dienstag schreiben wir einen kleinen Test.', exEs: 'El martes hacemos una prueba corta.' },
            { de: 'die Hausübung (AT)', es: 'los deberes', ex: 'Die Hausübung mache ich immer abends.', exEs: 'Los deberes los hago siempre por la noche.' },
            { de: 'der Schüler / die Schülerin', es: 'el alumno / la alumna', ex: 'Die Schüler sitzen zu zweit an einem Tisch.', exEs: 'Los alumnos se sientan de dos en dos.' },
            { de: 'der Lehrer / die Lehrerin', es: 'el profesor / la profesora', ex: 'Unsere Lehrerin spricht sehr langsam und deutlich.', exEs: 'Nuestra profesora habla muy despacio y claro.' },
            { de: 'der Direktor / die Direktorin', es: 'el director / la directora', ex: 'Der Direktor hat die Eltern begrüßt.', exEs: 'El director dio la bienvenida a los padres.' },
            { de: 'der Elternabend', es: 'la reunión de padres', ex: 'Der Elternabend ist am nächsten Donnerstag.', exEs: 'La reunión de padres es el jueves que viene.' },
            { de: 'das Schuljahr', es: 'el curso escolar', ex: 'Das Schuljahr beginnt in Wien Anfang September.', exEs: 'En Viena el curso empieza a principios de septiembre.' },
            { de: 'die Pause, -n', es: 'el recreo', ex: 'Machen wir kurz Pause?', exEs: '¿Hacemos una pausa?' },
            { de: 'sitzenbleiben', es: 'repetir curso', ex: 'Wenn du drei Fünfer hast, bleibst du sitzen.', exEs: 'Si tienes tres suspensos, repites curso.' },
            { de: 'bestehen', es: 'aprobar', ex: 'Ich habe die Prüfung knapp bestanden.', exEs: 'Aprobé el examen por poco.' },
            { de: 'durchfallen', es: 'suspender', ex: 'Beim ersten Mal bin ich durchgefallen.', exEs: 'La primera vez suspendí.' }
          ]
        },
        {
          thema: 'Schule und Eltern',
          items: [
            { de: 'das Zeugnis', es: 'las notas', ex: 'Das Zeugnis gibt es Ende Juni.', exEs: 'Las notas las dan a finales de junio.' },
            { de: 'die Note', es: 'la nota', ex: 'In Mathe hat er eine gute Note.', exEs: 'En mates tiene buena nota.' },
            { de: 'die Entschuldigung', es: 'el justificante', ex: 'Ohne Entschuldigung geht das nicht.', exEs: 'Sin justificante no vale.' },
            { de: 'die Klassenlehrerin', es: 'la tutora', ex: 'Die Klassenlehrerin hat angerufen.', exEs: 'La tutora ha llamado.' }
          ]
        },
        {
          thema: 'Schulalltag',
          items: [
            { de: 'der Stundenplan', es: 'el horario escolar', ex: 'Der Stundenplan hängt an der Tür.', exEs: 'El horario está colgado en la puerta.' },
            { de: 'das Fach', es: 'la asignatura', ex: 'Mein Lieblingsfach ist Geschichte.', exEs: 'Mi asignatura favorita es historia.' },
            { de: 'die Schultasche', es: 'la mochila escolar', ex: 'Die Schultasche ist viel zu schwer.', exEs: 'La mochila pesa demasiado.' },
            { de: 'das Schulbuch', es: 'el libro de texto', ex: 'Das Schulbuch für Mathe fehlt noch.', exEs: 'Falta todavía el libro de mates.' },
            { de: 'die Nachhilfe', es: 'las clases particulares', ex: 'Mein Sohn braucht Nachhilfe in Mathe.', exEs: 'Mi hijo necesita clases particulares de mates.' },
            { de: 'der Elternsprechtag', es: 'el día de tutorías', ex: 'Am Elternsprechtag rede ich mit der Lehrerin.', exEs: 'El día de tutorías hablo con la profesora.' },
            { de: 'fehlen', es: 'faltar', ex: 'Mein Sohn hat gestern gefehlt.', exEs: 'Mi hijo faltó ayer.' },
            { de: 'die Schularbeit', es: 'el examen de clase (AT)', ex: 'Morgen schreiben wir eine Schularbeit.', exEs: 'Mañana tenemos un examen de clase.' },
            { de: 'der Abschluss', es: 'el título, la titulación', ex: 'Ohne Abschluss ist es schwer.', exEs: 'Sin título es difícil.' },
            { de: 'die Bildung', es: 'la educación, la formación', ex: 'Bildung ist der beste Weg.', exEs: 'La educación es el mejor camino.' },
            { de: 'die Betreuung', es: 'el cuidado, la atención', ex: 'Die Betreuung am Nachmittag kostet extra.', exEs: 'La atención por la tarde se paga aparte.' },
            { de: 'der Schulweg', es: 'el camino al colegio', ex: 'Der Schulweg dauert zehn Minuten.', exEs: 'El camino al colegio dura diez minutos.' },
            { de: 'der Mitschüler', es: 'el compañero de clase', ex: 'Mein Mitschüler hilft mir bei Deutsch.', exEs: 'Mi compañero me ayuda con el alemán.' },
            { de: 'verbessern', es: 'mejorar', ex: 'Er hat seine Noten deutlich verbessert.', exEs: 'Ha mejorado bastante las notas.' },
            { de: 'sich konzentrieren', es: 'concentrarse', ex: 'In der Klasse kann er sich schlecht konzentrieren.', exEs: 'En clase le cuesta concentrarse.' },
            { de: 'begabt', es: 'dotado', ex: 'Sie ist sehr begabt in Musik.', exEs: 'Está muy dotada para la música.' },
            { de: 'faul', es: 'vago', ex: 'Er ist nicht dumm, nur faul.', exEs: 'No es tonto, solo vago.' },
            { de: 'fleißig', es: 'aplicado', ex: 'Meine Tochter ist sehr fleißig.', exEs: 'Mi hija es muy aplicada.' },
            { de: 'die Leistung', es: 'el rendimiento', ex: 'Die Leistung ist im letzten Jahr gestiegen.', exEs: 'El rendimiento ha subido el último año.' }
          ]
        },
        {
          thema: 'Lernen & Verhalten',
          items: [
            { de: 'die Schulpflicht', es: 'la escolarización obligatoria', ex: 'Die Schulpflicht dauert hier neun Jahre.', exEs: 'Aquí la escolarización obligatoria dura nueve años.' },
            { de: 'die Einschreibung', es: 'la matrícula', ex: 'Die Einschreibung ist immer im Februar.', exEs: 'La matrícula es siempre en febrero.' },
            { de: 'das Schulgeld', es: 'las tasas escolares', ex: 'An öffentlichen Schulen gibt es kein Schulgeld.', exEs: 'En los colegios públicos no hay tasas.' },
            { de: 'das Semester', es: 'el semestre', ex: 'Das Semester endet erst im Februar.', exEs: 'El semestre no termina hasta febrero.' },
            { de: 'der Aufsatz', es: 'la redacción', ex: 'Den Aufsatz schreiben wir am Freitag.', exEs: 'La redacción la escribimos el viernes.' },
            { de: 'das Diktat', es: 'el dictado', ex: 'Im Diktat hatte er nur zwei Fehler.', exEs: 'En el dictado tuvo solo dos errores.' },
            { de: 'das Rechnen', es: 'el cálculo', ex: 'Das Rechnen fällt ihm sehr leicht.', exEs: 'El cálculo se le da muy fácil.' },
            { de: 'das Lesen', es: 'la lectura', ex: 'Beim Lesen braucht sie noch Hilfe.', exEs: 'Con la lectura todavía necesita ayuda.' },
            { de: 'die Schrift', es: 'la letra, la escritura', ex: 'Deine Schrift kann wirklich niemand lesen.', exEs: 'Tu letra no la puede leer nadie.' },
            { de: 'die Konzentration', es: 'la concentración', ex: 'Am Nachmittag fehlt ihm die Konzentration.', exEs: 'Por la tarde le falta concentración.' },
            { de: 'das Verhalten', es: 'el comportamiento', ex: 'Sein Verhalten hat sich sehr gebessert.', exEs: 'Su comportamiento ha mejorado mucho.' },
            { de: 'loben', es: 'elogiar', ex: 'Die Lehrerin lobt ihn ziemlich oft.', exEs: 'La profesora lo elogia bastante a menudo.' },
            { de: 'schimpfen', es: 'regañar', ex: 'Zu Hause schimpft niemand mit ihm.', exEs: 'En casa nadie le regaña.' },
            { de: 'die Strafe', es: 'el castigo', ex: 'Eine Strafe hilft hier gar nichts.', exEs: 'Un castigo aquí no sirve de nada.' },
            { de: 'das Lob', es: 'el elogio', ex: 'Ein Lob wirkt besser als eine Strafe.', exEs: 'Un elogio funciona mejor que un castigo.' },
            { de: 'die Prüfungsangst', es: 'el miedo a los exámenes', ex: 'Viele Kinder haben starke Prüfungsangst.', exEs: 'Muchos niños tienen mucho miedo a los exámenes.' },
            { de: 'das Selbstvertrauen', es: 'la autoconfianza', ex: 'Ihm fehlt einfach das Selbstvertrauen.', exEs: 'Simplemente le falta autoconfianza.' },
            { de: 'die Klassenfahrt', es: 'el viaje de clase', ex: 'Die Klassenfahrt geht dieses Jahr nach Salzburg.', exEs: 'Este año el viaje de clase es a Salzburgo.' },
            { de: 'das Schulfest', es: 'la fiesta del colegio', ex: 'Beim Schulfest verkaufen die Eltern Kuchen.', exEs: 'En la fiesta del colegio los padres venden pasteles.' },
            { de: 'der Lernstoff', es: 'la materia', ex: 'Der Lernstoff für die Prüfung ist viel.', exEs: 'La materia para el examen es mucha.' }
          ]
        },
        {
          thema: 'Schulorganisation',
          items: [
            { de: 'der Schulanfang', es: 'el comienzo del curso', ex: 'Der Schulanfang ist Anfang September.', exEs: 'El curso empieza a principios de septiembre.' },
            { de: 'die Schultüte', es: 'el cucurucho escolar', ex: 'Zum Schulanfang gibt es eine Schultüte.', exEs: 'Al empezar el colegio se da un cucurucho con regalos.' },
            { de: 'das Mitteilungsheft', es: 'el cuaderno de comunicaciones', ex: 'Im Mitteilungsheft steht alles Wichtige.', exEs: 'En el cuaderno de comunicaciones está todo lo importante.' },
            { de: 'der Förderunterricht', es: 'las clases de apoyo', ex: 'Mein Sohn bekommt seit Herbst Förderunterricht.', exEs: 'Mi hijo recibe clases de apoyo desde otoño.' },
            { de: 'die Sprachförderung', es: 'el apoyo lingüístico', ex: 'Die Sprachförderung findet zweimal wöchentlich statt.', exEs: 'El apoyo lingüístico es dos veces por semana.' },
            { de: 'der Schulbus', es: 'el autobús escolar', ex: 'Der Schulbus fährt um sieben Uhr zwanzig.', exEs: 'El autobús escolar sale a las siete y veinte.' },
            { de: 'die Jause', es: 'la merienda', ex: 'Die Jause packe ich schon am Abend ein.', exEs: 'La merienda la preparo ya por la noche.' },
            { de: 'die Ganztagsschule', es: 'el colegio de jornada completa', ex: 'Die Ganztagsschule endet um sechzehn Uhr.', exEs: 'El colegio de jornada completa acaba a las cuatro.' },
            { de: 'die Schulordnung', es: 'el reglamento escolar', ex: 'Die Schulordnung hängt im Gang.', exEs: 'El reglamento está colgado en el pasillo.' },
            { de: 'das Klassenzimmer', es: 'el aula', ex: 'Das Klassenzimmer ist im zweiten Stock.', exEs: 'El aula está en el segundo piso.' },
            { de: 'der Pausenhof', es: 'el patio de recreo', ex: 'Im Pausenhof spielen fast alle Fußball.', exEs: 'En el patio casi todos juegan al fútbol.' },
            { de: 'das Pausenbrot', es: 'el bocadillo del recreo', ex: 'Das Pausenbrot hat er wieder vergessen.', exEs: 'Se ha vuelto a olvidar el bocadillo.' },
            { de: 'der Lehrplan', es: 'el currículo', ex: 'Das steht leider nicht im Lehrplan.', exEs: 'Eso no está en el currículo.' },
            { de: 'die Anwesenheit', es: 'la asistencia', ex: 'Die Anwesenheit wird jeden Tag kontrolliert.', exEs: 'La asistencia se controla cada día.' },
            { de: 'die Versetzung', es: 'la promoción de curso', ex: 'Die Versetzung ist nicht gefährdet.', exEs: 'La promoción de curso no corre peligro.' },
            { de: 'der Schulwechsel', es: 'el cambio de colegio', ex: 'Der Schulwechsel war die richtige Entscheidung.', exEs: 'El cambio de colegio fue la decisión correcta.' },
            { de: 'die Mitarbeit', es: 'la participación en clase', ex: 'Die Mitarbeit zählt auch für die Note.', exEs: 'La participación también cuenta para la nota.' },
            { de: 'das Abschlusszeugnis', es: 'el título de fin de estudios', ex: 'Ohne Abschlusszeugnis geht es nicht weiter.', exEs: 'Sin el título no se puede seguir.' },
            { de: 'die Ferienbetreuung', es: 'el cuidado en vacaciones', ex: 'Die Ferienbetreuung kostet fünfzig Euro pro Woche.', exEs: 'El cuidado en vacaciones cuesta cincuenta euros por semana.' }
          ]
        },
        {
          thema: 'Schulsachen',
          items: [
            { de: 'der Spitzer', es: 'el sacapuntas', ex: 'Der Spitzer liegt in der Federschachtel.', exEs: 'El sacapuntas está en el estuche.' },
            { de: 'das Lineal', es: 'la regla', ex: 'Für die Zeichnung brauchst du ein Lineal.', exEs: 'Para el dibujo necesitas una regla.' },
            { de: 'der Füller', es: 'la pluma estilográfica', ex: 'Ab der dritten Klasse schreiben sie mit Füller.', exEs: 'A partir de tercero escriben con pluma.' },
            { de: 'die Federschachtel (AT)', es: 'el estuche', ex: 'Die Federschachtel ist schon wieder zu Hause.', exEs: 'El estuche se ha quedado otra vez en casa.' },
            { de: 'der Klebstoff', es: 'el pegamento', ex: 'Für das Plakat fehlt uns noch Klebstoff.', exEs: 'Para el cartel nos falta pegamento.' },
            { de: 'die Buntstifte', es: 'los lápices de colores', ex: 'Die Buntstifte müssen morgen mit.', exEs: 'Mañana hay que llevar los lápices de colores.' },
            { de: 'der Zirkel', es: 'el compás', ex: 'Ohne Zirkel geht die Geometrieaufgabe nicht.', exEs: 'Sin compás no se puede hacer el ejercicio de geometría.' },
            { de: 'der Taschenrechner', es: 'la calculadora', ex: 'Bei der Schularbeit ist der Taschenrechner erlaubt.', exEs: 'En el examen está permitida la calculadora.' },
            { de: 'das Turnsackerl (AT)', es: 'la bolsa de gimnasia', ex: 'Das Turnsackerl bleibt in der Schule.', exEs: 'La bolsa de gimnasia se queda en el colegio.' },
            { de: 'die Jausenbox (AT)', es: 'la fiambrera del almuerzo', ex: 'In die Jausenbox kommt ein Brot und ein Apfel.', exEs: 'En la fiambrera va un bocadillo y una manzana.' }
          ]
        },
        {
          thema: 'Über Noten reden',
          items: [
            { de: 'der Einser (AT)', es: 'el sobresaliente (nota 1)', ex: 'Für den Einser hat sie wirklich viel gelernt.', exEs: 'Para ese sobresaliente estudió muchísimo.' },
            { de: 'der Fünfer (AT)', es: 'el suspenso (nota 5)', ex: 'Ein Fünfer im Zeugnis heißt Nachprüfung.', exEs: 'Un cinco en las notas significa examen de recuperación.' },
            { de: 'Sehr gut', es: 'sobresaliente', ex: 'In Mathe hat er ein Sehr gut bekommen.', exEs: 'En mates ha sacado un sobresaliente.' },
            { de: 'Genügend (AT)', es: 'suficiente (aprobado justo)', ex: 'Ein Genügend reicht zum Bestehen.', exEs: 'Con un suficiente basta para aprobar.' },
            { de: 'Nicht genügend (AT)', es: 'insuficiente (suspenso)', ex: 'Nicht genügend bedeutet leider durchgefallen.', exEs: 'Insuficiente significa, por desgracia, suspenso.' },
            { de: 'die Beurteilung', es: 'la calificación, la evaluación', ex: 'Die Beurteilung steht am Ende des Zeugnisses.', exEs: 'La calificación está al final del boletín.' },
            { de: 'benoten', es: 'poner nota, calificar', ex: 'Die Lehrerin benotet die Aufsätze am Wochenende.', exEs: 'La profesora corrige las redacciones el fin de semana.' },
            { de: 'die Nachprüfung', es: 'el examen de recuperación', ex: 'Im September hat er die Nachprüfung geschafft.', exEs: 'En septiembre aprobó la recuperación.' },
            { de: 'der Notendurchschnitt', es: 'la nota media', ex: 'Sein Notendurchschnitt hat sich verbessert.', exEs: 'Su nota media ha mejorado.' },
            { de: 'das Halbjahreszeugnis', es: 'el boletín del primer semestre', ex: 'Das Halbjahreszeugnis kommt im Februar.', exEs: 'El boletín del primer semestre llega en febrero.' }
          ]
        }
      ],
      pitfalls: [
        '"deswegen" NO es una conjunción: ocupa la posición 1 y detrás va el verbo. "…, deswegen WAR ER nicht in der Schule."',
        'Los posesivos se declinan como "ein-": en dativo femenino es "meiner" (mit meiner Lehrerin), en acusativo masculino "meinen" (ich hole meinen Sohn ab).',
        'En dativo plural el posesivo lleva -en y el sustantivo una -n: "mit meinen Kindern".'
      ],
      grammatik: [
        {
          regel: 'Verbindungsadverb deswegen',
          key: 'deswegen',
          erklaerung: '"deswegen" = por eso. Es un ADVERBIO: ocupa la posición 1 y el verbo va justo detrás.',
          detail:
            'Los conectores alemanes se dividen en tres grupos según lo que le hacen al verbo, y "deswegen" pertenece al de los adverbios conectores (también deshalb, darum, daher, trotzdem, dann).\n\nComo cualquier elemento en posición 1, empuja al sujeto detrás del verbo: "Mein Sohn war krank, deswegen WAR ER nicht in der Schule." Escribir "deswegen er war…" es el error clásico.\n\nOjo a la diferencia con "weil": "weil" da la CAUSA y manda el verbo al final; "deswegen" da la CONSECUENCIA y provoca inversión. Son dos formas de decir lo mismo del revés:\n"Er war krank, deswegen ist er zu Hause geblieben." = "Er ist zu Hause geblieben, weil er krank war."',
          tabelle: {
            title: 'Los tres tipos de conector',
            headers: ['Tipo', 'Ejemplos', 'Efecto en el verbo'],
            rows: [
              ['Coordinantes', 'und, aber, oder, denn, sondern', 'no cambian nada'],
              ['Adverbios conectores', 'deswegen, deshalb, trotzdem, dann', 'posición 1 → inversión'],
              ['Subordinantes', 'weil, dass, wenn, obwohl', 'verbo AL FINAL']
            ]
          },
          beispiele: [
            { de: 'Mein Sohn war krank, deswegen war er nicht in der Schule.', es: 'Mi hijo estaba enfermo, por eso no fue al colegio.' },
            { de: 'Ich habe den Bus verpasst. Deswegen komme ich zu spät.', es: 'He perdido el bus. Por eso llego tarde.' },
            { de: 'Sie hat keine Zeit, deswegen kommt sie nicht mit.', es: 'No tiene tiempo, por eso no viene.' }
          ],
          mehr: {
            title: 'La misma idea con weil',
            examples: [
              { de: 'Er ist zu Hause geblieben, weil er krank war.', es: 'Se quedó en casa porque estaba enfermo.' },
              { de: 'Er war krank, deswegen ist er zu Hause geblieben.', es: 'Estaba enfermo, por eso se quedó en casa.' }
            ]
          }
        },
        {
          regel: 'Possessivartikel im Nominativ, Akkusativ und Dativ',
          key: 'possessiv-nom-akk-dat',
          erklaerung: 'mein, dein, sein, ihr, unser, euer, ihr/Ihr. Se declinan como "ein-" / "kein-".',
          detail:
            'El posesivo tiene dos partes: la RAÍZ dice de quién es (mein = mío, sein = de él, ihr = de ella o de ellos) y la TERMINACIÓN dice el género y el caso del objeto poseído.\n\nEso es justo al revés que en español, donde "su" no distingue el poseedor. Fíjate: "sein Sohn" = el hijo DE ÉL, "ihr Sohn" = el hijo DE ELLA.\n\nLas terminaciones son las de "ein-/kein-": nominativo masculino y neutro sin terminación, femenino y plural con -e; acusativo igual salvo el masculino, que hace -en; dativo -em (m/n), -er (f), -en (pl, y el sustantivo añade -n).\n\nCuidado con "euer": pierde la -e- al declinarse (euer Sohn, pero eure Tochter, euren Sohn).',
          tabelle: {
            title: 'Terminaciones de mein-',
            headers: ['Caso', 'masculino', 'femenino', 'neutro', 'plural'],
            rows: [
              ['Nominativ', 'mein', 'meine', 'mein', 'meine'],
              ['Akkusativ', 'meinen', 'meine', 'mein', 'meine'],
              ['Dativ', 'meinem', 'meiner', 'meinem', 'meinen (+ -n)']
            ]
          },
          beispiele: [
            { de: 'Meine Tochter geht in die Volksschule.', es: 'Mi hija va a primaria.' },
            { de: 'Ich hole meinen Sohn von der Schule ab.', es: 'Recojo a mi hijo del colegio.' },
            { de: 'Ich spreche morgen mit meiner Lehrerin.', es: 'Mañana hablo con mi profesora.' },
            { de: 'Wir fahren mit unseren Kindern nach Graz.', es: 'Vamos a Graz con nuestros hijos.' }
          ],
          mehr: {
            title: 'sein o ihr',
            examples: [
              { de: 'Das ist Samir und das ist seine Schwester.', es: 'Este es Samir y esta es su hermana (de él).' },
              { de: 'Das ist Maria und das ist ihr Bruder.', es: 'Esta es Maria y este es su hermano (de ella).' }
            ]
          }
        },
        {
          key: 'deshalb-darum-daher',
          regel: 'deshalb, darum, daher',
          erklaerung: 'Son sinónimos de deswegen y funcionan igual: adverbio en posición 1, verbo justo detrás y el sujeto después. Er war krank, DESHALB FEHLTE ER. Se pueden cambiar entre sí sin que cambie nada.',
          beispiele: [
            { de: 'Er war krank, deshalb fehlte er in der Schule.', es: 'Estaba enfermo, por eso faltó al colegio.' },
            { de: 'Sie hat viel geübt, darum war die Schularbeit leicht.', es: 'Practicó mucho, por eso el examen le resultó fácil.' }
          ]
        },
        {
          key: 'weil-oder-deshalb',
          regel: 'weil oder deshalb?',
          erklaerung: 'Dicen lo mismo pero se colocan al revés. weil presenta la CAUSA y manda el verbo al final. deshalb presenta la CONSECUENCIA y lleva el verbo justo detrás. Er fehlt, WEIL er krank IST = Er ist krank, DESHALB FEHLT er.',
          beispiele: [
            { de: 'Er fehlt, weil er krank ist.', es: 'Falta porque está enfermo.' },
            { de: 'Er ist krank, deshalb fehlt er.', es: 'Está enfermo, por eso falta.' }
          ]
        },
        {
          key: 'nebensatz-mit-wenn-schule',
          regel: 'Bedingung in der Schule: wenn',
          erklaerung: 'wenn dice la condición y manda el verbo al final. Va muy bien para las normas del colegio: WENN du krank BIST, musst du eine Entschuldigung bringen.',
          beispiele: [
            { de: 'Wenn du krank bist, brauchst du eine Entschuldigung.', es: 'Si estás enfermo, necesitas un justificante.' },
            { de: 'Wenn die Note schlecht ist, gibt es eine Nachprüfung.', es: 'Si la nota es mala, hay recuperación.' }
          ]
        },
        {
          key: 'praeteritum-modalverben',
          regel: 'Präteritum der Modalverben',
          erklaerung: 'Los modales en pasado usan Präteritum, no Perfekt, y pierden el Umlaut: können → konnte, müssen → musste, dürfen → durfte, wollen → wollte, sollen → sollte, mögen → mochte.',
          beispiele: [
            { de: 'Ich konnte gestern nicht kommen.', es: 'Ayer no pude venir.' },
            { de: 'Wir mussten die Schularbeit wiederholen.', es: 'Tuvimos que repetir el examen.' }
          ]
        },
        {
          key: 'adjektiv-alle-faelle-wdh',
          regel: 'Adjektivendungen: der Überblick',
          erklaerung: 'Regla corta que vale casi siempre: si el artículo YA dice el género y el caso (der, die, das, den, dem), el adjetivo se conforma con -e o -en. Si no lo dice (ein, kein, mein, o nada), el adjetivo tiene que decirlo él: -er, -e, -es.',
          beispiele: [
            { de: 'Der neue Lehrer ist sehr geduldig.', es: 'El profesor nuevo es muy paciente.' },
            { de: 'Ein neuer Lehrer kommt nach den Ferien.', es: 'Un profesor nuevo llega después de las vacaciones.' }
          ]
        },
        {
          key: 'aussprache-chs-x',
          regel: 'Aussprache: chs und x',
          erklaerung: 'El grupo chs no suena como ch: suena «ks», igual que la x. sechs se dice «seks», wachsen «váksen». Es de los pocos sitios donde ch NO hace su sonido habitual.',
          beispiele: [
            { de: 'Der Unterricht beginnt um sechs.', es: 'Las clases empiezan a las seis.' },
            { de: 'Die Kinder wachsen schnell.', es: 'Los niños crecen rápido.' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'organisatorische Fragen in der Schule klären',
          es: 'Aclarar cuestiones organizativas en la escuela',
          wendungen: [
            { de: 'Wann ist der nächste Elternsprechtag?', es: '¿Cuándo es el próximo día de tutorías?' }
          ]
        },
        {
          funktion: 'den Schulalltag und Kosten besprechen',
          es: 'Hablar de la vida escolar y gastos',
          wendungen: [
            { de: 'Welche Schulbücher müssen wir kaufen?', es: '¿Qué libros de texto tenemos que comprar?' }
          ]
        },
        {
          funktion: 'mit der Lehrkraft über Lernschwierigkeiten sprechen',
          es: 'Hablar con el profesor sobre dificultades de aprendizaje',
          wendungen: [
            { de: 'Mein Kind hat Schwierigkeiten mit der Sprache.', es: 'Mi hijo tiene dificultades con el idioma.' }
          ]
        },
        {
          funktion: 'Unterstützung und Förderung zu Hause besprechen',
          es: 'Acordar apoyo y refuerzo en casa',
          wendungen: [
            { de: 'Was können wir zu Hause üben?', es: '¿Qué podemos practicar en casa?' }
          ]
        },
        {
          funktion: 'um sprachliche Hilfe bitten und Hilfen anbieten',
          es: 'Pedir ayuda lingüística y ofrecer apoyos',
          wendungen: [
            { de: 'Könnten Sie bitte etwas langsamer sprechen?', es: '¿Podría hablar un poco más despacio?' }
          ]
        },
        {
          funktion: 'Unsicherheit und Zweifel ausdrücken',
          es: 'Expresar inseguridad y dudas',
          wendungen: [
            { de: 'Kommt Ihr Sohn nächstes Jahr ins Gymnasium?', es: '¿Su hijo va el año que viene al instituto?' }
          ]
        },
        {
          funktion: 'Gleichgültigkeit ausdrücken',
          es: 'Expresar indiferencia',
          wendungen: [
            { de: 'Sollen wir am Dienstag oder am Donnerstag reden?', es: '¿Hablamos el martes o el jueves?' }
          ]
        },
        {
          funktion: 'ein Elterngespräch abschließen',
          es: 'Concluir una reunión de padres y profesores',
          wendungen: [
            { de: 'Ich verstehe das Schulsystem hier noch nicht ganz.', es: 'Todavía no entiendo bien el sistema escolar de aquí.' }
          ]
        }
      ]
    },

    // ==================== LEKTION 6 ====================
    {
      id: 'a21-l6',
      legacyId: 'l6',
      nr: 6,
      name: 'Feierabend',
      woerter: [
        {
          thema: 'Medien',
          items: [
            { de: 'die Nachrichten (Pl.)', es: 'las noticias', ex: 'Die Nachrichten schaue ich meistens um sieben.', exEs: 'Las noticias las veo casi siempre a las siete.' },
            { de: 'die Zeitung, -en', es: 'el periódico', ex: 'Am Sonntag lese ich die Zeitung auf Papier.', exEs: 'Los domingos leo el periódico en papel.' },
            { de: 'die Zeitschrift, -en', es: 'la revista', ex: 'Beim Arzt gibt es immer alte Zeitschriften.', exEs: 'En el médico siempre hay revistas viejas.' },
            { de: 'das Radio', es: 'la radio', ex: 'Beim Kochen läuft bei mir das Radio.', exEs: 'Cuando cocino tengo la radio puesta.' },
            { de: 'die Sendung, -en', es: 'el programa', ex: 'Diese Sendung kommt jeden Mittwoch.', exEs: 'Este programa lo ponen todos los miércoles.' },
            { de: 'der Podcast, -s', es: 'el pódcast', ex: 'Im Zug höre ich einen Podcast auf Deutsch.', exEs: 'En el tren escucho un pódcast en alemán.' },
            { de: 'streamen', es: 'ver en streaming', ex: 'Wir streamen die Serie am Wochenende zu Ende.', exEs: 'Terminamos de ver la serie el fin de semana.' },
            { de: 'der Kanal, ¨-e', es: 'el canal', ex: 'Der Kanal hat über eine Million Abonnenten.', exEs: 'El canal tiene más de un millón de suscriptores.' },
            { de: 'die sozialen Medien', es: 'las redes sociales', ex: 'In den sozialen Medien bin ich kaum aktiv.', exEs: 'En las redes sociales apenas estoy activo.' },
            { de: 'posten', es: 'publicar', ex: 'Sie postet jeden Tag ein Foto.', exEs: 'Publica una foto todos los días.' },
            { de: 'die Werbung', es: 'la publicidad', ex: 'Nach zehn Minuten kommt schon wieder Werbung.', exEs: 'A los diez minutos ya hay publicidad otra vez.' },
            { de: 'die Nachricht, -en', es: 'el mensaje / la noticia', ex: 'Ich habe dir eine Nachricht geschickt.', exEs: 'Te he mandado un mensaje.' }
          ]
        },
        {
          thema: 'Film und Fernsehen',
          items: [
            { de: 'der Film, -e', es: 'la película', ex: 'Der Film dauert fast drei Stunden.', exEs: 'La película dura casi tres horas.' },
            { de: 'die Serie, -n', es: 'la serie', ex: 'Die Serie hat nur sechs Folgen.', exEs: 'La serie tiene solo seis capítulos.' },
            { de: 'die Komödie, -n', es: 'la comedia', ex: 'Nach der Arbeit will ich nur eine Komödie sehen.', exEs: 'Después del trabajo solo quiero ver una comedia.' },
            { de: 'der Krimi, -s', es: 'la película policíaca', ex: 'Sonntags läuft im Ersten immer ein Krimi.', exEs: 'Los domingos siempre ponen una policíaca.' },
            { de: 'der Actionfilm', es: 'la película de acción', ex: 'Actionfilme schaue ich lieber im Kino.', exEs: 'Las películas de acción prefiero verlas en el cine.' },
            { de: 'die Dokumentation / die Doku', es: 'el documental', ex: 'Die Doku über Wien war richtig gut.', exEs: 'El documental sobre Viena estuvo muy bien.' },
            { de: 'der Schauspieler / die Schauspielerin', es: 'el actor / la actriz', ex: 'Die Schauspielerin kenne ich aus einer anderen Serie.', exEs: 'A la actriz la conozco de otra serie.' },
            { de: 'die Folge, -n', es: 'el capítulo', ex: 'Die letzte Folge hat mir nicht gefallen.', exEs: 'El último capítulo no me gustó.' },
            { de: 'die Staffel, -n', es: 'la temporada', ex: 'Die zweite Staffel kommt erst nächstes Jahr.', exEs: 'La segunda temporada no llega hasta el año que viene.' },
            { de: 'der Untertitel', es: 'los subtítulos', ex: 'Ohne Untertitel verstehe ich noch nicht alles.', exEs: 'Sin subtítulos todavía no lo entiendo todo.' },
            { de: 'die Handlung', es: 'la trama', ex: 'Die Handlung war mir zu kompliziert.', exEs: 'La trama me resultó demasiado complicada.' },
            { de: 'fernsehen', es: 'ver la tele', ex: 'Unter der Woche sehe ich kaum fern.', exEs: 'Entre semana casi no veo la tele.' },
            { de: 'spannend', es: 'emocionante', ex: 'Das Buch ist von der ersten Seite an spannend.', exEs: 'El libro es emocionante desde la primera página.' },
            { de: 'langweilig', es: 'aburrido', ex: 'Der zweite Teil war ziemlich langweilig.', exEs: 'La segunda parte fue bastante aburrida.' },
            { de: 'lustig', es: 'divertido', ex: 'Der Film war lustiger, als ich dachte.', exEs: 'La película fue más divertida de lo que pensaba.' },
            { de: 'gruselig', es: 'de miedo', ex: 'Allein ist mir das zu gruselig.', exEs: 'Solo me da demasiado miedo.' }
          ]
        },
        {
          thema: 'Feierabend und Freizeit',
          items: [
            { de: 'der Feierabend', es: 'el fin de la jornada', ex: 'Nach Feierabend gehe ich schwimmen.', exEs: 'Al salir del trabajo voy a nadar.' },
            { de: 'sich entspannen', es: 'relajarse', ex: 'Beim Lesen entspanne ich mich am besten.', exEs: 'Leyendo es como mejor me relajo.' },
            { de: 'faulenzen', es: 'holgazanear', ex: 'Am Sonntag faulenze ich den ganzen Tag.', exEs: 'El domingo holgazaneo todo el día.' },
            { de: 'sich treffen (mit + Dat.)', es: 'quedar (con)', ex: 'Ich treffe mich später mit Anna.', exEs: 'Luego quedo con Anna.' },
            { de: 'ausgehen', es: 'salir', ex: 'Am Freitag gehen wir meistens aus.', exEs: 'Los viernes solemos salir.' },
            { de: 'zu Hause bleiben', es: 'quedarse en casa', ex: 'Bei dem Wetter bleibe ich lieber zu Hause.', exEs: 'Con este tiempo prefiero quedarme en casa.' },
            { de: 'Zeit verbringen', es: 'pasar el tiempo', ex: 'Im Urlaub verbringe ich viel Zeit mit der Familie.', exEs: 'En vacaciones paso mucho tiempo con la familia.' },
            { de: 'Lust haben (auf + Akk.)', es: 'tener ganas (de)', ex: 'Hast du Lust auf einen Kaffee?', exEs: '¿Te apetece un café?' }
          ]
        },
        {
          thema: 'Mediengewohnheiten',
          items: [
            { de: 'die Serie', es: 'la serie', ex: 'Die Serie hat vier Staffeln.', exEs: 'La serie tiene cuatro temporadas.' },
            { de: 'die Folge', es: 'el capítulo', ex: 'Die letzte Folge war die beste.', exEs: 'El último capítulo fue el mejor.' },
            { de: 'der Trailer', es: 'el tráiler', ex: 'Der Trailer sah besser aus als der Film.', exEs: 'El tráiler tenía mejor pinta que la película.' },
            { de: 'die Staffel', es: 'la temporada', ex: 'Die dritte Staffel kommt im Herbst.', exEs: 'La tercera temporada sale en otoño.' },
            { de: 'die Sendung', es: 'el programa', ex: 'Diese Sendung kommt jeden Freitag.', exEs: 'Este programa lo ponen todos los viernes.' },
            { de: 'die Nachrichten', es: 'las noticias', ex: 'Die Nachrichten sehe ich um acht.', exEs: 'Las noticias las veo a las ocho.' },
            { de: 'der Podcast', es: 'el pódcast', ex: 'Im Zug höre ich einen Podcast.', exEs: 'En el tren escucho un pódcast.' },
            { de: 'der Bildschirm', es: 'la pantalla', ex: 'Den ganzen Tag vor dem Bildschirm ist zu viel.', exEs: 'Todo el día delante de la pantalla es demasiado.' },
            { de: 'abschalten', es: 'desconectar', ex: 'Abends schalte ich das Handy ab.', exEs: 'Por la noche apago el móvil.' },
            { de: 'das Abo', es: 'la suscripción', ex: 'Mein Abo läuft im Mai aus.', exEs: 'Mi suscripción termina en mayo.' }
          ]
        },
        {
          thema: 'Medien & Abschalten',
          items: [
            { de: 'die Fernbedienung', es: 'el mando a distancia', ex: 'Wo ist schon wieder die Fernbedienung?', exEs: '¿Dónde está otra vez el mando?' },
            { de: 'der Lautsprecher', es: 'el altavoz', ex: 'Der Lautsprecher ist kaputt.', exEs: 'El altavoz está roto.' },
            { de: 'die Kopfhörer', es: 'los auriculares', ex: 'Ohne Kopfhörer höre ich nichts.', exEs: 'Sin auriculares no oigo nada.' },
            { de: 'das Interview', es: 'la entrevista', ex: 'Das Interview war wirklich interessant.', exEs: 'La entrevista fue realmente interesante.' },
            { de: 'der Moderator', es: 'el presentador', ex: 'Der Moderator stellt gute Fragen.', exEs: 'El presentador hace buenas preguntas.' },
            { de: 'die Quelle', es: 'la fuente de información', ex: 'Prüf immer zuerst die Quelle.', exEs: 'Comprueba siempre primero la fuente.' },
            { de: 'die Falschmeldung', es: 'la noticia falsa', ex: 'Im Netz kursiert eine Falschmeldung.', exEs: 'Por la red circula una noticia falsa.' },
            { de: 'das Gerücht', es: 'el rumor', ex: 'Das ist nur ein Gerücht.', exEs: 'Eso es solo un rumor.' },
            { de: 'abonnieren', es: 'suscribirse', ex: 'Ich habe den Kanal abonniert.', exEs: 'Me he suscrito al canal.' },
            { de: 'löschen', es: 'borrar', ex: 'Die Nachricht habe ich gelöscht.', exEs: 'El mensaje lo he borrado.' },
            { de: 'teilen', es: 'compartir', ex: 'Den Artikel teile ich mit dir.', exEs: 'El artículo lo comparto contigo.' },
            { de: 'der Kommentar', es: 'el comentario', ex: 'Der Kommentar unter dem Video war gemein.', exEs: 'El comentario debajo del vídeo era cruel.' },
            { de: 'der Hauptdarsteller', es: 'el protagonista', ex: 'Der Hauptdarsteller spielt richtig gut.', exEs: 'El protagonista actúa muy bien.' },
            { de: 'das Ende', es: 'el final', ex: 'Das Ende der Serie war enttäuschend.', exEs: 'El final de la serie fue decepcionante.' },
            { de: 'süchtig', es: 'enganchado, adicto', ex: 'Ich bin fast süchtig nach dieser Serie.', exEs: 'Estoy casi enganchado a esta serie.' },
            { de: 'sich informieren', es: 'informarse', ex: 'Ich informiere mich über die Zeitung.', exEs: 'Me informo a través del periódico.' }
          ]
        },
        {
          thema: 'Medien & Meinung',
          items: [
            { de: 'die Schlagzeile', es: 'el titular', ex: 'Die Schlagzeile war völlig übertrieben.', exEs: 'El titular era totalmente exagerado.' },
            { de: 'der Artikel', es: 'el artículo', ex: 'Der Artikel stand gestern in der Zeitung.', exEs: 'El artículo salió ayer en el periódico.' },
            { de: 'die Redaktion', es: 'la redacción', ex: 'Die Redaktion hat sich später entschuldigt.', exEs: 'La redacción se disculpó después.' },
            { de: 'der Journalist', es: 'el periodista', ex: 'Der Journalist hat sehr gut recherchiert.', exEs: 'El periodista ha investigado muy bien.' },
            { de: 'die Recherche', es: 'la investigación periodística', ex: 'Die Recherche hat mehrere Monate gedauert.', exEs: 'La investigación duró varios meses.' },
            { de: 'die Reichweite', es: 'el alcance', ex: 'Das Video hatte eine riesige Reichweite.', exEs: 'El vídeo tuvo un alcance enorme.' },
            { de: 'der Algorithmus', es: 'el algoritmo', ex: 'Der Algorithmus zeigt mir immer dasselbe.', exEs: 'El algoritmo me enseña siempre lo mismo.' },
            { de: 'das Profil', es: 'el perfil', ex: 'Mein Profil ist auf privat gestellt.', exEs: 'Mi perfil está en privado.' },
            { de: 'der Datenschutz', es: 'la protección de datos', ex: 'Beim Datenschutz bin ich sehr vorsichtig.', exEs: 'Con la protección de datos soy muy cuidadoso.' },
            { de: 'die Ablenkung', es: 'la distracción', ex: 'Das Handy ist die größte Ablenkung.', exEs: 'El móvil es la mayor distracción.' },
            { de: 'die Bildschirmzeit', es: 'el tiempo de pantalla', ex: 'Meine Bildschirmzeit ist eindeutig zu hoch.', exEs: 'Mi tiempo de pantalla es claramente demasiado alto.' },
            { de: 'offline', es: 'sin conexión', ex: 'Am Wochenende bin ich gern offline.', exEs: 'El fin de semana me gusta estar sin conexión.' },
            { de: 'die Diskussion', es: 'el debate', ex: 'Die Diskussion im Netz war sehr hart.', exEs: 'El debate en la red fue muy duro.' },
            { de: 'die Meinung', es: 'la opinión', ex: 'Jeder hat dazu eine andere Meinung.', exEs: 'Cada uno tiene una opinión distinta al respecto.' },
            { de: 'die Unterhaltung', es: 'el entretenimiento', ex: 'Das ist reine Unterhaltung, mehr nicht.', exEs: 'Eso es puro entretenimiento, nada más.' },
            { de: 'glaubwürdig', es: 'creíble', ex: 'Diese Quelle ist sehr glaubwürdig.', exEs: 'Esta fuente es muy creíble.' },
            { de: 'übertrieben', es: 'exagerado', ex: 'Die Reaktion war völlig übertrieben.', exEs: 'La reacción fue totalmente exagerada.' },
            { de: 'neutral', es: 'neutral', ex: 'Der Bericht war erstaunlich neutral.', exEs: 'El informe fue sorprendentemente neutral.' },
            { de: 'der Trend', es: 'la tendencia', ex: 'Dieser Trend hält sicher nicht lange.', exEs: 'Esa tendencia seguro que no dura mucho.' },
            { de: 'der Zuhörer', es: 'el oyente', ex: 'Der Podcast hat schon tausend Zuhörer.', exEs: 'El pódcast ya tiene mil oyentes.' }
          ]
        },
        {
          thema: 'Presse & Streaming',
          items: [
            { de: 'der Streamingdienst', es: 'el servicio de streaming', ex: 'Der Streamingdienst kostet neun Euro im Monat.', exEs: 'El servicio de streaming cuesta nueve euros al mes.' },
            { de: 'die Mediathek', es: 'la mediateca', ex: 'In der Mediathek gibt es alle alten Folgen.', exEs: 'En la mediateca están todos los episodios antiguos.' },
            { de: 'die Livesendung', es: 'la emisión en directo', ex: 'Die Livesendung beginnt um zwanzig Uhr.', exEs: 'La emisión en directo empieza a las ocho.' },
            { de: 'der Rundfunk', es: 'la radiodifusión', ex: 'Der öffentliche Rundfunk finanziert sich über Gebühren.', exEs: 'La radiodifusión pública se financia con tasas.' },
            { de: 'der Newsletter', es: 'el boletín', ex: 'Den Newsletter habe ich längst abbestellt.', exEs: 'El boletín lo cancelé hace tiempo.' },
            { de: 'der Werbespot', es: 'el anuncio publicitario', ex: 'Der Werbespot läuft alle zehn Minuten.', exEs: 'El anuncio sale cada diez minutos.' },
            { de: 'die Umfrage', es: 'la encuesta', ex: 'Die Umfrage zeigt ein ziemlich klares Bild.', exEs: 'La encuesta muestra una imagen bastante clara.' },
            { de: 'der Leserbrief', es: 'la carta al director', ex: 'Ihr Leserbrief stand am Sonntag drin.', exEs: 'Su carta al director salió el domingo.' },
            { de: 'die Titelseite', es: 'la portada', ex: 'Auf der Titelseite war ein großes Foto.', exEs: 'En la portada había una foto grande.' },
            { de: 'die Meldung', es: 'la noticia breve', ex: 'Die Meldung war nur drei Zeilen lang.', exEs: 'La noticia tenía solo tres líneas.' },
            { de: 'die Kolumne', es: 'la columna', ex: 'Seine Kolumne lese ich jede Woche.', exEs: 'Su columna la leo cada semana.' },
            { de: 'der Skandal', es: 'el escándalo', ex: 'Der Skandal war wochenlang das Thema.', exEs: 'El escándalo fue el tema durante semanas.' },
            { de: 'die Zensur', es: 'la censura', ex: 'Zensur gibt es hier zum Glück nicht.', exEs: 'Por suerte aquí no hay censura.' },
            { de: 'die Pressefreiheit', es: 'la libertad de prensa', ex: 'Pressefreiheit ist keine Selbstverständlichkeit.', exEs: 'La libertad de prensa no es algo evidente.' },
            { de: 'der Verlag', es: 'la editorial', ex: 'Der Verlag sitzt in Salzburg.', exEs: 'La editorial está en Salzburgo.' },
            { de: 'die Synchronisation', es: 'el doblaje', ex: 'Die Synchronisation ist besser als erwartet.', exEs: 'El doblaje es mejor de lo esperado.' },
            { de: 'die Originalfassung', es: 'la versión original', ex: 'Ich schaue lieber die Originalfassung.', exEs: 'Prefiero ver la versión original.' },
            { de: 'die Bildqualität', es: 'la calidad de imagen', ex: 'Die Bildqualität ist bei schlechtem Netz mies.', exEs: 'Con mala conexión la calidad de imagen es pésima.' },
            { de: 'die Diskussionsrunde', es: 'la mesa redonda', ex: 'Nach dem Film kommt eine Diskussionsrunde.', exEs: 'Después de la película hay una mesa redonda.' }
          ]
        },
        {
          thema: 'Abends zu Hause',
          items: [
            { de: 'der Lieblingsplatz', es: 'el sitio favorito', ex: 'Mein Lieblingsplatz ist der Sessel am Fenster.', exEs: 'Mi sitio favorito es el sillón junto a la ventana.' },
            { de: 'das Feierabendbier', es: 'la cerveza de después del trabajo', ex: 'Freitags gibt es ein Feierabendbier mit den Kollegen.', exEs: 'Los viernes hay una cerveza con los compañeros al salir.' },
            { de: 'die Füße hochlegen', es: 'poner los pies en alto', ex: 'Endlich kann ich die Füße hochlegen.', exEs: 'Por fin puedo poner los pies en alto.' },
            { de: 'ein Bad nehmen', es: 'darse un baño', ex: 'Nach so einem Tag nehme ich ein heißes Bad.', exEs: 'Después de un día así me doy un baño caliente.' },
            { de: 'das Licht ausmachen', es: 'apagar la luz', ex: 'Mach bitte das Licht im Flur aus.', exEs: 'Apaga la luz del pasillo, por favor.' },
            { de: 'die Stille', es: 'el silencio', ex: 'Nach dem Lärm im Büro genieße ich die Stille.', exEs: 'Después del ruido de la oficina disfruto del silencio.' },
            { de: 'einschlafen', es: 'dormirse', ex: 'Vor dem Fernseher schlafe ich sofort ein.', exEs: 'Delante de la tele me duermo enseguida.' },
            { de: 'durchschlafen', es: 'dormir del tirón', ex: 'Seit dem Baby schlafe ich kaum noch durch.', exEs: 'Desde que está el bebé casi no duermo del tirón.' },
            { de: 'das Nickerchen', es: 'la siesta corta', ex: 'Ein Nickerchen von zwanzig Minuten reicht mir.', exEs: 'Con una siesta de veinte minutos me basta.' },
            { de: 'der Schlafanzug', es: 'el pijama', ex: 'Um neun bin ich schon im Schlafanzug.', exEs: 'A las nueve ya estoy en pijama.' }
          ]
        },
        {
          thema: 'Fernseher & Ton',
          items: [
            { de: 'zappen', es: 'hacer zapping', ex: 'Er zappt eine Stunde und schaut dann doch nichts.', exEs: 'Hace zapping una hora y al final no ve nada.' },
            { de: 'umschalten', es: 'cambiar de canal', ex: 'Schalt bitte auf den anderen Kanal um.', exEs: 'Cambia al otro canal, por favor.' },
            { de: 'lauter stellen', es: 'subir el volumen', ex: 'Kannst du bitte lauter stellen?', exEs: '¿Puedes subir el volumen?' },
            { de: 'leiser stellen', es: 'bajar el volumen', ex: 'Stell bitte leiser, die Nachbarn schlafen.', exEs: 'Baja el volumen, que los vecinos duermen.' },
            { de: 'pausieren', es: 'pausar', ex: 'Pausier kurz, ich hole mir was zu trinken.', exEs: 'Pausa un momento, voy a por algo de beber.' },
            { de: 'vorspulen', es: 'adelantar', ex: 'Die Werbung spule ich immer vor.', exEs: 'La publicidad siempre la adelanto.' },
            { de: 'zurückspulen', es: 'rebobinar, retroceder', ex: 'Spul zurück, das habe ich nicht verstanden.', exEs: 'Retrocede, eso no lo he entendido.' },
            { de: 'die Lautstärke', es: 'el volumen', ex: 'Die Lautstärke ist mir viel zu hoch.', exEs: 'El volumen me parece demasiado alto.' },
            { de: 'aufnehmen', es: 'grabar', ex: 'Die Sendung nehme ich auf und schaue sie später.', exEs: 'Grabo el programa y lo veo luego.' }
          ]
        }
      ],
      pitfalls: [
        '"dass" (conjunción, dos eses) no es lo mismo que "das" (artículo o pronombre, una ese).',
        'Tras "dass" el verbo va SIEMPRE al final: "Ich glaube, dass der Film gut IST."',
        '"trotzdem" provoca inversión (posición 1 + verbo); "obwohl" manda el verbo al final. No son intercambiables.'
      ],
      grammatik: [
        {
          regel: 'Konjunktion dass',
          key: 'konjunktion-dass',
          erklaerung: '"dass" = que. Introduce una subordinada completiva y manda el verbo AL FINAL.',
          detail:
            '"dass" enlaza una frase principal con lo que piensas, dices o sientes. Va detrás de verbos y expresiones como: ich glaube, ich denke, ich finde, ich hoffe, ich weiß, es ist gut/schade/wichtig.\n\nComo toda subordinada, lleva coma delante y el verbo conjugado al final: "Ich glaube, dass der Film sehr spannend IST." Con Perfekt o modal, el orden final es participio/infinitivo + verbo conjugado: "…, dass ich die Folge schon gesehen HABE."\n\nEl error de escritura más frecuente es confundir "dass" con "das". Truco: si puedes sustituirlo por "dieses" o "welches", es "das" (artículo/pronombre). Si es un "que" que introduce una frase entera, es "dass".\n\nEn el lenguaje hablado se puede omitir "dass", pero entonces el orden vuelve a ser normal: "Ich glaube, der Film ist gut."',
          tabelle: {
            title: 'dass o das',
            headers: ['Palabra', 'Función', 'Ejemplo'],
            rows: [
              ['dass', 'conjunción (que)', 'Ich weiß, dass er kommt.'],
              ['das', 'artículo neutro', 'Das Buch ist gut.'],
              ['das', 'pronombre (eso)', 'Das finde ich super.'],
              ['das', 'relativo (que)', 'Das Buch, das ich lese, …']
            ]
          },
          beispiele: [
            { de: 'Ich glaube, dass der Film sehr spannend ist.', es: 'Creo que la película es muy emocionante.' },
            { de: 'Er sagt, dass er lieber Dokus schaut.', es: 'Dice que prefiere ver documentales.' },
            { de: 'Ich finde, dass man zu viel fernsieht.', es: 'Creo que se ve demasiada tele.' },
            { de: 'Es ist schade, dass die Serie zu Ende ist.', es: 'Es una pena que la serie se haya acabado.' }
          ],
          mehr: {
            title: 'Con Perfekt y modal',
            examples: [
              { de: '…, dass ich die Folge schon gesehen habe.', es: '…que ya he visto el capítulo.' },
              { de: '…, dass wir morgen früh aufstehen müssen.', es: '…que mañana tenemos que madrugar.' }
            ]
          }
        },
        {
          regel: 'Verbindungsadverb trotzdem',
          key: 'trotzdem',
          erklaerung: '"trotzdem" = aun así. Adverbio: posición 1 y el verbo justo detrás.',
          detail:
            '"trotzdem" expresa que algo pasa CONTRA lo esperado. Como "deswegen", es un adverbio conector: va en posición 1 y provoca inversión. "Der Film war lang. Trotzdem HAT ER mir gefallen."\n\nLa idea contraria se puede decir también con "obwohl", pero ojo: "obwohl" es SUBORDINANTE y manda el verbo al final. Las dos frases significan lo mismo con estructuras opuestas:\n"Obwohl der Film lang WAR, hat er mir gefallen."\n"Der Film war lang, trotzdem HAT ER mir gefallen."\n\nNo confundas "trotzdem" (adverbio) con "trotz" (preposición + genitivo: "trotz des Regens").',
          tabelle: {
            title: 'obwohl / trotzdem',
            headers: ['Conector', 'Tipo', 'Posición del verbo', 'Ejemplo'],
            rows: [
              ['obwohl', 'subordinante', 'al final', 'Obwohl es spät war, blieben wir.'],
              ['trotzdem', 'adverbio', 'inversión', 'Es war spät. Trotzdem blieben wir.'],
              ['aber', 'coordinante', 'orden normal', 'Es war spät, aber wir blieben.']
            ]
          },
          beispiele: [
            { de: 'Der Film war lang. Trotzdem hat er mir gefallen.', es: 'La película era larga. Aun así me gustó.' },
            { de: 'Ich bin müde, trotzdem schaue ich noch eine Folge.', es: 'Estoy cansado, aun así veo otro capítulo.' },
            { de: 'Obwohl es spät war, haben wir weitergeschaut.', es: 'Aunque era tarde, seguimos viendo.' }
          ]
        },
        {
          key: 'indirekte-rede-dass',
          regel: 'Meinungen wiedergeben mit dass',
          erklaerung: 'Para contar lo que alguien dice o piensa se usa dass y el verbo se va al final: Er sagt, DASS die Serie gut IST. En el día a día también se puede quitar el dass, y entonces la frase va en orden normal: Er sagt, die Serie ist gut.',
          beispiele: [
            { de: 'Er sagt, dass die Serie sehr spannend ist.', es: 'Dice que la serie es muy interesante.' },
            { de: 'Ich finde, dass die Werbung zu laut ist.', es: 'Me parece que la publicidad está muy alta.' }
          ]
        },
        {
          key: 'meinung-ausdruecken',
          regel: 'Die Meinung sagen',
          erklaerung: 'Las fórmulas fijas para opinar: Ich finde, … / Meiner Meinung nach … / Ich glaube, … Ojo con meiner Meinung nach: ocupa la posición 1, así que el verbo va justo detrás.',
          beispiele: [
            { de: 'Meiner Meinung nach ist das übertrieben.', es: 'En mi opinión eso es exagerado.' },
            { de: 'Ich finde diese Sendung ziemlich langweilig.', es: 'Esta emisión me parece bastante aburrida.' }
          ]
        },
        {
          key: 'relativsatz-nominativ',
          regel: 'Relativsatz im Nominativ',
          erklaerung: 'Para decir algo más de una cosa sin empezar otra frase: der Film, DER mir gefallen hat. El pronombre relativo se parece al artículo (der, die, das, die) y manda el verbo al final.',
          beispiele: [
            { de: 'Das ist die Serie, die alle schauen.', es: 'Esa es la serie que ve todo el mundo.' },
            { de: 'Ich kenne einen Podcast, der wirklich gut ist.', es: 'Conozco un pódcast que está muy bien.' }
          ]
        },
        {
          key: 'nicht-nur-sondern-auch',
          regel: 'nicht nur … sondern auch',
          erklaerung: 'Sirve para sumar dos cosas dándoles importancia a las dos: Ich schaue NICHT NUR Serien, SONDERN AUCH Dokus. Ojo: sondern solo se usa después de una negación; si no hay negación, va aber.',
          beispiele: [
            { de: 'Ich schaue nicht nur Serien, sondern auch Dokus.', es: 'No solo veo series, sino también documentales.' },
            { de: 'Das Buch ist nicht langweilig, sondern richtig spannend.', es: 'El libro no es aburrido, sino muy interesante.' }
          ]
        },
        {
          key: 'zu-infinitiv-medien',
          regel: 'aufhören zu, anfangen zu',
          erklaerung: 'Estos verbos piden un segundo verbo con zu, y ese se va al final: Ich habe AUFGEHÖRT, abends fernZUsehen. Con verbos separables el zu se mete DENTRO, entre el prefijo y el verbo: fernzusehen, anzurufen.',
          beispiele: [
            { de: 'Ich habe aufgehört, abends fernzusehen.', es: 'He dejado de ver la tele por la noche.' },
            { de: 'Er hat angefangen, Podcasts auf Deutsch zu hören.', es: 'Ha empezado a escuchar pódcast en alemán.' }
          ]
        },
        {
          key: 'aussprache-diphthonge',
          regel: 'Aussprache: ei, ie, eu, äu, au',
          erklaerung: 'Cinco parejas de vocales que hay que separar bien. ei suena «ái» (nein). ie es una i larga (Liebe). eu y äu suenan «óy» (heute, Häuser). au suena «au» (Haus). Confundir ei con ie cambia la palabra entera.',
          beispiele: [
            { de: 'Heute Abend bleibe ich zu Hause.', es: 'Esta noche me quedo en casa.' },
            { de: 'Diese Serie schaue ich lieber allein.', es: 'Esta serie prefiero verla solo.' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'über den Feierabend sprechen',
          es: 'Hablar del descanso tras el trabajo',
          wendungen: [
            { de: 'Was machst du nach der Arbeit meistens?', es: '¿Qué sueles hacer después del trabajo?' }
          ]
        },
        {
          funktion: 'jemanden überreden und animieren',
          es: 'Convencer y animar a alguien',
          wendungen: [
            { de: 'Jetzt komm mit, das wird sicher lustig!', es: '¡Vente ya, seguro que es divertido!' }
          ]
        },
        {
          funktion: 'etwas versprechen',
          es: 'Hacer una promesa',
          wendungen: [
            { de: 'Ich verspreche dir, morgen stehe ich früh auf.', es: 'Te prometo que mañana me levanto temprano.' }
          ]
        },
        {
          funktion: 'auf ein Versprechen reagieren',
          es: 'Reaccionar a una promesa',
          wendungen: [
            { de: 'Ich schaue nur eine Folge, versprochen.', es: 'Solo veo un episodio, prometido.' }
          ]
        },
        {
          funktion: 'eine eigene Meinung äußern',
          es: 'Expresar una opinión propia',
          wendungen: [
            { de: 'Meiner Meinung nach ist die Serie überbewertet.', es: 'En mi opinión, la serie está sobrevalorada.' }
          ]
        },
        {
          funktion: 'die Meinung anderer wiedergeben',
          es: 'Transmitir la opinión de otros',
          wendungen: [
            { de: 'Was hältst du von dem Interview?', es: '¿Qué te parece la entrevista?' }
          ]
        },
        {
          funktion: 'sich über Fernsehserien und Medien austauschen',
          es: 'Hablar de series y consumo de medios',
          wendungen: [
            { de: 'Welche Serie schaust du im Moment?', es: '¿Qué serie estás viendo ahora?' }
          ]
        },
        {
          funktion: 'über Informationsquellen und Handyzeit sprechen',
          es: 'Hablar de fuentes de información y uso del móvil',
          wendungen: [
            { de: 'Wo informierst du dich über Nachrichten?', es: '¿Dónde te informas de las noticias?' }
          ]
        }
      ]
    },

    // ==================== LEKTION 7 ====================
    {
      id: 'a21-l7',
      legacyId: 'l7',
      nr: 7,
      name: 'Der Umzug',
      woerter: [
        {
          thema: 'Umzug und Renovierung: Tätigkeiten',
          items: [
            { de: 'umziehen', es: 'mudarse', ex: 'Nächsten Monat ziehen wir nach Graz um.', exEs: 'El mes que viene nos mudamos a Graz.' },
            { de: 'packen / auspacken', es: 'empaquetar / desempaquetar', ex: 'Die Bücher packe ich als Letztes aus.', exEs: 'Los libros los desempaqueto al final.' },
            { de: 'tragen', es: 'llevar, cargar', ex: 'Das Sofa können wir nicht zu zweit tragen.', exEs: 'El sofá no podemos cargarlo entre dos.' },
            { de: 'aufbauen / abbauen', es: 'montar / desmontar', ex: 'Das Bett haben wir in zwei Stunden aufgebaut.', exEs: 'La cama la montamos en dos horas.' },
            { de: 'streichen', es: 'pintar (paredes)', ex: 'Das Wohnzimmer streichen wir hellgrau.', exEs: 'El salón lo pintamos de gris claro.' },
            { de: 'renovieren', es: 'reformar', ex: 'Die Küche renovieren wir erst im Sommer.', exEs: 'La cocina no la reformamos hasta el verano.' },
            { de: 'bohren', es: 'taladrar', ex: 'Warte, ich muss noch ein Loch bohren.', exEs: 'Espera, todavía tengo que hacer un agujero.' },
            { de: 'montieren', es: 'montar', ex: 'Die Lampe montiere ich morgen.', exEs: 'La lámpara la monto mañana.' },
            { de: 'aufräumen', es: 'ordenar', ex: 'Räum bitte dein Zimmer auf!', exEs: '¡Ordena tu cuarto, por favor!' },
            { de: 'putzen', es: 'limpiar', ex: 'Samstags putze ich die ganze Wohnung.', exEs: 'Los sábados limpio todo el piso.' },
            { de: 'einrichten', es: 'amueblar, decorar', ex: 'Die Wohnung haben wir ganz neu eingerichtet.', exEs: 'El piso lo hemos amueblado de cero.' },
            { de: 'reparieren', es: 'reparar', ex: 'Kannst du den Wasserhahn reparieren?', exEs: '¿Puedes arreglar el grifo?' },
            { de: 'aufhängen', es: 'colgar', ex: 'Das Bild hängen wir über das Sofa.', exEs: 'El cuadro lo colgamos encima del sofá.' },
            { de: 'rauf / runter', es: 'arriba / abajo (moviéndose)', ex: 'Die Kartons müssen noch rauf in den zweiten Stock.', exEs: 'Las cajas todavía tienen que subir al segundo.' }
          ]
        },
        {
          thema: 'Umzug und Renovierung: Dinge',
          items: [
            { de: 'der Karton / die Schachtel (AT)', es: 'la caja', ex: 'In diesem Karton ist das Geschirr.', exEs: 'En esta caja está la vajilla.' },
            { de: 'das Klebeband', es: 'la cinta adhesiva', ex: 'Gib mir bitte das Klebeband.', exEs: 'Pásame la cinta adhesiva, por favor.' },
            { de: 'der Pinsel', es: 'la brocha', ex: 'Den Pinsel musst du danach gut auswaschen.', exEs: 'La brocha hay que lavarla bien después.' },
            { de: 'die Farbe, -n', es: 'la pintura', ex: 'Die Farbe reicht für zwei Wände.', exEs: 'La pintura da para dos paredes.' },
            { de: 'die Bohrmaschine, -n', es: 'el taladro', ex: 'Die Bohrmaschine habe ich mir vom Nachbarn geliehen.', exEs: 'El taladro se lo pedí prestado al vecino.' },
            { de: 'der Hammer, ¨-', es: 'el martillo', ex: 'Der Hammer liegt in der Küche.', exEs: 'El martillo está en la cocina.' },
            { de: 'der Schraubenzieher', es: 'el destornillador', ex: 'Für diese Schraube brauche ich einen kleineren Schraubenzieher.', exEs: 'Para este tornillo necesito un destornillador más pequeño.' },
            { de: 'die Schraube, -n', es: 'el tornillo', ex: 'Eine Schraube fehlt noch.', exEs: 'Todavía falta un tornillo.' },
            { de: 'der Nagel, ¨-', es: 'el clavo', ex: 'Schlag den Nagel nicht zu tief ein.', exEs: 'No claves el clavo demasiado hondo.' },
            { de: 'die Leiter, -n', es: 'la escalera de mano', ex: 'Halt mir bitte die Leiter fest.', exEs: 'Sujétame la escalera, por favor.' },
            { de: 'das Werkzeug', es: 'la herramienta', ex: 'Mein Werkzeug liegt alles im Keller.', exEs: 'Todas mis herramientas están en el sótano.' }
          ]
        },
        {
          thema: 'Wohnen und Mieten',
          items: [
            { de: 'der Mieter / die Mieterin', es: 'el inquilino / la inquilina', ex: 'Der neue Mieter zieht am Ersten ein.', exEs: 'El nuevo inquilino entra el día uno.' },
            { de: 'der Vermieter / die Vermieterin', es: 'el casero / la casera', ex: 'Der Vermieter wohnt im selben Haus.', exEs: 'El casero vive en el mismo edificio.' },
            { de: 'der Mietvertrag, ¨-e', es: 'el contrato de alquiler', ex: 'Der Mietvertrag läuft drei Jahre.', exEs: 'El contrato de alquiler dura tres años.' },
            { de: 'die Miete', es: 'el alquiler', ex: 'Die Miete zahle ich immer am Monatsanfang.', exEs: 'El alquiler lo pago siempre a principios de mes.' },
            { de: 'die Kaution', es: 'la fianza', ex: 'Die Kaution sind drei Monatsmieten.', exEs: 'La fianza son tres mensualidades.' },
            { de: 'die Übergabe', es: 'la entrega de llaves', ex: 'Die Übergabe der Schlüssel ist am Freitag.', exEs: 'La entrega de llaves es el viernes.' },
            { de: 'kündigen', es: 'rescindir', ex: 'Ich muss drei Monate vorher kündigen.', exEs: 'Tengo que avisar tres meses antes.' },
            { de: 'der Nachbar / die Nachbarin', es: 'el vecino / la vecina', ex: 'Meine Nachbarin gießt die Pflanzen, wenn ich weg bin.', exEs: 'Mi vecina riega las plantas cuando no estoy.' },
            { de: 'die Hausordnung', es: 'las normas de la comunidad', ex: 'Laut Hausordnung ist ab zweiundzwanzig Uhr Ruhe.', exEs: 'Según las normas, a partir de las diez hay que guardar silencio.' },
            { de: 'die Betriebskosten (Pl.)', es: 'los gastos comunes', ex: 'Die Betriebskosten kommen noch zur Miete dazu.', exEs: 'Los gastos comunes se suman al alquiler.' }
          ]
        },
        {
          thema: 'Einrichtungs- und Gebrauchsgegenstände',
          items: [
            { de: 'das Regal, -e', es: 'la estantería', ex: 'Das Regal ist zu klein für alle Bücher.', exEs: 'La estantería es demasiado pequeña para todos los libros.' },
            { de: 'die Kommode, -n', es: 'la cómoda', ex: 'In der Kommode liegen die Pullover.', exEs: 'En la cómoda están los jerséis.' },
            { de: 'der Vorhang, ¨-e', es: 'la cortina', ex: 'Mach bitte den Vorhang zu, die Sonne blendet.', exEs: 'Cierra la cortina, que el sol deslumbra.' },
            { de: 'das Kissen', es: 'el cojín', ex: 'Auf dem Sofa liegen zu viele Kissen.', exEs: 'En el sofá hay demasiados cojines.' },
            { de: 'die Decke, -n', es: 'la manta', ex: 'Im Winter brauche ich eine dickere Decke.', exEs: 'En invierno necesito una manta más gruesa.' },
            { de: 'der Teppich, -e', es: 'la alfombra', ex: 'Der Teppich passt gut zum Sofa.', exEs: 'La alfombra pega bien con el sofá.' },
            { de: 'der Spiegel', es: 'el espejo', ex: 'Im Flur hängt ein großer Spiegel.', exEs: 'En el pasillo hay un espejo grande.' },
            { de: 'die Lampe, -n', es: 'la lámpara', ex: 'Die Lampe über dem Tisch ist zu dunkel.', exEs: 'La lámpara de encima de la mesa da poca luz.' },
            { de: 'der Wäschekorb', es: 'el cesto de la ropa', ex: 'Der Wäschekorb ist schon wieder voll.', exEs: 'El cesto de la ropa está lleno otra vez.' },
            { de: 'der Mülleimer', es: 'el cubo de basura', ex: 'Bringst du den Mülleimer runter?', exEs: '¿Bajas el cubo de la basura?' },
            { de: 'die Steckdose, -n', es: 'el enchufe', ex: 'Neben dem Bett fehlt eine Steckdose.', exEs: 'Al lado de la cama falta un enchufe.' },
            { de: 'das Bild, -er', es: 'el cuadro', ex: 'Das Bild hat meine Schwester gemalt.', exEs: 'El cuadro lo pintó mi hermana.' }
          ]
        },
        {
          thema: 'Umzug & Renovieren',
          items: [
            { de: 'der Umzugswagen', es: 'la furgoneta de mudanza', ex: 'Den Umzugswagen haben wir für Samstag gemietet.', exEs: 'La furgoneta de mudanza la hemos alquilado para el sábado.' },
            { de: 'die Kiste', es: 'la caja', ex: 'In dieser Kiste sind nur Bücher.', exEs: 'En esta caja solo hay libros.' },
            { de: 'beschriften', es: 'rotular, etiquetar', ex: 'Bitte beschrifte jede Kiste.', exEs: 'Rotula cada caja, por favor.' },
            { de: 'die Glühbirne', es: 'la bombilla', ex: 'Die Glühbirne im Flur ist durchgebrannt.', exEs: 'Se ha fundido la bombilla del pasillo.' },
            { de: 'die Wand', es: 'la pared', ex: 'Die Wand muss noch gestrichen werden.', exEs: 'La pared todavía hay que pintarla.' },
            { de: 'der Boden', es: 'el suelo', ex: 'Der Boden ist ganz neu verlegt worden.', exEs: 'El suelo se ha puesto completamente nuevo.' },
            { de: 'die Fliese', es: 'el azulejo', ex: 'Im Bad fehlt eine Fliese.', exEs: 'En el baño falta un azulejo.' },
            { de: 'der Staub', es: 'el polvo', ex: 'Nach dem Bohren ist überall Staub.', exEs: 'Después de taladrar hay polvo por todas partes.' },
            { de: 'der Müll', es: 'la basura', ex: 'Den Müll bringe ich gleich runter.', exEs: 'La basura la bajo ahora.' },
            { de: 'entsorgen', es: 'deshacerse de', ex: 'Die alten Möbel müssen wir entsorgen.', exEs: 'Los muebles viejos tenemos que tirarlos.' },
            { de: 'ausmisten', es: 'despejar, tirar cosas', ex: 'Vor dem Umzug misten wir gründlich aus.', exEs: 'Antes de la mudanza despejamos a fondo.' },
            { de: 'sperrig', es: 'voluminoso', ex: 'Das Sofa ist zu sperrig für den Lift.', exEs: 'El sofá es demasiado voluminoso para el ascensor.' },
            { de: 'die Handwerker', es: 'los operarios', ex: 'Die Handwerker kommen schon um sieben.', exEs: 'Los operarios vienen ya a las siete.' },
            { de: 'der Kostenvoranschlag', es: 'el presupuesto', ex: 'Der Kostenvoranschlag ist mir zu hoch.', exEs: 'El presupuesto me parece demasiado alto.' },
            { de: 'ummelden', es: 'cambiar el empadronamiento', ex: 'Die Adresse muss man innerhalb von drei Tagen ummelden.', exEs: 'La dirección hay que cambiarla en tres días.' },
            { de: 'schleppen', es: 'cargar, acarrear', ex: 'Wir schleppen seit sechs Uhr Kisten.', exEs: 'Llevamos cargando cajas desde las seis.' }
          ]
        },
        {
          thema: 'Packen & Übergabe',
          items: [
            { de: 'die Luftpolsterfolie', es: 'el plástico de burbujas', ex: 'Die Gläser wickle ich in Luftpolsterfolie.', exEs: 'Los vasos los envuelvo en plástico de burbujas.' },
            { de: 'zerbrechlich', es: 'frágil', ex: 'Auf dieser Kiste steht zerbrechlich.', exEs: 'En esta caja pone frágil.' },
            { de: 'die Möbel', es: 'los muebles', ex: 'Die Möbel kommen erst am Montag.', exEs: 'Los muebles no llegan hasta el lunes.' },
            { de: 'der Sperrmüll', es: 'los trastos voluminosos', ex: 'Den alten Schrank stellen wir zum Sperrmüll.', exEs: 'El armario viejo lo dejamos con los trastos.' },
            { de: 'der Mistplatz', es: 'el punto limpio', ex: 'Zum Mistplatz fahren wir am Samstag.', exEs: 'Al punto limpio vamos el sábado.' },
            { de: 'die Endreinigung', es: 'la limpieza final', ex: 'Die Endreinigung machen wir lieber selbst.', exEs: 'La limpieza final preferimos hacerla nosotros.' },
            { de: 'der Zählerstand', es: 'la lectura del contador', ex: 'Den Zählerstand notieren wir bei der Übergabe.', exEs: 'La lectura del contador la anotamos en la entrega.' },
            { de: 'der Stromanbieter', es: 'la compañía eléctrica', ex: 'Der Stromanbieter muss rechtzeitig Bescheid wissen.', exEs: 'La compañía eléctrica tiene que saberlo a tiempo.' },
            { de: 'der Nachsendeauftrag', es: 'el reenvío postal', ex: 'Ohne Nachsendeauftrag geht Post verloren.', exEs: 'Sin reenvío postal se pierde correo.' },
            { de: 'die Ordnung', es: 'el orden', ex: 'Nach drei Tagen kam endlich Ordnung ins Chaos.', exEs: 'A los tres días por fin llegó el orden al caos.' },
            { de: 'das Chaos', es: 'el caos', ex: 'In der Küche herrscht totales Chaos.', exEs: 'En la cocina reina el caos total.' },
            { de: 'der Stauraum', es: 'el espacio de almacenaje', ex: 'Im neuen Bad gibt es kaum Stauraum.', exEs: 'En el baño nuevo casi no hay espacio de almacenaje.' },
            { de: 'praktisch', es: 'práctico', ex: 'Diese Lösung ist wirklich sehr praktisch.', exEs: 'Esta solución es realmente muy práctica.' },
            { de: 'provisorisch', es: 'provisional', ex: 'Das Regal steht nur provisorisch hier.', exEs: 'La estantería está aquí solo provisionalmente.' },
            { de: 'anschließen', es: 'conectar', ex: 'Die Waschmaschine muss noch angeschlossen werden.', exEs: 'La lavadora todavía hay que conectarla.' },
            { de: 'einräumen', es: 'colocar, ordenar dentro', ex: 'Die Küche räumen wir morgen ein.', exEs: 'La cocina la colocamos mañana.' },
            { de: 'wegwerfen', es: 'tirar', ex: 'Die Hälfte davon werfe ich einfach weg.', exEs: 'La mitad de eso lo tiro sin más.' },
            { de: 'das Möbelstück', es: 'el mueble', ex: 'Dieses Möbelstück ist zu schwer für uns.', exEs: 'Este mueble es demasiado pesado para nosotros.' },
            { de: 'der Aufwand', es: 'el esfuerzo', ex: 'Der Aufwand war größer als gedacht.', exEs: 'El esfuerzo fue mayor de lo previsto.' }
          ]
        },
        {
          thema: 'Werkzeug & Mietwechsel',
          items: [
            { de: 'die Umzugsfirma', es: 'la empresa de mudanzas', ex: 'Die Umzugsfirma kostet achthundert Euro.', exEs: 'La empresa de mudanzas cuesta ochocientos euros.' },
            { de: 'der Möbelpacker', es: 'el mozo de mudanzas', ex: 'Ein Möbelpacker trägt den Schrank allein.', exEs: 'Un mozo de mudanzas lleva el armario solo.' },
            { de: 'der Lieferwagen', es: 'la furgoneta de reparto', ex: 'Der Lieferwagen passt nicht in die Einfahrt.', exEs: 'La furgoneta no cabe en la entrada.' },
            { de: 'die Einfahrt', es: 'la entrada de vehículos', ex: 'Die Einfahrt muss immer frei bleiben.', exEs: 'La entrada tiene que quedar siempre libre.' },
            { de: 'der Dübel', es: 'el taco', ex: 'Ohne Dübel hält die Schraube nicht.', exEs: 'Sin taco el tornillo no aguanta.' },
            { de: 'die Wasserwaage', es: 'el nivel de burbuja', ex: 'Mit der Wasserwaage hängt das Bild gerade.', exEs: 'Con el nivel el cuadro queda recto.' },
            { de: 'der Zollstock', es: 'el metro plegable', ex: 'Den Zollstock brauche ich für die Maße.', exEs: 'El metro lo necesito para las medidas.' },
            { de: 'das Maß', es: 'la medida', ex: 'Nimm bitte ganz genau Maß.', exEs: 'Toma la medida con precisión, por favor.' },
            { de: 'die Farbrolle', es: 'el rodillo de pintura', ex: 'Mit der Farbrolle geht es viel schneller.', exEs: 'Con el rodillo va mucho más rápido.' },
            { de: 'die Abdeckfolie', es: 'el plástico protector', ex: 'Die Abdeckfolie schützt den neuen Boden.', exEs: 'El plástico protege el suelo nuevo.' },
            { de: 'der Schutzhandschuh', es: 'el guante de protección', ex: 'Ohne Schutzhandschuh wird die Hand schwarz.', exEs: 'Sin guante la mano se pone negra.' },
            { de: 'der Werkzeugkasten', es: 'la caja de herramientas', ex: 'Der Werkzeugkasten steht unten im Keller.', exEs: 'La caja de herramientas está abajo en el sótano.' },
            { de: 'die Steckdosenleiste', es: 'la regleta', ex: 'Eine Steckdosenleiste brauchen wir hinter dem Schreibtisch.', exEs: 'Necesitamos una regleta detrás del escritorio.' },
            { de: 'die Renovierung', es: 'la reforma', ex: 'Die Renovierung dauert etwa drei Wochen.', exEs: 'La reforma dura unas tres semanas.' },
            { de: 'der Vormieter', es: 'el inquilino anterior', ex: 'Der Vormieter hat alles sauber hinterlassen.', exEs: 'El inquilino anterior lo dejó todo limpio.' },
            { de: 'der Nachmieter', es: 'el inquilino siguiente', ex: 'Wir suchen noch einen Nachmieter.', exEs: 'Todavía buscamos un inquilino que nos sustituya.' },
            { de: 'die Rückzahlung', es: 'la devolución', ex: 'Die Rückzahlung der Kaution dauert Monate.', exEs: 'La devolución de la fianza tarda meses.' },
            { de: 'der Schlüsselbund', es: 'el llavero', ex: 'Der Schlüsselbund hat insgesamt sechs Schlüssel.', exEs: 'El llavero tiene seis llaves en total.' }
          ]
        },
        {
          thema: 'Helfen beim Tragen',
          items: [
            { de: 'hochheben', es: 'levantar', ex: 'Heb die Kiste bitte mit den Beinen hoch.', exEs: 'Levanta la caja con las piernas, por favor.' },
            { de: 'absetzen', es: 'dejar en el suelo', ex: 'Setz den Schrank kurz ab, ich muss verschnaufen.', exEs: 'Deja el armario un momento, necesito respirar.' },
            { de: 'festhalten', es: 'sujetar', ex: 'Halt den Tisch gut fest, ich gehe rückwärts.', exEs: 'Sujeta bien la mesa, yo voy hacia atrás.' },
            { de: 'anfassen', es: 'agarrar, tocar', ex: 'Fass unten an, oben ist es rutschig.', exEs: 'Agarra por abajo, arriba resbala.' },
            { de: 'Platz machen', es: 'hacer sitio', ex: 'Macht bitte kurz Platz im Stiegenhaus.', exEs: 'Haced sitio un momento en la escalera.' },
            { de: 'vorangehen', es: 'ir delante', ex: 'Geh vor und sag, wann die Stufe kommt.', exEs: 'Ve delante y avisa cuando llegue el escalón.' },
            { de: 'sich verheben', es: 'hacerse daño levantando peso', ex: 'Pass auf, dass du dich nicht verhebst.', exEs: 'Ten cuidado de no hacerte daño al levantar.' },
            { de: 'die Kante', es: 'el canto, la esquina', ex: 'Achtung, die Kante ist scharf.', exEs: 'Cuidado, el canto está afilado.' },
            { de: 'der Türrahmen', es: 'el marco de la puerta', ex: 'Der Schrank passt knapp durch den Türrahmen.', exEs: 'El armario pasa justo por el marco de la puerta.' },
            { de: 'die Treppe hinauf', es: 'escaleras arriba', ex: 'Vier Stockwerke die Treppe hinauf, ohne Lift.', exEs: 'Cuatro pisos escaleras arriba, sin ascensor.' }
          ]
        },
        {
          thema: 'Maße & Planung',
          items: [
            { de: 'die Breite', es: 'el ancho', ex: 'Die Breite passt, nur die Höhe stimmt nicht.', exEs: 'El ancho encaja, solo la altura no cuadra.' },
            { de: 'die Tiefe', es: 'el fondo', ex: 'Der Schrank hat sechzig Zentimeter Tiefe.', exEs: 'El armario tiene sesenta centímetros de fondo.' },
            { de: 'die Fläche', es: 'la superficie', ex: 'Die Fläche reicht für ein Bett und einen Schreibtisch.', exEs: 'La superficie da para una cama y un escritorio.' },
            { de: 'messen', es: 'medir', ex: 'Miss lieber zweimal, bevor du bohrst.', exEs: 'Mide dos veces antes de taladrar.' },
            { de: 'die Skizze', es: 'el croquis', ex: 'Ich mache eine Skizze von dem Zimmer.', exEs: 'Hago un croquis de la habitación.' },
            { de: 'der Abstand', es: 'la distancia, la separación', ex: 'Zwischen Bett und Wand bleibt kaum Abstand.', exEs: 'Entre la cama y la pared casi no queda separación.' },
            { de: 'die Mitte', es: 'el centro', ex: 'Das Bild kommt genau in die Mitte.', exEs: 'El cuadro va justo en el centro.' },
            { de: 'gerade', es: 'recto, derecho', ex: 'Hängt das Regal gerade oder nicht?', exEs: '¿La estantería está recta o no?' },
            { de: 'schief', es: 'torcido', ex: 'Das Bild hängt eindeutig schief.', exEs: 'El cuadro está claramente torcido.' },
            { de: 'waagrecht', es: 'horizontal', ex: 'Mit der Wasserwaage wird es waagrecht.', exEs: 'Con el nivel queda horizontal.' }
          ]
        }
      ],
      pitfalls: [
        'Wechselpräpositionen: pregúntate Wohin? (movimiento → ACUSATIVO) o Wo? (posición → DATIVO). "Ich stelle die Lampe auf DEN Tisch" / "Die Lampe steht auf DEM Tisch".',
        'Los pares stellen/stehen, legen/liegen, hängen/hängen, setzen/sitzen: el primero es la ACCIÓN (regular, + acusativo), el segundo la POSICIÓN (irregular, + dativo).',
        'in + dem = im, in + das = ins, an + dem = am, an + das = ans.'
      ],
      grammatik: [
        {
          regel: 'Lokaladverbien: oben, unten, vorn, hinten',
          key: 'lokaladverbien',
          erklaerung: 'Indican POSICIÓN estática. Responden a Wo?',
          detail:
            'Son adverbios, así que no necesitan preposición ni artículo: dicen dónde está algo de forma general. Los más frecuentes: oben (arriba), unten (abajo), vorn(e) (delante), hinten (detrás), links (a la izquierda), rechts (a la derecha), drinnen (dentro), draußen (fuera), überall (por todas partes), nirgendwo (en ningún sitio).\n\nSe pueden combinar con "da" y "dort" para señalar: "da oben", "dort hinten".\n\nSi quieres precisar el lugar con un sustantivo, necesitas una preposición: "oben IM Keller", "hinten IM Bad".',
          tabelle: {
            title: 'Posición (Wo?)',
            headers: ['Adverbio', 'Español', 'Ejemplo'],
            rows: [
              ['oben / unten', 'arriba / abajo', 'Die Kartons sind oben.'],
              ['vorn(e) / hinten', 'delante / detrás', 'Der Wäschekorb steht hinten.'],
              ['links / rechts', 'izquierda / derecha', 'Das Regal steht links.'],
              ['drinnen / draußen', 'dentro / fuera', 'Die Farbe ist draußen.']
            ]
          },
          beispiele: [
            { de: 'Die Kartons stehen oben im Keller.', es: 'Las cajas están arriba en el sótano.' },
            { de: 'Der Wäschekorb ist hinten im Bad.', es: 'El cesto está al fondo del baño.' },
            { de: 'Das Werkzeug liegt da unten.', es: 'Las herramientas están ahí abajo.' }
          ]
        },
        {
          regel: 'Direktionaladverbien: rauf, runter, rein, raus, rüber',
          key: 'direktionaladverbien',
          erklaerung: 'Indican MOVIMIENTO. Son las formas coloquiales de hinauf, hinunter, hinein, hinaus, hinüber.',
          detail:
            'Mientras oben/unten dicen dónde está algo, rauf/runter dicen hacia dónde va. Son las versiones habladas y muy frecuentes en la vida diaria: rauf (hacia arriba), runter (hacia abajo), rein (hacia dentro), raus (hacia fuera), rüber (al otro lado).\n\nSe usan mucho con verbos separables: raufgehen, runterkommen, reinkommen, rausbringen, rübergehen. "Komm rein!" (¡Pasa!), "Bring bitte den Müll raus" (Saca la basura).\n\nEn lenguaje formal se escriben hinauf/herauf, hinunter/herunter, etc., donde hin- es alejarse del hablante y her- acercarse. En A2 basta con las formas cortas.',
          tabelle: {
            title: 'Posición vs. movimiento',
            headers: ['Wo? (posición)', 'Wohin? (movimiento)', 'Español'],
            rows: [
              ['oben', 'rauf', 'arriba / hacia arriba'],
              ['unten', 'runter', 'abajo / hacia abajo'],
              ['drinnen', 'rein', 'dentro / hacia dentro'],
              ['draußen', 'raus', 'fuera / hacia fuera'],
              ['drüben', 'rüber', 'al otro lado / hacia el otro lado']
            ]
          },
          beispiele: [
            { de: 'Trag die Schachtel bitte rauf!', es: '¡Sube la caja, por favor!' },
            { de: 'Komm rein, die Tür ist offen.', es: 'Pasa, la puerta está abierta.' },
            { de: 'Bringst du bitte den Müll raus?', es: '¿Sacas la basura, por favor?' }
          ]
        },
        {
          regel: 'Wiederholung: lokale Präpositionen',
          key: 'lokale-praep-wdh',
          erklaerung: 'Cada preposición de lugar rige un caso fijo: aus, bei, mit, nach, von, zu + Dativ.',
          detail:
            'Antes de las Wechselpräpositionen conviene tener claras las que llevan SIEMPRE dativo: aus (de, procedencia), bei (en casa de / en la empresa), mit (con), nach (a, con ciudades y países sin artículo), von (de, origen o posesión), zu (a, hacia personas y edificios), gegenüber (enfrente de).\n\nContracciones frecuentes: zu dem = zum, zu der = zur, von dem = vom, bei dem = beim.\n\n"nach" se usa con nombres propios de lugar sin artículo (nach Wien, nach Österreich) y "zu" con personas y edificios (zum Arzt, zur Post). Con países con artículo se usa "in": in die Schweiz, in die Türkei.',
          tabelle: {
            title: 'Preposiciones con dativo fijo',
            headers: ['Preposición', 'Uso', 'Ejemplo'],
            rows: [
              ['aus', 'procedencia', 'Ich komme aus Spanien.'],
              ['bei', 'en casa/empresa de', 'Ich wohne bei meiner Schwester.'],
              ['mit', 'compañía / medio', 'Ich fahre mit dem Bus.'],
              ['nach', 'destino sin artículo', 'Wir ziehen nach Graz.'],
              ['von', 'origen / posesión', 'Das ist der Schlüssel von der Wohnung.'],
              ['zu', 'destino con persona/edificio', 'Ich gehe zum Vermieter.']
            ]
          },
          beispiele: [
            { de: 'Wir ziehen nächsten Monat nach Graz.', es: 'El mes que viene nos mudamos a Graz.' },
            { de: 'Ich wohne vorübergehend bei meiner Schwester.', es: 'Vivo temporalmente en casa de mi hermana.' },
            { de: 'Der Schlüssel ist vom Vermieter.', es: 'La llave es del casero.' }
          ]
        },
        {
          regel: 'Wechselpräpositionen',
          key: 'wechselpraepositionen',
          erklaerung: 'Nueve preposiciones que rigen acusativo (Wohin? movimiento) o dativo (Wo? posición).',
          detail:
            'Son nueve: an, auf, hinter, in, neben, über, unter, vor, zwischen. A diferencia de las demás, NO tienen un caso fijo: depende de si hay desplazamiento hacia ese lugar o no.\n\nPregúntate siempre: ¿Wohin? (¿hacia dónde?) → ACUSATIVO. ¿Wo? (¿dónde?) → DATIVO.\n"Ich hänge das Bild an DIE Wand." (lo llevo hasta allí → Akk.)\n"Das Bild hängt an DER Wand." (ya está allí → Dat.)\n\nUn atajo práctico: mira el VERBO. Verbos de acción (stellen, legen, hängen, setzen, gehen, fahren, bringen) → acusativo. Verbos de estado (stehen, liegen, hängen, sitzen, sein, bleiben) → dativo.\n\nContracciones: in dem = im, in das = ins, an dem = am, an das = ans, auf das = aufs.',
          tabelle: {
            title: 'Las nueve Wechselpräpositionen',
            headers: ['Preposición', 'Español', 'Wohin? (Akk.)', 'Wo? (Dat.)'],
            rows: [
              ['an', 'a / en (contacto vertical)', 'an die Wand', 'an der Wand'],
              ['auf', 'sobre', 'auf den Tisch', 'auf dem Tisch'],
              ['in', 'en / dentro', 'in den Keller', 'im Keller'],
              ['hinter', 'detrás de', 'hinter das Sofa', 'hinter dem Sofa'],
              ['vor', 'delante de', 'vor die Tür', 'vor der Tür'],
              ['neben', 'al lado de', 'neben das Bett', 'neben dem Bett'],
              ['über', 'encima de', 'über den Tisch', 'über dem Tisch'],
              ['unter', 'debajo de', 'unter das Regal', 'unter dem Regal'],
              ['zwischen', 'entre', 'zwischen die Stühle', 'zwischen den Stühlen']
            ]
          },
          beispiele: [
            { de: 'Ich stelle die Lampe auf den Tisch. (Wohin?)', es: 'Pongo la lámpara sobre la mesa.' },
            { de: 'Die Lampe steht auf dem Tisch. (Wo?)', es: 'La lámpara está sobre la mesa.' },
            { de: 'Häng den Spiegel bitte an die Wand!', es: '¡Cuelga el espejo en la pared!' },
            { de: 'Die Kartons sind noch im Keller.', es: 'Las cajas todavía están en el sótano.' }
          ]
        },
        {
          regel: 'Verben mit Wechselpräpositionen',
          key: 'verben-wechselpraep',
          erklaerung: 'Pares acción/posición: stellen–stehen, legen–liegen, hängen–hängen, setzen–sitzen.',
          detail:
            'El alemán distingue entre poner algo en un sitio (acción, con acusativo) y estar en un sitio (posición, con dativo). Además elige el verbo según la forma del objeto:\n\nstellen / stehen → de pie, vertical (una botella, un libro en la estantería).\nlegen / liegen → tumbado, horizontal (un cojín, un papel).\nhängen / hängen → colgando (un cuadro, la ropa).\nsetzen / sitzen → sentado (una persona).\n\nLos de ACCIÓN son regulares (stellen, legen, setzen) y llevan acusativo. Los de POSICIÓN son irregulares (stand/gestanden, lag/gelegen, saß/gesessen) y llevan dativo. "hängen" existe en las dos versiones, con formas distintas en pasado: hängte (acción) / hing (posición).\n\nEn español todos se traducen por "poner" y "estar", por eso hay que fijarse en la forma del objeto.',
          tabelle: {
            title: 'Los cuatro pares',
            headers: ['Acción (+ Akk.)', 'Posición (+ Dat.)', 'Forma del objeto', 'Ejemplo'],
            rows: [
              ['stellen', 'stehen', 'de pie', 'Ich stelle das Glas auf den Tisch. → Es steht auf dem Tisch.'],
              ['legen', 'liegen', 'tumbado', 'Ich lege das Kissen aufs Sofa. → Es liegt auf dem Sofa.'],
              ['hängen (hängte)', 'hängen (hing)', 'colgando', 'Ich hänge das Bild an die Wand. → Es hängt an der Wand.'],
              ['setzen', 'sitzen', 'sentado', 'Ich setze mich auf den Stuhl. → Ich sitze auf dem Stuhl.']
            ]
          },
          beispiele: [
            { de: 'Ich lege das Kissen auf das Sofa.', es: 'Pongo el cojín en el sofá.' },
            { de: 'Das Kissen liegt auf dem Sofa.', es: 'El cojín está en el sofá.' },
            { de: 'Kannst du die Bücher ins Regal stellen?', es: '¿Puedes poner los libros en la estantería?' },
            { de: 'Die Bücher stehen schon im Regal.', es: 'Los libros ya están en la estantería.' }
          ]
        },
        {
          key: 'imperativ-beim-helfen',
          regel: 'Imperativ mit du und ihr',
          erklaerung: 'Ayudando en una mudanza se habla de tú, así que hace falta el imperativo de du: la raíz sola, sin -st y sin pronombre (Halt! Nimm! Geh!). Para varios, la forma de ihr: Haltet! Los separables sueltan el prefijo al final: Heb die Kiste HOCH.',
          beispiele: [
            { de: 'Halt den Tisch bitte gut fest!', es: '¡Sujeta bien la mesa!' },
            { de: 'Nehmt bitte die Kartons zuerst!', es: '¡Coged primero las cajas!' }
          ]
        },
        {
          key: 'wechselpraep-wo-wohin-wdh',
          regel: 'Wo oder wohin? Der Unterschied',
          erklaerung: 'La misma preposición, dos casos. Wohin? (movimiento) → ACUSATIVO: Ich hänge das Bild AN DIE Wand. Wo? (sitio) → DATIVO: Das Bild hängt AN DER Wand. Mudándose se usan las dos todo el rato.',
          beispiele: [
            { de: 'Ich hänge das Bild an die Wand.', es: 'Cuelgo el cuadro en la pared.' },
            { de: 'Das Bild hängt schon an der Wand.', es: 'El cuadro ya está colgado en la pared.' }
          ]
        },
        {
          key: 'lassen-etwas-machen-lassen',
          regel: 'etwas machen lassen',
          erklaerung: 'lassen + infinitivo significa que lo hace OTRO por ti: Ich LASSE die Küche einbauen (no la monto yo). Es lo que se dice con los profesionales de una mudanza o una reforma.',
          beispiele: [
            { de: 'Wir lassen die Wohnung streichen.', es: 'Vamos a hacer que nos pinten el piso.' },
            { de: 'Ich lasse den Boden von einer Firma verlegen.', es: 'El suelo me lo pone una empresa.' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'beim Umzug anpacken und organisieren',
          es: 'Colaborar y organizar la mudanza',
          wendungen: [
            { de: 'Kannst du mir am Samstag beim Umzug helfen?', es: '¿Me puedes ayudar el sábado con la mudanza?' }
          ]
        },
        {
          funktion: 'Vorschläge beim Umzug machen',
          es: 'Hacer propuestas durante la mudanza',
          wendungen: [
            { de: 'Fangen wir mit der Küche an?', es: '¿Empezamos por la cocina?' }
          ]
        },
        {
          funktion: 'zögernd zustimmen oder ablehnen',
          es: 'Aceptar o rechazar con reservas',
          wendungen: [
            { de: 'Stellen wir das Sofa erst mal quer in den Raum?', es: '¿Ponemos el sofá de momento atravesado en la sala?' }
          ]
        },
        {
          funktion: 'Aufträge und Aufgaben annehmen',
          es: 'Aceptar encargos y tareas',
          wendungen: [
            { de: 'Kannst du dich um den Wagen kümmern?', es: '¿Te puedes encargar de la furgoneta?' }
          ]
        },
        {
          funktion: 'um Vorsicht bitten',
          es: 'Pedir precaución',
          wendungen: [
            { de: 'Vorsicht, die Kiste ist sehr schwer!', es: '¡Cuidado, la caja pesa mucho!' }
          ]
        },
        {
          funktion: 'einen Raum einrichten und Möbel platzieren',
          es: 'Amueblar y colocar cosas en la habitación',
          wendungen: [
            { de: 'Das Sofa kommt an die Wand beim Fenster.', es: 'El sofá va a la pared de la ventana.' }
          ]
        },
        {
          funktion: 'Wichtigkeit und Prioritäten ausdrücken',
          es: 'Expresar importancia y prioridades',
          wendungen: [
            { de: 'Entscheidend ist, dass die Kinder ein Zimmer haben.', es: 'Lo decisivo es que los niños tengan una habitación.' }
          ]
        },
        {
          funktion: 'Umzugskartons und Details koordinieren',
          es: 'Coordinar cajas y detalles del traslado',
          wendungen: [
            { de: 'Nimmst du bitte das andere Ende?', es: '¿Coges el otro extremo, por favor?' }
          ]
        }
      ]
    },

    // ==================== LEKTION 8 ====================
    {
      id: 'a21-l8',
      legacyId: 'l8',
      nr: 8,
      name: 'Unterwegs',
      woerter: [
        {
          thema: 'mit dem Zug unterwegs',
          items: [
            { de: 'der Bahnhof, ¨-e', es: 'la estación', ex: 'Wir treffen uns um acht am Bahnhof.', exEs: 'Quedamos a las ocho en la estación.' },
            { de: 'der Bahnsteig, -e', es: 'el andén', ex: 'Der Zug fährt heute von einem anderen Bahnsteig.', exEs: 'Hoy el tren sale de otro andén.' },
            { de: 'das Gleis, -e', es: 'la vía', ex: 'Der Zug nach Salzburg fährt auf Gleis drei.', exEs: 'El tren a Salzburgo sale por la vía tres.' },
            { de: 'der Fahrplan, ¨-e', es: 'el horario', ex: 'Im Fahrplan steht, dass er stündlich fährt.', exEs: 'En el horario pone que sale cada hora.' },
            { de: 'die Verbindung, -en', es: 'la conexión', ex: 'Es gibt eine Verbindung ohne Umsteigen.', exEs: 'Hay una conexión sin transbordos.' },
            { de: 'die Fahrkarte, -n', es: 'el billete', ex: 'Die Fahrkarte kaufe ich am Automaten.', exEs: 'El billete lo compro en la máquina.' },
            { de: 'umsteigen', es: 'hacer transbordo', ex: 'In Linz müssen wir umsteigen.', exEs: 'En Linz tenemos que hacer transbordo.' },
            { de: 'einsteigen / aussteigen', es: 'subir / bajar', ex: 'Steig bitte vorne ein.', exEs: 'Sube por delante, por favor.' },
            { de: 'die Verspätung, -en', es: 'el retraso', ex: 'Der Zug hat zwanzig Minuten Verspätung.', exEs: 'El tren lleva veinte minutos de retraso.' },
            { de: 'der Schaffner / die Schaffnerin', es: 'el revisor / la revisora', ex: 'Der Schaffner kommt gleich und kontrolliert die Karten.', exEs: 'El revisor viene enseguida a controlar los billetes.' },
            { de: 'der Sitzplatz, ¨-e', es: 'el asiento', ex: 'Ich habe einen Sitzplatz am Fenster.', exEs: 'Tengo un asiento junto a la ventanilla.' },
            { de: 'reservieren', es: 'reservar', ex: 'Ich habe für acht Uhr einen Tisch reserviert.', exEs: 'He reservado mesa para las ocho.' },
            { de: 'die Hin- und Rückfahrt', es: 'la ida y vuelta', ex: 'Die Hin- und Rückfahrt kostet zusammen weniger.', exEs: 'La ida y vuelta juntas salen más baratas.' },
            { de: 'der Speisewagen', es: 'el vagón restaurante', ex: 'Im Speisewagen gibt es warmes Essen.', exEs: 'En el vagón restaurante hay comida caliente.' },
            { de: 'die Abfahrt / die Ankunft', es: 'la salida / la llegada', ex: 'Die Abfahrt ist um zehn nach sechs.', exEs: 'La salida es a las seis y diez.' }
          ]
        },
        {
          thema: 'in der Stadt',
          items: [
            { de: 'die Innenstadt', es: 'el centro', ex: 'In der Innenstadt darf man kaum parken.', exEs: 'En el centro casi no se puede aparcar.' },
            { de: 'die Sehenswürdigkeit, -en', es: 'el lugar de interés', ex: 'An einem Tag schafft man nicht alle Sehenswürdigkeiten.', exEs: 'En un día no da tiempo a ver todos los monumentos.' },
            { de: 'der Stadtplan, ¨-e', es: 'el plano de la ciudad', ex: 'Den Stadtplan gibt es gratis im Hotel.', exEs: 'El plano de la ciudad lo dan gratis en el hotel.' },
            { de: 'die Fußgängerzone', es: 'la zona peatonal', ex: 'In der Fußgängerzone sind viele Cafés.', exEs: 'En la zona peatonal hay muchas cafeterías.' },
            { de: 'das Denkmal, ¨-er', es: 'el monumento', ex: 'Vor dem Denkmal machen alle Fotos.', exEs: 'Delante del monumento todo el mundo hace fotos.' },
            { de: 'die Brücke, -n', es: 'el puente', ex: 'Über die Brücke sind es nur fünf Minuten.', exEs: 'Cruzando el puente son solo cinco minutos.' },
            { de: 'der Platz, ¨-e', es: 'la plaza', ex: 'Auf dem Platz ist samstags Markt.', exEs: 'En la plaza hay mercado los sábados.' },
            { de: 'die Führung, -en', es: 'la visita guiada', ex: 'Die Führung dauert anderthalb Stunden.', exEs: 'La visita guiada dura hora y media.' },
            { de: 'die Ampel, -n', es: 'el semáforo', ex: 'Bei der Ampel gehst du nach rechts.', exEs: 'En el semáforo giras a la derecha.' },
            { de: 'die Kreuzung, -en', es: 'el cruce', ex: 'An der nächsten Kreuzung links.', exEs: 'En el siguiente cruce a la izquierda.' },
            { de: 'die Ecke, -n', es: 'la esquina', ex: 'Die Apotheke ist gleich um die Ecke.', exEs: 'La farmacia está a la vuelta de la esquina.' },
            { de: 'geradeaus', es: 'todo recto', ex: 'Gehen Sie immer geradeaus bis zur Kirche.', exEs: 'Siga todo recto hasta la iglesia.' }
          ]
        },
        {
          thema: 'Unterkunft / im Hotel',
          items: [
            { de: 'die Rezeption', es: 'la recepción', ex: 'An der Rezeption bekommen Sie den Schlüssel.', exEs: 'En recepción le dan la llave.' },
            { de: 'das Einzelzimmer', es: 'la habitación individual', ex: 'Ich hätte gern ein Einzelzimmer für zwei Nächte.', exEs: 'Querría una habitación individual para dos noches.' },
            { de: 'das Doppelzimmer', es: 'la habitación doble', ex: 'Das Doppelzimmer hat einen Balkon.', exEs: 'La habitación doble tiene balcón.' },
            { de: 'die Übernachtung, -en', es: 'la noche (alojamiento)', ex: 'Die Übernachtung kostet achtzig Euro.', exEs: 'La noche cuesta ochenta euros.' },
            { de: 'Frühstück inklusive', es: 'desayuno incluido', ex: 'Der Preis ist Frühstück inklusive.', exEs: 'El precio es con desayuno incluido.' },
            { de: 'die Zimmerkarte', es: 'la tarjeta de la habitación', ex: 'Mit der Zimmerkarte geht auch der Aufzug.', exEs: 'Con la tarjeta de la habitación funciona también el ascensor.' },
            { de: 'einchecken / auschecken', es: 'hacer el check-in / check-out', ex: 'Einchecken kann man ab vierzehn Uhr.', exEs: 'Se puede hacer el check-in a partir de las dos.' },
            { de: 'die Buchung, -en', es: 'la reserva', ex: 'Die Buchung habe ich per E-Mail bestätigt.', exEs: 'La reserva la confirmé por correo.' },
            { de: 'die Halbpension', es: 'la media pensión', ex: 'Wir haben Halbpension gebucht.', exEs: 'Hemos reservado media pensión.' },
            { de: 'der Aufenthalt', es: 'la estancia', ex: 'Ich wünsche Ihnen einen angenehmen Aufenthalt.', exEs: 'Le deseo una estancia agradable.' }
          ]
        },
        {
          thema: 'Unterwegs mit dem Zug',
          items: [
            { de: 'die Fahrkarte entwerten', es: 'validar el billete', ex: 'Vergiss nicht, die Fahrkarte zu entwerten.', exEs: 'No olvides validar el billete.' },
            { de: 'der Anschluss', es: 'el enlace', ex: 'In Linz habe ich nur acht Minuten Anschluss.', exEs: 'En Linz tengo solo ocho minutos de enlace.' },
            { de: 'der Sitzplatz', es: 'el asiento', ex: 'Ich habe einen Sitzplatz am Fenster reserviert.', exEs: 'He reservado un asiento de ventanilla.' },
            { de: 'das Gepäck', es: 'el equipaje', ex: 'Das Gepäck kommt über uns ins Fach.', exEs: 'El equipaje va arriba en el maletero.' }
          ]
        },
        {
          thema: 'Bahn & Hotel',
          items: [
            { de: 'der Nachtzug', es: 'el tren nocturno', ex: 'Der Nachtzug fährt um zweiundzwanzig Uhr.', exEs: 'El tren nocturno sale a las diez.' },
            { de: 'der Waggon', es: 'el vagón', ex: 'Unser Waggon ist ganz hinten.', exEs: 'Nuestro vagón está al fondo del todo.' },
            { de: 'das Abteil', es: 'el compartimento', ex: 'Im Abteil war es sehr warm.', exEs: 'En el compartimento hacía mucho calor.' },
            { de: 'die Rückfahrkarte', es: 'el billete de vuelta', ex: 'Eine Rückfahrkarte ist deutlich günstiger.', exEs: 'Un billete de ida y vuelta sale bastante más barato.' },
            { de: 'der Zuschlag', es: 'el suplemento', ex: 'Für den Schnellzug zahlt man einen Zuschlag.', exEs: 'Por el tren rápido se paga un suplemento.' },
            { de: 'die Ermäßigung', es: 'el descuento', ex: 'Mit dem Ausweis gibt es eine Ermäßigung.', exEs: 'Con el documento hay descuento.' },
            { de: 'der Koffer', es: 'la maleta', ex: 'Mein Koffer ist eindeutig zu schwer.', exEs: 'Mi maleta pesa claramente demasiado.' },
            { de: 'das Handgepäck', es: 'el equipaje de mano', ex: 'Das Handgepäck bleibt bei mir.', exEs: 'El equipaje de mano se queda conmigo.' },
            { de: 'der Zimmerschlüssel', es: 'la llave de la habitación', ex: 'Den Zimmerschlüssel gebe ich an der Rezeption ab.', exEs: 'La llave de la habitación la dejo en recepción.' },
            { de: 'das Handtuch', es: 'la toalla', ex: 'Im Bad fehlt ein Handtuch.', exEs: 'En el baño falta una toalla.' },
            { de: 'der Empfang', es: 'la recepción', ex: 'Am Empfang bekommt man einen Stadtplan.', exEs: 'En recepción dan un plano de la ciudad.' },
            { de: 'die Anreise', es: 'el viaje de ida', ex: 'Die Anreise war ziemlich anstrengend.', exEs: 'El viaje de ida fue bastante cansado.' },
            { de: 'die Abreise', es: 'la salida', ex: 'Die Abreise ist am Sonntagmorgen.', exEs: 'La salida es el domingo por la mañana.' },
            { de: 'der Stadtrundgang', es: 'la visita guiada a pie', ex: 'Der Stadtrundgang dauert zwei Stunden.', exEs: 'La visita guiada a pie dura dos horas.' },
            { de: 'der Eintritt', es: 'la entrada', ex: 'Der Eintritt kostet zwölf Euro.', exEs: 'La entrada cuesta doce euros.' },
            { de: 'besichtigen', es: 'visitar', ex: 'Wir wollen morgen den Dom besichtigen.', exEs: 'Mañana queremos visitar la catedral.' },
            { de: 'die Wegbeschreibung', es: 'las indicaciones', ex: 'Ich schicke dir eine Wegbeschreibung.', exEs: 'Te mando unas indicaciones.' },
            { de: 'erreichbar', es: 'accesible', ex: 'Das Hotel ist zu Fuß gut erreichbar.', exEs: 'El hotel se llega bien a pie.' },
            { de: 'das Schließfach', es: 'la taquilla', ex: 'Das Gepäck lasse ich im Schließfach.', exEs: 'El equipaje lo dejo en la taquilla.' },
            { de: 'die Ankunftszeit', es: 'la hora de llegada', ex: 'Die Ankunftszeit steht auf dem Ticket.', exEs: 'La hora de llegada está en el billete.' }
          ]
        },
        {
          thema: 'Bahnhof & Unterkunft',
          items: [
            { de: 'der Reisende', es: 'el viajero', ex: 'Jeder Reisende braucht einen gültigen Ausweis.', exEs: 'Todo viajero necesita un documento válido.' },
            { de: 'die Durchsage', es: 'el aviso por megafonía', ex: 'Die Durchsage habe ich nicht verstanden.', exEs: 'El aviso no lo he entendido.' },
            { de: 'die Anzeigetafel', es: 'el panel informativo', ex: 'Auf der Anzeigetafel steht Gleis sieben.', exEs: 'En el panel pone vía siete.' },
            { de: 'die Sitzplatzreservierung', es: 'la reserva de asiento', ex: 'Die Sitzplatzreservierung kostet fünf Euro.', exEs: 'La reserva de asiento cuesta cinco euros.' },
            { de: 'der Ruhebereich', es: 'la zona de silencio', ex: 'Im Ruhebereich darf man nicht telefonieren.', exEs: 'En la zona de silencio no se puede hablar por teléfono.' },
            { de: 'die Entschädigung', es: 'la indemnización', ex: 'Bei großer Verspätung gibt es eine Entschädigung.', exEs: 'Con mucho retraso hay una indemnización.' },
            { de: 'der Ersatzbus', es: 'el autobús sustitutivo', ex: 'Wegen der Bauarbeiten fährt ein Ersatzbus.', exEs: 'Por las obras funciona un autobús sustitutivo.' },
            { de: 'das Frühstücksbuffet', es: 'el bufé de desayuno', ex: 'Das Frühstücksbuffet ist bis zehn Uhr offen.', exEs: 'El bufé de desayuno está abierto hasta las diez.' },
            { de: 'der Aufpreis', es: 'el suplemento', ex: 'Ein Zimmer mit Balkon kostet Aufpreis.', exEs: 'Una habitación con balcón lleva suplemento.' },
            { de: 'die Stornierung', es: 'la cancelación', ex: 'Die Stornierung ist bis achtundvierzig Stunden vorher gratis.', exEs: 'La cancelación es gratis hasta cuarenta y ocho horas antes.' },
            { de: 'die Ortstaxe', es: 'la tasa turística', ex: 'Die Ortstaxe zahlt man an der Rezeption.', exEs: 'La tasa turística se paga en recepción.' },
            { de: 'der Safe', es: 'la caja fuerte', ex: 'Den Pass lasse ich immer im Safe.', exEs: 'El pasaporte lo dejo siempre en la caja fuerte.' },
            { de: 'der Fön', es: 'el secador', ex: 'Im Bad gibt es zum Glück einen Fön.', exEs: 'Por suerte en el baño hay un secador.' },
            { de: 'das Nichtraucherzimmer', es: 'la habitación de no fumadores', ex: 'Wir hätten gern ein Nichtraucherzimmer.', exEs: 'Quisiéramos una habitación de no fumadores.' },
            { de: 'der Aufenthaltsraum', es: 'la sala común', ex: 'Im Aufenthaltsraum gibt es Spiele und Bücher.', exEs: 'En la sala común hay juegos y libros.' },
            { de: 'der Gepäckwagen', es: 'el carrito de equipaje', ex: 'Einen Gepäckwagen findet man selten frei.', exEs: 'Un carrito de equipaje libre pocas veces se encuentra.' },
            { de: 'der Eintrittspreis', es: 'el precio de la entrada', ex: 'Der Eintrittspreis ist für Kinder niedriger.', exEs: 'El precio de la entrada es menor para niños.' },
            { de: 'der Souvenirladen', es: 'la tienda de recuerdos', ex: 'Im Souvenirladen ist alles überteuert.', exEs: 'En la tienda de recuerdos todo está carísimo.' },
            { de: 'der Fußweg', es: 'el camino a pie', ex: 'Der Fußweg zum Hotel dauert acht Minuten.', exEs: 'El camino a pie al hotel dura ocho minutos.' },
            { de: 'inklusive', es: 'incluido', ex: 'Das Frühstück ist beim Zimmerpreis inklusive.', exEs: 'El desayuno está incluido en el precio.' }
          ]
        },
        {
          thema: 'Zugreise & Hotel',
          items: [
            { de: 'die Fahrplanauskunft', es: 'la información de horarios', ex: 'Die Fahrplanauskunft ist rund um die Uhr offen.', exEs: 'La información de horarios está abierta todo el día.' },
            { de: 'der Lokführer', es: 'el maquinista', ex: 'Der Lokführer hat gerade eine Durchsage gemacht.', exEs: 'El maquinista acaba de dar un aviso.' },
            { de: 'der Wartesaal', es: 'la sala de espera', ex: 'Im Wartesaal ist es wenigstens warm.', exEs: 'En la sala de espera al menos hace calor.' },
            { de: 'der Kiosk', es: 'el quiosco', ex: 'Am Kiosk gibt es Kaffee und Zeitungen.', exEs: 'En el quiosco hay café y periódicos.' },
            { de: 'das Fundbüro', es: 'la oficina de objetos perdidos', ex: 'Frag im Fundbüro nach deinem Schal.', exEs: 'Pregunta por tu bufanda en objetos perdidos.' },
            { de: 'die Umsteigezeit', es: 'el tiempo de transbordo', ex: 'Acht Minuten Umsteigezeit sind ziemlich knapp.', exEs: 'Ocho minutos de transbordo es muy justo.' },
            { de: 'der Regionalzug', es: 'el tren regional', ex: 'Der Regionalzug hält wirklich überall.', exEs: 'El tren regional para en todas partes.' },
            { de: 'der Schnellzug', es: 'el tren rápido', ex: 'Mit dem Schnellzug sind es nur zwei Stunden.', exEs: 'Con el tren rápido son solo dos horas.' },
            { de: 'die Reisegruppe', es: 'el grupo de viaje', ex: 'Eine Reisegruppe blockiert den ganzen Gang.', exEs: 'Un grupo de viaje bloquea todo el pasillo.' },
            { de: 'die Pension', es: 'la pensión', ex: 'Die Pension ist deutlich billiger als das Hotel.', exEs: 'La pensión es bastante más barata que el hotel.' },
            { de: 'das Gästezimmer', es: 'la habitación de huéspedes', ex: 'Wir haben ein kleines Gästezimmer für dich.', exEs: 'Tenemos una habitación de huéspedes para ti.' },
            { de: 'die Vollpension', es: 'la pensión completa', ex: 'Mit Vollpension zahlt man zwanzig Euro mehr.', exEs: 'Con pensión completa se pagan veinte euros más.' },
            { de: 'die Zimmernummer', es: 'el número de habitación', ex: 'Die Zimmernummer steht auf der Karte.', exEs: 'El número de habitación está en la tarjeta.' },
            { de: 'das Doppelbett', es: 'la cama de matrimonio', ex: 'Im Zimmer steht ein großes Doppelbett.', exEs: 'En la habitación hay una cama de matrimonio grande.' },
            { de: 'die Bettwäsche', es: 'la ropa de cama', ex: 'Die Bettwäsche wird zweimal pro Woche gewechselt.', exEs: 'La ropa de cama se cambia dos veces por semana.' },
            { de: 'das Zimmermädchen', es: 'la camarera de piso', ex: 'Das Zimmermädchen kommt immer um zehn.', exEs: 'La camarera de piso viene siempre a las diez.' },
            { de: 'die Anzahlung', es: 'el anticipo', ex: 'Eine Anzahlung von dreißig Prozent ist üblich.', exEs: 'Un anticipo del treinta por ciento es lo habitual.' },
            { de: 'die Reisezeit', es: 'la duración del viaje', ex: 'Die Reisezeit beträgt knapp vier Stunden.', exEs: 'La duración del viaje es de casi cuatro horas.' },
            { de: 'das Souvenir', es: 'el recuerdo', ex: 'Als Souvenir kaufe ich immer eine Postkarte.', exEs: 'Como recuerdo compro siempre una postal.' },
            { de: 'die Postkarte', es: 'la postal', ex: 'Die Postkarte schicke ich meiner Oma.', exEs: 'La postal se la mando a mi abuela.' }
          ]
        },
        {
          thema: 'Am Flughafen',
          items: [
            { de: 'der Flughafen', es: 'el aeropuerto', ex: 'Zum Flughafen fährt man am besten mit dem Zug.', exEs: 'Al aeropuerto se va mejor en tren.' },
            { de: 'das Flugzeug', es: 'el avión', ex: 'Das Flugzeug hat eine Stunde Verspätung.', exEs: 'El avión lleva una hora de retraso.' },
            { de: 'der Check-in', es: 'la facturación', ex: 'Der Check-in schließt vierzig Minuten vorher.', exEs: 'La facturación cierra cuarenta minutos antes.' },
            { de: 'das Gate', es: 'la puerta de embarque', ex: 'Unser Gate hat sich schon wieder geändert.', exEs: 'Nuestra puerta de embarque ha cambiado otra vez.' },
            { de: 'der Abflug', es: 'la salida del vuelo', ex: 'Der Abflug ist um Viertel nach sechs.', exEs: 'La salida es a las seis y cuarto.' },
            { de: 'die Landung', es: 'el aterrizaje', ex: 'Die Landung war ruhig, trotz des Windes.', exEs: 'El aterrizaje fue tranquilo, pese al viento.' },
            { de: 'die Gepäckausgabe', es: 'la recogida de equipajes', ex: 'Die Koffer kommen bei Band drei zur Gepäckausgabe.', exEs: 'Las maletas salen por la cinta tres.' },
            { de: 'der Fensterplatz', es: 'el asiento de ventanilla', ex: 'Ich nehme immer einen Fensterplatz.', exEs: 'Siempre cojo asiento de ventanilla.' },
            { de: 'der Gangplatz', es: 'el asiento de pasillo', ex: 'Auf langen Flügen ist ein Gangplatz praktischer.', exEs: 'En vuelos largos el asiento de pasillo es más práctico.' },
            { de: 'die Bordkarte', es: 'la tarjeta de embarque', ex: 'Die Bordkarte habe ich am Handy.', exEs: 'La tarjeta de embarque la llevo en el móvil.' }
          ]
        },
        {
          thema: 'Wenn etwas schiefgeht',
          items: [
            { de: 'ausfallen', es: 'cancelarse', ex: 'Der Zug um acht fällt heute aus.', exEs: 'El tren de las ocho hoy se cancela.' },
            { de: 'umbuchen', es: 'cambiar la reserva', ex: 'Ich habe auf den nächsten Tag umgebucht.', exEs: 'He cambiado la reserva al día siguiente.' },
            { de: 'die Rückerstattung', es: 'el reembolso', ex: 'Für die Verspätung gibt es eine Rückerstattung.', exEs: 'Por el retraso hay un reembolso.' },
            { de: 'der Ersatz', es: 'el sustituto, la alternativa', ex: 'Als Ersatz fährt ein Bus bis Linz.', exEs: 'Como alternativa hay un autobús hasta Linz.' },
            { de: 'streiken', es: 'ir a la huelga', ex: 'Am Montag streiken die Lokführer.', exEs: 'El lunes hacen huelga los maquinistas.' },
            { de: 'der Streik', es: 'la huelga', ex: 'Wegen des Streiks bleibe ich zu Hause.', exEs: 'Por la huelga me quedo en casa.' },
            { de: 'die Reklamation', es: 'la reclamación', ex: 'Die Reklamation kann man online einreichen.', exEs: 'La reclamación se puede presentar por internet.' },
            { de: 'sich gedulden', es: 'tener paciencia, esperar', ex: 'Bitte gedulden Sie sich noch zehn Minuten.', exEs: 'Tenga paciencia diez minutos más, por favor.' },
            { de: 'der Schadenersatz', es: 'la indemnización', ex: 'Ab einer Stunde Verspätung gibt es Schadenersatz.', exEs: 'A partir de una hora de retraso hay indemnización.' }
          ]
        }
      ],
      pitfalls: [
        '"entlang" va DETRÁS del sustantivo: "die Straße entlang", no "entlang die Straße".',
        'Konjunktiv II con "würde" también forma Satzklammer: "Ich WÜRDE gern einen Platz RESERVIEREN" (infinitivo al final).',
        'Con sein y haben no se usa "würde": se dice "Ich wäre…" y "Ich hätte…", no "Ich würde sein/haben".'
      ],
      grammatik: [
        {
          regel: 'Konjunktiv II: wäre, hätte, würde',
          key: 'konjunktiv2-waere-haette-wuerde',
          erklaerung: 'Formas de cortesía e hipótesis: ich wäre, ich hätte, ich würde.',
          detail:
            'El Konjunktiv II sirve para dos cosas en A2: pedir con cortesía y hablar de situaciones irreales o deseadas.\n\nLa mayoría de los verbos lo forman con "würde + infinitivo". Pero sein, haben y los modales tienen forma propia y NO se usan con würde: wäre (sein), hätte (haben), könnte (können), müsste (müssen), sollte (sollen), dürfte (dürfen).\n\nEn la recepción de un hotel o en una tienda, el Konjunktiv II es lo que suena educado: "Hätten Sie noch ein Zimmer frei?" en lugar del más seco "Haben Sie…?". "Ich hätte gern…" es la fórmula estándar para pedir.\n\nFíjate en los Umlaut: war → wäre, hatte → hätte, konnte → könnte. Es la marca del Konjunktiv II.',
          tabelle: {
            title: 'Konjunktiv II',
            headers: ['Persona', 'sein → wäre', 'haben → hätte', 'werden → würde'],
            rows: [
              ['ich', 'wäre', 'hätte', 'würde'],
              ['du', 'wärst', 'hättest', 'würdest'],
              ['er / sie / es', 'wäre', 'hätte', 'würde'],
              ['wir', 'wären', 'hätten', 'würden'],
              ['ihr', 'wärt', 'hättet', 'würdet'],
              ['sie / Sie', 'wären', 'hätten', 'würden']
            ]
          },
          beispiele: [
            { de: 'Hätten Sie noch ein Doppelzimmer frei?', es: '¿Le quedaría una habitación doble libre?' },
            { de: 'Das wäre super!', es: '¡Eso sería genial!' },
            { de: 'Ich hätte gern ein Zimmer mit Frühstück.', es: 'Quisiera una habitación con desayuno.' },
            { de: 'Könnten Sie mir bitte helfen?', es: '¿Podría ayudarme, por favor?' }
          ],
          mehr: {
            title: 'Cortés vs. directo',
            examples: [
              { de: 'Haben Sie ein Zimmer? → Hätten Sie ein Zimmer?', es: '¿Tiene habitación? → ¿Tendría habitación?' },
              { de: 'Können Sie mir helfen? → Könnten Sie mir helfen?', es: '¿Puede ayudarme? → ¿Podría ayudarme?' }
            ]
          }
        },
        {
          regel: 'Wiederholung: Satzklammer mit würd-',
          key: 'satzklammer-wuerd',
          erklaerung: '"würde" en 2ª posición y el infinitivo AL FINAL de la frase.',
          detail:
            '"würde + infinitivo" funciona igual que un verbo modal: el conjugado ocupa la 2ª posición y el infinitivo cierra la frase. Todo lo demás queda "abrazado" en medio: "Ich WÜRDE gern einen Platz am Fenster RESERVIEREN."\n\nEn preguntas, "würde" va en 1ª posición: "WÜRDEN Sie mir bitte den Weg ZEIGEN?"\n\nY en subordinada, el conjugado se va al final, detrás del infinitivo: "…, dass ich gern mitfahren würde."\n\nRecuerda que con sein y haben no se usa würde: "Ich wäre gern dabei", no "Ich würde gern dabei sein" (aunque esta última se oye, la primera es la buena).',
          tabelle: {
            title: 'Posición del verbo',
            headers: ['Tipo de frase', 'Estructura', 'Ejemplo'],
            rows: [
              ['Afirmativa', 'würde (2ª) … infinitivo (final)', 'Ich würde gern reservieren.'],
              ['Pregunta', 'würde (1ª) … infinitivo (final)', 'Würden Sie mir helfen?'],
              ['Subordinada', '… infinitivo + würde (final)', '…, dass ich gern kommen würde.']
            ]
          },
          beispiele: [
            { de: 'Ich würde gern einen Sitzplatz reservieren.', es: 'Me gustaría reservar un asiento.' },
            { de: 'Würden Sie mir bitte den Weg zeigen?', es: '¿Me indicaría el camino, por favor?' },
            { de: 'Wir würden lieber mit dem Zug fahren.', es: 'Preferiríamos ir en tren.' }
          ]
        },
        {
          regel: 'lokale Präpositionen durch, entlang + Akkusativ',
          key: 'durch-entlang',
          erklaerung: '"durch" = a través de (va delante). "entlang" = a lo largo de (va DETRÁS del sustantivo).',
          detail:
            'Las dos rigen acusativo y sirven para describir un recorrido, pero se colocan de forma distinta.\n\n"durch" se antepone, como cualquier preposición normal: "durch den Park", "durch die Stadt", "durch den Tunnel". Indica atravesar algo.\n\n"entlang" es especial: cuando indica movimiento a lo largo de algo, va DETRÁS del sustantivo en acusativo: "die Straße entlang", "den Fluss entlang". Es una postposición. Decir "entlang die Straße" es un error típico.\n\nAmbas aparecen constantemente al dar indicaciones: "Gehen Sie durch den Park und dann die Hauptstraße entlang."',
          tabelle: {
            title: 'Recorrido (+ Akkusativ)',
            headers: ['Preposición', 'Posición', 'Ejemplo', 'Español'],
            rows: [
              ['durch', 'delante', 'durch den Park', 'por / a través del parque'],
              ['entlang', 'DETRÁS', 'die Straße entlang', 'a lo largo de la calle'],
              ['um … herum', 'alrededor', 'um den Platz herum', 'alrededor de la plaza'],
              ['über', 'delante', 'über die Brücke', 'por encima del puente']
            ]
          },
          beispiele: [
            { de: 'Gehen Sie durch den Park, dann sehen Sie das Hotel.', es: 'Vaya por el parque y verá el hotel.' },
            { de: 'Gehen Sie die Straße entlang bis zur Ampel.', es: 'Siga la calle hasta el semáforo.' },
            { de: 'Wir sind über die Brücke gegangen.', es: 'Cruzamos el puente.' }
          ]
        },
        {
          regel: 'lokale Präpositionen gegenüber, bis zu, an … vorbei + Dativ',
          key: 'gegenueber-biszu',
          erklaerung: '"gegenüber" = enfrente de, "bis zu" = hasta, "an … vorbei" = pasando por delante de. Con dativo.',
          detail:
            'Este trío completa el vocabulario para dar indicaciones, y las tres van con dativo.\n\n"gegenüber + Dativ" = enfrente de. Puede ir delante o detrás del sustantivo: "gegenüber dem Bahnhof" o "dem Bahnhof gegenüber". Con pronombre va siempre detrás: "mir gegenüber".\n\n"bis zu + Dativ" = hasta. "bis" solo no lleva artículo (bis Wien), pero con artículo necesita "zu": bis ZUR Ampel, bis ZUM Bahnhof.\n\n"an … vorbei + Dativ" = pasando por delante de. Es un marco: la preposición "an" abre y "vorbei" cierra detrás del sustantivo: "an der Kirche vorbei".',
          tabelle: {
            title: 'Indicaciones (+ Dativ)',
            headers: ['Estructura', 'Español', 'Ejemplo'],
            rows: [
              ['gegenüber + Dat.', 'enfrente de', 'gegenüber dem Bahnhof'],
              ['bis zu + Dat.', 'hasta', 'bis zur Ampel'],
              ['an … vorbei', 'pasando por delante de', 'an der Kirche vorbei'],
              ['neben + Dat.', 'al lado de', 'neben der Apotheke']
            ]
          },
          beispiele: [
            { de: 'Das Hotel ist gegenüber dem Bahnhof.', es: 'El hotel está enfrente de la estación.' },
            { de: 'Gehen Sie bis zur Ampel und dann links.', es: 'Vaya hasta el semáforo y luego a la izquierda.' },
            { de: 'Fahren Sie an der Kirche vorbei.', es: 'Pase por delante de la iglesia.' }
          ]
        },
        {
          key: 'indirekte-frage-hoeflich-reisen',
          regel: 'Höflich fragen: Können Sie mir sagen, …?',
          erklaerung: 'En una estación o un hotel se pregunta en dos pisos: Können Sie mir sagen, WANN der Zug FÄHRT? El verbo de la segunda parte se va al final, porque es una subordinada. Suena mucho mejor que la pregunta directa.',
          beispiele: [
            { de: 'Können Sie mir sagen, wann der Zug fährt?', es: '¿Me puede decir cuándo sale el tren?' },
            { de: 'Wissen Sie, ob das Frühstück inklusive ist?', es: '¿Sabe si el desayuno está incluido?' }
          ]
        },
        {
          key: 'praeposition-mit-verkehrsmittel',
          regel: 'mit + Verkehrsmittel',
          erklaerung: 'El medio de transporte va con mit + dativo: MIT DEM Zug, MIT DER Bahn, MIT DEM Auto. La única excepción es andando: zu Fuß, sin mit y sin artículo.',
          beispiele: [
            { de: 'Ich fahre mit dem Zug nach Salzburg.', es: 'Voy a Salzburgo en tren.' },
            { de: 'Zum Bahnhof gehe ich zu Fuß.', es: 'A la estación voy andando.' }
          ]
        },
        {
          key: 'wenn-dann-reise',
          regel: 'Wenn …, dann …',
          erklaerung: 'Si la frase empieza por wenn, la segunda parte puede arrancar con dann, y el verbo va detrás: WENN der Zug ausfällt, DANN NEHMEN wir den Bus. El dann no es obligatorio, pero ayuda a ver dónde empieza la otra parte.',
          beispiele: [
            { de: 'Wenn der Zug ausfällt, dann nehmen wir den Bus.', es: 'Si el tren se cancela, cogemos el autobús.' },
            { de: 'Wenn wir früh ankommen, dann gehen wir noch essen.', es: 'Si llegamos pronto, vamos a comer algo.' }
          ]
        },
        {
          key: 'konjunktiv-ii-beschwerde',
          regel: 'Sich beschweren mit Konjunktiv II',
          erklaerung: 'Para quejarse sin pelearse: Ich hätte gern…, Könnten Sie…?, Ich würde gern…, Wäre es möglich…? En un hotel o una estación esto consigue mucho más que exigir.',
          beispiele: [
            { de: 'Ich hätte gern ein ruhigeres Zimmer.', es: 'Querría una habitación más tranquila.' },
            { de: 'Wäre es möglich, später auszuchecken?', es: '¿Sería posible hacer el check-out más tarde?' }
          ]
        }
      ],
      kommunikation: [
        {
          funktion: 'sich nach dem Fahrplan erkundigen',
          es: 'Consultar horarios de transporte',
          wendungen: [
            { de: 'Wann fährt der nächste Zug nach Salzburg?', es: '¿Cuándo sale el próximo tren a Salzburgo?' }
          ]
        },
        {
          funktion: 'Zugauskunft und Anschlüsse klären',
          es: 'Aclarar detalles del tren y conexiones',
          wendungen: [
            { de: 'Was stand gerade in der Durchsage?', es: '¿Qué acaba de decir la megafonía?' }
          ]
        },
        {
          funktion: 'höflich um Hilfe bitten',
          es: 'Pedir ayuda con cortesía',
          wendungen: [
            { de: 'Könnten Sie mir bitte mit dem Koffer helfen?', es: '¿Me podría ayudar con la maleta, por favor?' }
          ]
        },
        {
          funktion: 'auf höfliche Bitten reagieren',
          es: 'Responder a peticiones educadas',
          wendungen: [
            { de: 'Wären Sie so freundlich, mir zu helfen?', es: '¿Sería tan amable de ayudarme?' }
          ]
        },
        {
          funktion: 'nach freien Plätzen fragen',
          es: 'Preguntar por asientos libres',
          wendungen: [
            { de: 'Entschuldigung, ist der Platz noch frei?', es: 'Perdone, ¿está libre este asiento?' }
          ]
        },
        {
          funktion: 'gute Wünsche aussprechen',
          es: 'Expresar buenos deseos de viaje',
          wendungen: [
            { de: 'Gute Reise! · Gute Fahrt!', es: '¡Buen viaje!' }
          ]
        },
        {
          funktion: 'den Weg in der Stadt beschreiben',
          es: 'Describir el camino en la ciudad',
          wendungen: [
            { de: 'Komme ich zu Fuß zur Innenstadt?', es: '¿Llego al centro a pie?' }
          ]
        },
        {
          funktion: 'an der Hotelrezeption ein- und auschecken',
          es: 'Registrarse y pagar en la recepción del hotel',
          wendungen: [
            { de: 'Ich habe ein Doppelzimmer auf den Namen Pascual reserviert.', es: 'Tengo una habitación doble reservada a nombre de Pascual.' }
          ]
        }
      ]
    }
  ]
};
