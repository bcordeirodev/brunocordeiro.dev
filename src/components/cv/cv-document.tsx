import { Children } from "react";
import { Document, Link, Page, StyleSheet, Text, View } from "@react-pdf/renderer";
import type { Locale } from "@/content";
import type { Experience } from "@/domain";
import type { CvData } from "@/lib/cv/build-cv-data";
import { displayUrl } from "@/lib/cv/display-url";
import { matchesFocus, sortByFocus } from "@/lib/cv/focus";
import { CV_FONT_FAMILY, registerCvFonts } from "@/lib/cv/fonts";
import type { CvLabels } from "@/lib/cv/labels";
import { pdfSafe } from "@/lib/cv/pdf-text";
import { certificationKey, educationKey } from "@/lib/cv/selection";
import { formatDuration, formatPeriod, formatYearMonth } from "@/lib/dates";

// No browser os TTFs vêm de `public/fonts/cv`; testes e scripts registram
// antes de importar este módulo (ver `registerCvFonts`).
registerCvFonts();

// Paleta de impressão: cinzas neutros do site em papel branco e um verde
// escuro no lugar do acento neon da tela — o mesmo tom, legível no papel.
const ink = "#18181b";
const body = "#3f3f46";
const muted = "#71717a";
const faint = "#a1a1aa";
const rule = "#e4e4e7";
const chipBg = "#f4f4f5";
const accent = "#15803d";

// `lineHeight` fica em cada estilo, nunca na Page: herdada, ela é resolvida
// como valor absoluto a partir do fontSize da Page, o que esmagava o nome
// grande contra a linha seguinte.
const styles = StyleSheet.create({
  page: {
    fontFamily: CV_FONT_FAMILY,
    fontSize: 9,
    color: ink,
    paddingTop: 36,
    paddingBottom: 46,
    paddingHorizontal: 42,
  },

  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  identity: { flex: 1, paddingRight: 24 },
  name: { fontSize: 22, fontWeight: 700, lineHeight: 1.1, letterSpacing: -0.3 },
  role: { fontSize: 10.5, fontWeight: 500, color: body, lineHeight: 1.3, marginTop: 4 },
  availability: { fontSize: 8.5, color: muted, lineHeight: 1.4, marginTop: 2 },
  contact: { width: 190, alignItems: "flex-end" },
  contactLine: { fontSize: 8, color: body, lineHeight: 1.55, textAlign: "right" },
  link: { color: accent, textDecoration: "none" },
  headerRule: { flexDirection: "row", alignItems: "center", marginTop: 12 },
  headerRuleAccent: { width: 40, height: 2, backgroundColor: accent },
  headerRuleLine: { flex: 1, height: 0.6, backgroundColor: rule },

  summary: { fontSize: 9.2, color: body, lineHeight: 1.45, marginTop: 10 },

  focusRow: { flexDirection: "row", flexWrap: "wrap", alignItems: "center", marginTop: 8 },
  focusLabel: { fontSize: 8, fontWeight: 600, color: body, marginRight: 5, marginBottom: 2.5 },

  section: { marginTop: 12 },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 600,
    lineHeight: 1.2,
    borderBottomWidth: 0.6,
    borderBottomColor: rule,
    paddingBottom: 4,
    marginBottom: 7,
  },

  entry: { marginBottom: 8 },
  entryHead: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  entryMain: { flex: 1, paddingRight: 12 },
  entryTitle: { fontSize: 9.8, fontWeight: 600, lineHeight: 1.3 },
  entryCompany: { fontWeight: 500, color: body },
  entryMeta: { fontSize: 8, color: muted, lineHeight: 1.4, marginTop: 1 },
  entryAside: { width: 130, alignItems: "flex-end" },
  entryPeriod: { fontSize: 8, color: body, lineHeight: 1.3, textAlign: "right" },
  entryDuration: { fontSize: 7.5, color: faint, lineHeight: 1.4, textAlign: "right", marginTop: 1 },
  bullets: { marginTop: 4 },
  bullet: { flexDirection: "row", marginBottom: 1.5 },
  bulletDot: { width: 9, fontSize: 8.5, color: accent, lineHeight: 1.4 },
  bulletText: { flex: 1, fontSize: 8.5, color: body, lineHeight: 1.4 },
  stack: { fontSize: 7.5, color: muted, lineHeight: 1.45, marginTop: 3 },
  stackLabel: { fontWeight: 600, color: body },
  stackHit: { fontWeight: 600, color: ink },

  skillRow: { flexDirection: "row", marginBottom: 4 },
  skillTitle: { width: 92, fontSize: 8.5, fontWeight: 600, lineHeight: 1.3, paddingTop: 2 },
  // `width` definida é obrigatória no container dos chips: sem ela o yoga
  // mede a linha como se nunca quebrasse e empurra a seção para a página
  // seguinte. `flex: 1` numa linha resolve para uma largura concreta.
  chips: { flex: 1, flexDirection: "row", flexWrap: "wrap" },
  chip: {
    fontSize: 7.3,
    lineHeight: 1.25,
    color: body,
    backgroundColor: chipBg,
    borderWidth: 0.5,
    borderColor: rule,
    borderRadius: 3,
    paddingVertical: 1.2,
    paddingHorizontal: 4,
    marginRight: 3,
    marginBottom: 2.5,
  },
  // Chip de uma tecnologia em foco: mesma caixa, borda e texto no verde
  // escuro — o olho acha "Laravel" e "Angular" sem ler a lista inteira.
  chipHit: { color: accent, borderColor: accent, fontWeight: 600, backgroundColor: "#f0fdf4" },

  columns: { flexDirection: "row" },
  columnWide: { flex: 3, paddingRight: 16 },
  columnNarrow: { flex: 2 },
  item: { marginBottom: 5 },
  compactCase: { fontSize: 8.5, color: body, lineHeight: 1.4 },
  itemTitle: { fontSize: 8.8, fontWeight: 600, lineHeight: 1.35 },
  itemMeta: { fontSize: 8, color: muted, lineHeight: 1.4, marginTop: 1 },
  itemLink: { fontSize: 7.5, lineHeight: 1.4, marginTop: 1 },

  footer: {
    position: "absolute",
    left: 42,
    right: 42,
    bottom: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  // Sem `lineHeight` aqui: num bloco absoluto ancorado no pé da página o
  // react-pdf resolve o valor relativo errado e o rodapé some inteiro.
  footerText: { fontSize: 7.5, color: faint },
  strong: { fontWeight: 600, color: ink },
});

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  // Título e primeiro item viajam juntos: sozinho, o título encalha no pé da
  // página com o conteúdo na seguinte. `minPresenceAhead` não resolve — na
  // View da seção (mais alta que a página) ele empurra a seção inteira, e no
  // título isolado não tem efeito.
  const [first, ...rest] = Children.toArray(children);
  return (
    <View style={styles.section}>
      <View wrap={false}>
        <Text style={styles.sectionTitle}>{title}</Text>
        {first}
      </View>
      {rest}
    </View>
  );
}

function ExperienceEntry({
  exp,
  locale,
  labels,
  nowYm,
  focus,
}: {
  exp: Experience;
  locale: Locale;
  labels: CvLabels;
  nowYm: string;
  focus: string[];
}) {
  const meta = [exp.location].filter(Boolean);
  return (
    <View style={styles.entry} wrap={false}>
      <View style={styles.entryHead}>
        <View style={styles.entryMain}>
          <Text style={styles.entryTitle}>
            {exp.role}
            <Text style={styles.entryCompany}>{`  ·  ${exp.company}`}</Text>
          </Text>
          <Text style={styles.entryMeta}>{meta.join(" · ")}</Text>
        </View>
        <View style={styles.entryAside}>
          <Text style={styles.entryPeriod}>
            {formatPeriod(exp.start, exp.end, locale, labels.current)}
          </Text>
          <Text style={styles.entryDuration}>
            {formatDuration(exp.start, exp.end, locale, nowYm)}
          </Text>
        </View>
      </View>
      {/* O que foi construído, não só com o quê: a descrição de cada sistema
          é o que dá substância à experiência num CV. */}
      {exp.projects.length > 0 ? (
        <View style={styles.bullets}>
          {exp.projects.map((project) => (
            <View key={project.name} style={styles.bullet}>
              <Text style={styles.bulletDot}>•</Text>
              <Text style={styles.bulletText}>
                <Text style={styles.strong}>{project.name}</Text>
                {` — ${project.description}`}
              </Text>
            </View>
          ))}
        </View>
      ) : null}
      {/* Stack numa linha corrida e discreta: os chips que o site usa custavam
          seis linhas por experiência e afogavam o resto; aqui a lista existe
          para a busca por palavra-chave do ATS, não para ser o destaque. */}
      {exp.stacks.length > 0 ? (
        <Text style={styles.stack}>
          <Text style={styles.stackLabel}>{`${labels.stack}: `}</Text>
          {exp.stacks.map((stack, index) => (
            <Text key={stack}>
              {index > 0 ? " · " : ""}
              <Text style={matchesFocus(stack, focus) ? styles.stackHit : undefined}>{stack}</Text>
            </Text>
          ))}
        </Text>
      ) : null}
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
        {/* Rodapé fixo em todas as páginas: quem recebe o PDF por e-mail
            encontra o caminho de volta à versão completa e atualizada. */}
        <View style={styles.footer} fixed>
          <Link style={[styles.footerText, styles.link]} src={data.sourceUrl}>
            {displayUrl(data.sourceUrl)}
          </Link>
          <Text
            style={styles.footerText}
            render={({ pageNumber, totalPages }) => `${pageNumber} / ${totalPages}`}
          />
        </View>
        <View style={styles.header}>
          <View style={styles.identity}>
            <Text style={styles.name}>{profile.name}</Text>
            {/* `headline` em vez de `role`: hoje as duas strings são
                idênticas ("Full Stack Engineer"), sem marcador de senioridade
                em lugar nenhum; o header do CV usa `headline` de propósito. */}
            <Text style={styles.role}>{profile.headline}</Text>
            <Text style={styles.availability}>{profile.availability}</Text>
          </View>
          <View style={styles.contact}>
            <Link style={[styles.contactLine, styles.link]} src={`mailto:${profile.email}`}>
              {profile.email}
            </Link>
            <Text style={styles.contactLine}>{profile.location}</Text>
            <Link style={[styles.contactLine, styles.link]} src={profile.github}>
              {displayUrl(profile.github)}
            </Link>
            <Link style={[styles.contactLine, styles.link]} src={profile.linkedin}>
              {displayUrl(profile.linkedin)}
            </Link>
            <Text style={styles.contactLine}>{profile.languages}</Text>
          </View>
        </View>
        <View style={styles.headerRule}>
          <View style={styles.headerRuleAccent} />
          <View style={styles.headerRuleLine} />
        </View>

        {data.summary ? <Text style={styles.summary}>{data.summary}</Text> : null}

        {/* Tecnologias da vaga, logo sob o resumo: é a primeira coisa que o
            recrutador confere contra os requisitos. */}
        {data.focus.length > 0 ? (
          <View style={styles.focusRow}>
            <Text style={styles.focusLabel}>{`${labels.coreStack}:`}</Text>
            {data.focus.map((term) => (
              <Text key={term} style={[styles.chip, styles.chipHit]}>
                {term}
              </Text>
            ))}
          </View>
        ) : null}

        {data.experiences ? (
          <Section title={labels.sections.experiences}>
            {data.experiences.map((exp) => (
              <ExperienceEntry
                key={`${exp.company}:${exp.start}`}
                exp={exp}
                locale={locale}
                labels={labels}
                nowYm={profile.asOfYm}
                focus={data.focus}
              />
            ))}
          </Section>
        ) : null}

        {data.skillCategories ? (
          <Section title={labels.sections.skills}>
            {/* Só os nomes: a prova de cada skill vive no site, e num CV ela
                custaria três páginas de texto que o recrutador não lê. */}
            {data.skillCategories.map((category) => (
              <View key={category.id} style={styles.skillRow} wrap={false}>
                <Text style={styles.skillTitle}>{category.title}</Text>
                <View style={styles.chips}>
                  {sortByFocus(category.skills, (skill) => skill.name, data.focus).map((skill) => (
                    <Text
                      key={skill.name}
                      style={
                        matchesFocus(skill.name, data.focus)
                          ? [styles.chip, styles.chipHit]
                          : styles.chip
                      }
                    >
                      {skill.name}
                    </Text>
                  ))}
                </View>
              </View>
            ))}
          </Section>
        ) : null}

        {data.certifications || data.education ? (
          <View style={styles.columns}>
            {data.certifications ? (
              <View style={data.education ? styles.columnWide : { flex: 1 }}>
                <Section title={labels.sections.certifications}>
                  {data.certifications.map((certification) => (
                    <View key={certificationKey(certification)} style={styles.item} wrap={false}>
                      <Text style={styles.itemTitle}>{certification.name}</Text>
                      <Text style={styles.itemMeta}>
                        {`${certification.issuer} · ${formatYearMonth(certification.issued, locale)}`}
                        {certification.expires
                          ? ` · ${labels.validUntil} ${formatYearMonth(certification.expires, locale)}`
                          : ""}
                      </Text>
                      {certification.credentialUrl ? (
                        <Link
                          style={[styles.itemLink, styles.link]}
                          src={certification.credentialUrl}
                        >
                          {displayUrl(certification.credentialUrl)}
                        </Link>
                      ) : null}
                    </View>
                  ))}
                </Section>
              </View>
            ) : null}
            {data.education ? (
              <View style={data.certifications ? styles.columnNarrow : { flex: 1 }}>
                <Section title={labels.sections.education}>
                  {data.education.map((item) => (
                    <View key={educationKey(item)} style={styles.item} wrap={false}>
                      <Text style={styles.itemTitle}>{item.degree}</Text>
                      <Text style={styles.itemMeta}>{`${item.institution} · ${item.period}`}</Text>
                    </View>
                  ))}
                </Section>
              </View>
            ) : null}
          </View>
        ) : null}

        {/* O case fecha o documento numa linha: a trajetória é o argumento;
            o link leva quem quiser ao estudo completo. */}
        {data.caseStudy ? (
          <Section title={labels.sections.caseStudy}>
            <Text style={styles.compactCase}>
              <Text style={styles.strong}>{data.caseStudy.title}</Text>
              {` — ${data.caseStudy.tagline} · `}
              <Link style={styles.link} src={data.caseStudy.url}>
                {displayUrl(data.caseStudy.url)}
              </Link>
            </Text>
          </Section>
        ) : null}
      </Page>
    </Document>
  );
}
