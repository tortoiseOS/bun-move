"use client";

import { motion, Variants } from "framer-motion";

import { cn } from "../lib/utils";

interface FadeTextProps {
  className?: string;
  direction?: "up" | "down" | "left" | "right";
  framerProps?: Variants;
  text: string;
}

export default function FadeText({
  direction = "up",
  className,
  framerProps = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { type: "spring" } },
  },
  text,
}: FadeTextProps) {
  const directionOffset = {
    up: { y: 20 },
    down: { y: -20 },
    left: { x: 20 },
    right: { x: -20 },
  };

  const combinedVariants = {
    hidden: {
      ...directionOffset[direction],
      ...framerProps.hidden,
    },
    show: framerProps.show,
  };

  return (
    <motion.div
      initial="hidden"
      animate="show"
      viewport={{ once: true }}
      variants={combinedVariants}
    >
      <motion.span className={cn("inline-block", className)}>
        {text}
      </motion.span>
    </motion.div>
  );
}
