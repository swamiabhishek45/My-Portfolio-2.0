import {
  FaApple,
  FaLinux,
  FaMicrosoft,
  FaGoogle,
  FaFacebook,
  FaCode,
  FaRocket,
  FaAmazon,
  FaLightbulb,
  FaGlobe,
} from "react-icons/fa";

export interface Quote {
  text: string;
  author: string;
}

export const quotes: Quote[] = [
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
  { text: "Innovation grows when curiosity leads.", author: "Steve Jobs" },
  { text: "Good software is born from clear minds.", author: "Bill Gates" },
  { text: "Focus on users, the rest follows soon.", author: "Larry Page" },
  { text: "Move fast, learn fast, build even faster.", author: "Mark Zuckerberg" },
  { text: "Stay simple; complexity kills progress.", author: "Dennis Ritchie" },
  { text: "Great tools empower great developers.", author: "Anders Hejlsberg" },
  { text: "Precision matters; craft code with care.", author: "Ken Thompson" },
  { text: "Create value first, optimize it later.", author: "Jeff Bezos" },
];

export interface AuthorIcons {
  left: React.ComponentType<{ className?: string }>;
  right: React.ComponentType<{ className?: string }>;
}

export const authorIcons: Record<string, AuthorIcons> = {
  "Linus Torvalds": { left: FaLinux, right: FaCode },
  "Steve Jobs": { left: FaApple, right: FaLightbulb },
  "Bill Gates": { left: FaMicrosoft, right: FaGlobe },
  "Larry Page": { left: FaGoogle, right: FaLightbulb },
  "Mark Zuckerberg": { left: FaFacebook, right: FaGlobe },
  "Dennis Ritchie": { left: FaCode, right: FaCode },
  "Anders Hejlsberg": { left: FaCode, right: FaLightbulb },
  "Ken Thompson": { left: FaCode, right: FaCode },
  "Elon Musk": { left: FaRocket, right: FaGlobe },
  "Jeff Bezos": { left: FaAmazon, right: FaGlobe },
};
