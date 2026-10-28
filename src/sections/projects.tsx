"use client";

import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";
import Link from "next/link";

export default function Projects({
  projects,
  limit,
}: {
  projects: Project[];
  limit?: number;
}) {
  const visibleProjects = limit ? projects.slice(0, limit) : projects;
  const showMoreButton = Boolean(limit && projects.length > limit);

  return (
    <section className="flex w-full flex-col">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {showMoreButton ? (
        <div className="relative z-10 mt-6 flex justify-center bg-background py-4">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 rounded-xl border border-dotted border-neutral-300 bg-neutral-50/20 px-5 py-2.5 text-sm font-medium text-neutral-800 transition-colors hover:border-neutral-400 hover:bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-900/20 dark:text-neutral-200 dark:hover:border-neutral-600 dark:hover:bg-neutral-800/40"
          >
            More Projects
            <ArrowRight className="h-4 w-4 opacity-90" strokeWidth={2} aria-hidden />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
