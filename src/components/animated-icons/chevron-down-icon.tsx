"use client"

import { useImperativeHandle } from "react"
import { motion, useAnimation } from "motion/react"

import {
  AnimatedIconSvg,
  type AnimatedIconHandle,
  type AnimatedIconSvgProps,
} from "@/components/ui/animated-icon"

export type ChevronDownIconHandle = AnimatedIconHandle

export type ChevronDownIconProps = Omit<AnimatedIconSvgProps, "ref"> & {
  ref?: React.Ref<ChevronDownIconHandle>
  duration?: number
}

export function ChevronDownIcon({
  ref,
  duration = 0.3,
  ...props
}: ChevronDownIconProps) {
  const controls = useAnimation()

  useImperativeHandle(ref, () => {
    return {
      startAnimation: () => controls.start("animate"),
      stopAnimation: () => controls.start("normal"),
    }
  })

  return (
    <AnimatedIconSvg size={24} aria-hidden {...props}>
      <motion.path
        d="M6 9L12 15L18 9"
        variants={{
          normal: {
            d: "M6 9L12 15L18 9",
          },
          animate: {
            d: "M6 15L12 9L18 15",
          },
        }}
        initial="normal"
        animate={controls}
        transition={{
          duration,
        }}
      />
    </AnimatedIconSvg>
  )
}
