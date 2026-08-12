import type { CaseChapter, GrafanaStats } from "@/domain";
import type { Locale } from "@/content";
import { linkchartsActivity } from "@/content/linkcharts-activity";
import { GrafanaBars } from "./grafana-bars";

type GrafanaChapter = Extract<CaseChapter, { kind: "grafana" }>;

// Paleta dark do Grafana, aplicada localmente: o board deve parecer um
// dashboard Grafana de verdade, não um card do site.
const G = {
  board: "#111217",
  panel: "#181b1f",
  border: "#2c3235",
  text: "#ccccdc",
  dim: "#8e8e9a",
  green: "#73bf69",
  yellow: "#f2cc0c",
  red: "#f2495c",
} as const;

const uptimeColor = (v: number) => (v >= 99 ? G.green : v >= 95 ? G.yellow : G.red);
const p95Color = (v: number) => (v <= 300 ? G.green : v <= 800 ? G.yellow : G.red);
const errorColor = (v: number) => (v < 1 ? G.green : v < 5 ? G.yellow : G.red);

function fmt(locale: Locale, value: number, digits: number): string {
  return new Intl.NumberFormat(locale === "pt" ? "pt-BR" : "en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}

function PanelBadge({ label }: { label: string }) {
  return (
    <span
      className="rounded border px-1 py-px font-mono text-[10px] leading-none"
      style={{ color: G.dim, borderColor: G.border }}
    >
      {label}
    </span>
  );
}

function Panel({
  title,
  sub,
  badge,
  className,
  children,
}: {
  title: string;
  sub: string;
  badge?: React.ReactNode;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex flex-col rounded-sm border ${className ?? ""}`}
      style={{ backgroundColor: G.panel, borderColor: G.border }}
    >
      <div
        className="flex items-center justify-between gap-2 border-b px-3 py-1.5"
        style={{ borderColor: G.border }}
      >
        <span className="truncate text-xs font-medium" style={{ color: G.text }}>
          {title}
        </span>
        {badge}
      </div>
      <div className="flex flex-1 flex-col justify-between gap-2 p-3">
        {children}
        <span className="text-[11px] leading-snug" style={{ color: G.dim }}>
          {sub}
        </span>
      </div>
    </div>
  );
}

function StatValue({ text, color }: { text: string; color: string }) {
  return (
    <span className="font-mono text-2xl leading-none tracking-tight" style={{ color }}>
      {text}
    </span>
  );
}

function UptimeGauge({
  pct,
  label,
  color,
  text,
}: {
  pct: number;
  label: string;
  color: string;
  text: string;
}) {
  const r = 54;
  const arc = Math.PI * r;
  const filled = (Math.min(Math.max(pct, 0), 100) / 100) * arc;
  return (
    <svg viewBox="0 0 140 84" role="img" aria-label={label} className="w-full max-w-45 self-center">
      <path
        d="M 16 74 A 54 54 0 0 1 124 74"
        fill="none"
        stroke={G.border}
        strokeWidth="10"
        strokeLinecap="round"
      />
      <path
        d="M 16 74 A 54 54 0 0 1 124 74"
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinecap="round"
        strokeDasharray={`${filled} ${arc}`}
      />
      <text
        x="70"
        y="68"
        textAnchor="middle"
        fontSize="19"
        fontFamily="var(--font-geist-mono, monospace)"
        fill={color}
      >
        {text}
      </text>
    </svg>
  );
}

export function GrafanaBoard({
  chapter,
  stats,
  locale,
}: {
  chapter: GrafanaChapter;
  stats: GrafanaStats;
  locale: Locale;
}) {
  const { board, panels } = chapter;
  const badge = (key: keyof GrafanaStats["live"]) =>
    stats.live[key] ? undefined : <PanelBadge label={board.snapshotLabel} />;
  const updatedAt = new Intl.DateTimeFormat(locale === "pt" ? "pt-BR" : "en-US", {
    dateStyle: "short",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(new Date(stats.fetchedAt));

  return (
    <div
      className="overflow-hidden rounded-lg border"
      style={{ backgroundColor: G.board, borderColor: G.border }}
    >
      <div
        className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-b px-4 py-2"
        style={{ borderColor: G.border }}
      >
        <span className="font-mono text-xs font-medium" style={{ color: G.text }}>
          {board.title}
        </span>
        <span
          className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px]"
          style={{ color: G.dim }}
        >
          <span
            className="rounded border px-1.5 py-0.5 font-mono"
            style={{ borderColor: G.border }}
          >
            {board.timeRange}
          </span>
          <span>
            {board.updatedLabel} {updatedAt} UTC
          </span>
          <span style={{ color: G.text }}>{board.attribution}</span>
        </span>
      </div>

      <div className="grid gap-2 p-2 sm:grid-cols-2 lg:grid-cols-4">
        <Panel
          title={panels.uptime.title}
          sub={panels.uptime.sub}
          badge={<PanelBadge label={panels.uptime.source} />}
        >
          <UptimeGauge
            pct={stats.uptime30dPct}
            label={`${panels.uptime.title}: ${fmt(locale, stats.uptime30dPct, 1)}%`}
            color={uptimeColor(stats.uptime30dPct)}
            text={`${fmt(locale, stats.uptime30dPct, 1)}%`}
          />
        </Panel>
        <Panel title={panels.p95.title} sub={panels.p95.sub} badge={badge("p95RedirectMs")}>
          <StatValue
            text={`${fmt(locale, Math.round(stats.p95RedirectMs), 0)} ms`}
            color={p95Color(stats.p95RedirectMs)}
          />
        </Panel>
        <Panel title={panels.errors.title} sub={panels.errors.sub} badge={badge("errorRate5xxPct")}>
          <StatValue
            text={`${fmt(locale, stats.errorRate5xxPct, 1)}%`}
            color={errorColor(stats.errorRate5xxPct)}
          />
        </Panel>
        <Panel title={panels.reqRate.title} sub={panels.reqRate.sub} badge={badge("reqPerMin")}>
          <StatValue text={fmt(locale, stats.reqPerMin, 1)} color={G.green} />
        </Panel>
        <Panel
          title={panels.activity.title}
          sub={panels.activity.sub}
          className="sm:col-span-2 lg:col-span-4"
        >
          <GrafanaBars
            categories={linkchartsActivity.months}
            values={linkchartsActivity.values}
            label={panels.activity.title}
          />
        </Panel>
      </div>

      <div
        className="border-t px-4 py-2 text-[11px]"
        style={{ borderColor: G.border, color: G.dim }}
      >
        {board.footer}
      </div>
    </div>
  );
}
