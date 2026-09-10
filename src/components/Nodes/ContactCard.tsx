import { useState, type FormEvent } from 'react';
import { profile } from '@/data/profile';
import { useCanvas } from '@/context/CanvasContext';
import { audioEngine } from '@/engine/audio';
import { Send } from '@/components/icons';
import { PhysicsNode } from './PhysicsNode';

/** Portal de contacto con formulario y pulso de éxito en el lienzo. */
export function ContactCard({ index }: { index: number }) {
  const { scatter } = useCanvas();
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    audioEngine.microClick(660, 'sine', 0.1, 0.25);
    setSent(true);
    e.currentTarget.reset();
    scatter();
  };

  return (
    <PhysicsNode id="node-contact" category="contact" top={1750} left={2600} width={500} index={index} withAura>
      <div className="glass-panel relative overflow-hidden rounded-[40px] border border-rose-400/20 p-8 md:p-9">
        <div className="mb-4 flex items-center justify-between">
          <span className="font-mono text-xs tracking-wider text-rose-400">CONEXIÓN DIRECTA // EMISOR</span>
          <span className="h-2 w-2 animate-ping rounded-full bg-rose-400" />
        </div>

        <h3 className="mb-2 font-display text-2xl font-bold text-white">¿Iniciamos una colisión creativa?</h3>
        <p className="mb-6 text-xs leading-relaxed text-slate-400">
          Hablemos sobre diseño de sistemas con personalidad física, aplicaciones espaciales o dirección técnica
          frontend.
        </p>

        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="mb-1 block font-mono text-[11px] text-slate-400">TU SEÑAL / EMAIL</label>
            <input
              type="email"
              required
              placeholder="tu@estudio.com"
              className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-600 transition focus:border-rose-400/50 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-1 block font-mono text-[11px] text-slate-400">FRECUENCIA / PROYECTO</label>
            <textarea
              rows={3}
              required
              placeholder="Cuéntame sobre la experiencia que imaginas..."
              className="w-full resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs text-white placeholder-slate-600 transition focus:border-rose-400/50 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-rose-500 to-amber-500 py-3 font-display text-xs font-bold uppercase tracking-wider text-slate-950 shadow-lg transition hover:from-rose-400 hover:to-amber-400"
          >
            <span>Transmitir Mensaje al Lienzo</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>

        {sent && (
          <div className="mt-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 text-center font-mono text-xs text-emerald-300">
            ✓ Señal enviada con éxito. Pulso registrado en el lienzo.
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
