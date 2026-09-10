import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { profile } from '@/data/profile';
import { audioEngine } from '@/engine/audio';
import { sendContactMessage } from '@/services/contact';
import { PhysicsNode } from './PhysicsNode';

type Phase = 'idle' | 'sending' | 'sent' | 'error';

/** Espera helper para escalonar los pasos del log de forma legible. */
const wait = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * "Terminal de composición": el formulario de contacto reinterpretado como una
 * consola de desarrollador. Escribir un mensaje se siente técnico y elegante:
 *  - Encabezado tipo ventana de terminal (semáforo mac).
 *  - Metadatos en vivo del mensaje (caracteres, palabras, tiempo de lectura).
 *  - Al enviar: secuencia de "handshake" con log línea a línea y barra de
 *    progreso, cerrando con un 200 OK. Sin caos, sin explosiones.
 */
export function ContactCard({ index }: { index: number }) {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [phase, setPhase] = useState<Phase>('idle');
  const [logLines, setLogLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const alive = useRef(true);

  // Metadatos técnicos del mensaje, calculados en vivo.
  const stats = useMemo(() => {
    const chars = message.length;
    const words = message.trim() ? message.trim().split(/\s+/).length : 0;
    const readSec = Math.max(1, Math.round((words / 200) * 60));
    return { chars, words, readSec };
  }, [message]);

  // Marca el componente como desmontado para no actualizar estado tras ello.
  useEffect(() => {
    alive.current = true;
    return () => {
      alive.current = false;
    };
  }, []);

  const pushLog = async (line: string, pct: number, freq: number) => {
    if (!alive.current) return;
    setLogLines((prev) => [...prev, line]);
    setProgress(pct);
    audioEngine.microClick(freq, 'sine', 0.04, 0.07);
    await wait(360);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (phase === 'sending') return;

    setPhase('sending');
    setLogLines([]);
    setProgress(0);
    setErrorMsg('');

    // La secuencia de "handshake" corre mientras el envío real está en curso;
    // el resultado (200 OK / ERROR) depende de la respuesta del servidor.
    const sendPromise = sendContactMessage({ email, message });

    await pushLog('Estableciendo canal seguro…', 20, 360);
    await pushLog('Handshake TLS ✓', 40, 450);
    await pushLog(`Empaquetando payload (${stats.chars} bytes)…`, 60, 540);
    await pushLog('Enrutando al destinatario…', 80, 630);

    const result = await sendPromise;
    if (!alive.current) return;

    if (result.ok) {
      await pushLog('200 OK · mensaje entregado', 100, 720);
      await wait(300);
      if (!alive.current) return;
      setPhase('sent');
      setEmail('');
      setMessage('');
    } else {
      setProgress(100);
      setErrorMsg(result.error);
      audioEngine.microClick(180, 'triangle', 0.12, 0.15);
      setPhase('error');
    }
  };

  const reset = () => {
    setPhase('idle');
    setLogLines([]);
    setProgress(0);
    setErrorMsg('');
  };

  return (
    <PhysicsNode id="node-contact" category="contact" top={1750} left={2600} width={500} index={index} withAura>
      <div className="glass-panel relative overflow-hidden rounded-[28px] border border-white/10 p-2">
        {/* Barra de título tipo terminal */}
        <div className="flex items-center gap-2 rounded-t-[20px] border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-rose-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-mono text-[11px] text-slate-400">contacto ~ compose.sh</span>
          <span className="ml-auto font-mono text-[10px] text-slate-500">utf-8</span>
        </div>

        <div className="p-6">
          <h3 className="mb-1 font-display text-xl font-bold text-white">
            <span className="text-rose-400">const</span> mensaje ={' '}
            <span className="text-emerald-300">nuevoProyecto</span>()
          </h3>
          <p className="mb-5 font-mono text-xs leading-relaxed text-slate-400">
            {'// Cuéntame qué quieres construir. Respondo en < 24h.'}
          </p>

          {(phase === 'idle' || phase === 'sending' || phase === 'error') && (
            <form onSubmit={handleSubmit} className="space-y-4" aria-busy={phase === 'sending'}>
              <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2.5 transition focus-within:border-rose-400/50">
                <span className="font-mono text-xs text-rose-400/80">~$</span>
                <input
                  type="email"
                  required
                  autoComplete="email"
                  disabled={phase === 'sending'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@correo.com"
                  className="w-full bg-transparent font-mono text-sm text-white placeholder-slate-600 focus:outline-none disabled:opacity-50"
                />
              </div>

              <div className="rounded-xl border border-white/10 bg-slate-950/50 px-3 py-2.5 transition focus-within:border-rose-400/50">
                <textarea
                  rows={3}
                  required
                  disabled={phase === 'sending'}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="> Escribe tu mensaje…"
                  className="w-full resize-none bg-transparent font-mono text-sm text-white placeholder-slate-600 focus:outline-none disabled:opacity-50"
                />
                {/* Metadatos en vivo */}
                <div className="mt-2 flex items-center gap-4 border-t border-white/5 pt-2 font-mono text-[10px] text-slate-500">
                  <span>{stats.chars} chars</span>
                  <span>{stats.words} palabras</span>
                  <span>~{stats.readSec}s lectura</span>
                </div>
              </div>

              {phase === 'sending' ? (
                <div className="space-y-2">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-rose-500 to-amber-400 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  <div className="min-h-[72px] rounded-xl bg-slate-950/60 p-3 font-mono text-[11px] leading-relaxed text-emerald-300">
                    {logLines.map((l, i) => (
                      <div key={i}>
                        <span className="text-slate-600">›</span> {l}
                      </div>
                    ))}
                    <span className="inline-block h-3 w-1.5 animate-pulse bg-emerald-400 align-middle" />
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  {phase === 'error' && (
                    <div className="rounded-xl border border-rose-500/40 bg-rose-500/10 p-3 font-mono text-[11px] leading-relaxed text-rose-300">
                      <span className="font-bold">ERROR ›</span> {errorMsg}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="group flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 py-3 font-mono text-xs font-bold text-slate-950 shadow-lg transition hover:from-rose-400 hover:to-amber-400"
                  >
                    <span className="text-slate-900/70">$</span>{' '}
                    {phase === 'error' ? 'reintentar --envio' : 'enviar --mensaje'}
                  </button>
                </div>
              )}
            </form>
          )}

          {phase === 'sent' && (
            <div className="space-y-4">
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 font-mono text-xs text-emerald-300">
                <div className="mb-2 flex items-center gap-2 font-bold">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-400 text-[10px] text-slate-950">
                    ✓
                  </span>
                  200 OK
                </div>
                <div className="text-emerald-400/70">
                  Mensaje entregado · [{new Date().toLocaleTimeString()}]
                </div>
              </div>
              <button
                onClick={reset}
                className="w-full rounded-xl border border-white/10 bg-white/5 py-2.5 font-mono text-xs text-slate-300 transition hover:bg-white/10"
              >
                $ nuevo --mensaje
              </button>
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
      </div>
    </PhysicsNode>
  );
}
