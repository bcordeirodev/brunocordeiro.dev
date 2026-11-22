"use client";

import type { Locale } from "@/content";
import { Link, usePathname } from "@/i18n/navigation";
import { cn } from "@/lib/utils";

const LOCALES: Locale[] = ["pt", "en"];

/**
 * Client component (needs `usePathname`) so switching locale preserves the
 * current page instead of always jumping back to the home route.
 */
export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  return (
    <div className="flex items-center gap-2 text-xs">
      {LOCALES.map((loc, index) => (
        <span key={loc} className="flex items-center gap-2">
          {index > 0 ? (
            <span aria-hidden="true" className="text-muted">
              /
            </span>
          ) : null}
          <Link
            href={pathname}
            locale={loc}
            aria-current={locale === loc ? "true" : undefined}
            // O padding com margem negativa aumenta a área de toque (as
            // siglas têm ~16px) sem mexer na altura do header.
            className={cn(
              "-mx-1.5 -my-3 px-1.5 py-3 uppercase",
              locale === loc ? "text-foreground" : "text-muted hover:text-foreground",
            )}
          >
            {loc}
          </Link>
        </span>
      ))}
    </div>
  );
}
