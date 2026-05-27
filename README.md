## ImpactIQ — AI Gmail Inbox Summarizer (EN / ES)

### 1) Title + short overview

#### English
An AI-powered Gmail inbox summarizer built for the ImpactIQ internship technical assignment.

#### Español
Un resumidor de bandeja de entrada de Gmail impulsado por IA, construido para el desafío técnico de la pasantía de ImpactIQ.

---

### 2) Live Demo + Repository

#### English
- Live deployment: https://prueba-tecnica-zeta-flame.vercel.app/
- GitHub repository: https://github.com/OtterDuckness/PruebaTecnica

#### Español
- Despliegue en vivo: https://prueba-tecnica-zeta-flame.vercel.app/
- Repositorio GitHub: https://github.com/OtterDuckness/PruebaTecnica

---

### 3) Features / Funcionalidades

#### English
- Google OAuth authentication (Auth0)
- Gmail inbox retrieval
- AI-generated email summaries
- AI action item extraction
- English/Spanish translation
- Date range filtering
- Summary history persistence (Prisma + Neon Postgres)
- Server-side architecture
- Responsive dashboard UI

#### Español
- Autenticación con Google OAuth (Auth0)
- Lectura de bandeja de entrada de Gmail
- Resúmenes generados por IA
- Extracción de acciones a partir del contenido
- Traducción entre inglés/español
- Filtrado por rango de fechas
- Persistencia del historial de resúmenes (Prisma + Neon Postgres)
- Arquitectura server-side
- UI responsive del dashboard

---

### 4) Tech Stack

#### English
- Next.js App Router
- TypeScript
- TailwindCSS
- Auth0
- Gmail API
- Anthropic SDK (Claude Sonnet 4)
- Prisma ORM
- Neon Postgres
- Vercel

#### Español
- Next.js App Router
- TypeScript
- TailwindCSS
- Auth0
- Gmail API
- Anthropic SDK (Claude Sonnet 4)
- Prisma ORM
- Neon Postgres
- Vercel

---

### 5) Architecture Overview / Arquitectura

#### English
Flow:

```text
User
→ Auth0 authentication
→ Google OAuth access token
→ Gmail API fetch
→ Anthropic summarization
→ Prisma persistence (original summary only)
→ Dashboard rendering
```

Notes:
- Gmail API calls are server-side only.
- Tokens are not persisted.
- Minimal architecture approach: no vector DB / RAG / orchestration frameworks.

#### Español
Flujo:

```text
Usuario
→ Autenticación con Auth0
→ Token de acceso OAuth de Google
→ Lectura con Gmail API
→ Resumen con Anthropic
→ Persistencia con Prisma (solo resumen original)
→ Render del dashboard
```

Notas:
- Llamadas a Gmail API solo desde el servidor.
- Los tokens no se persisten.
- Arquitectura mínima: sin vector DB / RAG / frameworks de orquestación.

---

### 6) Local Setup / Configuración local

#### English
```bash
npm install
npm run dev
npx prisma migrate dev
```

#### Español
```bash
npm install
npm run dev
npx prisma migrate dev
```

---

### 7) Environment Variables / Variables de entorno

#### English
Required variables:
- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_SECRET`
- `APP_BASE_URL`
- `AUTH0_MANAGEMENT_CLIENT_ID`
- `AUTH0_MANAGEMENT_CLIENT_SECRET`
- `ANTHROPIC_API_KEY`
- `DATABASE_URL`

#### Español
Variables requeridas:
- `AUTH0_DOMAIN`
- `AUTH0_CLIENT_ID`
- `AUTH0_CLIENT_SECRET`
- `AUTH0_SECRET`
- `APP_BASE_URL`
- `AUTH0_MANAGEMENT_CLIENT_ID`
- `AUTH0_MANAGEMENT_CLIENT_SECRET`
- `ANTHROPIC_API_KEY`
- `DATABASE_URL`

---

### 8) Production Deployment / Despliegue

#### English
- Hosted on Vercel.
- Uses Neon Postgres in production.
- Auth0 callback URLs are required for login/logout to work.
- Google OAuth remains in Testing mode due to Gmail `readonly` scopes.
- Reviewer Gmail accounts can be added as test users.

#### Español
- Publicado en Vercel.
- Usa Neon Postgres en producción.
- Se requieren URLs de callback de Auth0 para que el login/logout funcione.
- Google OAuth permanece en modo Testing por los scopes `readonly` de Gmail.
- Las cuentas Gmail del revisor se pueden agregar como usuarios de prueba.

---

### 9) AI-assisted Development / Desarrollo asistido por IA

#### English
- Cursor was used for implementation.
- ChatGPT was used for architecture guidance, debugging, and review.
- `AI_DEV_LOG.md` documents the development prompts and workflow.

#### Español
- Cursor se usó para la implementación.
- ChatGPT se usó para guía de arquitectura, depuración y revisión.
- `AI_DEV_LOG.md` documenta los prompts y el flujo de trabajo del desarrollo.

---
