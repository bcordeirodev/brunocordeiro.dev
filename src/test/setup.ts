import "@testing-library/jest-dom/vitest";
import { afterEach } from "vitest";

// O scheduler do react-dom agenda trabalho via setImmediate; se um update
// pendente (ex.: animação/estado desmontando) disparar depois do teardown do
// jsdom, estoura "window is not defined" em runner lento (flake só no CI).
// Drenar dois ticks de immediate ao fim de cada teste esvazia a fila enquanto
// o window ainda existe.
afterEach(async () => {
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
});

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
