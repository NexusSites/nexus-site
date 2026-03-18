"use client";

import { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  baseOpacity: number;
}

export default function InteractiveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -9999, y: -9999 });
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;

    /* ── Sizing ── */
    const setSize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
    };

    /* ── Particle creation ── */
    const createParticles = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const count = Math.min(90, Math.floor((w * h) / 14000));
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 1.2 + 0.6,
          baseOpacity: Math.random() * 0.35 + 0.15,
        });
      }
      particlesRef.current = particles;
    };

    /* ── Draw loop ── */
    const CONNECT_DIST = 160;
    const MOUSE_RADIUS = 220;
    const GOLD = [201, 168, 76];
    const IVORY = [245, 240, 232];

    const draw = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const { x: mx, y: my } = mouseRef.current;
      const particles = particlesRef.current;

      /* connections */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist > CONNECT_DIST) continue;

          const midX = (particles[i].x + particles[j].x) * 0.5;
          const midY = (particles[i].y + particles[j].y) * 0.5;
          const mDist = Math.sqrt((midX - mx) ** 2 + (midY - my) ** 2);
          const lineFade = 1 - dist / CONNECT_DIST;

          if (mDist < MOUSE_RADIUS) {
            const proximity = 1 - mDist / MOUSE_RADIUS;
            ctx.strokeStyle = `rgba(${GOLD[0]},${GOLD[1]},${GOLD[2]},${lineFade * proximity * 0.45})`;
            ctx.lineWidth = 0.8;
          } else {
            ctx.strokeStyle = `rgba(${IVORY[0]},${IVORY[1]},${IVORY[2]},${lineFade * 0.07})`;
            ctx.lineWidth = 0.5;
          }

          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }

      /* particles */
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const dx = p.x - mx;
        const dy = p.y - my;
        const mDist = Math.sqrt(dx * dx + dy * dy);

        let r = p.radius;
        let col: number[];
        let opacity = p.baseOpacity;

        if (mDist < MOUSE_RADIUS) {
          const influence = 1 - mDist / MOUSE_RADIUS;
          col = GOLD;
          opacity = p.baseOpacity + influence * 0.55;
          r = p.radius + influence * 2.5;
        } else {
          col = IVORY;
        }

        ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${opacity})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
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
      createParticles();
    };

    setSize();
    createParticles();
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
