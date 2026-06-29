---
title: Karn Forge v1.1.2 — Correcciones y Mejoras para Desarrollo
description: Un parche que corrige la carga del logo, el orden del schema de la base de datos y errores de inicio, además de dos mejoras para la experiencia de desarrollo.
date: '2026-06-29'
author: karn-team
tags: ['release', 'forge', 'v1.1.2']
lang: es
---

# Karn Forge v1.1.2

v1.1.2 es una actualización pequeña pero importante. Corrige algunos bugs silenciosos que podían causar problemas en builds empaquetados, y trae mejoras que hacen que el desarrollo sea notablemente más cómodo.

## Qué se corrigió

### Logo de la barra lateral ausente en builds empaquetados

El logo de Karn Forge no aparecía tras la instalación en algunos sistemas. El logo se referenciaba con una ruta estática (`/biglogo.png`) que funciona en desarrollo pero falla en la app Electron empaquetada, donde los assets se organizan de forma diferente. Ahora usa la URL correcta del asset bundled y carga correctamente en cualquier entorno.

### El índice de la base de datos se creaba antes que su tabla

Un bug de ordenación en el schema hacía que el índice de `collection` (que referencia a la tabla `recipients`) se declarara en el bloque inicial `CREATE TABLE` antes de que `recipients` existiera. Gracias a la verificación diferida de restricciones de SQLite esto no causaba crashes visibles en la mayoría de los casos, pero estaba mal — el índice ahora se crea en el bloque de migración, donde corresponde.

### Errores de inicio descartados en silencio

Si la base de datos fallaba durante la inicialización, el error se descartaba sin ningún log, haciendo casi imposible diagnosticar el problema. El inicio ahora envuelve la inicialización de la base de datos en un try/catch adecuado y registra el error completo con stack trace antes de relanzarlo.

## Qué hay de nuevo

### Los builds de dev usan un directorio de datos separado

Ejecutar Forge en modo de desarrollo (`npm run dev`) ahora almacena los datos en `karnData-dev` en lugar de tu carpeta real `karnData`. Esto significa que probar y experimentar durante el desarrollo no puede corromper ni interferir con tu colección real. Los builds de producción no se ven afectados.

### Badge DEV en modo de desarrollo

Ahora aparece un pequeño badge **DEV** en la esquina de la ventana cuando Forge está corriendo en modo de desarrollo. Es un detalle menor, pero hace que sea inmediatamente obvio cuál ventana es tu build de dev y cuál es una instalación de producción.

## Cómo actualizar

Si ya tienes Forge instalado, ve a **Configuración → Actualizaciones** y haz clic en **Buscar actualizaciones**.

Para una instalación nueva, descárgalo desde la [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.1.2).

## Qué sigue

- Builds para macOS (DMG) y Linux (AppImage)
- Compartir decks — links y importación por URL
- Importación desde Moxfield, Archidekt y Deckbox
- Más acciones de canvas con IA

---

¿Preguntas o problemas? El lugar indicado es [GitHub Issues](https://github.com/karn-mtg/forge/issues).
