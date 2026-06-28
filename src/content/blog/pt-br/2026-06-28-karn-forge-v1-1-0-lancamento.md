---
title: Karn Forge v1.1.0 — Atualizações Automáticas
description: Karn Forge e o Arsenal agora se atualizam sozinhos. Sem mais downloads manuais de instaladores ou substituição de binários.
date: '2026-06-28'
author: karn-team
tags: ['release', 'forge', 'v1.1.0']
lang: pt-br
---

# Karn Forge v1.1.0

Esta versão tem um foco claro: o Karn Forge e o backend Arsenal agora se atualizam sozinhos. Você não vai mais precisar visitar a página de releases para ficar atualizado.

## O que há de novo

### Auto-atualização do app

O Forge verifica se há uma nova versão alguns segundos após iniciar. Quando há uma disponível, **Configurações → Atualizações** exibe uma notificação com um botão de download. Clique nele, aguarde o download e clique em **Instalar** — o app reinicia com a nova versão aplicada.

Sem precisar baixar um novo instalador, executá-lo ou lidar com o anterior. A atualização é instalada diretamente dentro do app em execução.

### Assistente de instalação no primeiro uso

Configurar o Arsenal numa instalação nova exigia algum trabalho manual. Agora há um assistente com um clique. Na primeira abertura, o Forge pede para você configurar o Arsenal e gerencia os três downloads em sequência — o binário do servidor, o banco de dados de cards e o banco de dados de regras — com um indicador de progresso em tempo real para cada etapa.

O processo completo leva menos de um minuto com uma conexão típica.

### Arsenal Server com auto-atualização

O backend do Arsenal agora consegue se atualizar em tempo real. Quando uma nova versão do servidor está disponível, ela aparece listada junto com os bancos de dados de cards e regras no painel do Arsenal — e a atualização funciona da mesma forma: clique, aguarde, pronto. Sem substituição manual de binário.

## Por baixo dos panos

- `electron-updater` cuida do fluxo de atualização do app com uma bridge IPC personalizada para o renderer
- O endpoint `/updates` do Arsenal agora verifica os quatro componentes em uma só requisição: servidor, cards, regras e agent
- Novo endpoint `/update/server` transmite o progresso do download via SSE para que a interface mostre uma barra de progresso em tempo real
- As configurações do MCP são reescritas automaticamente após qualquer instalação ou atualização, então o Claude sempre encontra o caminho do binário mais recente sem precisar reiniciar

## Download / Atualização

Se você já está usando o Forge, abra **Configurações → Atualizações** e clique em **Verificar Atualizações**. O Forge deve encontrar a v1.1.0 automaticamente.

Para uma instalação nova, baixe o instalador na [página de Releases](https://github.com/karn-mtg/forge/releases/tag/v1.1.0).

## O que vem por aí

- Build para macOS DMG e Linux AppImage
- Compartilhamento de decks — links compartilháveis e importação via URL
- Importação do Moxfield, Archidekt e Deckbox
- Mais ações do canvas com IA

---

Dúvidas ou problemas? [GitHub Issues](https://github.com/karn-mtg/forge/issues) é o lugar certo.
