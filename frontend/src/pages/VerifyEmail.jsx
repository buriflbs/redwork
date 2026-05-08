import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import { useCustomerAuth } from "../contexts/CustomerAuthContext";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState("Verifiziere Ihre E-Mail...");
  const [error, setError] = useState("");
  const { verifyEmail } = useCustomerAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setError("Kein Verifizierungscode gefunden.");
      setMessage("");
      return;
    }
    try {
      verifyEmail(token);
      setMessage("Ihre E-Mail wurde erfolgreich verifiziert. Sie werden weitergeleitet.");
      setTimeout(() => navigate("/account/dashboard"), 1800);
    } catch (err) {
      setError(err.message || "Verifizierung fehlgeschlagen.");
      setMessage("");
    }
  }, [searchParams, verifyEmail, navigate]);

  return (
    <div className="min-h-screen bg-[#f8fafc] flex items-center justify-center p-6">
      <div className="w-full max-w-3xl rounded-[40px] bg-white p-10 shadow-[0_30px_80px_rgba(15,23,42,0.08)] text-center">
        <div className="mb-6">
          <p className="text-sm uppercase tracking-[0.3em] text-[#E63946] font-semibold">E-Mail-Verifikation</p>
          <h1 className="mt-3 text-4xl font-extrabold text-[#0f172a]">Verifizierung läuft</h1>
        </div>
        {message && <p className="text-slate-700">{message}</p>}
        {error && <p className="text-red-700">{error}</p>}
        <div className="mt-8 text-sm text-slate-600">
          <Link to="/account/login" className="font-semibold text-[#0f172a] hover:text-[#E63946]">Zum Login</Link>
        </div>
      </div>
    </div>
  );
}
