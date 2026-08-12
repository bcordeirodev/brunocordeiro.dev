import { getTranslations } from "next-intl/server";
import { TransitionLink } from "@/components/motion/transition-link";

const REPO_URL = "https://github.com/bcordeirodev/brunocordeiro.dev";

export async function SiteFooter() {
  const t = await getTranslations();

  return (
    <footer className="border-t border-border/50">
      <div className="mx-auto flex max-w-5xl flex-col gap-2 px-6 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
        <p>{t("footer.builtWith")}</p>
        <div className="flex items-center gap-4">
          <TransitionLink
            href="/cv"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            {t("footer.downloadCv")}
          </TransitionLink>
          <a
            href={REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-4 hover:text-foreground hover:underline"
          >
            {t("common.viewSource")}
          </a>
        </div>
      </div>
    </footer>
  );
}
