// Simulacro de examen A2 (Goethe / ÖSD): Lesen, Hören, Schreiben, Sprechen.
// Guarda los resultados para ver la evolución por destreza.

import { storage } from './storage.js';
import { tc } from './contenido/index.js';

const KEY = 'pruefung:results';

export const TEILE = [
  {
    id: 'lesen',
    name: 'Lesen',
    es: 'Comprensión lectora',
    ico: '📄',
    min: 30,
    blurb: 'Textos cotidianos: correos, anuncios, carteles y foros.',
    typen: [
      { id: 'rf', name: 'Teil 1 · Text + richtig/falsch', es: 'Un correo o mensaje con afirmaciones' },
      { id: 'matching', name: 'Teil 2 · Anzeigen zuordnen', es: 'Emparejar personas con anuncios' },
      { id: 'schilder', name: 'Teil 3 · Schilder & Notizen', es: 'Carteles y avisos breves' },
      { id: 'forum', name: 'Teil 4 · Forum / Meinungen', es: 'Varios comentarios sobre un tema' }
    ]
  },
  {
    id: 'hoeren',
    name: 'Hören',
    es: 'Comprensión auditiva',
    ico: '🎧',
    min: 30,
    blurb: 'Avisos, mensajes de voz, conversaciones y entrevistas.',
    typen: [
      { id: 'ansagen', name: 'Teil 1 · Ansagen', es: 'Avisos y mensajes cortos' },
      { id: 'monolog', name: 'Teil 2 · Nachricht / Radio', es: 'Alguien habla seguido, con datos' },
      { id: 'gespraech', name: 'Teil 3 · Gespräch', es: 'Conversación cotidiana' },
      { id: 'interview', name: 'Teil 4 · Interview', es: 'Entrevista con richtig/falsch' }
    ]
  },
  {
    id: 'schreiben',
    name: 'Schreiben',
    es: 'Expresión escrita',
    ico: '✏',
    min: 30,
    blurb: 'Mensajes cortos y correos. Lo que más puntúa es tocar todos los puntos.',
    typen: [
      { id: 'sms', name: 'Teil 1 · SMS / Nachricht', es: '20-30 palabras, 3 puntos obligatorios' },
      { id: 'email', name: 'Teil 2 · E-Mail', es: '30-40 palabras, responder a 4 preguntas' }
    ]
  },
  {
    id: 'sprechen',
    name: 'Sprechen',
    es: 'Expresión oral',
    ico: '🗣',
    min: 15,
    blurb: 'Se hace en pareja. Aquí practicas la tarea y ves cómo se resuelve.',
    typen: [
      { id: 'vorstellen', name: 'Teil 1 · Sich vorstellen', es: 'Presentarte y responder preguntas' },
      { id: 'karten', name: 'Teil 2 · Fragen mit Karten', es: 'Formular preguntas a partir de tarjetas' },
      { id: 'planen', name: 'Teil 3 · Etwas planen', es: 'Poneros de acuerdo en organizar algo' }
    ]
  }
];

// El aleman se queda (Lesen, "Teil 1 · Ansagen"): es como se llama la prueba
// de verdad. Lo que se traduce es la explicacion de que va cada parte.
function traducirTeil(t) {
  return {
    ...t,
    es: tc(t.es),
    blurb: tc(t.blurb),
    typen: (t.typen || []).map((x) => ({ ...x, es: tc(x.es) }))
  };
}

// Las cuatro partes, listas para pintar. Es funcion y no constante para que al
// cambiar de idioma se recalculen.
export function teiles() {
  return TEILE.map(traducirTeil);
}

export function getTeil(id) {
  const t = TEILE.find((x) => x.id === id);
  return t ? traducirTeil(t) : null;
}

export function getTyp(teilId, typId) {
  return getTeil(teilId)?.typen.find((t) => t.id === typId) || null;
}

// Las trampas reales del examen: esto es lo que de verdad suspende gente.
const FALLEN = [
  {
    ico: '🚫',
    titel: 'Las negaciones',
    text: 'En A2 la mayoría de los fallos en Lesen vienen de no ver un nicht, kein, nur, aber o leider. "Am Samstag kann ich leider nicht kommen" significa lo contrario de lo que parece si lees rápido.'
  },
  {
    ico: '🎭',
    titel: 'Los distractores',
    text: 'En los emparejamientos casi siempre hay que cumplir dos o tres condiciones a la vez (barato Y por la tarde Y de alemán). Un anuncio que cumple solo una está puesto ahí para engañarte.'
  },
  {
    ico: '🔁',
    titel: 'Los sinónimos',
    text: 'La respuesta correcta nunca usa las mismas palabras que el texto o el audio. Si oyes "Ich stehe um sechs auf" y la opción dice "Sie beginnt früh", esa es la buena. Eso es justo lo que evalúan.'
  },
  {
    ico: '✅',
    titel: 'En Schreiben, cubrir los puntos',
    text: 'Se puntúa primero cumplir la tarea (todos los puntos tratados), luego la coherencia (und, aber, weil, deshalb), luego el vocabulario y por último la gramática. Olvidar un punto baja mucho más que un error de caso.'
  },
  {
    ico: '💬',
    titel: 'En Sprechen, reaccionar',
    text: 'Buscan que interactúes de verdad: preguntar, proponer, rechazar y ofrecer alternativa. Vale más hablar con errores que soltar un monólogo memorizado.'
  }
];

export function fallen() {
  return FALLEN.map((f) => ({ ...f, titel: tc(f.titel), text: tc(f.text) }));
}

// ---------- resultados ----------

export function saveResult({ teil, typ, correct, total, seconds }) {
  const r = {
    id: `p-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
    at: Date.now(),
    date: new Date().toISOString().slice(0, 10),
    teil,
    typ,
    correct,
    total,
    pct: total ? Math.round((correct / total) * 100) : 0,
    seconds: seconds || 0
  };
  storage.update(KEY, [], (list) => [r, ...list].slice(0, 200));
  return r;
}

export function allResults() {
  return storage.get(KEY, []);
}

// Media por destreza + cuántos simulacros llevas.
export function examStats() {
  const list = allResults();
  const porTeil = {};
  for (const t of TEILE) {
    const suyos = list.filter((r) => r.teil === t.id);
    porTeil[t.id] = suyos.length
      ? {
          n: suyos.length,
          pct: Math.round(suyos.reduce((s, r) => s + r.pct, 0) / suyos.length),
          ultimo: suyos[0].pct
        }
      : { n: 0, pct: null, ultimo: null };
  }
  return { total: list.length, porTeil };
}

// A2 se aprueba con 60 % en cada parte.
export const BESTANDEN = 60;

export function veredicto(pct) {
  if (pct >= 80) return { txt: 'Sehr gut', tono: 'good' };
  if (pct >= BESTANDEN) return { txt: 'Bestanden', tono: 'good' };
  if (pct >= 45) return { txt: 'Knapp nicht bestanden', tono: 'warn' };
  return { txt: 'Nicht bestanden', tono: 'bad' };
}
