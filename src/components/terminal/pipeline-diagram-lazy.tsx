"use client";

import dynamic from "next/dynamic";

/**
 * Client-only, lazily loaded wrapper around `PipelineDiagram`.
 *
 * The diagram is a decorative, below-the-fold widget: it already only
 * animates once scrolled into view (`whileInView` in `pipeline-diagram.tsx`),
 * and the surrounding prose in `case-chapter.tsx` carries the same
 * information for SEO/no-JS purposes. Loading it with `ssr: false` keeps its
 * `motion`-driven code out of the initial server-rendered HTML and off the
 * critical hydration path, instead of always executing on first paint.
 *
 * The skeleton mirrors the diagram's box (title + monospace lines with the
 * component's own padding/border) so swapping it for the real component
 * doesn't shift layout once the client chunk loads. next/dynamic's `loading`
 * render prop doesn't receive the `lines`/`title` props passed to the
 * dynamic component, so it can't size itself per chapter — 232px is sized
 * for the tallest current "terminal" chapter (case-study.ts's "pipeline",
 * 9 lines); the shorter "workflow" chapter (8 lines) ends up ~1 line
 * shorter than its skeleton, a small harmless shrink instead of the growth
 * that caused a real CLS hit on /link-charts.
 */
export const PipelineDiagramLazy = dynamic(
  () => import("./pipeline-diagram").then((mod) => mod.PipelineDiagram),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[232px] animate-pulse rounded-lg border border-border bg-surface-deep"
        aria-hidden="true"
      />
    ),
  },
);
