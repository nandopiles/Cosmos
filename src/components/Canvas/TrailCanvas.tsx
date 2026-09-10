import type { RefObject } from 'react';

interface TrailCanvasProps {
  canvasRef: RefObject<HTMLCanvasElement | null>;
}

/**
 * Canvas a pantalla completa donde el ParticleField pinta la estela del cursor
 * y las partículas ambientales. Es puramente presentacional: el hook
 * useLivingCanvas gestiona el contexto 2D y el render.
 */
export function TrailCanvas({ canvasRef }: TrailCanvasProps) {
  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50 h-full w-full"
      aria-hidden="true"
    />
  );
}
