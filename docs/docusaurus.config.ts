import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';
import type * as Redocusaurus from 'redocusaurus';

import versions from './versions.json';

const config: Config = {
  title: 'StableCoin ',
  favicon: '/img/favicon.ico',
  url: 'https://docs.s3.money',
  baseUrl: '/',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
    [
      'redocusaurus',
      {
        // Plugin Options for loading OpenAPI files
        specs: [
          // Pass it a path to a local OpenAPI YAML file
          {
            // Redocusaurus will automatically bundle your spec into a single file during the build
            spec: './openapi/pravica-apis.openapi.json',
            route: '/api',
          },
        ],
        // Theme Options for modifying how redoc renders them
        theme: {
          // Change with your site colors
          primaryColor: '#FFAA71',
        },
      },
    ] satisfies Redocusaurus.PresetEntry,
  ],

  themeConfig: {
    navbar: {
      logo: {
        alt: 'wrapper-async',
        srcDark: '/img/full_logo_white.png',
        src: '/img/full_logo.png',
      },
      items: [
        {
          label: 'Docs',
          position: 'left',
          to: '/docs/category/overview',
          activeBasePath: '/docs',
        },
        {
          label: 'APIs',
          position: 'left',
          to: '/api',
        },
        {
          href: 'https://github.com/PravicaInc/S3.MONEY',
          label: 'GitHub',
          position: 'right',
        },
        {
          label: 'Support',
          href: 'https://github.com/PravicaInc/S3.MONEY/issues',
          position: 'right',
        },
        {
          type: 'docsVersion',
          position: 'right',
          label: `v${versions[0]}`,
        },
      ],

    },

    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
