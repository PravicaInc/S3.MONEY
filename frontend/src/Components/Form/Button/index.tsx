import { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';

export enum BUTTON_VIEWS {
  primary = 'primary',
  secondary = 'secondary',
}

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: ReactNode;
  isLoading?: boolean;
  view?: BUTTON_VIEWS;
}

export const primaryButtonClasses = `
  text-white rounded-xl shadow-button border-actionSecondary border-solid border font-semibold
  flex items-center justify-center
  bg-buttonBgMain relative overflow-hidden
  after:content-[''] after:bg-buttonBgAfter after:w-full after:h-full after:absolute
  hover:bg-buttonBgAfter hover:text-actionPrimary
  transition
  disabled:bg-slate-300 disabled:bg-none disabled:border-slate-400 disabled:text-white
  [&>svg>path]:hover:stroke-actionPrimary
`;

export const secondaryButtonClasses = `
  bg-white text-primary rounded-xl shadow-button border-borderPrimary border-solid border font-semibold
  flex items-center justify-center
  transition
  hover:border-actionSecondary hover:text-actionPrimary
  disabled:bg-slate-300 disabled:border-slate-400 disabled:text-white
`;

const buttonViewsClassNames = {
  [BUTTON_VIEWS.primary]: primaryButtonClasses,
  [BUTTON_VIEWS.secondary]: secondaryButtonClasses,
};

export const Button = ({
  className,
  text,
  children,
  isLoading,
  view = BUTTON_VIEWS.primary,
  ...props
}: ButtonProps) => (
  <button
    className={twMerge(
      buttonViewsClassNames[view],
      className
    )}
    {...props}
  >
    {
      isLoading
        ? <Loader className="text-inherit h-5 bg-" />
        : text || children
    }
  </button>
);
