import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { DashboardLeftNavBar } from '@/Components/DashboardLeftNavBar';
import { DashboardTopNavBar } from '@/Components/DashboardTopNavBar';
import { Footer } from '@/Components/Footer';

export interface DashboardLayoutProps {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children, className, contentClassName }) => (
  <div className={twMerge('flex min-h-screen bg-pageBgPrimary', className)}>
    <DashboardLeftNavBar className="shrink-0" />
    <div className={twMerge('w-screen h-screen flex flex-col', contentClassName)}>
      <DashboardTopNavBar className="shrink-0" />
      <div className="overflow-auto h-full flex flex-col justify-between">
        <div className="h-full">
          {children}
        </div>
        <Footer
          className="pb-7 pl-9 pr-[85px]"
        />
      </div>
    </div>
  </div>
);

