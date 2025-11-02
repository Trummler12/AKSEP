# AKSEP-NEU Modularization Discovery

**Datum**: 30. Oktober 2025
**Ziel**: Modularisierung von AKSEP-NEU nach der Struktur aus AKSEP-v_figma

---

## 1. Aktuelle Struktur in AKSEP-NEU

### Components

```
src/components/
├── figma/                    # Figma-specific utilities
├── footer.tsx               # Footer component
├── hero-section.tsx         # Hero section
├── navigation/              # Navigation sub-folder
│   └── ...
├── navigation.tsx           # Main navigation
├── page-shell.tsx          # Page layout wrapper
├── routing/                # Routing utilities
└── ui/                     # UI component library (Button, Card, Icon, etc.)
```

**FEHLER**: Keine `start-sections.tsx` oder `content-sections/` Ordner!
- Alle Start-Page Sections sind inline in `src/content/start.tsx` definiert

### Data Layer

```
src/data/
├── footer.ts               # Footer data
├── hero.ts                 # Hero data
├── navigation.ts           # Navigation data
├── routes.ts              # Routing data
└── startpage.ts           # START-PAGE DATA ← Hier ist alles!
```

**Structure von startpage.ts**:
```
- newsItems: NewsItem[]
- programHighlights: ProgramHighlight[]
- aksepDescription: { title, subtitle, description }
- informationPolitics: { title, description, quote }
- programSection: { title, description }
- newsSection: { title, description }
- participationSection: { title, description }
```

### Styles

```
src/styles/
├── components/ui/.figma-ui-components.css
├── globals.css
├── index.css
├── themes.css
├── components/
│   ├── content-sections/          # Ordner für content-spezifische Styles
│   │   └── (leer oder minimal)
│   ├── content-sections.css       # ← Hauptstyles!
│   ├── footer.css
│   ├── hero.css
│   ├── navigation.css
│   ├── shared.css                 # Bereits shared patterns!
│   └── ui/                        # UI component styles
├── pages/
│   ├── homepage.css
│   └── ...
└── styles-PLANUNG/
    └── (alte Planung)
```

**Wichtig**: `content-sections.css` hat SCHON ~410 Zeilen mit monolithischen Styles!

---

## 2. V_Figma Ziel-Struktur

```
src/components/
├── content-sections.tsx               # ORCHESTRATOR
├── content-sections/                  # Sub-Components
│   ├── AkronymSection.tsx
│   ├── ProgrammSection.tsx
│   ├── MitmachenSection.tsx
│   ├── AktuellSection.tsx
│   └── ...
├── shared/                           # GENERIC COMPONENTS
│   └── bullet.tsx                    # Wiederverwendbar
└── ...
```

**CSS-Struktur in v_figma**:
```
src/styles/components/
├── shared/
│   ├── bullet.css                   # Generic patterns
│   ├── navigation.css
│   └── ...
├── content-sections/
│   ├── akronym.css                  # Section-specific
│   ├── programm.css
│   └── ...
└── ...
```

---

## 3. Mapping: AKSEP-NEU → Zielstruktur

### Was existiert schon in AKSEP-NEU:
- ✅ `content-sections.css` (Styles vorhanden!)
- ✅ `startpage.ts` Data (alles strukturiert!)
- ✅ `start.tsx` Content (aber monolithisch in einem File!)
- ✅ UI Components (Button, Card, Icon) in `components/ui/`
- ✅ `shared.css` (aber minimalistisch)

### Was fehlt:
- ❌ `start-sections.tsx` ORCHESTRATOR
- ❌ `start-sections/` Ordner mit Sub-Components
  - `AkronymSection.tsx` (Säulen)
  - `ProgrammSection.tsx` (Programm-Highlights)
  - `NewsSection.tsx` (Nachrichten)
  - `ParticipationSection.tsx` (Mitglied/Mitmachen/Unterstützen)
- ❌ `shared/bullet.tsx` Component

### Rename-Plan:
1. `page-placeholder.tsx` → `not-found.tsx`
   - `src/content/page-placeholder.tsx` → `src/content/not-found.tsx`
   - `src/styles/content/` entsprechend umbenennen
   - Alle Imports aktualisieren (App.tsx, router.tsx, etc.)

---

## 4. Modularisierungs-Map

### Struktur für Start-Page:

**start.tsx (aktuell monolithisch) sollte werden:**

```tsx
// src/content/start.tsx
import HeroSection from '../components/hero-section';
import StartSections from '../components/start-sections';

const StartPageContent = () => {
  return (
    <>
      <HeroSection />
      <StartSections />
    </>
  );
};
```

**start-sections.tsx (ORCHESTRATOR):**
```tsx
// src/components/start-sections.tsx
import AkronymSection from './start-sections/AkronymSection';
import ProgrammSection from './start-sections/ProgrammSection';
import NewsSection from './start-sections/NewsSection';
import ParticipationSection from './start-sections/ParticipationSection';
import { startPageContent, programHighlights, newsItems } from '../data/startpage';

const StartSections = () => {
  return (
    <div className="content-page-stack">
      <AkronymSection />
      <ProgrammSection />
      <NewsSection />
      <ParticipationSection />
    </div>
  );
};

export default StartSections;
```

### Sub-Components:

**AkronymSection.tsx**:
- Säulen (Klimafreundlich, Sozialdemokratisch, etc.)
- Informationspolitik Card
- Mapping der `startPageContent.aksepDescription`
- Zugehörige CSS: `.aksep-section`, `.aksep-bullets`, etc.

**ProgrammSection.tsx**:
- Programm-Highlights Grid
- Mapping von `programHighlights`
- CTA "Vollständiges Programm"
- Zugehörige CSS: `.program-section`, `.program-grid`, etc.

**NewsSection.tsx**:
- News-Items Grid
- Mapping von `newsItems`
- CTA "Alle Pressemitteilungen"
- Zugehörige CSS: `.news-section`, `.news-grid`, etc.

**ParticipationSection.tsx**:
- 3-Column Impact Cards (Mitglied, Mitmachen, Unterstützen)
- Icons + Buttons
- Zugehörige CSS: `.participation-section`, `.impact-grid`, etc.

### Shared Components:

**bullet.tsx** (generic):
- Props: `{ marker?, label, description }`
- ClassNames: `.bullet-item`, `.bullet-marker`, `.bullet-text` (GENERIC)
- Kann in mehreren Sections wiederverwendet werden

**Evtl. weitere**:
- `Card.tsx` (falls nicht schon in `ui/card`)
- Andere Pattern-Components

---

## 5. CSS-Vererbungslogik

### Aktuell (monolithisch):
```css
/* content-sections.css - 410 Zeilen, alles gemischt */
.content-page-stack { ... }
.content-section-card { ... }
.content-heading-xl { ... }
.content-bullet-list { ... }      ← Generisch?
.content-bullet-item { ... }      ← Generisch?
/* ... viele weitere ... */
```

### Ziel (modularisiert):

**Shared Layer** (`src/styles/components/shared/`):
```css
/* shared/spacing.css */
.content-page-stack > * + * { margin-top: ... }

/* shared/containers.css */
.content-container { ... }
.content-inner-wide { ... }
.content-header { ... }

/* shared/bullet.css */
.bullet-item { ... }              ← Generisch
.bullet-marker { ... }
.bullet-text { ... }

/* shared/typography.css */
.content-heading-xl { ... }       ← Generisch
.content-description-wide { ... }
```

**Section-Specific Layers** (`src/styles/components/`):
```css
/* aksep-section.css */
.aksep-section { ... }
.aksep-bullets { ... }
.aksep-card { ... }

/* program-section.css */
.program-section { ... }
.program-grid { ... }

/* news-section.css */
.news-section { ... }
.news-grid { ... }

/* participation-section.css */
.participation-section { ... }
.impact-grid { ... }
```

**Import-Reihenfolge** (in `index.css`):
```css
@import './components/shared/spacing.css';      /* Basis */
@import './components/shared/containers.css';   /* Layout */
@import './components/shared/bullet.css';       /* Patterns */
@import './components/shared/typography.css';   /* Text */

@import './components/aksep-section.css';       /* Specifics */
@import './components/program-section.css';
@import './components/news-section.css';
@import './components/participation-section.css';
```

---

## 6. Implementation-Reihenfolge

### Phase 1: Setup & Renaming
1. ✅ `page-placeholder.tsx` → `not-found.tsx` (Content + Styles + Imports)
2. ✅ CSS-Struktur vorbereiten (Ordner erstellen)

### Phase 2: Extract & Modularize
3. ✅ `start-sections/` Ordner erstellen
4. ✅ Sub-Components extrahieren aus `start.tsx`:
   - AkronymSection
   - ProgrammSection
   - NewsSection
   - ParticipationSection
5. ✅ `start-sections.tsx` Orchestrator schreiben

### Phase 3: Shared Components
6. ✅ `shared/bullet.tsx` erstellen
7. ✅ Andere generische Patterns identifizieren

### Phase 4: CSS Refactoring
8. ✅ `content-sections.css` aufteilen:
   - `shared/spacing.css`
   - `shared/containers.css`
   - `shared/bullet.css`
   - `shared/typography.css`
   - `aksep-section.css`
   - `program-section.css`
   - `news-section.css`
   - `participation-section.css`
9. ✅ Alle Imports aktualisieren

### Phase 5: Validation
10. ✅ Build testen
11. ✅ Browser Test (localhost:3001 soll aussehen wie localhost:3000)
12. ✅ Visual Regression Check

---

## 7. Wichtige Erkenntnisse

### Was schon perfekt ist:
- ✅ Data-Layer ist bereits sauber strukturiert
- ✅ Styles haben bereits gute Klassen-Struktur
- ✅ UI-Components sind modular

### Was zu beheben ist:
- ❌ Komponenten sind monolithisch
- ❌ CSS ist monolithisch (alles in einer Datei)
- ❌ Start-Page ist nicht zerlegbar

### Strategy:
**NICHT neu schreiben, sondern reorganisieren!**
- Die Styles bleiben fast identisch
- Der HTML/JSX wird umstrukturiert
- Data bleibt wo es ist

---

## 8. Nächste Schritte

1. **Approval dieser Discovery?** Soll ich weitermachen?
2. **Renamings bestätigen?**
   - `page-placeholder.tsx` → `not-found.tsx` ✅
   - `content-sections` → `start-sections` ✅
3. **Los mit Phase 1?**

