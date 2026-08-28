"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "motion/react";

interface StaggerProps extends HTMLMotionProps<"div"> {
  /** Seconds between each child's reveal. */
  stagger?: number;
}

/**
 * Container that reveals its <StaggerItem> children one after another when
 * scrolled into view. Plays once.
 *
 * Uses the standard container/item variant pattern (staggerChildren) so the
 * timing lives in one place. https://motion.dev/docs/react-scroll-animations
 */
export function Stagger({ children, stagger = 0.08, ...rest }: StaggerProps) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={{
        hidden: {},
        visible: {
          transition: { staggerChildren: stagger, delayChildren: 0.05 },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

interface StaggerItemProps extends HTMLMotionProps<"div"> {
  /** Vertical travel distance in px (ignored under reduced motion). */
  y?: number;
}

/** A single item inside <Stagger>. Fades + rises; opacity-only under reduced motion. */
export function StaggerItem({ children, y = 24, ...rest }: StaggerItemProps) {
  const reduce = useReducedMotion();

  return (
    <motion.div
      variants={{
        hidden: reduce ? { opacity: 0 } : { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
        },
      }}
      {...rest}
    >
      {children}
    </motion.div>
  );
}
