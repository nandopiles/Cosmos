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

  // Separa en palabras para que el salto de línea ocurra entre palabras
  // (no en mitad de un nombre) y así "FERRAN PILES LABLANCA" siempre quepa.
  const words = name.split(' ');

  return (
    <div
      ref={containerRef}
      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 font-display text-3xl font-extrabold leading-[1.05] tracking-tight text-white select-none sm:text-4xl md:text-5xl"
    >
      {words.map((word, wi) => (
        <span key={wi} className="flex items-baseline whitespace-nowrap">
          {word.split('').map((char, ci) => (
            <span key={`${wi}-${ci}`} data-letter className="letter-body">
              {char}
            </span>
          ))}
        </span>
      ))}
    </div>
  );
}
