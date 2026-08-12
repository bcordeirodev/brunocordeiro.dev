import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Analytics } from "@vercel/analytics/react";
import { ViewTransitionsProvider } from "@/components/motion/view-transitions";
import { PersonJsonLd } from "@/components/seo/person-json-ld";
import { getContent } from "@/content";
import { routing } from "@/i18n/routing";
import { buildPageMetadata, SITE_URL } from "@/lib/site";
import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  const { profile } = getContent(locale);
  const title = `${profile.name} — ${profile.role}`;
  const description = profile.metaDescription;

  return {
    metadataBase: new URL(SITE_URL),
    ...buildPageMetadata({ locale, title, description }),
    title: { default: title, template: "%s · Bruno Cordeiro" },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);
  const { profile, certifications, education } = getContent(locale);
  return (
    <html lang={locale} className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="font-sans antialiased">
        <PersonJsonLd profile={profile} certifications={certifications} education={education} locale={locale} />
        <ViewTransitionsProvider>
          <NextIntlClientProvider>{children}</NextIntlClientProvider>
        </ViewTransitionsProvider>
        <Analytics />
      </body>
    </html>
  );
}
