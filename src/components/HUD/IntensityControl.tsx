import { useState } from 'react';
import { useCanvas } from '@/context/CanvasContext';
import { DEFAULT_INTENSITY } from '@/engine/constants';
import { audioEngine } from '@/engine/audio';

/**
 * Control maestro de "Caos": regula la intensidad global de la física
 * (repulsión, deriva ambiental, colisiones y onda expansiva).
 *
 * En 0 → todo prácticamente quieto y cómodo de usar.
 * En 100 → el lienzo está vivo y salvaje.
 * Este es el mando que hace el caos *controlable*.
 */
export function IntensityControl() {
  const { setIntensity } = useCanvas();
  const [value, setValue] = useState(Math.round(DEFAULT_INTENSITY * 100));

  const onChange = (next: number) => {
    setValue(next);
    setIntensity(next / 100);
  };

  const label = value === 0 ? 'Zen' : value < 40 ? 'Calma' : value < 75 ? 'Vivo' : 'Salvaje';

  return (
    <div className="glass-panel flex items-center gap-3 rounded-full px-4 py-2">
      <span className="font-mono text-[11px] uppercase tracking-wider text-slate-400">Caos</span>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onPointerUp={() => audioEngine.microClick(300, 'sine', 0.03, 0.06)}
        className="chaos-slider h-1.5 w-28 cursor-pointer appearance-none rounded-full bg-white/15"
        aria-label="Nivel de caos"
        style={{
          background: `linear-gradient(to right, #bef264 ${value}%, rgba(255,255,255,0.15) ${value}%)`,
        }}
      />
      <span className="min-w-[52px] font-mono text-[11px] font-semibold text-lime-400">{label}</span>
    </div>
  );
}
