"use client";

import type { Project } from "@/lib/projects";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import { DottedGridSection } from "@/components/ui/dotted-grid";
import Navbar from "@/components/navbar";
import { ProjectCard } from "@/components/project-card";

export default function ProjectsPageClient({
  projects,
}: {
  projects: Project[];
}) {
  const router = useRouter();

  return (
    <main className="bg-background min-h-screen overflow-x-clip py-6 font-sans text-neutral-900 transition-colors sm:py-10 dark:text-neutral-100">
      <div className="mx-auto flex max-w-5xl justify-center gap-6 px-4 sm:px-6 lg:gap-8">
        <div className="flex w-full max-w-2xl flex-col gap-6">
          <DottedGridSection id="navbar">
            <Navbar />
          </DottedGridSection>

          <DottedGridSection
            id="projects-header"
            className="flex items-center justify-between px-4 py-4 sm:px-6"
          >
            <div className="flex items-center gap-3">
              <button
                onClick={() => router.push("/")}
                aria-label="Back to home"
                className="cursor-pointer rounded-lg border border-dotted border-neutral-300 p-1.5 text-neutral-700 transition hover:bg-neutral-100 dark:border-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <IoIosArrowBack className="text-lg" />
              </button>
              <h1 className="text-xl font-bold tracking-tight text-neutral-900 sm:text-2xl dark:text-neutral-50">
                Projects
              </h1>
            </div>
            <span className="font-mono text-xs text-neutral-500">
              {projects.length} projects listed
            </span>
          </DottedGridSection>

          <DottedGridSection id="projects-grid" className="px-2 py-4 sm:px-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5">
              {projects.map((project) => (
                <ProjectCard key={project.slug} project={project} />
              ))}
            </div>
          </DottedGridSection>
        </div>
      </div>
    </main>
  );
}
