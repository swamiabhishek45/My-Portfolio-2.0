export type WakaTimeStatus = {
  configured: boolean;
  status: "coding" | "idle";
  editor: string | null;
  project: string | null;
  language: string | null;
  lastActive: string | null;
  activeTimeToday: string | null;
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

function formatActiveTimeToday(statsData: WakaTimeTotals | null): string | null {
  if (!statsData) return null;

  const gt = statsData.grand_total;
  const human =
    statsData.human_readable_total_including_other_language ??
    statsData.human_readable_total ??
    statsData.text ??
    gt?.human_readable_total ??
    gt?.text;

  if (human?.trim()) return human.trim();

  const seconds =
    statsData.total_seconds_including_other_language ??
    statsData.total_seconds ??
    gt?.total_seconds ??
    0;

  if (seconds <= 0) return "0 mins";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours} hrs ${minutes} mins` : `${hours} hrs`;
  }
  return `${minutes} mins`;
}

async function fetchTodayActiveTime(auth: string): Promise<string | null> {
  const urls = [
    "https://wakatime.com/api/v1/users/current/status_bar/today",
    "https://wakatime.com/api/v1/users/current/stats/today",
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { Authorization: auth },
        cache: "no-store",
      });
      if (!res.ok) continue;
      const json = (await res.json()) as { data?: WakaTimeTotals };
      const formatted = formatActiveTimeToday(json.data ?? null);
      if (formatted) return formatted;
    } catch {
      /* try next endpoint */
    }
  }

  return null;
}

export async function getWakaTimeToday(): Promise<WakaTimeStatus> {
  if (!process.env.WAKATIME_API_KEY) {
    return {
      configured: false,
      status: "idle",
      editor: null,
      project: null,
      language: null,
      lastActive: null,
      activeTimeToday: null,
    };
  }

  try {
    const auth = wakatimeAuthHeader();
    const [userRes, activeTimeToday] = await Promise.all([
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
    if (!lastHeartbeatAt) {
      return {
        configured: true,
        status: "idle",
        editor: "Unknown",
        project: null,
        language: null,
        lastActive: null,
        activeTimeToday: activeTimeToday ?? "0 mins",
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
      activeTimeToday: activeTimeToday ?? "0 mins",
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
    };
  }
}
