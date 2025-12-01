import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'TuAgenda Docs',
  tagline: 'Documentación técnica del proyecto TuAgenda',
  favicon: 'img/favicon.jpg',

  future: {
    v4: true,
  },

  url: 'https://tuagenda-docs.vercel.app',
  baseUrl: '/',

  organizationName: 'tuagenda',
  projectName: 'tuagenda',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'es',
    locales: ['es'],
  },

  // Mermaid configuration
  markdown: {
    mermaid: true,
  },
  themes: ['@docusaurus/theme-mermaid'],

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          routeBasePath: '/', // Docs at root
        },
        blog: false, // Disable blog
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/tuagenda-social-card.jpg',
    colorMode: {
      defaultMode: 'light',
      respectPrefersColorScheme: true,
    },
    mermaid: {
      theme: { light: 'neutral', dark: 'dark' },
    },
    navbar: {
      title: 'TuAgenda',
      logo: {
        alt: 'TuAgenda Logo',
        src: 'img/logo.png',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'docsSidebar',
          position: 'left',
          label: 'Documentación',
        },
        {
          href: 'https://github.com/tuagenda/tuagenda',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Documentación',
          items: [
            {
              label: 'Introducción',
              to: '/',
            },
            {
              label: 'Arquitectura',
              to: '/architecture/overview',
            },
            {
              label: 'Base de Datos',
              to: '/database/erd',
            },
          ],
        },
        {
          title: 'Flujos',
          items: [
            {
              label: 'Autenticación',
              to: '/flows/authentication',
            },
            {
              label: 'Booking',
              to: '/flows/booking',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} TuAgenda. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
      additionalLanguages: ['bash', 'json'],
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
