export type Lang = 'en' | 'pt-br' | 'de' | 'es'

export const locales: Array<{ locale: string | undefined; lang: Lang }> = [
  { locale: undefined, lang: 'en' },
  { locale: 'pt-br', lang: 'pt-br' },
  { locale: 'de', lang: 'de' },
  { locale: 'es', lang: 'es' },
]

export const languages: Record<Lang, { label: string; flagCode: string }> = {
  en: { label: 'English', flagCode: 'gb' },
  'pt-br': { label: 'Português', flagCode: 'br' },
  de: { label: 'Deutsch', flagCode: 'de' },
  es: { label: 'Español', flagCode: 'es' },
}

export function getLang(locale: string | undefined): Lang {
  if (locale === 'pt-br') return 'pt-br'
  if (locale === 'de') return 'de'
  if (locale === 'es') return 'es'
  return 'en'
}

export function contentPrefix(lang: Lang): string {
  return `${lang}/`
}

export function blogBase(lang: Lang): string {
  return lang === 'en' ? '/blog' : `/${lang}/blog`
}

export function docsBase(lang: Lang): string {
  return lang === 'en' ? '/getting-started' : `/${lang}/getting-started`
}

export function homeBase(lang: Lang): string {
  return lang === 'en' ? '/' : `/${lang}`
}

export function downloadBase(lang: Lang): string {
  return lang === 'en' ? '/download' : `/${lang}/download`
}

const ui = {
  en: {
    // Meta
    landingTitle: 'Karn Forge — Magic: The Gathering Deck Builder',
    landingDescription: 'Free, open-source Magic: The Gathering deck builder. Build visually, manage your collection, analyze your decks.',
    dateLocale: 'en-US',
    // Nav
    navDocs: 'Docs',
    navBlog: 'Blog',
    // Hero
    heroBadge: 'Open Source · Free',
    heroHeadlineTop: 'Build Better Decks,',
    heroHeadlineBottom: 'Win More Games.',
    heroSub: 'Karn Forge is a powerful desktop deck builder for Magic: The Gathering. Manage your collection, build decks visually, and analyze your plays — all in one place.',
    heroCta: 'Download for Free',
    heroCtaSub: 'Available for Windows & macOS',
    heroDocs: 'Read the Docs',
    // Features
    featuresHeading: 'Everything you need',
    featuresSubheading: 'Built by players, for players.',
    features: [
      { icon: '🃏', title: 'Visual Canvas', desc: 'Drag and drop cards onto an infinite canvas. Group by strategy, add sticky notes, and see your deck like a designer.' },
      { icon: '📦', title: 'Collection Management', desc: 'Import from Moxfield, Archidekt, or CSV. Track what you own and see real-time market prices.' },
      { icon: '📊', title: 'Deep Analytics', desc: 'Mana curve, type distribution, synergy analysis. Make data-driven decisions on every cut.' },
      { icon: '🌐', title: 'Live Card Data', desc: 'Always up-to-date with the Scryfall database. Every card, every printing, every format.' },
      { icon: '✈️', title: 'Works Offline', desc: 'Build and edit decks without internet. Everything syncs automatically when you come back online.' },
      { icon: '🔓', title: 'Open Source', desc: 'Completely free. No subscriptions, no locked features. Built by the community, for the community.' },
      { icon: '🤖', title: 'Magic-Native AI', desc: 'Your AI tools learn the language of Magic. Rules, synergies, and metagame — Karn\'s AI grows more specialized in MTG with every conversation.' },
    ],
    // Download CTA
    ctaHeading: 'Ready to get started?',
    ctaSub: 'Download Karn Forge for free and take your deckbuilding to the next level.',
    ctaButton: 'Download Karn Forge',
    ctaBlog: 'Visit the Blog',
    // Blog
    blogSubtitle: 'Updates, guides, and news from the Karn Forge team.',
    backToBlog: '← Back to Blog',
    allPosts: '← All posts',
    filterAll: 'All',
    readMore: 'Read more',
    noResults: 'No posts found for this tag.',
    tagPrefix: 'Tag:',
    tagCount: (n: number, tag: string) => `${n} post${n !== 1 ? 's' : ''} tagged with "${tag}"`,
    authorCount: (n: number) => `${n} post${n !== 1 ? 's' : ''}`,
    // Download page
    navDownload: 'Download',
    downloadTitle: 'Download — Karn Forge',
    downloadDescription: 'Download Karn Forge for Windows, macOS, or Linux. Free and open source.',
    downloadHeading: 'Download Karn Forge',
    downloadSub: 'Free. Open source. Available for all major platforms.',
    downloadVersion: 'Latest release',
    downloadMacLabel: 'macOS',
    downloadMacDesc: 'For Mac computers with Intel or Apple Silicon processors.',
    downloadMacIntel: 'Download for Intel',
    downloadMacSilicon: 'Download for Apple Silicon',
    downloadWinLabel: 'Windows',
    downloadWinDesc: 'For 64-bit Windows 10 and later.',
    downloadWinBtn: 'Download for Windows',
    downloadLinuxLabel: 'Linux',
    downloadLinuxDesc: 'AppImage for x86_64 distributions.',
    downloadLinuxBtn: 'Download AppImage',
    downloadNote: 'Requires macOS 11+, Windows 10+, or a modern 64-bit Linux distribution.',
    downloadAllReleases: 'All releases on GitHub',
    // Footer
    footerCopy: '© 2026 Karn Forge. Open source under MIT.',
    footerDocs: 'Docs',
    footerBlog: 'Blog',
    footerMadeBy: 'Made with ♥ by',
    footerDisclaimer: 'Magic: The Gathering, all card names, artwork, and related properties are owned by Wizards of the Coast. Karn Forge is an unofficial fan site not affiliated with or endorsed by Wizards of the Coast.',
  },

  'pt-br': {
    landingTitle: 'Karn Forge — Construtor de Decks de Magic: The Gathering',
    landingDescription: 'Construtor de decks de Magic: The Gathering gratuito e de código aberto. Construa visualmente, gerencie sua coleção, analise seus decks.',
    dateLocale: 'pt-BR',
    navDocs: 'Docs',
    navBlog: 'Blog',
    heroBadge: 'Código Aberto · Gratuito',
    heroHeadlineTop: 'Construa Melhores Decks,',
    heroHeadlineBottom: 'Vença Mais Jogos.',
    heroSub: 'Karn Forge é um construtor de decks desktop para Magic: The Gathering. Gerencie sua coleção, construa decks visualmente e analise suas jogadas — tudo em um lugar.',
    heroCta: 'Baixar Gratuitamente',
    heroCtaSub: 'Disponível para Windows e macOS',
    heroDocs: 'Ver a Documentação',
    featuresHeading: 'Tudo que você precisa',
    featuresSubheading: 'Construído por jogadores, para jogadores.',
    features: [
      { icon: '🃏', title: 'Canvas Visual', desc: 'Arraste e solte cartas em um canvas infinito. Agrupe por estratégia, adicione anotações e visualize seu deck como um designer.' },
      { icon: '📦', title: 'Gerenciamento de Coleção', desc: 'Importe suas cartas do Moxfield, Archidekt ou CSV. Acompanhe o que você possui e veja preços em tempo real.' },
      { icon: '📊', title: 'Análises Detalhadas', desc: 'Curva de mana, distribuição de tipos, análise de sinergia. Otimize seu deck com dados reais.' },
      { icon: '🌐', title: 'Dados de Cartas ao Vivo', desc: 'Sempre atualizado com o banco de dados Scryfall. Todas as cartas, todas as edições, todos os formatos.' },
      { icon: '✈️', title: 'Funciona Offline', desc: 'Construa e edite decks sem internet. Sincronize quando voltar online.' },
      { icon: '🔓', title: 'Código Aberto', desc: 'Totalmente gratuito. Sem assinaturas, sem recursos travados. Feito pela comunidade, para a comunidade.' },
      { icon: '🤖', title: 'IA Especializada em Magic', desc: 'Suas ferramentas de IA aprendem a linguagem do Magic. Regras, sinergias e metagame — a IA do Karn fica mais especializada a cada conversa.' },
    ],
    ctaHeading: 'Pronto para começar?',
    ctaSub: 'Baixe Karn Forge gratuitamente e leve a sua construção de decks ao próximo nível.',
    ctaButton: 'Baixar Karn Forge',
    ctaBlog: 'Ver o Blog',
    blogSubtitle: 'Atualizações, guias e novidades da equipe Karn Forge.',
    backToBlog: '← Voltar ao Blog',
    allPosts: '← Todos os posts',
    filterAll: 'Todos',
    readMore: 'Ler mais',
    noResults: 'Nenhum post encontrado para esta tag.',
    tagPrefix: 'Tag:',
    tagCount: (n: number, tag: string) => `${n} post${n !== 1 ? 's' : ''} com a tag "${tag}"`,
    authorCount: (n: number) => `${n} post${n !== 1 ? 's' : ''}`,
    navDownload: 'Download',
    downloadTitle: 'Download — Karn Forge',
    downloadDescription: 'Baixe Karn Forge para Windows, macOS ou Linux. Gratuito e de código aberto.',
    downloadHeading: 'Baixar Karn Forge',
    downloadSub: 'Gratuito. Código aberto. Disponível para as principais plataformas.',
    downloadVersion: 'Versão mais recente',
    downloadMacLabel: 'macOS',
    downloadMacDesc: 'Para Macs com processadores Intel ou Apple Silicon.',
    downloadMacIntel: 'Baixar para Intel',
    downloadMacSilicon: 'Baixar para Apple Silicon',
    downloadWinLabel: 'Windows',
    downloadWinDesc: 'Para Windows 10 64-bit ou superior.',
    downloadWinBtn: 'Baixar para Windows',
    downloadLinuxLabel: 'Linux',
    downloadLinuxDesc: 'AppImage para distribuições x86_64.',
    downloadLinuxBtn: 'Baixar AppImage',
    downloadNote: 'Requer macOS 11+, Windows 10+ ou uma distribuição Linux moderna de 64 bits.',
    downloadAllReleases: 'Todas as versões no GitHub',
    footerCopy: '© 2026 Karn Forge. Código aberto sob MIT.',
    footerDocs: 'Docs',
    footerBlog: 'Blog',
    footerMadeBy: 'Feito com ♥ por',
    footerDisclaimer: 'Magic: The Gathering, todos os nomes de cartas, artes e propriedades relacionadas pertencem à Wizards of the Coast. Karn Forge é um site de fãs não oficial, sem afiliação ou endosso da Wizards of the Coast.',
  },

  de: {
    landingTitle: 'Karn Forge — Magic: The Gathering Deck-Builder',
    landingDescription: 'Kostenloser, quelloffener Magic: The Gathering Deck-Builder. Baue Decks visuell, verwalte deine Sammlung, analysiere deine Spielzüge.',
    dateLocale: 'de-DE',
    navDocs: 'Docs',
    navBlog: 'Blog',
    heroBadge: 'Open Source · Kostenlos',
    heroHeadlineTop: 'Baue bessere Decks,',
    heroHeadlineBottom: 'Gewinne mehr Spiele.',
    heroSub: 'Karn Forge ist ein leistungsstarker Desktop-Deck-Builder für Magic: The Gathering. Verwalte deine Sammlung, baue Decks visuell und analysiere deine Spielzüge — alles an einem Ort.',
    heroCta: 'Kostenlos herunterladen',
    heroCtaSub: 'Verfügbar für Windows & macOS',
    heroDocs: 'Dokumentation lesen',
    featuresHeading: 'Alles, was du brauchst',
    featuresSubheading: 'Von Spielern, für Spieler.',
    features: [
      { icon: '🃏', title: 'Visuelles Canvas', desc: 'Karten per Drag & Drop auf ein unendliches Canvas ziehen. Nach Strategie gruppieren, Notizen hinzufügen und das Deck wie ein Designer sehen.' },
      { icon: '📦', title: 'Sammlungsverwaltung', desc: 'Import aus Moxfield, Archidekt oder CSV. Behalte den Überblick über deine Sammlung und sieh Echtzeit-Marktpreise.' },
      { icon: '📊', title: 'Detaillierte Analysen', desc: 'Manakurve, Typverteilung, Synergieanalyse. Datengestützte Entscheidungen bei jedem Deck-Cut.' },
      { icon: '🌐', title: 'Live-Kartendaten', desc: 'Immer aktuell mit der Scryfall-Datenbank. Jede Karte, jeder Druck, jedes Format.' },
      { icon: '✈️', title: 'Funktioniert offline', desc: 'Decks ohne Internet bauen und bearbeiten. Alles synchronisiert automatisch, wenn du wieder online bist.' },
      { icon: '🔓', title: 'Open Source', desc: 'Komplett kostenlos. Keine Abonnements, keine gesperrten Funktionen. Von der Community, für die Community.' },
      { icon: '🤖', title: 'Magic-spezialisierte KI', desc: 'Deine KI-Tools lernen die Sprache von Magic. Regeln, Synergien und Meta — Karns KI wird mit jedem Gespräch spezialisierter auf MTG.' },
    ],
    ctaHeading: 'Bereit loszulegen?',
    ctaSub: 'Lade Karn Forge kostenlos herunter und bringe deinen Deckbau auf das nächste Level.',
    ctaButton: 'Karn Forge herunterladen',
    ctaBlog: 'Zum Blog',
    blogSubtitle: 'Updates, Anleitungen und Neuigkeiten vom Karn Forge Team.',
    backToBlog: '← Zurück zum Blog',
    allPosts: '← Alle Beiträge',
    filterAll: 'Alle',
    readMore: 'Weiterlesen',
    noResults: 'Keine Beiträge für dieses Tag gefunden.',
    tagPrefix: 'Tag:',
    tagCount: (n: number, tag: string) => `${n} Beitrag${n !== 1 ? 'e' : ''} mit Tag "${tag}"`,
    authorCount: (n: number) => `${n} Beitrag${n !== 1 ? 'e' : ''}`,
    navDownload: 'Download',
    downloadTitle: 'Download — Karn Forge',
    downloadDescription: 'Lade Karn Forge für Windows, macOS oder Linux herunter. Kostenlos und Open Source.',
    downloadHeading: 'Karn Forge herunterladen',
    downloadSub: 'Kostenlos. Open Source. Für alle wichtigen Plattformen verfügbar.',
    downloadVersion: 'Neueste Version',
    downloadMacLabel: 'macOS',
    downloadMacDesc: 'Für Mac-Computer mit Intel- oder Apple-Silicon-Prozessoren.',
    downloadMacIntel: 'Für Intel herunterladen',
    downloadMacSilicon: 'Für Apple Silicon herunterladen',
    downloadWinLabel: 'Windows',
    downloadWinDesc: 'Für 64-Bit Windows 10 und höher.',
    downloadWinBtn: 'Für Windows herunterladen',
    downloadLinuxLabel: 'Linux',
    downloadLinuxDesc: 'AppImage für x86_64-Distributionen.',
    downloadLinuxBtn: 'AppImage herunterladen',
    downloadNote: 'Erfordert macOS 11+, Windows 10+ oder eine moderne 64-Bit-Linux-Distribution.',
    downloadAllReleases: 'Alle Versionen auf GitHub',
    footerCopy: '© 2026 Karn Forge. Open Source unter MIT.',
    footerDocs: 'Docs',
    footerBlog: 'Blog',
    footerMadeBy: 'Gemacht mit ♥ von',
    footerDisclaimer: 'Magic: The Gathering, alle Kartennamen, Kunstwerke und verwandte Eigenschaften sind Eigentum von Wizards of the Coast. Karn Forge ist eine inoffizielle Fan-Website ohne Verbindung zu oder Billigung durch Wizards of the Coast.',
  },

  es: {
    landingTitle: 'Karn Forge — Constructor de Mazos de Magic: The Gathering',
    landingDescription: 'Constructor de mazos de Magic: The Gathering gratuito y de código abierto. Construye visualmente, gestiona tu colección, analiza tus mazos.',
    dateLocale: 'es-ES',
    navDocs: 'Docs',
    navBlog: 'Blog',
    heroBadge: 'Código Abierto · Gratuito',
    heroHeadlineTop: 'Construye mejores mazos,',
    heroHeadlineBottom: 'Gana más partidas.',
    heroSub: 'Karn Forge es un potente constructor de mazos de escritorio para Magic: The Gathering. Gestiona tu colección, construye mazos visualmente y analiza tus jugadas — todo en un solo lugar.',
    heroCta: 'Descargar gratis',
    heroCtaSub: 'Disponible para Windows y macOS',
    heroDocs: 'Leer la documentación',
    featuresHeading: 'Todo lo que necesitas',
    featuresSubheading: 'Hecho por jugadores, para jugadores.',
    features: [
      { icon: '🃏', title: 'Canvas Visual', desc: 'Arrastra y suelta cartas en un lienzo infinito. Agrupa por estrategia, añade notas adhesivas y ve tu mazo como un diseñador.' },
      { icon: '📦', title: 'Gestión de colección', desc: 'Importa desde Moxfield, Archidekt o CSV. Rastrea lo que tienes y ve precios de mercado en tiempo real.' },
      { icon: '📊', title: 'Análisis detallado', desc: 'Curva de maná, distribución de tipos, análisis de sinergias. Toma decisiones basadas en datos en cada corte.' },
      { icon: '🌐', title: 'Datos de cartas en vivo', desc: 'Siempre actualizado con la base de datos de Scryfall. Cada carta, cada edición, cada formato.' },
      { icon: '✈️', title: 'Funciona sin conexión', desc: 'Construye y edita mazos sin internet. Todo se sincroniza automáticamente cuando vuelves a estar en línea.' },
      { icon: '🔓', title: 'Código abierto', desc: 'Completamente gratuito. Sin suscripciones, sin funciones bloqueadas. Construido por la comunidad, para la comunidad.' },
      { icon: '🤖', title: 'IA nativa de Magic', desc: 'Tus herramientas de IA aprenden el idioma de Magic. Reglas, sinergias y metagame — la IA de Karn se especializa más en MTG con cada conversación.' },
    ],
    ctaHeading: '¿Listo para empezar?',
    ctaSub: 'Descarga Karn Forge gratis y lleva tu construcción de mazos al siguiente nivel.',
    ctaButton: 'Descargar Karn Forge',
    ctaBlog: 'Visitar el Blog',
    blogSubtitle: 'Actualizaciones, guías y noticias del equipo de Karn Forge.',
    backToBlog: '← Volver al Blog',
    allPosts: '← Todos los artículos',
    filterAll: 'Todos',
    readMore: 'Leer más',
    noResults: 'No se encontraron artículos para esta etiqueta.',
    tagPrefix: 'Etiqueta:',
    tagCount: (n: number, tag: string) => `${n} artículo${n !== 1 ? 's' : ''} con la etiqueta "${tag}"`,
    authorCount: (n: number) => `${n} artículo${n !== 1 ? 's' : ''}`,
    navDownload: 'Descargar',
    downloadTitle: 'Descargar — Karn Forge',
    downloadDescription: 'Descarga Karn Forge para Windows, macOS o Linux. Gratuito y de código abierto.',
    downloadHeading: 'Descargar Karn Forge',
    downloadSub: 'Gratuito. Código abierto. Disponible para las principales plataformas.',
    downloadVersion: 'Última versión',
    downloadMacLabel: 'macOS',
    downloadMacDesc: 'Para Mac con procesadores Intel o Apple Silicon.',
    downloadMacIntel: 'Descargar para Intel',
    downloadMacSilicon: 'Descargar para Apple Silicon',
    downloadWinLabel: 'Windows',
    downloadWinDesc: 'Para Windows 10 de 64 bits o superior.',
    downloadWinBtn: 'Descargar para Windows',
    downloadLinuxLabel: 'Linux',
    downloadLinuxDesc: 'AppImage para distribuciones x86_64.',
    downloadLinuxBtn: 'Descargar AppImage',
    downloadNote: 'Requiere macOS 11+, Windows 10+ o una distribución Linux moderna de 64 bits.',
    downloadAllReleases: 'Todas las versiones en GitHub',
    footerCopy: '© 2026 Karn Forge. Código abierto bajo MIT.',
    footerDocs: 'Docs',
    footerBlog: 'Blog',
    footerMadeBy: 'Hecho con ♥ por',
    footerDisclaimer: 'Magic: The Gathering, todos los nombres de cartas, ilustraciones y propiedades relacionadas son propiedad de Wizards of the Coast. Karn Forge es un sitio de fans no oficial sin afiliación ni respaldo de Wizards of the Coast.',
  },
} as const

export type UI = (typeof ui)[Lang]

export function t(lang: Lang): UI {
  return ui[lang]
}
