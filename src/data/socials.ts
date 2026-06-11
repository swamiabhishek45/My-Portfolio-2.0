import { FaDiscord, FaGithub, FaLinkedin, FaYoutube } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
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
  { name: "YouTube", link: "https://youtube.com/@swamiabhishek45", icon: FaYoutube },
  { name: "Discord", link: "https://discord.com/users/swamiabhishek45", icon: FaDiscord },
];
