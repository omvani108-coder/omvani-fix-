import type { Variants } from "framer-motion";

/**
 * Staggered fade-up.
 * Use with custom={index} on each child element.
 *
 * @example
 * <motion.div variants={fadeUp} custom={0} initial="hidden" animate="visible">
 */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.6, ease: "easeOut" },
  }),
};

/**
 * Simple fade with no vertical movement.
 */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: (i: number = 0) => ({
    opacity: 1,
    transition: { delay: i * 0.1, duration: 0.5, ease: "easeOut" },
  }),
};

/**
 * Slide in from the left.
 */
export const slideInLeft: Variants = {
  hidden: { opacity: 0, x: -30 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

/**
 * Shared viewport config for whileInView animations.
 * once: true means the animation only fires once as the element enters.
 */
export const defaultViewport = { once: true, margin: "-80px" } as const;
