// Shared export utilities — PDF (print/share), Excel, and CSV — built on
// libraries already in package.json (expo-print, expo-sharing,
// expo-file-system, xlsx). Any screen that needs "Export PDF / Excel / CSV /
// Print" should reuse these instead of re-implementing them.

import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';

/**
 * Renders an HTML table report and opens the native print dialog.
 * `html` should be a full <html>...</html> document.
 */
export async function printHtml(html) {
  await Print.printAsync({ html });
}

/**
 * Renders an HTML report to a PDF file and opens the OS share sheet so the
 * user can save it, email it, etc.
 */
export async function exportHtmlAsPdf(html, fileName = 'report') {
  const { uri } = await Print.printToFileAsync({ html, base64: false });
  const target = `${FileSystem.cacheDirectory}${fileName}.pdf`;
  await FileSystem.copyAsync({ from: uri, to: target });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(target, { mimeType: 'application/pdf', dialogTitle: fileName });
  }
  return target;
}

/**
 * rows: array of plain objects (one per row). Column headers are taken from
 * the keys of the first row, in insertion order.
 */
export async function exportRowsAsExcel(rows, fileName = 'report') {
  const sheet = XLSX.utils.json_to_sheet(rows || []);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');
  const base64 = XLSX.write(workbook, { type: 'base64', bookType: 'xlsx' });
  const target = `${FileSystem.cacheDirectory}${fileName}.xlsx`;
  await FileSystem.writeAsStringAsync(target, base64, { encoding: FileSystem.EncodingType.Base64 });
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(target, {
      mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      dialogTitle: fileName,
    });
  }
  return target;
}

/** rows: array of plain objects. Escapes commas/quotes/newlines per RFC 4180. */
export async function exportRowsAsCsv(rows, fileName = 'report') {
  const list = rows || [];
  if (list.length === 0) {
    const target = `${FileSystem.cacheDirectory}${fileName}.csv`;
    await FileSystem.writeAsStringAsync(target, '');
    return target;
  }
  const headers = Object.keys(list[0]);
  const escape = (v) => {
    const s = v === null || v === undefined ? '' : String(v);
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const lines = [headers.join(',')];
  list.forEach((row) => lines.push(headers.map((h) => escape(row[h])).join(',')));
  const csv = lines.join('\n');

  const target = `${FileSystem.cacheDirectory}${fileName}.csv`;
  await FileSystem.writeAsStringAsync(target, csv);
  if (await Sharing.isAvailableAsync()) {
    await Sharing.shareAsync(target, { mimeType: 'text/csv', dialogTitle: fileName });
  }
  return target;
}

/** Minimal, print-friendly HTML table builder shared by every report export. */
export function buildReportHtml({ title, subtitle, columns, rows, totalsRow }) {
  const th = columns.map((c) => `<th>${c.label}</th>`).join('');
  const trs = (rows || [])
    .map((row) => `<tr>${columns.map((c) => `<td>${row[c.key] ?? ''}</td>`).join('')}</tr>`)
    .join('');
  const totals = totalsRow
    ? `<tr class="totals">${columns.map((c) => `<td>${totalsRow[c.key] ?? ''}</td>`).join('')}</tr>`
    : '';
  return `
    <html>
      <head>
        <meta charset="utf-8" />
        <style>
          body { font-family: -apple-system, Roboto, sans-serif; padding: 24px; color: #222; }
          h1 { font-size: 20px; margin-bottom: 2px; }
          .subtitle { color: #666; font-size: 12px; margin-bottom: 16px; }
          table { width: 100%; border-collapse: collapse; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 6px 8px; text-align: left; }
          th { background: #f4f4f4; }
          .totals td { font-weight: bold; background: #fafafa; }
        </style>
      </head>
      <body>
        <h1>${title}</h1>
        ${subtitle ? `<div class="subtitle">${subtitle}</div>` : ''}
        <table>
          <thead><tr>${th}</tr></thead>
          <tbody>${trs}${totals}</tbody>
        </table>
      </body>
    </html>`;
}
