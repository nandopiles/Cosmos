import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera } from '@/engine/camera';
import { PhysicsWorld } from '@/engine/physics';
import { ParticleField } from '@/engine/particles';
import { audioEngine } from '@/engine/audio';
import { WORLD_SIZE, ZOOM } from '@/engine/constants';
import type { NodeCategory, TeleportTarget } from '@/types';

/** Info mínima para registrar un nodo en el mundo de física. */
export interface RegisterNodeArgs {
  id: string;
  category: NodeCategory;
  homeX: number;
  homeY: number;
  index: number;
  element: HTMLElement;
}

/** Estado "lento" (baja frecuencia) que sí interesa a React para el HUD. */
export interface HudState {
  coordX: number;
  coordY: number;
  zoomPct: number;
  fps: number;
}

/**
 * Orquestador central del lienzo vivo.
 *
 * Estrategia de rendimiento clave:
 *  - Un ÚNICO requestAnimationFrame conduce cámara + física + partículas.
 *  - Las posiciones (60fps) se escriben directo al DOM vía refs (0 re-renders).
 *  - El HUD (coords, zoom, fps) se sincroniza a React solo ~6 veces/seg.
 */
export function useLivingCanvas(reducedMotion: boolean) {
  const cameraRef = useRef<Camera | null>(null);
  const worldRef = useRef<PhysicsWorld | null>(null);
  const particlesRef = useRef<ParticleField | null>(null);

  if (!cameraRef.current) cameraRef.current = new Camera();
  if (!worldRef.current) worldRef.current = new PhysicsWorld();

  // Elementos DOM controlados por el loop.
  const worldElRef = useRef<HTMLDivElement | null>(null);
  const viewportElRef = useRef<HTMLDivElement | null>(null);
  const trailCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const minimapRef = useRef<{ draw: (camera: Camera, world: PhysicsWorld) => void } | null>(null);

  // Estado del ratón (screen space) en refs para no re-renderizar.
  const mouse = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  // Pan del fondo.
  const panning = useRef(false);
  const panStart = useRef({ x: 0, y: 0 });

  const [hud, setHud] = useState<HudState>({ coordX: 0, coordY: 0, zoomPct: 100, fps: 60 });

  /** Registra un nodo físico (llamado por cada PhysicsNode al montar). */
  const registerNode = useCallback((args: RegisterNodeArgs) => {
    const world = worldRef.current!;
    const rect = args.element.getBoundingClientRect();
    const zoom = cameraRef.current!.state.zoom || 1;
    const body = world.getBody(args.id) ?? world.addBody({
      id: args.id,
      category: args.category,
      homeX: args.homeX,
      homeY: args.homeY,
      width: rect.width / zoom || 380,
      height: rect.height / zoom || 260,
      index: args.index,
    });
    body.element = args.element;
    return () => {
      body.element = null;
    };
  }, []);

  const registerMinimap = useCallback(
    (draw: (camera: Camera, world: PhysicsWorld) => void) => {
      minimapRef.current = { draw };
    },
    [],
  );

  /** Comienza a arrastrar un nodo concreto. */
  const beginNodeDrag = useCallback((id: string, clientX: number, clientY: number) => {
    const { x, y } = cameraRef.current!.screenToWorld(clientX, clientY);
    worldRef.current!.startDrag(id, x, y);
    audioEngine.microClick(480, 'sine', 0.05, 0.1);
  }, []);

  const scatter = useCallback(() => {
    worldRef.current!.scatter();
    audioEngine.whoosh(24);
  }, []);

  const teleport = useCallback((target: TeleportTarget) => {
    cameraRef.current!.teleport(target, window.innerWidth, window.innerHeight);
    audioEngine.whoosh(12);
  }, []);

  const zoomBy = useCallback((factor: number) => {
    cameraRef.current!.zoomBy(factor, window.innerWidth, window.innerHeight);
    audioEngine.microClick(factor > 1 ? 320 : 260);
  }, []);

  // ---- Efecto de montaje: eventos + loop principal ----
  useEffect(() => {
    const camera = cameraRef.current!;
    const world = worldRef.current!;
    const viewport = viewportElRef.current;
    const worldEl = worldElRef.current;
    if (!viewport || !worldEl) return;

    // Partículas (canvas overlay).
    if (trailCanvasRef.current) {
      particlesRef.current = new ParticleField(trailCanvasRef.current);
      particlesRef.current.enabled = !reducedMotion;
    }

    const onResize = () => particlesRef.current?.resize();
    window.addEventListener('resize', onResize);

    // --- Puntero global ---
    const onPointerMove = (e: PointerEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;
      particlesRef.current?.setMouse(e.clientX, e.clientY);

      const w = camera.screenToWorld(e.clientX, e.clientY);
      world.drag(w.x, w.y);

      if (panning.current) {
        camera.panTo(e.clientX - panStart.current.x, e.clientY - panStart.current.y);
      }
    };

    const onPointerDown = (e: PointerEvent) => {
      // Pan solo si se pulsa el fondo (viewport/world), no una tarjeta.
      if (e.target === viewport || e.target === worldEl) {
        panning.current = true;
        panStart.current = { x: e.clientX - camera.state.targetX, y: e.clientY - camera.state.targetY };
        viewport.style.cursor = 'grabbing';
      }
    };

    const onPointerUp = () => {
      if (panning.current) {
        panning.current = false;
        viewport.style.cursor = 'default';
      }
      const throwSpeed = world.endDrag();
      if (throwSpeed > 4) audioEngine.whoosh(throwSpeed);
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const factor = e.deltaY < 0 ? ZOOM.wheelIn : ZOOM.wheelOut;
      camera.zoomAt(e.clientX, e.clientY, factor);
      audioEngine.microClick(280, 'triangle', 0.02, 0.04);
    };

    window.addEventListener('pointermove', onPointerMove);
    viewport.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointerup', onPointerUp);
    viewport.addEventListener('wheel', onWheel, { passive: false });

    // --- Loop principal ---
    let raf = 0;
    let hudAccumulator = 0;
    let lastTime = performance.now();
    let frames = 0;
    let fpsTimer = 0;
    let currentFps = 60;

    const loop = (now: number) => {
      const dt = now - lastTime;
      lastTime = now;

      // FPS (media por segundo).
      frames++;
      fpsTimer += dt;
      if (fpsTimer >= 1000) {
        currentFps = Math.round((frames * 1000) / fpsTimer);
        frames = 0;
        fpsTimer = 0;
      }

      // 1. Cámara.
      camera.step();
      worldEl.style.transform =
        `translate(${camera.state.x}px, ${camera.state.y}px) scale(${camera.state.zoom})`;

      // 2. Física (usa el ratón en world space).
      const wm = camera.screenToWorld(mouse.current.x, mouse.current.y);
      world.step(wm.x, wm.y);

      // 3. Partículas / estela.
      particlesRef.current?.render();

      // 4. Minimapa.
      minimapRef.current?.draw(camera, world);

      // 5. Sincroniza HUD a baja frecuencia (~6/s).
      hudAccumulator += dt;
      if (hudAccumulator >= 160) {
        hudAccumulator = 0;
        const center = camera.worldCenter(window.innerWidth, window.innerHeight);
        setHud({
          coordX: center.x,
          coordY: center.y,
          zoomPct: Math.round(camera.state.zoom * 100),
          fps: currentFps,
        });
      }

      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('pointermove', onPointerMove);
      viewport.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointerup', onPointerUp);
      viewport.removeEventListener('wheel', onWheel);
    };
  }, [reducedMotion]);

  return {
    // refs a conectar en el JSX
    worldElRef,
    viewportElRef,
    trailCanvasRef,
    // API
    registerNode,
    registerMinimap,
    beginNodeDrag,
    scatter,
    teleport,
    zoomBy,
    hud,
    worldSize: WORLD_SIZE,
    // acceso directo (para minimapa)
    cameraRef,
    worldRef,
  };
}

export type LivingCanvasApi = ReturnType<typeof useLivingCanvas>;
