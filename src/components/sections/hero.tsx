import { useTranslations } from "next-intl";
import type { Profile } from "@/domain";
import { Reveal } from "@/components/motion/reveal";
import { TransitionLink } from "@/components/motion/transition-link";
import { CopyEmailButton } from "@/components/sections/copy-email-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";

export function Hero({ profile }: { profile: Profile }) {
  const t = useTranslations("common");

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
        {/* Mesma fonte da OG image (stackHighlights): hero e preview social
            dizem a mesma stack, na mesma ordem — e a ordem é a ênfase. Chips
            em vez de uma linha mono: o olho acha "Laravel" e "Angular" antes
            de ler o parágrafo. */}
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t("coreStack")}>
          {profile.stackHighlights.map((item) => (
            <li key={item}>
              <Badge variant="tech">{item}</Badge>
            </li>
          ))}
        </ul>
        <p className="mt-5 max-w-2xl text-lg text-muted">{profile.pitch}</p>
        <p className="mt-4 font-mono text-sm text-muted">{profile.availability}</p>
      </div>

      {/* Sem a linha de métricas (testes no CI, downtime, releases): são prova
          de engenharia do case, não fatos de apresentação — o mesmo critério
          que tirou os números do CV. */}
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
    </section>
  );
}
