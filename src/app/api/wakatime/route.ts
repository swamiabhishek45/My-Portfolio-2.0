import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const WAKATIME_API_KEY = process.env.WAKATIME_API_KEY;

function getEditorName(pluginString: string): string {
  if (!pluginString) return "VS Code";
  const str = pluginString.toLowerCase();
  
  if (str.includes("antigravity")) return "Antigravity";
  if (str.includes("cursor")) return "Cursor";
  if (str.includes("vscode") || str.includes("vs code") || str.includes("vs-code")) return "VS Code";
  if (str.includes("sublime")) return "Sublime Text";
  if (str.includes("neovim") || str.includes("nvim")) return "Neovim";
  if (str.includes("vim")) return "Vim";
  if (str.includes("intellij")) return "IntelliJ IDEA";
  if (str.includes("webstorm")) return "WebStorm";
  if (str.includes("xcode")) return "Xcode";
  if (str.includes("atom")) return "Atom";
  if (str.includes("emacs")) return "Emacs";

  // Try regex matching fallback
  const match = pluginString.match(/([\w-]+)-wakatime/i);
  if (match) {
    const name = match[1];
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  return "VS Code";
}

export async function GET() {
  const cacheHeaders = {
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
  };

  // If API key is not configured, return realistic mock data matching the user's requirements
  if (!WAKATIME_API_KEY) {
    return NextResponse.json({
      status: "coding",
      editor: "Antigravity",
      project: "My-Portfolio-2.0",
      language: "TypeScript",
      lastActive: new Date().toISOString(),
      activeTimeToday: "45 mins",
      isMock: true,
    }, {
      headers: cacheHeaders,
    });
  }

  try {
    const basic = Buffer.from(WAKATIME_API_KEY).toString("base64");
    
    // Fetch both the current user details and today's status bar data in parallel
    const [userRes, statusBarRes] = await Promise.all([
      fetch("https://wakatime.com/api/v1/users/current", {
        headers: {
          Authorization: `Basic ${basic}`,
        },
        cache: "no-store",
      }),
      fetch("https://wakatime.com/api/v1/users/current/status_bar/today", {
        headers: {
          Authorization: `Basic ${basic}`,
        },
        cache: "no-store",
      }).catch((err) => {
        console.error("Failed to fetch WakaTime status_bar/today:", err);
        return null;
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

    // Try parsing status bar data for active time today
    let activeTimeToday = "0 mins";
    if (statusBarRes && statusBarRes.ok) {
      try {
        const statusBarData = await statusBarRes.json();
        activeTimeToday = statusBarData?.data?.grand_total?.text || "0 mins";
      } catch (err) {
        console.error("Failed to parse WakaTime status bar JSON:", err);
      }
    }

    const lastHeartbeatAt = data.last_heartbeat_at;
    const lastProject = data.last_project || "Unknown Project";
    const lastLanguage = data.last_language || "TypeScript";
    const lastPlugin = data.last_plugin || "";

    if (!lastHeartbeatAt) {
      return NextResponse.json({
        status: "idle",
        editor: "Unknown",
        project: null,
        language: null,
        lastActive: null,
        activeTimeToday,
        isMock: false,
      }, {
        headers: cacheHeaders,
      });
    }

    // Determine status logic:
    // If activity is detected within the last 5 minutes (300,000 ms), show "coding"
    const lastActiveTime = new Date(lastHeartbeatAt).getTime();
    const currentTime = Date.now();
    const timeDiffMs = currentTime - lastActiveTime;
    const isCoding = timeDiffMs <= 5 * 60 * 1000; // 5 minutes

    const status = isCoding ? "coding" : "idle";
    const editor = getEditorName(lastPlugin);

    return NextResponse.json({
      status,
      editor,
      project: lastProject,
      language: lastLanguage,
      lastActive: lastHeartbeatAt,
      activeTimeToday,
      isMock: false,
    }, {
      headers: cacheHeaders,
    });
  } catch (error) {
    console.error("Error in WakaTime developer status API:", error);
    // Fallback in case of server/API issues
    return NextResponse.json({
      status: "idle",
      editor: "Cursor",
      project: "My-Portfolio-2.0",
      language: "TypeScript",
      lastActive: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      activeTimeToday: "12 mins",
      isMock: true,
      error: error instanceof Error ? error.message : "Unknown error",
    }, {
      headers: cacheHeaders,
    });
  }
}
