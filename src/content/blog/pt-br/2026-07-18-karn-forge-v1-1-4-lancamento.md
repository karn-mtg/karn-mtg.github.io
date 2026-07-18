---
title: Karn Forge v1.1.4 — Busca de Cards Corrigida
description: Um patch que corrige a busca de cards, que podia retornar zero resultados silenciosamente por causa de uma incompatibilidade no schema do banco de dados.
date: '2026-07-18'
author: karn-team
tags: ['release', 'forge', 'v1.1.4']
lang: pt-br
---

# Karn Forge v1.1.4

Este é um patch pequeno, mas importante: a busca de cards foi corrigida. Se você atualizou seu banco de dados de cards recentemente e não conseguiu nem encontrar seu próprio comandante, essa é a correção.

## O que foi corrigido

### Busca de cards não retornava resultados

A busca de cards do Karn Forge consultava algumas colunas — `image_url` e `released_at` — diretamente da tabela `cards`. Essas colunas não existem mais lá: dados específicos de cada impressão, como a arte do card, foram movidos para uma tabela própria, `card_images`, indexada por `oracle_id`, já que um mesmo card pode ter várias impressões com artes diferentes.

Essa incompatibilidade fazia toda consulta de busca falhar no nível do banco de dados. Não havia nenhum aviso de erro ou ícone de imagem quebrada — a busca simplesmente voltava vazia, sempre, para qualquer card, incluindo seu comandante. Agora a arte do card também é escolhida corretamente em cada resultado de busca, usando a impressão mais recente que realmente tem arte disponível.

## Como atualizar

Abra **Settings → Updates** e clique em **Check for Updates** para receber essa correção automaticamente.

Para uma instalação nova, baixe na [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.1.4).

## O que vem por aí

- Builds de DMG para macOS e AppImage para Linux
- Compartilhamento de decks — links compartilháveis e importação por URL
- Importação de Moxfield / Archidekt / Deckbox
- Mais ações de IA no canvas

---

Dúvidas ou problemas? [GitHub Issues](https://github.com/karn-mtg/forge/issues) é o lugar certo.
