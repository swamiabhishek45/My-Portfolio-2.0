import { aboutBullets } from "@/data/about";
import { books } from "@/data/books";
import { careerData } from "@/data/career";
import { overviewData } from "@/data/overview";
import { skillMarqueeRows } from "@/data/technologies";
import { formatCareerAsText } from "@/lib/agent/career-text";
import { getProjects } from "@/lib/projects";

/** Static portfolio context when Qdrant RAG is empty or unavailable. */
export function buildLocalPortfolioContext(): string {
  const projects = getProjects()
    .map(
      (p) =>
        `- ${p.name} (${p.slug}): ${p.shortDescription}. Tech: ${p.tech.join(", ")}.`
    )
    .join("\n");

  const bookList = books
    .slice(0, 12)
    .map((b) => `- ${b.title} by ${b.author} (${b.status})`)
    .join("\n");

  const skills = skillMarqueeRows
    .flatMap((row) => row.items.map((item) => item.name))
    .join(", ");

  const about = aboutBullets
    .map((b) => b.segments.map((s) => s.text).join(""))
    .join(" ");

  const topProjects = getProjects()
    .slice(0, 3)
    .map((p) => p.name)
    .join(", ");

  return [
    `Name: Abhishek Swami. Roles: ${overviewData.roles.map((r) => r.title).join(", ")}.`,
    `Location: ${overviewData.location}. Website: ${overviewData.website}.`,
    `Headline: ${careerData.headline}. Current focus: ${careerData.currentFocus.summary}`,
    `Top projects: ${topProjects}.`,
    `About: ${about}`,
    `Skills: ${skills}`,
    `Projects:\n${projects}`,
    `Books (sample):\n${bookList}`,
    `Career:\n${formatCareerAsText()}`,
  ].join("\n\n");
}
