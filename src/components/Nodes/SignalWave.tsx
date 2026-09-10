import { useEffect, useRef } from 'react';

interface SignalWaveProps {
  /** 0..1 — energía de la onda (p.ej. según lo que se escribe). */
  energy: number;
  /** Color de acento (hex). */
  color: string;
  /** Pulso momentáneo (se dispara al transmitir). */
  pulseKey: number;
}

/**
 * Osciloscopio decorativo: dibuja una onda sinusoidal animada cuya amplitud
 * y frecuencia dependen de la "energía". Un pulso la sacude brevemente.
 * Ligero: su propio rAF, se pausa cuando energy=0 y no hay pulso.
 */
export function SignalWave({ energy, color, pulseKey }: SignalWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const energyRef = useRef(energy);
  const pulseRef = useRef(0);

  energyRef.current = energy;

  useEffect(() => {
    // Un cambio de pulseKey inyecta energía transitoria.
    pulseRef.current = 1;
  }, [pulseKey]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    let raf = 0;
    let t = 0;
    const render = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const e = energyRef.current;
      const pulse = pulseRef.current;
      pulseRef.current *= 0.92; // decae el pulso

      const amp = (h / 2) * (0.15 + e * 0.5 + pulse * 0.35);
      const freq = 0.03 + e * 0.05 + pulse * 0.04;
      const speed = 0.06 + e * 0.12 + pulse * 0.2;
      t += speed;

      ctx.beginPath();
      for (let x = 0; x <= w; x++) {
        const y =
          h / 2 +
          Math.sin(x * freq + t) * amp * Math.sin(x * 0.008 + t * 0.5) +
          Math.sin(x * freq * 2.3 + t * 1.7) * amp * 0.25;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.lineCap = 'round';
      ctx.shadowColor = color;
      ctx.shadowBlur = 8 + pulse * 12;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Línea base tenue.
      ctx.beginPath();
      ctx.moveTo(0, h / 2);
      ctx.lineTo(w, h / 2);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();

      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    window.addEventListener('resize', resize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [color]);

  return <canvas ref={canvasRef} className="h-14 w-full rounded-xl" aria-hidden="true" />;
}
