import { ButtonHTMLAttributes, ReactNode } from 'react';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { twMerge } from 'tailwind-merge';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text?: ReactNode;
  isLoading?: boolean;
}

export function Button({ className, text, children, isLoading, ...props }: ButtonProps) {
  return (
    <button
      className={twMerge(
        'border-2 rounded-lg border-slate-400 bg-slate-300 hover:bg-slate-400 p-4 text-xl transition-all',
        className
      )}
      {...props}
    >
      {
        isLoading
          ? <FontAwesomeIcon icon={faSpinner} className="animate-spin text-gray-600" />
          : text || children
      }
    </button>
  );
}
