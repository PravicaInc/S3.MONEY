'use client';

import { FC, ReactNode, useState } from 'react';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { twMerge } from 'tailwind-merge';

import { Button, BUTTON_VIEWS } from '@/Components/Form/Button';

import { RolesDropdown } from './components/RolesDropdown';

export interface RolesStableCoinData extends Record<string, string> {}

export interface RolesAssignmentProps {
  onSubmit: (data: RolesStableCoinData) => unknown;
  onBack: () => void;
  fields: {
    fieldName: string;
    label: ReactNode;
  }[];
  className?: string;
  defaultValues?: Record<string, string>;
}

export const RolesAssignment: FC<RolesAssignmentProps> = ({
  className,
  onSubmit,
  onBack,
  fields,
  defaultValues,
  ...props
}) => {
  const account = useCurrentAccount();

  const [values, setValues] = useState<Record<string, string>>(fields.reduce(
    (accumulator, next) => ({
      ...accumulator,
      [next.fieldName]: defaultValues?.[next.fieldName] || account?.address,
    }),
    {}
  ));

  return (
    <div
      className={twMerge('', className)}
      {...props}
    >
      <div className="text-primary text-lg font-semibold flex items-center justify-between">
        Roles Assignment
      </div>
      <div className="mt-10 space-y-4 relative">
        {
          fields
            .map(({ fieldName, label }) => (
              <RolesDropdown
                key={fieldName}
                label={label}
                value={values?.[fieldName]}
                onChange={value => setValues(currentValues => ({
                  ...currentValues,
                  [fieldName]: value,
                }))}
              />
            ))
        }
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
