import type { ReactNode, RefObject } from 'react';

interface WorldProps {
  viewportRef: RefObject<HTMLDivElement | null>;
  worldRef: RefObject<HTMLDivElement | null>;
  worldSize: number;
  children: ReactNode;
}

/**
 * Viewport (cámara) + mundo (lienzo transformable). El transform del mundo lo
 * escribe el loop central; aquí solo declaramos la estructura.
 */
export function World({ viewportRef, worldRef, worldSize, children }: WorldProps) {
  return (
    <main ref={viewportRef} className="viewport">
      <div
        ref={worldRef}
        className="world infinite-grid"
        style={{ width: worldSize, height: worldSize }}
      >
        {children}
      </div>
    </main>
  );
}
