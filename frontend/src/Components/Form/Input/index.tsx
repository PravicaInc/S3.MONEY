import { cloneElement, FC, InputHTMLAttributes, ReactElement, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import NextImage from 'next/image';
import { twMerge } from 'tailwind-merge';

import { StaticImageData } from 'next/dist/shared/lib/get-img-props';

import { FormError } from '@/Components/Form/FormError';

export interface SimpleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactElement | StaticImageData | string;
  wrapperClassName?: string;
}

export const SimpleInput: FC<SimpleInputProps> = ({
  className,
  wrapperClassName,
  icon,
  ...props
}) => {
  const iconWithClass = useMemo(
    () => {
      const classPosition = 'absolute top-1/2 left-3 -translate-y-1/2';

      return typeof icon === 'string' || (icon as unknown as StaticImageData)?.src
        ? (
          <NextImage
            src={icon as StaticImageData | string}
            alt="input icon"
            className={classPosition}
          />
        )
        : cloneElement(icon as ReactElement, { className: classPosition });
    },
    [icon]
  );

  return (
    <div className={twMerge('relative', wrapperClassName)}>
      <input
        className={twMerge(
          'text-primary placeholder:text-[#A4ABB8] p-3 rounded-xl border border-borderPrimary',
          'focus:border-actionPrimary outline-none',
          icon && 'pl-11',
          className
        )}
        {...props}
      />
      {iconWithClass}
    </div>
  );
};

export interface InputProps extends SimpleInputProps {
  name: string;
}

export const Input: FC<InputProps> = ({ name, ...props }) => {
  const { register, formState: { errors } } = useFormContext() || {};

  return (
    <>
      <Input
        id={name}
        {...register(name)}
        {...props}
      />
      {errors?.[name]?.message && (
        <FormError text={errors?.[name]?.message as string} />
      )}
    </>
  );
};
