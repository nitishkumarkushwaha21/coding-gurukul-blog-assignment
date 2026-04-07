"use client";

import { FileDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import { exportReportToPDF } from "@/lib/pdfExport";
import type { IdeaRecord } from "@/types";

export function ExportPDFButton({ idea }: { idea: IdeaRecord }) {
  return (
    <Button onClick={() => exportReportToPDF(idea)} variant="outline">
      <FileDown className="h-4 w-4" />
      Export PDF
    </Button>
  );
}
