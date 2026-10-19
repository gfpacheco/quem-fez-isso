"use client";

import { AnimatePresence, motion } from "motion/react";

type ToastProps = {
  message: string | null;
};

export function Toast({ message }: ToastProps) {
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-6 z-50 flex justify-center">
      <AnimatePresence>
        {message && (
          <motion.div
            key={message}
            initial={{ opacity: 0, y: 12, rotate: -2 }}
            animate={{ opacity: 1, y: 0, rotate: -1 }}
            exit={{ opacity: 0, y: 12 }}
            transition={{ duration: 0.2 }}
            className="border-2 border-ink bg-paper-2 px-4 py-2 font-type text-sm text-ink shadow-hard"
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
