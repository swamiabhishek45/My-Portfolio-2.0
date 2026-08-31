import type { CSSProperties } from "react";
import type { TechItem } from "@/data/technologies";
import { cn } from "@/lib/utils";

export function SkillBadge({
  tech,
  className,
}: {
  tech: TechItem;
  className?: string;
}) {
  const Icon = tech.icon;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-2.5 rounded-lg border border-dotted border-neutral-300/80 bg-white/50 px-3 py-2 dark:border-neutral-800/80 dark:bg-neutral-950/40",
        className
      )}
    >
      <span
        className="skill-icon flex size-4 items-center justify-center text-base leading-none"
        style={
          {
            color: tech.color,
            "--skill-icon-dark": tech.darkColor ?? tech.color,
          } as CSSProperties
        }
      >
        <Icon className="size-4" />
      </span>
      <span className="font-mono text-xs text-neutral-800 dark:text-neutral-100">
        {tech.name}
      </span>
    </div>
  );
}
