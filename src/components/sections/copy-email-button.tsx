"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * `iconOnly` é a metade direita do grupo de e-mail do hero: o endereço já está
 * escrito ao lado (num link `mailto:`), então o botão vira só o ícone, com
 * largura fixa — trocar "Copy email" por "Copied!" mudava a largura do botão
 * e empurrava os vizinhos. O rótulo continua no nome acessível.
 */
export function CopyEmailButton({
  email,
  copyLabel,
  copiedLabel,
  iconOnly = false,
  className,
}: {
  email: string;
  copyLabel: string;
  copiedLabel: string;
  iconOnly?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  if (!iconOnly) {
    return (
      <Button variant="outline" className={className} onClick={copy}>
        {copied ? copiedLabel : copyLabel}
      </Button>
    );
  }

  return (
    <>
      <Button
        variant="ghost"
        aria-label={copyLabel}
        className={cn("text-muted", copied && "text-accent hover:text-accent", className)}
        onClick={copy}
      >
        {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      </Button>
      {/* Sem texto visível trocando, quem usa leitor de tela precisa do aviso. */}
      <span role="status" className="sr-only">
        {copied ? copiedLabel : ""}
      </span>
    </>
  );
}
