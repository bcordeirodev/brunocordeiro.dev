import type { CaseChapter } from "@/domain";

type DashboardChapter = Extract<CaseChapter, { kind: "dashboard" }>;

export function DashboardPanel({ chapter }: { chapter: DashboardChapter }) {
  return (
    <div className="overflow-hidden rounded-lg border border-border bg-surface">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-2">
        <span className="font-mono text-xs text-muted">{chapter.asOf}</span>
        <span className="flex items-center gap-1.5 font-mono text-xs text-accent">
          <span aria-hidden="true" className="size-2 rounded-full bg-accent" />
          {chapter.okLabel}
        </span>
      </div>
      <div className="flex flex-col gap-4 p-4">
        <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {chapter.stats.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col gap-1 rounded-md border border-border/60 p-3"
            >
              <dt className="text-xs text-muted">{stat.label}</dt>
              <dd className="flex flex-col gap-1">
                <span className="font-mono text-2xl tabular-nums">{stat.value}</span>
                <span className="text-xs text-muted">{stat.sub}</span>
              </dd>
            </div>
          ))}
        </dl>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs text-muted">
                <th scope="col" className="py-2 pr-4 font-normal">
                  {chapter.columns.workflow}
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-normal">
                  {chapter.columns.runs}
                </th>
                <th scope="col" className="py-2 pr-4 text-right font-normal">
                  {chapter.columns.failures}
                </th>
                <th scope="col" className="py-2 text-right font-normal">
                  {chapter.columns.success}
                </th>
              </tr>
            </thead>
            <tbody>
              {chapter.rows.map((row) => (
                <tr key={row.label} className="border-t border-border/60">
                  <td className="py-2 pr-4 font-mono">{row.label}</td>
                  <td className="py-2 pr-4 text-right font-mono tabular-nums">{row.runs}</td>
                  <td className="py-2 pr-4 text-right font-mono tabular-nums">{row.failures}</td>
                  <td className="py-2 text-right font-mono tabular-nums">
                    {(((row.runs - row.failures) / row.runs) * 100).toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
