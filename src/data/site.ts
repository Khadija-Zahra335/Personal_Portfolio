/* All site copy lives here so components stay content-free
   (and an admin panel / CMS can replace this later). */

export const profile = {
  firstName: "Khadija",
  lastName: "Zahra",
  role: "Full Stack & AI Engineer",
  intro:
    "Final-year Software Engineering student at PUCIT who builds full-stack products end to end — APIs and databases with Node.js and PostgreSQL, interfaces with React and Next.js, and AI features powered by LLMs and RAG pipelines.",
  email: "khadijazahra153@gmail.com",
  github: "https://github.com/Khadija-Zahra335",
  linkedin: "https://www.linkedin.com/in/khadija-zahra-06a37a270/",
};

export const navLinks = [
  { label: "Projects", href: "#projects" },
  { label: "About", href: "#about" },
  { label: "Skills", href: "#skills" },
  { label: "Experience", href: "#experience" },
  { label: "Education", href: "#education" },
  { label: "Get In Touch", href: "#contact" },
];

/** Scrolling chips under the hero */
export const heroChips = [
  "⚛️ React", "▲ Next.js", "🟦 TypeScript", "🟨 JavaScript", "🟢 Node.js", "🚏 Express",
  "🐘 PostgreSQL", "🔷 Prisma ORM", "🔗 REST APIs", "🔐 JWT Auth", "✅ Zod Validation", "📘 Swagger Docs",
  "🧠 RAG Pipelines", "🤖 LLM Integration", "🧭 Vector Search", "🧬 Cohere Embeddings", "⚡ Groq API", "☁️ Cloudinary",
  "🔥 Firebase", "🎨 Tailwind CSS", "#️⃣ C# / .NET", "🗄️ SQL Server", "🐍 Python", "🐳 Docker",
  "🧪 Selenium", "📮 Postman", "🎯 Figma", "🚀 Vercel", "🌳 Git & GitHub", "👥 Agile / Scrum",
];

/* ==========================================================================
   Projects (stacked cards). Screenshots go in /public/projects/.
   Leave `image` empty to show the icon placeholder.
   icon: one of "users" | "bot" | "utensils" | "hammer" | "pill"
   ========================================================================== */
export type Project = {
  title: string;
  icon: "users" | "bot" | "utensils" | "hammer" | "pill";
  paragraphs: string[];
  tech: string[];
  stats: { label: string; value: string }[];
  image?: string;
  liveUrl?: string;
  githubUrl?: string;
};

export const projectsSection = {
  badge: "Projects",
  title: "Products I've Built From the Ground Up",
  subtitle: "Full-stack applications with real users in mind — from database design and APIs to AI-powered features.",
};

export const projects: Project[] = [
  {
    title: "Intern Management System",
    icon: "users",
    paragraphs: [
      "A full-stack platform built for Musketeers Tech to run internship programs end to end — cohort tracking, task assignment, submission review and attendance, with separate dashboards for mentors and interns.",
      "AI is built into the workflow: AI-assisted task drafting, weekly AI insights, and a RAG-powered chatbot that answers questions like “who's blocked or falling behind?” right on the mentor dashboard.",
    ],
    tech: ["Next.js", "TypeScript", "Node.js", "Express", "PostgreSQL", "Prisma", "Pinecone", "Cohere", "Cloudinary"],
    stats: [
      { label: "AI Features", value: "3" },
      { label: "Built For", value: "Musketeers Tech" },
    ],
    image: "/projects/Intern_Mangement_System.png",
    liveUrl: "https://mt-internportal.vercel.app/", 
    githubUrl: "https://github.com/Khadija-Zahra335/Intern-Management-System", 
  },
  {
    title: "Ask My Internship — RAG Chatbot",
    icon: "bot",
    paragraphs: [
      "A retrieval-augmented chatbot that answers questions about my internship experience, learning and projects — grounded in real documents instead of guesses.",
      "Documents are embedded with Cohere, stored and searched in Pinecone, and answered by a fast LLM through the Groq API, so every response is backed by retrieved context.",
    ],
    tech: ["Next.js", "Cohere", "Pinecone", "Groq API"],
    stats: [
      { label: "Architecture", value: "RAG" },
      { label: "Vector Store", value: "Pinecone" },
    ],
    image: "/projects/AI_Chatbot.png", // TODO
    liveUrl: "https://ai-chat-bot-tau-ten.vercel.app/", 
    githubUrl: "https://github.com/Khadija-Zahra335/Ask-My-Internship", // TODO
  },
  {
    title: "Foodly — Multi-Vendor Food Delivery",
    icon: "utensils",
    paragraphs: [
      "A food delivery platform supporting multiple independent restaurants, customer ordering, rider-based delivery and post-order reviews.",
      "Customers browse restaurants, view menus, place and review orders; owners manage menu items, review incoming orders and assign riders — all behind a typed, validated and documented REST API.",
    ],
    tech: ["TypeScript", "REST APIs", "PostgreSQL", "JWT + bcrypt", "Zod", "Swagger"],
    stats: [
      { label: "User Roles", value: "3" },
      { label: "API Docs", value: "Swagger" },
    ],
    image: "/projects/Foodly.png", // TODO
    liveUrl: "https://food-delivery-platform-three.vercel.app/login", // TODO
    githubUrl: "https://github.com/Khadija-Zahra335/Food-delivery-platform", // TODO
  },
  {
    title: "Hunar Ustad Exchange",
    icon: "hammer",
    paragraphs: [
      "A two-sided marketplace connecting people across Pakistan with verified local skilled workers (ustads) — electricians, tailors, tutors, plumbers, carpenters, mehndi artists and more.",
      "Ustads are booked and rated by their own neighbourhood, building local trust into every hire.",
    ],
    tech: ["React", "Vite", "Firebase Auth", "Firestore"],
    stats: [
      { label: "Trade Categories", value: "6+" },
      { label: "Marketplace", value: "2-Sided" },
    ],
    image: "", // TODO
    liveUrl: "", // TODO
    githubUrl: "", // TODO
  },
  {
    title: "PIMS — Online Pharmacy System",
    icon: "pill",
    paragraphs: [
      "A real-time, AI-powered pharmacy inventory platform with analytical dashboards, demand forecasting, automated invoices and prescription management.",
      "I led the 9-member Agile team that built it across the full SDLC — delivered on time with enforced code quality.",
    ],
    tech: ["ASP.NET", "SQL Server", "AI Forecasting", "Agile"],
    stats: [
      { label: "Team Led", value: "9" },
      { label: "Delivery", value: "Full SDLC" },
    ],
    image: "", // TODO
    liveUrl: "https://pims-online-pharmacy-system.vercel.app",
    githubUrl: "https://github.com/Khadija-Zahra335/pims-Online-Pharmacy-System-",
  },
];

/* ==========================================================================
   About
   ========================================================================== */
export const about = {
  badge: "About Me",
  title: "Engineering Student, Builder at Heart",
  text:
    "I'm a final-year BS Software Engineering student at PUCIT, University of the Punjab. I learn by building — from backend APIs and database design to React/Next.js frontends and AI features with LLMs and RAG. I've led a 9-member team through a full SDLC, mentored juniors in programming and OOP, and recently completed a full-stack & AI engineering internship at Musketeers Tech.",
  stats: [
    { value: "15+", label: "Projects Built" },
    { value: "9", label: "Member Team Led" },
    { value: "94%", label: "Best ML Accuracy" },
  ],
  availability: "Open to internships & junior roles",
  resumeUrl: "/resume/Khadija_Zahra_Resume.pdf", // put the PDF in public/resume/
  badgeCircle: { top: "Final Year", bottom: "BS Software\nEngineering" },
};

/** 4-column strip under About (HexaFolio's experience row) */
export const experienceStrip = [
  { role: "Full Stack Intern", org: "Musketeers Tech", type: "Internship", period: "Jul 2026 – Sep 2026" },
  { role: "BS Software Engineering", org: "PUCIT", type: "Student", period: "Dec 2022 – Present" },
  { role: "Project Manager", org: "PIMS · Team of 9", type: "Academic", period: "2025 – 2026" },
  { role: "Peer Academic Mentor", org: "PUCIT", type: "Part-time", period: "2023 – 2025" },
  
];

/* ==========================================================================
   Tech Stack. `icon` is a Simple Icons slug (https://simpleicons.org).
   `color` overrides the brand color (use "white" for black logos).
   If an icon fails to load, the tile shows initials instead.
   ========================================================================== */
export type TechItem = { name: string; desc: string; icon?: string; color?: string };
export type TechCategory = {
  title: string;
  icon: "monitor" | "server" | "database" | "brain" | "code" | "wrench";
  items: TechItem[];
};

export const techSection = {
  badge: "Tech Stack",
  title: "Tools & Technologies",
  subtitle: "What I've actually used to build, ship and test my projects — from APIs to AI.",
};

export const techStack: TechCategory[] = [
  {
    title: "Frontend",
    icon: "monitor",
    items: [
      { name: "React", icon: "react", desc: "Component-based UIs — built Hunar Ustad Exchange with React + Vite" },
      { name: "Next.js", icon: "nextdotjs", color: "white", desc: "Full-stack apps with App Router — Intern Management System, Ask My Internship" },
      { name: "Tailwind CSS", icon: "tailwindcss", desc: "Utility-first styling for fast, responsive, consistent interfaces" },
    ],
  },
  {
    title: "Backend",
    icon: "server",
    items: [
      { name: "Node.js & Express", icon: "nodedotjs", desc: "REST APIs with middleware, routing and error handling (Foodly)" },
      { name: "JWT + bcrypt", icon: "jsonwebtokens", color: "white", desc: "Secure authentication and role-based access for multi-role apps" },
      { name: "Zod", icon: "zod", desc: "Schema validation for request bodies and typed API contracts" },
      { name: "Swagger", icon: "swagger", desc: "Interactive API documentation for every endpoint" },
    ],
  },
  {
    title: "Databases",
    icon: "database",
    items: [
      { name: "PostgreSQL", icon: "postgresql", desc: "Relational schema design for multi-vendor and multi-role systems" },
      { name: "Prisma ORM", icon: "prisma", color: "white", desc: "Type-safe queries and migrations on top of PostgreSQL" },
      { name: "SQL Server", desc: "Relational backends for ASP.NET applications like PIMS" },
      { name: "Firebase", icon: "firebase", desc: "Firestore + Auth for real-time apps without a custom server" },
    ],
  },
  {
    title: "AI / LLM Engineering",
    icon: "brain",
    items: [
      { name: "RAG Pipelines", desc: "Grounding LLM answers in real documents via retrieval" },
      { name: "Pinecone", desc: "Vector search over embedded documents" },
      { name: "Cohere", desc: "Text embeddings for semantic search and retrieval" },
      { name: "Groq API", desc: "Fast LLM inference for chat responses" },
    ],
  },
  {
    title: "Languages",
    icon: "code",
    items: [
      { name: "C / C++", icon: "C++", desc: "Object-oriented programming, data structures and algorithms" },
      { name: "TypeScript", icon: "typescript", desc: "My default for both frontend and backend code" },
      { name: "JavaScript", icon: "javascript", desc: "The foundation of everything I build for the web" },
      { name: "C# / .NET", icon: "dotnet", desc: "ASP.NET Core, MVC and desktop apps with N-Tier architecture" },
      { name: "Python", icon: "python", desc: "Machine learning with scikit-learn, TensorFlow and Keras" },
      { name: "Java", icon: "java", desc: "Web Engineering and enterprise applications" },
      { name: "SQL", icon: "mysql", desc: "Relational database queries, joins and stored procedures" },

      
    ],
  },
  {
    title: "Tools & Platforms",
    icon: "wrench",
    items: [
      { name: "Git & GitHub", icon: "github", color: "white", desc: "Branching, pull requests and code review workflows" },
      { name: "Postman", icon: "postman", desc: "Testing and debugging REST APIs" },
      { name: "Docker & Selenium", icon: "docker", desc: "Containerized apps and automated UI testing in a QA pipeline" },
      { name: "Vercel & Cloudinary", icon: "vercel", color: "white", desc: "Deployment, plus cloud storage for user-uploaded files" },
      { name: "Figma", icon: "figma", desc: "UI/UX design and prototyping for web and mobile apps" },
      { name: "Jira", icon: "jira", desc: "Project management, sprints, standups and retrospectives" },
      { name: "Claude Code" , icon: "claude", desc: "AI assistant for code review, refactoring and documentation" },
    ],
  },
];


/* ==========================================================================
   Education & Certifications
   ========================================================================== */
export type EduItem = {
  title: string;
  org: string;
  period?: string;
  grade?: string;          // shown large in the highlight color
  tag?: [string, string];  // two-tone tag, e.g. ["Udemy", "Certificate"]
  url?: string;            // optional certificate link
};

export const educationSection = {
  badge: "Learning Journey",
  title: "Education & Certifications",
  subtitle: "Strong academic foundations, plus courses I took to go beyond the syllabus.",
};

export const academics: EduItem[] = [
  {
    title: "BS Software Engineering",
    org: "PUCIT, University of the Punjab",
    period: "Dec 2022 – Present",
    tag: ["PUCIT", "Final Year"],
  },
  {
    title: "FSc Pre-Medical",
    org: "Govt. College for Women, Layyah",
    period: "Jun 2019 – Apr 2022",
    grade: "98%",
    tag: ["Grade", "A+"],
  },
  {
    title: "Matriculation",
    org: "New Vision High School, Layyah",
    period: "Mar 2017 – Jun 2019",
    grade: "95%",
    tag: ["Grade", "A+"],
  },
];

export const certifications: EduItem[] = [
  { title: "The Ultimate Job-Ready Data Science Course", org: "CodeWithHarry", tag: ["CodeWithHarry", "Certificate"] },
  { title: "Complete Android & Kotlin App Development", org: "Udemy", tag: ["Udemy", "Certificate"] },
  { title: "Complete Figma Course", org: "Udemy", tag: ["Udemy", "Certificate"] },
  { title: "Docker for Beginners", org: "Udemy", tag: ["Udemy", "Certificate"] },
  { title: "Mastering Selenium", org: "Udemy", tag: ["Udemy", "Certificate"] },
  { title: "UI/UX Design Challenge", org: "PUCON '24 — PUCIT", tag: ["PUCON '24", "Competition"] },
];


/* ==========================================================================
   Contact & Footer
   ========================================================================== */
export const contactSection = {
  badge: "Let's Connect",
  title: "Get in touch",
  subtitle: "Have an internship, a role or a project in mind? I'd love to hear from you.",
  cardHeading: "Open to internships, junior roles and collaborations.",
  location: "Layyah, Punjab, Pakistan",
};

export const footer = {
  tagline: "Full-stack & AI engineer building clean, reliable software — from database to deployment.",
  currentlyTitle: "Currently",
  currently: "Final-year Software Engineering student at PUCIT, open to internships and junior full-stack roles.",
};

/* ==========================================================================
   Everything the admin panel can edit. Saved content overrides these keys.
   ========================================================================== */
export const defaultContent = {
  profile,
  navLinks,
  heroChips,
  projectsSection,
  projects,
  about,
  experienceStrip,
  techSection,
  techStack,
  educationSection,
  academics,
  certifications,
  contactSection,
  footer,
};

export type SiteContent = typeof defaultContent;