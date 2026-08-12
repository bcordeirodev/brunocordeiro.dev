import { useTranslations } from "next-intl";
import type { Profile } from "@/domain";
import { Reveal } from "@/components/motion/reveal";
import { TransitionLink } from "@/components/motion/transition-link";
import { CopyEmailButton } from "@/components/sections/copy-email-button";
import { SocialLinks } from "@/components/sections/social-links";
import { buttonVariants } from "@/components/ui/button";

const STACK_LINE = [
  "TypeScript",
  "Next.js",
  "React",
  "NestJS",
  "Laravel",
  "PostgreSQL",
  "Redis",
  "Docker",
  "Kubernetes",
  "CI/CD",
].join(" · ");

export function Hero({ profile }: { profile: Profile }) {
  const t = useTranslations("common");

  // One discreet mono line of facts built straight from profile.metrics
  // (label as authored, no invented copy) instead of an animated card grid —
  // this reads as a notebook fact line, not a sales dashboard.
  const factsLine = profile.metrics
    .map((metric) => `${metric.prefix ?? ""}${metric.value}${metric.suffix ?? ""} ${metric.label}`)
    .join(" · ");

  return (
    // No mx-auto/px-6/max-w here: <main> in page.tsx already centers and
    // pads the page at max-w-5xl. Adding a second, narrower centered
    // container doubled the horizontal padding on mobile and shifted the
    // hero's left edge out of alignment with every section below it.
    <section className="pt-24">
      {/* Not wrapped in Reveal: this heading is the LCP element, and gating
          it behind opacity:0 -> whileInView delays paint until motion
          hydrates, which tanks LCP. It's above the fold on every load, so a
          scroll-triggered fade-in adds no visible value here anyway. */}
      <div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">{profile.name}</h1>
        <p className="mt-2 font-mono text-sm text-muted">
          {profile.headline} · {profile.location}
        </p>
        <p className="mt-4 max-w-2xl text-lg text-muted">{profile.subheadline}</p>
      </div>

      <Reveal delay={0.1}>
        <p className="mt-10 font-mono text-sm text-muted">
          {factsLine} — {t("asOf", { date: profile.metricsAsOf })}
        </p>
      </Reveal>

      <Reveal delay={0.2}>
        <p className="mt-6 font-mono text-sm text-muted">{STACK_LINE}</p>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-8 flex flex-wrap items-center gap-4">
          <TransitionLink href="/cv" className={buttonVariants()}>
            {t("downloadCv")}
          </TransitionLink>
          <SocialLinks github={profile.github} linkedin={profile.linkedin} />
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
