/**
 * Constantes de tuning del motor. Un único lugar para ajustar la "sensación"
 * física del lienzo sin tocar la lógica.
 */

/** Tamaño del mundo (lienzo infinito acotado) en px. */
export const WORLD_SIZE = 4000;

/** Cámara inicial. */
export const INITIAL_CAMERA = {
  x: -1400,
  y: -1250,
  zoom: 1,
} as const;

export const ZOOM = {
  min: 0.4,
  max: 1.8,
  wheelIn: 1.08,
  wheelOut: 0.92,
  buttonIn: 1.2,
  buttonOut: 0.8,
} as const;

/** Factor de interpolación (lerp) de la cámara: más alto = más rápido/rígido. */
export const CAMERA_LERP = 0.12;

/** Física de los cuerpos (tarjetas). */
export const PHYSICS = {
  repulsionRadius: 240,
  repulsionStrength: 18,
  springStiffness: 0.015,
  friction: 0.9,
  /** Amortiguación de la velocidad al arrastrar (para el "throw"). */
  throwDamping: 0.75,
} as const;

/** Masas por categoría. */
export const MASS = {
  satellite: 0.6,
  default: 1.4,
} as const;

/** Estela del cursor y partículas ambientales. */
export const PARTICLES = {
  count: 55,
  maxTrailPoints: 20,
  agitationRadius: 160,
} as const;

/** Puntos de teleport en coordenadas de mundo. */
export const TELEPORT_POINTS = {
  hero: { x: 2140, y: 1900 },
  projects: { x: 1370, y: 1600 },
  skills: { x: 2140, y: 1180 },
  about: { x: 1310, y: 2050 },
  contact: { x: 2850, y: 1950 },
} as const;
