"use client";

import { useEffect, useRef } from "react";
import { useScroll, useSpring, motion } from "framer-motion";

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 40 });

  return (
    <motion.div
      id="scroll-progress"
      style={{ scaleX }}
    />
  );
}
