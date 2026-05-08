import React, { useState } from "react";
import { useCustomerAuth } from "../../contexts/CustomerAuthContext";
import { Lock, User, Building2, Phone, Mail, Eye, EyeOff } from "lucide-react";

export default function Profile() {
  const { customer, updateProfile, changePassword } = useCustomerAuth();
  const [profile, setProfile] = useState({ 
    name: customer?.name || "", 
    email: customer?.email || "", 
    company: customer?.company || "", 
    phone: customer?.phone || "" 
  });
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [error, setError] = useState("");
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);

  const saveProfile = (e) => {
    e.preventDefault();
    setError("");
    setProfileMessage("");
    try {
      updateProfile(profile);
      setProfileMessage("Ihr Profil wurde erfolgreich aktualisiert.");
      setTimeout(() => setProfileMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Fehler beim Speichern des Profils.");
    }
  };

  const savePassword = (e) => {
    e.preventDefault();
    setError("");
    setPasswordMessage("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError("Die Passwörter stimmen nicht überein.");
      return;
    }
    if (passwordForm.newPassword.length < 8) {
      setError("Das neue Passwort muss mindestens 8 Zeichen lang sein.");
      return;
    }
    try {
      changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPasswordMessage("Ihr Passwort wurde erfolgreich geändert.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => setPasswordMessage(""), 3000);
    } catch (err) {
      setError(err.message || "Passwort konnte nicht geändert werden.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Kontoeinstellungen</p>
            <h1 className="text-3xl font-bold text-slate-950">Mein Profil</h1>
          </div>
          <div className={`rounded-3xl px-4 py-2 text-sm font-semibold ${customer?.emailVerified ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
            {customer?.emailVerified ? "✓ Verifiziert" : "⚠ Nicht verifiziert"}
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-600">Verwalten Sie Ihre persönlichen Daten, Kontaktinformationen und Sicherheitseinstellungen.</p>
      </div>

      {/* Profil Info Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-blue-50 to-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center justify-center rounded-full bg-blue-100 p-2 text-blue-600"><User size={18} /></div>
            <div className="text-sm text-slate-500">Benutzerkonto</div>
          </div>
          <div className="text-lg font-bold text-slate-950 truncate">{customer?.name}</div>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-purple-50 to-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center justify-center rounded-full bg-purple-100 p-2 text-purple-600"><Mail size={18} /></div>
            <div className="text-sm text-slate-500">E-Mail</div>
          </div>
          <div className="text-lg font-bold text-slate-950 truncate">{customer?.email}</div>
        </div>
        <div className="rounded-[24px] border border-slate-200 bg-gradient-to-br from-orange-50 to-white p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <div className="inline-flex items-center justify-center rounded-full bg-orange-100 p-2 text-orange-600"><Building2 size={18} /></div>
            <div className="text-sm text-slate-500">Firma</div>
          </div>
          <div className="text-lg font-bold text-slate-950 truncate">{customer?.company || "Nicht angegeben"}</div>
        </div>
      </div>

      {/* Forms */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Persönliche Daten */}
        <form onSubmit={saveProfile} className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 mb-6">
            <div className="inline-flex items-center justify-center rounded-full bg-[#E63946]/10 p-3 text-[#E63946]"><User size={20} /></div>
            <h2 className="text-2xl font-bold text-slate-950">Persönliche Daten</h2>
          </div>

          <label className="block text-sm font-semibold text-slate-900">
            Name
            <input
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              type="text"
              placeholder="Ihr vollständiger Name"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#E63946] outline-none"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-900">
            E-Mail (nicht änderbar)
            <input
              value={profile.email}
              disabled
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-600 cursor-not-allowed"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-900">
            Firmennamen (optional)
            <input
              value={profile.company}
              onChange={(e) => setProfile({ ...profile, company: e.target.value })}
              type="text"
              placeholder="z.B. Acme GmbH"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#E63946] outline-none"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-900">
            Telefon (optional)
            <input
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              type="tel"
              placeholder="z.B. +41 79 123 45 67"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#E63946] outline-none"
            />
          </label>

          {profileMessage && <div className="rounded-3xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">✓ {profileMessage}</div>}
          {error && <div className="rounded-3xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">✗ {error}</div>}

          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#E63946] px-6 py-3 text-sm font-semibold text-white hover:bg-[#c5303d] transition">
            Änderungen speichern
          </button>
        </form>

        {/* Passwort ändern */}
        <form onSubmit={savePassword} className="rounded-[32px] border border-slate-200 bg-white p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-2 mb-6">
            <div className="inline-flex items-center justify-center rounded-full bg-orange-100 p-3 text-orange-600"><Lock size={20} /></div>
            <h2 className="text-2xl font-bold text-slate-950">Sicherheit</h2>
          </div>

          <label className="block text-sm font-semibold text-slate-900">
            Aktuelles Passwort
            <div className="relative mt-2">
              <input
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                type={showCurrentPass ? "text" : "password"}
                placeholder="Ihr aktuelles Passwort"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 focus:border-[#E63946] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPass(!showCurrentPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showCurrentPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className="block text-sm font-semibold text-slate-900">
            Neues Passwort
            <div className="relative mt-2">
              <input
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                type={showNewPass ? "text" : "password"}
                placeholder="Mindestens 8 Zeichen"
                className="w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 pr-12 text-sm text-slate-900 focus:border-[#E63946] outline-none"
              />
              <button
                type="button"
                onClick={() => setShowNewPass(!showNewPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
              >
                {showNewPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </label>

          <label className="block text-sm font-semibold text-slate-900">
            Passwort bestätigen
            <input
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              type="password"
              placeholder="Wiederholen Sie Ihr neues Passwort"
              className="mt-2 w-full rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-[#E63946] outline-none"
            />
          </label>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            <strong>Sicherheitstipp:</strong> Verwenden Sie ein starkes Passwort mit mindestens 8 Zeichen, Groß- und Kleinbuchstaben sowie Zahlen.
          </div>

          {passwordMessage && <div className="rounded-3xl bg-emerald-50 border border-emerald-200 px-4 py-3 text-sm text-emerald-700">✓ {passwordMessage}</div>}
          {error && <div className="rounded-3xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">✗ {error}</div>}

          <button type="submit" className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-orange-600 px-6 py-3 text-sm font-semibold text-white hover:bg-orange-700 transition">
            Passwort aktualisieren
          </button>
        </form>
      </div>

      {/* Konto Info */}
      <div className="rounded-[32px] border border-slate-200 bg-slate-50 p-8 shadow-sm">
        <h3 className="text-lg font-bold text-slate-950 mb-4">Kontoinformationen</h3>
        <div className="grid gap-4 md:grid-cols-3 text-sm">
          <div>
            <div className="text-slate-500 mb-1">Konto erstellt am</div>
            <div className="font-semibold text-slate-950">{new Date(customer?.createdAt).toLocaleDateString("de-CH")}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Hosting-Plan</div>
            <div className="font-semibold text-slate-950">{customer?.plan}</div>
          </div>
          <div>
            <div className="text-slate-500 mb-1">Support Level</div>
            <div className="font-semibold text-slate-950">{customer?.supportLevel}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
