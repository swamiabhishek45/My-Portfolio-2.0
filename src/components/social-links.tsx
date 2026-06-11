import { socialLinks } from "@/data/socials";

interface SocialLinkItemProps {
  name: string;
  link: string;
  icon: React.ComponentType<{ className?: string }>;
}

function SocialLinkItem({ name, link, icon: Icon }: SocialLinkItemProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="
        relative group 
        w-10 h-10 sm:w-12 sm:h-12 
        flex items-center justify-center 
        rounded-xl 
        bg-gradient-to-b from-white to-neutral-100 dark:from-[#22222a] dark:to-[#0c0c0e]
        border border-neutral-200/80 dark:border-neutral-800/80
        shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.9),_0_4px_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_1.5px_0_0_rgba(255,255,255,0.15),_0_4px_12px_rgba(0,0,0,0.25)]
        hover:border-neutral-300 dark:hover:border-neutral-600
        transition-all duration-300 ease-out
      "
    >
      <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-neutral-800 dark:text-neutral-200 transition-all duration-300 group-hover:text-black dark:group-hover:text-white group-hover:drop-shadow-[0_0_8px_rgba(0,0,0,0.15)] dark:group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.85)]" />
      
      {/* Tooltip */}
      <span
        className="absolute left-1/2 -translate-x-1/2 -top-10
                   px-2.5 py-1 text-xs font-semibold font-sans
                   bg-white dark:bg-neutral-900
                   text-black dark:text-white
                   rounded-md shadow-lg border border-neutral-200 dark:border-neutral-700
                   opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100
                   transition-all duration-200 whitespace-nowrap pointer-events-none z-10"
      >
        {name}
      </span>
    </a>
  );
}

export default function SocialLinks() {
  return (
    <div className="border-t border-neutral-200 dark:border-neutral-800/80 p-4 flex flex-wrap gap-3.5 bg-neutral-100/10 dark:bg-neutral-950/20 justify-start">
      {socialLinks.map((link, index) => (
        <SocialLinkItem key={index} {...link} />
      ))}
    </div>
  );
}
