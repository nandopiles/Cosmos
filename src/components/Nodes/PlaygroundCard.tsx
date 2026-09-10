import { useEffect, useRef } from 'react';
import { audioEngine } from '@/engine/audio';
import { PhysicsNode } from './PhysicsNode';

const ORB_SIZE = 64;

/**
 * Laboratorio sensorial: un orbe con gravedad que rebota contra los bordes de
 * su caja y se puede agarrar y lanzar. Física local en su propio rAF.
 */
export function PlaygroundCard({ index }: { index: number }) {
  const boxRef = useRef<HTMLDivElement | null>(null);
  const orbRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const box = boxRef.current;
    const orb = orbRef.current;
    if (!box || !orb) return;

    const state = { x: 180, y: 60, vx: 4, vy: 2, dragging: false };

    const onOrbDown = (e: PointerEvent) => {
      e.stopPropagation();
      state.dragging = true;
      state.vx = 0;
      state.vy = 0;
      audioEngine.microClick(500);
    };

    const onMove = (e: PointerEvent) => {
      if (!state.dragging) return;
      const rect = box.getBoundingClientRect();
      state.x = e.clientX - rect.left - ORB_SIZE / 2;
      state.y = e.clientY - rect.top - ORB_SIZE / 2;
    };

    const onUp = () => {
      if (!state.dragging) return;
      state.dragging = false;
      state.vx = (Math.random() - 0.5) * 12;
      state.vy = -Math.random() * 10;
      audioEngine.microClick(350);
    };

    orb.addEventListener('pointerdown', onOrbDown);
    box.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);

    let raf = 0;
    const loop = () => {
      if (!state.dragging) {
        state.vy += 0.35; // gravedad
        state.x += state.vx;
        state.y += state.vy;

        const maxX = box.clientWidth - ORB_SIZE;
        const maxY = box.clientHeight - ORB_SIZE;

        if (state.x < 0) { state.x = 0; state.vx *= -0.82; audioEngine.microClick(440, 'triangle', 0.02, 0.03); }
        if (state.x > maxX) { state.x = maxX; state.vx *= -0.82; audioEngine.microClick(440, 'triangle', 0.02, 0.03); }
        if (state.y < 0) { state.y = 0; state.vy *= -0.82; audioEngine.microClick(440, 'triangle', 0.02, 0.03); }
        if (state.y > maxY) {
          state.y = maxY;
          state.vy *= -0.82;
          state.vx *= 0.98;
          if (Math.abs(state.vy) > 1.2) audioEngine.microClick(360, 'sine', 0.02, 0.04);
        }
      }
      orb.style.transform = `translate(${state.x}px, ${state.y}px)`;
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      orb.removeEventListener('pointerdown', onOrbDown);
      box.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
    };
  }, []);

  return (
    <PhysicsNode id="node-toy-zone" category="interactive" top={2500} left={1900} width={480} index={index} withAura>
      <div className="glass-panel rounded-[40px] border border-lime-400/20 p-8">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-xs text-lime-300">LABORATORIO SENSORIAL</span>
          <span className="rounded-full bg-lime-400/10 px-2 py-0.5 font-mono text-[11px] text-lime-400">
            Prueba de Fricción
          </span>
        </div>

        <p className="mb-6 text-xs leading-relaxed text-slate-300">
          Agarra y lanza esta esfera para experimentar la conservación de momento y choque contra los límites del
          espacio:
        </p>

        <div
          ref={boxRef}
          className="relative flex h-44 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/10 bg-slate-950/80"
        >
          <div className="absolute inset-0 opacity-25 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:20px_20px]" />
          <div
            ref={orbRef}
            className="absolute left-0 top-0 flex h-16 w-16 cursor-grab items-center justify-center rounded-full bg-gradient-to-tr from-lime-500 to-emerald-300 font-mono text-[10px] font-bold text-slate-950 shadow-[0_0_30px_rgba(190,242,100,0.6)] active:cursor-grabbing"
          >
            Tócame
          </div>
          <span className="absolute bottom-2 left-3 font-mono text-[10px] text-slate-500">Coef. Restitución: 0.82</span>
        </div>
      </div>
    </PhysicsNode>
  );
}
