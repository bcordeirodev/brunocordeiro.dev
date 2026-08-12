// As fontes padrão do PDF (Helvetica & cia.) só carregam o WinAnsi, então
// símbolos técnicos do conteúdo saem como lixo no CV gerado — "PHP 5.6 → 8.2"
// virava "PHP 5.6 ' 8.2". Trocamos por equivalentes ASCII antes de renderizar;
// o site continua exibindo os originais.
const FALLBACKS: [RegExp, string][] = [
  [/→/g, "->"],
  [/←/g, "<-"],
  [/⇅/g, "<->"],
  [/≠/g, "!="],
  [/≥/g, ">="],
  [/≤/g, "<="],
  [/▸/g, "•"],
  [/✔/g, "•"],
];

export function toPdfText(value: string): string {
  return FALLBACKS.reduce(
    (text, [pattern, replacement]) => text.replace(pattern, replacement),
    value,
  );
}

/** Aplica {@link toPdfText} em toda string de uma estrutura, sem mutá-la. */
export function pdfSafe<T>(value: T): T {
  if (typeof value === "string") return toPdfText(value) as T;
  if (Array.isArray(value)) return value.map((item) => pdfSafe(item)) as T;
  if (value !== null && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [key, pdfSafe(item)]),
    ) as T;
  }
  return value;
}
