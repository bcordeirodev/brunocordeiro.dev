import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { getContent, type Locale } from "@/content";

export const alt = "Bruno Cordeiro";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Vendored from the `geist` package (SIL Open Font License) so satori can
// read raw font bytes — `next/font` isn't usable inside `ImageResponse`.
const FONTS_DIR = join(process.cwd(), "src/assets/fonts");

export default async function Image({ params }: { params: Promise<{ locale: Locale }> }) {
  const { locale } = await params;
  const { profile } = getContent(locale);

  const [geistBold, geistRegular] = await Promise.all([
    readFile(join(FONTS_DIR, "Geist-Bold.ttf")),
    readFile(join(FONTS_DIR, "Geist-Regular.ttf")),
  ]);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "88px",
        backgroundColor: "#09090b",
      }}
    >
      <div style={{ display: "flex", width: 72, height: 8, backgroundColor: "#3fdd78" }} />
      <div
        style={{
          display: "flex",
          marginTop: 44,
          fontSize: 72,
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
          marginTop: 24,
          maxWidth: 920,
          fontSize: 32,
          fontFamily: "Geist",
          color: "#a1a1aa",
        }}
      >
        {profile.headline}
      </div>
    </div>,
    {
      ...size,
      fonts: [
        { name: "Geist", data: geistBold, weight: 700, style: "normal" },
        { name: "Geist", data: geistRegular, weight: 400, style: "normal" },
      ],
    },
  );
}
