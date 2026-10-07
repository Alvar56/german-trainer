// Premios de Wortschatz que solo se pueden cobrar una vez por tema, y premio
// recurrente por resolver crucigramas de ese mismo vocabulario.
import { storage } from './storage.js';
import { ganar } from './monedas.js';

const CORONAS = 'vocab:coronas-premiadas';
const CRUCIGRAMAS = 'vocab:crucigramas-resueltos';
export const MAX_CRUCIGRAMAS_VOCAB = 3;
export const UMBRAL_CRUCIGRAMA_VOCAB = 100;

export function crucigramasResueltos(deckId) {
  if (!deckId) return 0;
  const resueltos = storage.get(CRUCIGRAMAS, {});
  return Math.min(MAX_CRUCIGRAMAS_VOCAB, Math.max(0, Number(resueltos[deckId]) || 0));
}

export function cobrarCoronaVocab(deckId, nuevaComplecion = false) {
  if (!deckId) return 0;
  let premio = 0;
  storage.update(CORONAS, {}, (premiadas) => {
    // La app no reduce el progreso. Una nueva transición solo ocurre al
    // restaurar un porcentaje de prueba y volver a completar el mazo.
    if (premiadas[deckId] && !nuevaComplecion) return premiadas;
    premiadas[deckId] = Date.now();
    premio = 50;
    return premiadas;
  });
  if (premio) ganar(premio);
  return premio;
}

export function cobrarCrucigramaVocab(deckId) {
  if (!deckId) return 0;
  let premio = 0;
  storage.update(CRUCIGRAMAS, {}, (resueltos) => {
    const anteriores = Math.max(0, Number(resueltos[deckId]) || 0);
    if (anteriores >= MAX_CRUCIGRAMAS_VOCAB) return resueltos;
    premio = anteriores === 0 ? 50 : 10;
    resueltos[deckId] = anteriores + 1;
    return resueltos;
  });
  if (premio) ganar(premio);
  return premio;
}
