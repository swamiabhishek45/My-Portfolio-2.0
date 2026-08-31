import type { ComponentType } from "react";
import {
  SiDocker,
  SiExpress,
  SiJavascript,
  SiLangchain,
  SiMongodb,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiOpenai,
  SiPostgresql,
  SiPrisma,
  SiReact,
  SiTypescript,
  SiZod,
} from "react-icons/si";
import { Blocks, Bot, Cloud, Database, Package, Workflow } from "lucide-react";
import { PineconeIcon } from "@/components/icons/tech-brand-icons";

export interface TechMeta {
  icon?: ComponentType<{ className?: string }>;
  color: string;
  darkColor?: string;
}

const mono = { color: "#000000", darkColor: "#FFFFFF" } as const;

const TECH_LOOKUP: Record<string, TechMeta> = {
  typescript: { icon: SiTypescript, color: "#3178C6" },
  javascript: { icon: SiJavascript, color: "#F7DF1E" },
  "next.js": { icon: SiNextdotjs, ...mono },
  nextjs: { icon: SiNextdotjs, ...mono },
  react: { icon: SiReact, color: "#61DAFB" },
  "node.js": { icon: SiNodedotjs, color: "#339933" },
  nodejs: { icon: SiNodedotjs, color: "#339933" },
  mongodb: { icon: SiMongodb, color: "#47A248" },
  langchain: { icon: SiLangchain, ...mono },
  "gemini api": { icon: Bot, color: "#8E75B2" },
  "ai agent": { icon: Bot, color: "#10A37F" },
  openai: { icon: SiOpenai, color: "#10A37F" },
  inngest: { icon: Workflow, color: "#6366F1" },
  express: { icon: SiExpress, ...mono },
  razorpay: { icon: Blocks, color: "#0C4A6E" },
  "better auth": { icon: Blocks, color: "#18181B" },
  prisma: { icon: SiPrisma, color: "#2D3748", darkColor: "#FFFFFF" },
  docker: { icon: SiDocker, color: "#2496ED" },
  postgresql: { icon: SiPostgresql, color: "#4169E1" },
  cloudinary: { icon: Cloud, color: "#3448C5" },
  pinecone: { icon: PineconeIcon, ...mono },
  mem0: { icon: Database, color: "#F97316" },
  elevenlabs: { icon: Bot, color: "#000000", darkColor: "#FFFFFF" },
  zod: { icon: SiZod, color: "#3E67B1" },
  nextra: { icon: Package, color: "#000000", darkColor: "#FFFFFF" },
  "agent sdk": { icon: Package, color: "#F97316" },
  llm: { icon: SiOpenai, color: "#10A37F" },
  npm: { icon: SiNpm, color: "#CB3837" },
};

export function getTechMeta(name: string): TechMeta | null {
  return TECH_LOOKUP[name.trim().toLowerCase()] ?? null;
}
