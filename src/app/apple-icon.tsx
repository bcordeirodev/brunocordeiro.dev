import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Full-bleed (sem cantos arredondados nem transparência): o iOS aplica a
// própria máscara; cantos transparentes virariam quadrados pretos.
export default async function AppleIcon() {
  const geistMonoBold = await readFile(join(process.cwd(), "src/assets/fonts/GeistMono-Bold.ttf"));
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#09090b",
        color: "#3fdd78",
        fontSize: 96,
        fontWeight: 700,
        fontFamily: "GeistMono",
      }}
    >
      b.
    </div>,
    {
      ...size,
      fonts: [{ name: "GeistMono", data: geistMonoBold, weight: 700, style: "normal" }],
    },
  );
}
