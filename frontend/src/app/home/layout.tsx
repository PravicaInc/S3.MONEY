import type { Metadata } from 'next';
import { twMerge } from 'tailwind-merge';

import { PageLayout, PageLayoutProps } from '@/Components/PageLayout/index';

export const metadata: Metadata = {
  title: 'S3 - Home',
};

export default function HomeLayout({ className, ...props }: PageLayoutProps) {
  return (
    <PageLayout
      className={twMerge('bg-pageBgSecondary', className)}
      contentClassName="flex"
      {...props}
    />
  );
}
