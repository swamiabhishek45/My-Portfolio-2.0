import { careerData, type CareerData } from "@/data/career";

export function getCareerForAgent(): CareerData {
  return careerData;
}

/** Plain-text serialization for RAG ingest and local fallback. */
export function formatCareerAsText(data: CareerData = careerData): string {
  const sections: string[] = [
    `Headline: ${data.headline}`,
    `LinkedIn: ${data.linkedInUrl}`,
    `LinkedIn summary: ${data.linkedInSummary}`,
    "",
    "Current focus:",
    `${data.currentFocus.title} — ${data.currentFocus.summary}`,
    "Building:",
    ...data.currentFocus.building.map((b) => `- ${b}`),
    "Learning:",
    ...data.currentFocus.learning.map((l) => `- ${l}`),
    "",
    "Education:",
    ...data.education.flatMap((e) => [
      `- ${e.degree}${e.field ? ` in ${e.field}` : ""} @ ${e.institution} (${[e.startYear, e.endYear].filter(Boolean).join("–")})`,
      ...e.highlights.map((h) => `  • ${h}`),
    ]),
    "",
    "Experience:",
    ...data.experience.flatMap((x) => [
      `- ${x.role} @ ${x.company} (${x.start} – ${x.end})${x.location ? `, ${x.location}` : ""}`,
      ...x.highlights.map((h) => `  • ${h}`),
      ...(x.tech?.length ? [`  Tech: ${x.tech.join(", ")}`] : []),
    ]),
    "",
    "Achievements:",
    ...data.achievements.map(
      (a) =>
        `- ${a.title}${a.year ? ` (${a.year})` : ""}: ${a.description}${a.url ? ` ${a.url}` : ""}`
    ),
    "",
    "Certifications:",
    ...(data.certifications.length
      ? data.certifications.map(
          (c) =>
            `- ${c.name} (${c.issuer}${c.year ? `, ${c.year}` : ""})${c.url ? ` ${c.url}` : ""}`
        )
      : ["- None listed publicly"]),
    "",
    "Daily rhythm:",
    ...data.dailyRhythm.map((d) => `- ${d}`),
    "",
    "Soft skills:",
    data.softSkills.join(", "),
    "",
    "Working style:",
    ...data.workingStyle.map((w) => `- ${w}`),
    "",
    "Recruiter FAQ:",
    ...data.recruiterFaq.map((f) => `Q: ${f.question}\nA: ${f.answer}`),
    "",
    `Priority GitHub repos: ${data.prioritizedGithubRepos.join(", ")}`,
    `GitHub: ${data.githubUrl}`,
    `LeetCode: ${data.leetCodeUrl}`,
    ...(data.topicsToAvoid?.length
      ? ["Topics to avoid discussing:", ...data.topicsToAvoid.map((t) => `- ${t}`)]
      : []),
  ];

  return sections.join("\n");
}
