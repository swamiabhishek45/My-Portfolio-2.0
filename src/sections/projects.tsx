"use client";

import type { Project } from "@/lib/projects";
import { ProjectCard } from "@/components/project-card";

export default function Projects({ projects, limit }: { projects: Project[]; limit?: number }) {
  const visibleProjects = limit ? projects.slice(0, limit) : projects;

  return (
    <section className="flex w-full flex-col">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
        {visibleProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>
    </section>
  );
}
