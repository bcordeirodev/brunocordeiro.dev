// gerado por scripts/ai-stats.ts — agregados numéricos apenas; rode `pnpm ai-stats` e commite para atualizar
import type { AiStats } from "@/domain";

export const aiStats: AiStats = {
  since: "2026-07",
  asOf: "2026-08-11",
  months: [
    {
      month: "2026-07",
      inputTokens: 418351,
      outputTokens: 13655680,
      sessions: 27,
    },
    {
      month: "2026-08",
      inputTokens: 62363,
      outputTokens: 10854022,
      sessions: 23,
    },
  ],
  totals: {
    sessions: 49,
    activeDays: 29,
    longestStreakDays: 14,
    toolActions: {
      edits: 1646,
      testRuns: 243,
      searches: 890,
      commands: 4160,
    },
  },
};
