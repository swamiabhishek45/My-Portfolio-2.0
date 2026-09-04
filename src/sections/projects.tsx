"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";

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
            className="group inline-flex items-center gap-2 rounded-full bg-neutral-900 px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-neutral-800 dark:bg-neutral-100 dark:text-neutral-900 dark:hover:bg-white"
          >
            More Projects
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2} />
          </Link>
        </div>
      ) : null}
    </section>
  );
}
