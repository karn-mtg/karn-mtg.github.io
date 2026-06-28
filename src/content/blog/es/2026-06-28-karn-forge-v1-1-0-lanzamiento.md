---
title: Karn Forge v1.1.0 — Actualizaciones Automáticas
description: Karn Forge y el backend Arsenal ahora se actualizan solos. Sin más descargas manuales de instaladores ni reemplazos de binarios.
date: '2026-06-28'
author: karn-team
tags: ['release', 'forge', 'v1.1.0']
lang: es
---

# Karn Forge v1.1.0

Este release tiene un enfoque claro: Karn Forge y el backend Arsenal ahora se actualizan solos. No necesitas visitar la página de releases para estar al día.

## Qué hay de nuevo

### Auto-actualización de la app

Forge verifica si hay una nueva versión unos segundos después de iniciarse. Cuando hay una disponible, **Ajustes → Actualizaciones** muestra una notificación con un botón de descarga. Haz clic, espera la descarga y luego haz clic en **Instalar** — la app se reinicia con la nueva versión aplicada.

Sin descargar un nuevo instalador, ejecutarlo ni lidiar con el anterior. La actualización se instala directamente dentro de la app en ejecución.

### Asistente de instalación inicial

Configurar Arsenal en una instalación nueva requería cierto trabajo manual. Ahora hay un asistente con un solo clic. En el primer inicio, Forge te propone configurar Arsenal y gestiona las tres descargas en secuencia — el binario del servidor, la base de datos de cards y la base de datos de reglas — con un indicador de progreso en tiempo real para cada paso.

Todo el proceso tarda menos de un minuto con una conexión típica.

### Arsenal Server con auto-actualización

El backend de Arsenal ahora puede actualizarse en el sitio. Cuando hay una nueva versión del servidor disponible, aparece listada junto a las bases de datos de cards y reglas en el panel de Arsenal — y actualizarla funciona igual: clic, espera, listo. Sin reemplazar binarios manualmente.

## Por dentro

- `electron-updater` gestiona el flujo de actualización de la app con un puente IPC personalizado hacia el renderer
- El endpoint `/updates` de Arsenal ahora verifica los cuatro componentes en una sola petición: servidor, cards, reglas y agent
- Nuevo endpoint `/update/server` que transmite el progreso de la descarga vía SSE para que la interfaz muestre una barra de progreso en tiempo real
- Los ajustes de MCP se reescriben automáticamente tras cualquier instalación o actualización, así Claude siempre encuentra la ruta del binario más reciente sin necesidad de reiniciar

## Descarga / Actualización

Si ya usas Forge, abre **Ajustes → Actualizaciones** y haz clic en **Buscar actualizaciones**. Forge debería encontrar la v1.1.0 automáticamente.

Para una instalación nueva, descarga el instalador desde la [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.1.0).

## Qué viene después

- Builds para macOS DMG y Linux AppImage
- Compartir decks — links compartibles e importación desde URLs
- Importación desde Moxfield, Archidekt y Deckbox
- Más acciones del canvas impulsadas por IA

---

¿Preguntas o problemas? [GitHub Issues](https://github.com/karn-mtg/forge/issues) es el lugar indicado.
