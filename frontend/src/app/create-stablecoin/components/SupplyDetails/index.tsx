'use client';

import { FC, HTMLAttributes } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Input } from '@/Components/Form/Input';
import { Select } from '@/Components/Form/Select';

import { PAGES_URLS } from '@/utils/const';
import { numberFormat, numberNormalize } from '@/utils/string_formats';

export enum SupplyTypes {
  Infinite = 'infinite',
  Finite = 'finite',
}

export interface SupplyStableCoinData {
  initialSupply: number;
  maxSupply?: number;
  supplyType?: SupplyTypes;
  decimals: number;
}

export interface SupplyDetailsProps extends Omit<HTMLAttributes<HTMLFormElement>, 'onSubmit'> {
  onSubmit: (data: SupplyStableCoinData) => unknown;
}

export const SupplyDetails: FC<SupplyDetailsProps> = ({ className, onSubmit, ...props }) => {
  const supplyDetailsFormSchema = yup.object().shape({
    initialSupply: yup
      .number()
      .typeError('Initial Supply is required.')
      .required('Initial Supply is required.'),
    maxSupply: yup
      .number()
      .typeError('Max supply is required.'),
    supplyType: yup.string().oneOf(
      [SupplyTypes.Infinite, SupplyTypes.Finite],
      'Supply type must be one of the following values: Infinite, Finite'
    ),
    decimals: yup
      .number()
      .typeError('Decimals is required.')
      .required('Decimals is required.'),
  });

  const formMethods = useForm({
    resolver: yupResolver(supplyDetailsFormSchema),
    defaultValues: {
      supplyType: SupplyTypes.Infinite,
    },
  });
  const supplyType = useWatch({
    control: formMethods.control,
    name: 'supplyType',
  });

  return (
    <FormProvider {...formMethods}>
      <form
        className={twMerge('', className)}
        onSubmit={formMethods.handleSubmit(onSubmit)}
        {...props}
      >
        <p className="text-primary text-lg font-semibold">
          Supply Details
        </p>
        <div className="mt-10 space-y-4">
          <div>
            <Input
              name="initialSupply"
              label="Initial Supply"
              isRequired
              placeholder="Initial Supply"
              className="w-full appearance-none"
              setValueAs={value => value ? numberNormalize(value) : value}
              onChange={({ target }) => {
                target.value = target.value ? numberFormat(target.value) : target.value;
              }}
            />
          </div>
          <div>
            <Select
              name="supplyType"
              label="Supply Type"
              options={[
                {
                  value: 'infinite',
                  label: 'Infinite',
                },
                {
                  value: 'finite',
                  label: 'Finite',
                },
              ]}
              placeholder="Infinite/Finite"
              className="w-full"
            />
          </div>
          {
            supplyType === 'finite' && (
              <div>
                <Input
                  name="maxSupply"
                  label="Max Supply"
                  isRequired
                  placeholder="Max Supply"
                  className="w-full appearance-none"
                  setValueAs={value => value ? numberNormalize(value) : value}
                  onChange={({ target }) => {
                    target.value = target.value ? numberFormat(target.value) : target.value;
                  }}
                  shouldUnregister
                />
              </div>
            )
          }
          <div>
            <Input
              name="decimals"
              label="Decimals"
              isRequired
              placeholder="Decimals"
              className="w-full appearance-none"
              setValueAs={value => value ? numberNormalize(value) : value}
              onChange={({ target }) => {
                target.value = target.value ? numberFormat(target.value) : target.value;
              }}
            />
          </div>
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
          >
            Next
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};
