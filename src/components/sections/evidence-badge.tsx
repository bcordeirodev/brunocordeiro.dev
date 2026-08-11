import type { EvidenceLevel } from "@/domain";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const EVIDENCE_CLASSES: Record<EvidenceLevel, string> = {
  production: "border-transparent bg-accent/15 text-accent",
  certified: "border-transparent bg-[#5ccfe6]/15 text-[#5ccfe6]",
  professional: "border-border bg-surface text-foreground",
  project: "border-transparent bg-[#a78bfa]/15 text-[#a78bfa]",
  academic: "border-transparent bg-muted/15 text-muted",
  declared: "border-transparent bg-muted/15 text-muted",
};

export function EvidenceBadge({ level, label }: { level: EvidenceLevel; label: string }) {
  return (
    <Badge variant="outline" className={cn(EVIDENCE_CLASSES[level])}>
      {label}
    </Badge>
  );
}
