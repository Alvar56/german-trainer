import { storage } from './storage.js';
import { ganar } from './monedas.js';

const CORONAS_MAESTRIA = 'progreso:coronas-maestria-premiadas';
export const PREMIO_CORONA_MAESTRIA = 50;

// Una corona por tema y categoría; la marca evita volver a pagarla al repetir.
export function cobrarCoronaMaestria(categoria, id, nuevaComplecion = false) {
  if (!categoria || !id) return 0;
  let premio = 0;
  const clave = `${categoria}:${id}`;
  storage.update(CORONAS_MAESTRIA, {}, (coronas) => {
    // El progreso normal es monotónico, así que solo se llega una vez a esta
    // transición. En pruebas de desarrollo puede restaurarse al 99 %; si luego
    // se vuelve a completar, la transición vuelve a conceder el premio.
    if (coronas[clave] && !nuevaComplecion) return coronas;
    coronas[clave] = Date.now();
    premio = PREMIO_CORONA_MAESTRIA;
    return coronas;
  });
  if (premio) ganar(premio);
  return premio;
}
