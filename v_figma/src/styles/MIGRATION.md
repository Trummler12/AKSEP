# Migration Guide: Von Tailwind-Utilities zu CSS-Klassen

## Übersicht

Dieses Dokument beschreibt den Prozess zur Migration von den atomaren Tailwind-Klassen zu unseren monolithischen CSS-Klassen.

## Status

- ✅ **Phase 1**: Ordnerstruktur erstellt
- ✅ **Phase 2**: globals.css und themes.css gefüllt
- ✅ **Phase 3**: CSS-Klassen definiert
- ⏳ **Phase 4**: TSX-Dateien migrieren (aktuell)
- ⏳ **Phase 5**: Tests und Feintuning

---

## Migrations-Mapping

### Navigation (`/components/navigation.tsx`)

#### Header-Container
```tsx
// ALT:
<header className="bg-card border-b border-border sticky top-0 z-50">

// NEU:
<header className="nav-header">
```

#### Logo-Link
```tsx
// ALT:
<a href="/" className="flex items-center space-x-3 mr-8 hover:opacity-80 transition-opacity">

// NEU:
<a href="/" className="nav-logo-link">
```

#### Logo-Bild
```tsx
// ALT:
<img src={logo} className="h-10 w-10" />

// NEU:
<img src={logo} className="nav-logo-image" />
```

#### Logo-Text
```tsx
// ALT:
<span className="text-xl whitespace-nowrap">

// NEU:
<span className="nav-logo-text">
```

#### Desktop-Navigation
```tsx
// ALT:
<nav className="hidden lg:flex items-center space-x-6 flex-1">

// NEU:
<nav className="nav-desktop">
```

#### Dropdown-Wrapper
```tsx
// ALT:
<div className="relative">

// NEU:
<div className="nav-dropdown-wrapper">
```

#### Dropdown-Trigger
```tsx
// ALT:
<a href="/begriffe" className="flex items-center space-x-1 text-foreground hover:text-primary transition-colors whitespace-nowrap">

// NEU:
<a href="/begriffe" className="nav-dropdown-trigger">
```

#### Dropdown-Content
```tsx
// ALT:
<div className="absolute top-full left-0 mt-1 w-64 bg-card border border-border rounded-md shadow-lg py-2 z-50">

// NEU:
<div className="nav-dropdown-content">
```

#### Dropdown-Item
```tsx
// ALT:
<a className="block px-4 py-2 text-sm text-foreground hover:bg-muted hover:text-primary transition-colors">

// NEU:
<a className="nav-dropdown-item">
```

#### Mobile Menu Toggle
```tsx
// ALT:
<button className="lg:hidden ml-auto">

// NEU:
<button className="nav-mobile-toggle">
```

#### Mobile Menu
```tsx
// ALT:
<div className="lg:hidden border-t border-border bg-card">

// NEU:
<div className="nav-mobile-menu">
```

---

### Footer (`/components/footer.tsx`)

#### Footer-Container
```tsx
// ALT:
<footer className="bg-card border-t border-border">

// NEU:
<footer className="footer-main">
```

#### Footer-Grid
```tsx
// ALT:
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">

// NEU:
<div className="footer-grid">
```

#### Logo-Wrapper
```tsx
// ALT:
<div className="flex items-center space-x-3 mb-4">

// NEU:
<div className="footer-logo-wrapper">
```

#### Contact-Item
```tsx
// ALT:
<div className="flex items-center space-x-2 text-muted-foreground">

// NEU:
<div className="footer-contact-item">
```

#### Social-Links
```tsx
// ALT:
<div className="flex space-x-3">

// NEU:
<div className="footer-social-links">
```

---

### Hero-Section (`/components/hero-section.tsx`)

#### Hero-Section
```tsx
// ALT:
<section className="relative bg-gradient-to-b from-background to-card py-20 lg:py-32">

// NEU:
<section className="hero-section">
```

#### Logo-Title-Wrapper
```tsx
// ALT:
<div className="flex items-center justify-center space-x-4 mb-8">

// NEU:
<div className="hero-logo-title-wrapper">
```

#### Title
```tsx
// ALT:
<h1 className="text-4xl lg:text-6xl mb-2 bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">

// NEU:
<h1 className="hero-title">
```

#### Features-Grid
```tsx
// ALT:
<div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">

// NEU:
<div className="hero-features-grid">
```

#### Feature-Icon-Wrapper
```tsx
// ALT:
<div className="bg-primary/20 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">

// NEU:
<div className="hero-feature-icon-wrapper">
```

---

### Content-Sections (`/components/content-sections.tsx`)

#### About-Section
```tsx
// ALT:
<section className="py-20 bg-card">

// NEU:
<section className="akronym-section">
```

#### Programm-Section
```tsx
// ALT:
<section className="py-20">

// NEU:
<section className="programm-section">
```

#### Programm-Grid
```tsx
// ALT:
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

// NEU:
<div className="programm-grid">
```

#### News-Section
```tsx
// ALT:
<section className="py-20 bg-card">

// NEU:
<section className="aktuelles-section">
```

#### CTA-Section
```tsx
// ALT:
<section className="py-20">

// NEU:
<section className="mitmachen-section">
```

---

### Page-Placeholder (`/components/page-placeholder.tsx`)

#### Wrapper
```tsx
// ALT:
<div className="min-h-screen bg-background text-foreground dark flex items-center justify-center">

// NEU:
<div className="placeholder-wrapper">
```

#### Content
```tsx
// ALT:
<div className="max-w-md mx-auto text-center px-4">

// NEU:
<div className="placeholder-content">
```

#### Icon-Wrapper
```tsx
// ALT:
<div className="bg-primary/20 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">

// NEU:
<div className="placeholder-icon-wrapper">
```

---

## Migrations-Prozess

### Schritt 1: Import hinzufügen
Stelle sicher, dass `index.css` importiert wird:
```tsx
// In App.tsx oder main entry point
import './styles/index.css';
```

### Schritt 2: Komponente für Komponente migrieren
Gehe systematisch durch jede .tsx-Datei:

1. Öffne die Komponenten-Datei
2. Öffne die zugehörige CSS-Datei
3. Ersetze jedes `className` mit der neuen Klasse (siehe Kommentare in CSS)
4. Teste die Komponente visuell
5. Commit die Änderungen

### Schritt 3: Tailwind-Utilities entfernen
Nach erfolgreicher Migration können die alten Tailwind-Utilities aus dem Markup entfernt werden.

### Schritt 4: Testing
- Visueller Test in verschiedenen Breakpoints
- Browser-Kompatibilität prüfen
- Performance messen

---

## Reihenfolge der Migration

1. ✅ **Vorbereitun**: Styles-Architektur (abgeschlossen)
2. ⏳ **App.tsx**: Haupt-Container (nächster Schritt)
3. ⏳ **Navigation**: Komplexeste Komponente zuerst
4. ⏳ **Hero-Section**: Gradient-Tests
5. ⏳ **Content-Sections**: Vier Sektionen einzeln
6. ⏳ **Footer**: Relativ einfach
7. ⏳ **Page-Placeholder**: Simpelste Komponente
8. ⏳ **Andere Seiten**: Nach Bedarf

---

## Häufige Muster

### Flex mit Gap
```tsx
// ALT: space-x-3
// NEU: gap in CSS definiert

// ALT:
<div className="flex items-center space-x-3">

// NEU:
<div className="nav-logo-wrapper">  // mit gap: 0.75rem in CSS
```

### Responsive Breakpoints
```tsx
// ALT: hidden lg:flex
// NEU: Media Queries in CSS

// ALT:
<nav className="hidden lg:flex items-center">

// NEU:
<nav className="nav-desktop">  // mit @media in CSS
```

### Hover-States
```tsx
// ALT: hover:text-primary transition-colors
// NEU: :hover Pseudo-Klasse in CSS

// ALT:
<a className="text-foreground hover:text-primary transition-colors">

// NEU:
<a className="nav-dropdown-trigger">  // mit :hover in CSS
```

---

## Checklist vor dem Commit

- [ ] Alle classNames in der Komponente ersetzt
- [ ] Visuell getestet (Desktop & Mobile)
- [ ] Hover-States funktionieren
- [ ] Keine Console-Errors
- [ ] CSS-Klasse in korrektem File
- [ ] Kommentar über CSS-Klasse vorhanden
- [ ] Import-Pfade korrekt

---

## Troubleshooting

### Problem: Styles werden nicht angewendet
- **Lösung**: Prüfe Import-Hierarchie in den CSS-Dateien
- **Lösung**: Stelle sicher, dass `index.css` importiert wird

### Problem: Responsive Breakpoints funktionieren nicht
- **Lösung**: Prüfe @media Queries in CSS
- **Lösung**: Browser-Cache leeren

### Problem: Hover-States fehlen
- **Lösung**: Prüfe :hover Pseudo-Klassen in CSS
- **Lösung**: Specificity-Problem? Wichtigkeit erhöhen

### Problem: Gradient funktioniert nicht
- **Lösung**: Browser-Präfixe für `background-clip: text` hinzufügen
- **Lösung**: `-webkit-` Präfixe verwenden

---

## Nach der Migration

### Cleanup
1. Alte `src/index.css` überprüfen (falls vorhanden)
2. Ungenutzte Tailwind-Utilities entfernen
3. Dokumentation aktualisieren

### Optimierung
1. CSS-Größe messen
2. Unused CSS identifizieren
3. Performance-Tests durchführen

### Dokumentation
1. README aktualisieren
2. Komponentendokumentation erweitern
3. Styleguide erstellen (optional)

---

Viel Erfolg bei der Migration! 🚀
