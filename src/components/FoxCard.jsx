import React, { useState } from 'react';
import FoxFace from './FoxFace.jsx';
import FoxAjustes from './FoxAjustes.jsx';
import SaltosFelix, { useSaltos } from './SaltosFelix.jsx';
import { getFuchs, nuevosDesbloqueos, marcarVisto, preguntaFuchs, otraFuchs, glosaFuchs } from '../lib/fuchs.js';
import Escuchar from './Escuchar.jsx';
import { t } from '../lib/i18n.js';
import { SIN_IA } from '../lib/modo.js';

// Felix saluda con unos saltitos al abrir la app: solo la primera vez que
// sale la portada en cada apertura, no cada vez que se vuelve a ella.
let yaSaludo = false;


// onCambio avisa a la portada cuando cambias a Felix en la tienda: su brillo
// de abajo va con el color del fondo y se quedaba con el del fondo anterior.
export default function FoxCard({ onAbrir, onCambio }) {
  // En estado, no leído a pelo: al personalizarlo desde aquí, la tarjeta tiene
  // que repintarse con el zorro nuevo sin recargar la página.
  const [fuchs, setFuchsLocal] = useState(getFuchs);
  const [primeraVez] = useState(() => {
    if (yaSaludo) return false;
    yaSaludo = true;
    return true;
  });
  const saltos = useSaltos(primeraVez);
  // Una por carga -si cambiara a cada repintado, mareas- pero ahora se puede
  // pedir otra pulsando la burbuja.
  const [pregunta, setPregunta] = useState(() => preguntaFuchs());
  // Lo que YA te puedes permitir y aun no has visto. Depende del saldo, asi
  // que hay que recalcularlo cada vez que se toca la tienda: comprar algo
  // cambia el numero, y quedarse sin monedas lo deja en cero.
  const [nuevos, setNuevos] = useState(() => nuevosDesbloqueos());
  const [respuesta, setRespuesta] = useState('');
  const [ajustes, setAjustes] = useState(false);

  function abrir(conTexto) {
    if (nuevos.length) marcarVisto(nuevos.map((n) => n.id));
    onAbrir({ pregunta, respuesta: conTexto || '' });
  }

  return (
    <div className={'fox-card' + (SIN_IA ? ' fox-card-corta' : '')}>
      {/* El paisaje que le has comprado, detras de el y fundiendose hacia la
          derecha para que el bocadillo se siga leyendo. */}
      {fuchs.fondo && fuchs.fondo !== 'nadaFondo' && (
        <div className={'fox-card-paisaje fox-escena-' + fuchs.fondo} aria-hidden="true" />
      )}
      <button
        className={'fox-card-cara fox-aura-wrap fox-aura-' + (fuchs.fondo || 'nadaFondo')}
        // Tocarlo le hace saltar. La tienda se abre con "Personalizar a
        // Felix", justo al lado: si lo hicieran los dos, la tienda taparia
        // el salto.
        onClick={saltos.saltar}
        title={fuchs.nombre}
      >
        {/* En la portada, los dos ojos abiertos: el entornado ahi solo despistaba.
            Sin IA la tarjeta pierde la caja de contestar y el enlace del chat,
            asi que sobra sitio a lo alto: el zorro se hace mas grande y llena
            lo que si no queda en blanco. */}
        {/* Un pelin mas pequeno de lo que decia aqui: las chispas ensanchaban
            el viewBox y el zorro se dibujaba encogido para caber, asi que el
            160 de verdad se veia como 134. Al quitar ese margen aparecio a su
            tamano real y se comia la tarjeta. */}
        <SaltosFelix saltos={saltos} espacio={fuchs.fondo === 'weltraum'}>
          <FoxFace fuchs={fuchs} gesto={saltos.saltando ? 'feliz' : 'normal'} size={SIN_IA ? 138 : 136} conCuerpo className="flota" />
        </SaltosFelix>
      </button>

      <div className="fox-card-texto">
        {/* Pulsar la burbuja saca otra frase. El altavoz de dentro no la
            cambia: para eso corta la propagación en su propio onClick. */}
        {/* Un div con role="button" y no un <button>: dentro va el altavoz de
            Escuchar, que ES un botón, y un botón dentro de otro es HTML
            inválido. React avisaba por consola en cada pintado y el navegador
            resolvía el anidamiento como le parecía, así que el altavoz podía
            dejar de responder. El aspecto no cambia: .fox-burbuja-clic ya le
            quitaba al botón todo lo que parecía un botón. */}
        <div
          role="button"
          tabIndex={0}
          className="fox-burbuja fox-burbuja-clic"
          onClick={() => setPregunta((p) => otraFuchs(p))}
          onKeyDown={(e) => {
            if (e.key !== 'Enter' && e.key !== ' ') return;
            e.preventDefault();
            setPregunta((p) => otraFuchs(p));
          }}
          title={t('fox.otraFrase')}
        >
          <span className="fb-de">
            {pregunta.de}
            {/* Para oirlo: es alemán de verdad, y la voz del navegador lo lee
                aunque no haya IA por ningún lado. */}
            <Escuchar texto={pregunta.de} className="fb-say" frase rate={0.9} />
          </span>
          <span className="fb-es">{glosaFuchs(pregunta)}</span>
        </div>

        {/* Contestarle y charlar con el son IA. La pregunta de arriba no: es
            una de las que van escritas en fuchs.js, asi que Felix te sigue
            saludando en aleman aunque no haya con quien hablar. */}
        {!SIN_IA && (
          <form
            className="fox-card-form"
            onSubmit={(e) => {
              e.preventDefault();
              if (respuesta.trim()) abrir(respuesta.trim());
            }}
          >
            <input
              className="ask-input"
              value={respuesta}
              onChange={(e) => setRespuesta(e.target.value)}
              placeholder={t('fox.answerPh', { nombre: fuchs.nombre })}
            />
            <button className="btn-primary btn-sm" type="submit" disabled={!respuesta.trim()}>
              {t('fox.send')}
            </button>
          </form>
        )}

        <div className="fox-card-pie">
          {!SIN_IA && (
            <button className="link-btn" onClick={() => abrir('')}>
              {t('fox.chatWith', { nombre: fuchs.nombre })} <span className="fl-arr">▸</span>
            </button>
          )}
          {/* Antes solo se podía personalizar entrando en el chat, que no es
              donde uno lo busca. */}
          {/* El aviso va DENTRO de este boton, que es el que lleva a la
              tienda, y no suelto al lado: asi en el movil entra en la misma
              fila (los dos enlaces ya se comen 260 de los 313 px que hay) y
              ademas se puede pulsar. En pantalla estrecha se queda solo el
              numero; el texto entero sigue en el title. */}
          <button
            className="link-btn"
            onClick={() => setAjustes(true)}
            title={nuevos.length > 0 ? nuevos.length + ' ' + t(nuevos.length === 1 ? 'fox.compraUna' : 'fox.compras') : undefined}
          >
            {t('fox.customiseName', { nombre: fuchs.nombre })} <span className="fl-arr">▸</span>
            {nuevos.length > 0 && (
              <span className="fox-nuevo">
                🎁 {nuevos.length}
                <span className="fn-txt"> {t(nuevos.length === 1 ? 'fox.compraUna' : 'fox.compras')}</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {ajustes && (
        <FoxAjustes
          onClose={() => {
            setAjustes(false);
            setNuevos(nuevosDesbloqueos());
          }}
          onChange={(f) => {
            setFuchsLocal(f);
            onCambio?.(f);
            setNuevos(nuevosDesbloqueos());
          }}
        />
      )}
    </div>
  );
}
