'use client';

import { FC, HTMLAttributes } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { yupResolver } from '@hookform/resolvers/yup';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

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
        className={twMerge('', className)}
        onSubmit={formMethods.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="flex items-center gap-4">
          <FontAwesomeIcon icon={faLock} className="h-10" />
          <p className="text-2xl">
            Freeze Address
          </p>
        </div>
        <p className="mt-1">
          You can freeze the transactions for your token of this particular address.
        </p>
        <Input
          name="address"
          placeholder="Wallet Address.."
          maxLength={66}
          className="w-full mt-3"
        />
        <Button
          className="h-14 w-full mt-3"
          type="submit"
          disabled={formMethods.formState.isSubmitting}
          isLoading={formMethods.formState.isSubmitting}
        >
          Freeze this address
        </Button>
      </form>
    </FormProvider>
  );
};
