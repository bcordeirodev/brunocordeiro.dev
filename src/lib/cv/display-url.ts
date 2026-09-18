/**
 * Texto curto de um link para impressão: sem esquema, sem `www.` e sem a
 * barra final. O href continua sendo a URL completa — só o que o leitor vê
 * encolhe ("scrum.org/user/1506558" em vez de "https://www.scrum.org/...").
 */
export function displayUrl(url: string): string {
  return url
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\/$/, "");
}
