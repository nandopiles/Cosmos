import { PARTICLES } from './constants';

interface AmbientParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  baseAlpha: number;
}

interface TrailPoint {
  x: number;
  y: number;
  speed: number;
}

/**
 * Sistema de estela fluida del cursor + partículas ambientales reactivas,
 * dibujado sobre un <canvas> a pantalla completa.
 *
 * Puro respecto a React: recibe el canvas y se auto-gestiona. El consumidor
 * solo alimenta la posición del ratón y llama a `render` cada frame.
 */
export class ParticleField {
  private ctx: CanvasRenderingContext2D;
  private width = 0;
  private height = 0;

  private trail: TrailPoint[] = [];
  private particles: AmbientParticle[] = [];

  private mouseX = 0;
  private mouseY = 0;
  private lastMouseX = 0;
  private lastMouseY = 0;
  private mouseSpeed = 0;

  /** Si false, no dibuja partículas ni estela (modo reduced-motion). */
  enabled = true;

  private canvas: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('No 2D context available for particle canvas');
    this.ctx = ctx;
    this.resize();
    this.seed();
  }

  resize(): void {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.height = window.innerHeight;
    this.canvas.height = this.height;
  }

  private seed(): void {
    this.particles = [];
    for (let i = 0; i < PARTICLES.count; i++) {
      const baseAlpha = Math.random() * 0.5 + 0.2;
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        alpha: baseAlpha,
        baseAlpha,
      });
    }
    this.mouseX = this.width / 2;
    this.mouseY = this.height / 2;
    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;
  }

  setMouse(x: number, y: number): void {
    this.mouseX = x;
    this.mouseY = y;
  }

  render(): void {
    const { ctx, width, height } = this;
    ctx.clearRect(0, 0, width, height);
    if (!this.enabled) return;

    // Velocidad del cursor.
    const dx = this.mouseX - this.lastMouseX;
    const dy = this.mouseY - this.lastMouseY;
    this.mouseSpeed = Math.hypot(dx, dy);
    this.lastMouseX = this.mouseX;
    this.lastMouseY = this.mouseY;

    // Alimenta la estela.
    this.trail.push({ x: this.mouseX, y: this.mouseY, speed: this.mouseSpeed });
    if (this.trail.length > PARTICLES.maxTrailPoints) this.trail.shift();

    this.drawRibbon();
    this.drawCursorDot();
    this.drawParticles();
  }

  private drawRibbon(): void {
    const { ctx, trail } = this;
    if (trail.length <= 2) return;

    const stroke = (color: string, lineWidth: number) => {
      ctx.beginPath();
      ctx.moveTo(trail[0].x, trail[0].y);
      for (let i = 1; i < trail.length - 1; i++) {
        const xc = (trail[i].x + trail[i + 1].x) / 2;
        const yc = (trail[i].y + trail[i + 1].y) / 2;
        ctx.quadraticCurveTo(trail[i].x, trail[i].y, xc, yc);
      }
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.stroke();
    };

    const outerWidth = Math.min(10, Math.max(2, this.mouseSpeed * 0.25));
    stroke('rgba(190, 242, 100, 0.45)', outerWidth);
    stroke('rgba(255, 255, 255, 0.75)', Math.max(1, outerWidth * 0.35));
  }

  private drawCursorDot(): void {
    const { ctx } = this;
    ctx.beginPath();
    ctx.arc(this.mouseX, this.mouseY, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#bef264';
    ctx.shadowColor = '#bef264';
    ctx.shadowBlur = 12;
    ctx.fill();
    ctx.shadowBlur = 0;
  }

  private drawParticles(): void {
    const { ctx, width, height } = this;
    const radius = PARTICLES.agitationRadius;

    for (const p of this.particles) {
      const pdx = p.x - this.mouseX;
      const pdy = p.y - this.mouseY;
      const dist = Math.hypot(pdx, pdy);

      // Agitación proporcional a la velocidad del cursor.
      if (dist < radius && this.mouseSpeed > 2) {
        const force = (1 - dist / radius) * (this.mouseSpeed * 0.08);
        p.vx += (pdx / dist) * force;
        p.vy += (pdy / dist) * force;
        p.alpha = Math.min(0.9, p.baseAlpha + 0.4);
      } else {
        p.alpha += (p.baseAlpha - p.alpha) * 0.05;
      }

      // Fricción + deriva ambiental.
      p.vx *= 0.94;
      p.vy *= 0.94;
      p.x += p.vx + 0.15;
      p.y += p.vy + 0.1;

      // Wrap-around en los bordes.
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      // Estiramiento según velocidad (efecto "cometa").
      const stretch = Math.min(8, Math.hypot(p.vx, p.vy) * 2);
      ctx.beginPath();
      ctx.ellipse(p.x, p.y, p.radius + stretch, p.radius, Math.atan2(p.vy, p.vx), 0, Math.PI * 2);
      ctx.fillStyle = `rgba(190, 242, 100, ${p.alpha})`;
      ctx.fill();
    }
  }
}
