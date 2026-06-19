---
name: Aureate Obsidian
colors:
  surface: '#111415'
  surface-dim: '#111415'
  surface-bright: '#37393b'
  surface-container-lowest: '#0c0e10'
  surface-container-low: '#1a1c1d'
  surface-container: '#1e2021'
  surface-container-high: '#282a2c'
  surface-container-highest: '#333537'
  on-surface: '#e2e2e4'
  on-surface-variant: '#d3c5ae'
  inverse-surface: '#e2e2e4'
  inverse-on-surface: '#2f3132'
  outline: '#9b8f7a'
  outline-variant: '#4f4634'
  surface-tint: '#f6be39'
  primary: '#f6be39'
  on-primary: '#402d00'
  primary-container: '#d4a017'
  on-primary-container: '#503a00'
  inverse-primary: '#795900'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#c8c6c8'
  on-tertiary: '#303032'
  tertiary-container: '#aaa8aa'
  on-tertiary-container: '#3d3d3f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdfa0'
  primary-fixed-dim: '#f6be39'
  on-primary-fixed: '#261a00'
  on-primary-fixed-variant: '#5c4300'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e4e2e4'
  tertiary-fixed-dim: '#c8c6c8'
  on-tertiary-fixed: '#1b1b1d'
  on-tertiary-fixed-variant: '#474649'
  background: '#111415'
  on-background: '#e2e2e4'
  surface-variant: '#333537'
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
  title-md:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
  label-xs:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-padding: 24px
  gutter: 16px
  sidebar-width: 280px
  list-width: 380px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
This design system centers on a high-contrast, prestigious aesthetic tailored for high-productivity communication. It blends **Minimalism** with **High-Contrast** elements to create a focused, executive environment. The brand personality is authoritative yet modern, favoring clarity and speed over decorative fluff.

The emotional response should be one of "controlled power"—the user feels in command of their information. By utilizing deep blacks against a signature gold, the UI establishes a premium "dark mode first" hierarchy that feels both architectural and sophisticated.

## Colors
The palette is dominated by **Carbon Black (#000000)** and **Obsidian (#121212)** for the background surfaces to reduce eye strain and maximize the impact of the primary accent. 

- **Primary (Burnt Gold):** Used sparingly for calls to action, active states, and critical indicators.
- **Secondary (Charcoal/Slate):** Used for secondary containers, sidebar backgrounds, and subtle borders.
- **Off-white:** Reserved strictly for primary body text and high-priority titles to ensure AA+ accessibility against dark backgrounds.
- **Semantic Colors:** Error states use a desaturated crimson; success states use a deep forest green, ensuring they do not clash with the gold primary.

## Typography
The system utilizes **Inter** for its exceptional legibility at small sizes and its neutral, systematic character. 

- **Hierarchy:** We use tight letter spacing on larger headings to maintain a modern, "tucked" look. 
- **Readability:** Body text uses a slightly increased line height (1.6x) to facilitate long-form reading in the message viewing area.
- **Labels:** Small labels (e.g., timestamps, meta-data) use uppercase with slight letter spacing to create a distinct visual texture from body copy.

## Layout & Spacing
The layout follows a **three-pane fixed-fluid model**:
1. **Collapsible Sidebar (280px):** Navigation and folders.
2. **Inbox List (380px):** Fixed-width list for consistent scanning.
3. **Reading Pane (Fluid):** Expands to fill remaining viewport.

We use a **4px base grid**. Content margins are generous (24px) to emphasize the minimalist aesthetic. Gutters between the three main panes are kept at 1px (using border lines) or 16px (if using floating cards) depending on the density setting chosen by the user.

## Elevation & Depth
Depth is created through **Tonal Layering** rather than heavy shadows. 
- **Level 0 (Background):** Pure Black (#000000).
- **Level 1 (Panes/Cards):** Obsidian (#121212) with a subtle 1px border of Slate Gray (#2C2C2E).
- **Level 2 (Popovers/Modals):** Charcoal (#1C1C1E) with a "soft glow" shadow: `0 8px 32px rgba(0,0,0,0.5)`.

This design system avoids traditional skeuomorphism. Instead, the "elevation" is felt through the contrast of the Gold primary color and the subtle luminosity of the container borders.

## Shapes
A consistent **12px (rounded-lg)** to **16px (rounded-xl)** radius is applied to all main containers, input fields, and buttons. 

- **Buttons:** Use 12px for standard actions.
- **Cards/Message Containers:** Use 16px to create a soft, modern frame for the text.
- **Selection Overlays:** Use a smaller 8px radius to feel "snappier" within the list views.
- **Avatars:** Strictly circular to contrast against the architectural squareness of the layout.

## Components
- **Primary Button:** Solid Burnt Gold (#D4A017) with Black text. No shadow, high impact.
- **Ghost Button:** Slate Gray outline with Off-white text; turns Gold on hover.
- **Inbox Items:** A "Soft-Select" state uses a 10% opacity Gold background with a 2px left-border "accent" in solid Gold.
- **Input Fields:** Dark Charcoal backgrounds with a 1px Slate border. On focus, the border transitions to Gold.
- **Chips/Tags:** Small, pill-shaped elements with low-opacity Gold backgrounds and Gold text to denote categories without overwhelming the visual hierarchy.
- **The "Compose" FAB:** A floating action button in the bottom right of the sidebar or list, using the Burnt Gold color to remain the primary focal point.