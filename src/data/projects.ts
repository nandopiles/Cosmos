import type { Project } from '@/types';

/**
 * Catálogo de proyectos. Escalable: añadir un proyecto = añadir un objeto aquí,
 * el nodo físico, la tarjeta y el modal se generan automáticamente.
 */
export const projects: Project[] = [
  {
    id: 'p1',
    index: '01',
    title: 'AetherOS: Spatial Audio Kernel',
    shortTitle: 'AetherOS: Spatial Audio Kernel',
    category: 'SISTEMA WEBGL',
    year: '2024',
    accent: 'lime',
    graphic: 'orbit',
    shortDescription:
      'Entorno operativo experimental basado en navegación espacial 3D con simulación de audio binaural y respuesta haptica por nodo de datos.',
    tag: '01 // SISTEMA WEBGL & AUDIO BINAURAL',
    description:
      'AetherOS es una investigación formal sobre interfaces computacionales donde el usuario no hace clic en ventanas planas, sino que navega por una matriz de nodos acústicos tridimensionales.',
    features: [
      'Simulación acústica de sala mediante convolución HRTF en tiempo real.',
      'Shaders GLSL optimizados para renderizado volumétrico sin shaders pesados.',
      'Topología reactiva a la orientación giroscópica y velocidad de desplazamiento.',
    ],
    stack: ['GLSL', 'Three.js', 'Web Audio API', 'Svelte', 'WebAssembly'],
    placement: { top: 1400, left: 1150, width: 440 },
  },
  {
    id: 'p2',
    index: '02',
    title: 'NeuraGraph: Force-Directed Engine',
    shortTitle: 'NeuraGraph: Force-Directed Engine',
    category: 'TOPOLOGÍA DE DATOS',
    year: '2024',
    accent: 'sky',
    graphic: 'constellation',
    shortDescription:
      'Renderizador de grafos masivos en WebGPU capaz de simular colisiones y resortes de Hooke para 100,000 nodos simultáneos a 60 FPS.',
    tag: '02 // COMPUTACIÓN GRÁFICA WEBGPU',
    description:
      'Motor de grafos y física de partículas a gran escala diseñado para visualizar sinapsis neuronales e inteligencias en red con computación paralela nativa en la GPU.',
    features: [
      'Algoritmo Barnes-Hut O(N log N) trasladado a Compute Shaders WGSL.',
      'Capacidad para 100,000 entidades con masa y colisiones elásticas a 60 FPS estables.',
      'Exportación vectorial de alta fidelidad sin pérdida de densidad.',
    ],
    stack: ['WebGPU', 'WGSL', 'Rust', 'TypeScript', 'Canvas2D'],
    placement: { top: 1450, left: 2600, width: 440 },
  },
  {
    id: 'p3',
    index: '03',
    title: 'PulsePay: Elastic Checkout',
    shortTitle: 'PulsePay: Elastic Checkout',
    category: 'FINTECH INTERACTIVA',
    year: '2023',
    accent: 'amber',
    graphic: 'card',
    shortDescription:
      'Flujo transaccional donde las tarjetas de crédito son cuerpos elásticos que se curvan ante la fricción gestual, reduciendo el abandono de carrito en un 38%.',
    tag: '03 // EXPERIENCIA FINTECH FLUIDA',
    description:
      'Reinvención de la pasarela de pago para e-commerce de lujo. Los campos de entrada y la tarjeta plástica responden con deformación viscoelástica según la prisa o precisión del usuario.',
    features: [
      'Reducción del 38% en abandono en paso de checkout.',
      'Cálculo de curvatura Bézier dinámica en tiempo real según vector de arrastre.',
      'Validación biométrica háptica simulada mediante audio-pulsos.',
    ],
    stack: ['React', 'Spring Physics', 'Framer Motion', 'Tailwind CSS'],
    placement: { top: 2250, left: 1300, width: 440 },
  },
  {
    id: 'p4',
    index: '04',
    title: 'Morphic: Fluid UI Framework',
    shortTitle: 'Morphic: Fluid Micro-Interactions',
    category: 'LIBRERÍA OPEN SOURCE',
    year: '2024',
    accent: 'purple',
    graphic: 'blob',
    shortDescription:
      'Librería de componentes reactivos para React que implementan leyes de tensión y viscosidad para inputs, modales y botones de alta sensibilidad.',
    tag: '04 // ARQUITECTURA DE SOFTWARE OPEN SOURCE',
    description:
      'Paquete NPM con más de 120,000 descargas que provee primitivas de React con inercia, magnetismo perimetral y colisiones entre componentes hermanos sin colapsar el DOM.',
    features: [
      'Zero-runtime footprint adicional con micro-motores matemáticos ligeros.',
      'Soporte completo para gestos multitáctil y trackpads de precisión.',
      'Integración sin fricción con Tailwind CSS y styled-components.',
    ],
    stack: ['React 19', 'Popmotion', 'NPM Package', 'Rollup', 'Jest'],
    placement: { top: 2200, left: 2500, width: 440 },
  },
];

export const getProjectById = (id: string): Project | undefined =>
  projects.find((p) => p.id === id);
