import type { CvSectionId } from "./selection";

export type CvLabels = {
  sections: Record<CvSectionId, string>;
  panelTitle: string;
  customize: string;
  close: string;
  selectAll: string;
  clearAll: string;
  download: string;
  generating: string;
  downloadError: string;
  current: string;
  validUntil: string;
  caseStudyCta: string;
  // Rótulo da linha de tecnologias de cada experiência ("Stack").
  stack: string;
  // Ajustes para uma vaga específica (painel) e o rótulo da linha de foco
  // que o PDF/preview imprimem sob o resumo.
  targeted: string;
  focus: string;
  focusPlaceholder: string;
  focusHint: string;
  coreStack: string;
  summaryOverride: string;
  summaryOverrideHint: string;
};
