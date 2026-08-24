import React, { useEffect, useState, useMemo } from "react";
import { ChevronsDown, ShieldCheck } from "lucide-react";
import { useModals } from "../contexts/ModalContext";
import { API } from "../api";

function MatrixBg() {
  const cols = useMemo(() => {
    const arr = [];
    const chars = "アイウエオカキクケコサシスセソ0123456789ABCDEF";
    for (let i = 0; i < 40; i++) {
      let s = "";
      for (let j = 0; j < 28; j++) s += chars[Math.floor(Math.random() * chars.length)];
      arr.push({
        id: `mc-${i}`,
        text: s,
        left: `${(i / 40) * 100 + Math.random() * 2}%`,
        duration: 8 + Math.random() * 12,
        delay: -Math.random() * 10,
      });
    }
    return arr;
  }, []);

  return (
    <div className="matrix-bg pointer-events-none">
      {cols.map((c) => (
        <div
          key={c.id}
          className="matrix-column"
          style={{
            left: c.left,
            animationDuration: `${c.duration}s`,
            animationDelay: `${c.delay}s`,
          }}
        >
          {c.text}
        </div>
      ))}
    </div>
  );
}

// Renders text with <y>...</y> markers turned into yellow spans (safe, no HTML eval).
function renderRich(text) {
  if (!text) return null;
  const parts = String(text).split(/(<y>.*?<\/y>|<b>.*?<\/b>|\n)/g);
  return parts.map((p, i) => {
    if (p === "\n") return <br key={i} className="hidden md:block" />;
    const y = p.match(/^<y>(.*?)<\/y>$/);
    if (y) return <span key={i} className="text-[#FFC107] font-semibold">{y[1]}</span>;
    const b = p.match(/^<b>(.*?)<\/b>$/);
    if (b) return <b key={i}>{b[1]}</b>;
    return <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

const FALLBACK = {
  heroSlides: [
    { highlight: "Unternehmens", word: "Webdesign" },
    { highlight: "E-Commerce", word: "Webdesign" },
    { highlight: "Persönliches", word: "Webdesign" },
    { highlight: "Produkt", word: "Webdesign" },
    { highlight: "Reise", word: "Webdesign" },
    { highlight: "Stiftung", word: "Webdesign" },
  ],
  heroSubtitle: "Mit der <y>preisgekrönten</y> Webdesign- und Software-Agentur entdecken Sie\ndie <y>Weltklasse-Standards</y> auf Ihrer Website!",
  heroTagline: "Wir sind anders, seien Sie auch anders.",
  badgeEnabled: true,
  badgeNumber: "12",
  badgeUnit: "MONATE",
  badgeText1: "kostenloser",
  badgeText2: "Support",
  badgeFooter1: "für unsere Kunden",
  badgeFooter2: "inklusive!",
  btnContactSmall: "Fragen Sie uns ?",
  btnContactLarge: "Schreiben Sie uns",
  btnQuoteSmall: "Haben Sie ein Projekt ?",
  btnQuoteLarge: "Angebot einholen",
  partners: [
    "SCHWEIZER INFORMATIK & IT-ENGINEERING",
    "FULL-STACK WEBENTWICKLUNG",
    "CLOUD & INFRASTRUKTUR",
    "CYBERSECURITY & DSGVO",
    "INDIVIDUELLE SOFTWARE",
  ],
  ratingStars: "SYSTEM-STATUS AKTIV",
  ratingText: "<b>100% Schweizer Hosting</b> & 24/7 IT-Monitoring",
};

export default function Hero() {
  const [idx, setIdx] = useState(0);
  const [s, setS] = useState(FALLBACK);
  const { openQuote, openContact } = useModals();

  useEffect(() => {
    fetch(`${API}/site-settings`)
      .then((r) => r.json())
      .then((d) => setS({ ...FALLBACK, ...d }))
      .catch(() => {});
  }, []);

  const slides = s.heroSlides && s.heroSlides.length ? s.heroSlides : FALLBACK.heroSlides;

  useEffect(() => {
    if (slides.length <= 1) return;
    const id = setInterval(() => setIdx((i) => (i + 1) % slides.length), 3500);
    return () => clearInterval(id);
  }, [slides.length]);

  const slide = slides[idx % slides.length];

  return (
    <section id="top" className="relative min-h-[84vh] sm:min-h-[88vh] bg-[#020617] overflow-hidden flex items-center justify-center pt-24 sm:pt-28 md:pt-32 pb-16 sm:pb-20">
      <MatrixBg />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 pointer-events-none" />

      {/* Support Badge (Directly anchored to section top-right, perfectly positioned near top of hero) */}
      {s.badgeEnabled && (
        <div className="absolute top-20 sm:top-24 md:top-20 lg:top-22 xl:top-26 right-3 xs:right-4 sm:right-6 md:right-6 lg:right-10 xl:right-16 2xl:right-20 z-20 pointer-events-none">
          <div className="relative pointer-events-auto">
            <div className="absolute inset-0 bg-[#E63946] rounded-full blur-2xl opacity-30 animate-pulse" />
            <div className="relative w-24 h-24 xs:w-26 xs:h-26 sm:w-28 sm:h-28 md:w-52 md:h-52 lg:w-60 lg:h-60 xl:w-56 xl:h-56 2xl:w-60 2xl:h-60 rounded-full bg-gradient-to-br from-[#E63946] to-[#a8202e] border-2 border-white/20 flex flex-col items-center justify-center text-center text-white px-2 xs:px-2.5 sm:px-3 md:px-5 lg:px-6 shadow-2xl transition-transform duration-300 hover:scale-105 select-none">
              <ShieldCheck className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 md:w-7 md:h-7 lg:w-8 lg:h-8 text-[#FFC107] mb-0.5" />
              <div className="text-[#FFC107] font-extrabold text-[17px] xs:text-[19px] sm:text-[21px] md:text-[34px] lg:text-[38px] xl:text-[36px] leading-none">{s.badgeNumber}</div>
              <div className="text-[7.5px] xs:text-[8px] sm:text-[9px] md:text-[12.5px] lg:text-[14px] xl:text-[13px] font-bold tracking-wider mt-0.5 sm:mt-1">{s.badgeUnit}</div>
              <div className="text-[7.5px] xs:text-[8px] sm:text-[9px] md:text-[13px] lg:text-[15px] xl:text-[14px] font-semibold mt-0.5 sm:mt-1 leading-tight">
                {s.badgeText1}
                <br />
                <span className="text-[#FFC107] font-bold">{s.badgeText2}</span>
              </div>
              <div className="text-[6.5px] xs:text-[7px] sm:text-[8px] md:text-[11px] lg:text-[12.5px] xl:text-[12px] mt-0.5 sm:mt-1 opacity-80 leading-none">{s.badgeFooter1}</div>
              <div className="text-[6.5px] xs:text-[7px] sm:text-[8px] md:text-[11px] lg:text-[12.5px] xl:text-[12px] mt-0.5 opacity-90 font-bold leading-none">{s.badgeFooter2}</div>
            </div>
          </div>
        </div>
      )}

      {/* Main Slider Content Block (Shifted down on mobile with mt-20 sm:mt-24, untouched on md+) */}
      <div className="relative z-30 text-center max-w-2xl md:max-w-[480px] lg:max-w-[620px] xl:max-w-[780px] 2xl:max-w-5xl mx-auto w-full px-4 sm:px-6 mt-20 sm:mt-24 md:mt-0">
        <div className="flex items-center justify-center">
          <h1 key={idx} className="fade-in text-[34px] sm:text-[46px] md:text-[56px] lg:text-[66px] xl:text-[72px] 2xl:text-[80px] font-extrabold tracking-tight text-balance leading-[1.08]">
            <span className="text-[#1E88E5]">{slide.highlight}</span>
            <span className="text-white"> {slide.word}</span>
          </h1>
        </div>

        <p className="text-white/85 text-[16px] sm:text-[18px] md:text-[20px] lg:text-[21px] xl:text-[22px] mt-4 sm:mt-5 md:mt-6 leading-relaxed md:leading-[1.6] max-w-2xl lg:max-w-3xl mx-auto px-2">
          {renderRich(s.heroSubtitle)}
        </p>
        {s.heroTagline && (
          <p className="text-[#FFC107] font-semibold text-[15px] sm:text-[17px] md:text-[19px] lg:text-[20px] mt-2.5 md:mt-3">
            {s.heroTagline}
          </p>
        )}

        <div className="mt-7 sm:mt-9 md:mt-10 flex flex-col sm:flex-row gap-3.5 sm:gap-5 md:gap-6 justify-center items-center relative z-30">
          <button onClick={openContact} data-testid="hero-contact-btn" className="btn-cta btn-red w-full sm:w-auto relative z-30 py-3.5 px-7 md:px-9">
            <span className="text-[13px] md:text-[14px] font-normal opacity-90">{s.btnContactSmall}</span>
            <span className="text-[18px] sm:text-[20px] md:text-[22px] font-bold">{s.btnContactLarge}</span>
          </button>
          <button onClick={() => openQuote()} data-testid="hero-quote-btn" className="btn-cta btn-blue w-full sm:w-auto relative z-30 py-3.5 px-7 md:px-9">
            <span className="text-[13px] md:text-[14px] font-normal opacity-90">{s.btnQuoteSmall}</span>
            <span className="text-[18px] sm:text-[20px] md:text-[22px] font-bold">{s.btnQuoteLarge}</span>
          </button>
        </div>
      </div>

      <div
        className="hidden sm:block absolute bottom-14 sm:bottom-16 left-1/2 -translate-x-1/2 z-10 text-white/70 bouncing-arrow cursor-pointer"
        onClick={() => document.getElementById("stats")?.scrollIntoView({ behavior: "smooth" })}
        aria-label="Nach unten scrollen"
      >
        <ChevronsDown size={36} />
      </div>

      {/* IT & Informatik Competencies & Ratings Bottom Bar */}
      <div className="absolute bottom-0 left-0 right-0 bg-[#020617]/95 backdrop-blur-md py-2.5 sm:py-3.5 px-3 sm:px-6 lg:px-8 z-10 border-t border-white/10">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5 sm:gap-4 text-white text-xs">
          <div className="flex items-center justify-center md:justify-start gap-2 sm:gap-3 lg:gap-5 flex-wrap">
            {(s.partners || []).map((p, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 font-bold text-[9px] sm:text-[10px] md:text-[10.5px] lg:text-[11px] tracking-wider text-slate-300 hover:text-white transition-colors">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E88E5] shrink-0 shadow-[0_0_6px_rgba(30,136,229,0.8)]" />
                {p}
              </span>
            ))}
          </div>
          {s.ratingText && (
            <div className="flex items-center gap-2.5 bg-emerald-950/40 border border-emerald-500/30 px-3.5 py-1.5 rounded-full shrink-0 shadow-sm backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-bold text-[10px] sm:text-[11px] tracking-wider uppercase">
                {s.ratingStars || "SYSTEM-STATUS"}
              </span>
              <span className="text-white/30 text-xs hidden sm:inline">•</span>
              <span className="text-white/95 text-[10.5px] sm:text-[11.5px] font-medium">{renderRich(s.ratingText)}</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
