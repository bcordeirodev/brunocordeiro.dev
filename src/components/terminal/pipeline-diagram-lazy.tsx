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
 * The skeleton mirrors the diagram's box (title + 8 monospace lines with the
 * component's own padding/border) so swapping it for the real component
 * doesn't shift layout once the client chunk loads.
 */
export const PipelineDiagramLazy = dynamic(
  () => import("./pipeline-diagram").then((mod) => mod.PipelineDiagram),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-[212px] animate-pulse rounded-lg border border-border bg-[#0a0e14]"
        aria-hidden="true"
      />
    ),
  },
);
