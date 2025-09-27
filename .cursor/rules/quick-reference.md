# Quick Reference - Family Meal Planning MVP

## 🎯 Core Goals

- **MVP Focus:** 4-step wizard → auto-plan → list view → prep checklist
- **TDD Approach:** Write failing test → implement → pass
- **File Size:** <500 LOC per file
- **Zero Cost:** Free hosting (Vercel/Netlify), free CI (GitHub Actions)

## 🛠️ Tech Stack

- **Frontend:** TypeScript + React (Vite) + Tailwind
- **State:** Zustand
- **Forms:** React Hook Form + Zod
- **Database:** SQLite WASM (FTS5) + Dexie
- **Testing:** Vitest + @testing-library/react + Playwright
- **PWA:** Workbox

## 📁 Directory Structure

```
src/
├── components/     # UI components
├── forms/         # Form components with validation
├── services/      # Business logic (constraint engine, prep optimizer)
├── stores/        # Zustand state management
├── types/         # TypeScript definitions
├── utils/         # Utility functions
├── db/           # Dexie stores
└── main.tsx      # App entry point

scripts/etl/      # Node.js ETL pipeline
```

## 🔄 Development Flow

1. Create `feature/wizard-step2` branch
2. Write failing test → implement → pass
3. Draft PR → CI passes → squash merge to main
4. Tag release for deploy

## ✅ Acceptance Criteria

### Wizard

- [ ] Zod validation per step
- [ ] Keyboard accessible
- [ ] State persists via Zustand + Dexie

### Plan Generation

- [ ] Respects dietary tags (4 core tags)
- [ ] No-repeat protein (same day + consecutive)
- [ ] List view grouped by day

### Prep Checklist

- [ ] Sessions (1-5) and durations (1h-3h)
- [ ] Deterministic grouping
- [ ] Printable output

### PWA

- [ ] Works offline
- [ ] SW update prompt
- [ ] App shell + recipes.sqlite precached

## 🧪 Testing Requirements

- **Unit:** 80% coverage on changed files
- **Component:** Wizard, display, checklist components
- **E2E:** Complete flow in <2 minutes + offline behavior

## 🔒 Security

- **CSP:** No inline scripts/styles
- **No PII:** Non-identifiable data only
- **Dependencies:** Pin versions, run `pnpm audit`

## 📱 Performance

- **DB in Worker:** Never block UI
- **Code splitting:** Route-based
- **Mobile-first:** Test on slow networks

## 🚀 CI Pipeline

```bash
pnpm install --frozen-lockfile
pnpm lint && pnpm typecheck
pnpm test -- --coverage
pnpm etl:build
pnpm build
# Playwright E2E tests
```

## 📝 Commit Format

- `feat:` new feature
- `fix:` bug fix
- `test:` adding/updating tests
- `refactor:` code refactoring
- `chore:` maintenance tasks
- `docs:` documentation updates

## 🎨 UI Guidelines

- **List view** (not calendar) for MVP
- **Simple buttons** (not drag-and-drop) for MVP
- **Mobile-first** responsive design
- **Accessibility:** ARIA labels, keyboard nav, focus management

---

**Remember:** MVP = Minimum Viable Product. Focus on core value, ship fast, iterate based on user feedback.
