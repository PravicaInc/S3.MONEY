'use client';

import { FC, HTMLAttributes } from 'react';
import { FormProvider, useForm, useWatch } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { twMerge } from 'tailwind-merge';
import * as yup from 'yup';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';
import { Input } from '@/Components/Form/Input';
import { Select } from '@/Components/Form/Select';

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
  onBack: (newData: SupplyStableCoinData) => void;
  defaultValues?: Partial<SupplyStableCoinData>;
}

export const SupplyDetails: FC<SupplyDetailsProps> = ({ className, onSubmit, onBack, defaultValues, ...props }) => {
  const supplyDetailsFormSchema = yup.object().shape({
    initialSupply: yup
      .number()
      .typeError('Initial Supply is required.')
      .required('Initial Supply is required.'),
    maxSupply: yup
      .number()
      .typeError('Max Supply is required.')
      .moreThan(yup.ref('initialSupply'), 'The maximum supply should be more than the initial supply.'),
    supplyType: yup.string().oneOf(
      [SupplyTypes.Infinite, SupplyTypes.Finite],
      'Supply type must be one of the following values: Infinite, Finite'
    ),
    decimals: yup
      .number()
      .typeError('Decimals is required.')
      .required('Decimals is required.')
      .max(16, 'Decimals can be up to 16.'),
  });

  const formMethods = useForm({
    resolver: yupResolver(supplyDetailsFormSchema),
    defaultValues: {
      initialSupply: defaultValues?.initialSupply || undefined,
      maxSupply: defaultValues?.maxSupply || undefined,
      supplyType: defaultValues?.supplyType || undefined,
      decimals: defaultValues?.decimals || undefined,
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
              restrictionLabel="99,999,999,999 max"
              isRequired
              placeholder="Initial Supply"
              className="w-full appearance-none"
              setValueAs={value => value ? numberNormalize(value) : value}
              onChange={({ target }) => {
                target.value = target.value ? numberFormat(target.value) : target.value;
              }}
              maxLength={14}
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
              isRequired
            />
          </div>
          {
            supplyType === 'finite' && (
              <div>
                <Input
                  name="maxSupply"
                  label="Max Supply"
                  restrictionLabel="99,999,999,999 max"
                  isRequired
                  placeholder="Max Supply"
                  className="w-full appearance-none"
                  setValueAs={value => value ? numberNormalize(value) : value}
                  onChange={({ target }) => {
                    target.value = target.value ? numberFormat(target.value) : target.value;
                  }}
                  shouldUnregister
                  maxLength={14}
                />
              </div>
            )
          }
          <div>
            <Input
              name="decimals"
              label="Decimals"
              restrictionLabel="16 max"
              isRequired
              placeholder="Decimals"
              className="w-full appearance-none"
              setValueAs={value => value ? numberNormalize(value) : value}
              onChange={({ target }) => {
                target.value = target.value ? numberFormat(target.value) : target.value;
              }}
              maxLength={2}
            />
          </div>
        </div>
        <div className="flex items-center justify-between gap-6 mt-10">
          <Button
            view={BUTTON_VIEWS.secondary}
            className="h-14 w-full"
            onClick={() => onBack(formMethods.getValues())}
            type="button"
          >
            Back
          </Button>
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
