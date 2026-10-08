// Índice del libro que se sigue en clase: Miteinander (A1.1 · A1.2 · A2.1).
// Cada Lektion tiene tres bloques desarrollados:
//   woerter[]      → { thema, items: [{ de, es }] }
//   grammatik[]    → { regel, erklaerung, beispiele: [{ de, es }] }
//   kommunikation[]→ { funktion, wendungen: [{ de, es }] }
// El Cuaderno usa estos bloques como guía para la IA y como material de repaso.

import { A11 } from './a11.js';
import { A12 } from './a12.js';
import { A21 } from './a21.js';
import { framesForRule } from './frames/index.js';
import { t } from '../i18n.js';
import { tc, tcEjemplos, tcTabla, tcMas, tcLista } from '../contenido/index.js';

export const BAENDE = [A11, A12, A21];

export const KURSBUCH = {
  title: 'Miteinander',
  baende: BAENDE,
  // lista plana de todas las lecciones, con el tomo al que pertenecen
  lektionen: BAENDE.flatMap((b) =>
    b.lektionen.map((l) => ({ ...l, bandId: b.id, bandName: b.name }))
  )
};

// IDs antiguos (cuando la app solo tenía el tomo A2.1) → IDs nuevos.
// 'start' era el Start de A2.1, que ya no existe → cae en la Lektion 1.
const LEGACY = { start: 'a21-l1', 'a21-start': 'a21-l1', 'a12-start': 'a12-l9',
  l1: 'a21-l1', l2: 'a21-l2', l3: 'a21-l3',
  l4: 'a21-l4', l5: 'a21-l5', l6: 'a21-l6', l7: 'a21-l7', l8: 'a21-l8' };

// Los temas de vocabulario del libro van a veces en minuscula («persönliche
// Angaben…»); como titulo de un mazo quedaba raro al lado de los demas.
function mayuscula(texto) {
  const s = String(texto || '');
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function resolveLektionId(id) {
  if (!id) return DEFAULT_LEKTION_ID;
  if (LEGACY[id]) return LEGACY[id];
  return id;
}

export const DEFAULT_LEKTION_ID = 'a21-l1';

export function getLektion(id) {
  const wanted = resolveLektionId(id);
  return KURSBUCH.lektionen.find((l) => l.id === wanted) || null;
}

export function getBand(id) {
  return BAENDE.find((b) => b.id === id) || null;
}

export function lektionLabel(l) {
  if (!l) return '—';
  const head = l.nr === 'Start' ? 'Start' : `Lektion ${l.nr}`;
  return l.name ? `${head}: ${l.name}` : head;
}

// El rotulo del tomo ("Tomo 1 - A1.1") lleva una palabra en castellano.
export function bandLabel(b) {
  return tc(b?.label || '');
}

export function lektionFullLabel(l) {
  if (!l) return '—';
  return `${l.bandName || ''} · ${lektionLabel(l)}`.trim();
}

// ---- helpers de contenido ----

// Todas las palabras de una Lektion en una lista plana.
export function lektionWordList(l) {
  if (!l?.woerter?.length) return [];
  return lektionWoerter(l).flatMap((g) => g.items.map((it) => ({ ...it, thema: g.thema })));
}

// Resumen en texto de una Lektion, para el prompt de la IA.
export function lektionSummary(l) {
  if (!l) return '';
  const out = [`Lección: ${lektionFullLabel(l)}`];
  if (l.woerter?.length) {
    out.push('VOCABULARIO (Wörter):');
    for (const g of l.woerter) {
      const words = g.items.map((i) => `${i.de} (${i.es})`).join(', ');
      out.push(`- ${g.thema}: ${words}`);
    }
  }
  if (l.grammatik?.length) {
    out.push('GRAMÁTICA (Grammatik):');
    for (const g of l.grammatik) {
      out.push(`- ${g.regel}: ${g.erklaerung}`);
    }
  }
  if (l.kommunikation?.length) {
    out.push('COMUNICACIÓN (Kommunikation):');
    for (const k of l.kommunikation) {
      const w = (k.wendungen || []).map((x) => x.de).join(' | ');
      out.push(`- ${k.funktion}: ${w}`);
    }
  }
  return out.join('\n');
}

// ---- constructores para los motores de la app ----

function slug(s) {
  return String(s)
    .toLowerCase()
    .replace(/[äÄ]/g, 'a').replace(/[öÖ]/g, 'o').replace(/[üÜ]/g, 'u').replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 40);
}

export function ruleKey(rule) {
  return rule.key || slug(rule.regel);
}

export function ruleConceptId(lektion, rule) {
  return `${lektion.id}:${ruleKey(rule)}`;
}

// Convierte una Lektion en un "topic" para el motor de gramática
// (mismo contrato que src/topics/*.js: concepts + frames + theory).
export function lektionTopic(lektion) {
  if (!lektion) return null;
  // tc() traduce el contenido del libro al idioma de la interfaz. Se aplica
  // AQUI, donde nace el tema, y no en cada sitio que lo pinta: son cuarenta
  // puntos repartidos por la app y se escaparia la mitad.
  const concepts = lektion.grammatik.map((r) => ({
    id: ruleConceptId(lektion, r),
    name: tc(r.regel),
    hint: tc(r.erklaerung)
  }));
  const frames = lektion.grammatik.flatMap((r) =>
    framesForRule(ruleKey(r), ruleConceptId(lektion, r))
  );
  return {
    id: `kb-${lektion.id}`,
    lektionId: lektion.id,
    name: lektionLabel(lektion),
    nameEs: lektionLabel(lektion),
    blurb: `${lektion.bandName || ''} · ${lektion.grammatik.length} ${
      lektion.grammatik.length === 1 ? t('rule') : t('rules')
    }`,
    concepts,
    frames,
    aiOnly: frames.length === 0,
    theory: {
      // Sin intro: la que se generaba aquí repetía el título que ya está justo
      // encima y explicaba que se puede pulsar, cosa que se ve pulsando. Los
      // temas escritos a mano sí traen una suya que dice algo.
      intro: null,
      sections: lektion.grammatik.map((r) => ({
        title: tc(r.regel),
        body: tc(r.erklaerung),
        examples: tcEjemplos(r.beispiele),
        // Sin detail no hay detalle: repetir aqui la misma explicacion que ya
        // esta arriba hacia que al desplegar saliera el mismo parrafo dos
        // veces seguidas. Si la regla no trae nada mas, no hay nada que abrir.
        detail: r.detail ? tc(r.detail) : null,
        table: tcTabla(r.tabelle) || null,
        more: tcMas(r.mehr) || null
      })),
      pitfalls: (lektion.pitfalls || []).map((p) =>
        typeof p === 'string' ? tc(p) : { ...p, es: tc(p.es), erklaerung: tc(p.erklaerung) }
      )
    }
  };
}

// Las frases de Kommunikation, con la glosa traducida. El aleman (funktion,
// wendungen[].de) no se toca: es justo lo que hay que aprender.
export function lektionKommunikation(lektion) {
  return (lektion?.kommunikation || []).map((k) => ({
    ...k,
    es: tc(k.es),
    wendungen: (k.wendungen || []).map((w) => ({ ...w, es: tc(w.es) }))
  }));
}

// Los bloques de Wörter tal cual salen en el libro, con la traduccion de cada
// palabra en el idioma de la interfaz. `thema` es el nombre del bloque en
// aleman ("Zahlen 0-20"), asi que tc() lo deja igual salvo que este en
// castellano.
export function lektionWoerter(lektion) {
  return (lektion?.woerter || []).map((g) => ({
    ...g,
    thema: mayuscula(tc(g.thema)),
    items: (g.items || []).map((it) => ({ ...it, es: tc(it.es), exEs: it.exEs ? tc(it.exEs) : it.exEs }))
  }));
}

// Mazos de vocabulario de una Lektion (uno por tema de Wörter).
export function lektionDecks(lektion) {
  if (!lektion?.woerter?.length) return [];
  return lektion.woerter.map((g, i) => ({
    id: `kb-${lektion.id}-w${i}`,
    lektionId: lektion.id,
    name: mayuscula(tc(g.thema)),
    emoji: '📗',
    builtin: true,
    fromBook: true,
    bandId: lektion.bandId,
    bandName: lektion.bandName,
    lektionName: lektionLabel(lektion),
    // El ejemplo se pasa tal cual esta en el libro. Iba con ex y exEs vacios a
    // mano, asi que las tarjetas de las lecciones NUNCA daban una frase al
    // girarlas, mientras que las de los mazos sueltos si.
    cards: g.items.map((it) => ({
      de: it.de,
      _traducible: true,
      _esBase: it.es,
      _exEsBase: it.exEs || '',
      es: tc(it.es),
      ex: it.ex || '',
      exEs: it.exEs ? tc(it.exEs) : ''
    }))
  }));
}

// Un mazo con todas las palabras de la lección juntas. Los ejercicios van
// sobre esto y no sobre cada tema por separado: en clase la lección es una, y
// hacer tres tandas de diez palabras es más trámite que repaso.
export function lektionDeckTodo(lektion) {
  const decks = lektionDecks(lektion);
  if (!decks.length) return null;
  return {
    id: `kb-${lektion.id}-all`,
    lektionId: lektion.id,
    name: lektionLabel(lektion),
    emoji: '📚',
    builtin: true,
    fromBook: true,
    bandName: lektion.bandName,
    lektionName: lektionLabel(lektion),
    cards: decks.flatMap((d) => d.cards)
  };
}

// Ojo: los mazos "toda la lección" NO entran aquí. Si entraran, cada palabra
// se contaría dos veces (en su tema y en el combinado) y el total global de
// vocabulario saldría al doble. Se resuelven por id en getDeck().
export function allBookDecks() {
  return KURSBUCH.lektionen.flatMap((l) => lektionDecks(l));
}

export function lektionCounts(l) {
  return {
    woerter: l?.woerter?.reduce((s, g) => s + g.items.length, 0) || 0,
    themen: l?.woerter?.length || 0,
    grammatik: l?.grammatik?.length || 0,
    kommunikation: l?.kommunikation?.length || 0
  };
}

export function hasContent(l) {
  const c = lektionCounts(l);
  return c.woerter + c.grammatik + c.kommunikation > 0;
}
