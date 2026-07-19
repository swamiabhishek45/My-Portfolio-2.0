"use client";

import {
  AnimatePresence,
  motion,
  type Variants,
  useReducedMotion,
} from "framer-motion";
import { type ReactNode, useEffect, useMemo, useState } from "react";

const INTRO_WORDS = ["Hello", "नमस्कार", "Hallo", "வணக்கம்", "栄養", "नमस्ते", "G'day"];

const PRELOADER_DURATION_MS = 2400;
const WORD_INTERVAL_MS = 180;
const CURVE_HEIGHT = 300;

const primaryEase = [0.76, 0, 0.24, 1] as const;

const svgPaths = {
  flat: "M0 0 L100 0 L100 100 Q50 100 0 100 L0 0",
  curveUp: "M0 0 L100 0 L100 100 Q50 0 0 100 L0 0",
};

const overlayVariants: Variants = {
  initial: {
    top: 0,
  },
  exit: {
    top: `calc(-100vh - ${CURVE_HEIGHT}px)`,
    transition: {
      duration: 0.85,
      ease: primaryEase,
      delay: 0.15,
    },
  },
};

const curveVariants: Variants = {
  initial: {
    d: svgPaths.flat,
  },
  exit: {
    d: svgPaths.curveUp,
    transition: {
      duration: 0.85,
      ease: primaryEase,
      delay: 0.15,
    },
  },
};

type WordsPreloaderProps = {
  word: string;
};

export function WordsPreloader({ word }: WordsPreloaderProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="fixed left-0 top-0 z-[9999] h-[calc(100vh+300px)] w-screen overflow-hidden"
      variants={shouldReduceMotion ? undefined : overlayVariants}
      initial="initial"
      exit={shouldReduceMotion ? { opacity: 0 } : "exit"}
      transition={{ duration: 0.35, ease: primaryEase }}
      aria-label={`Loading, ${word}`}
      aria-live="polite"
      role="status"
    >
      <div className="grid h-screen place-items-center bg-white text-[#3f3f3f]">
        <div className="relative flex h-24 w-full items-center justify-center overflow-hidden px-6 sm:h-28">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="block text-[clamp(3.45rem,12vw,5.15rem)] font-semibold leading-none tracking-normal">
              {word}
            </span>
            <span
              className="ml-3 mt-7 block h-2.5 w-2.5 rounded-full bg-[#ff5c35] sm:ml-4 sm:mt-9 sm:h-3 sm:w-3"
              aria-hidden="true"
            />
          </div>
        </div>
      </div>

      <svg
        className="absolute top-[calc(100vh-1px)] h-[300px] w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
        aria-hidden="true"
      >
        <motion.path
          className="fill-white"
          variants={shouldReduceMotion ? undefined : curveVariants}
          initial="initial"
          exit="exit"
        />
      </svg>
    </motion.div>
  );
}

type WordsPreloaderGateProps = {
  children: ReactNode;
  words?: string[];
  duration?: number;
  interval?: number;
};

export function WordsPreloaderGate({
  children,
  words = INTRO_WORDS,
  duration = PRELOADER_DURATION_MS,
  interval = WORD_INTERVAL_MS,
}: WordsPreloaderGateProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [wordIndex, setWordIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (!isLoading) {
      return;
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const wordTimer = window.setInterval(() => {
      setWordIndex((currentIndex) => (currentIndex + 1) % words.length);
    }, interval);

    const loadingTimer = window.setTimeout(
      () => setIsLoading(false),
      shouldReduceMotion ? 700 : duration
    );

    return () => {
      window.clearInterval(wordTimer);
      window.clearTimeout(loadingTimer);
      document.body.style.overflow = originalOverflow;
    };
  }, [duration, interval, isLoading, shouldReduceMotion, words.length]);

  const activeWord = useMemo(() => words[wordIndex] ?? words[0], [wordIndex, words]);

  return (
    <main className="relative">
      <AnimatePresence mode="wait">
        {isLoading && <WordsPreloader key="words-preloader" word={activeWord} />}
      </AnimatePresence>
      {children}
    </main>
  );
}

export function MainHero() {
  return (
    <section className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <p className="mb-3 text-sm font-medium text-neutral-500">Portfolio</p>
        <h1 className="text-4xl font-semibold tracking-normal text-neutral-950 dark:text-neutral-50 sm:text-6xl">
          MainHero
        </h1>
      </div>
    </section>
  );
}

export function WordsPreloaderDemo() {
  return (
    <WordsPreloaderGate>
      <MainHero />
    </WordsPreloaderGate>
  );
}
