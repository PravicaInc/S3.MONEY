'use client';

import { FC, PropsWithChildren, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { PAGES_URLS } from '@/utils/const';

import { useWallet } from '@/hooks/useWallet';

const pagesUrlsWithoutAuthorization = [
  PAGES_URLS.signIn,
];

export const ClientLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const wallet = useWallet();

  useEffect(
    () => {
      if (wallet.isWalletConnectedBefore && pagesUrlsWithoutAuthorization.includes(pathname)) {
        router.replace(searchParams.get('next') || PAGES_URLS.home);
      }
      if (!wallet.isWalletConnectedBefore && !pagesUrlsWithoutAuthorization.includes(pathname)) {
        router.replace(`${PAGES_URLS.signIn}?next=${encodeURIComponent(pathname)}`);
      }
    },
    [wallet, searchParams, pathname, router]
  );

  return children;
};
