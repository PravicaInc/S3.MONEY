import { FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { Header } from '@/Components/Header';

export interface PageLayoutProps {
  children: ReactNode;

  className?: string;
}

export const PageLayout: FC<PageLayoutProps> = ({ children, className }) => (
  <div className={twMerge('flex flex-col h-screen bg-primaryPageBG', className)}>
    <Header className="w-full" />
    <div className="max-w-screen-2xl mx-auto w-full h-full">
      {children}
    </div>
  </div>
);

