import { motion } from "framer-motion";
import type { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
}

const pageVariants = {
  initial: {
    opacity: 0,
    y: 16,
    scale: 0.995,
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.45,
      ease: [0.22, 1, 0.36, 1],
      when: "beforeChildren",
    },
  },
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.995,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export const PageTransition = ({ children }: PageTransitionProps) => {
  return (
    <motion.div
      variants={pageVariants as any}
      initial="initial"
      animate="animate"
      exit="exit"
      className="w-full min-h-screen flex flex-col"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
