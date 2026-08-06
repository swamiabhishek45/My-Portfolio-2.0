"use client";

import { useAnimation, type Variants } from "motion/react";
import { forwardRef } from "react";

import {
  AnimatedIconContainer,
  AnimatedIconSvg,
  type AnimatedIconHandle,
  type AnimatedIconProps,
} from "@/components/ui/animated-icon";

export type PhoneIconHandle = AnimatedIconHandle;

const PHONE_VARIANTS: Variants = {
  normal: {
    rotate: 0,
    scale: 1,
  },
  animate: {
    rotate: [10, 20, -10, 10, 0],
    scale: [1, 1.1, 1],
    transition: {
      duration: 0.9,
      ease: "easeInOut",
    },
  },
};

const PhoneIcon = forwardRef<PhoneIconHandle, AnimatedIconProps>(
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
          variants={PHONE_VARIANTS}
        >
          <path d="M13.832 16.568a1 1 0 0 0 1.213-.303l.355-.465A2 2 0 0 1 17 15h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2A18 18 0 0 1 2 4a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v3a2 2 0 0 1-.8 1.6l-.468.351a1 1 0 0 0-.292 1.233 14 14 0 0 0 6.392 6.384" />
        </AnimatedIconSvg>
      </AnimatedIconContainer>
    );
  }
);

PhoneIcon.displayName = "PhoneIcon";

export { PhoneIcon };
