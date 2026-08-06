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

export type FolderCodeIconHandle = AnimatedIconHandle;

const CODE_VARIANTS: Variants = {
  normal: { x: 0, rotate: 0, opacity: 1 },
  animate: (direction: number) => ({
    x: [0, direction * 2, 0],
    rotate: [0, direction * -8, 0],
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut",
    },
  }),
};

const FolderCodeIcon = forwardRef<FolderCodeIconHandle, AnimatedIconProps>(
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
          <path d="M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2z" />
          <motion.path
            animate={controls}
            custom={-1}
            d="M10 10.5 8 13l2 2.5"
            initial="normal"
            variants={CODE_VARIANTS}
          />
          <motion.path
            animate={controls}
            custom={1}
            d="m14 10.5 2 2.5-2 2.5"
            initial="normal"
            variants={CODE_VARIANTS}
          />
        </AnimatedIconSvg>
      </AnimatedIconContainer>
    );
  }
);

FolderCodeIcon.displayName = "FolderCodeIcon";

export { FolderCodeIcon };
