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

  /** Reloj interno para la deriva ambiental (flotación espacial). */
  private clock = 0;

  addBody(init: BodyInit): PhysicsBody {
    const mass = init.category === 'skill-satellite' ? MASS.satellite : MASS.default;
    const body: PhysicsBody = {
      id: init.id,
      category: init.category,
      homeX: init.homeX,
      homeY: init.homeY,
      baseX: init.homeX,
      baseY: init.homeY,
      // Dispersión + caída inicial escalonada para una entrada con "gravedad".
      x: init.homeX + (Math.random() - 0.5) * 40,
      y: init.homeY - 250 - init.index * 40,
      vx: 0,
      vy: 0,
      width: init.width,
      height: init.height,
      mass,
      isDragging: false,
      isHovered: false,
      isReturning: false,
      driftPhase: Math.random() * Math.PI * 2,
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
    b.isReturning = false; // agarrar cancela el retorno
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

  /** Marca/desmarca un cuerpo como bajo el cursor (suspende su repulsión). */
  setHovered(id: string, hovered: boolean): void {
    const b = this.byId.get(id);
    if (b) b.isHovered = hovered;
  }

  /**
   * RESET: devuelve todas las cards a su posición original de forma FIABLE.
   *
   * Activa un modo "returning" por cuerpo en el que se ignora la repulsión del
   * cursor y la deriva ambiental, y se aplica un muelle fuerte hacia la base.
   * El modo se desactiva solo cuando el cuerpo llega y se detiene, así ninguna
   * card puede quedarse "enganchada" por las físicas normales.
   */
  reset(): void {
    for (const b of this.bodies) {
      b.homeX = b.baseX;
      b.homeY = b.baseY;
      b.isReturning = true;
      // Frena la inercia actual para un retorno limpio.
      b.vx *= 0.2;
      b.vy *= 0.2;
    }
  }

  /**
   * Integra un paso de física.
   * @param worldMouseX posición del cursor en coordenadas de mundo
   * @param worldMouseY idem
   */
  step(worldMouseX: number, worldMouseY: number): void {
    const { repulsionRadius, repulsionStrength, springStiffness, friction, driftAmplitude } = PHYSICS;
    this.clock += 0.01;

    for (const b of this.bodies) {
      if (!b.isDragging) {
        if (b.isReturning) {
          // MODO RETORNO (reset): muelle fuerte al home base, sin repulsión ni
          // deriva. Así la card no puede reengancharse y llega con seguridad.
          b.vx += (b.homeX - b.x) * 0.14;
          b.vy += (b.homeY - b.y) * 0.14;
          b.vx *= 0.78;
          b.vy *= 0.78;
          b.x += b.vx;
          b.y += b.vy;

          // ¿Ya llegó y casi parado? Sale del modo retorno.
          const dHome = Math.hypot(b.homeX - b.x, b.homeY - b.y);
          const speed = Math.hypot(b.vx, b.vy);
          if (dHome < 1.2 && speed < 0.4) {
            b.x = b.homeX;
            b.y = b.homeY;
            b.vx = 0;
            b.vy = 0;
            b.isReturning = false;
          }
        } else {
          const centerX = b.x + b.width / 2;
          const centerY = b.y + b.height / 2;

          // 1. Repulsión magnética del cursor (siempre activa: sensación espacial).
          //    Se suspende SOLO si el cursor está sobre la card, para poder
          //    interactuar con su contenido (inputs, botones) sin que huya.
          if (!b.isHovered) {
            const dx = centerX - worldMouseX;
            const dy = centerY - worldMouseY;
            const dist = Math.hypot(dx, dy);
            if (dist < repulsionRadius && dist > 1) {
              const push = (1 - dist / repulsionRadius) * (repulsionStrength / b.mass);
              b.vx += (dx / dist) * push;
              b.vy += (dy / dist) * push;
            }

            // 2. Flotación espacial: micro-movimiento perpetuo, siempre presente.
            const driftX = Math.sin(this.clock * 0.7 + b.driftPhase) * driftAmplitude;
            const driftY = Math.cos(this.clock * 0.5 + b.driftPhase * 1.3) * driftAmplitude;
            b.vx += (b.homeX + driftX - b.x) * springStiffness;
            b.vy += (b.homeY + driftY - b.y) * springStiffness;
          } else {
            // 2'. En hover: muelle limpio al home (sin deriva) para estabilidad.
            b.vx += (b.homeX - b.x) * springStiffness;
            b.vy += (b.homeY - b.y) * springStiffness;
          }

          // 3. Fricción.
          b.vx *= friction;
          b.vy *= friction;

          // 4. Integración.
          b.x += b.vx;
          b.y += b.vy;
        }
      }
    }

    // 5. Colisiones entre cuerpos (AABB): se empujan en vez de solaparse.
    this.resolveCollisions();

    // 6. Escritura al DOM.
    for (const b of this.bodies) {
      if (!b.element) continue;
      const tiltX = clampTilt(b.vx * 0.4);
      const tiltY = clampTilt(b.vy * 0.4);
      // Transform SIEMPRE relativo a la posición base del DOM (baseX/baseY),
      // no a homeX/homeY: así el Big Bang puede reubicar la home libremente.
      b.element.style.transform =
        `translate3d(${b.x - b.baseX}px, ${b.y - b.baseY}px, 0px) ` +
        `rotate(${tiltX * 0.25}deg) skewX(${tiltY * 0.1}deg)`;
    }
  }

  /**
   * Resolución simple de colisiones por solapamiento de cajas (AABB).
   * Separa los cuerpos por el eje de menor penetración y transfiere algo de
   * velocidad, dando sensación de choque. O(n²) — aceptable para ~15 nodos.
   */
  private resolveCollisions(): void {
    const stiffness = PHYSICS.collisionStiffness;
    const bodies = this.bodies;
    for (let i = 0; i < bodies.length; i++) {
      const a = bodies[i];
      if (a.isReturning) continue; // en reset: sin colisiones que lo desvíen
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j];
        if (b.isReturning) continue;
        // Solapamiento en cada eje.
        const overlapX = a.width / 2 + b.width / 2 - Math.abs(a.x + a.width / 2 - (b.x + b.width / 2));
        const overlapY = a.height / 2 + b.height / 2 - Math.abs(a.y + a.height / 2 - (b.y + b.height / 2));
        if (overlapX <= 0 || overlapY <= 0) continue;

        // Empuja por el eje de menor penetración.
        if (overlapX < overlapY) {
          const dir = a.x < b.x ? -1 : 1;
          const push = (overlapX * stiffness) / 2;
          if (!a.isDragging) { a.x += dir * push; a.vx += dir * push * 0.15; }
          if (!b.isDragging) { b.x -= dir * push; b.vx -= dir * push * 0.15; }
        } else {
          const dir = a.y < b.y ? -1 : 1;
          const push = (overlapY * stiffness) / 2;
          if (!a.isDragging) { a.y += dir * push; a.vy += dir * push * 0.15; }
          if (!b.isDragging) { b.y -= dir * push; b.vy -= dir * push * 0.15; }
        }
      }
    }
  }
}

function clampTilt(value: number): number {
  return Math.max(-12, Math.min(12, value));
}
