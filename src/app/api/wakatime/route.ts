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
  // If API key is not configured, return realistic mock data matching the user's requirements
  if (!WAKATIME_API_KEY) {
    return NextResponse.json({
      status: "coding",
      editor: "Antigravity",
      project: "My-Portfolio-2.0",
      language: "TypeScript",
      lastActive: new Date().toISOString(),
      isMock: true,
    });
  }

  try {
    const basic = Buffer.from(WAKATIME_API_KEY).toString("base64");
    
    // Fetch the current user details, which contains the latest heartbeat metadata
    const response = await fetch("https://wakatime.com/api/v1/users/current", {
      headers: {
        Authorization: `Basic ${basic}`,
      },
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(`WakaTime API returned status ${response.status}`);
    }

    const { data } = await response.json();

    if (!data) {
      throw new Error("No data returned from WakaTime API");
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
        isMock: false,
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
      isMock: false,
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
      isMock: true,
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}
