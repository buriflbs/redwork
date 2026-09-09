import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import CustomerShell from "../components/customer/CustomerShell";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CalendarDays, CreditCard, FileText, Globe2, Headphones, Package, Server, ShieldCheck, WalletCards } from "lucide-react";

const fmtDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("de-DE");
};

const money = (value, currency = "CHF") => `${Number(value || 0).toLocaleString("de-CH", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency}`;

const statusLabel = {
  active: "AKTIV",
  paid: "BEZAHLT",
  pending: "BESTELLT",
  processing: "IN BEARBEITUNG",
  cancelled: "STORNIERT",
  expired: "ABGELAUFEN",
  sent: "OFFEN",
  overdue: "ÜBERFÄLLIG",
  reminder_sent: "ERINNERUNG",
  dunning_sent: "MAHNUNG",
  collection_warning: "INKASSO",
};

const Empty = ({ children }) => <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-6 text-sm text-slate-500">{children}</div>;

const StatCard = ({ tone, icon: Icon, value, label, sub }) => {
  const tones = {
    blue: "border-blue-200 bg-blue-50 text-[#102452]",
    red: "border-red-200 bg-red-50 text-red-700",
    yellow: "border-amber-200 bg-amber-50 text-amber-700",
    green: "border-emerald-200 bg-emerald-50 text-emerald-700",
  };
  return (
    <div className={`relative overflow-hidden rounded-xl border p-5 shadow-sm ${tones[tone]}`}>
      <Icon className="absolute right-5 top-7 h-20 w-20 opacity-10" />
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white/75 shadow-sm"><Icon className="h-5 w-5" /></div>
        <div>
          <p className="text-2xl font-black leading-none">{value}</p>
          <p className="mt-1 text-sm font-extrabold">{label}</p>
          <p className="mt-1 text-xs font-semibold opacity-75">{sub}</p>
        </div>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get("/dashboard");
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Dashboard konnte nicht geladen werden.");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <CustomerShell><div className="rounded-xl bg-white p-10 text-center text-slate-500 shadow-sm">Dashboard wird geladen...</div></CustomerShell>;

  const customer = data?.customer || user || {};
  const activeServices = data?.services || data?.activeOrders || [];
  const openInvoices = data?.openInvoices || [];
  const openTickets = data?.openTickets || [];
  const currency = data?.currency || "CHF";

  return (
    <CustomerShell active="dashboard">
      {error && <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</div>}

      <section className="relative min-h-[300px] overflow-hidden rounded-2xl bg-white p-7 shadow-[0_12px_40px_rgba(16,36,82,0.08)] md:p-12">
        <div className="absolute left-8 top-28 h-40 w-40 rounded-full bg-[#f1eefb]" />
        <div className="absolute left-[36%] top-7 h-44 w-44 rounded-full bg-[#f1eefb]" />
        <div className="relative z-10 grid gap-8 lg:grid-cols-[1fr_420px] lg:items-center">
          <div>
            <h1 className="text-4xl font-black leading-tight text-[#102452] md:text-5xl">Hoş Geldiniz,<br />{customer.firstName || "Kunde"}!</h1>
            <p className="mt-4 max-w-xl text-base leading-7 text-slate-500">Redwork müşteri panelinize hoş geldiniz. Tüm hizmetlerinizi buradan yönetebilirsiniz.</p>
            <Link to="/dashboard/products"><Button className="mt-7 bg-[#102452] px-8 hover:bg-[#0c1b3d]">Hizmetlerim</Button></Link>
          </div>
          <div className="hidden justify-end lg:flex">
            <div className="relative h-56 w-80">
              <div className="absolute bottom-0 right-0 h-44 w-72 rounded-t-[90px] bg-[#102452]" />
              <div className="absolute left-5 top-12 h-16 w-28 rounded-lg border bg-white shadow-lg">
                <div className="h-5 rounded-t-lg bg-blue-400" />
                <div className="space-y-1 p-3">{[1, 2, 3].map((i) => <div key={i} className="h-1.5 rounded bg-blue-100" />)}</div>
              </div>
              <div className="absolute left-2 bottom-3 flex h-24 w-24 items-center justify-center rounded-b-[40px] rounded-t-lg bg-emerald-500 shadow-lg"><ShieldCheck className="h-10 w-10 text-white" /></div>
              <div className="absolute right-16 top-5 flex h-14 w-14 items-center justify-center rounded-lg bg-purple-500 shadow-lg"><Globe2 className="h-8 w-8 text-white" /></div>
              <div className="absolute right-8 bottom-2 h-20 w-24 rounded-t-lg bg-blue-600 shadow-lg" />
              <div className="absolute bottom-0 left-0 h-1 w-full rounded bg-[#102452]" />
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard tone="blue" icon={Server} value={activeServices.length} label="Aktif Hizmet" sub={`Toplam ${activeServices.length} hizmet`} />
        <StatCard tone="red" icon={FileText} value={openInvoices.length} label="Ödenmemiş Fatura" sub={money(data?.unpaidInvoiceTotal, currency)} />
        <StatCard tone="yellow" icon={Headphones} value={openTickets.length} label="Açık Destek Talebi" sub="Yanıt bekleyen talepler" />
        <StatCard tone="green" icon={WalletCards} value={money(data?.balance, currency)} label="Bakiye" sub={currency} />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-2">
        <div id="services" className="rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(16,36,82,0.06)]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#102452]">Aktif Hizmetlerim</h2>
            <Link to="/dashboard/products"><Button variant="outline">Tümünü Gör</Button></Link>
          </div>
          {activeServices.length === 0 ? <Empty>Hizmetiniz bulunmuyor.</Empty> : (
            <div className="space-y-4">
              {activeServices.slice(0, 5).map((service) => (
                <div key={service.id} className="flex flex-col gap-4 rounded-xl border border-slate-100 p-4 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-50 text-amber-500"><Package className="h-5 w-5" /></div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-black text-[#102452]">{service.productName || "REDWORK Service"}</p>
                        <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">{service.productCategoryName || service.productSku || "Service"}</Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">{service.domainName || service.domainChoice || service.reference || `Bestellung ${service.id}`}</p>
                      <p className="text-xs text-slate-400">Start: {fmtDate(service.activatedAt || service.createdAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge>{statusLabel[service.status] || service.status}</Badge>
                    <Button className="bg-[#102452] hover:bg-[#0c1b3d]">Yönet</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div id="rechnungen" className="rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(16,36,82,0.06)]">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-black text-[#102452]">Ödenmemiş Faturalar</h2>
            <Button variant="outline">Tümünü Gör</Button>
          </div>
          {openInvoices.length === 0 ? <Empty>Henüz ödenmemiş faturanız bulunmuyor.</Empty> : (
            <div className="space-y-4">
              {openInvoices.slice(0, 5).map((invoice) => (
                <div key={invoice.id} className="rounded-xl border border-slate-100 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs text-slate-400">Fatura No</p>
                      <p className="font-black text-[#102452]">#{invoice.number}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-400">Tutar</p>
                      <p className="font-black text-[#102452]">{money(invoice.total, invoice.currency || currency)}</p>
                    </div>
                  </div>
                  <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <p className="flex items-center gap-2 text-sm text-slate-500"><CalendarDays className="h-4 w-4" /> Son Ödeme: {fmtDate(invoice.dueDate)}</p>
                    <Button className="bg-[#102452] hover:bg-[#0c1b3d]"><CreditCard className="mr-2 h-4 w-4" /> Öde</Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 rounded-2xl bg-white p-6 shadow-[0_12px_35px_rgba(16,36,82,0.06)]">
        <h2 className="text-2xl font-black text-[#102452]">Hızlı İşlemler</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {[
            ["Destek Talebi Oluştur", "/support", Headphones, "border-[#102452] text-[#102452]"],
            ["Domain Kaydet", "/dashboard/products?category=domains", Globe2, "border-emerald-500 text-emerald-600"],
            ["Fatura Öde", "#rechnungen", CreditCard, "border-amber-500 text-amber-600"],
            ["Yeni Hosting Satın Al", "/dashboard/products?category=web-hosting", Server, "border-blue-500 text-blue-600"],
            ["VPS Satın Al", "/dashboard/products?category=premium-vds-vps", Package, "border-purple-500 text-purple-600"],
            ["Reseller Hosting Satın Al", "/dashboard/products?category=reseller-hosting", Package, "border-red-500 text-red-600"],
          ].map(([label, to, Icon, cls]) => (
            <Link key={label} to={to} className={`flex min-h-16 items-center justify-center gap-3 rounded-xl border bg-white px-4 py-4 text-sm font-black transition hover:-translate-y-0.5 hover:shadow-lg ${cls}`}>
              <Icon className="h-5 w-5" /> {label}
            </Link>
          ))}
        </div>
      </section>

      <section id="support" className="mt-8 grid gap-6 xl:grid-cols-3">
        <div id="hosting" className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-black text-[#102452]">Hosting</h3><p className="mt-2 text-sm text-slate-500">{(data?.hosting || []).length ? `${data.hosting.length} aktive Hosting-Leistung(en).` : "Keine aktiven Hosting-Pakete."}</p></div>
        <div id="domains" className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-black text-[#102452]">Domainlerim</h3><p className="mt-2 text-sm text-slate-500">{(data?.domains || []).length ? `${data.domains.length} Domain-Leistung(en).` : "Keine aktiven Domain-Datensätze."}</p></div>
        <div id="activity" className="rounded-2xl bg-white p-6 shadow-sm"><h3 className="font-black text-[#102452]">Raporlar</h3><p className="mt-2 text-sm text-slate-500">{(data?.recentActivities || []).length ? `${data.recentActivities.length} aktuelle Aktivitäten.` : "Noch keine aktuellen Aktivitäten."}</p></div>
      </section>
    </CustomerShell>
  );
}
