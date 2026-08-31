import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;

const cacheHeaders = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

function wakatimeAuthHeader(): string {
  if (!WAKATIME_API_KEY) return "";
  return `Basic ${Buffer.from(`${WAKATIME_API_KEY}:`).toString("base64")}`;
}

function getEditorName(pluginString: string): string {
  if (!pluginString) return "VS Code";
  const str = pluginString.toLowerCase();

  if (str.includes("antigravity")) return "Antigravity";
  if (str.includes("cursor")) return "Cursor";
  if (str.includes("vscode") || str.includes("vs code") || str.includes("vs-code"))
    return "VS Code";
  if (str.includes("sublime")) return "Sublime Text";
  if (str.includes("neovim") || str.includes("nvim")) return "Neovim";
  if (str.includes("vim")) return "Vim";
  if (str.includes("intellij")) return "IntelliJ IDEA";
  if (str.includes("webstorm")) return "WebStorm";
  if (str.includes("xcode")) return "Xcode";
  if (str.includes("atom")) return "Atom";
  if (str.includes("emacs")) return "Emacs";

  const match = pluginString.match(/([\w-]+)-wakatime/i);
  if (match) {
    const name = match[1];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  return "VS Code";
}

function formatActiveTimeToday(statsData: {
  human_readable_total?: string;
  human_readable_total_including_other_language?: string;
  total_seconds?: number;
} | null): string | null {
  if (!statsData) return null;

  const text =
    statsData.human_readable_total ||
    statsData.human_readable_total_including_other_language;

  if (text) return text;

  const seconds = statsData.total_seconds ?? 0;
  if (seconds <= 0) return "0 mins";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours} hrs ${minutes} mins` : `${hours} hrs`;
  }

  return `${minutes} mins`;
}

export async function GET() {
  if (!WAKATIME_API_KEY) {
    return NextResponse.json(
      {
        configured: false,
        status: "idle",
        editor: null,
        project: null,
        language: null,
        lastActive: null,
        activeTimeToday: null,
      },
      { headers: cacheHeaders }
    );
  }

  try {
    const auth = wakatimeAuthHeader();

    const [userRes, statsTodayRes, statusBarRes] = await Promise.all([
      fetch("https://wakatime.com/api/v1/users/current", {
        headers: { Authorization: auth },
        cache: "no-store",
      }),
      fetch("https://wakatime.com/api/v1/users/current/stats/today", {
        headers: { Authorization: auth },
        cache: "no-store",
      }),
      fetch("https://wakatime.com/api/v1/users/current/status_bar/today", {
        headers: { Authorization: auth },
        cache: "no-store",
      }),
    ]);

    if (!userRes.ok) {
      throw new Error(`WakaTime user API returned status ${userRes.status}`);
    }

    const userData = await userRes.json();
    const data = userData.data;

    if (!data) {
      throw new Error("No user data returned from WakaTime API");
    }

    let activeTimeToday: string | null = null;

    if (statsTodayRes.ok) {
      const statsTodayData = await statsTodayRes.json();
      activeTimeToday = formatActiveTimeToday(statsTodayData?.data ?? null);
    }

    if (!activeTimeToday && statusBarRes?.ok) {
      const statusBarData = await statusBarRes.json();
      activeTimeToday =
        statusBarData?.data?.grand_total?.text ??
        statusBarData?.data?.grand_total?.digital ??
        null;
    }

    const lastHeartbeatAt = data.last_heartbeat_at as string | undefined;
    const lastProject = data.last_project || "Unknown Project";
    const lastLanguage = data.last_language || "TypeScript";
    const lastPlugin = data.last_plugin || "";

    if (!lastHeartbeatAt) {
      return NextResponse.json(
        {
          configured: true,
          status: "idle",
          editor: "Unknown",
          project: null,
          language: null,
          lastActive: null,
          activeTimeToday: activeTimeToday ?? "0 mins",
        },
        { headers: cacheHeaders }
      );
    }

    const lastActiveTime = new Date(lastHeartbeatAt).getTime();
    const timeDiffMs = Date.now() - lastActiveTime;
    const isCoding = timeDiffMs <= 5 * 60 * 1000;

    return NextResponse.json(
      {
        configured: true,
        status: isCoding ? "coding" : "idle",
        editor: getEditorName(lastPlugin),
        project: lastProject,
        language: lastLanguage,
        lastActive: lastHeartbeatAt,
        activeTimeToday: activeTimeToday ?? "0 mins",
      },
      { headers: cacheHeaders }
    );
  } catch (error) {
    console.error("Error in WakaTime developer status API:", error);
    return NextResponse.json(
      {
        configured: true,
        status: "idle",
        editor: null,
        project: null,
        language: null,
        lastActive: null,
        activeTimeToday: null,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503, headers: cacheHeaders }
    );
  }
}
