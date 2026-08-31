"use client";

import { CursorDrivenParticleTypography } from "@/components/ui/cursor-driven-particle-typography";

export default function ParticleTypographyDense() {
  return (
    <div className="w-full">
      <div className="relative h-[160px] min-h-[160px] overflow-hidden text-neutral-900 dark:text-neutral-50 font-bold">
        <CursorDrivenParticleTypography
          text="Abhishek"
          particleDensity={2}
          particleSize={1.2}
          fontSize={110}
        />
      </div>
      <div
        aria-hidden
        className="h-px w-full bg-[linear-gradient(to_right,rgba(160,160,160,0.25)_50%,transparent_0%)] bg-[length:4px_1px] bg-repeat-x dark:bg-[linear-gradient(to_right,rgba(255,255,255,0.12)_50%,transparent_0%)]"
      />
    </div>
  );
}
