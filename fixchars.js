const fs = require('fs');

// Fix remaining mojibake/encoding issues in attempt-detail.html
let html = fs.readFileSync('src/app/admin/attempt-detail/attempt-detail.html', 'utf8');

// Fix specific broken sequences from the previous bad PowerShell regex
const replacements = [
  // cl -> cle replacements that broke real words
  ['cl\u00e9\u00e9', 'cle'],     // double accent
  ['configur\u00e9e', 'configuree_placeholder'],  // protect real words
  ['cl\u00e9 non', 'cle non'],   // "cle non configuree"
  ['configur\u00e9e_placeholder', 'configuree'],
  // title attributes with broken chars
  ['suppl\u00e9mentaire', 'supplementaire_ok'],
  ['supplementaire_ok', 'suppl\u00e9mentaire'],
];

// Actually, let's just scan for non-standard chars that look like mojibake
// Standard French chars that are fine: é è ê ë à â ä ù û ü î ï ô ö ç É È Ê etc.
// Mojibake chars from the bad replacements: things like \uFFFD

html = html.replace(/\ufffd/g, 'e');

// Fix broken title attributes
html = html.replace(/suppl\u00e9mentaire/g, 'suppl\u00e9mentaire');  // keep as-is

// Fix ArrÇter -> Arrêter
html = html.replace(/Arr[^\s"<>]{1,3}ter/g, (match) => {
  if (match.includes('e') || match.includes('\u00ea')) return 'Arr\u00eater';
  return match;
});

fs.writeFileSync('src/app/admin/attempt-detail/attempt-detail.html', html, 'utf8');

// Now fix PDF service to normalize French chars
let pdf = fs.readFileSync('src/app/shared/pdf-report.service.ts', 'utf8');

const normalizeMethod = `
  /** jsPDF's built-in Helvetica doesn't support accented chars — normalize to ASCII for PDF output. */
  private normalize(text: string): string {
    return text
      .replace(/[\u00e0\u00e2\u00e4]/g, 'a')
      .replace(/[\u00e9\u00e8\u00ea\u00eb]/g, 'e')
      .replace(/[\u00ee\u00ef]/g, 'i')
      .replace(/[\u00f4\u00f6]/g, 'o')
      .replace(/[\u00f9\u00fb\u00fc]/g, 'u')
      .replace(/\u00e7/g, 'c')
      .replace(/[\u00c0\u00c2\u00c4]/g, 'A')
      .replace(/[\u00c9\u00c8\u00ca\u00cb]/g, 'E')
      .replace(/[\u00ce\u00cf]/g, 'I')
      .replace(/[\u00d4\u00d6]/g, 'O')
      .replace(/[\u00d9\u00db\u00dc]/g, 'U')
      .replace(/\u00c7/g, 'C')
      .replace(/\u2019/g, "'")   // curly apostrophe
      .replace(/\u2014/g, '-')   // em dash
      .replace(/\u2013/g, '-')   // en dash
      .replace(/\u2026/g, '...') // ellipsis
      .replace(/\u00bb/g, '>>')  // guillemet
      .replace(/\u00ab/g, '<<'); // guillemet
  }
`;

// Wrap all docPdf.text() calls to use normalize()
// Replace: docPdf.text(`...`, x, y) -> docPdf.text(this.normalize(`...`), x, y)
// Replace: docPdf.text(variable, x, y) -> docPdf.text(this.normalize(variable), x, y)
pdf = pdf.replace(/docPdf\.text\((`[^`]+`),/g, (match, str) => `docPdf.text(this.normalize(${str}),`);
pdf = pdf.replace(/docPdf\.text\((\w+),/g, (match, varName) => {
  if (varName === 'split' || varName === 'this') return match;
  return `docPdf.text(this.normalize(${varName}),`;
});
pdf = pdf.replace(/docPdf\.text\(split,/g, `docPdf.text(split.map(l => this.normalize(l)),`);

// Insert normalize method before the closing brace of the class
pdf = pdf.replace(/}\s*$/, normalizeMethod + '\n}\n');

fs.writeFileSync('src/app/shared/pdf-report.service.ts', pdf, 'utf8');
console.log('Done fixing chars!');
