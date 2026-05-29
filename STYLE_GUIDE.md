# Style Guide — Portfolio 2026

Stack: **Astro 5 + React 19 + Tailwind CSS 4 + shadcn/ui**. Dark-first, glassmorphism y gradientes cyan→indigo→violet.

---

## Principios de diseño

1. **Dark-first** — el fondo base es Slate 950 (`#020617`). Nunca usar blanco como fondo principal; la clase `dark` se aplica a `<html>` por defecto.
2. **Glassmorphism + Mesh** — superficies con `backdrop-blur` sobre fondos translúcidos y un `gradient-mesh` global de baja opacidad.
3. **Acento cyan** — el color primario es `--accent-cyan` (#22d3ee). Se usa para CTAs, foco, glow, selection y la barra de scroll.
4. **Tokens, no valores hardcodeados** — usar siempre las variables CSS (`var(--...)`) o las utilidades Tailwind asociadas (`bg-background`, `text-foreground`, `bg-accent-cyan`, etc.).
5. **Gradientes consistentes** — solo los 4 gradientes definidos (`main`, `mesh`, `surface`, `glow`). No inventar nuevos.

---

## Paleta de colores

### Base / Superficies
| Token CSS | Utilidad Tailwind | Valor | Uso |
|---|---|---|---|
| `--background` / `--bg-primary` | `bg-background` / `bg-bg-primary` | `#020617` (Slate 950) | Fondo global de la página |
| `--bg-secondary` | `bg-bg-secondary` | `#0f172a` (Slate 900) | Segundo plano, secciones alternas |
| `--bg-card` | `bg-card` | `rgba(15, 23, 42, 0.6)` | Cards y paneles glass |
| `--secondary` / `--muted` / `--accent` | `bg-secondary` / `bg-muted` | `#1e293b` (Slate 800) | Chips, inputs, hover states |
| `--input` | — | `#1e293b` | Inputs nativos |

### Texto
| Token CSS | Utilidad Tailwind | Valor | Uso |
|---|---|---|---|
| `--foreground` | `text-foreground` | `#f8fafc` (Slate 50) | Texto principal, títulos |
| `--secondary-foreground` / `--accent-foreground` | `text-secondary-foreground` | `#f8fafc` | Texto sobre superficies secundarias |
| `--muted-foreground` | `text-muted-foreground` | `#94a3b8` (Slate 400) | Subtítulos, metadata, descripciones |
| `--primary-foreground` | `text-primary-foreground` | `#020617` | Texto sobre botones primarios (cyan) |

### Acentos
| Token CSS | Utilidad Tailwind | Valor | Uso |
|---|---|---|---|
| `--accent-cyan` / `--primary` / `--ring` | `bg-accent-cyan` / `text-accent-cyan` | `#22d3ee` (Cyan 400) | CTA, foco, glow, scroll-bar, selection |
| `--accent-indigo` | `bg-accent-indigo` / `text-accent-indigo` | `#818cf8` (Indigo 400) | Acento secundario en gradientes |
| `--accent-violet` | `bg-accent-violet` / `text-accent-violet` | `#8b5cf6` (Violet 500) | Final del gradiente principal |

### Bordes & Estado
| Token CSS | Utilidad Tailwind | Valor | Uso |
|---|---|---|---|
| `--border` | `border-border` | `rgba(51, 65, 85, 0.5)` (Slate 700 50%) | Borde por defecto |
| `--border-accent` | `border-border-accent` | `rgba(34, 211, 238, 0.5)` | Borde sobre hover/focus |
| `--destructive` | `bg-destructive` / `text-destructive` | `#ef4444` (Red 500) | Errores, destructivo |
| `--destructive-foreground` | — | `#f8fafc` | Texto sobre destructivo |

---

## Gradientes

| Token | Utilidad Tailwind | Definición |
|---|---|---|
| `--gradient-main` | `bg-gradient-main` | `linear-gradient(135deg, cyan → indigo → violet)` |
| `--gradient-mesh` | `bg-gradient-mesh` | 3 `radial-gradient` (cyan / indigo / violet @ 10%) — fondo global decorativo |
| `--gradient-surface` | `bg-gradient-surface` | `linear-gradient(180deg, slate-800/30 → slate-950/60)` — superficies |
| `--gradient-glow` | `bg-gradient-glow` | `radial-gradient` cyan al 10%, transparente al 70% — glow centrado |

**Regla:** las text-gradients se hacen con la utilidad `.text-gradient` (usa `--gradient-main`). No componer gradientes inline.

---

## Sombras y Glow

| Token | Utilidad Tailwind | Valor |
|---|---|---|
| `--shadow-glow-cyan` | `shadow-glow-cyan` | `0 0 30px rgba(34, 211, 238, 0.15)` |
| `--shadow-glow-indigo` | `shadow-glow-indigo` | `0 0 30px rgba(129, 140, 248, 0.15)` |

`text-glow-cyan` aplica `text-shadow: 0 0 10px rgba(34, 211, 238, 0.5)`.

---

## Tipografía

| Token | Valor | Uso |
|---|---|---|
| `--font-sans` | `Inter Variable`, system-ui fallback | Texto general, títulos |
| `--font-mono` | `JetBrains Mono`, `Fira Code` | Código, tags técnicos |

Se importa `@fontsource-variable/inter`. `html { font-family: var(--font-sans) }` por defecto.

**Escala** — usar las utilidades Tailwind estándar (`text-xs` → `text-9xl`). No se definieron tokens custom de tamaño; respetar la escala base de Tailwind v4.

**Pesos comunes en el proyecto**
- **700 (Bold)**: títulos hero, headings de sección
- **600 (Semibold)**: subtítulos, navegación, botones grandes
- **500 (Medium)** _(default `font-medium` en `<Button>`)_: botones, labels
- **400 (Regular)**: cuerpo

---

## Radio y espaciado

| Token | Valor |
|---|---|
| `--radius` | `0.75rem` (12px) — radio base de cards y botones grandes |
| `--radius-md` | derivado por shadcn (`min(--radius-md, 8–10px)` en botones xs/sm) |

Espaciado: escala estándar de Tailwind v4 (4px base). No hay tokens `--space-*` propios.

---

## Utilidades del proyecto

Definidas en [global.css](src/styles/global.css) bajo `@layer utilities`:

| Clase | Efecto |
|---|---|
| `.glass` | `backdrop-blur-md` + `bg-card` + `border-border` — superficie glassmorphism |
| `.glass-hover` | Transición + hover `bg-white/5`, borde acento, `shadow-glow-cyan` |
| `.text-glow-cyan` | Text-shadow cyan suave |
| `.text-gradient` | Texto con `--gradient-main` y `bg-clip-text` |
| `.mesh-bg` | Fondo absoluto con `--gradient-mesh` al 40% opacidad |

---

## Animaciones

| Token | Utilidad Tailwind | Definición |
|---|---|---|
| `--animate-float` | `animate-float` | `float 6s ease-in-out infinite` (translateY ±15px) |
| `--animate-pulse-slow` | `animate-pulse-slow` | `pulse 4s cubic-bezier(0.4,0,0.6,1) infinite` |

Animaciones de UI (scroll, secciones, conteo) usan **Framer Motion** — ver [`ScrollProgress`](src/components/ui/ScrollProgress.tsx), [`AnimatedSection`](src/components/ui/AnimatedSection.tsx), [`Counter`](src/components/ui/Counter.tsx), [`TypingEffect`](src/components/ui/TypingEffect.tsx).

---

## Componente Button (shadcn/ui)

Ubicación: [button.tsx](src/components/ui/button.tsx). Variantes con `class-variance-authority`.

### Variantes
| `variant` | Apariencia |
|---|---|
| `default` | Fondo `bg-primary` (cyan), texto `primary-foreground` (slate-950) |
| `outline` | Borde `border-border`, hover a `bg-muted` |
| `secondary` | `bg-secondary` (slate-800), texto claro |
| `ghost` | Transparente, hover `bg-muted` |
| `destructive` | `bg-destructive/10`, texto rojo |
| `link` | Texto cyan subrayado en hover |

### Tamaños
`xs` (h-6) · `sm` (h-8) · `default` (h-9) · `lg` (h-10) · iconos: `icon-xs` / `icon-sm` / `icon` / `icon-lg`.

```tsx
<Button variant="default" size="lg">Contactar</Button>
<Button variant="outline" size="sm">Ver más</Button>
```

---

## Layout base

`BaseLayout.astro` aplica:

- `<html lang="…" class="dark scroll-smooth">`
- `<body class="bg-background text-foreground antialiased selection:bg-accent-cyan/30 overflow-x-hidden min-h-screen">`
- Fondo decorativo fijo (z-index `-10`):
  - `.mesh-bg` al 30% opacidad
  - Dos blobs `bg-accent-cyan/10` y `bg-accent-indigo/10` con `blur-[120px]` y `animate-pulse-slow`
  - Spotlight radial cyan que sigue al mouse (`--x`, `--y`)
- `<ScrollProgress>` arriba del slot

Todas las páginas deben envolverse en `BaseLayout` para heredar background, fonts y scroll progress.

---

## Estructura de secciones (`src/components/sections/`)

Cada sección de la home es un componente Astro independiente: `About`, `Skills`, `Experience`, `Education`, `Projects`, `OtherProjects`, `Interests`, `Contact`. Reusar este patrón para nuevas secciones — un archivo por bloque vertical, importado desde `pages/index.astro`.

---

## Reglas de composición

### Do ✅
- Envolver páginas en `BaseLayout` para heredar el background global
- Usar `class="glass"` o `bg-card` + `border-border` para paneles
- Aplicar `text-gradient` solo en headlines puntuales (máx. 1 por viewport)
- Botones CTA principales con `variant="default"` (cyan)
- Iconos vía `iconify-icon` (cargado en BaseLayout)
- Animaciones de aparición con `AnimatedSection` (Framer Motion)
- `selection:bg-accent-cyan/30` ya viene heredado — no overridear

### Don't ❌
- No usar fondos blancos ni `bg-white` directo (rompe el dark-first)
- No hardcodear hex; usar tokens (`bg-accent-cyan`, no `bg-[#22d3ee]`)
- No crear gradientes nuevos; usar los 4 definidos
- No usar fuentes fuera de Inter / JetBrains Mono
- No mezclar más de 2 acentos (cyan + indigo **o** cyan + violet) en una misma sección
- No quitar el `mesh-bg` ni los blobs del fondo en páginas internas — son parte del lenguaje visual
- No anidar más de un `text-gradient` por bloque
