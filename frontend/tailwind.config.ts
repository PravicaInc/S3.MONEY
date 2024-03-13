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
        pageBgPrimary: 'rgb(248, 249, 251)',
        pageBgSecondary: 'rgb(253, 241, 238)',
        borderPrimary: '#DFE1E6',
        modalBackdropColor: '#00000088',
      },
      backgroundImage: {
        buttonBgMain: 'linear-gradient(0deg, #FE6321, #FE6321)',
        buttonBgAfter: 'linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      boxShadow: {
        button: '1px 2px 4px 0px rgba(13, 13, 18, 0.12)',
        'stableCoinForm': '0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814',
      },
    },
  },
  plugins: [],
};

export default config;
