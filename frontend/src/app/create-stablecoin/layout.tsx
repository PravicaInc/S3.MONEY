import type { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';

import { PageLayout, PageLayoutProps } from '@/Components/PageLayout/index';

export const metadata: Metadata = {
  title: 'S3 - Create Stablecoin',
};

export default function HomeLayout({ className, ...props }: PageLayoutProps) {
  return (
    <PageLayout
      className={twMerge('', className)}
      contentClassName="flex"
      {...props}
    />
  );
}
