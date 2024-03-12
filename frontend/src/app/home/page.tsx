'use client';

import { Loader } from '@/Components/Loader';

import { useWallet } from '@/hooks/useWallet';

export default function HomePage() {
  const wallet = useWallet();

  return (
    <div className="flex items-center justify-center h-full">
      {(wallet.connecting || wallet.disconnected) && (
        <Loader className="h-20" />
      )}
      {wallet.connected && (
        <>
          Select Stablecoin
        </>
      )}
    </div>
  );
}
