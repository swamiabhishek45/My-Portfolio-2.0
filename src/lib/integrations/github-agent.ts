const GITHUB_USER = process.env.GITHUB_USERNAME ?? "swamiabhishek45";
const GITHUB_GRAPHQL = "https://api.github.com/graphql";

export type GithubRepoSummary = {
  name: string;
  description: string | null;
  url: string;
  homepageUrl?: string | null;
  stargazerCount: number;
  forkCount: number;
  isFork: boolean;
  isArchived: boolean;
  primaryLanguage?: { name: string } | null;
  repositoryTopics?: { topic: { name: string } }[];
  updatedAt?: string;
  readmeText?: string | null;
};

type GraphQLResponse<T> = { data?: T; errors?: unknown };

function getToken(): string | undefined {
  return process.env.GITHUB_TOKEN?.trim();
}

export function githubUsername(): string {
  return GITHUB_USER;
}

export function githubTokenConfigured(): boolean {
  return Boolean(getToken());
}

async function githubGraphql<T>(
  query: string,
  variables?: Record<string, unknown>
): Promise<T | null> {
  const token = getToken();
  if (!token) return null;

  const response = await fetch(GITHUB_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables }),
    cache: "no-store",
  });

  const json = (await response.json()) as GraphQLResponse<T>;
  if (!json.data) return null;
  return json.data;
}

const REPO_NODE_FIELDS = `
  name
  description
  url
  homepageUrl
  stargazerCount
  forkCount
  isFork
  isArchived
  updatedAt
  primaryLanguage { name }
  repositoryTopics(first: 10) { nodes { topic { name } } }
  object(expression: "HEAD:README.md") {
    ... on Blob { text }
  }
`;

function mapRepoNode(node: Record<string, unknown>): GithubRepoSummary {
  const topics = node.repositoryTopics as
    | { nodes?: { topic: { name: string } }[] }
    | undefined;
  const readme = node.object as { text?: string } | null | undefined;
  const topicNodes =
    topics?.nodes?.map((n) => ({ topic: n.topic })) ?? undefined;
  return {
    name: String(node.name),
    description: node.description as string | null,
    url: String(node.url),
    homepageUrl: node.homepageUrl as string | null | undefined,
    stargazerCount: Number(node.stargazerCount ?? 0),
    forkCount: Number(node.forkCount ?? 0),
    isFork: Boolean(node.isFork),
    isArchived: Boolean(node.isArchived),
    primaryLanguage: node.primaryLanguage as { name: string } | null,
    repositoryTopics: topicNodes,
    updatedAt: node.updatedAt as string | undefined,
    readmeText: readme?.text ?? null,
  };
}

export async function listGithubRepos(opts?: {
  first?: number;
  after?: string | null;
}): Promise<{
  username: string;
  repos: GithubRepoSummary[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
  error?: string;
}> {
  const first = Math.min(Math.max(opts?.first ?? 30, 1), 100);

  if (!githubTokenConfigured()) {
    return {
      username: GITHUB_USER,
      repos: [],
      pageInfo: { hasNextPage: false, endCursor: null },
      error: "GITHUB_TOKEN not configured",
    };
  }

  const query = `
    query($login: String!, $first: Int!, $after: String) {
      user(login: $login) {
        repositories(
          first: $first
          after: $after
          orderBy: { field: UPDATED_AT, direction: DESC }
          ownerAffiliations: OWNER
          privacy: PUBLIC
        ) {
          pageInfo { hasNextPage endCursor }
          nodes { ${REPO_NODE_FIELDS} }
        }
      }
    }
  `;

  const data = await githubGraphql<{
    user: {
      repositories: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        nodes: Record<string, unknown>[];
      };
    };
  }>(query, { login: GITHUB_USER, first, after: opts?.after ?? null });

  if (!data?.user?.repositories) {
    return {
      username: GITHUB_USER,
      repos: [],
      pageInfo: { hasNextPage: false, endCursor: null },
      error: "Failed to fetch repositories from GitHub",
    };
  }

  return {
    username: GITHUB_USER,
    repos: data.user.repositories.nodes.map(mapRepoNode),
    pageInfo: data.user.repositories.pageInfo,
  };
}

/** Paginate until all public repos are collected (ingest). */
export async function listAllGithubRepos(): Promise<GithubRepoSummary[]> {
  const all: GithubRepoSummary[] = [];
  let after: string | null = null;
  let hasNext = true;

  while (hasNext) {
    const page = await listGithubRepos({ first: 100, after });
    if (page.error && all.length === 0) break;
    all.push(...page.repos);
    hasNext = page.pageInfo.hasNextPage;
    after = page.pageInfo.endCursor;
    if (!hasNext) break;
  }

  return all;
}

export async function getGithubRepo(
  repoName: string
): Promise<{ repo: GithubRepoSummary | null; error?: string }> {
  if (!githubTokenConfigured()) {
    return { repo: null, error: "GITHUB_TOKEN not configured" };
  }

  const query = `
    query($owner: String!, $name: String!) {
      repository(owner: $owner, name: $name) {
        ${REPO_NODE_FIELDS}
      }
    }
  `;

  const data = await githubGraphql<{
    repository: Record<string, unknown> | null;
  }>(query, { owner: GITHUB_USER, name: repoName });

  if (!data?.repository) {
    return { repo: null, error: "Repository not found or not public" };
  }

  return { repo: mapRepoNode(data.repository) };
}

export function readmeExcerpt(
  text: string | null | undefined,
  maxLen = 1200
): string | null {
  if (!text?.trim()) return null;
  const trimmed = text.trim();
  if (trimmed.length <= maxLen) return trimmed;
  return `${trimmed.slice(0, maxLen)}…`;
}

export async function getGithubSummaryForAgent(): Promise<{
  username: string;
  repos: Array<{ name: string; description: string | null; url: string }>;
  readmeHighlights: string[];
  error?: string;
}> {
  const page = await listGithubRepos({ first: 15 });
  if (page.error) {
    return {
      username: page.username,
      repos: [],
      readmeHighlights: [],
      error: page.error,
    };
  }

  const repos = page.repos.map((n) => ({
    name: n.name,
    description: n.description,
    url: n.url,
  }));

  const readmeHighlights = page.repos
    .map((n) => {
      const snippet = readmeExcerpt(n.readmeText, 800);
      if (!snippet) return null;
      return `${n.name} README:\n${snippet}`;
    })
    .filter(Boolean) as string[];

  return { username: page.username, repos, readmeHighlights };
}

export async function getGithubActivitySummary(): Promise<{
  username: string;
  totalContributions?: number;
  activeDaysLastYear?: number;
  recentStreakHint?: string;
  error?: string;
}> {
  const { fetchGithubContributions } = await import("@/lib/github-contributions");

  try {
    const calendar = await fetchGithubContributions(GITHUB_USER, "last");
    let activeDays = 0;
    let maxStreak = 0;
    let streak = 0;

    for (const week of calendar.weeks) {
      for (const day of week.contributionDays) {
        if (day.contributionCount > 0) {
          activeDays += 1;
          streak += 1;
          maxStreak = Math.max(maxStreak, streak);
        } else {
          streak = 0;
        }
      }
    }

    return {
      username: GITHUB_USER,
      totalContributions: calendar.totalContributions,
      activeDaysLastYear: activeDays,
      recentStreakHint: `Longest streak in the last year (approx): ${maxStreak} days with activity.`,
    };
  } catch {
    return {
      username: GITHUB_USER,
      error: "Could not load contribution calendar",
    };
  }
}
