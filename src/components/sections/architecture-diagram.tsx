import type { ArchitectureDiagram as Diagram } from "@/domain";

/*
 * Desenho único num viewBox fixo de 880×602 — não é um grafo genérico.
 * O wrapper rola na horizontal abaixo de ~760px, o mesmo padrão dos outros
 * blocos mono do case (o texto encolheria a ponto de sumir se escalasse).
 *
 * Bandas (y):  clientes 16..64 · borda 106..226 · aplicação 254..386 ·
 *              dados 446..494 · trilho X-Request-Id 586
 * Colunas (x): gutter das bandas 0..80 · conteúdo 100..856 · eixo 478
 *
 * A moldura 92..864 × 170..552 é o servidor: Cloudflare fica fora dela,
 * nginx, apps e dados ficam dentro. O trilho do X-Request-Id fica fora
 * porque o ID nasce no navegador, antes da borda.
 *
 * Traço cheio = síncrono, tracejado = depois da resposta, verde = a rota
 * crítica /r/{slug} e o ID que costura os logs.
 *
 * Como as coordenadas são fixas, rótulo comprido vaza do card em vez de
 * reposicionar o layout: os limites por campo estão em
 * architecture-diagram.test.tsx (Geist Mono avança 0,6em por caractere).
 */

const AXIS = 478;
const CONTENT_LEFT = 100;
const CONTENT_RIGHT = 856;

const LINE = "stroke-muted/45";
const DASH = "6 5";

function Card({
  x,
  y,
  w,
  h,
  accent = false,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  accent?: boolean;
}) {
  return (
    <rect
      x={x}
      y={y}
      width={w}
      height={h}
      rx={8}
      className={accent ? "fill-surface stroke-accent/60" : "fill-surface stroke-border"}
      strokeWidth={1}
    />
  );
}

/** Nó de uma linha: título e legenda centrados no eixo da própria caixa. */
function Pill({
  x,
  y,
  w,
  title,
  sub,
}: {
  x: number;
  y: number;
  w: number;
  title: string;
  sub: string;
}) {
  const cx = x + w / 2;
  return (
    <>
      <Card x={x} y={y} w={w} h={48} />
      <text x={cx} y={y + 21} textAnchor="middle" fontSize={13} className="fill-foreground">
        {title}
      </text>
      <text x={cx} y={y + 37} textAnchor="middle" fontSize={10.5} className="fill-muted">
        {sub}
      </text>
    </>
  );
}

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
      strokeDasharray={dashed ? DASH : undefined}
      className={accent ? "stroke-accent" : LINE}
      markerEnd={arrow ? `url(#${accent ? "arch-tip-accent" : "arch-tip"})` : undefined}
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
        className="stroke-muted/70"
      />
    </svg>
  );
}

export function ArchitectureDiagram({ diagram, title }: { diagram: Diagram; title: string }) {
  const {
    caption,
    bands,
    clients,
    edge,
    web,
    api,
    host,
    link,
    hotPath,
    data,
    trace,
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
          viewBox="0 0 900 610"
          className="h-auto w-full min-w-190 font-mono"
          role="img"
          aria-labelledby="arch-title"
          aria-describedby="arch-desc"
        >
          <title id="arch-title">{title}</title>
          <desc id="arch-desc">{caption}</desc>

          <defs>
            <marker
              id="arch-tip"
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
              id="arch-tip-accent"
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

          {/* Rótulos das bandas, no gutter à esquerda do conteúdo */}
          <g
            fontSize={9.5}
            letterSpacing={1.2}
            textAnchor="end"
            className="fill-muted uppercase"
            aria-hidden="true"
          >
            <text x={80} y={44}>
              {bands.clients}
            </text>
            {/* Alinhado ao Cloudflare, não ao centro da banda: em 170
                passaria por cima da borda da moldura do servidor. */}
            <text x={80} y={134}>
              {bands.edge}
            </text>
            <text x={80} y={324}>
              {bands.app}
            </text>
            <text x={80} y={474}>
              {bands.data}
            </text>
          </g>

          {/* Clientes → Cloudflare → nginx */}
          <Pill x={250} y={16} w={200} title={clients.browser.title} sub={clients.browser.sub} />
          <Pill x={506} y={16} w={200} title={clients.bots.title} sub={clients.bots.sub} />
          <Connector d="M350 64 V86 H478" arrow={false} />
          <Connector d="M606 64 V86 H478" arrow={false} />
          <Connector d="M478 86 V106" />

          <Pill x={318} y={106} w={320} title={edge.cdn.title} sub={edge.cdn.sub} />
          <Connector d="M478 154 V178" />

          {/* Moldura do servidor. Vem antes dos nós para ficar por baixo
              deles; a seta do Cloudflare cruza a borda de propósito. */}
          <rect
            x={92}
            y={170}
            width={772}
            height={382}
            rx={10}
            fill="none"
            strokeWidth={1}
            className="stroke-muted/25"
          />
          {/* Tarja no fundo do contêiner para o rótulo interromper a
              linha da moldura em vez de ser riscado por ela. */}
          <rect x={688} y={161} width={176} height={18} className="fill-surface-deep" />
          <text x={856} y={174} textAnchor="end" fontSize={10} className="fill-muted">
            {host}
          </text>

          <Pill x={318} y={178} w={320} title={edge.proxy.title} sub={edge.proxy.sub} />

          {/* nginx abre para as duas aplicações */}
          <Connector d="M478 226 V240" arrow={false} />
          <Connector d="M245 240 H711" arrow={false} />
          <Connector d="M245 240 V254" />
          <Connector d="M711 240 V254" />

          {/* Next.js */}
          <Card x={100} y={254} w={290} h={132} />
          <text x={116} y={280} fontSize={13} className="fill-foreground">
            {web.title}
          </text>
          <g fontSize={10.5} className="fill-muted">
            {web.lines.map((line, i) => (
              <text key={line} x={116} y={304 + i * 20}>
                {line}
              </text>
            ))}
          </g>

          {/* Laravel, com a rota crítica destacada na faixa inferior do card */}
          <Card x={566} y={254} w={290} h={132} accent />
          <text x={582} y={280} fontSize={13} className="fill-foreground">
            {api.title}
          </text>
          <g fontSize={10.5} className="fill-muted">
            {api.lines.map((line, i) => (
              <text key={line} x={582} y={304 + i * 20}>
                {line}
              </text>
            ))}
          </g>
          <path d="M566 338 H856" strokeWidth={1} className="stroke-accent/60" />
          <text x={582} y={360} fontSize={12} className="fill-accent">
            {hotPath.route}
          </text>
          <text x={582} y={376} fontSize={10} className="fill-muted">
            {hotPath.sub}
          </text>

          {/* Proxy de rewrites entre as duas aplicações */}
          <Connector d="M390 304 H566" />
          <g fontSize={10.5} textAnchor="middle" className="fill-muted">
            <text x={AXIS} y={296}>
              {link.top}
            </text>
            <text x={AXIS} y={322}>
              {link.bottom}
            </text>
          </g>

          {/* As duas respostas de /r/{slug}, saindo da faixa da rota crítica */}
          <Connector d="M566 352 H505" accent />
          <Connector d="M566 374 H505" accent />
          <g fontSize={10} textAnchor="end" className="fill-accent">
            <text x={497} y={356}>
              {hotPath.human}
            </text>
            <text x={497} y={378}>
              {hotPath.bot}
            </text>
          </g>

          {/* Laravel → banco e fila */}
          <Connector d="M711 386 V416" arrow={false} />
          <Connector d="M218 416 H711" arrow={false} />
          <Connector d="M218 416 V446" />
          <Connector d="M478 416 V446" />

          <Pill x={100} y={446} w={236} title={data.db.title} sub={data.db.sub} />
          <Pill x={360} y={446} w={236} title={data.cache.title} sub={data.cache.sub} />
          <Pill x={620} y={446} w={236} title={data.worker.title} sub={data.worker.sub} />

          {/* Cauda assíncrona: fila → worker → grava o clique */}
          <Connector d="M596 470 H620" dashed />
          <Connector d="M738 494 V538 H218 V494" dashed />
          <text x={AXIS} y={532} fontSize={10} textAnchor="middle" className="fill-muted">
            {data.writeback}
          </text>

          {/* Assinatura: o ID que costura navegador e worker no mesmo log */}
          <text x={CONTENT_LEFT} y={574} fontSize={11} className="fill-accent">
            {trace}
          </text>
          <Connector d={`M${CONTENT_LEFT} 586 H${CONTENT_RIGHT}`} accent />
        </svg>
      </div>
      <figcaption className="flex flex-wrap items-center gap-x-5 gap-y-2 font-mono text-xs text-muted">
        <span className="flex items-center gap-2">
          <LegendRule />
          {legend.sync}
        </span>
        <span className="flex items-center gap-2">
          <LegendRule dashed />
          {legend.async}
        </span>
        {/* O desenho tem largura mínima: em telas estreitas só o canto
            superior esquerdo aparece até o leitor arrastar. */}
        <span className="text-accent lg:hidden" aria-hidden="true">
          ↔ {scrollHint}
        </span>
        <span className="text-muted/80">{caption}</span>
      </figcaption>
    </figure>
  );
}
