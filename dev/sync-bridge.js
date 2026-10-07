import fs from 'node:fs';
import path from 'node:path';

const DB_PATH = path.join(process.cwd(), '.dtrainer-sync.json');
const TMP_PATH = DB_PATH + '.tmp';

// Escritura atomica: primero a un temporal y luego se renombra. rename() es
// atomico en el mismo disco, asi que el fichero bueno nunca se queda a medias.
// Antes se escribia encima directamente: si el servidor se moria en ese
// momento (o se apagaba el ordenador, que pasa), el JSON quedaba truncado y se
// perdia TODO el progreso guardado, no solo el ultimo cambio.
function guardar(obj) {
  fs.writeFileSync(TMP_PATH, JSON.stringify(obj));
  fs.renameSync(TMP_PATH, DB_PATH);
}

function leer() {
  if (!fs.existsSync(DB_PATH)) return { timestamp: 0, data: {} };
  try {
    return JSON.parse(fs.readFileSync(DB_PATH, 'utf-8'));
  } catch {
    // Fichero corrupto de alguna escritura anterior a medias: mejor empezar de
    // cero que reventar en cada peticion.
    return { timestamp: 0, data: {} };
  }
}

export function syncBridge() {
  // Las peticiones se atienden de una en una. La secuencia leer marca →
  // compararla → escribir no es atomica, asi que dos POST a la vez podian
  // leer los dos la misma marca, pasar los dos el control y escribir los dos:
  // el segundo se llevaba por delante al primero sin que nadie se enterara.
  let cola = Promise.resolve();
  const enCola = (fn) => {
    const r = cola.then(fn);
    cola = r.catch(() => {});
    return r;
  };

  // Lee el cuerpo entero de un POST, con tope. El payload completo lleva todo
  // el progreso (mazos, fotos del cuaderno…), asi que el tope es generoso.
  const leerCuerpo = (req, alAcabar) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
      if (body.length > 32 * 1024 * 1024) req.destroy();
    });
    req.on('end', () => enCola(() => alAcabar(body)));
  };

  // La parte comun de los dos POST: comprobar que el cliente no va con datos
  // viejos, guardar lo que salga de `nuevosDatos` y contestar con la marca.
  const guardarSiAlDia = (res, body, nuevosDatos) => {
    res.setHeader('Content-Type', 'application/json');
    try {
      const reqData = JSON.parse(body);
      const clientTs = reqData.localTs || 0;
      const actual = leer();
      const backendTs = actual.timestamp || 0;

      if (clientTs > 0 && clientTs < backendTs) {
        res.statusCode = 409;
        res.end(JSON.stringify({ error: 'Stale sync', timestamp: backendTs }));
        return;
      }

      // Date.now() puede repetirse si dos escrituras caen en el mismo
      // milisegundo, y entonces la marca no distingue una de otra.
      const timestamp = Math.max(Date.now(), backendTs + 1);
      guardar({ timestamp, data: nuevosDatos(reqData, actual.data || {}) });
      res.end(JSON.stringify({ success: true, timestamp }));
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid JSON' }));
    }
  };

  // Igual en `vite` (desarrollo) que en `vite preview` (la app compilada).
  const montar = (server) => {
    // Solo lo que ha cambiado: { localTs, cambios: { clave: valor | null } },
    // con null para lo borrado. Antes cada respuesta subia el progreso
    // entero (~3 MB con las fotos): el navegador se paraba a juntarlo y
    // convertirlo cada vez.
    //
    // Ruta APARTE a proposito, y no un formato nuevo en /api/sync: un
    // servidor de antes guardaria esto como si fuera TODO el progreso y
    // borraria el resto. A esta ruta, uno viejo contesta 404 y el cliente
    // vuelve a mandarlo entero.
    server.middlewares.use('/api/sync-cambios', (req, res, next) => {
      if (req.method !== 'POST') return next();
      leerCuerpo(req, (body) =>
        guardarSiAlDia(res, body, (reqData, datos) => {
          const cambios = reqData.cambios;
          if (!cambios || typeof cambios !== 'object') throw new Error('sin cambios');
          const nuevos = { ...datos };
          for (const [k, v] of Object.entries(cambios)) {
            if (v === null) delete nuevos[k];
            else nuevos[k] = v;
          }
          return nuevos;
        })
      );
    });

    server.middlewares.use('/api/sync', (req, res, next) => {
      if (req.method === 'GET') {
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
        enCola(() => res.end(JSON.stringify(leer())));
        return;
      }

      // El progreso entero: lo que mandan las versiones de antes (el movil
      // puede tener una en cache) y el cliente nuevo si la otra ruta falla.
      if (req.method === 'POST') {
        leerCuerpo(req, (body) => guardarSiAlDia(res, body, (reqData) => reqData.payload || reqData));
        return;
      }

      next();
    });
  };

  return {
    name: 'dtrainer-sync',
    configureServer: montar,
    configurePreviewServer: montar
  };
}
