import type { EvidenceLevel } from "@/domain";
import { cn } from "@/lib/utils";

const EVIDENCE_DOT_CLASSES: Record<EvidenceLevel, string> = {
  production: "bg-accent",
  certified: "bg-[#5ccfe6]",
  project: "bg-[#a78bfa]",
  professional: "bg-muted",
  academic: "bg-muted",
  declared: "bg-muted",
};

export function EvidenceBadge({ level, label }: { level: EvidenceLevel; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        aria-hidden="true"
        className={cn("size-1.5 shrink-0 rounded-full", EVIDENCE_DOT_CLASSES[level])}
      />
      <span className="font-mono text-[11px] text-muted">{label}</span>
    </span>
  );
}
