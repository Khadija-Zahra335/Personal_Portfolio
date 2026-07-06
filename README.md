# Khadija Zahra — Portfolio with Admin Mode

Same layout and colors as your original files — now fully dynamic with a built-in admin panel.

## How content works

- All text, projects, skills, stats, and links live in **data.js** — never in the HTML.
- With Firebase connected, content lives in the cloud instead, and admin edits go live instantly for all visitors.
- Without Firebase, the admin panel runs in **Export mode**: you edit in the panel, click "Download data.js", and replace that one file on your host. No code changes ever.


## Firebase setup (one time, ~10 minutes, free)

1. Go to https://console.firebase.google.com → **Add project** (any name, disable Analytics).
2. In the project: click the **Web icon (</>)** → register app → copy the config object.
3. Paste those values into **firebase-config.js** (replacing the PASTE_ placeholders).
4. **Authentication** → Sign-in method → enable **Email/Password** → Users tab → **Add user** (your admin email + a strong password).
5. **Firestore Database** → Create database → Production mode → then go to **Rules** and paste:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /site/{doc} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

6. Publish the rules. Done — the admin panel now shows a login, and "Save to Live Site" publishes instantly.

> Security note: only accounts you manually add in Firebase Authentication can write. Visitors can only read.

## Hosting (free options)

- **Vercel / Netlify**: drag-and-drop the folder, done.
- **GitHub Pages**: push the folder to a repo → Settings → Pages → deploy from main.
- Add your `assets/` folder (avatar.png, project images) alongside these files, or use full image URLs in the admin panel instead.

## Files

| File | Purpose | Edit by hand? |
|---|---|---|
| index.html | Layout skeleton (your original design) | No |
| style.css | Your original theme + admin styles appended | No |
| script.js | Rendering, animations, admin system | No |
| data.js | Default content | Optional |
| firebase-config.js | Your Firebase keys | Once |

## Adding a project in the future

Open admin → Projects tab → **+ Add project** → fill title, description, category, tags, links → Save (or Download data.js and replace it). That's it — the filter tabs, cards, and animations all update automatically.

## New in this version

- Bilingual hero name typewriter (English + Urdu, editable in admin — one name per line)
- Rotating roles typewriter
- Experience & Education timeline section (fully editable)
- Skill chips instead of percentage bars (comma-separated lists in admin)
- Light/dark theme toggle (sun/moon button in the nav, remembered per visitor)
- 4 project cover styles + optional image URL per project
- Passcode gate (Export mode) and email password-reset (Live mode)

## Color themes

The palette button (next to the sun/moon toggle) cycles four color themes: Bluish Neon (default), Porcelain Blue, Lavender Veil, and Plasma Violet. Each visitor's choice is remembered on their device, each theme has its own tuned light mode, and the Settings tab in admin sets the default theme new visitors see first.
