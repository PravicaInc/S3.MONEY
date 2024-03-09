import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0D0D12',
        secondary: '#808897',
        actionPrimary: '#FE6321',
        actionSecondary: '#FFAA71',
        primaryPageBG: 'rgb(248, 249, 251)',
        secondaryPageBG: 'rgb(253, 241, 238)',
        primaryBorder: '#DFE1E6',
        modalBackdropColor: '#00000088',
      },
      boxShadow: {
        button: '1px 2px 4px 0px rgba(13, 13, 18, 0.12)',
      },
    },
  },
  plugins: [],
};

export default config;
