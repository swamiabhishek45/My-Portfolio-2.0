"use client";

import { CursorDrivenParticleTypography } from "@/components/ui/cursor-driven-particle-typography";

export default function ParticleTypographyDense() {
  return (
    <div className="w-full h-[160px] min-h-[160px] relative text-neutral-900 dark:text-neutral-50 font-bold overflow-hidden">
      <CursorDrivenParticleTypography
        text="Abhishek"
        particleDensity={2}
        particleSize={1.2}
        fontSize={110}
      />
    </div>
  );
}
