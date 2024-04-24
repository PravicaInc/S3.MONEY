import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import { PageLayout } from '@/Components/PageLayout/index';

export const metadata: Metadata = {
  title: 'S3 - Create Stablecoin',
};

export default function CreateStablecoinLayout({ ...props }: PropsWithChildren) {
  return (
    <PageLayout
      contentClassName="flex"
      {...props}
    />
  );
}
