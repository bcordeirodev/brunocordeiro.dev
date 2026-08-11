import { getTranslations } from "next-intl/server";
import type { Certification } from "@/domain";
import type { Locale } from "@/content";
import { Card, CardContent } from "@/components/ui/card";
import { formatYearMonth } from "@/lib/dates";

export async function Certifications({
  items,
  locale,
}: {
  items: Certification[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "common" });

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map((certification) => (
        <Card key={certification.name}>
          <CardContent className="flex flex-col gap-1">
            <h3 className="font-medium">{certification.name}</h3>
            <p className="text-sm text-muted">{certification.issuer}</p>
            <p className="text-xs text-muted">{formatYearMonth(certification.issued, locale)}</p>
            {certification.expires ? (
              <p className="text-xs text-muted">
                {t("validUntil")} {formatYearMonth(certification.expires, locale)}
              </p>
            ) : null}
            {certification.credentialUrl ? (
              <a
                href={certification.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 text-sm text-accent underline-offset-4 hover:underline"
              >
                {t("viewCredential")}
              </a>
            ) : null}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
