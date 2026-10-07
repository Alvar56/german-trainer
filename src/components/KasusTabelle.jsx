import React from 'react';
import TablaVentana from './tablas/TablaVentana.jsx';
import { TABLA_ARTIKEL } from './tablas/index.js';

// La tabla del Kasus Trainer: los articulos por caso y genero.
export default function KasusTabelle({ onClose, cerrando = false }) {
  return <TablaVentana tablas={[TABLA_ARTIKEL]} onClose={onClose} cerrando={cerrando} />;
}
