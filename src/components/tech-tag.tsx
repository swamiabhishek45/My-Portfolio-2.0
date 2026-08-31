import type { CSSProperties } from "react";
import { getTechMeta } from "@/lib/tech-meta";
import { cn } from "@/lib/utils";

export function TechTag({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const meta = getTechMeta(name);
  const Icon = meta?.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border border-dotted border-neutral-300/80 bg-white/50 px-2 py-0.5 text-xs font-medium text-neutral-700 dark:border-neutral-800/80 dark:bg-neutral-950/40 dark:text-neutral-300",
        className
      )}
    >
      {Icon && meta ? (
        <span
          className="skill-icon flex size-3.5 items-center justify-center"
          style={
            {
              color: meta.color,
              "--skill-icon-dark": meta.darkColor ?? meta.color,
            } as CSSProperties
          }
        >
          <Icon className="size-3.5" />
        </span>
      ) : null}
      {name}
    </span>
  );
}
