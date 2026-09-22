import {
  activitiesToWeeks,
  extendWeeksToToday,
  GITHUB_USERNAME,
  monthsFromWeeks,
  type ContributionActivity,
  type ContributionCalendar,
  type ContributionMonth,
  type ContributionWeek,
} from "@/lib/github-contribution-calendar";

export {
  GITHUB_USERNAME,
  type ContributionCalendar,
  type ContributionDay,
  type ContributionMonth,
  type ContributionWeek,
} from "@/lib/github-contribution-calendar";

async function fetchFromContributionsApi(
  username: string
): Promise<ContributionCalendar> {
  const base =
    process.env.GITHUB_CONTRIBUTIONS_API_URL ??
    "https://github-contributions-api.jogruber.de";
  const response = await fetch(`${base}/v4/${username}?y=last`, {
    next: { revalidate: 3600 },
  });

  if (!response.ok) {
    throw new Error(`Contributions API responded with ${response.status}`);
  }

  const data = (await response.json()) as {
    contributions?: ContributionActivity[];
  };
  const contributions = data.contributions ?? [];
  const weeks = extendWeeksToToday(activitiesToWeeks(contributions));
  const totalContributions = contributions.reduce(
    (sum, day) => sum + day.count,
    0
  );

  return {
    weeks,
    months: monthsFromWeeks(weeks),
    totalContributions,
  };
}

async function fetchFromGitHubGraphQL(
  username: string
): Promise<ContributionCalendar | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  const to = new Date();
  const from = new Date();
  from.setFullYear(from.getFullYear() - 1);

  const query = `
    query {
      user(login: "${username}") {
        contributionsCollection(from: "${from.toISOString()}", to: "${to.toISOString()}") {
          contributionCalendar {
            totalContributions
            months { name }
            weeks {
              contributionDays {
                contributionCount
                date
              }
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
    body: JSON.stringify({ query }),
    next: { revalidate: 3600 },
  });

  const payload = await response.json();
  const calendar =
    payload?.data?.user?.contributionsCollection?.contributionCalendar;

  if (!calendar?.weeks) return null;

  const weeks = extendWeeksToToday(calendar.weeks as ContributionWeek[]);

  return {
    weeks,
    months: (calendar.months as ContributionMonth[]) ?? monthsFromWeeks(weeks),
    totalContributions: calendar.totalContributions as number,
  };
}

export async function fetchGithubContributions(
  username: string = GITHUB_USERNAME
): Promise<ContributionCalendar> {
  const fromGraphQL = await fetchFromGitHubGraphQL(username);
  if (fromGraphQL) return fromGraphQL;

  return fetchFromContributionsApi(username);
}
