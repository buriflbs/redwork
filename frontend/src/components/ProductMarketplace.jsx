import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../api";
import { useAuth } from "../contexts/AuthContext";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { Check, ChevronLeft, CreditCard, Globe2, Layers3, LifeBuoy, Mail, Package, Server, ShieldCheck, ShoppingCart, Sparkles } from "lucide-react";

const cycleLabels = { monthly: "Monatlich", yearly: "Jährlich", two_years: "2 Jahre" };
const cycleSuffix = { monthly: "/ Monat", yearly: "/ Jahr", two_years: "/ 2 Jahre" };
const categoryIcons = { hosting: Server, domains: Globe2, "e-mail": Mail, email: Mail, web: Layers3, software: Package, support: LifeBuoy };

const priceFor = (product, cycle) => {
  const base = Number(product.unitPrice || 0);
  if (cycle === "yearly") return base * 12 * 0.9;
  if (cycle === "two_years") return base * 24 * 0.85;
  return base;
};

const normalize = (value = "") => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const matchesCategory = (product, key) => {
  if (key === "all") return true;
  const haystack = `${normalize(product.categoryName)} ${normalize(product.name)} ${normalize(product.description)}`;
  if (key === "web-hosting") return haystack.includes("web-hosting") || (haystack.includes("hosting") && !haystack.includes("reseller"));
  if (key === "reseller-hosting") return haystack.includes("reseller");
  if (key === "premium-vds-vps") return haystack.includes("vds") || haystack.includes("vps") || haystack.includes("server");
  if (key === "kiralik-sunucular") return haystack.includes("dedicated") || haystack.includes("server") || haystack.includes("kiralik");
  return normalize(product.categoryName) === key || haystack.includes(key);
};

const featureList = (product) => {
  if (Array.isArray(product.features) && product.features.length) return product.features;
  return (product.description || "").split(/\n|,/).map((item) => item.trim()).filter(Boolean).slice(0, 6);
};

export default function ProductMarketplace({ embedded = false }) {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedCycles, setSelectedCycles] = useState({});
  const [domainChoices, setDomainChoices] = useState({});
  const [loading, setLoading] = useState(true);
  const [ordering, setOrdering] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    document.title = "REDWORK - Digitale Services, Hosting & Weblösungen";
    const canonical = document.querySelector("link[rel='canonical']") || document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = "https://www.redwork.ch/products";
    document.head.appendChild(canonical);
  }, []);

  useEffect(() => {
    const category = new URLSearchParams(location.search).get("category");
    if (category) setActiveCategory(category);
  }, [location.search]);

  useEffect(() => {
    const load = async () => {
      try {
        const [productRes, categoryRes] = await Promise.all([api.get("/products"), api.get("/product-categories")]);
        setProducts(productRes.data || []);
        setCategories(categoryRes.data || []);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const categoryMap = useMemo(() => Object.fromEntries(categories.map((cat) => [cat.id, cat])), [categories]);
  const enriched = useMemo(() => products.map((product) => ({
    ...product,
    categoryName: product.categoryName || categoryMap[product.categoryId]?.name || "Services",
  })), [products, categoryMap]);
  const selectedProduct = productId ? enriched.find((product) => product.id === productId) : null;
  const visibleProducts = enriched.filter((product) => matchesCategory(product, activeCategory));
  const marketplaceCategories = useMemo(() => {
    const names = Array.from(new Set(enriched.map((product) => product.categoryName).filter(Boolean)));
    return names.map((name) => ({ name, key: normalize(name), count: enriched.filter((product) => product.categoryName === name).length }));
  }, [enriched]);
  const hostingProducts = enriched.filter((product) => normalize(product.categoryName).includes("hosting") || normalize(product.name).includes("hosting")).slice(0, 4);

  const handleSelectProduct = (product) => {
    // Navigate to configuration route for selected product with billing cycle preserved
    const targetUrl = embedded
      ? `/dashboard/products/${product.id}`
      : `/products/${product.id}`;
    navigate(targetUrl);
  };

  const orderProduct = async (product) => {
    if (!user) {
      sessionStorage.setItem("redwork_pending_product_id", product.id);
      navigate("/login");
      return;
    }
    const duration = selectedCycles[product.id] || product.billingCycles?.[0] || "monthly";
    setOrdering(product.id);
    setMessage("");
    try {
      const res = await api.post("/orders", {
        productId: product.id,
        duration,
        quantity: 1,
        domainChoice: domainChoices[product.id] || "later",
      });
      setMessage(`Bestellung erfolgreich erstellt: ${res.data.reference || res.data.id}`);
      setTimeout(() => {
        navigate("/dashboard?tab=services");
      }, 1200);
    } catch (err) {
      setMessage(err.response?.data?.detail || "Bestellung konnte nicht erstellt werden. Bitte versuchen Sie es erneut.");
    } finally {
      setOrdering("");
    }
  };

  if (loading) return <div className="flex min-h-[60vh] items-center justify-center text-slate-600">Produkte werden geladen...</div>;

  if (selectedProduct) {
    const cycle = selectedCycles[selectedProduct.id] || selectedProduct.billingCycles?.[0] || "monthly";
    const features = featureList(selectedProduct);
    return (
      <div className={embedded ? "" : "min-h-screen bg-slate-100"}>
        <div className={embedded ? "" : "mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8"}>
          <button onClick={() => navigate(embedded ? "/dashboard/products" : "/products")} className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-red-600">
            <ChevronLeft className="h-4 w-4" /> Zurück zur Übersicht
          </button>
          <section className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-lg bg-slate-950 p-6 text-white">
              {(selectedProduct.recommended || selectedProduct.popular || selectedProduct.badge) && <Badge className="mb-4 bg-red-600">{selectedProduct.badge || (selectedProduct.recommended ? "Empfohlen" : "Beliebt")}</Badge>}
              <h1 className="text-3xl font-bold">{selectedProduct.name}</h1>
              <p className="mt-4 max-w-2xl text-slate-300">{selectedProduct.shortDescription || selectedProduct.description}</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {features.map((feature) => <div key={feature} className="flex items-center gap-2 text-sm"><Check className="h-4 w-4 text-emerald-300" /> {feature}</div>)}
              </div>
            </div>
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <p className="text-sm font-semibold text-slate-500">Ihre Auswahl</p>
              <p className="mt-3 text-4xl font-bold text-slate-950">CHF {priceFor(selectedProduct, cycle).toFixed(2)}<span className="text-sm font-medium text-slate-500"> {cycleSuffix[cycle]}</span></p>
              <div className="mt-5 grid gap-2">
                {(selectedProduct.billingCycles || ["monthly", "yearly"]).map((option) => (
                  <button key={option} onClick={() => setSelectedCycles({ ...selectedCycles, [selectedProduct.id]: option })} className={`rounded-lg border px-4 py-3 text-left text-sm font-semibold ${cycle === option ? "border-red-600 bg-red-50 text-red-700" : "border-slate-200"}`}>
                    {cycleLabels[option] || option}
                  </button>
                ))}
              </div>
              <div className="mt-5 space-y-2">
                <p className="text-sm font-semibold">Ihre Domain</p>
                {[
                  ["existing", "Ich habe bereits eine Domain"],
                  ["new", "Ich möchte eine neue Domain"],
                  ["later", "Domain später festlegen"],
                ].map(([value, label]) => (
                  <button key={value} onClick={() => setDomainChoices({ ...domainChoices, [selectedProduct.id]: value })} className={`w-full rounded-lg border px-4 py-3 text-left text-sm ${domainChoices[selectedProduct.id] === value ? "border-red-600 bg-red-50" : "border-slate-200"}`}>{label}</button>
                ))}
              </div>
              <div className="mt-5 rounded-lg bg-slate-50 p-4 text-sm">
                <div className="flex justify-between"><span>Zwischensumme</span><strong>CHF {priceFor(selectedProduct, cycle).toFixed(2)}</strong></div>
                <div className="mt-2 flex justify-between"><span>MWST</span><strong>wird im Backend berechnet</strong></div>
              </div>
              <Button onClick={() => orderProduct(selectedProduct)} disabled={ordering === selectedProduct.id || selectedProduct.status === "inactive"} className="mt-5 w-full">
                <CreditCard className="mr-2 h-4 w-4" /> Zahlungspflichtig bestellen
              </Button>
            </div>
          </section>
        </div>
      </div>
    );
  }

  return (
    <div className={embedded ? "" : "min-h-screen bg-slate-100"}>
      <div className={embedded ? "space-y-6" : "mx-auto max-w-7xl space-y-8 px-4 py-10 sm:px-6 lg:px-8"}>
        <section className="rounded-lg bg-slate-950 p-6 text-white sm:p-8">
          <Badge className="mb-4 bg-red-600">REDWORK Digital Services</Badge>
          <h1 className="max-w-4xl text-3xl font-bold sm:text-5xl">Digitale Lösungen für Ihr Business</h1>
          <p className="mt-4 max-w-3xl text-slate-300">Websites, Hosting, Domains, Software und digitale Services, zentral verwaltet über REDWORK.</p>
        </section>

        {message && <div className="rounded-lg border border-slate-200 bg-white p-4 text-sm font-semibold text-slate-700">{message}</div>}

        <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
          <button onClick={() => setActiveCategory("all")} className={`rounded-lg border p-4 text-left ${activeCategory === "all" ? "border-red-600 bg-red-50" : "border-slate-200 bg-white"}`}>
            <Sparkles className="mb-3 h-5 w-5 text-red-600" /><strong>Alle</strong><p className="text-sm text-slate-500">{enriched.length} Produkte</p>
          </button>
          {marketplaceCategories.map((cat) => {
            const Icon = categoryIcons[cat.key] || Package;
            return (
              <button key={cat.key} onClick={() => setActiveCategory(cat.key)} className={`rounded-lg border p-4 text-left ${activeCategory === cat.key ? "border-red-600 bg-red-50" : "border-slate-200 bg-white"}`}>
                <Icon className="mb-3 h-5 w-5 text-red-600" /><strong>{cat.name}</strong><p className="text-sm text-slate-500">{cat.count} Angebote</p>
              </button>
            );
          })}
        </section>

        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {visibleProducts.length === 0 ? (
            <div className="rounded-lg border border-dashed bg-white p-8 text-slate-500 md:col-span-2 xl:col-span-3">Keine aktiven Produkte in dieser Kategorie.</div>
          ) : visibleProducts.map((product) => {
            const cycle = selectedCycles[product.id] || product.billingCycles?.[0] || "monthly";
            const features = featureList(product).slice(0, 5);
            return (
              <article key={product.id} className="relative rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:shadow-lg">
                {(product.recommended || product.popular || product.badge) && <Badge className="absolute right-4 top-4 bg-red-600">{product.badge || (product.recommended ? "Empfohlen" : "Beliebt")}</Badge>}
                <p className="text-xs font-semibold uppercase text-slate-500">{product.categoryName}</p>
                <h2 className="mt-2 pr-24 text-xl font-bold">{product.name}</h2>
                <p className="mt-3 min-h-12 text-sm text-slate-500">{product.shortDescription || product.description}</p>
                <p className="mt-5 text-3xl font-bold">CHF {priceFor(product, cycle).toFixed(2)}<span className="text-sm font-medium text-slate-500"> {cycleSuffix[cycle]}</span></p>
                <div className="mt-4 flex gap-2">
                  {(product.billingCycles || ["monthly", "yearly"]).map((option) => (
                    <button key={option} onClick={() => setSelectedCycles({ ...selectedCycles, [product.id]: option })} className={`rounded-md border px-3 py-2 text-xs font-semibold ${cycle === option ? "border-red-600 bg-red-50 text-red-700" : "border-slate-200"}`}>{cycleLabels[option] || option}</button>
                  ))}
                </div>
                <div className="mt-5 space-y-2">
                  {features.map((feature) => <div key={feature} className="flex items-start gap-2 text-sm"><Check className="mt-0.5 h-4 w-4 text-emerald-600" /><span>{feature}</span></div>)}
                </div>
                <div className="mt-6 grid gap-2 sm:grid-cols-2">
                  <Link to={embedded ? `/dashboard/products/${product.id}` : `/products/${product.id}`}><Button variant="outline" className="w-full">Details</Button></Link>
                  <Button onClick={() => handleSelectProduct(product)} disabled={ordering === product.id || product.status === "inactive"} className="w-full bg-[#E63946] hover:bg-[#d02f3c] text-white"><ShoppingCart className="mr-2 h-4 w-4" /> Auswählen</Button>
                </div>
              </article>
            );
          })}
        </section>

        {hostingProducts.length > 1 && (
          <section className="rounded-lg border bg-white p-5 shadow-sm">
            <h2 className="text-xl font-bold">Vergleichen Sie unsere Pakete</h2>
            <div className="mt-5 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
              {hostingProducts.map((product) => (
                <div key={product.id} className="rounded-lg border p-4">
                  <p className="font-semibold">{product.name}</p>
                  <p className="mt-2 text-2xl font-bold">CHF {Number(product.unitPrice || 0).toFixed(2)}</p>
                  <div className="mt-3 space-y-2 text-sm text-slate-600">
                    {featureList(product).slice(0, 6).map((feature) => <p key={feature} className="flex gap-2"><Check className="h-4 w-4 text-emerald-600" /> {feature}</p>)}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
