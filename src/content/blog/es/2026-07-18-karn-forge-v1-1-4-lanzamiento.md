---
title: Karn Forge v1.1.4 — Búsqueda de Cartas Corregida
description: Un parche que corrige la búsqueda de cartas, que podía devolver cero resultados en silencio por una incompatibilidad en el esquema de la base de datos.
date: '2026-07-18'
author: karn-team
tags: ['release', 'forge', 'v1.1.4']
lang: es
---

# Karn Forge v1.1.4

Este es un parche pequeño pero importante: la búsqueda de cartas está arreglada. Si actualizaste tu base de datos de cartas hace poco y después no pudiste ni encontrar a tu propio comandante, esta es la solución.

## Qué se corrigió

### La búsqueda de cartas no devolvía resultados

La búsqueda de cartas de Karn Forge consultaba un par de columnas — `image_url` y `released_at` — directamente de la tabla `cards`. Esas columnas ya no existen ahí: los datos específicos de cada edición, como el arte de la carta, se movieron hace un tiempo a su propia tabla `card_images`, indexada por `oracle_id`, ya que una misma carta puede tener varias ediciones con arte distinto.

Esa incompatibilidad hacía que toda consulta de búsqueda fallara a nivel de base de datos. No había ningún mensaje de error ni ícono de imagen rota que lo delatara — la búsqueda simplemente volvía vacía, siempre, para cualquier carta, incluyendo tu comandante. Ahora también se elige correctamente el arte de la carta en cada resultado de búsqueda, usando la edición más reciente que realmente tiene arte disponible.

## Cómo actualizar

Abre **Settings → Updates** y haz clic en **Check for Updates** para recibir esta corrección automáticamente.

Para una instalación nueva, descárgala desde la [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.1.4).

## Qué sigue

- Builds de DMG para macOS y AppImage para Linux
- Compartir mazos — enlaces compartibles e importación por URL
- Importación desde Moxfield / Archidekt / Deckbox
- Más acciones de IA en el canvas

---

¿Dudas o problemas? [GitHub Issues](https://github.com/karn-mtg/forge/issues) es el lugar.
