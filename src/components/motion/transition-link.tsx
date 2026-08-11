"use client";

import { startTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/navigation";
import { useSetFinishViewTransition } from "./view-transitions";

/**
 * Drop-in replacement for the localized `Link` (`@/i18n/navigation`) that
 * drives real cross-page navigations through `document.startViewTransition`,
 * so the `::view-transition-old(root)`/`::view-transition-new(root)` rules in
 * `globals.css` actually get a transition to animate.
 *
 * Falls back to the plain (localized, prefetching) `<Link>` click behavior
 * whenever the browser doesn't support the View Transitions API or the user
 * prefers reduced motion — no branch skips setting `href`, so navigation
 * works correctly either way.
 *
 * Not used for locale-switching links: those go through next-intl's cookie
 * sync in `BaseLink`, which this component intentionally doesn't replicate.
 *
 * Also not used for the header's same-page anchors (`/#stack` etc. while on
 * the home): those are scrolls, not navigations — wrapping them in a view
 * transition would flash the whole page for what is visually a scroll. Every
 * link that actually crosses a route (case-study CTA, back-to-contact) goes
 * through this component.
 */
export function TransitionLink({
  href,
  className,
  children,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const setFinishViewTransition = useSetFinishViewTransition();

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLAnchorElement>) => {
      const isModifiedClick =
        event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
      if (isModifiedClick) return;
      if (!("startViewTransition" in document)) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      const resolvedHref = event.currentTarget.getAttribute("href");
      if (!resolvedHref) return;

      event.preventDefault();
      document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            startTransition(() => {
              router.push(resolvedHref);
              setFinishViewTransition(() => resolve);
            });
          }),
      );
    },
    [router, setFinishViewTransition],
  );

  return (
    <Link href={href} className={className} onClick={handleClick}>
      {children}
    </Link>
  );
}
