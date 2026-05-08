import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import { ShoppingCart, Lock, CheckCircle2, ArrowLeft } from "lucide-react";

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { customer, createOrder } = useCustomerAuth();
  const product = location.state?.product;
  const billing = location.state?.billing || "monthly";
  const [paymentMethod, setPaymentMethod] = useState("Stripe");
  const [email, setEmail] = useState(customer?.email || "");
  const [company, setCompany] = useState(customer?.company || "");
  const [phone, setPhone] = useState(customer?.phone || "");
  const [privacy, setPrivacy] = useState(false);
  const [terms, setTerms] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [processing, setProcessing] = useState(false);

  if (!product) {
    return (
      <div className="space-y-4">
        <button
          onClick={() => navigate("/account/hosting")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#E63946] hover:text-[#c5303d]"
        >
          <ArrowLeft size={16} /> Zurück zum Shop
        </button>
        <div className="rounded-[32px] border border-slate-200 bg-white p-10 text-center shadow-sm">
          <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
          <p className="text-lg font-semibold text-slate-900">Kein Produkt ausgewählt.</p>
          <p className="mt-3 text-sm text-slate-600">Wählen Sie zuerst ein Hosting-Paket im Bereich "Hosting & Produkte" aus.</p>
        </div>
      </div>
    );
  }

  const price = billing === "monthly" ? product.priceMonthly : product.priceYearly;
  const billingLabel = billing === "monthly" ? "Monatlich" : "Jährlich";

  const submitOrder = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!email) {
      setError("Bitte geben Sie Ihre E-Mail ein.");
      return;
    }
    if (!privacy || !terms) {
      setError("Bitte akzeptieren Sie die Bedingungen und Datenschutz.");
      return;
    }

    setProcessing(true);

    try {
      const order = createOrder({
        title: product.title,
        billing,
        price,
        paymentMethod,
        description: product.description,
        status: paymentMethod === "Stripe" ? "Bezahlt" : "Offen",
      });

      // Create invoice
      // This is a simplified version - in production you'd create a proper invoice
      setSuccess("✓ Ihre Bestellung wurde erfolgreich verarbeitet!");
      
      setTimeout(() => {
        navigate("/account/dashboard", { replace: true });
      }, 2000);
    } catch (err) {
      setError(err.message || "Bestellung konnte nicht abgeschlossen werden.");
      setProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Bezahlung & Bestellung</p>
            <h1 className="text-3xl font-bold text-slate-950">Bestellung abschließen</h1>
          </div>
          <button
            onClick={() => navigate("/account/hosting")}
            className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
          >
            <ArrowLeft size={16} /> Ändern
          </button>
        </div>
        <p className="mt-4 text-sm text-slate-600">Überprüfen Sie Ihre Bestellung und zahlen Sie sicher mit Ihrer bevorzugten Zahlungsart.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        {/* Checkout Form */}
        <form onSubmit={submitOrder} className="space-y-6">
          {/* Kundendaten */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950 mb-5">Rechnungsadresse</h2>
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-slate-900">
                E-Mail *
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="ihre@email.com"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#E63946] outline-none"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-900">
                Firma / Projekt (optional)
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="z.B. Acme GmbH"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#E63946] outline-none"
                />
              </label>
              <label className="block text-sm font-semibold text-slate-900">
                Telefon (optional)
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+41 79 123 45 67"
                  className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#E63946] outline-none"
                />
              </label>
            </div>
          </div>

          {/* Zahlungsart */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-bold text-slate-950 mb-5 flex items-center gap-2">
              <Lock size={20} /> Zahlungsmethode
            </h2>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { id: "Stripe", label: "💳 Kreditkarte", desc: "Visa, Mastercard, Amex" },
                { id: "PayPal", label: "🅿️ PayPal", desc: "PayPal Express" },
                { id: "TWINT", label: "📱 TWINT", desc: "Sofortzahlung" },
              ].map((option) => (
                <label
                  key={option.id}
                  className={`rounded-[20px] border-2 px-4 py-3 cursor-pointer transition ${
                    paymentMethod === option.id
                      ? "border-[#E63946] bg-red-50"
                      : "border-slate-200 bg-slate-50 hover:border-slate-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={option.id}
                    checked={paymentMethod === option.id}
                    onChange={() => setPaymentMethod(option.id)}
                    className="hidden"
                  />
                  <div className="font-semibold text-slate-900">{option.label}</div>
                  <div className="text-xs text-slate-600">{option.desc}</div>
                </label>
              ))}
            </div>
          </div>

          {/* Bedingungen */}
          <div className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm space-y-3">
            <label className="flex items-start gap-3 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 p-2 rounded-lg">
              <input
                type="checkbox"
                checked={terms}
                onChange={(e) => setTerms(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-[#E63946] cursor-pointer"
              />
              <span>
                Ich akzeptiere die <strong>Allgemeinen Geschäftsbedingungen (AGB)</strong> und
                <strong> Kundenservicebedingungen</strong>.
              </span>
            </label>
            <label className="flex items-start gap-3 text-sm text-slate-700 cursor-pointer hover:bg-slate-50 p-2 rounded-lg">
              <input
                type="checkbox"
                checked={privacy}
                onChange={(e) => setPrivacy(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-slate-300 text-[#E63946] cursor-pointer"
              />
              <span>
                Ich habe die <strong>Datenschutzerklärung</strong> gelesen und
                akzeptiert. Ich bin mit der Speicherung meiner Daten
                einverstanden.
              </span>
            </label>
          </div>

          {/* Fehler- & Erfolgsmeldungen */}
          {error && (
            <div className="rounded-[20px] bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700 flex items-start gap-2">
              <span className="text-lg">✕</span>
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="rounded-[20px] bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 flex items-start gap-2">
              <CheckCircle2 size={18} />
              <span>{success}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={processing}
            className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#E63946] px-6 py-4 text-sm font-bold text-white hover:bg-[#c5303d] disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {processing ? (
              <>
                ⏳ Verarbeitung läuft...
              </>
            ) : (
              <>
                <Lock size={18} /> CHF {price.toFixed(2)} - Jetzt bezahlen
              </>
            )}
          </button>
        </form>

        {/* Bestellübersicht */}
        <aside className="space-y-4">
          <div className="rounded-[32px] border border-slate-200 bg-gradient-to-br from-slate-50 to-white p-8 shadow-sm sticky top-4">
            <h2 className="text-xl font-bold text-slate-950 mb-6 flex items-center gap-2">
              <ShoppingCart size={20} /> Bestellübersicht
            </h2>

            {/* Produkt */}
            <div className="rounded-[24px] bg-white border border-slate-200 p-4 mb-4">
              <p className="text-xs uppercase tracking-wide text-slate-500 mb-1">Produkt</p>
              <p className="text-lg font-bold text-slate-950">{product.title}</p>
              <p className="text-sm text-slate-600 mt-2">{product.description}</p>
            </div>

            {/* Details */}
            <div className="space-y-2 mb-6 pb-6 border-b border-slate-200">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Laufzeit:</span>
                <strong className="text-slate-950">{billingLabel}</strong>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Zeitraum:</span>
                <strong className="text-slate-950">{billing === "monthly" ? "1 Monat" : "12 Monate"}</strong>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Zahlungsart:</span>
                <strong className="text-slate-950">{paymentMethod}</strong>
              </div>
            </div>

            {/* Preis */}
            <div className="space-y-2 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Subtotal:</span>
                <strong className="text-slate-950">CHF {price.toFixed(2)}</strong>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">MwSt (8%):</span>
                <strong className="text-slate-950">CHF {(price * 0.08).toFixed(2)}</strong>
              </div>
              <div className="border-t border-slate-200 pt-2 mt-4 flex items-center justify-between">
                <span className="text-lg font-bold text-slate-950">Gesamtbetrag:</span>
                <span className="text-2xl font-bold text-[#E63946]">CHF {(price * 1.08).toFixed(2)}</span>
              </div>
            </div>

            {/* Info */}
            <div className="rounded-[20px] border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 space-y-2">
              <div className="font-semibold">✓ Sofort nach Bezahlung aktiviert</div>
              <div>14 Tage Geld-zurück-Garantie auf Jahresverträge</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
