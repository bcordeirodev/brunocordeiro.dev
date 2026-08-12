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
};
