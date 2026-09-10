import { useCanvas } from '@/context/CanvasContext';
import { ZOOM } from '@/engine/constants';

/** Controles de zoom (+/- y %) y botón de centrar. */
export function ZoomControls() {
  const { hud, zoomBy, teleport } = useCanvas();

  return (
    <div className="glass-panel flex items-center gap-2 rounded-full px-3 py-1.5">
      <button
        onClick={() => zoomBy(ZOOM.buttonOut)}
        className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-base text-slate-300 transition hover:bg-white/10"
        aria-label="Alejar"
      >
        −
      </button>
      <span className="min-w-[42px] text-center font-mono text-xs font-semibold text-lime-400">{hud.zoomPct}%</span>
      <button
        onClick={() => zoomBy(ZOOM.buttonIn)}
        className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-base text-slate-300 transition hover:bg-white/10"
        aria-label="Acercar"
      >
        +
      </button>
      <span className="text-slate-600">|</span>
      <button
        onClick={() => teleport('hero')}
        className="rounded px-2 py-1 font-mono text-xs text-slate-400 transition hover:text-white"
      >
        Centrar
      </button>
    </div>
  );
}
