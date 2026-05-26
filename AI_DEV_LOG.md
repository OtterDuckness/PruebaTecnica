# AI Development Log

This file tracks AI-assisted development changes for the ImpactIQ technical assignment.

## [2026-05-26 12:00]
### Prompt
"Context: This is an internship technical assignment. Current state: Next.js already initialized... Task: Prepare a clean minimal project foundation for future development. [full requirements for folder structure, placeholder pages, layouts, no auth/db/extra libs]"

### Objetivo
Establecer una base mínima del proyecto con estructura de carpetas, páginas placeholder, layouts reutilizables y estilos Tailwind responsive, sin autenticación ni lógica de negocio.

### Archivos modificados
- `app/page.tsx`
- `app/layout.tsx`
- `app/globals.css`
- `app/dashboard/layout.tsx`
- `app/dashboard/page.tsx`
- `app/login/page.tsx`
- `app/api/health/route.ts`
- `components/layout/app-shell.tsx`
- `components/layout/auth-layout.tsx`
- `components/layout/page-container.tsx`
- `components/layout/site-header.tsx`
- `components/layout/site-footer.tsx`
- `components/ui/button-link.tsx`
- `lib/constants.ts`
- `types/index.ts`
- `utils/cn.ts`
- `AI_DEV_LOG.md`

### Cambios realizados
- Creada estructura `app/dashboard`, `app/login`, `app/api/health`, `components`, `lib`, `types`, `utils`.
- Landing simplificada en `/` con enlaces a dashboard y login.
- Páginas placeholder en `/dashboard` y `/login` (formulario deshabilitado, sin Auth0).
- Layout reutilizable: `AppShell` (header/footer/nav), `AuthLayout` (login centrado), `PageContainer`.
- Constantes de rutas y nombre de app en `lib/constants.ts`.
- Utilidad `cn()` para clases Tailwind sin dependencias extra.
- Ruta API `GET /api/health` como placeholder JSON.
- Metadata de app actualizada a ImpactIQ.

### Notas técnicas
- Sin librerías adicionales (solo Next.js, React, Tailwind ya presentes).
- `SiteHeader` resalta la ruta activa vía prop `activePath`.
- Dashboard usa `app/dashboard/layout.tsx` con `AppShell`; login usa `AuthLayout` a pantalla completa.
- Listo para integrar Auth0 y Gmail API en fases posteriores.

---