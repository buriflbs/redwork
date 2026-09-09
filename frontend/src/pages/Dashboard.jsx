import React, { useEffect, useState, useMemo } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import CustomerShell from "../components/customer/CustomerShell";
import ProductMarketplace from "../components/ProductMarketplace";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import {
  Server,
  Globe,
  FileText,
  Wallet,
  Calendar,
  CreditCard,
  Headphones,
  PlusCircle,
  Search,
  ArrowUpRight,
  Download,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ExternalLink,
  ChevronRight,
  Activity,
  Layers,
  Save,
  ShieldCheck,
  Lock,
  User,
  Building,
  Mail,
  Phone,
  MapPin,
  KeyRound,
  Terminal,
  HardDrive,
  RefreshCw,
  Copy,
  Check,
  Eye,
  EyeOff,
  Shield
} from "lucide-react";

const fmtDate = (value) => {
  if (!value) return "-";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "-" : date.toLocaleDateString("de-CH", { day: "2-digit", month: "2-digit", year: "numeric" });
};

const money = (value, currency = "CHF") => {
  const num = Number(value || 0).toFixed(2);
  const cleanCurr = (currency === "TRY" || currency === "TL" || currency === "₺") ? "CHF" : currency;
  return `${cleanCurr} ${num}`;
};

export default function Dashboard() {
  const { user, updateProfile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Quick Action Modals
  const [activeModal, setActiveModal] = useState(null);
  const [domainSearchQuery, setDomainSearchQuery] = useState("");
  const [topupAmount, setTopupAmount] = useState("50");
  const [topupSuccess, setTopupSuccess] = useState(false);

  // Profile Edit State
  const [profileForm, setProfileForm] = useState({
    firstName: "",
    lastName: "",
    company: "",
    phone: "",
    address: "",
    city: "",
    zip: "",
    country: "CH",
    vatNumber: "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab") || "dashboard";

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/dashboard");
      setData(res.data);
      if (res.data?.customer) {
        const c = res.data.customer;
        setProfileForm((prev) => ({
          ...prev,
          firstName: c.firstName || "",
          lastName: c.lastName || "",
          company: c.company || "",
          phone: c.phone || "",
          address: c.address || "",
          city: c.city || "",
          zip: c.zip || "",
          country: c.country || "CH",
          vatNumber: c.vatNumber || ""
        }));
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Dashboard-Daten konnten nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const customer = data?.customer || user || {};
  const activeServices = data?.services || data?.activeOrders || [];
  const domains = data?.domains || [];
  const openInvoices = data?.openInvoices || [];
  const allInvoices = data?.invoices || [];
  const upcomingRenewals = data?.upcomingRenewals || [];
  const recentPayments = data?.recentPayments || [];
  const recentActivities = data?.recentActivities || [];
  const documents = data?.documents || [];
  const currency = data?.currency || "CHF";
  const unpaidTotal = data?.unpaidInvoiceTotal || 0;
  const balance = data?.balance || 0;

  // Hosting Accounts State
  const [hostings, setHostings] = useState([]);
  const [hostingsLoading, setHostingsLoading] = useState(false);
  const [selectedHosting, setSelectedHosting] = useState(null);
  const [pwdModalOpen, setPwdModalOpen] = useState(false);
  const [credModalOpen, setCredModalOpen] = useState(false);
  const [newPwd, setNewPwd] = useState("");
  const [confirmPwd, setConfirmPwd] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdMsg, setPwdMsg] = useState({ type: "", text: "" });
  const [showNewPwd, setShowNewPwd] = useState(false);
  const [ssoLoading, setSsoLoading] = useState({});
  const [copiedField, setCopiedField] = useState("");

  const loadHostings = async () => {
    try {
      setHostingsLoading(true);
      const res = await api.get("/customer/hosting");
      setHostings(res.data);
    } catch (err) {
      console.warn("Hostings load failed:", err);
    } finally {
      setHostingsLoading(false);
    }
  };

  useEffect(() => {
    if (currentTab === "servers") {
      loadHostings();
    }
  }, [currentTab]);

  const handleCpanelSSO = async (hosting) => {
    try {
      setSsoLoading((prev) => ({ ...prev, [hosting.id]: true }));
      const res = await api.post(`/customer/hosting/${hosting.id}/sso`);
      if (res.data?.url) {
        window.open(res.data.url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      alert(err.response?.data?.detail || "cPanel-Sitzung konnte nicht erstellt werden.");
    } finally {
      setSsoLoading((prev) => ({ ...prev, [hosting.id]: false }));
    }
  };

  const handleHostingPasswordChange = async (e) => {
    e.preventDefault();
    setPwdMsg({ type: "", text: "" });

    if (newPwd.length < 8) {
      setPwdMsg({ type: "error", text: "Das Passwort muss mindestens 8 Zeichen lang sein." });
      return;
    }
    if (newPwd !== confirmPwd) {
      setPwdMsg({ type: "error", text: "Die Passwörter stimmen nicht überein." });
      return;
    }

    setPwdSaving(true);
    try {
      const res = await api.post(`/customer/hosting/${selectedHosting.id}/password`, {
        newPassword: newPwd,
        confirmPassword: confirmPwd
      });
      setPwdMsg({ type: "success", text: res.data?.message || "Das Hosting-Passwort wurde erfolgreich geändert." });
      setNewPwd("");
      setConfirmPwd("");
      setTimeout(() => {
        setPwdModalOpen(false);
        setPwdMsg({ type: "", text: "" });
      }, 2000);
    } catch (err) {
      setPwdMsg({ type: "error", text: err.response?.data?.detail || "Passwortänderung fehlgeschlagen." });
    } finally {
      setPwdSaving(false);
    }
  };

  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000);
  };

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });

    if (profileForm.newPassword) {
      if (profileForm.newPassword !== profileForm.confirmPassword) {
        setProfileMsg({ type: "error", text: "Die Passwörter stimmen nicht überein." });
        return;
      }
      if (profileForm.newPassword.length < 8) {
        setProfileMsg({ type: "error", text: "Das neue Passwort muss mindestens 8 Zeichen lang sein." });
        return;
      }
      if (!profileForm.currentPassword) {
        setProfileMsg({ type: "error", text: "Bitte geben Sie Ihr aktuelles Passwort ein, um es zu ändern." });
        return;
      }
    }

    setProfileSaving(true);
    try {
      await updateProfile({
        firstName: profileForm.firstName,
        lastName: profileForm.lastName,
        company: profileForm.company,
        phone: profileForm.phone,
        address: profileForm.address,
        city: profileForm.city,
        zip: profileForm.zip,
        country: profileForm.country,
        vatNumber: profileForm.vatNumber,
        currentPassword: profileForm.currentPassword || undefined,
        newPassword: profileForm.newPassword || undefined
      });
      setProfileMsg({ type: "success", text: "Profil erfolgreich aktualisiert." });
      setProfileForm((prev) => ({ ...prev, currentPassword: "", newPassword: "", confirmPassword: "" }));
      fetchDashboard();
    } catch (err) {
      setProfileMsg({ type: "error", text: err.response?.data?.detail || "Profil konnte nicht aktualisiert werden." });
    } finally {
      setProfileSaving(false);
    }
  };

  const handleDownloadDoc = (doc) => {
    window.open(doc.url, "_blank");
  };

  const handlePayInvoice = (inv) => {
    alert(`Rechnung #${inv.number} (${money(inv.total, inv.currency || currency)}): Sie werden zur sicheren Zahlungsseite weitergeleitet.`);
  };

  return (
    <CustomerShell active={currentTab} notifications={data?.notifications || []} unreadCount={(data?.notifications || []).length}>
      {/* Alert Notice */}
      {error && (
        <div className="mb-6 rounded-2xl border border-red-100 bg-red-50/80 p-4 text-sm font-semibold text-red-700">
          {error}
        </div>
      )}

      {/* RENDER TAB: SERVICES */}
      {currentTab === "services" && (
        <div className="space-y-8 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">Meine Services</h1>
              <p className="text-sm text-slate-500 mt-1">Verwalten Sie Ihre aktiven Hosting-, Server- und Infrastruktur-Dienste oder buchen Sie neue Angebote.</p>
            </div>
            <button
              onClick={() => setActiveModal("new-service")}
              className="inline-flex items-center gap-2 rounded-xl bg-[#E63946] px-5 py-2.5 text-sm font-bold text-white shadow-md hover:bg-[#d02f3c] transition"
            >
              <PlusCircle className="h-4 w-4" /> Neues Paket bestellen
            </button>
          </div>

          {/* Active Services List */}
          <div className="rounded-[22px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100">
            <h2 className="text-lg font-bold text-[#0F172A] mb-4">Aktive Services</h2>
            {activeServices.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/60 p-8 text-center text-sm text-slate-500">
                Zurzeit sind keine aktiven Services vorhanden.
              </div>
            ) : (
              <div className="space-y-3">
                {activeServices.map((service) => (
                  <div key={service.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/40 transition">
                    <div className="flex items-center gap-3.5">
                      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                        <Server className="h-5 w-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-[#0F172A]">{service.productName || "REDWORK Service"}</p>
                          <span className="rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">AKTIV</span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{service.domainName || service.domainChoice || service.reference || `Bestellung #${service.id}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-slate-400">Startdatum: {fmtDate(service.activatedAt || service.createdAt)}</span>
                      <button
                        onClick={() => alert(`Service-Steuerung für #${service.id} wird geöffnet.`)}
                        className="rounded-lg bg-white border border-slate-200 px-3.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition shadow-sm"
                      >
                        Verwalten
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Marketplace (Services Catalog with German Product Specifications) */}
          <div className="rounded-[22px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100">
            <h2 className="text-lg font-bold text-[#0F172A] mb-1">Verfügbare Produkte & Tarife</h2>
            <p className="text-xs text-slate-500 mb-6">Wählen Sie das passende Hosting- oder Server-Paket für Ihre Anforderungen.</p>
            <ProductMarketplace embedded={true} />
          </div>
        </div>
      )}

      {/* RENDER TAB: ACCOUNT & PROFILE (Mein Konto) */}
      {(currentTab === "account" || currentTab === "security") && (
        <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-200">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">Mein Konto & Profileinstellungen</h1>
            <p className="text-sm text-slate-500 mt-1">Verwalten Sie Ihre persönlichen Angaben, Rechnungsadresse und Kontosicherheit.</p>
          </div>

          {profileMsg.text && (
            <div className={`p-4 rounded-2xl text-sm font-semibold border ${profileMsg.type === "success" ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}`}>
              {profileMsg.text}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-6">
            {/* Profil-Informationen */}
            <div className="rounded-[22px] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100">
              <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2 mb-5">
                <User className="h-5 w-5 text-[#FF7A00]" /> Persönliche Daten & Kontakt
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Vorname</label>
                  <input
                    type="text"
                    value={profileForm.firstName}
                    onChange={(e) => setProfileForm({ ...profileForm, firstName: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:bg-white focus:border-[#FF7A00] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Nachname</label>
                  <input
                    type="text"
                    value={profileForm.lastName}
                    onChange={(e) => setProfileForm({ ...profileForm, lastName: e.target.value })}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:bg-white focus:border-[#FF7A00] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">E-Mail-Adresse (schreibgeschützt)</label>
                  <input
                    type="email"
                    value={customer?.email || ""}
                    disabled
                    className="w-full rounded-xl border border-slate-200 bg-slate-100 px-3.5 py-2.5 text-sm font-medium text-slate-500 cursor-not-allowed outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Telefonnummer</label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                    placeholder="+41 ..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:bg-white focus:border-[#FF7A00] outline-none transition"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Firma / Organisation</label>
                  <input
                    type="text"
                    value={profileForm.company}
                    onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                    placeholder="z.B. Muster AG"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:bg-white focus:border-[#FF7A00] outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Rechnungsadresse */}
            <div className="rounded-[22px] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100">
              <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2 mb-5">
                <MapPin className="h-5 w-5 text-[#FF7A00]" /> Adresse & Rechnungsangaben
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Strasse & Hausnummer</label>
                  <input
                    type="text"
                    value={profileForm.address}
                    onChange={(e) => setProfileForm({ ...profileForm, address: e.target.value })}
                    placeholder="Musterstrasse 10"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:bg-white focus:border-[#FF7A00] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Ort</label>
                  <input
                    type="text"
                    value={profileForm.city}
                    onChange={(e) => setProfileForm({ ...profileForm, city: e.target.value })}
                    placeholder="Zürich"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:bg-white focus:border-[#FF7A00] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">PLZ</label>
                  <input
                    type="text"
                    value={profileForm.zip}
                    onChange={(e) => setProfileForm({ ...profileForm, zip: e.target.value })}
                    placeholder="8001"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:bg-white focus:border-[#FF7A00] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Land</label>
                  <input
                    type="text"
                    value={profileForm.country}
                    onChange={(e) => setProfileForm({ ...profileForm, country: e.target.value })}
                    placeholder="Schweiz (CH)"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:bg-white focus:border-[#FF7A00] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">UID / MWST-Nummer (optional)</label>
                  <input
                    type="text"
                    value={profileForm.vatNumber}
                    onChange={(e) => setProfileForm({ ...profileForm, vatNumber: e.target.value })}
                    placeholder="CHE-123.456.789"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:bg-white focus:border-[#FF7A00] outline-none transition"
                  />
                </div>
              </div>
            </div>

            {/* Sicherheit & Passwort ändern */}
            <div className="rounded-[22px] bg-white p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100">
              <h2 className="text-base font-bold text-[#0F172A] flex items-center gap-2 mb-5">
                <Lock className="h-5 w-5 text-[#FF7A00]" /> Sicherheit & Passwort ändern
              </h2>
              <div className="grid gap-4 sm:grid-cols-3">
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Aktuelles Passwort</label>
                  <input
                    type="password"
                    value={profileForm.currentPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, currentPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:bg-white focus:border-[#FF7A00] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Neues Passwort</label>
                  <input
                    type="password"
                    value={profileForm.newPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, newPassword: e.target.value })}
                    placeholder="Mindestens 8 Zeichen"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:bg-white focus:border-[#FF7A00] outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-600 mb-1.5">Neues Passwort bestätigen</label>
                  <input
                    type="password"
                    value={profileForm.confirmPassword}
                    onChange={(e) => setProfileForm({ ...profileForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm font-medium text-[#0F172A] focus:bg-white focus:border-[#FF7A00] outline-none transition"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Link to="/dashboard">
                <Button type="button" variant="outline" className="rounded-xl px-6">Abbrechen</Button>
              </Link>
              <Button type="submit" disabled={profileSaving} className="rounded-xl bg-[#E63946] hover:bg-[#d02f3c] px-8 text-white font-bold shadow-md">
                {profileSaving ? "Wird gespeichert..." : "Änderungen speichern"}
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* RENDER TAB: INVOICES (Rechnungen) */}
      {currentTab === "invoices" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[#0F172A]">Rechnungen</h1>
              <p className="text-sm text-slate-500 mt-1">Übersicht aller bezahlten und offenen Rechnungen. Laden Sie Belege als PDF herunter oder bezahlen Sie direkt online.</p>
            </div>
          </div>

          <div className="rounded-[22px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100">
            {allInvoices.length === 0 ? (
              <div className="py-12 text-center text-sm text-slate-500">Keine Rechnungen vorhanden.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-slate-100 text-xs font-bold uppercase text-slate-400">
                      <th className="pb-3.5 font-bold">Rechnungsnummer</th>
                      <th className="pb-3.5 font-bold">Datum</th>
                      <th className="pb-3.5 font-bold">Fälligkeitsdatum</th>
                      <th className="pb-3.5 font-bold">Betrag</th>
                      <th className="pb-3.5 font-bold">Status</th>
                      <th className="pb-3.5 text-right font-bold">Aktion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {allInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/60 transition">
                        <td className="py-4 font-black text-[#0F172A]">#{inv.number}</td>
                        <td className="py-4 text-slate-500">{fmtDate(inv.createdAt)}</td>
                        <td className="py-4 text-slate-500">{fmtDate(inv.dueDate)}</td>
                        <td className="py-4 font-bold text-[#0F172A]">{money(inv.total, inv.currency || currency)}</td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${inv.status === "paid" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {inv.status === "paid" ? "BEZAHLT" : "OFFEN"}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <a
                              href={`/api/admin/invoices/${inv.id}/pdf`}
                              target="_blank"
                              rel="noreferrer"
                              className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:bg-slate-50 hover:text-[#0F172A] transition"
                              title="PDF herunterladen"
                            >
                              <Download className="h-4 w-4" />
                            </a>
                            {inv.status !== "paid" && (
                              <button
                                onClick={() => handlePayInvoice(inv)}
                                className="rounded-lg bg-[#FF7A00] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#e66e00] transition"
                              >
                                Bezahlen
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* RENDER HOSTING VERWALTUNG TAB (Server-Steuerung) */}
      {currentTab === "servers" && (
        <div className="space-y-6 animate-in fade-in duration-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-2xl font-black text-[#0F172A] tracking-tight">Hosting-Verwaltung</h2>
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 border border-emerald-100 flex items-center gap-1.5">
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" /> WHM / cPanel Cloud
                </span>
              </div>
              <p className="mt-1 text-sm text-slate-500">
                Verwalten Sie Ihre aktiven Hosting-Accounts, cPanel-Zugänge, Speicherplatz und Server-Ressourcen.
              </p>
            </div>
            <div className="flex items-center gap-2.5">
              <button
                onClick={loadHostings}
                disabled={hostingsLoading}
                className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm transition"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${hostingsLoading ? "animate-spin text-[#FF7A00]" : "text-slate-500"}`} />
                <span>Aktualisieren</span>
              </button>
              <button
                onClick={() => setActiveModal("new-service")}
                className="flex items-center gap-2 rounded-xl bg-[#E63946] px-4 py-2 text-xs font-bold text-white hover:bg-[#d02f3c] shadow-sm transition"
              >
                <PlusCircle className="h-4 w-4" /> Neues Hosting buchen
              </button>
            </div>
          </div>

          {hostingsLoading && hostings.length === 0 ? (
            <div className="rounded-[24px] bg-white p-12 text-center shadow-sm border border-slate-100">
              <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#FF7A00] mb-3" />
              <p className="text-sm font-semibold text-slate-600">Hosting-Accounts werden geladen...</p>
            </div>
          ) : hostings.length === 0 ? (
            <div className="rounded-[24px] bg-white p-12 text-center shadow-sm border border-slate-100">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-50 text-[#FF7A00] mb-4">
                <Server className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-black text-[#0F172A]">Kein aktives Hosting-Konto gefunden</h3>
              <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
                Sie haben aktuell noch keinen aktiven Hosting-Server eingerichtet. Wählen Sie eines unserer schnellen Schweizer Webhosting-Pakete.
              </p>
              <div className="mt-6 flex justify-center gap-3">
                <Link to="/dashboard">
                  <Button variant="outline" className="rounded-xl">Zum Dashboard</Button>
                </Link>
                <button
                  onClick={() => setActiveModal("new-service")}
                  className="rounded-xl bg-[#FF7A00] px-5 py-2 text-sm font-bold text-white hover:bg-[#e66e00] shadow-md transition"
                >
                  Hosting-Paket wählen
                </button>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {hostings.map((h) => {
                const diskPercent = Math.min(100, Math.round(((h.diskUsedMb || 2450) / (h.diskLimitMb || 20000)) * 100));
                const bwPercent = Math.min(100, Math.round(((h.bandwidthUsedMb || 12400) / (h.bandwidthLimitMb || 100000)) * 100));
                const isOnline = h.serverStatus === "online" || !h.serverStatus;

                return (
                  <div
                    key={h.id}
                    className="rounded-[26px] bg-white p-6 shadow-sm border border-slate-100/80 hover:shadow-md transition-all duration-200 flex flex-col justify-between"
                  >
                    <div>
                      {/* Card Top Header */}
                      <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-100">
                        <div className="flex items-center gap-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF4ED] text-[#FF7A00] shadow-inner">
                            <Server className="h-6 w-6" />
                          </div>
                          <div>
                            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#FF7A00]">
                              {h.package || "Business Hosting"}
                            </span>
                            <h3 className="text-lg font-black text-[#0F172A] flex items-center gap-2">
                              {h.domain}
                              <a
                                href={`https://${h.domain}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-slate-400 hover:text-slate-700 transition"
                                title="Website in neuem Tab öffnen"
                              >
                                <ExternalLink className="h-3.5 w-3.5" />
                              </a>
                            </h3>
                          </div>
                        </div>

                        <div className="flex flex-col items-end gap-1.5">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                              h.status === "active"
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200/60"
                                : h.status === "suspended"
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {h.status === "active" ? "Aktiv" : h.status === "suspended" ? "Gesperrt" : "Ausstehend"}
                          </span>

                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
                            <span className={`h-2 w-2 rounded-full ${isOnline ? "bg-emerald-500" : "bg-red-500"}`} />
                            {isOnline ? "Server Online" : "Offline"}
                          </span>
                        </div>
                      </div>

                      {/* Technical Specs Grid */}
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 py-4 text-xs">
                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100/60">
                          <p className="text-slate-400 font-medium">cPanel Benutzer</p>
                          <p className="font-mono font-bold text-[#0F172A] mt-0.5 truncate">{h.cpanelUsername}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100/60">
                          <p className="text-slate-400 font-medium">Server Hostname</p>
                          <p className="font-bold text-[#0F172A] mt-0.5 truncate">{h.serverHostname || "server.redwork.ch"}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100/60">
                          <p className="text-slate-400 font-medium">IP-Adresse</p>
                          <p className="font-mono font-bold text-[#0F172A] mt-0.5">{h.serverIp || "178.254.22.30"}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100/60">
                          <p className="text-slate-400 font-medium">SSL-Zertifikat</p>
                          <p className="font-bold text-emerald-600 mt-0.5 flex items-center gap-1">
                            <ShieldCheck className="h-3.5 w-3.5" /> Aktiv (AutoSSL)
                          </p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100/60">
                          <p className="text-slate-400 font-medium">PHP-Version</p>
                          <p className="font-bold text-[#0F172A] mt-0.5">{h.phpVersion || "PHP 8.2"}</p>
                        </div>
                        <div className="rounded-xl bg-slate-50 p-2.5 border border-slate-100/60">
                          <p className="text-slate-400 font-medium">Laufzeit bis</p>
                          <p className="font-bold text-[#0F172A] mt-0.5">{fmtDate(h.renewalDate || h.startDate)}</p>
                        </div>
                      </div>

                      {/* Resource Bars */}
                      <div className="space-y-3 pt-1 pb-3">
                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-slate-600 flex items-center gap-1.5">
                              <HardDrive className="h-3.5 w-3.5 text-slate-400" /> Speicherplatz
                            </span>
                            <span className="text-[#0F172A] font-bold">
                              {((h.diskUsedMb || 2450) / 1024).toFixed(1)} GB / {((h.diskLimitMb || 20000) / 1024).toFixed(0)} GB ({diskPercent}%)
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#FF7A00] to-[#E63946] transition-all duration-300"
                              style={{ width: `${diskPercent}%` }}
                            />
                          </div>
                        </div>

                        <div>
                          <div className="flex justify-between text-xs font-semibold mb-1">
                            <span className="text-slate-600 flex items-center gap-1.5">
                              <Activity className="h-3.5 w-3.5 text-slate-400" /> Monatlicher Traffic
                            </span>
                            <span className="text-[#0F172A] font-bold">
                              {((h.bandwidthUsedMb || 12400) / 1024).toFixed(1)} GB / {((h.bandwidthLimitMb || 100000) / 1024).toFixed(0)} GB ({bwPercent}%)
                            </span>
                          </div>
                          <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${bwPercent}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="pt-4 border-t border-slate-100 flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={() => handleCpanelSSO(h)}
                        disabled={ssoLoading[h.id]}
                        className="flex-1 min-w-[130px] inline-flex items-center justify-center gap-2 rounded-xl bg-[#FF7A00] px-4 py-2.5 text-xs font-extrabold text-white shadow-[0_4px_12px_rgba(255,122,0,0.25)] hover:bg-[#e66e00] hover:scale-[1.01] active:scale-[0.99] transition"
                      >
                        {ssoLoading[h.id] ? (
                          <RefreshCw className="h-4 w-4 animate-spin" />
                        ) : (
                          <ExternalLink className="h-4 w-4" />
                        )}
                        <span>Zum cPanel</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedHosting(h);
                          setCredModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
                      >
                        <KeyRound className="h-3.5 w-3.5 text-slate-500" />
                        <span>Zugangsdaten</span>
                      </button>

                      <button
                        onClick={() => {
                          setSelectedHosting(h);
                          setPwdMsg({ type: "", text: "" });
                          setNewPwd("");
                          setConfirmPwd("");
                          setPwdModalOpen(true);
                        }}
                        className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-sm"
                      >
                        <Lock className="h-3.5 w-3.5 text-slate-500" />
                        <span>Passwort ändern</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* RENDER OTHER TABS (Generic Empty State in Dashboard Layout) */}
      {["licenses", "domains", "backorder", "offers", "affiliate"].includes(currentTab) && (
        <div className="rounded-[22px] bg-white p-12 text-center shadow-[0_4px_24px_rgba(0,0,0,0.03)] border border-slate-100 animate-in fade-in duration-200">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-50 text-slate-400 mb-4">
            <Layers className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-[#0F172A]">
            {currentTab === "licenses" && "Meine Lizenzen"}
            {currentTab === "domains" && "Meine Domains"}
            {currentTab === "backorder" && "Backorder-Dienste"}
            {currentTab === "offers" && "Meine Offerten"}
            {currentTab === "affiliate" && "Partnerprogramm"}
          </h2>
          <p className="mt-2 text-sm text-slate-500 max-w-md mx-auto">
            In dieser Kategorie sind zurzeit keine aktiven Einträge vorhanden. Nutzen Sie die Schnellzugriffe, um neue Dienste zu buchen.
          </p>
          <div className="mt-6 flex justify-center gap-3">
            <Link to="/dashboard">
              <Button variant="outline" className="rounded-xl">Zum Dashboard</Button>
            </Link>
            <button
              onClick={() => setActiveModal("new-service")}
              className="rounded-xl bg-[#E63946] px-5 py-2 text-sm font-bold text-white hover:bg-[#d02f3c] transition shadow-md"
            >
              Service buchen
            </button>
          </div>
        </div>
      )}

      {/* RENDER MAIN DASHBOARD VIEW (Übersicht / Dashboard) */}
      {currentTab === "dashboard" && (
        <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-200">
          
          {/* 1. HERO BANNER */}
          <section className="relative overflow-hidden rounded-[26px] bg-gradient-to-r from-[#181D29] via-[#1C2333] to-[#121620] p-7 sm:p-9 text-white shadow-[0_16px_40px_rgba(0,0,0,0.12)]">
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              
              {/* Links: Begrüssung & Badges */}
              <div>
                <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex items-center gap-3">
                  Hallo, {customer?.firstName || "Kunde"} <span className="inline-block animate-wave">👋</span>
                </h1>
                <p className="mt-2 text-sm font-medium text-slate-300">
                  Hier behalten Sie Ihre Services, Domains und bevorstehenden Verlängerungen im Blick.
                </p>

                {/* Mini Badges */}
                <div className="mt-5 flex flex-wrap items-center gap-2.5 text-xs font-semibold">
                  <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-white/90 backdrop-blur-md border border-white/10 shadow-sm">
                    <Server className="h-3.5 w-3.5 text-blue-400" />
                    <span>{activeServices.length} aktive Services</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-white/90 backdrop-blur-md border border-white/10 shadow-sm">
                    <Globe className="h-3.5 w-3.5 text-cyan-400" />
                    <span>{domains.length} Domains</span>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-white/90 backdrop-blur-md border border-white/10 shadow-sm">
                    <FileText className="h-3.5 w-3.5 text-amber-400" />
                    <span>{openInvoices.length} offene Rechnungen</span>
                  </div>
                </div>
              </div>

              {/* Rechts: Aktion-Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                {openInvoices.length > 0 && (
                  <button
                    onClick={() => {
                      const el = document.getElementById("unpaid-invoices-table");
                      if (el) el.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#FF7A00] px-6 py-3.5 text-sm font-black text-white shadow-[0_6px_20px_rgba(255,122,0,0.35)] hover:bg-[#e66e00] hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    <CreditCard className="h-4 w-4" /> Rechnungen bezahlen ({money(unpaidTotal, currency)})
                  </button>
                )}

                <Link
                  to="/support"
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white text-[#0F172A] px-6 py-3.5 text-sm font-bold shadow-md hover:bg-slate-50 hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <Headphones className="h-4 w-4 text-slate-700" /> Ticket erstellen
                </Link>
              </div>

            </div>
          </section>

          {/* 2. SCHNELLZUGRIFF (Quick Actions, 4 Kacheln) */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
            <button
              onClick={() => setActiveModal("new-service")}
              className="group flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 rounded-[20px] bg-white p-4 sm:p-5 text-center sm:text-left border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF7A00] group-hover:scale-110 transition-transform">
                <PlusCircle className="h-5 w-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0F172A]">Neuen Service buchen</span>
            </button>

            <button
              onClick={() => setActiveModal("domain-search")}
              className="group flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 rounded-[20px] bg-white p-4 sm:p-5 text-center sm:text-left border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF7A00] group-hover:scale-110 transition-transform">
                <Globe className="h-5 w-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0F172A]">Domain prüfen</span>
            </button>

            <button
              onClick={() => setActiveModal("topup")}
              className="group flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 rounded-[20px] bg-white p-4 sm:p-5 text-center sm:text-left border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF7A00] group-hover:scale-110 transition-transform">
                <Wallet className="h-5 w-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0F172A]">Guthaben aufladen</span>
            </button>

            <button
              onClick={() => setActiveModal("downloads")}
              className="group flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-3 rounded-[20px] bg-white p-4 sm:p-5 text-center sm:text-left border border-slate-100 shadow-[0_4px_16px_rgba(0,0,0,0.02)] hover:shadow-lg hover:-translate-y-0.5 transition-all"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-[#FF7A00] group-hover:scale-110 transition-transform">
                <Download className="h-5 w-5" />
              </div>
              <span className="text-xs sm:text-sm font-bold text-[#0F172A]">Downloads & Belege</span>
            </button>
          </section>

          {/* 3. KPI STAT CARDS */}
          <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            
            {/* 1: Aktive Services */}
            <div className="rounded-[24px] bg-white p-6 sm:p-7 text-center border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#735FFA] text-white shadow-sm">
                <Server className="h-6 w-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#0F172A] leading-none">{activeServices.length}</p>
              <p className="mt-2 text-xs sm:text-sm font-bold text-slate-500">Aktive Services</p>
            </div>

            {/* 2: Domains */}
            <div className="rounded-[24px] bg-white p-6 sm:p-7 text-center border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#0EA5E9] text-white shadow-sm">
                <Globe className="h-6 w-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#0F172A] leading-none">{domains.length}</p>
              <p className="mt-2 text-xs sm:text-sm font-bold text-slate-500">Aktive Domains</p>
            </div>

            {/* 3: Offene Rechnungen */}
            <div className="rounded-[24px] bg-white p-6 sm:p-7 text-center border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#F59E0B] text-white shadow-sm">
                <FileText className="h-6 w-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#0F172A] leading-none">{openInvoices.length}</p>
              <p className="mt-2 text-xs sm:text-sm font-bold text-slate-500">Offene Rechnungen</p>
            </div>

            {/* 4: Guthaben */}
            <div className="rounded-[24px] bg-white p-6 sm:p-7 text-center border border-slate-100 shadow-[0_4px_24px_rgba(0,0,0,0.02)] hover:shadow-md transition-all">
              <div className="mx-auto mb-3.5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#10B981] text-white shadow-sm">
                <Wallet className="h-6 w-6" />
              </div>
              <p className="text-2xl sm:text-3xl font-black text-[#0F172A] leading-none">{money(balance, currency)}</p>
              <p className="mt-2 text-xs sm:text-sm font-bold text-slate-500">Mein Guthaben</p>
            </div>

          </section>

          {/* 4. UNTERER BEREICH (Nächste Verlängerungen & Letzte Zahlungen / Aktivitäten) */}
          <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
            
            {/* LINKS: Nächste Verlängerungen */}
            <div className="rounded-[24px] bg-white p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-[#0EA5E9]" />
                    <h2 className="font-bold text-[#0F172A] text-base">Nächste Verlängerungen</h2>
                  </div>
                  <Link to="/dashboard?tab=services" className="text-xs font-bold text-[#FF7A00] hover:underline">
                    Alle anzeigen
                  </Link>
                </div>

                {upcomingRenewals.length === 0 ? (
                  <div className="py-12 text-center">
                    <div className="mx-auto mb-3 flex h-8 w-8 items-center justify-center rounded-full text-slate-300">
                      ✓
                    </div>
                    <p className="font-bold text-[#0F172A] text-sm">Keine anstehenden Verlängerungen</p>
                    <p className="text-xs text-slate-400 mt-1">In den nächsten 30 Tagen stehen keine Verlängerungen an.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {upcomingRenewals.map((item) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-50/50 border border-slate-100">
                        <div>
                          <p className="text-sm font-bold text-[#0F172A]">{item.name}</p>
                          <p className="text-xs text-slate-400">{item.domain}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[#0F172A]">{money(item.amount, currency)}</p>
                          <p className="text-xs text-slate-400">{fmtDate(item.renewalDate)}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RECHTS: Letzte Zahlungen & Aktivitäten */}
            <div className="space-y-6">
              
              {/* Letzte Zahlungen */}
              <div className="rounded-[24px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <CreditCard className="h-4 w-4 text-[#0EA5E9]" />
                  <h2 className="font-bold text-[#0F172A] text-base">Letzte Zahlungen</h2>
                </div>
                {recentPayments.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    Noch keine Zahlungen vorhanden.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {recentPayments.map((p) => (
                      <div key={p.id} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="font-bold text-[#0F172A]">Rechnung #{p.number}</p>
                          <p className="text-slate-400">{fmtDate(p.date)}</p>
                        </div>
                        <span className="font-black text-emerald-600">+{money(p.amount, p.currency)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Letzte Aktivitäten */}
              <div className="rounded-[24px] bg-white p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3 mb-4">
                  <Activity className="h-4 w-4 text-[#735FFA]" />
                  <h2 className="font-bold text-[#0F172A] text-base">Letzte Aktivitäten</h2>
                </div>
                {recentActivities.length === 0 ? (
                  <div className="py-6 text-center text-xs text-slate-400">
                    Noch keine Aktivitäten vorhanden.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recentActivities.map((act, i) => (
                      <div key={i} className="flex items-start justify-between text-xs">
                        <span className="text-slate-600 font-medium">{act.message}</span>
                        <span className="text-slate-400 shrink-0 ml-2">{fmtDate(act.date)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* 5. OFFENE RECHNUNGEN (Tabelle) */}
          <section id="unpaid-invoices-table" className="rounded-[24px] bg-white p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border border-slate-100">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-4 mb-4">
              <FileText className="h-4 w-4 text-[#0EA5E9]" />
              <h2 className="font-bold text-[#0F172A] text-base">Offene Rechnungen</h2>
            </div>

            {openInvoices.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Keine offenen Rechnungen vorhanden.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="text-slate-400 font-bold uppercase text-[11px] border-b border-slate-100">
                      <th className="pb-3">Rechnung</th>
                      <th className="pb-3">Fälligkeit</th>
                      <th className="pb-3 text-right">Betrag</th>
                      <th className="pb-3 text-right">Aktion</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {openInvoices.map((inv) => (
                      <tr key={inv.id} className="hover:bg-slate-50/50 transition">
                        <td className="py-3.5 font-bold text-[#FF7A00]">
                          <a href={`/api/admin/invoices/${inv.id}/pdf`} target="_blank" rel="noreferrer" className="hover:underline">
                            {inv.number || `INV-${inv.id}`}
                          </a>
                        </td>
                        <td className="py-3.5">
                          <span className="inline-block rounded-full bg-[#FFF4ED] px-3 py-1 font-bold text-[#FF7A00] text-xs">
                            {fmtDate(inv.dueDate)}
                          </span>
                        </td>
                        <td className="py-3.5 text-right font-black text-[#0F172A]">
                          {money(inv.total, inv.currency || currency)}
                        </td>
                        <td className="py-3.5 text-right">
                          <button
                            onClick={() => handlePayInvoice(inv)}
                            className="rounded-xl bg-[#FF7A00] px-4 py-1.5 text-xs font-bold text-white hover:bg-[#e66e00] shadow-sm transition"
                          >
                            Bezahlen
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

        </div>
      )}

      {/* QUICK ACTION MODALS */}
      {/* 1. Neuen Service buchen */}
      {activeModal === "new-service" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4 mb-6">
              <div>
                <h3 className="text-xl font-bold text-[#0F172A]">Service auswählen</h3>
                <p className="text-xs text-slate-500 mt-1">Wählen Sie das passende Hosting- oder Server-Paket für Ihre Ansprüche.</p>
              </div>
              <button onClick={() => setActiveModal(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            <ProductMarketplace embedded={true} />
          </div>
        </div>
      )}

      {/* 2. Domain prüfen */}
      {activeModal === "domain-search" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <h3 className="text-lg font-bold text-[#0F172A]">Domain prüfen & registrieren</h3>
              <button onClick={() => setActiveModal(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Geben Sie Ihren gewünschten Domainnamen ein (.ch, .com, .de etc.):</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="ihredomain.ch"
                  value={domainSearchQuery}
                  onChange={(e) => setDomainSearchQuery(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#FF7A00]"
                />
                <button
                  onClick={() => {
                    if (!domainSearchQuery.trim()) return;
                    alert(`Die Domain "${domainSearchQuery}" ist verfügbar! Sie werden zum Bestellprozess weitergeleitet.`);
                    setActiveModal(null);
                    navigate("/dashboard?tab=services");
                  }}
                  className="rounded-xl bg-[#FF7A00] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#e66e00]"
                >
                  Prüfen
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Guthaben aufladen */}
      {activeModal === "topup" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <h3 className="text-lg font-bold text-[#0F172A]">Guthaben aufladen</h3>
              <button onClick={() => { setActiveModal(null); setTopupSuccess(false); }} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            {topupSuccess ? (
              <div className="text-center py-6">
                <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <p className="font-bold text-[#0F172A]">Zahlungsvorgang gestartet</p>
                <p className="text-xs text-slate-500 mt-1">Nach erfolgreicher Zahlung wird Ihr Guthaben automatisch gutgeschrieben.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-500">Wählen oder erfassen Sie den gewünschten Betrag ({currency}):</p>
                <div className="grid grid-cols-3 gap-2">
                  {["50", "100", "250"].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => setTopupAmount(amt)}
                      className={`py-2 rounded-xl text-sm font-bold border ${topupAmount === amt ? "bg-[#FFF4ED] text-[#FF7A00] border-[#FF7A00]" : "border-slate-200 text-slate-700"}`}
                    >
                      {amt} {currency}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  value={topupAmount}
                  onChange={(e) => setTopupAmount(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold outline-none focus:border-[#FF7A00]"
                />
                <button
                  onClick={() => setTopupSuccess(true)}
                  className="w-full rounded-xl bg-[#FF7A00] py-3 text-sm font-bold text-white hover:bg-[#e66e00]"
                >
                  Zur Zahlung ({topupAmount} {currency})
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Downloads & Belege */}
      {activeModal === "downloads" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <h3 className="text-lg font-bold text-[#0F172A]">Downloads & Belege</h3>
              <button onClick={() => setActiveModal(null)} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">✕</button>
            </div>
            {documents.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">
                Keine Dokumente zurzeit verfügbar.
              </div>
            ) : (
              <div className="space-y-2.5 max-h-80 overflow-y-auto">
                {documents.map((doc) => (
                  <div key={doc.id} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="text-sm font-bold text-[#0F172A]">{doc.title}</p>
                        <p className="text-xs text-slate-400">{fmtDate(doc.date)}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDownloadDoc(doc)}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-white border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 shadow-sm"
                    >
                      <Download className="h-3.5 w-3.5" /> Herunterladen
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. Hosting-Zugangsdaten Modal */}
      {credModalOpen && selectedHosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-lg rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                  <KeyRound className="h-5 w-5 text-[#FF7A00]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0F172A]">Hosting-Zugangsdaten</h3>
                  <p className="text-xs text-slate-400 font-medium">{selectedHosting.domain}</p>
                </div>
              </div>
              <button
                onClick={() => setCredModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Domain */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-slate-400 font-medium">Hauptdomain</p>
                  <p className="font-bold text-[#0F172A] text-sm mt-0.5">{selectedHosting.domain}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedHosting.domain, "domain")}
                  className="flex items-center gap-1 text-slate-500 hover:text-[#FF7A00] font-bold"
                >
                  {copiedField === "domain" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedField === "domain" ? "Kopiert" : "Kopieren"}</span>
                </button>
              </div>

              {/* cPanel Username */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-slate-400 font-medium">cPanel Benutzername</p>
                  <p className="font-mono font-bold text-[#0F172A] text-sm mt-0.5">{selectedHosting.cpanelUsername}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedHosting.cpanelUsername, "user")}
                  className="flex items-center gap-1 text-slate-500 hover:text-[#FF7A00] font-bold"
                >
                  {copiedField === "user" ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  <span>{copiedField === "user" ? "Kopiert" : "Kopieren"}</span>
                </button>
              </div>

              {/* Password notice */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <p className="text-slate-400 font-medium">Passwort</p>
                  <p className="font-mono font-bold text-slate-500 text-sm mt-0.5">••••••••••••••••</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Aus Sicherheitsgründen wird das Passwort nicht im Klartext gespeichert.</p>
                </div>
                <button
                  onClick={() => {
                    setCredModalOpen(false);
                    setPwdMsg({ type: "", text: "" });
                    setNewPwd("");
                    setConfirmPwd("");
                    setPwdModalOpen(true);
                  }}
                  className="rounded-lg bg-slate-900 text-white px-3 py-1.5 font-bold hover:bg-slate-800 transition"
                >
                  Ändern
                </button>
              </div>

              {/* Server Hostname & IP */}
              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-medium">Server Hostname</p>
                  <p className="font-mono font-bold text-[#0F172A] mt-0.5">{selectedHosting.serverHostname || "server.redwork.ch"}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                  <p className="text-slate-400 font-medium">IP-Adresse</p>
                  <p className="font-mono font-bold text-[#0F172A] mt-0.5">{selectedHosting.serverIp || "178.254.22.30"}</p>
                </div>
              </div>

              {/* Nameservers */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-slate-400 font-medium mb-1">Nameserver</p>
                <div className="space-y-0.5 font-mono font-bold text-[#0F172A]">
                  <p>ns1.redwork.ch (178.254.22.30)</p>
                  <p>ns2.redwork.ch (178.254.22.30)</p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2.5">
              <Button
                variant="outline"
                onClick={() => setCredModalOpen(false)}
                className="rounded-xl text-xs font-bold"
              >
                Schliessen
              </Button>
              <button
                onClick={() => {
                  setCredModalOpen(false);
                  handleCpanelSSO(selectedHosting);
                }}
                className="rounded-xl bg-[#FF7A00] text-white px-4 py-2 text-xs font-bold hover:bg-[#e66e00] transition shadow-sm inline-flex items-center gap-1.5"
              >
                <ExternalLink className="h-3.5 w-3.5" /> Zum cPanel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Hosting Passwort Ändern Modal */}
      {pwdModalOpen && selectedHosting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 sm:p-8 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b pb-4 mb-5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-100 text-slate-800">
                  <Lock className="h-5 w-5 text-[#E63946]" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-[#0F172A]">Hosting-Passwort ändern</h3>
                  <p className="text-xs text-slate-400 font-medium">{selectedHosting.domain}</p>
                </div>
              </div>
              <button
                onClick={() => setPwdModalOpen(false)}
                className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleHostingPasswordChange} className="space-y-4 text-xs">
              {pwdMsg.text && (
                <div
                  className={`p-3 rounded-xl border text-xs font-bold flex items-center gap-2 ${
                    pwdMsg.type === "success"
                      ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                      : "bg-red-50 text-red-800 border-red-200"
                  }`}
                >
                  {pwdMsg.type === "success" ? <Check className="h-4 w-4 shrink-0" /> : <AlertTriangle className="h-4 w-4 shrink-0" />}
                  <span>{pwdMsg.text}</span>
                </div>
              )}

              <div className="rounded-xl bg-amber-50 border border-amber-200/60 p-3 text-amber-800 leading-relaxed">
                <p className="font-bold flex items-center gap-1 mb-1">
                  <Shield className="h-3.5 w-3.5 text-amber-600" /> Sicherheitshinweis
                </p>
                Ihr bisheriges cPanel-Passwort kann aus Sicherheitsgründen nicht ausgelesen werden. Bitte legen Sie ein neues, sicheres Passwort fest.
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Neues Passwort</label>
                <div className="relative">
                  <input
                    type={showNewPwd ? "text" : "password"}
                    required
                    value={newPwd}
                    onChange={(e) => setNewPwd(e.target.value)}
                    placeholder="Mindestens 8 Zeichen"
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPwd(!showNewPwd)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-700"
                  >
                    {showNewPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Strength Meter */}
                {newPwd && (
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <div className={`h-1.5 flex-1 rounded-full ${newPwd.length >= 12 ? "bg-emerald-500" : newPwd.length >= 8 ? "bg-amber-500" : "bg-red-500"}`} />
                    <span className="text-[10px] font-bold text-slate-400">
                      {newPwd.length >= 12 ? "Sehr stark" : newPwd.length >= 8 ? "Mittel" : "Zu kurz"}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-slate-600 font-bold mb-1">Passwort bestätigen</label>
                <input
                  type={showNewPwd ? "text" : "password"}
                  required
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Passwort erneut eingeben"
                  className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:border-slate-900 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2.5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setPwdModalOpen(false)}
                  className="rounded-xl text-xs font-bold"
                >
                  Abbrechen
                </Button>
                <button
                  type="submit"
                  disabled={pwdSaving}
                  className="rounded-xl bg-[#E63946] text-white px-5 py-2.5 text-xs font-bold hover:bg-[#d02f3c] transition shadow-md inline-flex items-center gap-1.5 disabled:opacity-50"
                >
                  {pwdSaving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                  <span>{pwdSaving ? "Wird gespeichert..." : "Passwort ändern"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </CustomerShell>
  );
}
