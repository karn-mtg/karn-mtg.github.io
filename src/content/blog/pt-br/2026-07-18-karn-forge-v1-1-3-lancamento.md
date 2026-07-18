---
title: Karn Forge v1.1.3 — Servidores MCP Corrigidos
description: Uma atualização de patch corrigindo os servidores MCP karnforge e karn Arsenal, que estavam falhando ao conectar no Windows.
date: '2026-07-18'
author: karn-team
tags: ['release', 'forge', 'v1.1.3']
lang: pt-br
---

# Karn Forge v1.1.3

Esta é uma atualização de patch focada: ela corrige os dois servidores MCP do Karn Forge, que podiam falhar ao conectar após a instalação — algo especialmente visível se você usa o Forge através de um agente de IA como o Claude Code.

## O Que Foi Corrigido

### Servidor MCP karnforge travando na inicialização

O servidor MCP karnforge roda seu código TypeScript através do `tsx` dentro do app Electron empacotado. O resolvedor de módulos do `tsx` não recorre ao `NODE_PATH` como o Node padrão faz, então dependências como `zod` e `esbuild` — presentes no app empacotado mas não descompactadas no sistema de arquivos real — ficavam impossíveis de resolver. O servidor travava antes mesmo de conseguir conectar, e o Claude Code (ou qualquer cliente MCP) simplesmente via ele como falho.

A correção descompacta todo o `node_modules` em vez de escolher pacotes individuais, então toda dependência fica em disco onde a resolução de módulos normal consegue encontrar.

### Logs de inicialização corrompendo a conexão MCP

Uma chamada `console.log` durante a inicialização do banco de dados estava escrevendo texto puro no stdout — o mesmo stream que servidores MCP usam para JSON-RPC. Como isso rodava antes mesmo do transporte conectar, corrompia o handshake em toda inicialização. Os logs de inicialização agora vão para o stderr, onde deveriam estar.

### Binário do servidor karn Arsenal

Separadamente, a release anterior do servidor karn Arsenal (`server-v1.1.0`) tinha um bundle de DLL do Python corrompido e falhava imediatamente com um erro de `LoadLibrary` no Windows. A `server-v1.1.1` corrige isso — o motor de regras, detecção de combos e busca semântica do Arsenal estão de volta ao ar.

## Como Atualizar

Se você já tem o Forge instalado, abra **Configurações → Atualizações** e clique em **Verificar Atualizações**. Se o Arsenal mostrar uma atualização para o componente de servidor, instale ela também.

Para uma instalação do zero, baixe na [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.1.3).

## O Que Vem Por Aí

- Builds para macOS (DMG) e Linux (AppImage)
- Compartilhamento de decks — links e importação por URL
- Importação do Moxfield, Archidekt e Deckbox
- Mais ações de canvas com IA

---

Dúvidas ou problemas? O lugar certo é o [GitHub Issues](https://github.com/karn-mtg/forge/issues).
