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

## [2026-05-26 14:30]

### Prompt

"Context: Existing Next.js App Router project... Task: Implement minimal Auth0 authentication using the latest @auth0/nextjs-auth0 SDK. [requirements: install SDK, route handlers, login/logout, protect dashboard with middleware, server-side session, user info on dashboard, update login page, Gmail readonly scope compatible, no DB/Gmail/AI yet]"

### Objetivo

Integrar Auth0 v4 con flujo login/logout, protección de `/dashboard` vía middleware, sesión server-side y UI de usuario autenticado, manteniendo scope Gmail readonly para uso futuro.

### Archivos modificados

- `package.json` / `package-lock.json`
- `lib/auth0.ts` (nuevo)
- `lib/constants.ts`
- `middleware.ts` (nuevo)
- `app/login/page.tsx`
- `app/dashboard/page.tsx`
- `app/page.tsx`
- `.env.example` (nuevo)
- `AI_DEV_LOG.md`

### Cambios realizados

- Instalado `@auth0/nextjs-auth0` v4.
- Creado `Auth0Client` en `lib/auth0.ts` con scope `gmail.readonly` en `authorizationParameters`.
- `middleware.ts`: monta rutas Auth0 (`/auth/*`) y redirige usuarios no autenticados de `/dashboard` a `/login`.
- Login: botón a `/auth/login?returnTo=...` (Google vía Auth0).
- Dashboard: `auth0.getSession()` server-side, muestra nombre/email/sub/foto y enlace a `/auth/logout`.
- Constantes `AUTH_ROUTES` y helper `authLoginUrl()`.
- `.env.example` documenta variables y URLs de callback Auth0.

### Notas técnicas

- SDK v4 no requiere `app/api/auth/[auth0]/route.ts`; rutas `/auth/login`, `/auth/logout`, `/auth/callback` las monta `auth0.middleware()`.
- Solo `/dashboard` está protegido; resto de la app permanece público.
- `getAccessToken()` disponible más adelante para Gmail API sin cambiar el cliente Auth0 base.
- Next.js 16 advierte deprecación de `middleware.ts` a favor de `proxy.ts`; se mantiene `middleware.ts` según requisito del assignment.

---

## [2026-05-26 14:43]

### Prompt

"Review generated Auth0 middleware and reduce matcher scope to avoid global middleware execution."

### Objetivo

Refinar la protección middleware de Auth0 para limitar su ejecución únicamente a rutas necesarias.

### Archivos modificados

- middleware.ts

### Cambios realizados

- Reemplazado matcher global por matcher limitado a:
  - /dashboard/:path*
  - /auth/:path*
- Reducido alcance del middleware para evitar ejecución innecesaria en rutas públicas y futuras API routes.

### Notas técnicas

- Mantiene compatibilidad con Auth0 v4 App Router.
- Reduce posibles side effects futuros con Gmail API routes.
- Mantiene rolling sessions funcionando correctamente.

