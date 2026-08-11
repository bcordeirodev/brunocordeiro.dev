"use client";

import type { EvidenceLevel, SkillCategory } from "@/domain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EvidenceBadge } from "@/components/sections/evidence-badge";
import { cn } from "@/lib/utils";

export function SkillMatrix({
  categories,
  labels,
}: {
  categories: SkillCategory[];
  labels: Record<EvidenceLevel, string>;
}) {
  return (
    <Tabs defaultValue={categories[0]?.id}>
      {/* 9 categories don't fit one row. `h-auto!` is required (not just
          `h-auto`) because the base TabsList variant sets a fixed
          `group-data-horizontal/tabs:h-8`: that utility and this one carry
          equal CSS specificity, so without `!important` the cascade can pick
          either depending on generation order — the fixed height wins,
          clipping the box to one row while wrapped tabs visually overflow
          on top of the content below. Below `sm`, tabs scroll horizontally
          instead of wrapping (native `-webkit-overflow-scrolling`, hidden
          scrollbar); at `sm` and up they wrap cleanly onto extra rows. */}
      <TabsList className="h-auto! w-full flex-nowrap justify-start gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:w-fit sm:flex-wrap sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden">
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            id={`skill-tab-${category.id}`}
            aria-controls={`skill-panel-${category.id}`}
            className="shrink-0"
          >
            {category.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map((category) => (
        <TabsContent
          key={category.id}
          value={category.id}
          id={`skill-panel-${category.id}`}
          aria-labelledby={`skill-tab-${category.id}`}
          // Keeps all 9 category panels rendered in the initial HTML instead
          // of only the active one. Inactive panels are still marked
          // `hidden`/`inert` by the underlying Tabs.Panel (invisible to users
          // and ignored by axe), but the markup — and every skill name/proof
          // inside it — is present for crawlers, ATS parsers, and sourcing
          // agents that only ever see the first HTML response.
          keepMounted
        >
          <ul className="divide-y divide-border/60">
            {category.skills.map((skill) => (
              <li key={skill.name} className="flex flex-col gap-1 py-3">
                <div className="flex items-center justify-between gap-2">
                  <span className={cn("font-mono text-sm", skill.highlight && "text-accent")}>
                    {skill.name}
                  </span>
                  <EvidenceBadge level={skill.evidence} label={labels[skill.evidence]} />
                </div>
                <p className="text-sm text-muted">{skill.proof}</p>
              </li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  );
}
