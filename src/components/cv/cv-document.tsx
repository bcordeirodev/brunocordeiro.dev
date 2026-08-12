import { Document, Font, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Locale } from "@/content";
import type { CvData } from "@/lib/cv/build-cv-data";
import type { CvLabels } from "@/lib/cv/labels";
import { pdfSafe } from "@/lib/cv/pdf-text";
import { certificationKey, educationKey } from "@/lib/cv/selection";
import { formatPeriod, formatYearMonth } from "@/lib/dates";

// Sem hifenização: num CV, quebrar "Kubernetes" ou o meio de uma URL de
// credencial no fim da linha atrapalha a leitura (e o copy/paste do ATS).
Font.registerHyphenationCallback((word) => [word]);

// `lineHeight` fica em cada estilo, nunca na Page: herdada, ela é resolvida
// como valor absoluto a partir do fontSize da Page (9pt), o que esmagava o
// nome de 19pt contra a linha seguinte.
const styles = StyleSheet.create({
  page: {
    fontFamily: "Helvetica",
    fontSize: 9,
    color: "#1a1a1a",
    paddingVertical: 36,
    paddingHorizontal: 40,
  },
  name: { fontFamily: "Helvetica-Bold", fontSize: 19, lineHeight: 1.2 },
  role: { fontFamily: "Helvetica-Bold", fontSize: 10, color: "#444", lineHeight: 1.3 },
  contact: { fontSize: 8, color: "#555", lineHeight: 1.4, marginTop: 2 },
  link: { color: "#1a56db", textDecoration: "none" },
  summary: { fontSize: 9, color: "#333", lineHeight: 1.4, marginTop: 8 },
  metrics: { fontSize: 8, color: "#555", lineHeight: 1.4, marginTop: 4 },
  section: { marginTop: 13 },
  sectionTitle: {
    fontFamily: "Helvetica-Bold",
    fontSize: 7.5,
    letterSpacing: 1.2,
    lineHeight: 1.2,
    textTransform: "uppercase",
    color: "#888",
    borderBottomWidth: 0.5,
    borderBottomColor: "#ccc",
    paddingBottom: 3,
    marginBottom: 6,
  },
  entry: { marginBottom: 7 },
  entryTitle: { fontFamily: "Helvetica-Bold", fontSize: 9.5, lineHeight: 1.25 },
  entryMeta: { fontSize: 8, color: "#666", lineHeight: 1.4, marginTop: 1 },
  body: { fontSize: 8.5, color: "#333", lineHeight: 1.4, marginTop: 2 },
  skillGroup: { fontSize: 8.5, color: "#333", lineHeight: 1.4, marginBottom: 3 },
  credential: { fontSize: 7.5, lineHeight: 1.4 },
  strong: { fontFamily: "Helvetica-Bold", color: "#1a1a1a" },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  // minPresenceAhead evita que o título de uma seção fique órfão no pé da página.
  return (
    <View style={styles.section} minPresenceAhead={48}>
      <Text style={styles.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

export function CvDocument({
  data: rawData,
  locale,
  labels,
}: {
  data: CvData;
  locale: Locale;
  labels: CvLabels;
}) {
  const data = pdfSafe(rawData);
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
          {` · ${profile.location} · ${profile.languages}`}
        </Text>
        <Text style={styles.contact}>
          <Link style={styles.link} src={profile.github}>
            {profile.github}
          </Link>
          {" · "}
          <Link style={styles.link} src={profile.linkedin}>
            {profile.linkedin}
          </Link>
        </Text>

        {data.summary ? <Text style={styles.summary}>{data.summary}</Text> : null}

        {data.metrics ? (
          <Text style={styles.metrics}>
            {data.metrics.map((metric, index) => (
              <Text key={metric.id}>
                {index > 0 ? "   ·   " : ""}
                <Text style={styles.strong}>
                  {`${metric.prefix ?? ""}${metric.value}${metric.suffix ?? ""}`}
                </Text>
                {` ${metric.label}`}
              </Text>
            ))}
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
                {exp.projects.map((project) => (
                  <Text key={project.name} style={styles.body}>
                    <Text style={styles.strong}>{project.name}</Text>
                    {` — ${project.description}`}
                  </Text>
                ))}
              </View>
            ))}
          </Section>
        ) : null}

        {data.skillCategories ? (
          <Section title={labels.sections.skills}>
            {/* Só os nomes: a prova de cada skill vive no site, e num CV ela
                custaria três páginas de texto que o recrutador não lê. */}
            {data.skillCategories.map((category) => (
              <Text key={category.id} style={styles.skillGroup}>
                <Text style={styles.strong}>{category.title}</Text>
                {` — ${category.skills.map((skill) => skill.name).join(" · ")}`}
              </Text>
            ))}
          </Section>
        ) : null}

        {data.certifications ? (
          <Section title={labels.sections.certifications}>
            {data.certifications.map((certification) => (
              <View key={certificationKey(certification)} wrap={false}>
                <Text style={styles.body}>
                  <Text style={styles.strong}>{certification.name}</Text>
                  {` — ${certification.issuer} · ${formatYearMonth(certification.issued, locale)}`}
                  {certification.expires
                    ? ` (${labels.validUntil} ${formatYearMonth(certification.expires, locale)})`
                    : ""}
                </Text>
                {/* URL em linha própria: emendada na anterior, ela quebrava no
                    meio e deixava o separador pendurado no fim da linha. */}
                {certification.credentialUrl ? (
                  <Link style={[styles.credential, styles.link]} src={certification.credentialUrl}>
                    {certification.credentialUrl}
                  </Link>
                ) : null}
              </View>
            ))}
          </Section>
        ) : null}

        {data.education ? (
          <Section title={labels.sections.education}>
            {data.education.map((item) => (
              <Text key={educationKey(item)} style={styles.body}>
                <Text style={styles.strong}>{item.degree}</Text>
                {` — ${item.institution} · ${item.period}`}
              </Text>
            ))}
          </Section>
        ) : null}

        {data.caseStudy ? (
          <Section title={labels.sections.caseStudy}>
            <Text style={styles.body}>
              <Text style={styles.strong}>{data.caseStudy.title}</Text>
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
