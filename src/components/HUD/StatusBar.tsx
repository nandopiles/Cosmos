import { useCanvas } from '@/context/CanvasContext';
import { Cursor } from '@/components/icons';

/**
 * Barra de estado (arriba-izquierda): indicador en vivo, coordenadas de cámara,
 * medidor de FPS (extra técnico) e instrucciones contextuales.
 */
export function StatusBar() {
  const { hud } = useCanvas();

  // Color del FPS según salud del frame-rate.
  const fpsColor = hud.fps >= 50 ? 'text-lime-400' : hud.fps >= 30 ? 'text-amber-400' : 'text-rose-400';

  return (
    <div className="fixed left-8 top-6 z-50 flex items-center gap-4">
      <div className="glass-panel flex items-center gap-3 rounded-full border border-white/10 px-4 py-2.5 shadow-2xl">
        <span className="relative flex h-2.5 w-2.5">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-lime-400 opacity-75" />
          <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-lime-400" />
        </span>
        <span className="font-mono text-xs font-medium uppercase tracking-wider text-slate-300">
          COSMOS <span className="font-semibold text-lime-400">en órbita</span>
        </span>
        <span className="text-slate-600">|</span>
        <span className="font-mono text-xs text-slate-400">
          X: {hud.coordX} Y: {hud.coordY}
        </span>
        <span className="text-slate-600">|</span>
        <span className={`font-mono text-xs font-semibold ${fpsColor}`}>{hud.fps} FPS</span>
      </div>

      <div className="glass-panel hidden items-center gap-2 rounded-full px-3.5 py-2 text-xs text-slate-400 md:flex">
        <Cursor className="h-3.5 w-3.5 text-lime-400" />
        <span>Empuja y lanza los planetas · Arrastra el vacío para viajar por el cosmos</span>
      </div>
    </div>
  );
}
