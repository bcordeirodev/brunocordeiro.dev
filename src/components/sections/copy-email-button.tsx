"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";

export function CopyEmailButton({
  email,
  copyLabel,
  copiedLabel,
}: {
  email: string;
  copyLabel: string;
  copiedLabel: string;
}) {
  const [copied, setCopied] = useState(false);
  return (
    <Button
      variant="outline"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(email);
        } catch {
          return;
        }
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? copiedLabel : copyLabel}
    </Button>
  );
}
