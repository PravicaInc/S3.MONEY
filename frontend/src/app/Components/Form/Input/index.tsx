import { InputHTMLAttributes } from "react";
import { useFormContext } from "react-hook-form";

import { FormError } from "../../FormError";
import { twMerge } from "tailwind-merge";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  name: string;

  className?: string;
}

export function Input({ name, className, ...props }: InputProps) {
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
}
