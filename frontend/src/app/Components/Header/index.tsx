'use client';

import { HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import LogoIcon from '@/../public/images/logo.svg?jsx';

export function Header({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={twMerge('max-w-screen-2xl mx-auto py-4', className)} {...props}>
      <LogoIcon />
    </div>
  );
}
