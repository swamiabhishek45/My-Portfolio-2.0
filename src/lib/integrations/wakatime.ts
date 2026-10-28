import { formatActiveSeconds } from "@/lib/format-active-time";

export type WakaTimeStatus = {
  configured: boolean;
  status: "coding" | "idle";
  editor: string | null;
  project: string | null;
  language: string | null;
  lastActive: string | null;
  activeTimeToday: string | null;
  /** Raw seconds from WakaTime (for live UI extrapolation while coding). */
  activeSecondsToday: number | null;
  /** Server ms timestamp when this payload was built. */
  polledAt: number;
};

type WakaTimeTotals = {
  human_readable_total?: string;
  human_readable_total_including_other_language?: string;
  total_seconds?: number;
  total_seconds_including_other_language?: number;
  text?: string;
  grand_total?: {
    human_readable_total?: string;
    total_seconds?: number;
    text?: string;
  };
};

function wakatimeAuthHeader(): string {
  const key = process.env.WAKATIME_API_KEY;
  if (!key) return "";
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

function getEditorName(pluginString: string): string {
  if (!pluginString) return "VS Code";
  const str = pluginString.toLowerCase();
  if (str.includes("antigravity")) return "Antigravity";
  if (str.includes("cursor")) return "Cursor";
  if (str.includes("vscode") || str.includes("vs code")) return "VS Code";
  return "VS Code";
}

function extractSeconds(statsData: WakaTimeTotals | null): number {
  if (!statsData) return 0;
  const gt = statsData.grand_total;
  return (
    statsData.total_seconds_including_other_language ??
    statsData.total_seconds ??
    gt?.total_seconds ??
    0
  );
}

function extractHuman(statsData: WakaTimeTotals | null): string | null {
  if (!statsData) return null;
  const gt = statsData.grand_total;
  const human =
    statsData.human_readable_total_including_other_language ??
    statsData.human_readable_total ??
    statsData.text ??
    gt?.human_readable_total ??
    gt?.text;
  return human?.trim() || null;
}

async function fetchTodayActiveTime(auth: string): Promise<{
  text: string;
  seconds: number;
}> {
  const urls = [
    "https://wakatime.com/api/v1/users/current/status_bar/today",
    "https://wakatime.com/api/v1/users/current/stats/today",
  ];

  let bestSeconds = 0;
  let bestHuman: string | null = null;

  const results = await Promise.all(
    urls.map(async (url) => {
      try {
        const res = await fetch(url, {
          headers: { Authorization: auth },
          cache: "no-store",
        });
        if (!res.ok) return null;
        const json = (await res.json()) as { data?: WakaTimeTotals };
        return json.data ?? null;
      } catch {
        return null;
      }
    })
  );

  for (const data of results) {
    const seconds = extractSeconds(data);
    const human = extractHuman(data);
    if (seconds > bestSeconds) {
      bestSeconds = seconds;
      bestHuman = human;
    } else if (!bestHuman && human) {
      bestHuman = human;
    }
  }

  const text =
    bestHuman ?? formatActiveSeconds(bestSeconds) ?? "0 mins";

  return { text, seconds: bestSeconds };
}

export async function getWakaTimeToday(): Promise<WakaTimeStatus> {
  const polledAt = Date.now();

  if (!process.env.WAKATIME_API_KEY) {
    return {
      configured: false,
      status: "idle",
      editor: null,
      project: null,
      language: null,
      lastActive: null,
      activeTimeToday: null,
      activeSecondsToday: null,
      polledAt,
    };
  }

  try {
    const auth = wakatimeAuthHeader();
    const [userRes, activeToday] = await Promise.all([
      fetch("https://wakatime.com/api/v1/users/current", {
        headers: { Authorization: auth },
        cache: "no-store",
      }),
      fetchTodayActiveTime(auth),
    ]);

    if (!userRes.ok) throw new Error("WakaTime user API error");
    const userData = await userRes.json();
    const data = userData.data;
    if (!data) throw new Error("No WakaTime user data");

    const lastHeartbeatAt = data.last_heartbeat_at as string | undefined;
    const activeTimeToday =
      activeToday.text || formatActiveSeconds(activeToday.seconds);

    if (!lastHeartbeatAt) {
      return {
        configured: true,
        status: "idle",
        editor: "Unknown",
        project: null,
        language: null,
        lastActive: null,
        activeTimeToday,
        activeSecondsToday: activeToday.seconds,
        polledAt,
      };
    }

    const isCoding =
      Date.now() - new Date(lastHeartbeatAt).getTime() <= 5 * 60 * 1000;

    return {
      configured: true,
      status: isCoding ? "coding" : "idle",
      editor: getEditorName(data.last_plugin || ""),
      project: data.last_project || null,
      language: data.last_language || null,
      lastActive: lastHeartbeatAt,
      activeTimeToday,
      activeSecondsToday: activeToday.seconds,
      polledAt,
    };
  } catch {
    return {
      configured: true,
      status: "idle",
      editor: null,
      project: null,
      language: null,
      lastActive: null,
      activeTimeToday: null,
      activeSecondsToday: null,
      polledAt,
    };
  }
}
