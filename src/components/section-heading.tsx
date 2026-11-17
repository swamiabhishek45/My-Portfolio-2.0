import { cn } from "@/lib/utils";

export function SectionHeading({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "font-sans text-lg font-bold tracking-tight text-neutral-900 sm:text-xl dark:text-neutral-50",
        className
      )}
    >
      {children}
    </h2>
  );
}
