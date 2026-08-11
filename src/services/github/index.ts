import { cacheLife, cacheTag } from "next/cache";
import type { GithubShowcase } from "@/domain";
import { githubSnapshot } from "@/content/github-snapshot";
import { fetchShowcase } from "./core";

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
