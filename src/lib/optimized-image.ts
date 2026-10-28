/**
 * Client-safe URL for Next.js Image Optimization (files in /public).
 * Keeps canvas/img loads small while retaining sharpness on retina avatars.
 */
export function optimizedImageSrc(
  src: string,
  width: number,
  quality = 75
): string {
  if (!src.startsWith("/")) return src;
  const params = new URLSearchParams({
    url: src,
    w: String(Math.round(width)),
    q: String(quality),
  });
  return `/_next/image?${params.toString()}`;
}

/** Display size × device pixel ratio, capped for avatar/banner helpers. */
export function retinaWidth(cssPx: number, max = 640): number {
  if (typeof window === "undefined") return Math.min(cssPx * 2, max);
  const dpr = window.devicePixelRatio || 1;
  return Math.min(Math.round(cssPx * dpr), max);
}
