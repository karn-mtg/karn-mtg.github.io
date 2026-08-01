---
title: Karn Forge v1.2.0 — Tags steuern dein Canvas, plus Deckwert
description: Canvas-Gruppen werden jetzt aus Card-Tags gebildet, mit einem neuen Tag Manager, einem Deck-Value-Widget und einer kompletten Testsuite unter der Haube.
date: '2026-08-02'
author: karn-team
tags: ['release', 'forge', 'v1.2.0']
lang: de
---

# Karn Forge v1.2.0

Dieses Release überarbeitet, wie das Arrangement-Canvas deine Cards gruppiert, und bringt ein Widget, nach dem viele gefragt haben: Deckwert.

## Was ist neu

### Canvas-Gruppen werden jetzt von Tags gesteuert

Bisher existierten Canvas-Gruppen nur als Container, in die man Cards auf dem Workshop-Canvas gezogen hat. Jetzt werden Gruppen direkt aus den Tags deiner Cards berechnet — tagge ein paar Cards mit "Ramp" oder "Removal" und sie erscheinen automatisch gruppiert auf dem Canvas, auf der jeweils angezeigten Gruppierungsebene.

Das bedeutet auch, dass Tagging jetzt ein zentraler Teil des Deckbaus ist, nicht nur ein organisatorischer Nebeneffekt beim visuellen Anordnen von Cards. Du kannst Tags direkt in der Deck-Ansicht mit dem neuen **Tag Manager** erstellen, umbenennen und zuweisen, und die Tags einer Card inline bearbeiten, ohne einen separaten Dialog zu öffnen.

### Deck-Value-Widget

Es gibt ein neues Widget fürs Canvas: **Deck Value**. Es zeigt den geschätzten Marktwert (in USD, ohne Foil) deines Decks basierend auf Scryfall-Preisdaten und markiert, wie viele Cards im Deck noch keine Preisdaten haben. Du kannst wählen, ob dein Sideboard mit eingerechnet wird oder nur das Hauptdeck.

## Unter der Haube

Dieses Release bringt außerdem zum ersten Mal eine echte Testsuite für Forge — vitest und Testing Library decken jetzt Stores, Hooks und Utility-Funktionen ab, was mit wachsender App zu weniger Regressionen führen sollte. Außerdem gibt es ein neues visual-inspect-Skript, um während der Entwicklung schnell Screenshots der UI zu machen.

## Download / Update

Öffne **Settings → Updates** und klicke auf **Check for Updates**, um dieses Update automatisch zu erhalten.

Für eine Neuinstallation gibt's das Release auf der [Releases-Seite](https://github.com/karn-mtg/forge/releases/tag/v1.2.0).

## Was als Nächstes kommt

- macOS-DMG- und Linux-AppImage-Builds
- Deck-Sharing — teilbare Links und Import per URL
- Import von Moxfield / Archidekt / Deckbox

---

Fragen oder Probleme? [GitHub Issues](https://github.com/karn-mtg/forge/issues) ist der richtige Ort.
