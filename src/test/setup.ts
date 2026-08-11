import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement IntersectionObserver, but `motion/react`'s
// useInView (used by NumberTicker/Reveal) constructs one on mount. A no-op
// stub keeps components mounting in tests with their initial (final-value)
// render, matching the documented SSR/no-JS/reduced-motion fallback.
class IntersectionObserverStub implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

if (typeof globalThis.IntersectionObserver === "undefined") {
  globalThis.IntersectionObserver =
    IntersectionObserverStub as unknown as typeof IntersectionObserver;
}
