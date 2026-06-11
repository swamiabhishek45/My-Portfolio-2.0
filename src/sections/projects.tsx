"use client";

import { projects } from "@/data/projects";
import Link from "next/link";
import Image from "next/image";
import { 
  Lock, 
  Settings, 
  AlertCircle, 
  ExternalLink, 
  Github, 
  Zap, 
  Sparkles, 
  ArrowRight 
} from "lucide-react";

export default function Projects() {
  const proj = projects;

  return (
    <section className="flex flex-col w-full">
      {/* Title */}
      <div className="flex justify-start mb-6">
        <div className="inline-flex items-center px-3 py-1 border border-dashed border-neutral-300 dark:border-neutral-700/60 rounded-md text-sm font-medium text-neutral-600 dark:text-neutral-300 select-none bg-neutral-50 dark:bg-neutral-900/20">
          My Projects
        </div>
      </div>

      {/* Projects List */}
      <div className="flex flex-col gap-6">
        {proj.map((project, index) => (
          <div
            key={index}
            className="border border-dashed border-neutral-200 dark:border-neutral-800 rounded-xl p-5 md:p-6 flex flex-col md:flex-row gap-6 items-stretch bg-white dark:bg-neutral-950/20 hover:border-neutral-300 dark:hover:border-neutral-700 transition-all duration-300"
          >
            {/* Left: Screenshot wrapper */}
            <div className={`relative w-full md:w-[42%] p-4 rounded-xl ${project.bgGradient} flex items-center justify-center min-h-[200px] md:min-h-0`}>
              {/* Browser mockup wrapper */}
              <div className="relative w-full aspect-[16/10] rounded-lg overflow-hidden border border-neutral-200 dark:border-white/10 shadow-2xl bg-neutral-950 flex flex-col">
                {/* Browser top bar */}
                <div className="h-7 bg-neutral-900 px-3 flex items-center justify-between border-b border-neutral-800 dark:border-white/5 select-none">
                  {/* Left dots */}
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full bg-[#ff5f56]" />
                    <div className="w-2 h-2 rounded-full bg-[#ffbd2e]" />
                    <div className="w-2 h-2 rounded-full bg-[#27c93f]" />
                  </div>
                  {/* Right small symbol */}
                  {project.badgeType === "lightning" && (
                    <Zap className="w-3 h-3 text-neutral-400 fill-neutral-400" />
                  )}
                  {project.badgeType === "spark" && (
                    <Sparkles className="w-3 h-3 text-neutral-400 fill-neutral-400 animate-pulse" />
                  )}
                </div>
                {/* Browser body */}
                <div className="relative flex-1 w-full bg-neutral-900 overflow-hidden">
                  <Image
                    src={project.src}
                    alt={project.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 40vw"
                    className="object-cover object-top select-none"
                    priority={index === 0}
                  />
                  {/* Overlay badge */}
                  {project.badge && (
                    <div className="absolute top-2.5 left-2.5 px-2.5 py-1 bg-black/80 backdrop-blur-md rounded-md text-[10px] md:text-xs font-semibold text-white border border-white/10 shadow-lg select-none">
                      {project.badge}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right: Details */}
            <div className="flex-1 flex flex-col justify-between w-full">
              <div>
                {/* Title and Action Buttons */}
                <div className="flex items-start md:items-center justify-between gap-4 mb-3">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 tracking-tight">
                      {project.name}
                    </h3>
                    {project.icon === "lock" && (
                      <Lock className="w-4 h-4 text-emerald-500 fill-emerald-500/10" />
                    )}
                    {project.icon === "settings" && (
                      <Settings className="w-4 h-4 text-neutral-400 animate-spin-slow" />
                    )}
                    {project.icon === "info" && (
                      <AlertCircle className="w-4 h-4 text-amber-500 fill-amber-500/10" />
                    )}
                  </div>

                  {/* External Links */}
                  <div className="flex items-center gap-2">
                    <a
                      href={project.live}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-200 rounded-md transition-colors whitespace-nowrap shadow-sm"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Live
                    </a>
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-3 py-1 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-800 text-xs font-bold text-neutral-700 dark:text-neutral-200 rounded-md transition-colors whitespace-nowrap shadow-sm"
                    >
                      <Github className="w-3.5 h-3.5" />
                      GitHub
                    </a>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4">
                  {project.shortDescription}
                </p>
              </div>

              {/* Technologies list */}
              <div className="mt-auto">
                <div className="text-xs font-bold text-neutral-500 dark:text-neutral-500 uppercase tracking-wider mb-2 select-none">
                  Technologies Used:
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {project.tech.map((t) => (
                    <span
                      key={t}
                      className="px-2 py-0.5 bg-neutral-100 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800/80 rounded text-xs text-neutral-700 dark:text-neutral-300 font-medium select-none shadow-xs"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer "More Projects" */}
      <div className="flex justify-end mt-4">
        <Link
          href="/projects"
          className="inline-flex items-center gap-2 px-3 py-1.5 border border-dashed border-neutral-300 dark:border-neutral-700/60 rounded-lg text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:border-neutral-400 dark:hover:border-neutral-500 transition-colors select-none"
        >
          More Projects <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </section>
  );
}
