---
title: Karn Forge v1.1.1 — Correção de Instalação no Windows
description: Um patch focado que corrige vários crashes que impediam o Karn Forge de funcionar corretamente após a instalação no Windows.
date: '2026-06-29'
author: karn-team
tags: ['release', 'forge', 'v1.1.1']
lang: pt-br
---

# Karn Forge v1.1.1

Se você instalou o v1.1.0 no Windows e encontrou um crash na inicialização — ou descobriu que o chat de IA nunca funcionou — este é o patch para você. O v1.1.1 é uma versão de correção de bugs sem nenhuma funcionalidade nova; ele apenas garante que o app funcione corretamente após a instalação.

## O que foi corrigido

### Crash "Cannot find module" na inicialização

O problema mais visível: após instalar o v1.1.0, o Forge travava imediatamente com um erro sobre um módulo não encontrado. O build empacotado estava sem vários diretórios internos (`utils/`, `mcp/`) que o app precisa na inicialização. Corrigido — esses diretórios agora estão incluídos corretamente.

### Chat de IA sempre falhando no Windows

Mesmo que o app iniciasse, começar um chat de IA falhava imediatamente com "Failed to start Claude". A causa raiz era que o Forge passava um diretório de trabalho inválido para o subprocesso do Claude — um caminho virtual dentro do arquivo do app que o Windows não reconhece como uma pasta real. O subprocesso agora inicia a partir do diretório home do usuário, que sempre existe.

### Servidores MCP nunca registrando com o Claude

A integração MCP do Karn (as ferramentas que permitem ao Claude pesquisar cards, ler sua biblioteca e interagir com o canvas) falhou silenciosamente ao se registrar. O arquivo de configuração era gravado em um local somente leitura dentro do arquivo do app, em vez de `~/.claude/settings.json`, onde o Claude realmente lê. Corrigido.

### Dados do canvas apagados ao usar ferramentas MCP de canvas

Se o Claude usasse uma ferramenta de arrangement de canvas (criar grupo, criar sticker), ele sobrescrevia silenciosamente o estado existente do canvas apenas com o novo elemento, perdendo todo o resto. Uma incompatibilidade no nome da propriedade (`canvas_json` vs `canvasJson`) fazia a leitura do canvas sempre retornar vazio antes de escrever. Corrigido.

### Instalador do Windows não conseguia ser gerado

O build de CI falhava ao produzir um instalador do Windows porque o arquivo `icon.ico` necessário estava ausente do repositório. O ícone agora é gerado e incluído, então os instaladores serão gerados corretamente daqui em diante.

## Como atualizar

Se você já está rodando o Forge, abra **Configurações → Atualizações** e clique em **Verificar Atualizações** — o Forge encontrará o v1.1.1 automaticamente.

Para uma instalação nova, baixe a versão mais recente na [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.1.1).

## O que vem a seguir

- Builds para macOS (DMG) e Linux (AppImage)
- Compartilhamento de decks — links compartilháveis e importação por URL
- Importação do Moxfield / Archidekt / Deckbox
- Mais ações de canvas com IA

---

Dúvidas ou problemas? [GitHub Issues](https://github.com/karn-mtg/forge/issues) é o lugar certo.
