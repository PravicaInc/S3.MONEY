import { FC, forwardRef, ReactNode, SelectHTMLAttributes } from 'react';
import { useFormContext } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import ChevronIcon from '@/../public/images/chevron.svg?jsx';

import { FormError } from '@/Components/Form/FormError';
import { Label } from '@/Components/Form/Label';

export interface SimpleSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  options: {
    value: string | number,
    label: ReactNode,
  }[],

  isRequired?: boolean;
  className?: string;
  placeholder?: string;
  wrapperClassName?: string;
}

export const SimpleSelect = forwardRef<HTMLSelectElement, SimpleSelectProps>(({
  options,
  isRequired,
  className,
  wrapperClassName,
  placeholder = 'Select ...',
  ...props
}, ref) => (
  <div className={twMerge('relative', wrapperClassName)}>
    <select
      ref={ref}
      className={twMerge(
        'text-primary p-3 rounded-xl border border-borderPrimary',
        'outline-none appearance-none',
        'text-secondary has-[>option:checked:not([value=""])]:text-primary',
        className
      )}
      defaultValue=""
      {...props}
    >
      <option
        value=""
        disabled={isRequired}
        className="text-hitGrey"
      >
        {placeholder}
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
    <ChevronIcon
      className="absolute right-4 top-1/2 -translate-y-1/2"
    />
  </div>
));

export interface SelectProps extends SimpleSelectProps {
  name: string;

  label?: string;
}

export const Select: FC<SelectProps> = ({ name, label, isRequired, ...props }) => {
  const { register, formState: { errors } } = useFormContext();

  return (
    <>
      {
        label && (
          <Label
            label={label}
            isRequired={isRequired}
            className="mb-2"
          />
        )
      }
      <SimpleSelect
        {...register(name)}
        {...props}
        isRequired={isRequired}
      />
      {errors?.[name]?.message && (
        <FormError text={errors?.[name]?.message as string} />
      )}
    </>
  );
};
