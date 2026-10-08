// Generacion opcional de ejercicios con IA. Si el usuario activa la IA y
// pega una API key (Gemini tiene capa gratuita), la app pide ejercicios
// nuevos centrados en tus fallos. Si no hay key o falla, se ignora y se
// usan solo las plantillas locales.

import { getSettings, aiAvailable } from './settings.js';
import { lektionSummary, lektionFullLabel } from './kursbuch/index.js';
import { getLang, langName, t } from './i18n.js';

// El idioma del alumno, para los prompts. Todo lo que la IA escribe PARA el
// alumno (traducciones, explicaciones, el por-que de una correccion) sale en
// el idioma de la interfaz. El aleman que practica se queda en aleman.
const idiomaAlumno = () => langName(getLang());
import { ejerciciosDeClase } from './notebook.js';

// Funcion y no constante: si fuera constante se fijaria el idioma al cargar
// el modulo y cambiar de idioma no tendria efecto hasta recargar la pagina.
//
// La regla del idioma va aqui y no en cada prompt a proposito: el sistema lo
// reciben TODAS las llamadas, asi que tambien las que se escriban manana. Hacia
// falta porque muchos esquemas piden solo "traduccion" sin decir a que idioma,
// y el modelo, viendo un campo llamado "es" y un prompt en castellano, contesta
// en castellano aunque la app este en ingles.
const SYSTEM = () => `Eres profesor de aleman para hablantes de ${idiomaAlumno()} de nivel A2-B1.
Generas ejercicios de gramatica variados y correctos. Respondes SOLO con JSON valido.

IDIOMA (importante): el aleman que el alumno practica se queda SIEMPRE en aleman:
las frases de ejemplo, los enunciados del libro y los campos "de". TODO lo demas
que lea el alumno va en ${idiomaAlumno()}: traducciones, explicaciones, el por-que
de una respuesta, los titulos y los comentarios de correccion.
Los campos "es", "translation", "explanation", "…Es" y similares son la version
en ${idiomaAlumno()}, aunque se llamen "es" por motivos historicos.`;

// Los ejercicios que el alumno ha fotografiado de su libro, como modelo de
// estilo. Es lo que separa "un test de tres opciones cualquiera" de "algo que
// se parece a lo que hago en clase".
function bloqueEstiloClase() {
  const reales = ejerciciosDeClase({ max: 6 });
  if (!reales.length) return '';
  const lista = reales
    .map((e) => `- ${e.anweisung ? e.anweisung + ' → ' : ''}"${e.frage}" (solución: ${e.antwort})`)
    .join('\n');
  return `
ASI SON LOS EJERCICIOS DE SU CLASE (de su libro, fotografiados por el).
Estan aqui SOLO como muestra del FORMATO:
${lista}

Copia de ellos la FORMA: el tipo de tarea, la longitud de las frases y el
registro. Si sus ejercicios son de transformar frases o de completar
escribiendo, haz eso y no test de tres opciones.

NO copies su tema ni su gramatica. El tema y la regla que se practican son los
que se piden ARRIBA en este mismo mensaje; estos ejemplos pueden ser de otra
leccion completamente distinta y no deben arrastrarte a ella. Frases nuevas.
`;
}

// El repaso general con IA de la portada pide algo mas que un hueco suelto:
// para eso ya estan las plantillas. Aqui se busca lo que una plantilla no
// puede dar: frases mas largas, dos reglas trabajando a la vez y contextos
// que no ha visto antes.
const BLOQUE_RETO = `
Sube un punto la exigencia respecto a un ejercicio de libro de A2:
- Frases mas largas y con mas contexto (subordinadas, dos ideas enlazadas),
  no sujeto + verbo + complemento.
- Que cada ejercicio obligue a pensar en DOS cosas a la vez cuando se pueda
  (por ejemplo el caso correcto Y la posicion del verbo; o el Perfekt con el
  auxiliar que toca Y un verbo separable).
- Situaciones nuevas y concretas (una mudanza, una cita medica, una queja en
  una tienda), no frases de manual.
- Nada de repetir el mismo esquema dos veces seguidas.
Que siga siendo A2-B1: dificil de acertar por descarte, no vocabulario raro.
`;

function buildPrompt({ topicName, conceptHints, count, avoid, reto = false }) {
  return `Crea ${count} ejercicios de aleman sobre "${topicName}" para nivel A2-B1.
${conceptHints?.length ? `Prioriza estos puntos donde el alumno falla: ${conceptHints.join(', ')}.` : ''}
${avoid?.length ? `Evita repetir estas frases: ${avoid.slice(0, 8).join(' | ')}.` : ''}
${reto ? BLOQUE_RETO : ''}
${bloqueEstiloClase()}
Reparte los tipos: al menos la mitad que NO sean "mc". Usa una mezcla de "mc", "order", "write", "cloze", "open" y "judge".

Devuelve un array JSON. Cada elemento:
{
  "type": "mc" | "order" | "write" | "cloze" | "open" | "judge",
  "conceptId": "cadena corta identificando la regla",
  "anweisung": "instrucción clara para el alumno",
  "context": "OPCIONAL. Texto de lectura para poner antes del ejercicio",
  
  // Para mc, open y write:
  "sentence": "frase con ___ donde va el hueco, o la pregunta abierta",
  "options": ["op1", "op2", "op3", "op4"], // solo para mc
  "answer": "respuesta exacta", // para mc, write. Para open, pon una respuesta modelo ideal.
  
  // Para order:
  "tokens": ["la", "frase", "troceada"],
  "solution": ["orden", "correcto"],
  
  // Para cloze:
  "clozeText": "Gestern bin ich in ___ Stadt gegangen. Dort habe ich ___ Kaffee getrunken. (OJO: usa siempre ___ para los huecos, NUNCA corchetes ni paréntesis)",
  "clozeAnswers": ["die", "einen"],
  "clozeChoices": ["die", "der", "das", "einen", "ein", "eine"], // opcional
  
  // Para judge:
  "judgeText": "frase con un error gramatical intencionado",
  "correctForm": "la corrección exacta",
  "errorType": "qué regla rompió",
  
  "translation": "traducción a ${idiomaAlumno()}",
  "explanation": "explicación breve en ${idiomaAlumno()} de POR QUÉ esa es la respuesta"
}
En "write" el alumno teclea la respuesta: que el hueco tenga UNA sola solucion razonable.
Sin texto fuera del JSON. Alemania estandar, ortografia con esszet cuando toque.`;
}

async function callGemini({ key, model, prompt, json = true, image = null, search = false, retries = 2 }) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(
    model
  )}:generateContent`;
  const generationConfig = { temperature: json ? 1.0 : 0.6 };
  // Con Google Search activado, no forzamos application/json porque Gemini devuelve metadatos de búsqueda
  if (json && !search) generationConfig.responseMimeType = 'application/json';
  
  const parts = [{ text: prompt }];
  if (image) {
    const commaIndex = image.indexOf(',');
    const mimeType = image.substring(5, commaIndex).split(';')[0];
    const data = image.substring(commaIndex + 1);
    parts.push({ inlineData: { mimeType, data } });
  }

  const reqBody = {
    systemInstruction: { parts: [{ text: SYSTEM() }] },
    contents: [{ role: 'user', parts }],
    generationConfig
  };

  if (search) {
    reqBody.tools = [{ googleSearch: {} }];
  }

  let attempt = 0;
  while (true) {
    const res = await fetch(url, {
      method: 'POST',
      // La clave va en cabecera, no en la URL: en la URL acababa en el
      // historial de red, en los logs de cualquier proxy y en los errores.
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: JSON.stringify(reqBody)
    });
    
    if (!res.ok) {
      const errText = await res.text();
      if (res.status === 429 && attempt < retries) {
        attempt++;
        let waitMs = 10000; // default 10s
        const match = errText.match(/retryDelay":\s*"([\d.]+)s"/);
        if (match && match[1]) {
          waitMs = Math.ceil(parseFloat(match[1]) * 1000) + 1000;
        } else if (errText.includes('Please retry in')) {
           const retryMatch = errText.match(/Please retry in ([\d.]+)s/);
           if (retryMatch && retryMatch[1]) {
             waitMs = Math.ceil(parseFloat(retryMatch[1]) * 1000) + 1000;
           }
        }
        // Cap max wait to 60s
        waitMs = Math.min(waitMs, 60000);
        console.warn(`Gemini 429: Rate limited. Retrying in ${waitMs}ms (attempt ${attempt}/${retries})...`);
        await new Promise((r) => setTimeout(r, waitMs));
        continue;
      }
      throw new Error(`Gemini ${res.status}: ${errText}`);
    }
    const data = await res.json();
    return data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') || '';
  }
}

async function callOpenAICompat({ key, model, prompt, baseUrl, json = true, image = null }) {
  const messages = [
    { role: 'system', content: SYSTEM() }
  ];
  if (image) {
    messages.push({
      role: 'user',
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: image } }
      ]
    });
  } else {
    messages.push({ role: 'user', content: prompt });
  }

  const body = {
    model,
    temperature: json ? 1.0 : 0.6,
    messages
  };
  if (json) body.response_format = { type: 'json_object' };

  const res = await fetch(`${baseUrl || 'https://api.openai.com/v1'}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${key}`
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return data?.choices?.[0]?.message?.content || '';
}

// Puente local: habla con el servidor de desarrollo (dev/claude-bridge.js),
// que ejecuta el CLI `claude`. No necesita API key.
// Cuando la cuota se agota, el CLI tarda lo suyo en decirtelo y por el camino
// se come la espera entera. Si eso pasa una vez, no tiene ningun sentido dejar
// que la app siga mandando peticiones: cada una es otro minuto tirado para
// acabar con el mismo mensaje. Se apunta aqui y las siguientes fallan al
// instante, diciendo hasta cuando.
let limiteHasta = 0;
let limiteTexto = '';

export function limiteIA() {
  if (!limiteHasta || Date.now() > limiteHasta) return null;
  return { hasta: limiteHasta, texto: limiteTexto };
}

export function olvidarLimiteIA() {
  limiteHasta = 0;
  limiteTexto = '';
}

// Lo llaman los sitios que hablan con el puente por su cuenta (las canciones),
// para que el corte sea uno solo y no lo tenga que descubrir cada pantalla.
export function apuntarLimiteIA(reset) {
  limiteHasta = cuandoSeReinicia(reset);
  limiteTexto = reset || '';
}

// "7:20pm", "19:20", "7:20pm (Europe/Madrid)" → marca de tiempo del proximo
// momento en que toque. Si no se entiende, media hora de margen y a otra cosa.
function cuandoSeReinicia(txt) {
  const m = /(\d{1,2})[:.](\d{2})\s*(am|pm)?/i.exec(String(txt || ''));
  if (!m) return Date.now() + 30 * 60 * 1000;
  let h = Number(m[1]);
  const min = Number(m[2]);
  const suf = (m[3] || '').toLowerCase();
  if (suf === 'pm' && h < 12) h += 12;
  if (suf === 'am' && h === 12) h = 0;
  const d = new Date();
  d.setHours(h, min, 0, 0);
  if (d.getTime() <= Date.now()) d.setDate(d.getDate() + 1);
  return d.getTime();
}

async function callClaudeLocal({ prompt, tools, timeoutMs, image }) {
  const lim = limiteIA();
  if (lim) {
    throw new Error(
      `Sin cuota de Claude hasta ${new Date(lim.hasta).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit'
      })}. No se ha enviado nada para no hacerte esperar en balde.`
    );
  }
  let res;
  try {
    res = await fetch('/api/ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, system: SYSTEM(), tools, timeoutMs, image })
    });
  } catch {
    // Marcado, para que runLLM sepa que esto es "no hay puente" y no un fallo
    // del modelo: solo en ese caso tiene sentido reintentar con la clave.
    const e = new Error(t('err.noBridge'));
    e.puenteCaido = true;
    throw e;
  }
  if (!res.ok) {
    let msg = `Puente local: error ${res.status}`;
    let cuerpo = null;
    try {
      cuerpo = await res.json();
      if (cuerpo?.error) msg = cuerpo.error;
    } catch {
      /* deja el mensaje por defecto */
    }
    // Ojo: el puente usa 429 para dos cosas distintas. `limite` es la cuota
    // agotada, y eso sí corta la app hasta que se reinicie. `ocupado` es solo
    // que hay cola: se reintenta cuando quieras y no debe apagar nada.
    if (cuerpo?.limite) {
      limiteHasta = cuandoSeReinicia(cuerpo?.reset);
      limiteTexto = cuerpo?.reset || '';
      const e = new Error(msg);
      e.limite = true;
      throw e;
    }
    const e = new Error(msg);
    if (cuerpo?.ocupado) e.ocupado = true;
    throw e;
  }
  const data = await res.json();
  return data.text || '';
}


// Enruta un prompt al proveedor configurado.
export async function runLLM(prompt, { json = true, timeoutMs, image = null, tools = null, search = false } = {}) {
  const s = getSettings();
  const modelName = (s.aiModel || '').trim() || 'gemini-2.5-flash';
  const hasSearch = search || (Array.isArray(tools) && tools.some((t) => typeof t === 'string' && /search/i.test(t)));

  if (s.aiProvider === 'gemini') {
    return await callGemini({ key: s.aiKey, model: modelName, prompt, json, image, search: hasSearch });
  }
  if (s.aiProvider === 'claude-local') {
    try {
      return await callClaudeLocal({ prompt, tools, timeoutMs, image });
    } catch (e) {
      if (!e || !e.puenteCaido) throw e;
      if (!s.aiKey) throw e;
      if (/^gemini/i.test(modelName)) {
        return await callGemini({ key: s.aiKey, model: modelName, prompt, json, image, search: hasSearch });
      }
      return await callOpenAICompat({ key: s.aiKey, model: modelName, prompt, baseUrl: s.aiBaseUrl, json, image });
    }
  }
  return await callOpenAICompat({ key: s.aiKey, model: modelName, prompt, baseUrl: s.aiBaseUrl, json, image });
}

// Intenta cerrar un JSON que llego cortado: recorre el texto contando llaves y
// corchetes (ignorando los que van dentro de una cadena) y cierra lo que quede
// abierto. Asi una respuesta truncada conserva los elementos completos.
function repairJson(src) {
  const stack = [];
  let inStr = false;
  let esc = false;
  let cut = -1;          // ultimo cierre que deja un valor completo
  let cutStack = null;   // como estaba la pila justo en ese punto
  for (let i = 0; i < src.length; i++) {
    const ch = src[i];
    if (inStr) {
      if (esc) esc = false;
      else if (ch === '\\') esc = true;
      else if (ch === '"') inStr = false;
      continue;
    }
    if (ch === '"') inStr = true;
    else if (ch === '{' || ch === '[') stack.push(ch === '{' ? '}' : ']');
    else if (ch === '}' || ch === ']') {
      stack.pop();
      cut = i;
      cutStack = [...stack];
    }
  }
  if (cut < 0 || !cutStack || !cutStack.length) return null;
  const head = src.slice(0, cut + 1).replace(/,\s*$/, '');
  return head + cutStack.reverse().join('');
}

export function extractJson(text) {
  if (!text) return null;
  const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
  const tries = [cleaned];
  // Busca el primer array u objeto JSON dentro del texto.
  for (const [open, close] of [['[', ']'], ['{', '}']]) {
    const start = cleaned.indexOf(open);
    const end = cleaned.lastIndexOf(close);
    if (start >= 0 && end > start) tries.push(cleaned.slice(start, end + 1));
    if (start >= 0) {
      const fixed = repairJson(cleaned.slice(start));
      if (fixed) tries.push(fixed);
    }
  }
  for (const t of tries) {
    try {
      return JSON.parse(t);
    } catch {
      /* prueba el siguiente */
    }
  }
  return null;
}

function normalize(raw, topicId, idx) {
  if (!raw || typeof raw !== 'object') return null;
  const base = {
    id: `ia-${topicId}-${Date.now()}-${idx}`,
    conceptId: String(raw.conceptId || `${topicId}:ia`),
    translation: String(raw.translation || '').trim(),
    explanation: String(raw.explanation || '').trim(),
    anweisung: raw.anweisung ? String(raw.anweisung).trim() : undefined,
    context: raw.context ? String(raw.context).trim() : undefined,
    source: 'ia'
  };
  
  if (raw.type === 'order' && Array.isArray(raw.solution) && raw.solution.length >= 3) {
    return {
      ...base,
      type: 'order',
      solution: raw.solution.map(String),
      tokens: (Array.isArray(raw.tokens) && raw.tokens.length ? raw.tokens : raw.solution).map(String),
      sentence: raw.sentence || raw.solution.join(' ')
    };
  }
  if (raw.type === 'write' && raw.answer && String(raw.sentence || '').includes('___')) {
    return { ...base, type: 'write', sentence: String(raw.sentence), answer: String(raw.answer) };
  }
  // Cuatro es lo que piden las plantillas y lo que se le pide a la IA, pero
  // se aceptan tres: un ejercicio con una opción de menos vale igual, y
  // descartarlo por eso deja la tanda más corta sin ganar nada.
  if (raw.type === 'mc' && Array.isArray(raw.options)
      && raw.options.length >= 3 && raw.options.length <= 4 && raw.answer) {
    const options = raw.options.map(String);
    if (!options.includes(String(raw.answer))) return null;
    if (!String(raw.sentence || '').includes('___')) return null;
    return { ...base, type: 'mc', sentence: String(raw.sentence), options, answer: String(raw.answer) };
  }
  if (raw.type === 'cloze' && raw.clozeText && Array.isArray(raw.clozeAnswers)) {
    let clozeText = String(raw.clozeText);
    const clozeAnswers = raw.clozeAnswers.map(String);
    
    // Si la IA ha puesto [palabra] o (palabra) en vez de ___, lo arreglamos
    let missingGaps = clozeAnswers.length - (clozeText.match(/___/g) || []).length;
    if (missingGaps > 0) {
      for (const a of clozeAnswers) {
        if (!a) continue;
        const escaped = a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`[\\(\\[\\{]${escaped}[\\)\\]\\}]`, 'gi');
        clozeText = clozeText.replace(regex, '___');
      }
    }

    // Si aún faltan huecos, es que la IA ni siquiera puso corchetes y devolvió la frase entera sin huecos.
    // Sustituimos la respuesta directamente por ___ (solo la primera vez para no romper palabras repetidas).
    missingGaps = clozeAnswers.length - (clozeText.match(/___/g) || []).length;
    if (missingGaps > 0) {
      for (const a of clozeAnswers) {
        if (!a) continue;
        const escaped = a.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // Reemplazar solo la palabra entera, no partes de palabras.
        const regex = new RegExp(`\\b${escaped}\\b`, 'i');
        // Solo reemplazar si hay menos huecos que respuestas.
        if ((clozeText.match(/___/g) || []).length < clozeAnswers.length) {
          clozeText = clozeText.replace(regex, '___');
        }
      }
    }

    return { 
      ...base, 
      type: 'cloze', 
      clozeText, 
      clozeAnswers,
      clozeChoices: Array.isArray(raw.clozeChoices) ? raw.clozeChoices.map(String) : []
    };
  }
  if (raw.type === 'open' && raw.sentence) {
    return { ...base, type: 'open', sentence: String(raw.sentence), answer: raw.answer ? String(raw.answer) : undefined };
  }
  
  return null;
}

export async function generateItems({ topicId, topicName, conceptHints = [], count = 3, avoid = [], reto = false }) {
  if (!aiAvailable()) return [];
  const prompt = buildPrompt({ topicName, conceptHints, count, avoid, reto });
  const text = await runLLM(prompt);
  const arr = extractJson(text);
  if (!Array.isArray(arr)) return [];
  return arr
    .map((r, i) => normalize(r, topicId, i))
    .filter(Boolean)
    .map((it) => ({ ...it, prompt: it.anweisung || it.prompt || t('ai.doExercise') }));
}

// Genera un mazo de vocabulario A2-B1 sobre un tema libre + un texto corto.
// Ejercicios sobre la explicacion que el alumno acaba de pedir. Lo que se le
// pasa es la propia respuesta: si ha preguntado "dich oder dir", los ejercicios
// tienen que ser de eso y de nada mas.
export async function generateAskItems({ pregunta, res, count = 8 }) {
  if (!aiAvailable()) throw new Error(t('err.aiPractise'));
  const trozos = [];
  if (res?.titel) trozos.push(res.titel);
  if (res?.kurz) trozos.push(res.kurz);
  for (const sec of res?.abschnitte || []) {
    if (sec.title) trozos.push(sec.title);
    if (sec.body) trozos.push(sec.body);
    for (const b2 of sec.beispiele || []) trozos.push(`${b2.de} — ${b2.es}`);
  }
  for (const f of res?.fehler || []) trozos.push('Fallo típico: ' + f);
  const explicacion = trozos.join('\n').slice(0, 3500);

  const prompt = `Eres profesor de aleman para hablantes de ${idiomaAlumno()} de nivel A2-B1.

El alumno ha preguntado: "${pregunta}"

Y esta es la explicacion que acaba de leer:
"""
${explicacion}
"""
${bloqueEstiloClase()}
Crea ${count} ejercicios PARA COMPROBAR SI HA ENTENDIDO ESA EXPLICACION.

- Cada ejercicio tiene que practicar exactamente lo que se explica arriba, no
  otra cosa parecida. Si la explicacion es de "dich" frente a "dir", todos los
  ejercicios van de eso.
- Empieza por los casos claros y termina por los que la explicacion marca como
  fallo tipico: ahi es donde se ve si lo ha pillado.
- Frases nuevas, no las mismas de los ejemplos.
- Al menos la MITAD que no sean "mc": elegir entre tres opciones se acierta por
  descarte y no demuestra nada.

Devuelve un array JSON. Cada elemento:
{
  "type": "mc" | "order" | "write",
  "conceptId": "cadena corta con lo que se practica",
  "sentence": "para mc y write: frase con ___ donde va el hueco; para order: la frase completa correcta",
  "options": ["op1","op2","op3","op4"],
  "answer": "lo que va en el hueco, exacto (mc y write)",
  "tokens": ["la","frase","troceada"],
  "solution": ["orden","correcto","de","los","tokens"],
  "translation": "traduccion a ${idiomaAlumno()} de la frase correcta",
  "explanation": "por que es esa, en ${idiomaAlumno()}, una frase"
}
En "write" el hueco tiene que tener UNA sola solucion razonable.
Sin texto fuera del JSON. Aleman estandar, con esszet cuando corresponda.`;

  const text = await runLLM(prompt);
  const arr = extractJson(text);
  if (!Array.isArray(arr)) throw new Error(t('err.noValidItems'));
  const items = arr
    .map((r, i) => normalize(r, 'ask', i))
    .filter(Boolean)
    .map((it) => ({ ...it, prompt: it.type === 'order' ? t('ai.orderSentence') : t('frames.pickOneFull') }));
  if (!items.length) throw new Error(t('err.noUsableItems'));
  return items;
}

export async function generateVocab({ theme, count = 18 }) {
  if (!aiAvailable()) throw new Error(t('err.aiVocab'));
  const prompt = `Eres profesor de aleman para hablantes de ${idiomaAlumno()} (nivel A2-B1).
Tema: "${theme}".
Devuelve SOLO un objeto JSON con esta forma:
{
  "name": "nombre corto del mazo en ${idiomaAlumno()}",
  "emoji": "un emoji que represente el tema",
  "cards": [
    { "de": "palabra o expresion en aleman", "es": "traduccion a ${idiomaAlumno()}", "ex": "frase de ejemplo en aleman (A2-B1)", "exEs": "traduccion de la frase" }
  ],
  "text": "un texto corto en aleman (60-90 palabras) que use varias de las palabras del mazo",
  "textEs": "la traduccion del texto a ${idiomaAlumno()}"
}
Incluye ${count} tarjetas utiles y frecuentes (mezcla sustantivos con articulo, verbos y expresiones). Sin texto fuera del JSON.`;

  const text = await runLLM(prompt);
  const obj = extractJson(text);
  const raw = Array.isArray(obj) ? { cards: obj } : obj;
  if (!raw || !Array.isArray(raw.cards)) throw new Error(t('err.noDeck'));
  const cards = raw.cards
    .map((c) => ({
      de: String(c.de || '').trim(),
      es: String(c.es || '').trim(),
      ex: String(c.ex || '').trim(),
      exEs: String(c.exEs || '').trim()
    }))
    .filter((c) => c.de && c.es);
  if (!cards.length) throw new Error(t('err.noCards'));
  return {
    name: String(raw.name || theme).trim().slice(0, 60),
    emoji: String(raw.emoji || '✨').trim().slice(0, 4) || '✨',
    cards,
    text: raw.text ? String(raw.text).trim() : null,
    textEs: raw.textEs ? String(raw.textEs).trim() : null
  };
}

// Genera un tema completo de gramática con IA: tarjetas de teoría, explicación
// estructurada (con tablas y ejemplos) y ejercicios interactivos para practicar.
export async function generateGrammarTopic({ topicName, niveau = 'A2' }) {
  if (!aiAvailable()) throw new Error(t('err.aiAsk'));
  const prompt = `Eres profesor de alemán para hispanohablantes (nivel A2-B1).
El alumno quiere aprender y practicar este tema gramatical: "${topicName}".

Genera un tema completo de gramática con:
1) Tarjetas de teoría (reglas, fórmulas o estructuras clave con ejemplos).
2) Explicación teórica clara, con secciones, tablas comparativas y errores comunes.
3) Entre 8 y 12 ejercicios interactivos variados (opción múltiple 'mc', escribir 'write', ordenar frase 'order').

Devuelve SOLO un objeto JSON con este formato exacto:
{
  "name": "nombre del tema en alemán (ej. 'Wechselpräpositionen' o 'Modalverben im Präteritum')",
  "nameEs": "nombre del tema en ${idiomaAlumno()} (ej. 'Preposiciones de cambio' o 'Verbos modales en pasado')",
  "emoji": "un emoji representativo (ej. 🧭, 🏷️, ⏱️, ⚡, 📖)",
  "blurb": "resumen en 1 frase de lo que se aprende",
  "cards": [
    {
      "de": "regla, estructura o caso en alemán",
      "es": "explicación o uso en español",
      "ex": "frase de ejemplo completa en alemán",
      "exEs": "traducción de la frase al español"
    }
  ],
  "theory": {
    "intro": "introducción clara y práctica en español (2-3 frases)",
    "sections": [
      {
        "title": "título de la sección",
        "body": "explicación clara de la regla",
        "examples": [
          { "de": "ejemplo en alemán", "es": "traducción en español" }
        ],
        "table": {
          "title": "título de la tabla resumen",
          "headers": ["Columna 1", "Columna 2"],
          "rows": [["valor 1", "valor 2"]]
        }
      }
    ],
    "pitfalls": ["error típico que cometen los hispanohablantes con este tema"],
    "merksatz": "regla de oro o truco mnemotécnico para no olvidarlo"
  },
  "exercises": [
    {
      "type": "mc",
      "sentence": "Oración en alemán con ___ donde va el hueco",
      "options": ["opción correcta", "distractor 1", "distractor 2", "distractor 3"],
      "answer": "opción correcta",
      "translation": "traducción de la oración al español",
      "explanation": "breve explicación de por qué es esa opción"
    },
    {
      "type": "write",
      "sentence": "Oración en alemán con ___ para completar",
      "answer": "palabra_exacta",
      "translation": "traducción de la oración",
      "explanation": "explicación"
    },
    {
      "type": "order",
      "solution": ["Ich", "gehe", "morgen", "ins", "Kino"],
      "translation": "Mañana voy al cine",
      "explanation": "El verbo va en segunda posición"
    }
  ]
}

Reglas:
- Entre 6 y 10 "cards" útiles con ejemplos claros.
- 2 a 3 "sections" en theory con ejemplos y tabla comparativa si procede.
- 8 a 12 ejercicios de calidad ("exercises") mezclando 'mc', 'write' y 'order'.
- Alemán natural y gramaticalmente impecable.
Sin texto fuera del JSON.`;

  const text = await runLLM(prompt);
  const raw = extractJson(text);
  if (!raw || (!raw.name && !raw.nameEs)) throw new Error(t('err.noAnswer'));

  const cleanTable = (t) =>
    t && Array.isArray(t.headers) && Array.isArray(t.rows) && t.rows.length
      ? {
          title: String(t.title || '').trim(),
          headers: t.headers.map(String),
          rows: t.rows.filter(Array.isArray).map((r) => r.map(String))
        }
      : null;

  const rawCards = Array.isArray(raw.cards) ? raw.cards : [];
  const cards = rawCards
    .map((c) => ({
      de: String(c.de || '').trim(),
      es: String(c.es || '').trim(),
      ex: String(c.ex || '').trim(),
      exEs: String(c.exEs || '').trim()
    }))
    .filter((c) => c.de && c.es);

  const rawTheory = raw.theory || {};
  const sections = (Array.isArray(rawTheory.sections) ? rawTheory.sections : [])
    .map((s) => ({
      title: String(s.title || '').trim(),
      body: String(s.body || '').trim(),
      table: cleanTable(s.table),
      examples: (Array.isArray(s.examples) ? s.examples : [])
        .map((b) => ({ de: String(b.de || '').trim(), es: String(b.es || '').trim() }))
        .filter((b) => b.de)
    }))
    .filter((s) => s.title || s.body);

  const rawExercises = Array.isArray(raw.exercises) ? raw.exercises : [];
  const userItems = rawExercises
    .map((e, idx) => normalize(e, 'ug', idx))
    .filter(Boolean);

  const topicId = 'ug-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 6);

  return {
    id: topicId,
    name: String(raw.name || topicName).trim(),
    nameEs: String(raw.nameEs || raw.name || topicName).trim(),
    emoji: String(raw.emoji || '📖').trim().slice(0, 4) || '📖',
    blurb: String(raw.blurb || topicName).trim(),
    custom: true,
    concepts: [
      { id: `${topicId}:c1`, name: String(raw.name || topicName), label: String(raw.nameEs || topicName) }
    ],
    cards,
    theory: {
      intro: String(rawTheory.intro || raw.blurb || '').trim(),
      sections,
      pitfalls: Array.isArray(rawTheory.pitfalls) ? rawTheory.pitfalls.map(String) : [],
      merksatz: String(rawTheory.merksatz || '').trim()
    },
    userItems
  };
}

// Explicacion mas profunda y personalizada de un ejercicio concreto.
// Se usa desde el panel de feedback ("Pregúntale a la IA").
export async function explainItem({ item, chosen }) {
  if (!aiAvailable()) throw new Error(t('err.aiSettings'));
  const frase =
    item.type === 'order'
      ? item.solution.join(' ')
      : item.type === 'judge'
      ? item.correctForm
      : String(item.sentence).replace('___', item.answer);
  const prompt = `Ejercicio de aleman (A2-B1). Frase correcta: "${frase}".
Respuesta correcta: "${item.type === 'order' ? item.solution.join(' ') : item.answer}".
${chosen && chosen !== item.answer ? `El alumno eligio: "${chosen}".` : ''}
Explica en ${idiomaAlumno()}, en 3-4 frases claras: por que es correcta, que error refleja la opcion equivocada (si la hay),
la regla general, y un ejemplo nuevo y corto. Sin markdown, sin listas.`;
  // esta respuesta es texto plano, no JSON
  const text = await runLLM(prompt, { json: false });
  return String(text).replace(/```/g, '').trim();
}

// ---------- Cuaderno: pasar apuntes a limpio y generar repaso ----------

function lektionGuide(lektion) {
  return lektionSummary(lektion);
}

// Bloque del prompt con SOLO la parte de la lección que se quiere practicar.
function focusBlock(lektion, focus) {
  if (!lektion) return '';
  const out = [];
  const wants = (k) => focus === 'alles' || focus === k;

  if (wants('woerter') && lektion.woerter?.length) {
    out.push('VOCABULARIO (Wörter) — usa estas palabras:');
    for (const g of lektion.woerter) {
      out.push(`- ${g.thema}: ${g.items.map((i) => `${i.de} (${i.es})`).join(', ')}`);
    }
  }
  if (wants('grammatik') && lektion.grammatik?.length) {
    out.push('GRAMÁTICA (Grammatik) — practica estas reglas:');
    for (const g of lektion.grammatik) {
      const ex = (g.beispiele || []).map((b) => b.de).join(' | ');
      out.push(`- ${g.regel}. ${g.erklaerung}${ex ? ` Ej.: ${ex}` : ''}`);
    }
  }
  if (wants('kommunikation') && lektion.kommunikation?.length) {
    out.push('COMUNICACIÓN (Kommunikation) — practica estas funciones y frases:');
    for (const k of lektion.kommunikation) {
      out.push(`- ${k.funktion}: ${(k.wendungen || []).map((w) => w.de).join(' | ')}`);
    }
  }
  return out.join('\n');
}

const FOCUS_LABEL = {
  woerter: 'el VOCABULARIO de la lección',
  grammatik: 'la GRAMÁTICA de la lección',
  kommunikation: 'las FUNCIONES COMUNICATIVAS de la lección',
  notizen: 'los APUNTES de clase del alumno',
  alles: 'todo el contenido de la lección'
};

// Ejercicios de una Lektion del libro, enfocados en un bloque (W / G / K / apuntes / todo).
export async function generateLektionItems({ lektion, focus = 'alles', notes = '', count = 10 }) {
  if (!aiAvailable()) throw new Error(t('err.aiExercises'));

  const bloque = focus === 'notizen' ? '' : focusBlock(lektion, focus);
  const apuntes = notes.trim().slice(0, 4000);
  if (focus === 'notizen' && !apuntes) {
    throw new Error(t('err.noNotes'));
  }

  const prompt = `Eres profesor de alemán para hablantes de ${idiomaAlumno()}. Nivel del libro: ${lektion?.bandName || 'A2'}.
Lección: ${lektion ? `${lektion.nr === 'Start' ? 'Start' : 'Lektion ' + lektion.nr}: ${lektion.name}` : '—'}.

${bloque}
${apuntes ? `\nAPUNTES DE CLASE DEL ALUMNO:\n"""\n${apuntes}\n"""` : ''}

Crea ${count} ejercicios complejos centrados en ${FOCUS_LABEL[focus] || 'la lección'}.
Reglas obligatorias:
1. Usa SOLO vocabulario y estructuras de esta lección (o más simples). No introduzcas gramática de niveles superiores.
2. Cada ejercicio debe practicar un punto concreto de la lista de arriba.
3. INSTRUCCIONES (anweisung): Cada ejercicio DEBE tener una instrucción clara y específica (ej. "Transforma estas frases al Perfekt", "Escribe el artículo de esta palabra", "Ordena esta conversación", "Lee el texto y responde").
4. TIPOS DE EJERCICIO:
   - "mc": Elegir entre 4 opciones. (Bueno para vocabulario o comprensión).
   - "order": Ordenar fichas (pueden ser palabras sueltas de una frase, o frases enteras para ordenar una conversación).
   - "write": Hueco exacto a rellenar con UNA sola palabra (plurales, determinantes, conjugaciones).
   - "cloze": Texto largo con múltiples huecos.
   - "open": Pregunta abierta o de redacción (ej. "Responde libremente con 15 palabras", o "Transforma las dos frases con weil").
5. Las frases deben ser realistas y de uso cotidiano.
${bloqueEstiloClase()}
Devuelve un array JSON. Cada elemento:
{
  "type": "mc" | "order" | "write" | "cloze" | "open",
  "conceptId": "cadena corta (p. ej. konjunktion-weil)",
  "anweisung": "instrucción clara para el alumno",
  "context": "OPCIONAL. Texto de lectura para poner antes del ejercicio (ej. en mc o cloze)",
  
  // Para mc, open y write:
  "sentence": "frase con ___ donde va el hueco, o la pregunta abierta",
  "options": ["op1", "op2", "op3", "op4"], // solo para mc
  "answer": "respuesta exacta", // para mc, write. Para open, pon una respuesta modelo ideal.
  
  // Para order:
  "tokens": ["la", "frase", "troceada", "o", "las", "frases", "de", "la", "conversacion"],
  "solution": ["orden", "correcto"],
  
  // Para cloze:
  "clozeText": "Gestern bin ich in ___ Stadt gegangen. Dort habe ich ___ Kaffee getrunken. (OJO: usa siempre ___ para los huecos, NUNCA corchetes ni paréntesis)",
  "clozeAnswers": ["die", "einen"],
  "clozeChoices": ["die", "der", "das", "einen", "ein", "eine"], // opcional, palabras mezcladas para elegir
  
  "translation": "traducción a ${idiomaAlumno()} (del texto, frase o pregunta)",
  "explanation": "explicación breve en ${idiomaAlumno()}"
}
Sin texto fuera del JSON. Alemán estándar (variantes austriacas si aparecen en la lección), con ß cuando corresponda.`;

  const text = await runLLM(prompt);
  const arr = extractJson(text);
  if (!Array.isArray(arr)) throw new Error(t('err.noValidItems'));
  const items = arr
    .map((r, i) => normalize(r, 'cuaderno', i))
    .filter(Boolean)
    .map((it) => ({ ...it, prompt: it.anweisung || t('ai.doExercise') }));
  if (!items.length) throw new Error(t('err.noUsableItems'));
  return items;
}

// Reescribe unos apuntes de clase desordenados en un resumen claro (texto plano).
// ---------- Foto de un ejercicio o de una imagen ----------
// Necesita el puente local: el CLI guarda la foto en un temporal y la lee.
// modo 'aufgabe' = resolver/corregir un ejercicio · 'bild' = describir la imagen.
export async function analyzeImage({ dataUrl, modo = 'aufgabe', lektion = null, niveau = 'A2' }) {
  const s = getSettings();
  if (!aiAvailable()) throw new Error(t('err.aiPhoto'));
  if (!dataUrl) throw new Error(t('err.pickPhoto'));

  const idioma = langName(getLang());
  const contexto = lektion ? `\nEl alumno está en ${lektion.bandName} — ${lektion.name}.` : '';

  const tarea =
    modo === 'aufgabe'
      ? `La foto es un EJERCICIO de alemán (de un libro, una ficha o la pizarra).
Transcríbelo, resuélvelo y explica cada respuesta.
Si en la foto ya hay respuestas escritas a mano por el alumno, corrígelas: di cuáles están bien
y cuáles mal, y por qué.
Si la foto no se lee bien o no es un ejercicio, dilo en "problema" y deja "aufgaben" vacío.`
      : `La foto es una IMAGEN cualquiera (una escena, un objeto, un cartel, una foto personal).
Descríbela en alemán como material para aprender: qué se ve, dónde, qué pasa.
Saca de ella vocabulario útil y unas frases hechas para hablar de esa escena.
Si la foto está muy borrosa o vacía, dilo en "problema".

TODOS los ítems van dentro de "bloecke", SIEMPRE, aunque la hoja traiga un solo
ejercicio: entonces es un bloque único. Un bloque por cada instrucción impresa
que veas (3, 4, 5a, 5b…), con los ítems que le corresponden y en el orden del
papel. No dejes "bloecke" vacío.`;

  const formato =
    modo === 'aufgabe'
      ? `{
  "titel": "de qué va el ejercicio, en ${idioma}",
  "problema": null,
  "transkription": "el enunciado y los ítems tal como aparecen en la foto",
  "bloecke": [
    {
      "anweisung": "la instrucción impresa de ESTE ejercicio, copiada tal cual y en su idioma (p. ej. «3 Markieren Sie und ergänzen Sie die Sätze.»). Cadena vacía si la hoja no trae ninguna",
      "wieLoesen": "en ${idioma} y en UNA frase: qué hay que hacer aquí y con qué regla se resuelve (p. ej. «Unir las dos frases con weil: el verbo conjugado se va al final»). Siempre, aunque la instrucción impresa no se vea",
      "aufgaben": [
        {
          "nummer": "solo el número del ítem, corto: 1, 3.2, 5a. Nada más: ni «(ejemplo)» ni texto",
          "frage": "el ítem tal cual está en la foto",
          "antwort": "la respuesta correcta",
          "deinAntwort": "lo que había escrito el alumno, o null si estaba en blanco",
          "richtig": true,
          "warum": "por qué es esa, en ${idioma}, 1-2 frases"
        }
      ]
    }
  ],
  "regel": { "titel": "la regla que se practica aquí", "erklaerung": "explicación en ${idioma}" },
  "woerter": [ { "de": "palabra útil del ejercicio", "es": "traducción a ${idioma}" } ]
}`
      : `{
  "titel": "un título corto para la imagen, en alemán",
  "problema": null,
  "beschreibung": "descripción en alemán, 4-6 frases, nivel ${niveau}",
  "beschreibungEs": "la misma descripción en ${idioma}",
  "woerter": [ { "de": "palabra de la imagen (con artículo si es sustantivo)", "es": "traducción a ${idiomaAlumno()}" } ],
  "saetze": [ { "de": "frase útil para hablar de esta escena", "es": "traducción a ${idiomaAlumno()}" } ],
  "fragen": [ { "frage": "pregunta en alemán sobre la imagen", "antwort": "respuesta corta en alemán" } ]
}`;

  const prompt = `Eres profesor de alemán para un alumno de nivel ${niveau}.${contexto}

${tarea}

Los textos explicativos, en ${idioma}. El alemán se queda en alemán.
${modo === 'bild' ? 'Incluye 10-14 "woerter", 4-5 "saetze" y 3 "fragen".' : 'Incluye 5-8 "woerter".'}

Devuelve SOLO un objeto JSON:
${formato}
Si algo va mal, rellena "problema" con la explicación en ${idioma} y deja el resto vacío.
Sin texto fuera del JSON.`;

  const text = await runLLM(prompt, { json: true, timeoutMs: 300000, image: dataUrl, tools: ['Read'] });
  const raw = extractJson(text);
  if (!raw) {
    const pista = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 160);
    throw new Error(t('err.readPhoto') + (pista ? t('err.gotBack', { pista }) : ''));
  }
  const limpiarItems = (arr) =>
    (Array.isArray(arr) ? arr : [])
      .map((a) => ({
        // solo el numero: el modelo colaba aqui cosas como "(ejemplo)" y en una
        // columna estrecha se partia en dos lineas y descuadraba la fila
        nummer: String(a.nummer || '').trim().slice(0, 6),
        frage: String(a.frage || '').trim(),
        antwort: String(a.antwort || '').trim(),
        deinAntwort: a.deinAntwort ? String(a.deinAntwort).trim() : null,
        richtig: a.richtig !== false,
        warum: String(a.warum || '').trim()
      }))
      .filter((a) => a.frage || a.antwort);

  const pares = (arr, a, b) =>
    (Array.isArray(arr) ? arr : [])
      .map((x) => ({ [a]: String(x[a] || '').trim(), [b]: String(x[b] || '').trim() }))
      .filter((x) => x[a]);

  return {
    modo,
    titel: String(raw.titel || '').trim(),
    problema: raw.problema ? String(raw.problema).trim() : null,

    transkription: String(raw.transkription || '').trim(),
    // Una hoja suele traer varios ejercicios, cada uno con su instrucción. Se
    // devuelven agrupados para poder poner cada enunciado delante de LOS SUYOS.
    bloecke: (() => {
      const bs = (Array.isArray(raw.bloecke) ? raw.bloecke : [])
        .map((b) => ({
          anweisung: String(b.anweisung || '').trim(),
          wieLoesen: String(b.wieLoesen || '').trim(),
          aufgaben: limpiarItems(b.aufgaben)
        }))
        .filter((b) => b.aufgaben.length);
      if (bs.length) return bs;
      // Se le pide que agrupe siempre, pero si vuelve con la lista plana se
      // envuelve en un bloque: así la pantalla recibe una sola forma.
      const sueltos = limpiarItems(raw.aufgaben);
      return sueltos.length ? [{ anweisung: '', aufgaben: sueltos }] : [];
    })(),
    aufgaben: limpiarItems(raw.aufgaben),
    regel: raw.regel
      ? { titel: String(raw.regel.titel || '').trim(), erklaerung: String(raw.regel.erklaerung || '').trim() }
      : null,
    beschreibung: String(raw.beschreibung || '').trim(),
    beschreibungEs: String(raw.beschreibungEs || '').trim(),
    woerter: pares(raw.woerter, 'de', 'es'),
    saetze: pares(raw.saetze, 'de', 'es'),
    fragen: pares(raw.fragen, 'frage', 'antwort')
  };
}

export async function cleanNotes({ raw, lektion }) {
  if (!aiAvailable()) throw new Error(t('err.aiNotes'));
  // OJO: aquí NO se mete el temario de la lección (lektionSummary), solo su
  // nombre. Metiéndolo entero, el modelo se ponía a explicar vocabulario y
  // reglas de la lección que el alumno no había escrito en sus apuntes.
  const contexto = lektion
    ? `Contexto, SOLO para entender abreviaturas y saber el nivel: la clase era de ${lektionFullLabel(lektion)}. No uses esto para añadir contenido.`
    : '';
  const prompt = `Eres profesor de alemán de un alumno que habla ${idiomaAlumno()}, de nivel A2-B1.
El alumno ha tomado estos apuntes a mano durante la clase (pueden estar desordenados, con abreviaturas o errores):

"""
${raw}
"""

${contexto}

REGLA POR ENCIMA DE TODO: pasa a limpio SOLO el contenido de esos apuntes.
- No añadas reglas, temas, vocabulario ni consejos ajenos a los apuntes. Excepción:
  cuando una palabra o expresión corregida quedaría suelta en INFORMACIÓN ÚTIL, añade
  el ejemplo contextualizado breve que se pide en esa sección; usa solo el vocabulario
  adicional imprescindible para formar una frase natural.
- Si algo está abreviado o a medias, complétalo únicamente cuando sea evidente qué es.
- Si los apuntes son una lista de vocabulario, el resultado es esa lista ordenada y
  traducida, sin ejemplos añadidos. Que salga corto es correcto: no lo rellenes. La
  excepción son las palabras corregidas de una pregunta, que requieren un ejemplo si
  aparecen en INFORMACIÓN ÚTIL.
- Nada de "en esta lección también se ve...": eso no son sus apuntes.

Formato: texto plano, sin markdown. Títulos en MAYÚSCULAS y listas con guiones.
Incluye SOLO las secciones para las que haya material en los apuntes y sáltate el
resto sin mencionarlas:

RESUMEN
- 1 o 2 frases, solo si los apuntes dan para resumir algo. Si son una lista de palabras, no lo pongas.

GRAMÁTICA
- solo las reglas que aparezcan en los apuntes, cada una en una frase, con el ejemplo
  en alemán que haya escrito el alumno (y su traducción entre paréntesis).

VOCABULARIO
- solo las palabras que estén en los apuntes y merezcan la pena para un alumno A2-B1:
  prioriza verbos, adjetivos, sustantivos temáticos, expresiones y palabras menos
  transparentes o más útiles para expresarse. Omite vocabulario A1 muy básico
  (por ejemplo, palabras cotidianas obvias) salvo que sea necesario para entender
  los apuntes. No añadas palabras que el alumno no haya escrito.
- término en alemán (con artículo si es sustantivo) = traducción a ${idiomaAlumno()}.
- Si aparece una forma conjugada o declinada, puedes añadir el infinitivo o la forma
  base entre paréntesis, sin perder la forma original de los apuntes.

COMUNICACIÓN
- expresiones, preguntas prácticas, peticiones, respuestas o intenciones comunicativas
  que aparezcan en los apuntes. Escribe una formulación alemana natural y su traducción
  o el contexto de uso, según lo que el alumno haya anotado.

INFORMACIÓN ÚTIL
- solo aclaraciones prácticas breves que ayuden a recordar o usar lo anotado y que no
  encajen mejor en GRAMÁTICA, VOCABULARIO o COMUNICACIÓN. Cada línea debe aportar una
  regla, distinción o respuesta concreta; no incluyas relleno.
- No dejes palabras sueltas ni una corrección aislada. Para cada palabra o expresión,
  escribe SIEMPRE: forma alemana corregida → frase alemana completa y natural que la use
  (traducción a ${idiomaAlumno()}). El lado derecho nunca puede ser solo la misma palabra
  corregida. Usa este formato literal, sin negrita ni markdown:
  Müll → Wir bringen den Müll raus. (We take out the rubbish.)
  vermieten → Der Vermieter vermietet die Wohnung. (The landlord rents out the apartment.)
  einziehen → Wir ziehen nächste Woche in eine neue Wohnung ein. (We are moving into a new apartment next week.)
- La palabra puede aparecer dentro del ejemplo, pero no la resaltes en negrita. Para una
  regla, escribe la regla → ejemplo completo y su traducción.
- Si una corrección procede de una pregunta del alumno, explica brevemente qué significa
  o cuándo se usa; conserva la palabra corregida y acompáñala con el ejemplo.
- Si no puedes contextualizar una palabra con un ejemplo correcto a partir de las notas,
  ponla en VOCABULARIO o sáltatela; no la dejes suelta en INFORMACIÓN ÚTIL.

DUDAS
- usa esta sección solo si algo sigue siendo realmente ambiguo después de interpretarlo.

CLASIFICACIÓN DE PREGUNTAS Y CORRECCIONES
- Interpreta y resuelve las preguntas o fragmentos dudosos que el alumno haya escrito;
  no los copies en una sección llamada "QUESTIONS" ni los dejes sin clasificar.
- Errores de estructura, casos, artículos, conjugación u orden de palabras: corrígelos
  y ponlos en GRAMÁTICA, con una explicación breve si ayuda.
- Significado, traducción, ortografía o forma de una palabra: resuélvelo y ponlo en
  VOCABULARIO, respetando el nivel A2-B1 indicado arriba.
- Cómo formular algo en una situación real, preguntas y respuestas útiles o el registro
  formal/informal: pon la expresión corregida en COMUNICACIÓN.
- Usa solo el contexto escrito por el alumno para decidir; no inventes contenido.
- No escribas tablas ni una sección QUESTIONS: el resultado es texto plano, una línea por
  apunte corregido. La tabla de vocabulario la crea la aplicación. Usa la flecha solo para
  conectar la forma, regla o expresión con su ejemplo contextualizado.

Corrige los errores de alemán que veas (ortografía, artículos, mayúsculas).
Responde solo con el texto, sin comentarios previos.`;
  const text = await runLLM(prompt, { json: false });
  return String(text).replace(/```/g, '').trim();
}

// Genera ejercicios de repaso (mc / order) a partir de los apuntes de una clase.
export async function generateNotebookItems({ raw, clean, lektion, count = 20, ejercicios = [] }) {
  if (!aiAvailable()) throw new Error(t('err.aiExercises'));
  // Los apuntes a limpio si los has pasado; si no, lo que escribiste tal cual.
  const base = String(clean || raw || '').slice(0, 4000);
  // Y los ejercicios que hayas resuelto por foto EN ESTA MISMA NOTA: son del
  // mismo día y del mismo tema, así que valen como modelo y como contenido.
  const delDia = (Array.isArray(ejercicios) ? ejercicios : [])
    .slice(0, 8)
    .map((e) => `- ${e.anweisung ? e.anweisung + ' → ' : ''}"${e.frage}" (solución: ${e.antwort})`)
    .join('\n');
  const bloqueEjercicios = delDia
    ? `
LOS EJERCICIOS QUE HIZO ESE DIA EN CLASE (fotografiados de su libro):
${delDia}

Son del mismo dia y del mismo tema que los apuntes de arriba, asi que cuentan
igual que ellos: puedes practicar lo que aparece aqui. Y copia SU FORMATO: si
son de completar escribiendo o de transformar frases, haz eso.
`
    : '';
  // Aquí tampoco se mete el temario de la lección: metiéndolo, el modelo hacía
  // ejercicios de la lección y no de lo que el alumno había apuntado, que es
  // justo lo que se quería repasar.
  const prompt = `Eres profesor de alemán para hablantes de ${idiomaAlumno()}. Nivel: ${lektion?.bandName || 'A2'}.
Estos son los apuntes que ha tomado el alumno en clase:

"""
${base}
"""

${bloqueEjercicios}
Crea ${count} ejercicios complejos PARA REPASAR ESE DIA. La regla es una:

CADA ejercicio tiene que practicar algo que ESTE EN LOS APUNTES O EN LOS
EJERCICIOS DE ARRIBA — una palabra que aparezca ahi, o una regla que se
practique ahi. Si una palabra o una regla no esta en ninguno de los dos, no la
uses: da igual que salga en la leccion.

- Si los apuntes son sobre todo vocabulario, haz ejercicios con esas palabras.
- Si los apuntes traen reglas de gramática, practica esas reglas.
- No metas gramática por encima del nivel ${lektion?.bandName || 'A2'}.
- INSTRUCCIONES (anweisung): Cada ejercicio DEBE tener una instrucción clara y específica (ej. "Pon el artículo", "Responde libremente").
- TIPOS DE EJERCICIO: "mc", "order", "write" (hueco exacto), "cloze" (texto con huecos), "open" (pregunta de redacción libre o transformación).

Devuelve un array JSON. Cada elemento:
{
  "type": "mc" | "order" | "write" | "cloze" | "open",
  "conceptId": "cadena corta (p. ej. konjunktion-weil)",
  "anweisung": "instrucción clara para el alumno",
  "context": "OPCIONAL. Texto de lectura para poner antes del ejercicio",
  
  "sentence": "frase con ___ donde va el hueco, o la pregunta abierta",
  "options": ["op1", "op2", "op3", "op4"],
  "answer": "respuesta exacta",
  
  "tokens": ["la", "frase", "troceada"],
  "solution": ["orden", "correcto"],
  
  "clozeText": "Gestern bin ich in ___ Stadt gegangen. Dort habe ich ___ Kaffee getrunken. (OJO: usa siempre ___ para los huecos, NUNCA corchetes ni paréntesis)",
  "clozeAnswers": ["die", "einen"],
  "clozeChoices": ["die", "der", "das", "einen", "ein", "eine"],
  
  "translation": "traducción a ${idiomaAlumno()} de la frase correcta",
  "explanation": "explicación breve en ${idiomaAlumno()} de por qué"
}
Sin texto fuera del JSON. Alemán estándar, con ß cuando corresponda.`;
  const text = await runLLM(prompt);
  const arr = extractJson(text);
  if (!Array.isArray(arr)) throw new Error(t('err.noValidItems'));
  const items = arr
    .map((r, i) => normalize(r, 'cuaderno', i))
    .filter(Boolean)
    .map((it) => ({ ...it, prompt: it.anweisung || t('ai.doExercise') }));
  if (!items.length) throw new Error(t('err.noUsableItems'));
  return items;
}

// Conversación nativa: sobre una Lektion, sobre una función concreta, o sobre
// un tema libre que escriba el alumno.
export async function generateDialog({ lektion, funktion = null, thema = null, niveau = 'A2', turns = 14 }) {
  if (!aiAvailable()) throw new Error(t('err.aiDialog'));

  const nivel = lektion?.bandName || niveau;
  let contexto;
  if (thema) {
    contexto = `TEMA / SITUACIÓN QUE PIDE EL ALUMNO:
"""
${String(thema).trim()}
"""
Ambienta la conversación en esa situación. Si el tema es muy amplio, elige una escena concreta y realista.`;
  } else {
    const funktionen = funktion ? [funktion] : (lektion?.kommunikation || []);
    const bloque = funktionen
      .map((k) => `- ${k.funktion}: ${(k.wendungen || []).map((w) => w.de).join(' | ')}`)
      .join('\n');
    const vocab = (lektion?.woerter || [])
      .flatMap((g) => g.items.slice(0, 8).map((i) => i.de))
      .join(', ');
    contexto = `FUNCIONES COMUNICATIVAS QUE HAY QUE PRACTICAR:
${bloque}

VOCABULARIO DE LA LECCIÓN (úsalo): ${vocab}`;
  }

  const prompt = `Eres guionista de materiales de alemán para hablantes de ${idiomaAlumno()}. Nivel: ${nivel}.
${lektion ? `Lección del libro: Lektion ${lektion.nr}: ${lektion.name}.` : ''}

${contexto}

Escribe UNA conversación en alemán como la tendrían dos hablantes nativos en una situación real y cotidiana.
Requisitos:
1. ${turns} intervenciones alternas entre dos personas con nombre.
2. Alemán natural y hablado (usa "ja", "also", "na ja", "echt?", "oder?", partículas modales como "doch", "mal", "denn").
   Nada de frases de libro rígidas, pero SIN pasarte del nivel ${nivel}.
3. ${thema
    ? 'Que la conversación sea útil de verdad para esa situación: las frases que se dirían realmente ahí.'
    : 'Debe usar de forma natural las funciones comunicativas de arriba (no todas a la fuerza, pero sí varias).'}
4. Alemán de Austria: usa las variantes austriacas cuando encajen (Servus, Jänner, Erdäpfel, Sackerl, sich ausmachen…).
5. Cada intervención lleva su traducción a ${idiomaAlumno()} natural (no literal).

Devuelve SOLO un objeto JSON:
{
  "titel": "título corto en alemán",
  "situation": "1 frase en ${idiomaAlumno()} explicando dónde y entre quién ocurre",
  "personen": ["Nombre1", "Nombre2"],
  "turns": [ { "wer": "Nombre1", "de": "…", "es": "…" } ],
  "wendungen": [ { "de": "expresión útil que aparece en el diálogo", "es": "traducción a ${idiomaAlumno()}", "wann": "cuándo se usa" } ],
  "fragen": [ { "frage": "pregunta de comprensión en alemán", "antwort": "respuesta corta en alemán" } ]
}
Incluye 5-7 entradas en "wendungen" y 3 en "fragen". Sin texto fuera del JSON.`;

  const text = await runLLM(prompt);
  const raw = extractJson(text);
  if (!raw || !Array.isArray(raw.turns) || !raw.turns.length) {
    throw new Error(t('err.noDialog'));
  }
  return {
    titel: String(raw.titel || 'Dialog').trim(),
    situation: String(raw.situation || '').trim(),
    personen: Array.isArray(raw.personen) ? raw.personen.map(String) : [],
    turns: raw.turns
      .map((t) => ({ wer: String(t.wer || '').trim(), de: String(t.de || '').trim(), es: String(t.es || '').trim() }))
      .filter((t) => t.de),
    wendungen: Array.isArray(raw.wendungen)
      ? raw.wendungen.map((w) => ({
          de: String(w.de || '').trim(),
          es: String(w.es || '').trim(),
          wann: String(w.wann || '').trim()
        })).filter((w) => w.de)
      : [],
    fragen: Array.isArray(raw.fragen)
      ? raw.fragen.map((f) => ({
          frage: String(f.frage || '').trim(),
          antwort: String(f.antwort || '').trim()
        })).filter((f) => f.frage)
      : []
  };
}

// Resuelve una duda de gramática concreta: explicación + tablas + ejemplos.
export async function explainGrammar({ query, niveau = 'A2' }) {
  if (!aiAvailable()) throw new Error(t('err.aiAsk'));
  if (!query?.trim()) throw new Error(t('err.writeQuestion'));

  const prompt = `Eres profesor de alemán para hablantes de ${idiomaAlumno()}. El alumno está en nivel ${niveau}
y sigue el libro Miteinander (alemán de Austria).

DUDA DEL ALUMNO:
"""
${query.trim()}
"""

Respóndele en ESPAÑOL, de forma clara y práctica, adaptada a su nivel. Si la duda es muy amplia,
céntrate en lo que necesita a nivel ${niveau}. Si la pregunta tiene un error de base
(por ejemplo, parte de una idea equivocada), corrígeselo con tacto en "kurz".

Devuelve SOLO un objeto JSON:
{
  "titel": "título corto del tema en ${idiomaAlumno()}",
  "kurz": "la respuesta en 1-2 frases, lo esencial",
  "abschnitte": [
    {
      "title": "subtítulo del bloque",
      "body": "explicación en 2-4 frases",
      "tabelle": { "title": "título de la tabla", "headers": ["…"], "rows": [["…"]] },
      "beispiele": [ { "de": "frase en alemán", "es": "traducción a ${idiomaAlumno()}" } ]
    }
  ],
  "fehler": ["error típico de quien habla ${idiomaAlumno()} con este tema", "…"],
  "merksatz": "una regla mnemotécnica corta para recordarlo"
}

Reglas:
- Entre 2 y 4 "abschnitte".
- Incluye "tabelle" SIEMPRE que ayude (conjugaciones, declinaciones, casos, comparaciones). Si un bloque
  no la necesita, pon null.
- 2-3 "beispiele" por bloque, con frases realistas y del nivel ${niveau}.
- 2-3 entradas en "fehler", pensadas para quien habla ${idiomaAlumno()}.
- Alemán correcto, con ß donde toque.
Sin texto fuera del JSON.`;

  const text = await runLLM(prompt);
  const raw = extractJson(text);
  if (!raw || (!raw.kurz && !Array.isArray(raw.abschnitte))) {
    throw new Error(t('err.noAnswer'));
  }
  const cleanTable = (t) =>
    t && Array.isArray(t.headers) && Array.isArray(t.rows) && t.rows.length
      ? {
          title: String(t.title || '').trim(),
          headers: t.headers.map(String),
          rows: t.rows.filter(Array.isArray).map((r) => r.map(String))
        }
      : null;
  return {
    titel: String(raw.titel || query).trim(),
    kurz: String(raw.kurz || '').trim(),
    abschnitte: (Array.isArray(raw.abschnitte) ? raw.abschnitte : [])
      .map((s) => ({
        title: String(s.title || '').trim(),
        body: String(s.body || '').trim(),
        tabelle: cleanTable(s.tabelle),
        beispiele: (Array.isArray(s.beispiele) ? s.beispiele : [])
          .map((b) => ({ de: String(b.de || '').trim(), es: String(b.es || '').trim() }))
          .filter((b) => b.de)
      }))
      .filter((s) => s.title || s.body),
    fehler: (Array.isArray(raw.fehler) ? raw.fehler : []).map(String).filter(Boolean),
    merksatz: String(raw.merksatz || '').trim()
  };
}

// ---------- Noticias de Austria / Viena ----------
// Necesita búsqueda web real: solo funciona con el puente local (claude -p con
// WebSearch). Con Gemini/OpenAI no hay búsqueda, y unas noticias inventadas
// serían peor que nada, así que se avisa en vez de intentarlo.
//
// Se pide UNA sección cada vez. Las cuatro juntas tardaban siete u ocho minutos
// y el puente corta a los diez; por separado cada pestaña vuelve en un par.
export const NEWS_SECCIONES = ['news', 'wissen', 'events', 'sport', 'wetter'];

const NEWS_REGLAS = `REGLAS INNEGOCIABLES:
- Usa SOLO lo que hayas encontrado de verdad en la búsqueda. No inventes NADA.
- Las URL deben ser exactamente las que has visto. Sin URL fiable, fuera.
- La URL tiene que llevar al artículo o a la página concreta. La portada del
  medio o el índice de una sección (sport.orf.at, orf.at, laola1.at…) NO valen:
  si no tienes el enlace exacto de la noticia, deja esa noticia fuera.
- No te inventes IDs de YouTube: si no has visto el vídeo en los resultados de
  verdad, pon null. Un enlace roto es peor que quedarse sin vídeo.
- El alumno vive en Viena y quiere entender de qué se habla: prioriza lo que
  afecta a la vida en la ciudad y en el país.`;

// El alumno prefiere ver un vídeo a leer un artículo, así que la búsqueda
// empieza en YouTube y el artículo es el complemento, no al revés.
// Antes esto mandaba EMPEZAR por YouTube y comprobar vídeo a vídeo que cada
// enlace existía. Eso era una ronda de búsquedas extra por cada noticia, y era
// media factura de la pantalla de Noticias: mucha espera para, con suerte, un
// vídeo. Ahora el vídeo es un extra que se coge si aparece solo, no algo que se
// vaya a cazar.
const NEWS_VIDEO_PRIMERO = `VÍDEO (opcional, sin gastar búsquedas en ello):
si en los resultados aparece un vídeo en alemán de un medio austriaco o alemán
(ORF/ZIB/Wien heute, PULS 24, oe24.TV, Krone, Kurier, DerStandard, Servus TV),
aprovéchalo y pon esa noticia la primera. Pero NO hagas búsquedas aparte para
encontrar vídeo ni para comprobarlo: si no ha salido solo, pon null y tira del
artículo escrito. Un enlace inventado es peor que quedarse sin vídeo.`;

// Sin tope, el CLI encadena diez o doce búsquedas y la espera se va a ocho
// minutos. Con presupuesto sale casi lo mismo en bastante menos. El tope crece
// con lo que se pide: ocho noticias variadas no caben en seis búsquedas.
function newsPresupuesto(count) {
  // El presupuesto de antes (hasta 12 búsquedas y 8 páginas abiertas) era la
  // causa de que un refresco de noticias durase eternidades y se comiera la
  // cuota entera para, si saltaba el límite a mitad, no devolver NADA. Cada
  // página abierta mete el artículo completo en el contexto, y eso es lo caro.
  //
  // Con 3-4 búsquedas y como mucho 2 páginas sale prácticamente lo mismo: los
  // resultados de búsqueda ya traen titular y entradilla, que es todo lo que
  // hace falta para un resumen de cinco líneas en A2.
  const busquedas = Math.min(5, Math.max(3, Math.ceil(count / 2)));
  return `PRESUPUESTO (respétalo, es lo que hace que esto no tarde una eternidad):
- Como mucho ${busquedas} búsquedas.
- Abre páginas SOLO si un titular no se entiende sin el artículo, y como mucho 2.
- Con el titular y la entradilla que ya salen en los resultados tienes de sobra
  para resumir en cinco líneas de nivel A2. No hace falta leer el artículo.
- Si con eso te salen menos noticias de las pedidas, devuelve las que tengas.
  Prefiero 3 buenas ahora que 6 dentro de diez minutos.`;
}

function newsPeticion(seccion, { count, niveau, idioma, hoy, ort }) {
  if (seccion === 'news') {
    return {
      tarea: `${count} NOTICIAS recientes (últimos 7 días), VARIADAS. Reparte así:

· 2 de POLÍTICA AUSTRIACA: el gobierno federal y lo que aprueba o discute, el
  Nationalrat, los partidos (ÖVP, SPÖ, FPÖ, NEOS, Grüne), el Bundeskanzler y
  sus ministros, el ayuntamiento y el Landtag de Viena, elecciones y encuestas,
  presupuestos, impuestos y leyes nuevas.
· 2 de VIENA Y AUSTRIA, del día a día: transporte y obras, vivienda y precios,
  trabajo, sanidad y escuela, cultura y museos, ciencia, sucesos que den de qué
  hablar, tiempo extremo, lo curioso que se comenta esa semana.
· 2 de EUROPA que le importen a alguien que vive en Austria: decisiones de la UE
  que se van a notar aquí, la economía europea, energía y precios, viajes y
  fronteras, o algo gordo de un país vecino (Alemania, Italia, Hungría,
  Eslovaquia, Chequia, Suiza).

No repitas tema entre ellas: si dos van del mismo asunto, cambia una.

Explica cada noticia como a alguien que acaba de llegar a Austria: di quién es
quién (partido y cargo) la primera vez que lo nombres, y qué cambia en la
práctica. Sé neutral: cuenta lo que ha pasado y lo que dice cada parte, sin
tomar partido.

PERIODISMO, NO PROPAGANDA: nada de notas de prensa de los partidos ni de
agencias que las reproducen tal cual (ots.at/presseaussendung, presse-nachrichten,
las salas de prensa de los propios partidos). Ahí el titular es el eslogan que
un partido quiere colocar, no lo que ha pasado. Usa redacciones de verdad, y si
la noticia es que un partido ha dicho algo, cuéntalo como "el FPÖ pide X",
nunca copiando su titular.

${NEWS_VIDEO_PRIMERO}

Medios escritos para completar: orf.at, wien.orf.at, derstandard.at, kurier.at,
diepresse.com, parlament.gv.at, wien.gv.at. Para lo europeo: orf.at/weltweit,
derstandard.at/international, tagesschau.de, dw.com, euronews.com/de.`,
      schema: `  "news": [
    {
      "titel": "titular en alemán, como lo publicó el medio o el canal",
      "titelEs": "el titular traducido a ${idioma}",
      "ort": "Wien u Österreich o la ciudad",
      "datum": "YYYY-MM-DD",
      "de": "resumen en alemán de 3-4 frases, nivel ${niveau}",
      "es": "el mismo resumen en ${idioma}",
      "woerter": [ { "de": "palabra clave (con artículo si es sustantivo)", "es": "traducción a ${idiomaAlumno()}" } ],
      "quelle": "nombre del medio o del canal de YouTube",
      "url": "URL del artículo si lo hay, si no null",
      "youtube": "URL de YouTube si la hay, si no null"
    }
  ]`,
      extra: `Incluye 4-6 "woerter" por noticia.`
    };
  }

  if (seccion === 'wissen') {
    return {
      tarea: `${count} noticias de CIENCIA Y CURIOSIDADES de los últimos días,
para leer con gusto y sin ser experto.

Qué entra: hallazgos de universidades y centros austriacos (Uni Wien, TU Wien,
IST Austria, ÖAW, Vetmeduni), espacio y astronomía, salud y medicina, naturaleza
y animales, arqueología e historia, tecnología e inteligencia artificial, medio
ambiente y clima, y esa historia rara o divertida que esa semana comenta todo
el mundo.

Explica cada una como a alguien con curiosidad pero sin formación en el tema:
qué han descubierto, cómo lo han hecho y por qué importa. Nada de jerga; si hace
falta una palabra técnica, explícala en la misma frase.
Que al menos una sea de un centro o una investigadora de Austria, y al menos
una de esas curiosas que se cuentan en una cena.

${NEWS_VIDEO_PRIMERO}

Medios escritos para completar: science.orf.at, derstandard.at/wissenschaft,
scinexx.de, spektrum.de, wissenschaft.de, nachrichten.at/panorama.`,
      schema: `  "wissen": [
    {
      "titel": "titular en alemán, como lo publicó el medio o el canal",
      "titelEs": "el titular traducido a ${idioma}",
      "ort": "el campo: Weltraum, Medizin, Natur, Technik, Archäologie…",
      "datum": "YYYY-MM-DD",
      "de": "resumen en alemán de 3-4 frases, nivel ${niveau}",
      "es": "el mismo resumen en ${idioma}",
      "woerter": [ { "de": "palabra clave (con artículo si es sustantivo)", "es": "traducción a ${idiomaAlumno()}" } ],
      "quelle": "nombre del medio o del canal de YouTube",
      "url": "URL del artículo si lo hay, si no null",
      "youtube": "URL de YouTube si la hay, si no null"
    }
  ]`,
      extra: `Incluye 4-6 "woerter" por noticia.`
    };
  }

  if (seccion === 'events') {
    return {
      tarea: `${count} EVENTOS que vayan a ocurrir en VIENA en los próximos 14 días:
conciertos, mercados, festivales, exposiciones, deporte, fiestas de barrio,
actividades gratuitas.
Fuentes: wien.info, events.wien.info, wien.gv.at, falter.at, vienna.at, ticketing oficial.

Busca también en YouTube el tráiler, el aftermovie o el vídeo de la edición
anterior de cada evento, y ponlo si lo encuentras de verdad.`,
      schema: `  "events": [
    {
      "titel": "nombre del evento en alemán",
      "titelEs": "el nombre o su explicación en ${idioma}",
      "was": "qué es, 2-3 frases en alemán nivel ${niveau}",
      "wasEs": "lo mismo en ${idioma}",
      "wann": "cuándo (fecha y hora tal como se anuncia)",
      "wo": "dónde, con el distrito de Viena si se sabe",
      "preis": "precio o 'gratis' / 'Eintritt frei'",
      "woerter": [ { "de": "palabra clave", "es": "traducción a ${idiomaAlumno()}" } ],
      "url": "URL oficial del evento",
      "youtube": "URL de YouTube si la hay, si no null"
    }
  ]`,
      extra: `Incluye 3-4 "woerter" por evento.`
    };
  }

  if (seccion === 'sport') {
    return {
      tarea: `${count} noticias de DEPORTE austriaco de los últimos días: la Bundesliga
austriaca (Rapid Wien, Austria Wien, Sturm Graz, Salzburg, LASK), la selección
(ÖFB-Team), esquí alpino y saltos de esquí en temporada, y lo que destaque en
tenis, ciclismo, atletismo o Eishockey.

${NEWS_VIDEO_PRIMERO}
Los resúmenes de los partidos (Highlights, Zusammenfassung) suelen estar en
YouTube: búscalos, son justo lo que se quiere ver.

Medios escritos para completar: sport.orf.at, laola1.at, krone.at/sport,
bundesliga.at, oefb.at, skiaustria.at.
Incluye RESULTADOS concretos cuando los haya y el PRÓXIMO partido o competición.`,
      schema: `  "sport": [
    {
      "titel": "titular deportivo en alemán",
      "titelEs": "el titular en ${idioma}",
      "sportart": "Fußball / Ski Alpin / Tennis / Eishockey…",
      "wann": "cuándo ocurrió o cuándo es",
      "ergebnis": "el resultado concreto si lo hay (p. ej. 'Rapid 2:1 Sturm'), si no null",
      "was": "qué pasó, 2-3 frases en alemán nivel ${niveau}",
      "wasEs": "lo mismo en ${idioma}",
      "naechstes": "el próximo partido o competición, si se sabe, si no null",
      "woerter": [ { "de": "palabra clave del deporte", "es": "traducción a ${idiomaAlumno()}" } ],
      "url": "URL de la noticia escrita si la hay, si no null",
      "youtube": "URL de YouTube si la hay, si no null"
    }
  ]`,
      extra: `Incluye 3-4 "woerter" por noticia deportiva.`
    };
  }

  return {
    tarea: `EL TIEMPO en ${ort}: hoy y los 4 días siguientes.
Si ${ort} está en Austria, tira de geosphere.at, wetter.orf.at, zamg.ac.at o
wetter.at; si está fuera, usa el servicio meteorológico nacional de ese país o
un medio serio de allí.
Da temperaturas máxima y mínima reales de la previsión, y un resumen del día
en alemán sencillo. Si hay algún aviso (Sturm, Regen, Hitze, Frost), dilo.
Si no encuentras previsión para "${ort}" (nombre mal escrito o sitio que no
existe), devuelve "wetter": null en vez de inventarte una.`,
    schema: `  "wetter": {
    "ort": "${ort}",
    "hinweis": "aviso meteorológico si lo hay, en alemán, si no null",
    "hinweisEs": "el aviso en ${idioma}, si no null",
    "tage": [
      {
        "tag": "nombre del día en alemán (Samstag…) o 'heute'",
        "datum": "YYYY-MM-DD",
        "symbol": "un emoji que represente el tiempo (☀️ ⛅ ☁️ 🌧️ ⛈️ 🌨️ 🌫️)",
        "text": "el tiempo de ese día en alemán, 1-2 frases sencillas",
        "textEs": "lo mismo en ${idioma}",
        "max": 18,
        "min": 9
      }
    ],
    "woerter": [ { "de": "palabra del tiempo (con artículo si es sustantivo)", "es": "traducción a ${idiomaAlumno()}" } ]
  }`,
    extra: `Pon 5 días en "wetter.tage" (hoy primero) y 6-8 "woerter".`
  };
}

export async function fetchNews({ seccion = 'news', count = 4, niveau = 'A2', ort = 'Wien', evitar = [] } = {}) {
  const s = getSettings();
  if (!aiAvailable()) throw new Error(t('err.aiNews'));
  if (!NEWS_SECCIONES.includes(seccion)) throw new Error(t('err.unknownSection', { que: seccion }));

  const idioma = langName(getLang());
  const hoy = new Date().toISOString().slice(0, 10);
  const ciudad = String(ort || 'Wien').trim() || 'Wien';
  const { tarea, schema, extra } = newsPeticion(seccion, { count, niveau, idioma, hoy, ort: ciudad });

  // Sin esto la búsqueda es determinista y al actualizar salen las mismas.
  const yaVistas = (Array.isArray(evitar) ? evitar : [])
    .map((x) => String(x || '').trim())
    .filter(Boolean)
    .slice(0, 24);
  const lista = yaVistas.map((x) => '- ' + x).join('\n');
  const bloqueVistas = yaVistas.length
    ? `
ESTAS YA SE LAS HAS ENSEÑADO, NO LAS REPITAS:
${lista}
Busca OTRAS distintas. Si de un tema hay novedades de verdad, puedes volver a
él, pero con otro artículo y contando lo nuevo, no lo mismo otra vez. Si te
quedas corto, tira de temas o de medios que no hayas usado todavía.
`
    : '';

  const prompt = `Hoy es ${hoy}. Eres profesor de alemán para un alumno de nivel ${niveau}
que vive en Viena y quiere enterarse de lo que pasa mientras practica el idioma.

BUSCA EN LA WEB:

${tarea}
${bloqueVistas}

${newsPresupuesto(count)}

${NEWS_REGLAS}

Los resúmenes en alemán, al nivel ${niveau}: frases cortas y vocabulario sencillo.
Las traducciones y los textos explicativos, en ${idioma}.

Devuelve SOLO un objeto JSON:
{
  "stand": "${hoy}",
${schema}
}
${extra}
Sin texto fuera del JSON.`;

  // Utiliza el proveedor configurado (Claude local o Gemini con Google Search Grounding)
  const text = await runLLM(prompt, {
    json: false,
    tools: ['WebSearch', 'WebFetch'],
    search: true,
    timeoutMs: 240000
  });
  const raw = extractJson(text);
  if (!raw) {
    const pista = String(text || '').replace(/\s+/g, ' ').trim().slice(0, 180);
    throw new Error(
      'La búsqueda no devolvió nada que se pueda leer.' + (pista ? ' Llegó: "' + pista + '…"' : '')
    );
  }

  // Una portada (sport.orf.at/) pasa el filtro de "es una URL" pero no prueba
  // nada ni lleva a la noticia, así que no cuenta como fuente.
  const okUrl = (u) => {
    const v = String(u || '').trim();
    if (!/^https?:\/\//i.test(v)) return null;
    try {
      const { pathname, search } = new URL(v);
      if (pathname.replace(/\/+$/, '') === '' && !search) return null;
    } catch {
      return null;
    }
    return v;
  };
  const woerter = (arr) =>
    (Array.isArray(arr) ? arr : [])
      .map((w) => ({ de: String(w.de || '').trim(), es: String(w.es || '').trim() }))
      .filter((w) => w.de);
  // null, '' y undefined pasan por Number() como 0: habría días a 0 grados inventados
  const grad = (v) => {
    const limpio = String(v ?? '').replace(',', '.').replace(/[^0-9.-]/g, '');
    if (limpio === '' || limpio === '-') return null;
    const n = Number(limpio);
    return Number.isFinite(n) ? Math.round(n) : null;
  };
  // primero lo que tenga vídeo, que es lo que se quiere ver
  const videoPrimero = (arr) => [...arr].sort((a, b) => (b.youtube ? 1 : 0) - (a.youtube ? 1 : 0));

  // Agencias de notas de prensa y webs de partido: ahí el titular es el eslogan
  // que un partido quiere colocar, no la noticia. Fuera aunque la URL funcione.
  const PROPAGANDA = [
    'ots.at', 'presse-nachrichten.de', 'presseportal.de', 'openpr.de',
    'fpoe.at', 'spoe.at', 'oevp.at', 'dieneuevolkspartei.at', 'neos.eu', 'gruene.at'
  ];
  const esPropaganda = (u) => {
    if (!u) return false;
    try {
      const h = new URL(u).hostname.replace(/^www\./, '').toLowerCase();
      return PROPAGANDA.some((d) => h === d || h.endsWith('.' + d));
    } catch {
      return false;
    }
  };

  const base = { seccion, stand: String(raw.stand || hoy).trim(), holtAm: Date.now(), lang: getLang() };

  // 'wissen' trae la misma forma que 'news', así que se normaliza igual.
  if (seccion === 'news' || seccion === 'wissen') {
    const crudas = seccion === 'wissen' ? raw.wissen : raw.news;
    const items = videoPrimero(
      (Array.isArray(crudas) ? crudas : [])
        .map((n) => ({
          titel: String(n.titel || '').trim(),
          titelEs: String(n.titelEs || '').trim(),
          ort: String(n.ort || '').trim(),
          datum: String(n.datum || '').trim(),
          de: String(n.de || '').trim(),
          es: String(n.es || '').trim(),
          quelle: String(n.quelle || '').trim(),
          url: okUrl(n.url),
          youtube: okUrl(n.youtube),
          woerter: woerter(n.woerter)
        }))
        .filter((n) => n.titel && (n.url || n.youtube) && !esPropaganda(n.url))
    );
    if (!items.length) throw new Error(t('err.noSources'));
    return { ...base, items };
  }

  if (seccion === 'events') {
    const items = videoPrimero(
      (Array.isArray(raw.events) ? raw.events : [])
        .map((e) => ({
          titel: String(e.titel || '').trim(),
          titelEs: String(e.titelEs || '').trim(),
          was: String(e.was || '').trim(),
          wasEs: String(e.wasEs || '').trim(),
          wann: String(e.wann || '').trim(),
          wo: String(e.wo || '').trim(),
          preis: String(e.preis || '').trim(),
          url: okUrl(e.url),
          youtube: okUrl(e.youtube),
          woerter: woerter(e.woerter)
        }))
        .filter((e) => e.titel && (e.url || e.youtube))
    );
    if (!items.length) throw new Error(t('err.noSources'));
    return { ...base, items };
  }

  if (seccion === 'sport') {
    const items = videoPrimero(
      (Array.isArray(raw.sport) ? raw.sport : [])
        .map((x) => ({
          titel: String(x.titel || '').trim(),
          titelEs: String(x.titelEs || '').trim(),
          sportart: String(x.sportart || '').trim(),
          wann: String(x.wann || '').trim(),
          ergebnis: x.ergebnis ? String(x.ergebnis).trim() : null,
          was: String(x.was || '').trim(),
          wasEs: String(x.wasEs || '').trim(),
          naechstes: x.naechstes ? String(x.naechstes).trim() : null,
          url: okUrl(x.url),
          youtube: okUrl(x.youtube),
          woerter: woerter(x.woerter)
        }))
        .filter((x) => x.titel && (x.url || x.youtube))
    );
    if (!items.length) throw new Error(t('err.noSources'));
    return { ...base, items };
  }

  const w = raw.wetter || {};
  const tage = (Array.isArray(w.tage) ? w.tage : [])
    .map((d) => ({
      tag: String(d.tag || '').trim(),
      datum: String(d.datum || '').trim(),
      symbol: String(d.symbol || '').trim(),
      text: String(d.text || '').trim(),
      textEs: String(d.textEs || '').trim(),
      max: grad(d.max),
      min: grad(d.min)
    }))
    .filter((d) => d.tag || d.datum);
  if (!tage.length) {
    throw new Error(`No se encontró la previsión de "${ciudad}". ¿Está bien escrito el nombre?`);
  }
  return {
    ...base,
    wetter: {
      ort: String(w.ort || ciudad).trim(),
      hinweis: w.hinweis ? String(w.hinweis).trim() : null,
      hinweisEs: w.hinweisEs ? String(w.hinweisEs).trim() : null,
      woerter: woerter(w.woerter),
      tage
    }
  };
}

// ---------- El zorrito: conversación, correcciones y traducción ----------
// Devuelve siempre la misma forma para que la pantalla no tenga que adivinar:
// lo que dice, la corrección si la hay, la cara que pone y, a veces, un
// ejercicio. Lo de la cara lo elige él mismo según cómo lo hayas hecho.
export async function foxChat({ historial = [], mensaje, nombre = 'Felix', especie = 'zorro', niveau = 'A2', lektion = null }) {
  if (!aiAvailable()) throw new Error(t('err.aiFox'));
  const idioma = langName(getLang());
  const contexto = lektion ? `\nAhora mismo está con ${lektion.bandName} — ${lektion.name}.` : '';

  const charla = historial
    .slice(-10)
    .map((m) => (m.de === 'yo' ? `ALUMNO: ${m.texto}` : `TÚ: ${m.texto}`))
    .join('\n');

  const prompt = `Eres ${nombre}, un ${especie} simpático y juguetón que ayuda a practicar alemán.
Hablas con un alumno de nivel ${niveau} que vive en Viena.${contexto}

TU CARÁCTER: cercano, con humor, animas sin empalagar. Tuteas. Usas alguna
interjección alemana de vez en cuando (Na?, Genau!, Ach so!, Super!). Nunca das
un sermón: si hay que corregir, corriges en una línea y sigues la conversación.

CÓMO RESPONDES:
- En ALEMÁN, al nivel ${niveau}: frases cortas y vocabulario que ya conozca.
- 1-3 frases. Eres un compañero de charla, no un libro de texto.
- Termina casi siempre con una pregunta, para que la conversación siga.
- Si el alumno te escribe en ${idioma} o te pide traducir algo, tradúcelo y
  explica el matiz o el contexto en ${idioma}; luego vuelve al alemán.
- Si te pide un ejercicio (o llevabais un rato charlando sin practicar nada),
  rellena "uebung" con uno cortito relacionado con lo que estabais hablando.

LA CORRECCIÓN es lo importante: si lo que ha escrito en alemán tiene fallos,
rellena "korrektur". Corrige de verdad, incluido el orden de la frase, los
casos, el género y las terminaciones. Si está bien, "korrektur" va a null y
NO te lo inventes. Si escribió en ${idioma}, tampoco hay corrección.

"aufDeutsch" dice si el mensaje del alumno está ESCRITO EN ALEMÁN, y va aparte
de la corrección: true solo si la frase entera es alemán. Si está en ${idioma},
si mezcla los dos idiomas o si son palabras sueltas sin frase, va false. Con eso
se decide si se le premia por practicar, así que sé estricto: "ich pay impuestos
weil no quiero..." es false.

LA CARA que pones, en "stimmung":
- "muyfeliz" si lo ha escrito todo bien o te ha sorprendido para bien
- "feliz" si va bien en general
- "guino" cuando bromeas o le picas
- "pensando" si le preguntas algo o le haces pensar
- "sorpresa" ante algo inesperado
- "triste" solo si él te cuenta algo malo, NUNCA por haberse equivocado

${charla ? `LA CONVERSACIÓN HASTA AHORA:\n${charla}\n` : ''}
EL ALUMNO ACABA DE ESCRIBIR: ${mensaje}

Devuelve SOLO un objeto JSON:
{
  "antwort": "lo que dices, en alemán",
  "antwortEs": "la misma frase en ${idioma}",
  "stimmung": "feliz",
  "aufDeutsch": true,
  "korrektur": {
    "original": "lo que escribió tal cual",
    "richtig": "cómo se dice bien",
    "warum": "por qué, en ${idioma}, una frase"
  },
  "uebung": { "frage": "el ejercicio en alemán", "loesung": "la solución", "tipp": "una pista en ${idioma}" },
  "woerter": [ { "de": "palabra útil que hayas usado", "es": "traducción a ${idiomaAlumno()}" } ]
}
"korrektur" y "uebung" van a null cuando no toquen. Como mucho 3 "woerter".
Sin texto fuera del JSON.`;

  const text = await runLLM(prompt, { json: true, timeoutMs: 180000 });
  const raw = extractJson(text);
  if (!raw) {
    throw new Error(t('err.foxConfused'));
  }
  const limpia = (v) => String(v ?? '').trim();
  const CARAS = ['normal', 'feliz', 'muyfeliz', 'guino', 'pensando', 'sorpresa', 'triste'];
  const k = raw.korrektur;
  return {
    antwort: limpia(raw.antwort),
    antwortEs: limpia(raw.antwortEs),
    stimmung: CARAS.includes(raw.stimmung) ? raw.stimmung : 'feliz',
    // si el modelo no lo manda, se da por NO alemán: mejor no pagar de más
    aufDeutsch: raw.aufDeutsch === true,
    korrektur:
      k && limpia(k.richtig) && limpia(k.richtig) !== limpia(k.original)
        ? { original: limpia(k.original), richtig: limpia(k.richtig), warum: limpia(k.warum) }
        : null,
    uebung:
      raw.uebung && limpia(raw.uebung.frage)
        ? {
            frage: limpia(raw.uebung.frage),
            loesung: limpia(raw.uebung.loesung),
            tipp: limpia(raw.uebung.tipp)
          }
        : null,
    woerter: (Array.isArray(raw.woerter) ? raw.woerter : [])
      .map((w) => ({ de: limpia(w.de), es: limpia(w.es) }))
      .filter((w) => w.de)
      .slice(0, 3)
  };
}

// ---------- Por qué he fallado esta traducción ----------
// Corta y al grano: qué has puesto mal, cómo era y por qué. Nada de sermones.
export async function explainTranslation({ origen, buena, tuya, direccion }) {
  if (!aiAvailable()) throw new Error(t('err.aiExplain'));
  const idioma = langName(getLang());
  const haciaAleman = direccion === 'es-de';

  const prompt = `Un alumno de alemán de nivel A2 estaba traduciendo ${
    haciaAleman ? 'al alemán' : 'al ' + idioma
  }.

FRASE DE PARTIDA: ${origen}
TRADUCCIÓN CORRECTA: ${buena}
LO QUE HA ESCRITO: ${tuya || '(nada)'}

Explícale en qué ha fallado, en ${idioma}, como un profesor que va al grano.
- Compara SU frase con la correcta y saca solo los fallos de verdad. Las tildes,
  la puntuación y las mayúsculas NO son fallos aquí.
- Si una diferencia es solo otra manera igual de válida de decirlo, dilo así y
  no lo cuentes como error.
- Nombra la regla cuando la haya (el caso, el orden de la frase, la
  terminación, la preposición que rige...), en una frase.
- Nada de ánimos vacíos ni de repetir la frase entera.

Devuelve SOLO un objeto JSON:
{
  "resumen": "una frase en ${idioma} diciendo qué ha pasado",
  "fallos": [
    { "tuyo": "lo que escribió", "bueno": "cómo era", "porque": "la razón, media línea" }
  ],
  "consejo": "una cosa concreta para la próxima vez, o null si no hace falta"
}
Como mucho 3 "fallos". Si en realidad estaba bien, "fallos" vacío y dilo en el
resumen. Sin texto fuera del JSON.`;

  const text = await runLLM(prompt, { json: true, timeoutMs: 120000 });
  const raw = extractJson(text);
  if (!raw) throw new Error(t('err.readExplain'));
  const limpia = (v) => String(v ?? '').trim();
  return {
    resumen: limpia(raw.resumen),
    fallos: (Array.isArray(raw.fallos) ? raw.fallos : [])
      .map((f) => ({ tuyo: limpia(f.tuyo), bueno: limpia(f.bueno), porque: limpia(f.porque) }))
      .filter((f) => f.bueno)
      .slice(0, 3),
    consejo: raw.consejo ? limpia(raw.consejo) : ''
  };
}

// ---------- Diario: corregir lo que escribe el alumno ----------
// Un tema para escribir, con la forma de los del Kursbuch: el encargo, unas
// preguntas que te guian y unos principios de frase para arrancar. Es para
// cuando te sientas delante del diario y no se te ocurre nada.
export async function generateWritingTopic({ niveau = 'A2', evitar = [], lektion = null } = {}) {
  if (!aiAvailable()) throw new Error(t('err.aiTopic'));

  const idioma = langName(getLang());
  // Sin esta lista acababa proponiendo el fin de semana una y otra vez.
  const visto = evitar.length
    ? '\n\nNO repitas ninguno de estos, ya se los has propuesto:\n' +
      evitar.map((x) => '- ' + x).join('\n') +
      '\nBusca un angulo distinto de verdad, no el mismo tema con otras palabras.'
    : '';
  // La leccion en la que anda, si la hay: un tema que le haga usar lo que
  // acaba de dar en clase vale mas que uno suelto.
  const clase = lektion
    ? '\n\nAhora mismo esta con: ' + lektionFullLabel(lektion) +
      '. Si encaja de forma natural, que el tema le haga usar eso. Si no, dejalo.'
    : '';

  const prompt = `Eres profesor de aleman. Preparas una tarea de expresion escrita para un alumno
que habla ${idiomaAlumno()}, de nivel ${niveau}, con el formato de los libros de curso (Kursbuch).

Propon UN tema, elegido al azar entre los que le pueden tocar en clase o en un examen:
la vida diaria, el trabajo, los estudios, la salud, los viajes, la vivienda, el tiempo libre,
el deporte, la comida, el dinero, la tecnologia, las fiestas, el barrio, los planes de futuro,
una experiencia del pasado, una opinion sobre algo cotidiano...${visto}${clase}

El formato es SIEMPRE el mismo:
1. Un encargo corto en aleman ("Schreiben Sie einen Text uber...").
2. Entre 3 y 5 preguntas en aleman que le guien: cada una le da un parrafo que escribir.
3. Entre 4 y 6 principios de frase en aleman, cortados con puntos suspensivos, para arrancar.
   Son andamios ("Ich finde ..., weil ...", "Fruher habe ich ..."), no frases enteras.

Todo el aleman, de nivel ${niveau}: vocabulario que un ${niveau} conoce y frases que puede construir.
Los textos explicativos, en ${idioma}.

Devuelve SOLO un objeto JSON:
{
  "thema": "el encargo en aleman, una sola frase",
  "themaEs": "que te estan pidiendo, en ${idioma}, una frase",
  "fragen": ["pregunta guia en aleman"],
  "anfaenge": ["principio de frase en aleman, acabado en ..."],
  "wortschatz": [ { "de": "palabra o expresion util para este tema", "es": "traduccion a ${idioma}" } ]
}
Entre 5 y 8 entradas en "wortschatz". Sin texto fuera del JSON.`;

  const txt = await runLLM(prompt);
  const raw = extractJson(txt);
  if (!raw || !raw.thema) {
    const pista = String(txt || '').replace(/\s+/g, ' ').trim().slice(0, 160);
    throw new Error(t('err.readTopic') + (pista ? t('err.gotBack', { pista }) : ''));
  }
  const lista = (v) => (Array.isArray(v) ? v : []).map((x) => String(x || '').trim()).filter(Boolean);
  return {
    thema: String(raw.thema).trim(),
    themaEs: String(raw.themaEs || '').trim(),
    fragen: lista(raw.fragen),
    anfaenge: lista(raw.anfaenge),
    wortschatz: (Array.isArray(raw.wortschatz) ? raw.wortschatz : [])
      .map((w) => ({ de: String(w.de || '').trim(), es: String(w.es || '').trim() }))
      .filter((w) => w.de),
    at: Date.now()
  };
}

export async function correctDiary({ text, niveau = 'A2', errores = [] }) {
  if (!aiAvailable()) throw new Error(t('err.aiDiary'));
  if (!text?.trim()) throw new Error(t('err.writeSomething'));

  const recurrentes = errores.length
    ? `
Este alumno YA ha fallado antes en: ${errores.map((e) => `${e.regel} (x${e.n})`).join(', ')}.
Si vuelve a fallar en alguno, dilo explícitamente en "lob" o en la lección: le ayuda a darse cuenta del patrón.`
    : '';

  const prompt = `Eres profesor de alemán, corriges el diario de un alumno que habla ${idiomaAlumno()}, de nivel ${niveau}.
Es su diario personal: sé exacto con los errores pero cercano y motivador con el tono.${recurrentes}

TEXTO DEL ALUMNO:
"""
${text.trim()}
"""

Corrígelo con estos criterios:
- Respeta lo que quiso decir. No reescribas su texto con tu estilo: corrige lo que está mal y deja lo demás.
- Si una frase es correcta pero suena poco natural, márcala como "estilo", no como error.
- Todas las explicaciones, en ESPAÑOL. Los ejemplos, en alemán con traducción.
- Si el texto tiene errores del nivel ${niveau} mézclalos con los importantes, pero prioriza lo que más le afecta.

Devuelve SOLO un objeto JSON:
{
  "korrigiert": "el texto completo ya corregido, listo para leer de seguido",
  "niveau": "el nivel que refleja el texto (A1, A2, B1…)",
  "lob": "2-3 frases en ${idiomaAlumno()}: qué ha hecho bien de verdad (sé concreto, nada de halagos vacíos)",
  "korrekturen": [
    {
      "original": "el fragmento exacto que escribió mal",
      "korrektur": "cómo debería ser",
      "typ": "Gramática" | "Vocabulario" | "Ortografía" | "Orden de la frase" | "Estilo",
      "regel": "nombre corto de la regla, p. ej. 'Perfekt con sein' o 'Akkusativ tras für'",
      "erklaerung": "por qué, en ${idiomaAlumno()}, en 1-2 frases claras"
    }
  ],
  "lektion": {
    "titel": "la regla que más le conviene repasar a partir de estos errores",
    "erklaerung": "explicación en ${idiomaAlumno()}, 3-5 frases",
    "tabelle": { "title": "…", "headers": ["…"], "rows": [["…"]] },
    "beispiele": [ { "de": "frase de ejemplo", "es": "traducción a ${idiomaAlumno()}" } ]
  },
  "wortschatz": [
    { "statt": "lo que escribió (o lo que le faltó)", "besser": "cómo lo diría un nativo", "es": "traducción a ${idiomaAlumno()}" }
  ],
  "naechsterSchritt": "una propuesta concreta para la próxima entrada del diario, en ${idiomaAlumno()}"
}

Reglas: incluye "tabelle" solo si aporta (si no, null). 3-5 entradas en "wortschatz".
2-4 "beispiele" en la lección. Si el texto está perfecto, deja "korrekturen" vacío y usa la lección
para enseñarle algo que le permita escribir más rico. Sin texto fuera del JSON.`;

  const text_ = await runLLM(prompt);
  const raw = extractJson(text_);
  if (!raw) {
    const pista = String(text_ || '').replace(/\s+/g, ' ').trim().slice(0, 160);
    throw new Error(t('err.readFix') + (pista ? t('err.gotBack', { pista }) : ''));
  }
  const tabla = (t) =>
    t && Array.isArray(t.headers) && Array.isArray(t.rows) && t.rows.length
      ? { title: String(t.title || '').trim(), headers: t.headers.map(String), rows: t.rows.filter(Array.isArray).map((r) => r.map(String)) }
      : null;
  return {
    korrigiert: String(raw.korrigiert || '').trim(),
    niveau: String(raw.niveau || niveau).trim(),
    lob: String(raw.lob || '').trim(),
    korrekturen: (Array.isArray(raw.korrekturen) ? raw.korrekturen : [])
      .map((k) => ({
        original: String(k.original || '').trim(),
        korrektur: String(k.korrektur || '').trim(),
        typ: String(k.typ || 'Gramática').trim(),
        regel: String(k.regel || '').trim(),
        erklaerung: String(k.erklaerung || '').trim()
      }))
      .filter((k) => k.original && k.korrektur),
    lektion: raw.lektion
      ? {
          titel: String(raw.lektion.titel || '').trim(),
          erklaerung: String(raw.lektion.erklaerung || '').trim(),
          tabelle: tabla(raw.lektion.tabelle),
          beispiele: (Array.isArray(raw.lektion.beispiele) ? raw.lektion.beispiele : [])
            .map((b) => ({ de: String(b.de || '').trim(), es: String(b.es || '').trim() }))
            .filter((b) => b.de)
        }
      : null,
    wortschatz: (Array.isArray(raw.wortschatz) ? raw.wortschatz : [])
      .map((w) => ({
        statt: String(w.statt || '').trim(),
        besser: String(w.besser || '').trim(),
        es: String(w.es || '').trim()
      }))
      .filter((w) => w.besser),
    naechsterSchritt: String(raw.naechsterSchritt || '').trim()
  };
}

// Los modelos que tu clave puede usar hoy, preguntados al proveedor. El campo
// de modelo era texto libre con un ejemplo fijo, y el ejemplo se quedaba viejo
// (sugeria gemini-1.5-flash, que Google ya retiro). Sigue siendo texto libre:
// esto solo rellena las sugerencias.
export async function listarModelos({ provider, key, baseUrl }) {
  if (!key) return [];
  if (provider === 'gemini') {
    const res = await fetch('https://generativelanguage.googleapis.com/v1beta/models?pageSize=200', {
      headers: { 'x-goog-api-key': key }
    });
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = await res.json();
    return (data.models || [])
      .filter((m) => m.name.startsWith('models/gemini-')
        && (m.supportedGenerationMethods || []).includes('generateContent')
        && !/embedding|tts|image|audio|live/i.test(m.name))
      .map((m) => m.name.slice('models/'.length))
      .sort((a, b) => b.localeCompare(a));
  }
  const res = await fetch(`${baseUrl || 'https://api.openai.com/v1'}/models`, {
    headers: { Authorization: `Bearer ${key}` }
  });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.data || []).map((m) => m.id)
    .filter((id) => !/audio|realtime|transcribe|tts|whisper|dall-e|embedding|moderation/i.test(id))
    .sort((a, b) => a.localeCompare(b));
}

export async function testAi() {
  const items = await generateItems({
    topicId: 'test',
    topicName: 'Modalverben',
    count: 1
  });
  return items.length > 0;
}

export async function generateConjugation({ verb }) {
  if (!aiAvailable()) throw new Error(t('err.aiConjugate'));
  const prompt = `Eres profesor de alemán. El alumno quiere conjugar el verbo "${verb}".
Devuelve SOLO un objeto JSON con esta estructura (sin markdown fuera del JSON):
{
  "verb": "${verb}",
  "translation": "traducción a ${idiomaAlumno()}",
  "tenses": [
    {
      "name": "Präsens",
      "conjugations": [
        {"pronoun": "ich", "form": "..."},
        {"pronoun": "du", "form": "..."},
        {"pronoun": "er/sie/es", "form": "..."},
        {"pronoun": "wir", "form": "..."},
        {"pronoun": "ihr", "form": "..."},
        {"pronoun": "sie/Sie", "form": "..."}
      ]
    },
    {
      "name": "Präteritum",
      "conjugations": [...]
    },
    {
      "name": "Perfekt",
      "conjugations": [...]
    },
    {
      "name": "Plusquamperfekt",
      "conjugations": [...]
    },
    {
      "name": "Futur I",
      "conjugations": [...]
    },
    {
      "name": "Konjunktiv II",
      "conjugations": [...]
    }
  ],
  "examples": [
    {"tense": "Präsens", "de": "Ejemplo en alemán...", "es": "traducción a ${idiomaAlumno()}"},
    {"tense": "Präteritum", "de": "Ejemplo en alemán...", "es": "traducción a ${idiomaAlumno()}"},
    {"tense": "Perfekt", "de": "Ejemplo en alemán...", "es": "traducción a ${idiomaAlumno()}"},
    {"tense": "Plusquamperfekt", "de": "Ejemplo en alemán...", "es": "traducción a ${idiomaAlumno()}"},
    {"tense": "Futur I", "de": "Ejemplo en alemán...", "es": "traducción a ${idiomaAlumno()}"},
    {"tense": "Konjunktiv II", "de": "Ejemplo en alemán...", "es": "traducción a ${idiomaAlumno()}"}
  ]
}`;
  const text = await runLLM(prompt);
  const raw = extractJson(text);
  if (!raw || !raw.tenses) throw new Error(t('err.conjFailed'));
  return raw;
}

// Evalúa la respuesta de una pregunta abierta (tipo "open")
export async function evaluateAnswer({ item, answer, lektion }) {
  if (!aiAvailable()) throw new Error(t('err.aiOpen'));

  const prompt = `Eres profesor de alemán. El alumno ha respondido a la siguiente pregunta de nivel ${lektion?.bandName || 'A2'}:

PREGUNTA/EJERCICIO:
${item.anweisung || 'Responde a la pregunta:'}
${item.context ? `Contexto: ${item.context}\n` : ''}${item.sentence || ''}

RESPUESTA IDEAL (Modelo):
${item.answer || 'No proporcionada'}

RESPUESTA DEL ALUMNO:
"${answer}"

Evalúa la respuesta del alumno. Debe ser gramaticalmente correcta y responder a la pregunta.
Pequeños errores ortográficos (tippfehler) que no cambien el significado se pueden tolerar si se entiende bien, pero errores gramaticales de nivel básico no.

Devuelve EXCLUSIVAMENTE un objeto JSON:
{
  "correct": true si es aceptable, false si está mal o es incomprensible,
  "why": "explicación muy breve y motivadora en ${idiomaAlumno()}, corrigiendo los errores si los hay"
}
Sin ningún otro texto fuera del JSON.`;

  const text = await runLLM(prompt);
  const arr = extractJson(text);
  if (Array.isArray(arr) && arr.length > 0) return arr[0];
  if (arr && typeof arr === 'object') return arr;
  throw new Error(t('err.parseFailed'));
}

// Ampliar un tema de vocabulario. Se desbloquea cuando tienes TODAS las
// palabras del tema en verde: entonces ya no tiene sentido seguir repasando
// esas diez, lo que hace falta es mas vocabulario del mismo campo.
//
// Se le pasa lo que ya tienes para que no te devuelva lo mismo con otras
// palabras: el valor esta en lo que NO esta en la lista.
export async function ampliarVocabulario({ tema, niveau = 'A2', subtemas = [], yaTengo = [] }) {
  if (!aiAvailable()) throw new Error(t('err.aiExpand'));
  const idioma = langName(getLang());
  // El bloque cubre la lección entera, y "Lektion 11" no le dice nada a nadie:
  // se le pasan los sub-temas para que sepa de qué campo tirar.
  const campos = subtemas.length ? ` (${subtemas.join(', ')})` : '';

  const prompt = `Eres profesor de alemán de un alumno que habla ${idiomaAlumno()}, de nivel ${niveau}, que vive en Viena.

Ya se sabe de memoria estas palabras del tema "${tema}"${campos}:
${yaTengo.map((w) => '- ' + w).join('\n')}

Proponle 12 palabras MÁS del mismo tema, para seguir creciendo desde ahí.

Criterios:
- NINGUNA de la lista de arriba, ni variantes suyas (plurales, mismo verbo con otro prefijo trivial).
- Del mismo campo semántico, pero un escalón por encima: lo que diría un nativo y él todavía no.
- Útiles en Austria. Si en Austria se dice distinto que en Alemania, usa la austriaca y dilo en "nota".
- Sustantivos SIEMPRE con artículo (der/die/das). Verbos en infinitivo.
- El ejemplo, una frase corta de uso real, de nivel ${niveau}, no una definición.

Las traducciones y las notas, en ${idioma}. El alemán se queda en alemán.

Devuelve SOLO un objeto JSON:
{
  "tema": "${tema}",
  "woerter": [
    {
      "de": "palabra en alemán (con artículo si es sustantivo)",
      "es": "traducción a ${idioma}",
      "ex": "frase de ejemplo en alemán",
      "exEs": "la frase traducida a ${idioma}",
      "nota": "matiz, uso o variante austriaca. Cadena vacía si no hace falta"
    }
  ]
}
Sin texto fuera del JSON.`;

  const txt = await runLLM(prompt);
  const raw = extractJson(txt);
  const lista = Array.isArray(raw?.woerter) ? raw.woerter : [];
  // Red de seguridad: si aun asi cuela alguna que ya tenias, fuera.
  const tengo = new Set(yaTengo.map((w) => String(w).toLowerCase().trim()));
  const salida = lista
    .map((w) => ({
      de: String(w.de || '').trim(),
      es: String(w.es || '').trim(),
      ex: String(w.ex || '').trim(),
      exEs: String(w.exEs || '').trim(),
      nota: String(w.nota || '').trim()
    }))
    .filter((w) => w.de && w.es && !tengo.has(w.de.toLowerCase()));
  if (!salida.length) throw new Error(t('err.readWords'));
  return { tema: String(raw.tema || tema), woerter: salida };
}
