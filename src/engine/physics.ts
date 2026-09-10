import type { NodeCategory, PhysicsBody } from '@/types';
import { MASS, PHYSICS, WORLD_SIZE } from './constants';

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
   * BIG BANG: reubica todos los cuerpos en un nuevo cosmos.
   *
   * A diferencia de un simple empujón, esto reasigna la posición "home" de
   * cada card a un nuevo punto (distribuido en anillos alrededor del centro
   * del mundo) y lanza cada cuerpo con un impulso radial fuerte desde el
   * origen. El resultado: una explosión que de verdad cambia el layout, y
   * luego los muelles asientan las cards en sus nuevas casas.
   */
  bigBang(): void {
    const center = WORLD_SIZE / 2;
    const movable = this.bodies.filter((b) => b.category !== 'skill-satellite');
    const satellites = this.bodies.filter((b) => b.category === 'skill-satellite');

    // Reparte las cards grandes en un anillo con jitter; los satélites en un
    // anillo interior más denso.
    this.placeInRing(movable, center, 780, 320);
    this.placeInRing(satellites, center, 430, 180);

    // Impulso radial explosivo desde el centro del mundo.
    for (const b of this.bodies) {
      const cx = b.x + b.width / 2;
      const cy = b.y + b.height / 2;
      let dx = cx - center;
      let dy = cy - center;
      let dist = Math.hypot(dx, dy);
      if (dist < 1) {
        const a = Math.random() * Math.PI * 2;
        dx = Math.cos(a);
        dy = Math.sin(a);
        dist = 1;
      }
      const force = (Math.random() * 40 + 55) / b.mass;
      b.vx += (dx / dist) * force;
      b.vy += (dy / dist) * force;
    }
  }

  /** Coloca los homes de un grupo en un anillo alrededor del centro. */
  private placeInRing(group: PhysicsBody[], center: number, radius: number, jitter: number): void {
    const n = group.length;
    if (n === 0) return;
    // Barajado del orden angular para que no queden por categoría.
    const angleOffset = Math.random() * Math.PI * 2;
    group.forEach((b, i) => {
      const angle = angleOffset + (i / n) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      const r = radius + (Math.random() - 0.5) * jitter;
      const hx = center + Math.cos(angle) * r - b.width / 2;
      const hy = center + Math.sin(angle) * r - b.height / 2;
      b.homeX = hx;
      b.homeY = hy;
    });
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

    // 5. Colisiones entre cuerpos (AABB): se empujan en vez de solaparse.
    this.resolveCollisions();

    // 6. Escritura al DOM.
    for (const b of this.bodies) {
      if (!b.element) continue;
      const tiltX = clampTilt(b.vx * 0.4);
      const tiltY = clampTilt(b.vy * 0.4);
      b.element.style.transform =
        `translate3d(${b.x - b.homeX}px, ${b.y - b.homeY}px, 0px) ` +
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
      for (let j = i + 1; j < bodies.length; j++) {
        const b = bodies[j];
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
