import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Server,
  Cpu,
  Terminal,
  Layers,
  CheckCircle2,
  Shield,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Lock,
  ChevronRight,
  HardDrive,
  HelpCircle,
  Clock,
  ExternalLink,
  ChevronDown,
  Globe2,
  RefreshCw,
  Users,
  Check,
  X,
  AlertCircle,
  Database,
  Cloud,
  Mail,
  Sliders,
  PhoneCall
} from "lucide-react";
import api from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import { useAuth } from "../contexts/AuthContext";
import { useModals } from "../contexts/ModalContext";

export default function HostingLanding() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openQuote, openContact } = useModals();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFaq, setActiveFaq] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.get("/products");
      setProducts(res.data || []);
    } catch (err) {
      console.error("Fehler beim Laden der Hosting-Produkte:", err);
      setError("Die Hosting-Produkte konnten momentan nicht geladen werden.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    document.title = "Webhosting Schweiz | Schnelles & zuverlässiges Hosting | RedWORK";
    
    // Set canonical link
    let canonical = document.querySelector("link[rel='canonical']");
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = "https://redwork.ch/hosting";

    // Set meta description
    let metaDesc = document.querySelector("meta[name='description']");
    if (!metaDesc) {
      metaDesc = document.createElement("meta");
      metaDesc.name = "description";
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = "Professionelles Webhosting in der Schweiz mit moderner Infrastruktur, NVMe-Speicher und skalierbaren Hosting-Lösungen für Websites und Unternehmen.";

    fetchProducts();
  }, []);

  // Helper to find existing product dynamically from DB
  const findProduct = (nameKeywords) => {
    return products.find(p => {
      const pName = (p.name || "").toLowerCase();
      return nameKeywords.some(k => pName.includes(k.toLowerCase()));
    });
  };

  // Filter 3 target products dynamically from DB
  const pBasic = findProduct(["Webhosting Basic", "Linux Webhosting"]) || {
    id: "basic",
    name: "Linux Webhosting",
    unitPrice: 9.90,
    badge: "BELIEBT",
    shortDescription: "Ultraschneller Schweizer NVMe-Speicherplatz",
    features: [
      "1 Website / Domain",
      "10 GB NVMe SSD Speicher",
      "Unbegrenzter Datentransfer",
      "Kostenloses AutoSSL Zertifikat",
      "E-Mail-Postfächer inklusive",
      "cPanel Control Center"
    ]
  };

  const pPro = findProduct(["Webhosting Professional", "Business Webhosting"]) || {
    id: "professional",
    name: "Business Webhosting",
    unitPrice: 19.90,
    badge: "EMPFOHLEN",
    recommended: true,
    shortDescription: "High-Traffic Performance und automatische Backups",
    features: [
      "5 Websites / Domains",
      "50 GB NVMe SSD High-Speed",
      "Unbegrenzter Datentransfer",
      "AutoSSL für alle Domains",
      "Unbegrenzte E-Mail-Postfächer",
      "Tägliche automatisierte Backups",
      "cPanel & 1-Klick Installer (WordPress)"
    ]
  };

  const pEnterprise = findProduct(["Webhosting Enterprise", "Enterprise Webhosting"]) || {
    id: "enterprise",
    name: "Enterprise Webhosting",
    unitPrice: 49.90,
    badge: "PREMIUM",
    shortDescription: "Maximale Ressourcen mit dediziertem CDN",
    features: [
      "Unbegrenzte Websites",
      "200 GB NVMe SSD Enterprise",
      "Unbegrenzter Datentransfer",
      "Integrierte CDN-Beschleunigung",
      "Tägliche Backups mit 1-Klick Restore",
      "Höchste CPU & RAM Ressourcen",
      "24/7 Notfall-Support"
    ]
  };

  const coreProducts = [
    { ...pBasic, displayName: "Linux Webhosting", badge: pBasic.badge || "BELIEBT" },
    { ...pPro, displayName: "Business Webhosting", badge: pPro.badge || "EMPFOHLEN", isHighlight: true },
    { ...pEnterprise, displayName: "Enterprise Webhosting", badge: pEnterprise.badge || "PREMIUM" }
  ];

  const handleOrder = (product) => {
    if (!product?.id || product.id === "basic" || product.id === "professional" || product.id === "enterprise") {
      navigate("/hosting/webhosting");
      return;
    }
    if (!user) {
      sessionStorage.setItem("redwork_pending_product_id", product.id);
      navigate("/login");
      return;
    }
    navigate(`/dashboard/products/${product.id}`);
  };

  const handleDetails = (product) => {
    if (!product?.id || product.id === "basic" || product.id === "professional" || product.id === "enterprise") {
      navigate("/hosting/webhosting");
      return;
    }
    navigate(`/products/${product.id}`);
  };

  // Structured comparison table based on verified product fields
  const comparisonRows = [
    { label: "Speicherplatz (NVMe SSD)", basic: "10 GB NVMe", pro: "50 GB NVMe", ent: "200 GB NVMe" },
    { label: "Websites / Domains", basic: "1 Website", pro: "5 Websites", ent: "Unbegrenzt" },
    { label: "Datentransfer", basic: "Unbegrenzt", pro: "Unbegrenzt", ent: "Unbegrenzt" },
    { label: "SSL-Zertifikate (AutoSSL)", basic: true, pro: true, ent: true },
    { label: "Automatische Backups", basic: "Wöchentlich", pro: "Täglich", ent: "Täglich (1-Klick)" },
    { label: "E-Mail-Postfächer", basic: "Bis zu 10", pro: "Unbegrenzt", ent: "Unbegrenzt" },
    { label: "Datenbanken (MariaDB)", basic: "2 Datenbanken", pro: "10 Datenbanken", ent: "Unbegrenzt" },
    { label: "cPanel Control Center", basic: true, pro: true, ent: true },
    { label: "1-Klick Apps (WordPress)", basic: true, pro: true, ent: true },
    { label: "Dediziertes CDN", basic: false, pro: false, ent: true },
    { label: "Schweizer Standort (Zürich)", basic: true, pro: true, ent: true },
    { label: "Support", basic: "Standard", pro: "Prioritär", ent: "24/7 Notfall" },
  ];

  const faqs = [
    {
      q: "Welches Webhosting passt zu meiner Website?",
      a: "Für einfache Websites, Blogs oder Firmen-Visitenkarten ist das 'Linux Webhosting' (CHF 9.90 / Mt.) ideal. Für geschäftliche Auftritte mit mehreren Domains, Onlineshops und höherem Besucheraufkommen empfehlen wir das 'Business Webhosting' (CHF 19.90 / Mt.). Für maximale Performance und komplexe Portale bietet das 'Enterprise Webhosting' (CHF 49.90 / Mt.) höchste CPU-, RAM- und CDN-Ressourcen."
    },
    {
      q: "Kann ich später auf ein grösseres Paket wechseln?",
      a: "Ja, ein Upgrade auf ein höheres Webhosting- oder Cloud-Paket ist jederzeit in Ihrem Kunden-Dashboard ohne Ausfallzeit oder Datenverlust mit wenigen Klicks möglich."
    },
    {
      q: "Wo befinden sich die Server?",
      a: "Unsere gesamte Hosting-Infrastruktur wird in modernen, ISO-zertifizierten Rechenzentren in Zürich, Schweiz betrieben. Alle Daten verbleiben zu 100% in der Schweiz und unterliegen dem Schweizer Datenschutzgesetz (DSG)."
    },
    {
      q: "Welche Backups sind enthalten?",
      a: "Alle Webhosting-Tarife beinhalten automatisierte Backups Ihrer Webdaten, Datenbanken und E-Mails. Beim Business- und Enterprise-Tarif werden tägliche Backups angefertigt, die Sie bei Bedarf unkompliziert wiederherstellen können."
    },
    {
      q: "Kann ich eine eigene Domain verwenden?",
      a: "Selbstverständlich. Sie können entweder eine bestehende Domain zu RedWORK transferieren, per DNS auf Ihr Hosting aufschalten oder direkt neue .ch, .com, .de oder andere Domains registrieren."
    },
    {
      q: "Kann ich mehrere Websites hosten?",
      a: "Ja, ab dem Tarif 'Business Webhosting' können Sie bis zu 5 eigenständige Websites mit getrennten Verzeichnissen und Domains verwalten. Im 'Enterprise Webhosting' ist die Anzahl gehosteter Websites unbegrenzt."
    },
    {
      q: "Wie funktioniert die Bestellung?",
      a: "Wählen Sie Ihr gewünschtes Hosting-Paket aus, konfigurieren Sie Ihre Domain-Optionen und schliessen Sie die Bestellung online ab. Nach der Zahlungsbestätigung wird Ihr Hosting-Account vollautomatisch eingerichtet und Sie erhalten sofort Ihre cPanel-Zugangsdaten."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090F] text-white flex flex-col selection:bg-[#E63946] selection:text-white">
      <Header scrolled={true} />

      <main className="flex-1 pt-24 sm:pt-28 pb-20">
        
        {/* ================================================== */}
        {/* 1. HERO SECTION                                   */}
        {/* ================================================== */}
        <section className="relative overflow-hidden pt-8 pb-16 lg:py-24 border-b border-white/10">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-blue-900/15 via-transparent to-transparent pointer-events-none" />
          
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              {/* Left Column: Hero Text & CTAs */}
              <div className="lg:col-span-7 text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-white/10 text-xs font-black tracking-wider text-[#D4AF37] uppercase mb-6 shadow-sm">
                  <Server className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>SWISS HOSTING & CLOUD</span>
                </div>

                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                  Webhosting, das einfach funktioniert.
                </h1>

                <p className="mt-4 text-base sm:text-lg text-slate-300 font-semibold leading-snug">
                  Leistungsstarkes Hosting auf Schweizer Infrastruktur – schnell, sicher und zuverlässig.
                </p>

                <p className="mt-4 text-sm sm:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                  Von privaten Websites bis zu geschäftskritischen Anwendungen: RedWORK bietet zuverlässiges Hosting mit moderner Infrastruktur, NVMe-Speicher und persönlichem Support.
                </p>

                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                  <a
                    href="#produkte"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF7A00] to-[#E63946] px-7 py-3.5 text-sm font-black text-white shadow-lg shadow-orange-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition"
                  >
                    <span>Webhosting entdecken</span>
                    <ArrowRight className="h-4 w-4" />
                  </a>
                  <a
                    href="#vergleich"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/15 px-6 py-3.5 text-sm font-bold text-white transition"
                  >
                    <span>Hosting vergleichen</span>
                  </a>
                </div>
              </div>

              {/* Right Column: Premium Infrastructure Visualization */}
              <div className="lg:col-span-5">
                <div className="relative rounded-[32px] bg-gradient-to-b from-white/[0.08] via-[#0F1420] to-[#0A0D16] p-6 sm:p-8 border border-white/15 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between pb-5 border-b border-white/10">
                    <div className="flex items-center gap-2.5">
                      <div className="h-3 w-3 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Systemstatus: Optimal</span>
                    </div>
                    <span className="text-[11px] font-mono text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded border border-[#D4AF37]/20">
                      Standort Zürich (CH)
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3.5 mt-5">
                    <div className="rounded-2xl bg-white/[0.03] p-4 border border-white/5">
                      <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                        <Cloud className="h-3.5 w-3.5 text-blue-400" />
                        <span>Cloud Server</span>
                      </div>
                      <p className="text-base font-bold text-white">NVMe Architektur</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Optimiert für Speed</p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.03] p-4 border border-white/5">
                      <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                        <HardDrive className="h-3.5 w-3.5 text-[#FF7A00]" />
                        <span>NVMe Storage</span>
                      </div>
                      <p className="text-base font-bold text-white">High I/O SSD</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">Minimalste Latenz</p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.03] p-4 border border-white/5">
                      <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                        <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                        <span>Swiss Cloud</span>
                      </div>
                      <p className="text-base font-bold text-white">100% Schweiz</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">DSG-konform</p>
                    </div>

                    <div className="rounded-2xl bg-white/[0.03] p-4 border border-white/5">
                      <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                        <Zap className="h-3.5 w-3.5 text-[#D4AF37]" />
                        <span>Verfügbarkeit</span>
                      </div>
                      <p className="text-base font-bold text-white">99.9% Uptime</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">24/7 Monitoring</p>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
                    <span>cPanel / WHM bereitgestellt</span>
                    <span className="text-emerald-400 font-semibold">Aktiv & gesichert</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ================================================== */}
        {/* 2. TRUST BAR                                       */}
        {/* ================================================== */}
        <section className="border-b border-white/10 bg-[#090C14]/80 py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <p className="text-xs sm:text-sm font-semibold text-slate-400 mb-4 tracking-wide">
              Entwickelt für Websites, Unternehmen und anspruchsvolle Anwendungen
            </p>
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs sm:text-sm font-bold text-slate-200">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="h-4 w-4" />
                <span className="text-white">Schweizer Infrastruktur</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="h-4 w-4" />
                <span className="text-white">NVMe SSD</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="h-4 w-4" />
                <span className="text-white">SSL inklusive</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="h-4 w-4" />
                <span className="text-white">Automatische Backups</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="h-4 w-4" />
                <span className="text-white">Skalierbare Ressourcen</span>
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Check className="h-4 w-4" />
                <span className="text-white">Persönlicher Support</span>
              </span>
            </div>
          </div>
        </section>


        {/* ================================================== */}
        {/* 3. HOSTING PRODUKTE                                */}
        {/* ================================================== */}
        <section id="produkte" className="py-20 lg:py-28 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Hosting-Tarife</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
                Das passende Hosting für jedes Projekt
              </h2>
              <p className="text-sm sm:text-base text-slate-400 mt-3">
                Vom schnellen Einstieg bis zur leistungsstarken Enterprise-Infrastruktur.
              </p>
            </div>

            {/* Error / Loading States */}
            {loading && (
              <div className="py-16 text-center">
                <RefreshCw className="h-8 w-8 text-[#D4AF37] animate-spin mx-auto mb-3" />
                <p className="text-sm text-slate-400 font-semibold">Produkte werden geladen...</p>
              </div>
            )}

            {error && !loading && (
              <div className="rounded-3xl border border-red-500/20 bg-red-950/20 p-8 text-center max-w-lg mx-auto mb-8">
                <AlertCircle className="h-8 w-8 text-red-400 mx-auto mb-2" />
                <p className="text-sm text-red-200 font-semibold mb-4">{error}</p>
                <button
                  onClick={fetchProducts}
                  className="rounded-xl bg-white/10 hover:bg-white/20 px-4 py-2 text-xs font-bold text-white transition"
                >
                  Erneut versuchen
                </button>
              </div>
            )}

            {!loading && !error && coreProducts.length === 0 && (
              <div className="rounded-3xl border border-white/10 bg-white/5 p-12 text-center max-w-lg mx-auto">
                <p className="text-sm text-slate-400">Momentan sind keine Hosting-Produkte verfügbar.</p>
              </div>
            )}

            {/* 3 Premium Product Cards */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
                {coreProducts.map((p, idx) => {
                  const isHighlight = p.isHighlight;
                  const feats = Array.isArray(p.features) && p.features.length > 0
                    ? p.features
                    : (p.description || "").split("\n").filter(Boolean);

                  return (
                    <div
                      key={p.id || idx}
                      className={`relative flex flex-col justify-between rounded-[32px] p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                        isHighlight
                          ? "bg-gradient-to-b from-[#141B2D] via-[#0F1420] to-[#0A0D16] border-2 border-[#D4AF37] shadow-[0_20px_50px_rgba(212,175,55,0.15)]"
                          : "bg-gradient-to-b from-[#0F1420] to-[#0A0D16] border border-white/10 shadow-xl hover:border-white/20"
                      }`}
                    >
                      {/* Badge */}
                      {p.badge && (
                        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                          <span className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FF7A00] px-4 py-1 text-[11px] font-black uppercase tracking-wider text-black shadow-md">
                            {p.badge}
                          </span>
                        </div>
                      )}

                      <div>
                        <div className="flex items-center justify-between gap-2 mb-2">
                          <h3 className="text-2xl font-black text-white">{p.displayName}</h3>
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-[#D4AF37] border border-white/10">
                            <Server className="h-4 w-4" />
                          </div>
                        </div>

                        <p className="text-xs sm:text-sm text-slate-400 min-h-[40px] leading-relaxed mb-6">
                          {p.shortDescription || p.description}
                        </p>

                        {/* Price Block */}
                        <div className="rounded-2xl bg-white/[0.04] p-5 border border-white/5 mb-6">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-xs font-bold text-slate-400">CHF</span>
                            <span className="text-4xl font-black text-white tracking-tight">
                              {Number(p.unitPrice || 0).toFixed(2)}
                            </span>
                            <span className="text-xs font-semibold text-slate-400">/ Mt.</span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-1">Monatlich kündbar, inkl. Schweizer Support</p>
                        </div>

                        {/* Features Checklist */}
                        <div className="space-y-3 mb-8">
                          <p className="text-xs font-black uppercase tracking-wider text-slate-400">Inklusive:</p>
                          {feats.slice(0, 6).map((feat, fIdx) => (
                            <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                              <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                              <span>{feat}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Action CTAs */}
                      <div className="space-y-2 pt-4 border-t border-white/10">
                        <button
                          onClick={() => handleOrder(p)}
                          className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                            isHighlight
                              ? "bg-gradient-to-r from-[#FF7A00] to-[#E63946] text-white hover:opacity-95 shadow-orange-500/20"
                              : "bg-white text-slate-900 hover:bg-slate-100"
                          }`}
                        >
                          <span>Jetzt bestellen</span>
                          <ArrowRight className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDetails(p)}
                          className="w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-white transition"
                        >
                          Details ansehen
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>


        {/* ================================================== */}
        {/* 4. HOSTING VERGLEICH                               */}
        {/* ================================================== */}
        <section id="vergleich" className="py-20 lg:py-28 border-b border-white/10 bg-[#090C14]/50">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Transparenz & Fakten</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
                Welches Hosting passt zu Ihnen?
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Detaillierter Funktions- und Ressourcenvergleich aller Webhosting-Tarife.
              </p>
            </div>

            {/* Responsive Table Container */}
            <div className="overflow-x-auto rounded-[32px] border border-white/10 bg-gradient-to-b from-[#0F1420] to-[#0A0D16] shadow-2xl">
              <table className="w-full text-left border-collapse min-w-[640px]">
                <thead>
                  <tr className="border-b border-white/10 bg-white/[0.02]">
                    <th className="p-5 text-sm font-black text-white w-1/4">Leistungsmerkmal</th>
                    <th className="p-5 text-sm font-black text-white w-1/4 text-center">
                      <div>Linux Webhosting</div>
                      <div className="text-xs text-[#FF7A00] font-normal mt-0.5">CHF {Number(pBasic.unitPrice || 9.90).toFixed(2)}/Mt.</div>
                    </th>
                    <th className="p-5 text-sm font-black text-[#D4AF37] w-1/4 text-center bg-[#D4AF37]/5">
                      <div>Business Webhosting</div>
                      <div className="text-xs text-white font-normal mt-0.5">CHF {Number(pPro.unitPrice || 19.90).toFixed(2)}/Mt.</div>
                    </th>
                    <th className="p-5 text-sm font-black text-white w-1/4 text-center">
                      <div>Enterprise Webhosting</div>
                      <div className="text-xs text-[#FF7A00] font-normal mt-0.5">CHF {Number(pEnterprise.unitPrice || 49.90).toFixed(2)}/Mt.</div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                  {comparisonRows.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-white/[0.02] transition">
                      <td className="p-4 sm:p-5 font-semibold text-slate-300">{row.label}</td>
                      <td className="p-4 sm:p-5 text-center text-slate-400">
                        {typeof row.basic === "boolean" ? (
                          row.basic ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-4 w-4 text-slate-600 mx-auto" />
                        ) : row.basic}
                      </td>
                      <td className="p-4 sm:p-5 text-center font-bold text-white bg-[#D4AF37]/5">
                        {typeof row.pro === "boolean" ? (
                          row.pro ? <Check className="h-4 w-4 text-[#D4AF37] mx-auto" /> : <X className="h-4 w-4 text-slate-600 mx-auto" />
                        ) : row.pro}
                      </td>
                      <td className="p-4 sm:p-5 text-center text-slate-300 font-semibold">
                        {typeof row.ent === "boolean" ? (
                          row.ent ? <Check className="h-4 w-4 text-emerald-400 mx-auto" /> : <X className="h-4 w-4 text-slate-600 mx-auto" />
                        ) : row.ent}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>


        {/* ================================================== */}
        {/* 5. WHY REDWORK                                     */}
        {/* ================================================== */}
        <section className="py-20 lg:py-28 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Qualität & Zuverlässigkeit</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Warum RedWORK?</h2>
              <p className="text-sm text-slate-400 mt-2">
                Kompromisslose Infrastruktur mit persönlichem Schweizer Support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#D4AF37]/10 text-[#D4AF37] mb-5 border border-[#D4AF37]/20">
                  <Globe2 className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">SCHWEIZER INFRASTRUKTUR</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Hosting auf moderner Infrastruktur mit Fokus auf Performance und Zuverlässigkeit.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FF7A00]/10 text-[#FF7A00] mb-5 border border-[#FF7A00]/20">
                  <Zap className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">NVMe PERFORMANCE</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Schnelle SSD-Technologie für kurze Ladezeiten und reaktionsschnelle Anwendungen.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-400 mb-5 border border-emerald-500/20">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">SICHERHEIT</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Moderne Sicherheitsmechanismen und kontinuierliche Systempflege für maximale Integrität.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-400 mb-5 border border-blue-500/20">
                  <RefreshCw className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">BACKUPS</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Automatisierte Backups für zusätzliche Sicherheit und schnelle Wiederherstellung.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400 mb-5 border border-purple-500/20">
                  <Layers className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">SKALIERBAR</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Hosting, das mit Ihren Anforderungen wachsen kann – vom Blog bis zum Cloud-Cluster.
                </p>
              </div>

              <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-7 transition hover:border-white/20">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400 mb-5 border border-cyan-500/20">
                  <Users className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">PERSÖNLICHER SUPPORT</h3>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                  Direkter Schweizer Ansprechpartner statt anonymer Massenabfertigung.
                </p>
              </div>
            </div>
          </div>
        </section>


        {/* ================================================== */}
        {/* 6. HOSTING FÜR JEDEN EINSATZ (CATEGORY NAV)        */}
        {/* ================================================== */}
        <section className="py-20 lg:py-28 border-b border-white/10 bg-[#090C14]/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Vielfalt & Spezialisierung</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
                Hosting für jede Anforderung
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Wählen Sie die optimale Architektur für Ihr Vorhaben.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-7 flex flex-col justify-between hover:border-[#D4AF37]/50 transition">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-[#D4AF37] mb-4">
                    <Terminal className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">WEBHOSTING</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Für Websites und Unternehmensauftritte mit NVMe und AutoSSL.
                  </p>
                </div>
                <Link
                  to="/hosting/webhosting"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-black text-[#D4AF37] hover:text-white transition"
                >
                  <span>Webhosting entdecken</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-7 flex flex-col justify-between hover:border-[#D4AF37]/50 transition">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-cyan-400 mb-4">
                    <Users className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">BUSINESS</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Für Unternehmen, Agenturen und Reseller mit eigener Tarif-Verwaltung via WHM.
                  </p>
                </div>
                <Link
                  to="/hosting/reseller"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-black text-cyan-400 hover:text-white transition"
                >
                  <span>Business Hosting</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-7 flex flex-col justify-between hover:border-[#D4AF37]/50 transition">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-amber-400 mb-4">
                    <Cpu className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">SERVER & CLOUD</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Für anspruchsvolle Anwendungen und individuelle Infrastruktur mit Root-Access.
                  </p>
                </div>
                <Link
                  to="/hosting/server"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-black text-amber-400 hover:text-white transition"
                >
                  <span>Server & Cloud</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-7 flex flex-col justify-between hover:border-[#D4AF37]/50 transition">
                <div>
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 text-purple-400 mb-4">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white">SPECIALIZED</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    WordPress, Business Mail und Managed Services für Rundum-Sorglos-Betrieb.
                  </p>
                </div>
                <Link
                  to="/hosting/wordpress"
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-black text-purple-400 hover:text-white transition"
                >
                  <span>Speziallösungen</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>


        {/* ================================================== */}
        {/* 7. SWISS INFRASTRUCTURE SECTION                    */}
        {/* ================================================== */}
        <section className="py-20 lg:py-28 border-b border-white/10 bg-gradient-to-b from-[#07090F] via-[#0C101A] to-[#07090F]">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              
              <div className="lg:col-span-6">
                <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Infrastruktur</span>
                <h2 className="text-3xl sm:text-4xl font-black text-white mt-2 leading-tight">
                  Hosting auf Schweizer Infrastruktur.
                </h2>
                <p className="text-sm sm:text-base text-slate-300 mt-4 leading-relaxed">
                  Leistungsfähige Infrastruktur für Websites, Unternehmen und digitale Anwendungen.
                </p>

                {/* Technical flow visual */}
                <div className="mt-8 space-y-3 font-mono text-xs max-w-md">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <Globe2 className="h-4 w-4 text-blue-400" />
                    <span>Internet & Global Routing</span>
                  </div>
                  <div className="flex justify-center text-slate-500 font-bold">↓</div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-[#D4AF37]/30 text-[#D4AF37]">
                    <Cloud className="h-4 w-4" />
                    <span>RedWORK Cloud (Zürich, CH)</span>
                  </div>
                  <div className="flex justify-center text-slate-500 font-bold">↓</div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-white/10">
                    <HardDrive className="h-4 w-4 text-[#FF7A00]" />
                    <span>High-Speed NVMe Storage Arrays</span>
                  </div>
                  <div className="flex justify-center text-slate-500 font-bold">↓</div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.04] border border-emerald-500/30 text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Ihre Web Applications & Services</span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <h4 className="text-base font-bold text-white">Performance</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Schnelle Datenübertragung durch optimierte Schweizer Uplinks und moderne Hardware.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <h4 className="text-base font-bold text-white">Security</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Sicherheitsarchitektur auf mehreren Ebenen mit automatisierten Zertifikaten und Updates.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <h4 className="text-base font-bold text-white">Reliability</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Kontinuierliche Systemüberwachung für stabile Laufzeiten rund um die Uhr.
                  </p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                  <h4 className="text-base font-bold text-white">Scalability</h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Flexible Ressourcenanpassung bei wachsendem Speicher- oder Rechenbedarf.
                  </p>
                </div>
              </div>

            </div>
          </div>
        </section>


        {/* ================================================== */}
        {/* 8. PERFORMANCE SECTION                             */}
        {/* ================================================== */}
        <section className="py-20 lg:py-24 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
            <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">High Speed</span>
            <h2 className="text-3xl sm:text-5xl font-black text-white mt-2">
              Geschwindigkeit, die man merkt.
            </h2>

            <div className="mt-12 flex flex-wrap items-center justify-center gap-6 sm:gap-10">
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-6 min-w-[200px]">
                <span className="block text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#D4AF37] to-[#FF7A00]">
                  NVMe
                </span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1 block">SSD Speicher</span>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-6 min-w-[200px]">
                <span className="block text-4xl sm:text-5xl font-black text-white">
                  High
                </span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1 block">Performance</span>
              </div>
              <div className="rounded-3xl border border-white/10 bg-white/[0.03] px-8 py-6 min-w-[200px]">
                <span className="block text-4xl sm:text-5xl font-black text-emerald-400">
                  Low
                </span>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1 block">Latency</span>
              </div>
            </div>

            <p className="mt-8 text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Moderne Speicher- und Servertechnologien sorgen für schnelle Ladezeiten und eine stabile Umgebung.
            </p>
          </div>
        </section>


        {/* ================================================== */}
        {/* 9. SECURITY SECTION                                */}
        {/* ================================================== */}
        <section className="py-20 lg:py-28 border-b border-white/10 bg-[#090C14]/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Integrität & Schutz</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
                Sicherheit gehört zum Hosting.
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Wir schützen Ihre Unternehmensdaten proaktiv vor Bedrohungen und Datenverlust.
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {[
                { name: "SSL", desc: "AutoSSL inklusive" },
                { name: "Backups", desc: "Tägliche Sicherung" },
                { name: "Updates", desc: "Regelmässige Patches" },
                { name: "Monitoring", desc: "24/7 Systemüberwachung" },
                { name: "Access Protection", desc: "Sichere Zugänge" },
                { name: "Secure Infra", desc: "Schweizer Datacenter" }
              ].map((sec, sIdx) => (
                <div key={sIdx} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4 text-center">
                  <Lock className="h-5 w-5 text-emerald-400 mx-auto mb-2" />
                  <h4 className="text-sm font-bold text-white">{sec.name}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{sec.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ================================================== */}
        {/* 10. DOMAIN / WEBSITE / BUSINESS FLOW               */}
        {/* ================================================== */}
        <section className="py-20 lg:py-28 border-b border-white/10">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16">
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Einfacher Ablauf</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">
                In 5 Schritten zu Ihrem Hosting
              </h2>
              <p className="text-sm text-slate-400 mt-2">
                Klar strukturierter Prozess für einen reibungslosen Start.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {[
                { step: "01", title: "Projekt auswählen", desc: "Definieren Sie Anforderungen und Ziele Ihres Vorhabens." },
                { step: "02", title: "Hosting wählen", desc: "Entscheiden Sie sich für den passenden Leistungstarif." },
                { step: "03", title: "Konfigurieren", desc: "Wählen Sie Ihre Wunschdomain und optionale Zusatzfeatures." },
                { step: "04", title: "Bestellen", desc: "Sichere Buchung und automatische Systembereitstellung." },
                { step: "05", title: "Online starten", desc: "Sofortiger Zugriff auf cPanel und Projektbereitstellung." },
              ].map((st, i) => (
                <div key={i} className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 flex flex-col justify-between">
                  <div>
                    <span className="text-2xl font-mono font-black text-[#D4AF37] block mb-3">{st.step}</span>
                    <h4 className="text-base font-bold text-white mb-2">{st.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{st.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ================================================== */}
        {/* 11. FAQ ACCORDION                                  */}
        {/* ================================================== */}
        <section className="py-20 lg:py-28 border-b border-white/10 bg-[#090C14]/40">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Fragen & Antworten</span>
              <h2 className="text-3xl sm:text-4xl font-black text-white mt-2">Häufig gestellte Fragen</h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-2">Antworten auf die wichtigsten Fragen rund um Schweizer Webhosting</p>
            </div>

            <div className="space-y-3">
              {faqs.map((faq, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border border-white/10 bg-white/[0.02] overflow-hidden transition"
                >
                  <button
                    type="button"
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-sm text-white hover:bg-white/[0.04]"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-slate-400 transition-transform ${activeFaq === idx ? "rotate-180 text-[#D4AF37]" : ""}`} />
                  </button>
                  {activeFaq === idx && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-white/5">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ================================================== */}
        {/* 12. FINAL CTA                                      */}
        {/* ================================================== */}
        <section className="py-20 lg:py-28 text-center">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="rounded-[36px] bg-gradient-to-b from-[#141B2D] via-[#0F1420] to-[#0A0D16] p-10 sm:p-16 border border-white/15 shadow-2xl">
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Startklar</span>
              <h2 className="text-3xl sm:text-5xl font-black text-white mt-2 leading-tight">
                Bereit für professionelles Hosting?
              </h2>
              <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mt-4 leading-relaxed">
                Starten Sie mit leistungsstarkem Hosting von RedWORK.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a
                  href="#produkte"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-[#FF7A00] to-[#E63946] px-8 py-4 text-sm font-black text-white shadow-xl shadow-orange-500/25 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <span>Hosting auswählen</span>
                  <ArrowRight className="h-4 w-4" />
                </a>
                <button
                  onClick={openContact}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 px-8 py-4 text-sm font-bold text-white transition"
                >
                  <PhoneCall className="h-4 w-4" />
                  <span>Kontakt aufnehmen</span>
                </button>
              </div>
            </div>
          </div>
        </section>

      </main>

      <Footer />
      <ContactModal />
    </div>
  );
}
