// PWA Setup - Service Worker Registration and Install Prompt

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then((registration) => {
        console.log('[PWA] Service Worker registered successfully:', registration.scope);

        // Check for updates periodically
        setInterval(() => {
          registration.update();
        }, 60 * 60 * 1000); // Check every hour
      })
      .catch((error) => {
        console.error('[PWA] Service Worker registration failed:', error);
      });

    // Listen for updates
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      console.log('[PWA] New service worker activated');

      // Show update notification (optional)
      if (confirm('New version available! Reload to update?')) {
        window.location.reload();
      }
    });
  });
}

// Install prompt for PWA
let deferredPrompt;
const installButton = document.getElementById('pwa-install-button');

window.addEventListener('beforeinstallprompt', (e) => {
  console.log('[PWA] Install prompt available');

  // Prevent the mini-infobar from appearing on mobile
  e.preventDefault();

  // Stash the event so it can be triggered later
  deferredPrompt = e;

  // Show install button if it exists
  if (installButton) {
    installButton.style.display = 'block';
  } else {
    // Create and show install banner
    showInstallBanner();
  }
});

function showInstallBanner() {
  // Check if banner was already dismissed
  if (localStorage.getItem('pwa-banner-dismissed') === 'true') {
    return;
  }

  // Create banner
  const banner = document.createElement('div');
  banner.id = 'pwa-install-banner';
  banner.className = 'fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 rounded-lg shadow-2xl z-50 transform transition-all duration-300';
  banner.innerHTML = `
    <div class="flex items-start gap-3">
      <div class="text-3xl">📱</div>
      <div class="flex-1">
        <h3 class="font-bold text-lg mb-1">Install PT Drills</h3>
        <p class="text-sm opacity-90 mb-3">Add to your home screen for quick access and offline use!</p>
        <div class="flex gap-2">
          <button id="install-app-btn" class="bg-white text-sky-600 px-4 py-2 rounded font-semibold text-sm hover:bg-gray-100 transition">
            Install
          </button>
          <button id="dismiss-banner-btn" class="bg-sky-700 bg-opacity-50 px-4 py-2 rounded font-semibold text-sm hover:bg-opacity-70 transition">
            Not Now
          </button>
        </div>
      </div>
      <button id="close-banner-btn" class="text-white hover:text-gray-200 text-xl leading-none">
        ×
      </button>
    </div>
  `;

  document.body.appendChild(banner);

  // Add slide-in animation
  setTimeout(() => {
    banner.style.transform = 'translateY(0)';
  }, 100);

  // Install button handler
  document.getElementById('install-app-btn').addEventListener('click', async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      console.log('[PWA] User response to install prompt:', outcome);
      deferredPrompt = null;
    }
    banner.remove();
  });

  // Dismiss button handler
  document.getElementById('dismiss-banner-btn').addEventListener('click', () => {
    localStorage.setItem('pwa-banner-dismissed', 'true');
    banner.remove();
  });

  // Close button handler
  document.getElementById('close-banner-btn').addEventListener('click', () => {
    banner.remove();
  });
}

// Handle successful installation
window.addEventListener('appinstalled', () => {
  console.log('[PWA] App installed successfully');
  deferredPrompt = null;

  // Hide install button/banner
  const banner = document.getElementById('pwa-install-banner');
  if (banner) {
    banner.remove();
  }

  // Show success message
  showSuccessMessage('App installed! Look for PT Drills on your home screen.');
});

// Show success message
function showSuccessMessage(message) {
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in';
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="text-2xl">✓</span>
      <span>${message}</span>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(400px)';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

// Detect if app is running as installed PWA
function isRunningAsPWA() {
  return window.matchMedia('(display-mode: standalone)').matches ||
         window.navigator.standalone === true;
}

// Show different UI if running as PWA
if (isRunningAsPWA()) {
  console.log('[PWA] App is running as installed PWA');
  document.body.classList.add('pwa-mode');

  // Add subtle indicator
  const pwaIndicator = document.createElement('div');
  pwaIndicator.className = 'fixed top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded opacity-75 z-50';
  pwaIndicator.textContent = 'PWA Mode';
  pwaIndicator.style.display = 'none'; // Hidden by default, can show for debugging
  document.body.appendChild(pwaIndicator);
}

// Monitor online/offline status
window.addEventListener('online', () => {
  console.log('[PWA] Connection restored');
  showSuccessMessage('Back online! 🌐');
});

window.addEventListener('offline', () => {
  console.log('[PWA] Connection lost - switching to offline mode');
  const toast = document.createElement('div');
  toast.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-6 py-3 rounded-lg shadow-lg z-50';
  toast.innerHTML = `
    <div class="flex items-center gap-2">
      <span class="text-2xl">📡</span>
      <span>Offline mode - some features may be limited</span>
    </div>
  `;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
});

console.log('[PWA] Setup script loaded');
