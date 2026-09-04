import { FaGithub, FaLinkedin } from "react-icons/fa";
import { FaFilePdf, FaXTwitter } from "react-icons/fa6";
import { SiLeetcode } from "react-icons/si";

export interface SocialLink {
  name: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}

export const socialLinks: SocialLink[] = [
  { name: "X", link: "https://x.com/swamiabhishek45", icon: FaXTwitter },
  { name: "LinkedIn", link: "https://linkedin.com/in/swamiabhishek45", icon: FaLinkedin },
  { name: "GitHub", link: "https://github.com/swamiabhishek45", icon: FaGithub },
  { name: "LeetCode", link: "https://leetcode.com/swamiabhishek45", icon: SiLeetcode },
  {
    name: "Resume",
    link: "https://drive.google.com/file/d/1hoPfDhqXQQ0uPzXmZycsqhKg3AUKryZk/view?usp=sharing",
    icon: FaFilePdf,
  },
];
