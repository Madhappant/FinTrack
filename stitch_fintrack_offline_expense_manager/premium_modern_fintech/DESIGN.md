---
name: Premium Modern Fintech
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#002109'
  on-tertiary-container: '#009842'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#7ffc97'
  tertiary-fixed-dim: '#62df7d'
  on-tertiary-fixed: '#002109'
  on-tertiary-fixed-variant: '#005320'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  canvas-bg: '#F8FAFC'
  surface-card: '#FFFFFF'
  border-subtle: '#E2E8F0'
  expense-red: '#DC2626'
  warning-amber: '#F59E0B'
  income-green: '#16A34A'
  text-primary: '#0F172A'
  text-muted: '#64748B'
  surface-income: '#F0FDF4'
  surface-expense: '#FEF2F2'
  surface-warning: '#FFFBEB'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 26px
    fontWeight: '700'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.03em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1rem
  gutter-tablet: 1.5rem
  margin: 1rem
  margin-tablet: 1.5rem
  margin-desktop: 2.5rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style
The design system defines a premium modern fintech environment engineered for clarity, fiduciary trust, and high-velocity financial management. Combining the operational rigors of Material 3 with the refined restraint of minimalist dashboards, the interface emphasizes data density without visual friction.

The aesthetic pairs an ultra-clean base canvas with high-contrast surfaces, crisp hairline borders, and targeted ambient lighting. Primary financial values and currency metrics command visual hierarchy through bold, tabular typography, while system feedback relies on strict semantic color channels for income, expense, and risk states. Micro-interactions are deliberate and tactile, featuring micro-scale compressions and instantaneous one-tap transaction controls optimized for mobile-first usage.

## Colors
The color architecture establishes an unmistakable visual rhythm between architectural framing and transactional telemetry.

- **Primary (`#0F172A`)**: Obsidian Navy serves as the principal anchor for high-contrast hero metrics, master containers, navigation headers, and authoritative text.
- **Secondary (`#2563EB`)**: Royal Blue operates as the primary interactive catalyst, driving focus indicators, active navigation tabs, interactive links, and primary transaction submission nodes.
- **Tertiary / Income (`#16A34A`)**: Pure emerald green reserved strictly for cash inflows, asset appreciation, credited accounts, and positive yield deltas.
- **Expense Red (`#DC2626`)**: Direct semantic red applied across debit transactions, outgoing payments, liability alerts, and critical budget overruns.
- **Warning Amber (`#F59E0B`)**: High-visibility amber utilized for pending transactions, settlement delays, bill reminders, and approaching category limits.
- **Surfaces & Boundaries**: The system canvas sits on `#F8FAFC`, with elevated card modules at `#FFFFFF`. Structural delineation relies on `#E2E8F0` hairline strokes to eliminate muddy surface collisions.

## Typography
Typography is split into two specialized roles to separate numeric ledger legibility from operational content scanning.

- **Headlines & Monetary Metrics (Manrope)**: Powers all hero balances, high-level headers, and analytical charts. Numerals must strictly enforce tabular figures (`font-feature-settings: "tnum" 1`) to ensure uniform vertical alignment of decimals, currency symbols, and percentage deltas across lists.
- **Narrative, Metadata & Labels (Inter)**: Handles descriptive content, system timestamps, input captions, and navigation labels. Its neutral, optimized x-height maintains legibility in dense ledger environments.

## Layout & Spacing
The layout follows a strict 8px rhythm (with a 4px sub-grid for compact elements, badges, and status pills). 

- **Mobile (<600px)**: 4-column layout with `1rem` margins and `1rem` gutters. Vertical stack density is prioritized, ensuring key ledger items and balance summaries stay above the fold.
- **Tablet (600px–1024px)**: 8-column layout with `1.5rem` margins. Introduces dual-column dashboard structures where account aggregates sit beside transaction feeds.
- **Desktop (>1024px)**: 12-column layout capped at a maximum width of 1280px with `2.5rem` outer canvas margins to retain compact reading zones and avoid scanning fatigue.

## Elevation & Depth
Depth is constructed through subtle card borders layered over diffuse ambient shadows, establishing physical order without visual clutter.

- **Level 0 (Canvas)**: Baseline surface at `#F8FAFC`, flush and unshadowed.
- **Level 1 (Dashboard Cards & Standard Panels)**: `#FFFFFF` surface enclosed by a 1px solid `#E2E8F0` border and lifted with soft ambient diffusion: `0 4px 20px -2px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Interactive Hover, Focus States & Popovers)**: `#FFFFFF` surface with elevated drop: `0 10px 25px -3px rgba(15, 23, 42, 0.08)`.
- **Level 3 (Action Drawers & Quick Entry Sheets)**: Elevated bottom modals and floating action triggers using `0 20px 25px -5px rgba(15, 23, 42, 0.12), 0 8px 10px -6px rgba(15, 23, 42, 0.08)`.
- **Modals & Overlays**: Paired with an obsidian backdrop tint (`rgba(15, 23, 42, 0.40)`) and a 6px backdrop blur for modal isolation.

## Shapes
The structural geometry relies on generous, softened card silhouettes contrasted against pill-shaped utility nodes.

- **Primary Cards & Containers**: Enclosed with 16px to 20px radii (`rounded-2xl`) for a smooth, high-end presentation.
- **Interactive Controls & Inputs**: Form fields, standard buttons, and transaction row elements use 10px to 12px radii (`rounded-lg` / `rounded-xl`).
- **Telemetry Chips, Badges & Floating Triggers**: Strictly circular or pill-shaped (`9999px`) to immediately isolate quantitative state changes from surrounding container geometry.

## Components

### Buttons
- **Primary**: 48px height, `#0F172A` background, `#FFFFFF` text in Inter SemiBold (`label-lg`), 12px corner radius. Micro-interaction: scales to 0.98 on press with an immediate 100ms transition.
- **Accent Action**: 48px height, `#2563EB` background with `#FFFFFF` text. Used exclusively for positive transaction commitments or primary checkout flows.
- **Secondary / Outlined**: 48px height, 1px `#E2E8F0` border, `#FFFFFF` background, `#0F172A` text; shifts to `#F8FAFC` on hover.
- **Floating Quick-Add (FAB)**: 56x56px circular action button rendered in `#0F172A` with an inner white plus icon, elevated at Level 3, anchored to the bottom-right viewport on mobile.

### Cards & Data Containers
- **Hero Balance Card**: High-contrast `#0F172A` surface, 20px corner radius, featuring primary balance metrics in Manrope Bold (`display-lg` / `display-lg-mobile`) and contextual delta indicators.
- **Standard Card**: `#FFFFFF` surface, 1px `#E2E8F0` border, 16px corner radius, internal padding of `space-md` (16px) or `space-lg` (24px).

### Chips & Semantic Badges
- 24px height, horizontal padding of 10px, 9999px pill radius, using Inter SemiBold (`label-sm`):
  - **Income**: `#F0FDF4` fill with `#16A34A` text and a leading `+` prefix.
  - **Expense**: `#FEF2F2` fill with `#DC2626` text and a leading `-` prefix.
  - **Pending / Warning**: `#FFFBEB` fill with `#F59E0B` text.

### Form Inputs & Numeric Keypads
- 52px height text fields, `#FFFFFF` background, 1px `#E2E8F0` border, 12px corner radius. Focus states apply a crisp 2px `#2563EB` border.
- **Currency Field**: Dedicated numeric input containing an anchored static currency marker (`#64748B`) followed by prominent inputs rendered in Manrope SemiBold with tabular formatting.

### Lists & Ledger Rows
- Minimum 60px row height with a 1px `#E2E8F0` bottom separator. Category icon housed within a 40px rounded container (10px radius, `#F8FAFC` fill). Trailing metrics rendered in Manrope tabular numbers, color-coded by transaction direction.

### Checkboxes & Radios
- 20x20px container with 6px radius for checkboxes, full circle for radios. Default border is 1.5px `#E2E8F0`. Checked state fills with `#2563EB` displaying an inner white mark.