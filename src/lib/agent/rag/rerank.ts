import type { RetrievedChunk } from "@/lib/agent/rag/types";

/** Lightweight MMR-style diversity pass (no cross-encoder). */
export function rerankChunks(
  chunks: RetrievedChunk[],
  limit = 6
): RetrievedChunk[] {
  if (chunks.length <= limit) return chunks;

  const selected: RetrievedChunk[] = [];
  const remaining = [...chunks].sort((a, b) => b.score - a.score);

  while (selected.length < limit && remaining.length > 0) {
    if (selected.length === 0) {
      selected.push(remaining.shift()!);
      continue;
    }
    let bestIdx = 0;
    let bestScore = -Infinity;
    for (let i = 0; i < remaining.length; i++) {
      const candidate = remaining[i];
      const redundancy = Math.max(
        ...selected.map((s) => jaccard(s.text, candidate.text))
      );
      const score = candidate.score - redundancy * 0.15;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }
    selected.push(remaining.splice(bestIdx, 1)[0]!);
  }

  return selected;
}

function jaccard(a: string, b: string): number {
  const sa = new Set(a.toLowerCase().split(/\s+/));
  const sb = new Set(b.toLowerCase().split(/\s+/));
  let inter = 0;
  for (const w of sa) if (sb.has(w)) inter++;
  const union = sa.size + sb.size - inter;
  return union === 0 ? 0 : inter / union;
}
