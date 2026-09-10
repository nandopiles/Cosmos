import type { NodeCategory, PhysicsBody } from '@/types';
import { MASS, PHYSICS } from './constants';

export interface BodyInit {
  id: string;
  category: NodeCategory;
  homeX: number;
  homeY: number;
  width: number;
  height: number;
  /** Índice para escalonar la "caída" inicial. */
  index: number;
}

/**
 * Mundo de física soft-body para los nodos del lienzo.
 *
 * Responsabilidades:
 *  - Repulsión magnética desde el cursor
 *  - Muelle amortiguado de retorno a la posición home
 *  - Fricción / damping
 *  - Arrastrar y lanzar con conservación de inercia
 *  - Onda expansiva (scatter)
 *
 * Es puro respecto a React: escribe transform directamente sobre el elemento
 * DOM de cada cuerpo, evitando re-renders a 60fps.
 */
export class PhysicsWorld {
  bodies: PhysicsBody[] = [];
  private byId = new Map<string, PhysicsBody>();

  addBody(init: BodyInit): PhysicsBody {
    const mass = init.category === 'skill-satellite' ? MASS.satellite : MASS.default;
    const body: PhysicsBody = {
      id: init.id,
      category: init.category,
      homeX: init.homeX,
      homeY: init.homeY,
      // Dispersión + caída inicial escalonada para una entrada con "gravedad".
      x: init.homeX + (Math.random() - 0.5) * 40,
      y: init.homeY - 250 - init.index * 40,
      vx: 0,
      vy: 0,
      width: init.width,
      height: init.height,
      mass,
      isDragging: false,
      element: null,
      dragOffsetX: 0,
      dragOffsetY: 0,
      lastDragX: 0,
      lastDragY: 0,
    };
    this.bodies.push(body);
    this.byId.set(body.id, body);
    return body;
  }

  clear(): void {
    this.bodies = [];
    this.byId.clear();
  }

  getBody(id: string): PhysicsBody | undefined {
    return this.byId.get(id);
  }

  /** Inicia el arrastre de un cuerpo desde un punto de mundo. */
  startDrag(id: string, worldX: number, worldY: number): void {
    const b = this.byId.get(id);
    if (!b) return;
    b.isDragging = true;
    b.vx = 0;
    b.vy = 0;
    b.dragOffsetX = worldX - b.x;
    b.dragOffsetY = worldY - b.y;
    b.lastDragX = worldX;
    b.lastDragY = worldY;
  }

  /** Actualiza la posición de todos los cuerpos en arrastre. */
  drag(worldX: number, worldY: number): void {
    for (const b of this.bodies) {
      if (!b.isDragging) continue;
      b.vx = (worldX - b.lastDragX) * PHYSICS.throwDamping;
      b.vy = (worldY - b.lastDragY) * PHYSICS.throwDamping;
      b.x = worldX - b.dragOffsetX;
      b.y = worldY - b.dragOffsetY;
      b.lastDragX = worldX;
      b.lastDragY = worldY;
    }
  }

  /** Suelta todos los cuerpos. Devuelve la velocidad máxima de lanzamiento. */
  endDrag(): number {
    let maxSpeed = 0;
    for (const b of this.bodies) {
      if (!b.isDragging) continue;
      b.isDragging = false;
      maxSpeed = Math.max(maxSpeed, Math.hypot(b.vx, b.vy));
    }
    return maxSpeed;
  }

  /** Onda expansiva: empuja todos los cuerpos en direcciones aleatorias. */
  scatter(): void {
    for (const b of this.bodies) {
      const angle = Math.random() * Math.PI * 2;
      const force = (Math.random() * 45 + 20) / b.mass;
      b.vx += Math.cos(angle) * force;
      b.vy += Math.sin(angle) * force;
    }
  }

  /**
   * Integra un paso de física.
   * @param worldMouseX posición del cursor en coordenadas de mundo
   * @param worldMouseY idem
   */
  step(worldMouseX: number, worldMouseY: number): void {
    const { repulsionRadius, repulsionStrength, springStiffness, friction } = PHYSICS;

    for (const b of this.bodies) {
      if (!b.isDragging) {
        const centerX = b.x + b.width / 2;
        const centerY = b.y + b.height / 2;

        // 1. Repulsión magnética del cursor.
        const dx = centerX - worldMouseX;
        const dy = centerY - worldMouseY;
        const dist = Math.hypot(dx, dy);
        if (dist < repulsionRadius && dist > 1) {
          const push = (1 - dist / repulsionRadius) * (repulsionStrength / b.mass);
          b.vx += (dx / dist) * push;
          b.vy += (dy / dist) * push;
        }

        // 2. Muelle de retorno al home.
        b.vx += (b.homeX - b.x) * springStiffness;
        b.vy += (b.homeY - b.y) * springStiffness;

        // 3. Fricción.
        b.vx *= friction;
        b.vy *= friction;

        // 4. Integración.
        b.x += b.vx;
        b.y += b.vy;
      }

      // Escritura directa al DOM: traslación relativa al home + tilt elástico.
      if (b.element) {
        const tiltX = clampTilt(b.vx * 0.4);
        const tiltY = clampTilt(b.vy * 0.4);
        b.element.style.transform =
          `translate3d(${b.x - b.homeX}px, ${b.y - b.homeY}px, 0px) ` +
          `rotate(${tiltX * 0.25}deg) skewX(${tiltY * 0.1}deg)`;
      }
    }
  }
}

function clampTilt(value: number): number {
  return Math.max(-12, Math.min(12, value));
}
