import { ButtonHTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

import { Loader } from '@/Components/Loader';

export enum BUTTON_VIEWS {
  primary = 'primary',
  flatPrimary = 'flatPrimary',
  secondary = 'secondary',
  red = 'red',
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
  disabled:bg-alabaster disabled:bg-none disabled:border-borderPrimary disabled:text-santaGrey disabled:shadow-none
  [&>svg>path]:hover:stroke-actionPrimary
`;

export const flatPrimaryButtonClasses = `
  text-white rounded-xl shadow-button border-mangoOrange border-solid border font-semibold
  flex items-center justify-center
  bg-mangoOrange relative overflow-hidden
  hover:text-mangoOrange hover:bg-white
  transition
  disabled:bg-alabaster disabled:bg-none disabled:border-borderPrimary disabled:text-santaGrey disabled:shadow-none
  [&>svg>path]:hover:stroke-mangoOrange
`;

export const redButtonClasses = `
  text-white rounded-xl border-grapefruit border-solid border font-semibold
  flex items-center justify-center
  bg-grapefruit relative overflow-hidden
  hover:bg-white hover:text-grapefruit
  transition
  disabled:bg-alabaster disabled:bg-none disabled:border-borderPrimary disabled:text-santaGrey disabled:shadow-none
  [&>svg>path]:hover:stroke-grapefruit
`;

export const secondaryButtonClasses = `
  bg-white text-primary rounded-xl shadow-button border-borderPrimary border-solid border font-semibold
  flex items-center justify-center
  transition
  hover:border-actionSecondary hover:text-actionPrimary
  disabled:bg-alabaster disabled:bg-none disabled:border-borderPrimary disabled:text-santaGrey disabled:shadow-none
`;

const buttonViewsClassNames = {
  [BUTTON_VIEWS.primary]: primaryButtonClasses,
  [BUTTON_VIEWS.flatPrimary]: flatPrimaryButtonClasses,
  [BUTTON_VIEWS.secondary]: secondaryButtonClasses,
  [BUTTON_VIEWS.red]: redButtonClasses,
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
