import { FC, forwardRef, InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import CheckedIcon from '@/../public/images/checked.svg?jsx';

export enum CHECKBOX_VIEWS {
  default = 'default',
  rounded = 'rounded',
  switch = 'switch',
}

export const defaultInputClassName = `
  invisible absolute inset-1/2
  [&+div]:checked:border-actionPrimary [&+div]:checked:bg-actionPrimary
  [&+div>svg]:checked:block
`;

export const defaultCheckboxClassName = `
  w-5 h-5 border border-borderPrimary flex items-center justify-center rounded-md transition
`;

export const roundedCheckboxClassName = 'rounded-full w-4 h-4 [&>svg]:w-2 [&>svg]:h-2';

export const switchInputClassName = `
  invisible absolute inset-1/2
  [&+div]:checked:bg-actionPrimary [&+div]:checked:after:left-[calc(100%-18px)]
`;

export const switchCheckboxClassName = `
  w-8 h-5 bg-slate-300 rounded-[833.33px] relative transition duration-500
  after:content-[''] after:w-4 after:h-4 after:bg-white after:rounded-full after:transition-all
  after:absolute after:top-[2px] after:left-[2px]
`;

export interface SimpleCheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  wrapperClassName?: string;
  view?: CHECKBOX_VIEWS;
}

const checkboxViewsClassNames = {
  [CHECKBOX_VIEWS.default]: {
    input: defaultInputClassName,
    checkbox: defaultCheckboxClassName,
  },
  [CHECKBOX_VIEWS.rounded]: {
    input: defaultInputClassName,
    checkbox: twMerge(defaultCheckboxClassName, roundedCheckboxClassName),
  },
  [CHECKBOX_VIEWS.switch]: {
    input: switchInputClassName,
    checkbox: switchCheckboxClassName,
  },
};

export const SimpleCheckbox = forwardRef<HTMLInputElement, SimpleCheckboxProps>(({
  className,
  wrapperClassName,
  checked,
  view = CHECKBOX_VIEWS.default,
  disabled,
  ...props
}, ref) => (
  <label
    className={twMerge(
      'relative transition',
      !disabled && 'cursor-pointer',
      wrapperClassName
    )}
  >
    <input
      ref={ref}
      type="checkbox"
      className={checkboxViewsClassNames[view].input}
      checked={checked}
      readOnly
      disabled={disabled}
      {...props}
    />
    <div
      className={twMerge(
        checkboxViewsClassNames[view].checkbox,
        className
      )}
    >
      <CheckedIcon className="hidden duration-1000" />
    </div>
  </label>
));

export interface CheckboxProps extends SimpleCheckboxProps {
  name: string;
}

export const Checkbox: FC<CheckboxProps> = ({
  name,
  ...props
}) => {
  const { register } = useFormContext() || {};

  return (
    <SimpleCheckbox
      {...register(name)}
      {...props}
    />
  );
};
