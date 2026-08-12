"use client";

import type { SkillCategory } from "@/domain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export function SkillMatrix({ categories }: { categories: SkillCategory[] }) {
  return (
    <Tabs defaultValue={categories[0]?.id}>
      {/* Below `sm`, tabs scroll horizontally (native
          `-webkit-overflow-scrolling`, hidden scrollbar) with a trailing-edge
          fade hinting that the row continues; the mask fades to transparent
          instead of an opaque overlay, so it still shows bg-surface. At `sm`
          and up the 5 tabs fit a single row; `h-auto!` + flex-wrap stay as a
          safety net if a locale's titles ever overflow — `h-auto!` (not just
          `h-auto`) because the base TabsList variant sets a fixed
          `group-data-horizontal/tabs:h-8` with equal CSS specificity. */}
      <TabsList
        className={cn(
          "h-auto! w-full flex-nowrap justify-start gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:w-fit sm:flex-wrap sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden",
          "[mask-image:linear-gradient(to_right,black,black_calc(100%-2.5rem),transparent)] sm:[mask-image:none]",
        )}
      >
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
          // Keeps every category panel rendered in the initial HTML instead
          // of only the active one. Inactive panels are still marked
          // `hidden`/`inert` by the underlying Tabs.Panel (invisible to users
          // and ignored by axe), but the markup — and every skill name/proof
          // inside it — is present for crawlers, ATS parsers, and sourcing
          // agents that only ever see the first HTML response.
          keepMounted
        >
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {category.skills.map((skill) => (
              <li
                key={skill.name}
                className="flex flex-col gap-0.5 border-b border-border/60 py-2.5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <span className="font-mono text-sm">{skill.name}</span>
                  <span className="font-mono text-[11px] text-muted">{skill.tags.join(" · ")}</span>
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
