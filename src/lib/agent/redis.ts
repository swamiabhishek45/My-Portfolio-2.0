import { Redis } from "@upstash/redis";

let redis: Redis | null = null;

/** Upstash Redis client; null when env is not configured (local dev uses memory fallback in quota). */
export function getRedis(): Redis | null {
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  if (!redis) {
    redis = new Redis({ url, token });
  }
  return redis;
}
