import { getTranslations } from "next-intl/server";
import type { Certification, Education } from "@/domain";
import type { Locale } from "@/content";
import { Card, CardContent } from "@/components/ui/card";
import { formatYearMonth } from "@/lib/dates";

export async function Certifications({
  items,
  education = [],
  locale,
}: {
  items: Certification[];
  education?: Education[];
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "common" });
  const tSections = await getTranslations({ locale, namespace: "sections" });

  return (
    <div className="flex flex-col gap-6">
      <h2 className="font-mono text-sm font-bold tracking-[0.2em] text-muted uppercase">
        {tSections("certifications")}
      </h2>
      {education.length > 0 ? (
        <ul className="flex flex-col gap-2">
          {education.map((entry) => (
            <li key={entry.degree} className="text-sm">
              <span className="font-medium">{entry.degree}</span>
              <span className="text-muted">
                {" "}
                — {entry.institution} · {entry.period}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
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
    </div>
  );
}
