"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion, animate } from "motion/react";

export function NumberTicker({
  value,
  prefix = "",
  suffix = "",
  locale,
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  // BCP-47 tag (e.g. "pt-BR"). When set, the number renders compact and
  // locale-formatted ("10,9 mi"/"10.9M") instead of raw digits — an
  // 8-digit count like a monthly token total otherwise overflows its stat
  // tile at narrow widths and reads as an illegible digit string either
  // way. Omitting it keeps the old plain-integer behavior.
  locale?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const reduced = useReducedMotion();
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!inView || reduced) return;
    const controls = animate(0, value, {
      duration: 1.2,
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, reduced, value]);

  const formatted = locale
    ? new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 }).format(
        display,
      )
    : display;

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
