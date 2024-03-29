import { FC, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import { primaryButtonClasses } from '@/Components/Form/Button';

export interface ProgressStepItem {
  number: number;
  text: string;
  isActive?: boolean;
}

export interface ProgressStepProps extends HTMLAttributes<HTMLDivElement>, ProgressStepItem {}

export const ProgressStep: FC<ProgressStepProps> = ({ number, text, isActive, className, ...props }) => (
  <div
    className={twMerge('flex items-center gap-4', className)}

    {...props}
  >
    <div
      className={twMerge(
        primaryButtonClasses,
        'text-white pointer-events-none flex items-center justify-center rounded-full font-normal text-base',
        'min-w-8 min-h-8 max-w-8 max-h-8 shadow-none',
        !isActive && 'bg-none bg-borderPrimary text-snowDrift border-borderPrimary after:content-none'
      )}
    >
      {number}
    </div>
    <p
      className={twMerge(
        isActive ? 'text-primary' : 'text-lavenderGrey'
      )}
    >
      {text}
    </p>
  </div>
);
