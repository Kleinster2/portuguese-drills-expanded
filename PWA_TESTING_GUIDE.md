# PWA Testing Guide

**Purpose:** How to test your PWA locally and after deployment
**Time:** 15-30 minutes for complete testing

---

## Table of Contents

1. [Local Testing (Before Deployment)](#local-testing-before-deployment)
2. [Production Testing (After Deployment)](#production-testing-after-deployment)
3. [Testing Checklist](#testing-checklist)
4. [Troubleshooting](#troubleshooting)

---

## Local Testing (Before Deployment)

### Option 1: Test with Local Server (Recommended)

PWAs require HTTPS (or localhost). You can test locally using a simple HTTP server:

#### **Method A: Python Server** (Easiest)

```bash
# Navigate to project directory
cd /c/Users/klein/CascadeProjects/portuguese-drills-expanded

# If you have Python 3:
python -m http.server 8000

# OR if you have Python 2:
python -m SimpleHTTPServer 8000

# Then open:
http://localhost:8000
```

#### **Method B: Node.js Server**

```bash
# Install http-server globally (one time only)
npm install -g http-server

# Run server
cd /c/Users/klein/CascadeProjects/portuguese-drills-expanded
http-server -p 8000

# Then open:
http://localhost:8000
```

#### **Method C: VS Code Live Server**

If you use VS Code:
1. Install "Live Server" extension
2. Right-click `index.html`
3. Click "Open with Live Server"
4. Opens at `http://127.0.0.1:5500`

---

### What to Test Locally:

#### **1. Generate Icons First**

```bash
# Open icon generator in browser:
file:///C:/Users/klein/CascadeProjects/portuguese-drills-expanded/generate-icons.html

# OR if server is running:
http://localhost:8000/generate-icons.html
```

**Steps:**
1. Page loads with icon previews
2. Click "Download All Icons"
3. 8 PNG files download (icon-72.png through icon-512.png)
4. Create `/icons/` folder in project
5. Move all PNG files to `/icons/`

**Verify:**
- [ ] All 8 icons downloaded
- [ ] Icons moved to `/icons/` folder
- [ ] Icon previews show "PT" text and 🇧🇷 flag
- [ ] Different sizes visible (72px is small, 512px is large)

---

#### **2. Update index.html**

Before testing PWA features, add the code snippets from `PWA_QUICK_START.md`:

**Add to `<head>` section:**
```html
<!-- PWA Manifest -->
<link rel="manifest" href="/manifest.json">
<meta name="theme-color" content="#0ea5e9">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="default">
<meta name="apple-mobile-web-app-title" content="PT Drills">
<link rel="icon" type="image/png" sizes="192x192" href="/icons/icon-192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/icons/icon-512.png">
<link rel="apple-touch-icon" href="/icons/icon-192.png">
<meta name="description" content="Brazilian Portuguese learning with AI-powered drills, pronunciation tools, and interactive lessons">
```

**Add before `</body>`:**
```html
<!-- PWA Setup -->
<script src="/pwa-setup.js"></script>
</body>
</html>
```

---

#### **3. Test Manifest**

With local server running, open in **Chrome**:
```
http://localhost:8000
```

**Open Chrome DevTools:**
- Press `F12` or `Ctrl+Shift+I` (Windows)
- Click **"Application"** tab
- Click **"Manifest"** in left sidebar

**What to Check:**
- [ ] Manifest URL shows: `http://localhost:8000/manifest.json`
- [ ] Identity section shows:
  - Name: "Portuguese Language Drills"
  - Short name: "PT Drills"
- [ ] Presentation section shows:
  - Start URL: "/"
  - Theme color: #0ea5e9 (sky blue)
  - Display: standalone
- [ ] Icons section shows 8 icons:
  - 72x72, 96x96, 128x128, 144x144, 152x152, 192x192, 384x384, 512x512
  - All show green checkmarks ✅
  - Preview images visible

**If errors appear:**
- Red X on icons = Icon files not found (check `/icons/` folder)
- "Manifest not found" = Check manifest.json exists
- "Invalid JSON" = Check manifest.json syntax

---

#### **4. Test Service Worker**

Still in Chrome DevTools → **Application** tab:

Click **"Service Workers"** in left sidebar

**What to Check:**
- [ ] Service worker shows: `http://localhost:8000/service-worker.js`
- [ ] Status: "activated and is running"
- [ ] Green circle next to worker
- [ ] Scope: `http://localhost:8000/`

**In Console tab:**
Look for these messages:
```
[PWA] Setup script loaded
[Service Worker] Script loaded
[Service Worker] Installing...
[Service Worker] Caching static assets...
[Service Worker] Install complete
[Service Worker] Activating...
[Service Worker] Activation complete
[PWA] Service Worker registered successfully: http://localhost:8000/
```

**If service worker doesn't register:**
- Check Console for errors (red text)
- Verify service-worker.js file exists
- Check for JavaScript syntax errors
- Try hard reload: `Ctrl+Shift+R`

---

#### **5. Test Offline Cache**

**View cached files:**
1. DevTools → **Application** tab
2. Click **"Cache Storage"** in left sidebar
3. Expand `portuguese-drills-v1`

**What to Check:**
- [ ] Cache name: `portuguese-drills-v1` exists
- [ ] Contains files:
  - `http://localhost:8000/` (index.html)
  - `http://localhost:8000/offline.html`
  - `http://localhost:8000/js/pronunciation-annotator.js`
  - `http://localhost:8000/js/answerChips.js`
  - `http://localhost:8000/js/conjugations.js`
  - `http://localhost:8000/css/styles.css`
  - `https://cdn.tailwindcss.com` (CDN)
  - Icon files

**If cache is empty:**
- Reload page: `Ctrl+R`
- Check Console for cache errors
- Verify service worker is activated
- Check service-worker.js STATIC_ASSETS array

---

#### **6. Test Offline Mode (Local)**

**Enable offline mode:**
1. DevTools → **Network** tab
2. Find dropdown that says "No throttling"
3. Select **"Offline"**
4. Reload page: `Ctrl+R`

**What to Check:**
- [ ] Page loads from cache (not from network)
- [ ] Homepage appears correctly
- [ ] All images/icons load
- [ ] Pronunciation annotator works
- [ ] Console shows: "[Service Worker] Serving from cache"

**Test new page while offline:**
1. While still offline, type in address bar: `http://localhost:8000/test-page`
2. Press Enter

**What Should Happen:**
- [ ] `offline.html` page appears
- [ ] Shows "You're Offline" message
- [ ] Bouncing 📡 icon
- [ ] "Try Again" button visible
- [ ] Status shows "Offline" in yellow

**Return online:**
1. Network tab → Change "Offline" back to "No throttling"
2. Click "Try Again" button OR reload page

**What Should Happen:**
- [ ] Toast notification: "Back online! 🌐"
- [ ] Homepage loads successfully
- [ ] Status changes to "Online" in green

---

#### **7. Test Install Banner (Local)**

**Note:** Install banner only shows on HTTPS or localhost!

**Steps:**
1. Make sure you're on `http://localhost:8000` (or `https://` URL)
2. Wait 3-5 seconds after page loads
3. Look for banner at bottom of page

**What to Check:**
- [ ] Banner appears at bottom (mobile) or bottom-right (desktop)
- [ ] Gradient background (sky blue to blue)
- [ ] Shows 📱 icon
- [ ] Text: "Install PT Drills"
- [ ] "Install" button (white background)
- [ ] "Not Now" button
- [ ] Close button (×)

**Test buttons:**

**Click "Not Now":**
- [ ] Banner disappears
- [ ] Reload page → Banner doesn't appear again (localStorage set)
- [ ] Clear storage and reload → Banner appears again

**Click "×" (close):**
- [ ] Banner disappears
- [ ] Reload page → Banner appears again (not permanently dismissed)

**To clear dismissal:**
```javascript
// In Console tab:
localStorage.removeItem('pwa-banner-dismissed');
location.reload();
```

---

## Production Testing (After Deployment)

Once you deploy to Cloudflare Pages, test on real devices!

### Deploy First:

```bash
cd /c/Users/klein/CascadeProjects/portuguese-drills-expanded

# Make sure icons are in /icons/ folder
# Make sure index.html is updated

git add .
git commit -m "Add PWA support"
npx wrangler pages deploy . --project-name=portuguese-drills-expanded
```

You'll get a URL like:
```
https://abc123.portuguese-drills-expanded.pages.dev
```

---

### Testing on Android Phone (Chrome/Edge)

#### **1. Open Site on Phone**

1. Open **Chrome** on Android
2. Type your deployed URL
3. Wait for page to load

#### **2. Look for Install Prompt**

**Option A - Install Banner:**
- Wait 3-5 seconds
- Banner appears at bottom of screen
- Tap **"Install"**

**Option B - Browser Menu:**
- Tap **⋮** (three dots) in Chrome
- Look for **"Install app"** or **"Add to Home Screen"**
- Tap it

**Option C - Address Bar:**
- Look for **+** icon in address bar
- Tap it to install

#### **3. Install the App**

1. Tap "Install" (or "Add")
2. Confirmation dialog appears
3. Shows app name: "Portuguese Language Drills" or "PT Drills"
4. Shows app icon
5. Tap "Add" or "Install"

**What Should Happen:**
- [ ] "App installed!" toast appears
- [ ] App icon added to home screen
- [ ] Install banner disappears

#### **4. Open Installed App**

1. Go to home screen
2. Find "PT Drills" icon
3. Tap to open

**What to Check:**
- [ ] App opens in **full-screen** (no browser address bar)
- [ ] App opens quickly (<2 seconds)
- [ ] Theme color visible (sky blue at top)
- [ ] All features work normally

#### **5. Test Offline Mode on Phone**

1. With app open, pull down notification shade
2. Tap **Airplane Mode** to enable
3. Try using app:

**What Should Work Offline:**
- [ ] Homepage loads (from cache)
- [ ] Pronunciation annotator works
- [ ] Can scroll, click buttons
- [ ] Previously viewed drills visible

**What Shouldn't Work:**
- [ ] New drill chat sessions (needs API)
- [ ] A1 Simplifier (needs API)
- [ ] Loading new content

4. Disable Airplane Mode

**What Should Happen:**
- [ ] "Back online! 🌐" toast appears
- [ ] App resumes normal function

#### **6. Test App Switching**

1. Press **Home** button (or swipe up)
2. Open another app (browser, email, etc.)
3. Return to PT Drills from app switcher

**What to Check:**
- [ ] App state preserved (not reloaded)
- [ ] Still in full-screen mode
- [ ] Loads instantly

#### **7. Test Uninstall (Optional)**

1. Long-press PT Drills icon
2. Drag to "Uninstall" or tap "App info"
3. Tap "Uninstall"

**What to Check:**
- [ ] App removes cleanly
- [ ] Can reinstall again if needed

---

### Testing on iPhone (Safari)

#### **1. Open Site on iPhone**

1. Open **Safari** on iPhone
2. Type your deployed URL
3. Wait for page to load

**Note:** iOS doesn't show automatic install banners. Users must manually add.

#### **2. Add to Home Screen**

1. Tap **Share** button (square with arrow pointing up)
2. Scroll down in share sheet
3. Tap **"Add to Home Screen"**
4. Edit name if desired (shows "PT Drills")
5. Tap **"Add"** in top-right

**What Should Happen:**
- [ ] Icon added to home screen
- [ ] Shows your custom icon

#### **3. Open Installed App**

1. Go to home screen
2. Tap "PT Drills" icon

**What to Check:**
- [ ] App opens in full-screen (no Safari UI)
- [ ] Shows splash screen briefly (with your icon + theme color)
- [ ] Loads homepage quickly
- [ ] All features work

#### **4. Test Offline Mode on iPhone**

1. Swipe down from top-right (or up from bottom)
2. Long-press **Airplane Mode** icon
3. Enable Airplane Mode
4. Return to app

**What Should Work:**
- [ ] Homepage loads from cache
- [ ] Pronunciation annotator works
- [ ] Previously viewed content available

5. Disable Airplane Mode

**What Should Happen:**
- [ ] App reconnects automatically
- [ ] New content loads

**Note:** iOS PWA support has some limitations:
- No background sync
- Limited push notifications
- Cache size limits (50MB)
- But core PWA features work great!

---

### Testing on Desktop (Chrome/Edge)

#### **1. Open Site in Chrome**

1. Open Chrome (or Edge)
2. Navigate to deployed URL
3. Wait for page to load

#### **2. Look for Install Icon**

**Address bar:**
- Look for **⊕** or **+** icon in address bar (right side)
- OR click **⋮** menu → "Install Portuguese Drills..."

#### **3. Install App**

1. Click install icon
2. Dialog appears: "Install Portuguese Drills?"
3. Shows app icon, name, URL
4. Click **"Install"**

**What Should Happen:**
- [ ] New window opens (standalone app window)
- [ ] No browser address bar
- [ ] No tabs
- [ ] Custom title bar with app name
- [ ] App icon in taskbar (Windows) or dock (Mac)

#### **4. Test as Installed Desktop App**

**Check window:**
- [ ] Full-screen browsing area (no browser chrome)
- [ ] Close/minimize/maximize buttons
- [ ] App name in window title
- [ ] Separate from browser in taskbar

**Test features:**
- [ ] All features work normally
- [ ] Pronunciation annotator works
- [ ] Drill sessions work
- [ ] Placement test works

#### **5. Test Offline on Desktop**

1. Open DevTools: `F12`
2. **Network** tab → Select **"Offline"**
3. Reload page: `Ctrl+R`

**What to Check:**
- [ ] Page loads from cache
- [ ] No network requests (except failed API calls)
- [ ] Pronunciation annotator works offline

4. Switch back to **"No throttling"**

**What to Check:**
- [ ] App reconnects
- [ ] Toast: "Back online!"

#### **6. Test Updates**

**Simulate app update:**

1. Open installed app
2. Make a small change to index.html on server
3. Deploy new version
4. Reload app: `Ctrl+R`

**What Should Happen:**
- [ ] Dialog: "New version available! Reload to update?"
- [ ] Click "OK" → Page reloads
- [ ] New version loads
- [ ] Old cache cleared automatically

---

## Testing Checklist

### ✅ Pre-Deployment (Local)

**Files:**
- [ ] manifest.json exists
- [ ] service-worker.js exists
- [ ] pwa-setup.js exists
- [ ] offline.html exists
- [ ] /icons/ folder exists with 8 PNG files

**index.html:**
- [ ] PWA meta tags added to `<head>`
- [ ] `<script src="/pwa-setup.js"></script>` added before `</body>`

**DevTools - Manifest:**
- [ ] Manifest loads without errors
- [ ] All 8 icons show green checkmarks
- [ ] App name, theme color correct

**DevTools - Service Worker:**
- [ ] Service worker registers successfully
- [ ] Status: "activated and is running"
- [ ] Console shows success messages

**DevTools - Cache:**
- [ ] Cache `portuguese-drills-v1` exists
- [ ] Contains expected files
- [ ] Offline mode works (loads from cache)

**Functionality:**
- [ ] Install banner appears (after 3s)
- [ ] "Not Now" dismisses permanently
- [ ] Offline page appears for uncached URLs
- [ ] Online/offline transitions work

---

### ✅ Post-Deployment (Production)

**Android Chrome:**
- [ ] Site loads on phone
- [ ] Install banner appears OR install option in menu
- [ ] Can install to home screen
- [ ] Icon appears on home screen
- [ ] Opens in full-screen mode
- [ ] Works offline (airplane mode test)
- [ ] "Back online" toast appears

**iOS Safari:**
- [ ] Site loads on phone
- [ ] Can add to home screen via Share menu
- [ ] Icon appears on home screen
- [ ] Opens in full-screen mode
- [ ] Works offline
- [ ] Reconnects when online

**Desktop Chrome/Edge:**
- [ ] Install icon appears in address bar
- [ ] Can install as standalone app
- [ ] Opens in separate window
- [ ] Works offline
- [ ] Shows update prompts

**Performance:**
- [ ] First load: <5 seconds
- [ ] Subsequent loads: <1 second (from cache)
- [ ] Lighthouse PWA score: 90-100%

**Features Offline:**
- [ ] Homepage loads
- [ ] Pronunciation annotator works
- [ ] Previously cached content available
- [ ] API calls fail gracefully

---

## Lighthouse PWA Audit

### Run Lighthouse Test:

**In Chrome DevTools:**
1. Press `F12`
2. Click **"Lighthouse"** tab
3. Select **"Progressive Web App"** category
4. Click **"Analyze page load"**

**Or:**
- Right-click page → "Inspect"
- Lighthouse tab
- Generate report

### What to Check:

**PWA Audit Results:**
- [ ] Score: 90-100% (green)
- [ ] ✅ Fast and reliable:
  - Current page responds with 200 when offline
  - Serves valid service worker
- [ ] ✅ Installable:
  - Web app manifest meets installability requirements
  - Has a valid service worker
- [ ] ✅ PWA Optimized:
  - Configured for custom splash screen
  - Sets theme color
  - Content sized correctly for viewport

**If score is low (<90%):**
- Check which audits failed (red X)
- Common issues:
  - Icons missing or wrong sizes
  - Service worker not registered
  - Manifest invalid
  - Not served over HTTPS (won't happen on Cloudflare)

---

## Troubleshooting

### Issue: Install Banner Doesn't Appear

**Possible Causes:**
1. Not on HTTPS (or localhost)
2. Already installed
3. Already dismissed permanently
4. Manifest errors
5. Service worker not registered

**Solutions:**

**Check HTTPS:**
```javascript
// In Console:
console.log(window.location.protocol);
// Should be: "https:" or "http:" (only if localhost)
```

**Check if already installed:**
```javascript
// In Console:
window.matchMedia('(display-mode: standalone)').matches
// true = already installed
// false = not installed
```

**Clear dismissal:**
```javascript
// In Console:
localStorage.removeItem('pwa-banner-dismissed');
location.reload();
```

**Check manifest:**
- DevTools → Application → Manifest
- Look for errors (red X)

**Check service worker:**
- DevTools → Application → Service Workers
- Should show "activated and is running"

---

### Issue: Service Worker Not Registering

**Check Console for errors:**
```
[Service Worker] Registration failed: ...
```

**Common Errors:**

**"Failed to fetch service worker"**
- Solution: Make sure service-worker.js exists at root
- Check path: `https://your-site.com/service-worker.js`

**"Script contains syntax error"**
- Solution: Check service-worker.js for JavaScript errors
- Look for missing commas, brackets, quotes

**"Service worker scope not allowed"**
- Solution: Service worker must be at root level
- Don't put in /js/ folder

**Fix:**
1. Check file exists: `/service-worker.js`
2. Check JavaScript syntax
3. Hard reload: `Ctrl+Shift+R`
4. Unregister old workers:
   - DevTools → Application → Service Workers
   - Click "Unregister" on all workers
   - Reload page

---

### Issue: App Doesn't Work Offline

**Check cache:**
1. DevTools → Application → Cache Storage
2. Expand `portuguese-drills-v1`
3. Verify files are cached

**If cache is empty:**
- Service worker may not be activated
- Check: DevTools → Application → Service Workers
- Status should be "activated and is running"

**If files are cached but offline doesn't work:**
- Try hard reload: `Ctrl+Shift+R`
- Check Network tab → Offline mode
- Look for red failed requests
- Check Console for errors

**Clear everything and restart:**
```javascript
// In Console:
navigator.serviceWorker.getRegistrations()
  .then(registrations => {
    registrations.forEach(reg => reg.unregister());
  });

caches.keys()
  .then(keys => {
    keys.forEach(key => caches.delete(key));
  });

// Then reload
location.reload();
```

---

### Issue: Icons Not Showing

**Check icon files:**
```bash
# In project folder:
ls icons/
# Should show: icon-72.png, icon-96.png, etc. (8 files)
```

**Check manifest:**
- DevTools → Application → Manifest
- Icons section should show green checkmarks
- If red X: Icon file not found at path

**Common causes:**
- Icons not uploaded (forgot to commit /icons/ folder)
- Wrong paths in manifest.json
- Icons named incorrectly

**Fix:**
1. Verify files exist in `/icons/`
2. Check filenames match manifest.json exactly
3. Re-deploy with icons included
4. Clear cache and reload

---

### Issue: Theme Color Not Applying

**Check meta tag:**
```html
<!-- In index.html <head>: -->
<meta name="theme-color" content="#0ea5e9">
```

**Check manifest:**
```json
// In manifest.json:
"theme_color": "#0ea5e9"
```

**Note:**
- Theme color shows in address bar (mobile)
- Shows in app switcher (Android)
- Shows in splash screen (iOS)
- May not be visible on desktop

---

### Issue: Updates Not Showing

**Force update:**
1. DevTools → Application → Service Workers
2. Check "Update on reload"
3. Reload page: `Ctrl+R`

**Or manually update:**
```javascript
// In Console:
navigator.serviceWorker.getRegistration()
  .then(reg => reg.update());
```

**Clear cache:**
```javascript
// In Console:
caches.delete('portuguese-drills-v1')
  .then(() => location.reload());
```

---

## Advanced Testing

### Test with Chrome DevTools Device Emulation

1. Open DevTools: `F12`
2. Click **Toggle Device Toolbar** (or `Ctrl+Shift+M`)
3. Select device: "iPhone 12 Pro" or "Pixel 5"
4. Test mobile experience

**Limitations:**
- Emulator doesn't show true install experience
- Can't test actual offline mode reliably
- Always test on real devices for PWA!

---

### Test Network Conditions

**Simulate slow connection:**
1. DevTools → Network tab
2. Dropdown: "No throttling"
3. Select: "Slow 3G" or "Fast 3G"
4. Reload page

**What to Check:**
- [ ] Page still loads (from cache)
- [ ] Shows cached content quickly
- [ ] Updates in background

---

### Test Cache Strategies

**View what's cached:**
```javascript
// In Console:
caches.open('portuguese-drills-v1')
  .then(cache => cache.keys())
  .then(keys => console.log(keys.map(k => k.url)));
```

**Manually add to cache:**
```javascript
caches.open('portuguese-drills-v1')
  .then(cache => cache.add('/new-page.html'));
```

**Manually clear cache:**
```javascript
caches.delete('portuguese-drills-v1');
```

---

## Success Criteria

### ✅ PWA is Working Correctly When:

**Installation:**
- [ ] Users see install prompt/banner
- [ ] App installs successfully to home screen
- [ ] Icon appears with correct branding
- [ ] Opens in full-screen (standalone) mode

**Offline:**
- [ ] Core features work without internet
- [ ] Pronunciation annotator works offline
- [ ] Previously viewed content cached
- [ ] Offline page appears for uncached content

**Performance:**
- [ ] First visit: <5 seconds load
- [ ] Return visits: <1 second load
- [ ] Instant loading from cache
- [ ] Lighthouse PWA score: 90-100%

**User Experience:**
- [ ] Smooth install process
- [ ] Online/offline transitions seamless
- [ ] Update notifications appear
- [ ] App feels native, not web

---

## Next Steps After Testing

Once all tests pass:

1. ✅ **Document Issues** - Note any problems found
2. ✅ **Fix Issues** - Update code as needed
3. ✅ **Re-test** - Verify fixes work
4. ✅ **Deploy to Production** - Push final version
5. ✅ **Monitor** - Track install rates, errors
6. ✅ **Iterate** - Improve based on user feedback

---

## Testing Tools Summary

**Required:**
- Chrome DevTools (Application, Network, Console tabs)
- Android phone with Chrome (for mobile testing)
- iPhone with Safari (optional, for iOS testing)

**Optional:**
- Lighthouse (PWA audit)
- Multiple browsers (Edge, Firefox, Samsung Internet)
- Multiple devices (tablets, older phones)

**Recommended:**
- Real devices > Emulators
- Multiple network conditions
- Fresh browser sessions (incognito)

---

## Questions?

**Q: How often should I test?**
A: After every significant change, and before each deployment.

**Q: Do I need to test on every device?**
A: Test on at least one Android and one iOS device. Desktop optional.

**Q: What if something breaks?**
A: Check Console for errors, verify files deployed correctly, clear cache and retry.

**Q: How do I test updates?**
A: Make change, deploy, open installed app, should see "New version available".

---

**Ready to test?** Start with local testing, then deploy and test on real devices! 🧪
