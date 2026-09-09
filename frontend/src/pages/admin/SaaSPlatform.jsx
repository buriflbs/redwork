import React, { useMemo, useState, useEffect } from "react";
import { Activity, AlertTriangle, BadgeCheck, Check, CreditCard, ExternalLink, Gavel, HardDrive, KeyRound, Lock, PlayCircle, Plus, RefreshCw, Search, Server, ShieldCheck, TerminalSquare, Users, Zap } from "lucide-react";
import api from "../../api";

const initialServers = [
  { name: "WHM Cloud-01 (Schweiz)", host: "server.redwork.ch", status: "online", load: "0.28", accounts: 24, disk: "42%", api: "WHM API aktiv" },
  { name: "WHM Backup Node", host: "backup.redwork.ch", status: "sync", load: "0.14", accounts: 24, disk: "38%", api: "Nur Sync" },
];

const whmActions = ["createacct", "suspendacct", "unsuspendacct", "removeacct", "listaccts", "create_user_session", "passwd"];

export default function SaaSPlatform() {
  const [query, setQuery] = useState("");
  const [hostingAccounts, setHostingAccounts] = useState([]);
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [actionMsg, setActionMsg] = useState("");

  const loadData = async () => {
    try {
      setLoading(true);
      const [accRes, ovRes] = await Promise.all([
        api.get("/admin/hosting-accounts"),
        api.get("/admin/saas/overview")
      ]);
      setHostingAccounts(accRes.data || []);
      setOverview(ovRes.data || {});
    } catch (err) {
      console.warn("Failed to load SaaS admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleToggleSuspend = async (ha) => {
    const isSuspended = ha.status === "suspended";
    const endpoint = isSuspended ? "unsuspend" : "suspend";
    try {
      setActionLoading((prev) => ({ ...prev, [ha.id]: true }));
      await api.post(`/admin/hosting-accounts/${ha.id}/${endpoint}`);
      setActionMsg(`Hosting ${ha.domain} erfolgreich ${isSuspended ? "aktiviert" : "gesperrt"}.`);
      loadData();
      setTimeout(() => setActionMsg(""), 3000);
    } catch (err) {
      alert(err.response?.data?.detail || "Aktion fehlgeschlagen.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [ha.id]: false }));
    }
  };

  const handleAdminSSO = async (ha) => {
    try {
      setActionLoading((prev) => ({ ...prev, [ha.id]: true }));
      const res = await api.post(`/admin/hosting-accounts/${ha.id}/sso`);
      if (res.data?.url) {
        window.open(res.data.url, "_blank", "noopener,noreferrer");
      }
    } catch (err) {
      alert(err.response?.data?.detail || "cPanel SSO fehlgeschlagen.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [ha.id]: false }));
    }
  };

  const handleResetPassword = async (ha) => {
    const newPass = window.prompt(`Neues Passwort für ${ha.cpanelUsername} eingeben (min. 8 Zeichen):`);
    if (!newPass) return;
    if (newPass.length < 8) {
      alert("Das Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }

    try {
      setActionLoading((prev) => ({ ...prev, [ha.id]: true }));
      await api.post(`/admin/hosting-accounts/${ha.id}/reset-password`, { newPassword: newPass });
      alert("Hosting-Passwort wurde über WHM erfolgreich geändert!");
    } catch (err) {
      alert(err.response?.data?.detail || "Passwort-Reset fehlgeschlagen.");
    } finally {
      setActionLoading((prev) => ({ ...prev, [ha.id]: false }));
    }
  };

  const filteredAccounts = useMemo(() => {
    const q = query.toLowerCase();
    return hostingAccounts.filter((ha) =>
      `${ha.domain} ${ha.cpanelUsername} ${ha.customerName || ""} ${ha.package || ""}`.toLowerCase().includes(q)
    );
  }, [hostingAccounts, query]);

  return (
    <div className="min-h-screen text-slate-950">
      <div className="rounded-[34px] bg-gradient-to-br from-slate-950 via-slate-900 to-black p-6 sm:p-8 text-white shadow-[0_30px_120px_rgba(15,23,42,0.35)] overflow-hidden relative">
        <div className="absolute right-0 top-0 h-64 w-64 rounded-full bg-[#E63946]/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-black uppercase tracking-[0.25em] text-red-200"><Server size={15} /> SaaS Hosting Control Center</span>
            <h1 className="mt-5 max-w-4xl text-4xl sm:text-5xl font-black tracking-tight">WHMCS-Level Plattform für Hosting, Webdesign, Domains und Provisionierung</h1>
            <p className="mt-4 max-w-3xl text-slate-300 leading-7">Ein modernes Adminpanel als zentrale Steuerung für Kunden, Pakete, WHM/cPanel Server, Stripe/TWINT Zahlungen, Domain-Auktionen, Rechnungen, Tickets und Systemlogs.</p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 xl:w-[520px]">
            {[{k:'Kunden',v:'1.542',i:Users},{k:'Hosting',v:'3.287',i:HardDrive},{k:'MRR',v:'CHF 45k',i:Activity},{k:'Uptime',v:'99.99%',i:ShieldCheck}].map((item)=>{const Icon=item.i;return <div key={item.k} className="rounded-2xl border border-white/10 bg-white/5 p-4"><Icon size={20} className="text-red-300"/><p className="mt-3 text-2xl font-black">{item.v}</p><p className="text-xs text-slate-400">{item.k}</p></div>})}
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-3">
        {modules.map((m) => { const Icon = m.icon; return (
          <div key={m.title} className="rounded-[28px] bg-white p-6 shadow-card border border-slate-100 hover:-translate-y-1 transition">
            <div className="flex items-start justify-between gap-4"><div className="w-12 h-12 rounded-2xl bg-slate-950 text-white flex items-center justify-center"><Icon size={22}/></div><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{m.status}</span></div>
            <h3 className="mt-5 text-xl font-black">{m.title}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{m.text}</p>
          </div>
        )})}
      </div>

      {/* Action Notification Alert */}
      {actionMsg && (
        <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-bold flex items-center gap-2">
          <Check className="h-5 w-5 text-emerald-600" /> {actionMsg}
        </div>
      )}

      {/* Real Customer Hosting Accounts Table */}
      <section className="mt-8 rounded-[32px] bg-white p-6 shadow-card border border-slate-100">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl font-black">Kunden Hosting-Accounts</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {hostingAccounts.length} aktiv verknüpft
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Verwaltung aller Kunden-Hostings, cPanel-Benutzer, Status und direkter SSO-Zugang.</p>
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-3 text-slate-400"/>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Domain / Kunde suchen..."
                className="rounded-xl border border-slate-200 pl-9 pr-3 py-2 text-sm outline-none focus:border-slate-900"
              />
            </div>
            <button
              onClick={loadData}
              className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-x-auto rounded-2xl border border-slate-100">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-extrabold">
              <tr>
                <th className="p-4">Domain & Paket</th>
                <th className="p-4">Kunde</th>
                <th className="p-4">cPanel User</th>
                <th className="p-4">Status</th>
                <th className="p-4">Speicher</th>
                <th className="p-4 text-right">Aktionen</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredAccounts.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 text-xs font-medium">
                    Keine Kunden-Hosting-Accounts gefunden.
                  </td>
                </tr>
              ) : (
                filteredAccounts.map((ha) => {
                  const isSuspended = ha.status === "suspended";
                  return (
                    <tr key={ha.id} className="hover:bg-slate-50/70 transition">
                      <td className="p-4">
                        <a
                          href={`https://${ha.domain}`}
                          target="_blank"
                          rel="noreferrer"
                          className="font-bold text-[#0F172A] hover:text-[#FF7A00] flex items-center gap-1.5"
                        >
                          {ha.domain} <ExternalLink size={12} className="text-slate-400" />
                        </a>
                        <p className="text-xs text-slate-500">{ha.package || "Webhosting"}</p>
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-[#0F172A]">{ha.customerName || "Kunde"}</p>
                        <p className="text-xs text-slate-500">{ha.customerEmail}</p>
                      </td>
                      <td className="p-4 font-mono font-bold text-slate-700">
                        {ha.cpanelUsername}
                      </td>
                      <td className="p-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                            ha.status === "active"
                              ? "bg-emerald-50 text-emerald-700"
                              : isSuspended
                              ? "bg-red-50 text-red-700"
                              : "bg-amber-50 text-amber-700"
                          }`}
                        >
                          {ha.status === "active" ? "Aktiv" : isSuspended ? "Gesperrt" : "Ausstehend"}
                        </span>
                      </td>
                      <td className="p-4 text-xs font-semibold text-slate-600">
                        {((ha.diskUsedMb || 2450) / 1024).toFixed(1)} GB / {((ha.diskLimitMb || 20000) / 1024).toFixed(0)} GB
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleAdminSSO(ha)}
                            disabled={actionLoading[ha.id]}
                            className="rounded-lg bg-slate-900 text-white px-2.5 py-1.5 text-xs font-bold hover:bg-slate-800 transition"
                            title="Direkt ins cPanel einloggen"
                          >
                            cPanel
                          </button>
                          <button
                            onClick={() => handleResetPassword(ha)}
                            disabled={actionLoading[ha.id]}
                            className="rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50 transition"
                            title="Passwort über WHM neu setzen"
                          >
                            Passwort
                          </button>
                          <button
                            onClick={() => handleToggleSuspend(ha)}
                            disabled={actionLoading[ha.id]}
                            className={`rounded-lg px-2.5 py-1.5 text-xs font-bold transition ${
                              isSuspended
                                ? "bg-emerald-600 text-white hover:bg-emerald-700"
                                : "bg-red-50 text-red-600 hover:bg-red-100"
                            }`}
                          >
                            {isSuspended ? "Entsperren" : "Sperren"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      <div className="mt-8 grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <section className="rounded-[32px] bg-white p-6 shadow-card border border-slate-100">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div><h2 className="text-2xl font-black">WHM / cPanel Server-Cluster</h2><p className="text-sm text-slate-500 mt-1">Multi-Server Architektur mit WHM API-Status.</p></div>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-sm"><thead className="bg-slate-50 text-left text-slate-500"><tr><th className="p-4">Server</th><th className="p-4">Status</th><th className="p-4">Accounts</th><th className="p-4">Disk</th><th className="p-4">API</th></tr></thead><tbody>{initialServers.map((s)=><tr key={s.host} className="border-t border-slate-100"><td className="p-4"><b>{s.name}</b><p className="text-xs text-slate-500">{s.host} · Load {s.load}</p></td><td className="p-4"><span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700">{s.status}</span></td><td className="p-4 font-bold">{s.accounts}</td><td className="p-4"><div className="h-2 rounded-full bg-slate-100"><div className="h-2 rounded-full bg-[#E63946]" style={{width:s.disk}} /></div><p className="mt-1 text-xs text-slate-500">{s.disk}</p></td><td className="p-4 text-slate-600">{s.api}</td></tr>)}</tbody></table>
          </div>
        </section>

        <section className="rounded-[32px] bg-slate-950 p-6 text-white shadow-card">
          <div className="flex items-center justify-between"><div><h2 className="text-2xl font-black">Automations-Flow</h2><p className="text-sm text-slate-400 mt-1">Bestellung → WHM → cPanel Account → Kunde</p></div><RefreshCw size={22} className="text-slate-500"/></div>
          <div className="mt-6 space-y-4">
            {[['1','Kauf & Bezahlung','Kunde wählt Webhosting & schliesst Kauf ab.'],['2','Automatisches Mapping','cPanel User wird generiert und mit Kunde verknüpft.'],['3','WHM API Integration','cPanel Account & DNS-Eintrag wird provisioniert.'],['4','Dashboard Server-Steuerung','Kunde kann sofort via SSO ins cPanel & Passwort ändern.']].map((step)=><div key={step[0]} className="flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-4"><div className="w-9 h-9 rounded-full bg-[#E63946] flex items-center justify-center font-black">{step[0]}</div><div><p className="font-black">{step[1]}</p><p className="text-sm text-slate-400">{step[2]}</p></div></div>)}
          </div>
        </section>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <section className="rounded-[32px] bg-white p-6 shadow-card border border-slate-100"><h2 className="text-2xl font-black mb-4">WHM API Funktionen</h2><div className="grid gap-3 sm:grid-cols-2">{whmActions.map((a)=><div key={a} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 flex items-center gap-3"><TerminalSquare size={18} className="text-[#E63946]"/><span className="font-mono text-sm font-bold">{a}</span></div>)}</div></section>
        <section className="rounded-[32px] bg-white p-6 shadow-card border border-slate-100"><h2 className="text-2xl font-black mb-4">System Logs</h2><div className="space-y-3">{logs.map((l)=><div key={l.time+l.message} className="rounded-2xl border border-slate-100 p-4 flex gap-3"><div className={`mt-1 ${l.state==='warning'?'text-amber-500':'text-emerald-600'}`}>{l.state==='warning'?<AlertTriangle size={18}/>:<PlayCircle size={18}/>}</div><div><p className="text-xs text-slate-400">{l.time} · {l.type}</p><p className="font-semibold text-sm">{l.message}</p></div></div>)}</div></section>
      </div>
    </div>
  );
}
