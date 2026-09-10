import { useEffect, useRef, type PointerEvent, type ReactNode } from 'react';
import { useCanvas } from '@/context/CanvasContext';
import type { NodeCategory } from '@/types';

interface PhysicsNodeProps {
  id: string;
  category: NodeCategory;
  /** Posición home en coordenadas de mundo. */
  top: number;
  left: number;
  width?: number;
  /** Índice para escalonar la caída inicial. */
  index: number;
  /** Muestra el aura pulsante al hacer hover. */
  withAura?: boolean;
  className?: string;
  children: ReactNode;
  /** Click de nivel superior (p.ej. abrir modal). */
  onActivate?: () => void;
}

/** Selector de elementos que NO deben iniciar arrastre (formularios/links). */
const INTERACTIVE_SELECTOR = 'input, textarea, button, a, select, label, [data-no-drag]';

/**
 * Cuerpo físico genérico del lienzo. Cada tarjeta/nodo se envuelve en él.
 * - Se registra en el PhysicsWorld al montar (posición, tamaño, categoría).
 * - Delega el arrastre al motor mediante la API del contexto.
 * - Nunca re-renderiza por física: el transform lo escribe el engine.
 */
export function PhysicsNode({
  id,
  category,
  top,
  left,
  width,
  index,
  withAura = false,
  className = '',
  children,
  onActivate,
}: PhysicsNodeProps) {
  const { registerNode, beginNodeDrag, setNodeHovered } = useCanvas();
  const elRef = useRef<HTMLDivElement | null>(null);
  const downPos = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const el = elRef.current;
    if (!el) return;
    return registerNode({ id, category, homeX: left, homeY: top, index, element: el });
  }, [registerNode, id, category, left, top, index]);

  const handlePointerDown = (e: PointerEvent<HTMLDivElement>) => {
    // No iniciar arrastre si el gesto empieza en un control interactivo.
    if ((e.target as HTMLElement).closest(INTERACTIVE_SELECTOR)) return;
    e.stopPropagation();
    downPos.current = { x: e.clientX, y: e.clientY };
    beginNodeDrag(id, e.clientX, e.clientY);
  };

  const handlePointerUp = (e: PointerEvent<HTMLDivElement>) => {
    // Distingue click de arrastre: solo activa si apenas hubo desplazamiento.
    if (!onActivate) return;
    const moved = Math.hypot(e.clientX - downPos.current.x, e.clientY - downPos.current.y);
    if (moved < 6) onActivate();
  };

  return (
    <div
      ref={elRef}
      id={id}
      data-category={category}
      className={`phys-node ${className}`}
      style={{ top, left, width }}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setNodeHovered(id, true)}
      onPointerLeave={() => setNodeHovered(id, false)}
    >
      {withAura && <div className="aura-glow" />}
      {children}
    </div>
  );
}
