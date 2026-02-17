import type { VisitorRecord, VehicleRecord } from '../storage/types';
import { PDF_LABELS } from './templates';

export async function exportToPdf(visitors: VisitorRecord[], vehicles: VehicleRecord[]): Promise<void> {
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    throw new Error('Could not open print window');
  }

  const today = new Date().toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const accessPoint = visitors[0]?.accessPoint || vehicles[0]?.accessPoint || 'N/A';
  const supervisor = visitors[0]?.supervisorName || vehicles[0]?.supervisorName || 'N/A';

  const frLabels = PDF_LABELS.fr;
  const arLabels = PDF_LABELS.ar;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>ATHENA SURVEILLANCE - Export PDF</title>
      <style>
        @page {
          size: A4 landscape;
          margin: 15mm;
        }
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 10pt;
          line-height: 1.4;
        }
        .header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
          padding-bottom: 15px;
          border-bottom: 3px solid oklch(0.25 0.05 240);
        }
        .header-left {
          display: flex;
          align-items: center;
          gap: 15px;
        }
        .logo {
          width: 60px;
          height: 60px;
        }
        .header-title {
          font-size: 18pt;
          font-weight: bold;
          color: oklch(0.25 0.05 240);
        }
        .header-info {
          text-align: right;
          font-size: 10pt;
        }
        .header-info div {
          margin-bottom: 3px;
        }
        .section-title {
          font-size: 14pt;
          font-weight: bold;
          margin: 20px 0 10px 0;
          padding: 8px;
          background: oklch(0.25 0.05 240);
          color: white;
          text-align: center;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 20px;
          font-size: 9pt;
        }
        th, td {
          border: 1px solid #ccc;
          padding: 6px 4px;
          text-align: left;
        }
        th {
          background: oklch(0.9 0 0);
          font-weight: bold;
          font-size: 8pt;
        }
        .bilingual-header {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .ar-text {
          direction: rtl;
          font-size: 8pt;
          color: oklch(0.4 0 0);
        }
        .no-records {
          text-align: center;
          padding: 20px;
          color: oklch(0.5 0 0);
          font-style: italic;
        }
        @media print {
          body {
            print-color-adjust: exact;
            -webkit-print-color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="header-left">
          <img src="/assets/generated/athena-logo.dim_512x512.png" alt="Logo" class="logo" />
          <div class="header-title">ATHENA SURVEILLANCE</div>
        </div>
        <div class="header-info">
          <div><strong>${frLabels.date} / ${arLabels.date}:</strong> ${today}</div>
          <div><strong>${frLabels.accessPoint} / ${arLabels.accessPoint}:</strong> ${accessPoint}</div>
          <div><strong>${frLabels.supervisor} / ${arLabels.supervisor}:</strong> ${supervisor}</div>
        </div>
      </div>

      ${visitors.length > 0 ? `
        <div class="section-title">${frLabels.visitorsSection} / ${arLabels.visitorsSection}</div>
        <table>
          <thead>
            <tr>
              <th>
                <div class="bilingual-header">
                  <div>${frLabels.visitorName}</div>
                  <div class="ar-text">${arLabels.visitorName}</div>
                </div>
              </th>
              <th>
                <div class="bilingual-header">
                  <div>${frLabels.personVisited}</div>
                  <div class="ar-text">${arLabels.personVisited}</div>
                </div>
              </th>
              <th>
                <div class="bilingual-header">
                  <div>${frLabels.company}</div>
                  <div class="ar-text">${arLabels.company}</div>
                </div>
              </th>
              <th>
                <div class="bilingual-header">
                  <div>${frLabels.entryTime}</div>
                  <div class="ar-text">${arLabels.entryTime}</div>
                </div>
              </th>
              <th>
                <div class="bilingual-header">
                  <div>${frLabels.exitTime}</div>
                  <div class="ar-text">${arLabels.exitTime}</div>
                </div>
              </th>
              <th>
                <div class="bilingual-header">
                  <div>${frLabels.destination}</div>
                  <div class="ar-text">${arLabels.destination}</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            ${visitors.map(v => `
              <tr>
                <td>${v.visitorName}</td>
                <td>${v.personVisited}</td>
                <td>${v.company || '-'}</td>
                <td>${v.entryTime}</td>
                <td>${v.exitTime || '-'}</td>
                <td>${v.destination || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}

      ${vehicles.length > 0 ? `
        <div class="section-title">${frLabels.vehiclesSection} / ${arLabels.vehiclesSection}</div>
        <table>
          <thead>
            <tr>
              <th>
                <div class="bilingual-header">
                  <div>${frLabels.vehicleType}</div>
                  <div class="ar-text">${arLabels.vehicleType}</div>
                </div>
              </th>
              <th>
                <div class="bilingual-header">
                  <div>${frLabels.driverName}</div>
                  <div class="ar-text">${arLabels.driverName}</div>
                </div>
              </th>
              <th>
                <div class="bilingual-header">
                  <div>${frLabels.company}</div>
                  <div class="ar-text">${arLabels.company}</div>
                </div>
              </th>
              <th>
                <div class="bilingual-header">
                  <div>${frLabels.entryTime}</div>
                  <div class="ar-text">${arLabels.entryTime}</div>
                </div>
              </th>
              <th>
                <div class="bilingual-header">
                  <div>${frLabels.exitTime}</div>
                  <div class="ar-text">${arLabels.exitTime}</div>
                </div>
              </th>
              <th>
                <div class="bilingual-header">
                  <div>${frLabels.destination}</div>
                  <div class="ar-text">${arLabels.destination}</div>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            ${vehicles.map(v => `
              <tr>
                <td>${v.vehicleType}</td>
                <td>${v.driverName}</td>
                <td>${v.company || '-'}</td>
                <td>${v.entryTime}</td>
                <td>${v.exitTime || '-'}</td>
                <td>${v.destination || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      ` : ''}

      ${visitors.length === 0 && vehicles.length === 0 ? `
        <div class="no-records">Aucun enregistrement / لا توجد سجلات</div>
      ` : ''}

      <script>
        window.onload = function() {
          setTimeout(function() {
            window.print();
          }, 500);
        };
      </script>
    </body>
    </html>
  `;

  printWindow.document.write(html);
  printWindow.document.close();
}
