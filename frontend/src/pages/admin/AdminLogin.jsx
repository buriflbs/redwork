import React, { useState } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { Lock, User, Loader2, AlertCircle, Eye, EyeOff, ShieldCheck, ArrowRight } from "lucide-react";
import { useAuth } from "../../contexts/AuthContext";
import Logo from "../../components/Logo";

export default function AdminLogin() {
  const { user, adminLogin, loading } = useAuth();
  const nav = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [err, setErr] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (user?.role === "admin") return <Navigate to="/admin" replace />;

  const submit = async (e) => {
    e.preventDefault();
    setErr("");
    const rawUser = username.trim();
    if (!rawUser || !password) {
      setErr("Bitte geben Sie Benutzername und Passwort ein.");
      return;
    }
    setSubmitting(true);
    try {
      try {
        await adminLogin(rawUser, password);
      } catch (firstErr) {
        // Intelligent fallback: If user typed email, try "admin"
        const lower = rawUser.toLowerCase();
        if (lower === "info@redwork.ch" || lower === "admin@redwork.ch" || lower.includes("@")) {
          await adminLogin("admin", password);
        } else {
          throw firstErr;
        }
      }
      nav("/admin", { replace: true });
    } catch (e) {
      const detail = e.response?.data?.detail;
      setErr(detail || "Die Anmeldedaten sind nicht korrekt.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden font-sans select-none">
      {/* Background Ambient Glow & Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(230,57,70,0.12),rgba(255,255,255,0))]" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      
      {/* Security Status Watermark Pill */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-900/80 border border-slate-800 text-slate-400 text-xs font-semibold backdrop-blur-md">
        <ShieldCheck size={14} className="text-emerald-400" />
        <span>Enterprise SSL & 256-Bit Authentifizierung</span>
      </div>

      <div className="relative w-full max-w-[440px] z-10">
        <form
          onSubmit={submit}
          className="bg-[#0b0f19]/90 border border-white/10 rounded-3xl p-7 sm:p-10 shadow-[0_25px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl relative overflow-hidden"
        >
          {/* Subtle Top Accent Border */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#E63946] to-transparent opacity-80" />

          {/* Logo & Header */}
          <div className="flex flex-col items-center mb-8">
            <div className="mb-4">
              <Logo size="lg" />
            </div>
            <h1 className="text-white text-2xl font-black tracking-tight text-center">
              Admin Console
            </h1>
            <p className="text-slate-400 text-xs sm:text-sm text-center mt-1 font-medium">
              Sicherer Administrationszugang
            </p>
          </div>

          <div className="space-y-4">
            {/* Username Input */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Benutzername / E-Mail
              </label>
              <div className="relative group">
                <User size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#1E88E5] transition-colors" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="admin"
                  data-testid="admin-username"
                  className="w-full pl-10 pr-4 py-3 bg-[#030712] border border-slate-800 focus:border-[#1E88E5] focus:ring-2 focus:ring-[#1E88E5]/20 outline-none rounded-xl text-white text-sm transition-all"
                  autoComplete="username"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5">
                Passwort
              </label>
              <div className="relative group">
                <Lock size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-[#E63946] transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  data-testid="admin-password"
                  className="w-full pl-10 pr-11 py-3 bg-[#030712] border border-slate-800 focus:border-[#E63946] focus:ring-2 focus:ring-[#E63946]/20 outline-none rounded-xl text-white text-sm transition-all"
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors p-1"
                  tabIndex={-1}
                  aria-label="Passwort anzeigen"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember Me Option */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-slate-800 bg-[#030712] text-[#E63946] focus:ring-0 focus:ring-offset-0 cursor-pointer accent-[#E63946]"
                />
                <span className="text-slate-400 text-xs font-medium">Angemeldet bleiben</span>
              </label>
            </div>
          </div>

          {/* Error Message Container */}
          {err && (
            <div className="mt-5 flex items-start gap-2.5 p-3 rounded-xl bg-red-950/40 border border-red-800/40 text-red-300 text-xs leading-relaxed animate-in fade-in duration-200">
              <AlertCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
              <span>{err}</span>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={submitting}
            data-testid="admin-login-submit"
            className="mt-6 w-full flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#E63946] to-[#d62839] hover:from-[#d62839] hover:to-[#b71c2a] disabled:opacity-50 text-white py-3.5 rounded-xl font-bold text-sm shadow-[0_10px_25px_rgba(230,57,70,0.3)] hover:shadow-[0_15px_30px_rgba(230,57,70,0.4)] hover:scale-[1.01] active:scale-[0.99] transition-all cursor-pointer"
          >
            {submitting ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                <span>Authentifizierung...</span>
              </>
            ) : (
              <>
                <span>Sicher anmelden</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>

          {/* Back to Website */}
          <div className="mt-6 text-center">
            <a
              href="/"
              className="inline-flex items-center gap-1.5 text-slate-500 hover:text-slate-300 text-xs font-semibold transition-colors"
            >
              <span>← Zurück zur Website</span>
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
