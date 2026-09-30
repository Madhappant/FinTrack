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
  on-surface-variant: '#45474c'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#545f73'
  primary: '#091426'
  on-primary: '#ffffff'
  primary-container: '#1e293b'
  on-primary-container: '#8590a6'
  inverse-primary: '#bcc7de'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#00190e'
  on-tertiary: '#ffffff'
  tertiary-container: '#00301f'
  on-tertiary-container: '#24a375'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d8e3fb'
  primary-fixed-dim: '#bcc7de'
  on-primary-fixed: '#111c2d'
  on-primary-fixed-variant: '#3c475a'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#85f8c4'
  tertiary-fixed-dim: '#68dba9'
  on-tertiary-fixed: '#002114'
  on-tertiary-fixed-variant: '#005137'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Manrope
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Manrope
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Manrope
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Manrope
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Manrope
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Manrope
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  body-sm:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
  label-lg:
    fontFamily: Manrope
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Manrope
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Manrope
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.04em
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
The design system is engineered for autonomous, private-first financial oversight across solo businesses and personal affairs. It projects institutional stability, crystalline legibility, and strict data discretion without the clinical coldness of enterprise software. The experience conveys quiet authority, absolute security, and zero cognitive overhead during rapid ledger entry.

Aesthetic approach: Modern Material 3 structural discipline layered with precision tabular typography and tonal hierarchy. High-information density is balanced by generous 16–24px container radii, purposeful semantic accents, and soft optical separations rather than abrasive boundaries.

## Colors
The palette leverages a Midnight/Slate architecture to prioritize readability and immediate financial comprehension:

- **Primary Base**: `#0F172A` (Obsidian Blue) anchors primary typography, navigation nodes, and high-emphasis states. `#1E293B` serves as the primary structural brand tone. `#2563EB` acts as an interactive catalyst for focused states, progress arcs, and data-series accents.
- **Cash Flow Semantics**:
  - **Inflow / Asset**: `#059669` (Core), `#10B981` (Vibrant), paired with `#ECFDF5` for pill fills and tint indicators.
  - **Outflow / Liability**: `#DC2626` (Core), `#EF4444` (Vibrant), supported by `#FEF2F2` for debit badges and threshold alerts.
  - **Threshold / Prudence**: `#D97706` (Core), `#F59E0B` (Warning Accent), grounded by `#FFFBEB` for contextual budget strain states.
- **Surfaces**: Canvas starts at `#F8FAFC`. Elevated surfaces shift through `#FFFFFF` (Card base), `#F1F5F9` (Nested modules), and `#E2E8F0` for micro-dividers and boundary lines.

## Typography
Manrope serves across all typographic tiers to combine geometric clarity with high-legibility numerals. 

- **Numeric & Currency Rendering**: All transaction records, account balances, and budget sums must enforce OpenType tabular figures (`font-feature-settings: "tnum" 1`). This ensures currency values (notably ₹) stay vertically aligned within transaction logs and balance sheets.
- **Hierarchy Rules**: Large metric figures rely on `display-lg` (or `display-lg-mobile` on viewport widths < 380dp) in 700 weight, paired directly with an explicit ₹ symbol sized at 80% of the accompanying value.
- **Metadata**: Category tags, timestamp strings, and secondary ledger accounts employ `body-sm` or `label-sm` with slightly tracked letter-spacing to prevent fatigue across dense lists.

## Layout & Spacing
A strict 8dp (0.5rem) baseline grid informs all component padding, gaps, and view compositions, with 4dp (0.25rem) reserved for micro-spacing within badges and input bounds:

- **Mobile Viewports (<600dp)**: 4-column fluid layout with `margin: 1rem` (16dp) and `gutter: 1rem` (16dp). Dense financial rows compress to 8dp inner vertical padding to maximize visible records.
- **Tablet & Split-Pane (600dp–840dp)**: 8-column layout with 24dp margins. Uses master-detail views (account listing alongside ledger entries) to keep ledger contexts visible during transactions.
- **Desktop / Foldables Extended (>840dp)**: 12-column layout with 40dp margins capped at 1280dp max-width to preserve rapid single-glance scanning.

## Elevation & Depth
Depth follows Material 3 tonal elevation supplemented by diffuse ambient light:

- **Level 0 (Flat Canvas)**: `#F8FAFC`, no shadow.
- **Level 1 (Default Containers & List Cards)**: `#FFFFFF`, bounded by a 1px solid hairline `#E2E8F0` border and an ambient drop shadow: `0px 1px 3px rgba(15, 23, 42, 0.04), 0px 4px 8px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Hover/Active Cards & Menus)**: `#FFFFFF`, elevated with `0px 4px 12px rgba(15, 23, 42, 0.06), 0px 2px 4px rgba(15, 23, 42, 0.03)`.
- **Level 3 (Floating Action Button & Bottom Sheet)**: Surface tints merge `#FFFFFF` with an ambient glow: `0px 8px 24px rgba(15, 23, 42, 0.12), 0px 2px 6px rgba(15, 23, 42, 0.04)`.
- **Level 4 (Modals & Pin Authentication Overlays)**: Surface `#FFFFFF` on a 40% `#0F172A` backdrop blur scrim (`backdrop-filter: blur(8px)`).

## Shapes
Shapes emphasize balanced structural ergonomics:
- **Primary Surfaces & Content Cards**: Bound at 16dp to 24dp radii (`rounded-2xl`), delivering a friendly surface without sacrificing space for data-dense tables.
- **Input Fields & Form Controls**: Standardized at 12dp radii to maintain structural alignment with larger cards.
- **Interactive Badges, Pills & Quick-Action FAB**: Locked to fully rounded pill profiles (9999px) for clean visual contrast against squared and rounded data containers.
- **Bottom Sheet Dialogue**: Uses 24dp top-left and top-right radii, transitioning seamlessly into straight vertical edges.

## Components

### Buttons & Quick Actions
- **Floating Action Button (FAB)**: Placed bottom-right (+ Add), 56x56dp container with a 28dp pill/circle shape or 16dp squircle, surfaced in `#0F172A` with a `#FFFFFF` iconography layer, elevating to Level 3.
- **Primary Actions**: Full-width or inline rounded-xl (12dp) button, `#1E293B` background, text in `#FFFFFF`, with a 48dp touch target.
- **Secondary/Outlined**: 1px `#E2E8F0` border, `#FFFFFF` background, `#1E293B` text, shifting to `#F1F5F9` on pressed states.

### Status Pills & Category Badges
- **Transaction Badges**: Fully rounded pills with 4dp top-bottom and 10dp left-right padding.
  - *Income*: `#ECFDF5` background with `#059669` text.
  - *Expense*: `#FEF2F2` background with `#DC2626` text.
  - *Budget Alert*: `#FFFBEB` background with `#D97706` text.

### Input Fields
- Structured at 52dp height with a 12dp corner radius. Inactive states feature a 1px border of `#E2E8F0` on a `#FFFFFF` fill. Focused state shifts to a 2px stroke in `#2563EB`.
- Numeric currency fields display a fixed, non-editable leading ₹ symbol in `#64748B` with tabular figures rendered in bold 18dp.

### Financial Summary Cards
- Built on `#FFFFFF` with a 16dp/20dp radius and a 1px boundary (`#E2E8F0`).
- Net Balance sections use a `#0F172A` fill with `#FFFFFF` tabular numerals, an emerald sub-stat for monthly ingress, and a muted rose tag for total debits.

### Lists & Ledger Records
- Compact 64dp rows separated by 1px inset dividers (`#F1F5F9`).
- Left: 40dp rounded-xl category avatar (`#F1F5F9` background, `#1E293B` icon).
- Center: Transaction name (`label-lg`) anchored above timestamp and method (`body-sm`).
- Right: Large tabular figure signed with `+` or `-` formatted to two decimals, colored strictly according to the semantic inflow/outflow rule.

### Bottom Navigation Bar
- 80dp tall bar (including safe area inset), surfaced in `#FFFFFF` with a 1px `#E2E8F0` top edge.
- 5 destinations (Home, Transactions, Reports, Budget, More). Active states render with a pill-shaped tonal indicator (`#F1F5F9`) holding an accent icon tinted `#0F172A`, alongside a 12dp `label-sm` title.