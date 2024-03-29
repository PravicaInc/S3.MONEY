import { cloneElement, FC, forwardRef, InputHTMLAttributes, ReactElement, ReactNode, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import NextImage from 'next/image';
import { twMerge } from 'tailwind-merge';

import { StaticImageData } from 'next/dist/shared/lib/get-img-props';

import { secondaryButtonClasses } from '@/Components/Form/Button';
import { FormError } from '@/Components/Form/FormError';
import { Label } from '@/Components/Form/Label';

export interface SimpleInputProps extends InputHTMLAttributes<HTMLInputElement> {
  icon?: ReactElement | StaticImageData | string;
  wrapperClassName?: string;
  fileButtonText?: string;
  description?: string;
  suffix?: ReactNode;
}

export const SimpleInput = forwardRef<HTMLInputElement, SimpleInputProps>(({
  className,
  wrapperClassName,
  icon,
  type = 'text',
  fileButtonText = 'Choose',
  description,
  suffix,
  ...props
}, ref) => {
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
        : icon && cloneElement(icon as ReactElement, { className: classPosition });
    },
    [icon]
  );

  switch (type) {
    case 'file':
      return (
        <div className={twMerge('flex items-center gap-3', wrapperClassName)}>
          <label
            className={twMerge(
              'cursor-pointer h-10 w-20 text-xs',
              secondaryButtonClasses
            )}
          >
            {fileButtonText}
            <input
              ref={ref}
              type={type}
              className="hidden"
              {...props}
            />
          </label>
          <span className="text-secondary text-sm">
            {description}
          </span>
        </div>
      );
    default:
      return (
        <div className={twMerge('relative', wrapperClassName)}>
          <input
            ref={ref}
            type={type}
            className={twMerge(
              'text-primary placeholder:text-hitGrey p-3 rounded-xl border border-borderPrimary',
              'focus:border-actionPrimary outline-none disabled:text-[#787878] disabled:bg-white',
              icon && 'pl-11',
              className
            )}
            {...props}
          />
          {iconWithClass}
          {
            suffix && (
              <span className="font-medium text-sm text-primary absolute top-1/2 right-4 -translate-y-1/2">
                {suffix}
              </span>
            )
          }
        </div>
      );
  }
});

export interface InputProps extends SimpleInputProps {
  name: string;
  label?: ReactNode;
  labelClassName?: string;
  restrictionLabel?: ReactNode;
  isRequired?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setValueAs?: (value: any) => any;
  shouldUnregister?: boolean;
}

export const Input: FC<InputProps> = ({
  name,
  label,
  labelClassName,
  restrictionLabel,
  isRequired,
  setValueAs,
  onChange,
  className,
  shouldUnregister,
  ...props
}) => {
  const { register, formState: { errors } } = useFormContext() || {};

  return (
    <>
      <div
        className={twMerge(
          'flex items-center justify-between',
          label && !restrictionLabel && 'justify-start',
          !label && restrictionLabel && 'justify-end',
          label && restrictionLabel && 'justify-between',
          (label || restrictionLabel) && 'mb-2'
        )}
      >
        {
          label && (
            <Label
              label={label}
              className={labelClassName}
              isRequired={isRequired}
            />
          )
        }
        {
          restrictionLabel && (
            <Label
              label={restrictionLabel}
              className="text-xs"
            />
          )
        }
      </div>
      <SimpleInput
        id={name}
        className={twMerge(
          errors?.[name]?.message && 'text-error border-error',
          className
        )}
        {...register(name, {
          setValueAs,
          onChange,
          shouldUnregister,
        })}
        {...props}
      />
      {errors?.[name]?.message && (
        <FormError text={errors?.[name]?.message as string} />
      )}
    </>
  );
};
