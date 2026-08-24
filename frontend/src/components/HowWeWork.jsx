import React, { useEffect, useState } from "react";
import { 
  FileSearch, 
  Cpu, 
  FileCheck2, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  MessageSquare,
  ShieldCheck,
  Zap,
  Users
} from "lucide-react";
import { useModals } from "../contexts/ModalContext";
import api from "../api";

const PROCESS_STEPS = [
  {
    stepNumber: "01",
    tag: "PROJEKTANALYSE",
    title: "Projekt & Anforderungen",
    desc: "Sie schildern uns Ihr Vorhaben, Ihre Ziele und Anforderungen. Je genauer wir Ihr Projekt verstehen, desto präziser können wir die passende Lösung entwickeln.",
    highlights: ["Bedarfsanalyse", "Zieldefinition", "Erstberatung"],
    icon: FileSearch,
    accentColor: "#1E88E5",
    accentBg: "bg-blue-500/10",
    accentBorder: "group-hover:border-blue-500/40",
    badgeGlow: "group-hover:shadow-[0_0_25px_rgba(30,136,229,0.25)]",
  },
  {
    stepNumber: "02",
    tag: "TECHNISCHE BERATUNG",
    title: "Persönliche Analyse",
    desc: "Wir analysieren Anforderungen, technische Rahmenbedingungen, Design, Funktionen und mögliche Lösungswege.",
    highlights: ["Architektur", "Tech-Stack", "Machbarkeit"],
    icon: Cpu,
    accentColor: "#6366F1",
    accentBg: "bg-indigo-500/10",
    accentBorder: "group-hover:border-indigo-500/40",
    badgeGlow: "group-hover:shadow-[0_0_25px_rgba(99,102,241,0.25)]",
  },
  {
    stepNumber: "03",
    tag: "INDIVIDUELLES ANGEBOT",
    title: "Individuelles Konzept & Angebot",
    desc: "Sie erhalten eine transparente, individuell auf Ihr Projekt zugeschnittene Empfehlung inklusive Leistungsumfang und Kosten.",
    highlights: ["Transparente Festpreise", "Meilensteine", "SLA"],
    icon: FileCheck2,
    accentColor: "#22C55E",
    accentBg: "bg-emerald-500/10",
    accentBorder: "group-hover:border-emerald-500/40",
    badgeGlow: "group-hover:shadow-[0_0_25px_rgba(34,197,94,0.25)]",
  },
  {
    stepNumber: "04",
    tag: "UMSETZUNG",
    title: "Umsetzung & persönliche Betreuung",
    desc: "Nach Ihrer Freigabe beginnt die professionelle Umsetzung mit persönlicher Betreuung und direkter Kommunikation.",
    highlights: ["Direkter Kontakt", "Schweizer Qualität", "Full-Service"],
    icon: Sparkles,
    accentColor: "#E63946",
    accentBg: "bg-red-500/10",
    accentBorder: "group-hover:border-red-500/40",
    badgeGlow: "group-hover:shadow-[0_0_25px_rgba(230,57,70,0.25)]",
  },
];

const TRUST_PILLARS = [
  { icon: Users, text: "Persönliche Beratung" },
  { icon: Zap, text: "Transparente Planung" },
  { icon: ShieldCheck, text: "Individuelle Lösungen" },
  { icon: CheckCircle2, text: "Direkter Ansprechpartner" },
];

export default function HowWeWork() {
  const { openQuote, openContact } = useModals();
  const [s, setS] = useState({
    howWeWorkTitle: "Angebot in 4 Schritten einholen",
    howWeWorkSubtitle: "UNSER VORGEHEN & PROZESS",
  });

  useEffect(() => {
    api.get("/site-settings")
      .then((r) => {
        if (r.data) {
          setS((prev) => ({
            ...prev,
            howWeWorkTitle: r.data.howWeWorkTitle || prev.howWeWorkTitle,
            howWeWorkSubtitle: r.data.howWeWorkSubtitle || prev.howWeWorkSubtitle,
          }));
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="leistungen" className="relative py-20 sm:py-28 md:py-32 bg-[#f8fafc] overflow-hidden border-t border-slate-200/80">
      {/* Subtle Background Glow Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-gradient-to-b from-blue-100/40 via-indigo-100/20 to-transparent blur-3xl pointer-events-none rounded-full" />
      
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1E88E5]/10 border border-[#1E88E5]/20 text-[#1E88E5] text-xs font-black tracking-widest uppercase mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E88E5] animate-pulse" />
            {s.howWeWorkSubtitle || "UNSER VORGEHEN & PROZESS"}
          </div>

          <h2 className="text-[30px] sm:text-[40px] md:text-[48px] font-black text-[#0f172a] tracking-tight leading-[1.12]">
            <span className="section-title-hash text-[#E63946]">#</span> {s.howWeWorkTitle || "Angebot in 4 Schritten einholen"}
          </h2>

          <p className="mt-4 text-[15px] sm:text-[17px] text-[#64748b] font-normal leading-relaxed">
            Transparenz, Schweizer Präzision und persönliche Betreuung von der ersten Bedarfsanalyse bis zur fertigen IT-Lösung.
          </p>

          {/* Trust Pillars Bar */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-xs font-semibold text-[#334155]">
            {TRUST_PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div key={i} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-sm hover:border-[#1E88E5]/40 transition-colors">
                  <Icon size={14} className="text-[#1E88E5]" />
                  <span>{p.text}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4 Process Steps Layout */}
        <div className="relative mb-16 sm:mb-20">
          
          {/* Connecting Track Line on Desktop (>= lg) */}
          <div className="hidden lg:block absolute top-[46px] left-[10%] right-[10%] h-[2px] bg-gradient-to-r from-[#1E88E5]/20 via-[#6366F1]/30 to-[#E63946]/25 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-7 relative z-10">
            {PROCESS_STEPS.map((step) => {
              const Icon = step.icon;
              return (
                <div
                  key={step.stepNumber}
                  className={`group relative bg-white rounded-2xl p-6 sm:p-7 border border-slate-200/90 shadow-[0_4px_20px_rgba(15,23,42,0.04)] hover:shadow-[0_18px_38px_rgba(15,23,42,0.09)] ${step.accentBorder} hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
                >
                  {/* Top Bar: Icon + Step Number */}
                  <div>
                    <div className="flex items-center justify-between gap-4 mb-6">
                      <div className={`w-14 h-14 rounded-2xl ${step.accentBg} flex items-center justify-center border border-white shadow-sm transition-transform duration-300 group-hover:scale-110 ${step.badgeGlow}`}>
                        <Icon size={26} style={{ color: step.accentColor }} strokeWidth={2} />
                      </div>
                      <span className="text-[34px] sm:text-[40px] font-black tracking-tighter text-slate-200 group-hover:text-[#0f172a] transition-colors duration-300 select-none">
                        {step.stepNumber}
                      </span>
                    </div>

                    {/* Step Tag */}
                    <div className="inline-block text-[10.5px] font-black tracking-wider uppercase mb-2" style={{ color: step.accentColor }}>
                      {step.tag}
                    </div>

                    {/* Title */}
                    <h3 className="text-[19px] sm:text-[20px] font-bold text-[#0f172a] tracking-tight mb-3 group-hover:text-[#1E88E5] transition-colors">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[13.5px] sm:text-[14px] text-[#64748b] leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  {/* Micro-Features / Highlights */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex flex-wrap gap-1.5">
                    {step.highlights.map((h, hIdx) => (
                      <span
                        key={hIdx}
                        className="text-[11px] font-medium px-2.5 py-0.5 rounded-md bg-slate-50 text-[#475569] border border-slate-200/60"
                      >
                        {h}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* High-End Interactive CTA Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#090d16] via-[#0f172a] to-[#1e293b] p-8 sm:p-12 md:p-14 text-white overflow-hidden shadow-2xl border border-white/10">
          {/* Subtle Ambient Lighting */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E88E5]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E63946]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 text-center lg:text-left">
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Unverbindlich & Kostenfrei
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Lassen Sie uns Ihr Projekt besprechen.
              </h3>
              <p className="text-white/75 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Erzählen Sie uns kurz von Ihrem Vorhaben. Wir prüfen Ihre Anforderungen persönlich und entwickeln daraus den passenden nächsten Schritt.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => openQuote()}
                data-testid="how-we-work-quote-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#E63946] to-[#d62839] hover:from-[#d62839] hover:to-[#b71c2a] text-white font-extrabold text-base shadow-[0_10px_25px_rgba(230,57,70,0.4)] hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Projekt besprechen</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={openContact}
                data-testid="how-we-work-contact-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base transition-colors"
              >
                <MessageSquare size={18} className="text-[#1E88E5]" />
                <span>Kontakt aufnehmen</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
