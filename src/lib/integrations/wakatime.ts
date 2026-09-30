export type WakaTimeStatus = {
  configured: boolean;
  status: "coding" | "idle";
  editor: string | null;
  project: string | null;
  language: string | null;
  lastActive: string | null;
  activeTimeToday: string | null;
};

function wakatimeAuthHeader(): string {
  const key = process.env.WAKATIME_API_KEY;
  if (!key) return "";
  return `Basic ${Buffer.from(`${key}:`).toString("base64")}`;
}

function getEditorName(pluginString: string): string {
  if (!pluginString) return "VS Code";
  const str = pluginString.toLowerCase();
  if (str.includes("cursor")) return "Cursor";
  if (str.includes("vscode") || str.includes("vs code")) return "VS Code";
  return "VS Code";
}

function formatActiveTimeToday(statsData: {
  human_readable_total?: string;
  total_seconds?: number;
} | null): string | null {
  if (!statsData) return null;
  if (statsData.human_readable_total) return statsData.human_readable_total;
  const seconds = statsData.total_seconds ?? 0;
  if (seconds <= 0) return "0 mins";
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) {
    return minutes > 0 ? `${hours} hrs ${minutes} mins` : `${hours} hrs`;
  }
  return `${minutes} mins`;
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
    const [userRes, statsTodayRes] = await Promise.all([
      fetch("https://wakatime.com/api/v1/users/current", {
        headers: { Authorization: auth },
        cache: "no-store",
      }),
      fetch("https://wakatime.com/api/v1/users/current/stats/today", {
        headers: { Authorization: auth },
        cache: "no-store",
      }),
    ]);

    if (!userRes.ok) throw new Error("WakaTime user API error");
    const userData = await userRes.json();
    const data = userData.data;
    if (!data) throw new Error("No WakaTime user data");

    let activeTimeToday: string | null = null;
    if (statsTodayRes.ok) {
      const statsTodayData = await statsTodayRes.json();
      activeTimeToday = formatActiveTimeToday(statsTodayData?.data ?? null);
    }

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
