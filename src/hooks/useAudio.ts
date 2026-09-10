import { useCallback, useState } from 'react';
import { audioEngine } from '@/engine/audio';

/**
 * Puente React sobre el singleton `audioEngine`.
 * Expone el estado on/off para la UI y helpers memoizados.
 */
export function useAudio() {
  const [enabled, setEnabled] = useState(false);

  const toggle = useCallback(() => {
    const next = audioEngine.toggle();
    setEnabled(next);
  }, []);

  const click = useCallback(
    (freq?: number, type?: OscillatorType, duration?: number, gain?: number) => {
      audioEngine.microClick(freq, type, duration, gain);
    },
    [],
  );

  const whoosh = useCallback((speed?: number) => {
    audioEngine.whoosh(speed);
  }, []);

  return { enabled, toggle, click, whoosh, engine: audioEngine };
}
