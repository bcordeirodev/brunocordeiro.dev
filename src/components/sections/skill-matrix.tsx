"use client";

import type { EvidenceLevel, SkillCategory } from "@/domain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
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
      <TabsList className="h-auto flex-wrap">
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            id={`skill-tab-${category.id}`}
            aria-controls={`skill-panel-${category.id}`}
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
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {category.skills.map((skill) => (
              <Card key={skill.name} className={cn(skill.highlight && "ring-2 ring-accent")}>
                <CardContent className="flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-medium">{skill.name}</span>
                    <EvidenceBadge level={skill.evidence} label={labels[skill.evidence]} />
                  </div>
                  <p className="text-sm text-muted">{skill.proof}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
