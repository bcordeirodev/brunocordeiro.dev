import { getTranslations } from "next-intl/server";
import type { Profile } from "@/domain";
import { CopyEmailButton } from "@/components/sections/copy-email-button";

export async function Contact({ profile }: { profile: Profile }) {
  const t = await getTranslations();

  return (
    <div className="flex flex-col items-start gap-6 pb-24">
      <h2 className="text-3xl font-bold">{t("nav.contact")}</h2>
      <p className="font-mono text-lg text-accent">{profile.email}</p>
      <p className="text-sm text-muted">{profile.languages}</p>
      <div className="flex flex-wrap items-center gap-4">
        <CopyEmailButton
          email={profile.email}
          copyLabel={t("common.copyEmail")}
          copiedLabel={t("common.copied")}
        />
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-accent underline-offset-4 hover:underline"
        >
          GitHub
        </a>
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className="font-mono text-sm text-accent underline-offset-4 hover:underline"
        >
          LinkedIn
        </a>
      </div>
    </div>
  );
}
