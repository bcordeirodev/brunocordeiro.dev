import { useTranslations } from "next-intl";
import type { Profile } from "@/domain";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { NumberTicker } from "@/components/motion/number-ticker";
import { Reveal } from "@/components/motion/reveal";
import { CopyEmailButton } from "@/components/sections/copy-email-button";

const STACK_CHIPS = [
  "TypeScript",
  "Next.js",
  "React",
  "Laravel",
  "NestJS",
  "PostgreSQL",
  "Redis",
  "Docker",
] as const;

export function Hero({ profile }: { profile: Profile }) {
  const t = useTranslations("common");
  const years = profile.metrics.find((metric) => metric.id === "years");

  return (
    <section className="mx-auto max-w-4xl px-6 pt-24">
      {/* Not wrapped in Reveal: this heading is the LCP element, and gating
          it behind opacity:0 -> whileInView delays paint until motion
          hydrates, which tanks LCP. It's above the fold on every load, so a
          scroll-triggered fade-in adds no visible value here anyway. */}
      <div>
        {/* Scannable identity line for recruiters/ATS/sourcing agents: name,
            role, seniority signal, and location in plain indexable text,
            right above the marketing headline. The h1 below stays the
            headline on purpose (e2e asserts it matches /full-stack/i). */}
        <p className="text-sm font-medium text-muted sm:text-base">
          {profile.name} · {profile.role}
          {years ? ` · ${years.value}${years.suffix ?? ""} ${years.label}` : ""} ·{" "}
          {profile.location}
        </p>
        <h1 className="mt-2 text-5xl font-bold tracking-tight">{profile.headline}</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">{profile.subheadline}</p>
      </div>

      <Reveal delay={0.1}>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {profile.metrics.map((metric) => (
            <Card key={metric.id}>
              <CardContent className="flex flex-col gap-1">
                <span className="text-3xl font-bold text-accent">
                  <NumberTicker
                    value={metric.value}
                    prefix={metric.prefix}
                    suffix={metric.suffix}
                  />
                </span>
                <span className="text-sm text-muted">{metric.label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
        <p className="mt-3 text-xs text-muted">{t("asOf", { date: profile.metricsAsOf })}</p>
      </Reveal>

      <Reveal delay={0.2}>
        <div className="mt-8 flex flex-wrap gap-2">
          {STACK_CHIPS.map((chip) => (
            <Badge key={chip} variant="outline">
              {chip}
            </Badge>
          ))}
        </div>
      </Reveal>

      <Reveal delay={0.3}>
        <div className="mt-8 flex flex-wrap gap-3">
          <Button
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
