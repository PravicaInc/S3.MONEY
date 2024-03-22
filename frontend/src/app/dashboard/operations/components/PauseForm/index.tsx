'use client';

import { FC, HTMLAttributes } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { faPause } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { twMerge } from 'tailwind-merge';

import { Button } from '@/Components/Form/Button';
import { Checkbox } from '@/Components/Form/Checkbox';

export interface PauseFormData {
  approve: boolean;
}

export interface PauseFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: PauseFormData) => unknown;
  defaultValues?: Partial<PauseFormData>;
}

export const PauseForm: FC<PauseFormProps> = ({
  className,
  onSubmit,
  defaultValues,
  ...props
}) => {
  const formMethods = useForm({
    defaultValues: {
      approve: false,
      ...defaultValues,
    },
  });

  const isApprove = formMethods.watch('approve');

  return (
    <FormProvider {...formMethods}>
      <form
        className={twMerge('', className)}
        onSubmit={formMethods.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex items-center gap-4">
          <FontAwesomeIcon icon={faPause} className="h-10" />
          <p className="text-2xl">
            Pause System
          </p>
        </div>
        <p className="mt-1">
          By confirming this, all operations of the system will be paused temporarily such: transfers, burn, mint...etc
        </p>
        <Checkbox
          name="approve"
          label="I am aware about this action circumstances."
          labelClassName="mt-3"
        />
        <Button
          className="h-14 w-full mt-3"
          type="submit"
          disabled={formMethods.formState.isSubmitting || !isApprove}
          isLoading={formMethods.formState.isSubmitting}
        >
          Pause
        </Button>
      </form>
    </FormProvider>
  );
};
