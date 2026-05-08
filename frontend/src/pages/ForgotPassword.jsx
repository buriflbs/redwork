import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCustomerAuth } from "../contexts/CustomerAuthContext";

export default function ForgotPassword() {
  const { sendPasswordReset } = useCustomerAuth();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);
    try {
      const token = sendPasswordReset(email);
      setMessage(`Ein Link zum Zurücksetzen des Passworts wurde generiert. Verwenden Sie folgenden Code: ${token}`);
    } catch (err) {
      setError(err.message || "E-Mail konnte nicht gefunden werden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-[40px] bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[#E63946] font-semibold">Passwort zurücksetzen</p>
          <h1 className="mt-3 text-4xl font-extrabold text-[#0f172a]">Passwort vergessen?</h1>
          <p className="mt-4 text-slate-500">Geben Sie Ihre E-Mail-Adresse ein. Sie erhalten einen Code zum Zurücksetzen Ihres Passworts.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block text-sm font-semibold text-[#0f172a]">
            E-Mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@domain.com"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0f172a] focus:border-[#E63946] outline-none"
            />
          </label>
          {error && <div className="rounded-3xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
          {message && <div className="rounded-3xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700 whitespace-pre-wrap">{message}</div>}
          <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c5303d] disabled:opacity-60 transition">
            {loading ? "Sende Link..." : "Link erstellen"}
            <ArrowRight size={18} />
          </button>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <button type="button" onClick={() => navigate("/account/login")} className="font-semibold text-[#0f172a] hover:text-[#E63946]">Zurück zum Login</button>
            <Link to="/register" className="font-semibold text-[#0f172a] hover:text-[#E63946]">Noch kein Konto?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
