import React, { useState, useEffect } from "react";
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
  ChevronDown
} from "lucide-react";
import api from "../api";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ContactModal from "../components/ContactModal";
import { useAuth } from "../contexts/AuthContext";
import { useModals } from "../contexts/ModalContext";

export default function CategoryPage() {
  const { categorySlug } = useParams();
  const slug = (categorySlug || "webhosting").toLowerCase();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { openQuote } = useModals();

  const [categoryData, setCategoryData] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [billingCycle, setBillingCycle] = useState("monthly"); // monthly | yearly
  const [activeFaq, setActiveFaq] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const loadCategory = async () => {
      try {
        const res = await api.get(`/categories/${slug}`);
        if (isMounted && res.data) {
          setCategoryData(res.data.category);
          setProducts(res.data.products || []);
          
          const catTitle = res.data.category?.seoTitle || `${res.data.category?.name || "Hosting"} - RedWORK Cloud Schweiz`;
          document.title = `${catTitle} | RedWORK.ch`;
        }
      } catch (err) {
        console.warn("Konnte Kategorie nicht laden, lade Fallback-Produkte:", err);
        try {
          const prodRes = await api.get("/products");
          if (isMounted) {
            const all = prodRes.data || [];
            const filtered = all.filter(p => 
              (p.name || "").toLowerCase().includes(slug) ||
              (p.description || "").toLowerCase().includes(slug) ||
              (p.menuSubcategory || "").toLowerCase() === slug
            );
            setProducts(filtered.length > 0 ? filtered : all.slice(0, 4));
          }
        } catch (e) {}
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadCategory();

    return () => {
      isMounted = false;
    };
  }, [slug]);

  const catName = categoryData?.name || slug.toUpperCase();
  const catDesc = categoryData?.description || "Hochleistungs-Infrastruktur mit garantierter Performance und 100% Schweizer Datenspeicherung.";

  const handleOrder = (product) => {
    if (!user) {
      sessionStorage.setItem("redwork_pending_product_id", product.id);
      navigate("/login");
      return;
    }
    navigate(`/dashboard/products/${product.id}`);
  };

  const calculatePrice = (basePrice) => {
    const num = Number(basePrice) || 0;
    if (billingCycle === "yearly") {
      // 10% discount for yearly, shown as monthly equivalent
      return (num * 0.9).toFixed(2);
    }
    return num.toFixed(2);
  };

  const getBadges = (product, idx) => {
    if (product.badge) return product.badge;
    if (idx === 0) return "BELIEBT";
    if (idx === 1) return "EMPFOHLEN";
    if (idx === 2) return "PREMIUM";
    return "";
  };

  const faqs = [
    {
      q: "Wo werden meine Daten gespeichert?",
      a: "Alle Server und Speicherressourcen befinden sich in zertifizierten Tier-IV-Datacentern in Zürich, Schweiz. Wir garantieren 100%ige Einhaltung des Schweizer Datenschutzgesetzes (DSG) sowie der europäischen DSGVO."
    },
    {
      q: "Wie schnell erfolgt die Bereitstellung nach der Bestellung?",
      a: "Nach erfolgreicher Autorisierung wird Ihr Webhosting- bzw. Cloud-Paket innerhalb weniger Minuten vollautomatisch bereitgestellt und Sie erhalten direkten Zugriff auf Ihr cPanel / WHM Control Center."
    },
    {
      q: "Kann ich mein Paket jederzeit upgraden?",
      a: "Ja, Sie können in Ihrem RedWORK Dashboard mit wenigen Klicks auf ein höheres Paket wechseln. Alle bestehenden Daten, Datenbanken und E-Mail-Postfächer bleiben dabei nahtlos erhalten."
    },
    {
      q: "Sind automatische Backups und SSL-Zertifikate inbegriffen?",
      a: "Ja, alle Hosting-Tarife beinhalten kostenlose Let's Encrypt SSL-Zertifikate mit automatischer Erneuerung sowie tägliche externe Sicherheits-Backups."
    }
  ];

  return (
    <div className="min-h-screen bg-[#07090F] text-white flex flex-col selection:bg-[#E63946] selection:text-white">
      <Header scrolled={true} />

      <main className="flex-1 pt-28 pb-20">
        {/* Breadcrumb Navigation */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-8">
          <nav className="flex items-center gap-2 text-xs font-semibold text-slate-400">
            <Link to="/" className="hover:text-white transition">Start</Link>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-slate-300">Hosting Cloud</span>
            <ChevronRight className="h-3.5 w-3.5 text-slate-600" />
            <span className="text-[#D4AF37] font-bold">{catName}</span>
          </nav>
        </div>

        {/* Hero Section */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-16 text-center sm:text-left">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-8 border-b border-white/10">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-[#D4AF37] mb-4">
                <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                <span>100% NVMe SSD • Rechenzentrum Zürich (CH)</span>
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
                {catName}
              </h1>
              <p className="mt-4 text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {catDesc}
              </p>
            </div>

            {/* Billing Cycle Switcher */}
            <div className="flex flex-col items-center sm:items-end gap-2 shrink-0">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Abrechnungsintervall</span>
              <div className="inline-flex items-center rounded-2xl bg-white/5 p-1.5 border border-white/10 shadow-inner">
                <button
                  onClick={() => setBillingCycle("monthly")}
                  className={`rounded-xl px-4 py-2 text-xs font-black transition ${
                    billingCycle === "monthly"
                      ? "bg-gradient-to-r from-[#FF7A00] to-[#E63946] text-white shadow-md"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  Monatlich
                </button>
                <button
                  onClick={() => setBillingCycle("yearly")}
                  className={`rounded-xl px-4 py-2 text-xs font-black transition flex items-center gap-1.5 ${
                    billingCycle === "yearly"
                      ? "bg-gradient-to-r from-[#FF7A00] to-[#E63946] text-white shadow-md"
                      : "text-slate-300 hover:text-white"
                  }`}
                >
                  <span>Jährlich</span>
                  <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] text-emerald-400 border border-emerald-500/30">
                    -10%
                  </span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* Dynamic Products Grid */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 rounded-3xl bg-white/5 animate-pulse border border-white/10" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-12 text-center max-w-xl mx-auto">
              <Server className="h-12 w-12 text-[#D4AF37] mx-auto mb-4 opacity-70" />
              <h3 className="text-xl font-bold text-white mb-2">Massgeschneiderte Konfiguration verfügbar</h3>
              <p className="text-sm text-slate-400 mb-6">
                Für diese Kategorie erstellen wir gerne ein individuelles Schweizer Hosting- und Infrastrukturangebot.
              </p>
              <button
                onClick={openQuote}
                className="rounded-2xl bg-[#E63946] px-6 py-3 text-sm font-bold text-white hover:bg-[#d02f3c] transition shadow-lg"
              >
                Unverbindliches Angebot anfordern
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {products.map((product, idx) => {
                const badge = getBadges(product, idx);
                const isHighlight = idx === 1 || product.recommended || badge === "EMPFOHLEN";
                const features = Array.isArray(product.features) && product.features.length > 0
                  ? product.features
                  : (product.description || "").split("\n").filter(Boolean);

                return (
                  <div
                    key={product.id}
                    className={`relative flex flex-col justify-between rounded-[32px] p-7 sm:p-8 transition-all duration-300 hover:-translate-y-1.5 ${
                      isHighlight
                        ? "bg-gradient-to-b from-[#141B2D] via-[#0F1420] to-[#0A0D16] border-2 border-[#D4AF37]/50 shadow-[0_20px_50px_rgba(212,175,55,0.12)]"
                        : "bg-gradient-to-b from-[#0F1420] to-[#0A0D16] border border-white/10 shadow-xl"
                    }`}
                  >
                    {/* Top Badge */}
                    {badge && (
                      <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                        <span className="rounded-full bg-gradient-to-r from-[#D4AF37] to-[#FF7A00] px-3.5 py-1 text-[11px] font-black uppercase tracking-wider text-black shadow-md">
                          {badge}
                        </span>
                      </div>
                    )}

                    <div>
                      {/* Title & Short Description */}
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <h3 className="text-xl sm:text-2xl font-black text-white">{product.name}</h3>
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 text-[#D4AF37] border border-white/10">
                          <Server className="h-4 w-4" />
                        </div>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-400 min-h-[40px] leading-relaxed mb-6">
                        {product.shortDescription || product.description || "Zuverlässige Performance für Schweizer IT-Projekte."}
                      </p>

                      {/* Pricing Block */}
                      <div className="rounded-2xl bg-white/[0.04] p-5 border border-white/5 mb-6">
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xs font-bold text-slate-400">CHF</span>
                          <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                            {calculatePrice(product.unitPrice)}
                          </span>
                          <span className="text-xs font-semibold text-slate-400">/ Monat</span>
                        </div>
                        <p className="text-[11px] text-slate-500 mt-1">
                          {billingCycle === "yearly" ? "Jährliche Verrechnung (-10% Rabatt)" : "Monatlich kündbar, exkl. MwSt."}
                        </p>
                      </div>

                      {/* Features Checklist */}
                      <div className="space-y-3 mb-8">
                        <p className="text-xs font-black uppercase tracking-wider text-slate-400">Inklusive Leistungen</p>
                        {features.slice(0, 6).map((feat, fIdx) => (
                          <div key={fIdx} className="flex items-start gap-2.5 text-xs text-slate-300">
                            <CheckCircle2 className="h-4 w-4 text-[#D4AF37] shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action CTA */}
                    <div className="space-y-2 pt-4 border-t border-white/10">
                      <button
                        onClick={() => handleOrder(product)}
                        className={`w-full py-3.5 px-6 rounded-2xl font-black text-sm flex items-center justify-center gap-2 transition shadow-lg ${
                          isHighlight
                            ? "bg-gradient-to-r from-[#FF7A00] to-[#E63946] text-white hover:opacity-95 shadow-orange-500/20"
                            : "bg-white text-slate-900 hover:bg-slate-100"
                        }`}
                      >
                        <span>Jetzt bestellen</span>
                        <ArrowRight className="h-4 w-4" />
                      </button>
                      <Link
                        to={`/products/${product.id}`}
                        className="block w-full py-2 text-center text-xs font-bold text-slate-400 hover:text-white transition"
                      >
                        Produktdetails ansehen
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Infrastructure Highlights */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-24">
          <div className="rounded-[36px] bg-gradient-to-b from-white/[0.04] to-transparent p-8 sm:p-12 border border-white/10">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="text-xs font-black uppercase tracking-widest text-[#D4AF37]">Schweizer Premium-Standard</span>
              <h2 className="text-2xl sm:text-4xl font-black text-white mt-2">
                Sicherheit & Leistung ohne Kompromisse
              </h2>
              <p className="text-sm text-slate-400 mt-3">
                Modernste Serverhardware im Zürcher Rechenzentrum garantiert maximale Ausfallsicherheit.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-[#D4AF37]">
                  <Zap className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">NVMe SSD Performance</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Bis zu 10-mal schnellere Lese- und Schreibzeiten gegenüber herkömmlichen SATA-SSD-Hostings.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-emerald-400">
                  <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">DDoS & Firewall Schutz</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Mehrschichtige Schweizer Schutzschilde filtern böswilligen Datenverkehr bereits vor Erreichen Ihres Servers.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/5 border border-white/10 text-cyan-400">
                  <Lock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">AutoSSL & Backups</h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Vollautomatisierte SSL-Verschlüsselung und tägliche Wiederherstellungspunkte für absolute Datensicherheit.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Category FAQ Accordion */}
        <section className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl sm:text-3xl font-black text-white">Häufig gestellte Fragen zu {catName}</h2>
            <p className="text-xs text-slate-400 mt-2">Transparente Antworten für anspruchsvolle Kunden</p>
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
                  <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-white/5">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
      <ContactModal />
    </div>
  );
}
