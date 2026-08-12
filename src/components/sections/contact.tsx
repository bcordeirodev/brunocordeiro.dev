import { getTranslations } from "next-intl/server";
import type { Profile } from "@/domain";
import { CopyEmailButton } from "@/components/sections/copy-email-button";
import { SocialLinks } from "@/components/sections/social-links";

export async function Contact({ profile }: { profile: Profile }) {
  const t = await getTranslations();

  return (
    <div className="flex flex-col items-start gap-6 pb-24">
      {/* Same mono-eyebrow recipe as the other home-page section headings
          (AiStats, RepoGrid, Certifications) instead of a one-off text-3xl
          treatment, for a consistent h2 hierarchy across the page. */}
      <h2 className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
        {t("nav.contact")}
      </h2>
      <p className="font-mono text-lg text-accent">{profile.email}</p>
      <p className="text-sm text-muted">{profile.languages}</p>
      <div className="flex flex-wrap items-center gap-4">
        <CopyEmailButton
          email={profile.email}
          copyLabel={t("common.copyEmail")}
          copiedLabel={t("common.copied")}
        />
        <SocialLinks github={profile.github} linkedin={profile.linkedin} />
      </div>
    </div>
  );
}
