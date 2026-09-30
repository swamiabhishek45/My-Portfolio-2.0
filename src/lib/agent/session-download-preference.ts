export const AGENT_SESSION_DOWNLOAD_STORAGE_KEY =
  "portfolio-agent-save-on-close";

export function readSessionDownloadEnabled(): boolean {
  if (typeof window === "undefined") return true;
  try {
    const raw = localStorage.getItem(AGENT_SESSION_DOWNLOAD_STORAGE_KEY);
    if (raw === null) return true;
    return raw === "true";
  } catch {
    return true;
  }
}

export function writeSessionDownloadEnabled(enabled: boolean): void {
  try {
    localStorage.setItem(
      AGENT_SESSION_DOWNLOAD_STORAGE_KEY,
      enabled ? "true" : "false"
    );
  } catch {
    /* private mode / quota */
  }
}
