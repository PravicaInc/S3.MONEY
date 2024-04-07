'use client';

import { FC, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { twMerge } from 'tailwind-merge';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';

import { RolesDropdown } from './components/RolesDropdown';

export interface RolesStableCoinData extends Record<string, string> {}

export interface RolesAssignmentProps {
  onSubmit: (data: RolesStableCoinData) => unknown;
  onBack: () => void;
  className?: string;
  defaultValues?: Record<string, string>;
}

export const RolesAssignment: FC<RolesAssignmentProps> = ({
  className,
  onSubmit,
  onBack,
  defaultValues,
  ...props
}) => {
  const account = useCurrentAccount();

  const [values, setValues] = useState<Record<string, string>>({
    pause: (defaultValues?.pause || account?.address) as string,
    freeze: (defaultValues?.freeze || account?.address) as string,
    mint: (defaultValues?.mint || account?.address) as string,
    burn: (defaultValues?.burn || account?.address) as string,
    cashIn: (defaultValues?.cashIn || account?.address) as string,
  });

  return (
    <div
      className={twMerge('', className)}
      {...props}
    >
      <div className="text-primary text-lg font-semibold flex items-center justify-between">
        Roles Assignment
      </div>
      <div className="mt-10 space-y-4 relative">
        <RolesDropdown
          label="Pause/Restart System "
          value={values.pause}
          onChange={value => setValues(currentValues => ({
            ...currentValues,
            pause: value,
            freeze: value,
          }))}
        />
        <RolesDropdown
          label="Mint/Burn"
          value={values.mint}
          onChange={value => setValues(currentValues => ({
            ...currentValues,
            mint: value,
            burn: value,
          }))}
        />
        <RolesDropdown
          label="Cash In"
          value={values.cashIn}
          onChange={value => setValues(currentValues => ({
            ...currentValues,
            cashIn: value,
          }))}
        />
      </div>
      <div className="flex items-center justify-between gap-6 mt-10">
        <Button
          type="button"
          view={BUTTON_VIEWS.secondary}
          className="h-14 w-full"
          onClick={onBack}
        >
          Back
        </Button>
        <Button
          className="h-14 w-full"
          type="submit"
          onClick={() => onSubmit(values)}
        >
          Create
        </Button>
      </div>
    </div>
  );
};
