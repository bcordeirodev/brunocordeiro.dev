import { Font } from "@react-pdf/renderer";

export const CV_FONT_FAMILY = "Geist";

// Os mesmos TTFs que o pacote `geist` traz para o site, copiados para
// `public/fonts/cv` (licença OFL ao lado). Servidos como arquivo estático
// para o react-pdf buscá-los no browser na hora de gerar o documento.
const FILES: Array<{ file: string; fontWeight: 400 | 500 | 600 | 700 }> = [
  { file: "Geist-Regular.ttf", fontWeight: 400 },
  { file: "Geist-Medium.ttf", fontWeight: 500 },
  { file: "Geist-SemiBold.ttf", fontWeight: 600 },
  { file: "Geist-Bold.ttf", fontWeight: 700 },
];

let registered = false;

/**
 * Registra a família do CV uma única vez. O react-pdf não substitui uma
 * fonte já registrada (a primeira fonte de cada peso vence), então quem
 * renderiza fora do browser — testes, scripts — precisa chamar isto com o
 * diretório dos arquivos ANTES de importar o documento.
 */
export function registerCvFonts(base = "/fonts/cv"): void {
  if (registered) return;
  registered = true;
  Font.register({
    family: CV_FONT_FAMILY,
    fonts: FILES.map(({ file, fontWeight }) => ({ src: `${base}/${file}`, fontWeight })),
  });
  // Sem hifenização: num CV, quebrar "Kubernetes" ou o meio de uma URL de
  // credencial no fim da linha atrapalha a leitura (e o copy/paste do ATS).
  Font.registerHyphenationCallback((word) => [word]);
}
