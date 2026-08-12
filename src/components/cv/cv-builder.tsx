"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/content";
import type { SiteContent } from "@/domain";
import { buildCvData } from "@/lib/cv/build-cv-data";
import type { CvLabels } from "@/lib/cv/labels";
import { defaultSelection, type CvSelection } from "@/lib/cv/selection";
import { Button } from "@/components/ui/button";
import { CvPreview } from "./cv-preview";
import { SelectionPanel } from "./selection-panel";

type DownloadStatus = "idle" | "generating" | "error";

export function CvBuilder({
  content,
  locale,
  labels,
}: {
  content: SiteContent;
  locale: Locale;
  labels: CvLabels;
}) {
  const [selection, setSelection] = useState<CvSelection>(() => defaultSelection(content));
  const [status, setStatus] = useState<DownloadStatus>("idle");
  const data = useMemo(() => buildCvData(content, selection, locale), [content, selection, locale]);

  async function handleDownload() {
    setStatus("generating");
    try {
      // a lib (~500 KB gzip) só chega ao browser aqui, no primeiro clique
      const [{ pdf }, { CvDocument }] = await Promise.all([
        import("@react-pdf/renderer"),
        import("./cv-document"),
      ]);
      const blob = await pdf(<CvDocument data={data} locale={locale} labels={labels} />).toBlob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = `bruno-cordeiro-cv-${locale}.pdf`;
      anchor.click();
      URL.revokeObjectURL(url);
      setStatus("idle");
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="flex flex-col gap-8 lg:flex-row lg:items-start">
      <aside className="flex w-full flex-col gap-6 lg:w-80 lg:shrink-0">
        <h2 className="font-mono text-xs tracking-[0.2em] text-muted uppercase">
          {labels.panelTitle}
        </h2>
        <SelectionPanel
          content={content}
          selection={selection}
          onChange={setSelection}
          labels={labels}
        />
        <div className="flex flex-col gap-2">
          <Button onClick={handleDownload} disabled={status === "generating"}>
            {status === "generating" ? labels.generating : labels.download}
          </Button>
          {status === "error" ? (
            <p role="alert" className="text-sm text-destructive">
              {labels.downloadError}
            </p>
          ) : null}
        </div>
      </aside>
      <div className="min-w-0 flex-1">
        <CvPreview data={data} locale={locale} labels={labels} />
      </div>
    </div>
  );
}
