# PWA Installation Guide

**Status:** Ready to deploy
**Date:** 2025-01-09

---

## Files Created

All PWA files have been created and are ready to deploy:

### Core PWA Files:
1. ✅ `manifest.json` - App metadata and configuration
2. ✅ `service-worker.js` - Offline caching and background sync
3. ✅ `pwa-setup.js` - Service worker registration and install prompt
4. ✅ `offline.html` - Offline fallback page
5. ✅ `generate-icons.html` - Icon generator tool

---

## Step 1: Generate App Icons

### Option A: Use the Icon Generator (Easiest)

1. Open in browser:
   ```
   file:///C:/Users/klein/CascadeProjects/portuguese-drills-expanded/generate-icons.html
   ```
   OR after deploying:
   ```
   https://portuguese-drills-expanded.pages.dev/generate-icons.html
   ```

2. Click **"Download All Icons"**
   - This will download 8 PNG files (72px, 96px, 128px, 144px, 152px, 192px, 384px, 512px)
   - Wait for all downloads to complete

3. Create `/icons/` directory:
   ```bash
   mkdir C:\Users\klein\CascadeProjects\portuguese-drills-expanded\icons
   ```

4. Move all downloaded `icon-*.png` files to the `/icons/` directory

### Option B: Use a Design Tool

If you want custom icons:
1. Create PNG files in these sizes: 72, 96, 128, 144, 152, 192, 384, 512px
2. Design should include:
   - Brazilian Portuguese theme (🇧🇷 flag or "PT" text)
   - Sky blue background (#0ea5e9)
   - Simple, recognizable at small sizes
3. Name them: `icon-72.png`, `icon-96.png`, etc.
4. Save to `/icons/` directory

---

## Step 2: Update index.html

Add the following lines to the `<head>` section of `index.html`, right after the `<title>` tag:

```html
    <title>Portuguese Language Drills</title>

    <!-- PWA Manifest -->
    <link rel="manifest" href="/manifest.json">

    <!-- Theme color for mobile browsers -->
    <meta name="theme-color" content="#0ea5e9">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="PT Drills">

    <!-- Icons for various devices -->
    <link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png">
    <link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png">
    <link rel="apple-touch-icon" href="/icons/icon-192.png">

    <!-- Description for PWA -->
    <meta name="description" content="Brazilian Portuguese learning with AI-powered drills, pronunciation tools, and interactive lessons">

    <!-- Force deployment update -->
```

Then add this script tag **before the closing `</body>` tag**, right after the pronunciation annotator script:

```html
    <!-- Pronunciation Annotator Engine -->
    <script src="/js/pronunciation-annotator.js"></script>

    <!-- PWA Setup -->
    <script src="/pwa-setup.js"></script>
</body>
</html>
```

---

## Step 3: Deploy to Cloudflare Pages

```bash
cd /c/Users/klein/CascadeProjects/portuguese-drills-expanded

# Commit PWA files
git add manifest.json service-worker.js pwa-setup.js offline.html generate-icons.html icons/
git commit -m "Add PWA support: manifest, service worker, offline mode, and install prompt"

# Deploy
npx wrangler pages deploy . --project-name=portuguese-drills-expanded
```

---

## Step 4: Test PWA Installation

### On Android (Chrome/Edge):

1. Open your deployed site in Chrome:
   ```
   https://portuguese-drills-expanded.pages.dev/
   ```

2. Look for install prompt:
   - **Option 1:** Install banner appears at bottom of page
   - **Option 2:** Three-dot menu → "Install app" or "Add to Home Screen"

3. Tap "Install"

4. App icon appears on home screen

5. Open app from home screen → Full-screen experience!

### On iOS (Safari):

1. Open your deployed site in Safari:
   ```
   https://portuguese-drills-expanded.pages.dev/
   ```

2. Tap the Share button (square with arrow)

3. Scroll down and tap "Add to Home Screen"

4. Edit name if desired, tap "Add"

5. App icon appears on home screen

6. Open app from home screen

### On Desktop (Chrome/Edge):

1. Open your deployed site:
   ```
   https://portuguese-drills-expanded.pages.dev/
   ```

2. Look for install icon in address bar (+ or ⊕)

3. Click icon → "Install Portuguese Drills"

4. App opens in standalone window

---

## Step 5: Test Offline Mode

1. Install the app (see Step 4)

2. Open the installed app

3. Turn off WiFi/mobile data OR enable Airplane Mode

4. Try navigating the app:
   - ✅ Homepage should load
   - ✅ Pronunciation annotator should work
   - ✅ Previously viewed drills should load
   - ✅ Placement test questions (if cached) should work

5. Try loading new content:
   - ❌ New API calls will fail (expected)
   - ✅ Offline page appears for failed navigation

6. Turn WiFi back on:
   - ✅ "Back online!" notification appears
   - ✅ App syncs new content

---

## Features Included

### ✅ Offline Support
- All static assets cached (HTML, CSS, JS)
- Previously viewed content available offline
- Pronunciation annotator works offline
- Graceful offline fallback page

### ✅ Install Prompt
- Smart banner appears after a few seconds
- "Not Now" dismisses permanently (via localStorage)
- Shows on mobile and desktop
- Beautiful gradient design

### ✅ App-Like Experience
- Full-screen mode (no browser chrome)
- Theme color matches app design
- Splash screen on launch (iOS)
- Home screen icon

### ✅ Background Features
- Service worker caches updates in background
- Stale-while-revalidate strategy (fast + fresh)
- Automatic cache cleanup
- Online/offline status monitoring

### ✅ Future-Ready
- Push notification support (commented out, ready to enable)
- Background sync (commented out, ready to enable)
- Can add shortcuts to specific features

---

## Troubleshooting

### Install prompt doesn't appear

**Possible causes:**
1. Not using HTTPS (Cloudflare Pages uses HTTPS automatically ✓)
2. Manifest.json not loading (check Network tab in DevTools)
3. Icons not found (check `/icons/` directory exists)
4. Already dismissed banner (check localStorage for 'pwa-banner-dismissed')

**Solutions:**
- Open DevTools → Application → Manifest (check for errors)
- Open DevTools → Console (look for [PWA] messages)
- Clear localStorage: `localStorage.removeItem('pwa-banner-dismissed')`
- Force reload: Ctrl+Shift+R

### Service worker not registering

**Possible causes:**
1. Service worker file not found (check `/service-worker.js` exists)
2. JavaScript error in service worker
3. Scope issues

**Solutions:**
- Open DevTools → Application → Service Workers
- Look for registration errors
- Check Console for [Service Worker] messages
- Unregister old service workers if needed

### App doesn't work offline

**Possible causes:**
1. Service worker not activated
2. Assets not cached
3. Cache name mismatch

**Solutions:**
- Open DevTools → Application → Cache Storage
- Check if `portuguese-drills-v1` cache exists
- Check which files are cached
- Clear all caches and re-test

### Icons not appearing

**Possible causes:**
1. Icon files missing from `/icons/` directory
2. Wrong file names
3. Paths incorrect in manifest.json

**Solutions:**
- Check `/icons/` directory has all 8 sizes
- Verify file names match manifest.json exactly
- Check browser DevTools → Network for 404 errors on icon files

---

## Updating the PWA

When you update the app:

1. Update version in `service-worker.js`:
   ```javascript
   const CACHE_NAME = 'portuguese-drills-v2'; // Increment version
   ```

2. Add new assets to `STATIC_ASSETS` array if needed

3. Commit and deploy as usual

4. Users will see "New version available! Reload to update?" prompt

---

## Optional Enhancements

### Add Shortcuts to Manifest

Already included in `manifest.json`:
- Placement Test (quick access)
- Start Drill Session
- Pronunciation Annotator

Users can long-press app icon to see shortcuts (Android).

### Enable Push Notifications

Uncomment push notification code in `service-worker.js` and `pwa-setup.js`.

Requires:
- User permission
- Backend to send notifications (Cloudflare Workers)
- Notification strategy (daily reminders, etc.)

### Add Screenshots

1. Take screenshots of app (desktop + mobile views)
2. Save as `/screenshots/home.png` (1280x720) and `/screenshots/mobile-home.png` (750x1334)
3. Already configured in manifest.json

Screenshots appear in install prompt (Chrome, Edge).

---

## Testing Checklist

Before deploying to production:

- [ ] All icon files generated and in `/icons/` directory
- [ ] index.html updated with PWA meta tags
- [ ] index.html updated with pwa-setup.js script tag
- [ ] Deployed to Cloudflare Pages
- [ ] Tested install on Android Chrome
- [ ] Tested install on iOS Safari
- [ ] Tested install on desktop Chrome
- [ ] Tested offline mode (airplane mode)
- [ ] Tested online/offline transitions
- [ ] Checked service worker in DevTools
- [ ] Checked manifest in DevTools
- [ ] Checked cache storage in DevTools
- [ ] Tested pronunciation annotator offline
- [ ] Verified theme color matches
- [ ] Verified app name appears correctly

---

## Resources

### Testing Tools:
- Chrome DevTools → Application tab → Manifest, Service Workers, Cache
- Lighthouse → PWA audit (should score 100%)
- [PWA Builder](https://www.pwabuilder.com/) - Test your PWA

### Documentation:
- [MDN: Progressive Web Apps](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Google: PWA Checklist](https://web.dev/pwa-checklist/)
- [iOS PWA Support](https://developer.apple.com/documentation/webkit/managing_web_content_on_ios_and_ipados)

---

## What Happens After Deployment

1. **First Visit (Web):**
   - User visits site normally
   - Service worker registers in background
   - Assets cached for offline use
   - Install banner appears after a few seconds

2. **User Installs:**
   - Taps "Install" in banner or browser menu
   - App icon added to home screen
   - Banner dismissed permanently

3. **Subsequent Launches:**
   - User taps app icon
   - App opens in full-screen (standalone mode)
   - Loads instantly from cache
   - Updates in background if online

4. **Offline Usage:**
   - App works completely offline
   - All cached content available
   - API calls fail gracefully
   - Syncs when back online

---

## Success Metrics

After deployment, track:
- **Install Rate:** How many users install the PWA
- **Retention:** How often users open the installed app
- **Offline Usage:** How often app is used offline
- **Performance:** Load times (should be <1s from cache)

All available in Cloudflare Analytics and browser DevTools.

---

## Next Steps

Once PWA is deployed and tested:

1. ✅ **Week 1 Complete:** PWA deployed and working
2. 🎯 **Week 2:** Build interactive lessons (`lessons.html`)
3. 🎯 **Week 3:** Build vocabulary flashcards (`vocabulary.html`)
4. 🎯 **Week 4+:** Polish and add advanced features

---

**Status:** Ready to deploy! 🚀

All files are created. Just need to:
1. Generate icons
2. Update index.html (copy/paste the code above)
3. Deploy
4. Test on mobile devices

Let me know when you're ready to deploy and I can help with the git commit and Cloudflare deployment!
