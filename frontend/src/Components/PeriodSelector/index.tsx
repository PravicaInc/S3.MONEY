'use client';

import { FC, HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface PeriodSelectorProps extends HTMLAttributes<HTMLDivElement> {
  periods: {
    id: string;
    label: ReactNode;
  }[];
  selectedPeriod: string;
  onSelectPeriod: (periodID: string) => void;
}

export const PeriodSelector: FC<PeriodSelectorProps> = ({
  periods,
  selectedPeriod,
  onSelectPeriod,
  className,
  ...props
}) => (
  <div
    className={twMerge(
      'bg-snowDrift rounded-md p-[2px] flex items-center relative',
      className
    )}
    {...props}
  >
    {periods.map(({ id, label }) => (
      <button
        key={id}
        className={twMerge(
          'w-[31px] h-[24px] flex items-center justify-center rounded relative z-10 transition-all',
          'text-secondary text-xs font-medium',
          id === selectedPeriod && 'text-primary'
        )}
        onClick={() => onSelectPeriod(id)}
      >
        {label}
      </button>
    ))}
    <div
      className="bg-white shadow-button w-[31px] h-[24px] rounded absolute top-[2px] z-0 transition-all"
      style={{
        left: 31 * periods.findIndex(({ id }) => id === selectedPeriod) + 2,
      }}
    />
  </div>
);

