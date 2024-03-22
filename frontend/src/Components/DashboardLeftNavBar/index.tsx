'use client';

import { FC, HTMLAttributes, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import LogoIcon from '@/../public/images/logo.svg?jsx';

import { PAGES_URLS } from '@/utils/const';

export const DashboardLeftNavBar: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  const links = useMemo(
    () => [
      {
        href: {
          pathname: PAGES_URLS.dashboardOverview,
          query: Object.fromEntries(searchParams.entries()),
        },
        text: 'Overview',
        isActive: pathname === PAGES_URLS.dashboardOverview,
      },
      {
        href: {
          pathname: PAGES_URLS.dashboardOperations,
          query: Object.fromEntries(searchParams.entries()),
        },
        text: 'Operations',
        isActive: pathname === PAGES_URLS.dashboardOperations,
      },
    ],
    [searchParams, pathname]
  );

  return (
    <div
      className={twMerge(
        'h-screen w-80 border-r border-borderPrimary bg-white',
        className
      )}
      {...props}
    >
      <div className="pl-12 mt-12 flex flex-col gap-12">
        <Link href={PAGES_URLS.home}>
          <LogoIcon />
        </Link>
        {
          links.map(({ href, text, isActive }) => (
            <Link
              key={text}
              href={href}
              className={twMerge(
                'text-3xl',
                isActive && 'underline'
              )}
            >
              {text}
            </Link>
          ))
        }
      </div>
    </div>
  );
};
