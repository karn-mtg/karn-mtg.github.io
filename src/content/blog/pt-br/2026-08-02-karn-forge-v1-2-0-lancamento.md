---
title: Karn Forge v1.2.0 — Tags Comandam seu Canvas, Além do Valor do Deck
description: Os grupos do canvas agora são construídos a partir das tags dos cards, com um novo Tag Manager, um widget de Valor do Deck e uma suíte de testes completa por baixo do capô.
date: '2026-08-02'
author: karn-team
tags: ['release', 'forge', 'v1.2.0']
lang: pt-br
---

# Karn Forge v1.2.0

Este release repensa como o canvas de arranjo agrupa seus cards, e adiciona um widget que muita gente estava pedindo: valor do deck.

## O que há de novo

### Grupos do canvas agora vêm das tags

Antes, os grupos do canvas só existiam como containers para onde você arrastava cards no canvas do workshop. Agora, os grupos são calculados diretamente a partir das tags dos seus cards — marque alguns cards como "Ramp" ou "Removal" e eles aparecem agrupados automaticamente no canvas, no nível de agrupamento que você estiver vendo.

Isso também significa que tagging agora é parte central da montagem do deck, e não só um efeito colateral de organizar cards visualmente. Você pode criar, renomear e atribuir tags direto na tela do deck com o novo **Tag Manager**, e editar as tags de um card inline, sem abrir uma janela separada.

### Widget de Valor do Deck

Tem um widget novo para o canvas: **Deck Value**. Ele mostra o valor de mercado estimado (em USD, sem foil) do seu deck com base nos dados de preço do Scryfall, e indica quantos cards do deck ainda não têm dado de preço disponível. Você pode incluir o sideboard ou só o deck principal.

## Por baixo do capô

Esse release também traz uma suíte de testes de verdade para o Forge pela primeira vez — vitest e Testing Library agora cobrem stores, hooks e funções utilitárias, o que deve significar menos regressões conforme o app cresce. Também tem um novo script de visual-inspect para capturar screenshots da UI rapidamente durante o desenvolvimento.

## Como atualizar

Abra **Settings → Updates** e clique em **Check for Updates** para receber essa atualização automaticamente.

Para uma instalação nova, baixe na [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.2.0).

## O que vem por aí

- Builds de DMG para macOS e AppImage para Linux
- Compartilhamento de decks — links compartilháveis e importação por URL
- Importação de Moxfield / Archidekt / Deckbox

---

Dúvidas ou problemas? [GitHub Issues](https://github.com/karn-mtg/forge/issues) é o lugar certo.
