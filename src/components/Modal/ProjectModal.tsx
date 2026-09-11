import { useEffect } from 'react';
import { ACCENTS } from '@/data/accents';
import { getProjectById } from '@/data/projects';
import { audioEngine } from '@/engine/audio';
import { Close } from '@/components/icons';

interface ProjectModalProps {
  /** id del proyecto abierto, o null si está cerrado. */
  openId: string | null;
  onClose: () => void;
}

/**
 * Modal "morph" de detalle de proyecto. Se anima con la clase .is-active.
 * Accesible: cierra con Escape, backdrop clicable, role=dialog.
 */
export function ProjectModal({ openId, onClose }: ProjectModalProps) {
  const project = openId ? getProjectById(openId) : undefined;

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId, onClose]);

  const accent = project ? ACCENTS[project.accent] : ACCENTS.lime;

  return (
    <div
      className={`morph-modal ${openId ? 'is-active' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={project?.title ?? 'Ficha del cuerpo celeste'}
    >
      <div className="morph-backdrop" onClick={onClose} />
      <div className="morph-sheet glass-panel border border-white/15 p-10 shadow-2xl sm:p-14">
        <button
          onClick={onClose}
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
          title="Cerrar modal"
          aria-label="Cerrar"
        >
          <Close className="h-5 w-5" />
        </button>

        {project && (
          <div className="space-y-6">
            <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 font-mono text-xs ${accent.bgSoft}`}>
              {project.tag}
            </div>
            <h2 className="font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              {project.title}
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-300">{project.description}</p>

            <div className="space-y-3 rounded-3xl border border-white/10 bg-white/5 p-6">
              <h4 className="font-mono text-xs uppercase tracking-widest text-slate-400">Datos que asombran</h4>
              <ul className="space-y-2 text-sm text-slate-200">
                {project.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <span className={`font-mono font-bold ${accent.text}`}>›</span>
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-4">
              <div className="flex flex-wrap gap-2">
                {project.stack.map((s) => (
                  <span key={s} className="rounded-full bg-white/10 px-3 py-1 font-mono text-xs text-slate-300">
                    {s}
                  </span>
                ))}
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="rounded-full bg-white/10 px-5 py-2.5 font-mono text-xs text-white transition hover:bg-white/20"
                >
                  Volver al mapa
                </button>
                <a
                  href="https://science.nasa.gov/solar-system/"
                  target="_blank"
                  rel="noreferrer"
                  onClick={() => audioEngine.microClick(700, 'sine', 0.1, 0.2)}
                  className="rounded-full bg-lime-400 px-6 py-2.5 font-display text-xs font-bold text-slate-950 shadow-lg transition hover:bg-lime-300"
                >
                  Explorar en la NASA ↗
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
