"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { TransitionLink } from "@/components/motion/transition-link";

export type NavItem = { href: string; label: string; isRoute?: boolean };

/**
 * Navegação do header abaixo de `md`. As cinco âncoras em linha quebravam em
 * duas linhas no celular e, com o seletor de idioma numa terceira, o header
 * fixo ocupava 149px — quase um quinto da tela, durante a visita inteira.
 * Aqui elas ficam atrás de um botão e o header volta a ter uma linha.
 *
 * O painel é `absolute` em relação ao <header> (que é `sticky`), então ocupa a
 * largura toda logo abaixo dele.
 */
export function MobileNav({ items, label }: { items: NavItem[]; label: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    function onKeyDown(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      buttonRef.current?.focus();
    }
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    }
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="md:hidden">
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((value) => !value)}
        className="-mr-2.5 inline-flex size-10 items-center justify-center rounded-lg text-muted outline-none hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-5"
      >
        {open ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
      </button>
      {open ? (
        // Qualquer clique num link fecha o painel: as âncoras da home só
        // rolam a página, sem trocar de rota, e o painel ficaria por cima.
        <nav
          id={panelId}
          onClick={() => setOpen(false)}
          className="absolute inset-x-0 top-full border-b border-border bg-background"
        >
          <ul className="mx-auto flex max-w-5xl flex-col px-6 py-2">
            {items.map((item) => {
              const className = "flex h-11 items-center text-sm text-muted hover:text-foreground";
              return (
                <li key={item.href}>
                  {item.isRoute ? (
                    <TransitionLink href={item.href} className={className}>
                      {item.label}
                    </TransitionLink>
                  ) : (
                    <Link href={item.href} className={className}>
                      {item.label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}
