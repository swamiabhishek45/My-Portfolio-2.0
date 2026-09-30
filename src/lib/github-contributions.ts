import { parseISO } from "date-fns";

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

export type ContributionYear = "last" | number;

function contributionYearQuery(year: ContributionYear): string {
  return year === "last" ? "last" : String(year);
}

function totalFromApiPayload(
  data: { total?: Record<string, number> },
  year: ContributionYear
): number | undefined {
  const total = data.total;
  if (!total) return undefined;
  if (year === "last") {
    return total.lastYear ?? total.last;
  }
  return total[String(year)];
}

function endDateForActivities(
  contributions: ContributionActivity[],
  year: ContributionYear
): Date | undefined {
  if (contributions.length === 0) return undefined;
  if (year === "last") return undefined;
  const sorted = [...contributions].sort((a, b) =>
    a.date.localeCompare(b.date)
  );
  return parseISO(sorted[sorted.length - 1].date);
}

async function fetchFromContributionsApi(
  username: string,
  year: ContributionYear = "last"
): Promise<ContributionCalendar> {
  const base =
    process.env.GITHUB_CONTRIBUTIONS_API_URL ??
    "https://github-contributions-api.jogruber.de";
  const response = await fetch(
    `${base}/v4/${username}?y=${contributionYearQuery(year)}`,
    {
      next: { revalidate: 3600 },
    }
  );

  if (!response.ok) {
    throw new Error(`Contributions API responded with ${response.status}`);
  }

  const data = (await response.json()) as {
    contributions?: ContributionActivity[];
    total?: Record<string, number>;
  };
  const contributions = data.contributions ?? [];
  const endDate = endDateForActivities(contributions, year);
  let weeks = activitiesToWeeks(contributions, { endDate });
  if (year === "last") {
    weeks = extendWeeksToToday(weeks);
  }
  const totalContributions =
    totalFromApiPayload(data, year) ??
    contributions.reduce((sum, day) => sum + day.count, 0);

  return {
    weeks,
    months: monthsFromWeeks(weeks),
    totalContributions,
  };
}

async function fetchFromGitHubGraphQL(
  username: string,
  year: ContributionYear = "last"
): Promise<ContributionCalendar | null> {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;

  let from: Date;
  let to: Date;
  if (year === "last") {
    to = new Date();
    from = new Date();
    from.setFullYear(from.getFullYear() - 1);
  } else {
    from = new Date(year, 0, 1);
    to = new Date(year, 11, 31, 23, 59, 59, 999);
  }

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

  let weeks = calendar.weeks as ContributionWeek[];
  if (year === "last") {
    weeks = extendWeeksToToday(weeks);
  }

  return {
    weeks,
    months: (calendar.months as ContributionMonth[]) ?? monthsFromWeeks(weeks),
    totalContributions: calendar.totalContributions as number,
  };
}

export async function fetchGithubContributions(
  username: string = GITHUB_USERNAME,
  year: ContributionYear = currentContributionYear()
): Promise<ContributionCalendar> {
  const fromGraphQL = await fetchFromGitHubGraphQL(username, year);
  if (fromGraphQL) return fromGraphQL;

  return fetchFromContributionsApi(username, year);
}

export function currentContributionYear(): number {
  return new Date().getFullYear();
}

export function parseContributionYearParam(
  value: string | null
): ContributionYear {
  const fallback = currentContributionYear();
  if (!value || value === "last") return fallback;
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 2008 || parsed > 2100) {
    return fallback;
  }
  return parsed;
}
