"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

interface RevealProps extends HTMLMotionProps<"div"> {
  /** Delay in seconds before the reveal starts. */
  delay?: number;
  /** Vertical travel distance in px (ignored under reduced motion). */
  y?: number;
}

/**
 * Fade + rise on scroll into view. Plays once. Under prefers-reduced-motion
 * it degrades to a plain opacity fade (no transform).
 *
 * Motion-for-React best practice: initial + whileInView + viewport.once.
 * https://motion.dev/docs/react-scroll-animations
 */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  ...rest
}: RevealProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      initial={reduce ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
