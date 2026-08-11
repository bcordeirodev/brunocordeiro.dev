import { getLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";

export default async function NotFound() {
  const locale = await getLocale();
  const isPt = locale === "pt";
  return (
    <main className="mx-auto flex max-w-4xl flex-col items-start gap-4 px-6 py-24">
      <h1 className="text-2xl font-bold">{isPt ? "Página não encontrada" : "Page not found"}</h1>
      <p className="text-muted">
        {isPt
          ? "O conteúdo que você procura não existe ou foi movido."
          : "The content you're looking for doesn't exist or has moved."}
      </p>
      <Link href="/" className="text-accent underline underline-offset-4">
        {isPt ? "voltar ao início" : "back to home"}
      </Link>
    </main>
  );
}
