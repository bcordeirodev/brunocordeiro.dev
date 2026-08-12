import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

// Manual cache-refresh endpoint for externally-sourced data (GitHub showcase, Grafana stats).
// In production it requires REVALIDATE_SECRET; in dev it is open so the
// running server can be refreshed without extra setup.
function isAuthorized(request: Request): boolean {
  const secret = process.env.REVALIDATE_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const provided =
    request.headers.get("authorization")?.replace("Bearer ", "") ??
    new URL(request.url).searchParams.get("secret");
  return provided === secret;
}

const VALID_TAGS = ["github", "grafana"] as const;

function handle(request: Request): NextResponse {
  if (!isAuthorized(request)) {
    return NextResponse.json({ revalidated: false }, { status: 401 });
  }
  const requested = new URL(request.url).searchParams.get("tag");
  const tags = (VALID_TAGS as readonly string[]).includes(requested ?? "")
    ? [requested as string]
    : [...VALID_TAGS];
  // expire: 0 hard-expires the entry so the very next request refetches,
  // instead of stale-while-revalidate serving old data one more time.
  for (const tag of tags) revalidateTag(tag, { expire: 0 });
  return NextResponse.json({ revalidated: true, tags });
}

export function POST(request: Request): NextResponse {
  return handle(request);
}

export function GET(request: Request): NextResponse {
  return handle(request);
}
