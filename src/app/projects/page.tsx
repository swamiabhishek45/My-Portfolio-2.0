"use client";

import { projects } from "@/data/projects";
import { FaGithub } from "react-icons/fa";
import { LiaExternalLinkAltSolid } from "react-icons/lia";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";

export default function ProjectsPage() {
    const router = useRouter();

    return (
        <section className="py-6">
            <div className="max-w-4xl mx-auto px-4 mb-10">

                {/* Header — Back Arrow + Bordered Title */}
                <div className="relative mb-8">
                    <button
                        onClick={() => router.push("/")}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl hover:opacity-70 transition cursor-pointer"
                    >
                        <IoIosArrowBack />
                    </button>

                    <div className="border border-neutral-300 dark:border-neutral-800 rounded-xl py-3">
                        <h2 className="text-2xl font-bold text-center">
                            Projects
                        </h2>
                    </div>
                </div>

                {/* Project List */}
                <div className="flex flex-col gap-10">
                    {projects.map((project, index) => (
                        <div
                            key={index}
                            className="
                grid grid-cols-1 md:grid-cols-2 gap-6 items-center
                border border-neutral-300 dark:border-neutral-800
                p-10 rounded-lg shadow-sm hover:shadow-md transition
              "
                        >
                            {/* Left — Video */}
                            <div className="w-full flex justify-center">
                                <video
                                    src={project.src}
                                    className="rounded-lg shadow-md w-full max-w-sm object-cover"
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                />
                            </div>

                            {/* Right — Content */}
                            <div className="flex flex-col gap-2">
                                <h3 className="text-lg font-semibold">
                                    {project.name}
                                </h3>

                                <p className="text-xs text-neutral-700 dark:text-neutral-300 leading-relaxed whitespace-pre-line">
                                    {project.detailedDescription}
                                </p>

                                <div className="flex flex-wrap gap-2 mt-1">
                                    {project.tech.map((t, i) => (
                                        <span
                                            key={i}
                                            className="px-2 py-1 text-[10px] rounded-md bg-neutral-100 dark:bg-neutral-900 border dark:border-neutral-700"
                                        >
                                            {t}
                                        </span>
                                    ))}
                                </div>

                                <div className="flex gap-3 mt-3">
                                    <a
                                        href={project.github}
                                        target="_blank"
                                        className="flex items-center gap-1 px-3 py-1.5 border rounded-md text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                                    >
                                        <FaGithub className="text-sm" /> GitHub
                                    </a>

                                    <a
                                        href={project.live}
                                        target="_blank"
                                        className="flex items-center gap-1 px-3 py-1.5 border rounded-md text-xs hover:bg-neutral-200 dark:hover:bg-neutral-700 transition"
                                    >
                                        <LiaExternalLinkAltSolid className="text-sm" /> Live
                                    </a>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}
