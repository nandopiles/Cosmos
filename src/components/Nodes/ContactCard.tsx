import { PhysicsNode } from './PhysicsNode';

/** Un dato asombroso y su cifra destacada. */
interface CosmicFact {
  value: string;
  text: string;
  accent: string;
}

const FACTS: CosmicFact[] = [
  {
    value: '100.000 M',
    text: 'de estrellas se estima que hay solo en nuestra galaxia, la Vía Láctea.',
    accent: 'text-sky-300',
  },
  {
    value: '384.400 km',
    text: 'nos separan de la Luna, el único otro mundo que han pisado los humanos.',
    accent: 'text-amber-300',
  },
  {
    value: '−270 °C',
    text: 'es la temperatura del espacio vacío, apenas por encima del cero absoluto.',
    accent: 'text-purple-300',
  },
];

/**
 * "Estación de observación": panel informativo de cierre. Sustituye al antiguo
 * formulario de contacto por datos asombrosos del cosmos y enlaces a fuentes
 * fiables (NASA, ESA, APOD). Sin formularios ni envíos.
 */
export function ContactCard({ index }: { index: number }) {
  return (
    <PhysicsNode id="node-contact" category="contact" top={1750} left={2600} width={650} index={index} withAura>
      <div className="glass-panel relative overflow-hidden rounded-[28px] border border-white/10 p-2">
        {/* Barra de título tipo panel de misión */}
        <div className="flex items-center gap-2 rounded-t-[20px] border-b border-white/10 bg-white/[0.03] px-4 py-2.5">
          <span className="h-3 w-3 rounded-full bg-rose-400/80" />
          <span className="h-3 w-3 rounded-full bg-amber-400/80" />
          <span className="h-3 w-3 rounded-full bg-emerald-400/80" />
          <span className="ml-2 font-mono text-[11px] text-slate-400">estación ~ ¿sabías que…?</span>
          <span className="ml-auto font-mono text-[10px] text-slate-500">en línea</span>
        </div>

        <div className="p-6">
          <h3 className="mb-1 font-display text-xl font-bold text-white">
            Sigue mirando <span className="text-emerald-300">hacia arriba</span>
          </h3>
          <p className="mb-5 font-mono text-xs leading-relaxed text-slate-400">
            El universo es más grande y más extraño de lo que imaginamos. Aquí van tres cifras para pensar esta noche:
          </p>

          <ul className="space-y-3">
            {FACTS.map((fact) => (
              <li
                key={fact.value}
                className="flex items-start gap-3 rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3"
              >
                <span className={`font-display text-lg font-bold leading-none ${fact.accent}`}>{fact.value}</span>
                <span className="text-xs leading-relaxed text-slate-300">{fact.text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </PhysicsNode>
  );
}
