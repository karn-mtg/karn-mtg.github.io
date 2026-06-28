---
title: Karn Forge v1.1.0 — Automatische Updates
description: Karn Forge und das Arsenal-Backend aktualisieren sich jetzt selbst. Kein manuelles Herunterladen von Installern oder Austauschen von Binaries mehr.
date: '2026-06-28'
author: karn-team
tags: ['release', 'forge', 'v1.1.0']
lang: de
---

# Karn Forge v1.1.0

Dieses Release hat einen klaren Fokus: Karn Forge und das Arsenal-Backend aktualisieren sich ab sofort selbst. Du musst die Releases-Seite nicht mehr besuchen, um auf dem neuesten Stand zu bleiben.

## Was ist neu

### App-Auto-Updater

Forge prüft wenige Sekunden nach dem Start, ob eine neue Version verfügbar ist. Wenn ja, erscheint in **Einstellungen → Updates** eine Benachrichtigung mit einem Download-Button. Klicke darauf, warte auf den Download und klicke dann auf **Installieren** — die App startet neu und die neue Version ist aktiv.

Kein neues Installationsprogramm herunterladen, ausführen oder das alte entfernen. Das Update wird direkt in der laufenden App installiert.

### Ersteinrichtungs-Assistent

Arsenal auf einer frischen Installation einzurichten erforderte bisher etwas manuelle Arbeit. Jetzt gibt es einen Ein-Klick-Assistenten. Beim ersten Start fragt Forge, ob du Arsenal einrichten möchtest, und lädt die drei Komponenten nacheinander herunter — die Server-Binary, die Card-Datenbank und die Regeldatenbank — mit einem Live-Fortschrittsbalken für jeden Schritt.

Der gesamte Vorgang dauert bei einer normalen Verbindung weniger als eine Minute.

### Arsenal Server-Selbstupdate

Das Arsenal-Backend kann sich jetzt selbst aktualisieren. Wenn eine neue Server-Version verfügbar ist, wird sie im Arsenal-Panel neben den Card- und Regeldatenbanken angezeigt — und das Update funktioniert genauso: Klicken, warten, fertig. Kein manueller Binary-Tausch mehr.

## Im Hintergrund

- `electron-updater` übernimmt den Update-Flow der App mit einer eigenen IPC-Bridge zum Renderer
- Der `/updates`-Endpoint von Arsenal prüft jetzt alle vier Komponenten in einer einzigen Anfrage: Server, Cards, Rules und Agent
- Neuer `/update/server`-Endpoint streamt den Download-Fortschritt via SSE, damit die UI einen Live-Fortschrittsbalken zeigen kann
- MCP-Einstellungen werden nach jeder Installation oder Update automatisch neu geschrieben, damit Claude den aktuellen Binary-Pfad findet — ohne Neustart

## Download / Update

Wenn du Forge bereits nutzt, öffne **Einstellungen → Updates** und klicke auf **Nach Updates suchen**. Forge sollte v1.1.0 automatisch finden.

Für eine Neuinstallation findest du das Paket auf der [Releases-Seite](https://github.com/karn-mtg/forge/releases/tag/v1.1.0).

## Was als nächstes kommt

- macOS DMG und Linux AppImage Builds
- Deck-Sharing — teilbare Links und Import über URLs
- Import von Moxfield, Archidekt und Deckbox
- Mehr KI-gesteuerte Canvas-Aktionen

---

Fragen oder Probleme? [GitHub Issues](https://github.com/karn-mtg/forge/issues) ist der richtige Ort.
