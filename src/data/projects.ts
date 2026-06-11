export interface Project {
  name: string;
  src: string;
  github: string;
  live: string;
  shortDescription: string;
  detailedDescription: string;
  tech: string[];
  category: string;
  badge?: string;
  badgeType?: "lightning" | "spark" | "none";
  icon?: "lock" | "settings" | "info" | "none";
  bgGradient: string;
}

export const projects: Project[] = [
  {
    name: "LiveDocs",
    src: "/livedoc.png",
    github: "https://github.com/swamiabhishek45/livedocs",
    live: "https://livedocs45.vercel.app/",
    shortDescription: "Built with Next.js to handle the user interface, Liveblocks for real-time features and styled with TailwindCSS, LiveDocs is a clone of Goole Docs. The primary goal is to demonstrate the developer's skills in realtime enviroment that creates a lasting impact.",
    detailedDescription: "LiveDocs is a real-time document editing application built with Next.js, Liveblocks, and TailwindCSS. It replicates the core functionality of Google Docs, enabling multiple users to collaborate on a single document simultaneously with instant updates. Users can create, edit, and share documents, enjoying real-time cursors, live presence, and seamless synchronization. The project highlights expertise in modern web development, real-time collaboration, and full-stack architecture, serving as a testament to the developer's ability to deliver polished, production-ready applications.",
    tech: ["Typescript", "Nextjs", "Liveblocks", "Tailwind"],
    category: "Full Stack",
    badge: "800+ signups",
    badgeType: "lightning",
    // icon: "lock",
    bgGradient: "bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent",
  },

  {
    name: "SkillMatch",
    src: "/skillmatch.png",
    github: "https://github.com/swamiabhishek45/skillmatch",
    live: "https://skillmatch45.vercel.app/",
    shortDescription: "Skillmatch is not just a job portal website. It’s an AI-assisted hiring platform which allows candidates to find jobs and recruiters to post jobs",
    detailedDescription: "Skillmatch is an AI-assisted hiring platform which allows candidates to find jobs and recruiters to post jobs. It uses AI to match candidates with jobs based on their skills and qualifications. It also provides a platform for candidates to showcase their skills and get discovered by recruiters.",
    tech: ["JavaScript", "React", "Node.js", "MongoDB", ],
    category: "",
    // icon: "info",
    bgGradient: "bg-gradient-to-br from-purple-600/20 via-blue-600/15 to-transparent",
  },
  {
    name: "Pollution Pulse",
    src: "/pollution-pulse.png",
        github: "https://github.com/swamiabhishek45/pollution-pulse2",
    live: "https://pollution-pulse.vercel.app/",
    shortDescription: "An AI-powered route planning application that finds the healthiest path to your destination by analyzing real-time air quality data across multiple routes.",
    detailedDescription: "Pollution Pulse is an intelligent route planning application designed to help users navigate their cities while minimizing exposure to air pollution. Leveraging real-time air quality data and advanced AI routing algorithms, the platform recommends the healthiest paths for walking, cycling, and driving, ensuring users can travel safely and breathe easier.",
    tech: ["Next.js", "TypeScript", "Node.js", "Gemini API", "Langchain", "AI Agent",],
    category: "Full Stack",
    icon: "none",
    bgGradient: "bg-gradient-to-br from-indigo-900/25 via-blue-900/15 to-transparent",
  },
];
