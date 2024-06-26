import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import { DashboardLayout } from '@/Components/DashboardLayout';

export const metadata: Metadata = {
  title: 'S3 - Dashboard - Operations',
};

export default function DashboardOperationsLayout({ ...props }: PropsWithChildren) {
  return (
    <DashboardLayout
      {...props}
    />
  );
}
