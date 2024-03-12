import { ButtonHTMLAttributes, FC, ReactNode } from 'react';
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
  bg-actionPrimary text-white p-4 rounded-xl shadow-button border-actionSecondary border-solid border font-semibold
  hover:bg-white hover:text-actionPrimary
  transition
  disabled:bg-slate-300 disabled:border-slate-400 disabled:text-white
`;

export const secondaryButtonClasses = `
  bg-white text-primary p-4 rounded-xl shadow-button border-primaryBorder border-solid border font-semibold
  transition
  hover:border-actionSecondary hover:text-actionPrimary
  disabled:bg-slate-300 disabled:border-slate-400 disabled:text-white
`;

const buttonViewsClassNames = {
  [BUTTON_VIEWS.primary]: primaryButtonClasses,
  [BUTTON_VIEWS.secondary]: secondaryButtonClasses,
};

export const Button: FC<ButtonProps> = ({
  className,
  text,
  children,
  isLoading,
  view = BUTTON_VIEWS.primary,
  ...props
}) => (
  <button
    className={twMerge(
      buttonViewsClassNames[view],
      className
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
