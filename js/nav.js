/* Shared header injection + active-link highlight */
(function() {
  const path = location.pathname.split('/').pop() || 'index.html';
  const pages = [
    { href: 'index.html',       label: 'Overview' },
    { href: 'sequence.html',    label: 'Sequence' },
    { href: 'structure.html',   label: 'Structure' },
    { href: 'mechanism.html',   label: 'Mechanism' },
    { href: 'mutants.html',     label: 'Mutants' },
    { href: 'agriculture.html', label: 'Agriculture' },
    { href: 'references.html',  label: 'References' },
  ];
  const nav = pages.map(p =>
    `<a href="${p.href}"${p.href === path ? ' class="active"' : ''}>${p.label}</a>`
  ).join('');
  const html = `
    <div class="header-row">
      <a class="brand" href="index.html">
        <span class="logo">AcdS</span>
        <span>ACC Deaminase <small>Knowledgebase · GEMS Taiwan 2026</small></span>
      </a>
      <nav class="primary">${nav}</nav>
    </div>`;
  const hdr = document.querySelector('header.site-header');
  if (hdr) hdr.innerHTML = html;
})();
