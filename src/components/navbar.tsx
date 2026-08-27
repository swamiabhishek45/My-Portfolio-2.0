"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronDown, X, User, Code2, FolderCode, Sparkles, Mail, Home, Newspaper, BookOpen, Heart } from "lucide-react";
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler";

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
];

export default function Navbar() {
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle Ctrl+K / Cmd+K shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        setSearchOpen(false);
        setDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleNavigate = (item: SectionItem) => {
    setDropdownOpen(false);
    setSearchOpen(false);
    if (item.path) {
      router.push(item.path);
    } else {
      const element = document.getElementById(item.id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(`/#${item.id}`);
      }
    }
  };

  const filteredSections = SECTIONS.filter((s) =>
    s.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <nav className="w-full flex items-center justify-between py-2.5 px-4 sm:px-6 select-none font-sans">
        {/* Left: Pixel/Mono Logo "AS" */}
        <a
          href="/"
          onClick={(e) => {
            e.preventDefault();
            router.push("/");
          }}
          className="font-mono font-black text-xl sm:text-2xl tracking-wider text-neutral-900 dark:text-neutral-50 hover:opacity-80 transition-opacity"
        >
          AS
        </a>

        {/* Right Navigation & Controls */}
        <div className="flex items-center gap-3 sm:gap-4 text-xs sm:text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {/* Home Link */}
          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              router.push("/");
            }}
            className="text-neutral-900 dark:text-neutral-100 font-semibold underline underline-offset-4 decoration-2 decoration-neutral-900 dark:decoration-neutral-100 hover:opacity-80 transition-opacity"
          >
            Home
          </a>

          {/* Projects Link */}
          <a
            href="/projects"
            onClick={(e) => {
              e.preventDefault();
              router.push("/projects");
            }}
            className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
          >
            Projects
          </a>

          {/* More Dropdown */}
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
                <button
                  onClick={() => handleNavigate({ id: "blog", label: "Blogs", icon: Newspaper, path: "/blog" })}
                  className="px-3 py-1.5 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>Blogs</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </button>
                <button
                  onClick={() => handleNavigate({ id: "books", label: "Books", icon: BookOpen, path: "/books" })}
                  className="px-3 py-1.5 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>Books</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </button>
                <button
                  onClick={() => handleNavigate({ id: "favorites", label: "Favorites", icon: Heart, path: "/favorites" })}
                  className="px-3 py-1.5 text-left text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800/60 hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors cursor-pointer flex items-center justify-between"
                >
                  <span>Favorites</span>
                  <span className="text-[10px] opacity-60">↗</span>
                </button>
              </div>
            )}
          </div>

          {/* Search Trigger Button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-dotted border-neutral-300 dark:border-neutral-700 bg-neutral-100/80 dark:bg-neutral-800/50 hover:bg-neutral-200/80 dark:hover:bg-neutral-700/50 text-xs font-mono text-neutral-500 dark:text-neutral-400 transition-all cursor-pointer"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="flex items-center gap-0.5">
              <kbd className="px-1 py-0.5 text-[10px] bg-neutral-200 dark:bg-neutral-700/60 rounded font-sans leading-none">
                Ctrl
              </kbd>
              <kbd className="px-1 py-0.5 text-[10px] bg-neutral-200 dark:bg-neutral-700/60 rounded font-sans leading-none">
                K
              </kbd>
            </span>
          </button>

          {/* Vertical Divider */}
          <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-700" />

          {/* Theme Toggler */}
          <div className="flex items-center justify-center">
            <AnimatedThemeToggler />
          </div>
        </div>
      </nav>

      {/* Search Command Palette Overlay Modal */}
      {searchOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
          <div className="w-full max-w-md bg-white dark:bg-neutral-900 border border-dotted border-neutral-300 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden font-mono text-sm">
            {/* Input Header */}
            <div className="flex items-center px-3.5 border-b border-dotted border-neutral-200 dark:border-neutral-800">
              <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-2" />
              <input
                type="text"
                autoFocus
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Type section name or page..."
                className="w-full py-3 bg-transparent text-neutral-900 dark:text-neutral-100 placeholder-neutral-400 focus:outline-none text-xs sm:text-sm"
              />
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 rounded cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Results List */}
            <div className="p-2 max-h-64 overflow-y-auto flex flex-col gap-1">
              {filteredSections.length > 0 ? (
                filteredSections.map((sec) => {
                  const Icon = sec.icon;
                  return (
                    <button
                      key={sec.id}
                      onClick={() => handleNavigate(sec)}
                      className="flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon className="w-4 h-4 text-neutral-500" />
                        <span>{sec.label}</span>
                      </div>
                      {sec.path && (
                        <span className="text-[10px] text-neutral-400">Page ↗</span>
                      )}
                    </button>
                  );
                })
              ) : (
                <div className="p-4 text-center text-xs text-neutral-400">
                  No matching sections or pages found.
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
