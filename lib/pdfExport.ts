import jsPDF from "jspdf";

import type { IdeaRecord } from "@/types";

export function exportReportToPDF(idea: IdeaRecord) {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("Startup Validation Report", 20, y);
  y += 12;

  doc.setFontSize(12);
  const ideaLines = doc.splitTextToSize(`Idea: ${idea.idea_text}`, 170);
  doc.text(ideaLines, 20, y);
  y += ideaLines.length * 6 + 4;
  doc.text(`Date: ${new Date(idea.created_at).toLocaleDateString()}`, 20, y);
  y += 14;

  const sections = [
    { title: "Problem", content: idea.problem },
    { title: "Target Customer", content: idea.customer },
    { title: "Market Opportunity", content: idea.market },
    { title: "Competitors", content: idea.competitors },
    { title: "Risk Level", content: idea.risk_level },
    { title: "Profitability Score", content: `${idea.profit_score}/10` },
    { title: "Profitability Rationale", content: idea.profit_reasoning ?? "" }
  ];

  sections.forEach(({ title, content }) => {
    if (y > 260) {
      doc.addPage();
      y = 20;
    }

    doc.setFont("helvetica", "bold");
    doc.text(title, 20, y);
    y += 7;
    doc.setFont("helvetica", "normal");

    const lines = doc.splitTextToSize(content, 170);
    doc.text(lines, 20, y);
    y += lines.length * 6 + 6;
  });

  doc.save(`startup-report-${idea.id}.pdf`);
}
