---
title: Karn Forge v1.1.1 — Windows-Installations-Fix
description: Ein gezielter Patch, der mehrere Abstürze behebt, die Karn Forge nach der Installation unter Windows am ordnungsgemäßen Betrieb hinderten.
date: '2026-06-29'
author: karn-team
tags: ['release', 'forge', 'v1.1.1']
lang: de
---

# Karn Forge v1.1.1

Wer v1.1.0 unter Windows installiert hat und beim Start auf einen Absturz gestoßen ist — oder festgestellt hat, dass der AI-Chat nie funktionierte — für den ist dieses Update gemacht. v1.1.1 ist ein reines Bugfix-Release ohne neue Features; es stellt einfach sicher, dass die App nach der Installation korrekt läuft.

## Was wurde behoben

### Absturz "Cannot find module" beim Start

Das auffälligste Problem: Nach der Installation von v1.1.0 stürzte Forge sofort mit einem Fehler über ein fehlendes Modul ab. Dem gepackten Build fehlten mehrere interne Verzeichnisse (`utils/`, `mcp/`), die die App beim Start benötigt. Behoben — diese Verzeichnisse sind jetzt korrekt enthalten.

### AI-Chat schlägt unter Windows immer fehl

Selbst wenn die App startete, scheiterte ein AI-Chat sofort mit "Failed to start Claude". Der Grund: Forge übergab dem Claude-Subprozess ein ungültiges Arbeitsverzeichnis — einen virtuellen Pfad innerhalb des App-Archivs, den Windows nicht als echten Ordner erkennt. Der Subprozess startet jetzt aus dem Home-Verzeichnis des Benutzers.

### MCP-Server registrierten sich nie bei Claude

Die MCP-Integration von Karn (die Tools, mit denen Claude Cards suchen, deine Bibliothek lesen und mit dem Canvas interagieren kann) schlug beim Registrieren stillschweigend fehl. Die Konfigurationsdatei wurde in einen schreibgeschützten Speicherort innerhalb des App-Archivs geschrieben, statt in `~/.claude/settings.json`, wo Claude sie tatsächlich liest. Behoben.

### Canvas-Daten wurden bei MCP-Canvas-Tool-Aufrufen überschrieben

Wenn Claude ein Canvas-Arrangement-Tool verwendete (Gruppe erstellen, Sticker erstellen), wurden die bestehenden Canvas-Daten stillschweigend durch das neue Element ersetzt, wobei alles andere verloren ging. Ein Namenskonflikt bei einer Eigenschaft (`canvas_json` vs `canvasJson`) sorgte dafür, dass das Canvas-Lesen immer leer zurückkehrte. Behoben.

### Windows-Installer konnte nicht erstellt werden

Der CI-Build scheiterte an der Erstellung eines Windows-Installers, weil die benötigte Datei `icon.ico` im Repository fehlte. Das Icon ist jetzt generiert und enthalten, sodass Installer künftig korrekt gebaut werden.

## Update

Wer Forge bereits nutzt, öffnet **Einstellungen → Updates** und klickt auf **Nach Updates suchen** — Forge findet v1.1.1 automatisch.

Für eine Neuinstallation gibt es die aktuelle Version auf der [Releases-Seite](https://github.com/karn-mtg/forge/releases/tag/v1.1.1).

## Was kommt als Nächstes

- macOS DMG und Linux AppImage Builds
- Deck-Sharing — teilbare Links und Import per URL
- Import aus Moxfield / Archidekt / Deckbox
- Weitere KI-gestützte Canvas-Aktionen

---

Fragen oder Probleme? [GitHub Issues](https://github.com/karn-mtg/forge/issues) ist der richtige Ort.
