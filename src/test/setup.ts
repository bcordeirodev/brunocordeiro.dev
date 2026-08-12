import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach } from "vitest";

// vitest não roda com `globals: true`, então o auto-cleanup do testing-library
// não se registra sozinho — desmontamos manualmente entre os testes para não
// vazar DOM (ex.: dois gatilhos iguais no document).
afterEach(() => {
  cleanup();
});

// O scheduler do react-dom agenda trabalho via setImmediate; se um update
// pendente (ex.: animação/estado desmontando) disparar depois do teardown do
// jsdom, estoura "window is not defined" em runner lento (flake só no CI).
// Drenar dois ticks de immediate ao fim de cada teste esvazia a fila enquanto
// o window ainda existe.
afterEach(async () => {
  await new Promise((resolve) => setImmediate(resolve));
  await new Promise((resolve) => setImmediate(resolve));
});

// jsdom não implementa a API modal de <dialog> (showModal/close). Um polyfill
// mínimo reflete `open` e dispara o evento "close", suficiente para exercitar
// o comportamento de abrir/fechar em teste.
if (typeof HTMLDialogElement !== "undefined") {
  if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function showModal(this: HTMLDialogElement) {
      this.open = true;
    };
  }
  if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function close(this: HTMLDialogElement) {
      this.open = false;
      this.dispatchEvent(new Event("close"));
    };
  }
}

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
