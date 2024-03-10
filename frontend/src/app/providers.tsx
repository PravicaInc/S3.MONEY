'use client';

import { PropsWithChildren, useState } from 'react';
import { WalletProvider } from '@suiet/wallet-kit';
import { SuiWallet } from '@suiet/wallet-kit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import '@suiet/wallet-kit/style.css';

import { WalletWithCorrectStatusProvider } from '@/Components/WalletWithCorrectStatusProvider';

export function Providers({ children }: PropsWithChildren) {
  const [client] = useState(new QueryClient());

  return (
    <QueryClientProvider client={client}>
      <WalletProvider defaultWallets={[SuiWallet]}>
        <WalletWithCorrectStatusProvider>
          {children}
        </WalletWithCorrectStatusProvider>
      </WalletProvider>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
