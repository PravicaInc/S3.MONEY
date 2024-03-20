'use client';

import { FC } from 'react';
import RcTooltip from 'rc-tooltip';
import { TooltipProps } from 'rc-tooltip/lib/Tooltip';
import { twMerge } from 'tailwind-merge';

export const Tooltip: FC<TooltipProps> = ({ overlayClassName, ...props }) => (
  <RcTooltip
    overlayClassName={twMerge(
      `
        bg-transparent
        [&>div:first-child]:border-t-gray-800 [&>div:first-child]:translate-x-[1px] [&>div:first-child]:translate-y-1/2
        [&>div>[role="tooltip"]]:border-gray-800 [&>div>[role="tooltip"]]:bg-gray-800 [&>div>[role="tooltip"]]:text-white
      `,
      overlayClassName
    )}
    {...props}
  />
);
