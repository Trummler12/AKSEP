# AKSEP Styles-Architektur

## Übersicht

Diese modulare CSS-Architektur wurde erstellt, um die wartungsunfreundlichen, atomaren Tailwind-Klassen durch sinnvolle, monolithisch definierte CSS-Klassen zu ersetzen.

## Ordnerstruktur

```
styles/
├── globals.css              # Globale Variablen (Farben, Textgrößen, Spacing, etc.)
├── themes.css               # Theme-Zuweisungen (Dark Mode, Kontext-Themes)
├── index.css                # Haupteinstiegspunkt - importiert alle anderen Styles
├── README.md                # Diese Dokumentation
│
├── components/
│   ├── .shared.css          # Gemeinsame Component-Styles
│   ├── navigation.css       # Navigation-Komponente
│   ├── footer.css           # Footer-Komponente
│   ├── hero.css             # Hero-Section-Komponente
│   │
│   ├── content-sections/
│   │   ├── .shared.css      # Gemeinsame Content-Section-Styles
│   │   ├── akronym.css      # "Was bedeutet AKSEP?" Sektion
│   │   ├── aktuelles.css    # News/Aktuelles Sektion
│   │   ├── mitmachen.css    # Call-to-Action Sektion
│   │   └── programm.css     # Programm-Highlights Sektion
│   │
│   └── ui/
│       ├── .shared.css      # Gemeinsame UI-Element-Styles
│       ├── button.css       # Button-Styles (meist ShadCN)
│       ├── dropdown.css     # Dropdown-Styles
│       └── table.css        # Table-Styles
│
└── pages/
    ├── .shared.css          # Gemeinsame Page-Styles
    ├── placeholder.css      # Platzhalter-Seiten
    └── start.css            # Startseite
```

## Vererbungshierarchie

```
globals.css
  └── themes.css
      ├── components/.shared.css
      │   ├── navigation.css
      │   ├── footer.css
      │   ├── hero.css
      │   ├── content-sections/.shared.css
      │   │   ├── akronym.css
      │   │   ├── aktuelles.css
      │   │   ├── mitmachen.css
      │   │   └── programm.css
      │   └── ui/.shared.css
      │       ├── button.css
      │       ├── dropdown.css
      │       └── table.css
      └── pages/.shared.css
          ├── placeholder.css
          └── start.css
```

## Variablen-System

### globals.css
Definiert alle grundlegenden Konstanten:
- **Farbpalette**: `--color-true-lavender`, `--color-horizon`, `--color-mint`, etc.
- **Textgrößen**: `--text-xs` bis `--text-6xl`
- **Spacing**: `--spacing-xs` bis `--spacing-3xl`
- **Border-Radien**: `--radius-sm` bis `--radius-full`
- **Transitions**: `--transition-fast`, `--transition-base`, `--transition-slow`
- **Shadows**: `--shadow-sm` bis `--shadow-xl`
- **Z-Index**: `--z-base` bis `--z-tooltip`

### themes.css
Weist die Variablen semantischen Themes zu:
- `:root` / `.dark` - Standard Dark Mode
- `.on-dark` / `.on-light` - Kontext-Themes
- `.on-bg-darker`, `.on-bg-darkerst`, etc. - Farb-spezifische Kontexte

## CSS-Klassen-Benennungskonvention

Jede CSS-Klasse folgt diesem Muster:
```
[komponente]-[element]-[variante]
```

Beispiele:
- `nav-header` - Navigation Header
- `nav-logo-link` - Logo-Link in Navigation
- `nav-dropdown-content` - Dropdown-Content
- `footer-contact-item` - Contact Item im Footer
- `hero-feature-icon-wrapper` - Icon Wrapper in Hero Features

## Kommentar-Format

Jede CSS-Klasse hat einen Kommentar im folgenden Format:
```css
/* [klassenname] | "[original-tailwind-classes]" | [Beschreibung] */
.klassenname {
  /* ... styles ... */
}
```

Beispiel:
```css
/* nav-logo-link | "flex items-center space-x-3 mr-8 hover:opacity-80 transition-opacity" | Logo-Link mit Hover-Effekt */
.nav-logo-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-right: 2rem;
  transition: opacity var(--transition-base);
}
```

## Nächste Schritte

### Phase 1: ✅ Abgeschlossen
- Ordnerstruktur erstellt
- globals.css und themes.css mit Variablen gefüllt
- Alle CSS-Klassen für bestehende Komponenten erstellt

### Phase 2: Noch ausstehend
- TSX-Dateien durchgehen und `className` durch neue Klassen ersetzen
- Testen der neuen Styles
- Feintuning und Anpassungen

### Phase 3: Zukünftig
- Light Mode implementieren
- Weitere Seiten hinzufügen (Begriffe, Programm-Unterseiten, etc.)
- Responsive Optimierungen

## Verwendung

### In React-Komponenten
Importiere die zentrale index.css in deiner App:
```tsx
import './styles/index.css';
```

Verwende dann die definierten Klassen:
```tsx
<header className="nav-header">
  <div className="nav-header-container">
    <div className="nav-header-content">
      <a href="/" className="nav-logo-link">
        <img src={logo} className="nav-logo-image" />
        <span className="nav-logo-text">DIE AKSEP</span>
      </a>
    </div>
  </div>
</header>
```

## Vorteile dieser Architektur

1. **Wartbarkeit**: Jede Klasse hat einen klaren Zweck und ist zentral definiert
2. **Lesbarkeit**: Klassennamen sind selbsterklärend
3. **Wiederverwendbarkeit**: Gemeinsame Styles in .shared.css Dateien
4. **Flexibilität**: Einfache Anpassungen durch Variablen-System
5. **Performance**: Reduzierte CSS-Größe durch Vermeidung von Duplikaten
6. **Dokumentation**: Kommentare erklären Zweck und Herkunft jeder Klasse

## Farbschema

- **Primary (True Lavender)**: `#7E65B9` - Primärfarbe dunkel
- **Secondary (Horizon)**: `#5A8FA8` - Mittelfarbe
- **Accent (Mint)**: `#3EB694` - Helle Primärfarbe
- **Background Darker**: `#322A45` - Dunklerer Hintergrund
- **Background Darkerst**: `#423A51` - Noch dunklerer Hintergrund/Cards

## Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

## Support

Bei Fragen oder Problemen bitte die Dokumentation konsultieren oder im Team nachfragen.

---

Erstellt: Oktober 2024  
Autor: AKSEP Development Team  
Version: 1.0
