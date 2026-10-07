// Capitaliza el inicio de cada frase que se muestra como ejercicio.
// No modifica opciones sueltas (por ejemplo, un verbo que completa un hueco).
export function capitalizarInicioFrase(valor) {
  return String(valor ?? '').replace(
    /(^\s*(?:[—–-]\s*)?|[.!?]\s+|\n\s*(?:[—–-]\s*)?)(["'„“«»]*)(\p{Ll})/gu,
    (_coincidencia, separador, comillas, letra) => separador + comillas + letra.toLocaleUpperCase('de-DE')
  );
}
