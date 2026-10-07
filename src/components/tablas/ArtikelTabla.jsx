import React from 'react';

// La tabla de los articulos por caso y genero: determinado, indeterminado,
// negativo y posesivo, con las terminaciones resaltadas. Va aparte para
// usarla en el Kasus Trainer y en las tablas del Tagebuch.
export default function ArtikelTabla() {
  return (
    <>
      <table className="kt-table">
        <thead>
          <tr>
            <th className="kt-th-kasus">Kasus</th>
            <th className="kt-th-gen kt-mask">
              <span className="kt-gen-label">Maskulin</span>
              <span className="kt-marker kt-mark-m">-r, -n, -m</span>
            </th>
            <th className="kt-th-gen kt-neut">
              <span className="kt-gen-label">Neutral</span>
              <span className="kt-marker kt-mark-n">-s, wie Nom, -m</span>
            </th>
            <th className="kt-th-gen kt-fem">
              <span className="kt-gen-label">Feminin</span>
              <span className="kt-marker kt-mark-f">-e, wie Nom, -r</span>
            </th>
            <th className="kt-th-gen kt-pl">
              <span className="kt-gen-label">Plural</span>
              <span className="kt-marker kt-mark-p">-e, wie Nom, -n / -en</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {/* 1. NOMINATIV */}
          <tr className="kt-row-nom">
            <td className="kt-td-kasus">
              <div className="kt-kasus-name">Nominativ</div>
              <div className="kt-kasus-sub">Wer?</div>
            </td>
            <td className="kt-cell kt-mask">
              <div className="kt-item">
                <span className="kt-type">Bestimmt</span>
                <strong className="kt-art">de<span className="kt-hi">r</span></strong>
              </div>
              <div className="kt-item">
                <span className="kt-type">Unbest.</span>
                <span className="kt-art">ein</span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Negativ</span>
                <span className="kt-art">kein</span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Possessiv</span>
                <span className="kt-art">mein</span>
                <span className="kt-subposs">, dein, sein, ihr…</span>
              </div>
            </td>
            <td className="kt-cell kt-neut">
              <div className="kt-item">
                <span className="kt-type">Bestimmt</span>
                <strong className="kt-art">da<span className="kt-hi">s</span></strong>
              </div>
              <div className="kt-item">
                <span className="kt-type">Unbest.</span>
                <span className="kt-art">ein</span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Negativ</span>
                <span className="kt-art">kein</span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Possessiv</span>
                <span className="kt-art">mein</span>
                <span className="kt-subposs">, dein, sein, ihr…</span>
              </div>
            </td>
            <td className="kt-cell kt-fem">
              <div className="kt-item">
                <span className="kt-type">Bestimmt</span>
                <strong className="kt-art">di<span className="kt-hi">e</span></strong>
              </div>
              <div className="kt-item">
                <span className="kt-type">Unbest.</span>
                <span className="kt-art">ein<span className="kt-hi">e</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Negativ</span>
                <span className="kt-art">kein<span className="kt-hi">e</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Possessiv</span>
                <span className="kt-art">mein<span className="kt-hi">e</span></span>
                <span className="kt-subposs">, deine, seine…</span>
              </div>
            </td>
            <td className="kt-cell kt-pl">
              <div className="kt-item">
                <span className="kt-type">Bestimmt</span>
                <strong className="kt-art">di<span className="kt-hi">e</span></strong>
              </div>
              <div className="kt-item kt-none">
                <span className="kt-type">Unbest.</span>
                <em>(kein Plural!)</em>
              </div>
              <div className="kt-item">
                <span className="kt-type">Negativ</span>
                <span className="kt-art">kein<span className="kt-hi">e</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Possessiv</span>
                <span className="kt-art">mein<span className="kt-hi">e</span></span>
                <span className="kt-subposs">, deine, seine…</span>
              </div>
            </td>
          </tr>

          {/* 2. AKKUSATIV */}
          <tr className="kt-row-akk">
            <td className="kt-td-kasus">
              <div className="kt-kasus-name">Akkusativ</div>
              <div className="kt-kasus-sub">Wen? / Was?</div>
            </td>
            <td className="kt-cell kt-mask kt-changed">
              <div className="kt-pill-alert">Nur Maskulinum ändert sich!</div>
              <div className="kt-item">
                <span className="kt-type">Bestimmt</span>
                <strong className="kt-art">de<span className="kt-hi kt-hi-akk">n</span></strong>
              </div>
              <div className="kt-item">
                <span className="kt-type">Unbest.</span>
                <span className="kt-art">ein<span className="kt-hi kt-hi-akk">en</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Negativ</span>
                <span className="kt-art">kein<span className="kt-hi kt-hi-akk">en</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Possessiv</span>
                <span className="kt-art">mein<span className="kt-hi kt-hi-akk">en</span></span>
                <span className="kt-subposs">, deinen, seinen…</span>
              </div>
            </td>
            <td className="kt-cell kt-neut kt-same">
              <div className="kt-same-badge">= wie Nominativ</div>
              <div className="kt-item">
                <span className="kt-type">Bestimmt</span>
                <strong className="kt-art">das</strong>
              </div>
              <div className="kt-item">
                <span className="kt-type">Unbest.</span>
                <span className="kt-art">ein</span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Negativ</span>
                <span className="kt-art">kein</span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Possessiv</span>
                <span className="kt-art">mein</span>
                <span className="kt-subposs">, dein, sein, ihr…</span>
              </div>
            </td>
            <td className="kt-cell kt-fem kt-same">
              <div className="kt-same-badge">= wie Nominativ</div>
              <div className="kt-item">
                <span className="kt-type">Bestimmt</span>
                <strong className="kt-art">die</strong>
              </div>
              <div className="kt-item">
                <span className="kt-type">Unbest.</span>
                <span className="kt-art">ein<span className="kt-hi">e</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Negativ</span>
                <span className="kt-art">kein<span className="kt-hi">e</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Possessiv</span>
                <span className="kt-art">mein<span className="kt-hi">e</span></span>
                <span className="kt-subposs">, deine, seine…</span>
              </div>
            </td>
            <td className="kt-cell kt-pl kt-same">
              <div className="kt-same-badge">= wie Nominativ</div>
              <div className="kt-item">
                <span className="kt-type">Bestimmt</span>
                <strong className="kt-art">di<span className="kt-hi">e</span></strong>
              </div>
              <div className="kt-item kt-none">
                <span className="kt-type">Unbest.</span>
                <em>(kein Plural)</em>
              </div>
              <div className="kt-item">
                <span className="kt-type">Negativ</span>
                <span className="kt-art">kein<span className="kt-hi">e</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Possessiv</span>
                <span className="kt-art">mein<span className="kt-hi">e</span></span>
                <span className="kt-subposs">, deine, seine…</span>
              </div>
            </td>
          </tr>

          {/* 3. DATIV */}
          <tr className="kt-row-dat">
            <td className="kt-td-kasus">
              <div className="kt-kasus-name">Dativ</div>
              <div className="kt-kasus-sub">Wem? / Wo?</div>
            </td>
            <td className="kt-cell kt-mask">
              <div className="kt-item">
                <span className="kt-type">Bestimmt</span>
                <strong className="kt-art">de<span className="kt-hi kt-hi-dat">m</span></strong>
              </div>
              <div className="kt-item">
                <span className="kt-type">Unbest.</span>
                <span className="kt-art">ein<span className="kt-hi kt-hi-dat">em</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Negativ</span>
                <span className="kt-art">kein<span className="kt-hi kt-hi-dat">em</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Possessiv</span>
                <span className="kt-art">mein<span className="kt-hi kt-hi-dat">em</span></span>
                <span className="kt-subposs">, deinem, seinem…</span>
              </div>
            </td>
            <td className="kt-cell kt-neut">
              <div className="kt-item">
                <span className="kt-type">Bestimmt</span>
                <strong className="kt-art">de<span className="kt-hi kt-hi-dat">m</span></strong>
              </div>
              <div className="kt-item">
                <span className="kt-type">Unbest.</span>
                <span className="kt-art">ein<span className="kt-hi kt-hi-dat">em</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Negativ</span>
                <span className="kt-art">kein<span className="kt-hi kt-hi-dat">em</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Possessiv</span>
                <span className="kt-art">mein<span className="kt-hi kt-hi-dat">em</span></span>
                <span className="kt-subposs">, deinem, seinem…</span>
              </div>
            </td>
            <td className="kt-cell kt-fem">
              <div className="kt-item">
                <span className="kt-type">Bestimmt</span>
                <strong className="kt-art">de<span className="kt-hi kt-hi-dat">r</span></strong>
              </div>
              <div className="kt-item">
                <span className="kt-type">Unbest.</span>
                <span className="kt-art">ein<span className="kt-hi kt-hi-dat">er</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Negativ</span>
                <span className="kt-art">kein<span className="kt-hi kt-hi-dat">er</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Possessiv</span>
                <span className="kt-art">mein<span className="kt-hi kt-hi-dat">er</span></span>
                <span className="kt-subposs">, deiner, seiner…</span>
              </div>
            </td>
            <td className="kt-cell kt-pl">
              <div className="kt-item">
                <span className="kt-type">Bestimmt</span>
                <strong className="kt-art">de<span className="kt-hi kt-hi-dat">n</span></strong>
              </div>
              <div className="kt-item kt-none">
                <span className="kt-type">Unbest.</span>
                <em>(kein Plural)</em>
              </div>
              <div className="kt-item">
                <span className="kt-type">Negativ</span>
                <span className="kt-art">kein<span className="kt-hi kt-hi-dat">en</span></span>
              </div>
              <div className="kt-item">
                <span className="kt-type">Possessiv</span>
                <span className="kt-art">mein<span className="kt-hi kt-hi-dat">en</span></span>
                <span className="kt-subposs">, deinen…</span>
              </div>
          <div className="kt-nomen-note">
            <strong>den</strong>: -n · <strong>kein-/mein-</strong>: -en · Nomen: + -n
          </div>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="kt-footer-notes">
        <div className="kt-note-card">
          <span className="kt-note-icon">💡</span>
          <div>
            <strong>Dativ Plural:</strong> Der bestimmte Artikel lautet <em>den</em> (-n); bei <em>kein</em> und Possessivartikeln kommt <code>-en</code> dazu: <em>keinen, meinen</em>. Das Nomen bekommt zusätzlich ein <code>-n</code> (z.B. <em>mit meinen Kinder<strong>n</strong></em>, <em>den Gäste<strong>n</strong></em>), außer wenn der Plural schon auf <code>-n</code> oder <code>-s</code> endet (<em>den Autos</em>).
          </div>
        </div>
        <div className="kt-rule-summary">
          <span className="kt-ley"><b className="kt-ley-am">-r</b>terminación del caso</span>
          <span className="kt-ley"><b className="kt-ley-az">-en</b>cambia en Akkusativ</span>
          <span className="kt-rule-pill">m: -r / -n / -m</span>
          <span className="kt-rule-pill">n: -s / -s / -m</span>
          <span className="kt-rule-pill">f: -e / -e / -r</span>
          <span className="kt-rule-pill">pl: -e / -e / -n (+n)</span>
        </div>
      </div>
    </>
  );
}
