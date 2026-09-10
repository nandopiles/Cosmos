import { useEffect, useRef } from 'react';
import { useCanvas } from '@/context/CanvasContext';
import type { Camera } from '@/engine/camera';
import type { PhysicsWorld } from '@/engine/physics';
import type { NodeCategory } from '@/types';

const MINI_W = 140;
const MINI_H = 90;

const RADAR_COLOR: Partial<Record<NodeCategory, string>> = {
  project: '#38bdf8',
  identity: '#bef264',
  contact: '#f43f5e',
};
const RADAR_DEFAULT = '#a855f7';

/**
 * Radar 2D en tiempo real: dibuja los nodos y el rectángulo de la cámara.
 * Se registra en el loop central via registerMinimap (draw se llama cada frame).
 */
export function Minimap() {
  const { registerMinimap, worldSize } = useCanvas();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cameraBoxRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const camBox = cameraBoxRef.current;
    if (!canvas || !camBox) return;
    canvas.width = MINI_W;
    canvas.height = MINI_H;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const scaleX = MINI_W / worldSize;
    const scaleY = MINI_H / worldSize;

    registerMinimap((camera: Camera, world: PhysicsWorld) => {
      ctx.clearRect(0, 0, MINI_W, MINI_H);

      for (const node of world.bodies) {
        ctx.fillStyle = RADAR_COLOR[node.category] ?? RADAR_DEFAULT;
        ctx.fillRect(
          node.x * scaleX,
          node.y * scaleY,
          Math.max(3, node.width * scaleX),
          Math.max(3, node.height * scaleY),
        );
      }

      const camW = (window.innerWidth / camera.state.zoom) * scaleX;
      const camH = (window.innerHeight / camera.state.zoom) * scaleY;
      const camLeft = (-camera.state.x / camera.state.zoom) * scaleX;
      const camTop = (-camera.state.y / camera.state.zoom) * scaleY;

      camBox.style.width = `${Math.min(MINI_W, Math.max(10, camW))}px`;
      camBox.style.height = `${Math.min(MINI_H, Math.max(8, camH))}px`;
      camBox.style.left = `${Math.max(0, Math.min(MINI_W - camW, camLeft))}px`;
      camBox.style.top = `${Math.max(0, Math.min(MINI_H - camH, camTop))}px`;
    });
  }, [registerMinimap, worldSize]);

  return (
    <div className="glass-panel group relative overflow-hidden rounded-2xl p-1.5 shadow-2xl">
      <canvas ref={canvasRef} className="minimap-canvas" />
      <div ref={cameraBoxRef} className="minimap-camera" />
      <div className="pointer-events-none absolute bottom-2 left-3 rounded bg-slate-900/80 px-1.5 py-0.5 font-mono text-[10px] text-slate-400">
        Radar 2D
      </div>
    </div>
  );
}
