import { readFileSync, readdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { homedir } from "node:os";
import { aggregate } from "../src/lib/ai-stats/aggregate";
import { aiStatsSchema } from "../src/domain";

const root = join(homedir(), ".claude", "projects");
const sessionFiles: string[][] = [];
for (const dir of readdirSync(root, { withFileTypes: true })) {
  if (!dir.isDirectory()) continue;
  for (const file of readdirSync(join(root, dir.name))) {
    if (!file.endsWith(".jsonl")) continue;
    sessionFiles.push(readFileSync(join(root, dir.name, file), "utf8").split("\n"));
  }
}
const asOf = new Date().toISOString().slice(0, 10);
const stats = aiStatsSchema.parse(aggregate(sessionFiles, asOf));
const banner =
  "// gerado por scripts/ai-stats.ts — agregados numéricos apenas; rode `pnpm ai-stats` e commite para atualizar";
writeFileSync(
  "src/content/ai-stats.ts",
  `${banner}\nimport type { AiStats } from "@/domain";\n\nexport const aiStats: AiStats = ${JSON.stringify(stats, null, 2)};\n`,
);
console.log(`ok — ${stats.totals.sessions} sessões desde ${stats.since}`);
