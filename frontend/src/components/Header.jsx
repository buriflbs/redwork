import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown, LogIn, Phone, Mail, LayoutDashboard, Server } from "lucide-react";
import { useModals } from "../contexts/ModalContext";
import { useAuth } from "../contexts/AuthContext";
import api from "../api";
import Logo from "./Logo";
import HostingMegaMenu from "./HostingMegaMenu";

const mainLinks = [
  { label: "Start", href: "#top" },
  { label: "Projekte", href: "#projekte" },
  { label: "Über uns", href: "#ueber" },
  { label: "Kontakt", href: "#kontakt" },
];

const serviceLinks = [
  { label: "Webdesign", href: "#leistungen" },
  { label: "Softwareentwicklung", href: "#leistungen" },
  { label: "SEO & Sichtbarkeit", href: "#leistungen" },
  { label: "Branding & Design", href: "#leistungen" },
  { label: "Online-Marketing", href: "#leistungen" },
  { label: "IT-Beratung", href: "#leistungen" },
];

export default function Header({ scrolled }) {
  const [open, setOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [hostingOpen, setHostingOpen] = useState(false);
  const [mobileHostingOpen, setMobileHostingOpen] = useState(false);
  const [phone, setPhone] = useState("+41 76 298 10 15");
  const { openQuote, openContact } = useModals();
  const { user, logout, isAdmin } = useAuth();
  const hostingTimeoutRef = useRef(null);

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

  // Keyboard accessibility: ESC closes mega-menu
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setHostingOpen(false);
        setServicesOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleHostingMouseEnter = () => {
    if (hostingTimeoutRef.current) clearTimeout(hostingTimeoutRef.current);
    setHostingOpen(true);
    setServicesOpen(false);
  };

  const handleHostingMouseLeave = () => {
    hostingTimeoutRef.current = setTimeout(() => {
      setHostingOpen(false);
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
  };

  const dashboardUrl = isAdmin ? "/admin" : "/dashboard";
  const cleanTel = `tel:${phone.replace(/\s+/g, "")}`;

  return (
    <header className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? "bg-[#07090f]/95 shadow-2xl shadow-black/20 backdrop-blur-xl border-b border-white/10" : "bg-[#07090f]/90 backdrop-blur-md"}`}>
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-6 px-4 py-3 sm:px-6 lg:px-8 lg:py-3.5">
        <a href="#top" onClick={(e) => handleNav(e, "#top")} className="shrink-0 -ml-1 sm:-ml-2 transition-transform hover:scale-105" aria-label="RedWORK Startseite">
          <Logo size="md" />
        </a>

        <nav className="hidden xl:flex items-center gap-1 rounded-full border border-white/10 bg-white/[0.04] px-2 py-2 shadow-inner ml-auto mr-4">
          {mainLinks.slice(0, 1).map((item) => (
            <a key={item.label} href={item.href} onClick={(e) => handleNav(e, item.href)} className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-[#FFC107]">
              {item.label}
            </a>
          ))}

          {/* Mega-Menü Item: Hosting */}
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
              <span>Hosting</span>
              <span className="ml-1 rounded bg-[#D4AF37]/20 px-1.5 py-0.2 text-[10px] font-black text-[#D4AF37] uppercase tracking-wider">
                Cloud
              </span>
              <ChevronDown size={14} className={`transition duration-200 ${hostingOpen ? "rotate-180 text-[#D4AF37]" : ""}`} />
            </button>

            {/* Desktop Mega Menu Floating Dropdown */}
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

          {/* Standard Dropdown: Leistungen */}
          <div className="relative">
            <button type="button" onClick={() => { setServicesOpen((v) => !v); setHostingOpen(false); }} className="flex items-center gap-1 rounded-full px-3.5 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-[#FFC107]">
              Leistungen <ChevronDown size={15} className={`transition ${servicesOpen ? "rotate-180" : ""}`} />
            </button>
            {servicesOpen && (
              <div className="absolute left-0 top-full mt-3 w-72 overflow-hidden rounded-3xl border border-white/10 bg-white p-2 shadow-2xl">
                {serviceLinks.map((service) => (
                  <a key={service.label} href={service.href} onClick={(e) => handleNav(e, service.href)} className="block rounded-2xl px-4 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100 hover:text-[#E63946]">
                    {service.label}
                  </a>
                ))}
              </div>
            )}
          </div>

          {mainLinks.slice(1).map((item) => (
            <a key={item.label} href={item.href} onClick={(e) => handleNav(e, item.href)} className="rounded-full px-3.5 py-2 text-sm font-semibold text-white/85 transition hover:bg-white/10 hover:text-[#FFC107]">
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden xl:flex items-center gap-3">
          <a href={cleanTel} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-2 text-sm font-semibold text-white/85 hover:text-[#FFC107] hover:border-white/20 transition-all">
            <Phone size={15} className="text-[#FFC107]" /> <span>{phone}</span>
          </a>
          {user ? (
            <a href={dashboardUrl} className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white hover:bg-white/10">
              <LayoutDashboard size={15} /> Dashboard
            </a>
          ) : (
            <a href="/login" className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-sm font-semibold text-white hover:bg-white/10">
              <LogIn size={15} /> Login
            </a>
          )}
          {user && <button onClick={logout} className="text-sm font-semibold text-white/60 hover:text-white">Abmelden</button>}
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

        <button className="xl:hidden rounded-2xl border border-white/10 bg-white/[0.06] p-2.5 text-white" onClick={() => setOpen((v) => !v)} aria-label="Menü öffnen">
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="xl:hidden border-t border-white/10 bg-[#07090f]/98 px-4 py-5 shadow-2xl max-h-[85vh] overflow-y-auto">
          <div className="grid gap-2">
            <a href={cleanTel} className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-base font-bold text-white mb-2">
              <Phone size={18} className="text-[#FFC107]" /> <span>{phone}</span>
            </a>
            {mainLinks.slice(0, 1).map((item) => (
              <a key={item.label} href={item.href} onClick={(e) => handleNav(e, item.href)} className="rounded-2xl px-4 py-3 text-base font-bold text-white hover:bg-white/10 hover:text-[#FFC107]">
                {item.label}
              </a>
            ))}

            {/* Mobile Accordion: Hosting */}
            <div className="rounded-3xl border border-[#D4AF37]/30 bg-gradient-to-b from-[#D4AF37]/5 to-transparent p-3">
              <button
                type="button"
                onClick={() => setMobileHostingOpen((v) => !v)}
                className="w-full flex items-center justify-between px-2 py-1 text-left"
              >
                <div className="flex items-center gap-2">
                  <Server size={16} className="text-[#D4AF37]" />
                  <span className="text-sm font-black text-white">Hosting & Cloud</span>
                  <span className="rounded bg-[#D4AF37]/20 px-1.5 py-0.5 text-[9px] font-black text-[#D4AF37] uppercase tracking-wider">
                    NVMe
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
                <a key={service.label} href={service.href} onClick={(e) => handleNav(e, service.href)} className="block rounded-2xl px-4 py-2.5 text-sm font-semibold text-white/85 hover:bg-white/10">
                  {service.label}
                </a>
              ))}
            </div>

            {mainLinks.slice(1).map((item) => (
              <a key={item.label} href={item.href} onClick={(e) => handleNav(e, item.href)} className="rounded-2xl px-4 py-3 text-base font-bold text-white hover:bg-white/10 hover:text-[#FFC107]">
                {item.label}
              </a>
            ))}

            <div className="mt-3 grid gap-3 sm:grid-cols-2">
              <button onClick={() => { openContact(); setOpen(false); }} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 text-left font-bold text-white">Kontakt</button>
              {user ? (
                <a href={dashboardUrl} className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 font-bold text-white">Dashboard</a>
              ) : (
                <a href="/login" className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-3 font-bold text-white">Login</a>
              )}
            </div>
            <button onClick={() => { openQuote(); setOpen(false); }} className="mt-2 rounded-2xl bg-gradient-to-r from-[#E63946] to-[#ff6b35] px-4 py-4 font-black text-white">
              Angebot einholen
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
