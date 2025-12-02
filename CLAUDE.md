# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

The project uses **Bun** as the primary package manager. All commands can be run with either `bun` :

```bash
# Development server with Turbopack
bun run dev


# Production build
bun run build


# Start production server
bun run start


# Lint code
bun run lint

```

Note: TypeScript build errors are ignored during build (`next.config.ts:typescript.ignoreBuildErrors: true`).

## Project Overview

This is a **Next.js SaaS starter kit** for an education platform with both **student and faculty portals**. The project combines:

-   **Frontend**: Next.js 16 with App Router, TypeScript, Tailwind CSS v4, and shadcn/ui components
-   **Backend**: Elysia framework (Bun-optimized) mounted via Next.js catch-all routes
-   **External API**: Laravel API for authoritative student/faculty data
-   **Database**: Prisma + PostgreSQL (Neon) for local application data
-   **Authentication**: Clerk (not Better Auth as README suggests)
-   **File Storage**: Cloudflare R2 (S3-compatible)
-   **UI Components**: Radix UI primitives, Tailwind CSS, shadcn/ui
-   **Additional Features**: OpenAI integration (chatbot), Polar.sh (subscriptions), Uploadthing, PostHog analytics

## High-Level Architecture

### 1. Frontend (Next.js App Router)

**Location**: `app/`

The frontend uses Next.js 16 with the App Router:

-   `app/dashboard/` - Protected dashboard with sidebar navigation
-   `app/(auth)/` - Authentication pages
-   `app/api/[[...slugs]]/route.ts` - Mounts Elysia backend
-   `app/page.tsx` - Landing page

**Dashboard Structure**: `app/dashboard/`

-   `/faculty` - Faculty portal (classes, grades, announcements)
-   `/student` - Student portal (subjects, schedule, enrollment)
-   `/schedule` - Class schedules
-   `/grades` - Grade management (faculty)
-   `/subjects` - Subject listings (students)
-   `/_components/` - Dashboard-specific components

**Key Contexts**:

-   `contexts/semester-context.ts` - Academic period/semester state management

### 2. Backend (Elysia Framework)

**Location**: `server/`

The backend is an **Elysia app** (optimized for Bun) that provides type-safe APIs:

```
server/
├── index.ts              # Main Elysia app, mounted at /api in Next.js
├── lib/auth.ts          # Auth helpers (requireAuth, unauthorized)
└── routes/
    ├── auth.ts          # Student auth routes
    ├── students.ts      # Student validation/management
    ├── faculty.ts       # Faculty routes (classes, grades)
    ├── faculty-classes.ts # Class-specific operations
    ├── schedule.ts      # Schedule endpoints
    ├── academic-periods.ts
    ├── enrollment.ts    # Student enrollment
    ├── chat.ts         # AI chat endpoint (OpenAI)
    ├── upload-image.ts # Image upload (R2)
    └── debug.ts        # Debug endpoints
```

**All routes are prefixed with `/api`** (handled in `server/index.ts`)

The backend serves two purposes:

1. Provides type-safe API with Eden Treaty client for frontend
2. **Proxies to Laravel API** for authoritative student/faculty data (see `lib/laravel-api.ts`)

### 3. External Data Sources

**Laravel API Integration**: `lib/laravel-api.ts`

-   This is the **source of truth** for student/faculty data
-   Handles authentication via Sanctum
-   Provides class details, schedules, enrollment data
-   Configured via `DCCP_API_URL` and `DCCP_API_TOKEN` in `.env`

### 4. File Structure

```
├── app/                    # Next.js App Router
│   ├── dashboard/         # Protected dashboard routes
│   ├── api/               # API routes (mounts Elysia)
│   ├── sign-in/          # Clerk auth pages
│   └── sign-up/
├── components/            # Reusable UI components
│   ├── ui/               # shadcn/ui components
│   └── homepage/         # Landing page sections
├── lib/                   # Utilities and integrations
│   ├── laravel-api.ts    # Laravel API client
│   ├── prisma.ts         # Prisma client
│   ├── r2.ts            # R2 storage config
│   └── upload-image.ts  # Upload helpers
├── server/                # Elysia backend
│   ├── index.ts         # Main app
│   ├── lib/             # Backend utilities
│   └── routes/          # API endpoints
├── prisma/               # Database schema and migrations
└── hooks/               # React hooks
```

## Key Technologies & Patterns

### Authentication

-   **Clerk** for authentication (not Better Auth despite README)
-   Configured via `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`
-   Auth pages in `app/sign-in/` and `app/sign-up/`

### Database

-   **Important**: Laravel API is the source of truth, not Prisma

### File Uploads

-   **Cloudflare R2** for file storage (S3-compatible)
-   Config in `lib/r2.ts`
-   Upload helper in `lib/upload-image.ts`
-   Remote patterns configured in `next.config.ts` for R2 and Vercel Storage

### AI Integration

-   OpenAI SDK for chatbot functionality
-   Chatbot component in `app/dashboard/_components/chatbot.tsx`
-   Backend endpoint in `server/routes/chat.ts`

### UI Framework

-   **Tailwind CSS v4** with CSS variables for theming
-   **shadcn/ui** components built on Radix UI
-   Dark/light mode support via `next-themes`
-   Custom theme in `tailwind.config.ts`

## Environment Variables

Required in `.env`:

```env
# Database
DATABASE_URL=postgresql://...

# Clerk Auth
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...

# Laravel API
DCCP_API_URL=http://localhost:8000
DCCP_API_TOKEN=...

# Cloudflare R2
R2_UPLOAD_IMAGE_ACCESS_KEY_ID=...
R2_UPLOAD_IMAGE_SECRET_ACCESS_KEY=...
CLOUDFLARE_ACCOUNT_ID=...
R2_UPLOAD_IMAGE_BUCKET_NAME=...

# OpenAI
OPENAI_API_KEY=...

# Polar.sh (optional)
POLAR_ACCESS_TOKEN=...
NEXT_PUBLIC_STARTER_TIER=...
```

## Common Development Patterns

### Making API Calls

**Option 1: Type-safe Eden client** (recommended)

```typescript
import { api } from "@/lib/api-client";

const { data, error } = await api.faculty.classes.get();
// All endpoints are type-safe
```

**Option 2: Fetch directly**

```typescript
const res = await fetch("/api/faculty/classes", {
    headers: { Authorization: "..." },
});
```

### Database Queries

```typescript
import { prisma } from "@/lib/prisma";

const data = await prisma.accounts.findMany({
    where: { role: "faculty" },
});
```

### Laravel API Calls

```typescript
import { laravelApi } from "@/lib/laravel-api";

const classData = await laravelApi.getClassDetails(classId);
```

### Adding New Routes

1. **Elysia route** (server-side):

    - Create `server/routes/my-route.ts`
    - Import and use in `server/index.ts`

2. **Next.js page** (client-side):
    - Create `app/dashboard/my-feature/page.tsx`
    - Add to sidebar navigation if needed

## Important Notes

-   **Laravel API is authoritative** - don't store student/faculty core data in Prisma
-   **React Strict Mode disabled** in `next.config.ts` (`reactStrictMode: false`)
-   **TypeScript build errors ignored** during build for convenience
-   Use **Bun** for better performance (package manager and runtime)
-   The project was originally a SaaS starter but is now an education platform
-   Components use the `cn()` helper from `lib/utils.ts` for className merging
-   All API routes are now Elysia-based (old Next.js API routes removed)

## Deployment

-   **Recommended**: Vercel for frontend
-   Ensure all environment variables are configured
-   Database: Neon PostgreSQL (recommended)
-   File Storage: Cloudflare R2
-   Backend: Runs via Next.js API routes (no separate deployment needed)

## Recent Changes

Latest commits show active development of:

-   Faculty dashboard integration with Laravel API
-   Elysia backend migration
-   Student enrollment verification
-   Academic period management
-   Grade and curriculum checklist features
