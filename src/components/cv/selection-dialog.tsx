"use client";

import { useRef, type ReactNode } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Modal do painel de seleção do CV. Mesmo padrão do `RepoCatalogDialog`:
 * `<dialog>` nativo, então ESC e o backdrop vêm do browser de graça.
 * Não há "aplicar/cancelar" — o painel altera a seleção direto, e o preview
 * atrás da modal acompanha.
 */
export function SelectionDialog({
  triggerLabel,
  titleLabel,
  closeLabel,
  children,
}: {
  triggerLabel: string;
  titleLabel: string;
  closeLabel: string;
  children: ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button variant="outline" onClick={() => dialogRef.current?.showModal()}>
        <SlidersHorizontal className="size-4" aria-hidden="true" />
        {triggerLabel}
      </Button>
      <dialog
        ref={dialogRef}
        aria-label={titleLabel}
        // Cliques só atingem o próprio <dialog> quando caem no backdrop;
        // dentro do painel eles têm outro alvo.
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
        className="m-auto w-[calc(100vw-2rem)] max-w-lg rounded-xl border border-border bg-background p-0 text-foreground shadow-lg backdrop:bg-black/50 backdrop:backdrop-blur-sm"
      >
        <div className="flex items-center justify-between border-b border-border/50 px-6 py-4">
          <h3 className="font-mono text-sm font-bold tracking-[0.2em] text-muted uppercase">{titleLabel}</h3>
          <button
            type="button"
            aria-label={closeLabel}
            onClick={() => dialogRef.current?.close()}
            className="rounded-md p-1 text-muted transition-colors hover:text-foreground focus-visible:ring-[3px] focus-visible:ring-ring/50"
          >
            <X className="size-4" aria-hidden="true" />
          </button>
        </div>
        <div className="max-h-[min(70vh,36rem)] overflow-y-auto px-6 py-4">{children}</div>
      </dialog>
    </>
  );
}
