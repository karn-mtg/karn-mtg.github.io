---
title: Karn Forge v1.0.0
description: Das erste vollständige Release von Karn Forge ist da — vom KI-Chat-Panel über Canvas-Widgets und Sammlungsverwaltung bis hin zum neuen chat-controller MCP.
date: '2026-06-27'
author: karn-team
tags: ['release', 'forge', 'v1.0.0']
lang: de
---

# Karn Forge v1.0.0

Als wir [Karn Forge vorgestellt](./2026-06-23-karn-forge-vorstellung) haben, war das erst der Anfang. Heute veröffentlichen wir das vollständige Paket: **Karn Forge v1.0.0**, das erste stabile Release.

Hier ist, was drin steckt.

## Das Canvas

Das Herzstück von Forge ist ein unendliches Drag-and-Drop-Canvas für dein Deck. Cards werden standardmäßig gestapelt, aber du kannst sie in **Gruppen** organisieren (Raster, horizontaler oder vertikaler Stack), **Sticker** mit Markdown-Notizen hinzufügen und **Widgets** für Live-Analysen an beliebige Stellen platzieren.

Jedes Deck kann mehrere benannte Arrangements haben — dein „Aggro-Build" und dein „Control-Build" haben so ihre eigenen Layouts, zwischen denen du sofort wechseln kannst.

Pan per Drag, Zoom mit Strg+Scroll (10–400%), Auswahlrechteck, Multi-Drag, Rückgängig/Wiederholen bis zu 50 Schritte. Automatisches Speichern mit 1500ms Debounce.

## Kartensuche

16 Filtertypen: Freitext (Name oder Oracle-Text), Farben, Typen, Seltenheit, Formatlegitimität, CMC-Bereich, Stärke/Widerstandskraft, Preislimit, Keywords (20 Stück), Card-Layout, EDHREC-Rang, Farbanzahl, erzeugte Mana, Reserved List und Game Changers.

Ergebnisse erscheinen sofort. Klick, um eine Karte dem aktuellen Deck-Board hinzuzufügen. Der Tooltip ist global — fahr mit der Maus über irgendeine Karte im App und der Art Crop erscheint.

## Canvas-Widgets

10 eingebaute Analyse-Widgets, die du auf dem Canvas platzieren kannst:

- **Mana-Kurve** — CMC-Histogramm mit konfigurierbarem Maximum
- **Farbverteilung** — Pip-Count-Balken für WUBRGC
- **Land-Verhältnis** — SVG-Donut vs. Zielwert, Differenz-Badge
- **Typ-Aufschlüsselung** — Kreaturen / Sofortzauber / Hexereien / etc.
- **Deck-Stats** — Gesamtzahl, Durchschnitts-CMC, Länderzahl
- **Ziehwahrscheinlichkeit** — Hypergeometrische Wahrscheinlichkeit für beliebige Kartengruppen
- **Deck-Rollen** — Ramp / Draw / Removal / Board Wipes vs. ideale EDH-Verhältnisse
- **EDHREC-Inklusion** — Prozenttier-Verteilung + Badge pro Karte
- **Sammlungsstatus** — Anzahl in-recipient / Proxy / fehlend
- **EDHREC-Commander** — Empfehlungen von der Commander-Seite mit Synergie-Balken

Du kannst auch eigene Widgets mit einem Live-Code-Editor erstellen.

## KI-Chat

Das KI-Panel (Toggle in der linken Sidebar) verbindet sich mit Claude und kennt dein Deck. Es nutzt deine bestehende Claude-Code-Authentifizierung — kein separater API-Key nötig, wenn du Claude Code bereits installiert hast.

Neu in v1.0.0: **Claude kann jetzt direkt mit der Benutzeroberfläche interagieren**. Der neue `chat-controller`-MCP-Server gibt Claude zwei Tools:

- `emit_block` — schiebt Rich-Content in den Chat: Card-Showcases, Swap-Vorschläge, Deck-Diffs, Navigation-Events, Denkend-Indikatoren
- `ask` — zeigt dem User ein interaktives Prompt (Auswahl, Bestätigung oder Kartenauswahl) und wartet auf die Antwort, bevor es weitergeht

Statt Claude zu beschreiben, was zu tun ist, zeigt es dir jetzt die Karten, über die es spricht, schlägt einen Tausch mit einem Ein-Klick-Akzeptieren-Button vor oder bittet dich, zwischen zwei Commandern direkt im Chat zu wählen.

Claude CLI und OpenAI werden beide als Provider unterstützt.

## Sammlung & Wunschliste

**Sammlung**: Verwalte jede physische Karte mit Zustand, Foil-Status, Sprache, Kaufpreis und Recipient-Zuweisung (Mappe, Box, Deck-Box). Massenimport im `4 Lightning Bolt`-Format, CSV-Export, Portfoliowert auf einen Blick.

**Wunschliste**: Prioritätsstufen (Low / Normal / High / Critical), Reihenfolge per Drag ändern, „Im Besitz"-Badge wenn du die Karte hast, direkt zu Decks hinzufügen.

**Kartenstatus auf dem Canvas**: Karten zeigen einen farbigen Punkt — grün wenn sie in der richtigen Mappe sind, gelb wenn in einer anderen, blau wenn in der Sammlung aber ohne Zuweisung, rot wenn fehlend.

## Commander Spellbook

Öffne ein Deck und klick auf den **Combos**-Tab — er ruft alle bekannten Combos mit deinen Karten vom Commander Spellbook ab und zeigt sie mit vollständiger Kartenliste, Schritten und Ergebnis.

## Globale Suche

**Strg+K** öffnet ein Vollbild-Overlay, das gleichzeitig Seiten, Decks, Ordner und Karten durchsucht. Vollständig per Tastatur navigierbar.

## Unter der Haube

- Electron 33 + React 19 + TypeScript + Vite + Tailwind CSS v3
- Zwei SQLite-Datenbanken: `library.db` für deine Daten, `prints.db` für den Karten-Katalog
- MCP-Server mit 31 Tools und 5 Ressourcen — Forge selbst funktioniert als MCP-Server in Claude Code
- Imperatives DOM-Canvas (kein React-Re-Render beim Pan/Zoom mit 100+ Karten)
- Alle Daten in `~/karnData/`

## Download

Den Installer findest du auf der [Releases-Seite](https://github.com/karn-mtg/forge/releases/tag/v1.0.0). Der Windows-NSIS-Installer ist bereits verfügbar; macOS- und Linux-Builds folgen.

Du brauchst außerdem das [Karn Arsenal](https://github.com/karn-mtg/karn/releases) für die Kartendatenbank — die Einstellungsseite von Forge übernimmt Download und Registrierung automatisch.

## Was kommt als nächstes

- macOS DMG und Linux AppImage
- Deck-Sharing — teilbare Links und Import per URL
- Import von Moxfield / Archidekt / Deckbox
- Mehr KI-gesteuerte Canvas-Aktionen (automatisches Gruppieren nach Strategie, Synergien hervorheben)

---

Fragen oder Fehler? Direkt zu den [GitHub Issues](https://github.com/karn-mtg/forge/issues).
