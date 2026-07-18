---
title: Karn Forge v1.1.3 — MCP-Server repariert
description: Ein Patch-Release, das die MCP-Server karnforge und karn Arsenal repariert, die unter Windows keine Verbindung aufbauen konnten.
date: '2026-07-18'
author: karn-team
tags: ['release', 'forge', 'v1.1.3']
lang: de
---

# Karn Forge v1.1.3

Dieses Release ist ein gezielter Patch: Er behebt beide MCP-Server von Karn Forge, die nach der Installation keine Verbindung aufbauen konnten — besonders spürbar, wenn Forge über einen KI-Agenten wie Claude Code gesteuert wird.

## Was wurde behoben

### karnforge MCP-Server stürzte beim Start ab

Der karnforge MCP-Server führt seinen TypeScript-Einstiegspunkt über `tsx` innerhalb der gepackten Electron-App aus. Der Modul-Resolver von `tsx` greift nicht wie der normale Node-Resolver auf `NODE_PATH` zurück, sodass Abhängigkeiten wie `zod` und `esbuild` — vorhanden in der gepackten App, aber nicht auf dem echten Dateisystem entpackt — nicht auflösbar waren. Der Server stürzte ab, bevor er überhaupt eine Verbindung aufbauen konnte, und Claude Code (oder jeder andere MCP-Client) sah ihn einfach als fehlgeschlagen an.

Der Fix entpackt jetzt das komplette `node_modules` statt einzelne Pakete auszuwählen, sodass jede Abhängigkeit auf der Festplatte liegt, wo die normale Modulauflösung sie findet.

### Start-Logs korrumpierten die MCP-Verbindung

Ein `console.log`-Aufruf während der Datenbank-Initialisierung schrieb reinen Text nach stdout — genau der Stream, den MCP-Server für JSON-RPC verwenden. Da dies vor dem Verbindungsaufbau des Transports lief, korrumpierte es den Handshake bei jedem Start. Start-Logs gehen jetzt an stderr, wo sie hingehören.

### karn Arsenal-Server-Binary

Unabhängig davon enthielt das vorherige karn Arsenal-Server-Release (`server-v1.1.0`) ein beschädigtes Python-DLL-Bundle und schlug unter Windows sofort mit einem `LoadLibrary`-Fehler fehl. `server-v1.1.1` behebt das — Arsenals Regel-Engine, Combo-Erkennung und semantische Suche sind wieder online.

## Update

Wer Forge bereits installiert hat: **Einstellungen → Updates → Nach Updates suchen**. Zeigt Arsenal ein Update für die Server-Komponente an, installiere das ebenfalls.

Für eine Neuinstallation gibt's die aktuelle Version auf der [Releases-Seite](https://github.com/karn-mtg/forge/releases/tag/v1.1.3).

## Was kommt als nächstes

- macOS DMG und Linux AppImage Builds
- Deck-Sharing — teilbare Links und Import per URL
- Import aus Moxfield, Archidekt und Deckbox
- Weitere KI-gesteuerte Canvas-Aktionen

---

Fragen oder Probleme? Ab ins [GitHub Issues](https://github.com/karn-mtg/forge/issues).
