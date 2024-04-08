'use client';

import { FC, HTMLAttributes, useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import OperationsLinkIcon from '@/../public/images/operations_link_icon.svg?jsx';
import PlusIcon from '@/../public/images/plus.svg?jsx';
import RelationsLinkIcon from '@/../public/images/relations_icon.svg?jsx';

import { Button } from '@/Components/Form/Button';
import { Loader } from '@/Components/Loader';
import { Logo } from '@/Components/Logo';

import { PAGES_URLS } from '@/utils/const';

export const DashboardLeftNavBar: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const autoConnectionStatus = useAutoConnectWallet();
  const account = useCurrentAccount();

  const isLoading = useMemo(
    () => autoConnectionStatus === 'idle',
    [autoConnectionStatus]
  );
  const isRedirecting = useMemo(
    () => autoConnectionStatus === 'attempted' && !account?.address,
    [autoConnectionStatus, account?.address]
  );

  const links = useMemo(
    () => [
      {
        groupName: 'Main Menu',
        groupLinks: [
          {
            href: {
              pathname: PAGES_URLS.dashboardOperations,
              query: Object.fromEntries(searchParams.entries()),
            },
            icon: <OperationsLinkIcon />,
            text: 'Operations',
            isActive: pathname.indexOf(PAGES_URLS.dashboardOperations) !== -1,
          },
          {
            href: {
              pathname: PAGES_URLS.dashboardRelations,
              query: Object.fromEntries(searchParams.entries()),
            },
            icon: <RelationsLinkIcon />,
            text: 'Relations',
            isActive: pathname.indexOf(PAGES_URLS.dashboardRelations) !== -1,
          },
        ],
      },
    ],
    [searchParams, pathname]
  );

  return (
    <div
      className={twMerge(
        'h-screen w-[270px] border-r border-borderPrimary bg-white',
        (isLoading || isRedirecting) && 'overflow-hidden flex flex-col',
        className
      )}
      {...props}
    >
      <Logo className="ml-6 my-5" />
      {
        isLoading || isRedirecting
          ? (
            <div className="h-full flex items-center justify-center">
              <Loader className="h-10" />
            </div>
          )
          : (
            <>
              <div className="mx-4 pt-5 mb-1">
                <Link href={PAGES_URLS.createStableCoin} className="rounded-xl w-full">
                  <Button className="text-sm font-semibold h-[48px] w-full flex items-center gap-[10px]">
                    <PlusIcon />
                    <span className="mt-[1px]">
                      Create New Stablecoin
                    </span>
                  </Button>
                </Link>
              </div>
              {
                links.map(({ groupName, groupLinks }) => (
                  <div key={groupName} className="pt-5 px-4">
                    <p className="text-xs font-semibold text-hitGrey pl-3 pb-3">
                      {groupName}
                    </p>
                    <div className="flex flex-col gap-1">
                      {groupLinks.map(({ text, href, icon, isActive }) => (
                        <Link
                          key={text}
                          href={href}
                          className={twMerge(
                            'flex items-center gap-[10px] py-2 px-3',
                            'border rounded-md border-transparent text-secondary',
                            isActive ? '[&>svg>path]:stroke-primary' : '[&>svg>path]:stroke-secondary',
                            isActive && 'border-borderPrimary bg-snowDrift text-primary'
                          )}
                        >
                          {icon}
                          {text}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))
              }
            </>
          )
      }
    </div>
  );
};
