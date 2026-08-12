import type { Certification, Education, Profile } from "@/domain";
import type { Locale } from "@/content";
import { absoluteUrl, languageTag, localizedPath, SITE_URL } from "@/lib/site";

/**
 * Parses `profile.location` (e.g. "Brasília-DF, Brasil" / "Brasília-DF,
 * Brazil") into a schema.org `PostalAddress` shape. `addressCountry` is
 * always the ISO 3166-1 alpha-2 code, not derived from the localized
 * country name in the source string.
 */
function parseAddress(location: string): {
  addressLocality: string;
  addressRegion: string;
  addressCountry: string;
} {
  const [cityRegion] = location.split(",");
  const [locality, region] = (cityRegion ?? "").trim().split("-");
  return {
    addressLocality: locality?.trim() || "Brasília",
    addressRegion: region?.trim() || "DF",
    addressCountry: "BR",
  };
}

/**
 * Emits a schema.org `@graph` (`WebSite` → site name in Google, and
 * `ProfilePage` → `mainEntity` `Person`) so search engines can attach a
 * Knowledge Panel identity (name, role, canonical profile links) to the
 * site. `address` intentionally stops at city/state/country — never a
 * street address.
 */
export function PersonJsonLd({
  profile,
  certifications = [],
  education = [],
  locale,
}: {
  profile: Profile;
  certifications?: Certification[];
  education?: Education[];
  locale: Locale;
}) {
  const hasCredential = certifications.map((certification) => ({
    "@type": "EducationalOccupationalCredential",
    name: certification.name,
    credentialCategory: "certification",
    recognizedBy: { "@type": "Organization", name: certification.issuer },
    ...(certification.credentialUrl ? { url: certification.credentialUrl } : {}),
  }));

  // Derived from `education[0]` (the primary/most recent entry) so this
  // always mirrors the content source instead of drifting from it.
  const alumniOf = education[0]
    ? { "@type": "EducationalOrganization", name: education[0].institution }
    : undefined;

  const websiteId = `${SITE_URL}/#website`;
  const personId = `${SITE_URL}/#person`;
  const pageUrl = absoluteUrl(localizedPath(locale));
  const inLanguage = languageTag(locale);

  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: SITE_URL,
        name: "Bruno Cordeiro",
        inLanguage,
        publisher: { "@id": personId },
      },
      {
        "@type": "ProfilePage",
        "@id": `${pageUrl}#profilepage`,
        url: pageUrl,
        inLanguage,
        isPartOf: { "@id": websiteId },
        mainEntity: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: "Bruno Cordeiro da Silva",
        jobTitle: profile.role,
        email: `mailto:${profile.email}`,
        url: SITE_URL,
        sameAs: [profile.github, profile.linkedin, "https://www.scrum.org/user/1506558"],
        address: {
          "@type": "PostalAddress",
          ...parseAddress(profile.location),
        },
        ...(alumniOf ? { alumniOf } : {}),
        ...(hasCredential.length > 0 ? { hasCredential } : {}),
      },
    ],
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />
  );
}
