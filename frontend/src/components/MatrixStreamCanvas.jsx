import React, { useEffect, useRef } from "react";

/**
 * MatrixStreamCanvas
 * High-performance HTML5 canvas digital stream effect.
 * Features:
 * - Multi-depth parallax (3 distinct planes with different speeds, sizes, opacities)
 * - Cyber code characters (0, 1, A, F, X, 0xFF, </>, {}, [], 0101, 7, 9)
 * - Colors: Cyber Cool Blue (#1E88E5), Emerald Cyber (#00F5D4), Crimson Red Accent (#E63946)
 * - Extremely gentle opacity (0.02 - 0.12) to ensure ZERO disruption to text readability
 * - Responsive density adjustment (Desktop 100%, Tablet 50%, Mobile 25%)
 * - Visibility & reduced-motion aware (pauses when off-screen or user prefers reduced motion)
 */
export default function MatrixStreamCanvas({ className = "" }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Check prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    let animId = null;
    let width = (canvas.width = canvas.parentElement?.offsetWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.offsetHeight || window.innerHeight);

    const CHARS = [
      "0", "1", "0", "1", "0", "1", "0", "1",
      "A", "F", "X", "7", "9", "3", "C", "E",
      "</>", "{}", "[]", "0xFF", "01", "10", "->", "::"
    ];

    // Determine stream count based on device width
    const getColumns = (w) => {
      if (w < 640) return Math.floor(w / 44); // Mobile: very light
      if (w < 1024) return Math.floor(w / 32); // Tablet: medium
      return Math.floor(w / 22); // Desktop: full depth
    };

    let colCount = getColumns(width);

    // Three layers for depth:
    // Layer 0: background (tiny, very slow, dim)
    // Layer 1: midground (regular, moderate speed, subtle)
    // Layer 2: foreground highlights (slightly larger, faster, glowing accent)
    let streams = [];

    const initStreams = () => {
      colCount = getColumns(width);
      streams = [];
      for (let i = 0; i < colCount; i++) {
        const x = (i / colCount) * width + (Math.random() * 8 - 4);
        const depth = Math.random() < 0.5 ? 0 : Math.random() < 0.85 ? 1 : 2;

        let fontSize, speed, baseAlpha, colorType;
        if (depth === 0) {
          fontSize = 11;
          speed = 0.5 + Math.random() * 0.7;
          baseAlpha = 0.03 + Math.random() * 0.03;
          colorType = "blue";
        } else if (depth === 1) {
          fontSize = 13;
          speed = 1.0 + Math.random() * 1.1;
          baseAlpha = 0.05 + Math.random() * 0.05;
          colorType = Math.random() < 0.3 ? "teal" : "blue";
        } else {
          fontSize = 15;
          speed = 1.7 + Math.random() * 1.4;
          baseAlpha = 0.08 + Math.random() * 0.07;
          colorType = Math.random() < 0.4 ? "red" : "teal";
        }

        const length = 8 + Math.floor(Math.random() * 16);
        const chars = [];
        for (let j = 0; j < length; j++) {
          chars.push(CHARS[Math.floor(Math.random() * CHARS.length)]);
        }

        streams.push({
          x,
          y: Math.random() * -height,
          depth,
          fontSize,
          speed,
          baseAlpha,
          colorType,
          chars,
          length,
          stepCounter: 0,
        });
      }
    };

    initStreams();

    // Resize handler
    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.offsetWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement.offsetHeight || window.innerHeight;
      initStreams();
    };

    window.addEventListener("resize", handleResize, { passive: true });

    let isVisible = true;
    const observer = new IntersectionObserver(([entry]) => {
      isVisible = entry.isIntersecting;
    }, { threshold: 0.05 });
    observer.observe(canvas);

    // Main animation loop
    let lastTime = performance.now();
    const render = (time) => {
      animId = requestAnimationFrame(render);
      if (!isVisible) return;

      const dt = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < streams.length; i++) {
        const s = streams[i];
        s.y += s.speed * dt * 60;
        s.stepCounter += dt;

        // Mutate one character periodically for dynamic flicker
        if (s.stepCounter > 0.18) {
          s.stepCounter = 0;
          const mutateIdx = Math.floor(Math.random() * s.length);
          s.chars[mutateIdx] = CHARS[Math.floor(Math.random() * CHARS.length)];
        }

        ctx.font = `${s.fontSize}px 'Roboto Mono', 'Courier New', monospace`;
        ctx.textAlign = "center";

        for (let j = 0; j < s.chars.length; j++) {
          const charY = s.y - j * (s.fontSize + 3);
          if (charY < -30 || charY > height + 30) continue;

          const isHead = j === 0;
          let alpha = s.baseAlpha * (1 - j / s.chars.length);

          if (isHead) {
            alpha = Math.min(alpha * 2.2, 0.28);
          }

          if (s.colorType === "red") {
            ctx.fillStyle = isHead
              ? `rgba(255, 130, 140, ${alpha})`
              : `rgba(230, 57, 70, ${alpha})`;
          } else if (s.colorType === "teal") {
            ctx.fillStyle = isHead
              ? `rgba(160, 255, 240, ${alpha})`
              : `rgba(0, 245, 212, ${alpha})`;
          } else {
            ctx.fillStyle = isHead
              ? `rgba(190, 225, 255, ${alpha})`
              : `rgba(30, 136, 229, ${alpha})`;
          }

          ctx.fillText(s.chars[j], s.x, charY);
        }

        // Reset stream when it leaves viewport
        if (s.y - s.length * (s.fontSize + 3) > height) {
          s.y = -20 - Math.random() * 100;
          s.x = (i / colCount) * width + (Math.random() * 8 - 4);
        }
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ zIndex: 1 }}
      aria-hidden="true"
    />
  );
}
