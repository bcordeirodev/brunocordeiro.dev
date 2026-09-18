import type { Experience } from "@/domain";
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
  // Vínculo traduzido ("tempo integral", "freelance", "meio período").
  employmentTypes: Record<Experience["employmentType"], string>;
};
