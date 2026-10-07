// Plugin de Vite SOLO para desarrollo local.
// Expone POST /api/ai en el servidor de dev y por debajo ejecuta el CLI
// `claude -p`, de modo que la app puede usar tu sesión de Claude Code ya
// iniciada (sin API key). No se incluye en el build de producción.

import { spawn } from 'node:child_process';
import os from 'node:os';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

// Solo se permiten estas herramientas, y únicamente si la petición las pide.
const ALLOWED_TOOLS = ['WebSearch', 'WebFetch', 'Read'];

const TIPOS = { png: 'png', jpg: 'jpg', jpeg: 'jpg', gif: 'gif', webp: 'webp' };

// Guarda una imagen (data URL) en un fichero temporal para que el CLI pueda
// leerla con la herramienta Read. Devuelve la ruta, o null si no vale.
function guardarImagen(dataUrl) {
  const m = /^data:image\/([a-z]+);base64,([\s\S]+)$/i.exec(String(dataUrl || ''));
  if (!m) return null;
  const ext = TIPOS[m[1].toLowerCase()];
  if (!ext) return null;
  const buf = Buffer.from(m[2], 'base64');
  if (!buf.length || buf.length > 12 * 1024 * 1024) return null;
  const file = path.join(os.tmpdir(), `dtrainer-${crypto.randomUUID()}.${ext}`);
  fs.writeFileSync(file, buf);
  return file;
}

function runClaude(prompt, { timeoutMs = 120000, tools = [] } = {}) {
  return new Promise((resolve, reject) => {
    const safe = tools.filter((t) => ALLOWED_TOOLS.includes(t));
    const args = ['-p', '--output-format', 'text'];
    if (safe.length) args.push('--allowedTools', safe.join(','));
    // Sin datos del usuario en los argumentos: el prompt va por stdin.
    const child = spawn('claude', args, {
      shell: true,
      cwd: os.tmpdir(),
      windowsHide: true
    });

    let out = '';
    let err = '';
    const timer = setTimeout(() => {
      child.kill();
      reject(new Error('Claude tardó demasiado (timeout).'));
    }, timeoutMs);

    child.stdout.on('data', (d) => (out += d));
    child.stderr.on('data', (d) => (err += d));
    child.on('error', (e) => {
      clearTimeout(timer);
      if (e && e.code === 'ENOENT') {
        reject(new Error('No se encontró el CLI `claude`. Instálalo o usa una API key en Ajustes.'));
      } else {
        reject(e);
      }
    });
    child.on('close', (code) => {
      clearTimeout(timer);
      const todo = out + '\n' + err;

      // Cuota agotada. El CLI lo escribe en texto plano y a veces SALIENDO CON
      // CODIGO 0, asi que sin esto se colaba como si fuera la respuesta buena:
      // la app intentaba sacarle un JSON, fallaba, y tu te habias comido la
      // espera y la cuota para nada. Se detecta antes que nada y se marca con
      // `limite` para que el cliente sepa que no es un fallo cualquiera.
      const lim = /(hit your (?:usage|session) limit|usage limit reached|rate limit)/i.exec(todo);
      if (lim) {
        const reset = /resets?\s+([^\n·)]+)/i.exec(todo);
        const e = new Error(
          'Has agotado el límite de uso de Claude' +
            (reset ? `. Se reinicia ${reset[1].trim()}` : '') +
            '.'
        );
        e.limite = true;
        e.resetTexto = reset ? reset[1].trim() : '';
        reject(e);
        return;
      }

      if (code === 0 && out.trim()) {
        resolve(out.trim());
        return;
      }
      const detail = (err.trim() || out.trim() || '').split('\n').slice(0, 4).join(' ');
      let msg = detail || `claude terminó con código ${code}`;
      if (/auth|OAuth|login|expired/i.test(msg)) {
        msg =
          'El CLI `claude` no está autenticado (' +
          msg +
          '). Ejecuta `claude` una vez en una terminal para iniciar sesión y reinicia `npm run dev`.';
      }
      reject(new Error(msg));
    });

    child.stdin.write(prompt);
    child.stdin.end();
  });
}

// El CLI abre un proceso por peticion, asi que se atienden de una en una. Lo
// que faltaba era ponerle limite y saber si al que espera todavia le interesa.
//
//   · Tope de cola: mas alla de esto se contesta al momento en vez de dejar a
//     alguien esperando el cuadruple de lo normal sin decirle nada. Es lo que
//     pasaba al lanzar varias generaciones a la vez: se apilaban, y la que
//     fallaba soltaba un 502 seco sin explicar que venia de ir en cola.
//   · Si al llegar su turno el navegador ya ha colgado (cerraste la pestaña,
//     recargaste), NO se arranca el proceso. Eso es cuota que no se gasta.
const MAX_EN_COLA = 3;

let currentClaudeTask = Promise.resolve();
let enCola = 0;

function enqueueClaude(prompt, options = {}) {
  const { sigueInteresando, ...opciones } = options;
  if (enCola >= MAX_EN_COLA) {
    const e = new Error(
      `Hay ${enCola} generaciones por delante en la cola. Espera a que terminen y vuelve a intentarlo: el CLI solo puede con una cada vez.`
    );
    e.ocupado = true;
    return Promise.reject(e);
  }
  enCola++;
  const result = currentClaudeTask.then(() => {
    if (sigueInteresando && !sigueInteresando()) {
      const e = new Error('Petición abandonada antes de llegarle el turno.');
      e.abandonada = true;
      throw e;
    }
    return runClaude(prompt, opciones);
  });
  currentClaudeTask = result.catch(() => {});
  result.catch(() => {}).finally(() => {
    enCola--;
  });
  return result;
}

export function claudeBridge() {
  // Igual en `vite` (desarrollo) que en `vite preview` (la app compilada).
  const montar = (server) => {
    server.middlewares.use('/api/ai', (req, res) => {
      if (req.method !== 'POST') {
        res.statusCode = 405;
        res.end('Method Not Allowed');
        return;
      }
      let body = '';
      req.on('data', (c) => {
        body += c;
        // las fotos van en base64, así que el límite tiene que ser generoso
        if (body.length > 20 * 1024 * 1024) req.destroy();
      });
      req.on('end', async () => {
        res.setHeader('Content-Type', 'application/json');
        let prompt = '';
        let tools = [];
        let timeoutMs = 120000;
        let imagen = null;
        try {
          const parsed = JSON.parse(body || '{}');
          prompt = String(parsed.prompt || '');
          if (parsed.system) prompt = String(parsed.system) + '\n\n' + prompt;
          if (Array.isArray(parsed.tools)) tools = parsed.tools.map(String);
          if (Number(parsed.timeoutMs) > 0) timeoutMs = Math.min(Number(parsed.timeoutMs), 600000);
          // Si viene una foto, se deja en un temporal y se le pasa la ruta al CLI.
          if (parsed.image) {
            imagen = guardarImagen(parsed.image);
            if (!imagen) {
              res.statusCode = 400;
              res.end(JSON.stringify({ error: 'Imagen no válida (usa PNG, JPG, GIF o WEBP, máx. 12 MB).' }));
              return;
            }
            if (!tools.includes('Read')) tools.push('Read');
            prompt = `Lee la imagen que hay en esta ruta: ${imagen}\n\n${prompt}`;
          }
        } catch {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'JSON inválido.' }));
          return;
        }
        if (!prompt.trim()) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Falta el prompt.' }));
          return;
        }
        // Si el navegador cuelga mientras esta en cola, no hay a quien
        // contestar: mejor no gastar una generacion en eso.
        let vivo = true;
        res.on('close', () => {
          vivo = false;
        });

        try {
          const text = await enqueueClaude(prompt, {
            tools,
            timeoutMs,
            sigueInteresando: () => vivo
          });
          res.end(JSON.stringify({ text }));
        } catch (e) {
          if (e.abandonada) {
            // Nadie escucha ya: se cierra y a otra cosa.
            res.end();
          } else {
            // 429 tanto para la cuota agotada como para la cola llena: en los
            // dos casos es "ahora no, vuelve luego", no un fallo del que haya
            // que sospechar. 502 se queda para los problemas de verdad.
            res.statusCode = e.limite || e.ocupado ? 429 : 502;
            res.end(
              JSON.stringify({
                error: e.message || String(e),
                limite: !!e.limite,
                ocupado: !!e.ocupado,
                reset: e.resetTexto || ''
              })
            );
          }
        } finally {
          // la foto temporal no se queda en el disco pase lo que pase
          if (imagen) {
            try {
              fs.unlinkSync(imagen);
            } catch {
              /* si ya no está, mejor */
            }
          }
        }
      });
    });
  };
  return {
    name: 'claude-bridge',
    apply: 'serve',
    configureServer: montar,
    configurePreviewServer: montar
  };
}
