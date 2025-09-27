## What

- Brief summary of the change.

## Why

- Link to issue/user story or explain the problem this solves.

## How

- Key implementation notes (modules, patterns, flags).

## Screens / Notes

- Optional screenshots or preview link.

---

## Tests

- [ ] Unit tests (Vitest) updated/added
- [ ] Component tests (RTL) updated/added (if UI touched)
- [ ] E2E (Playwright) scenario(s) added/updated (wizard → plan → checklist)
- [ ] ETL Zod validation passes (`pnpm etl:build`)

## Acceptance (tick all that apply)

**Wizard**

- [ ] Zod validation per step, keyboard navigable, focus managed
- [ ] State persisted via Zustand + Dexie; next step autofocus works

**Plan Generation**

- [ ] Respects dietary tag (Veg/Vegan/Pescatarian/Everything)
- [ ] No-repeat main protein same day & consecutive days (unless override)
- [ ] List view grouped by day; swap/remove works; persisted locally

**Prep Checklist**

- [ ] Respects sessions (1–5) & durations (1h, 1.5h, 2h, 3h)
- [ ] Deterministic grouping; persisted; printable styles OK

**PWA**

- [ ] App shell + recipes_vN.sqlite precached
- [ ] SW update prompt appears on new deploy

## Risk / Rollback

- [ ] Changes are backwards compatible
- [ ] recipes_vN.sqlite version bumped if schema/content changed
- [ ] Tested offline mode

## Checklist

- [ ] Conventional Commits used (feat/fix/test/refactor/chore/docs/perf/ci)
- [ ] Files stay under 500 LOC (or split)
- [ ] No PII; CSP respected; no inline scripts
