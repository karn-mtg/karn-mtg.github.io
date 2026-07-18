---
title: Karn Forge v1.1.3 — Servidores MCP corregidos
description: Un parche que corrige los servidores MCP karnforge y karn Arsenal, que fallaban al conectarse en Windows.
date: '2026-07-18'
author: karn-team
tags: ['release', 'forge', 'v1.1.3']
lang: es
---

# Karn Forge v1.1.3

Este es un parche puntual: corrige los dos servidores MCP de Karn Forge, que podían fallar al conectarse tras la instalación — algo especialmente notorio si manejas Forge desde un agente de IA como Claude Code.

## Qué se corrigió

### El servidor MCP karnforge se caía al iniciar

El servidor MCP karnforge ejecuta su punto de entrada en TypeScript a través de `tsx` dentro de la app Electron empaquetada. El resolvedor de módulos de `tsx` no recurre a `NODE_PATH` como lo hace Node normal, así que dependencias como `zod` y `esbuild` — presentes en la app empaquetada pero no descomprimidas en el sistema de archivos real — quedaban irresolubles. El servidor se caía antes incluso de poder conectarse, y Claude Code (o cualquier cliente MCP) simplemente lo veía como fallido.

La corrección descomprime todo `node_modules` en lugar de elegir paquetes individuales, así cada dependencia queda en disco donde la resolución de módulos normal puede encontrarla.

### Los logs de inicio corrompían la conexión MCP

Una llamada a `console.log` durante la inicialización de la base de datos escribía texto plano en stdout — el mismo stream que los servidores MCP usan para JSON-RPC. Como esto ocurría antes de que el transporte se conectara, corrompía el handshake en cada inicio. Los logs de inicio ahora van a stderr, donde corresponden.

### Binario del servidor karn Arsenal

Por separado, el release anterior del servidor karn Arsenal (`server-v1.1.0`) traía un bundle de DLL de Python corrupto y fallaba de inmediato con un error de `LoadLibrary` en Windows. `server-v1.1.1` corrige esto — el motor de reglas, la detección de combos y la búsqueda semántica de Arsenal están de vuelta.

## Cómo actualizar

Si ya tienes Forge instalado, ve a **Configuración → Actualizaciones** y haz clic en **Buscar actualizaciones**. Si Arsenal muestra una actualización para el componente de servidor, instálala también.

Para una instalación nueva, descárgalo desde la [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.1.3).

## Qué sigue

- Builds para macOS (DMG) y Linux (AppImage)
- Compartir decks — links y importación por URL
- Importación desde Moxfield, Archidekt y Deckbox
- Más acciones de canvas con IA

---

¿Preguntas o problemas? El lugar indicado es [GitHub Issues](https://github.com/karn-mtg/forge/issues).
