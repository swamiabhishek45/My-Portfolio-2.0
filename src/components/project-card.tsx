"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";

import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";
import {
  ExternalLinkIcon,
  type ExternalLinkIconHandle,
} from "@/components/ui/external-link";
import { GithubIcon, type GithubIconHandle } from "@/components/ui/github";
// One quiet mat from the neutral ramp. A small tone shift inside a single
// neutral, so the screenshot is the only colour in the card.
const SCREENSHOT_MAT =
  "bg-gradient-to-b from-neutral-100 to-neutral-200/70 dark:from-neutral-900 dark:to-neutral-950";

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
        "group relative flex cursor-pointer flex-col gap-2 rounded-2xl border border-dotted border-neutral-300/80 bg-neutral-50/5 p-2 transition-colors hover:border-neutral-400 dark:border-neutral-800/80 dark:bg-neutral-950/20 dark:hover:border-neutral-600",
        className
      )}
    >
      <Link
        href={`/projects/${project.slug}`}
        className="absolute inset-0 z-0 rounded-2xl"
        aria-label={`View ${project.name} details`}
      />
      <div
        className="relative z-[1] pointer-events-none"
      >
      <div
        className={cn(
          "relative overflow-hidden rounded-lg p-2",
          SCREENSHOT_MAT
        )}
      >
        <div className="relative aspect-[16/11] overflow-hidden rounded-sm border border-black/10 bg-neutral-950 shadow-[0_8px_24px_-16px_rgba(0,0,0,0.5)] dark:border-white/10">
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
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                {tagline}
              </p>
            ) : null}
          </div>

          <div className="flex shrink-0 items-center gap-1 pt-0.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 dark:bg-emerald-500" aria-hidden />
            <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400">
              Live
            </span>
          </div>
        </div>

        <p className="line-clamp-4 text-xs leading-relaxed text-neutral-600 dark:text-neutral-400">
          {project.detailedDescription || project.shortDescription}
        </p>

        <div className="mt-auto flex items-end justify-between gap-2 pt-0.5">
          <div className="flex flex-wrap gap-1.5">
            {visibleTech.map((tech) => (
              <span
                key={tech}
                className="rounded border border-neutral-300 bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-700 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300"
              >
                {tech}
              </span>
            ))}
          </div>

          <div className="pointer-events-auto flex items-center gap-1">
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
      </div>
    </article>
  );
}
