'use client';

import { FC, HTMLAttributes } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

import PauseIcon from '@/../public/images/pause.svg?jsx';

import { Button } from '@/Components/Form/Button';
import { Checkbox, CHECKBOX_VIEWS } from '@/Components/Form/Checkbox';

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
        className={twMerge(
          'border border-borderPrimary rounded-xl bg-white p-5 flex flex-col justify-between gap-3',
          className
        )}
        onSubmit={formMethods.handleSubmit(onSubmit)}
        {...props}
      >
        <div>
          <div className="flex items-center gap-4">
            <div
              className="bg-antiqueWhite w-10 h-10 flex items-center justify-center rounded-full shadow-operationIcon"
            >
              <PauseIcon />
            </div>
            <p className="text-primary text-xl font-semibold">
              Pause System
            </p>
          </div>
          <p className="text-grayText mt-6">
            By confirming this, all operations of the system will be paused temporarily such:
            transfers, burn, mint...etc
          </p>
        </div>
        <div>
          <Checkbox
            name="approve"
            label="I am aware about this action circumstances."
            view={CHECKBOX_VIEWS.rounded}
          />
          <Button
            className="h-12 w-full mt-6"
            type="submit"
            disabled={formMethods.formState.isSubmitting || !isApprove}
            isLoading={formMethods.formState.isSubmitting}
          >
            Pause
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
