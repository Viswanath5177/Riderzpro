import type { GstInvoice } from "./types";

export function renderInvoiceHtml(inv: GstInvoice): string {
  const inr = (n: number) => "₹" + n.toLocaleString("en-IN");

  const taxRows = inv.taxBreakdown.isInterstate
    ? `
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Integrated GST (18% IGST):</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #111827;">${inr(inv.taxBreakdown.igst)}</td>
      </tr>
    `
    : `
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">Central GST (9% CGST):</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #111827;">${inr(inv.taxBreakdown.cgst)}</td>
      </tr>
      <tr>
        <td style="padding: 6px 0; color: #6b7280;">State GST (9% SGST):</td>
        <td style="padding: 6px 0; text-align: right; font-weight: 700; color: #111827;">${inr(inv.taxBreakdown.sgst)}</td>
      </tr>
    `;

  const itemsHtml = inv.items.map((it, idx) => `
    <tr style="border-bottom: 1px solid #f3f4f6;">
      <td style="padding: 10px 8px; color: #9ca3af; font-family: monospace;">${idx + 1}</td>
      <td style="padding: 10px 8px;">
        <strong style="color: #111827;">${it.description}</strong>
        ${it.subtext ? `<br><span style="font-size: 11px; color: #6b7280;">${it.subtext}</span>` : ""}
      </td>
      <td style="padding: 10px 8px; font-family: monospace; color: #4b5563;">${it.hsnSac}</td>
      <td style="padding: 10px 8px; text-align: center; font-weight: 700;">${it.quantity}</td>
      <td style="padding: 10px 8px; text-align: right; font-family: monospace;">${inr(it.taxableAmount)}</td>
      <td style="padding: 10px 8px; text-align: right; font-family: monospace; color: #4b5563;">${it.gstRate}%</td>
      <td style="padding: 10px 8px; text-align: right; font-family: monospace; font-weight: 700; color: #111827;">${inr(it.total)}</td>
    </tr>
  `).join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice — ${inv.invoiceNumber}</title>
  <style>
    @page { size: A4; margin: 15mm; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #1f2937;
      background: #f9fafb;
      margin: 0;
      padding: 24px;
      font-size: 12px;
      line-height: 1.5;
    }
    .invoice-card {
      max-width: 820px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e5e7eb;
      border-radius: 16px;
      box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
      padding: 36px 40px;
    }
    .print-bar {
      max-width: 820px;
      margin: 0 auto 16px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 8px 16px;
      background: #111827;
      color: #ffffff;
      border: none;
      border-radius: 8px;
      font-weight: 700;
      font-size: 12px;
      cursor: pointer;
      text-decoration: none;
    }
    .btn:hover { background: #000000; }
    .badge {
      display: inline-block;
      padding: 3px 10px;
      border-radius: 9999px;
      font-size: 10px;
      font-weight: 800;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .badge-paid { background: #d1fae5; color: #065f46; }
    .badge-cod { background: #fef3c7; color: #92400e; }
    .badge-interstate { background: #e0e7ff; color: #3730a3; }
    table { width: 100%; border-collapse: collapse; }
    @media print {
      body { background: #ffffff; padding: 0; }
      .print-bar { display: none; }
      .invoice-card { border: none; box-shadow: none; padding: 0; }
    }
  </style>
</head>
<body>
  <div class="print-bar">
    <a href="javascript:window.history.back()" style="color: #6b7280; text-decoration: none; font-size: 12px;">&larr; Back to Dashboard</a>
    <div>
      <button class="btn" onclick="window.print()">Print / Save as PDF</button>
    </div>
  </div>

  <div class="invoice-card" id="invoice">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #E31E24; padding-bottom: 20px;">
      <div>
        <div style="font-size: 24px; font-weight: 900; color: #E31E24; letter-spacing: -0.5px;">RIDERZPRO</div>
        <div style="font-size: 13px; font-weight: 800; color: #111827; margin-top: 2px;">${inv.seller.legalName}</div>
        <div style="font-size: 11px; color: #4b5563; margin-top: 4px;">
          ${inv.seller.address}<br>
          ${inv.seller.city}, ${inv.seller.state} - ${inv.seller.pincode}, India<br>
          Phone: ${inv.seller.phone} | Email: ${inv.seller.email}
        </div>
        <div style="margin-top: 6px; font-family: monospace; font-size: 11px; color: #111827;">
          <strong>GSTIN:</strong> ${inv.seller.gstin} | <strong>PAN:</strong> ${inv.seller.pan}<br>
          <strong>State:</strong> ${inv.seller.stateCode} - ${inv.seller.state} | <strong>CIN:</strong> ${inv.seller.cin}
        </div>
      </div>
      <div style="text-align: right;">
        <span class="badge ${inv.taxBreakdown.isInterstate ? 'badge-interstate' : 'badge-paid'}" style="margin-bottom: 6px;">
          ${inv.taxBreakdown.isInterstate ? 'INTER-STATE SUPPLY (IGST)' : 'INTRA-STATE SUPPLY (CGST+SGST)'}
        </span>
        <div style="font-size: 20px; font-weight: 900; color: #111827; margin-top: 4px;">TAX INVOICE</div>
        <div style="font-size: 11px; color: #4b5563;">Rule 46 CGST Rules, 2017</div>
        <div style="margin-top: 10px; font-size: 11px;">
          <strong>Invoice No:</strong> <span style="font-family: monospace; font-weight: 700;">${inv.invoiceNumber}</span><br>
          <strong>Date:</strong> ${inv.invoiceDate}<br>
          <strong>Order ID:</strong> <span style="font-family: monospace;">#${inv.orderId}</span><br>
          <strong>Waybill:</strong> <span style="font-family: monospace;">${inv.waybillNumber}</span>
        </div>
      </div>
    </div>

    <!-- Parties -->
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px; padding: 20px 0; border-bottom: 1px solid #e5e7eb;">
      <div>
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.5px;">Billed To (Buyer)</div>
        <div style="font-size: 14px; font-weight: 700; color: #111827; margin-top: 4px;">${inv.buyer.name}</div>
        <div style="font-size: 11px; color: #4b5563; margin-top: 2px;">
          ${inv.buyer.address}<br>
          ${inv.buyer.city}, ${inv.buyer.state} - ${inv.buyer.pincode}<br>
          Phone: ${inv.buyer.phone || "N/A"}<br>
          Email: ${inv.buyer.email || "N/A"}
        </div>
        <div style="margin-top: 6px; font-size: 11px;">
          ${inv.buyer.gstin 
            ? `<span style="font-family: monospace; color: #047857; font-weight: 700;">Buyer GSTIN: ${inv.buyer.gstin} (B2B Eligible)</span>` 
            : `<span style="color: #6b7280;">Status: Unregistered Person (B2C)</span>`}
        </div>
      </div>
      <div>
        <div style="font-size: 10px; font-weight: 800; text-transform: uppercase; color: #9ca3af; letter-spacing: 0.5px;">Dispatch & Supply Details</div>
        <table style="margin-top: 6px; font-size: 11px;">
          <tr>
            <td style="color: #6b7280; padding: 2px 0;">Place of Supply:</td>
            <td style="font-weight: 700; color: #111827; text-align: right;">${inv.taxBreakdown.placeOfSupply}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 2px 0;">Supply Nature:</td>
            <td style="font-weight: 700; color: ${inv.taxBreakdown.isInterstate ? '#3730a3' : '#065f46'}; text-align: right;">
              ${inv.taxBreakdown.isInterstate ? 'Inter-State (IGST 18%)' : 'Intra-State (CGST 9% + SGST 9%)'}
            </td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 2px 0;">Payment Method:</td>
            <td style="font-weight: 700; color: #111827; text-align: right;">${inv.paymentMode}</td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 2px 0;">Payment Status:</td>
            <td style="text-align: right;">
              <span class="badge ${inv.paymentStatus === 'PAID' ? 'badge-paid' : 'badge-cod'}">
                ${inv.paymentStatus}
              </span>
            </td>
          </tr>
          <tr>
            <td style="color: #6b7280; padding: 2px 0;">Reverse Charge (RCM):</td>
            <td style="font-weight: 700; color: #111827; text-align: right;">No</td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Line items -->
    <div style="padding: 20px 0;">
      <table>
        <thead>
          <tr style="background: #f9fafb; border-bottom: 2px solid #e5e7eb; font-size: 10px; text-transform: uppercase; color: #4b5563; font-weight: 800;">
            <th style="padding: 8px; text-align: left;">#</th>
            <th style="padding: 8px; text-align: left;">Description of Goods / Services</th>
            <th style="padding: 8px; text-align: left;">HSN / SAC</th>
            <th style="padding: 8px; text-align: center;">Qty</th>
            <th style="padding: 8px; text-align: right;">Taxable (₹)</th>
            <th style="padding: 8px; text-align: right;">Rate</th>
            <th style="padding: 8px; text-align: right;">Total (₹)</th>
          </tr>
        </thead>
        <tbody>
          ${itemsHtml}
        </tbody>
      </table>
    </div>

    <!-- Summary & Totals -->
    <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 24px; padding-top: 16px; border-top: 1px solid #e5e7eb;">
      <div>
        <div style="font-size: 11px; font-weight: 700; color: #111827;">Tax Breakdown & Legal Undertaking:</div>
        <p style="font-size: 11px; color: #6b7280; margin: 4px 0 8px 0; line-height: 1.5;">
          ${inv.taxBreakdown.isInterstate
            ? `Inter-State supply originating from Noida (Uttar Pradesh, State Code 09) to ${inv.taxBreakdown.placeOfSupply}. Statutory 18% Integrated Goods and Services Tax (IGST) charged under Section 5 of the IGST Act, 2017.`
            : `Intra-State supply originating and terminating within Uttar Pradesh (State Code 09). Central GST (9%) and State GST (9%) charged in accordance with Section 9 of the CGST/SGST Acts, 2017.`
          }
        </p>
        <div style="background: #f9fafb; border-radius: 8px; padding: 10px; font-size: 11px; color: #4b5563; margin-top: 8px;">
          <strong>Amount in Words:</strong><br>
          <span style="font-weight: 700; color: #111827;">${inv.totalInWords}</span>
        </div>
      </div>
      <div>
        <table style="font-size: 11px;">
          <tr>
            <td style="padding: 4px 0; color: #6b7280;">Taxable Goods & Services:</td>
            <td style="padding: 4px 0; text-align: right; font-family: monospace;">${inr(inv.taxBreakdown.taxableAmount)}</td>
          </tr>
          ${taxRows}
          ${inv.discount ? `
            <tr>
              <td style="padding: 4px 0; color: #047857;">Coupon Discount:</td>
              <td style="padding: 4px 0; text-align: right; font-family: monospace; color: #047857;">-${inr(inv.discount)}</td>
            </tr>
          ` : ""}
          <tr style="border-top: 2px solid #111827;">
            <td style="padding: 8px 0; font-size: 14px; font-weight: 800; color: #111827;">Invoice Grand Total:</td>
            <td style="padding: 8px 0; text-align: right; font-size: 16px; font-weight: 900; color: #E31E24; font-family: monospace;">
              ${inr(inv.grandTotal)}
            </td>
          </tr>
        </table>
      </div>
    </div>

    <!-- Digital Seal Footer -->
    <div style="margin-top: 28px; padding-top: 16px; border-top: 1px dashed #d1d5db; display: flex; justify-content: space-between; align-items: flex-end;">
      <div style="font-size: 9px; color: #9ca3af; font-family: monospace;">
        Digital Signature Auth: ${inv.authenticationToken}<br>
        Rule 46 CGST Act Compliance Engine · Generated on ${new Date().toISOString()}
      </div>
      <div style="text-align: center; border: 1px solid #10b981; background: #ecfdf5; border-radius: 8px; padding: 6px 16px;">
        <div style="font-size: 9px; font-weight: 800; color: #065f46; letter-spacing: 0.5px; text-transform: uppercase;">
          Digitally Signed & Certified
        </div>
        <div style="font-size: 11px; font-weight: 800; color: #111827;">
          RiderzPro Billing Engine
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
}
