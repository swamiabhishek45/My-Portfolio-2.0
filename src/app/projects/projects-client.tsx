"use client";

import type { Project } from "@/lib/projects";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { ProjectCard } from "@/components/project-card";

export default function ProjectsPageClient({
  projects,
}: {
  projects: Project[];
}) {
  const router = useRouter();

  return (
    <section className="py-6">
      <div className="mx-auto mb-10 max-w-2xl px-3 sm:px-4">
        <div className="relative mb-8">
          <button
            onClick={() => router.push("/")}
            className="absolute top-1/2 left-4 -translate-y-1/2 cursor-pointer text-2xl transition hover:opacity-70"
          >
            <IoIosArrowBack />
          </button>

          <div className="rounded-xl border border-neutral-300 py-3 dark:border-neutral-800">
            <h2 className="text-center text-2xl font-bold">Projects</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
