'use client';

import { FC, HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import InfoIcon from '@/../public/images/info.svg?jsx';

export interface TipsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  title: ReactNode;
  tipsList?: ReactNode[];
  tip?: ReactNode;
}

export const Tips: FC<TipsProps> = ({ title, tipsList, tip, className, ...props }) => (
  <div
    className={twMerge(
      'border border-borderPrimary rounded-xl bg-[#FFE8D4] p-3',
      className
    )}
    {...props}
  >
    <div className="flex gap-[14px] items-center">
      <div className="border border-borderPrimary w-8 h-8 flex items-center justify-center bg-snowDrift rounded-md">
        <InfoIcon />
      </div>
      <p className="text-primary font-semibold">
        {title}
      </p>
    </div>
    {
      tip || (
        <ul className="mt-3 text-mistBlue text-xs list-disc ml-6">
          {tipsList?.map((el, idx) => (
            <li key={idx}>
              {el}
            </li>
          ))}
        </ul>
      )
    }
  </div>
);

