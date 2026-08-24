import React, { useEffect, useState } from "react";
import { API } from "../api";

const FALLBACK_STATS = [
  { number: "2.450.000", suffix: "+", label: "Geschriebene Codezeilen" },
  { number: "1.200", suffix: "+", label: "Einzigartige Webseiten" },
  { number: "850", suffix: "+", label: "Abgeschlossene Projekte" },
  { number: "620", suffix: "+", label: "Zufriedene Kunden" },
];

export default function StatsBar() {
  const [stats, setStats] = useState(FALLBACK_STATS);

  useEffect(() => {
    fetch(`${API}/site-settings`)
      .then((r) => r.json())
      .then((d) => {
        if (Array.isArray(d.stats) && d.stats.length) setStats(d.stats);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="stats" className="bg-stats py-8 sm:py-10 md:py-12 border-y border-white/10">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-4 sm:gap-6 lg:gap-8">
        {stats.map((s, i) => (
          <div key={`${s.label}-${i}`} className="text-center flex flex-col items-center justify-center p-1 sm:p-2">
            <div className="text-[#FFC107] text-[22px] xs:text-[26px] sm:text-[30px] md:text-[34px] lg:text-[38px] xl:text-[44px] font-black tracking-tighter leading-none whitespace-nowrap">
              {s.number}<span className="text-[#FFC107]">{s.suffix}</span>
            </div>
            <div className="text-white/90 mt-2 text-[12px] sm:text-[13px] md:text-[14px] lg:text-[15px] font-medium leading-tight max-w-[180px] sm:max-w-none">
              {s.label}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
