# ⭐ Consumer App Design Review Checklist

*(Inspired by Stripe, Cal.com, Headspace, Duolingo, and Nir Eyal’s Hooked)*

---

## I. Core Design Philosophy & Strategy

* **Users First:** Prioritize user needs, workflows, and ease of use in every design decision. Support real household flows (plan → grocery → prep → serve OR grocery → meal plan → prep → serve). Start with a wizard for intake; scanning/photos can come later.
* **Meticulous Craft:** Aim for precision, polish, and high quality in every UI element and interaction.
* **Speed & Performance:** Design for fast load times and snappy, responsive interactions.
* **Simplicity & Clarity:** Strive for a clean, uncluttered interface. Ensure labels, instructions, and information are unambiguous.
* **Focus & Efficiency:** Help users achieve their goals quickly and with minimal friction. Minimize unnecessary steps or distractions.
* **Consistency:** Maintain a uniform design language (colors, typography, components, patterns) across the entire app.
* **Accessibility (WCAG AA+):** Design for inclusivity. Ensure sufficient color contrast, keyboard navigability, and screen reader compatibility.
* **Opinionated Design (Thoughtful Defaults):** Establish clear, efficient default workflows and settings, reducing decision fatigue for users.

---

## II. Design System Foundation (Tokens & Core Components)

* **Color Palette:**
  * Primary Brand Color: User-specified, used strategically.
  * Neutrals: A scale of grays (5–7 steps) for text, backgrounds, borders.
  * Semantic Colors: Success (green), Error (red), Warning (amber), Info (blue).
  * Dark Mode Palette: Corresponding accessible palette.
  * Accessibility Check: Ensure WCAG AA compliance.
* **Typography:**
  * Primary Font Family: Clean, legible sans-serif (e.g., Inter, Manrope, system-ui).
  * Modular Scale: Distinct sizes for headings and body (e.g., H1: 32px, Body: 14–16px).
  * Font Weights: Regular, Medium, SemiBold, Bold.
  * Line Height: 1.5–1.7 for body text.
* **Spacing Units:**
  * Base Unit: e.g., 8px.
  * Spacing Scale: Multiples of base unit (4, 8, 12, 16, 24, 32).
* **Border Radii:**
  * Consistent values (Small: 4–6px; Medium: 8–12px).
* **Core Components (with consistent states: default, hover, active, focus, disabled):**
  * Buttons (primary, secondary, ghost, destructive, link-style; with icons)
  * Input Fields (text, textarea, select, date picker; clear labels, placeholders, errors)
  * Checkboxes & Radio Buttons
  * Toggles/Switches
  * Cards (content blocks, recipe tiles)
  * Tables (for data display, sorting, filtering)
  * Modals/Dialogs
  * Navigation (tabs, bottom bar, or sidebar)
  * Badges/Tags
  * Tooltips
  * Progress Indicators (spinners, bars)
  * Icons (modern SVG set)
  * Avatars

---

## III. Layout, Visual Hierarchy & Structure

* **Responsive Grid System:** e.g., 12-column grid for layout consistency.
* **Strategic White Space:** Reduce cognitive load, improve clarity.
* **Clear Visual Hierarchy:** Guide attention with typography, spacing, positioning.
* **Consistent Alignment:** Maintain clear and predictable structure.
* **App Layout:**
  * Primary navigation via bottom tab bar or sidebar (mobile-first).
  * Content area for core workflows (wizard, dashboard, prep views).
  * Optional top bar for global search, notifications, profile.
* **Mobile-First:** Ensure graceful adaptation to small screens.

---

## IV. Interaction Design & Animations

* **Purposeful Micro-Interactions:** Subtle feedback on selections, saves, swipes. Affordances for future scan/photo capture.
* **Feedback:** Immediate and clear (toasts, highlights).
* **Animations:** Quick (150–300ms), ease-in-out.
* **Loading States:** Skeleton screens, contextual friendly copy.
* **Transitions:** Smooth, natural state changes.
* **Avoid Distraction:** Animations enhance usability, never overwhelm.
* **Keyboard Navigation:** All interactive elements accessible with clear focus states.

---

## V. Hooked Habit Model Integration

### 1. **Triggers**

* **External:** Smart notifications (e.g., “Use your shrimp by Wednesday”).
* **Internal:** Tie design to user emotions (stress, guilt about waste, desire for healthier meals).

### 2. **Actions**

* **Effortless Intake:** Wizard to set goals, constraints, context; immediate draft plan.
* **One‑Tap Approvals:** Approve/swap plans quickly; auto-adjust shopping list.
* **Optional Capture (Later):** Receipts/photos refine pantry once trust is built.

### 3. **Variable Rewards**

* **Novelty:** Curated new recipes.
* **Mastery:** Weekly rubric scores (reuse efficiency, time, nutrition).
* **Relief:** Notifications showing food saved or time saved.

### 4. **Investment**

* **Pantry Accuracy:** Improves as more data is added.
* **Favorites & Feedback:** Ratings refine suggestions.
* **Prep History:** Past plans feed smarter defaults.

---

## VI. Context-Specific Modules

### A. **Onboarding**

* 2–3 screen wizard flow: “Wizard → Plan → Prep.”
* Demo plan before sign-up; defer account creation until after first value.
* Progressive profiling: add detail over time.

### B. **Meal Plan Dashboard**

* Weekly plan as modular cards (dinners, lunches).
* Quick edits (swap meal, adjust protein).
* Perishables sequencing indicators.

### C. **Prep Workflow**

* Guided prep with timers, mise en place steps.
* Progress bars for Sunday + midweek sessions.
* Appliance-aware scheduling.

### D. **Storage & Safety**

* Label generator: *Item • Date • Use-by • Reheat method*.
* FIFO “Eat Next” bin visualization.
* Safety checks for cooling and reminders.

---

## VII. CSS & Styling Architecture

* **Scalable Methodology:** Utility-first (Tailwind) or BEM with Sass.
* **Integrate Tokens:** Colors, fonts, spacing, radii defined as design tokens.
* **Maintainability & Readability:** Clean, documented CSS or CSS-in-JS.
* **Performance:** Lightweight, optimized delivery.

---

## VIII. Best Practices

* **Iterative Testing:** Test with families; refine weekly.
* **Offline-First:** Pantry and prep views usable offline.
* **Data Privacy:** Transparent use of receipt/pantry data.
* **Progressive Profiling:** Capture essentials up front; enrich later.
* **Data Portability:** Easy export of plans, lists, recipes.
* **Documentation:** Maintain living design system and guidelines.

