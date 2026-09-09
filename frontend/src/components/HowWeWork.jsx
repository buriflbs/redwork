import React, { useEffect, useState, useRef } from "react";
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
  Users,
  Palette,
  Code2,
  Smartphone,
  Gauge,
  Search,
  Globe2,
  Rocket
} from "lucide-react";
import { useModals } from "../contexts/ModalContext";
import api from "../api";

/**
 * 6 Realistic Swiss Engineering Process Steps
 */
const PROCESS_STEPS = [
  {
    stepNumber: "01",
    tag: "ANALYSE & BEDARF",
    title: "Analyse & Beratung",
    desc: "Gründliche Erfassung Ihrer Vision, Geschäftsziele und technischen Zielarchitektur. Sie erhalten eine fundierte Machbarkeitsberatung.",
    highlights: ["Bedarfsanalyse", "Zieldefinition", "Tech-Scoping"],
    icon: FileSearch,
    accentColor: "#1E88E5",
    accentBg: "bg-blue-500/10",
    accentBorder: "border-blue-500/40",
    badgeGlow: "shadow-[0_0_30px_rgba(30,136,229,0.3)]",
  },
  {
    stepNumber: "02",
    tag: "KONZEPT & STRUKTUR",
    title: "Strategie & UX-Konzept",
    desc: "Strukturierung der User Journey, Wireframes und technische Spezifikation für maximale Konversionskraft und intuitive Bedienung.",
    highlights: ["Informationsarchitektur", "UI/UX Konzept", "Performance-Plan"],
    icon: Cpu,
    accentColor: "#6366F1",
    accentBg: "bg-indigo-500/10",
    accentBorder: "border-indigo-500/40",
    badgeGlow: "shadow-[0_0_30px_rgba(99,102,241,0.3)]",
  },
  {
    stepNumber: "03",
    tag: "DESIGN & IDENTITÄT",
    title: "Premium Webdesign",
    desc: "Modernes, unverwechselbares Corporate Design, das Ihre Marke auf Weltklasse-Niveau repräsentiert und emotional begeistert.",
    highlights: ["Unikates Design", "Corporate Identity", "Interaktive Prototypen"],
    icon: Palette,
    accentColor: "#EC4899",
    accentBg: "bg-pink-500/10",
    accentBorder: "border-pink-500/40",
    badgeGlow: "shadow-[0_0_30px_rgba(236,72,153,0.3)]",
  },
  {
    stepNumber: "04",
    tag: "ENTWICKLUNG & CODE",
    title: "Präzise Entwicklung",
    desc: "Sauberer, moderner Code mit React, Node und modernen Schweizer Hosting-Standards. Schnell, sicher, modular und zukunftssicher.",
    highlights: ["Clean Code", "100% Responsive", "API-Integration"],
    icon: Code2,
    accentColor: "#059669",
    accentBg: "bg-emerald-500/10",
    accentBorder: "border-emerald-500/40",
    badgeGlow: "shadow-[0_0_30px_rgba(5,150,105,0.3)]",
  },
  {
    stepNumber: "05",
    tag: "OPTIMIERUNG & SEO",
    title: "Qualität & SEO-Feinschliff",
    desc: "Umfassende Performance-Audits, Speed-Optimierung (Lighthouse 95+), DSGVO-Konformität und Google-Sichtbarkeitsoptimierung.",
    highlights: ["Speed-Audit", "Mobile Check", "Suchmaschinen-Optimierung"],
    icon: Search,
    accentColor: "#F59E0B",
    accentBg: "bg-amber-500/10",
    accentBorder: "border-amber-500/40",
    badgeGlow: "shadow-[0_0_30px_rgba(245,158,11,0.3)]",
  },
  {
    stepNumber: "06",
    tag: "LAUNCH & SUPPORT",
    title: "Go-Live & Betreuung",
    desc: "Sicherer Launch auf hochverfügbaren Servern inklusive 12 Monaten persönlicher Schweizer Support-Garantie für Ihr Unternehmen.",
    highlights: ["Zero-Downtime Launch", "12 Monate Support", "Persönlicher Ansprechpartner"],
    icon: Rocket,
    accentColor: "#E63946",
    accentBg: "bg-red-500/10",
    accentBorder: "border-red-500/40",
    badgeGlow: "shadow-[0_0_30px_rgba(230,57,70,0.3)]",
  },
];

/**
 * 6 Core Project Pillars & Standards
 * High-end Swiss quality standards for REDWORK.CH
 */
const PROJECT_PILLARS = [
  {
    icon: Palette,
    title: "Individuelles Design",
    desc: "Einzigartige, markengerechte Gestaltung abseits standardisierter Vorlagen mit unverwechselbarem Auftritt.",
    color: "text-[#1E88E5]",
    bg: "bg-blue-500/10",
  },
  {
    icon: Smartphone,
    title: "Vollständige Mobile-Kompatibilität",
    desc: "Perfekt optimiertes Responsive-Layout für iPhone, iPad, Android und Desktop-Geräte.",
    color: "text-[#059669]",
    bg: "bg-emerald-500/10",
  },
  {
    icon: Code2,
    title: "Saubere Code-Architektur",
    desc: "Moderne, wartungsarme und standardkonforme Softwareentwicklung ohne überflüssigen Ballast.",
    color: "text-[#6366F1]",
    bg: "bg-indigo-500/10",
  },
  {
    icon: Gauge,
    title: "Maximale Ladegeschwindigkeit",
    desc: "Modernste Web-Infrastruktur und Komprimierungsmethoden für rasanten Seitenaufbau unter 1 Sekunde.",
    color: "text-[#E63946]",
    bg: "bg-red-500/10",
  },
  {
    icon: ShieldCheck,
    title: "Schweizer Webstandards",
    desc: "Alle Entwicklungs-, Infrastruktur- und Sicherheitsphasen entsprechen modernsten Qualitätsrichtlinien.",
    color: "text-[#F59E0B]",
    bg: "bg-amber-500/10",
  },
  {
    icon: Search,
    title: "Gezielte SEO-Wirkung",
    desc: "Suchmaschinenoptimierung direkt im Fundament verankert für messbare organische Google-Sichtbarkeit.",
    color: "text-[#0284C7]",
    bg: "bg-sky-500/10",
  },
];

export default function HowWeWork() {
  const { openQuote, openContact } = useModals();
  const [activeStep, setActiveStep] = useState(0);
  const [s, setS] = useState({
    howWeWorkTitle: "Wie wir arbeiten – Unser Prozess",
    howWeWorkSubtitle: "VOM KONZEPT ZUR DIGITALEN SPITZENLEISTUNG",
  });

  const sectionRef = useRef(null);

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

  // Automatic gentle progressive advance if user hasn't clicked
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((curr) => (curr + 1) % PROCESS_STEPS.length);
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  return (
    <section 
      id="prozess" 
      ref={sectionRef} 
      className="relative py-24 sm:py-32 bg-[#f8fafc] overflow-hidden border-t border-slate-200/80"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-blue-100/40 via-indigo-100/20 to-transparent blur-3xl pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-[500px] h-[300px] bg-red-100/30 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#1E88E5]/10 border border-[#1E88E5]/20 text-[#1E88E5] text-xs font-black tracking-widest uppercase mb-4 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#1E88E5] animate-ping" />
            {s.howWeWorkSubtitle || "VOM KONZEPT ZUR DIGITALEN SPITZENLEISTUNG"}
          </div>

          <h2 className="text-[32px] sm:text-[42px] md:text-[50px] font-black text-[#0f172a] tracking-tight leading-[1.12]">
            <span className="section-title-hash text-[#E63946]">#</span> {s.howWeWorkTitle || "Wie wir arbeiten"}
          </h2>

          <p className="mt-4 text-[15px] sm:text-[17.5px] text-[#64748b] font-normal leading-relaxed">
            Schweizer Präzision, transparente Meilensteine und modernste Code-Standards – von der ersten Analyse bis zur skalierbaren Plattform.
          </p>

          {/* Interactive Step Switcher Navigation */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl bg-white/80 backdrop-blur-md border border-slate-200 shadow-sm max-w-2xl mx-auto">
            {PROCESS_STEPS.map((step, idx) => (
              <button
                key={step.stepNumber}
                onClick={() => setActiveStep(idx)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-300 flex items-center gap-1.5 cursor-pointer ${
                  activeStep === idx
                    ? "bg-[#0f172a] text-white shadow-md scale-105"
                    : "text-slate-600 hover:text-[#0f172a] hover:bg-slate-100"
                }`}
              >
                <span className="font-mono text-[11px] opacity-75">{step.stepNumber}</span>
                <span className="hidden sm:inline">{step.tag.split(" ")[0]}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 6 Step Cards with Interactive Highlighting & Progress Track */}
        <div className="relative mb-20 sm:mb-28">
          
          {/* Connecting Progress Track Line */}
          <div className="hidden xl:block absolute top-[44px] left-[6%] right-[6%] h-[2px] bg-slate-200 -z-0">
            <div 
              className="h-full bg-gradient-to-r from-[#1E88E5] via-[#EC4899] to-[#E63946] transition-all duration-700 ease-out"
              style={{ width: `${((activeStep + 1) / PROCESS_STEPS.length) * 100}%` }}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-6 gap-5 sm:gap-6 relative z-10">
            {PROCESS_STEPS.map((step, idx) => {
              const Icon = step.icon;
              const isActive = activeStep === idx;
              return (
                <div
                  key={step.stepNumber}
                  onClick={() => setActiveStep(idx)}
                  className={`cursor-pointer group relative bg-white rounded-3xl p-5 sm:p-6 border transition-all duration-500 flex flex-col justify-between select-none ${
                    isActive
                      ? `border-2 ${step.accentBorder} shadow-[0_20px_45px_rgba(15,23,42,0.12)] -translate-y-2 scale-[1.02] ring-4 ring-blue-500/10`
                      : "border-slate-200/90 shadow-[0_4px_18px_rgba(15,23,42,0.03)] hover:border-slate-300 hover:-translate-y-1 opacity-80 hover:opacity-100"
                  }`}
                >
                  {/* Top Bar: Icon + Step Number */}
                  <div>
                    <div className="flex items-center justify-between gap-3 mb-5">
                      <div className={`w-12 h-12 rounded-2xl ${step.accentBg} flex items-center justify-center border border-white/60 shadow-sm transition-transform duration-300 ${isActive ? "scale-110 shadow-lg" : "group-hover:scale-105"}`}>
                        <Icon size={22} style={{ color: step.accentColor }} strokeWidth={2.2} />
                      </div>
                      <span className={`text-[28px] sm:text-[32px] font-black font-mono tracking-tighter transition-colors duration-300 ${isActive ? "text-[#0f172a]" : "text-slate-200 group-hover:text-slate-400"}`}>
                        {step.stepNumber}
                      </span>
                    </div>

                    {/* Step Tag */}
                    <div className="inline-block text-[10px] font-black tracking-wider uppercase mb-1.5" style={{ color: step.accentColor }}>
                      {step.tag}
                    </div>

                    {/* Title */}
                    <h3 className="text-[17px] sm:text-[18px] font-bold text-[#0f172a] tracking-tight mb-2.5">
                      {step.title}
                    </h3>

                    {/* Description */}
                    <p className="text-[13px] text-[#64748b] leading-relaxed font-normal">
                      {step.desc}
                    </p>
                  </div>

                  {/* Highlights Tags */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex flex-wrap gap-1">
                    {step.highlights.map((h, hIdx) => (
                      <span
                        key={hIdx}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-md transition-colors ${
                          isActive
                            ? "bg-slate-900 text-white"
                            : "bg-slate-50 text-[#475569] border border-slate-200/60"
                        }`}
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

        {/* 6 High-Impact Project Excellence Pillars */}
        <div className="mb-20 sm:mb-28">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <div className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#E63946] mb-2">
              <Sparkles size={14} />
              <span>PROJEKT-STANDARDS & QUALITÄTSMERKMALE</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-[#0f172a] tracking-tight">
              Was jede REDWORK-Lösung auszeichnet
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECT_PILLARS.map((p, i) => {
              const Icon = p.icon;
              return (
                <div
                  key={i}
                  className="group relative bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(15,23,42,0.08)] hover:border-[#1E88E5]/30 transition-all duration-300 flex items-start gap-4"
                >
                  <div className={`w-12 h-12 rounded-2xl ${p.bg} ${p.color} flex items-center justify-center shrink-0 border border-white shadow-sm group-hover:scale-110 transition-transform`}>
                    <Icon size={24} strokeWidth={2.2} />
                  </div>
                  <div>
                    <h4 className="text-[17px] font-bold text-[#0f172a] mb-1.5 group-hover:text-[#1E88E5] transition-colors">
                      {p.title}
                    </h4>
                    <p className="text-[13.5px] text-[#64748b] leading-relaxed">
                      {p.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Premium Interactive CTA Banner */}
        <div className="relative rounded-3xl bg-gradient-to-br from-[#07090f] via-[#0d1322] to-[#1e293b] p-8 sm:p-12 md:p-14 text-white overflow-hidden shadow-2xl border border-white/10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E88E5]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#E63946]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-4xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-8 sm:gap-10 text-center lg:text-left">
            <div className="flex-1 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Unverbindlich & Kostenfrei
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white">
                Bereit für den nächsten digitalen Meilenstein?
              </h3>
              <p className="text-white/75 text-sm sm:text-base leading-relaxed max-w-2xl font-normal">
                Schildern Sie uns unverbindlich Ihre Vision. Wir erarbeiten innerhalb von 24 Stunden einen präzisen, transparenten Lösungsvorschlag.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 shrink-0 w-full sm:w-auto">
              <button
                onClick={() => openQuote()}
                data-testid="how-we-work-quote-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-xl bg-gradient-to-r from-[#E63946] via-[#f72585] to-[#ff6b35] hover:from-[#d62839] hover:to-[#b71c2a] text-white font-extrabold text-base shadow-[0_10px_25px_rgba(230,57,70,0.4)] hover:scale-[1.03] active:scale-[0.98] transition-all cursor-pointer"
              >
                <span>Projekt besprechen</span>
                <ArrowRight size={18} />
              </button>

              <button
                onClick={openContact}
                data-testid="how-we-work-contact-btn"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-base transition-colors cursor-pointer"
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
