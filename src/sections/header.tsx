"use client";

import { useEffect, useState, useRef } from "react";
import useSWR from "swr";
import ScannerAvatar from "@/components/ui/scanner-avatar";
import CountUp from "@/components/ui/count-up";
import { Eye, BadgeCheck } from "lucide-react";
import { motion, useInView } from "motion/react";
import { TextFlip } from "@/components/text-flip";
import { getEditorIcon } from "@/components/icons/tech-brand-icons";

const WORDS = ["Developer", "Engineer", "Learner"];

export default function Header() {
  const [visitorCount, setVisitorCount] = useState<number | null>(null);
  const [wordIndex, setWordIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState("");
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const updateTheme = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    updateTheme();

    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const ref = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isInView = useInView(ref);
  const play = isInView;

  const { data: statusData } = useSWR(
    "/api/wakatime",
    (url) => fetch(url).then((res) => res.json()),
    { refreshInterval: 60000 }
  );

  const isCoding = statusData?.status === "coding";
  const editor = statusData?.editor || "Antigravity";
  const isCooking = statusData?.configured ? isCoding : !statusData;
  const EditorIcon = getEditorIcon(editor);

  const activeTimeText =
    statusData?.configured && statusData.activeTimeToday
      ? ` • ${statusData.activeTimeToday} active today`
      : "";

  useEffect(() => {
    async function trackVisitor() {
      try {
        const res = await fetch("/api/visitor", { method: "POST" });
        if (res.ok) {
          const data = await res.json();
          setVisitorCount(data.count);
        }
      } catch (error) {
        console.error("Failed to fetch visitor count:", error);
      }
    }
    trackVisitor();
  }, []);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, "0");
      const minutes = String(now.getMinutes()).padStart(2, "0");
      const seconds = String(now.getSeconds()).padStart(2, "0");
      setCurrentTime(`${hours}:${minutes}:${seconds}`);
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = canvas.width;
    let height = canvas.height;

    const handleResize = () => {
      if (canvas.parentElement) {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
        width = canvas.width;
        height = canvas.height;
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const numParticles = 40;
    const particles = Array.from({ length: numParticles }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 1.5 + 0.5,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: (Math.random() - 0.5) * 0.3,
      opacity: Math.random() * 0.6 + 0.2,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const article = WORDS[wordIndex] === "Engineer" ? "an" : "a";

  return (
    <section className="border border-dotted border-neutral-300 dark:border-neutral-800/80 rounded-2xl bg-neutral-50/20 dark:bg-neutral-900/20 relative overflow-hidden transition-all duration-300 flex flex-col">
      {/* Top Panoramic Hero Banner */}
      <div className="relative w-full h-40 sm:h-48 overflow-hidden border-b border-dotted border-neutral-300 dark:border-neutral-800/80 group">
        <img
          src={isDark ? "/night-banner.png" : "/day-banner.png"}
          alt={isDark ? "Night Banner" : "Day Banner"}
          className="w-full h-full object-cover object-center filter brightness-95 dark:brightness-90 transition-transform duration-700 group-hover:scale-105"
        />
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full pointer-events-none z-[4]"
          width={491}
          height={200}
        />
        {/* Pixel Art Overlay Clock at Bottom Right */}
        <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded border border-neutral-700/50 text-xs font-mono text-neutral-300 shadow-sm flex items-center gap-1.5 select-none z-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>{currentTime || "16:50:55"}</span>
        </div>
      </div>

      {/* Main Profile Info */}
      <div className="p-4 sm:p-6 flex flex-col gap-4 sm:gap-5">
        <div className="flex flex-row items-center gap-3.5 sm:gap-5 text-left min-w-0">
          {/* Avatar with Liquid Surface Effect */}
            <ScannerAvatar
              primaryImage="/avatar.png"
              secondaryImage="/photo.png"
              interval={3000}
              duration={650}
              className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl sm:rounded-[18px]"
            />


          {/* Details & Top Controls */}
          <div className="flex-1 flex flex-col justify-center gap-1 min-w-0">
            {/* Top Row: Name & Right Controls */}
            <div className="flex items-center justify-between gap-2">
              {/* Name & Verified Check Badge */}
              <div className="flex items-center gap-1.5 min-w-0">
                <h1 className="text-base sm:text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans leading-tight truncate">
                  Abhishek Swami
                </h1>
                <BadgeCheck className="w-4 h-4 sm:w-4.5 sm:h-4.5 text-blue-500 fill-blue-500 dark:fill-blue-500 stroke-neutral-50 dark:stroke-neutral-900 shrink-0" />
              </div>

              {/* Visitor Count */}
              {visitorCount !== null && (
                <div className="flex items-center gap-1 sm:gap-1.5 text-[11px] sm:text-xs font-mono text-neutral-700 dark:text-neutral-400 font-medium bg-neutral-100 dark:bg-neutral-800/60 px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg border border-dotted border-neutral-300 dark:border-neutral-700 shrink-0">
                  <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <CountUp end={visitorCount} duration={2} />
                </div>
              )}
            </div>

            {/* Subtitle with TextFlip */}
            <div
              ref={ref}
              className="text-xs sm:text-sm font-medium text-neutral-800 dark:text-neutral-400 flex items-center justify-start gap-1.5 h-5 select-none font-mono"
            >
              <span>22 • I am {article}</span>
              <span className="inline-grid text-neutral-900 dark:text-neutral-50 font-semibold font-mono">
                <span className="invisible col-start-1 row-start-1" aria-hidden>
                  {WORDS.reduce((a, b) => (a.length >= b.length ? a : b))}
                </span>
                <TextFlip
                  as={motion.span}
                  className="col-start-1 row-start-1 text-neutral-900 dark:text-neutral-50"
                  play={play}
                  onIndexChange={setWordIndex}
                >
                  {WORDS.map((word) => (
                    <span key={word}>{word}</span>
                  ))}
                </TextFlip>
              </span>
            </div>

            {/* Wakatime / Activity Status Bar */}
            <div className="flex items-center gap-1.5 text-[10px] sm:text-xs text-neutral-700 dark:text-neutral-400 min-h-4 font-mono font-medium truncate">
              <span className="relative flex h-2 w-2 shrink-0">
                {(!statusData || isCoding) && (
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                )}
                <span
                  className={`relative inline-flex rounded-full h-2 w-2 ${statusData
                    ? isCoding
                      ? "bg-green-500"
                      : "bg-neutral-400 dark:bg-neutral-600"
                    : "bg-green-500"
                    }`}
                ></span>
              </span>
              <span className="flex min-w-0 items-center gap-1 truncate">
                {isCooking ? (
                  <>
                    <span className="shrink-0">Cooking in</span>
                    {EditorIcon ? (
                      <EditorIcon
                        className="h-3.5 w-3.5 shrink-0 text-neutral-800 dark:text-neutral-200"
                        aria-hidden
                      />
                    ) : null}
                    <span className="truncate">{editor}</span>
                    {activeTimeText}
                  </>
                ) : (
                  <>
                    <span>Idle · Reading books</span>
                    {activeTimeText}
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        {/* Bio Tagline & Bullet List */}
        <div className="flex flex-col gap-3 pt-3 border-t border-dotted border-neutral-200 dark:border-neutral-800/80">
          <p className="text-sm sm:text-base font-medium text-neutral-900 dark:text-neutral-200 leading-relaxed font-sans">
          Full Stack AI Engineer. I love building, breaking, and shipping things.
          </p>

          <ul className="flex flex-col gap-2 text-xs sm:text-sm text-neutral-700 dark:text-neutral-400 font-sans leading-relaxed">
            <li className="flex items-start gap-2">
              <span className="text-neutral-500 dark:text-neutral-500 select-none">•</span>
              <span>Skilled in
                <strong className="text-neutral-900 dark:text-neutral-200 font-semibold"> Next.js, React, JavaScript, Node.js, & MongoDB.</strong>
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-500 dark:text-neutral-500 select-none">•</span>
              <span>
                Learning in System Design & GenAI.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-neutral-500 dark:text-neutral-500 select-none">•</span>
              <span>
                Passionate about exploring new technologies & learning new things.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}
