'use client';

import { FC, HTMLAttributes } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import LockIcon from '@/../public/images/lock.svg?jsx';

import { Button } from '@/Components/Form/Button';
import { Input } from '@/Components/Form/Input';

export interface FreezeAddressFormData {
  address: string;
}

export interface FreezeAddressFormProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: FreezeAddressFormData) => unknown;
  defaultValues?: Partial<FreezeAddressFormData>;
}

export const FreezeAddressForm: FC<FreezeAddressFormProps> = ({
  className,
  onSubmit,
  defaultValues,
  ...props
}) => {
  const freezeAddressFormSchema = yup.object().shape({
    address: yup
      .string()
      .trim()
      .required('Wallet address is required.')
      .matches(/^0[xX][a-fA-F0-9]{64}$/, 'Wallet address is incorrect.'),
  });
  const formMethods = useForm({
    resolver: yupResolver(freezeAddressFormSchema),
    defaultValues: {
      address: '',
      ...defaultValues,
    },
  });

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
              <LockIcon />
            </div>
            <p className="text-primary text-xl font-semibold">
              Freeze Address
            </p>
          </div>
          <p className="text-grayText mt-4">
            You can freeze the transactions for your token of this particular address.
          </p>
          <Input
            name="address"
            placeholder="Wallet Address"
            maxLength={66}
            className="w-full mt-4"
          />
        </div>
        <Button
          className="h-[48px] w-full"
          type="submit"
          disabled={formMethods.formState.isSubmitting}
          isLoading={formMethods.formState.isSubmitting}
        >
          Freeze Account
        </Button>
      </form>
    </FormProvider>
  );
};
