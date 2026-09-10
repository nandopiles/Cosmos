/**
 * Motor de audio háptico generativo.
 * Sintetiza micro-sonidos con la Web Audio API — cero archivos externos.
 *
 * Diseñado como clase autocontenida y sin dependencias de React para poder
 * testearse y reutilizarse. Se instancia una vez y se comparte vía hook.
 */
export class AudioEngine {
  private ctx: AudioContext | null = null;
  private enabled = false;

  /** Crea/reanuda el AudioContext. Debe llamarse tras un gesto del usuario. */
  init(): void {
    if (!this.ctx) {
      const Ctor =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (!Ctor) return;
      this.ctx = new Ctor();
    }
    if (this.ctx.state === 'suspended') {
      void this.ctx.resume();
    }
  }

  get isEnabled(): boolean {
    return this.enabled;
  }

  /** Alterna el sonido. Devuelve el nuevo estado. */
  toggle(): boolean {
    this.init();
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.microClick(520, 'sine', 0.06, 0.15);
    }
    return this.enabled;
  }

  setEnabled(value: boolean): void {
    this.enabled = value;
  }

  /** Click sintético corto con caída exponencial de frecuencia. */
  microClick(freq = 420, type: OscillatorType = 'sine', duration = 0.04, gainVal = 0.08): void {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.4, now + duration);

      gain.gain.setValueAtTime(gainVal, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + duration);
    } catch {
      /* noop */
    }
  }

  /** Barrido descendente ("whoosh") cuyo tono depende de la velocidad. */
  whoosh(speed = 1): void {
    if (!this.enabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      const startFreq = Math.min(600, 180 + speed * 12);
      osc.frequency.setValueAtTime(startFreq, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.12);

      gain.gain.setValueAtTime(0.03, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(now + 0.12);
    } catch {
      /* noop */
    }
  }
}

/** Instancia compartida (singleton) del motor de audio. */
export const audioEngine = new AudioEngine();
