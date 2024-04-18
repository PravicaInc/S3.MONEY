'use client';

import { FC, HTMLAttributes, useMemo } from 'react';
import { useAutoConnectWallet, useCurrentAccount } from '@mysten/dapp-kit';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import ChartsLinkIcon from '@/../public/images/charts_icon.svg?jsx';
import DocsIcon from '@/../public/images/docs_icon.svg?jsx';
import ExternalLinkIcon from '@/../public/images/external_link.svg?jsx';
import OperationsLinkIcon from '@/../public/images/operations_link_icon.svg?jsx';
import OverviewLinkIcon from '@/../public/images/overview_link_icon.svg?jsx';
import PlusIcon from '@/../public/images/plus.svg?jsx';
import QuestionIcon from '@/../public/images/question.svg?jsx';
import RelationsLinkIcon from '@/../public/images/relations_icon.svg?jsx';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
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
        groupName: 'MAIN MENU',
        groupLinks: [
          {
            href: {
              pathname: searchParams.get('txid')
                ? PAGES_URLS.dashboardOverview
                : PAGES_URLS.overview,
              query: Object.fromEntries(searchParams.entries()),
            },
            icon: <ChartsLinkIcon fill="none" />,
            text: 'Overview',
            isActive: (
              pathname.indexOf(PAGES_URLS.dashboardOverview) !== -1
                || pathname.indexOf(PAGES_URLS.overview) !== -1
            ),
          },
          {
            href: {
              pathname: searchParams.get('txid')
                ? PAGES_URLS.dashboardOperations
                : PAGES_URLS.operations,
              query: Object.fromEntries(searchParams.entries()),
            },
            icon: <OperationsLinkIcon fill="none" />,
            text: 'Operations',
            isActive: (
              pathname.indexOf(PAGES_URLS.dashboardOperations) !== -1
                || pathname.indexOf(PAGES_URLS.operations) !== -1
            ),
          },
          {
            href: {
              pathname: searchParams.get('txid')
                ? PAGES_URLS.dashboardRelations
                : PAGES_URLS.relations,
              query: Object.fromEntries(searchParams.entries()),
            },
            icon: <RelationsLinkIcon />,
            text: 'Relations',
            isActive: (
              pathname.indexOf(PAGES_URLS.dashboardRelations) !== -1
                || pathname.indexOf(PAGES_URLS.relations) !== -1
            ),
          },
          {
            href: {
              pathname: PAGES_URLS.home,
            },
            icon: <OverviewLinkIcon />,
            text: 'Details',
            isActive: pathname === PAGES_URLS.home,
          },
        ],
      },
      {
        groupName: 'Support',
        groupLinks: [
          {
            href: 'https://github.com/PravicaInc/S3.MONEY/issues/new',
            icon: <QuestionIcon />,
            text: (
              <>
                Help
                <ExternalLinkIcon className="ml-[5px]" />
              </>
            ),
            isActive: false,
            target: '_blank',
            rel: 'noreferrer',
          },
          {
            href: 'https://docs.s3.money/docs/stablecoin',
            icon: <DocsIcon stroke="none" />,
            text: (
              <>
                Docs
                <ExternalLinkIcon className="ml-[5px]" />
              </>
            ),
            isActive: false,
            target: '_blank',
            rel: 'noreferrer',
          },
        ],
      },
    ],
    [searchParams, pathname]
  );

  return (
    <div
      className={twMerge(
        'h-screen w-[270px] border-r border-borderPrimary bg-white flex flex-col',
        (isLoading || isRedirecting) && 'overflow-hidden',
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
              <div className="mx-4 pt-5">
                <Link href={PAGES_URLS.createStableCoin} className="rounded-xl w-full">
                  <Button
                    className="text-sm font-semibold h-[48px] w-full flex items-center gap-[10px]"
                    view={BUTTON_VIEWS.flatPrimary}
                  >
                    <PlusIcon />
                    <span className="mt-[1px]">
                      Create New Stablecoin
                    </span>
                  </Button>
                </Link>
              </div>
              <div className="h-full overflow-auto">
                {
                  links.map(({ groupName, groupLinks }) => (
                    <div key={groupName} className="pt-6 px-4">
                      <p className="text-xs font-semibold text-hitGrey pl-3 pb-3">
                        {groupName}
                      </p>
                      <div className="flex flex-col gap-1">
                        {groupLinks.map(({ text, href, icon, isActive, ...linkProps }, idx) => (
                          <Link
                            key={idx}
                            href={href}
                            className={twMerge(
                              'flex items-center gap-[10px] py-2 px-3',
                              'border rounded-md border-transparent text-secondary font-medium',
                              isActive
                                ? '[&>svg>path[stroke]]:stroke-primary [&>svg>path[fill]]:fill-primary'
                                : '[&>svg>path[stroke]]:stroke-secondary [&>svg>path[fill]]:fill-secondary',
                              isActive && 'border-borderPrimary bg-snowDrift text-primary font-semibold'
                            )}
                            {...linkProps}
                          >
                            {icon}
                            {text}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))
                }
              </div>
            </>
          )
      }
    </div>
  );
};
