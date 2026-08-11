import type { Profile } from "@/domain";
import { SITE_URL } from "@/lib/site";

/**
 * Emits schema.org `Person` JSON-LD for Bruno so search engines can attach a
 * Knowledge Panel identity (name, role, canonical profile links) to the
 * site. `address` intentionally stops at city/state/country — never a
 * street address.
 */
export function PersonJsonLd({ profile }: { profile: Profile }) {
  const data = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Bruno Cordeiro da Silva",
    jobTitle: profile.role,
    email: `mailto:${profile.email}`,
    url: SITE_URL,
    sameAs: [profile.github, profile.linkedin, "https://www.scrum.org/user/1506558"],
    alumniOf: "Universidade Paulista",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Brasília",
      addressRegion: "DF",
      addressCountry: "BR",
    },
  };
  return (
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />
  );
}
