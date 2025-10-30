# Use Cases – AKSEP Web (v0.1)

**Zweck:** Diese Datei katalogisiert alle relevanten Use Cases (UC) für die AKSEP-Webpräsenz – sowohl nutzerseitig (Besuchende, Mitglieder) als auch entwicklerseitig (Redaktion, DevOps, Entwickler:innen).  
Jeder Use Case enthält: Akteure, Ziel/Nutzen, Trigger, Vor-/Nachbedingungen, Hauptablauf, Alternativen/Fehlerfälle, Daten/UI/UX-Notizen, Akzeptanzkriterien und – soweit sinnvoll – eine Gegenüberstellung **Unsere Definition** vs. **Best Practice**.

> **Glossar/Annahmen**
> - “Light Mode” = helles Farbschema (Homophon zu “Bride-Theme”).
> - Cookies werden grundsätzlich **nicht** genutzt – **einzige Ausnahme:** persistente Themenspeicherung für Light Mode (“Bright-Cookie”).  
> - Inhalte liegen in `content/**` (MDC), Programm-Varianten existieren für *kurz/mittel/lang*.

---

## 1) Akteure

- **BES** – Besuchende (nicht angemeldet)
- **MIT** – Mitglieder (öffentlich vorgestellte Personen)
- **RED** – Redaktion (Content-Pflege via CMS/Repo)
- **DEV** – Entwickler:in (Frontend/Backend, Build)
- **ADM** – Administrator:in (Deployment, Policies)
- **TRN** – Übersetzer:in (i18n)
- **SEO** – SEO/Social Manager:in (Metadaten/Preview)
- **A11Y** – Accessibility-Reviewer:in

---

## 2) Nicht-funktionale Leitplanken (global)

| Bereich | Unsere Definition | Best Practice |
|---|---|---|
| Farbmodus | Startwert folgt `prefers-color-scheme`; ohne Angabe **Dark**. Light-Persistenz ausschließlich via `theme`-Cookie. | System-Preference respektieren (prefers-color-scheme) + User-Override persistieren; Kontrast ≥ WCAG AA, reduzierte Motion optional. |
| Cookies | **Kein Tracking**, **nur** `theme=light` (SameSite=Lax, Secure, max-age ~180d). Beim Wechsel zurück zu Dark → Cookie löschen. | Consent-Banner **nur** wenn nicht-strikt-notwendige Cookies gesetzt werden. Hier reicht i.d.R. **kein** Consent, aber Humorhinweis zulässig. |
| Performance | LCP < 2.5s, TTFB < 0.8s, CLS < 0.1; statische Auslieferung bevorzugt. | Build-Time Rendering, HTTP/2, brotli/gzip, Bildoptimierung, lazy loading, prerender kritischer Routen. |
| A11y | Vollständig tastaturnutzbar, ARIA-Rollen korrekt, Fokus-States sichtbar. | WCAG 2.2 AA, Farbsimulationstests, Skip-Links, semantische Überschriftenstruktur. |
| i18n | DE ohne Präfix, EN mit `/en/...`; `path.<lang>` mit Fallback auf DE-Slug. | URL-basierte Lokalisierung, konsistente Slugs, sprachabhängige Metadaten. |
| SEO | Saubere Titel/Descriptions, OpenGraph, Sitemap automatisch. | Strukturierte Daten (Organisation/Person/Article), konsistente Canonicals. |

---

## 3) Übersichtsmatrix (Kurzform)

> **Legende Priorität:** H=hoch, M=mittel, N=niedrig. **Status:** D=definiert, P=Platzhalter.

| ID | Titel | Akteur(e) | Ziel/Nutzen | Prio | Status |
|---|---|---|---|:--:|:--:|
| UC-THEME-01 | Dark Default & Light-Persistenz | BES | Website startet dunkel; Light-Wahl bleibt erhalten | H | D |
| UC-THEME-02 | Humor-Cookie-Banner bei Light | BES | Humorvoller Hinweis & OK | M | D |
| UC-NAV-01 | Partei-typische Navigation | BES | Intuitive Haupt-/Subnav | H | D |
| UC-ASSET-01 | Platzhalter für fehlende Bilder/Icons | DEV/RED | Lücken sichtbar halten | M | D |
| UC-STD-01 | Externe Referenzlinks zu Standardseiten | DEV/RED | Inspirations-Preview | N | D |
| UC-TERM-01 | Begriffe: Einstiegsseite mit Begründung | BES | Warum-Text verstehen | H | D |
| UC-TERM-02 | Begriffe: Kachelübersicht inkl. Highlights | BES | Schneller Zugriff | H | D |
| UC-TERM-ALINK-01 | Begriffe: Autolink erstes Vorkommen | BES/RED | Kontextuelle Verlinkung | M | D |
| UC-PROG-01 | Programm: AG-Liste + Ausklappen | BES | Themen/Chapter entdecken | H | D |
| UC-PROG-02 | Programm: Variantennavigation kurz/mittel/lang | BES | passendes Detaillevel wählen | H | D |
| UC-PROG-03 | Programm: Prev/Next (AG/Thema/Kapitel) | BES | Linear & lateral navigieren | M | D |
| UC-PROG-04 | Programm: Sprachwechsel | BES/TRN | DE/EN Wechsel | M | D |
| UC-PROG-05 | Programm: “Einfache Sprache” Toggle | BES | Barrierearme Darstellung | M | D |
| UC-ABOUT-01 | Über uns: Verein/Partei | BES | Strukturierte Infos | M | D |
| UC-ABOUT-02 | Geschichte: geschönt vs. ungeschönt | BES | Transparenz | M | D |
| UC-MEM-01 | Mitgliederprofile inkl. D&D-Stats | BES/MIT | Persönliche, humorvolle Darstellung | M | D |
| UC-MEM-02 | Mitglieder: Zitate & Peer-Beschreibung | BES/MIT | Einblicke (ausklappbar) | N | D |
| UC-CMS-01 | Redaktionsfluss (CMS/Repo) | RED | Inhalte pflegen | M | P |
| UC-A11Y-01 | A11y-Review-Gates | A11Y/DEV | Qualität sichern | M | P |
| UC-SEO-01 | Metadaten/Social-Previews | SEO/RED | Auffindbarkeit | M | P |
| UC-SRCH-01 | On-Site-Suche | BES | schneller Zugriff | N | P |
| UC-ANL-01 | Analytics ohne Cookies | ADM/SEO | Basis-KPIs | N | P |
| UC-EMBED-01 | Externe Embeds datenschutzfreundlich | BES/ADM | z.B. YouTube-Preview-Proxy | N | P |
| UC-URL-01 | Pfad-Lokalisierung & Aliasse | DEV/RED/SEO | Konsistente DE/EN Routen | M | D |
| UC-URL-02 | Cross-Locale Legacy-Slug Redirect (DE-Slug in EN-URL) | DEV/SEO | Alte Links stabil halten | M | D |
| UC-META-01 | edited-Metadatum aus Git | DEV/RED | | Letzte Änderung sichtbar | N | D |

---

## 4) Detaillierte Use Cases

### UC-THEME-01 — Dark Default & Light-Persistenz
**Akteure:** BES, DEV  
**Trigger:** Seitenaufruf.  
**Vorbedingungen:** Keine.  
**Nachbedingungen:** Theme gesetzt; optional Cookie bei Light.

**Hauptablauf (Unsere Definition)**
1. Beim App-Start wird `prefers-color-scheme` gelesen; fehlt eine Angabe, ist **Dark** aktiv.
2. Prüfe `theme`-Cookie: falls `light`, aktiviere **Light Mode**.
3. Nutzer schaltet manuell auf Light (ODER Light Mode wird auf Basis der System-Präferenzen gesetzt) → setze Cookie `theme=light; SameSite=Lax; Secure; max-age=15552000`.
4. Nutzer schaltet zurück auf Dark → lösche `theme`-Cookie.
5. UI speichert den Zustand sofort (kein Reload nötig).

**Best Practice**
- Kein harter Dark-Default: `prefers-color-scheme` als Startwert; User-Override persistieren (Cookie **oder** `localStorage`), wobei Cookie für SSR-First-Paint konsistenter ist.
- CSS-Variablen: zentrale Tokens; Light/Dark via Root-Scope togglen.

**UI/UX-Notizen**
- Umschalter gut sichtbar (Header/Toolbar).
- Kontrast ≥ 4.5:1; fokussierbare Elemente sichtbar.

**Daten**
- 1 Cookie (`theme=light`) ausschließlich für Light-Persistenz.
- SSR liest Cookie vor First Paint, um Theme-FOUC zu vermeiden.

**Akzeptanzkriterien**
- [ ] Erstaufruf ohne Cookies & System-Präferenzen != "Light" → **Dark** aktiv.  
- [ ] Light gewählt (oder als System-Default gesetzt) → Refresh → **Light** bleibt aktiv.  
- [ ] Wechsel auf Dark → Cookie entfernt.

**Dev-Hook**
- **Store:** `src/stores/prefs.ts` als Single-Source-of-Truth für Theme-State (Pinia) – SSR-kompatibel lesen/schreiben【Legacy/Ref: ALT `cookie-banner.js` nur als Inspirationsskript】.

---

### UC-THEME-02 — Humor-Cookie-Banner bei Light
**Akteure:** BES, DEV  
**Trigger:** Aktivierung **Light Mode** durch Nutzer.

**Hauptablauf (Unsere Definition)**
1. Bei Wechsel auf Light erscheint **einmalig** ein kleines Banner:  
   “Bitte aktiviere den Dark Mode, sonst verfolgt dich ein helles Cookie \u{1F36A} – [OK] [Mehr Infos]”
2. Klick auf **OK** → Banner schließt; Cookie wird dennoch gesetzt (funktional notwendig).
3. Klick auf **Mehr Infos** → kleines Info-Modal: *Warum nur beim Light Mode ein Cookie?*  
   - Transparent darlegen: rein funktionaler Cookie; bei Dark sofort gelöscht.

**Best Practice**
- Statt Banner: unaufdringlicher **Toast** + Link zur Cookie-Policy. Consent ist nicht nötig, da funktional[1].

[1] In unserem Falle egal, da der Cookie-Banner in erster Linie ein humoristisches Element sein soll und zugleich auch impliziert, dass ansonsten keinerlei weitere Cookies gespeichert werden.

**Akzeptanzkriterien**
- [ ] Banner/Toast erscheint nur **beim Umschalten** (oder Default-Setzung) auf Light, nicht bei jedem Seitenaufruf.  
- [ ] “Mehr Infos” führt zu erklärender Seite/Modal.

---

### UC-NAV-01 — Partei-typische Navigation
**Akteure:** BES, DEV/RED  
**Ziel:** Orientierung analog bekannter Partei-Sites (Die Linke, SPD), aber ohne Copy-Paste-Inhalte.

**Hauptablauf**
1. Header zeigt Primärnavigation (z.B. Start, Programm, Begriffe, Über uns, Termine, Kontakt).  
2. Sekundärnavigation kontextabhängig (Programm):
   Reihenfolge & Aktivelemente basieren auf `ag_id` → `thema_id` → `kapitel_id`. 
3. Falls an Positionen üblicherweise Icons/Bilder erscheinen, aber noch fehlen: **Platzhalter-Assets** (TXT/MD) im Assets-Ordner.

**Best Practice**
- Mega-Menü für tiefe Hierarchien; Breadcrumbs ab Ebene ≥2.

**Dev-Hints**
- Komponenten-Basis vorhanden (`AppHeader.vue`, `AppFooter.vue`)【Repo: `src/components/AppHeader.vue`, `AppFooter.vue`】.

---

### UC-ASSET-01 — Platzhalterdateien für fehlende Bilder/Icons
**Akteure:** DEV/RED

**Hauptablauf**
1. Für erwartete, aber noch nicht vorhandene Assets werden **Platzhalter** abgelegt (`.md`/`.txt`), die Zweck/Quelle erklären.
2. Verzeichnisstruktur unter `src/assets/images/placeholders/` nutzen.
3. Build-Skript/CI kann auf “Platzhalter verblieben?” prüfen (optional).

**Best Practice**
- Zusätzlich Storybook/Docseite “Asset Debt” generieren.

---

### UC-STD-01 — Externe Referenzlinks zu Standardseiten
**Akteure:** DEV/RED  
**Ziel:** Beim Prototyping auf gleichnamige Seiten etablierter Parteien **verlinken** (nur Vorschau/Inspirationszweck).

**Hauptablauf**
1. In “Standardseiten” (Impressum, Datenschutz, Presse, etc.) werden im Preview-Modus externe Referenzen verlinkt.  
2. Beim finalen Launch werden diese Links entfernt/ersetzt.

**Best Practice**
- Markierung “Nur Preview” klar sichtbar.
- Technische Absicherung: Links werden nur in `process.dev === true` oder bei `VITE_PREVIEW_MODE=1` gerendert.

---

### UC-TERM-01 — Begriffe: Startseite mit Begründung
**Akteure:** BES/RED  
**Ziel:** Ein ausführlicher einleitender Text erklärt, **warum** einheitliche Begriffsdefinitionen wichtig sind, um Diskussions-Fehlverständnisse zu vermeiden.

**Hauptablauf**
1. `/begriffe` lädt Intro-Text (MDC) + Kachel-Grid.  
2. Oben: “wichtigste Begriffe” (Frontmatter `highlighted: true` in `content/begriffe/_terms/*.mdc`).
   Fallback: ohne Flag werden Begriffe alphabetisch einsortiert.
3. Darunter: alle übrigen Begriffe alphabetisch.

**Dev-Hints**
- Inhalte liegen unter `content/begriffe/**` inkl. `_terms/*.mdc`.

**Best Practice**
- Tagging (Themenfelder), Suchfeld/Filter, Autolink-Komponente (existiert: `TermHint.vue`).

**Akzeptanz**
- [ ] “highlighted” Begriffe werden visuell priorisiert (erste Zeile Kacheln).

---

### UC-TERM-02 — Kachel-Navigation zu Begriffsdefinitionen
**Akteure:** BES  
**Ablauf**
1. Kachel klickt → Route `/begriffe/<slug>` mit Definition (MDC).  
2. Verwandte Begriffe als Chips (Auto-Link/Backlinks).

**Best Practice**
- Responsive Flex/Grid; Fokusreihenfolge logisch.

**Akzeptanz**
- [ ] Kacheln sind per Tastatur erreichbar (Tab-Order), Fokus sichtbar, ARIA-Label = Begriffstitel.

---

### UC-TERM-ALINK-01 — Autolink erster Begriffsvorkommen
**Akteure:** BES/RED  
**Hauptablauf**
1. Beim Rendern wird das **erste Auftreten** eines Begriffs verlinkt (Tooltip + Link zur Definition).
2. Per Frontmatter `autolink: false` auf Seiten- oder Begriffs-Ebene abschaltbar.

**Akzeptanz**
- [ ] Pro Seite wird jeder definierte Begriff höchstens **einmal** automatisch verlinkt.
- [ ] Kein Autolink in Überschriften oder Code-Blöcken.

**Technik-Hinweis**
- Modul `modules/glossary-autolink.ts` verlinkt Begriffe, `autolink: false` deaktiviert.

---

### UC-PROG-01 — Programm: AG-Liste + Ausklappnavi
**Akteure:** BES/RED  
**Ziel:** Auf Programm-Startseite alle **AGs** anzeigen; je AG Themen ausklappbar; je Thema Kapitel.

**Hauptablauf (Unsere Definition)**
1. Seite `/programm` listet AGs.  
2. Klick auf AG → Themenliste der AG (Akkordeon).  
3. Klick auf Thema → Kapitel/Varianten wählbar.

**Dev-Hints**
- Inhalte unter `content/programm/**` vorhanden (u.a. AG-Unterordner und Kapitel-MDCs).
- Tooling: `scripts/check-missing-variants.mjs` kann Vollständigkeit prüfen.

**Best Practice**
- Client-seitige Suche/Filter (AG/Topic/Chapter), Deep-Link auf spezifische Kapitel.

---

### UC-PROG-02 — Varianten-Navigation (kurz/mittel/lang)
**Akteure:** BES  
**Ziel:** Nutzende wählen Informationsdichte.

**Hauptablauf**
1. Auf Thema/Kapitel-Seiten sind Varianten **kurz/mittel/lang** anwählbar (Toolbar oder Tabs).  
2. Router-Pfade existieren bereits (Deep-Linking in "lang"):
  - `src/pages/programm/kurz/[ag].vue` (kurz, AG-Ebene)  
  - `src/pages/programm/mittel/[ag]/[thema].vue`  
  - `src/pages/programm/lang/[ag]/[thema].vue#<kapitel>`
3. UI-Komponenten zur Variantenauswahl wie `VariantToolbar.vue` und `Variant.vue` nutzen.

**Best Practice**
- Persistiere letzte Variantenwahl im Store (nicht zwingend persistiert).

**Akzeptanz**
- [ ] Direkter Link auf beliebige Variante lädt korrekte Ansicht.  
- [ ] Wechseln zwischen Varianten verändert nur Content-Container, nicht die ganze Seite.

---

### UC-PROG-03 — Prev/Next-Navigation (AG/Thema/Kapitel)
**Akteure:** BES  
**Ablauf**
1. Oben links am Content-Container: “Zur **vorherigen AG**”, darunter “vorheriges **Thema**”, darunter “vorheriges **Kapitel**” (je nach Variante ausblenden: *kurz* → kein Kapitel/Thema; *mittel* → kein Kapitel).  
2. Unten rechts analog **nächste** AG/Thema/Kapitel.

**Best Practice**
- Breadcrumb + Inhaltsverzeichnis (TOC) für lange Kapitel; Tastaturkürzel ←/→.

**Akzeptanz**
- [ ] Korrekte Kontext-sensitive Sichtbarkeit der drei Ebenen.  
- [ ] Zyklisch? Entscheidung: **Nein** (am Anfang/Ende disabled).
- [ ] Reihenfolge basiert strikt auf `ag_id` → `thema_id` → `kapitel_id` (Integer).

---

### UC-PROG-04 — Sprachwechsel (DE/EN)
**Akteure:** BES/TRN  
**Ablauf**
1. Sprachumschalter an üblicher Stelle (Header oder Content-Toolbar).  
2. Wechsel erhält Kontext (AG/Thema/Kapitel).  
3. i18n-Dateien: `src/locales/de.json`, `src/locales/en.json` vorhanden.

**Best Practice**
- `hreflang`, Sprach-Route, Fallback-Strategie (falls Übersetzung fehlt → Default DE).

**Akzeptanz**
- [ ] DE hat **kein** Sprachpräfix: `/programm/...`
- [ ] EN hat **Präfix**: `/en/program/...`
- [ ] Falls `path.en` fehlt, wird der **deutsche** Slug als Fallback verwendet.

---

### UC-PROG-05 — “Einfache Sprache”-Ansicht
**Akteure:** BES  
**Ablauf**
1. Toggle an Content-Container (z.B. oben rechts).  
2. Umschalten lädt “Leichte Sprache”-Variante der Inhalte (wenn vorhanden), sonst Plain-Transformation (z.B. Glossar-Tooltips/Erklärboxen).

**Best Practice**
- Lesbarkeitsregeln (Kurze Sätze, aktive Sprache), optional `aria-expanded` für ein-/ausklappbare Erklärungen.

---

### UC-ABOUT-01 — Über uns: Verein/Partei
**Akteure:** BES/RED  
**Ablauf**
1. Eine "Über-Uns"-Page für **Verein** (Struktur & Ziele); Später, sobald wir eine tatsächliche Partei sind, wird die Page zu "Partei" umbenannt und "Verein" zu einem Redirect umfunktioniert.  
2. Redaktionsfähig via MDC.

**Best Practice**
- Strukturierte Daten: `Organization`.

**Akzeptanz**
- [ ] Sobald der Partei-Status gegeben ist, wird `/ueber-uns` → `/partei` migriert;

---

### UC-ABOUT-02 — Geschichte: “geschönt” vs. “ungeschönt”
**Akteure:** BES/RED  
**Ablauf**
1. "Über-Uns"-Page mit Titel "Geschichte" lädt per Default eine **geschönte** Version, wie man sie üblicherweise kennt.  
2. Umschalter “zeige ehrliche Version” zeigt ebenso Fehler, Fehleinschätzungen & Fails, die in der Vergangenheit begangen wurden (Transparenz).

**Best Practice**
- Toggle-URL-Param (`?raw=1`) für direktes Verlinken.

---

### UC-MEM-01 — Mitgliederprofile inkl. D&D-Stats
**Akteure:** MIT/RED/BES  
**Ziel:** Menschlich, humorvoll, individuell.

**Hauptablauf (Unsere Definition)**
1. Jedes Mitglied: Portraitbild, D&D-Stats **STR/CON/DEX/WIS/INT/CHA** (Skala 0–20, **>20 erlaubt**, Default-Max 20).  
2. Optional: Klasse (z.B. Druide/Barde), “Items, die man immer dabei hat”, "Traits", etc..  
3. Öffentliche Anzeige nur bei Opt-in der Person.

**Best Practice**
- Tooltips erklären Skalenhumor.

**Akzeptanz**
- [ ] Jede Stat ist Integer (0–20 regulär, >20 erlaubt bis max. 30 mit Hinweis-Icon).
- [ ] Fehlende Stats → neutraler Platzhalterwert (z. B. "—").

---

### UC-MEM-02 — Zitate & Peer-Beschreibungen (ausklappbar)
**Akteure:** MIT/BES  
**Ablauf**
1. Zitate des Mitglieds und kurze Peer-Kommentare in **ausklappbaren** Sektionen.  
2. Standard-Set vorhanden (z.B. “So würde ich mich beschreiben”, “So sehen mich andere”); optionale Sets zuschaltbar.

**Best Practice**
- Moderationsflag (RED prüft Inhalt vor Freischaltung).

---

### UC-CMS-01 — Redaktionsfluss (Platzhalter)
**Akteure:** RED/ADM  
**Unsere Definition (Platzhalter)**
- Inhalte via Repo-PRs **oder** Headless-CMS (z.B. vorhandenes `/public/admin/` Setup prüfen).
- Rollen: Redakteur:in (erstellen/ändern), Review (Freigabe).

**Best Practice**
- Decap CMS mit `/public/admin/index.html` + `/public/admin/config.yml`,
  `media_folder: "public/uploads"`, `public_folder: "/uploads"`,
  Branch-Workflow (Review), Preview Builds pro PR.

**Akzeptanz**
- [ ] `/admin` ist erreichbar; Uploads landen unter `/public/uploads`.
- [ ] Editor-Collections existieren für `content/begriffe/_terms` und `content/programm/**`.

**Offen**
- Finales CMS-Tool bestätigen; Editor-Felder für Begriffe/Programm modellieren.

---

### UC-A11Y-01 — Accessibility-Gates (Platzhalter)
**Akteure:** A11Y/DEV  
**Unsere Definition**
- Checkliste pro PR (Keyboard-Navigation, Kontraste, Headings, Labels, ALT-Texte).
- CI-Check mit Lighthouse/axe (Budget).

**Best Practice**
- Manuelle Tests mit Screenreader (NVDA/VoiceOver), “Reduced Motion” unterstützen.

**Akzeptanz**
- [ ] Pro Seite genau **ein** H1 (auf `_index.mdc`), Kapitel beginnen mit **H2**.
- [ ] Ein globaler “Skip to content”-Link ist vorhanden und fokussierbar.

---

### UC-SEO-01 — SEO/Social (Platzhalter)
**Akteure:** SEO/RED  
**Unsere Definition**
- Titel/Description pro Seite; OpenGraph (`og:image` vorhanden: `public/og-image.png`), Sitemap automatisch (`/server/routes/sitemap.xml.ts`).

**Best Practice**
- Strukturierte Daten (FAQ/Article), Preview-Links validieren.

**Akzeptanz**
- [ ] Pro Seite `link rel="canonical"` konsistent mit Varianten-URL.
- [ ] `hreflang`-Paare zwischen DE (ohne Präfix) und EN (`/en/...`) vorhanden.

---

### UC-SRCH-01 — On-Site-Suche (Platzhalter)
**Akteure:** BES  
**Unsere Definition**
- Volltextsuche über Begriffe sowie Programm (kurz/mittel/lang, Kapitel).

**Best Practice**
- Statischer Index (Stork/FlexSearch) clientseitig; DSGVO-frei.

**Akzeptanz**
- [ ] Build erzeugt `public/search-index.json` aus `content/**` (inkl. IDs/Slugs).
- [ ] Client durchsucht offline (keine externen Calls).

---

### UC-ANL-01 — Analytics ohne Cookies (Platzhalter)
**Akteure:** ADM/SEO  
**Unsere Definition**
- Privacy-first (ohne Cookies, ohne Fingerprinting, ohne Cross-Site-Beacons).

**Best Practice**
- Plausible/Umami im Self-Host, anonymisiert, ohne Cookies.

**Akzeptanz**
- [ ] Keine Cookies/LocalStorage für Analytics.
- [ ] IPs werden nur gekürzt/aggregiert verarbeitet (falls überhaupt).

---

### UC-EMBED-01 — Externe Embeds datenschutzfreundlich (Platzhalter)
**Akteure:** BES/ADM  
**Unsere Definition**
- Externe Medien (YouTube etc.) erst nach Klick laden (“2-Klick”).

**Best Practice**
- Preview-Proxy-Bilder, `sandbox`/`referrerpolicy` streng.

**Akzeptanz**
- [ ] Vor dem Klick wird **kein** externer Request abgesetzt.
- [ ] Nach Klick werden `sandbox`, `allow`, `referrerpolicy` restriktiv gesetzt.

---

### UC-URL-01 — Pfad-Lokalisierung & Aliasse
**Akteure:** DEV/RED/SEO  
**Ziel:** Lokalisierte Pfade ohne Dubletten; Fallback auf DE-Slugs.

**Hauptablauf**
1. `_dir.yml` kann `path.en` setzen (AG-/Themen-Ebene).
2. Fehlt `path.en`, nutzt EN-Route den **deutschen** Slug.
3. Modul erzeugt passende **Aliases**, damit /en/... erreichbar ist.

**Akzeptanz**
- [ ] `/programm/...` (DE, ohne Präfix) und `/en/program/...` (EN) funktionieren.
- [ ] Mit gesetztem `path.en` weicht das Segment ab; ohne `path.en` = DE-Slug.

**Technik-Hinweis**
- Modul `modules/content-aliases.ts` erzeugt Aliasse und Redirect-Mapping.

---

### UC-URL-02 — Cross-Locale Legacy-Slug Redirect (DE-Slug in EN-URL)

**Akteure:** DEV/SEO  
**Ziel/Nutzen:** Stabilität alter externer Links sicherstellen, wenn für eine Route nachträglich `path.en` definiert oder geändert wird.

**Beispiel/Trigger:**
- Ein Nutzer ruft später eine alte EN-URL auf, in der ein Segment noch den **deutschen** Platzhalter-Slug trägt:
  `/en/program/medium/ag-health/ernaehrungsempfehlungen`
- Inzwischen existiert für das Themen-Segment ein spezifischer **EN-Slug**:
  `dietary-recommendations`

**Hauptablauf (Unsere Definition):**
1. Erkennen, dass die angefragte EN-Route ein **DE-Slug**-Segment enthält trotz verfügbarem lang.en.
2. Berechnen der **aktuellen** EN-Zielroute mit `path.en`-Segmenten.
3. **Redirect (301)** auf die korrekte EN-URL:
   `/en/program/medium/ag-health/dietary-recommendations`

**Alternativen/Fehlerfälle:**
- Falls kein passendes Mapping ermittelbar ist → Standard-404 (oder Fallback-Seite, policy-abhängig).

**Daten / UI / UX:**
- Query-Parameter und Hash (z. B. `#<kapitel_id>`) werden **unverändert** übernommen.
- Logging des Redirect-Ereignisses (z. B. für SEO-Monitoring).

**Akzeptanzkriterien:**
- [ ] Aufruf von `/en/program/medium/ag-health/ernaehrungsempfehlungen` → **301** zu `/en/program/medium/ag-health/dietary-recommendations`
- [ ] Vorhandene `?query` und `#hash` bleiben erhalten.
- [ ] Redirects greifen **nur**, wenn `path.en` heute gesetzt ist und sich vom DE-Slug unterscheidet.

**Technik-Hinweise:**
- Beispiele mit path.en gilt analog für ALLE path.(lang) ausser path.de
- Implementierung in `modules/content-aliases.ts`

---

### UC-META-01 — edited-Metadatum aus Git
**Akteure:** DEV/RED  
**Hauptablauf**
1. Falls `edited` im Frontmatter gesetzt ist → nutzen.
2. Sonst setzt Build-Hook (`git log -1 --pretty=%cI`) das Datum.

**Akzeptanz**
- [ ] Jede Seite/Kapitel hat ein `edited`-Datum (Frontmatter oder Git).
- [ ] Datum ist im Format `YYYY-MM-DD`.

**Technik-Hinweis**
- Build-Hook `modules/content-edited-git.ts` ergänzt `edited_git`.

---

## 5) Entwickler-Hilfen & technische Notizen

- **Theme-Implementierung:**  
  - State in `src/stores/prefs.ts` (SSR-kompatibel lesen/schreiben)【Ref vorhanden】.  
  - CSS-Tokens (Root): `:root{--color-bg:...}`; `html[data-theme="dark"|"light"]`.

- **Varianten/Programm:**  
  - Routing ist vorhanden (`/programm/kurz|mittel|lang/...`)【Ref vorhanden】; `VariantToolbar.vue` als UI-Einstieg.

- **Inhalte & Autolinks:**  
  - Begriffe unter `content/begriffe/_terms/*.mdc`; Autolink-Komponente `TermHint.vue`.

- **Assets/Platzhalter:**  
  - `src/assets/images/placeholders` verwenden, TXT/MD-Dateien als Erklärmarker zulässig.

- **Sitemap/SEO:**  
  - `server/routes/sitemap.xml.ts` generiert dynamisch.

---

## 6) Offene Punkte / To-Do

- [ ] Finales CMS-Setup (Bestätigung Netlify/Decap; Felder modellieren).  
- [ ] A11y-Budget & CI-Checks.  
- [ ] Einfache-Sprache-Varianten definieren (Inhalt/Transformationsregeln).  
- [ ] On-Site-Suche Architektur.  
- [ ] Analytics-Variante festlegen.  
- [ ] Externe Referenzlinks-Liste (für “Standardseiten”-Inspiration).  
- [ ] Humor-Texte für Cookie-Toast formulieren (Ton: freundlich, transparent).  

---

## 7) Änderungslog
- v0.1 (Erstfassung): Struktur & Kern-Use-Cases angelegt.
