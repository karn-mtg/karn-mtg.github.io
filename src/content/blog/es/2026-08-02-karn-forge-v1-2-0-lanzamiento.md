---
title: Karn Forge v1.2.0 — Los Tags Controlan tu Canvas, Más Valor del Deck
description: Los grupos del canvas ahora se construyen a partir de los tags de los cards, con un nuevo Tag Manager, un widget de Valor del Deck y una suite de tests completa por debajo.
date: '2026-08-02'
author: karn-team
tags: ['release', 'forge', 'v1.2.0']
lang: es
---

# Karn Forge v1.2.0

Este release repiensa cómo el canvas de arreglo agrupa tus cards, y suma un widget que muchos venían pidiendo: valor del deck.

## Qué hay de nuevo

### Los grupos del canvas ahora vienen de los tags

Antes, los grupos del canvas solo existían como contenedores a los que arrastrabas cards en el canvas del workshop. Ahora, los grupos se calculan directamente a partir de los tags de tus cards — etiquetá algunos cards como "Ramp" o "Removal" y aparecen agrupados automáticamente en el canvas, en el nivel de agrupamiento que estés viendo.

Esto también significa que taguear es ahora una parte central de armar el deck, y no solo un efecto colateral de organizar cards visualmente. Podés crear, renombrar y asignar tags directo desde la vista del deck con el nuevo **Tag Manager**, y editar los tags de un card en línea, sin abrir un diálogo aparte.

### Widget de Valor del Deck

Hay un widget nuevo para el canvas: **Deck Value**. Muestra el valor de mercado estimado (en USD, sin foil) de tu deck según los datos de precios de Scryfall, e indica cuántos cards del deck todavía no tienen datos de precio disponibles. Podés incluir tu sideboard o solo el deck principal.

## Por debajo

Este release también trae por primera vez una suite de tests real para Forge — vitest y Testing Library ahora cubren stores, hooks y funciones utilitarias, lo que debería significar menos regresiones a medida que la app crece. También hay un nuevo script de visual-inspect para capturar screenshots de la UI rápidamente durante el desarrollo.

## Descarga / Actualización

Abrí **Settings → Updates** y hacé clic en **Check for Updates** para recibir esta actualización automáticamente.

Para una instalación nueva, descargala en la [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.2.0).

## Qué viene después

- Builds de DMG para macOS y AppImage para Linux
- Compartir decks — links compartibles e importación por URL
- Importación de Moxfield / Archidekt / Deckbox

---

¿Preguntas o problemas? [GitHub Issues](https://github.com/karn-mtg/forge/issues) es el lugar.
