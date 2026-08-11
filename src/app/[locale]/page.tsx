import { setRequestLocale } from "next-intl/server";
import { getContent } from "@/content";
import type { Locale } from "@/content";

export default async function HomePage({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getContent(locale);
  return (
    <main className="mx-auto max-w-4xl px-6 py-24">
      <h1 className="text-4xl font-bold">{content.profile.name}</h1>
    </main>
  );
}
