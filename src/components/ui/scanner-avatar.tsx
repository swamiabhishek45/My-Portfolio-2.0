"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { motion, useAnimation } from "framer-motion";

interface ScannerAvatarProps {
  primaryImage: string;
  secondaryImage: string;
  interval?: number;
  duration?: number;
  className?: string;
}

// Tint palette — one is randomly chosen per transition
// These are the BASE colors, we apply different opacities for fill vs lines
const TINT_PALETTES = [
  {
    // Soft cyan
    fill: "rgba(180, 230, 250, 0.85)",
    line: "rgba(140, 215, 245, 0.92)",
    glow: "rgba(120, 220, 255, 0.6)",
  },
  {
    // Soft mint
    fill: "rgba(180, 245, 210, 0.85)",
    line: "rgba(140, 235, 190, 0.92)",
    glow: "rgba(120, 255, 180, 0.6)",
  },
  {
    // Soft pink
    fill: "rgba(255, 200, 220, 0.85)",
    line: "rgba(250, 180, 205, 0.92)",
    glow: "rgba(255, 170, 200, 0.6)",
  },
];

export default function ScannerAvatar({
  primaryImage,
  secondaryImage,
  interval = 3000,
  duration = 650,
  className = "",
}: ScannerAvatarProps) {
  const [showPrimary, setShowPrimary] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const primaryImgRef = useRef<HTMLImageElement | null>(null);
  const secondaryImgRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number>(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const shakeControls = useAnimation();

  // Preload images
  useEffect(() => {
    const img1 = new Image();
    img1.crossOrigin = "anonymous";
    img1.src = primaryImage;
    primaryImgRef.current = img1;

    const img2 = new Image();
    img2.crossOrigin = "anonymous";
    img2.src = secondaryImage;
    secondaryImgRef.current = img2;
  }, [primaryImage, secondaryImage]);

  // Draw image with object-fit: cover behavior
  const drawImageCover = useCallback(
    (ctx: CanvasRenderingContext2D, img: HTMLImageElement, cw: number, ch: number) => {
      if (!img.complete || img.naturalWidth === 0) return;

      const imgAspect = img.naturalWidth / img.naturalHeight;
      const canvasAspect = cw / ch;

      let sx: number, sy: number, sw: number, sh: number;

      if (imgAspect > canvasAspect) {
        sh = img.naturalHeight;
        sw = sh * canvasAspect;
        sx = (img.naturalWidth - sw) / 2;
        sy = 0;
      } else {
        sw = img.naturalWidth;
        sh = sw / canvasAspect;
        sx = 0;
        sy = (img.naturalHeight - sh) / 2;
      }

      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, cw, ch);
    },
    []
  );

  const runTransition = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const rect = container.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const cw = Math.round(rect.width);
    const ch = Math.round(rect.height);

    canvas.width = cw * dpr;
    canvas.height = ch * dpr;
    canvas.style.width = `${cw}px`;
    canvas.style.height = `${ch}px`;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const currentImg = showPrimary ? primaryImgRef.current : secondaryImgRef.current;
    const nextImg = showPrimary ? secondaryImgRef.current : primaryImgRef.current;

    if (!currentImg || !nextImg) return;

    setIsTransitioning(true);

    // Pick random tint + direction
    const palette = TINT_PALETTES[Math.floor(Math.random() * TINT_PALETTES.length)];
    const scanDown = Math.random() > 0.5;

    // Thick venetian-blind stripe parameters (matching reference images)
    const stripeThickness = 4; // thick colored bars
    const stripeGap = 3; // small gaps between bars to let image peek through

    const startTime = performance.now();

    // Phase 1: Activation shake
    shakeControls.start({
      x: [0, -2, 3, -2, 2, -3, 2, -1, 0],
      transition: { duration: 0.1, ease: "linear" },
    });

    const animate = (now: number) => {
      const elapsed = now - startTime;
      const t = Math.min(elapsed / duration, 1);
      ctx.clearRect(0, 0, cw, ch);

      // Phase boundaries (as fraction of total duration)
      const p1End = 100 / duration;
      const p2End = 250 / duration;
      const p3End = 300 / duration;
      const p4End = 550 / duration;

      if (t < p1End) {
        // ── Phase 1: Activation (0–100ms) ──
        // Current image with shake (shake handled by framer-motion)
        drawImageCover(ctx, currentImg, cw, ch);
      } else if (t < p2End) {
        // ── Phase 2: Scanner overlay appears (100–250ms) ──
        const progress = (t - p1End) / (p2End - p1End);
        drawImageCover(ctx, currentImg, cw, ch);

        // Draw the heavy colored overlay that builds up
        const overlayOpacity = 0.3 + progress * 0.55; // 0.3 → 0.85
        drawBlindsOverlay(ctx, cw, ch, stripeThickness, stripeGap, palette, overlayOpacity);
      } else if (t < p3End) {
        // ── Phase 3: Reveal window creation (250–300ms) ──
        drawImageCover(ctx, currentImg, cw, ch);

        // Full overlay
        drawBlindsOverlay(ctx, cw, ch, stripeThickness, stripeGap, palette, 1.0);

        // Reveal band starts to form at edge
        const bandHeight = ch * 0.22;
        const peekProgress = (t - p2End) / (p3End - p2End);
        const bandY = scanDown ? -bandHeight * (1 - peekProgress) : ch - bandHeight * peekProgress;

        // Draw the reveal window: clear the overlay in this band and show next image
        ctx.save();
        ctx.beginPath();
        ctx.rect(0, bandY, cw, bandHeight);
        ctx.clip();
        ctx.clearRect(0, 0, cw, ch);
        drawImageCover(ctx, nextImg, cw, ch);
        ctx.restore();
      } else if (t < p4End) {
        // ── Phase 4: Scanner sweep (300–550ms) ──
        const sweepProgress = (t - p3End) / (p4End - p3End);
        // Ease the sweep slightly for smoothness
        const easedProgress = sweepProgress;

        const bandHeight = ch * 0.22;

        // Calculate band position
        let bandTop: number;
        if (scanDown) {
          bandTop = -bandHeight + (ch + bandHeight) * easedProgress;
        } else {
          bandTop = ch - (ch + bandHeight) * easedProgress;
        }
        const bandBottom = bandTop + bandHeight;

        // Determine what the scanner has already passed
        let scannedTop: number, scannedBottom: number;
        let unscannedTop: number, unscannedBottom: number;
        if (scanDown) {
          scannedTop = 0;
          scannedBottom = Math.max(0, Math.min(ch, bandBottom));
          unscannedTop = scannedBottom;
          unscannedBottom = ch;
        } else {
          unscannedTop = 0;
          unscannedBottom = Math.max(0, Math.min(ch, bandTop));
          scannedTop = unscannedBottom;
          scannedBottom = ch;
        }

        // 1) Draw the UNSCANNED region: current image + heavy blinds overlay
        if (unscannedBottom > unscannedTop) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, unscannedTop, cw, unscannedBottom - unscannedTop);
          ctx.clip();
          drawImageCover(ctx, currentImg, cw, ch);
          drawBlindsOverlay(ctx, cw, ch, stripeThickness, stripeGap, palette, 1.0);
          ctx.restore();
        }

        // 2) Draw the SCANNED region: next image (clean, no overlay)
        if (scannedBottom > scannedTop) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, scannedTop, cw, scannedBottom - scannedTop);
          ctx.clip();
          drawImageCover(ctx, nextImg, cw, ch);
          ctx.restore();
        }

        // 3) Draw the reveal BAND window: next image visible without overlay
        const clampedBandTop = Math.max(0, bandTop);
        const clampedBandBottom = Math.min(ch, bandBottom);
        if (clampedBandBottom > clampedBandTop) {
          ctx.save();
          ctx.beginPath();
          ctx.rect(0, clampedBandTop, cw, clampedBandBottom - clampedBandTop);
          ctx.clip();
          drawImageCover(ctx, nextImg, cw, ch);
          ctx.restore();

          // Draw subtle edge glow lines at band borders
          ctx.save();
          ctx.strokeStyle = palette.glow;
          ctx.lineWidth = 1.5;
          ctx.shadowColor = palette.glow;
          ctx.shadowBlur = 4;

          // Top edge of band
          if (clampedBandTop > 0) {
            ctx.beginPath();
            ctx.moveTo(0, clampedBandTop);
            ctx.lineTo(cw, clampedBandTop);
            ctx.stroke();
          }
          // Bottom edge of band
          if (clampedBandBottom < ch) {
            ctx.beginPath();
            ctx.moveTo(0, clampedBandBottom);
            ctx.lineTo(cw, clampedBandBottom);
            ctx.stroke();
          }
          ctx.restore();
        }
      } else {
        // ── Phase 5: Completion (550–650ms) ──
        const fadeProgress = (t - p4End) / (1.0 - p4End);
        drawImageCover(ctx, nextImg, cw, ch);

        // Fade out the blinds overlay
        if (fadeProgress < 1) {
          const fadeOpacity = 1.0 - fadeProgress;
          drawBlindsOverlay(ctx, cw, ch, stripeThickness, stripeGap, palette, fadeOpacity);
        }
      }

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        // Transition complete
        setShowPrimary((prev) => !prev);
        setIsTransitioning(false);

        // Final tiny settle shake
        shakeControls.start({
          x: [0, -1, 1, 0],
          transition: { duration: 0.1, ease: "easeOut" },
        });
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  }, [showPrimary, duration, drawImageCover, shakeControls]);

  // Timing loop
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      runTransition();
    }, interval);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [showPrimary, interval, runTransition]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return (
    <motion.div
      ref={containerRef}
      animate={shakeControls}
      className={`relative aspect-square overflow-hidden rounded-2xl ${className}`}
      style={{ willChange: "transform" }}
    >
      {/* Base image (visible when not transitioning) */}
      <img
        src={showPrimary ? primaryImage : secondaryImage}
        alt="Avatar"
        className="absolute inset-0 w-full h-full object-cover"
        style={{
          opacity: isTransitioning ? 0 : 1,
          transition: "opacity 0ms",
        }}
        draggable={false}
      />

      {/* Canvas overlay for transition animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{
          opacity: isTransitioning ? 1 : 0,
          pointerEvents: "none",
        }}
      />
    </motion.div>
  );
}

/**
 * Draw heavy venetian-blind overlay matching the reference images.
 * Creates thick colored horizontal bars with small gaps between them,
 * plus a solid color fill behind everything for the heavy tint look.
 */
function drawBlindsOverlay(
  ctx: CanvasRenderingContext2D,
  cw: number,
  ch: number,
  thickness: number,
  gap: number,
  palette: { fill: string; line: string; glow: string },
  masterOpacity: number
) {
  ctx.save();
  ctx.globalAlpha = masterOpacity;

  // 1) Solid colored fill behind everything (gives the heavy tint)
  ctx.fillStyle = palette.fill;
  ctx.fillRect(0, 0, cw, ch);

  // 2) Draw the thick horizontal stripe bars on top
  ctx.fillStyle = palette.line;
  const step = thickness + gap;
  for (let y = 0; y < ch; y += step) {
    ctx.fillRect(0, y, cw, thickness);
  }

  ctx.restore();
}
