import React from "react";
import { ShieldCheck, Wallet, FileText, MessageCircle, Server, Globe, Clock3, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";

export default function AccountDashboard() {
  const { customer } = useCustomerAuth();

  if (!customer) {
    return <div className="text-center py-12">Lade Konto...</div>;
  }

  const openTickets = customer.tickets?.filter((t) => t.status !== "Geschlossen").length || 0;
  const pendingInvoices = customer.invoices?.filter((inv) => inv.status === "Offen").length || 0;
  const totalInvoices = customer.invoices?.length || 0;

  const stats = [
    { 
      icon: ShieldCheck, 
      title: "Aktives Paket", 
      value: customer.plan, 
      description: "Premium Hosting für Ihr Projekt",
      color: "bg-blue-100 text-blue-600"
    },
    { 
      icon: Wallet, 
      title: "Zahlungsstatus", 
      value: customer.paymentStatus, 
      description: "Ihre Zahlungen sind aktuell",
      color: "bg-emerald-100 text-emerald-600"
    },
    { 
      icon: FileText, 
      title: "Rechnungen", 
      value: totalInvoices, 
      description: `${pendingInvoices} offen`,
      color: "bg-orange-100 text-orange-600"
    },
    { 
      icon: MessageCircle, 
      title: "Offene Tickets", 
      value: openTickets, 
      description: "Wir arbeiten daran",
      color: "bg-purple-100 text-purple-600"
    },
  ];

  return (
    <div className="space-y-8">
      {/* Willkommen Header */}
      <section className="rounded-[32px] bg-gradient-to-r from-[#0f172a] to-[#E63946] p-8 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] opacity-90">Willkommen zurück!</p>
            <h1 className="text-4xl font-bold mt-2">{customer.name}</h1>
            <p className="mt-2 text-white/80 text-sm">Hier ist ein Überblick über Ihr Hosting-Konto</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur">
            {customer.emailVerified ? (
              <>✓ Verifiziertes Konto</>
            ) : (
              <>⚠ Verifizierung ausstehend</>
            )}
          </div>
        </div>
      </section>

      {/* Stats Cards */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article key={stat.title} className="rounded-[24px] border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
              <div className={`inline-flex items-center justify-center rounded-full p-3 mb-4 ${stat.color}`}>
                <Icon size={20} />
              </div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500 mb-2">{stat.title}</p>
              <h2 className="text-3xl font-bold text-slate-950">{stat.value}</h2>
              <p className="mt-3 text-sm text-slate-600">{stat.description}</p>
            </article>
          );
        })}
      </section>

      {/* Main Content Grid */}
      <section className="grid gap-6 xl:grid-cols-[1.8fr_1fr]">
        {/* Technischer Status & Domains */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Infrastruktur</p>
              <h2 className="text-2xl font-bold text-slate-950">Technischer Status</h2>
            </div>
            <div className="inline-flex items-center justify-center rounded-full bg-emerald-100 p-3 text-emerald-600">
              <Server size={20} />
            </div>
          </div>

          <div className="space-y-4">
            {/* Domain Status */}
            <div className="rounded-[20px] border border-slate-200 hover:border-[#E63946] bg-slate-50 hover:bg-red-50 p-5 transition">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-slate-950">Domain</div>
                <div className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">
                  <CheckCircle size={12} /> Aktiv
                </div>
              </div>
              <div className="text-lg font-semibold text-slate-950">{customer.domains?.[0]?.name || "Keine Domain"}</div>
              <div className="text-sm text-slate-600 mt-2">Läuft bis: {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString("de-CH")}</div>
            </div>

            {/* Server Status */}
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between mb-2">
                <div className="font-semibold text-slate-950">Serververfügbarkeit</div>
                <div className="text-2xl font-bold text-emerald-600">99.9%</div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                <div className="bg-emerald-600 h-2 rounded-full" style={{ width: "99.9%" }}></div>
              </div>
              <div className="text-sm text-slate-600">Überwachung 24/7 - Automatische Backups</div>
            </div>

            {/* Support Level */}
            <div className="rounded-[20px] border border-slate-200 bg-slate-50 p-5">
              <div className="font-semibold text-slate-950 mb-2">Support-Level</div>
              <div className="text-lg font-bold text-[#E63946]">{customer.supportLevel}</div>
              <div className="text-sm text-slate-600 mt-2">Antwortzeit: &lt; 1 Stunde</div>
            </div>
          </div>
        </div>

        {/* Schnelllinks & Info */}
        <div className="space-y-4">
          {/* Laufende Bestellungen */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-2 text-blue-600">
                <Globe size={18} />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Abos</p>
                <h3 className="text-lg font-bold text-slate-950">Bestellungen</h3>
              </div>
            </div>
            <div className="space-y-2">
              {(customer.orders || []).slice(0, 3).map((order) => (
                <div key={order.id} className="rounded-[16px] border border-slate-200 bg-slate-50 hover:bg-slate-100 p-3 transition cursor-pointer">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-slate-950 text-sm truncate">{order.title}</div>
                      <div className="text-xs text-slate-500">{new Date(order.createdAt).toLocaleDateString("de-CH")}</div>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-xs font-semibold shrink-0 ${
                      order.status === "Bezahlt" ? "bg-emerald-100 text-emerald-700" : 
                      "bg-amber-100 text-amber-700"
                    }`}>{order.status}</span>
                  </div>
                </div>
              ))}
              {!(customer.orders || []).length && (
                <p className="text-sm text-slate-500 py-2">Keine Bestellungen vorhanden.</p>
              )}
            </div>
          </div>

          {/* Info Box */}
          <div className="rounded-[20px] border border-blue-200 bg-blue-50 p-4 text-sm">
            <div className="flex items-start gap-3">
              <AlertCircle size={18} className="text-blue-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-blue-950">Tipp:</strong>
                <p className="text-blue-800 text-xs mt-1">Sie können Ihr Paket jederzeit im Bereich "Hosting & Produkte" upgraden oder wechseln.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Rechnungen & Aktivitäten */}
      <section className="grid gap-6 xl:grid-cols-2">
        {/* Letzte Rechnungen */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center rounded-full bg-orange-100 p-2 text-orange-600">
              <FileText size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Finanzieren</p>
              <h3 className="text-lg font-bold text-slate-950">Letzte Rechnungen</h3>
            </div>
          </div>
          <div className="space-y-3">
            {(customer.invoices || []).slice(0, 4).map((invoice) => (
              <div key={invoice.id} className="rounded-[16px] border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-slate-950 text-sm">{invoice.number}</div>
                    <div className="text-xs text-slate-500">{new Date(invoice.date).toLocaleDateString("de-CH")}</div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-slate-950">CHF {(invoice.amount || 0).toFixed(2)}</div>
                    <div className={`text-xs font-semibold ${
                      invoice.status === "Bezahlt" ? "text-emerald-700" : "text-amber-700"
                    }`}>{invoice.status}</div>
                  </div>
                </div>
              </div>
            ))}
            {!(customer.invoices || []).length && (
              <p className="text-sm text-slate-500 py-4">Keine Rechnungen vorhanden.</p>
            )}
          </div>
        </div>

        {/* Letzte Aktivitäten */}
        <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex items-center justify-center rounded-full bg-purple-100 p-2 text-purple-600">
              <Clock3 size={18} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Log</p>
              <h3 className="text-lg font-bold text-slate-950">Aktivitäten</h3>
            </div>
          </div>
          <div className="space-y-3">
            {(customer.activities || []).slice(0, 4).map((activity, index) => (
              <div key={index} className="rounded-[16px] border border-slate-200 bg-slate-50 p-4 flex gap-3">
                <div className="shrink-0 mt-0.5">
                  <div className="w-2 h-2 rounded-full bg-[#E63946]"></div>
                </div>
                <div className="text-sm text-slate-700 leading-relaxed">{activity}</div>
              </div>
            ))}
            {!(customer.activities || []).length && (
              <p className="text-sm text-slate-500 py-4">Keine Aktivitäten vorhanden.</p>
            )}
          </div>
        </div>
      </section>

      {/* Footer Info */}
      <section className="rounded-[24px] bg-gradient-to-r from-slate-900 to-slate-800 text-white p-6 shadow-lg">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-sm opacity-80">Benötigen Sie Hilfe?</p>
            <p className="text-lg font-bold mt-1">Unser Support-Team ist 24/7 erreichbar</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-slate-900 hover:bg-slate-100 transition">
            ✉ Support kontaktieren
          </button>
        </div>
      </section>
    </div>
  );
}
