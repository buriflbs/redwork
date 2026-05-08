import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import { ArrowRight, Sparkles, ShieldCheck, Check, Zap, Globe, Lock, Server } from "lucide-react";

const products = [
  {
    id: "webhosting",
    title: "Webhosting Paket",
    icon: Globe,
    priceMonthly: 4.90,
    priceYearly: 52.90,
    description: "Schnelles Shared Hosting mit SSL, Backups und cPanel.",
    features: ["25 GB NVMe SSD", "Unbegrenzte Domains", "Tägliche Backups", "24/7 Support", "Kostenlose SSL-Zertifikate", "MySQL & PHP 8.2"],
    popular: false,
  },
  {
    id: "vps",
    title: "VPS Basic",
    icon: Server,
    priceMonthly: 19.90,
    priceYearly: 199.90,
    description: "Flexibler VPS mit dedizierten Ressourcen und Root-Zugriff.",
    features: ["2 vCPU", "4 GB RAM", "80 GB NVMe SSD", "IPv4-Adresse", "Unbegrenzte Bandbreite", "KVM Virtualisierung"],
    popular: true,
  },
  {
    id: "vps-pro",
    title: "VPS Professional",
    icon: Zap,
    priceMonthly: 39.90,
    priceYearly: 399.90,
    description: "Hochleistungs-VPS für anspruchsvolle Anwendungen.",
    features: ["4 vCPU", "8 GB RAM", "160 GB NVMe SSD", "2x IPv4-Adressen", "Unbegrenzte Bandbreite", "DDoS-Protection"],
    popular: false,
  },
  {
    id: "dedicated",
    title: "Dedicated Server",
    icon: Server,
    priceMonthly: 69.90,
    priceYearly: 699.90,
    description: "Leistungsstarker dedizierter Server mit hoher Verfügbarkeit.",
    features: ["8 vCPU", "32 GB RAM", "500 GB NVMe SSD", "Premium Netz", "IP-Schutz", "Garantiert 99.9% Verfügbarkeit"],
    popular: false,
  },
  {
    id: "domain",
    title: "Domain Registrierung",
    icon: Lock,
    priceMonthly: 1.90,
    priceYearly: 19.90,
    description: "Domainregistrierung mit kostenlosem SSL-Zertifikat.",
    features: [".ch / .de / .com / .org", "Kostenlose SSL-Zertifikate", "DNS-Management", "Domain-Schutz", "WHOIS-Privacy", "Automatische Verlängerung"],
    popular: false,
  },
  {
    id: "ssl",
    title: "SSL-Zertifikat",
    icon: Lock,
    priceMonthly: 0.90,
    priceYearly: 9.90,
    description: "Wildcard SSL-Zertifikat für maximale Sicherheit.",
    features: ["Wildcard-Support", "256-Bit Verschlüsselung", "Mobile-kompatibel", "Unbegrenzte Subdomains", "schnelle Ausstellung", "24/7 Support"],
    popular: false,
  },
];

export default function HostingShop() {
  const [billing, setBilling] = useState("monthly");
  const [cart, setCart] = useState([]);
  const navigate = useNavigate();
  const { customer } = useCustomerAuth();

  const handleOrder = (product) => {
    navigate("/account/checkout", {
      state: { product, billing },
    });
  };

  const addToCart = (product) => {
    setCart([...cart, { ...product, cartId: Date.now() }]);
  };

  const removeFromCart = (cartId) => {
    setCart(cart.filter((item) => item.cartId !== cartId));
  };

  const cartTotal = cart.reduce((sum, item) => {
    return sum + (billing === "monthly" ? item.priceMonthly : item.priceYearly);
  }, 0);

  const pricingText = useMemo(() => (billing === "monthly" ? "/Monat" : "/Jahr"), [billing]);

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Shop & Konfiguration</p>
            <h1 className="text-3xl font-bold text-slate-950">Hosting-Pakete & Services</h1>
            <p className="mt-2 text-sm text-slate-600">Wählen Sie Ihr Paket, konfigurieren Sie die Laufzeit und bestellen Sie direkt im Kundenportal.</p>
          </div>
        </div>
      </div>

      {/* Laufzeit Auswahl */}
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center gap-4 justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-slate-700">Abrechnung:</span>
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${billing === "monthly" ? "bg-[#E63946] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              onClick={() => setBilling("monthly")}
            >
              Monatlich
            </button>
            <button
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${billing === "yearly" ? "bg-[#E63946] text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200"}`}
              onClick={() => setBilling("yearly")}
            >
              Jährlich
              <span className="ml-2 inline-flex items-center rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-700">-20%</span>
            </button>
          </div>
          <span className="inline-flex items-center gap-2 rounded-full bg-slate-50 px-4 py-2 text-sm text-slate-600">
            <ShieldCheck size={16} /> Sichere Zahlung via Stripe, PayPal, TWINT
          </span>
        </div>
      </div>

      {/* Warenkorb */}
      {cart.length > 0 && (
        <div className="rounded-[32px] border border-blue-200 bg-blue-50 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-slate-950">Einkaufswagen ({cart.length} Artikel)</h3>
            <button onClick={() => setCart([])} className="text-sm text-blue-600 hover:text-blue-700 font-semibold">
              Löschen
            </button>
          </div>
          <div className="space-y-2 mb-4">
            {cart.map((item) => (
              <div key={item.cartId} className="flex items-center justify-between bg-white rounded-lg p-3 text-sm">
                <span className="font-medium text-slate-900">{item.title}</span>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-slate-950">
                    CHF {(billing === "monthly" ? item.priceMonthly : item.priceYearly).toFixed(2)}
                  </span>
                  <button
                    onClick={() => removeFromCart(item.cartId)}
                    className="text-red-600 hover:text-red-700 font-semibold"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-blue-200 pt-4 flex items-center justify-between">
            <span className="font-semibold text-slate-900">Gesamt:</span>
            <div className="flex items-center gap-4">
              <span className="text-2xl font-bold text-[#E63946]">CHF {cartTotal.toFixed(2)}{pricingText}</span>
              <button
                onClick={() => {
                  // Für Multi-Bestellung können Sie dies erweitern
                  if (cart.length === 1) {
                    handleOrder(cart[0]);
                  }
                }}
                className="inline-flex items-center gap-2 rounded-full bg-[#E63946] px-6 py-2 text-sm font-semibold text-white hover:bg-[#c5303d] transition"
              >
                Zur Kasse <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Produkte Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => {
          const Icon = product.icon;
          return (
            <article
              key={product.id}
              className={`rounded-[32px] border p-6 shadow-sm hover:shadow-lg transition flex flex-col ${
                product.popular ? "border-[#E63946] bg-gradient-to-b from-[#FEF2F2] to-white ring-2 ring-[#E63946]" : "border-slate-200 bg-white"
              }`}
            >
              {product.popular && (
                <div className="mb-4 inline-flex w-fit rounded-full bg-[#E63946] px-4 py-1 text-xs font-bold text-white uppercase tracking-wide">
                  ⭐ Beliebteste Wahl
                </div>
              )}

              <div className="flex items-center gap-3 mb-4">
                <div className="inline-flex items-center justify-center rounded-full bg-slate-100 p-3 text-slate-900">
                  <Icon size={20} />
                </div>
                <h3 className="text-lg font-bold text-slate-950">{product.title}</h3>
              </div>

              <div className="mb-4">
                <div className="text-3xl font-bold text-slate-950">
                  CHF {billing === "monthly" ? product.priceMonthly.toFixed(2) : product.priceYearly.toFixed(2)}
                </div>
                <div className="text-sm text-slate-600">{pricingText}</div>
              </div>

              <p className="text-sm text-slate-600 mb-5 flex-shrink-0">{product.description}</p>

              <ul className="space-y-2 mb-6 flex-grow text-sm text-slate-700">
                {product.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check size={16} className="text-emerald-600 shrink-0 mt-0.5" /> <span>{feature}</span>
                  </li>
                ))}
              </ul>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleOrder(product)}
                  className={`flex-1 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${
                    product.popular
                      ? "bg-[#E63946] text-white hover:bg-[#c5303d]"
                      : "bg-slate-100 text-slate-900 hover:bg-slate-200"
                  }`}
                >
                  Bestellen <ArrowRight size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => addToCart(product)}
                  className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50 transition"
                  title="Zum Warenkorb hinzufügen"
                >
                  🛒
                </button>
              </div>
            </article>
          );
        })}
      </div>

      {/* Info Box */}
      <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-950 mb-4">ℹ️ Häufig gestellte Fragen</h3>
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="font-semibold text-slate-900 mb-2">Kann ich jederzeit kündigen?</p>
            <p className="text-sm text-slate-600">Ja, Sie können Ihr Paket monatlich kündigen. Bei jährlichen Abos gibt es eine Geld-zurück-Garantie.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">Wie lange aktivieren Sie mein Paket?</p>
            <p className="text-sm text-slate-600">Nach Zahlungsbestätigung wird Ihr Hosting innerhalb von 5 Minuten aktiviert.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">Kann ich die Pakete wechseln?</p>
            <p className="text-sm text-slate-600">Selbstverständlich! Sie können jederzeit upgrade oder downgrade durchführen.</p>
          </div>
          <div>
            <p className="font-semibold text-slate-900 mb-2">Gibt es versteckte Gebühren?</p>
            <p className="text-sm text-slate-600">Nein, die Preise sind transparent. Keine Einrichtungsgebühren oder versteckten Kosten.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
