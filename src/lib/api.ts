import { NextResponse } from "next/server";

/** Headers that keep API route responses out of every layer of cache. */
export const NO_STORE_HEADERS = {
  "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
};

/** JSON response for a route handler whose payload must never be cached. */
export function noStoreJson<T>(data: T) {
  return NextResponse.json(data, { headers: NO_STORE_HEADERS });
}

/** `fetch` for upstream API calls that must always hit the network. */
export function fetchNoStore(url: string, init: RequestInit = {}) {
  return fetch(url, { ...init, cache: "no-store" });
}

/** Basic auth header value for the given credentials. */
export function basicAuthHeader(credentials: string) {
  return `Basic ${Buffer.from(credentials).toString("base64")}`;
}
