"use client";

import AnimatedButton from "@/components/ui/animated-button";
import { cn } from "@/lib/utils";

type PortfolioShineButtonProps = {
  children?: React.ReactNode;
  className?: string;
  variant?: "solid" | "outline";
  as?: "button" | "a";
  href?: string;
  target?: string;
  rel?: string;
  type?: "button" | "submit" | "reset";
  onClick?: React.MouseEventHandler<HTMLButtonElement | HTMLAnchorElement>;
};

/**
 * Vengeance UI Animated Button styled for this portfolio (minimal + dotted borders).
 * @see https://www.vengenceui.com/components/my-animated-button
 */
export function PortfolioShineButton({
  className,
  variant = "solid",
  as = "button",
  ...props
}: PortfolioShineButtonProps) {
  return (
    <AnimatedButton
      {...(props as React.ComponentProps<typeof AnimatedButton>)}
      as={as}
      className={cn(
        "rounded-full border-dotted text-sm font-semibold font-sans shadow-none",
        "transition-colors duration-200",
        variant === "solid" &&
          "border-neutral-800 bg-neutral-900 text-neutral-50 dark:border-neutral-300 dark:bg-neutral-100 dark:text-neutral-900",
        variant === "outline" &&
          "border-neutral-400 bg-neutral-50/60 text-neutral-900 backdrop-blur-sm dark:border-neutral-600 dark:bg-neutral-900/60 dark:text-neutral-100",
        className
      )}
    />
  );
}
