/** Payload returned by `/api/wakatime`. */
export interface WakaTimeStatus {
  status: "coding" | "idle";
  editor: string;
  project: string | null;
  language: string | null;
  lastActive: string | null;
  activeTimeToday?: string;
  isMock?: boolean;
}
