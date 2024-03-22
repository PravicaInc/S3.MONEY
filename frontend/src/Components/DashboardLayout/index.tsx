import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { DashboardLeftNavBar } from '@/Components/DashboardLeftNavBar';
import { DashboardTopNavBar } from '@/Components/DashboardTopNavBar';

export interface DashboardLayoutProps {
  children?: ReactNode;
  className?: string;
  contentClassName?: string;
}

export const DashboardLayout: FC<DashboardLayoutProps> = ({ children, className, contentClassName }) => (
  <div className={twMerge('flex min-h-screen bg-pageBgPrimary', className)}>
    <DashboardLeftNavBar className="shrink-0" />
    <div className={twMerge('w-screen h-screen overflow-auto', contentClassName)}>
      <DashboardTopNavBar />
      {children}
    </div>
  </div>
);

