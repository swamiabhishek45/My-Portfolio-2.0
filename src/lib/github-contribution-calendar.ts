import {
  addDays,
  eachDayOfInterval,
  format,
  getDay,
  getMonth,
  isBefore,
  parseISO,
  startOfDay,
} from "date-fns";

export const GITHUB_USERNAME = "swamiabhishek45";

export type ContributionDay = {
  contributionCount: number;
  date: string;
};

export type ContributionWeek = {
  contributionDays: ContributionDay[];
};

export type ContributionMonth = {
  name: string;
};

export type ContributionCalendar = {
  weeks: ContributionWeek[];
  months: ContributionMonth[];
  totalContributions: number;
};

export type ContributionActivity = {
  date: string;
  count: number;
  level: number;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_SHORT = MONTH_NAMES.map((name) => name.slice(0, 3));

export type ContributionMonthLabel = {
  weekIndex: number;
  label: string;
};

function todayDateString() {
  return format(startOfDay(new Date()), "yyyy-MM-dd");
}

function fillActivitiesThroughToday(
  activities: ContributionActivity[],
  endDate?: Date
): ContributionActivity[] {
  if (activities.length === 0) return [];

  const sorted = [...activities].sort((a, b) => a.date.localeCompare(b.date));
  const byDate = new Map(activities.map((a) => [a.date, a]));
  const start = parseISO(sorted[0].date);
  const end = endDate ?? startOfDay(new Date());

  return eachDayOfInterval({ start, end }).map((day) => {
    const date = format(day, "yyyy-MM-dd");
    return byDate.get(date) ?? { date, count: 0, level: 0 };
  });
}

export function activitiesToWeeks(
  activities: ContributionActivity[],
  options?: { endDate?: Date }
): ContributionWeek[] {
  const days = fillActivitiesThroughToday(activities, options?.endDate);
  if (days.length === 0) return [];

  const weeks: ContributionWeek[] = [];
  let index = 0;

  while (index < days.length) {
    const weekDays: ContributionDay[] = [];

    if (weeks.length === 0) {
      while (index < days.length) {
        const activity = days[index];
        weekDays.push({
          date: activity.date,
          contributionCount: activity.count,
        });
        index += 1;
        if (getDay(parseISO(activity.date)) === 6) break;
      }
    } else {
      for (let i = 0; i < 7 && index < days.length; i += 1) {
        const activity = days[index];
        weekDays.push({
          date: activity.date,
          contributionCount: activity.count,
        });
        index += 1;
      }
    }

    weeks.push({ contributionDays: weekDays });
  }

  return weeks;
}

export function extendWeeksToToday(weeks: ContributionWeek[]): ContributionWeek[] {
  if (weeks.length === 0) return weeks;

  const todayStr = todayDateString();
  const result = weeks.map((week) => ({
    contributionDays: week.contributionDays.filter((day) => day.date <= todayStr),
  }));

  const lastDay = result.flatMap((week) => week.contributionDays).at(-1);
  if (!lastDay) return result;

  let cursor = parseISO(lastDay.date);
  const today = parseISO(todayStr);
  const toAdd: ContributionDay[] = [];

  while (isBefore(cursor, today)) {
    cursor = addDays(cursor, 1);
    toAdd.push({
      date: format(cursor, "yyyy-MM-dd"),
      contributionCount: 0,
    });
  }

  if (toAdd.length === 0) return result;

  const out = result.map((week) => ({
    contributionDays: [...week.contributionDays],
  }));
  let remaining = [...toAdd];

  while (remaining.length > 0) {
    const week = out[out.length - 1];
    const space = 7 - week.contributionDays.length;
    if (space > 0) {
      week.contributionDays.push(...remaining.splice(0, space));
    } else {
      out.push({ contributionDays: remaining.splice(0, 7) });
    }
  }

  return out;
}

export function monthsFromWeeks(weeks: ContributionWeek[]): ContributionMonth[] {
  const months: ContributionMonth[] = [];
  let lastMonth = -1;

  for (const week of weeks) {
    const first = week.contributionDays[0];
    if (!first) continue;
    const monthIndex = getMonth(parseISO(first.date));
    if (monthIndex !== lastMonth) {
      months.push({ name: MONTH_NAMES[monthIndex] });
      lastMonth = monthIndex;
    }
  }

  return months;
}

export function monthLabelsFromWeeks(
  weeks: ContributionWeek[]
): ContributionMonthLabel[] {
  const labels = weeks.reduce<ContributionMonthLabel[]>(
    (acc, week, weekIndex) => {
      const first = week.contributionDays[0];
      if (!first) return acc;

      const label = MONTH_SHORT[getMonth(parseISO(first.date))];
      const prev = acc.at(-1);

      if (weekIndex === 0 || !prev || prev.label !== label) {
        acc.push({ weekIndex, label });
      }

      return acc;
    },
    []
  );

  return labels.filter(({ weekIndex }, index, all) => {
    const minWeeks = 3;

    if (index === 0) {
      return Boolean(all[1] && all[1].weekIndex - weekIndex >= minWeeks);
    }

    if (index === all.length - 1) {
      return weeks.slice(weekIndex).length >= minWeeks;
    }

    return true;
  });
}
