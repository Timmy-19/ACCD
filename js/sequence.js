/* Sequence viewer: renders the AcdS sequence with annotated features.
   Reference: P. putida UW4, UniProt Q5PWZ8, 338 aa */

const SEQUENCE = (
  "MNLNRFERYPLTFGPSPITPLKRLSEHLGGKVELYAKREDCNSGLAFGGN" +  // 1-50
  "KTRKLEYLIPEAIEQGCDTLVSIGGIQSNQTRQVAAVAAHLGMKCVLVQE" +  // 51-100
  "NWVNYSDAVYDRVGNIEMSRIMGADVRLDAAGFDIGIRPSWEKAMSDVVE" +  // 101-150
  "RGGKPFPIPAGCSEHPYGGLGFVGFAEEVRQQEKELGFKFDYIVVCSVTG" +  // 151-200
  "STQAGMVVGFAADGRSKNVIGVDASAKPEQTKAQILRIARHTAELVELGR" +  // 201-250
  "EITEEDVVLDTRFAYPEYGLPNEGTLEAIRLCGSLEGVLTDPVYEGKSMH" +  // 251-300
  "GMIEMVRRGEFPDGSKVLYAHLGGAPALNAYSFLFRNG"                // 301-338
);

/* Feature annotations (UW4 numbering).
   Categories: modres (PLP attachment), active, binding, mutagen, motif. */
const FEATURES = [
  // PLP attachment
  { pos: 51,  type: 'modres',  label: 'Lys51 — PLP Schiff base (N6-pyridoxal-phosphate)',
    desc: 'Internal aldimine to C4′ of PLP cofactor; β-proton abstraction base.' },
  // Active site catalytic
  { pos: 294, type: 'active',  label: 'Tyr294 — catalytic nucleophile',
    desc: '3.0 Å from pro-S β-methylene of ACC; nucleophile/general acid. Y294F is inactive.' },
  { pos: 268, type: 'active',  label: 'Tyr268 — charge-relay partner',
    desc: 'H-bonds Tyr294 (2.5 Å) to lower its pKa. Y268F drops kcat ~50-fold.' },
  { pos: 78,  type: 'active',  label: 'Ser78 — proton transfer / carboxylate H-bond',
    desc: 'H-bonds ACC carboxylate (2.8 Å); candidate β-H base. S78A is inactive.' },
  { pos: 295, type: 'active',  label: 'Glu295 — PLP pyridinium N partner',
    desc: 'Ion-pair with PLP N1 (2.6 Å); maintains electron-sink. E295D ↓10×, E295S/L322T → d-CDes.' },
  // Substrate / cofactor binding
  { pos: 44,  type: 'binding', label: 'Gly44 — substrate gate',
    desc: 'Gating residue on D39–N50 loop. G44D abolishes activity (Hontzeas 2004).' },
  { pos: 54,  type: 'binding', label: 'Lys54 — PLP phosphate contact',
    desc: 'Side chain contacts PLP phosphate group.' },
  { pos: 79,  type: 'binding', label: 'Asn79 — PLP O3′ H-bond',
    desc: 'H-bonds PLP O3′ (3.0 Å); main-chain amide contacts ACC carboxylate.' },
  { pos: 80,  type: 'binding', label: 'Gln80 — D-selectivity',
    desc: 'Main-chain amide H-bonds D-vinylglycine; gatekeeper for D-amino-acid specificity.' },
  { pos: 162, type: 'binding', label: 'Cys162 — iodoacetamide-sensitive',
    desc: 'Modification by 1,5-I-AEDANS disrupts the Lys51-PLP aldimine.' },
  { pos: 198, type: 'binding', label: 'Val198 — PLP phosphate',
    desc: 'Main-chain amide H-bond to PLP phosphate.' },
  { pos: 199, type: 'binding', label: 'Thr199 — PLP phosphate',
    desc: 'Main-chain amide + side chain contact PLP phosphate.' },
  { pos: 200, type: 'binding', label: 'Gly200 — PLP phosphate',
    desc: 'Main-chain amide H-bond to PLP phosphate.' },
  { pos: 202, type: 'binding', label: 'Thr202 — PLP phosphate',
    desc: 'Main-chain amide + side chain contact PLP phosphate.' },
  { pos: 322, type: 'binding', label: 'Leu322 — PLP packing / specificity',
    desc: 'van der Waals packing with PLP. L322T (with E295S) converts AcdS to D-cysteine desulfhydrase.' },
  // Mutagenesis sites (overlay style — outlined)
  { pos: 51,  type: 'mutagen', label: 'K51T (yeast homolog) / K51A',
    desc: 'Crystallized external-aldimine in K51T (PDB 1J0D); K51A loses activity.' },
  { pos: 44,  type: 'mutagen', label: 'G44D',
    desc: 'Substrate-gate mutant. Inactive up to 40 mM ACC; back-mutant D44G restores full activity.' },
  { pos: 78,  type: 'mutagen', label: 'S78A',
    desc: 'Inactive — confirms catalytic role.' },
  { pos: 268, type: 'mutagen', label: 'Y268F',
    desc: 'kcat = 1.2 min⁻¹ (<2% of WT 70 min⁻¹).' },
  { pos: 294, type: 'mutagen', label: 'Y294F',
    desc: 'Completely inactive — confirms nucleophile role.' },
  { pos: 295, type: 'mutagen', label: 'E295D / E295S / E295S+L322T',
    desc: 'E295D: ~10× ↓ kcat. E295S+L322T (UW4): gain of D-cysteine desulfhydrase, loss of ACCD.' },
  { pos: 322, type: 'mutagen', label: 'L322T (with E295S)',
    desc: 'Double mutant E295S/L322T converts ACCD → D-cysteine desulfhydrase.' },
];

/* Conserved PLP-dependent enzyme regions (fold-type II) */
const MOTIFS = [
  { start: 195, end: 213, label: 'PLP phosphate-binding loop (helix N-cap)' },
  { start: 44,  end: 50,  label: 'Substrate-gate loop (D39–N50)' },
];

function classify(pos) {
  const cls = new Set();
  let tipParts = [`<strong>${SEQUENCE[pos-1]}${pos}</strong>`];
  for (const f of FEATURES) {
    if (f.pos === pos) {
      cls.add('feat-' + f.type);
      tipParts.push(`${f.type.toUpperCase()}: ${f.label}`);
    }
  }
  for (const m of MOTIFS) {
    if (pos >= m.start && pos <= m.end) cls.add('feat-motif');
  }
  return { classes: [...cls], tip: tipParts.join(' • ') };
}

function renderSequence() {
  const el = document.getElementById('sequence-display');
  if (!el) return;
  const rowLen = 60, chunk = 10;
  let html = '';
  for (let r = 0; r < SEQUENCE.length; r += rowLen) {
    const start = r + 1;
    let row = '';
    for (let c = 0; c < rowLen && r + c < SEQUENCE.length; c += chunk) {
      let chunkHtml = '';
      for (let i = 0; i < chunk && r + c + i < SEQUENCE.length; i++) {
        const pos = r + c + i + 1;
        const aa = SEQUENCE[pos - 1];
        const info = classify(pos);
        const cls = ['aa', ...info.classes].join(' ');
        chunkHtml += `<span class="${cls}" data-pos="${pos}" data-tip="${info.tip.replace(/"/g, '&quot;')}">${aa}</span>`;
      }
      row += `<span class="seq-chunk">${chunkHtml}</span>`;
    }
    html += `<div class="seq-row"><span class="seq-num">${start}</span>${row}</div>`;
  }
  el.innerHTML = html;
}

function renderFeatureTable() {
  const el = document.getElementById('feature-table-body');
  if (!el) return;
  // Group by position, merge duplicates
  const sorted = [...FEATURES].sort((a, b) => a.pos - b.pos || a.type.localeCompare(b.type));
  el.innerHTML = sorted.map(f => `
    <tr>
      <td><span class="feat ${f.type}">${f.type}</span></td>
      <td class="mono"><span class="pos">${SEQUENCE[f.pos-1]}${f.pos}</span></td>
      <td><strong>${f.label}</strong></td>
      <td>${f.desc}</td>
    </tr>`).join('');
}

function copyFasta() {
  const fasta = `>sp|Q5PWZ8|1A1D_PSEPU 1-aminocyclopropane-1-carboxylate deaminase OS=Pseudomonas sp. UW4 GN=acdS\n${
    SEQUENCE.match(/.{1,60}/g).join('\n')}`;
  navigator.clipboard.writeText(fasta).then(() => {
    const btn = document.getElementById('copy-fasta');
    if (btn) { const t = btn.textContent; btn.textContent = '✓ Copied'; setTimeout(() => btn.textContent = t, 1400); }
  });
}

document.addEventListener('DOMContentLoaded', () => {
  renderSequence();
  renderFeatureTable();
  const btn = document.getElementById('copy-fasta');
  if (btn) btn.addEventListener('click', copyFasta);
});
