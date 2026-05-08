import React, { useState } from "react";
import { Download, CreditCard, FileText, Clock3, Eye, Filter } from "lucide-react";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";

export default function AccountInvoices() {
  const { customer } = useCustomerAuth();
  const [filterStatus, setFilterStatus] = useState("alle");

  const downloadInvoice = (invoice) => {
    const statusLabel = invoice.status === "Bezahlt" ? "BEZAHLT" : "OFFEN";
    const html = `
<!DOCTYPE html>
<html lang="de">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rechnung ${invoice.number}</title>
  <style>
    body { font-family: Arial, sans-serif; margin: 0; padding: 40px; background: #fff; }
    .header { border-bottom: 3px solid #E63946; padding-bottom: 20px; margin-bottom: 30px; }
    .company-name { font-size: 24px; font-weight: bold; color: #0f172a; }
    .invoice-title { font-size: 18px; color: #666; margin-top: 10px; }
    .invoice-details { margin-bottom: 30px; }
    .invoice-details div { margin: 8px 0; }
    .invoice-details label { font-weight: bold; color: #0f172a; }
    .customer-info { display: grid; grid-template-columns: 1fr 1fr; gap: 30px; margin-bottom: 30px; }
    .section-title { font-size: 14px; font-weight: bold; text-transform: uppercase; color: #666; margin-bottom: 10px; }
    table { width: 100%; border-collapse: collapse; margin: 30px 0; }
    table th { background: #f0f0f0; padding: 12px; text-align: left; border: 1px solid #ddd; font-weight: bold; }
    table td { padding: 12px; border: 1px solid #ddd; }
    table tr:nth-child(even) { background: #f9f9f9; }
    .total-section { text-align: right; margin: 30px 0; }
    .total-row { font-size: 18px; font-weight: bold; color: #0f172a; margin: 10px 0; }
    .status { display: inline-block; padding: 8px 16px; border-radius: 20px; font-weight: bold; margin: 10px 0; }
    .status.paid { background: #dcfce7; color: #166534; }
    .status.open { background: #fef3c7; color: #92400e; }
    .footer { margin-top: 50px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="header">
    <div class="company-name">redwork.ch</div>
    <div class="invoice-title">RECHNUNG</div>
  </div>
  
  <div class="invoice-details">
    <div><label>Rechnungsnummer:</label> ${invoice.number}</div>
    <div><label>Rechnungsdatum:</label> ${new Date(invoice.date).toLocaleDateString("de-CH")}</div>
    <div><label>Fälligkeitsdatum:</label> ${new Date(invoice.dueDate).toLocaleDateString("de-CH")}</div>
    <div class="status ${invoice.status === "Bezahlt" ? "paid" : "open"}">${statusLabel}</div>
  </div>

  <div class="customer-info">
    <div>
      <div class="section-title">Berechnung an</div>
      <div>${customer.name}</div>
      <div>${customer.email}</div>
      <div>${customer.company}</div>
      <div>${customer.phone}</div>
    </div>
    <div>
      <div class="section-title">Rechnungsdetails</div>
      <div>Steuernummer: CHE-123.456.789</div>
      <div>Zahlungsbedingungen: Netto 30 Tage</div>
    </div>
  </div>

  <table>
    <thead>
      <tr>
        <th>Position</th>
        <th>Menge</th>
        <th>Einheitspreis</th>
        <th>Gesamtpreis</th>
      </tr>
    </thead>
    <tbody>
      ${(invoice.items || []).map((item, idx) => `
        <tr>
          <td>${item.description || "Hosting-Paket"}</td>
          <td>1</td>
          <td>CHF ${item.price || invoice.amount}</td>
          <td>CHF ${item.price || invoice.amount}</td>
        </tr>
      `).join("")}
      ${(!invoice.items || invoice.items.length === 0) && `
        <tr>
          <td>${invoice.description || "Hosting-Service"}</td>
          <td>1</td>
          <td>CHF ${invoice.amount}</td>
          <td>CHF ${invoice.amount}</td>
        </tr>
      `}
    </tbody>
  </table>

  <div class="total-section">
    <div>Summe: <span>CHF ${invoice.amount}</span></div>
    <div class="total-row">Gesamtbetrag: CHF ${invoice.amount}</div>
  </div>

  <div class="footer">
    <p><strong>Zahlungsinformationen:</strong></p>
    <p>Bitte überweisen Sie den Betrag auf unser Bankkonto oder nutzen Sie Stripe/PayPal.</p>
    <p>Kontoinhaber: redwork.ch | IBAN: CH93 0076 2011 6238 5295 7</p>
    <p style="margin-top: 30px;">Vielen Dank für Ihr Vertrauen!</p>
  </div>
</body>
</html>
    `;
    const blob = new Blob([html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `Rechnung-${invoice.number}.html`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const invoices = customer.invoices || [];
  const filtered = filterStatus === "alle" ? invoices : invoices.filter((inv) => inv.status === filterStatus);

  const stats = {
    total: invoices.length,
    paid: invoices.filter((inv) => inv.status === "Bezahlt").length,
    open: invoices.filter((inv) => inv.status === "Offen").length,
    totalAmount: invoices.reduce((sum, inv) => sum + (inv.amount || 0), 0),
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Rechnungen & Zahlungen</p>
            <h1 className="text-3xl font-bold text-slate-950">Ihre Rechnungen</h1>
          </div>
          <div className="rounded-3xl bg-[#E63946] px-4 py-2 text-sm font-semibold text-white">{stats.total} Rechnungen</div>
        </div>
        <p className="mt-4 text-sm text-slate-600">Hier sehen Sie Ihre letzten Rechnungen, Zahlungsstatus und können diese herunterladen.</p>
      </div>

      {/* Statistik-Karten */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-4 shadow-sm">
          <div className="text-sm text-slate-500 mb-2">Gesamt Rechnungen</div>
          <div className="text-2xl font-bold text-slate-950">{stats.total}</div>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-emerald-50 to-white p-4 shadow-sm">
          <div className="text-sm text-emerald-600 mb-2">Bezahlt</div>
          <div className="text-2xl font-bold text-emerald-700">{stats.paid}</div>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-amber-50 to-white p-4 shadow-sm">
          <div className="text-sm text-amber-600 mb-2">Offen</div>
          <div className="text-2xl font-bold text-amber-700">{stats.open}</div>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-4 shadow-sm">
          <div className="text-sm text-blue-600 mb-2">Gesamtsumme</div>
          <div className="text-2xl font-bold text-blue-700">CHF {stats.totalAmount.toFixed(2)}</div>
        </div>
      </div>

      {/* Filter */}
      <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-sm flex gap-2 items-center flex-wrap">
        <Filter size={18} className="text-slate-500" />
        {["alle", "Bezahlt", "Offen"].map((status) => (
          <button
            key={status}
            onClick={() => setFilterStatus(status)}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              filterStatus === status ? "bg-[#E63946] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"
            }`}
          >
            {status === "alle" ? "Alle anzeigen" : status}
          </button>
        ))}
      </div>

      {/* Rechnungslist */}
      <div className="grid gap-4">
        {filtered.length > 0 ? (
          filtered.map((invoice) => (
            <article key={invoice.id} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className="grid gap-4 md:grid-cols-[1fr_auto_auto_auto_auto]">
                <div>
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Rechnungsnummer</div>
                  <div className="text-lg font-bold text-slate-950">{invoice.number}</div>
                  <div className="text-sm text-slate-600 mt-2">{invoice.description}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Datum</div>
                  <div className="text-sm font-semibold text-slate-950">{new Date(invoice.date).toLocaleDateString("de-CH")}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Status</div>
                  <div className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${invoice.status === "Bezahlt" ? "bg-emerald-100 text-emerald-700" : invoice.status === "Offen" ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-700"}`}>
                    {invoice.status}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs uppercase tracking-wide text-slate-500 mb-1">Betrag</div>
                  <div className="text-lg font-bold text-slate-950">CHF {(invoice.amount || 0).toFixed(2)}</div>
                </div>
                <button
                  type="button"
                  onClick={() => downloadInvoice(invoice)}
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-[#E63946] px-4 py-2 text-sm font-semibold text-white hover:bg-[#c5303d] transition h-fit"
                  title="PDF herunterladen"
                >
                  <Download size={16} /> PDF
                </button>
              </div>
            </article>
          ))
        ) : (
          <div className="rounded-[24px] border border-slate-200 bg-slate-50 p-12 text-center text-slate-600">
            <FileText size={40} className="mx-auto mb-3 opacity-50" />
            <p className="text-sm">Keine Rechnungen im Status "{filterStatus}" gefunden.</p>
          </div>
        )}
      </div>
    </div>
  );
}
