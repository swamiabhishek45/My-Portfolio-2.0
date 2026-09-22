"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  ChevronDown,
  User,
  Code2,
  FolderCode,
  Sparkles,
  Mail,
  Home,
  Newspaper,
  BookOpen,
  Heart,
  Glasses,
} from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";
import { MobiusLoopIcon } from "@/components/mobius-loop-icon";
import { cn } from "@/lib/utils";

interface SectionItem {
  id: string;
  label: string;
  icon: React.ElementType;
  path?: string;
}

const SECTIONS: SectionItem[] = [
  { id: "header", label: "Home", icon: Home },
  { id: "overview", label: "Overview", icon: User },
  { id: "technologies", label: "Skills", icon: Code2 },
  { id: "projects", label: "Projects", icon: FolderCode, path: "/projects" },
  { id: "github", label: "Open Source", icon: Sparkles },
  { id: "contact", label: "Contact", icon: Mail },
  { id: "blog", label: "Blogs", icon: Newspaper, path: "/blog" },
  { id: "books", label: "Books", icon: BookOpen, path: "/books" },
  { id: "favorites", label: "Favorites", icon: Heart, path: "/favorites" },
  { id: "read", label: "Read", icon: Glasses, path: "/read" },
];

const activeNavClass =
  "text-neutral-900 dark:text-neutral-100 font-semibold underline underline-offset-4 decoration-2 decoration-neutral-900 dark:decoration-neutral-100 hover:opacity-80 transition-opacity";

const inactiveNavClass =
  "hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isHome = pathname === "/";
  const isProjects =
    pathname === "/projects" || pathname.startsWith("/projects/");

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigate = (item: SectionItem) => {
    setDropdownOpen(false);

    if (item.path) {
      router.push(item.path);
      return;
    }

    const element = document.getElementById(item.id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    } else {
      router.push(`/#${item.id}`);
    }
  };

  return (
    <nav className="w-full flex items-center justify-between py-2.5 px-4 sm:px-6 select-none font-sans">
      <a
        href="/"
        onClick={(e) => {
          e.preventDefault();
          router.push("/");
        }}
        className="text-neutral-900 dark:text-neutral-50 hover:opacity-80 transition-opacity"
        aria-label="Home"
      >
        <MobiusLoopIcon className="size-7 sm:size-8" />
      </a>

      <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            router.push("/");
          }}
          className={cn(isHome ? activeNavClass : inactiveNavClass)}
        >
          Home
        </a>

        <a
          href="/projects"
          onClick={(e) => {
            e.preventDefault();
            router.push("/projects");
          }}
          className={cn(isProjects ? activeNavClass : inactiveNavClass)}
        >
          Projects
        </a>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-0.5 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer"
          >
            <span>More</span>
            <ChevronDown className="w-3.5 h-3.5 opacity-70" />
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 py-1.5 bg-white/95 dark:bg-neutral-900/95 backdrop-blur-md border border-dotted border-neutral-300 dark:border-neutral-800 rounded-xl shadow-lg z-50 flex flex-col text-xs font-mono">
              {SECTIONS.filter((item) =>
                ["blog", "books", "favorites", "read"].includes(item.id)
              ).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavigate(item)}
                  className="px-3 py-1.5 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>{item.label}</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-center">
          <AnimatedThemeToggler />
        </div>
      </div>
    </nav>
  );
}
