import type { AiStats } from "@/domain";

const EDIT_TOOLS = new Set(["Edit", "Write", "NotebookEdit"]);
const SEARCH_TOOLS = new Set(["Grep", "Glob", "Read", "WebSearch", "WebFetch"]);
const TEST_COMMAND = /\b(vitest|jest|playwright|phpunit|pytest|go test|pnpm test|npm test)\b/;

type ToolUse = { type?: string; name?: string; input?: { command?: string } };
type Entry = {
  type?: string;
  timestamp?: string;
  message?: { usage?: { input_tokens?: number; output_tokens?: number }; content?: ToolUse[] };
};

export function aggregate(sessionFiles: string[][], asOf: string): AiStats {
  const byMonth = new Map<
    string,
    { inputTokens: number; outputTokens: number; sessions: Set<number> }
  >();
  const days = new Set<string>();
  const actions = { edits: 0, testRuns: 0, searches: 0, commands: 0 };
  let sessions = 0;

  sessionFiles.forEach((lines, sessionIndex) => {
    let counted = false;
    for (const lineText of lines) {
      let entry: Entry;
      try {
        entry = JSON.parse(lineText) as Entry;
      } catch {
        continue;
      }
      if (entry.type !== "assistant" || !entry.timestamp) continue;
      counted = true;
      const day = entry.timestamp.slice(0, 10);
      const month = entry.timestamp.slice(0, 7);
      days.add(day);
      const bucket = byMonth.get(month) ?? {
        inputTokens: 0,
        outputTokens: 0,
        sessions: new Set<number>(),
      };
      bucket.inputTokens += entry.message?.usage?.input_tokens ?? 0;
      bucket.outputTokens += entry.message?.usage?.output_tokens ?? 0;
      bucket.sessions.add(sessionIndex);
      byMonth.set(month, bucket);
      for (const block of entry.message?.content ?? []) {
        if (block.type !== "tool_use" || !block.name) continue;
        if (EDIT_TOOLS.has(block.name)) actions.edits += 1;
        else if (SEARCH_TOOLS.has(block.name)) actions.searches += 1;
        else if (block.name === "Bash") {
          if (TEST_COMMAND.test(block.input?.command ?? "")) actions.testRuns += 1;
          else actions.commands += 1;
        }
      }
    }
    if (counted) sessions += 1;
  });

  const sortedDays = [...days].sort();
  let longest = 0;
  let run = 0;
  let prev: string | null = null;
  for (const day of sortedDays) {
    const prevDate = prev ? new Date(`${prev}T00:00:00Z`).getTime() : null;
    const currDate = new Date(`${day}T00:00:00Z`).getTime();
    run = prevDate !== null && currDate - prevDate === 86_400_000 ? run + 1 : 1;
    longest = Math.max(longest, run);
    prev = day;
  }

  const months = [...byMonth.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, b]) => ({
      month,
      inputTokens: b.inputTokens,
      outputTokens: b.outputTokens,
      sessions: b.sessions.size,
    }));

  return {
    since: months[0]?.month ?? asOf.slice(0, 7),
    asOf,
    months,
    totals: { sessions, activeDays: days.size, longestStreakDays: longest, toolActions: actions },
  };
}
