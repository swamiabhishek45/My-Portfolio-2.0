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

export type MapPinIconHandle = AnimatedIconHandle;

const SVG_VARIANTS: Variants = {
  normal: {
    y: 0,
  },
  animate: {
    y: [0, -5, -3],
    transition: {
      duration: 0.5,
      times: [0, 0.6, 1],
    },
  },
};

const CIRCLE_VARIANTS: Variants = {
  normal: {
    opacity: 1,
  },
  animate: {
    opacity: [0, 1],
    pathLength: [0, 1],
    pathOffset: [0.5, 0],
    transition: {
      delay: 0.3,
      duration: 0.5,
      opacity: { duration: 0.1, delay: 0.3 },
    },
  },
};

const MapPinIcon = forwardRef<MapPinIconHandle, AnimatedIconProps>(
  ({ size = 28, ...props }, ref) => {
    const controls = useAnimation();

    return (
      <AnimatedIconContainer
        onStartAnimation={() => controls.start("animate")}
        onStopAnimation={() => controls.start("normal")}
        ref={ref}
        {...props}
      >
        <AnimatedIconSvg
          animate={controls}
          initial="normal"
          size={size}
          variants={SVG_VARIANTS}
        >
          <path d="M20 10c0 4.993-5.539 10.193-7.399 11.799a1 1 0 0 1-1.202 0C9.539 20.193 4 14.993 4 10a8 8 0 0 1 16 0" />
          <motion.circle
            animate={controls}
            cx="12"
            cy="10"
            initial="normal"
            r="3"
            variants={CIRCLE_VARIANTS}
          />
        </AnimatedIconSvg>
      </AnimatedIconContainer>
    );
  }
);

MapPinIcon.displayName = "MapPinIcon";

export { MapPinIcon };
