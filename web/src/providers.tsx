import React, { FC, PropsWithChildren, useState } from 'react';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui.js/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';

const { networkConfig } = createNetworkConfig({
  devnet: { url: getFullnodeUrl('devnet') },
  localnet: { url: getFullnodeUrl('localnet') },
  mainnet: { url: getFullnodeUrl('mainnet') },
  testnet: { url: getFullnodeUrl('testnet') },
});

export const Providers: FC<PropsWithChildren> = ({ children }) => {
  const [client] = useState(new QueryClient());

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'var(--primary-100)',
          colorText: 'var(--base)',
          fontFamily: 'inherit',
          fontWeightStrong: 400,
          borderRadius: 4,
        },
      }}
    >
      <QueryClientProvider client={client}>
        <SuiClientProvider networks={networkConfig} defaultNetwork={import.meta.env.S3_NETWORK}>
          <WalletProvider autoConnect>
            {children}
          </WalletProvider>
        </SuiClientProvider>
      </QueryClientProvider>
    </ConfigProvider>
  );
};
