import type { CameraState, TeleportTarget } from '@/types';
import { CAMERA_LERP, INITIAL_CAMERA, TELEPORT_POINTS, ZOOM } from './constants';

/**
 * Cámara del lienzo infinito estilo Figma/Miro.
 * Mantiene estado actual + destino y avanza con interpolación suave.
 * Pura: no toca el DOM ni React; el consumidor lee `state` cada frame.
 */
export class Camera {
  state: CameraState;

  constructor() {
    this.state = {
      x: INITIAL_CAMERA.x,
      y: INITIAL_CAMERA.y,
      targetX: INITIAL_CAMERA.x,
      targetY: INITIAL_CAMERA.y,
      zoom: INITIAL_CAMERA.zoom,
      targetZoom: INITIAL_CAMERA.zoom,
    };
  }

  /** Avanza un frame de interpolación. Llamar dentro del rAF loop. */
  step(): void {
    const s = this.state;
    s.x += (s.targetX - s.x) * CAMERA_LERP;
    s.y += (s.targetY - s.y) * CAMERA_LERP;
    s.zoom += (s.targetZoom - s.zoom) * CAMERA_LERP;
  }

  /** Convierte coordenadas de pantalla a coordenadas de mundo. */
  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: (screenX - this.state.x) / this.state.zoom,
      y: (screenY - this.state.y) / this.state.zoom,
    };
  }

  /** Centro del viewport en coordenadas de mundo (para el display de coords). */
  worldCenter(viewW: number, viewH: number): { x: number; y: number } {
    return {
      x: Math.round(-this.state.x + viewW / (2 * this.state.zoom)),
      y: Math.round(-this.state.y + viewH / (2 * this.state.zoom)),
    };
  }

  panTo(targetX: number, targetY: number): void {
    this.state.targetX = targetX;
    this.state.targetY = targetY;
  }

  /** Zoom hacia un punto de pantalla (mantiene ese punto fijo). */
  zoomAt(screenX: number, screenY: number, factor: number): void {
    const s = this.state;
    const newZoom = clamp(s.targetZoom * factor, ZOOM.min, ZOOM.max);
    const worldX = (screenX - s.targetX) / s.targetZoom;
    const worldY = (screenY - s.targetY) / s.targetZoom;
    s.targetX = screenX - worldX * newZoom;
    s.targetY = screenY - worldY * newZoom;
    s.targetZoom = newZoom;
  }

  /** Zoom centrado en el viewport (para botones +/-). */
  zoomBy(factor: number, viewW: number, viewH: number): void {
    this.zoomAt(viewW / 2, viewH / 2, factor);
  }

  /** Teleporta la cámara para centrar un punto de interés. */
  teleport(target: TeleportTarget, viewW: number, viewH: number): void {
    const point = TELEPORT_POINTS[target];
    this.state.targetX = viewW / 2 - point.x * this.state.zoom;
    this.state.targetY = viewH / 2 - point.y * this.state.zoom;
  }
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}
