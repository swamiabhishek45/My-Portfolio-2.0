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
    src: "/livedocs.png",
    github: "https://github.com/swamiabhishek45/livedocs",
    live: "https://livedocs.vercel.app/",
    shortDescription: "Search for OSS projects with unmatched speed and precision. Eliminate noise to find the best open-source solutions. Manage your PRs/Issues in one place.",
    detailedDescription: "Search for OSS projects with unmatched speed and precision. Eliminate noise to find the best open-source solutions. Manage your PRs/Issues in one place.",
    tech: ["Typescript", "Nextjs", "PostgreSQL", "Drizzle", "Tailwind", "Github APIs"],
    category: "Full Stack",
    badge: "800+ signups",
    badgeType: "lightning",
    icon: "lock",
    bgGradient: "bg-gradient-to-br from-pink-500/20 via-purple-500/10 to-transparent",
  },

  {
    name: "Secure2FA",
    src: "/secure2fa.png",
    github: "https://github.com/swamiabhishek45/Secure2FA",
    live: "https://secure2fa.vercel.app/",
    shortDescription: "A robust two-factor authentication system implementing Time-based One-Time Password (TOTP) for enhanced application security.",
    detailedDescription: "A robust two-factor authentication system implementing Time-based One-Time Password (TOTP) for enhanced application security.",
    tech: ["JavaScript", "React", "Node.js", "MongoDB", "Java", "SpringBoot", "Spring Security"],
    category: "Security",
    icon: "info",
    bgGradient: "bg-gradient-to-br from-purple-600/20 via-blue-600/15 to-transparent",
  },
  {
    name: "Pollution Pulse",
    src: "/pollutionpulse.png",
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
