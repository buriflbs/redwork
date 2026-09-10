import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X,
  ChevronDown,
  LogIn,
  Phone,
  LayoutDashboard,
  Server,
  Building2,
  User,
  LogOut,
  Layers,
  FileText,
  LifeBuoy,
  HelpCircle,
  Mail,
  ShieldCheck
} from "lucide-react";
import { useModals } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import Logo from "./Logo";
import HostingMegaMenu from "./HostingMegaMenu";

const companyLinks = [
  { label: "Über uns", href: "#ueber", icon: Building2, desc: "Philosophie & Schweizer Qualität" },
  { label: "Kontakt & Beratung", href: "#kontakt", icon: Mail, desc: "Direkter Draht zu unseren Experten" },
  { label: "Support-Portal", to: "/support", icon: LifeBuoy, desc: "Tickets & technischer Kundendienst" },
  { label: "Häufige Fragen (FAQ)", href: "#faq", icon: HelpCircle, desc: "Antworten auf wichtige Fragen" },
];

const serviceLinks = [
  { label: "Webdesign & Redesign", href: "#leistungen" },
  { label: "Softwareentwicklung", href: "#leistungen" },
  { label: "SEO & Sichtbarkeit", href: "#leistungen" },
  { label: "Branding & Corporate Identity", href: "#leistungen" },
  { label: "Online-Marketing & Ads", href: "#leistungen" },
  { label: "IT-Strategie & Beratung", href: "#leistungen" },
];

export default function Header({ scrolled }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [hostingOpen, setHostingOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const [mobileHostingOpen, setMobileHostingOpen] = useState(false);
  const [mobileCompanyOpen, setMobileCompanyOpen] = useState(false);
  const [mobileAccountOpen, setMobileAccountOpen] = useState(false);
  const [phone, setPhone] = useState("+41 76 298 10 15");

  const { openQuote, openContact } = useModals();
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const hostingTimeoutRef = useRef(null);
  const companyTimeoutRef = useRef(null);
  const accountTimeoutRef = useRef(null);

  useEffect(() => {
    let mounted = true;
    api.get("/site-settings")
      .then((res) => {
        if (mounted && res.data) {
          const num = res.data.headerPhone || res.data.contactPhone || "+41 76 298 10 15";
          setPhone(num);
        }
      })
      .catch(() => {});
    return () => { mounted = false; };
  }, []);

  // Keyboard accessibility: ESC closes mega-menu and dropdowns
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setHostingOpen(false);
        setServicesOpen(false);
        setCompanyOpen(false);
        setAccountOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleHostingMouseEnter = () => {
    if (hostingTimeoutRef.current) clearTimeout(hostingTimeoutRef.current);
    setHostingOpen(true);
    setServicesOpen(false);
    setCompanyOpen(false);
    setAccountOpen(false);
  };

  const handleHostingMouseLeave = () => {
    hostingTimeoutRef.current = setTimeout(() => {
      setHostingOpen(false);
    }, 200);
  };

  const handleCompanyMouseEnter = () => {
    if (companyTimeoutRef.current) clearTimeout(companyTimeoutRef.current);
    setCompanyOpen(true);
    setHostingOpen(false);
    setServicesOpen(false);
    setAccountOpen(false);
  };

  const handleCompanyMouseLeave = () => {
    companyTimeoutRef.current = setTimeout(() => {
      setCompanyOpen(false);
    }, 200);
  };

  const handleAccountMouseEnter = () => {
    if (accountTimeoutRef.current) clearTimeout(accountTimeoutRef.current);
    setAccountOpen(true);
    setHostingOpen(false);
    setServicesOpen(false);
    setCompanyOpen(false);
  };

  const handleAccountMouseLeave = () => {
    accountTimeoutRef.current = setTimeout(() => {
      setAccountOpen(false);
    }, 200);
  };

  const handleNav = (e, href) => {
    if (!href?.startsWith("#")) return;
    e.preventDefault();
    const id = href.slice(1);
    if (id === "top") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) {
        const headerHeight = document.querySelector("header")?.offsetHeight || 0;
        const top = el.getBoundingClientRect().top + window.scrollY - headerHeight - 18;
        window.scrollTo({ top: Math.max(top, 0), behavior: "smooth" });
      }
    }
    setOpen(false);
    setServicesOpen(false);
    setHostingOpen(false);
    setCompanyOpen(false);
    setAccountOpen(false);
  };

  const dashboardUrl = isAdmin ? "/admin" : "/dashboard";
  const cleanTel = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#07090f]/95 shadow-2xl shadow-black/20 backdrop-blur-xl border-b border-white/10" : "bg-[#07090f]/90 backdrop-blur-md"}`}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 sm:gap-6 px-4 py-3 sm:px-6 lg:px-8 lg:py-3.5">
        <a href="#top" onClick={(e) => handleNav(e, "#top")} className="shrink-0 -ml-1 sm:-ml-2 transition-transform hover:scale-105" aria-label="RedWORK Startseite">
          <Logo size="md" />
        </a>

        {/* Desktop Navigation Center */}
        <nav className="hidden xl:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1.5 shadow-inner ml-auto mr-4">
          <a
            href="#top"
            onClick={(e) => handleNav(e, "#top")}
            className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-[#FFC107]"
          >
            Start
          </a>

          {/* Mega-Menü Item: Hosting Cloud */}
          <div
            className="relative"
            onMouseEnter={handleHostingMouseEnter}
            onMouseLeave={handleHostingMouseLeave}
          >
            <button
              type="button"
              onClick={() => setHostingOpen((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold transition ${
                hostingOpen
                  ? "bg-white/15 text-[#D4AF37] shadow-sm"
                  : "text-white/90 hover:bg-white/10 hover:text-[#D4AF37]"
              }`}
              aria-expanded={hostingOpen}
              aria-haspopup="menu"
            >
              <Server size={14} className={hostingOpen ? "text-[#D4AF37]" : "text-slate-400"} />
              <span>Hosting Cloud</span>
              <span className="ml-0.5 rounded bg-[#D4AF37]/20 px-1.5 py-0.5 text-[9px] font-black text-[#D4AF37] uppercase tracking-wider">
                CH
              </span>
              <ChevronDown size={14} className={`transition duration-200 ${hostingOpen ? "rotate-180 text-[#D4AF37]" : ""}`} />
            </button>

            {/* Desktop Mega Menu Dropdown */}
            {hostingOpen && (
              <div
                className="fixed left-1/2 -translate-x-1/2 top-[72px] w-[96vw] max-w-[1360px] z-50 pt-2"
                onMouseEnter={handleHostingMouseEnter}
                onMouseLeave={handleHostingMouseLeave}
              >
                <HostingMegaMenu onClose={() => setHostingOpen(false)} isMobile={false} />
              </div>
            )}
          </div>

          {/* Dropdown: Leistungen */}
          <div className="relative">
            <button
              type="button"
              onClick={() => { setServicesOpen((v) => !v); setHostingOpen(false); setCompanyOpen(false); }}
              className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                servicesOpen ? "bg-white/15 text-[#FFC107]" : "text-white/85 hover:bg-white/10 hover:text-[#FFC107]"
              }`}
            >
              <span>Leistungen</span>
              <ChevronDown size={14} className={`transition ${servicesOpen ? "rotate-180" : ""}`} />
            </button>
            {servicesOpen && (
              <div className="absolute left-0 top-full mt-3 w-72 overflow-hidden rounded-3xl border border-white/10 bg-[#0c101a] p-2 shadow-2xl backdrop-blur-xl">
                {serviceLinks.map((service) => (
                  <a
                    key={service.label}
                    href={service.href}
                    onClick={(e) => handleNav(e, service.href)}
                    className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/10 hover:text-[#FF7A00]"
                  >
                    {service.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          <a
            href="#projekte"
            onClick={(e) => handleNav(e, "#projekte")}
            className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-[#FFC107]"
          >
            Projekte
          </a>

          {/* Dropdown: Unternehmen */}
          <div
            className="relative"
            onMouseEnter={handleCompanyMouseEnter}
            onMouseLeave={handleCompanyMouseLeave}
          >
            <button
              type="button"
              onClick={() => { setCompanyOpen((v) => !v); setHostingOpen(false); setServicesOpen(false); }}
              className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold transition ${
                companyOpen ? "bg-white/15 text-[#D4AF37]" : "text-white/85 hover:bg-white/10 hover:text-[#D4AF37]"
              }`}
              aria-expanded={companyOpen}
            >
              <span>Unternehmen</span>
              <ChevronDown size={14} className={`transition ${companyOpen ? "rotate-180 text-[#D4AF37]" : ""}`} />
            </button>

            {companyOpen && (
              <div
                className="absolute right-0 top-full mt-3 w-80 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0c101a] to-[#07090f] p-2.5 shadow-2xl backdrop-blur-xl"
                onMouseEnter={handleCompanyMouseEnter}
                onMouseLeave={handleCompanyMouseLeave}
              >
                {companyLinks.map((item) => {
                  const Icon = item.icon;
                  if (item.to) {
                    return (
                      <Link
                        key={item.label}
                        to={item.to}
                        onClick={() => setCompanyOpen(false)}
                        className="flex items-start gap-3 rounded-2xl p-3 hover:bg-white/10 transition group"
                      >
                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#D4AF37] group-hover:bg-[#D4AF37]/20 transition">
                          <Icon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition">{item.label}</p>
                          <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  }
                  return (
                    <a
                      key={item.label}
                      href={item.href}
                      onClick={(e) => handleNav(e, item.href)}
                      className="flex items-start gap-3 rounded-2xl p-3 hover:bg-white/10 transition group"
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 text-[#D4AF37] group-hover:bg-[#D4AF37]/20 transition">
                        <Icon size={16} />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white group-hover:text-[#D4AF37] transition">{item.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Right CTA & Account Area */}
        <div className="hidden xl:flex items-center gap-3">
          <a href={cleanTel} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-white/85 hover:text-[#FFC107] hover:border-white/20 transition-all">
            <Phone size={15} className="text-[#FFC107]" /> <span>{phone}</span>
          </a>

          {/* User Logged In: Mein Konto ▾ */}
          {user ? (
            <div
              className="relative"
              onMouseEnter={handleAccountMouseEnter}
              onMouseLeave={handleAccountMouseLeave}
            >
              <button
                type="button"
                onClick={() => setAccountOpen((v) => !v)}
                className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-sm font-semibold transition ${
                  accountOpen
                    ? "border-[#D4AF37] bg-white/10 text-white"
                    : "border-white/10 bg-white/[0.04] text-white hover:bg-white/10"
                }`}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-tr from-[#E63946] to-[#FF7A00] text-xs font-bold text-white">
                  {(user.firstName || user.name || "K").charAt(0).toUpperCase()}
                </div>
                <span>Mein Konto</span>
                <ChevronDown size={14} className={`transition duration-200 ${accountOpen ? "rotate-180 text-[#D4AF37]" : ""}`} />
              </button>

              {accountOpen && (
                <div
                  className="absolute right-0 top-full mt-3 w-64 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-[#0c101a] to-[#07090f] p-2.5 shadow-2xl backdrop-blur-xl"
                  onMouseEnter={handleAccountMouseEnter}
                  onMouseLeave={handleAccountMouseLeave}
                >
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="text-xs text-slate-400">Angemeldet als</p>
                    <p className="text-sm font-bold text-white truncate">{user.firstName} {user.lastName}</p>
                    <p className="text-[11px] text-slate-400 font-mono truncate">{user.email}</p>
                  </div>

                  <Link
                    to={dashboardUrl}
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                  >
                    <LayoutDashboard size={16} className="text-[#FF7A00]" />
                    <span>Dashboard Übersicht</span>
                  </Link>

                  <Link
                    to="/dashboard?tab=services"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                  >
                    <Layers size={16} className="text-blue-400" />
                    <span>Meine Services</span>
                  </Link>

                  <Link
                    to="/dashboard?tab=servers"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                  >
                    <Server size={16} className="text-[#D4AF37]" />
                    <span>Hosting-Center (cPanel)</span>
                  </Link>

                  <Link
                    to="/dashboard?tab=invoices"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                  >
                    <FileText size={16} className="text-emerald-400" />
                    <span>Rechnungen & Finanzen</span>
                  </Link>

                  <Link
                    to="/support"
                    onClick={() => setAccountOpen(false)}
                    className="flex items-center gap-2.5 rounded-2xl px-3 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition"
                  >
                    <LifeBuoy size={16} className="text-purple-400" />
                    <span>Support-Tickets</span>
                  </Link>

                  <div className="my-1 border-t border-white/10" />

                  <button
                    onClick={() => { logout(); setAccountOpen(false); navigate("/"); }}
                    className="flex w-full items-center gap-2.5 rounded-2xl px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10 transition"
                  >
                    <LogOut size={16} />
                    <span>Abmelden</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-semibold text-white hover:bg-white/10 transition"
            >
              <LogIn size={15} /> <span>Login</span>
            </Link>
          )}

          <button
            onClick={openQuote}
            className="group relative overflow-hidden rounded-full bg-gradient-to-r from-[#E63946] via-[#f72585] to-[#ff6b35] px-6 py-2.5 text-sm font-black text-white shadow-[0_0_22px_rgba(230,57,70,0.45)] hover:shadow-[0_0_32px_rgba(230,57,70,0.7)] transition-all duration-300 hover:scale-105 active:scale-95 animate-subtle-float flex items-center gap-1.5"
            aria-label="Kostenloses Angebot einholen"
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <span>Angebot</span>
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
            </span>
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full pointer-events-none" />
          </button>
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          className="xl:hidden rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-white"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menü öffnen"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {open && (
        <div className="xl:hidden border-t border-white/10 bg-[#07090f]/98 px-4 py-5 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="grid gap-2">
            <a href={cleanTel} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-base font-bold text-white mb-2">
              <Phone size={18} className="text-[#FFC107]" /> <span>{phone}</span>
            </a>

            <a
              href="#top"
              onClick={(e) => handleNav(e, "#top")}
              className="rounded-2xl px-4 py-3 text-base font-bold text-white hover:bg-white/10 hover:text-[#FFC107]"
            >
              Start
            </a>

            {/* Mobile Accordion: Hosting Cloud */}
            <div className="rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#D4AF37]/5 to-transparent p-3">
              <button
                type="button"
                onClick={() => setMobileHostingOpen((v) => !v)}
                className="w-full flex items-center justify-between px-2 py-1 text-left"
              >
                <div className="flex items-center gap-2">
                  <Server size={16} className="text-[#D4AF37]" />
                  <span className="text-sm font-black text-white">Hosting Cloud</span>
                  <span className="rounded bg-[#D4AF37]/20 px-1.5 py-0.5 text-[9px] font-black text-[#D4AF37] uppercase tracking-wider">
                    NVMe CH
                  </span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${mobileHostingOpen ? "rotate-180 text-[#D4AF37]" : ""}`} />
              </button>

              {mobileHostingOpen && (
                <div className="mt-3 pt-2 border-t border-white/10">
                  <HostingMegaMenu onClose={() => setOpen(false)} isMobile={true} />
                </div>
              )}
            </div>

            {/* Mobile Accordion: Leistungen */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-3">
              <p className="px-2 pb-2 text-xs font-black uppercase tracking-[0.22em] text-white/45">Leistungen</p>
              {serviceLinks.map((service) => (
                <a
                  key={service.label}
                  href={service.href}
                  onClick={(e) => handleNav(e, service.href)}
                  className="block rounded-2xl px-4 py-2 text-sm font-semibold text-white/85 hover:bg-white/10"
                >
                  {service.label}
                </a>
              ))}
            </div>

            <a
              href="#projekte"
              onClick={(e) => handleNav(e, "#projekte")}
              className="rounded-2xl px-4 py-3 text-base font-bold text-white hover:bg-white/10 hover:text-[#FFC107]"
            >
              Projekte
            </a>

            {/* Mobile Accordion: Unternehmen */}
            <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-3">
              <button
                type="button"
                onClick={() => setMobileCompanyOpen((v) => !v)}
                className="w-full flex items-center justify-between px-2 py-1 text-left"
              >
                <div className="flex items-center gap-2">
                  <Building2 size={16} className="text-[#D4AF37]" />
                  <span className="text-sm font-black text-white">Unternehmen</span>
                </div>
                <ChevronDown size={16} className={`text-slate-400 transition-transform ${mobileCompanyOpen ? "rotate-180 text-[#D4AF37]" : ""}`} />
              </button>

              {mobileCompanyOpen && (
                <div className="mt-3 pt-2 border-t border-white/10 space-y-1">
                  {companyLinks.map((item) => {
                    if (item.to) {
                      return (
                        <Link
                          key={item.label}
                          to={item.to}
                          onClick={() => setOpen(false)}
                          className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
                        >
                          {item.label}
                        </Link>
                      );
                    }
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        onClick={(e) => handleNav(e, item.href)}
                        className="block rounded-xl px-3 py-2 text-sm font-semibold text-slate-200 hover:bg-white/10"
                      >
                        {item.label}
                      </a>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Mobile Account Section */}
            {user ? (
              <div className="rounded-3xl border border-[#FF7A00]/30 bg-[#FF7A00]/5 p-3">
                <button
                  type="button"
                  onClick={() => setMobileAccountOpen((v) => !v)}
                  className="w-full flex items-center justify-between px-2 py-1 text-left"
                >
                  <div className="flex items-center gap-2">
                    <User size={16} className="text-[#FF7A00]" />
                    <span className="text-sm font-black text-white">Mein Konto ({user.firstName})</span>
                  </div>
                  <ChevronDown size={16} className={`text-slate-400 transition-transform ${mobileAccountOpen ? "rotate-180 text-[#FF7A00]" : ""}`} />
                </button>

                {mobileAccountOpen && (
                  <div className="mt-3 pt-2 border-t border-white/10 space-y-1">
                    <Link
                      to={dashboardUrl}
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Dashboard Übersicht
                    </Link>
                    <Link
                      to="/dashboard?tab=services"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Meine Services
                    </Link>
                    <Link
                      to="/dashboard?tab=servers"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Hosting-Center (cPanel)
                    </Link>
                    <Link
                      to="/dashboard?tab=invoices"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Rechnungen
                    </Link>
                    <Link
                      to="/support"
                      onClick={() => setOpen(false)}
                      className="block rounded-xl px-3 py-2 text-sm font-semibold text-white hover:bg-white/10"
                    >
                      Support
                    </Link>
                    <button
                      onClick={() => { logout(); setOpen(false); navigate("/"); }}
                      className="block w-full text-left rounded-xl px-3 py-2 text-sm font-semibold text-red-400 hover:bg-red-500/10"
                    >
                      Abmelden
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-2 grid gap-3 sm:grid-cols-2">
                <Link
                  to="/login"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 font-bold text-center text-white hover:bg-white/10"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 font-bold text-center text-white hover:bg-white/10"
                >
                  Registrieren
                </Link>
              </div>
            )}

            <button
              onClick={() => { openQuote(); setOpen(false); }}
              className="mt-3 rounded-2xl bg-gradient-to-r from-[#E63946] to-[#ff6b35] px-4 py-4 font-black text-white text-center shadow-lg"
            >
              Kostenloses Angebot einholen
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
