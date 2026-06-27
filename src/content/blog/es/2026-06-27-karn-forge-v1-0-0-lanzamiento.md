---
title: Karn Forge v1.0.0
description: El primer lanzamiento completo de Karn Forge ya está aquí — desde el panel de chat con IA hasta los widgets del canvas, seguimiento de colección y el nuevo MCP chat-controller.
date: '2026-06-27'
author: karn-team
tags: ['release', 'forge', 'v1.0.0']
lang: es
---

# Karn Forge v1.0.0

Cuando [presentamos Karn Forge](./2026-06-23-presentando-karn-forge) hace unos días, mostramos la estructura. Hoy lanzamos el paquete completo: **Karn Forge v1.0.0**, el primer release estable.

Esto es lo que incluye.

## El Canvas

El núcleo de Forge es un canvas infinito de drag-and-drop para tu deck. Las cartas se apilan por defecto, pero puedes organizarlas en **grupos** (cuadrícula, pila horizontal o vertical), agregar **stickers** con notas en Markdown y colocar **widgets** en cualquier parte del canvas para ver analíticas en tiempo real.

Cada deck puede tener múltiples arrangements con nombre — así tu "build agresivo" y tu "build de control" tienen sus propios layouts, y cambiar entre ellos es instantáneo.

Pan con drag, zoom con Ctrl+Scroll (10–400%), selección por área, arrastrar varios a la vez, deshacer/rehacer hasta 50 pasos. Guardado automático con debounce de 1500ms.

## Búsqueda de Cartas

16 tipos de filtro: texto libre (nombre u oracle text), colores, tipos, rareza, legalidad de formato, rango de CMC, poder/resistencia, límite de precio, palabras clave (20 de ellas), layout de la carta, rango en EDHREC, cantidad de colores, maná producido, reserved list y game changers.

Los resultados aparecen al instante. Haz clic para agregar al board actual del deck. El tooltip es global — pasa el cursor sobre cualquier carta en cualquier parte del app y el art crop aparece.

## Widgets del Canvas

10 widgets analíticos listos para usar que puedes colocar en el canvas:

- **Curva de Maná** — histograma de CMC con límite configurable
- **Distribución de Colores** — barras de conteo de pips para WUBRGC
- **Proporción de Tierras** — donut SVG vs objetivo, badge de diferencia
- **Desglose por Tipo** — criaturas / instantes / conjuros / etc.
- **Stats del Deck** — total de cartas, CMC promedio, cantidad de tierras
- **Probabilidad de Robo** — cálculo hipergeométrico para cualquier grupo de cartas
- **Roles del Deck** — ramp / draw / remoción / limpiezas de tablero vs proporciones ideales de EDH
- **Inclusión en EDHREC** — distribución por nivel porcentual + badge por carta
- **Estado de la Colección** — conteos de in-recipient / proxy / faltando
- **Commander en EDHREC** — recomendaciones de la página del commander con barras de sinergia

También puedes crear tus propios widgets con un editor de código en vivo.

## Chat con IA

El panel de IA (toggle en la barra lateral izquierda) se conecta a Claude y ya conoce tu deck. Usa tu autenticación existente de Claude Code — no necesitas configurar una API key por separado si ya tienes Claude Code instalado.

Lo nuevo en v1.0.0: **Claude ahora puede interactuar directamente con la interfaz**. El nuevo MCP `chat-controller` le da a Claude dos herramientas:

- `emit_block` — envía contenido enriquecido al chat: showcases de cartas, sugerencias de intercambio, diffs de deck, eventos de navegación, indicadores de "pensando"
- `ask` — muestra al usuario un prompt interactivo (elección, confirmación o selección de carta) y espera su respuesta antes de continuar

En lugar de que Claude describa en texto qué hacer, ahora puede mostrarte las cartas de las que habla, sugerir un intercambio con un botón para aceptar con un clic, o pedirte que elijas entre dos commanders directamente en el chat.

Claude CLI y OpenAI se admiten como providers.

## Colección & Lista de Deseos

**Colección**: lleva el registro de cada carta física con condición, estado foil, idioma, precio de adquisición y asignación a un recipient (carpeta, caja, deck box). Importación masiva en formato `4 Lightning Bolt`, exportación a CSV, valor del portafolio de un vistazo.

**Lista de deseos**: niveles de prioridad (Low / Normal / High / Critical), reordenar arrastrando, badge "en posesión" cuando tienes la carta, agregar a cualquier deck inline.

**Estado en el canvas**: las cartas muestran un punto de color — verde si está en la carpeta correcta, amarillo si está en otra, azul si está en la colección pero sin asignar, rojo si falta.

## Commander Spellbook

Abre cualquier deck y haz clic en la pestaña **Combos** — busca todos los combos conocidos con tus cartas en Commander Spellbook y los muestra con la lista completa, los pasos y el resultado.

## Búsqueda Global

**Ctrl+K** abre un overlay de pantalla completa que busca páginas, decks, carpetas y cartas al mismo tiempo. Navegación completa por teclado.

## Bajo el Capó

- Electron 33 + React 19 + TypeScript + Vite + Tailwind CSS v3
- Dos bases de datos SQLite: `library.db` para tus datos, `prints.db` para el catálogo de cartas
- MCP server con 31 herramientas y 5 recursos — el propio Forge funciona como MCP server dentro de Claude Code
- Canvas con DOM imperativo (sin re-renders de React para pan/zoom con 100+ cartas)
- Todos los datos en `~/karnData/`

## Descarga

El instalador está en la [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.0.0). El instalador NSIS para Windows ya está disponible; los builds para macOS y Linux vienen pronto.

También vas a necesitar [Karn Arsenal](https://github.com/karn-mtg/karn/releases) para la base de datos de cartas — la página de Configuración de Forge se encarga de la descarga y el registro automáticamente.

## Qué Viene Después

- Build DMG para macOS y AppImage para Linux
- Compartir decks — links públicos e importación por URL
- Importación desde Moxfield / Archidekt / Deckbox
- Más acciones de canvas con IA (agrupar automáticamente por estrategia, resaltar sinergias)

---

¿Preguntas o problemas? [GitHub Issues](https://github.com/karn-mtg/forge/issues) es el lugar indicado.
