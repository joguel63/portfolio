# Diseño: Portafolio React (Vite) con Three.js y GSAP

**Fecha:** 2026-03-06

## Resumen
Sitio single-page (one-page) orientado a CV / branding personal, construido con React + Vite y Tailwind CSS. El hero inicial incluye un lienzo WebGL usando Three.js (recomendado: integrarlo con @react-three/fiber) y las animaciones y cronologías serán orquestadas con GSAP para lograr una entrada impactante e interactividad con el ratón.

## Objetivos
- Mostrar identidad y experiencia profesional de forma visual y memorable.
- Conseguir un efecto "wow" al cargar la página sin sacrificar rendimiento ni accesibilidad.
- Facilitar contacto (formulario / enlace) y una navegación rápida entre secciones: About, Experiencia, Proyectos, Contacto.

## Público objetivo
Reclutadores, clientes potenciales y colegas técnicos que evaluarán trabajos, experiencia y estilo.

## Criterios de éxito
- Animación inicial fluida en dispositivos de escritorio modernos.
- Degradado/graceful fallback cuando WebGL no esté disponible o en dispositivos de bajo rendimiento.
- Lighthouse: mantener buen rendimiento (P > 70) y accesibilidad (A11y > 85).

## Stack tecnológico propuesto
- Framework: React con Vite (build rápido y bundle pequeño)
- Estilos: Tailwind CSS
- 3D: Three.js integrado mediante @react-three/fiber (r3f) y @react-three/drei opcional
- Animaciones: GSAP (timelines y ScrollTrigger según necesidad)
- Testing: Vitest + Testing Library; E2E con Playwright
- Deploy: Vercel (o Netlify / GitHub Pages si se prefiere)

## Arquitectura y estructura de archivos (sugerida)
- src/
  - main.jsx (arranque)
  - App.jsx (layout de una sola página con anclas)
  - components/
    - Hero/
      - Hero.jsx (componente contenedor)
      - HeroCanvas.jsx (escena r3f: cámara, luces, objetos)
      - hero.css / hero.module.css
    - About.jsx
    - Experience.jsx (timeline)
    - Projects.jsx (cards con modal o lightbox)
    - Contact.jsx (formulario o enlace de email)
  - lib/
    - gsap-timelines.js (timelines reutilizables)
    - three-utils.js (helpers para cargar geometrías/ textures)
  - styles/
    - tailwind.css

## Comportamiento del Hero (Three.js + GSAP)
- HeroCanvas monta una escena r3f con un objeto central (p. ej. geometría bajo poli o partículas) y una cámara inicial colocada para una toma amplia.
- Al cargar, se ejecuta una timeline de GSAP que anima la entrada: cámara, aparición de luz, morph/scale de la geometría y elementos DOM superpuestos (título, CTA).
- Interactividad: el movimiento del ratón aplica transformaciones sutiles (rotación/parallax) al objeto 3D y al fondo, con smoothing para evitar movimientos bruscos.
- Control de estado: la escena debe poder pausarse (cuando no esté visible) y respetar prefers-reduced-motion.

## Fallback y degradado
- Detectar soporte WebGL; si no hay soporte o el dispositivo es de baja potencia, renderizar un hero estático (imagen optimizada/SVG) con animaciones GSAP sobre DOM más ligeras.
- Proveer opción de "reduced motion" en ajustes de usuario.

## Rendimiento y optimización
- Minimizar tamaño de geometrías y texturas; usar compressed textures si aplica.
- Lazy-load de secciones inferiores (Experience, Projects) y assets 3D no esenciales.
- Suspense + loaders para la escena 3D; mostrar placeholder amigable mientras carga.
- Throttle mouse events y usar requestAnimationFrame para actualizaciones.

## Accesibilidad
- Contenido principal navegable por teclado; skip-to-content.
- Contraste de texto adecuado, roles/ARIA en formulario.
- Animaciones respetan prefers-reduced-motion.

## Manejo de errores
- Capturar errores de inicialización de WebGL y mostrar fallback.
- Logs controlados para errores críticos y degradado graceful.

## Pruebas
- Unitarias: Vitest + Testing Library para componentes React.
- E2E: Playwright para probar carga inicial, interacción del hero y formulario de contacto.
- Performance: auditorías Lighthouse como parte del CI.

## Despliegue
- Pipeline CI: ejecutar tests, build y deploy automático a Vercel.
- Dominio personalizado opcional y certificados HTTPS manejados por la plataforma.

## Siguientes pasos (implementación)
1. Crear repo y configuración básica (Vite + React + Tailwind).
2. Scaffold componentes (App, Hero, About, Experience, Projects, Contact).
3. Implementar hero básico con r3f y un objeto simple (low-poly) + GSAP timeline de carga.
4. Añadir interactividad con mouse y ajustes de motion.
5. Optimizar rendimiento y agregar fallbacks.
6. Tests y CI; deploy a Vercel.

---

Si este diseño te parece correcto, el próximo paso es generar el plan de implementación detallado (tareas, estimaciones y orden) y comenzar a desarrollar.
