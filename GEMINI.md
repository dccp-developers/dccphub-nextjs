# Project Overview

This project, named `apple-pass`, is a Next.js application written in TypeScript. It serves as a comprehensive starter kit, integrating various modern web development technologies and functionalities. Key features and technologies include:

-   **Frontend:** Next.js, React, Tailwind CSS, Radix UI for accessible and customizable components.
-   **Authentication:** Clerk for user authentication and management.
*   **Backend/Database:** The backend is powered by a Laravel API, which is the source of truth for all data. The Next.js application interacts with this API via a dedicated client in `@lib/laravel-api.ts`. Elysia is also used to create a type-safe client, replacing traditional Next.js fetching methods.
-   **API/External Services:** Integration with OpenAI SDK (AI/LLM capabilities), AWS S3 client (for storage, possibly via Cloudflare R2 as suggested by `next.config.ts`), and `@walletpass/pass-js` for Apple Wallet passes.
-   **State Management/Data Fetching:** `@tanstack/react-query` for server state management.
-   **Linting & Formatting:** ESLint for code quality, configured with Next.js best practices and TypeScript support.
-   **Development Experience:** Uses Turbopack for faster development builds.

The project appears to be a robust foundation for a full-stack application, potentially focused on education (given folders like `app/dashboard/announcements`, `assignments`, `grades`, `teachers`, `students`), with advanced features like AI integration and Apple Pass generation.

# Building and Running

The `package.json` file defines the following scripts for building and running the project:

-   **Development Server:**
    ```bash
    bun run dev
    ```
    Starts the Next.js development server with Turbopack for improved performance.
-   **Production Build:**
    ```bash
    bun run build
    ```
    Creates an optimized production build of the application.
-   **Start Production Server:**
    ```bash
    bun run start
    ```
    Starts the Next.js production server after the application has been built.
-   **Linting:**
    ```bash
    bun run lint
    ```
    Runs ESLint to check for code quality and style issues.

# Development Conventions

-   **Language:** TypeScript is used throughout the project for type safety and improved developer experience.
-   **Styling:** Tailwind CSS is the primary styling framework, complemented by Radix UI for unstyled, accessible components. Dark mode is supported and can be toggled by the `dark` class. Custom colors are defined using CSS variables.
-   **Linting:** ESLint is configured with `next/core-web-vitals` and `next/typescript` to enforce code quality and consistency, specifically adhering to Next.js and TypeScript best practices.
-   **Component Structure:** Components are organized within the `components/` directory, with specific subdirectories for UI primitives (`components/ui`) and homepage-related components (`components/homepage`). Dashboard components are located under `app/dashboard/_components`.
*   **API Routes/Backend:** Data consumption for the application primarily occurs via a Laravel API, managed through the `@lib/laravel-api.ts` client. `app/api/` and `server/routes/` are used for Next.js-specific API routes, potentially serving as proxies or for functionalities not directly handled by the Laravel API. The backend logic seems to leverage Elysia. Elysia is also used to create a type-safe client for fetching data, replacing traditional Next.js data fetching methods.
