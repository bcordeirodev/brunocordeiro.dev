import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getContent, locales, type Locale } from "@/content";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// `generateImageMetadata` recebe params síncronos (Next 16) — usado aqui
// para localizar o alt da imagem por locale.
//
// Guarda contra `params` sem `locale`: com `generateImageMetadata`, o Next
// 16.3 compila este arquivo como um App Route module, e seu
// `generateStaticParams` sintetizado (que chama esta função) só herda
// params do próprio segmento — o `[locale]` ancestral não contribui
// generateStaticParams para route modules (só para páginas), então o Next
// chama esta função com `params: {}` durante a enumeração estática, e sem
// fallback isso derruba a rota com 500 em toda requisição. O `alt`
// localizado de verdade não é afetado: para as tags `<head>` e para a
// function `Image` abaixo, o Next resolve `params` a partir da requisição
// real.
function resolveLocale(locale: Locale | undefined): Locale {
  return locale && locales.includes(locale) ? locale : locales[0];
}

export function generateImageMetadata({ params }: { params: { locale: Locale } }) {
  const { profile } = getContent(resolveLocale(params.locale));
  return [{ id: "card", alt: `${profile.name} — ${profile.role}`, size, contentType }];
}

// Vendored from the `geist` package (SIL Open Font License) so satori can
// read raw font bytes — `next/font` isn't usable inside `ImageResponse`.
const FONTS_DIR = join(process.cwd(), "src/assets/fonts");

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { profile } = getContent(locale);

  const [geistBold, geistRegular, geistMonoBold] = await Promise.all([
    readFile(join(FONTS_DIR, "Geist-Bold.ttf")),
    readFile(join(FONTS_DIR, "Geist-Regular.ttf")),
    readFile(join(FONTS_DIR, "GeistMono-Bold.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 88px",
        backgroundColor: "#09090b",
      }}
    >
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ display: "flex", width: 72, height: 8, backgroundColor: "#3fdd78" }} />
        <div
          style={{
            display: "flex",
            marginTop: 48,
            fontSize: 76,
            fontWeight: 700,
            fontFamily: "Geist",
            color: "#fafafa",
          }}
        >
          {profile.name}
        </div>
        <div
          style={{
            display: "flex",
            marginTop: 16,
            fontSize: 40,
            fontFamily: "Geist",
            color: "#a1a1aa",
          }}
        >
          {profile.role}
        </div>
        <div style={{ display: "flex", marginTop: 44, gap: 14 }}>
          {profile.stackHighlights.map((item) => (
            <div
              key={item}
              style={{
                display: "flex",
                padding: "10px 22px",
                borderRadius: 999,
                border: "2px solid #27272a",
                color: "#d4d4d8",
                fontSize: 26,
                fontWeight: 700,
                fontFamily: "GeistMono",
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            fontSize: 30,
            fontWeight: 700,
            fontFamily: "GeistMono",
            color: "#3fdd78",
          }}
        >
          brunocordeiro.dev
        </div>
        <div style={{ display: "flex", fontSize: 28, fontFamily: "Geist", color: "#71717a" }}>
          {profile.location}
        </div>
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistBold, weight: 700, style: "normal" },
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
        { name: "GeistMono", data: geistMonoBold, weight: 700, style: "normal" },
      ],
    },
  );
}
