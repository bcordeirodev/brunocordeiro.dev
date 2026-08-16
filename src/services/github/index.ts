import { cacheLife, cacheTag } from "next/cache";
import type { GithubShowcase, LinkchartsStats } from "@/domain";
import { githubSnapshot } from "@/content/github-snapshot";
import { linkchartsStatsSnapshot } from "@/content/linkcharts-stats-snapshot";
import { fetchLinkchartsStats, fetchShowcase } from "./core";

export async function getGithubShowcase(): Promise<GithubShowcase> {
  "use cache";
  cacheLife("days");
  cacheTag("github");
  try {
    return await fetchShowcase(fetch, process.env.GITHUB_TOKEN);
  } catch {
    return githubSnapshot;
  }
}

export async function getLinkchartsStats(): Promise<LinkchartsStats> {
  "use cache";
  cacheLife("days");
  cacheTag("github");
  try {
    return await fetchLinkchartsStats(fetch, process.env.GITHUB_TOKEN);
  } catch {
    return linkchartsStatsSnapshot;
  }
}
