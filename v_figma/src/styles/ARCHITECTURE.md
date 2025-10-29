# CSS-Architektur Visualisierung

## Konzeptionelles Modell

```
┌─────────────────────────────────────────────────────────────┐
│                        GLOBALS.CSS                          │
│  ┌─────────────┐  ┌──────────┐  ┌─────────┐  ┌──────────┐ │
│  │   Colors    │  │   Text   │  │ Spacing │  │ Shadows  │ │
│  │  Lavender   │  │  xs→6xl  │  │ xs→3xl  │  │  sm→xl   │ │
│  │  Horizon    │  │          │  │         │  │          │ │
│  │  Mint       │  │          │  │         │  │          │ │
│  └─────────────┘  └──────────┘  └─────────┘  └──────────┘ │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│                         THEMES.CSS                          │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Dark Theme (Default)                                 │  │
│  │  • --primary: true-lavender                          │  │
│  │  • --secondary: horizon                              │  │
│  │  • --accent: mint                                    │  │
│  │  • --background: bg-darker                           │  │
│  │  • --card: bg-darkerst                               │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              ↓
        ┌─────────────────────┴─────────────────────┐
        ↓                                           ↓
┌────────────────────┐                    ┌────────────────────┐
│  COMPONENTS/       │                    │  PAGES/            │
│  .shared.css       │                    │  .shared.css       │
└────────────────────┘                    └────────────────────┘
        ↓                                           ↓
   ┌────┴────┬────────────┬──────────┐            ↓
   ↓         ↓            ↓          ↓    ┌────────────────┐
┌──────┐ ┌──────┐  ┌──────────┐  ┌────┐  │ placeholder.css│
│ nav  │ │footer│  │   hero   │  │ ui/│  │    start.css   │
│ .css │ │ .css │  │   .css   │  │    │  └────────────────┘
└──────┘ └──────┘  └──────────┘  └────┘
                                    ↓
                          ┌─────────┴─────────┐
                          ↓                   ↓
                    ┌──────────┐        ┌─────────┐
                    │ content- │        │ button  │
                    │ sections/│        │dropdown │
                    │          │        │ table   │
                    └──────────┘        └─────────┘
                          ↓
              ┌───────────┼───────────┐
              ↓           ↓           ↓
         ┌────────┐  ┌────────┐  ┌────────┐
         │akronym │  │aktuelles│  │programm│
         │        │  │mitmachen│  │        │
         └────────┘  └────────┘  └────────┘
```

## Datenfluss: Von Variable zur Komponente

```
DEFINITION (globals.css)
    ↓
--color-true-lavender: #7E65B9
    ↓
ASSIGNMENT (themes.css)
    ↓
--primary: var(--color-true-lavender)
    ↓
USAGE (navigation.css)
    ↓
.nav-dropdown-trigger:hover {
    color: var(--primary);
}
    ↓
APPLICATION (navigation.tsx)
    ↓
<a className="nav-dropdown-trigger">Begriffe</a>
    ↓
RENDERED CSS
    ↓
color: #7E65B9
```

## Komponenten-Hierarchie

```
App.tsx
  │
  ├─→ Navigation (navigation.tsx)
  │     └─→ 32 CSS Classes from navigation.css
  │
  ├─→ Main
  │     │
  │     ├─→ HeroSection (hero-section.tsx)
  │     │     └─→ 23 CSS Classes from hero.css
  │     │
  │     └─→ ContentSections (content-sections.tsx)
  │           │
  │           ├─→ About/Akronym Section
  │           │     └─→ 19 CSS Classes from akronym.css
  │           │
  │           ├─→ Programm Section
  │           │     └─→ 17 CSS Classes from programm.css
  │           │
  │           ├─→ Aktuelles Section
  │           │     └─→ 15 CSS Classes from aktuelles.css
  │           │
  │           └─→ Mitmachen Section
  │                 └─→ 11 CSS Classes from mitmachen.css
  │
  └─→ Footer (footer.tsx)
        └─→ 26 CSS Classes from footer.css
```

## CSS Class Naming Pattern

```
[component]-[element]-[modifier]
     ↓          ↓         ↓
    nav    -  logo   -  link
    nav    -  dropdown - content
   hero    -  feature - icon - wrapper
  footer   -  social  - link
```

### Beispiele

```
nav-header                    → Navigation Header
nav-logo-link                 → Logo Link in Navigation
nav-dropdown-content          → Dropdown Content Container
nav-dropdown-item             → Item innerhalb Dropdown
nav-mobile-menu               → Mobile Menu Container

hero-section                  → Hero Section Container
hero-title                    → Haupttitel
hero-feature-icon-wrapper     → Icon Container für Features
hero-cta-container            → Call-to-Action Container

footer-grid                   → Footer Grid Layout
footer-contact-item           → Contact Item
footer-social-link            → Social Media Link

akronym-pillars-list          → Liste der AKSEP-Säulen
programm-card                 → Programm Highlight Card
aktuelles-date-wrapper        → News Date Container
mitmachen-grid                → CTA Grid Layout
```

## State Management in CSS

```
NORMAL STATE
    ↓
.nav-dropdown-trigger {
    color: var(--foreground);
    transition: color var(--transition-base);
}
    ↓
HOVER STATE
    ↓
.nav-dropdown-trigger:hover {
    color: var(--primary);
}
    ↓
ACTIVE STATE (JavaScript)
    ↓
activeDropdown === 'begriffe'
    ↓
RENDERED
    ↓
<div className="nav-dropdown-content">
```

## Responsive Design Pattern

```
MOBILE FIRST APPROACH

Base (Mobile):
.nav-desktop { display: none; }

↓

@media (min-width: 1024px) {
    .nav-desktop { display: flex; }
}

↓

Result:
• < 1024px: Hidden
• ≥ 1024px: Visible as Flex
```

### Breakpoint Flow

```
     0px          640px        768px        1024px       1280px       1536px
      │             │            │             │            │            │
      ├─────────────┤            │             │            │            │
      │   Mobile    │            │             │            │            │
      │             ├────────────┤             │            │            │
      │             │   sm       │             │            │            │
      │             │            ├─────────────┤            │            │
      │             │            │     md      │            │            │
      │             │            │             ├────────────┤            │
      │             │            │             │     lg     │            │
      │             │            │             │            ├────────────┤
      │             │            │             │            │     xl     │
      │             │            │             │            │            ├────
      │             │            │             │            │            │ 2xl
```

## Import Order in index.css

```
1. Core
   ├─→ themes.css (includes globals.css)
   
2. Components
   ├─→ navigation.css
   ├─→ footer.css
   └─→ hero.css
   
3. Content Sections
   ├─→ akronym.css
   ├─→ aktuelles.css
   ├─→ mitmachen.css
   └─→ programm.css
   
4. UI Components
   ├─→ button.css
   ├─→ dropdown.css
   └─→ table.css
   
5. Pages
   ├─→ placeholder.css
   └─→ start.css
```

## Color System Flow

```
PALETTE DEFINITION
┌─────────────────────────────────────┐
│ globals.css                         │
│ --color-true-lavender: #7E65B9      │
│ --color-horizon: #5A8FA8            │
│ --color-mint: #3EB694               │
└─────────────────────────────────────┘
              ↓
SEMANTIC ASSIGNMENT
┌─────────────────────────────────────┐
│ themes.css                          │
│ --primary: var(--color-true-lavender)│
│ --secondary: var(--color-horizon)   │
│ --accent: var(--color-mint)         │
└─────────────────────────────────────┘
              ↓
COMPONENT USAGE
┌─────────────────────────────────────┐
│ navigation.css                      │
│ color: var(--primary)               │
│ background: var(--card)             │
└─────────────────────────────────────┘
              ↓
RENDERED
┌─────────────────────────────────────┐
│ Browser                             │
│ color: #7E65B9                      │
│ background: #423A51                 │
└─────────────────────────────────────┘
```

## Grid System Visualization

### Footer Grid (1 → 3 columns)

```
MOBILE (< 768px):
┌────────────────────────┐
│  Logo & Branding       │
├────────────────────────┤
│  Participation         │
├────────────────────────┤
│  Legal                 │
└────────────────────────┘

DESKTOP (≥ 768px):
┌───────────┬───────────┬───────────┐
│  Logo &   │ Particip- │  Legal    │
│  Branding │  ation    │           │
└───────────┴───────────┴───────────┘
```

### Hero Features Grid (1 → 3 columns)

```
MOBILE (< 768px):
┌────────────────────────┐
│  Bildung               │
├────────────────────────┤
│  AKSEPtanz             │
├────────────────────────┤
│  Bürgernah             │
└────────────────────────┘

DESKTOP (≥ 768px):
┌──────────┬──────────┬──────────┐
│ Bildung  │ AKSEPtanz│Bürgernah │
└──────────┴──────────┴──────────┘
```

### Programm Grid (1 → 2 → 4 columns)

```
MOBILE (< 768px):
┌────────────────┐
│   Bildung      │
├────────────────┤
│   Klima        │
├────────────────┤
│   Sozial       │
├────────────────┤
│   Europa       │
└────────────────┘

TABLET (≥ 768px):
┌──────────┬──────────┐
│ Bildung  │  Klima   │
├──────────┼──────────┤
│ Sozial   │  Europa  │
└──────────┴──────────┘

DESKTOP (≥ 1024px):
┌──────┬──────┬──────┬──────┐
│Bildung│Klima│Sozial│Europa│
└──────┴──────┴──────┴──────┘
```

## Performance Optimization Flow

```
BEFORE (Tailwind Utilities)
┌────────────────────────────────────┐
│ className="flex items-center       │
│   space-x-3 mr-8 hover:opacity-80  │
│   transition-opacity bg-card       │
│   border-b border-border           │
│   sticky top-0 z-50"               │
│                                    │
│ = ~180 characters                  │
│ = Multiple utility classes         │
│ = Repeated across components       │
└────────────────────────────────────┘

AFTER (Modular CSS)
┌────────────────────────────────────┐
│ className="nav-header"             │
│                                    │
│ = ~26 characters                   │
│ = Single semantic class            │
│ = Defined once, used everywhere    │
└────────────────────────────────────┘

RESULT:
• 86% reduction in markup
• Better caching
• Easier maintenance
• Faster development
```

## Maintenance Workflow

```
NEED TO CHANGE HEADER HEIGHT?

OLD WAY (Tailwind):
1. Find all <header> elements
2. Change h-16 → h-20 in multiple places
3. Check for side effects
4. Update responsive variants
   └→ 4 files × 3 places = 12 changes

NEW WAY (Modular CSS):
1. Open navigation.css
2. Change height: 4rem → 5rem
3. Done!
   └→ 1 file × 1 place = 1 change
```

## Version Control Benefits

```
GIT DIFF - OLD WAY:
- <header className="bg-card border-b border-border sticky top-0 z-50 h-16">
+ <header className="bg-card border-b border-border sticky top-0 z-50 h-20">
  └→ Hard to see what changed

GIT DIFF - NEW WAY:
  /* navigation.css */
  .nav-header {
-   height: 4rem;
+   height: 5rem;
  }
  └→ Clear what changed and why
```

## Testing Strategy

```
COMPONENT TESTING FLOW

1. Visual Regression
   ├─→ Desktop (1920px)
   ├─→ Tablet (768px)
   └─→ Mobile (375px)

2. Interaction Testing
   ├─→ Hover States
   ├─→ Focus States
   ├─→ Active States
   └─→ Transitions

3. Browser Testing
   ├─→ Chrome/Edge
   ├─→ Firefox
   └─→ Safari

4. Performance Testing
   ├─→ Load Time
   ├─→ Paint Time
   └─→ CSS Size
```

## Future Extensibility

```
ADDING NEW COMPONENT

1. Create CSS File
   └─→ /styles/components/new-component.css

2. Import in Parent Shared
   └─→ Add @import './new-component.css'

3. Define Classes
   └─→ .new-component-*

4. Document
   └─→ Add to CLASS-INDEX.md

5. Use in TSX
   └─→ <div className="new-component-header">
```

---

Diese Architektur ist designed für:
- ✅ **Wartbarkeit**: Klare Struktur und Benennung
- ✅ **Skalierbarkeit**: Einfach erweiterbar
- ✅ **Performance**: Optimierte CSS-Größe
- ✅ **DX**: Developer Experience first
- ✅ **Dokumentation**: Vollständig dokumentiert

---

Erstellt: Oktober 2024  
Version: 1.0
