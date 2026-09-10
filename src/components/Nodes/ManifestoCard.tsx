import { profile } from '@/data/profile';
import { ACCENTS } from '@/data/accents';
import { PhysicsNode } from './PhysicsNode';

/** Tarjeta de manifiesto / filosofía con métricas destacadas. */
export function ManifestoCard({ index }: { index: number }) {
  return (
    <PhysicsNode id="node-manifesto" category="manifesto" top={1850} left={1050} width={520} index={index} withAura>
      <div className="glass-panel relative overflow-hidden rounded-[44px] p-8 md:p-9">
        <div className="mb-4 flex items-center gap-3">
          <span className="h-3 w-3 rounded-full bg-purple-400" />
          <span className="font-mono text-xs tracking-wider text-purple-300">MANIFIESTO // LEYES DE MOVIMIENTO</span>
        </div>

        <h3 className="mb-4 font-display text-2xl font-bold leading-tight text-white">{profile.manifestoQuote}</h3>

        <div className="space-y-4 text-xs leading-relaxed text-slate-300">
          {profile.manifestoParagraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3 border-t border-white/10 pt-5 text-center">
          {profile.manifestoStats.map((stat) => (
            <div key={stat.label} className="rounded-2xl bg-white/5 p-2.5">
              <div className={`font-display text-lg font-bold ${ACCENTS[stat.accent].text}`}>{stat.value}</div>
              <div className="font-mono text-[10px] text-slate-400">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </PhysicsNode>
  );
}
