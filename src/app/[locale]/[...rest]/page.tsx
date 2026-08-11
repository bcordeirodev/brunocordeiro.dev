import { notFound } from "next/navigation";

/**
 * Catches any URL under `/[locale]/...` that doesn't match a more specific
 * route (e.g. `/pt/rota-que-nao-existe`) and renders the nearest
 * `not-found.tsx` boundary instead of falling through to Next's generic,
 * unthemed, English-only `_not-found` page.
 */
export default function CatchAllPage() {
  notFound();
}
