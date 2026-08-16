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

// Números de engenharia dos repositórios do Link Charts, lidos da API do
// GitHub. `source` marca se vieram da API ou do snapshot versionado — o
// card exibe a origem para nunca mentir sobre os dados.
export const githubRepoStatsSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  commits: z.number().int().positive(),
  tags: z.number().int().nonnegative(),
  latestTag: z.string().nullable(),
  pushedAt: z.iso.datetime(),
  languages: z
    .array(z.object({ name: z.string().min(1), bytes: z.number().int().positive() }))
    .min(1),
});

export const linkchartsStatsSchema = z.object({
  frontend: githubRepoStatsSchema,
  backend: githubRepoStatsSchema,
  source: z.enum(["live", "snapshot"]),
});

export type GithubRepo = z.infer<typeof githubRepoSchema>;
export type GithubRelease = z.infer<typeof githubReleaseSchema>;
export type GithubShowcase = z.infer<typeof githubShowcaseSchema>;
export type GithubRepoStats = z.infer<typeof githubRepoStatsSchema>;
export type LinkchartsStats = z.infer<typeof linkchartsStatsSchema>;
