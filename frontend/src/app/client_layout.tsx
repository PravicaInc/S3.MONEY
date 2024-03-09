'use client';

import { FC, PropsWithChildren, useEffect } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { PAGES_URLS } from '@/utils/const';

import { IS_WALLET_CONNECTED_KEY } from '@/hooks/useWallet';

const pagesUrlsWithoutAuthorization = [
  PAGES_URLS.signIn,
];

export const ClientLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(
    () => {
      const isWalletConnectedBefore = (
        typeof localStorage !== 'undefined'
          ? JSON.parse(localStorage.getItem(IS_WALLET_CONNECTED_KEY) ?? 'false')
          : false
      );

      if (isWalletConnectedBefore && pagesUrlsWithoutAuthorization.includes(pathname)) {
        router.replace(searchParams.get('next') || PAGES_URLS.home);
      }
      if (!isWalletConnectedBefore && !pagesUrlsWithoutAuthorization.includes(pathname)) {
        router.replace(`${PAGES_URLS.signIn}?next=${encodeURIComponent(pathname)}`);
      }
    },
    [searchParams, pathname, router]
  );

  return children;
};
