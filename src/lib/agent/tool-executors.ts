import { aboutBullets } from "@/data/about";
import { books } from "@/data/books";
import { overviewData } from "@/data/overview";
import { skillMarqueeRows } from "@/data/technologies";
import { getCareerForAgent } from "@/lib/agent/career-text";
import { buildLocalPortfolioContext } from "@/lib/agent/local-context";
import { formatContextBlock, searchKnowledge } from "@/lib/agent/rag/qdrant";
import { rerankChunks } from "@/lib/agent/rag/rerank";
import { sanitizeProfileForAgent } from "@/lib/agent/sanitize";
import {
  getGithubActivitySummary,
  getGithubRepo,
  listGithubRepos,
  readmeExcerpt,
} from "@/lib/integrations/github-agent";
import { getGithubSummary } from "@/lib/integrations/github-summary";
import { getSpotifyNowPlaying } from "@/lib/integrations/spotify";
import { getWakaTimeToday } from "@/lib/integrations/wakatime";
import { getCachedMediumPosts } from "@/lib/medium";
import { getProjects } from "@/lib/projects";

export type AgentToolName =
  | "search_knowledge"
  | "get_project"
  | "list_books"
  | "get_book"
  | "get_profile"
  | "get_career"
  | "get_tech_stack"
  | "get_medium_posts"
  | "get_github_summary"
  | "list_github_repos"
  | "get_github_repo"
  | "get_github_activity"
  | "get_spotify_now_playing"
  | "get_wakatime_today";

export async function executeAgentTool(
  name: AgentToolName,
  args: Record<string, unknown>
): Promise<unknown> {
  switch (name) {
    case "search_knowledge": {
      const query = String(args.query ?? "");
      const chunks = rerankChunks(await searchKnowledge(query));
      const context =
        chunks.length > 0
          ? formatContextBlock(chunks)
          : buildLocalPortfolioContext();
      return {
        snippets: chunks.map((c) => ({
          text: c.text,
          title: c.payload.title,
          url: c.payload.url,
          source: c.payload.source,
        })),
        context,
        source: chunks.length > 0 ? "qdrant" : "local_portfolio_data",
      };
    }
    case "get_project": {
      const slugOrName = String(args.slugOrName ?? "").toLowerCase();
      const project = getProjects().find(
        (p) =>
          p.slug.toLowerCase() === slugOrName ||
          p.name.toLowerCase().includes(slugOrName)
      );
      if (!project) return { error: "Project not found" };
      return {
        slug: project.slug,
        name: project.name,
        category: project.category,
        tech: project.tech,
        shortDescription: project.shortDescription,
        detailedDescription: project.detailedDescription,
        github: project.github,
        live: project.live,
      };
    }
    case "list_books":
      return books.map((b) => ({
        slug: b.slug,
        title: b.title,
        author: b.author,
        status: b.status,
        rating: b.rating,
      }));
    case "get_book": {
      const slug = String(args.slug ?? "");
      const book = books.find((b) => b.slug === slug);
      return book ?? { error: "Book not found" };
    }
    case "get_profile":
      return {
        overview: sanitizeProfileForAgent(
          overviewData as unknown as Record<string, unknown>
        ),
        about: aboutBullets.map((b) =>
          b.segments.map((s) => s.text).join("")
        ),
        career: getCareerForAgent(),
        projects: getProjects().map((p) => ({
          slug: p.slug,
          name: p.name,
          shortDescription: p.shortDescription,
          tech: p.tech,
        })),
      };
    case "get_career":
      return getCareerForAgent();
    case "get_tech_stack":
      return skillMarqueeRows;
    case "get_medium_posts":
      return getCachedMediumPosts();
    case "get_github_summary":
      return getGithubSummary();
    case "list_github_repos": {
      const first = Number(args.first ?? 30);
      const after =
        typeof args.after === "string" ? args.after : undefined;
      const page = await listGithubRepos({ first, after });
      return {
        username: page.username,
        repos: page.repos.map((r) => ({
          name: r.name,
          description: r.description,
          url: r.url,
          stars: r.stargazerCount,
          language: r.primaryLanguage?.name,
          topics:
            r.repositoryTopics?.map((t) => t.topic.name).filter(Boolean) ?? [],
          updatedAt: r.updatedAt,
        })),
        pageInfo: page.pageInfo,
        error: page.error,
      };
    }
    case "get_github_repo": {
      const name = String(args.name ?? "").trim();
      if (!name) return { error: "Repository name required" };
      const { repo, error } = await getGithubRepo(name);
      if (!repo) return { error: error ?? "Not found" };
      return {
        name: repo.name,
        description: repo.description,
        url: repo.url,
        homepageUrl: repo.homepageUrl,
        stars: repo.stargazerCount,
        forks: repo.forkCount,
        language: repo.primaryLanguage?.name,
        topics:
          repo.repositoryTopics?.map((t) => t.topic.name).filter(Boolean) ?? [],
        readmeExcerpt: readmeExcerpt(repo.readmeText, 2000),
        updatedAt: repo.updatedAt,
      };
    }
    case "get_github_activity":
      return getGithubActivitySummary();
    case "get_spotify_now_playing":
      return getSpotifyNowPlaying();
    case "get_wakatime_today":
      return getWakaTimeToday();
    default:
      return { error: "Unknown tool" };
  }
}
