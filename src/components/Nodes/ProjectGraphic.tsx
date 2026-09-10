import type { Project } from '@/types';

/**
 * Gráficos SVG orgánicos y animados de la cabecera de cada tarjeta de proyecto.
 * Seleccionados por `project.graphic`.
 */
export function ProjectGraphic({ graphic }: { graphic: Project['graphic'] }) {
  switch (graphic) {
    case 'orbit':
      return (
        <svg
          className="h-28 w-28 transform text-lime-400 transition duration-500 ease-out group-hover:rotate-6 group-hover:scale-110"
          viewBox="0 0 200 200"
          fill="none"
        >
          <circle
            cx="100"
            cy="100"
            r="75"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="4 6"
            className="animate-[spin_24s_linear_infinite] opacity-40"
          />
          <path d="M50 100 C50 60, 150 60, 150 100 C150 140, 50 140, 50 100" fill="url(#p1-grad)" opacity="0.8" />
          <circle cx="100" cy="100" r="16" fill="#bef264" className="drop-shadow-[0_0_12px_rgba(190,242,100,0.8)]" />
          <defs>
            <linearGradient id="p1-grad" x1="50" y1="60" x2="150" y2="140" gradientUnits="userSpaceOnUse">
              <stop stopColor="#bef264" />
              <stop offset="1" stopColor="#38bdf8" />
            </linearGradient>
          </defs>
        </svg>
      );
    case 'constellation':
      return (
        <svg className="h-32 w-32 text-sky-400 transition duration-500 group-hover:scale-105" viewBox="0 0 200 200" fill="none">
          <line x1="40" y1="50" x2="100" y2="100" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="100" y1="100" x2="160" y2="70" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="100" y1="100" x2="80" y2="160" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
          <line x1="80" y1="160" x2="150" y2="150" stroke="currentColor" strokeWidth="1.5" strokeOpacity="0.5" />
          <circle cx="40" cy="50" r="7" fill="#38bdf8" className="animate-pulse" />
          <circle cx="100" cy="100" r="11" fill="#0284c7" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="160" cy="70" r="6" fill="#38bdf8" />
          <circle cx="80" cy="160" r="8" fill="#38bdf8" />
          <circle cx="150" cy="150" r="9" fill="#0ea5e9" />
        </svg>
      );
    case 'card':
      return (
        <svg className="h-32 w-32 text-amber-400 transition duration-500 group-hover:scale-105" viewBox="0 0 200 200" fill="none">
          <rect x="35" y="45" width="130" height="85" rx="14" stroke="currentColor" strokeWidth="2" strokeDasharray="2 4" opacity="0.6" />
          <path d="M45 95 Q100 125 155 95" stroke="#f59e0b" strokeWidth="3" strokeLinecap="round" />
          <circle cx="100" cy="110" r="12" fill="#fbbf24" className="drop-shadow-[0_0_10px_rgba(251,191,36,0.6)]" />
          <rect x="50" y="65" width="24" height="18" rx="4" fill="#d97706" />
        </svg>
      );
    case 'blob':
      return (
        <svg className="h-32 w-32 text-purple-400 transition duration-700 group-hover:rotate-45" viewBox="0 0 200 200" fill="none">
          <path
            d="M40,100 C40,40 100,40 120,60 C140,80 170,90 160,130 C150,170 90,170 60,150 C30,130 40,160 40,100 Z"
            fill="#c084fc"
            fillOpacity="0.3"
            stroke="#c084fc"
            strokeWidth="2"
          />
          <circle cx="110" cy="110" r="22" fill="#a855f7" className="drop-shadow-[0_0_15px_rgba(168,85,247,0.7)]" />
        </svg>
      );
  }
}
