import React, { useState, useEffect } from "react";
import { 
  Sparkles, 
  ArrowRight, 
  Send, 
  FileText, 
  MessageSquareQuote,
  X,
  ChevronRight
} from "lucide-react";
import { useModals } from "../contexts/ModalContext";

/**
 * FloatingCTA
 * Inspired by modern high-converting agency CTA mechanics (e.g., webtasarimsistemleri.com)
 * Crafted specifically for REDWORK.CH:
 * - Swiss tech styling: Cyber dark glassmorphism, ruby red (#E63946) & electric blue (#1E88E5) accents
 * - Harmonic floating & pulse animation with magnetic hover reaction
 * - Badge highlighting "2026: DAS JAHR DER DIGITALEN INNOVATION"
 * - Instant connection to existing openQuote() wizard and openContact() modal
 * - Fully responsive: sleek interactive widget on Desktop/Tablet, non-intrusive floating pill on Mobile
 * - Accessibility: prefers-reduced-motion compatible
 */
export default function FloatingCTA() {
  const { openQuote, openContact } = useModals();
  const [isVisible, setIsVisible] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Show after slight scroll or small initial delay so hero is cleanly appreciated first
    const handleScroll = () => {
      if (window.scrollY > 220) {
        setIsVisible(true);
      }
    };
    // Also show after 3.5s automatically if user stays on top
    const timer = setTimeout(() => setIsVisible(true), 3200);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <aside 
      className="fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 select-none transition-all duration-500 pointer-events-auto"
      aria-label="Schnellangebot und Projektberatung"
    >
      {isMinimized ? (
        /* Minimized State Floating Pill */
        <button
          onClick={() => setIsMinimized(false)}
          className="group flex items-center gap-2 bg-[#090d16]/90 hover:bg-[#0f172a] backdrop-blur-xl border border-white/20 px-3.5 py-3 rounded-full shadow-[0_12px_35px_rgba(0,0,0,0.5)] text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer animate-subtle-float"
          aria-label="Angebot-Assistent öffnen"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#E63946] opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#E63946]" />
          </span>
          <span className="text-xs font-black tracking-wider uppercase text-white/95">
            Angebot <span className="text-[#FFC107]">2026</span>
          </span>
          <ChevronRight size={14} className="text-white/60 group-hover:translate-x-0.5 transition-transform" />
        </button>
      ) : (
        /* Full Premium Agency Interactive Floating Card */
        <div className="relative group w-[220px] sm:w-[250px] rounded-3xl bg-gradient-to-b from-[#090d16]/95 via-[#0d1322]/95 to-[#11192e]/95 backdrop-blur-2xl border border-white/15 p-4 sm:p-5 shadow-[0_20px_50px_rgba(0,0,0,0.65)] hover:shadow-[0_25px_60px_rgba(230,57,70,0.25)] hover:border-[#E63946]/40 transition-all duration-300 animate-subtle-float">
          
          {/* Subtle Cyber Glowing Background Orbs */}
          <div className="absolute -top-10 -right-10 w-24 h-24 bg-[#E63946]/20 rounded-full blur-2xl pointer-events-none group-hover:bg-[#E63946]/35 transition-colors" />
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-[#1E88E5]/20 rounded-full blur-2xl pointer-events-none group-hover:bg-[#1E88E5]/35 transition-colors" />

          {/* Close/Minimize Button */}
          <button
            onClick={() => setIsMinimized(true)}
            className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full bg-white/5 hover:bg-white/15 text-white/50 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Panel minimieren"
          >
            <X size={12} />
          </button>

          {/* Innovation Year Badge */}
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#E63946]/15 border border-[#E63946]/30 text-[#FFC107] text-[10px] font-black uppercase tracking-wider mb-3">
            <Sparkles size={11} className="text-[#FFC107] animate-spin-slow" />
            <span>2026 INOVATION</span>
          </div>

          {/* Eye-catching Heading */}
          <h4 className="text-[14px] sm:text-[15px] font-extrabold text-white leading-tight mb-1 tracking-tight">
            Projekt im Sinn?
          </h4>
          <p className="text-[11.5px] sm:text-[12px] text-white/70 leading-relaxed mb-4">
            Erhalten Sie Ihr unverbindliches Richtangebot in 2 Minuten.
          </p>

          {/* Main Action Button - Angebot */}
          <button
            onClick={() => openQuote()}
            className="group/btn relative w-full overflow-hidden rounded-2xl bg-gradient-to-r from-[#E63946] via-[#f72585] to-[#ff6b35] p-[1px] shadow-[0_8px_20px_rgba(230,57,70,0.35)] hover:shadow-[0_12px_28px_rgba(230,57,70,0.55)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] cursor-pointer mb-2.5"
          >
            <div className="relative flex items-center justify-between px-3.5 py-2.5 rounded-[15px] bg-[#0c101a] group-hover/btn:bg-transparent transition-colors">
              <span className="flex items-center gap-2 text-[12.5px] sm:text-[13px] font-black text-white">
                <FileText size={15} className="text-[#FFC107]" />
                <span>Teklif Alın / Angebot</span>
              </span>
              <ArrowRight size={14} className="text-white group-hover/btn:translate-x-1 transition-transform" />
            </div>
          </button>

          {/* Secondary Action - Bize Yazın / Kontakt */}
          <button
            onClick={openContact}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] border border-white/10 text-white/80 hover:text-white text-[11.5px] font-bold transition-all cursor-pointer"
          >
            <MessageSquareQuote size={13} className="text-[#1E88E5]" />
            <span>Bize Yazın / Kontakt</span>
          </button>

          {/* Trust Micro-Tag */}
          <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[9.5px] text-white/50 font-medium">
            <span>🇨🇭 100% Swiss Quality</span>
            <span className="text-emerald-400">● 24/7 Antwort</span>
          </div>

        </div>
      )}
    </aside>
  );
}
