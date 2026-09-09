import React from "react";

export default function Logo({ size = "md", inverted = false }) {
  const sizes = {
    sm: { text: "text-[18px]", brk: "text-[12px]", imgH: "h-[22px]" },
    md: { text: "text-[25px]", brk: "text-[14px]", imgH: "h-[28px]" },
    lg: { text: "text-[34px]", brk: "text-[16px]", imgH: "h-[36px]" },
  };
  const s = sizes[size] || sizes.md;

  return (
    <div className="inline-flex items-center gap-1 leading-none select-none">
      <span className={`font-extrabold tracking-tight ${s.text} ${inverted ? "text-[#0f172a]" : "text-white"}`}>
        red
      </span>
      <span className={`font-extrabold tracking-tight ${s.text} text-[#E63946]`}>work</span>
      <span className={`${s.brk} font-bold ${inverted ? "text-[#475569]" : "text-white/70"} ml-0.5`}>
        .ch
      </span>
      <span className="ml-2 inline-flex items-center">
        <img 
          src="/logo-chevron.png" 
          alt="RedWORK Symbol" 
          className={`${s.imgH} w-auto inline-block object-contain drop-shadow-[0_2px_8px_rgba(30,136,229,0.3)]`}
          onError={(e) => {
            e.currentTarget.style.display = 'none';
          }} 
        />
      </span>
    </div>
  );
}
