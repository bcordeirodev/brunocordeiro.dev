import { ArrowRight, ArrowUpRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Profile } from "@/domain";
import { TransitionLink } from "@/components/motion/transition-link";
import { CopyEmailButton } from "@/components/sections/copy-email-button";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Terceiro nível da hierarquia de ações (CV e GitHub): links de texto, sem
// caixa, para não disputar com o contato. A altura dá área de toque.
const secondaryLink =
  "inline-flex h-10 items-center gap-1.5 rounded-md text-sm font-medium text-foreground underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50 [&_svg]:size-4 [&_svg]:text-muted";

export function Hero({ profile }: { profile: Profile }) {
  const t = useTranslations("common");

  return (
    // Sem mx-auto/px-6/max-w aqui: o <main> em page.tsx já centraliza e
    // aplica o padding em max-w-5xl. Um segundo container mais estreito
    // dobrava o padding horizontal no mobile e desalinhava a borda esquerda
    // do hero com todas as seções abaixo.
    //
    // Nada aqui fica atrás de um Reveal: o h1 é o elemento LCP e todo o bloco
    // (cargo, pitch, disponibilidade, contato) está acima da dobra — esconder
    // atrás de opacity:0 até o motion hidratar só atrasa a pintura do que o
    // recrutador precisa ler, e tocar, nos primeiros segundos.
    //
    // Coluna flex por causa do `order`: no celular o parágrafo do pitch ocupa
    // a tela inteira, então disponibilidade e contato sobem para antes dele
    // (order-1/2) e o pitch desce (order-3). A partir de `sm` tudo volta à
    // ordem do DOM, que é a ordem de leitura do desktop.
    <section className="flex flex-col pt-12 sm:pt-24">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h1>
      <p className="mt-2 font-mono text-sm text-balance text-muted">
        {profile.role} · {profile.location}
      </p>
      {/* Mesma fonte da OG image (stackHighlights): hero e preview social
          dizem a mesma stack, na mesma ordem — e a ordem é a ênfase. Chips em
          vez de uma linha mono: o olho acha as duas primeiras tecnologias
          antes de ler o parágrafo. */}
      <ul className="mt-3 flex flex-wrap gap-1.5" aria-label={t("coreStack")}>
        {profile.stackHighlights.map((item) => (
          <li key={item}>
            <Badge variant="tech">{item}</Badge>
          </li>
        ))}
      </ul>
      <p className="order-3 mt-8 max-w-2xl text-lg text-muted sm:order-none sm:mt-5">
        {profile.pitch}
      </p>
      <p className="order-1 mt-4 font-mono text-sm text-balance text-muted sm:order-none">
        {profile.availability}
      </p>

      {/* Sem a linha de métricas (testes no CI, downtime, releases): são prova
          de engenharia do case, não fatos de apresentação — o mesmo critério
          que tirou os números do CV.

          O objetivo da página é o contato, então ele é o único botão cheio:
          LinkedIn primeiro (escolha do Bruno), e-mail ao lado com o endereço
          escrito — dá para ler, clicar (mailto) ou copiar. */}
      <div className="order-2 mt-5 flex flex-col gap-3 sm:order-none sm:mt-8 sm:flex-row sm:flex-wrap sm:items-center">
        <a
          href={profile.linkedin}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants(), "h-11 gap-2 px-4 sm:h-10")}
        >
          {t("contactLinkedin")}
          <ArrowUpRight aria-hidden="true" />
        </a>
        <div className="flex h-11 rounded-lg border border-border sm:h-10">
          <a
            href={`mailto:${profile.email}`}
            aria-label={t("sendEmailTo", { email: profile.email })}
            className="flex min-w-0 flex-1 items-center rounded-l-[calc(var(--radius-lg)-1px)] px-3 font-mono text-sm outline-none hover:bg-surface focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <span className="truncate">{profile.email}</span>
          </a>
          <CopyEmailButton
            iconOnly
            email={profile.email}
            copyLabel={t("copyEmail")}
            copiedLabel={t("copied")}
            className="h-full w-11 rounded-l-none rounded-r-[calc(var(--radius-lg)-1px)] border-0 border-l border-border sm:w-10"
          />
        </div>
      </div>

      <div className="order-4 mt-6 flex flex-wrap items-center gap-x-6 gap-y-1 sm:order-none sm:mt-4">
        <TransitionLink href="/cv" className={secondaryLink}>
          {t("downloadCv")}
          <ArrowRight aria-hidden="true" />
        </TransitionLink>
        <a
          href={profile.github}
          target="_blank"
          rel="noopener noreferrer"
          className={secondaryLink}
        >
          {t("viewCode")}
          <ArrowUpRight aria-hidden="true" />
        </a>
      </div>
    </section>
  );
}
