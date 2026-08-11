"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type FinishViewTransition = () => void;
type SetFinishViewTransition = (finish: FinishViewTransition) => void;

const ViewTransitionContext = createContext<SetFinishViewTransition | null>(null);

/**
 * Bridges React's async route rendering with `document.startViewTransition`,
 * whose callback must not resolve until the new route has actually painted.
 *
 * This mirrors the technique used by the `next-view-transitions` community
 * package, minus its `usePathname()`-based popstate (browser back/forward)
 * support: reading `usePathname()` anywhere under this provider would make
 * Next.js treat the whole subtree as dynamic under `cacheComponents`, which
 * would knock every statically-prerendered page in this app off the static
 * path. Only forward navigation through `TransitionLink` gets the animated
 * transition as a result — back/forward navigation falls back to an instant
 * swap, which is an acceptable trade-off for keeping pages static.
 */
export function ViewTransitionsProvider({ children }: { children: ReactNode }) {
  const [finishViewTransition, setFinishViewTransition] = useState<FinishViewTransition | null>(
    null,
  );

  useEffect(() => {
    // Each navigation registers a fresh closure (`setFinishViewTransition(() =>
    // resolve)`), so this doesn't need to reset state back to `null` between
    // runs — that would mean calling `setState` synchronously inside the
    // effect body, which `react-hooks/set-state-in-effect` (paired with the
    // React Compiler) flags as a cascading-render risk.
    finishViewTransition?.();
  }, [finishViewTransition]);

  return (
    <ViewTransitionContext.Provider value={setFinishViewTransition}>
      {children}
    </ViewTransitionContext.Provider>
  );
}

export function useSetFinishViewTransition(): SetFinishViewTransition {
  const context = useContext(ViewTransitionContext);
  if (!context) {
    throw new Error("useSetFinishViewTransition must be used within a ViewTransitionsProvider");
  }
  return context;
}
