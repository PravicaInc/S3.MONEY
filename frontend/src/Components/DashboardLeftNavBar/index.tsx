import { FC, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { ProjectVersion } from '@/Components/ProjectVersion';

import { ClientDashboardLeftNavBar } from './client';

export const DashboardLeftNavBar: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={twMerge(
      'h-screen w-[270px] border-r border-borderPrimary bg-white flex flex-col justify-between',
      className
    )}
    {...props}
  >
    <ClientDashboardLeftNavBar className="h-[calc(100%-52px)] shrink" />
    <ProjectVersion
      className="text-mistBlue text-sm m-4 shrink-0"
    />
  </div>
);
