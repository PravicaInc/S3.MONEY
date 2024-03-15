import { FC, HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface LabelProps extends HTMLAttributes<HTMLParagraphElement> {
  label: ReactNode;
  isRequired?: boolean;
}

export const Label: FC<LabelProps> = ({ label, isRequired, className, ...props }) => (
  <p className={twMerge('font-medium text-sm text-secondary', className)} {...props}>
    {label}
    {isRequired && '*'}
  </p>
);
