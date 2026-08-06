"use client";

import type { Variants } from "motion/react";
import { motion, useAnimation } from "motion/react";
import { forwardRef } from "react";

import {
  AnimatedIconContainer,
  AnimatedIconSvg,
  type AnimatedIconHandle,
  type AnimatedIconProps,
} from "@/components/ui/animated-icon";

export type LinkIconHandle = AnimatedIconHandle;

const PATH_VARIANTS: Variants = {
  initial: { pathLength: 1, pathOffset: 0, rotate: 0 },
  animate: {
    pathLength: [1, 0.97, 1, 0.97, 1],
    pathOffset: [0, 0.05, 0, 0.05, 0],
    rotate: [0, -5, 0],
    transition: {
      rotate: {
        duration: 0.5,
      },
      duration: 1,
      times: [0, 0.2, 0.4, 0.6, 1],
      ease: "easeInOut",
    },
  },
};

const LinkIcon = forwardRef<LinkIconHandle, AnimatedIconProps>(
  ({ size = 28, ...props }, ref) => {
    const controls = useAnimation();

    return (
      <AnimatedIconContainer
        onStartAnimation={() => controls.start("animate")}
        onStopAnimation={() => controls.start("normal")}
        ref={ref}
        {...props}
      >
        <AnimatedIconSvg size={size}>
          <motion.path
            animate={controls}
            d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"
            variants={PATH_VARIANTS}
          />
          <motion.path
            animate={controls}
            d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"
            variants={PATH_VARIANTS}
          />
        </AnimatedIconSvg>
      </AnimatedIconContainer>
    );
  }
);

LinkIcon.displayName = "LinkIcon";

export { LinkIcon };
