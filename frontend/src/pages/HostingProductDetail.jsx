import React, { useState, useEffect, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
  PhoneCall,
  CreditCard,
  Building2,
  FileText,
  DollarSign,
  Headphones,
  Award,
  ArrowLeft,
  CheckCheck,
  Info
} from "lucide-react";
import api from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import { useAuth } from "../contexts/AuthContext";
import { useModals } from "../contexts/ModalContext";

export default function HostingProductDetail() {
  const { categorySlug, productSlug } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openContact } = useModals();

  const [currentProduct, setCurrentProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Billing cycle selection: monthly | yearly
  const [billingCycle, setBillingCycle] = useState("yearly");

  // Checkout Modal State
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState(1); // 1: Tarif, 2: Domain, 3: Zahlung, 4: Übersicht, 5: Erfolgreich
  const [domainChoice, setDomainChoice] = useState("later"); // later | new | transfer
  const [domainName, setDomainName] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("invoice"); // invoice | credit_card | twint
  const [orderSubmitting, setOrderSubmitting] = useState(false);
  const [orderSuccessData, setOrderSuccessData] = useState(null);
  const [orderError, setOrderError] = useState("");

  // Helper to normalize strings into slugs
  const slugify = (text = "") =>
    text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  // Load all products and identify current product
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    const loadData = async () => {
      try {
        const res = await api.get("/products");
        const list = res.data || [];
        if (!isMounted) return;
        setAllProducts(list);

        const targetSlug = (productSlug || "").toLowerCase();
        // Match by slug, id, or name
        let matched = list.find(
          (p) =>
            (p.slug && p.slug.toLowerCase() === targetSlug) ||
            p.id === targetSlug ||
            slugify(p.name) === targetSlug ||
            (p.name || "").toLowerCase().includes(targetSlug)
        );

        if (!matched && list.length > 0) {
          // Fallback to first hosting product
          matched = list.find((p) =>
            (p.name || "").toLowerCase().includes("hosting")
          ) || list[0];
        }

        if (matched) {
          setCurrentProduct(matched);
          const pageTitle = `${matched.name} | High-End Webhosting Schweiz | RedWORK`;
          document.title = pageTitle;

          // Set canonical link
          let canonical = document.querySelector("link[rel='canonical']");
          if (!canonical) {
            canonical = document.createElement("link");
            canonical.rel = "canonical";
            document.head.appendChild(canonical);
          }
          canonical.href = window.location.href;

          // Set meta description
          let metaDesc = document.querySelector("meta[name='description']");
          if (!metaDesc) {
            metaDesc = document.createElement("meta");
            metaDesc.name = "description";
            document.head.appendChild(metaDesc);
          }
          metaDesc.content = matched.description || `${matched.name} – Modernes High-Performance Webhosting auf Schweizer NVMe-Servern mit garantierter Uptime und persönlichem Support.`;

          // Set OpenGraph tags
          const setOg = (property, content) => {
            let el = document.querySelector(`meta[property='${property}']`);
            if (!el) {
              el = document.createElement("meta");
              el.setAttribute("property", property);
              document.head.appendChild(el);
            }
            el.setAttribute("content", content);
          };
          setOg("og:title", pageTitle);
          setOg("og:description", metaDesc.content);
          setOg("og:type", "product");
        } else {
          setError("Das gewünschte Hosting-Produkt konnte nicht gefunden werden.");
        }
      } catch (err) {
        console.error("Fehler beim Laden des Hosting-Produkts:", err);
        if (isMounted) setError("Fehler beim Laden des Hosting-Produkts.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [productSlug, categorySlug]);

  // Check if pending order in sessionStorage for this product
  useEffect(() => {
    const pendingId = sessionStorage.getItem("redwork_pending_product_id");
    if (user && pendingId && currentProduct && currentProduct.id === pendingId) {
      sessionStorage.removeItem("redwork_pending_product_id");
      sessionStorage.removeItem("redwork_pending_redirect");
      setShowCheckoutModal(true);
    }
  }, [user, currentProduct]);

  // Pricing calculations
  const baseMonthlyPrice = Number(currentProduct?.unitPrice) || 0;
  const yearlyMonthlyPrice = (baseMonthlyPrice * 0.9).toFixed(2);
  const activeMonthlyPrice = billingCycle === "yearly" ? yearlyMonthlyPrice : baseMonthlyPrice.toFixed(2);
  const totalBilled =
    billingCycle === "yearly"
      ? (Number(yearlyMonthlyPrice) * 12).toFixed(2)
      : baseMonthlyPrice.toFixed(2);

  // Derive other hosting plans for comparison
  const hostingPlans = useMemo(() => {
    if (!allProducts.length) return [];
    return allProducts
      .filter((p) => {
        if (p.status === "inactive") return false;
        const name = (p.name || "").toLowerCase();
        const sub = (p.menuSubcategory || "").toLowerCase();
        return name.includes("hosting") || sub === "webhosting";
      })
      .sort((a, b) => (Number(a.unitPrice) || 0) - (Number(b.unitPrice) || 0));
  }, [allProducts]);

  // Categorized Technical Details derived completely from MongoDB
  const categorizedSpecs = useMemo(() => {
    if (!currentProduct) return [];
    const details = currentProduct.technicalDetails || [];
    const rawItems = [];

    if (Array.isArray(details) && details.length > 0) {
      details.forEach((item) => {
        if (typeof item === "string" && item.includes(":")) {
          const [k, ...rest] = item.split(":");
          rawItems.push({ key: k.trim(), value: rest.join(":").trim() });
        } else if (typeof item === "string") {
          rawItems.push({ key: item.trim(), value: "Inklusive" });
        }
      });
    } else if (typeof details === "object" && details !== null) {
      Object.entries(details).forEach(([k, v]) => {
        if (v) rawItems.push({ key: k.trim(), value: String(v).trim() });
      });
    }

    // If no technicalDetails but features exist, populate from features
    if (rawItems.length === 0 && Array.isArray(currentProduct.features)) {
      currentProduct.features.forEach((feat) => {
        rawItems.push({ key: feat.trim(), value: "Inklusive" });
      });
    }

    // Group into logical Swiss SaaS categories based on keywords
    const categories = {
      "Ressourcen & Performance": { icon: HardDrive, items: [] },
      "Domains & Web": { icon: Globe2, items: [] },
      "Sicherheit & Backup": { icon: ShieldCheck, items: [] },
      "E-Mail & Datenbanken": { icon: Mail, items: [] },
      "Verwaltung & Plattform": { icon: Sliders, items: [] }
    };

    rawItems.forEach((item) => {
      const lk = item.key.toLowerCase();
      if (lk.includes("speicher") || lk.includes("ssd") || lk.includes("nvme") || lk.includes("cpu") || lk.includes("ram") || lk.includes("traffic") || lk.includes("transfer")) {
        categories["Ressourcen & Performance"].items.push(item);
      } else if (lk.includes("website") || lk.includes("domain") || lk.includes("subdomain")) {
        categories["Domains & Web"].items.push(item);
      } else if (lk.includes("ssl") || lk.includes("backup") || lk.includes("sicherheit") || lk.includes("schutz")) {
        categories["Sicherheit & Backup"].items.push(item);
      } else if (lk.includes("mail") || lk.includes("postfach") || lk.includes("datenbank") || lk.includes("mariadb") || lk.includes("mysql")) {
        categories["E-Mail & Datenbanken"].items.push(item);
      } else {
        categories["Verwaltung & Plattform"].items.push(item);
      }
    });

    // Filter out empty categories
    return Object.entries(categories)
      .filter(([_, data]) => data.items.length > 0)
      .map(([title, data]) => ({ title, icon: data.icon, items: data.items }));
  }, [currentProduct]);

  // Derived high-impact feature cards with sensible explanations derived strictly from data
  const featureCards = useMemo(() => {
    if (!currentProduct) return [];
    const feats = Array.isArray(currentProduct.features) ? currentProduct.features : [];
    
    return feats.slice(0, 6).map((feat) => {
      const lower = feat.toLowerCase();
      let icon = CheckCircle2;
      let tag = "Feature";
      let explanation = "Direkt auf Schweizer Server-Infrastruktur bereitgestellt.";

      if (lower.includes("speicher") || lower.includes("ssd") || lower.includes("nvme")) {
        icon = HardDrive;
        tag = "Performance";
        explanation = "High-Speed NVMe Solid-State-Drives für schnellste Ladezeiten.";
      } else if (lower.includes("domain") || lower.includes("website")) {
        icon = Globe2;
        tag = "Kapazität";
        explanation = "Volle Unterstützung für moderne Domains inklusive DNS-Verwaltung.";
      } else if (lower.includes("ssl")) {
        icon = Lock;
        tag = "Sicherheit";
        explanation = "Automatische Verschlüsselung für sichere Datenübertragung und Vertrauen.";
      } else if (lower.includes("backup")) {
        icon = RefreshCw;
        tag = "Datenschutz";
        explanation = "Regelmässige automatisierte Sicherungen für maximale Datensicherheit.";
      } else if (lower.includes("mail") || lower.includes("postfach")) {
        icon = Mail;
        tag = "Kommunikation";
        explanation = "Eigene E-Mail-Postfächer mit Webmail, IMAP und Spam-Schutz.";
      } else if (lower.includes("datenbank") || lower.includes("mariadb")) {
        icon = Database;
        tag = "Datenbank";
        explanation = "Leistungsstarke MariaDB Datenbanken für CMS wie WordPress.";
      } else if (lower.includes("cpanel") || lower.includes("installer") || lower.includes("apps")) {
        icon = Sliders;
        tag = "Bedienung";
        explanation = "Einfache Verwaltung über die marktführende cPanel-Oberfläche.";
      } else if (lower.includes("support")) {
        icon = Headphones;
        tag = "Service";
        explanation = "Kompetente Schweizer Unterstützung bei technischen Fragen.";
      }

      return {
        title: feat,
        icon,
        tag,
        explanation
      };
    });
  }, [currentProduct]);

  // Start order / checkout flow
  const handleStartOrder = () => {
    if (!user) {
      const currentPath = window.location.pathname;
      sessionStorage.setItem("redwork_pending_product_id", currentProduct.id);
      sessionStorage.setItem("redwork_pending_redirect", currentPath);
      navigate("/login");
      return;
    }
    setShowCheckoutModal(true);
    setCheckoutStep(1);
    setOrderError("");
  };

  // Submit order to API
  const handleCompleteOrder = async () => {
    setOrderSubmitting(true);
    setOrderError("");
    try {
      const payload = {
        productId: currentProduct.id,
        duration: billingCycle,
        quantity: 1,
        domainChoice,
        domainName: domainChoice !== "later" ? domainName : undefined,
        paymentMethod
      };

      const res = await api.post("/orders", payload);
      setOrderSuccessData(res.data);
      setCheckoutStep(5);
    } catch (err) {
      console.error("Order submission failed:", err);
      setOrderError(
        err.response?.data?.detail ||
          "Fehler bei der Bestellung. Bitte überprüfen Sie Ihre Eingaben oder kontaktieren Sie unseren Support."
      );
    } finally {
      setOrderSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between">
        <Header scrolled={true} />
        <div className="flex-1 flex flex-col items-center justify-center p-12">
          <RefreshCw className="w-10 h-10 text-[#E63946] animate-spin mb-4" />
          <p className="text-slate-600 font-medium">Lade Tarifdetails...</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className="min-h-screen bg-[#f8fafc] flex flex-col justify-between">
        <Header scrolled={true} />
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center max-w-lg mx-auto">
          <AlertCircle className="w-16 h-16 text-rose-500 mb-4" />
          <h1 className="text-2xl font-bold text-[#102452] mb-2">Tarif nicht verfügbar</h1>
          <p className="text-slate-600 mb-6">
            {error || "Der angeforderte Hosting-Tarif konnte momentan nicht geladen werden."}
          </p>
          <Link
            to="/hosting"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#E63946] text-white rounded-xl font-semibold shadow-lg hover:bg-[#d02e3b] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
            Zurück zur Übersicht
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-800 flex flex-col justify-between antialiased selection:bg-red-500 selection:text-white">
      <Header scrolled={true} />

      <main className="flex-1 pt-24 pb-28">
        {/* Breadcrumb Navigation */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-2">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-[#E63946] transition-colors">Startseite</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <Link to="/hosting" className="hover:text-[#E63946] transition-colors">Hosting</Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <Link to={`/hosting/${categorySlug || "webhosting"}`} className="hover:text-[#E63946] transition-colors capitalize">
              {categorySlug || "Webhosting"}
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
            <span className="text-[#102452] font-bold">{currentProduct.name}</span>
          </nav>
        </div>

        {/* ULTRA-LUXURY HERO SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
            
            {/* Left Column: Product Branding, Dynamic Pitch & Highlights */}
            <div className="lg:col-span-7 space-y-6">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="px-3 py-1 rounded-md bg-[#102452]/5 text-[#102452] text-xs font-black uppercase tracking-wider">
                  WEBHOSTING
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-red-50 text-[#E63946] border border-red-200/80 text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" />
                  {currentProduct.badge || "Swiss Enterprise Quality"}
                </span>
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#102452] tracking-tight leading-tight">
                {currentProduct.name}
              </h1>

              <p className="text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-2xl">
                {currentProduct.description ||
                  "Zuverlässiges High-Performance Webhosting auf Schweizer NVMe-Servern. Optimiert für maximale Uptime, DSG-Konformität und persönliche Schweizer Betreuung."}
              </p>

              {/* Key Highlights of this exact plan from DB */}
              <div className="pt-2">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
                  Wichtigste Spezifikationen dieses Tarifs:
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {(currentProduct.features || []).slice(0, 4).map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 p-3.5 rounded-xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 transition-colors"
                    >
                      <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                        <Check className="w-4 h-4 stroke-[2.5]" />
                      </div>
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        {feat}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verified Trust Strip */}
              <div className="pt-4 border-t border-slate-200/70 grid grid-cols-2 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-600">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>100% Schweiz (Zürich)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-indigo-600 shrink-0" />
                  <span>Kostenloses SSL inklusive</span>
                </div>
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                  <span>NVMe SSD Speicher</span>
                </div>
              </div>

              {/* Secondary Navigation Action */}
              <div className="pt-2">
                <Link
                  to="/hosting"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-[#102452] transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Zurück zur gesamten Webhosting-Übersicht</span>
                </Link>
              </div>
            </div>

            {/* Right Column: Premium High-End Pricing & Order Box */}
            <div className="lg:col-span-5">
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden">
                <div className="flex items-center justify-between pb-5 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                      Tarifkonditionen
                    </span>
                    <span className="text-base font-bold text-[#102452]">
                      {currentProduct.name}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sofort aktivierbar
                  </span>
                </div>

                {/* Billing Cycle Switch */}
                <div className="my-5 p-1 bg-slate-100 rounded-xl flex items-center gap-1 text-xs">
                  <button
                    type="button"
                    onClick={() => setBillingCycle("monthly")}
                    className={`flex-1 py-2 font-bold rounded-lg transition-all ${
                      billingCycle === "monthly"
                        ? "bg-white text-[#102452] shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    Monatlich
                  </button>
                  <button
                    type="button"
                    onClick={() => setBillingCycle("yearly")}
                    className={`flex-1 py-2 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                      billingCycle === "yearly"
                        ? "bg-[#102452] text-white shadow-xs"
                        : "text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <span>Jährlich</span>
                    <span className="px-1.5 py-0.2 rounded text-[10px] font-extrabold bg-[#E63946] text-white">
                      -10% Rabatt
                    </span>
                  </button>
                </div>

                {/* Price Presentation */}
                <div className="py-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-base font-bold text-slate-500">CHF</span>
                    <span className="text-5xl sm:text-6xl font-black text-[#102452] tracking-tight">
                      {activeMonthlyPrice}
                    </span>
                    <span className="text-sm font-medium text-slate-500">/ Monat</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    {billingCycle === "yearly"
                      ? `CHF ${totalBilled} jährlich verrechnet. Keine Einrichtungsgebühr.`
                      : "Monatlich kündbar. Keine Mindestvertragslaufzeit."}
                  </p>
                </div>

                {/* Primary CTA Button */}
                <div className="mt-6 space-y-3">
                  <button
                    type="button"
                    onClick={handleStartOrder}
                    className="w-full py-4 px-6 rounded-xl bg-[#E63946] hover:bg-[#d02e3b] text-white font-bold text-base shadow-lg shadow-red-500/20 hover:shadow-red-500/30 flex items-center justify-center gap-2.5 transition-all cursor-pointer transform hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <span>Jetzt bestellen</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>

                  <div className="pt-2 flex items-center justify-center gap-4 text-[11px] text-slate-400 font-medium">
                    <span>✓ Keine Einrichtungsgebühr</span>
                    <span>✓ Schweizer Vertragspartner</span>
                  </div>
                </div>

                {/* Included Features List */}
                <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
                    Im Tarif enthalten:
                  </span>
                  {(currentProduct.features || []).slice(0, 6).map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs text-slate-600">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="font-medium">{feat}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TARGET AUDIENCE SECTION */}
        {currentProduct.targetAudience && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center gap-6">
              <div className="w-12 h-12 rounded-2xl bg-red-50 text-[#E63946] flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-[#E63946] uppercase tracking-wider">
                  Für wen ist dieser Tarif geeignet?
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-[#102452]">
                  Optimale Passgenauigkeit für Ihr Vorhaben
                </h3>
                <p className="text-sm text-slate-600 font-medium">
                  {currentProduct.targetAudience}
                </p>
              </div>
            </div>
          </section>
        )}

        {/* SECTION: WAS IST ENTHALTEN? */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold text-[#E63946] uppercase tracking-wider block mb-1.5">
              Leistungsumfang
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#102452] tracking-tight">
              Alles, was Sie für Ihren professionellen Webauftritt benötigen.
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Jedes Leistungsmerkmal ist auf Schweizer Qualitätsstandards und maximale Verlässlichkeit ausgelegt.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureCards.map((card, idx) => {
              const CardIcon = card.icon;
              return (
                <div
                  key={idx}
                  className="p-6 rounded-2xl bg-white border border-slate-200/90 shadow-xs hover:border-slate-300 hover:shadow-md transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-[#102452]">
                        <CardIcon className="w-5 h-5 text-[#E63946]" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                        {card.tag}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-[#102452] mb-1.5">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-500 leading-relaxed font-medium">
                      {card.explanation}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* SECTION: TECHNISCHE DETAILS IN KATEGORIEN */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm">
            <div className="max-w-3xl mb-10">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E63946] mb-1.5">
                <Sliders className="w-4 h-4" />
                Technische Ausstattung
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#102452]">
                Detaillierte Spezifikationen im Überblick
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Transparente Leistungsdaten direkt aus der Infrastruktur-Konfiguration.
              </p>
            </div>

            {/* Categorized Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categorizedSpecs.map((cat, idx) => {
                const CatIcon = cat.icon;
                return (
                  <div
                    key={idx}
                    className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-slate-300 transition-colors flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2.5 pb-3 border-b border-slate-200/80 mb-4">
                        <CatIcon className="w-4 h-4 text-[#E63946]" />
                        <h3 className="text-xs font-black text-[#102452] uppercase tracking-wider">
                          {cat.title}
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {cat.items.map((item, sidx) => (
                          <div key={sidx} className="flex justify-between items-start text-xs gap-3">
                            <span className="font-semibold text-slate-600">
                              {item.key}
                            </span>
                            <span className="font-bold text-[#102452] text-right">
                              {item.value}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* SECTION: WARUM REDWORK? */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs font-bold text-[#E63946] uppercase tracking-wider">
              Schweizer IT-Infrastruktur
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#102452] mt-1">
              Warum RedWORK Hosting?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#102452] flex items-center justify-center mb-4">
                <Building2 className="w-5 h-5 text-[#E63946]" />
              </div>
              <h3 className="text-base font-bold text-[#102452] mb-1">
                Standort Schweiz
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hosting auf modernen Servern in der Schweiz unter strengem Schweizer Datenschutzgesetz (DSG).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#102452] flex items-center justify-center mb-4">
                <Zap className="w-5 h-5 text-[#E63946]" />
              </div>
              <h3 className="text-base font-bold text-[#102452] mb-1">
                NVMe Solid-State-Performance
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Moderne Speichertechnologie und dedizierte Ressourcen für schnelle Antwortzeiten.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#102452] flex items-center justify-center mb-4">
                <Sliders className="w-5 h-5 text-[#E63946]" />
              </div>
              <h3 className="text-base font-bold text-[#102452] mb-1">
                Etabliertes cPanel Control Center
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Intuitive Verwaltung für Domains, E-Mail-Postfächer, Datenbanken und 1-Klick-App-Installationen.
              </p>
            </div>
          </div>
        </section>

        {/* SECTION: TARIFVERGLEICH */}
        {hostingPlans.length > 1 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="text-center max-w-3xl mx-auto mb-10">
              <span className="text-xs font-bold text-[#E63946] uppercase tracking-wider">
                Transparente Auswahl
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#102452] mt-1">
                Tarifvergleich
              </h2>
              <p className="text-sm text-slate-600 mt-2">
                Vergleichen Sie den Tarif <strong className="text-[#102452]">{currentProduct.name}</strong> mit unseren weiteren aktiven Tarifen.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
              {hostingPlans.map((plan) => {
                const isCurrent = plan.id === currentProduct.id;
                const planSlug = plan.slug || slugify(plan.name);
                const planCategory = plan.menuSubcategory || "webhosting";
                const planPrice = (Number(plan.unitPrice) || 0).toFixed(2);

                return (
                  <div
                    key={plan.id}
                    className={`rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                      isCurrent
                        ? "bg-white border-2 border-[#E63946] shadow-xl shadow-red-500/10 relative scale-102 z-10"
                        : "bg-white/90 border border-slate-200 hover:border-slate-300 shadow-sm"
                    }`}
                  >
                    <div>
                      {isCurrent && (
                        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-[#E63946] text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
                          Aktuell ausgewählt
                        </div>
                      )}

                      <div className="text-lg font-black text-[#102452] mt-2">
                        {plan.name}
                      </div>
                      <p className="text-xs text-slate-500 mt-1 min-h-[32px] line-clamp-2">
                        {plan.description || "Zuverlässiges Schweizer Webhosting für professionelle Anforderungen."}
                      </p>

                      <div className="mt-4 flex items-baseline gap-1">
                        <span className="text-xs font-bold text-slate-500">CHF</span>
                        <span className="text-3xl font-black text-[#102452]">
                          {planPrice}
                        </span>
                        <span className="text-xs text-slate-500">/ Monat</span>
                      </div>

                      <div className="mt-6 pt-6 border-t border-slate-100 space-y-2.5">
                        {(plan.features || []).slice(0, 6).map((feat, fidx) => (
                          <div key={fidx} className="flex items-start gap-2 text-xs text-slate-600">
                            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="mt-8 pt-4">
                      {isCurrent ? (
                        <button
                          type="button"
                          onClick={handleStartOrder}
                          className="w-full py-3 px-4 rounded-xl bg-[#E63946] hover:bg-[#d02e3b] text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all cursor-pointer"
                        >
                          <span>Diesen Tarif wählen</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      ) : (
                        <Link
                          to={`/hosting/${planCategory}/${planSlug}`}
                          className="w-full py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-[#102452] font-bold text-sm flex items-center justify-center gap-2 transition-all"
                        >
                          <span>Tarif ansehen</span>
                          <ChevronRight className="w-4 h-4" />
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>

      {/* STICKY BOTTOM BAR FOR MOBILE SCREENS WITH SAFE AREA PADDING */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-4 py-3 pb-safe shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {currentProduct.name}
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-xs font-bold text-slate-500">CHF</span>
            <span className="text-xl font-black text-[#102452]">
              {activeMonthlyPrice}
            </span>
            <span className="text-[10px] text-slate-500">/ Mt.</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleStartOrder}
          className="py-2.5 px-6 rounded-xl bg-[#E63946] text-white font-bold text-sm shadow-md flex items-center gap-2 cursor-pointer"
        >
          <span>Bestellen</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* MULTI-STEP LUXURY CHECKOUT MODAL */}
      {showCheckoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden my-8 relative">
            {/* Modal Header */}
            <div className="bg-[#102452] px-6 py-5 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#E63946]">
                  Hosting Konfiguration & Bestellung
                </span>
                <h3 className="text-xl font-black text-white mt-0.5">
                  {currentProduct.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCheckoutModal(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Progress Stepper with 5 distinct steps */}
            {checkoutStep < 5 && (
              <div className="px-6 py-3 bg-slate-50 border-b border-slate-200 flex items-center justify-between text-xs font-bold text-slate-500">
                <div className={`flex items-center gap-1.5 ${checkoutStep >= 1 ? "text-[#E63946]" : ""}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${checkoutStep >= 1 ? "bg-[#E63946] text-white" : "bg-slate-200 text-slate-600"}`}>1</span>
                  <span className="hidden sm:inline">Abrechnung</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className={`flex items-center gap-1.5 ${checkoutStep >= 2 ? "text-[#E63946]" : ""}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${checkoutStep >= 2 ? "bg-[#E63946] text-white" : "bg-slate-200 text-slate-600"}`}>2</span>
                  <span className="hidden sm:inline">Domain</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className={`flex items-center gap-1.5 ${checkoutStep >= 3 ? "text-[#E63946]" : ""}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${checkoutStep >= 3 ? "bg-[#E63946] text-white" : "bg-slate-200 text-slate-600"}`}>3</span>
                  <span className="hidden sm:inline">Zahlung</span>
                </div>
                <ChevronRight className="w-4 h-4 text-slate-300" />
                <div className={`flex items-center gap-1.5 ${checkoutStep >= 4 ? "text-[#E63946]" : ""}`}>
                  <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${checkoutStep >= 4 ? "bg-[#E63946] text-white" : "bg-slate-200 text-slate-600"}`}>4</span>
                  <span className="hidden sm:inline">Übersicht</span>
                </div>
              </div>
            )}

            {/* Error Message */}
            {orderError && (
              <div className="m-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{orderError}</span>
              </div>
            )}

            {/* Modal Body: Dynamic Step Content */}
            <div className="p-6 sm:p-8">
              {/* STEP 1: Abrechnungsintervall */}
              {checkoutStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-[#102452]">Abrechnungszeitraum wählen</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Wählen Sie Ihr gewünschtes Abrechnungsintervall für maximale Flexibilität oder Ersparnis.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div
                      onClick={() => setBillingCycle("yearly")}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all relative ${
                        billingCycle === "yearly"
                          ? "border-[#E63946] bg-red-50/20 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#E63946] text-white uppercase">
                        -10% Rabatt
                      </div>
                      <div className="text-sm font-bold text-[#102452]">Jährliche Zahlung</div>
                      <div className="mt-2 text-2xl font-black text-[#102452]">
                        CHF {yearlyMonthlyPrice} <span className="text-xs font-normal text-slate-500">/ Monat</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        CHF {(Number(yearlyMonthlyPrice) * 12).toFixed(2)} jährlich fakturiert
                      </p>
                    </div>

                    <div
                      onClick={() => setBillingCycle("monthly")}
                      className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                        billingCycle === "monthly"
                          ? "border-[#E63946] bg-red-50/20 shadow-sm"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                    >
                      <div className="text-sm font-bold text-[#102452]">Monatliche Zahlung</div>
                      <div className="mt-2 text-2xl font-black text-[#102452]">
                        CHF {baseMonthlyPrice.toFixed(2)} <span className="text-xs font-normal text-slate-500">/ Monat</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-1">
                        Monatlich flexibel kündbar
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-[#E63946] hover:bg-[#d02e3b] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
                    >
                      <span>Weiter zu Domain</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2: Domain Option */}
              {checkoutStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-[#102452]">Domain konfigurieren</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Möchten Sie eine neue Domain registrieren, eine bestehende Domain nutzen oder dies später einrichten?
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      domainChoice === "later" ? "border-[#E63946] bg-red-50/20" : "border-slate-200 hover:border-slate-300"
                    }`}>
                      <input
                        type="radio"
                        name="domainChoice"
                        checked={domainChoice === "later"}
                        onChange={() => setDomainChoice("later")}
                        className="text-[#E63946] focus:ring-[#E63946]"
                      />
                      <div>
                        <div className="text-sm font-bold text-[#102452]">Domain später festlegen / eigene Nameserver nutzen</div>
                        <div className="text-xs text-slate-500">Sie erhalten sofort Ihre Zugangsdaten und können Domains jederzeit im Kundenbereich verbinden.</div>
                      </div>
                    </label>

                    <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      domainChoice === "new" ? "border-[#E63946] bg-red-50/20" : "border-slate-200 hover:border-slate-300"
                    }`}>
                      <input
                        type="radio"
                        name="domainChoice"
                        checked={domainChoice === "new"}
                        onChange={() => setDomainChoice("new")}
                        className="text-[#E63946] focus:ring-[#E63946]"
                      />
                      <div>
                        <div className="text-sm font-bold text-[#102452]">Neue Domain registrieren (.ch, .com, .de etc.)</div>
                        <div className="text-xs text-slate-500">Wir registrieren Ihre Wunschdomain direkt für Sie.</div>
                      </div>
                    </label>

                    <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      domainChoice === "transfer" ? "border-[#E63946] bg-red-50/20" : "border-slate-200 hover:border-slate-300"
                    }`}>
                      <input
                        type="radio"
                        name="domainChoice"
                        checked={domainChoice === "transfer"}
                        onChange={() => setDomainChoice("transfer")}
                        className="text-[#E63946] focus:ring-[#E63946]"
                      />
                      <div>
                        <div className="text-sm font-bold text-[#102452]">Bestehende Domain zu RedWORK umziehen</div>
                        <div className="text-xs text-slate-500">Transferieren Sie Ihre Domain via Auth-Code zu unserem Schweizer DNS-Cluster.</div>
                      </div>
                    </label>
                  </div>

                  {domainChoice !== "later" && (
                    <div className="pt-2">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                        Domainname eingeben
                      </label>
                      <input
                        type="text"
                        placeholder="meine-wunschdomain.ch"
                        value={domainName}
                        onChange={(e) => setDomainName(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[#E63946]"
                      />
                    </div>
                  )}

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(1)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 cursor-pointer"
                    >
                      Zurück
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(3)}
                      className="px-6 py-2.5 rounded-xl bg-[#E63946] hover:bg-[#d02e3b] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
                    >
                      <span>Weiter zur Zahlung</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 3: Zahlungsmethode */}
              {checkoutStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-[#102452]">Zahlungsart wählen</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Sichere Schweizer Zahlungsmöglichkeiten mit 30 Tagen Zahlungsziel bei QR-Rechnung.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === "invoice" ? "border-[#E63946] bg-red-50/20" : "border-slate-200 hover:border-slate-300"
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "invoice"}
                        onChange={() => setPaymentMethod("invoice")}
                        className="text-[#E63946] focus:ring-[#E63946]"
                      />
                      <FileText className="w-5 h-5 text-[#102452]" />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-[#102452]">Schweizer QR-Rechnung (E-Mail / PDF)</div>
                        <div className="text-xs text-slate-500">Zahlbar innert 30 Tagen via E-Banking. Sofortige Aktivierung Ihres Tarifs.</div>
                      </div>
                    </label>

                    <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === "credit_card" ? "border-[#E63946] bg-red-50/20" : "border-slate-200 hover:border-slate-300"
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "credit_card"}
                        onChange={() => setPaymentMethod("credit_card")}
                        className="text-[#E63946] focus:ring-[#E63946]"
                      />
                      <CreditCard className="w-5 h-5 text-[#102452]" />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-[#102452]">Kreditkarte / Debitkarte (Visa / Mastercard)</div>
                        <div className="text-xs text-slate-500">Sichere Abwicklung via Schweizer Payment Gateway.</div>
                      </div>
                    </label>

                    <label className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                      paymentMethod === "twint" ? "border-[#E63946] bg-red-50/20" : "border-slate-200 hover:border-slate-300"
                    }`}>
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "twint"}
                        onChange={() => setPaymentMethod("twint")}
                        className="text-[#E63946] focus:ring-[#E63946]"
                      />
                      <DollarSign className="w-5 h-5 text-[#102452]" />
                      <div className="flex-1">
                        <div className="text-sm font-bold text-[#102452]">TWINT</div>
                        <div className="text-xs text-slate-500">Bequem und schnell mit der Schweizer TWINT App bezahlen.</div>
                      </div>
                    </label>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(2)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 cursor-pointer"
                    >
                      Zurück
                    </button>
                    <button
                      type="button"
                      onClick={() => setCheckoutStep(4)}
                      className="px-6 py-2.5 rounded-xl bg-[#E63946] hover:bg-[#d02e3b] text-white font-bold text-sm flex items-center gap-2 cursor-pointer"
                    >
                      <span>Bestellübersicht prüfen</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 4: Bestellübersicht & Bestätigen */}
              {checkoutStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h4 className="text-base font-bold text-[#102452]">Bestellung überprüfen</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Bitte überprüfen Sie Ihre Bestelldetails vor dem Absenden.
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-5 border border-slate-200/80 space-y-3 text-xs">
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="font-medium text-slate-500">Tarif:</span>
                      <span className="font-bold text-[#102452]">{currentProduct.name}</span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="font-medium text-slate-500">Abrechnungszyklus:</span>
                      <span className="font-bold text-[#102452]">
                        {billingCycle === "yearly" ? "Jährlich (-10% Rabatt)" : "Monatlich"}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="font-medium text-slate-500">Domain-Option:</span>
                      <span className="font-bold text-[#102452]">
                        {domainChoice === "later"
                          ? "Später einrichten"
                          : domainChoice === "new"
                          ? `Neue Domain: ${domainName || "Nicht angegeben"}`
                          : `Transfer: ${domainName || "Nicht angegeben"}`}
                      </span>
                    </div>
                    <div className="flex justify-between pb-2 border-b border-slate-200">
                      <span className="font-medium text-slate-500">Zahlungsmethode:</span>
                      <span className="font-bold text-[#102452]">
                        {paymentMethod === "invoice"
                          ? "QR-Rechnung (30 Tage Zahlungsziel)"
                          : paymentMethod === "credit_card"
                          ? "Kreditkarte"
                          : "TWINT"}
                      </span>
                    </div>
                    <div className="flex justify-between pt-1 text-sm font-bold text-[#102452]">
                      <span>Gesamtbetrag:</span>
                      <span className="text-[#E63946] text-base">CHF {totalBilled}</span>
                    </div>
                  </div>

                  <div className="text-[11px] text-slate-500 space-y-1">
                    <p>
                      Mit Klick auf "Kostenpflichtig bestellen" bestätigen Sie die Bestellung gemäss den AGB und Datenschutzbestimmungen der RedWORK.
                    </p>
                  </div>

                  <div className="flex justify-between pt-4 border-t border-slate-100">
                    <button
                      type="button"
                      disabled={orderSubmitting}
                      onClick={() => setCheckoutStep(3)}
                      className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold text-sm hover:bg-slate-50 cursor-pointer disabled:opacity-50"
                    >
                      Zurück
                    </button>
                    <button
                      type="button"
                      disabled={orderSubmitting}
                      onClick={handleCompleteOrder}
                      className="px-8 py-3 rounded-xl bg-[#E63946] hover:bg-[#d02e3b] text-white font-bold text-sm shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      {orderSubmitting ? (
                        <>
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          <span>Bestellung wird ausgeführt...</span>
                        </>
                      ) : (
                        <>
                          <span>Kostenpflichtig bestellen</span>
                          <Check className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 5: Erfolgreich abgeschlossen */}
              {checkoutStep === 5 && (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-black text-[#102452]">
                    Vielen Dank für Ihre Bestellung!
                  </h4>
                  <p className="text-sm text-slate-600 max-w-md mx-auto">
                    Ihr Hosting-Tarif <strong className="text-[#102452]">{currentProduct.name}</strong> wurde erfolgreich angelegt.
                    {orderSuccessData?.reference && (
                      <span className="block mt-1 font-semibold text-slate-700">
                        Bestellreferenz: {orderSuccessData.reference}
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Die Bestätigung sowie Ihre Zugangsdaten wurden an Ihre hinterlegte E-Mail-Adresse versandt.
                  </p>

                  <div className="pt-6 flex flex-col sm:flex-row justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard?tab=services")}
                      className="px-6 py-3 rounded-xl bg-[#102452] hover:bg-[#0c1c40] text-white font-bold text-sm shadow-md transition-all cursor-pointer"
                    >
                      Zum Kunden-Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCheckoutModal(false)}
                      className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50 cursor-pointer"
                    >
                      Schliessen
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <Footer />
      <ContactModal />
    </div>
  );
}
