import { FC, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export const Footer: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={twMerge('font-medium flex items-center justify-between text-mistBlue', className)}

    {...props}
  >
    <a href="https://pravica.io/privacy" target="_blank" rel="noreferrer">
      Privacy Policy
    </a>
    <p>
      Copyright
      {' '}
      {(new Date()).getFullYear()}
    </p>
  </div>
);
