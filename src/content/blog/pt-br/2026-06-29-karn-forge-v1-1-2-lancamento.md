---
title: Karn Forge v1.1.2 — Correções e Melhorias para Desenvolvimento
description: Uma atualização de patch corrigindo o carregamento do logo, ordenação do schema do banco de dados e erros de inicialização, além de melhorias para desenvolvedores.
date: '2026-06-29'
author: karn-team
tags: ['release', 'forge', 'v1.1.2']
lang: pt-br
---

# Karn Forge v1.1.2

A v1.1.2 é uma atualização pequena, mas importante. Ela corrige alguns bugs silenciosos que podiam causar problemas em builds empacotados, e traz melhorias que tornam a experiência de desenvolvimento bem mais agradável.

## O Que Foi Corrigido

### Logo da Sidebar Sumindo em Builds Empacotados

O logo do Karn Forge não aparecia após a instalação em alguns sistemas. O logo era referenciado por um caminho estático (`/biglogo.png`) que funciona em desenvolvimento, mas quebra no app Electron empacotado, onde os assets são organizados de forma diferente. Agora ele usa a URL correta do asset bundled e carrega normalmente em qualquer ambiente.

### Index do Banco Criado Antes da Tabela Existir

Um bug de ordenação no schema fazia o index da tabela `collection` (que referencia a tabela `recipients`) ser declarado antes da criação de `recipients`. Isso não causava crashes visíveis na maioria dos casos, mas estava errado — o index agora é criado no bloco de migração, onde deveria estar desde o início.

### Erros de Inicialização Sendo Ignorados

Se o banco de dados falhasse durante a inicialização, o erro era descartado sem nenhum log, tornando quase impossível diagnosticar o problema. A inicialização agora envolve o banco em um try/catch adequado e registra o erro completo com stack trace antes de relançá-lo.

## O Que É Novo

### Builds de Dev Usam Diretório de Dados Separado

Rodar o Forge em modo de desenvolvimento (`npm run dev`) agora armazena os dados em `karnData-dev`, e não mais na sua pasta real `karnData`. Isso significa que testes e experimentos durante o desenvolvimento não podem corromper ou interferir na sua coleção real. Builds de produção não são afetados.

### Badge DEV em Modo de Desenvolvimento

Um pequeno badge **DEV** agora aparece no canto da janela quando o Forge está rodando em modo de desenvolvimento. É um detalhe, mas torna imediato saber qual janela é a build de dev e qual é uma instalação de produção — sem mais adivinhações.

## Como Atualizar

Se você já tem o Forge instalado, abra **Configurações → Atualizações** e clique em **Verificar Atualizações**.

Para uma instalação do zero, baixe na [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.1.2).

## O Que Vem Por Aí

- Builds para macOS (DMG) e Linux (AppImage)
- Compartilhamento de decks — links e importação por URL
- Importação do Moxfield, Archidekt e Deckbox
- Mais ações de canvas com IA

---

Dúvidas ou problemas? O lugar certo é o [GitHub Issues](https://github.com/karn-mtg/forge/issues).
