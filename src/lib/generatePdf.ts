import { jsPDF } from 'jspdf';

interface GeneratePdfOptions {
  title: string;
  content: string;
  fileName: string;
}

export function generatePdf({ title, content, fileName }: GeneratePdfOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'letter',
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let yPosition = margin;

  // Title
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  const titleLines = doc.splitTextToSize(title, maxWidth);
  doc.text(titleLines, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += titleLines.length * 8 + 10;

  // Content
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  const lines = content.split('\n');

  for (const line of lines) {
    // Check if we need a new page
    if (yPosition > pageHeight - margin) {
      doc.addPage();
      yPosition = margin;
    }

    if (line.trim() === '') {
      yPosition += 5;
      continue;
    }

    // Check for section headers (all caps lines)
    const isHeader = line.trim() === line.trim().toUpperCase() &&
                     line.trim().length > 3 &&
                     !line.includes('$') &&
                     !line.includes('RUT:');

    if (isHeader) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'normal');
    }

    // Handle signature lines
    if (line.includes('_________________________')) {
      yPosition += 15;
      doc.text(line, margin, yPosition);
      yPosition += 6;
      continue;
    }

    // Split long lines to fit page width
    const wrappedLines = doc.splitTextToSize(line, maxWidth);

    for (const wrappedLine of wrappedLines) {
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      doc.text(wrappedLine, margin, yPosition);
      yPosition += 6;
    }
  }

  // Footer with date
  const today = new Date().toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text(
    `Documento generado el ${today} - TramiteZoom`,
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Download the PDF
  doc.save(`${fileName}.pdf`);
}
