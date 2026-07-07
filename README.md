<div align="center">

# Khadija Zahra — Personal Portfolio

**A dynamic, bilingual portfolio with a built-in CMS — no frameworks, no build step.**

[**Live Site**](https://personal-portfolio-qqyy.vercel.app) · [Report a Bug](../../issues)

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?logo=firebase&logoColor=black)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-000000?logo=vercel)

</div>

---

## ✨ Highlights

- **Bilingual animated hero** — the name typewrites in English and Urdu (خدیجہ زہرا) with rotating role titles
- **Built-in admin panel (mini CMS)** — every word, project, skill, and image on the site is editable through a secure in-browser panel; content is stored in Cloud Firestore and updates live for all visitors with zero redeploys
- **Photo upload** — profile picture can be changed from the admin panel; images are auto-resized and compressed client-side before storage
- **Theming** — light/dark mode plus switchable color palettes (Bluish Neon / Plasma Violet), remembered per visitor
- **Real contact form** — messages are delivered to email via FormSubmit, no backend server required
- **Performance-minded loading** — content is cached locally (stale-while-revalidate), so repeat visits render instantly with a graceful first-load state
- **Custom SVG project artwork** — hand-built illustrated covers (~2 KB each)
- **Fully responsive** — from small phones to wide desktops, including the admin panel

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5, CSS3 (custom properties/design tokens), JavaScript (ES6+) |
| Content & Auth | Firebase — Cloud Firestore + Email/Password Authentication |
| Contact delivery | FormSubmit (AJAX) |
| Icons & Fonts | Lucide Icons, Google Fonts (Outfit, Inter, Noto Nastaliq Urdu) |
| Hosting & CI | Vercel — auto-deploys on every push to `main` |

No frameworks, no bundlers, no build step — clone and open `index.html`.

## 🧠 Architecture

```
index.html          Layout skeleton (content-free)
style.css           Design system: tokens, themes, palettes, responsive rules
script.js           Rendering engine, animations, admin panel, Firebase sync
data.js             Default content (fallback when Firestore is unreachable)
firebase-config.js  Firebase project keys
assets/             Profile photo + SVG project covers
```

**Content flow:** the site renders from a single content object. On load it paints instantly from a local cache, then silently refreshes from Firestore and re-renders only if something changed. Content edits happen in the admin panel and publish straight to Firestore — code deploys are only needed for design changes.

**Security model:** Firestore rules allow public reads but restrict writes to authenticated admin accounts only. The web config keys in this repo are public identifiers by design — write access is protected by Firebase Authentication and server-side security rules, not by secrecy.

```
match /site/{doc} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

## 🚀 Run Locally

```bash
git clone <this-repo>
cd <repo-folder>
# open index.html in a browser — that's it
```

Without Firebase configured, the site runs entirely from `data.js`.

## 🔧 Use This as Your Own Portfolio

1. Fork/clone the repo and edit `data.js` with your own content (or use the admin panel's export)
2. Create a free [Firebase](https://console.firebase.google.com) project → enable **Email/Password auth** (add yourself as a user) and **Firestore** (with the rules above)
3. Paste your web app config into `firebase-config.js`
4. Deploy the folder to Vercel/Netlify/GitHub Pages and add your domain under Firebase → Authentication → **Authorized domains**

## 📸 Sections

Hero (bilingual typewriter) · Stats · About · Experience & Education timeline · Filterable Projects · Skills · Contact

## 👩‍💻 About Me

Final-year BS Software Engineering student at **PUCIT, University of the Punjab**, and Full Stack Intern at **Musketeers Tech** — working across ASP.NET Core, machine learning, and software quality engineering.

📫 **khadijazahra153@gmail.com** · [GitHub](https://github.com/Khadija-Zahra335)

---

<div align="center">
<sub>Designed and built with vanilla web technologies — proving you don't need a framework to ship something dynamic.</sub>
</div>
