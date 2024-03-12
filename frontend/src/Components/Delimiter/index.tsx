import { FC, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export const Delimiter: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={twMerge(
      'bg-borderPrimary h-[1px]',
      className
    )}
    {...props}
  />
);
