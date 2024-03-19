'use client';

import { FC, HTMLAttributes } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCurrentAccount } from '@mysten/dapp-kit';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { CHECKBOX_VIEWS, SimpleCheckbox } from '@/Components/Form/Checkbox';
import { Input } from '@/Components/Form/Input';
import { Label } from '@/Components/Form/Label';

import { PAGES_URLS } from '@/utils/const';

type fieldName = 'cashIn'| 'burn'| 'pause'| 'freeze'| 'cashOut';

export interface RolesStableCoinData extends Record<fieldName, string> {}

export interface RolesAssignmentProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: RolesStableCoinData) => unknown;
}

export const RolesAssignment: FC<RolesAssignmentProps> = ({ className, onSubmit, ...props }) => {
  const walletAddressSchema = yup
    .string()
    .trim()
    .required('Wallet address is required.')
    .matches(/^0[xX][a-fA-F0-9]{64}$/, 'Wallet address is incorrect.');
  const rolesAssignmentFormSchema = yup.object().shape({
    cashIn: walletAddressSchema,
    burn: walletAddressSchema,
    pause: walletAddressSchema,
    freeze: walletAddressSchema,
    cashOut: walletAddressSchema,
  });

  const account = useCurrentAccount();
  const formMethods = useForm({
    resolver: yupResolver(rolesAssignmentFormSchema),
    defaultValues: {
      cashIn: account?.address,
      burn: account?.address,
      pause: account?.address,
      freeze: account?.address,
      cashOut: account?.address,
    } as Record<fieldName, string>,
  });

  const fieldLabels = {
    cashIn: 'Cash In',
    burn: 'Burn',
    pause: 'Pause',
    freeze: 'Freeze',
    cashOut: 'Cash out',
  } as Record<fieldName, string>;

  const values = formMethods.watch();

  return (
    <FormProvider {...formMethods}>
      <form
        className={twMerge('', className)}
        onSubmit={formMethods.handleSubmit(onSubmit)}
        {...props}
      >
        <div className="text-primary text-lg font-semibold flex items-center justify-between">
          Roles Assignment
        </div>
        <div className="mt-10 space-y-4 relative">
          {
            (Object.keys(values) as fieldName[])
              .map(valueName => (
                <div key={valueName}>
                  <Label
                    label={fieldLabels[valueName]}
                    className="mb-2"
                  />
                  <div className="grid grid-cols-4 gap-3">
                    <div
                      className="
                        w-full p-4 rounded-xl border border-borderPrimary col-span-1 h-[50px]
                        flex items-center justify-between text-xs font-semibold cursor-pointer
                      "
                      onClick={() => formMethods.setValue(valueName, account?.address as string)}
                    >
                      Current Account
                      <SimpleCheckbox
                        checked={values?.[valueName] === account?.address}
                        view={CHECKBOX_VIEWS.rounded}
                      />
                    </div>
                    {
                      values?.[valueName] === account?.address && (
                        <div
                          className="
                            w-full p-4 rounded-xl border border-borderPrimary col-span-3
                            flex items-center justify-between text-xs font-semibold cursor-pointer
                          "
                          onClick={() => {
                            formMethods.setValue(valueName, '');
                            formMethods.setFocus(valueName);
                          }}
                        >
                          Other Account
                          <SimpleCheckbox
                            view={CHECKBOX_VIEWS.rounded}
                          />
                        </div>
                      )
                    }
                    <div
                      className={twMerge(
                        'w-full col-span-3 relative',
                        values?.[valueName] === account?.address && 'absolute -z-10'
                      )}
                    >
                      <Input
                        name={valueName}
                        className="
                          w-full p-4 text-xs font-semibold
                          placeholder:text-primary placeholder:font-semibold
                        "
                        placeholder="Other Account"
                      />
                      <SimpleCheckbox
                        view={CHECKBOX_VIEWS.rounded}
                        checked
                        wrapperClassName="absolute top-1/2 -translate-y-1/2 right-4"
                      />
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
        <div className="flex items-center justify-between gap-6 mt-10">
          <Link href={PAGES_URLS.home} className="w-full rounded-xl">
            <Button
              view={BUTTON_VIEWS.secondary}
              className="h-14 w-full"
            >
              Cancel
            </Button>
          </Link>
          <Button
            className="h-14 w-full"
            type="submit"
            disabled={formMethods.formState.isSubmitting}
            isLoading={formMethods.formState.isSubmitting}
          >
            Create
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
