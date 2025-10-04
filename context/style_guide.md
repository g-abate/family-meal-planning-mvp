# 🎨 Style Guide – Meal Prep App

## Design Philosophy
* **Approach:** Luxurious Minimalism (premium yet simple). Consider reframing as *Practical Elegance* or *Warm Minimalism* for broader appeal.
* **Principles:** Clean, uncluttered UI with polish. Accessibility and family-approachability are priorities.

---

## Color Palette
* **Primary:** Forest Green (#1B4332) – main brand color.
* **Secondary:** Sage (#52796F) – borders, accents.
* **Accent:** Orange (#F4A261) – CTAs and highlights.
* **Semantic:** Success (green), Warning (amber), Error (red).
* **Neutrals:** Comprehensive gray scale (#fafafa → #0a0a0a).
* **Dark Mode:** Stress-test palette for AA+ contrast.

---

## Typography
* **Primary Font:** Inter (sans-serif, modern, clean).
* **Secondary Font:** JetBrains Mono for data/nutrition contexts.
* **Line Height:** 1.7 for body text.
* **Typography Hierarchy:**
  * **H1:** `text-4xl` (36px) – Page titles, main headings
  * **H2:** `text-3xl` (30px) – Section headers, wizard steps
  * **H3:** `text-2xl` (24px) – Card headers, subsection titles
  * **H4:** `text-xl` (20px) – Component headers, form sections
  * **Body:** `text-base` (16px) – Default text, descriptions
  * **Caption:** `text-sm` (14px) – Helper text, labels, metadata
  * **Small:** `text-xs` (12px) – Fine print, timestamps
* **Font Weights:** Regular (400), Medium (500), SemiBold (600), Bold (700)
* **Font Features:** Ligatures enabled ('rlig' 1, 'calt' 1).

---

## Spacing & Layout
* **Base Unit:** 8px system.
* **Standard Scale:** 4, 8, 12, 16, 24, 32px (multiples of base unit).
* **Extended Scale:** 
  * `18` (4.5rem) – Custom card spacing
  * `88` (22rem) – Large modal widths
  * `128` (32rem) – Full-screen containers
  * `144` (36rem) – Wide dashboard layouts
  * `160` (40rem) – Maximum content width
* **Container:** Max-width 7xl with responsive padding.
* **Border Radius:** 12px (`rounded-xl`) for buttons; 16px (`rounded-2xl`) for cards.

---

## Component System

### **Buttons (.btn)**
* **Primary:** Forest green with hover lift + shadow.
* **Secondary:** Sage background, subtle border.
* **Accent:** Orange CTA.
* **Ghost:** Transparent with sage text.
* **Success/Warning/Error:** Semantic variants with appropriate colors.
* **Sizes:** sm (px-3 py-1.5), md (px-4 py-2), lg (px-6 py-3).

### **Cards (.card)**
* **Standard:** White background, sage border, soft shadow.
* **Luxury:** Stronger shadow, hover animation, enhanced elevation.
* **Structure:** Header (.card-header), body (.card-body), footer (.card-footer).
* **Recipe Cards:** Image + title + metadata + action button pattern.

### **Forms (.form-*)**
* **Input:** Clean styling with sage borders + focus rings.
* **Label:** Consistent spacing + Inter typography.
* **Error States:** Red text with clear error messaging.
* **Validation:** Real-time feedback with success/error indicators.

### **Navigation Components**
* **Bottom Tab Bar:** Mobile-first navigation with 4-5 primary actions.
  * Home, Plans, Recipes, Shopping, Profile
* **Breadcrumb Navigation:** Wizard step indicators with progress.
* **Back/Forward:** Consistent navigation patterns across flows.

### **Progress Indicators**
* **Progress Bar:** 
  ```css
  .progress-bar {
    @apply w-full bg-sage-100 rounded-full h-2;
  }
  .progress-fill {
    @apply bg-primary-500 h-2 rounded-full transition-all duration-300;
  }
  ```
* **Step Indicators:** Numbered circles with connecting lines.
* **Loading States:** Skeleton screens for content loading.

### **Recipe Components**
* **Recipe Card:**
  * Image (16:9 aspect ratio)
  * Title (H4 typography)
  * Metadata: Prep time, difficulty, servings
  * Action button (primary or ghost)
* **Recipe Grid:** Responsive grid layout (1-4 columns based on screen size).

### **Shopping List Components**
* **List Item:**
  * Checkbox + quantity + item name + category badge
  * Strikethrough styling for completed items
* **Category Sections:** Grouped by store sections (produce, dairy, etc.)
* **Add Item:** Quick-add input with category auto-suggestion.

### **Meal Plan Components**
* **Day Card:** Date header + breakfast/lunch/dinner slots.
* **Meal Slot:** Recipe preview + swap/edit actions.
* **Weekly View:** Calendar-style layout with meal assignments.

---

## Animations & Interactions
* **Durations:** 300ms for most transitions.
* **Easing:** cubic-bezier(0.4, 0, 0.2, 1).
* **Signature Animations:** 
  * `scale-in` – Card entrance animations
  * `shimmer` – Loading state animations
  * `float` – Subtle CTA hover effects
* **Hover Effects:** Subtle lift + shadow transitions only.
* **Micro-interactions:** Button press feedback, form validation states.

---

## Shadows & Elevation
* **Tokenized Elevation:**
  * **Soft** – Background surfaces, subtle depth
  * **Medium** – Cards, content containers
  * **Strong** – Modals, overlays, floating elements
* **Usage Guidelines:** Tie shadow depth to semantic meaning, avoid arbitrary mixes.

---

## Accessibility
* **Focus States:** Forest green ring with 2px offset.
* **Keyboard Navigation:** Full support with visible focus indicators.
* **Color Contrast:** WCAG AA compliance across light + dark modes.
* **Screen Readers:** Proper ARIA labels and semantic HTML structure.
* **Custom Scrollbar:** Styled consistently but accessible.

---

## Responsive Design
* **Mobile-First:** Design for mobile, enhance for larger screens.
* **Breakpoints:** 
  * sm: 640px (small tablets)
  * md: 768px (tablets)
  * lg: 1024px (laptops)
  * xl: 1280px (desktops)
* **Touch Targets:** Minimum 44px for interactive elements.
* **Navigation:** Bottom tab bar on mobile, sidebar on desktop.

---

## Implementation Status
### ✅ **Implemented**
* `card-luxury` powering main wizard container
* `btn-primary` and `btn-secondary` for wizard navigation
* Consistent spacing classes in use
* Smooth animations (animate-scale-in) already implemented
* Basic progress bar in wizard

### 🚧 **In Progress**
* Typography hierarchy standardization
* Navigation system design

### 📋 **Planned**
* Recipe card components
* Shopping list components
* Meal plan day cards
* Bottom tab navigation
* Dark mode implementation

---

## Usage Guidelines
* **Consistency:** Always use defined component classes over custom styles.
* **Hierarchy:** Follow typography scale for content structure.
* **Spacing:** Use the 8px base unit system for all spacing decisions.
* **Colors:** Stick to the defined palette; avoid custom colors.
* **Animations:** Use sparingly; enhance usability, never overwhelm.
* **Accessibility:** Test with keyboard navigation and screen readers.

---

## Design Tokens Reference
```css
/* Colors */
--primary-500: #1B4332;
--sage-500: #52796F;
--orange-400: #F4A261;

/* Typography */
--font-family-sans: 'Inter', ui-sans-serif, system-ui;
--font-family-mono: 'JetBrains Mono', ui-monospace;

/* Spacing */
--spacing-base: 8px;
--spacing-scale: 4, 8, 12, 16, 24, 32;

/* Animations */
--duration-fast: 150ms;
--duration-normal: 300ms;
--duration-slow: 500ms;
--easing-standard: cubic-bezier(0.4, 0, 0.2, 1);
```

---

✅ This comprehensive style guide ensures consistency across visual design while aligning with your design review principles. It emphasizes premium polish with minimalism, while keeping family usability and accessibility central. The guide now includes concrete specifications for all major components and clear implementation status tracking.
