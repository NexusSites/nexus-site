"use client";

import { useEffect, useRef } from "react";

interface GridDot {
  x: number;
  y: number;
  baseRadius: number;
  baseOpacity: number;
}

export default function InteractiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const dotsRef = useRef<GridDot[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    const SPACING = 40;
    const MOUSE_RADIUS = 180;
    const BASE_R = 1.2;
    const BASE_OPACITY = 0.08;
    const ACCENT = [99, 91, 255]; // indigo

    /* ── Sizing ── */
    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    /* ── Create dot grid ── */
    const createDots = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dots: GridDot[] = [];
      const cols = Math.ceil(w / SPACING) + 1;
      const rows = Math.ceil(h / SPACING) + 1;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: c * SPACING,
            y: r * SPACING,
            baseRadius: BASE_R,
            baseOpacity: BASE_OPACITY,
          });
        }
      }
      dotsRef.current = dots;
    };

    /* ── Draw loop ── */
    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const { x: mx, y: my } = mouseRef.current;
      const dots = dotsRef.current;

      for (const dot of dots) {
        const dx = dot.x - mx;
        const dy = dot.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let radius = dot.baseRadius;
        let opacity = dot.baseOpacity;

        if (dist < MOUSE_RADIUS) {
          const influence = 1 - dist / MOUSE_RADIUS;
          const eased = influence * influence; // ease-in-quad
          opacity = dot.baseOpacity + eased * 0.45;
          radius = dot.baseRadius + eased * 2.5;
          ctx.fillStyle = `rgba(${ACCENT[0]},${ACCENT[1]},${ACCENT[2]},${opacity})`;
        } else {
          ctx.fillStyle = `rgba(0,0,0,${opacity})`;
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    /* ── Events ── */
    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };
    const onMouseLeave = () => {
      mouseRef.current = { x: -9999, y: -9999 };
    };
    const onResize = () => {
      setSize();
      createDots();
    };

    setSize();
    createDots();
    draw();

    window.addEventListener("resize", onResize);
    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);

    return () => {
      cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="interactive-canvas" />;
}
