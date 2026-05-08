import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCustomerAuth } from "../contexts/CustomerAuthContext";

export default function AccountLogin() {
  const { customer, login } = useCustomerAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (customer) {
      navigate("/account/dashboard", { replace: true });
    }
  }, [customer, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      login(form.email, form.password);
      navigate("/account/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "E-Mail oder Passwort stimmt nicht.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-[40px] bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[#E63946] font-semibold">Kundenlogin</p>
          <h1 className="mt-3 text-4xl font-extrabold text-[#0f172a]">Anmelden im Kundenportal</h1>
          <p className="mt-4 text-slate-500">Verwalten Sie Ihre Hosting-Pakete, Rechnungen und Support-Tickets direkt in Ihrem Konto.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block text-sm font-semibold text-[#0f172a]">
            E-Mail
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              type="email"
              placeholder="email@domain.com"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0f172a] focus:border-[#E63946] outline-none"
            />
          </label>
          <label className="block text-sm font-semibold text-[#0f172a]">
            Passwort
            <input
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              type="password"
              placeholder="********"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0f172a] focus:border-[#E63946] outline-none"
            />
          </label>
          {error && <div className="rounded-3xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
          <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c5303d] disabled:opacity-60 transition">
            {loading ? "Anmeldung läuft..." : "Anmelden"}
            <ArrowRight size={18} />
          </button>
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <Link to="/register" className="font-semibold text-[#0f172a] hover:text-[#E63946]">Jetzt registrieren</Link>
            <Link to="/account/forgot-password" className="font-semibold text-[#0f172a] hover:text-[#E63946]">Passwort vergessen?</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
