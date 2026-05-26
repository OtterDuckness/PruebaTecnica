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

---

## [2026-05-26 15:30]

### Prompt

"Context: Auth0 authentication fully working... Task: Implement minimal Gmail email retrieval using the authenticated Google session. [fetch recent emails server-side, display subject/sender/snippet/date on dashboard, no DB/AI, use fetch() against Gmail API]"

### Objetivo

Mostrar en el dashboard una vista previa de los correos recientes de Gmail usando el access token de Google de la sesión Auth0, con manejo seguro de errores.

### Archivos modificados

- `lib/gmail.ts` (nuevo)
- `types/gmail.ts` (nuevo)
- `app/dashboard/page.tsx`
- `AI_DEV_LOG.md`

### Cambios realizados

- Utilidad `fetchRecentEmails()` en `lib/gmail.ts`: lista mensajes INBOX (máx. 5) y obtiene metadata (Subject, From, Date, snippet) vía `fetch()` a Gmail REST API.
- Tipos `EmailPreview` y `GmailFetchResult` en `types/gmail.ts`.
- Dashboard: `auth0.getAccessToken()` server-side → `fetchRecentEmails(token)` → lista de correos o estado de error/ vacío.
- Eliminados placeholders del dashboard; sección "Recent emails" con UI responsive.

### Notas técnicas

- Token obtenido solo en servidor; sin exposición al cliente.
- Si falta token o Gmail rechaza (403), mensaje orienta a cerrar sesión y volver a entrar.
- Limitación: `getAccessToken()` en Server Components puede no persistir refresh de token (documentado en SDK); usuarios con sesión válida y scope concedido funcionan en flujo normal.
- Próximo paso natural: AI analysis sobre `snippet` sin cambiar la capa Gmail.

---

## [2026-05-26 16:00]

### Prompt

"Debug the existing Gmail token retrieval flow without redesigning architecture. Gmail fetch fails with 'Session expired. Please sign in again.' Add temporary server-side debugging logs for getAccessToken, token existence/scope, Gmail API status/body. Safe debugging only."

### Objetivo

Instrumentar temporalmente el flujo Auth0 → Gmail con logs en terminal para diagnosticar 401/403 o token ausente/inválido, sin exponer tokens al cliente.

### Archivos modificados

- `lib/gmail-debug.ts` (nuevo)
- `app/dashboard/page.tsx`
- `lib/gmail.ts`
- `.env.example`
- `AI_DEV_LOG.md`

### Cambios realizados

- Módulo `lib/gmail-debug.ts` activado con `GMAIL_DEBUG=true` en `.env.local`.
- Logs de `getAccessToken`: keys del resultado, `tokenPresent`, `tokenLength`, `scope`, `expiresAt` (nunca el token completo).
- Logs de Gmail API: `status`, `is401`/`is403`, cuerpo de error sanitizado en `messages.list` y `messages.get`.
- UI y mensajes de error al usuario sin cambios.

### Notas técnicas

- Eliminar `lib/gmail-debug.ts` y llamadas cuando el problema esté resuelto.
- El mensaje UI "Session expired" corresponde a Gmail API HTTP 401, no necesariamente a sesión Auth0 caducada.

---

## [2026-05-26 17:00]

### Prompt

"Gmail API returns 401 — auth0.getAccessToken() returns Auth0 token, not Google provider token. Refactor to use Google provider access token from Auth0 session identity (google-oauth2). Safe debug logs for identities/providers. No architecture redesign."

### Objetivo

Usar el access token de Google almacenado en la sesión Auth0 (identidad federada) en lugar del token de API de Auth0 devuelto por `getAccessToken()`.

### Archivos modificados

- `lib/google-access-token.ts` (nuevo)
- `app/dashboard/page.tsx`
- `lib/gmail-debug.ts`
- `AI_DEV_LOG.md`

### Cambios realizados

- `getGoogleAccessTokenFromSession()`: lee token de `session.connectionTokenSets` (`google-oauth2`) o `session.user.identities[].access_token`.
- Dashboard: pasa `session` de `getSession()` a `loadGmailPreviews()`; ya no llama `auth0.getAccessToken()`.
- Debug: `debugLogSessionForGmail()` lista providers, presencia de token por identidad/connection, y metadata del `tokenSet` principal (audience/scope) sin valores de token.

### Notas técnicas

- `session.tokenSet.accessToken` es el token de Auth0 (audience Auth0 API) — incorrecto para Gmail.
- Google token vive en identidad federada o `connectionTokenSets` cuando Auth0 guarda tokens del proveedor.
- Si ambos están vacíos tras login: habilitar "Store tokens" en conexión Google en Auth0 y volver a autenticar.

---

## [2026-05-26 18:00]

### Prompt

"Gmail fails because provider tokens are not in App Router session (connectionTokenSets and identities null). Implement minimal server-side Google token retrieval via Auth0 Management API using session.sub. Reuse Gmail fetch. Safe debug logs. No DB/token persistence."

### Objetivo

Obtener el access token de Google (`google-oauth2`) desde el perfil de usuario en Auth0 vía Management API cuando la sesión del SDK no expone tokens de proveedor.

### Archivos modificados

- `lib/auth0-management.ts` (nuevo)
- `lib/google-access-token.ts`
- `app/dashboard/page.tsx`
- `lib/gmail-debug.ts`
- `lib/constants.ts`
- `.env.example`
- `AI_DEV_LOG.md`

### Cambios realizados

- Helper Management API: client credentials → `GET /api/v2/users/{sub}` → `identities[].access_token` para `google-oauth2`.
- `getGoogleAccessTokenForGmail()`: intenta sesión primero; si falla, usa Management API.
- Variables `AUTH0_MANAGEMENT_CLIENT_ID` / `AUTH0_MANAGEMENT_CLIENT_SECRET` (app M2M con `read:users`, `read:user_idp_tokens`).
- Logs temporales: éxito Management API, conteo de identidades, providers, presencia de token Google (sin valores completos).

### Notas técnicas

- La sesión Next.js solo incluye claims del ID token y `tokenSet` de Auth0; no serializa tokens de IdP en cookies por seguridad/tamaño.
- `connectionTokenSets` se rellena con `getAccessTokenForConnection`, no automáticamente en login en RSC.
- Management API lee el perfil canónico del usuario donde Auth0 guarda tokens de Google si "Store tokens" está activo en la conexión social.

---

## 2026-05-26 — Added temporary Gmail/Auth0 debug instrumentation

### Purpose

Investigate why Gmail API requests returned 401 Unauthorized despite successful Auth0 + Google authentication.

### Changes

- Added temporary server-side debug logging for:
  - Auth0 session structure
  - tokenSet presence
  - connectionTokenSets
  - Google identity/provider token availability
  - Gmail API response status/errors
  - Auth0 Management API responses
- Added optional `GMAIL_DEBUG` environment flag in `.env.local`
- Ensured no sensitive token values were logged

### Findings

- `auth0.getAccessToken()` returned Auth0 session/API tokens, not Google provider tokens
- App Router session did not expose Google federated tokens directly
- Provider token retrieval required Auth0 Management API + `read:user_idp_tokens`

### Outcome

Successfully identified and fixed Gmail provider token retrieval flow.

---

## [2026-05-26 19:00]

### Prompt

"Implement minimal Anthropic email summarization for the existing Gmail dashboard. Server-side only, claude-3-haiku, reuse Gmail previews, lib/anthropic.ts, no new routes/DB/streaming, ANTHROPIC_API_KEY."

### Objetivo

Generar un resumen conciso de los últimos correos con Anthropic y mostrarlo sobre la lista en el dashboard.

### Archivos modificados

- `lib/anthropic.ts` (nuevo)
- `app/dashboard/page.tsx`
- `package.json` / `package-lock.json`
- `.env.example`
- `AI_DEV_LOG.md`

### Cambios realizados

- Instalado `@anthropic-ai/sdk`.
- `generateEmailSummary(emails)`: prompt compacto (máx. 5 emails: sender, subject, date, snippet) → `claude-3-haiku-20240307`, retorna string o `null`.
- Dashboard: tras fetch Gmail exitoso, llama al helper y muestra sección "AI summary" sobre la lista; fallback si API falla o falta key.

### Notas técnicas

- Sin rutas API nuevas; todo en Server Component.
- Errores de Anthropic no rompen el dashboard; solo oculta/muestra mensaje de summary unavailable.

---

## [2026-05-26 19:30]

### Prompt

"Continue/finish Anthropic summarization integration from partial state. Refine prompt, temperature 0.3, dashboard summary above email list, subtle null fallback, no architecture drift."

### Objetivo

Completar integración server-side de resumen Anthropic sin cambiar auth/Gmail.

### Archivos modificados

- `lib/anthropic.ts`
- `app/dashboard/page.tsx`
- `AI_DEV_LOG.md`

### Cambios realizados

- Prompt refinado: updates, requests, meetings, deadlines, action items.
- `temperature: 0.3` en llamada a `claude-3-haiku-20240307`.
- Dashboard: `generateEmailSummary(gmail.emails)` tras fetch exitoso; UI "AI summary" sobre lista; fallback sutil si `null`.
- Sin logs de API key ni respuestas crudas de Anthropic.

### Notas técnicas

- `ANTHROPIC_API_KEY` leída solo en servidor vía `process.env`.
- Flujo secuencial: Gmail → summary → render (sin paralelización innecesaria).

---

## [2026-05-26 20:00]

### Prompt

"Implement and complete minimal Anthropic email summarization for the Gmail dashboard: server-side only, official `@anthropic-ai/sdk`, `claude-3-haiku-20240307`, reuse existing `EmailPreview` data (max 5 emails), `ANTHROPIC_API_KEY` from `.env.local`, summary UI above email list, graceful null fallback, no new API routes/client components/hooks/DB. Refine prompt and `temperature: 0.3`. Temporary `console.error` in Anthropic catch block to diagnose null summary (no API keys or full prompts logged)."

### Objetivo

Añadir resumen AI conciso de los correos recientes en el dashboard, ejecutado íntegramente en el servidor, sin alterar los flujos Auth0/Gmail existentes.

### Archivos modificados

- `lib/anthropic.ts` (nuevo)
- `app/dashboard/page.tsx`
- `package.json` / `package-lock.json`
- `.env.example`
- `AI_DEV_LOG.md`

### Cambios realizados

- Integración del SDK oficial `@anthropic-ai/sdk` con `generateEmailSummary(emails)` en `lib/anthropic.ts`.
- Modelo `claude-3-haiku-20240307`, `max_tokens: 300`, `temperature: 0.3`.
- Prompt: resumen en 2–4 frases centrado en actualizaciones, solicitudes, reuniones, plazos y acciones; entrada construida con sender, subject, date y snippet.
- Límite de 5 correos (`MAX_EMAILS`) alineado con el fetch Gmail existente.
- Dashboard (`app/dashboard/page.tsx`): tras Gmail exitoso, `await generateEmailSummary(gmail.emails)`; sección **AI summary** encima de la lista de correos.
- Fallback graceful: si el resumen es `null` (API key ausente, error SDK o lista vacía), el dashboard sigue mostrando correos y un mensaje sutil (*AI summary is temporarily unavailable*).
- Sin rutas API nuevas, sin `"use client"`, sin hooks/providers/contexts, streaming, retry ni persistencia.
- Variable `ANTHROPIC_API_KEY` documentada en `.env.example`.
- Depuración temporal pendiente/en curso: un único `console.error("[Anthropic] generateEmailSummary failed:", message)` en el `catch` de `lib/anthropic.ts` para ver el error real en terminal (sin registrar keys ni prompts completos).

### Notas técnicas

- **Riesgo:** `ANTHROPIC_API_KEY` inválida o ausente → `null` y fallback UI; no afecta Gmail ni auth.
- **Riesgo:** modelo o cuenta sin acceso a Haiku → error capturado; revisar mensaje en terminal con el log temporal.
- **Riesgo:** el log `console.error` es temporal; eliminarlo cuando el fallo esté identificado.
- La clave y las respuestas crudas de Anthropic no se exponen al cliente ni se registran en logs de depuración planificados.
- Orden de ejecución: sesión → token Google (Management API si aplica) → Gmail → Anthropic → render.

---

## [2026-05-26 20:15]

### Prompt

"Fix Anthropic model not found error by updating to an available Haiku model."

### Objetivo

Corregir error 404 de modelo Anthropic no disponible.

### Archivos modificados

- `lib/anthropic.ts`
- `AI_DEV_LOG.md`

### Cambios realizados

- Modelo actualizado a claude-sonnet-4-0.

### Notas técnicas

- Cambio mínimo sin alterar arquitectura existente.

---

## [2026-05-26 21:00]

### Prompt

"Implement minimal server-side Gmail date range filtering. Preserve architecture; no client state/hooks/date libraries. GET form with from/to on dashboard; extend Gmail fetch with optional `q` using `after:`/`before:`; keep summarization flow; missing dates = recent emails; update AI_DEV_LOG; run build."

### Objetivo

Filtrar correos de Gmail por rango de fechas en el servidor vía query string de búsqueda de Gmail, sin cambiar flujos Auth0/Anthropic ni añadir estado en cliente.

### Archivos modificados

- `lib/gmail.ts`
- `app/dashboard/page.tsx`
- `AI_DEV_LOG.md`

### Cambios realizados

- `buildGmailDateSearchQuery(from?, to?)`: convierte `YYYY-MM-DD` → `YYYY/MM/DD` y arma `after:` / `before:`; sin fechas devuelve `undefined`.
- `fetchRecentEmails(accessToken, maxResults?, q?)`: añade parámetro opcional `q` a `messages.list` cuando hay filtro.
- Dashboard: `searchParams` async (Next.js 16); formulario GET con inputs `from`/`to` y `defaultValue` desde URL; `loadGmailPreviews` pasa fechas al helper Gmail.
- Sin fechas seleccionadas: mismo comportamiento que antes (INBOX reciente, máx. 5).

### Notas técnicas

- Filtrado 100 % server-side; el formulario solo navega con query params.
- Gmail `before:` es exclusivo del día indicado; implementación mínima según assignment.
- Resumen Anthropic sigue usando la lista filtrada devuelta por Gmail.

---

## [2026-05-26 22:00]

### Prompt

"Implement minimal Prisma + SQLite persistence for AI summaries. SummaryHistory model (id, createdAt, fromDate, toDate, summary); lib/prisma.ts singleton; save after successful generation; no emails/tokens/auth; graceful DB failure; update AI_DEV_LOG; prisma migrate dev + build."

### Objetivo

Persistir solo el texto del resumen AI y el rango de fechas seleccionado en SQLite, sin alterar flujos Gmail/Auth0 ni la UI del dashboard.

### Archivos modificados

- `package.json` / `package-lock.json`
- `prisma/schema.prisma` (nuevo)
- `prisma/migrations/` (nuevo)
- `lib/prisma.ts` (nuevo)
- `app/dashboard/page.tsx`
- `.env.example`
- `.gitignore`
- `AI_DEV_LOG.md`

### Cambios realizados

- Prisma + SQLite con modelo `SummaryHistory` (`fromDate`/`toDate` opcionales, `summary` texto).
- Cliente singleton en `lib/prisma.ts` (patrón `globalThis` para dev).
- Dashboard: tras `generateEmailSummary` exitoso, `prisma.summaryHistory.create` en `try/catch`; fallo de DB no afecta render ni resumen.
- `DATABASE_URL=file:./dev.db` documentado; `prisma/dev.db` en `.gitignore`.
- Scripts `postinstall` y `build` ejecutan `prisma generate`.

### Notas técnicas

- No se guardan correos, tokens ni datos de usuario.
- Sin capas repository/service; insert directo desde Server Component.
- Migración inicial: `init_summary_history`.

---

## [2026-05-26 23:00]

### Prompt

"Implement minimal summary history page: app/dashboard/history/page.tsx, Prisma query newest first, simple list (createdAt, date range, summary preview), empty state, link from dashboard, server-only, no pagination/CRUD/hooks; update AI_DEV_LOG; npm run build."

### Objetivo

Mostrar resúmenes AI guardados en SQLite como historial legible, sin panel de base de datos ni lógica extra.

### Archivos modificados

- `app/dashboard/history/page.tsx` (nuevo)
- `app/dashboard/page.tsx`
- `lib/constants.ts`
- `AI_DEV_LOG.md`

### Cambios realizados

- Página `/dashboard/history`: `findMany` ordenado por `createdAt` desc; tarjetas con fecha/hora, rango de filtro y texto truncado (~240 caracteres).
- Estado vacío: *No summaries saved yet*; error de carga con alerta suave (sin exponer Prisma/SQLite en UI).
- Dashboard: enlace *View Summary History* (`ROUTES.summaryHistory`).
- Server Component únicamente; sin hooks, paginación ni acciones CRUD.

### Notas técnicas

- Protegida por el mismo middleware que `/dashboard`.
- `truncateSummary` y formateo de fechas inline en la página (sin utilidades nuevas compartidas).

---

## [2026-05-26 23:30]

### Prompt

"Enhance AI summary flow with lightweight action item extraction: plain-text Summary + Action items sections from Anthropic, dashboard renders both, preserve fallback/history/DB flow; no JSON/schemas/frameworks; update AI_DEV_LOG; build."

### Objetivo

Extraer ítems de acción junto al resumen sin parsing estructurado ni cambios de arquitectura.

### Archivos modificados

- `lib/anthropic.ts`
- `app/dashboard/page.tsx`
- `AI_DEV_LOG.md`

### Cambios realizados

- Prompt pide dos secciones en texto plano: `Summary:` y `Action items:` (bullets o `None`).
- `parseEmailSummaryResponse`: split simple por cabecera; retorna `EmailSummaryResult | null`.
- `formatEmailSummaryForStorage`: concatena resumen + acciones para persistencia en `SummaryHistory`.
- Dashboard: sección **Action items** bajo el resumen si hay contenido; fallback sin cambios.
- `max_tokens` subido a 400 para caber ambas secciones.

### Notas técnicas

- Historial sigue mostrando el texto guardado (incluye acciones si existían).
- Sin JSON, schemas ni capas nuevas; parsing mínimo por delimitador de sección.

---

