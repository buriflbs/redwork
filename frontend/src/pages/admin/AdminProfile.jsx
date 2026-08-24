import React, { useEffect, useState } from "react";
import {
  User, Lock, ShieldCheck, KeyRound, Mail, CheckCircle2,
  AlertCircle, Loader2, Save, Eye, EyeOff, ShieldAlert, Sparkles
} from "lucide-react";
import api from "../../api";
import { useAuth } from "../../contexts/AuthContext";

export default function AdminProfile() {
  const { user } = useAuth();

  // Profile Form State
  const [profile, setProfile] = useState({
    username: "",
    email: "",
    fullName: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState({ type: "", text: "" });

  // Password Change State
  const [passForm, setPassForm] = useState({
    currentPassword: "",
    newPassword: "",
    newPasswordConfirm: "",
  });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [savingPass, setSavingPass] = useState(false);
  const [passMsg, setPassMsg] = useState({ type: "", text: "" });

  // Load Admin Profile
  useEffect(() => {
    let active = true;
    api.get("/admin/profile")
      .then((res) => {
        if (active && res.data) {
          setProfile({
            username: res.data.username || "admin",
            email: res.data.email || "admin@redwork.ch",
            fullName: res.data.fullName || "System Administrator",
          });
        }
      })
      .catch((err) => {
        if (active) {
          setProfile({
            username: user?.username || "admin",
            email: user?.email || "admin@redwork.ch",
            fullName: user?.fullName || "System Administrator",
          });
        }
      })
      .finally(() => {
        if (active) setLoadingProfile(false);
      });
    return () => { active = false; };
  }, [user]);

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileMsg({ type: "", text: "" });
    if (!profile.username.trim()) {
      setProfileMsg({ type: "error", text: "Benutzername ist erforderlich." });
      return;
    }

    setSavingProfile(true);
    try {
      const res = await api.put("/admin/profile", {
        username: profile.username.trim(),
        email: profile.email.trim(),
        fullName: profile.fullName.trim(),
      });
      setProfileMsg({
        type: "success",
        text: res.data?.message || "Admin-Profil erfolgreich aktualisiert!",
      });
    } catch (err) {
      const detail = err.response?.data?.detail || "Profil konnte nicht aktualisiert werden.";
      setProfileMsg({ type: "error", text: detail });
    } finally {
      setSavingProfile(false);
    }
  };

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPassMsg({ type: "", text: "" });

    if (!passForm.currentPassword) {
      setPassMsg({ type: "error", text: "Bitte geben Sie das aktuelle Passwort ein." });
      return;
    }
    if (passForm.newPassword.length < 8) {
      setPassMsg({ type: "error", text: "Das neue Passwort muss mindestens 8 Zeichen lang sein." });
      return;
    }
    if (passForm.newPassword !== passForm.newPasswordConfirm) {
      setPassMsg({ type: "error", text: "Die neuen Passwörter stimmen nicht überein." });
      return;
    }

    setSavingPass(true);
    try {
      const res = await api.put("/admin/change-password", {
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword,
        newPasswordConfirm: passForm.newPasswordConfirm,
      });
      setPassMsg({
        type: "success",
        text: res.data?.message || "Passwort erfolgreich geändert!",
      });
      setPassForm({
        currentPassword: "",
        newPassword: "",
        newPasswordConfirm: "",
      });
    } catch (err) {
      const detail = err.response?.data?.detail || "Passwort konnte nicht geändert werden.";
      setPassMsg({ type: "error", text: detail });
    } finally {
      setSavingPass(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-[#E63946]" size={36} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#E63946] mb-1">
            <ShieldCheck size={16} />
            <span>Sicherheit & Authentifizierung</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#0f172a]">
            Admin-Profil & Zugangsdaten
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Verwalten Sie Ihren Administrator-Benutzernamen, E-Mail-Adresse und ändern Sie Ihr Passwort sicher.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold shrink-0 self-start sm:self-auto">
          <Sparkles size={15} />
          <span>Bcrypt 256-Bit Verschlüsselt</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left Column: Profile Data */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-blue-50 text-[#1E88E5] flex items-center justify-center shrink-0">
                <User size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0f172a]">Administrator Profil</h2>
                <p className="text-xs text-slate-500">Persönliche Angaben und Kontodaten</p>
              </div>
            </div>

            <form id="profile-form" onSubmit={handleProfileSubmit} className="space-y-5">
              {profileMsg.text && (
                <div
                  className={`p-4 rounded-2xl text-xs font-medium flex items-start gap-2.5 ${
                    profileMsg.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {profileMsg.type === "success" ? (
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                  ) : (
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                  )}
                  <span>{profileMsg.text}</span>
                </div>
              )}

              {/* Username */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Benutzername *
                </label>
                <div className="relative">
                  <User size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#1E88E5] outline-none text-sm text-[#0f172a] transition"
                    placeholder="admin"
                  />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">Dieser Name wird beim Admin-Login verwendet.</p>
              </div>

              {/* Full Name */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Vollständiger Name / Anzeigename
                </label>
                <input
                  type="text"
                  value={profile.fullName}
                  onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#1E88E5] outline-none text-sm text-[#0f172a] transition"
                  placeholder="System Administrator"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Admin E-Mail-Adresse
                </label>
                <div className="relative">
                  <Mail size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#1E88E5] outline-none text-sm text-[#0f172a] transition"
                    placeholder="admin@redwork.ch"
                  />
                </div>
              </div>
            </form>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <button
              type="submit"
              form="profile-form"
              disabled={savingProfile}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#0f172a] hover:bg-[#1e293b] text-white font-bold text-sm shadow-md transition disabled:opacity-50 cursor-pointer"
            >
              {savingProfile ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Wird gespeichert...</span>
                </>
              ) : (
                <>
                  <Save size={17} />
                  <span>Profil-Änderungen speichern</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Right Column: Password Change */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 pb-5 border-b border-slate-100 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-red-50 text-[#E63946] flex items-center justify-center shrink-0">
                <KeyRound size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0f172a]">Passwort ändern</h2>
                <p className="text-xs text-slate-500">Aktualisieren Sie Ihren geheimen Login-Schlüssel</p>
              </div>
            </div>

            <form id="pass-form" onSubmit={handlePasswordSubmit} className="space-y-4">
              {passMsg.text && (
                <div
                  className={`p-4 rounded-2xl text-xs font-medium flex items-start gap-2.5 ${
                    passMsg.type === "success"
                      ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                      : "bg-red-50 border border-red-200 text-red-800"
                  }`}
                >
                  {passMsg.type === "success" ? (
                    <CheckCircle2 size={16} className="shrink-0 mt-0.5 text-emerald-600" />
                  ) : (
                    <AlertCircle size={16} className="shrink-0 mt-0.5 text-red-600" />
                  )}
                  <span>{passMsg.text}</span>
                </div>
              )}

              {/* Current Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Aktuelles Passwort *
                </label>
                <div className="relative">
                  <Lock size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showCurrent ? "text" : "password"}
                    value={passForm.currentPassword}
                    onChange={(e) => setPassForm({ ...passForm, currentPassword: e.target.value })}
                    required
                    className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#E63946] outline-none text-sm text-[#0f172a] transition"
                    placeholder="••••••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrent(!showCurrent)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Neues Passwort *
                </label>
                <div className="relative">
                  <KeyRound size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showNew ? "text" : "password"}
                    value={passForm.newPassword}
                    onChange={(e) => setPassForm({ ...passForm, newPassword: e.target.value })}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#E63946] outline-none text-sm text-[#0f172a] transition"
                    placeholder="Mindestens 8 Zeichen"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNew(!showNew)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Neues Passwort wiederholen *
                </label>
                <div className="relative">
                  <KeyRound size={17} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={passForm.newPasswordConfirm}
                    onChange={(e) => setPassForm({ ...passForm, newPasswordConfirm: e.target.value })}
                    required
                    minLength={8}
                    className="w-full pl-10 pr-11 py-3 rounded-2xl border border-slate-200 bg-slate-50/50 focus:bg-white focus:border-[#E63946] outline-none text-sm text-[#0f172a] transition"
                    placeholder="Wiederholen Sie das neue Passwort"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-[11px] text-amber-800 flex items-start gap-2">
                <ShieldAlert size={16} className="shrink-0 mt-0.5 text-amber-600" />
                <span>Nach der Passwortänderung bleibt Ihre aktuelle Sitzung aktiv, aber bei der nächsten Anmeldung gilt das neue Passwort.</span>
              </div>
            </form>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100">
            <button
              type="submit"
              form="pass-form"
              disabled={savingPass}
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-[#E63946] hover:bg-[#c5303d] text-white font-bold text-sm shadow-md shadow-red-900/20 transition disabled:opacity-50 cursor-pointer"
            >
              {savingPass ? (
                <>
                  <Loader2 size={17} className="animate-spin" />
                  <span>Wird aktualisiert...</span>
                </>
              ) : (
                <>
                  <KeyRound size={17} />
                  <span>Passwort jetzt aktualisieren</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
