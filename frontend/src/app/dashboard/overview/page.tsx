'use client';

import { useSearchParams } from 'next/navigation';

export default function DashboardOverviewPage() {
  const searchParams = useSearchParams();

  return (
    <div>
      DashboardOverview:
      {' '}
      {searchParams.get('txid')}
    </div>
  );
}
