import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { aplicarTema, escucharSistema } from './lib/tema.js';
import './iconos-emoji.css';
import './index.css';

// El tema, antes de montar nada. El script de index.html ya lo ha puesto para
// que no parpadee; esto lo confirma y se queda escuchando al sistema por si
// estas en "auto" y lo cambias con la app abierta.
aplicarTema();
escucharSistema();

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
