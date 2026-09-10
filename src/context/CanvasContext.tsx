import { createContext, useContext } from 'react';
import type { LivingCanvasApi } from '@/hooks/useLivingCanvas';

/**
 * Contexto que expone la API del lienzo vivo (registro de nodos, física, etc.)
 * a cualquier componente profundo sin prop-drilling.
 */
export const CanvasContext = createContext<LivingCanvasApi | null>(null);

export function useCanvas(): LivingCanvasApi {
  const ctx = useContext(CanvasContext);
  if (!ctx) {
    throw new Error('useCanvas debe usarse dentro de <CanvasContext.Provider>');
  }
  return ctx;
}
