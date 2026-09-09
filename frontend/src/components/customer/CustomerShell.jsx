import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { BarChart3, ChevronRight, CreditCard, Globe2, Headphones, Home, LogOut, Package, Server, ShieldCheck, UserRound, WalletCards } from "lucide-react";
import { Button } from "../ui/button";

const menu = [
  { label: "Müşteri Paneli", to: "/dashboard", icon: Home },
  {
    label: "Hizmetlerim",
    to: "/dashboard/products",
    icon: Server,
    children: [
      ["Web Hosting", "/dashboard/products?category=web-hosting"],
      ["Reseller Hosting", "/dashboard/products?category=reseller-hosting"],
      ["Premium VDS & VPS", "/dashboard/products?category=premium-vds-vps"],
      ["Kiralık Sunucular", "/dashboard/products?category=kiralik-sunucular"],
    ],
  },
  { label: "Domainlerim", to: "/dashboard#domains", icon: Globe2 },
  { label: "Faturalar", to: "/dashboard#rechnungen", icon: CreditCard },
  { label: "Destek", to: "/support", icon: Headphones },
  { label: "Hesabım", to: "/profile", icon: UserRound },
  { label: "Raporlar", to: "/dashboard#activity", icon: BarChart3 },
];

export default function CustomerShell({ children, active = "dashboard" }) {
  const { logout } = useAuth();

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#0d1b3d]">
      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-[280px] bg-[#102452] text-white lg:block">
        <div className="flex h-24 items-center px-10">
          <Link to="/dashboard" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#E63946] font-black">R</div>
            <div>
              <p className="text-xl font-black leading-none">REDWORK</p>
              <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/50">Digital Services</p>
            </div>
          </Link>
        </div>
        <nav className="mt-14 space-y-1 px-3">
          {menu.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.label || (active === "products" && item.label === "Hizmetlerim") || (active === "dashboard" && item.label === "Müşteri Paneli");
            return (
              <div key={item.label}>
                <Link to={item.to} className={`flex items-center justify-between rounded-l-full px-5 py-3 text-sm font-bold transition ${isActive ? "bg-white text-[#102452]" : "text-white/85 hover:bg-white/10 hover:text-white"}`}>
                  <span className="flex items-center gap-3"><Icon className="h-5 w-5" /> {item.label}</span>
                  {item.children && <ChevronRight className="h-4 w-4" />}
                </Link>
                {item.children && isActive && (
                  <div className="ml-9 mt-1 space-y-1 pb-2">
                    {item.children.map(([label, to]) => (
                      <Link key={label} to={to} className="block rounded-lg px-3 py-2 text-xs font-semibold text-white/70 hover:bg-white/10 hover:text-white">{label}</Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="absolute bottom-8 left-6 right-6 border-t border-white/10 pt-5">
          <p className="px-4 text-xs font-semibold text-white/55">REDWORK Panel</p>
          <Button variant="outline" onClick={logout} className="mt-4 w-full border-white/15 bg-white/5 text-white hover:bg-white/10">
            <LogOut className="mr-2 h-4 w-4" /> Abmelden
          </Button>
        </div>
      </aside>

      <div className="hidden h-24 bg-[#102452] lg:block lg:pl-[280px]">
        <div className="flex h-full items-center justify-end px-8">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-white text-[#102452] shadow-lg">
            <ShieldCheck className="h-5 w-5" />
          </div>
        </div>
      </div>

      <main className="pb-24 lg:pl-[280px]">
        <div className="mx-auto max-w-[1640px] px-4 py-5 sm:px-6 lg:px-9">
          {children}
        </div>
      </main>

      <nav className="fixed bottom-0 left-0 right-0 z-50 grid grid-cols-5 border-t border-slate-200 bg-white px-2 py-2 shadow-2xl lg:hidden">
        {menu.slice(0, 5).map((item) => {
          const Icon = item.icon;
          return (
            <Link key={item.label} to={item.to} className="flex flex-col items-center gap-1 text-[11px] font-semibold text-[#102452]">
              <Icon className="h-5 w-5" />
              {item.label.replace("Müşteri Paneli", "Panel")}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
