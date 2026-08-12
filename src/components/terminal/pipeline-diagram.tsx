"use client";

import { motion, useReducedMotion } from "motion/react";

export function PipelineDiagram({ lines, title }: { lines: string[]; title: string }) {
  const reduced = useReducedMotion();
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-deep p-4 font-mono text-sm">
      <div className="mb-2 text-xs text-muted">{title}</div>
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={reduced ? false : { opacity: 0, x: -8 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: reduced ? 0 : i * 0.4, duration: 0.3 }}
          className={line.startsWith("✔") ? "text-accent" : "text-foreground/90"}
        >
          {line}
        </motion.div>
      ))}
    </div>
  );
}
