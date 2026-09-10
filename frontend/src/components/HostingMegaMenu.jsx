import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Server,
  Cpu,
  Terminal,
  Layers,
  Globe,
  Mail,
  Shield,
  ShieldCheck,
  Zap,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Users,
  HardDrive,
  Cloud
} from "lucide-react";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";

export default function HostingMegaMenu({ onClose, isMobile = false }) {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [customerHostingCount, setCustomerHostingCount] = useState(0);

  useEffect(() => {
    let mounted = true;
    const fetchHostingData = async () => {
      try {
        const res = await api.get("/products");
        if (mounted) {
          setProducts(res.data || []);
        }
      } catch (err) {
        console.warn("Products load failed in MegaMenu:", err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchHostingData();

    if (user) {
      api.get("/customer/hosting")
        .then((res) => {
          if (mounted && Array.isArray(res.data)) {
            setCustomerHostingCount(res.data.length);
          }
        })
        .catch(() => {});
    }

    return () => {
      mounted = false;
    };
  }, [user]);

  // Helper to find existing product by key substring
  const findProduct = (keyword) => {
    return products.find(
      (p) =>
        (p.name || "").toLowerCase().includes(keyword.toLowerCase()) ||
        (p.id || "").toLowerCase() === keyword.toLowerCase()
    );
  };

  // Dedicated Product Mappings
  const pWebBasic = findProduct("Webhosting Basic");
  const pWebPro = findProduct("Webhosting Professional");
  const pWebEnt = findProduct("Webhosting Enterprise");
  const pHostingPrem = findProduct("Hosting Premium");
  const pVpsBasic = findProduct("VPS Basic");
  const pVpsPro = findProduct("VPS Professional");
  const pDedicated = findProduct("Dedicated Server");

  // Columns Configuration
  const menuCategories = [
    {
      title: "WEBHOSTING",
      description: "NVMe SSD Webspace",
      items: [
        {
          name: "Linux Webhosting",
          description: "Ultraschneller Schweizer NVMe-Speicherplatz",
          icon: Terminal,
          badge: "BELIEBT",
          badgeColor: "bg-[#FF7A00]/15 text-[#FF7A00] border-[#FF7A00]/30",
          to: pWebBasic ? `/products/${pWebBasic.id}` : "/products?category=hosting",
          price: pWebBasic ? `CHF ${Number(pWebBasic.unitPrice).toFixed(2)}/Mt.` : "CHF 9.90/Mt."
        },
        {
          name: "Business Webhosting",
          description: "High-Traffic Performance und automatische Backups",
          icon: Layers,
          badge: "EMPFOHLEN",
          badgeColor: "bg-[#D4AF37]/15 text-[#D4AF37] border-[#D4AF37]/30",
          to: pWebPro ? `/products/${pWebPro.id}` : "/products?category=hosting",
          price: pWebPro ? `CHF ${Number(pWebPro.unitPrice).toFixed(2)}/Mt.` : "CHF 19.90/Mt."
        },
        {
          name: "Enterprise Webhosting",
          description: "Maximale Ressourcen mit dediziertem CDN",
          icon: Zap,
          badge: "PREMIUM",
          badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
          to: pWebEnt ? `/products/${pWebEnt.id}` : "/products?category=hosting",
          price: pWebEnt ? `CHF ${Number(pWebEnt.unitPrice).toFixed(2)}/Mt.` : "CHF 49.90/Mt."
        }
      ]
    },
    {
      title: "RESELLER & BUSINESS",
      description: "White-Label und Agenturen",
      items: [
        {
          name: "Reseller Hosting",
          description: "Eigene Hosting-Tarife für Kunden anlegen und verkaufen",
          icon: Users,
          badge: "WHM INKL.",
          badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
          to: "/products?category=reseller",
          price: "Ab CHF 39.00/Mt."
        },
        {
          name: "WHM / cPanel Cloud",
          description: "Vollständige Mehrmandanten-Verwaltung",
          icon: Server,
          to: "/products?category=hosting",
          price: "Integrierte Cloud"
        },
        {
          name: "Agentur & Corporate",
          description: "Multi-Account Architektur mit Team-Zugängen",
          icon: ShieldCheck,
          to: "/products?category=hosting",
          price: "Skalierbar"
        }
      ]
    },
    {
      title: "SERVER & INFRASTRUKTUR",
      description: "Dedizierte Rechenleistung",
      items: [
        {
          name: "Cloud VPS Server",
          description: "Garantierte vCPU-Kerne, NVMe und Root-Zugriff",
          icon: Cpu,
          badge: "SCHNELL",
          badgeColor: "bg-amber-500/15 text-amber-400 border-amber-500/30",
          to: pVpsBasic ? `/products/${pVpsBasic.id}` : "/products?category=server",
          price: pVpsBasic ? `CHF ${Number(pVpsBasic.unitPrice).toFixed(2)}/Mt.` : "CHF 29.90/Mt."
        },
        {
          name: "VPS Professional",
          description: "Hohe Rechenleistung für Datenbanken und Apps",
          icon: HardDrive,
          to: pVpsPro ? `/products/${pVpsPro.id}` : "/products?category=server",
          price: pVpsPro ? `CHF ${Number(pVpsPro.unitPrice).toFixed(2)}/Mt.` : "CHF 49.90/Mt."
        },
        {
          name: "Dedicated Bare-Metal",
          description: "Exklusive physische Serverhardware in Zürich",
          icon: Cloud,
          badge: "HIGH-END",
          badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
          to: pDedicated ? `/products/${pDedicated.id}` : "/products?category=server",
          price: pDedicated ? `CHF ${Number(pDedicated.unitPrice).toFixed(2)}/Mt.` : "CHF 149.90/Mt."
        }
      ]
    },
    {
      title: "SPEZIAL-LÖSUNGEN",
      description: "Massgeschneiderte Dienste",
      items: [
        {
          name: "WordPress Hosting",
          description: "Vorinstalliertes WP mit Caching und Auto-Updates",
          icon: Sparkles,
          badge: "1-KLICK",
          badgeColor: "bg-blue-500/15 text-blue-400 border-blue-500/30",
          to: "/products?category=hosting",
          price: "Optimiert"
        },
        {
          name: "Business Mail Hosting",
          description: "Eigene Domain-Adressen, IMAP/POP3 und Anti-Spam",
          icon: Mail,
          to: "/products?category=email",
          price: "Inkl. Webmail"
        },
        {
          name: "Managed Server-Wartung",
          description: "24/7 Monitoring, Sicherheits-Patches und Backups",
          icon: Shield,
          to: "/products?category=wartung",
          price: "Rundum-Sorglos"
        }
      ]
    }
  ];

  // Mobile Accordion View
  if (isMobile) {
    return (
      <div className="space-y-4 pt-2">
        {user && (
          <div className="rounded-2xl bg-gradient-to-r from-[#FF7A00]/15 to-[#D4AF37]/15 p-3.5 border border-[#D4AF37]/30 flex items-center justify-between">
            <div>
              <p className="text-[11px] font-black uppercase tracking-wider text-[#D4AF37]">Mein Kundenbereich</p>
              <p className="text-xs font-bold text-white mt-0.5">Hosting-Verwaltung öffnen</p>
            </div>
            <Link
              to="/dashboard?tab=servers"
              onClick={onClose}
              className="rounded-xl bg-[#FF7A00] px-3.5 py-1.5 text-xs font-bold text-white shadow-sm"
            >
              Control Center
            </Link>
          </div>
        )}

        {menuCategories.map((cat, idx) => (
          <div key={idx} className="rounded-2xl border border-white/10 bg-white/[0.03] p-3.5 space-y-2">
            <div className="flex items-center justify-between pb-1.5 border-b border-white/5">
              <span className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">{cat.title}</span>
              <span className="text-[10px] text-slate-400">{cat.description}</span>
            </div>
            <div className="grid gap-2">
              {cat.items.map((item, i) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={i}
                    to={item.to}
                    onClick={onClose}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-white/[0.06] transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/10 text-white">
                        <IconComponent className="h-4 w-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs font-bold text-white">{item.name}</span>
                          {item.badge && (
                            <span className={`px-1.5 py-0.5 text-[9px] font-black rounded border ${item.badgeColor}`}>
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">{item.description}</p>
                      </div>
                    </div>
                    <span className="text-[11px] font-bold text-[#FF7A00] shrink-0 ml-2">{item.price}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}

        <div className="pt-2">
          <Link
            to="/products?category=hosting"
            onClick={onClose}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF7A00] to-[#E63946] py-3 text-xs font-black text-white shadow-md"
          >
            <span>Alle Hosting-Pakete vergleichen</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
      </div>
    );
  }

  // Desktop Luxury Mega Menu View
  return (
    <div
      role="menu"
      aria-label="Hosting Mega-Menü"
      className="w-full max-w-[1360px] mx-auto rounded-[32px] bg-gradient-to-b from-[#0A0E17] via-[#0F1420] to-[#0A0D16] p-7 sm:p-9 text-white shadow-[0_25px_70px_rgba(0,0,0,0.55)] border border-white/10 backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Top Header Bar inside Mega Menu */}
      <div className="flex items-center justify-between pb-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#D4AF37]/20 to-[#FF7A00]/20 text-[#D4AF37] border border-[#D4AF37]/30 shadow-inner">
            <Server className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/30">
                Swiss Hosting & Cloud
              </span>
              <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/50 px-2 py-0.5 rounded-full">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Rechenzentrum Zürich (CH)
              </span>
            </div>
            <p className="text-sm font-semibold text-slate-300 mt-0.5">
              Hochleistungs-Webhosting, NVMe-Cloud & WHM / cPanel Serverlösungen.
            </p>
          </div>
        </div>

        {/* User Direct Link to Customer Dashboard */}
        {user ? (
          <Link
            to="/dashboard?tab=servers"
            onClick={onClose}
            className="group flex items-center gap-2.5 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 px-4 py-2 text-xs font-bold text-white transition"
          >
            <div className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>Hosting-Verwaltung</span>
            <span className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-[#D4AF37] font-mono">
              {customerHostingCount} Aktiv
            </span>
            <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-white transition-transform group-hover:translate-x-0.5" />
          </Link>
        ) : (
          <Link
            to="/login"
            onClick={onClose}
            className="flex items-center gap-1.5 text-xs font-bold text-slate-400 hover:text-white transition"
          >
            <span>Bereits Kunde? Zum Login</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {/* Main 4-Column Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
        {menuCategories.map((cat, idx) => (
          <div key={idx} className="space-y-3.5">
            <div>
              <h3 className="text-xs font-black uppercase tracking-wider text-[#D4AF37]">
                {cat.title}
              </h3>
              <p className="text-[11px] text-slate-400">{cat.description}</p>
            </div>

            <div className="space-y-2">
              {cat.items.map((item, i) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={i}
                    to={item.to}
                    onClick={onClose}
                    className="group flex items-start gap-3 rounded-2xl p-3 border border-transparent hover:border-white/10 hover:bg-white/[0.04] transition-all duration-200 hover:-translate-y-0.5"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.07] text-slate-300 group-hover:bg-[#FF7A00]/20 group-hover:text-[#FF7A00] transition-colors border border-white/5">
                      <IconComponent className="h-4 w-4 transition-transform duration-200 group-hover:scale-110" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-xs font-bold text-white group-hover:text-[#FF7A00] transition-colors truncate">
                          {item.name}
                        </span>
                        {item.badge && (
                          <span
                            className={`px-1.5 py-0.5 text-[9px] font-black uppercase tracking-wider rounded border ${item.badgeColor} shrink-0`}
                          >
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug mt-0.5 line-clamp-2">
                        {item.description}
                      </p>
                      <p className="text-[10px] font-mono font-bold text-slate-400 group-hover:text-white mt-1 transition-colors">
                        {item.price}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Call to Action Banner inside Mega Menu */}
      <div className="pt-5 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h4 className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">
            Das passende Hosting für Ihr Projekt
          </h4>
          <p className="text-xs text-slate-400 mt-0.5">
            Leistungsstarkes Schweizer Webhosting für Websites, Onlineshops und anspruchsvolle Unternehmens-IT.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/products?category=hosting"
            onClick={onClose}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#FF7A00] to-[#E63946] px-5 py-2.5 text-xs font-black text-white shadow-md shadow-orange-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition"
          >
            <span>Alle Hosting-Produkte vergleichen</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          {pHostingPrem && (
            <Link
              to={`/products/${pHostingPrem.id}`}
              onClick={onClose}
              className="inline-flex items-center gap-1.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 px-4 py-2.5 text-xs font-bold text-white transition"
            >
              <span>Premium Hosting</span>
              <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
