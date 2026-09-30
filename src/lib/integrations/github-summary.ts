const GITHUB_USER = process.env.GITHUB_USERNAME ?? "swamiabhishek45";

export async function getGithubSummary(): Promise<{
  username: string;
  repos: Array<{ name: string; description: string | null; url: string }>;
  readmeHighlights: string[];
}> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return { username: GITHUB_USER, repos: [], readmeHighlights: [] };
  }

  const query = `
    query($login: String!) {
      user(login: $login) {
        repositories(first: 10, orderBy: {field: UPDATED_AT, direction: DESC}, privacy: PUBLIC) {
          nodes {
            name
            description
            url
            object(expression: "HEAD:README.md") {
              ... on Blob { text }
            }
          }
        }
      }
    }
  `;

  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ query, variables: { login: GITHUB_USER } }),
    cache: "no-store",
  });

  const data = await response.json();
  const nodes = data?.data?.user?.repositories?.nodes ?? [];

  const repos = nodes.map(
    (n: { name: string; description: string | null; url: string }) => ({
      name: n.name,
      description: n.description,
      url: n.url,
    })
  );

  const readmeHighlights = nodes
    .map((n: { name: string; object?: { text?: string } | null }) => {
      const text = n.object?.text;
      if (!text) return null;
      const snippet = text.slice(0, 800).trim();
      return `${n.name} README:\n${snippet}`;
    })
    .filter(Boolean) as string[];

  return { username: GITHUB_USER, repos, readmeHighlights };
}
