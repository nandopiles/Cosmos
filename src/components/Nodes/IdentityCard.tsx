import { profile } from '@/data/profile';
import { useCanvas } from '@/context/CanvasContext';
import { Home } from '@/components/icons';
import { PhysicsNode } from './PhysicsNode';
import { MagneticName } from './MagneticName';

/** Tarjeta principal de identidad con el nombre magnético y la bio. */
export function IdentityCard({ index }: { index: number }) {
  const { resetLayout } = useCanvas();

  return (
    <PhysicsNode id="node-identity" category="identity" top={1700} left={1800} width={680} index={index} withAura>
      <div className="glass-panel glass-panel-hoverable relative overflow-hidden rounded-[40px] border border-white/10 p-8 md:p-10">
        <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-lime-500/10 blur-3xl" />

        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 font-mono text-xs text-lime-300">
          <span className="h-2 w-2 animate-pulse rounded-full bg-lime-400" />
          <span>{profile.availability}</span>
        </div>

        <div className="mb-4">
          <p className="mb-1 font-mono text-xs uppercase tracking-widest text-slate-400">
            Empuja cada letra con el cursor:
          </p>
          <MagneticName name={profile.name} />
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.3em] text-slate-500">
            Atlas vivo del Sistema Solar
          </p>
        </div>

        <h2 className="mb-4 mt-2 font-display text-xl font-medium leading-snug text-slate-200 sm:text-2xl">
          {profile.role}
        </h2>
        <p className="mb-6 max-w-xl text-sm font-normal leading-relaxed text-slate-400">{profile.bio}</p>

        <div className="flex flex-wrap items-center gap-3 border-t border-white/10 pt-4">
          <button
            onClick={resetLayout}
            className="flex items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-4 py-2 font-mono text-xs text-lime-300 transition hover:bg-lime-400/20"
          >
            <Home className="h-3.5 w-3.5 text-lime-400" />
            Recolocar los planetas
          </button>
          <span className="font-mono text-xs text-slate-500">• Arrastra el vacío para viajar por el cosmos</span>
        </div>
      </div>
    </PhysicsNode>
  );
}
