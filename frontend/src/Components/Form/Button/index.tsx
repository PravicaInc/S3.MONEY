import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: ReactNode;
  isLoading?: boolean;
}

export const defaultButtonClasses = `
  bg-actionPrimary text-white p-4 rounded-xl shadow-button border-actionSecondary border-solid border font-semibold
  hover:bg-white hover:text-actionPrimary
  transition

`;

export const Button: FC<ButtonProps> = ({ className, text, children, isLoading, ...props }) => (
  <button
    className={twMerge(
      defaultButtonClasses,
      className,
      'disabled:bg-slate-300 disabled:border-slate-400 disabled:text-white'
    )}
    {...props}
  >
    {
      isLoading
        ? <Loader className="text-inherit" />
        : text || children
    }
  </button>
);
