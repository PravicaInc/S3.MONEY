'use client';

import { FC, HTMLAttributes, ReactNode, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { CHECKBOX_VIEWS, SimpleCheckbox } from '@/Components/Form/Checkbox';
import { Input } from '@/Components/Form/Input';
import { Label } from '@/Components/Form/Label';

import { suiAddressRegExp } from '@/utils/validators';

export interface RolesStableCoinData extends Record<string, string> {}

export interface RolesAssignmentProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: RolesStableCoinData) => unknown;
  onBack: () => void;
  fields: {
    fieldName: string;
    label: ReactNode;
  }[];
}

export const RolesAssignment: FC<RolesAssignmentProps> = ({ className, onSubmit, onBack, fields, ...props }) => {
  const walletAddressSchema = yup
    .string()
    .trim()
    .required('Wallet address is required.')
    .matches(suiAddressRegExp, 'Wallet address is incorrect.');
  const rolesAssignmentFormSchema = yup.object().shape(
    fields.reduce(
      (accumulator, next) => ({
        ...accumulator,
        [next.fieldName]: walletAddressSchema,
      }),
      {}
    )
  );

  const account = useCurrentAccount();
  const formMethods = useForm({
    resolver: yupResolver(rolesAssignmentFormSchema),
    defaultValues: useMemo<Record<string, string>>(
      () => fields.reduce(
        (accumulator, next) => ({
          ...accumulator,
          [next.fieldName]: account?.address,
        }),
        {}
      ),
      [fields, account?.address]
    ),
  });

  const values = formMethods.watch() as Record<string, string>;

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
            fields
              .map(({ fieldName, label }) => (
                <div key={fieldName}>
                  <Label
                    label={label}
                    className="mb-2"
                  />
                  <div className="grid grid-cols-4 gap-3">
                    <div
                      className="
                        w-full p-4 rounded-xl border border-borderPrimary col-span-1 h-[50px]
                        flex items-center justify-between text-xs font-semibold cursor-pointer
                      "
                      // @ts-expect-error The name of the field can be any
                      onClick={() => formMethods.setValue(fieldName, account?.address as string)}
                    >
                      Current Account
                      <SimpleCheckbox
                        checked={values?.[fieldName] === account?.address}
                        view={CHECKBOX_VIEWS.smallRounded}
                      />
                    </div>
                    {
                      values?.[fieldName] === account?.address && (
                        <div
                          className="
                            w-full p-4 rounded-xl border border-borderPrimary col-span-3
                            flex items-center justify-between text-xs font-semibold cursor-pointer
                          "
                          onClick={() => {
                            // @ts-expect-error The name of the field can be any
                            formMethods.setValue(fieldName, '');
                            // @ts-expect-error The name of the field can be any
                            formMethods.setFocus(fieldName);
                          }}
                        >
                          Other Account
                          <SimpleCheckbox
                            view={CHECKBOX_VIEWS.smallRounded}
                          />
                        </div>
                      )
                    }
                    <div
                      className={twMerge(
                        'w-full col-span-3 relative',
                        values?.[fieldName] === account?.address && 'absolute -z-10'
                      )}
                    >
                      <Input
                        name={fieldName}
                        className="
                          w-full p-4 text-xs font-semibold
                          placeholder:text-primary placeholder:font-semibold
                        "
                        placeholder="Other Account"
                        maxLength={66}
                      />
                      <SimpleCheckbox
                        view={CHECKBOX_VIEWS.smallRounded}
                        checked
                        wrapperClassName="absolute top-4 right-4"
                      />
                    </div>
                  </div>
                </div>
              ))
          }
        </div>
        <div className="flex items-center justify-between gap-6 mt-10">
          <Button
            view={BUTTON_VIEWS.secondary}
            className="h-14 w-full"
            onClick={onBack}
          >
            Back
          </Button>
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
