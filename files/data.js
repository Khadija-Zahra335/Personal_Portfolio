/* ==========================================================================
   DEFAULT SITE CONTENT
   This is the fallback data. Once Firebase is connected, content saved from
   the Admin Panel (Ctrl+Shift+A or tap the logo 5 times) overrides this.
   You can also edit this file directly — it's plain JavaScript.
   ========================================================================== */
const DEFAULT_DATA = {
  profile: {
    firstName: "Anees",
    lastName: "",
    badge: "Available for new opportunities",
    typewriter: [
      "intelligent web apps.",
      "interactive interfaces.",
      "modern user experiences.",
      "clean, scalable code."
    ],
    heroDescription: "A full-stack developer and digital agency founder obsessed with building high-performance, visually stunning web applications. I turn complex logic into smooth, user-focused digital experiences.",
    avatar: "assets/avatar.png"
  },
  stats: [
    { value: 6, suffix: "+", label: "Years Experience" },
    { value: 2500, suffix: "+", label: "Projects Completed" },
    { value: 800, suffix: "+", label: "Happy Clients" }
  ],
  about: {
    subtitle: "A Bit About Me",
    title: "Combining Code & Aesthetics",
    paragraphs: [
      "I am a developer who believes software should not only be functional and scalable, but also visually spectacular. I specialize in modern frontend frameworks, robust server structures, and custom real-time application layouts.",
      "With my background in user experience and engineering, I bridge the gap between technical complexity and intuitive layout design. When I am not writing code, you can find me designing interfaces in Figma or experimenting with animation systems and performance tuning."
    ],
    location: "Layyah, Punjab, Pakistan (Remote)",
    email: "hello@example.com",
    features: [
      {
        icon: "cpu",
        title: "Intelligent Logic",
        text: "Developing AI-assisted modules, predictive analytics pipelines, and dynamic databases."
      },
      {
        icon: "palette",
        title: "Premium Visuals",
        text: "Designing modern glassmorphism themes, glowing grids, and highly polished responsive systems."
      }
    ]
  },
  categories: [
    { key: "fullstack", label: "Full-Stack" },
    { key: "frontend", label: "Frontend" },
    { key: "design", label: "Design" }
  ],
  projects: [
    {
      title: "PIMS — Pharmacy System",
      description: "Real-time AI-powered inventory system featuring analytical dashboards, demand forecasting, and automated invoices.",
      category: "fullstack",
      tags: ["React", "Firebase", "Recharts", "jsPDF"],
      image: "assets/project1.png",
      icon: "sparkles",
      gradient: 1,
      codeLink: "https://github.com/Khadija-Zahra335/pims-Online-Pharmacy-System-",
      demoLink: "https://pims-online-pharmacy-system.vercel.app"
    },
    {
      title: "Nova AI Analytics",
      description: "SaaS web landing page design highlighting predictive cloud server scaling and intelligent optimization dashboards.",
      category: "frontend",
      tags: ["Vite", "CSS Variables", "Chart.js", "Lucide"],
      image: "",
      icon: "sparkles",
      gradient: 1,
      codeLink: "#",
      demoLink: "#"
    },
    {
      title: "Aura Audio Studio",
      description: "Interactive web audio editor and mixer tool utilizing the Web Audio API with a glassmorphic dashboard view.",
      category: "design",
      tags: ["HTML5", "Web Audio API", "Vanilla JS", "Figma"],
      image: "",
      icon: "music",
      gradient: 2,
      codeLink: "#",
      demoLink: "#"
    }
  ],
  skills: [
    {
      category: "Frontend Architecture",
      items: [
        { name: "React / Next.js", level: 95 },
        { name: "CSS3 / Sass / Tailwind", level: 90 },
        { name: "TypeScript / ES6+ JS", level: 92 }
      ]
    },
    {
      category: "Backend & Services",
      items: [
        { name: "Node.js / Express", level: 88 },
        { name: "Firebase (Firestore / Auth)", level: 90 },
        { name: "GraphQL / REST APIs", level: 85 }
      ]
    }
  ],
  contact: {
    heading: "Let's start a project",
    text: "I am available for freelance projects, contract roles, or collaborative ventures. If you have an idea that needs a premium, high-performance web experience, send a message!",
    socials: [
      { icon: "github", url: "#" },
      { icon: "linkedin", url: "#" },
      { icon: "twitter", url: "#" }
    ]
  },
  footer: {
    copyright: "© 2026 Anees. All rights reserved."
  }
};
