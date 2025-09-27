## Relevant Files

### Core Application

- `src/components/MealPlanningWizard.tsx` - Main 4-step setup wizard component for meal planning.
- `src/components/MealPlanningWizard.test.tsx` - Unit tests for `MealPlanningWizard.tsx`.
- `src/components/MealPlanDisplay.tsx` - Component to display planned meals in list view grouped by day.
- `src/components/MealPlanDisplay.test.tsx` - Unit tests for `MealPlanDisplay.tsx`.
- `src/components/PrepChecklist.tsx` - Component to display optimized prep checklists.
- `src/components/PrepChecklist.test.tsx` - Unit tests for `PrepChecklist.tsx`.
- `src/App.tsx` - Main application component.
- `src/App.test.tsx` - Unit tests for `App.tsx`.
- `src/main.tsx` - React application entry point with PWA registration.

### Database & Storage

- `src/database/recipes.sqlite` - SQLite database with FTS5 index for recipes.
- `src/database/schema.sql` - SQLite schema definitions.
- `src/database/sqliteWorker.ts` - Web Worker for SQLite WASM operations.
- `src/database/recipes.ts` - Dexie store for meal plans and user preferences.
- `src/database/recipes.test.ts` - Unit tests for Dexie store operations.
- `src/services/recipeService.ts` - Service layer for recipe operations with SQLite WASM.
- `src/services/recipeService.test.ts` - Unit tests for `recipeService.ts`.

### Forms & Validation

- `src/forms/IngredientInputForm.tsx` - Form component for ingredient input with Zod validation.
- `src/forms/IngredientInputForm.test.tsx` - Unit tests for `IngredientInputForm.tsx`.
- `src/forms/WizardForms.tsx` - Wizard form components with React Hook Form.
- `src/forms/WizardForms.test.tsx` - Unit tests for `WizardForms.tsx`.
- `src/schemas/recipeSchemas.ts` - Zod schemas for recipe and meal plan validation.
- `src/schemas/recipeSchemas.test.ts` - Unit tests for Zod schemas.

### State Management

- `src/stores/mealPlanningStore.ts` - Zustand store for meal planning state.
- `src/stores/mealPlanningStore.test.ts` - Unit tests for Zustand store.
- `src/stores/userPreferencesStore.ts` - Zustand store for user preferences.
- `src/stores/userPreferencesStore.test.ts` - Unit tests for user preferences store.

### Services & Utils

- `src/services/prepOptimizer.ts` - Service to generate optimized prep checklists.
- `src/services/prepOptimizer.test.ts` - Unit tests for `prepOptimizer.ts`.
- `src/services/planConstraintEngine.ts` - Business logic for meal planning rules and overrides.
- `src/services/planConstraintEngine.test.ts` - Unit tests for `planConstraintEngine.ts`.
- `src/utils/mealPlanningUtils.ts` - Utility functions for meal planning logic.
- `src/utils/mealPlanningUtils.test.ts` - Unit tests for `mealPlanningUtils.ts`.
- `src/utils/sqliteUtils.ts` - Utility functions for SQLite WASM operations.
- `src/utils/sqliteUtils.test.ts` - Unit tests for SQLite utilities.

### Types & Schemas

- `src/types/mealPlanning.ts` - TypeScript interfaces and types for meal planning data structures.
- `src/types/recipes.ts` - TypeScript interfaces for recipe data structures.
- `src/types/database.ts` - TypeScript interfaces for database operations.

### ETL Pipeline

- `scripts/etl/recipeProcessor.ts` - Node.js script to process recipe JSON into SQLite.
- `scripts/etl/recipeProcessor.test.ts` - Unit tests for ETL processor.
- `scripts/etl/recipes.json` - Source recipe data in JSON format.
- `scripts/etl/buildRecipes.ts` - Build script to generate recipes.sqlite.

### PWA & Build

- `public/sw.js` - Service worker for PWA functionality.
- `public/workbox-config.js` - Workbox configuration for caching strategies.
- `public/index.html` - Main HTML entry point for the web application.
- `public/recipes.sqlite` - Built SQLite database file for distribution.
- `src/components/UpdatePrompt.tsx` - Service worker update prompt UX component.
- `src/components/UpdatePrompt.test.tsx` - Unit tests for `UpdatePrompt.tsx`.
- `src/components/ErrorBoundary.tsx` - Error boundary component for graceful error handling.
- `src/components/ErrorBoundary.test.tsx` - Unit tests for `ErrorBoundary.tsx`.
- `src/components/LoadingSpinner.tsx` - Loading state component.
- `src/components/LoadingSpinner.test.tsx` - Unit tests for `LoadingSpinner.tsx`.

### Configuration

- `package.json` - Project dependencies and scripts configuration.
- `tsconfig.json` - TypeScript configuration with strict mode.
- `tailwind.config.js` - Tailwind CSS configuration for responsive design.
- `vite.config.ts` - Vite build configuration with PWA plugin.
- `vitest.config.ts` - Vitest testing configuration.
- `playwright.config.ts` - Playwright E2E testing configuration.
- `.eslintrc.js` - ESLint configuration.
- `.prettierrc` - Prettier configuration.
- `pnpm-workspace.yaml` - PNPM workspace configuration.
- `.github/workflows/ci.yml` - GitHub Actions CI/CD pipeline with ETL validation.
- `public/csp-config.js` - Content Security Policy configuration.
- `docs/privacy-policy.md` - Minimal privacy documentation.

### E2E Tests

- `tests/e2e/wizard-flow.spec.ts` - Playwright E2E test for complete wizard flow.
- `tests/e2e/aha-moment.spec.ts` - E2E test for "aha moment" under 2 minutes.
- `tests/e2e/offline-pwa.spec.ts` - Playwright E2E test for offline PWA functionality.
- `tests/e2e/accessibility.spec.ts` - E2E test for keyboard navigation and screen reader compatibility.

### Notes

- Unit tests use Vitest and should be placed alongside the code files they are testing.
- Use `pnpm test` to run unit tests, `pnpm test:e2e` for Playwright tests.
- SQLite WASM runs in Web Worker to avoid blocking the main thread.
- ETL pipeline processes recipes from JSON to SQLite with FTS5 indexing.
- PWA configuration precaches app shell and recipes.sqlite for offline use.
- OPFS is optional (Phase 2) - falls back to IndexedDB for browser compatibility.
- Recipe search moved to admin/Phase 2 - wizard-first approach for MVP.
- Drag-and-drop and prep reordering moved to Phase 2 for faster MVP delivery.

## Tasks

- [x] 1.0 Project Setup and Configuration
  - [x] 1.1 Initialize Vite + React + TypeScript project with strict mode
  - [x] 1.2 Configure PNPM workspace and package.json with all dependencies
  - [x] 1.3 Set up ESLint + Prettier with strict rules and pre-commit hooks
  - [x] 1.4 Configure Tailwind CSS with responsive design utilities
  - [x] 1.5 Set up Vitest for unit testing with React Testing Library
  - [x] 1.6 Configure Playwright for E2E testing
  - [x] 1.7 Set up Vite PWA plugin with Workbox configuration

- [ ] 2.0 Database Infrastructure and ETL Pipeline
  - [ ] 2.1 Create SQLite schema with recipes table and FTS5 virtual table
  - [ ] 2.2 Set up SQLite WASM with Web Worker for non-blocking operations
  - [ ] 2.3 Implement OPFS (Origin Private File System) for database storage (Phase 2 - optional)
  - [ ] 2.4 Create Node.js ETL pipeline with better-sqlite3 for recipe processing
  - [ ] 2.5 Build Zod schemas for recipe validation in ETL pipeline
  - [ ] 2.6 Generate FTS5 index for full-text recipe search
  - [ ] 2.7 Create build script to generate versioned recipes.sqlite
  - [ ] 2.8 Set up Dexie store for meal plans and user preferences

- [ ] 3.0 Type Definitions and Schemas
  - [ ] 3.1 Define TypeScript interfaces for recipe data structures
  - [ ] 3.2 Create meal planning types (plans, preferences, prep sessions)
  - [ ] 3.3 Define database operation interfaces for SQLite WASM
  - [ ] 3.4 Create Zod schemas for form validation (ingredients, dietary tags, prep settings)
  - [ ] 3.5 Set up type-safe database queries with proper error handling

- [ ] 4.0 Recipe Service and Meal Planning Engine
  - [ ] 4.1 Implement SQLite WASM service layer with Web Worker communication
  - [ ] 4.2 Create plan constraint engine for meal planning rules and overrides
  - [ ] 4.3 Build recipe filtering by dietary tags (Vegetarian, Vegan, Pescatarian, "I eat everything")
  - [ ] 4.4 Implement meal plan generation algorithm with protein diversity rules
  - [ ] 4.5 Add recipe swapping and removal functionality (simple button-based)
  - [ ] 4.6 Create service for auto-assigning meals to lunch/dinner slots

- [ ] 5.0 State Management with Zustand
  - [ ] 5.1 Set up Zustand store for meal planning wizard state
  - [ ] 5.2 Create user preferences store for dietary tags and prep settings
  - [ ] 5.3 Implement persistent state with Dexie integration
  - [ ] 5.4 Add state synchronization between wizard steps
  - [ ] 5.5 Create actions for meal plan generation and modification

- [ ] 6.0 Forms and Validation with React Hook Form + Zod
  - [ ] 6.1 Create ingredient input form with Zod validation
  - [ ] 6.2 Build wizard form components for each step (meal count, ingredients, dietary, prep)
  - [ ] 6.3 Implement form state management with React Hook Form
  - [ ] 6.4 Add real-time validation feedback and error handling
  - [ ] 6.5 Create reusable form components for dietary tag selection
  - [ ] 6.6 Implement prep session configuration forms
  - [ ] 6.7 Add accessibility features (ARIA labels, keyboard navigation, focus management)

- [ ] 7.0 Setup Wizard Implementation
  - [ ] 7.1 Build 4-step wizard container with progress indicator and accessibility features
  - [ ] 7.2 Implement Step 1: Meal count and type selection with keyboard navigation
  - [ ] 7.3 Create Step 2: Ingredient input with autocomplete from available proteins/vegetables
  - [ ] 7.4 Build Step 3: Dietary needs selection with 4 core tags
  - [ ] 7.5 Implement Step 4: Prep style configuration (sessions + duration)
  - [ ] 7.6 Add wizard navigation with validation between steps
  - [ ] 7.7 Implement wizard completion and meal plan generation
  - [ ] 7.8 Add error boundaries and loading states throughout wizard

- [ ] 8.0 Meal Plan Display and Management
  - [ ] 8.1 Create list view component grouped by day for planned meals
  - [ ] 8.2 Implement meal swapping functionality with simple button-based interface (Phase 2: drag-and-drop)
  - [ ] 8.3 Build meal removal and replacement features
  - [ ] 8.4 Add visual indicators for dietary restrictions on each meal
  - [ ] 8.5 Create responsive layout for desktop and mobile viewing
  - [ ] 8.6 Implement meal plan persistence with Dexie
  - [ ] 8.7 Add error boundaries and loading states for meal plan operations

- [ ] 9.0 Prep Optimization System
  - [ ] 9.1 Create prep session configuration logic (1-5 sessions, 1h-3h duration)
  - [ ] 9.2 Implement prep checklist generation algorithm
  - [ ] 9.3 Build grouped prep tasks by session and time constraints
  - [ ] 9.4 Create prep checklist display component with session grouping
  - [ ] 9.5 Add prep task reordering and modification capabilities (Phase 2: advanced reordering)
  - [ ] 9.6 Implement prep checklist persistence (Phase 3: sharing functionality)

- [ ] 10.0 PWA and Offline Functionality
  - [ ] 10.1 Configure Workbox for app shell caching
  - [ ] 10.2 Set up recipes.sqlite precaching for offline access
  - [ ] 10.3 Implement service worker for offline recipe search
  - [ ] 10.4 Add PWA manifest for installable app experience
  - [ ] 10.5 Create service worker update prompt UX component
  - [ ] 10.6 Create offline indicator and sync functionality
  - [ ] 10.7 Test offline functionality across different network conditions

- [ ] 11.0 Testing and Quality Assurance
  - [ ] 11.1 Write unit tests for all service layers (recipe, prep, database, constraint engine)
  - [ ] 11.2 Create component tests for wizard, forms, and display components
  - [ ] 11.3 Implement E2E tests for complete wizard flow
  - [ ] 11.4 Create E2E test for "aha moment" under 2 minutes
  - [ ] 11.5 Add E2E tests for offline PWA functionality
  - [ ] 11.6 Implement accessibility testing with keyboard navigation and screen readers
  - [ ] 11.7 Set up CI/CD pipeline with GitHub Actions and ETL validation
  - [ ] 11.8 Add performance testing for SQLite WASM operations
  - [ ] 11.9 Configure Content Security Policy and privacy documentation

---

## Phase 2 Tasks (Post-MVP)

- [ ] **Drag-and-Drop Interface**
  - [ ] Implement drag-and-drop for meal reordering
  - [ ] Add drag-and-drop for prep task reordering
  - [ ] Create touch-friendly drag-and-drop for mobile devices

- [ ] **Recipe Search Interface**
  - [ ] Build recipe search component with FTS5 integration
  - [ ] Add recipe browsing and filtering interface
  - [ ] Create admin route for recipe management

- [ ] **OPFS Implementation**
  - [ ] Implement Origin Private File System for database storage
  - [ ] Add fallback handling for unsupported browsers
  - [ ] Optimize database performance with OPFS

- [ ] **Advanced Prep Features**
  - [ ] Add advanced prep task reordering
  - [ ] Implement prep timing optimization
  - [ ] Create prep workflow customization

## Phase 3 Tasks (Future Features)

- [ ] **Sharing and Collaboration**
  - [ ] Implement meal plan sharing functionality
  - [ ] Add family collaboration features
  - [ ] Create meal plan export/import

- [ ] **Advanced Features**
  - [ ] Add recipe rating and reviews
  - [ ] Implement meal plan templates
  - [ ] Create grocery list integration
