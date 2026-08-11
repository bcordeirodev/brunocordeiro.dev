import type { CaseChapter as CaseChapterType } from "@/domain";
import { PipelineDiagramLazy } from "@/components/terminal/pipeline-diagram-lazy";
import { DashboardPanel } from "@/components/sections/dashboard-panel";

export function CaseChapter({ chapter }: { chapter: CaseChapterType }) {
  switch (chapter.kind) {
    case "prose":
      return (
        <section id={chapter.id} className="py-10">
          <h2 className="text-2xl font-bold">{chapter.title}</h2>
          <div className="mt-4 flex flex-col gap-4 text-muted">
            {chapter.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </section>
      );
    case "terminal":
      return (
        <section id={chapter.id} className="py-10">
          <h2 className="text-2xl font-bold">{chapter.title}</h2>
          <p className="mt-4 text-muted">{chapter.intro}</p>
          <div className="mt-6">
            <PipelineDiagramLazy lines={chapter.lines} title={chapter.title} />
          </div>
        </section>
      );
    case "dashboard":
      return (
        <section id={chapter.id} className="py-10">
          <h2 className="text-2xl font-bold">{chapter.title}</h2>
          <p className="mt-4 text-muted">{chapter.intro}</p>
          <div className="mt-6">
            <DashboardPanel chapter={chapter} />
          </div>
        </section>
      );
    case "stats":
      return (
        <section id={chapter.id} className="py-10">
          <h2 className="text-2xl font-bold">{chapter.title}</h2>
          <dl className="mt-6 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {chapter.items.map((item) => (
              <div key={item.label} className="flex flex-col gap-1">
                <dt className="text-sm text-muted">{item.label}</dt>
                <dd className="font-medium text-foreground">{item.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      );
  }
}
