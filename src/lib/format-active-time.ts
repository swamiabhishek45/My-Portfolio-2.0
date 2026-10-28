export function formatActiveSeconds(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  if (seconds <= 0) return "0 mins";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);

  if (hours > 0) {
    return minutes > 0 ? `${hours} hrs ${minutes} mins` : `${hours} hrs`;
  }
  return `${minutes} min${minutes === 1 ? "" : "s"}`;
}
