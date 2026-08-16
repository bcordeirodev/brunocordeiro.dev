import type { CaseChapter as CaseChapterType, GrafanaStats, LinkchartsStats } from "@/domain";
import type { Locale } from "@/content";
import { PipelineDiagramLazy } from "@/components/terminal/pipeline-diagram-lazy";
import { ArchitectureDiagram } from "@/components/sections/architecture-diagram";
import { DeployDiagram } from "@/components/sections/deploy-diagram";
import { GithubStatsBoard } from "@/components/sections/github-stats-board";
import { GrafanaBoard } from "@/components/sections/grafana-board";
import { grafanaSnapshot } from "@/content/grafana-snapshot";
import { linkchartsStatsSnapshot } from "@/content/linkcharts-stats-snapshot";
import { Badge } from "@/components/ui/badge";

// Corpo de leitura: um ponto menor que o padrão do site e com a medida
// limitada — solto na largura da página daria quase 90 caracteres por linha.
const PROSE = "max-w-[68ch] text-[15px]/relaxed text-muted";

// Rótulo mono em caixa alta para pares rótulo/valor: grupos da stack e
// termos da lista de qualidade usam o mesmo.
const EYEBROW = "font-mono text-xs tracking-[0.15em] text-muted uppercase";

/**
 * Cada capítulo é um card com o título dentro, separado do corpo por um
 * filete.
 *
 * O contorno é só borda: nenhum preenchimento atrás de texto corrido. O
 * `bg-surface-deep` continua significando uma coisa só — painel — então os
 * diagramas, o terminal e o board do Grafana seguem sendo as únicas
 * superfícies da página, e o card emoldura sem competir com eles.
 */
function Chapter({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 py-6">
      <article className="rounded-2xl border border-border/60 p-6 sm:p-10">
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{title}</h2>
        <div className="mt-5 border-t border-border/40 pt-7">{children}</div>
      </article>
    </section>
  );
}

export function CaseChapter({
  chapter,
  grafanaStats,
  linkchartsStats,
  locale = "pt",
}: {
  chapter: CaseChapterType;
  grafanaStats?: GrafanaStats;
  linkchartsStats?: LinkchartsStats;
  locale?: Locale;
}) {
  switch (chapter.kind) {
    case "prose":
      return (
        <Chapter id={chapter.id} title={chapter.title}>
          {/* O desenho vem antes do texto: é a tese do capítulo, e os
              parágrafos detalham o que ele já mostrou. */}
          {chapter.architecture && (
            <ArchitectureDiagram diagram={chapter.architecture} title={chapter.title} />
          )}
          <div
            className={`flex flex-col gap-4 ${PROSE} ${chapter.architecture ? "mt-8" : ""}`.trim()}
          >
            {chapter.paragraphs.map((paragraph, i) => (
              <p key={i}>{paragraph}</p>
            ))}
          </div>
        </Chapter>
      );
    case "terminal":
      return (
        <Chapter id={chapter.id} title={chapter.title}>
          <p className={PROSE}>{chapter.intro}</p>
          {/* Topologia primeiro, execução depois: o desenho diz o que são
              blue e green, o terminal mostra a esteira rodando. */}
          {chapter.deploy && <DeployDiagram diagram={chapter.deploy} title={chapter.title} />}
          <div className="mt-8">
            <PipelineDiagramLazy lines={chapter.lines} />
          </div>
        </Chapter>
      );
    case "tags":
      return (
        <Chapter id={chapter.id} title={chapter.title}>
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
        </Chapter>
      );
    case "github":
      return (
        <Chapter id={chapter.id} title={chapter.title}>
          <p className={PROSE}>{chapter.intro}</p>
          <div className="mt-8">
            <GithubStatsBoard
              chapter={chapter}
              stats={linkchartsStats ?? linkchartsStatsSnapshot}
              locale={locale}
            />
          </div>
        </Chapter>
      );
    case "grafana":
      return (
        <Chapter id={chapter.id} title={chapter.title}>
          <p className={PROSE}>{chapter.intro}</p>
          <div className="mt-8">
            <GrafanaBoard
              chapter={chapter}
              stats={grafanaStats ?? grafanaSnapshot}
              locale={locale}
            />
          </div>
        </Chapter>
      );
    case "stats":
      return (
        <Chapter id={chapter.id} title={chapter.title}>
          {/* Ficha técnica: cada par ganha um filete no topo em vez de uma
              caixa — mesma linguagem da abertura, sem fundo nenhum. */}
          <dl className="grid gap-x-10 gap-y-7 sm:grid-cols-2">
            {chapter.items.map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1.5 border-t border-border/40 pt-3"
              >
                <dt className={EYEBROW}>{item.label}</dt>
                <dd className="text-[15px]/relaxed text-foreground/90">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Chapter>
      );
  }
}
