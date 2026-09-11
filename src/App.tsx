import { useCallback, useState } from 'react';
import { CanvasContext } from '@/context/CanvasContext';
import { useLivingCanvas } from '@/hooks/useLivingCanvas';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { audioEngine } from '@/engine/audio';
import { projects } from '@/data/projects';

import { World } from '@/components/Canvas/World';
import { TrailCanvas } from '@/components/Canvas/TrailCanvas';
import { Flashlight } from '@/components/Canvas/Flashlight';

import { IdentityCard } from '@/components/Nodes/IdentityCard';
import { ProjectCard } from '@/components/Nodes/ProjectCard';
import { SkillsCluster } from '@/components/Nodes/SkillsCluster';
import { ManifestoCard } from '@/components/Nodes/ManifestoCard';
import { PlaygroundCard } from '@/components/Nodes/PlaygroundCard';
import { ContactCard } from '@/components/Nodes/ContactCard';

import { StatusBar } from '@/components/HUD/StatusBar';
import { Toolbar } from '@/components/HUD/Toolbar';
import { Minimap } from '@/components/HUD/Minimap';
import { ZoomControls } from '@/components/HUD/ZoomControls';
import { TeleportPills } from '@/components/HUD/TeleportPills';
import { ProjectModal } from '@/components/Modal/ProjectModal';

/**
 * Raíz de la aplicación. Cablea el orquestador del lienzo, provee el contexto
 * a todos los nodos y compone las capas (mundo, canvas de partículas, linterna,
 * HUD y modal).
 */
export default function App() {
  const reducedMotion = useReducedMotion();
  const canvas = useLivingCanvas(reducedMotion);
  const { worldElRef, viewportElRef, trailCanvasRef, worldSize } = canvas;

  const [flashlightActive, setFlashlightActive] = useState(true);
  const [openProject, setOpenProject] = useState<string | null>(null);

  const openProjectDetail = useCallback((id: string) => {
    audioEngine.whoosh(16);
    audioEngine.microClick(580, 'sine', 0.08, 0.2);
    setOpenProject(id);
  }, []);

  const closeProject = useCallback(() => {
    audioEngine.microClick(320);
    setOpenProject(null);
  }, []);

  // Índices de caída escalonada. Orden: identidad, 4 proyectos, skills(+6), etc.
  const projectStart = 1;
  const skillsStart = projectStart + projects.length;
  const skillsCount = 1 + 6; // núcleo + satélites
  const manifestoIndex = skillsStart + skillsCount;
  const playgroundIndex = manifestoIndex + 1;
  const contactIndex = playgroundIndex + 1;

  return (
    <CanvasContext.Provider value={canvas}>
      {/* Capa de partículas y estela (foreground, no captura eventos) */}
      <TrailCanvas canvasRef={trailCanvasRef} />
      {/* Capa de linterna */}
      <Flashlight active={flashlightActive} />

      {/* HUD */}
      <StatusBar />
      <Toolbar flashlightActive={flashlightActive} onToggleFlashlight={() => setFlashlightActive((v) => !v)} />
      <TeleportPills />
      <div className="fixed bottom-6 right-8 z-50 flex flex-col items-end gap-3">
        <Minimap />
        <ZoomControls />
      </div>

      {/* Mundo infinito */}
      <World viewportRef={viewportElRef} worldRef={worldElRef} worldSize={worldSize}>
        <IdentityCard index={0} />
        {projects.map((project, i) => (
          <ProjectCard key={project.id} project={project} index={projectStart + i} onOpen={openProjectDetail} />
        ))}
        <SkillsCluster startIndex={skillsStart} />
        <ManifestoCard index={manifestoIndex} />
        <PlaygroundCard index={playgroundIndex} />
        <ContactCard index={contactIndex} />
      </World>

      {/* Modal de detalle */}
      <ProjectModal openId={openProject} onClose={closeProject} />
    </CanvasContext.Provider>
  );
}
