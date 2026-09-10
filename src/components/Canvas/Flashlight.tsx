import { useEffect, useRef } from 'react';

interface FlashlightProps {
  active: boolean;
}

/**
 * Capa de "linterna": oscurece el lienzo salvo un halo radial que sigue al
 * cursor. Escribe el gradiente directamente al estilo (sin re-render) para
 * seguir el puntero a 60fps.
 */
export function Flashlight({ active }: FlashlightProps) {
  const layerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const layer = layerRef.current;
    if (!layer) return;

    const paint = (x: number, y: number) => {
      layer.style.background = `radial-gradient(circle 520px at ${x}px ${y}px, rgba(14, 22, 38, 0) 0%, rgba(7, 9, 14, 0.45) 60%, rgba(7, 9, 14, 0.88) 100%)`;
    };

    if (!active) {
      layer.style.background = 'transparent';
      return;
    }

    paint(window.innerWidth / 2, window.innerHeight / 2);
    const onMove = (e: PointerEvent) => paint(e.clientX, e.clientY);
    window.addEventListener('pointermove', onMove);
    return () => window.removeEventListener('pointermove', onMove);
  }, [active]);

  return <div ref={layerRef} className="flashlight-layer fixed inset-0 z-40 h-full w-full" />;
}
