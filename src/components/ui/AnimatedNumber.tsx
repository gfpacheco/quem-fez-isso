"use client";

import { animate, useMotionValue, useReducedMotion, useTransform } from "motion/react";
import { motion } from "motion/react";
import { useEffect } from "react";

type AnimatedNumberProps = {
  value: number;
  className?: string;
};

export function AnimatedNumber({ value, className }: AnimatedNumberProps) {
  const reducedMotion = useReducedMotion();
  const motionValue = useMotionValue(value);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest).toString());

  useEffect(() => {
    if (reducedMotion) {
      motionValue.set(value);

      return;
    }

    const controls = animate(motionValue, value, { duration: 0.6, ease: "easeOut" });

    return () => controls.stop();
  }, [motionValue, reducedMotion, value]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
