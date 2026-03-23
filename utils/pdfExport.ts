import { jsPDF } from "jspdf";
import type { Marker, Gender } from "../types";

const STATUS_LABELS: Record<string, string> = {
  active: "Actif",
  monitoring: "En observation",
  resolved: "Résolu",
};

const PAIN_COLORS: Record<string, [number, number, number]> = {
  low: [34, 197, 94],
  mid: [234, 179, 8],
  high: [239, 68, 68],
};

function getPainColor(level: number): [number, number, number] {
  if (level <= 3) return PAIN_COLORS.low;
  if (level <= 6) return PAIN_COLORS.mid;
  return PAIN_COLORS.high;
}

export async function exportPDF(
  markers: Marker[],
  gender: Gender
): Promise<void> {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  const checkPageBreak = (needed: number) => {
    if (y + needed > doc.internal.pageSize.getHeight() - margin) {
      doc.addPage();
      y = margin;
    }
  };

  // Title
  doc.setFontSize(22);
  doc.setTextColor(30, 41, 59);
  doc.text("BodyLog — Rapport de session", margin, y);
  y += 10;

  doc.setFontSize(10);
  doc.setTextColor(100, 116, 139);
  doc.text(
    `Généré le ${new Date().toLocaleDateString()} | Modèle : ${gender === "male" ? "Masculin" : "Féminin"} | ${markers.length} point${markers.length > 1 ? "s" : ""}`,
    margin,
    y
  );
  y += 4;

  // Separator
  doc.setDrawColor(203, 213, 225);
  doc.line(margin, y, pageWidth - margin, y);
  y += 10;

  const totalEntries = markers.reduce((s, m) => s + m.entries.length, 0);
  doc.setFontSize(10);
  doc.setTextColor(71, 85, 105);
  doc.text(
    `${markers.length} point${markers.length > 1 ? "s" : ""} · ${totalEntries} entrée${totalEntries > 1 ? "s" : ""}`,
    margin,
    y
  );
  y += 10;

  // Markers
  for (const marker of markers) {
    checkPageBreak(30);

    // Marker header
    doc.setFontSize(14);
    doc.setTextColor(30, 41, 59);
    doc.text(marker.title, margin, y);

    const statusLabel = STATUS_LABELS[marker.status || "active"] || "Actif";
    const statusX = margin + doc.getTextWidth(marker.title) + 4;
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text(`[${statusLabel}]`, statusX, y);
    y += 5;

    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text(
      `Créé le ${new Date(marker.createdAt).toLocaleDateString()} · ${marker.entries.length} entrée${marker.entries.length > 1 ? "s" : ""}`,
      margin,
      y
    );
    y += 8;

    // Entries
    for (const entry of marker.entries) {
      checkPageBreak(40);

      // Date
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      doc.text(entry.date, margin + 2, y);
      y += 4;

      // Pain level
      if (entry.painLevel != null) {
        const color = getPainColor(entry.painLevel);
        doc.setTextColor(color[0], color[1], color[2]);
        doc.setFontSize(8);
        doc.text(`Douleur : ${entry.painLevel}/10`, margin + 2, y);
        y += 4;
      }

      // Tags
      if (entry.tags && entry.tags.length > 0) {
        doc.setFontSize(8);
        doc.setTextColor(96, 165, 250);
        doc.text(entry.tags.join(" · "), margin + 2, y);
        y += 4;
      }

      // Description
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const lines = doc.splitTextToSize(entry.description, contentWidth - 4);
      checkPageBreak(lines.length * 4 + 4);
      doc.text(lines, margin + 2, y);
      y += lines.length * 4 + 2;

      // Image
      if (entry.imageUrl) {
        checkPageBreak(50);
        try {
          const imgWidth = Math.min(contentWidth - 4, 80);
          doc.addImage(entry.imageUrl, "JPEG", margin + 2, y, imgWidth, imgWidth * 0.6);
          y += imgWidth * 0.6 + 4;
        } catch {
          doc.setFontSize(8);
          doc.setTextColor(148, 163, 184);
          doc.text("[Image non intégrable]", margin + 2, y);
          y += 5;
        }
      }

      y += 3;
    }

    // Separator between markers
    checkPageBreak(8);
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  }

  const date = new Date().toISOString().split("T")[0];
  doc.save(`bodylog_rapport_${date}.pdf`);
}
