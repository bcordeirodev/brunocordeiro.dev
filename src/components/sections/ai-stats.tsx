import { getLocale } from "next-intl/server";
import type { AiStats as AiStatsData } from "@/domain";
import { NumberTicker } from "@/components/motion/number-ticker";

type AiStatsLabels = {
  title: string;
  sessions: string;
  activeDays: string;
  streak: string;
  outputTokens: string;
  edits: string;
  testRuns: string;
  searches: string;
  commands: string;
  disclaimer: string;
};

export async function AiStats({ stats, labels }: { stats: AiStatsData; labels: AiStatsLabels }) {
  // Own locale lookup (matches RepoGrid/Certifications) instead of a new
  // prop, so the existing call site in page.tsx needs no change: an 8-digit
  // monthly token count like 10854022 renders as "10.9M"/"10,9 mi" instead
  // of overflowing the stat tile at narrow widths.
  const locale = await getLocale();
  const intlLocale = locale === "pt" ? "pt-BR" : "en-US";
  const lastMonth = stats.months[stats.months.length - 1];

  const metrics = [
    { label: labels.sessions, value: stats.totals.sessions },
    { label: labels.activeDays, value: stats.totals.activeDays },
    { label: labels.streak, value: stats.totals.longestStreakDays },
    { label: labels.outputTokens, value: lastMonth?.outputTokens ?? 0 },
  ];

  const bars = [
    { key: "edits", label: labels.edits, value: stats.totals.toolActions.edits },
    { key: "testRuns", label: labels.testRuns, value: stats.totals.toolActions.testRuns },
    { key: "searches", label: labels.searches, value: stats.totals.toolActions.searches },
    { key: "commands", label: labels.commands, value: stats.totals.toolActions.commands },
  ];
  const maxBarValue = Math.max(...bars.map((bar) => bar.value), 1);

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-mono text-sm font-bold tracking-[0.2em] text-muted uppercase">
        {labels.title}
      </h2>

      <dl className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="flex flex-col gap-1 rounded-md border border-border/60 p-3"
          >
            <dt className="text-xs text-muted">{metric.label}</dt>
            <dd className="font-mono text-2xl tabular-nums">
              <NumberTicker value={metric.value} locale={intlLocale} />
            </dd>
          </div>
        ))}
      </dl>

      <div className="flex flex-col gap-2">
        {bars.map((bar) => (
          <div key={bar.key} className="flex items-center gap-3">
            <span className="w-24 shrink-0 font-mono text-xs text-muted">{bar.label}</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-border/40">
              <div
                className="h-full rounded-full bg-accent/40"
                style={{ width: `${Math.round((bar.value / maxBarValue) * 100)}%` }}
              />
            </div>
            <span className="w-12 shrink-0 text-right font-mono text-xs tabular-nums text-muted">
              {bar.value}
            </span>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted">{labels.disclaimer}</p>
    </div>
  );
}
