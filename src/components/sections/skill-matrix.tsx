"use client";

import { Fragment, type ReactNode } from "react";
import type { Skill, SkillCategory, SkillLink } from "@/domain";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

/* Separadores de entradas compostas ("TypeScript · JavaScript",
   "MUI 6 + Emotion"). O split preserva o separador nos índices ímpares,
   então o título renderiza idêntico ao texto original. */
const NAME_SEPARATOR = /( · | \+ )/;

function SkillNameLink({
  text,
  link,
  officialSiteLabel,
}: {
  text: string;
  link: SkillLink;
  officialSiteLabel: string;
}) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      title={`${link.label} — ${officialSiteLabel}`}
      aria-label={`${link.label} — ${officialSiteLabel}`}
      className="rounded-sm underline decoration-muted/60 decoration-dotted underline-offset-4 transition-colors outline-none hover:text-accent hover:decoration-accent focus-visible:ring-[3px] focus-visible:ring-ring/50"
    >
      {text}
    </a>
  );
}

/* O título da skill é o link para o site oficial. Em títulos compostos com
   um link por tecnologia, cada segmento vira sua própria âncora (ordem dos
   `links` segue a ordem dos segmentos no conteúdo); quando o título não é
   segmentável ("Data viz" com 3 libs), o título inteiro aponta para o
   primeiro site e os demais ficam só no conteúdo. */
function renderSkillName(skill: Skill, officialSiteLabel: string): ReactNode {
  const links = skill.links;
  const [firstLink] = links ?? [];
  if (!links || !firstLink) return skill.name;

  const parts = skill.name.split(NAME_SEPARATOR);
  const segmentCount = Math.ceil(parts.length / 2);
  if (segmentCount < links.length) {
    return (
      <SkillNameLink text={skill.name} link={firstLink} officialSiteLabel={officialSiteLabel} />
    );
  }

  let linkIndex = 0;
  return parts.map((part, index) => {
    const link = index % 2 === 0 ? links[linkIndex++] : undefined;
    if (!link) return <Fragment key={index}>{part}</Fragment>;
    return (
      <SkillNameLink key={index} text={part} link={link} officialSiteLabel={officialSiteLabel} />
    );
  });
}

export function SkillMatrix({
  categories,
  officialSiteLabel,
}: {
  categories: SkillCategory[];
  /* rótulo localizado do aria-label/title dos links ("site oficial" /
     "official website") — o componente é client e recebe strings prontas
     do server, como o resto da página. */
  officialSiteLabel: string;
}) {
  return (
    <Tabs defaultValue={categories[0]?.id}>
      {/* Below `sm`, tabs scroll horizontally (native
          `-webkit-overflow-scrolling`, hidden scrollbar) with a trailing-edge
          fade hinting that the row continues; the mask fades to transparent
          instead of an opaque overlay, so it still shows bg-surface. At `sm`
          and up the 5 tabs fit a single row; `h-auto!` + flex-wrap stay as a
          safety net if a locale's titles ever overflow — `h-auto!` (not just
          `h-auto`) because the base TabsList variant sets a fixed
          `group-data-horizontal/tabs:h-8` with equal CSS specificity.

          tabIndex={0}: a lista é a região ROLÁVEL no mobile e, antes da
          hidratação, o Base UI deixa toda tab com tabindex="-1" — sem um
          alvo de teclado na própria lista, a regra axe
          scrollable-region-focusable falha de forma intermitente no e2e
          (remediação padrão: o elemento rolável ser focável). */}
      <TabsList
        tabIndex={0}
        className={cn(
          "h-auto! w-full flex-nowrap justify-start gap-1 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] sm:w-fit sm:flex-wrap sm:justify-center sm:overflow-visible [&::-webkit-scrollbar]:hidden",
          "[mask-image:linear-gradient(to_right,black,black_calc(100%-2.5rem),transparent)] sm:[mask-image:none]",
        )}
      >
        {categories.map((category) => (
          <TabsTrigger
            key={category.id}
            value={category.id}
            id={`skill-tab-${category.id}`}
            aria-controls={`skill-panel-${category.id}`}
            className="shrink-0"
          >
            {category.title}
          </TabsTrigger>
        ))}
      </TabsList>
      {categories.map((category) => (
        <TabsContent
          key={category.id}
          value={category.id}
          id={`skill-panel-${category.id}`}
          aria-labelledby={`skill-tab-${category.id}`}
          // Keeps every category panel rendered in the initial HTML instead
          // of only the active one. Inactive panels are still marked
          // `hidden`/`inert` by the underlying Tabs.Panel (invisible to users
          // and ignored by axe), but the markup — and every skill name/proof
          // inside it — is present for crawlers, ATS parsers, and sourcing
          // agents that only ever see the first HTML response.
          keepMounted
        >
          <ul className="grid gap-x-10 sm:grid-cols-2">
            {category.skills.map((skill) => (
              <li
                key={skill.name}
                className="flex flex-col gap-0.5 border-b border-border/60 py-2.5"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                  <span className="font-mono text-sm">
                    {renderSkillName(skill, officialSiteLabel)}
                  </span>
                  {/* Separador " · " é aria-hidden: leitores de tela não
                      anunciam o middle dot e emendariam "Link Charts G4F"
                      como um nome só; a vírgula sr-only dá a pausa/limite
                      entre origens sem mudar o visual. */}
                  <span className="font-mono text-[11px] text-muted">
                    {skill.tags.map((tag, index) => (
                      <Fragment key={tag}>
                        {index > 0 ? (
                          <>
                            <span aria-hidden="true"> · </span>
                            <span className="sr-only">, </span>
                          </>
                        ) : null}
                        {tag}
                      </Fragment>
                    ))}
                  </span>
                </div>
                <p className="text-sm text-muted">{skill.proof}</p>
              </li>
            ))}
          </ul>
        </TabsContent>
      ))}
    </Tabs>
  );
}
