export interface AboutSegment {
  text: string;
  bold: boolean;
}

export interface AboutBullet {
  segments: AboutSegment[];
}

export const aboutBullets: AboutBullet[] = [
  {
    segments: [
      { text: "Full Stack GenAI Engineer", bold: true },
      { text: " in Pune — ", bold: false },
      { text: "AI agents, RAG & LLM workflows", bold: true },
      { text: ".", bold: false },
    ],
  },
  {
    segments: [
      { text: "Skilled in ", bold: false },
      {
        text: "Next.js, TypeScript, Node.js, MongoDB, PostgreSQL & pgvector",
        bold: true,
      },
      { text: ".", bold: false },
    ],
  },
  {
    segments: [
      { text: "Full Stack Developer at ", bold: false },
      { text: "One Union Solutions", bold: true },
      { text: "; building GenAI projects like ", bold: false },
      { text: "OpenBook & Kikoyu", bold: true },
      { text: ".", bold: false },
    ],
  },
  {
    segments: [
      { text: "B.Tech CSE ", bold: false },
      { text: "2025", bold: true },
      { text: " (", bold: false },
      { text: "8.20 CGPA", bold: true },
      { text: "); ", bold: false },
      { text: "300+ DSA", bold: true },
      { text: " problems & ", bold: false },
      { text: "100+ day", bold: true },
      { text: " coding streak.", bold: false },
    ],
  },
];
