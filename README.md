# Espacio Vivo — Portfolio Interactivo

Un portfolio que no se hace scroll: se **explora**. Un lienzo infinito estilo Figma/Miro
donde cada sección es un cuerpo físico con masa, inercia y memoria elástica. Arrastra,
lanza, empuja y navega por el espacio.

**Stack:** Vite · React 19 · TypeScript · Tailwind CSS v4 · Web Audio API · Canvas 2D

---

## ✨ Características

- **Lienzo infinito 2D** con pan y zoom suavizado (interpolación de cámara) hacia el cursor.
- **Motor de física soft-body** propio: repulsión magnética del cursor, muelles amortiguados
  de retorno, fricción e inercia para arrastrar y lanzar tarjetas.
- **Estela de cursor fluida + partículas ambientales** reactivas a la velocidad (Canvas 2D).
- **Modo linterna**: oscurece el lienzo salvo un halo que sigue al puntero.
- **Radar / minimapa** 2D en tiempo real con el encuadre de la cámara.
- **Audio háptico generativo** sintetizado con la Web Audio API (cero archivos de audio).
- **Letras magnéticas** en el nombre: cada carácter es un muelle independiente.
- **Laboratorio sensorial**: un orbe con gravedad que rebota y se puede lanzar.
- **Modal "morph"** de detalle de proyecto, accesible (Escape, foco, `role="dialog"`).
- **Deep-linking**: `#p2` abre ese proyecto y teletransporta la cámara al cargar.
- **Accesibilidad**: respeta `prefers-reduced-motion` degradando partículas/física.

---

## 🏗️ Arquitectura

El principio rector es **separar la simulación (60 fps) del renderizado de React**.
Las posiciones que cambian cada frame **nunca** pasan por el estado de React: se escriben
directamente sobre el DOM vía refs. React solo gestiona estructura, datos y UI discreta.

```
src/
├── engine/          # Lógica pura, sin React — testeable y portable
│   ├── constants.ts # Tuning de física, cámara, zoom, teleports
│   ├── camera.ts    # Cámara del lienzo (pan/zoom/lerp, screen↔world)
│   ├── physics.ts   # PhysicsWorld: repulsión, muelle, fricción, throw, scatter
│   ├── particles.ts # ParticleField: estela + partículas ambientales
│   ├── spring.ts    # Muelle 2D reutilizable (letras, orbe)
│   └── audio.ts     # AudioEngine: síntesis háptica (Web Audio API)
│
├── hooks/           # Puentes React ↔ engine
│   ├── useLivingCanvas.ts   # Orquestador: UN solo rAF conduce todo
│   ├── useAudio.ts
│   └── useReducedMotion.ts
│
├── context/         # CanvasContext: API del lienzo sin prop-drilling
├── components/
│   ├── Canvas/      # World (viewport+mundo), TrailCanvas, Flashlight
│   ├── Nodes/       # PhysicsNode (base) + tarjetas de contenido
│   ├── HUD/         # StatusBar, Toolbar, Minimap, ZoomControls, TeleportPills
│   └── Modal/       # ProjectModal
├── data/            # profile, projects, skills, accents (contenido tipado)
└── types/           # Tipos compartidos
```

### Decisiones clave de rendimiento

1. **Un único `requestAnimationFrame`** (en `useLivingCanvas`) conduce cámara, física,
   partículas y minimapa. Evita múltiples loops compitiendo.
2. **Cero re-renders por física.** El transform de cada nodo lo escribe el motor sobre
   `element.style.transform`. React se entera solo del HUD (coords, zoom, FPS), y a baja
   frecuencia (~6 veces/segundo).
3. **El engine es agnóstico a React.** Las clases (`Camera`, `PhysicsWorld`, `ParticleField`,
   `AudioEngine`) no importan React, lo que las hace testeables de forma aislada.
4. **Clases de acento estáticas** (`data/accents.ts`) para que el JIT de Tailwind las detecte
   (no se construyen strings de clases dinámicamente).

---

## 🚀 Puesta en marcha

```bash
npm install
npm run dev      # servidor de desarrollo
npm run build    # build de producción (typecheck + bundle)
npm run preview  # previsualizar el build
```

---

## 📬 Formulario de contacto

El formulario envía los mensajes por **Formspree** (sin backend propio). Para activarlo:

1. Crea una cuenta en [formspree.io](https://formspree.io) con el correo destino
   (`nandopiles...@gmail.com`) y crea un formulario nuevo.
2. Copia el endpoint que te dan (formato `https://formspree.io/f/xxxxxxxx`).
3. Crea un archivo `.env` en la raíz (o edita el existente) con:

   ```
   VITE_CONTACT_ENDPOINT=https://formspree.io/f/xxxxxxxx
   ```

4. Reinicia el servidor de desarrollo.

El correo destino se configura en el panel de Formspree, **no** en el código, para
no exponerlo a scrapers. El `.env` está en `.gitignore`: nunca se sube al repo.

## 🎨 Personalización

Todo el contenido vive en `src/data/`:

- `profile.ts` — nombre, rol, bio, manifiesto, redes.
- `projects.ts` — añade un objeto y aparecen automáticamente la tarjeta, el nodo físico
  y el modal.
- `skills.ts` — habilidades satélite.

Los parámetros de "sensación" física (rigidez de muelles, fricción, radio de repulsión,
zoom máx/mín) están centralizados en `src/engine/constants.ts`.

---

## 🕹️ Controles

| Acción | Cómo |
|---|---|
| Explorar | Arrastrar el fondo |
| Zoom | Rueda del ratón / botones `+ −` |
| Mover una tarjeta | Arrastrarla |
| Lanzar | Arrastrar rápido y soltar |
| Onda expansiva | Botón "Gravedad Cero" |
| Viajar a una zona | Píldoras inferiores |
| Ver proyecto | Clic en una tarjeta de proyecto |
| Cerrar modal | `Esc` o clic fuera |
