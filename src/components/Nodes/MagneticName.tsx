import { useEffect, useRef } from 'react';
import { createSpring, stepSpring, type Spring2D } from '@/engine/spring';
import { audioEngine } from '@/engine/audio';

interface LetterState {
  el: HTMLSpanElement;
  spring: Spring2D;
}

/**
 * Nombre con letras magnéticas: cada carácter es un muelle independiente que
 * salta al pasar el cursor y regresa amortiguado. La física corre en su propio
 * rAF ligero y escribe transform directo (sin re-render).
 */
export function MagneticName({ name }: { name: string }) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const letters: LetterState[] = [];
    const spans = Array.from(container.querySelectorAll<HTMLSpanElement>('[data-letter]'));

    spans.forEach((el, i) => {
      const spring = createSpring();
      letters.push({ el, spring });

      const onEnter = () => {
        spring.vx += (Math.random() - 0.5) * 50;
        spring.vy += (Math.random() - 0.7) * 45;
        audioEngine.microClick(600 + i * 40, 'sine', 0.03, 0.08);
      };
      el.addEventListener('pointerenter', onEnter);
      (el as unknown as { _cleanup?: () => void })._cleanup = () =>
        el.removeEventListener('pointerenter', onEnter);
    });

    let raf = 0;
    const loop = () => {
      for (const { el, spring } of letters) {
        stepSpring(spring, 0, 0, 0.08, 0.88);
        el.style.transform = `translate(${spring.x}px, ${spring.y}px) rotate(${spring.vx * 0.5}deg)`;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      spans.forEach((el) => (el as unknown as { _cleanup?: () => void })._cleanup?.());
    };
  }, [name]);

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap items-baseline gap-1 font-display text-4xl font-extrabold tracking-tight text-white select-none sm:text-6xl"
    >
      {name.split('').map((char, i) =>
        char === ' ' ? (
          <span key={i} className="inline-block">
            {'\u00A0\u00A0'}
          </span>
        ) : (
          <span key={i} data-letter className="letter-body">
            {char}
          </span>
        ),
      )}
    </div>
  );
}
