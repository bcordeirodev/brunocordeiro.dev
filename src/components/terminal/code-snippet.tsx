import { codeToHtml } from "shiki";

export async function CodeSnippet({ code, lang }: { code: string; lang: string }) {
  const html = await codeToHtml(code, { lang, theme: "vesper" });
  return (
    <div
      className="overflow-x-auto rounded-lg border border-border text-sm [&_pre]:p-4"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
