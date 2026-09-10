import { skills } from '@/data/skills';
import { ACCENTS } from '@/data/accents';
import { PhysicsNode } from './PhysicsNode';

/** Núcleo de habilidades + satélites orbitando con física. */
export function SkillsCluster({ startIndex }: { startIndex: number }) {
  return (
    <>
      <PhysicsNode id="node-skills-center" category="skills" top={1100} left={1950} width={380} index={startIndex} withAura>
        <div className="glass-panel rounded-[34px] border border-white/10 p-6">
          <div className="mb-3 flex items-center justify-between">
            <span className="font-mono text-xs text-lime-400">HABILIDADES NUCLEARES</span>
            <span className="font-mono text-xs text-slate-500">Campo repulsor</span>
          </div>
          <p className="mb-4 text-xs leading-relaxed text-slate-400">
            Cada nodo orbita con física de atracción centrípeta hacia este núcleo. Arrastra cualquiera para deformar la
            constelación.
          </p>
          <div className="rounded-xl border border-lime-400/20 bg-lime-400/5 px-3 py-1.5 font-mono text-[11px] text-lime-400/80">
            ⚡ Pasa el cursor rápido para inducir vórtice
          </div>
        </div>
      </PhysicsNode>

      {skills.map((skill, i) => {
        const accent = ACCENTS[skill.accent];
        return (
          <PhysicsNode
            key={skill.id}
            id={skill.id}
            category="skill-satellite"
            top={skill.placement.top}
            left={skill.placement.left}
            index={startIndex + 1 + i}
          >
            <div
              className={`glass-panel flex items-center gap-2 rounded-full border px-5 py-3 font-mono text-xs font-semibold shadow-lg ${accent.text} ${accent.border}`}
            >
              <span className={`h-2 w-2 rounded-full ${accent.bgDot}`} />
              {skill.label}
            </div>
          </PhysicsNode>
        );
      })}
    </>
  );
}
