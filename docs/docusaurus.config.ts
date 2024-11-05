import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';

import versions from './versions.json';

const config: Config = {
  title: 'StableCoin ',
  favicon: '/img/favicon.ico',
  url: 'https://docs.s3.money.com',
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
