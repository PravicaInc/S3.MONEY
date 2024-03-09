import { FC, InputHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import { FormError } from '@/Components/Form/FormError';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;

  className?: string;
}

export const Input: FC<InputProps> = ({ name, className, ...props }) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <>
      <input
        id={name}
        className={twMerge('p-4 border border-blue-200 rounded-lg', className)}
        {...register(name)}
        {...props}
      />
      {errors?.[name]?.message && (
        <FormError text={errors?.[name]?.message as string} />
      )}
    </>
  );
};
