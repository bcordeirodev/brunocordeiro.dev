"use client";

import { useEffect } from "react";
import { useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale();
  const isPt = locale === "pt";

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex max-w-4xl flex-col items-start gap-4 px-6 py-24">
      <h1 className="text-2xl font-bold">{isPt ? "Algo deu errado" : "Something went wrong"}</h1>
      <div className="flex items-center gap-6">
        <button
          type="button"
          onClick={() => reset()}
          className="text-accent underline underline-offset-4"
        >
          {isPt ? "tentar novamente" : "try again"}
        </button>
        <Link href="/" className="underline underline-offset-4">
          {isPt ? "voltar ao início" : "back to home"}
        </Link>
      </div>
    </main>
  );
}
