// Navigation bar component — Tropical Modernism design
// Injects fonts + creates consistent nav on all pages

(function() {
  // ── Font injection ──
  // Ensures Instrument Serif + DM Sans load on every page,
  // even pages that haven't updated their <head> yet
  if (!document.querySelector('link[href*="Instrument+Serif"]')) {
    var pc1 = document.createElement('link');
    pc1.rel = 'preconnect';
    pc1.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pc1);

    var pc2 = document.createElement('link');
    pc2.rel = 'preconnect';
    pc2.href = 'https://fonts.gstatic.com';
    pc2.crossOrigin = 'anonymous';
    document.head.appendChild(pc2);

    var fl = document.createElement('link');
    fl.rel = 'stylesheet';
    fl.href = 'https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400;1,9..40,500&family=Instrument+Serif:ital@0;1&display=swap';
    document.head.appendChild(fl);
  }

  // ── Nav data ──
  var currentPath = window.location.pathname;

  var navItems = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/diagnostic-test.html', label: 'Diagnostic', icon: 'clipboard-check' },
    { href: '/index.html#drills', label: 'Drills', icon: 'academic-cap' },
    { href: '/tutor-chat.html', label: 'Tutor', icon: 'chat-bubble' },
    { href: '/simplifier.html', label: 'Simplifier', icon: 'document-text' },
    { href: '/annotator.html', label: 'Annotator', icon: 'speakerphone' },
    { href: '/syllabus.html', label: 'Curriculum', icon: 'book-open' },
  ];

  var icons = {
    'home': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>',
    'clipboard-check': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>',
    'academic-cap': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>',
    'chat-bubble': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>',
    'document-text': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
    'speakerphone': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>',
    'book-open': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>',
  };

  function isActive(href) {
    if (href === '/') return currentPath === '/' || currentPath === '/index.html';
    if (href.includes('#')) return currentPath === '/' || currentPath === '/index.html';
    return currentPath === href;
  }

  function createNav() {
    var nav = document.createElement('nav');
    nav.className = 'site-nav';
    nav.innerHTML =
      '<div class="nav-inner">' +
        '<a href="/" class="nav-logo">' +
          '<span class="nav-logo-mark">PT</span>' +
          '<span class="nav-logo-text">Tutor</span>' +
        '</a>' +
        '<div class="nav-links">' +
          navItems.map(function(item) {
            return '<a href="' + item.href + '" class="nav-link' + (isActive(item.href) ? ' nav-link--active' : '') + '">' +
              '<svg class="nav-link-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">' +
                icons[item.icon] +
              '</svg>' +
              '<span class="nav-link-label">' + item.label + '</span>' +
            '</a>';
          }).join('') +
        '</div>' +
      '</div>';
    return nav;
  }

  // ── Inject nav styles ──
  var style = document.createElement('style');
  style.textContent =
    '.site-nav {' +
      'position: sticky;' +
      'top: 0;' +
      'z-index: 50;' +
      'background: rgba(250, 247, 242, 0.92);' +
      'backdrop-filter: blur(12px);' +
      '-webkit-backdrop-filter: blur(12px);' +
      'border-bottom: 1px solid rgba(31, 27, 22, 0.06);' +
    '}' +
    '.nav-inner {' +
      'max-width: 80rem;' +
      'margin: 0 auto;' +
      'padding: 0 1rem;' +
      'display: flex;' +
      'align-items: center;' +
      'justify-content: space-between;' +
      'height: 3.5rem;' +
    '}' +
    '@media (min-width: 640px) {' +
      '.nav-inner { padding: 0 1.5rem; }' +
    '}' +
    '@media (min-width: 1024px) {' +
      '.nav-inner { padding: 0 2rem; }' +
    '}' +
    '.nav-logo {' +
      'display: flex;' +
      'align-items: baseline;' +
      'gap: 0.35rem;' +
      'text-decoration: none;' +
      'transition: opacity 0.2s;' +
    '}' +
    '.nav-logo:hover { opacity: 0.7; }' +
    '.nav-logo-mark {' +
      "font-family: 'Instrument Serif', Georgia, serif;" +
      'font-style: italic;' +
      'font-size: 1.5rem;' +
      'color: #C24D2C;' +
      'line-height: 1;' +
    '}' +
    '.nav-logo-text {' +
      "font-family: 'DM Sans', system-ui, sans-serif;" +
      'font-weight: 600;' +
      'font-size: 0.875rem;' +
      'color: #1F1B16;' +
      'letter-spacing: -0.01em;' +
    '}' +
    '@media (max-width: 480px) {' +
      '.nav-logo-text { display: none; }' +
    '}' +
    '.nav-links {' +
      'display: flex;' +
      'align-items: center;' +
      'gap: 0.125rem;' +
    '}' +
    '@media (min-width: 640px) {' +
      '.nav-links { gap: 0.25rem; }' +
    '}' +
    '.nav-link {' +
      'display: flex;' +
      'align-items: center;' +
      'gap: 0.375rem;' +
      'padding: 0.375rem 0.5rem;' +
      'border-radius: 8px;' +
      "font-family: 'DM Sans', system-ui, sans-serif;" +
      'font-weight: 500;' +
      'font-size: 0.8125rem;' +
      'color: #6B6560;' +
      'text-decoration: none;' +
      'transition: all 0.2s cubic-bezier(0.33, 1, 0.68, 1);' +
      'white-space: nowrap;' +
    '}' +
    '@media (min-width: 640px) {' +
      '.nav-link { padding: 0.375rem 0.625rem; }' +
    '}' +
    '.nav-link:hover {' +
      'color: #1F1B16;' +
      'background: rgba(31, 27, 22, 0.04);' +
    '}' +
    '.nav-link--active {' +
      'color: #C24D2C;' +
      'background: rgba(194, 77, 44, 0.06);' +
    '}' +
    '.nav-link--active:hover {' +
      'color: #C24D2C;' +
      'background: rgba(194, 77, 44, 0.1);' +
    '}' +
    '.nav-link-icon {' +
      'width: 1.125rem;' +
      'height: 1.125rem;' +
      'flex-shrink: 0;' +
    '}' +
    '.nav-link-label { display: none; }' +
    '@media (min-width: 768px) {' +
      '.nav-link-label { display: inline; }' +
      '.nav-link-icon { width: 1rem; height: 1rem; }' +
    '}';
  document.head.appendChild(style);

  // Insert nav at the start of body
  document.addEventListener('DOMContentLoaded', function() {
    var nav = createNav();
    document.body.insertBefore(nav, document.body.firstChild);
  });
})();
