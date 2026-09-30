---
name: Sovereign Ledger
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
  slate-900: '#0F172A'
  brand-blue: '#2563EB'
  income-green: '#16A34A'
  expense-red: '#DC2626'
  warning-amber: '#F59E0B'
  canvas-bg: '#F8FAFC'
  surface-card: '#FFFFFF'
  border-neutral: '#E2E8F0'
  text-muted: '#64748B'
  income-surface: '#F0FDF4'
  expense-surface: '#FEF2F2'
  warning-surface: '#FFFBEB'
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
The design system establishes a high-trust, privacy-first financial command center built for solo entrepreneurs, discerning operators, and personal wealth tracking. The brand communicates absolute precision, institutional solidity, and frictionless velocity. The aesthetic fuses Modern Material 3 operational logic with the crisp minimalism of contemporary fintech dashboards. 

A spacious canvas, bold high-contrast tabular typography, and tactile pill indicators transform high-density ledger records into an effortless visual hierarchy. Micro-interactions convey physical reliability: buttons respond with subtle compression, elevated cards float with soft ambient diffusion, and status cues leverage uncompromising semantic color boundaries.

## Colors
The palette adopts a crisp slate architecture paired with decisive semantic accents for instant balance and cash flow comprehension.

- **Primary (`#0F172A`)**: Deep Obsidian Navy provides foundational grounding. Applied to high-contrast balance hero cards, critical headings, and top-tier interactive nodes.
- **Secondary (`#2563EB`)**: Electric Royal Blue serves as the interactive catalyst for focal CTA states, active navigation indicators, input focus boundaries, and dynamic charts.
- **Tertiary / Cash Inflow (`#16A34A`)**: Authoritative forest emerald designated for positive cashflows, verified transactions, asset expansion, and budget surpluses.
- **Semantic Liabilities (`#DC2626`)**: Vivid expense crimson applied across debit rows, pending obligations, charge failures, and critical spending breaches.
- **Semantic Caution (`#F59E0B`)**: Warm amber for threshold alerts, upcoming bill schedules, and approaching category caps.
- **Neutrals & Surfaces**: Background canvas originates at clean `#F8FAFC`. Structured cards and modules sit at pure `#FFFFFF`, outlined by subtle `#E2E8F0` borders to maintain separation without visual friction.

## Typography
Typography is split into two specialized roles to balance expressive arithmetic impact with sustained tabular legibility.

- **Primary Font (Manrope)**: Powers all high-impact headings, key metrics, and financial sums. Numerals must enforce tabular figures (`font-feature-settings: "tnum" 1`) to guarantee perfect vertical alignment across ledger lists, decimal points, and column comparisons. Currency prefixes (₹) are locked to Manrope SemiBold/Bold and visually balanced at 85% font size of the associated number.
- **Secondary Font (Inter)**: Governs general narrative reading, input text, form labels, metadata timestamps, and system status tags. Its neutral, high-x-height glyphs prevent eye strain in dense transaction logs.

## Layout & Spacing
The layout system follows a flexible 8px base rhythm (with 4px micro-increments for compact badges and progress monitors).

- **Mobile Viewports (<600px)**: 4-column fluid layout with `1rem` outer canvas padding. Density is prioritized: compact financial rows maintain `space-sm` (8px) to `space-md` (16px) internal padding so 6–8 ledger lines remain visible without scrolling.
- **Tablet / Foldable (600px–1024px)**: 8-column layout with `1.5rem` margins. Implements split-screen master-detail views: left pane houses the account balance lists and quick-budget modules; right pane hosts detailed transaction histories.
- **Desktop (>1024px)**: 12-column layout with `2.5rem` margins and a maximum content width of 1280px to preserve immediate scanning efficiency and prevent wide scanning drift.

## Elevation & Depth
Depth relies on soft, ambient slate-tinted diffusion rather than harsh shadows, pairing physical separation with a crisp 1px hairline perimeter.

- **Level 0 (Canvas Surface)**: `#F8FAFC`, flush, un-elevated.
- **Level 1 (Cards, Ledger Rows, Containers)**: Background `#FFFFFF`, bordered by 1px solid `#E2E8F0`, with an ambient diffused shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.05)`.
- **Level 2 (Hover/Active Items, Dropdowns, Segmented Tabs)**: Background `#FFFFFF`, 1px solid `#E2E8F0`, with elevated shadow: `0 4px 6px -1px rgba(15, 23, 42, 0.07), 0 2px 4px -2px rgba(15, 23, 42, 0.05)`.
- **Level 3 (Floating Action Buttons, Bottom Drawers)**: Surface `#FFFFFF` or `#0F172A`, floating with `0 10px 15px -3px rgba(15, 23, 42, 0.10), 0 4px 6px -4px rgba(15, 23, 42, 0.05)`.
- **Level 4 (Authentication Overlays & Quick-Entry Modals)**: Level 3 elevation layered over a semi-transparent scrim (`rgba(15, 23, 42, 0.45)`) combined with a 8px background backdrop-filter blur.

## Shapes
The structural geometry uses modern, rounded proportions to soften data-dense dashboards while preserving rigid structural boundaries.

- **Primary Cards & Deep Navy Hero Modules**: Standardized to `16px–20px` corner radii (`rounded-2xl`). This generates a distinct, approachable container silhouette.
- **Inputs, Buttons & List Rows**: Standardized to `10px–12px` (`rounded-lg` / `rounded-xl`) to preserve clean alignment with containing parent structures.
- **Status Pills, Value Badges & FAB**: Locked to fully rounded pill profiles (`9999px`) to create clear geometric contrast against rectangular data cards.
- **Bottom Navigation & Modal Sheets**: Sheet headers employ `20px` top-left and top-right radii, transitioning cleanly into flush device viewports.

## Components

### Buttons & Interactive Controls
- **Primary Action**: 48px touch height, `#0F172A` background, white label in `Inter` SemiBold (`label-lg`), with `12px` corners. On press, scales slightly (`active:scale-[0.98]`).
- **Accent Action**: Identical geometry to Primary, surfaced in `#2563EB` with `#FFFFFF` text for core checkout or primary submission flows.
- **Secondary / Outlined**: 48px height, 1px border in `#E2E8F0`, `#FFFFFF` surface, `#0F172A` text, changing to `#F1F5F9` on hover/press.
- **Quick-Add Floating Action Button (FAB)**: 56x56px circular pill container surfaced in `#0F172A` with `#FFFFFF` glyph; elevated at Level 3. Positioned anchored to the bottom-right viewport with 16px margins.

### Metric Cards & Hero Modules
- **Net Balance Container**: Full-width `#0F172A` surface with `18px` corners. Displays total liquid net worth in `display-lg-mobile` (`Manrope` bold) with leading `₹` symbol. Contains sub-chips showing 30-day net delta with green (`#16A34A`) or red (`#DC2626`) indicators.
- **Standard Financial Card**: `#FFFFFF` background, 1px `#E2E8F0` border, `16px` corner radius, `space-md` internal padding, featuring summary title in `headline-sm` and progress metrics below.

### Status Badges & Pills
- Compact chips with 4px vertical and 10px horizontal padding, utilizing `label-sm` in full pill containers (`rounded-full`):
  - **Inflow**: `#F0FDF4` background, `#16A34A` text, with leading `+₹` marker.
  - **Outflow**: `#FEF2F2` background, `#DC2626` text, with leading `-₹` marker.
  - **Threshold / Due**: `#FFFBEB` background, `#F59E0B` text.

### Ledger Records & Lists
- Continuous 64px transaction rows with 1px `#F1F5F9` bottom divider.
- **Leading**: 42px squircle (`10px` radius) category avatar with `#F8FAFC` background and `#0F172A` icon.
- **Center**: Title in `Inter` SemiBold (`body-md`), subtitle with date and payment mechanism in `Inter` Regular (`body-sm`, `#64748B`).
- **Trailing**: Amount rendered in `Manrope` SemiBold with tabular formatting, signed explicitly with green `+` or standard dark/red `-`.

### Form & Numeric Input Fields
- 52px height container, `#FFFFFF` background, 1px `#E2E8F0` border, `12px` corner radius. Focus states introduce a crisp 2px `#2563EB` outline with zero layout shift.
- Amount entry inputs feature an anchored, non-editable `₹` currency indicator in `Manrope` (`#64748B`), followed by high-emphasis user-entered figures in 24px `Manrope` Bold.

### Progress & Budget Trackers
- 8px height track with `#E2E8F0` fill and `9999px` radius. Active fill bar transitions smoothly between `#2563EB` (nominal), `#F59E0B` (80–95% consumption), and `#DC2626` (over budget).