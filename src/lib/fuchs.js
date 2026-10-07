// Fuchs: el zorrito que te acompaña. Guarda su nombre, su color y lo que
// lleva puesto, y calcula qué complementos tienes desbloqueados.
//
// Los desbloqueos salen de cosas que ya mide la app: coronas (lecciones
// dominadas), nivel (XP) y récord de aciertos seguidos. Nada nuevo que llevar
// la cuenta por separado.

import { storage } from './storage.js';
import { SIN_IA } from './modo.js';
import { getLevel, getStreak } from './streak.js';
import { bestStreak } from './rachas.js';
import { saldo, gastar } from './monedas.js';
import { tc } from './contenido/index.js';

const KEY = 'fuchs';

// Cada color lleva sus tres tonos: el pelo, su sombra y la luz de arriba.
// Sin eso la cara sale plana. El naranja viene de serie; el resto NO se compra:
// se abre subiendo de nivel, que es lo unico que sube solo con practicar. Asi
// el zorro cambia de aspecto segun avanzas, sin tener que pagar por ello.
export const COLORES = [
  { id: 'naranja', de: 'Orange', es: 'Naranja', en: 'Orange', fur: '#e8833a', sombra: '#c2611f', luzPelo: '#ffa25c', luz: '#ffe2c2' },
  { id: 'crema', de: 'Creme', es: 'Crema', en: 'Cream', fur: '#e0b487', sombra: '#b98d61', luzPelo: '#f6d3ac', luz: '#fff2e0', req: { tipo: 'nivel', n: 5 } },
  { id: 'rojo', de: 'Rotbraun', es: 'Rojizo', en: 'Red', fur: '#d1553f', sombra: '#a63a28', luzPelo: '#ef7a5f', luz: '#ffd6c8', req: { tipo: 'nivel', n: 10 } },
  { id: 'marron', de: 'Schokolade', es: 'Chocolate', en: 'Chocolate', fur: '#8a5a3b', sombra: '#66402a', luzPelo: '#a97550', luz: '#e6cdb8', req: { tipo: 'nivel', n: 18 } },
  { id: 'gris', de: 'Arktis', es: 'Ártico', en: 'Arctic', fur: '#9fb3c8', sombra: '#7a8fa6', luzPelo: '#c3d5e8', luz: '#f2f7fc', req: { tipo: 'nivel', n: 26 } },
  { id: 'verde', de: 'Wald', es: 'Bosque', en: 'Forest', fur: '#5c9e6b', sombra: '#3f7a4c', luzPelo: '#7cc08b', luz: '#dcf3e2', req: { tipo: 'nivel', n: 34 } },
  { id: 'negro', de: 'Nacht', es: 'Nocturno', en: 'Night', fur: '#4a4a5a', sombra: '#33333f', luzPelo: '#66667a', luz: '#cfcfdd', req: { tipo: 'nivel', n: 42 } },
  { id: 'morado', de: 'Lila', es: 'Morado', en: 'Purple', fur: '#8b6bc7', sombra: '#6a4ba3', luzPelo: '#a98be0', luz: '#e8dcfa', req: { tipo: 'nivel', n: 50 } },
  { id: 'rosa', de: 'Rosa', es: 'Rosa', en: 'Pink', fur: '#e07aa8', sombra: '#b85585', luzPelo: '#f79ac4', luz: '#ffe0ef', req: { tipo: 'nivel', n: 58 } },
  { id: 'hielo', de: 'Eis', es: 'Hielo', en: 'Ice', fur: '#6fc3d9', sombra: '#4a9db3', luzPelo: '#95dced', luz: '#dcf6fc', req: { tipo: 'nivel', n: 65 } },
  { id: 'turquesa', de: 'Türkis', es: 'Turquesa', en: 'Turquoise', fur: '#3fb3a6', sombra: '#2a8a7f', luzPelo: '#5fd6c8', luz: '#d6f5f0', req: { tipo: 'nivel', n: 72 } },
  { id: 'fuego', de: 'Feuer', es: 'Fuego', en: 'Fire', fur: '#e8552f', sombra: '#b3341a', luzPelo: '#ff8459', luz: '#ffd9c0', req: { tipo: 'nivel', n: 79 } },
  { id: 'bronce', de: 'Kupfer', es: 'Bronce', en: 'Bronze', fur: '#b5651d', sombra: '#8a4a12', luzPelo: '#d98a3c', luz: '#f7dcc0', req: { tipo: 'nivel', n: 85 } },
  { id: 'plata', de: 'Silber', es: 'Plata', en: 'Silver', fur: '#b8c2cc', sombra: '#8e99a4', luzPelo: '#d8e2ea', luz: '#f6fafd', req: { tipo: 'nivel', n: 90 } },
  { id: 'dorado', de: 'Gold', es: 'Oro', en: 'Gold', fur: '#d9a520', sombra: '#a87c12', luzPelo: '#f0c344', luz: '#fff0bc', req: { tipo: 'nivel', n: 95 } },
  { id: 'galaxy-green', de: 'Grüne Galaxie', es: 'Galaxia verde', en: 'Green Galaxy', fur: '#22c55e', sombra: '#14532d', luzPelo: '#86efac', luz: '#f0fdf4', luzSombra: '#4ade80', req: { tipo: 'nivel', n: 98 } },
  { id: 'galaxy-red', de: 'Rote Galaxie', es: 'Galaxia roja', en: 'Red Galaxy', fur: '#ea580c', sombra: '#7c2d12', luzPelo: '#fdba74', luz: '#fff7ed', luzSombra: '#fb923c', req: { tipo: 'nivel', n: 99 } },
  { id: 'galaxy-blue', de: 'Blaue Galaxie', es: 'Galaxia azul', en: 'Blue Galaxy', fur: '#38bdf8', sombra: '#312e81', luzPelo: '#a5f3fc', luz: '#f0f4ff', luzSombra: '#a5b4fc', req: { tipo: 'nivel', n: 100 } }
];

// Tres vias, y cada una premia una cosa distinta:
//   · monedas  → lo que compras practicando, la mayoria del armario
//   · 👑       → TODO lo de rey. No se vende: se domina lección a lección
//   · dias     → el equipo de deporte, que es cuestion de constancia
//   · racha    → las particulas
//
// Lo que se gana va ordenado por lo que mola, no por el orden en que se me
// fue ocurriendo. Antes la medalla caia antes que unas zapatillas de deporte
// y el monoculo pedia mas coronas que la capa real, asi que la lista de "por
// ganar" no era una escalera, era un monton. Ahora:
//
//   dias    10 cinta · 20 chandal · 40 zapatillas · 60 gafas · 90 medalla ·
//           150 reloj de arena · 365 copa de oro
//   coronas 4 zapatos · 6 cristal · 8 monoculo · 10 capa · 12 collar ·
//           14 traje · 16 vestido · 18 orbe · 20 cetro · 22 diadema ·
//           24 corona
//
// El techo de coronas es 24 y no 25 aposta: hay 25 lecciones, y dejar la
// ultima pieza detras de un 100% clavado en TODAS es pedir demasiado.
export const COMPLEMENTOS = [
  // ---- cabeza ----
  { id: 'nada', de: 'Nichts', ranura: 'cabeza', es: 'Sin nada', en: 'Nothing', precio: 0 },
  { id: 'flor', de: 'Blume', ranura: 'cabeza', es: 'Flor', en: 'Flower', precio: 100 },
  { id: 'gorroLana', de: 'Wollmütze', ranura: 'cabeza', es: 'Gorro de lana', en: 'Wool beanie', precio: 130 },
  { id: 'gorra', de: 'Kappe', ranura: 'cabeza', es: 'Gorra', en: 'Cap', precio: 160 },
  { id: 'paja', de: 'Strohhut', ranura: 'cabeza', es: 'Sombrero de paja', en: 'Straw hat', precio: 190 },
  { id: 'orejeras', de: 'Ohrenschützer', ranura: 'cabeza', es: 'Orejeras', en: 'Earmuffs', precio: 220 },
  { id: 'boina', de: 'Baskenmütze', ranura: 'cabeza', es: 'Boina', en: 'Beret', precio: 250 },
  { id: 'cocinero', de: 'Kochmütze', ranura: 'cabeza', es: 'Gorro de cocinero', en: 'Chef hat', precio: 280 },
  { id: 'casco', de: 'Fahrradhelm', ranura: 'cabeza', es: 'Casco de ciclista', en: 'Cycling helmet', precio: 320 },
  { id: 'sombreroElegante', de: 'Eleganter Hut', ranura: 'cabeza', es: 'Sombrero elegante', en: 'Elegant hat', precio: 340 },
  { id: 'navidad', de: 'Weihnachtsmütze', ranura: 'cabeza', es: 'Gorro de Navidad', en: 'Santa hat', precio: 360 },
  { id: 'tirolerhut', de: 'Tirolerhut', ranura: 'cabeza', es: 'Sombrero tirolés', en: 'Tyrolean hat', precio: 420 },
  { id: 'auriculares', de: 'Kopfhörer', ranura: 'cabeza', es: 'Auriculares', en: 'Headphones', precio: 460 },
  { id: 'chistera', de: 'Zylinder', ranura: 'cabeza', es: 'Chistera', en: 'Top hat', precio: 520 },
  { id: 'cascoAstronauta', de: 'Astronautenhelm', ranura: 'cabeza', es: 'Casco de astronauta', en: 'Astronaut helmet', precio: 450 },
  { id: 'cinta', de: 'Stirnband', ranura: 'cabeza', es: '🏃 Cinta del pelo', en: '🏃 Headband', req: { tipo: 'dias', n: 10 } },
  { id: 'diadema', de: 'Diadem', ranura: 'cabeza', es: '👑 Diadema de reina', en: '👑 Queen tiara', req: { tipo: 'coronas', n: 22 } },
  { id: 'corona', de: 'Königskrone', ranura: 'cabeza', es: '👑 Corona de rey', en: '👑 King crown', req: { tipo: 'coronas', n: 24 } },

  // ---- ojos ----
  { id: 'nadaOjos', de: 'Nichts', ranura: 'ojos', es: 'Sin nada', en: 'Nothing', precio: 0 },
  { id: 'gafas', de: 'Brille', ranura: 'ojos', es: 'Gafas', en: 'Glasses', precio: 100 },
  { id: 'gafasNerd', de: 'Nerdbrille', ranura: 'ojos', es: 'Gafas de pasta', en: 'Nerd glasses', precio: 140 },
  { id: 'gafasol', de: 'Sonnenbrille', ranura: 'ojos', es: 'Gafas de sol', en: 'Sunglasses', precio: 220 },
  { id: 'gafas3d', de: '3D-Brille', ranura: 'ojos', es: 'Gafas 3D', en: '3D glasses', precio: 260 },
  { id: 'gafasEsqui', de: 'Skibrille', ranura: 'ojos', es: 'Gafas de esquí', en: 'Ski goggles', precio: 320 },
  { id: 'parche', de: 'Augenklappe', ranura: 'ojos', es: 'Parche pirata', en: 'Eye patch', precio: 380 },
  { id: 'antifaz', de: 'Faschingsmaske', ranura: 'ojos', es: 'Antifaz', en: 'Carnival mask', precio: 440 },
  { id: 'gafasCiclismo', de: 'Sportbrille', ranura: 'ojos', es: '🚴 Gafas de ciclismo', en: '🚴 Cycling glasses', req: { tipo: 'dias', n: 60 } },
  { id: 'monoculo', de: 'Monokel', ranura: 'ojos', es: '👑 Monóculo', en: '👑 Monocle', req: { tipo: 'coronas', n: 8 } },

  // ---- cuello ----
  { id: 'nadaCuello', de: 'Nichts', ranura: 'cuello', es: 'Sin nada', en: 'Nothing', precio: 0 },
  { id: 'cordon', de: 'Lederband', ranura: 'cuello', es: 'Cordón de cuero', en: 'Leather cord', precio: 100 },
  { id: 'panuelo', de: 'Halstuch', ranura: 'cuello', es: 'Pañuelo', en: 'Bandana', precio: 140 },
  { id: 'bufanda', de: 'Schal', ranura: 'cuello', es: 'Bufanda', en: 'Scarf', precio: 180 },
  { id: 'collar', de: 'Halsband', ranura: 'cuello', es: 'Collar con cascabel', en: 'Bell collar', precio: 220 },
  { id: 'pajarita', de: 'Fliege', ranura: 'cuello', es: 'Pajarita', en: 'Bow tie', precio: 280 },
  { id: 'corbata', de: 'Krawatte', ranura: 'cuello', es: 'Corbata', en: 'Tie', precio: 320 },
  { id: 'perlas', de: 'Perlenkette', ranura: 'cuello', es: 'Collar de perlas', en: 'Pearl necklace', precio: 380 },
  { id: 'medalla', de: 'Medaille', ranura: 'cuello', es: '🏅 Medalla', en: '🏅 Medal', req: { tipo: 'dias', n: 90 } },
  { id: 'capa', de: 'Königsumhang', ranura: 'cuello', es: '👑 Capa real', en: '👑 Royal cape', req: { tipo: 'coronas', n: 10 } },
  { id: 'collarReina', de: 'Königinnenkette', ranura: 'cuello', es: '👑 Collar de reina', en: '👑 Queen necklace', req: { tipo: 'coronas', n: 12 } },

  // ---- ropa ----
  { id: 'nadaRopa', de: 'Nichts', ranura: 'ropa', es: 'Sin nada', en: 'Nothing', precio: 0 },
  { id: 'camiseta', de: 'T-Shirt', ranura: 'ropa', es: 'Camiseta', en: 'T-shirt', precio: 120 },
  { id: 'camisa', de: 'Hemd', ranura: 'ropa', es: 'Camisa', en: 'Shirt', precio: 150 },
  { id: 'rayas', de: 'Ringelshirt', ranura: 'ropa', es: 'Camiseta de rayas', en: 'Striped shirt', precio: 180 },
  { id: 'jersey', de: 'Pullover', ranura: 'ropa', es: 'Jersey', en: 'Jumper', precio: 220 },
  { id: 'sudadera', de: 'Hoodie', ranura: 'ropa', es: 'Sudadera', en: 'Hoodie', precio: 260 },
  { id: 'rebeca', de: 'Strickjacke', ranura: 'ropa', es: 'Chaqueta de punto', en: 'Cardigan', precio: 300 },
  { id: 'chaleco', de: 'Weste', ranura: 'ropa', es: 'Chaleco', en: 'Puffer vest', precio: 340 },
  { id: 'chubasquero', de: 'Regenjacke', ranura: 'ropa', es: 'Chubasquero', en: 'Rain jacket', precio: 380 },
  { id: 'abrigo', de: 'Mantel', ranura: 'ropa', es: 'Abrigo', en: 'Coat', precio: 440 },
  { id: 'traje', de: 'Eleganter Anzug', ranura: 'ropa', es: 'Traje de vestir', en: 'Dress suit', precio: 480 },
  { id: 'tracht', de: 'Tracht', ranura: 'ropa', es: 'Traje típico', en: 'Traditional dress', precio: 500 },
  { id: 'trajeAstronauta', de: 'Raumanzug', ranura: 'ropa', es: 'Traje de astronauta', en: 'Spacesuit', precio: 520 },
  { id: 'peto', de: 'Latzhose', ranura: 'ropa', es: 'Peto', en: 'Dungarees', precio: 540 },
  { id: 'trachtenanzug', de: 'Trachtenanzug', ranura: 'ropa', es: 'Traje tirolés', en: 'Tyrolean suit', precio: 600 },
  { id: 'chandal', de: 'Trainingsanzug', ranura: 'ropa', es: '🏃 Chándal', en: '🏃 Tracksuit', req: { tipo: 'dias', n: 20 } },
  { id: 'trajerey', de: 'Königsrobe', ranura: 'ropa', es: '👑 Traje de rey', en: '👑 King robe', req: { tipo: 'coronas', n: 14 } },
  { id: 'vestidoReina', de: 'Königinnenkleid', ranura: 'ropa', es: '👑 Vestido de reina', en: '👑 Queen gown', req: { tipo: 'coronas', n: 16 } },

  // ---- pies ----
  { id: 'nadaPies', de: 'Nichts', ranura: 'pies', es: 'Sin nada', en: 'Nothing', precio: 0 },
  { id: 'calcetines', de: 'Socken', ranura: 'pies', es: 'Calcetines', en: 'Socks', precio: 80 },
  { id: 'pantuflas', de: 'Hausschuhe', ranura: 'pies', es: 'Pantuflas', en: 'Slippers', precio: 110 },
  { id: 'zapatucos', de: 'Schühchen', ranura: 'pies', es: 'Zapatucos', en: 'Little boots', precio: 140 },
  { id: 'sandalias', de: 'Sandalen', ranura: 'pies', es: 'Sandalias', en: 'Sandals', precio: 180 },
  { id: 'katiuskas', de: 'Gummistiefel', ranura: 'pies', es: 'Katiuskas', en: 'Wellies', precio: 240 },
  { id: 'botasAstronauta', de: 'Mondstiefel', ranura: 'pies', es: 'Botas lunares', en: 'Moon boots', precio: 260 },
  { id: 'botas', de: 'Stiefel', ranura: 'pies', es: 'Botas', en: 'Boots', precio: 300 },
  { id: 'patines', de: 'Rollschuhe', ranura: 'pies', es: 'Patines', en: 'Roller skates', precio: 380 },
  { id: 'zapatillas', de: 'Turnschuhe', ranura: 'pies', es: '🏃 Zapatillas', en: '🏃 Trainers', req: { tipo: 'dias', n: 40 } },
  { id: 'zapatosrey', de: 'Königsschuhe', ranura: 'pies', es: '👑 Zapatos de rey', en: '👑 King shoes', req: { tipo: 'coronas', n: 4 } },
  { id: 'cristal', de: 'Kristallschuhe', ranura: 'pies', es: '👑 Zapatos de cristal', en: '👑 Glass slippers', req: { tipo: 'coronas', n: 6 } },

  // ---- efectos: una progresión de luz, estrellas y cristales ----
  { id: 'p0', de: 'Nichts', ranura: 'particulas', es: 'Nada', en: 'Nothing', precio: 0 },
  { id: 'p1', de: 'Goldene Lichtpunkte', ranura: 'particulas', es: '✨ Destellos dorados', en: '✨ Golden glimmers', req: { tipo: 'racha', n: 10 } },
  { id: 'p2', de: 'Sternschnuppen', ranura: 'particulas', es: '💫 Estelas luminosas', en: '💫 Starlight trails', req: { tipo: 'racha', n: 20 } },
  { id: 'p3', de: 'Sternenaura', ranura: 'particulas', es: '🌟 Aura estelar', en: '🌟 Star aura', req: { tipo: 'racha', n: 30 } },
  { id: 'p4', de: 'Mondorbit', ranura: 'particulas', es: '🌙 Órbita lunar', en: '🌙 Moon orbit', req: { tipo: 'racha', n: 40 } },
  { id: 'p5', de: 'Kristallregen', ranura: 'particulas', es: '💎 Lluvia de cristales', en: '💎 Crystal rain', req: { tipo: 'racha', n: 50 } },
  { id: 'p6', de: 'Polarlicht', ranura: 'particulas', es: '🌌 Aurora boreal', en: '🌌 Northern lights', req: { tipo: 'racha', n: 65 } },
  { id: 'p7', de: 'Sternbild', ranura: 'particulas', es: '🌠 Constelación', en: '🌠 Constellation', req: { tipo: 'racha', n: 80 } },

  // ---- objetos: unos se compran y los tres trofeos se ganan ----
  { id: 'nadaObjeto', de: 'Nichts', ranura: 'objeto', es: 'Nada', en: 'Nothing', precio: 0 },
  { id: 'libro', de: 'Buch', ranura: 'objeto', es: 'Libro', en: 'Book', precio: 150 },
  { id: 'taza', de: 'Kaffeetasse', ranura: 'objeto', es: 'Taza de café', en: 'Coffee mug', precio: 180 },
  { id: 'brezel', de: 'Brezel', ranura: 'objeto', es: 'Brezel', en: 'Pretzel', precio: 220 },
  { id: 'baston', de: 'Spazierstock', ranura: 'objeto', es: 'Bastón', en: 'Walking stick', precio: 320 },
  { id: 'cohete', de: 'Spielzeugrakete', ranura: 'objeto', es: 'Cohete', en: 'Toy rocket', precio: 340 },
  { id: 'globo', de: 'Luftballon', ranura: 'objeto', es: 'Globo', en: 'Balloon', precio: 380 },
  { id: 'camara', de: 'Kamera', ranura: 'objeto', es: 'Cámara de fotos', en: 'Camera', precio: 450 },
  { id: 'guitarra', de: 'Gitarre', ranura: 'objeto', es: 'Guitarra', en: 'Guitar', precio: 540 },
  { id: 'trebol', de: 'Vierblättriges Kleeblatt', ranura: 'objeto', es: '🍀 Trébol de cuatro hojas', en: '🍀 Four-leaf clover', precio: 280 },
  { id: 'peluche', de: 'Kuscheltier', ranura: 'objeto', es: 'Peluche', en: 'Teddy bear', precio: 260 },
  { id: 'cocheRC', de: 'Ferngesteuertes Auto', ranura: 'objeto', es: 'Coche teledirigido', en: 'Remote-control car', precio: 400 },
  { id: 'robot', de: 'Roboter', ranura: 'objeto', es: 'Robot', en: 'Robot', precio: 800 },
  { id: 'trofeo', de: 'Goldpokal', ranura: 'objeto', es: '🏆 Trofeo de oro', en: '🏆 Gold trophy', req: { tipo: 'dias', n: 365 } },
  { id: 'orbe', de: 'Reichsapfel', ranura: 'objeto', es: '👑 Orbe de reina', en: '👑 Queen orb', req: { tipo: 'coronas', n: 18 } },
  { id: 'bastonrey', de: 'Zepter', ranura: 'objeto', es: '👑 Bastón de rey', en: '👑 Royal sceptre', req: { tipo: 'coronas', n: 20 } }
];

// Cada especie nueva se desbloquea con una compra única.
export const PRECIO_ANIMAL = 500;
// Cambiar el nombre se desbloquea con un único pago de monedas.
export const PRECIO_NOMBRE = 1000;
const LLAVE_NOMBRE = 'nombre';

export function puedeCambiarNombre(f = getFuchs()) {
  return Array.isArray(f.comprado) && f.comprado.includes(LLAVE_NOMBRE);
}

// Devuelve { ok, saldo } igual que comprar().
export function comprarNombre() {
  const f = getFuchs();
  if (puedeCambiarNombre(f)) return { ok: true, saldo: saldo() };
  if (!gastar(PRECIO_NOMBRE)) return { ok: false, saldo: saldo() };
  setFuchs({ comprado: [...f.comprado, LLAVE_NOMBRE] });
  return { ok: true, saldo: saldo() };
}
// `gen` es el genero del sustantivo aleman, y no es decoracion: decide si la
// etiqueta dice "Dein Fuchs" o "Deine Katze". En una app para aprender aleman
// poner mal el posesivo es enseniar mal.
export const ANIMALES = [
  { id: 'zorro', de: 'Fuchs', gen: 'm', es: 'Zorro', en: 'Fox', precio: 0 },
  { id: 'gato', de: 'Katze', gen: 'f', es: 'Gato', en: 'Cat', precio: PRECIO_ANIMAL },
  { id: 'perro', de: 'Hund', gen: 'm', es: 'Perro', en: 'Dog', precio: PRECIO_ANIMAL },
  { id: 'conejo', de: 'Hase', gen: 'm', es: 'Conejo', en: 'Rabbit', precio: PRECIO_ANIMAL },
  { id: 'buho', de: 'Eule', gen: 'f', es: 'Búho', en: 'Owl', precio: PRECIO_ANIMAL },
  { id: 'rana', de: 'Frosch', gen: 'm', es: 'Rana', en: 'Frog', precio: PRECIO_ANIMAL },
  { id: 'pato', de: 'Ente', gen: 'f', es: 'Pato', en: 'Duck', precio: PRECIO_ANIMAL }
];

// ---- fondos: donde esta Felix ------------------------------------------
// No se le ponen encima, se pintan detras. Van en COMPLEMENTOS como una
// ranura mas para no tener que duplicar la tienda entera: comprar, equipar y
// avisar de lo nuevo ya funciona igual para todo lo que este aqui.
const FONDOS = [
  { id: 'nadaFondo', de: 'Nichts', ranura: 'fondo', es: 'Sin fondo', en: 'No background', precio: 0 },
  { id: 'wiese', de: 'Wiese', ranura: 'fondo', es: 'Pradera', en: 'Meadow', precio: 150 },
  { id: 'strand', de: 'Strand', ranura: 'fondo', es: 'Playa', en: 'Beach', precio: 200 },
  { id: 'wueste', de: 'Wüste', ranura: 'fondo', es: 'Desierto', en: 'Desert', precio: 300 },
  {
    id: 'eis',
    de: 'Eis und Schnee',
    ranura: 'fondo',
    es: 'Hielo y nieve',
    en: 'Ice and snow',
    precio: 350
  },
  // Aquí estaban 'schloss', 'cafe', 'wald', 'berge' y 'stadt'. Se retiraron.
  // Quien los tuviera puestos vuelve al fondo por defecto (ver getFuchs).
  { id: 'klasse', de: 'Klassenzimmer', ranura: 'fondo', es: 'Clase', en: 'Classroom', precio: 450 },
  { id: 'weltraum', de: 'Weltraum', ranura: 'fondo', es: 'Espacio', en: 'Outer space', precio: 550 }
];

COMPLEMENTOS.push(...FONDOS);

const DEFAULT = {
  nombre: 'Felix',
  especie: 'zorro',
  comprado: [], // ids de lo que ya has pagado
  color: 'naranja',
  cabeza: 'nada',
  ojos: 'nadaOjos',
  cuello: 'nadaCuello',
  ropa: 'nadaRopa',
  pies: 'nadaPies',
  objeto: 'nadaObjeto',
  particulas: 'p0',
  fondo: 'nadaFondo',
  visto: [] // ids ya vistos, para avisar solo de lo nuevo
};

export function getFuchs() {
  const f = { ...DEFAULT, ...storage.get(KEY, {}) };
  for (const campo of ['comprado', 'visto']) {
    if (!Array.isArray(f[campo])) f[campo] = [];
  }
  const objetosRetirados = ['paraguas', 'alas', 'pendientes', 'balon', 'mariquita', 'brujula', 'galleta', 'relojArena', 'varita', 'grua', 'pikachu', 'barco', 'zombie'];
  if (objetosRetirados.includes(f.objeto)) f.objeto = DEFAULT.objeto;
  f.comprado = Array.isArray(f.comprado) ? f.comprado.filter((id) => !objetosRetirados.includes(id)) : [];
  f.visto = Array.isArray(f.visto) ? f.visto.filter((id) => !objetosRetirados.includes(id)) : [];
  // Si una especie deja de estar disponible, recuperar el animal gratuito.
  if (!ANIMALES.some((a) => a.id === f.especie)) f.especie = DEFAULT.especie;
  const col = COLORES.find((c) => c.id === f.color);
  if (col?.req && !cumple(col.req)) {
    f.color = DEFAULT.color;
  }
  // Un fondo que ya no existe deja de pintarse pero la clase se sigue
  // poniendo, así que el zorro se quedaría sobre un hueco en blanco sin que
  // nada lo explique. Pasó al retirar el castillo y la cafetería. Se
  // comprueba aquí y no con una migración suelta para que valga también si
  // mañana se retira otro.
  if (!FONDOS.some((x) => x.id === f.fondo)) {
    f.fondo = DEFAULT.fondo;
  }
  // Un paisaje puede seguir guardado de una sesión antigua aunque ya no esté
  // desbloqueado. No debe teñir la portada si no se puede equipar: en ese caso
  // se recupera el cielo azul predeterminado ("Sin fondo").
  if (!tienes(f.fondo, f)) {
    f.fondo = DEFAULT.fondo;
  }
  return f;
}

export function setFuchs(patch) {
  const next = { ...getFuchs(), ...patch };
  storage.set(KEY, next);
  return next;
}

// "Dein Fuchs" estaba escrito a mano y se quedaba ahi aunque te compraras un
// gato: hay diez animales y en nueve la etiqueta mentia.
export function tuAnimal(f = getFuchs()) {
  const a = ANIMALES.find((x) => x.id === f.especie) || ANIMALES[0];
  return (a.gen === 'f' ? 'Deine ' : 'Dein ') + a.de;
}

export function colorDe(f = getFuchs()) {
  return COLORES.find((c) => c.id === f.color) || COLORES[0];
}

export const MAPA_COSAS = new Map([...COLORES, ...COMPLEMENTOS, ...ANIMALES].map((c) => [c.id, c]));
export function getCosa(id) {
  return MAPA_COSAS.get(id);
}

// Colores y complementos respetan sus compras y requisitos de progreso.
export function coloresDisponibles(f = getFuchs(), l = null) {
  const logr = l || logros();
  return COLORES.map((c) => ({ ...c, abierto: tienes(c.id, f, logr) }));
}

export function tienes(id, f = getFuchs(), l = null) {
  const cosa = getCosa(id);
  if (!cosa) return false;
  if (cosa.req) return cumple(cosa.req, l || logros());
  if ((cosa.precio ?? 0) <= 0) return true;
  return Array.isArray(f.comprado) && f.comprado.includes(id);
}

// Devuelve { ok, saldo } — ok en false si no llegabas.
export function comprar(id) {
  const f = getFuchs();
  const cosa = getCosa(id);
  if (!cosa) return { ok: false, saldo: saldo() };
  if (tienes(id, f)) return { ok: true, saldo: saldo() };
  if (cosa.req || !(cosa.precio > 0)) return { ok: false, saldo: saldo() };
  if (!gastar(cosa.precio)) return { ok: false, saldo: saldo() };
  setFuchs({ comprado: [...f.comprado, id] });
  return { ok: true, saldo: saldo() };
}

export function complementosDe(ranura, f = getFuchs(), l = null) {
  const logr = l || logros();
  return COMPLEMENTOS.filter((c) => c.ranura === ranura).map((c) => ({
    ...c,
    abierto: tienes(c.id, f, logr)
  }));
}

export function animalesDisponibles(f = getFuchs(), l = null) {
  const logr = l || logros();
  return ANIMALES.map((a) => ({ ...a, abierto: tienes(a.id, f, logr) }));
}

// Cuántas lecciones tienes dominadas del todo. Es la misma corona que sale en
// la lista de Grammatik. Ya no abre nada, pero se sigue enseñando como marca.
let cacheCoronas = null;
let cargaCoronas = null;
const oyentesCoronas = new Set();
export function limpiarCacheCoronas() {
  cacheCoronas = null;
  cargaCoronas = null;
}
export function coronas() {
  if (cacheCoronas !== null) return cacheCoronas;
  if (!cargaCoronas) {
    cargaCoronas = Promise.all([
      import('./kursbuch/index.js'),
      import('./lektionProgress.js')
    ]).then(([{ BAENDE }, { lektionProgress }]) => {
      let n = 0;
      for (const banda of BAENDE) {
        for (const leccion of banda.lektionen) {
          if (lektionProgress(leccion)?.grammatik >= 100) n += 1;
        }
      }
      cacheCoronas = n;
      oyentesCoronas.forEach((fn) => fn(n));
      return n;
    }).catch(() => {
      cargaCoronas = null;
      return 0;
    });
  }
  return 0;
}
export function onCoronasListo(fn) {
  oyentesCoronas.add(fn);
  if (cacheCoronas !== null) fn(cacheCoronas);
  return () => oyentesCoronas.delete(fn);
}

export function logros() {
  const st = getStreak();
  return {
    coronas: coronas(),
    nivel: getLevel().level,
    racha: bestStreak(),
    // el record de dias, no el actual: perder un trofeo de 100 dias por
    // saltarte uno seria una crueldad
    dias: Math.max(st.current || 0, st.longest || 0),
    monedas: saldo()
  };
}

export function cumple(req, l = logros()) {
  if (!req) return true;
  if (req.tipo === 'coronas') return l.coronas >= req.n;
  if (req.tipo === 'nivel') return l.nivel >= req.n;
  if (req.tipo === 'dias') return l.dias >= req.n;
  if (req.tipo === 'racha') return l.racha >= req.n;
  return false;
}

export function textoReq(req) {
  if (!req) return '';
  const n = req.n;
  if (req.tipo === 'coronas') return `${n} Kronen`;
  if (req.tipo === 'nivel') return `Level ${n}`;
  if (req.tipo === 'dias') return `${n} Tage in Folge`;
  return `${n} richtig in Folge`;
}

// Lo que acabas de poder permitirte y aún no has visto.
export function nuevosDesbloqueos() {
  const f = getFuchs();
  const s = saldo();
  return [...COMPLEMENTOS, ...COLORES].filter(
    (c) => c.precio > 0 && !f.comprado.includes(c.id) && s >= c.precio && !f.visto.includes(c.id)
  );
}

export function marcarVisto(ids) {
  const f = getFuchs();
  const visto = [...new Set([...f.visto, ...ids])];
  return setFuchs({ visto });
}

// Preguntas de andar por casa, en alemán A2. Van aquí y no las genera la IA
// para que el zorro salude al instante al abrir la app, sin esperas.
//
// La pregunta alemana no se toca; la glosa pasa por tc() al pintarla.
// Lo que dice Felix en la portada cuando NO se le puede contestar (la
// version sin IA). Preguntar sin que nadie recoja la respuesta queda raro:
// aqui cuenta una regla, una costumbre austriaca o simplemente te anima.
export const FRASES = [
  { de: 'Heute ist ein guter Tag zum Lernen.', es: 'Hoy es un buen día para estudiar.' },
  { de: 'Zehn Minuten am Tag sind besser als drei Stunden am Sonntag.', es: 'Diez minutos al día valen más que tres horas el domingo.' },
  { de: 'Auf Deutsch schreibt man alle Nomen groß: der Tisch, die Lampe, das Fenster.', es: 'En alemán todos los sustantivos van en mayúscula: der Tisch, die Lampe, das Fenster.' },
  { de: 'Das Verb steht im Hauptsatz immer an Position zwei.', es: 'En la frase principal el verbo va siempre en segunda posición.' },
  { de: 'Mit "weil" wandert das Verb ans Ende des Satzes.', es: 'Con "weil" el verbo se va al final de la frase.' },
  { de: 'Lerne jedes Nomen gleich mit seinem Artikel. Das spart später viel Ärger.', es: 'Aprende cada sustantivo con su artículo desde el principio. Te ahorra disgustos.' },
  { de: 'In Wien sagt man "Servus" und "Baba" statt "Hallo" und "Tschüss".', es: 'En Viena se dice "Servus" y "Baba" en vez de "Hallo" y "Tschüss".' },
  { de: '"Das Mädchen" ist das, obwohl es ein Mädchen ist. Alles mit -chen ist das.', es: '"Das Mädchen" es neutro aunque sea una chica: todo lo que acaba en -chen es das.' },
  { de: 'Im Perfekt brauchst du zwei Verben: haben oder sein, und das Partizip.', es: 'En el Perfekt necesitas dos verbos: haben o sein, y el participio.' },
  { de: 'Verben der Bewegung nehmen "sein": ich bin gegangen, ich bin gefahren.', es: 'Los verbos de movimiento llevan "sein": ich bin gegangen, ich bin gefahren.' },
  { de: 'Fehler sind kein Problem. Ohne Fehler lernt man gar nichts.', es: 'Los fallos no son un problema. Sin fallos no se aprende nada.' },
  { de: 'Nach "mit, nach, bei, seit, von, zu, aus" kommt immer der Dativ.', es: 'Después de "mit, nach, bei, seit, von, zu, aus" siempre va dativo.' },
  { de: 'Österreich hat neun Bundesländer. Wien ist das kleinste.', es: 'Austria tiene nueve estados federados. Viena es el más pequeño.' },
  { de: 'Trennbare Verben brechen auseinander: ich stehe um sieben auf.', es: 'Los verbos separables se parten: ich stehe um sieben auf.' },
  { de: 'Lies die Wörter laut. Was du hörst, behältst du besser.', es: 'Lee las palabras en voz alta. Lo que oyes se queda mejor.' },
  { de: 'Eine Serie auf Deutsch mit deutschen Untertiteln wirkt Wunder.', es: 'Una serie en alemán con subtítulos en alemán hace milagros.' },
  { de: '"Ich habe Hunger", nicht "ich bin hungrig". Hunger HAT man auf Deutsch.', es: '"Ich habe Hunger", no "ich bin hungrig". En alemán el hambre se TIENE.' },
  { de: 'Die Zahl 21 sagt man rückwärts: einundzwanzig, eins-und-zwanzig.', es: 'El 21 se dice al revés: einundzwanzig, uno-y-veinte.' },
  { de: 'Jeden Tag ein bisschen. Viele Tage in Folge sind mehr wert als ein langer Tag.', es: 'Un poco cada día. Muchos días seguidos valen más que un día largo.' },
  { de: 'Du machst das gut. Weiter so!', es: 'Lo estás haciendo bien. ¡Sigue así!' },
  // --- lo que le pasa a Felix, que no todo van a ser reglas ---
  { de: 'Heute war ich im Supermarkt. In Österreich heißt die Sahne "Obers".', es: 'Hoy he ido al súper. En Austria a la nata la llaman "Obers".' },
  { de: 'Gestern habe ich die U-Bahn verpasst. In Wien kommt die nächste aber schnell.', es: 'Ayer perdí el metro. Pero en Viena el siguiente llega enseguida.' },
  { de: 'Im Café habe ich "einen kleinen Braunen" bestellt. So heißt hier der Kaffee mit Milch.', es: 'En el café he pedido "einen kleinen Braunen". Así se llama aquí el café con leche.' },
  { de: 'Heute hat es geregnet und ich hatte keinen Schirm. Typisch.', es: 'Hoy ha llovido y no llevaba paraguas. Típico.' },
  { de: 'Am Wochenende war ich im Prater. Das Riesenrad ist über hundert Jahre alt.', es: 'El finde estuve en el Prater. La noria tiene más de cien años.' },
  { de: 'Ich habe "Tschüss" gesagt und alle haben mich angeschaut. Hier sagt man "Baba".', es: 'Dije "Tschüss" y todos me miraron. Aquí se dice "Baba".' },
  { de: 'Beim Bäcker habe ich ein Kipferl gekauft. In Deutschland heißt es Hörnchen.', es: 'En la panadería he comprado un Kipferl. En Alemania se llama Hörnchen.' },
  { de: 'Heute habe ich mit meiner Nachbarin gesprochen. Sie spricht sehr schnell!', es: 'Hoy he hablado con mi vecina. ¡Habla muy rápido!' },
  { de: 'Ich war im Kino. Der Film war auf Deutsch und ich habe fast alles verstanden.', es: 'He ido al cine. La película era en alemán y entendí casi todo.' },
  { de: 'Gestern habe ich "der Butter" gesagt. Es heißt "die Butter". Jetzt vergesse ich es nie mehr.', es: 'Ayer dije "der Butter". Se dice "die Butter". Ya no se me olvida.' },
  { de: 'Am Sonntag hatte alles zu. In Österreich schließen die Geschäfte am Sonntag.', es: 'El domingo estaba todo cerrado. En Austria las tiendas cierran los domingos.' },
  { de: 'Heute habe ich im Bus ein Gespräch verstanden. Kleiner Sieg!', es: 'Hoy he entendido una conversación en el autobús. ¡Pequeña victoria!' },
  { de: 'Ich habe einen Termin beim Arzt gemacht. Auf Deutsch, ganz allein!', es: 'He pedido cita en el médico. ¡En alemán y yo solo!' },
  { de: 'Mein Nachbar heißt Herr Gruber. Fast jeder zweite Österreicher heißt so.', es: 'Mi vecino se llama Herr Gruber. Aquí uno de cada dos se apellida así.' },
  { de: 'Heute habe ich im Supermarkt "Sackerl" gesagt statt "Tüte". Ich lerne!', es: 'Hoy he dicho "Sackerl" en vez de "Tüte" en el súper. ¡Voy aprendiendo!' },
  { de: 'Gestern habe ich eine Stunde auf den Bus gewartet. Er kam nie.', es: 'Ayer estuve una hora esperando el autobús. No vino nunca.' },
  { de: 'Ich habe endlich meine Post auf Deutsch verstanden. Es war eine Rechnung.', es: 'Por fin he entendido una carta en alemán. Era una factura.' },
  { de: 'Am Markt habe ich nach "einem Kilo" gefragt und zwei bekommen. Egal, war lecker.', es: 'En el mercado pedí "un kilo" y me dieron dos. Da igual, estaba bueno.' },
  { de: 'Meine Nachbarin hat mich zum Kaffee eingeladen. Zwei Stunden nur Deutsch!', es: 'Mi vecina me invitó a un café. ¡Dos horas hablando solo alemán!' },
  { de: 'Ich habe den Zug verpasst, weil ich "Gleis" mit "Gleich" verwechselt habe.', es: 'Perdí el tren por confundir "Gleis" con "Gleich".' },
  { de: 'Heute war ich schwimmen. Im Winter, draußen. Das machen hier alle.', es: 'Hoy he ido a nadar. En invierno y al aire libre. Aquí lo hace todo el mundo.' },
  { de: 'Der Kellner hat mich geduzt. Das heißt, ich klinge schon fast wie von hier.', es: 'El camarero me ha tuteado. Eso quiere decir que ya sueno casi de aquí.' },
  { de: 'Ich habe eine Serie ohne Untertitel geschaut. Zehn Minuten. Dann doch mit.', es: 'He visto una serie sin subtítulos. Diez minutos. Luego los he puesto.' },
  { de: 'Am Bahnhof hat mich jemand nach dem Weg gefragt. MICH!', es: 'En la estación alguien me ha preguntado por una dirección. ¡A mí!' },
  { de: 'Ich habe "Ich bin heiss" gesagt. Man sagt "Mir ist heiss". Peinlich.', es: 'Dije "Ich bin heiß". Se dice "Mir ist heiß". Qué vergüenza.' },
  { de: 'Beim Heurigen habe ich drei neue Wörter gelernt und zwei wieder vergessen.', es: 'En el Heuriger aprendí tres palabras nuevas y olvidé dos.' },
  { de: 'Bei "sein" und "haben" lernst du zuerst das Präteritum: war und hatte.', es: 'De "sein" y "haben" se aprende antes el Präteritum: war y hatte.' },
  { de: '"Wohin?" will den Akkusativ, "wo?" den Dativ. Das ist die ganze Regel.', es: '"Wohin?" pide acusativo, "wo?" pide dativo. Eso es toda la Wechselpräposition.' },
  { de: 'Die Vorsilbe be-, er-, ver-, ent- bleibt kleben. Kein "ge" im Partizip.', es: 'Los prefijos be-, er-, ver-, ent- no se sueltan. Y su participio no lleva "ge".' },
  { de: 'Nach "ohne, für, gegen, um, durch, bis" siempre Akkusativ.', es: 'Después de "ohne, für, gegen, um, durch, bis" siempre acusativo.' },
  { de: 'Verben auf -ieren haben kein "ge": telefoniert, reserviert, probiert.', es: 'Los verbos en -ieren no llevan "ge": telefoniert, reserviert, probiert.' },
  { de: 'Ein Wort, das du dreimal falsch sagst, schreib dir auf. Nur das hilft.', es: 'La palabra que falles tres veces, apúntala. Es lo único que sirve.' },
  { de: 'Sprich mit dir selbst auf Deutsch. Niemand hört zu und der Kopf übt.', es: 'Háblate a ti mismo en alemán. No te oye nadie y la cabeza practica.' },
  { de: 'Wenn du das Wort nicht weißt, erklär es mit anderen. Das ist auch Deutsch.', es: 'Si no sabes la palabra, explícala con otras. Eso también es hablar alemán.' },
  { de: '"Doch" widerspricht einem Nein: "Du kommst nicht?" – "Doch!"', es: '"Doch" contradice un no: "¿No vienes?" – "¡Sí que voy!"' },
  { de: 'Deutsche Zahlen im Kopf sind schwer. Das geht allen so, auch nach Jahren.', es: 'Los números alemanes de cabeza cuestan. Le pasa a todo el mundo, hasta después de años.' },
];

export const PREGUNTAS = [
  { de: 'Na, wie geht es dir heute?', es: '¿Qué tal estás hoy?' },
  { de: 'Was hast du gestern gemacht?', es: '¿Qué hiciste ayer?' },
  { de: 'Was isst du am liebsten zum Frühstück?', es: '¿Qué desayunas más a gusto?' },
  { de: 'Wie ist das Wetter heute bei dir?', es: '¿Qué tiempo hace hoy por ahí?' },
  { de: 'Hast du am Wochenende schon etwas vor?', es: '¿Ya tienes planes para el finde?' },
  { de: 'Welche Musik hörst du gern?', es: '¿Qué música te gusta escuchar?' },
  { de: 'Was gefällt dir an Wien am besten?', es: '¿Qué es lo que más te gusta de Viena?' },
  { de: 'Erzähl mir: was machst du beruflich?', es: 'Cuéntame: ¿a qué te dedicas?' },
  { de: 'Wohin möchtest du mal reisen?', es: '¿A dónde te gustaría viajar algún día?' },
  { de: 'Was ist heute dein Plan?', es: '¿Cuál es tu plan de hoy?' },
  { de: 'Welches deutsche Wort findest du komisch?', es: '¿Qué palabra alemana te hace gracia?' },
  { de: 'Kochst du gern? Was denn?', es: '¿Te gusta cocinar? ¿El qué?' },
  { de: 'Wie kommst du zur Arbeit: U-Bahn oder Rad?', es: '¿Cómo vas al trabajo: metro o bici?' },
  { de: 'Was war das Beste an deiner Woche?', es: '¿Qué ha sido lo mejor de tu semana?' },
  { de: 'Hast du Haustiere?', es: '¿Tienes mascotas?' },
  { de: 'Stehst du gern früh auf oder lieber spät?', es: '¿Te gusta madrugar o prefieres levantarte tarde?' },
  { de: 'Was machst du normalerweise nach der Arbeit?', es: '¿Qué sueles hacer después del trabajo?' },
  { de: 'Trinkst du lieber Kaffee oder Tee?', es: '¿Prefieres café o té?' },
  { de: 'Wie oft gehst du einkaufen?', es: '¿Cada cuánto vas a la compra?' },
  { de: 'Räumst du gern auf oder schiebst du es auf?', es: '¿Te gusta ordenar o lo vas dejando?' },
  { de: 'Wann hast du zuletzt richtig gut geschlafen?', es: '¿Cuándo has dormido bien de verdad por última vez?' },
  { de: 'In welchem Bezirk wohnst du in Wien?', es: '¿En qué distrito vives en Viena?' },
  { de: 'Was ist dein Lieblingsort in der Stadt?', es: '¿Cuál es tu sitio favorito de la ciudad?' },
  { de: 'Warst du schon mal auf einem Christkindlmarkt?', es: '¿Has estado alguna vez en un mercadillo de Navidad?' },
  { de: 'Magst du österreichisches Essen? Was denn?', es: '¿Te gusta la comida austriaca? ¿El qué?' },
  { de: 'Fährst du lieber mit der U-Bahn oder mit der Straßenbahn?', es: '¿Prefieres el metro o el tranvía?' },
  { de: 'Was vermisst du am meisten aus deiner Heimat?', es: '¿Qué es lo que más echas de menos de tu tierra?' },
  { de: 'Was fällt dir am Deutschen am schwersten?', es: '¿Qué es lo que más te cuesta del alemán?' },
  { de: 'Seit wann lernst du eigentlich Deutsch?', es: '¿Desde cuándo aprendes alemán?' },
  { de: 'Sprichst du im Alltag viel Deutsch?', es: '¿Hablas mucho alemán en el día a día?' },
  { de: 'Was möchtest du diese Woche lernen?', es: '¿Qué te gustaría aprender esta semana?' },
  { de: 'Schaust du Serien auf Deutsch?', es: '¿Ves series en alemán?' },
  { de: 'Welcher Fehler passiert dir immer wieder?', es: '¿Qué error se te repite siempre?' },
  { de: 'Was machst du gern am Sonntag?', es: '¿Qué te gusta hacer los domingos?' },
  { de: 'Treibst du Sport? Welchen?', es: '¿Haces deporte? ¿Cuál?' },
  { de: 'Liest du gerade ein Buch?', es: '¿Estás leyendo algún libro?' },
  { de: 'Warst du in letzter Zeit im Kino?', es: '¿Has ido al cine últimamente?' },
  { de: 'Hast du ein Hobby, das keiner kennt?', es: '¿Tienes alguna afición que no conozca nadie?' },
  { de: 'Gehst du lieber ins Café oder ins Restaurant?', es: '¿Prefieres ir a una cafetería o a un restaurante?' },
  { de: 'Mit wem hast du heute schon gesprochen?', es: '¿Con quién has hablado ya hoy?' },
  { de: 'Wann triffst du deine Freunde am liebsten?', es: '¿Cuándo te gusta más quedar con tus amigos?' },
  { de: 'Hast du diesen Monat etwas Schönes vor?', es: '¿Tienes algún plan bonito este mes?' },
  { de: 'Wo würdest du am liebsten wohnen?', es: '¿Dónde te gustaría vivir más que en ningún sitio?' },
  { de: 'Was würdest du machen, wenn du heute freihättest?', es: '¿Qué harías si hoy tuvieras el día libre?' },
  { de: 'Worauf freust du dich gerade am meisten?', es: '¿Qué es lo que más ilusión te hace ahora mismo?' }
];

// Una pregunta al azar, con la glosa ya en el idioma de la interfaz. La
// pregunta alemana no se toca: es justo lo que el alumno tiene que leer.
// De donde sale lo que dice Felix.
//
// Con IA, las dos listas juntas: pregunta unas veces y cuenta otras. A una
// frase tambien se le puede contestar, y asi hay 101 cosas distintas en vez
// de las 45 preguntas de siempre.
//
// Sin IA, solo las frases: alli no hay a quien contestar y una pregunta que
// se queda sin respuesta posible es peor que no preguntar.
function repertorio() {
  return SIN_IA ? FRASES : [...PREGUNTAS, ...FRASES];
}

export function preguntaFuchs() {
  const pool = repertorio();
  return pool[Math.floor(Math.random() * pool.length)];
}

// Otra distinta de la que hay puesta. Sin el filtro, una de cada ciento una
// veces sale la misma y parece que el clic no ha hecho nada.
export function otraFuchs(actual) {
  const pool = repertorio().filter((p) => p.de !== actual?.de);
  if (!pool.length) return actual;
  return pool[Math.floor(Math.random() * pool.length)];
}

// La glosa se traduce AL PINTAR, no al elegir la frase. Antes se traducia
// aqui, y como la frase se escoge una sola vez por carga, al cambiar de idioma
// la traduccion se quedaba con la de antes: aleman arriba e ingles debajo
// menos justo despues de cambiar, donde seguia el castellano.
export function glosaFuchs(p) {
  return p ? tc(p.es) : '';
}

// Todas, traducidas. La usan las herramientas para saber que falta.
export function preguntasFuchs() {
  return PREGUNTAS.map((p) => ({ ...p, es: tc(p.es) }));
}

// Como se llama el bicho que tiene puesto, para meterlo en el prompt del
// chat. Si te compras un gato, la IA no puede seguir diciendo que es un
// zorro. El prompt esta escrito en castellano, asi que va en castellano.
export function nombreEspecie(f = getFuchs()) {
  return (ANIMALES.find((a) => a.id === f.especie) || ANIMALES[0]).es.toLowerCase();
}
