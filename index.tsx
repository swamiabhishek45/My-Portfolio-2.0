"use client";

import { projects } from "@/data/projects";
import { FaGithub } from "react-icons/fa";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import ProjectModal from "@/components/ProjectModal";
import { FaPlay } from "react-icons/fa";

export default function Projects() {
  const router = useRouter();
  const [selectedProject, setSelectedProject] = useState<(typeof projects)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const proj = projects.slice(0, 3); // show only first 3

  const handleProjectClick = (project: (typeof projects)[0]) => {
    setSelectedProject(project);
    setIsModalOpen(true);
  };

  return (
    <section className="py-10">
      <h2 className="text-3xl font-bold mb-8 text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
        Featured Projects
        <span className="h-1 w-20 bg-blue-600 rounded-full ml-4 hidden sm:block"></span>
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {proj.map((project, index) => (
          <div
            key={index}
            className="group relative bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer flex flex-col"
            onClick={() => handleProjectClick(project)}
          >
            {/* Video Thumbnail Section */}
            <div className="relative aspect-video overflow-hidden bg-neutral-100 dark:bg-neutral-800">
              <video
                src={project.src}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                muted
                playsInline
                loop // Optional: loop preview on hover could be cool, but static is fine too.
              // onMouseOver={(e) => e.currentTarget.play()} // interactive preview
              // onMouseOut={(e) => e.currentTarget.pause()}
              />

              {/* Overlay with Play Button */}
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center hover:scale-110 transition-transform">
                  <FaPlay className="text-white ml-1" />
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="p-5 flex flex-col flex-grow">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {project.name}
                </h3>
                <span className="text-xs font-medium px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full">
                  {project.category}
                </span>
              </div>

              <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-3 flex-grow leading-relaxed">
                {project.shortDescription}
              </p>

              {/* Tech Stack */}
              <div className="flex flex-wrap gap-2 mb-4">
                {project.tech.slice(0, 3).map((t, i) => (
                  <span
                    key={i}
                    className="text-[10px] font-medium px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded border border-neutral-200 dark:border-neutral-700"
                  >
                    {t}
                  </span>
                ))}
                {project.tech.length > 3 && (
                  <span className="text-[10px] font-medium px-2 py-1 text-neutral-400">
                    +{project.tech.length - 3} more
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 mt-auto pt-4 border-t border-neutral-100 dark:border-neutral-800">
                <a
                  href={project.github}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()} // Prevent modal opening
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors"
                >
                  <FaGithub size={14} /> GitHub
                </a>
                <a
                  href={project.live}
                  target="_blank"
                  onClick={(e) => e.stopPropagation()} // Prevent modal opening
                  className="flex-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 text-xs font-semibold transition-colors"
                >
                  <LiaExternalLinkAltSolid size={14} /> Live Demo
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-12">
        <Link
          href="/projects"
          className="group flex items-center gap-2 px-6 py-3 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-full font-medium hover:bg-neutral-800 dark:hover:bg-neutral-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
        >
          View All Projects
          <svg
            className="w-4 h-4 transition-transform group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </Link>
      </div>

      <ProjectModal
        project={selectedProject}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </section>
  );
}
