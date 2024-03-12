'use client';

import { useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import NextImage from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';

import LogoSVG from '@/../public/images/logo.svg?jsx';

import { WalletConnectButton } from '@/Components/WalletConnectButton';

import { PAGES_URLS } from '@/utils/const';

export default function SignInPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();

  const isLoading = useMemo(
    () => autoConnectionStatus === 'idle',
    [autoConnectionStatus]
  );
  const isRedirecting = useMemo(
    () => autoConnectionStatus === 'attempted' && !!account?.address,
    [autoConnectionStatus, account?.address]
  );

  return (
    <div className="flex flex-col h-screen">
      <div className="grid md:grid-cols-2 h-full">
        <div className="bg-white h-full flex items-center justify-center py-5">
          <div className="flex flex-col items-center mx-20 max-w-4xl text-center">
            <LogoSVG />
            <p className="mt-4 text-primary text-[32px] leading-[40px]">
              StableCoin Studio on Sui
            </p>
            <div className="mt-5 w-full">
              <WalletConnectButton
                className="h-[48px] p-0 w-full text-sm font-semibold flex items-center justify-center"
                onConnectSuccess={() => {
                  router.replace(searchParams.get('next') || PAGES_URLS.home);
                }}
                disabled={isLoading || isRedirecting}
                isLoading={isLoading}
              >
                {
                  isRedirecting
                    ? 'Redirecting ...'
                    : 'Sign In with Sui Wallet'
                }
              </WalletConnectButton>
            </div>
            <p className="mt-5 text-primary lett">
              Don’t have Sui Wallet extension installed?
              {' '}
              <a
                href="https://chromewebstore.google.com/detail/sui-wallet/opcgpfmipidbgpenhmajoajpbobppdil"
                target="_blank"
                rel="noreferrer"
                className="text-actionPrimary font-semibold"
              >
                Install Extension
              </a>
            </p>
          </div>
        </div>
        <div className="bg-[#FFCDA8] h-full border-[10px] border-white flex items-center justify-center py-5">
          <div className="text-center mx-5 md:mx-10 lg:mx-20 max-w-4xl">
            <p className="text-[40px] leading-[44px] font-semibold text-primary">
              Gateway to Code-Free StableCoin Creation
            </p>
            <p className="mt-5 text-[#353849] text-opacity-70">
              Just connect your Sui wallet and step into the wonderfully simple world of StableCoin Studio on
              the Sui Blockchain. You'll be able to create and manage your own stable coins with just a few clicks.
              And the best part? No coding is required! It's a platform designed just for you.
            </p>
            <NextImage
              className="mx-auto mt-14"
              src="/images/sui_wallet_login_screen.png"
              alt="Sui wallet login screen"
              width="290"
              height="525"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
