import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        error: '#F04438',
        primary: '#0D0D12',
        secondary: '#808897',
        actionPrimary: '#FE6321',
        actionSecondary: '#FFAA71',
        pageBgPrimary: 'rgb(248, 249, 251)',
        pageBgSecondary: 'rgb(253, 241, 238)',
        borderPrimary: '#DFE1E6',
        modalBackdropColor: '#00000088',

        // custom colors
        seashell: '#F0F0F0',
        lavenderGrey: '#C1C7CF',
        hitGrey: '#A4ABB8',
        antiqueWhite: '#FFE8D4',
        deepPeach: '#FFCDA8',
        snowDrift: '#F8F9FB',
        mistBlue: '#666D80',
        tuna: '#353849',
        riverBed: '#475467',
        alabaster: '#F9FAFB',
        deepSapphire: '#062863',
        mistyRose: '#FEE4E2',
        whiteIce: '#DCFAE6',
        whiteLilac: '#F6F8FA',
        ebonyClay: '#272835',
        twilightBlue: '#EFFEFA',
        darkMintGreen: '#00C75C',
        rubyRed: '#FF2B1D',
        greenishBlue: '#28806F',
        grapefruit: '#D92D20',
        santaGrey: '#98A2B3',
        shamrockGreen: '#079455',
        mangoOrange: '#FF7C38',
        pickledBluewood: '#344054',
        dawnPink: '#EAECF0',
        freshGreen: '#42DB64',
      },
      backgroundImage: {
        buttonBgMain: 'linear-gradient(0deg, #FE6321, #FE6321)',
        buttonBgAfter: 'linear-gradient(180deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0) 100%)',
      },
      boxShadow: {
        operationIcon: '0px 1.6666666269302368px 3.3333332538604736px 0px #0D0D121F',
        button: '0px 1px 2px 0px #1018280D',
        stableCoinForm: '0px 8px 8px -4px #10182808, 0px 20px 24px -4px #10182814',
        backgroundModalDecorative: '0px 1px 2px 0px #1018280D',
        logoutButton: '1px 2px 4px 0px #0D0D1214',
        rolesDropdownTriggerActive: '0px 0px 0px 4px #FE63211F',
        rolesDropdown: '0px 4px 6px -2px #10182808, 0px 12px 16px -4px #10182814',
      },
    },
  },
  plugins: [],
};

export default config;
