import React from "react";
import { NavLink, Navigate, Outlet, useNavigate } from "react-router-dom";
import { Home, Server, FileText, MessageCircle, User, LogOut, ShoppingCart } from "lucide-react";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";

const links = [
  { label: "Übersicht", to: "/account/dashboard", icon: Home },
  { label: "Hosting & Produkte", to: "/account/hosting", icon: Server },
  { label: "Rechnungen", to: "/account/invoices", icon: FileText },
  { label: "Support-Tickets", to: "/account/tickets", icon: MessageCircle },
  { label: "Profil", to: "/account/profile", icon: User },
];

export default function AccountLayout() {
  const { customer, logout, loading } = useCustomerAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Lade Konto...</div>;
  }

  if (!customer) {
    return <Navigate to="/account/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="max-w-[1400px] mx-auto px-4 py-8 grid gap-8 xl:grid-cols-[300px_1fr]">
        <aside className="rounded-[32px] bg-white p-6 shadow-lg border border-slate-200">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center rounded-3xl bg-[#E63946] p-4 text-white mb-4">
              <User size={24} />
            </div>
            <div className="text-sm uppercase tracking-[0.24em] text-slate-500 mb-2">Kundenkonto</div>
            <h2 className="text-2xl font-bold text-slate-950">{customer.name}</h2>
            <p className="mt-1 text-sm text-slate-500">{customer.email}</p>
          </div>

          <nav className="space-y-2">
            {links.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-semibold transition ${
                      isActive ? "bg-[#E63946] text-white" : "text-slate-700 hover:bg-slate-100"
                    }`
                  }
                >
                  <Icon size={18} className="shrink-0" />
                  {item.label}
                </NavLink>
              );
            })}
          </nav>

          <div className="mt-8 rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
            <div className="font-semibold text-slate-900 mb-2">Status</div>
            <div className="space-y-2">
              <div className="flex items-center justify-between"><span>Verifiziert</span><span className="font-semibold text-emerald-700">{customer.emailVerified ? "Ja" : "Nein"}</span></div>
              <div className="flex items-center justify-between"><span>Hosting-Plan</span><span className="font-semibold">{customer.plan}</span></div>
              <div className="flex items-center justify-between"><span>Zahlungsstatus</span><span className="font-semibold">{customer.paymentStatus}</span></div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              logout();
              navigate("/account/login");
            }}
            className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white hover:bg-slate-800 transition"
          >
            <LogOut size={16} /> Abmelden
          </button>
        </aside>

        <main className="space-y-8">
          <div className="rounded-[32px] bg-white p-6 shadow-lg border border-slate-200 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.24em] text-slate-500">Willkommen zurück</div>
              <h1 className="text-3xl font-bold text-slate-950">Kunden-Dashboard</h1>
              <p className="mt-2 text-sm text-slate-600">Ihr zentraler Zugang für Hosting, Bestellungen, Rechnungen und Support.</p>
            </div>
            <button
              onClick={() => navigate("/account/hosting")}
              className="inline-flex items-center gap-2 rounded-full bg-[#E63946] px-5 py-3 text-sm font-semibold text-white hover:bg-[#c5303d] transition"
            >
              Hosting bestellen
              <ShoppingCart size={18} />
            </button>
          </div>

          <Outlet />
        </main>
      </div>
    </div>
  );
}
