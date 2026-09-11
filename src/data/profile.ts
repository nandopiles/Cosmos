import type { Profile } from '@/types';

/**
 * Identidad del proyecto de divulgación. "COSMOS" es un atlas vivo del
 * Sistema Solar: cada cuerpo celeste es un nodo con física gravitatoria real.
 */
export const profile: Profile = {
  name: 'COSMOS',
  role: 'Atlas vivo del Sistema Solar y del cielo profundo',
  bio: 'El universo no es una lista que se recorre de arriba abajo: es un espacio donde todo orbita, gira y se atrae. Empuja los planetas, lánzalos y deja que la gravedad reorganice el mapa mientras aprendes qué hay ahí fuera.',
  availability: 'Divulgación abierta · Datos de la NASA & ESA',
  manifestoQuote: '"Somos polvo de estrellas mirando de vuelta hacia las estrellas."',
  manifestoParagraphs: [
    'El Sistema Solar se formó hace unos 4.600 millones de años a partir de una nube de gas y polvo que colapsó por su propia gravedad. El 99,8% de toda esa masa terminó en el Sol; el resto formó los planetas, lunas, cometas y asteroides que hoy lo orbitan.',
    'Mirar al cielo es mirar al pasado: la luz del Sol tarda ocho minutos en llegar hasta ti, y la de las estrellas más lejanas que ves de noche partió hace miles de años. Este atlas te invita a explorar esas distancias con las manos, no con el scroll.',
  ],
  manifestoStats: [
    { value: '4.600 M', label: 'Años de edad', accent: 'amber' },
    { value: '8 min', label: 'La luz del Sol', accent: 'sky' },
    { value: '8', label: 'Planetas', accent: 'purple' },
  ],
  social: [
    { label: 'NASA ↗', url: 'https://science.nasa.gov/solar-system/' },
    { label: 'ESA ↗', url: 'https://www.esa.int/' },
    { label: 'APOD ↗', url: 'https://apod.nasa.gov/apod/' },
  ],
};
