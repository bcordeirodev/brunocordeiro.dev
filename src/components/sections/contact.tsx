import { getTranslations } from "next-intl/server";
import type { Profile } from "@/domain";
import { Button } from "@/components/ui/button";
import { CopyEmailButton } from "@/components/sections/copy-email-button";

export async function Contact({ profile }: { profile: Profile }) {
  const t = await getTranslations();

  return (
    <div className="flex flex-col items-start gap-6 pb-24">
      <h2 className="text-3xl font-bold">{t("nav.contact")}</h2>
      <p className="font-mono text-lg text-accent">{profile.email}</p>
      <p className="text-sm text-muted">{profile.languages}</p>
      <div className="flex flex-wrap gap-3">
        <CopyEmailButton
          email={profile.email}
          copyLabel={t("common.copyEmail")}
          copiedLabel={t("common.copied")}
        />
        <Button
          variant="outline"
          nativeButton={false}
          render={<a href={profile.github} target="_blank" rel="noopener noreferrer" />}
        >
          GitHub
        </Button>
        <Button
          variant="outline"
          nativeButton={false}
          render={<a href={profile.linkedin} target="_blank" rel="noopener noreferrer" />}
        >
          LinkedIn
        </Button>
      </div>
    </div>
  );
}
