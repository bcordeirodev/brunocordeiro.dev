"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "motion/react";

const variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
};

export function Reveal({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  // Default to visible. Content already inside the initial viewport (e.g.
  // the hero metrics grid, or a case study's title/tagline/CTA) must paint
  // on first load instead of sitting at opacity:0 until a scroll event
  // fires whileInView's IntersectionObserver — that both blanks the page
  // above the fold and delays LCP (the LCP element can end up hidden behind
  // the fade). `initial={false}` below makes the very first render (which
  // must match between server and client to avoid a hydration mismatch)
  // apply the "visible" variant directly, with no enter transition, so
  // there's no flash either way.
  //
  // Only elements that measure OUTSIDE the initial viewport flip to hidden,
  // checked synchronously before paint via useLayoutEffect, so sections
  // below the fold keep their scroll-triggered fade/slide-in entrance.
  const [isVisible, setIsVisible] = useState(true);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const inInitialViewport = rect.top < window.innerHeight && rect.bottom > 0;
    if (!inInitialViewport) setIsVisible(false);
  }, []);

  useEffect(() => {
    if (isVisible) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "-80px" },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isVisible]);

  if (reduced) return <div ref={ref}>{children}</div>;

  return (
    <motion.div
      ref={ref}
      initial={false}
      animate={isVisible ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  );
}
