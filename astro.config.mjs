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
              label: 'Getting Started',
              translations: { 'pt-BR': 'Primeiros Passos', de: 'Erste Schritte', es: 'Primeros Pasos' },
              slug: 'getting-started',
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
