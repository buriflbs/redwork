import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import api from "../api";
import { useModals } from "../contexts/ModalContext";
import {
  Laptop,
  Search,
  Sparkles,
  Code2,
  TrendingUp,
  Users2,
  Smartphone,
  Globe,
  ShoppingBag,
  Zap,
  Shield,
  Layers,
  Database,
  Cloud,
  Mail,
  Palette,
  CheckCircle2,
  BarChart3,
  Award,
  Cpu,
  Monitor,
  MessageSquare,
  Lock,
  Compass,
  FileCode,
  Gauge,
  Workflow,
  MousePointerClick
} from "lucide-react";

// Default 6 Services exactly matching the user specification and German text
const DEFAULT_SERVICES = [
  {
    id: "service-webdesign",
    side: "left",
    iconKey: "webdesign",
    title: "Webdesign",
    desc: "Moderne, responsive und benutzerfreundliche Websites, die nicht nur professionell aussehen, sondern auch technisch überzeugen. Wir entwickeln individuelle Weblösungen mit Fokus auf Performance, Benutzerfreundlichkeit und einer starken digitalen Präsenz.",
  },
  {
    id: "service-seo",
    side: "left",
    iconKey: "seo",
    title: "SEO & Online-Sichtbarkeit",
    desc: "Wir optimieren Websites für Suchmaschinen und verbessern ihre Sichtbarkeit bei Google. Von der technischen Optimierung bis hin zu strukturierten Inhalten schaffen wir die Grundlage für nachhaltigen organischen Erfolg.",
  },
  {
    id: "service-branding",
    side: "left",
    iconKey: "branding",
    title: "Branding & Corporate Design",
    desc: "Wir entwickeln starke Markenauftritte mit individuellem Logo, Corporate Design und visueller Identität. Ziel ist ein professionelles, modernes und wiedererkennbares Erscheinungsbild.",
  },
  {
    id: "service-software",
    side: "right",
    iconKey: "software",
    title: "Softwareentwicklung",
    desc: "Individuelle Softwarelösungen für Unternehmen und digitale Projekte. Von Webanwendungen und individuellen Systemen bis hin zu komplexen Plattformen entwickeln wir zuverlässige und skalierbare Lösungen.",
  },
  {
    id: "service-marketing",
    side: "right",
    iconKey: "marketing",
    title: "Online-Marketing",
    desc: "Gezielte Online-Marketing-Strategien für mehr Reichweite, Sichtbarkeit und Kunden. Wir unterstützen bei Google Ads, Social Media und weiteren digitalen Marketingmaßnahmen.",
  },
  {
    id: "service-consulting",
    side: "right",
    iconKey: "consulting",
    title: "IT-Beratung",
    desc: "Professionelle Beratung und zuverlässige Unterstützung bei digitalen Projekten. Wir analysieren Anforderungen, entwickeln passende Lösungen und begleiten unsere Kunden bei der technischen Umsetzung.",
  },
];

// Rich illustrative vector badges for the 6 primary services
function ServiceBadgeIcon({ type, className = "w-7 h-7" }) {
  switch (type) {
    case "webdesign":
      return (
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-blue-500/10 to-indigo-500/20 text-[#1E88E5]">
          <Monitor className={className} strokeWidth={2.2} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#E63946] rounded-full ring-2 ring-white" />
        </div>
      );
    case "seo":
      return (
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/20 text-[#f97316]">
          <Search className={className} strokeWidth={2.2} />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#10b981] rounded-full ring-2 ring-white" />
        </div>
      );
    case "branding":
      return (
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500/10 to-pink-500/20 text-[#8b5cf6]">
          <Palette className={className} strokeWidth={2.2} />
          <Sparkles className="absolute -top-1 -left-1 w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        </div>
      );
    case "software":
      return (
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/10 to-teal-500/20 text-[#059669]">
          <Code2 className={className} strokeWidth={2.2} />
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#3b82f6] rounded-full ring-2 ring-white" />
        </div>
      );
    case "marketing":
      return (
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-rose-500/10 to-red-500/20 text-[#E63946]">
          <TrendingUp className={className} strokeWidth={2.2} />
          <Zap className="absolute -top-1 -left-1 w-3.5 h-3.5 text-amber-500 fill-amber-500" />
        </div>
      );
    case "consulting":
      return (
        <div className="relative flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500/10 to-cyan-500/20 text-[#0284c7]">
          <Users2 className={className} strokeWidth={2.2} />
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#8b5cf6] rounded-full ring-2 ring-white" />
        </div>
      );
    default:
      return (
        <div className="flex items-center justify-center w-10 h-10 rounded-2xl bg-slate-100 text-slate-700">
          <Zap className={className} />
        </div>
      );
  }
}

// 24 Colorful Modern Digital App Icons for Smartphone Screen
const PHONE_APP_ICONS = [
  { icon: Globe, bg: "from-blue-500 to-indigo-600", label: "Web" },
  { icon: ShoppingBag, bg: "from-amber-400 to-orange-500", label: "Shop" },
  { icon: Shield, bg: "from-emerald-400 to-teal-600", label: "Security" },
  { icon: BarChart3, bg: "from-rose-500 to-red-600", label: "Analytics" },
  { icon: Cloud, bg: "from-cyan-400 to-blue-500", label: "Cloud" },
  { icon: Database, bg: "from-purple-500 to-indigo-700", label: "DB" },
  { icon: Layers, bg: "from-orange-400 to-amber-600", label: "SaaS" },
  { icon: Mail, bg: "from-pink-500 to-rose-600", label: "Mail" },
  { icon: Cpu, bg: "from-blue-600 to-cyan-600", label: "API" },
  { icon: MessageSquare, bg: "from-teal-400 to-emerald-600", label: "Chat" },
  { icon: Lock, bg: "from-indigo-500 to-purple-600", label: "Auth" },
  { icon: Zap, bg: "from-yellow-400 to-amber-500", label: "Speed" },
  { icon: Laptop, bg: "from-sky-400 to-blue-600", label: "App" },
  { icon: Award, bg: "from-amber-500 to-orange-600", label: "Brand" },
  { icon: FileCode, bg: "from-emerald-500 to-teal-700", label: "Dev" },
  { icon: Compass, bg: "from-red-500 to-pink-600", label: "SEO" },
  { icon: Gauge, bg: "from-purple-400 to-pink-500", label: "Speed" },
  { icon: Workflow, bg: "from-cyan-500 to-teal-600", label: "Flow" },
  { icon: CheckCircle2, bg: "from-green-500 to-emerald-600", label: "Done" },
  { icon: MousePointerClick, bg: "from-blue-500 to-violet-600", label: "Ads" },
  { icon: Smartphone, bg: "from-rose-400 to-orange-500", label: "Mobile" },
  { icon: Palette, bg: "from-fuchsia-500 to-purple-600", label: "UI/UX" },
  { icon: Sparkles, bg: "from-amber-400 to-yellow-500", label: "AI" },
  { icon: Users2, bg: "from-blue-400 to-sky-600", label: "Team" },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [siteSettings, setSiteSettings] = useState({
    servicesTitle: "Was wir tun?",
    servicesSubtitle: "UNSERE LEISTUNGEN",
  });
  const [hoveredServiceId, setHoveredServiceId] = useState(null);
  const { openQuote } = useModals();

  useEffect(() => {
    api
      .get("/services")
      .then((r) => {
        if (Array.isArray(r.data) && r.data.length >= 6) {
          // Map backend items to structured icon keys if present
          const mapped = r.data.map((item, idx) => ({
            ...item,
            iconKey:
              item.iconKey ||
              (idx === 0
                ? "webdesign"
                : idx === 1
                ? "software"
                : idx === 2
                ? "seo"
                : idx === 3
                ? "marketing"
                : idx === 4
                ? "branding"
                : "consulting"),
          }));
          setServices(mapped);
        }
      })
      .catch(() => {});

    api
      .get("/site-settings")
      .then((r) => setSiteSettings((prev) => ({ ...prev, ...r.data })))
      .catch(() => {});
  }, []);

  const activeServices = services.length >= 6 ? services : DEFAULT_SERVICES;
  const leftServices = activeServices.filter((s) => s.side === "left");
  const rightServices = activeServices.filter((s) => s.side === "right");

  return (
    <section
      id="leistungen"
      className="py-20 md:py-28 bg-[#f1f5fb] relative overflow-hidden select-none"
    >
      {/* Subtle Background Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-blue-100/60 to-rose-100/30 blur-3xl -z-10 pointer-events-none rounded-full" />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-14 md:mb-20"
        >
          <h2 className="text-[32px] sm:text-[40px] md:text-[46px] font-black text-[#0f172a] tracking-tight">
            <span className="text-[#E63946] mr-1.5 inline-block font-black">#</span>
            {siteSettings.servicesTitle || "Was wir tun?"}
          </h2>
          <p className="text-[#E63946] font-extrabold tracking-[0.2em] text-xs sm:text-sm uppercase mt-2">
            {siteSettings.servicesSubtitle || "UNSERE LEISTUNGEN"}
          </p>
        </motion.div>

        {/* 3-Column Services Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-4 items-center">
          {/* LEFT COLUMN: 3 Services (Right-aligned text on desktop) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-10 lg:space-y-14 order-2 lg:order-1">
            {leftServices.map((srv, idx) => {
              const isHovered = hoveredServiceId === srv.id || hoveredServiceId === srv.iconKey;
              return (
                <motion.div
                  key={srv.id || `left-${idx}`}
                  initial={{ opacity: 0, x: -35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  onMouseEnter={() => setHoveredServiceId(srv.id)}
                  onMouseLeave={() => setHoveredServiceId(null)}
                  onClick={() => openQuote()}
                  className={`group cursor-pointer p-4 sm:p-5 rounded-2xl transition-all duration-300 ${
                    isHovered
                      ? "bg-white shadow-xl shadow-slate-200/70 translate-x-1"
                      : "hover:bg-white/70 hover:shadow-md"
                  } lg:text-right text-left flex flex-col lg:items-end items-start`}
                >
                  <div className="flex items-center gap-3 lg:flex-row-reverse mb-2.5">
                    {/* Mobile icon badge visible only on small screens */}
                    <div className="lg:hidden shrink-0">
                      <ServiceBadgeIcon type={srv.iconKey} className="w-5 h-5" />
                    </div>
                    <h3
                      className={`text-xl sm:text-[22px] font-extrabold tracking-tight transition-colors duration-200 ${
                        isHovered ? "text-[#E63946]" : "text-[#0f172a] group-hover:text-[#E63946]"
                      }`}
                    >
                      {srv.title}
                    </h3>
                  </div>
                  <p className="text-[13.5px] sm:text-[14.5px] text-[#475569] leading-relaxed max-w-md font-normal">
                    {srv.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* CENTER COLUMN: Central Smartphone Mockup with 6 Overlapping Badges */}
          <div className="lg:col-span-4 flex justify-center items-center relative py-4 lg:py-0 order-1 lg:order-2">
            <motion.div
              initial={{ opacity: 0, scale: 0.92 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="relative"
            >
              {/* Smartphone Outer Chassis */}
              <div className="relative w-[260px] sm:w-[280px] h-[520px] sm:h-[560px] bg-[#111827] rounded-[48px] p-3.5 shadow-[0_25px_60px_-15px_rgba(15,23,42,0.35)] border-[5px] border-[#1e293b] ring-1 ring-white/20">
                {/* Speaker & Camera Notch (Dynamic Island) */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-[#0f172a] rounded-full z-30 flex items-center justify-center gap-2 shadow-inner">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#1e293b] border border-slate-700/50" />
                  <div className="w-10 h-1.5 rounded-full bg-[#1e293b]" />
                </div>

                {/* Smartphone Glass Inner Screen */}
                <div className="w-full h-full bg-gradient-to-b from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0] rounded-[38px] overflow-hidden pt-8 pb-4 px-3 flex flex-col justify-between shadow-inner relative border border-slate-200/80">
                  {/* Subtle Screen Header */}
                  <div className="flex items-center justify-between px-2 pt-1 pb-2 border-b border-slate-200/60">
                    <span className="text-[10px] font-bold text-slate-400">9:41</span>
                    <div className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] font-semibold text-slate-500">redwork 5G</span>
                    </div>
                  </div>

                  {/* App Grid inside Smartphone Screen (Dense, colorful modern launcher) */}
                  <div className="grid grid-cols-4 gap-2.5 py-3 content-center my-auto">
                    {PHONE_APP_ICONS.map((item, idx) => {
                      const IconComp = item.icon;
                      return (
                        <motion.div
                          key={`app-${idx}`}
                          whileHover={{ scale: 1.15, rotate: 2 }}
                          transition={{ type: "spring", stiffness: 400, damping: 15 }}
                          className="flex flex-col items-center gap-1 cursor-default group"
                        >
                          <div
                            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br ${item.bg} flex items-center justify-center shadow-md shadow-slate-400/20 text-white transform transition-transform`}
                          >
                            <IconComp className="w-5 h-5 text-white drop-shadow-sm" strokeWidth={2.2} />
                          </div>
                          <span className="text-[9px] font-medium text-slate-600 truncate max-w-[38px] text-center leading-none">
                            {item.label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>

                  {/* Bottom Navigation / Home Bar */}
                  <div className="pt-2 flex justify-center">
                    <div className="w-24 h-1 bg-slate-400 rounded-full" />
                  </div>
                </div>
              </div>

              {/* 6 OVERLAPPING CIRCULAR BADGE CARDS (Desktop/Tablet) */}
              {/* LEFT 3 BADGES (Positioned precisely overlapping the left rim of phone) */}
              <div className="hidden lg:block">
                {/* Badge 1: Webdesign */}
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  onClick={() => openQuote()}
                  onMouseEnter={() => setHoveredServiceId("service-webdesign")}
                  onMouseLeave={() => setHoveredServiceId(null)}
                  className={`absolute -left-9 top-14 w-[74px] h-[74px] rounded-full bg-white flex items-center justify-center transition-all duration-300 z-20 ${
                    hoveredServiceId === "service-webdesign" || hoveredServiceId === "webdesign"
                      ? "ring-4 ring-[#1E88E5] shadow-[0_15px_30px_rgba(30,136,229,0.35)] scale-110"
                      : "shadow-[0_10px_25px_rgba(0,0,0,0.12)] border-2 border-white hover:shadow-xl"
                  }`}
                  aria-label="Webdesign"
                >
                  <ServiceBadgeIcon type="webdesign" className="w-8 h-8" />
                </motion.button>

                {/* Badge 2: SEO */}
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  onClick={() => openQuote()}
                  onMouseEnter={() => setHoveredServiceId("service-seo")}
                  onMouseLeave={() => setHoveredServiceId(null)}
                  className={`absolute -left-10 top-1/2 -translate-y-1/2 w-[74px] h-[74px] rounded-full bg-white flex items-center justify-center transition-all duration-300 z-20 ${
                    hoveredServiceId === "service-seo" || hoveredServiceId === "seo"
                      ? "ring-4 ring-[#f97316] shadow-[0_15px_30px_rgba(249,115,22,0.35)] scale-110"
                      : "shadow-[0_10px_25px_rgba(0,0,0,0.12)] border-2 border-white hover:shadow-xl"
                  }`}
                  aria-label="SEO & Online-Sichtbarkeit"
                >
                  <ServiceBadgeIcon type="seo" className="w-8 h-8" />
                </motion.button>

                {/* Badge 3: Branding */}
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  onClick={() => openQuote()}
                  onMouseEnter={() => setHoveredServiceId("service-branding")}
                  onMouseLeave={() => setHoveredServiceId(null)}
                  className={`absolute -left-9 bottom-14 w-[74px] h-[74px] rounded-full bg-white flex items-center justify-center transition-all duration-300 z-20 ${
                    hoveredServiceId === "service-branding" || hoveredServiceId === "branding"
                      ? "ring-4 ring-[#8b5cf6] shadow-[0_15px_30px_rgba(139,92,246,0.35)] scale-110"
                      : "shadow-[0_10px_25px_rgba(0,0,0,0.12)] border-2 border-white hover:shadow-xl"
                  }`}
                  aria-label="Branding & Corporate Design"
                >
                  <ServiceBadgeIcon type="branding" className="w-8 h-8" />
                </motion.button>

                {/* RIGHT 3 BADGES (Positioned precisely overlapping the right rim of phone) */}
                {/* Badge 4: Softwareentwicklung */}
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  onClick={() => openQuote()}
                  onMouseEnter={() => setHoveredServiceId("service-software")}
                  onMouseLeave={() => setHoveredServiceId(null)}
                  className={`absolute -right-9 top-14 w-[74px] h-[74px] rounded-full bg-white flex items-center justify-center transition-all duration-300 z-20 ${
                    hoveredServiceId === "service-software" || hoveredServiceId === "software"
                      ? "ring-4 ring-[#059669] shadow-[0_15px_30px_rgba(5,150,105,0.35)] scale-110"
                      : "shadow-[0_10px_25px_rgba(0,0,0,0.12)] border-2 border-white hover:shadow-xl"
                  }`}
                  aria-label="Softwareentwicklung"
                >
                  <ServiceBadgeIcon type="software" className="w-8 h-8" />
                </motion.button>

                {/* Badge 5: Online-Marketing */}
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  onClick={() => openQuote()}
                  onMouseEnter={() => setHoveredServiceId("service-marketing")}
                  onMouseLeave={() => setHoveredServiceId(null)}
                  className={`absolute -right-10 top-1/2 -translate-y-1/2 w-[74px] h-[74px] rounded-full bg-white flex items-center justify-center transition-all duration-300 z-20 ${
                    hoveredServiceId === "service-marketing" || hoveredServiceId === "marketing"
                      ? "ring-4 ring-[#E63946] shadow-[0_15px_30px_rgba(230,57,70,0.35)] scale-110"
                      : "shadow-[0_10px_25px_rgba(0,0,0,0.12)] border-2 border-white hover:shadow-xl"
                  }`}
                  aria-label="Online-Marketing"
                >
                  <ServiceBadgeIcon type="marketing" className="w-8 h-8" />
                </motion.button>

                {/* Badge 6: IT-Beratung */}
                <motion.button
                  whileHover={{ scale: 1.12 }}
                  onClick={() => openQuote()}
                  onMouseEnter={() => setHoveredServiceId("service-consulting")}
                  onMouseLeave={() => setHoveredServiceId(null)}
                  className={`absolute -right-9 bottom-14 w-[74px] h-[74px] rounded-full bg-white flex items-center justify-center transition-all duration-300 z-20 ${
                    hoveredServiceId === "service-consulting" || hoveredServiceId === "consulting"
                      ? "ring-4 ring-[#0284c7] shadow-[0_15px_30px_rgba(2,132,199,0.35)] scale-110"
                      : "shadow-[0_10px_25px_rgba(0,0,0,0.12)] border-2 border-white hover:shadow-xl"
                  }`}
                  aria-label="IT-Beratung"
                >
                  <ServiceBadgeIcon type="consulting" className="w-8 h-8" />
                </motion.button>
              </div>
            </motion.div>
          </div>

          {/* RIGHT COLUMN: 3 Services (Left-aligned text on desktop) */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-10 lg:space-y-14 order-3">
            {rightServices.map((srv, idx) => {
              const isHovered = hoveredServiceId === srv.id || hoveredServiceId === srv.iconKey;
              return (
                <motion.div
                  key={srv.id || `right-${idx}`}
                  initial={{ opacity: 0, x: 35 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  onMouseEnter={() => setHoveredServiceId(srv.id)}
                  onMouseLeave={() => setHoveredServiceId(null)}
                  onClick={() => openQuote()}
                  className={`group cursor-pointer p-4 sm:p-5 rounded-2xl transition-all duration-300 ${
                    isHovered
                      ? "bg-white shadow-xl shadow-slate-200/70 -translate-x-1"
                      : "hover:bg-white/70 hover:shadow-md"
                  } text-left flex flex-col items-start`}
                >
                  <div className="flex items-center gap-3 mb-2.5">
                    {/* Mobile icon badge visible only on small screens */}
                    <div className="lg:hidden shrink-0">
                      <ServiceBadgeIcon type={srv.iconKey} className="w-5 h-5" />
                    </div>
                    <h3
                      className={`text-xl sm:text-[22px] font-extrabold tracking-tight transition-colors duration-200 ${
                        isHovered ? "text-[#E63946]" : "text-[#0f172a] group-hover:text-[#E63946]"
                      }`}
                    >
                      {srv.title}
                    </h3>
                  </div>
                  <p className="text-[13.5px] sm:text-[14.5px] text-[#475569] leading-relaxed max-w-md font-normal">
                    {srv.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

