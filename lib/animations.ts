import type { Variants } from "framer-motion";

export const ANIMATION_VARIANTS = {
  fadeInUp: {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } },
  } as Variants,

  staggerContainer: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } },
  } as Variants,

  staggerItem: {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  } as Variants,

  letterAnimation: {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  } as Variants,

  slideFromRight: {
    hidden: { opacity: 0, x: 60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  } as Variants,

  slideFromLeft: {
    hidden: { opacity: 0, x: -60 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.8 } },
  } as Variants,

  scaleIn: {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.6 } },
  } as Variants,

  easeOutExpo: [0.16, 1, 0.3, 1],
};

export const EASING = {
  outExpo: [0.16, 1, 0.3, 1] as [number, number, number, number],
  inOutExpo: [0.87, 0, 0.13, 1] as [number, number, number, number],
  outQuad: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number],
};
