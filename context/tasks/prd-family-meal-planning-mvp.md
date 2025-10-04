# Product Requirements Document: Family Meal Planning MVP (Web-First)

## 1. Introduction / Overview

Families struggle with decision fatigue ("what's for dinner?"), wasted groceries, and inefficient meal prep. Current apps overwhelm users with browsing or rely on untested AI recipes.

This MVP provides a **web-first, mobile-optimized meal planning tool** that:

- Generates weekly lunch and dinner plans automatically from proteins and vegetables the family already has.
- Respects dietary needs using four common tags (Vegetarian, Vegan, Pescatarian, "I eat everything").
- Produces optimized prep checklists so families cook efficiently, like a professional kitchen.

**Goal:** Deliver a simple, reliable, and trusted system that reduces stress, cuts food waste, and helps families prepare meals faster.

---

## 2. Goals

1. Simplify meal planning into a 4-step setup wizard.
2. Respect dietary needs with four core tags.
3. Generate prep checklists grouped by session/time.
4. Validate adoption and reuse (≥70% weekly retention).
5. Ship web-first, responsive design for desktop + mobile.

---

## 3. Functional Requirements (MVP Core)

### Meal Planning

1. Select number of meals to plan (default: 5).
2. Select meal types (default: dinner).
3. Input available proteins and vegetables.
4. Generate weekly meal plans using curated recipes.
5. Auto-assign meals to lunch/dinner slots.
6. Ensure no repeated main protein within a single day or consecutive days (with override option).
7. Swap or remove meals if desired.

### Dietary Preferences

8. Support 4 tags: Vegetarian, Vegan, Pescatarian, "I eat everything".
9. Filter recipes based on selected tag.

### Prep Optimization

10. Specify number of prep sessions (1–5, default 2) and duration (1h–3h, default 2h).
11. Generate grouped prep checklists that respect inputs.

### User Interface

12. Responsive web-first interface (desktop + mobile).
13. Display planned meals in a **list view grouped by day**.
14. 4-step setup wizard:

- Step 1: Meal count + types
- Step 2: Ingredient input (proteins + vegetables)
- Step 3: Dietary needs
- Step 4: Prep style (sessions + duration)

### Data Management

15. Store plans locally on device.
16. Remember user preferences for future sessions.

---
