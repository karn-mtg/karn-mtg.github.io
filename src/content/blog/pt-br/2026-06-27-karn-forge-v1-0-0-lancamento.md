---
title: Karn Forge v1.0.0
description: O primeiro lançamento completo do Karn Forge chegou — do chat com IA ao sistema de widgets no canvas, rastreamento de coleção e o novo MCP chat-controller.
date: '2026-06-27'
author: karn-team
tags: ['release', 'forge', 'v1.0.0']
lang: pt-br
---

# Karn Forge v1.0.0

Quando [apresentamos o Karn Forge](./2026-06-23-apresentando-karn-forge) há alguns dias, mostramos a estrutura. Hoje estamos lançando o projeto completo: **Karn Forge v1.0.0**, a primeira versão estável.

Aqui está o que tem dentro.

## O Canvas

O coração do Forge é um canvas infinito de drag-and-drop para o seu deck. Os cards ficam empilhados por padrão, mas você pode organizá-los em **grupos** (grade, pilha horizontal ou vertical), adicionar **stickers** com notas em Markdown, e colocar **widgets** em qualquer lugar do canvas para ver análises em tempo real.

Cada deck pode ter múltiplos arrangements nomeados — assim o seu "build agressivo" e o "build de controle" têm layouts próprios, e alternar entre eles é instantâneo.

Pan com drag, zoom com Ctrl+Scroll (10–400%), seleção em área, arrastar vários ao mesmo tempo, desfazer/refazer até 50 passos. Salva automaticamente com debounce de 1500ms.

## Busca de Cards

16 tipos de filtro: texto livre (nome ou oracle text), cores, tipos, raridade, legalidade de formato, range de CMC, poder/resistência, limite de preço, palavras-chave (20 delas), layout do card, rank no EDHREC, quantidade de cores, mana produzido, lista reservada e game changers.

Os resultados aparecem na hora. Clique para adicionar ao board do deck atual. O tooltip é global — passe o mouse sobre qualquer card em qualquer lugar do app e o art crop aparece.

## Widgets do Canvas

10 widgets analíticos prontos que você pode colocar no canvas:

- **Curva de Mana** — histograma de CMC com limite configurável
- **Distribuição de Cores** — barras de pip count para WUBRGC
- **Proporção de Terras** — donut SVG vs meta, badge de diferença
- **Breakdown por Tipo** — criaturas / instants / feitiços / etc.
- **Stats do Deck** — total de cards, CMC médio, quantidade de terras
- **Probabilidade de Compra** — cálculo hipergeométrico para qualquer grupo de cards
- **Papéis do Deck** — ramp / compra / remoção / limpezas de board vs proporções ideais de EDH
- **Inclusão no EDHREC** — distribuição por faixa percentual + badge por card
- **Status da Coleção** — contagens de in-recipient / proxy / faltando
- **Commander no EDHREC** — recomendações da página do commander com barras de sinergia

Você também pode criar seus próprios widgets com um editor de código ao vivo e colocá-los em qualquer canvas.

## Chat com IA

O painel de IA (toggle na sidebar esquerda) conecta ao Claude e já conhece o seu deck. Ele usa a sua autenticação existente do Claude Code — sem precisar configurar uma API key separada se você já tem o Claude Code instalado.

O que há de novo na v1.0.0: **o Claude agora consegue interagir diretamente com a interface**. O novo MCP `chat-controller` dá ao Claude duas ferramentas:

- `emit_block` — empurra conteúdo rico para o chat: showcases de cards, sugestões de swap, diffs de deck, eventos de navegação, indicadores de "pensando"
- `ask` — mostra ao usuário um prompt interativo (escolha, confirmação ou seleção de card) e aguarda a resposta antes de continuar

Então em vez de o Claude descrever em texto o que fazer, ele pode mostrar os cards sobre os quais está falando, sugerir uma troca com um botão para aceitar com um clique, ou pedir que você escolha entre dois commanders diretamente no chat.

Claude CLI e OpenAI são suportados como providers.

## Coleção & Wishlist

**Coleção**: rastreie cada card físico com condição, status de foil, idioma, preço de aquisição e atribuição a um recipient (pasta, caixa, deck box). Import em massa no formato `4 Lightning Bolt`, export em CSV, valor do portfólio em um olhar.

**Wishlist**: níveis de prioridade (Low / Normal / High / Critical), reordenar arrastando, badge "em posse" quando você tem o card, adicionar a qualquer deck inline.

**Status no canvas**: os cards mostram um dot colorido — verde se está na pasta certa, amarelo se está em outra, azul se está na coleção mas sem atribuição, vermelho se está faltando.

## Commander Spellbook

Abra qualquer deck e clique na aba **Combos** — ele busca todos os combos conhecidos envolvendo seus cards no Commander Spellbook e mostra com a lista completa, os passos e o resultado.

## Busca Global

**Ctrl+K** abre um overlay em tela cheia que busca páginas, decks, pastas e cards de uma vez só. Navegação completa pelo teclado.

## Por Baixo do Capô

- Electron 33 + React 19 + TypeScript + Vite + Tailwind CSS v3
- Dois bancos SQLite: `library.db` para seus dados, `prints.db` para o catálogo de cards
- MCP server com 31 ferramentas e 5 recursos — o próprio Forge funciona como MCP server dentro do Claude Code
- Canvas com DOM imperativo (sem re-renders do React para pan/zoom com 100+ cards)
- Todos os dados em `~/karnData/`

## Download

Baixe o instalador na [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.0.0). O instalador NSIS para Windows já está disponível; builds para macOS e Linux em breve.

Você também vai querer o [Karn Arsenal](https://github.com/karn-mtg/karn/releases) para o banco de dados de cards — a página de Configurações do Forge cuida do download e registro automaticamente.

## O Que Vem Por Aí

- Build DMG para macOS e AppImage para Linux
- Compartilhamento de deck — links públicos e import por URL
- Import do Moxfield / Archidekt / Deckbox
- Mais ações de canvas com IA (agrupar automaticamente por estratégia, destacar sinergias)

---

Dúvidas ou problemas? [GitHub Issues](https://github.com/karn-mtg/forge/issues) é o lugar.
