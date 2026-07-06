/* ==========================================================================
   PORTFOLIO SCRIPT — Khadija Zahra
   - Renders all content from SITE_DATA (Firestore if connected, else data.js)
   - Bilingual name typewriter (English + Urdu) + rotating roles typewriter
   - Experience timeline, chip-based skills, light/dark theme toggle
   - Admin panel: Ctrl+Shift+A, 5 logo taps, or #admin
     Live mode  -> Firebase email login + "forgot password" reset email
     Export mode -> passcode gate + downloads updated data.js
   ========================================================================== */

let SITE_DATA = JSON.parse(JSON.stringify(DEFAULT_DATA));
let db = null;
let auth = null;
let firebaseEnabled = false;
let passcodeUnlocked = false;

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

const $ = (id) => document.getElementById(id);

// ==========================================================================
// Firebase bootstrap (safe no-op until configured)
// ==========================================================================
function initFirebase() {
  try {
    if (typeof FIREBASE_CONFIG === "undefined") return;
    if (!FIREBASE_CONFIG.apiKey || FIREBASE_CONFIG.apiKey.startsWith("PASTE_")) return;
    firebase.initializeApp(FIREBASE_CONFIG);
    db = firebase.firestore();
    auth = firebase.auth();
    firebaseEnabled = true;
  } catch (e) {
    console.warn("Firebase init skipped:", e);
  }
}

async function loadContent() {
  if (!firebaseEnabled) return;
  try {
    const snap = await db.collection("site").doc("content").get();
    if (snap.exists) SITE_DATA = Object.assign({}, DEFAULT_DATA, snap.data());
  } catch (e) {
    console.warn("Using default data (Firestore read failed):", e);
  }
}

// ==========================================================================
// Theme toggle (light / dark, persisted)
// ==========================================================================
function initTheme() {
  const saved = localStorage.getItem("kz-theme");
  if (saved === "light") document.body.classList.add("light");
  updateThemeIcon();
  $("theme-toggle").addEventListener("click", () => {
    document.body.classList.toggle("light");
    localStorage.setItem("kz-theme", document.body.classList.contains("light") ? "light" : "dark");
    updateThemeIcon();
  });
}
// ==========================================================================
// Color palette switcher (persisted; admin can set the default)
// ==========================================================================
const PALETTES = [
  { key: "neon",      name: "Bluish Neon" },
  { key: "porcelain", name: "Porcelain Blue" },
  { key: "lavender",  name: "Lavender Veil" },
  { key: "plasma",    name: "Plasma Violet" }
];

function applyPalette(key) {
  const valid = PALETTES.some(p => p.key === key) ? key : "neon";
  if (valid === "neon") document.body.removeAttribute("data-palette");
  else document.body.setAttribute("data-palette", valid);
}

function initPalette() {
  const saved = localStorage.getItem("kz-palette");
  const fallback = (SITE_DATA.settings && SITE_DATA.settings.defaultPalette) || "neon";
  applyPalette(saved || fallback);

  $("palette-toggle").addEventListener("click", () => {
    const current = document.body.getAttribute("data-palette") || "neon";
    const idx = PALETTES.findIndex(p => p.key === current);
    const next = PALETTES[(idx + 1) % PALETTES.length];
    applyPalette(next.key);
    localStorage.setItem("kz-palette", next.key);
    showToast("Color theme: " + next.name);
  });
}

function updateThemeIcon() {
  const isLight = document.body.classList.contains("light");
  $("theme-toggle").innerHTML = `<i data-lucide="${isLight ? "moon" : "sun"}"></i>`;
  lucide.createIcons();
}

// ==========================================================================
// Render functions
// ==========================================================================
function renderAll() {
  const d = SITE_DATA;

  // Header / hero
  $("logo-first").textContent = d.profile.logoFirst || "";
  $("logo-last").textContent = d.profile.logoLast || "";
  $("badge-text").textContent = d.profile.badge || "";
  $("hero-description").textContent = d.profile.heroDescription || "";
  const avatar = $("avatar-img");
  if (d.profile.avatar) avatar.src = d.profile.avatar;
  avatar.alt = (d.profile.names && d.profile.names[0] ? d.profile.names[0] : "Portrait");
  document.title = (d.profile.names && d.profile.names[0] ? d.profile.names[0] : "Portfolio") + " | Full Stack Developer";

  // Stats
  $("stats-grid").innerHTML = d.stats.map(s => `
    <div class="stat-card">
      <h3 class="stat-number" data-target="${Number(s.value) || 0}" data-suffix="${esc(s.suffix || "")}">0</h3>
      <p class="stat-label">${esc(s.label)}</p>
    </div>`).join("");

  // About
  $("about-subtitle").textContent = d.about.subtitle || "";
  $("about-title").textContent = d.about.title || "";
  $("about-paragraphs").innerHTML = d.about.paragraphs.map(p => `<p>${esc(p)}</p>`).join("");
  $("about-location").textContent = d.about.location || "";
  $("about-email").textContent = d.about.email || "";
  $("about-cards").innerHTML = d.about.features.map(f => `
    <div class="about-feature-card">
      <div class="card-icon-wrapper">
        <i data-lucide="${esc(f.icon || "star")}" class="card-icon"></i>
      </div>
      <h3>${esc(f.title)}</h3>
      <p>${esc(f.text)}</p>
    </div>`).join("");

  // Experience timeline
  $("experience-timeline").innerHTML = (d.experience || []).map(x => `
    <div class="timeline-item">
      <div class="timeline-head">
        <span class="timeline-role">${esc(x.role)}</span>
        <span class="timeline-period">${esc(x.period)}</span>
      </div>
      <div class="timeline-company">${esc(x.company)}</div>
      <p>${esc(x.description)}</p>
    </div>`).join("");

  // Project filters
  $("filter-container").innerHTML =
    `<button class="filter-btn active" data-filter="all">All</button>` +
    d.categories.map(c =>
      `<button class="filter-btn" data-filter="${esc(c.key)}">${esc(c.label)}</button>`).join("");

  // Projects
  const catLabel = (key) => {
    const c = d.categories.find(c => c.key === key);
    return c ? c.label : key;
  };
  $("projects-grid").innerHTML = d.projects.map(p => {
    const g = [1, 2, 3, 4].includes(Number(p.gradient)) ? Number(p.gradient) : 1;
    const visual = p.image
      ? `<img src="${esc(p.image)}" alt="${esc(p.title)}">`
      : `<div class="custom-card-bg bg-gradient-${g}">
           <i data-lucide="${esc(p.icon || "sparkles")}" class="bg-icon"></i>
         </div>`;
    const links = [];
    if (p.codeLink && p.codeLink !== "#") links.push(
      `<a href="${esc(p.codeLink)}" target="_blank" rel="noopener" class="project-link" aria-label="Code Repository">
         <i data-lucide="github"></i> Code</a>`);
    if (p.demoLink && p.demoLink !== "#") links.push(
      `<a href="${esc(p.demoLink)}" target="_blank" rel="noopener" class="project-link" aria-label="Live Demo">
         <i data-lucide="external-link"></i> Live Demo</a>`);
    return `
    <div class="project-card" data-category="${esc(p.category)}">
      <div class="project-image">
        ${visual}
        <div class="project-overlay">
          <span class="project-tag">${esc(catLabel(p.category))}</span>
        </div>
      </div>
      <div class="project-content">
        <h3>${esc(p.title)}</h3>
        <p>${esc(p.description)}</p>
        <div class="tech-tags">${(p.tags || []).map(t => `<span>${esc(t)}</span>`).join("")}</div>
        <div class="project-links">${links.join("")}</div>
      </div>
    </div>`;
  }).join("");

  // Skills — chip cards, no percentage bars
  $("skills-grid").innerHTML = d.skills.map(group => `
    <div class="skill-chip-card">
      <div class="skill-chip-head">
        <span class="skill-chip-icon"><i data-lucide="${esc(group.icon || "star")}"></i></span>
        <h3>${esc(group.category)}</h3>
      </div>
      <div class="skill-chips">
        ${(group.items || []).map(item => `<span class="skill-chip">${esc(item)}</span>`).join("")}
      </div>
    </div>`).join("");

  // Contact + footer
  $("contact-heading").textContent = d.contact.heading || "";
  $("contact-text").textContent = d.contact.text || "";
  $("social-links").innerHTML = d.contact.socials.map(s => `
    <a href="${esc(s.url || "#")}" target="_blank" rel="noopener" class="social-icon-btn" aria-label="${esc(s.icon)}">
      <i data-lucide="${esc(s.icon)}"></i>
    </a>`).join("");
  $("footer-copy").textContent = d.footer.copyright || "";

  lucide.createIcons();
}

// ==========================================================================
// Typewriter factory (used for both the name and the roles)
// ==========================================================================
function makeTypewriter(el, words, opts = {}) {
  if (!el || !words || !words.length) return;
  const typeSpeed = opts.typeSpeed || 100;
  const deleteSpeed = opts.deleteSpeed || 50;
  const holdTime = opts.holdTime || 2200;
  const gapTime = opts.gapTime || 500;
  let wordIndex = 0, charIndex = 0, isDeleting = false;

  function tick() {
    const currentWord = words[wordIndex];
    let delay;
    if (isDeleting) {
      charIndex--;
      el.textContent = currentWord.substring(0, charIndex);
      delay = deleteSpeed;
    } else {
      charIndex++;
      el.textContent = currentWord.substring(0, charIndex);
      delay = typeSpeed;
    }
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      delay = holdTime;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      delay = gapTime;
    }
    setTimeout(tick, delay);
  }
  tick();
}

// ==========================================================================
// Site behaviors (initialized AFTER rendering)
// ==========================================================================
function initBehaviors() {
  const header = document.querySelector(".header");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");

    let current = "";
    sections.forEach(section => {
      if (window.scrollY >= (section.offsetTop - 150)) current = section.getAttribute("id");
    });
    const updateActiveLink = (links) => {
      links.forEach(link => {
        link.classList.remove("active");
        if (link.getAttribute("href") === `#${current}`) link.classList.add("active");
      });
    };
    updateActiveLink(navLinks);
    updateActiveLink(mobileLinks);
  });

  // Mobile nav
  const menuToggle = $("menu-toggle");
  const mobileNav = $("mobile-nav");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
      const isOpen = mobileNav.classList.contains("open");
      menuToggle.innerHTML = `<i data-lucide="${isOpen ? "x" : "menu"}"></i>`;
      lucide.createIcons();
    });
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        menuToggle.innerHTML = `<i data-lucide="menu"></i>`;
        lucide.createIcons();
      });
    });
  }

  // Dual typewriters: bilingual name (slower, elegant) + rotating roles
  makeTypewriter($("hero-name-type"), SITE_DATA.profile.names, {
    typeSpeed: 120, deleteSpeed: 60, holdTime: 3000, gapTime: 600
  });
  makeTypewriter($("typewriter"), SITE_DATA.profile.roles, {
    typeSpeed: 90, deleteSpeed: 45, holdTime: 2000, gapTime: 450
  });

  // Scroll reveal
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  document.querySelectorAll(".scroll-reveal").forEach(el => revealObserver.observe(el));

  // Stats counters
  const statNumbers = document.querySelectorAll(".stat-number");
  const animateStats = (statEl) => {
    const target = parseInt(statEl.getAttribute("data-target"), 10);
    const suffix = statEl.getAttribute("data-suffix") || "";
    const stepTime = 30;
    const increment = target / (2000 / stepTime);
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        statEl.textContent = target + suffix;
        clearInterval(timer);
      } else {
        statEl.textContent = Math.floor(current);
      }
    }, stepTime);
  };
  const statsSection = document.querySelector(".stats-section");
  if (statsSection) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          statNumbers.forEach(statEl => animateStats(statEl));
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statsObserver.observe(statsSection);
  }

  initFilterRebind();

  // Contact form + toast
  const contactForm = $("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = $("name");
      const userName = nameInput ? nameInput.value : "there";
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = `Sending... <i data-lucide="loader" class="btn-icon animate-spin"></i>`;
      lucide.createIcons();
      setTimeout(() => {
        showToast(`Thank you, ${userName}! Your message was sent successfully.`, "success");
        contactForm.reset();
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
        lucide.createIcons();
      }, 1200);
    });
  }
}

function initFilterRebind() {
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  filterBtns.forEach(btn => {
    btn.onclick = () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filterValue = btn.getAttribute("data-filter");
      projectCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "flex";
          setTimeout(() => { card.style.opacity = "1"; card.style.transform = "scale(1)"; }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.9)";
          setTimeout(() => { card.style.display = "none"; }, 300);
        }
      });
    };
  });
}

function showToast(message, type = "success") {
  const toastContainer = $("toast-container");
  if (!toastContainer) return;
  const toast = document.createElement("div");
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span class="toast-icon"><i data-lucide="check-circle-2"></i></span>
    <span>${esc(message)}</span>`;
  toastContainer.appendChild(toast);
  lucide.createIcons();
  setTimeout(() => {
    toast.classList.add("removing");
    toast.addEventListener("animationend", () => toast.remove());
  }, 4000);
}

// ==========================================================================
// ADMIN PANEL
// ==========================================================================
let workingData = null;
let activeTab = "profile";

function openAdmin() {
  workingData = JSON.parse(JSON.stringify(SITE_DATA));
  $("admin-overlay").classList.add("open");
  $("admin-mode-badge").textContent = firebaseEnabled ? "Live mode" : "Export mode";
  $("admin-passcode").style.display = "none";
  $("admin-login").style.display = "none";
  $("admin-editor").style.display = "none";

  if (firebaseEnabled) {
    if (auth.currentUser) showEditor();
    else $("admin-login").style.display = "block";
  } else {
    if (passcodeUnlocked) showEditor();
    else $("admin-passcode").style.display = "block";
  }
  lucide.createIcons();
}

function closeAdmin() {
  $("admin-overlay").classList.remove("open");
  if (location.hash === "#admin") history.replaceState(null, "", " ");
}

function showEditor() {
  $("admin-passcode").style.display = "none";
  $("admin-login").style.display = "none";
  $("admin-editor").style.display = "block";
  $("admin-save").style.display = firebaseEnabled ? "inline-flex" : "none";
  $("admin-signout").style.display = firebaseEnabled ? "inline-flex" : "none";
  renderTab(activeTab);
}

// ---- Form building helper ----
function field(label, value, path, type = "text") {
  if (type === "textarea") {
    return `<div class="admin-field"><label>${esc(label)}</label>
      <textarea data-path="${esc(path)}">${esc(value)}</textarea></div>`;
  }
  return `<div class="admin-field"><label>${esc(label)}</label>
    <input type="${type}" data-path="${esc(path)}" value="${esc(value)}"></div>`;
}

function renderTab(tab) {
  activeTab = tab;
  document.querySelectorAll(".admin-tab").forEach(b =>
    b.classList.toggle("active", b.dataset.tab === tab));
  const c = $("admin-tab-content");
  const d = workingData;

  if (tab === "profile") {
    c.innerHTML =
      field("Names for the hero typewriter (one per line — English, Urdu, any script)", d.profile.names.join("\n"), "profile.names", "textarea") +
      field("Logo — gradient part", d.profile.logoFirst, "profile.logoFirst") +
      field("Logo — plain part", d.profile.logoLast, "profile.logoLast") +
      field("Hero badge text", d.profile.badge, "profile.badge") +
      field("Rotating roles (one per line)", d.profile.roles.join("\n"), "profile.roles", "textarea") +
      field("Hero description / bio", d.profile.heroDescription, "profile.heroDescription", "textarea") +
      field("Avatar image URL / path", d.profile.avatar, "profile.avatar");
  }

  if (tab === "about") {
    c.innerHTML =
      field("Section subtitle", d.about.subtitle, "about.subtitle") +
      field("Section title", d.about.title, "about.title") +
      field("Paragraphs (one per line)", d.about.paragraphs.join("\n"), "about.paragraphs", "textarea") +
      field("Location", d.about.location, "about.location") +
      field("Email", d.about.email, "about.email") +
      d.about.features.map((f, i) => `
        <div class="admin-item-card">
          <div class="admin-item-head"><span>Feature card ${i + 1}</span></div>
          <div class="admin-row">
            ${field("Icon (lucide name: layers, brain-circuit, rocket…)", f.icon, `about.features.${i}.icon`)}
            ${field("Title", f.title, `about.features.${i}.title`)}
          </div>
          ${field("Text", f.text, `about.features.${i}.text`, "textarea")}
        </div>`).join("");
  }

  if (tab === "experience") {
    c.innerHTML = (d.experience || []).map((x, i) => `
      <div class="admin-item-card">
        <div class="admin-item-head"><span>Entry ${i + 1}</span>
          <button class="admin-remove" data-remove="experience.${i}">Remove</button></div>
        <div class="admin-row">
          ${field("Role / degree", x.role, `experience.${i}.role`)}
          ${field("Period (e.g. 2026 — Present)", x.period, `experience.${i}.period`)}
        </div>
        ${field("Company / institution", x.company, `experience.${i}.company`)}
        ${field("Description", x.description, `experience.${i}.description`, "textarea")}
      </div>`).join("") +
      `<button class="admin-add" data-add="experience">+ Add experience entry</button>`;
  }

  if (tab === "stats") {
    c.innerHTML = d.stats.map((s, i) => `
      <div class="admin-item-card">
        <div class="admin-item-head"><span>Stat ${i + 1}</span>
          <button class="admin-remove" data-remove="stats.${i}">Remove</button></div>
        <div class="admin-row">
          ${field("Number", s.value, `stats.${i}.value`, "number")}
          ${field("Suffix (+, %, K…)", s.suffix, `stats.${i}.suffix`)}
        </div>
        ${field("Label", s.label, `stats.${i}.label`)}
      </div>`).join("") +
      `<button class="admin-add" data-add="stat">+ Add stat</button>`;
  }

  if (tab === "projects") {
    c.innerHTML =
      `<div class="admin-item-card">
        <div class="admin-item-head"><span>Filter categories</span></div>
        ${d.categories.map((cat, i) => `
          <div class="admin-row">
            ${field("Key (no spaces)", cat.key, `categories.${i}.key`)}
            ${field("Label", cat.label, `categories.${i}.label`)}
          </div>`).join("")}
        <button class="admin-add" data-add="category">+ Add category</button>
      </div>` +
      d.projects.map((p, i) => `
      <div class="admin-item-card">
        <div class="admin-item-head"><span>Project ${i + 1}</span>
          <button class="admin-remove" data-remove="projects.${i}">Remove</button></div>
        ${field("Title", p.title, `projects.${i}.title`)}
        ${field("Description", p.description, `projects.${i}.description`, "textarea")}
        <div class="admin-row">
          <div class="admin-field"><label>Category</label>
            <select data-path="projects.${i}.category">
              ${d.categories.map(cat =>
                `<option value="${esc(cat.key)}" ${cat.key === p.category ? "selected" : ""}>${esc(cat.label)}</option>`).join("")}
            </select></div>
          ${field("Tech tags (comma separated)", (p.tags || []).join(", "), `projects.${i}.tags`)}
        </div>
        <div class="admin-row">
          ${field("Image URL (empty = styled icon cover)", p.image, `projects.${i}.image`)}
          ${field("Icon (lucide name)", p.icon, `projects.${i}.icon`)}
        </div>
        <div class="admin-row">
          <div class="admin-field"><label>Cover style (when no image)</label>
            <select data-path="projects.${i}.gradient">
              ${[1, 2, 3, 4].map(n =>
                `<option value="${n}" ${Number(p.gradient) === n ? "selected" : ""}>Gradient ${n}</option>`).join("")}
            </select></div>
          <div></div>
        </div>
        <div class="admin-row">
          ${field("Code link", p.codeLink, `projects.${i}.codeLink`)}
          ${field("Demo link", p.demoLink, `projects.${i}.demoLink`)}
        </div>
      </div>`).join("") +
      `<button class="admin-add" data-add="project">+ Add project</button>`;
  }

  if (tab === "skills") {
    c.innerHTML = d.skills.map((g, gi) => `
      <div class="admin-item-card">
        <div class="admin-item-head"><span>Group ${gi + 1}</span>
          <button class="admin-remove" data-remove="skills.${gi}">Remove group</button></div>
        <div class="admin-row">
          ${field("Group title", g.category, `skills.${gi}.category`)}
          ${field("Icon (lucide name)", g.icon, `skills.${gi}.icon`)}
        </div>
        ${field("Skills (comma separated)", (g.items || []).join(", "), `skills.${gi}.items`, "textarea")}
      </div>`).join("") +
      `<button class="admin-add" data-add="skill-group">+ Add group</button>`;
  }

  if (tab === "contact") {
    c.innerHTML =
      field("Panel heading", d.contact.heading, "contact.heading") +
      field("Panel text", d.contact.text, "contact.text", "textarea") +
      d.contact.socials.map((s, i) => `
        <div class="admin-item-card">
          <div class="admin-item-head"><span>Social ${i + 1}</span>
            <button class="admin-remove" data-remove="contact.socials.${i}">Remove</button></div>
          <div class="admin-row">
            ${field("Icon (github, linkedin, mail, instagram…)", s.icon, `contact.socials.${i}.icon`)}
            ${field("URL", s.url, `contact.socials.${i}.url`)}
          </div>
        </div>`).join("") +
      `<button class="admin-add" data-add="social">+ Add social link</button>` +
      field("Footer copyright", d.footer.copyright, "footer.copyright");
  }

  if (tab === "settings") {
    const currentPalette = (d.settings && d.settings.defaultPalette) || "neon";
    c.innerHTML =
      `<div class="admin-field"><label>Default color theme (for new visitors)</label>
        <select data-path="settings.defaultPalette">
          ${PALETTES.map(p =>
            `<option value="${p.key}" ${p.key === currentPalette ? "selected" : ""}>${p.name}</option>`).join("")}
        </select></div>` +
      field("Admin passcode (Export mode gate)", d.settings ? d.settings.passcode : "", "settings.passcode") +
      `<p class="admin-note">This passcode protects the panel before Firebase is connected. It is stored inside the site's data, so treat it as basic protection only.
      For real security — account login + password reset link sent to your email — connect Firebase (README.md, ~10 minutes).
      In Live mode, your password is managed by Firebase and is never stored in the site files.</p>`;
  }
}

// Read every input in the current tab back into workingData
function collectTab() {
  document.querySelectorAll("#admin-tab-content [data-path]").forEach(el => {
    const path = el.dataset.path.split(".");
    let ref = workingData;
    for (let i = 0; i < path.length - 1; i++) ref = ref[path[i]];
    const key = path[path.length - 1];
    let val = el.value;
    const lineFields = ["names", "roles", "paragraphs"];
    const commaFields = ["tags", "items"];
    if (lineFields.includes(key)) val = val.split("\n").map(s => s.trim()).filter(Boolean);
    else if (commaFields.includes(key)) val = val.split(",").map(s => s.trim()).filter(Boolean);
    else if (key === "gradient") val = Number(val) || 1;
    else if (el.type === "number") val = Number(val) || 0;
    ref[key] = val;
  });
}

function adminMutate(fn) {
  collectTab();
  fn();
  renderTab(activeTab);
}

function applyWorking() {
  SITE_DATA = JSON.parse(JSON.stringify(workingData));
  renderAll();
  initFilterRebind();
}

function initAdmin() {
  // Open triggers
  document.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === "a") {
      e.preventDefault();
      openAdmin();
    }
  });
  let logoTaps = 0, tapTimer = null;
  $("site-logo").addEventListener("click", () => {
    logoTaps++;
    clearTimeout(tapTimer);
    tapTimer = setTimeout(() => { logoTaps = 0; }, 1500);
    if (logoTaps >= 5) { logoTaps = 0; openAdmin(); }
  });
  if (location.hash === "#admin") openAdmin();

  $("admin-close").addEventListener("click", closeAdmin);
  $("admin-overlay").addEventListener("click", (e) => {
    if (e.target === $("admin-overlay")) closeAdmin();
  });

  // Passcode gate (Export mode)
  $("admin-passcode-btn").addEventListener("click", () => {
    const entered = $("admin-passcode-input").value;
    const expected = (SITE_DATA.settings && SITE_DATA.settings.passcode) || "";
    if (entered === expected && expected !== "") {
      passcodeUnlocked = true;
      $("admin-passcode-input").value = "";
      $("admin-passcode-error").textContent = "";
      showEditor();
    } else {
      $("admin-passcode-error").textContent = "Incorrect passcode.";
    }
  });
  $("admin-passcode-input").addEventListener("keydown", (e) => {
    if (e.key === "Enter") $("admin-passcode-btn").click();
  });

  // Firebase login
  $("admin-login-btn").addEventListener("click", async () => {
    const email = $("admin-email").value.trim();
    const pass = $("admin-password").value;
    $("admin-login-error").textContent = "";
    try {
      await auth.signInWithEmailAndPassword(email, pass);
      showEditor();
      showToast("Signed in — admin mode active.");
    } catch (err) {
      $("admin-login-error").textContent = "Sign in failed: " + (err.message || err.code);
    }
  });

  // Forgot password — sends reset link to the admin email
  $("admin-forgot").addEventListener("click", async () => {
    const email = $("admin-email").value.trim();
    if (!email) {
      $("admin-login-error").textContent = "Type your email above first, then click reset.";
      return;
    }
    try {
      await auth.sendPasswordResetEmail(email);
      $("admin-login-error").textContent = "Reset link sent! Check your inbox (" + email + ").";
      $("admin-login-error").classList.add("ok");
    } catch (err) {
      $("admin-login-error").classList.remove("ok");
      $("admin-login-error").textContent = "Could not send reset: " + (err.message || err.code);
    }
  });

  // Sign out
  $("admin-signout").addEventListener("click", async () => {
    if (auth) await auth.signOut();
    closeAdmin();
    showToast("Signed out.");
  });

  // Tabs
  $("admin-tabs").addEventListener("click", (e) => {
    const btn = e.target.closest(".admin-tab");
    if (!btn) return;
    collectTab();
    renderTab(btn.dataset.tab);
  });

  // Add / remove list items
  $("admin-tab-content").addEventListener("click", (e) => {
    const removeBtn = e.target.closest("[data-remove]");
    if (removeBtn) {
      const path = removeBtn.dataset.remove.split(".");
      adminMutate(() => {
        let ref = workingData;
        for (let i = 0; i < path.length - 2; i++) ref = ref[path[i]];
        ref[path[path.length - 2]].splice(Number(path[path.length - 1]), 1);
      });
      return;
    }
    const addBtn = e.target.closest("[data-add]");
    if (!addBtn) return;
    const kind = addBtn.dataset.add;
    adminMutate(() => {
      if (kind === "stat") workingData.stats.push({ value: 0, suffix: "+", label: "New Stat" });
      if (kind === "category") workingData.categories.push({ key: "new", label: "New" });
      if (kind === "experience") workingData.experience.push({
        role: "New Role", company: "Company / Institution", period: "2026 — Present",
        description: "Describe this experience."
      });
      if (kind === "project") workingData.projects.push({
        title: "New Project", description: "Describe this project.",
        category: workingData.categories[0] ? workingData.categories[0].key : "general",
        tags: [], image: "", icon: "sparkles", gradient: 1, codeLink: "", demoLink: ""
      });
      if (kind === "skill-group") workingData.skills.push({ icon: "star", category: "New Group", items: ["Skill one", "Skill two"] });
      if (kind === "social") workingData.contact.socials.push({ icon: "link", url: "" });
    });
  });

  // Save to Firestore (live)
  $("admin-save").addEventListener("click", async () => {
    collectTab();
    const status = $("admin-save-status");
    status.textContent = "Saving…";
    status.classList.remove("ok");
    try {
      await db.collection("site").doc("content").set(workingData);
      applyWorking();
      status.textContent = "Saved! The live site is updated for all visitors.";
      status.classList.add("ok");
      showToast("Content published live.");
    } catch (err) {
      status.textContent = "Save failed: " + (err.message || err.code);
    }
  });

  // Export data.js (works with or without Firebase)
  $("admin-export").addEventListener("click", () => {
    collectTab();
    applyWorking();
    const file = "const DEFAULT_DATA = " + JSON.stringify(workingData, null, 2) + ";\n";
    const blob = new Blob([file], { type: "text/javascript" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "data.js";
    a.click();
    URL.revokeObjectURL(a.href);
    showToast("data.js downloaded — replace it on your host to publish.");
  });
}

// ==========================================================================
// Boot
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  initFirebase();
  await loadContent();
  initTheme();
  initPalette();
  renderAll();
  initBehaviors();
  initAdmin();
});
