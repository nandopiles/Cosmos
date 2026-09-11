import { useCanvas } from '@/context/CanvasContext';
import type { TeleportTarget } from '@/types';

interface Pill {
  target: TeleportTarget;
  label: string;
  dot: string;
  hover: string;
}

const PILLS: Pill[] = [
  { target: 'hero', label: 'Inicio', dot: 'bg-lime-400', hover: 'hover:text-lime-300' },
  { target: 'skills', label: 'Conceptos', dot: 'bg-amber-400', hover: 'hover:text-amber-300' },
  { target: 'about', label: 'Nuestro origen', dot: 'bg-purple-400', hover: 'hover:text-purple-300' },
  { target: 'contact', label: '¿Sabías que…?', dot: 'bg-rose-400', hover: 'hover:text-rose-300' },
];

/** Navegación rápida por teleport (abajo-izquierda). */
export function TeleportPills() {
  const { teleport } = useCanvas();

  return (
    <div className="no-scrollbar fixed bottom-6 left-8 z-50 flex max-w-[85vw] items-center gap-2 overflow-x-auto pb-1">
      <div className="glass-panel flex items-center gap-1 rounded-full p-1 shadow-2xl">
        {PILLS.map((pill) => (
          <button
            key={pill.target}
            onClick={() => teleport(pill.target)}
            className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 font-mono text-xs text-slate-300 transition hover:bg-white/5 ${pill.hover}`}
          >
            <span className={`h-1.5 w-1.5 rounded-full ${pill.dot}`} />
            {pill.label}
          </button>
        ))}
      </div>
    </div>
  );
}
