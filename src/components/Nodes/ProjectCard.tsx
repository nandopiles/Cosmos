import { ACCENTS } from '@/data/accents';
import type { Project } from '@/types';
import { ArrowRight } from '@/components/icons';
import { PhysicsNode } from './PhysicsNode';
import { ProjectGraphic } from './ProjectGraphic';

interface ProjectCardProps {
  project: Project;
  index: number;
  onOpen: (id: string) => void;
}

/** Gradiente de fondo del gráfico según acento. */
const HEADER_GRADIENT: Record<Project['accent'], string> = {
  lime: 'from-slate-900 via-[#0d1624] to-[#132338]',
  sky: 'from-slate-900 via-[#0a1829] to-[#0d2238]',
  amber: 'from-slate-900 via-[#1f190e] to-[#2d2210]',
  purple: 'from-slate-900 via-[#180f26] to-[#25153a]',
  rose: 'from-slate-900 via-[#1f0e14] to-[#2d1018]',
  emerald: 'from-slate-900 via-[#0d1f18] to-[#102d22]',
};

export function ProjectCard({ project, index, onOpen }: ProjectCardProps) {
  const accent = ACCENTS[project.accent];

  return (
    <PhysicsNode
      id={`node-${project.id}`}
      category="project"
      top={project.placement.top}
      left={project.placement.left}
      width={project.placement.width}
      index={index}
      withAura
      onActivate={() => onOpen(project.id)}
    >
      <div className={`glass-panel group rounded-[38px] p-7 transition-all duration-300 ${accent.borderHover}`}>
        <div className="mb-4 flex items-center justify-between">
          <span className={`font-mono text-xs tracking-wider ${accent.text}`}>
            {project.index} // {project.category}
          </span>
          <span className={`rounded-full px-2.5 py-0.5 font-mono text-[11px] ${accent.bgSoft}`}>{project.year}</span>
        </div>

        <div
          className={`relative mb-5 flex h-44 w-full items-center justify-center overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br p-4 ${HEADER_GRADIENT[project.accent]}`}
        >
          {project.graphic === 'orbit' && (
            <div className="absolute inset-0 bg-[radial-gradient(#bef264_1px,transparent_1px)] opacity-40 [background-size:16px_16px]" />
          )}
          <ProjectGraphic graphic={project.graphic} />
          <div className="absolute bottom-3 right-3 rounded bg-black/60 px-2 py-0.5 font-mono text-[10px] text-slate-400">
            Haz clic para expandir
          </div>
        </div>

        <h3 className={`mb-2 font-display text-2xl font-bold text-white transition ${accent.textHover}`}>
          {project.title}
        </h3>
        <p className="mb-5 text-xs leading-relaxed text-slate-400">{project.shortDescription}</p>

        <div className="flex items-center justify-between border-t border-white/5 pt-3">
          <div className="flex flex-wrap gap-1.5">
            {project.stack.slice(0, 3).map((tech) => (
              <span key={tech} className="rounded-full bg-white/5 px-2 py-0.5 font-mono text-[11px] text-slate-300">
                {tech}
              </span>
            ))}
          </div>
          <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-white/10 transition ${accent.text}`}>
            <ArrowRight className="h-4 w-4" />
          </div>
        </div>
      </div>
    </PhysicsNode>
  );
}
