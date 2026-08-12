"use client";

import { useMemo, useState } from "react";
import type { Locale } from "@/content";
import type { SiteContent } from "@/domain";
import { buildCvData } from "@/lib/cv/build-cv-data";
import type { CvLabels } from "@/lib/cv/labels";
import { defaultSelection, type CvSelection } from "@/lib/cv/selection";
import { Button } from "@/components/ui/button";
import { CvPreview } from "./cv-preview";
import { SelectionDialog } from "./selection-dialog";
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
    <div className="flex flex-col gap-6">
      {/* `top-13.25` (53px) acompanha a altura do SiteHeader, que também é
          sticky — as duas ações ficam sempre visíveis enquanto o preview rola.
          O `-mx-6 px-6` estende o fundo até as bordas do padding da página. */}
      <div className="sticky top-13.25 z-30 -mx-6 flex flex-wrap items-center gap-3 border-b border-border/50 bg-background/90 px-6 py-3 backdrop-blur">
        <SelectionDialog
          triggerLabel={labels.customize}
          titleLabel={labels.panelTitle}
          closeLabel={labels.close}
        >
          <SelectionPanel
            content={content}
            selection={selection}
            onChange={setSelection}
            labels={labels}
          />
        </SelectionDialog>
        <Button onClick={handleDownload} disabled={status === "generating"}>
          {status === "generating" ? labels.generating : labels.download}
        </Button>
        {status === "error" ? (
          <p role="alert" className="text-sm text-destructive">
            {labels.downloadError}
          </p>
        ) : null}
      </div>
      <CvPreview data={data} locale={locale} labels={labels} />
    </div>
  );
}
