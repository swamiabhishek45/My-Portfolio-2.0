import Image from "next/image";
import Link from "next/link";
import { IoIosArrowBack } from "react-icons/io";
import { ExternalLink, Github } from "lucide-react";

import type { Project } from "@/lib/projects";
import { cn } from "@/lib/utils";
import { DottedGridSection } from "@/components/ui/dotted-grid";
import Navbar from "@/components/navbar";
import { SectionHeading } from "@/components/section-heading";

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

function DetailSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
        {title}
      </h2>
      <div className="text-sm leading-relaxed text-neutral-700 dark:text-neutral-300">
        {children}
      </div>
    </div>
  );
}

export function ProjectDetailContent({ project }: { project: Project }) {
  const tagline = project.tagline ?? project.category;

  return (
    <main className="min-h-screen overflow-x-clip bg-background py-6 font-sans text-neutral-900 transition-colors sm:py-10 dark:text-neutral-100">
      <div className="mx-auto flex max-w-5xl justify-center gap-6 px-4 sm:px-6 lg:gap-8">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <DottedGridSection id="navbar">
            <Navbar />
          </DottedGridSection>

          <DottedGridSection
            id="project-header"
            className="flex flex-wrap items-center justify-between gap-3 px-4 py-4 sm:px-6"
          >
            <div className="flex items-center gap-3">
              <Link
                href="/projects"
                className="rounded-lg border border-dotted border-neutral-300 p-1.5 text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
                aria-label="Back to projects"
              >
                <IoIosArrowBack className="text-lg" />
              </Link>
              <div>
                <SectionHeading className="text-xl sm:text-2xl">
                  {project.name}
                </SectionHeading>
                {tagline ? (
                  <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                    {tagline}
                  </p>
                ) : null}
              </div>
            </div>
            <span className="font-mono text-xs text-neutral-500">
              {project.category}
            </span>
          </DottedGridSection>

          <DottedGridSection id="project-hero" className="px-2 py-2 sm:px-3">
            <div
              className={cn(
                "overflow-hidden rounded-2xl border border-dotted border-neutral-300/80 p-3 dark:border-neutral-800/80",
                resolveGradient(project.gradient)
              )}
            >
              <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-white/20 bg-neutral-950 shadow-[0_16px_40px_-20px_rgba(0,0,0,0.85)]">
                {project.src ? (
                  <Image
                    src={project.src}
                    alt={`${project.name} preview`}
                    fill
                    sizes="(max-width: 672px) 100vw, 672px"
                    quality={75}
                    className="object-cover object-top"
                    priority
                  />
                ) : null}
              </div>
            </div>
          </DottedGridSection>

          <DottedGridSection
            id="project-body"
            className="flex flex-col gap-6 p-5 sm:p-6"
          >
            {project.problemStatement ? (
              <DetailSection title="Problem">
                <p>{project.problemStatement}</p>
              </DetailSection>
            ) : null}

            <DetailSection title="About this project">
              <p>{project.detailedDescription || project.shortDescription}</p>
            </DetailSection>

            {project.tech.length > 0 ? (
              <DetailSection title="Tech stack">
                <ul className="flex flex-wrap gap-2">
                  {project.tech.map((item) => (
                    <li
                      key={item}
                      className="rounded border border-dotted border-neutral-300 bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </DetailSection>
            ) : null}

            <div className="flex flex-wrap gap-3 border-t border-dotted border-neutral-300 pt-4 dark:border-neutral-800">
              {project.live ? (
                <a
                  href={project.live}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-dotted border-neutral-300 bg-neutral-50/30 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/50"
                >
                  <ExternalLink className="h-4 w-4" aria-hidden />
                  Live site
                </a>
              ) : null}
              {project.github ? (
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl border border-dotted border-neutral-300 bg-neutral-50/30 px-4 py-2 text-sm font-medium text-neutral-800 transition hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/30 dark:text-neutral-100 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/50"
                >
                  <Github className="h-4 w-4" aria-hidden />
                  Source on GitHub
                </a>
              ) : null}
            </div>
          </DottedGridSection>
        </div>
      </div>
    </main>
  );
}
