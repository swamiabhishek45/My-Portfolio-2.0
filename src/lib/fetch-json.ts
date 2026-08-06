/** Fetches JSON from an internal API route, throwing on a non-OK response. */
export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Request to ${url} failed with status ${res.status}`);
  }
  return (await res.json()) as T;
}

/** SWR fetcher built on {@link fetchJson}. */
export const jsonFetcher = <T>(url: string) => fetchJson<T>(url);
