import { Ratelimit } from "@upstash/ratelimit";
import { getRedis } from "@/lib/agent/redis";

const memoryHits = new Map<string, { count: number; resetAt: number }>();

let ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;
  if (!ratelimit) {
    ratelimit = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "1 m"),
      prefix: "agent_rl",
    });
  }
  return ratelimit;
}

export async function checkAgentRateLimit(
  identifier: string
): Promise<{ success: boolean; remaining: number }> {
  const rl = getRatelimit();
  if (rl) {
    const result = await rl.limit(identifier);
    return { success: result.success, remaining: result.remaining };
  }

  const now = Date.now();
  const entry = memoryHits.get(identifier);
  if (!entry || now > entry.resetAt) {
    memoryHits.set(identifier, { count: 1, resetAt: now + 60_000 });
    return { success: true, remaining: 29 };
  }
  entry.count += 1;
  if (entry.count > 30) {
    return { success: false, remaining: 0 };
  }
  return { success: true, remaining: 30 - entry.count };
}
