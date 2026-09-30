import type { Redis } from "@upstash/redis";

import { getRedis } from "@/lib/agent/redis";

/** In-process fallback when Upstash is not configured (local dev only). */

const store = new Map<string, { value: string; expiresAt?: number }>();

function isExpired(entry: { expiresAt?: number }): boolean {
  return entry.expiresAt != null && Date.now() > entry.expiresAt;
}

export const memoryStore = {
  async get(key: string): Promise<string | null> {
    const entry = store.get(key);
    if (!entry || isExpired(entry)) {
      store.delete(key);
      return null;
    }
    return entry.value;
  },

  async set(key: string, value: string, opts?: { ex?: number }): Promise<void> {
    const expiresAt =
      opts?.ex != null ? Date.now() + opts.ex * 1000 : undefined;
    store.set(key, { value, expiresAt });
  },

  async incr(key: string): Promise<number> {
    const raw = await this.get(key);
    const next = (raw ? parseInt(raw, 10) : 0) + 1;
    await this.set(key, String(next));
    return next;
  },

  async expire(key: string, seconds: number): Promise<void> {
    const entry = store.get(key);
    if (entry) {
      entry.expiresAt = Date.now() + seconds * 1000;
    }
  },
};

function getRedisClient():
  | { type: "redis"; client: Redis }
  | { type: "memory" } {
  const client = getRedis();
  if (client) return { type: "redis", client };
  return { type: "memory" };
}

export async function kvGet(key: string): Promise<string | null> {
  const r = getRedisClient();
  if (r.type === "redis") return r.client.get<string>(key);
  return memoryStore.get(key);
}

export async function kvSet(
  key: string,
  value: string,
  opts?: { ex?: number }
): Promise<void> {
  const r = getRedisClient();
  if (r.type === "redis") {
    if (opts?.ex) await r.client.set(key, value, { ex: opts.ex });
    else await r.client.set(key, value);
    return;
  }
  await memoryStore.set(key, value, opts);
}

export async function kvIncr(key: string): Promise<number> {
  const r = getRedisClient();
  if (r.type === "redis") return r.client.incr(key);
  return memoryStore.incr(key);
}

export async function kvExpire(key: string, seconds: number): Promise<void> {
  const r = getRedisClient();
  if (r.type === "redis") {
    await r.client.expire(key, seconds);
    return;
  }
  await memoryStore.expire(key, seconds);
}

export async function kvSetNx(
  key: string,
  value: string,
  opts?: { ex?: number }
): Promise<boolean> {
  const r = getRedisClient();
  if (r.type === "redis") {
    const result = opts?.ex
      ? await r.client.set(key, value, { nx: true, ex: opts.ex })
      : await r.client.set(key, value, { nx: true });
    return result === "OK";
  }
  if (store.has(key)) return false;
  await memoryStore.set(key, value, opts);
  return true;
}
