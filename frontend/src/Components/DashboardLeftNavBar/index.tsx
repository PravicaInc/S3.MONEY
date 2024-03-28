'use client';

import { FC, HTMLAttributes, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

import LogoIcon from '@/../public/images/logo.svg?jsx';
import OperationsLinkIcon from '@/../public/images/operations_link_icon.svg?jsx';

import { PAGES_URLS } from '@/utils/const';

export const DashboardLeftNavBar: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();

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
            isActive: pathname === PAGES_URLS.dashboardOperations,
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
        className
      )}
      {...props}
    >
      <Link
        href={PAGES_URLS.home}
        className="ml-6 my-5 block"
      >
        <LogoIcon />
      </Link>
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
                    'flex items-center gap-[10px] py-2 px-3 border rounded-md border-transparent text-secondary',
                    isActive && 'border-borderPrimary bg-[#F8F9FB] text-primary'
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
    </div>
  );
};
