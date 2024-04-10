import { ReactNode, SelectHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { FormError } from '../../FormError';

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  name: string;
  options: {
    value: string | number,
    label: ReactNode,
  }[],

  isRequired?: boolean;
  className?: string;
}

export function Select({ name, options, isRequired, className, ...props }: SelectProps) {
  const { register, formState: { errors } } = useFormContext();

  return (
    <>
      <select
        id={name}
        className={twMerge('p-4 border border-blue-200 rounded-lg', className)}
        {...register(name)}
        {...props}
      >
        <option
          value=""
          selected
          disabled={isRequired}
        >
          Select ...
        </option>
        {
          options.map(({ value, label }) => (
            <option
              key={value}
              value={value}
            >
              {label}
            </option>
          ))
        }
      </select>
      {errors?.[name]?.message && (
        <FormError text={errors?.[name]?.message as string} />
      )}
    </>
  );
}