import React, { useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useCustomerAuth } from "../contexts/CustomerAuthContext";

export default function ResetPassword() {
  const { token } = useParams();
  const { resetPassword } = useCustomerAuth();
  const [password, setPassword] = useState("");
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
      resetPassword(token, password);
      setMessage("Ihr Passwort wurde erfolgreich zurückgesetzt.");
      setTimeout(() => navigate("/account/login"), 1400);
    } catch (err) {
      setError(err.message || "Passwort konnte nicht zurückgesetzt werden.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-[40px] bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)]">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-[#E63946] font-semibold">Passwort zurücksetzen</p>
          <h1 className="mt-3 text-4xl font-extrabold text-[#0f172a]">Geben Sie ein neues Passwort ein</h1>
          <p className="mt-4 text-slate-500">Für Ihre Sicherheit muss Ihr neues Passwort mindestens 8 Zeichen lang sein.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <label className="block text-sm font-semibold text-[#0f172a]">
            Neues Passwort
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="********"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-[#0f172a] focus:border-[#E63946] outline-none"
            />
          </label>
          {error && <div className="rounded-3xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>}
          {message && <div className="rounded-3xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">{message}</div>}
          <button type="submit" disabled={loading} className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c5303d] disabled:opacity-60 transition">
            {loading ? "Speichere..." : "Passwort setzen"}
            <ArrowRight size={18} />
          </button>
          <div className="text-sm text-slate-600">
            <Link to="/account/login" className="font-semibold text-[#0f172a] hover:text-[#E63946]">Zurück zum Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
