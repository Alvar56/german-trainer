import React, { useState } from 'react';
import { pick } from '../lib/i18n.js';
import { SIN_IA } from '../lib/modo.js';
import Desplegable from './Desplegable.jsx';

// Lo que la app hace y no cuenta en ninguna parte.
//
// Hay bastantes reglas metidas por dentro —de dónde sale cada porcentaje, qué
// pinta los colores del vocabulario, cuándo se gasta un congelador— que solo
// se sabían leyendo el código. Y los atajos de teclado, que no se ven por
// ningún lado: un atajo que no se anuncia no lo usa nadie.
//
// Va en Ajustes porque es donde se viene a mirar cómo funciona algo, y va
// plegado porque es para consultarlo una vez, no para leerlo cada día.
//
// Los textos van con pick() y no por el diccionario: son párrafos de ayuda,
// uno solo en toda la app, y así el castellano y el inglés se ven juntos y no
// se queda uno sin traducir sin que nadie se entere.

function Bloque({ titulo, children }) {
  const [abierto, setAbierto] = useState(false);
  return (
    <div className={'card cf-bloque' + (abierto ? ' abierta' : '')}>
      <button className="komm-head" onClick={() => setAbierto((x) => !x)}>
        <span className="lk-block-title" style={{ margin: 0 }}>{titulo}</span>
        <span className="komm-cuenta">{abierto ? '▴' : '▾'}</span>
      </button>
      <Desplegable abierto={abierto}>
        <div className="cf-cuerpo">{children}</div>
      </Desplegable>
    </div>
  );
}

// Una tecla, pintada como tecla.
function K({ children }) {
  return <kbd className="cf-tecla">{children}</kbd>;
}

export default function ComoFunciona() {
  return (
    <div className="panel">
      <h2>{pick('Cómo funciona', 'How it works')}</h2>
      <p className="muted" style={{ fontSize: '0.9rem', marginBottom: 14 }}>
        {pick(
          'Las reglas que la app aplica por dentro y no dice en ninguna parte.',
          'The rules the app applies under the hood and never tells you about.'
        )}
      </p>

      <div className="stack" style={{ gap: 10 }}>
        {/* Los atajos solo tienen sentido con teclado. En el móvil el bloque
            entero se esconde por css, que enseñar teclas a quien no las tiene
            es ruido. */}
        <div className="cf-solo-teclado">
          <Bloque titulo={pick('⌨ Atajos de teclado', '⌨ Keyboard shortcuts')}>
            <p>
              {pick(
                'En los ejercicios no hace falta el ratón. Los números salen pintados en los propios botones.',
                'You do not need the mouse in the exercises. The numbers are printed on the buttons themselves.'
              )}
            </p>
            <table className="cf-tabla">
              <tbody>
                <tr>
                  <td>{pick('Tests (gramática, vocabulario y Blitz)', 'Quizzes (grammar, vocabulary and Blitz)')}</td>
                  <td><K>1</K>–<K>5</K> {pick('eligen la opción', 'pick the option')}</td>
                </tr>
                <tr>
                  <td>{pick('Juego der / die / das', 'der / die / das game')}</td>
                  <td>
                    <K>1</K> <K>2</K> <K>3</K> = der, die, das · <K>P</K>{' '}
                    {pick('pide la pista', 'asks for the hint')}
                  </td>
                </tr>
                <tr>
                  <td>Kasus Trainer</td>
                  <td>
                    <K>1</K>–<K>4</K> {pick('artículos ·', 'articles ·')}{' '}
                    <K>P</K> {pick('pista ·', 'hint ·')}{' '}
                    <K>G</K> {pick('género ·', 'gender ·')}{' '}
                    <K>K</K> {pick('caso ·', 'case ·')}{' '}
                    <K>T</K> {pick('ver tabla', 'show table')}
                  </td>
                </tr>
                <tr>
                  <td>{pick('Tarjetas', 'Flashcards')}</td>
                  <td>
                    <K>{pick('espacio', 'space')}</K> {pick('gira la tarjeta', 'flips the card')} ·{' '}
                    <K>1</K> {pick('no la sabía', 'did not know it')} · <K>2</K>{' '}
                    {pick('sí', 'knew it')}
                  </td>
                </tr>
                <tr>
                  <td>{pick('Ahorcado', 'Hangman')}</td>
                  <td>
                    {pick('Escribe la letra directamente ·', 'Type the letter directly ·')}{' '}
                    <K>1</K> <K>2</K> <K>3</K> {pick('pistas (traducción, inicial, vocal)', 'hints (meaning, initial, vowel)')}
                  </td>
                </tr>
                <tr>
                  <td>{pick('Ordenar frases', 'Sentence order')}</td>
                  <td>
                    <K>Ctrl</K> {pick('enfoca una palabra y', 'focuses a word and')}{' '}
                    <K>←</K> <K>→</K> {pick('la mueven de sitio ·', 'move it along ·')}{' '}
                    <K>Enter</K> {pick('comprueba', 'checks')}
                  </td>
                </tr>
                <tr>
                  <td>{pick('Emparejar', 'Match')}</td>
                  <td>
                    <K>1</K>–<K>6</K> {pick('columna alemana ·', 'German column ·')}{' '}
                    <K>Q</K> <K>W</K> <K>E</K> <K>R</K> <K>T</K> <K>Y</K> {pick('tu idioma ·', 'your language ·')}{' '}
                    <K>P</K> {pick('pista', 'hint')}
                  </td>
                </tr>
                <tr>
                  <td>Wortsalat</td>
                  <td>
                    <K>1</K>–<K>9</K> {pick('mueven fichas de letras ·', 'move letter tiles ·')}{' '}
                    <K>P</K> {pick('pista de letra', 'letter hint')}
                  </td>
                </tr>
                <tr>
                  <td>{pick('Escribir, huecos y traducir frases', 'Type it, gap-fill and translating')}</td>
                  <td>
                    <K>Enter</K> {pick('comprueba ·', 'checks ·')}{' '}
                    <K>P</K> {pick('pide pista progresiva', 'asks for progressive hint')}
                  </td>
                </tr>
                <tr>
                  <td>{pick('Después de contestar', 'After answering')}</td>
                  <td>
                    <K>Enter</K> {pick('o', 'or')} <K>{pick('espacio', 'space')}</K>{' '}
                    {pick('pasan sin esperar', 'move on without waiting')}
                  </td>
                </tr>
                <tr>
                  <td>{pick('Salir y cerrar ventanas', 'Exit and close windows')}</td>
                  <td>
                    <K>Esc</K> {pick('sale del juego, de la tienda o cierra tablas y modales', 'exits game, shop or closes tables and modals')}
                  </td>
                </tr>
              </tbody>
            </table>
            <p className="muted">
              {pick(
                'Mientras escribes en un campo de texto los atajos se apartan: ahí la tecla es del campo.',
                'While you are typing in a text field the shortcuts step aside: there the key belongs to the field.'
              )}
            </p>
          </Bloque>
        </div>

        <Bloque titulo={pick('🎮 Los ejercicios y juegos', '🎮 Exercises and games')}>
          <p>
            {pick(
              'Organizados en tres grandes áreas. El número en negrita indica las monedas (🪙) que otorga cada acierto según su dificultad y exigencia:',
              'Organized into three main areas. The bold number indicates the coins (🪙) awarded for each correct answer based on difficulty:'
            )}
          </p>

          <h3 style={{ margin: '14px 0 6px', fontSize: '0.95rem', color: 'var(--accent)' }}>📖 Grammatik</h3>
          <table className="cf-tabla cf-tabla-juegos">
            <tbody>
              <tr>
                <td>🧭 Kasus Trainer <b>1–2</b></td>
                <td>{pick('El artículo dentro de la frase según el caso (Nominativ, Akkusativ, Dativ). Con pistas de género, caso y tabla.', 'The article inside the sentence according to case (Nominativ, Akkusativ, Dativ). With gender, case, and table hints.')}</td>
              </tr>
              <tr>
                <td>✅ {pick('Test', 'Quiz')} <b>1</b></td>
                <td>{pick('Elegir la opción correcta entre cuatro para aplicar la regla gramatical.', 'Pick the correct option among four to apply the grammar rule.')}</td>
              </tr>
              <tr>
                <td>⌨ {pick('Escribir', 'Type it')} <b>1–4</b></td>
                <td>{pick('Completar el hueco de la frase escribiendo la palabra de memoria, con pistas de letras.', 'Fill in the sentence blank by typing the word from memory, with letter hints.')}</td>
              </tr>
              <tr>
                <td>🔀 {pick('Ordenar frases', 'Sentence order')} <b>2</b></td>
                <td>{pick('Ordenar los bloques de palabras para construir la frase con la sintaxis correcta (posición del verbo).', 'Order the word tiles into proper German syntax and verb placement.')}</td>
              </tr>
              <tr>
                <td>⚖ {pick('¿Correcto o no?', 'Correct or not?')} <b>1</b></td>
                <td>{pick('Detectar si la frase alemana mostrada es correcta o contiene algún fallo gramatical.', 'Judge whether the given German sentence is correct or has a grammatical mistake.')}</td>
              </tr>
              <tr>
                <td>🧩 {pick('Emparejar', 'Match')} <b>1</b></td>
                <td>{pick('Unir seis frases de la lección con su solución gramatical contrarreloj.', 'Match six lesson sentences with their grammatical solution against the clock.')}</td>
              </tr>
              <tr>
                <td>⚡ Blitz <b>1</b></td>
                <td>{pick('Cuarenta segundos para resolver y acertar todas las frases gramaticales posibles.', 'Forty seconds to solve as many grammar sentences as you can.')}</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ margin: '18px 0 6px', fontSize: '0.95rem', color: 'var(--accent)' }}>📗 Wortschatz</h3>
          <table className="cf-tabla cf-tabla-juegos">
            <tbody>
              <tr>
                <td>🎯 {pick('Juego der / die / das', 'der / die / das game')} <b>1–2</b></td>
                <td>{pick('Identificar el artículo determinado de cada sustantivo, con pistas de reglas y terminaciones.', 'Identify the definite article for each noun, with rule and ending hints.')}</td>
              </tr>
              <tr>
                <td>✅ {pick('Test', 'Quiz')} <b>1</b></td>
                <td>{pick('Elegir la traducción correcta entre cuatro opciones.', 'Pick the correct translation among four options.')}</td>
              </tr>
              <tr>
                <td>⌨ {pick('Escribir', 'Type it')} <b>1–4</b></td>
                <td>{pick('Teclear la palabra alemana completa de memoria, con pistas de letras si las necesitas.', 'Type the full German word from memory, with letter hints if needed.')}</td>
              </tr>
              <tr>
                <td>🧩 {pick('Emparejar', 'Match')} <b>1</b></td>
                <td>{pick('Unir parejas de palabras en alemán y su traducción contrarreloj.', 'Match German and translation pairs against the clock.')}</td>
              </tr>
              <tr>
                <td>🔤 Wortsalat <b>2</b></td>
                <td>{pick('Ordenar las letras desordenadas para formar la palabra alemana.', 'Unscramble the jumbled letters to form the German word.')}</td>
              </tr>
              <tr>
                <td>⚡ Blitz <b>1</b></td>
                <td>{pick('Treinta segundos para acertar todas las palabras posibles.', 'Thirty seconds to get as many words right as you can.')}</td>
              </tr>
              <tr>
                <td>🪢 {pick('Ahorcado', 'Hangman')} <b>1–3</b></td>
                <td>{pick('Adivinar una palabra letra a letra. Las pistas muestran el artículo o la inicial, revelan una letra y dan el significado.', 'Guess a word letter by letter. The hints show its article or first letter, reveal another letter, and give its meaning.')}</td>
              </tr>
              <tr>
                <td>🔠 {pick('Crucigrama del tema', 'Topic crossword')}</td>
                <td>{pick('Completar una cuadrícula con palabras del tema a partir de pistas en alemán.', 'Fill in a grid with topic vocabulary using German clues.')}</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ margin: '18px 0 6px', fontSize: '0.95rem', color: 'var(--accent)' }}>💬 Kommunikation</h3>
          <table className="cf-tabla cf-tabla-juegos">
            <tbody>
              <tr>
                <td>🔁 {pick('Traducir frases', 'Translate sentences')} <b>1–4</b></td>
                <td>{pick('Traducir frases completas en ambas direcciones con tres pistas y teclado especial.', 'Translate full sentences in both directions with three hints and special characters.')}</td>
              </tr>
              <tr>
                <td>🗣 {pick('Elegir la frase', 'Pick the phrase')} <b>1</b></td>
                <td>{pick('Elegir entre varias opciones cómo formularías una idea o afirmación en alemán según la situación.', 'Pick how to formulate a given idea or statement in German from multiple choices.')}</td>
              </tr>
              <tr>
                <td>💬 {pick('Contestar', 'Reply')} <b>1</b></td>
                <td>{pick('Elegir la respuesta adecuada y natural a lo que te acaban de decir en la conversación.', 'Pick the natural and appropriate response to what was just said in the conversation.')}</td>
              </tr>
              <tr>
                <td>🔀 {pick('Ordenar la frase', 'Sentence order')} <b>2</b></td>
                <td>{pick('Colocar los bloques de palabras para formar el turno de conversación en el orden adecuado.', 'Arrange word tiles into proper dialogue and conversational syntax.')}</td>
              </tr>
              <tr>
                <td>📝 {pick('La palabra que falta', 'The missing word')} <b>1–4</b></td>
                <td>{pick('Teclear de memoria la palabra clave que completa el turno del diálogo, con pistas de letras.', 'Type the missing dialogue keyword from memory, with letter hints.')}</td>
              </tr>
              <tr>
                <td>🧩 {pick('Emparejar', 'Match')} <b>1</b></td>
                <td>{pick('Unir seis frases o preguntas de conversación con su significado o respuesta contrarreloj.', 'Match six dialogue phrases or questions with their meaning or response against the clock.')}</td>
              </tr>
              <tr>
                <td>⚡ Blitz <b>1</b></td>
                <td>{pick('Cuarenta segundos para acertar todas las frases y expresiones de diálogo posibles.', 'Forty seconds to answer as many conversation phrases and expressions as you can.')}</td>
              </tr>
            </tbody>
          </table>

          <h3 style={{ margin: '18px 0 6px', fontSize: '0.95rem', color: 'var(--accent)' }}>🎓 {pick('Exámenes oficiales A2 y destrezas avanzadas', 'Official A2 exams and advanced skills')}</h3>
          <table className="cf-tabla cf-tabla-juegos">
            <tbody>
              <tr>
                <td>📋 {pick('Prüfung A2 (Simulacro)', 'Prüfung A2 (Mock Exam)')} <b>{pick('hasta 30', 'up to 30')}</b></td>
                <td>{pick('Simulacro oficial de 4 destrezas (Lesen, Hören, Schreiben, Sprechen) en formato estándar ÖSD / Goethe / telc.', 'Official 4-skill mock exam (Reading, Listening, Writing, Speaking) standard ÖSD / Goethe / telc format.')}</td>
              </tr>
              <tr>
                <td>🗣 {pick('Sprechen con Felix', 'Speaking with Felix')} <b>2–10</b></td>
                <td>{pick('Práctica oral en 3 partes: presentación personal, conversación sobre un tema cotidiano y planificación conjunta.', 'Oral practice in 3 parts: self-introduction, discussion on a daily topic, and joint planning.')}</td>
              </tr>
              <tr>
                <td>📔 {pick('Tagebuch (Diario)', 'Tagebuch (Diary)')} <b>25</b></td>
                <td>{pick('Redacción libre diaria en alemán con corrección gramatical detallada frase a frase y recomendación de lección.', 'Daily free writing in German with detailed sentence-by-sentence grammar correction and lesson recommendations.')}</td>
              </tr>
              <tr>
                <td>📓 {pick('Cuaderno de notas', 'Notebook')} <b>15</b></td>
                <td>{pick('Tus propios apuntes organizados por lección con fotografías adjuntas y ejemplos de uso.', 'Your personal notes organized by lesson with attached photos and usage examples.')}</td>
              </tr>
            </tbody>
          </table>

          <p className="muted" style={{ marginTop: 12 }}>
            {pick(
              'En los ejercicios con pistas (Ahorcado, der / die / das, Kasus Trainer, Escribir, Traducir y La palabra que falta), las monedas se van reduciendo con cada pista gastada, pero siempre te llevas al menos 1 moneda al acertar.',
              'In exercises with hints (Hangman, der / die / das, Kasus Trainer, Typing, Translating, and Missing Word), coins decrease with each hint used, but you will always earn at least 1 coin when you get it right.'
            )}
          </p>
        </Bloque>

        <Bloque titulo={pick('📍 Avance y repasos', '📍 Progress and review')}>
          <ul className="cf-lista">
            <li>
              <strong>{pick('Durante un ejercicio', 'During an exercise')}:</strong>{' '}
              {pick(
                'La barra muestra el avance de la tanda: en una sesión normal avanza al continuar y, al repasar fallos, al responderlos bien.',
                'The bar shows session progress: in a regular session it advances when you continue, and in mistake review when you answer correctly.'
              )}
            </li>
            <li>
              <strong>{pick('Práctica mixta', 'Mixed practice')}:</strong>{' '}
              {pick(
                'Puedes elegir como máximo un nivel y una dificultad. Si no marcas ninguno, se mantienen todos los niveles y formatos. Fácil omite las preguntas de respuesta escrita; Difícil omite ordenar frases. Los ejercicios se eligen al azar dentro de la selección.',
                'Choose at most one level and one difficulty. If you select neither, all levels and formats remain available. Easy skips written-response tasks; Difficult skips sentence-order tasks. Exercises are chosen at random from the selection.'
              )}
            </li>
            <li>
              <strong>{pick('Repasar mis fallos', 'Review my mistakes')}:</strong>{' '}
              {pick(
                'Reúne los ejercicios que fallaste. Al acertar, baja el total pendiente y avanza la barra.',
                'Collects the exercises you got wrong. When you answer one correctly, the pending total drops and the bar advances.'
              )}
            </li>
            <li>
              <strong>{pick('Ejercicios marcados', 'Starred exercises')}:</strong>{' '}
              {pick(
                'Guarda ejercicios con la estrella para volver a practicarlos más tarde.',
                'Star exercises to save them and practise them again later.'
              )}
            </li>
            <li>
              <strong>{pick('Estadísticas «Tema dominado»', '“Topic mastered” statistics')}:</strong>{' '}
              {pick(
                'En «Ejercicios» puedes consultar tu rendimiento y tus récords en cada minijuego del tema.',
                'In “Exercises”, you can check your performance and records for each minigame in the topic.'
              )}
            </li>
          </ul>
        </Bloque>

        <Bloque titulo={pick('👑 Las coronas y los desbloqueos', '👑 Crowns and unlocks')}>
          <p>
            {pick(
              'A medida que avanzas en el aprendizaje desbloqueas elementos exclusivos para personalizar a Felix:',
              'As you progress in your learning, you unlock exclusive items to customise Felix:'
            )}
          </p>
          <ul className="cf-lista">
            <li>
              <strong>👑 {pick('Coronas (Kronen)', 'Crowns (Kronen)')}:</strong>{' '}
              {pick(
                'Ganas 1 corona cuando la Gramática de una lección llega al 100%. Las coronas desbloquean artículos de la colección real en la tienda de Felix (corona, tiara, cetro, orbe y ropa real).',
                'You earn 1 crown when a lesson’s Grammar reaches 100%. Crowns unlock items from the royal collection in Felix’s shop (crowns, tiaras, sceptres, an orb, and royal outfits).'
              )}
            </li>
            <li>
              <strong>✨ {pick('Auras y efectos de partículas', 'Particle auras & effects')}:</strong>{' '}
              {pick(
                'Los efectos de partículas se desbloquean al batir hitos de respuestas correctas seguidas. Otros artículos de la tienda se desbloquean al mantener una racha de días; cada artículo muestra su requisito.',
                'Particle effects unlock at correct-answer streak milestones. Other shop items unlock through day streaks; each item shows its requirement.'
              )}
            </li>
            <li>
              <strong>🏞 {pick('Fondos y escenarios', 'Backgrounds & scenes')}:</strong>{' '}
              {pick(
                'Los fondos disponibles (Pradera, Playa, Desierto, Hielo y nieve, Clase y Espacio) se compran con monedas. Al elegir uno, su degradado de color aparece en Felix y en las pantallas de ejercicios.',
                'Available backgrounds (Meadow, Beach, Desert, Ice and snow, Classroom, and Space) are purchased with coins. Choosing one applies its colour gradient to Felix and the exercise screens.'
              )}
            </li>
            <li>
              <strong>🐾 {pick('Cambiar de animal', 'Change animal')}:</strong>{' '}
              {pick(
                'Cada animal cuesta 500 monedas para desbloquearlo una sola vez. Después puedes cambiar gratis entre los animales que ya tengas.',
                'Each animal costs 500 coins to unlock once. After that, you can switch between animals you own for free.'
              )}
            </li>
            <li>
              <strong>🏷 {pick('Nombre de Felix', 'Felix’s name')}:</strong>{' '}
              {pick(
                'Puedes cambiar el nombre de tu mascota desde su panel por 1000 monedas; se paga una sola vez.',
                'You can rename your pet from its panel for 1000 coins; this is a one-time purchase.'
              )}
            </li>
          </ul>
        </Bloque>

        <Bloque titulo={pick('📊 De dónde sale cada porcentaje', '📊 Where each percentage comes from')}>
          <p>
            {pick(
              'Ninguno baja nunca. Los tres cuentan aciertos acumulados: fallar no resta, solo no suma. Las tres áreas están perfectamente equilibradas a 240 aciertos por lección para llegar al 100 %. El progreso total de una lección es la media de sus tres partes.',
              'None of them ever goes down. All three count accumulated hits: missing does not subtract, it just does not add. All three areas are perfectly balanced to 240 hits per lesson to reach 100%. A lesson’s total progress is the average of its three parts.'
            )}
          </p>
          <ul className="cf-lista">
            <li>
              <strong>{pick('Vocabulario', 'Vocabulary')}:</strong>{' '}
              {pick(
                '120 palabras × 2 aciertos = 240 aciertos. Cada palabra pide dos aciertos para consolidarse. La barra de la lección y la del mazo dicen siempre lo mismo.',
                '120 words × 2 hits = 240 hits. Each word requires two hits to consolidate. The lesson bar and the deck bar always agree.'
              )}
            </li>
            <li>
              <strong>{pick('Gramática', 'Grammar')}:</strong>{' '}
              {pick(
                '8 reglas × 30 aciertos = 240 aciertos. Cada regla pide 30 aciertos para llenarse, avanzando exactamente a la par que el vocabulario.',
                '8 rules × 30 hits = 240 hits. Each rule requires 30 hits to fill up, advancing at the exact same pace as vocabulary.'
              )}
            </li>
            <li>
              <strong>Kommunikation:</strong>{' '}
              {pick(
                '8 funciones × 30 aciertos = 240 aciertos. Cada apartado pide 30 respuestas acertadas en sus diálogos y turnos de conversación.',
                '8 functions × 30 hits = 240 hits. Each section needs 30 correct answers across its dialogues and conversation turns.'
              )}
            </li>
          </ul>
          <p className="muted">
            {pick(
              'En la lección inicial (Start: Wie geht\'s?) hay 150 palabras (300 aciertos), 12 reglas (360 aciertos) y 12 funciones (360 aciertos). Fallar no resta porcentaje: solo hace que esa palabra o regla vuelva a salirte antes.',
              'In the intro lesson (Start: Wie geht\'s?) there are 150 words (300 hits), 12 rules (360 hits) and 12 functions (360 hits). Missing does not subtract percentage: it just brings that word or rule back to you sooner.'
            )}
          </p>
        </Bloque>

        <Bloque titulo={pick('🏆 ¿Qué significa "Dominadas"?', '🏆 What does "Mastered" mean?')}>
          <p>
            {pick(
              'En los juegos (der / die / das, Kasus Trainer y Traducir frases) verás dos cifras: "empezadas" y "dominadas". No son lo mismo:',
              'In the games (der / die / das, Kasus Trainer and Translating) you see two numbers: "started" and "mastered". They are not the same:'
            )}
          </p>
          <ul className="cf-lista">
            <li>
              <strong>{pick('Empezadas', 'Started')}:</strong>{' '}
              {pick(
                'El total de elementos que has practicado al menos una vez.',
                'The total items you have encountered and answered at least once.'
              )}
            </li>
            <li>
              <strong>{pick('der / die / das y Vocabulario', 'der / die / das and Vocabulary')}:</strong>{' '}
              {pick(
                'Una palabra se considera dominada cuando alcanza nivel 3 o más de fuerza en repetición espaciada (al menos 3 aciertos netos). Fallar reduce la fuerza, por lo que no basta con acertarla una vez de casualidad.',
                'A word is mastered when it reaches strength level 3 or higher in spaced repetition (at least 3 net hits). Missing lowers its strength, so guessing right once does not master it.'
              )}
            </li>
            <li>
              <strong>Kasus Trainer:</strong>{' '}
              {pick(
                'Una frase está dominada cuando alcanza fuerza 3 o más (al menos 3 aciertos netos donde los aciertos superan a los fallos).',
                'A sentence is mastered when it reaches strength level 3 or higher (at least 3 net hits where correct answers exceed misses).'
              )}
            </li>
            <li>
              <strong>{pick('Traducir frases', 'Translate sentences')}:</strong>{' '}
              {pick(
                'Una frase está dominada cuando alcanza fuerza 2 o más (incluso usando pistas, y aceptando respuestas con una coincidencia del 90% o superior con la original).',
                'A phrase is mastered when it reaches strength level 2 or higher (including using hints, and accepting answers with 90% or higher match with the original).'
              )}
            </li>
          </ul>
          <p className="muted">
            {pick(
              'El porcentaje que ves en la tarjeta refleja tus elementos dominados frente al total de más de 2.000 palabras y frases del temario.',
              'The percentage shown on each card reflects your mastered items out of the 2,000+ words and phrases in the curriculum.'
            )}
          </p>
        </Bloque>

        <Bloque titulo={pick('🎨 Los colores de las palabras', '🎨 The colours on the words')}>
          <p>
            {pick(
              'Cada palabra lleva un punto de color que se pinta solo al usar las tarjetas. El sentido en que la practicas decide hasta dónde puede llegar:',
              'Every word has a colour dot that paints itself when you use the flashcards. The direction you practise in decides how far it can get:'
            )}
          </p>
          <ul className="cf-lista">
            <li>
              <span className="cf-punto" style={{ background: '#ef4444' }} />{' '}
              {pick('la has fallado.', 'you got it wrong.')}
            </li>
            <li>
              <span className="cf-punto" style={{ background: '#f59e0b' }} />{' '}
              {pick(
                'la reconoces. Es el techo si practicas alemán → tu idioma.',
                'you recognise it. That is the ceiling if you practise German → your language.'
              )}
            </li>
            <li>
              <span className="cf-punto" style={{ background: '#10b981' }} />{' '}
              {pick(
                'te sale sola en alemán. Solo se gana en el sentido difícil, tu idioma → alemán.',
                'it comes out by itself in German. Only earned the hard way, your language → German.'
              )}
            </li>
          </ul>
          <p className="muted">
            {pick(
              'Un verde ganado no lo tira un fallo reconociéndola: que te salga sola sigue siendo cierto. Fallar produciéndola sí baja un escalón.',
              'A green you earned is not undone by missing it on the easy side: it still comes out by itself. Missing it on the producing side does drop it one step.'
            )}
          </p>
        </Bloque>

        <Bloque titulo={pick('🪙 Monedas y XP', '🪙 Coins and XP')}>
          <ul className="cf-lista">
            <li>
              {pick(
                'Paga lo que el ejercicio te exige: 1 si eliges entre opciones que ya tienes delante, 2 si te dan las piezas y las colocas (ordenar frases, Wortsalat) y hasta 4 si lo escribes de memoria (escribir la palabra, traducir la frase).',
                'It pays what the exercise demands of you: 1 if you pick from options already in front of you, 2 if you are given the pieces and place them (sentence order, Wortsalat) and up to 4 if you write it from memory (type the word, translate the sentence).'
              )}
            </li>
            <li>
              {pick(
                'Cada pista gastada reduce una moneda de la recompensa del ejercicio, pero acertar siempre te garantiza al menos 1 moneda (nunca te quedas sin recompensa por pedir ayuda).',
                'Each hint spent reduces the exercise reward by one coin, but getting it right always guarantees at least 1 coin (you never get zero coins for asking for help).'
              )}
            </li>
            <li>
              {pick(
                '⚡ Blitz paga 1 moneda por cada acierto, y además te llevas 5 monedas de bonus extra si alcanzas el objetivo (10 aciertos dentro del tiempo).',
                '⚡ Blitz pays 1 coin per hit, plus a 5 extra coin bonus if you reach the goal (10 correct hits within the time limit).'
              )}
            </li>
            <li>
              {pick(
                'Al terminar una tanda, recibes 5 monedas extra si tu racha actual es de 10 o más respuestas correctas seguidas. Es la racha de respuestas, no la de días.',
                'Finish a round with a current streak of 10 or more correct answers in a row to receive 5 extra coins. This is the answer streak, not the day streak.'
              )}
            </li>
            <li>
              {pick(
                'Fallar un ejercicio nunca quita monedas. Las tarjetas (flashcards) son para repaso y estudio visual libre, por lo que no otorgan monedas (la nota te la pones tú).',
                'Missing an exercise never costs coins. Flashcards are for free visual study and review, so they do not award coins (you grade yourself).'
              )}
            </li>
            {!SIN_IA && (
              <li>
                {pick(
                  'Las cosas largas pagan más: una entrada del diario 25, unos apuntes 15, una parte del examen hasta 30 — y esa en proporción a lo que aciertes, que terminarla a boleo no da nada.',
                  'Longer tasks pay more: a diary entry 25, a set of notes 15, an exam part up to 30 — and that one in proportion to what you get right, because finishing it at random pays nothing.'
                )}
              </li>
            )}
            <li>
              {pick(
                'La XP es otra cosa: 10 por acierto, 2 por fallo, y 5 de propina si la tanda pasa del 90 %. Es la que sube de nivel.',
                'XP is a different thing: 10 per hit, 2 per miss, and 5 extra if the round beats 90 %. That is what levels you up.'
              )}
            </li>
            <li>
              {pick(
                'Y hay dos propinas gordas: 10 monedas por cada día que sumas a la racha, y otras 10 por cada nivel que subes.',
                'And there are two big bonuses: 10 coins for each day you add to the streak, and another 10 for every level you gain.'
              )}
            </li>
          </ul>
          <p className="muted">
            {pick(
              'Las monedas se gastan en la ropa, complementos, animales de compañía y fondos / escenarios de Felix. No sirven para nada más, a propósito.',
              'Coins are spent on Felix’s clothes, accessories, companion animals, and backgrounds / scenes. They are good for nothing else, on purpose.'
            )}
          </p>
        </Bloque>

        <Bloque titulo={pick('⭐ La racha y los congeladores', '⭐ The streak and the freezes')}>
          <p>
            {pick(
              'La racha cuenta días seguidos con al menos un ejercicio. Empiezas con dos congeladores ❄.',
              'The streak counts days in a row with at least one exercise. You start with two freezes ❄.'
            )}
          </p>
          <ul className="cf-lista">
            <li>
              {pick(
                'Cada día que te saltas gasta un congelador solo, y la racha sigue.',
                'Each day you skip spends one freeze automatically, and the streak carries on.'
              )}
            </li>
            <li>
              {pick(
                'Con tres congeladores puedes faltar hasta tres días. Al cuarto, vuelta a empezar.',
                'With three freezes you can miss up to three days. On the fourth, back to the start.'
              )}
            </li>
            <li>
              {pick(
                'Cada 5 días seguidos te dan uno, hasta un máximo de tres.',
                'Every 5 days in a row you get one back, up to three.'
              )}
            </li>
          </ul>
        </Bloque>

        <Bloque titulo={pick('💡 Las pistas', '💡 The hints')}>
          <p>
            {pick(
              'Las ayudas dependen del ejercicio; algunas revelan información poco a poco y no muestran la respuesta completa:',
              'Hints depend on the exercise; some reveal information gradually without showing the full answer:'
            )}
          </p>
          <ul className="cf-lista">
            <li>
              <strong>{pick('Reglas de terminación', 'Ending rules')}:</strong>{' '}
              {pick(
                'Si el sustantivo tiene un sufijo fiable (-ung, -heit, -keit, -tion → siempre "die"; -chen, -lein, -ment → siempre "das"; -ismus → siempre "der"), la pista te muestra esa regla general para que la aprendas y te sirva con cientos de palabras más.',
                'If the noun has a reliable suffix (-ung, -heit, -keit, -tion → always "die"; -chen, -lein, -ment → always "das"; -ismus → always "der"), the hint shows you that general rule so it helps with hundreds of other words.'
              )}
            </li>
            <li>
              <strong>{pick('Descarte 50/50', '50/50 Elimination')}:</strong>{' '}
              {pick(
                'Si la palabra no tiene una terminación fija con regla, la pista descarta automáticamente una de las opciones incorrectas para que solo tengas que elegir entre las dos restantes.',
                'If the word does not follow a fixed ending rule, the hint automatically eliminates one incorrect option so you only have to choose between the remaining two.'
              )}
            </li>
            <li>
              <strong>Kasus Trainer:</strong>{' '}
              {pick(
                'La pista «Género» muestra el artículo del sustantivo en nominativo; «Caso» indica el caso que debes aplicar en la frase.',
                'The “Gender” hint shows the noun’s nominative article; “Case” tells you which case to apply in the sentence.'
              )}
            </li>
            <li>
              <strong>{pick('Ahorcado', 'Hangman')}:</strong>{' '}
              {pick(
                'La primera pista da el artículo si la palabra lo tiene; si no, muestra la inicial. La segunda revela una letra que aún no has probado y la tercera muestra la traducción.',
                'The first hint gives the article if the word has one; otherwise, it shows the first letter. The second reveals an unused letter, and the third shows the translation.'
              )}
            </li>
            <li>
              <strong>{pick('Escribir y La palabra que falta', 'Type it and The missing word')}:</strong>{' '}
              {pick(
                'La inicial de cada palabra aparece desde el principio. Cada pista descubre otra letra; en algunas preguntas de diálogo también puedes mostrar la traducción.',
                'The first letter of each word is visible from the start. Each hint reveals another letter; some dialogue questions also let you show the translation.'
              )}
            </li>
            <li>
              <strong>{pick('Traducir frases', 'Translate sentences')}:</strong>{' '}
              {pick(
                'Las pistas muestran partes de la respuesta de forma progresiva: primero una palabra y el número total de palabras, y luego más palabras.',
                'Hints reveal parts of the answer progressively: first one word and the total word count, then more words.'
              )}
            </li>
            <li>
              <strong>{pick('Crucigrama', 'Crossword')}:</strong>{' '}
              {pick(
                'Cada palabra tiene una pista integrada en alemán: puede ser una definición, un ejemplo con un hueco o una pregunta sobre su significado.',
                'Each word has an integrated clue in German: it may be a definition, an example with a blank, or a question about its meaning.'
              )}
            </li>
          </ul>
        </Bloque>

        <Bloque titulo={pick('🔊 Audio y síntesis de voz', '🔊 Audio and speech synthesis')}>
          <p>
            {pick(
              'Los audios de examen (Hören), lecturas y pronunciaciones de palabras y frases utilizan el sintetizador de voz (TTS) en alemán nativo del navegador.',
              'Exam audio (Hören), readings, and vocabulary/phrase pronunciations use native German speech synthesis (TTS) provided by your browser.'
            )}
          </p>
          <ul className="cf-lista">
            <li>
              {pick(
                'En ordenador, Windows, macOS y Linux ofrecen voces neuronales fluidas y nítidas de forma automática.',
                'On desktop, Windows, macOS, and Linux provide natural, crisp speech voices automatically.'
              )}
            </li>
            <li>
              {pick(
                'En teléfonos móviles, la app aprovecha la voz en alemán instalada en el sistema operativo. Si no se oye, asegúrate de tener el paquete de voz en alemán descargado en los ajustes de idioma de tu dispositivo.',
                'On mobile phones, the app utilizes the German voice installed on your OS. If no sound plays, ensure you have the German speech pack downloaded in your device’s language settings.'
              )}
            </li>
          </ul>
        </Bloque>

        <Bloque titulo={pick('💾 Dónde se guarda tu progreso', '💾 Where your progress is kept')}>
          <p>
            {pick(
              'Se guarda solo, sin botón de guardar, en el navegador con el que abres la app. No viaja a ningún sitio.',
              'It saves itself, with no save button, in the browser you open the app with. It travels nowhere.'
            )}
          </p>
          <ul className="cf-lista">
            <li>
              {pick(
                'Cada navegador es un mundo: lo de Chrome no está en Firefox aunque sea el mismo ordenador.',
                'Each browser is its own world: what is in Chrome is not in Firefox, even on the same computer.'
              )}
            </li>
            <li>
              {pick(
                'Borrar los datos del navegador se lo lleva todo. En ventana privada se borra al cerrarla.',
                'Clearing your browser data wipes it. In a private window it is gone when you close it.'
              )}
            </li>
            <li>
              {pick(
                'Aquí abajo tienes Exportar e Importar: eso sí es una copia de verdad (incluyendo tus apuntes y fotografías), y sirve para llevártelo a otro ordenador o guardarlo como respaldo seguro.',
                'Export and Import are right below: that is a real backup (including your notebook notes and photos), and it is how you move it to another computer or keep a safe backup.'
              )}
            </li>
          </ul>
        </Bloque>
      </div>
    </div>
  );
}
