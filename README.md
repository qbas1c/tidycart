# TidyCart — website deployment

This is the static-website version of TidyCart, ready for GitHub Pages. It uses Firebase
Realtime Database for real cross-device sync (same setup as your QR attendance app), instead of
Claude's chat-only storage API.

## 1. Set up Firebase (skip if you already did this for the mobile app build)

1. [console.firebase.google.com](https://console.firebase.google.com) → **Add project**.
2. **Build → Realtime Database → Create Database** → start in test mode for now.
3. **Build → Authentication → Sign-in method → Anonymous → Enable**.
4. **Project settings → Your apps → Web (`</>`) icon** → register an app → copy the config shown.
5. Paste those values into `firebase-config.js` in this folder, replacing the `REPLACE_ME`
   placeholders (including `databaseURL` from the Realtime Database page).
6. Once it's working, tighten the security rules — see the full README in the mobile-app
   project for the recommended rules, or ask me and I'll walk through it.

## 2. Create the GitHub repo

1. Go to [github.com/new](https://github.com/new) → name it e.g. `tidycart` → **Create repository**
   (public, so Pages can serve it for free).

## 3. Push these files to it

From this folder, in a terminal:

```bash
git init
git add .
git commit -m "TidyCart website"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/tidycart.git
git push -u origin main
```

(No local git set up? You can also just drag-and-drop these 4 files into the empty repo on
github.com via **Add file → Upload files** in the browser — no terminal needed.)

## 4. Turn on GitHub Pages

1. In your repo on GitHub: **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. **Branch**: `main`, folder `/ (root)` → **Save**.
4. Wait about a minute, then refresh — GitHub shows your live URL, something like:
   `https://YOUR-USERNAME.github.io/tidycart/`

## 5. Test it

Open the URL on your phone and on your computer at the same time, add an item on one, and
confirm it shows up on the other within a couple seconds. If nothing syncs, double check
`firebase-config.js` was actually pushed with your real values (not the `REPLACE_ME`
placeholders) and that Anonymous auth is enabled in Firebase.

## Optional: custom domain

Since you've already done this for your QR attendance project — same idea here: add a `CNAME`
file to this repo with your domain, then point a DNS `CNAME` record at
`YOUR-USERNAME.github.io`. GitHub's Pages settings page will show you the exact record to add
once you type your domain into the **Custom domain** field.

## Note on this being a public repo

Anything in a public GitHub repo is visible to anyone — including `firebase-config.js`. That's
normal and expected for Firebase web apps (the config isn't a secret key, it just identifies
your project), but it does mean your Realtime Database security rules are what actually protects
your data, not keeping the config hidden. Don't skip tightening those rules before sharing the
link widely.
