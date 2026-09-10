import { useMemo, useState, type FormEvent } from 'react';
import { profile } from '@/data/profile';
import { useCanvas } from '@/context/CanvasContext';
import { audioEngine } from '@/engine/audio';
import { Send } from '@/components/icons';
import { PhysicsNode } from './PhysicsNode';
import { SignalWave } from './SignalWave';

const ROSE = '#f43f5e';

/**
 * "Consola Transmisora de Señal": reinvención del formulario de contacto como
 * un panel tipo osciloscopio. La onda reacciona en vivo a lo que se escribe,
 * el botón emite un pulso sonoro proporcional al mensaje y, al transmitir,
 * dispara una onda expansiva en el lienzo y registra un log.
 */
export function ContactCard({ index }: { index: number }) {
  const { scatter } = useCanvas();
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [sent, setSent] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  // Energía de la onda: cuanto más largo el mensaje, más viva la señal.
  const energy = useMemo(() => {
    const len = email.length + message.length;
    return Math.min(1, len / 120);
  }, [email, message]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Frecuencia del pulso según la longitud del mensaje (feedback sonoro).
    const freq = 440 + Math.min(400, message.length * 6);
    audioEngine.microClick(freq, 'sine', 0.12, 0.25);
    setPulseKey((k) => k + 1);
    setSent(true);
    setEmail('');
    setMessage('');
    scatter();
  };

  return (
    <PhysicsNode id="node-contact" category="contact" top={1750} left={2600} width={500} index={index} withAura>
      <div className="glass-panel relative overflow-hidden rounded-[40px] border border-rose-400/25 p-9 md:p-10">
        {/* halo decorativo */}
        <div className="pointer-events-none absolute -left-16 -top-16 h-48 w-48 rounded-full bg-rose-500/10 blur-3xl" />

        <div className="mb-5 flex items-center justify-between">
          <span className="font-mono text-xs tracking-wider text-rose-400">CONEXIÓN DIRECTA // TRANSMISOR</span>
          <span className="flex items-center gap-2 font-mono text-[10px] text-rose-300/80">
            <span className="h-2 w-2 animate-ping rounded-full bg-rose-400" />
            EN VIVO
          </span>
        </div>

        <h3 className="mb-2 font-display text-2xl font-bold text-white">¿Iniciamos una colisión creativa?</h3>
        <p className="mb-5 text-xs leading-relaxed text-slate-400">
          Sintoniza tu señal. El transmisor reacciona a tu mensaje en tiempo real.
        </p>

        {/* Osciloscopio */}
        <div className="mb-5 rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3">
          <div className="mb-1 flex items-center justify-between font-mono text-[10px] text-slate-500">
            <span>SEÑAL DE SALIDA</span>
            <span className="text-rose-300/70">AMP {Math.round(energy * 100)}%</span>
          </div>
          <SignalWave energy={energy} color={ROSE} pulseKey={pulseKey} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="contact-email" className="mb-1.5 block font-mono text-[11px] text-slate-400">
              TU SEÑAL / EMAIL
            </label>
            <input
              id="contact-email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@estudio.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 transition focus:border-rose-400/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-rose-400/20"
            />
          </div>
          <div>
            <label htmlFor="contact-message" className="mb-1.5 block font-mono text-[11px] text-slate-400">
              FRECUENCIA / PROYECTO
            </label>
            <textarea
              id="contact-message"
              rows={3}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Cuéntame sobre la experiencia que imaginas..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-slate-600 transition focus:border-rose-400/60 focus:bg-white/[0.07] focus:outline-none focus:ring-2 focus:ring-rose-400/20"
            />
          </div>
          <button
            type="submit"
            className="group flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 py-3.5 font-display text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg transition hover:from-rose-400 hover:to-amber-400"
          >
            <span>Transmitir Señal</span>
            <Send className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </button>
        </form>

        {sent && (
          <div className="mt-4 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3.5 font-mono text-xs text-emerald-300">
            <div className="flex items-center gap-2">
              <span className="text-emerald-400">›</span> Señal transmitida. Pulso registrado en el lienzo.
            </div>
            <div className="mt-1 text-[10px] text-emerald-400/60">
              [{new Date().toLocaleTimeString()}] STATUS 200 · onda expansiva emitida
            </div>
          </div>
        )}

        <div className="mt-6 flex items-center justify-center gap-6 border-t border-white/10 pt-5 font-mono text-xs text-slate-400">
          {profile.social.map((s) => (
            <a key={s.label} href={s.url} target="_blank" rel="noreferrer" className="transition hover:text-white">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </PhysicsNode>
  );
}
