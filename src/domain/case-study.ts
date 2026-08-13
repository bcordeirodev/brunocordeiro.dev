import { z } from "zod";

const architectureNodeSchema = z.object({
  title: z.string().min(1),
  sub: z.string().min(1),
});

// O diagrama de arquitetura é desenhado num viewBox de coordenadas fixas
// (architecture-diagram.tsx), então a contagem de linhas é parte do
// contrato: um item a mais estoura o card em vez de reposicionar o layout.
export const architectureDiagramSchema = z.object({
  caption: z.string().min(1),
  bands: z.object({
    clients: z.string().min(1),
    edge: z.string().min(1),
    app: z.string().min(1),
    data: z.string().min(1),
  }),
  clients: z.object({ browser: architectureNodeSchema, bots: architectureNodeSchema }),
  edge: z.object({ cdn: architectureNodeSchema, proxy: architectureNodeSchema }),
  web: z.object({ title: z.string().min(1), lines: z.array(z.string().min(1)).length(4) }),
  api: z.object({ title: z.string().min(1), lines: z.array(z.string().min(1)).length(2) }),
  // Rótulo da moldura que envolve nginx, apps e dados: tudo dentro dela
  // roda no mesmo servidor, o que separa a borda de CDN do que é meu.
  host: z.string().min(1),
  link: z.object({ top: z.string().min(1), bottom: z.string().min(1) }),
  hotPath: z.object({
    route: z.string().min(1),
    sub: z.string().min(1),
    human: z.string().min(1),
    bot: z.string().min(1),
  }),
  data: z.object({
    db: architectureNodeSchema,
    cache: architectureNodeSchema,
    worker: architectureNodeSchema,
    writeback: z.string().min(1),
  }),
  trace: z.string().min(1),
  legend: z.object({ sync: z.string().min(1), async: z.string().min(1) }),
  // Abaixo de ~760px o desenho não cabe e a região rola; sem esta dica o
  // leitor no celular vê só o canto superior esquerdo e acha que é tudo.
  scrollHint: z.string().min(1),
});

export type ArchitectureDiagram = z.infer<typeof architectureDiagramSchema>;

// Mesmo contrato de coordenadas fixas do diagrama de arquitetura, agora
// para a topologia do release: a esteira até a imagem e a troca de cor
// atrás do nginx — o que o terminal animado narra mas não desenha.
export const deployDiagramSchema = z.object({
  caption: z.string().min(1),
  bands: z.object({
    integration: z.string().min(1),
    publication: z.string().min(1),
    cutover: z.string().min(1),
    decisions: z.string().min(1),
  }),
  // Faixa de contexto: o que acontece antes de existir uma tag. Fica curta
  // de propósito — o capítulo anterior é que detalha o CI.
  integration: z.array(z.string().min(1)).length(5),
  // Rótulo da fronteira entre integrar e publicar.
  gate: z.string().min(1),
  steps: z.array(architectureNodeSchema).length(4),
  proxy: architectureNodeSchema,
  blue: z.object({
    title: z.string().min(1),
    lines: z.array(z.string().min(1)).length(2),
    edge: z.string().min(1),
  }),
  green: z.object({
    title: z.string().min(1),
    lines: z.array(z.string().min(1)).length(2),
    edge: z.string().min(1),
  }),
  verdict: z.string().min(1),
  // O porquê de cada escolha da esteira — sem isso o desenho mostra o que
  // acontece e esconde a engenharia por trás.
  decisions: z.array(z.string().min(1)).length(4),
  legend: z.object({ live: z.string().min(1), draining: z.string().min(1) }),
  scrollHint: z.string().min(1),
});

export type DeployDiagram = z.infer<typeof deployDiagramSchema>;

export const caseChapterSchema = z.discriminatedUnion("kind", [
  z.object({
    kind: z.literal("prose"),
    id: z.string(),
    title: z.string(),
    paragraphs: z.array(z.string().min(1)).min(1),
    architecture: architectureDiagramSchema.optional(),
  }),
  z.object({
    kind: z.literal("terminal"),
    id: z.string(),
    title: z.string(),
    intro: z.string(),
    lines: z.array(z.string().min(1)).min(1),
    deploy: deployDiagramSchema.optional(),
  }),
  z.object({
    kind: z.literal("stats"),
    id: z.string(),
    title: z.string(),
    items: z.array(z.object({ label: z.string(), value: z.string() })).min(1),
  }),
  z.object({
    kind: z.literal("tags"),
    id: z.string(),
    title: z.string(),
    groups: z
      .array(
        z.object({
          label: z.string().min(1),
          items: z.array(z.string().min(1)).min(1),
        }),
      )
      .min(1),
  }),
  z.object({
    kind: z.literal("grafana"),
    id: z.string(),
    title: z.string(),
    intro: z.string(),
    board: z.object({
      title: z.string().min(1),
      timeRange: z.string().min(1),
      attribution: z.string().min(1),
      snapshotLabel: z.string().min(1),
      liveLabel: z.string().min(1),
      updatedLabel: z.string().min(1),
      footer: z.string().min(1),
    }),
    panels: z.object({
      uptime: z.object({
        title: z.string().min(1),
        sub: z.string().min(1),
        source: z.string().min(1),
      }),
      p95: z.object({ title: z.string().min(1), sub: z.string().min(1) }),
      errors: z.object({ title: z.string().min(1), sub: z.string().min(1) }),
      reqRate: z.object({ title: z.string().min(1), sub: z.string().min(1) }),
      activity: z.object({
        title: z.string().min(1),
        sub: z.string().min(1),
        source: z.string().min(1),
      }),
    }),
  }),
]);

export const caseStudySchema = z.object({
  slug: z.literal("link-charts"),
  title: z.string().min(1),
  tagline: z.string().min(1),
  productUrl: z.string().url(),
  chapters: z.array(caseChapterSchema).min(5),
});

export type CaseStudy = z.infer<typeof caseStudySchema>;
export type CaseChapter = z.infer<typeof caseChapterSchema>;
