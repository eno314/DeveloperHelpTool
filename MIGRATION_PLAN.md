# Next.js Application Migration Plan

This document outlines the step-by-step plan to upgrade the application from Next.js 12 (Pages Router), React 17, and Node.js 14 to the latest stable Next.js 15.x, React 19, and Node.js 22, using an incremental approach.

## 1. Analysis of Current State

**Current Environment:**
- **Node.js**: `14.18.2` (via `.node-version`)
- **Next.js**: `12.x`
- **React**: `17.x`
- **Testing**: Jest `27.x`, React Testing Library `12.x`
- **TypeScript**: `4.3.5`
- **Routing**: Pages Router (`src/pages`)

**Target Environment:**
- **Node.js**: `22.x`
- **Next.js**: `15.x` (latest stable)
- **React**: `19`
- **Testing**: Jest `29.x`, React Testing Library `16.x` (or latest compatible)
- **TypeScript**: `5.x`
- **Routing**: App Router (`src/app`), using an incremental migration strategy.

## 2. Breaking Changes & Deprecated APIs to Address

- **Node.js 14 to 22**:
  - Global `fetch` is now available (no need for polyfills).
  - Significant updates to native modules and ECMAScript features.
- **React 17 to 19**:
  - React 18 introduced concurrent rendering and `createRoot` (replacing `ReactDOM.render`).
  - React 19 introduces new hooks (`use`, `useActionState`, etc.) and transitions.
  - Functional components no longer implicitly include `children` in their types.
- **Next.js 12 to 15**:
  - **Routing**: Shift from Pages Router (`pages/`) to App Router (`app/`).
  - **Data Fetching**: `getServerSideProps` and `getStaticProps` are replaced by standard `async`/`await` in Server Components.
  - **Images**: `next/image` requires updates (legacy behavior removed).
  - **Link**: `<Link>` no longer requires a nested `<a>` tag.
  - **API Routes**: Moved to `app/api/.../route.ts` with standard Request/Response objects.
- **Jest & Testing**:
  - Jest 27 to 29: Default test environment behavior changes.
  - React Testing Library needs to support React 18/19 and Server Components where applicable.

## 3. Step-by-Step Migration Plan

### Step 1: Upgrade Node.js and TypeScript
1. Update `.node-version` to `22.x`.
2. Ensure local environments and CI/CD pipelines use Node.js 22.
3. Upgrade `typescript` to `^5.x` and `@types/node` to `^22.x`.
4. Fix any new TypeScript compilation errors.

### Step 2: Upgrade React & Next.js to Latest (Pages Router Compatibility)
*Goal: Upgrade core dependencies while keeping the existing `pages/` directory functioning.*
1. Upgrade `react` and `react-dom` to `19`.
2. Upgrade `next` to the latest stable `15.x`.
3. Update `next.config.js` or `next.config.mjs` according to the new schema.
4. Update ESLint and its plugins but **keep ESLint 8** to avoid mixing configuration issues (do not migrate to ESLint 9/Flat Config).
5. Run React's official codemods (e.g., to automatically remove implicit `children` from `React.FC` and other React 18/19 changes) to automatically fix breaking changes.
6. Fix remaining breaking changes in `src/pages/` components manually:
   - Remove nested `<a>` tags inside `<Link>`.
   - Update `next/image` usages to the new format.
   - Update `ReactDOM.render` to `createRoot` in custom setup (if applicable).

### Step 3: Upgrade Testing Infrastructure
1. Upgrade `jest` and `ts-jest` to `^29.x`.
2. Upgrade `@testing-library/react` and `@testing-library/jest-dom` to their latest versions for React 18/19 compatibility.
3. Replace custom babel/ts-jest setups with `@swc/jest` or Next.js’s built-in Jest configuration (`next/jest`).
4. Ensure all existing tests pass under the Pages Router setup.

### Step 4: Incremental Migration to App Router
*Goal: Move pages one by one from `src/pages/` to `src/app/`.*
1. **Initialize App Router**:
   - Create `src/app/layout.tsx` (Root Layout).
   - Create `src/app/page.tsx` (optional initial page).
2. **Migrate Global Styles and Contexts**:
   - Move global CSS and providers from `src/pages/_app.tsx` and `src/pages/_document.tsx` to `src/app/layout.tsx`.
3. **Migrate Individual Pages (Iterative)**:
   - For each page in `src/pages/` (e.g., `index.tsx`, `json/`, `string/`, `url/`):
     - Create the corresponding route in `src/app/`.
     - Refactor data fetching (`getServerSideProps`/`getStaticProps`) to use React Server Components (`async`/`await` fetch).
     - Separate client-side interactivity by extracting components and adding the `"use client"` directive where necessary.
     - Delete the old file from `src/pages/`.
4. **Migrate API Routes**:
   - Move API endpoints from `src/pages/api/` to `src/app/api/.../route.ts` (if applicable).
   - Update signatures to use standard Web Request/Response objects instead of Next.js specific `req/res`.

### Step 5: Test and Verify App Router Components
1. Write or update tests for the new App Router components.
2. For React Server Components, test pure rendering logic or use E2E testing (like Playwright/Cypress) to verify the data fetching and rendering flow.
3. For Client Components (`"use client"`), continue using React Testing Library as before.

### Step 6: Final Cleanup
1. Once all pages and API routes are migrated, delete the `src/pages/` directory entirely.
2. Remove any lingering legacy dependencies or workarounds.
3. Run a final suite of linting, type-checking, and tests to ensure total stability.
