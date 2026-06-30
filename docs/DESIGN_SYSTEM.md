# Design System: Anthropic Minimalist

The BUCC Web Portal adheres to a strict "Anthropic Minimalist" design philosophy. This aesthetic prioritizes function, high-contrast typography, and explicit visual hierarchy over decorative elements.

## Core Principles

1. **Monochrome Dominance:** The UI relies heavily on high-contrast foreground/background relationships (`bg-background` vs `text-foreground`).
2. **Typography as Structure:** 
   - **Serif Fonts:** Used exclusively for primary headings (`h1`, `h2`, `CardTitle`) to establish authority and tradition.
   - **Sans-Serif Fonts:** Used for body text, data points, and UI controls for maximum legibility.
   - **Tracking & Case:** Micro-copy, labels, and badges utilize `uppercase tracking-widest text-[10px] font-bold` to create sharp, technical accents.
3. **Absence of Clutter:** 
   - No heavy drop shadows. We use subtle `border border-border` or `shadow-sm` at most.
   - No bouncy or elastic animations. Transitions should be linear, fade-ins, or subtle scales (`scale-105`).

## Branding Implementations

### Logo Distribution
We maintain two distinct visual identities to separate public marketing from internal tooling:

1. **Public Navbar:** 
   - Uses the full logomark (`bucc-logo.svg`).
   - Sizing: `width={160} height={54}`.
2. **Administrative Sidebar & Placeholders:**
   - Uses the compact icon (`bucc-icon.svg`).
   - Sizing: `width={40} height={40}` (Sidebar) / `width={80} height={80}` (Placeholders).

### Dark Mode Color Correction
The original BUCC assets are designed for light backgrounds. To support dark mode without maintaining duplicate colored assets, we use a CSS double-filter technique:
```tsx
className="dark:invert dark:hue-rotate-180"
```
*Why?* The `invert` filter flips black text to white for contrast, but it turns our signature Blue into Orange. Adding `hue-rotate-180` spins the color wheel back, resulting in perfectly visible white text while maintaining the correct brand blue.

## Component Patterns

### The Global Announcement Bar
- **Location:** Top of the root layout, above the Navbar.
- **Style:** Fully inverted (`bg-foreground text-background`). This ensures it commands immediate attention without resorting to "alert" colors like red or yellow.

### The Digital ID Card
- **Style:** Clean border, prominent serif name, monospace student ID.
- **Photo:** Housed in a rigid circle (`rounded-full border-2 border-border`). If no photo exists, a muted Lucide `UserIcon` serves as the fallback.

### Responsive Navigation (Mobile Hamburger Drawer)
- **File:** [src/components/Navbar.tsx](file:///C:/Users/Abir/Desktop/bucc-main/src/components/Navbar.tsx)
- **Style:** On desktop, nav links are distributed horizontally. On mobile (`md` breakpoint and below), links collapse into an interactive drawer menu. Nested links (e.g. "About Us" and "Publications") are rendered as collapsible accordions that remain closed by default to prevent cluttering the mobile view.
- **Micro-animations:** Accordion panels slide open with linear transitions, while the main drawer slides down from the header bar using Tailwind's `animate-in fade-in slide-in-from-top-5 duration-200` to feel fluid and premium.

### Cover Banners & Avatar Overlays
- **Layout:** High-impact banner covers (`h-60 md:h-80`) with a bottom-aligned avatar overlay (`-mt-20 md:-mt-24`).
- **Contrast & Legibility:** Cover images use a gradient mask (`bg-gradient-to-t from-black/60 via-black/20 to-transparent`) and text dropshadows (`drop-shadow-[0_2px_4px_rgba(0,0,0,0.6)]`) for profile headings overlaying the banner image, ensuring accessibility on dark or busy backgrounds.
- **Dimensions:** Profile avatars on public pages are expanded to `h-32 w-32 md:h-40 md:w-40` for maximum visual weight.

### Expandable Height & Lists
- **File:** [src/components/ExpandableSection.tsx](file:///C:/Users/Abir/Desktop/bucc-main/src/components/ExpandableSection.tsx)
- **ExpandableHeight:** Limits large text blocks (e.g. Work/Education markdown cards) using a configurable `maxCollapsedHeight` overlayed with a bottom fade gradient. Clicking "Show More" smoothly expands the height.
- **ExpandableList:** Slices rendering lists on the client side using:
  ```tsx
  React.Children.toArray(children).slice(0, currentLimit)
  ```
  *RSC Serialization Guard:* Because React Server Components cannot serialize callback mapping functions across the server-client boundary, child elements are composed entirely on the server and sliced dynamically on the client side using React Children utilities.

### GitHub Coding Activity Widget
- **Integration:** Displays real-time GitHub contributions chart via `ghchart.rshah.org`.
- **Theme Sync:** Uses `dark:invert` filters to automatically align the chart's SVG elements with the portal's active light/dark state.
