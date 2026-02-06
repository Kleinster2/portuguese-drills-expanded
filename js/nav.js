// Navigation bar component
// Include this script on all pages to add consistent navigation

(function() {
  const currentPath = window.location.pathname;

  const navItems = [
    { href: '/', label: 'Home', icon: 'home' },
    { href: '/diagnostic-test.html', label: 'Diagnostic', icon: 'clipboard-check' },
    { href: '/index.html#drills', label: 'Drills', icon: 'academic-cap' },
    { href: '/tutor-chat.html', label: 'Tutor', icon: 'chat-bubble' },
    { href: '/simplifier.html', label: 'Simplifier', icon: 'document-text' },
    { href: '/annotator.html', label: 'Annotator', icon: 'speakerphone' },
    { href: '/syllabus.html', label: 'Curriculum', icon: 'book-open' },
  ];

  const icons = {
    'home': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/>',
    'clipboard-check': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/>',
    'academic-cap': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"/>',
    'chat-bubble': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/>',
    'document-text': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>',
    'speakerphone': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z"/>',
    'book-open': '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>',
  };

  function isActive(href) {
    if (href === '/') return currentPath === '/' || currentPath === '/index.html';
    if (href.includes('#')) return currentPath === '/' || currentPath === '/index.html';
    return currentPath === href;
  }

  function createNav() {
    const nav = document.createElement('nav');
    nav.className = 'sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm';
    nav.innerHTML = `
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-14">
          <a href="/" class="flex items-center gap-2 text-slate-900 font-bold text-lg hover:text-sky-600 transition-colors">
            <span class="text-2xl">🇧🇷</span>
            <span class="hidden sm:inline">PT Tutor</span>
          </a>
          <div class="flex items-center gap-1 sm:gap-2">
            ${navItems.map(item => `
              <a href="${item.href}"
                 class="flex items-center gap-1.5 px-2 sm:px-3 py-2 rounded-lg text-sm font-medium transition-colors
                        ${isActive(item.href)
                          ? 'bg-sky-100 text-sky-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}">
                <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  ${icons[item.icon]}
                </svg>
                <span class="hidden md:inline">${item.label}</span>
              </a>
            `).join('')}
          </div>
        </div>
      </div>
    `;
    return nav;
  }

  // Insert nav at the start of body
  document.addEventListener('DOMContentLoaded', function() {
    const nav = createNav();
    document.body.insertBefore(nav, document.body.firstChild);
  });
})();
