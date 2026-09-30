const APPROX_CHARS_PER_TOKEN = 4;
const TARGET_TOKENS = 500;
const OVERLAP_RATIO = 0.12;

export function chunkText(
  text: string,
  opts?: { targetTokens?: number; overlapRatio?: number }
): string[] {
  const targetTokens = opts?.targetTokens ?? TARGET_TOKENS;
  const overlapRatio = opts?.overlapRatio ?? OVERLAP_RATIO;
  const chunkSize = targetTokens * APPROX_CHARS_PER_TOKEN;
  const overlap = Math.floor(chunkSize * overlapRatio);

  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (!normalized) return [];

  if (normalized.length <= chunkSize) return [normalized];

  const chunks: string[] = [];
  let start = 0;
  while (start < normalized.length) {
    let end = Math.min(start + chunkSize, normalized.length);
    if (end < normalized.length) {
      const slice = normalized.slice(start, end);
      const breakAt = Math.max(
        slice.lastIndexOf("\n\n"),
        slice.lastIndexOf(". "),
        slice.lastIndexOf(" ")
      );
      if (breakAt > chunkSize * 0.5) {
        end = start + breakAt + 1;
      }
    }
    chunks.push(normalized.slice(start, end).trim());
    if (end >= normalized.length) break;
    start = Math.max(end - overlap, start + 1);
  }
  return chunks.filter(Boolean);
}
