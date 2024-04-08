import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import HomeLayout from '@/app/home/layout';

export const metadata: Metadata = {
  title: 'S3 - Operations',
};

export default function OperationsLayout(props: PropsWithChildren) {
  return (
    <HomeLayout {...props} />
  );
}
