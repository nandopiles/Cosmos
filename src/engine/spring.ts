/**
 * Utilidades de física de muelle amortiguado 2D, reutilizadas por piezas
 * pequeñas (letras magnéticas, orbe) que no necesitan el mundo completo.
 */

export interface Spring2D {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export function createSpring(x = 0, y = 0): Spring2D {
  return { x, y, vx: 0, vy: 0 };
}

/**
 * Empuja el muelle hacia (targetX, targetY) con rigidez y amortiguación dadas,
 * e integra un paso. Muta `s` in place.
 */
export function stepSpring(
  s: Spring2D,
  targetX: number,
  targetY: number,
  stiffness: number,
  damping: number,
): void {
  s.vx += (targetX - s.x) * stiffness;
  s.vy += (targetY - s.y) * stiffness;
  s.vx *= damping;
  s.vy *= damping;
  s.x += s.vx;
  s.y += s.vy;
}
