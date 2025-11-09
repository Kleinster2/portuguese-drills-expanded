# PWA Quick Start - TL;DR

**Goal:** Make Portuguese Drills installable on mobile devices
**Time:** 20-30 minutes
**Status:** ✅ All code ready, just need to deploy

---

## 3-Step Deployment

### Step 1: Generate Icons (5 min)

Open this in your browser:
```
file:///C:/Users/klein/CascadeProjects/portuguese-drills-expanded/generate-icons.html
```

Click "Download All Icons" → Wait for 8 PNG files

Create folder and move icons:
```bash
mkdir /c/Users/klein/CascadeProjects/portuguese-drills-expanded/icons
# Move all downloaded icon-*.png files to /icons/
```

---

### Step 2: Update index.html (2 min)

**Location 1 - After `<title>` tag in `<head>` section:**

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

**Location 2 - Before `</body>` tag:**

```html
    <!-- PWA Setup -->
    <script src="/pwa-setup.js"></script>
</body>
```

---

### Step 3: Deploy (5 min)

```bash
cd /c/Users/klein/CascadeProjects/portuguese-drills-expanded

git add .
git commit -m "Add PWA support: installable app with offline mode"
npx wrangler pages deploy . --project-name=portuguese-drills-expanded
```

---

## Test on Your Phone

1. Open deployed URL on phone
2. Look for install banner (appears after ~3 seconds)
3. Tap "Install"
4. App icon appears on home screen
5. Open app → Full-screen experience!

**Test offline:**
- Turn on Airplane Mode
- App still works (cached content)
- Pronunciation annotator works offline

---

## Files Created

✅ `manifest.json` - App config
✅ `service-worker.js` - Offline engine
✅ `pwa-setup.js` - Install prompts
✅ `offline.html` - Offline page
✅ `generate-icons.html` - Icon generator

All files ready to deploy!

---

## What You Get

**Before:**
- Open browser → Type URL → Use site

**After:**
- Tap app icon → Instant full-screen app
- Works offline
- Loads in <1 second
- Feels like native app

---

## Troubleshooting

**Install prompt doesn't appear?**
- Check DevTools → Application → Manifest
- Clear localStorage: `localStorage.removeItem('pwa-banner-dismissed')`
- Try different browser

**Service worker not working?**
- DevTools → Application → Service Workers
- Check Console for [PWA] messages
- Hard reload: Ctrl+Shift+R

**App doesn't work offline?**
- Check DevTools → Application → Cache Storage
- Look for `portuguese-drills-v1` cache
- Verify files are cached

---

## What's Next

**Week 1** (Current): PWA ✅
**Week 2**: Interactive lessons
**Week 3**: Vocabulary flashcards
**Week 4**: Progress tracking

---

Need detailed instructions? See `PWA_INSTALLATION_GUIDE.md`
Want full overview? See `PWA_IMPLEMENTATION_SUMMARY.md`

**Ready to deploy!** 🚀
