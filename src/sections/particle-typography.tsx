"use client";

import { CursorDrivenParticleTypography } from "@/components/ui/cursor-driven-particle-typography";

export default function ParticleTypographyDense() {
  return (
    <div className="w-full min-h-[400px] relative">
      <CursorDrivenParticleTypography
        text="Abhishek"
        particleDensity={2}
        particleSize={1}
        fontSize={120}
      />
    </div>
  );
}
