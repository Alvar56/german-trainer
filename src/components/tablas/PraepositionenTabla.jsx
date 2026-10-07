import React from 'react';

// Las preposiciones por el caso que piden, en el estilo de la tabla de
// articulos. Ejemplos propios: el libro que esta (Wo?) o que pones (Wohin?)
// sobre la mesa, la comoda, el sofa y las sillas.
const DATIV = ['aus', 'bei', 'mit', 'nach', 'seit', 'von', 'zu', 'ab', 'außer', 'gegenüber'];
const WECHSEL = ['an', 'auf', 'hinter', 'in', 'neben', 'über', 'unter', 'vor', 'zwischen'];
const AKKUSATIV = ['bis', 'durch', 'für', 'gegen', 'ohne', 'um'];

// [articulo del caso, nombre] para Wo? (Dativ) y Wohin? (Akkusativ).
const EJEMPLOS = [
  { genero: 'm', nombre: 'der Tisch', wo: ['dem', 'Tisch'], wohin: ['den', 'Tisch'] },
  { genero: 'f', nombre: 'die Kommode', wo: ['der', 'Kommode'], wohin: ['die', 'Kommode'] },
  { genero: 'n', nombre: 'das Sofa', wo: ['dem', 'Sofa'], wohin: ['das', 'Sofa'] },
  { genero: 'pl', nombre: 'die Stühle', wo: ['den', 'Stühlen'], wohin: ['die', 'Stühle'] }
];

const KURZ_DATIV = [['in dem', 'im'], ['an dem', 'am'], ['bei dem', 'beim'], ['von dem', 'vom'], ['zu dem', 'zum'], ['zu der', 'zur']];
const KURZ_AKK = [['in das', 'ins'], ['an das', 'ans'], ['auf das', 'aufs']];

function Grupo({ clase, titulo, sub, palabras }) {
  return (
    <div className={'pp-grupo ' + clase}>
      <div className="pp-grupo-titulo">{titulo}</div>
      <div className="pp-grupo-sub">{sub}</div>
      <div className="pp-palabras">
        {palabras.map((p) => <span key={p} className="pp-palabra">{p}</span>)}
      </div>
    </div>
  );
}

export default function PraepositionenTabla() {
  return (
    <>
      <div className="pp-grupos">
        <Grupo clase="pp-dat" titulo="Immer Dativ" sub="Wem?" palabras={DATIV} />
        <Grupo clase="pp-wechsel" titulo="Dativ oder Akkusativ" sub="Wo? → Dativ · Wohin? → Akkusativ" palabras={WECHSEL} />
        <Grupo clase="pp-akk" titulo="Immer Akkusativ" sub="Wen? / Was?" palabras={AKKUSATIV} />
      </div>

      <div className="pp-wowohin">
        <div className="pp-lado pp-dat">
          <div className="pp-lado-titulo">Wo? <span>→ Dativ</span></div>
          <div className="pp-lado-sub">Das Buch liegt …</div>
          {EJEMPLOS.map((e) => (
            <div key={e.genero} className="pp-fila">
              <span className="pp-base">{e.nombre}</span>
              <span>auf <strong className="pp-art">{e.wo[0]}</strong> {e.wo[1]}</span>
            </div>
          ))}
        </div>
        <div className="pp-lado pp-akk">
          <div className="pp-lado-titulo">Wohin? <span>→ Akkusativ</span></div>
          <div className="pp-lado-sub">Ich lege das Buch …</div>
          {EJEMPLOS.map((e) => (
            <div key={e.genero} className="pp-fila">
              <span className="pp-base">{e.nombre}</span>
              <span>auf <strong className="pp-art">{e.wohin[0]}</strong> {e.wohin[1]}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="kt-footer-notes">
        <div className="kt-note-card">
          <span className="kt-note-icon">💡</span>
          <div>
            <strong>Bewegung oder Ort?</strong> Mit den Wechselpräpositionen fragt man: Bleibt etwas an einem Ort
            (<em>Wo?</em>), dann Dativ: <em>Die Katze schläft unter <strong>dem</strong> Bett.</em> Geht etwas an einen
            neuen Ort (<em>Wohin?</em>), dann Akkusativ: <em>Die Katze läuft unter <strong>das</strong> Bett.</em>
          </div>
        </div>
        <div className="kt-rule-summary">
          <span className="kt-ley">Kurzformen:</span>
          {KURZ_DATIV.map(([largo, corto]) => (
            <span key={corto} className="kt-rule-pill">{largo} → <strong>{corto}</strong></span>
          ))}
          {KURZ_AKK.map(([largo, corto]) => (
            <span key={corto} className="kt-rule-pill pp-pill-akk">{largo} → <strong>{corto}</strong></span>
          ))}
        </div>
      </div>
    </>
  );
}
