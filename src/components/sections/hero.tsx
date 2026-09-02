import { useTranslations } from "next-intl";
import type { Profile } from "@/domain";
import { Reveal } from "@/components/motion/reveal";
import { TransitionLink } from "@/components/motion/transition-link";
import { CopyEmailButton } from "@/components/sections/copy-email-button";
import { buttonVariants } from "@/components/ui/button";

export function Hero({ profile }: { profile: Profile }) {
  const t = useTranslations("common");

  // Uma linha mono de fatos vinda direto de profile.metrics (rótulo como
  // escrito, sem copy inventada) em vez de um grid animado — lê como linha
  // de caderno, não como dashboard de vendas.
  const factsLine = profile.metrics
    .map((metric) => `${metric.prefix ?? ""}${metric.value}${metric.suffix ?? ""} ${metric.label}`)
    .join(" · ");

  // Mesma fonte da OG image (stackHighlights): hero e preview social dizem a
  // mesma stack, sem uma lista paralela hardcoded aqui.
  const stackLine = profile.stackHighlights.join(" · ");

  return (
    // Sem mx-auto/px-6/max-w aqui: o <main> em page.tsx já centraliza e
    // aplica o padding em max-w-5xl. Um segundo container mais estreito
    // dobrava o padding horizontal no mobile e desalinhava a borda esquerda
    // do hero com todas as seções abaixo.
    <section className="pt-24">
      {/* Fora do Reveal: o h1 é o elemento LCP e tudo neste bloco (cargo,
          pitch, disponibilidade) está acima da dobra em qualquer carga —
          esconder atrás de opacity:0 até o motion hidratar só atrasa a
          pintura do que o recrutador precisa ler nos primeiros segundos. */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h1>
        <p className="mt-2 font-mono text-sm text-muted">
          {profile.role} · {profile.location}
        </p>
        <p className="mt-1 font-mono text-sm text-muted">{stackLine}</p>
        <p className="mt-5 max-w-2xl text-lg text-muted">{profile.pitch}</p>
        <p className="mt-4 font-mono text-sm text-muted">{profile.availability}</p>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <TransitionLink href="/cv" className={buttonVariants()}>
            {t("downloadCv")}
          </TransitionLink>
          <a
            href={profile.github}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonVariants({ variant: "outline" })}
          >
            {t("viewCode")} <span aria-hidden="true">→</span>
          </a>
          <a
            href={profile.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="font-mono text-sm text-accent underline-offset-4 hover:underline"
          >
            LinkedIn
          </a>
          <CopyEmailButton
            email={profile.email}
            copyLabel={t("copyEmail")}
            copiedLabel={t("copied")}
          />
        </div>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-10 font-mono text-sm text-muted">
          {factsLine} — {t("asOf", { date: profile.metricsAsOf })}
        </p>
      </Reveal>
    </section>
  );
}
