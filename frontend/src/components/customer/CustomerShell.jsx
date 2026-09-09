import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import {
  Bell,
  ChevronDown,
  LayoutDashboard,
  Server,
  KeyRound,
  Terminal,
  Globe,
  History,
  FileText,
  FileSpreadsheet,
  Headphones,
  Users,
  LogOut,
  User,
  Shield,
  Menu,
  X,
  Layers
} from "lucide-react";
import Logo from "../Logo";

export const PRIMARY_NAV_ITEMS = [
  { key: "dashboard", label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { key: "servers", label: "Hosting-Center", to: "/dashboard?tab=servers", icon: Server },
  { key: "services", label: "Meine Services", to: "/dashboard?tab=services", icon: Layers },
  { key: "domains", label: "Meine Domains", to: "/dashboard?tab=domains", icon: Globe },
  { key: "invoices", label: "Rechnungen", to: "/dashboard?tab=invoices", icon: FileText },
  { key: "support", label: "Support", to: "/support", icon: Headphones },
];

export const MORE_NAV_ITEMS = [
  { key: "licenses", label: "Lizenzen", to: "/dashboard?tab=licenses", icon: KeyRound },
  { key: "backorder", label: "Backorder", to: "/dashboard?tab=backorder", icon: History },
  { key: "offers", label: "Offerten", to: "/dashboard?tab=offers", icon: FileSpreadsheet },
  { key: "affiliate", label: "Partnerprogramm", to: "/dashboard?tab=affiliate", icon: Users },
];

export const CUSTOMER_NAV_ITEMS = [...PRIMARY_NAV_ITEMS, ...MORE_NAV_ITEMS];

export default function CustomerShell({ children, active = "dashboard", unreadCount = 0, notifications = [] }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const notifRef = useRef(null);
  const moreMenuRef = useRef(null);

  // Close dropdowns on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setNotificationsOpen(false);
      }
      if (moreMenuRef.current && !moreMenuRef.current.contains(event.target)) {
        setMoreMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const searchParams = new URLSearchParams(location.search);
  const currentTab = searchParams.get("tab") || (location.pathname === "/dashboard" ? "dashboard" : "");
  const isMoreActive = MORE_NAV_ITEMS.some((item) => currentTab && item.key === currentTab);

  const firstName = user?.firstName || user?.name || "Kunde";
  const firstInitial = firstName.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-[#F4F6FB] text-[#0F172A] font-sans antialiased">
      {/* Top Horizontal Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-100 shadow-[0_2px_12px_rgba(0,0,0,0.03)]">
        <div className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-6">
            <Link to="/dashboard" className="flex items-center gap-2 group">
              <Logo size="md" inverted={true} className="h-8 w-auto transition-transform duration-200 group-hover:scale-105" />
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 shrink-0">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const isCurrent =
                (item.key === "dashboard" && location.pathname === "/dashboard" && (!currentTab || currentTab === "dashboard")) ||
                (currentTab && item.key === currentTab) ||
                (item.to === "/support" && location.pathname.startsWith("/support"));

              return (
                <Link
                  key={item.key}
                  to={item.to}
                  className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                    isCurrent
                      ? "bg-[#FFF4ED] text-[#FF7A00] font-bold shadow-[inset_0_0_0_1px_rgba(255,122,0,0.15)]"
                      : "text-slate-600 hover:text-[#0F172A] hover:bg-slate-50"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}

            {/* Dropdown Menu for Additional Services */}
            <div className="relative" ref={moreMenuRef}>
              <button
                type="button"
                onClick={() => setMoreMenuOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 whitespace-nowrap ${
                  isMoreActive
                    ? "bg-[#FFF4ED] text-[#FF7A00] font-bold shadow-[inset_0_0_0_1px_rgba(255,122,0,0.15)]"
                    : "text-slate-600 hover:text-[#0F172A] hover:bg-slate-50"
                }`}
              >
                <span>Weitere Dienste</span>
                <ChevronDown className={`h-4 w-4 transition-transform duration-150 ${moreMenuOpen ? "rotate-180" : ""}`} />
              </button>

              {moreMenuOpen && (
                <div className="absolute left-0 mt-2 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  {MORE_NAV_ITEMS.map((item) => {
                    const isSubCurrent = currentTab && item.key === currentTab;
                    return (
                      <Link
                        key={item.key}
                        to={item.to}
                        onClick={() => setMoreMenuOpen(false)}
                        className={`flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl transition ${
                          isSubCurrent
                            ? "bg-[#FFF4ED] text-[#FF7A00] font-bold"
                            : "text-slate-700 hover:bg-slate-50 hover:text-[#FF7A00]"
                        }`}
                      >
                        <item.icon className="h-4 w-4 text-slate-400" />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          </nav>

          {/* Right Header Area: Notifications & User Avatar */}
          <div className="flex items-center gap-3">
            
            {/* Notification Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setNotificationsOpen((prev) => !prev)}
                className="relative flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200/80 bg-slate-50/70 text-slate-600 hover:bg-white hover:border-slate-300 hover:text-[#0F172A] transition shadow-sm"
                aria-label="Benachrichtigungen"
              >
                <Bell className="h-5 w-5" />
                {unreadCount > 0 && (
                  <span className="absolute top-2 right-2 h-2.5 w-2.5 rounded-full bg-[#FF7A00] ring-2 ring-white" />
                )}
              </button>

              {notificationsOpen && (
                <div className="absolute right-0 mt-3 w-80 rounded-2xl border border-slate-100 bg-white p-4 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-2">
                    <span className="font-bold text-sm text-[#0F172A]">Benachrichtigungen</span>
                    <span className="text-xs text-slate-400">Neueste Aktivitäten</span>
                  </div>
                  {notifications && notifications.length > 0 ? (
                    <div className="space-y-2 py-1 max-h-60 overflow-y-auto">
                      {notifications.map((notif, idx) => (
                        <div key={idx} className="p-2 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                          <p className="font-semibold text-slate-800">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-xs text-slate-400">
                      Keine neuen Benachrichtigungen vorhanden.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* User Profile Pill / Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setUserDropdownOpen((prev) => !prev)}
                className="flex items-center gap-2.5 rounded-full border border-slate-200/80 bg-white pl-1.5 pr-4 py-1.5 text-sm font-semibold text-[#0F172A] shadow-sm hover:border-slate-300 hover:bg-slate-50 transition"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF7A00] text-white font-bold text-xs shadow-[0_2px_8px_rgba(255,122,0,0.3)]">
                  {firstInitial}
                </div>
                <span className="hidden sm:inline-block max-w-[120px] truncate">{firstName}</span>
                <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform duration-150 ${userDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 rounded-2xl border border-slate-100 bg-white p-2 shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-2 border-b border-slate-100 mb-1">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Angemeldet als</p>
                    <p className="text-sm font-bold text-[#0F172A] truncate">{user?.email || "Konto"}</p>
                  </div>
                  
                  <Link
                    to="/dashboard?tab=account"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-50 hover:text-[#FF7A00] transition"
                  >
                    <User className="h-4 w-4 text-slate-400" /> Mein Konto & Profil
                  </Link>

                  <Link
                    to="/dashboard?tab=security"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl text-slate-700 hover:bg-slate-50 hover:text-[#FF7A00] transition"
                  >
                    <Shield className="h-4 w-4 text-slate-400" /> Sicherheit & Passwort
                  </Link>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => {
                      setUserDropdownOpen(false);
                      logout();
                    }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-semibold rounded-xl text-red-600 hover:bg-red-50 transition"
                  >
                    <LogOut className="h-4 w-4 text-red-500" /> Abmelden
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Navigation Toggle Button */}
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="xl:hidden flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              aria-label="Menü öffnen"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Nav Dropdown */}
        {mobileMenuOpen && (
          <div className="xl:hidden border-t border-slate-100 bg-white px-4 py-4 shadow-xl">
            <div className="grid grid-cols-2 gap-2">
              {CUSTOMER_NAV_ITEMS.map((item) => {
                const isCurrent =
                  (item.key === "dashboard" && location.pathname === "/dashboard" && (!currentTab || currentTab === "dashboard")) ||
                  (currentTab && item.key === currentTab) ||
                  (item.to === "/support" && location.pathname.startsWith("/support"));

                return (
                  <Link
                    key={item.key}
                    to={item.to}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold transition ${
                      isCurrent ? "bg-[#FFF4ED] text-[#FF7A00]" : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    <item.icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="mx-auto max-w-[1440px] px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {children}
      </main>
    </div>
  );
}
