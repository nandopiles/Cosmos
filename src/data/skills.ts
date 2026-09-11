import type { Skill } from '@/types';

/**
 * Conceptos clave de astronomía que orbitan el núcleo "¿Cómo funciona?" con
 * física de atracción centrípeta. Cada uno es una idea para explorar el cielo.
 */
export const skills: Skill[] = [
  { id: 'skill-1', label: 'Gravedad & órbitas', accent: 'lime', placement: { top: 960, left: 1780 } },
  { id: 'skill-2', label: 'Años luz & distancias', accent: 'sky', placement: { top: 920, left: 2150 } },
  { id: 'skill-3', label: 'Eclipses solares y lunares', accent: 'amber', placement: { top: 1250, left: 1680 } },
  { id: 'skill-4', label: 'Cometas & asteroides', accent: 'purple', placement: { top: 1320, left: 2360 } },
  { id: 'skill-5', label: 'Zona habitable', accent: 'emerald', placement: { top: 1040, left: 2420 } },
  { id: 'skill-6', label: 'Nacimiento de las estrellas', accent: 'rose', placement: { top: 1380, left: 1980 } },
];
