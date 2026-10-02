export interface EducationEntry {
  institution: string;
  degree: string;
  field?: string;
  startYear?: string;
  endYear?: string;
  highlights: string[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  location?: string;
  start: string;
  end: string;
  highlights: string[];
  tech?: string[];
}

export interface AchievementEntry {
  title: string;
  year?: string;
  description: string;
  url?: string;
}

export interface CertificationEntry {
  name: string;
  issuer: string;
  year?: string;
  url?: string;
}

export interface RecruiterFaq {
  question: string;
  answer: string;
}

export interface CareerData {
  headline: string;
  linkedInSummary: string;
  education: EducationEntry[];
  experience: ExperienceEntry[];
  achievements: AchievementEntry[];
  certifications: CertificationEntry[];
  currentFocus: {
    title: string;
    summary: string;
    building: string[];
    learning: string[];
  };
  dailyRhythm: string[];
  softSkills: string[];
  workingStyle: string[];
  recruiterFaq: RecruiterFaq[];
  prioritizedGithubRepos: string[];
  linkedInUrl: string;
  leetCodeUrl: string;
  githubUrl: string;
  topicsToAvoid: string[];
  stackProfile: {
    primaryStrengths: string[];
    limitedExperience: { technology: string; honestLevel: string }[];
    notInProductionStack: string[];
    learningStance: string;
  };
}

/** Public, recruiter-safe career knowledge — mirrored in knowledge/public/*.md */
export const careerData: CareerData = {
  headline:
    "Full Stack GenAI Engineer · RAG · AI Agents · LLM Workflows · Pune",
  linkedInUrl: "https://www.linkedin.com/in/swamiabhishek45/",
  githubUrl: "https://github.com/swamiabhishek45",
  leetCodeUrl: "https://leetcode.com/swamiabhishek45/",
  linkedInSummary:
    "Full Stack Gen AI Engineer building RAG systems, AI agents, and LLM workflows. Next.js, TypeScript, PostgreSQL + pgvector, MongoDB, Docker, Redis, vector DB, MCP, evals. Based in Pune.",
  education: [
    {
      institution:
        "Vilasrao Deshmukh Foundation College of Engineering and Technology, Latur",
      degree: "B.Tech",
      field: "Computer Science & Engineering",
      startYear: "2021",
      endYear: "2025",
      highlights: [
        "Graduated 2025",
        "CGPA 8.20/10",
        "9.61 SGPA in first semester; ranked 1st in class that semester",
        "Strong foundation in CS, DSA, databases, and software development",
      ],
    },
    {
      institution: "Shamgir College, Latur",
      degree: "HSC / 12th",
      field: "PCMB",
      endYear: "2021",
      highlights: ["82.16%"],
    },
    {
      institution: "Parimal High School, Latur",
      degree: "SSC / 10th",
      field: "Science",
      endYear: "2019",
      highlights: ["86.20%"],
    },
  ],
  experience: [
    {
      company: "College / independent",
      role: "Software Trainer / Developer Mentor",
      location: "Latur area",
      start: "Final year of college",
      end: "~3 months",
      highlights: [
        "Taught programming and full-stack fundamentals",
        "Mentored 15+ students through hands-on software projects",
        "Developed mentoring and communication skills",
      ],
    },
    {
      company: "One Union Solutions",
      role: "Full Stack Developer",
      location: "Pune, India",
      start: "April 2026",
      end: "Present",
      highlights: [
        "Production full-stack apps: internal portals, procurement systems, websites, deployments",
        "CI/CD automation with automated code backups",
        "Procurement performance: rate limiting, pagination, MongoDB indexing",
        "SEO ranking system to analyze, score, and rank websites on key metrics",
        "Side GenAI projects: RAG, agents, vector DBs, tool calling, MCP",
      ],
      tech: [
        "TypeScript",
        "Node.js",
        "MongoDB",
        "React",
        "Next.js",
        "GitHub Actions",
        "Docker",
      ],
    },
  ],
  achievements: [
    {
      title: "Academic excellence",
      description:
        "9.61 SGPA first semester, 1st in class; B.Tech CSE with 8.20 CGPA.",
    },
    {
      title: "Student mentoring",
      description: "Helped 15+ students complete hands-on software projects.",
    },
    {
      title: "DSA practice",
      description: "300+ DSA problems solved; 100+ day coding streak.",
    },
    {
      title: "OpenBook",
      description:
        "AI-powered research and study platform: RAG, multi-source ingestion, LLM workflows.",
    },
    {
      title: "Community",
      description:
        "Zonal-level university chess; tech events and developer meetups in Pune.",
    },
  ],
  certifications: [
    {
      name: "Introduction to Generative AI",
      issuer: "Google",
      year: "2026",
    },
    {
      name: "Claude 101",
      issuer: "Claude",
      year: "2026",
    },
    {
      name: "MongoDB Overview: Core Concepts and Architecture",
      issuer: "MongoDB",
      year: "2026",
    },
  ],
  currentFocus: {
    title: "Full Stack GenAI Engineer",
    summary:
      "Growing as a GenAI engineer while shipping full-stack work professionally; seeking roles on production AI systems.",
    building: [
      "AI agents and agentic workflows",
      "RAG pipelines, embeddings, reranking",
      "Vector databases, MCP, AI memory, context management",
      "Streaming and production AI apps",
      "OpenBook, Kikoyu, ChaiGPT, SkillMatch AI",
    ],
    learning: [
      "LLM evaluations",
      "Production AI infrastructure",
      "Advanced retrieval strategies",
    ],
  },
  dailyRhythm: [
    "Professional full-stack development on production applications",
    "Writing code, debugging, and learning new technologies",
    "Experimenting with AI architectures and personal GenAI projects",
    "DSA practice and continuous skill building",
  ],
  softSkills: [
    "Curious, learns by building",
    "Clear explainer — from mentoring students to collaborating with engineers",
    "Comfortable independent or in meetups and team discussions",
    "Ownership mindset on problems",
  ],
  workingStyle: [
    "Understand internals, then build — not tutorials-only",
    "Practical, hands-on learning",
    "Open communication when stuck; breaks problems into smaller pieces",
    "Prototypes to validate ideas; cares about the why behind decisions",
  ],
  recruiterFaq: [
    {
      question: "Tell me about yourself.",
      answer:
        "CS graduate and Full Stack GenAI Engineer in Pune. Mentored students in college, then Full Stack Developer at One Union Solutions. Built GenAI projects around RAG, agents, vector DBs, MCP; seeking deeper AI engineering roles.",
    },
    {
      question: "What kind of role are you looking for?",
      answer:
        "GenAI Engineer, AI Engineer, Full Stack AI Engineer, or AI-focused Full Stack Developer — RAG, agents, LLM apps, production AI infrastructure.",
    },
    {
      question: "What is your strongest project?",
      answer:
        "OpenBook — AI research/study platform with PDFs, websites, YouTube, RAG, vector search, and interactive learning workflows.",
    },
    {
      question: "Why GenAI?",
      answer:
        "Combines software engineering with systems that understand information, use tools, retrieve knowledge, and go beyond traditional CRUD.",
    },
    {
      question: "RAG experience?",
      answer:
        "Built pipelines: ingestion, chunking, embeddings, vector search, retrieval, context construction, LLM generation; experimented with vector DBs and retrieval strategies.",
    },
    {
      question: "Professional AI experience?",
      answer:
        "Professional work is full-stack; deeper GenAI from independent production-style AI projects (LLMs, RAG, agents, vector DBs, workflows).",
    },
    {
      question: "DSA strength?",
      answer: "300+ problems solved; 100+ day coding streak; still practicing.",
    },
    {
      question: "Frontend or backend?",
      answer:
        "Both; started frontend, now especially interested in backend and AI infrastructure.",
    },
    {
      question: "How do you learn?",
      answer:
        "Fundamentals, official docs, then a small project to learn trade-offs.",
    },
    {
      question: "Next opportunity?",
      answer:
        "Challenging engineering and AI problems, learning from experienced devs, practical AI products — not surface-level AI features only.",
    },
    {
      question: "Do you know Java / Go / Rust / Kubernetes?",
      answer:
        "Not in production today — my shipped work is mainly TypeScript, Node, and Next.js. I am honest about that. I am happy to learn on the job: I pick up stacks quickly by building small features and reading official docs, the same way I went deep on RAG and agents.",
    },
    {
      question: "How strong is your Python?",
      answer:
        "Limited compared to TypeScript — I have used Python for learning and small scripts, not as my primary stack at work. For a Python-heavy role I would be transparent and ramp with mentorship and deliberate practice.",
    },
    {
      question: "Can you send me your resume / CV?",
      answer:
        "Turn on the Save on close toggle at the top of this chat (the download switch). With it on, when you close the panel or end voice, your browser downloads my resume PDF and this conversation as a text file. I can also walk you through my experience here — just ask.",
    },
  ],
  prioritizedGithubRepos: [
    "OpenBook",
    "Kikoyu-Agent-SDK",
    "ChaiGPT",
    "SkillMatch-AI",
  ],
  topicsToAvoid: [
    "Private or sensitive personal information",
    "Keep conversation on professional work, projects, and technical interests",
  ],
  stackProfile: {
    primaryStrengths: [
      "TypeScript / JavaScript",
      "Next.js & React",
      "Node.js & Express",
      "MongoDB & PostgreSQL (incl. pgvector)",
      "RAG, AI agents, LLM tool calling, vector DBs",
      "Docker, CI/CD, Vercel",
    ],
    limitedExperience: [
      {
        technology: "Python",
        honestLevel:
          "Some exposure (scripts, small experiments, AI/ML tutorials) — not my day-to-day production language. I can ramp up quickly because my core work is backend + APIs + system thinking in TypeScript.",
      },
      {
        technology: "C++",
        honestLevel:
          "Academic and DSA background — comfortable with fundamentals, not shipping C++ services professionally.",
      },
    ],
    notInProductionStack: [
      "Java",
      "Go",
      "Rust",
      "Kotlin",
      "Kubernetes (K8s) at production operator level",
      "Spring / enterprise Java ecosystems",
    ],
    learningStance:
      "If a role needs a stack I have not used in production, I am upfront about it. I learn by reading docs, building a small proof-of-concept, and pairing with the team — I have done this repeatedly when picking up GenAI, vector DBs, and new cloud tooling. I do not claim expert-level experience I do not have.",
  },
};
