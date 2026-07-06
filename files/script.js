/* ==========================================================================
   PORTFOLIO SCRIPT
   - Renders all content from SITE_DATA (Firebase Firestore if connected,
     otherwise DEFAULT_DATA from data.js)
   - Preserves original behaviors: typewriter, scrollspy, reveals, counters,
     progress bars, project filters, toasts
   - Admin panel: Ctrl+Shift+A, tapping the logo 5 times, or opening #admin
   ========================================================================== */

let SITE_DATA = JSON.parse(JSON.stringify(DEFAULT_DATA));
let db = null;
let auth = null;
let firebaseEnabled = false;

const esc = (s) => String(s == null ? "" : s)
  .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

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
    if (snap.exists) {
      SITE_DATA = Object.assign({}, DEFAULT_DATA, snap.data());
    }
  } catch (e) {
    console.warn("Using default data (Firestore read failed):", e);
  }
}

// ==========================================================================
// Render functions — inject SITE_DATA into the existing layout
// ==========================================================================
function renderAll() {
  const d = SITE_DATA;
  const fullName = [d.profile.firstName, d.profile.lastName].filter(Boolean).join(" ");

  // Header / hero
  document.getElementById("logo-first").textContent = d.profile.firstName || "";
  document.getElementById("logo-last").textContent = d.profile.lastName || "";
  document.getElementById("badge-text").textContent = d.profile.badge || "";
  document.getElementById("hero-name").textContent = fullName;
  document.getElementById("hero-description").textContent = d.profile.heroDescription || "";
  const avatar = document.getElementById("avatar-img");
  if (d.profile.avatar) avatar.src = d.profile.avatar;
  avatar.alt = fullName + " Portrait";
  document.title = fullName + " | Creative Full-Stack Developer";

  // Stats
  document.getElementById("stats-grid").innerHTML = d.stats.map(s => `
    <div class="stat-card">
      <h3 class="stat-number" data-target="${Number(s.value) || 0}" data-suffix="${esc(s.suffix || "")}">0</h3>
      <p class="stat-label">${esc(s.label)}</p>
    </div>`).join("");

  // About
  document.getElementById("about-subtitle").textContent = d.about.subtitle || "";
  document.getElementById("about-title").textContent = d.about.title || "";
  document.getElementById("about-paragraphs").innerHTML =
    d.about.paragraphs.map(p => `<p>${esc(p)}</p>`).join("");
  document.getElementById("about-location").textContent = d.about.location || "";
  document.getElementById("about-email").textContent = d.about.email || "";
  document.getElementById("about-cards").innerHTML = d.about.features.map(f => `
    <div class="about-feature-card">
      <div class="card-icon-wrapper">
        <i data-lucide="${esc(f.icon || "star")}" class="card-icon"></i>
      </div>
      <h3>${esc(f.title)}</h3>
      <p>${esc(f.text)}</p>
    </div>`).join("");

  // Project filters
  document.getElementById("filter-container").innerHTML =
    `<button class="filter-btn active" data-filter="all">All</button>` +
    d.categories.map(c =>
      `<button class="filter-btn" data-filter="${esc(c.key)}">${esc(c.label)}</button>`).join("");

  // Projects
  const catLabel = (key) => {
    const c = d.categories.find(c => c.key === key);
    return c ? c.label : key;
  };
  document.getElementById("projects-grid").innerHTML = d.projects.map(p => {
    const visual = p.image
      ? `<img src="${esc(p.image)}" alt="${esc(p.title)}">`
      : `<div class="custom-card-bg bg-gradient-${p.gradient === 2 ? 2 : 1}">
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

  // Skills
  document.getElementById("skills-grid").innerHTML = d.skills.map(group => `
    <div class="skills-category-card">
      <h3>${esc(group.category)}</h3>
      <ul class="skills-list">
        ${group.items.map(item => `
        <li>
          <div class="skill-info">
            <span>${esc(item.name)}</span>
            <span>${Number(item.level) || 0}%</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar" style="width: ${Number(item.level) || 0}%"></div>
          </div>
        </li>`).join("")}
      </ul>
    </div>`).join("");

  // Contact + footer
  document.getElementById("contact-heading").textContent = d.contact.heading || "";
  document.getElementById("contact-text").textContent = d.contact.text || "";
  document.getElementById("social-links").innerHTML = d.contact.socials.map(s => `
    <a href="${esc(s.url || "#")}" target="_blank" rel="noopener" class="social-icon-btn" aria-label="${esc(s.icon)}">
      <i data-lucide="${esc(s.icon)}"></i>
    </a>`).join("");
  document.getElementById("footer-copy").textContent = d.footer.copyright || "";

  if (typeof lucide !== "undefined") lucide.createIcons();
}

// ==========================================================================
// Original site behaviors (initialized AFTER rendering)
// ==========================================================================
function initBehaviors() {
  // --- Header Scroll Effect & Active Navigation Link Spy ---
  const header = document.querySelector(".header");
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileLinks = document.querySelectorAll(".mobile-link");

  window.addEventListener("scroll", () => {
    if (window.scrollY > 50) header.classList.add("scrolled");
    else header.classList.remove("scrolled");

    let current = "";
    sections.forEach(section => {
      if (window.scrollY >= (section.offsetTop - 150)) {
        current = section.getAttribute("id");
      }
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

  // --- Mobile Nav Drawer Toggle ---
  const menuToggle = document.getElementById("menu-toggle");
  const mobileNav = document.getElementById("mobile-nav");
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener("click", () => {
      mobileNav.classList.toggle("open");
      const icon = menuToggle.querySelector("i, svg");
      if (icon) {
        const isOpen = mobileNav.classList.contains("open");
        menuToggle.innerHTML = `<i data-lucide="${isOpen ? "x" : "menu"}"></i>`;
        lucide.createIcons();
      }
    });
    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        mobileNav.classList.remove("open");
        menuToggle.innerHTML = `<i data-lucide="menu"></i>`;
        lucide.createIcons();
      });
    });
  }

  // --- Typewriter Text Effect (words come from SITE_DATA) ---
  const typewriterSpan = document.getElementById("typewriter");
  const words = (SITE_DATA.profile.typewriter && SITE_DATA.profile.typewriter.length)
    ? SITE_DATA.profile.typewriter
    : ["modern web experiences."];
  let wordIndex = 0, charIndex = 0, isDeleting = false, typingSpeed = 100;

  function type() {
    if (!typewriterSpan) return;
    const currentWord = words[wordIndex];
    if (isDeleting) {
      typewriterSpan.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 50;
    } else {
      typewriterSpan.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 100;
    }
    if (!isDeleting && charIndex === currentWord.length) {
      isDeleting = true;
      typingSpeed = 2000;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typingSpeed = 500;
    }
    setTimeout(type, typingSpeed);
  }
  if (typewriterSpan) type();

  // --- Scroll Reveal Observer ---
  const revealElements = document.querySelectorAll(".scroll-reveal");
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("revealed");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
  revealElements.forEach(el => revealObserver.observe(el));

  // --- Statistics Counter Animation (suffix now data-driven) ---
  const statNumbers = document.querySelectorAll(".stat-number");
  const animateStats = (statEl) => {
    const target = parseInt(statEl.getAttribute("data-target"), 10);
    const suffix = statEl.getAttribute("data-suffix") || "";
    const duration = 2000, stepTime = 30;
    const increment = target / (duration / stepTime);
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

  // --- Skills progress bar animation ---
  const skillsSection = document.querySelector(".skills-section");
  const progressBars = document.querySelectorAll(".progress-bar");
  if (skillsSection) {
    const skillsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          progressBars.forEach(bar => {
            const width = bar.style.width;
            bar.style.width = "0";
            setTimeout(() => { bar.style.width = width; }, 100);
          });
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    skillsObserver.observe(skillsSection);
  }

  // --- Projects Filtering System ---
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const filterValue = btn.getAttribute("data-filter");
      projectCards.forEach(card => {
        const category = card.getAttribute("data-category");
        if (filterValue === "all" || category === filterValue) {
          card.style.display = "flex";
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "scale(1)";
          }, 50);
        } else {
          card.style.opacity = "0";
          card.style.transform = "scale(0.9)";
          setTimeout(() => { card.style.display = "none"; }, 300);
        }
      });
    });
  });

  // --- Toast System and Form Submission ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameInput = document.getElementById("name");
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

function showToast(message, type = "success") {
  const toastContainer = document.getElementById("toast-container");
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

const $ = (id) => document.getElementById(id);

function openAdmin() {
  workingData = JSON.parse(JSON.stringify(SITE_DATA));
  $("admin-overlay").classList.add("open");
  $("admin-mode-badge").textContent = firebaseEnabled ? "Live mode" : "Export mode";
  if (firebaseEnabled && !auth.currentUser) {
    $("admin-login").style.display = "block";
    $("admin-editor").style.display = "none";
  } else {
    showEditor();
  }
  lucide.createIcons();
}

function closeAdmin() {
  $("admin-overlay").classList.remove("open");
  if (location.hash === "#admin") history.replaceState(null, "", " ");
}

function showEditor() {
  $("admin-login").style.display = "none";
  $("admin-editor").style.display = "block";
  $("admin-save").style.display = firebaseEnabled ? "inline-flex" : "none";
  $("admin-signout").style.display = firebaseEnabled ? "inline-flex" : "none";
  renderTab(activeTab);
}

// ---- Form building helpers ----
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
      field("First name (gradient part of logo)", d.profile.firstName, "profile.firstName") +
      field("Last name (plain part of logo — optional)", d.profile.lastName, "profile.lastName") +
      field("Hero badge text", d.profile.badge, "profile.badge") +
      field("Typewriter phrases (one per line)", d.profile.typewriter.join("\n"), "profile.typewriter", "textarea") +
      field("Hero description", d.profile.heroDescription, "profile.heroDescription", "textarea") +
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
            ${field("Icon (lucide name, e.g. cpu, palette, rocket)", f.icon, `about.features.${i}.icon`)}
            ${field("Title", f.title, `about.features.${i}.title`)}
          </div>
          ${field("Text", f.text, `about.features.${i}.text`, "textarea")}
        </div>`).join("");
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
          ${field("Image URL (leave empty for icon card)", p.image, `projects.${i}.image`)}
          ${field("Icon (lucide name)", p.icon, `projects.${i}.icon`)}
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
        ${field("Group title", g.category, `skills.${gi}.category`)}
        ${g.items.map((item, ii) => `
          <div class="admin-row">
            ${field("Skill", item.name, `skills.${gi}.items.${ii}.name`)}
            ${field("Level %", item.level, `skills.${gi}.items.${ii}.level`, "number")}
          </div>`).join("")}
        <button class="admin-add" data-add="skill-item" data-group="${gi}">+ Add skill</button>
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
            ${field("Icon (github, linkedin, twitter, instagram, mail…)", s.icon, `contact.socials.${i}.icon`)}
            ${field("URL", s.url, `contact.socials.${i}.url`)}
          </div>
        </div>`).join("") +
      `<button class="admin-add" data-add="social">+ Add social link</button>` +
      field("Footer copyright", d.footer.copyright, "footer.copyright");
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
    if (path[0] === "profile" && key === "typewriter") val = val.split("\n").map(s => s.trim()).filter(Boolean);
    else if (path[0] === "about" && key === "paragraphs") val = val.split("\n").map(s => s.trim()).filter(Boolean);
    else if (key === "tags") val = val.split(",").map(s => s.trim()).filter(Boolean);
    else if (el.type === "number") val = Number(val) || 0;
    ref[key] = val;
  });
}

function adminMutate(fn) {
  collectTab();
  fn();
  renderTab(activeTab);
}

function initAdmin() {
  // Open triggers: Ctrl+Shift+A, 5 taps on logo, or #admin in the URL
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

  // Login
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
      if (kind === "project") workingData.projects.push({
        title: "New Project", description: "Describe this project.",
        category: workingData.categories[0] ? workingData.categories[0].key : "general",
        tags: [], image: "", icon: "sparkles", gradient: 1, codeLink: "", demoLink: ""
      });
      if (kind === "skill-group") workingData.skills.push({ category: "New Group", items: [{ name: "Skill", level: 80 }] });
      if (kind === "skill-item") workingData.skills[Number(addBtn.dataset.group)].items.push({ name: "Skill", level: 80 });
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
      SITE_DATA = JSON.parse(JSON.stringify(workingData));
      renderAll();
      initFilterRebind();
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
    SITE_DATA = JSON.parse(JSON.stringify(workingData));
    renderAll();
    initFilterRebind();
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

// Re-attach filter listeners after re-render (project grid is rebuilt)
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

// ==========================================================================
// Boot
// ==========================================================================
document.addEventListener("DOMContentLoaded", async () => {
  initFirebase();
  await loadContent();
  renderAll();
  initBehaviors();
  initAdmin();
});
