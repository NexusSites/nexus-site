'use client';

import { useEffect, useRef } from 'react';

interface MatrixRainProps {
  width: number;
  height: number;
}

export default function MatrixRain({ width, height }: MatrixRainProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const columnsRef = useRef<number[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || width === 0 || height === 0) return;
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const fontSize = 14;
    const cols = Math.floor(width / fontSize);
    if (columnsRef.current.length !== cols) {
      columnsRef.current = Array.from({ length: cols }, () => Math.random() * height / fontSize);
    }
    const drops = columnsRef.current;
    const chars = '0123456789ABCDEFabcdef{}()<>/;:=&|~#%$@!?*+-_.הקודשלנו';

    let animId: number;
    const draw = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.06)';
      ctx.fillRect(0, 0, width, height);
      ctx.font = `${fontSize}px monospace`;
      ctx.fillStyle = '#ffffff';

      for (let i = 0; i < cols; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const x = i * fontSize;
        const y = drops[i] * fontSize;
        ctx.globalAlpha = 0.4 + Math.random() * 0.4;
        ctx.fillText(char, x, y);
        if (y > height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i] += 0.5 + Math.random() * 0.5;
      }
      animId = requestAnimationFrame(draw);
    };
    animId = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(animId);
  }, [width, height]);

  return <canvas ref={canvasRef} style={{ width, height, display: 'block' }} />;
}
