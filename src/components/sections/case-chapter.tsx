import type { CaseChapter as CaseChapterType, GrafanaStats } from "@/domain";
import type { Locale } from "@/content";
import { PipelineDiagramLazy } from "@/components/terminal/pipeline-diagram-lazy";
import { ArchitectureDiagram } from "@/components/sections/architecture-diagram";
import { DeployDiagram } from "@/components/sections/deploy-diagram";
import { GrafanaBoard } from "@/components/sections/grafana-board";
import { grafanaSnapshot } from "@/content/grafana-snapshot";
import { Badge } from "@/components/ui/badge";

// Corpo de leitura do case: um ponto menor que o padrão do site e com a
// linha limitada — dentro do card a coluna tem ~780px, o que daria quase
// 90 caracteres por linha se deixasse correr solta.
const PROSE = "max-w-[68ch] text-[15px]/relaxed text-muted";

// Rótulo mono em caixa alta, usado tanto nos grupos da stack quanto nos
// termos da lista de qualidade — os dois são pares rótulo/valor.
const EYEBROW = "font-mono text-xs tracking-[0.15em] text-muted uppercase";

/**
 * Cada capítulo é um card: título dentro, separado do corpo por um filete.
 * Os painéis escuros (diagramas, terminal, Grafana) ficam embutidos nele —
 * o card é a superfície de leitura, o painel é o degrau recuado.
 */
function ChapterCard({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-5">
      <article className="rounded-xl border border-border/60 bg-surface/50 p-5 sm:p-8">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        <div className="mt-4 border-t border-border/60 pt-6">{children}</div>
      </article>
    </section>
  );
}

export function CaseChapter({
  chapter,
  grafanaStats,
  locale = "pt",
}: {
  chapter: CaseChapterType;
  grafanaStats?: GrafanaStats;
  locale?: Locale;
}) {
  switch (chapter.kind) {
    case "prose":
      return (
        <ChapterCard id={chapter.id} title={chapter.title}>
          {/* O desenho vem antes do texto: é a tese do capítulo, e os
              parágrafos detalham o que ele já mostrou. */}
          {chapter.architecture && (
            <ArchitectureDiagram diagram={chapter.architecture} title={chapter.title} />
          )}
          <div
            className={`flex flex-col gap-4 ${PROSE} ${chapter.architecture ? "mt-6" : ""}`.trim()}
          >
            {chapter.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </ChapterCard>
      );
    case "terminal":
      return (
        <ChapterCard id={chapter.id} title={chapter.title}>
          <p className={PROSE}>{chapter.intro}</p>
          {/* Topologia primeiro, execução depois: o desenho diz o que são
              blue e green, o terminal mostra a esteira rodando. */}
          {chapter.deploy && <DeployDiagram diagram={chapter.deploy} title={chapter.title} />}
          <div className="mt-6">
            <PipelineDiagramLazy lines={chapter.lines} title={chapter.title} />
          </div>
        </ChapterCard>
      );
    case "tags":
      return (
        <ChapterCard id={chapter.id} title={chapter.title}>
          <div className="flex flex-col gap-6">
            {chapter.groups.map((group) => (
              <div key={group.label} className="flex flex-col gap-2.5">
                <h3 className={EYEBROW}>{group.label}</h3>
                <ul className="flex flex-wrap gap-1.5">
                  {group.items.map((item) => (
                    <li key={item}>
                      <Badge variant="tech" className="h-auto max-w-full whitespace-normal">
                        {item}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ChapterCard>
      );
    case "grafana":
      return (
        <ChapterCard id={chapter.id} title={chapter.title}>
          <p className={PROSE}>{chapter.intro}</p>
          <div className="mt-6">
            <GrafanaBoard
              chapter={chapter}
              stats={grafanaStats ?? grafanaSnapshot}
              locale={locale}
            />
          </div>
        </ChapterCard>
      );
    case "stats":
      return (
        <ChapterCard id={chapter.id} title={chapter.title}>
          <dl className="grid gap-x-10 gap-y-6 sm:grid-cols-2">
            {chapter.items.map((item) => (
              <div key={item.label} className="flex flex-col gap-1.5">
                <dt className={EYEBROW}>{item.label}</dt>
                <dd className="text-[15px]/relaxed text-foreground/90">{item.value}</dd>
              </div>
            ))}
          </dl>
        </ChapterCard>
      );
  }
}
