import {
  SiTypescript,
  SiExpress,
  SiNextdotjs,
  SiNodedotjs,
  SiPostgresql,
  SiReact,
  SiHtml5,
  SiTailwindcss,
  SiJavascript,
  SiC,
  SiCplusplus,
  SiMongodb,
  SiGit,
  SiGithub,
  SiPostman,
  SiLinux,
  SiCss3,
  SiMysql,
  SiSupabase,
} from "react-icons/si";

export interface TechItem {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface TechCategory {
  name: string;
  items: TechItem[];
}

export const techCategories: TechCategory[] = [
  {
    name: "Programming Languages",
    items: [
      { name: "C", icon: SiC },
      { name: "CPP", icon: SiCplusplus },
      { name: "JavaScript", icon: SiJavascript },
      { name: "TypeScript", icon: SiTypescript },
    ],
  },
  {
    name: "Frontend",
    items: [
      { name: "HTML", icon: SiHtml5 },
      { name: "CSS", icon: SiCss3 },
      { name: "React", icon: SiReact },
      { name: "Next.js", icon: SiNextdotjs },
      { name: "Tailwind CSS", icon: SiTailwindcss },
    ],
  },
  {
    name: "Backend",
    items: [
      { name: "Node.js", icon: SiNodedotjs },
      { name: "Express.js", icon: SiExpress },
      { name: "Supabase", icon: SiSupabase },
    ],
  },
  {
    name: "Database",
    items: [
      { name: "PostgreSQL", icon: SiPostgresql },
      { name: "MySQL", icon: SiMysql },
      { name: "MongoDB", icon: SiMongodb },
    ],
  },
  {
    name: "Other Tools",
    items: [
      { name: "Git", icon: SiGit },
      { name: "GitHub", icon: SiGithub },
      { name: "Postman", icon: SiPostman },
      { name: "Linux", icon: SiLinux },
    ],
  },
];
