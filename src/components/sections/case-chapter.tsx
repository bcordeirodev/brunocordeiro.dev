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
    case "tags":
      return (
        <section id={chapter.id} className="py-10">
          <h2 className="text-2xl font-bold">{chapter.title}</h2>
          <div className="mt-6 flex flex-col gap-5">
            {chapter.groups.map((group) => (
              <div key={group.label} className="flex flex-col gap-2">
                <h3 className="font-mono text-xs tracking-[0.15em] text-muted uppercase">
                  {group.label}
                </h3>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li
                      key={item}
                      className="rounded-md border border-border/60 px-2 py-0.5 font-mono text-xs text-foreground/90"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
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
