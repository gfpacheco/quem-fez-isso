"use client";

import { MotionConfig } from "motion/react";
import { Stamp } from "@/components/ui/Stamp";

/** The "Confidencial" stamp slamming over the home line-up */
export function HomeStamp() {
  return (
    <MotionConfig reducedMotion="user">
      <Stamp rotate={-9} delay={1.1} className="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 pt-1.5 pb-1 text-[30px]">
        Confidencial
      </Stamp>
    </MotionConfig>
  );
}
