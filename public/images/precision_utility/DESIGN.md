---
name: Precision & Utility
colors:
  surface: '#141313'
  surface-dim: '#141313'
  surface-bright: '#3a3939'
  surface-container-lowest: '#0e0e0e'
  surface-container-low: '#1c1b1b'
  surface-container: '#201f1f'
  surface-container-high: '#2a2a2a'
  surface-container-highest: '#353434'
  on-surface: '#e5e2e1'
  on-surface-variant: '#c4c7c8'
  inverse-surface: '#e5e2e1'
  inverse-on-surface: '#313030'
  outline: '#8e9192'
  outline-variant: '#444748'
  surface-tint: '#c6c6c7'
  primary: '#ffffff'
  on-primary: '#2f3131'
  primary-container: '#e2e2e2'
  on-primary-container: '#636565'
  inverse-primary: '#5d5f5f'
  secondary: '#b9c8de'
  on-secondary: '#233143'
  secondary-container: '#39485a'
  on-secondary-container: '#a7b6cc'
  tertiary: '#ffffff'
  on-tertiary: '#263143'
  tertiary-container: '#d8e3fb'
  on-tertiary-container: '#5a6579'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#e2e2e2'
  primary-fixed-dim: '#c6c6c7'
  on-primary-fixed: '#1a1c1c'
  on-primary-fixed-variant: '#454747'
  secondary-fixed: '#d4e4fa'
  secondary-fixed-dim: '#b9c8de'
  on-secondary-fixed: '#0d1c2d'
  on-secondary-fixed-variant: '#39485a'
  tertiary-fixed: '#d8e3fb'
  tertiary-fixed-dim: '#bcc7de'
  on-tertiary-fixed: '#111c2d'
  on-tertiary-fixed-variant: '#3c475a'
  background: '#141313'
  on-background: '#e5e2e1'
  surface-variant: '#353434'
typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: '800'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: '0'
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: '1.5'
    letterSpacing: '0'
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
spacing:
  unit: 4px
  gutter: 16px
  margin-mobile: 16px
  margin-desktop: 32px
  max-width: 1200px
  grid-cols-service: repeat(auto-fill, minmax(300px, 1fr))
  grid-cols-gallery: repeat(12, 1fr)
---

## Brand & Style
The design system is engineered for the modern barbering experience: fast, efficient, and precise. The brand personality is masculine and utilitarian, avoiding the "premium luxury" tropes in favor of a "high-performance workshop" aesthetic. 

The visual style draws heavily from **Minimalism** and **Brutalism**, utilizing high-contrast surfaces and sharp geometries to mirror the edge of a straight razor. The emotional response is one of reliability and competence. The interface stays out of the way, prioritizing the utility of booking services and viewing availability over decorative flourishes.

## Colors
This design system utilizes a high-contrast dark palette to maintain a "sharp" and focused atmosphere. 

- **Primary Backgrounds**: Pure Black (#000000) for the deepest base layers.
- **Surface Layers**: Deep Charcoal (#121212) for cards and containers to provide subtle separation.
- **Primary Action/Text**: Crisp White (#FFFFFF) ensures maximum legibility and a striking, modern look.
- **Utilitarian Accents**: Muted Steel Blue (#94A3B8) is used sparingly for icons, secondary labels, and status indicators, providing a mechanical, industrial feel without breaking the dark aesthetic.
- **Dividers**: A dark grey (#262626) is used for thin, 1px borders to define structure without adding visual bulk.

## Typography
The typography is built entirely on **Inter**, chosen for its neutral, systematic, and utilitarian qualities. 

Headings are set with heavy weights and tight letter-spacing to feel impactful and grounded. For the body text, a standard weight is used to ensure maximum legibility against the dark background. A specific "label-caps" style is defined for small metadata—like service durations or category headers—to reinforce the efficient, organized nature of the system. All type should be rendered with anti-aliasing for maximum crispness on dark backgrounds.

## Layout & Spacing
The layout follows a **Fixed Grid** philosophy on desktop and a fluid single-column approach on mobile. 

- **Service Lists**: Use a CSS Grid `auto-fill` pattern. Items should have a minimum width of 300px to ensure the "razor-sharp" card borders are clearly visible.
- **Image Galleries**: Built on a 12-column system. Use asymmetrical spans (e.g., one image spanning 8 columns, another spanning 4) to create a modern, editorial look.
- **Rhythm**: All spacing (padding, margins) must be increments of 4px. Use generous vertical spacing (64px+) between sections to maintain the minimalist feel.

## Elevation & Depth
In this design system, depth is communicated through **Bold Borders** and **Tonal Layers** rather than shadows. 

Avoid all box-shadows. Instead, indicate hierarchy by placing #121212 surfaces on #000000 backgrounds. Use 1px solid borders (#262626) to define the perimeter of interactive elements. When an element is hovered or active, the border should transition to White or Steel Blue to provide immediate tactile feedback. This "flat depth" reinforces the shop's focus on precision and clarity.

## Shapes
The shape language is strictly **Sharp**. 

All buttons, cards, input fields, and images must have a 0px border radius. This choice is a literal interpretation of the barbering craft—representing the sharp edge of a blade and the precision of a haircut. There are no soft corners in this system; every intersection is a clean 90-degree angle.

## Components
- **Buttons**: High-contrast. The primary button is Solid White with Black text. Secondary buttons are Black with a 1px White border. All buttons use uppercase typography.
- **Cards**: Minimalist containers with a #121212 background and a 1px #262626 border. Internal padding should be a consistent 24px.
- **Service List Items**: Thin horizontal dividers (#262626) between services. Prices should be bold and aligned to the right.
- **Input Fields**: Black background with a bottom-only 1px border. The border turns White on focus. 
- **Chips/Badges**: Small, rectangular boxes with Steel Blue borders for "Available" or "Specialty" tags.
- **Booking Calendar**: A strict grid of squares. Selected dates are inverted (White background, Black text), while unavailable dates are dimmed to 30% opacity.