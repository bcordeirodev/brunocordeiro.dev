/**
 * "Foco" do CV: tecnologias que o recrutador de UMA vaga procura. Digitadas
 * como texto livre separado por vírgula; o match é por substring, sem
 * distinguir caixa — "Laravel" pega "Laravel 12" e "Laravel 8.1", "Angular"
 * pega "Angular 22" e "Angular Material + Fuse".
 */
export function parseFocus(input: string): string[] {
  const seen = new Set<string>();
  return input
    .split(",")
    .map((term) => term.trim())
    .filter((term) => {
      const key = term.toLowerCase();
      if (!term || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function matchesFocus(text: string, focus: string[]): boolean {
  const haystack = text.toLowerCase();
  return focus.some((term) => haystack.includes(term.toLowerCase()));
}

/** Itens que batem com o foco vêm primeiro; a ordem relativa é preservada. */
export function sortByFocus<T>(items: T[], text: (item: T) => string, focus: string[]): T[] {
  if (focus.length === 0) return items;
  const hits = items.filter((item) => matchesFocus(text(item), focus));
  const rest = items.filter((item) => !matchesFocus(text(item), focus));
  return [...hits, ...rest];
}
