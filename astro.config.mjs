import { defineConfig } from 'astro/config'
import starlight from '@astrojs/starlight'
import tailwind from '@astrojs/tailwind'

export default defineConfig({
  site: 'https://karn-mtg.github.io',
  integrations: [
    starlight({
      title: 'Karn Forge',
      description: 'The ultimate Magic: The Gathering deck builder',
      logo: {
        src: './public/icon.png',
        replacesTitle: false,
      },
      favicon: '/icon.png',
      defaultLocale: 'root',
      locales: {
        root: { label: 'English', lang: 'en' },
        'pt-br': { label: 'Português', lang: 'pt-BR' },
        de: { label: 'Deutsch', lang: 'de' },
        es: { label: 'Español', lang: 'es' },
      },
      customCss: ['./src/styles/global.css'],
      components: {
        Header: './src/components/starlight/Header.astro',
      },
      sidebar: [
        {
          label: 'Getting Started',
          translations: { 'pt-BR': 'Primeiros Passos', de: 'Erste Schritte', es: 'Primeros Pasos' },
          items: [
            {
              label: 'Introduction',
              translations: { 'pt-BR': 'Introdução', de: 'Einführung', es: 'Introducción' },
              slug: 'introduction',
            },
            {
              label: 'Installation',
              translations: { 'pt-BR': 'Instalação', de: 'Installation', es: 'Instalación' },
              slug: 'getting-started',
            },
            {
              label: 'Quick Start',
              translations: { 'pt-BR': 'Início Rápido', de: 'Schnellstart', es: 'Inicio Rápido' },
              slug: 'quick-start',
            },
          ],
        },
        {
          label: 'Features',
          translations: { 'pt-BR': 'Funcionalidades', de: 'Funktionen', es: 'Funcionalidades' },
          items: [
            {
              label: 'Dashboard',
              slug: 'features/dashboard',
            },
            {
              label: 'Deck Workshop',
              translations: { 'pt-BR': 'Oficina de Deck', de: 'Deck-Werkstatt', es: 'Taller de Mazos' },
              slug: 'features/deck-workshop',
            },
            {
              label: 'Card Search',
              translations: { 'pt-BR': 'Busca de Cartas', de: 'Kartensuche', es: 'Búsqueda de Cartas' },
              slug: 'features/card-search',
            },
            {
              label: 'Collection',
              translations: { 'pt-BR': 'Coleção', de: 'Sammlung', es: 'Colección' },
              slug: 'features/collection',
            },
            {
              label: 'Wishlist',
              translations: { 'pt-BR': 'Lista de Desejos', de: 'Wunschliste', es: 'Lista de Deseos' },
              slug: 'features/wishlist',
            },
            {
              label: 'AI Assistant',
              translations: { 'pt-BR': 'Assistente IA', de: 'KI-Assistent', es: 'Asistente IA' },
              slug: 'features/ai-assistant',
            },
            {
              label: 'Arsenal',
              slug: 'features/arsenal',
            },
          ],
        },
        {
          label: 'Reference',
          translations: { 'pt-BR': 'Referência', de: 'Referenz', es: 'Referencia' },
          items: [
            {
              label: 'Keyboard Shortcuts',
              translations: { 'pt-BR': 'Atalhos de Teclado', de: 'Tastenkürzel', es: 'Atajos de Teclado' },
              slug: 'reference/keyboard-shortcuts',
            },
            {
              label: 'Supported Formats',
              translations: { 'pt-BR': 'Formatos Suportados', de: 'Unterstützte Formate', es: 'Formatos Soportados' },
              slug: 'reference/supported-formats',
            },
            {
              label: 'Import Formats',
              translations: { 'pt-BR': 'Formatos de Importação', de: 'Importformate', es: 'Formatos de Importación' },
              slug: 'reference/import-formats',
            },
            {
              label: 'Widgets',
              slug: 'reference/widgets',
            },
          ],
        },
        {
          label: 'Contributing',
          translations: { 'pt-BR': 'Contribuindo', de: 'Mitwirken', es: 'Contribuir' },
          items: [
            {
              label: 'Overview',
              translations: { 'pt-BR': 'Visão Geral', de: 'Übersicht', es: 'Descripción General' },
              slug: 'contributing/overview',
            },
            {
              label: 'Development Setup',
              translations: { 'pt-BR': 'Configuração de Desenvolvimento', de: 'Entwicklungsumgebung', es: 'Configuración de Desarrollo' },
              slug: 'contributing/dev-setup',
            },
            {
              label: 'Architecture',
              translations: { 'pt-BR': 'Arquitetura', de: 'Architektur', es: 'Arquitectura' },
              slug: 'contributing/architecture',
            },
          ],
        },
      ],
      social: {
        github: 'https://github.com/karn-mtg',
      },
    }),
    tailwind({ applyBaseStyles: false }),
  ],
})
