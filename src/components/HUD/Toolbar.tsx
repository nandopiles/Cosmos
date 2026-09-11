import { useCanvas } from '@/context/CanvasContext';
import { useAudio } from '@/hooks/useAudio';
import { Bulb, Home, Speaker } from '@/components/icons';

interface ToolbarProps {
  flashlightActive: boolean;
  onToggleFlashlight: () => void;
}

/**
 * Barra superior derecha: linterna, audio háptico, Big Bang y Reset.
 */
export function Toolbar({ flashlightActive, onToggleFlashlight }: ToolbarProps) {
  const { resetLayout } = useCanvas();
  const { enabled: audioOn, toggle: toggleAudio, click } = useAudio();

  return (
    <div className="fixed right-8 top-6 z-50 flex items-center gap-3">
      <button
        onClick={() => {
          onToggleFlashlight();
          click(340);
        }}
        className={`glass-btn flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-xs shadow-lg ${flashlightActive ? 'is-active' : ''}`}
        title="Alternar el telescopio que ilumina el cielo oscuro"
      >
        <Bulb className="h-4 w-4" />
        <span className="hidden sm:inline">Telescopio</span>
      </button>

      <button
        onClick={toggleAudio}
        className={`glass-btn flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-xs shadow-lg ${audioOn ? 'is-active' : ''}`}
        title="Activar micro-sonidos táctiles generativos"
      >
        <Speaker className="h-4 w-4" />
        <span>Audio: {audioOn ? 'On' : 'Off'}</span>
      </button>

      <button
        onClick={resetLayout}
        className="glass-btn flex items-center gap-2 rounded-full px-3.5 py-2 font-mono text-xs shadow-lg"
        title="Recolocar: devuelve los cuerpos a su órbita original"
      >
        <Home className="h-3.5 w-3.5" />
        <span className="hidden sm:inline">Reset</span>
      </button>
    </div>
  );
}
