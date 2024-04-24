import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import HomeLayout from '@/app/home/layout';

export const metadata: Metadata = {
  title: 'S3 - Details',
};

export default function DetailsLayout(props: PropsWithChildren) {
  return (
    <HomeLayout {...props} />
  );
}
