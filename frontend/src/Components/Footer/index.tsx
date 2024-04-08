import { FC, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export const Footer: FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...props }) => (
  <div
    className={twMerge('font-medium flex items-center justify-between text-mistBlue', className)}

    {...props}
  >
    <p>
      Powered By
      {' '}
      <a href="https://pravica.io/" target="_blank" rel="noreferrer">
        Pravica
      </a>
    </p>
    <p>
      Copyright
      {' '}
      {(new Date()).getFullYear()}
    </p>
  </div>
);
