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

function GrafanaLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={className} fill="#f46800">
      <path d="M23.02 10.59a8.578 8.578 0 0 0-.862-3.034 8.911 8.911 0 0 0-1.789-2.445c.337-1.342-.413-2.505-.413-2.505-1.292-.08-2.113.4-2.416.62-.052-.02-.102-.044-.154-.064-.22-.089-.446-.172-.677-.247-.231-.073-.47-.14-.711-.197a9.867 9.867 0 0 0-.875-.161C14.557.753 12.94 0 12.94 0c-1.804 1.145-2.147 2.744-2.147 2.744l-.018.093c-.098.029-.2.057-.298.088-.138.042-.275.094-.413.143-.138.055-.275.107-.41.166a8.869 8.869 0 0 0-1.557.87l-.063-.029c-2.497-.955-4.716.195-4.716.195-.203 2.658.996 4.33 1.235 4.636a11.608 11.608 0 0 0-.607 2.635C1.636 12.677.953 15.014.953 15.014c1.926 2.214 4.171 2.351 4.171 2.351.003-.002.006-.002.006-.005.285.509.615.994.986 1.446.156.19.32.371.488.548-.704 2.009.099 3.68.099 3.68 2.144.08 3.553-.937 3.849-1.173a9.784 9.784 0 0 0 3.164.501h.08l.055-.003.107-.002.103-.005.003.002c1.01 1.44 2.788 1.646 2.788 1.646 1.264-1.332 1.337-2.653 1.337-2.94v-.058c0-.02-.003-.039-.003-.06.265-.187.52-.387.758-.6a7.875 7.875 0 0 0 1.415-1.7c1.43.083 2.437-.885 2.437-.885-.236-1.49-1.085-2.216-1.264-2.354l-.018-.013-.016-.013a.217.217 0 0 1-.031-.02c.008-.092.016-.18.02-.27.011-.162.016-.323.016-.48v-.253l-.005-.098-.008-.135a1.891 1.891 0 0 0-.01-.13c-.003-.042-.008-.083-.013-.125l-.016-.124-.018-.122a6.215 6.215 0 0 0-2.032-3.73 6.015 6.015 0 0 0-3.222-1.46 6.292 6.292 0 0 0-.85-.048l-.107.002h-.063l-.044.003-.104.008a4.777 4.777 0 0 0-3.335 1.695c-.332.4-.592.84-.768 1.297a4.594 4.594 0 0 0-.312 1.817l.003.091c.005.055.007.11.013.164a3.615 3.615 0 0 0 .698 1.82 3.53 3.53 0 0 0 1.827 1.282c.33.098.66.14.971.137.039 0 .078 0 .114-.002l.063-.003c.02 0 .041-.003.062-.003.034-.002.065-.007.099-.01.007 0 .018-.003.028-.003l.031-.005.06-.008a1.18 1.18 0 0 0 .112-.02c.036-.008.072-.013.109-.024a2.634 2.634 0 0 0 .914-.415c.028-.02.056-.041.085-.065a.248.248 0 0 0 .039-.35.244.244 0 0 0-.309-.06l-.078.042c-.09.044-.184.083-.283.116a2.476 2.476 0 0 1-.475.096c-.028.003-.054.006-.083.006l-.083.002c-.026 0-.054 0-.08-.002l-.102-.006h-.012l-.024.006c-.016-.003-.031-.003-.044-.006-.031-.002-.06-.007-.091-.01a2.59 2.59 0 0 1-.724-.213 2.557 2.557 0 0 1-.667-.438 2.52 2.52 0 0 1-.805-1.475 2.306 2.306 0 0 1-.029-.444l.006-.122v-.023l.002-.031c.003-.021.003-.04.005-.06a3.163 3.163 0 0 1 1.352-2.29 3.12 3.12 0 0 1 .937-.43 2.946 2.946 0 0 1 .776-.101h.06l.07.002.045.003h.026l.07.005a4.041 4.041 0 0 1 1.635.49 3.94 3.94 0 0 1 1.602 1.662 3.77 3.77 0 0 1 .397 1.414l.005.076.003.075c.002.026.002.05.002.075 0 .024.003.052 0 .07v.065l-.002.073-.008.174a6.195 6.195 0 0 1-.08.639 5.1 5.1 0 0 1-.267.927 5.31 5.31 0 0 1-.624 1.13 5.052 5.052 0 0 1-3.237 2.014 4.82 4.82 0 0 1-.649.066l-.039.003h-.287a6.607 6.607 0 0 1-1.716-.265 6.776 6.776 0 0 1-3.4-2.274 6.75 6.75 0 0 1-.746-1.15 6.616 6.616 0 0 1-.714-2.596l-.005-.083-.002-.02v-.056l-.003-.073v-.096l-.003-.104v-.07l.003-.163c.008-.22.026-.45.054-.678a8.707 8.707 0 0 1 .28-1.355c.128-.444.286-.872.473-1.277a7.04 7.04 0 0 1 1.456-2.1 5.925 5.925 0 0 1 .953-.763c.169-.111.343-.213.524-.306.089-.05.182-.091.273-.135.047-.02.093-.042.138-.062a7.177 7.177 0 0 1 .714-.267l.145-.045c.049-.015.098-.026.148-.041.098-.029.197-.052.296-.076.049-.013.1-.02.15-.033l.15-.032.151-.028.076-.013.075-.01.153-.024c.057-.01.114-.013.171-.023l.169-.021c.036-.003.073-.008.106-.01l.073-.008.036-.003.042-.002c.057-.003.114-.008.171-.01l.086-.006h.023l.037-.003.145-.007a7.999 7.999 0 0 1 1.708.125 7.917 7.917 0 0 1 2.048.68 8.253 8.253 0 0 1 1.672 1.09l.09.077.089.078c.06.052.114.107.171.159.057.052.112.106.166.16.052.055.107.107.159.164a8.671 8.671 0 0 1 1.41 1.978c.012.026.028.052.04.078l.04.078.075.156c.023.051.05.1.07.153l.065.15a8.848 8.848 0 0 1 .45 1.34.19.19 0 0 0 .201.142.186.186 0 0 0 .172-.184c.01-.246.002-.532-.024-.856z" />
    </svg>
  );
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
        <span
          className="flex items-center gap-2 font-mono text-xs font-medium"
          style={{ color: G.text }}
        >
          <GrafanaLogo className="size-4 shrink-0" />
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
