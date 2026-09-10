import type { AccentColor } from '@/types';

/**
 * Mapa central de acentos → clases Tailwind y valores hex.
 * Tailwind necesita clases completas y estáticas (no interpoladas) para el JIT,
 * por eso mapeamos explícitamente en lugar de construir strings dinámicos.
 */
interface AccentClasses {
  text: string;
  textHover: string;
  border: string;
  borderHover: string;
  bgSoft: string;
  bgDot: string;
  hex: string;
}

export const ACCENTS: Record<AccentColor, AccentClasses> = {
  lime: {
    text: 'text-lime-400',
    textHover: 'group-hover:text-lime-300',
    border: 'border-lime-400/40',
    borderHover: 'hover:border-lime-400/40',
    bgSoft: 'bg-lime-400/10 text-lime-300',
    bgDot: 'bg-lime-400',
    hex: '#bef264',
  },
  sky: {
    text: 'text-sky-400',
    textHover: 'group-hover:text-sky-300',
    border: 'border-sky-400/40',
    borderHover: 'hover:border-sky-400/40',
    bgSoft: 'bg-sky-400/10 text-sky-300',
    bgDot: 'bg-sky-400',
    hex: '#38bdf8',
  },
  amber: {
    text: 'text-amber-400',
    textHover: 'group-hover:text-amber-300',
    border: 'border-amber-400/40',
    borderHover: 'hover:border-amber-400/40',
    bgSoft: 'bg-amber-400/10 text-amber-300',
    bgDot: 'bg-amber-400',
    hex: '#fbbf24',
  },
  purple: {
    text: 'text-purple-400',
    textHover: 'group-hover:text-purple-300',
    border: 'border-purple-400/40',
    borderHover: 'hover:border-purple-400/40',
    bgSoft: 'bg-purple-400/10 text-purple-300',
    bgDot: 'bg-purple-400',
    hex: '#a855f7',
  },
  rose: {
    text: 'text-rose-400',
    textHover: 'group-hover:text-rose-300',
    border: 'border-rose-400/40',
    borderHover: 'hover:border-rose-400/40',
    bgSoft: 'bg-rose-400/10 text-rose-300',
    bgDot: 'bg-rose-400',
    hex: '#f43f5e',
  },
  emerald: {
    text: 'text-emerald-400',
    textHover: 'group-hover:text-emerald-300',
    border: 'border-emerald-400/40',
    borderHover: 'hover:border-emerald-400/40',
    bgSoft: 'bg-emerald-400/10 text-emerald-300',
    bgDot: 'bg-emerald-400',
    hex: '#34d399',
  },
};
