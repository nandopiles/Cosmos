/**
 * Tipos compartidos del sistema "Espacio Vivo".
 * Un único lugar de verdad para las formas de datos y del motor.
 */

/** Categorías de nodos físicos en el lienzo. Determinan masa y color en el radar. */
export type NodeCategory =
  | 'identity'
  | 'project'
  | 'skills'
  | 'skill-satellite'
  | 'manifesto'
  | 'interactive'
  | 'contact';

/** Acentos de color del sistema, mapeados a clases Tailwind. */
export type AccentColor = 'lime' | 'sky' | 'amber' | 'purple' | 'rose' | 'emerald';

/** Posición inicial (en coordenadas de mundo) y tamaño opcional de un nodo. */
export interface NodePlacement {
  top: number;
  left: number;
  width?: number;
}

/** Un cuerpo rígido simulado por el motor de física. */
export interface PhysicsBody {
  id: string;
  category: NodeCategory;
  /** Posición de reposo (home) a la que el muelle devuelve el cuerpo. */
  homeX: number;
  homeY: number;
  /** Posición actual simulada. */
  x: number;
  y: number;
  /** Velocidad actual. */
  vx: number;
  vy: number;
  width: number;
  height: number;
  mass: number;
  isDragging: boolean;
  /** Cursor encima: se suspende la repulsión para permitir interacción. */
  isHovered: boolean;
  /** Fase única para la deriva ambiental (respiración). */
  driftPhase: number;
  /** Elemento DOM asociado, escrito directamente para evitar re-renders. */
  element: HTMLElement | null;
  dragOffsetX: number;
  dragOffsetY: number;
  lastDragX: number;
  lastDragY: number;
}

/** Estado de la cámara del lienzo infinito (con destino para el lerp). */
export interface CameraState {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  zoom: number;
  targetZoom: number;
}

/** Destinos de teleport del HUD. */
export type TeleportTarget = 'hero' | 'projects' | 'skills' | 'about' | 'contact';

/** Datos de un proyecto del portfolio. */
export interface Project {
  id: string;
  index: string;
  title: string;
  shortTitle: string;
  category: string;
  year: string;
  accent: AccentColor;
  shortDescription: string;
  description: string;
  tag: string;
  features: string[];
  stack: string[];
  /** Tipo de gráfico SVG orgánico a renderizar en la cabecera. */
  graphic: 'orbit' | 'constellation' | 'card' | 'blob';
  placement: NodePlacement;
}

/** Una habilidad satélite orbitando el núcleo. */
export interface Skill {
  id: string;
  label: string;
  accent: AccentColor;
  placement: NodePlacement;
}

/** Métrica destacada del manifiesto. */
export interface ManifestoStat {
  value: string;
  label: string;
  accent: AccentColor;
}

/** Perfil / identidad del portfolio. */
export interface Profile {
  name: string;
  role: string;
  bio: string;
  availability: string;
  manifestoQuote: string;
  manifestoParagraphs: string[];
  manifestoStats: ManifestoStat[];
  social: { label: string; url: string }[];
}
