"use client";

import { useRef } from "react";
import Image from "next/image";

import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";
import {
  ExternalLinkIcon,
  type ExternalLinkIconHandle,
} from "@/components/ui/external-link";
import { GithubIcon, type GithubIconHandle } from "@/components/ui/github";
const DEFAULT_GRADIENT =
  "bg-gradient-to-br from-neutral-200/30 via-neutral-100/10 to-neutral-950 dark:from-neutral-700/40 dark:via-neutral-900/20 dark:to-neutral-950";

const GRADIENT_PRESETS: Record<string, string> = {
  lime: "bg-gradient-to-br from-lime-300 via-emerald-200 to-green-400 dark:from-lime-500/50 dark:via-emerald-600/30 dark:to-green-800/40",
  rose: "bg-gradient-to-br from-pink-300 via-rose-200 to-orange-300 dark:from-pink-500/50 dark:via-rose-600/30 dark:to-orange-700/40",
  sky: "bg-gradient-to-br from-sky-300 via-cyan-200 to-blue-400 dark:from-sky-500/50 dark:via-cyan-600/30 dark:to-blue-800/40",
};

function resolveGradient(gradient?: string) {
  if (!gradient) return DEFAULT_GRADIENT;
  return GRADIENT_PRESETS[gradient] ?? gradient;
}

function ProjectLinkIcon({
  href,
  label,
  children,
}: {
  href: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="flex h-9 w-9 items-center justify-center rounded-lg text-neutral-500 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800/80 dark:hover:text-neutral-100"
    >
      {children}
    </a>
  );
}

export function ProjectCard({
  project,
  className,
}: {
  project: Project;
  className?: string;
}) {
  const githubRef = useRef<GithubIconHandle>(null);
  const liveLinkRef = useRef<ExternalLinkIconHandle>(null);  const tagline = project.tagline ?? project.category;
  const visibleTech = project.tech.slice(0, 5);

  return (
    <article
      className={cn(
        "group flex flex-col gap-2 rounded-xl border border-dotted border-neutral-300/80 bg-neutral-50/5 p-2 dark:border-neutral-800/80 dark:bg-neutral-950/20",
        className
      )}
    >
      <div
        className={cn(
          "relative overflow-hidden rounded-lg p-2",
          project.gradient ? resolveGradient(project.gradient) : DEFAULT_GRADIENT
        )}
      >
        <div className="relative aspect-[16/11] overflow-hidden rounded-md border border-white/20 bg-neutral-950 shadow-[0_12px_32px_-16px_rgba(0,0,0,0.75)]">
          <Image
            src={project.src}
            alt={project.name}
            fill
            sizes="(max-width: 640px) 100vw, 320px"
            quality={75}
            className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.02]"
            priority={project.order <= 1}
            loading={project.order <= 1 ? undefined : "lazy"}
          />
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-2 px-0.5 pb-0.5">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 space-y-0.5">
            <h3 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {project.name}
            </h3>
            {tagline ? (
              <p className="text-[10px] text-neutral-500 dark:text-neutral-400">
                {tagline}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-1 pt-0.5">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
            </span>
            <span className="text-[10px] font-medium text-neutral-500 dark:text-neutral-400">
              Live
            </span>
          </div>
        </div>

        <p className="line-clamp-4 text-[11px] leading-relaxed text-neutral-600 dark:text-neutral-400">
          {project.detailedDescription || project.shortDescription}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-0.5">
          <div className="flex flex-wrap gap-1.5">
            {visibleTech.map((tech) => (
              <span
                key={tech}
                className="rounded border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[10px] font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-1">
            <ProjectLinkIcon href={project.live} label={`${project.name} live site`}>
              <span
                className="flex items-center justify-center"
                onMouseEnter={() => liveLinkRef.current?.startAnimation()}
                onMouseLeave={() => liveLinkRef.current?.stopAnimation()}
              >
                <ExternalLinkIcon
                  ref={liveLinkRef}
                  size={20}
                  className="text-current"
                />
              </span>
            </ProjectLinkIcon>            <ProjectLinkIcon
              href={project.github}
              label={`${project.name} GitHub repository`}
            >
              <span
                className="flex items-center justify-center"
                onMouseEnter={() => githubRef.current?.startAnimation()}
                onMouseLeave={() => githubRef.current?.stopAnimation()}
              >
                <GithubIcon ref={githubRef} size={20} className="text-current" />
              </span>
            </ProjectLinkIcon>
          </div>
        </div>
      </div>
    </article>
  );
}
