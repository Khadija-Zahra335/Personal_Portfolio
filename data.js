/* ==========================================================================
   DEFAULT SITE CONTENT — Khadija Zahra
   Fallback data. Once Firebase is connected, content saved from the Admin
   Panel (Ctrl+Shift+A / 5 logo taps / #admin) overrides this.
   ========================================================================== */
const DEFAULT_DATA = {
  profile: {
    names: ["Khadija Zahra", "خدیجہ زہرا"],
    logoFirst: "Khadija",
    logoLast: "Zahra",
    badge: "Open to software engineering opportunities",
    roles: [
      "Full Stack Developer",
      "Software Engineer",
      ".NET Specialist",
      "Machine Learning Enthusiast",
      "Creative Problem Solver",
      "Architect of Clean Code"
    ],
    heroDescription: "Final-year Software Engineering student at PUCIT and Full Stack Intern at Musketeers Tech. I design scalable .NET systems and intelligent ML-powered applications — turning complex requirements into clean, reliable software people enjoy using.",
    avatar: "assets/avatar.png"
  },
  stats: [
    { value: 15, suffix: "+", label: "Projects Built" },
    { value: 9, suffix: "", label: "Member Team Led" },
    { value: 94, suffix: "%", label: "Best ML Model Accuracy" }
  ],
  about: {
    subtitle: "A Bit About Me",
    title: "Engineering with Precision & Curiosity",
    paragraphs: [
      "I'm a final-year BS Software Engineering candidate at PUCIT, University of the Punjab, specializing in full-stack .NET development, machine learning, and software quality assurance. I build systems using modern engineering principles — N-Tier Architecture, MVC, SOLID, and proven design patterns — so they stay maintainable as they grow.",
      "Beyond writing code, I lead. I managed a 9-member Agile team through a full SDLC delivery, mentor junior students in programming fundamentals and OOP, and love competing in design challenges. Currently, I'm sharpening my production skills as a Full Stack Intern at Musketeers Tech."
    ],
    location: "Layyah, Punjab, Pakistan",
    email: "khadijazahra153@gmail.com",
    features: [
      {
        icon: "layers",
        title: "Full Stack Development",
        text: "ASP.NET Core, MVC, SignalR real-time systems, and SQL Server — from database design to polished, responsive front ends."
      },
      {
        icon: "brain-circuit",
        title: "Machine Learning & AI",
        text: "Building and evaluating models with scikit-learn, TensorFlow and Keras — including a 94%-accuracy activity recognition system."
      }
    ]
  },
  experience: [
    {
      role: "Full Stack Intern",
      company: "Musketeers Tech",
      period: "2026 — Present",
      description: "Building and shipping full-stack features in a production environment — working across backend services, databases, and modern front-end interfaces alongside a professional engineering team."
    },
    {
      role: "Project Manager",
      company: "Online Pharmacy Management System (PIMS)",
      period: "2025 — 2026",
      description: "Led a 9-member Agile team across the full SDLC. Designed a multi-module platform with AI-driven demand forecasting, inventory alerts, billing, and prescription management — delivered on time with enforced code quality."
    },
    {
      role: "Peer Academic Mentor",
      company: "PUCIT — Programming Fundamentals & OOP",
      period: "2023 — 2025",
      description: "Provided one-on-one and group support to junior students — explaining encapsulation, inheritance, polymorphism and abstraction with practical coding examples, and debugging assignments to improve exam readiness."
    },
    {
      role: "BS Software Engineering",
      company: "PUCIT, University of the Punjab",
      period: "2022 — Present",
      description: "Final-year candidate. Coursework spanning software design & architecture, quality engineering, machine learning, databases, operating systems, and computer networks. UI/UX Design Challenge participant at PUCON 24."
    }
  ],
  categories: [
    { key: "fullstack", label: "Full-Stack" },
    { key: "ml", label: "Machine Learning" },
    { key: "desktop", label: "Desktop" },
    { key: "qa", label: "QA & DevOps" }
  ],
  projects: [
    {
      title: "PIMS — Online Pharmacy System",
      description: "Real-time AI-powered inventory platform with analytical dashboards, demand forecasting, automated invoices, and prescription management. Led the 9-member team that built it.",
      category: "fullstack",
      tags: ["ASP.NET", "AI Forecasting", "SQL Server", "Agile"],
      image: "assets/covers/pims.svg",
      icon: "pill",
      gradient: 1,
      codeLink: "https://github.com/Khadija-Zahra335/pims-Online-Pharmacy-System-",
      demoLink: "https://pims-online-pharmacy-system.vercel.app"
    },
    {
      title: "Human Activity Recognition",
      description: "ML system classifying human activity from smartphone sensor data. Compared multiple ML and deep learning models to reach 94% accuracy on real-world data.",
      category: "ml",
      tags: ["Python", "scikit-learn", "TensorFlow", "Keras"],
      image: "assets/covers/har.svg",
      icon: "activity",
      gradient: 2,
      codeLink: "https://github.com/Khadija-Zahra335",
      demoLink: ""
    },
    {
      title: "Enterprise Web Application Suite",
      description: "Three full-stack systems: a travel booking platform with complete CRUD, a real-time SignalR notification system, and a hospital management system — all on ASP.NET Core with SQL Server.",
      category: "fullstack",
      tags: ["ASP.NET Core MVC", "SignalR", "ADO.NET", "Identity"],
      image: "assets/covers/web.svg",
      icon: "globe",
      gradient: 3,
      codeLink: "https://github.com/Khadija-Zahra335",
      demoLink: ""
    },
    {
      title: "Modular Payroll System",
      description: "Scalable payroll backend using layered architecture and the Strategy Pattern to handle different employee types — extendable without touching existing functionality.",
      category: "fullstack",
      tags: ["C#", "Strategy Pattern", "GRASP", "N-Tier"],
      image: "assets/covers/payroll.svg",
      icon: "calculator",
      gradient: 4,
      codeLink: "https://github.com/Khadija-Zahra335",
      demoLink: ""
    },
    {
      title: "Library Management System — QA Pipeline",
      description: "Team project implementing a full QA pipeline: containerized with Docker, automated UI tests with Selenium, API testing with Postman, and load testing with JMeter and Locust.",
      category: "qa",
      tags: ["Docker", "Selenium", "Postman", "SonarQube"],
      image: "assets/covers/qa.svg",
      icon: "shield-check",
      gradient: 2,
      codeLink: "https://github.com/Khadija-Zahra335",
      demoLink: ""
    },
    {
      title: "Fruit Shop Management System",
      description: "Full desktop business application with N-Tier Architecture — real-time dictionary-based stock tracking, event-driven sales, expense categorization, payroll, and profit/loss computation.",
      category: "desktop",
      tags: ["C#", ".NET Framework", "WinForms", "N-Tier"],
      image: "assets/covers/shop.svg",
      icon: "shopping-cart",
      gradient: 3,
      codeLink: "https://github.com/Khadija-Zahra335",
      demoLink: ""
    }
  ],
  skills: [
    {
      icon: "layers",
      category: "Full Stack Development",
      items: ["ASP.NET Core", "MVC .NET", "C#", "SignalR", "ADO.NET", "SQL Server", "JavaScript", "Tailwind CSS", "AJAX"]
    },
    {
      icon: "brain-circuit",
      category: "Machine Learning & AI",
      items: ["Python", "scikit-learn", "TensorFlow", "Keras", "pandas", "NumPy", "Jupyter"]
    },
    {
      icon: "wrench",
      category: "DevOps & Quality",
      items: ["Docker", "Git & GitHub", "Selenium", "Postman", "JMeter", "SonarQube"]
    },
    {
      icon: "users",
      category: "Leadership & Problem Solving",
      items: ["Project Management", "Agile / Scrum", "Team Collaboration", "Problem Solving", "Mentoring", "Communication"]
    }
  ],
  contact: {
    formEmail: "khadijazahra153@gmail.com",
    heading: "Let's build something great",
    text: "I'm open to software engineering roles, internships, and collaborative projects. If you're looking for someone who writes clean code and leads with clarity — send a message!",
    socials: [
      { icon: "github", url: "https://github.com/Khadija-Zahra335" },
      { icon: "mail", url: "mailto:khadijazahra153@gmail.com" },
      { icon: "linkedin", url: "#" }
    ]
  },
  footer: {
    copyright: "© 2026 Khadija Zahra. All rights reserved."
  },
  settings: {
    passcode: "khadija@2026",
    defaultPalette: "neon"
  }
};