'use client';

import { useCallback, useMemo, useState } from 'react';
import { useAutoConnectWallet, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import qs from 'qs';

import LogoutIcon from '@/../public/images/logout.svg?jsx';

import { Alert } from '@/Components/Alert';
import { Loader } from '@/Components/Loader';
import { TotalLogoutInstruction } from '@/Components/TotalLogoutInstruction';

import { PAGES_URLS } from '@/utils/const';

import { useHasUserAccessToApp } from '@/hooks/useHasUserAccessToApp';

export default function AccessDeniedPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();
  const {
    data: hasUserAccessToApp,
    isPending: isHasUserAccessToAppPending,
    isFetching: isHasUserAccessToAppFetching,
  } = useHasUserAccessToApp(account?.address);
  const disconnectWallet = useDisconnectWallet();

  const [showTotalLogoutInstruction, setShowTotalLogoutInstruction] = useState<boolean>(false);

  const isLoading = useMemo(
    () => autoConnectionStatus === 'idle' || isHasUserAccessToAppPending || isHasUserAccessToAppFetching,
    [autoConnectionStatus, isHasUserAccessToAppFetching, isHasUserAccessToAppPending]
  );
  const isRedirecting = useMemo(
    () => autoConnectionStatus === 'attempted' && account?.address && hasUserAccessToApp,
    [autoConnectionStatus, account?.address, hasUserAccessToApp]
  );

  const disconnect = useCallback(
    async () => {
      await disconnectWallet.mutateAsync();

      router.replace(`${PAGES_URLS.signIn}?${qs.stringify({
        next: `${pathname}?${qs.stringify(Object.fromEntries(searchParams.entries()))}`,
      })}`);
    },
    [disconnectWallet, router, pathname, searchParams]
  );

  return (
    <div className="flex flex-col min-h-screen items-center justify-center">
      {
        isLoading || isRedirecting
          ? (
            <Loader className="h-10" />
          )
          : (
            <>
              <Alert
                className="w-[600px]"
                visible
                onClose={() => {}}
                withCloseButton={false}
                header="Unfortunately, you do not have access to our platform 😔"
                description={
                  <>
                    Please
                    {' '}
                    <a
                      href="https://www.pravica.io/contact"
                      target="_blank"
                      rel="noreferrer"
                      className="underline"
                    >
                      contact us
                    </a>
                    {' '}
                    to access or
                    {' '}
                    <button
                      className="underline"
                      onClick={() => setShowTotalLogoutInstruction(true)}
                    >
                      change your SUI account
                    </button>
                  </>
                }
                okButtonContent={
                  <>
                    Logout
                    <LogoutIcon className="ml-2 [&>*]:fill-white" />
                  </>
                }
                onOkClick={disconnect}
              />
              {
                showTotalLogoutInstruction && (
                  <TotalLogoutInstruction
                    className="
                      fixed top-5 right-5 z-50 text-white
                      [&>div>svg>*]:stroke-white [&>div>svg>defs>marker>*]:stroke-white
                    "
                  />
                )
              }
            </>
          )
      }
    </div>
  );
}
