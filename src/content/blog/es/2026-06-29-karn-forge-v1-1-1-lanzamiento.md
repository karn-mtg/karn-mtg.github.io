---
title: Karn Forge v1.1.1 — Corrección de Instalación en Windows
description: Un parche enfocado que corrige varios crashes que impedían que Karn Forge funcionara correctamente tras la instalación en Windows.
date: '2026-06-29'
author: karn-team
tags: ['release', 'forge', 'v1.1.1']
lang: es
---

# Karn Forge v1.1.1

Si instalaste v1.1.0 en Windows y te encontraste con un crash al iniciar — o descubriste que el chat de IA nunca funcionó — este es el parche que necesitás. v1.1.1 es una versión de corrección de errores sin funciones nuevas; simplemente se asegura de que la app funcione correctamente después de la instalación.

## Qué se corrigió

### Crash "Cannot find module" al iniciar

El problema más visible: tras instalar v1.1.0, Forge crasheaba inmediatamente con un error sobre un módulo no encontrado. Al build empaquetado le faltaban varios directorios internos (`utils/`, `mcp/`) que la app necesita al arrancar. Corregido — esos directorios ahora están incluidos correctamente.

### El chat de IA siempre fallaba en Windows

Incluso si la app iniciaba, comenzar un chat de IA fallaba inmediatamente con "Failed to start Claude". La causa era que Forge le pasaba un directorio de trabajo inválido al subproceso de Claude — una ruta virtual dentro del archivo de la app que Windows no reconoce como una carpeta real. El subproceso ahora inicia desde el directorio home del usuario, que siempre existe.

### Los servidores MCP nunca se registraban con Claude

La integración MCP de Karn (las herramientas que permiten a Claude buscar cards, leer tu biblioteca e interactuar con el canvas) fallaba silenciosamente al registrarse. El archivo de configuración se escribía en una ubicación de solo lectura dentro del archivo de la app, en lugar de `~/.claude/settings.json`, donde Claude realmente lo lee. Corregido.

### Los datos del canvas se borraban al usar herramientas MCP de canvas

Si Claude usaba una herramienta de arrangement de canvas (crear grupo, crear sticker), sobrescribía silenciosamente el estado existente del canvas solo con el nuevo elemento, perdiendo todo lo demás. Una incompatibilidad en el nombre de una propiedad (`canvas_json` vs `canvasJson`) hacía que la lectura del canvas siempre retornara vacía antes de escribir. Corregido.

### El instalador de Windows no podía compilarse

El build de CI fallaba al producir un instalador de Windows porque el archivo `icon.ico` requerido faltaba en el repositorio. El ícono ahora está generado e incluido, así que los instaladores se compilarán correctamente en adelante.

## Cómo actualizar

Si ya tenés Forge instalado, abrí **Configuración → Actualizaciones** y hacé clic en **Buscar actualizaciones** — Forge encontrará v1.1.1 automáticamente.

Para una instalación nueva, descargá la última versión en la [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.1.1).

## Qué viene después

- Builds para macOS (DMG) y Linux (AppImage)
- Compartir decks — links compartibles e importación por URL
- Importación desde Moxfield / Archidekt / Deckbox
- Más acciones de canvas con IA

---

¿Preguntas o problemas? [GitHub Issues](https://github.com/karn-mtg/forge/issues) es el lugar indicado.
