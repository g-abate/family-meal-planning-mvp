# Family Meal Planning – SoloFlow Rules

**Version:** 1.0  
**Last Updated:** [Current Date]

## Goals

- Ship a zero-cost web-first MVP (TypeScript + React + Vite + Tailwind, SQLite WASM FTS5, Zustand, RHF + Zod)
- Deliver the smallest lovable slice: 4-step wizard → auto-plan → list view → prep checklist
- Apply TDD, keep files small (<500 LOC), and enforce robust security/privacy

## Technology Stack

### Frontend
- **TypeScript** - Type safety and developer experience
- **React (Vite)** - Component-based UI with fast development
- **Tailwind** - Utility-first CSS for responsive design
- **Radix** (optional) - Accessible headless components
- **clsx** - Conditional classnames

### State Management
- **Zustand** - Lightweight state management for wizard state and preferences

### Forms & Validation
- **React Hook Form** - Form state management
- **Zod** - Schema-driven validation

### Database & Storage
- **SQLite WASM (FTS5, Web Worker)** - Client-side database with full-text search
- **Dexie** - IndexedDB wrapper for meal plans and preferences

### PWA & Performance
- **Workbox** - Service worker and caching strategies

### Testing
- **Vitest** - Unit testing framework
- **@testing-library/react** - Component testing
- **Playwright** - End-to-end testing

### CI/CD & Hosting
- **GitHub Actions** (free tier) - Continuous integration
- **Vercel/Netlify** (free tier) - Hosting and deployment

## SoloFlow Development Process

### Branch Strategy
- **main** - Production, always releasable (protected)
- **feature/*** - Short-lived per slice, e.g., `feature/wizard-step2`
- **hotfix/*** - Patch from main when needed

### Development Loop
1. Create `feature/*` branch
2. Write failing tests (TDD) → implement → pass
3. Open Draft PR (self-review) to run CI + preview
4. Squash-merge to main when green
5. Tag release (vX.Y.Z) on main for deploy

### Commit Convention
- Use **Conventional Commits** (feat, fix, test, refactor, chore, docs, perf, ci)

## Architecture Rules

### Core Principles
- **Core logic** (constraint engine, prep optimizer, sqlite service) must be pure TypeScript modules with unit tests
- **SQLite WASM** runs in a Web Worker; UI must not block on DB queries
- **Recipes** are read-only and shipped as versioned `/public/recipes_vN.sqlite` (FTS5)
- **Plans & preferences** stored locally via Dexie (no cloud sync in MVP)
- **No runtime network calls** beyond static assets in MVP

### Directory Structure
```
src/
├── components/     # UI components
├── forms/         # Form components with validation
├── services/      # Business logic (sqliteRecipeService, planConstraintEngine, prepOptimizer)
├── stores/        # Zustand state management
├── types/         # TypeScript type definitions
├── utils/         # Utility functions (sqlite utils, etc.)
├── db/           # Dexie app store only
└── main.tsx      # Application entry point

scripts/etl/      # Node.js: Zod-validated JSON → recipes.sqlite
```

## Code Quality Standards

### Test-Driven Development (TDD)
- **Always write/adjust a failing test before implementation**
- Minimum 80% coverage on changed files
- Unit tests for all business logic
- Component tests for UI interactions
- E2E tests for critical user journeys

### File Organization
- **File size limit:** 500 LOC maximum
- **Strict TypeScript:** Enable all strict mode options
- **No circular dependencies** in imports
- **Composition over inheritance**
- **Pure functions preferred**

### Code Style
- **ESLint** (typescript-eslint) + **Prettier** for linting and formatting
- **Conventional Commits** for clear change history
- **Small PRs** (≈200–400 LOC) completing one functional slice

## Security & Privacy

### Data Handling
- **No PII stored** in MVP; Dexie holds non-identifiable plans/preferences
- **Sanitize HTML** if ever rendered (prefer plaintext/controlled markup)
- **Pin dependency versions**; run `pnpm audit` in CI
- **Avoid eval/dynamic code**

### Security Headers
- **Content Security Policy**; no inline scripts/styles (allow hashed Workbox if required)
- **Do not commit secrets**
- **Do not log ingredient/plan contents** to analytics in MVP

## Performance Guidelines

### Database Operations
- **Defer recipes_vN.sqlite download** until after Wizard Step 1; show progress if >3MB
- **All DB work in a Worker**; avoid large JSON parsing on main thread
- **Precompute derived fields** (total_time, proteins[], vegetables[]) in ETL

### Application Performance
- **Use code-splitting** for wizard/plan/checklist routes
- **Optimize for mobile** - test on slow networks
- **Minimize bundle size** - tree-shake unused code

## PWA & Offline Strategy

### Workbox Configuration
- **Precache app shell** and recipes_vN.sqlite with revision hashes
- **Provide SW update prompt** and reload on accept
- **Graceful offline indicator**; read-only behavior acceptable for MVP

### Offline Behavior
- App works completely offline after initial load
- Recipe search functions without network
- User preferences and meal plans persist locally

## Testing Strategy

### Unit Tests (80% coverage minimum)
- **planConstraintEngine:** no-repeat protein (same day + consecutive days), override, lunch/dinner slotting
- **prepOptimizer:** sessions (1–5), durations (1h–3h), grouped tasks
- **sqliteRecipeService:** FTS5 search, dietary filtering

### Component Tests
- **MealPlanningWizard:** step validations, focus management, keyboard navigation
- **MealPlanDisplay:** list view grouped by day, swap/remove actions
- **PrepChecklist:** grouped display, persistence

### End-to-End Tests
- **First-run flow:** wizard → generated plan → prep checklist in < 2 minutes
- **Offline PWA behavior:** recipes.sqlite precached, search works
- **Accessibility:** keyboard navigation, screen reader compatibility

### ETL Validation
- **Zod validation must fail CI** if any recipe JSON is invalid

## Acceptance Criteria

### Wizard Steps
- **Zod validation** per step; keyboard accessible; visible focus
- **State persists** via Zustand + Dexie; next step auto-focus first field

### Plan Generation
- **Respects selected dietary tag** (Vegetarian/Vegan/Pescatarian/Everything)
- **No-repeat main protein** within a day and across consecutive days unless override true
- **List view grouped by day**; swap/remove works; persisted locally

### Prep Checklist
- **Respects sessions** (1–5) and durations (1h, 1.5h, 2h, 3h)
- **Deterministic grouping** per session; persisted locally; printable

### PWA Requirements
- **App shell + recipes_vN.sqlite precached**; works offline
- **SW update prompt** appears on new deploy

## CI/CD Pipeline

### Required Checks
- `pnpm lint` - ESLint validation
- `pnpm typecheck` - TypeScript compilation
- `pnpm test -- --coverage` - Unit tests with coverage
- `pnpm etl:build` - ETL validation with Zod
- `pnpm build` - Production build
- **Playwright E2E:** wizard→plan→checklist + offline spec

### GitHub Actions Workflow
```yaml
# .github/workflows/ci.yml
- pnpm install --frozen-lockfile
- pnpm lint && pnpm typecheck
- pnpm test -- --coverage
- pnpm etl:build
- pnpm build
- Playwright: wizard→plan→checklist + offline spec
```

## Git Workflow Rules

### Branch Protection (main)
- **Require passing CI checks**
- **Allow self-merge;** squash merges only
- **No direct pushes** to main

### Pull Request Expectations
- **Small PRs** (≈200–400 LOC) completing one functional slice
- **Include tests, notes, and acceptance checklist ticks**
- **Self-review** before merging

### Artifact Versioning
- **recipes_vN.sqlite** filename increments when content/index changes

## Cursor IDE Guidance

### Development Best Practices
1. **Start by writing/updating a failing test** before code
2. **Keep modules pure and small;** extract helpers when a file approaches 500 LOC
3. **Run DB operations in a Web Worker;** never block the UI
4. **Use Zod schemas** for all form inputs and ETL ingestion
5. **Document assumptions** as short comments above functions/types
6. **Prefer list view for MVP;** avoid calendar and drag-and-drop (Phase 2+)
7. **Make sure to comment on code** to ensure readability and comprehension

### Code Generation Guidelines
- Generate TypeScript interfaces before implementing components
- Create test files alongside implementation files
- Use descriptive variable and function names
- Include error handling in all async operations
- Add loading states for all user interactions

---

**Remember:** This is a MVP focused on delivering core value quickly while maintaining production quality standards. Every feature should be testable, accessible, and performant.
