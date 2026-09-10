import type { Skill } from '@/types';

/**
 * Habilidades satélite que orbitan el núcleo con física de atracción.
 */
export const skills: Skill[] = [
  { id: 'skill-1', label: 'WebGL & GLSL Shaders', accent: 'lime', placement: { top: 960, left: 1780 } },
  { id: 'skill-2', label: 'Three.js / React Three Fiber', accent: 'sky', placement: { top: 920, left: 2150 } },
  { id: 'skill-3', label: 'Simulación de Partículas (Verlet)', accent: 'amber', placement: { top: 1250, left: 1680 } },
  { id: 'skill-4', label: 'Web Audio API Reactiva', accent: 'purple', placement: { top: 1320, left: 2360 } },
  { id: 'skill-5', label: 'Arquitectura Next.js & TypeScript', accent: 'emerald', placement: { top: 1040, left: 2420 } },
  { id: 'skill-6', label: 'Canvas 2D de Alto Rendimiento', accent: 'rose', placement: { top: 1380, left: 1980 } },
];
