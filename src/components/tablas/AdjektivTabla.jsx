import React from 'react';

// La declinacion del adjetivo, en el estilo de la tabla de articulos. Los
// ejemplos son propios: der neue Tisch, das kleine Bett, die alte Lampe,
// die bequemen Stühle.
//
// Cada forma se escribe como 'art|adj|nombre' y las terminaciones van entre
// corchetes: [r] es la marca del caso (amarillo) y {en} la terminacion debil
// -e/-en (azul). Asi la tabla se lee de un vistazo: alguien tiene que llevar
// la marca del caso, el articulo o, si no puede, el adjetivo.
const COLUMNAS = [
  { clase: 'kt-mask', genero: 'Maskulin', ejemplo: 'der Tisch' },
  { clase: 'kt-neut', genero: 'Neutral', ejemplo: 'das Bett' },
  { clase: 'kt-fem', genero: 'Feminin', ejemplo: 'die Lampe' },
  { clase: 'kt-pl', genero: 'Plural', ejemplo: 'die Stühle' }
];

// [bestimmt, unbestimmt] por columna. En plural no hay "ein": va sin articulo.
const FILAS = [
  {
    kasus: 'Nominativ', pregunta: 'Wer? / Was?',
    formas: [
      ['de[r]|neu{e}|Tisch', 'ein|neu[er]|Tisch'],
      ['da[s]|klein{e}|Bett', 'ein|klein[es]|Bett'],
      ['di[e]|alt{e}|Lampe', 'ein[e]|alt{e}|Lampe'],
      ['di[e]|bequem{en}|Stühle', '—|bequem[e]|Stühle']
    ]
  },
  {
    kasus: 'Akkusativ', pregunta: 'Wen? / Was?',
    formas: [
      ['de[n]|neu{en}|Tisch', 'ein[en]|neu{en}|Tisch'],
      ['da[s]|klein{e}|Bett', 'ein|klein[es]|Bett'],
      ['di[e]|alt{e}|Lampe', 'ein[e]|alt{e}|Lampe'],
      ['di[e]|bequem{en}|Stühle', '—|bequem[e]|Stühle']
    ],
    aviso: 'Nur Maskulinum ändert sich!',
    // Neutral, feminin y plural se quedan como en el Nominativ, igual que
    // en la tabla de articulos.
    igualNom: true
  },
  {
    kasus: 'Dativ', pregunta: 'Wem? / Wo?',
    formas: [
      ['de[m]|neu{en}|Tisch', 'ein[em]|neu{en}|Tisch'],
      ['de[m]|klein{en}|Bett', 'ein[em]|klein{en}|Bett'],
      ['de[r]|alt{en}|Lampe', 'ein[er]|alt{en}|Lampe'],
      ['de[n]|bequem{en}|Stühle[n]', '—|bequem[en]|Stühle[n]']
    ]
  },
  {
    kasus: 'Genitiv', pregunta: 'Wessen?',
    formas: [
      ['de[s]|neu{en}|Tisch[es]', 'ein[es]|neu{en}|Tisch[es]'],
      ['de[s]|klein{en}|Bett[es]', 'ein[es]|klein{en}|Bett[es]'],
      ['de[r]|alt{en}|Lampe', 'ein[er]|alt{en}|Lampe'],
      ['de[r]|bequem{en}|Stühle', '—|bequem[er]|Stühle']
    ]
  }
];

// 'de[r]' → de + r resaltada; '{en}' → en azul.
function Trozo({ texto }) {
  const partes = texto.split(/(\[[^\]]+\]|\{[^}]+\})/).filter(Boolean);
  return partes.map((p, i) => {
    if (p.startsWith('[')) return <span key={i} className="kt-hi">{p.slice(1, -1)}</span>;
    if (p.startsWith('{')) return <span key={i} className="kt-hi kt-hi-akk">{p.slice(1, -1)}</span>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

function Forma({ tipo, forma }) {
  const [art, adj, nombre] = forma.split('|');
  return (
    <div className="kt-item">
      <span className="kt-type">{tipo}</span>
      <span className="adj-frase">
        {art === '—' ? <span className="adj-sin">—</span> : <strong className="kt-art"><Trozo texto={art} /></strong>}{' '}
        <span className="kt-art"><Trozo texto={adj} /></span>{' '}
        <span className="adj-nombre"><Trozo texto={nombre} /></span>
      </span>
    </div>
  );
}

export default function AdjektivTabla() {
  return (
    <>
      <table className="kt-table adj-tabla">
        <thead>
          <tr>
            <th className="kt-th-kasus">Kasus</th>
            {COLUMNAS.map((c) => (
              <th key={c.genero} className={'kt-th-gen ' + c.clase}>
                <span className="kt-gen-label">{c.genero}</span>
                <span className="kt-marker">{c.ejemplo}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {FILAS.map((f) => (
            <tr key={f.kasus}>
              <td className="kt-td-kasus">
                <div className="kt-kasus-name">{f.kasus}</div>
                <div className="kt-kasus-sub">{f.pregunta}</div>
              </td>
              {f.formas.map(([bestimmt, unbestimmt], i) => (
                <td key={i} className={'kt-cell ' + COLUMNAS[i].clase + (f.igualNom && i > 0 ? ' kt-same' : '')}>
                  {f.aviso && i === 0 && <div className="kt-pill-alert">{f.aviso}</div>}
                  {f.igualNom && i > 0 && <div className="kt-same-badge">= wie Nominativ</div>}
                  <Forma tipo="Bestimmt" forma={bestimmt} />
                  <Forma tipo={i === 3 ? 'Ohne Art.' : 'Unbest.'} forma={unbestimmt} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <div className="kt-footer-notes">
        <div className="kt-note-card">
          <span className="kt-note-icon">💡</span>
          <div>
            <strong>Die Faustregel:</strong> Einer muss den Fall zeigen. Zeigt ihn schon der Artikel (<em>der, dem, des…</em>),
            endet das Adjektiv nur auf <code>-e</code> oder <code>-en</code>. Kann der Artikel es nicht
            (<em>ein</em> ohne Endung, oder gar kein Artikel), übernimmt das Adjektiv die Endung:
            <em> ein neu<strong>er</strong> Tisch, ein klein<strong>es</strong> Bett, bequem<strong>e</strong> Stühle</em>.
          </div>
        </div>
        <div className="kt-rule-summary">
          <span className="kt-ley"><b className="kt-ley-am">-er</b>marca del caso</span>
          <span className="kt-ley"><b className="kt-ley-az">-en</b>terminación débil (-e / -en)</span>
          <span className="kt-rule-pill">-e: Nom. Singular, Akk. f / n</span>
          <span className="kt-rule-pill">-en: todo lo demás</span>
          <span className="kt-rule-pill">Dativ Plural: Nomen + -n</span>
        </div>
      </div>
    </>
  );
}
