import type { ComponentType } from "react";
import {
  SiAmazon,
  SiClaude,
  SiCss3,
  SiDocker,
  SiExpress,
  SiGit,
  SiGithub,
  SiHtml5,
  SiJavascript,
  SiLangchain,
  SiLinux,
  SiNodedotjs,
  SiPostman,
  SiReact,
  SiRender,
  SiSupabase,
  SiTypescript,
  SiVercel,
  SiNetlify,
} from "react-icons/si";
import {
  CursorIcon,
  LangGraphIcon,
  McpIcon,
  NeonIcon,
  PineconeIcon,
  QdrantIcon,
} from "@/components/icons/tech-brand-icons";

export interface TechItem {
  name: string;
  icon: ComponentType<{ className?: string }>;
  color: string;
  darkColor?: string;
}

export interface TechMarqueeRow {
  /** true = scroll left to right, false = scroll right to left */
  reverse: boolean;
  items: TechItem[];
}

/** Black logo on light theme, white on dark theme. */
const monoLogo = { color: "#000000", darkColor: "#FFFFFF" } as const;

export const skillMarqueeRows: TechMarqueeRow[] = [
  {
    reverse: true,
    items: [
      { name: "Pinecone", icon: PineconeIcon, ...monoLogo },
      { name: "Qdrant", icon: QdrantIcon, color: "#DC382D" },
      { name: "LangChain", icon: SiLangchain, ...monoLogo },
      { name: "LangGraph", icon: LangGraphIcon, color: "#2D6A4F" },
      { name: "Claude", icon: SiClaude, color: "#D97757" },
      { name: "MCP", icon: McpIcon, color: "#6366F1" },
      { name: "TypeScript", icon: SiTypescript, color: "#3178C6" },
      { name: "JavaScript", icon: SiJavascript, color: "#F7DF1E" },
      { name: "React", icon: SiReact, color: "#61DAFB" },
      { name: "HTML", icon: SiHtml5, color: "#E34F26" },
      { name: "CSS", icon: SiCss3, color: "#1572B6" },
    ],
  },
  {
    reverse: false,
    items: [
      { name: "Docker", icon: SiDocker, color: "#2496ED" },
      { name: "AWS", icon: SiAmazon, color: "#FF9900" },
      { name: "Cursor", icon: CursorIcon, ...monoLogo },
      { name: "Postman", icon: SiPostman, color: "#FF6C37" },
      { name: "Git", icon: SiGit, color: "#F05032" },
      { name: "GitHub", icon: SiGithub, ...monoLogo },
      { name: "Render", icon: SiRender, color: "#46E3B7" },
      { name: "Vercel", icon: SiVercel, ...monoLogo },
      { name: "Netlify", icon: SiNetlify, color: "#00C7B7" },
      { name: "Supabase", icon: SiSupabase, color: "#3FCF8E" },
      { name: "Neon", icon: NeonIcon, color: "#00E599" },
      { name: "Node.js", icon: SiNodedotjs, color: "#339933" },
      { name: "Express.js", icon: SiExpress, ...monoLogo },
      { name: "Linux", icon: SiLinux, color: "#FCC624" },
    ],
  },
];
