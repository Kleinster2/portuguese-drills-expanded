# PWA Documentation

Progressive Web App support for Portuguese Language Drills.

## Files

| File | Purpose |
|------|---------|
| `manifest.json` | App metadata and icons |
| `service-worker.js` | Offline caching |
| `scripts/pwa-setup.js` | Service worker registration, install prompts |
| `offline.html` | Offline fallback page |
| `generate-icons.html` | Icon generator tool |

## Setup

### 1. Generate Icons

Open `generate-icons.html` in browser, click "Download All Icons", move to `/icons/`.

### 2. Add to index.html

**In `<head>` after `<title>`:**
```html
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0ea5e9">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="PT Drills">
<link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png">
<link rel="apple-touch-icon" href="/icons/icon-192.png">
```

**Before `</body>`:**
```html
<script src="/scripts/pwa-setup.js"></script>
```

### 3. Deploy

```bash
git add manifest.json service-worker.js scripts/pwa-setup.js offline.html icons/
git commit -m "Add PWA support"
npx wrangler pages deploy . --project-name=portuguese-drills-expanded
```

## Testing

### DevTools Checks
- **Application > Manifest** - All icons green checkmarks
- **Application > Service Workers** - Status "activated and is running"
- **Application > Cache Storage** - `portuguese-drills-v1` contains expected files
- **Network > Offline** - Page loads from cache

### Device Testing
- **Android**: Install banner appears, or Menu > "Install app"
- **iOS**: Share > "Add to Home Screen"
- **Desktop**: Install icon in address bar

### Offline Test
1. Install app
2. Enable airplane mode
3. Homepage and pronunciation annotator should work
4. API calls fail gracefully

## Troubleshooting

**Install banner doesn't appear:**
```javascript
localStorage.removeItem('pwa-banner-dismissed');
location.reload();
```

**Service worker issues:**
- Check DevTools > Console for `[Service Worker]` errors
- Unregister old workers in Application > Service Workers

**Cache issues:**
```javascript
caches.delete('portuguese-drills-v1').then(() => location.reload());
```

## Updating

1. Increment version in `service-worker.js`: `CACHE_NAME = 'portuguese-drills-v2'`
2. Deploy new version
3. Users see "New version available" prompt

## Features

- **Offline**: Core features work without internet
- **Installable**: Add to home screen on any device
- **Fast**: Cached content loads instantly
- **Full-screen**: No browser chrome when installed
