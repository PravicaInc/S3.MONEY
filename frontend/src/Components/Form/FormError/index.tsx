import { FC, HTMLAttributes, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

export interface FormErrorProps extends HTMLAttributes<HTMLParagraphElement> {
  text?: ReactNode
}

export const FormError: FC<FormErrorProps> = ({ text, className, ...props }) => (
  <p className={twMerge('text-error text-sm', className)} {...props}>
    {text}
  </p>
);
