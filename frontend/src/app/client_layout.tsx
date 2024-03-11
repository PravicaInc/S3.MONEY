'use client';

import { FC, PropsWithChildren, useEffect } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import { PAGES_URLS } from '@/utils/const';

const pagesUrlsWithoutAuthorization = [
  PAGES_URLS.signIn,
];

export const ClientLayout: FC<PropsWithChildren> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();

  useEffect(
    () => {
      if (
        autoConnectionStatus === 'attempted'
          && account?.address
          && pagesUrlsWithoutAuthorization.includes(pathname)
      ) {
        router.replace(searchParams.get('next') || PAGES_URLS.home);
      }
      if (
        autoConnectionStatus === 'attempted'
          && !account?.address
          && !pagesUrlsWithoutAuthorization.includes(pathname)
      ) {
        router.replace(`${PAGES_URLS.signIn}?next=${encodeURIComponent(pathname)}`);
      }
    },
    [autoConnectionStatus, account, router, pathname, searchParams]
  );

  return children;
};
