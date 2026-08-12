import { z } from "zod";

export const githubRepoSchema = z.object({
  name: z.string().min(1),
  description: z.string().nullable(),
  url: z.string().url(),
  stars: z.number().int().nonnegative(),
  language: z.string().nullable(),
  pushedAt: z.string().min(1),
});

export const githubReleaseSchema = z.object({
  tag: z.string().min(1),
  publishedAt: z.string().min(1),
  url: z.string().url(),
});

export const githubShowcaseSchema = z.object({
  repos: z.array(githubRepoSchema),
  allRepos: z.array(githubRepoSchema),
  latestRelease: githubReleaseSchema.nullable(),
  source: z.enum(["live", "snapshot"]),
});

export type GithubRepo = z.infer<typeof githubRepoSchema>;
export type GithubRelease = z.infer<typeof githubReleaseSchema>;
export type GithubShowcase = z.infer<typeof githubShowcaseSchema>;
