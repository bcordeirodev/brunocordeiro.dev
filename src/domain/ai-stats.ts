import { z } from "zod";

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);

export const aiStatsSchema = z.object({
  since: yearMonth,
  asOf: z.string().min(1),
  months: z
    .array(
      z.object({
        month: yearMonth,
        inputTokens: z.number().int().nonnegative(),
        outputTokens: z.number().int().nonnegative(),
        sessions: z.number().int().nonnegative(),
      }),
    )
    .min(1),
  totals: z.object({
    sessions: z.number().int().nonnegative(),
    activeDays: z.number().int().nonnegative(),
    longestStreakDays: z.number().int().nonnegative(),
    toolActions: z.object({
      edits: z.number().int().nonnegative(),
      testRuns: z.number().int().nonnegative(),
      searches: z.number().int().nonnegative(),
      commands: z.number().int().nonnegative(),
    }),
  }),
});

export type AiStats = z.infer<typeof aiStatsSchema>;
