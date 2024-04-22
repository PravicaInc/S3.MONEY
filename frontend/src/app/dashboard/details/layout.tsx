import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import { DashboardLayout } from '@/Components/DashboardLayout';

export const metadata: Metadata = {
  title: 'S3 - Dashboard - Details',
};

export default function DashboardDetailsLayout({ ...props }: PropsWithChildren) {
  return (
    <DashboardLayout
      {...props}
    />
  );
}
