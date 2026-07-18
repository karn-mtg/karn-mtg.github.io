---
title: Karn Forge v1.1.4 — Kartensuche repariert
description: Ein Patch-Release, der die Kartensuche repariert, die durch eine Datenbank-Schema-Diskrepanz stillschweigend null Ergebnisse liefern konnte.
date: '2026-07-18'
author: karn-team
tags: ['release', 'forge', 'v1.1.4']
lang: de
---

# Karn Forge v1.1.4

Dies ist ein kleines, aber wichtiges Patch-Release: Die Kartensuche funktioniert wieder. Wenn du kürzlich deine Kartendatenbank aktualisiert hast und danach nicht mal mehr deinen eigenen Commander finden konntest, ist das hier der Fix.

## Was behoben wurde

### Kartensuche lieferte keine Ergebnisse

Die Kartensuche von Karn Forge hat ein paar Spalten — `image_url` und `released_at` — direkt aus der `cards`-Tabelle abgefragt. Diese Spalten gibt es dort nicht mehr: druckspezifische Daten wie das Kartenbild wurden vor einer Weile in eine eigene `card_images`-Tabelle verschoben, indiziert über `oracle_id`, da eine einzelne Karte mehrere Drucke mit unterschiedlichem Artwork haben kann.

Die Diskrepanz führte dazu, dass jede Suchanfrage auf Datenbankebene fehlschlug. Es gab keine Fehlermeldung und kein kaputtes Bildsymbol, das darauf hingewiesen hätte — die Suche kam einfach jedes Mal leer zurück, für jede Karte, auch für deinen Commander. Das Kartenbild wird jetzt außerdem für jedes Suchergebnis korrekt ausgewählt, und zwar aus dem neuesten Druck, für den tatsächlich Artwork verfügbar ist.

## Update

Öffne **Settings → Updates** und klicke auf **Check for Updates**, um den Fix automatisch zu erhalten.

Für eine Neuinstallation gibt es die Datei auf der [Releases-Seite](https://github.com/karn-mtg/forge/releases/tag/v1.1.4).

## Was als Nächstes kommt

- macOS-DMG- und Linux-AppImage-Builds
- Deck-Sharing — teilbare Links und Import über URL
- Import aus Moxfield / Archidekt / Deckbox
- Mehr KI-gestützte Canvas-Aktionen

---

Fragen oder Probleme? [GitHub Issues](https://github.com/karn-mtg/forge/issues) ist der richtige Ort dafür.
