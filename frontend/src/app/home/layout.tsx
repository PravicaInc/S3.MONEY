import { PropsWithChildren } from 'react';
import type { Metadata } from 'next';

import { DashboardLeftNavBar } from '@/Components/DashboardLeftNavBar';

export const metadata: Metadata = {
  title: 'S3 - Home',
};

export default function HomeLayout({ children }: PropsWithChildren) {
  return (
    <div className="flex min-h-screen bg-pageBgPrimary">
      <DashboardLeftNavBar className="shrink-0" />
      <div className="w-screen h-screen flex flex-col">
        {children}
      </div>
    </div>
  );
}
