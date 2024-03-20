import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import { PageLayout } from '@/Components/PageLayout/index';

export const metadata: Metadata = {
  title: 'S3 - Home',
};

export default function HomeLayout({ ...props }: PropsWithChildren) {
  return (
    <PageLayout
      className="bg-pageBgSecondary"
      contentClassName="flex"
      {...props}
    />
  );
}
