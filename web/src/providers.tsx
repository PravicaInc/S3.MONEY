import React, { FC, PropsWithChildren, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';

import { OnboardingContext } from './contexts/onboarding.tsx';
import { PAGES_URLS } from './utils/const.ts';
import { USER_TYPE } from './types';

const { networkConfig } = createNetworkConfig({
  devnet: { url: getFullnodeUrl('devnet') },
  localnet: { url: getFullnodeUrl('localnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
});

const purpleColors = [
  '#F3ECFF',
  '#E8D9FF',
  '#DCC7FF',
  '#D0B4FF',
  '#C4A1FE',
  '#B98EFE',
  '#AD7BFE',
  '#A169FE',
  '#9656FE',
  '#8A43FE',
];

const orangeColors = [
  '#FFEFE9',
  '#FFE0D3',
  '#FFD0BC',
  '#FFC1A6',
  '#FEB190',
  '#FEA17A',
  '#FE9264',
  '#FE824D',
  '#FE7337',
  '#FE6321',
];

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  const [client] = useState(new QueryClient());
  const { pathname } = useLocation();
  const [selectedUserType, setSelectedUserType] = useState<USER_TYPE>('Stablecoin Issuer');
  const purpleTheme = selectedUserType === 'Distributor' && pathname !== PAGES_URLS.userTypeSelection;
  const colors = purpleTheme ? purpleColors : orangeColors;

  useEffect(() => {
    colors.forEach((color, i) => {
      const colorWeight = (i + 1) * 10;

      document.documentElement.style.setProperty(`--primary_${colorWeight}`, color);
    });
  }, [colors]);

  return (
    <ConfigProvider
      theme={{
        components: {
          Upload: {
            colorBorder: 'var(--gray_40)',
            colorPrimary: 'var(--gray_40)',
          },
          Select: {
            optionActiveBg: 'var(--primary_10)',
            optionHeight: 30,
            optionSelectedBg: 'var(--base)',
            optionSelectedFontWeight: 500,
            fontSize: 16,
            borderRadius: 10,
          },
        },
        token: {
          colorTextQuaternary: 'var(--gray_100)',
          colorPrimary: 'var(--primary_100)',
          colorText: 'var(--gray_90)',
          controlOutlineWidth: 0,
          controlOutline: 'var(--primary_20)',
          colorBorder: 'var(--gray_30)',
          colorPrimaryHover: 'var(--gray_50)',
          fontFamily: 'inherit',
          fontWeightStrong: 400,
          borderRadius: 4,
        },
      }}
    >
      <QueryClientProvider client={client}>
        <SuiClientProvider networks={networkConfig} defaultNetwork={import.meta.env.S3_NETWORK}>
          <WalletProvider autoConnect={false}>
            <OnboardingContext.Provider value={{ selectedUserType, setSelectedUserType }}>
              {children}
            </OnboardingContext.Provider>
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};
