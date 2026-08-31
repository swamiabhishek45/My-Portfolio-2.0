import { getProjects } from "@/lib/projects";
import ProjectsPageClient from "./projects-client";

export default function ProjectsPage() {
  const projects = getProjects();

  return <ProjectsPageClient projects={projects} />;
}
