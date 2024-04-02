import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import { DashboardLayout } from '@/Components/DashboardLayout';

export const metadata: Metadata = {
  title: 'S3 - Dashboard - Relations',
};

export default function DashboardRelationsLayout({ ...props }: PropsWithChildren) {
  return (
    <DashboardLayout
      {...props}
    />
  );
}
