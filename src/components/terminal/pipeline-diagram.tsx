"use client";

import { motion, useReducedMotion } from "motion/react";

// Sem rótulo próprio: o título do capítulo fica logo acima e repeti-lo
// aqui dizia a mesma coisa duas vezes. As linhas são lidas em ordem por
// leitores de tela — é um log, a ordem é o conteúdo —, então nada de
// role="img", que esconderia justamente o que interessa.
export function PipelineDiagram({ lines }: { lines: string[] }) {
  const reduced = useReducedMotion();
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface-deep p-4 font-mono text-sm">
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
