# Brightstream Bank - Design System & Style Guide

## For: Bank Branch Finder Responsive Web App

---

## 1. Brand Identity

**Brand Name:** Brightstream Bank
**Tagline:** "Banking Reimagined"
**Brand Personality:** Premium, trustworthy, modern-yet-classic, warm, sophisticated
**Visual Tone:** Luxury financial institution with approachable warmth. Think high-end hospitality meets fintech polish.

---

## 2. Color Palette

### Primary Colors

| Name       | Hex       | RGB                | Usage                                                               |
| ---------- | --------- | ------------------ | ------------------------------------------------------------------- |
| Midnight   | `#0a1628` | rgb(10, 22, 40)    | Primary dark background, text color, nav bar, footer, dark sections |
| Gold       | `#d4af37` | rgb(212, 175, 55)  | Primary accent, CTAs, badges, active states, links, highlights      |
| Warm White | `#fefdfb` | rgb(254, 253, 251) | Page background, card backgrounds, light text on dark               |

### Secondary Colors

| Name      | Hex       | RGB                | Usage                                                             |
| --------- | --------- | ------------------ | ----------------------------------------------------------------- |
| Navy      | `#1a2942` | rgb(26, 41, 66)    | Card gradients on dark backgrounds, secondary dark                |
| Deep Teal | `#0d4d56` | rgb(13, 77, 86)    | Gradient endpoints, hero backgrounds, accent dark                 |
| Sage      | `#8b9d83` | rgb(139, 157, 131) | Section labels, gradient accents, subtle green accent             |
| Cream     | `#f8f6f1` | rgb(248, 246, 241) | Card backgrounds, secondary light background, input borders, tags |
| Slate     | `#64748b` | rgb(100, 116, 139) | Body text, metadata, descriptions, secondary text                 |

### Gradient Patterns

- **Hero gradient:** `linear-gradient(135deg, #0a1628, #0d4d56)` - used for hero banners and CTA sections
- **Gold-to-Sage accent:** `linear-gradient(90deg, #d4af37, #8b9d83)` - used for progress bars, top-border accents on cards
- **Card dark gradient:** `linear-gradient(135deg, #1a2942, #0d4d56)` - used for product cards on dark backgrounds
- **Nav overlay:** `rgba(10, 22, 40, 0.85)` with `backdrop-filter: blur(10px)` - sticky navigation
- **Modal overlay:** `rgba(10, 22, 40, 0.85)` with `backdrop-filter: blur(8px)`

### Color Application Rules

- Dark sections (Midnight background) use Warm White and Cream for text, Gold for accents
- Light sections (Warm White or Cream background) use Midnight for headings, Slate for body text, Gold for interactive elements
- Always maintain high contrast between text and backgrounds
- Gold is reserved for interactive elements and key visual accents only

---

## 3. Typography

### Font Families

| Role                   | Font             | Source       |
| ---------------------- | ---------------- | ------------ |
| **Headings / Display** | Playfair Display | Google Fonts |
| **Body / UI**          | Jost             | Google Fonts |

**Google Fonts import:**

```
Playfair Display: weights 400, 500, 600, 700, 800
Jost: weights 300, 400, 500, 600
```

### Type Scale

| Element                     | Font             | Size                       | Weight  | Letter Spacing | Line Height | Color                  |
| --------------------------- | ---------------- | -------------------------- | ------- | -------------- | ----------- | ---------------------- |
| Hero H1 (Homepage)          | Playfair Display | clamp(3rem, 7vw, 6rem)     | 700     | -2px           | 1.1         | Warm White             |
| Hero H1 (Subpage)           | Playfair Display | clamp(3rem, 6vw, 4.5rem)   | 700     | -2px           | 1.1         | Warm White             |
| Section Title (H2)          | Playfair Display | clamp(2.5rem, 5vw, 4rem)   | 700     | -1px           | 1.2         | Midnight or Warm White |
| Card Title (H3)             | Playfair Display | 1.8rem                     | 600     | default        | 1.3         | Midnight or Warm White |
| Section Label               | Jost             | 0.9rem                     | 500     | 3px            | default     | Sage (uppercase)       |
| Body Text                   | Jost             | 1.15rem                    | 300     | default        | 1.8-1.9     | Slate                  |
| Subtitle / Hero description | Jost             | clamp(1.1rem, 2vw, 1.4rem) | 300     | 0.5px          | 1.6         | Cream                  |
| Nav Links                   | Jost             | 0.95rem                    | 400     | 0.5px          | default     | Cream                  |
| Button Text                 | Jost             | 1rem                       | 500     | 0.5px          | default     | varies                 |
| Metadata                    | Jost             | 0.9rem                     | 400-500 | default        | default     | Slate                  |
| Small/Category badges       | Jost             | 0.85rem                    | 600     | 0.5px          | default     | Midnight (uppercase)   |

### Typography Rules

- Headings always use Playfair Display (serif) for a premium, editorial feel
- All UI text, buttons, labels, body copy use Jost (sans-serif) for clean readability
- Body text leans toward weight 300 (light) for an airy, premium feel
- Section labels are always UPPERCASE with wide letter-spacing (3px)
- Negative letter-spacing on large headings (-1px to -2px) for tight, elegant display

---

## 4. Spacing System

### Section Padding

| Context                          | Padding                             |
| -------------------------------- | ----------------------------------- |
| Major sections (desktop)         | 8rem top/bottom, 5% left/right      |
| Major sections (mobile)          | 5rem top/bottom, 5% left/right      |
| Content sections (articles page) | 6rem top/bottom, 5% left/right      |
| Newsletter/CTA sections          | 6rem-8rem top/bottom, 5% left/right |

### Content Width

- **Max content width:** 1400px (centered with `margin: 0 auto`)
- **Text content max width:** 700-800px (for readability)
- **Section header max width:** 700-800px (centered)

### Component Spacing

| Element                   | Spacing                            |
| ------------------------- | ---------------------------------- |
| Section header to content | 4rem-5rem margin-bottom            |
| Grid gap (cards)          | 2.5rem-3rem                        |
| Card internal padding     | 2.5rem-3rem                        |
| Form field margin-bottom  | 1.5rem                             |
| Button padding            | 1rem vertical, 2-2.5rem horizontal |
| Nav padding               | 1.5rem vertical, 5% horizontal     |

---

## 5. Component Patterns

### 5.1 Navigation Bar

- **Position:** Fixed top, full width
- **Background:** `rgba(10, 22, 40, 0.85)` with `backdrop-filter: blur(10px)`
- **Height:** ~80px (1.5rem padding + content)
- **Layout:** Logo left, nav links right (flex, space-between)
- **Logo:** Playfair Display, 1.8rem, weight 700, Warm White
- **Links:** Jost, 0.95rem, weight 400, Cream color, 3rem gap
- **Link hover:** Gold underline slides in from left (1px height, transition 0.3s)
- **CTA button in nav:** Gold background, Midnight text, 30px border-radius, 0.7rem/1.8rem padding
- **Mobile:** Nav links hidden (hamburger menu implied)

### 5.2 Hero Banner

**Homepage variant (full-height):**

- Height: 100vh
- Background: Image with dark gradient overlay
- Content: Centered, max-width 900px
- H1 + subtitle + CTA button group
- Subtle scroll indicator at bottom (animated bounce)

**Subpage variant (half-height):**

- Height: 50vh
- Margin-top: 80px (for fixed nav)
- Background: `linear-gradient(135deg, var(--midnight), var(--deep-teal))` (no image)
- Content: Centered, max-width 800px
- H1 + subtitle only

### 5.3 Buttons

**Primary Button:**

- Background: Gold (`#d4af37`)
- Text: Midnight (`#0a1628`)
- Padding: 1rem 2.5rem
- Border-radius: 50px (fully rounded / pill shape)
- Font: Jost, 1rem, weight 500
- Shadow: `0 10px 40px rgba(212, 175, 55, 0.3)`
- Hover: translateY(-3px), stronger shadow

**Secondary Button:**

- Background: transparent
- Border: 2px solid (Warm White on dark bg, or Gold on dark bg)
- Text: Warm White or Midnight
- Same padding and border-radius as primary
- Hover: filled background, translateY(-3px)

**Tag / Filter Button:**

- Background: Cream (`#f8f6f1`)
- Text: Midnight
- Padding: 0.6rem 1.5rem
- Border-radius: 25px
- Border: 2px solid transparent
- Active/Hover state: Midnight background, Warm White text, Gold border

### 5.4 Cards

**Feature Card (light background):**

- Background: Warm White
- Padding: 3rem 2.5rem
- Border-radius: 20px
- Hover: translateY(-10px), shadow `0 30px 60px rgba(10, 22, 40, 0.1)`
- Top accent bar on hover: 4px gradient (Gold to Sage), scales in from left
- Contains: Icon (70x70 square with rounded corners), H3, description text

**Article Card:**

- Background: Cream
- Border-radius: 25px
- No padding on outer (image bleeds to edges)
- Image area: 250px height, cover, with category badge overlay
- Content area: 2.5rem padding
- Contains: Category badge, meta info, H3, excerpt, link
- Hover: translateY(-10px), shadow `0 30px 60px rgba(10, 22, 40, 0.15)`

**Product Card (dark background):**

- Background: `linear-gradient(135deg, #1a2942, #0d4d56)`
- Border-radius: 25px
- Image area: 300px height with gradient overlay from bottom
- Content padding: 2.5rem
- Contains: H3, description, feature list with gold bullet markers, link
- Hover: translateY(-10px), gold-tinted shadow

**Category Badge (on cards):**

- Position: absolute, top-left of image area (1.5rem offset)
- Background: Gold
- Text: Midnight, 0.85rem, weight 600, uppercase
- Padding: 0.5rem 1.2rem
- Border-radius: 20px

### 5.5 Form Elements

**Text Input / Select:**

- Width: 100%
- Padding: 0.9rem 1.2rem
- Border: 2px solid Cream
- Border-radius: 15px
- Font: Jost, 1rem
- Background: Warm White
- Focus state: Gold border + `box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.1)`

**Search Input (newsletter style):**

- Border: 2px solid Midnight
- Border-radius: 50px (pill shape)
- Padding: 1rem 1.5rem
- Focus: Gold border

**Select dropdown:**

- Custom arrow SVG chevron
- `appearance: none` with custom background-image

**Checkbox:**

- 24x24px
- Border-radius: 6px
- `accent-color: var(--gold)`

**Labels:**

- Jost, 0.95rem, weight 500, Midnight color
- 0.6rem margin-bottom

### 5.6 Modal / Overlay

- Overlay: `rgba(10, 22, 40, 0.85)` + `backdrop-filter: blur(8px)`
- Container: Warm White background, 30px border-radius, 3rem padding, max-width 550px
- Entry animation: scale(0.9) to scale(1) + opacity fade
- Close button: 40px circle, Cream background, rotates 90deg on hover
- Progress bar: 6px height, Cream track, Gold-to-Sage gradient fill
- Step animation: fadeIn + translateX(20px to 0)

### 5.7 Stats / Metrics Display

- Grid: 2 columns
- Each stat: Cream background, 20px border-radius, 2rem padding, centered text
- Number: Playfair Display, 3rem, weight 700, Gold color
- Label: Jost, 0.95rem, Slate, uppercase, 1px letter-spacing

### 5.8 Icon Style

- Container: 70x70px
- Background: `linear-gradient(135deg, #0a1628, #0d4d56)`
- Border-radius: 18px
- Icon: SVG stroke-based, Gold color (#d4af37), 32x32px, stroke-width 2
- Style: Outlined/linear (not filled), rounded caps and joins

---

## 6. Layout Patterns

### 6.1 Grid Systems

**3-Column Card Grid:**

```
grid-template-columns: repeat(auto-fit, minmax(320px, 1fr))
gap: 3rem
max-width: 1400px
```

**3-Column Article Grid:**

```
grid-template-columns: repeat(auto-fill, minmax(350px, 1fr))
gap: 3rem
```

**2-Column Split (image + text):**

```
grid-template-columns: 1fr 1fr
gap: 5rem
align-items: center
```

**Footer Grid:**

```
grid-template-columns: 2fr 1fr 1fr 1fr
gap: 4rem
```

### 6.2 Responsive Breakpoints

| Breakpoint     | Behavior                                                                    |
| -------------- | --------------------------------------------------------------------------- |
| > 1024px       | Full layout, all columns visible                                            |
| 768px - 1024px | Trust section stacks, footer goes 2-col, nav gap reduces                    |
| < 768px        | Single column everything, nav links hidden (mobile menu), form fields stack |

### 6.3 Page Structure Pattern

Typical page flow for a subpage (like the Branch Finder):

1. **Fixed Navigation Bar** - dark, translucent
2. **Hero Banner** (50vh, subpage variant) - gradient background, centered title + subtitle
3. **Main Content Section** - 6rem padding, max-width 1400px, centered
4. **Alternating Background Sections** - alternate between Warm White, Cream, and Midnight backgrounds
5. **CTA / Newsletter Section** - Cream or dark gradient background
6. **Footer** - Midnight background, multi-column

---

## 7. Interaction & Animation Patterns

### Transitions

- **Default transition:** `all 0.3s ease`
- **Card hover:** `all 0.4s-0.5s cubic-bezier(0.4, 0, 0.2, 1)`
- **Button hover:** `all 0.4s cubic-bezier(0.4, 0, 0.2, 1)`

### Hover Effects

- **Cards:** translateY(-10px) + box-shadow increase
- **Buttons:** translateY(-2px to -3px) + shadow intensification
- **Links:** Gold underline slides in from left, or gap increases (for arrow links)
- **Nav CTA:** Background changes from Gold to Warm White

### Shadows

| Element               | Shadow                                |
| --------------------- | ------------------------------------- |
| Card hover (light bg) | `0 30px 60px rgba(10, 22, 40, 0.1)`   |
| Card hover (dark bg)  | `0 30px 60px rgba(212, 175, 55, 0.2)` |
| Primary button        | `0 10px 40px rgba(212, 175, 55, 0.3)` |
| Primary button hover  | `0 15px 50px rgba(212, 175, 55, 0.4)` |
| Modal container       | `0 40px 100px rgba(0, 0, 0, 0.3)`     |
| Trust image           | `0 30px 80px rgba(10, 22, 40, 0.15)`  |

### Border Radius Scale

| Size | Usage                                     |
| ---- | ----------------------------------------- |
| 50px | Buttons (pill shape)                      |
| 30px | Large containers, modals, hero images     |
| 25px | Cards, product cards, article cards, tags |
| 20px | Feature cards, stat boxes                 |
| 18px | Icon containers                           |
| 15px | Form inputs                               |
| 10px | Progress bars                             |
| 6px  | Checkboxes                                |

---

## 8. Branch Finder - Suggested Design Application

### Page Layout

**Hero Section:**

- 50vh subpage hero with gradient background
- Title: "Find a Branch" in Playfair Display
- Subtitle: "Locate your nearest Brightstream branch or ATM"
- Integrated search bar directly in hero (pill-shaped input + Gold "Search" button)

**Search & Filter Bar:**

- Sticky below nav on scroll
- Cream background with subtle shadow
- Contains: Location search input (pill-shaped), distance dropdown, service filter tags
- Filter tags use the same tag component (Cream bg, pill shape, Gold active border)
- Filter categories: All, Full Service, ATM Only, Wealth Center, Business Banking

**Results Area:**

- Split layout: Map on right (60%), results list on left (40%) on desktop
- On mobile: Toggle between map view and list view with tab buttons
- Map container: 25px border-radius, subtle shadow

**Branch Result Card:**

- Cream background, 25px border-radius
- Left gold accent bar (4px, like the feature card hover state but always visible)
- Content: Branch name (Playfair Display H3), address, distance, hours
- Service icons row (small, using the icon style - outlined, Gold stroke)
- "Get Directions" link in Gold with arrow
- Hover: translateY(-5px) + shadow

**Branch Detail Panel / Modal:**

- Uses the existing modal pattern (30px border-radius, Warm White bg)
- Branch name as modal title (Playfair Display)
- Tabs for: Overview, Services, Hours (tag-style tab buttons)
- Contact info, full address, operating hours table
- "Get Directions" primary button (Gold, pill shape)
- Small embedded map

**CTA Section:**

- "Can't find what you need?" section
- Midnight/Deep Teal gradient background
- Warm White heading, Cream body text
- Two buttons: "Contact Us" (Gold primary) and "Schedule Appointment" (outlined secondary)

**Footer:**

- Same as site-wide footer pattern

### Responsive Behavior

| Viewport            | Layout                                                              |
| ------------------- | ------------------------------------------------------------------- |
| Desktop (>1024px)   | Side-by-side: list (40%) + map (60%), filters in horizontal row     |
| Tablet (768-1024px) | Map on top (400px height), list below full-width                    |
| Mobile (<768px)     | Toggle view (map/list tabs), stacked filter chips, full-width cards |

---

## 9. Accessibility Notes

- Ensure all Gold text on Cream/White backgrounds meets WCAG AA contrast (Gold on white may need darkening for small text)
- Interactive elements need visible focus states (Gold outline ring: `box-shadow: 0 0 0 4px rgba(212, 175, 55, 0.3)`)
- Map should have an accessible alternative (branch list with full details)
- All form inputs have associated labels
- Use `prefers-reduced-motion` to disable hover transforms and animations

---

## 10. Asset References

### Fonts

- Google Fonts: `Playfair+Display:wght@400;500;600;700;800`
- Google Fonts: `Jost:wght@300;400;500;600`

### Icon Style

- Line/stroke-based SVG icons
- Stroke color: Gold (#d4af37) on dark backgrounds, Midnight (#0a1628) on light
- Stroke width: 2px
- Caps: round
- Joins: round
- Recommended icon set: Feather Icons or Lucide (matches the existing style)
