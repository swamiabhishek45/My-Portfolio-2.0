"use client";

import type { SVGMotionProps } from "motion/react";
import { motion } from "motion/react";
import type { HTMLAttributes, ReactNode } from "react";
import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";

import { cn } from "@/lib/utils";

export interface AnimatedIconHandle {
  startAnimation: () => void;
  stopAnimation: () => void;
}

export interface AnimatedIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

interface AnimatedIconContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  onStartAnimation: () => void | Promise<void>;
  onStopAnimation: () => void;
}

/**
 * Wrapper that exposes the imperative start/stop handle used by every animated
 * icon and starts the animation on hover while the icon is uncontrolled, i.e.
 * while no consumer holds a ref to it.
 */
const AnimatedIconContainer = forwardRef<
  AnimatedIconHandle,
  AnimatedIconContainerProps
>(
  (
    {
      children,
      className,
      onMouseEnter,
      onMouseLeave,
      onStartAnimation,
      onStopAnimation,
      ...props
    },
    ref
  ) => {
    const isControlledRef = useRef(false);
    const startRef = useRef(onStartAnimation);
    const stopRef = useRef(onStopAnimation);
    startRef.current = onStartAnimation;
    stopRef.current = onStopAnimation;

    useImperativeHandle(ref, () => {
      isControlledRef.current = true;

      return {
        startAnimation: () => {
          void startRef.current();
        },
        stopAnimation: () => stopRef.current(),
      };
    });

    const handleMouseEnter = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseEnter?.(e);
        } else {
          void startRef.current();
        }
      },
      [onMouseEnter]
    );

    const handleMouseLeave = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        if (isControlledRef.current) {
          onMouseLeave?.(e);
        } else {
          stopRef.current();
        }
      },
      [onMouseLeave]
    );

    return (
      <div
        className={cn(className)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {children}
      </div>
    );
  }
);

AnimatedIconContainer.displayName = "AnimatedIconContainer";

export type AnimatedIconSvgProps = SVGMotionProps<SVGSVGElement> & {
  size?: number;
};

/** `motion.svg` preconfigured with the stroke style shared by the icon set. */
function AnimatedIconSvg({
  size = 28,
  children,
  ...props
}: AnimatedIconSvgProps) {
  return (
    <motion.svg
      fill="none"
      height={size}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
      width={size}
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {children}
    </motion.svg>
  );
}

export { AnimatedIconContainer, AnimatedIconSvg };
