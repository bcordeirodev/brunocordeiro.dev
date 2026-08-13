import type { DeployDiagram as Diagram } from "@/domain";

/*
 * Par do architecture-diagram: mesmo viewBox de 900 de largura, mesmo
 * gutter de bandas e mesma paleta.
 *
 * O desenho conta o release inteiro, não só a parte automatizada:
 *
 *   integração  16..50    branch → commit → push → CI → merge, só contorno
 *                         e cinza: é contexto, o capítulo anterior detalha
 *   gate        86        a fronteira entre integrar e publicar; a seta de
 *                         merge para tag cruza essa linha de propósito
 *   publicação  110..174  tag → build → ghcr → rsync
 *   cutover     214..420  nginx troca o upstream; green entra, blue drena
 *   decisões    452..560  por que a esteira é assim — a parte que o terminal
 *                         logo abaixo executa mas nunca explica
 *
 * Colunas (x): gutter 0..80 · conteúdo 100..856 · eixo 478
 * Verde = a cor que está no ar; tracejado cinza = a que está drenando.
 * Limites de caractere por campo em deploy-diagram.test.tsx.
 */

const AXIS = 478;
const CONTENT_LEFT = 100;
const CONTENT_RIGHT = 856;

/** Contexto antes da tag: cinco marcos, 22px de seta entre um e outro. */
const FLOW_SLOTS = [
  { x: 100, w: 133 },
  { x: 255, w: 133 },
  { x: 410, w: 133 },
  { x: 565, w: 133 },
  { x: 720, w: 136 },
] as const;

/** A esteira propriamente dita: quatro degraus, 26px de seta entre eles. */
const STEP_SLOTS = [
  { x: 100, w: 169 },
  { x: 295, w: 169 },
  { x: 490, w: 169 },
  { x: 685, w: 171 },
] as const;

function Connector({
  d,
  arrow = true,
  dashed = false,
  accent = false,
}: {
  d: string;
  arrow?: boolean;
  dashed?: boolean;
  accent?: boolean;
}) {
  return (
    <path
      d={d}
      fill="none"
      strokeWidth={1.4}
      strokeDasharray={dashed ? "6 5" : undefined}
      className={accent ? "stroke-accent" : "stroke-muted/45"}
      markerEnd={arrow ? `url(#${accent ? "dep-tip-accent" : "dep-tip"})` : undefined}
    />
  );
}

function LegendRule({ dashed = false }: { dashed?: boolean }) {
  return (
    <svg width="22" height="6" aria-hidden="true" className="shrink-0">
      <path
        d="M0 3 H22"
        strokeWidth={1.4}
        strokeDasharray={dashed ? "5 4" : undefined}
        className={dashed ? "stroke-muted/70" : "stroke-accent"}
      />
    </svg>
  );
}

export function DeployDiagram({ diagram, title }: { diagram: Diagram; title: string }) {
  const {
    caption,
    bands,
    integration,
    gate,
    steps,
    proxy,
    blue,
    green,
    verdict,
    decisions,
    legend,
    scrollHint,
  } = diagram;

  return (
    <figure className="mt-6 flex flex-col gap-3 first:mt-0">
      {/* Região rolável precisa ser alcançável por teclado (axe
          scrollable-region-focusable em viewports estreitos). */}
      <div
        className="overflow-x-auto rounded-lg border border-border bg-surface-deep p-4"
        tabIndex={0}
        role="region"
        aria-label={title}
      >
        <svg
          viewBox="0 0 900 588"
          className="h-auto w-full min-w-190 font-mono"
          role="img"
          aria-labelledby="dep-title"
          aria-describedby="dep-desc"
        >
          <title id="dep-title">{title}</title>
          <desc id="dep-desc">{caption}</desc>

          <defs>
            <marker
              id="dep-tip"
              viewBox="0 0 10 10"
              refX={10}
              refY={5}
              markerWidth={7}
              markerHeight={7}
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10 z" className="fill-muted/70" />
            </marker>
            <marker
              id="dep-tip-accent"
              viewBox="0 0 10 10"
              refX={10}
              refY={5}
              markerWidth={7}
              markerHeight={7}
              orient="auto"
            >
              <path d="M0 0 L10 5 L0 10 z" className="fill-accent" />
            </marker>
          </defs>

          <g
            fontSize={9.5}
            letterSpacing={1.2}
            textAnchor="end"
            className="fill-muted uppercase"
            aria-hidden="true"
          >
            <text x={80} y={37}>
              {bands.integration}
            </text>
            <text x={80} y={146}>
              {bands.publication}
            </text>
            <text x={80} y={321}>
              {bands.cutover}
            </text>
            <text x={80} y={506}>
              {bands.decisions}
            </text>
          </g>

          {/* Integração: sem preenchimento e em cinza, para ler como o que
              veio antes e não como parte da esteira de release. */}
          {FLOW_SLOTS.map((slot, i) => {
            const label = integration[i];
            if (!label) return null;
            return (
              <g key={label}>
                <rect
                  x={slot.x}
                  y={16}
                  width={slot.w}
                  height={34}
                  rx={6}
                  fill="none"
                  strokeWidth={1}
                  className="stroke-border"
                />
                <text
                  x={slot.x + slot.w / 2}
                  y={38}
                  textAnchor="middle"
                  fontSize={11}
                  className="fill-muted"
                >
                  {label}
                </text>
              </g>
            );
          })}
          <Connector d="M233 33 H255" />
          <Connector d="M388 33 H410" />
          <Connector d="M543 33 H565" />
          <Connector d="M698 33 H720" />

          {/* A fronteira. A seta de merge para tag desce cruzando esta linha:
              main já está integrada, mas nada foi publicado ainda. */}
          <path
            d={`M${CONTENT_LEFT} 86 H${CONTENT_RIGHT}`}
            strokeWidth={1}
            className="stroke-muted/25"
          />
          <rect x={546} y={77} width={318} height={18} className="fill-surface-deep" />
          <text x={856} y={90} textAnchor="end" fontSize={10} className="fill-muted">
            {gate}
          </text>
          <Connector d="M788 50 V60 H184" arrow={false} />
          <Connector d="M184 60 V110" />

          {/* Publicação */}
          {STEP_SLOTS.map((slot, i) => {
            const step = steps[i];
            if (!step) return null;
            const cx = slot.x + slot.w / 2;
            return (
              <g key={step.title}>
                <rect
                  x={slot.x}
                  y={110}
                  width={slot.w}
                  height={64}
                  rx={8}
                  className="fill-surface stroke-border"
                  strokeWidth={1}
                />
                <text
                  x={cx}
                  y={138}
                  textAnchor="middle"
                  fontSize={12.5}
                  className="fill-foreground"
                >
                  {step.title}
                </text>
                <text x={cx} y={158} textAnchor="middle" fontSize={10} className="fill-muted">
                  {step.sub}
                </text>
              </g>
            );
          })}
          <Connector d="M269 142 H295" />
          <Connector d="M464 142 H490" />
          <Connector d="M659 142 H685" />

          {/* Da imagem pronta para o proxy que decide a cor */}
          <Connector d="M770 174 V194" arrow={false} />
          <Connector d="M478 194 H770" arrow={false} />
          <Connector d="M478 194 V214" />

          <rect
            x={318}
            y={214}
            width={320}
            height={48}
            rx={8}
            className="fill-surface stroke-border"
            strokeWidth={1}
          />
          <text x={AXIS} y={235} textAnchor="middle" fontSize={13} className="fill-foreground">
            {proxy.title}
          </text>
          <text x={AXIS} y={251} textAnchor="middle" fontSize={10.5} className="fill-muted">
            {proxy.sub}
          </text>

          {/* A troca: verde recebe o upstream, blue drena */}
          <Connector d="M448 262 V286 H270 V316" dashed />
          <Connector d="M508 262 V286 H686 V316" accent />

          <rect
            x={100}
            y={316}
            width={340}
            height={104}
            rx={8}
            strokeDasharray="6 5"
            className="fill-surface stroke-border"
            strokeWidth={1}
          />
          <text x={118} y={344} fontSize={13} className="fill-muted">
            {blue.title}
          </text>
          <g fontSize={10.5} className="fill-muted">
            {blue.lines.map((line, i) => (
              <text key={line} x={118} y={370 + i * 20}>
                {line}
              </text>
            ))}
          </g>
          <text x={422} y={412} textAnchor="end" fontSize={10} className="fill-muted/80">
            {blue.edge}
          </text>

          <rect
            x={516}
            y={316}
            width={340}
            height={104}
            rx={8}
            className="fill-surface stroke-accent/60"
            strokeWidth={1}
          />
          <text x={534} y={344} fontSize={13} className="fill-accent">
            {green.title}
          </text>
          <g fontSize={10.5} className="fill-muted">
            {green.lines.map((line, i) => (
              <text key={line} x={534} y={370 + i * 20}>
                {line}
              </text>
            ))}
          </g>
          <text x={838} y={412} textAnchor="end" fontSize={10} className="fill-accent/80">
            {green.edge}
          </text>

          {/* O que foi medido, e por que a esteira é assim */}
          <path
            d={`M${CONTENT_LEFT} 452 H${CONTENT_RIGHT}`}
            strokeWidth={1}
            className="stroke-border"
          />
          <text x={CONTENT_LEFT} y={476} fontSize={11} className="fill-accent">
            {verdict}
          </text>
          <g fontSize={10.5} className="fill-muted">
            {decisions.map((line, i) => (
              <text key={line} x={CONTENT_LEFT} y={500 + i * 20}>
                {line}
              </text>
            ))}
          </g>
        </svg>
      </div>
      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted">
        <span className="flex items-center gap-2">
          <LegendRule />
          {legend.live}
        </span>
        <span className="flex items-center gap-2">
          <LegendRule dashed />
          {legend.draining}
        </span>
        <span className="text-accent lg:hidden" aria-hidden="true">
          ↔ {scrollHint}
        </span>
        <span className="text-muted/80">{caption}</span>
      </figcaption>
    </figure>
  );
}
