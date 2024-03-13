import { FC, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

import CheckedIcon from '@/../public/images/checked.svg?jsx';

export interface SimpleCheckboxProps extends HTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  wrapperClassName?: string;
}

export const SimpleCheckbox: FC<SimpleCheckboxProps> = ({
  className,
  wrapperClassName,
  checked,
  ...props
}) => (
  <div className={twMerge('relative', wrapperClassName)}>
    <input
      type="checkbox"
      className="invisible absolute inset-1/2"
      checked={checked}
      readOnly
      {...props}
    />
    <div
      className={twMerge(
        'w-5 h-5 border border-borderPrimary flex items-center justify-center rounded-md transition',
        checked && 'border-actionPrimary bg-actionPrimary',
        className
      )}
    >
      {checked && <CheckedIcon />}
    </div>
  </div>
);
