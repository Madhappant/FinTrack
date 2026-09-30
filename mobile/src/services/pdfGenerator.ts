import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';
import { Transaction } from './offlineDb';

interface ReportPdfData {
  title: string;
  period: string;
  userName: string;
  businessName: string;
  summary: {
    totalIncome: number;
    totalExpense: number;
    netBalance: number;
  };
  transactions: Transaction[];
  catBreakdown: Array<{ name: string; amount: number; percentage: number }>;
}

export const generateFinancialPdf = async (data: ReportPdfData): Promise<void> => {
  const isProfit = data.summary.netBalance >= 0;
  const netColor = isProfit ? '#16A34A' : '#DC2626';

  const catRowsHtml = data.catBreakdown
    .map(
      (c) => `
      <tr>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0; font-size: 13px; color: #0F172A;">${c.name}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0; font-size: 13px; text-align: right; font-weight: 600; color: #0F172A;">₹${c.amount.toLocaleString('en-IN')}</td>
        <td style="padding: 10px 12px; border-bottom: 1px solid #E2E8F0; font-size: 13px; text-align: right; color: #64748B;">${c.percentage}%</td>
      </tr>
    `
    )
    .join('');

  const txRowsHtml = data.transactions
    .slice(0, 50)
    .map((t) => {
      const isInc = t.type === 'INCOME';
      const color = isInc ? '#16A34A' : '#DC2626';
      const sign = isInc ? '+₹' : '-₹';
      const formattedDate = new Date(t.date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

      return `
        <tr>
          <td style="padding: 8px 12px; border-bottom: 1px solid #F1F5F9; font-size: 12px; color: #64748B;">${formattedDate}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #F1F5F9; font-size: 12px; font-weight: 600; color: #0F172A;">${t.description}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #F1F5F9; font-size: 11px; color: #3B82F6;">${t.scope}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #F1F5F9; font-size: 11px; color: #64748B;">${t.paymentMethod}</td>
          <td style="padding: 8px 12px; border-bottom: 1px solid #F1F5F9; font-size: 12px; font-weight: 700; text-align: right; color: ${color};">${sign}${t.amount.toLocaleString('en-IN')}</td>
        </tr>
      `;
    })
    .join('');

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>${data.title}</title>
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 30px; color: #0F172A; background-color: #FFFFFF; }
          .header { display: flex; justify-content: space-between; align-items: flex-start; padding-bottom: 20px; border-bottom: 2px solid #0F172A; }
          .title { font-size: 24px; font-weight: 800; color: #0F172A; margin: 0; }
          .sub { font-size: 13px; color: #64748B; margin-top: 4px; }
          .meta { text-align: right; font-size: 12px; color: #64748B; }
          .kpi-container { display: flex; gap: 14px; margin: 24px 0; }
          .kpi-card { flex: 1; padding: 14px; border-radius: 12px; background-color: #F8FAFC; border: 1px solid #E2E8F0; }
          .kpi-label { font-size: 11px; text-transform: uppercase; font-weight: 700; color: #64748B; margin-bottom: 4px; }
          .kpi-value { font-size: 22px; font-weight: 800; margin: 0; }
          .section-title { font-size: 16px; font-weight: 700; margin-top: 24px; margin-bottom: 10px; color: #0F172A; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
          th { text-align: left; padding: 10px 12px; background-color: #F1F5F9; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #475569; }
          .footer { margin-top: 30px; padding-top: 14px; border-top: 1px solid #E2E8F0; font-size: 11px; color: #94A3B8; display: flex; justify-content: space-between; }
        </style>
      </head>
      <body>
        <div class="header">
          <div>
            <h1 class="title">FinTrack · Financial Statement</h1>
            <div class="sub">${data.businessName} (${data.userName})</div>
          </div>
          <div class="meta">
            <div><strong>Period:</strong> ${data.period}</div>
            <div><strong>Generated:</strong> ${new Date().toLocaleDateString('en-IN')}</div>
            <div><strong>Security:</strong> 100% Offline Air-Gapped Vault</div>
          </div>
        </div>

        <div class="kpi-container">
          <div class="kpi-card">
            <div class="kpi-label">Gross Revenue (Inflow)</div>
            <div class="kpi-value" style="color: #16A34A;">+₹${data.summary.totalIncome.toLocaleString('en-IN')}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Total Outflow (Expenses)</div>
            <div class="kpi-value" style="color: #DC2626;">-₹${data.summary.totalExpense.toLocaleString('en-IN')}</div>
          </div>
          <div class="kpi-card" style="background-color: #0F172A; color: #FFFFFF; border-color: #0F172A;">
            <div class="kpi-label" style="color: #94A3B8;">Net Yield / Balance</div>
            <div class="kpi-value" style="color: ${netColor};">₹${data.summary.netBalance.toLocaleString('en-IN')}</div>
          </div>
        </div>

        <div class="section-title">Category Spending Distribution</div>
        <table>
          <thead>
            <tr>
              <th>Category Tag</th>
              <th style="text-align: right;">Amount Spent</th>
              <th style="text-align: right;">Share %</th>
            </tr>
          </thead>
          <tbody>
            ${catRowsHtml || '<tr><td colspan="3" style="padding: 10px; color: #94A3B8; text-align: center;">No categorized expenses recorded in this period.</td></tr>'}
          </tbody>
        </table>

        <div class="section-title">Itemized Audit Log (Recent Transactions)</div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Description / Payee</th>
              <th>Scope</th>
              <th>Method</th>
              <th style="text-align: right;">Amount (₹)</th>
            </tr>
          </thead>
          <tbody>
            ${txRowsHtml || '<tr><td colspan="5" style="padding: 10px; color: #94A3B8; text-align: center;">Zero transactions recorded in this period.</td></tr>'}
          </tbody>
        </table>

        <div class="footer">
          <span>FinTrack Sovereign Ledger • Offline-First Personal & Business Accounting</span>
          <span>Confidential Financial Document</span>
        </div>
      </body>
    </html>
  `;

  if (Platform.OS === 'web') {
    // Print in browser
    await Print.printAsync({ html: htmlContent });
  } else {
    // Generate native PDF file on Android / iOS and open native share sheet
    const { uri } = await Print.printToFileAsync({ html: htmlContent });
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(uri, {
        UTI: '.pdf',
        mimeType: 'application/pdf',
        dialogTitle: `${data.title} - ${data.period}`,
      });
    }
  }
};
