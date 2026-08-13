import type { DeployDiagram as Diagram } from "@/domain";

/*
 * Par do architecture-diagram: mesmo viewBox de 880 de largura, mesmo
 * gutter de bandas e mesma paleta. Aqui o assunto é a topologia do
 * release — o terminal logo abaixo narra a sequência, este desenho mostra
 * o que "trocar de cor atrás do nginx" quer dizer.
 *
 * Bandas (y):  esteira 16..80 · cutover 120..320 · verificação 344..388
 * Colunas (x): gutter 0..84 · conteúdo 100..856 · eixo 478
 *
 * Verde = a cor que está no ar; tracejado cinza = a que está drenando.
 * Limites de caractere por campo vivem em deploy-diagram.test.tsx.
 */

const AXIS = 478;
const CONTENT_LEFT = 100;
const CONTENT_RIGHT = 856;

/** Quatro degraus da esteira, com 26px de seta entre um e outro. */
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
  const { caption, bands, steps, proxy, blue, green, verdict, rollback, legend, scrollHint } =
    diagram;

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
          viewBox="0 0 880 402"
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
            <text x={84} y={52}>
              {bands.pipeline}
            </text>
            <text x={84} y={220}>
              {bands.cutover}
            </text>
            <text x={84} y={372}>
              {bands.check}
            </text>
          </g>

          {/* Esteira: tag → build → registry → artefatos */}
          {STEP_SLOTS.map((slot, i) => {
            const step = steps[i];
            if (!step) return null;
            const cx = slot.x + slot.w / 2;
            return (
              <g key={step.title}>
                <rect
                  x={slot.x}
                  y={16}
                  width={slot.w}
                  height={64}
                  rx={8}
                  className="fill-surface stroke-border"
                  strokeWidth={1}
                />
                <text x={cx} y={44} textAnchor="middle" fontSize={12.5} className="fill-foreground">
                  {step.title}
                </text>
                <text x={cx} y={62} textAnchor="middle" fontSize={10} className="fill-muted">
                  {step.sub}
                </text>
              </g>
            );
          })}
          <Connector d="M269 48 H295" />
          <Connector d="M464 48 H490" />
          <Connector d="M659 48 H685" />

          {/* Da imagem pronta para o proxy que decide a cor */}
          <Connector d="M770 80 V100 H478 V120" />

          <rect
            x={328}
            y={120}
            width={320}
            height={48}
            rx={8}
            className="fill-surface stroke-border"
            strokeWidth={1}
          />
          <text x={AXIS} y={141} textAnchor="middle" fontSize={13} className="fill-foreground">
            {proxy.title}
          </text>
          <text x={AXIS} y={157} textAnchor="middle" fontSize={10.5} className="fill-muted">
            {proxy.sub}
          </text>

          {/* A troca: verde recebe o upstream, blue drena */}
          <Connector d="M448 168 V192 H270 V216" dashed />
          <Connector d="M508 168 V192 H686 V216" accent />

          <rect
            x={100}
            y={216}
            width={340}
            height={104}
            rx={8}
            strokeDasharray="6 5"
            className="fill-surface stroke-border"
            strokeWidth={1}
          />
          <text x={118} y={244} fontSize={13} className="fill-muted">
            {blue.title}
          </text>
          <g fontSize={10.5} className="fill-muted">
            {blue.lines.map((line, i) => (
              <text key={line} x={118} y={270 + i * 20}>
                {line}
              </text>
            ))}
          </g>
          <text x={422} y={312} textAnchor="end" fontSize={10} className="fill-muted/80">
            {blue.edge}
          </text>

          <rect
            x={516}
            y={216}
            width={340}
            height={104}
            rx={8}
            className="fill-surface stroke-accent/60"
            strokeWidth={1}
          />
          <text x={534} y={244} fontSize={13} className="fill-accent">
            {green.title}
          </text>
          <g fontSize={10.5} className="fill-muted">
            {green.lines.map((line, i) => (
              <text key={line} x={534} y={270 + i * 20}>
                {line}
              </text>
            ))}
          </g>
          <text x={838} y={312} textAnchor="end" fontSize={10} className="fill-accent/80">
            {green.edge}
          </text>

          {/* Veredito medido do lado de fora */}
          <path
            d={`M${CONTENT_LEFT} 344 H${CONTENT_RIGHT}`}
            strokeWidth={1}
            className="stroke-border"
          />
          <text x={CONTENT_LEFT} y={366} fontSize={11} className="fill-accent">
            {verdict}
          </text>
          <text x={CONTENT_LEFT} y={388} fontSize={10.5} className="fill-muted">
            {rollback}
          </text>
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
