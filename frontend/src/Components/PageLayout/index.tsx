import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { Header } from '@/Components/Header';

export interface PageLayoutProps {
  children: ReactNode;

  className?: string;
  contentClassName?: string;
}

export const PageLayout: FC<PageLayoutProps> = ({ children, className, contentClassName }) => (
  <div className={twMerge('flex flex-col min-h-screen bg-pageBgPrimary', className)}>
    <Header className="w-full" />
    <div className={twMerge('max-w-screen-2xl mx-auto w-full h-full grow', contentClassName)}>
      {children}
    </div>
  </div>
);

