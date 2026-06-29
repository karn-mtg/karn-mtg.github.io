---
title: Karn Forge v1.1.2 — Bugfixes und Entwickler-Verbesserungen
description: Ein Patch-Release mit Fixes für das Logo-Laden, die Datenbank-Schema-Reihenfolge und Startfehler, plus zwei Verbesserungen für die Entwicklererfahrung.
date: '2026-06-29'
author: karn-team
tags: ['release', 'forge', 'v1.1.2']
lang: de
---

# Karn Forge v1.1.2

v1.1.2 ist ein kleines, aber wichtiges Patch-Release. Es behebt ein paar stille Bugs, die in gepackten Builds Probleme verursachen konnten, und bringt zwei Verbesserungen, die das Entwickeln spürbar angenehmer machen.

## Was wurde behoben

### Sidebar-Logo fehlte in gepackten Builds

Das Karn Forge-Logo wurde nach der Installation auf manchen Systemen nicht angezeigt. Das Logo wurde über einen statischen Pfad (`/biglogo.png`) referenziert, der in der Entwicklung funktioniert, aber in der gepackten Electron-App nicht, wo Assets anders gebündelt werden. Es wird jetzt die korrekte gebündelte Asset-URL verwendet und lädt überall zuverlässig.

### Datenbank-Index wurde vor seiner Tabelle erstellt

Ein Reihenfolge-Bug im Schema sorgte dafür, dass der `collection`-Index (der auf die `recipients`-Tabelle verweist) im initialen `CREATE TABLE`-Block deklariert wurde, bevor `recipients` überhaupt existierte. Das verursachte dank SQLites verzögerter Constraint-Prüfung meist keine sichtbaren Fehler — war aber falsch. Der Index wird jetzt im Migrations-Block erstellt, wo er hingehört.

### Startfehler wurden stillschweigend verschluckt

Wenn die Bibliotheks-Datenbank beim Start fehlschlug, wurde der Fehler ohne jegliche Log-Ausgabe verworfen, was die Diagnose fast unmöglich machte. Der Start umschließt die DB-Initialisierung jetzt in einem try/catch und loggt den vollständigen Fehler mit Stack-Trace, bevor er weitergeworfen wird.

## Was ist neu

### Dev-Builds nutzen ein separates Datenverzeichnis

Forge im Entwicklungsmodus zu starten (`npm run dev`) speichert Daten jetzt in `karnData-dev` statt im echten `karnData`-Ordner. Das bedeutet: Testen und Experimentieren kann die echte Sammlung nicht mehr versehentlich beschädigen. Produktions-Builds sind davon nicht betroffen.

### DEV-Badge im Entwicklungsmodus

Im Entwicklungsmodus erscheint jetzt ein kleines **DEV**-Badge in der Fensterecke. Eine Kleinigkeit — aber sie macht sofort klar, welches Fenster der Dev-Build und welches eine Produktionsinstallation ist.

## Update

Wer Forge bereits installiert hat: **Einstellungen → Updates → Nach Updates suchen**.

Für eine Neuinstallation gibt's die aktuelle Version auf der [Releases-Seite](https://github.com/karn-mtg/forge/releases/tag/v1.1.2).

## Was kommt als nächstes

- macOS DMG und Linux AppImage Builds
- Deck-Sharing — teilbare Links und Import per URL
- Import aus Moxfield, Archidekt und Deckbox
- Weitere KI-gesteuerte Canvas-Aktionen

---

Fragen oder Probleme? Ab ins [GitHub Issues](https://github.com/karn-mtg/forge/issues).
