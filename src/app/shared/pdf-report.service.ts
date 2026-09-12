import { Injectable } from '@angular/core';
import jsPDF from 'jspdf';
import { Attempt, VehicleStateExtraction } from './attempt.model';

interface ComparisonResult {
  summary: string;
  damageDetected: boolean;
  details: string;
}

@Injectable({ providedIn: 'root' })
export class PdfReportService {
  buildStateReport(attempt: Attempt, label: 'Départ' | 'Arrivée', state: VehicleStateExtraction): File {
    const docPdf = new jsPDF();
    this.drawHeader(docPdf, `Rapport d'état des lieux — ${label}`);

    let y = 42;
    y = this.line(docPdf, y, 'Client', attempt.customerName);
    y = this.line(docPdf, y, 'Téléphone', attempt.customerPhone);
    y = this.line(docPdf, y, 'Véhicule', attempt.category);
    y = this.line(docPdf, y, 'Période', `${attempt.startDate} → ${attempt.endDate}`);
    y += 6;

    docPdf.setFont('helvetica', 'bold');
    docPdf.setFontSize(12);
    docPdf.text(this.normalize(`Constat au ${label.toLowerCase()}`), 14, y);
    y += 8;

    y = this.line(docPdf, y, 'Plaque d\'immatriculation', state.plateNumber || 'Non déterminé');
    y = this.line(docPdf, y, 'État du véhicule', state.vehicleCondition || 'Non déterminé');
    y = this.line(docPdf, y, 'Niveau de carburant', state.fuelLevel || 'Non déterminé');
    y = this.line(docPdf, y, 'Kilométrage', state.mileage || 'Non déterminé');
    if (state.notes) {
      y = this.paragraph(docPdf, y, 'Remarques', state.notes);
    }

    this.drawFooter(docPdf);
    const blob = docPdf.output('blob');
    return new File([blob], `rapport-${label.toLowerCase()}-${attempt.id ?? 'attempt'}.pdf`, {
      type: 'application/pdf',
    });
  }

  buildComparisonReport(
    attempt: Attempt,
    departure: VehicleStateExtraction,
    arrival: VehicleStateExtraction,
    comparison: ComparisonResult,
  ): File {
    const docPdf = new jsPDF();
    this.drawHeader(docPdf, 'Rapport de comparaison — Départ / Arrivée');

    let y = 42;
    y = this.line(docPdf, y, 'Client', attempt.customerName);
    y = this.line(docPdf, y, 'Téléphone', attempt.customerPhone);
    y = this.line(docPdf, y, 'Véhicule', attempt.category);
    y = this.line(docPdf, y, 'Période', `${attempt.startDate} → ${attempt.endDate}`);
    y += 6;

    docPdf.setFont('helvetica', 'bold');
    docPdf.setFontSize(12);
    docPdf.text('Comparatif', 14, y);
    y += 8;
    docPdf.setFont('helvetica', 'normal');
    docPdf.setFontSize(10);

    const rows: [string, string, string][] = [
      ['Plaque', departure.plateNumber || '—', arrival.plateNumber || '—'],
      ['État', departure.vehicleCondition || '—', arrival.vehicleCondition || '—'],
      ['Carburant', departure.fuelLevel || '—', arrival.fuelLevel || '—'],
      ['Kilométrage', departure.mileage || '—', arrival.mileage || '—'],
    ];
    docPdf.setFont('helvetica', 'bold');
    docPdf.text('Champ', 14, y);
    docPdf.text('Départ', 80, y);
    docPdf.text('Arrivée', 145, y);
    y += 6;
    docPdf.setFont('helvetica', 'normal');
    for (const [field, dep, arr] of rows) {
      docPdf.text(this.normalize(field), 14, y);
      docPdf.text(this.normalize(dep), 80, y, { maxWidth: 60 });
      docPdf.text(this.normalize(arr), 145, y, { maxWidth: 55 });
      y += 8;
    }

    y += 4;
    docPdf.setFont('helvetica', 'bold');
    docPdf.setFontSize(12);
    docPdf.text(comparison.damageDetected ? '⚠ Différence détectée' : '✓ Aucun problème détecté', 14, y);
    y += 8;
    y = this.paragraph(docPdf, y, 'Résumé', comparison.summary);
    y = this.paragraph(docPdf, y, 'Détails', comparison.details);

    this.drawFooter(docPdf);
    const blob = docPdf.output('blob');
    return new File([blob], `rapport-comparaison-${attempt.id ?? 'attempt'}.pdf`, { type: 'application/pdf' });
  }

  private drawHeader(docPdf: jsPDF, title: string): void {
    docPdf.setFont('helvetica', 'bold');
    docPdf.setFontSize(16);
    docPdf.setTextColor(90, 62, 40);
    docPdf.text('Dada Rent Car', 14, 18);
    docPdf.setFontSize(12);
    docPdf.setTextColor(30, 30, 30);
    docPdf.text(this.normalize(title), 14, 28);
    docPdf.setDrawColor(90, 62, 40);
    docPdf.line(14, 32, 196, 32);
  }

  private drawFooter(docPdf: jsPDF): void {
    const generated = new Date().toLocaleString('fr-FR');
    docPdf.setFont('helvetica', 'italic');
    docPdf.setFontSize(8);
    docPdf.setTextColor(120, 120, 120);
    docPdf.text(this.normalize(`Généré automatiquement le ${generated} — Dada Rent Car, Aouina, Tunis`), 14, 285);
  }

  private line(docPdf: jsPDF, y: number, label: string, value: string): number {
    docPdf.setFont('helvetica', 'bold');
    docPdf.setFontSize(10);
    docPdf.setTextColor(30, 30, 30);
    docPdf.text(this.normalize(`${label} :`), 14, y);
    docPdf.setFont('helvetica', 'normal');
    docPdf.text(this.normalize(value), 70, y, { maxWidth: 126 });
    return y + 7;
  }

  private paragraph(docPdf: jsPDF, y: number, label: string, text: string): number {
    docPdf.setFont('helvetica', 'bold');
    docPdf.setFontSize(10);
    docPdf.text(this.normalize(`${label} :`), 14, y);
    y += 6;
    docPdf.setFont('helvetica', 'normal');
    const split = docPdf.splitTextToSize(text, 182);
    docPdf.text(split.map(l => this.normalize(l)), 14, y);
    return y + split.length * 5 + 4;
  }

  /** jsPDF's built-in Helvetica doesn't support accented chars — normalize to ASCII for PDF output. */
  private normalize(text: string): string {
    return text
      .replace(/[àâä]/g, 'a')
      .replace(/[éèêë]/g, 'e')
      .replace(/[îï]/g, 'i')
      .replace(/[ôö]/g, 'o')
      .replace(/[ùûü]/g, 'u')
      .replace(/ç/g, 'c')
      .replace(/[ÀÂÄ]/g, 'A')
      .replace(/[ÉÈÊË]/g, 'E')
      .replace(/[ÎÏ]/g, 'I')
      .replace(/[ÔÖ]/g, 'O')
      .replace(/[ÙÛÜ]/g, 'U')
      .replace(/Ç/g, 'C')
      .replace(/’/g, "'")   // curly apostrophe
      .replace(/—/g, '-')   // em dash
      .replace(/–/g, '-')   // en dash
      .replace(/…/g, '...') // ellipsis
      .replace(/»/g, '>>')  // guillemet
      .replace(/«/g, '<<'); // guillemet
  }

}
