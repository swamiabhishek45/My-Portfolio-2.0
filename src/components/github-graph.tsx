"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  GITHUB_USERNAME,
  monthLabelsFromWeeks,
  type ContributionDay,
  type ContributionMonth,
  type ContributionWeek,
} from "@/lib/github-contribution-calendar";
import type { ContributionYear } from "@/lib/github-contributions";
import { cn } from "@/lib/utils";

const CONTRIBUTIONS_CACHE_TTL_MS = 60 * 60 * 1000;
const FIRST_CONTRIBUTION_YEAR = 2022;

function currentCalendarYear() {
  return new Date().getFullYear();
}

interface ContributionLevel {
  cell: string;
}

interface TooltipState {
  count: number;
  date: string;
  x: number;
  y: number;
}

type CachedContributions = {
  cachedAt: number;
  weeks: ContributionWeek[];
  months: ContributionMonth[];
  totalContributions: number;
};

type YearOption = {
  value: ContributionYear;
  label: string;
};

const DASHED_LINE_MASK = {
  maskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
  WebkitMaskImage:
    "repeating-linear-gradient(to right, black 0, black 1px, transparent 1px, transparent 6px)",
};

const SKELETON_WEEK_COLUMNS = 53;

function yearOptions(): YearOption[] {
  const currentYear = currentCalendarYear();
  const calendarYears: YearOption[] = [];
  for (let year = currentYear; year >= FIRST_CONTRIBUTION_YEAR; year -= 1) {
    calendarYears.push({ value: year, label: String(year) });
  }
  return calendarYears;
}

function yearQueryParam(year: ContributionYear): string {
  return String(year);
}

function cacheKeyForYear(year: ContributionYear): string {
  return `github_contributions_${GITHUB_USERNAME}_${yearQueryParam(year)}`;
}

export function GithubGraph() {
  const yearChoices = useMemo(() => yearOptions(), []);
  const [selectedYear, setSelectedYear] = useState<ContributionYear>(
    currentCalendarYear
  );
  const [yearMenuOpen, setYearMenuOpen] = useState(false);
  const yearMenuRef = useRef<HTMLDivElement>(null);

  const [weeks, setWeeks] = useState<ContributionWeek[]>([]);
  const [months, setMonths] = useState<ContributionMonth[]>([]);
  const [totalContributions, setTotalContributions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const selectedYearLabel =
    yearChoices.find((option) => option.value === selectedYear)?.label ??
    String(currentCalendarYear());

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (
        yearMenuRef.current &&
        !yearMenuRef.current.contains(event.target as Node)
      ) {
        setYearMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => document.removeEventListener("mousedown", handlePointerDown);
  }, []);

  useEffect(() => {
    const cacheKey = cacheKeyForYear(selectedYear);

    const applyCalendar = (calendar: {
      weeks: ContributionWeek[];
      months: ContributionMonth[];
      totalContributions: number;
    }) => {
      setWeeks(calendar.weeks);
      setMonths(calendar.months);
      setTotalContributions(calendar.totalContributions);
    };

    const fetchContributions = async () => {
      setLoading(true);
      setTooltip(null);

      const cachedRaw =
        typeof window !== "undefined" ? localStorage.getItem(cacheKey) : null;

      if (cachedRaw) {
        try {
          const parsed = JSON.parse(cachedRaw) as CachedContributions;
          const isFresh =
            typeof parsed.cachedAt === "number" &&
            Date.now() - parsed.cachedAt < CONTRIBUTIONS_CACHE_TTL_MS;

          if (isFresh && parsed.weeks?.length) {
            applyCalendar(parsed);
            setLoading(false);
          }
        } catch {
          // ignore invalid cache
        }
      }

      try {
        const response = await fetch(
          `/api/github/contributions?username=${encodeURIComponent(GITHUB_USERNAME)}&year=${encodeURIComponent(yearQueryParam(selectedYear))}`,
          { cache: "no-store" }
        );

        if (!response.ok) {
          throw new Error(`Contributions API failed (${response.status})`);
        }

        const calendar = (await response.json()) as {
          weeks: ContributionWeek[];
          months: ContributionMonth[];
          totalContributions: number;
        };

        applyCalendar(calendar);

        if (typeof window !== "undefined") {
          localStorage.setItem(
            cacheKey,
            JSON.stringify({
              cachedAt: Date.now(),
              weeks: calendar.weeks,
              months: calendar.months,
              totalContributions: calendar.totalContributions,
            })
          );
        }
      } catch (error) {
        console.error("Failed to fetch GitHub contributions", error);
      } finally {
        setLoading(false);
      }
    };

    void fetchContributions();
  }, [selectedYear]);

  const contributionLevels = useMemo<ContributionLevel[]>(
    () => [
      { cell: "bg-zinc-100 dark:bg-zinc-800" },
      { cell: "bg-zinc-300 dark:bg-zinc-600" },
      { cell: "bg-zinc-500 dark:bg-zinc-500" },
      { cell: "bg-zinc-700 dark:bg-zinc-300" },
      { cell: "bg-zinc-950 dark:bg-zinc-100" },
    ],
    []
  );

  const getLevel = (count: number) => {
    if (count === 0) return 0;
    if (count <= 3) return 1;
    if (count <= 6) return 2;
    if (count <= 9) return 3;
    return 4;
  };

  const formatDate = (date: string) =>
    new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(`${date}T00:00:00`));

  const showTooltip = (
    day: ContributionDay,
    event:
      | React.MouseEvent<HTMLDivElement>
      | React.FocusEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setTooltip({
      count: day.contributionCount,
      date: formatDate(day.date),
      x: rect.left + rect.width / 2,
      y: rect.top,
    });
  };

  const monthLabels = useMemo(() => monthLabelsFromWeeks(weeks), [weeks]);

  const weekColumnCount =
    weeks.length > 0 ? weeks.length : SKELETON_WEEK_COLUMNS;

  const weekGridStyle = {
    gridTemplateColumns: `repeat(${weekColumnCount}, minmax(0, 1fr))`,
  };

  const graphStatus =
    loading && totalContributions === 0
      ? "Loading GitHub contribution activity"
      : `${totalContributions.toLocaleString("en")} GitHub activities in ${selectedYear}`;

  return (
    <section
      className="relative z-10 flex flex-col scroll-mt-24"
      aria-labelledby="github-activity-title"
      aria-describedby="github-activity-summary"
    >
      <div
        className="pointer-events-none absolute top-0 right-[-100vw] left-[-100vw] h-0 border-t border-black/30 dark:border-white/[0.15]"
        style={DASHED_LINE_MASK}
      />
      <div className="pointer-events-none absolute top-0 -left-4 z-20 hidden size-[2px] -translate-x-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/[0.25] md:block" />
      <div className="pointer-events-none absolute top-0 -right-4 z-20 hidden size-[2px] translate-x-1/2 -translate-y-1/2 bg-black/50 dark:bg-white/[0.25] md:block" />

      <div className="relative py-2">
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-3 gap-y-1">
          <h2
            id="github-activity-title"
            className="text-[18px] font-bold tracking-tight text-zinc-900 dark:text-zinc-100"
          >
            GitHub Activity
          </h2>

          <p
            className="text-center text-[11px] text-zinc-500 dark:text-zinc-400"
            aria-live="polite"
          >
            {graphStatus}
          </p>

          <div className="relative flex justify-end" ref={yearMenuRef}>
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={yearMenuOpen}
              aria-label="Select contribution year"
              onClick={() => setYearMenuOpen((open) => !open)}
              className="flex items-center gap-1 rounded-md border border-zinc-300/80 bg-white/80 px-2 py-1 text-[11px] font-medium text-zinc-700 shadow-sm transition-colors hover:bg-zinc-50 dark:border-white/15 dark:bg-zinc-900/80 dark:text-zinc-200 dark:hover:bg-zinc-800/90"
            >
              <span>{selectedYearLabel}</span>
              <ChevronDown
                className={cn(
                  "size-3.5 opacity-70 transition-transform",
                  yearMenuOpen && "rotate-180"
                )}
              />
            </button>

            {yearMenuOpen ? (
              <ul
                role="listbox"
                aria-label="Contribution years"
                className="absolute right-0 top-7 z-50 mt-1 max-h-56 w-40 overflow-y-auto rounded-md border border-zinc-200 bg-white py-1 shadow-lg dark:border-white/10 dark:bg-zinc-950"
              >
                {yearChoices.map((option) => {
                  const isSelected = option.value === selectedYear;
                  return (
                    <li key={yearQueryParam(option.value)} role="option" aria-selected={isSelected}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedYear(option.value);
                          setYearMenuOpen(false);
                        }}
                        className={cn(
                          "w-full px-3 py-1.5 text-left text-[11px] transition-colors",
                          isSelected
                            ? "bg-zinc-100 font-medium text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100"
                            : "text-zinc-600 hover:bg-zinc-50 dark:text-zinc-400 dark:hover:bg-zinc-900"
                        )}
                      >
                        {option.label}
                      </button>
                    </li>
                  );
                })}
              </ul>
            ) : null}
          </div>
        </div>

        <div
          className="pointer-events-none absolute right-[-100vw] bottom-0 left-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15]"
          style={DASHED_LINE_MASK}
        />
        <div className="pointer-events-none absolute bottom-0 -left-4 z-20 hidden size-[2px] -translate-x-1/2 translate-y-1/2 bg-black/50 dark:bg-white/[0.25] md:block" />
        <div className="pointer-events-none absolute -right-4 bottom-0 z-20 hidden size-[2px] translate-x-1/2 translate-y-1/2 bg-black/50 dark:bg-white/[0.25] md:block" />
      </div>

      <p id="github-activity-summary" className="sr-only">
        Calendar heatmap showing daily GitHub contribution counts for{" "}
        {GITHUB_USERNAME} during {selectedYear}.
      </p>

      <div className="relative pt-2 pb-4">
        <div className="w-full">
          <div
            className="relative mb-1.5 h-3.5 overflow-visible text-[10px] leading-none text-zinc-400 dark:text-zinc-500"
            aria-hidden="true"
          >
            {monthLabels.map(({ weekIndex, label }) => (
              <span
                key={weekIndex}
                className="absolute top-0 whitespace-nowrap"
                style={{
                  left:
                    weekColumnCount > 1
                      ? `${(weekIndex / weekColumnCount) * 100}%`
                      : "0%",
                }}
              >
                {label}
              </span>
            ))}
          </div>

          <div
            className={cn(
              "grid gap-x-[2px]",
              loading && weeks.length > 0 && "opacity-60"
            )}
            style={weekGridStyle}
            role="img"
            aria-label={graphStatus}
          >
            {loading && weeks.length === 0
              ? Array.from({ length: weekColumnCount }).map((_, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-[2px]">
                    {Array.from({ length: 7 }).map((__, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="aspect-square w-full animate-pulse rounded-[2px] bg-zinc-100 dark:bg-zinc-800"
                      />
                    ))}
                  </div>
                ))
              : weeks.map((week, colIndex) => (
                  <div key={colIndex} className="flex flex-col gap-[2px]">
                    {colIndex === 0 &&
                      Array.from({
                        length: 7 - week.contributionDays.length,
                      }).map((_, i) => (
                        <div
                          key={`empty-top-${i}`}
                          className="aspect-square w-full rounded-[2px] bg-transparent"
                        />
                      ))}

                    {week.contributionDays.map((day) => {
                      const level = getLevel(day.contributionCount);
                      const color = contributionLevels[level];

                      return (
                        <div
                          key={day.date}
                          tabIndex={0}
                          aria-label={`${day.contributionCount} contributions on ${formatDate(day.date)}`}
                          className={`aspect-square w-full rounded-[2px] opacity-80 outline-none transition-[opacity,transform] hover:scale-125 hover:opacity-100 focus-visible:ring-1 focus-visible:ring-zinc-400 dark:opacity-70 dark:hover:opacity-100 dark:focus-visible:ring-zinc-500 ${color.cell}`}
                          onMouseEnter={(event) => showTooltip(day, event)}
                          onMouseLeave={() => setTooltip(null)}
                          onFocus={(event) => showTooltip(day, event)}
                          onBlur={() => setTooltip(null)}
                        />
                      );
                    })}

                    {colIndex !== 0 &&
                      week.contributionDays.length < 7 &&
                      Array.from({
                        length: 7 - week.contributionDays.length,
                      }).map((_, i) => (
                        <div
                          key={`empty-bottom-${i}`}
                          className="aspect-square w-full rounded-[2px] bg-transparent"
                        />
                      ))}
                  </div>
                ))}
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
            Less active
          </span>
          <div className="flex shrink-0 items-center gap-1.5">
            {contributionLevels.map((level, index) => (
              <div
                key={index}
                aria-hidden="true"
                className={`size-2 rounded-[2px] opacity-80 dark:opacity-70 ${level.cell}`}
              />
            ))}
            <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
              More active
            </span>
          </div>
        </div>

        {tooltip ? (
          <div
            className="pointer-events-none fixed z-[100] -translate-x-1/2 -translate-y-[calc(100%+8px)] rounded-md border border-zinc-200 bg-white px-2.5 py-1.5 text-[11px] font-medium text-zinc-700 shadow-lg shadow-zinc-950/10 dark:border-white/10 dark:bg-zinc-950 dark:text-zinc-200 dark:shadow-black/40"
            style={{ left: tooltip.x, top: tooltip.y }}
          >
            {tooltip.count} contributions on {tooltip.date}
          </div>
        ) : null}
      </div>

      <div
        className="pointer-events-none absolute right-[-100vw] bottom-0 left-[-100vw] h-0 border-b border-black/30 dark:border-white/[0.15]"
        style={DASHED_LINE_MASK}
      />
      <div className="pointer-events-none absolute bottom-0 -left-4 z-20 hidden size-[2px] -translate-x-1/2 translate-y-1/2 bg-black/50 dark:bg-white/[0.25] md:block" />
      <div className="pointer-events-none absolute -right-4 bottom-0 z-20 hidden size-[2px] translate-x-1/2 translate-y-1/2 bg-black/50 dark:bg-white/[0.25] md:block" />
    </section>
  );
}
