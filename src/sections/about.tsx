"use client";

import { useRef, useState } from "react";
import { aboutBullets } from "@/data/about";
import { ChevronDownIcon, ChevronDownIconHandle } from "@/components/animated-icons/chevron-down-icon";
import { motion, AnimatePresence } from "framer-motion";

export default function About() {
  const [isExpanded, setIsExpanded] = useState(false);
  const iconRef = useRef<ChevronDownIconHandle>(null);

  const handleToggle = () => {
    if (isExpanded) {
      iconRef.current?.stopAnimation();
    } else {
      iconRef.current?.startAnimation();
    }
    setIsExpanded(!isExpanded);
  };

  const handleMouseEnter = () => {
    iconRef.current?.startAnimation();
  };

  const handleMouseLeave = () => {
    if (!isExpanded) {
      iconRef.current?.stopAnimation();
    }
  };

  // Split bullets: first 2 are always visible, remaining are collapsible
  const visibleBullets = aboutBullets.slice(0, 2);
  const collapsibleBullets = aboutBullets.slice(2);

  return (
    <section className="flex flex-col w-full">
      {/* Section Heading */}
      <h2 className="text-neutral-600 dark:text-neutral-400 text-sm font-medium mb-2 px-1 select-none font-mono">
        About me
      </h2>

      {/* Outer Card */}
      <div className="border border-dotted border-neutral-300 dark:border-neutral-800/80 p-4 rounded-2xl bg-neutral-50/10 dark:bg-neutral-900/10">
        {/* Inner Card */}
        <div className="border border-dotted border-neutral-200/80 dark:border-neutral-800/60 p-5 rounded-xl bg-white/40 dark:bg-black/50 backdrop-blur-xs flex flex-col gap-4">
          <ul className="flex flex-col gap-3.5">
            {/* Always Visible Bullets */}
            {visibleBullets.map((bullet, index) => (
              <li
                key={index}
                className="flex items-start gap-3 text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-2.5 shrink-0" />
                <span>
                  {bullet.segments.map((seg, sIdx) => {
                    if (seg.bold) {
                      return (
                        <strong
                          key={sIdx}
                          className="font-semibold text-neutral-900 dark:text-neutral-100"
                        >
                          {seg.text}
                        </strong>
                      );
                    }
                    return <span key={sIdx}>{seg.text}</span>;
                  })}
                </span>
              </li>
            ))}

            {/* Collapsible Bullets with Smooth Transition */}
            <AnimatePresence initial={false}>
              {isExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden flex flex-col gap-3.5"
                >
                  {collapsibleBullets.map((bullet, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 text-neutral-600 dark:text-neutral-400 text-sm sm:text-base leading-relaxed"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 dark:bg-neutral-600 mt-2.5 shrink-0" />
                      <span>
                        {bullet.segments.map((seg, sIdx) => {
                          if (seg.bold) {
                            return (
                              <strong
                                key={sIdx}
                                className="font-semibold text-neutral-900 dark:text-neutral-100"
                              >
                                {seg.text}
                              </strong>
                            );
                          }
                          return <span key={sIdx}>{seg.text}</span>;
                        })}
                      </span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </ul>

          {/* Toggle Button */}
          <div className="flex justify-center border-t border-neutral-200/50 dark:border-neutral-800/50 pt-3 mt-1">
            <button
              onClick={handleToggle}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              className="flex items-center gap-1.5 text-xs font-mono font-semibold text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors cursor-pointer select-none"
            >
              <span>{isExpanded ? "SHOW LESS" : "SHOW MORE"}</span>
              <ChevronDownIcon
                ref={iconRef}
                className="w-3.5 h-3.5 text-neutral-500 hover:text-neutral-950 dark:text-neutral-400 dark:hover:text-white transition-colors"
                duration={0.25}
              />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

