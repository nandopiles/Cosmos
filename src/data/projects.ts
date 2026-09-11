import type { Project } from '@/types';

/**
 * Catálogo de cuerpos del Sistema Solar. Escalable: añadir un cuerpo = añadir un
 * objeto aquí, y el nodo físico, la tarjeta y la ficha se generan solos.
 * Los datos son cifras reales (NASA / ESA), redondeadas para divulgación.
 */
export const projects: Project[] = [
  {
    id: 'p1',
    index: '01',
    title: 'El Sol',
    shortTitle: 'El Sol',
    category: 'ESTRELLA · ENANA AMARILLA',
    year: 'Tipo G2V',
    accent: 'amber',
    graphic: 'orbit',
    shortDescription:
      'La estrella que lo sostiene todo. Concentra el 99,8% de la masa del Sistema Solar y fusiona 600 millones de toneladas de hidrógeno cada segundo.',
    tag: '01 // ESTRELLA CENTRAL DEL SISTEMA SOLAR',
    description:
      'El Sol es una esfera de plasma incandescente en cuyo núcleo, a 15 millones de grados, la fusión nuclear convierte hidrógeno en helio y libera la energía que ilumina y calienta cada planeta que lo orbita.',
    features: [
      'Su gravedad mantiene en órbita a los ocho planetas y a millones de cuerpos menores.',
      'La luz tarda unos 8 minutos y 20 segundos en recorrer los 150 millones de km hasta la Tierra.',
      'Convierte cada segundo unas 600 millones de toneladas de hidrógeno en helio.',
    ],
    stack: ['1,4 M km Ø', '5.500 °C superficie', '4.600 M años', '73% hidrógeno'],
    placement: { top: 1400, left: 1150, width: 440 },
  },
  {
    id: 'p2',
    index: '03',
    title: 'La Tierra',
    shortTitle: 'La Tierra',
    category: 'PLANETA · MUNDO OCEÁNICO',
    year: '3ª órbita',
    accent: 'sky',
    graphic: 'constellation',
    shortDescription:
      'El único mundo conocido con vida. Un 71% de su superficie es agua líquida y su atmósfera y campo magnético nos protegen de la radiación solar.',
    tag: '03 // TERCER PLANETA · ZONA HABITABLE',
    description:
      'La Tierra orbita en la franja donde el agua puede existir en estado líquido. Su rotación de 24 horas, la inclinación de su eje y su única Luna generan las estaciones, las mareas y un clima estable durante miles de millones de años.',
    features: [
      'Un 71% de la superficie está cubierta de agua líquida, clave para la vida.',
      'Su campo magnético desvía el viento solar y protege la atmósfera.',
      'La Luna estabiliza la inclinación del eje y provoca las mareas.',
    ],
    stack: ['12.742 km Ø', '365,25 días', '1 Luna', '15 °C media'],
    placement: { top: 1450, left: 2600, width: 440 },
  },
  {
    id: 'p3',
    index: '05',
    title: 'Júpiter',
    shortTitle: 'Júpiter',
    category: 'GIGANTE GASEOSO',
    year: '5ª órbita',
    accent: 'rose',
    graphic: 'card',
    shortDescription:
      'El planeta más grande del Sistema Solar. Tan masivo que cabrían más de 1.300 Tierras dentro, con una tormenta que ruge desde hace siglos.',
    tag: '05 // EL REY DE LOS PLANETAS',
    description:
      'Júpiter es una bola de hidrógeno y helio sin superficie sólida definida. Su enorme gravedad actúa como escudo del Sistema Solar interior, atrayendo cometas y asteroides que de otro modo podrían impactar en la Tierra.',
    features: [
      'La Gran Mancha Roja es una tormenta anticiclónica mayor que la Tierra, activa desde hace siglos.',
      'Tiene al menos 95 lunas confirmadas, entre ellas Europa, con un océano bajo el hielo.',
      'Completa una rotación en menos de 10 horas: el día más corto del Sistema Solar.',
    ],
    stack: ['139.820 km Ø', '12 años', '95+ lunas', 'H₂ + He'],
    placement: { top: 2250, left: 1300, width: 440 },
  },
  {
    id: 'p4',
    index: '06',
    title: 'Saturno',
    shortTitle: 'Saturno · el señor de los anillos',
    category: 'GIGANTE CON ANILLOS',
    year: '6ª órbita',
    accent: 'purple',
    graphic: 'blob',
    shortDescription:
      'Famoso por su espectacular sistema de anillos de hielo y roca. Es tan poco denso que flotaría en el agua si existiera un océano lo bastante grande.',
    tag: '06 // EL PLANETA DE LOS ANILLOS',
    description:
      'Los anillos de Saturno se extienden hasta 280.000 km pero apenas tienen unos metros de grosor. Están formados por miles de millones de trozos de hielo y roca, desde granos de polvo hasta bloques del tamaño de una montaña.',
    features: [
      'Sus anillos son en su mayoría hielo de agua y se extienden más de 280.000 km.',
      'Su densidad es tan baja que flotaría en agua: menos densa que este planeta.',
      'Titán, su mayor luna, tiene ríos y lagos de metano líquido.',
    ],
    stack: ['116.460 km Ø', '29 años', '146+ lunas', 'Densidad 0,69'],
    placement: { top: 2200, left: 2500, width: 440 },
  },
];

export const getProjectById = (id: string): Project | undefined =>
  projects.find((p) => p.id === id);
