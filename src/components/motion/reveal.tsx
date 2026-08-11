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
      // The hidden branch only ever runs once, synchronously before the
      // browser's first paint (the useLayoutEffect above), to pre-arm an
      // off-screen section for its later reveal — it must be instant
      // (duration: 0). Without this, motion still runs a real, several
      // -hundred-ms opacity/transform transition immediately after mount for
      // every below-the-fold section (even though it's invisible, off
      // -screen), which burns main-thread/compositor time right in the
      // critical rendering window and measurably delays LCP — this was
      // caught by a CI Lighthouse regression (home LCP 2.9s -> 3.4s) after
      // an earlier version of this fix used one fixed transition for both
      // directions. Only the scroll-triggered reveal (isVisible flipping to
      // true) should use the slower, visible fade/slide-in.
      transition={isVisible ? { duration: 0.5, delay } : { duration: 0 }}
    >
      {children}
    </motion.div>
  );
}
