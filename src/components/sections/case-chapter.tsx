import type { CaseChapter as CaseChapterType, GrafanaStats } from "@/domain";
import type { Locale } from "@/content";
import { PipelineDiagramLazy } from "@/components/terminal/pipeline-diagram-lazy";
import { ArchitectureDiagram } from "@/components/sections/architecture-diagram";
import { DeployDiagram } from "@/components/sections/deploy-diagram";
import { GrafanaBoard } from "@/components/sections/grafana-board";
import { grafanaSnapshot } from "@/content/grafana-snapshot";
import { Badge } from "@/components/ui/badge";

// Corpo de leitura: um ponto menor que o padrão do site e com a medida
// limitada — solto na largura da página daria quase 90 caracteres por linha.
const PROSE = "max-w-[68ch] text-[15px]/relaxed text-muted";

// Rótulo mono em caixa alta para pares rótulo/valor: grupos da stack e
// termos da lista de qualidade usam o mesmo.
const EYEBROW = "font-mono text-xs tracking-[0.15em] text-muted uppercase";

/**
 * Abertura de capítulo: o slug interrompe um filete que corre até a borda,
 * e o título vem logo abaixo, sem moldura.
 *
 * O slug não é enfeite — é a âncora real da URL daquele trecho, então vale
 * como link. E o gesto de um rótulo cortando uma linha é o mesmo que já
 * acontece dentro dos desenhos (a etiqueta do DigitalOcean cortando a
 * moldura do servidor, os badges do board do Grafana sobre a borda).
 *
 * Nada de fundo aqui: `bg-surface-deep` fica reservado para os painéis, que
 * são a prova do capítulo. Se o texto também morasse numa caixa, os dois
 * competiriam e o painel deixaria de ser o acontecimento da página.
 */
function ChapterOpening({ id, title }: { id: string; title: string }) {
  return (
    <>
      <div className="flex items-center gap-4">
        <a
          href={`#${id}`}
          className="rounded-sm font-mono text-xs text-muted transition-colors hover:text-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
        >
          #{id}
        </a>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </div>
      <h2 className="mt-4 text-2xl font-bold tracking-tight">{title}</h2>
    </>
  );
}

/**
 * Espaço maior acima do filete do que abaixo do último bloco: o filete
 * pertence ao capítulo que abre, não ao que acabou de terminar.
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
    <section id={id} className="scroll-mt-24 pt-14 pb-4">
      <ChapterOpening id={id} title={title} />
      <div className="mt-6">{children}</div>
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
            <PipelineDiagramLazy lines={chapter.lines} title={chapter.title} />
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
                className="flex flex-col gap-1.5 border-t border-border/60 pt-3"
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
