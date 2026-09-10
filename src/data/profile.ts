import type { Profile } from '@/types';

/**
 * Datos de identidad. Placeholder — reemplazar por los datos reales de Ferran.
 */
export const profile: Profile = {
  name: 'FERRAN PILES LABLANCA',
  role: 'Ingeniero Frontend Creativo & Diseñador de Interacciones Líquidas',
  bio: 'Concibo la web como una sustancia viva con peso, tensión superficial y memoria elástica. Explora libremente empujando las tarjetas o lánzalas con inercia para reorganizar el cosmos.',
  availability: 'Disponible para experiencias interactivas & WebGL',
  manifestoQuote: '"La pantalla no es papel digital: es un líquido que recuerda el tacto."',
  manifestoParagraphs: [
    'Durante 25 años la web ha insistido en simular documentos impresos que se desplazan de arriba hacia abajo. Sin embargo, las pantallas de cristal actuales son superficies táctiles con potencial de resonancia física.',
    'Mi enfoque une las matemáticas de la física clásica (resortes amortiguados, inercia de Newton y fricción cuadrática) con la precisión tipográfica del diseño editorial suizo.',
  ],
  manifestoStats: [
    { value: '60 FPS', label: 'Física fluida', accent: 'lime' },
    { value: '0.02s', label: 'Latencia gestual', accent: 'sky' },
    { value: '100%', label: 'Código artesanal', accent: 'purple' },
  ],
  social: [
    { label: 'GitHub ↗', url: 'https://github.com' },
    { label: 'X / Twitter ↗', url: 'https://twitter.com' },
    { label: 'LinkedIn ↗', url: 'https://linkedin.com' },
  ],
};
