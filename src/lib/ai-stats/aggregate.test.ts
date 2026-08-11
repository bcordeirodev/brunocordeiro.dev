import { describe, expect, it } from "vitest";
import { aggregate } from "./aggregate";

const line = (obj: unknown) => JSON.stringify(obj);
const session1 = [
  line({
    type: "assistant",
    timestamp: "2026-07-10T12:00:00Z",
    message: {
      usage: { input_tokens: 100, output_tokens: 50 },
      content: [{ type: "tool_use", name: "Edit", input: {} }],
    },
  }),
  line({
    type: "assistant",
    timestamp: "2026-07-11T09:00:00Z",
    message: {
      usage: { input_tokens: 10, output_tokens: 5 },
      content: [{ type: "tool_use", name: "Bash", input: { command: "pnpm vitest run" } }],
    },
  }),
  "linha corrompida{{{",
];
const session2 = [
  line({
    type: "assistant",
    timestamp: "2026-08-01T10:00:00Z",
    message: {
      usage: { input_tokens: 7, output_tokens: 3 },
      content: [
        { type: "tool_use", name: "Grep", input: {} },
        { type: "tool_use", name: "Bash", input: { command: "ls" } },
      ],
    },
  }),
];

describe("aggregate", () => {
  const stats = aggregate([session1, session2], "2026-08-11");
  it("agrega tokens e sessões por mês, ignorando linhas corrompidas", () => {
    expect(stats.months).toEqual([
      { month: "2026-07", inputTokens: 110, outputTokens: 55, sessions: 1 },
      { month: "2026-08", inputTokens: 7, outputTokens: 3, sessions: 1 },
    ]);
    expect(stats.since).toBe("2026-07");
  });
  it("conta dias ativos, streak e classifica ações", () => {
    expect(stats.totals.sessions).toBe(2);
    expect(stats.totals.activeDays).toBe(3);
    expect(stats.totals.longestStreakDays).toBe(2);
    expect(stats.totals.toolActions).toEqual({ edits: 1, testRuns: 1, searches: 1, commands: 1 });
  });
});
