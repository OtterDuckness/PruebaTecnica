# ImpactIQ — AI Gmail Inbox Summarizer

This project was built as part of the ImpactIQ Junior Application Developer internship technical assignment.

An AI-powered Gmail inbox summarizer built with Next.js, Auth0, Gmail API, Anthropic Claude, Prisma, and Neon Postgres.

---

# English

## Live Demo & Repository

- Live Demo: https://prueba-tecnica-zeta-flame.vercel.app/
- Repository: https://github.com/OtterDuckness/PruebaTecnica

---

## Features

- Google OAuth authentication (Auth0)
- Gmail inbox retrieval
- AI-generated email summaries
- AI action item extraction
- English/Spanish translation
- Date range filtering
- Summary history persistence (Prisma + Neon Postgres)
- Server-side architecture
- Responsive dashboard interface

---

## Tech Stack

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

## Architecture Overview

### Flow

```text
User
→ Auth0 authentication
→ Google OAuth access token
→ Gmail API fetch
→ Anthropic summarization
→ Prisma persistence (original summary only)
→ Dashboard rendering
```

### Notes

- Gmail API calls are server-side only
- Tokens are not persisted
- Minimal architecture approach
- No vector DB / RAG / orchestration frameworks

---

## Local Setup

### Install dependencies

```bash
npm install
```

### Start development server

```bash
npm run dev
```

### Run Prisma migrations

```bash
npx prisma migrate dev
```

---

## Required Environment Variables

```env
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SECRET=
APP_BASE_URL=

AUTH0_MANAGEMENT_CLIENT_ID=
AUTH0_MANAGEMENT_CLIENT_SECRET=

ANTHROPIC_API_KEY=

DATABASE_URL=
```

---

## Production Deployment

- Hosted on Vercel
- Uses Neon Postgres in production
- Auth0 callback URLs are required for authentication
- Google OAuth remains in Testing mode due to Gmail readonly scopes
- Reviewer Gmail accounts can be added as Google OAuth test users

### Important Reviewer Note

Because the application uses Gmail readonly scopes, Google OAuth remains in Testing mode. Reviewer Gmail accounts must be added as Google OAuth test users before access is granted.

---

## AI-Assisted Development

- Cursor was used for implementation
- ChatGPT was used for architecture guidance, debugging, and review
- `AI_DEV_LOG.md` documents the implementation workflow and prompts

---

---

# Español

## Demo y Repositorio

- Demo: https://prueba-tecnica-zeta-flame.vercel.app/
- Repositorio: https://github.com/OtterDuckness/PruebaTecnica

---

## Funcionalidades

- Autenticación con Google OAuth (Auth0)
- Lectura de bandeja de entrada de Gmail
- Resúmenes generados por IA
- Extracción de acciones a partir del contenido
- Traducción entre inglés y español
- Filtrado por rango de fechas
- Persistencia del historial de resúmenes (Prisma + Neon Postgres)
- Arquitectura server-side
- Interfaz responsive del dashboard

---

## Stack Tecnológico

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

## Arquitectura

### Flujo

```text
Usuario
→ Autenticación con Auth0
→ Token OAuth de Google
→ Lectura mediante Gmail API
→ Resumen con Anthropic
→ Persistencia con Prisma (solo resumen original)
→ Renderizado del dashboard
```

### Notas

- Las llamadas a Gmail API se realizan únicamente desde el servidor
- Los tokens no se persisten
- Arquitectura mínima y simple
- Sin vector DB / RAG / frameworks de orquestación

---

## Configuración Local

### Instalar dependencias

```bash
npm install
```

### Iniciar entorno de desarrollo

```bash
npm run dev
```

### Ejecutar migraciones Prisma

```bash
npx prisma migrate dev
```

---

## Variables de Entorno Requeridas

```env
AUTH0_DOMAIN=
AUTH0_CLIENT_ID=
AUTH0_CLIENT_SECRET=
AUTH0_SECRET=
APP_BASE_URL=

AUTH0_MANAGEMENT_CLIENT_ID=
AUTH0_MANAGEMENT_CLIENT_SECRET=

ANTHROPIC_API_KEY=

DATABASE_URL=
```

---

## Despliegue en Producción

- Publicado en Vercel
- Usa Neon Postgres en producción
- Las callback URLs de Auth0 son necesarias para el login/logout
- Google OAuth permanece en modo Testing debido a los scopes readonly de Gmail
- Las cuentas Gmail de los revisores pueden añadirse como usuarios de prueba

### Nota Importante para Revisores

Debido al uso de scopes readonly de Gmail, Google OAuth permanece en modo Testing. Las cuentas Gmail de los revisores deben agregarse como usuarios de prueba para poder acceder a la aplicación.

---

## Desarrollo Asistido por IA

- Cursor se utilizó para la implementación
- ChatGPT se utilizó para guía de arquitectura, depuración y revisión
- `AI_DEV_LOG.md` documenta el flujo de trabajo y los prompts utilizados durante el desarrollo
