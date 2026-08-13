"use client";

import { useRef } from "react";
import { Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export type RepoCatalogItem = {
  name: string;
  description: string | null;
  url: string;
  language: string | null;
  stars: number;
  updatedLabel: string;
};

export function RepoCatalogDialog({
  items,
  triggerLabel,
  titleLabel,
  closeLabel,
}: {
  items: RepoCatalogItem[];
  triggerLabel: string;
  titleLabel: string;
  closeLabel: string;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button variant="outline" onClick={() => dialogRef.current?.showModal()}>
        {triggerLabel}
      </Button>
      <dialog
        ref={dialogRef}
        aria-label={titleLabel}
        // Clicks land on the <dialog> itself only when they hit the backdrop;
        // clicks inside the panel target its children.
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-[calc(100vw-2rem)] max-w-2xl rounded-xl border border-border bg-background p-0 text-foreground shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <h3 className="font-mono text-sm font-bold tracking-[0.2em] text-muted uppercase">
            {titleLabel}
          </h3>
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => dialogRef.current?.close()}
            className="rounded-md p-1 text-muted transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <ul className="max-h-[min(60vh,32rem)] divide-y divide-border/50 overflow-y-auto">
          {items.map((repo) => (
            <li key={repo.name}>
              <a
                href={repo.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-6 py-4 outline-none transition-colors hover:bg-accent/5 focus-visible:ring-[3px] focus-visible:ring-ring/50"
              >
                <span className="font-mono text-sm font-medium">{repo.name}</span>
                {repo.description ? (
                  <p className="mt-1 text-sm text-muted">{repo.description}</p>
                ) : null}
                <span className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted">
                  {repo.language ? <span>{repo.language}</span> : null}
                  <span className="inline-flex items-center gap-1">
                    <Star className="size-3.5" aria-hidden="true" />
                    {repo.stars}
                  </span>
                  <span>{repo.updatedLabel}</span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </dialog>
    </>
  );
}
