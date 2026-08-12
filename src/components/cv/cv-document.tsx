import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Locale } from "@/content";
import type { CvData } from "@/lib/cv/build-cv-data";
import type { CvLabels } from "@/lib/cv/labels";
import { certificationKey, educationKey } from "@/lib/cv/selection";
import { formatPeriod, formatYearMonth } from "@/lib/dates";

const styles = StyleSheet.create({
  page: { fontFamily: "Helvetica", fontSize: 9, color: "#1a1a1a", padding: 40, lineHeight: 1.4 },
  name: { fontFamily: "Helvetica-Bold", fontSize: 20 },
  role: { fontSize: 11, color: "#555", marginTop: 2 },
  contact: { fontSize: 8, color: "#555", marginTop: 2 },
  link: { color: "#1a56db", textDecoration: "none" },
  section: { marginTop: 14 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 8,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    color: "#888",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingBottom: 3,
    marginBottom: 6,
  },
  entry: { marginBottom: 8 },
  entryTitle: { fontFamily: "Helvetica-Bold", fontSize: 10 },
  entryMeta: { fontSize: 8, color: "#555", marginTop: 1 },
  body: { fontSize: 9, color: "#333", marginTop: 2 },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function CvDocument({
  data,
  locale,
  labels,
}: {
  data: CvData;
  locale: Locale;
  labels: CvLabels;
}) {
  const { profile } = data;
  return (
    <Document title={`${profile.name} — CV`} author={profile.name}>
      <Page size="A4" style={styles.page}>
        <Text style={styles.name}>{profile.name}</Text>
        <Text style={styles.role}>{profile.role}</Text>
        <Text style={styles.contact}>
          <Link style={styles.link} src={`mailto:${profile.email}`}>
            {profile.email}
          </Link>
          {`  ·  ${profile.location}  ·  ${profile.languages}`}
        </Text>
        <Text style={styles.contact}>
          <Link style={styles.link} src={profile.github}>
            {profile.github}
          </Link>
          {"  ·  "}
          <Link style={styles.link} src={profile.linkedin}>
            {profile.linkedin}
          </Link>
        </Text>

        {data.summary ? <Text style={[styles.body, styles.section]}>{data.summary}</Text> : null}

        {data.metrics ? (
          <Text style={[styles.entryMeta, { marginTop: 8 }]}>
            {data.metrics
              .map((m) => `${m.prefix ?? ""}${m.value}${m.suffix ?? ""} ${m.label}`)
              .join("  ·  ")}
          </Text>
        ) : null}

        {data.experiences ? (
          <Section title={labels.sections.experiences}>
            {data.experiences.map((exp) => (
              <View key={`${exp.company}:${exp.start}`} style={styles.entry} wrap={false}>
                <Text style={styles.entryTitle}>
                  {exp.role} — {exp.company}
                </Text>
                <Text style={styles.entryMeta}>
                  {formatPeriod(exp.start, exp.end, locale, labels.current)}
                  {"  ·  "}
                  {exp.stacks.join(" · ")}
                </Text>
                {exp.projects.map((p) => (
                  <Text key={p.name} style={styles.body}>
                    {p.name} — {p.description}
                  </Text>
                ))}
              </View>
            ))}
          </Section>
        ) : null}

        {data.skillCategories ? (
          <Section title={labels.sections.skills}>
            {data.skillCategories.map((cat) => (
              <View key={cat.id} style={styles.entry} wrap={false}>
                <Text style={styles.entryTitle}>{cat.title}</Text>
                {cat.skills.map((s) => (
                  <Text key={s.name} style={styles.body}>
                    {s.name} — {s.proof}
                  </Text>
                ))}
              </View>
            ))}
          </Section>
        ) : null}

        {data.certifications ? (
          <Section title={labels.sections.certifications}>
            {data.certifications.map((c) => (
              <View key={certificationKey(c)} style={styles.entry} wrap={false}>
                <Text style={styles.body}>
                  <Text style={styles.entryTitle}>{c.name}</Text>
                  {` — ${c.issuer} · ${formatYearMonth(c.issued, locale)}`}
                  {c.expires ? ` (${labels.validUntil} ${formatYearMonth(c.expires, locale)})` : ""}
                  {c.credentialUrl ? (
                    <>
                      {"  ·  "}
                      <Link style={styles.link} src={c.credentialUrl}>
                        {c.credentialUrl}
                      </Link>
                    </>
                  ) : null}
                </Text>
              </View>
            ))}
          </Section>
        ) : null}

        {data.education ? (
          <Section title={labels.sections.education}>
            {data.education.map((e) => (
              <Text key={educationKey(e)} style={styles.body}>
                <Text style={styles.entryTitle}>{e.degree}</Text>
                {` — ${e.institution} · ${e.period}`}
              </Text>
            ))}
          </Section>
        ) : null}

        {data.caseStudy ? (
          <Section title={labels.sections.caseStudy}>
            <Text style={styles.body}>
              <Text style={styles.entryTitle}>{data.caseStudy.title}</Text>
              {` — ${data.caseStudy.tagline}`}
            </Text>
            <Text style={styles.body}>
              {labels.caseStudyCta}
              {": "}
              <Link style={styles.link} src={data.caseStudy.url}>
                {data.caseStudy.url}
              </Link>
            </Text>
          </Section>
        ) : null}
      </Page>
    </Document>
  );
}
